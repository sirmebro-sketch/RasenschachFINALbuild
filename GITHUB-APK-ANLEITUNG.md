# Repository aktualisieren und APK bauen – 35.167

Ziel: https://github.com/sirmebro-sketch/RasenschachFINALbuild

Dieses Paket enthält den vollständigen Spielstand 35.167, den Android-Quellcode, die Browserfassung, Prüfberichte und einen überarbeiteten APK-Workflow. Der Inhalt des entfernten Repositorys war hier nicht einsehbar. Unbekannte neuere Änderungen deshalb vor dem Überschreiben vergleichen. Es ist noch keine APK enthalten.

## 1. Vorbereiten

Das bisherige Repository zuerst als Sicherung herunterladen oder mit Git klonen. Den Spielstand in der bisherigen App exportieren. Vorhandene Dateien unter `signing/` unbedingt erhalten. Insbesondere `signing/debug.keystore` und gegebenenfalls `signing/fingerabdruck.txt` nicht ersetzen oder löschen. Das ZIP enthält absichtlich keinen fremden oder neu erzeugten Signierschlüssel.

## 2. Dateien übernehmen

ZIP entpacken. Es enthält die Projektdateien direkt auf der obersten Ebene: `App.jsx`, `package.json`, `android/`, `pruefstand/` und `.github/workflows/apk.yml`.

Diese Dateien und Ordner in die Wurzel des vorhandenen Repositorys kopieren und gleichnamige Dateien ersetzen. Nicht das ZIP selbst hochladen und keinen zusätzlichen Unterordner um das Projekt legen. Andere vorhandene Dateien, insbesondere `signing/`, behalten.

Am zuverlässigsten geht das an einem Computer mit GitHub Desktop: Repository klonen, entpackte Dateien hineinkopieren, Änderungen prüfen, committen und pushen. Im Browser können die Dateien über „Add file“ / „Upload files“ hochgeladen werden; bei vielen Dateien sind mehrere Uploads nötig. Den Punktordner `.github` unbedingt mit übertragen und im Repository anschließend `.github/workflows/apk.yml` öffnen. Der Workflow muss auf dem Standardbranch liegen, damit er manuell angeboten wird. Alte zusätzliche APK-Workflows gegebenenfalls deaktivieren, damit nicht parallel ein veralteter Bau startet.

Die beigefügte `.gitignore` lässt den Android-Quellcode jetzt zu und schließt neue Keystore-Dateien aus. Bereits in Git verfolgte Schlüssel werden dadurch nicht entfernt; die Historie wird nicht verändert.

## 3. Signierung

Der Workflow nutzt zuerst das optionale Repository-Secret `ANDROID_DEBUG_KEYSTORE_BASE64`, sonst die vorhandene Datei `signing/debug.keystore`. Er erwartet wie der bisherige Workflow den Alias `androiddebugkey` und Passwort `android`.

Wenn der bisherige Schlüssel im Repository vorhanden ist, ist keine zusätzliche Eingabe nötig. Das Secret ist die Alternative, um denselben Schlüssel bereitzustellen, ohne ihn neu im Repository abzulegen. Dafür den bestehenden Schlüssel lokal als Base64 kodieren und den Wert unter Repository → Settings → Secrets and variables → Actions → New repository secret speichern. Nicht in einen Chat oder eine Quelltextdatei schreiben.

Wenn der Schlüssel fehlt, bricht der Bau absichtlich mit einer verständlichen Meldung ab. Ein neuer Schlüssel würde keine Aktualisierung der bereits installierten App ermöglichen. Dann den bisherigen Schlüssel aus einer eigenen Sicherung oder dem bisherigen Bauprojekt wiederherstellen. Bei abweichendem Alias/Passwort oder einer bisherigen Release-Signierung muss die Signierung separat angepasst werden; dieser Workflow baut eine Debug-APK.

Der neue Workflow schreibt keine Schlüssel oder automatischen Commits ins Repository. Er prüft einen vorhandenen gespeicherten Fingerabdruck und die Signatur der fertigen APK. Die Updatefähigkeit auf deinem Gerät bleibt ohne Vergleich mit der installierten APK unbestätigt.

## 4. APK erstellen lassen

Nach dem Push startet „APK bauen“ automatisch. Alternativ im Repository „Actions“ → „APK bauen“ → „Run workflow“ und den aktualisierten Branch auswählen. Falls GitHub Actions deaktiviert ist, zunächst für das Repository aktivieren.

Der Ablauf installiert Node 22, Java 21 und Android SDK 35, führt 47 Regressionstests aus, baut die Weboberfläche, synchronisiert Android und erzeugt mit `assembleDebug` die APK. Der Auftrag hat ein Zeitlimit von 45 Minuten; die tatsächliche Dauer hängt von GitHub ab.

## 5. APK herunterladen

Den erfolgreichen Lauf öffnen. Unter „Artifacts“ den Eintrag „Rasenschach-APK“ herunterladen. Das heruntergeladene Artefakt-ZIP entpacken; darin liegt `app-debug.apk`. Diese Datei auf dem Android-Gerät öffnen und die Installation aus der verwendeten Quelle erlauben, falls Android danach fragt.

Bei einer Signatur- oder Updatefehlermeldung die vorhandene App nicht vorschnell deinstallieren. Erst Spielstandexport und Signaturschlüssel prüfen. Diese Fassung verwendet App-ID `de.rasenschach.app`, versionName `35.167.0`, versionCode `3516700`.

## Bei einem roten Build

Den fehlgeschlagenen Schritt öffnen und dessen Fehlermeldung beziehungsweise die letzten etwa 30 Protokollzeilen weitergeben. Häufig lassen sich fehlende Dateien, fehlender Schlüssel und Compilerfehler damit direkt unterscheiden. Keine Schlüssel oder Secret-Werte mitsenden.

## Prüfung dieses Pakets

Unveränderte Spielquellen aus 35.167; bestehende Nachweise im Ordner `nachweise/35.167/`. Zusätzlich wurden YAML-Struktur, Shellsyntax der Workflow-Schritte, benötigte Dateien und ZIP-Prüfsummen lokal geprüft. Ein tatsächlicher GitHub-Actions-/APK-Lauf wurde hier nicht durchgeführt: die notwendigen Downloadserver sind aus dieser Umgebung nicht erreichbar. Ein erfolgreicher externer Bau wird nicht vorweggenommen.

Der frühere PDF-Gesamtbericht und die Entwicklerübergabe beschreiben den Spielstand. Für die in diesem Paket geänderte Signierung und Repository-Übernahme gilt diese Anleitung ergänzend.
