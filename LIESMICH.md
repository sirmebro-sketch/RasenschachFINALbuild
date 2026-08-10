# Prüfstand — Kurzanleitung

## Was in dieses Projektwissen gehört

**Die App selbst**

    App.jsx                 das ganze Spiel
    schriften.js            Anton und Archivo als Base64, ~127 KB
    schriften-lizenz.txt    SIL OFL — muss mit der App ausgeliefert werden

`schriften.js` gehört im Verzeichnis **neben** `App.jsx` und `storage.js`.
Ohne sie bricht der Prüfstand mit einer klaren Meldung ab, und die App fällt
stumm auf die Gerätefonts zurück.

**Der Prüfstand**

    pruefen.sh · exporte.txt · kalibrierung.cjs · ansichten.jsx
    rueckwaerts.jsx · jsdom.cjs · uebersicht.cjs · vorschau.py
    browsertest.sh · messwerkzeug.js · startprobe.cjs

**Die Dokumente**

    STAND.md        Arbeitsstand, Stolperfallen, offene Punkte
    UEBERSICHT.md   Inhaltsübersicht, erzeugt aus App.jsx
    LIESMICH.md     diese Datei

**Die Baudateien** — ohne sie überspringt der Prüfstand den Produktionsbau

    package.json · vite.config.js · index.html · main.jsx
    storage.js   · capacitor.config.json · apk.yml · .gitignore

Im Repository liegen sie **flach neben App.jsx**, nicht in einem `src`-Ordner.
`apk.yml` gehört dort nach `.github/workflows/apk.yml`.

**Werkzeug**

    appicon.py      App-Symbol erzeugen (im Repo unter symbol/)

`symbol/appicon.png` — die EINE Bilddatei des Symbols — liegt **nur im
Repository**, nicht im Projektwissen: ein Bild lässt sich dort nicht
durchsuchen und wäre nur Ballast. Wer das Symbol wechselt, tauscht diese
eine Datei im Repository; den ganzen Satz erzeugt `appicon.py` beim Bauen.

## Auf dem Gerät prüfen

    bash pruefstand/browsertest.sh App.jsx

Baut das **echte Produktionsbündel** in eine einzige HTML-Datei, die sich in
Chrome auf dem Handy öffnen lässt — dieselbe Maschine, die Capacitor als
WebView benutzt. Unterschied zur APK ist genau eine Datei: `storage.js` läuft
auf `localStorage` statt auf Capacitor Preferences.

Der Griff `fps` unten links öffnet ein Messwerkzeug, das **außerhalb** des
Bündels liegt und die App nicht anfasst: Diagnose (Protokoll, sicherer
Zusammenhang, `wakeLock`, `localStorage`), Bildrate und drei A/B-Schalter.
Solange es aus ist, läuft davon kein Code.

**`navigator.wakeLock` braucht einen sicheren Zusammenhang.** Über `content://`
oder `file://` ist der Schalter „Bildschirm anlassen" gesperrt — das ist die
Umgebung, nicht die App. Für diesen Punkt `http://localhost` oder https nutzen.

**Stand 10.8.2026 auf dem Gerät bestätigt:** Pass wendet sauber, Wachsperre
greift, Impressum ohne „SCHRIFT FEHLT", kein Ruckeln in den Errungenschaften.
**Nach jeder Änderung an Schriften, Pass oder Wachsperre wiederholen** — der
Prüfstand kann diese drei Dinge strukturell nicht sehen.

## Prüfen

Claude legt sich die Prüfstanddateien zu Beginn einer Sitzung nach
`/home/claude/pruefstand/` und ruft auf:

    bash pruefstand/pruefen.sh App.jsx

Das dauert etwa drei Minuten und prüft: Kalibrierung gegen hinterlegte
Zielbänder, alle Ansichten in einer Browserumgebung, einen Durchklicktest,
Härtefälle mit alten Sicherungen, sowie den echten Produktionsbau.

Nichts davon landet in der App. Die ausgelieferte `App.jsx` bleibt
unberührt — die Ausfuhren aus `exporte.txt` werden nur an eine Kopie
angehängt. `package.json` wird nach dem Bau zurückgesetzt und geprüft.

**Der Produktionsbau läuft nur, wenn `package.json` und `main.jsx`
neben der `App.jsx` liegen.** Fehlen sie, überspringt der Prüfstand den
Schritt mit einer Meldung — bis Fassung 33.13 fiel das monatelang nicht auf,
weil das Arbeitsverzeichnis fest verdrahtet war und nie auf die Quelle zeigte.

## Ansehen

    python3 vorschau.py App.jsx vorschau.jsx

Erzeugt eine Fassung, die im Chatfenster läuft. **Die Vorschau lädt nichts
aus dem Netz nach.** Sie kopiert die Schriften aus `schriften.js` hinein,
damit sie dasselbe zeigt wie das Gerät. Vor Fassung 33.3 war das anders —
die Vorschau lud Schriften nach, die App nicht, und der Unterschied blieb
monatelang unbemerkt. Wer hier wieder etwas nachlädt, macht das Werkzeug
wertlos.

## Übersicht neu erzeugen

    node uebersicht.cjs UEBERSICHT.md

Braucht `motor.js` unter `/tmp/ps/` — das entsteht beim Prüfstandlauf.
Jede Zahl darin stammt aus dem laufenden Spielcode, nichts ist abgeschrieben.

Ausführliche Beschreibung: `STAND.md`.
