import {packBuchung,verkaufsBuchung} from '../buchungen.js';
/* Gezielte Regressionen 35.165. Läuft ohne Browser und ohne Gerätezugriff.
   Original-App/Komponenten, nur Speichergrenze kontrolliert ersetzt. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {serialisierterSpeicher,backupLesen,datenErsetzen,importWiederherstellen,IMPORT_JOURNAL,spielerGueltig} from '../sicherung.js';
import {laufStand,laufWeiter} from '../spielstand.js';
const require=createRequire(import.meta.url);
const {build}=require('esbuild'), React=require('react'), {renderToStaticMarkup}=require('react-dom/server');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tmp=await fs.mkdtemp(path.join(root,'.korrekturen-'));
const tests=[];
function ok(name,fn){return Promise.resolve().then(fn).then(()=>{tests.push(name);console.log('PASS '+name)});}
let mem=new Map();let fault=null;
const adapter={get:async k=>{if(fault)fault('get',k);return mem.has(k)?{value:mem.get(k)}:null},set:async(k,v)=>{if(fault)fault('set',k);mem.set(k,v);return {key:k,value:v}},delete:async k=>{if(fault)fault('delete',k);mem.delete(k);return {deleted:true}}};
globalThis.__rsTestStore=serialisierterSpeicher(adapter);
try {
 await fs.writeFile(path.join(tmp,'probe.jsx'),await fs.readFile(path.join(root,'App.jsx'),'utf8')+'\n'+await fs.readFile(path.join(root,'pruefstand/exporte.txt'),'utf8'));
 await build({entryPoints:[path.join(tmp,'probe.jsx')],bundle:true,platform:'node',format:'cjs',outfile:path.join(tmp,'motor.cjs'),external:['react','react-dom'],logLevel:'silent',plugins:[{name:'source-and-store',setup(b){b.onResolve({filter:/^\.\/.+\.js$/},a=>a.path==='./storage.js'?{path:'store',namespace:'teststore'}:{path:path.join(root,a.path)});b.onLoad({filter:/.*/,namespace:'teststore'},()=>({contents:'export const store = globalThis.__rsTestStore;',loader:'js'}));}}]});
 const E=require(path.join(tmp,'motor.cjs'));
 const cfg={name:'Probe',nation:'GER',pos:'ST',foot:'rechts',number:9,type:'techniker',mode:E.MODES[0].id,gender:'m',wildcard:E.WILDCARDS.find(x=>x.id==='w_sparbuch')};
 const player=(extra={})=>{E.zufallSetzen(23011);return E.createPlayer({...cfg,...extra})};
 const p=player(), copy=x=>JSON.parse(JSON.stringify(x));
 await ok('F03 gültiger Spieler und gültiges Altbackup',()=>{assert(spielerGueltig(p));assert(backupLesen(JSON.stringify({spiel:'rasenschach',daten:{'rasenschach:stand':JSON.stringify({p})}}),['rasenschach:stand'],E.VERSION));});
 for(const bad of [[],{}, {...p,attrs:{}},{...p,money:-1},{...p,nt:null}]) await ok('F03 ungültigen Spieler ablehnen '+tests.length,()=>assert.throws(()=>backupLesen(JSON.stringify({spiel:'rasenschach',daten:{'rasenschach:stand':JSON.stringify({p:bad})}}),['rasenschach:stand'],E.VERSION)));
 await ok('F03 neuere Sicherung ablehnen',()=>assert.throws(()=>backupLesen(JSON.stringify({spiel:'rasenschach',v:'99.1',daten:{'rasenschach:stand':JSON.stringify({p})}}),['rasenschach:stand'],E.VERSION)));
 const keys=['a','b','legacy'],undo='undo';
 const reset=()=>{fault=null;mem=new Map([['a','ALT'],['b','HALLE'],['legacy','ALTSTAND']]);};
 await ok('F04 Lesefehler verursacht keinerlei Schreibzugriff',async()=>{reset();const before=[...mem];fault=(op,k)=>{if(op==='get'&&k==='b')throw Error('Lesefehler')};await assert.rejects(datenErsetzen(globalThis.__rsTestStore,{a:'NEU'},keys,undo,E.VERSION));assert.deepEqual([...mem],before);fault=null});
 for(const point of ['a','b','legacy']) await ok('F04 Schreib-/Löschfehler mit verifiziertem Rollback '+point,async()=>{reset();const before=[...mem].sort();let once=false;fault=(op,k)=>{if(op!=='get'&&k===point&&!once){once=true;throw Error('Schreibfehler')}};await assert.rejects(datenErsetzen(globalThis.__rsTestStore,{a:'NEU'},keys,undo,E.VERSION),/vollständig wiederhergestellt/);assert.deepEqual([...mem].sort(),before);fault=null});
 await ok('F04 fehlgeschlagene Wiederherstellung ehrlich melden und beim Neustart retten',async()=>{reset();let broken=false;fault=(op,k)=>{if(op==='delete'&&k==='b')broken=true;if(broken&&op!=='get')throw Error('defekt')};await assert.rejects(datenErsetzen(globalThis.__rsTestStore,{a:'NEU'},keys,undo,E.VERSION),/noch offen/);assert(mem.has(IMPORT_JOURNAL));fault=null;await importWiederherstellen(globalThis.__rsTestStore,[...keys,undo]);assert.equal(mem.get('a'),'ALT');assert.equal(mem.get('b'),'HALLE');assert(!mem.has(IMPORT_JOURNAL));});
 await ok('F02 vollständiger Ersatz entfernt fehlende und alte Schlüssel; Rücknahme exakt',async()=>{reset();const r=await datenErsetzen(globalThis.__rsTestStore,{a:'NEU'},keys,undo,E.VERSION);assert(!mem.has('b'));assert(!mem.has('legacy'));await datenErsetzen(globalThis.__rsTestStore,r.daten,keys,undo,E.VERSION,true);assert.equal(mem.get('a'),'ALT');assert.equal(mem.get('b'),'HALLE');assert.equal(mem.get('legacy'),'ALTSTAND');assert(!mem.has(undo));});
 await ok('F17 Mehrschlüsselbuchung ohne Import-Rückweg',async()=>{reset();mem.set(undo,'vorheriger Import');await datenErsetzen(globalThis.__rsTestStore,{a:'KARRIERE',b:'VORRAT LEER'},['a','b'],null,E.VERSION);assert.equal(mem.get('b'),'VORRAT LEER');assert.equal(mem.get(undo),'vorheriger Import')});
 await ok('F44 Schreibreihenfolge bleibt auch bei unterschiedlichen Laufzeiten erhalten',async()=>{let value;const s=serialisierterSpeicher({set:async(k,v)=>{if(v==='alt')await new Promise(r=>setTimeout(r,20));value=v}});await Promise.all([s.set('k','alt'),s.set('k','neu')]);assert.equal(value,'neu')});
 const trained=player();E.develop(trained);const queue=E.drawEvents(trained,2);
 await ok('F01 Ereignis und Funktionsreferenzen ohne erneute Würfel wiederherstellen',()=>{const s=copy(laufStand(trained,'event',{queue,ei:0,er:{text:'entschieden',extra:[]}},E.EVENTS,E.VERSION));const r=laufWeiter(s,E.EVENTS);assert.deepEqual(r.queue.map(e=>e.id),queue.map(e=>e.id));assert.equal(r.queue[0].choices[0],queue[0].choices[0]);assert.equal(r.er.text,'entschieden')});
 const result=player();E.simulateSeason(result);const offers=E.makeOffers(result);
 await ok('F01 Ergebnis und Angebote über JSON-Rundlauf unverändert',()=>{const saved=copy(laufStand(result,'result',{offers},E.EVENTS,E.VERSION));const r=laufWeiter(saved,E.EVENTS);assert.equal(r.step,'result');assert.deepEqual(r.offers,offers);assert.equal(r.season.year,result.seasons.at(-1).year)});
 await ok('F01 ungültige Ereignisfolge nicht als Training neu starten',()=>assert.throws(()=>laufWeiter({p,step:'event'},E.EVENTS)));
 await ok('F52 alle freigeschalteten Beinamen auswählbar',()=>{const meta=Object.fromEntries([1,2,3,4,5,6].map(i=>['mk_bei'+i,true]));const html=renderToStaticMarkup(React.createElement(E.CreateScreen,{meta,onStart:()=>{},onBack:()=>{}}));for(const n of ['der Eiserne','der Weltenbummler','der Vorbildliche'])assert(html.includes(n));const d=new JSDOM(html);assert.equal([...d.window.document.querySelectorAll('button')].filter(b=>b.textContent==='das Uhrwerk').length,1);d.window.close()});
 await ok('F53 Vorsprung erhöht Startwerte; F54 Dauerboni bleiben',()=>{const n=player({meta:{ms_start2:true}});assert(Math.abs(n.money-p.money-.3)<1e-9);assert.equal(n.potential,p.potential+4);const m=player({meta:{mx_ntbonus:true,mx_offers:true},aka:{...E.leereAkademie(),ruhm:135,gegruendet:2026}});E.applyWildcard(m,cfg.wildcard);assert.equal(m.wcMod.ntBonus,3);assert.equal(m.wcMod.offers,1);assert.equal(m.wcMod.dev,.06)});
 await ok('F31/F45 Absolventenkarte enthält Talenttyp und korrektes Alter',()=>{const k=E.KARTEN.ausAbsolvent({id:'t1',name:'Talent',pos:'ST',ovr:70,peak:72,ein:2029,raus:2033,alter:19,typ:'monster'});assert.equal(k.zusatz.typ,'monster');assert.equal(k.alter,19)});
 await ok('F42 Hallenkarten-Identität unabhängig von Sortierung',()=>{const h={id:'career1',name:'Probe',peak:75};assert.equal(E.KARTEN.ausHalle(h,0).kid,E.KARTEN.ausHalle(h,11).kid)});
 await ok('F03 Import akzeptiert alle Spielpositionen',()=>{for(const pos of Object.keys(E.POS))assert(spielerGueltig(player({pos})),pos)});
 await ok('F58 automatische Elf nutzt mögliche Umstellungen statt falscher Lücke',async()=>{
  const fall=JSON.parse(await fs.readFile(path.join(root,'pruefstand/aufstellung-f58.json'),'utf8'));
  const v=E.VEREIN.autoAufstellen(fall.v),form=E.VEREIN.FORMATIONEN.find(f=>f.id===v.formation);
  assert.equal(Object.keys(v.aufstellung).length,fall.expected);
  assert.equal(new Set(Object.values(v.aufstellung)).size,fall.expected);
  for(const [i,id] of Object.entries(v.aufstellung))assert(E.VEREIN.kannSpielen(v.kader.find(s=>s.id===id),form.plaetze[Number(i)]));
  const ohneTW=E.VEREIN.autoAufstellen({...fall.v,kader:fall.v.kader.filter(s=>s.pos!=='TW')});
  assert(Object.keys(ohneTW.aufstellung).length<11);
 });
 // Full React application integration in a simulated DOM, not a real browser.
 const dom=new JSDOM('<div id="root"></div>',{url:'http://unit.test',pretendToBeVisual:true,virtualConsole:new VirtualConsole()});
 for(const k of ['window','document','navigator','HTMLElement','Element','Node','MouseEvent','KeyboardEvent'])Object.defineProperty(globalThis,k,{value:k==='window'?dom.window:k==='document'?dom.window.document:dom.window[k],configurable:true});
 dom.window.scrollTo=()=>{};dom.window.HTMLElement.prototype.scrollIntoView=()=>{};globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const {act}=React,{createRoot}=require('react-dom/client');let ui;
 const flush=async()=>{await act(async()=>{for(let i=0;i<4;i++)await new Promise(r=>setTimeout(r,0))})};
 const mount=async(data={})=>{if(ui)await act(()=>ui.unmount());reset();mem=new Map(Object.entries({'rasenschach:willkommen':JSON.stringify({schirm:true,aka:true,verein:true}),...data}));await act(async()=>{ui=createRoot(document.getElementById('root'));ui.render(React.createElement(E.default))});await flush();};
 const click=async(text)=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim().includes(text));assert(b,'Knopf fehlt: '+text+'; vorhanden: '+[...document.querySelectorAll('button')].map(b=>b.textContent.slice(0,45)).join(' | '));await act(async()=>b.click());await flush();};
 await ok('F35 echter Hauptmenü-Einstieg öffnet Sammlung und kehrt ins Menü zurück',async()=>{await mount({'rasenschach:karten':JSON.stringify({karten:[{kid:'test',name:'Probe',pos:'ST',ovr:70,pot:75,stufe:'silber',herkunft:'pack'}]})});await click('Deine Sammlung');assert(document.body.textContent.includes('Probe'));assert(!document.body.textContent.includes('Verein gründen'));await click('Zurück');assert(document.body.textContent.includes('Deine Sammlung'))});
 await ok('F01 tatsächlicher Menü-/Fortsetzen-Ablauf behält Saison und Angebote',async()=>{await mount({'rasenschach:stand':JSON.stringify(laufStand(result,'result',{offers},E.EVENTS,E.VERSION))});await click('WEITERSPIELEN');await click('Hauptmenü');const saved=JSON.parse(mem.get('rasenschach:stand'));assert.equal(saved.step,'result');assert.deepEqual(saved.angebote,offers);await click('WEITERSPIELEN');assert.equal(JSON.parse(mem.get('rasenschach:stand')).p.seasons.length,result.seasons.length)});
 await ok('F42 echter Karriereabschluss erzeugt genau eine Hallenkarte',async()=>{await mount({'rasenschach:stand':JSON.stringify(laufStand(player(),'training',{},E.EVENTS,E.VERSION))});await click('WEITERSPIELEN');await click('Schuhe an den Nagel hängen');await click('Ja, beenden');const hall=JSON.parse(mem.get('rasenschach:halle'));const cards=JSON.parse(mem.get('rasenschach:karten'));assert.equal(hall.length,1);assert.equal(cards.karten.filter(k=>k.herkunft==='halle').length,1)});
 await ok('F43 manuelle Freigabe im Postfach erzeugt sofort eine Karte',async()=>{
  const a=E.akaGruenden(E.leereAkademie(),'Probeakademie',2029);a.jahr=2033;
  a.talente=[{id:'t1',name:'Talent',nat:'GER',pos:'ST',alter:19,ein:2029,ovr:70,pot:75,typ:'monster'}];
  a.faelle=[{id:'f1',art:'profiangebot',talentId:'t1',name:'Talent',pos:'ST',alter:19,peak:70,ovr:70,gestellt:2033,frist:2034,klub:'Hamburger SV'}];
  await mount({'rasenschach:akademie':JSON.stringify(a),'rasenschach:gesamt':JSON.stringify({...E.leereBilanz(),karrieren:5}),'rasenschach:verein':JSON.stringify({...E.VEREIN.leererVerein(),gekannt:true,name:'Probeverein'})});
  await click('Dein Verein');await act(async()=>document.querySelector('[title="Postfach"]').click());await flush();await click('Freigeben');
  const cards=JSON.parse(mem.get('rasenschach:karten')).karten;assert.equal(cards.length,1);assert.equal(cards[0].kid,'t:t1');assert.equal(cards[0].zusatz.typ,'monster');
  assert.equal(JSON.parse(mem.get('rasenschach:akademie')).absolventen.length,1);
 });
 await ok('F02 tatsächlicher Import entfernt alten Live-Zustand und Migrationsreste',async()=>{
  await mount({'rasenschach:stand':JSON.stringify(laufStand(player(),'training',{},E.EVENTS,E.VERSION)),'mittelkreis:stand':JSON.stringify({p:player()}),'rasenschach:meta':JSON.stringify({ms_start2:true}),'rasenschach:akademie':JSON.stringify({...E.leereAkademie(),name:'ALT AKA',vc:33})});
  await act(async()=>document.querySelector('[aria-label="Optionen"]').click());await flush();await click('Sicherung');await click('Einspielen');
  const el=document.querySelector('textarea[aria-label="Sicherungstext zum Einspielen"]');
  const value=JSON.stringify({spiel:'rasenschach',v:E.VERSION,daten:{'rasenschach:willkommen':JSON.stringify({schirm:true,aka:true,verein:true})}});
  const {Simulate}=require('react-dom/test-utils');await act(()=>Simulate.change(el,{target:{value}}));await click('Einspielen und überschreiben');
  assert(!mem.has('rasenschach:stand'));assert(!mem.has('mittelkreis:stand'));assert(!mem.has('rasenschach:meta'));assert(!mem.has('rasenschach:akademie'));
  await click('Zurück');assert(!document.body.textContent.includes('1 Laufbahnen'));await click('Zurück');assert(!document.body.textContent.includes('WEITERSPIELEN'));
 });
 await ok('F01 entschiedene Ereignisse bleiben nach Menü und Wiederaufnahme entschieden',async()=>{
  const snapshot=laufStand(trained,'event',{queue,ei:0,er:{text:'Bereits entschieden',extra:[]}},E.EVENTS,E.VERSION);
  await mount({'rasenschach:stand':JSON.stringify(snapshot)});await click('WEITERSPIELEN');assert(document.body.textContent.includes('Bereits entschieden'));
  await click('Hauptmenü');await click('WEITERSPIELEN');assert(document.body.textContent.includes('Bereits entschieden'));
  assert.deepEqual(JSON.parse(mem.get('rasenschach:stand')).p.attrs,trained.attrs);
 });

 await ok('F17 echter Karrierestart überträgt Vorrat und speichert sofort',async()=>{
  await mount({'rasenschach:akademie':JSON.stringify({...E.leereAkademie(),laden:{training:1}})});
  assert([...document.querySelectorAll('button')].find(b=>b.textContent.includes('Dein Verein')).disabled);
  await click('NEUELAUFBAHN');await click("Los geht's");
  assert.equal(JSON.parse(mem.get('rasenschach:stand')).p.laden.training,1);
  assert.deepEqual(JSON.parse(mem.get('rasenschach:akademie')).laden,{});
 });
 await ok('F17 echter Karrierestart mit Schreibfehler erhält Vorrat',async()=>{
  await mount({'rasenschach:akademie':JSON.stringify({...E.leereAkademie(),laden:{training:1}})});
  await click('NEUELAUFBAHN');let once=false;
  fault=(op,k)=>{if(op==='set'&&k==='rasenschach:akademie'&&!once){once=true;throw Error('Fehlinjektion')}};
  await click("Los geht's");fault=null;
  assert(!mem.has('rasenschach:stand'));assert.equal(JSON.parse(mem.get('rasenschach:akademie')).laden.training,1);
 });
 await ok('F57 Sicherungsvorschau zeigt Vereinsname und behandelt ungültigen Zeitpunkt',async()=>{
  fault=null;mem=new Map();await act(()=>ui.render(React.createElement(E.BackupScreen,{onBack:()=>{},onImport:async()=>{}})));await flush();
  await click('Einspielen');const el=document.querySelector('textarea[aria-label="Sicherungstext zum Einspielen"]');
  const value=JSON.stringify({spiel:'rasenschach',v:E.VERSION,t:'kaputtes Datum',daten:{'rasenschach:verein':JSON.stringify({...E.VEREIN.leererVerein(),name:'Importverein'})}});
  await act(()=>require('react-dom/test-utils').Simulate.change(el,{target:{value}}));
  assert(document.body.textContent.includes('Importverein'));assert(!document.body.textContent.includes('Invalid Date'));
  assert(document.querySelector('input[type="file"]'));
 });
 await ok('35.167 Abschluss: Fehler an jedem beteiligten Datensatz rollt alle Buchungen zurück',async()=>{
  const keys=['rasenschach:stand','rasenschach:raute','rasenschach:akademie','rasenschach:karten','rasenschach:halle','rasenschach:gesehen','rasenschach:gesamt','rasenschach:erfolge','rasenschach:meta','rasenschach:wildcards'];
  // Die tatsächlich beschriebenen Schlüssel werden aus einem erfolgreichen Abschluss ermittelt.
  await mount({'rasenschach:stand':JSON.stringify(laufStand(player(),'training',{},E.EVENTS,E.VERSION))});
  await click('WEITERSPIELEN');await click('Schuhe an den Nagel hängen');
  const writes=new Set();fault=(op,k)=>{if(op==='set'||op==='delete')writes.add(k)};
  await click('Ja, beenden');fault=null;
  for(const key of [...writes].filter(k=>k!==IMPORT_JOURNAL)){
   await mount({'rasenschach:stand':JSON.stringify(laufStand(player(),'training',{},E.EVENTS,E.VERSION))});
   await click('WEITERSPIELEN');await click('Schuhe an den Nagel hängen');
   const before=[...mem.entries()].sort();let hit=false;
   fault=(op,k)=>{if(!hit&&k===key&&(op==='set'||op==='delete')){hit=true;throw Error('Abbruch '+key)}};
   await click('Ja, beenden');fault=null;
   assert(hit,key);assert.deepEqual([...mem.entries()].sort(),before,key);
   assert(document.body.textContent.includes('vollständig wiederhergestellt'));
   await click('Erneut versuchen');await click('WEITERSPIELEN');
   await click('Schuhe an den Nagel hängen');await click('Ja, beenden');
   assert.equal(JSON.parse(mem.get('rasenschach:halle')).length,1);
  }
 });
 await ok('35.167 Packregeln lehnen Unterdeckung und fehlende Ansprüche ab',()=>{
  const pool=E.KARTEN.leererPool(),cards=E.KARTEN.ziehen('bronze',pool,2026).karten;
  assert.throws(()=>packBuchung({...E.leereAkademie(),vc:1},pool,'kauf','bronze',cards,E.KARTEN),/fehlen VC/);
  assert.throws(()=>packBuchung(E.leereAkademie(),pool,'gratis','bronze',cards,E.KARTEN),/Kein Gratispack/);
  assert.throws(()=>packBuchung(E.leereAkademie(),pool,'start',null,cards,E.KARTEN),/Kein Startpaket/);
  const r=packBuchung({...E.leereAkademie(),vc:999},pool,'kauf','bronze',cards,E.KARTEN);
  assert.equal(r.aka.vc,999-E.KARTEN.packById('bronze').preis);assert.equal(r.pool.karten.length,cards.length);
 });
 await ok('35.167 Packkauf: Speicherfehler erhält Coins und Karten und zeigt keine Enthüllung',async()=>{
  const a={...E.leereAkademie(),vc:999};await mount({'rasenschach:akademie':JSON.stringify(a),'rasenschach:karten':JSON.stringify(E.KARTEN.poolErgaenzen(E.KARTEN.leererPool(),[E.KARTEN.neueKarte('bronze',2026)]))});
  await click('Deine Sammlung');await click('Zum Laden');
  const before=[...mem.entries()].sort();let hit=false;
  fault=(op,k)=>{if(op==='set'&&k==='rasenschach:karten'&&!hit){hit=true;throw Error('voll')}};
  await click('Kaufen');fault=null;assert(hit);
  assert.deepEqual([...mem.entries()].sort(),before);assert(!document.body.textContent.includes('Dein Pack'));
  assert(document.body.textContent.includes('vollständig wiederhergestellt'));
  await click('Kaufen');assert(document.body.textContent.includes('Dein Pack'));
  assert.equal(JSON.parse(mem.get('rasenschach:akademie')).vc,999-E.KARTEN.packById('bronze').preis);
 });
 await ok('35.167 Verkauf: fehlgeschlagene Coinbuchung erhält Karte; Erfolg entfernt sie genau einmal',async()=>{
  const card=E.KARTEN.neueKarte('silber',2026),pool=E.KARTEN.poolErgaenzen(E.KARTEN.leererPool(),[card]);
  await mount({'rasenschach:akademie':JSON.stringify({...E.leereAkademie(),vc:10}),'rasenschach:karten':JSON.stringify(pool)});
  await click('Deine Sammlung');await click('Verkaufen');const before=[...mem.entries()].sort();let hit=false;
  fault=(op,k)=>{if(op==='set'&&k==='rasenschach:akademie'&&!hit){hit=true;throw Error('voll')}};
  await click('Wirklich verkaufen');fault=null;assert(hit);assert.deepEqual([...mem.entries()].sort(),before);
  await click('Wirklich verkaufen');assert.equal(JSON.parse(mem.get('rasenschach:karten')).karten.length,0);
  assert(JSON.parse(mem.get('rasenschach:akademie')).vc>10);
 });

 await ok('35.167 feste Antwortkennungen erhalten Entscheidungen trotz neuer Reihenfolge',()=>{
  const saved=copy(laufStand(trained,'event',{queue,ei:0},E.EVENTS,E.VERSION));
  const reorder=E.EVENTS.map(e=>({...e,choices:[...e.choices].reverse()}));
  assert.deepEqual(laufWeiter(saved,reorder).queue.map(e=>e.choices.map(c=>c.id)),queue.map(e=>e.choices.map(c=>c.id)));
  const legacy={...saved,ablauf:{...saved.ablauf,schema:1,queue:queue.map(e=>({id:e.id,ctx:e._ctx,wahlen:e.choices.map(c=>c.altIndex)}))}};
  assert.deepEqual(laufWeiter(legacy,reorder).queue.map(e=>e.choices.map(c=>c.id)),queue.map(e=>e.choices.map(c=>c.id)));
  const broken=copy(saved);broken.ablauf.queue[0].auswahlIds[0]='entfernte-auswahl';
  assert.throws(()=>laufWeiter(broken,E.EVENTS),/Formatmigration/);
  for(const ev of E.EVENTS){assert.equal(new Set(ev.choices.map(c=>c.id)).size,ev.choices.length);assert(ev.choices.every(c=>typeof c.id==='string'&&Number.isInteger(c.altIndex)))}
 });
 await ok('35.167 Fanshop erhöht Reichweite um 20 Prozent statt unverändertem Abschlag',()=>{
  const q=player();q.assets=q.assets.filter(x=>x!=='fanshop');const ohne=E.socialStats(q).follower;
  const mit=E.socialStats({...q,assets:[...q.assets,'fanshop']}).follower;
  assert(ohne>0);assert(Math.abs(mit-ohne*1.2)<=1);
 });
 await ok('35.167 zusätzliche Vorsätze nutzen die vorhandenen Karrierebedingungen',()=>{
  for(const id of ['beruf','einsatz']){
   const q=player();q.vorsatz=id;assert(!E.vorsatzStand(q,E.leereBilanz(),E.leereAkademie()).erfuellt);
   if(id==='beruf')q.flags.abschluss=true;else q.tot.apps=300;
   assert(E.vorsatzStand(q,E.leereBilanz(),E.leereAkademie()).erfuellt);
  }
 });
 await ok('35.167 Spielansicht ohne Tätigkeitskasten; Vorsatz direkt hinter Wildcard',async()=>{
  const q=player();q.vorsatz='lange';
  await mount({'rasenschach:stand':JSON.stringify(laufStand(q,'training',{},E.EVENTS,E.VERSION))});await click('WEITERSPIELEN');
  assert(!document.querySelector('.a-buehne').textContent.includes('Wähle einen Schwerpunkt —'));
  const zustand=document.querySelector('.a-zustand');assert(zustand.textContent.indexOf('Wildcard')<zustand.textContent.indexOf('Vorsatz'));
  assert(zustand.textContent.includes('Die lange Laufbahn'));
 });

 await ok('35.167 Karriereabschluss mit 15. Vereinsjahr: Verein, Halle und Karten gemeinsam',async()=>{
  const fixture=JSON.parse(await fs.readFile(path.join(root,'pruefstand/aufstellung-f58.json'),'utf8')).v;
  const v=E.VEREIN.autoAufstellen({...fixture,gegruendet:true,name:'Prüfverein',land:'GER',liga:'3. Liga',jahr:15,eingeschrieben:true,
    kader:fixture.kader.map((s,i)=>({...s,name:s.name||'Spieler '+i,alter:22,vertragBis:20,apps:0,goals:0,assists:0}))});
  assert(E.VEREIN.spieltMit(v));
  for(const fail of [true,false]){
   await mount({'rasenschach:stand':JSON.stringify(laufStand(player(),'training',{},E.EVENTS,E.VERSION)),'rasenschach:verein':JSON.stringify(v)});
   await click('WEITERSPIELEN');await click('Schuhe an den Nagel hängen');const before=[...mem.entries()].sort();let hit=false;
   if(fail)fault=(op,k)=>{if(!hit&&op==='set'&&k==='rasenschach:verein'){hit=true;throw Error('Vereinsbuchung')}};
   await click('Ja, beenden');fault=null;
   if(fail){assert(hit);assert.deepEqual([...mem.entries()].sort(),before)}
   else {assert(JSON.parse(mem.get('rasenschach:verein')).abgeschlossen);
    assert(JSON.parse(mem.get('rasenschach:akademie')).startpaket);
    const pool=JSON.parse(mem.get('rasenschach:karten')).karten;
    assert(pool.some(c=>c.herkunft==='verein'));assert(pool.some(c=>c.herkunft==='halle'));
   }
  }
 });

 await ok('F49 verdeckte Karte ist ein natives Bedienelement',async()=>{
  await act(()=>ui.render(React.createElement(E.Spielerkarte,{karte:E.KARTEN.neueKarte('bronze',2026),aufgedeckt:false,onTippen:()=>{}})));await flush();
  const el=document.querySelector('[aria-label^="Verdeckte Karte"]');assert.equal(el.tagName,'BUTTON');assert.equal(el.type,'button');
 });
 await ok('F50 alle Startfelder haben Namen und die Kernfelder native Labels',()=>{
  const d=new JSDOM(renderToStaticMarkup(React.createElement(E.CreateScreen,{meta:{},onStart:()=>{},onBack:()=>{}})));
  const doc=d.window.document;
  for(const el of doc.querySelectorAll('input,select,textarea'))assert(el.getAttribute('aria-label')||el.labels?.length,'Unbenannt: '+el.outerHTML.slice(0,140));
  for(const key of ['name','number','foot','nation','pos']){
   const el=[...doc.querySelectorAll('input,select')].find(e=>e.id.endsWith('-'+key));assert(el?.labels.length,key);
  }d.window.close();
 });
 await ok('35.167 endgültiges Karriereende bleibt nach Neustart abschließbar',async()=>{
  const q=player();q.endNow='Der Körper macht es nicht mehr mit.';
  await mount({'rasenschach:stand':JSON.stringify(laufStand(q,'retire',{},E.EVENTS,E.VERSION))});await click('WEITERSPIELEN');
  assert(![...document.querySelectorAll('button')].some(b=>b.textContent.includes('Weitermachen')));
  await click('Bilanz ziehen');assert(!mem.has('rasenschach:stand'));assert.equal(JSON.parse(mem.get('rasenschach:halle')).length,1);
 });

 for(const speed of [false,true])await ok('35.167 vollständige '+(speed?'Speed':'normale')+' Laufbahn mit Neustart zwischen jedem Schritt',async()=>{
  const q=player();q.speed=speed;
  let data={'rasenschach:ruhe':'1','rasenschach:stand':JSON.stringify(laufStand(q,'training',{},E.EVENTS,E.VERSION))};
  const steps=new Set();let done=false,anzahl=0,maxSaisons=0;
  for(;anzahl<240;anzahl++){
   await mount(data);await click('WEITERSPIELEN');
   const saved=JSON.parse(mem.get('rasenschach:stand'));steps.add(saved.step);maxSaisons=Math.max(maxSaisons,saved.p.seasons.length);
   if(saved.step==='training')await click(speed?'Saison starten':E.TRAINING[0].name);
   else if(saved.step==='retire')await click(saved.p.endNow?'Bilanz ziehen':'Weitermachen');
   else if(saved.step==='winter')await click('Doch bleiben');
   else {
    const selector=saved.step==='result'?'.a-buehne .laufzettel button.btn:not(.sm):not([disabled])':'.a-buehne .laufzettel button:not([disabled])';
    const b=document.querySelector(selector);assert(b,'Aktion fehlt bei '+saved.step);
    await act(async()=>b.click());await flush();
   }
   if(!mem.has('rasenschach:stand')){done=true;break}
   data=Object.fromEntries(mem);
  }
  assert(done,'Kein Karriereabschluss nach '+anzahl+' Aktionen');assert(maxSaisons>=10,'Keine vollständige längere Laufbahn');
  assert(steps.has('training')&&steps.has('event')&&steps.has('result'));
  assert.equal(JSON.parse(mem.get('rasenschach:halle')).length,1);
  assert(JSON.parse(mem.get('rasenschach:karten')).karten.some(c=>c.herkunft==='halle'));
  console.log('  '+anzahl+' Aktionen, '+maxSaisons+' Saisons; jede Wiederaufnahme aus gespeichertem Bestand.');
 });

 if(ui)await act(()=>ui.unmount());dom.window.close();
 console.log('\n'+tests.length+' Regressionen bestanden.');
} finally {fault=null;await fs.rm(tmp,{recursive:true,force:true});}
