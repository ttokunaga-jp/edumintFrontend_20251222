#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, out) {
  fs.readdirSync(dir).forEach(name => {
    const p = path.join(dir, name);
    if (fs.lstatSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx') || p.endsWith('.jsx')) out.push(p);
  });
}

const files = [];
walk(path.join(__dirname, '..', 'src'), files);
let changed = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const orig = s;
  // Remove any className=... attribute (string, template, or expression) - non-greedy
  s = s.replace(/\s+className\s*=\s*(?:"[\s\S]*?"|'[\s\S]*?'|\{`[\s\S]*?`\}|\{[\s\S]*?\})/g, '');
  // Also remove containerClassName or other variants commonly used
  s = s.replace(/\s+containerClassName\s*=\s*(?:"[\s\S]*?"|'[\s\S]*?'|\{`[\s\S]*?`\}|\{[\s\S]*?\})/g, '');
  if (s !== orig) {
    fs.writeFileSync(f, s, 'utf8');
    console.log('Removed className attributes in', f);
    changed++;
  }
}
console.log('Done. Files affected:', changed);
