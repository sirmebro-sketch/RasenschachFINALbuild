#!/usr/bin/env bash
# ============================================================================
# sicht.sh — was der Pruefstand strukturell NICHT sehen kann
# ----------------------------------------------------------------------------
#     bash pruefstand/sicht.sh App.jsx
#
# `pruefen.sh` laeuft in jsdom. jsdom rechnet kein Layout: ob zwei Dinge
# uebereinanderliegen, ob eine Seite oben beginnt, ob ueberhaupt etwas
# gezeichnet wird — all das ist dort unsichtbar. Genau dort sassen mehrere
# Fehler, die lange niemand bemerkt hat:
#
#   34.21  Laden und Zahnrad lagen 34 px uebereinander
#   34.23  kein Seitenwechsel begann oben
#   34.30  zwei Startproben meldeten seit Fassungen Falschalarm
#
# Diese Pruefungen gab es einzeln, sie liefen aber nur von Hand — und wurden
# deshalb vergessen. Hier laufen sie zusammen, nach EINEM Bau.
#
# Braucht playwright mit Chromium. Ist es nicht da, meldet das Werkzeug das
# und ueberspringt die Browserpruefungen, statt gruen zu tun.
# ============================================================================
set -u
QUELLE="${1:-App.jsx}"
# Absolut aufloesen: browsertest.sh wechselt das Verzeichnis, ein relativer
# Pfad zeigt danach ins Leere.
QUELLE="$(cd "$(dirname "$QUELLE")" && pwd)/$(basename "$QUELLE")"
PS="$(cd "$(dirname "$0")" && pwd)"
ARBEIT="${ARBEIT:-/tmp/sicht}"
FEHLER=0
NICHT=0

echo "########## BAU ##########"
ARBEIT="$ARBEIT" bash "$PS/browsertest.sh" "$QUELLE" > "$ARBEIT.log" 2>&1
BAU=$?
HTML="$ARBEIT/rasenschach-browsertest.html"
if [ $BAU -ne 0 ] || [ ! -f "$HTML" ]; then
  echo "ABBRUCH: der Browsertest liess sich nicht bauen."
  tail -20 "$ARBEIT.log"
  exit 2
fi
grep -E 'Fassung:|geschrieben:' "$ARBEIT.log"

echo
echo "########## STARTPROBE ##########"
# Laeuft schon im Browsertest mit — hier nur das Ergebnis herausziehen, damit
# alles an einer Stelle steht.
sed -n '/=== Startprobe ===/,/bestanden,/p' "$ARBEIT.log" | sed 's/^/  /'
if grep -qE '[1-9][0-9]* nicht bestanden' "$ARBEIT.log"; then FEHLER=$((FEHLER+1)); fi

export NODE_PATH="${NODE_PATH:-/home/claude/.npm-global/lib/node_modules}"
if ! node -e "require('playwright')" 2>/dev/null; then
  echo
  echo "########## BROWSERPRUEFUNGEN ##########"
  echo "  playwright fehlt — Kopfleiste und Seitenanfang NICHT geprueft."
  echo "  Das ist kein gruenes Ergebnis, nur ein fehlendes."
  NICHT=$((NICHT+2))
else
  for W in kopfleiste seitenanfang; do
    echo
    echo "########## ${W^^} ##########"
    if [ ! -f "$PS/$W.cjs" ]; then
      echo "  $W.cjs fehlt — nicht geprueft."; NICHT=$((NICHT+1)); continue
    fi
    if [ "$W" = "kopfleiste" ]; then
      node "$PS/$W.cjs" "$HTML" "$ARBEIT/kopfleiste.png" "Sichtpruefung" 2>&1 | sed 's/^/  /'
    else
      node "$PS/$W.cjs" "$HTML" 2>&1 | sed 's/^/  /'
    fi
    [ "${PIPESTATUS[0]}" != "0" ] && FEHLER=$((FEHLER+1))
  done
fi

echo
echo "########## ERGEBNIS ##########"
if [ $FEHLER -gt 0 ]; then
  echo "$FEHLER Bereich(e) fehlgeschlagen."
  exit 1
fi
if [ $NICHT -gt 0 ]; then
  echo "Keine Fehler — aber $NICHT Pruefung(en) konnten nicht laufen."
  echo "Ein unvollstaendiger Lauf ist kein bestandener Lauf."
  exit 3
fi
echo "Alles gesehen, keine Fehler."
