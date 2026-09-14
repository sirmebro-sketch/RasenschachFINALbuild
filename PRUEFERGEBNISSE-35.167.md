# Prüfergebnisse 35.167

Stand 14. September 2026. Automatische Tests mit React und jsdom simulieren das DOM. Sie ersetzen keine visuelle oder native Geräteprüfung.

| Prüfung | Ergebnis | Protokoll |
|---|---|---|
| Gezielte Regressionen | 47 bestanden | korrekturen.log |
| Ansichten und Abläufe | 816, 0 Fehler | gesamtpruefung.log |
| Vereinsprüfungen | 646, 0 Fehler | gesamtpruefung.log |
| Rückwärtskompatibilität | 6 × 63, 0 Fehler | gesamtpruefung.log |
| Textproben | 9.805, 0 Befunde | gesamtpruefung.log |
| Ereigniskonsistenz | 17, 0 Fehler/verdächtige Fälle | gesamtpruefung.log |
| Namen | 6 Prüfungen, 0 harte Fehler | gesamtpruefung.log |
| Schriftabdeckung | 40 Proben | gesamtpruefung.log |
| Kalibrierung | 300 Laufbahnen, Zielbereiche eingehalten | kalibrierung.log |
| Webbuild | erfolgreich, Hinweis auf großes Bundle | web-build.log |
| Browser-Einzeldatei | erzeugt, 0 externe Verweise, 5 eingebettete Schriften | browser-build.log |
| Android-Vorbereitung und Sync | erfolgreich; keine APK | android-vorbereitung.log, android-sync.log |

Die beiden vollständigen Regressionstest-Laufbahnen umfassen 150 Aktionen/25 Saisons und 92 Aktionen/23 Saisons, jeweils mit Wiederaufnahme zwischen den Schritten. Fehler werden an den Schreibstellen der Abschlussbuchung injiziert; Wiederholung und Rücksetzung werden geprüft. Packkauf und Verkauf werden ebenfalls unter Schreibfehlern geprüft.

Zeitliche Einordnung: Die breite grüne Prüfung lief vor dem abschließenden Entfernen ungenutzter Helfer, der gemeinsamen Speicherung des Gelesen-Status und der Umbenennung des Aufstellungsbuttons. Danach liefen die 47 Regressionen erneut erfolgreich; die reine Beschriftungsänderung erfolgte anschließend. Die finalen Builds enthalten alle Änderungen. Die Kalibrierung ist ein erfolgreicher Abschnitt eines früheren, insgesamt fehlgeschlagenen Prüflaufs; spätere Änderungen betreffen keine Belohnungs-/Schwierigkeitsparameter. Das Abschnittsprotokoll ist ausdrücklich kein grüner Gesamtlauf.

Prüfwerkzeuge wurden an feste Auswahl-IDs und asynchrone Kaufabschlüsse angepasst. Die alten Zählungen erfassten andernfalls Auswahl-IDs als Ereignisse; alte Quelltextprüfungen erwarteten entfernte Schreibhelfer. Kalibrierungsgrenzen wurden nicht gelockert.

Offen: realer Browserstart, visuelle Geräteabnahme, Screenreader/Toucheingaben, native Preferences-Fehlerprüfung und APK-Build/-Signatur. Kein Anspruch auf vollständige Fehlerfreiheit. Der Gesamtbericht hat 73 Seiten (10 aktuelle, 63 historische); die 10 neuen Seiten wurden gerendert und visuell geprüft.
