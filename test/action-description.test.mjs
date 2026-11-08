import assert from 'node:assert/strict';
import test from 'node:test';
import { describeRecordedAction } from '../src/action-description.js';

const describe = (command, lang = 'zh', name = 'pwsh') => describeRecordedAction({ name, args: { command } }, lang);

test('identifies the specific app, file, or website requested by a launch', () => {
  assert.deepEqual(describe("Start-Process -FilePath notepad.exe -ArgumentList 'C:\\work\\notes.txt'"), {
    title: '打开记事本',
    subject: 'notes.txt',
  });
  assert.deepEqual(describe("& 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe' 'https://example.com/?key=hidden'", 'en'), {
    title: 'Open Microsoft Edge',
    subject: 'example.com',
  });
  assert.deepEqual(describe("Invoke-Item -LiteralPath 'C:\\work\\report draft.docx'"), {
    title: '打开文件或目录',
    subject: 'report draft.docx',
  });
  assert.deepEqual(describe("Start-Process 'https://example.com/?key=hidden'"), {
    title: '打开网页',
    subject: 'example.com',
  });
});

test('shows the actual target of file, search, and test invocations', () => {
  assert.deepEqual(describe('# Read config\nGet-Content -LiteralPath ./internal-config.ps1; Write-Host "done"'), {
    title: '读取文件',
    subject: 'internal-config.ps1',
  });
  assert.deepEqual(describe("rg -n -e 'quick flow' src", 'en', 'bash'), {
    title: 'Search text',
    subject: 'quick flow',
  });
  assert.deepEqual(describe("rg --files -g '*.test.mjs'"), {
    title: '查找文件路径',
    subject: '*.test.mjs',
  });
  assert.deepEqual(describe('node --test test/view.smoke.mjs'), {
    title: '运行测试',
    subject: 'view.smoke.mjs',
  });
});

test('does not treat a quoted example, nested command, or dynamic path as the observed target', () => {
  assert.equal(describe("Write-Output 'Start-Process notepad.exe'"), null);
  assert.equal(describe("'notepad.exe'"), null);
  assert.equal(describe("if ($condition) { Start-Process notepad.exe }"), null);
  assert.deepEqual(describe("Start-Process -FilePath $selectedProgram"), { title: '启动程序', subject: '' });
  assert.deepEqual(describe('code --list-extensions'), { title: '运行程序', subject: 'VS Code' });
});
