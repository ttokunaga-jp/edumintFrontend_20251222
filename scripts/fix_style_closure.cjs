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
  let s = fs.readFileSync(file, 'utf8');
  let orig = s;
  // Find each 'style={{' and ensure there are two closing braces before the tag end
  const re = /style=\{\{([\s\S]*?)\}\s*([>/])/g;
  s = s.replace(re, (m, inner, closer) => {
    // m is like "style={{ ... } >" or "style={{ ... }/>" (missing one brace)
    // If inner already ends with a brace char, the regex wouldn't match triple, so this means missing one '}' before closer
    // Replace with style={{ inner }}<closer>
    return `style={{${inner}}}}${closer}`.replace('}}}}', '}}}');
  });

  // Additionally, fix patterns where there's a single '}' immediately before '/>' or '>' but far from style={{
  // We'll also handle the inverse where style={{ block is followed by a single '}' and a newline then '>'
  const re2 = /style=\{\{([\s\S]*?)\}\s*\/>/g;
  s = s.replace(re2, (m, inner) => `style={{${inner}}}} />`.replace('}}}}', '}}}')); // compact

  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('Fixed style closure in', file);
    fixed++;
  }
}
console.log('Scanned', files.length, 'files, fixed', fixed);