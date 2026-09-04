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
#  Teile: aufbau · kalib · ansicht · ereignis · stimmig · namen · verein · rueck · bau
#         (Vorgabe: alle neun. Diese Zeile wird gegen die Vorgabe unten
#          nachgerechnet — Pruefung 7. Bis 35.44 nannte sie sieben.)
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
TEILE="${TEILE:-aufbau,kalib,ansicht,ereignis,stimmig,namen,verein,rueck,bau}"
#  ist ABSICHTLICH nicht in der Vorgabe: sie haengt am Netz und
# schwankt zwischen 0 und 160 Sekunden. Vor einer Auslieferung:
#   TEILE=sicher bash pruefstand/pruefen.sh App.jsx
hat() { case ",$TEILE," in *",$1,"*) return 0 ;; *) return 1 ;; esac; }
titel() { echo; echo "########## $1 ##########"; }
FEHLER=0
# Papierbefunde (Pruefungen 7-9): faerben das Ergebnis rot, loesen aber den
# Bauabbruch nicht aus. Siehe Begruendung dort.
DOK=0
# Sicherheitsfunde im Auslieferungspfad (nicht abgenickte). Eigener Zaehler,
# damit im Ergebnis steht, WORAN ein Lauf gescheitert ist.
SICHER=0

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

# ---- Wache: ARBEIT darf nicht das Bauverzeichnis sein ----------------------
# Am 24.8.2026 einmal ARBEIT=/tmp/ps gesetzt. Dadurch landete die package.json
# des Spiels — mit "type":"module" — neben /tmp/ps/motor.js. Von da an war das
# Buendel fuer node ESM, `module.exports` wirkungslos, und JEDES Werkzeug, das
# den Motor laedt, warf einen Fehler tief in einer erzeugten Datei. Das sieht
# nach kaputtem Werkzeug aus und ist ein Pfadfehler. Eine Zeile spart die
# halbe Stunde Suche.
if [ "$(cd "$ARBEIT" 2>/dev/null && pwd -P)" = "$(cd "$BAU" 2>/dev/null && pwd -P)" ]; then
  echo "ABBRUCH: ARBEIT und BAU zeigen beide auf $BAU."
  echo "         Dann wird die package.json des Spiels neben motor.js gelegt;"
  echo "         mit \"type\":\"module\" ist das Buendel danach nicht mehr ladbar."
  echo "         ARBEIT weglassen oder auf ein anderes Verzeichnis setzen."
  exit 2
fi

# Baudateien aus dem Quellverzeichnis mitnehmen. Liegen sie dort, laeuft der
# Produktionsbau; fehlen sie, meldet der Bauschritt das ausdruecklich.
# package-lock.json seit 35.46 dabei: ohne sie faellt der Bau auf `npm install`
# zurueck und loest die Bibliotheken neu auf — dann prueft der Pruefstand
# etwas anderes, als die APK spaeter enthaelt. Das ist der Grund, warum sie
# hier mitzaehlt und nicht nur mitkopiert wird.
BAUDATEIEN="package.json package-lock.json vite.config.js index.html main.jsx storage.js capacitor.config.json"
BAUSOLL=$(echo $BAUDATEIEN | wc -w)
GEFUNDEN=0
for D in $BAUDATEIEN; do
  if [ -f "$QUELLDIR/$D" ]; then
    cp "$QUELLDIR/$D" "$ARBEIT/$D"; GEFUNDEN=$((GEFUNDEN+1))
  else
    # Fehlt sie in der Quelle, MUSS sie auch hier weg. Sonst liegt die Datei
    # aus einem frueheren Lauf noch da und wird stillschweigend mitgebaut —
    # gefunden 35.46, als eine geloeschte package-lock.json im Arbeitsbaum
    # ueberlebte und der Bau weiter "npm ci" meldete, obwohl die Quelle
    # keine Sperrdatei mehr hatte.
    rm -f "$ARBEIT/$D"
  fi
done
echo "Baudateien: $GEFUNDEN von $BAUSOLL gefunden"
[ "$GEFUNDEN" -eq "$BAUSOLL" ] || echo "  HINWEIS: unvollstaendig — der Produktionsbau wird uebersprungen"

# Schriften: liegen in einer eigenen Datei neben App.jsx und werden mitkopiert.
SCHRIFTQUELLE="$(dirname "$(readlink -f "$QUELLE")")/schriften.js"
if [ -f "$SCHRIFTQUELLE" ]; then
  cp "$SCHRIFTQUELLE" "$BAU/schriften.js"
  cp "$SCHRIFTQUELLE" "$ARBEIT/schriften.js"
  echo "Schriften: $(du -h "$SCHRIFTQUELLE" | cut -f1)"
else
  echo "FEHLER: schriften.js nicht gefunden neben $QUELLE"; FEHLER=$((FEHLER+1))
fi
# Die eigenen Beidateien der App muessen in BEIDE Bauverzeichnisse — nach $BAU
# fuer das Pruefbuendel, nach $ARBEIT fuer den Produktionsbau. Fehlt eine,
# meldet esbuild nur "Could not resolve" und man sucht in App.jsx.
#
# Bis 35.47 standen verein.js, namen.js und ereignisse.js hier einzeln
# aufgezaehlt, jede mit ihrem eigenen Block. Als in 35.48 akademie.js
# dazukam, waere sie zum vierten Mal von Hand nachzutragen gewesen — dieselbe
# Bauart, die namen.js fuenf Fassungen lang aus der Dateiliste in STAND.md
# herausgehalten hat. Die Liste kommt jetzt aus den `import`-Zeilen der App
# selbst, so wie browsertest.sh es seit jeher macht. Wer eine Beidatei
# ergaenzt, muss hier nichts mehr tun.
BEIDATEIEN=$(grep -oE 'from "\./[a-zA-Z0-9_]+\.js"' "$QUELLE" \
             | sed 's|from "\./||; s|"$||' | grep -v '^storage\.js$' | sort -u)
for D in $BEIDATEIEN; do
  Q="$(dirname "$(readlink -f "$QUELLE")")/$D"
  if [ -f "$Q" ]; then
    cp "$Q" "$BAU/$D"; cp "$Q" "$ARBEIT/$D"
  else
    echo "FEHLER: $D nicht gefunden neben $QUELLE"; FEHLER=$((FEHLER+1))
  fi
done
echo "Beidateien: $(echo $BEIDATEIEN | wc -w) ($(echo $BEIDATEIEN | tr '\n' ' '))"
# Koennen die eingebetteten Schriften die Zeichen, die in den Namen stehen?
# Seit 35.57 stehen dort Umlaute und Diakritika (Öztürk, Wójcik, Dvořák). Eine
# Schrift, der ein Zeichen fehlt, zeigt ein Kaestchen — und das faellt in
# jsdom NICHT auf, weil dort gar nichts gezeichnet wird. Deshalb hier, gegen
# die Zeichentabelle der Schriftdatei selbst.
SCHRIFTQUELLE="$(dirname "$(readlink -f "$QUELLE")")/schriften.js"
if [ -f "$SCHRIFTQUELLE" ] && [ -f "$PS/schriftabdeckung.cjs" ]; then
  if ! node "$PS/schriftabdeckung.cjs" "$SCHRIFTQUELLE" > /tmp/schrift.log 2>&1; then
    echo "  WARNUNG: Zeichen fehlen in den eingebetteten Schriften:"
    grep -E "✗|!" /tmp/schrift.log | head -6 | sed 's/^/  /'
    DOK=$((DOK+1))
  else
    echo "Schriftzeichen: $(grep -c '✓' /tmp/schrift.log) Proben ohne Befund"
  fi
fi
EREIGNISQUELLE="$(dirname "$(readlink -f "$QUELLE")")/ereignisse.js"
if [ -f "$EREIGNISQUELLE" ]; then
  echo "Ereignisse: $(grep -c 'id:"' "$EREIGNISQUELLE") Einträge"
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

# Rueckwaerts-Anfuehrungszeichen im CSS-Schablonentext. DRITTER Fall derselben
# Art (35.58, 35.64, 35.83): ein Backtick in einem Kommentar beendet den
# Schablonentext mitten im Satz, und esbuild meldet einen Folgefehler, der nach
# etwas ganz anderem aussieht ("Expected ; but found prefers").
#
# HIER, VOR DEM BAU. Mein erster Anlauf legte die Pruefung in die
# Vereinspruefung — die laeuft NACH dem Aufbau, und der bricht in genau diesem
# Fall ab. Eine Pruefung, die erst nach dem Zusammenbruch laeuft, prueft nichts.
CSSZEILE=$(grep -n 'const CSS = `' "$QUELLE" | head -1 | cut -d: -f1)
if [ -n "$CSSZEILE" ]; then
  # Vom Beginn des Blocks bis zur ersten Zeile, die nur aus einem Backtick und
  # einem Semikolon besteht — das ist das gewollte Ende.
  ENDE=$(awk -v s="$CSSZEILE" 'NR>s && /^`;/{print NR; exit}' "$QUELLE")
  if [ -z "$ENDE" ]; then
    echo "FEHLER: der CSS-Block hat kein sauberes Ende (\`; in eigener Zeile)."
    FEHLER=$((FEHLER+1))
  else
    STREU=$(awk -v s="$CSSZEILE" -v e="$ENDE" 'NR>s && NR<e' "$QUELLE" | grep -c '`')
    if [ "$STREU" != "0" ]; then
      echo "FEHLER: $STREU Rückwärts-Anführungszeichen INNERHALB des CSS-Blocks."
      awk -v s="$CSSZEILE" -v e="$ENDE" 'NR>s && NR<e && /`/{print "        Zeile "NR": "substr($0,1,72)}' "$QUELLE"
      echo "        Sie beenden den Schablonentext mitten im Satz. esbuild meldet"
      echo "        danach einen Folgefehler, der nach etwas anderem aussieht."
      FEHLER=$((FEHLER+1))
    fi
  fi
fi

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
  if ! node "$PS/verzeichnis.cjs" --quelle="$QUELLDIR/STAND.md" --pruefen >/dev/null 2>&1; then
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

# 4) Traegt die Fassung aus App.jsx einen Messblock in STAND.md? Kevin arbeitet
#    mit Zahlen vor und nach, aber 35.2 und 35.3 gingen beide OHNE raus — zwei
#    Fassungen hintereinander, gemerkt hat es niemand. Nach der Regel aus 35.1
#    gehoert das damit hierher und nicht in einen Merksatz.
#    Die Fassung wird laut Abschnitt 8 am ENDE angehoben, zusammen mit dem neuen
#    Abschnitt. Waehrend der Sitzung zeigt App.jsx also die fertige Vorfassung,
#    und diese Pruefung schweigt. Rot wird sie nur in dem Fenster zwischen
#    "Nummer angehoben" und "Abschnitt geschrieben" — genau da soll sie stoeren.
#    Sie prueft, DASS der Block da ist, nicht ob die Zahlen stimmen. Das kann
#    kein Skript; dafuer gibt es die Gegenueberstellung vorher/nachher.
if [ -f "$QUELLDIR/STAND.md" ]; then
  FASSUNG=$(sed -n 's/^const VERSION = "\([^"]*\)".*/\1/p' "$ARBEIT/App.jsx" | head -1)
  if [ -z "$FASSUNG" ]; then
    echo "  WARNUNG: keine Fassungsnummer in App.jsx gefunden (const VERSION)."
    FEHLER=$((FEHLER+1))
  else
    # Der Punkt in der Nummer ist im Suchmuster ein Platzhalter fuer jedes
    # Zeichen — ohne Maskierung faende "35.3" auch "3543".
    FRX=$(printf '%s' "$FASSUNG" | sed 's/\./\\./g')
    # Eine Ueberschrift kann ZWEI Fassungen tragen ("## 34.36 / 34.37 · ...").
    # Deshalb nicht auf den Zeilenanfang prüfen, sondern die Nummer im Kopf der
    # Ueberschrift suchen — abgegrenzt, damit 35.3 nicht in 35.31 anschlaegt.
    ABSCHNITT=$(awk -v rx="(^|[^0-9.])$FRX([^0-9.]|$)" '
      /^## / {
        if (drin) exit
        kopf = $0; sub(/·.*/, "", kopf)
        if (kopf ~ rx) drin = 1
        next
      }
      drin { print }' "$QUELLDIR/STAND.md")
    if [ -z "$ABSCHNITT" ]; then
      echo "  WARNUNG: STAND.md hat keinen Abschnitt '## $FASSUNG'."
      echo "           Die Fassung ist angehoben, der Eintrag fehlt noch."
      FEHLER=$((FEHLER+1))
    elif ! printf '%s\n' "$ABSCHNITT" | grep -q '^### Geprüft'; then
      echo "  WARNUNG: Abschnitt '## $FASSUNG' in STAND.md hat keinen Messblock."
      echo "           Ans Ende des Abschnitts gehoert '### Geprüft' mit den"
      echo "           Zahlen dieses Laufs (Pruefungen, Fehler, Buendelgroesse)."
      FEHLER=$((FEHLER+1))
    fi

    # 5) Nennt der KOPF von STAND.md dieselbe Fassung? Bis 35.22 stand dort
    #    stattdessen ein Merksatz, der zum Gegenpruefen eine Zeilennummer in
    #    App.jsx nannte ("Zeile 10") — die durch zwei neue Importe laengst um
    #    zwei verrutscht war und ins Leere zeigte. Eine Anweisung, die mit
    #    jeder Aenderung veraltet, gehoert nach der Regel aus 35.3 hierher
    #    und nicht in einen Merksatz. Prueft 4 und 5 zusammen: Abschnitt da,
    #    Messblock da, Kopf aktuell.
    KOPFFASSUNG=$(sed -n 's/^\*\*Fassung \([0-9][0-9.]*\)\*\*.*/\1/p' "$QUELLDIR/STAND.md" | head -1)
    if [ -z "$KOPFFASSUNG" ]; then
      echo "  WARNUNG: STAND.md hat keine Kopfzeile '**Fassung <Nr>** · Stand <Datum>'."
      FEHLER=$((FEHLER+1))
    elif [ "$KOPFFASSUNG" != "$FASSUNG" ]; then
      echo "  WARNUNG: Fassung laeuft auseinander — App.jsx $FASSUNG, STAND.md-Kopf $KOPFFASSUNG."
      echo "           Eine der beiden Dateien ist veraltet. Das gehoert geklaert,"
      echo "           BEVOR irgendetwas geaendert wird."
      FEHLER=$((FEHLER+1))
    fi
  fi
fi

# 6) Nennt LIESMICH.md noch jede Datei, die es gibt? Die Liste dort ist die
#    Bauanleitung fuer das Projektwissen — wer danach neu aufbaut, bekommt
#    genau die Dateien, die dort stehen, und keine andere.
#    Am 23.8.2026 fehlten SECHS. Zwei davon waren ereignisse.js und verein.js:
#    ohne sie meldet esbuild "Could not resolve", und man sucht in App.jsx.
#    Die anderen vier kamen aus 35.28/35.29 (knoepfe.sh, knopfbogen.jsx,
#    knopfmessung.cjs, werkstatt.js) — ohne werkstatt.js bricht browsertest.sh
#    wegen `set -eu` ab, und sicht.sh laeuft gar nicht erst an.
#    Gemerkt hat das niemand, weil die Liste nur von Hand gepflegt wurde. Nach
#    der Regel aus 35.2 gehoert sie damit hierher: eine Anweisung, die man
#    befolgen MUSS, aber nicht befolgen KANN, ohne daran zu denken, ist keine.
#
#    Geprueft werden die beiden Mengen, die wirklich wachsen: die Werkzeuge im
#    Pruefstandverzeichnis und die eigenen Importe der App. Die Importe werden
#    aus App.jsx ausgelesen, nicht aufgezaehlt — kommt ein sechster dazu, faellt
#    er hier von selbst auf. Die sechs Baudateien zaehlt der Aufbau oben schon ab.
if [ -f "$QUELLDIR/LIESMICH.md" ]; then
  UNGENANNT=""
  for W in "$PS"/*; do
    [ -f "$W" ] || continue
    N="$(basename "$W")"
    grep -qF -- "$N" "$QUELLDIR/LIESMICH.md" || UNGENANNT="$UNGENANNT $N"
  done
  for N in $(sed -n 's|^import .*from "\./\([^"]*\)".*|\1|p' "$ARBEIT/App.jsx"); do
    grep -qF -- "$N" "$QUELLDIR/LIESMICH.md" || UNGENANNT="$UNGENANNT $N"
  done
  if [ -n "$UNGENANNT" ]; then
    echo "  WARNUNG: LIESMICH.md nennt diese Dateien nicht:$UNGENANNT"
    echo "           Wer das Projektwissen nach dieser Liste neu aufbaut, baut es"
    echo "           unvollstaendig auf. Nachtragen, wo sie hingehoert."
    FEHLER=$((FEHLER+1))
  fi
else
  echo "  WARNUNG: LIESMICH.md liegt nicht neben App.jsx — Liste NICHT geprueft."
  echo "           Das ist kein bestandener Lauf, nur ein fehlender."
  FEHLER=$((FEHLER+1))
fi

# 7-10) Vier Angaben im Text, die von Hand gepflegt wurden (7-9 gefunden 35.45,
#      10 nachgezogen in 35.46).
#      Alle drei nach demselben Muster: eine Aufzaehlung im Text, die von Hand
#      gepflegt wurde, waehrend die Sache daneben weiterwuchs.
#
#      7) Die Teile-Liste stand an drei Stellen und war an allen drei falsch —
#         fuenf bzw. sieben statt neun. Das ist die gefaehrlichste der drei:
#         wer `TEILE=aufbau,kalib,ansicht,rueck,bau` setzt im Glauben, das sei
#         alles, ueberspringt Ereignisse, Stimmigkeit, Namen und Verein. Der
#         Lauf endet gruen und hat vier von neun Teilen nicht angefasst.
#      8) Die Ereigniszahl stand seit 35.37 auf 518, gemessen 520 — sieben
#         Fassungen lang, darunter an der Stelle in Abschnitt 8, die als
#         Abnahmekriterium fuer den Sitzungsstart formuliert ist.
#      9) namen.js fehlte in BEIDEN Dateitabellen von Abschnitt 1, seit 35.43.
#         Abschnitt 1 ist ausdruecklich die Liste dessen, was hochzuladen ist.
#         Wer danach neu aufbaut, bekommt ein Spiel, das nicht baut. Genau
#         dieser Fehler wurde in 35.24 und 35.30 schon zweimal behoben, beide
#         Male in einer ANDEREN Liste. Prueft die Werkzeugtabelle aus
#         Abschnitt 5 gleich mit — sie ist das Gegenstueck zu Pruefung 6.
#
#      EIGENER ZAEHLER, KEIN FEHLER: diese drei zaehlen auf DOK statt auf
#      FEHLER. Grund ist der Abbruch nach dem Uebersetzen — der greift bei
#      FEHLER != 0 und meldet "Erst den Uebersetzungsfehler oben beheben".
#      Fuer eine veraltete Zahl in STAND.md stimmt dieser Satz nicht.
#      In 35.45 standen sie zuerst HINTER dem Abbruch, damit sie ihn nicht
#      ausloesen. Das war falsch und ist in der Gegenprobe aufgefallen: schlaegt
#      eine der Pruefungen 2 bis 6 an — etwa das verschobene Verzeichnis, was
#      beim Bearbeiten von STAND.md IMMER passiert —, dann bricht der Lauf ab,
#      bevor 7 bis 9 an die Reihe kommen. Ausgerechnet waehrend der Arbeit an
#      der Dokumentation waren die Dokumentationspruefungen unerreichbar.
#      Jetzt stehen sie vor dem Uebersetzen und faerben ueber DOK am Ende rot,
#      ohne den Lauf zu killen. Dass 2 bis 6 dasselbe Problem haben, bleibt
#      offener Punkt 20 — das aendert ihr Verhalten und gehoert nicht hierher.
if [ -f "$QUELLDIR/STAND.md" ] && [ -f "$QUELLDIR/LIESMICH.md" ]; then
  python3 - "$QUELLDIR/STAND.md" "$QUELLDIR/LIESMICH.md" "$EREIGNISQUELLE" \
           "$PS" "$QUELLDIR" "${BASH_SOURCE[0]}" <<'PYEOF' || DOK=$((DOK+1))
import os, re, sys
stand, liesmich, ereignisdatei, ps, quelldir, selbst = sys.argv[1:7]
S  = open(stand,    encoding="utf-8").read()
L  = open(liesmich, encoding="utf-8").read()
SH = open(selbst,   encoding="utf-8").read()
fehler = 0

# Lebender Text = alles VOR der Fassungsgeschichte. Darunter stehen Abschnitte,
# die ihre eigene Fassung beschreiben; dort DARF 518 stehen, das war damals so.
schnitt = S.find("\n## Fassungen 33.3")
lebend  = S[:schnitt] if schnitt > 0 else S

def zeilen(text, zahl):
    # Beide Schreibweisen: "518 Ereignisse" und "Ereignisse: 518 Eintraege".
    # Nur die erste zu suchen hat Zeile 554 uebersehen — ausgerechnet die, die
    # als Abnahmekriterium fuer den Sitzungsstart formuliert ist.
    nadeln = (zahl + " Ereignisse", "Ereignisse: " + zahl)
    return [i + 1 for i, z in enumerate(text.splitlines())
            if any(n in z for n in nadeln)]

# --- 7) Teile ---------------------------------------------------------------
m = re.search(r'TEILE="\$\{TEILE:-([a-z,]+)\}"', SH)
if not m:
    print("  WARNUNG: Vorgabe fuer TEILE in pruefen.sh nicht gefunden.")
    fehler += 1
else:
    echt = [t for t in m.group(1).split(",") if t]
    # Jede Stelle, die die Teile aufzaehlt, traegt die Marke `Teile:` am
    # Zeilenanfang. Eine Aufzaehlung darf umbrechen: Folgezeilen zaehlen mit,
    # solange sie NUR aus Namen, Rueckwaerts-Anfuehrungszeichen, Punkten und
    # Leerzeichen bestehen. Ohne diese Regel hat die Pruefung beim ersten
    # eigenen Umbruch in Abschnitt 5 drei Teile als fehlend gemeldet, die
    # eine Zeile tiefer standen — eine Pruefung, die am Zeilenumbruch
    # zerbricht, erzeugt genau die Falschmeldungen, gegen die sie da ist.
    def sammle(text, marke):
        zeilen_ = text.splitlines()
        raus = []
        for i, z in enumerate(zeilen_):
            if not z.startswith(marke):
                continue
            stueck = z.split("Teile:", 1)[1]
            for w in zeilen_[i + 1:]:
                k = w.strip().lstrip("# ").strip()
                if k and re.fullmatch(r"[`\w·\- ]+", k) and "·" in k:
                    stueck += " " + k
                else:
                    break
            raus.append(stueck)
        return raus

    stellen  = [("pruefen.sh", t) for t in sammle(SH,     "#  Teile:")]
    stellen += [("STAND.md",   t) for t in sammle(lebend, "Teile:")]
    if not stellen:
        print("  WARNUNG: keine Zeile 'Teile:' gefunden — die Aufzaehlung ist weg.")
        fehler += 1
    # 'bau' hat drei Buchstaben, deshalb {3,} — und darum die Stoppliste.
    stopp = {"vorgabe", "alle", "neun", "und", "der", "die", "das", "siehe"}
    for wo, stueck in stellen:
        genannt = [g for g in re.findall(r"[a-z]{3,}", stueck) if g not in stopp]
        if sorted(genannt) != sorted(echt):
            fehlend = [t for t in echt if t not in genannt]
            zuviel  = [g for g in genannt if g not in echt]
            print("  WARNUNG: Teile-Liste in %s stimmt nicht mit der Vorgabe ueberein." % wo)
            print("           Vorgabe: %s" % ", ".join(echt))
            if fehlend: print("           fehlt:   %s" % ", ".join(fehlend))
            if zuviel:  print("           zuviel:  %s" % ", ".join(zuviel))
            print("           Ein zu kurz dokumentierter Lauf ueberspringt Teile")
            print("           und endet trotzdem gruen.")
            fehler += 1

# --- 8) Ereigniszahl --------------------------------------------------------
# Zahlen unter 100 sind keine Angabe ueber den Bestand, sondern Fliesstext
# ("2-3 Ereignisse je Saison"). Ohne diese Schranke meldete die Pruefung die
# Zeile aus Abschnitt 3 als Abweichung — ein Falschalarm bei jedem Lauf, und
# der ist nach zwei Wochen unsichtbar.
echt_e = open(ereignisdatei, encoding="utf-8").read().count('id:"')
for wo, text in (("STAND.md", lebend), ("LIESMICH.md", L)):
    treffer = set()
    for zahl in re.findall(r"(\d[\d.]*)\s+Ereignisse\b", text) + \
                re.findall(r"Ereignisse:\s*(\d[\d.]*)\s+Eintr", text):
        n = int(zahl.replace(".", ""))
        if n >= 100 and n != echt_e:
            treffer.add((zahl, n))
    for zahl, n in sorted(treffer):
        print("  WARNUNG: %s nennt %s Ereignisse, gemessen sind %d." % (wo, zahl, echt_e))
        print("           Zeile(n): %s" % ", ".join(str(z) for z in zeilen(text, zahl)))
        print("           Gezaehlt wird in ereignisse.js, nicht abgeschrieben.")
        fehler += 1

# --- 9) Dateilisten ---------------------------------------------------------
# Abschnitt 1 ist die Liste dessen, was ins Projektwissen hochzuladen ist.
# Geprueft werden die eigenen Importe der App — kommt ein sechster dazu,
# faellt er hier von selbst auf, genau wie bei Pruefung 6.
app     = open(os.path.join(quelldir, "App.jsx"), encoding="utf-8").read()
importe = re.findall(r'^import .* from "\./([^"]+)"', app, re.M)
a1 = lebend[lebend.find("## 1. Was das Projekt ist"):lebend.find("## 2. Zusammenarbeit")]
fehlt1 = [d for d in importe if d not in a1]
if fehlt1:
    print("  WARNUNG: Abschnitt 1 von STAND.md nennt diese Importe nicht: %s" % " ".join(fehlt1))
    print("           Das ist die Liste dessen, was hochzuladen ist. Wer danach")
    print("           neu aufbaut, bekommt ein Spiel, das sich nicht bauen laesst.")
    fehler += 1

a5 = lebend[lebend.find("## 5. Prüfstand"):lebend.find("## 6. Stolperfallen")]
fehlt5 = sorted(w for w in os.listdir(ps)
                if os.path.isfile(os.path.join(ps, w)) and w not in a5)
if fehlt5:
    print("  WARNUNG: Werkzeugtabelle in Abschnitt 5 nennt diese Dateien nicht: %s"
          % " ".join(fehlt5))
    print("           Ein Werkzeug, das dort fehlt, benutzt niemand mehr.")
    fehler += 1

# --- 10) Baudateienzahl ------------------------------------------------------
# Dieselbe Falle wie bei den Ereignissen, nur eine Zahl weiter: "Baudateien:
# 6 von 6" stand in STAND.md und LIESMICH.md als Abnahmekriterium. Mit der
# Sperrdatei sind es seit 35.46 sieben. Diese Zahl waere ohne Pruefung genau
# so gealtert wie die 518 — deshalb wird sie hier aus der Liste in pruefen.sh
# gelesen und im Text nachgerechnet, statt sie zweimal von Hand zu pflegen.
m = re.search(r'^BAUDATEIEN="([^"]+)"', SH, re.M)
if not m:
    print("  WARNUNG: Liste BAUDATEIEN in pruefen.sh nicht gefunden.")
    fehler += 1
else:
    echt_b = len(m.group(1).split())
    for wo, text in (("STAND.md", lebend), ("LIESMICH.md", L)):
        for a, b in set(re.findall(r"Baudateien:\s*(\d+)\s+von\s+(\d+)", text)):
            if int(b) != echt_b or int(a) != echt_b:
                print("  WARNUNG: %s nennt 'Baudateien: %s von %s', tatsaechlich sind es %d."
                      % (wo, a, b, echt_b))
                print("           Die Liste steht in pruefen.sh (BAUDATEIEN=).")
                fehler += 1

if fehler == 0:
    print("Listen in STAND.md: Teile, Ereignis- und Baudateienzahl, beide Dateitabellen stimmen ✓")
sys.exit(1 if fehler else 0)
PYEOF
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
# Groessen und Zeilen der eigenen Dateien. Sie standen bis 35.44 in Abschnitt 1
# von STAND.md und waren dort dreimal hintereinander veraltet (783 KB gegen
# 810 KB, 13.198 gegen 13.674 Zeilen). Eine Zahl, die bei jedem Lauf gemessen
# wird, gehoert nicht abgeschrieben — sie steht jetzt hier und nirgends sonst.
echo
echo "Eigene Dateien (gemessen, $(date +%-d.%-m.%Y)):"
for D in App.jsx $(sed -n 's|^import .*from "\./\([^"]*\)".*|\1|p' "$ARBEIT/App.jsx"); do
  if [ -f "$QUELLDIR/$D" ]; then
    printf "  %-16s %6s KB  %6s Zeilen\n" "$D" \
      "$(( $(stat -c %s "$QUELLDIR/$D") / 1024 ))" "$(wc -l < "$QUELLDIR/$D")"
  fi
done
echo
echo "Prüfstand steht: $BAU"
fi

# --------------------------------------------------------------------------
if hat kalib; then
titel "KALIBRIERUNG ($LAUFBAHNEN Laufbahnen)"
( cd "$BAU" && timeout 290 node "$PS/kalibrierung.cjs" --anzahl="$LAUFBAHNEN" ) || FEHLER=1
fi

# --------------------------------------------------------------------------
if hat ansicht; then
titel "ANSICHTEN UND DURCHKLICKTEST"
( cd "$BAU" && timeout 280 node "$BAU/jsdom.cjs" "$BAU/a.js" ) || FEHLER=1
fi

# --------------------------------------------------------------------------
if hat ereignis; then
titel "EREIGNISSE"
# Braucht das gebaute Buendel aus dem Aufbau. Laeuft NICHT von Hand, sondern
# hier — zehn von achtzehn Werkzeugen liefen bis 35.1 nur von Hand und wurden
# deshalb vergessen (siehe sicht.sh).
if [ -f "$BAU/motor.js" ]; then
  ( cd "$BAU" && node "$PS/ereignispruefung.cjs" --quelle="$ARBEIT/App.jsx" ) || FEHLER=1
else
  echo "ÜBERSPRUNGEN — kein Bündel. Ohne TEILE=aufbau ist das kein Ergebnis."
  FEHLER=1
fi
fi

# --------------------------------------------------------------------------
# Stimmigkeit (35.37): wirkt jede Wahl, ist jede erreichbar, passt das
# Ereignis zum Moment. Braucht den Pfad zur Quelle — ohne ihn kann es die
# Verdrahtung der Zweitpruefung nicht nachsehen und meldet das ausdruecklich.
# --------------------------------------------------------------------------
if hat stimmig; then
echo
if [ -f "$BAU/motor.js" ]; then
  ( cd "$BAU" && node "$PS/stimmigkeit.cjs" --quelle="$ARBEIT/App.jsx" ) || FEHLER=1
else
  echo "########## STIMMIGKEIT ##########"
  echo "ÜBERSPRUNGEN — kein Bündel. Ohne TEILE=aufbau ist das kein Ergebnis."
  FEHLER=1
fi
fi

# --------------------------------------------------------------------------
# Namenskartei (35.43): Abdeckung, Herkunftsmarken, brauchbare Namen.
# Waechst Land fuer Land — ein fehlendes Land ist kein Fehler, ein kaputter
# Name schon.
# --------------------------------------------------------------------------
if hat namen; then
echo
if [ -f "$BAU/motor.js" ]; then
  ( cd "$BAU" && node "$PS/namenpruefung.cjs" --quelle="$ARBEIT/App.jsx" ) || FEHLER=1
else
  echo "########## NAMENSKARTEI ##########"
  echo "ÜBERSPRUNGEN — kein Bündel."
  FEHLER=1
fi
fi

# --------------------------------------------------------------------------
if hat verein; then
titel "VEREIN"
if [ -f "$BAU/motor.js" ]; then
  ( cd "$BAU" && node "$PS/vereinpruefung.cjs" --quelle="$QUELLE" ) || FEHLER=1
else
  echo "ÜBERSPRUNGEN — kein Bündel. Ohne TEILE=aufbau ist das kein Ergebnis."
  FEHLER=1
fi
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
  # Ohne Sperrdatei kann `npm ci` nicht arbeiten. Dann faellt der Bau auf
  # `npm install` zurueck UND sagt das — still zurueckfallen waere genau die
  # Sorte Fehler, gegen die 35.41 die Ersatzwerte abgeschafft hat.
  if [ -f "$ARBEIT/package-lock.json" ]; then
    cp "$ARBEIT/package-lock.json" /tmp/package-lock.json.orig
    INSTALL="npm ci"
  else
    echo "  HINWEIS: keine package-lock.json — der Bau loest die Bibliotheken neu"
    echo "           auf und ist nicht wiederholbar. Siehe 35.46."
    INSTALL="npm install"
  fi
  # ACHTUNG, hier stand ein toter Wächter: `( … | tail -1 … | head -4 ) || FEHLER=1`
  # gibt den Rueckgabewert des LETZTEN Glieds der Pipeline zurueck, also den
  # von `head` — und der gelingt immer. Ein fehlgeschlagener Produktionsbau
  # hat damit „Alles durchgelaufen, keine Fehler" gemeldet. Gefunden 35.46 in
  # der Gegenprobe zur Sperrdatei: npm ci brach ab, „error during build"
  # stand im Protokoll, und das Ergebnis war trotzdem gruen. Dieselbe Bauart
  # wie der tote Filter bei Pruefung 3. Deshalb jetzt getrennte Schritte mit
  # echtem Rueckgabewert statt einer Pipeline.
  BAULOG=$(mktemp)
  (
    cd "$ARBEIT" || exit 1
    # KEIN --silent: das schluckt auch die Fehlerausgabe, und dann steht da
    # "FEHLER: npm ci ist gescheitert." ohne einen Hinweis worauf. In der
    # Gegenprobe 35.46 war der Kasten genau deshalb leer.
    timeout 280 $INSTALL --no-audit --no-fund > "$BAULOG" 2>&1 || {
      echo "FEHLER: $INSTALL ist gescheitert."
      grep -iE "npm error|error|missing" "$BAULOG" | head -5 | sed 's/^/  /'
      exit 1
    }
    timeout 200 npx vite build > "$BAULOG" 2>&1 || {
      echo "FEHLER: der Produktionsbau ist gescheitert."
      grep -iE "error|could not" "$BAULOG" | head -5 | sed 's/^/  /'
      exit 1
    }
    grep -E "built in|index-.*js" "$BAULOG" | head -4
  ) || FEHLER=1
  rm -f "$BAULOG"
  echo "installiert mit: $INSTALL"
  cp /tmp/package.json.orig "$ARBEIT/package.json"
  rm -rf "$ARBEIT/node_modules" "$ARBEIT/dist"
  if diff -q /tmp/package.json.orig "$ARBEIT/package.json" >/dev/null; then
    echo "package.json unverändert ✓"
  else
    echo "ACHTUNG: package.json weicht ab"; FEHLER=1
  fi
  # Die Sperrdatei darf der Bau NICHT anfassen. Tut er es doch, ist die
  # Wiederholbarkeit dahin und niemand merkt es — deshalb hier nachgesehen.
  if [ -f "/tmp/package-lock.json.orig" ]; then
    if diff -q /tmp/package-lock.json.orig "$ARBEIT/package-lock.json" >/dev/null 2>&1; then
      echo "package-lock.json unverändert ✓"
    else
      echo "ACHTUNG: package-lock.json wurde beim Bau geändert — das darf"
      echo "         npm ci nicht. Wiederholbarer Bau ist damit nicht belegt."
      FEHLER=1
    fi
    rm -f /tmp/package-lock.json.orig
  fi

  # ---- Sicherheitslage des Auslieferungspfads (seit 35.47) ----------------
  # EIGENER TEIL SEIT 35.98. Kevins Frage: „Woran hat es gehakt, dass die
  # Pruefung am Ende so abnormal lange gedauert hat? Wie verhindern wir das in
  # Zukunft?"
  #
  # GEMESSEN, Teil fuer Teil:
  #   aufbau 5 s · kalib 16 · ansicht 30 · ereignis 1 · stimmig 0
  #   namen 0 · verein 1 · rueck 38 · bau 54          = 145 Sekunden
  # Der Pruefstand ist also NICHT langsam. Das Audit dagegen, dreimal
  # gemessen: 116 s, 156 s, 0 s (aus dem Zwischenspeicher). Es fragt eine
  # Datenbank im Netz ab, und wie lange das dauert, entscheidet nicht dieses
  # Projekt.
  #
  # Zusammen sind das 145 bis 300 Sekunden — und damit liegt der ganze Lauf
  # genau an der Zeitgrenze eines einzelnen Aufrufs. Die Schwankung des Audits
  # kippt ihn mal darueber und mal nicht. Das ist keine Sache, die man durch
  # eine hoehere Zeitsperre loest: DER FEHLER IST, EINEN SCHRITT MIT
  # UNBEKANNTER DAUER IN EINEN LAUF MIT FESTER GRENZE ZU LEGEN.
  #
  # Deshalb laeuft die Sicherheitspruefung jetzt nur noch, wenn sie
  # ausdruecklich verlangt wird (TEILE=...,sicher). Der uebliche Lauf bleibt
  # damit weit unter der Grenze, und vor einer Auslieferung ruft man sie
  # einmal getrennt auf. Zwei kurze Laeufe sind besser als einer, der
  # gelegentlich abbricht.
  if [ "${TEILE#*sicher}" = "$TEILE" ]; then
    echo "Sicherheitslage: uebersprungen (TEILE=...,sicher ruft sie auf)"
    echo "  Vor einer Auslieferung getrennt fahren — sie haengt am Netz und"
    echo "  braucht zwischen 0 und 160 Sekunden."
  else
  # `--omit=dev` ist der ganze Witz: von 212 Paketen sind 202 reine
  # Bauwerkzeuge. Ein Fund in vite oder esbuild betrifft den
  # Entwicklungsserver auf dem eigenen Rechner, nicht das Telefon. Wuerde hier
  # ohne --omit=dev geprueft, meldete der Lauf ab heute vier Funde, von denen
  # keiner die App betrifft — und eine Warnung, die immer kommt, ist nach zwei
  # Wochen unsichtbar. Geprueft wird deshalb genau das, was ausgeliefert wird.
  #
  # Kein Netz ist NICHT dasselbe wie kein Fund. Bei einem Netzfehler schreibt
  # npm ein JSON ohne `metadata` — daran wird es erkannt und ausdruecklich als
  # ungeprueft gemeldet, so wie es Pruefung 6 mit der fehlenden LIESMICH.md
  # haelt: kein bestandener Lauf, nur ein fehlender.
  if [ -f "$ARBEIT/package-lock.json" ]; then
    PRUEFLOG=$(mktemp)
    # 300 STATT 120 SEKUNDEN (35.95). Gemessen: das Audit fragt die
    # Schwachstellendatenbank im Netz ab und brauchte hier 188 Sekunden. Bei
    # 120 lief es dreimal in eine Zeitsperre, und der Pruefstand meldete
    # „NICHT GEPRUEFT — kein auswertbares Ergebnis".
    #
    # Das war KEIN Fehlalarm im schlechten Sinn: die Meldung sagte die
    # Wahrheit, es lag wirklich kein Ergebnis vor, und sie hat sich zu Recht
    # nicht als bestanden ausgegeben. Aber eine Grenze, die der normale Fall
    # regelmaessig reisst, erzeugt Rauschen — und nach dem dritten Mal sieht
    # man beim vierten nicht mehr hin.
    ( cd "$ARBEIT" && timeout 300 npm audit --omit=dev --json > "$PRUEFLOG" 2>/dev/null ) || true
    python3 - "$PRUEFLOG" "$PS/sicherheit-bekannt.txt" <<'PYEOF' || SICHER=$((SICHER+1))
import json, os, sys
log, ackdatei = sys.argv[1], sys.argv[2]

try:
    d = json.load(open(log, encoding="utf-8"))
except Exception:
    d = None

if not isinstance(d, dict) or "metadata" not in d:
    grund = (d or {}).get("message", "kein auswertbares Ergebnis")
    print("Sicherheitslage: NICHT GEPRUEFT — %s" % str(grund)[:90])
    print("  Das ist kein bestandener Lauf, nur ein fehlender.")
    sys.exit(1)

funde = d.get("vulnerabilities", {}) or {}
zahl  = d["metadata"]["vulnerabilities"]

# Abgenickte Funde einlesen: Paketname bis zum ersten Doppelkreuz.
bekannt = {}
if os.path.exists(ackdatei):
    for z in open(ackdatei, encoding="utf-8"):
        z = z.strip()
        if not z or z.startswith("#"):
            continue
        name = z.split("#", 1)[0].strip()
        if name:
            bekannt[name] = z.split("#", 1)[1].strip() if "#" in z else "ohne Begruendung"

if not funde:
    print("Sicherheitslage (Auslieferungspfad): 0 Funde ✓")
else:
    offen = 0
    for name, v in sorted(funde.items()):
        stufe = v.get("severity", "?")
        if name in bekannt:
            print("Sicherheitslage: %s (%s) — abgenickt: %s" % (name, stufe, bekannt[name]))
        else:
            print("SICHERHEITSFUND im Auslieferungspfad: %s (%s)" % (name, stufe))
            offen += 1
    if offen:
        print("  %d von %d Funden sind nicht abgenickt." % (offen, len(funde)))
        print("  Einzeln ansehen: npm audit --omit=dev")
        print("  Beheben, oder mit Begruendung eintragen in")
        print("  pruefstand/sicherheit-bekannt.txt — schweigend uebergehen nicht.")
        sys.exit(1)

# Ein Freibrief, den niemand mehr braucht, deckt beim naechsten Mal einen
# echten Fund mit ab. Deshalb wird er gemeldet, sobald er gegenstandslos ist.
tot = [n for n in bekannt if n not in funde]
if tot:
    print("  HINWEIS: abgenickt, aber nicht mehr gemeldet: %s" % " ".join(sorted(tot)))
    print("           Zeile(n) aus pruefstand/sicherheit-bekannt.txt entfernen.")
PYEOF
  fi
    rm -f "$PRUEFLOG"
  fi
else
  echo "ÜBERSPRUNGEN — package.json oder main.jsx fehlt. Ohne sie ist der echte"
  echo "Bau ungeprüft. Beide gehören neben App.jsx ins Projektwissen."
  FEHLER=$((FEHLER+0))
fi
fi

titel "ERGEBNIS"
if [ "$SICHER" != 0 ]; then
  echo "$SICHER Sicherheitsbefund(e) im Auslieferungspfad — oder nicht pruefbar."
  echo "Das betrifft, was auf dem Geraet laeuft. Siehe Bauabschnitt oben."
  FEHLER=$((FEHLER+SICHER))
fi
if [ "$DOK" != 0 ]; then
  echo "$DOK Befund(e) im Berichtswesen — STAND.md oder LIESMICH.md sind veraltet."
  echo "Das Spiel ist davon nicht betroffen, der Lauf gilt trotzdem als nicht bestanden."
  FEHLER=$((FEHLER+DOK))
fi
[ "$FEHLER" = 0 ] && echo "Alles durchgelaufen, keine Fehler." || echo "MINDESTENS EIN TEIL IST FEHLGESCHLAGEN."
exit "$FEHLER"
