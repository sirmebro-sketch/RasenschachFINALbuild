/* ==========================================================================
   knopfbogen.jsx — Bildschirme mit Knopfzeilen, zum Vermessen
   --------------------------------------------------------------------------
   Wird von knoepfe.sh gebündelt. Nicht direkt aufrufen.

   WARUM ES DAS GIBT: derselbe Knopffehler ist dreimal aufgetreten —
   Vereinsgründung, Vereinsabschluss und Willkommensschirm. Ursache immer
   `.btn{width:100%}`: steht so ein Knopf in einer Flexzeile, beansprucht er
   die ganze Zeile und der Knopf daneben wird auf einen Streifen gequetscht.
   Gemessen im Willkommensschirm: Zurück 388 px, Weiter 32 px — und dessen
   rechte Kante lag bei 440 px auf einem 412 px breiten Bildschirm, also
   ausserhalb.

   Eine Quelltextsuche hat den dritten Fall NICHT gefunden: dort stand bereits
   `flex: "0 0 auto"`, was richtig aussieht. Es hilft nur nicht, weil
   flex-basis:auto die width aus `.btn` uebernimmt — also 100%. Der Unterschied
   ist im Text unsichtbar und im Layout eindeutig. Deshalb wird gemessen.
   ========================================================================== */
import React from "react";
import { createRoot } from "react-dom/client";
import {
  Shell, Willkommen, VereinGruenden, VereinAbschluss, EndScreen,
  leereAkademie, akaGruenden, VEREIN, CSS,
  createPlayer, develop, simulateSeason, marketValue, verdict,
  TYPES, MODES, POS, NATIONS, pick, makeSquad, CLUBS,
} from "./probe.jsx";

/* Eine kurze, abgeschlossene Laufbahn. Reicht fuer den Abschlussbildschirm —
   er braucht `verdict`, `tot`, `seasons` und `nt`, nicht eine echte Karriere. */
function laufbahn() {
  const q = createPlayer({ name: "Messfall", nation: "GER", pos: "ST", foot: "rechts",
    number: 9, type: TYPES[0].id, mode: MODES[1].id, gender: "m", statur: "normal", aka: null });
  q.club = CLUBS.find((c) => c.g === "m") || CLUBS[0];
  q.squad = makeSquad(q.club, q.g);
  for (let i = 0; i < 12; i++) {
    develop(q); q.mv = marketValue(q); simulateSeason(q); q.age += 1; q.year += 1;
  }
  return q;
}

const stil = document.createElement("style");
stil.textContent = CSS;
document.head.appendChild(stil);

const aka = akaGruenden(leereAkademie(), "Messakademie", 2026);

/* Ein abgeschlossener Verein fuer den Abschlussbildschirm. NACHGESEHEN, nicht
   geraten: `VereinAbschluss` braucht ZWEI Eigenschaften — `v` (den Verein) und
   `ergebnis` (aus `VEREIN.abschluss(v)`). Der erste Entwurf gab nur `ergebnis`
   mit, worauf der Bildschirm leer blieb und "Cannot read properties of
   undefined (reading 'name')" meldete. Der Bogen zeigte dann brav
   "Vereinsabschluss" ohne einen einzigen Knopf und meldete alles in Ordnung —
   ein Prueffall, der nichts prueft, ist schlimmer als keiner. */
function abschlussFall() {
  const g = VEREIN.gruenden(VEREIN.leererVerein(),
    { name: "Testverein", stadt: "Hamburg", land: "GER", liga: "3. Liga" });
  if (!g || !g.v) return null;
  const v = g.v;
  return { v, ergebnis: VEREIN.abschluss(v) };
}

export const BILDSCHIRME = [
  ["Willkommen, Tafel 1", () => React.createElement(Willkommen, { onFertig: () => {} })],
  ["Vereinsgründung", () => React.createElement(VereinGruenden,
    { aka, onFertig: () => {}, onZurueck: () => {} })],
];

const ab = abschlussFall();
if (ab) {
  BILDSCHIRME.push(["Vereinsabschluss", () => React.createElement(VereinAbschluss,
    { v: ab.v, ergebnis: ab.ergebnis, onNeu: () => {}, onZurueck: () => {} })]);
}

/* Der Abschlussbildschirm (35.42). Er kam bis hierher im Knopfbogen NICHT vor
   — die Zahl stand unveraendert bei 124, obwohl der Bildschirm drei Knoepfe
   und seit 35.42 eine angeheftete Leiste hat. Genau die Leiste ist der Grund,
   sie jetzt aufzunehmen: sie liegt `position:fixed` ueber dem Inhalt, und ob
   sie etwas verdeckt, sieht kein jsdom-Test.

   Der Spieler wird mit `laufbahn()` erzeugt und dann abgeschlossen, damit
   `verdict` und `tot` gesetzt sind. Fehlt eines davon, bleibt der Bildschirm
   leer und der Bogen meldete brav „Abschluss" ohne einen Knopf — derselbe
   Fehler wie beim Vereinsabschluss oben. Deshalb wird unten geprueft, dass
   wirklich Knoepfe da sind. */
function abschlussSpieler() {
  try {
    const q = laufbahn();
    q.retired = true;
    q.verdict = verdict(q);
    q.neueErfolge = [];
    return q;
  } catch (e) { return null; }
}
const abs = abschlussSpieler();
if (abs && abs.verdict) {
  BILDSCHIRME.push(["Abschluss der Laufbahn", () => React.createElement(EndScreen,
    { p: abs, onNew: () => {}, onHall: () => {}, onAka: () => {} })]);
}

const wurzel = document.getElementById("bogen");
BILDSCHIRME.forEach(([titel, mach], i) => {
  const kasten = document.createElement("div");
  kasten.className = "fall";
  kasten.dataset.titel = titel;
  kasten.dataset.i = String(i);
  wurzel.appendChild(kasten);
  /* Durch die ECHTE Shell rendern: sie bringt maxWidth und Innenabstand mit,
     und genau die entscheiden, wie viel Platz eine Knopfzeile hat. */
  createRoot(kasten).render(React.createElement(Shell, { blatt: "optionen" }, mach()));
});
window.__TITEL = BILDSCHIRME.map(([t]) => t);
window.__FERTIG = true;
