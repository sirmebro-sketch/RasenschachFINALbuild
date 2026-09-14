# Rasenschach XI — Abschlussbericht zur Abarbeitung

**Antwort auf:** Gesamtbericht & Entwicklungsauftrag, Prüfbasis 35.128, Revision 5, 09.09.2026
**Bearbeitet von:** Claude
**Ausgeliefert:** Fassung 35.164
**Datum:** 9. September 2026

---

## 0 · Kurzfassung

Alle 56 Fehlerpunkte und alle 12 Empfehlungen sind bearbeitet. **36 Fassungen** (35.129 bis 35.164).

Fünf Punkte sind bewusst **nicht so umgesetzt**, wie sie im Papier stehen — jeder mit Begründung in Abschnitt 3. Ein Punkt (F34) ist begründet beibehalten, was das Papier ausdrücklich zulässt.

Offener Punkt 21 aus der Projektdokumentation ist **geschlossen**: das Zielband war nie falsch, die Messung war es.

**Was der Bericht nicht liefern kann:** die Geräteabnahme. Sie steht weiterhin aus, und das Papier sagt zu Recht, dass DOM-Struktur und CSS-Werte sie nicht ersetzen.

---

## 1 · Status je Fehler-ID

Legende: **behoben** = Ursache beseitigt, mit Regressionsprobe · **beibehalten** = begründete Designentscheidung · Fassung = wo es geschah.

| ID | Prio | Status | Fassung | Kern der Behebung |
|---|---|---|---|---|
| F01 | P1 | behoben | 35.130 | `onResume` liest den gesicherten Schritt; Angebote wandern in den Spielstand, damit ein Neustart kein Reroll wird |
| F02 | P1 | behoben | 35.131 | Import schreibt alle `SICHER_KEYS`; fehlende werden gelöscht statt liegengelassen |
| F03 | P1 | behoben | 35.131 | Je Schlüssel eine Formprüfung **vor** dem ersten Schreibzugriff |
| F04 | P1 | behoben | 35.131 | Zwischensicherung und Rollback; Rollback-Fehler wird eigens gemeldet |
| F05 | P2 | behoben | 35.131 | Rückgabewert von `execCommand` wird ausgewertet |
| F06 | P1 | behoben | 35.132 | Ein gemeinsamer Schreibweg `schreibe()`; Fehler erscheint im Hauptmenü. **Vier Stellen hatten kein `await`** — dort fing das `try/catch` gar nichts |
| F07 | P2 | behoben | 35.135 | Kalibrierung nutzt `offeneWahlen` wie das Spiel. 36 von 1.156 Optionen tragen eine Bedingung |
| F08 | P2 | behoben | 35.136 | `=== sonderSchutz` statt `<= +1`; Marke wird im selben Zug verbraucht |
| F09 | P2 | behoben | 35.137 | Text an die Wirkung angepasst — ein Wechselwunsch ist kein Wechsel |
| F10 | P2 | behoben | 35.137 | `forceInjury: "schwer"` macht den zugesagten Ausfall echt |
| F11 | P2 | behoben | 35.137 | Verlangt eine Verletzung in den letzten drei Saisons statt bloßer Anfälligkeit |
| F12 | P2 | behoben | 35.137 | Zwei getrennte Wege mit eigenem Text (Trainerschein / Schulabschluss) |
| F13 | P2 | behoben | 35.137 | „nach 2 abgeschlossenen Laufbahnen" statt „ab der 2." |
| F14 | P2 | behoben | 35.137 | Sieben Nachbesserungen für Artikel, Adjektiv, Relativpronomen |
| F15 | P3 | behoben | 35.131 / 35.155 | Sicherungstexte in 35.131; **die 16 ß-Fehler in den Ereignissen erst in 35.155**, gefunden vom neuen Textkatalog |
| F16 | P2 | behoben | 35.138 | Halleneintrag trägt `nr` aus `ges.karrieren`; alte Einträge fallen aufs Endjahr zurück |
| F17 | P1 | behoben | 35.134 | Erst die Laufbahn sichern, dann den Vorrat abbuchen |
| F18 | P1 | behoben | 35.131 | Ein Lesefehler bricht den Export ab |
| F19 | P2 | behoben | 35.138 | Überall `wertGrenze(p)`; ein positiver Bonus senkt nie |
| F20 | P2 | behoben | 35.139 | Zwei Fehler übereinander: `Math.min(103,…)` und die Kappung in `develop` |
| F21 | P2 | behoben | 35.139 | Leerzustandsprüfung kennt auch `nt.majors` |
| F22 | P3 | behoben | 35.139 | `gesamt.karrieren` statt `hall.length + 1` |
| F23 | P2 | behoben | 35.139 | `roleFor` liefert `"rot"`, geprüft wurde `"rotation"` — jede Rolle steht jetzt ausdrücklich da |
| F24 | P2 | behoben | 35.139 | Klammern: `&&` band stärker als `||` |
| F25 | P2 | behoben | 35.139 | Text an die Wirkung angepasst (Erhöhung statt Prämienmodell) |
| F26 | P2 | behoben | 35.139 | Geldbedingung mit Sperrhinweis; eine Wahl bleibt immer offen |
| F27 | P2 | behoben | 35.139 | Familienstand **vor** der Mutation gemerkt |
| F28 | P3 | behoben | 35.139 | `suspend: 2` statt 3 — die Zahl im Text ist die zugesagte |
| **F29** | **P0** | **behoben** | **35.129** | Getrennte Schlüssel, Migration über die Datenform. Nachgestellt: 1 Karte → 0 Karten |
| F30 | P2 | behoben | 35.140 | `zaehlOrte()` zählt verschiedene Einträge statt `wert > 0` auf einem Objekt |
| F31 | P2 | behoben | 35.140 | Typ wird angezeigt und wandert auf die Karte |
| F32 | P2 | behoben | 35.140 | „Wunderkind" verlangt zusätzlich Höchststärke 75 |
| F33 | P3 | behoben | 35.159 | Wiederholungsschutz: nur wenn eine **zweite** Zeile passt |
| F34 | P3 | **beibehalten** | 35.159 | Begründung in Abschnitt 3 |
| F35 | P2 | behoben | 35.140 | Eigener Sammlungs-Handler, Rückweg definiert |
| F36 | P3 | behoben | 35.140 | Kumulative Zeilen als „insgesamt" beschriftet |
| F37 | P3 | behoben | 35.140 | Herkunft „Akademie" statt „eigener Verein" |
| F38 | P3 | behoben | 35.140 | Zähler und Kohorten sprachlich getrennt |
| F39 | P3 | behoben | 35.140 | Eigene Überschrift für die Ein-Verein-Laufbahn |
| F40 | P3 | behoben | 35.140 | Bedingung sichtbar gemacht |
| F41 | P1 | behoben | 35.133 | Löschliste aus den Konstanten plus `ALT_KEYS`; Löschfehler wird gemeldet |
| F42 | P2 | behoben | 35.140 | Abschluss erzeugt eine Hallenkarte |
| F43 | P2 | behoben | 35.140 | Manuelle Freigaben laufen über denselben Übergabeweg |
| F44 | P1 | behoben | 35.134 | `useRef` statt Render-Variable; alle drei `setKarten`-Stellen ziehen mit |
| F45 | P2 | behoben | 35.152 | Echtes Abgangsalter statt `(raus−ein)+17` |
| F46 | P2 | behoben | 35.152 | Berater wirkt bis zur nächsten Angebotsgenerierung |
| F47 | P2 | behoben | **35.163** | Extraschicht nach dem Training gesperrt, mit Grund |
| F48 | P2 | behoben | **35.163** | `years` gilt für jede Angebotsart; `renew` wechselt nicht den Verein |
| F49 | P2 | behoben | 35.141 | `flaecheAlsKnopf()` für sechs Bedienflächen; Enter und Leertaste |
| F50 | P2 | behoben | 35.141 | Alle neun Eingabefelder mit `aria-label` |
| F51 | P2 | behoben | 35.142 | Zoom freigegeben, Textskala auf fünf Stufen bis 1,5 |
| F52 | P2 | behoben | 35.144 | `.btn.sm` von 38 auf 44 px |
| F53 | P3 | behoben | 35.145 | Kontrastwächter auf sieben Ansichten; **192 Befunde sofort gefunden** |
| F54 | P2 | behoben | 35.146 | `wcBasis` trennt dauerhafte Boni von Karteneffekten |
| F55 | P2 | behoben | 35.147 | Fünf Ansichten an `useZurueck` angebunden |
| F56 | P3 | behoben | 35.147 | Herkunft der Sicherungsansicht wird gemerkt |

**F45 bis F48 waren zwischenzeitlich falsch verbucht.** In 35.143 hatte ich Dialogarbeit unter diesen Nummern eingetragen; im Papier sind es andere Punkte. Korrigiert in 35.152, die echten Punkte dort und in 35.163 behoben.

---

## 2 · Status je Empfehlung

| ID | Status | Fassung | Nutzen · Änderung · Datenfolge |
|---|---|---|---|
| V01 | umgesetzt | 35.148 | **Nutzen:** nach jeder Wahl steht, was wirklich geschah. **Änderung:** `applyFx` vergleicht Zustand vorher/nachher und füllt den vorhandenen `log`-Sammler. **Datenfolge:** keine — das Vorher-Bild entsteht nur, wenn jemand zuhört. **Abnahme:** ein wirkungsloser Effekt meldet nichts; 0,01 statt 0,35 bei leerem Konto |
| V02 | umgesetzt | 35.149 | **Nutzen:** der Saisonrückblick nennt bis zu drei Gründe. **Änderung:** `saisonGruende()` liest `injury`, `banned`, `role`, `note`, `rank`, `club`. **Datenfolge:** keine. **Abnahme:** eine Probe sucht im erzeugten Text nach gerechneten Behauptungen. 33 % der Saisons bekommen keine Seite — Absicht |
| V03 | **teilweise** | 35.150 | Vorschau und Rückweg ja, **Dateiexport nicht** (Begründung in Abschnitt 3). **Datenfolge:** ein neuer Schlüssel `RUECK_KEY`, bewusst nicht in `SICHER_KEYS` |
| V04 | umgesetzt | 35.151 | **Nutzen:** eine Zeile nennt, was ansteht und was schwebt. **Änderung:** `naechsterSchritt()`. **Datenfolge:** keine. **Abnahme:** die Erklärung verschwindet nach drei Saisons; ein Wechselwunsch wird auch später erklärt |
| V05 | geprüft | 35.153 | Der messbare Rest — „Information nicht allein durch Farbe" — war **bereits erfüllt**. Drei Prüfungen halten den Zustand fest. Der übrige Teil kam über F49–F52 |
| V06 | **teilweise** | 35.161 | **Eine** Konsequenzkette (`ab_wiedersehen` → `ab_quittung`) auf `p.abgelehnt`, das seit 35.114 von keinem Ereignis gelesen wurde. **Datenfolge:** keine neuen Felder, nur `flags`. Begründung für „eine statt mehrerer" in Abschnitt 3 |
| V07 | **anders** | 35.162 | Kein zweites Zielsystem, sondern vier wählbare **Vorsätze** aus vorhandenen Errungenschaften. **Datenfolge:** ein Feld `p.vorsatz`. **Keine Belohnung** — der Schutz vor dem Sonderweg, den das Papier fordert |
| V08 | umgesetzt | 35.157 | **Nutzen:** Jahrgang und erster Profiklub stehen auf der Karte. **Änderung:** die Daten lagen seit 35.124 ungenutzt. **Datenfolge:** keine |
| V09 | umgesetzt | 35.154 | **Nutzen:** jeder Ladenartikel sagt, wann er wirkt und was danach bleibt. **Datenfolge:** keine. **Abnahme:** eine Probe hält Tabelle und Artikelliste aneinander |
| V10 | umgesetzt | 35.156 / 35.160 | **Nutzen:** `--seed=<zahl>` macht jede Messung wiederholbar. **Änderung:** `zufall` ersetzt `Math.random` an allen 27 Stellen. **Datenfolge:** keine — im Spiel bleibt es `Math.random` |
| V11 | umgesetzt | 35.158 | **Nutzen:** die erste Laufbahn bleibt in der Halle, auch wenn sie schwach war. **Datenfolge:** ein Feld `statN`. **Abnahme:** eine starke Erste bekommt keinen Extraplatz |
| V12 | umgesetzt | 35.155 | **Nutzen:** `texte.cjs` erzeugt 4.881 fertige Textstellen und prüft sie auf acht Muster. **Fund:** 16 ß-Fehler, die F15 überlebt hatten |

---

## 3 · Was bewusst anders gemacht wurde

### F34 — begründet beibehalten

Das Papier stellt es frei und nennt es „kein eindeutiger Regelbruch allein durch den Vergleich". Die Entscheidung:

| | Frage | Schwelle |
|---|---|---|
| Archetyp „Der Zurückgekommene" | Urteil über die ganze Laufbahn | schwer |
| Meilenstein | eine Auszeichnung | schwer |
| Schlagzeile „Zurückgeschrieben" | Urteil über **eine** Saison | jede |

Der Text behauptet nichts Falsches: *„Nach der Verletzung wieder 25 Spiele."* Keine schwere, keine lange. Eine Angleichung nähme dem Rückblick einen wahren Satz, damit drei Regeln gleich aussehen.

### V03 — kein Dateiexport

Er bräuchte `@capacitor/filesystem`, also eine neue Abhängigkeit. Das Papier warnt an anderer Stelle selbst davor, Abhängigkeiten während einer Fachkorrektur mitzuziehen. Ein Blob-Download verhält sich in Android-Webansichten unzuverlässig — **eine Sicherung, die manchmal keine Datei erzeugt, täuscht Sicherheit vor.** Gehört in einen eigenen Durchgang mit Gerätetest.

### V06 — eine Kette statt mehrerer

`p.abgelehnt` war die einzige Stelle mit einer gespeicherten Spielerentscheidung, die kein Ereignis las. Der Trainerschein aus dem zweiten Beispiel des Papiers wird bereits genutzt (F12). Weitere Ketten hieße: neue Felder anlegen und Geschichten erfinden, statt vorhandene zu erzählen.

### V07 — kein zweites Zielsystem

Das Papier verlangt „zuerst Überschneidungen identifizieren". Ergebnis: **alle drei vorgeschlagenen Herausforderungen gibt es bereits als Errungenschaft** („Fünf Jahre ein Verein", „Ein Verein, ein Leben", fünf Akademie-Errungenschaften). Ein zweites System wäre eine zweite Wahrheit über dieselbe Leistung.

Gebaut wurde nur, was fehlte: die **Wahl vor dem Start**. Vier Vorsätze, zwei davon schließen sich aus, keine Belohnung.

### F53 / V05 — nur so weit messbar

Der Kontrastwächter deckt jetzt sieben statt drei Ansichten ab (145 → 897 Textstellen). **Der Karriererückblick bleibt ungeprüft** — er braucht einen vollständigen Karriereabschluss, den nur `browsertest.sh` durchführt. Genau dort lag der Gerätebefund aus 35.121.

---

## 4 · Regressions- und Bauergebnisse

Alle Werte aus dem ausgelieferten Paket, nicht aus dem Arbeitsordner.

```
Fassung             35.164
Baudateien          7 von 7 gefunden
Ereignisse          532 Einträge (35.128: 530)
Ansichten           816 Prüfungen, 0 Fehler
Verein              646 Prüfungen, 0 Fehler   (35.128: 469)
Textkatalog         9.805 Proben, 0 Befunde   (neu)
Kontrast            904 Textstellen in 7 Ansichten, 0 Befunde  (35.128: 145 in 3)
Stimmigkeit         17 Proben, 0 harte Fehler
Rückwärtsprüfung    6 × 63 Ansichten fehlerfrei
Knöpfe              154, alle lesbar und im Bild
Sicherheitslage     0 Funde im Auslieferungspfad
Browsertest         14 von 14
Bündel              1.483,81 kB, gzip 548,34 kB
```

### Kalibriervergleich mit festen Startwerten

Das Papier verlangt „möglichst identische Seeds vor/nach Korrektur; mehrere Läufe und Streuung berichten". Seit 35.156 ist das möglich.

**Wirkung von F07** (gleiche Stichprobe, 400 Laufbahnen, je drei Läufe):

```
vorher    20,1 · 20,6 · 21,3     Spanne 1,2
nachher   20,7 · 20,5 · 20,4     Spanne 0,3
```

**Zehn feste Startwerte, je 300 Laufbahnen** (35.156):

```
21,1 · 20,8 · 21,0 · 20,7 · 20,4 · 21,1 · 21,0 · 21,0 · 21,0 · 20,8

Median 21,0 · Spanne 0,7 · Zielband 20–30
```

**Reproduzierbarkeit** (35.160): derselbe Seed, vier Läufe → viermal 20,5. Anderer Seed → 21,0.

### Offener Punkt 21 der Projektdokumentation — geschlossen

Das Zielband hatte in fünf Fassungen viermal grundlos rot gemeldet. Zwei Ursachen, beide behoben: die unzulässigen Entscheidungen der Kalibrierung (F07) und der fehlende feste Startwert. **Das Band war nie falsch — die Messung war es.** Die Grenze bleibt bei 20.

---

## 5 · Neue Befunde, die nicht im Papier standen

| Befund | Fassung | Art |
|---|---|---|
| Vereinskader-Probe brach ab, weil die Auffüllschleife das *stärkste* Talent nahm und unter 16 niemand hochgezogen wird | 35.129 | Prüfstand |
| Sechs Prüfungen flatterten: kleine Stichprobe, harte Grenze | 35.130–35.153 | Prüfstand |
| Ein abgestürzter Prüfteil sah aus wie ein bestandener | 35.128 | Prüfstand |
| `aka.ehrentafel` existiert nicht — die Zeitleiste las seit 35.119 ins Leere | 35.124 | Spiel |
| `ausTalent` war toter Code; die Anzeige „aus der Jugend" wartete auf Karten, die nie entstanden | 35.124 | Spiel |
| Ein `Math.random()` in **zwei** Prüfwerkzeugen umging den festen Startwert | 35.156 / 35.160 | Prüfstand |
| 16 ß-Fehler in den Ereignistexten — F15 war nur an den Sicherungstexten erledigt | 35.155 | Spiel |
| 192 Kontrastbefunde auf der Errungenschaftsseite (`--ln2` als Textfarbe, dazu 90 % Deckung) | 35.145 | Spiel |
| **Die Optionen wurden von keiner Prüfung je gerendert** — ein Absturz dort ging durch alle 814 Prüfungen und wurde erst auf dem Gerät sichtbar | 35.164 | Prüfstand |

### Und Fehler, die ich selbst gemacht habe

Sie stehen hier, weil sie zeigen, wo dieses Projekt anfällig ist:

- **Neunmal einen Namen erfunden** statt nachgesehen: `store.remove`, `saveGameSofort`, `setStartFehler`, `setLoeschFehler`, `ZIEL`, `G` (statt `ges`), vier Errungenschaftskennungen. Für drei Klassen gibt es jetzt Prüfungen, die den ganzen Bereich abdecken.
- **Backticks im CSS-Vorlagenliteral**, zweimal (35.121, 35.144). Die Hygieneprüfung gibt es seit 35.34 — beim zweiten Mal hatte ich ihre Ausgabe nach `/dev/null` geschickt.
- **Eine zu breite Korrektur** (35.121→35.122): vier Flächenfarben rechnerisch gleich behandelt, ohne nachzusehen, was auf ihnen liegt. Die Wildcard-Karten wurden unlesbar.
- **Vier Prüfungen, die Kommentare für Code hielten** — darunter Kommentare, die die jeweilige Behebung *erklärten*.
- **Ein Wächter, der sich selbst fand:** die Probe gegen `Math.random` in Prüfwerkzeugen meldete sich selbst, weil der Testtext den Aufruf wörtlich enthielt.
- **F45–F48 falsch verbucht** und F47/F48 fast vergessen — aufgefallen beim Schreiben dieses Berichts.
- **Ein ausgelieferter Absturz.** Die Vorsatz-Auswahl aus V07 landete in `Optionen` statt in `CreateScreen` — beide haben einen „Spielweise"-Block, der Textersatz traf den falschen. Kevin kam nicht mehr in die Einstellungen. Behoben in 35.164, samt der Prüfungslücke, die ich in 35.142 selbst notiert und nicht geschlossen hatte.

---

## 6 · Was weiterhin offen ist

### Die Geräteabnahme

**Seit 35.44 ist nichts vollständig auf einem Telefon durchgespielt worden** — inzwischen 119 Fassungen. Das Papier sagt zu Recht, dass DOM-Struktur und CSS-Werte keine visuelle Abnahme ersetzen.

Nicht prüfbar ohne Gerät: reale Kontraste auf den endgültigen Hintergründen, Touchgefühl und Trefferflächen, Fokusreihenfolge mit TalkBack, Layout bei 360 px mit langen Namen und offener Tastatur, physische Zurück-Taste, Android-Lebenszyklus, Neuinstallation und Update mit bestehenden Spielständen.

**Zwei Gerätebefunde in dieser Reihe** (35.121, 35.122) haben beide etwas gefunden, das kein Prüfstand sah: einen unlesbaren Text bei Kontrast 1,13 — und einen Fehler, den ich beim Beheben des ersten gemacht habe.

### F51 aus dem Papier — Abhängigkeiten

Nicht bearbeitet. Das Papier rät selbst, Werkzeugaktualisierungen getrennt von Regelkorrekturen zu bauen und zu testen. Der Produktions-Audit meldet 0 Treffer; die Entwicklungskette ist unverändert.

### Kleinere Punkte der Projektdokumentation

Punkte 1, 3, 5, 10 und 13 in STAND.md — Frisurunterscheidbarkeit, Bedeutungsfarben, kleines Android-Symbol, Dateigröße von `App.jsx`, Langzeittest.

---

## 7 · Übergabe

| Paket | Inhalt |
|---|---|
| `rasenschach-xi-35.164-gesamt.zip` | vollständiges Projekt, echte Ordnerstruktur, entpackfertig |
| `rasenschach-xi-35.164-repository.zip` | fürs Repository, **ohne** `signing/` und `symbol/appicon.png` |
| `rasenschach-xi-35.164-projektwissen.zip` | flache Ablage mit angepassten Dateinamen |
| `rasenschach-35.164-browsertest.html` | spielbare Fassung für den Browser |

Jedes Paket wurde entpackt, Datei für Datei verglichen und die Prüfsummen bestätigt. Das Gesamtpaket wurde **aus dem ZIP heraus** durchlaufen — „Baudateien 7 von 7".

**Warnung zum Repository-Paket:** die Dateien einzeln kopieren, nicht Ordner ersetzen. Wird `signing/debug.keystore` überschrieben, ändert sich der Fingerabdruck; dann lässt sich die App nicht mehr aktualisieren und der Spielstand geht verloren.

---

## 8 · Anmerkung zum Papier

Es war präzise und in mehreren Fällen präziser als nötig — die Vorwarnungen („kein eindeutiger Regelbruch", „kein bestätigter Gerätedefekt", „Stichprobenquote, keine Fehlerwahrscheinlichkeit") haben mehr geholfen als eine schärfere Formulierung es getan hätte. Zwei Befunde waren beim Nachstellen anders gelagert als beschrieben (F38, F35), und das Papier hatte beide Male die Einschränkung schon selbst benannt.

Was gefehlt hat, ist naturgemäß das, was auch mir fehlt: **der Blick auf ein echtes Gerät.** Die zwei wertvollsten Befunde dieser Reihe kamen weder aus dem Papier noch aus dem Prüfstand, sondern von Kevin mit einem Telefon in der Hand.
