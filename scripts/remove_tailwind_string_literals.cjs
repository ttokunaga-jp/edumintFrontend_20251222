#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const exts = ['.tsx', '.ts', '.jsx', '.js'];

const kws = ['text-', 'bg-', 'h-', 'w-', 'p-', 'm-', 'min-h', 'max-w', 'space-', 'gap-', 'rounded', 'border', 'shadow', 'opacity', 'fill-', 'stroke-', 'sr-only', 'prose', 'min-h-screen', 'md:', 'sm:', 'lg:', 'xl:', 'hover:', 'focus:', 'aria-', 'pointer-events-none', 'opacity-0', 'opacity-100', 'scale-', 'flex', 'grid', 'justify-', 'items-', 'gap-'];

function walk(dir, cb) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, cb);
    else if (exts.includes(path.extname(full))) cb(full);
  }
}

function containsKW(s) {
  for (const k of kws) if (s.includes(k)) return true;
  return false;
}

function removeStrings(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '"' || ch === "'") {
      const quote = ch; let j = i+1; let escaped = false; let content = '';
      while (j < src.length) {
        const c = src[j];
        if (escaped) { content += c; escaped = false; j++; continue; }
        if (c === '\\') { escaped = true; j++; continue; }
        if (c === quote) break;
        content += c; j++;
      }
      if (containsKW(content)) {
        // remove entire quoted literal
        i = j+1;
        continue;
      } else {
        out += src.slice(i, j+1);
        i = j+1;
        continue;
      }
    } else if (ch === '`') {
      // template literal
      let j = i+1; let content = ''; let escaped = false; let inExpr = false; let exprDepth = 0;
      while (j < src.length) {
        const c = src[j];
        if (inExpr) {
          if (c === '{') { exprDepth++; }
          else if (c === '}') { if (exprDepth === 0) { inExpr = false; } else exprDepth--; }
          j++; continue;
        }
        if (escaped) { content += c; escaped = false; j++; continue; }
        if (c === '\\') { escaped = true; j++; continue; }
        if (c === '$' && src[j+1] === '{') { inExpr = true; j+=2; continue; }
        if (c === '`') break;
        content += c; j++;
      }
      if (containsKW(content)) { i = j+1; continue; }
      else { out += src.slice(i, j+1); i = j+1; continue; }
    } else {
      out += ch; i++;
    }
  }
  return out;
}

let files = 0; let changed = 0;
walk(root, (file) => {
  files++;
  try {
    let src = fs.readFileSync(file, 'utf8');
    let orig = src;
    src = removeStrings(src);
    if (src !== orig) { fs.writeFileSync(file, src, 'utf8'); changed++; }
  } catch (e) { console.error('ERROR', file, e); }
});
console.log(`Done. Files scanned: ${files}. Files changed: ${changed}`);
process.exit(0);
