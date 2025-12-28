#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const exts = ['.tsx', '.ts', '.jsx', '.js'];

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

  // Remove className={cn(...)} entirely if the inside contains any string literal (' or ")
  src = src.replace(/className\s*=\s*\{\s*cn\s*\(([^)]*)\)\s*\}/g, (m, inside) => {
    if (/['\"]/.test(inside)) return '';
    return m;
  });

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
