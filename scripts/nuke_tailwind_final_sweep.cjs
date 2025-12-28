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

function sweepContent(content) {
  const orig = content;

  // Remove className=... (string, single-quote, brace) using single-line and dotAll
  content = content.replace(/\bclassName\s*=\s*\{[\s\S]*?\}/g, '');
  content = content.replace(/\bclassName\s*=\s*"[^"]*"/g, '');
  content = content.replace(/\bclassName\s*=\s*'[^']*'/g, '');

  // Remove any remaining cn(...) or cls(...)
  content = content.replace(/\bcn\s*\([^)]*\)/g, '');
  content = content.replace(/\bcls\s*\([^)]*\)/g, '');

  // Remove import lines referencing cn/cls
  content = content.replace(/^\s*import\s+\{?\s*(cn|cls)\s*\}?[^;]*;\s*$/gmi, '');

  // Remove common tailwind tokens anywhere
  const tokens = ['bg-', 'text-', 'flex', 'grid', 'gap-', 'rounded', 'hover:', 'md:', 'sm:', 'dark:', 'sr-', 'prose', 'min-h-screen', 'opacity-', 'fill-', 'stroke-', '--tw-', '@tailwind', 'tailwind', 'tw-'];
  for (const t of tokens) {
    const re = new RegExp(t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    content = content.replace(re, '');
  }

  // Remove any 'className' identifier remnants (params, destructuring)
  content = content.replace(/\bclassName\b/g, '');
  content = content.replace(/\bcn\b/g, '');
  content = content.replace(/\bcls\b/g, '');

  // Cleanup duplicate punctuation and empty props
  content = content.replace(/\s+,/g, ',');
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/\{\s*\}/g, '');
  content = content.replace(/\(\s*\)/g, '()');
  content = content.replace(/\s+>/g, '>');
  content = content.replace(/\n{3,}/g, '\n\n');

  return { content, changed: content !== orig };
}

const files = getFilesRecursive(srcRoot);
let changed = 0;
const touchedFiles = [];
for (const f of files) {
  try {
    const raw = fs.readFileSync(f, 'utf8');
    const res = sweepContent(raw);
    if (res.changed) {
      fs.writeFileSync(f, res.content, 'utf8');
      changed++;
      touchedFiles.push(f);
    }
  } catch (e) {
    console.error('ERR', f, e.message);
  }
}

console.log('Final sweep done. Scanned:', files.length, 'Changed:', changed);
if (touchedFiles.length) {
  console.log('Touched files (sample up to 50):');
  console.log(touchedFiles.slice(0, 50).join('\n'));
}

process.exit(0);
