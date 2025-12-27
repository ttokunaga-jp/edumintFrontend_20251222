#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const suggestions = require('../../scripts/reports/tailwind-codemod-suggestions.json');
const mapping = require('./mapping.json');

function isMappable(classSet) {
  // returns true if ANY token in classSet is mappable (conservative)
  return classSet.some((tk) => mapping.mappings.some((m) => m.match.includes(tk)));
}

function mergeMatches(matches) {
  const merged = {};
  Object.values(matches).forEach((m) => {
    Object.assign(merged, m);
  });
  return merged;
}

function buildInlineStyle(matches) {
  const merged = mergeMatches(matches);
  return merged;
}

const patchesDir = path.resolve(process.cwd(), '..', '..', 'scripts', 'reports', 'patches');
if (!fs.existsSync(patchesDir)) fs.mkdirSync(patchesDir, { recursive: true });

const patches = [];

let idx = 1;
suggestions.suggestions.forEach((s) => {
  // find if the classSet contains any template tokens (${) -> skip if so
  if (s.classSet.some((t) => /\$\{/.test(t) || /\}|\{|\?/g.test(t))) return;
  if (!isMappable(s.classSet)) return;
  const mergedMatches = mergeMatches(s.matches);

  const patchPath = path.join(patchesDir, `suggestion_${String(idx).padStart(4, '0')}.json`);
  const suggestion = {
    id: idx,
    file: s.file,
    classSet: s.classSet,
    matchedTokens: Object.keys(mergedMatches),
    suggestedStyle: mergedMatches,
    note: 'Manual application recommended: convert matching tokens to MUI sx/Box and remove tailwind classes when safe.'
  };
  fs.writeFileSync(patchPath, JSON.stringify(suggestion, null, 2));
  patches.push({ file: s.file, patch: patchPath });
  idx++;
});

fs.writeFileSync(path.join(patchesDir, 'index.json'), JSON.stringify(patches, null, 2));
console.log('Wrote', patches.length, 'patch suggestions to', patchesDir);

