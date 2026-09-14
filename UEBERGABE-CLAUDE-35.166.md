# Übergabe an Claude: Rasenschach XI 35.166

Stand: 13. September 2026. Diese Fassung ergänzt den von Codex bearbeiteten Stand **35.165** um Kevins gewünschte Änderung der Spielansicht. Alle bisherigen Korrekturen sind enthalten. Die vollständige fachliche Übergabe, offene Aufgaben und Testgrenzen stehen weiterhin in **UEBERGABE-CLAUDE-35.165.md**. Dieses Dokument zuerst lesen, danach die dortige Übergabe.

## Neuer Auftrag und Umsetzung

Der redundante Tätigkeitskasten direkt unter dem Spielerpass ist vollständig aus der laufenden Spielansicht entfernt. Das betrifft den gesamten Kasten mit Schrittbeschreibung, „LÄUFT“-Hinweisen und bisheriger Vorsatzanzeige; er wird in keiner Spielphase mehr eingeblendet. Training, Ereignis, Saisonende und Vertragsangebote behalten ihre eigenen Überschriften und Bedienelemente.

Der ausgewählte Vorsatz steht jetzt **direkt unter der ausgewählten Wildcard im Bereich „Zustand“**. Auf schmalen Bildschirmen liegt dieser Bereich unter den Spielaktionen und Informationsreitern. Auf breiten Bildschirmen bleibt er in der bisherigen linken Spalte unter dem Spielerpass. Der Vorsatz erhält keinen neuen Kasten in der Aktionsfläche.

Die bestehende Berechnung `vorsatzStand(p, ges, aka)` bleibt erhalten. Bei erfülltem Vorsatz steht „Vorsatz · gehalten“ in Grün, sonst „Vorsatz“. Darunter steht der Name des ausgewählten Vorsatzes. Ohne gültigen Vorsatz erscheint kein leerer Eintrag; der Vorsatz kann auch ohne Wildcard angezeigt werden. Die Auswahl und die Speicherdaten ändern sich nicht.

## Dateien und Zusammenführung

- `App.jsx`: Tätigkeitskasten entfernt, Vorsatzanzeige unter der Wildcard ergänzt, Versionsanzeige 35.166.
- `package.json`, `package-lock.json`: Projektversion 35.166.0; Abhängigkeiten unverändert.
- `AENDERUNGEN-35.166.patch`: ausschließlich die Code-/Versionsänderung gegenüber 35.165.
- `AENDERUNGEN-35.165.patch`: weiterhin der vorherige Vergleich gegenüber 35.164. Bei Übernahme von 35.164 beide Änderungen in dieser Reihenfolge berücksichtigen; alternativ das vollständige Paket verwenden.
- Browser-Einzeldatei neu gebaut: `rasenschach-35.166-browsertest.html`.
- Einstiegsdokumente, Standverzeichnis und Prüfsummen aktualisiert.

Der ältere Helfer `naechsterSchritt` bleibt für bestehende Prüfwerkzeuge erhalten, wird in der Spielansicht jedoch nicht mehr aufgerufen. Seine frühere Beschreibung in historischen Dokumenten ist keine Aufforderung, den entfernten Kasten wieder einzubauen.

## Prüfung dieser Änderung

Die tatsächlichen Ergebnisse stehen in `PRUEFERGEBNISSE-35.166.md`; Protokolle liegen unter `nachweise/35.166/`. Die umfangreicheren Prüfläufe der Vorgängerversion bleiben ausdrücklich Ergebnisse von 35.165. Kein neuer APK-Bau oder visueller Gerätetest wird behauptet.

Auf dem Zielgerät noch bestätigen: In Training, Entscheidung und Saisonende folgt die jeweilige Aktion ohne Hinweiskasten auf den Spielerpass. Nach unten scrollen: Im Bereich „Zustand“ stehen Wildcard und direkt darunter der Vorsatz. Auch einen gehaltenen Vorsatz prüfen. Die bisherigen offenen Integrations- und Geräteprüfungen aus 35.165 bleiben bestehen.
