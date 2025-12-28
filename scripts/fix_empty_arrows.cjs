const fs = require('fs');
const { execSync } = require('child_process');
const files = execSync('git ls-files src').toString().trim().split('\n').filter(Boolean);
let changed = 0;
for (const f of files) {
  try {
    const s = fs.readFileSync(f, 'utf8');
    const ns = s
      .replace(/=\{\s*\(\)\s*=>\s*\}/g, '={() => {}}')
      .replace(/\(\)\s*=>\s*,/g, '() => {},')
      .replace(/:\s*\(\)\s*=>\s*,/g, ': () => {},')
      .replace(/=>\s*\}/g, '=> {}')
      .replace(/=>\s*,/g, '=> {},');
    if (ns !== s) {
      fs.writeFileSync(f, ns, 'utf8');
      console.log('fixed', f);
      changed++;
    }
  } catch (e) {
    console.error('err', f, e.message);
  }
}
console.log('done. changed=', changed);
process.exit(0);
