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

  // 1) Fix 'as React.CSSProperties}}' -> 'as React.CSSProperties}'
  s = s.replace(/as React\.CSSProperties\}\}/g, 'as React.CSSProperties}');

  // 2) Collapse '}} />' or '}}>' to single '}' for non-style contexts
  s = s.replace(/\}\}\s*(\/>)|\}\}>/g, (m, p1, p2, offset) => {
    // find the preceding '<' char
    const idx = offset;
    const lookback = Math.max(0, idx - 200);
    const ctx = s.slice(lookback, idx);
    const lastOpen = ctx.lastIndexOf('<');
    const between = lastOpen !== -1 ? ctx.slice(lastOpen) : ctx;
    if (/style=\{\{/.test(between)) {
      // it's a style prop; keep as '}}' before closer
      return '}}' + (p1 ? p1 : p2 ? '>' : '');
    }
    // else normal prop/expression -> single '}' before closer
    const closer = p1 ? ' />' : '>';
    return '}' + closer;
  });

  // 3) Also fix '}} }>' weird spacing
  s = s.replace(/\}\}\s+>/g, '} >');

  if(s !== orig){
    fs.writeFileSync(file,s,'utf8');
    console.log('Fixed double closing in', file);
    fixed++;
  }
}
console.log('Done. files fixed:', fixed);