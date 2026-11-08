/**
 * React view for AI Step Lens, organized by conversation turn.
 *
 * Layout: a turn rail on the left (one chip per user request) and a detail pane
 * on the right that shows the recorded workflow for the selected turn. The build step concatenates this module
 * after `model.js` inside the bundle factory scope, so React, the model helpers
 * and the embedded GUIDE table are available here.
 */
import { basename, buildTurnModel, clip, firstLine, formatClock, formatDuration } from './model.js';
import { describeRecordedAction } from './action-description.js';
import { selectReasoningExcerpt } from './reasoning-excerpt.js';
import { registerQuickFlow } from './quick-flow.js';

const NS = 'learn';
const viewRuntime = { locale: null };
const EMPTY_LIST = [];

const STRINGS = {
  en: {
    "workflowTitle": "Turn workflow",
    overviewTitle: 'Realtime workflow map',
    quickFlowTitle: 'Live flow',
    quickFlowClose: 'Collapse',
    overviewHint: 'Select an action to open its zoomed detail.',
    overviewEmpty: 'Waiting for the first recorded step',
    overviewStart: 'Start',
    overviewEnd: 'Finished',
    overviewFailed: 'Turn failed',
    overviewReason: 'Reasoning',
    overviewPurpose: 'Description',
    stepDetails: 'Step details',
    actionReasoning: 'Related reasoning summary',
    translationUnavailable: 'Local reasoning translation is temporarily unavailable. The originals are available in each action’s details.',
    'status.pending': 'Preparing',
    "workflowHint": "Follow the recorded steps from top to bottom. Child actions appear under their parent action.",
    "requestStart": "Request received",
    "jumpToLive": "Go to active step",
    "recordedThinking": "Reasoning recorded",
    "answerRecorded": "Answer recorded",
    "thinkingExcerpt": "Reasoning excerpt",
    "originalThinking": "Original reasoning",
    "relatedThinking": "Related reasoning",
    "toolPurpose": "Tool purpose",
    "callDescription": "Call description",
    "toolFallback": "Tool call",
    "answerDetails": "Answer text",
    "viewDetails": "View details",
    "requestDetails": "Full request",
    "zoomTitle": "Zoomed detail",
    "zoomClose": "Close",
    "zoomHint": "The overview map clips long text. This view shows the step and its actions without clipping.",
    "zoomLocate": "Show in page",
    "zoomStep": "Step detail",
    "toolErrors": "{n} tool failures",
    "subActions": "Child actions",
    "resultMissing": "No result recorded",
    "status.unknown": "Status unknown",
    tab: 'AI Steps',
    title: 'AI Step Lens',
    subtitle: 'Follow the actions and recorded reasoning in each conversation turn',
    liveBadge: 'Live',
    idleBadge: 'Idle',
    turnRailTitle: 'Conversation turns',
    railFoot: 'Click a turn to review it',
    turnN: 'Turn {n}',
    currentTag: 'current',
    historyTag: 'history',
    backToCurrent: 'Back to current turn',
    previousTurn: 'Previous turn',
    goalLabel: 'Your request',
    untitledTurn: 'Untitled turn',
    metaSteps: '{n} steps',
    metaTools: '{n} tool calls',
    metaDuration: 'took {d}',
    elapsed: '{d} elapsed',
    interrupted: 'stopped',
    stepN: 'Step {k}/{total}',
    stepNumber: 'Step {k}',
    noSteps: 'No recorded steps in this turn yet.',
    argsLabel: 'Arguments',
    resultLabel: 'Result excerpt',
    errorLabel: 'Error',
    'status.thinking': 'thinking',
    'status.running': 'running',
    'status.done': 'done',
    'status.failed': 'failed',
    'status.error': 'error',
    'status.open': 'running',
    'status.closed': 'completed',
    'activity.thinking': 'thinking',
    'activity.acting': 'calling tools',
    'activity.answering': 'writing answer',
    'activity.starting': 'getting started',
    'activity.done': 'done',
    'activity.error': 'error',
    'note.context': 'System context injected',
    'note.command': 'Command executed',
    'note.compaction': 'Context compacted',
    'note.retry': 'Model request retried',
    'note.error': 'This turn failed',
    'note.maxTokens': 'Output length limit reached',
    'note.unknown': 'Other event',
    'note.steering': 'You added an instruction',
    countTimes: '{n} item(s)',
    turnCount: '{n} turns',
    toolCount: '{n} tool calls',
    emptyTitle: 'No conversation turns yet',
    emptyBody:
      'Send a request to see the workflow for each conversation turn.',
    liveHint: 'This turn is still running — the panel refreshes automatically.',
  },
  zh: {
    "workflowTitle": "本轮工作流",
    overviewTitle: '实时流程图',
    quickFlowTitle: '实时流程',
    quickFlowClose: '收起',
    overviewHint: '点击动作打开放大详情。',
    overviewEmpty: '等待第一步记录',
    overviewStart: '收到需求',
    overviewEnd: '本轮完成',
    overviewFailed: '本轮失败',
    overviewReason: '相关思考',
    overviewPurpose: '说明',
    stepDetails: '具体步骤',
    actionReasoning: '相关思考摘要',
    translationUnavailable: '本地思考翻译暂不可用。原文可在动作详情中查看。',
    'status.pending': '准备中',
    "workflowHint": "从上到下查看执行步骤，子动作列在所属动作下。",
    "requestStart": "收到需求",
    "jumpToLive": "定位当前步骤",
    "recordedThinking": "记录思考",
    "answerRecorded": "回答已记录",
    "thinkingExcerpt": "思考摘录",
    "originalThinking": "思考原文",
    "relatedThinking": "相关思考原文",
    "toolPurpose": "工具用途",
    "callDescription": "调用说明",
    "toolFallback": "调用工具",
    "answerDetails": "回答正文",
    "viewDetails": "查看详情",
    "requestDetails": "完整需求",
    "zoomTitle": "放大查看",
    "zoomClose": "关闭",
    "zoomHint": "流程图里被截断的文字，在这里完整显示。",
    "zoomLocate": "跳到页面位置",
    "zoomStep": "步骤详情",
    "toolErrors": "{n} 次工具失败",
    "subActions": "子动作",
    "resultMissing": "未记录结果",
    "status.unknown": "状态未知",
    tab: 'AI 思路',
    title: 'AI 思路透视镜',
    subtitle: '按轮次查看 AI 做了什么、相关思考和执行结果',
    liveBadge: '实时',
    idleBadge: '空闲',
    turnRailTitle: '对话轮次',
    railFoot: '点某一轮可以回看',
    turnN: '第 {n} 轮',
    currentTag: '当前',
    historyTag: '历史',
    backToCurrent: '回到当前轮',
    previousTurn: '上一轮思路',
    goalLabel: '你的需求',
    untitledTurn: '未命名轮次',
    metaSteps: '{n} 个步骤',
    metaTools: '{n} 次工具调用',
    metaDuration: '用时 {d}',
    elapsed: '已用 {d}',
    interrupted: '已中断',
    stepN: '步骤 {k}/{total}',
    stepNumber: '步骤 {k}',
    noSteps: '这一轮还没有记录到步骤。',
    argsLabel: '参数',
    resultLabel: '结果节选',
    errorLabel: '错误',
    'status.thinking': '思考中',
    'status.running': '进行中',
    'status.done': '完成',
    'status.failed': '失败',
    'status.error': '出错',
    'status.open': '进行中',
    'status.closed': '已完成',
    'activity.thinking': '正在思考',
    'activity.acting': '正在调用工具',
    'activity.answering': '正在输出回答',
    'activity.starting': '正在起步',
    'activity.done': '已完成',
    'activity.error': '出错',
    'note.context': '系统注入了上下文',
    'note.command': '执行了一个命令',
    'note.compaction': '上下文被压缩',
    'note.retry': '模型请求重试',
    'note.error': '这一轮出错了',
    'note.maxTokens': '达到输出长度上限',
    'note.unknown': '其他事件',
    'note.steering': '你插入了一条指令',
    countTimes: '{n} 项',
    turnCount: '{n} 轮对话',
    toolCount: '{n} 次工具',
    emptyTitle: '这里还没有对话轮次',
    emptyBody:
      '发起一轮对话后，这里会显示该轮的工作流。',
    liveHint: '这一轮还在进行中，面板会自动刷新。',
  },
};

const STYLE = `
.dsl-root{container-type:inline-size;display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px;line-height:1.62;}
.dsl-header{flex:none;display:flex;align-items:center;gap:12px;padding:12px 20px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);}
.dsl-logo{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);flex:none;}
.dsl-heading{flex:1;min-width:0;}
.dsl-h2{margin:0;font-size:15px;font-weight:600;}
.dsl-sub{margin:1px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary);}
.dsl-header-stats{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end;}
.dsl-chip{font-size:11.5px;padding:2px 9px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);white-space:nowrap;}
.dsl-live-pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;padding:3px 10px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);flex:none;}
.dsl-live-pill--on{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);}
.dsl-live-pill-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-idle-primary);flex:none;}
.dsl-live-pill--on .dsl-live-pill-dot{background:var(--dsw-alias-brand-primary);animation:dslPulse 1.4s ease-in-out infinite;}
@keyframes dslPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.78);}}
.dsl-body{flex:1;min-height:0;display:flex;}
.dsl-rail{width:212px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);display:flex;flex-direction:column;min-height:0;background:var(--dsw-alias-bg-base);}
.dsl-rail-title{flex:none;padding:10px 14px 6px;font-size:11px;font-weight:600;letter-spacing:.4px;color:var(--dsw-alias-label-secondary);text-transform:uppercase;}
.dsl-rail-list{flex:1;min-height:0;overflow-y:auto;padding:2px 8px 10px;}
.dsl-turn-chip{display:flex;align-items:flex-start;gap:8px;width:100%;text-align:left;border:1px solid transparent;background:transparent;border-radius:9px;padding:8px 9px;margin-bottom:4px;cursor:pointer;font:inherit;color:inherit;transition:background .12s ease,border-color .12s ease;}
.dsl-turn-chip:hover{background:var(--dsw-alias-bg-layer-2);}
.dsl-turn-chip--active{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2);}
.dsl-turn-no{flex:none;width:22px;height:22px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:600;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);font-variant-numeric:tabular-nums;}
.dsl-turn-chip--active .dsl-turn-no{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l2);}
.dsl-turn-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}
.dsl-turn-goal{font-size:12.5px;line-height:1.35;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word;}
.dsl-turn-meta{font-size:10.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.dsl-turn-dot{flex:none;width:7px;height:7px;border-radius:50%;margin-top:7px;background:var(--dsw-alias-state-idle-primary);}
.dsl-turn-dot--live{background:var(--dsw-alias-brand-primary);animation:dslPulse 1.4s ease-in-out infinite;}
.dsl-turn-dot--error{background:var(--dsw-alias-state-error-primary);}
.dsl-rail-foot{flex:none;padding:8px 14px;border-top:1px solid var(--dsw-alias-border-l1);font-size:11px;color:var(--dsw-alias-label-secondary);}
.dsl-main-scroll{flex:1;min-width:0;min-height:0;overflow-y:auto;padding:16px 22px 48px;}
.dsl-turn-detail{max-width:900px;margin:0 auto;}
.dsl-turn-head{display:flex;flex-direction:column;gap:8px;padding-bottom:12px;border-bottom:1px solid var(--dsw-alias-border-l1);}
.dsl-turn-title-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.dsl-turn-badge{font-size:15px;font-weight:600;}
.dsl-status{font-size:11px;padding:1px 8px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);}
.dsl-status--live{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);}
.dsl-status--error{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary);}
.dsl-tag{font-size:11px;color:var(--dsw-alias-label-secondary);}
.dsl-btn{margin-left:auto;font:inherit;font-size:11.5px;padding:3px 10px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;}
.dsl-btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);}
.dsl-btn + .dsl-btn{margin-left:6px;}
.dsl-prose p{margin:4px 0;}
.dsl-prose h4{margin:8px 0 3px;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);}
.dsl-prose ul,.dsl-prose ol{margin:4px 0;padding-left:20px;}
.dsl-prose li{margin:1px 0;}
.dsl-prose blockquote{margin:5px 0;padding-left:9px;border-left:2px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);}
.dsl-prose hr{border:none;border-top:1px solid var(--dsw-alias-border-l1);margin:8px 0;}
.dsl-inline-code,.dsl-code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
.dsl-inline-code{font-size:12px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:4px;padding:0 4px;}
.dsl-code{margin:6px 0;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px;font-size:11.5px;line-height:1.55;overflow-x:auto;max-height:300px;white-space:pre;}

.dsl-turn-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.dsl-meta{font-size:11px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;}
.dsl-flow-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:16px 0 2px;}
.dsl-flow-title{margin:0;font-size:16px;font-weight:650;}
.dsl-flow-hint{margin:0 0 12px;color:var(--dsw-alias-label-secondary);font-size:12px;}
.dsl-flow,.dsl-events,.dsl-child-list{list-style:none;margin:0;padding:0;}
.dsl-flow-step{position:relative;padding:0 0 13px 38px;scroll-margin-top:12px;}
.dsl-flow-step:focus{outline:0;}
.dsl-flow-step:focus-visible .dsl-flow-panel{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px;}
.dsl-flow-step:not(:last-child)::before{
  content:"";position:absolute;top:24px;bottom:0;left:12px;width:2px;background:var(--dsw-alias-border-l2);
}
.dsl-flow-step:not(:last-child)::after{
  content:"";position:absolute;bottom:3px;left:9px;width:6px;height:6px;
  border-right:2px solid var(--dsw-alias-border-l2);border-bottom:2px solid var(--dsw-alias-border-l2);transform:rotate(45deg);
}
.dsl-flow-marker{
  display:grid;place-items:center;position:absolute;top:10px;left:0;width:26px;height:26px;box-sizing:border-box;
  border:1px solid var(--dsw-alias-border-l2);border-radius:50%;background:var(--dsw-alias-bg-layer-2);
  color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:650;font-variant-numeric:tabular-nums;
}
.dsl-flow-panel{border:1px solid var(--dsw-alias-border-l1);border-radius:11px;background:var(--dsw-alias-bg-layer-1);min-width:0;}
.dsl-flow-step--live .dsl-flow-marker,.dsl-flow-step--live .dsl-flow-panel{border-color:var(--dsw-alias-brand-primary);}
.dsl-flow-step--live .dsl-flow-marker{color:var(--dsw-alias-brand-primary);}
.dsl-flow-step--error .dsl-flow-marker,.dsl-flow-step--error .dsl-flow-panel{border-color:var(--dsw-alias-state-error-primary);}
.dsl-flow-step--error .dsl-flow-marker{color:var(--dsw-alias-state-error-primary);}
.dsl-flow-step-head,.dsl-flow-start{padding:8px 11px;}
.dsl-flow-step-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.dsl-flow-step-title{margin:0;font-size:13px;font-weight:650;}
.dsl-flow-step-head .dsl-status{margin-left:auto;}
.dsl-flow-request{margin:2px 0 0;color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere;}
.dsl-event{border-top:1px solid var(--dsw-alias-border-l1);padding:6px 10px;min-width:0;}
.dsl-event-main{display:flex;align-items:baseline;gap:5px 8px;flex-wrap:wrap;}
.dsl-event-icon{width:16px;flex:none;text-align:center;font-size:12px;}
.dsl-event-title{font-size:13px;font-weight:600;overflow-wrap:anywhere;}
.dsl-event-subject{color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere;min-width:0;}
.dsl-event-status{margin-left:auto;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;}
.dsl-event-status--running{color:var(--dsw-alias-brand-primary);font-weight:600;}
.dsl-event-status--pending{color:var(--dsw-alias-brand-primary);}
.dsl-event-status--error{color:var(--dsw-alias-state-error-primary);font-weight:600;}
.dsl-event-status--ok{color:var(--dsw-alias-state-success-primary);}
.dsl-event-context{display:flex;align-items:baseline;gap:4px;flex-wrap:wrap;margin:1px 0 0 24px;font-size:12px;}
.dsl-event-description{color:var(--dsw-alias-label-secondary);min-width:0;overflow-wrap:anywhere;}
.dsl-event-label{color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;margin-right:5px;}
.dsl-action-reasoning{margin:2px 0 0 24px;font-size:12px;overflow-wrap:anywhere;}
.dsl-action-reasoning .dsl-event-label{color:var(--dsw-alias-brand-primary);}
.dsl-event-detail{margin:2px 0 0 auto;flex:none;}
.dsl-event-detail summary{cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;}
.dsl-event-detail summary:hover{color:var(--dsw-alias-brand-primary);}
.dsl-event-detail[open]{flex:1 0 100%;min-width:0;}
.dsl-event-detail[open] summary{width:max-content;max-width:100%;}
.dsl-event-data{margin-top:5px;}
.dsl-event-data pre{
  margin:2px 0 0;padding:7px 9px;max-height:220px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;
  background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:7px;font-size:11.5px;
}
.dsl-event-data .dsl-original-text{font:inherit;font-size:12px;}
.dsl-child-actions{margin:5px 0 0 24px;border-left:2px solid var(--dsw-alias-border-l2);}
.dsl-child-label{padding:2px 8px;}
.dsl-empty-step{margin:0;padding:5px 11px 9px;}
@container (max-width: 520px){
  .dsl-header{padding:8px 12px;}
  .dsl-header-stats>.dsl-chip{display:none;}
  .dsl-flow-step{padding-left:32px;}
  .dsl-event-status{margin-left:0;}
  .dsl-event-context,.dsl-action-reasoning{margin-left:0;}
  .dsl-event-detail{margin-left:0;}
}
.dsl-empty{max-width:540px;margin:56px auto 0;text-align:center;color:var(--dsw-alias-label-secondary);}
.dsl-empty-icon{font-size:34px;display:block;margin-bottom:10px;}
.dsl-empty-title{font-size:15px;font-weight:600;color:var(--dsw-alias-label-primary);margin:0 0 6px;}
.dsl-empty-body{font-size:13px;line-height:1.75;margin:0;}
.dsl-empty-steps{padding:14px;border:1px dashed var(--dsw-alias-border-l2);border-radius:9px;text-align:center;font-size:12px;color:var(--dsw-alias-label-secondary);}
.dsl-hint{margin-top:12px;font-size:11.5px;color:var(--dsw-alias-label-secondary);text-align:center;}
@container (max-width: 760px){
  .dsl-body{flex-direction:column;}
  .dsl-rail{width:auto;border-right:none;border-bottom:1px solid var(--dsw-alias-border-l1);max-height:148px;}
  .dsl-rail-list{display:flex;gap:6px;overflow-x:auto;overflow-y:hidden;padding:4px 10px 8px;}
  .dsl-turn-chip{width:190px;flex:none;margin-bottom:0;}
  .dsl-rail-foot{display:none;}
  .dsl-main-scroll{padding:12px 14px 40px;}
}
`;

/** Re-render when the locale switches. */
function useLocaleState() {
  const service = viewRuntime.locale;
  const subscribe = React.useCallback((callback) => service.subscribe(callback), [service]);
  const read = React.useCallback(() => service.getLocale(), [service]);
  return React.useSyncExternalStore(subscribe, read, read);
}

/** Wall clock used for live durations; only ticks while a turn is running. */
function useClock(enabled) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!enabled) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [enabled]);
  React.useEffect(() => {
    if (!enabled) setNow(Date.now());
  }, [enabled]);
  return now;
}
function renderInline(text, keyPrefix) {
  const source = typeof text === 'string' ? text : '';
  const nodes = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match;
  let index = 0;
  while ((match = pattern.exec(source)) !== null) {
    if (match.index > last) nodes.push(source.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) nodes.push(h('strong', { key: keyPrefix + '-b' + index }, token.slice(2, -2)));
    else nodes.push(h('code', { key: keyPrefix + '-c' + index, className: 'dsl-inline-code' }, token.slice(1, -1)));
    last = match.index + token.length;
    index += 1;
  }
  if (last < source.length) nodes.push(source.slice(last));
  return nodes;
}

function renderProse(source, keyPrefix) {
  const lines = String(source).split(/\r?\n/);
  const nodes = [];
  let list = null;
  let cursor = 0;
  const flush = () => {
    if (list === null) return;
    const children = list.items.map((entry, position) =>
      h(
        'li',
        { key: keyPrefix + '-li' + cursor + '-' + position },
        renderInline(entry, keyPrefix + '-li' + cursor + '-' + position),
      ),
    );
    nodes.push(h(list.type === 'ol' ? 'ol' : 'ul', { key: keyPrefix + '-list' + cursor }, children));
    cursor += 1;
    list = null;
  };
  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');
    if (line.trim() === '') {
      flush();
      continue;
    }
    const heading = /^\s{0,3}#{1,6}\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      nodes.push(h('h4', { key: keyPrefix + '-h' + cursor }, renderInline(heading[1], keyPrefix + '-h' + cursor)));
      cursor += 1;
      continue;
    }
    const bullet = /^\s{0,6}[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      if (list === null || list.type !== 'ul') {
        flush();
        list = { type: 'ul', items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }
    const ordered = /^\s{0,6}\d{1,2}[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      if (list === null || list.type !== 'ol') {
        flush();
        list = { type: 'ol', items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }
    const quote = /^\s{0,6}>\s?(.*)$/.exec(line);
    if (quote) {
      flush();
      nodes.push(h('blockquote', { key: keyPrefix + '-q' + cursor }, renderInline(quote[1], keyPrefix + '-q' + cursor)));
      cursor += 1;
      continue;
    }
    if (/^\s{0,3}([-*_])\s*(\1\s*){2,}$/.test(line)) {
      flush();
      nodes.push(h('hr', { key: keyPrefix + '-hr' + cursor }));
      cursor += 1;
      continue;
    }
    flush();
    nodes.push(h('p', { key: keyPrefix + '-p' + cursor }, renderInline(line, keyPrefix + '-p' + cursor)));
    cursor += 1;
  }
  flush();
  return nodes;
}

function renderMarkdown(text) {
  const source = typeof text === 'string' ? text : '';
  const limited = source.length > 60000 ? source.slice(0, 60000) + '\n\n…' : source;
  const segments = limited.split('```');
  const nodes = [];
  segments.forEach((segment, index) => {
    if (index % 2 === 1) {
      const body = segment.replace(/^[^\n]*\n/, '').replace(/\n$/, '');
      nodes.push(h('pre', { key: 'code-' + index, className: 'dsl-code' }, h('code', null, body)));
    } else {
      nodes.push.apply(nodes, renderProse(segment, 's' + index));
    }
  });
  return h('div', { className: 'dsl-prose' }, nodes);
}


function Chip(props) {
  return h('span', { className: 'dsl-chip' }, props.children);
}

export const FLOW_OVERVIEW_STYLE = `
.dsl-map{margin:13px 0 15px;padding:10px 12px 12px;border:1px solid var(--dsw-alias-border-l1);
  border-radius:12px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);min-width:0;}
.dsl-map--compact{margin:0;padding:0;border:0;background:transparent;}
.dsl-map-head{display:flex;align-items:baseline;gap:6px 10px;flex-wrap:wrap;margin-bottom:8px;}
.dsl-map-title{margin:0;font-size:14px;font-weight:650;}
.dsl-map-hint,.dsl-map-empty{font-size:11px;color:var(--dsw-alias-label-secondary);margin:0;}
.dsl-map-scroll{position:relative;max-height:216px;overflow:auto;padding:7px;scrollbar-gutter:stable;border-radius:12px;
  scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--dsw-alias-label-secondary) 42%,transparent) transparent;
  background-image:
    radial-gradient(circle,color-mix(in srgb,var(--dsw-alias-label-primary) 13%,transparent) .7px,transparent 1px),
    radial-gradient(ellipse at 5% 0%,rgb(96 165 250/.18),transparent 62%),
    radial-gradient(ellipse at 100% 100%,rgb(192 132 252/.17),transparent 65%);
  background-size:13px 13px,auto,auto;}
.dsl-map--compact .dsl-map-scroll{max-height:min(220px,45vh);}
.dsl-map-grid{display:grid;gap:12px 17px;padding:0;margin:0;list-style:none;}
.dsl-map-cell{position:relative;min-width:0;display:flex;}
.dsl-map-box{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:2px;
  --dsl-map-accent:#64748b;
  --dsl-map-tint:color-mix(in srgb,var(--dsw-alias-bg-base) 78%,var(--dsl-map-accent));
  --dsl-map-shadow:inset 0 1px 0 rgb(255 255 255/.34),0 3px 8px color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent);
  width:100%;min-width:0;min-height:46px;box-sizing:border-box;padding:6px 9px;text-align:left;
  border:1px solid color-mix(in srgb,var(--dsw-alias-border-l2) 70%,var(--dsl-map-accent));
  border-radius:11px;
  background:linear-gradient(155deg,rgb(255 255 255/.08),transparent 64%),
    color-mix(in srgb,var(--dsl-map-tint) 84%,transparent);
  box-shadow:var(--dsl-map-shadow);
  font:inherit;font-size:11px;line-height:1.25;color:inherit;}
.dsl-map-box[data-category="start"]{--dsl-map-accent:#6366f1;}
.dsl-map-box[data-category="read"]{--dsl-map-accent:#0891b2;}
.dsl-map-box[data-category="search"]{--dsl-map-accent:#2563eb;}
.dsl-map-box[data-category="write"]{--dsl-map-accent:#d97706;}
.dsl-map-box[data-category="run"]{--dsl-map-accent:#9333ea;}
.dsl-map-box[data-category="web"]{--dsl-map-accent:#0d9488;}
.dsl-map-box[data-category="collab"]{--dsl-map-accent:#db2777;}
.dsl-map-box[data-category="deliver"],.dsl-map-box[data-category="finish"]{--dsl-map-accent:#16a34a;}
.dsl-map-box[data-category="reasoning"]{--dsl-map-accent:#c026d3;}
.dsl-map-box[data-category="answer"]{--dsl-map-accent:#4d7c0f;}
.dsl-map-box[data-category="note"]{--dsl-map-accent:#ea580c;}
button.dsl-map-box{cursor:pointer;}
button.dsl-map-box:hover{--dsl-map-tint:color-mix(in srgb,var(--dsw-alias-bg-base) 72%,var(--dsl-map-accent));}
.dsl-map-box--live{box-shadow:inset 0 0 0 1px var(--dsw-alias-brand-primary),var(--dsl-map-shadow);
  border-color:var(--dsw-alias-brand-primary);}
.dsl-map-box.dsl-map-box--error{--dsl-map-accent:var(--dsw-alias-state-error-primary);border-color:var(--dsl-map-accent);}
.dsl-map-box:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px;}
.dsl-map-name,.dsl-map-subject{max-width:100%;overflow:hidden;text-overflow:ellipsis;}
.dsl-map-name{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;font-weight:650;overflow-wrap:anywhere;}
.dsl-map-subject{white-space:nowrap;}
.dsl-map-no,.dsl-map-subject{font-size:10px;color:var(--dsw-alias-label-secondary);}
.dsl-map-no::before{content:"";display:inline-block;width:5px;height:5px;margin-inline-end:4px;
  vertical-align:2px;border-radius:50%;background:var(--dsl-map-accent);}
.dsl-map-purpose{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;
  color:var(--dsw-alias-label-secondary);font-size:10.5px;overflow-wrap:anywhere;margin-top:2px;}
.dsl-map-purpose-label{font-weight:600;}
.dsl-map-box--live .dsl-map-no{color:var(--dsw-alias-brand-primary);}
.dsl-map-box--error .dsl-map-no{color:var(--dsw-alias-state-error-primary);}
.dsl-map-arrow{pointer-events:none;position:absolute;display:grid;place-items:center;font-size:12px;
  color:var(--dsw-alias-label-secondary);line-height:1;}
.dsl-map-arrow--right{top:0;bottom:0;right:-17px;width:17px;}
.dsl-map-arrow--left{top:0;bottom:0;left:-17px;width:17px;}
.dsl-map-arrow--down{left:0;right:0;bottom:-12px;height:12px;}
.dsl-zoom-backdrop{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;
  padding:24px;background:color-mix(in srgb,var(--dsw-alias-bg-base) 68%,transparent);backdrop-filter:blur(3px);}
.dsl-zoom{box-sizing:border-box;width:min(980px,94vw);max-height:88vh;display:flex;flex-direction:column;
  border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-base);
  color:var(--dsw-alias-label-primary);overflow:hidden;
  box-shadow:0 20px 60px color-mix(in srgb,var(--dsw-alias-label-primary) 18%,transparent);}
.dsl-zoom-head{flex:none;display:flex;align-items:flex-start;gap:12px;padding:14px 18px;
  border-bottom:1px solid var(--dsw-alias-border-l1);}
.dsl-zoom-titles{flex:1;min-width:0;}
.dsl-zoom-kicker{font-size:11.5px;color:var(--dsw-alias-label-secondary);}
.dsl-zoom-title{margin:2px 0 0;font-size:17px;font-weight:650;overflow-wrap:anywhere;}
.dsl-zoom-close{flex:none;}
.dsl-zoom-body{flex:1;min-height:0;overflow:auto;padding:14px 18px 22px;display:flex;flex-direction:column;gap:12px;}
.dsl-zoom-node{display:flex;align-items:flex-start;gap:11px;padding:12px 14px;border-radius:11px;
  border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);}
.dsl-zoom-node--live{border-color:var(--dsw-alias-brand-primary);}
.dsl-zoom-node--error{border-color:var(--dsw-alias-state-error-primary);}
.dsl-zoom-node-icon{font-size:22px;line-height:1.1;flex:none;}
.dsl-zoom-node-main{flex:1;min-width:0;}
.dsl-zoom-node-title{font-size:16px;font-weight:650;overflow-wrap:anywhere;}
.dsl-zoom-node-subject{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;
  font-weight:400;color:var(--dsw-alias-label-secondary);margin-left:6px;word-break:break-all;}
.dsl-zoom-node-meta{margin-top:3px;font-size:12px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;}
.dsl-zoom-note{margin:0;font-size:12px;color:var(--dsw-alias-label-secondary);}
.dsl-zoom-actions{display:flex;gap:8px;flex-wrap:wrap;}
.dsl-zoom-events{display:flex;flex-direction:column;gap:9px;margin:0;padding:0;list-style:none;}
.dsl-zoom-events .dsl-event{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;
  padding:9px 11px;background:var(--dsw-alias-bg-layer-1);}
.dsl-zoom-events .dsl-event-title{font-size:13.5px;}
.dsl-zoom-events .dsl-event-detail{border-top:0;}
.dsl-zoom-events .dsl-original-text{max-height:none;}
.dsl-zoom-events .dsl-event-data pre{max-height:none;}
`;

function describeMapStep(step, t) {
  const note = step.items.find((item) => item.noteKind === 'error' || item.noteKind === 'retry');
  if (note) return { title: t('note.' + note.noteKind), category: 'note' };
  if (step.messageCount > 0) return { title: t(step.live ? 'activity.answering' : 'answerRecorded'), category: 'answer' };
  if (step.thinkCount > 0) return { title: t(step.live ? 'status.thinking' : 'recordedThinking'), category: 'reasoning' };
  const event = step.items[0];
  return { title: t(event ? 'note.' + event.noteKind : 'status.' + (step.live ? 'thinking' : 'unknown')), category: 'note' };
}

function flowNodes(turn, t, lang, actionContext) {
  const activeStep = turn.live ? turn.steps.findLast((step) => step.live || step.running || step.pending) : null;
  const activeAction = activeStep?.items.findLast((item) => item.kind === 'tool' && item.status === 'running')
    || activeStep?.items.findLast((item) => item.kind === 'tool' && item.status === 'pending');
  const activeKey = activeAction?.key || (activeStep ? 'step-' + activeStep.step : null);
  const nodes = [{ key: 'start', title: t('overviewStart'), category: 'start' }];
  const shownReasoning = new Set();
  for (const step of turn.steps) {
    const actions = step.items.filter((item) => item.kind === 'tool');
    for (const action of actions) {
      const description = actionContext?.descriptions.get(action.key);
      const reasoning = actionContext?.summaries.get(action.key);
      const { title, subject } = describeToolAction(action, lang, t, description);
      const distinctDescription = description && ![title, subject, title + subject].some((label) =>
        label.replace(/[\s\p{P}]/gu, '') === description.replace(/[\s\p{P}]/gu, ''),
      );
      const reason = reasoning && (!shownReasoning.has(reasoning) || action.key === activeKey) ? reasoning : '';
      const purpose = distinctDescription ? description : reason;
      if (purpose && !distinctDescription) shownReasoning.add(reasoning);
      nodes.push({
        key: action.key,
        actionKey: action.key,
        step: step.step,
        title,
        subject,
        category: action.category,
        purpose,
        purposeLabel: t(distinctDescription ? 'overviewPurpose' : 'overviewReason'),
        tone: action.status === 'error' ? 'error' : action.key === activeKey ? 'live' : '',
        status: action.status === 'error' || action.status === 'running' || action.status === 'pending'
          ? t(TOOL_STATUS[action.status])
          : '',
      });
    }
    if (!actions.length || (step === activeStep && !activeAction)) {
      nodes.push({
        key: 'step-' + step.step,
        step: step.step,
        tone: step.hasError ? 'error' : step === activeStep ? 'live' : '',
        ...(step === activeStep
          ? { title: t('activity.' + turn.activity), category: turn.activity === 'answering' ? 'answer' : 'reasoning' }
          : describeMapStep(step, t)),
      });
    }
  }
  if (turn.hasError || turn.status === 'closed') {
    nodes.push({ key: 'finish', category: 'finish', tone: turn.hasError ? 'error' : '', title: t(turn.hasError ? 'overviewFailed' : 'overviewEnd') });
  }
  return { nodes, activeKey };
}

export function FlowOverview({ turn, t, lang, compact = false, visible = true, actionContext, onStep }) {
  const viewport = React.useRef(null);
  const activeCell = React.useRef(null);
  const [columns, setColumns] = React.useState(compact ? 3 : 6);
  const { nodes: graph, activeKey } = flowNodes(turn, t, lang, actionContext);
  React.useEffect(() => {
    const element = viewport.current;
    if (!element || typeof ResizeObserver !== 'function') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setColumns(Math.max(1, Math.min(compact ? 3 : 7, Math.floor((width + 17) / (compact ? 120 : 135)))));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [compact]);
  React.useEffect(() => {
    const element = viewport.current;
    const cell = activeCell.current;
    if (!visible || !element || !cell) return;
    const top = cell.offsetTop;
    const bottom = top + cell.offsetHeight;
    if (top < element.scrollTop) element.scrollTop = top;
    else if (bottom > element.scrollTop + element.clientHeight) element.scrollTop = bottom - element.clientHeight;
  }, [visible, activeKey, columns]);
  const arrows = { right: '→', left: '←', down: '↓' };
  return h(
    'section',
    { className: 'dsl-map' + (compact ? ' dsl-map--compact' : ''), 'aria-label': t('overviewTitle') },
    h(
      'div',
      { className: 'dsl-map-head' },
      h(compact ? 'strong' : 'h3', { className: 'dsl-map-title' }, t('overviewTitle')),
      onStep ? h('p', { className: 'dsl-map-hint' }, t('overviewHint')) : null,
    ),
    h(
      'div',
      { className: 'dsl-map-scroll', ref: viewport },
      h(
        'ol',
        { className: 'dsl-map-grid', role: 'list', style: { gridTemplateColumns: 'repeat(' + columns + ', minmax(0, 1fr))' } },
        graph.map((node, index) => {
          const row = Math.floor(index / columns);
          const offset = index % columns;
          const forward = row % 2 === 0;
          const column = forward ? offset + 1 : columns - offset;
          const direction = offset === columns - 1 ? 'down' : forward ? 'right' : 'left';
          const stepNumber = node.step == null ? '' : t('stepNumber', { k: node.step });
          const badge = [stepNumber, node.status].filter(Boolean).join(' · ');
          const actionable = onStep && node.step != null;
          const current = node.key === activeKey;
          const purpose = node.purpose ? node.purposeLabel + ' · ' + node.purpose : '';
          const purposePreview = lang === 'zh'
            ? clip(node.purpose?.replace(/^(?:让我(?:也|先)?|我(?:们)?(?:也|先)?(?:需要|应该))\s*/, ''), 52)
            : clip(node.purpose, 100);
          return h(
            'li',
            { className: 'dsl-map-cell', key: node.key, ref: current ? activeCell : undefined, style: { gridRow: row + 1, gridColumn: column } },
            h(
              actionable ? 'button' : 'div',
              {
                className: 'dsl-map-box' + (node.tone ? ' dsl-map-box--' + node.tone : ''),
                'data-category': node.category,
                'aria-current': current ? 'step' : undefined,
                title: [badge, node.title, node.subject, purpose].filter(Boolean).join(' · '),
                ...(actionable ? { type: 'button', onClick: () => onStep(node.step, node.actionKey) } : {}),
              },
              badge ? h('span', { className: 'dsl-map-no' }, badge) : null,
              h('span', { className: 'dsl-map-name' }, node.title),
              node.subject ? h('span', { className: 'dsl-map-subject' }, node.subject) : null,
              node.purpose ? h('span', { className: 'dsl-map-purpose' }, h('span', { className: 'dsl-map-purpose-label' }, node.purposeLabel + ' · '), purposePreview) : null,
            ),
            index < graph.length - 1
              ? h('span', { className: 'dsl-map-arrow dsl-map-arrow--' + direction, 'aria-hidden': true }, arrows[direction])
              : null,
          );
        }),
      ),
    ),
    !turn.steps.length && turn.live ? h('p', { className: 'dsl-map-empty' }, t('overviewEmpty')) : null,
  );
}

/** Keep short recorded prose in the main view when it matches the UI language. */
function readableExcerpt(text, lang) {
  let inCode = false;
  for (const line of (typeof text === 'string' ? text : '').split(/\r?\n/)) {
    const clean = line.trim();
    if (/^(?:~~~|\x60{3})/.test(clean)) {
      inCode = !inCode;
      continue;
    }
    if (inCode || !clean || /^(?:[>{}\[\]]|\x60)/.test(clean)) continue;
    const han = (clean.match(/\p{Script=Han}/gu) || []).length;
    const latin = (clean.match(/[a-z]/gi) || []).length;
    const firstLetter = clean.match(/[a-z]|\p{Script=Han}/iu)?.[0] || '';
    if (lang === 'zh' ? han >= 3 && han >= latin && /\p{Script=Han}/u.test(firstLetter) : latin >= 5) {
      return clip(clean, 100);
    }
  }
  return '';
}

const translatedReasoning = new Map();
const pendingReasoning = new Map();
let translationQueue = Promise.resolve();

async function translateLocally(texts) {
  const response = await fetch('api/step-lens-translate', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ texts }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) return null;
  const reply = await response.json();
  return reply?.ok && Array.isArray(reply.value) && reply.value.length === texts.length ? reply.value : null;
}

function translateReasoningBatch(texts) {
  const missing = texts.filter((text) => !translatedReasoning.has(text) && !pendingReasoning.has(text));
  if (missing.length) {
    const task = translationQueue.then(() => translateLocally(missing)).catch(() => null);
    translationQueue = task;
    missing.forEach((text, index) => {
      pendingReasoning.set(text, task.then((values) => {
        pendingReasoning.delete(text);
        const value = values?.[index];
        if (typeof value !== 'string' || !/\p{Script=Han}/u.test(value)) return '';
        if (translatedReasoning.size >= 512) translatedReasoning.delete(translatedReasoning.keys().next().value);
        const summary = value.trim()
          .replace(/构建(?:的)?新鲜度/g, '构建产物是否最新')
          .replace(/翻译[- ]?运行时间/g, '翻译运行环境')
          .replace(/离线翻译人员/g, '离线翻译');
        translatedReasoning.set(text, summary);
        return summary;
      }));
    });
  }
  return Promise.all(texts.map((text) => translatedReasoning.get(text) || pendingReasoning.get(text)));
}

export function useActionReasoning(turn, lang, enabled = true) {
  const sources = React.useMemo(() => {
    const entries = new Map();
    if (!enabled || !turn) return entries;
    const collect = (item) => {
      if (item.kind !== 'tool') return;
      const englishReasoning = lang === 'zh' ? selectReasoningExcerpt(item.priorReasoning, item) : '';
      const reasoning = englishReasoning || readableExcerpt(item.priorReasoning, lang);
      const localDescription = readableExcerpt(item.description, lang);
      const englishDescription = lang === 'zh' && !localDescription && readableExcerpt(item.description, 'en')
        ? firstLine(item.description, 240)
        : '';
      const description = localDescription || englishDescription;
      if (reasoning || description) {
        entries.set(item.key, {
          reasoning: { text: reasoning, translate: !!englishReasoning },
          description: { text: description, translate: !!englishDescription },
        });
      }
      for (const child of item.children || EMPTY_LIST) collect(child);
    };
    for (const step of turn.steps) for (const item of step.items) collect(item);
    return entries;
  }, [turn, lang, enabled]);
  const englishTexts = [...new Set([...sources.values()].flatMap((entry) =>
    [entry.description, entry.reasoning].filter((source) => source.translate).map((source) => source.text),
  ))];
  // A new stream chunk can rebuild the turn even when its completed call excerpts are identical.
  const sourceKey = JSON.stringify(turn?.live ? englishTexts.reverse() : englishTexts);
  const [unavailable, setUnavailable] = React.useState(false);
  const [, refresh] = React.useState(0);
  React.useEffect(() => {
    const missing = JSON.parse(sourceKey).filter((text) => !translatedReasoning.has(text));
    if (!missing.length) return undefined;
    let current = true;
    async function translateTurn() {
      for (let index = 0; current && index < missing.length; index += 8) {
        const values = await translateReasoningBatch(missing.slice(index, index + 8));
        if (!current) return;
        if (!values.some(Boolean)) {
          setUnavailable(true);
          return;
        }
        setUnavailable(false);
        refresh((version) => version + 1);
      }
    }
    void translateTurn();
    return () => { current = false; };
  }, [sourceKey]);
  const summaries = new Map();
  const descriptions = new Map();
  for (const [key, { reasoning, description }] of sources) {
    const thought = reasoning.translate ? translatedReasoning.get(reasoning.text) : reasoning.text;
    const explanation = description.translate ? translatedReasoning.get(description.text) : description.text;
    if (thought) summaries.set(key, thought);
    if (explanation) descriptions.set(key, explanation);
  }
  return { summaries, descriptions, unavailable: unavailable && englishTexts.length > 0 };
}

function describeToolAction(item, lang, t, description) {
  const concrete = describeRecordedAction(item, lang);
  if (concrete) return concrete;
  const args = item.args || {};
  if (typeof args.command === 'string' && description) return { title: description, subject: '' };
  const path = [args.file_path, args.path, args.cd].find((value) => typeof value === 'string' && value);
  const known = item.title && item.title !== item.name;
  const subject = path
    ? clip(basename(path), 65)
    : typeof args.command === 'string' || item.subject === item.description
      ? ''
      : clip(item.subject, 70);
  return { title: known ? item.title : t('toolFallback'), subject: subject || (!known ? item.name : '') };
}

const TOOL_STATUS = {
  ok: 'status.done',
  running: 'status.running',
  pending: 'status.pending',
  error: 'status.failed',
  interrupted: 'interrupted',
  unknown: 'resultMissing',
};

function DetailField({ label, value, prose = false, markdown = false }) {
  if (!value) return null;
  return h(
    'div',
    { className: 'dsl-event-data' },
    h('span', { className: 'dsl-event-label' }, label),
    markdown ? renderMarkdown(value) : h('pre', { className: prose ? 'dsl-original-text' : undefined }, value),
  );
}

function NodeDetails({ t, label, children, open }) {
  return h(
    'details',
    { className: 'dsl-event-detail', ...(open ? { open: true } : {}) },
    h('summary', null, label || t('viewDetails')),
    children,
  );
}

function EventNode({ item, t, lang, actionContext, registerAction, expanded = false, zoom = false }) {
  const tool = item.kind === 'tool';
  const thinking = item.kind === 'think';
  const message = item.kind === 'message';
  const recordedText = thinking ? item.text : tool ? item.priorReasoning : '';
  const excerpt = thinking ? readableExcerpt(recordedText, lang) : '';
  const actionReason = tool ? actionContext.summaries.get(item.key) : '';
  const description = tool ? actionContext.descriptions.get(item.key) : '';
  const tone = tool
    ? item.status
    : item.streaming
      ? 'running'
      : item.tone === 'error'
        ? 'error'
        : '';
  const action = tool ? describeToolAction(item, lang, t, description) : null;
  const title = tool
    ? action.title
    : thinking
      ? t(item.streaming ? 'status.thinking' : 'recordedThinking')
      : message
        ? t(item.streaming ? 'activity.answering' : 'answerRecorded')
        : t('note.' + item.noteKind);
  const statusText = tool
    ? t(TOOL_STATUS[item.status] || 'status.unknown')
    : item.interrupted
      ? t('interrupted')
      : item.count != null
        ? t('countTimes', { n: item.count })
        : '';
  const duration = tool && item.duration != null ? formatDuration(item.duration, lang) : '';
  const visibleDescription = description === action?.title ? '' : description;
  const purpose = tool && !description ? item.what : '';
  const canExpand = tool
    ? !!(item.description || item.argsText || item.result || item.error || recordedText)
    : !!(item.text || item.detail);
  return h(
    'li',
    {
      className: 'dsl-event' + (zoom ? ' dsl-event--zoom' : ''),
      'data-kind': item.kind,
      'data-status': tone || undefined,
      ...(tool && typeof registerAction === 'function' ? { ref: (node) => registerAction(item.key, node), tabIndex: -1 } : {}),
    },
    h(
      'div',
      { className: 'dsl-event-main' },
      h('span', { className: 'dsl-event-icon', 'aria-hidden': true }, item.icon),
      h('span', { className: 'dsl-event-title' }, title),
      action?.subject ? h('span', { className: 'dsl-event-subject' }, action.subject) : null,
      statusText
        ? h('span', { className: 'dsl-event-status' + (tone ? ' dsl-event-status--' + tone : '') }, statusText, duration ? ' · ' + duration : '')
        : null,
    ),
    actionReason
      ? h(
          'p',
          { className: 'dsl-action-reasoning' },
          h('span', { className: 'dsl-event-label' }, t('actionReasoning')),
          actionReason,
        )
      : null,
    purpose || visibleDescription || excerpt || canExpand
      ? h(
          'div',
          { className: 'dsl-event-context' },
          visibleDescription || purpose
            ? h(
                'span',
                { className: 'dsl-event-description' },
                h('span', { className: 'dsl-event-label' }, t(visibleDescription ? 'callDescription' : 'toolPurpose')),
                visibleDescription || purpose,
              )
            : excerpt
              ? h(
                  'span',
                  { className: 'dsl-event-description' },
                  h('span', { className: 'dsl-event-label' }, t('thinkingExcerpt')),
                  excerpt,
                )
              : null,
          canExpand
            ? h(
                NodeDetails,
                { t, open: expanded },
                tool && description !== item.description ? h(DetailField, { label: t('callDescription'), value: item.description, prose: true }) : null,
                recordedText ? h(DetailField, { label: t(tool ? 'relatedThinking' : 'originalThinking'), value: recordedText, prose: true }) : null,
                tool ? h(DetailField, { label: t('argsLabel'), value: item.argsText }) : null,
                tool ? h(DetailField, { label: t('resultLabel'), value: clip(item.result, zoom ? 20000 : 4000) }) : null,
                tool ? h(DetailField, { label: t('errorLabel'), value: item.error }) : null,
                message ? h(DetailField, { label: t('answerDetails'), value: item.text, markdown: true }) : null,
                !tool && !thinking && !message
                  ? h(DetailField, { label: title, value: [item.text, item.detail].filter(Boolean).join('\n\n'), prose: true })
                  : null,
              )
            : null,
        )
      : null,
    tool && item.children?.length
      ? h(
          'div',
          { className: 'dsl-child-actions' },
          h('div', { className: 'dsl-meta dsl-child-label' }, t('subActions')),
          h('ol', { className: 'dsl-child-list', role: 'list' }, item.children.map((child) =>
            h(EventNode, { key: child.key, item: child, t, lang, actionContext, registerAction, expanded, zoom }),
          )),
        )
      : null,
  );
}

function findZoomItem(items, key) {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children && item.children.length) {
      const found = findZoomItem(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

/** Title used by the zoom dialog for one flow node. */
export function zoomTargetTitle(turn, step, actionKey, t, lang, actionContext) {
  const item = actionKey ? findZoomItem(step.items, actionKey) : null;
  if (!item) return t('stepN', { k: step.step, total: turn.stepCount });
  const description = actionContext && actionContext.descriptions ? actionContext.descriptions.get(item.key) : '';
  return describeToolAction(item, lang, t, description).title;
}

/**
 * Full, unscaled detail for one flow node: a large node header plus the
 * complete event list with every collapsible section already open.
 */
export function ZoomContent(props) {
  const { turn, step, actionKey, t, lang, actionContext, onLocate } = props;
  if (!step) return null;
  const item = actionKey ? findZoomItem(step.items, actionKey) : null;
  const action = item ? describeToolAction(item, lang, t, actionContext.descriptions.get(item.key)) : null;
  const events = item ? [item] : step.items;
  const tone = item
    ? item.status === 'error'
      ? 'error'
      : item.status === 'running' || item.status === 'pending'
        ? 'live'
        : ''
    : step.hasError
      ? 'error'
      : step.live || step.running || step.pending
        ? 'live'
        : '';
  const metaParts = [];
  if (item) {
    metaParts.push(t(TOOL_STATUS[item.status] || 'status.unknown'));
    if (item.duration != null) metaParts.push(formatDuration(item.duration, lang));
    if (item.subCalls) metaParts.push(t('subCalls', { n: item.subCalls }));
  } else {
    if (step.toolCount) metaParts.push(t('metaTools', { n: step.toolCount }));
    const duration =
      step.startTime != null && step.endTime != null ? Math.max(0, step.endTime - step.startTime) : null;
    if (duration != null) metaParts.push(formatDuration(duration, lang));
    if (step.hasError) metaParts.push(t('status.failed'));
  }
  return h(
    'div',
    { className: 'dsl-zoom-content' },
    h(
      'div',
      { className: 'dsl-zoom-node' + (tone ? ' dsl-zoom-node--' + tone : '') },
      h('span', { className: 'dsl-zoom-node-icon', 'aria-hidden': true }, item ? item.icon : '🧭'),
      h(
        'div',
        { className: 'dsl-zoom-node-main' },
        h(
          'div',
          { className: 'dsl-zoom-node-title' },
          item ? action.title : t('stepN', { k: step.step, total: turn.stepCount }),
          item && action.subject ? h('code', { className: 'dsl-zoom-node-subject' }, action.subject) : null,
        ),
        metaParts.length ? h('div', { className: 'dsl-zoom-node-meta' }, metaParts.join(' · ')) : null,
      ),
    ),
    h('p', { className: 'dsl-zoom-note' }, t('zoomHint')),
    onLocate
      ? h(
          'div',
          { className: 'dsl-zoom-actions' },
          h('button', { type: 'button', className: 'dsl-btn', onClick: onLocate }, t('zoomLocate')),
        )
      : null,
    events.length
      ? h(
          'ol',
          { className: 'dsl-zoom-events', role: 'list' },
          events.map((entry) =>
            h(EventNode, { key: entry.key, item: entry, t, lang, actionContext, expanded: true, zoom: true }),
          ),
        )
      : h('p', { className: 'dsl-zoom-note' }, t('noSteps')),
  );
}

/** Large modal frame for one flow node; closes on backdrop click and Escape. */
export function ZoomDialog(props) {
  const { t, kicker, title, onClose, children } = props;
  React.useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return h(
    'div',
    { className: 'dsl-zoom-backdrop', onClick: onClose, role: 'presentation' },
    h(
      'div',
      {
        className: 'dsl-zoom',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': title || kicker || t('zoomTitle'),
        onClick: (event) => event.stopPropagation(),
      },
      h(
        'div',
        { className: 'dsl-zoom-head' },
        h(
          'div',
          { className: 'dsl-zoom-titles' },
          kicker ? h('div', { className: 'dsl-zoom-kicker' }, kicker) : null,
          h('h3', { className: 'dsl-zoom-title' }, title || t('zoomTitle')),
        ),
        h('button', { type: 'button', className: 'dsl-btn dsl-zoom-close', onClick: onClose, autoFocus: true }, t('zoomClose')),
      ),
      h('div', { className: 'dsl-zoom-body' }, children),
    ),
  );
}

function FlowStep({ t, lang, turn, step, now, active, nodeRef, actionContext, registerAction }) {
  const isLive = turn.live && (step.live || step.running || step.pending);
  const duration = step.startTime == null
    ? null
    : step.endTime != null
      ? Math.max(0, step.endTime - step.startTime)
      : isLive
        ? Math.max(0, now - step.startTime)
        : null;
  const errorCount = step.toolErrorCount || 0;
  const tone = step.hasError ? 'error' : isLive ? 'live' : '';
  const status = step.hasError
    ? 'status.failed'
    : isLive
      ? 'status.running'
      : step.status === 'closed'
        ? 'status.done'
        : 'status.unknown';
  return h(
    'li',
    {
      className: 'dsl-flow-step' + (tone ? ' dsl-flow-step--' + tone : ''),
      ref: nodeRef,
      tabIndex: -1,
      'aria-current': active ? 'step' : undefined,
    },
    h('span', { className: 'dsl-flow-marker', 'aria-hidden': true }, step.step),
    h(
      'section',
      { className: 'dsl-flow-panel' },
      h(
        'div',
        { className: 'dsl-flow-step-head' },
        h('h4', { className: 'dsl-flow-step-title' }, t(step.step > turn.stepCount ? 'stepNumber' : 'stepN', { k: step.step, total: turn.stepCount })),
        step.toolCount > 0 ? h('span', { className: 'dsl-meta' }, t('metaTools', { n: step.toolCount })) : null,
        errorCount > 0 ? h('span', { className: 'dsl-event-status--error dsl-meta' }, t('toolErrors', { n: errorCount })) : null,
        duration != null ? h('span', { className: 'dsl-meta' }, formatDuration(duration, lang)) : null,
        h('span', { className: 'dsl-status' + (tone ? ' dsl-status--' + tone : '') }, t(status)),
      ),
      step.items.length
        ? h('ol', { className: 'dsl-events', role: 'list' }, step.items.map((item) => h(EventNode, { key: item.key, item, t, lang, actionContext, registerAction })))
        : h('p', { className: 'dsl-meta dsl-empty-step' }, t(isLive ? 'status.thinking' : 'noSteps')),
    ),
  );
}

function TurnDetail({ t, lang, turn, isLatest, live, now, previousTurn, onBackToCurrent, onOpenTurn }) {
  const stepRefs = React.useRef(new Map());
  const actionRefs = React.useRef(new Map());
  const actionContext = useActionReasoning(turn, lang);
  const [zoomTarget, setZoomTarget] = React.useState(null);
  const registerAction = (key, node) => {
    if (node) actionRefs.current.set(key, node);
    else actionRefs.current.delete(key);
  };
  const currentStep = live ? turn.steps.findLast((step) => step.live || step.running || step.pending) : null;
  const jumpToStep = (step, key) => {
    const node = actionRefs.current.get(key) || stepRefs.current.get(step);
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ block: 'start' });
  };
  const status = turn.hasError
    ? 'status.error'
    : live
      ? 'activity.' + turn.activity
      : turn.status === 'closed'
        ? 'status.closed'
        : 'status.unknown';
  const statusClass = turn.hasError ? ' dsl-status--error' : live ? ' dsl-status--live' : '';
  const duration = turn.durationMs ?? (turn.startTime != null && live ? Math.max(0, now - turn.startTime) : null);
  const request = firstLine(turn.goal, 100);
  const zoomStep = zoomTarget ? turn.steps.find((entry) => entry.step === zoomTarget.step) : null;
  const zoomDialog =
    zoomTarget && zoomStep
      ? h(
          ZoomDialog,
          {
            t,
            kicker: [t('turnN', { n: turn.turn }), t('stepN', { k: zoomStep.step, total: turn.stepCount })].join(' · '),
            title: zoomTargetTitle(turn, zoomStep, zoomTarget.actionKey, t, lang, actionContext),
            onClose: () => setZoomTarget(null),
          },
          h(ZoomContent, {
            turn,
            step: zoomStep,
            actionKey: zoomTarget.actionKey,
            t,
            lang,
            actionContext,
            onLocate: () => {
              const target = zoomTarget;
              setZoomTarget(null);
              setTimeout(() => jumpToStep(target.step, target.actionKey), 0);
            },
          }),
        )
      : null;
  return h(
    'div',
    { className: 'dsl-turn-detail' },
    h(
      'div',
      { className: 'dsl-turn-head' },
      h(
        'div',
        { className: 'dsl-turn-title-row' },
        h('span', { className: 'dsl-turn-badge' }, t('turnN', { n: turn.turn })),
        h('span', { className: 'dsl-status' + statusClass }, t(status)),
        h('span', { className: 'dsl-tag' }, isLatest ? t('currentTag') : t('historyTag')),
        !isLatest ? h('button', { type: 'button', className: 'dsl-btn', onClick: onBackToCurrent }, t('backToCurrent')) : null,
        isLatest && previousTurn ? h('button', { type: 'button', className: 'dsl-btn', onClick: () => onOpenTurn(previousTurn.turn) }, t('previousTurn')) : null,
      ),
      h(
        'div',
        { className: 'dsl-turn-meta' },
        h(Chip, null, t('metaSteps', { n: turn.stepCount })),
        h(Chip, null, t('metaTools', { n: turn.toolCount })),
        duration != null ? h(Chip, null, t(live ? 'elapsed' : 'metaDuration', { d: formatClock(duration, lang) })) : null,
        turn.toolErrorCount > 0 ? h(Chip, null, t('toolErrors', { n: turn.toolErrorCount })) : null,
      ),
    ),
    h(FlowOverview, { turn, t, lang, actionContext, onStep: (stepNumber, actionKey) => setZoomTarget({ step: stepNumber, actionKey }) }),
    h(
      'div',
      { className: 'dsl-flow-head' },
      h('h3', { className: 'dsl-flow-title' }, t('stepDetails')),
      currentStep
        ? h(
            'button',
            { type: 'button', className: 'dsl-btn', onClick: () => jumpToStep(currentStep.step) },
            t('jumpToLive'),
          )
        : null,
    ),
    h('p', { className: 'dsl-flow-hint' }, t('workflowHint')),
    actionContext.unavailable ? h('p', { className: 'dsl-flow-hint', role: 'status' }, t('translationUnavailable')) : null,
    h(
      'ol',
      { className: 'dsl-flow', role: 'list', 'aria-label': t('workflowTitle') },
      request
        ? h(
            'li',
            { className: 'dsl-flow-step' },
            h('span', { className: 'dsl-flow-marker', 'aria-hidden': true }, '↓'),
            h(
              'div',
              { className: 'dsl-flow-panel dsl-flow-start' },
              h('div', { className: 'dsl-flow-step-title' }, t('requestStart')),
              h('p', { className: 'dsl-flow-request' }, request),
              request !== turn.goal
                ? h(NodeDetails, { t, label: t('requestDetails') }, h(DetailField, { label: t('goalLabel'), value: turn.goal, prose: true }))
                : null,
            ),
          )
        : null,
      turn.steps.map((step) =>
        h(FlowStep, {
          key: step.step,
          t, lang, turn, step, now, actionContext, registerAction,
          active: step === currentStep,
          nodeRef: (node) => {
            if (node) stepRefs.current.set(step.step, node);
            else stepRefs.current.delete(step.step);
          },
        }),
      ),
    ),
    turn.steps.length === 0 ? h('div', { className: 'dsl-empty-steps' }, t('noSteps')) : null,
    live ? h('div', { className: 'dsl-hint' }, t('liveHint')) : null,
    zoomDialog,
  );
}

function TurnChip(props) {
  const { t, lang, turn, active, now, onClick } = props;
  const duration =
    turn.durationMs != null ? turn.durationMs : turn.startTime != null && turn.live ? Math.max(0, now - turn.startTime) : null;
  const metaParts = [t('metaTools', { n: turn.toolCount })];
  if (duration != null) metaParts.push(formatClock(duration, lang));
  return h(
    'button',
    {
      type: 'button',
      className: 'dsl-turn-chip' + (active ? ' dsl-turn-chip--active' : ''),
      onClick,
      'aria-current': active ? 'true' : 'false',
    },
    h('span', { className: 'dsl-turn-no' }, String(turn.turn)),
    h(
      'span',
      { className: 'dsl-turn-body' },
      h('span', { className: 'dsl-turn-goal' }, turn.goal ? clip(turn.goal, 80) : t('untitledTurn')),
      h('span', { className: 'dsl-turn-meta' }, metaParts.join(' · ')),
    ),
    h(
      'span',
      {
        className:
          'dsl-turn-dot' +
          (turn.hasError ? ' dsl-turn-dot--error' : turn.live ? ' dsl-turn-dot--live' : ''),
      },
    ),
  );
}

function EmptyState(props) {
  return h(
    'div',
    { className: 'dsl-empty' },
    h('span', { className: 'dsl-empty-icon' }, '🔎'),
    h('p', { className: 'dsl-empty-title' }, props.t('emptyTitle')),
    h('p', { className: 'dsl-empty-body' }, props.t('emptyBody')),
  );
}

export function useLensLocale(props) {
  const input = props || {};
  const localeSnapshot = useLocaleState();
  const activeLocale = localeSnapshot && localeSnapshot.active ? String(localeSnapshot.active) : 'en';
  const lang = activeLocale.toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
  const boundT = viewRuntime.locale ? viewRuntime.locale.bind(NS) : null;
  const t = typeof input.t === 'function' ? input.t : boundT || ((key) => (STRINGS[lang] && STRINGS[lang][key]) || key);
  return { lang, t };
}

export function useLensModel(useChat, lang) {
  const snapshot = typeof useChat === 'function' ? useChat((state) => state) : null;
  const legacy = snapshot && snapshot.legacy ? snapshot.legacy : null;
  const nodes = legacy && Array.isArray(legacy.nodes) ? legacy.nodes : EMPTY_LIST;
  const runningCalls = legacy && Array.isArray(legacy.runningCalls) ? legacy.runningCalls : EMPTY_LIST;
  const partial = legacy && legacy.partial ? legacy.partial : null;
  const timeline = snapshot && snapshot.timeline ? snapshot.timeline : null;

  return React.useMemo(
    () => buildTurnModel({ nodes, runningCalls, partial, timeline, guide: GUIDE, lang }),
    [nodes, runningCalls, partial, timeline, lang],
  );
}

function StepLensView(props) {
  const { lang, t } = useLensLocale(props);
  const { turns } = useLensModel(props?.useChat, lang);
  const latestTurn = turns.length > 0 ? turns[turns.length - 1].turn : null;
  const [pinnedTurn, setPinnedTurn] = React.useState(null);
  const activeTurn =
    pinnedTurn !== null && turns.some((turn) => turn.turn === pinnedTurn) ? pinnedTurn : latestTurn;
  const selected = turns.find((turn) => turn.turn === activeTurn) || null;
  const isLatest = activeTurn !== null && activeTurn === latestTurn;
  const live = !!(selected && selected.isCurrent && selected.live);
  const sessionLive = turns.length > 0 ? turns[turns.length - 1].live === true : false;
  const now = useClock(live || sessionLive);
  const previousTurn = turns.length >= 2 ? turns[turns.length - 2] : null;

  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = 0;
  }, [activeTurn]);

  const totalTools = turns.reduce((sum, turn) => sum + turn.toolCount, 0);

  return h(
    'div',
    { className: 'dsl-root' },
    h('style', null, STYLE),
    h('style', null, FLOW_OVERVIEW_STYLE),
    h(
      'div',
      { className: 'dsl-header' },
      h('span', { className: 'dsl-logo' }, '🔎'),
      h(
        'div',
        { className: 'dsl-heading' },
        h('h2', { className: 'dsl-h2' }, t('title')),
        h('p', { className: 'dsl-sub' }, t('subtitle')),
      ),
      h(
        'div',
        { className: 'dsl-header-stats' },
        h('span', { className: 'dsl-chip' }, t('turnCount', { n: turns.length })),
        h('span', { className: 'dsl-chip' }, t('toolCount', { n: totalTools })),
        h(
          'span',
          { className: 'dsl-live-pill' + (sessionLive ? ' dsl-live-pill--on' : '') },
          h('span', { className: 'dsl-live-pill-dot' }),
          sessionLive ? t('liveBadge') : t('idleBadge'),
        ),
      ),
    ),
    h(
      'div',
      { className: 'dsl-body' },
      h(
        'div',
        { className: 'dsl-rail' },
        h('div', { className: 'dsl-rail-title' }, t('turnRailTitle')),
        h(
          'div',
          { className: 'dsl-rail-list' },
          turns.map((turn) =>
            h(TurnChip, {
              key: turn.turn,
              t,
              lang,
              turn,
              now,
              active: turn.turn === activeTurn,
              onClick: () => setPinnedTurn(turn.turn === latestTurn ? null : turn.turn),
            }),
          ),
        ),
        h('div', { className: 'dsl-rail-foot' }, t('railFoot')),
      ),
      h(
        'div',
        { className: 'dsl-main-scroll', ref: scrollRef },
        turns.length === 0
          ? h(EmptyState, { t })
          : selected
            ? h(TurnDetail, {
                key: selected.turn,
                t,
                lang,
                turn: selected,
                isLatest,
                live,
                now,
                previousTurn: isLatest ? previousTurn : null,
                onBackToCurrent: () => setPinnedTurn(null),
                onOpenTurn: (turn) => setPinnedTurn(turn),
              })
            : null,
      ),
    ),
  );
}

/** Client plugin body: register dictionaries and the conversation View tab. */
export function installClientPlugin(ctx) {
  viewRuntime.locale = ctx.locale;
  ctx.effect(() => ctx.locale.register(NS, 'en', STRINGS.en));
  ctx.effect(() => ctx.locale.register(NS, 'zh', STRINGS.zh));
  const t = ctx.locale.bind(NS);
  registerQuickFlow(ctx);
  ctx.slots.inject('conversation.view', () =>
    ctx.slots.register(
      {
        name: 'conversation.view',
        id: 'step-lens',
        order: 20,
        label: () => t('tab'),
      },
      StepLensView,
    ),
  );
}
