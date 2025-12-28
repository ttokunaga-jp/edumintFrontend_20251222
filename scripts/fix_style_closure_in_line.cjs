const fs = require('fs');
const path = require('path');
function walk(dir, files=[]) { for (const f of fs.readdirSync(dir)) { const p=path.join(dir,f); if(fs.statSync(p).isDirectory()) walk(p,files); else if(/\.(tsx|jsx|ts|js)$/.test(p)) files.push(p);} return files; }
const files = walk('src'); let fixedFiles=0; for(const file of files){ let s=fs.readFileSync(file,'utf8'); let orig=s; let changed=false;
 // For each occurrence of 'style={{', ensure closing before '>' has '}}'
 let idx=0;
 while(true){ const pos=s.indexOf('style={{', idx); if(pos===-1) break; // find the next '>' after pos
 let gt = s.indexOf('>', pos);
 if(gt===-1) break;
 // check substring between pos and gt for pattern '}' followed by optional spaces then '>' and ensure there are two '}' before '>'
 const before = s.slice(pos, gt+1);
 if(/\}\s*>$/.test(before) && !/\}\}\s*>$/.test(before)){
 // replace the last '}' before '>' with '}}'
 const replacePos = s.lastIndexOf('}', gt-1);
 s = s.slice(0, replacePos) + '}}' + s.slice(replacePos+1);
 changed=true;
 }
 idx = gt+1;
 }
 if(changed){ fs.writeFileSync(file,s,'utf8'); console.log('Fixed style closure in',file); fixedFiles++; }
 }
 console.log('Done. Files fixed:', fixedFiles);