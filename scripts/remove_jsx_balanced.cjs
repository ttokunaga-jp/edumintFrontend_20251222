#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcRoot = path.join(root, 'src');

function getFilesRecursive(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) getFilesRecursive(p, out);
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function findMatchingBracket(s, idx, openChar, closeChar) {
  let depth = 0;
  for (let i = idx; i < s.length; i++) {
    if (s[i] === openChar) depth++;
    else if (s[i] === closeChar) {
      depth--;
      if (depth === 0) return i+1;
    } else if (s[i] === '"' || s[i] === "'" || s[i] === '`') {
      // skip string literal
      const q = s[i];
      i++;
      while (i < s.length) {
        if (s[i] === '\\') i+=2;
        else if (s[i] === q) break;
        else i++;
      }
    }
  }
  return -1;
}

function removeClassNameAndCn(content) {
  let out = '';
  let i = 0;
  while (i < content.length) {
    const idx = content.indexOf('className', i);
    const cnIdx = content.indexOf('cn(', i);
    const clsIdx = content.indexOf('cls(', i);
    // choose nearest occurrence
    let next = -1;
    let type = null;
    if (idx !== -1 && (cnIdx === -1 || idx < cnIdx) && (clsIdx === -1 || idx < clsIdx)) { next = idx; type = 'className'; }
    else if (cnIdx !== -1 && (clsIdx === -1 || cnIdx < clsIdx)) { next = cnIdx; type = 'cn'; }
    else if (clsIdx !== -1) { next = clsIdx; type = 'cls'; }

    if (next === -1) { out += content.slice(i); break; }

    out += content.slice(i, next);

    if (type === 'className') {
      let j = next + 'className'.length;
      // skip whitespace
      while (j < content.length && /\s/.test(content[j])) j++;
      if (content[j] !== '=') { out += 'className'; i = j; continue; }
      j++; while (j < content.length && /\s/.test(content[j])) j++;
      if (content[j] === '{') {
        const end = findMatchingBracket(content, j, '{', '}');
        if (end === -1) { i = j; continue; }
        i = end;
        // strip trailing commas/spaces
        while (i < content.length && /[\s,]/.test(content[i])) i++;
        continue;
      } else if (content[j] === '"' || content[j] === "'" || content[j] === '`') {
        const q = content[j];
        j++;
        while (j < content.length) {
          if (content[j] === '\\') j+=2;
          else if (content[j] === q) { j++; break; }
          else j++;
        }
        i = j;
        while (i < content.length && /[\s,]/.test(content[i])) i++;
        continue;
      } else {
        // unexpected, skip
        i = j;
        continue;
      }
    } else if (type === 'cn' || type === 'cls') {
      const start = next + (type === 'cn' ? 3 : 4); // cn( or cls(
      const end = findMatchingBracket(content, next + (type === 'cn' ? 2 : 3), '(', ')');
      if (end === -1) { i = next + 2; continue; }
      i = end;
      // remove any surrounding className={...} if immediate
      // strip trailing space/comma
      while (i < content.length && /[\s,]/.test(content[i])) i++;
      continue;
    }
  }
  return out;
}

const files = getFilesRecursive(srcRoot);
let changed = 0;
for (const f of files) {
  try {
    const raw = fs.readFileSync(f,'utf8');
    // remove import lines for cn/cls
    let content = raw.replace(/^\s*import\s+\{?\s*(cn|cls)\s*\}?[^;]*;\s*$/gmi, '');
    const res = removeClassNameAndCn(content);
    if (res !== raw) {
      fs.writeFileSync(f, res, 'utf8');
      changed++;
    }
  } catch (e) {
    console.error('ERR', f, e.message);
  }
}
console.log('Balanced className/cn removal done. Scanned:', files.length, 'Changed:', changed);
process.exit(0);
