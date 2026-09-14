# Entwicklerübergabe – Rasenschach XI 35.167

Stand: 14. September 2026. Fortsetzung von 35.166 durch Codex. Dieses Dokument ist der Einstieg für Claude oder die weitere Entwicklung. Frühere Übergaben bleiben als Historie erhalten.

## Was umgesetzt wurde

- Gemeinsame Speicherbuchungen für Karriereabschluss, Kartenpacks und Kartenverkauf sowie zusammengehörige Vereins-, Akademie- und Shopänderungen. Vorbereitete Daten werden über das vorhandene Journal geschrieben; erst danach wird der sichtbare Bestand aktualisiert. Gleichzeitige Buchungen werden gesperrt. Fehlgeschlagene Schreibvorgänge und Wiederherstellung sind berücksichtigt.
- Packpreise und Gratis-/Startpackberechtigungen werden vor der Buchung geprüft. Karten werden erst nach erfolgreicher Speicherung aufgedeckt. Verkauf und Entfernung aus dem Kader gehören zur selben Buchung.
- „Erneut versuchen“ lädt den Bestand neu und führt ins Menü zurück. Ein endgültiges Karriereende bleibt nach einem Neustart abschließbar.
- Fanshopberechnung korrigiert: Basisfaktor 1,0; mit Fanshop 1,2. Die fehlerhafte Klammerung hatte den Basisfaktor auf 0,2 gesetzt.
- Verdeckte Karten sind native Buttons. Formularfelder haben zugängliche Namen, Kernfelder verknüpfte Labels. Fokus wird nach dem Aufdecken weitergegeben.
- Die redundante Tätigkeitsbox unter dem Spielerpass bleibt entfernt. Der gewählte Vorsatz steht unter der Wildcard im Zustandsbereich. Lange Vereinsnamen können umbrechen; Attributbalken überschreiten ihre Fläche nicht.
- Zwei zusätzliche Vorsätze: „Ein zweites Standbein“ und „Auf dem Platz zuhause“. Sechs Vorsätze insgesamt; keine zusätzlichen Belohnungen oder geänderte Schwierigkeit.
- Aufstellungsaktion heißt zutreffend „Automatisch aufstellen“. Sie verspricht keine mathematisch optimale Mannschaft.
- Alle 532 Ereignisse mit 1.161 Optionen besitzen feste Auswahl-IDs. Spielstandschema 2 speichert IDs; Schema 1 bleibt über die ursprünglichen Indizes lesbar.
- Android-Projekt erzeugt, Webdateien synchronisiert, vorhandenes eigenes Appsymbol eingebunden. Workflow repariert: keine Suche nach einem Funktionsnamen im minifizierten Bundle, Symbol-Fallback und reproduzierbare Versionssetzung.

Neue Befunde im Gesamtbericht: F59 Packprüfung, F60 leerer Wiederaufnahmebildschirm, F61 Fanshopfaktor, F62 endgültiges Ende nach Neustart, F63 unvollständige gemeinsame Buchungen, F64 Android-Bauprüfung und Symbolpfad. F49/F50 wurden zusätzlich konkret bearbeitet.

## Für die nächste Programmierung

`buchungen.js` enthält die reinen Funktionen `packBuchung` und `verkaufsBuchung`. Karten-/Vereinsmodule werden ausdrücklich als Abhängigkeiten übergeben. Keine Schreib- oder React-Nebeneffekte in diese Vorbereitung einbauen.

`App.jsx`: `bucheBestand` bündelt Karten/VC/Verein; `bucheAenderung` bündelt andere Änderungen. Beide nutzen `datenErsetzen` aus `sicherung.js`. `finish` bereitet die komplette Abschlussbuchung vor. Berechnungshelfer `bereiteHalle`, `bereiteErlebtes` und `bereiteErfolge` schreiben nicht selbst. Erfolgsmeldungen und Zustandsänderungen erst nach erfolgreicher Speicherung auslösen. Asynchrone Rückgaben beachten.

Vereinsänderungen können Akademiedaten gemeinsam übergeben: `onAendern(verein, akademie)`; `akademieAendern(akademie, verein)` nimmt optional den Verein entgegen. Überholte getrennte Schreibaufrufe nicht wieder einführen. Historische Kommentare sind keine verbindliche Beschreibung der neuen Fehlerbehandlung.

`spielstand.js`: Schema 2 nutzt `auswahlIds`. Bestehende `id` und `altIndex` in `ereignisse.js` NIEMALS neu nummerieren oder wiederverwenden. Neue Optionen erhalten neue eindeutige IDs; alte Indizes müssen zur alten Option gehören. Entfernte unbekannte Optionen verlangen eine ausdrückliche Migration. Prüfwerkzeug: `node pruefstand/ereignis-ids.cjs ereignisse.js`. Den Schreibmodus nicht blind nach einer Umsortierung verwenden.

## Einstieg und Nachweise

Node.js >=22.12, dann `npm ci`, `npm run test:korrekturen`, `npm run build`.
Breite Prüfung: `bash pruefstand/pruefen.sh App.jsx` (Kalibrierung kann länger dauern).
Browserdatei erzeugen: `SKIP_STARTPROBE=1 WERKSTATT=1 ERSTSTART=1 bash pruefstand/browsertest.sh App.jsx`.
Das Auslassen der Startprobe bedeutet ausdrücklich: kein interaktiver Browsernachweis.

47 Regressionstests bestanden, darunter injizierte Speicherfehler und zwei vollständige Laufbahnen mit Neustart nach jedem Schritt. Weitere gemessene Ergebnisse und genaue Grenzen stehen in `PRUEFERGEBNISSE-35.167.md`; Protokolle in `nachweise/35.167/`. `berichte/Rasenschach-XI-35.167-Gesamtbericht.pdf` enthält 10 aktuelle Seiten und 63 unveränderte historische Seiten.

`AENDERUNGEN-35.167.patch` vergleicht Textquellen mit dem ausgelieferten 35.166-ZIP. Das vollständige ZIP enthält außerdem native Projektdateien, Binärsymbole und die spielbare Browserdatei. Für die vollständige Übernahme das ZIP verwenden. Prüfsummen: `DATEISTAND-SHA256.txt`.

## Android und offene Aufgaben

App-ID `de.rasenschach.app`, versionName `35.167.0`, versionCode `3516700`. `pruefstand/android-version.cjs` setzt die Version aus package.json. Native Projektvorbereitung und `cap sync android` erfolgreich; keine APK gebaut, signiert oder veröffentlicht. Java 21 und Android SDK 35 fehlen in dieser Umgebung. Bestehende Signierschlüssel sicher weiterverwenden; Workflow-Veröffentlichung wurde nicht ausgeführt.

Vor Gerätefreigabe: Android-Build mit passendem JDK/SDK, Update mit vorhandenem Spielstand, Zurück-Taste/Lebenszyklus, Speicherunterbrechungen mit echtem Preferences-Adapter, Touch/Fokus/Screenreader, kleine Displays und Offlinebetrieb prüfen. Browserprüfung der Einzeldatei auf realen Zielbrowsern ebenfalls offen.

Weitere Modularisierung der großen App.jsx, Ladezeit-/Speichermessungen auf schwachen Geräten und neue Ereignisketten bleiben Ausbauarbeiten. Der Webbuild meldet ein großes Bundle. Kein Nachweis vollständiger Fehlerfreiheit, kein vollständiger neuer Einzelabschluss aller historischen F-/V-Kriterien. Maßgeblich ist die Statusmatrix im aktuellen PDF.
