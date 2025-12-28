#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcRoot = path.join(root, 'src');

function getFilesRecursive(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      getFilesRecursive(p, out);
    } else {
      if (/\.(ts|tsx|js|jsx|css|md)$/.test(ent.name)) out.push(p);
    }
  }
  return out;
}

const patterns = [
  /\bclassName\b/gi,
  /\bcn\b/gi,
  /\bcls\b/gi,
  /bg-/gi,
  /text-/gi,
  /\bflex\b/gi,
  /\bgrid\b/gi,
  /gap-/gi,
  /rounded\b/gi,
  /hover:/gi,
  /md:/gi,
  /sm:/gi,
  /dark:/gi,
  /sr-/gi,
  /\bprose\b/gi,
  /min-h-screen/gi,
  /opacity-/gi,
  /fill-/gi,
  /stroke-/gi,
  /--tw-/gi,
  /@tailwind/gi,
  /\btailwind\b/gi,
  /\btw-/gi
];

function purgeFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  // Remove import lines referencing cn/cls
  content = content.replace(/^\s*import\s+\{?\s*(cn|cls)\s*\}?[^;]*;\s*$/gmi, '');
  // Remove className=... (all variants)
  content = content.replace(/\bclassName\s*=\s*\{[\s\S]*?\}/g, '');
  content = content.replace(/\bclassName\s*=\s*"[^"]*"/g, '');
  content = content.replace(/\bclassName\s*=\s*'[^']*'/g, '');

  for (const p of patterns) content = content.replace(p, '');

  // cleanup
  content = content.replace(/\s+,/g, ',');
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/\{\s*\}/g, '');
  content = content.replace(/\(\s*\)/g, '()');
  content = content.replace(/\s+>/g, '>');
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    return true;
  }
  return false;
}

const files = getFilesRecursive(srcRoot);
let totalChanged = 0;
let pass = 0;
while (pass < 10) {
  pass++;
  let changed = 0;
  for (const f of files) {
    try {
      if (purgeFile(f)) changed++;
    } catch (e) {
      console.error('ERR', f, e.message);
    }
  }
  console.log('Pass', pass, 'changed', changed);
  totalChanged += changed;
  if (changed === 0) break;
}

// Report remaining matches (sample up to 200)
const remaining = [];
const tokenRe = new RegExp(patterns.map(r => r.source).join('|'), 'gi');
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  if (tokenRe.test(c)) remaining.push(f);
}
console.log('Total changed files:', totalChanged);
console.log('Remaining files with matches:', remaining.length);
if (remaining.length) console.log(remaining.slice(0,200).join('\n'));
process.exit(0);
