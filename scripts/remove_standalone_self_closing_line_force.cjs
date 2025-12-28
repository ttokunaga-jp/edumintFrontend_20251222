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
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const newLines = lines.filter(l => l.trim() !== '/>');
  if (newLines.length !== lines.length) {
    fs.writeFileSync(file, newLines.join('\n'));
    console.log('Fixed', file, 'removed', lines.length - newLines.length, "lines");
    changed++;
  }
});
console.log('Done. Files changed:', changed);
