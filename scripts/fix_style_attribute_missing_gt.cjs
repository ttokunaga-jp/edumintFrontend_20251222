#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

const repoRoot = path.resolve(__dirname, '..');
const targetDirs = [path.join(repoRoot, 'src')];
const exts = ['.tsx', '.jsx'];
let changedFiles = 0;
let totalInserted = 0;

for (const dir of targetDirs) {
  walk(dir, (file) => {
    if (!exts.includes(path.extname(file))) return;
    let src = fs.readFileSync(file, 'utf8');
    const original = src;

    let i = 0;
    let out = '';
    while (true) {
      const idx = src.indexOf('style={{', i);
      if (idx === -1) break;
      // copy up to idx
      out += src.slice(i, idx);
      // find matching '}}'
      let j = idx + 'style={{'.length;
      let braceDepth = 2; // we've consumed two '{'
      for (; j < src.length; j++) {
        const ch = src[j];
        if (ch === '{') braceDepth++;
        else if (ch === '}') braceDepth--;
        if (braceDepth === 0) break;
      }
      if (braceDepth !== 0) {
        // unbalanced, abort for this file
        out += src.slice(idx);
        break;
      }
      // at j, we are at the '}' that closes outer
      // ensure following characters before newline include '>' somewhere
      const restOfLine = src.slice(j + 1, src.indexOf('\n', j + 1) === -1 ? src.length : src.indexOf('\n', j + 1));
      if (!restOfLine.includes('>') && !restOfLine.includes('/>')) {
        // find insertion point: after j+1
        out += src.slice(idx, j + 1) + '>';
        totalInserted++;
        i = j + 1; // continue after the '}' we handled
      } else {
        out += src.slice(idx, j + 1);
        i = j + 1;
      }
    }
    out += src.slice(i);
    if (out !== original) {
      fs.writeFileSync(file, out, 'utf8');
      changedFiles++;
      console.log(`Fixed style tag in ${file} (insertedGtApprox: ${totalInserted})`);
    }
  });
}
console.log(`Changed files: ${changedFiles}, insertions approx: ${totalInserted}`);
process.exit(0);
