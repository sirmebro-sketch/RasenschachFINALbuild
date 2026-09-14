# Prüfergebnisse 35.166

13. September 2026. Umfang: Entfernen des Tätigkeitskastens und Verschieben des Vorsatzes unter die Wildcard; keine Änderung an Spielregeln oder Speicherformat.

- `npm run test:korrekturen`: **33 vorhandene Regressionen bestanden**. Protokoll: `nachweise/35.166/korrekturen.log`.
- `npm run build`: erfolgreich. Hauptpaket 1.499,19 kB, gzip 552,55 kB. Die bestehende Größenwarnung bleibt. Protokoll: `nachweise/35.166/build.log`.
- Browser-Einzeldatei: erfolgreich mit dem vorhandenen Skript gebaut, Werkstatt und Erststart aktiviert. Gegenprobe: keine externen Verweise, fünf eingebettete Schriften. Protokoll: `nachweise/35.166/browser.log`.
- Quelltextprüfung des UI-Diffs: Die Aktionsfläche beginnt unmittelbar mit der jeweiligen Spielphase. Der einzige Vorsatzaufruf in dieser Ansicht liegt hinter der Wildcard im Zustandsbereich. Bei fehlendem Vorsatz wird kein Eintrag gerendert. Mobile CSS-Reihenfolge bleibt Spielerpass → Aktionen/Informationsreiter → Zustand; Desktop behält die linke Zustandsspalte.
- Bytevergleich: Die beim Browserbau verwendeten Spielquellen entsprechen dem ausgelieferten Projekt. ZIP-Integrität und Übereinstimmung der enthaltenen App.jsx wurden geprüft.

Die Regressionen laufen ohne echten Browser. Es gab **keinen neuen interaktiven Browser-, Telefon- oder APK-Test**. Die Startprobe des Browserbaus wurde ausdrücklich ausgelassen. Die vorgenannte Quelltextprüfung ersetzt keine visuelle Abnahme auf dem Zielgerät.

Die 816 Ansichtsprüfungen, 646 Vereinsprüfungen, Rückwärtsansichten und Audit-Ergebnisse der vorherigen Übergabe wurden für dieses kleine UI-Update nicht erneut ausgeführt. Sie bleiben in `PRUEFERGEBNISSE-35.165.md` mit ihrem ursprünglichen Versionsbezug erhalten.
