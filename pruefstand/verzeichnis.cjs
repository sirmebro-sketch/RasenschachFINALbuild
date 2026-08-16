/* ==========================================================================
   verzeichnis.cjs — schreibt das Inhaltsverzeichnis in STAND.md neu
   --------------------------------------------------------------------------
       node pruefstand/verzeichnis.cjs STAND.md

   Warum ein Erzeuger und keine Handarbeit: STAND.md hat 47 Hauptabschnitte
   und waechst mit jeder Fassung. Ein von Hand gepflegtes Verzeichnis ist nach
   drei Fassungen falsch — und ein falsches Verzeichnis ist schlimmer als
   keins, weil man ihm glaubt und an der genannten Zeile nichts findet.

   Das Verzeichnis steht zwischen zwei Marken und wird jedes Mal vollstaendig
   ersetzt. Alles ausserhalb der Marken bleibt unangetastet.

   Zeilennummern beziehen sich auf die Datei NACH dem Einsetzen — das
   Verzeichnis verschiebt ja alles unter sich. Deshalb wird zweimal gerechnet.
   ========================================================================== */
const fs = require("fs");

/* Mit --pruefen wird NICHT geschrieben, sondern nur gemeldet, ob das
   Verzeichnis noch stimmt. So kann `pruefen.sh` das mitpruefen, statt sich
   darauf zu verlassen, dass jemand daran denkt. */
const NURPRUEFEN = process.argv.includes("--pruefen");
const DATEI = process.argv.find((a, i) => i >= 2 && !a.startsWith("--")) || "STAND.md";
const AUF = "<!-- VERZEICHNIS -->";
const ZU = "<!-- ENDE VERZEICHNIS -->";

const roh = fs.readFileSync(DATEI, "utf8");

/* Ein vorhandenes Verzeichnis erst herausnehmen, sonst zaehlt es sich mit.
   Dabei wird der Leerraum drumherum vereinheitlicht: sonst kommt bei jedem
   Lauf eine Zeile dazu oder faellt weg, die Datei aendert sich ohne Grund und
   jeder Vergleich im Repository rauscht. Zweimal laufen lassen muss dieselbe
   Datei ergeben. */
let text = roh;
const a0 = text.indexOf(AUF), e0 = text.indexOf(ZU);
if (a0 >= 0 && e0 > a0) {
  text = text.slice(0, a0).replace(/\n+$/, "\n")
       + text.slice(e0 + ZU.length).replace(/^\n+/, "\n");
}

/* Einsetzstelle: direkt nach der Fassungszeile im Kopf. */
const zeilen = text.split("\n");
let einsatz = zeilen.findIndex((z) => /^\*\*Fassung /.test(z));
if (einsatz < 0) einsatz = 0;
einsatz += 1;
/* Leerzeilen an der Nahtstelle wegnehmen — der Block bringt seine eigenen mit. */
while (zeilen[einsatz] === "") zeilen.splice(einsatz, 1);

/* Alle Hauptabschnitte einsammeln. */
const posten = [];
zeilen.forEach((z, i) => {
  const m = /^## (.+)$/.exec(z);
  if (!m) return;
  posten.push({ nr: i, titel: m[1].trim() });
});

/* Kurzfassung des Titels: das Wesentliche, nicht die ganze Zeile. */
const kurz = (t) => {
  let s = t.replace(/\s+/g, " ").trim();
  if (s.length > 62) s = s.slice(0, 59).replace(/[ ·—-]+$/, "") + "…";
  return s;
};

/* Zweimal rechnen: erst die Laenge des Blocks bestimmen, dann die
   Zeilennummern um genau diese Laenge verschieben. */
const bauen = (versatz) => {
  const out = ["", AUF, "",
    "## Verzeichnis",
    "",
    "*Erzeugt von `pruefstand/verzeichnis.cjs` — nicht von Hand pflegen.*",
    "", "| Zeile | Abschnitt |", "|---:|---|"];
  posten.forEach((p) => {
    out.push("| " + (p.nr + 1 + versatz) + " | " + kurz(p.titel) + " |");
  });
  out.push("", ZU, "");
  return out;
};

let block = bauen(0);
block = bauen(block.length);          // jetzt mit der richtigen Laenge

const neu = zeilen.slice(0, einsatz).concat(block, zeilen.slice(einsatz)).join("\n");

if (NURPRUEFEN) {
  if (neu === roh) { console.log("Verzeichnis stimmt: " + posten.length + " Abschnitte"); process.exit(0); }
  console.error("Das Verzeichnis in " + DATEI + " ist nicht mehr aktuell.");
  console.error("  node pruefstand/verzeichnis.cjs " + DATEI);
  process.exit(1);
}
fs.writeFileSync(DATEI, neu);

/* Gegenprobe: stimmen die genannten Zeilen wirklich? Ein Verzeichnis, das
   danebenzeigt, ist der eigentliche Schaden. */
const kontrolle = neu.split("\n");
let falsch = 0;
posten.forEach((p) => {
  const soll = p.nr + block.length;
  const ist = kontrolle[soll];
  if (!ist || ist.trim() !== ("## " + p.titel).trim()) {
    falsch++;
    if (falsch <= 3) console.error("  daneben: Zeile " + (soll + 1) + " sollte \"" + p.titel + "\" sein");
  }
});
if (falsch) { console.error("FEHLER: " + falsch + " Eintraege zeigen daneben."); process.exit(1); }
console.log("Verzeichnis geschrieben: " + posten.length + " Abschnitte, alle Zeilen nachgeprueft");
