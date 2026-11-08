/**
 * Build the single-file browser bundle from `src/`.
 *
 * The DSH Client module loader accepts exactly one module per package, so the
 * pure model, the React view, and the generated tool guide are concatenated
 * into one factory body. Run with `node build.mjs` after editing `src/`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = (relative) => readFileSync(join(root, relative), 'utf8');

/** Remove ES-module syntax so sources can share one factory scope. */
const stripModuleSyntax = (source) =>
  source
    .replace(/^import[\s\S]*?;$/gm, '')
    .replace(/^export\s+/gm, '');

const guide = JSON.parse(read('src/guide.json'));
const model = stripModuleSyntax(read('src/model.js'));
const actionDescription = stripModuleSyntax(read('src/action-description.js'));
const reasoningExcerpt = stripModuleSyntax(read('src/reasoning-excerpt.js'));
const view = stripModuleSyntax(read('src/view.js'));
const quickFlow = stripModuleSyntax(read('src/quick-flow.js'));

const bundle = `window.__ModuleLoader__.load({
  id: '@local/step-lens',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const GUIDE = ${JSON.stringify(guide, null, 2)};

${model}

${actionDescription}

${reasoningExcerpt}

${view}

${quickFlow}

    return {
      inject: ['slots', 'locale'],
      apply: installClientPlugin,
    };
  },
});
`;

writeFileSync(join(root, 'client.js'), bundle);
process.stdout.write('client.js written: ' + bundle.length + ' chars\n');
