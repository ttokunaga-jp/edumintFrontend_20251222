const fs = require('fs');
const p = 'src/components/page/ProblemViewEditPage/ProblemEditor.tsx';
let s = fs.readFileSync(p,'utf8');
const re = /options: Array<\{[^]*?isCorrect: boolean\s*\}\}>/m;
if(!re.test(s)){
  console.error('Pattern not found');
  process.exit(1);
}
const ns = s.replace(/options: Array<\{([^]*?)isCorrect: boolean\s*\}\}>/m, 'options: Array<{ $1isCorrect: boolean }>' );
fs.writeFileSync(p, ns, 'utf8');
console.log('Fixed ProblemEditor options type');
