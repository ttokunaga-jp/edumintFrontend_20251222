#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PATTERN_TOKENS = ['bg-','text-','font-','min-','max-','gap-','grid','flex','items-','justify-','rounded','border','shadow','opacity-','prose','sr-only','translate-','scale-','hover:', 'focus:', 'sm:', 'md:', 'lg:', 'xl:', '2xl:', 'top-', 'left-', 'right-', 'w-', 'h-', 'px-', 'py-','pt-','pb-','pl-','pr-','mt-','mb-','ml-','mr-','mx-','my-'];

function walk(dir, out){
  fs.readdirSync(dir).forEach(n=>{
    const p=path.join(dir,n);
    if(fs.lstatSync(p).isDirectory()) walk(p,out);
    else if(p.endsWith('.tsx')||p.endsWith('.jsx')) out.push(p);
  });
}

const files=[];
walk(path.join(__dirname,'..','src'),files);
let changed=0;
for(const f of files){
  let src=fs.readFileSync(f,'utf8');
  let orig=src;
  // Match className= attribute with any value (string, template, expression) - non-greedy
  const regex = /\sclassName\s*=\s*(?:"([\s\S]*?)"|'([\s\S]*?)'|\{`([\s\S]*?)`\}|\{([\s\S]*?)\})/g;
  src = src.replace(regex, (m, s1, s2, s3, s4) => {
    const val = (s1||s2||s3||s4||'').toString();
    // if the attribute value contains any tailwind-like token, remove entire attribute
    for(const t of PATTERN_TOKENS){ if(val.includes(t)) return '' }
    // also if value contains multiple classes separated by spaces and hyphens
    if(/\b[a-z0-9_-]+-[a-z0-9_-]+\b/i.test(val)) return '';
    return m; // keep it otherwise
  });

  if(src !== orig){ fs.writeFileSync(f, src, 'utf8'); console.log('Stripped tailwind className in', f); changed++; }
}
console.log('Done. files changed:', changed);
