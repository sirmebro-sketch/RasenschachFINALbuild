# Übergabe an Claude: Rasenschach XI 35.165

Bearbeitet am 13. September 2026. Ausgangspunkt: Kevins vollständiges Paket **35.164**. Neuer Arbeitsstand: **35.165**, erstellt durch Codex im Auftrag von Kevin. Diese Übergabe und der tatsächliche Quellcode haben Vorrang vor den älteren Erledigt-Meldungen. Kein Gerätetest und keine APK-Freigabe behauptet.

## Bitte zuerst tun

1. Das gesamte ZIP entpacken und als zusammengehörigen Stand lesen. Insbesondere die neuen Module `sicherung.js` und `spielstand.js` müssen neben `App.jsx` liegen. Nur App.jsx zu übernehmen genügt nicht.
2. Falls dein eigener Stand inzwischen neuer ist: `AENDERUNGEN-35.165.patch` und die Dateiliste vergleichen und gezielt zusammenführen. Einen neueren Stand nicht blind mit diesem Paket überschreiben.
3. Mit Node.js 22.12 oder neuer im Projektordner `npm ci`, `npm run test:korrekturen` und `npm run build` ausführen. Der genaue Installationsstand steht in package-lock.json.
4. Die aktuelle technische Prüfbilanz in `PRUEFERGEBNISSE-35.165.md` lesen. Originalprotokolle und Audit-Ergebnisse liegen unter `nachweise/`.
5. Danach die am Ende genannten Geräte- und Integrationsprüfungen durchführen. Erst deren Ergebnisse als neue Abnahme dokumentieren.

## Was tatsächlich geändert wurde

| Punkte | Änderung | Betroffene Dateien |
|---|---|---|
| F01 | Fortsetzen erhält Phase, Angebote, Ereignisfolge, bereits gewürfelte Wahlmöglichkeiten und Ergebnis einer getroffenen Entscheidung. Menüweg überschreibt Angebote nicht mehr. Entscheidungen und Geldbewegungen werden zusätzlich beim Zustandswechsel gesichert. | App.jsx, spielstand.js |
| F02 | Import ersetzt den gesamten importierbaren Bestand samt bekannten Migrationsschlüsseln. Ladefunktion baut auch leere Bereiche neu auf; alter React-Zustand bleibt nicht hängen. | App.jsx, sicherung.js |
| F03 | Sicherungen werden vor dem Schreiben geprüft: Paketversion, JSON, wichtige Datensatzformen, Spielerpflichtfelder und Wertebereiche. Arrays als Spieler, fehlende Attribute und zukünftige Versionen werden abgelehnt. Gespeicherte Ereignisse werden vor Import auf Wiederherstellbarkeit geprüft. | sicherung.js, spielstand.js, App.jsx |
| F04 | Ein Lesefehler stoppt vor jeder Mutation. Import und Rücknahme verwenden eine verifizierte Wiederherstellung mit dauerhaftem Journal. Nach unterbrochenem Import erfolgt beim nächsten Start ein Rücksetzen auf den vorherigen Stand. Bei weiterhin defektem Speicher blockiert das Spiel weitere Bedienung. | sicherung.js, App.jsx |
| F06/F44 | App und Browser geben Speicherfehler gleichermaßen weiter. Zugriffe werden geordnet abgearbeitet; langsame ältere Schreibvorgänge können neuere nicht mehr überholen. | storage.js, sicherung.js, pruefstand/browsertest.sh |
| F17 | Neue Karriere und übertragener Akademievorrat werden gemeinsam gebucht. Auch ohne Vorrat wird sofort gesichert. Ein fehlgeschlagener Start erhält den vorherigen Bestand; mehrfacher Startklick wird abgefangen. | App.jsx, sicherung.js |
| F31 | Talenttyp wird in die Absolventenkarte übernommen und im Kartendetail angezeigt. Vorhandene Jugendkarten erhalten beim Laden fehlende Typdaten, soweit der zugehörige Absolvent noch vorhanden ist. | App.jsx, karten.js |
| F35 | „Deine Sammlung“ öffnet direkt den Sammlungsreiter. Zurück führt zum tatsächlichen Einstieg: Hauptmenü oder Vereinsdach. | App.jsx |
| F42 | Karriereabschluss legt eine Hallenkarte an. Die Identität bleibt unabhängig von Hallensortierung; wiederholter Abschlussaufruf derselben aktiven Karriere wird abgefangen. | App.jsx, karten.js |
| F43 | Manuelle Freigaben über das Vereinsdach und Akademieänderungen benutzen einen gemeinsamen Übergabehandler, der neue Absolventen unmittelbar in Karten umwandelt. Automatische Jahrgangsabgänge bleiben angebunden. | App.jsx |
| F47 | Zusätzlich zur gesperrten Schaltfläche verhindert der Kaufhandler eine Extraschicht nach dem Training. | App.jsx |
| F51 | Werkzeugkette aktualisiert: Vite 6.4.3, Capacitor Core/Android/CLI 7.6.9, App 7.1.2, Preferences 7.0.4. Sperrdatei aktualisiert. Workflow an Node 22, Java 21 und Android SDK 35 angepasst. | package.json, package-lock.json, .github/workflows/apk.yml |
| F52 | Alle sechs freigeschalteten Beinamen-Gruppen erscheinen; doppelte Namen werden nur einmal angeboten. | App.jsx |
| F53 | ms_start2 („Vorsprung“) wird bei der Erstellung tatsächlich angewandt: +0,3 Geld und +4 Potenzial, mit bestehender Obergrenze. | App.jsx |
| V03 | Sicherung zusätzlich als Datei herunterladen beziehungsweise aus einer Datei einlesen. Einlesen zeigt erst die Vorschau und überschreibt noch nichts. Downloadmeldung verspricht keinen bereits erfolgten Gerätespeichervorgang. | App.jsx |

Die schon funktionierenden Reparaturen F19, F30, F45, F46, F48, F54 und F55 wurden nicht durch alternative Spielregeln ersetzt. Ihre Bestandsprüfungen und die zusätzlichen Regressionen bleiben erhalten. F56 wird im echten Import-/Zurück-Ablauf der Komponentenprüfung mit durchlaufen.

## Zwei zusätzlich gefundene Fehler

### F57: Sicherungsvorschau übersieht den Vereinsnamen

Der Datensatz enthält den Vereinsnamen unmittelbar unter `name`. Die Vorschau suchte nur nach `v.name`. Sie liest jetzt das aktuelle Format und unterstützt den alten verschachtelten Fall als Rückfall. Ein ungültiger Zeitstempel wird als fehlend angezeigt, statt „Invalid Date“ darzustellen. Eine Komponentenprobe prüft den tatsächlichen Vorschautext.

### F58: Automatischer Aufstellungsvorschlag lässt einen besetzbaren Platz frei

Die ursprüngliche Auswahl nahm zuerst starke Spieler; ihre spätere Reparatur suchte nur noch auf der Bank. Notwendige Umstellungen zwischen bereits besetzten Plätzen fehlten. Ein festgehaltener Kader ergab ursprünglich **10 statt 11 mögliche Besetzungen**. `pruefstand/aufstellung-f58.json` enthält genau dieses Gegenbeispiel.

Die Reparatur sucht ergänzende Zuordnungswege: Bei einer Lücke werden bereits besetzte Positionen bei Bedarf umgestellt. Eine schon vollständige ursprüngliche Empfehlung bleibt erhalten. Der neue Test verlangt 11 verschiedene, regelgerecht eingesetzte Spieler; ohne Torwart muss weiterhin eine echte Lücke bleiben. Das Verfahren maximiert die Anzahl besetzbarer Plätze, es beansprucht keine weltweit optimale Gesamtstärke jeder möglichen Elf.

## Speicherformat und Verträglichkeit

- Die bestehenden Fortschrittsschlüssel bleiben erhalten. Neu: `rasenschach:import-transaktion`, nur für eine noch offene Wiederherstellung. Der Reset kennt diesen Schlüssel.
- Neue Karrieren tragen `karriereId`; Halleneinträge übernehmen diese Identität. Alte Karrieren erhalten beim Abschluss einen Rückfallwert aus vorhandenen Identitätsmerkmalen.
- Ein Spielstand trägt zusätzlich `ablauf` mit `schema: 1`. Ereignisfunktionen werden nicht serialisiert: Gespeichert werden Ereignis-ID, Kontext und Indizes der bereits gezogenen Wahlmöglichkeiten; beim Laden kommen die Funktionen aus dem Ereigniskatalog.
- Deshalb Wahlreihenfolgen/IDs bei künftigen Ereignisänderungen nicht unbedacht ändern. Vor einer inkompatiblen Änderung eine Formatmigration vorsehen und mit einem gespeicherten Ereignis testen.
- Alte Ergebnisstände mit Saison, aber ohne Angebotsliste können einmal neue Angebote erhalten. Sie werden ausdrücklich nicht durch erneutes Training repariert. Eine nie gespeicherte alte Ereignisfolge kann nicht nachträglich rekonstruiert werden.
- Die Importprüfung ist eine gezielte, erweiterbare Prüfung der verwendeten Datenformen. Sie ist keine vollständige formale Spezifikation jedes historischen Unterfelds.
- Das Journal schützt die damit umgesetzten Mehrschlüsselbuchungen. **Nicht jede Buchung des gesamten Spiels ist bereits eine gemeinsame Transaktion.** Insbesondere Karriereabschluss, Packkäufe und weitere VC-/Kartenbewegungen bestehen teilweise weiterhin aus mehreren geordneten Schreibvorgängen. Vollständige Transaktionsabdeckung ist ein weiterer Entwicklungsschritt.
- Bereits vor dieser Fassung verlorene Karten werden nicht pauschal neu erzeugt: Es ist nicht zuverlässig unterscheidbar, ob eine Karte fehlte oder absichtlich verkauft wurde.
- Fehler beim Laden führen zu einer sichtbaren Sperre mit Wiederholungsmöglichkeit. Eine defekte Sicherung soll nicht durch einen scheinbar frischen Stand überschrieben werden.

## Tests und Prüfstand weiterentwickelt

`npm run test:korrekturen` bündelt die unveränderten Originalkomponenten aus dem aktuellen Quellcode mit einer kontrollierten Speichergrenze. Die Tests benutzen echte React-Handler und einen simulierten DOM. Enthalten sind unter anderem:

- Lese-, Schreib- und Löschfehler; vollständiger Rollback, fehlgeschlagener Rollback und Wiederherstellung beim Neustart.
- Vollständiger Import inklusive Entfernen von Alt-/Migrationsdaten, anschließend Prüfung des laufenden Menüs.
- Echter Start mit Vorrat, Startfehler, Hauptmenü und Fortsetzen, bereits entschiedene Ereignisse.
- Tatsächlicher Karriereabschluss und manuelle Freigabe im Postfach bis zur gespeicherten Karte.
- Freischaltungen, Boni, Talenttyp, Kartenidentität, geordnete Schreibabschlüsse und F58.

Der vorhandene Prüfstand suchte teilweise nach fest geschriebenen Variablennamen und alten Codeformen. Diese Prüfungen wurden an die ausgelagerten Module angepasst. Die falsche Vorgabe „ohne Angebote wieder Training“ wurde entfernt; Verhalten wird jetzt zusätzlich direkt getestet. Die synchrone Startprüfung erwartet zunächst den Ladezustand; der geladene Menüablauf wird asynchron geprüft. Eine weitere Strukturprobe suchte mit `style*=flex` irrtümlich den einzelnen Kartenbehälter statt der Spielreihe; sie sucht nun gezielt `display: flex` und verlangt unverändert, dass der Auswahlkasten direkt bei seiner Reihe steht. Die Vereinsprüfung nennt einen festen Seed, der über `PRUEF_SEED` überschrieben werden kann.

Keine Spielstärken, Auszahlungen oder Kalibrierungsgrenzen wurden geändert, um Tests grün zu machen. Der neue Aufstellungsfall wurde separat an einem festen Kader bestätigt.

## Was Claude noch abnehmen oder weiterentwickeln muss

1. **Android bauen und auf Kevins S24 Ultra testen.** Der Workflow ist angepasst, aber hier nicht auf GitHub ausgeführt. Keine signierte APK wurde erzeugt. Vorhandenes externes Android-Projekt nach Capacitor 7 migrieren; App-ID und bisherigen Signaturschlüssel behalten. Quelle: https://capacitorjs.com/docs/updating/7-0
2. **Browserdatei tatsächlich öffnen und spielen.** Sie ist vollständig gebündelt und ohne externe Ressourcen gebaut. Die interaktive Browserprüfung war in dieser Umgebung durch die Sicherheitsrichtlinie blockiert; die separate HTML-Startprobe wurde ausdrücklich ausgelassen. Die Komponentenprüfungen ersetzen das nicht.
3. **Geräteabläufe prüfen:** Pause/Hintergrund, App beenden und neu starten; Ergebnis, Winterangebot, offene und entschiedene Ereignisse; Speicher voll; große Sicherung; Dateiauswahl/-download im Browser und WebView. Vorher ein echtes Backup anlegen.
4. **Gemeinsame Transaktionen ausweiten:** Karriereabschluss mit Belohnungen, Halle, Akademie, Verein und Karten als Gesamtablauf; Packkäufe und Verkäufe einschließlich VC. Geordnete Schreibvorgänge sind dafür eine Grundlage, aber noch keine atomare Gesamtbuchung.
5. **F01-F58 nicht pauschal als vollständig abgenommen markieren.** Für in 35.165 nicht individuell bearbeitete Punkte gilt der Bestandsprüfstand, ergänzt um die historischen Abnahmekriterien. Eine neue vollständige visuelle, sprachliche und gerätebezogene Einzelabnahme aller alten Punkte wurde hier nicht behauptet.
6. **V01-V12 nach Produktentscheidung weiterführen.** V03 ist erweitert; andere Ideen nicht durch umfangreiche neue Mechaniken ersetzen, bevor deren Nutzen und vorhandene Umsetzung abgeglichen sind. Insbesondere neue Ereignisketten, zusätzliche Ziele und ein vollständiger Umbau der großen App.jsx bleiben separate Arbeitspakete.

## Ausgelieferte Dateien

- `rasenschach-xi-35.165-gesamt.zip`: vollständiger Quellstand, Prüfstand, Übergabe, Vergleichspatch, Prüfergebnisse und historischer QA-Bericht.
- `rasenschach-35.165-browsertest.html`: Browserfassung mit Werkstatt und regulärem ersten Willkommen. Speicherung hängt von den Möglichkeiten des verwendeten Browsers ab; Werkstattfunktionen können Testdaten verändern.
- `UEBERGABE-CLAUDE-35.165.md`: diese Übergabe zusätzlich einzeln.

Der Dateivergleich liegt im Paket. `DATEISTAND-SHA256.txt` dient zur Kontrolle der tatsächlich übergebenen Dateien. Die ältere Datei `historie/ABSCHLUSSBERICHT-35.164.md` bleibt als Verlauf erhalten und ist keine Erledigt-Erklärung für diesen Stand. Der historische QA-Bericht wird ebenfalls nicht nachträglich als neue Geräteabnahme ausgegeben.

Vite-Versionspflege: https://vite.dev/releases . Verbindlich für diesen Stand sind zusätzlich die mitgelieferte Sperrdatei und der datierte npm-Audit, nicht eine angenommene allgemeine Sicherheitsgarantie.
