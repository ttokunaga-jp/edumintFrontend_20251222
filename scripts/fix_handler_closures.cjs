const fs = require('fs');
const path = require('path');

const handlers = ['onClick', 'onChange', 'onSubmit', 'onKeyDown', 'onKeyUp', 'onBlur', 'onFocus', 'onMouseDown', 'onMouseUp', 'onInput'];

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
let changed=0;
for(const f of files){
  let src=fs.readFileSync(f,'utf8');
  const lines=src.split(/\n/);
  let modified=false;
  for(let i=0;i<lines.length-1;i++){
    if(/^\s*\}\s*$/.test(lines[i]) && /^\s*>/.test(lines[i+1])){
      // look back for handler in previous 6 lines
      const lookback = Math.max(0,i-6);
      const found = lines.slice(lookback,i).some(l=> handlers.some(h=> l.includes(h+'=')));
      if(found){
        lines[i] = lines[i].replace(/\}/,'}}');
        modified=true;
      }
    }
  }
  if(modified){
    fs.writeFileSync(f, lines.join('\n'),'utf8');
    changed++;
    console.log('Fixed handler closure in', f);
  }
}
console.log('Total files fixed:', changed);
