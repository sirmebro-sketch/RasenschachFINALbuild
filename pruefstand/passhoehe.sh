#!/usr/bin/env bash
# ==========================================================================
#  passhoehe.sh — den Spielerpass in echtem Chromium vermessen
#  --------------------------------------------------------------------------
#      bash pruefstand/passhoehe.sh [App.jsx] [bild.png]
#
#  Braucht ein gebautes /tmp/ps (also einen Lauf von pruefen.sh mit `aufbau`).
#  Warum ein echter Browser: jsdom rechnet kein Layout. Ob ein Flexbehaelter
#  umbricht, ist genau die Frage — und strukturell unbeantwortbar.
# ==========================================================================
set -eu
QUELLE="${1:-App.jsx}"
QUELLE="$(cd "$(dirname "$QUELLE")" && pwd)/$(basename "$QUELLE")"
PS="$(cd "$(dirname "$0")" && pwd)"
BAU=/tmp/ps
BILD="${2:-}"

# Das Buendel IMMER aus der uebergebenen Quelle neu bauen. Der erste Entwurf
# nahm einfach, was in /tmp/ps lag — und mass damit eine ganz andere Datei als
# die, die im Aufruf stand. Aufgefallen nur, weil die Gegenprobe mit absichtlich
# kaputtem Pass GRUEN blieb: gemessen wurde die heile Fassung von nebenan.
# Dieselbe Klasse wie "altes Buendel geprueft" aus 35.17, diesmal in einem
# Pruefwerkzeug — also an der Stelle, die es haette verhindern sollen.
TEILE=aufbau bash "$PS/pruefen.sh" "$QUELLE" > /tmp/passhoehe-aufbau.log 2>&1 || {
  echo "FEHLER: Aufbau fuer $QUELLE gescheitert:"; tail -12 /tmp/passhoehe-aufbau.log; exit 1; }
[ -f "$BAU/probe.jsx" ] || { echo "FEHLER: $BAU/probe.jsx fehlt trotz Aufbau"; exit 1; }
# Beweis, dass wirklich die uebergebene Quelle im Buendel steckt.
grep -m1 'const VERSION' "$BAU/probe.jsx" | sed 's/^/  gebaut aus: /'
cp "$PS/passbogen.jsx" "$BAU/"
npx --yes esbuild@0.23.0 "$BAU/passbogen.jsx" --bundle --outfile="$BAU/passbogen.js" \
  --platform=browser --format=iife --log-level=error

cat > "$BAU/passbogen.html" << 'HTMLEOF'
<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=412,initial-scale=1">
<style>
  body{margin:0;background:#0d0f11;}
  .fallname{font:11px monospace;color:#7ec87e;padding:5px 8px 2px;}
  /* Kein eigener Rand mehr: Shell bringt maxWidth und padding selbst mit. */
  .rahmen{width:100%;}
  .fall{margin-bottom:16px;}
</style></head><body><div id="bogen"></div>
<script src="./passbogen.js"></script></body></html>
HTMLEOF

# 412 = Kevins S24 Ultra · 360 = verbreitetstes kleines Android · 320 = die
# schmalste Breite, die noch vorkommt. Bei 320 bricht der Zellenblock um;
# das ist zulaessig, solange es DURCHGEHEND passiert (siehe passmessung.cjs).
for B in ${BREITEN:-412 360 320}; do
  BREITE=$B node "$PS/passmessung.cjs" "$BAU/passbogen.html" "$BILD"
  echo
done
