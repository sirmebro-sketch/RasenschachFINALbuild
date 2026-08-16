#!/usr/bin/env bash
# ==========================================================================
#  Prüfstand für Rasenschach XI
#  --------------------------------------------------------------------------
#  Ein Aufruf baut die Prüfumgebung auf und misst die Datei komplett durch.
#
#      bash pruefstand/pruefen.sh                 # alles, Quelle /mnt/project
#      bash pruefstand/pruefen.sh /pfad/App.jsx   # andere Quelle
#      TEILE=kalib bash pruefstand/pruefen.sh     # nur Kalibrierung
#      TEILE=ansicht,rueck LAEUFE=8 bash ...      # nur Ansichten, 8 Durchläufe
#
#  Teile: aufbau · kalib · ansicht · rueck · bau      (Vorgabe: alle)
# ==========================================================================
set -u
QUELLE="${1:-/mnt/project/App.jsx}"
PS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BAU=/tmp/ps
QUELLDIR="$(cd "$(dirname "$QUELLE")" && pwd)"
# Arbeitsverzeichnis. IMMER beschreibbar und getrennt von der Quelle: das
# Projektwissen unter /mnt/project ist nur lesbar, dort wuerde npm install
# scheitern. Die Baudateien werden hineinkopiert, die Quelle bleibt unberuehrt.
ARBEIT="${ARBEIT:-/home/claude/rs}"
LAEUFE="${LAEUFE:-6}"
LAUFBAHNEN="${LAUFBAHNEN:-300}"
TEILE="${TEILE:-aufbau,kalib,ansicht,rueck,bau}"
hat() { case ",$TEILE," in *",$1,"*) return 0 ;; *) return 1 ;; esac; }
titel() { echo; echo "########## $1 ##########"; }
FEHLER=0

# --------------------------------------------------------------------------
if hat aufbau; then
titel "AUFBAU"
mkdir -p "$BAU" "$ARBEIT"
[ -f "$QUELLE" ] || { echo "FEHLER: $QUELLE nicht gefunden"; exit 1; }
[ "$(readlink -f "$QUELLE")" = "$(readlink -f "$ARBEIT/App.jsx")" ] || cp "$QUELLE" "$ARBEIT/App.jsx"
echo "Quelle:  $QUELLE"
grep -m2 -n 'const VERSION' "$ARBEIT/App.jsx" | sed 's/^/  /'

# Pakete nur einmal holen. jsdom gehört NICHT in die package.json des Spiels,
# deshalb liegt es in einem eigenen Verzeichnis neben der Arbeitskopie.
if [ ! -d "$BAU/node_modules/react" ]; then
  echo "Pakete werden geholt (einmalig, ~30 s)..."
  ( cd "$BAU" && npm init -y >/dev/null 2>&1
    npm install --no-audit --no-fund --silent react@18 react-dom@18 jsdom 2>&1 | tail -1 )
fi

# Speicherattrappe: im Spiel kommt store aus storage.js (Capacitor Preferences)
cat > "$BAU/stubstore.js" << 'EOF'
export const store = { async get(){return null;}, async set(){return null;}, async delete(){return null;} };
EOF

# EINE Prüfdatei mit allen Ausfuhren — so kann keine Liste auseinanderlaufen.
sed 's#from "./storage.js"#from "./stubstore.js"#' "$ARBEIT/App.jsx" > "$BAU/probe.jsx"

# Baudateien aus dem Quellverzeichnis mitnehmen. Liegen sie dort, laeuft der
# Produktionsbau; fehlen sie, meldet der Bauschritt das ausdruecklich.
GEFUNDEN=0
for D in package.json vite.config.js index.html main.jsx storage.js capacitor.config.json; do
  if [ -f "$QUELLDIR/$D" ]; then cp "$QUELLDIR/$D" "$ARBEIT/$D"; GEFUNDEN=$((GEFUNDEN+1)); fi
done
echo "Baudateien: $GEFUNDEN von 6 gefunden"
[ "$GEFUNDEN" -eq 6 ] || echo "  HINWEIS: unvollstaendig — der Produktionsbau wird uebersprungen"

# Schriften: liegen in einer eigenen Datei neben App.jsx und werden mitkopiert.
SCHRIFTQUELLE="$(dirname "$(readlink -f "$QUELLE")")/schriften.js"
if [ -f "$SCHRIFTQUELLE" ]; then
  cp "$SCHRIFTQUELLE" "$BAU/schriften.js"
  cp "$SCHRIFTQUELLE" "$ARBEIT/schriften.js"
  echo "Schriften: $(du -h "$SCHRIFTQUELLE" | cut -f1)"
else
  echo "FEHLER: schriften.js nicht gefunden neben $QUELLE"; FEHLER=$((FEHLER+1))
fi
# Doppelte Namen in der Ausfuhrliste. Das hat den Aufbau schon zweimal
# abgebrochen, und esbuild meldet es als "was originally exported here" mit
# Zeilennummern aus dem zusammengesetzten Buendel — also weit weg von der
# Datei, in der der Fehler steht. Hier faellt es sofort und mit Namen auf.
DOPPELT=$(sed 's|/\*[^*]*\*/||g' "$PS/exporte.txt" \
  | tr ',{}' '\n\n\n' | sed 's/[^A-Za-z0-9_$]//g' | grep -v '^$' \
  | sort | uniq -d | tr '\n' ' ')
if [ -n "$DOPPELT" ]; then
  echo "FEHLER: exporte.txt nennt diese Namen mehrfach: $DOPPELT"
  echo "        esbuild bricht damit ab. Jeden Namen genau einmal auffuehren."
  FEHLER=$((FEHLER+1))
fi
cat "$PS/exporte.txt" >> "$BAU/probe.jsx"

# ---- Hygiene ---------------------------------------------------------------
# Muster, die in diesem Projekt wiederholt Fehler erzeugt haben. Sie stehen
# in STAND.md Abschnitt 6 als Stolperfallen — hier werden sie nachgerechnet,
# weil eine Regel, an die man sich erinnern muss, keine Regel ist.

# VERWORFEN: eine Pruefung auf doppelt ausgeschriebene Farbwerte. Sie meldete
# 49 Werte, fast alle legitim — Vereinsfarben und die 212 Flaggen nennen
# dieselben Rot- und Blautoene naturgemaess mehrfach. Ein Hinweisgeber, der bei
# jedem Lauf 49 Zeilen ausspuckt, wird nach dem zweiten Mal ueberlesen. Der eine
# echte Fall (.wkarte wiederholt den Grundstil) traegt eine Warnung im Kommentar.

# 2) Ist das Verzeichnis in STAND.md noch aktuell? Es nennt Zeilennummern,
#    und die verschieben sich bei jeder Aenderung. Ein Verzeichnis, das
#    danebenzeigt, ist schlimmer als keins — man glaubt ihm.
#    Diese Pruefung gibt es, weil die Alternative war, es sich zu merken.
if [ -f "$QUELLDIR/STAND.md" ] && [ -f "$PS/verzeichnis.cjs" ]; then
  if ! node "$PS/verzeichnis.cjs" "$QUELLDIR/STAND.md" --pruefen >/dev/null 2>&1; then
    echo "  WARNUNG: das Verzeichnis in STAND.md ist veraltet."
    echo "           node pruefstand/verzeichnis.cjs STAND.md"
    FEHLER=$((FEHLER+1))
  fi
fi

# 3) Feste Zusagen in Protokollzeilen des Pruefskripts. Dreimal in vier
#    Fassungen stand dort ein Text, der weiter gruen redete, waehrend die
#    Pruefung darueber rot meldete. Eine Protokollzeile darf keine Zusage
#    enthalten, die nicht aus einem gemessenen Wert stammt.
# Zeilen mit einem Fragezeichen rechnen den Text aus einem Wert aus — die
# sind in Ordnung. Gesucht sind die ohne.
#
# ACHTUNG, hier stand schon ein toter Filter: `grep -n` stellt jeder Zeile
# eine Nummer mit Doppelpunkt voran, und ein `grep -v ':'` warf daraufhin
# ALLES weg. Die Pruefung konnte nie anschlagen. Gefunden nur, weil die
# Gegenprobe schwieg, als sie haette melden muessen.
LUEGT=$(grep -nE 'console\.log\(.*(nicht absolut|keine in umbrechender|alle mit eigener|danach nachkaufbar|getrennt vom Namen)' \
  "$PS/ansichten.jsx" | grep -v '?' | head -3)
if [ -n "$LUEGT" ]; then
  echo "  WARNUNG: Protokollzeile mit fester Zusage statt gemessenem Wert:"
  echo "$LUEGT" | sed 's/^/    /'
  FEHLER=$((FEHLER+1))
fi

# Rueckwaerts-Anfuehrungszeichen im CSS-Block. Der Block ist eine
# Schablonenzeichenkette (const CSS = SCHRIFTEN + `...`) — ein einzelnes ` in
# einem Kommentar darin beendet sie vorzeitig. esbuild meldet dann irgendetwas
# viele Zeilen weiter unten ("Expected ; but found perspective"), und die
# eigentliche Ursache steht woanders. Deshalb hier vorab und mit Zeilennummer.
python3 - "$QUELLE" <<'PYEOF' || FEHLER=1
import re, sys
quelle = open(sys.argv[1], encoding="utf-8").read()
kopf = "const CSS = SCHRIFTEN + `"
i = quelle.find(kopf)
if i < 0:
    print("HINWEIS: CSS-Block nicht gefunden — Pruefung uebersprungen")
else:
    a = i + len(kopf)
    b = quelle.index("`;", a)
    treffer = [m.start() for m in re.finditer("`", quelle[a:b])]
    if treffer:
        print("FEHLER: %d Rueckwaerts-Anfuehrungszeichen im CSS-Block." % len(treffer))
        for t in treffer:
            zeile = quelle.count("\n", 0, a + t) + 1
            umfeld = quelle[a + t - 60:a + t + 30].replace("\n", " ")
            print("  Zeile %d: …%s…" % (zeile, umfeld))
        print("  Die Schablonenzeichenkette endet dort vorzeitig. In Kommentaren")
        print("  innerhalb des CSS-Blocks keine Rueckwaerts-Anfuehrungszeichen setzen.")
        sys.exit(1)
PYEOF

cp "$PS/ansichten.jsx" "$PS/rueckwaerts.jsx" "$PS/jsdom.cjs" "$BAU/"
E="npx --yes esbuild@0.23.0"
$E "$BAU/probe.jsx"      --bundle --outfile="$BAU/motor.js"  --platform=node --format=cjs --log-level=error || FEHLER=1
$E "$BAU/ansichten.jsx"  --bundle --outfile="$BAU/a.js"      --platform=node --format=cjs --log-level=error || FEHLER=1
$E "$BAU/rueckwaerts.jsx" --bundle --outfile="$BAU/r.js"     --platform=node --format=cjs --log-level=error || FEHLER=1
# Scheitert der Aufbau, liegen die Buendel des VORIGEN Laufs noch da. Ohne
# diesen Abbruch pruefen die naechsten Schritte froehlich den alten Stand und
# melden „alle Pruefungen bestanden" — grueneste Wiese ueber kaputtem Code.
if [ "$FEHLER" != 0 ]; then
  echo
  echo "ABBRUCH: der Aufbau ist gescheitert. Die folgenden Schritte wuerden ein"
  echo "         Buendel aus einem frueheren Lauf pruefen und ein falsches"
  echo "         Ergebnis melden. Erst den Uebersetzungsfehler oben beheben."
  exit 1
fi
echo "Prüfstand steht: $BAU"
fi

# --------------------------------------------------------------------------
if hat kalib; then
titel "KALIBRIERUNG ($LAUFBAHNEN Laufbahnen)"
( cd "$BAU" && timeout 290 node "$PS/kalibrierung.cjs" "$LAUFBAHNEN" ) || FEHLER=1
fi

# --------------------------------------------------------------------------
if hat ansicht; then
titel "ANSICHTEN UND DURCHKLICKTEST"
( cd "$BAU" && timeout 280 node "$BAU/jsdom.cjs" "$BAU/a.js" ) || FEHLER=1
fi

# --------------------------------------------------------------------------
if hat rueck; then
titel "RÜCKWÄRTSPRÜFUNG ($LAEUFE Durchläufe)"
# Mehrfach fahren: manche Fehler treten nur in bestimmten Spielzuständen auf.
for i in $(seq 1 "$LAEUFE"); do
  ( cd "$BAU" && timeout 200 node "$BAU/jsdom.cjs" "$BAU/r.js" "$i" ) | grep -E "Ansichten|✗" || FEHLER=1
done
fi

# --------------------------------------------------------------------------
if hat bau; then
titel "PRODUKTIONSBAU"
# Braucht den vollständigen Dateisatz. package.json wird danach zurückgesetzt,
# damit npm keine Prüfpakete hineinschreibt.
if [ -f "$ARBEIT/package.json" ] && [ -f "$ARBEIT/main.jsx" ]; then
  cp "$ARBEIT/package.json" /tmp/package.json.orig
  ( cd "$ARBEIT" && timeout 280 npm install --no-audit --no-fund --silent 2>&1 | tail -1
    timeout 200 npx vite build 2>&1 | grep -E "built in|index-.*js|error" | head -4 ) || FEHLER=1
  cp /tmp/package.json.orig "$ARBEIT/package.json"
  rm -rf "$ARBEIT/node_modules" "$ARBEIT/dist" "$ARBEIT/package-lock.json"
  if diff -q /tmp/package.json.orig "$ARBEIT/package.json" >/dev/null; then
    echo "package.json unverändert ✓"
  else
    echo "ACHTUNG: package.json weicht ab"; FEHLER=1
  fi
else
  echo "ÜBERSPRUNGEN — package.json oder main.jsx fehlt. Ohne sie ist der echte"
  echo "Bau ungeprüft. Beide gehören neben App.jsx ins Projektwissen."
  FEHLER=$((FEHLER+0))
fi
fi

titel "ERGEBNIS"
[ "$FEHLER" = 0 ] && echo "Alles durchgelaufen, keine Fehler." || echo "MINDESTENS EIN TEIL IST FEHLGESCHLAGEN."
exit "$FEHLER"
