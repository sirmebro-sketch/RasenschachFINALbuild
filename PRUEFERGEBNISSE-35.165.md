# Prüfergebnisse 35.165

Stand: 13.09.2026. Prüfbasis: die mitgelieferten Quellen und package-lock.json.

| Prüfung | Ergebnis / Einordnung |
|---|---|
| Gezielte neue Regressionen | 33 bestanden; Originalkomponenten mit kontrolliertem Speicher und simuliertem DOM |
| Vorhandene Ansichtsprüfungen | 816 bestanden |
| Vereinsprüfungen | 646 bestanden; nachweise/abnahme-abschluss.log |
| Rückwärtsprüfung | Sechs Durchläufe mit je 63 Ansichten bestanden |
| Ereignisse und Textprüfung | Im vorangehenden Gesamtlauf auf dem gleichen Spielcode bestanden; 532 Ereignisse, 1.161 Optionen |
| Kalibrierung und Namen | Im vorangehenden Gesamtlauf auf dem gleichen Spielcode bestanden |
| Web-Produktionsbuild | Erfolgreich: Vite 6.4.3; Hauptpaket rund 1.500,58 kB, gzip 553,09 kB |
| Browser-Einzeldatei | Erfolgreich gebaut; 0 externe Ressourcenverweise, 5 eingebettete Schriftschnitte; Quellgleichheit mit dem Projekt geprüft |
| Neuinstallation | npm ci im Browser-Bau erfolgreich mit aktualisierter Sperrdatei |
| npm-Audit vollständig | 0 bekannte Treffer; einschließlich Entwicklungsabhängigkeiten |
| Android/APK | Nicht gebaut oder auf einem Gerät abgenommen |
| Interaktiver Browser | Nicht ausgeführt; Sicherheitsrichtlinie blockierte den lokalen Browserzugriff. HTML-Startprobe ausdrücklich ausgelassen |

## Warum mehrere Protokolle beiliegen

Der vorangehende Gesamtlauf war insgesamt rot: Eine DOM-Strukturprobe suchte den Kartenbehälter statt der Aufstellungsreihe. Der Selektor wurde gezielt korrigiert; das Abnahmekriterium (Auswahlkasten unmittelbar bei der betroffenen Reihe) bleibt erhalten. Danach wurden die betroffenen Ansichtsprüfungen, die Vereinsprüfung und die neuen Regressionen erneut ausgeführt. Die früheren roten Protokolle werden nicht als grüne Ergebnisse umgedeutet.

Zuvor zeigte sich außerdem der echte Aufstellungsfehler F58. Der Originalalgorithmus wurde an einem festen Kader mit einer unabhängigen Zuordnungsprüfung verglichen: 10 statt 11 mögliche Plätze. Die neue Regression hält diesen Fall fest. Der Vereinsprüfstand verwendet jetzt den dokumentierten Seed 20260913; dies ersetzt nicht die Gegenprobe F58.

Der neue Fehler F57 betrifft ausschließlich die Sicherungsvorschau (Vereinsname/Zeitstempel). F57 und F58 sind im aktuellen Quellcode korrigiert und in den 33 Regressionen enthalten.

## Grenzen

Kein Ergebnis bedeutet vollständige Fehlerfreiheit. Insbesondere sind reale Android-Dateidialoge, Downloads, Prozessabbrüche, volle Gerätespeicher, Touch, TalkBack und Darstellung auf dem S24 Ultra noch offen. Speicherfehler wurden an der kontrollierten Schnittstelle injiziert. Ein reales Betriebssystem kann zusätzliche Fehlerbedingungen erzeugen.

Das Build-Werkzeug weist auf ein Hauptpaket größer als 500 kB hin. Für die ausdrücklich gewünschte einzelne Offline-HTML ist diese Größe ein nachvollziehbarer Nachteil der Bündelung. Ladezeit und Reaktionsfähigkeit bitte auf dem Zielgerät messen; es wurde keine Leistungszahl erfunden.

Quellen: mitgelieferte Protokolle; https://capacitorjs.com/docs/updating/7-0 ; https://vite.dev/releases . Der Audit ist eine Momentaufnahme, keine allgemeine Sicherheitsgarantie.
