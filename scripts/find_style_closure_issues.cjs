const fs = require('fs');
const path = require('path');

function walk(dir){
  let res=[];
  for(const f of fs.readdirSync(dir)){
    const p=path.join(dir,f);
    const s=fs.statSync(p);
    if(s.isDirectory()) res=res.concat(walk(p));
    else if(p.endsWith('.tsx')) res.push(p);
  }
  return res;
}

const files=walk(path.join(__dirname,'..','src'));
for(const f of files){
  const src=fs.readFileSync(f,'utf8');
  const lines=src.split(/\n/);
  for(let i=0;i<lines.length;i++){
    if(lines[i].includes('style={{')){
      // scan forward up to 8 lines to find closing '}' line
      for(let j=i;j<i+10 && j<lines.length;j++){
        const line=lines[j];
        if(/^\s*}\s*\/?>\s*$/.test(line)){
          // single closing brace then / or > -> problematic
          console.log(`${f}:${j+1}: single closing brace found for style started at line ${i+1}`);
          break;
        }
        if(/\}\s*\}/.test(line)) break; // found double close
      }
    }
  }
}
