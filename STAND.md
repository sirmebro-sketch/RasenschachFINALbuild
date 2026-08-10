# Rasenschach XI — Stand

> **Für Claude:** Diese Datei zuerst lesen. Dann die Fassungsnummer in
> `App.jsx` (**Zeile 10** — Zeile 9 ist `NAME`, Zeile 11 `VERSION_INFO`)
> gegenprüfen — stimmt sie nicht mit der hier genannten überein, ist eine
> der beiden Dateien veraltet. Das sagen, bevor irgendetwas geändert wird.

**Fassung 33.14** · Stand 10. August 2026
*Eigene Schriften · harte Form · Farbkonzept · Sammelalbum · Titelblatt und Optionen · Ehrentafel als Karton*

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
Dafür gibt es den Browsertest als Einzeldatei (siehe unten).

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

## Offene Punkte (Stand 33.14)

1. **Auf dem Gerät noch nicht gemessen.** Drei Dinge kann nur Chrome auf dem Handy
   beantworten, und die Antwort steht noch aus: wendet der Pass sauber (`preserve-3d`),
   greift `navigator.wakeLock`, und steht im Impressum „Fassung 33.14" **ohne**
   „SCHRIFT FEHLT". Der Browsertest liegt bereit (`pruefstand/browsertest.sh`).
   **Achtung:** `wakeLock` gibt es nur im sicheren Zusammenhang. Aus der Downloads-App
   heraus wird die Datei meist über `content://` geöffnet — dann ist der Schalter
   gesperrt, und das sagt **nichts** über die APK. Dafür braucht es `http://localhost`
   oder https. Die Diagnosezeile im Messwerkzeug nennt den Grund.
2. **Halbtonraster über die volle Seite** — noch nicht auf Rechenaufwand bei sehr
   langen Ansichten gemessen. Das Messwerkzeug im Browsertest hat dafür drei
   A/B-Schalter (Raster · Klebeschatten · Schräglage und Deckkraft), weil neben dem
   Raster auch die 162 Felder verdächtig sind: jedes nicht erreichte trägt
   `opacity:.62`, also eine eigene Transparenzebene.
3. **Zwei Restüberschneidungen** in den Farben: `aussen` gegen Stufe Platin (58) und
   `hsv` gegen `--tx` (46). **Nicht** einzeln verschieben — die Schwelle 60 war
   willkürlich gesetzt. Vereinbart ist die strukturelle Lösung: Errungenschaftsstufe
   als **gefüllter Block**, Seltenheit als **Rahmen**. Dann trennen sich die beiden
   Leitern nach Form statt nach Farbe, und eine Überschneidung im Farbraum ist
   folgenlos.
4. **Karton weiter ausrollen?** Jetzt an Spielerpass, Errungenschaften und
   Akademie-Ehrentafel. Ein weiterer Kandidat ist nicht offensichtlich — eher
   aufhören als aus Gewohnheit weitermachen.
5. **`zahlenPruefen` greift in der Ruhmeshalle nicht**, weil die Werte in `.zellen`
   dort als reine Textknoten neben der Beschriftung stehen. Dieselbe Stelle wurde in
   der Ehrentafel berichtigt. Nachziehen, wenn ohnehin an der Ruhmeshalle gearbeitet wird.
6. **Alte Spielstände** tragen `speed` und `mode` weiter am Spieler; die Voreinstellung
   greift nur bei neuen Laufbahnen. Das ist so gewollt, sollte aber im Blick bleiben.

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
