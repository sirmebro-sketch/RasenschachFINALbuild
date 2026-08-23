#!/usr/bin/env bash
# ==========================================================================
#  knoepfe.sh — prueft, dass Knoepfe lesbar sind und im Bild bleiben
#  --------------------------------------------------------------------------
#      bash pruefstand/knoepfe.sh [App.jsx]
#  Haengt in sicht.sh. Baut das Buendel aus der uebergebenen Quelle selbst.
# ==========================================================================
set -eu
QUELLE="${1:-App.jsx}"
QUELLE="$(cd "$(dirname "$QUELLE")" && pwd)/$(basename "$QUELLE")"
PS="$(cd "$(dirname "$0")" && pwd)"
BAU=/tmp/ps

TEILE=aufbau bash "$PS/pruefen.sh" "$QUELLE" > /tmp/knoepfe-aufbau.log 2>&1 || {
  echo "FEHLER: Aufbau gescheitert:"; tail -12 /tmp/knoepfe-aufbau.log; exit 1; }
grep -m1 'const VERSION' "$BAU/probe.jsx" | sed 's/^/  gebaut aus: /'
cp "$PS/knopfbogen.jsx" "$BAU/"
npx --yes esbuild@0.23.0 "$BAU/knopfbogen.jsx" --bundle --outfile="$BAU/knopfbogen.js" \
  --platform=browser --format=iife --log-level=error

cat > "$BAU/knopfbogen.html" << 'HTMLEOF'
<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=412,initial-scale=1">
<style>body{margin:0;background:#0d0f11;}</style></head>
<body><div id="bogen"></div><script src="./knopfbogen.js"></script></body></html>
HTMLEOF

for B in ${BREITEN:-412 360}; do
  BREITE=$B node "$PS/knopfmessung.cjs" "$BAU/knopfbogen.html"
  echo
done
