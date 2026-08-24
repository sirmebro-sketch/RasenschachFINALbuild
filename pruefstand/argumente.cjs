/* argumente.cjs — 35.41
   ===========================================================================
   EIN Muster fuer alle Pruefwerkzeuge:  --quelle=  --ziel=  --anzahl=

   Warum es das gibt (offener Punkt 12): die Werkzeuge nahmen ihre Argumente
   auf vier verschiedene Arten. `verzeichnis.cjs <Datei>`,
   `uebersicht.cjs <Ziel>`, `vorschau.py <Quelle> <Ziel>`,
   `kalibrierung.cjs <Anzahl>` — an derselben Stelle stand mal eine Quelle,
   mal ein Ziel, mal eine Zahl. Wer sie vertauschte, bekam keinen Fehler,
   sondern ein falsches Ergebnis.

   DER SCHLIMMERE TEIL WAREN DIE RUECKFALLWERTE. `ereignispruefung.cjs` hatte
   `process.argv[2] || process.env.QUELLE || "/mnt/project/App.jsx"`. Ohne
   Argument las es also die schreibgeschuetzte Projektwissen-Kopie. Am
   24.8.2026 nachgemessen: der Lauf ohne Argument meldete SIEBEN tote Flaggen,
   der Lauf mit Argument NULL — weil die Kopie auf 35.30 stand und die
   Anschluesse aus 35.35/35.36 nicht kannte. Kein Absturz, keine Warnung, nur
   eine falsche Antwort.

   Deshalb die harte Regel hier: **fehlt die Quelle, wird abgebrochen.**
   Ein Werkzeug, das nicht weiss, was es misst, darf kein Ergebnis melden.

   Die alten Aufrufformen bleiben gueltig, damit nicht jede Zeile in
   `pruefen.sh` und `sicht.sh` zugleich umgestellt werden muss — aber nur als
   POSITION, nie als stiller Ersatz fuer eine fehlende Angabe.
   =========================================================================== */
const fs = require("fs");
const path = require("path");

/* Liest --name=wert aus der Befehlszeile. Gibt undefined zurueck, wenn nicht da. */
function benannt(name) {
  const pre = "--" + name + "=";
  const t = process.argv.find((a) => a.startsWith(pre));
  return t === undefined ? undefined : t.slice(pre.length);
}

/* Freie Argumente: alles ab argv[2], ohne --flaggen. */
function frei() {
  return process.argv.slice(2).filter((a) => !a.startsWith("--"));
}

/* Die zu pruefende Quelldatei.
   `muster` beschreibt, wie eine gueltige Quelle aussieht (z. B. /App\.jsx$/),
   damit ein positionsweise uebergebenes Ziel nicht als Quelle durchgeht.
   `werkzeug` steht nur in der Fehlermeldung. */
function quelle(werkzeug, muster) {
  const b = benannt("quelle");
  const kandidat = b !== undefined
    ? b
    : frei().find((a) => (muster ? muster.test(a) : true));
  if (!kandidat) {
    console.error("");
    console.error("ABBRUCH: " + werkzeug + " weiss nicht, welche Datei es pruefen soll.");
    console.error("         Es gibt KEINEN Rueckfallwert — ein Werkzeug, das nicht weiss,");
    console.error("         was es misst, darf kein Ergebnis melden.");
    console.error("         Aufruf:  node pruefstand/" + werkzeug + " --quelle=/pfad/zu/App.jsx");
    process.exit(2);
  }
  if (!fs.existsSync(kandidat)) {
    console.error("");
    console.error("ABBRUCH: " + werkzeug + " findet die Quelle nicht: " + kandidat);
    process.exit(2);
  }
  return path.resolve(kandidat);
}

/* Die zu schreibende Zieldatei. Fehlt sie, wird `standard` benutzt — das ist
   ungefaehrlich, weil ein falsches Ziel auffaellt (die Datei liegt woanders),
   waehrend eine falsche Quelle stumm ein falsches Ergebnis liefert. */
function ziel(standard, muster) {
  const b = benannt("ziel");
  if (b !== undefined) return path.resolve(b);
  const k = frei().find((a) => (muster ? muster.test(a) : false));
  return path.resolve(k || standard);
}

/* Eine Anzahl (Laufbahnen, Durchgaenge). Nur als --anzahl= oder als reine
   Zahl unter den freien Argumenten — eine Zahl kann man nicht mit einem
   Dateinamen verwechseln. */
function anzahl(standard) {
  const b = benannt("anzahl");
  if (b !== undefined && Number.isFinite(+b)) return +b;
  const k = frei().find((a) => /^\d+$/.test(a));
  return k ? +k : standard;
}

/* Ja/Nein-Schalter, z. B. --pruefen */
const schalter = (name) => process.argv.includes("--" + name);

module.exports = { quelle, ziel, anzahl, schalter, benannt, frei };
