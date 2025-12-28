const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function walk(dir){
  let results = [];
  for (const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) results = results.concat(walk(p));
    else if (p.endsWith('.tsx')) results.push(p);
  }
  return results;
}

const files = walk(path.join(__dirname,'..','src'));
let total=0;
for (const f of files){
  const src = fs.readFileSync(f,'utf8');
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const diags = sf.parseDiagnostics || [];
  if (diags.length){
    console.log('\n--- Parse errors in:', f);
    diags.forEach(d=>{
      const {start,length,messageText} = d;
      const {line,character} = sf.getLineAndCharacterOfPosition(start || 0);
      console.log(`  ${line+1}:${character+1} - ${ts.flattenDiagnosticMessageText(messageText,'\n')}`);
    });
    total += diags.length;
  }
}
console.log(`\nTotal parse diagnostics: ${total}`);
process.exit(total?1:0);
