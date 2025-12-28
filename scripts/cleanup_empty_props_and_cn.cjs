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

function findMatchingParen(src, i) {
  i++; let depth = 1; let inSingle=false, inDouble=false, inTemplate=false, escaped=false;
  while (i < src.length) {
    const ch = src[i];
    if (escaped) { escaped=false; i++; continue; }
    if (ch === '\\') { escaped = true; i++; continue; }
    if (inSingle) { if (ch === "'") inSingle=false; i++; continue; }
    if (inDouble) { if (ch === '"') inDouble=false; i++; continue; }
    if (inTemplate) { if (ch === '`') inTemplate=false; i++; continue; }
    if (ch === "'") { inSingle=true; i++; continue; }
    if (ch === '"') { inDouble=true; i++; continue; }
    if (ch === '`') { inTemplate=true; i++; continue; }
    if (ch === '(') { depth++; i++; continue; }
    if (ch === ')') { depth--; if (depth === 0) return i; i++; continue; }
    i++;
  }
  return -1;
}

let files=0, changed=0;
walk(root, (file) => {
  files++;
  try {
    let src = fs.readFileSync(file,'utf8');
    let orig = src;
    // replace cn(...) occurrences with empty string literal
    let idx = src.indexOf('cn(');
    while (idx !== -1) {
      const end = findMatchingParen(src, idx+2);
      if (end === -1) break;
      src = src.slice(0, idx) + '""' + src.slice(end+1);
      idx = src.indexOf('cn(', idx+1);
    }
    // Replace property: ,  => property: "",
    src = src.replace(/:\s*,/g, ': "",');
    // Replace property: \n\s*,
    src = src.replace(/:\s*\n\s*,/g, ': "",');
    // Replace sequences like \n\s*,\s*\n with single comma
    src = src.replace(/,\s*,/g, ',');

    if (src !== orig) { fs.writeFileSync(file, src, 'utf8'); changed++; }
  } catch (e) { console.error('ERROR', file, e); }
});
console.log(`Done. Files scanned: ${files}. Files changed: ${changed}`);
process.exit(0);
