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
let totalFiles = 0;
let changedFiles = 0;
let totalReplacements = 0;

for (const dir of targetDirs) {
  walk(dir, (file) => {
    if (!exts.includes(path.extname(file))) return;
    totalFiles++;
    let src = fs.readFileSync(file, 'utf8');
    const original = src;

    // Remove '>' following block comments: '*/>' -> '*/'
    const r1 = (src.match(/\*\/\s*>/g) || []).length;
    src = src.replace(/\*\/\s*>/g, '*/');

    // Remove spurious '>' following closing JSX expression ')}>' -> ')}'
    const r2 = (src.match(/\)\}\s*>/g) || []).length;
    src = src.replace(/\)\}\s*>/g, ')}');

    // Remove spurious '>' following closing JSX expression '])}>' etc: '}]>' -> '}]'
    const r3 = (src.match(/\]\}\s*>/g) || []).length;
    src = src.replace(/\]\}\s*>/g, ']}');

    if (src !== original) {
      fs.writeFileSync(file, src, 'utf8');
      changedFiles++;
      totalReplacements += r1 + r2 + r3;
      console.log(`Patched ${file} (r1:${r1}, r2:${r2}, r3:${r3})`);
    }
  });
}

console.log(`Scanned ${totalFiles} files, changed ${changedFiles} files, total replacements: ${totalReplacements}`);
process.exit(0);
