#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb){
  for(const f of fs.readdirSync(dir)){
    const p=path.join(dir,f);
    if(fs.statSync(p).isDirectory()) walk(p,cb);
    else if(/\.(tsx|jsx|ts|js)$/.test(p)) cb(p);
  }
}

const root = path.join(__dirname,'..','src');
let changed=0;
walk(root, (file)=>{
  let s = fs.readFileSync(file,'utf8');
  const orig = s;
  // Replace patterns like '}}/>' -> '}/>' and '}} />' -> '} />'
  s = s.replace(/\}\}\s*\/\>/g, '}/>');
  s = s.replace(/\}\}\s*\>/g, '} >');
  s = s.replace(/\{\.\.\.props\}\}\//g, '{...props}/'); // handle {...props}}/>
  // some cases like '}} />' -> '} />'
  s = s.replace(/\}\}\s*\/>/g, '}/>');

  if(s !== orig){
    fs.writeFileSync(file, s, 'utf8');
    console.log('Normalized', file);
    changed++;
  }
});
console.log('Total files changed:', changed);
process.exit(0);
