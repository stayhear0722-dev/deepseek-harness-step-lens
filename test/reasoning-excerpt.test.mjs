import assert from 'node:assert/strict';
import test from 'node:test';
import { selectReasoningExcerpt } from '../src/reasoning-excerpt.js';

test('selects an exact reason tied to the recorded action and target', () => {
  const reason = 'I need to read `src/main.js` to verify which handler receives the event.';
  const text = `The user wants the feature. ${reason} I should also inspect the unrelated settings.`;
  const action = { name: 'read', args: { file_path: 'C:\\work\\src\\main.js' } };
  assert.equal(selectReasoningExcerpt(text, action), reason);
});

test('skips quotes and code and keeps an eligible nearby English sentence', () => {
  const reason = 'Run the tests to verify that the workflow still renders.';
  const text = [
    '这一步是为了核对流程显示是否正常。',
    '> I need to run fixture.mjs because the quote says so.',
    '```txt',
    'I need to run fixture.mjs because this is a code example.',
    '```',
    'I need to run the tests to confirm the old behavior.',
    `- ${reason}`,
  ].join('\n');
  assert.equal(selectReasoningExcerpt(text, { name: 'pwsh', subject: 'fixture.mjs' }), reason);
});

test('prefers reasoning for the actual action when plans mention several actions', () => {
  const reason = 'First I need to inspect the current sorting behavior.';
  const text = `${reason} Then I need to modify model.js to preserve the ordering.`;
  assert.equal(selectReasoningExcerpt(text, { name: 'read', subject: 'model.js' }), reason);
});

test('leaves unsupported or overlong reasoning in the original details', () => {
  assert.equal(selectReasoningExcerpt('The user wants a compact workflow.', { name: 'read' }), '');
  assert.equal(selectReasoningExcerpt('我需要先读取文件确认相关设置。', { name: 'read' }), '');
  assert.equal(selectReasoningExcerpt(`I need to read the ${'configuration '.repeat(30)}file.`, { name: 'read' }), '');
  assert.equal(selectReasoningExcerpt('A snapshot of the interface is available.', { name: 'read' }), '');
  assert.equal(selectReasoningExcerpt('I need to edit model.js to preserve the event ordering.', { name: 'read', subject: 'model.js' }), '');
});
