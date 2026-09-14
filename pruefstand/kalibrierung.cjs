/* Prüfstand: simuliert Laufbahnen wie der Schnelldurchlauf im Spiel und
   misst daran die Vermächtnis-Coins und den Ertrag der Jugendakademie.
   --------------------------------------------------------------------
   ZIELBÄNDER — hier steht, worauf kalibriert wurde. Weicht eine Messung ab,
   endet das Skript mit einem Fehler. Wenn eine Kennzahl bewusst verschoben
   werden soll, gehört die Änderung HIER hinein, nicht in einen Kommentar.  */
const ZIEL = {
  /* 20-30 STATT 25-35 (35.81, Kevins Entscheidung). Bis dahin kamen VC nur
     aus der Spielerlaufbahn; seit 35.81 zahlen auch Akademie, Verein und
     Errungenschaften. Das Band wird deshalb ABSICHTLICH gesenkt — nicht,
     weil die Messung nicht passte, sondern weil sich das Spiel geaendert hat.
     Der Unterschied ist wichtig: ein Band, das man verschiebt, damit es
     wieder gruen wird, hueetet nichts mehr. Dieses hier wurde verschoben,
     nachdem die Entscheidung gefallen war, und die steht in STAND.md. */
  laufbahnenBisVollausbau: [20, 30],   // wie viele Karrieren der volle Ausbau kostet
  weltklasseStufe6Median:  [3,  8],    // Weltklassespieler in 25 Jahren, Stufe 6
  rautekarteMedian:        [28, 42],   // Laufbahnen bis zur Rautekarte (Ausgleichszähler)
  /* 35.13: von [1400,1700] auf [2700,3100] angehoben. Das ist KEINE stille
     Anpassung an ein Ergebnis, sondern eine bewusst verschobene Schranke:
     die Akademie hat drei Abteilungen mehr bekommen, der Vollausbau soll
     ausdruecklich teurer sein. Das Band daneben — Laufbahnen bis Vollausbau,
     25 bis 35 — bleibt unveraendert und ist die eigentliche Schranke. Es
     faengt ab, wenn Kosten und Verdienst auseinanderlaufen. */
  vollausbauKosten:        [2700, 3100],
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
  leereAkademie, akaGruenden, akaJahr, akaVerbuchen, vcFuer, akaBonus, vcAusHaeusern,
  ABTEILUNGEN, akaStufe, akaPreis, akaRestkosten, akaRuhm, talentBauen,
  offeneWahlen,
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
      /* NUR OFFENE OPTIONEN (35.135, F07). Bis 35.134 stand hier
         `pick(e.choices)` — die Kalibrierung waehlte also auch Optionen, die
         der Spieler gar nicht anklicken kann: „Auf einen Spezialisten
         bestehen" ohne das noetige Geld, „Auf dem Trainerschein aufbauen"
         ohne Schein. Gemessen: 36 der 1.156 Optionen tragen eine Bedingung
         (3 %), und jede davon war fuer die Simulation offen.

         Das Spiel selbst nimmt `pick(offeneWahlen(e, q))` — dieselbe
         Funktion, die hier jetzt auch steht. Eine Kalibrierung, die andere
         Entscheidungen trifft als das Spiel, misst ein anderes Spiel.

         Bleibt keine Option offen, wird das Ereignis uebersprungen, so wie
         `nextEvent` es auch tut. */
      const offen = offeneWahlen(e, q);
      if (!offen.length) return;
      const ch = pick(offen);
      let out;
      /* UEBER DIESELBE QUELLE WIE DAS SPIEL (35.156, V10). Hier stand
         `Math.random()` — die Kalibrierung wuerfelte an dieser einen Stelle
         an der austauschbaren Quelle vorbei, und ein fester Startwert wirkte
         nur zur Haelfte: zwei Laeufe mit demselben Seed ergaben 21,2 und
         20,8. Dieselbe Sorte Fehler wie F07, nur eine Ebene tiefer. */
      /* `E.rnd(0, 1)` STATT `E.zufall()` (35.156). `zufall` ist eine
         Variable — beim Ausfuehren wird ihr WERT eingefroren, nicht die
         spaeter gesetzte Funktion. `rnd` dagegen liest sie bei jedem Aufruf
         neu und folgt dem Startwert. Zwei Laeufe mit demselben Seed ergaben
         vorher 20,5 und 20,2; erst so stimmen sie ueberein. */
      /* UEBER `pick`, das bereits ausgefuehrt ist und `zufall` bei jedem
         Aufruf neu liest (35.156). `E.zufall` direkt geht NICHT: es ist eine
         Variable, deren Wert beim Ausfuehren eingefroren wird — zwei Laeufe
         mit demselben Seed ergaben damit 20,5 und 20,2.

         Die Ausgangswahl bleibt gewichtet: statt eine Zufallszahl mit den
         Wahrscheinlichkeiten zu vergleichen, wird aus einem nach Gewicht
         gefuellten Korb gezogen. Dasselbe Ergebnis, aber ueber dieselbe
         Quelle wie das Spiel. */
      if (ch.roll) {
        const korb = [];
        ch.roll.forEach((o) => {
          const n = Math.max(1, Math.round((o.p || 0) * 100));
          for (let z = 0; z < n; z++) korb.push(o);
        });
        out = korb.length ? pick(korb) : ch.roll[ch.roll.length - 1];
      } else out = { fx: ch.fx };
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
/* 600 STATT 250 (35.118) — GEMESSEN, NICHT GERATEN. „Laufbahnen bis
   Vollausbau" liegt dicht an seiner Untergrenze von 20 (offener Punkt 21),
   und bei 250 Laufbahnen streute der Wert so weit, dass die Pruefung
   gelegentlich rot meldete, ohne dass etwas kaputt war — in dieser Fassung
   einmal genau auf 20,0.

   Fuenf Laeufe je Stichprobe, dieselbe Quelle:

       N=250   21,0 · 20,8 · 20,4 · 20,1 · 20,8      Spanne 0,9
       N=600   21,1 · 20,6 · 20,8 · 21,2 · 20,6      Spanne 0,6

   UND WAS DAS NICHT LOEST: fuenf Laeufe ueber `pruefen.sh` ergaben danach
   20,4 · 20,2 · 20,3 · 21,1 · 20,2 — Spanne 0,9, also nicht besser als
   vorher. Fuenf Laeufe sind zu wenig, um eine Streuung nachzuweisen; die
   groessere Stichprobe MUSS rechnerisch helfen (Streuung faellt mit der
   Wurzel), aber belegt ist es hier nicht. Was belegt ist: der niedrigste
   gemessene Wert stieg von 19,9 auf 20,2.

   Das eigentliche Problem bleibt offener Punkt 21: das Band liegt zu dicht
   an seiner Untergrenze. Eine groessere Stichprobe verschiebt die Kante
   nicht, sie macht nur das Zittern kleiner. Ob 20 die richtige Untergrenze
   ist, ist eine Balancing-Entscheidung fuer Kevin.

   Kosten: rund 10 s mehr je Lauf (15 s auf 25 s).

   ACHTUNG BEIM NACHMESSEN: `pruefen.sh` reicht `--anzahl` NICHT durch. Ein
   Vergleich ueber `TEILE=kalib bash pruefstand/pruefen.sh App.jsx
   --anzahl=1000` misst dreimal dieselbe Stichprobe und sieht nach einer
   Verbesserung aus, die es nicht gibt. Direkt `kalibrierung.cjs` aufrufen. */
const N = require("./argumente.cjs").anzahl(600);   // --anzahl=  oder reine Zahl

/* FESTER STARTWERT (35.156, V10). `--seed=<zahl>` macht den Lauf
   reproduzierbar: derselbe Seed ergibt dieselben Laufbahnen und damit
   dieselbe Zahl.

   WOZU. Bisher liess sich nicht sagen, ob eine Aenderung gewirkt hat oder
   der Wuerfel anders fiel — das Zielband hat viermal grundlos rot gemeldet,
   und sechs Pruefungen mussten auf groessere Stichproben umgestellt werden.
   Mit festem Startwert vergleicht man zwei Faessungen bei IDENTISCHEN
   Laufbahnen; der Unterschied ist dann die Aenderung, nicht der Zufall.

   OHNE `--seed` bleibt alles wie bisher zufaellig. Das ist wichtig: eine
   Kalibrierung, die immer denselben Verlauf misst, misst nur einen Verlauf.
   Der Seed ist ein Werkzeug fuer den Vergleich, nicht der Normalfall. */
const SEED = (() => {
  const roh = require("./argumente.cjs").benannt("seed");
  if (roh == null) return null;
  const z = parseInt(roh, 10);
  return Number.isFinite(z) ? z : null;
})();
if (SEED != null && typeof E.zufallSetzen === "function") {
  E.zufallSetzen(SEED);
  console.log("  Fester Startwert: " + SEED + " — dieser Lauf ist wiederholbar.");
}
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

/* DIE NEUEN QUELLEN MITZAEHLEN (35.81). Bis dahin rechnete dieses Band nur
   mit `vcFuer` — den Coins aus der Spielerlaufbahn. Seit 35.81 zahlen auch
   die Akademie, der Verein und die Errungenschaften.
   Ohne diese Zeilen haette das Band weiter 28 gemeldet, waehrend das Spiel
   19 liefert. EIN BAND, DAS EINE QUELLE NICHT KENNT, HUETET NICHTS — es
   meldet gruen ueber einen Zustand, den es gar nicht misst. Das ist
   schlimmer als kein Band, weil man sich darauf verlaesst. */
const akaJeLaufbahn = (() => {
  /* Eine Akademie ueber N Jahre mitlaufen lassen und zaehlen, was sie
     abwirft. Ein Akademiejahr entspricht einer beendeten Laufbahn. */
  let a2 = akaGruenden(leereAkademie(), "Kalibrierung", 2026);
  a2 = { ...a2, vc: 999999 };
  let vor = { profis: 0, weltklasse: 0, nationalspieler: 0, turniere: 0 };
  let summe = 0, n2 = 0;
  for (let j = 0; j < 60; j++) {
    const z2 = E.akaNaechster(a2);
    if (z2) a2 = { ...a2, stufen: { ...a2.stufen, [z2.abt.id]: (a2.stufen[z2.abt.id] || 1) + 1 } };
    const r2 = akaJahr(a2, 2026 + j + 1);
    a2 = r2.a || r2;
    const b2 = a2.bilanz || {};
    summe += E.vcAusHaeusern({
      profis: (b2.profis || 0) - vor.profis,
      weltklasse: (b2.weltklasse || 0) - vor.weltklasse,
      nationalspieler: (b2.nationalspieler || 0) - vor.nationalspieler,
      turniere: (b2.turniere || 0) - vor.turniere,
    }, null, null).vc;
    vor = { profis: b2.profis || 0, weltklasse: b2.weltklasse || 0,
      nationalspieler: b2.nationalspieler || 0, turniere: b2.turniere || 0 };
    n2++;
  }
  return n2 ? summe / n2 : 0;
})();
/* Errungenschaften: alle zusammen, verteilt auf dreissig Laufbahnen. Grob,
   aber die Groessenordnung stimmt — und darum geht es hier. */
const erfJeLaufbahn = (E.ACHIEVEMENTS || [])
  .reduce((s2, x) => s2 + E.vcAusHaeusern(null, null, [x]).vc, 0) / 30;
/* Der Verein: nicht jede Saison ist eine Meistersaison. Mittelmass zahlt
   nichts, ein Drittel der Saisons unter den ersten drei. */
const vereinJeLaufbahn = E.vcAusHaeusern(null, { rang: 3 }, null).vc / 3;

const vcGesamt = V.mit + akaJeLaufbahn + erfJeLaufbahn + vereinJeLaufbahn;
console.log("  dazu je Laufbahn: Akademie " + z(akaJeLaufbahn, 1)
  + " · Errungenschaften " + z(erfJeLaufbahn, 1)
  + " · Verein " + z(vereinJeLaufbahn, 1)
  + "  → zusammen " + z(vcGesamt, 1) + " VC");

const vollausbau = akaRestkosten(leereAkademie());
console.log("  Voller Ausbau kostet " + vollausbau + " VC");
/* ZWEI ZAHLEN, ZWEI FRAGEN — bis 35.101 hiessen sie fast gleich (35.102).
   Die Zeile hier teilt nur durch `V.mit`, also durch die VC AUS DER LAUFBAHN
   ALLEIN; die Zeile darunter teilt durch `vcGesamt`, wo Akademie,
   Errungenschaften und Verein mitzaehlen. Beide sind richtig, aber sie
   beantworten Verschiedenes, und nur die zweite wird gegen das Zielband
   geprueft. In der externen Bewertung vom 4.9.2026 wurde die erste als
   Kennzahl des Projekts zitiert (27,6 statt 20,7) — kein Lesefehler, sondern
   zwei fast gleich klingende Zeilen zwei Zeilen auseinander. */
console.log("  → nur aus Laufbahn-VC, ohne die anderen Quellen: "
  + z(vollausbau / V.mit, 1) + " Laufbahnen (im Mittel), "
  + z(vollausbau / V.med, 1) + " (im Median)");
console.log(band("Laufbahnen bis Vollausbau (alle Quellen)", vollausbau / vcGesamt, ZIEL.laufbahnenBisVollausbau));
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
