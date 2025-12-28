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

  // Remove className="..." where the content contains hyphen or slash or parentheses or '%'
  src = src.replace(/className\s*=\s*"([^"]*[-\/\(\)%\[\]#:][^"]*)"/g, () => '');
  src = src.replace(/className\s*=\s*'([^']*[-\/\(\)%\[\]#:][^']*)'/g, () => '');
  // template literal
  src = src.replace(/className\s*=\s*`([^`]*[-\/\(\)%\[\]#:][^`]*)`/g, () => '');

  // Remove string literal args inside cn(...) that contain hyphen/slash/etc
  src = src.replace(/className\s*=\s*\{\s*cn\s*\(([^)]*)\)\s*\}/g, (m, args) => {
    // Split top-level commas
    const parts = [];
    let cur = '';
    let depth = 0;
    for (let i = 0; i < args.length; i++) {
      const ch = args[i];
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        parts.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) parts.push(cur.trim());

    const newParts = parts.map(p => {
      const m1 = p.match(/^"([^"]*)"$/);
      const m2 = p.match(/^'([^']*)'$/);
      if (m1) {
        if (/[-\/\(\)%\[\]#:\s]/.test(m1[1])) return null;
        return `"${m1[1]}"`;
      }
      if (m2) {
        if (/[-\/\(\)%\[\]#:\s]/.test(m2[1])) return null;
        return `'${m2[1]}'`;
      }
      return p;
    }).filter(Boolean);

    if (newParts.length === 0) return '';
    return `className={cn(${newParts.join(', ')})}`;
  });

  // Clean up leftover empty className braces
  src = src.replace(/className\s*=\s*\{\s*\}\s*/g, '');

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
