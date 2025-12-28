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

function findMatchingQuote(src, i, quote) {
  i++; // skip opening quote
  while (i < src.length) {
    const ch = src[i];
    if (ch === '\\') i += 2;
    else if (ch === quote) return i;
    else i++;
  }
  return -1;
}

function findMatchingTemplate(src, i) {
  // starting at backtick
  i++;
  let inExpr = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '\\') i += 2;
    else if (ch === '`' && inExpr === 0) return i;
    else if (ch === '$' && src[i+1] === '{') { inExpr++; i += 2; }
    else if (ch === '}' && inExpr > 0) { inExpr--; i++; }
    else i++;
  }
  return -1;
}

function findMatchingBrace(src, i) {
  // starting at '{'
  i++;
  let depth = 1;
  let inSingle = false, inDouble = false, inTemplate = false;
  while (i < src.length) {
    const ch = src[i];
    if (inSingle) {
      if (ch === '\\') i += 2;
      else if (ch === "'") { inSingle = false; i++; }
      else i++;
    } else if (inDouble) {
      if (ch === '\\') i += 2;
      else if (ch === '"') { inDouble = false; i++; }
      else i++;
    } else if (inTemplate) {
      if (ch === '`') { inTemplate = false; i++; }
      else if (ch === '\\') i += 2;
      else i++;
    } else {
      if (ch === '{') { depth++; i++; }
      else if (ch === '}') { depth--; if (depth === 0) return i; i++; }
      else if (ch === "'") { inSingle = true; i++; }
      else if (ch === '"') { inDouble = true; i++; }
      else if (ch === '`') { inTemplate = true; i++; }
      else i++;
    }
  }
  return -1;
}

function removeClassNameAttributes(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const idx = src.indexOf('className', i);
    if (idx === -1) {
      out += src.slice(i);
      break;
    }
    // append until idx
    out += src.slice(i, idx);
    let j = idx + 'className'.length;
    // skip whitespace
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] !== '=') {
      // not an assignment, keep and continue
      out += 'className';
      i = j;
      continue;
    }
    j++; // skip =
    // skip whitespace
    while (j < src.length && /\s/.test(src[j])) j++;
    if (j >= src.length) { i = j; continue; }
    const ch = src[j];
    let end = -1;
    if (ch === '"' || ch === "'") {
      end = findMatchingQuote(src, j, ch);
      if (end === -1) { // not closed, remove rest of line
        // skip to newline
        end = src.indexOf('\n', j);
        if (end === -1) end = src.length - 1;
      }
      out += '';
      i = end + 1;
      continue;
    } else if (ch === '`') {
      end = findMatchingTemplate(src, j);
      if (end === -1) end = src.length -1;
      i = end + 1;
      continue;
    } else if (ch === '{') {
      end = findMatchingBrace(src, j);
      if (end === -1) end = src.length -1;
      i = end + 1;
      continue;
    } else {
      // Unquoted assignment, remove until whitespace or '>' or '/>'
      let k = j;
      while (k < src.length && !/[>\s,/]/.test(src[k])) k++;
      i = k;
      continue;
    }
  }
  return out;
}

function removeObjectClassNameKeys(src) {
  // remove occurrences like className: '...' or className: "..." or className: `...` or className: { ... }
  return src.replace(/className\s*:\s*(?:`[\s\S]*?`|\{[\s\S]*?\}|"[^"]*"|'[^']*')/g, '');
}

function removeCnImportsAndDefs(src) {
  // remove import of cn
  // import { cn, other } from '...';
  src = src.replace(/import\s*\{([^}]*)\}\s*from\s*['"][^'"]+['"];?/g, (m, inner) => {
    const parts = inner.split(',').map(p => p.trim()).filter(Boolean);
    const filtered = parts.filter(p => p !== 'cn');
    if (filtered.length === 0) return '';
    return `import { ${filtered.join(', ')} } from ${m.match(/from\s*['"][^'"]+['"]/)[0].slice(5)};`;
  });
  // import { cn } from '...'; -> remove
  // remove export function cn(...) { ... }
  src = src.replace(/export\s+function\s+cn\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g, '');
  // remove re-export lines like export { cn } from '...';
  src = src.replace(/export\s*\{\s*cn\s*\}\s*from\s*['"][^'"]+['"];?/g, '');
  return src;
}

let files = 0;
let changed = 0;
walk(root, (file) => {
  files++;
  try {
    let src = fs.readFileSync(file, 'utf8');
    let orig = src;
    src = removeClassNameAttributes(src);
    src = removeObjectClassNameKeys(src);
    src = removeCnImportsAndDefs(src);
    if (src !== orig) {
      fs.writeFileSync(file, src, 'utf8');
      changed++;
    }
  } catch (e) {
    console.error('ERROR processing', file, e);
  }
});
console.log(`Done. Files scanned: ${files}. Files changed: ${changed}`);
process.exit(0);
