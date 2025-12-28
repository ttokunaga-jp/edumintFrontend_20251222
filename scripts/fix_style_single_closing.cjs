const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx|jsx|ts|js)$/.test(p)) files.push(p);
  }
  return files;
}

const files = walk('src');
let fixed = 0;
for (const file of files) {
  const s = fs.readFileSync(file, 'utf8');
  const orig = s;
  const lines = s.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('style={{')) {
      // Find next few lines for a line that only contains a single closing '}' and replace with '}}'
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].trim() === '}') {
          lines[j] = lines[j].replace(/}/, '}}');
          fixed++;
          break;
        }
      }
    }
  }
  const ns = lines.join('\n');
  if (ns !== orig) {
    fs.writeFileSync(file, ns, 'utf8');
    console.log('Fixed style single closer in', file);
  }
}

console.log('Done. Fixed count approx:', fixed);