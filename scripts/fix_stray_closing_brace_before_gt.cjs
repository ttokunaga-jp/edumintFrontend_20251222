#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

const repoRoot = path.resolve(__dirname, '..');
const targetDirs = [path.join(repoRoot, 'src')];
const exts = ['.tsx', '.ts', '.jsx', '.js'];
let totalFiles = 0;
let changedFiles = 0;
let totalMatches = 0;

for (const dir of targetDirs) {
  walk(dir, (file) => {
    if (!exts.includes(path.extname(file))) return;
    totalFiles++;
    let src = fs.readFileSync(file, 'utf8');
    const original = src;

    // Patterns to catch sequences like:
    //   }}\n\n}>
    //   }\n\n}>
    //   }}\n\n>   (rare)
    // Replace them by collapsing whitespace/newlines before the final '>' so that tags end with '}}>' or '}>'.
    // Strategy: replace (one-or-more-}) followed by whitespace/newlines then optionally a '}' and '>' or just '>'

    // 1) (
    //    one-or-more-}) \s* \n \s* \}> 
    //    ) -> $1>
    src = src.replace(/(\}+)[ \t\f]*\n[ \t\f\r]*\}>(?!\S)/g, '$1>');

    // 2) (one-or-more-}) followed by whitespace/newlines then '>'
    src = src.replace(/(\}+)[ \t\f]*\n[ \t\f\r]*>(?!\S)/g, '$1>');

    // 3) Handle the case where there is an extra standalone '}' line before a closing tag on the same line: "\n}\s*>"
    src = src.replace(/\n[ \t\f]*\}[ \t\f]*>/g, '\n>');

    if (src !== original) {
      fs.writeFileSync(file, src, 'utf8');
      changedFiles++;

      // Count occurrences of the patterns in the original for reporting
      const m1 = (original.match(/(\}+)[ \t\f]*\n[ \t\f\r]*\}>/g) || []).length;
      const m2 = (original.match(/(\}+)[ \t\f]*\n[ \t\f\r]*>/g) || []).length;
      const m3 = (original.match(/\n[ \t\f]*\}[ \t\f]*>/g) || []).length;
      totalMatches += m1 + m2 + m3;

      console.log(`Fixed ${file} (matches: ${m1 + m2 + m3})`);
    }
  });
}

console.log(`Scanned ${totalFiles} files, changed ${changedFiles} files, total matches fixed: ${totalMatches}`);
if (changedFiles === 0) process.exit(0);
process.exit(0);
