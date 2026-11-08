/**
 * Pure turn-aware model for AI Step Lens.
 *
 * The panel is organized by conversation turn (one user request = one turn):
 * every turn owns its steps, every step owns its reasoning, tool calls and
 * answer output. This module is DOM-free so the whole structure can be tested
 * under Node before it is compiled into the browser bundle.
 */

/** Category glyphs used by the timeline and the turn summaries. */
export const CATEGORY_ICON = {
  read: '📖',
  search: '🔍',
  write: '✏️',
  run: '⚡',
  web: '🌐',
  collab: '👥',
  deliver: '📦',
  other: '🔧',
};

/** Category glyph with a safe fallback for tools missing from the guide. */
export function categoryIcon(category) {
  return CATEGORY_ICON[category] || '🔧';
}

/** Read one localized string from `{ zh, en }` content, falling back safely. */
export function pick(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.zh || value.en || '';
}

/** Flatten LLM content blocks into display text (text blocks only). */
export function textOfContent(content) {
  if (!Array.isArray(content)) return '';
  const parts = [];
  for (const block of content) {
    if (!block) continue;
    if (typeof block === 'string') {
      parts.push(block);
      continue;
    }
    if (typeof block.text === 'string') parts.push(block.text);
  }
  return parts.join('\n');
}

/** Parse a tool call's raw argument JSON without ever throwing. */
export function parseArgs(raw, fallback) {
  if (typeof raw === 'string' && raw.trim() !== '') {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch (error) {
      // Partial or invalid JSON while a call is still being prepared: keep going.
    }
  }
  return fallback && typeof fallback === 'object' ? fallback : {};
}

/** Clip a string to a maximum length, appending an ellipsis when shortened. */
export function clip(text, max) {
  const source = typeof text === 'string' ? text : text == null ? '' : String(text);
  if (max <= 0 || source.length <= max) return source;
  return source.slice(0, max) + '…';
}

/** First non-empty line of a multi-line string, clipped. */
export function firstLine(text, max) {
  const source = typeof text === 'string' ? text : '';
  const line = source.split(/\r?\n/).find((candidate) => candidate.trim() !== '') || '';
  return clip(line.trim(), max);
}

/** Last path segment of a Windows or POSIX path. */
export function basename(path) {
  if (typeof path !== 'string' || path === '') return '';
  const parts = path.split(/[\\/]/).filter(Boolean);
  return parts.length === 0 ? path : parts[parts.length - 1];
}

/** Render one argument value as a compact subject string. */
function formatValue(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    if (typeof value[0] === 'string') return value.map((item) => String(item)).join(' / ');
    if (value[0] && typeof value[0] === 'object' && typeof value[0].path === 'string') {
      return value.map((item) => basename(item.path)).join('、');
    }
    return '× ' + value.length;
  }
  if (typeof value === 'object') {
    if (typeof value.path === 'string') return value.path;
    if (typeof value.name === 'string') return value.name;
    return '';
  }
  return '';
}

/** Preferred argument fields per tool, most human-readable first. */
const SUBJECT_FIELDS = {
  read: ['file_path'],
  write: ['file_path'],
  edit: ['file_path'],
  read_image: ['file_path'],
  glob: ['pattern'],
  grep: ['pattern'],
  pwsh: ['description', 'command'],
  bash: ['description', 'command'],
  working_directory: ['cd'],
  web_search: ['queries'],
  web_fetch: ['url'],
  skill: ['name'],
  present: ['files'],
  subagent: ['description'],
  subagent_fork: ['description'],
  workflow: ['name'],
  spawn_teammate: ['name'],
  send_message: ['target', 'message'],
  interrupt_agent: ['target'],
  job_output: ['job_id'],
  job_kill: ['job_id'],
  schedule_create: ['title'],
  schedule_update: ['id'],
  schedule_delete: ['id'],
  session_search: ['query'],
  session_event_read: ['query'],
  session_event_search: ['query'],
  session_event_trace: ['query'],
  session_trace: ['query'],
  create_goal: ['objective'],
  update_goal: ['action'],
  team_task_create: ['subject'],
  team_task_get: ['task_id'],
  team_task_update: ['task_id'],
  cordis_inspect_query: ['provider'],
  cordis_run: ['pluginId'],
  cordis_define: ['id'],
  ask_user_question: ['header'],
  terminal_open: ['name'],
  terminal_read: ['terminal_id'],
  terminal_signal: ['terminal_id'],
  terminal_close: ['terminal_id'],
  lsp: ['operation'],
};

const FALLBACK_FIELDS = [
  'file_path', 'path', 'pattern', 'url', 'query', 'queries', 'description',
  'command', 'name', 'title', 'id', 'objective', 'provider', 'target', 'subject',
];

/** Derive the concrete subject a tool call operates on (file, query, command…). */
export function subjectOf(name, args) {
  const object = args && typeof args === 'object' ? args : {};
  const fields = SUBJECT_FIELDS[name] || FALLBACK_FIELDS;
  for (const field of fields) {
    const text = formatValue(object[field]);
    if (text !== '') {
      const normalized = field === 'command' ? firstLine(text, 110) : text;
      return clip(normalized, field === 'description' || field === 'command' ? 110 : 90);
    }
  }
  return '';
}

/** Keep tool requests in place while merging adjacent text fragments. */
function assistantRuns(blocks) {
  const runs = [];
  for (const block of Array.isArray(blocks) ? blocks : []) {
    if (!block || typeof block !== 'object') continue;
    if (block.kind === 'tool-call') {
      runs.push({ kind: 'tool-call', block });
      continue;
    }
    const kind = block.kind === 'reasoning' ? 'reasoning' : block.kind === 'text' ? 'text' : null;
    if (kind == null) continue;
    const text = typeof block.text === 'string' ? block.text : '';
    if (text.trim() === '') continue;
    const previous = runs[runs.length - 1];
    if (previous && previous.kind === kind) previous.text += '\n' + text;
    else runs.push({ kind, text });
  }
  return runs;
}

/** Merge consecutive assistant blocks into reasoning / text runs. */
export function splitBlocks(blocks) {
  return assistantRuns(blocks).filter((run) => run.kind !== 'tool-call');
}

/** Pretty-print arguments for the raw-details disclosure. */
function argsTextOf(rawArgs, args) {
  if (typeof rawArgs === 'string' && rawArgs.trim() !== '') return clip(rawArgs, 4000);
  try {
    return clip(JSON.stringify(args, null, 2), 4000);
  } catch (error) {
    return '';
  }
}

function toolStartTime(tool) {
  return tool.result?.callTime ?? tool.running?.time ?? null;
}

/** Index the available representations of each call, including explicit child calls. */
function indexTools(nodes, liveCalls, partial) {
  const tools = new Map();
  function ensureTool(callId) {
    if (!tools.has(callId)) {
      tools.set(callId, { callId, parentCallId: null, children: [], priorReasoning: '', requestTime: null });
    }
    return tools.get(callId);
  }
  function registerSource(source, fallbackId, parentCallId) {
    if (!source || typeof source !== 'object') return;
    const tool = ensureTool(source.callId || fallbackId);
    const parentId = source.parentCallId || parentCallId;
    if (parentId && parentId !== tool.callId) tool.parentCallId = parentId;
    if (source.kind === 'tool-result') tool.result = source;
    else if (source.phase) tool.running = source;
    else tool.nestedRequest = source;
    if (!Array.isArray(source.subCalls)) return;
    source.subCalls.forEach((child, index) => registerSource(child, tool.callId + '-child-' + index, tool.callId));
  }
  function registerRequests(node, streaming = false) {
    if (!Array.isArray(node?.blocks)) return;
    for (const block of node.blocks) {
      if (block?.kind !== 'tool-call' || !block.callId) continue;
      const tool = ensureTool(block.callId);
      if (streaming) tool.streamingRequest = true;
      if (tool.request) continue;
      tool.request = block;
      tool.requestTime = typeof node.time === 'number' ? node.time : null;
      tool.interrupted = node.interrupted === true;
    }
  }
  for (const node of nodes) {
    if (node?.kind === 'assistant') registerRequests(node);
    if (node?.kind === 'tool-result') registerSource(node, 'call-' + node.seq, null);
  }
  for (const call of liveCalls) registerSource(call, call.callId, null);
  registerRequests(partial, true);

  for (const tool of tools.values()) {
    const parent = tools.get(tool.parentCallId);
    if (parent) parent.children.push(tool);
  }
  return tools;
}

/** Combine a request, live call, and recorded outcome into a single action. */
function makeToolItem(tool, guide, lang, live) {
  const { callId, result, running, parentCallId, priorReasoning } = tool;
  const request = tool.request || tool.nestedRequest;
  const name = result?.name || result?.call?.name || running?.name || request?.name || 'tool';
  const rawArgs = result?.call?.argsRaw || running?.argsRaw || request?.argsRaw || '';
  const args = parseArgs(rawArgs, result?.args ?? running?.args);
  const meta = guide && guide.tools ? guide.tools[name] : null;
  const category = meta && typeof meta.category === 'string' ? meta.category : 'other';
  let status = 'unknown';
  if (result) status = result.error?.code === 'interrupted' ? 'interrupted' : result.isError ? 'error' : 'ok';
  else if (running?.phase === 'start' && live) status = 'running';
  else if (tool.interrupted) status = 'interrupted';
  else if (live && (running?.phase === 'preparing' || tool.streamingRequest)) status = 'pending';
  const duration = typeof result?.callTime === 'number' && typeof result?.time === 'number'
    ? Math.max(0, result.time - result.callTime)
    : null;
  const children = tool.children.map((child) => makeToolItem(child, guide, lang, live && !result));
  return {
    key: 'tool-' + callId,
    kind: 'tool',
    group: 'tool',
    icon: categoryIcon(category),
    category,
    callId,
    parentCallId,
    name,
    title: meta ? pick(meta.title, lang) : name,
    subject: subjectOf(name, args),
    what: meta ? pick(meta.what, lang) : '',
    why: meta ? pick(meta.why, lang) : '',
    args,
    description: typeof args.description === 'string' ? args.description.trim() : '',
    priorReasoning,
    status,
    duration,
    time: toolStartTime(tool) ?? tool.requestTime ?? result?.time ?? null,
    argsText: argsTextOf(rawArgs, args),
    result: textOfContent(result?.content),
    error: result?.error
      ? [result.error.name, result.error.code, result.error.reason].filter(Boolean).join(' · ')
      : '',
    subCalls: children.reduce((count, child) => count + 1 + child.subCalls, 0),
    children,
  };
}

function toolErrors(item) {
  if (item.kind !== 'tool') return 0;
  return item.children.reduce((count, child) => count + toolErrors(child), Number(item.status === 'error'));
}

function assistantTextItem(run, index, node, streaming) {
  const seq = typeof node.seq === 'number' ? node.seq : 0;
  const reasoning = run.kind === 'reasoning';
  const prefix = reasoning ? 'think-' : 'answer-';
  return {
    key: streaming ? 'partial-' + prefix + index : prefix + seq + '-' + index,
    kind: reasoning ? 'think' : 'message',
    group: reasoning ? 'think' : 'answer',
    icon: reasoning ? '🧠' : '💬',
    text: run.text,
    streaming,
    interrupted: node.interrupted === true,
    time: typeof node.time === 'number' ? node.time : null,
  };
}

/** Turn one durable event into its display notes. */
function noteItems(node) {
  const seq = typeof node.seq === 'number' ? node.seq : 0;
  const time = typeof node.time === 'number' ? node.time : null;

  if (node.kind === 'steering') {
    const text = textOfContent(node.content);
    if (text.trim() === '') return [];
    return [
      {
        key: 'steer-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '💬',
        noteKind: 'steering',
        text,
        detail: '',
        tone: 'neutral',
        time,
      },
    ];
  }

  if (node.kind === 'context') {
    const producer = node.producer;
    const producerLabel =
      typeof producer === 'string'
        ? producer
        : producer && typeof producer === 'object'
          ? producer.name || producer.title || producer.role || ''
          : '';
    return [
      {
        key: 'note-context-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '🧩',
        noteKind: 'context',
        text: typeof producerLabel === 'string' ? producerLabel : '',
        detail: textOfContent(node.content),
        tone: 'neutral',
        time,
      },
    ];
  }

  if (node.kind === 'command') {
    const name = typeof node.name === 'string' ? node.name : '';
    const args = typeof node.args === 'string' ? node.args : '';
    return [
      {
        key: 'note-command-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '⌘',
        noteKind: 'command',
        text: (name + ' ' + args).trim(),
        detail: node.outcome && typeof node.outcome.text === 'string' ? node.outcome.text : '',
        tone: node.outcome && node.outcome.kind === 'error' ? 'warn' : 'neutral',
        time,
      },
    ];
  }

  if (node.kind === 'compaction') {
    return [
      {
        key: 'note-compaction-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '🗜️',
        noteKind: 'compaction',
        text: '',
        count: typeof node.shadowedItemCount === 'number' ? node.shadowedItemCount : null,
        detail: typeof node.summary === 'string' ? node.summary : '',
        tone: 'neutral',
        time,
      },
    ];
  }

  if (node.kind === 'model-retry') {
    const current = node.current && typeof node.current === 'object' ? node.current : null;
    const attempts = Array.isArray(node.attempts) ? node.attempts : null;
    return [
      {
        key: 'note-retry-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '📡',
        noteKind: 'retry',
        text:
          (current && (current.message || current.code || current.reason)) ||
          (node.retryState === 'cancelled' ? 'cancelled' : ''),
        count: attempts ? attempts.length : null,
        detail: '',
        tone: 'warn',
        time,
      },
    ];
  }

  if (node.kind === 'turn-error') {
    return [
      {
        key: 'note-error-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '⚠️',
        noteKind: 'error',
        text: node.message || node.code || '',
        detail: '',
        tone: 'error',
        time,
      },
    ];
  }

  if (node.kind === 'turn-max-tokens') {
    return [
      {
        key: 'note-maxtokens-' + seq,
        kind: 'note',
        group: 'misc',
        icon: '📏',
        noteKind: 'maxTokens',
        text: '',
        detail: '',
        tone: 'warn',
        time,
      },
    ];
  }

  return [
    {
      key: 'note-unknown-' + seq,
      kind: 'note',
      group: 'misc',
      icon: '🔎',
      noteKind: 'unknown',
      text: typeof node.type === 'string' ? node.type : '',
      detail: '',
      tone: 'neutral',
      time,
    },
  ];
}

const PHASE_OF_CATEGORY = {
  read: 'collect',
  search: 'collect',
  web: 'collect',
  write: 'modify',
  run: 'verify',
  deliver: 'deliver',
  collab: 'collab',
  other: 'other',
};

const PHASE_ORDER = ['collect', 'modify', 'verify', 'deliver', 'collab', 'other'];

function emptyCategoryCounts() {
  return { read: 0, search: 0, write: 0, run: 0, web: 0, collab: 0, deliver: 0, other: 0 };
}

function summarizeCategories(categoryCounts) {
  const phases = [];
  for (const phase of PHASE_ORDER) {
    let count = 0;
    for (const category of Object.keys(categoryCounts)) {
      if (PHASE_OF_CATEGORY[category] === phase) count += categoryCounts[category] || 0;
    }
    if (count > 0) phases.push({ phase, count });
  }
  return phases;
}

function lastItemOfKind(items, kind) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index] && items[index].kind === kind) return items[index];
  }
  return null;
}

function findTurnDescriptorIndex(descriptors, turn) {
  for (let index = 0; index < descriptors.length; index += 1) {
    if (descriptors[index].turn === turn) return index;
  }
  return -1;
}

/** Human duration for one step (`0.4s`, `12s`, `2m 05s`). */
export function formatDuration(ms, lang) {
  if (typeof ms !== 'number' || !isFinite(ms) || ms < 0) return '';
  if (ms < 1000) return lang === 'zh' ? ms + ' 毫秒' : ms + 'ms';
  if (ms < 60000) {
    const seconds = ms / 1000;
    return lang === 'zh' ? seconds.toFixed(1) + ' 秒' : seconds.toFixed(1) + 's';
  }
  return formatClock(ms, lang);
}

/** Human duration for a whole turn (`1m 20s` / `1 分 20 秒`). */
export function formatClock(ms, lang) {
  if (typeof ms !== 'number' || !isFinite(ms) || ms < 0) ms = 0;
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (lang === 'zh') {
    if (minutes === 0) return seconds + ' 秒';
    return minutes + ' 分 ' + String(seconds).padStart(2, '0') + ' 秒';
  }
  if (minutes === 0) return seconds + 's';
  return minutes + 'm ' + String(seconds).padStart(2, '0') + 's';
}

/**
 * Build the whole turn-organized model from one Chat snapshot.
 *
 * @param {object} state - `nodes`, `runningCalls`, `partial`, `timeline` from the
 *   conversation snapshot, the active language, and the tool guide.
 * @returns {{turns: Array<object>}} turns in ascending order; the last one is current.
 */
export function buildTurnModel(state) {
  const input = state && typeof state === 'object' ? state : {};
  const nodes = Array.isArray(input.nodes) ? input.nodes : [];
  const runningCalls = Array.isArray(input.runningCalls) ? input.runningCalls : [];
  const partial = input.partial && typeof input.partial === 'object' ? input.partial : null;
  const timeline = input.timeline && typeof input.timeline === 'object' ? input.timeline : null;
  const guide = input.guide && typeof input.guide === 'object' ? input.guide : { tools: {} };
  const lang = input.lang === 'zh' ? 'zh' : 'en';

  // Calls that already have a result must not be rendered twice.
  const settledCallIds = new Set();
  for (const node of nodes) {
    if (node && node.kind === 'tool-result' && typeof node.callId === 'string') settledCallIds.add(node.callId);
  }
  const liveCalls = runningCalls.filter(
    (call) => call && typeof call === 'object' && typeof call.callId === 'string' && !settledCallIds.has(call.callId),
  );

  // ---------------------------------------------------------------- turn list
  const descriptors = [];
  const seen = new Set();
  function pushTurn(turn, location = null) {
    if (typeof turn !== 'number' || seen.has(turn)) return;
    seen.add(turn);
    descriptors.push({ turn, location });
  }
  if (timeline && Array.isArray(timeline.turnOrder) && timeline.turnOrder.length > 0) {
    for (const turn of timeline.turnOrder) {
      const location =
        timeline.turns && typeof timeline.turns.get === 'function' ? timeline.turns.get(turn) : null;
      pushTurn(turn, location);
    }
  }
  for (const node of nodes) {
    if (node?.kind === 'assistant' || node?.kind === 'turn-error') pushTurn(node.turn);
  }
  for (const call of liveCalls) pushTurn(call.turn);
  if (partial) pushTurn(partial.turn);
  if (descriptors.length === 0 && (nodes.length > 0 || liveCalls.length > 0 || partial)) {
    pushTurn(1);
  }
  descriptors.sort((left, right) => left.turn - right.turn);

  descriptors.forEach((descriptor, index) => {
    const location = descriptor.location;
    descriptor.startSeq =
      location && location.start && typeof location.start.seq === 'number' ? location.start.seq : null;
    descriptor.endSeq =
      location && location.end && typeof location.end.seq === 'number' ? location.end.seq : null;
    descriptor.startTime =
      location && location.start && typeof location.start.time === 'number' ? location.start.time : null;
    descriptor.endTime =
      location && location.end && typeof location.end.time === 'number' ? location.end.time : null;
    descriptor.status = location && typeof location.status === 'string' ? location.status : null;
    descriptor.lower = descriptor.startSeq;
    const next = descriptors[index + 1];
    descriptor.upper = next && next.startSeq !== null ? next.startSeq - 1 : Infinity;
    if (descriptor.lower === null) {
      if (index === 0) descriptor.lower = -Infinity;
      else {
        const previous = descriptors[index - 1];
        descriptor.lower = previous.endSeq !== null ? previous.endSeq : previous.lower;
      }
    }
  });

  function descriptorIndexForSeq(seq, kind) {
    if (typeof seq !== 'number') return -1;
    if (kind === 'user') {
      let bestIndex = -1;
      let bestSeq = Infinity;
      for (let index = 0; index < descriptors.length; index += 1) {
        const startSeq = descriptors[index].startSeq;
        if (startSeq !== null && startSeq > seq && startSeq < bestSeq) {
          bestIndex = index;
          bestSeq = startSeq;
        }
      }
      // A loaded assistant message can identify a turn with a missing start.
      for (const peer of nodes) {
        if (
          peer &&
          peer.kind === 'assistant' &&
          typeof peer.seq === 'number' &&
          typeof peer.turn === 'number' &&
          peer.seq > seq &&
          peer.seq < bestSeq
        ) {
          bestSeq = peer.seq;
          bestIndex = findTurnDescriptorIndex(descriptors, peer.turn);
        }
      }
      if (bestIndex >= 0) return bestIndex;
      return descriptors.length - 1;
    }
    for (let index = descriptors.length - 1; index >= 0; index -= 1) {
      const descriptor = descriptors[index];
      if (descriptor.startSeq !== null && descriptor.startSeq <= seq) {
        if (seq <= descriptor.upper) return index;
        if (index === descriptors.length - 1) return index;
      }
    }
    // No turn/start coordinates in the loaded window: infer from the previous assistant message.
    let bestIndex = -1;
    let bestSeq = -Infinity;
    for (const peer of nodes) {
      if (
        peer &&
        peer.kind === 'assistant' &&
        typeof peer.seq === 'number' &&
        typeof peer.turn === 'number' &&
        peer.seq <= seq &&
        peer.seq > bestSeq
      ) {
        bestSeq = peer.seq;
        bestIndex = findTurnDescriptorIndex(descriptors, peer.turn);
      }
    }
    if (bestIndex >= 0) return bestIndex;
    return descriptors.length > 0 ? 0 : -1;
  }

  function descriptorIndexForNode(node) {
    if (!node || typeof node !== 'object') return -1;
    if (typeof node.turn === 'number') {
      const index = findTurnDescriptorIndex(descriptors, node.turn);
      if (index >= 0) return index;
    }
    return descriptorIndexForSeq(node.seq, node.kind);
  }

  // -------------------------------------------------------------- turn groups
  const groups = descriptors.map(() => ({ nodes: [], goalNodes: [] }));
  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue;
    const index = descriptorIndexForNode(node);
    if (index < 0) continue;
    if (node.kind === 'user') groups[index].goalNodes.push(node);
    else groups[index].nodes.push(node);
  }

  const latestIndex = descriptors.length - 1;
  const latest = descriptors[latestIndex];
  const mayBeLive = !!latest && latest.status !== 'closed' && latest.endSeq === null &&
    !groups[latestIndex].nodes.some((node) => node.kind === 'turn-error');
  const activePartial = mayBeLive && partial?.turn === latest.turn ? partial : null;
  const tools = indexTools(nodes, liveCalls, activePartial);
  const isRootTool = (tool) => tool && !tools.has(tool.parentCallId);

  // --------------------------------------------------------------- turn build
  const turns = descriptors.map((descriptor, turnIndex) => {
    const location = descriptor.location;
    const stepLocations = location && Array.isArray(location.steps) ? location.steps : null;
    const steps = new Map();
    const isCurrent = turnIndex === latestIndex;
    const canRun = isCurrent && mayBeLive;
    const turnPartial = isCurrent ? activePartial : null;

    function ensureStep(stepNumber) {
      if (!steps.has(stepNumber)) {
        steps.set(stepNumber, {
          step: stepNumber,
          startSeq: null,
          endSeq: null,
          startTime: null,
          endTime: null,
          lower: null,
          upper: null,
          status: 'unknown',
          items: [],
        });
      }
      return steps.get(stepNumber);
    }

    if (stepLocations && stepLocations.length > 0) {
      stepLocations.forEach((stepLocation, index) => {
        const entry = ensureStep(stepLocation.step);
        entry.startSeq =
          stepLocation.start && typeof stepLocation.start.seq === 'number' ? stepLocation.start.seq : null;
        entry.endSeq =
          stepLocation.end && typeof stepLocation.end.seq === 'number' ? stepLocation.end.seq : null;
        entry.startTime =
          stepLocation.start && typeof stepLocation.start.time === 'number' ? stepLocation.start.time : null;
        entry.endTime =
          stepLocation.end && typeof stepLocation.end.time === 'number' ? stepLocation.end.time : null;
        entry.status =
          typeof stepLocation.status === 'string'
            ? stepLocation.status
            : entry.endSeq !== null
              ? 'closed'
              : 'open';
        entry.lower = entry.startSeq !== null ? entry.startSeq : index === 0 ? descriptor.lower : null;
        const next = stepLocations[index + 1];
        const nextStart = next && next.start && typeof next.start.seq === 'number' ? next.start.seq : null;
        entry.upper = nextStart !== null ? nextStart - 1 : descriptor.upper;
      });
    }

    function stepForNode(node) {
      if (typeof node.step === 'number') return ensureStep(node.step);
      if (steps.size > 0 && typeof node.seq === 'number') {
        for (const entry of steps.values()) {
          if (
            entry.lower !== null &&
            node.seq >= entry.lower &&
            (entry.upper === null || entry.upper === Infinity || node.seq <= entry.upper)
          ) {
            return entry;
          }
        }
        let fallback = null;
        for (const entry of steps.values()) {
          if (entry.lower !== null && node.seq >= entry.lower && (fallback === null || entry.lower > fallback.lower)) fallback = entry;
        }
        if (fallback) return fallback;
      }
      if (typeof node.seq === 'number') {
        let bestStep = 1;
        let bestSeq = -Infinity;
        for (const peer of groups[turnIndex].nodes) {
          if (peer && peer.kind === 'assistant' && typeof peer.step === 'number' && typeof peer.seq === 'number') {
            if (peer.seq <= node.seq && peer.seq > bestSeq) {
              bestSeq = peer.seq;
              bestStep = peer.step;
            }
          }
        }
        return ensureStep(bestStep);
      }
      return ensureStep(1);
    }

    function addAssistantItems(entry, node, streaming) {
      let priorReasoning = '';
      for (const [index, run] of assistantRuns(node.blocks).entries()) {
        if (run.kind === 'tool-call') {
          const tool = tools.get(run.block.callId);
          if (isRootTool(tool) && tool.request === run.block) {
            tool.priorReasoning = priorReasoning;
            entry.items.push(makeToolItem(tool, guide, lang, canRun));
          }
        } else {
          if (run.kind === 'reasoning') priorReasoning = run.text;
          entry.items.push(assistantTextItem(run, index, node, streaming));
        }
      }
    }

    function addUnmatchedTool(entry, tool) {
      const item = makeToolItem(tool, guide, lang, canRun);
      const start = toolStartTime(tool);
      // Keep event order when no request or tool-start position is available.
      const next = typeof start === 'number'
        ? entry.items.findIndex((existing) => typeof existing.time === 'number' && existing.time > start)
        : -1;
      if (next === -1) entry.items.push(item);
      else entry.items.splice(next, 0, item);
    }

    function stepForToolResult(node) {
      let match = null;
      if (typeof node.callTime === 'number') {
        for (const step of steps.values()) {
          if (step.startTime !== null && step.startTime <= node.callTime &&
              (step.endTime === null || node.callTime <= step.endTime) &&
              (!match || step.startTime > match.startTime)) {
            match = step;
          }
        }
      }
      return match || stepForNode(node);
    }

    for (const node of groups[turnIndex].nodes) {
      if (node.kind === 'assistant') {
        addAssistantItems(stepForNode(node), node, false);
      } else if (node.kind === 'tool-result') {
        const tool = tools.get(node.callId || 'call-' + node.seq);
        if (isRootTool(tool) && !tool.request && tool.result === node) {
          addUnmatchedTool(stepForToolResult(node), tool);
        }
      } else {
        stepForNode(node).items.push(...noteItems(node));
      }
    }

    // A call can start before the corresponding assistant block is visible.
    for (const call of liveCalls) {
      if (call.turn !== descriptor.turn) continue;
      const tool = tools.get(call.callId);
      if (!isRootTool(tool) || tool.request || tool.result || tool.running !== call) continue;
      const entry =
        typeof call.step === 'number' ? ensureStep(call.step) : ensureStep(Math.max(1, ...Array.from(steps.keys())));
      addUnmatchedTool(entry, tool);
    }

    // Streaming assistant output of the current turn.
    if (turnPartial) {
      const entry =
        typeof turnPartial.step === 'number' ? ensureStep(turnPartial.step) : ensureStep(Math.max(1, ...Array.from(steps.keys())));
      addAssistantItems(entry, turnPartial, true);
    }

    // ---------------------------------------------------------- step summary
    const orderedSteps = Array.from(steps.values())
      .sort((left, right) => left.step - right.step)
      .map((entry) => ({
        step: entry.step,
        status: entry.status,
        live: false,
        startTime: entry.startTime,
        endTime: entry.endTime,
        thinkCount: entry.items.filter((item) => item.kind === 'think').length,
        toolCount: entry.items.filter((item) => item.kind === 'tool').length,
        toolErrorCount: entry.items.reduce((count, item) => count + toolErrors(item), 0),
        messageCount: entry.items.filter((item) => item.kind === 'message').length,
        hasError: entry.items.some((item) => item.kind === 'note' && item.tone === 'error'),
        running: entry.items.some((item) => item.kind === 'tool' && item.status === 'running'),
        pending: entry.items.some((item) => item.kind === 'tool' && item.status === 'pending'),
        items: entry.items,
      }));

    const categoryCounts = emptyCategoryCounts();
    let toolCount = 0;
    for (const step of orderedSteps) {
      for (const item of step.items) {
        if (item.kind === 'tool') {
          toolCount += 1;
          if (categoryCounts[item.category] != null) categoryCounts[item.category] += 1;
        }
      }
    }

    const goalNodes = groups[turnIndex].goalNodes
      .map((node) => ({
        kind: node.kind === 'user' ? 'user' : 'steer',
        text: textOfContent(node.content),
        time: typeof node.time === 'number' ? node.time : null,
      }))
      .filter((entry) => entry.text.trim() !== '');
    const goal = goalNodes
      .map((entry) => entry.text)
      .join('\n')
      .trim();

    const allItems = [];
    for (const step of orderedSteps) for (const item of step.items) allItems.push(item);

    const hasError = allItems.some((item) => item.kind === 'note' && item.tone === 'error');

    let activity = 'done';
    if (canRun && orderedSteps.some((step) => step.running || step.pending)) activity = 'acting';
    else if (turnPartial) {
      const runs = splitBlocks(turnPartial.blocks);
      activity = runs.some((run) => run.kind === 'text') ? 'answering' : 'thinking';
    } else if (canRun && descriptor.startSeq !== null && orderedSteps.length > 0) {
      const lastStep = orderedSteps[orderedSteps.length - 1];
      if (lastStep.status === 'open' || lastStep.status === 'unknown') activity = 'thinking';
    } else if (canRun && descriptor.startSeq !== null && orderedSteps.length === 0) {
      activity = 'starting';
    }
    if (canRun && descriptor.status === 'open' && activity === 'done') activity = 'thinking';
    if (hasError) activity = 'error';

    const live = canRun && activity !== 'done';
    if (live && orderedSteps.length > 0) {
      for (const step of orderedSteps) step.live = step.running || step.pending;
      const activeStep = orderedSteps.find((step) => step.step === turnPartial?.step);
      if (activeStep) activeStep.live = true;
      if (!orderedSteps.some((step) => step.live)) orderedSteps[orderedSteps.length - 1].live = true;
    }

    const lastThink = lastItemOfKind(allItems, 'think');
    const lastAnswer = lastItemOfKind(allItems, 'message');
    const firstThink = allItems.find((item) => item.kind === 'think') || null;
    const lastRunningTool = (() => {
      for (let index = allItems.length - 1; index >= 0; index -= 1) {
        const item = allItems[index];
        if (item.kind === 'tool' && item.status === 'running') return item;
      }
      return null;
    })();

    const firstStepWithStart = orderedSteps.find((step) => step.startTime !== null);
    const startTime =
      descriptor.startTime !== null
        ? descriptor.startTime
        : firstStepWithStart
          ? firstStepWithStart.startTime
          : goalNodes.length > 0
            ? goalNodes[goalNodes.length - 1].time
            : null;
    const endTime = descriptor.endTime;

    return {
      turn: descriptor.turn,
      index: turnIndex,
      status: descriptor.status || 'unknown',
      isCurrent,
      live,
      activity,
      hasError,
      goal,
      goalNodes,
      steps: orderedSteps,
      stepCount: orderedSteps.length,
      toolCount,
      toolErrorCount: orderedSteps.reduce((count, step) => count + step.toolErrorCount, 0),
      categoryCounts,
      phases: summarizeCategories(categoryCounts),
      thoughts: allItems.filter((item) => item.kind === 'think').length,
      answers: allItems.filter((item) => item.kind === 'message').length,
      startTime,
      endTime,
      durationMs: startTime !== null && endTime !== null ? Math.max(0, endTime - startTime) : null,
      liveThink: lastThink ? { text: lastThink.text, streaming: lastThink.streaming === true } : null,
      liveAnswer:
        activity === 'answering' && lastAnswer
          ? { text: lastAnswer.text, streaming: lastAnswer.streaming === true }
          : null,
      liveTool: lastRunningTool,
      lastAnswer: lastAnswer ? lastAnswer.text : '',
      openingThought: firstThink ? firstThink.text : '',
      items: allItems,
    };
  });

  return { turns };
}
