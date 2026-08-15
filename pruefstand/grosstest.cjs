/* Grosstest — Rasenschach XI. Aendert nichts, misst nur. */
const App = require("./motor.js");
const NAT = App.NATIONS, POS = Object.keys(App.POS);
const STATUR = ["schlank", "normal", "kraftvoll", "hochgewachsen"];
const MODES = App.MODES.map((m) => m.id), TYPEN = App.TYPES;
const funde = [];
const melde = (b, t) => { if (funde.length < 500) funde.push(b + " — " + t); };
const zahl = (v) => typeof v === "number" && isFinite(v);
let rs = 20260815;
const zuf = () => (rs = (rs * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const wahl = (a) => a[Math.floor(zuf() * a.length) % a.length];
const anlegen = (extra) => {
  const nat = wahl(NAT), pos = wahl(POS);
  const typen = TYPEN.filter((t) => !t.pos || t.pos.includes(pos));
  return App.createPlayer(Object.assign({ name: "Test", nation: nat.id, pos, foot: "rechts",
    number: 1 + Math.floor(zuf() * 99), type: (wahl(typen) || TYPEN[0]).id, mode: wahl(MODES),
    avatar: Math.floor(zuf() * 999999) + 1, gender: zuf() < .5 ? "w" : "m",
    statur: wahl(STATUR) }, extra || {}));
};

console.log("=== 1 · Merkmale ===");
const A = App.ZUEGE_ANZAHL({}, false), AW = App.ZUEGE_ANZAHL({}, true);
const zK = {}, zN = {}, zM = {};
let n1 = 0;
for (let i = 0; i < 5000; i++) {
  const nat = wahl(NAT), g = zuf() < .5 ? "w" : "m", st = wahl(STATUR);
  let z;
  try { z = App.zuegeAusKennung(Math.floor(zuf() * 999999) + 1, g, nat.id, {}, st); }
  catch (e) { melde("Merkmale", nat.id + "/" + g + ": " + e.message); continue; }
  const G = g === "w" ? AW : A;
  Object.keys(G).forEach((k) => {
    const v = z[k];
    if (!Number.isInteger(v)) melde("Merkmale", k + " kein Index: " + v);
    else if (v < 0 || v >= G[k]) melde("Merkmale", k + "=" + v + " ausserhalb 0.." + (G[k] - 1) + " (" + nat.id + "/" + g + ")");
  });
  if (g === "m" && z.schminke !== 0) melde("Merkmale", "Mann mit schminke=" + z.schminke);
  if (g === "w" && z.bart !== 0) melde("Merkmale", "Frau mit bart=" + z.bart);
  zK[z.kopf] = (zK[z.kopf] || 0) + 1; zN[z.nase] = (zN[z.nase] || 0) + 1; zM[z.mund] = (zM[z.mund] || 0) + 1;
  n1++;
}
const vt = (t, n) => { const s = []; for (let i = 0; i < n; i++) s.push(i + ":" + (100 * (t[i] || 0) / n1).toFixed(1) + "%"); return s.join(" "); };
console.log("  " + n1 + " Saetze · Kopf " + vt(zK, App.KOPFFORM.length));
console.log("  Nase " + vt(zN, A.nase));
console.log("  Mund " + vt(zM, A.mund));
for (let i = 0; i < App.KOPFFORM.length; i++) if (!zK[i]) melde("Verteilung", "Kopfform " + i + " (" + App.KOPFFORM[i].n + ") kommt nie vor");
for (let i = 0; i < A.nase; i++) if (!zN[i]) melde("Verteilung", "Nase " + i + " kommt nie vor");
for (let i = 0; i < A.mund; i++) if (!zM[i]) melde("Verteilung", "Mund " + i + " kommt nie vor");
const kopfBei = (st) => { const t = {}; for (let i = 0; i < 800; i++) {
  const z = App.zuegeAusKennung(Math.floor(zuf() * 999999) + 1, "m", wahl(NAT).id, {}, st); t[z.kopf] = 1; }
  return Object.keys(t).map(Number).sort((a, b) => a - b); };
const kS = kopfBei("schlank"), kK = kopfBei("kraftvoll"), kN = kopfBei("normal");
console.log("  Statur: schlank->[" + kS + "] kraftvoll->[" + kK + "] normal->" + kN.length + " Formen");
if (kS.join() === kK.join()) melde("Statur", "schlank und kraftvoll ergeben dieselben Kopfformen");

console.log("\n=== 2 · Spieler anlegen ===");
let n2 = 0, oMin = 99, oMax = 0;
for (let i = 0; i < 4000; i++) {
  let p; try { p = anlegen(); } catch (e) { melde("createPlayer", e.message); continue; }
  if (!p) { melde("createPlayer", "kein Spieler"); continue; }
  App.AK.forEach((k) => { const v = p.attrs[k];
    if (!zahl(v)) melde("Anlagen", k + " ist " + v);
    else if (v < 1 || v > 99) melde("Anlagen", k + "=" + v + " ausserhalb 1..99"); });
  ["ovr","potential","money","morale","form","fitness","trust","rep","age"].forEach((k) => {
    if (!zahl(p[k])) melde("Spieler", k + " ist " + p[k]); });
  if (p.age !== 16) melde("Spieler", "Startalter " + p.age);
  if (!p.club) melde("Spieler", "ohne Verein");
  if (!p.name) melde("Spieler", "ohne Namen");
  oMin = Math.min(oMin, p.ovr); oMax = Math.max(oMax, p.ovr); n2++;
}
console.log("  " + n2 + " Spieler · Startstaerke " + oMin + "-" + oMax);

console.log("\n=== 3 · Vollstaendige Laufbahnen ===");
let n3 = 0, sg = 0, sMax = 0, sMin = 99, pk = 0, neg = 0, ohne = 0;
const alter = {};
for (let i = 0; i < 250; i++) {
  let p; try { p = anlegen(); } catch (e) { melde("Laufbahn", "Anlegen: " + e.message); continue; }
  /* WIE DAS SPIEL AUFHOERT.
     Der erste Entwurf lief bis 43 und meldete 171-mal „endet nicht" — falsch.
     Die Altersgrenze steht im Spielablauf (App-Bauteil), nicht im Rechenkern:
     nach der Saison `age >= LAUFBAHN_MAX`, nach dem Hochzaehlen `> LAUFBAHN_MAX`.
     Wer nur develop/simulateSeason/makeOffers ruft, laeuft daran vorbei. Hier
     wird dieselbe Regel nachgebildet, mit derselben ausgefuehrten Zahl. */
  const MAX = App.LAUFBAHN_MAX;
  let r = 0;
  while (r < 45) {
    r++;
    try { App.develop(p); p.mv = App.marketValue(p); App.simulateSeason(p); }
    catch (e) { melde("Laufbahn", "Saison " + r + ": " + e.message); break; }
    if (!zahl(p.ovr)) { melde("Laufbahn", "ovr wurde " + p.ovr); break; }
    if (p.ovr < 1 || p.ovr > 103) melde("Laufbahn", "ovr=" + p.ovr + " ausserhalb 1..103");
    if (!zahl(p.money)) { melde("Laufbahn", "money wurde " + p.money); break; }
    if (p.money < 0) neg++;
    if (!p.club) ohne++;
    ["morale","form","fitness","trust","rep"].forEach((k) => {
      if (!zahl(p[k])) melde("Laufbahn", k + " wurde " + p[k]);
      else if (p[k] < -0.5 || p[k] > 100.5) melde("Laufbahn", k + "=" + Math.round(p[k]) + " ausserhalb 0..100"); });
    /* Steht das Ende nach dieser Saison fest? */
    if (p.age >= MAX || (p.age >= 35 && p.ovr < 56) || (p.age >= 33 && p.ovr < 48)) break;
    let of = []; try { of = App.makeOffers(p) || []; }
    catch (e) { melde("Angebote", "Saison " + r + ": " + e.message); break; }
    if (!of.length) break;
    p.age += 1; p.year += 1;
    if (p.age > MAX) break;
  }
  if (p.age > MAX) melde("Laufbahn", "Spieler ist " + p.age + ", Grenze ist " + MAX);
  if (r >= 45) melde("Laufbahn", "laeuft ueber 45 Saisons (Alter " + p.age + ")");
  const s = (p.seasons || []).length;
  sg += s; sMax = Math.max(sMax, s); sMin = Math.min(sMin, s); pk = Math.max(pk, p.peakOvr || p.ovr || 0);
  alter[p.age] = (alter[p.age] || 0) + 1;
  try { const G = App.bilanzErgaenzen({}, p);
    App.ACHIEVEMENTS.forEach((a) => { try { a.ok(p, G); } catch (e) { melde("Errungenschaft", a.id + ": " + e.message); } });
  } catch (e) { melde("Bilanz", e.message); }
  try { App.verdict(p); } catch (e) { melde("Fazit", e.message); }
  n3++;
}
const al = Object.keys(alter).map(Number).sort((a, b) => a - b);
console.log("  " + n3 + " Laufbahnen · Saisons " + sMin + "-" + sMax + " (Schnitt " + (sg / n3).toFixed(1) + ")");
console.log("  Karriereende " + al[0] + "-" + al[al.length - 1] + " Jahre · hoechste Staerke " + pk);
if (neg) console.log("  " + neg + " Saisons mit negativem Kontostand");
if (ohne) console.log("  " + ohne + " Saisons ohne Verein");

console.log("\n=== 4 · Laden ===");
{
  const p = anlegen({ nation: "GER", pos: "ST", gender: "m", statur: "normal" });
  p.laden = { training: 1, ueber99: 4, reroll: 2, form: 1, berater: 1 };
  App.simulateSeason(p);
  const L = p.laden || {};
  if (L.training !== 0) melde("Laden", "training nach einer Saison " + L.training);
  if (L.ueber99 !== 3) melde("Laden", "ueber99 nach einer Saison " + L.ueber99);
  if (L.reroll !== 2) melde("Laden", "Vorrat reroll veraendert: " + L.reroll);
  console.log("  training " + L.training + " form " + L.form + " berater " + L.berater
    + " ueber99 " + L.ueber99 + " reroll " + L.reroll);
}

console.log("\n=== 5 · Wildcards ===");
{
  const t = {}; let f = 0;
  for (let i = 0; i < 6000; i++) {
    let c = null;
    try { c = App.drawWildcard(wahl(POS), [], null, {}, {}, 0); }
    catch (e) { if (!f++) melde("Wildcard", e.message); continue; }
    if (c && c.r) t[c.r] = (t[c.r] || 0) + 1;
  }
  const k = Object.keys(t);
  if (!k.length) console.log("  (nicht messbar)");
  else { const g = k.reduce((a, x) => a + t[x], 0);
    console.log("  " + g + " Ziehungen · " + k.map((x) => x + " " + (100 * t[x] / g).toFixed(1) + "%").join(" · "));
    Object.keys(App.RARITY).forEach((x) => { if (!t[x]) melde("Wildcard", "Seltenheit " + x + " nie gezogen"); }); }
}

console.log("\n########## FUNDE ##########");
if (!funde.length) console.log("Keine Auffaelligkeiten.");
else { const e = [...new Set(funde)];
  console.log(funde.length + " Meldungen, " + e.length + " verschiedene:");
  e.slice(0, 30).forEach((x) => console.log("  · " + x));
  if (e.length > 30) console.log("  … und " + (e.length - 30) + " weitere"); }
