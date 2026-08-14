# Rasenschach XI — Stand

> **Für Claude:** Diese Datei zuerst lesen. Dann die Fassungsnummer in
> `App.jsx` (**Zeile 10** — Zeile 9 ist `NAME`, Zeile 11 `VERSION_INFO`)
> gegenprüfen — stimmt sie nicht mit der hier genannten überein, ist eine
> der beiden Dateien veraltet. Das sagen, bevor irgendetwas geändert wird.

**Fassung 34.12** · Stand 10. August 2026
*Eigene Schriften · harte Form · Sammelalbum · neue Spielerporträts · **das Heft: dunkles Zeitungspapier***

> Die Abschnitte 1 bis 8 beschreiben das Spiel und die Arbeitsweise und gelten
> unverändert. Alles ab „Fassungen 33.3 bis 33.7" ist neuer und **hat Vorrang**,
> wo sich etwas widerspricht.

---

## 1. Was das Projekt ist

Ein Karriere-Simulator für Fußball, auf Deutsch, als **eine einzige
`App.jsx`** (~840 KB, ~10.800 Zeilen). Läuft als Android-App: GitHub baut
per Aktion `apk.yml` eine APK, die ohne Internet funktioniert.

**Zielpublikum:** soll selbsterklärend sein, auch für jemanden, der so
etwas noch nie gespielt hat. Deutschsprachige Oberfläche durchgehend.

**Dateien im Projekt** (so heißen sie im Verzeichnis, das Projektwissen
schreibt Punkte in Unterstriche um):

| Datei | Zweck |
|---|---|
| `App.jsx` | das ganze Spiel — **Android-Fassung**, bindet `./storage.js` ein |
| `main.jsx`, `index.html` | Einstiegspunkt |
| `storage.js` | Speicher über Capacitor Preferences |
| `package.json`, `vite.config.js` | Bau |
| `capacitor.config.json` | App-Hülle |
| `apk.yml` | GitHub-Aktion, gehört nach `.github/workflows/` |
| `ANLEITUNG.md` | Anleitung für Kevin, Schritt für Schritt |
| `STAND.md` | diese Datei |
| `pruefstand/` | Prüfwerkzeuge, siehe Abschnitt 5 |

**Zwei Fassungen, eine Quelle.** `App.jsx` ist die Android-Fassung. Für das
Testen im Chat erzeugt `pruefstand/vorschau.py` daraus eine Vorschaufassung
(`window.storage` statt Capacitor, Schriften aus dem Netz). Die Spielmechanik
ist Zeichen für Zeichen identisch — das Skript bricht ab, wenn es etwas nicht
findet, und prüft am Ende, dass keine Reste übrig bleiben.

    python3 pruefstand/vorschau.py App.jsx rasenschach-vorschau.jsx

**Die Android-Fassung lässt sich im Chat nicht öffnen.** Tippt Kevin sie an,
meldet die Vorschau *„Artifact failed to load — ./storage.js"*. Das ist kein
Fehler, sondern gewollt. Dann auf die Vorschaufassung verweisen.

---

## 2. Zusammenarbeit

**Kevin** — Hamburg, HSV. Arbeitet prüfend: Er erwartet **Zahlen vor und
nach** jeder Änderung, keine Behauptungen. Wenn etwas nicht geprüft ist,
gehört das gesagt. Er hat schon zweimal zu Recht bemängelt, dass etwas als
erledigt gemeldet wurde, was es nicht war (Konfettifarben, `ntNote`).

Was daraus folgt:
- Behauptungen über Wirkung immer messen, nie schätzen.
- Eigene Fehler klar benennen, nicht relativieren.
- Nach jeder Sitzung: **neue `App.jsx` und dieses `STAND.md` ins Projekt
  legen.** Sonst beginnt der nächste Chat wieder bei einem alten Stand —
  genau das ist am 7.8.2026 passiert und hat die halbe Sitzung gekostet.

---

## 3. Was drin ist (Grobüberblick)

Laufbahn von 16 bis Karriereende: Trainingsschwerpunkt, 2–3 Ereignisse je
Saison, simulierte Saison mit echten Wettbewerben, Transferfenster.
Dazu: Wildcards mit Seltenheitsstufen, 150 Errungenschaften, Nationalmann-
schaft, Vermögen und Anschaffungen, Ruhmeshalle, Saison- und Karriere-
rückblick, Kapitänsbinde im Pass, Sicherung per Textbaustein.

**Neu in 33.2 — zwei Fehler in der Enthüllung behoben**

Beide stammten aus der Neufassung in 33.0, beide waren als „unrunde
Animation" sichtbar:

1. **Text blinkte nach dem Aufdecken kurz weg.** Die Klasse der Textzeilen
   wechselte bei Stufe 2 von `eb` auf `eb rs-auf`. `rs-auf` beginnt bei
   `opacity:0` mit Füllmodus `both` — der schon sichtbare Text sprang also
   auf unsichtbar und blendete neu ein. Jetzt hängt die Einblendung an `auf`
   und wird danach nicht mehr angefasst.
2. **Die Drehung lief unrund.** Beben, Schweben und Drehung saßen auf
   demselben Element und stritten um `transform`; beim Wechsel sprang die
   Karte. Zusätzlich endete die Drehung (780 ms) exakt dann, wenn das
   Schweben ansetzte. Jetzt: drei getrennte Ebenen (Perspektive · Bewegung ·
   Drehung), Drehung auf 700 ms, Schweben erst nach 820 ms.

Nebenbei: `-webkit-`-Vorsätze für `backface-visibility` und
`transform-style` (ältere Android-Webansichten), `will-change` gesetzt,
Strahlen auf feste Größe begrenzt statt `inset:-60 %` über die ganze Fläche,
Funken mit Verlauf statt weichem Schein gezeichnet.

**Neue Prüfung `ablauf()`** in `ansichten.jsx`: hält den Zustand an fünf
Zeitpunkten fest und schlägt an, wenn Textklassen nach dem Aufdecken
wechseln oder Drehung und Bewegung auf einem Element sitzen. Mit beiden
Fehlern gegengeprüft — beide werden gefunden.

**App-Symbol und Name (8.8.2026)**

- Die App heißt auf dem Gerät **Rasenschach XI** (`appName` in
  `capacitor.config.json`, vorher nur „Rasenschach"). Real geprüft: `cap add
  android` schreibt den Namen in `res/values/strings.xml`.
- Im Projekt liegt **eine** Bilddatei `symbol/appicon.png`. Der ganze Satz aus
  fünf Bildschirmdichten entsteht beim Bauen über `symbol/appicon.py`. Zum
  Wechseln des Symbols nur diese eine Datei tauschen.
- **Warum ein fertiges Symbol nicht direkt geht:** Android legt seit Version 8
  eine eigene Maske darüber (Kreis, Squircle, abgerundetes Quadrat). Ein Bild
  mit eingebautem Rahmen bekommt dadurch eine zweite Rundung und einen dunklen
  Ring, der Schriftzug wird beidseitig abgeschnitten. `appicon.py` entfernt den
  Rahmen, legt das Bild auf die mittleren 72 von 108 Einheiten und füllt den
  Rand mit einer unscharfen Vergrößerung auf.
- Kein `<monochrome>` in der Symbolbeschreibung: Android nutzt davon nur die
  Alphamaske, und die wäre bei einem vollflächigen Bild ein einfarbiger Klotz.
- `symbol/erzeugt` steht in `.gitignore`.

**Neu in 33.1**

- **`Handlung` ist ersatzlos entfernt** (Bauteil und alle drei Einsatzstellen).
  Die große Schrittanzeige nahm zu viel Platz im Spielbereich. Den Fortschritt
  zeigt weiterhin die schmale `Schritte`-Leiste im Kopf; die Ereigniszählung
  steht jetzt als kleine Zeile über der Ereigniskarte.
- **Punkte und Coins auseinandergehalten.** Die erste Zeile der VC-Aufschlüsselung
  hieß „Vermächtnispunkte" und zeigte den bereits umgerechneten Betrag — das
  legte nahe, beide Zahlen seien dasselbe. Sie heißt jetzt
  „Aus 1.204 Vermächtnispunkten", dazu ein Hinweis im Kopf des Blocks.
  Gemessen: 1.500 Laufbahnen ergaben 135–2.150 Punkte, aber nur 5–131 Coins;
  die beste einzelne Laufbahn deckt **4 % des Vollausbaus**.

**Neu in 33.0**

- **Reiterwechsel** springt an den Anfang des Bereichs (`zumAnfang`). Vorher
  blieb man bei kürzerem Inhalt irgendwo unterhalb der Seite stehen.
- **Ergebnisschritt umsortiert:** Transfermarkt steht jetzt über der
  Saisonbilanz — nach dem Rückblick will man weiterspielen, nicht dieselben
  Zahlen zweimal lesen.
- **Karriereende:** Der Rückweg ins Hauptmenü heißt „Neue Laufbahn beginnen",
  ist groß und pocht dezent.
- **Kartenenthüllung** läuft in vier Stufen (Aufbau, Umschlag, Nachglühen,
  Bereit) und ist **bis zum Ende nicht wegtippbar**. Dabei kam heraus: Die
  Rautekarte bekam wegen `indexOf(...) === -1` die **schwächste** Animation
  von allen. Sonderstufen mit Gewicht 0 zählen jetzt als höchste Stufe.
- **Vibration** für jede Schaltfläche über **eine** Ereignisbehandlung auf
  `pointerdown` statt an 72 Knöpfen einzeln. `haptik` unterdrückt doppelte
  Impulse innerhalb von 160 ms, ein kräftigerer löst einen schwächeren ab.
- **Akademie:** zwölf Errungenschaften, Ausbau-Ring, Fortschrittsbalken zum
  nächsten Ziel, mitlaufende Zahlen, Konfetti beim Ausbau. Am Karriereende
  werden große Jahrgänge hervorgehoben (Konfetti bei einem Weltklassespieler)
  und der Weg zum nächsten Ausbau gezeigt.
- **Rautekarte** auf Median 33 Laufbahnen eingestellt (Steigerung 0,12 Punkte).

**Neu in 32.1 — Rautekarte („NUR DER HSV")**

Die Karte war zwar ziehbar, aber unerreichbar: Der Ausgleichszähler
`hsvZaehler` wurde an zwei Stellen **gelesen und an null Stellen geschrieben**.
Gemessen vorher: 0,092 % je Laufbahn, 1 von 1.087, für 50 : 50 hätte es
753 Laufbahnen gebraucht. Jetzt läuft der Zähler unter `HSV_KEY`, steigt je
abgeschlossener Laufbahn ohne die Karte um **0,35 Punkte** und beginnt bei
einem Treffer wieder bei 0,1 %. Gemessen nachher: **Median 20 Laufbahnen**
(P10 8, P90 36), 80 % innerhalb von 30.

**Neu in 32.0 — Jugendakademie und Vermächtnis-Coins**

- **VC** gibt es nach jedem Karriereende (`vcFuer`), aufgeschlüsselt im
  Abschlussbildschirm (`vcPosten`).
- **Eine beendete Laufbahn = ein Jahr in der Akademie.** `akaVerbuchen`
  schreibt die Coins gut und lässt — nur wenn gegründet — `akaJahr` laufen.
- **Sechs Abteilungen** (`ABTEILUNGEN`), je sechs Stufen, Vollausbau 1.564 VC.
- **Talente** treten mit 15 ein, gehen mit 19. Übergang in den Profibereich
  ist eine Wahrscheinlichkeit, keine feste Schwelle.
- **Rückwirkung auf neue Laufbahnen** über `akaBonus`, **hart gedeckelt**:
  Anlage +4, Bekanntheit +6, +100 Tsd. € Startkapital, Entwicklung +6 %.
- Gründung ist kostenlos und setzt drei Jahrgänge auf einmal ein, damit
  nicht vier Laufbahnen lang nichts passiert.

---

## 4. Kalibrierung — worauf eingestellt wurde

Gemessen am 7.8.2026 über 300 simulierte Laufbahnen bzw. 40–200 Akademie-
durchläufe. **Die Zielbänder stehen in `pruefstand/kalibrierung.cjs` ganz
oben und lassen das Skript fehlschlagen, wenn sie verlassen werden.**

| Kennzahl | Gemessen | Zielband |
|---|---|---|
| VC je Laufbahn | Mittel 51, Median 51 | — |
| Laufbahnen bis Vollausbau | **30,5** | 25–35 |
| Kosten des Vollausbaus | 1.564 VC | 1.400–1.700 |
| Weltklasse, Stufe 6 / 25 Jahre | Median **5** (P10 2, P90 8) | 3–8 |
| Laufbahnen bis zur Rautekarte | Median **33** (P10 14, P90 61) | 28–42 |

Ertrag der Akademie über 25 Jahre je Ausbaustufe (Profis / Weltklasse):
Stufe 1 → 1,8 / 0 · Stufe 3 → 9,9 / 0 · Stufe 5 → 39 / 1,1 · Stufe 6 → 49 / 4,2

Realistischer Verlauf über 40 Laufbahnen mit stufenweisem Ausbau: rund 33
Profis, 1–2 Weltklassespieler, Ansehen ~160 → Anlage +3, Ruf +4, +60 Tsd. €,
Entwicklung +4 %.

Sicherungsgröße der Akademie nach 25 Jahren: **19 KB** (Talente offen,
Ehrentafel auf 40 gekappt, Chronik auf 25 Jahre).

---

## 5. Prüfstand

Ein Aufruf baut alles auf und misst durch (~3 Minuten):

```bash
bash pruefstand/pruefen.sh                    # Quelle /mnt/project/App.jsx
bash pruefstand/pruefen.sh /pfad/zu/App.jsx   # andere Quelle
TEILE=kalib bash pruefstand/pruefen.sh        # nur ein Teil
TEILE=ansicht,rueck LAEUFE=10 bash pruefstand/pruefen.sh
```

Teile: `aufbau` · `kalib` · `ansicht` · `rueck` · `bau`

| Datei | Was sie tut |
|---|---|
| `pruefen.sh` | Aufbau und Ablaufsteuerung |
| `exporte.txt` | **einzige** Liste der Ausfuhren; wird an eine Kopie der `App.jsx` angehängt. Fehlt ein Name, hier ergänzen. |
| `kalibrierung.cjs` | rechnet echte Laufbahnen durch, prüft die Zielbänder |
| `ansichten.jsx` | Akademieansichten, Härtefälle, Durchklicktest, Speicherprobe |
| `rueckwaerts.jsx` | 63 bestehende Ansichten mit vier ganz verschiedenen Laufbahnen |
| `jsdom.cjs` | startet ein Bündel in einer Browserumgebung |
| `vorschau.py` | erzeugt die Vorschaufassung für den Chat |
| `uebersicht.cjs` | erzeugt `UEBERSICHT.md` aus den Spieldaten |
| `browsertest.sh` | baut den Browsertest als Einzeldatei (siehe unten) |
| `portraetbogen.cjs` | rendert Porträts als Bildtafel — ohne das ist Grafik blind |
| `messwerkzeug.js` | Diagnose, Bildrate und A/B-Schalter für den Browsertest |
| `startprobe.cjs` | fährt die fertige Einzeldatei in jsdom hoch |
| `appicon.py` | erzeugt den Android-Symbolsatz aus einem Bild |

**Warum mehrfach laufen lassen:** Manche Fehler zeigen sich nur in
bestimmten Spielzuständen. Der `ntNote`-Fehler wurde erst im achten
Durchlauf sichtbar. Vorgabe sind sechs Durchläufe.

**Der Prüfstand ist selbst geprüft.** Am 7.8.2026 wurden zwei Fehler
absichtlich eingebaut. Der erste (fehlende Absicherung gegen unvollständige
Sicherungen) wurde zunächst **nicht** gefunden, weil er keinen Absturz
erzeugt, sondern leere Zahlenfelder. Daraufhin ergänzt: `zahlenPruefen`
und eine allgemeine Prüfung auf `NaN`/`undefined` in jeder Ansicht.

---

## 6. Stolperfallen — teuer gelernt

| Sache | Worauf zu achten ist |
|---|---|
| `clubColors()` | gibt ein **Feld** zurück, kein Objekt mit `.p`/`.s`. Über `farbPaar()` vereinheitlichen. |
| `ntNote` | enthält **Text** wie „WM 2036: Titel", keine Note. Nie rechnen damit. |
| Seltenheitsstufen | Stufen mit Gewicht 0 (z. B. „Schwarz-Weiß-Blau") müssen aus dem Ziehungstopf gefiltert werden, sonst kippt die ganze Verteilung über NaN. |
| Einblendungen | Jede Laufbahn hat eine `lauf`-Kennung. Alle Überlagerungen daran binden, sonst erscheint der Rückblick der Vorgängerlaufbahn. |
| `package.json` | `npm install` im Arbeitsverzeichnis schreibt Prüfpakete hinein. `pruefen.sh` setzt sie zurück und meldet Abweichungen. **jsdom gehört nicht ins Spiel.** |
| Alte Sicherungen | Immer gegen fehlende Felder absichern (`{ ...leereAkademie(), ...gespeichert }` und einzeln für `stufen`/`bilanz`). |
| Titel als Funktion | Viele `EVENTS` haben `title:c=>\`...\`` — beim Auslesen muss ein Ersatz-Zusammenhang übergeben werden, sonst steht „undefined" im Text. `uebersicht.cjs` fängt das ab. |
| Prüfskript vor Definition | Zweimal hat ein Härtefall vor der Definition seiner Grunddaten gestanden und einen Fehler im Spiel vorgetäuscht. Neue Prüfungen ans Ende des jeweiligen Blocks. |
| Punkte ≠ Coins | `verdict().score` (dreistellig bis vierstellig) und Vermächtnis-Coins (ein- bis dreistellig) sind zwei Dinge. Beschriftungen so wählen, dass die Umrechnung sichtbar bleibt. |
| Klassenwechsel mitten im Ablauf | Wechselt `className` während einer laufenden Einblendung, startet die Animation von vorn — bei `both`-Füllmodus heißt das: kurz unsichtbar. Einblendungen an einen Zustand hängen, der sich nur einmal ändert. |
| transform zweimal vergeben | `transition: transform` und `animation` mit `transform` auf einem Element schließen sich aus. Bewegung und Drehung gehören auf getrennte Ebenen. |
| Prüfskript beendet sich nicht | Ansichten hinterlassen Zeitgeber und Bildschleifen. `ansichten.jsx` hängt jede Zeitprobe wieder aus und ruft am Ende `process.exit`. Sonst läuft es in die Zeitüberschreitung und gilt als fehlgeschlagen, obwohl alles besteht. |
| Symbolmaske | Android zeigt nur die mittleren 72 von 108 Einheiten. Alles darüber hinaus kann jeder Startbildschirm wegschneiden — Text am Rand überlebt das nie. |
| Zähler ins Leere | `hsvZaehler` war ein vollständig ausformulierter Mechanismus, den nie jemand angeschlossen hat. Bei jedem Wert, der aus einer Einstellung kommt, prüfen: Wird er **irgendwo geschrieben**? |
| Schriften | Die App nutzt Gerätefonts, kein Nachladen aus dem Netz. Bei Änderungen an `CSS` nicht versehentlich einen `@import` einbauen. |
| jsdom | `act()`-Warnungen zeitgesteuerter Animationen und fehlendes `getContext` sind **Prüfumgebung, kein Fehler**. Der Filter in den Skripten darf nicht abgeschaltet werden — die Warnungen treffen verzögert ein. |

---

## 7. Was offen ist

**Die aktuelle Liste steht weiter unten unter „Offene Punkte (Stand 33.13)".**
Von den hier ursprünglich genannten Punkten sind noch offen:

- **Akademie im Karriere-Rückblick** — die Einblendung nach dem Karriereende
  erwähnt sie noch nicht (der Abschlussbildschirm schon).
- **Turniere sichtbar machen** — Jugendturniere sind bisher nur eine Zahl
  in der Bilanz, ohne Namen oder Gegner.
- **Rautekarte sichtbar machen** — die steigende Aussicht ist nirgends
  angedeutet. Bewusst so gelassen (Überraschung).

Erledigt: die Bündelgröße wird jetzt bei jedem Bau gemessen (zuletzt 1.022 kB,
377 kB gepackt — der Zuwachs gegenüber 855 kB sind die eingebetteten Schriften
und `@capacitor/preferences`). `UEBERSICHT.md` ist auf 33.13 neu erzeugt.

---

## 8. Wie ein neuer Chat anfangen sollte

1. `STAND.md` lesen — auch die Abschnitte ab „Fassungen 33.3 bis 33.7".
2. Fassungsnummer in `App.jsx` gegenprüfen. Abweichung sofort melden.
3. Alle Dateien aus dem Projektwissen in ein **beschreibbares** Verzeichnis
   legen — `/mnt/project` ist nur lesbar. Dann:

       bash pruefstand/pruefen.sh /pfad/zu/App.jsx

   Der Aufruf **braucht den Pfad**. Die Ausgabe muss `Baudateien: 6 von 6
   gefunden` und `Schriften: 128K` enthalten; steht dort weniger, ist das
   Projektwissen unvollständig und der Produktionsbau ungeprüft.
4. Ändern, erneut messen, **vorher/nachher gegenüberstellen**.
5. Am Ende: Fassungsnummer, `VERSION_INFO` **und den Kopf dieser Datei**
   anheben, `STAND.md` fortschreiben, alle geänderten Dateien ausliefern.

**Was der Prüfstand abdeckt:** Kalibrierung, 63 Ansichten, Durchklicktest,
Rückwärtsprüfung mit alten Sicherungen, echter Produktionsbau.
**Was er nicht abdeckt:** alles, was nur auf dem Gerät sichtbar wird — Schriften
in der WebView, `preserve-3d` beim Wenden des Passes, `navigator.wakeLock`.
Dafür gibt es den Browsertest als Einzeldatei: `bash pruefstand/browsertest.sh App.jsx`.
**Alle drei sind am 10.8.2026 auf dem Gerät bestätigt worden** (siehe „Auf dem Gerät
geprüft"). Nach jeder Änderung an Schriften, Pass oder Wachsperre gehört das wiederholt —
der Prüfstand kann es strukturell nicht.

---

## Fassungen 33.3 bis 33.7 — Schrift, Form, Farbe

### 33.3 · Eigene Schriften
`App.jsx` nannte drei Schriftfamilien und lieferte keine mit — `grep -c "@font-face"`
ergab **0**. Auf jedem Android-Gerät fiel alles auf Roboto zurück. Nicht aufgefallen war
das, weil `vorschau.py` in Schritt 4 die Schriften aus dem Netz nachlud: **die Vorschau
zeigte etwas anderes als das Gerät.** Dieser Schritt ist entfernt.

Jetzt in `schriften.js` (neu, neben `storage.js`), eingebettet als Base64, 94 KB:
* **Rasen Anzeige** = Anton, für `.d`. Gewicht **400**, nicht 800 — sonst rechnet die
  WebView einen Fettdruck dazu und Anton verschmiert. Alle zehn Ziffern auf gleiche
  Vorbreite 1012 gesetzt (vorher 677 und 1012), sonst springen hochzählende Zahlen.
* **Rasen Text** = Archivo 400/500/600/700, für alles andere. Hat `tnum`.
* Die Schreibmaschinenschrift ist **ersatzlos weg**. `.m` und `.eb` brauchten keine
  Schreibmaschine, sondern gleich breite Ziffern — die liefert Archivo.
* Elf SVG-Stellen setzen die Schrift direkt (Wappen, Achsen, Kapitänsbinde) und wurden
  mitgezogen. Klassen greifen dort nicht.
* Beide unter SIL OFL, `schriften-lizenz.txt` muss mitgeliefert werden.
* `pruefen.sh` kopiert `schriften.js` mit und bricht ab, wenn sie fehlt.

**Selbstprüfung in der Fußzeile.** `useSchriftBefund()` misst Textbreiten gegen eine
Ersatzschrift. Erste Fassung war falsch: eine Zeichenfläche sieht nur Schriften, die
schon geladen sind, und die Messung lief während des ersten Aufbaus — sie meldete
immer „fehlt". Jetzt Haken mit `document.fonts.ready`.

### 33.4 · Harte Form
Vorbild sind Stadionheft und Eintrittskarte des HSV: dort ist alles rechteckig.
* Rundungen: 9 im Gestaltungsblock + 22 im Bauteilcode → **0**. Die drei `50%` bleiben,
  das sind Kreise.
* Verlaufsschimmer: 4 → 0. Schlagschatten: 4 → 0. `--schatten` und `--schatten2` gelöscht.
* Rahmen durchgehend von `--ln` auf `--ln2` — sichtbar statt geahnt.
* `.btn.pri` ist ein helles Feld mit 4 px dunkler Unterkante. Beim Drücken sackt es um
  2 px ein und die Kante schrumpft auf 2 px.
* `.btn.on` trägt einen 3 px Balken links (`inset 3px 0 0`) statt eines blauen Scheins.

### 33.5 · Sammelalbum
Nur dort, wo gesammelt wird — nicht global.
* `.klebe` — harter Versatzschatten `3px 4px 0`, keine Weichzeichnung.
* `winkel(k)` aus `hashStr()`: −0,75° bis +0,75°, **fest je Gegenstand**. Gegengeprüft:
  dreimal aufgerufen, dreimal derselbe Wert; 13 verschiedene Winkel über 400 Gegenstände.
* `.leerfeld` — Errungenschaften, die fehlen, sind gestrichelte Felder mit ihrer Nummer
  (001–162). Name und Beschreibung bleiben stehen, sonst wüsste man nicht, worauf man spielt.
* `.folie` — nur `welt`, `goat`, `hsv`. Liegt in der Enthüllung **innerhalb** der
  Vorderseite und fasst kein `transform` an, damit die drei Bewegungsebenen unberührt bleiben.
  `.rs-still .folie` schaltet sie in RUHE ab.
* `.stempel` — der beste Lauf in der Ruhmeshalle, ab drei Einträgen.
* `.streifen` — nur an der gezogenen Karte, dem Einzelstück. **An 162 Feldern wäre die
  Geste Tapete.**

### 33.6 / 33.7 · Farbkonzept
* Grund ist **Rasen bei Nacht** (`--bg:#070D0A`), vorher ein Marineblau. Darüber liegt das
  **Halbtonraster** aus den Stadionheften als `repeating` radial-gradient, 5 px.
* Bedeutung ist die Ampel des Sports: `--ok` Rasengrün, `--go` Gelbe Karte,
  `--bad` Rote Karte, `--ac` Stadionheft-Blau. Das alte `--bad` lag bei Kontrast 4,42
  und damit unter der Schwelle — der neue Wert wurde bis 4,80 aufgehellt.
* `noteCol()` läuft jetzt wie eine Schulnote von Grün nach Rot. Vorher Gold, Grün, Grau,
  Braun, Rot ohne Ordnung.
* **Zweitwerte für helle Flächen** liegen bereit: `--karton`, `--karton2`, `--tinte`,
  `--tinte2`, `--ac-k`, `--go-k`, `--ok-k`, `--bad-k`. Ohne sie ist auf Papier nichts
  lesbar — Gelb erreicht dort nur Kontrast 1,30.
* **Zwei Prestigeleitern.** `STUFEN` (Errungenschaften) heißt Bronze/Silber/Gold/Platin/
  Legendär und *ist* eine Materialleiter. In 33.6 hatte ich `RARITY` ebenfalls auf
  Materialien gestellt — zwei Paare wurden dadurch **exakt gleich** (Abstand 0). In 33.7
  weicht `RARITY` aus: Papier, Patina, Eis, Bernstein, Amethyst, Rosé.

### 33.8 · Warteschlange abgearbeitet
* **Karton.** `.karton` — gesammelte Errungenschaften liegen jetzt als helles Papier auf
  der dunklen Seite, mit 4 px Kopfkante in der Stufenfarbe. Nicht Gesammeltes bleibt
  gestricheltes Leerfeld. `STUFEN` hat dafür einen zweiten Wert `colK` je Stufe bekommen;
  alle fünf über Kontrast 5,1 auf `#E9E2D3`. Die Enthüllung bleibt bewusst dunkel —
  heller Karton würde die Dramaturgie dort zerstören.
* **Kartenfelder.** `.zellen` — Saison/Alter/Stärke/Konto im Kopf sind ein umrandetes
  Raster mit Trennlinien, nach dem Vorbild von Block/Reihe/Platz.
* **Marken gefüllt.** `.chip.g/.a/.r` tragen jetzt Füllung statt Umriss, Text in `--bg`.
  Gemessen: 11,70 · 5,74 · 5,00.
* **Klebewinkel.** `.winkel` an zwei Ecken, mit eigener Fassung für Karton
  (`.karton.winkel` kehrt die Winkelfarbe um). Nur an der Laufbahnkarte.
* **Perforation.** `.perf` — genau eine Stelle: zwischen Saisonabschluss und
  „Angebote anderer Vereine". Häufiger eingesetzt nutzt sie sich ab.

Bündel 990 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.

### 33.9 · Kopfbänder
* `.band` — gefüllter Balken am oberen Rand einer Karte, negative Ränder ziehen ihn aus
  der Polsterung von `.pad`. Eingesetzt an der Laufbahnkarte: Stufenname links,
  Positionseinschränkung rechts, Text in `--bg`. Alle sieben Stufenfarben über
  Kontrast 5,47 gemessen.
* Die Folienleiste ist an den **unteren** Rand gewandert, sonst schneidet sie das Band.

**Wichtig zum Karton:** er erscheint ausschließlich bei *erreichten* Errungenschaften.
Gemessen: leerer Spielstand → 0 Karton, 162 Leerfelder; sieben erreicht → 7 Karton,
155 Leerfelder. Auf einem frischen Spielstand ist die Ansicht also vollständig leer —
das ist richtig so für ein Sammelheft, macht das Material aber unsichtbar, solange
nichts gesammelt wurde. `karton.html` in den Ausgaben zeigt es mit gesetzten Treffern.

### 33.10 · Spielerpass und Ruhmeshalle

**Spielerpass als Ausweis.** Vorbild sind echte Verbandspässe (DFB, FIGC, FA, RFEF).
Gemeinsame Grammatik dort: Kopfband mit Verband, Lichtbild im harten Rahmen, linierte
Felder mit Beschriftung links und Wert rechts, Passnummer, Spielrechtsdatum.
Umgesetzt mit den Bausteinen, die schon da waren:
* `.karton` — der Pass ist buchstäblich eine Karte und liegt jetzt hell auf der dunklen Seite.
  Damit ist der stärkste Baustein aus C **ab der ersten Minute sichtbar**, nicht erst nach
  der ersten Errungenschaft.
* `.band` mit `--tinte` als Füllung trägt „Spielerpass" und die Nummer.
* `.passzeile` — Beschriftung, Wert, durchgezogene Linie darunter.
* Passnummer aus `hashStr(name + "|" + avatar)`, achtstellig gruppiert. Gleicher Spieler,
  gleiche Nummer, ein Leben lang.
* Spielrecht „seit" wird aus Alter und Jahr zurückgerechnet — Laufbahnen beginnen mit 16.
* Karton-Fassungen ergänzt für `.bar`, `.zellen` und `.btn`; die Attributbalken laufen
  in `--tinte` statt `--ac`, sonst wären sie auf Papier fast unsichtbar (Kontrast 2,65).

**Ruhmeshalle als Würdigung.** Bleibt eine Rangliste, aber jeder Eintrag ist ein Block:
Rangzahl in Anzeigeschrift, Bildnis im Trikot des Vereins mit den **meisten Einsätzen**
(nicht des letzten), Vereinswappen, Kopfband in der Seltenheitsfarbe der Wildcard,
acht Kennzahlen als Kartenfelder, Stempel für den besten Lauf.

Dafür wurde der gespeicherte Datensatz erweitert: `avatar`, `g`, `natId`, `von`, `bis`,
`heimat`, `heimatSpiele`, `apps`, `assists`, `saisons`. **Einträge aus älteren Fassungen
haben das nicht.** Gegengeprüft mit vier Fällen: leer, nur alte Einträge, gemischt, ohne
Heimatverein — alle fehlerfrei, Grafiken erscheinen nur dort, wo die Daten vorliegen
(0 / 0 / 4 / 1).

Bündel 975 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.

### 33.11 · Die Rückseite des Passes
Echte Spielerpässe haben hinten die Vereinswechsel und die Stempel der Passstelle.
Genau das steht jetzt dort: Stationen mit Wappen, Zeitraum, Spielen und Toren
(aufeinanderfolgende Saisons beim selben Verein werden zu einer Station zusammengezogen),
Gesamtbilanz als Kartenfelder, Unterschriftlinie mit dem Namen, Titelstempel — oder,
wenn noch keine Titel da sind, ein Stempel mit den Länderspielen.

* `.wender / .dreh / .rueckseite` — **drei getrennte Ebenen** nach derselben Regel wie
  die Kartenenthüllung: außen die Perspektive, in der Mitte die Drehung, darin die beiden
  Seiten. Kein Element bekommt zweimal ein `transform`.
* Beide Seiten liegen im **selben Rasterfeld** (`grid-area:1/1`). Dadurch nimmt der Pass
  immer die Höhe der längeren Seite an, und keine Seite ragt heraus.
* **Doppeltippen statt `onDoubleClick`** — zwei Berührungen unter 320 ms, in einem `useRef`
  gezählt. `onDoubleClick` kommt in der WebView verzögert und verschluckt gelegentlich den
  zweiten Tipp. Enter und Leertaste wenden ebenfalls, `role="button"` und `tabIndex` sind gesetzt.
* `.rs-still .dreh` schaltet den Übergang in der Ruheschaltung ab.
* Ein Hinweis „Doppeltippen · Rückseite" steht klein am unteren Rand, sonst findet es niemand.

Gegengeprüft in jsdom: Wender vorhanden, zwei Ebenen im Dreher, Vorderseite trägt die
Passnummer, Rückseite trägt alle drei Stationen, Unterschrift und Stempel, nach dem
Doppeltipp ist die Klasse `um` gesetzt, der Dreher trägt kein eigenes `style`-transform,
kein `NaN` im Text.

Bündel 997 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.

### Browsertest als Einzeldatei
`rasenschach-browsertest.html` ist das **echte Produktionsbündel** in einer einzigen Datei:
`vite build` mit `assetsInlineLimit` hoch und `inlineDynamicImports`, danach das Skript in
die `index.html` hineinkopiert. Kein Nachladen, keine externen Stile, fünf `@font-face`
eingebettet, 979 KB.

Der Unterschied zur ausgelieferten App ist genau eine Datei: `storage.js` läuft hier auf
`localStorage` statt auf der Kapsel. Dadurch bleiben Spielstände über ein Neuladen erhalten —
nötig, um die Sammelheft-Ansichten überhaupt füllen zu können. Alle Zugriffe stecken in
`try/catch` und geben `null` zurück, wenn der Browser den Speicher sperrt (bei `file://`
und `content://` kommt das vor); die App verhält sich dann wie ohne Spielstand, stürzt aber
nicht ab.

**Warum das nützlich ist:** Chrome auf Android ist dieselbe Maschine, die Capacitor als
WebView benutzt. Was dort läuft, läuft mit hoher Wahrscheinlichkeit auch in der APK —
das ist der beste Nachweis vor einem echten Bau, insbesondere für `preserve-3d`
beim Wenden des Passes.

### 33.12 · Das Hauptmenü als Titelblatt
Das Menü ist jetzt der Umschlag einer Ausgabe, nach dem Vorbild von Stadionheft und
Sportzeitschrift:
* **Ausgabennummer** oben links im gefüllten Kasten — sie zählt die abgeschlossenen
  Laufbahnen mit. Jede beendete Karriere ist ein Heft.
* **Zeitschriftenkopf** über die volle Breite, darunter drei Schlagzeilen mit Rauten
  getrennt (vorher drei eigene Kästen weiter unten).
* **Halbtonraster**, das nach unten ausläuft — direkt vom Umschlag der Vereinszeitschrift.
* **Titelgeschichte**: läuft eine Laufbahn, steht sie als Aufmacher oben, mit Bildnis,
  Verein, Stärke und dem Knopf zum Weiterspielen. Ohne Spielstand steht dort der Einstiegstext.
* **Inhaltsverzeichnis** mit Nummer, Titel, Punktlinie und Angabe rechts — `.inhalt`.
  Vier Einträge statt vorher sieben Knöpfen.
* **Impressumsstreifen** am Fuß mit Strichcode-Attrappe. Dort steht die Fassungszeile,
  die vorher direkt unter dem Titel klebte.

### 33.12 · Optionen hinter dem Zahnrad
`.zahnrad` sitzt unauffällig oben rechts. Dahinter das Bauteil `Optionen` mit vier Feldern:
* **Darstellung** — Bewegung (RUHE) und **Textgröße** in drei Stufen. Die Stufe setzt
  `--skala` am Wurzelelement, die Grundschriftgröße rechnet mit `calc(14.5px * var(--skala,1))`.
* **Rückmeldung** — **Vibration** an/aus. Neuer Modulwert `VIBRATION`, der in `haptik()`
  vor beiden Wegen greift (Capacitor-Haptik und `navigator.vibrate`).
* **Daten** — Sicherung und **Alles zurücksetzen** mit Rückfrage. Löscht über die neue
  Liste `SPEICHERSCHLUESSEL`; wer einen Schlüssel einführt, trägt ihn dort ein.
* **Über** — Fassung, Umfang und die **Schriftlizenzen**. Die SIL OFL verlangt, dass der
  Hinweis mit der Software ausgeliefert wird; in der App gehört er hierhin.

Alle drei Einstellungen werden gespeichert und beim Start wieder angewendet.

**Nebenbei berichtigt:** Beim Wenden des Passes stand `vib(8)` — die Funktion heißt `haptik()`
und erwartet eine Art (`"tipp"`, `"wahl"`, `"gut"`, `"gross"`, `"schlecht"`), keine Zahl.
Sie fiel still auf 10 ms zurück.

**Der Prüfstand hat eine echte Regression gefangen:** Der Durchklicktest prüft, ob nach
„Zurück" wieder das Hauptmenü erscheint, und sucht dafür die Zeichenfolge
`KARRIERE-SIMULATION`. Ich hatte sie zu `Karriere-Simulation` gemacht und die Großschreibung
dem CSS überlassen — `textContent` liefert aber den Quelltext, nicht die Darstellung.
**Angepasst wurde die App, nicht der Test.**

Bündel 987 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.
Menü und Optionen zusätzlich durchgeklickt: 5 Knöpfe im Menü, Zahnrad öffnet, alle sechs
Abschnitte da, Textgröße setzt `--skala` auf 1.12, Rückweg ins Menü funktioniert.

### 33.13 · Spielweise als Voreinstellung, Anleitung, Bildschirm
**Modus aus der Erstellung heraus.** Spielweise (Karriere/Speedmodus) und Schwierigkeit
sind keine Frage mehr bei jeder Laufbahn, sondern Voreinstellungen in den Optionen.
Neue Modulwerte `SPEEDMODUS` und `SCHWIERIGKEIT` nach demselben Muster wie `RUHE`.
`CreateScreen` **zeigt** nur noch an, womit gespielt wird — die beiden Auswahlgitter
(zwei plus drei Knöpfe) sind ersetzt durch zwei Kartenfelder plus Hinweis.
Läuft gerade eine Laufbahn, sagen die Optionen ausdrücklich, dass sie behält,
womit sie gestartet ist.

**Kurzanleitung.** Fünf Abschnitte in `ANLEITUNG`, gerendert vom Bauteil `Kurzanleitung`:
Ablauf, Werte, Wildcards, nach dem Ende, Gut zu wissen. Erreichbar über die Optionen
unter „Über". Bewusst knapp gehalten — wer nachschlägt, sucht eine Antwort.

**Bildschirm anlassen.** `navigator.wakeLock` als reine Netzschnittstelle, **kein
zusätzliches Kapsel-Erweiterungsmodul** — dadurch keine Änderung am Bau. Zwei Feinheiten:
* Android gibt die Sperre frei, sobald die App in den Hintergrund geht. Ein Zuhörer auf
  `visibilitychange` fordert sie beim Zurückkommen neu an.
* Geräte ohne die Schnittstelle bekommen den Schalter gesperrt und ausgegraut statt eines
  Knopfes, der nichts tut. `wachMoeglich()` entscheidet das.

Bündel 993 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.
Zusätzlich durchgeklickt: alle sieben Abschnitte der Optionen da, Speedmodus und
Knochenmühle lassen sich wählen und werden markiert, Bildschirmschalter in jsdom
erwartungsgemäß gesperrt, alle fünf Abschnitte der Anleitung da, **0 Auswahlknöpfe für
den Modus in der Erstellung übrig**.

### Baudateien im Projektwissen — und ein still übersprungener Prüfschritt
Seit Fassung 33.13 liegen auch die Baudateien im Projektwissen: `package.json`,
`vite.config.js`, `index.html`, `main.jsx`, `storage.js`, `capacitor.config.json`,
`apk.yml`, `.gitignore`. Im Repository liegen sie **flach neben `App.jsx`**, nicht in
einem `src`-Ordner; `apk.yml` gehört nach `.github/workflows/`.

**Der Produktionsbau lief nie.** `pruefen.sh` setzte `ARBEIT` fest auf `/home/claude/rs`
statt auf das Verzeichnis der übergebenen `App.jsx`. Dort lagen nie `package.json` und
`main.jsx`, also meldete der Schritt jedes Mal „übersprungen" — eine Zeile in einer langen
Ausgabe, die niemand las. Jetzt folgt `ARBEIT` der Quelle. Gegengeprüft: ohne jede
Umgebungsangabe baut der Prüfstand jetzt von selbst.

**Was der echte Bau zeigt:** 1.022 kB gegenüber 997 kB in der Rekonstruktion. Der
Unterschied ist `@capacitor/preferences`, das über die echte `storage.js` hineinkommt.
Alle bisherigen Bauprüfungen liefen gegen eine selbstgeschriebene Konfiguration und
haben diesen Teil nie gesehen.

**Zwei Dinge nachgezogen:**
* `index.html` trug in `theme-color` und im Grundhintergrund noch `#04050A` — das
  Marineblau aus der Zeit vor 33.6. Jetzt `#070D0A` wie `--bg`. Weichen die beiden ab,
  blitzt beim Start kurz die falsche Farbe auf.
* `apk.yml` zählt im Schritt „Ergebnis der Weboberflaeche pruefen" jetzt die
  `@font-face`-Regeln im Bündel und bricht bei weniger als fünf ab. Ebenso, wenn das
  Bündel `fonts.googleapis` enthält. **Damit kann der Fehler aus 33.3 — Schriften benannt,
  aber nicht mitgeliefert — nie wieder unbemerkt durchgehen.**

### 33.14 · Ehrentafel als Karton
Die Absolventen standen als schmale dunkle Zeilen untereinander — Fahne, Name,
eine Zahl rechts. Jetzt ist jeder Eintrag ein Schild an der Wand:
* `.karton` — helles Papier auf der dunklen Seite, dazu `.klebe` als harter
  Versatzschatten. Damit ist C nach Spielerpass und Errungenschaften an der
  dritten Stelle angekommen.
* **`.band` je Rang** mit laufender Nummer (001, 002 …) rechts. Drei Ränge,
  und zwar mit **denselben Schwellen, mit denen `akaJahr` die Bilanz führt**
  (85 = Weltklasse, Auswahl über `ns`) — sonst stünde auf der Tafel eine andere
  Ordnung als in den Zahlen darüber. Neu: `ABS_RANG` und `absRang()`.
* `.zellen` für Stärke, Abgang und Auswahl.
* `.stempel` „Bester" beim ersten Eintrag, **ab drei Einträgen** — dieselbe
  Regel wie in der Ruhmeshalle.
* **Bewusst ohne `winkel()`.** Die Schräglage gehört ins Sammelheft; ein Schild
  an der Wand hängt gerade. Der Prüfstand zählt das mit und schlägt an, wenn
  doch ein `rotate` auftaucht.

Kontraste gemessen (alle über 4,5): Kopfband Weltklasse 11,70 · Nationalspieler
5,74 · Profi (`.band.matt`) 10,52. Auf dem Karton: Name 13,95 · Nebentext 5,31 ·
Stärke Weltklasse (`--go-k`) 5,16 · Stärke Auswahl (`--ac-k`) 5,97.

**Der Prüfstand hat beim ersten Anlauf zugeschlagen:** `zahlenPruefen` sucht zu
jeder Beschriftung das **Geschwisterelement**. `<span class="eb">Abgang</span>{x.raus}`
setzt aber einen reinen Textknoten daneben — die Prüfung fand keine Zahl. Der
Wert steht jetzt in einem eigenen `<span>`. Angepasst wurde die App, nicht der Test.
Dieselbe Stelle in der Ruhmeshalle trägt denselben Fehler noch; dort greift die
Prüfung bisher nicht.

Prüfstand: **157 Prüfungen** (vorher 138, also 19 neue), 6× 63 Ansichten, alle
Zielbänder, 0 Fehler. Bündel **1.023,58 kB** (vorher 1.022,34 — Zuwachs 1,24 kB).

### 33.14 · App-Symbol aus einer gerahmten Vorlage
Die neue Vorlage (1254 × 1254) hatte einen schwarzen Rand, darin einen hellen
Ring und **abgerundete Ecken**. Genau der Fall, vor dem `appicon.py` warnt: eine
zweite Rundung unter der Maske von Android.

Aufbereitet wurde das Bild **einmalig** zu einem randlosen `symbol/appicon.png`
(1024 × 1024). Der Weg, falls es wieder gebraucht wird:
1. Helle Bildpunkte (Summe RGB > 380) markieren; das größte zusammenhängende
   helle Gebiet **ist** der Ring (gemessen: 40.593 Punkte, Ausdehnung 1235 × 1229).
2. Das dunkle Gebiet, in dem die Bildecke (0,0) liegt, ist der schwarze Rand
   (74.512 Punkte). Alles, was weder Ring noch Rand ist, ist der Bildinhalt.
3. Größtes Quadrat darin: 1206 × 1206, also **1,9 % je Seite** entfernt.
4. Die abgerundeten Ecken und der dunkle Saum darunter (zusammen 9,1 % der
   Fläche) werden durch die **unscharfe Vergrößerung des Bildes selbst**
   ersetzt — dieselbe Technik, mit der `appicon.py` den Außenrand auffüllt.
   Kein Fremdmaterial.

**Geändert an `appicon.py`:** `vordergrund()` lässt die Kante jetzt weich
auslaufen (Saum 4 % der Innenkante). Vorher stand das scharfe Bild als hartes
Rechteck auf der unscharfen Auffüllung — unter einer runden Maske sah man ein
Quadrat im Kreis. Volle Deckung bleibt innerhalb der sicheren Fläche von 66/108.

**`apk.yml` übergibt jetzt ausdrücklich `0` als Rahmenbreite.** Das Bild im
Projekt ist bereits randlos; die automatische Erkennung soll dort nicht raten.
Wer wieder ein gerahmtes Bild einsetzt, streicht die `0` und lässt erkennen.

Unter allen drei Masken (Kreis, Squircle, Quadrat) steht der Schriftzug
vollständig. **Bei 48 dp ist er nicht mehr lesbar** — das ist der Preis einer
vollflächigen Illustration als Symbol. Wer Lesbarkeit will, braucht ein
reduziertes Zeichen (Ball und XI), keine Szene.

## Auf dem Gerät geprüft — 10.8.2026

Kevin hat den Browsertest 33.14 in Chrome auf dem Handy gefahren. Ergebnis:

* **Der Pass wendet sauber**, die Rückseite scheint nicht durch. Damit ist
  `preserve-3d` mit den drei getrennten Ebenen (Perspektive · Drehung · Seiten)
  auf der echten WebView bestätigt — bis dahin war es nur in jsdom geprüft, und
  jsdom hat kein 3D.
* **„Bildschirm anlassen" greift.** `navigator.wakeLock` als reine
  Netzschnittstelle reicht, es braucht kein Kapsel-Erweiterungsmodul.
* **Das Impressum zeigt „Fassung 33.14" ohne „SCHRIFT FEHLT".** Anton und
  Archivo kommen also wirklich auf dem Gerät an. Das ist die einzige Prüfung,
  die den Fehler aus 33.3 endgültig ausschließt — im Prüfstand ist sie
  strukturell unmöglich, weil jsdom kein `getContext` hat.
* **Kein Ruckeln** beim Durchscrollen der 162 Errungenschaften.

**Was dabei nicht gemessen wurde:** Zahlen aus dem Messwerkzeug liegen nicht vor,
und die drei A/B-Schalter wurden nicht einzeln durchgefahren. Der Befund ist
„nichts zu sehen", nicht „gemessen und für gut befunden". Für die Frage, ob das
Halbtonraster bezahlbar ist, reicht das: es gab nichts zuzuordnen. Sollte auf
einem schwächeren Gerät doch etwas auffallen, liegt das Werkzeug bereit.

### 33.15 · Zwei Formen statt zweier Farbleitern
Die zwei Restüberschneidungen sind **nicht** durch Farbverschieben erledigt worden,
sondern durch eine Unterscheidung, die keine Farbe braucht:

> **Was man sich erspielt hat, ist ein gefüllter Block.
> Was einem zugefallen ist, trägt nur einen Umriss.**

Errungenschaftsstufe und Absolventenrang sind erspielt — gefüllt. Die Seltenheit
der Wildcard ist gezogen — umrandet. Damit unterscheidet die **Form**, und eine
Überschneidung im Farbraum ist folgenlos.

**Warum die alte Messung nichts taugte.** Die Schwelle 60 war nicht nur willkürlich
gesetzt, sie stand auf dem falschen Maß: gemessen wurde der **euklidische Abstand im
RGB-Raum** (Skala 0–441). Der hat mit dem Sehen nichts zu tun. Nachgerechnet in
ΔE76 (CIE-Lab) sieht die Lage anders aus:

| Paar | RGB-Abstand (alt) | ΔE76 (perzeptuell) |
|---|---|---|
| `aussen` gegen Stufe Platin | 58 | **34,2** |
| `hsv` gegen `--tx` | 46 | **18,8** |
| `RARITY.normal` gegen `--mu` | 21 | **4,6** ← stand nie auf der Liste |

`hsv` gegen `--tx` sah nach RGB mittelmäßig aus und ist perzeptuell einer der engsten
Fälle überhaupt. Und `RARITY.normal` gegen `--mu` bei ΔE 4,6 ist praktisch dieselbe
Farbe — das ist nie aufgefallen, weil das falsche Maß es nicht zeigte. **Sind alle drei
jetzt egal?** Ladder gegen Ladder ja, weil die Form trennt. Farbe gegen Bedeutungsfarbe
(`--mu`, `--tx`) bleibt eine offene Frage — dafür trennt die Form nicht, denn beide sind
Text. Steht als offener Punkt.

**Geändert (vier Zeichenstellen, zwei Regeln):**
* `.band.umriss` — Band ohne Füllung, nur eine 2-px-Linie darunter in der Seltenheitsfarbe.
  Eingesetzt an der **Wildcard-Karte** und in der **Ruhmeshalle**. Die Karte trägt den
  Rahmen jetzt mit 2 px statt 1 px, damit der Umriss die Farbe wirklich hält.
  **→ In 33.16 wieder zurückgenommen, siehe unten.**
* `.stufe` / `.stufe.punkt` — gefüllter Block. Im **Errungenschaftsgitter** trägt die
  erreichte Karte den Stufennamen als gefüllte Marke in `colK` (Text `--karton`), die
  **Filterknöpfe** und die Liste am **Karriereende** bekommen einen gefüllten Punkt in `col`.
* Der Verlauf auf der Wildcard-Karte bleibt: 12 % Deckung sind ein Hauch, kein Block.
* **Die Enthüllung bleibt unberührt.** Dort tritt die Seltenheit als Einzige auf, bildfüllend,
  und die Dramaturgie lebt von Fläche. Wo nichts zu verwechseln ist, braucht es keine
  Unterscheidung. Das ist eine bewusste Ausnahme, keine Lücke.

Kontraste gemessen: gefüllte Stufenmarke (`--karton` auf `colK`) 5,16 bis 6,48 · Stufenpunkt
auf `--pan` 4,51 bis 15,22 · Seltenheit als Umriss und Beschriftung auf `--pan` 5,25 bis 13,37.
Alle über der Schwelle.

Prüfstand: **173 Prüfungen** (vorher 157, also 16 neue), 6× 63 Ansichten, alle Zielbänder,
0 Fehler. Bündel **1.024,64 kB** (vorher 1.023,58 — Zuwachs 1,06 kB).

### 33.15 · Der Prüfstand hat grün gemeldet, obwohl der Aufbau gescheitert war
Beim Einbauen habe ich einen Kommentaranfang in `ansichten.jsx` zerstört. esbuild brach
ab — und der Prüfstand **lief weiter** und meldete „157 Prüfungen bestanden, 0 Fehler".
Denn `a.js` aus dem vorigen Lauf lag noch da. Nur der Rückgabewert verriet es.

`pruefen.sh` bricht jetzt nach einem gescheiterten Aufbau ab, mit Begründung, statt ein
altes Bündel zu prüfen. **Gegengeprobt** mit absichtlich kaputtem Prüfskript: Rückgabewert 1,
Meldung „ABBRUCH", keine Prüfzahlen. Das war die gefährlichste Sorte Fehler — grüne Wiese
über kaputtem Code.

### 33.16 · Der Umriss ist wieder raus
Kevin am Gerät: die Wildcard-Karte gefiel ihm vor der Änderung besser. **Zurückgebaut**,
und zwar vollständig — `WildcardCard` ist Zeichen für Zeichen wieder die aus 33.14
(gegengeprüft gegen die ausgelieferte Datei). Die Ruhmeshalle geht mit: dieselbe Sache
darf nicht an zwei Orten zweierlei aussehen. `.band.umriss` ist als tote Regel entfernt.

**Was das kostet, offen gesagt:** die Unterscheidung ruht jetzt nicht mehr auf
*gefüllt gegen umrandet*, sondern auf **Breite und Ort** — die Seltenheit als Band über
die volle Kartenbreite, die Errungenschaftsstufe als kompakte Marke mitten im Text.
Das ist schwächer als der Umriss, aber es ist keine Farbunterscheidung, und die beiden
Formen treffen ohnehin nur am Karriereende in einer Ansicht aufeinander. Der gemessene
Abstand `aussen` gegen Platin bleibt bei ΔE 34,2 — die Farben sind unverändert.

**Behalten aus 33.15:** die gefüllte Stufenmarke im Errungenschaftsgitter, die
Filterpunkte und die Marke am Karriereende. Daran gab es nichts auszusetzen, und sie
sind für sich genommen besser als der dünne farbige Text davor.

**Für den nächsten Anlauf:** einen Umriss für die Seltenheit nicht erneut vorschlagen,
ohne zu bedenken, dass er der Wildcard-Karte den Auftritt nimmt. Der Hinweis steht auch
als Kommentar an der CSS-Regel. Wer die Trennung härter will, sollte am *Ort* ansetzen,
nicht an der Füllung.

Prüfstand: **180 Prüfungen** (vorher 173), 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Der Prüfblock prüft jetzt die Gegenrichtung mit: die Seltenheit darf nie als kompakte
Marke erscheinen, die Stufe nie als Band über die volle Breite.

## 34.0 · Die Spielerporträts

### Der Fehler, der jahrelang stand
Alle Merkmale steckten in **einer** Zahl, ausgelesen mit `(h >> bit) % n`. Das ist
**kein abgetrenntes Feld**: `h >> bit` enthält *alle* höheren Bits, und ein Zuschlag
von `2^bit` trägt in jedes höhere Merkmal hinein. Deshalb würfelte die Feineinstellung
das halbe Gesicht neu. An 400 Proben nachgerechnet, ein Druck auf ›:

| Regler | änderte tatsächlich |
|---|---|
| Schmuck | 8,0 von 13 Merkmalen |
| Kinn | 7,0 von 13 |
| Ohren | 6,0 von 13 |
| Nase | 5,0 von 13 |
| Bart | 4,0 von 13 |
| Frisur | 2,9 von 13 |
| Hautton | 1,2 von 13 |

**Nicht gepflastert, sondern unmöglich gemacht:** die Merkmale liegen als eigenes
Objekt `zuege` vor, jedes zieht über `mische(kennung, i)` einen **eigenen**
Zufallsstrom. Überlappung kann es dort nicht geben. Gemessen nach dem Umbau:
**3.120 Reglerdrücke, Mittel 1,00 geänderte Merkmale, Höchstwert 1.**
Der Prüfstand schlägt außerdem an, wenn ein Regler *gar nichts* tut — ein
wirkungsloser Regler ist so falsch wie ein zu wirksamer.

### Zwei Fehler, die beim Hinsehen auffielen
* **Die Augenfarbe wurde berechnet und nie gezeichnet.** `eyeC` stand im Code, die
  Augen waren aber immer `#2A2118`. Der Regler „Augen" hat sichtbar nichts getan.
  Jetzt trägt die Iris die Farbe; geprüft wird, dass **alle** Augenfarben im Bild
  nachweisbar sind (7 von 7).
* **Vier Frisuren zeichneten außerhalb des Kopfes** — Zöpfe, Igel, Rasurmuster und
  Undercut schwebten als Zacken und Balken über dem Schädel. Ursache: kein Beschnitt.
  Es gibt jetzt eine Haarkappe als eigenen Pfad und einen `clipPath` darauf.

### Was es jetzt gibt
5 Kopfformen · 16 Frisuren · 10 Bartformen · 7 Augenfarben · 5 Augenformen ·
5 Augenbrauen · 5 Nasen · 5 Münder · 3 Ohrgrößen · 3 Wangen-/Kinnvarianten ·
6 Schmuckstücke. **57 gezeichnete Auswahlmöglichkeiten allein in den acht
Formmerkmalen.** Der Prüfstand zählt nach, dass jede davon auch etwas zeichnet —
ein Wert ohne Bild wäre eine Auswahl, die es nur auf dem Papier gibt.

Zeichnerisch: Augen mit Lidspalt, Iris, Pupille und Glanz statt weißer Ellipse mit
Punkt · Flächenschatten an Wange und Hals · Nase und Mund neu · Trikot mit
Schulterschatten · Grund von Marineblau `#0B0E15` auf **Rasen bei Nacht** `#0B120E`,
damit das Porträt zum Farbkonzept gehört und nicht daneben steht. Keine Verläufe,
nur flache Tonstufen — dieselbe Sprache wie der Rest.

### Ohne Augen geht Grafik nicht
Neu: `pruefstand/portraetbogen.cjs`. Rendert echte `<Avatar>`-Ausgaben als SVG-Tafel,
in drei Betriebsarten: Zufallsbogen, Musterbogen je Merkmal, Großansicht einzelner
Werte. In PNG wandeln mit cairosvg. **Ohne dieses Werkzeug wären fünf sichtbare
Mängel unentdeckt geblieben**, die kein Prüfskript findet: eine harte Naht mitten im
Gesicht (Schatten lief bis zur Mitte), eine zu lange dunkle Nase, ein offener Mund als
schwarzes Loch, ein unsichtbarer Kinnriemen und ein Schnauzer, der auf dem Mund saß.
Jede dieser Nachbesserungen ist gegen einen neu gerenderten Bogen geprüft worden.

### Was das kostet
**Alte Spielstände tragen nur die Kennung. Ihre Gesichter sehen nach diesem Umbau
ANDERS aus als vorher.** Bei einer Neuzeichnung aller Teile ließe sich das ohnehin
nicht vermeiden. Der Spielstand bleibt gültig, die Rückwärtsprüfung läuft durch.
Neue Laufbahnen speichern die Merkmale ausdrücklich (`p.zuege`), auch in der
Ruhmeshalle — die bleiben dann über jede weitere Fassung stabil.

**`ZUEGE_ORDNUNG` NIE umsortieren.** Die Reihenfolge ist die Nummer im Mischstrom;
eine Umsortierung ändert jedes bestehende Gesicht. Neues immer hinten anhängen.

### 34.1 · Angeheftete Vorschau, und sechs Sitzfehler behoben
**Die Vorschau in der Spielererstellung bleibt beim Blättern oben hängen**
(`position:sticky`, `top:0`, deckender Grund, `zIndex:5`). Vorher stellte man
unten Feinheiten ein und sah oben nicht, was sie bewirken — dasselbe beim Verein
(Trikotfarben) und beim Namen. `.tbar` gibt es nur im Spielbildschirm, `top:0` war
hier also frei. Der Prüfstand zählt nach: genau ein angehefteter Block, Porträt
darin, deckender Grund.

**Sechs Fehler im Sitz der Teile**, gefunden mit einem neuen **Kreuzbogen**
(`portraetbogen.cjs kreuz`) — jede Ausprägung über *jeder* Kopfform. Im
Zufallsbogen fallen solche Fälle kaum auf, im Kreuz sofort:

| Teil | war | ist |
|---|---|---|
| Undercut | helle Flächen mitten im Haar, schwebende Insel | rasierte Seite bis zur Haarkante |
| Zöpfe | Striche endeten auf halber Höhe (Strichcode-Kante), Zöpfe standen seitlich heraus | laufen am Haaransatz aus, innerhalb der Kopfbreite |
| Rasurmuster | dieselbe harte Querkante | läuft aus |
| Vokuhila | verdeckte die Ohren, sah aus wie ein Bob | Ohren liegen darüber — langes Haar gehört dahinter |
| Kinnbart und Ziegenbart | klebten am Mund, lasen sich als offener Mund | 3,5 Einheiten tiefer, klar getrennt |
| Koteletten | lagen auf den Ohren, dann als angeklemmte Balken davor | verjüngen sich nach unten, setzen am Haaransatz an |

Jede Berichtigung ist gegen einen neu gerenderten Kreuzbogen geprüft, nicht gegen
eine Vermutung.

### 34.2 · Zwei echte Fehler
**Die App liess sich zoomen wie eine Internetseite.** Die Angabe im `<meta name="viewport">`
hatte weder `maximum-scale` noch `user-scalable=no`; mit zwei Fingern liess sich jede
Ansicht aufziehen. Kevin ist es in den Optionen aufgefallen, betroffen war die **ganze App**.
Behoben in `index.html`: `maximum-scale=1,user-scalable=no` und zusätzlich
`touch-action: pan-x pan-y` auf `html` und `body` — Wischen ja, Aufziehen und
Doppeltipp-Zoom nein. Letzteres nimmt dem Spielerpass nebenbei die Verzögerung
beim Wenden.

*Zur Barrierefreiheit:* Zoom zu sperren ist normalerweise heikel. Hier nicht, weil die
App unter „Optionen" eine **eigene Textgrösse** mitbringt — der Weg bleibt also offen,
er führt nur nicht mehr über die Browserlupe.

**Der Ausbau der Akademie begann bei 17 %.** Jede Abteilung startet auf Stufe 1, also war
`akaSumme` direkt nach der Gründung 6 von 36 — der Ring zeigte Fortschritt, wo noch nichts
gebaut war. Fortschritt heisst jetzt: was **über die Gründung hinaus** erreicht wurde.
Neu: `AKA_GRUND` (6), `AKA_STUFEN` (30 wirklich baubare Stufen), `akaAusbau(a)`.
`akaSumme` bleibt unverändert, weil die Errungenschaft „voller Ausbau" darauf prüft —
der Prüfstand hält beides getrennt fest: **frisch gegründet 0 von 30 · nach 25 Jahren
30 von 30 · `akaSumme` bei vollem Ausbau weiterhin 36.**

**Zum dritten Mal derselbe eigene Fehler:** Ich habe einen Kommentaranfang in
`ansichten.jsx` als Ankertext für eine Ersetzung benutzt und ihn dabei verschluckt.
esbuild brach ab, der Prüfstand meldete korrekt ABBRUCH. **Regel für künftige Sitzungen:
niemals `/* ---------- Überschrift ----------` als Anker verwenden** — immer eine
Codezeile darunter nehmen, oder den Anker mit einschliessen und wieder mit ausgeben.

## 34.3 · Die App wird ein Heft (Schritt 1 von 3)

Beschlossen ist Weg **A, die Nachtausgabe**: der Grund bleibt dunkel, die Zeitung
wird über Papier, Typografie und Seitenmöbel erzählt. Die Sammelkarten (Wildcard,
Spielerpass, Ruhmeshalle, Errungenschaften) bleiben unangetastet — sie sind das
Eingeklebte auf der Seite.

Zur Entscheidung Papier: **Zeitungspapier, nicht Magazinpapier.** Ungestrichen,
sichtbare Faser, matt — das ist der *kicker*: Zeitungspapier innen, festerer Titel
aussen. Magazinpapier wäre glatt und glänzend, und Glanz liesse sich auf dunklem
Grund nur über einen Verlauf erzählen; Verläufe sind seit 33.4 abgeschafft.

### Das Papier
`--bg` von `#070D0A` (Rasen bei Nacht) auf **`#191813`** (dunkles Zeitungspapier).
**Warm**, weil der Karton der Sammelkarten warm ist (`#E9E2D3`) — dasselbe Papier,
nur im Dunkeln. Damit liegen die Karten *auf* der Seite statt daneben.

Struktur: `repeating-linear-gradient(97deg,…)` als Faser plus das bekannte
Halbtonraster. **Bewusst zwei Lagen und eine Vollfarbe — genau so viele wie vorher**,
weil der frühere Grundverlauf durch die Vollfarbe ersetzt ist. Der Zeichenaufwand
steigt also nicht; die Rasterfrage aus 33.13 bleibt damit beantwortet.

Alle Token neu gemessen gegen `#191813`:

| Token | Wert | Kontrast |
|---|---|---|
| `--tx` | `#EFECE2` | 15,04 |
| `--mu` | `#A09B8C` | 6,40 |
| `--go` | `#F2C230` | 10,61 |
| `--ok` | `#3DA35D` | 5,58 |
| `--ac` | `#3D8FDB` | 5,21 |
| `--bad` | `#EC6152` | 5,68 *(von `#E5493C` angehoben, lag auf `--up` bei 4,04)* |
| `--ln2` | `#625C49` | Haarlinie, *(von `#2C3A31` angehoben — im Entwurf lag sie bei 1,54 und wäre auf dem Gerät verschwunden)* |
| Karton auf Papier | `#E9E2D3` | 13,78 |

Neu: `--stoerer` `#D93A2B` für den Störer auf dem Titelblatt. **Nur als Fläche,
nie als Text** — auf Papier liegt er bei 3,89, Weiss darauf bei 4,57.

### Die Seitenmöbel
`Shell` nimmt jetzt `blatt="<ressort>"` und setzt damit **Kolumnentitel** oben und
**Folio** unten. Neu: `RESSORT`, `Kolumnentitel`, `Folio`.

| Ressort | Seite |
|---|---|
| LAUFBAHN | 2 |
| SPIELERPASS | 3 |
| RUHMESHALLE | 14 |
| ERRUNGENSCHAFTEN | 22 |
| JUGENDAKADEMIE | 30 |
| REDAKTION (Optionen, Anleitung) | 46 |
| ARCHIV (Sicherung) | 48 |

**Die Seitenzahl steht nur an einer Stelle im Code.** Kolumnentitel, Folio und
später das Inhaltsverzeichnis auf dem Titelblatt lesen dieselbe Zahl — stünde oben
14 und unten 22, wäre das Heft in dem Moment nicht mehr glaubwürdig. Der Prüfstand
zählt beides nach und prüft ausserdem, dass keine zwei Ressorts dieselbe Seite haben.

### Ein Prüfmittel, das falschen Alarm schlug
Die erste Fassung der Prüfung suchte mit `new RegExp("Seite " + s + "\\b")`. esbuild
schrieb daraus `"\\b"` ins Bündel — also **Backslash + b als Zeichen** statt einer
Wortgrenze. Die Prüfung meldete „Seitenzahl steht nirgends", obwohl sie im Baum stand.
Ersetzt durch ein schlichtes `includes`. **Ein Prüfmittel, das falschen Alarm schlägt,
ist schlimmer als keins** — es hätte mich beinahe eine funktionierende Änderung
zurückbauen lassen.

Prüfstand: **270 Prüfungen** (vorher 261), 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.035,53 kB** (vorher 1.033,34).

### Was noch fehlt (Schritt 2 und 3)
* **Das Umblättern** zwischen Titelblatt und Ressorts.
* **Das Titelblatt** als Zeitschriftencover: Titelzug, Aufmacher mit dem eigenen
  Spieler statt Flutlicht und Mittelkreis, Störer, Inhaltsverzeichnis mit Seitenzahlen,
  Strichcodeleiste. Der Entwurf dazu liegt vor und ist abgenommen.
* **Die Texte reisserischer**: Dach- und Unterzeilen sollen klingen wie ein
  Sportblatt, nicht wie ein Katalog. Nicht „Zwölf Laufbahnen, gemessen an Titeln,
  Toren und Treue", sondern „Diese Zwölf vergisst keiner mehr".

### 34.4 · Korn statt Cord, und die Seiten blättern
**Die Faser war auf dem Gerät eine Cordhose.** Im verkleinerten Entwurfsbild sah die
schräge Linienschraffur wie Papier aus, auf dem Handy nicht. Nachgerechnet:

* Der Entwurf zeichnete eine 0,5 Punkte breite Linie alle 3 Punkte — **17 % der Fläche**.
  Die App zeichnete eine 1 Punkt breite Linie alle 3 Punkte — **33 %, also doppelt so viel**.
* Dazu die Bildpunktdichte: bei dreifacher Dichte sind 3 CSS-Punkte **neun echte
  Bildpunkte**. Der Streifen wird auf dem Gerät nicht feiner, sondern gröber
  wahrgenommen als im Bild, das im Chat verkleinert dalag und dabei verschmolz.

Jetzt **zwei Punktraster mit den teilerfremden Abständen 2 und 5**. Ihre Gitter
überlagern sich erst nach 10 Punkten wieder, das liest sich als Korn statt als Muster.
Gegengeprüft an einem Bild **in echter Gerätedichte** — drei Varianten nebeneinander,
in Bildpunkten des S24 Ultra gerechnet, nicht in CSS-Punkten. Die Lehre daraus gehört
in jede künftige Sitzung: **ein verkleinertes Entwurfsbild lügt über feine Strukturen.**

### Das Umblättern
Die ankommende Seite dreht um ihre Bundkante herein (`rotateY(-74deg)` → `0`, 420 ms).
**Bewusst nur die ankommende.** Die abgehende mitzudrehen hiesse, ihren React-Baum
nach dem Wechsel weiterleben zu lassen — mit veraltetem Zustand und doppelt laufenden
Wirkungen. Der Gewinn wäre klein, das Risiko gross.

**Die Richtung folgt den Seitenzahlen.** Von Seite 2 auf 14 wird vorwärts geblättert,
von 30 auf 22 zurück. Dafür braucht es keine zusätzliche Verdrahtung: `letzteSeite`
steht ausserhalb der Komponente, `Shell` vergleicht beim Aufbau. Der Prüfstand fährt
vier Wechsel durch und prüft die Klasse am Blatt, nicht die Absicht.

`RUHE` schaltet es ab.

**Noch nicht gemessen:** wie teuer das Drehen einer sehr langen Seite ist. Die
Errungenschaften mit 162 Feldern sind der Härtefall — dort wird eine grosse Fläche
für 420 ms zur eigenen Ebene. Das gehört auf dem Gerät nachgesehen, mit dem
Messwerkzeug im Browsertest.

Prüfstand: **278 Prüfungen** (vorher 270), 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.037,33 kB**.

### 34.5 · Echtes Korn, und das Blättern wird Papier
**Zwei Versuche am Papier waren falsch, aus demselben Grund.** Erst eine schräge
Linienschraffur — auf dem Gerät Cord statt Faser. Dann zwei Punktraster mit
teilerfremdem Abstand — gleichmässiger als gedacht, es las sich als Punkte *auf*
dem Papier. Die Ursache ist beide Male dieselbe: **mit Verläufen lassen sich nur
regelmässige Muster bauen, und Papier ist nicht regelmässig.**

Jetzt eine **96 × 96 grosse Kachel aus echtem Rauschen**, im Projekt als Base64
eingebettet (5,9 KB). Nahtlos, weil sie mit Umlauf weichgezeichnet wurde; zwei
Korngrössen übereinander, und **nur abdunkelnd** — Aufhellungen sähen aus wie Staub.
`feTurbulence` wäre kleiner gewesen, liess sich hier aber nicht rendern und damit
nicht beurteilen; etwas einzubauen, das ich nicht ansehen kann, verbietet sich.

**Das Halbtonraster ist vom Grund verschwunden.** Ein Raster ist die Art, wie ein
BILD gedruckt wird, nicht die Oberfläche des Papiers. Es bleibt den Bildflächen
vorbehalten (Titelblatt, `.raster`). Der Grund kommt jetzt mit **einer** Bildlage
und einer Vollfarbe aus — eine Lage weniger als vorher, der Zeichenaufwand sinkt.

### Das Blättern
* **420 ms → 780 ms.** Vorher nahm man es kaum als Blättern wahr.
* **Nachfedern:** die Seite dreht bis 3,4° über die Ruhelage hinaus und legt sich
  dann. Eine Drehung, die exakt bei 0 stehen bleibt, wirkt nach Platte.
* **Wandernder Bundschatten** über `::before` — er macht aus der starren Drehung
  eine Wölbung. Das war der eigentliche Grund für den Plastikeindruck.
* Eine leichte Drehung um die Blattachse (`rotateZ`) nimmt der Bewegung die
  Maschinenhaftigkeit.

Prüfstand: 278 Prüfungen, 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.046,41 kB** (vorher 1.037,33 — die 9 KB sind die Kornkachel).

**Weiterhin nicht gemessen:** wie teuer das Drehen einer sehr langen Seite ist.
Die Errungenschaften mit 162 Feldern sind der Härtefall.

### 34.6 · Das Umblättern ist wieder raus
Zwei Befunde vom Gerät, beide mit derselben Wurzel — **es wurde die ganze Seite
gedreht:**

1. **Es hakte**, statt in einem Zug zu laufen. Eine Seite mit 162 Feldern ist mehrere
   tausend Punkte hoch; der Browser muss daraus für die Dauer der Bewegung eine eigene
   Ebene rastern. Das schafft er nicht in einem Zug.
2. **Auf langen Seiten verzerrte das ganze Bild.** Das ist keine Panne, sondern
   Geometrie: perspective staucht mit wachsendem Abstand vom Drehpunkt. Bei einer
   Seite, die zehnmal so hoch ist wie das Fenster, wird das untere Ende unbrauchbar
   verzogen.

Nachjustieren hätte nichts geholfen — die Ursache ist die Bauart, nicht die Dauer.
Entfernt, der Wechsel läuft wieder schlicht. Der Befund steht als Kommentar an der
Stelle im Quelltext.

**Wer es später noch einmal versucht, muss zuerst etwas anderes bauen:** eine Seite,
die genau so hoch ist wie das Fenster und INNEN rollt (height:100dvh, overflow-y:auto).
Nur ein fensterhohes Blatt lässt sich wie ein Blatt drehen. Das ist ein Umbau jeder
Ansicht — mit Folgen für die angeheftete Kopfleiste, die Rollposition beim
Zurückblättern und die Wachsperre. **Erst dieser Umbau, dann das Blättern.**

Die Prüfung der Blätterrichtung ist mit entfallen. Sie war grün — die Richtung
stimmte. Falsch war nicht die Richtung, sondern die Idee. **Eine grüne Prüfung ist
kein Beweis für eine gute Lösung.**

### 34.6 · Das Hauptmenü ist ein Titelblatt
Flutlicht und Mittelkreis sind weg. Stattdessen:

* **Titelzug** in einem Balken aus `--stoerer`, mit Ausgabennummer und Monat — auf
  jeder Ausgabe an derselben Stelle.
* **RASENSCHACH** gross, darunter XI und die Zeile „DIE ELF DES MONATS · SEIT 2026",
  abgeschlossen mit der doppelten Haarlinie.
* **Der Aufmacher ist der eigene Spieler**, 230 px, im Halbtonraster. Vorher stand
  dort ein Bild ohne Person. Auf einem Sportheft ist der Titel immer jemand. Ohne
  Spielstand steht dort „HIER KÖNNTE DEIN NAME STEHEN".
* **Störer** oben rechts: rund, schräg, in Signalrot, mit hartem Versatzschatten —
  die Hauptaktion („WEITER SPIELEN" oder „NEUE LAUFBAHN", mit Seitenangabe).
* **Dachzeile, Schlagzeile, Unterzeile** aus `titelgeschichte()`. Vier Fälle mit
  eigenen Zeilen: laufende Laufbahn (nochmals unterteilt nach Weltklasse, jung, alt),
  gefüllte Ruhmeshalle, gegründete Akademie, leerer Anfang. **Der Ton ist Kiosk, nicht
  Katalog** — „SIE NENNEN IHN JETZT NUR NOCH DEN BESTEN" statt einer Zustandsmeldung.
  Die Umbrüche in den Schlagzeilen sind gesetzt (`whiteSpace:pre-line`): eine
  Schlagzeile bricht dort, wo der Sinn bricht.
* **Das Inhaltsverzeichnis nennt die echten Seitenzahlen** aus `RESSORT` — dieselbe
  Zahl, die der Kolumnentitel der jeweiligen Seite trägt. Der Prüfstand vergleicht
  beides; eine Abweichung fiele beim Durchklicken nie auf.

**Der Prüfstand hat meine eigene Prüfung erwischt:** Ich gab `MenuScreen` ein
`ach={{}}` statt `achN={0}` — im Verzeichnis stand daraufhin „undefined / 162". Die
Unsinnserkennung in `mach` hat es gemeldet. Genau dafür ist sie da.

Prüfstand: **275 Prüfungen**, 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.046,92 kB**.

### Ein Fehler, der jederzeit wiederkommt — jetzt abgesichert
Ein einzelnes Rückwärts-Anführungszeichen in einem Kommentar **innerhalb** des
CSS-Blocks beendet die Schablonenzeichenkette vorzeitig. esbuild meldet dann
irgendetwas viele Zeilen weiter unten („Expected ; but found perspective"), und die
Ursache steht woanders. Mir ist das in dieser Sitzung passiert, als ich
`perspective` in einem Kommentar in Rückwärts-Anführungszeichen setzte.

`pruefen.sh` prüft das jetzt **vor** dem Übersetzen und nennt die Zeile.
Gegengeprobt mit einem eingeschmuggelten Zeichen: Meldung mit Zeilennummer und
Umfeld, Rückgabewert 1.

### 34.7 · Das Titelblatt bekommt ein Bild
Zwei Rückmeldungen vom Gerät, eine Ursache: **das Aufmacherfeld hatte keinen
Bildgrund.** Ohne Spielstand war es fast leer, mit Spielstand stand das Porträt
allein auf einer leeren Fläche und wirkte verloren.

Neu: `Titelfoto` — ein gezeichnetes Pressefoto. Rang in drei Bändern, ein festes
Punktfeld als Zuschauer, zwei kleine Flutlichtmasten, Bande, Rasen in Streifen und
eine **Mannschaftsreihe als Silhouetten** (6 stehend, 5 hockend, wie auf jedem
Mannschaftsfoto). Alles flach, keine Verläufe.

* **Ohne Spielstand** steht die Mannschaft deutlich (Deckung .34) und daneben
  „ELF PLÄTZE. EINER IST NOCH FREI." — statt des blassen „HIER KÖNNTE DEIN NAME
  STEHEN".
* **Mit Spielstand** tritt sie zurück (.15) und der Spieler steht davor. Das
  Porträt ist von **230 auf 168 px** verkleinert und sitzt auf der Rasenlinie
  statt in der Mitte einer leeren Fläche — er gehört in die Mannschaft.
* Dazu eine **Bildunterschrift**, wie sie zu jedem Pressefoto gehört: Name und
  Verein, ohne Spielstand „ARCHIVBILD · DIE MANNSCHAFT VOR DEM ANPFIFF".

Die Zuschauer sind **kein Zufall**, sondern ein einmal berechnetes festes Feld
(`ZUSCHAUER`) — dieselbe Ausgabe soll bei jedem Aufschlagen gleich aussehen.

**Zwei Fehler beim Zeichnen, beide am Bild erkannt:**
1. Die Köpfe schwebten über den Körpern. Grund ist Geometrie: **eine kubische
   Kurve mit beiden Kontrollpunkten auf gleicher Höhe erreicht nur drei Viertel
   des Wegs dorthin.** Ohne Überhöhung um 4/3 bleibt eine Lücke. Steht als
   Kommentar an der Stelle.
2. Meine Prüfung zählte alle Gruppen mit Kreis und Pfad im ganzen Baum — mit
   Spielstand kamen die Ohren- und Augengruppen des Porträts dazu und meldeten
   14 statt 11. **Die Prüfung war falsch, nicht das Bild.** Jetzt wird nur
   innerhalb des Titelfotos gezählt (erkannt am viewBox).

Prüfstand: **279 Prüfungen**, 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.048,80 kB**.

## 34.8 · Vier gemeldete Punkte

### 1 · Der Spielerpass wuchs mit jeder Station
Beide Seiten liegen im selben Rasterfeld (`.dreh`), der Pass nimmt also die Höhe der
**längeren** an. Mit jeder Station wuchs deshalb auch die Vorderseite, obwohl dort
nichts hinzukam. Die Vereinsliste rollt jetzt innen, sobald es **mehr als sechs**
Stationen sind (`maxHeight:152`), dazu ein Hinweis „… Stationen · in der Liste blättern".
`touchAction:pan-y` ist nötig, weil html und body seit 34.2 auf `pan-x pan-y` stehen.

### 2 · Die Textgröße hatte keine Wirkung
Der Regler war **nicht** kaputt: er setzte `--skala` korrekt. Aber **357 Schriftgrößen
stehen fest in Pixeln** und erben nichts — die Einstellung veränderte genau zwei
Stellen im ganzen Programm.

Alle 357 auf `calc(… * var(--skala))` umzustellen wäre ein Eingriff mit hoher
Fehlerquote. Stattdessen `zoom:var(--skala)` auf `.fl`: das skaliert alles gleichmäßig
und ist genau das, was der in 34.2 gesperrte Browserzoom vorher tat. `min-height` muss
gegengerechnet werden (`calc(100vh / var(--skala))`), sonst entsteht bei Vergrößerung
eine Rollleiste über die ganze Seite.

**Die Einstellung heißt jetzt „Anzeigegröße"**, mit dem Zusatz „Vergrößert die ganze
Seite — Text, Abstände und Bilder zusammen". Sie skaliert mehr als nur Text; sie
weiter „Textgröße" zu nennen wäre eine kleine Lüge.

### 3 · Sind alle Ligen und Vereine erreichbar? — Ja
**82 von 82 Ligen, 1238 von 1239 Vereinen** können Ziel eines Angebots sein.

Der Weg dahin ist lehrreich, weil **drei Messungen hintereinander falsch waren** und
jedes Mal plausibel aussahen:
1. Erst nahm ich `off[0]` als Wechselziel — das ist oft „bleiben" oder „verlängern",
   also derselbe Verein. Ergebnis: „Premier League nie erreichbar."
2. Dann übergab ich `g:"w"`, aber `createPlayer` liest **`cfg.gender`**. Es liefen
   also nur Männer, und alle Frauenligen erschienen als unerreichbar.
3. Dann testete ich mit zwölf großen Nationen — und schloss damit ganze Erdteile aus.
   Ergebnis: „Premier League (EGY) und Qatar Stars League nie erreichbar."

Erst mit allen 212 Nationen und echten Wechselangeboten stimmte das Bild.
**Jede dieser Zwischenmeldungen hätte als Befund getaugt und wäre falsch gewesen.**
Das Messwerkzeug liegt als `pruefstand/erreichbar.cjs` bei.

*Nicht beantwortet:* welche Ligen als **Startliga** möglich sind — `homeLeagues` ist
nicht ausgeführt und war so nicht messbar.

### 4 · Der Rahmen war nicht wählbar
`rahmenFuer` nahm **immer den ersten freigeschalteten** aus der Liste. Wer Gold und
Silber hatte, bekam Gold, ohne gefragt zu werden. Neu: `meta.rahmenWahl` und eine
Auswahl in den Optionen mit Vorschau jedes Rahmens, dazu „Keiner". Fällt die Wahl auf
etwas noch nicht Freigeschaltetes, gilt weiter der beste vorhandene — alte Spielstände
funktionieren also unverändert.

Prüfstand: **291 Prüfungen** (vorher 279), 0 Fehler. Bündel **1.051,34 kB**.

## 34.9 · Block A — fünf Fehler im Spielfluss

### A1 · Zurück-Taste des Geräts
**Ohne Zusatzpaket gelöst.** Capacitor leitet die Taste an den Verlauf der WebView
weiter, also lässt sie sich über `popstate` abfangen — `@capacitor/app` hätte eine
neue Abhängigkeit und eine Änderung an `package.json` bedeutet.

Ein **Stapel**, kein einzelner Empfänger: Optionen über Menü, Rückblick über Karriere —
die Taste muss immer das Oberste schliessen. Ist der Stapel leer, greift nichts und die
Taste verlässt die App wie gewohnt. Nach jedem Druck wird sofort ein Ersatzeintrag in
den Verlauf gelegt, sonst wäre er beim nächsten Druck leer und die App ginge ungewollt zu.

Angemeldet sind: Ruhmeshalle, Errungenschaften, Sicherung, Akademie, Spielererstellung,
Optionen, Kurzanleitung, Saison- und Karriererückblick. Neu: `zurueckAnmelden`, `useZurueck`.

*Nur teilweise geprüft:* Der Prüfstand zählt, dass der Stapel beim Öffnen **wächst**.
Dass er beim Schliessen wieder **schrumpft**, hängt an Reacts Aufräumen und liess sich
hier nicht nachstellen — im Prüflauf steht er deshalb bei 18. Auf dem Gerät gehört
nachgesehen, ob die Taste nach mehrfachem Hin und Her noch das Richtige schliesst.

### A2 · Laufender Stand war nach der Rückkehr nicht da
`saveGame` schrieb in den Speicher, setzte aber **nicht** `setSave(...)`. Im Hauptmenü
stand danach der alte Stand oder gar keiner, obwohl gerade gespeichert worden war —
erst ein Neustart zeigte den Fortschritt. Der Zustand wird jetzt sofort gesetzt, das
Schreiben läuft danach.

### A3 · Die Rentenfrage kam immer wieder
Bedingung war `age >= 33 && chance(.35)` — also **in jeder dritten Saison neu**, bis zu
fünfmal in einer Laufbahn, auch auf dem Zenit. Jetzt einmalig (`flags.renteGefragt`) und
nur, wenn die Stärke **mindestens 4 Punkte unter dem eigenen Höchstwert** liegt. Wer mit
36 noch auf seinem Bestwert spielt, wird nicht gefragt. Der Text nennt den Grund und sagt
zu, nicht wieder zu fragen.

### A4 · Hintergrund rollte unter der Bilanz mit
`rollSperren()` setzt `overflow:hidden` und `touchAction:none` auf den Körper, solange
eine Überlagerung offen ist. **Zähler statt Schalter:** bei zwei Überlagerungen
übereinander darf die erste, die schliesst, nicht schon freigeben.

### A5 · Namensvorschlag zur Herkunft
Es gab nur weibliche Vornamen (`PARTNER_F`) und **keine Nachnamen**. Neu: `VOR_M`,
`VOR_W` und `NACH` für alle vierzehn Sprachräume, dazu `namensVorschlag(nat, g, kennung)`.

Der Vorschlag hängt **an der Kennung des Porträts**, nicht am Zufall — sonst wechselte er
bei jedem Tastendruck. Sobald jemand selbst tippt, bleibt sein Name stehen, auch beim
Wechsel der Herkunft; leert man das Feld, greift der Vorschlag wieder. Ein Hinweis unter
dem Feld sagt, welcher Zustand gerade gilt.

**Beim Anlegen der Listen ist ein kyrillisches „С" in „Sousa" gerutscht** — aus einer
Zeichenkette, die beim Schreiben entstanden ist. Aufgefallen ist es nur, weil ich
hinterher gezählt habe. Der Prüfstand sucht jetzt in allen erzeugten Namen nach
kyrillischen Zeichen und nach „undefined".

Prüfstand: **301 Prüfungen** (vorher 291), 0 Fehler. Bündel **1.057,32 kB**.

### Zwei Antworten aus der Untersuchung
**Moral** bewegt sich am Saisonende (`(3,2 − Note) × 9 + Titel × 7 − 12 bei Bankdrücken`),
durch Privatleben und Besitz. Sie bewirkt **genau eine Sache**: den Wachstumsfaktor
`0,8 + Moral/340` — rund 35 % Unterschied zwischen 5 und 100. Keine Wirkung auf Noten,
Angebote oder Verletzungen. *Das ist wenig für einen so prominent angezeigten Wert.*

**Wachstum**: Startstärke Median 51, erste Saison Median +5 (Höchstwert +10), danach
+2 bis +3. Der Sprung steckt in der Formel `Abstand zum Potenzial × 0,22`: bei Start 51
und Potenzial ~85 ist der Abstand 34, der erste Schritt also zwangsläufig der grösste.
Kevins Eindruck stimmt. Ob das zu steil ist, ist eine Kalibrierungsfrage.

## 34.10 · Block B, erster Teil — die Sprache der Oberfläche

### Erst gezählt, dann angefangen
| Textsorte | Anzahl |
|---|---|
| Ereignistitel | 445 |
| Auswahlmöglichkeiten in Ereignissen | 974 |
| Ergebnistexte in Ereignissen | 1197 |
| Erklärzeilen (`hint`) | 68 |
| Beschreibungen (`desc`) | 77 |
| **sichtbare Oberflächensätze** | **44** |

**Über 2.600 Texte. Das ist nicht ein Block, sondern mehrere.** Angefangen habe ich
mit den 44 Sätzen, die man *ständig* sieht — Menü, Optionen, Erstellung, Hinweiszeilen.
Die Ereignistexte sind der grosse Rest und kommen als eigener Schritt.

### Was umgeschrieben ist
**Die Kurzanleitung komplett.** Ton: wie jemand, der einem das Spiel in der Kabine
erklärt. „Eine Saison, drei Schritte" → „Drei Schritte, dann Sommerpause". „Es endet
von allein. Irgendwann reicht es körperlich nicht mehr" → „Irgendwann ist Schluss.
Das Knie sagt Bescheid." Längste Zeile jetzt 105 Zeichen.

Dabei ist der Erklärsatz rausgeflogen, der eine frühere Änderung begründete statt das
Spiel zu erklären: „Gelten für alle Laufbahnen und stehen in den Optionen. Für eine
laufende Laufbahn bleibt es so, wie es beim Start stand." → „Stehen in den Optionen und
gelten fürs nächste Mal. Eine laufende Laufbahn bleibt, wie sie gestartet ist."

**34 weitere Oberflächensätze**, zum Beispiel:
* „Dein Umfeld kauft für dich, was sinnvoll und bezahlbar ist." → „Deine Leute kaufen,
  was Sinn ergibt und drin ist."
* „Diese Ansicht liess sich nicht aufbauen" → „Diese Seite ist uns abgeschmiert"
* „Aufhören, bevor es andere entscheiden." → „Gehen, bevor sie dich gehen lassen."
* „Laufbahn wirklich beenden? Danach geht es nicht weiter." → „Wirklich Schluss?
  Danach ist Schluss."
* „Für diese Auswahl gibt es keinen passenden Verein." → „Dafür haben wir keinen Verein."

### Eine Prüfung ist beim Umschreiben gefallen — zu Recht
Die Ehrentafel-Prüfung suchte den Wortlaut „Noch niemand". Nach dem Umschreiben stand
dort „Noch keiner hat's von hier nach oben geschafft" — der Hinweis war da, die Prüfung
fiel trotzdem. **Prüfungen, die an einem Wortlaut hängen, brechen bei jeder Sprachrunde.**
Jetzt wird auf „Noch keiner" geprüft, mit einem Kommentar dazu. Beim Rest der
Sprachrunde ist mit weiteren solchen Fällen zu rechnen.

Neu ist ausserdem eine Prüfung der Anleitung: keine Zeile ohne Kopf oder Text, keine
über 130 Zeichen. **Den Ton kann der Prüfstand nicht prüfen — die Struktur schon.**

Prüfstand: **303 Prüfungen**, 0 Fehler. Bündel **1.056,81 kB** (0,5 kB *kleiner* als
vorher — kürzere Texte).

### Was von Block B noch offen ist
1. **445 Ereignisse** mit 974 Auswahlmöglichkeiten und 1197 Ergebnistexten. In Etappen,
   etwa nach Themen (Kabine, Verein, Nationalelf, Privatleben, Presse).
2. **68 Erklärzeilen** (`hint`) und **77 Beschreibungen** (`desc`) — dort steckt
   erfahrungsgemäss die meiste unnötige Erklärlast.

## 34.11 · Sprache, zweiter Anlauf — und ein Befund, der Arbeit spart

### Zwei Sätze waren schlecht, und Kevin hat beide erwischt
* **„Gehen, bevor sie dich gehen lassen."** — Buchdeutsch. Klingt nach Sportlerbiografie,
  nicht nach Kabine. Jetzt: „Aufhören, solange du es selbst entscheidest."
* **„Wirklich Schluss? Danach ist Schluss."** — eine Doppelung, die nichts sagt.
  Jetzt: „Wirklich aufhören? Zurück geht dann nichts mehr."

Danach die ganze Liste noch einmal durch, mit einem klaren Massstab: **Würde ein Spieler
oder ein Reporter das so sagen?** Was gesucht klang, ist raus. „Was dein Zeug pro Saison
bringt" war krampfhaft locker → „Was dir dein Besitz pro Saison bringt". „Diese Seite ist
uns abgeschmiert" war zu flapsig für eine Fehlermeldung → „Hier ist was schiefgegangen".

**Die Lehre:** Umgangssprache ist nicht dasselbe wie Sprüche. Beim ersten Anlauf habe ich
gesucht statt gesprochen — und dabei Sätze gebaut, die niemand sagt.

### Der Befund: die Ereignisse brauchten gar nichts
Bevor ich 2.600 Texte umschreibe, habe ich **gemessen**, ob sie es nötig haben. Alle
Ereignistexte auf typische Kennzeichen von Behördendeutsch geprüft (somit, zudem,
hinsichtlich, im Rahmen, zur Verfügung, entsprechend …):

| Textsorte | geprüft | steife Wendungen |
|---|---|---|
| Ereignistitel | 445 | **1** |
| Auswahlmöglichkeiten | 974 | 0 |
| Erklärzeilen | 80 | 0 |
| Beschreibungen | 77 | 0 |
| Ergebnistexte | 1163 | **1** |

**Zwei von 2.739.** Beide behoben („Der Physiotherapeut steht zur Verfügung" → „Der Physio
hat einen Termin frei", „Es bringt entsprechend wenig" → „Bringt also wenig").

Die Ereignistexte sind längst im richtigen Ton — „Lehrgeld bezahlt.", „Der Trainer merkt
sich sowas.", „Die Schule hakst du ab." **Steif war die Oberfläche, nicht das Spiel.**
Hätte ich Kevins Auftrag wörtlich genommen und alle 2.600 umgeschrieben, hätte ich
funktionierende Texte gegen neue mit unbekannter Qualität getauscht.

Neu im Prüfstand: die Suche nach steifen Wendungen läuft jetzt bei jedem Lauf über alle
2.725 Ereignistexte. Behördendeutsch kann sich nicht wieder einschleichen.

### Zum dritten Mal dieselbe Falle
Die Ehrentafel-Prüfung ist erneut gefallen, weil sie an einem Wortlaut hing — erst
„Noch niemand", dann „Noch keiner". Jetzt prüft sie auf den **Gehalt**
(`/noch keiner|niemand|nach oben geschafft/i`). **Prüfungen auf wörtliche Texte sind bei
einem Projekt, dessen Sprache überarbeitet wird, eine Zeitbombe.**

Prüfstand: **304 Prüfungen**, 0 Fehler. Bündel **1.056,86 kB**.

## 34.12 · Block C — Frauenfußball

### Der Weg: umformen statt doppelt pflegen
Gezählt waren **86 Stellen** in den Ereignistexten, die bei einer Spielerin falsch sind
(Kapitän 29, Mitspieler 15, Nationalspieler 10, „einer von" 9 …). Alle Texte doppelt zu
pflegen wäre nicht durchzuhalten: bei jeder Änderung müsste man an zwei Stellen denken,
und irgendwann vergisst man eine.

Stattdessen läuft der **fertige** Text durch eine Umformung. `evText` ist der einzige
Punkt, an dem Ereignistexte ausgewertet werden — was dort greift, greift überall.
Damit sind auch die Stellen erfasst, die ich nicht gezählt habe: **2.684 Texte**.

### Drei Fehler beim Bauen, alle am Ergebnis erkannt
Eine reine Wortersetzung reicht nicht. Der Reihe nach kam heraus:
1. **„Der Kapitänin"** — der Artikel blieb männlich. Also Muster, die den Artikel
   einschliessen: `der Kapitän` → `die Kapitänin`, in allen Fällen (dem/einem/deinem…).
2. **„Zwei Spielerin fehlen"** — kein Plural. Also ein Muster für Zahlwörter und
   Mengenangaben davor: `zwei Spieler` → `zwei Spielerinnen`.
3. **„Dem Kapitänin"** — die Liste kannte nur Kleinschreibung. Gross- und
   Kleinschreibung werden jetzt **automatisch** erzeugt (`gross()`), nicht von Hand
   gepflegt; von Hand hätte ich beim nächsten neuen Wort wieder eine Hälfte vergessen.

### Was bewusst NICHT umgeformt wird
**Der Trainer bleibt Trainer.** Auch eine Frauenmannschaft kann einen Mann als Trainer
haben — das ist keine Lücke, sondern eine Entscheidung. Umgeformt wird nur, wer
zwangsläufig Spielerin ist. Steht im Quelltext als Kommentar und wird geprüft.

### Eine Stelle wäre mir fast durchgerutscht
Die **Auswahlmöglichkeiten** (`label`, `hint`) liefen nicht durch `evText`, sondern
standen direkt im JSX — sie wären bei einer Spielerin männlich geblieben. Aufgefallen,
weil ich nach dem Einbau nachgesehen habe, welche Stellen den Durchgangspunkt wirklich
benutzen.

### Geprüft
| Prüfung | Ergebnis |
|---|---|
| Umformung an Beispielfällen | 10 von 10 richtig |
| Männliche Reste nach der Umformung | **0** von 2.684 Texten |
| Gegenprobe: ändert sich bei einem Mann etwas? | **nein**, 200 Texte unverändert |

Die letzte Prüfung ist die wichtigste: eine Umformung mit Nebenwirkung auf männliche
Laufbahnen hätte vier Fünftel aller Spiele betroffen.

Prüfstand: **316 Prüfungen** (vorher 304), 0 Fehler. Bündel **1.059,03 kB**.

### Was von Block C offen bleibt
* **Beinamen** (`BEINAMEN`) sind noch nicht geprüft — die stehen ausserhalb der
  Ereignistexte und laufen nicht durch `evText`.
* **Ereignisse, die es nur im Frauenfussball geben sollte** (und umgekehrt): es gibt
  zwei ausdrücklich weibliche, aber keine systematische Prüfung, ob männliche
  Ereignisse bei Spielerinnen unpassend sind.
* Die Umformung ist **mechanisch**. Sätze, die inhaltlich männlich gedacht sind
  („im Kader stehen drei, die geboren wurden, als du…"), bleiben unberührt — das
  fällt nur beim Spielen auf.

## Offene Punkte (Stand 34.12)

1. **Seitenscheitel (Frisur 2)** liest sich noch immer eher als Glanzstreifen denn
   als Scheitel. Und **Halbglatze und Glatze sind zusammen 2 von 12** Möglichkeiten;
   im Zufallsbogen wirkt rund ein Fünftel der Gesichter kahl. Rechnerisch richtig,
   gestalterisch vielleicht zu viel — das ist Kevins Entscheidung, keine Aufgabe
   für den Prüfstand.
2. **Weibliche Porträts sind weniger weit** als die männlichen: 10 bzw. 14 Frisuren
   gegen 12 bzw. 16, und die langen Haarformen liegen hinter dem Kopf, wo sie bei
   62 px kaum wirken. Nachziehen, sobald die männlichen stehen.
3. **Farbe gegen Bedeutungsfarbe** ist noch offen. Die Form trennt die beiden
   Prestigeleitern, aber nicht Text von Text: `RARITY.normal` (#7E8A84) liegt bei
   **ΔE 4,6** zu `--mu` (#8A9690) und `hsv` bei **ΔE 18,8** zu `--tx`. Erst prüfen,
   ob sie überhaupt je in derselben Zeile stehen — wenn nicht, ist es folgenlos.
   **Nicht blind verschieben.**
4. **`zahlenPruefen` greift in der Ruhmeshalle nicht**, weil die Werte in `.zellen`
   dort als reine Textknoten neben der Beschriftung stehen. In der Ehrentafel schon
   berichtigt. Nachziehen, wenn ohnehin an der Ruhmeshalle gearbeitet wird.
5. **Das Symbol ist bei 48 dp nicht mehr lesbar.** Wer Lesbarkeit will, braucht ein
   reduziertes Zeichen (Ball und XI), keine Szene. Gestalterische Entscheidung.
6. **Alte Spielstände** tragen `speed` und `mode` weiter am Spieler; die Voreinstellung
   greift nur bei neuen Laufbahnen. So gewollt, sollte aber im Blick bleiben.
7. **Aus Abschnitt 7 weiterhin offen:** Akademie im Karriere-Rückblick erwähnen,
   Jugendturniere mit Namen und Gegner sichtbar machen.

## Zusätzliche Stolperfallen

* **Schrift nur benannt, nicht mitgeliefert.** Eine Familie im CSS zu nennen liefert sie
  nicht aus. Ohne `@font-face` mit eigener Datei greift stumm die Ersatzkette.
* **Vorschauwerkzeug, das die Wirklichkeit beschönigt**, ist schlimmer als gar keins.
  `vorschau.py` lud Schriften aus dem Netz, die App nicht — die Abweichung blieb Monate
  unbemerkt. Alles, was in der Vorschau anders ist als auf dem Gerät, muss begründet
  und dokumentiert sein.
* **Prüfung, die während des ersten Aufbaus misst.** `document.fonts` ist asynchron.
  Wer vor `fonts.ready` misst, misst die Ersatzschrift.
* **Zwei Leitern mit derselben Sprache.** Wenn zwei Ordnungen im Spiel Materialnamen
  tragen, kollidieren sie zwangsläufig. Vor jeder Farbänderung prüfen, ob eine zweite
  Skala denselben Raum belegt.
* **Reihenfolge im Quelltext prüfen, bevor man schneidet.** Beim Umbau des Passes habe ich
  `s[s.index("function Pass"):s.index("function WildcardCard")]` geschnitten — `WildcardCard`
  steht aber *vor* `Pass`. Das Ergebnis war ein negativer Bereich: der Block dazwischen wurde
  verdoppelt, die alte Fassung blieb stehen. Der Bau fiel sofort mit „already been declared"
  auf, aber nur, weil zwei Funktionsnamen kollidierten. Bei einem Schnitt ohne Namenskollision
  wäre es stumm geblieben. **Nach jedem Blockschnitt die Funktionsnamen gegen die
  Ausgangsdatei zählen.**
* **Gestalterische Werte im Bauteilcode.** 22 `borderRadius` und elf `fontFamily` standen
  direkt in JSX statt in Klassen und wären bei einer reinen CSS-Änderung stehengeblieben.
