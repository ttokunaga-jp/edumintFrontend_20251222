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
const exts = ['.tsx', '.ts', '.jsx', '.js'];
let totalFiles = 0;
let changedFiles = 0;
let totalRemoved = 0;
let totalInsertedGt = 0;
let totalRemovedStandaloneGt = 0;

for (const dir of targetDirs) {
  walk(dir, (file) => {
    if (!exts.includes(path.extname(file))) return;
    totalFiles++;
    let src = fs.readFileSync(file, 'utf8');
    const original = src;

    // 1) Remove explicit className={undefined|null|""|false}
    src = src.replace(/\s+className\s*=\s*\{\s*(?:undefined|null|""|''|false)\s*\}/g, '');

    // 2) If a start tag's attribute list ends with '}' or '}}' then the '>' may have been lost and next line starts with '<'. Insert '>' before the next '<'.
    // e.g. '}}\n    <div' -> '}}>\n    <div'
    src = src.replace(/(\}+)[ \t]*\n([ \t]*<[^\n\r])/g, '$1>\n$2');
    // Also handle single '}' ending and immediate '<'
    src = src.replace(/(\})[ \t]*\n([ \t]*<[^\n\r])/g, '$1>\n$2');

    // 3) Remove standalone '>' on a line with only optional whitespace
    const standaloneGtMatches = src.match(/^\s*>\s*$/gm) || [];
    totalRemovedStandaloneGt += standaloneGtMatches.length;
    src = src.replace(/^\s*>\s*$/gm, '');

    if (src !== original) {
      fs.writeFileSync(file, src, 'utf8');
      changedFiles++;
      totalRemoved += (original.match(/className\s*=\s*\{\s*(?:undefined|null|""|''|false)\s*\}/g) || []).length;
      totalInsertedGt += (src.match(/>\n[ \t]*</g) || []).length; // estimation
      console.log(`Patched ${file} (removed: ${totalRemoved}, insertedGtApprox: ${totalInsertedGt})`);
    }
  });
}

console.log(`Scanned ${totalFiles} files, changed ${changedFiles} files.`);
console.log(`Removed className=undefined-like: ${totalRemoved}, removed standalone '>' lines: ${totalRemovedStandaloneGt}`);

if (changedFiles === 0) process.exit(0);
process.exit(0);
