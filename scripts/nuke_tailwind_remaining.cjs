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

const tokenRegexes = [
  /\s*className=\{[^}]*\}/g, // remove className={...}
  /\s*className=\"[^\"]*\"/g, // remove className="..."
  /\bcn\s*\([^)]*\)/g, // remove cn(...)
  /\bcls\s*\([^)]*\)/g, // remove cls(...)
  /\bclassName\b/g, // remove remaining className words
  /\bcn\b/g, // remove lone cn identifier
  /\bcls\b/g, // remove lone cls identifier
  /bg-/g,
  /text-/g,
  /\bflex\b/g,
  /\bgrid\b/g,
  /gap-/g,
  /rounded\b/g,
  /hover:/g,
  /md:/g,
  /sm:/g,
  /dark:/g,
  /sr-/g,
  /\bprose\b/g,
  /min-h-screen/g,
  /opacity-/g,
  /fill-/g,
  /stroke-/g,
  /--tw-/g,
  /@tailwind/g,
  /\btailwind\b/gi,
  /\btw-\b/g,
];

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;

  // Remove cn/cls import lines
  content = content.replace(/^\s*import\s+\{?\s*(cn|cls)\s*\}?[^;]*;\s*$/gmi, '');

  // Run token replacements
  for (const re of tokenRegexes) content = content.replace(re, '');

  // Remove empty attributes left behind like  ,  or duplicate commas in arrays/objects
  content = content.replace(/\s+,/g, ',');
  content = content.replace(/,\s*\)/g, ')');
  content = content.replace(/\(,\s*/g, '(');
  content = content.replace(/\s+>/g, '>');

  // Trim trailing whitespace lines
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    return true;
  }
  return false;
}

const files = getFilesRecursive(srcRoot);
let changed = 0;
for (const f of files) {
  try {
    if (processFile(f)) changed++;
  } catch (e) {
    console.error('ERR', f, e.message);
  }
}
console.log('Done. Scanned:', files.length, 'Changed:', changed);
process.exit(0);
