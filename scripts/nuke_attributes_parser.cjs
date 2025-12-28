#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcRoot = path.join(root, 'src');

function getFilesRecursive(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      getFilesRecursive(p, out);
    } else {
      if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) out.push(p);
    }
  }
  return out;
}

function removeClassNameAttributes(content) {
  let out = '';
  let i = 0;
  while (i < content.length) {
    const idx = content.indexOf('className', i);
    if (idx === -1) {
      out += content.slice(i);
      break;
    }
    // Append up to idx
    out += content.slice(i, idx);
    let j = idx + 'className'.length;
    // Skip whitespace
    while (j < content.length && /\s/.test(content[j])) j++;
    // Expect '='
    if (content[j] !== '=') {
      // Not an attribute usage, copy and continue
      out += 'className';
      i = j;
      continue;
    }
    j++; // skip '='
    while (j < content.length && /\s/.test(content[j])) j++;
    if (content[j] === '{') {
      // find matching '}' considering nested braces
      let depth = 0;
      let k = j;
      for (; k < content.length; k++) {
        if (content[k] === '{') depth++;
        else if (content[k] === '}') {
          depth--;
          if (depth === 0) {
            k++;
            break;
          }
        }
      }
      // remove attribute entirely
      i = k;
      // Also strip trailing whitespace and optional commas
      while (i < content.length && /[\s,]/.test(content[i])) i++;
      continue;
    } else if (content[j] === '"' || content[j] === "'") {
      const quote = content[j];
      let k = j + 1;
      for (; k < content.length; k++) {
        if (content[k] === quote) {
          k++;
          break;
        }
        if (content[k] === '\\') k++; // skip escaped
      }
      i = k;
      // strip whitespace/comma
      while (i < content.length && /[\s,]/.test(content[i])) i++;
      continue;
    } else if (content[j] === '`') {
      // template literal
      let k = j + 1;
      for (; k < content.length; k++) {
        if (content[k] === '`') {
          k++;
          break;
        }
        if (content[k] === '\\') k++;
      }
      i = k;
      while (i < content.length && /[\s,]/.test(content[i])) i++;
      continue;
    } else {
      // Unexpected pattern, skip 'className' word to avoid infinite loop
      out += 'className';
      i = j;
      continue;
    }
  }
  return out;
}

function purgeFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  // Remove import lines referencing cn/cls
  content = content.replace(/^\s*import\s+\{?\s*(cn|cls)\s*\}?[^;]*;\s*$/gmi, '');

  // Remove className attributes robustly
  content = removeClassNameAttributes(content);

  // Remove leftover cn(...) or cls(...)
  content = content.replace(/\bcn\s*\([^)]*\)/g, '');
  content = content.replace(/\bcls\s*\([^)]*\)/g, '');

  // Remove tailwind tokens prefixes
  const tokens = ['bg-', 'text-', 'flex', 'grid', 'gap-', 'rounded', 'hover:', 'md:', 'sm:', 'dark:', 'sr-', 'prose', 'min-h-screen', 'opacity-', 'fill-', 'stroke-', '--tw-', '@tailwind', 'tailwind', 'tw-'];
  for (const t of tokens) {
    const re = new RegExp(t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    content = content.replace(re, '');
  }

  // Remove any dangling empty attribute props like , ,
  content = content.replace(/\s+,/g, ',');
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/\{\s*\}/g, '');
  content = content.replace(/\(\s*\)/g, '()');
  content = content.replace(/\s+>/g, '>');

  // Trim excessive blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    return true;
  }
  return false;
}

const files = getFilesRecursive(srcRoot);
let changed = 0;
for (const f of files) {
  try {
    if (purgeFile(f)) changed++;
  } catch (e) {
    console.error('ERR', f, e.message);
  }
}
console.log('Attribute parser sweep done. Scanned:', files.length, 'Changed:', changed);

process.exit(0);
