# Arbeitsweise — Rasenschach XI

Stand 14. September 2026. Diese Datei hält fest, wie in diesem Projekt
gearbeitet wird und welche Fallen mehrfach zugeschlagen haben. Sie ersetzt
kein Gedächtnis, aber sie spart das Wiederlernen.

---

## Der Ablauf einer Änderung

1. **Nachstellen.** Einen Befund messen, bevor er behoben wird. Ein Bericht
   kann recht haben und trotzdem etwas anderes meinen als gedacht.
2. **Beheben** — an der Ursache, nicht am Symptom.
3. **Gegenprobe.** Eine Prüfung, die *vor* der Behebung rot gewesen wäre.
   Ohne sie ist nicht belegt, dass sie etwas fängt.
4. **Voller Lauf.** `pruefen.sh`, dann `sicht.sh`, dann `browsertest.sh`.
5. **Messblock in STAND.md** mit Zahlen, nicht mit Behauptungen.

Die Gegenprobe ist der Teil, der am ehesten ausgelassen wird und am meisten
wert ist.

---

## Fallen, die mehrfach zugeschlagen haben

### `pan` auf Kartonblättern — dreimal

`--pan` bleibt auf `laufzettel` und `karteikarte` **dunkel**, weil die
Wildcard-Karte das braucht. Ein `className="pan pad"` auf einer Rückblickseite
ergibt Tinte auf Dunkel:

    Kontrast 1,08 bei einer Grenze von 3 — praktisch unsichtbar

Aufgetreten: 35.121 (von Kevin gefunden), 35.149 (selbst gebaut), beim
Zusammenführen 35.168 (zurückgekehrt). Die Nachbarseiten desselben Rückblicks
setzen Text **direkt auf das Papier** — so gehört es gemacht.

### Rückwärts-Anführungszeichen im CSS-Block — zweimal

Der Stilblock ist ein Vorlagenliteral. Ein Backtick in einem Kommentar
beendet es mittendrin; die halbe App ist ohne Stil. Es gibt eine
Hygieneprüfung dafür seit 35.34 — beim zweiten Mal hatte ich ihre Ausgabe
nach `/dev/null` geschickt.

**Regel:** einen Lauf, dessen Ergebnis man braucht, nie ins Leere schicken.

### Namen erfinden statt nachsehen — neunmal

`store.remove` (heißt `delete`), `saveGameSofort`, `setStartFehler`,
`setLoeschFehler`, `ZIEL`, `G` statt `ges`, vier Errungenschaftskennungen,
`hallVoll`.

**Regel:** jeden Bezeichner aus dem Code lesen, nicht aus dem Gedächtnis.
`grep -oE "\bc\.[a-zA-Z]+(\.[a-zA-Z]+)*" ereignisse.js | sort -u` ist
schneller als ein Absturz.

### Das Prüfbündel ist älter als die Quelle — viermal

`/tmp/ps/motor.js` wird von `pruefen.sh` gebaut. Wer direkt danach eine
Einzelprüfung startet, misst den alten Stand — mit Meldungen, die längst
behoben sind.

**Regel:** `TEILE=aufbau bash pruefstand/pruefen.sh App.jsx` vor jeder
Einzelmessung.

### Kommentare für Code halten — viermal

Reguläre Ausdrücke, die den Quelltext durchsuchen, finden ihre eigenen
Erklärkommentare. Einmal fand ein Wächter gegen `Math.random` sich selbst,
weil sein Teststring den Aufruf wörtlich enthielt.

**Regel:** Kommentare vor der Analyse entfernen
(`.replace(/\/\*[\s\S]*?\*\//g, "")`), Teststrings zusammensetzen.

---

## Was der Prüfstand strukturell nicht sieht

Er prüft **Ergebnisse**. Nicht gesehen hat er deshalb:

| Klasse | Beispiel |
|---|---|
| Falsche Klammern in Formeln | F24 (`&&` vs. `\|\|`), F61 (Fanshopfaktor 0,2 statt 1,0) |
| Teilzustände nach Schreibfehlern | F63 — dafür gibt es jetzt die Journalbuchungen |
| Minifizierte Namen im Workflow | F64 (`machVerein` im Bundle) |
| Alles, was ein Bildschirm zeigt | Kontraste, Touchgefühl, Fokusreihenfolge |

Ein falscher Faktor liefert ein plausibles Ergebnis. Deshalb sind
**Gerätebefunde von Kevin wertvoller als jede Prüfzahl** — sieben in einer
Reihe, und keiner davon kam aus einem Werkzeug.

---

## Messungen sind wiederholbar

Seit 35.156 ist die Zufallsquelle austauschbar:

    node pruefstand/kalibrierung.cjs --seed=4711

Derselbe Seed ergibt dieselbe Zahl. **Ändert sich eine Messung, hat sich das
Spiel geändert — nicht der Würfel.**

Das war nötig, weil sechs Prüfungen mit kleinen Stichproben und harten
Grenzen zufällig rot meldeten. Wenn eine Probe flattert: erst messen, ob der
*wahre* Wert sich verschoben hat, dann die Stichprobe erhöhen — und die
Grenze nur anfassen, wenn die Sache selbst sich geändert hat.

**Das Zielband ist knapp:** „Laufbahnen bis Vollausbau" liegt bei 20,5 bis
21,1 über feste Seeds, die Untergrenze ist 20. Abstand 0,6.

---

## Dokumentation

`STAND.md` ist chronologisch: jede Fassung bekommt einen Messblock mit
Zahlen, Gegenproben und dem, was *nicht* geprüft werden konnte. Fehler, die
mir selbst unterlaufen sind, stehen dort ebenfalls — sie sind der Teil, aus
dem beim nächsten Mal etwas wird.

Nach jeder Änderung an STAND.md:

    node pruefstand/verzeichnis.cjs --quelle=STAND.md

Der Prüfstand bricht ab, wenn ein neues Werkzeug nicht in der Werkzeugtabelle
und in LIESMICH.md steht. Das ist Absicht: *„Ein Werkzeug, das dort fehlt,
benutzt niemand mehr."*

---

## Zusammenarbeit mit Codex

Beide Seiten arbeiten am selben Projekt. Was dabei schiefging und wie es
vermieden wird, steht in `ZUSAMMENFUEHRUNG-35.168.md`. Die Kurzfassung:

- **Grundlage mit Dateinamen nennen**, nicht mit Versionsnummer.
- **Bei Zusammenführungen Dateien vergleichen.** Eine höhere Nummer sagt
  nichts darüber, was enthalten ist.
- **Danach festhalten**, was unverändert übernommen, ergänzt, korrigiert und
  geprüft wurde.
- **Codex' Arbeiten bleiben.** Änderungen daran brauchen einen nachgewiesenen
  Fehler, dokumentierte Ursache und ein Prüfergebnis.
