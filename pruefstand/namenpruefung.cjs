/* namenpruefung.cjs — 35.43
   ===========================================================================
   Die Namenskartei waechst Land fuer Land. Dieses Werkzeug haelt die Luecken
   sichtbar, damit sie nicht in 8.000 Namen verschwinden.

   Es prueft vier Sachen:
     1. Welche Nationen haben noch KEINEN eigenen Eintrag?
     2. Welche Eintraege sind als duenn markiert (q:1) und gehoeren nachgeschaerft?
     3. Erzeugt jedes Land ueberhaupt einen brauchbaren Namen — maennlich UND
        weiblich, ohne Leerstellen, ohne doppelte Wortabstaende?
     4. Sind zwei Laender versehentlich identisch? Ein kopierter Eintrag sieht
        aus wie Arbeit und ist keine.

   Es gibt KEINE Grundlinie, an der etwas scheitert, solange die Kartei im
   Aufbau ist — ein fehlendes Land ist kein Fehler, sondern noch nicht getan.
   Harte Fehler sind nur: ein Land, das einen KAPUTTEN Namen liefert, und zwei
   Laender mit identischer Kartei.

   Aufruf:  node pruefstand/namenpruefung.cjs --quelle=/pfad/zu/App.jsx
            --alle  listet auch die Laender ohne Eintrag einzeln auf
   =========================================================================== */
const path = require("path");
const ARG = require("./argumente.cjs");
const MOTOR = path.join(process.env.PS_MOTOR || "/tmp/ps", "motor.js");
const E = require(MOTOR);
const { NATIONS, REGION, KARTEI, genName } = E;

ARG.quelle("namenpruefung.cjs", /App\.jsx$/);   // bricht ab, wenn sie fehlt
const ALLE = ARG.schalter("alle");
let hart = 0, ok = 0;

console.log("########## NAMENSKARTEI ##########");
console.log("  " + NATIONS.length + " Nationen \u00b7 " + Object.keys(KARTEI).length
  + " haben einen eigenen Eintrag");

/* ---- 1) Abdeckung ------------------------------------------------------ */
{
  const ohne = NATIONS.filter((n) => !KARTEI[n.id]);
  const anteil = ((NATIONS.length - ohne.length) / NATIONS.length * 100).toFixed(1);
  console.log("\n  -- Abdeckung --");
  console.log("    " + (NATIONS.length - ohne.length) + " von " + NATIONS.length
    + " = " + anteil + " %");
  if (!ohne.length) { console.log("    \u2713 jede Nation hat ihre eigene Kartei"); ok++; }
  else {
    /* Nach Sprachraum gebuendelt, damit man sieht, wo ein Block fehlt und
       nicht nur eine Streuung von Einzelnamen. */
    const nachRaum = {};
    ohne.forEach((n) => { const r = REGION[n.id] || "?"; (nachRaum[r] = nachRaum[r] || []).push(n); });
    console.log("    noch offen, nach Sprachraum:");
    Object.entries(nachRaum).sort((a, b) => b[1].length - a[1].length).forEach(([r, ns]) => {
      console.log("      " + r.padEnd(4) + String(ns.length).padStart(3) + "  "
        + ns.slice(0, 6).map((x) => x.name).join(", ")
        + (ns.length > 6 ? " \u2026" : ""));
      if (ALLE) ns.forEach((x) => console.log("           " + x.id + " " + x.name));
    });
  }
}

/* ---- 2) Herkunftsmarken ------------------------------------------------ */
{
  console.log("\n  -- Herkunft der Namen --");
  const z = { 3: [], 2: [], 1: [], 0: [] };
  Object.keys(KARTEI).forEach((k) => {
    const n = NATIONS.find((x) => x.id === k);
    if (!n) return;                       // Grundmengen wie `polynesien`
    (z[KARTEI[k].q || 0] = z[KARTEI[k].q || 0] || []).push(n.name);
  });
  console.log("    gesichert (q3):          " + String(z[3].length).padStart(3));
  console.log("    regional abgeleitet (q2):" + String(z[2].length).padStart(3));
  console.log("    d\u00fcnn (q1):               " + String(z[1].length).padStart(3)
    + (z[1].length ? "   " + z[1].join(", ") : ""));
  if (z[0].length) {
    console.log("    OHNE MARKE:              " + String(z[0].length).padStart(3)
      + "   " + z[0].join(", "));
    console.log("    Eine Kartei ohne Herkunftsmarke ist eine Behauptung ohne Angabe,");
    console.log("    woher sie kommt. Marke nachtragen.");
    hart += z[0].length;
  } else ok++;
}

/* ---- 3) Liefert jedes Land einen brauchbaren Namen? -------------------- */
{
  console.log("\n  -- Erzeugte Namen --");
  const kaputt = [];
  NATIONS.forEach((n) => {
    ["m", "w"].forEach((g) => {
      for (let i = 0; i < 40; i++) {
        const s = genName(n.id, g);
        if (!s || typeof s !== "string" || s.length < 2)
          return kaputt.push(n.id + " " + n.name + " (" + g + "): leer");
        if (/\s{2,}/.test(s) || /^\s|\s$/.test(s))
          return kaputt.push(n.id + " " + n.name + " (" + g + "): \u201e" + s + "\u201c doppelter Abstand");
        if (/undefined|null|NaN/.test(s))
          return kaputt.push(n.id + " " + n.name + " (" + g + "): \u201e" + s + "\u201c");
      }
    });
  });
  /* 35.43, nachgetragen: ein Land MIT Eintrag muss seine EIGENEN Namen
     liefern, nicht die des Sprachraums. Die Probe oben pruefte nur, ob
     ueberhaupt ein Name herauskommt — und blieb gruen, als Suedafrika und
     Nigeria still auf die englische Liste zurueckfielen. Ein Name ist noch
     kein richtiger Name. */
  const fremd = [];
  NATIONS.filter((n) => KARTEI[n.id]).forEach((n) => {
    const e = KARTEI[n.id];
    /* Vor- UND Nachnamen zaehlen. Mein erster Entwurf sah nur die Nachnamen
       an — und meldete Myanmar als Fehler, das gar keine Familiennamen kennt
       (`bau: "V"`). Ein Land ohne Nachnamen ist kein Land ohne Kartei. */
    const eigen = new Set();
    const sammel = (o) => {
      (o.n || []).forEach((x) => { if (x) eigen.add(x); });
      (o.v || []).forEach((x) => { if (x) eigen.add(x); });
      (o.w || []).forEach((x) => { if (x) eigen.add(x); });
    };
    sammel(e); (e.gruppen || []).forEach(sammel);
    if (!eigen.size) return;
    let treffer = 0;
    for (let i = 0; i < 30; i++) {
      /* Ganzen Namen UND einzelne Woerter pruefen. Burmesische Namen sind
         mehrteilige Einheiten — „Aung Thu" steht als EIN Eintrag in der Liste
         und zerfaellt beim Zerlegen in zwei Woerter, die einzeln nirgends
         stehen. Mein erster Entwurf meldete Myanmar deshalb als fehlerhaft,
         obwohl die Kartei genau richtig benutzt wurde. */
      const voll = genName(n.id, "m");
      if (eigen.has(voll) || voll.split(" ").some((t) => eigen.has(t))) treffer++;
    }
    if (treffer < 20)
      fremd.push(n.id + " " + n.name + ": nur " + treffer + " von 30 Namen aus der eigenen Kartei");
  });
  if (fremd.length) {
    console.log("    " + fremd.length + " L\u00e4nder benutzen ihre Kartei nicht:");
    fremd.slice(0, 12).forEach((f) => console.log("      \u2717 " + f));
    hart += fremd.length;
  } else { console.log("    \u2713 jedes Land mit Eintrag benutzt seine eigene Kartei"); ok++; }

  if (kaputt.length) {
    console.log("    " + kaputt.length + " kaputte Namen:");
    kaputt.slice(0, 12).forEach((k) => console.log("      \u2717 " + k));
    hart += kaputt.length;
  } else { console.log("    \u2713 alle " + NATIONS.length + " Nationen liefern brauchbare Namen, m\u00e4nnlich und weiblich"); ok++; }
}

/* ---- 4) Zwei Laender mit identischer Kartei ---------------------------- */
{
  console.log("\n  -- Doppelte Karteien --");
  /* Geteilte Grundmengen sind ausdruecklich erlaubt (Antigua und Barbados
     teilen sich das anglokaribische Erbe). Gemeldet wird, wenn ein Eintrag
     NICHT erbt und trotzdem Zeichen fuer Zeichen einem anderen gleicht —
     das ist eine Kopie, keine Entscheidung. */
  const schluessel = {};
  const doppelt = [];
  Object.keys(KARTEI).forEach((k) => {
    const e = KARTEI[k];
    const s = JSON.stringify([e.v, e.w, e.n, e.bau, e.m]);
    if (schluessel[s]) doppelt.push(schluessel[s] + " = " + k);
    else schluessel[s] = k;
  });
  if (doppelt.length) {
    console.log("    " + doppelt.length + " Paare mit identischer Kartei:");
    doppelt.forEach((d) => console.log("      " + d));
    console.log("    Das ist in Ordnung, wenn die Laender sich eine Namenskultur");
    console.log("    wirklich teilen — dann gehoert `erbt` gesetzt statt kopiert.");
  } else { console.log("    \u2713 keine ungewollten Kopien"); ok++; }
}

/* ---- Umfang der Namenstoepfe (35.56) -------------------------------------
   Kevin: „Es sollten nicht nur Namen von Nationalspielern im Pool sein."
   Bis 35.55 stammten beide Listen je Land erkennbar aus aktuellen
   Nationalmannschaften — 20 x 20 = 400 Kombinationen, und wo Vorname und
   Nachname desselben Spielers zusammentrafen, entstand der echte Name
   (nachgewiesen im Browsertest: „Joshua Kimmich" auf dem ersten Bildschirm).

   Geprueft wird der UMFANG, nicht die Herkunft — welcher Name von einem
   Nationalspieler stammt, kann kein Skript wissen. Der Umfang ist aber der
   Hebel: je groesser der Topf, desto seltener trifft eine Ziehung eine echte
   Paarung. Die Zahl steht hier, damit sie nicht wieder schrumpft und damit
   sichtbar bleibt, welche Laender noch klein sind. */
{
  console.log("\n  -- Umfang der Namenstoepfe --");
  const gross = [], klein = [];
  Object.keys(KARTEI).forEach((k) => {
    const e = KARTEI[k];
    if (!e || !e.v || !e.n) return;
    /* DIE BAUART ENTSCHEIDET, was ueberhaupt kombiniert wird. Der erste
       Entwurf rechnete stur `v x n` — und meldete Myanmar als Fehler
       (40 Vornamen x 1 Nachname = 40). Dort ist `bau: "V"`: burmesische
       Namen haben gar keinen Familiennamen, der eine Eintrag ist ein
       Platzhalter, der nie benutzt wird. Der Topf ist also 40 Namen gross
       und vollkommen in Ordnung. Eine Pruefung, die eine richtige Kartei
       anmeckert, wird nach dem dritten Mal abgeschaltet. */
    const bau = e.bau || "VN";
    const kom = bau === "V" ? e.v.length
      : bau === "VNN" ? e.v.length * e.n.length * e.n.length
      : bau === "VMN" || bau === "VpN"
        ? e.v.length * Math.max(1, (e.m || []).length) * e.n.length
      : e.v.length * e.n.length;
    (kom >= 400 ? gross : klein).push([k, kom, e.v.length, e.n.length]);
  });
  const alle = gross.concat(klein);
  const summe = alle.reduce((a2, x) => a2 + x[1], 0);
  alle.sort((a2, b2) => a2[1] - b2[1]);
  console.log("    " + alle.length + " Laender mit eigenen Listen, im Mittel "
    + Math.round(summe / Math.max(1, alle.length)) + " Kombinationen");
  console.log("    kleinste: " + alle.slice(0, 3)
    .map((x) => x[0] + " " + x[1] + " (" + x[2] + "x" + x[3] + ")").join(" \u00b7 "));
  console.log("    groesste: " + alle.slice(-3).reverse()
    .map((x) => x[0] + " " + x[1]).join(" \u00b7 "));

  /* HARTE UNTERGRENZE, ABER NACH BAUART. Unter 100 Kombinationen wiederholen
     sich die Namen so schnell, dass ein Jahrgang wie ein Kopierfehler
     aussieht — das gilt aber nur, wo es ueberhaupt etwas zu kombinieren gibt.
     Bei `bau: "V"` (Myanmar, burmesische Namen ohne Familiennamen) ist die
     Listenlaenge der ganze Topf; 100 zu verlangen hiesse, eine Namenskultur
     an einer Rechnung zu messen, die es dort nicht gibt. Dort zaehlt die
     Zahl der Namen selbst, und 30 ist die Grenze.
     Erst gleich behandelt, dann gemessen: die Pruefung meldete Myanmar als
     harten Fehler, obwohl die Kartei richtig ist. */
  const grenze = (k) => ((KARTEI[k] && KARTEI[k].bau) === "V" ? 30 : 100);
  const zuKlein = alle.filter((x) => x[1] < grenze(x[0]));
  if (zuKlein.length) {
    console.log("    ! unter 100 Kombinationen: "
      + zuKlein.map((x) => x[0] + " (" + x[1] + ")").join(", "));
    hart++;
  } else { console.log("    \u2713 kein Land unter 100 Kombinationen"); ok++; }

  /* Die grossen Fussballnationen sind die, die ein Spieler fuer die eigene
     Laufbahn waehlt — dort faellt eine Wiederholung am ehesten auf. Sie
     wurden in 35.56 erweitert und duerfen nicht zurueckfallen. */
  const ERWEITERT = ["GER","ENG","FRA","ESP","ITA","NED","POR","BRA","ARG","POL",
                     "TUR","USA","MEX","SWE","JPN","KOR"];
  const geschrumpft = ERWEITERT.filter((k) => KARTEI[k]
    && KARTEI[k].v.length * KARTEI[k].n.length < 440);
  if (geschrumpft.length) {
    console.log("    ! seit 35.56 erweitert, jetzt wieder klein: " + geschrumpft.join(", "));
    hart++;
  } else {
    console.log("    \u2713 die 16 erweiterten Nationen liegen alle ueber 440");
    ok++;
  }
}

console.log("\n  ----------------------------------------------------------");
console.log("  " + ok + " Proben ohne Befund \u00b7 " + hart + " harte Fehler");
process.exit(hart > 0 ? 1 : 0);
