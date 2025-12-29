#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = ['.ts', '.tsx'];

let changed = 0;

function walk(dir){
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if(st.isDirectory()) walk(p);
    else if(exts.includes(path.extname(p))){
      let s = fs.readFileSync(p, 'utf8');
      let original = s;
      // Remove stray sequences like '}>' followed by another '<' (e.g. "}</h3> }><div")
      s = s.replace(/\}\>\s*(?=\<)/g, '');
      // Also remove isolated sequences like "> }>", "<Avatar> }>", which can appear before next tag
      s = s.replace(/>\s*\}\>\s*(?=\<)/g, '>');
      // Replace occurrences of "> }\)" inside JSX where stray '}' before ')' exist: 
      // e.g. "</h3> } )" -> ")"
      s = s.replace(/\}\>\s*\)/g, ')');

      if(s !== original){
        fs.writeFileSync(p, s, 'utf8');
        changed++;
        console.log('fixed', p.replace(root + '/', ''));
      }
    }
  }
}

walk(path.join(root, 'src'));
console.log('done. changed=', changed);
