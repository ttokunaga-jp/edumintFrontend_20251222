#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb){
  fs.readdirSync(dir).forEach(name=>{
    const p=path.join(dir,name);
    if(fs.lstatSync(p).isDirectory()) walk(p,cb);
    else cb(p);
  });
}

const root = path.join(__dirname,'..','src');
const files=[];
walk(root,p=>{ if(p.endsWith('.tsx')||p.endsWith('.jsx')) files.push(p);});
let changed=0;
for(const f of files){
  let s=fs.readFileSync(f,'utf8');
  let orig=s;
  // Remove className="..." where the value contains a hyphen or common Tailwind tokens
  s = s.replace(/\s+className=("|')([\s\S]*?)\1/g, (m,q,val)=>{
    if(/\b(bg-|text-|font-|min-|max-|gap-|grid|flex|items-|justify-|rounded|border|shadow|opacity-|prose|sr-only|translate-|scale-|hover:|focus:|sm:|md:|lg:|xl:|2xl:)\b/.test(val) || /\s/.test(val) && /-/.test(val)){
      return '';
    }
    return m;
  });

  // Remove className={cn("...", ...)} where any string literal arg contains hyphen
  s = s.replace(/className=\{\s*cn\(([^}]*)\)\s*\}/g, (m,args)=>{
    const strLits = [...args.matchAll(/(['\"])(.*?)\1/g)].map(x=>x[2]);
    if(strLits.some(v=>/-/.test(v) || /\b(bg-|text-|font-|flex|grid|gap-|rounded|border|shadow|opacity-)\b/.test(v))) return '';
    return m;
  });

  // Remove className={`...`} if contains hyphen or tailwind tokens
  s = s.replace(/\s+className=\{`([\s\S]*?)`\}/g, (m,inner)=>{ if(/-/.test(inner) || /\b(bg-|text-|font-|flex|grid|gap-|rounded|border|shadow|opacity-)\b/.test(inner)) return ''; return m; });

  if(s !== orig){ fs.writeFileSync(f,s,'utf8'); console.log('Aggressively stripped in', f); changed++; }
}
console.log('Done. Files changed:', changed);
