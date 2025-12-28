#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const exts = ['.tsx', '.ts', '.jsx', '.js'];

function walk(dir, cb) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, cb);
    else if (exts.includes(path.extname(full))) cb(full);
  }
}

function filterClassString(s) {
  // Keep only tokens that look like plain words (letters, digits, underscore)
  // This will strip tokens that contain hyphens, slashes, colons, parentheses, %, etc.
  // It's intentionally aggressive to remove Tailwind utility tokens.
  return s
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0 && /^[A-Za-z0-9_]+$/.test(t))
    .join(' ');
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  let orig = src;
  // 1) className="..." and className='...'
  src = src.replace(/className\s*=\s*"([^"]*)"/g, (m, inner) => {
    const filtered = filterClassString(inner);
    if (!filtered) return '';
    return `className="${filtered}"`;
  });
  src = src.replace(/className\s*=\s*'([^']*)'/g, (m, inner) => {
    const filtered = filterClassString(inner);
    if (!filtered) return '';
    return `className='${filtered}'`;
  });

  // 2) className={`...`} simple template literal (no expressions inside)
  src = src.replace(/className\s*=\s*`([^`$]*)`/g, (m, inner) => {
    const filtered = filterClassString(inner);
    if (!filtered) return '';
    return `className={\`${filtered}\`}`;
  });

  // 3) className={cn(...)} -- handle string literal args inside cn(...) only
  src = src.replace(/className\s*=\s*\{\s*cn\s*\(([^)]*)\)\s*\}/g, (m, args) => {
    // split args by commas but don't attempt to evaluate JS expressions
    const parts = [];
    let cur = '';
    let depth = 0;
    for (let i = 0; i < args.length; i++) {
      const ch = args[i];
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        parts.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim() !== '') parts.push(cur.trim());

    const newParts = parts.map(p => {
      // string literal arg "..." or '...'
      const m1 = p.match(/^"([^"]*)"$/);
      const m2 = p.match(/^'([^']*)'$/);
      if (m1) {
        const filtered = filterClassString(m1[1]);
        return filtered ? `"${filtered}"` : null;
      }
      if (m2) {
        const filtered = filterClassString(m2[1]);
        return filtered ? `'${filtered}'` : null;
      }
      // keep other args (identifiers, expressions)
      return p;
    }).filter(Boolean);

    if (newParts.length === 0) {
      // no args remain -> remove whole prop
      return '';
    }
    return `className={cn(${newParts.join(', ')})}`;
  });

  // 4) remove leftover className={} where the braces are empty or only whitespace
  src = src.replace(/className\s*=\s*\{\s*\}/g, '');

  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    return true;
  }
  return false;
}

let changed = 0;
let files = 0;
walk(root, (file) => {
  files++;
  try {
    if (processFile(file)) changed++;
  } catch (e) {
    console.error('ERROR processing', file, e);
  }
});
console.log(`Done. Files scanned: ${files}. Files changed: ${changed}`);
process.exit(0);
