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

const patterns = [
  /\s*className\s*=\s*"[^"]*"/s,
  /\s*className\s*=\s*'[^']*'/s,
  /\s*className\s*=\s*`[^`]*`/s,
  /\s*className\s*=\s*\{[^}]*\}/s,
  /\s*className\s*=\s*[^>\s]+/s,
];

let files = 0;
let changed = 0;
walk(root, (file) => {
  files++;
  try {
    let src = fs.readFileSync(file, 'utf8');
    let orig = src;
    let any;
    do {
      any = false;
      for (const p of patterns) {
        if (p.test(src)) {
          src = src.replace(p, '');
          any = true;
        }
      }
    } while (any);
    if (src !== orig) {
      fs.writeFileSync(file, src, 'utf8');
      changed++;
    }
  } catch (e) {
    console.error('ERROR processing', file, e);
  }
});
console.log(`Done. Files scanned: ${files}. Files changed: ${changed}`);
process.exit(0);
