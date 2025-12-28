const fs = require('fs');
const path = require('path');
function walk(dir, files=[]) {
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    if(fs.statSync(p).isDirectory()) walk(p,files);
    else if(/\.(tsx|jsx|ts|js)$/.test(p)) files.push(p);
  }
  return files;
}
const files = walk('src');
let fixed=0;
const re = /\{\s*\.\.\.props\s*\}\s*\}/g;
for(const file of files){
  let s = fs.readFileSync(file,'utf8');
  if(re.test(s)){
    s = s.replace(re, '{...props}');
    fs.writeFileSync(file,s,'utf8');
    console.log('Fixed', file);
    fixed++;
  }
}
console.log('Done. Fixed', fixed, 'files');
