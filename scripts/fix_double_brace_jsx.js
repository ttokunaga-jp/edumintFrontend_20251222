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
let total=0, fixed=0;
for(const file of files){
  let s = fs.readFileSync(file,'utf8');
  const orig = s;
  // replace '}}/>' -> '} />'
  s = s.replace(/\}\}\/>/g, '} />');
  // replace '}}>' -> '}>', but avoid replacing '}}))>' etc; simple replace
  s = s.replace(/\}\}>/g, '}>');
  if(s !== orig){
    fs.writeFileSync(file,s,'utf8');
    fixed++;
    console.log('Fixed',file);
  }
  total++;
}
console.log('Scanned',total,'files, fixed',fixed);
