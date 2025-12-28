#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'index.css');
let src = fs.readFileSync(file, 'utf8');
const lines = src.split('\n');
let kept = [];
let removed = 0;
for (const line of lines) {
  if (line.includes('--tw-') || line.includes('var(--tw-')) {
    removed++;
    continue;
  }
  kept.push(line);
}
fs.writeFileSync(file, kept.join('\n'), 'utf8');
console.log(`Removed ${removed} lines containing --tw- references from src/index.css`);
process.exit(0);
