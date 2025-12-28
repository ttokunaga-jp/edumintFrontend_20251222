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
  let modified = false;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '>') {
      // find previous non-empty line index
      let j = i - 1;
      while (j >= 0 && lines[j].trim() === '') j--;
      if (j >= 0) {
        const prev = lines[j];
        const prevTrim = prev.trim();
        // skip if prev already ends with > or is a string literal line
        if (/[>\/]$/.test(prevTrim) || /^['"`]/.test(prevTrim)) continue;
        // append '>' to previous line
        lines[j] = prev + '>';
        lines.splice(i, 1);
        i--; modified = true;
      }
    }
  }
  if (modified) {
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Fixed', file);
    changed++;
  }
});
console.log('Done. Files changed:', changed);
