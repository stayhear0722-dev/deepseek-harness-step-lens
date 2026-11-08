import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { apply } from '../index.js';

function createTranslationRoute(testContext) {
  let route;
  apply({
    effect(setup) { testContext.after(setup()); },
    connection: { fetch: { register(definition) {
      route = definition;
    } } },
  });
  assert.equal(route.path, '/api/step-lens-translate');
  assert.deepEqual(route.methods, ['POST']);
  assert.equal(route.requestBody, 'streaming');
  return async (payload, signal) => {
    const reply = await route.fetch(new Request('http://localhost' + route.path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    }));
    assert.equal(reply.headers.get('Cache-Control'), 'no-store');
    return reply.json();
  };
}

test('translation accepts only short batches within the body limit', async (t) => {
  const call = createTranslationRoute(t);
  const sample = { texts: ['Read the file to check its settings.'] };
  assert.equal((await call({ texts: ['x'.repeat(401)] })).error.code, 'step-lens/invalid-request');
  assert.equal((await call({ texts: Array(9).fill('Read the file.') })).error.code, 'step-lens/invalid-request');
  assert.equal((await call({ ...sample, padding: 'x'.repeat(25000) })).error.code, 'step-lens/invalid-request');
  assert.equal((await call(sample, AbortSignal.abort())).error.code, 'step-lens/cancelled');
});

test('installed offline worker returns Chinese for recorded English excerpts', {
  skip: !existsSync(new URL('../translation-runtime/python-path.txt', import.meta.url)),
}, async (t) => {
  const call = createTranslationRoute(t);
  const texts = [
    'Read the configuration first to verify the existing settings.',
    'Run the tests to confirm the workflow is still in the correct order.',
  ];
  const reply = await call({ texts }, AbortSignal.timeout(30000));
  assert.equal(reply.ok, true, reply.error?.code);
  assert.equal(reply.value.length, texts.length);
  for (const translation of reply.value) assert.match(translation, /\p{Script=Han}/u);
});
