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
for(const file of files){
  let s = fs.readFileSync(file,'utf8');
  let orig = s;
  // replace sequences of 3+ '}' with either '}}' for style contexts or '}' otherwise
  s = s.replace(/\}{3,}/g, (m, offset) => {
    // Determine context by looking back up to 300 chars
    const idx = offset;
    const lookback = Math.max(0, idx - 300);
    const ctx = s.slice(lookback, idx);
    // if inside a style={{ ... then prefer '}}'
    const stylePos = ctx.lastIndexOf('style={{');
    const gtPos = ctx.lastIndexOf('>');
    // if style exists and no '>' after it -> we're still in tag
    if(stylePos !== -1 && stylePos > gtPos){
      return '}}';
    }
    // otherwise it's likely an extra brace after a prop or expression -> single
    return '}';
  });
  if(s !== orig){
    fs.writeFileSync(file, s, 'utf8');
    console.log('Collapsed braces in', file);
    fixed++;
  }
}
console.log('Done. Files fixed:', fixed);