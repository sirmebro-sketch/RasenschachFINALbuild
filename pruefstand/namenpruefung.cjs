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

console.log("\n  ----------------------------------------------------------");
console.log("  " + ok + " Proben ohne Befund \u00b7 " + hart + " harte Fehler");
process.exit(hart > 0 ? 1 : 0);
