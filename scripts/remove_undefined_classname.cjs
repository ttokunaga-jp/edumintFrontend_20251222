#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb){
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    if(fs.statSync(p).isDirectory()) walk(p,cb);
    else if(/\.(tsx|jsx|ts|js)$/.test(p)) cb(p);
  }
}

const root = path.join(__dirname,'..','src');
let changed=0;
walk(root, (file)=>{
  let s = fs.readFileSync(file,'utf8');
  const ns = s.replace(/\s+className\s*=\s*\{\s*undefined\s*\}/g,'');
  if(ns!==s){
    fs.writeFileSync(file, ns, 'utf8');
    console.log('Patched',file);
    changed++;
  }
});
console.log('Total files changed:',changed);
process.exit(0);
