#!/usr/bin/env bash
# ==========================================================================
#  Browsertest als Einzeldatei — Rasenschach XI
#  --------------------------------------------------------------------------
#      bash pruefstand/browsertest.sh                  # Quelle /mnt/project/App.jsx
#      bash pruefstand/browsertest.sh /pfad/zu/App.jsx
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
ARBEIT="${ARBEIT:-/tmp/bt}"

rm -rf "$ARBEIT"; mkdir -p "$ARBEIT"; cd "$ARBEIT"
cp "$QUELLE" App.jsx
for D in schriften.js ereignisse.js verein.js main.jsx index.html package.json; do
  [ -f "$QUELLDIR/$D" ] || { echo "FEHLER: $D fehlt neben $QUELLE"; exit 1; }
  cp "$QUELLDIR/$D" .
done
grep -m1 'const VERSION' App.jsx | sed 's/^/Fassung: /'

# ---- der einzige Unterschied zur App -------------------------------------
cat > storage.js << 'EOF'
/* BROWSERTEST-FASSUNG. In der APK laeuft das ueber Capacitor Preferences.
   Alles in try/catch: sperrt der Browser den Speicher (bei file:// und
   content:// kommt das vor), kommt null zurueck und die App verhaelt sich
   wie ohne Spielstand, statt abzustuerzen. */
export const store = {
  async get(key) {
    try { const value = window.localStorage.getItem(key); return value == null ? null : { key, value }; }
    catch (e) { return null; }
  },
  async set(key, value) {
    try { window.localStorage.setItem(key, value); return { key, value }; }
    catch (e) { return null; }
  },
  async delete(key) {
    try { window.localStorage.removeItem(key); return { key, deleted: true }; }
    catch (e) { return null; }
  },
};
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

npm install --no-audit --no-fund --silent 2>&1 | tail -1
npx vite build 2>&1 | grep -E "index-.*js|built in|error"

# ---- einbetten -----------------------------------------------------------
cp "$PS/messwerkzeug.js" .
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
/* Ersetzung IMMER als Funktion. Als Zeichenkette liest replace die Muster
   $& $' $` $1 — und React enthaelt "$&/". Beim ersten Versuch landeten
   dadurch neun Skript-Tags mitten im Code, die Datei sah normal gross aus
   und war trotzdem kaputt. */
html = html
  .replace(/<title>[^<]*<\/title>/, () => "<title>Rasenschach XI \u2014 Browsertest</title>")
  .replace(m[0], () => '<script type="module">\n' + js + "\n</script>")
  .replace("</body>", () => "<script>\n" + werkzeug + "\n</script>\n  </body>");
if (html.includes(m[1])) { console.error("FEHLER: Verweis auf " + m[1] + " noch im Text"); process.exit(1); }
const a = (js.match(/\$&/g) || []).length, b = (html.match(/\$&/g) || []).length;
if (a !== b) { console.error("FEHLER: $& im Buendel " + a + ", in der Datei " + b); process.exit(1); }
const ziel = path.join(process.cwd(), "rasenschach-browsertest.html");
fs.writeFileSync(ziel, html);
console.log("Gegenprobe: 0 Verweise auf die Buenddatei, $& unveraendert (" + a + ")");
console.log("geschrieben: " + ziel + "  " + (fs.statSync(ziel).size / 1024).toFixed(0) + " KB");
EOF
node einbetten.cjs

# ---- Gegenproben ---------------------------------------------------------
F=rasenschach-browsertest.html
printf 'Nachladen: %s externe Verweise · %s @import · %s fonts.googleapis\n' \
  "$(grep -oE 'src="[^"]*"|href="[^"]*"' $F | wc -l)" \
  "$(grep -o '@import' $F | wc -l)" "$(grep -o 'fonts.googleapis' $F | wc -l)"
printf '@font-face: %s (weniger als 5 heisst: Schriften fehlen)\n' "$(grep -o '@font-face' $F | wc -l)"
node "$PS/startprobe.cjs" "$ARBEIT/$F" "$QUELLE"
echo "FERTIG: $ARBEIT/$F"
