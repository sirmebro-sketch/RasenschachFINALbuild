#!/usr/bin/env bash
# ==========================================================================
#  Browsertest als Einzeldatei — Rasenschach XI
#  --------------------------------------------------------------------------
#      bash pruefstand/browsertest.sh                  # Quelle /mnt/project/App.jsx
#      bash pruefstand/browsertest.sh /pfad/zu/App.jsx
#      WERKSTATT=1 bash pruefstand/browsertest.sh       # ZUM SELBER SPIELEN
#      ERSTSTART=1 bash pruefstand/browsertest.sh       # wie eine frische App
#
#  DREI FASSUNGEN, und der Unterschied ist wichtig:
#    ohne Schalter   fuer den Pruefstand. KEINE Werkstatt (ihre dreizehn
#                    Knoepfe wuerden in jeder Zaehlung mitlaufen), der
#                    Willkommensschirm ist vorbelegt.
#    WERKSTATT=1     zum Anschauen und Ausprobieren: Werkstatt drin, Schirm
#                    vorbelegt — man landet sofort im Hauptmenue.
#    ERSTSTART=1     wie eine frisch installierte App: Werkstatt drin, aber
#                    der Willkommensschirm kommt bei JEDEM Neuladen.
#
#  Bis 35.55 gab es nur ERSTSTART, und daran hing beides. Wer die Werkstatt
#  wollte, bekam den Schirm dazu; wer nur die Datei baute, bekam keine
#  Werkstatt. Beides zusammen ging gar nicht.
#
#  Ergebnis: rasenschach-browsertest.html — das ECHTE Produktionsbuendel in
#  einer Datei, ohne Nachladen. Unterschied zur APK: genau eine Datei,
#  storage.js laeuft auf localStorage statt auf Capacitor Preferences.
#  Dazu ein Messwerkzeug, das ausserhalb des Buendels liegt und die App
#  nicht anfasst (siehe messwerkzeug.js).
# ==========================================================================
set -eu
QUELLE="${1:-/mnt/project/App.jsx}"
PS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QUELLDIR="$(cd "$(dirname "$QUELLE")" && pwd)"
QUELLE="$QUELLDIR/$(basename "$QUELLE")"
ARBEIT="${ARBEIT:-/tmp/bt}"

rm -rf "$ARBEIT"; mkdir -p "$ARBEIT"; cd "$ARBEIT"
cp "$QUELLE" App.jsx
# 35.43: die Liste der Beidateien wird AUS App.jsx GELESEN, nicht von Hand
# gepflegt. Als `namen.js` dazukam, stand sie hier nicht drin — der Browsertest
# baute nicht mehr, und der Fehler kam zwanzig Zeilen spaeter als
# "ENOENT: dist/index.html", was nach allem aussieht ausser nach einer
# fehlenden Quelldatei.
#
# `storage.js` steht bewusst NICHT in der Liste: der Browsertest ersetzt sie
# weiter unten durch die localStorage-Fassung. Alles andere, was App.jsx
# importiert, wird mitgenommen — auch das naechste Modul, das noch niemand
# geschrieben hat.
BEIDATEIEN="$(grep -oE 'from "\./[a-zA-Z0-9_]+\.js"' App.jsx | sed 's|from "\./||; s|"$||' | grep -v '^storage\.js$' | sort -u | tr '\n' ' ')"
echo "Beidateien aus App.jsx: $BEIDATEIEN"
for D in $BEIDATEIEN main.jsx index.html package.json package-lock.json; do
  [ -f "$QUELLDIR/$D" ] || { echo "FEHLER: $D fehlt neben $QUELLE"; exit 1; }
  cp "$QUELLDIR/$D" .
done
grep -m1 'const VERSION' App.jsx | sed 's/^/Fassung: /'

# ---- der einzige Unterschied zur App -------------------------------------
cat > storage.js << 'EOF'
/* Gleicher Fehler- und Reihenfolgevertrag wie Capacitor Preferences. */
import { serialisierterSpeicher } from "./sicherung.js";
export const store = serialisierterSpeicher({
  async get(key) { const value = window.localStorage.getItem(key); return value == null ? null : {key,value}; },
  async set(key,value) { window.localStorage.setItem(key,value); return {key,value}; },
  async delete(key) { window.localStorage.removeItem(key); return {key,deleted:true}; },
});
EOF

cat > vite.config.js << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: 100000000,   // alles einbetten
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
EOF

# Seit 35.46 mit Sperrdatei: die Datei, die auf dem Telefon geprueft wird,
# soll dieselben Bibliotheken enthalten wie die APK. Ohne sie waere ein
# Geraetetest gegen ein anderes Buendel gelaufen als das ausgelieferte.
npm ci --no-audit --no-fund > npm-ci.log 2>&1 || { cat npm-ci.log; exit 1; }
npx vite build > build.log 2>&1 || { cat build.log; exit 1; }
cat build.log

# ---- einbetten -----------------------------------------------------------
cp "$PS/messwerkzeug.js" .
cp "$PS/werkstatt.js" .
cat > einbetten.cjs << 'EOF'
const fs = require("fs"), path = require("path"), D = path.join(process.cwd(), "dist");
let html = fs.readFileSync(path.join(D, "index.html"), "utf8");
const m = html.match(/<script type="module"[^>]*src="\.\/assets\/([^"]+)"><\/script>/);
if (!m) { console.error("FEHLER: Skriptverweis nicht gefunden"); process.exit(1); }
const js = fs.readFileSync(path.join(D, "assets", m[1]), "utf8");
if (js.includes("</script")) { console.error("FEHLER: Buendel enthaelt </script"); process.exit(1); }
const rest = fs.readdirSync(path.join(D, "assets")).filter((f) => f !== m[1]);
if (rest.length) { console.error("FEHLER: weitere Dateien in assets/: " + rest.join(", ")); process.exit(1); }
const werkzeug = fs.readFileSync(path.join(process.cwd(), "messwerkzeug.js"), "utf8");
/* WERKSTATT nur bei ERSTSTART=1, also in der Fassung zum Anschauen. In der
   Fassung fuer den Pruefstand bleibt sie draussen: die Pruefungen zaehlen
   Knoepfe und suchen Text, und ein Werkzeugkasten mit dreizehn eigenen
   Knoepfen wuerde in jeder Zaehlung mitlaufen. Gemessen wuerde dann das
   Werkzeug statt des Spiels. */
/* EIGENER SCHALTER seit 35.56. Bis dahin hing die Werkstatt allein an
   ERSTSTART — und ERSTSTART schaltet zugleich den Willkommensschirm ein. Wer
   die Werkstatt wollte, bekam also zwangslaeufig eine Datei, die nach jedem
   Neuladen im Schirm steht; wer die Datei zum Anschauen baute, bekam gar
   keine Werkstatt. Genau der Fall ist eingetreten (Kevin, 35.56: „das
   Werkzeug hat nicht wirklich funktioniert" — es war schlicht nicht drin).
   Zwei Beduerfnisse an einem Schalter sind einer zu wenig. */
const werkstatt = (process.env.WERKSTATT === "1" || process.env.ERSTSTART === "1")
  ? fs.readFileSync(path.join(process.cwd(), "werkstatt.js"), "utf8") : "";
/* Ersetzung IMMER als Funktion. Als Zeichenkette liest replace die Muster
   $& $' $` $1 — und React enthaelt "$&/". Beim ersten Versuch landeten
   dadurch neun Skript-Tags mitten im Code, die Datei sah normal gross aus
   und war trotzdem kaputt. */
/* WILLKOMMENSSCHIRM VORBELEGEN. Seit 35.26 steht er vor dem Hauptmenue, und
   eine frisch geladene Testseite ist genau der "allererste Start". Ohne diese
   Zeile warten `kopfleiste.cjs` und `seitenanfang.cjs` 30 Sekunden auf das
   Zahnrad, das hinter dem Schirm liegt, und brechen ab.
   Hier statt in jedem Pruefskript einzeln: browsertest.sh baut die Seite, die
   ALLE Browserpruefungen benutzen — eine Stelle, nicht drei.
   Der Schirm bleibt geprueft: `ansichten.jsx` nimmt ihn mit sieben eigenen
   Pruefungen auseinander, `startprobe.cjs` prueft, dass die Vorbelegung
   ueberhaupt greift. */
/* ERSTSTART=1 laesst die Vorbelegung weg — dann verhaelt sich die Datei wie
   eine frisch installierte App: der Willkommensschirm erscheint, Akademie und
   Verein sind gesperrt. Genau das braucht man zum ANSCHAUEN.
   Ohne den Schalter wird vorbelegt, weil die Pruefungen sonst im Schirm
   stehenbleiben. Beide Faelle sind gewollt; der Standard ist der fuer den
   Pruefstand, denn der laeuft oefter. */
const erststart = process.env.ERSTSTART === "1";
const vorbelegung = erststart ? "" :
  "<scr" + "ipt>try{localStorage.setItem('rasenschach:willkommen',"
  + "JSON.stringify({schirm:true,aka:true,verein:true}));}catch(e){}</scr" + "ipt>";
html = html
  .replace("</head>", () => vorbelegung + "</head>")
  .replace(/<title>[^<]*<\/title>/, () => "<title>Rasenschach XI \u2014 Browsertest</title>")
  .replace(m[0], () => '<script type="module">\n' + js + "\n</script>")
  .replace("</body>", () => "<script>\n" + werkzeug + "\n</script>\n"
    + (werkstatt ? "<script>\n" + werkstatt + "\n</script>\n" : "") + "  </body>");
if (html.includes(m[1])) { console.error("FEHLER: Verweis auf " + m[1] + " noch im Text"); process.exit(1); }
const a = (js.match(/\$&/g) || []).length, b = (html.match(/\$&/g) || []).length;
if (a !== b) { console.error("FEHLER: $& im Buendel " + a + ", in der Datei " + b); process.exit(1); }
const ziel = path.join(process.cwd(), "rasenschach-browsertest.html");
fs.writeFileSync(ziel, html);
console.log("Gegenprobe: 0 Verweise auf die Buenddatei, $& unveraendert (" + a + ")");
/* SELBSTPRUEFUNG in BEIDE Richtungen (35.56). Ohne sie faellt es nicht auf,
   wenn die Werkstatt fehlt — genau so ist sie unbemerkt aus der ausgelieferten
   Datei verschwunden. Und die Gegenrichtung zaehlt genauso: waere sie in der
   Pruefstandfassung drin, zaehlten alle Knopfpruefungen dreizehn Knoepfe zu
   viel und niemand wuesste warum. */
const drin = html.indexOf("WERKSTATT \u2014 nur im Browsertest") >= 0;
const gewollt = !!werkstatt;
if (drin !== gewollt) {
  console.error("FEHLER: Werkstatt " + (drin ? "ist drin, sollte aber draussen sein"
    : "fehlt, sollte aber drin sein") + ".");
  process.exit(1);
}
console.log("Werkstatt: " + (drin ? "eingebaut" : "nicht eingebaut (Pruefstandfassung)"));
console.log("geschrieben: " + ziel + "  " + (fs.statSync(ziel).size / 1024).toFixed(0) + " KB");
EOF
node einbetten.cjs

# ---- Gegenproben ---------------------------------------------------------
F=rasenschach-browsertest.html
printf 'Nachladen: %s externe Verweise · %s @import · %s fonts.googleapis\n' \
  "$(grep -oE 'src="[^"]*"|href="[^"]*"' $F | wc -l)" \
  "$(grep -o '@import' $F | wc -l)" "$(grep -o 'fonts.googleapis' $F | wc -l)"
printf '@font-face: %s (weniger als 5 heisst: Schriften fehlen)\n' "$(grep -o '@font-face' $F | wc -l)"
if [ "${SKIP_STARTPROBE:-0}" = "1" ]; then
  echo "Startprobe ausdrücklich ausgelassen; kein interaktiver Browsernachweis."
else
  node "$PS/startprobe.cjs" "$ARBEIT/$F" "$QUELLE"
fi
echo "FERTIG: $ARBEIT/$F"
