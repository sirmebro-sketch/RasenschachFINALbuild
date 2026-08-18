# Rasenschach XI — Stand

> **Für Claude:** Diese Datei zuerst lesen. Dann die Fassungsnummer in
> `App.jsx` (**Zeile 10** — Zeile 9 ist `NAME`, Zeile 11 `VERSION_INFO`)
> gegenprüfen — stimmt sie nicht mit der hier genannten überein, ist eine
> der beiden Dateien veraltet. Das sagen, bevor irgendetwas geändert wird.

**Fassung 35.15** · Stand 16. August 2026

<!-- VERZEICHNIS -->

## Verzeichnis

*Erzeugt von `pruefstand/verzeichnis.cjs` — nicht von Hand pflegen.*

| Zeile | Abschnitt |
|---:|---|
| 90 | 1. Was das Projekt ist |
| 129 | 2. Zusammenarbeit |
| 145 | 3. Was drin ist (Grobüberblick) |
| 258 | 4. Kalibrierung — worauf eingestellt wurde |
| 284 | 5. Prüfstand |
| 337 | 6. Stolperfallen — teuer gelernt |
| 375 | 7. Was offen ist |
| 396 | 8. Wie ein neuer Chat anfangen sollte |
| 423 | Fassungen 33.3 bis 33.7 — Schrift, Form, Farbe |
| 747 | Auf dem Gerät geprüft — 10.8.2026 |
| 854 | 34.0 · Die Spielerporträts |
| 971 | 34.3 · Die App wird ein Heft (Schritt 1 von 3) |
| 1219 | 34.8 · Vier gemeldete Punkte |
| 1271 | 34.9 · Block A — fünf Fehler im Spielfluss |
| 1336 | 34.10 · Block B, erster Teil — die Sprache der Oberfläche |
| 1391 | 34.11 · Sprache, zweiter Anlauf — und ein Befund, der Arbei… |
| 1439 | 34.12 · Block C — Frauenfußball |
| 1494 | 34.13 · Block D, erster Teil |
| 1543 | 34.14 · Die Wachstumskurve |
| 1597 | 34.15 · Die Rückblick-Karten |
| 1636 | 34.16 · Zwei Fehler aus Kevins Test |
| 1696 | 34.17 · Die Freischaltungen |
| 1731 | 34.18 · Der Vermächtnis-Laden |
| 1799 | 34.19 · Der gekaufte Kartentausch wirkt |
| 1845 | 34.20 · Der Laden nach dem ersten Blick aufs Gerät |
| 1877 | 34.21 · Laden und Zahnrad lagen aufeinander |
| 1958 | 34.22 · Der Laden rechnet ab, und zwei Texte |
| 2045 | 34.23 · Jede neue Seite beginnt oben |
| 2102 | 34.24 · Der Spielerpass: Stärke, Binden, Flaggen |
| 2174 | 34.25 · Die Ränge der Errungenschaften |
| 2237 | 34.26 · Der Rückblick liegt auf Karteikarten |
| 2307 | 34.27 · Drei wirklich runde Kopfformen |
| 2376 | 34.28 · Zwei Kopfformen ohne markantes Kinn |
| 2412 | 34.29 · Herkunft, Statur und Geschlecht wirken aufs Gesicht |
| 2479 | 34.30 · Aufräumen nach dem Belastungstest |
| 2541 | 34.31 · Kartenwechsel ohne Ruckler, Schritte auf Formularpa… |
| 2587 | 34.32 · Die Wildcard auf hellem Papier |
| 2625 | 34.33 · Die Kopfformen sind wieder spiegelgleich |
| 2662 | 34.34 · Drei Meldungen aus dem Spiel |
| 2717 | 34.35 · Bärte bleiben in der Kopfform |
| 2750 | Kevins Testprotokoll zu 34.33 — Ergebnis |
| 2775 | 34.36 / 34.37 · Goldton, Kopflinie, Zielverein des Trainers |
| 2823 | 34.38 · Alle 212 Nationen haben eine echte Flagge |
| 2870 | 35.0 · Ereigniswiederholung: gemessen statt vermutet |
| 2921 | 35.1 · Werkzeugpflege |
| 2976 | 35.2 · STAND.md hat ein Verzeichnis |
| 3011 | 35.3 · Eine Regel weniger zum Merken |
| 3048 | 35.4 · Vier Fundstellen aus der Eingangsprüfung |
| 3156 | 35.5 · Ein Prüfwerkzeug für die Ereignisse |
| 3285 | 35.6 · Die Ereignisse ziehen aus |
| 3361 | 35.7 · Entscheidungen mit Folgen |
| 3427 | 35.8 · Deine Werte öffnen Türen |
| 3503 | 35.9 · Storystränge |
| 3569 | 35.10 · Der Anfang war die engste Stelle |
| 3642 | 35.11 · Wo die Bedingungen hingehören — und ein grober eige… |
| 3706 | 35.12 · Die Ehrentafel sagt jetzt, wohin |
| 3773 | 35.13 · Die Akademie wird größer |
| 3859 | 35.14 · Antworten, die nur manchmal da sind |
| 3929 | 35.15 · Vier Geschichten statt einer |
| 3981 | Offene Punkte (Stand 35.15) |
| 4107 | Zusätzliche Stolperfallen |

<!-- ENDE VERZEICHNIS -->

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
| `ereignisse.js` | die 463 Ereignisse, seit 35.6 ausgelagert (Fabrik `machEreignisse`) |
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
| `erreichbar.cjs` | misst, welche Ligen und Vereine erreichbar sind (seit 34.8; stand bis 34.20 nicht in dieser Tabelle) |
| `kopfleiste.cjs` | vermisst die Kopfknöpfe des Titelblatts in echtem Chromium (seit 34.21) |
| `seitenanfang.cjs` | prüft in echtem Chromium, dass jeder Seitenwechsel oben beginnt (seit 34.23) |
| `appicon.py` | erzeugt den Android-Symbolsatz aus einem Bild |

**`kopfleiste.cjs` braucht einen echten Browser.** Es läuft **nicht** in
`pruefen.sh`, sondern von Hand auf einer gebauten Einzeldatei:

    bash pruefstand/browsertest.sh App.jsx
    node pruefstand/kopfleiste.cjs /tmp/bt/rasenschach-browsertest.html kopf.png

Gemeldet wird der waagerechte Abstand zwischen den beiden Knöpfen; ein
negativer Wert ist eine Überlappung. Dazu ein Bild der Kopfleiste.

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
| Rand bei absoluter Lage | Ein `margin-right` verschiebt ein `position:absolute`-Element **um seinen eigenen Betrag**, nicht um die Breite des Nachbarn: `left + Breite + margin-right + right = Behälterbreite`. Zwei Knöpfe mit derselben Klasse und `right:0` liegen aufeinander, egal welcher Rand danebensteht. Nebeneinander gehört in einen Flexbehälter mit `gap`, nicht in Randwerte. |
| Prüfmuster auf Zeichenketten | `startprobe.cjs` suchte nach Farbwerten und Verläufen, die es nach einer Gestaltungsänderung nicht mehr gab, und war dadurch **dauerhaft rot** — ohne dass etwas kaputt war. Prüfungen auf die Absicht richten (`.raster` trägt *irgendeinen* Radialverlauf), nicht auf den Wortlaut. |
| „Daran denken“ ist keine Regel | Wenn eine Anweisung mit „nach jeder Änderung bitte X“ beginnt, ist sie noch nicht fertig. Entweder lässt sie sich prüfen, dann gehört sie in `pruefen.sh` — oder nicht, dann gehört hierher, warum nicht. Zuletzt passiert in 35.2 mit dem Verzeichnis. |
| Einmal grün ist nicht bewiesen | Prüfungen auf gewürfelten Zuständen (`laufbahn()`) können zufällig grün sein. Die Rückkehr-Prüfung war 40 von 40 grün und fiel erst zwei Fassungen später um, weil die HSV-Rautekarte nur manchmal auftaucht. Bei gewürfelten Zuständen zählt erst die Wiederholung. |
| Ereignis verspricht, Mechanik liefert nicht | Ein Ereignistext, der einen Verein oder eine Person BEIM NAMEN nennt, braucht eine Wirkung, die genau das herstellt. `winterMove` allein ist ein allgemeiner Wechselwunsch — der genannte Verein taucht dann nur zufällig auf. Bei jedem neuen Ereignis mit Namen prüfen, ob die Wirkung den Text wirklich einlöst. |
| Einseitig geänderte Pfade | Wer an einer Seite von `kopfPfad` etwas ändert, muss die gespiegelte Stelle mitziehen — sonst wird das Gesicht schief, und im Zufallsbogen fällt es kaum auf. Die Symmetrie wird seit 34.33 nachgerechnet: zu jedem Punkt (x, y) muss (100 − x, y) existieren. |
| Farbumdeutung trifft auch Fremdkörper | `.laufzettel` und `.karteikarte` setzen die Farbvariablen für hellen Grund neu. Das gilt für ALLES darin — auch für Dinge, die absichtlich dunkel bleiben sollen, wie die Wildcard. Solche Objekte müssen die Umdeutung ausdrücklich zurücknehmen; ein Verweis auf den Grundstil geht nicht, eine Variable sieht ihre eigene Fassung weiter oben nicht. |
| Zwei Dinge im selben Rasterfeld | `grid-area: 1/1` stapelt zwei Karten übereinander — praktisch, aber die Zelle ist immer so hoch wie der höhere Inhalt. Eine Ein- und Ausblendung wirkt dadurch stockend: die Grösse springt erst, wenn das alte Element abgeräumt ist. Das ausziehende Element gehört `position:absolute`, damit es für die Höhe nicht mehr zählt. |
| Rechenkern kennt kein Karriereende | `simulateSeason`, `develop` und `makeOffers` hören nie auf. Die Altersgrenze steht im Spielablauf (App-Bauteil). Wer eine Laufbahn im Test nachstellt und nur den Kern ruft, spielt bis in alle Ewigkeit und meldet dann einen Fehler, den es nicht gibt. |
| Ein Maß, viele Zeichner | `kopf.j` steuert Hülle, Wangenschatten, zwei Bärte und den Kinnriemen. Wer die Kieferlinie ändert und nur die Hülle anfasst, lässt den Bart darüber hinauszeichnen. Es gibt **keinen** Beschnitt auf `kopfD` — die Teile müssen von Hand zusammenpassen. |
| Zwei Werte für dieselbe Sache | `col` und `colK` je Stufe, von Hand gepflegt, an zwei Orten benutzt — sie liefen auseinander, und Legendär sah oben creme und unten olivbraun aus. Dasselbe Muster wie `aka.laden`/`p.laden` in 34.22. **Eine Quelle, abgeleitete Varianten rechnen.** |
| CSS-Spezifität schlägt Klassen | `.karton .m` (0,2,0) überschrieb `.stufe` (0,1,0) und setzte dunkle Schrift auf dunkle Fläche. Farben, die von einer berechneten Fläche abhängen, gehören **inline** — inline schlägt jede Klasse. |
| Prüfung, die nichts zu messen hatte | Ein Prüfmittel kann grün melden, weil der geprüfte Zustand gar nicht eintrat: bei 412×915 ist das Hauptmenü fensterhoch, es gab nichts zu rollen, und „vorher 0 → nachher 0“ sah aus wie ein Erfolg. **Jede Messung braucht eine Untergrenze**, unterhalb derer sie „nicht messbar“ meldet — und das muss als Fehlschlag zählen. |
| Werkzeug, das die Quelle als Ziel nimmt | `uebersicht.cjs <Ziel.md>` nimmt die **Zieldatei** als erstes Argument — die Quelle kommt aus `/tmp/ps/motor.js`. Ein `uebersicht.cjs App.jsx UEBERSICHT.md` hat deshalb wortlos die `App.jsx` überschrieben. Bei jedem Werkzeug, das schreibt, vor dem ersten Aufruf nachsehen, **welches Argument das Ziel ist**. Seit 35.4 sperrt das Werkzeug beides ab (nur ein Argument, muss auf `.md` enden). |
| Layout ist im Prüfstand unsichtbar | jsdom rechnet keine Geometrie. Ob zwei Dinge übereinanderliegen, sich überschneiden oder aus dem Bild laufen, kann `pruefen.sh` **strukturell nicht** beantworten. Dafür `pruefstand/kopfleiste.cjs` auf einer gebauten Einzeldatei — oder die Ursache im CSS prüfen statt die Wirkung im Baum. |

---

## 7. Was offen ist

**Die aktuelle Liste steht weiter unten unter „Offene Punkte".** Der Abschnitt
trägt die Fassungsnummer, unter der er zuletzt durchgesehen wurde — hier wird
sie bewusst nicht wiederholt, sonst zeigt dieser Verweis nach der nächsten
Sitzung wieder daneben (genau das war bis 35.3 der Fall: er nannte 33.13).
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

## 34.13 · Block D, erster Teil

### Ereignisse: zwei pro Saison
Die Bedingung war `chance(.5) ? 2 : 3` — **in der Hälfte aller Saisons drei**. Eine
Saison bestand damit fast nur aus Entscheidungen. Jetzt sind es zwei; drei gibt es
ausschliesslich mit der Freischaltung „Bewegtes Leben", und auch dann nur in jeder
vierten Saison.

Nebenbei bekommt die Freischaltung erst dadurch ihren Sinn: vorher stand dort
`chance(mx_events ? .3 : .5)` — sie verschob eine ohnehin hohe Wahrscheinlichkeit,
statt etwas freizuschalten. Der Beschreibungstext ist mitgezogen („Ab und zu drei
Ereignisse statt zwei").

### Auto-Training trainierte volle Werte weiter
**Gemessen, nicht vermutet:** ein Stürmer mit Schuss 99 und Tempo 99 bekam weiterhin
Abschlusstraining. Ursache: `rueckstand` misst nur den Abstand zum eigenen Schnitt.
Ein Wert bei 99 gilt darin als voll trainierbar, solange die Position ihn stark
gewichtet — der Deckel bei 99 kam in der Rechnung schlicht nicht vor.

Neu ist ein **Kopfraum**-Faktor `(99 − Wert) / 8`, gedeckelt auf 0,04 bis 1. Ab 96
fällt der Nutzen steil, bei 99 ist er fast weg.

| Werte | vorher | jetzt |
|---|---|---|
| alle auf 70 | abschluss | abschluss |
| Schuss + Tempo auf 99 | **abschluss** | technik |
| dazu Dribbling + Pass auf 99 | **abschluss** | kraft |
| alles auf 99 | abschluss | abschluss *(dann ist es egal)* |

### Die Reiter waren nicht als Reiter erkennbar
Drei Zeichen dagegen: eine **Linie** unter der Leiste, ein **Verlauf am rechten Rand**
(deutet an, dass etwas abgeschnitten ist) und **Einrasten beim Wischen**, damit kein
Reiter halb abgeschnitten stehenbleibt. Der Verlauf hängt an einer Hülle, nicht an der
rollenden Leiste — sonst würde er mitwandern statt am Rand zu bleiben.

Der Prüfstand zählt, dass jede Leiste in ihrer Hülle steckt: eine reine Stilangabe
verschwindet bei einem Umbau sonst lautlos.

Prüfstand: **320 Prüfungen**, 0 Fehler. Bündel **1.060,16 kB**.

### Aus Block D noch offen
* **Wrapped-Karten**: zu leer, Überschriften zu klein, Karte für verpasste Spiele
  fehlt, Tabellenausschnitt statt reiner Platzierung.
* **Mehr Möglichkeiten für Vermächtnis-Coins** (Wildcard neu ziehen, Saisonschub,
  Werte über 99 …) — das ist neue Spielmechanik, kein Fehler.
* **Freischaltungen als eigenes Untermenü**, verdichtet.
* **Wachstumskurve** in den ersten Saisons: gemessen (Start 51, erste Saison +5,
  Höchstwert +10), Entscheidung über eine Anpassung steht aus.

## 34.14 · Die Wachstumskurve

### Gemessen — und der Befund war schärfer als der Verdacht
250 Laufbahnen, Alter für Alter. Die alte Kurve
(`<=18 1.0 · <=21 .92 · <=24 .62 · <=26 .34 · <=28 .16 · <=30 .05 · sonst 0`) ergab:

| Alter | Zuwachs (Mittel) |
|---|---|
| 16 | **+6,2** |
| 17 | +3,9 |
| 18 | +2,5 |
| 22–24 | +0,7 |
| ab 25 | **praktisch 0** |

Höchststärke im Median mit **24**. Und: **der Median-Spieler blieb 12 Punkte unter
seinem Potenzial** — die Zahl wurde also fast nie erreicht. Genau Kevins Beobachtung:
„Anlage 97, mit 25 ein Höchstwert von 85, dann passiert nicht mehr viel."

### Zwei Änderungen
**1. Flachere Kurve.** Vorn genommen, hinten gegeben. Der Gipfel liegt nicht mehr bei
21, sondern breit zwischen 19 und 24, und bis 30 ist noch etwas drin. Das ist für ein
Spiel mit 1.239 Vereinen wichtiger als der Ausnahmefall: auch ein mittelmässiger
Spieler soll sich über Jahre entwickeln, statt nach zwei Saisons fertig zu sein.

**2. Nachholen über das EFFEKTIVE ALTER.** Wer weit unter seinen Anlagen liegt, wird
für die Kurve jünger gerechnet — bis zu vier Jahre Gutschrift bei grossem Rückstand.

*Der erste Versuch war ein Denkfehler:* Ich hatte das Nachholen als **Multiplikator auf
die Menge** gebaut. Damit verstärkte es ausgerechnet die Sechzehnjährigen, wo die Lücke
am grössten ist — der frühe Sprung wurde schlimmer statt besser (+6,5 statt +6,2). Über
das Alter greift es nur dort, wo die Kurve abfällt: mit 16 ist man nicht „noch jünger",
mit 28 aber sehr wohl „wie 25".

**3. Grundfaktor .22 → .28.** Die flachere Kurve hat weniger Fläche; ohne Ausgleich
wäre der Abstand zum Potenzial noch grösser geworden (13 statt 12).

### Ergebnis
| | vorher | jetzt |
|---|---|---|
| Zuwachs mit 16 | +6,2 | **+3,2** |
| Zuwachs mit 27, 12 Punkte Rückstand | ±0 | **+1,4** |
| Zuwachs mit 27, fast am Potenzial | ±0 | ±0 |
| Zuwachs mit 33 | −1,0 | −0,9 |
| Höchststärke im Median mit | 24 | **27** |
| Abstand zum Potenzial (Median) | 12 | **11** |

**Alle vier Zielbänder der Kalibrierung halten** — das war die eigentliche Gefahr bei
diesem Eingriff.

Der Prüfstand hält die Zusagen fest: kein Sprung über +5 mit 16, ein Spieler mit Lücke
muss mit 27 mehr wachsen als einer ohne, und mit 33 ist Schluss.

Prüfstand: **324 Prüfungen**, 0 Fehler. Bündel **1.060,19 kB**.

## 34.15 · Die Rückblick-Karten

Drei der vier gemeldeten Mängel behoben:

**Überschriften zu klein.** Sie standen in derselben Kleinschrift wie jede andere
Zeile — bei manchen Karten wusste man nicht, worum es geht. Jetzt in der
Anzeigeschrift (`clamp(19px,5.6vw,28px)`) mit einem Strich in der Kartenfarbe darunter.

**Nur eine Platzzahl statt Tabelle.** Jetzt ein Ausschnitt: zwei Plätze darüber, zwei
darunter, die eigene Zeile hervorgehoben. Man sieht auf einen Blick, ob es eng war.
Die Nachbarplätze stehen ohne Vereinsnamen — die haben wir für die Tabelle nicht, und
sie zu erfinden wäre schlimmer als ein Strich.

**Karte für verpasste Spiele fehlte ganz.** Eine Saison mit 18 Ausfällen ist etwas
anderes als eine durchgespielte, und genau das erzählt ein Rückblick. Die Karte zeigt
verletzt und gesperrt getrennt, nennt die Verletzung beim Namen und setzt die Einsätze
ins Verhältnis. **Sie erscheint nur, wenn wirklich etwas ausgefallen ist** — eine Karte
mit einer Null wäre genau die leere Seite, die beanstandet wurde.

Dafür musste `simulateSeason` erweitert werden: **Sperrspiele flossen bisher nur in
`missed` und waren danach verloren.** Die Karte hätte Verletzung und Sperre nicht
auseinanderhalten können. Jetzt steht `banned` in der Saison.

### Eine Prüfung, die ich nicht hinbekommen habe
Der Rückblick zeigt immer nur eine Seite. Mein Versuch, im Prüfstand durchzublättern
und den Text aller Karten zu sammeln, hat nicht gegriffen — der Weiter-Knopf wurde
nicht ausgelöst. **Statt die Prüfung zu verbiegen, bis sie grün ist**, prüft sie jetzt
die Datenlage: dass `banned` mit 4 ankommt und ohne Sperre 0 ist. Ob die Karten gut
aussehen, beantwortet nur das Gerät.

Prüfstand: **326 Prüfungen**, 0 Fehler. Bündel **1.062,15 kB**.

### Aus Block D bleibt offen
* **Mehr Möglichkeiten für Vermächtnis-Coins** (Wildcard neu ziehen, Saisonschub,
  Werte über 99). Das ist keine Fehlerbehebung, sondern **neue Spielmechanik** mit
  Folgen für die Kalibrierung — jede neue Ausgabemöglichkeit verschiebt, wie schnell
  die Akademie ausgebaut wird, und das steht in einem Zielband.
* **Freischaltungen als verdichtetes Untermenü.**

## 34.16 · Zwei Fehler aus Kevins Test

Kevins Test von 34.15: **17 von 19 Punkten in Ordnung.** Zwei Fehler.

### A1 · Die Zurück-Taste tat gar nichts
Ursache war ein **stilles `try/catch`**. Der Verlaufseintrag wurde mit
`window.history.pushState(...)` gelegt, umgeben von `try { … } catch (e) {}`.
Unter `file://` und `content://` wirft pushState einen Sicherheitsfehler — der
wurde verschluckt, es gab keinen Verlaufseintrag, und ohne den feuert `popstate`
nie. **Die Taste hatte nie eine Chance, und nichts im Code hat das gemeldet.**

Das ist genau das Muster, das hier schon zweimal Ärger gemacht hat: ein Fehler,
der weggeschluckt wird, sieht aus wie ein Erfolg.

Jetzt **drei Wege**, in dieser Reihenfolge:
1. **Capacitor** (`window.Capacitor.Plugins.App`) — meldet die Taste unabhängig
   vom Verlauf und ist in der APK der zuverlässige Weg. Dafür ist
   `@capacitor/app` in `package.json` dazugekommen — **^6.0.3, nicht ^6.2.0.**
   Ich hatte die Fassung ungeprüft von `@capacitor/core` übernommen; die gibt es
   für dieses Paket nicht, und `npm install` brach ab. Aufgefallen erst, als der
   Browsertest sich nicht mehr bauen liess. **Fassungsnummern nicht raten.**
2. Das `backbutton`-Ereignis auf `document`, das manche WebViews feuern.
3. Der **Verlauf** wie bisher — für den Browsertest.

`verlaufLegen()` gibt jetzt **zurück, ob es geklappt hat**, statt zu schweigen.
Der gewählte Weg steht in `window.RS_ZURUECK_WEG` und wird in der Diagnosezeile
des Messwerkzeugs angezeigt: „Capacitor", „Verlauf" oder
„keiner (pushState gesperrt)".

**Im Browsertest über `content://` wird weiterhin „keiner" stehen** — dort ist
pushState gesperrt, und daran kann die App nichts ändern. Der Weg über Capacitor
greift erst in der echten APK. **Das heisst: A1 lässt sich nur in der APK
abschliessend prüfen, nicht im Browsertest.**

> **Erledigt am 15.8.2026.** Kevin hat die Zurück-Taste in der APK durchprobiert:
> arbeitet wie gewollt, kein Fehler gefunden. Der Weg über Capacitor greift also.
> Damit ist A1 abgeschlossen und Block A vollständig.

### B3 · Der Spielerpass wuchs weiter
Die Grenze aus 34.8 griff erst **ab sieben Stationen** — bis dahin wuchs die
Liste frei, und weil beide Seiten im selben Rasterfeld liegen, wuchs die
Vorderseite mit. Die halbe Lösung war schlimmer als keine, weil sie das Problem
zu lösen schien.

Jetzt hat die Liste **immer** eine feste Höhe (150 px), von der ersten Station
an. Der Prüfstand vergleicht die Höhe bei 3 und bei 14 Stationen — sie muss
gleich sein.

Meine eigene Prüfung von 34.8 hat dabei angeschlagen: sie erwartete bei wenigen
Stationen *keine* Rollfläche. Gemessen am alten Stand hatte sie recht — die
Erwartung selbst war falsch.

Prüfstand: **330 Prüfungen**, 0 Fehler. Bündel **1.062,63 kB**.

### Was Kevins Test bestätigt hat
A2 Papierkorn · A3 Porträtgrösse · A4 Reiter · A5 Anzeigegrösse · B1 Zoom
gesperrt · B2 Akademie bei 0 % · B4 Rahmenwahl · B5 Stand im Menü · B6
Rentenfrage · B7 Bilanz-Hintergrund · B8 Namensvorschlag · B9 Pass wenden.
C und D stehen unter Langzeitbeobachtung.

## 34.17 · Die Freischaltungen

Vorher stand jede der 48 Freischaltungen als **eigene Karte mit Rahmen**
untereinander — eine sehr lange Kette, in der man nichts wiederfand.

Jetzt ein aufklappbares Verzeichnis:
* **Zugeklappt** (Vorgabe) eine Zeile mit „x von 48" und darunter die Zähler je
  Art: Neue Wildcards · Bessere Chancen · Startvorteile · Spielregeln · Neue
  Ereignisse · Aussehen. **Das ist die Übersicht, die vorher fehlte** — man
  sieht, wo noch etwas zu holen ist, statt nur, was man schon hat.
* **Aufgeklappt** nach Art gebündelt, je Freischaltung eine Zeile statt einer
  Karte: Name links, Wirkung rechts.

Zugeklappt beginnen ist Absicht: die Errungenschaften sind der Hauptinhalt
dieser Seite, die Freischaltungen das Nachschlagewerk dazu.

**Eine Prüfung war zu grob:** Sie suchte den Namen „Karte: Stadionikone" im
Text, um festzustellen, ob zugeklappt doch die Liste dasteht. Der Name steht
aber auch bei der Errungenschaft als Belohnung — die Prüfung schlug an, obwohl
alles stimmte. Jetzt werden die Artbänder gezählt, die es nur aufgeklappt gibt.

Prüfstand: **334 Prüfungen**, 0 Fehler. Bündel **1.064,20 kB**.

### Damit ist aus Block D nur noch eines offen
**Mehr Möglichkeiten für Vermächtnis-Coins.** Das ist keine Fehlerbehebung,
sondern neue Spielmechanik: Wildcard neu ziehen, Saisonschub, Trainingsschub,
Werte über 99 heben, Laufbahn mit demselben Spieler neu starten.

**Warum das eigen behandelt werden muss:** VC sind heute die einzige Währung für
den Ausbau der Akademie, und „Laufbahnen bis Vollausbau" ist eines der vier
Zielbänder (25–35, aktuell 32,3). Jede neue Ausgabemöglichkeit zieht Geld aus
diesem Topf und verschiebt das Band nach oben. Vor dem Einbau muss also
feststehen, ob die Akademie langsamer werden **darf** — oder ob die Einnahmen
mitwachsen sollen.

## 34.18 · Der Vermächtnis-Laden

Bis 34.17 gab es für VC genau eine Verwendung: die Akademie. Wer sie ausgebaut
hatte, sammelte ins Leere.

### Die Einnahmen, maßvoll
`vcFuer` bekommt am Ende einen Aufschlag von **18 %**. Er steht bewusst dort und
nicht in einem einzelnen Posten: so wirkt er gleichmässig, statt eine Quelle zu
verzerren, und man sieht ihm an, wofür er da ist.

| | vorher | jetzt |
|---|---|---|
| VC je Laufbahn (Mittel) | 50,3 | **57,9** |
| Laufbahnen bis Vollausbau | 31,1 | **27,0** |

Mit üblichen Einkäufen landet der Ausbau wieder bei rund 32 — im Zielband
(25–35), und **der Ausbau bleibt ein Langzeitziel.**

*Ein Umweg unterwegs:* Zuerst hatte ich den Grundposten von `score/26` auf
`score/21` geändert — das brachte nur +3 %, weil dieser Posten gar nicht der
grösste ist. Die Titel wiegen schwerer. Zurückgenommen und als Faktor am Ende
gelöst.

*Und eine Falle:* Die Kalibrierung würfelt bei jedem Lauf neu. Zwischen zwei
Läufen schwankte der Mittelwert um ±10 % — bei einer Messung sah der Aufschlag
wie eine Verschlechterung aus. **Einzelne Kalibrierläufe taugen nicht zum
Vergleich kleiner Änderungen.**

### Die sieben Artikel
| Artikel | Preis | wann |
|---|---|---|
| Neue Karte ziehen | 45 | nur vor dem Anpfiff, einmalig |
| Extraschicht (mehr Fortschritt, eine Saison) | 22 | in der Laufbahn |
| Lauf der Saison (Bestform) | 28 | in der Laufbahn |
| Der beste Physio (Verletzung weg) | 18 | sofort |
| Ein Berater, der zieht (stärkere Angebote) | 26 | in der Laufbahn |
| Der Trainer hört zu (Vertrauen auf 85) | 20 | sofort |
| Über das Limit (ein Wert bis 103, vier Saisons) | 70 | einmalig |

Gemessen an rund 58 VC je Laufbahn: Kleinigkeiten kosten unter einer halben
Laufbahn, der grösste Eingriff gut eine. Der Prüfstand schlägt an, wenn ein
Preis über 100 oder unter 10 liegt.

Jeder Artikel trägt ein **gezeichnetes Zeichen** (`SHOP_BILD`) — flach,
einfarbig, in der Sprache des Hefts. Der Prüfstand prüft, dass keines fehlt.

### Wo er liegt
* **Hauptmenü**: als Eintrag „Anzeigen" im Inhaltsverzeichnis, Seite 8 — eine
  Anzeigenseite, wie sie in jedem Sportheft steht.
* **In der Laufbahn**: als Knopf in der Kopfleiste mit Kassenstand, öffnet eine
  Überlagerung statt einer eigenen Phase. Ein Phasenwechsel würde den Schritt
  verlieren, in dem man gerade steckt.

### Die Brücke, die fast gefehlt hätte
Die Käufe liegen in `aka.laden` — gelesen werden sie aber über `p.laden` von
`develop`, `simulateSeason` und `makeOffers`. Ohne die Brücke wäre jeder Kauf
gebucht und wirkungslos gewesen: **genau das Muster, das in diesem Projekt schon
zweimal vorkam** (Pity-Zähler, Augenfarbe). Beim Kauf wird `p` deshalb
mitgezogen und gespeichert.

Laufende Käufe zählen am Saisonende herunter; einmalige bleiben stehen, damit
man sie nicht zweimal kauft.

Prüfstand: **342 Prüfungen**, 0 Fehler. Bündel **1.070,69 kB**.

### Noch nicht umgesetzt (in 34.19 nachgeholt)
`reroll` war ein Kauf ohne Folge — siehe 34.19.

## 34.19 · Der gekaufte Kartentausch wirkt

Der Artikel stand seit 34.18 im Laden und tat nichts. Jetzt verdrahtet, und
zwar an der **einen** Stelle, an der die Zahl der Tausche entsteht.

### Eine Quelle statt drei
Vorher stand `(p.meta && p.meta.mx_reroll) ? 2 : 1` **zweimal** im Quelltext:
in `rerollWildcard` und in `tauschRest`. Wären die auseinandergelaufen, hätte
der Knopf sichtbar sein können, ohne dass der Tausch durchgeht — oder umgekehrt.

Jetzt eine Funktion, drei Quellen:

    tauschMax(p) = 1
      + Freischaltung „mx_reroll"   (+1)
      + gekaufter Artikel „reroll"  (+1)

`rerollWildcard` und `tauschRest` lesen beide diese Funktion. Der Knopf in der
Ansicht liest `tauschRest` und erscheint dadurch von selbst — es war keine
Änderung an der Anzeige nötig.

### Zwei Lücken, die dabei aufgefallen sind
1. **Der Kauf kam beim Karrierestart nicht an.** `createPlayer` erzeugt einen
   frischen Spieler; `aka.laden` wurde nicht übertragen. Ein im Hauptmenü
   gekaufter Tausch wäre beim Anpfiff verschwunden gewesen — bezahlt und weg.
   Jetzt setzt `start()` das `q.laden` mit.
2. **Der Artikel stand nur unter „start".** Man kauft ihn aber meist erst, wenn
   man die gezogene Karte gesehen hat — und die sieht man in der Laufbahn. Jetzt
   „immer"; nutzbar bleibt er ohnehin nur, solange keine Saison gespielt ist,
   und das prüft `rerollWildcard` selbst.

### Geprüft wird die ganze Kette
| Lage | Tausche |
|---|---|
| ohne alles | 1 |
| gekauft | 2 |
| freigeschaltet | 2 |
| beides | 3 |

Dazu: der zweite Tausch geht **wirklich** durch (`wcRerolls` steigt auf 2), der
dritte ist gesperrt, und nach der ersten gespielten Saison geht gar nichts mehr
— auch mit Kauf. **Die Zählung allein hätte nicht gereicht:** sie hätte auch
gestimmt, wenn `rerollWildcard` den Tausch am Ende verweigert.

Prüfstand: **350 Prüfungen**, 0 Fehler. Bündel **1.070,77 kB**.
Laufbahnen bis Vollausbau: 26,3 — im Band.

## 34.20 · Der Laden nach dem ersten Blick aufs Gerät

### Der Zugang war eine Zeile, kein Knopf
Der Laden hing als Eintrag „ANZEIGEN" im Inhaltsverzeichnis des Titelblatts.
Auf dem Gerät las sich das wie ein **Artikel des Hefts**, nicht wie eine
Schaltfläche — zwischen „Ruhmeshalle" und „Jugendakademie" stand plötzlich
etwas, das keine Seite ist.

Jetzt ein Knopf **links neben dem Zahnrad**, gleiche Grösse und Form, mit dem
Sternzeichen aus der Karriere. Er färbt sich golden, sobald Coins da sind. Der
Verzeichniseintrag ist raus.

### Der Laden zeigte im Hauptmenü genau einen Artikel
Das war meine Filterung: Jeder Artikel hat ein `wann` — die meisten wirken erst
in einer Laufbahn, also blendete `shopFuer(wo)` sie im Hauptmenü aus. Übrig
blieb der Kartentausch. **Ein Laden mit einem Regal sieht aus wie ein Defekt**,
und man kann nicht ahnen, dass es mehr gibt.

Der Filter ist weg. Der Laden zeigt **immer alle sieben**; was ohne laufende
Laufbahn nicht geht, ist gesperrt und gedämpft, mit dem Grund darunter
(„erst in der Laufbahn"). Neu: `ladenGesperrt(a, wo)`.

Gemessen: **Hauptmenü 7 Artikel, 6 gesperrt · Laufbahn 7 Artikel, 0 gesperrt.**
Der Prüfstand zählt beides — vorher hätte er den Unterschied nicht bemerkt,
weil er nur zählte, ob die Zahl der Knöpfe zur *gefilterten* Liste passt. Eine
Prüfung, die die eigene Annahme nachrechnet, findet den Fehler in der Annahme nie.

Es ist übrigens derselbe Laden — Hauptmenü und Karriere führen in dieselbe
Ansicht, nur mit anderem `wo`.

Prüfstand: **352 Prüfungen**, 0 Fehler. Bündel **1.071,14 kB**.

## 34.21 · Laden und Zahnrad lagen aufeinander

Kevin hat es auf dem Gerät gesehen: die beiden Knöpfe oben rechts im
Hauptmenü steckten ineinander, statt nebeneinander zu sitzen.

### Ein Rand hilft nicht, wenn das Element absolut sitzt
Beide Knöpfe trugen dieselbe Klasse `.zahnrad` mit `position:absolute` und
`right:0`. Der Laden bekam zusätzlich `marginRight: 6` — und das war der
Denkfehler. Bei absoluter Lage löst der Browser die Gleichung

    left + Breite + margin-right + right = Breite des Behälters

Der Rand verschiebt das Element also **um seinen eigenen Betrag**, nicht um
die Breite des Nachbarn. 40 px Knopf gegen 6 px Versatz sind 34 px
Überlappung. Das Zahnrad steht später im Baum und lag deshalb obenauf.

In Chromium nachgemessen (412 px breit, wie auf dem S24 Ultra):

| | Laden | Optionen | Ergebnis |
|---|---|---|---|
| vorher 34.20 | 354–394 | 360–400 | **34 px Überlappung**, 85 % verdeckt |
| nachher 34.21 | 312–352 | 360–400 | **8 px Abstand** |

### Nicht die Zahl korrigiert, sondern die Konstruktion
`right:46px` hätte es auch getan, wäre aber eine Zahl, die stillschweigend
von der Knopfbreite abhängt. Stattdessen:

* neuer Behälter `.kopfknoepfe` — `display:flex; gap:8px`
* `.zahnrad` verliert `position:absolute`, `top`, `right` und `z-index` und
  ist nur noch die Form des Knopfes
* die Kopfleiste selbst ist eine Flexzeile mit `space-between`

Zwei Knöpfe können damit gar nicht mehr aufeinander liegen, und ein dritter
ließe sich ohne neue Zahl anhängen. **Nebenwirkung mit Absicht:** vorher
konnte die Beschriftung „AUSGABE 01" bei hochgestellter Textgröße unter die
absolut gesetzten Knöpfe rutschen. In der Flexzeile schrumpft sie stattdessen.

### Die Prüfung dazu — und warum sie im CSS nachsieht
jsdom rechnet kein Layout. Der Baum sah vorher und nachher gleich aus; keine
der 352 Prüfungen konnte diesen Fehler sehen. Neu sind deshalb zwei Ebenen:

1. **Im Prüfstand** (`ansichten.jsx`, 7 Prüfungen): beide Knöpfe liegen in
   **einem** Behälter, der `.kopfknoepfe` heißt und beschriftet ist; und die
   Stilregel selbst — `.zahnrad` darf nicht absolut sein, `.kopfknoepfe` muss
   Flex mit Abstand sein. Dafür ist `CSS` neu in `exporte.txt`.
2. **Im echten Browser** (`kopfleiste.cjs`): misst den Abstand wirklich.

**Gegengeprüft:** gegen die unveränderte 34.20 gefahren, schlagen drei der
neuen Prüfungen an, darunter „`.zahnrad` steht wieder auf position:absolute".

*Eigener Fehler dabei:* Die Zusammenfassungszeile meldete zuerst fest
„`.zahnrad` nicht absolut" — auch dann noch, als die Prüfung zwei Zeilen
darüber das Gegenteil festgestellt hatte. Erst in der Gegenprobe aufgefallen.
Sie nennt jetzt den gemessenen Zustand.

### Zwei Falschalarme in `startprobe.cjs` — schon in 34.20 rot
Beim Bauen des Browsertests fiel auf, dass die Startprobe auf der
**unveränderten** 34.20 zwei Fehlschläge meldete. Beide waren Muster, die auf
alte Zeichenketten eingefroren waren:

| Prüfung | suchte nach | steht dort seit |
|---|---|---|
| Halbtonraster im Grundstil | `rgba(237,242,233,.030)` | `currentColor` |
| Rasterschalter setzt Aufsatzstil | `.fl{background:radial-gradient` | `.fl{background:var(--bg)` (34.20) |

Beide prüfen jetzt die Absicht statt des Wortlauts: dass `.raster` im
Grundstil überhaupt einen Radialverlauf trägt, und dass der Schalter einen
Aufsatzstil mit `!important` auf `.fl` und `.raster` legt.

Startprobe vorher **11 von 13**, jetzt **13 von 13**. Eine Prüfung, die immer
rot ist, wird genauso ignoriert wie eine, die immer grün ist.

### Geprüft
Prüfstand: **359 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.071,56 kB** (vorher 1.071,14 — die 0,42 kB sind der neue Behälter).
Rückwärtsprüfung 6 × 63 Ansichten fehlerfrei, `package.json` unverändert.

**Von Kevin auf dem Gerät bestätigt (15.8.2026):** die Zurück-Taste des
Handys arbeitet in der APK wie gewollt, kein Fehler gefunden. Damit ist der
letzte Punkt aus Block A erledigt.

## 34.22 · Der Laden rechnet ab, und zwei Texte

Vier von sechs gemeldeten Punkten. Zwei davon waren derselbe Fehler.

### Der Laden: zwei Kopien, nur eine wurde kleiner
Gekauftes stand in `aka.laden` (dauerhaft, im Laden angezeigt) und in `p.laden`
(am Spieler, wirksam). Heruntergezählt wurde am Saisonende **nur `p.laden`**.
Drei Folgen, von denen Kevin nur die erste gesehen hat:

1. Im Laden stand für immer „läuft“ — auch Laufbahnen später.
2. **Nachkaufen war dauerhaft gesperrt**, weil der Kauf gegen einen Zähler
   prüfte, der nie wieder 0 wurde.
3. **`start()` schenkte den Kauf jeder weiteren Laufbahn erneut.** Einmal
   Extraschicht bezahlt hiess: ab jetzt in jeder Laufbahn gratis dabei.

Dazu ein vierter, unbemerkter: **Physio und Trainer wirken sofort**, trugen sich
aber trotzdem als „läuft“ ein und blockierten sich damit für immer selbst.

### Ein Modell statt eines Schalters
`einmal: true` ist weg. Jeder Artikel trägt jetzt eine Art:

| Art | Bedeutung | Artikel |
|---|---|---|
| `dauer: 0` | wirkt sofort, hinterlässt **nichts**, beliebig oft kaufbar | Physio, Trainer |
| `dauer: n` | läuft n Saisons, zählt herunter, danach nachkaufbar | Extraschicht, Lauf der Saison, Berater (1) · Über das Limit (4) |
| `vorrat` | stapelt sich, wird beim Tausch verbraucht | Kartentausch |

Und zwei Orte mit klarer Aufgabe: **`p.laden`** ist, was in der laufenden
Laufbahn wirkt. **`aka.laden`** ist reiner **Vorrat** — im Hauptmenü gekauft,
beim Anpfiff übergeben und dabei **geleert**. Die Ladenansicht liest den
Bestand, der wirklich gilt (`p ? p.laden : aka.laden`).

Kaufbarkeit entscheidet **eine** Funktion, `ladenKaufbar(a, laden)`, die Anzeige
und Kauf beide lesen — vorher stand die Regel zweimal da.

Das Herunterzählen liest die Dauer jetzt **aus `VCLADEN`** statt aus einer von
Hand gepflegten zweiten Liste `["training","form","berater","ueber99"]`. Ein
neuer Artikel mit Dauer wäre dort schlicht vergessen worden und hätte ewig
gegolten.

Nebenbei: der Preis steht jetzt **immer** am Artikel. Vorher stand bei
Laufendem nur „läuft“, und man konnte nicht sehen, was ein weiterer Kauf kostet.

### Der Kartentausch ist ein Zähler
`tauschMax` liest `p.laden.reroll` nicht mehr als Ja/Nein, sondern als Zahl.
Jeder Kauf gibt einen weiteren Tausch — genau wie gewünscht, statt einer
einmaligen Freischaltung fürs Leben.

### Geprüft, und die Prüfung gegengeprüft
15 neue Prüfungen. Der Kern ist nicht die Zählung, sondern **eine echte Saison
durch `simulateSeason`**: `training 1→0 · ueber99 4→3 · Vorrat reroll 2→2 ·
danach nachkaufbar: ja`.

**Gegenprobe:** das Herunterzählen künstlich wieder ausgebaut — drei Prüfungen
schlagen an, darunter „training ist nach Ablauf immer noch nicht nachkaufbar“.

*Und derselbe eigene Fehler wie in 34.21:* meine Zusammenfassungszeile meldete
fest „danach nachkaufbar ✓“, auch als die Prüfung darüber rot war. Erst in der
Gegenprobe aufgefallen. **Zum zweiten Mal in zwei Fassungen** — Protokollzeilen
gehören grundsätzlich an den gemessenen Wert, nicht an den erwarteten.

### Der Aufmacher der Ruhmeshalle log
Unter „WER LÖST … AB?“ stand fest: *„Die Ruhmeshalle steht voll. Jetzt fehlt nur
noch einer: deiner.“* Der Zweig greift ab dem **ersten** Eintrag — im
Inhaltsverzeichnis direkt darunter stand dann „Ruhmeshalle · 1“. Dazu
widerspricht der Satz sich selbst: was voll ist, dem fehlt nichts. Jetzt nennt
er die tatsächliche Zahl und den Punktwert, den es zu schlagen gilt.

### Das Namensfeld liess sich nicht leeren
`setEigenerName(wert.length > 0)` lief bei **jedem** Tastendruck und fiel beim
Löschen des letzten Zeichens auf falsch zurück — der Vorschlag sprang sofort
wieder hinein, man konnte das Feld nie leeren, um selbst zu tippen. Die
Markierung ist jetzt **klebrig**: einmal angefasst, gehört das Feld dem Spieler.
Zurück zum Vorschlag geht über einen Knopf daneben, der über einen eigenen
Drehzähler jedes Mal einen anderen Namen liefert. Ein leeres Feld beim Anpfiff
fällt auf den Vorschlag zurück, damit niemand namenlos startet.

### Geprüft
Prüfstand: **374 Prüfungen**, 0 Fehler, alle vier Zielbänder
(Vollausbau 27,1 · Kosten 1.564 · Weltklasse 4 · Rautekarte 34).
Bündel **1.072,54 kB**. Rückwärtsprüfung 6 × 63 Ansichten fehlerfrei.

**Wichtig zur Kalibrierung:** mehr Kaufmöglichkeiten heissen mehr VC-Abfluss.
Das Band „Laufbahnen bis Vollausbau“ hält (27,1 in 25–35), weil die Kalibrierung
nicht einkauft. **Wie stark sich mehrfaches Nachkaufen im echten Spiel auf den
Ausbau auswirkt, ist damit NICHT gemessen** — das zeigt erst Kevins Langzeittest.

## 34.23 · Jede neue Seite beginnt oben

Kevin: „Wenn ich eine neue Laufbahn starte, startet das Bild nicht
grundsätzlich am oberen Ende der Charaktererstellung." Und die richtige
Frage hinterher: **betrifft das auch andere Seitenwechsel?**

**Ja, alle.** Es gab dafür nirgends etwas. `zumAnfang(el)` existiert seit
längerem, springt aber an den Anfang eines *Bereichs innerhalb* einer Seite
und wird nur an **zwei** Stellen gerufen, beide bei Reiterwechseln. Der
Seitenwechsel selbst war ungeregelt: der Browser behält die Rollhöhe, und die
neue Seite erscheint an derselben Stelle, an der man vorher war.

### Eine Stelle statt siebzehn
Welche Seite gezeigt wird, hängt allein an `phase` (17 Wechsel) und `step`.
Also ein einziger Effekt darauf, statt siebzehn einzelner Aufrufe, die man beim
achtzehnten vergisst:

    useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); },
              [phase, step]);

Ohne weichen Übergang: beim Seitenwechsel ist der alte Inhalt schon weg, weiches
Rollen sähe wie ein Fehler aus. Das Fenster rollt, kein innerer Behälter — das
ist im CSS ausdrücklich so festgehalten und wurde vorher nachgesehen.

### Gemessen in echtem Chromium
Neues Werkzeug `pruefstand/seitenanfang.cjs`. Fenster 412 × 560, damit die
Seiten sicher überlaufen; je Fall frisch laden, ganz nach unten rollen,
Seitenwechsel auslösen, `window.scrollY` messen.

| Wechsel | vorher 34.22 | nachher 34.23 |
|---|---|---|
| Hauptmenü → Erstellung | 352 px → **352 px** | 352 px → **0** |
| Errungenschaften → Menü | 14.201 px → **352 px** | 14.201 px → **0** |
| Menü → Errungenschaften | 352 px → **352 px** | 352 px → **0** |
| Erstellung → Menü | 1.484 px → **352 px** | 1.484 px → **0** |

### Zwei Fehler im Prüfmittel, beide vor dem Ergebnis gefunden
1. **Ein Falschgrün.** Der erste Entwurf fuhr mit 412 × 915. Im frischen
   Zustand ist das Hauptmenü dort **exakt fensterhoch** (915 von 915 px) — es
   gab nichts zu rollen, `scrollY` war vorher wie nachher 0, und die Prüfung
   meldete zufrieden „bestanden", ohne etwas gemessen zu haben. Jetzt ein
   niedrigeres Fenster **und** die Bedingung, dass vorher wirklich mindestens
   60 px gerollt wurde; wer nicht herunterkam, meldet „nicht messbar", und das
   zählt als Fehlschlag.
2. **„Neue Laufbahn" wurde nie gefunden.** Der Knopf bricht die Zeile um,
   `innerText` liefert `NEUE\nLAUFBAHN`, und `includes("neue laufbahn")` trifft
   das nicht. Jetzt wird der Leerraum vorher vereinheitlicht.

Ruhmeshalle und Akademie werden **bewusst nicht** geprüft: im frischen Zustand
sind beide zu kurz zum Rollen. Lieber eine Prüfung weniger als eine, die nichts
sieht.

### Geprüft
Prüfstand: **374 Prüfungen**, 0 Fehler, alle vier Zielbänder
(Vollausbau 27,3 · Kosten 1.564 · Weltklasse 4 · Rautekarte 33).
Bündel **1.072,65 kB**. Startprobe 13 von 13. Seitenanfang 4 von 4.

## 34.24 · Der Spielerpass: Stärke, Binden, Flaggen

Erster Teil eines Blocks von elf Punkten. Dieser Abschnitt deckt drei davon —
alle am Spielerpass, und einer davon schliesst nebenbei einen Teil des seit
34.22 offenen Pass-Wachstums.

### Die Stärke läuft hoch und feiert Marken
Vorher stand dort eine nackte Zahl, die beim Saisonwechsel einfach eine andere
war. Jetzt läuft sie über 900 ms hoch (`Zahl`, gab es schon), und beim
Überschreiten von **60 · 70 · 80 · 85 · 90 · 95 · 99** gibt es einen kurzen
Puls: die Zahl wird golden, wächst und fällt zurück, links daneben schiebt sich
die erreichte Marke herein und nach 2,4 s wieder weg.

Drei Bedingungen, damit das nicht zur Tapete wird:
* nur bei **Anstieg**, nie beim Fallen,
* **nicht beim ersten Aufbau** — sonst blinkt der Pass bei jedem Öffnen,
* gar nicht, wenn „Bewegung reduzieren“ (`RUHE`) an ist.

Werden mehrere Marken auf einmal genommen, zeigt er die höchste.

### Die Binden hatten keinen Platz — und liessen den Pass wachsen
Beide Kapitänsbinden hingen in **derselben Flexzeile wie der Name**, mit
`flexWrap: "wrap"`. Bei langem Namen rutschten sie in Zeile zwei. Weil beide
Passseiten im selben Rasterfeld liegen, wuchs damit **der ganze Pass** — das ist
ein Teil des offenen Punkts 8, und er hatte nichts mit der Vereinsliste zu tun.

Jetzt haben sie einen festen Platz rechts unter der Stärke: untereinander,
rechtsbündig, ausserhalb jeder Zeile, die umbrechen kann.

### Flaggen auf der Nationalbinde — und was das nicht ist
Die Binde der Nationalmannschaft trägt jetzt die **Bauart** der Landesflagge
statt zweier Farbhälften: liegende Streifen, stehende Streifen, skandinavisches
Kreuz oder Fläche mit Scheibe. 33 Nationen sind hinterlegt, mit dritter Farbe wo
die Flagge wirklich drei hat.

**Ehrlich gesagt, was das NICHT ist: eine Flaggensammlung.** Von 212 Nationen
haben nur 33 überhaupt Farben, und Wappen, Sterne oder Halbmonde wären auf einem
22 Punkt hohen Band ein Fleck. Wer nicht in der Liste steht, bekommt liegende
Streifen aus seinen zwei Farben — dieselbe Darstellung wie bisher. Die
**Vereinsbinde bleibt in Vereinsfarben**; eine Landesflagge am Vereinskapitän
wäre falsch.

Der Kennbuchstabe C hat jetzt einen Saum, weil er sonst auf der mittleren
Flaggenbahn verschwindet.

### Geprüft
5 neue Prüfungen. Der Kern: **kein Vorfahr einer Binde darf `flexWrap:"wrap"`
tragen**, und keine Binde darf mehr in der Namenszeile stecken. jsdom rechnet
kein Layout und sieht den Umbruch nicht — geprüft wird deshalb die Ursache.

**Gegenprobe:** die alte Anordnung wiederhergestellt — beide Prüfungen schlagen
an („2 Binde(n) hängen in einer umbrechenden Zeile“).

Prüfstand: **379 Prüfungen**, 0 Fehler, alle vier Zielbänder
(Vollausbau 26,2 · Kosten 1.564 · Weltklasse 4 · Rautekarte 33).
Bündel **1.076,92 kB**. Startprobe 13 von 13. Seitenanfang 4 von 4.

### Was NICHT gemessen ist — und warum es hier steht
Ich wollte die Passhöhe mit langem Namen im Browser vorher/nachher vergleichen.
**Der Versuch ist gescheitert:** die Kartenenthüllung liess sich nicht
zuverlässig wegklicken und der lange Name kam nicht ins Feld, also lag der Pass
nie frei. Gemessen wurden zweimal 280 px — beides Mal die verdeckte Ansicht,
also **kein Beleg für gar nichts**. Es wäre die dritte Falschgrün-Falle in vier
Fassungen gewesen; sie steht hier, damit sie niemand als Nachweis liest.

**Offen bleibt daher:** ob die Vorderseite mit langem Namen jetzt wirklich
konstant hoch ist, muss Kevin auf dem Gerät sehen. Strukturell kann sie es,
gemessen ist sie nicht.

Ebenfalls nicht visuell geprüft: **wie die Flaggenbinden aussehen.** Sie
erscheinen erst, wenn man Kapitän ist, und dorthin kommt der Prüfstand nicht.

## 34.25 · Die Ränge der Errungenschaften

Zwei gemeldete Punkte, zwei verschiedene Ursachen — aber dieselbe Farbtabelle.
Deshalb zusammen: hätte man nur die Farben geändert, wäre der Kontrast wieder
ein anderer gewesen.

### Warum die Karten anders aussahen als die Übersicht
Jede Stufe hatte ZWEI von Hand gepflegte Farben: `col` für dunklen Grund,
`colK` für Karton. Die Übersicht oben zeichnete einen Punkt in `col`, die Karte
einen Block in `colK`. Legendär war oben cremefarben (`#F3E7BE`) und auf der
Karte olivbraun (`#6B5A2A`) — dieselbe Stufe, zwei Farben.

Beide Werte waren für sich genommen *richtig* gewählt: hell auf dunkel, dunkel
auf hell. Nur ergaben sie zusammen keine Stufe mehr, die man wiedererkennt.

**Jetzt eine Farbe je Stufe.** Die dunkle Variante für dünne Linien wird
gerechnet (`stufeDunkel`, Faktor 0,46), nicht gepflegt. Und Übersicht wie Karte
benutzen dasselbe Bauteil `Rangblock` — ein Bauteil kann nicht auseinanderlaufen.
Damit blasse Stufen auf hellem Karton nicht verschwinden, trägt der Block einen
Rand in der gerechneten dunklen Variante.

### Warum der Rang unlesbar war — ein Spezifitätskonflikt
`.stufe` setzt `color:var(--karton)`, also helle Schrift. Aber `.karton .m` ist
mit (0,2,0) spezifischer als `.stufe` mit (0,1,0), und der Block trägt beide
Klassen. Auf jeder Karton-Karte gewann also `var(--tinte2)` — **dunkle Tinte auf
dunkler Fläche.** Ausserhalb einer Karte (Saisonbilanz) stimmte es, deshalb fiel
es nur auf den Karten auf.

Die Schriftfarbe wird jetzt aus der Leuchtdichte gerechnet und **inline**
gesetzt. Inline schlägt jede Klasse — der Konflikt kann nicht wiederkommen.

### Ein Befund, den erst die Prüfung gebracht hat
Die neue Kontrastprüfung meldete sofort: **Bronze `#A5713C` erreicht nur 3,73**
mit heller und 4,23 mit dunkler Schrift. Beides unter den nötigen 4,5 für eine
9 Punkt grosse Versalzeile — die Stufe wäre auch nach der Umstellung grenzwertig
geblieben. Bronze ist jetzt `#8A5A29` und trägt helle Schrift mit **5,24**.

| Stufe | Farbe | Schrift | Kontrast |
|---|---|---|---|
| Bronze | `#8A5A29` | hell | 5,24 |
| Silber | `#9AA5B4` | dunkel | 7,08 |
| Gold | `#E8B84B` | dunkel | 9,58 |
| Platin | `#5E9BD8` | dunkel | 6,02 |
| Legendär | `#F3E7BE` | dunkel | 14,28 |

### Geprüft
Die Prüfung vergleicht **nicht die Tabelle, sondern das Gezeichnete**: alle
`.stufe`-Blöcke der Ansicht werden nach Stufennamen gruppiert, und jede Gruppe
muss genau EINEN Hintergrund haben. Die Tabelle war ja gerade das Problem — eine
Prüfung, die sie mit sich selbst vergleicht, hätte nichts gefunden.

**Gegenprobe:** alter Zustand wiederhergestellt — fünf Prüfungen schlagen an,
darunter „verschiedene Farben für dieselbe Stufe" und „14 Stufenblöcke ohne
eigene Schriftfarbe".

Zwei bestehende Prüfungen mussten mitziehen: sie zählten `.stufe.punkt` und
erwarteten fünf Filterpunkte. Die gibt es nicht mehr, die Übersicht zeigt
denselben Block wie die Karte. Jetzt wird auf 9 + 5 = 14 Blöcke und **null**
Punkte geprüft.

Prüfstand: **383 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.077,14 kB**. Startprobe 13 von 13.

## 34.26 · Der Rückblick liegt auf Karteikarten

Die Seiten des Saison- und Karriererückblicks standen frei im dunklen Schleier
und blendeten beim Weitertippen nur ein. Jetzt liegen sie auf einer
Karteikarte, die von rechts hereingezogen wird, während die alte nach links
verschwindet.

### Die Gestaltung
Heller Karton, harte Kante, versetzter Schatten (`4px 5px 0`), eine
zurückhaltende Linierung wie auf einer Karte aus dem Kasten, der rote Randstrich
links, und oben ein Reiter von 5 px in der Farbe der jeweiligen Seite. Damit
sitzt der Rückblick in derselben Sprache wie Errungenschaften, Spielerpass und
Ruhmeshalle: **helles Papier auf dunklem Grund.**

### Der Kniff mit den Farben
Die Seiten benutzen an **78 Stellen** Farben für dunklen Grund — `var(--ac)`,
`var(--go)`, `var(--mu)`. Auf hellem Karton wären die unlesbar; das ist genau
der Fehler, der in 34.25 bei den Rängen steckte.

Statt 78 Stellen von Hand umzuschreiben, werden die Variablen **auf der Karte
neu gesetzt**:

    .karteikarte{ --ac:var(--ac-k); --go:var(--go-k); --mu:var(--tinte2); … }

Variablen vererben sich nach innen, also löst jedes `var(--ac)` im Inhalt von
selbst zur Kartonfassung auf. **Eine Stelle statt achtundsiebzig**, und es kann
keine vergessen werden.

Zwei Farben konnten das nicht: `noteCol` liefert rohe Hexwerte, und
`#B9C4BE`/`#F2C230` verschwinden auf Karton fast völlig — dafür gibt es jetzt
`noteColK`. Und die Hervorhebung der eigenen Tabellenzeile war ein Gelb bei
12 %, auf Karton unsichtbar; sie ist jetzt eine dunklere Tönung bei 15 %.

### Die Ziehbewegung braucht zwei Karten
Vorher wurde die Seite über `key={i}` neu aufgebaut — die alte Karte war im
selben Augenblick nicht mehr gezeichnet, ein Hinausziehen war also unmöglich.
`useBlaettern` merkt sich jetzt die hinausziehende Seite für 360 ms. Beide
Karten liegen im **selben Rasterfeld** übereinander; die alte nimmt keine
Tipper an und verschwindet danach. Im Ruhemodus fällt beides weg.

### Ein Bauteil statt zwei Kopien
Saison- und Karriererückblick waren zweimal dasselbe Gerüst mit leicht
verschiedener Überschrift. Beide benutzen jetzt `Rueckblickkarte` und
`useBlaettern` — zwei Kopien derselben Gestaltung laufen auseinander, sobald man
eine davon anfasst. Dasselbe Muster wie bei den Rangfarben in 34.25 und bei
`aka.laden`/`p.laden` in 34.22.

### Geprüft
Prüfstand: **388 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.080,19 kB**. Startprobe 13 von 13.
Fünf neue Prüfungen, darunter: die Karte wird gezeichnet und trägt eine
Reiterfarbe, die Farbumdeutung steht vollständig im Stilblock, und beide
Bewegungen sind da.

### Was NICHT geprüft ist
**Wie die Karteikarte im laufenden Spiel aussieht, habe ich nicht gesehen.**
Der Rückblick liegt hinter einer ganzen gespielten Saison, und mein Skript kam
im Browser nicht dorthin. Der Prüfstand bestätigt, dass die Karte gebaut wird
und die Farbumdeutung steht — **wie sie wirkt, muss Kevin im Browsertest
ansehen.** Besonders: ob die Linierung zu stark oder zu schwach ist und ob die
Ziehbewegung bei 360 ms zu schnell oder zu träge wirkt.

### Korrektur einer eigenen Notiz
In 34.24 stand hier der Verdacht, `.zellen` lasse den Spielerpass wachsen
(`flex-wrap:wrap` mit `flex:1 0 auto`). **Das hält der Nachrechnung nicht
stand:** die vier Felder sind label-breit, zusammen rund 324 px, und damit
passen sie bei 412 px Fensterbreite in eine Zeile. Die bestätigte Ursache war
die Kapitänsbinde in der umbrechenden Namenszeile, und die ist behoben. Ob
überhaupt noch etwas wächst, ist offen — und **gemessen ist es nicht.**

## 34.27 · Drei wirklich runde Kopfformen

Erster von vier Porträt-Punkten. Die anderen drei stehen weiter offen — dazu
unten.

### Warum „Rund“ nicht rund war
Der Porträtbogen zeigt es sofort: „Rund“ (b 27, j 19) unterschied sich von
„Oval“ (b 25, j 15) fast nur in der Breite. Ein Kopf wirkt aber nicht durch
Breite rund, sondern durch einen **breiten Kiefer** (`j`) und ein **kurzes
Gesicht** (`kinn`). Genau daran fehlte es.

Angehängt, mit Betonung auf ANGEHÄNGT:

| Form | b | j | kinn | Wirkung |
|---|---|---|---|---|
| Vollmond | 28 | 24 | 66 | breit, sehr breiter Kiefer, kurzes Gesicht |
| Breit | 29 | 22 | 69 | ausladend, kräftige Wangen |
| Weich | 25,5 | 21 | 67 | schmaler, aber ohne Kanten |

**Bestehende Gesichter ändern sich nicht.** Die Indizes 0–4 behalten ihre
Bedeutung, und gespeicherte Laufbahnen tragen das Merkmalsobjekt, nicht die
Kennung. Neu erzeugte Gesichter greifen auf acht statt fünf Formen zu.

### Der Porträtbogen läuft wieder
Er war unbenutzbar: `portraetbogen.cjs` verlangt ein gebündeltes `motor.js`,
das `pruefen.sh` nicht erzeugt, `cairosvg` fehlte, und `@capacitor/preferences`
liess sich für Node nicht auflösen. So geht es:

    cp App.jsx storage.js schriften.js /tmp/ps/ && cd /tmp/ps
    cat App.jsx pruefstand/exporte.txt > probe.jsx        # sinngemäss
    npx esbuild probe.jsx --bundle --outfile=motor.js --platform=node \
        --format=cjs --external:react --external:react-dom \
        --external:@capacitor/preferences
    cp pruefstand/portraetbogen.cjs . && node portraetbogen.cjs kreuz bogen.svg kopf
    python3 -c "import cairosvg;cairosvg.svg2png(url='bogen.svg',write_to='bogen.png',output_width=1200)"

Zwei Fallen: `portraetbogen.cjs` muss **im selben Verzeichnis wie `motor.js`**
liegen, weil `require("./motor.js")` relativ zum Skript auflöst — und es darf
nicht unter `/home/claude` laufen, weil dessen `package.json` `"type":"module"`
setzt und das CJS-Bündel dort nicht lädt. Für `@capacitor/preferences` genügt
ein Platzhalter in `node_modules`.

Ohne dieses Werkzeug ist Porträtarbeit Blindflug. Es gehört vor jede weitere
Änderung am Gesicht gefahren.

### Geprüft
Prüfstand: **391 Prüfungen**, 0 Fehler, alle vier Zielbänder.
„60 gezeichnete Auswahlmöglichkeiten in 8 Merkmalen · 7 Augenfarben ·
**8 Kopfformen**“. Bündel **1.080,27 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei —
alte Spielstände bleiben also lesbar.

### Was von diesem Block NICHT gemacht ist
Drei der vier Porträt-Punkte stehen offen, und zwar bewusst:

* **Nationalitätstypische Merkmale.** Haut und Haar werden über
  `hautBereich`/`haarBereich` bereits nach Herkunft eingegrenzt — das ist die
  richtige Bauweise und der Weg für Nase, Mund und Augen: **Bereiche, keine
  festen Zuordnungen**, damit jede Nation eine Spanne von Gesichtern hervorbringt
  statt eines Typs. Dafür müssen Nase (5), Mund (5) und Augen (5) erst nach
  Merkmal geordnet erweitert werden — schmal bis breit, flach bis voll. Das ist
  Arbeit im 347 Zeilen langen Zeichner.
* **Statur wirkt aufs Gesicht.** Braucht dieselbe Erweiterung als Grundlage.
* **Weibliche Porträts.** Ebenso — plus ein neues Merkmal `schminke`, das
  hinten an `ZUEGE_ORDNUNG` angehängt werden muss.

Alle drei greifen in dieselben Merkmale. Einzeln nacheinander hiesse, dieselben
Gesichter dreimal neu auszubalancieren. Sie gehören in **eine** Sitzung, mit dem
Porträtbogen offen.

## 34.28 · Zwei Kopfformen ohne markantes Kinn

Kevins Befund am Porträtbogen: bei **allen** Formen steht das Kinn unten
seitlich heraus. Er hat recht, und die Ursache steckt in `kopfPfad`: die
Kieferlinie läuft senkrecht von `kinn-8` bis `kinn-1` und knickt dann scharf zum
Kinn ab. Das erzeugt zwei sichtbare Ecken.

### Eine Kinnbreite, die überall gilt
Neu ist `kinnBreite(k) = k.j * (k.kv ?? 1)` — die Kieferbreite **am Kinn**.
Ohne `kv` ist sie gleich der Kieferbreite oben, also sind alle zehn bisherigen
Formen bitgleich. Nur Formen mit `kv` laufen nach unten schmaler zu.

**Der Fallstrick:** `kopf.j` steuert nicht nur die Hülle. Auch die Schattenseite
der Wange, zwei Bartformen und der Kinnriemen rechnen damit. Hätte ich nur die
Hülle verjüngt, hätte der Bart über das Kinn hinausgezeichnet — genau der
Fehler, der in 34.1 vier Frisuren betraf. `kinnBreite` gilt deshalb an **allen
sechs Stellen** im Kinnbereich.

Es gibt keinen Beschnitt auf die Kopfhülle: Bart und Schatten werden frei
gezeichnet. Wer künftig an der Kieferlinie etwas ändert, muss diese Stellen
mitziehen — oder erst einen `clipPath` auf `kopfD` einführen.

| Form | b | j | kinn | kv |
|---|---|---|---|---|
| Zart | 24 | 15 | 70 | 0,58 |
| Rundlich | 27,5 | 21 | 68 | 0,58 |

### Geprüft, und zwar angesehen
Porträtbogen zweimal gefahren: `kreuz kopf` zeigt die zehn Formen, `kreuz bart`
alle zehn Bärte über alle zehn Formen. **Die Bärte folgen der neuen Kieferlinie
und bleiben überall innerhalb der Hülle.**

Prüfstand: **393 Prüfungen**, 0 Fehler, alle vier Zielbänder.
„62 gezeichnete Auswahlmöglichkeiten · **10 Kopfformen**“.
Bündel **1.080,37 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.

## 34.29 · Herkunft, Statur und Geschlecht wirken aufs Gesicht

Die letzten drei Punkte des Blocks. Sie greifen alle in dieselben Merkmale und
sind deshalb zusammen gemacht.

### Spannen, keine Typen
**Nirgends steht „Nation X hat Nase Y".** Hinterlegt ist je Region eine SPANNE
von Rängen; die Spannen überlappen sich stark. Jede Herkunft bringt damit eine
Bandbreite von Gesichtern hervor, und jedes Gesicht bleibt möglich — nur die
Häufigkeit verschiebt sich. Das ist dieselbe Bauweise, die `hautBereich` und
`haarBereich` seit jeher benutzen, jetzt auch für Nase, Mund und Lidspalt.

### Warum es Ränge braucht
Die gezeichneten Formen sind nicht nach Größe sortiert — Nasenbreiten stehen als
`[2.5, 3.2, 2, 2.9, 2.7, …]` in der Reihenfolge, in der sie entstanden sind. Man
darf sie **nicht** sortieren: der Index steckt in jedem gespeicherten Gesicht.
`NASE_RANG`, `MUND_RANG` und `AUGEN_RANG` ordnen sie, ohne sie zu bewegen. Eine
Spanne bezieht sich auf Ränge, `ausSpanne` übersetzt zurück in den Index.

### Neu gezeichnet, hinten angehängt
* **Nasen:** drei breitere (3,7 · 4,3 · 2,2) — jetzt acht.
* **Münder:** zwei vollere — jetzt sieben.
* **Augen:** keine neuen Formen. Die fünf vorhandenen decken den Lidspalt von
  2,6 bis 4,2 ab; sie werden nur nach Rang angesteuert. Lieber keine neue Form
  als eine schlecht gezeichnete.

### Statur
`schlank` und `hochgewachsen` ziehen den Kopf schmal, `kraftvoll` breit,
`normal` lässt alle zehn Formen zu. Verdrahtet über einen Effekt in der
Erstellung — **und genau der stand im ersten Entwurf vor der Zustandserklärung
von `statur`.** Der Prüfstand meldete „Cannot access 'statur' before
initialization", die ganze Erstellungsseite war tot. Dieselbe Falle wie
„Prüfskript vor Definition" in Abschnitt 6, diesmal im Anwendungscode.

### Frauenfußball
Der Mangel war nicht die Frisur, sondern das Gesicht darunter: **es gab kein
einziges Merkmal, das ein Porträt weiblich lesen liess.** Neu:

* **Wimpern** an allen weiblichen Porträts, auch ohne Schminke.
* **`schminke`** als neues Merkmal, hinten an `ZUEGE_ORDNUNG` angehängt:
  0 keine · 1 Lidschatten · 2 Lippenstift · 3 beides · 4 dezent betont.
  Männer bekommen immer 0.
* **Vollere Lippen und feinere Brauen** im Mittel — die Spanne wird verschoben,
  nicht festgesetzt.

Der Lippenstift ersetzt den Hautton nicht, er mischt sich hinein
(`mischFarbe`) — eine feste Farbe säße auf hellen und dunklen Tönen nie
zugleich richtig, und das Heft kennt keine Neontöne.

### Der Porträtbogen kann jetzt Frauen
Er zeichnete im Merkmalsmodus ausschliesslich Männer — Wimpern, Schminke und
die weiblichen Frisuren waren damit **unsichtbar prüfbar**. Neuer Modus:

    node portraetbogen.cjs frau bogen.svg schminke 5

### Geprüft, und angesehen
Prüfstand: **398 Prüfungen**, 0 Fehler, alle vier Zielbänder.
„67 gezeichnete Auswahlmöglichkeiten · 10 Kopfformen“.
Bündel **1.083,07 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.
Bögen gefahren: `merkmal nase`, `frau schminke`, `frau frisur`.

### Was das für alte Spielstände heisst
Gespeicherte Gesichter tragen ihre Merkmale als Objekt, nicht als Kennung — die
neuen Nasen und Münder erscheinen also nur bei NEU erzeugten Gesichtern.
**Eine Ausnahme:** bestehende weibliche Porträts bekommen ab sofort Wimpern.
Das ist gewollt.

## 34.30 · Aufräumen nach dem Belastungstest

Ein Lauf mit 5.000 Merkmalssätzen, 4.000 Spielern und 250 vollständigen
Laufbahnen. Vier Punkte kamen heraus — **einer davon war ein Fehler in meinem
eigenen Testgerüst, kein Fehler im Spiel.**

### Die Fehlmeldung zuerst
Der Test meldete: „Laufbahnen enden nicht, Spieler bekommen mit 43 noch
Angebote", 171-mal in 250 Läufen. **Falsch.** Kevin hat sofort widersprochen:
bei 40 sei Schluss. Er hat recht. Die Altersgrenze steht im Spielablauf, nicht
im Rechenkern — mein Gerüst rief `develop`, `simulateSeason` und `makeOffers`
direkt und lief damit an der ganzen Prüfung vorbei.

**Merksatz für künftige Belastungsläufe:** Der Rechenkern kennt kein
Karriereende. Wer eine Laufbahn nachstellt, muss die Endbedingung des
Spielablaufs mitnehmen, sonst misst er Unsinn. Der `grosstest.cjs` tut das
jetzt und benutzt dafür dieselbe ausgeführte Zahl.

### Die Altersgrenze stand viermal da
Beim Nachsehen fiel auf: die harte Grenze war **viermal als nackte Zahl**
notiert — einmal als 40 (vor dem Hochzählen des Alters) und dreimal als 41
(danach). Wer eine davon ändert und die anderen übersieht, bekommt zwei
verschiedene Karrierelängen, je nachdem ob man normal spielt oder vorspult.

Jetzt `LAUFBAHN_MAX = 40` an einer Stelle; die vier Abfragen lesen sie.
**Verhalten unverändert** — `>= 40` vor dem Hochzählen ist dasselbe wie
`> 40` danach. Die weichen Bedingungen daneben (ab 33 bei schwacher Stärke,
ab 34 mit Zufall, ab 35) bleiben absichtlich verschieden: sie beschreiben
verschiedene Lagen, nicht dasselbe zweimal.

### Kopfform „Weich" war zu selten
Gemessene **2,7 %** gegen 6 bis 15 % bei allen anderen. Grund: sie stand in
keiner Staturliste und kam deshalb nur bei „normal" vor. Mit b 25,5 und einem
Kiefer von 21 gehört sie zu den kräftigen — dort eingetragen, jetzt **6,7 %**.

### Wildcards waren nicht messbar
`drawWildcard` war für den Prüfstand nicht ausgeführt. Das ist deshalb heikel,
weil genau dort in 34.5 ein stiller Fehler sass: ein Gewicht von 0 in der
HSV-Stufe liess NaN durch die Wichtung laufen, und **alle** Ziehungen kamen als
Normal zurück, ohne dass irgendwo etwas auffiel.

Neue Prüfung mit 4.000 Ziehungen: jede Seltenheit muss vorkommen, mindestens
drei Stufen, und **höchstens 80 % Normal** — genau die Signatur jenes Fehlers.

    normal 36,1 % · selten 24,4 % · aussen 15,6 % · unfass 10,6 %
    welt 8,0 % · goat 5,2 % · hsv 0,1 %

### Was der Belastungstest sonst ergab
Keine Fehler, keine NaN, kein Wert ausserhalb seiner Grenzen. Startstärke
40–68, höchste erreichte Stärke 93, Laufbahnen 18–25 Saisons, **Karriereende
zwischen 33 und 40** — die Grenze arbeitet.

`pruefstand/grosstest.cjs` ist neu und gehört ins Repository. Aufruf:

    cd /tmp/ps && node grosstest.cjs

Er ändert nichts, er misst nur.

### Geprüft
Prüfstand: **401 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.083,08 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.

## 34.31 · Kartenwechsel ohne Ruckler, Schritte auf Formularpapier

### Warum die Karteikarten stockten
Kevin: „Die vorherige Karte bleibt in ihren Grundmaßen noch einen Augenblick,
bis der Inhalt der nächsten aufploppt." Und umgekehrt bei gross nach klein:
„erst kommt der Inhalt auf der grossen Karte, dann schrumpft sie schlagartig."

Beide Karten lagen im **selben Rasterfeld** (`grid-area: 1/1`). Ein Rasterfeld
ist immer so hoch wie sein höchster Inhalt — die Bühne blieb also die vollen
340 ms auf dem Mass der ALTEN Karte und sprang erst beim Abräumen um. Die
Grössenänderung kam dadurch **nach** der Bewegung statt mit ihr.

Neu ist `Kartenbuehne`: die hinausziehende Karte liegt **absolut**, also
ausserhalb des Flusses, und zählt für die Höhe nicht mehr mit. Die Bühne misst
nur die neue Karte (`useLayoutEffect` plus `ResizeObserver`, damit auch
nachladende Schriften erfasst werden) und fährt ihre Höhe in denselben 340 ms
dorthin. Wachsen, Hereinziehen und Hinausziehen laufen jetzt gleichzeitig.
Im Ruhemodus fällt der Übergang weg.

### Die drei Schritte stehen auf Formularpapier
Training, Ereignis und Verträge sind das, was man tun MUSS, damit es weitergeht
— sie sahen aus wie alles andere. Jetzt tragen sie die Klasse `.laufzettel`:
heller Karton, Perforationsrand links, harte Kante mit versetztem Schatten und
ein Kopfstreifen „TRAINING · SCHRITT 1 VON 3".

Farben wieder über neu gesetzte Variablen wie bei der Karteikarte — der Inhalt
benutzt Farben für dunklen Grund und löst auf dem Zettel von selbst zur
Kartonfassung auf. Dazu drei Regeln, die dunkle Flächen im Zettel zu blossen
Umrandungen machen (`.laufzettel .pan`, `.btn`, `.btn.on`).

**Ohne strukturellen Eingriff:** der Kopfstreifen kommt als erstes Kind in den
bestehenden Behälter, es kam kein einziges schliessendes Element dazu. Das war
Absicht — die drei Blöcke sind lang und tief verschachtelt.

### Geprüft
Prüfstand: **401 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.085,92 kB**. Startprobe 13 von 13, keine Seitenfehler im Browser.
`.zettelkopf` ist im Baum der laufenden App nachweisbar.

### NICHT gesehen
**Wie der Laufzettel aussieht, konnte ich nicht prüfen.** Die
Kartenenthüllung liess sich im Browser nicht zuverlässig wegklicken; jeder
Versuch endete vor demselben Vorhang. Dass er gezeichnet wird, ist belegt —
wie er wirkt, nicht. Dasselbe gilt für den neuen Kartenwechsel: die Höhe wird
rechnerisch geführt, gesehen habe ich die Bewegung nicht.

## 34.32 · Die Wildcard auf hellem Papier

Kevin nach dem Spielen: die Schrift auf der Wildcard geht verloren, weil die
Karte leicht durchscheint. **Eine Folge von 34.31** — die Wildcard steht im
Trainingsschritt, und der liegt seither auf hellem Formularpapier.

Zwei Ursachen, beide von mir:

1. **Der Grund war teildurchsichtig.** Der Verlauf ging von der Seltenheits-
   farbe bei 12 % Deckung nach `var(--pan)` bei 62 %. Der erste Bereich liess
   den Untergrund durch. Auf dunklem Grund fiel das nie auf, auf Papier wusch
   es die Karte aus. Jetzt liegt der Verlauf AUF einer deckenden Fläche
   (`…, var(--pan)` als zweite Lage) statt in sie hineinzublenden.
2. **Meine eigene Farbumdeutung traf sie.** `.laufzettel` setzt `--tx`, `--mu`
   und die Akzente auf Kartonfassungen — die Kartenschrift wurde damit dunkel,
   auf einer dunklen Karte. Dazu nahm die Regel für Flächen im Zettel der Karte
   den Grund.

Die Karte trägt jetzt `.wkarte` und **nimmt die Umdeutung zurück**. Die Werte
stehen dort noch einmal ausgeschrieben; ein Verweis auf den Grundstil geht
nicht, weil eine Variable sich nicht auf ihre eigene Fassung weiter oben
beziehen kann — sie sähe nur die des Laufzettels. **Wer die Grundfarben ändert,
muss sie in `.wkarte` mitziehen.** Das steht als Warnung im Kommentar.

### Was dabei auffiel
Der Prüfstand hat mich erwischt: mein Kommentar enthielt zwei Rückwärts-
Anführungszeichen und beendete damit die Schablonenzeichenkette des CSS-Blocks
vorzeitig. Die Prüfung dafür gibt es seit einer früheren Fassung und sie hat
genau das getan, wofür sie da ist.

### Geprüft
Prüfstand: **401 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.086,75 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.

**Nicht gesehen:** wie die Karte auf dem Papier wirkt. Rechnerisch ist sie
deckend und trägt ihre eigenen Farben; ob das Ergebnis gut aussieht, zeigt der
Browsertest.

## 34.33 · Die Kopfformen sind wieder spiegelgleich

Kevin am Porträtbogen: einige der neuen Köpfe sind rechts deutlich runder und
ausgebeult. Er hat recht, und es ist **mein Fehler aus 34.28.**

### Ein einzelner Stützpunkt
Beim Einführen der verjüngten Kinnpartie habe ich auf der linken Seite BEIDE
Stützpunkte auf den neuen Wert umgestellt, auf der rechten nur den Endpunkt.
Der rechte Stützpunkt bei `kinn-8` stand weiter auf der Kieferbreite OBEN:

    rechts:  C r,52   jr,(kinn-8)   kur,(kinn-6)      ← jr statt kur
    links:   C kul,(kinn-8)   l,52   l,40

Solange `kv` fehlt, sind `jr` und `kur` gleich — deshalb waren die acht alten
Formen nie betroffen. Bei **Zart** und **Rundlich** klaffte die rechte Seite um
die volle Verjüngung auf und beulte sichtbar aus.

### Geprüft wird jetzt gerechnet, nicht geschaut
Neue Prüfung: für jeden Punkt (x, y) des Pfades muss es einen Partner
(100 − x, y) geben. Reine Rechnung, erwischt jede künftige einseitige Änderung
sofort — und zwar bei allen Formen, nicht nur bei denen, die gerade auffallen.

**Gegenprobe:** alten Pfad wiederhergestellt — die Prüfung meldet genau
**Zart (8)** und **Rundlich (9)**, die anderen acht bleiben grün. Das ist der
Beweis, dass sie am richtigen Ort greift.

*Eigener Falschalarm dabei:* Der erste Entwurf strich jeden gefundenen Partner
weg und meldete daraufhin **alle zehn** Formen als schief, auch die
unveränderten. Grund: ein geschlossener Pfad nennt seinen Startpunkt zweimal
(einmal bei `M`, einmal vor dem `Z`), sein Spiegelbild aber nur einmal. Jetzt
wird als Menge verglichen. Aufgefallen ist es nur, weil die Gegenprobe ein
Ergebnis lieferte, das zu gut zum Fehler passte.

### Geprüft
Prüfstand: **402 Prüfungen**, 0 Fehler, „Spiegelgleich 10 von 10 Formen".
Bündel **1.086,74 kB**. Porträtbogen angesehen: die Ausbeulung ist weg.

## 34.34 · Drei Meldungen aus dem Spiel

### Tinte auf dunklem Grund
Zwei Stellen, beide Folgeschäden der Laufzettel-Umstellung aus 34.31:

* **Das Ergebnisfeld nach einer Ereignisentscheidung.** Es trägt `.up`, und
  diese Farbe wird NICHT umgedeutet — die Fläche blieb also dunkel, während
  die Schrift darin zu Tinte wurde. Auf Formularpapier ist daraus jetzt eine
  helle Fläche geworden.
* **Der Knopf „Karte neu ziehen" auf der Wildcard.** Die allgemeine Knopfregel
  des Laufzettels färbt die Schrift zu Tinte — auf der dunklen Karte
  unlesbar. `.laufzettel .wkarte .btn` nimmt das zurück.

**Muster, das sich wiederholt:** die Farbumdeutung des Laufzettels trifft
alles darin. Wo eine Fläche absichtlich dunkel bleibt, muss die Schrift
ausdrücklich mitgezogen werden. Das ist jetzt der dritte Fall nach der
Wildcard selbst in 34.32.

### Das Papier verzog sich am Rand
Android dehnt seit Version 12 den Inhalt gummiartig, wenn man über den Rand
hinauszieht. Im Heft sieht das aus, als verzöge sich das Papier.
`html,body{overscroll-behavior:none}` stellt das ab. Es betrifft nur diese
Anzeigespielerei des Systems; das Zurückwischen bleibt unberührt, weil das
eine Geste des Systems ist und keine Rollbewegung der Seite.

### Ein versprochener Verein muss auch kommen
Kevin: „Union Berlin will dich zurück" — zugesagt, und dann standen vier
andere Vereine im Fenster.

Das Ereignis `sf_rueckkauf` nennt den Verein im Titel (`${c.prev}`), seine
Wirkung war aber nur `winterMove` — ein **allgemeiner** Wechselwunsch. Der
genannte Verein wurde nirgends festgehalten, `makeOffers` würfelte wie immer.

Neu ist `zurueckZuPrev`: der Name wandert nach `p.flags.rueckkehrZu`, und
`makeOffers` legt das Angebot dieses Vereins **ganz nach vorn** — das muss vor
dem Kürzen geschehen, weil im Schnellspiel nur drei fremde Angebote gezeigt
werden. Danach wird das Versprechen gelöscht, sonst käme der Verein bis ans
Karriereende jedes Jahr wieder.

Findet sich der Name nicht mehr, bleibt alles wie bisher — lieber ein Angebot
weniger als ein Absturz.

**Geprüft:** 40 Versprechen, 40 eingelöst, 40 danach verbraucht.
**Gegenprobe:** Angebot wieder ausgebaut — die Prüfung meldet die fehlenden
Vereine namentlich.

**Noch offen dabei:** `wm_trainerruf` („Dein alter Trainer will dich zurück")
nennt keinen Verein — der neue Klub des Trainers existiert nirgends als Datum.
Dort sind beliebige Angebote nicht falsch, wirken aber beliebig. Wer das
schärfen will, müsste dem Ereignis einen echten Zielverein geben.

### Geprüft
Prüfstand: **404 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.088,31 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.

## 34.35 · Bärte bleiben in der Kopfform

Kevin hat es im Testprotokoll angekreuzt: „Bärte sitzen sauber — **Nein. Muss
gecheckt werden.**" Er hatte recht, und ich hatte es in 34.28 zu klein
angesehen. Erst der Bogen mit 2.600 px Breite zeigt es.

### Was los war
Die Koteletten (Bart 9) waren zwei gerade senkrechte Streifen bei festem
Abstand vom Kopfrand. Der Kopf läuft aber nach unten ein — unten standen sie
seitlich über, bei den schmalen Formen am deutlichsten. Und selbst wo sie
knapp innen blieben, lasen sie sich als **angeklemmte Balken**, weil eine
gerade Kante neben einer runden steht.

### Zwei Schritte
**Erstens ein Beschnitt auf die Kopfhülle.** Die ganze Bartgruppe hängt jetzt
in einem `clipPath` auf `kopfD`. Damit kann kein Bart mehr über den Kopf
hinauszeichnen — auch keiner, der später dazukommt, und auf keiner Kopfform,
die später dazukommt. Das war seit 34.1 der wiederkehrende Fehlertyp; jeden
Bart einzeln nachzuziehen hiesse zehn Bärte mal zehn Formen von Hand
abzugleichen und beim elften wieder von vorn.

**Zweitens die Koteletten umgezeichnet.** Sie werden jetzt bewusst ÜBER den
Kopfrand hinaus gezeichnet und vom Beschnitt an der Kante getrimmt. Dadurch
folgt ihre Aussenseite exakt der Rundung, statt als Gerade danebenzustehen.

**Nebenwirkung mit Absicht:** bestehende bärtige Gesichter verlieren einen
schmalen Überstand. Das ist die Korrektur, nicht ein Verlust.

### Geprüft
Prüfstand: **404 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.088,73 kB**. Bartbogen bei 2.600 px angesehen, alle hundert
Kombinationen.

## Kevins Testprotokoll zu 34.33 — Ergebnis

Vier Seiten durchgearbeitet. Grün: Navigation vollständig, Spielerpass
vollständig, Errungenschaften, Rückblick vollständig, Charaktererstellung bis
auf einen Punkt, und aus dem Langzeitteil Wachstumskurve, Auto-Training,
Sprache, Frauenfußball, Akademieausbau, Nachkaufen, alte Spielstände.
**„Karriereende kommt von selbst"** — damit ist meine Fehlmeldung aus 34.30
endgültig erledigt.

**Entscheidungen:** „Moral" bleibt · 8 px Abstand passt · Flaggenbinde nur bei
der Nationalmannschaft · Schminke, Linierung und Tempo der Ziehbewegung passen.

**Der Vermächtnis-Laden wurde nicht geprüft** und gilt auf Kevins Wunsch als
**unter Vorbehalt abgeschlossen**. Fehler dort sammelt er und meldet sie später.

**Fünf Befunde, davon einer erledigt:**

| Befund | Stand |
|---|---|
| Bärte stehen über | **erledigt in 34.35** |
| Markenpuls wirkt bronze statt gold | **erledigt in 34.36** |
| Flaggenbinde zeigt meistens Vereinsfarben | **erledigt in 34.38** — alle 212 belegt |
| Errungenschaften: „der obere Rand nicht" | offen — die Kopflinie der Karte nutzt die dunkle Variante statt der Stufenfarbe |
| Ereignisse wiederholen sich auffällig oft | **gemessen in 35.0** — innerhalb einer Laufbahn unauffällig (0,6), zwischen Laufbahnen real. Gewicht ist nicht der Hebel; es braucht breitere Bedingungen. |

## 34.36 / 34.37 · Goldton, Kopflinie, Zielverein des Trainers

Drei weitere Befunde aus dem Testprotokoll.

### Der Markenpuls wirkte bronze
Weil er es war. Ich hatte `--go-k` genommen — die Kartonfassung des Goldtons,
`#7A5600`, ein dunkles Olivbraun. Sie ist auf **kleine** Schrift gerechnet
(Kontrast 5,2 gegen Karton) und wird dafür stark abgedunkelt.

Die Stärke ist aber 34 px gross, und dort genügen 3,0. Neu ist `--gold-k`
mit `#9A7200` — Kontrast **3,41**, deutlich goldener. Dazu sitzt die Marke
daneben jetzt auf einem **dunklen Schild** und darf dort das helle `--go`
tragen; auf Karton direkt wäre das nicht lesbar.

### „Der obere Rand nicht“
Die 4 px starke Kopflinie der Errungenschaftskarte nutzte `stufeDunkel(st.col)`,
der Rangblock daneben aber `st.col`. Zwei Töne für eine Stufe — genau das, was
34.25 eigentlich abgeschafft hatte, an einer Stelle übersehen. Jetzt trägt die
Linie die Stufenfarbe; blasse Stufen bleiben erkennbar, weil die Karte einen
eigenen Rahmen hat.

### Der Trainer hat jetzt einen Verein
`wm_trainerruf` sagt nur, der Trainer habe „einen neuen Verein übernommen“ —
welchen, stand nirgends. „Sofort zu ihm“ war ein Versprechen ohne Adressaten.

Neu ist die Wirkung `zielTrainer`: sie legt den Verein beim Anwenden **einmal**
fest — vergleichbare Spielklasse (± 5), nicht der eigene, aus dem Namen des
Spielers abgeleitet und damit gleichbleibend. Von da an greift derselbe Weg wie
bei der versprochenen Rückkehr aus 34.34.

### Was der Prüfstand dabei gefunden hat
Die Rückkehr-Prüfung fiel plötzlich um: „versprochener Verein VfL Wolfsburg
fehlt im Fenster“. Ursache war ein Sonderfall aus 34.34: bei der
**HSV-Rautekarte** kehrt `makeOffers` vorzeitig zurück, und der Rückkehr-Block
liegt dahinter. Das Versprechen konnte dort nie eingelöst werden und blieb bis
ans Karriereende stehen.

Die Rautekarte sticht jedes Versprechen — das ist richtig. Sie **räumt es jetzt
aber ab**, statt es liegen zu lassen. Die Prüfung überspringt solche Läufe.

*Bemerkenswert:* der Lauf war zunächst 40 von 40 grün und fiel erst zwei
Fassungen später um, weil `laufbahn()` würfelt und die Rautekarte nur manchmal
auftaucht. **Eine Prüfung, die einmal grün war, ist nicht bewiesen.**

### Geprüft
Prüfstand: **404 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.088,70 kB**.

## 34.38 · Alle 212 Nationen haben eine echte Flagge

Kevin im Testprotokoll: „Flaggenbinde — meistens Vereinsfarben." Nachgemessen
waren es **33 von 212** Nationen mit hinterlegter Bauart. Die übrigen 179
bekamen aus der Länderkennung ERRECHNETE Farben (`hslHex` auf einen Hashwert)
— zwei erfundene Töne, die mit der Flagge nichts zu tun hatten. Kein Wunder,
dass es nach beliebigen Vereinsfarben aussah.

Jetzt sind **alle 212** belegt.

### Vier neue Bauarten
Drei Arten reichten nicht. Dazugekommen sind:

| Art | Aufbau | Beispiele |
|---|---|---|
| `keil` | Streifen mit Keil am Mast, `z` = Keilfarbe | Tschechien, Kuba, Südafrika, Golfstaaten |
| `diag` | zwei Felder mit Schrägband | Kongo, Tansania, Namibia, Trinidad |
| `goesch` | Streifen mit Obereck, `z` = Obereckfarbe | USA, Australien, Chile, Togo |

### Was das ist und was nicht
Hinterlegt sind **Bauart und Farben, nicht das Wappen**. Auf einem 22 Punkt
hohen Band wären Sterne, Halbmonde, Adler oder das Union Jack ein Fleck. Wo
eine Flagge ihr Wesen aus einem Zeichen bezieht, steht hier die tragende
Fläche plus das kennzeichnende Element als Scheibe, Keil, Schrägband oder
Obereck. **Erkennbar, nicht heraldisch.**

### Was die neue Prüfung sofort gefunden hat
Vier Bedingungen: jede Art muss bekannt sein, **jede Nation** muss eine Flagge
haben, keine Flagge darf ohne Nation dastehen, und Bauarten mit Zusatzfarbe
müssen sie mitbringen.

Die letzte schlug an: **18 Diagonalflaggen** trugen die Bandfarbe als dritte
Farbe statt in `z` — sie wären alle weiß gezeichnet worden. ASA, BDI, BHU,
BIH, BRU, CGO, COD, ERI, GRN, JAM, MHL, NAM, PNG, SEY, SKN, SOL, TAN, TRI.
Der Zeichner nimmt jetzt beides, die Prüfung lässt beides gelten.

Eine unbekannte Bauart zeichnet stillschweigend liegende Streifen — der Fehler
wäre also nie aufgefallen. Genau dafür ist die Liste in der Prüfung da.

### Angesehen
Neues Werkzeug `bindenbogen.cjs`: alle 212 Binden als Tafel. Ohne das sieht man
die Flaggen nie, weil sie im Spiel erst als Kapitän erscheinen.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.098,53 kB** (+9,8 kB für die Flaggendaten).

## 35.0 · Ereigniswiederholung: gemessen statt vermutet

Der letzte Befund aus dem Testprotokoll — und der einzige, bei dem am Ende
**nichts geändert** wurde. Das ist das Ergebnis, nicht ein Versagen.

### Was die Messung sagt
Neues Werkzeug `pruefstand/ereignisse.cjs`: 30 Laufbahnen mit demselben
Gedächtnis, das auch das Spiel führt.

| | Wert |
|---|---|
| Ereignisse insgesamt | 471 |
| Verschiedene je Laufbahn | 46,7 bei 23,6 Saisons |
| Doppelt INNERHALB einer Laufbahn | **0,60** |
| Verwendet über 30 Laufbahnen | 313 von 471 (66 %) |
| Häufigstes Ereignis | 14 von 30 Läufen |

**Innerhalb einer Laufbahn ist Wiederholung praktisch kein Thema** — 0,6
Doppelte bei 46,7 verschiedenen. Die Sperre über `evLog` und die
Themen-Abkühlung über `tagLog` arbeiten. Auffällig ist die Wiederkehr
**zwischen** den Laufbahnen.

### Ein Versuch, der nichts gebracht hat
Naheliegende Ursache wäre die schwache Dämpfung im Gewicht gewesen. Probiert:
Faktor von 1,15 auf 1,6, Obergrenze von vier auf sechs, Verblassen des
Gedächtnisses von 0,72 auf 0,86 — also rund zehn statt vier Laufbahnen.

**Ergebnis: keine messbare Änderung.** Spitzenwert weiterhin 14 von 30,
weiterhin 313 von 471 verwendet. Es verschob sich nur, WELCHES Ereignis oben
steht. Die Änderung wurde deshalb **zurückgenommen** — eine Anpassung
auszuliefern, deren Kommentar eine Wirkung behauptet, die die Messung nicht
zeigt, wäre schlimmer als keine.

### Wo der Hebel wirklich liegt
Von 471 Ereignissen hängen **465 an einer Bedingung**, aber nur **12** an einer
Freischaltung. Die 158 nie gezogenen sind also grösstenteils Inhalt für seltene
Lagen — kein Fehler, sondern Absicht. Wer die Wiederkehr wirklich senken will,
muss die BREITE der Bedingungen angehen: in einer beliebigen Saison ist der
Kreis der zulässigen Ereignisse klein, und dann hilft kein Gewicht.

Das ist eine Inhaltsaufgabe, keine Stellschraube. Sie steht als offener Punkt.

### Damit ist der grosse Test abgearbeitet
Alle fünf Befunde aus Kevins Protokoll sind bearbeitet:
Bärte (34.35) · Goldton und Kopflinie (34.36) · Zielverein (34.37) ·
alle 212 Flaggen (34.38) · Ereigniswiederholung gemessen (35.0).

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.098,53 kB**.

## 35.1 · Werkzeugpflege

Nichts am Spiel. Drei Fehlerarten, die bisher nur als Merksatz in Abschnitt 6
standen, werden jetzt nachgerechnet — **eine Regel, an die man sich erinnern
muss, ist keine Regel.**

### 1 · Doppelte Namen in exporte.txt
Hat den Aufbau an einem Tag **zweimal** abgebrochen. esbuild meldet das als
„was originally exported here“ mit Zeilennummern aus dem zusammengesetzten
Bündel — also weit weg von der Datei, in der der Fehler steht. `pruefen.sh`
nennt die Namen jetzt direkt beim Namen.

### 2 · sicht.sh: alles, was jsdom nicht sehen kann
Zehn von achtzehn Werkzeugen liefen nur von Hand — und wurden deshalb
vergessen. Der Porträtbogen war monatelang unbenutzbar, die Startprobe meldete
über mehrere Fassungen zwei Falschalarme, ohne dass es auffiel.

    bash pruefstand/sicht.sh App.jsx

Baut einmal und fährt danach Startprobe, Kopfleiste und Seitenanfang. Fehlt
playwright, meldet das Werkzeug das **und beendet mit Code 3** — ein
unvollständiger Lauf ist kein bestandener Lauf.

### 3 · Protokollzeilen, die grün reden
Dreimal in vier Fassungen stand in `ansichten.jsx` ein fester Text, der weiter
„alles in Ordnung“ meldete, während die Prüfung darüber rot war. Gefunden
wurde es jedes Mal nur zufällig in der Gegenprobe. Jetzt sucht `pruefen.sh`
nach solchen Zeilen: eine Protokollzeile ohne Fragezeichen, die eine Zusage
ausspricht, ist verdächtig.

*Dabei ein eigener Fehler:* der erste Filter war **tot**. `grep -n` stellt jeder
Zeile eine Nummer mit Doppelpunkt voran, und mein `grep -v ':'` warf daraufhin
alles weg — die Prüfung konnte nie anschlagen. Aufgefallen nur, weil die
Gegenprobe schwieg, als sie hätte melden müssen. **Eine Prüfung, die schweigt,
muss man zum Reden bringen, bevor man ihr glaubt.**

### Verworfen: Prüfung auf doppelte Farbwerte
Sie meldete 49 Werte, fast alle legitim — Vereinsfarben und die 212 Flaggen
nennen dieselben Rot- und Blautöne naturgemäss mehrfach. Ein Hinweisgeber, der
bei jedem Lauf 49 Zeilen ausspuckt, wird nach dem zweiten Mal überlesen. Die
Begründung steht im Skript, damit es niemand noch einmal versucht.

### 4 · Der Signaturschlüssel wird bewacht
`apk.yml` hält den SHA-1 jetzt in `signing/fingerabdruck.txt` fest und
vergleicht ihn bei jedem Bau. Ändert er sich, **bricht der Bau ab** mit dem
Hinweis, dass sich die APK nicht mehr über die installierte legen lässt und
der Spielstand vorher gesichert werden muss. Bis 35.0 stand der Wert nur im
Protokoll und niemand verglich ihn — genau deshalb war Kevins Update-Frage
tagelang nicht zu beantworten.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler. `sicht.sh`: Startprobe 13/13,
Kopfleiste 8 px, Seitenanfang 4/4. Alle drei neuen Prüfungen gegengeprüft —
sie schlagen beim künstlich eingebauten Fehler an und schweigen sonst.

## 35.2 · STAND.md hat ein Verzeichnis

Punkt 6 der Werkzeugliste. Die Datei hat **47 Hauptabschnitte** auf über
3.000 Zeilen — jede Sitzung begann mit Suchen.

### Erzeugt, nicht gepflegt
`pruefstand/verzeichnis.cjs` schreibt das Verzeichnis zwischen zwei Marken neu.
Ein von Hand gepflegtes wäre nach drei Fassungen falsch, und **ein falsches
Verzeichnis ist schlimmer als keins** — man glaubt ihm und findet an der
genannten Zeile nichts.

    node pruefstand/verzeichnis.cjs STAND.md

Zwei Dinge, die dabei wichtig waren:

**Zweimal rechnen.** Das Verzeichnis verschiebt alles unter sich. Die Nummern
müssen sich auf die Datei NACH dem Einsetzen beziehen, also wird der Block
erst gebaut, seine Länge gemessen und dann mit dem Versatz noch einmal gebaut.

**Festnagelbar.** Der erste Entwurf erzeugte bei jedem Lauf eine andere Datei
— eine Leerzeile kam dazu oder fiel weg. Das hätte jeden Vergleich im
Repository verrauscht. Der Leerraum an der Nahtstelle wird jetzt
vereinheitlicht; drei Läufe hintereinander ergeben dieselbe Datei.

**Gegengeprüft.** Das Werkzeug prüft nach dem Schreiben selbst nach, ob unter
jeder genannten Zeile wirklich die genannte Überschrift steht, und bricht sonst
ab. 47 von 47 stimmig.

### Geprüft
*Nicht festgehalten.* Beim Aufräumen in 35.4 aufgefallen, dass dieser Abschnitt
als einziger seit 34.35 ohne Messblock geliefert wurde. Nachträglich lässt er
sich nicht mehr füllen — die Quelle von damals liegt nicht mehr vor, und eine
Zahl von heute unter eine Überschrift von gestern zu schreiben wäre eine
Behauptung, keine Messung.

## 35.3 · Eine Regel weniger zum Merken

In 35.1 steht der Satz: *eine Regel, an die man sich erinnern muss, ist keine
Regel.* In 35.2 endete die Lieferung dann mit genau so einer — „nach jeder
Änderung an STAND.md einmal `verzeichnis.cjs` laufen lassen“. Kevin hat
nachgefragt, und die Frage war berechtigt: **er ändert diese Datei gar nicht.**
Der Satz war eine Notiz an Claude, formuliert als Auftrag an ihn.

Beides ist jetzt behoben.

### Der Prüfstand merkt es selbst
`verzeichnis.cjs --pruefen` schreibt nicht, sondern meldet nur, ob das
Verzeichnis noch stimmt, und endet mit Code 1, wenn nicht. `pruefen.sh` ruft
das in der Hygienestufe auf. Ein veraltetes Verzeichnis fällt damit beim
nächsten Lauf auf, ohne dass jemand daran denken muss.

**Gegengeprüft** in beide Richtungen: mit einem eingeschobenen Abschnitt meldet
es sich, bei der sauberen Datei schweigt es.

### Warum das über den Einzelfall hinausgeht
Das Muster hat sich in dieser Sitzung mehrfach gezeigt und gehört notiert:
**Wenn eine Anweisung mit „daran denken“ beginnt, ist sie noch nicht fertig.**
Entweder lässt sie sich prüfen — dann gehört sie in den Prüfstand — oder sie
lässt sich nicht prüfen, dann gehört in STAND.md, warum nicht.

Und: Anweisungen richten sich an den, der sie ausführen kann. Was Claude tut,
gehört nicht in eine Nachricht an Kevin.

### Geprüft
*Nachgetragen am 16.8.2026.* Die Messung stammt aus einem Lauf auf der
unveränderten Quelle (`md5 5821f827…`), nicht vom Tag der Lieferung — der
Abschnitt ging ohne Messblock raus, und das ist erst beim Aufräumen in 35.4
aufgefallen.
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten
rückwärts. Bündel **1.098,55 kB** / 406,43 kB gepackt. `sicht.sh`: Startprobe
13/13, Kopfleiste 8 px, Seitenanfang 4/4.

## 35.4 · Vier Fundstellen aus der Eingangsprüfung

Kein Spielinhalt. Beim Durchsehen zu Sitzungsbeginn sind vier Unsauberkeiten
aufgefallen — drei in `STAND.md` selbst, eine im Projektwissen. Drei davon sind
hier behoben, die vierte kann nur Kevin erledigen.

### 1 · Ein Verweis, der seit zwei Fassungen danebenzeigte
Abschnitt 7 sagte: *„die aktuelle Liste steht unter Offene Punkte (Stand
33.13)"*. Die Überschrift trägt aber längst eine andere Nummer. Ein Verweis mit
Fassungsnummer veraltet zwangsläufig, weil die Überschrift bei jeder
Durchsicht mitwandert und der Verweis nicht. **Er nennt die Nummer jetzt gar
nicht mehr** — dieselbe Überlegung wie beim Verzeichnis: was mitwandern muss,
darf nicht doppelt geschrieben stehen.

### 2 · Die Nummerierung sprang von 10 auf 12
Folgenlos, aber es liest sich, als fehle ein Punkt. Niemand verweist auf die
Nummern (nachgezählt: null Treffer in `STAND.md` und `LIESMICH.md`), also
gefahrlos geschlossen.

### 3 · Zwei Fassungen ohne Messzahlen — und was daraus folgt
35.2 und 35.3 gingen **beide ohne `### Geprüft`-Block** raus. Alle Abschnitte
ab 34.30 haben einen, diese zwei nicht. Zweimal hintereinander vergessen, und
gemerkt hat es niemand — bei jemandem, der Zahlen vor und nach jeder Änderung
verlangt, ist das die falsche Lücke.

Für 35.3 ist der Block **nachgetragen** (Messung auf der unveränderten Quelle,
als solche gekennzeichnet). Für 35.2 nicht: die Quelle von damals liegt nicht
mehr vor. Dort steht jetzt, dass die Zahl fehlt und warum sie nicht mehr zu
beschaffen ist — eine Zahl von heute unter eine Überschrift von gestern zu
schreiben wäre eine Behauptung, keine Messung.

**Der Prüfstand achtet jetzt darauf.** Nach der Regel aus 35.1 — *eine Regel,
an die man sich erinnern muss, ist keine Regel* — gehört das nicht in einen
Merksatz. Die Hygienestufe liest die Fassung aus `App.jsx`, sucht den
zugehörigen Abschnitt in `STAND.md` und verlangt darin einen Messblock.

Zwei Feinheiten, die beim Bauen aufgefallen sind:

- **Wann darf sie rot werden?** Laut Abschnitt 8 wird die Nummer am *Ende*
  angehoben. Während der Sitzung zeigt `App.jsx` also die fertige Vorfassung,
  und die Prüfung schweigt. Rot wird sie nur im Fenster zwischen „Nummer
  angehoben" und „Abschnitt geschrieben" — genau dort soll sie stören. Eine
  Prüfung, die bei jedem Zwischenlauf rot leuchtet, bringt einem bei, Rot zu
  übersehen.
- **Eine Überschrift kann zwei Fassungen tragen.** `## 34.36 / 34.37 ·` gibt es
  wirklich. Der erste Entwurf prüfte auf den Zeilenanfang und hätte 34.37 als
  fehlend gemeldet. Gesucht wird jetzt die Nummer im Kopf der Überschrift, mit
  Abgrenzung — sonst fände `35.3` auch `35.31`.

**Was sie nicht kann:** prüfen, ob die Zahlen im Block stimmen. Sie prüft, dass
er da ist. Ein leerer Block würde durchgehen. Das ist keine Nachlässigkeit,
sondern die Grenze: ob eine Zahl gemessen oder geschätzt ist, sieht man ihr
nicht an — dafür gibt es die Gegenüberstellung vorher/nachher.

**Gegengeprüft in fünf Richtungen:** sauberer Stand → schweigt · Nummer ohne
Abschnitt → meldet · Doppelüberschrift 34.36/34.37 → schweigt · `35.31` gegen
`35.3` → keine Verwechslung · Messblock entfernt → meldet.

### 4 · Zwei Anleitungen im Projektwissen, eine falsch
`LIESMICH-PROJEKTWISSEN.txt` beschreibt noch das Update auf **34.20** mit 352
Prüfungen und liegt neben `00-LIESMICH-ZUERST.txt`, das 35.3 beschreibt. Wer
zur falschen greift, tauscht die falschen Dateien.

Ursache ist keine Nachlässigkeit, sondern eine Umbenennung: die Anleitung hieß
erst so, dann anders — und die alte blieb liegen, weil ein neuer Name nichts
überschreibt. **Deshalb ab jetzt fest: die Anleitung heißt immer
`00-LIESMICH-ZUERST.txt`.** Gleicher Name heißt überschreiben statt anhäufen.
Löschen kann die alte nur Kevin, das Projektwissen ist von hier aus nur lesbar.

### 5 · Dabei die App.jsx überschrieben
Nicht geplant, gehört aber protokolliert. Beim Neuerzeugen der Übersicht habe
ich `node uebersicht.cjs App.jsx UEBERSICHT.md` aufgerufen — in der Annahme,
das erste Argument sei die Quelle. Es ist das **Ziel**. Die Quelle kommt aus
`/tmp/ps/motor.js`. Das Werkzeug hat daraufhin 14.304 Zeilen Spiel durch 3.001
Zeilen Übersicht ersetzt und dazu „Übersicht geschrieben: App.jsx" gemeldet —
eine Erfolgsmeldung über einer gelöschten Datei.

Aufgefallen ist es nur, weil die Übersicht danach weiter „Fassung 35.3" zeigte,
obwohl `App.jsx` auf 35.4 stand. Ohne diese Nachkontrolle wäre der Verlust erst
beim nächsten Bau aufgefallen.

Wiederhergestellt aus `/home/claude/rs/App.jsx`, der Arbeitskopie, die
`pruefen.sh` bei jedem Lauf anlegt — abgesichert mit `diff` gegen die
unberührte Quelle im Projektwissen: genau die zwei Fassungszeilen weichen ab,
der Rest ist bitgleich (`md5` über die Datei ohne Zeile 10–11 stimmt überein).

**Zwei Riegel in `uebersicht.cjs`:** mehr als ein Argument bricht ab, und das
Ziel muss auf `.md` enden. Jeder für sich hätte gereicht. Gegengeprüft: beide
melden, die `App.jsx` bleibt unberührt, der richtige Aufruf läuft durch.

Der allgemeine Fall steht als Stolperfalle in Abschnitt 6. Er ist nicht auf
dieses Werkzeug beschränkt — `vorschau.py` und `verzeichnis.cjs` schreiben
ebenfalls, und `vorschau.py` nimmt umgekehrt erst die Quelle, dann das Ziel.
**Die Reihenfolge ist im Prüfstand nicht einheitlich.** Das zu vereinheitlichen
wäre eine eigene, kleine Aufräumaufgabe; sie steht als offener Punkt.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten
rückwärts. Bündel **1.098,56 kB** / 406,45 kB gepackt — 10 Byte mehr als 35.3,
das ist der längere Text von `VERSION_INFO` und sonst nichts. `sicht.sh`:
Startprobe 13/13, Kopfleiste 8 px Abstand, Seitenanfang 4/4, Impressum zeigt
35.4.

*Nebenbei geschätzt statt gemessen:* in diesem Block stand zwischenzeitlich
1.098,57 kB — hochgerechnet aus der Länge des neuen Textes, bevor der Bau lief.
Es waren 1.098,56. Zehn Byte ohne Folgen, aber genau die Sorte Zahl, die man
sich nicht ausrechnet.

## 35.5 · Ein Prüfwerkzeug für die Ereignisse

Erste Sitzung des Inhaltsausbaus, den Kevin geplant hat. **Kein neuer Inhalt** —
zuerst das Werkzeug, sonst lässt sich später nicht unterscheiden, ob eine
Doppelung neu ist oder schon immer dastand.

### Der Befund, der die Reihenfolge umgedreht hat
Kevins Ausgangspunkt: *„2–3 Karrieredurchläufe hintereinander fühlen sich
gleich an."* Gemessen über 30 Laufbahnen mit demselben Gedächtnis, das auch das
Spiel führt — die Überschneidung zweier aufeinanderfolgender Laufbahnen:

| | gemeinsame Ereignisse |
|---|---|
| erste drei Saisons | 1,9 % |
| alles danach | 6,4 % |
| ganze Laufbahn | 7,1 % |

**Nach Kennung wiederholt sich fast nichts.** `evSeen` arbeitet. Das Gefühl ist
trotzdem richtig, nur liegt die Ursache anderswo:

- 69 % aller Ergebniszweige bewegen `morale`, 42 % `trust`, 34 % `rep`.
  Attribute wie `pas`/`def`/`pot` kommen auf 2–3 %.
- 452 von 471 Ereignissen hatten genau **zwei** Optionen.
- **Keine einzige** Option hing an einem Charakterwert.
- 708 von 961 Optionen würfeln nicht, der Ausgang steht fest.

Anderer Text, dieselbe Maschine. **Mehr Ereignisse allein ändern daran nichts** —
sie liefern mehr Text für dieselbe Maschine. Deshalb kommt die Mechanik
(bedingte Optionen) vor dem Inhaltsschub, nicht danach.

Nebenbei gemessen: der Topf umfasst im Schnitt 118 der 471 Ereignisse, in
Saison 0 aber nur 28. Die Phase, die man am häufigsten sieht, ist die engste.

### Das Werkzeug: zwei Arten von Prüfung
`pruefstand/ereignispruefung.cjs`, als Teil `ereignis` in `pruefen.sh`.

**Hart** — falsch ist falsch: doppelte Kennungen · doppelte feste Titel ·
Angebot trotz Besitz · Text verspricht, Wirkung liefert nicht.

**Grundlinie** — schlägt nur an, wenn es MEHR wird. Deckt Altlasten ab, über die
inhaltlich entschieden wird. Begründung steht im Skript: ein Melder, der bei
jedem Lauf dieselben bekannten Zeilen ausspuckt, wird überlesen. Genau daran ist
in 35.1 die Farbwertprüfung gescheitert.

**Schwellen an den Daten kalibriert, nicht geraten.** Ab 50 % Wortüberschneidung
gibt es 0 Paare, ab 40 % zwei, ab 25 % dreizehn, ab 20 % dreissig — bei 20 %
kippt es ins Rauschen. Also 25 %.

### Drei eigene Fehler im Werkzeug, alle nur durch Gegenproben gefunden
1. **Dynamische Titel.** `r_schwachesjahr` und `r_starkesjahr` heissen mit
   Ersatzwerten beide „Durchschnittsnote 3.0" und sind doch das Gegenteil
   voneinander. Titel mit `${…}` werden übersprungen.
2. **Der Ersatztisch war zu klein.** 22 der 471 Texte greifen auf Felder zu, die
   darin fehlten, brachen ab und lieferten leeren Text — die Ähnlichkeit wurde
   dann nur auf dem Titel gerechnet. `sa_scout` und `hk_diaspora` galten so als
   25 % ähnlich, weil in beiden Titeln „Stadion" steht. **Ein Zwanzigstel des
   Bestands war für diese Prüfung unsichtbar.** Statt einer festen Tabelle jetzt
   ein Platzhalter, der auf jeden Zugriff antwortet: 0 statt 22 leere Texte, und
   die Paarliste fiel von 13 auf 11.
3. **Die Prüfung „verspricht, liefert nicht" war grün, ohne je zu messen.**
   `braucht` fragte nach `fx.ntKapitaen`, die Wirkung heisst `ntCaptain`. Und
   `hatSchon` konnte `!!p.nt.kapitaen` (verlangt) nicht von `!p.nt.kapitaen`
   (schliesst aus) unterscheiden. Gegenprobe: Wirkung entfernen — also genau der
   Fehler aus 35.4 — und sie **schwieg**. Dieselbe Stolperfalle wie „Prüfung, die
   nichts zu messen hatte". Jetzt entscheidet eine Hilfsfunktion `rolle()`
   zwischen *verlangt* · *schliesst aus* · *unerwähnt*.

### Was abgestellt wurde
**Die Binde im Nationalteam.** `n_kapitaen` prüfte nur `nt.caps>=35`, nicht ob man
sie schon trägt — und der Zweig „Annehmen" gab `rep`, `ntBonus`, `morale`,
`legacy`, setzte aber `p.nt.kapitaen` **nicht**. Der Text sagte „Du führst dein
Land an", mechanisch passierte das nicht. Grund: die Binde konnte bis 35.4 nur
die Simulation vergeben, es gab **keine Wirkung dafür**. Neu: `fx.ntCaptain`,
symmetrisch zum vorhandenen `fx.captain` für die Vereinsbinde. Die Simulation
kann sie weiterhin abnehmen, wenn die Rolle wegbricht — das bleibt so.

**Zwanzig Fälle „Angebot trotz Besitz".** `drawEvents` sperrt eine Kennung über
`evLog`, dasselbe Ereignis kommt also nie zweimal — aber zwei verschiedene
Ereignisse können dieselbe Flagge vergeben. `abschluss` wurde von **vier**
Ereignissen vergeben, keines fragte nach; den Schulabschluss konnte man viermal
machen. `ntstreit` und `n_abschied` beendeten beide die Länderspielkarriere.
`ew_beraterwechsel` vergab „Berater", ohne dass man je einen hatte — dort ist die
richtige Bedingung `p.flags.berater`, nicht `!p.flags.berater`. Auf Kevins Wunsch
verliert `insider` sein `rep:6`; einmal reicht.

**Acht Doppler zusammengelegt** (471 → 463). Vorher geprüft, dass keiner
alleiniger Setzer einer Flagge ist und niemand `EVENTS.length` zählt:

| gelöscht | zugunsten von |
|---|---|
| `t_leihe_zurueck` | `lh_rueckkehr` (47 % wortgleich) |
| `x_ruecktrittsangebot` | `sf_altersteilzeit` (44 %) |
| `doppelstaat` | `hk_verbandswechsel` (38 %) |
| `x_wintertransfer` | `wm_winter` (35 %, bessere Bedingung) |
| `x_zeugwart` | `al_platzwart` (26 %) |
| `pos_iv1` | `pv_eigentor` (25 %) |
| `winterlager` | `al_wintervorbereitung` (gleicher Titel) |
| `pos_tw2` | `pt_elfmeterkiller` (gleicher Titel, beide nur TW) |

Damit dabei nichts ersatzlos wegfällt: `pv_eigentor` bekommt `nopos:["TW"]`
(vorher hatte es gar keine Bedingung), und `hk_verbandswechsel` greift jetzt ab
18 statt 21 Jahren und ab Stärke 64 statt 70 — sonst hätten junge oder
schwächere Spieler die Lage verloren, die `doppelstaat` abgedeckt hat.
`hymne` und `kp_hymne` sind **nicht** dasselbe (allgemein gegen als Kapitän);
dort wurde nur der Titel geschärft.

Die fünf verbliebenen ähnlichen Paare sind geprüft und bleiben mit Absicht; die
Begründung steht je Paar im Skript.

### Was offen bleibt und warum
**13 folgenlose Flaggen** — gesetzt, nirgends gelesen. `pendeln` kommt im ganzen
Quelltext genau einmal vor: in der Setzstelle. Das ist kein Fehler, sondern
Inhaltsschuld: 13 Entscheidungen, die spurlos verpuffen. Genau die verschenkte
Wirkung, die Laufbahnen gleich anfühlen lässt. Abzutragen beim Inhaltsausbau,
die Grundlinie hält die Zahl fest.

**`trainerschein` bringt fast nichts.** Vier Setzstellen, drei Lesestellen — und
alle drei sind Bedingungen anderer Ereignisse. Keine Spielmechanik fragt ihn ab.
Kevins Verdacht war richtig. Steht als offener Punkt.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten
rückwärts, dazu **6 Ereignisprüfungen** ohne Befund. Bündel **1.094,44 kB** /
405,27 kB gepackt (−4,12 kB gegenüber 35.4; die acht gelöschten Ereignisse
minus dem längeren `VERSION_INFO`). Laufbahnen bis Vollausbau 27,4 (Ziel 25–35).
`sicht.sh`: Startprobe 13/13, Kopfleiste 8 px, Seitenanfang 4/4, Impressum 35.5.
Alle vier harten Prüfungen und der neue Prüfteil in beide Richtungen
gegengeprüft.

## 35.6 · Die Ereignisse ziehen aus

Offener Punkt 10 („App.jsx hat 14.304 Zeilen"), erster Schnitt. Bewusst **jetzt**
und nicht später: der Inhaltsausbau steht an, und danach waere derselbe Schnitt
zwei- bis dreitausend Zeilen teurer.

**Kein Inhalt geaendert.** Das ist die Bedingung, unter der so ein Umzug
ueberhaupt verantwortbar ist — und sie ist nachgewiesen, nicht behauptet.

### Warum eine Fabrik und kein einfacher Export
Der Block braucht **14 Namen** aus `App.jsx`, gemessen statt geschaetzt: die
Helfer `T · fehler · heldentat · istTraum · lastS · sameClub · sameLeague`, die
Funktionen `confOf · eur · ligaInfo` und die Konstanten `COL · POKAL · TIER ·
TOP5`. (Ein fuenfzehnter Kandidat, `split`, war ein Fehlalarm — er kommt nur als
Objektschluessel `split:` vor, nie als Aufruf.)

Ein `import { … } from "./App.jsx"` waere ein **Ringimport**: `App.jsx` bindet
die neue Datei ganz oben ein, die neue Datei liefe also zuerst, und die
Konstanten aus `App.jsx` waeren dann noch in der temporalen Totzone. Ergebnis:
Absturz beim Start.

Deshalb nimmt `machEreignisse(H)` die Helfer entgegen und packt sie in der
ersten Zeile aus. **Dadurch musste im Block selbst keine einzige Zeile geaendert
werden** — und genau das macht den Umzug nachpruefbar.

### Der Nachweis
Erst der Versuch, die Buendel zu vergleichen: 1.320.654 gegen 1.335.612 Bytes,
also **15 KB Unterschied**. Der Diff zeigte nur Pfadkommentare — das passte
nicht zusammen und war es wert, nachzurechnen. Erklaerung: esbuild rueckt den
Block jetzt um zwei Zeichen tiefer ein, weil er in einer Funktion steht.
Rund 7.000 Ausgabezeilen mal zwei Zeichen sind genau diese 15 KB. Formatierung,
kein Inhalt.

Der belastbare Nachweis vergleicht deshalb die **Daten** statt des Textes: alle
463 Ereignisse aus beiden Buendeln in eine feste Reihenfolge gebracht,
Funktionen als Quelltext, die Umbenennungen von esbuild (`T` → `T2`)
zurueckgerechnet, dann Pruefsumme.

    vorher   00f714e4a36d7ded1e7d85157eefde5a   463
    nachher  00f714e4a36d7ded1e7d85157eefde5a   463

### Vier Werkzeuge gingen von einer Datei aus
Das war der eigentliche Aufwand, nicht der Umzug selbst:

- **`pruefen.sh`** kopiert `ereignisse.js` jetzt in BEIDE Bauverzeichnisse — nach
  `$BAU` fuer das Pruefbuendel, nach `$ARBEIT` fuer den Produktionsbau — und
  meldet die Zahl der Eintraege im Kopf.
- **`browsertest.sh`** hat die Datei in der Kopierliste.
- **`vorschau.py`** muss EINE Datei erzeugen; ein Import auf `./ereignisse.js`
  wuerde im Chatfenster ins Leere zeigen. Die Datei wird jetzt hineinkopiert,
  wie die Schriften. Dazu zwei Gegenproben: kein `from "./ereignisse.js"` darf
  uebrig bleiben, und unter 400 Eintraegen bricht es ab.
- **`apk.yml`** zaehlt die Ereignisse im fertigen Buendel, wie es die
  Schriftschnitte schon zaehlt. Vite loest den Import selbst auf, eine fehlende
  Datei braeche also laut ab — was NICHT laut abbricht, ist eine abgeschnittene
  oder halb eingecheckte Datei.

### Und ein Werkzeug, das die Aufteilung nicht ueberlebt hat
`ereignispruefung.cjs` meldete nach dem Umzug **51 statt 13** folgenlose Flaggen.
Kein Fehler im Spiel: die Pruefung sucht die Lesestellen im Quelltext, und die
Bedingungen sind mit ausgezogen. Sie liest jetzt beide Dateien.

Erfreulich daran ist, WIE es aufgefallen ist — die Pruefung wurde **rot statt
still**. Eine Annahme, die eine Umstrukturierung nicht ueberlebt, ist der
Normalfall; entscheidend ist, dass sie sich meldet. Die Liste `NEBEN` im Skript
ist der Ort, an dem eine weitere ausgelagerte Datei nachzutragen ist.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten
rückwärts, 6 Ereignisprüfungen ohne Befund. `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.6. `vorschau.py` baut wieder eine Einzeldatei mit 463 Einträgen
und bricht ab, wenn `ereignisse.js` fehlt.
Bündel **1.094,63 kB** / 405,89 kB gepackt — 0,19 kB mehr als 35.5, das sind der
Modulrahmen und der längere `VERSION_INFO`. Der Umzug selbst kostet nichts.
App.jsx **12.041 Zeilen** (vorher 14.271), `ereignisse.js` 2.261.

## 35.7 · Entscheidungen mit Folgen

Offene Punkte 11 und 12 aus 35.5. **Tote Flaggen von 13 auf 5**, und der
Trainerschein hat endlich einen Ort.

### Ein Irrweg vorweg, und was er gezeigt hat
Erster Verdacht beim Durchsehen: Spielmanipulation annehmen setzt eine Flagge,
die niemand liest — also ein Spiel ohne Risiko? **Falsch.** Nachgesehen statt
angenommen: 55 % durchkommen, **25 % Sperre**, **20 % lebenslange Sperre und
Karriereende**. Das Risiko ist da. Folgenlos ist nur, wer durchkommt.

Merksatz daraus: eine Flagge ohne Lesestelle ist ein *Hinweis*, kein Urteil.
Manche Entscheidung wirkt vollstaendig ueber ihre Wuerfelzweige.

### Sechs Flaggen bekommen einen Ort: „Was danach kommt"
Vier der dreizehn versprachen etwas fuer die Zeit NACH der Laufbahn —
`abschiedsspiel · experte · plan_b · agentur` — und liefen ins Leere. Dazu
`rueckkehr` (Zusage an den Ausbildungsklub) und `trainerschein`, der
auffaelligste Fall ueberhaupt: vier Setzstellen, drei Lesestellen, und alle
drei nur Bedingungen anderer Ereignisse.

`EndScreen` zeigt jetzt eine Anzeige **Was danach kommt**, die auflistet, was
man sich erspielt hat. Eine Mechanik, sechs Flaggen. Und genau die Wirkung, um
die es Kevin geht: **zwei Laufbahnen enden sichtbar verschieden.**

Alte Sicherungen kennen die Flaggen nicht — `undefined` ist falsch, die Liste
bleibt leer, die Anzeige verschwindet ganz. Nachgewiesen im React-Baum: ohne
Flaggen keine Anzeige, mit Flaggen genau die gesetzten und keine anderen.

### Zwei Ketten repariert, die es schon gab
Der Bestand hatte das Muster bereits: `zw_rechteblock` („Der Fonds redet mit")
verlangt `rechte_weg`, `steuerpruefung` („Post vom Finanzamt") verlangt
`schwarzgeld`. Funktionierende Folgen — nur nicht ueberall angeschlossen.

- **`tpo` hiess in Wahrheit `rechte_weg`.** Zwei Ereignisse verkaufen
  Transferanteile: `zw_transferrecht` setzt `rechte_weg` und hat eine Folge,
  `transferrechte` setzte `tpo` und hatte keine. Dieselbe Sache, zwei Namen,
  ein Sackgassenzweig. Jetzt eine Flagge — und beide Setzer schliessen sie
  gegenseitig aus, sonst verkauft man seine Rechte zweimal.
- **`einbuergerung` oeffnet `as_golf`.** Die Einbuergerung pruefen zu lassen
  endete im Nichts; das Passangebot gab es nur in drei Golfstaaten. Wer den
  Vorgang angestossen hat, bekommt es jetzt ueberall in der AFC.
- **`steuerberater` sperrt `zw_steuermodell`.** Spiegelbild zu `!p.flags.sauber`,
  das dort schon stand: wer einen Fachmann hat, laeuft nicht in ein
  Bildrechtemodell. Eine harmlose Entscheidung schuetzt spaeter.

### Das Werkzeug hat den eigenen Einbau kontrolliert
Erster Entwurf der Anzeige las ueber eine Abkuerzung (`const F = p.flags`).
Die Ereignispruefung meldete prompt **10 statt der erwarteten 5** toten
Flaggen — sie sucht `flags.X` im Quelltext und sah nichts. Statt dem Werkzeug
einen Sonderfall beizubringen, sind die Zugriffe ausgeschrieben. Das ist auch
fuer den Menschen besser auffindbar.

### Was bleibt
Fuenf Flaggen: `attest · beidseitig · manipuliert · pendeln · treugeblieben`.
Sie brauchen eigenen Inhalt, nicht nur einen Anschluss — das gehoert in den
Inhaltsausbau. `treugeblieben` wirkt immerhin ueber `loyalBonus` mit.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
6 Ereignisprüfungen ohne Befund. Tote Flaggen **13 → 5**, Grundlinie gesenkt.
Bündel **1.095,54 kB** / 406,21 kB gepackt (+0,91 kB gegenüber 35.6, das ist die
neue Anzeige). `sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.7.
Anzeige „Was danach kommt" im React-Baum in beide Richtungen nachgewiesen:
ohne Flaggen erscheint sie nicht, mit Flaggen nennt sie genau die gesetzten.

## 35.8 · Deine Werte öffnen Türen

Punkt C aus dem Plan, und die Grundlage für alles Weitere. In 35.5 gemessen:
**keine einzige** der damals 945 Optionen hing an einem Charakterwert. Zwei
Knöpfe, immer dieselben zwei, egal wer man ist. Das war der Befund, warum sich
Laufbahnen gleich anfühlen — nicht die Ereignisse, die überschneiden sich nur
zu 7 %.

### Zusätzliche Optionen, keine gesperrten
Kevins Wortlaut war „**weiteren** Vor-/Nachteil". Das entscheidet den Entwurf:
bestehende Optionen bleiben unangetastet offen, die Bedingung hängt an einer
**dritten**. Die Mechanik gibt etwas dazu, statt etwas wegzunehmen.

Eine Option kann jetzt `cond` tragen. Ist sie nicht erfüllt, bleibt der Knopf
**sichtbar, aber gesperrt**, und `sperre` sagt warum — „Braucht 70
Beliebtheit". Sichtbar mit Absicht: ein verstecktes Angebot merkt niemand, ein
gesperrtes macht klar, dass die eigenen Werte etwas bedeuten.

### Drei Stellen, nicht eine
- `wahlOffen(c, p)` und `offeneWahlen(e, p)` als Helfer.
- Die Anzeige setzt `disabled` und zeigt statt des Hinweises die Sperre.
- **`quickSim`** — die wichtigste. Das Vorspulen würfelte mit
  `pick(e.choices)` über ALLE Optionen. Ohne Anpassung hätte der
  Schnelldurchlauf Dinge gewählt, die der Spieler von Hand nie hätte anklicken
  können.

### Drei neue harte Prüfungen, bevor die erste Bedingung geschrieben wurde
Bewusst in dieser Reihenfolge — die Regeln sind zu wichtig fürs Gedächtnis:

1. **Jedes Ereignis braucht eine Option ohne Bedingung.** Sonst entsteht eine
   Lage, in der alle Knöpfe gesperrt sind und das Spiel hängt. Beim Testen
   fällt das fast nie auf, weil es genau die eine Wertekombination braucht.
2. **Jede bedingte Option braucht `sperre`.** Ein grauer Knopf ohne Begründung
   ist schlimmer als keiner: man sieht, dass etwas ginge, erfährt aber nicht
   was fehlt.
3. **Der Ernstfall.** Die erste Regel prüft nur die Form. Eine Bedingung könnte
   werfen statt `false` zu liefern, dann bliebe auch der freie Weg zu. Deshalb
   zusätzlich ein Spieler, bei dem alles auf Minimum steht — bleibt irgendwo
   null übrig, hängt das Spiel. Ergebnis: 0 Sackgassen.

`wahlOffen` fängt eine werfende Bedingung ab und sperrt, statt abzustürzen.
Nachgewiesen.

### Zehn Bedingungen, quer über die Werte
| Ereignis | hängt an | zusätzliche Option |
|---|---|---|
| `ew_wohnung` | Vermögen ab 3 Mio. | bar bezahlen statt Kredit |
| `heimat` | Vermögen ab 4 Mio. **und** zwei Anschaffungen | die ganze Anlage statt nur des Platzes |
| `b_nummer` | Beliebtheit ab 70 | sich die Zehn einfach nehmen |
| `zw_pokerabend` | Moral ab 70 | die Runde auflösen statt auszusteigen |
| `standards` | Passspiel ab 75 | Freistöße dazu |
| `fitnesstest` | ab 30 Jahren **und** 60 Vertrauen | auf die eigene Erfahrung pochen |
| `al_platzwart` | Form ab 75 | ihm ein Tor widmen |
| `al_dopingaufklaerung` | Schulabschluss | die Liste selbst durcharbeiten |
| `ew_lebensplan` | Trainerschein | auf dem Schein aufbauen |
| `sprache` | Herkunft: Verein im eigenen Erdteil | über Landsleute im Kader gehen |

Damit ist die Mechanik kein toter Code — genau der Fehler, den 35.7 gerade erst
abgetragen hat. Zehn ist ein Anfang, nicht das Ziel; die Kennzahl steht jetzt
im Bericht der Ereignisprüfung.

### Nebenbei aufgefallen
Die Helfer standen zuerst nicht in `exporte.txt`. Der Prüfstand hätte die
Mechanik damit nie anfassen können — dieselbe Klasse wie „Werkzeug, das nur von
Hand läuft".

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
**9 Ereignisprüfungen** ohne Befund. Optionen mit Bedingung **0 → 10** von 955.
Optionen je Ereignis: 2 → 434, 3 → 29 (vorher 444/19).
Bündel **1.098,85 kB** / 407,43 kB gepackt (+3,31 kB gegenüber 35.7: zehn neue
Optionen samt Texten und die Anzeigelogik). `sicht.sh`: 13/13 · 8 px · 4/4.
Mechanik in sieben Richtungen nachgewiesen: gesperrt bei zu wenig, offen bei
genug, `offeneWahlen` zählt richtig, 0 Sackgassen beim schwächsten Spieler,
werfende Bedingung sperrt statt abzustürzen.

## 35.9 · Storystränge

Punkt B aus dem Plan. Über Flaggen gab es schon Zwei-Schritt-Ketten
(`zw_transferrecht` → `zw_rechteblock`). Was fehlte, waren vier Dinge — und das
vierte ist das eigentliche:

| | |
|---|---|
| **Reihenfolge** | Teil 2 nur nach Teil 1. Konnten Flaggen schon. |
| **Wartezeit** | Eine Geschichte, deren drei Teile in derselben Saison durchlaufen, ist keine. `wartezeit` ist der Mindestabstand in Saisons. |
| **Verzweigung** | Was man in Teil 1 wählt, entscheidet, WELCHER Teil 2 kommt. Die Wahl setzt `fx.strangWeg`. |
| **Garantie** | Beim gewichteten Ziehen könnte Teil 2 nie erscheinen. **Eine Geschichte, die anfängt und versandet, ist schlimmer als gar keine.** Fortsetzungen bekommen deshalb einen festen Platz in `drawEvents` — sie werden nicht gewürfelt. |

Zustand am Spieler: `p.straenge[kennung] = { stufe, seit, weg }`. Alte
Sicherungen kennen das Feld nicht, überall gegen `{}` abgesichert.
Fortgeschrieben wird an **zwei** Stellen — im Ereignisfenster und im Vorspulen.
Nur eine davon zu bedienen wäre der Fehler gewesen, den 35.8 bei `quickSim`
schon einmal beinahe gemacht hätte.

Angezeigt wird es als zweiter Chip: „Der aus der Jugend · Teil 2 von 3". Ohne
Kennzeichnung ist ein Strang kein Strang, sondern Zufall.

### Der erste Strang: „Der aus der Jugend"
Drei Stufen, fünf Ereignisse, drei Wege — und bewusst **ausserhalb des
Sportkosmos**, was Kevin ausdrücklich vermisst hat. Es geht um jemanden aus dem
eigenen Jahrgang, der es nicht geschafft hat, und darum, was man mit dem
eigenen Glück anfängt.

Teil 1 (mit 20–26) verzweigt in `geholfen` · `geld` · `abgewimmelt`. Jeder Weg
hat einen eigenen Teil 2; aus `abgewimmelt` und `geld` kann man auf `geholfen`
zurückfinden. Teil 3 ab 28 führt alles zusammen. Die Geldoption ist an
Vermögen gebunden — der erste Strang nutzt also gleich die Mechanik aus 35.8.

### Vier Arten, wie ein Strang kaputtgeht — alle geprüft
Keine davon fällt beim Spielen zuverlässig auf, man müsste erst die richtige
Stufe erreichen: eine **fehlende Stufe** (Geschichte bricht ab), ein **Weg, den
keine frühere Stufe erzeugt** (toter Text, den niemand sieht), eine **Stufe
ohne Nachfolger für einen möglichen Weg**, und eine **Tabelle, die eine andere
Teilezahl nennt** („Teil 2 von 4", und Teil 4 kommt nie).

### Ein Irrweg im Werkzeug, den die Gegenprobe erledigt hat
Die Prüfung „verspricht, liefert nicht" schlug bei `jf_3` an: dort macht *der
Jugendfreund* eine Trainerlizenz, nicht der Spieler. Erster Versuch war, die
Prüfung auf Sätze mit Anrede einzuengen — „was der Text DIR zusagt".

Die Gegenprobe hat das sofort erledigt: in `jf_3` stehen Lizenz und Anrede im
**selben Satz**, und schlimmer — der Anlassfall `n_kapitaen` schlug **gar nicht
mehr an**, weil sein Stichwort im Titel steht und die Anrede im Text. *Eine
Verengung, die den Fall verliert, für den die Prüfung gebaut wurde, ist keine
Verbesserung.*

Zurückgenommen. Stattdessen eine kurze **Ausnahmeliste mit Begründung**, die
bei jedem Lauf mit ausgegeben wird, damit sie nicht stillschweigend wächst. Wem
eine Rolle im Text gehört, ist eine Ermessensfrage — die gehört aufgeschrieben,
nicht geraten.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
**10 Ereignisprüfungen** ohne Befund. 468 Ereignisse (vorher 463).
Bündel **1.103,53 kB** / 408,94 kB gepackt (+4,68 kB: fünf Ereignisse und die
Strangmechanik). `sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.9.
Mechanik in **14 Richtungen** nachgewiesen: Reihenfolge vorwärts und rückwärts,
Wartezeit hält zurück, jeder der drei Wege führt zum richtigen Teil 2, der Weg
bleibt über Stufen erhalten, ein Weg lässt sich wechseln — und die Garantie:
**eine fällige Fortsetzung kam in 40 von 40 Ziehungen.**

## 35.10 · Der Anfang war die engste Stelle

Punkt A/E, erster Block. **Gemessen, bevor geschrieben wurde** — und die Messung
hat das Ziel bestimmt.

### Wo die Lücke wirklich war
| Saison | Topf vorher |
|---|---|
| 0 | **28,2** von 468 |
| 1 | 67,8 |
| 5 | 96,2 |
| 13 | 128,7 |

Bei einem frischen Spieler mit 16 waren es genau **21 Ereignisse in 8 Themen**,
sieben davon „Nachwuchs". Der Abschnitt, den man bei **jeder** Laufbahn sieht,
war der engste des ganzen Spiels.

Und es fehlten dort genau die Themen, die für einen Sechzehnjährigen die
wichtigsten sind: **Familie · Privat · Alltag · Umfeld · Medien · Fans ·
Herkunft · Konkurrenz**. Also fast alles ausserhalb des Platzes — der Punkt,
den Kevin auf seinem Zettel ausdrücklich hatte.

### Zwanzig Ereignisse, gezielt in diese Lücke
Der Vater, der zwei Jahre lang Schichten getauscht hat. Der Bruder, der aufhört
und nicht sagt warum. Die dritte Woche im Internat, wenn das Abenteuer vorbei
ist. Der Gruppenchat, der still wird — nicht im Streit. Der erste Trainer, der
sehr vorsichtig fragt, ob er mal zusehen darf. Neun Zentimeter in einem Jahr.
Der Nachbar, der es jedem erzählt.

Bewusst mit **breiteren Wirkungen** geschrieben: der Anfangstopf bewegte fast
nur `morale` und `trust`. Jetzt stehen dort auch `pot`, Attribute,
`injuryProne`, `money`, `fitness`.

### Das Werkzeug hat zwei neue Altlasten sofort erwischt
Ich hatte zwei Flaggen gesetzt, die niemand liest — `gesichtet` und
`vertragsschlau`. Genau die Schuld, die 35.7 gerade abgetragen hatte, und die
Grundlinie sprang von 5 auf 7. Unterschiedlich behandelt, weil es zwei
verschiedene Fälle sind:

- **`gesichtet`** war Zierde. Die Wirkung des Probetrainings (`pot`, `rep`)
  steht ohnehin da. Entfernt, statt ihr nachträglich eine Aufgabe zu erfinden.
- **`vertragsschlau`** soll sich auszahlen — wer als Achtzehnjähriger einen
  Anwalt auf den Fördervertrag schauen lässt, kann Jahre später im Klauselstreit
  selbst verhandeln. Bekommt also eine echte Lesestelle als bedingte Option.

### Was sich gemessen geändert hat
| | 35.9 | 35.10 |
|---|---|---|
| Ereignisse | 468 | **488** |
| Topf in Saison 0 | 28,2 | **41,3** |
| bei 16 Jahren | 21 in 8 Themen | **36 in 14 Themen** |
| Topf in Saison 1 | 67,8 | **85,0** |
| Optionen mit Bedingung | 11 | **15** von 1.010 |
| Ereignisse mit 3 Optionen | 19 | **34** |

### Was sich NICHT geändert hat, und warum das richtig ist
Die Überschneidung zweier aufeinanderfolgender Laufbahnen liegt weiter bei
**1,6 %** in den ersten drei Saisons (vorher 1,9 %). Das ist keine Enttäuschung,
sondern die Bestätigung des Befunds aus 35.5: **die Wiederholung war nie das
Problem.** Sie war schon vorher praktisch null. Was sich gleich anfühlte, war
die Struktur — zwei Knöpfe, immer dieselben, drei Werte zucken. Daran arbeiten
35.8 und 35.9, und dieser Block gibt ihnen Material.

Wer die Zahl trotzdem drücken will, muss nicht mehr Ereignisse schreiben,
sondern mehr Optionen an Werte binden.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Bündel **1.118,99 kB** / 413,40 kB gepackt
(+15,46 kB — zwanzig Ereignisse mit Text). `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.10. Grundlinien unverändert (5 ähnliche Paare,
5 folgenlose Flaggen) — der Block hat keine neue Schuld hinterlassen.

## 35.11 · Wo die Bedingungen hingehören — und ein grober eigener Fehler

Punkt A/E, zweiter Block. Nach 35.10 war klar: der Hebel liegt nicht mehr in der
Menge, sondern darin, wie viele Antworten an Werten hängen. 15 von 1.010 waren
es.

### Zuerst gemessen, wo es sich lohnt
Eine Bedingung in einem Ereignis, das niemand sieht, ist verschenkt. Über 40
Laufbahnen gezählt, welche Ereignisse am häufigsten gezogen werden — und die 18
meistgezogenen **ohne** bedingte Option bekamen eine: `x_taktikvideo` (18 von
40), `al_ernaehrung`, `derbytor`, `sf_schock`, `rivale`, `o_mentor` und andere.

Bewusst über die ganze Wertebreite: Vermögen · Beliebtheit · Moral · Vertrauen ·
Fitness · Alter · Titel · Passspiel · Schuss · **Herkunft** (Hochland) und
**Stärke** — die 44 Spielertyp-Eigenschaften waren bis dahin gar keine
Bedingung.

### Der Fehler: geschätzt statt gemessen
Danach die Probe, ob die Bedingungen in echten Laufbahnen je zutreffen. **Sieben
von 33 waren in 60 Laufbahnen nie offen.** Der gemeinsame Nenner war peinlich
eindeutig: ich hatte die Geldschwellen geraten.

Nachgemessen, 60 Laufbahnen:

| Alter | Median | oberes Viertel | oberes Zehntel | Höchstwert |
|---|---|---|---|---|
| 22 | 0,07 | 0,10 | 0,14 | 0,39 |
| 28 | 0,17 | 0,34 | 0,81 | 1,94 |
| 34 | 0,33 | 0,67 | 1,50 | 3,68 |

Meine Schwellen lagen bei **1 bis 4 Mio.** Das trifft im ganzen Spiel fast
niemanden. Alle Schwellen auf das gemessene obere Viertel des jeweiligen Alters
gesetzt — 0,09 bis 0,7 — und die Kosten der Optionen mit.

Dazu zwei weitere Ursachen derselben Art:
- **`koch` wird in 60 Laufbahnen nie gesetzt** (sein eigenes Ereignis verlangt
  1 Mio.). Eine Bedingung auf eine Flagge, die es praktisch nicht gibt, ist tote
  Anzeige. Ersetzt durch eine Geldschwelle.
- **Jeder Spieler trägt genau EINE Stärke aus 44.** Eine Bedingung auf drei
  bestimmte trifft rund 7 % — gemessen 0 von 16 Anzeigen. Die Listen sind
  thematisch verbreitert, nicht aufgeweicht: es bleiben Stärken, bei denen die
  Option wirklich Sinn ergibt.

### Ergebnis
| | vorher | nachher |
|---|---|---|
| Bedingte Optionen | 15 | **33** von 1.028 |
| davon nie erreichbar | 7 | **0** |
| Ereignisse mit 3+ Optionen | 34 | **51** |

Die schwächste liegt jetzt bei 6 %, die stärkste bei 100 %. `ausstieg#0` steht
bei 0 von 2 Anzeigen — dafür fehlen schlicht die Daten, nicht die Erreichbarkeit.

**Daraus eine Regel für den weiteren Ausbau:** eine neue Bedingung wird nicht
geschätzt, sondern gegen die gemessene Verteilung gesetzt, und danach wird
nachgezählt, wie oft sie offen ist. Ziel ist grob ein Viertel bis die Hälfte der
Anzeigen; unter 5 % ist es Zierde.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Bündel **1.125,67 kB** / 415,96 kB gepackt.
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.11. Grundlinien unverändert.
Erreichbarkeit über 60 Laufbahnen gemessen, vorher und nachher.

## 35.12 · Die Ehrentafel sagt jetzt, wohin

Erster der drei Akademiepunkte. Der kleinste, deshalb zuerst.

### Punkt H: welcher Verein den Absolventen geholt hat
Bis 35.11 stand auf der Ehrentafel nur, **dass** jemand Profi geworden ist. Ein
Absolvent speicherte `id · name · flag · nat · pos · ein · raus · peak · ns` —
keinen Verein, und es wurde auch keiner gezogen.

Jetzt schon, und zwar **nicht gewürfelt**: der Verein passt zur erreichten
Stärke. Gesucht wird im Fenster von ±6 um `peak − 2…9`, mit 55 % Vorzug für das
Heimatland des Talents, falls dort etwas Passendes liegt. Findet sich gar
nichts, entscheidet die Nähe zur Zielstärke.

Die Jahresmeldung nennt ihn mit: statt *„X geht als Profi heraus"* jetzt
*„X unterschreibt bei Y"*.

**Alte Sicherungen** kennen das Feld nicht. Die Zeile bleibt dann weg statt
„undefined" anzuzeigen — dieselbe Absicherung wie bei der Anzeige „Was danach
kommt" in 35.7.

Nachgewiesen an 710 Absolventen aus 20 Akademien: jeder hat einen Verein, jeder
Verein existiert wirklich, **545 verschiedene**. Peak ≥ 85 landet im Mittel bei
Vereinsstärke **80,7**, Peak ≤ 65 bei **55,6**.

### Punkt G gemessen: die Antwort ist „ja, aber"
Kevins Frage war, ob zu selten Profiverträge herauskommen. Gemessen über je 25
Akademien à 25 Jahre, alle Abteilungen auf derselben Stufe:

| Stufe | Aufnahmen | Profis | Abbrecher | **Profiquote** |
|---|---|---|---|---|
| 1 | 37,0 | 0,5 | 32,2 | **2 %** |
| 2 | 62,4 | 1,8 | 53,1 | **3 %** |
| 3 | 62,0 | 1,8 | 52,1 | **3 %** |
| 4 | 88,1 | 8,9 | 66,6 | **12 %** |
| 5 | 112,9 | 16,2 | 79,9 | **17 %** |
| 6 | 138,2 | 33,4 | 84,1 | **28 %** |

*Berichtigung (35.13): diese Tabelle ist um eine Stufe verschoben. Das Messskript
setzte die Abteilungen auf 0 bis 5, im Spiel laufen sie von 1 bis 6. Die Form der
Kurve stimmt, die Höhe nicht — richtig gemessen lag Stufe 6 bei 43 %, nicht 28 %.
Der Befund „die Stufen 1 bis 3 bringen fast nichts" bleibt richtig: 4 → 6 → 12 %.*

**Die Quote als solche ist gewollt** — der Kommentar im Rechenkern sagt
ausdrücklich, die allermeisten schaffen es nicht, und 28 % auf Vollausbau ist
für eine Jugendakademie eher grosszügig.

**Das Problem ist die Kurve, nicht die Höhe.** Von Stufe 1 auf 3 passiert
praktisch nichts: 2 % auf 3 %. Man zahlt zwei Ausbaustufen und sieht bei dem
Ergebnis, das einen am meisten interessiert, **keinen Unterschied**. Erst ab
Stufe 4 springt es.

Der Grund steht in der Formel: `proChance = .07 + (ovr − 50) × .022 +
buehne × .02`. Direkt wirkt nur die Wettbewerbsabteilung; alle anderen wirken
nur über die Stärke der Talente, und die ist auf niedriger Stufe so gering, dass
der mittlere Term negativ bleibt.

**Das gehört zu Punkt F.** Wenn die Leiter länger wird — Kevin will mehr Kosten
und zwei bis drei weitere Abteilungen —, wird der flache Anfang noch länger.
Beides zusammen anzufassen ist richtig, getrennt wäre es doppelte Arbeit.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Bündel **1.126,03 kB** / 416,11 kB gepackt.
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.12. Die Rückwärtsprüfung deckt die
Ehrentafel mit alten Einträgen ab.

## 35.13 · Die Akademie wird größer

Punkt F, der letzte offene Punkt von Kevins Zettel. Drei Wünsche auf einmal:
mehr VC-Bedarf, zwei bis drei weitere Abteilungen, höherer VC-Verdienst — bei
gehaltenem Zielband 25–35 Laufbahnen.

### Drei neue Abteilungen
Bewusst **teurer** als die sechs alten, und die alten bleiben unangetastet:
niemandem soll die schon bezahlte Arbeit entwertet werden.

| Abteilung | Kosten Stufe 2–6 | wirkt auf |
|---|---|---|
| **Mentaltraining** | 26 · 48 · 78 · 112 · 152 | deutlich weniger Abbrecher · ruhiger im Sichtungsspiel |
| **Videoanalyse** | 28 · 52 · 84 · 120 · 164 | schnellere Entwicklung der Talente |
| **Netzwerk zu Profivereinen** | 30 · 56 · 90 · 130 · 178 | direkt mehr Profiverträge |

Vollausbau: **2.912 statt 1.564 VC**, 9 Abteilungen statt 6, 45 Ausbaustufen
statt 30.

### Zwei Zahlen bewusst verschoben, eine bewusst gehalten
- **Verdienst ×1,80.** Als *eigener* Faktor neben dem vorhandenen ×1,18 für den
  Shop — getrennt, damit man beiden ansieht, wofür sie da sind. Wer eine der
  Ursachen ändert, weiss dann, an welcher Zahl er zu drehen hat.
- **Kostenband 1400–1700 → 2700–3100.** Keine stille Anpassung an ein Ergebnis,
  sondern eine absichtlich verschobene Schranke: der Ausbau *soll* teurer sein.
- **Laufbahnen bis Vollausbau bleibt 25–35.** Das ist die eigentliche Schranke
  und fängt ab, wenn Kosten und Verdienst auseinanderlaufen. Gemessen **27,6**.

### Der Fehler, den nur der Prüfstand gefunden hat
Nach dem Einbau meldete er acht Fehler, darunter *„Ehrentafel: 25 Jahre, 0
Karton"* — die Testakademie produzierte plötzlich **gar keine Absolventen mehr**.

Ursache: `leereAkademie()` zählte die sechs Abteilungen **namentlich** auf. Die
drei neuen fehlten damit im Grundzustand, `S.mental` war `undefined`, die
Rechnung wurde `NaN`, `chance(NaN)` ist immer falsch — also brach niemand mehr
ab und **niemand wurde mehr Profi**.

**Das hätte jede bestehende Sicherung getroffen**, denn `akaJahr` ergänzt
fehlende Stufen aus genau dieser Liste. Ein Spielstand mit sechs Abteilungen
wäre nach dem Update eine Akademie ohne Absolventen gewesen — und im Spiel
hätte man es erst nach einigen Jahren gemerkt.

Behoben, indem der Grundzustand aus `ABTEILUNGEN` **abgeleitet** wird. Wer
künftig eine Abteilung ergänzt, muss dort nichts mehr nachtragen.

Dieselbe Klasse Fehler steckte dreimal im Prüfskript selbst: fest verdrahtete
`30`, `36` und `6 * AKA_MAX`. Auch die rechnen jetzt aus `ABTEILUNGEN`.
(Der erste Anlauf dazu brach mit `SOLL_SUMME is not defined` — die beiden
Prüfungen stehen in verschiedenen Blöcken. Jetzt an beiden Stellen ausgerechnet.)

### Punkt G miterledigt: die Kurve ist gespreizt
Die Profiquote je Stufe, mit den **echten** Stufenwerten 1–6:

| Stufe | vorher | nachher |
|---|---|---|
| 1 | 4 % | **4 %** |
| 2 | 6 % | **10 %** |
| 3 | 12 % | **17 %** |
| 4 | 20 % | **32 %** |
| 5 | 32 % | **41 %** |
| 6 | 43 % | **45 %** |

Der flache Anfang ist weg: früher brachte Stufe 1→3 vier auf zwölf Prozent bei
zwei bezahlten Stufen, jetzt vier auf siebzehn. Oben bewegt sich wenig — dort
war es nie das Problem.

**Falls 45 % zu großzügig wirkt:** die Schraube ist `S.netzwerk * .014` in
`proChance`. Eine Zahl, ein Ort.

### Eine wacklige Prüfung entwackelt
Beim Abschlusslauf meldete der Prüfstand plötzlich *„Wildcards — nie gezogen:
hsv"*, obwohl an Wildcards nichts geändert worden war. Der Lauf davor war grün.

Nachgemessen an 400.000 Ziehungen: **„hsv" kommt 1 zu 1.020.** Die Prüfung zog
4.000 Mal — dabei bleibt es in **1,98 %** der Läufe aus, also etwa in jedem
fünfzigsten Prüfstandlauf. Eine Prüfung, die zufällig rot wird, ist schlimmer
als keine: sie bringt einem bei, Rot zu übersehen. Auf 20.000 Ziehungen
angehoben, damit sind es 1 zu 328 Millionen; Kosten rund eine Sekunde.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Ehrentafel wieder 40 Absolventen, 3 Weltklasse.
Vollausbau 45 von 45 Ausbaustufen, `akaSumme` 54.
Bündel **1.126,74 kB** / 416,43 kB gepackt. `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.13.

## 35.14 · Antworten, die nur manchmal da sind

Kevins Nachfrage hat einen Unterschied aufgedeckt, den ich vorher nicht sauber
getrennt hatte. In 35.8 und 35.11 habe ich **bedingte** Optionen gebaut: sie
hängen an Werten und sind damit **vorhersehbar**. Kevin meinte etwas anderes —
Alternativen, die **manchmal** auftauchen.

Das ist eine eigene Mechanik, und sie trifft „fühlt sich gleich an" sogar
direkter: dasselbe Ereignis zeigt in zwei Laufbahnen verschiedene Knöpfe, ohne
dass man es kommen sieht.

### Gewürfelt wird beim Ziehen, nicht beim Anzeigen
Eine Auswahl mit `manchmal: .3` erscheint in knapp einem Drittel der Fälle.
**Der Wurf gehört in `drawEvents`.** Beim Anzeigen würde bei jedem Neuzeichnen
neu gewürfelt, und der Knopf könnte mitten in der Entscheidung verschwinden.

Zwei Dinge, die das erst unbedenklich machen:
- `drawEvents` legte an dieser Stelle **ohnehin schon flache Kopien** an (wegen
  `_ctx`). Die geteilten Objekte in `EVENTS` werden nicht verändert — geprüft
  über 4.000 Ziehungen.
- Die Warteschlange liegt nur in `useState`, **nicht in der Sicherung**. Sonst
  müssten Funktionen serialisiert werden.

**Sicherheitsnetz:** die harte Prüfung „bedingungsloser Ausweg" verlangt jetzt
eine Option ohne `cond` **und** ohne `manchmal`. Sonst könnte ein schlechter
Wurf alle Knöpfe wegnehmen.

### Zwölf Alternativen in häufig gezogene Ereignisse
Bewusst keine Zwischenwege, sondern ein dritter Ausgang mit eigenem Charakter —
sonst wäre es nur eine weitere Schattierung derselben Entscheidung. Die Sitzung
platzen lassen. Das Videostudium ganz sein lassen. Dem anderen die Mentorenrolle
geben, statt sie zu nehmen. Im Derby quer legen statt zu schiessen.

Gemessen über 4.000 Ziehungen: alle Anteile treffen ihren Sollwert innerhalb von
9 Prozentpunkten.

### Vierzehn weitere Ereignisse für den Anfang
Nach 35.10 standen mit 16 zwar 36 Ereignisse in 15 Themen bereit — aber **acht
dieser Themen hatten nur ein oder zwei Einträge**. Gezielt dort aufgefüllt:
Familie, Privat, Alltag, Konkurrenz, Medien, Fans, Körper, Kurios, Herkunft.

Die Mutter, die ihre Stelle verliert und es nicht sagt. Der Großvater, der seit
zwanzig Jahren jedes Spiel filmt. Vierzig Fahrstunden neben dem Training. Der
Neue aus dem Ausland, der beim Essen allein sitzt. Der Akzent, den sie in der
Kabine nachmachen. Der erste braune Umschlag vom Finanzamt.

### Das Werkzeug hat zwei Wechselwirkungen sofort gefunden
`a2_fuehrerschein` vergab `fuehrerschein`, **den es schon gab** (`j_fuehrerschein`),
und `a2_behoerde` vergab `steuerberater`, den `ew_steuer` schon vergibt. Man
hätte den Führerschein zweimal machen und zweimal denselben Berater suchen
können. Drei Bedingungen nachgezogen — auch bei `ew_steuer`, das seine eigene
Flagge bis dahin nicht abfragte.

### Zahlen
| | 35.13 | 35.14 |
|---|---|---|
| Ereignisse | 488 | **502** |
| Optionen | 1.028 | **1.073** |
| davon nur manchmal | 0 | **15** |
| davon mit Bedingung | 33 | **34** |
| Ereignisse mit 3+ Optionen | 51 | **56** |
| Topf mit 16 Jahren | 36 | **40** |

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Bündel **1.141,97 kB** / 421,29 kB gepackt.
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.14. Grundlinien unverändert.
Mechanik über 4.000 Ziehungen nachgewiesen: Anteile stimmen, `EVENTS` bleibt
unverändert, keine Ziehung ohne Optionen.

## 35.15 · Vier Geschichten statt einer

Nach 35.9 gab es **einen** Strang bei 502 Ereignissen. Die Mechanik trug
deutlich mehr, sie war nur nicht genutzt.

| Strang | Stufen | Ereignisse | Wege |
|---|---|---|---|
| Der aus der Jugend | 3 | 5 | geholfen · Geld · abgewimmelt |
| **Das Buch** | 3 | 5 | offen · Freigaberecht · abgelehnt |
| **Das Knie** | 3 | 5 | behandelt · getragen · pausiert |
| **Dein Trainer** | **4** | 6 | treu · höflich · still |

Bewusst unterschiedlich gebaut. *Das Buch* ist eine Frage nach Kontrolle: wie
viel gibt man ab, wenn jemand die eigene Geschichte aufschreibt. *Das Knie* ist
die kleine Verletzung, die nicht weggeht — der erste Strang, der `injuryProne`
über Jahre trägt statt nur einmal zu zucken. *Dein Trainer* hat als erster
**vier** Stufen und läuft über eine halbe Laufbahn: von der Entlassung an einem
Dienstagvormittag bis zu seiner Verabschiedung mit einundsechzig.

### Zwei Messungen, zwei Nachbesserungen
**Kommen sie an?** Ein Strang, der bei Stufe 2 versandet, ist schlechter als
keiner. Gemessen über 80 Laufbahnen: **92 bis 100 %** Abschlussquote.

Dahin war es aber ein Weg. Erste Messung:

- **Nur 43 % der Laufbahnen erlebten überhaupt eine Geschichte.** Die
  Einstiegsereignisse trugen `w:3` — dasselbe Gewicht wie ein beliebiges
  Alltagsereignis, obwohl sie den Kopf einer mehrjährigen Geschichte bilden.
  Auf `w:7` angehoben; die Fortsetzungen brauchen kein Gewicht, sie bekommen
  ohnehin den festen Platz. Jetzt **60 %**.
- **`buch` kam nur zu 62 % an**, weil es nach dem Start noch fünf Saisons
  braucht und häufiger auch in Laufbahnen startet, die früher enden.
  Wartezeiten von 2+3 auf 1+2 gekürzt und Einstieg von 25 auf 23 Jahre
  vorgezogen. Jetzt **94 %**.

**Verdrängen sie die normalen Ereignisse?** Nein: Strangereignisse machen
**5,2 %** aller gezogenen aus, und in 83 % der Saisons läuft gar kein Strang.
Zwei gleichzeitig kommen in unter einem Prozent der Saisons vor — die Sorge,
dass der zweite Ziehungsplatz dauerhaft belegt sein könnte, war unbegründet.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Die Strangprüfung erkennt alle vier und
bestätigt: lückenlose Stufen, kein Weg ohne Erzeuger, kein Weg ohne Nachfolger,
Tabelle stimmt mit den vorhandenen Stufen überein.
**518 Ereignisse** (502 + 16 neue in Strängen), 21 davon in Strängen.
Bündel **1.154,73 kB** / 424,89 kB gepackt. `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.15.

*(Im ersten Entwurf dieses Blocks stand 523 — geschätzt, nicht gezählt. Der
Prüfstand meldete 518. Dieselbe Sorte Zahl wie die Bündelgröße in 35.4.)*

## Offene Punkte (Stand 35.15)

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
8. **Spielerpass wächst weiter (gemeldet 15.8.).** Nicht die Vereinsliste — die
   steht seit 34.16 fest auf 150 px. Verdächtig ist `.zellen` (`flex-wrap:wrap`
   mit `flex:1 0 auto`): die vier Felder *Stationen · Spiele · Tore · Vorlagen*
   können nicht schrumpfen und brechen um, sobald die Zahlen breiter werden.
   Dazu ab sechs Stationen einmalig die Zeile „N Stationen“. **Vor der Änderung
   messen** — `.zellen` steckt auch in der Karriere-Kopfleiste.
9. **„Moral“ umbenennen?** Als sichtbare Beschriftung nur zwei Stellen (Meter im
   Zustand, Wirkungstabelle); das Feld `morale` mit 910 Vorkommen bleibt
   unangetastet, sonst brechen alte Spielstände. Empfehlung: „Moral“ ist im
   Fußball das etablierte Wort, „Motivation“ trifft es nicht — der Wert ist
   Stimmung, nicht Antrieb. Der eigentliche Mangel: **in der Kurzanleitung fehlt
   Moral komplett**, obwohl Form, Fitness, Vertrauen und Bekanntheit dort stehen.
10. **`App.jsx` hat noch 12.041 Zeilen** (seit 35.6, vorher 14.271). Das ist KEINE Anforderung
   der APK — `schriften.js` und `storage.js` sind bereits eigene Dateien, Vite
   bündelt Importe problemlos. Eine Aufteilung in acht bis zwölf Bausteine würde
   jede Sitzung schneller machen, berührt aber `exporte.txt`, den
   Prüfstandaufbau und jede Stelle, an der mit Zeilennummern gearbeitet wird.
   **Auf Kevins Wunsch vertagt.** Nur mit Ruhe, in kleinen Schritten, und
   niemals kurz vor einem Test.
11. **Noch 5 folgenlose Flaggen** (seit 35.7, vorher 13): `attest`,
   `beidseitig`, `manipuliert`, `pendeln`, `treugeblieben`. Sie brauchen
   eigenen Inhalt, nicht nur einen Anschluss an ein vorhandenes Ereignis —
   das gehört in den Inhaltsausbau. `treugeblieben` wirkt immerhin über
   `loyalBonus` mit.
12. **Argumentreihenfolge der Schreibwerkzeuge ist uneinheitlich.**
   `uebersicht.cjs <Ziel>` gegen `vorschau.py <Quelle> <Ziel>` gegen
   `verzeichnis.cjs <Datei>` — dreimal etwas anderes. Ein einheitliches Muster
   (Quelle zuerst, Ziel zuletzt, beide benannt) würde die Sorte Fehler aus 35.4
   ausschliessen statt sie einzeln abzufangen. Klein, aber berührt jeden
   Aufrufort in `pruefen.sh` und `sicht.sh`.
13. **Langzeittest der Fassungen ab 34.15 steht aus** — Wachstumskurve, Ereignisse,
   Auto-Training, Sprache, Frauenfußball über mehrere Laufbahnen am Stück. Das ist
   Kevins Seite: der Prüfstand rechnet 300 Laufbahnen durch, aber niemand *spielt*
   sie. Ob sich eine Laufbahn über zwanzig Saisons richtig anfühlt, sagt keine
   Kennzahl.

**Seit 35.14 erledigt:** drei weitere Storystränge (Buch, Knie, Trainer), Einstiegsgewichte und Wartezeiten kalibriert.

**Seit 35.13 erledigt:** gelegentlich angebotene Alternativen (12 Stück), 14 weitere Anfangsereignisse.

**Seit 35.12 erledigt:** drei neue Akademieabteilungen, Vollausbau 2.912 VC, Verdienst angehoben, Profikurve gespreizt (Punkte F und G).

**Seit 35.11 erledigt:** die Ehrentafel nennt den Verein (Punkt H); Profiquote je Ausbaustufe gemessen (Punkt G).

**Seit 35.10 erledigt:** 18 weitere bedingte Optionen; Schwellen an der gemessenen Vermögensverteilung nachgerechnet.

**Seit 35.9 erledigt:** 20 Ereignisse für den Anfang; der Topf in Saison 0 wächst von 28 auf 41.

**Seit 35.8 erledigt:** Storystränge (Punkt B), erster Strang mit drei Stufen und drei Wegen.

**Seit 35.7 erledigt:** Optionen können an Charakterwerte gebunden werden (Punkt C), zehn Stück eingebaut.

**Seit 35.6 erledigt:** tote Flaggen 13 → 5 · der Trainerschein wirkt · zwei Ereignisketten angeschlossen.

**Seit 35.5 erledigt:** die Ereignisse liegen in einer eigenen Datei, datengleich nachgewiesen.

**Seit 35.4 erledigt:** Prüfwerkzeug für die Ereignisse · 8 Doppler · 20 Fälle „Angebot trotz Besitz“ · die Nationalbinde wird wirklich vergeben.

**Seit 35.3 erledigt:** der Prüfstand verlangt zu jeder Fassung einen Messblock · drei Unsauberkeiten in dieser Datei.

**Seit 35.2 erledigt:** der Prüfstand prüft das Verzeichnis mit.

**Seit 35.1 erledigt:** STAND.md hat ein selbsterzeugtes Verzeichnis.

**Seit 34.38 erledigt:** Ereigniswiederholung gemessen und eingeordnet — damit sind alle Befunde des grossen Tests bearbeitet.

**Seit 34.37 erledigt:** alle 212 Nationalflaggen auf der Kapitänsbinde.

**Seit 34.35 erledigt:** goldener Markenpuls · Kopflinie in der Stufenfarbe · Zielverein für den Trainerruf · Rautekarte räumt offene Versprechen ab.

**Seit 34.34 erledigt:** Bärte bleiben innerhalb der Kopfform (Beschnitt auf kopfD).

**Seit 34.33 erledigt:** Lesbarkeit auf dem Laufzettel · kein Gummiziehen am Rand · versprochene Rückkehr wird eingelöst.

**Seit 34.32 erledigt:** Kopfformen wieder spiegelgleich, mit Nachrechnung im Prüfstand.

**Seit 34.31 erledigt:** Wildcard bleibt auf dem Laufzettel lesbar.

**Seit 34.30 erledigt:** Kartenwechsel führt die Höhe weich · drei Saisonschritte auf Formularpapier.

**Seit 34.29 erledigt:** Altersgrenze an einer Stelle · Kopfform Weich nicht mehr zu selten · Wildcard-Verteilung messbar · Belastungstest im Prüfstand.

**Seit 34.28 erledigt:** Herkunft wirkt auf Nase, Mund und Lidspalt · Statur zieht den Kopf · weibliche Porträts mit Wimpern und Schminke · Porträtbogen kann Frauen.

**Seit 34.27 erledigt:** zwei Kopfformen mit weich auslaufendem Kinn (Zart, Rundlich).

**Seit 34.26 erledigt:** drei runde Kopfformen (Vollmond, Breit, Weich) · Porträtbogen wieder benutzbar.

**Seit 34.25 erledigt:** Rückblick auf Karteikarten mit Ziehbewegung.

**Seit 34.24 erledigt:** Rangfarben stimmen zwischen Übersicht und Karte · Rangschrift lesbar (Bronze zusätzlich korrigiert).

**Seit 34.23 erledigt:** Stärke läuft hoch mit Markenpuls · Kapitänsbinden fest platziert · Flaggenbauart auf der Nationalbinde.

**Seit 34.22 erledigt:** jeder Seitenwechsel beginnt wieder oben.

**Seit 34.21 erledigt:** Laden rechnet ab (Nachkaufen, Ablauf, kein Geschenk an neue Laufbahnen) · Aufmacher der Ruhmeshalle · Namensfeld leerbar.

**Seit 34.20 erledigt:** Zurück-Taste des Geräts (in der APK bestätigt, 15.8.2026)
· Überlappung von Laden und Zahnrad im Hauptmenü · zwei Falschalarme in
`startprobe.cjs` · `erreichbar.cjs` in der Werkzeugtabelle nachgetragen.

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
