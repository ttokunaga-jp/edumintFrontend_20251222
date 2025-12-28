#!/usr/bin/env node
const fs = require('fs');
const f = 'src/components/primitives/sidebar.tsx';
const content = fs.readFileSync(f, 'utf8');
const newc = content.replace(/\bclassName\b/g, '');
fs.writeFileSync(f, newc, 'utf8');
console.log('done');
