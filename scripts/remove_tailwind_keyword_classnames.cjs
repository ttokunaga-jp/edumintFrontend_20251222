#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const exts = ['.tsx', '.ts', '.jsx', '.js'];

const kws = ['text-', 'bg-', 'h-', 'w-', 'p-', 'm-', 'min-h', 'max-w', 'space-', 'gap-', 'rounded', 'border', 'shadow', 'opacity', 'fill-', 'stroke-', 'sr-only', 'prose', 'min-h-screen', 'md:', 'sm:', 'lg:', 'xl:', 'hover:', 'focus:', 'pointer-events-none', 'opacity-0', 'opacity-100', 'scale-'];
const kwRegex = new RegExp(kws.map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|'));

function walk(dir, cb) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, cb);
    else if (exts.includes(path.extname(full))) cb(full);
  }
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  let orig = src;

  src = src.replace(/className\s*=\s*"([^"]*)"/g, (m, inner) => kwRegex.test(inner) ? '' : m);
  src = src.replace(/className\s*=\s*'([^']*)'/g, (m, inner) => kwRegex.test(inner) ? '' : m);
  src = src.replace(/className\s*=\s*`([^`]*)`/g, (m, inner) => kwRegex.test(inner) ? '' : m);

  src = src.replace(/className\s*=\s*\{\s*cn\s*\(([^)]*)\)\s*\}/g, (m, inside) => kwRegex.test(inside) ? '' : m);

  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    return true;
  }
  return false;
}

let changed = 0;
let files = 0;
walk(root, (file) => {
  files++;
  try {
    if (processFile(file)) changed++;
  } catch (e) {
    console.error('ERROR processing', file, e);
  }
});
console.log(`Done. Files scanned: ${files}. Files changed: ${changed}`);
process.exit(0);
