# Rasenschach XI 35.168 — Bericht zur Zusammenführung

**An:** ChatGPT / Codex
**Von:** Claude
**Grundlage:** Codex-Stand 35.167 (14.09.2026) und die parallelen Fassungen 35.165–35.168
**Ausgeliefert:** 35.168, 14. September 2026

---

## 0 · Worum es geht

Zwischen dem 13. und 14. September haben wir beide am selben Projekt
gearbeitet, ohne voneinander zu wissen. Codex setzte auf **35.166** auf. Ich
hatte danach noch zwei Fassungen gebaut — **35.167 und 35.168** in meiner
Zählung —, die vier Gerätebefunde von Kevin behoben.

Dieser Bericht sagt, was beim Zusammenführen zurückkam, was ich behoben habe
und was für den nächsten Durchgang zu beachten ist. Die Fassungsnummern
kollidieren: mein 35.167 und das Codex-35.167 sind verschiedene Stände. Das
ausgelieferte **35.168 enthält beide.**

---

## 1 · Der Codex-Stand ist die Grundlage

Übernommen und unverändert gelassen:

- `buchungen.js` mit `packBuchung` und `verkaufsBuchung`
- `sicherung.js` mit `datenErsetzen`, `bucheBestand`, `bucheAenderung`
- `spielstand.js` Schema 2 mit `auswahlIds`
- `ereignis-ids.cjs` als Prüfwerkzeug
- die sechs neuen Befunde **F59 bis F64** samt Behebung
- das Android-Projekt und der reparierte Workflow
- die 47 Regressionstests

**Nichts davon habe ich angetastet.** Die gemeinsamen Journalbuchungen sind
die richtige Lösung für ein Problem, das mein Prüfstand nie gesehen hat: er
prüft Ergebnisse, nicht Teilzustände nach einem Schreibfehler.

---

## 2 · Drei Befunde kamen zurück

| Befund | Fassung | Im Codex-Stand | Jetzt |
|---|---|---|---|
| Vorsatz auf der Passrückseite | 35.166 | enthalten | — |
| **Kontrast in der Saisonbilanz** | mein 35.167 | zurück | behoben |
| **Die drei Erklärzeilen** | mein 35.168 | zurück | entfernt |

### Der Kontrastfehler ist der ernste

`className="pan pad"` in der Seite „Warum es so lief" des Saisonrückblicks.
Der Rückblick läuft auf einem Kartonblatt, und `--pan` bleibt dort **dunkel**
— die Wildcard-Karte braucht das (Behebung aus 35.122).

    Tinte #14171A auf --pan #211E17   →   Kontrast 1,08   (Grenze 3)

Die drei Gründe waren praktisch unsichtbar. Das ist **das dritte Mal**
dieselbe Falle: Kevin fand sie in 35.121, ich lief in 35.149 wieder hinein,
und beim Zusammenführen kam sie zurück.

**Warum kein Prüfstand sie fängt:** der Kontrastwächter braucht einen
gespielten Saisonabschluss, um diese Seite zu erreichen. Er deckt sieben
Ansichten ab, diese ist nicht dabei.

### Die Erklärzeilen

Drei Sätze über dem Spielerpass, die beschrieben, was daneben stand
(„Wähle einen Schwerpunkt…" neben den Schwerpunkt-Kacheln). Kevin hat sie
zweimal auf dem Gerät eingekreist. Entfernt; nur das Schwebende bleibt
(„Dein Wechselwunsch gilt fürs nächste Transferfenster").

---

## 3 · Zwei Lücken im übergebenen Paket

### `@babel/parser` fehlt in package.json

**Berichtigt gegenüber der ersten Fassung dieses Berichts.** Ich hatte
geschrieben, Babel fehle im Paket. Das stimmt so nicht: `@babel/parser`
**7.29.8** war bereits in `package-lock.json`, als indirekte Abhängigkeit von
`@babel/core`. Er fehlte nur als **direkte** Angabe in `package.json`.

Die Folge war trotzdem real: `pruefstand/ereignis-ids.cjs` lädt ihn per
`require`, und nach `npm ci` lag er nicht auf einem Pfad, den das Werkzeug
aus dem Bauverzeichnis `/tmp/ps` erreicht. Weil `pruefen.sh` den Rückgabewert
auswertet, **brach der gesamte Prüflauf ab**, mit der irreführenden Meldung
„Bitte zuerst npm ci ausführen".

Zwei Änderungen:

1. `@babel/parser` als **direkte** `devDependency` aufgenommen — in genau der
   Fassung, die ohnehin schon im Lock stand (`^7.29.8`).
2. Das Werkzeug lädt den Parser zuerst aus `<Quellverzeichnis>/node_modules`.

**Der erste Anlauf war falsch:** ich hatte `^8.0.5` installiert, also eine
neuere Hauptversion. Die verlangt Node `^22.18.0 || >=24.11.0`, während
`package.json` `>=22.12.0` angibt — ein stiller Konflikt, der auf Node 22.12
bis 22.17 zugeschlagen hätte. Mit 7.29.8 (`engines: >=6.0.0`) bleibt die
Mindestversion unverändert.

**Zu F51:** es ist damit keine neue Abhängigkeit hinzugekommen, nur eine
vorhandene ausdrücklich benannt.

### `pruefen.sh` löschte sich die Grundlage selbst

```
Zeile 747:  rm -rf "$ARBEIT/node_modules" "$ARBEIT/dist"
```

Der Produktionsbau räumt auf. Die Regressionen laufen danach (Zeile 898) und
fanden `esbuild` nicht mehr:

    Error: Cannot find module 'esbuild'

Einzeln aufgerufen liefen sie durch — im langen Lauf nicht. Behoben: fehlt
die Umgebung vor dem Regressionsteil, wird sie einmal wiederhergestellt.

---

## 4 · Ein Zielkonflikt, kein Fehler

Die Übergabe nennt: *„Lange Vereinsnamen können umbrechen."* Umgesetzt mit
`whiteSpace: "normal"` auf der Vereinszeile im Spielerpass.

Richtig — aber der Pass wächst dadurch. Die Sichtprüfung misst bei **360 px**
einen Sprung von **14,6 px** über neun Karrierestände; erlaubt ist 1 px. Der
Pass ist als feste Karte gebaut, und ein springender Rahmen ist auf dem Gerät
sichtbar.

**Beides ist erfüllbar:**

```js
whiteSpace: "normal",
display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
overflow: "hidden", minHeight: "2.4em", lineHeight: 1.2
```

Namen brechen auf bis zu zwei Zeilen um, die Zeile behält die Höhe von zwei
Zeilen unabhängig vom Inhalt. Passhöhe wieder konstant: 348,1 px (412/360 px)
und 385,9 px (320 px).

Ich habe keine Seite geopfert — das war der Punkt.

---

## 5 · Eine meiner Prüfungen passte nicht mehr

Die F44-Probe suchte wörtlich:

```js
const basis = kartenRef.current || karten
```

Diese Zeile gibt es nach dem Umbau nicht mehr; `kartenRef.current || karten`
wird jetzt direkt an `packBuchung` und `verkaufsBuchung` übergeben.

**Nachgemessen: an sechs Stellen wird aus dem Ref gelesen, jede
`setKarten`-Stelle zieht es mit.** Die Sache stimmt, nur die Fundstelle war
eine andere. Die Probe prüft jetzt, was F44 wirklich verlangt, statt einer
festen Zeile.

---

## 6 · Dokumentation nachgezogen

`STAND.md` kannte **F60 bis F63 nicht** — nachgetragen aus dem Gesamtbericht
Revision 6, nicht aus dem Gedächtnis.

Dazu ein Messblock zum Zielband: ein Prüflauf meldete **20,0 bei einer
Untergrenze von 20**.

    fünf feste Startwerte, je 300:   21,1 · 20,8 · 21,0 · 20,7 · 20,4
    sechs Läufe ohne Seed, je 600:   21,0 · 20,8 · 20,6 · 21,0 · 20,8 · 20,6

Der Wert liegt im Band, die 20,0 war ein Ausreißer bei 300 Laufbahnen. **Die
Grenze bleibt** — aber der Abstand ist auf 0,6 geschrumpft, und das steht
jetzt dokumentiert. Seit 35.156 ist die Messung mit `--seed` reproduzierbar;
falls das Band künftig häufiger rot meldet, ist die Ursache im Spiel zu
suchen, nicht in der Messung.

---

## 7 · Abnahme des zusammengeführten Stands

| | Codex 35.167 | 35.168 |
|---|---|---|
| Ansichten | 816, 0 Fehler | 816, 0 Fehler |
| Verein | 646, 0 Fehler | 646, 0 Fehler |
| Regressionen | 47 | 47 |
| Textkatalog | 9.805 Proben, 0 | 9.805 Proben, 0 |
| Kontrast | 904 Stellen | **906 Stellen**, 0 Befunde |
| Ereignis-IDs | 532 / 1.161, 0 fehlend | unverändert |
| Passhöhe über 9 Stände | **Sprung 14,6 px** | **konstant** |
| Browsertest | 14/14 (ohne Startprobe) | **14/14 mit Startprobe** |

Der Browsertest lief mit `ERSTSTART=1` und ohne `SKIP_STARTPROBE` — also mit
echtem Browsernachweis, nicht in der ausgelassenen Variante.

---

## 7a · Prüfstufen — was wodurch belegt ist

Auf Kevins Vorgabe getrennt ausgewiesen. **Historische Protokolle sind hier
nicht als neue Prüfung gezählt.**

| Bereich | Quellcode übernommen | automatisch geprüft | im Browser geprüft | auf Android geprüft |
|---|---|---|---|---|
| Journalbuchungen (F63) | ✓ Codex | ✓ 47 Regressionen, neu gelaufen | teilweise | offen |
| Packprüfung (F59) | ✓ Codex | ✓ Regressionen | teilweise | offen |
| Wiederaufnahme (F60, F62) | ✓ Codex | ✓ Regressionen | teilweise | offen |
| Fanshopfaktor (F61) | ✓ Codex | ✓ Regressionen | — | offen |
| Schema 2 / Auswahl-IDs | ✓ Codex | ✓ `ereignis-ids.cjs`: 532 / 1.161, 0 fehlend | — | offen |
| Barrierefreiheit (F49, F50) | ✓ Codex | ✓ 646 Vereinsprüfungen | teilweise | **offen** |
| Sechs Vorsätze | ✓ Codex | ✓ Vereinsprüfungen | ✓ Startprobe | offen |
| Saisonrückblick-Kontrast | ✓ Claude | ✓ 906 Kontraststellen | **nicht erreichbar** | offen |
| Konstante Passhöhe | ✓ Claude | ✓ Sichtprüfung, 3 Breiten | ✓ Startprobe | offen |
| APK-Workflow | ✓ Codex (GitHub-Update) | — | — | **nicht ausgeführt** |

**Der Saisonrückblick-Kontrast ist die einzige Zeile ohne Browsernachweis.**
Die Seite braucht einen gespielten Saisonabschluss; weder `browsertest.sh`
noch der Kontrastwächter erreichen sie. Genau dort trat der Fehler dreimal
auf.

### Die 47 Regressionen sind neu gelaufen

Nicht aus dem Codex-Paket übernommen, sondern am 14.09.2026 auf dem
zusammengeführten Stand ausgeführt. Protokoll:
`nachweise/35.168/pruefen.log`.

    816 Ansichtsprüfungen        0 Fehler
    646 Vereinsprüfungen         0 Fehler
    47 Regressionen              bestanden
    9.805 Textproben             0 Befunde
    906 Kontraststellen          0 Befunde
    532 Ereignisse / 1.161 IDs   0 fehlend
    Passhöhe über 9 Stände       konstant (348,1 / 385,9 px)
    Browsertest mit Startprobe   14 von 14

Protokolle: `nachweise/35.168/pruefen.log`, `sicht.log`, `browsertest.log`.

### Was ausdrücklich NICHT geprüft ist

- **Kein Android-Build.** Java 21 und Android SDK 35 fehlen in dieser
  Umgebung, wie schon bei Codex.
- **Keine Updatefähigkeit gegenüber Kevins installierter APK.** Ein
  vorhandener Schlüssel und eine bestandene Signaturprüfung im Workflow
  belegen das nicht — das zeigt erst ein Update auf dem Gerät.
- **Kein Gerätetest** in irgendeiner Form.

## 8 · Für den nächsten Durchgang

### Parallele Stände vermeiden

Der Kontrastfehler kam zurück, weil zwei Stände unabhängig weiterliefen. Das
kostete eine Fassung und hätte auf dem Gerät wieder auffallen müssen.

**Vorschlag:** wer weiterarbeitet, setzt auf der zuletzt ausgelieferten
Fassung auf und sagt vorher an, welche das ist. Wenn parallel gearbeitet wird,
gehört eine Liste der geänderten Bereiche in die Übergabe — nicht nur ein
Patch gegen einen älteren Stand.

### Was ich nicht prüfen kann

`browsertest.sh` erreicht den Saisonrückblick nicht vollständig, und der
Kontrastwächter deckt sieben Ansichten ab. **Die Seite, auf der der Fehler
dreimal auftrat, ist in keiner davon.** Wer sie erreichbar macht, schließt
eine Lücke, die bisher nur Kevins Augen gefüllt haben.

### Offen aus Revision 6

Der gesamte Geräteanteil: Android-Build mit passendem JDK und SDK, Update mit
vorhandenem Spielstand, Zurück-Taste und Lebenszyklus, Screenreader, kleine
Displays, Offlinebetrieb. Dazu **F51** (Abhängigkeiten) — durch den
Babel-Nachtrag eher gewachsen als kleiner geworden.

---

## 9 · Anmerkung

Die sechs Befunde aus Revision 6 sind Fehler, die mein Prüfstand strukturell
nicht finden konnte: Teilzustände nach einem Schreibfehler, eine falsch
gesetzte Klammer in einer Formel, ein minifizierter Name im Workflow. Ich
prüfe Ergebnisse; das sind Zustände und Ausdrücke.

**F61** ist das deutlichste Beispiel — eine Klammer, die den Basisfaktor von
1,0 auf 0,2 setzte. Dieselbe Klasse wie F24 aus dem alten Katalog, wo `&&`
stärker band als `||`. Beide hat der Prüfstand nicht gesehen, weil ein
falscher Faktor ein plausibles Ergebnis liefert.

Umgekehrt sind die vier Befunde dieser Runde alle von Kevin gekommen, auf dem
Gerät, in Minuten. Keiner von uns beiden hat sie gefunden.
