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

const tokens = [
  'className','cn','cls','bg-','text-','flex','grid','gap-','rounded','hover:','md:','sm:','dark:','sr-','prose','min-h-screen','opacity-','fill-','stroke-'
];

function purgeAll(file) {
  let s = fs.readFileSync(file,'utf8');
  const orig = s;
  for (const t of tokens) {
    const re = new RegExp(t.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&'), 'gi');
    s = s.replace(re, '');
  }
  // cleanup repeated whitespace
  s = s.replace(/\s{2,}/g,' ');
  s = s.replace(/\n{3,}/g,'\n\n');
  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    return true;
  }
  return false;
}

const files = getFilesRecursive(srcRoot);
let changed = 0;
for (const f of files) {
  try { if (purgeAll(f)) changed++; } catch(e){ console.error('ERR', f, e.message); }
}
console.log('Brutal purge done. Scanned:', files.length, 'Changed:', changed);
process.exit(0);
