/* ==========================================================================
   verlauf40.cjs — realistischer Verlauf über 40 Laufbahnen
   --------------------------------------------------------------------------
       cd /tmp/ps && node /pfad/pruefstand/verlauf40.cjs 30

   Braucht ein gebautes Bündel unter /tmp/ps/motor.js, also einen Lauf von
   `pruefen.sh` mit dem Teil `aufbau` davor.

   WARUM NICHT IN pruefen.sh: der Lauf braucht rund 40 s bei 30 Durchgängen —
   das wären 40 % mehr Laufzeit für eine Auskunft ohne Zielband. Die Zahl
   steht in STAND.md Abschnitt 4 mit Messdatum; wer sie anzweifelt, ruft das
   hier auf. Nach der Regel aus 35.3 gehört diese Begründung hierher, weil
   die Prüfung eben NICHT automatisch mitläuft.

   Die Laufbahnschleife ist ein wörtlicher Nachbau aus kalibrierung.cjs —
   bewusst identisch, damit die Zahlen mit dem Kalibrierungslauf vergleichbar
   bleiben. Läuft die dort auseinander, gehört sie hier nachgezogen.

   Unterschied zur Kalibrierung: dort spielt `laufbahn(null)` OHNE Akademie-
   bonus, hier mit (`laufbahn(akaBonus(a))`). Das ist der Punkt der Messung —
   die Akademie macht die nächste Laufbahn besser, die bringt mehr VC, und
   davon wächst die Akademie. Ohne diese Rückkopplung misst man etwas anderes.

   Ausbaustrategie: nach jeder Laufbahn kaufen, was bezahlbar ist, IMMER die
   günstigste offene Stufe zuerst. Das ist, was ein Spieler ohne Vorwissen
   tut — und es ist reproduzierbar, im Gegensatz zu "stufenweise", das alles
   heißen kann.
   ========================================================================== */
const E = require("/tmp/ps/motor.js");
const {
  createPlayer, develop, drawEvents, applyFx, simulateSeason, makeOffers, marketValue,
  ovrOf, verdict, makeSquad, pick, CONT, POS, NATIONS, TYPES, MODES,
  leereAkademie, akaGruenden, akaVerbuchen, vcFuer, akaBonus,
  ABTEILUNGEN, akaStufe, akaPreis,
} = E;

const POSL = Object.keys(POS);

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

/* Kauft, solange etwas Bezahlbares offen ist — günstigstes zuerst. */
function ausbauen(a) {
  for (;;) {
    let beste = null;
    for (const abt of ABTEILUNGEN) {
      const preis = akaPreis(a, abt.id);
      if (preis == null || preis <= 0) continue;          // Höchststufe
      if (preis > a.vc) continue;                          // nicht bezahlbar
      if (!beste || preis < beste.preis) beste = { id: abt.id, preis };
    }
    if (!beste) return a;
    a = { ...a, vc: a.vc - beste.preis,
          stufen: { ...a.stufen, [beste.id]: akaStufe(a, beste.id) + 1 } };
  }
}

const N_DURCHGAENGE = require("./argumente.cjs").anzahl(30);   // --anzahl=
const LAUFBAHNEN = 40;

const erg = { profis: [], weltklasse: [], ruhm: [], stufen: [], vollausbau: 0 };
for (let d = 0; d < N_DURCHGAENGE; d++) {
  let a = akaGruenden(leereAkademie(), "Messakademie", 2026);
  for (let L = 0; L < LAUFBAHNEN; L++) {
    const q = laufbahn(akaBonus(a));
    a = akaVerbuchen(a, vcFuer(q)).a;
    a = ausbauen(a);
  }
  const summe = ABTEILUNGEN.reduce((s, x) => s + akaStufe(a, x.id), 0);
  erg.profis.push(a.bilanz.profis);
  erg.weltklasse.push(a.bilanz.weltklasse);
  erg.ruhm.push(a.ruhm);
  erg.stufen.push(summe);
  if (summe >= ABTEILUNGEN.length * 6) erg.vollausbau++;
}

const stat = (arr) => {
  const s = [...arr].sort((x, y) => x - y);
  return { mit: s.reduce((x, y) => x + y, 0) / s.length,
           med: s[Math.floor(s.length * .5)], min: s[0], max: s[s.length - 1] };
};
const z = (x, k = 1) => x.toFixed(k);

console.log("=== " + N_DURCHGAENGE + " Durchgänge à " + LAUFBAHNEN + " Laufbahnen, Ausbau günstigstes zuerst ===");
for (const [name, feld] of [["Profis", "profis"], ["Weltklasse", "weltklasse"],
                            ["Ansehen", "ruhm"], ["Stufensumme", "stufen"]]) {
  const s = stat(erg[feld]);
  console.log("  " + name.padEnd(12) + " Mittel " + z(s.mit).padStart(6)
    + " · Median " + String(s.med).padStart(4) + " · Spanne " + s.min + "–" + s.max);
}
console.log("  Vollausbau (54 Stufen) erreicht: " + erg.vollausbau + " von " + N_DURCHGAENGE);

const mRuhm = Math.round(stat(erg.ruhm).med);
const b = akaBonus({ ruhm: mRuhm });
console.log("  Bonus beim Median-Ansehen " + mRuhm + ": Anlage +" + b.pot + " · Ruf +" + b.rep
  + " · Geld +" + Math.round(b.money * 1000) + " Tsd. € · Entwicklung +" + Math.round(b.dev * 100) + " %");
console.log("  Rohbonus:", JSON.stringify(b));
