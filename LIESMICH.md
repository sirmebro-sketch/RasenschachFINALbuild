# Prüfstand — Kurzanleitung

## Was in dieses Projektwissen gehört

**Die App selbst**

    App.jsx                 das ganze Spiel
    ereignisse.js           die 518 Ereignisse, ausgelagert seit 35.6
    verein.js               der eigene Verein, ausgelagert seit 35.17
    namen.js          die Namenskartei, ein Eintrag je Land (seit 35.43)
    schriften.js            Anton und Archivo als Base64, 128 KB
    schriften-lizenz.txt    SIL OFL — muss mit der App ausgeliefert werden

Alle vier gehören im Verzeichnis **flach neben `App.jsx`**, zusammen mit
`storage.js` — nicht in `pruefstand/`, nicht in einem `src`-Ordner. Sie stehen
in den `import`-Zeilen 2 bis 5 der `App.jsx`; wer wissen will, was dazugehört,
zählt dort nach.

Fehlt `schriften.js`, bricht der Prüfstand mit einer klaren Meldung ab, und die
App fällt stumm auf die Gerätefonts zurück. Fehlen `ereignisse.js` oder
`verein.js`, meldet esbuild nur „Could not resolve" — und man sucht in
`App.jsx`, wo nichts ist. **Bis 35.29 standen die beiden hier gar nicht:**
wer das Projektwissen nach dieser Liste neu aufgebaut hat, bekam ein Spiel, das
sich nicht bauen liess. Seit 35.30 rechnet `pruefen.sh` die Liste nach.

**Der Prüfstand**

    pruefen.sh · exporte.txt · kalibrierung.cjs · ansichten.jsx
    rueckwaerts.jsx · jsdom.cjs · uebersicht.cjs · vorschau.py
    browsertest.sh · messwerkzeug.js · startprobe.cjs
    ereignispruefung.cjs · vereinpruefung.cjs · verzeichnis.cjs

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

Alles Weitere liegt in `pruefstand/`. Der Prüfstand fährt davon nur einen Teil
automatisch — die Übrigen beantworten Fragen, die er strukturell nicht kann:

    sicht.sh          alles, was jsdom nicht sieht, in einem Lauf:
                      bash pruefstand/sicht.sh App.jsx
    kopfleiste.cjs    vermisst die Kopfknöpfe in echtem Chromium
    seitenanfang.cjs  prüft, dass jeder Seitenwechsel oben beginnt
    passhoehe.sh      prüft, dass der Spielerpass immer gleich hoch bleibt
                      (mit passbogen.jsx und passmessung.cjs)
    knoepfe.sh        prüft, dass Knöpfe lesbar sind und im Bild bleiben,
                      bei 412 und 360 px, über alle blätterbaren Tafeln
                      (mit knopfbogen.jsx und knopfmessung.cjs)
    werkstatt.js      Abkürzungen im Browsertest: Laufbahnen, Coins, Ausbau,
                      Einschreiben. Nur bei ERSTSTART=1, nie in der APK
    argumente.cjs     ein Muster für alle Werkzeuge: --quelle= --ziel=
                      --anzahl=; fehlt die Quelle, wird abgebrochen
    namenpruefung.cjs Abdeckung und Herkunft der Namenskartei
                      node pruefstand/namenpruefung.cjs --quelle=App.jsx
    stimmigkeit.cjs   prüft alle Ereignisse: wirkt jede Wahl, ist jede
                      erreichbar, passt das Ereignis zum Moment
                      node pruefstand/stimmigkeit.cjs [--alle]
    portraetbogen.cjs Porträts als Bildtafel (auch: frau …)
    bindenbogen.cjs   alle 212 Kapitänsbinden als Tafel
    grosstest.cjs     Belastungslauf: Merkmale, Spieler, ganze Laufbahnen
    ereignisse.cjs    zählt, wie oft sich Ereignisse wiederholen
    erreichbar.cjs    misst, welche Ligen und Vereine erreichbar sind
    verlauf40.cjs     40 Laufbahnen mit stufenweisem Akademieausbau
    texttreue.cjs     Zahl im Errungenschaftstext gegen die Bedingung

Die Bildwerkzeuge und die Messwerkzeuge auf Abruf müssen SELBST in `/tmp/ps`
liegen, nicht nur von dort aufgerufen werden: sie binden `./motor.js` relativ
zum Skript ein, nicht zum Arbeitsverzeichnis.

    cp pruefstand/*.cjs /tmp/ps/ && cd /tmp/ps && node erreichbar.cjs

`verzeichnis.cjs` läuft in `pruefen.sh` mit und warnt, wenn das Verzeichnis
in `STAND.md` veraltet ist. Von Hand nur zum Neuschreiben nötig.

Die Bildwerkzeuge brauchen ein gebündeltes `motor.js` und laufen im
Prüfstandverzeichnis. Wie das geht, steht in STAND.md beim Abschnitt 34.27 —
zwei Fallen sind dort beschrieben, an denen es sonst scheitert.

`symbol/appicon.png` — die EINE Bilddatei des Symbols — liegt **nur im
Repository**, nicht im Projektwissen: ein Bild lässt sich dort nicht
durchsuchen und wäre nur Ballast. Wer das Symbol wechselt, tauscht diese
eine Datei im Repository; den ganzen Satz erzeugt `appicon.py` beim Bauen.

## Auf dem Gerät prüfen

    bash pruefstand/browsertest.sh App.jsx              # zum Prüfen
    ERSTSTART=1 bash pruefstand/browsertest.sh App.jsx  # wie frisch installiert

Baut das **echte Produktionsbündel** in eine einzige HTML-Datei, die sich in
Chrome auf dem Handy öffnen lässt — dieselbe Maschine, die Capacitor als
WebView benutzt. Unterschied zur APK ist genau eine Datei: `storage.js` läuft
auf `localStorage` statt auf Capacitor Preferences.

**`ERSTSTART=1`** lässt die Willkommens-Vorbelegung weg. Ohne den Schalter wird
vorbelegt, sonst bleiben `kopfleiste.cjs` und `seitenanfang.cjs` im Schirm
stecken und warten 30 Sekunden auf das Zahnrad dahinter. Wer den Schirm
*sehen* will, braucht also den Schalter.

Der Schirm merkt sich im `localStorage`, dass er weg war: zum zweiten Mal ein
privates Fenster nehmen oder `rasenschach:willkommen` löschen.

Der Griff `fps` unten links öffnet ein Messwerkzeug, das **außerhalb** des
Bündels liegt und die App nicht anfasst: Diagnose (Protokoll, sicherer
Zusammenhang, `wakeLock`, `localStorage`), Bildrate und drei A/B-Schalter.
Solange es aus ist, läuft davon kein Code.

**`navigator.wakeLock` braucht einen sicheren Zusammenhang.** Über `content://`
oder `file://` ist der Schalter „Bildschirm anlassen" gesperrt — das ist die
Umgebung, nicht die App. Für diesen Punkt `http://localhost` oder https nutzen.

**Zuletzt auf dem Gerät bestätigt: 10.8.2026** (Fassung 34.x) — Pass wendet
sauber, Wachsperre greift, Impressum ohne „SCHRIFT FEHLT", kein Ruckeln in den
Errungenschaften. **Nach jeder Änderung an Schriften, Pass oder Wachsperre
wiederholen** — der Prüfstand kann diese drei Dinge strukturell nicht sehen.

**Seither auf dem Gerät gewesen:** die Vereinsgründung (35.27, zwei Layoutfehler
gemeldet) und der Vereinsmodus im Spiel (35.28, ein konzeptioneller Fehler
gemeldet). Beide Male hat Kevin gefunden, was der Prüfstand strukturell nicht
findet.

**Weiterhin fällig und nie auf einem Telefon gewesen:** die feste Passhöhe aus
35.23, der Willkommensschirm aus 35.26, das Einschreiben statt des Saisonknopfs
aus 35.28 und die berichtigten Knopfzeilen aus 35.29. Ein Datum, das stehen
bleibt, während sich die Sache ändert, ist keine Bestätigung mehr.

## Prüfen

Claude legt sich zu Beginn einer Sitzung **alle** Dateien aus dem Projektwissen
in ein beschreibbares Verzeichnis — die Werkzeuge nach `pruefstand/`, die App-
und Baudateien **flach daneben** (siehe STAND.md Abschnitt 8) — und ruft auf:

    bash pruefstand/pruefen.sh /pfad/zu/App.jsx

Hier stand bis 35.29 nur „nach `/home/claude/pruefstand/`". Wer das wörtlich
nimmt, legt auch `main.jsx` und `package.json` dorthin — dann meldet der
Aufbau weniger als `Baudateien: 6 von 6` und der Produktionsbau wird
übersprungen. Genau diese Falle beschreibt Abschnitt 8 der STAND.md.

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
