/* Prüfstand: simuliert Laufbahnen wie der Schnelldurchlauf im Spiel und
   misst daran die Vermächtnis-Coins und den Ertrag der Jugendakademie.
   --------------------------------------------------------------------
   ZIELBÄNDER — hier steht, worauf kalibriert wurde. Weicht eine Messung ab,
   endet das Skript mit einem Fehler. Wenn eine Kennzahl bewusst verschoben
   werden soll, gehört die Änderung HIER hinein, nicht in einen Kommentar.  */
const ZIEL = {
  laufbahnenBisVollausbau: [25, 35],   // wie viele Karrieren der volle Ausbau kostet
  weltklasseStufe6Median:  [3,  8],    // Weltklassespieler in 25 Jahren, Stufe 6
  rautekarteMedian:        [28, 42],   // Laufbahnen bis zur Rautekarte (Ausgleichszähler)
  vollausbauKosten:        [1400, 1700],
};
const abw = [];
function band(name, wert, [lo, hi], k = 1) {
  const gut = wert >= lo && wert <= hi;
  if (!gut) abw.push(name + " = " + wert.toFixed(k) + " (Ziel " + lo + "–" + hi + ")");
  return (gut ? "  ✓ " : "  ✗ ") + name + ": " + wert.toFixed(k) + "  (Ziel " + lo + "–" + hi + ")";
}
const E = require("/tmp/ps/motor.js");
const {
  createPlayer, develop, drawEvents, applyFx, simulateSeason, makeOffers, marketValue,
  ovrOf, verdict, makeSquad, pick, CONT, POS, NATIONS, TYPES, MODES, CLUBS,
  leereAkademie, akaGruenden, akaJahr, akaVerbuchen, vcFuer, akaBonus,
  ABTEILUNGEN, akaStufe, akaPreis, akaRestkosten, akaRuhm, talentBauen,
} = E;

const clone = (x) => ({ ...x, attrs: { ...x.attrs }, flags: { ...x.flags }, evLog: { ...x.evLog },
  nt: { ...x.nt, majors: [...x.nt.majors] }, tot: { ...x.tot }, depot: { ...x.depot },
  trophies: [...x.trophies], awards: [...x.awards], seasons: [...x.seasons],
  traits: [...x.traits], milestones: [...x.milestones], assets: [...x.assets],
  squad: x.squad.map((s) => ({ ...s })), life: { ...x.life },
  wcMod: { ...x.wcMod }, tagLog: { ...x.tagLog } });

const POSL = Object.keys(POS);

/* Eine vollständige Laufbahn, gespielt wie der Schnelldurchlauf */
function laufbahn(aka) {
  const nat = pick(NATIONS);
  const pos = pick(POSL);
  const typen = TYPES.filter((t) => !t.pos || t.pos.includes(pos));
  let q = createPlayer({
    name: "Prüfling", nation: nat.id, pos, foot: "rechts", number: 10,
    type: (pick(typen) || TYPES[0]).id, mode: pick(MODES).id, gender: "m",
    statur: "normal", aka,
  });
  for (let i = 0; i < 40; i++) {
    if (q.age >= 41) break;
    develop(q); q.mv = marketValue(q);
    const evs = drawEvents(q, 2);
    evs.forEach((e) => {
      q.evLog[e.id] = q.seasons.length;
      const ch = pick(e.choices);
      let out;
      if (ch.roll) { const r = Math.random(); let acc = 0; out = ch.roll[ch.roll.length - 1];
        for (const o of ch.roll) { acc += o.p; if (r <= acc) { out = o; break; } } } else out = { fx: ch.fx };
      applyFx(q, out.fx); q.ovr = ovrOf(q.attrs, q.pos);
    });
    if (q.endNow) break;
    simulateSeason(q);
    const of = makeOffers(q);
    if (!of.length) break;
    const best = [...of].sort((a, b) => {
      const w = (x) => (x.roleKey === "star" || x.roleKey === "start" ? 30 : x.roleKey === "rot" ? 10 : 0) + x.club.s;
      return w(b) - w(a); })[0];
    if (best.type === "transfer" || best.type === "loan") {
      q.club = best.club; q.squad = makeSquad(best.club, q.g); q.trust = 52;
      q.flags.kapitaen = false;
      if (best.type === "transfer") { q.contract = best.years; q.wage = best.wage; }
      q.europeNext = best.club.s >= 74 ? CONT(best.club, 4) : null;
    } else if (best.type === "renew") { q.contract = best.years; q.wage = best.wage; }
    q.age += 1; q.year += 1; q.mv = marketValue(q);
    if (q.age >= 41 || (q.age >= 35 && q.ovr < 58)) break;
  }
  q.verdict = verdict(q);
  return q;
}

const stat = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = s.reduce((a, b) => a + b, 0) / s.length;
  const q = (p) => s[Math.min(s.length - 1, Math.floor(s.length * p))];
  return { n: s.length, mit: m, med: q(.5), p10: q(.1), p90: q(.9), min: s[0], max: s[s.length - 1] };
};
const z = (x, k = 1) => (Math.round(x * Math.pow(10, k)) / Math.pow(10, k)).toFixed(k);

/* ============ 1. Vermächtnis-Coins je Laufbahn ============ */
const N = +(process.argv[2] || 250);
console.log("=== Vermächtnis-Coins über " + N + " Laufbahnen (ohne Akademiebonus) ===");
const vcs = [], scores = [], jahre = [];
for (let i = 0; i < N; i++) {
  const q = laufbahn(null);
  vcs.push(vcFuer(q)); scores.push(q.verdict.score); jahre.push(q.seasons.length);
}
const V = stat(vcs), S = stat(scores), J = stat(jahre);
console.log("  Punkte     Mittel " + z(S.mit, 0) + " · Median " + z(S.med, 0) + " · P10 " + z(S.p10, 0) + " · P90 " + z(S.p90, 0));
console.log("  Saisons    Mittel " + z(J.mit, 1) + " · Median " + z(J.med, 0));
console.log("  VC         Mittel " + z(V.mit, 1) + " · Median " + z(V.med, 0)
  + " · P10 " + z(V.p10, 0) + " · P90 " + z(V.p90, 0) + " · Spanne " + V.min + "–" + V.max);

const vollausbau = akaRestkosten(leereAkademie());
console.log("  Voller Ausbau kostet " + vollausbau + " VC");
console.log("  → nötige Laufbahnen: " + z(vollausbau / V.mit, 1) + " (im Mittel), "
  + z(vollausbau / V.med, 1) + " (im Median)");
console.log(band("Laufbahnen bis Vollausbau", vollausbau / V.mit, ZIEL.laufbahnenBisVollausbau));
console.log(band("Kosten des Vollausbaus", vollausbau, ZIEL.vollausbauKosten, 0));

/* ============ 2. Akademie über 25 Jahre, je Ausbaustufe ============ */
function akademieLauf(stufe, jahre) {
  let a = leereAkademie();
  ABTEILUNGEN.forEach((x) => { a.stufen[x.id] = stufe; });
  a = akaGruenden(a, "Prüfakademie", 2026);
  for (let i = 0; i < jahre; i++) a = akaJahr(a, a.jahr + 1).a;
  return a;
}
console.log("\n=== Akademie: 25 Jahre je Ausbaustufe (je 40 Durchläufe) ===");
console.log("  Stufe   Aufnahmen  Profis  Weltklasse  Nationalsp.  Turniere  Abbrüche  Ansehen");
for (let st = 1; st <= 6; st++) {
  const R = { aufgenommen: [], profis: [], weltklasse: [], nationalspieler: [], turniere: [], abbrecher: [], ruhm: [] };
  for (let k = 0; k < 40; k++) {
    const a = akademieLauf(st, 25);
    Object.keys(R).forEach((f) => R[f].push(f === "ruhm" ? a.ruhm : a.bilanz[f]));
  }
  const m = (f) => z(stat(R[f]).mit, 1).padStart(9);
  console.log("    " + st + "   " + m("aufgenommen") + "  " + m("profis") + "  " + m("weltklasse")
    + "    " + m("nationalspieler") + "  " + m("turniere") + "  " + m("abbrecher") + "  " + m("ruhm"));
}

/* Streuung der Weltklasse-Ausbeute auf Stufe 6 */
const wk = [];
for (let k = 0; k < 120; k++) wk.push(akademieLauf(6, 25).bilanz.weltklasse);
const W = stat(wk);
console.log("\n  Weltklasse auf Stufe 6 nach 25 Jahren: Median " + W.med
  + " · P10 " + W.p10 + " · P90 " + W.p90 + " · Spanne " + W.min + "–" + W.max);
console.log(band("Weltklasse Stufe 6 (Median)", W.med, ZIEL.weltklasseStufe6Median, 0));

/* ============ 2b. Rautekarte: greift der Ausgleichszähler? ============ */
console.log("\n=== Rautekarte (Ausgleichszähler) ===");
{
  const bisRaute = [];
  for (let k = 0; k < 1200; k++) {
    let z = 0, n = 0;
    for (;;) {
      n++;
      const nat = pick(NATIONS), pos = pick(POSL);
      const typen = TYPES.filter((t) => !t.pos || t.pos.includes(pos));
      const q = createPlayer({ name:"x", nation:nat.id, pos, foot:"rechts", number:9,
        type:(pick(typen)||TYPES[0]).id, mode:pick(MODES).id, gender:"m", statur:"normal",
        hsvZaehler: z });
      if (q.flags && q.flags.nurderhsv) break;
      z++;
      if (n > 800) break;
    }
    bisRaute.push(n);
  }
  const R = stat(bisRaute);
  console.log("  Laufbahnen bis zur Karte: Median " + R.med + " · Mittel " + z(R.mit, 1)
    + " · P10 " + R.p10 + " · P90 " + R.p90);
  const anteil = (g) => (bisRaute.filter((x) => x <= g).length / bisRaute.length * 100).toFixed(1);
  console.log("  Bis Laufbahn 10: " + anteil(10) + " % · 20: " + anteil(20) + " % · 30: " + anteil(30) + " %");
  /* Der Zähler muss auch wirklich am Spieler ankommen — sonst wäre die
     Messung oben wertlos, weil sie ihn selbst übergibt. */
  const probe = createPlayer({ name:"x", nation:NATIONS[0].id, pos:"ST", foot:"rechts", number:9,
    type:TYPES[0].id, mode:MODES[0].id, gender:"m", statur:"normal", hsvZaehler: 7 });
  if (probe.hsvZaehler !== 7) abw.push("hsvZaehler kommt nicht am Spieler an (" + probe.hsvZaehler + " statt 7)");
  else console.log("  Zähler wird am Spieler festgehalten ✓");
  console.log(band("Rautekarte (Median)", R.med, ZIEL.rautekarteMedian, 0));
}

/* ============ 3. Startvorteil ============ */
console.log("\n=== Gedeckelter Startvorteil nach Ansehen ===");
[0, 40, 90, 150, 220, 300, 500].forEach((r) => {
  const b = akaBonus({ ruhm: r });
  console.log("  Ansehen " + String(r).padStart(3) + " → Anlage +" + b.pot + " · Ruf +" + b.rep
    + " · Geld +" + z(b.money * 1000, 0) + " Tsd. € · Entwicklung +" + Math.round(b.dev * 100) + " %");
});

/* ============ 4. Kostenübersicht ============ */
console.log("\n=== Kosten je Abteilung (Stufe 1 → 6) ===");
let ges = 0;
ABTEILUNGEN.forEach((x) => {
  const su = x.kosten.reduce((s, v) => s + v, 0); ges += su;
  console.log("  " + x.n.padEnd(24) + x.kosten.slice(1).join(" · ").padEnd(26) + " = " + su + " VC");
});
console.log("  " + "GESAMT".padEnd(24) + "".padEnd(26) + " = " + ges + " VC");

/* ============ Ergebnis der Zielbänder ============ */
console.log("\n=== Zielbänder ===");
if (abw.length === 0) console.log("  Alle Kennzahlen im Zielband.");
else {
  console.log("  " + abw.length + " Abweichung(en):");
  abw.forEach((x) => console.log("    ✗ " + x));
  console.log("  Falls gewollt: ZIEL oben in dieser Datei anpassen.");
  process.exit(1);
}
