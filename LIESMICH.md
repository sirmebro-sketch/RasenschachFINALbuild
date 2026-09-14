# Prüfstand — Kurzanleitung

## Was in dieses Projektwissen gehört

**Die App selbst**

    App.jsx                 das ganze Spiel
    sicherung.js            Importprüfung, Transaktionen und Wiederherstellung
    spielstand.js           Speicherformat für Saison und Ereignisse
    ereignisse.js           die Ereignisse, ausgelagert seit 35.6
    verein.js               der eigene Verein, ausgelagert seit 35.17
    karten.js               Sammelkarten und dauerhafter Spielerpool, seit 35.79
    titelbild.js            das Aufmacherfoto des Titelblatts, seit 35.100
    symbol/appicon-klein.png  Symbolquelle fuers Projektwissen (512 px, 96 kB)
    namen.js                die Namenskartei, ein Eintrag je Land (seit 35.43)
    akademie.js             die Jugendakademie, ausgelagert seit 35.48
    schriften.js            Anton und Archivo als Base64
    schriften-lizenz.txt    SIL OFL — muss mit der App ausgeliefert werden

Sie alle gehören im Verzeichnis **flach neben `App.jsx`**, zusammen mit
`storage.js` — nicht in `pruefstand/`, nicht in einem `src`-Ordner. Wer wissen
will, was dazugehört, liest die `import`-Zeilen am Anfang der `App.jsx`:

    grep -n 'from "\./' App.jsx

**Hier stand bis 35.101 „Alle fünf … Zeilen 2 bis 7". Beide Zahlen waren
falsch** — gemessen sind es acht eigene Importe in den Zeilen 8 bis 15. Und es
ist der zweite Anlauf: bis 35.44 stand da „2 bis 5", damals um `namen.js` zu
knapp. Eine Zahl, die bei jedem neuen Import und jeder neuen Kommentarzeile
altert, gehört nicht in eine Anleitung — dieselbe Lehre wie „**Keine
Zeilennummer merken**" im Kopf von `STAND.md`. Größen standen hier auch; sie
sind weg, der Prüfstand misst sie bei jedem Lauf.

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
    stimmigkeit.cjs · namenpruefung.cjs · argumente.cjs
    sicherheit-bekannt.txt · gleichheit.cjs · schriftabdeckung.cjs · kontrast.cjs · ruecktritt.cjs · texte.cjs

**Wer davon von allein läuft** (gemessen an den Aufrufen in den Skripten, nicht
abgeschrieben):

- **`pruefen.sh` fährt neun selbst:** `kalibrierung.cjs`, `ansichten.jsx`,
  `rueckwaerts.jsx`, `ereignispruefung.cjs`, `stimmigkeit.cjs`,
  `namenpruefung.cjs`, `vereinpruefung.cjs`, `verzeichnis.cjs`, `jsdom.cjs`.
  `exporte.txt` wird angehängt, `argumente.cjs` von den Werkzeugen eingebunden.
- **`sicht.sh` startet sieben:** `browsertest.sh` (darin `startprobe.cjs`),
  `kopfleiste.cjs`, `seitenanfang.cjs`, `passhoehe.sh` (mit `passbogen.jsx`
  und `passmessung.cjs`), `knoepfe.sh` (mit `knopfbogen.jsx` und
  `knopfmessung.cjs`).
- **Alles Übrige nur auf Abruf** — Bildtafeln, Belastungslauf, Vorschau,
  Werkstatt, `uebersicht.cjs`, `messwerkzeug.js`.

Bis 35.44 standen `stimmigkeit.cjs` und `namenpruefung.cjs` weiter unten unter
„läuft nicht automatisch" — obwohl beide seit 35.37 bzw. 35.43 in **jedem** Lauf
mitfahren (Teile `stimmig` und `namen`). Wer der Einordnung glaubte, hielt zwei
laufende Prüfungen für ungeprüft und fuhr sie von Hand nach.

**Die Dokumente**

    STAND.md        Arbeitsstand, Stolperfallen, offene Punkte
    UEBERSICHT.md   Inhaltsübersicht, erzeugt aus App.jsx
    LIESMICH.md     diese Datei

**Die Baudateien** — ohne sie überspringt der Prüfstand den Produktionsbau

    package.json · package-lock.json · vite.config.js · index.html
    main.jsx · storage.js · capacitor.config.json · apk.yml · .gitignore

**Sicherheitsnachträge** (seit 35.46 nicht mehr von allein): alle paar Monate

    npm audit --omit=dev     # betrifft es die App oder nur den Werkzeugkasten?
    npm update               # holt die kleinen Nachträge, schreibt die Sperrdatei neu
    bash pruefstand/pruefen.sh App.jsx

danach die neue `package-lock.json` einchecken. Der Prüfstand sieht seit 35.47
bei jedem Lauf selbst nach und meldet, sobald etwas im **Auslieferungspfad**
auftaucht — nur zehn der 212 Pakete landen dort. Große Sprünge (`vite` 6,
`capacitor` 8) holt `npm update` nicht; die sind eine eigene Sitzung mit
Gerätetest.

`package-lock.json` seit 35.46: sie nagelt alle 212 Bibliotheksfassungen fest.
Ohne sie bauen APK, Prüfstand und Browsertest mit jeweils frisch aufgelösten
Fassungen — dieselbe `App.jsx` kann dann drei verschiedene Bündel ergeben.
Alle drei benutzen jetzt `npm ci` und melden es, wenn die Datei fehlt.

Im Repository liegen sie **flach neben App.jsx**, nicht in einem `src`-Ordner.
`apk.yml` gehört dort nach `.github/workflows/apk.yml`.

**Werkzeug**

    appicon.py      App-Symbol erzeugen (im Repo unter symbol/)

Die drei Klammern darunter — was `pruefen.sh` selbst fährt, was `sicht.sh`
startet, was nur auf Abruf läuft — stehen oben beim Prüfstand. Einzeln
aufrufen lässt sich alles davon:

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
                      Einschreiben. Bei WERKSTATT=1 ODER ERSTSTART=1,
                      nie in der APK
    argumente.cjs     ein Muster für alle Werkzeuge: --quelle= --ziel=
                      --anzahl=; fehlt die Quelle, wird abgebrochen
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

## Einstieg und Arbeitsweise (35.168)

Zwei Dateien im Wurzelverzeichnis, die vor dem Weiterarbeiten zu lesen sind:

| Datei | Inhalt |
|---|---|
| `LIESMICH-ZUERST.txt` | woraus 35.168 besteht, Einstiegsbefehle, was geprüft ist und was nicht |
| `ARBEITSWEISE.md` | der Ablauf einer Änderung, die Fallen die mehrfach zuschlugen, was der Prüfstand strukturell nicht sieht |
| `ZUSAMMENFUEHRUNG-35.168.md` | was von Codex stammt, was von Claude, und die Prüfstufen-Matrix |

`ARBEITSWEISE.md` ist keine Theorie: jede Falle darin ist mindestens zweimal
zugeschlagen. Der Kontrastfehler auf Kartonblättern dreimal.

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
Aufbau weniger als `Baudateien: 7 von 7` und der Produktionsbau wird
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

## Regressionen 35.165

`pruefstand/korrekturen.mjs`: `npm ci`, dann `npm run test:korrekturen`.

`pruefstand/aufstellung-f58.json` ist der feste Gegenbeispiel-Kader für F58.

## Ergänzungen 35.167

`buchungen.js`: geprüfte Pack- und Verkaufsbuchungen.
`pruefstand/ereignis-ids.cjs`: einmalige Kennungsvergabe für historische Antworten; mit `--write` nur auf einen noch nicht migrierten Katalog anwenden. Bestehende IDs und altIndex niemals neu nummerieren.

`pruefstand/android-version.cjs`: Android-Versionsname und aufsteigender Versionscode aus package.json.
