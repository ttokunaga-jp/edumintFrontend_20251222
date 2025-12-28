const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      let s = fs.readFileSync(full, 'utf8');
      const before = s;
      // Replace occurrences where style={{ ... }\n\s*(>|/>) with style={{ ... }}\n$1
      s = s.replace(/style=\{\{([\s\S]*?)\}\s*(\/?>)/g, (m, g1, g2) => {
        // if already has }} then skip
        if (/\}\}\s*\/>|\}\}\s*>/.test(m)) return m;
        return `style={{${g1}}}${g2}`;
      });
      if (s !== before) {
        fs.writeFileSync(full, s, 'utf8');
        console.log('Fixed', full);
      }
    }
  }
}

walk(path.resolve(process.cwd(), 'src'));
console.log('done');