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
  // Insert missing '>' after a closing '}}' when next line starts with '<'
  src = src.replace(/}}\s*\n(\s*)</g, '}}>\n$1<');
  // Remove stray lines that are just '}' followed by '>' (possibly with spaces)
  src = src.replace(/^\s*}\s*>\s*$/gm, '>');
  if (src !== old) {
    fs.writeFileSync(file, src);
    console.log('Fixed', file);
    changed++;
  }
});
console.log('Done. Files changed:', changed);
