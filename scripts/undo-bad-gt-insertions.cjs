#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ATTRS = ['value','onChange','placeholder','type','disabled','style','id','className','title','aria-','ref','name','label','checked','defaultValue']
const attrPattern = ATTRS.map(a => a.endsWith('-') ? `${a}[a-z-]*` : a).join('|');
const reBadGt = new RegExp(`\}>(\s+)(?=(${attrPattern})=)`,`g`);

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
  s = s.replace(reBadGt, (m, g1) => `}${g1}`);
  if(s !== original){
    fs.writeFileSync(file, s, 'utf8');
    console.log('Repaired bad > in:', file);
  }
}

walk(path.join(__dirname, '..', 'src'));
console.log('Done');
