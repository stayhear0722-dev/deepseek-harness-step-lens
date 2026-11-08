/** Serve bounded, in-memory translation through Harness's authenticated local connection. */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isAbsolute } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const workerScript = fileURLToPath(new URL('./src/offline-translation.py', import.meta.url));
const pythonPathFile = new URL('./translation-runtime/python-path.txt', import.meta.url);
const maxTexts = 8;
const maxTextLength = 400;
const maxRequestBytes = 24 * 1024;
const maxPending = 4;
const timeoutMs = 25000;

export const inject = ['connection'];

function failed(reason) {
  return { ok: false, error: { code: 'step-lens/' + reason, message: 'Local translation ' + reason, details: {} } };
}

function createLocalTranslator() {
  let current;
  let requestId = 0;

  function close(state, reason) {
    if (current !== state) return;
    current = undefined;
    state.reader.close();
    state.child.kill();
    for (const complete of state.pending.values()) complete(failed(reason));
  }

  function start() {
    const pythonPath = readFileSync(pythonPathFile, 'utf8').trim();
    if (!isAbsolute(pythonPath)) throw new Error('Invalid translation runtime path');
    const child = spawn(pythonPath, ['-I', '-B', '-u', workerScript], {
      stdio: ['pipe', 'pipe', 'ignore'],
      windowsHide: true,
    });
    const reader = createInterface({ input: child.stdout, crlfDelay: Infinity });
    const state = { child, reader, pending: new Map() };
    current = state;

    reader.on('line', (line) => {
      try {
        const result = JSON.parse(line);
        const complete = state.pending.get(result.id);
        if (complete) complete(Array.isArray(result.translations)
          ? { ok: true, value: result.translations }
          : failed('failed'));
      } catch {
        close(state, 'failed');
      }
    });
    child.once('error', () => close(state, 'unavailable'));
    child.once('exit', () => close(state, 'unavailable'));
    child.stdin.on('error', () => close(state, 'unavailable'));
    return state;
  }

  function translate(texts, signal) {
    if (signal?.aborted) return Promise.resolve(failed('cancelled'));
    let state;
    try {
      state = current ?? start();
    } catch {
      return Promise.resolve(failed('unavailable'));
    }
    if (state.pending.size >= maxPending) return Promise.resolve(failed('busy'));

    return new Promise((resolve) => {
      const id = ++requestId;
      const timer = setTimeout(() => close(state, 'timed-out'), timeoutMs);
      const cancel = () => resolve(failed('cancelled'));
      signal?.addEventListener('abort', cancel, { once: true });
      state.pending.set(id, (result) => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', cancel);
        state.pending.delete(id);
        const valid = !result.ok || (result.value.length === texts.length &&
          result.value.every((text) => typeof text === 'string' && text.length <= 800));
        resolve(valid ? result : failed('failed'));
      });
      state.child.stdin.write(JSON.stringify({ id, texts }) + '\n');
    });
  }

  return { translate, dispose: () => current && close(current, 'unavailable') };
}

async function readTexts(request) {
  if (!request.body || !/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) {
    return null;
  }
  const reader = request.body.getReader();
  const chunks = [];
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxRequestBytes) {
        void reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
    const texts = JSON.parse(Buffer.concat(chunks).toString('utf8'))?.texts;
    return Array.isArray(texts) && texts.length > 0 && texts.length <= maxTexts &&
      texts.every((text) => typeof text === 'string' && text.trim() && text.length <= maxTextLength)
      ? texts
      : null;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export function apply(ctx) {
  const translator = createLocalTranslator();
  ctx.effect(() => translator.dispose);
  // Connection gates exact Fetch routes to authenticated owner peers.
  ctx.connection.fetch.register({
    path: '/api/step-lens-translate',
    methods: ['POST'],
    requestBody: 'streaming',
    async fetch(request) {
      const texts = request.signal.aborted ? null : await readTexts(request);
      const result = request.signal.aborted
        ? failed('cancelled')
        : texts
          ? await translator.translate(texts, request.signal)
          : failed('invalid-request');
      return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
    },
  });
}
