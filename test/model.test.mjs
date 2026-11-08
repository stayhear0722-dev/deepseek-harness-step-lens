/**
 * Unit tests for the turn-organized model. Run with `node test/model.test.mjs`.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildTurnModel,
  clip,
  firstLine,
  formatClock,
  formatDuration,
  parseArgs,
  splitBlocks,
  subjectOf,
  textOfContent,
} from '../src/model.js';

const GUIDE = {
  categories: {},
  tools: {
    read: {
      category: 'read',
      title: { zh: '读取文件', en: 'Read a file' },
      what: { zh: '读内容', en: 'Reads' },
      why: { zh: '先看事实', en: 'Facts first' },
    },
    grep: {
      category: 'search',
      title: { zh: '搜索代码', en: 'Search code' },
      what: { zh: '按关键词找', en: 'Finds by keyword' },
      why: { zh: '快速定位', en: 'Locates fast' },
    },
    edit: {
      category: 'write',
      title: { zh: '修改文件', en: 'Edit a file' },
      what: { zh: '改几行', en: 'Changes lines' },
      why: { zh: '只改需要的地方', en: 'Minimal change' },
    },
    pwsh: {
      category: 'run',
      title: { zh: '执行命令', en: 'Run a command' },
      what: { zh: '跑命令', en: 'Runs' },
      why: { zh: '用真实输出验证', en: 'Verify with real output' },
    },
  },
};

const ev = (seq, time) => ({ seq, time, type: 'x', data: {} });

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

function baseNodes() {
  return [
    { kind: 'user', seq: 5, time: 900, content: [{ type: 'text', text: '第一轮需求：修 bug' }] },
    {
      kind: 'assistant',
      seq: 20,
      time: 2000,
      turn: 1,
      step: 1,
      blocks: [
        { kind: 'reasoning', text: '先读一下 a.ts' },
        { kind: 'tool-call', callId: 'c1', name: 'read', argsRaw: '{"file_path":"a.ts"}' },
      ],
    },
    {
      kind: 'tool-result',
      seq: 25,
      time: 2500,
      callId: 'c1',
      name: 'read',
      call: { name: 'read', argsRaw: '{"file_path":"a.ts"}' },
      callTime: 2400,
      content: [{ type: 'text', text: 'file body' }],
      isError: false,
      subCalls: [],
    },
    {
      kind: 'assistant',
      seq: 40,
      time: 4000,
      turn: 1,
      step: 2,
      blocks: [{ kind: 'text', text: '第一轮修好了。' }],
    },
    { kind: 'user', seq: 55, time: 5900, content: [{ type: 'text', text: '第二轮需求：加测试' }] },
    {
      kind: 'assistant',
      seq: 65,
      time: 6500,
      turn: 2,
      step: 1,
      blocks: [{ kind: 'reasoning', text: '第二轮先搜索相关代码' }],
    },
  ];
}

test('text helper functions stay stable', () => {
  assert.equal(textOfContent([{ type: 'text', text: 'a' }, { type: 'image' }, { type: 'text', text: 'b' }]), 'a\nb');
  assert.equal(clip('abcdef', 3), 'abc…');
  assert.equal(firstLine('a\nb', 10), 'a');
  assert.deepEqual(parseArgs('{"x":1}'), { x: 1 });
  assert.deepEqual(parseArgs('{"x":'), {});
  assert.equal(subjectOf('read', { file_path: 'C:\\a\\b.ts' }), 'C:\\a\\b.ts');
  assert.equal(subjectOf('pwsh', { description: 'Run tests', command: 'npm test' }), 'Run tests');
  assert.deepEqual(splitBlocks([{ kind: 'reasoning', text: 'a' }, { kind: 'reasoning', text: 'b' }]), [
    { kind: 'reasoning', text: 'a\nb' },
  ]);
  assert.equal(formatDuration(1500, 'zh'), '1.5 秒');
  assert.equal(formatClock(80000, 'en'), '1m 20s');
});

test('buildTurnModel splits a conversation into per-turn detail', () => {
  const model = buildTurnModel({
    nodes: baseNodes(),
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
      // A settled call in runningCalls must be ignored.
      { phase: 'start', callId: 'c1', name: 'read', argsRaw: '{}', turn: 1, step: 1, time: 2500, subCalls: [] },
    ],
    partial: { turn: 2, step: 1, blocks: [{ kind: 'reasoning', text: '继续推理中' }] },
    timeline: makeTimeline(),
    guide: GUIDE,
    lang: 'zh',
  });

  assert.equal(model.turns.length, 2);
  const [first, second] = model.turns;

  // Turn 1: goal, two steps, one read tool, completed.
  assert.equal(first.turn, 1);
  assert.equal(first.goal, '第一轮需求：修 bug');
  assert.equal(first.status, 'closed');
  assert.equal(first.live, false);
  assert.equal(first.stepCount, 2);
  assert.equal(first.toolCount, 1);
  assert.equal(first.categoryCounts.read, 1);
  assert.deepEqual(first.phases, [{ phase: 'collect', count: 1 }]);
  assert.ok(first.lastAnswer.indexOf('第一轮修好了') >= 0);
  assert.equal(first.durationMs, 4000);
  assert.equal(first.steps[0].thinkCount, 1);
  assert.equal(first.steps[0].items.some((item) => item.kind === 'tool' && item.subject === 'a.ts'), true);

  // Turn 2: current, live, acting on a running grep call, streaming reasoning.
  assert.equal(second.turn, 2);
  assert.equal(second.goal, '第二轮需求：加测试');
  assert.equal(second.status, 'open');
  assert.equal(second.isCurrent, true);
  assert.equal(second.live, true);
  assert.equal(second.activity, 'acting');
  assert.equal(second.liveTool && second.liveTool.subject, 'TODO');
  assert.ok(second.liveThink && second.liveThink.text.indexOf('继续推理中') >= 0);
  assert.equal(second.steps[0].live, true);
  assert.equal(second.steps[0].running, true);
  assert.equal(second.durationMs, null);
});

test('buildTurnModel falls back when the timeline is unavailable', () => {
  const model = buildTurnModel({
    nodes: baseNodes(),
    runningCalls: [],
    partial: null,
    timeline: null,
    guide: GUIDE,
    lang: 'zh',
  });
  assert.equal(model.turns.length, 2);
  assert.equal(model.turns[0].turn, 1);
  assert.equal(model.turns[0].goal, '第一轮需求：修 bug');
  assert.equal(model.turns[0].toolCount, 1);
  assert.equal(model.turns[0].stepCount, 2);
  assert.equal(model.turns[1].turn, 2);
  assert.equal(model.turns[1].goal, '第二轮需求：加测试');
});

test('buildTurnModel handles an empty session', () => {
  const model = buildTurnModel({ nodes: [], runningCalls: [], partial: null, timeline: null, guide: GUIDE });
  assert.deepEqual(model.turns, []);
});

test('buildTurnModel keeps streaming answer state for the answering phase', () => {
  const model = buildTurnModel({
    nodes: baseNodes(),
    runningCalls: [],
    partial: { turn: 2, step: 1, blocks: [{ kind: 'text', text: '正在写第二个回答' }] },
    timeline: makeTimeline(),
    guide: GUIDE,
    lang: 'en',
  });
  const current = model.turns[model.turns.length - 1];
  assert.equal(current.activity, 'answering');
  assert.ok(current.liveAnswer && current.liveAnswer.text.indexOf('正在写第二个回答') >= 0);
  assert.equal(current.liveThink && current.liveThink.text.indexOf('第二轮先搜索') >= 0, true);
});

test('unknown tools fall back to the wire name and category other', () => {
  const model = buildTurnModel({
    nodes: [
      { kind: 'user', seq: 1, time: 100, content: [{ type: 'text', text: 'go' }] },
      {
        kind: 'tool-result',
        seq: 5,
        time: 200,
        callId: 'c9',
        name: 'mystery_tool',
        call: { name: 'mystery_tool', argsRaw: '{"x":1}' },
        callTime: 150,
        content: [],
        isError: false,
        subCalls: [],
      },
    ],
    runningCalls: [],
    partial: null,
    timeline: null,
    guide: GUIDE,
    lang: 'zh',
  });
  const tool = model.turns[0].items.find((item) => item.kind === 'tool');
  assert.equal(tool.title, 'mystery_tool');
  assert.equal(tool.category, 'other');
});

test('follows assistant block order and joins late results to their declaring step', () => {
  const nodes = [
    {
      kind: 'assistant', seq: 20, time: 2000, turn: 1, step: 1,
      blocks: [
        { kind: 'reasoning', text: 'Search for the definition.' },
        { kind: 'tool-call', callId: 'a', name: 'grep', argsRaw: '{"pattern":"TODO"}' },
        { kind: 'reasoning', text: 'Open the relevant file.' },
        { kind: 'tool-call', callId: 'b', name: 'read', argsRaw: '{"file_path":"a.ts"}' },
        { kind: 'tool-call', callId: 'c', name: 'edit' },
      ],
    },
    { kind: 'assistant', seq: 40, time: 4000, turn: 1, step: 2, blocks: [{ kind: 'text', text: 'Done' }] },
    { kind: 'tool-result', seq: 42, time: 4200, callId: 'b', name: 'read', isError: false },
    { kind: 'tool-result', seq: 43, time: 4300, callId: 'a', name: 'grep', isError: true },
  ];
  const [turn] = buildTurnModel({ nodes, timeline: makeTimeline(), guide: GUIDE }).turns;
  assert.deepEqual(turn.steps[0].items.map((item) => item.callId || item.text), [
    'Search for the definition.', 'a', 'Open the relevant file.', 'b', 'c',
  ]);
  assert.deepEqual(turn.steps[1].items.map((item) => item.text), ['Done']);
  const [, first, , second, missing] = turn.steps[0].items;
  assert.equal(first.priorReasoning, 'Search for the definition.');
  assert.equal(second.priorReasoning, 'Open the relevant file.');
  assert.equal(second.subject, 'a.ts');
  assert.equal(first.status, 'error');
  assert.equal(missing.status, 'unknown');
  assert.equal(turn.toolErrorCount, 1);
  assert.equal(turn.hasError, false);
});

test('retains the call identity and nested actions as a tool prepares, starts, and settles', () => {
  const blocks = [
    { kind: 'reasoning', text: 'Check the command output.' },
    { kind: 'tool-call', callId: 'root', name: 'pwsh', argsRaw: '{"description":"运行检查"}' },
  ];
  const live = {
    phase: 'start', callId: 'root', name: 'pwsh', turn: 2, step: 1, time: 7000,
    subCalls: [{
      phase: 'start', callId: 'child', parentCallId: 'root', name: 'read', time: 7200,
      args: { file_path: 'example.txt' }, subCalls: [],
    }],
  };
  const announced = buildTurnModel({
    nodes: baseNodes(), timeline: makeTimeline(), guide: GUIDE,
    partial: { turn: 2, step: 1, blocks },
  }).turns[1];
  const pending = announced.steps[0].items.find((item) => item.callId === 'root');
  assert.equal(pending.status, 'pending');
  assert.equal(announced.activity, 'acting');
  assert.equal(announced.steps[0].pending, true);
  assert.equal(announced.steps[0].running, false);
  assert.equal(announced.steps[0].live, true);

  const preparing = buildTurnModel({
    nodes: baseNodes(), timeline: makeTimeline(), guide: GUIDE,
    runningCalls: [{ ...live, phase: 'preparing', subCalls: [] }],
  }).turns[1];
  assert.equal(preparing.steps[0].items.find((item) => item.callId === 'root').status, 'pending');

  const current = buildTurnModel({
    nodes: baseNodes(), timeline: makeTimeline(), guide: GUIDE,
    partial: { turn: 2, step: 1, blocks }, runningCalls: [live],
  }).turns[1];
  const running = current.steps[0].items.find((item) => item.callId === 'root');
  assert.equal(current.steps[0].toolCount, 1);
  assert.equal(running.key, pending.key);
  assert.equal(running.status, 'running');
  assert.equal(current.steps[0].pending, false);
  assert.equal(current.steps[0].running, true);
  assert.equal(running.description, '运行检查');
  assert.equal(running.children[0].status, 'running');
  assert.equal(running.children[0].subject, 'example.txt');

  const childResult = {
    kind: 'tool-result', seq: 68, time: 7300, callTime: 7200, callId: 'child', parentCallId: 'root',
    name: 'read', isError: true, error: { code: 'interrupted' }, subCalls: [],
  };
  const settled = buildTurnModel({
    nodes: [
      ...baseNodes(),
      { kind: 'assistant', seq: 66, time: 6900, turn: 2, step: 1, blocks },
      { kind: 'tool-result', seq: 70, time: 7600, callTime: 7000, callId: 'root', name: 'pwsh',
        subCalls: [childResult], isError: false },
    ],
    timeline: makeTimeline(), guide: GUIDE, runningCalls: [live],
  }).turns[1];
  const finished = settled.steps[0].items.find((item) => item.callId === 'root');
  assert.equal(settled.steps[0].toolCount, 1);
  assert.equal(finished.key, running.key);
  assert.equal(finished.status, 'ok');
  assert.equal(finished.children[0].key, running.children[0].key);
  assert.equal(finished.children[0].parentCallId, finished.callId);
  assert.equal(finished.children[0].status, 'interrupted');
});

test('uses a recorded call start to place a result with no visible request', () => {
  const nodes = [
    { kind: 'assistant', seq: 20, time: 2000, turn: 1, step: 1, blocks: [{ kind: 'reasoning', text: 'Plan' }] },
    { kind: 'model-retry', seq: 23, time: 2300 },
    { kind: 'tool-result', seq: 25, time: 2500, callTime: 2200, callId: 'started', name: 'read' },
    { kind: 'tool-result', seq: 26, time: 2600, callId: 'result-only', name: 'grep' },
  ];
  const [turn] = buildTurnModel({ nodes, guide: GUIDE }).turns;
  assert.deepEqual(turn.steps[0].items.map((item) => item.callId || item.noteKind || item.text), [
    'Plan', 'started', 'retry', 'result-only',
  ]);
  assert.equal(turn.steps[0].items[1].priorReasoning, '');
});

test('retains the first request with a missing turn start and does not show a failed turn as live', () => {
  const timeline = makeTimeline();
  timeline.turns.get(1).start = undefined;
  const nodes = [...baseNodes(), { kind: 'turn-error', seq: 66, time: 6600, turn: 2, step: 1 }];
  const [first, failed] = buildTurnModel({
    nodes, timeline, guide: GUIDE,
    partial: { turn: 2, step: 1, blocks: [{ kind: 'reasoning', text: 'Stale' }] },
  }).turns;
  assert.equal(first.goal, '第一轮需求：修 bug');
  assert.equal(failed.goal, '第二轮需求：加测试');
  assert.equal(failed.activity, 'error');
  assert.equal(failed.live, false);
  assert.equal(failed.steps[0].live, false);
  assert.ok(!failed.items.some((item) => item.streaming));
});
