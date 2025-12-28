const fs = require('fs');
const path = require('path');
function walk(dir, files=[]) { for (const f of fs.readdirSync(dir)) { const p=path.join(dir,f); if(fs.statSync(p).isDirectory()) walk(p,files); else if(/\.(tsx|jsx|ts|js)$/.test(p)) files.push(p);} return files; }
const files = walk('src'); let fixed=0; for(const file of files){ let s=fs.readFileSync(file,'utf8'); let orig=s; s = s.replace(/(=\{[^}]*?)\}\}/g, '$1}'); if(s!==orig){ fs.writeFileSync(file,s,'utf8'); console.log('Fixed props in', file); fixed++; } } console.log('Done', fixed, 'files');