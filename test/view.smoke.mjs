/**
 * Smoke test for the generated browser bundle.
 *
 * The bundle needs `window.__ModuleLoader__` and a React module table in the
 * browser. A small renderer loads the bundle and exercises the turn rail,
 * workflow, and collapsed details under Node.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const bundleSource = readFileSync(join(root, 'client.js'), 'utf8');

function createReactStub() {
  const state = [];
  let nextState = 0;
  return {
    beginRender() {
      nextState = 0;
    },
    createElement(type, props, ...children) {
      const nextProps = Object.assign({}, props);
      if (children.length === 1) nextProps.children = children[0];
      else if (children.length > 1) nextProps.children = children;
      return { type, props: nextProps };
    },
    useState(initial) {
      const index = nextState++;
      if (index === state.length) state.push(typeof initial === 'function' ? initial() : initial);
      return [state[index], (next) => {
        state[index] = typeof next === 'function' ? next(state[index]) : next;
      }];
    },
    useEffect() {},
    useLayoutEffect() {},
    useMemo(factory) {
      return factory();
    },
    useCallback(callback) {
      return callback;
    },
    useRef(initial) {
      return { current: initial };
    },
    useId() {
      return ':step-lens:';
    },
    useSyncExternalStore(_subscribe, getSnapshot) {
      return getSnapshot();
    },
  };
}

function createHarness() {
  let definition = null;
  const windowStub = {
    __ModuleLoader__: {
      load(value) {
        definition = value;
      },
    },
  };
  // eslint-disable-next-line no-new-func
  new Function('window', bundleSource)(windowStub);
  assert.ok(definition, 'bundle registered a module definition');
  assert.equal(definition.id, '@local/step-lens');

  const dictionaries = {};
  let activeLocale = 'zh';
  const translate = (key, params) => {
    const dict = dictionaries[activeLocale] || {};
    const template = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
    );
  };

  const registrations = [];
  const ctx = {
    effect(callback) {
      const dispose = callback();
      return () => {
        if (typeof dispose === 'function') dispose();
      };
    },
    locale: {
      getLocale: () => ({ active: activeLocale, locales: [], revision: 1 }),
      subscribe: () => () => {},
      register(namespace, locale, dict) {
        if (locale !== undefined) dictionaries[locale] = Object.assign({}, dict);
        return () => {};
      },
      bind: () => (key, params) => translate(key, params),
    },
    slots: {
      inject(_key, callback) {
        callback();
        return () => {};
      },
      register(options, component) {
        registrations.push({ options, component });
        return () => {};
      },
    },
  };

  const react = createReactStub();
  const api = definition.factory((id) => {
    if (id === 'react') return react;
    throw new Error('unexpected require: ' + id);
  });
  api.apply(ctx);

  const registered = registrations.find((entry) => entry.options.name === 'conversation.view');
  const quickFlow = registrations.find((entry) => entry.options.name === 'conversation.session.header.actions');
  assert.ok(registered, 'registered a conversation.view entry');
  assert.equal(registered.options.id, 'step-lens');
  assert.equal(registered.options.order, 20);
  assert.equal(typeof registered.options.label, 'function');
  assert.equal(dictionaries.en.tab, 'AI Steps');
  assert.equal(dictionaries.zh.tab, 'AI 思路');
  assert.deepEqual(Object.keys(dictionaries.en).sort(), Object.keys(dictionaries.zh).sort());

  return {
    render(props) {
      react.beginRender();
      return registered.component(props);
    },
    renderQuickFlow(props) {
      assert.ok(quickFlow, 'registered the live flow in the conversation header');
      assert.equal(quickFlow.options.id, 'step-lens-quick-flow');
      assert.equal(typeof quickFlow.options.label, 'function');
      react.beginRender();
      return quickFlow.component(props);
    },
    setLocale(locale) {
      activeLocale = locale;
    },
  };
}

function walk(node, visit, showDetails) {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit, showDetails));
    return;
  }
  if (node == null || typeof node === 'boolean') return;
  if (typeof node === 'string' || typeof node === 'number') {
    visit(String(node));
    return;
  }
  if (typeof node !== 'object') return;
  if (typeof node.type === 'function') {
    walk(node.type(node.props || {}), visit, showDetails);
    return;
  }
  if (node.type === 'style') return;
  visit(node);
  if (!node.props) return;
  const { children, open } = node.props;
  if (node.type === 'details' && !open && !showDetails) {
    const summary = [children].flat().find((child) => child?.type === 'summary');
    walk(summary, visit, showDetails);
  } else {
    walk(children, visit, showDetails);
  }
}

function readTree(tree, showDetails = false) {
  const texts = [];
  const elements = [];
  walk(tree, (node) => {
    if (typeof node === 'string') texts.push(node);
    else elements.push(node);
  }, showDetails);
  return { text: texts.join('\n'), elements };
}

function withClass(elements, className) {
  return elements.filter((node) => node.props?.className?.split(/\s+/).includes(className));
}

const ev = (seq, time) => ({ seq, time, type: 'x', data: {} });
const rawReasoning = 'User asks: "请在每一轮对话中按顺序展示每一个实际发生的动作".';
const chineseReasoning = '我需要核对插件加载日志里有没有报错。';
const rawCommand = 'Start-Process -FilePath notepad.exe -ArgumentList ./inspection.log';
const rawResult = 'raw result from shell';
const shellDescription = '查看插件加载日志';
const shellArgs = JSON.stringify({ command: rawCommand, description: shellDescription });

function makeTimeline() {
  return {
    turnOrder: [1, 2],
    turns: new Map([
      [
        1,
        {
          turn: 1,
          start: ev(10, 1000),
          end: ev(50, 5000),
          status: 'closed',
          steps: [
            { step: 1, start: ev(11, 1100), end: ev(30, 3000), status: 'closed' },
            { step: 2, start: ev(31, 3100), end: ev(50, 5000), status: 'closed' },
          ],
        },
      ],
      [
        2,
        {
          turn: 2,
          start: ev(60, 6000),
          end: null,
          status: 'open',
          steps: [{ step: 1, start: ev(61, 6100), end: null, status: 'open' }],
        },
      ],
    ]),
  };
}

function makeNodes() {
  return [
    { kind: 'user', seq: 5, time: 900, content: [{ type: 'text', text: '第一轮需求：修 bug' }] },
    {
      kind: 'assistant',
      seq: 20,
      time: 2000,
      turn: 1,
      step: 1,
      blocks: [
        { kind: 'reasoning', text: rawReasoning },
        { kind: 'tool-call', callId: 'c1', name: 'read', argsRaw: '{"file_path":"src/first.ts"}' },
        { kind: 'reasoning', text: chineseReasoning },
        { kind: 'tool-call', callId: 'shell', name: 'pwsh', argsRaw: shellArgs },
        { kind: 'tool-call', callId: 'last-read', name: 'read', argsRaw: '{"file_path":"src/last.ts"}' },
      ],
    },
    {
      kind: 'tool-result',
      seq: 25,
      time: 2500,
      callId: 'c1',
      name: 'read',
      call: { name: 'read', argsRaw: '{"file_path":"src/first.ts"}' },
      callTime: 2400,
      content: [{ type: 'text', text: 'file body' }],
      isError: false,
      subCalls: [],
    },
    {
      kind: 'tool-result', seq: 26, time: 2600, callTime: 2450,
      callId: 'last-read', name: 'read', call: { name: 'read', argsRaw: '{"file_path":"src/last.ts"}' },
      content: [], isError: false, subCalls: [],
    },
    {
      kind: 'tool-result', seq: 27, time: 2700, callTime: 2430,
      callId: 'child-search', parentCallId: 'shell', name: 'glob',
      call: { name: 'glob', argsRaw: '{"pattern":"*.ps1"}' },
      content: [], isError: false, subCalls: [],
    },
    {
      kind: 'tool-result', seq: 28, time: 2800, callTime: 2420,
      callId: 'shell', name: 'pwsh', call: { name: 'pwsh', argsRaw: shellArgs },
      content: [{ type: 'text', text: rawResult }], isError: false,
      subCalls: [{ kind: 'tool-call', callId: 'child-search', name: 'glob', argsRaw: '{"pattern":"*.ps1"}' }],
    },
    { kind: 'assistant', seq: 40, time: 4000, turn: 1, step: 2, blocks: [{ kind: 'text', text: '第一轮修好了。' }] },
    { kind: 'user', seq: 55, time: 5900, content: [{ type: 'text', text: '第二轮需求：加测试' }] },
    { kind: 'assistant', seq: 65, time: 6500, turn: 2, step: 1, blocks: [{ kind: 'reasoning', text: '第二轮先搜索相关代码' }] },
  ];
}

const liveSnapshot = {
  legacy: {
    nodes: makeNodes(),
    turnTimings: new Map(),
    turnEnds: new Map(),
    partial: { turn: 2, step: 1, blocks: [{ kind: 'reasoning', text: '继续推理中' }] },
    runningCalls: [
      {
        phase: 'start',
        callId: 'c2',
        name: 'grep',
        argsRaw: '{"pattern":"TODO"}',
        turn: 2,
        step: 1,
        time: 6600,
        subCalls: [],
      },
    ],
  },
  timeline: makeTimeline(),
};

const closedSnapshot = {
  legacy: {
    nodes: makeNodes().filter((node) => node.seq < 50),
    turnTimings: new Map(),
    turnEnds: new Map(),
    partial: null,
    runningCalls: [],
  },
  timeline: {
    turnOrder: [1],
    turns: new Map([
      [
        1,
        {
          turn: 1,
          start: ev(10, 1000),
          end: ev(50, 5000),
          status: 'closed',
          steps: [
            { step: 1, start: ev(11, 1100), end: ev(30, 3000), status: 'closed' },
            { step: 2, start: ev(31, 3100), end: ev(50, 5000), status: 'closed' },
          ],
        },
      ],
    ]),
  },
};

test('renders the turn rail, live workflow and running tool', () => {
  const harness = createHarness();
  const tree = harness.render({ useChat: (selector) => selector(liveSnapshot) });
  const { text, elements } = readTree(tree);
  assert.match(text, /AI 思路透视镜/);
  assert.match(text, /对话轮次/);
  assert.match(text, /第 2 轮/);
  assert.match(text, /第一轮需求：修 bug/);
  assert.match(text, /第二轮需求：加测试/);
  assert.match(text, /实时流程图/);
  assert.match(text, /具体步骤/);
  assert.match(text, /正在调用工具/);
  assert.match(text, /搜索文件内容/);
  assert.match(text, /TODO/);
  assert.match(text, /上一轮思路/);
  assert.match(text, /步骤 1\/1/);
  assert.equal(withClass(elements, 'dsl-flow')[0]?.type, 'ol');
  assert.match(readTree(tree, true).text, /继续推理中/);
});

test('shows each action in call order and keeps original material collapsed', () => {
  const harness = createHarness();
  const tree = harness.render({ useChat: (selector) => selector(closedSnapshot) });
  const { text, elements } = readTree(tree);
  const titles = withClass(elements, 'dsl-event-title').map((node) => readTree(node).text);
  assert.deepEqual(titles.flatMap((title) => title.match(/读取文件|打开记事本/g) || []), [
    '读取文件', '打开记事本', '读取文件',
  ]);
  assert.match(text, /first\.ts[\s\S]*打开记事本[\s\S]*inspection\.log[\s\S]*last\.ts/);
  const subjects = withClass(elements, 'dsl-event-subject').map((node) => readTree(node).text);
  assert.ok(subjects.includes('inspection.log'), 'the program target is visible without raw code');
  assert.match(text, /子动作/);
  const [children] = withClass(elements, 'dsl-child-list');
  assert.ok(children);
  assert.match(readTree(children).text, /按名称找文件\s+\*\.ps1/);
  assert.match(text, /记录思考/);
  assert.ok(text.includes(chineseReasoning), 'recorded Chinese reasoning remains readable');
  const actionRows = withClass(elements, 'dsl-event').filter((node) => node.props['data-kind'] === 'tool');
  const shellRow = actionRows.find((node) => readTree(node).text.includes('打开记事本'));
  const firstReadRow = actionRows.find((node) => readTree(node).text.includes('first.ts'));
  const [shellReason] = withClass(readTree(shellRow).elements, 'dsl-action-reasoning');
  assert.ok(readTree(shellReason).text.includes(chineseReasoning));
  assert.equal(withClass(readTree(firstReadRow).elements, 'dsl-action-reasoning').length, 0);
  assert.match(text, /调用说明\s+查看插件加载日志/);
  assert.match(text, /工具用途/);
  assert.match(text, /回答已记录/);
  assert.match(text, /步骤 1\/2/);
  assert.match(text, /步骤 2\/2/);
  assert.match(text, /已完成/);
  assert.doesNotMatch(text, /本轮小结|收集信息 ×|运行验证 ×/);

  const details = withClass(elements, 'dsl-event-detail');
  assert.ok(details.length > 0);
  assert.ok(details.every((node) => node.type === 'details' && !node.props.open));
  const expanded = readTree(tree, true).text;
  for (const original of [rawReasoning, rawCommand, rawResult, '第一轮修好了。']) {
    assert.ok(!text.includes(original), 'original content is hidden by default: ' + original);
    assert.ok(expanded.includes(original), 'original content is still available: ' + original);
  }
});

test('renders individual actions in the map and opens the zoomed detail for the selected action', () => {
  const harness = createHarness();
  const props = { useChat: (selector) => selector(closedSnapshot) };
  const { elements, text } = readTree(harness.render(props));
  const [map] = withClass(elements, 'dsl-map');
  const [details] = withClass(elements, 'dsl-flow');
  assert.ok(map && details);
  assert.ok(elements.indexOf(map) < elements.indexOf(details));
  const boxes = withClass(elements, 'dsl-map-box');
  const stepNumbers = withClass(elements, 'dsl-map-no').map((node) => readTree(node).text);
  assert.deepEqual(stepNumbers, ['步骤 1', '步骤 1', '步骤 1', '步骤 2']);
  assert.equal(readTree(boxes[0]).text, '收到需求');
  assert.equal(readTree(boxes.at(-1)).text, '本轮完成');
  assert.deepEqual(boxes.map((node) => node.props['data-category']), ['start', 'read', 'run', 'read', 'answer', 'finish']);
  // Actions are grouped by step (start, step 1, step 2, finish); one connector joins each pair of groups.
  const groups = withClass(elements, 'dsl-map-group');
  assert.deepEqual(groups.map((group) => withClass(readTree(group).elements, 'dsl-map-box').length), [1, 3, 1, 1]);
  assert.equal(withClass(elements, 'dsl-map-link').length, groups.length - 1);
  // Every node opens a detail view: the request, each action, and how the turn ended.
  assert.ok(boxes.every((node) => node.type === 'button'));
  const stepButtons = boxes.filter((node) => !['start', 'finish'].includes(node.props['data-category']));
  assert.equal(stepButtons.length, 4);
  assert.match(readTree(stepButtons[1]).text, /打开记事本\s+inspection\.log\s+说明 ·\s+查看插件加载日志/);
  assert.match(text, /点击动作打开放大详情/);
  assert.equal(withClass(elements, 'dsl-zoom-backdrop').length, 0);

  // Clicking a map node opens the large dialog with untruncated original content.
  stepButtons[1].props.onClick();
  const zoomed = readTree(harness.render(props));
  assert.equal(withClass(zoomed.elements, 'dsl-zoom-backdrop').length, 1);
  assert.match(zoomed.text, /第 1 轮 · 步骤 1\/2/);
  assert.match(zoomed.text, /关闭/);
  assert.match(zoomed.text, /打开记事本/);
  assert.ok(zoomed.text.includes(shellDescription), 'the zoomed view shows the full description');
  assert.ok(zoomed.text.includes(rawCommand), 'the zoomed view shows the full original command');
  const [zoomEvents] = withClass(zoomed.elements, 'dsl-zoom-events');
  const zoomedRows = readTree(zoomEvents).elements;
  const zoomedTools = withClass(zoomedRows, 'dsl-event')
    .filter((node) => node.props['data-kind'] === 'tool');
  assert.ok(zoomedTools.length > 1, 'the zoomed action has nested tool details');
  for (const tool of zoomedTools) {
    // React invokes callback refs when mounting and unmounting the dialog.
    tool.props.ref?.({});
    tool.props.ref?.(null);
  }
  const zoomedDetails = withClass(zoomedRows, 'dsl-event-detail');
  assert.ok(zoomedDetails.length > 1 && zoomedDetails.every((node) => node.props.open));

  // Esc/close button restores the normal view.
  const [close] = withClass(zoomed.elements, 'dsl-zoom-close');
  assert.ok(close);
  close.props.onClick();
  const closedAgain = readTree(harness.render(props));
  assert.equal(withClass(closedAgain.elements, 'dsl-zoom-backdrop').length, 0);
});

test('the header popover follows the latest chat snapshot and highlights the active step', () => {
  const harness = createHarness();
  let snapshot = closedSnapshot;
  const props = { useChat: (selector) => selector(snapshot) };
  const closed = readTree(harness.renderQuickFlow(props));
  const [trigger] = withClass(closed.elements, 'dsl-quick-flow-trigger');
  const [popup] = withClass(closed.elements, 'dsl-quick-flow-popup');
  const [collapse] = withClass(closed.elements, 'dsl-quick-flow-close');
  assert.equal(trigger.props.popovertarget, popup.props.id);
  assert.equal(popup.props.popover, 'auto');
  assert.equal(collapse.props.popovertargetaction, 'hide');
  assert.equal(collapse.props.popovertarget, popup.props.id);
  assert.match(trigger.props['aria-label'], /实时流程.*第 1 轮.*2 个步骤/);
  assert.equal(trigger.props['data-live'], 'false');
  assert.match(readTree(popup).text, /本轮完成/);

  snapshot = liveSnapshot;
  const live = readTree(harness.renderQuickFlow(props));
  const [liveTrigger] = withClass(live.elements, 'dsl-quick-flow-trigger');
  assert.match(liveTrigger.props['aria-label'], /实时流程.*第 2 轮.*1 个步骤/);
  assert.equal(liveTrigger.props['data-live'], 'true');
  const current = withClass(live.elements, 'dsl-map-box').find((node) => node.props['aria-current'] === 'step');
  assert.ok(current);
  assert.match(readTree(current).text, /步骤 1[\s\S]*搜索文件内容/);
  assert.doesNotMatch(live.text, /本轮完成/);

  const secondAction = {
    ...liveSnapshot.legacy.runningCalls[0], callId: 'next', name: 'pwsh',
    argsRaw: shellArgs, time: 6650,
  };
  snapshot = {
    ...liveSnapshot,
    legacy: { ...liveSnapshot.legacy, runningCalls: [...liveSnapshot.legacy.runningCalls, secondAction] },
  };
  const sameStep = readTree(harness.renderQuickFlow(props));
  const [currentAction] = withClass(sameStep.elements, 'dsl-map-box').filter((node) => node.props['aria-current'] === 'step');
  assert.match(readTree(currentAction).text, /步骤 1[\s\S]*打开记事本\s+inspection\.log/);

  const timeline = makeTimeline();
  const activeTurn = timeline.turns.get(2);
  activeTurn.steps = [
    { ...activeTurn.steps[0], end: ev(66, 6600), status: 'closed' },
    { step: 2, start: ev(67, 6700), end: null, status: 'open' },
  ];
  snapshot = {
    timeline,
    legacy: {
      ...liveSnapshot.legacy,
      partial: { ...liveSnapshot.legacy.partial, step: 2 },
      runningCalls: liveSnapshot.legacy.runningCalls.map((call) => ({ ...call, step: 2, time: 6800 })),
    },
  };
  const progressed = readTree(harness.renderQuickFlow(props));
  const numbers = withClass(progressed.elements, 'dsl-map-no').map((node) => readTree(node).text);
  assert.deepEqual(numbers, ['步骤 1', '步骤 2 · 进行中']);
  const activeBoxes = withClass(progressed.elements, 'dsl-map-box').filter((node) => node.props['aria-current'] === 'step');
  assert.equal(activeBoxes.length, 1);
  assert.match(readTree(activeBoxes[0]).text, /步骤 2[\s\S]*搜索文件内容/);
  assert.equal(harness.renderQuickFlow({}), null);
});

test('switches the visible workflow between conversation turns', () => {
  const harness = createHarness();
  const props = { useChat: (selector) => selector(liveSnapshot) };
  const current = readTree(harness.render(props));
  const chips = withClass(current.elements, 'dsl-turn-chip');
  assert.equal(chips.length, 2);
  assert.match(current.text, /搜索文件内容/);
  chips[0].props.onClick();

  const history = readTree(harness.render(props));
  assert.match(history.text, /第 1 轮/);
  assert.match(history.text, /读取文件/);
  assert.doesNotMatch(history.text, /搜索文件内容/);
  const back = history.elements.find((node) => node.type === 'button' && readTree(node).text === '回到当前轮');
  assert.ok(back);
  back.props.onClick();
  assert.match(readTree(harness.render(props)).text, /搜索文件内容/);
});

test('renders the English locale', () => {
  const harness = createHarness();
  harness.setLocale('en');
  const { text } = readTree(harness.render({ useChat: (selector) => selector(liveSnapshot) }));
  assert.match(text, /AI Step Lens/);
  assert.match(text, /Conversation turns/);
  assert.match(text, /Turn 2/);
  assert.match(text, /Realtime workflow map/);
  assert.match(text, /Step details/);
  assert.match(text, /calling tools/);
  assert.match(text, /Previous turn/);
});

test('renders the empty state without a chat hook', () => {
  const harness = createHarness();
  const { text: empty } = readTree(harness.render({ useChat: undefined }));
  assert.match(empty, /这里还没有对话轮次/);

  const { text: emptySnapshot } = readTree(harness.render({
    useChat: (selector) => selector({ legacy: undefined, timeline: undefined }),
  }));
  assert.match(emptySnapshot, /这里还没有对话轮次/);
});

test('respects an injected t seat', () => {
  const harness = createHarness();
  const { text } = readTree(harness.render({
    useChat: (selector) => selector(liveSnapshot),
    t: (key) => 'T[' + key + ']',
  }));
  assert.match(text, /T\[title\]/);
  assert.match(text, /T\[turnRailTitle\]/);
});
