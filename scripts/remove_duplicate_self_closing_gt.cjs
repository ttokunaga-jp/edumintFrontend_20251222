#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  fs.readdirSync(dir).forEach(name => {
    const p = path.join(dir, name);
    if (fs.lstatSync(p).isDirectory()) walk(p, cb);
    else cb(p);
  });
}

const root = path.resolve(__dirname, '..', 'src');
const files = [];
walk(root, p => { if (p.endsWith('.tsx')) files.push(p); });
let changed = 0;
files.forEach(file => {
  let src = fs.readFileSync(file, 'utf8');
  let old = src;
  // Collapse duplicate '/>' into single '/>' when they appear consecutively
  src = src.replace(/\/>(\s*\n\s*)\/>/g, '/>' + '$1');
  // Also remove stray duplicate '/>' lines (exact duplicates)
  src = src.replace(/(^\s*\/>{2,}\s*$\n?)/gm, '/>\n');
  if (src !== old) {
    fs.writeFileSync(file, src);
    console.log('Fixed', file);
    changed++;
  }
});
console.log('Done. Files changed:', changed);
