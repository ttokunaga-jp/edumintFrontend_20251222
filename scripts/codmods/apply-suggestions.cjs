#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const patchesDir = path.resolve(__dirname, '..', 'reports', 'patches');
if (!fs.existsSync(patchesDir)) {
  console.error('Patches dir not found:', patchesDir);
  process.exit(1);
}

const files = fs.readdirSync(patchesDir).filter((f) => f.endsWith('.json'));
let applied = 0;
let skipped = 0;

files.forEach((f) => {
  try {
    const full = path.join(patchesDir, f);
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (!data || !data.file) { skipped++; return; }
    const filePath = path.resolve(process.cwd(), data.file);
    if (!fs.existsSync(filePath)) { skipped++; return; }
    let src = fs.readFileSync(filePath, 'utf8');

    // remaining logic continues below (no changes)


  // build joined string to find exact className occurrences
  const joined = data.classSet.join(' ');
  // reject if contains template tokens or dynamic pieces
  if (joined.includes('${') || joined.includes('`') || joined.includes('{') || joined.includes('}')) { skipped++; return; }

  // pattern match exact className attribute occurrences (double, single, or template string)
  const patterns = [
    new RegExp(`className\\s*=\\s*"${escapeRegExp(joined)}"`, 'g'),
    new RegExp(`className\\s*=\\s*'${escapeRegExp(joined)}'`, 'g'),
    new RegExp('className\\s*=\\s*`' + escapeRegExp(joined) + '`', 'g'),
  ];

  let matched = false;
  patterns.forEach((pat) => {
    if (pat.test(src)) matched = true;
  });
  if (!matched) { skipped++; return; }

  // build inline style object from suggestedStyle
  const styleObj = data.suggestedStyle || {};
  // convert kebab-like names to camelCase if needed (they are already camelCase in mapping)
  const cssPairs = Object.entries(styleObj).map(([k, v]) => `\n      ${camelToJs(k)}: ${typeof v === 'string' ? JSON.stringify(v) : v}`);
  const styleStr = `{${cssPairs.join(',')}\n    }`;

  // replacement: replace className="..." with style={...}
  // Apply replacements for each pattern
  let newSrc = src;
  patterns.forEach((pat) => {
    newSrc = newSrc.replace(pat, `style=${styleStr}`);
  });

  if (newSrc !== src) {
    fs.writeFileSync(filePath, newSrc, 'utf8');
    applied++;
    console.log('Applied to', data.file, 'for class:', joined);
  } else {
    skipped++;
  }
  } catch (err) {
    console.error('Error processing', f, err && err.message);
    skipped++;
  }
});

console.log(`Done. Applied: ${applied}, Skipped: ${skipped}`);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function camelToJs(s) {
  return s.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}