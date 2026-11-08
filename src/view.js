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
    keyPurpose: 'Goal',
    keyReason: 'Why',
    keyAction: 'How',
    keyResult: 'Result',
    readLines: 'read {n} lines',
    foundN: '{n} matches',
    foundNone: 'no matches',
    savedOk: 'saved',
    ranOk: 'ran successfully',
    fetchedN: 'got {n} characters',
    learnWhy: 'Why the AI did this',
    learnHow: 'What it actually did',
    learnGot: 'What came back',
    learnTip: 'Worth learning',
    learnTool: 'About this tool',
    learnNoReason: 'No reasoning was recorded right before this action.',
    learnOriginal: 'Originals and arguments',
    learnTranslated: 'translated locally',
    finishDetails: 'How this turn ended',
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
    keyPurpose: '目的',
    keyReason: '思路',
    keyAction: '做法',
    keyResult: '结果',
    readLines: '读到 {n} 行',
    foundN: '找到 {n} 条',
    foundNone: '没有找到匹配',
    savedOk: '已写入',
    ranOk: '执行成功',
    fetchedN: '取回 {n} 字',
    learnWhy: 'AI 为什么这样做',
    learnHow: '具体做了什么',
    learnGot: '得到了什么',
    learnTip: '值得学的做法',
    learnTool: '这个工具是做什么的',
    learnNoReason: '这一步之前没有记录到相关思考。',
    learnOriginal: '原文与参数',
    learnTranslated: '本机翻译',
    finishDetails: '本轮如何收尾',
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
.dsl-logo{width:34px;height:34px;flex:none;display:block;}
.dsl-logo svg{width:100%;height:100%;display:block;}
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
.dsl-event-icon{flex:none;align-self:center;}
.dsl-event-icon .dsl-icon{width:20px;height:20px;border-radius:6px;}
.dsl-event-icon .dsl-icon svg{width:12px;height:12px;}
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
.dsl-empty-icon{display:block;width:44px;height:44px;margin:0 auto 12px;}
.dsl-empty-icon svg{width:100%;height:100%;display:block;}
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
.dsl-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;}
.dsl-icon{display:inline-grid;place-items:center;flex:none;width:24px;height:24px;border-radius:7px;box-sizing:border-box;
  --dsl-hue:#6b7280;color:var(--dsl-hue);
  background:color-mix(in srgb,var(--dsl-hue) 12%,var(--dsw-alias-bg-base));
  box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--dsl-hue) 18%,transparent);}
.dsl-icon svg{width:14px;height:14px;display:block;}
:is(.dsl-icon,.dsl-map-box)[data-category="read"],:is(.dsl-icon,.dsl-map-box)[data-category="search"]{--dsl-hue:#2f6bf2;}
:is(.dsl-icon,.dsl-map-box)[data-category="web"]{--dsl-hue:#0e9384;}
:is(.dsl-icon,.dsl-map-box)[data-category="write"]{--dsl-hue:#c97a06;}
:is(.dsl-icon,.dsl-map-box)[data-category="run"]{--dsl-hue:#7a5af0;}
:is(.dsl-icon,.dsl-map-box)[data-category="collab"]{--dsl-hue:#d1437f;}
:is(.dsl-icon,.dsl-map-box)[data-category="answer"],:is(.dsl-icon,.dsl-map-box)[data-category="deliver"],:is(.dsl-icon,.dsl-map-box)[data-category="finish"]{--dsl-hue:#12a150;}
:is(.dsl-icon,.dsl-map-box)[data-category="reasoning"]{--dsl-hue:#7c8594;}
:is(.dsl-icon,.dsl-map-box)[data-category="note"]{--dsl-hue:#e2711d;}
:is(.dsl-icon,.dsl-map-box)[data-category="error"]{--dsl-hue:var(--dsw-alias-state-error-primary);}
:is(.dsl-icon,.dsl-map-box)[data-category="start"]{--dsl-hue:var(--dsw-alias-label-secondary);}

.dsl-map{--dsl-light:radial-gradient(ellipse 60% 80% at 0% 0%,color-mix(in srgb,#4d6bfe 16%,transparent),transparent 70%),
    radial-gradient(ellipse 55% 75% at 100% 100%,color-mix(in srgb,#a855f7 14%,transparent),transparent 70%),
    radial-gradient(ellipse 40% 60% at 60% 20%,color-mix(in srgb,#14b8a6 9%,transparent),transparent 70%);
  --dsl-glass:color-mix(in srgb,var(--dsw-alias-bg-base) 58%,transparent);
  --dsl-glass-edge:color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent);
  --dsl-glass-shine:color-mix(in srgb,color-mix(in srgb,var(--dsw-alias-bg-base) 30%,#fff) 45%,transparent);
  margin:14px 0 18px;padding:14px 16px 16px;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;
  background:var(--dsl-light),var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);min-width:0;}
.dsl-map--compact{margin:0;padding:0;border:0;background:transparent;}
.dsl-map--compact .dsl-map-scroll{background:var(--dsl-light);border-radius:12px;}
.dsl-map-head{display:flex;align-items:baseline;gap:4px 10px;flex-wrap:wrap;margin-bottom:12px;}
.dsl-map-title{margin:0;font-size:14px;font-weight:650;letter-spacing:.01em;}
.dsl-map-progress{font-size:11.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;}
.dsl-map-hint,.dsl-map-empty{font-size:11.5px;color:var(--dsw-alias-label-secondary);margin:0;}
.dsl-map-hint{margin-left:auto;}
.dsl-map-scroll{position:relative;overflow:auto;scrollbar-width:thin;
  scrollbar-color:color-mix(in srgb,var(--dsw-alias-label-secondary) 40%,transparent) transparent;}
.dsl-map-track,.dsl-map-items{list-style:none;margin:0;padding:0;}

/* Shared card */
.dsl-map-box{position:relative;display:grid;grid-template-columns:24px minmax(0,1fr);column-gap:10px;align-items:center;
  width:100%;min-width:0;box-sizing:border-box;padding:9px 11px;text-align:left;
  --dsl-hue:#94a3b8;
  border:1px solid var(--dsl-glass-edge);border-radius:12px;
  background:linear-gradient(140deg,color-mix(in srgb,var(--dsl-hue) 10%,transparent),transparent 55%),var(--dsl-glass);
  -webkit-backdrop-filter:blur(16px) saturate(170%);backdrop-filter:blur(16px) saturate(170%);
  box-shadow:inset 0 1px 0 var(--dsl-glass-shine),0 1px 2px color-mix(in srgb,var(--dsw-alias-label-primary) 5%,transparent),
    0 6px 18px color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent);
  font:inherit;font-size:12.5px;line-height:1.4;color:inherit;
  transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease;}
button.dsl-map-box{cursor:pointer;}
button.dsl-map-box:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--dsl-hue) 45%,var(--dsl-glass-edge));
  box-shadow:inset 0 1px 0 var(--dsl-glass-shine),0 10px 26px color-mix(in srgb,var(--dsl-hue) 18%,transparent);}
.dsl-map-box:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px;}
.dsl-map-box > .dsl-icon{align-self:start;margin-top:1px;}
.dsl-map-box--terminal > .dsl-icon{align-self:center;margin-top:0;}
.dsl-map-text{min-width:0;display:flex;flex-direction:column;gap:1px;}
.dsl-map-line{display:flex;align-items:baseline;gap:6px;min-width:0;}
.dsl-map-name{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none;max-width:100%;}
.dsl-map-subject{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;color:var(--dsw-alias-label-secondary);}
.dsl-map-row{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin-top:2px;
  font-size:11.5px;line-height:1.45;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere;}
.dsl-map-row::before{content:attr(data-k);display:inline-block;margin-right:6px;padding:0 5px;border-radius:4px;
  font-size:10px;font-weight:650;line-height:16px;vertical-align:1px;color:var(--dsw-alias-label-secondary);
  background:color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent);}
.dsl-map-reason{color:var(--dsw-alias-label-primary);}
.dsl-map-reason::before{color:#7a5af0;background:color-mix(in srgb,#7a5af0 12%,transparent);}
.dsl-map-detail{-webkit-line-clamp:1;}
.dsl-map-detail code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;
  color:var(--dsw-alias-label-primary);}
.dsl-map-outcome--ok::before{color:var(--dsw-alias-state-success-primary);
  background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,transparent);}
.dsl-map-outcome--error{color:var(--dsw-alias-state-error-primary);}
.dsl-map-outcome--error::before{color:var(--dsw-alias-state-error-primary);
  background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 12%,transparent);}
.dsl-map-status{align-self:flex-start;display:inline-flex;align-items:center;gap:5px;margin-top:4px;padding:1px 7px;border-radius:999px;
  font-size:10.5px;font-weight:600;color:var(--dsw-alias-brand-primary);
  background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,transparent);}
.dsl-map-status::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;}
.dsl-map-box--live .dsl-map-status::before{animation:dslPulse 1.4s ease-in-out infinite;}
.dsl-map-box--error .dsl-map-status{color:var(--dsw-alias-state-error-primary);
  background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 10%,transparent);}
.dsl-map-box--live{border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 70%,transparent);
  background:linear-gradient(140deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,transparent),transparent 60%),var(--dsl-glass);
  box-shadow:inset 0 1px 0 var(--dsl-glass-shine),0 0 0 3px color-mix(in srgb,var(--dsw-alias-brand-primary) 15%,transparent),
    0 10px 26px color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,transparent);}
.dsl-map-box--error{border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 60%,var(--dsw-alias-border-l1));}
.dsl-map-box--terminal{display:inline-grid;grid-template-columns:22px auto;column-gap:8px;align-items:center;width:auto;padding:5px 12px 5px 6px;
  border-radius:999px;}
.dsl-map-box--terminal .dsl-icon{width:22px;height:22px;border-radius:50%;}
.dsl-map-box--terminal .dsl-map-name{font-weight:600;font-size:12px;}
@keyframes dslPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.78);}}

/* Full view: one column per step, read left to right */
.dsl-map-scroll{padding:5px 6px 8px 4px;}
.dsl-map-track{display:flex;align-items:flex-start;gap:0;width:max-content;min-width:100%;box-sizing:border-box;padding-right:8px;}
.dsl-map-group{position:relative;display:flex;flex-direction:column;gap:6px;flex:none;width:236px;}
.dsl-map-group--terminal{width:auto;padding-top:22px;}
.dsl-map-group-label{height:16px;font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);
  font-variant-numeric:tabular-nums;letter-spacing:.02em;}
.dsl-map-items{display:flex;flex-direction:column;gap:8px;}
.dsl-map-link{flex:none;align-self:flex-start;position:relative;width:34px;height:2px;margin-top:44px;
  background:var(--dsw-alias-border-l2);}
.dsl-map-link::after{content:"";position:absolute;right:0;top:-3px;width:6px;height:6px;
  border-top:2px solid var(--dsw-alias-border-l2);border-right:2px solid var(--dsw-alias-border-l2);
  transform:rotate(45deg);box-sizing:border-box;}
.dsl-map-link--pending{background:repeating-linear-gradient(90deg,var(--dsw-alias-border-l2) 0 4px,transparent 4px 8px);}

/* Compact popover: a vertical rail */
.dsl-map--compact .dsl-map-head{margin-bottom:10px;}
.dsl-map--compact .dsl-map-hint{display:none;}
.dsl-map--compact .dsl-map-scroll{max-height:min(420px,56vh);padding:10px 10px 10px 8px;}
.dsl-map--compact .dsl-map-track{display:block;width:auto;min-width:0;position:relative;}
.dsl-map--compact .dsl-map-track::before{content:"";position:absolute;left:23px;z-index:0;top:16px;bottom:16px;width:2px;
  border-radius:1px;background:var(--dsw-alias-border-l1);}
.dsl-map--compact .dsl-map-group{width:auto;gap:6px;padding:0 0 10px 0;}
.dsl-map--compact .dsl-map-group--terminal{padding:0 0 10px 6px;}
.dsl-map--compact .dsl-map-group:last-child{padding-bottom:0;}
.dsl-map--compact .dsl-map-group-label{height:auto;padding-left:46px;}
.dsl-map--compact .dsl-map-items{gap:6px;}
.dsl-map--compact .dsl-map-box:not(.dsl-map-box--terminal){position:relative;}
.dsl-map--compact .dsl-map-link{display:none;}


.dsl-zoom-backdrop{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;
  padding:24px;background:color-mix(in srgb,var(--dsw-alias-bg-base) 68%,transparent);backdrop-filter:blur(3px);}
.dsl-zoom{box-sizing:border-box;width:min(980px,94vw);max-height:88vh;display:flex;flex-direction:column;
  border:1px solid color-mix(in srgb,var(--dsw-alias-label-primary) 10%,transparent);border-radius:18px;
  background:radial-gradient(ellipse 70% 50% at 0% 0%,color-mix(in srgb,#4d6bfe 12%,transparent),transparent 70%),
    radial-gradient(ellipse 60% 50% at 100% 100%,color-mix(in srgb,#a855f7 10%,transparent),transparent 70%),
    color-mix(in srgb,var(--dsw-alias-bg-base) 86%,transparent);
  -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
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
.dsl-zoom-node-icon{flex:none;}
.dsl-zoom-node-icon .dsl-icon{width:34px;height:34px;border-radius:10px;}
.dsl-zoom-node-icon .dsl-icon svg{width:19px;height:19px;}
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
.dsl-learn{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
@container (max-width: 640px){.dsl-learn{grid-template-columns:minmax(0,1fr);}}
@media (max-width: 640px){.dsl-learn{grid-template-columns:minmax(0,1fr);}}
.dsl-learn-section{--dsl-hue:#4d6bfe;min-width:0;padding:12px 14px;border-radius:12px;
  border:1px solid color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent);
  background:linear-gradient(140deg,color-mix(in srgb,var(--dsl-hue) 11%,transparent),transparent 60%),
    color-mix(in srgb,var(--dsw-alias-bg-base) 60%,transparent);
  box-shadow:inset 0 1px 0 color-mix(in srgb,color-mix(in srgb,var(--dsw-alias-bg-base) 30%,#fff) 45%,transparent);}
.dsl-learn-section--why{--dsl-hue:#7a5af0;grid-column:1 / -1;}
.dsl-learn-section--how{--dsl-hue:#2f6bf2;}
.dsl-learn-section--got{--dsl-hue:#12a150;}
.dsl-learn-section--error{--dsl-hue:var(--dsw-alias-state-error-primary);}
.dsl-learn-section--tip{--dsl-hue:#c97a06;grid-column:1 / -1;}
.dsl-learn-label{display:flex;align-items:center;gap:8px;margin:0 0 6px;font-size:12px;font-weight:700;color:var(--dsl-hue);}
.dsl-learn-label::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;}
.dsl-learn-note{font-size:10.5px;font-weight:500;color:var(--dsw-alias-label-secondary);padding:0 6px;border-radius:4px;
  background:color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent);}
.dsl-learn-text{margin:0;font-size:14px;line-height:1.7;overflow-wrap:anywhere;}
.dsl-learn-section--why .dsl-learn-text{font-size:15px;}
.dsl-learn-text--muted{color:var(--dsw-alias-label-secondary);font-size:13px;}
.dsl-learn-sub{margin:8px 0 0;font-size:12.5px;line-height:1.65;color:var(--dsw-alias-label-secondary);}
.dsl-learn-sub strong{color:var(--dsw-alias-label-primary);font-weight:600;}
.dsl-learn-code{margin:8px 0 0;padding:8px 10px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere;max-height:180px;overflow:auto;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.55;
  background:color-mix(in srgb,var(--dsw-alias-label-primary) 5%,transparent);}
.dsl-learn-original{margin:6px 0 -2px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);}
`;

function describeMapStep(step, t) {
  const note = step.items.find((item) => item.noteKind === 'error' || item.noteKind === 'retry');
  if (note) return { title: t('note.' + note.noteKind), category: 'note' };
  if (step.messageCount > 0) return { title: t(step.live ? 'activity.answering' : 'answerRecorded'), category: 'answer' };
  if (step.thinkCount > 0) return { title: t(step.live ? 'status.thinking' : 'recordedThinking'), category: 'reasoning' };
  const event = step.items[0];
  return { title: t(event ? 'note.' + event.noteKind : 'status.' + (step.live ? 'thinking' : 'unknown')), category: 'note' };
}

/** The literal thing an action did: the pattern, the command, the replaced text. */
export function concreteAction(item) {
  const a = item.args || {};
  const one = (value, n) => clip(firstLine(String(value), 400), n);
  if (typeof a.command === 'string' && a.command.trim()) {
    // Short commands teach at a glance; long scripts stay in the zoomed learning card.
    const command = a.command.trim();
    return command.length <= 48 && !/[\r\n]/.test(command) ? command : '';
  }
  if (typeof a.old_string === 'string' && typeof a.new_string === 'string') {
    return one(a.old_string, 26) + '  →  ' + one(a.new_string, 26);
  }
  if (typeof a.pattern === 'string') return [one(a.pattern, 40), a.glob || a.include || ''].filter(Boolean).join('  ');
  if (typeof a.query === 'string') return one(a.query, 60);
  if (typeof a.url === 'string') return one(a.url, 60);
  if (typeof a.offset === 'number' || typeof a.limit === 'number') {
    return 'L' + (a.offset || 1) + (a.limit ? '–' + ((a.offset || 1) + a.limit - 1) : '');
  }
  return '';
}

/** One line on what the action returned, so the reader sees cause and effect. */
export function actionOutcome(item, t) {
  if (item.status === 'error') return { text: clip(firstLine(item.error || item.result || t('status.failed'), 300), 60), tone: 'error' };
  if (item.status !== 'ok') return null;
  // A plain-language summary; the raw output stays in the zoomed learning card.
  const result = typeof item.result === 'string' ? item.result.trim() : '';
  const lines = result ? result.split(/\r?\n/).filter((line) => line.trim()).length : 0;
  if (item.category === 'read') return result ? { text: t('readLines', { n: lines }), tone: 'ok' } : null;
  if (item.category === 'search') return { text: lines ? t('foundN', { n: lines }) : t('foundNone'), tone: 'ok' };
  if (item.category === 'write') return { text: t('savedOk'), tone: 'ok' };
  if (item.category === 'run') return { text: t('ranOk'), tone: 'ok' };
  if (item.category === 'web') return result ? { text: t('fetchedN', { n: result.length }), tone: 'ok' } : null;
  return { text: t('status.done'), tone: 'ok' };
}

const same = (a, b) => !!a && !!b && a.replace(/[\s\p{P}]/gu, '') === b.replace(/[\s\p{P}]/gu, '');

function flowNodes(turn, t, lang, actionContext) {
  const activeStep = turn.live ? turn.steps.findLast((step) => step.live || step.running || step.pending) : null;
  const activeAction = activeStep?.items.findLast((item) => item.kind === 'tool' && item.status === 'running')
    || activeStep?.items.findLast((item) => item.kind === 'tool' && item.status === 'pending');
  const activeKey = activeAction?.key || (activeStep ? 'step-' + activeStep.step : null);
  const nodes = [{ key: 'start', title: t('overviewStart'), category: 'start', zoom: 'request' }];
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
      if (reason) shownReasoning.add(reasoning);
      const detail = concreteAction(action);
      nodes.push({
        key: action.key,
        actionKey: action.key,
        step: step.step,
        title,
        subject,
        category: action.category,
        purpose,
        purposeLabel: t(distinctDescription ? 'overviewPurpose' : 'overviewReason'),
        purposeKey: t(distinctDescription ? 'keyPurpose' : 'keyReason'),
        reason: distinctDescription && reason && !same(reason, description) ? reason : '',
        detail: detail && !same(detail, subject) && !same(detail, title) ? detail : '',
        outcome: actionOutcome(action, t),
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
    nodes.push({ key: 'finish', category: 'finish', zoom: 'finish', tone: turn.hasError ? 'error' : '', title: t(turn.hasError ? 'overviewFailed' : 'overviewEnd') });
  }
  return { nodes, activeKey };
}

const ICON_PATHS = {
  start: 'M6 4v16M6 4.5h10.5l-2.2 3.6 2.2 3.6H6',
  read: 'M7 3.5h7l4 4V20.5H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6',
  search: 'M10.5 4.5a6 6 0 1 1 0 12a6 6 0 0 1 0-12zM15 15l4.5 4.5',
  write: 'M4.5 19.5h4l10-10-4-4-10 10zM13 7l4 4',
  run: 'M3.5 5h17v14h-17zM7.5 9.5l3 2.5-3 2.5M12.5 14.8h4',
  web: 'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17zM3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5z',
  collab: 'M9 11a3.3 3.3 0 1 0 0-6.6a3.3 3.3 0 0 0 0 6.6zM3 19.5c.6-3.3 3-5.5 6-5.5s5.4 2.2 6 5.5M16 4.6a3.2 3.2 0 0 1 0 6.2M18 14.2c1.8.8 3 2.6 3.3 5.3',
  deliver: 'M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7zM4.5 7.7l7.5 4.2 7.5-4.2M12 11.9v8.6',
  reasoning: 'M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8zM18 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  answer: 'M4.5 5h15v10.5H9.5l-5 4zM8.5 9.2h7M8.5 12h4.5',
  note: 'M12 4l8.5 15h-17zM12 10v4M12 16.8v.2',
  finish: 'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17zM8.2 12.2l2.6 2.6 5-5.3',
  other: 'M12 8.8a3.2 3.2 0 1 1 0 6.4a3.2 3.2 0 0 1 0-6.4zM12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6M6 6l1.8 1.8M16.2 16.2L18 18M6 18l1.8-1.8M16.2 7.8L18 6',
};

/** Small tinted line icon; colour comes from the category, nothing else. */
export function CategoryIcon({ category, error = false }) {
  const key = error ? 'note' : Object.hasOwn(ICON_PATHS, category) ? category : 'other';
  return h(
    'span',
    { className: 'dsl-icon', 'data-category': error ? 'error' : category, 'aria-hidden': true },
    h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
      h('path', { d: ICON_PATHS[key] })),
  );
}


/** Icon category for one recorded event in the detailed list. */
function eventCategory(item) {
  if (item.kind === 'tool') return item.category || 'other';
  if (item.kind === 'think') return 'reasoning';
  if (item.kind === 'message') return 'answer';
  return 'note';
}

/** The plugin mark: a lens over three connected flow nodes. */
function LensMark() {
  const id = 'dsl-lens-' + React.useId().replace(/[^\w-]/g, '');
  return h(
    'svg',
    { viewBox: '0 0 40 40', fill: 'none' },
    h('defs', null, h('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1 },
      h('stop', { offset: 0, stopColor: '#4d6bfe' }), h('stop', { offset: 1, stopColor: '#7a5af0' }))),
    h('rect', { x: 1, y: 1, width: 38, height: 38, rx: 11, fill: 'url(#' + id + ')' }),
    h('path', { d: 'M12.5 14.5h4.5M16.5 14.5l3.5 5.5M20 20h-4.5', stroke: '#fff', strokeOpacity: 0.55, strokeWidth: 1.6, strokeLinecap: 'round' }),
    h('circle', { cx: 12, cy: 14.5, r: 2.3, fill: '#fff' }),
    h('circle', { cx: 20.5, cy: 14.5, r: 2.3, fill: '#fff', fillOpacity: 0.85 }),
    h('circle', { cx: 14, cy: 21, r: 2.3, fill: '#fff', fillOpacity: 0.7 }),
    h('circle', { cx: 18, cy: 18, r: 9.5, stroke: '#fff', strokeWidth: 2.4 }),
    h('path', { d: 'M25 25l6 6', stroke: '#fff', strokeWidth: 2.8, strokeLinecap: 'round' }),
  );
}

/** Group consecutive nodes that belong to the same step. */
function groupFlowNodes(nodes) {
  const groups = [];
  for (const node of nodes) {
    const last = groups.at(-1);
    if (node.step != null && last && last.step === node.step) last.nodes.push(node);
    else groups.push({ key: 'g-' + node.key, step: node.step, nodes: [node] });
  }
  return groups;
}

export function FlowOverview({ turn, t, lang, compact = false, visible = true, actionContext, onStep }) {
  const viewport = React.useRef(null);
  const activeCell = React.useRef(null);
  const { nodes: graph, activeKey } = flowNodes(turn, t, lang, actionContext);
  const groups = groupFlowNodes(graph);
  const actions = graph.filter((node) => node.actionKey).length;
  React.useEffect(() => {
    const element = viewport.current;
    const cell = activeCell.current;
    if (!visible || !element || !cell || typeof cell.getBoundingClientRect !== 'function') return;
    const outer = element.getBoundingClientRect();
    const inner = cell.getBoundingClientRect();
    if (inner.top < outer.top) element.scrollTop += inner.top - outer.top - 8;
    else if (inner.bottom > outer.bottom) element.scrollTop += inner.bottom - outer.bottom + 8;
    if (inner.left < outer.left) element.scrollLeft += inner.left - outer.left - 16;
    else if (inner.right > outer.right) element.scrollLeft += inner.right - outer.right + 16;
  }, [visible, activeKey]);
  const progress = [t('metaSteps', { n: turn.stepCount }), t('metaTools', { n: actions })].join(' · ');

  const renderBox = (node) => {
    const stepNumber = node.step == null ? '' : t('stepNumber', { k: node.step });
    const badge = [stepNumber, node.status].filter(Boolean).join(' · ');
    const actionable = !!onStep && (node.step != null || !!node.zoom);
    const current = node.key === activeKey;
    const terminal = node.category === 'start' || node.category === 'finish';
    const purposePreview = lang === 'zh'
      ? clip(node.purpose?.replace(/^(?:让我(?:也|先)?|我(?:们)?(?:也|先)?(?:需要|应该))\s*/, ''), 60)
      : clip(node.purpose, 110);
    const classes = ['dsl-map-box'];
    if (node.tone) classes.push('dsl-map-box--' + node.tone);
    if (terminal) classes.push('dsl-map-box--terminal');
    return h(
      'li',
      { className: 'dsl-map-cell', key: node.key, ref: current ? activeCell : undefined },
      h(
        actionable ? 'button' : 'div',
        {
          className: classes.join(' '),
          'data-category': node.category,
          'aria-current': current ? 'step' : undefined,
          title: [badge, node.title, node.subject, node.purpose ? node.purposeLabel + ' · ' + node.purpose : ''].filter(Boolean).join(' · '),
          ...(actionable ? { type: 'button', onClick: () => onStep(node.step ?? null, node.actionKey, node.zoom) } : {}),
        },
        h(CategoryIcon, { category: node.category, error: node.tone === 'error' && !terminal }),
        h(
          'span',
          { className: 'dsl-map-text' },
          badge ? h('span', { className: 'dsl-map-no dsl-sr' }, badge) : null,
          h(
            'span',
            { className: 'dsl-map-line' },
            h('span', { className: 'dsl-map-name' }, node.title),
            node.subject ? h('span', { className: 'dsl-map-subject' }, node.subject) : null,
          ),
          node.purpose
            ? h('span', { className: 'dsl-map-row dsl-map-purpose', 'data-k': node.purposeKey }, h('span', { className: 'dsl-sr' }, node.purposeLabel + ' · '), purposePreview)
            : null,
          node.reason
            ? h('span', { className: 'dsl-map-row dsl-map-reason', 'data-k': t('keyReason') }, clip(node.reason, lang === 'zh' ? 60 : 110))
            : null,
          node.detail
            ? h('span', { className: 'dsl-map-row dsl-map-detail', 'data-k': t('keyAction') }, h('code', null, node.detail))
            : null,
          node.outcome
            ? h('span', { className: 'dsl-map-row dsl-map-outcome dsl-map-outcome--' + node.outcome.tone, 'data-k': t('keyResult') }, node.outcome.text)
            : null,
          node.status ? h('span', { className: 'dsl-map-status', 'aria-hidden': true }, node.status) : null,
        ),
      ),
    );
  };

  const track = [];
  groups.forEach((group, index) => {
    const terminal = group.step == null;
    if (index > 0) {
      const pending = !!turn.live && index === groups.length - 1;
      track.push(h('li', { key: 'link-' + group.key, className: 'dsl-map-link' + (pending ? ' dsl-map-link--pending' : ''), 'aria-hidden': true }));
    }
    track.push(h(
      'li',
      { key: group.key, className: 'dsl-map-group' + (terminal ? ' dsl-map-group--terminal' : '') },
      terminal ? null : h('div', { className: 'dsl-map-group-label', 'aria-hidden': true }, t('stepNumber', { k: group.step })),
      h('ol', { className: 'dsl-map-items', role: 'list' }, group.nodes.map(renderBox)),
    ));
  });

  return h(
    'section',
    { className: 'dsl-map' + (compact ? ' dsl-map--compact' : ''), 'aria-label': t('overviewTitle') },
    h(
      'div',
      { className: 'dsl-map-head' },
      h(compact ? 'strong' : 'h3', { className: 'dsl-map-title' }, t('overviewTitle')),
      turn.steps.length ? h('span', { className: 'dsl-map-progress' }, progress) : null,
      onStep ? h('p', { className: 'dsl-map-hint' }, t('overviewHint')) : null,
    ),
    h('div', { className: 'dsl-map-scroll', ref: viewport }, h('ol', { className: 'dsl-map-track', role: 'list' }, track)),
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
      h('span', { className: 'dsl-event-icon', 'aria-hidden': true }, h(CategoryIcon, { category: eventCategory(item), error: tone === 'error' })),
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
/** Turn a clicked node into what the zoom dialog should show. */
export function resolveZoom(turn, target) {
  if (!target) return null;
  if (target.kind === 'request') return { request: turn.goal || '', step: { step: 0, items: [] }, actionKey: null };
  if (target.kind === 'finish') {
    const step = turn.steps.findLast((entry) => entry.messageCount > 0 || entry.hasError) || turn.steps.at(-1);
    return step ? { step, actionKey: null, finish: true } : null;
  }
  const step = turn.steps.find((entry) => entry.step === target.step);
  return step ? { step, actionKey: target.actionKey } : null;
}

/** Kicker and title for the zoom dialog. */
export function zoomHeading(turn, zoom, t, lang, actionContext) {
  const turnName = t('turnN', { n: turn.turn });
  if (zoom.request != null) return { kicker: turnName, title: t('requestDetails') };
  if (zoom.finish) return { kicker: turnName, title: t('finishDetails') };
  return {
    kicker: [turnName, t('stepN', { k: zoom.step.step, total: turn.stepCount })].join(' · '),
    title: zoomTargetTitle(turn, zoom.step, zoom.actionKey, t, lang, actionContext),
  };
}

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
function LearnSection({ label, tone, children, note }) {
  return h(
    'section',
    { className: 'dsl-learn-section' + (tone ? ' dsl-learn-section--' + tone : '') },
    h('h4', { className: 'dsl-learn-label' }, label, note ? h('span', { className: 'dsl-learn-note' }, note) : null),
    children,
  );
}

/** Reasoning → action → result for one action, written for someone learning from it. */
function LearnCard({ item, t, lang, actionContext }) {
  const reason = actionContext.summaries.get(item.key);
  const description = actionContext.descriptions.get(item.key);
  const translated = lang === 'zh' && !!reason && !/\p{Script=Han}/u.test(item.priorReasoning || '');
  const detail = item.args && typeof item.args.command === 'string' ? item.args.command.trim() : concreteAction(item);
  const outcome = actionOutcome(item, t);
  const result = item.status === 'error' ? item.error || item.result : item.result;
  return h(
    'div',
    { className: 'dsl-learn' },
    h(LearnSection, { label: t('learnWhy'), tone: 'why', note: translated ? t('learnTranslated') : '' },
      h('p', { className: 'dsl-learn-text' + (reason ? '' : ' dsl-learn-text--muted') }, reason || t('learnNoReason'))),
    h(LearnSection, { label: t('learnHow'), tone: 'how' },
      description ? h('p', { className: 'dsl-learn-text' }, description) : null,
      detail ? h('pre', { className: 'dsl-learn-code' }, detail) : null,
      item.what ? h('p', { className: 'dsl-learn-sub' }, h('strong', null, t('learnTool') + '：'), item.what) : null),
    outcome || result
      ? h(LearnSection, { label: t('learnGot'), tone: outcome?.tone === 'error' ? 'error' : 'got' },
          outcome ? h('p', { className: 'dsl-learn-text' }, outcome.text) : null,
          result ? h('pre', { className: 'dsl-learn-code dsl-learn-code--result' }, clip(result, 1200)) : null)
      : null,
    item.why ? h(LearnSection, { label: t('learnTip'), tone: 'tip' }, h('p', { className: 'dsl-learn-text' }, item.why)) : null,
  );
}

export function ZoomContent(props) {
  const { turn, step, actionKey, t, lang, actionContext, onLocate, request } = props;
  if (request != null) {
    return h('div', { className: 'dsl-zoom-content' },
      h(LearnSection, { label: t('goalLabel'), tone: 'how' }, renderMarkdown(request || t('untitledTurn'))));
  }
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
      h('span', { className: 'dsl-zoom-node-icon', 'aria-hidden': true }, h(CategoryIcon, { category: item ? eventCategory(item) : 'reasoning', error: tone === 'error' })),
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
    item && item.kind === 'tool' ? h(LearnCard, { item, t, lang, actionContext }) : null,
    item ? h('h4', { className: 'dsl-learn-original' }, t('learnOriginal')) : h('p', { className: 'dsl-zoom-note' }, t('zoomHint')),
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
  const zoom = resolveZoom(turn, zoomTarget);
  const zoomDialog =
    zoom
      ? h(
          ZoomDialog,
          {
            t,
            ...zoomHeading(turn, zoom, t, lang, actionContext),
            onClose: () => setZoomTarget(null),
          },
          h(ZoomContent, {
            turn,
            step: zoom.step,
            actionKey: zoom.actionKey,
            request: zoom.request,
            t,
            lang,
            actionContext,
            onLocate: zoom.request != null ? undefined : () => {
              const target = zoomTarget;
              setZoomTarget(null);
              setTimeout(() => jumpToStep(zoom.step.step, target.actionKey), 0);
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
    h(FlowOverview, { turn, t, lang, actionContext, onStep: (stepNumber, actionKey, kind) => setZoomTarget(kind ? { kind } : { step: stepNumber, actionKey }) }),
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
    h('span', { className: 'dsl-empty-icon', 'aria-hidden': true }, h(LensMark)),
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
      h('span', { className: 'dsl-logo', 'aria-hidden': true }, h(LensMark)),
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
