const fs = require('fs');
const { execSync } = require('child_process');
const files = execSync('git ls-files src').toString().trim().split('\n').filter(Boolean);
let changed = 0;
for (const f of files) {
  try {
    let s = fs.readFileSync(f, 'utf8');
    let ns = s;
    ns = ns.replace(/}}\s*</g, '}}>\n<');
    ns = ns.replace(/}}\s*}\s*>/g, '}}>');
    // fix stray '} export' into newline
    ns = ns.replace(/\}\s*export\s+/g, '}\nexport ');
    if (ns !== s) { fs.writeFileSync(f, ns, 'utf8'); console.log('fixed', f); changed++; }
  } catch (e) { console.error('err', f, e.message); }
}
console.log('done. changed=', changed);
