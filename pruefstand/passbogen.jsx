/* ==========================================================================
   passbogen.jsx — der Spielerpass in ECHTEM Chromium, mit Layout
   --------------------------------------------------------------------------
   Wird von passhoehe.sh gebündelt und in eine Seite gehängt. Nicht direkt
   aufrufen.

   Warum nicht renderToStaticMarkup wie im Porträtbogen: `Pass` benutzt
   `useState` fürs Wenden, und `motor.js` hat sein eigenes React eingebündelt.
   Ein react-dom von aussen sieht dessen Hook-Speicher nicht und meldet
   „Invalid hook call". Deshalb derselbe Weg wie in `ansichten.jsx`: aus
   `probe.jsx` importieren und im selben Bündel mounten.
   ========================================================================== */
import React from "react";
import { createRoot } from "react-dom/client";
import { Pass, Shell, createPlayer, CLUBS, TYPES, MODES, CSS } from "./probe.jsx";

/* Karrierestand frei gesetzt, NICHT erspielt: gefragt ist, wie die Höhe auf
   breite Zahlen reagiert — dafür müssen die Zahlen bestimmbar sein. */
function spieler({ stationen, apps, goals, assists, kapitaen, ntKapitaen, caps, titel, name }) {
  const p = createPlayer({
    name: name || "Max Mustermann", nation: "GER", pos: "ST", foot: "rechts",
    number: 10, type: TYPES[0].id, mode: MODES[1].id, gender: "m", statur: "normal",
  });
  p.tot = { ...p.tot, apps, goals, assists };
  p.nt = { ...p.nt, caps: caps || 0, kapitaen: !!ntKapitaen };
  p.flags = { ...p.flags, kapitaen: !!kapitaen };
  p.trophies = [];
  for (let i = 0; i < (titel || 0); i++) p.trophies.push({ n: "Meisterschaft", y: 2030 + i });
  /* Feldnamen NACHGESEHEN, nicht geraten: eine Saison traegt `club` als
     NAMEN, `clubRef` als Objekt und `y` als Jahr. Mein erster Entwurf steckte
     das Vereinsobjekt in `club` — React meldete daraufhin 170-mal "Objects
     are not valid as a React child", und gemessen wurde nichts. */
  p.seasons = [];
  for (let i = 0; i < stationen; i++) {
    const c = CLUBS[(i * 37) % CLUBS.length];
    p.seasons.push({ y: 2027 + i, club: c.n, clubRef: c,
      apps: Math.round(apps / stationen), goals: Math.round(goals / stationen),
      assists: Math.round(assists / stationen), ovr: 70, age: 18 + i });
  }
  if (p.seasons.length) p.club = CLUBS[((stationen - 1) * 37) % CLUBS.length];
  return p;
}

export const FAELLE = [
  /* Der Anfangszustand gehoert dazu: vor der ersten Saison steht statt der
     Liste ein Hinweistext. Wer nur "ab einer Station" misst, sieht den
     groessten Sprung der ganzen Laufbahn nicht. */
  ["0 Stationen (vor der 1. Saison)", { stationen: 0,  apps: 0,    goals: 0,   assists: 0 }],
  ["1 Station, kleine Zahlen",        { stationen: 1,  apps: 12,   goals: 3,   assists: 1 }],
  ["5 Stationen (unter Hinweis)",     { stationen: 5,  apps: 140,  goals: 40,  assists: 25 }],
  ["6 Stationen (Hinweis erscheint)", { stationen: 6,  apps: 170,  goals: 55,  assists: 30 }],
  ["10 Stationen, dreistellig",       { stationen: 10, apps: 380,  goals: 150, assists: 95 }],
  ["16 Stationen, vierstellig",       { stationen: 16, apps: 1024, goals: 512, assists: 256 }],
  ["Endstand + 2 Binden + Titel",     { stationen: 18, apps: 1240, goals: 640, assists: 320,
                                        kapitaen: true, ntKapitaen: true, caps: 120, titel: 14 }],
  /* Namenslänge NACHGESEHEN, nicht geschätzt: das Eingabefeld im Erstell-
     bildschirm lässt 22 Zeichen zu (die 34 daneben gehören zum AKADEMIE-namen),
     der längste generierte Name hat 20. Der erste Entwurf prüfte mit 34 Zeichen
     und meldete daraufhin einen Höhensprung von 22 px bei 360 px — für einen
     Namen, den niemand eingeben kann. Ein Härtefall, den es nicht gibt, ist
     kein Härtefall, sondern ein Fehlalarm. */
  ["Längster echter Name (22)",       { stationen: 18, apps: 1240, goals: 640, assists: 320,
                                        kapitaen: true, ntKapitaen: true, caps: 120, titel: 14,
                                        name: "Giorgos Papadopoulos" }],
  ["22 Zeichen, breiteste Buchstaben", { stationen: 18, apps: 1240, goals: 640, assists: 320,
                                        kapitaen: true, ntKapitaen: true, caps: 120, titel: 14,
                                        name: "Wilhelm Wüstenmüller" }],
];

/* Der Stil der App, sonst misst man nacktes HTML. Shell bringt ihn zwar selbst
   mit, aber erst beim Rendern — die Kopfzeile hier stellt sicher, dass er auch
   dann steht, wenn nur ein Teil gerendert wird. */
const stil = document.createElement("style");
stil.textContent = CSS;
document.head.appendChild(stil);

const wurzel = document.getElementById("bogen");
FAELLE.forEach(([titel, s], i) => {
  const kasten = document.createElement("div");
  kasten.className = "fall";
  kasten.dataset.i = String(i);
  kasten.dataset.titel = titel;
  /* Breite wie in der App: der Pass sitzt in einem Bogen mit 14 px Rand.
     Umbruchfragen hängen an genau dieser Breite — ein freier Kasten misst
     eine Breite, die es auf dem Gerät nicht gibt. */
  kasten.innerHTML = '<div class="fallname"></div><div class="rahmen"></div>';
  kasten.querySelector(".fallname").textContent = titel;
  wurzel.appendChild(kasten);
  /* ECHTE Kette statt Nachbau: Shell (maxWidth 860, padding 14px 12px) →
     .main (Grid, grid-template-columns:1fr) → .a-pass → Pass. Bis 35.24 stand
     hier ein selbstgebauter Rahmen mit 14 px Rand. Der stellte die Breite
     ungefähr richtig nach, aber NICHT das Raster — und `1fr` bedeutet
     `minmax(auto, 1fr)`, kann also unter die Mindestbreite des Inhalts nicht
     schrumpfen. Genau diese Eigenschaft war die offene Frage aus Punkt 14. */
  createRoot(kasten.querySelector(".rahmen")).render(
    React.createElement(Shell, null,
      React.createElement("div", { className: "main" },
        React.createElement("div", { className: "a-pass" },
          React.createElement(Pass, { p: spieler(s), full: true })))));
});
window.__FAELLE = FAELLE.map(([t]) => t);
window.__FERTIG = true;
