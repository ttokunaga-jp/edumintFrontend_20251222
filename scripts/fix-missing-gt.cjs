#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) files.push(...walk(p));
    else files.push(p);
  }
  return files;
}

const root = path.join(__dirname, '..', 'src');
const files = walk(root).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
let changes = 0;
for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  const original = src;
  // 1) Insert missing '>' after closing JSX style/prop object when followed by another tag
  src = src.replace(/(\}\})\s+</g, '$1 > <');
  // 2) Fix occurrences of 'style={{ display: }}' -> 'style={{ display: undefined }}'
  src = src.replace(/style=\{\{([^}]*)display\s*:\s*\}\}/g, (m, before) => `style={{${before}display: undefined}}`);
  // 3) Remove stray sequences like "> }>' after tags: replace "> }>' with ">"
  src = src.replace(/>\s*\}>/g, '>');
  // 4) Remove extra brace before '>' in sequences like '}} }>' -> '}}>'
  src = src.replace(/(\}\})\s*\}\s*>/g, '$1>');

  if (src !== original) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('Fixed:', file);
    changes++;
  }
}
console.log('Done. Files changed:', changes);
process.exit(0);
