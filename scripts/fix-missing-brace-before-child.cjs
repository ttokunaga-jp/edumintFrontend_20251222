#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir){
  const files = fs.readdirSync(dir);
  for(const f of files){
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if(st.isDirectory()) walk(p);
    else if(p.endsWith('.tsx') || p.endsWith('.jsx')) fixFile(p);
  }
}

function fixFile(file){
  let s = fs.readFileSync(file, 'utf8');
  const original = s;
  // Insert missing closing '}' and '>' before an immediate child '<' inside JSX
  s = s.replace(/\{([^}<>]+?)</g, (m, g1) => `{${g1}> <`);
  if(s !== original){
    fs.writeFileSync(file, s, 'utf8');
    console.log('Inserted missing brace/gt in:', file);
  }
}

walk(path.join(__dirname, '..', 'src'));
console.log('Done');
