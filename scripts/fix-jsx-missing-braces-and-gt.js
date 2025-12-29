#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir){
  const files = fs.readdirSync(dir);
  for(const f of files){
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if(st.isDirectory()) walk(p);
    else if(p.endsWith('.tsx') || p.endsWith('.jsx')) fixFile(p);
  }
}

function fixFile(file){
  let s = fs.readFileSync(file, 'utf8');
  let original = s;
  let changed = false;

  // 1) Insert missing closing '}' before immediate child '<'
  // e.g. onSubmit={submit<div> -> onSubmit={submit}> <div>
  // Conservative: match '{' then any non '}' or '<' then a '<' and insert '}' before '<'
  const reMissingBrace = /\{([^}<>]+?)</g;
  s = s.replace(reMissingBrace, (m, g1) => {
    // avoid changing generic type expressions like func<T> inside braces by checking for whitespace or parentheses
    if(/[<>=]/.test(g1)) return m; // skip weird cases
    changed = changed || (m !== `{${g1}> <`);
    return `{${g1}> <`;
  });

  // 2) If a '}' within a tag is followed by plaintext (not a '<') and later the line contains a closing tag, insert '>' after '}'
  // e.g. ... disabled={isSubmitting} 設定を完了する </button>
  const reMissingGt = /(\})(\s+)([^\s<][^\n<]*?<\/([A-Za-z0-9_-]+)>)/g;
  s = s.replace(reMissingGt, (m, g1, g2, g3) => {
    changed = true;
    return `${g1}>${g2}${g3}`;
  });

  // 3) Small fix: cases where jsx children use '{' without closing '}' before text, e.g., value={username onChange=... -> try to close if obviously missing
  // This is riskier; skip for now.

  if(changed && s !== original){
    fs.writeFileSync(file, s, 'utf8');
    console.log('Fixed:', file);
  }
}

walk(path.join(__dirname, '..', 'src'));
console.log('Done');
