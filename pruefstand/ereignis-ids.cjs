/* Einmalige Migration des historischen Ereigniskatalogs; nicht beim Spielstart. */
const fs=require('fs'),path=require('path');
/* BABEL AUS DEM QUELLVERZEICHNIS LADEN (35.168).

   `pruefen.sh` ruft dieses Werkzeug aus dem Bauverzeichnis /tmp/ps, wo es
   keine node_modules gibt — `require('@babel/parser')` schlug dort fehl und
   brach den ganzen Lauf ab, mit der irrefuehrenden Meldung „Bitte zuerst
   npm ci ausfuehren". Direkt aufgerufen lief es.

   Gesucht wird deshalb zuerst neben dieser Datei (pruefstand/..), dann auf
   dem normalen Weg. */
let parser;
try {
  parser = require(path.join(__dirname, '..', 'node_modules', '@babel', 'parser'));
} catch (e) {
  parser = require('@babel/parser');
}
const file=process.argv[2];if(!file)throw Error('Pfad zu ereignisse.js fehlt');
const source=fs.readFileSync(file,'utf8'),ast=parser.parse(source,{sourceType:'module'}),edits=[];
let events=0,choices=0;
function visit(n){
 if(!n||typeof n!=='object')return;
 if(n.type==='ObjectExpression'){
  const key=p=>p.key?.name||p.key?.value;
  const id=n.properties.find(p=>key(p)==='id')?.value;
  const c=n.properties.find(p=>key(p)==='choices')?.value;
  if(id?.type==='StringLiteral'&&c?.type==='ArrayExpression'){
   events++;
   c.elements.forEach((ch,i)=>{
    if(ch?.type!=='ObjectExpression')throw Error('Nicht statische Wahl: '+id.value);
    choices++;
    if(!ch.properties.some(p=>key(p)==='id'))edits.push({at:ch.start+1,text:`id:${JSON.stringify(id.value+'.'+i)}, altIndex:${i}, `});
   });
  }
 }
 for(const [k,v] of Object.entries(n)){if(k==='loc')continue;if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')visit(v)}
}
visit(ast);let out=source;for(const e of edits.sort((a,b)=>b.at-a.at))out=out.slice(0,e.at)+e.text+out.slice(e.at);
if(process.argv.includes('--write'))fs.writeFileSync(file,out);
console.log(JSON.stringify({events,choices,missing:edits.length,written:process.argv.includes('--write')}));
