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
  Shell, Willkommen, VereinGruenden, VereinAbschluss,
  leereAkademie, akaGruenden, VEREIN, CSS,
} from "./probe.jsx";

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
