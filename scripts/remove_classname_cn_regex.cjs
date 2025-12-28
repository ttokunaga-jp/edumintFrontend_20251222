#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcRoot = path.join(root, 'src');

function getFilesRecursive(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) getFilesRecursive(p, out);
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) out.push(p);
  }
  return out;
}

const files = getFilesRecursive(srcRoot);
let changed = 0;
for (const f of files) {
  try {
    let c = fs.readFileSync(f, 'utf8');
    const orig = c;
    // remove import { cn } ... and import cn from ...
    c = c.replace(/^\s*import\s+\{?\s*cn\s*\}?[^;]*;?\s*$/gmi, '');
    c = c.replace(/^\s*import\s+cn\s+from\s+[^;]+;?\s*$/gmi, '');

    // className={cn(...)} or className=cn(...)
    c = c.replace(/\bclassName\s*=\s*\{?\s*cn\([\s\S]*?\)\s*\}?/gi, '');
    // className={cls(...)}
    c = c.replace(/\bclassName\s*=\s*\{?\s*cls\([\s\S]*?\)\s*\}?/gi, '');

    // direct cn(...) usages
    c = c.replace(/\bcn\s*\([\s\S]*?\)/gi, '');
    c = c.replace(/\bcls\s*\([\s\S]*?\)/gi, '');

    // className="..." or '...' or `...`
    c = c.replace(/\bclassName\s*=\s*"[\s\S]*?"/gi, '');
    c = c.replace(/\bclassName\s*=\s*'[\s\S]*?'/gi, '');
    c = c.replace(/\bclassName\s*=\s*`[\s\S]*?`/gi, '');

    // Tidy up
    c = c.replace(/\s+,/g, ',');
    c = c.replace(/,\s*,/g, ',');
    c = c.replace(/\{\s*\}/g, '');
    c = c.replace(/\(\s*\)/g, '()');
    c = c.replace(/\s+>/g, '>');
    c = c.replace(/\n{3,}/g, '\n\n');

    if (c !== orig) {
      fs.writeFileSync(f, c, 'utf8');
      changed++;
    }
  } catch (e) { console.error('ERR', f, e.message); }
}
console.log('Regex className/cn removal done. Scanned:', files.length, 'Changed:', changed);
process.exit(0);
