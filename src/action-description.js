import { basename, clip } from './model.js';

const ACTION_PROGRAMS = {
  notepad: ['记事本', 'Notepad'],
  explorer: ['文件资源管理器', 'File Explorer'],
  msedge: ['Microsoft Edge', 'Microsoft Edge'],
  chrome: ['Chrome', 'Chrome'],
  firefox: ['Firefox', 'Firefox'],
  mspaint: ['画图', 'Paint'],
  calc: ['计算器', 'Calculator'],
  code: ['VS Code', 'VS Code'],
  winword: ['Word', 'Word'],
  excel: ['Excel', 'Excel'],
  powerpnt: ['PowerPoint', 'PowerPoint'],
  wt: ['Windows 终端', 'Windows Terminal'],
};

// Recognize the first direct invocation, without executing or inspecting nested
// scripts. Subsequent statements, quoted command examples and comments are not
// evidence that a particular command ran.
function recordedCommandWords(source, powershell) {
  const input = source.slice(0, 4096).trimStart()
    .replace(/^(?:(?:#[^\r\n]*(?:\r?\n|$)|<#[\s\S]*?#>)\s*)+/, '');
  // A bare quoted string is an expression in PowerShell, while "& 'path'"
  // explicitly invokes a program.
  if (powershell && /^["']/.test(input)) return [];
  const command = powershell ? input.replace(/^&[ \t]+/, '') : input;
  const token = /(?:[^ \t\r\n"';|&<>(){}`]+|"(?:[^"`]|`.)*"|'(?:[^']|'')*')+/y;
  const words = [];
  let index = 0;
  while (words.length < 48) {
    while (command[index] === ' ' || command[index] === '\t') index += 1;
    token.lastIndex = index;
    const match = token.exec(command);
    if (!match) break;
    words.push(match[0]);
    index = token.lastIndex;
  }
  return words;
}

function actionLiteral(word) {
  if (!word || /[\r\n]/.test(word)) return '';
  if (word.startsWith("'") && word.endsWith("'")) return word.slice(1, -1).replace(/''/g, "'");
  const text = word.startsWith('"') && word.endsWith('"') ? word.slice(1, -1) : word;
  return /[\r\n$`"{}]|%[^%]+%/.test(text) ? '' : text;
}

function actionOption(words, ...names) {
  for (const [index, word] of words.entries()) {
    const separator = word.search(/[:=]/);
    const option = (separator < 0 ? word : word.slice(0, separator)).toLowerCase();
    if (names.includes(option)) return actionLiteral(separator < 0 ? words[index + 1] : word.slice(separator + 1));
  }
  return '';
}

function actionPath(words) {
  const explicit = actionOption(words, '-literalpath', '-path', '-filepath', '-file', '-f', '--file');
  const positional = words[0] && !words[0].startsWith('-') ? actionLiteral(words[0]) : '';
  return basename(explicit || positional);
}

function actionHost(target) {
  if (!/^https?:\/\//i.test(target)) return '';
  try {
    return new URL(target).hostname;
  } catch {
    return '';
  }
}

function programAction(program, target, locale) {
  const name = basename(program);
  const key = name.toLowerCase().replace(/\.exe$/, '');
  const app = Object.hasOwn(ACTION_PROGRAMS, key) ? ACTION_PROGRAMS[key] : null;
  const subject = actionHost(target) || (target && !/^[-/]\w+(?:\s|$)/.test(target) ? basename(target) : '');
  if (app) {
    return { title: (locale === 0 ? '打开' : 'Open ') + app[locale], subject: clip(subject, 65) };
  }
  return { title: locale === 0 ? '启动程序' : 'Start a program', subject: clip(name, 65) };
}

/** Human-readable action derived from a recorded shell request's literal data. */
export function describeRecordedAction(item, lang) {
  const source = item?.args?.command;
  if (typeof source !== 'string') return null;
  const [command, ...words] = recordedCommandWords(source, item.name === 'pwsh');
  const program = actionLiteral(command);
  const exe = basename(program).toLowerCase();
  const name = exe.replace(/\.exe$/, '');
  const first = actionLiteral(words[0]);
  const locale = lang === 'zh' ? 0 : 1;
  const summary = (zh, en, subject = '') => ({ title: locale === 0 ? zh : en, subject: clip(subject, 65) });

  if (name === 'start-process' || (item.name === 'pwsh' && ['start', 'saps'].includes(name))) {
    const target = actionOption(words, '-filepath') || (first.startsWith('-') ? '' : first);
    if (!target || target.startsWith('-')) return summary('启动程序', 'Start a program');
    const host = actionHost(target);
    if (host) return summary('打开网页', 'Open a web page', host);
    if (target.toLowerCase().startsWith('ms-settings:')) return summary('打开 Windows 设置', 'Open Windows Settings');
    if (/\.(?!exe$|com$|cmd$|bat$)[a-z0-9]{1,8}$/i.test(target)) {
      return summary('打开文件', 'Open a file', basename(target));
    }
    const argument = actionOption(words, '-argumentlist', '-args');
    return programAction(target, argument, locale);
  }
  if (['invoke-item', 'ii'].includes(name)) return summary('打开文件或目录', 'Open a file or folder', actionPath(words));
  if (Object.hasOwn(ACTION_PROGRAMS, name) && (exe.endsWith('.exe') || ['explorer', 'code', 'notepad'].includes(name))) {
    if (words.some((word) => /^(?:--?|\s*\/)(?:help|version|list-extensions|install-extension|uninstall-extension)$/.test(word))) {
      return summary('运行程序', 'Run a program', ACTION_PROGRAMS[name][locale]);
    }
    const target = first.replace(/^\/select,/, '');
    return programAction(program, target, locale);
  }

  if (['get-content', 'cat'].includes(name)) return summary('读取文件', 'Read a file', actionPath(words));
  if (['get-childitem', 'ls', 'dir'].includes(name)) return summary('列出目录内容', 'List folder contents', actionPath(words));
  if (['test-path', 'get-item'].includes(name)) return summary('检查路径', 'Check a path', actionPath(words));
  if (['get-process', 'tasklist'].includes(name)) {
    return summary('检查运行中的程序', 'Check running programs', actionOption(words, '-name', '-processname') || (first.startsWith('-') ? '' : first));
  }
  if (['get-command', 'where'].includes(name)) {
    return summary('查找可用程序', 'Find an available program', actionOption(words, '-name') || (first.startsWith('-') ? '' : first));
  }
  if (name === 'rg' && words.includes('--files')) {
    return summary('查找文件路径', 'Find file paths', actionOption(words, '-g', '--glob'));
  }
  if (['rg', 'grep', 'select-string'].includes(name)) {
    const pattern = actionOption(words, '-e', '--regexp', '-pattern') || (first.startsWith('-') ? '' : first);
    return summary('搜索文本', 'Search text', pattern);
  }
  if (['invoke-webrequest', 'invoke-restmethod', 'curl'].includes(name)) {
    return summary('请求网页', 'Request a web page', actionHost(actionOption(words, '-uri') || first));
  }
  if (name === 'git') {
    const gitArgs = words[0] === '-C' ? words.slice(2) : words;
    if (gitArgs[0] === 'status') return summary('查看 Git 状态', 'Check Git status');
    if (gitArgs[0] === 'diff') return summary('查看代码差异', 'Inspect changes');
  }
  if (name === 'node' && first === '--test') {
    return summary('运行测试', 'Run tests', words[1] && !words[1].startsWith('-') ? basename(actionLiteral(words[1])) : '');
  }
  if (name === 'node' && basename(first) === 'build.mjs') return summary('构建项目', 'Build the project', 'build.mjs');
  if (['npm', 'npm.cmd', 'pnpm', 'pnpm.cmd', 'yarn', 'yarn.cmd'].includes(name)) {
    const script = first === 'run' ? actionLiteral(words[1]) : first;
    if (script === 'test') return summary('运行测试', 'Run tests');
    if (script === 'build') return summary('构建项目', 'Build the project');
  }
  if (['node', 'python', 'python3', 'pwsh', 'powershell'].includes(name)) {
    const script = actionPath(words);
    if (/\.(?:c?js|mjs|py|ps1)$/i.test(script)) return summary('运行脚本', 'Run a script', script);
  }
  if (exe.endsWith('.exe')) return summary('运行程序', 'Run a program', basename(program));
  return null;
}
