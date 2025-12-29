#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const exts = ['.ts', '.tsx'];
let changed = 0;

const re = /style=\{\{([^\}]*?)\s*\</g;

function walk(dir){
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if(st.isDirectory()) walk(p);
    else if(exts.includes(path.extname(p))){
      let s = fs.readFileSync(p, 'utf8');
      let original = s;
      s = s.replace(re, (m, inner) => `style={{${inner}}}><`);
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
