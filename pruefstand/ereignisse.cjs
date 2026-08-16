/* Wie oft wiederholen sich Ereignisse? Misst innerhalb einer Laufbahn und
   ueber mehrere Laufbahnen hinweg, mit demselben Gedaechtnis wie im Spiel. */
const App = require("./motor.js");
const NAT = App.NATIONS, POS = Object.keys(App.POS), MODES = App.MODES.map(m=>m.id), TYPEN = App.TYPES;
let rs = 4711;
const zuf = () => (rs = (rs*1103515245+12345) & 0x7fffffff) / 0x7fffffff;
const wahl = a => a[Math.floor(zuf()*a.length) % a.length];

let seen = {};                       // das Gedaechtnis, wie es das Spiel fuehrt
const proLauf = [], zaehler = {}, wiederInLauf = [];
const LAEUFE = 30;

for (let L = 0; L < LAEUFE; L++) {
  const nat = wahl(NAT), pos = wahl(POS);
  const typen = TYPEN.filter(t => !t.pos || t.pos.includes(pos));
  const p = App.createPlayer({ name:"Lauf"+L, nation:nat.id, pos, foot:"rechts", number:9,
    type:(wahl(typen)||TYPEN[0]).id, mode:wahl(MODES), avatar:Math.floor(zuf()*999999)+1,
    gender: zuf()<.5?"w":"m", statur:"normal", seen, meta:{}, wcSeen:{}, aka:{}, hsvZaehler:0 });
  const gesehen = {};
  let r = 0;
  while (r < 40) {
    r++;
    const evs = App.drawEvents(p, 2) || [];
    evs.forEach(e => {
      p.evLog[e.id] = p.seasons.length;
      p.tagLog[e.tag] = p.seasons.length;
      gesehen[e.id] = (gesehen[e.id]||0)+1;
      zaehler[e.id] = (zaehler[e.id]||0)+1;
    });
    try { App.develop(p); p.mv = App.marketValue(p); App.simulateSeason(p); }
    catch(e){ break; }
    if (p.age >= App.LAUFBAHN_MAX || (p.age>=35 && p.ovr<56) || (p.age>=33 && p.ovr<48)) break;
    const of = App.makeOffers(p) || []; if (!of.length) break;
    p.age += 1; p.year += 1;
  }
  const ids = Object.keys(gesehen);
  const doppelt = ids.filter(k => gesehen[k] > 1).length;
  proLauf.push({ saisons: r, verschieden: ids.length, doppelt });
  wiederInLauf.push(doppelt);
  // Gedaechtnis fortschreiben wie im Spiel
  const next = {};
  Object.keys(seen).forEach(k => { const v = seen[k]*.72; if (v >= .25) next[k] = v; });
  Object.keys(p.evLog).forEach(k => { next[k] = (next[k]||0)+1; });
  seen = next;
}

const mittelS = (proLauf.reduce((a,x)=>a+x.saisons,0)/LAEUFE).toFixed(1);
const mittelV = (proLauf.reduce((a,x)=>a+x.verschieden,0)/LAEUFE).toFixed(1);
const mittelD = (wiederInLauf.reduce((a,x)=>a+x,0)/LAEUFE).toFixed(2);
console.log("Ereignisse gesamt: " + App.EVENTS.length);
console.log(LAEUFE + " Laufbahnen · im Schnitt " + mittelS + " Saisons · "
  + mittelV + " verschiedene Ereignisse je Laufbahn");
console.log("Doppelt INNERHALB einer Laufbahn: " + mittelD + " Ereignisse im Schnitt");
const oft = Object.keys(zaehler).sort((a,b)=>zaehler[b]-zaehler[a]);
console.log("Benutzte Ereignisse insgesamt: " + oft.length + " von " + App.EVENTS.length
  + "  (" + Math.round(100*oft.length/App.EVENTS.length) + " %)");
console.log("Haeufigste ueber " + LAEUFE + " Laufbahnen:");
oft.slice(0,12).forEach(k => console.log("  " + zaehler[k] + "x  " + k));
const nie = App.EVENTS.filter(e => !zaehler[e.id]).length;
console.log("Nie gezogen: " + nie);
