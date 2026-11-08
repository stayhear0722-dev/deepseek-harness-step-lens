import {
  FLOW_OVERVIEW_STYLE,
  FlowOverview,
  useActionReasoning,
  useLensLocale,
  useLensModel,
  ZoomContent,
  ZoomDialog,
  zoomTargetTitle,
} from './view.js';

// A dismissed live round stays dismissed even when its header is remounted.
const quickFlowOpenedTurns = new Map();

const QUICK_FLOW_STYLE = `
.dsl-quick-flow {
  flex: none;
  color: var(--dsw-alias-label-primary);
}
.dsl-quick-flow-trigger,
.dsl-quick-flow-close {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 7px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1);
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
}
.dsl-quick-flow-trigger:hover,
.dsl-quick-flow-close:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsl-quick-flow-trigger[data-live='true'] {
  color: var(--dsw-alias-brand-primary);
  border-color: var(--dsw-alias-brand-primary);
}
.dsl-quick-flow-count {
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
}
.dsl-quick-flow-popup {
  box-sizing: border-box;
  position: fixed;
  inset: auto;
  position-area: block-end span-inline-end;
  position-try-fallbacks: flip-inline, flip-block, flip-inline flip-block;
  margin: 6px 0;
  inline-size: min(430px, calc(100vw - 24px));
  max-block-size: min(58vh, 440px);
  overflow: auto;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2) 70%, var(--dsw-alias-bg-base));
  border-radius: 16px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  box-shadow: inset 0 1px 0 rgb(255 255 255/.28),
    0 12px 34px color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent);
  font-size: 13px;
  line-height: 1.5;
}
@supports (backdrop-filter: blur(1px)) {
  .dsl-quick-flow-popup {
    background: color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent);
    backdrop-filter: blur(14px) saturate(125%);
  }
}
.dsl-quick-flow-popup .dsl-map-head {
  padding-inline-end: 66px;
}
.dsl-quick-flow-close {
  position: absolute;
  inset-block-start: 7px;
  inset-inline-end: 8px;
}
`;

function QuickFlow(props) {
  const { t, lang } = useLensLocale(props);
  const { turns } = useLensModel(props.useChat, lang);
  const popupId = React.useId();
  const turn = turns.at(-1);
  const popupRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const sessionId = props.sessionId;
  const previousSession = React.useRef(sessionId);
  const openedTurn = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [zoomTarget, setZoomTarget] = React.useState(null);
  const hasTurn = !!turn;
  const turnId = turn?.turn;
  const live = !!turn?.live;
  const actionContext = useActionReasoning(turn, lang, open || !!zoomTarget);

  React.useEffect(() => {
    const popup = popupRef.current;
    if (!popup) return undefined;
    const syncOpen = () => setOpen(popup.matches(':popover-open'));
    popup.addEventListener('toggle', syncOpen);
    syncOpen();
    return () => popup.removeEventListener('toggle', syncOpen);
  }, [hasTurn]);

  React.useEffect(() => {
    const popup = popupRef.current;
    if (previousSession.current !== sessionId) {
      previousSession.current = sessionId;
      if (popup?.matches(':popover-open')) popup.hidePopover();
    }
    if (!live || !popup || typeof popup.showPopover !== 'function') return;
    const lastTurn = sessionId == null ? openedTurn.current : quickFlowOpenedTurns.get(sessionId);
    if (lastTurn === turnId) return;

    if (!popup.matches(':popover-open')) popup.showPopover({ source: triggerRef.current });
    if (sessionId == null) openedTurn.current = turnId;
    else quickFlowOpenedTurns.set(sessionId, turnId);
  }, [sessionId, turnId, live]);

  React.useEffect(() => {
    setZoomTarget(null);
  }, [sessionId, turnId]);

  if (!turn) return null;

  const zoomStep = zoomTarget ? turn.steps.find((entry) => entry.step === zoomTarget.step) : null;

  const title = t('quickFlowTitle');
  const turnName = t('turnN', { n: turn.turn });
  const count = t('metaSteps', { n: turn.stepCount });
  const labelParts = [title, turnName, count];
  if (turn.live) labelParts.push(t('liveBadge'));
  return h(
    'div',
    { className: 'dsl-quick-flow' },
    h('style', null, QUICK_FLOW_STYLE + FLOW_OVERVIEW_STYLE),
    h(
      'button',
      {
        ref: triggerRef,
        type: 'button',
        className: 'dsl-quick-flow-trigger',
        popovertarget: popupId,
        'aria-controls': popupId,
        'aria-expanded': open,
        'aria-label': labelParts.join(' · '),
        'data-live': turn.live ? 'true' : 'false',
      },
      h(
        'svg',
        {
          width: 16,
          height: 14,
          viewBox: '0 0 16 14',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.25,
          'aria-hidden': true,
        },
        h('path', { d: 'M4 7.5v4.25h5.75M7 4.75h4.75' }),
        h('rect', { x: 1, y: 2, width: 6, height: 5.5, rx: 1.25 }),
        h('circle', { cx: 13.3, cy: 4.75, r: 1.7 }),
        h('circle', { cx: 11.5, cy: 11.75, r: 1.7 }),
      ),
      h('span', null, title),
      h('span', { className: 'dsl-quick-flow-count', 'aria-hidden': true }, turn.stepCount),
    ),
    h(
      'section',
      {
        ref: popupRef,
        id: popupId,
        className: 'dsl-quick-flow-popup',
        popover: 'auto',
        'aria-label': [title, turnName].join(' · '),
      },
      h(
        'button',
        {
          type: 'button',
          className: 'dsl-quick-flow-close',
          popovertarget: popupId,
          popovertargetaction: 'hide',
        },
        t('quickFlowClose'),
      ),
      h(FlowOverview, {
        turn,
        t,
        lang,
        compact: true,
        visible: open,
        actionContext,
        onStep: (stepNumber, actionKey) => {
          const popup = popupRef.current;
          if (popup && popup.matches(':popover-open')) popup.hidePopover();
          setZoomTarget({ step: stepNumber, actionKey });
        },
      }),
    ),
    zoomTarget && zoomStep
      ? h(
          ZoomDialog,
          {
            t,
            kicker: [t('turnN', { n: turn.turn }), t('stepN', { k: zoomStep.step, total: turn.stepCount })].join(' · '),
            title: zoomTargetTitle(turn, zoomStep, zoomTarget.actionKey, t, lang, actionContext),
            onClose: () => {
              setZoomTarget(null);
              triggerRef.current?.focus({ preventScroll: true });
            },
          },
          h(ZoomContent, {
            turn,
            step: zoomStep,
            actionKey: zoomTarget.actionKey,
            t,
            lang,
            actionContext,
          }),
        )
      : null,
  );
}

/** Add a session-scoped flow preview beside the host conversation title. */
export function registerQuickFlow(ctx) {
  const name = 'conversation.session.header.actions';
  const t = ctx.locale.bind('learn');
  ctx.slots.inject(name, () => ctx.slots.register({
    name,
    id: 'step-lens-quick-flow',
    order: -20,
    label: () => t('quickFlowTitle'),
  }, QuickFlow));
}
