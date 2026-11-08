const reasoningSentenceSegmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter('en', { granularity: 'sentence' })
  : null;

const reasoningActionCues = {
  read: /\b(?:read|open|inspect|review|examine|look at|load)\b/i,
  search: /\b(?:search|look for|look up|find|locate|grep|identify)\b/i,
  write: /\b(?:write|edit|modify|update|patch|change|add|replace|save)\b/i,
  run: /\b(?:run|execute|test|build|verify|compare|check)\b/i,
  web: /\b(?:search|look up|browse|fetch|visit|open)\b/i,
  collab: /\b(?:delegate|assign|ask|spawn|coordinate|send)\b/i,
  deliver: /\b(?:deliver|present|share|export|attach)\b/i,
};

const reasoningToolCategories = { grep: 'search', glob: 'search', edit: 'write', pwsh: 'run', bash: 'run' };
const reasoningWhyCue = /\b(?:because|so that|in order to|need to|should first|first need|before (?:we|I|making|changing)|to (?:confirm|verify|find|determine|see|understand|identify|check|ensure|avoid))\b/i;
const reasoningEnglishCue = /\b(?:a|an|the|to|and|or|of|for|with|is|are|this|that|it|I|we|because)\b/i;
const reasoningTargetStopWords = new Set(['the', 'and', 'file', 'files', 'folder', 'test', 'tests', 'read', 'run']);

function reasoningWords(text) {
  return (text.toLowerCase().match(/[a-z][a-z0-9_.-]*/g) || []).map((word) => word.replace(/[.-]+$/, ''));
}

function reasoningTargets(action) {
  const args = action?.args || {};
  const subject = action?.subject === action?.description ? null : action?.subject;
  const values = [subject, args.file_path, args.path, args.pattern, args.query];
  return new Set(values
    .filter((value) => typeof value === 'string' && value.length <= 180)
    .flatMap((value) => reasoningWords(value.split(/[\\/]/).pop()))
    .filter((word) => word.length >= 3 && !reasoningTargetStopWords.has(word)));
}

/** Pick a short, original English reasoning sentence for local translation. */
export function selectReasoningExcerpt(text, action) {
  if (typeof text !== 'string' || !text) return '';
  const category = action?.category || reasoningToolCategories[action?.name] || action?.name;
  const actionCue = Object.hasOwn(reasoningActionCues, category) ? reasoningActionCues[category] : null;
  const targets = reasoningTargets(action);
  let best = '';
  let bestScore = 0;
  let fence = '';

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const marker = line.match(/^(`{3,}|~{3,})/)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (line === marker && marker[0] === fence[0] && marker.length >= fence.length) fence = '';
      continue;
    }
    if (fence || !line || /^(?:\t| {4}|\s*[>{}\[\]`#])/.test(raw)) continue;
    const prose = line.replace(/^(?:[-*+]\s+|\d+[.)]\s+)/, '');
    const sentences = reasoningSentenceSegmenter
      ? Array.from(reasoningSentenceSegmenter.segment(prose), ({ segment }) => segment)
      : prose.split(/(?<=[.!?])\s+/);
    for (const part of sentences) {
      const sentence = part.trim();
      if (sentence.length < 12 || sentence.length > 320 || !reasoningEnglishCue.test(sentence)) continue;
      if (/^(?:(?:the )?user (?:asks?|asked|wants?|requests?|requested)|(?:const|let|var)\s+\w+\s*=)/i.test(sentence)) continue;
      const words = reasoningWords(sentence);
      const englishLetters = (sentence.match(/[a-z]/gi) || []).length;
      const allLetters = (sentence.match(/\p{L}/gu) || []).length;
      if (words.length < 4 || englishLetters * 3 < allLetters * 2) continue;

      const why = reasoningWhyCue.test(sentence);
      const matchingAction = actionCue?.test(sentence) === true;
      if (!why && !matchingAction) continue;
      if (actionCue && !matchingAction && Object.values(reasoningActionCues).some((cue) => cue.test(sentence))) continue;
      const matchingTarget = words.some((word) => targets.has(word));
      const score = 8 * Number(matchingAction) + 6 * Number(matchingTarget) + 3 * Number(why);
      if (score >= bestScore) {
        best = sentence;
        bestScore = score;
      }
    }
  }
  return best;
}
