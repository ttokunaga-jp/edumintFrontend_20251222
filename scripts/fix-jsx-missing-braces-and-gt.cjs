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
  let original = s;
  let changed = false;

  // 1) Insert missing closing '}' before immediate child '<'
  const reMissingBrace = /\{([^}<>]+?)</g;
  s = s.replace(reMissingBrace, (m, g1) => {
    if(/[<>=]/.test(g1)) return m;
    changed = changed || (m !== `{${g1}> <`);
    return `{${g1}> <`;
  });

  // 2) Insert missing '>' after '}' when followed by plaintext and eventual closing tag in same line
  const reMissingGt = /(\})(\s+)([^\s<][^\n<]*?<\/([A-Za-z0-9_-]+)>)/g;
  s = s.replace(reMissingGt, (m, g1, g2, g3) => {
    changed = true;
    return `${g1}>${g2}${g3}`;
  });

  if(changed && s !== original){
    fs.writeFileSync(file, s, 'utf8');
    console.log('Fixed:', file);
  }
}

walk(path.join(__dirname, '..', 'src'));
console.log('Done');
