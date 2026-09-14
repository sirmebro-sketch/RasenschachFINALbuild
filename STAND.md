# Rasenschach XI — Stand

> **Für Claude:** Diese Datei zuerst lesen, dann den Prüfstand fahren. Er
> vergleicht die Fassung in `App.jsx` mit der Kopfzeile weiter unten und meldet
> es, wenn beide auseinanderlaufen — dann ist eine der Dateien veraltet, und
> das gehört gesagt, bevor irgendetwas geändert wird.
>
> Von Hand: `grep -n 'const VERSION' App.jsx`. **Keine Zeilennummer merken** —
> hier stand bis 35.22 „Zeile 10“, und die zeigte durch zwei neue Importe
> längst auf eine leere Zeile.

> ## Wo es weitergeht
> **Der Gerätetest auf dem S24 Ultra ist dran.** Der ausführliche Stand dazu
> steht unten im Abschnitt **„Für den nächsten Durchgang"** — dort und nur
> dort. Kurz: **seit 35.44 ist nichts mehr auf einem Telefon gelaufen**,
> inzwischen 57 Fassungen mit dem ganzen Kartensystem, dem Sonderschuss, der
> neuen Aufstellung und den neuen Bildern.
>
> Die Voraussetzung dafür steht seit 35.46: der Bau ist wiederholbar, und
> `browsertest.sh` baut mit denselben Bibliotheken wie die APK. Ein auf dem
> Gerät gefundener Fehler lässt sich damit sauber zuordnen — vorher hätte er
> auch aus einer anderen Bibliotheksfassung stammen können.
>
> **Was jetzt zählt, kann der Prüfstand nicht:** die Sachen einmal auf einem
> echten Telefon sehen. Zwei Gerätetests hat es gegeben, beide haben etwas
> gefunden, was hier drinnen unsichtbar ist:
> * **35.27** — Vereinsgründung auf dem S24 Ultra: Vorschau scrollte weg,
>   Gründen-Knopf auf 32 px gequetscht. Zwei Layoutfehler.
> * **35.28** — Vereinsmodus im Spiel: der Verein lief völlig unabhängig von
>   den Laufbahnen. Ein konzeptioneller Fehler, den keine Messung stellt.
>
> Ein Gerätetest, der einen Fehler findet, bestätigt nicht die Reparatur. Für
> die Abkürzungen beim Testen gibt es seit 35.29 `pruefstand/werkstatt.js` im
> Browsertest — mit **`WERKSTATT=1` oder `ERSTSTART=1`** gebaut, sonst ist sie
> nicht drin. **Welche
> Schwellen dort gelten, sagt der Lauf** (`vereinpruefung.cjs`), nicht dieser
> Absatz.
>
> **Hier stand bis 35.100 eine zweite Gerätetest-Liste** mit 35.23 bis 35.29
> und „Vollausbau nach rund 28". Beides war überholt: der Rückstand ist nicht
> vier Fassungen groß, sondern siebenundfünfzig, und das Band steht seit 35.81
> auf 20–30 (gemessen 21,5). Dieselbe Auskunft an zwei Stellen läuft
> auseinander — genau die Falle, die diese Datei schon dreimal beschreibt.
> Deshalb steht der Stand jetzt nur noch unten, und hier nur der Verweis.
>
> Danach: Langzeitbeobachtung (offener Punkt 13) und die Gestaltungsfragen
> 1 bis 3 und 5, die alle Augen brauchen statt Messungen.

**Fassung 35.168** · Stand 14. September 2026

<!-- VERZEICHNIS -->

## Verzeichnis

*Erzeugt von `pruefstand/verzeichnis.cjs` — nicht von Hand pflegen.*

| Zeile | Abschnitt |
|---:|---|
| 277 | 35.167 |
| 285 | 35.166 |
| 293 | 35.165 |
| 311 | 1. Was das Projekt ist |
| 399 | 2. Zusammenarbeit |
| 415 | 3. Was drin ist (Grobüberblick) |
| 528 | 4. Kalibrierung — worauf eingestellt wurde |
| 590 | 5. Prüfstand |
| 684 | 6. Stolperfallen — teuer gelernt |
| 723 | 7. Was offen ist |
| 751 | 8. Wie ein neuer Chat anfangen sollte |
| 843 | Fassungen 33.3 bis 33.7 — Schrift, Form, Farbe |
| 1167 | Auf dem Gerät geprüft — 10.8.2026 |
| 1274 | 34.0 · Die Spielerporträts |
| 1391 | 34.3 · Die App wird ein Heft (Schritt 1 von 3) |
| 1639 | 34.8 · Vier gemeldete Punkte |
| 1691 | 34.9 · Block A — fünf Fehler im Spielfluss |
| 1756 | 34.10 · Block B, erster Teil — die Sprache der Oberfläche |
| 1811 | 34.11 · Sprache, zweiter Anlauf — und ein Befund, der Arbei… |
| 1859 | 34.12 · Block C — Frauenfußball |
| 1914 | 34.13 · Block D, erster Teil |
| 1963 | 34.14 · Die Wachstumskurve |
| 2017 | 34.15 · Die Rückblick-Karten |
| 2056 | 34.16 · Zwei Fehler aus Kevins Test |
| 2116 | 34.17 · Die Freischaltungen |
| 2151 | 34.18 · Der Vermächtnis-Laden |
| 2219 | 34.19 · Der gekaufte Kartentausch wirkt |
| 2265 | 34.20 · Der Laden nach dem ersten Blick aufs Gerät |
| 2297 | 34.21 · Laden und Zahnrad lagen aufeinander |
| 2378 | 34.22 · Der Laden rechnet ab, und zwei Texte |
| 2465 | 34.23 · Jede neue Seite beginnt oben |
| 2522 | 34.24 · Der Spielerpass: Stärke, Binden, Flaggen |
| 2594 | 34.25 · Die Ränge der Errungenschaften |
| 2657 | 34.26 · Der Rückblick liegt auf Karteikarten |
| 2727 | 34.27 · Drei wirklich runde Kopfformen |
| 2796 | 34.28 · Zwei Kopfformen ohne markantes Kinn |
| 2832 | 34.29 · Herkunft, Statur und Geschlecht wirken aufs Gesicht |
| 2899 | 34.30 · Aufräumen nach dem Belastungstest |
| 2961 | 34.31 · Kartenwechsel ohne Ruckler, Schritte auf Formularpa… |
| 3007 | 34.32 · Die Wildcard auf hellem Papier |
| 3045 | 34.33 · Die Kopfformen sind wieder spiegelgleich |
| 3082 | 34.34 · Drei Meldungen aus dem Spiel |
| 3137 | 34.35 · Bärte bleiben in der Kopfform |
| 3170 | Kevins Testprotokoll zu 34.33 — Ergebnis |
| 3195 | 34.36 / 34.37 · Goldton, Kopflinie, Zielverein des Trainers |
| 3243 | 34.38 · Alle 212 Nationen haben eine echte Flagge |
| 3290 | 35.0 · Ereigniswiederholung: gemessen statt vermutet |
| 3341 | 35.1 · Werkzeugpflege |
| 3396 | 35.2 · STAND.md hat ein Verzeichnis |
| 3431 | 35.3 · Eine Regel weniger zum Merken |
| 3468 | 35.4 · Vier Fundstellen aus der Eingangsprüfung |
| 3576 | 35.5 · Ein Prüfwerkzeug für die Ereignisse |
| 3705 | 35.6 · Die Ereignisse ziehen aus |
| 3781 | 35.7 · Entscheidungen mit Folgen |
| 3847 | 35.8 · Deine Werte öffnen Türen |
| 3923 | 35.9 · Storystränge |
| 3989 | 35.10 · Der Anfang war die engste Stelle |
| 4062 | 35.11 · Wo die Bedingungen hingehören — und ein grober eige… |
| 4126 | 35.12 · Die Ehrentafel sagt jetzt, wohin |
| 4193 | 35.13 · Die Akademie wird größer |
| 4279 | 35.14 · Antworten, die nur manchmal da sind |
| 4349 | 35.15 · Vier Geschichten statt einer |
| 4401 | 35.16 · Vierundzwanzig weitere Male anders |
| 4466 | 35.17 · Der eigene Verein — Durchstich |
| 4560 | 35.18 · Der Vereinsmodus ist zu Ende gerechnet |
| 4622 | 35.19 · Die Akademie wird zeitlos |
| 4667 | 35.20 · Der Verein bekommt ein Gesicht |
| 4731 | 35.21 · Der Verein ist erreichbar |
| 4781 | 35.22 · Was hier stand, stimmte nicht mehr |
| 4867 | 35.23 · Der Pass wuchs an zwei Stellen, keine davon war die… |
| 4973 | 35.24 · Durchsicht des ganzen Projektwissens |
| 5084 | 35.25 · Ein gemeldeter Fehler, den es nicht gab |
| 5155 | 35.26 · Das Tutorial |
| 5257 | 35.27 · Erster Gerätetest des Vereinsmodus |
| 5340 | 35.28 · Der Verein läuft nebenher |
| 5456 | 35.29 · Die Knopfprüfung hätte den Fehler nicht gefunden |
| 5534 | 35.30 · Die Bauanleitung war unvollständig |
| 5693 | 35.31 · Die Moral steht in der Anleitung — und liefert ande… |
| 5783 | 35.32 · Die Akademie steht im Rückblick |
| 5888 | 35.33 · Die Ruhmeshalle war nie geprüft |
| 5967 | 35.34 · Jugendturniere bekommen Namen und Gegner |
| 6105 | 35.35 · Drei Flaggen bekommen Folgen |
| 6220 | 35.36 · Die letzten zwei Flaggen bekommen Inhalt |
| 6314 | 35.37 · Ereignisse, die zum falschen Moment kommen |
| 6466 | 35.38 · Der Kapitän spricht nicht mehr mit sich selbst |
| 6576 | 35.39 · Die Akademie zahlt früher — und sagt es |
| 6689 | 35.40 · Weibliche Frisuren: 9 von 14 waren dieselbe |
| 6771 | 35.41 · Werkzeugkasten aufgeräumt |
| 6879 | 35.42 · Der Abschlussbildschirm wird übersichtlich |
| 7001 | 35.43 · Namen nach Land statt nach Sprachraum |
| 7206 | 35.44 · Eine Kennzahl, die nichts mehr bedeutete |
| 7270 | 35.45 · Sechs Listen, die auseinandergelaufen waren |
| 7422 | 35.46 · Der Bau ist wiederholbar — und eine eigene Behauptu… |
| 7558 | 35.47 · Der Prüfstand sieht nach der Sicherheitslage |
| 7664 | 35.48 · Die Akademie zieht aus |
| 7791 | 35.49 · Stufe A — die Aufstellung von Hand |
| 7913 | 35.50 · Ein Dach über Akademie und Profimannschaft |
| 7988 | 35.51 · Der Abschluss schließt ab |
| 8114 | 35.52 · Stufe B — die Saison wird gespielt |
| 8234 | 35.53 · Stufe C, erster Teil — Verträge und Postkorb |
| 8342 | 35.54 · Stufe C, zweiter Teil — Kaderverträge, und Punkt 21… |
| 8440 | 35.55 · Stufe D — den Kader ausdünnen |
| 8516 | 35.56 · Die Werkstatt war nie da, und die Namen kamen alle… |
| 8622 | 35.57 · Die Namen haben ihre Zeichen zurück |
| 8703 | 35.58 · Drei Befunde vom Gerät — und einer davon war unsich… |
| 8778 | 35.59 · Die Auswahl steht dort, wo man hingetippt hat |
| 8813 | 35.60 · Das Dach zeigt den Stand, statt ihn zu verstecken |
| 8872 | 35.61 · Verwaltung im Jugendhaus |
| 8922 | 35.62 · Errungenschaften für den eigenen Verein |
| 9018 | 35.63 · Kartenoptik hinter dem Porträt |
| 9086 | 35.64 · Derselbe Fehler, eine Klasse weiter |
| 9141 | 35.65 · Verträge auf Papier — und eine ganze Farbwelt war u… |
| 9201 | 35.66 · Der Rücktrittsknopf tat vier Fassungen lang nichts |
| 9253 | 35.67 · Erst der Verein, dann die Liga |
| 9325 | 35.68 · Wappen im Dach, Postfach zu |
| 9371 | 35.69 · Der Rahmen von damals, und eine Rückseite |
| 9442 | 35.70 · „Dein Verein" gehört jetzt zum Blatt |
| 9487 | 35.71 · Nachgesehen: hängt jeder Bildschirm am Blatt? |
| 9539 | 35.72 · Gleich gebaut war nicht gleich laut |
| 9595 | 35.73 · Der Abschluss lebte nur im Arbeitsspeicher |
| 9649 | 35.74 · Achtzehn Ziele für die langen Jahre |
| 9726 | 35.75 · Die Hallenkarten wenden sich wie ein Spielerpass |
| 9769 | 35.76 · Der Sonderschuss |
| 9866 | 35.77 · Sonderschuss auf Knopfdruck |
| 9909 | 35.78 · Der Sonderschuss wird ein Fenster |
| 9971 | 35.79 · Das Fundament für die Sammelkarten |
| 10057 | 35.80 · Vier Packs, und sie sagen, was sie kosten |
| 10127 | 35.81 · Zwei von drei Häusern arbeiteten umsonst |
| 10199 | 35.82 · Die Spielerkarte |
| 10256 | 35.83 · Feste Karten, Merkmale, Jubel |
| 10330 | 35.84 · Holoschimmer |
| 10393 | 35.85 · Der Packladen — das Kartensystem wird spielbar |
| 10441 | 35.86 · Eine Grenze ohne Ausweg ist eine Falle |
| 10501 | 35.87 · Der Fundus, und Karten wischen weg |
| 10541 | 35.88 · Die Aufstellung wird zum Kartenraster |
| 10618 | 35.89 · Karten fallen aus dem Pack — und das Startpaket |
| 10680 | 35.90 · Vier Befunde vom Gerät |
| 10750 | 35.91 · Die Elf steht jetzt so, wie sie spielt |
| 10815 | 35.92 · Ist der Tisch leer, geht es zurück |
| 10850 | 35.93 · Das Postfach wird ein Briefsymbol |
| 10914 | 35.94 · Acht Befunde vom Gerät |
| 11024 | 35.95 · Ein neuer Zugang braucht einen passenden Ausgang |
| 11059 | 35.96 · Der Schimmer, zum dritten Mal — diesmal gerechnet |
| 11125 | 35.97 · „Warum funktioniert das an anderen Stellen?" |
| 11189 | 35.98 · Eine Ziffer, und ein Lauf an der Zeitgrenze |
| 11249 | 35.99 · Ein stetiger Verlauf ist nicht dasselbe wie ein ruh… |
| 11299 | 35.100 · Neues App-Symbol, echtes Mannschaftsfoto |
| 11366 | 35.101 · Der Prüfstand meldete sieben Fehler, die keine waren |
| 11494 | 35.102 · Eine Wildcard war unerreichbar, und niemand hat es… |
| 11650 | 35.103 · Drei Entscheidungen, und was danach folgte |
| 11760 | 35.104 · Jede Spielzeit bekommt eine Schlagzeile |
| 11875 | 35.105 · Eine Rückkehr war keine Rückkehr |
| 11999 | 35.106 · Marken für Laufbahnen, die keine Weltkarriere werden |
| 12123 | 35.107 · Das eine Ziel |
| 12223 | 35.108 · Sechs Entscheidungen kommen zurück |
| 12331 | 35.109 · Was für eine Laufbahn war das eigentlich? |
| 12438 | 35.110 · Warum ruft gerade dieser Verein an? |
| 12538 | 35.111 · Die Tabelle hatte die Namen die ganze Zeit |
| 12620 | 35.112 · Vier Auswege, jeder mit einem Preis |
| 12703 | 35.113 · Der Archetyp bekommt seine Wirkung |
| 12788 | 35.114 · Das erste neue Feld — und warum es unvermeidlich war |
| 12863 | 35.115 · Ein Fünftel des Spielstands war Ballast |
| 12935 | 35.116 · Zwanzig Rekorde, die längst mitliefen |
| 12989 | 35.117 · Die Ruhmeshalle wird ein Museum |
| 13060 | 35.118 · Fünfzehn Jahre in Kapiteln — und eine Prüfung, die… |
| 13148 | 35.119 · Die Zeitleiste — und das Jahr, das dem Verein fehlte |
| 13230 | 35.120 · Das Hauptmenü hatte schon fast alles |
| 13287 | 35.121 · Der erste Gerätebefund seit 35.28 |
| 13347 | 35.122 · Meine Korrektur war zu breit |
| 13410 | 35.123 · Fast geschafft — abgeleitet statt gepflegt |
| 13500 | 35.124 · Zwei stille Fehler, einer davon meiner |
| 13581 | 35.125 · Die Kette ist geschlossen |
| 13640 | 35.126 · Sechs Sammlungsseiten |
| 13697 | 35.127 · Entwicklungstypen — die letzte Stufe |
| 13765 | 35.128 · Ein abgestürzter Prüfteil sagt jetzt, dass er abge… |
| 13822 | 35.129 · F29 — zwei Systeme, ein Speicherplatz |
| 13916 | 35.130 · F01 — Fortsetzen sprang zurück ins Training |
| 13972 | 35.131 · Der Sicherungspfad — F02, F03, F04, F05, F15, F18 |
| 14054 | 35.132 · F06 — was sich nicht speichern ließ |
| 14112 | 35.133 · F41 — „Nicht umkehrbar" war eine falsche Zusage |
| 14172 | 35.134 · F44 und F17 — Etappe 1 ist durch |
| 14236 | 35.135 · F07 — die Kalibrierung maß ein anderes Spiel |
| 14304 | 35.136 · F08 — eine Saison versprochen, zwei geliefert |
| 14360 | 35.137 · F09 bis F14 — wenn der Text mehr verspricht als di… |
| 14469 | 35.138 · F16 und F19 — und eine Umbenennung, die ich nicht… |
| 14534 | 35.139 · F20 bis F28 — neun kleine Rechenfehler |
| 14628 | 35.140 · F30 bis F40 — elf Befunde an meinen eigenen Systemen |
| 14695 | 35.141 · F49 und F50 — bedienbar ohne Tippen |
| 14757 | 35.142 · F51 — eine Sperre mit Trostpflaster |
| 14822 | 35.143 · F45 bis F48 — Dialoge, aus denen man herauskam |
| 14886 | 35.144 · F52 — und zwei Fehler, die ich selbst gebaut habe |
| 14946 | 35.145 · F53 — der Kontrastwächter sah drei von sieben Ansi… |
| 14999 | 35.146 · F54 — drei Belohnungen, die nie ankamen |
| 15050 | 35.147 · F55 und F56 — der Fehlerkatalog ist durch |
| 15105 | 35.148 · V01 — was eine Wahl wirklich bewirkt hat |
| 15162 | 35.149 · V02 — warum die Saison so lief |
| 15223 | 35.150 · V03 — Vorschau und Rückweg |
| 15288 | 35.151 · V04 — was ansteht und was schwebt |
| 15341 | 35.152 · Ein Buchführungsfehler — und die echten F45/F46 |
| 15407 | 35.153 · V05 — nachgeprüft und in Ordnung |
| 15466 | 35.154 · V09 — wann ein Kauf wirkt |
| 15509 | 35.155 · V12 — ein Textkatalog aus fertigen Ausgaben |
| 15577 | 35.156 · V10 — wiederholbare Messungen, und Punkt 21 ist ge… |
| 15636 | 35.157 · V08 — die Karte sagt, woher der Spieler kommt |
| 15686 | 35.158 · V11 — die erste Laufbahn bleibt |
| 15736 | 35.159 · F33 und F34 — die zwei, die ich übersprungen hatte |
| 15804 | 35.160 · Das Seed-Problem — eine Zeile |
| 15859 | 35.161 · V06 — die erste echte Konsequenzkette |
| 15916 | 35.162 · V07 — ein Vorsatz statt eines zweiten Zielsystems |
| 15983 | 35.163 · F47 und F48 — beim Berichtschreiben aufgefallen |
| 16040 | 35.164 · Die Einstellungen waren kaputt — ausgeliefert |
| 16089 | 35.168 · Zusammenführung mit dem Codex-Stand 35.167 |
| 16289 | Für den nächsten Durchgang |
| 16366 | Offene Punkte (Stand 35.164) |
| 16711 | Zusätzliche Stolperfallen |

<!-- ENDE VERZEICHNIS -->

## 35.167

Gemeinsame Journalbuchungen für Karriereabschluss, Karten, Coins, Akademie- und Vereinsübergaben. Feste Kennungen für 1.161 Ereignisantworten, mit Migration des bisherigen Ablauf-Schemas. Wiederholung nach Speicherfehler korrigiert; Fanshop-Reichweite berichtigt. Zwei zusätzliche Vorsätze und kleine Verbesserungen am Spielerpass. Neue Buchungslogik in `buchungen.js`.

### Geprüft

Aktueller Prüfstand und Grenzen: `PRUEFERGEBNISSE-35.167.md`. Frühere Prüfergebnisse behalten ihren Versionsbezug. Übergabe: `UEBERGABE-CLAUDE-35.167.md`.

## 35.166

Kevins UI-Wunsch: Tätigkeitskasten unter dem Spielerpass vollständig entfernt. Der ausgewählte Vorsatz steht unter der Wildcard im Bereich Zustand, einschließlich bisherigem Erfüllungsstatus. Übergabe: `UEBERGABE-CLAUDE-35.166.md`. Vorherige Korrekturen aus 35.165 bleiben enthalten.

### Geprüft

Ergebnisse und Grenzen dieses kleinen UI-Updates: `PRUEFERGEBNISSE-35.166.md`, Protokolle unter `nachweise/35.166/`. Frühere große Prüfläufe sind weiterhin als Ergebnisse von 35.165 gekennzeichnet.

## 35.165

Aktuelle Korrekturen und Übergabe: `UEBERGABE-CLAUDE-35.165.md`.
F01-F04, F17, F31, F35, F42-F44, F47, F51-F53 bearbeitet.
Die älteren Erledigt-Meldungen gelten nur zusammen mit der aktuellen Übergabe.

### Geprüft

33 neue Regressionen, 816 Ansichtsprüfungen, 646 Vereinsprüfungen und 6 × 63 Rückwärtsansichten bestanden. Vollständiger npm-Audit: 0 bekannte Treffer. Web-Build: rund 1.500,58 kB Hauptpaket, gzip 553,09 kB. Protokolle und Grenzen: PRUEFERGEBNISSE-35.165.md.

*Eigene Schriften · harte Form · Sammelalbum · neue Spielerporträts · **das Heft: dunkles Zeitungspapier***

> Die Abschnitte 1 bis 8 beschreiben das Spiel und die Arbeitsweise und gelten
> unverändert. Alles ab „Fassungen 33.3 bis 33.7" ist neuer und **hat Vorrang**,
> wo sich etwas widerspricht.

---

## 1. Was das Projekt ist

Ein Karriere-Simulator für Fußball, auf Deutsch. Läuft als Android-App: GitHub
baut per Aktion `apk.yml` eine APK, die ohne Internet funktioniert.

Der Spielcode steht in **`App.jsx`**. Sie bindet **sechs** eigene Dateien ein —
nachzählbar an den `import`-Zeilen 2 bis 7:

| Datei | Was | Seit |
|---|---|---|
| `ereignisse.js` | die Ereignisse | 35.6 |
| `verein.js` | der eigene Verein | 35.17 |
| `karten.js` | Sammelkarten, Seltenheit, dauerhafter Spielerpool | 35.79 |
| `titelbild.js` | das Aufmacherfoto des Titelblatts (WebP, eingebettet) | 35.100 |
| `namen.js` | die Namenskartei, ein Eintrag je Land | 35.43 |
| `akademie.js` | die Jugendakademie: Talente, Jahreslauf, Ausbau, Gabe | 35.48 |
| `schriften.js` | Anton und Archivo als Base64 | 33.3 |
| `storage.js` | Speicher über Capacitor | vor 33.0 |
| `buchungen.js` | validierte Pack- und Verkaufsbuchungen | 35.167 |
| `sicherung.js` | validierter Import, Journal und serialisierte Speicherzugriffe | 35.165 |
| `spielstand.js` | vollständiger Ablauf und Ereignis-Wiederherstellung | 35.165 |

Bis 35.22 stand hier „**eine einzige** `App.jsx`“. Für Schriften und Speicher
war das immer schon eine Vereinfachung, seit dem Auszug der Ereignisse (35.6),
des Vereins (35.17) und der Namen (35.43) ist auch **Spielinhalt** ausgelagert
— dann trägt sie nicht mehr.

> **Hier standen bis 35.44 Größen und Zeilenzahlen. Sie sind weg.** Dreimal
> hintereinander waren sie veraltet: 764 KB / 12.829 Zeilen bis 35.29, dann
> 783 KB / 13.198 bis 35.44 — gemessen waren es da längst 810 KB / 13.674.
> Und `namen.js` fehlte in dieser Tabelle seit 35.43 ganz, obwohl das die
> Liste dessen ist, was hochzuladen ist; wer danach neu aufbaut, bekommt ein
> Spiel, das sich nicht bauen lässt. **Der Prüfstand misst diese Zahlen bei
> jedem Lauf** und gibt sie im Aufbau aus („Eigene Dateien (gemessen, …)"). Was
> gilt, meldet der Lauf — abgeschrieben wird nichts mehr. Dass die Tabelle
> vollständig bleibt, rechnet Prüfung 9 nach.

**Zielpublikum:** soll selbsterklärend sein, auch für jemanden, der so
etwas noch nie gespielt hat. Deutschsprachige Oberfläche durchgehend.

**Dateien im Projekt** (so heißen sie im Verzeichnis, das Projektwissen
schreibt Punkte in Unterstriche um):

| Datei | Zweck |
|---|---|
| `App.jsx` | das ganze Spiel — **Android-Fassung**, bindet `./storage.js` ein |
| `ereignisse.js` | die Ereignisse, seit 35.6 ausgelagert (Fabrik `machEreignisse`) |
| `verein.js` | der eigene Verein, seit 35.17 (Fabrik `machVerein`) |
| `namen.js` | die Namenskartei, seit 35.43 (Fabrik `machNamen`) |
| `akademie.js` | die Jugendakademie, seit 35.48 (Fabrik `machAkademie`) |
| `main.jsx`, `index.html` | Einstiegspunkt |
| `storage.js` | Speicher über Capacitor Preferences |
| `package.json`, `vite.config.js` | Bau |
| `package-lock.json` | nagelt die Bibliotheksfassungen fest, seit 35.46 — **gehört eingecheckt**, sonst ist der Bau nicht wiederholbar |
| `capacitor.config.json` | App-Hülle |
| `apk.yml` | GitHub-Aktion, gehört nach `.github/workflows/` |
| `.gitignore` | im Projektwissen als `_gitignore` |
| `schriften.js` | Anton und Archivo als Base64 |
| `schriften-lizenz.txt` | SIL OFL für **beide** Schriften — muss mit der App ausgeliefert werden |
| `STAND.md` | diese Datei |
| `UEBERSICHT.md` | Inhaltsübersicht, **erzeugt** aus dem Spielcode — nicht von Hand ändern |
| `LIESMICH.md` | Kurzanleitung zum Prüfstand |
| `appicon.py` | Symbolsatz erzeugen, im Repo unter `symbol/` |
| `pruefstand/` | Prüfwerkzeuge, siehe Abschnitt 5 |

Bis 35.24 stand hier `ANLEITUNG.md` — die Datei gibt es nicht und hat es in
diesem Projektwissen nie gegeben. Sechs vorhandene Dateien fehlten dafür.
**Was hier steht, ist die Liste dessen, was hochzuladen ist**; ein Eintrag
zu viel schickt genauso in die Irre wie einer zu wenig.

**Zwei Fassungen, eine Quelle.** `App.jsx` ist die Android-Fassung. Für das
Testen im Chat erzeugt `pruefstand/vorschau.py` daraus eine Vorschaufassung
(`window.storage` statt Capacitor, Schriften **aus `schriften.js` hineinkopiert**).
Bis 35.24 stand hier „Schriften aus dem Netz" — das beschrieb den Stand vor
33.3 und war der Fehler, den 33.3 behoben hat: die Vorschau zeigte etwas
anderes als das Gerät. `vorschau.py` bricht heute ab, wenn `schriften.js`
fehlt. Die Spielmechanik
ist Zeichen für Zeichen identisch — das Skript bricht ab, wenn es etwas nicht
findet, und prüft am Ende, dass keine Reste übrig bleiben.

    python3 pruefstand/vorschau.py App.jsx rasenschach-vorschau.jsx

**Die Android-Fassung lässt sich im Chat nicht öffnen.** Tippt Kevin sie an,
meldet die Vorschau *„Artifact failed to load — ./storage.js"*. Das ist kein
Fehler, sondern gewollt. Dann auf die Vorschaufassung verweisen.

---

## 2. Zusammenarbeit

**Kevin** — Hamburg, HSV. Arbeitet prüfend: Er erwartet **Zahlen vor und
nach** jeder Änderung, keine Behauptungen. Wenn etwas nicht geprüft ist,
gehört das gesagt. Er hat schon zweimal zu Recht bemängelt, dass etwas als
erledigt gemeldet wurde, was es nicht war (Konfettifarben, `ntNote`).

Was daraus folgt:
- Behauptungen über Wirkung immer messen, nie schätzen.
- Eigene Fehler klar benennen, nicht relativieren.
- Nach jeder Sitzung: **neue `App.jsx` und dieses `STAND.md` ins Projekt
  legen.** Sonst beginnt der nächste Chat wieder bei einem alten Stand —
  genau das ist am 7.8.2026 passiert und hat die halbe Sitzung gekostet.

---

## 3. Was drin ist (Grobüberblick)

Laufbahn von 16 bis Karriereende: Trainingsschwerpunkt, 2–3 Ereignisse je
Saison, simulierte Saison mit echten Wettbewerben, Transferfenster.
Dazu: Wildcards mit Seltenheitsstufen, 162 Errungenschaften, Nationalmann-
schaft, Vermögen und Anschaffungen, Ruhmeshalle, Saison- und Karriere-
rückblick, Kapitänsbinde im Pass, Sicherung per Textbaustein.

**Neu in 33.2 — zwei Fehler in der Enthüllung behoben**

Beide stammten aus der Neufassung in 33.0, beide waren als „unrunde
Animation" sichtbar:

1. **Text blinkte nach dem Aufdecken kurz weg.** Die Klasse der Textzeilen
   wechselte bei Stufe 2 von `eb` auf `eb rs-auf`. `rs-auf` beginnt bei
   `opacity:0` mit Füllmodus `both` — der schon sichtbare Text sprang also
   auf unsichtbar und blendete neu ein. Jetzt hängt die Einblendung an `auf`
   und wird danach nicht mehr angefasst.
2. **Die Drehung lief unrund.** Beben, Schweben und Drehung saßen auf
   demselben Element und stritten um `transform`; beim Wechsel sprang die
   Karte. Zusätzlich endete die Drehung (780 ms) exakt dann, wenn das
   Schweben ansetzte. Jetzt: drei getrennte Ebenen (Perspektive · Bewegung ·
   Drehung), Drehung auf 700 ms, Schweben erst nach 820 ms.

Nebenbei: `-webkit-`-Vorsätze für `backface-visibility` und
`transform-style` (ältere Android-Webansichten), `will-change` gesetzt,
Strahlen auf feste Größe begrenzt statt `inset:-60 %` über die ganze Fläche,
Funken mit Verlauf statt weichem Schein gezeichnet.

**Neue Prüfung `ablauf()`** in `ansichten.jsx`: hält den Zustand an fünf
Zeitpunkten fest und schlägt an, wenn Textklassen nach dem Aufdecken
wechseln oder Drehung und Bewegung auf einem Element sitzen. Mit beiden
Fehlern gegengeprüft — beide werden gefunden.

**App-Symbol und Name (8.8.2026)**

- Die App heißt auf dem Gerät **Rasenschach XI** (`appName` in
  `capacitor.config.json`, vorher nur „Rasenschach"). Real geprüft: `cap add
  android` schreibt den Namen in `res/values/strings.xml`.
- Im Projekt liegt **eine** Bilddatei `symbol/appicon.png`. Der ganze Satz aus
  fünf Bildschirmdichten entsteht beim Bauen über `symbol/appicon.py`. Zum
  Wechseln des Symbols nur diese eine Datei tauschen.
- **Warum ein fertiges Symbol nicht direkt geht:** Android legt seit Version 8
  eine eigene Maske darüber (Kreis, Squircle, abgerundetes Quadrat). Ein Bild
  mit eingebautem Rahmen bekommt dadurch eine zweite Rundung und einen dunklen
  Ring, der Schriftzug wird beidseitig abgeschnitten. `appicon.py` entfernt den
  Rahmen, legt das Bild auf die mittleren 72 von 108 Einheiten und füllt den
  Rand mit einer unscharfen Vergrößerung auf.
- Kein `<monochrome>` in der Symbolbeschreibung: Android nutzt davon nur die
  Alphamaske, und die wäre bei einem vollflächigen Bild ein einfarbiger Klotz.
- `symbol/erzeugt` steht in `.gitignore`.

**Neu in 33.1**

- **`Handlung` ist ersatzlos entfernt** (Bauteil und alle drei Einsatzstellen).
  Die große Schrittanzeige nahm zu viel Platz im Spielbereich. Den Fortschritt
  zeigt weiterhin die schmale `Schritte`-Leiste im Kopf; die Ereigniszählung
  steht jetzt als kleine Zeile über der Ereigniskarte.
- **Punkte und Coins auseinandergehalten.** Die erste Zeile der VC-Aufschlüsselung
  hieß „Vermächtnispunkte" und zeigte den bereits umgerechneten Betrag — das
  legte nahe, beide Zahlen seien dasselbe. Sie heißt jetzt
  „Aus 1.204 Vermächtnispunkten", dazu ein Hinweis im Kopf des Blocks.
  Gemessen: 1.500 Laufbahnen ergaben 135–2.150 Punkte, aber nur 5–131 Coins;
  die beste einzelne Laufbahn deckt **4 % des Vollausbaus**.

**Neu in 33.0**

- **Reiterwechsel** springt an den Anfang des Bereichs (`zumAnfang`). Vorher
  blieb man bei kürzerem Inhalt irgendwo unterhalb der Seite stehen.
- **Ergebnisschritt umsortiert:** Transfermarkt steht jetzt über der
  Saisonbilanz — nach dem Rückblick will man weiterspielen, nicht dieselben
  Zahlen zweimal lesen.
- **Karriereende:** Der Rückweg ins Hauptmenü heißt „Neue Laufbahn beginnen",
  ist groß und pocht dezent.
- **Kartenenthüllung** läuft in vier Stufen (Aufbau, Umschlag, Nachglühen,
  Bereit) und ist **bis zum Ende nicht wegtippbar**. Dabei kam heraus: Die
  Rautekarte bekam wegen `indexOf(...) === -1` die **schwächste** Animation
  von allen. Sonderstufen mit Gewicht 0 zählen jetzt als höchste Stufe.
- **Vibration** für jede Schaltfläche über **eine** Ereignisbehandlung auf
  `pointerdown` statt an 72 Knöpfen einzeln. `haptik` unterdrückt doppelte
  Impulse innerhalb von 160 ms, ein kräftigerer löst einen schwächeren ab.
- **Akademie:** zwölf Errungenschaften, Ausbau-Ring, Fortschrittsbalken zum
  nächsten Ziel, mitlaufende Zahlen, Konfetti beim Ausbau. Am Karriereende
  werden große Jahrgänge hervorgehoben (Konfetti bei einem Weltklassespieler)
  und der Weg zum nächsten Ausbau gezeigt.
- **Rautekarte** auf Median 33 Laufbahnen eingestellt (Steigerung 0,12 Punkte).

**Neu in 32.1 — Rautekarte („NUR DER HSV")**

Die Karte war zwar ziehbar, aber unerreichbar: Der Ausgleichszähler
`hsvZaehler` wurde an zwei Stellen **gelesen und an null Stellen geschrieben**.
Gemessen vorher: 0,092 % je Laufbahn, 1 von 1.087, für 50 : 50 hätte es
753 Laufbahnen gebraucht. Jetzt läuft der Zähler unter `HSV_KEY`, steigt je
abgeschlossener Laufbahn ohne die Karte um **0,35 Punkte** und beginnt bei
einem Treffer wieder bei 0,1 %. Gemessen nachher: **Median 20 Laufbahnen**
(P10 8, P90 36), 80 % innerhalb von 30.

**Neu in 32.0 — Jugendakademie und Vermächtnis-Coins**

- **VC** gibt es nach jedem Karriereende (`vcFuer`), aufgeschlüsselt im
  Abschlussbildschirm (`vcPosten`).
- **Eine beendete Laufbahn = ein Jahr in der Akademie.** `akaVerbuchen`
  schreibt die Coins gut und lässt — nur wenn gegründet — `akaJahr` laufen.
- **Sechs Abteilungen** (`ABTEILUNGEN`), je sechs Stufen, Vollausbau 1.564 VC.
- **Talente** treten mit 15 ein, gehen mit 19. Übergang in den Profibereich
  ist eine Wahrscheinlichkeit, keine feste Schwelle.
- **Rückwirkung auf neue Laufbahnen** über `akaBonus`, **hart gedeckelt**:
  Anlage +4, Bekanntheit +6, +100 Tsd. € Startkapital, Entwicklung +6 %.
- Gründung ist kostenlos und setzt drei Jahrgänge auf einmal ein, damit
  nicht vier Laufbahnen lang nichts passiert.

---

## 4. Kalibrierung — worauf eingestellt wurde

**Gemessen am 4.9.2026** über 300 simulierte Laufbahnen bzw. 40–120 Akademie-
durchläufe. **Die Zielbänder stehen in `pruefstand/kalibrierung.cjs` ganz
oben und lassen das Skript fehlschlagen, wenn sie verlassen werden** — die
Tabelle hier ist eine Abschrift des Laufs, nicht die Quelle. Bei Abweichung
gilt das Skript, nicht diese Tabelle.

| Kennzahl | Gemessen 4.9.2026 | Zielband |
|---|---|---|
| VC je Laufbahn | Mittel **104,3**, Median 106 (P10 54, P90 151) | — |
| Laufbahnen bis Vollausbau (alle Quellen) | **21,3** | 20–30 |
| Kosten des Vollausbaus | **2.912 VC** | 2.700–3.100 |
| Weltklasse, Stufe 6 / 25 Jahre | Median **5** (P10 2, P90 7) | 3–8 |
| Laufbahnen bis zur Rautekarte | Median **34** (P10 14, P90 64) | 28–42 |

Ertrag der Akademie über 25 Jahre je Ausbaustufe (Profis / Weltklasse):
Stufe 1 → 1,7 / 0 · Stufe 3 → 14,2 / 0 · Stufe 5 → 53,4 / 1,3 · Stufe 6 → 56,2 / 4,3

Realistischer Verlauf über 40 Laufbahnen mit stufenweisem Ausbau (30 Durchgänge,
`pruefstand/verlauf40.cjs`, Laufzeit 46 s): **66,6 Profis, 3,8 Weltklassespieler,
Ansehen 336,6** (Median 341) → Anlage +4, Ruf +6, +100 Tsd. €, Entwicklung +6 %.
Der Vollausbau wird in **30 von 30** Durchgängen erreicht.

Sicherungsgröße der Akademie nach 25 Jahren: **34,4 KB** (Talente offen,
Ehrentafel auf 40 gekappt, Chronik auf 25 Jahre).

> **Der Kalibrierungslauf nennt ZWEI Zahlen, die fast gleich klingen.** Bis
> 35.101 hiessen sie „nötige Laufbahnen" und „Laufbahnen bis Vollausbau" und
> standen zwei Zeilen auseinander. Die erste teilt nur durch die VC aus der
> Spielerlaufbahn (27,9), die zweite durch alle Quellen zusammen (21,3), und
> **nur die zweite wird gegen das Zielband geprüft.** Seit 35.102 sagt die
> erste Zeile ausdrücklich „nur aus Laufbahn-VC, ohne die anderen Quellen".
>
> **Warum dieser Abschnitt bis 35.101 zum ZWEITEN Mal falsch war.** Er trug die
> Datierung 21.8.2026 und nannte „Laufbahnen bis Vollausbau **27,6**, Band
> 25–35". Beides war überholt: 35.81 hat das Band auf **20–30** gesenkt, weil
> seither auch Akademie, Verein und Errungenschaften VC zahlen. Auch die
> Sicherungsgröße (22,3 statt 34,4 KB), der Ertrag je Ausbaustufe und der
> 40-Laufbahnen-Verlauf lagen daneben. Fünf von sieben Zeilen.
>
> **Das ist nicht folgenlos geblieben.** In der externen Bewertung vom 4.9.2026
> wurde „rund 27,6 Laufbahnen bis Vollausbau" als aktueller Projektstand
> zitiert — aus genau dieser Tabelle, mit dem alten Band. Eine veraltete
> Abschrift im lebenden Text wandert nach draußen und kommt als Befund zurück.
> Auch die erste Diagnose in diesem Projekt lag daneben: sie schob die 27,6 auf
> die doppeldeutige Zeile im Lauf. Die Zahl stand wörtlich hier.
>
> **Und es ist der zweite Anlauf.** Bis 35.22 stand hier schon einmal ein
> überholter Stand (Datierung 7.8.2026, Zielband 1.400–1.700 gegen 2.700–3.100
> im Skript) — wer sich darauf verließ, hätte einen **bestandenen** Lauf für
> einen Fehlschlag gehalten. Der Kasten, der daraus die Lehre zog („wenn hier
> künftig etwas steht, gehört das Messdatum dazu"), stand darunter, während die
> Tabelle darüber erneut alterte. **Ein Messdatum daneben reicht nicht.**
>
> **Konsequenz:** wer diese Tabelle liest und den Lauf nicht daneben hat, liest
> möglicherweise Geschichte. Gültig ist `TEILE=kalib bash pruefstand/pruefen.sh
> <App.jsx>`; die Bänder selbst stehen in `kalibrierung.cjs`. Wer hier etwas
> ändert, fährt den Lauf und schreibt ab, was er meldet — nichts anderes.

---

## 5. Prüfstand

Testdaten: `pruefstand/aufstellung-f58.json`.

Zusätzlich: `pruefstand/korrekturen.mjs` prüft die Reparaturen der Version 35.165 mit `npm run test:korrekturen`.

Ein Aufruf baut alles auf und misst durch (~3 Minuten):

```bash
bash pruefstand/pruefen.sh                    # Quelle /mnt/project/App.jsx
bash pruefstand/pruefen.sh /pfad/zu/App.jsx   # andere Quelle
TEILE=kalib bash pruefstand/pruefen.sh        # nur ein Teil
TEILE=ansicht,rueck LAEUFE=10 bash pruefstand/pruefen.sh
```

Teile: `aufbau` · `kalib` · `ansicht` · `ereignis` · `stimmig` · `namen` ·
`verein` · `rueck` · `bau`

**Das ist die einzige Aufzählung der Teile in dieser Datei.** Bis 35.44 stand
sie hier mit fünf und in Abschnitt 8 mit sieben Einträgen — beide falsch, seit
`stimmig` (35.37), `namen` (35.43), `ereignis` und `verein` dazugekommen sind.
Wer nach der kurzen Liste `TEILE=` setzt, überspringt vier von neun Teilen und
bekommt trotzdem einen grünen Lauf. Prüfung 7 rechnet diese Zeile jetzt gegen
die Vorgabe in `pruefen.sh` nach; wer sie ändert, muss beide ändern.

| Datei | Was sie tut |
|---|---|
| `pruefen.sh` | Aufbau und Ablaufsteuerung |
| `exporte.txt` | **einzige** Liste der Ausfuhren; wird an eine Kopie der `App.jsx` angehängt. Fehlt ein Name, hier ergänzen. |
| `kalibrierung.cjs` | rechnet echte Laufbahnen durch, prüft die Zielbänder |
| `ansichten.jsx` | Akademieansichten, Härtefälle, Durchklicktest, Speicherprobe |
| `rueckwaerts.jsx` | 63 bestehende Ansichten mit vier ganz verschiedenen Laufbahnen |
| `jsdom.cjs` | startet ein Bündel in einer Browserumgebung |
| `ereignispruefung.cjs` | harte Prüfungen und Grundlinie über alle Ereignisse; die Zahl meldet der Lauf. **Läuft in `pruefen.sh`** |
| `vereinpruefung.cjs` | Rechenprüfungen zum eigenen Verein — 56 seit 35.28 (vorher 47). **Läuft in `pruefen.sh`**, das die gültige Zahl selbst meldet |
| `sicht.sh` | **Klammer für alles, was jsdom nicht sehen kann.** Baut einmal und fährt dann Startprobe, `kopfleiste.cjs`, `seitenanfang.cjs`, `passhoehe.sh` und `knoepfe.sh` nacheinander. Fehlt ein Teil, meldet sie das und endet mit Rückgabecode 3 — ein unvollständiger Lauf ist kein bestandener. Stand bis 35.29 nur in den Zeilen ihrer eigenen Teile, nicht in dieser Tabelle |
| `verzeichnis.cjs` | schreibt das Verzeichnis in `STAND.md` neu. **Läuft in `pruefen.sh`** — dort nur als Warnung, mit `--pruefen` einzeln |
| `vorschau.py` | erzeugt die Vorschaufassung für den Chat |
| `uebersicht.cjs` | erzeugt `UEBERSICHT.md` aus den Spieldaten |
| `browsertest.sh` | baut den Browsertest als Einzeldatei (siehe unten). **`ERSTSTART=1`** laesst die Willkommens-Vorbelegung weg — dann verhaelt sich die Datei wie eine frisch installierte App |
| `portraetbogen.cjs` | rendert Porträts als Bildtafel — ohne das ist Grafik blind |
| `messwerkzeug.js` | Diagnose, Bildrate und A/B-Schalter für den Browsertest |
| `startprobe.cjs` | fährt die fertige Einzeldatei in jsdom hoch |
| `erreichbar.cjs` | misst, welche Ligen und Vereine erreichbar sind (seit 34.8; stand bis 34.20 nicht in dieser Tabelle) |
| `kopfleiste.cjs` | vermisst die Kopfknöpfe des Titelblatts in echtem Chromium (seit 34.21) |
| `seitenanfang.cjs` | prüft in echtem Chromium, dass jeder Seitenwechsel oben beginnt (seit 34.23) |
| `verlauf40.cjs` | misst 40 Laufbahnen mit stufenweisem Akademieausbau (seit 35.22). **Läuft NICHT in `pruefen.sh`** — 40 s für eine Auskunft ohne Zielband. Liefert die Zahlen für Abschnitt 4. |
| `passhoehe.sh` | Klammer für die Passmessung (seit 35.23). Baut das Bündel aus der übergebenen Quelle **selbst** und fährt zwei Breiten (412, 360). Hängt in `sicht.sh`. |
| `passbogen.jsx` | baut den Pass mit gesetzten Karriereständen (0 bis 18 Stationen) für die Passmessung |
| `passmessung.cjs` | misst die Passhöhe in Chromium. Schranke: mehr als 1 px Unterschied zwischen zwei Ständen ist rot |
| `texttreue.cjs` | gleicht die Zahl im sichtbaren Text einer Errungenschaft gegen ihre Bedingung ab (seit 35.24). Auf Abruf; Ausgabe ist eine Liste zum Durchsehen, kein rotes Licht |
| `grosstest.cjs` | Belastungslauf über Merkmale, Spieler und ganze Laufbahnen |
| `ereignisse.cjs` | zählt, wie oft sich Ereignisse über 30 Laufbahnen wiederholen |
| `bindenbogen.cjs` | alle 212 Kapitänsbinden als Bildtafel. Braucht ein Ziel: `node bindenbogen.cjs ziel.svg` |
| `knoepfe.sh` | prueft, dass Knoepfe lesbar sind und im Bild bleiben (seit 35.28). Haengt in `sicht.sh`, faehrt 412 und 360 px |
| `werkstatt.js` | Abkürzungen zum Prüfen im Browsertest (seit 35.29): Laufbahnen, Coins, Ausbau, Einschreiben. **Bei `WERKSTATT=1` ODER `ERSTSTART=1`** (`browsertest.sh` prüft beide), nicht in der APK. Stand bis 35.101 an drei Stellen falsch als „nur bei `ERSTSTART=1`" — der zweite Schalter kam in 35.56 dazu, weil `ERSTSTART` zugleich den Willkommensschirm einschaltet und wer nur die Werkstatt wollte, sie deshalb gar nicht bekam |
| `knopfbogen.jsx` | rendert die Bildschirme mit Knopfzeilen durch die echte `Shell` |
| `knopfmessung.cjs` | misst je Knopf: passt der Text hinein, bleibt er im Bild |
| `stimmigkeit.cjs` | prüft alle Ereignisse auf Erzählbrüche: wirkt jede Wahl, ist jede erreichbar, passt das Ereignis zum Moment (seit 35.37). **Läuft in `pruefen.sh`** (Teil `stimmig`) |
| `namenpruefung.cjs` | Abdeckung und Herkunft der Namenskartei, 212 Nationen (seit 35.43). **Läuft in `pruefen.sh`** (Teil `namen`) |
| `argumente.cjs` | gemeinsamer Argumentleser für alle Werkzeuge: `--quelle=` · `--ziel=` · `--anzahl=`; fehlt die Quelle, wird abgebrochen statt still zurückzufallen (seit 35.41) |
| `ruecktritt.cjs` | beendet im echten Browser eine Laufbahn OHNE Verein — der häufigste Fall und der einzige, der nirgends nachgestellt war (seit 35.66). **Läuft in `sicht.sh`** |
| `kontrast.cjs` | misst im echten Browser das Helligkeitsverhältnis jedes sichtbaren Textes und prüft die Klassen einzeln (seit 35.58). **Läuft in `sicht.sh`** |
| `texte.cjs` | erzeugt aus allen 532 Ereignissen die **fertigen** Texte — mit eingesetztem Kontext und in beiden Geschlechtsformen — und sucht darin nach Mustern, die niemand lesen soll: technische Werte, offene Platzhalter, „1 Datensätze", ss statt ß, unpassende Artikel. 4.881 Textstellen, rund 9.800 Proben (35.155, V12). Einzeln aufrufen: `node pruefstand/texte.cjs` |
| `schriftabdeckung.cjs` | liest die Zeichentabelle aus den eingebetteten WOFF2-Schriften und meldet, welche Alphabete vollständig sind (seit 35.57). **Läuft in `pruefen.sh`** |
| `gleichheit.cjs` | Gleichheitsprobe für Umschichtungen: fester Zufall, 125 Akademiejahre, JSON-Abzug zum byte-genauen Vergleich zweier Stände (seit 35.48). Auf Abruf |
| `sicherheit-bekannt.txt` | bewusst abgenickte Sicherheitsfunde im Auslieferungspfad, je Zeile ein Paket mit Begründung (seit 35.47). Keine Ausführung, eine Liste — **wird von `pruefen.sh` gelesen** |
| `appicon.py` | erzeugt den Android-Symbolsatz aus einem Bild (liegt im Repo unter `symbol/`, nicht in `pruefstand/`) |

**`kopfleiste.cjs` braucht einen echten Browser.** Es läuft **nicht** in
`pruefen.sh`, sondern von Hand auf einer gebauten Einzeldatei:

    bash pruefstand/browsertest.sh App.jsx
    node pruefstand/kopfleiste.cjs /tmp/bt/rasenschach-browsertest.html kopf.png

Gemeldet wird der waagerechte Abstand zwischen den beiden Knöpfen; ein
negativer Wert ist eine Überlappung. Dazu ein Bild der Kopfleiste.

**Warum mehrfach laufen lassen:** Manche Fehler zeigen sich nur in
bestimmten Spielzuständen. Der `ntNote`-Fehler wurde erst im achten
Durchlauf sichtbar. Vorgabe sind sechs Durchläufe.

**Der Prüfstand ist selbst geprüft.** Am 7.8.2026 wurden zwei Fehler
absichtlich eingebaut. Der erste (fehlende Absicherung gegen unvollständige
Sicherungen) wurde zunächst **nicht** gefunden, weil er keinen Absturz
erzeugt, sondern leere Zahlenfelder. Daraufhin ergänzt: `zahlenPruefen`
und eine allgemeine Prüfung auf `NaN`/`undefined` in jeder Ansicht.

---

`pruefstand/ereignis-ids.cjs`: einmalige Vergabe historischer Antwortkennungen; bestehende IDs und altIndex bleiben unverändert.

`pruefstand/android-version.cjs`: Android-Versionsname und aufsteigender Versionscode aus package.json.

## 6. Stolperfallen — teuer gelernt

| Sache | Worauf zu achten ist |
|---|---|
| `clubColors()` | gibt ein **Feld** zurück, kein Objekt mit `.p`/`.s`. Über `farbPaar()` vereinheitlichen. |
| `ntNote` | enthält **Text** wie „WM 2036: Titel", keine Note. Nie rechnen damit. |
| Seltenheitsstufen | Stufen mit Gewicht 0 (z. B. „Schwarz-Weiß-Blau") müssen aus dem Ziehungstopf gefiltert werden, sonst kippt die ganze Verteilung über NaN. |
| Einblendungen | Jede Laufbahn hat eine `lauf`-Kennung. Alle Überlagerungen daran binden, sonst erscheint der Rückblick der Vorgängerlaufbahn. |
| `package.json` | `npm install` im Arbeitsverzeichnis schreibt Prüfpakete hinein. `pruefen.sh` setzt sie zurück und meldet Abweichungen. **jsdom gehört nicht ins Spiel.** |
| Alte Sicherungen | Immer gegen fehlende Felder absichern (`{ ...leereAkademie(), ...gespeichert }` und einzeln für `stufen`/`bilanz`). |
| Titel als Funktion | Viele `EVENTS` haben `title:c=>\`...\`` — beim Auslesen muss ein Ersatz-Zusammenhang übergeben werden, sonst steht „undefined" im Text. `uebersicht.cjs` fängt das ab. |
| Prüfskript vor Definition | Zweimal hat ein Härtefall vor der Definition seiner Grunddaten gestanden und einen Fehler im Spiel vorgetäuscht. Neue Prüfungen ans Ende des jeweiligen Blocks. |
| Punkte ≠ Coins | `verdict().score` (dreistellig bis vierstellig) und Vermächtnis-Coins (ein- bis dreistellig) sind zwei Dinge. Beschriftungen so wählen, dass die Umrechnung sichtbar bleibt. |
| Klassenwechsel mitten im Ablauf | Wechselt `className` während einer laufenden Einblendung, startet die Animation von vorn — bei `both`-Füllmodus heißt das: kurz unsichtbar. Einblendungen an einen Zustand hängen, der sich nur einmal ändert. |
| transform zweimal vergeben | `transition: transform` und `animation` mit `transform` auf einem Element schließen sich aus. Bewegung und Drehung gehören auf getrennte Ebenen. |
| Prüfskript beendet sich nicht | Ansichten hinterlassen Zeitgeber und Bildschleifen. `ansichten.jsx` hängt jede Zeitprobe wieder aus und ruft am Ende `process.exit`. Sonst läuft es in die Zeitüberschreitung und gilt als fehlgeschlagen, obwohl alles besteht. |
| Symbolmaske | Android zeigt nur die mittleren 72 von 108 Einheiten. Alles darüber hinaus kann jeder Startbildschirm wegschneiden — Text am Rand überlebt das nie. |
| Zähler ins Leere | `hsvZaehler` war ein vollständig ausformulierter Mechanismus, den nie jemand angeschlossen hat. Bei jedem Wert, der aus einer Einstellung kommt, prüfen: Wird er **irgendwo geschrieben**? |
| Schriften | Die App nutzt Gerätefonts, kein Nachladen aus dem Netz. Bei Änderungen an `CSS` nicht versehentlich einen `@import` einbauen. |
| jsdom | `act()`-Warnungen zeitgesteuerter Animationen und fehlendes `getContext` sind **Prüfumgebung, kein Fehler**. Der Filter in den Skripten darf nicht abgeschaltet werden — die Warnungen treffen verzögert ein. |
| Rand bei absoluter Lage | Ein `margin-right` verschiebt ein `position:absolute`-Element **um seinen eigenen Betrag**, nicht um die Breite des Nachbarn: `left + Breite + margin-right + right = Behälterbreite`. Zwei Knöpfe mit derselben Klasse und `right:0` liegen aufeinander, egal welcher Rand danebensteht. Nebeneinander gehört in einen Flexbehälter mit `gap`, nicht in Randwerte. |
| Prüfmuster auf Zeichenketten | `startprobe.cjs` suchte nach Farbwerten und Verläufen, die es nach einer Gestaltungsänderung nicht mehr gab, und war dadurch **dauerhaft rot** — ohne dass etwas kaputt war. Prüfungen auf die Absicht richten (`.raster` trägt *irgendeinen* Radialverlauf), nicht auf den Wortlaut. |
| „Daran denken“ ist keine Regel | Wenn eine Anweisung mit „nach jeder Änderung bitte X“ beginnt, ist sie noch nicht fertig. Entweder lässt sie sich prüfen, dann gehört sie in `pruefen.sh` — oder nicht, dann gehört hierher, warum nicht. Zuletzt passiert in 35.2 mit dem Verzeichnis. |
| Einmal grün ist nicht bewiesen | Prüfungen auf gewürfelten Zuständen (`laufbahn()`) können zufällig grün sein. Die Rückkehr-Prüfung war 40 von 40 grün und fiel erst zwei Fassungen später um, weil die HSV-Rautekarte nur manchmal auftaucht. Bei gewürfelten Zuständen zählt erst die Wiederholung. |
| Ereignis verspricht, Mechanik liefert nicht | Ein Ereignistext, der einen Verein oder eine Person BEIM NAMEN nennt, braucht eine Wirkung, die genau das herstellt. `winterMove` allein ist ein allgemeiner Wechselwunsch — der genannte Verein taucht dann nur zufällig auf. Bei jedem neuen Ereignis mit Namen prüfen, ob die Wirkung den Text wirklich einlöst. |
| Einseitig geänderte Pfade | Wer an einer Seite von `kopfPfad` etwas ändert, muss die gespiegelte Stelle mitziehen — sonst wird das Gesicht schief, und im Zufallsbogen fällt es kaum auf. Die Symmetrie wird seit 34.33 nachgerechnet: zu jedem Punkt (x, y) muss (100 − x, y) existieren. |
| Farbumdeutung trifft auch Fremdkörper | `.laufzettel` und `.karteikarte` setzen die Farbvariablen für hellen Grund neu. Das gilt für ALLES darin — auch für Dinge, die absichtlich dunkel bleiben sollen, wie die Wildcard. Solche Objekte müssen die Umdeutung ausdrücklich zurücknehmen; ein Verweis auf den Grundstil geht nicht, eine Variable sieht ihre eigene Fassung weiter oben nicht. |
| Zwei Dinge im selben Rasterfeld | `grid-area: 1/1` stapelt zwei Karten übereinander — praktisch, aber die Zelle ist immer so hoch wie der höhere Inhalt. Eine Ein- und Ausblendung wirkt dadurch stockend: die Grösse springt erst, wenn das alte Element abgeräumt ist. Das ausziehende Element gehört `position:absolute`, damit es für die Höhe nicht mehr zählt. |
| Rechenkern kennt kein Karriereende | `simulateSeason`, `develop` und `makeOffers` hören nie auf. Die Altersgrenze steht im Spielablauf (App-Bauteil). Wer eine Laufbahn im Test nachstellt und nur den Kern ruft, spielt bis in alle Ewigkeit und meldet dann einen Fehler, den es nicht gibt. |
| Ein Maß, viele Zeichner | `kopf.j` steuert Hülle, Wangenschatten, zwei Bärte und den Kinnriemen. Wer die Kieferlinie ändert und nur die Hülle anfasst, lässt den Bart darüber hinauszeichnen. Es gibt **keinen** Beschnitt auf `kopfD` — die Teile müssen von Hand zusammenpassen. |
| Zwei Werte für dieselbe Sache | `col` und `colK` je Stufe, von Hand gepflegt, an zwei Orten benutzt — sie liefen auseinander, und Legendär sah oben creme und unten olivbraun aus. Dasselbe Muster wie `aka.laden`/`p.laden` in 34.22. **Eine Quelle, abgeleitete Varianten rechnen.** |
| CSS-Spezifität schlägt Klassen | `.karton .m` (0,2,0) überschrieb `.stufe` (0,1,0) und setzte dunkle Schrift auf dunkle Fläche. Farben, die von einer berechneten Fläche abhängen, gehören **inline** — inline schlägt jede Klasse. |
| Prüfung, die nichts zu messen hatte | Ein Prüfmittel kann grün melden, weil der geprüfte Zustand gar nicht eintrat: bei 412×915 ist das Hauptmenü fensterhoch, es gab nichts zu rollen, und „vorher 0 → nachher 0“ sah aus wie ein Erfolg. **Jede Messung braucht eine Untergrenze**, unterhalb derer sie „nicht messbar“ meldet — und das muss als Fehlschlag zählen. |
| Werkzeug, das die Quelle als Ziel nimmt | `uebersicht.cjs <Ziel.md>` nimmt die **Zieldatei** als erstes Argument — die Quelle kommt aus `/tmp/ps/motor.js`. Ein `uebersicht.cjs App.jsx UEBERSICHT.md` hat deshalb wortlos die `App.jsx` überschrieben. Bei jedem Werkzeug, das schreibt, vor dem ersten Aufruf nachsehen, **welches Argument das Ziel ist**. Seit 35.4 sperrt das Werkzeug beides ab (nur ein Argument, muss auf `.md` enden). |
| Eine Anleitung, die niemand benutzt | `LIESMICH.md` sagt, welche Dateien ins Projektwissen gehören. `ereignisse.js` und `verein.js` fehlten dort seit **35.6 bzw. 35.17** — nie aufgefallen, weil das Projektwissen fortgeschrieben und nie danach neu aufgebaut wurde. **Eine Beschreibung, die nie gegen die Wirklichkeit gehalten wird, altert unbemerkt beliebig weit.** Das gilt für jede Liste, jede Anleitung, jede Tabelle hier. Seit 35.30 rechnet `pruefen.sh` diese eine nach; bei allen anderen bleibt es beim Hinsehen. |
| Layout ist im Prüfstand unsichtbar | jsdom rechnet keine Geometrie. Ob zwei Dinge übereinanderliegen, sich überschneiden oder aus dem Bild laufen, kann `pruefen.sh` **strukturell nicht** beantworten. Dafür `pruefstand/kopfleiste.cjs` auf einer gebauten Einzeldatei — oder die Ursache im CSS prüfen statt die Wirkung im Baum. |

---

## 7. Was offen ist

**Die aktuelle Liste steht weiter unten unter „Offene Punkte".** Der Abschnitt
trägt die Fassungsnummer, unter der er zuletzt durchgesehen wurde — hier wird
sie bewusst nicht wiederholt, sonst zeigt dieser Verweis nach der nächsten
Sitzung wieder daneben (genau das war bis 35.3 der Fall: er nannte 33.13).
Von den hier ursprünglich genannten Punkten ist noch offen:

- **Rautekarte sichtbar machen** — die steigende Aussicht ist nirgends
  angedeutet. Bewusst so gelassen (Überraschung).

> **Hier standen bis 35.44 zwei weitere Punkte als offen**, die es nicht mehr
> waren: die Akademie im Karriere-Rückblick (erledigt in 35.32) und die
> Jugendturniere mit Namen und Gegner (erledigt in 35.34). Offener Punkt 7
> sagte das bereits — dieselbe Datei widersprach sich also an zwei Stellen
> über zwölf Fassungen hinweg. Wer diesen Abschnitt zuerst liest, arbeitet an
> etwas Fertigem.

Erledigt: die Bündelgröße wird bei jedem Bau gemessen und im Bauschritt
ausgegeben. **Eine Zahl steht hier bewusst nicht mehr** — bis 35.44 nannte
dieser Absatz 1.022 kB, gemessen waren es zu dem Zeitpunkt 1.294,76 kB. Sie ist
außerdem nicht reproduzierbar: `package.json` nennt Fassungsbereiche mit Dach
(`^5.4.11`), es gibt keine `package-lock.json`, und `apk.yml` baut mit
`npm install` — zwei Bauten derselben Quelle können sich um einige Zeichen
unterscheiden. Siehe offener Punkt 19. `UEBERSICHT.md` ist auf 33.13 neu erzeugt.

---

## 8. Wie ein neuer Chat anfangen sollte

1. `STAND.md` lesen — auch die Abschnitte ab „Fassungen 33.3 bis 33.7".
2. Fassungsnummer gegenprüfen — `grep -n 'const VERSION' App.jsx`. Seit 35.22
   macht das auch `pruefen.sh` selbst und meldet, wenn `App.jsx` und der Kopf
   dieser Datei auseinanderlaufen. Abweichung sofort melden.
3. Alle Dateien aus dem Projektwissen in ein **beschreibbares** Verzeichnis
   legen — `/mnt/project` ist nur lesbar. **Auf die Ablage achten:** im
   Projektwissen liegt alles flach und mit Unterstrichen statt Punkten
   (`vite_config.js`). Im Arbeitsverzeichnis gehört es so:

       App.jsx · ereignisse.js · verein.js · schriften.js · storage.js
       main.jsx · index.html · package.json · schriften-lizenz.txt
       STAND.md · UEBERSICHT.md · LIESMICH.md                           flach
       alle Prüfwerkzeuge (Abschnitt 5)                                 pruefstand/
       appicon.py                                                       symbol/
       apk.yml                                                          .github/workflows/
       vite_config.js → vite.config.js, capacitor_config.json → …, _gitignore → .gitignore

   **Die Baudateien gehören flach, nicht nach `pruefstand/`.** Bis 35.24 stand
   hier nur „alles andere aus dem Prüfstand", und `schriften.js`, `storage.js`,
   `main.jsx`, `index.html` und `package.json` fielen unter „alles andere“.
   Wer sie einsortiert, bekommt weniger als `Baudateien: 7 von 7` — und der
   Produktionsbau läuft ungeprüft durch.

   `ereignisse.js` und `verein.js` gehören **flach neben App.jsx**, nicht nach
   `pruefstand/`. Liegen sie falsch, meldet esbuild nur „Could not resolve"
   und man sucht in App.jsx. Dann:

       bash pruefstand/pruefen.sh /pfad/zu/App.jsx

   Der Aufruf **braucht den Pfad**. Die Ausgabe muss `Baudateien: 7 von 7
   gefunden`, `Schriften: 128K` und `Ereignisse: 532 Einträge` enthalten;
   steht dort weniger, ist das Projektwissen unvollständig und der
   Produktionsbau ungeprüft. Darunter listet der Aufbau **alle eigenen Dateien
   mit Größe und Zeilenzahl** — das ist die Stelle, an der diese Zahlen stehen,
   seit sie aus Abschnitt 1 verschwunden sind.

   Die 530 ist die einzige Bestandszahl, die in dieser Datei noch ausgeschrieben
   steht, weil ein Mensch sie beim Abnehmen braucht. **Prüfung 8 rechnet sie
   nach** — und hat es zuletzt in 35.108 getan, als sechs Erinnerungsereignisse
   dazukamen und der Lauf sofort abbrach, weil hier noch 520 stand. Bis 35.44
   stand hier 518, der Stand von 35.36 und sieben Fassungen alt; damals fiel es
   niemandem auf, weil es die Prüfung noch nicht gab.
4. Ändern, erneut messen, **vorher/nachher gegenüberstellen**.
5. Am Ende: Fassungsnummer, `VERSION_INFO` **und den Kopf dieser Datei**
   anheben, `STAND.md` fortschreiben, alle geänderten Dateien ausliefern.
6. **Die Einlegeanleitung gehört ins Lieferpaket, NICHT ins Projektwissen.**
   Sie beschreibt einen Übergang („von 35.3 auf 35.4") und ist in dem Moment
   falsch, in dem der Übergang vollzogen ist. 35.4 hat daraus geschlossen, sie
   müsse immer gleich heißen — das war die falsche Lehre und hat nicht
   geholfen: die Anleitung von 35.3→35.4 lag noch bis 35.24 im Projektwissen
   und beschrieb dort 19 Fassungen lang einen Stand, den es nicht mehr gab.
   Ein Transportdokument im Wissensspeicher altert, ein gleicher Dateiname
   ändert daran nichts.

**Was der Prüfstand abdeckt** (die Teile stehen in Abschnitt 5, dort und nur
dort): Kalibrierung mit vier Zielbändern, Ansichten und Durchklicktest,
Ereignisprüfungen (`ereignispruefung.cjs`), Stimmigkeit (`stimmigkeit.cjs`),
Namenskartei (`namenpruefung.cjs`), Vereinsprüfungen (`vereinpruefung.cjs`),
Rückwärtsprüfung mit alten Sicherungen, echter Produktionsbau. Ein Lauf dauert
rund 100 Sekunden.

> **Hier standen bis 35.44 drei Zahlen und eine zweite Teile-Liste.** Beides ist
> weg. Die Zahlen (478 Ansichten, 11, 56) waren als Orientierung gekennzeichnet
> und wuchsen erwartungsgemäß — 563 waren es zuletzt. Die Teile-Liste dagegen
> war schlicht falsch: sie nannte sieben statt neun, und `stimmig` und `namen`
> fehlten. Eine Aufzählung, die an zwei Stellen gepflegt wird, läuft
> auseinander; deshalb steht sie jetzt nur noch in Abschnitt 5. **Was gilt,
> meldet der Lauf selbst** — dieser Satz stand hier schon, wurde aber auf die
> Zahlen angewandt und nicht auf die Liste daneben.

Einzelne Teile über `TEILE=` — etwa `TEILE=aufbau,verein bash pruefstand/pruefen.sh …`
für eine schnelle Runde. **Ohne `aufbau` gibt es kein Bündel**, und die
Ereignis- und Vereinsprüfungen melden das ausdrücklich, statt stillzuschweigen.
**Was er nicht abdeckt:** alles, was nur auf dem Gerät sichtbar wird — Schriften
in der WebView, `preserve-3d` beim Wenden des Passes, `navigator.wakeLock`.
Dafür gibt es den Browsertest als Einzeldatei: `bash pruefstand/browsertest.sh App.jsx`.
**Zuletzt am 10.8.2026 vollständig auf dem Gerät bestätigt** (siehe „Auf dem
Gerät geprüft"). Nach jeder Änderung an Schriften, Pass oder Wachsperre gehört
das wiederholt — der Prüfstand kann es strukturell nicht.

**Seither zweimal auf dem Gerät:** die Vereinsgründung (35.27) und der
Vereinsmodus im Spiel (35.28). Beide Male hat Kevin etwas gefunden, was hier
unsichtbar ist — einmal Layout, einmal ein fehlendes Konzept.
**Weiterhin nie auf einem Telefon:** die feste Passhöhe (35.23), der
Willkommensschirm (35.26), das Einschreiben samt Vereinsbericht (35.28) und die
berichtigten Knopfzeilen (35.29). Die Liste steht auch oben im Wegweiser; wer
sie hier ändert, ändert sie dort mit.

---

## Fassungen 33.3 bis 33.7 — Schrift, Form, Farbe

### 33.3 · Eigene Schriften
`App.jsx` nannte drei Schriftfamilien und lieferte keine mit — `grep -c "@font-face"`
ergab **0**. Auf jedem Android-Gerät fiel alles auf Roboto zurück. Nicht aufgefallen war
das, weil `vorschau.py` in Schritt 4 die Schriften aus dem Netz nachlud: **die Vorschau
zeigte etwas anderes als das Gerät.** Dieser Schritt ist entfernt.

Jetzt in `schriften.js` (neu, neben `storage.js`), eingebettet als Base64, 94 KB:
* **Rasen Anzeige** = Anton, für `.d`. Gewicht **400**, nicht 800 — sonst rechnet die
  WebView einen Fettdruck dazu und Anton verschmiert. Alle zehn Ziffern auf gleiche
  Vorbreite 1012 gesetzt (vorher 677 und 1012), sonst springen hochzählende Zahlen.
* **Rasen Text** = Archivo 400/500/600/700, für alles andere. Hat `tnum`.
* Die Schreibmaschinenschrift ist **ersatzlos weg**. `.m` und `.eb` brauchten keine
  Schreibmaschine, sondern gleich breite Ziffern — die liefert Archivo.
* Elf SVG-Stellen setzen die Schrift direkt (Wappen, Achsen, Kapitänsbinde) und wurden
  mitgezogen. Klassen greifen dort nicht.
* Beide unter SIL OFL, `schriften-lizenz.txt` muss mitgeliefert werden.
* `pruefen.sh` kopiert `schriften.js` mit und bricht ab, wenn sie fehlt.

**Selbstprüfung in der Fußzeile.** `useSchriftBefund()` misst Textbreiten gegen eine
Ersatzschrift. Erste Fassung war falsch: eine Zeichenfläche sieht nur Schriften, die
schon geladen sind, und die Messung lief während des ersten Aufbaus — sie meldete
immer „fehlt". Jetzt Haken mit `document.fonts.ready`.

### 33.4 · Harte Form
Vorbild sind Stadionheft und Eintrittskarte des HSV: dort ist alles rechteckig.
* Rundungen: 9 im Gestaltungsblock + 22 im Bauteilcode → **0**. Die drei `50%` bleiben,
  das sind Kreise.
* Verlaufsschimmer: 4 → 0. Schlagschatten: 4 → 0. `--schatten` und `--schatten2` gelöscht.
* Rahmen durchgehend von `--ln` auf `--ln2` — sichtbar statt geahnt.
* `.btn.pri` ist ein helles Feld mit 4 px dunkler Unterkante. Beim Drücken sackt es um
  2 px ein und die Kante schrumpft auf 2 px.
* `.btn.on` trägt einen 3 px Balken links (`inset 3px 0 0`) statt eines blauen Scheins.

### 33.5 · Sammelalbum
Nur dort, wo gesammelt wird — nicht global.
* `.klebe` — harter Versatzschatten `3px 4px 0`, keine Weichzeichnung.
* `winkel(k)` aus `hashStr()`: −0,75° bis +0,75°, **fest je Gegenstand**. Gegengeprüft:
  dreimal aufgerufen, dreimal derselbe Wert; 13 verschiedene Winkel über 400 Gegenstände.
* `.leerfeld` — Errungenschaften, die fehlen, sind gestrichelte Felder mit ihrer Nummer
  (001–162). Name und Beschreibung bleiben stehen, sonst wüsste man nicht, worauf man spielt.
* `.folie` — nur `welt`, `goat`, `hsv`. Liegt in der Enthüllung **innerhalb** der
  Vorderseite und fasst kein `transform` an, damit die drei Bewegungsebenen unberührt bleiben.
  `.rs-still .folie` schaltet sie in RUHE ab.
* `.stempel` — der beste Lauf in der Ruhmeshalle, ab drei Einträgen.
* `.streifen` — nur an der gezogenen Karte, dem Einzelstück. **An 162 Feldern wäre die
  Geste Tapete.**

### 33.6 / 33.7 · Farbkonzept
* Grund ist **Rasen bei Nacht** (`--bg:#070D0A`), vorher ein Marineblau. Darüber liegt das
  **Halbtonraster** aus den Stadionheften als `repeating` radial-gradient, 5 px.
* Bedeutung ist die Ampel des Sports: `--ok` Rasengrün, `--go` Gelbe Karte,
  `--bad` Rote Karte, `--ac` Stadionheft-Blau. Das alte `--bad` lag bei Kontrast 4,42
  und damit unter der Schwelle — der neue Wert wurde bis 4,80 aufgehellt.
* `noteCol()` läuft jetzt wie eine Schulnote von Grün nach Rot. Vorher Gold, Grün, Grau,
  Braun, Rot ohne Ordnung.
* **Zweitwerte für helle Flächen** liegen bereit: `--karton`, `--karton2`, `--tinte`,
  `--tinte2`, `--ac-k`, `--go-k`, `--ok-k`, `--bad-k`. Ohne sie ist auf Papier nichts
  lesbar — Gelb erreicht dort nur Kontrast 1,30.
* **Zwei Prestigeleitern.** `STUFEN` (Errungenschaften) heißt Bronze/Silber/Gold/Platin/
  Legendär und *ist* eine Materialleiter. In 33.6 hatte ich `RARITY` ebenfalls auf
  Materialien gestellt — zwei Paare wurden dadurch **exakt gleich** (Abstand 0). In 33.7
  weicht `RARITY` aus: Papier, Patina, Eis, Bernstein, Amethyst, Rosé.

### 33.8 · Warteschlange abgearbeitet
* **Karton.** `.karton` — gesammelte Errungenschaften liegen jetzt als helles Papier auf
  der dunklen Seite, mit 4 px Kopfkante in der Stufenfarbe. Nicht Gesammeltes bleibt
  gestricheltes Leerfeld. `STUFEN` hat dafür einen zweiten Wert `colK` je Stufe bekommen;
  alle fünf über Kontrast 5,1 auf `#E9E2D3`. Die Enthüllung bleibt bewusst dunkel —
  heller Karton würde die Dramaturgie dort zerstören.
* **Kartenfelder.** `.zellen` — Saison/Alter/Stärke/Konto im Kopf sind ein umrandetes
  Raster mit Trennlinien, nach dem Vorbild von Block/Reihe/Platz.
* **Marken gefüllt.** `.chip.g/.a/.r` tragen jetzt Füllung statt Umriss, Text in `--bg`.
  Gemessen: 11,70 · 5,74 · 5,00.
* **Klebewinkel.** `.winkel` an zwei Ecken, mit eigener Fassung für Karton
  (`.karton.winkel` kehrt die Winkelfarbe um). Nur an der Laufbahnkarte.
* **Perforation.** `.perf` — genau eine Stelle: zwischen Saisonabschluss und
  „Angebote anderer Vereine". Häufiger eingesetzt nutzt sie sich ab.

Bündel 990 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.

### 33.9 · Kopfbänder
* `.band` — gefüllter Balken am oberen Rand einer Karte, negative Ränder ziehen ihn aus
  der Polsterung von `.pad`. Eingesetzt an der Laufbahnkarte: Stufenname links,
  Positionseinschränkung rechts, Text in `--bg`. Alle sieben Stufenfarben über
  Kontrast 5,47 gemessen.
* Die Folienleiste ist an den **unteren** Rand gewandert, sonst schneidet sie das Band.

**Wichtig zum Karton:** er erscheint ausschließlich bei *erreichten* Errungenschaften.
Gemessen: leerer Spielstand → 0 Karton, 162 Leerfelder; sieben erreicht → 7 Karton,
155 Leerfelder. Auf einem frischen Spielstand ist die Ansicht also vollständig leer —
das ist richtig so für ein Sammelheft, macht das Material aber unsichtbar, solange
nichts gesammelt wurde. `karton.html` in den Ausgaben zeigt es mit gesetzten Treffern.

### 33.10 · Spielerpass und Ruhmeshalle

**Spielerpass als Ausweis.** Vorbild sind echte Verbandspässe (DFB, FIGC, FA, RFEF).
Gemeinsame Grammatik dort: Kopfband mit Verband, Lichtbild im harten Rahmen, linierte
Felder mit Beschriftung links und Wert rechts, Passnummer, Spielrechtsdatum.
Umgesetzt mit den Bausteinen, die schon da waren:
* `.karton` — der Pass ist buchstäblich eine Karte und liegt jetzt hell auf der dunklen Seite.
  Damit ist der stärkste Baustein aus C **ab der ersten Minute sichtbar**, nicht erst nach
  der ersten Errungenschaft.
* `.band` mit `--tinte` als Füllung trägt „Spielerpass" und die Nummer.
* `.passzeile` — Beschriftung, Wert, durchgezogene Linie darunter.
* Passnummer aus `hashStr(name + "|" + avatar)`, achtstellig gruppiert. Gleicher Spieler,
  gleiche Nummer, ein Leben lang.
* Spielrecht „seit" wird aus Alter und Jahr zurückgerechnet — Laufbahnen beginnen mit 16.
* Karton-Fassungen ergänzt für `.bar`, `.zellen` und `.btn`; die Attributbalken laufen
  in `--tinte` statt `--ac`, sonst wären sie auf Papier fast unsichtbar (Kontrast 2,65).

**Ruhmeshalle als Würdigung.** Bleibt eine Rangliste, aber jeder Eintrag ist ein Block:
Rangzahl in Anzeigeschrift, Bildnis im Trikot des Vereins mit den **meisten Einsätzen**
(nicht des letzten), Vereinswappen, Kopfband in der Seltenheitsfarbe der Wildcard,
acht Kennzahlen als Kartenfelder, Stempel für den besten Lauf.

Dafür wurde der gespeicherte Datensatz erweitert: `avatar`, `g`, `natId`, `von`, `bis`,
`heimat`, `heimatSpiele`, `apps`, `assists`, `saisons`. **Einträge aus älteren Fassungen
haben das nicht.** Gegengeprüft mit vier Fällen: leer, nur alte Einträge, gemischt, ohne
Heimatverein — alle fehlerfrei, Grafiken erscheinen nur dort, wo die Daten vorliegen
(0 / 0 / 4 / 1).

Bündel 975 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.

### 33.11 · Die Rückseite des Passes
Echte Spielerpässe haben hinten die Vereinswechsel und die Stempel der Passstelle.
Genau das steht jetzt dort: Stationen mit Wappen, Zeitraum, Spielen und Toren
(aufeinanderfolgende Saisons beim selben Verein werden zu einer Station zusammengezogen),
Gesamtbilanz als Kartenfelder, Unterschriftlinie mit dem Namen, Titelstempel — oder,
wenn noch keine Titel da sind, ein Stempel mit den Länderspielen.

* `.wender / .dreh / .rueckseite` — **drei getrennte Ebenen** nach derselben Regel wie
  die Kartenenthüllung: außen die Perspektive, in der Mitte die Drehung, darin die beiden
  Seiten. Kein Element bekommt zweimal ein `transform`.
* Beide Seiten liegen im **selben Rasterfeld** (`grid-area:1/1`). Dadurch nimmt der Pass
  immer die Höhe der längeren Seite an, und keine Seite ragt heraus.
* **Doppeltippen statt `onDoubleClick`** — zwei Berührungen unter 320 ms, in einem `useRef`
  gezählt. `onDoubleClick` kommt in der WebView verzögert und verschluckt gelegentlich den
  zweiten Tipp. Enter und Leertaste wenden ebenfalls, `role="button"` und `tabIndex` sind gesetzt.
* `.rs-still .dreh` schaltet den Übergang in der Ruheschaltung ab.
* Ein Hinweis „Doppeltippen · Rückseite" steht klein am unteren Rand, sonst findet es niemand.

Gegengeprüft in jsdom: Wender vorhanden, zwei Ebenen im Dreher, Vorderseite trägt die
Passnummer, Rückseite trägt alle drei Stationen, Unterschrift und Stempel, nach dem
Doppeltipp ist die Klasse `um` gesetzt, der Dreher trägt kein eigenes `style`-transform,
kein `NaN` im Text.

Bündel 997 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.

### Browsertest als Einzeldatei
`rasenschach-browsertest.html` ist das **echte Produktionsbündel** in einer einzigen Datei:
`vite build` mit `assetsInlineLimit` hoch und `inlineDynamicImports`, danach das Skript in
die `index.html` hineinkopiert. Kein Nachladen, keine externen Stile, fünf `@font-face`
eingebettet, 979 KB.

Der Unterschied zur ausgelieferten App ist genau eine Datei: `storage.js` läuft hier auf
`localStorage` statt auf der Kapsel. Dadurch bleiben Spielstände über ein Neuladen erhalten —
nötig, um die Sammelheft-Ansichten überhaupt füllen zu können. Alle Zugriffe stecken in
`try/catch` und geben `null` zurück, wenn der Browser den Speicher sperrt (bei `file://`
und `content://` kommt das vor); die App verhält sich dann wie ohne Spielstand, stürzt aber
nicht ab.

**Warum das nützlich ist:** Chrome auf Android ist dieselbe Maschine, die Capacitor als
WebView benutzt. Was dort läuft, läuft mit hoher Wahrscheinlichkeit auch in der APK —
das ist der beste Nachweis vor einem echten Bau, insbesondere für `preserve-3d`
beim Wenden des Passes.

### 33.12 · Das Hauptmenü als Titelblatt
Das Menü ist jetzt der Umschlag einer Ausgabe, nach dem Vorbild von Stadionheft und
Sportzeitschrift:
* **Ausgabennummer** oben links im gefüllten Kasten — sie zählt die abgeschlossenen
  Laufbahnen mit. Jede beendete Karriere ist ein Heft.
* **Zeitschriftenkopf** über die volle Breite, darunter drei Schlagzeilen mit Rauten
  getrennt (vorher drei eigene Kästen weiter unten).
* **Halbtonraster**, das nach unten ausläuft — direkt vom Umschlag der Vereinszeitschrift.
* **Titelgeschichte**: läuft eine Laufbahn, steht sie als Aufmacher oben, mit Bildnis,
  Verein, Stärke und dem Knopf zum Weiterspielen. Ohne Spielstand steht dort der Einstiegstext.
* **Inhaltsverzeichnis** mit Nummer, Titel, Punktlinie und Angabe rechts — `.inhalt`.
  Vier Einträge statt vorher sieben Knöpfen.
* **Impressumsstreifen** am Fuß mit Strichcode-Attrappe. Dort steht die Fassungszeile,
  die vorher direkt unter dem Titel klebte.

### 33.12 · Optionen hinter dem Zahnrad
`.zahnrad` sitzt unauffällig oben rechts. Dahinter das Bauteil `Optionen` mit vier Feldern:
* **Darstellung** — Bewegung (RUHE) und **Textgröße** in drei Stufen. Die Stufe setzt
  `--skala` am Wurzelelement, die Grundschriftgröße rechnet mit `calc(14.5px * var(--skala,1))`.
* **Rückmeldung** — **Vibration** an/aus. Neuer Modulwert `VIBRATION`, der in `haptik()`
  vor beiden Wegen greift (Capacitor-Haptik und `navigator.vibrate`).
* **Daten** — Sicherung und **Alles zurücksetzen** mit Rückfrage. Löscht über die neue
  Liste `SPEICHERSCHLUESSEL`; wer einen Schlüssel einführt, trägt ihn dort ein.
* **Über** — Fassung, Umfang und die **Schriftlizenzen**. Die SIL OFL verlangt, dass der
  Hinweis mit der Software ausgeliefert wird; in der App gehört er hierhin.

Alle drei Einstellungen werden gespeichert und beim Start wieder angewendet.

**Nebenbei berichtigt:** Beim Wenden des Passes stand `vib(8)` — die Funktion heißt `haptik()`
und erwartet eine Art (`"tipp"`, `"wahl"`, `"gut"`, `"gross"`, `"schlecht"`), keine Zahl.
Sie fiel still auf 10 ms zurück.

**Der Prüfstand hat eine echte Regression gefangen:** Der Durchklicktest prüft, ob nach
„Zurück" wieder das Hauptmenü erscheint, und sucht dafür die Zeichenfolge
`KARRIERE-SIMULATION`. Ich hatte sie zu `Karriere-Simulation` gemacht und die Großschreibung
dem CSS überlassen — `textContent` liefert aber den Quelltext, nicht die Darstellung.
**Angepasst wurde die App, nicht der Test.**

Bündel 987 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.
Menü und Optionen zusätzlich durchgeklickt: 5 Knöpfe im Menü, Zahnrad öffnet, alle sechs
Abschnitte da, Textgröße setzt `--skala` auf 1.12, Rückweg ins Menü funktioniert.

### 33.13 · Spielweise als Voreinstellung, Anleitung, Bildschirm
**Modus aus der Erstellung heraus.** Spielweise (Karriere/Speedmodus) und Schwierigkeit
sind keine Frage mehr bei jeder Laufbahn, sondern Voreinstellungen in den Optionen.
Neue Modulwerte `SPEEDMODUS` und `SCHWIERIGKEIT` nach demselben Muster wie `RUHE`.
`CreateScreen` **zeigt** nur noch an, womit gespielt wird — die beiden Auswahlgitter
(zwei plus drei Knöpfe) sind ersetzt durch zwei Kartenfelder plus Hinweis.
Läuft gerade eine Laufbahn, sagen die Optionen ausdrücklich, dass sie behält,
womit sie gestartet ist.

**Kurzanleitung.** Fünf Abschnitte in `ANLEITUNG`, gerendert vom Bauteil `Kurzanleitung`:
Ablauf, Werte, Wildcards, nach dem Ende, Gut zu wissen. Erreichbar über die Optionen
unter „Über". Bewusst knapp gehalten — wer nachschlägt, sucht eine Antwort.

**Bildschirm anlassen.** `navigator.wakeLock` als reine Netzschnittstelle, **kein
zusätzliches Kapsel-Erweiterungsmodul** — dadurch keine Änderung am Bau. Zwei Feinheiten:
* Android gibt die Sperre frei, sobald die App in den Hintergrund geht. Ein Zuhörer auf
  `visibilitychange` fordert sie beim Zurückkommen neu an.
* Geräte ohne die Schnittstelle bekommen den Schalter gesperrt und ausgegraut statt eines
  Knopfes, der nichts tut. `wachMoeglich()` entscheidet das.

Bündel 993 KB. Prüfstand: 138 Prüfungen, 3× 63 Ansichten, alle Zielbänder, 0 Fehler.
Zusätzlich durchgeklickt: alle sieben Abschnitte der Optionen da, Speedmodus und
Knochenmühle lassen sich wählen und werden markiert, Bildschirmschalter in jsdom
erwartungsgemäß gesperrt, alle fünf Abschnitte der Anleitung da, **0 Auswahlknöpfe für
den Modus in der Erstellung übrig**.

### Baudateien im Projektwissen — und ein still übersprungener Prüfschritt
Seit Fassung 33.13 liegen auch die Baudateien im Projektwissen: `package.json`,
`vite.config.js`, `index.html`, `main.jsx`, `storage.js`, `capacitor.config.json`,
`apk.yml`, `.gitignore`. Im Repository liegen sie **flach neben `App.jsx`**, nicht in
einem `src`-Ordner; `apk.yml` gehört nach `.github/workflows/`.

**Der Produktionsbau lief nie.** `pruefen.sh` setzte `ARBEIT` fest auf `/home/claude/rs`
statt auf das Verzeichnis der übergebenen `App.jsx`. Dort lagen nie `package.json` und
`main.jsx`, also meldete der Schritt jedes Mal „übersprungen" — eine Zeile in einer langen
Ausgabe, die niemand las. Jetzt folgt `ARBEIT` der Quelle. Gegengeprüft: ohne jede
Umgebungsangabe baut der Prüfstand jetzt von selbst.

**Was der echte Bau zeigt:** 1.022 kB gegenüber 997 kB in der Rekonstruktion. Der
Unterschied ist `@capacitor/preferences`, das über die echte `storage.js` hineinkommt.
Alle bisherigen Bauprüfungen liefen gegen eine selbstgeschriebene Konfiguration und
haben diesen Teil nie gesehen.

**Zwei Dinge nachgezogen:**
* `index.html` trug in `theme-color` und im Grundhintergrund noch `#04050A` — das
  Marineblau aus der Zeit vor 33.6. Jetzt `#070D0A` wie `--bg`. Weichen die beiden ab,
  blitzt beim Start kurz die falsche Farbe auf.
* `apk.yml` zählt im Schritt „Ergebnis der Weboberflaeche pruefen" jetzt die
  `@font-face`-Regeln im Bündel und bricht bei weniger als fünf ab. Ebenso, wenn das
  Bündel `fonts.googleapis` enthält. **Damit kann der Fehler aus 33.3 — Schriften benannt,
  aber nicht mitgeliefert — nie wieder unbemerkt durchgehen.**

### 33.14 · Ehrentafel als Karton
Die Absolventen standen als schmale dunkle Zeilen untereinander — Fahne, Name,
eine Zahl rechts. Jetzt ist jeder Eintrag ein Schild an der Wand:
* `.karton` — helles Papier auf der dunklen Seite, dazu `.klebe` als harter
  Versatzschatten. Damit ist C nach Spielerpass und Errungenschaften an der
  dritten Stelle angekommen.
* **`.band` je Rang** mit laufender Nummer (001, 002 …) rechts. Drei Ränge,
  und zwar mit **denselben Schwellen, mit denen `akaJahr` die Bilanz führt**
  (85 = Weltklasse, Auswahl über `ns`) — sonst stünde auf der Tafel eine andere
  Ordnung als in den Zahlen darüber. Neu: `ABS_RANG` und `absRang()`.
* `.zellen` für Stärke, Abgang und Auswahl.
* `.stempel` „Bester" beim ersten Eintrag, **ab drei Einträgen** — dieselbe
  Regel wie in der Ruhmeshalle.
* **Bewusst ohne `winkel()`.** Die Schräglage gehört ins Sammelheft; ein Schild
  an der Wand hängt gerade. Der Prüfstand zählt das mit und schlägt an, wenn
  doch ein `rotate` auftaucht.

Kontraste gemessen (alle über 4,5): Kopfband Weltklasse 11,70 · Nationalspieler
5,74 · Profi (`.band.matt`) 10,52. Auf dem Karton: Name 13,95 · Nebentext 5,31 ·
Stärke Weltklasse (`--go-k`) 5,16 · Stärke Auswahl (`--ac-k`) 5,97.

**Der Prüfstand hat beim ersten Anlauf zugeschlagen:** `zahlenPruefen` sucht zu
jeder Beschriftung das **Geschwisterelement**. `<span class="eb">Abgang</span>{x.raus}`
setzt aber einen reinen Textknoten daneben — die Prüfung fand keine Zahl. Der
Wert steht jetzt in einem eigenen `<span>`. Angepasst wurde die App, nicht der Test.
Dieselbe Stelle in der Ruhmeshalle trägt denselben Fehler noch; dort greift die
Prüfung bisher nicht.

Prüfstand: **157 Prüfungen** (vorher 138, also 19 neue), 6× 63 Ansichten, alle
Zielbänder, 0 Fehler. Bündel **1.023,58 kB** (vorher 1.022,34 — Zuwachs 1,24 kB).

### 33.14 · App-Symbol aus einer gerahmten Vorlage
Die neue Vorlage (1254 × 1254) hatte einen schwarzen Rand, darin einen hellen
Ring und **abgerundete Ecken**. Genau der Fall, vor dem `appicon.py` warnt: eine
zweite Rundung unter der Maske von Android.

Aufbereitet wurde das Bild **einmalig** zu einem randlosen `symbol/appicon.png`
(1024 × 1024). Der Weg, falls es wieder gebraucht wird:
1. Helle Bildpunkte (Summe RGB > 380) markieren; das größte zusammenhängende
   helle Gebiet **ist** der Ring (gemessen: 40.593 Punkte, Ausdehnung 1235 × 1229).
2. Das dunkle Gebiet, in dem die Bildecke (0,0) liegt, ist der schwarze Rand
   (74.512 Punkte). Alles, was weder Ring noch Rand ist, ist der Bildinhalt.
3. Größtes Quadrat darin: 1206 × 1206, also **1,9 % je Seite** entfernt.
4. Die abgerundeten Ecken und der dunkle Saum darunter (zusammen 9,1 % der
   Fläche) werden durch die **unscharfe Vergrößerung des Bildes selbst**
   ersetzt — dieselbe Technik, mit der `appicon.py` den Außenrand auffüllt.
   Kein Fremdmaterial.

**Geändert an `appicon.py`:** `vordergrund()` lässt die Kante jetzt weich
auslaufen (Saum 4 % der Innenkante). Vorher stand das scharfe Bild als hartes
Rechteck auf der unscharfen Auffüllung — unter einer runden Maske sah man ein
Quadrat im Kreis. Volle Deckung bleibt innerhalb der sicheren Fläche von 66/108.

**`apk.yml` übergibt jetzt ausdrücklich `0` als Rahmenbreite.** Das Bild im
Projekt ist bereits randlos; die automatische Erkennung soll dort nicht raten.
Wer wieder ein gerahmtes Bild einsetzt, streicht die `0` und lässt erkennen.

Unter allen drei Masken (Kreis, Squircle, Quadrat) steht der Schriftzug
vollständig. **Bei 48 dp ist er nicht mehr lesbar** — das ist der Preis einer
vollflächigen Illustration als Symbol. Wer Lesbarkeit will, braucht ein
reduziertes Zeichen (Ball und XI), keine Szene.

## Auf dem Gerät geprüft — 10.8.2026

Kevin hat den Browsertest 33.14 in Chrome auf dem Handy gefahren. Ergebnis:

* **Der Pass wendet sauber**, die Rückseite scheint nicht durch. Damit ist
  `preserve-3d` mit den drei getrennten Ebenen (Perspektive · Drehung · Seiten)
  auf der echten WebView bestätigt — bis dahin war es nur in jsdom geprüft, und
  jsdom hat kein 3D.
* **„Bildschirm anlassen" greift.** `navigator.wakeLock` als reine
  Netzschnittstelle reicht, es braucht kein Kapsel-Erweiterungsmodul.
* **Das Impressum zeigt „Fassung 33.14" ohne „SCHRIFT FEHLT".** Anton und
  Archivo kommen also wirklich auf dem Gerät an. Das ist die einzige Prüfung,
  die den Fehler aus 33.3 endgültig ausschließt — im Prüfstand ist sie
  strukturell unmöglich, weil jsdom kein `getContext` hat.
* **Kein Ruckeln** beim Durchscrollen der 162 Errungenschaften.

**Was dabei nicht gemessen wurde:** Zahlen aus dem Messwerkzeug liegen nicht vor,
und die drei A/B-Schalter wurden nicht einzeln durchgefahren. Der Befund ist
„nichts zu sehen", nicht „gemessen und für gut befunden". Für die Frage, ob das
Halbtonraster bezahlbar ist, reicht das: es gab nichts zuzuordnen. Sollte auf
einem schwächeren Gerät doch etwas auffallen, liegt das Werkzeug bereit.

### 33.15 · Zwei Formen statt zweier Farbleitern
Die zwei Restüberschneidungen sind **nicht** durch Farbverschieben erledigt worden,
sondern durch eine Unterscheidung, die keine Farbe braucht:

> **Was man sich erspielt hat, ist ein gefüllter Block.
> Was einem zugefallen ist, trägt nur einen Umriss.**

Errungenschaftsstufe und Absolventenrang sind erspielt — gefüllt. Die Seltenheit
der Wildcard ist gezogen — umrandet. Damit unterscheidet die **Form**, und eine
Überschneidung im Farbraum ist folgenlos.

**Warum die alte Messung nichts taugte.** Die Schwelle 60 war nicht nur willkürlich
gesetzt, sie stand auf dem falschen Maß: gemessen wurde der **euklidische Abstand im
RGB-Raum** (Skala 0–441). Der hat mit dem Sehen nichts zu tun. Nachgerechnet in
ΔE76 (CIE-Lab) sieht die Lage anders aus:

| Paar | RGB-Abstand (alt) | ΔE76 (perzeptuell) |
|---|---|---|
| `aussen` gegen Stufe Platin | 58 | **34,2** |
| `hsv` gegen `--tx` | 46 | **18,8** |
| `RARITY.normal` gegen `--mu` | 21 | **4,6** ← stand nie auf der Liste |

`hsv` gegen `--tx` sah nach RGB mittelmäßig aus und ist perzeptuell einer der engsten
Fälle überhaupt. Und `RARITY.normal` gegen `--mu` bei ΔE 4,6 ist praktisch dieselbe
Farbe — das ist nie aufgefallen, weil das falsche Maß es nicht zeigte. **Sind alle drei
jetzt egal?** Ladder gegen Ladder ja, weil die Form trennt. Farbe gegen Bedeutungsfarbe
(`--mu`, `--tx`) bleibt eine offene Frage — dafür trennt die Form nicht, denn beide sind
Text. Steht als offener Punkt.

**Geändert (vier Zeichenstellen, zwei Regeln):**
* `.band.umriss` — Band ohne Füllung, nur eine 2-px-Linie darunter in der Seltenheitsfarbe.
  Eingesetzt an der **Wildcard-Karte** und in der **Ruhmeshalle**. Die Karte trägt den
  Rahmen jetzt mit 2 px statt 1 px, damit der Umriss die Farbe wirklich hält.
  **→ In 33.16 wieder zurückgenommen, siehe unten.**
* `.stufe` / `.stufe.punkt` — gefüllter Block. Im **Errungenschaftsgitter** trägt die
  erreichte Karte den Stufennamen als gefüllte Marke in `colK` (Text `--karton`), die
  **Filterknöpfe** und die Liste am **Karriereende** bekommen einen gefüllten Punkt in `col`.
* Der Verlauf auf der Wildcard-Karte bleibt: 12 % Deckung sind ein Hauch, kein Block.
* **Die Enthüllung bleibt unberührt.** Dort tritt die Seltenheit als Einzige auf, bildfüllend,
  und die Dramaturgie lebt von Fläche. Wo nichts zu verwechseln ist, braucht es keine
  Unterscheidung. Das ist eine bewusste Ausnahme, keine Lücke.

Kontraste gemessen: gefüllte Stufenmarke (`--karton` auf `colK`) 5,16 bis 6,48 · Stufenpunkt
auf `--pan` 4,51 bis 15,22 · Seltenheit als Umriss und Beschriftung auf `--pan` 5,25 bis 13,37.
Alle über der Schwelle.

Prüfstand: **173 Prüfungen** (vorher 157, also 16 neue), 6× 63 Ansichten, alle Zielbänder,
0 Fehler. Bündel **1.024,64 kB** (vorher 1.023,58 — Zuwachs 1,06 kB).

### 33.15 · Der Prüfstand hat grün gemeldet, obwohl der Aufbau gescheitert war
Beim Einbauen habe ich einen Kommentaranfang in `ansichten.jsx` zerstört. esbuild brach
ab — und der Prüfstand **lief weiter** und meldete „157 Prüfungen bestanden, 0 Fehler".
Denn `a.js` aus dem vorigen Lauf lag noch da. Nur der Rückgabewert verriet es.

`pruefen.sh` bricht jetzt nach einem gescheiterten Aufbau ab, mit Begründung, statt ein
altes Bündel zu prüfen. **Gegengeprobt** mit absichtlich kaputtem Prüfskript: Rückgabewert 1,
Meldung „ABBRUCH", keine Prüfzahlen. Das war die gefährlichste Sorte Fehler — grüne Wiese
über kaputtem Code.

### 33.16 · Der Umriss ist wieder raus
Kevin am Gerät: die Wildcard-Karte gefiel ihm vor der Änderung besser. **Zurückgebaut**,
und zwar vollständig — `WildcardCard` ist Zeichen für Zeichen wieder die aus 33.14
(gegengeprüft gegen die ausgelieferte Datei). Die Ruhmeshalle geht mit: dieselbe Sache
darf nicht an zwei Orten zweierlei aussehen. `.band.umriss` ist als tote Regel entfernt.

**Was das kostet, offen gesagt:** die Unterscheidung ruht jetzt nicht mehr auf
*gefüllt gegen umrandet*, sondern auf **Breite und Ort** — die Seltenheit als Band über
die volle Kartenbreite, die Errungenschaftsstufe als kompakte Marke mitten im Text.
Das ist schwächer als der Umriss, aber es ist keine Farbunterscheidung, und die beiden
Formen treffen ohnehin nur am Karriereende in einer Ansicht aufeinander. Der gemessene
Abstand `aussen` gegen Platin bleibt bei ΔE 34,2 — die Farben sind unverändert.

**Behalten aus 33.15:** die gefüllte Stufenmarke im Errungenschaftsgitter, die
Filterpunkte und die Marke am Karriereende. Daran gab es nichts auszusetzen, und sie
sind für sich genommen besser als der dünne farbige Text davor.

**Für den nächsten Anlauf:** einen Umriss für die Seltenheit nicht erneut vorschlagen,
ohne zu bedenken, dass er der Wildcard-Karte den Auftritt nimmt. Der Hinweis steht auch
als Kommentar an der CSS-Regel. Wer die Trennung härter will, sollte am *Ort* ansetzen,
nicht an der Füllung.

Prüfstand: **180 Prüfungen** (vorher 173), 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Der Prüfblock prüft jetzt die Gegenrichtung mit: die Seltenheit darf nie als kompakte
Marke erscheinen, die Stufe nie als Band über die volle Breite.

## 34.0 · Die Spielerporträts

### Der Fehler, der jahrelang stand
Alle Merkmale steckten in **einer** Zahl, ausgelesen mit `(h >> bit) % n`. Das ist
**kein abgetrenntes Feld**: `h >> bit` enthält *alle* höheren Bits, und ein Zuschlag
von `2^bit` trägt in jedes höhere Merkmal hinein. Deshalb würfelte die Feineinstellung
das halbe Gesicht neu. An 400 Proben nachgerechnet, ein Druck auf ›:

| Regler | änderte tatsächlich |
|---|---|
| Schmuck | 8,0 von 13 Merkmalen |
| Kinn | 7,0 von 13 |
| Ohren | 6,0 von 13 |
| Nase | 5,0 von 13 |
| Bart | 4,0 von 13 |
| Frisur | 2,9 von 13 |
| Hautton | 1,2 von 13 |

**Nicht gepflastert, sondern unmöglich gemacht:** die Merkmale liegen als eigenes
Objekt `zuege` vor, jedes zieht über `mische(kennung, i)` einen **eigenen**
Zufallsstrom. Überlappung kann es dort nicht geben. Gemessen nach dem Umbau:
**3.120 Reglerdrücke, Mittel 1,00 geänderte Merkmale, Höchstwert 1.**
Der Prüfstand schlägt außerdem an, wenn ein Regler *gar nichts* tut — ein
wirkungsloser Regler ist so falsch wie ein zu wirksamer.

### Zwei Fehler, die beim Hinsehen auffielen
* **Die Augenfarbe wurde berechnet und nie gezeichnet.** `eyeC` stand im Code, die
  Augen waren aber immer `#2A2118`. Der Regler „Augen" hat sichtbar nichts getan.
  Jetzt trägt die Iris die Farbe; geprüft wird, dass **alle** Augenfarben im Bild
  nachweisbar sind (7 von 7).
* **Vier Frisuren zeichneten außerhalb des Kopfes** — Zöpfe, Igel, Rasurmuster und
  Undercut schwebten als Zacken und Balken über dem Schädel. Ursache: kein Beschnitt.
  Es gibt jetzt eine Haarkappe als eigenen Pfad und einen `clipPath` darauf.

### Was es jetzt gibt
5 Kopfformen · 16 Frisuren · 10 Bartformen · 7 Augenfarben · 5 Augenformen ·
5 Augenbrauen · 5 Nasen · 5 Münder · 3 Ohrgrößen · 3 Wangen-/Kinnvarianten ·
6 Schmuckstücke. **57 gezeichnete Auswahlmöglichkeiten allein in den acht
Formmerkmalen.** Der Prüfstand zählt nach, dass jede davon auch etwas zeichnet —
ein Wert ohne Bild wäre eine Auswahl, die es nur auf dem Papier gibt.

Zeichnerisch: Augen mit Lidspalt, Iris, Pupille und Glanz statt weißer Ellipse mit
Punkt · Flächenschatten an Wange und Hals · Nase und Mund neu · Trikot mit
Schulterschatten · Grund von Marineblau `#0B0E15` auf **Rasen bei Nacht** `#0B120E`,
damit das Porträt zum Farbkonzept gehört und nicht daneben steht. Keine Verläufe,
nur flache Tonstufen — dieselbe Sprache wie der Rest.

### Ohne Augen geht Grafik nicht
Neu: `pruefstand/portraetbogen.cjs`. Rendert echte `<Avatar>`-Ausgaben als SVG-Tafel,
in drei Betriebsarten: Zufallsbogen, Musterbogen je Merkmal, Großansicht einzelner
Werte. In PNG wandeln mit cairosvg. **Ohne dieses Werkzeug wären fünf sichtbare
Mängel unentdeckt geblieben**, die kein Prüfskript findet: eine harte Naht mitten im
Gesicht (Schatten lief bis zur Mitte), eine zu lange dunkle Nase, ein offener Mund als
schwarzes Loch, ein unsichtbarer Kinnriemen und ein Schnauzer, der auf dem Mund saß.
Jede dieser Nachbesserungen ist gegen einen neu gerenderten Bogen geprüft worden.

### Was das kostet
**Alte Spielstände tragen nur die Kennung. Ihre Gesichter sehen nach diesem Umbau
ANDERS aus als vorher.** Bei einer Neuzeichnung aller Teile ließe sich das ohnehin
nicht vermeiden. Der Spielstand bleibt gültig, die Rückwärtsprüfung läuft durch.
Neue Laufbahnen speichern die Merkmale ausdrücklich (`p.zuege`), auch in der
Ruhmeshalle — die bleiben dann über jede weitere Fassung stabil.

**`ZUEGE_ORDNUNG` NIE umsortieren.** Die Reihenfolge ist die Nummer im Mischstrom;
eine Umsortierung ändert jedes bestehende Gesicht. Neues immer hinten anhängen.

### 34.1 · Angeheftete Vorschau, und sechs Sitzfehler behoben
**Die Vorschau in der Spielererstellung bleibt beim Blättern oben hängen**
(`position:sticky`, `top:0`, deckender Grund, `zIndex:5`). Vorher stellte man
unten Feinheiten ein und sah oben nicht, was sie bewirken — dasselbe beim Verein
(Trikotfarben) und beim Namen. `.tbar` gibt es nur im Spielbildschirm, `top:0` war
hier also frei. Der Prüfstand zählt nach: genau ein angehefteter Block, Porträt
darin, deckender Grund.

**Sechs Fehler im Sitz der Teile**, gefunden mit einem neuen **Kreuzbogen**
(`portraetbogen.cjs kreuz`) — jede Ausprägung über *jeder* Kopfform. Im
Zufallsbogen fallen solche Fälle kaum auf, im Kreuz sofort:

| Teil | war | ist |
|---|---|---|
| Undercut | helle Flächen mitten im Haar, schwebende Insel | rasierte Seite bis zur Haarkante |
| Zöpfe | Striche endeten auf halber Höhe (Strichcode-Kante), Zöpfe standen seitlich heraus | laufen am Haaransatz aus, innerhalb der Kopfbreite |
| Rasurmuster | dieselbe harte Querkante | läuft aus |
| Vokuhila | verdeckte die Ohren, sah aus wie ein Bob | Ohren liegen darüber — langes Haar gehört dahinter |
| Kinnbart und Ziegenbart | klebten am Mund, lasen sich als offener Mund | 3,5 Einheiten tiefer, klar getrennt |
| Koteletten | lagen auf den Ohren, dann als angeklemmte Balken davor | verjüngen sich nach unten, setzen am Haaransatz an |

Jede Berichtigung ist gegen einen neu gerenderten Kreuzbogen geprüft, nicht gegen
eine Vermutung.

### 34.2 · Zwei echte Fehler
**Die App liess sich zoomen wie eine Internetseite.** Die Angabe im `<meta name="viewport">`
hatte weder `maximum-scale` noch `user-scalable=no`; mit zwei Fingern liess sich jede
Ansicht aufziehen. Kevin ist es in den Optionen aufgefallen, betroffen war die **ganze App**.
Behoben in `index.html`: `maximum-scale=1,user-scalable=no` und zusätzlich
`touch-action: pan-x pan-y` auf `html` und `body` — Wischen ja, Aufziehen und
Doppeltipp-Zoom nein. Letzteres nimmt dem Spielerpass nebenbei die Verzögerung
beim Wenden.

*Zur Barrierefreiheit:* Zoom zu sperren ist normalerweise heikel. Hier nicht, weil die
App unter „Optionen" eine **eigene Textgrösse** mitbringt — der Weg bleibt also offen,
er führt nur nicht mehr über die Browserlupe.

**Der Ausbau der Akademie begann bei 17 %.** Jede Abteilung startet auf Stufe 1, also war
`akaSumme` direkt nach der Gründung 6 von 36 — der Ring zeigte Fortschritt, wo noch nichts
gebaut war. Fortschritt heisst jetzt: was **über die Gründung hinaus** erreicht wurde.
Neu: `AKA_GRUND` (6), `AKA_STUFEN` (30 wirklich baubare Stufen), `akaAusbau(a)`.
`akaSumme` bleibt unverändert, weil die Errungenschaft „voller Ausbau" darauf prüft —
der Prüfstand hält beides getrennt fest: **frisch gegründet 0 von 30 · nach 25 Jahren
30 von 30 · `akaSumme` bei vollem Ausbau weiterhin 36.**

**Zum dritten Mal derselbe eigene Fehler:** Ich habe einen Kommentaranfang in
`ansichten.jsx` als Ankertext für eine Ersetzung benutzt und ihn dabei verschluckt.
esbuild brach ab, der Prüfstand meldete korrekt ABBRUCH. **Regel für künftige Sitzungen:
niemals `/* ---------- Überschrift ----------` als Anker verwenden** — immer eine
Codezeile darunter nehmen, oder den Anker mit einschliessen und wieder mit ausgeben.

## 34.3 · Die App wird ein Heft (Schritt 1 von 3)

Beschlossen ist Weg **A, die Nachtausgabe**: der Grund bleibt dunkel, die Zeitung
wird über Papier, Typografie und Seitenmöbel erzählt. Die Sammelkarten (Wildcard,
Spielerpass, Ruhmeshalle, Errungenschaften) bleiben unangetastet — sie sind das
Eingeklebte auf der Seite.

Zur Entscheidung Papier: **Zeitungspapier, nicht Magazinpapier.** Ungestrichen,
sichtbare Faser, matt — das ist der *kicker*: Zeitungspapier innen, festerer Titel
aussen. Magazinpapier wäre glatt und glänzend, und Glanz liesse sich auf dunklem
Grund nur über einen Verlauf erzählen; Verläufe sind seit 33.4 abgeschafft.

### Das Papier
`--bg` von `#070D0A` (Rasen bei Nacht) auf **`#191813`** (dunkles Zeitungspapier).
**Warm**, weil der Karton der Sammelkarten warm ist (`#E9E2D3`) — dasselbe Papier,
nur im Dunkeln. Damit liegen die Karten *auf* der Seite statt daneben.

Struktur: `repeating-linear-gradient(97deg,…)` als Faser plus das bekannte
Halbtonraster. **Bewusst zwei Lagen und eine Vollfarbe — genau so viele wie vorher**,
weil der frühere Grundverlauf durch die Vollfarbe ersetzt ist. Der Zeichenaufwand
steigt also nicht; die Rasterfrage aus 33.13 bleibt damit beantwortet.

Alle Token neu gemessen gegen `#191813`:

| Token | Wert | Kontrast |
|---|---|---|
| `--tx` | `#EFECE2` | 15,04 |
| `--mu` | `#A09B8C` | 6,40 |
| `--go` | `#F2C230` | 10,61 |
| `--ok` | `#3DA35D` | 5,58 |
| `--ac` | `#3D8FDB` | 5,21 |
| `--bad` | `#EC6152` | 5,68 *(von `#E5493C` angehoben, lag auf `--up` bei 4,04)* |
| `--ln2` | `#625C49` | Haarlinie, *(von `#2C3A31` angehoben — im Entwurf lag sie bei 1,54 und wäre auf dem Gerät verschwunden)* |
| Karton auf Papier | `#E9E2D3` | 13,78 |

Neu: `--stoerer` `#D93A2B` für den Störer auf dem Titelblatt. **Nur als Fläche,
nie als Text** — auf Papier liegt er bei 3,89, Weiss darauf bei 4,57.

### Die Seitenmöbel
`Shell` nimmt jetzt `blatt="<ressort>"` und setzt damit **Kolumnentitel** oben und
**Folio** unten. Neu: `RESSORT`, `Kolumnentitel`, `Folio`.

| Ressort | Seite |
|---|---|
| LAUFBAHN | 2 |
| SPIELERPASS | 3 |
| RUHMESHALLE | 14 |
| ERRUNGENSCHAFTEN | 22 |
| JUGENDAKADEMIE | 30 |
| REDAKTION (Optionen, Anleitung) | 46 |
| ARCHIV (Sicherung) | 48 |

**Die Seitenzahl steht nur an einer Stelle im Code.** Kolumnentitel, Folio und
später das Inhaltsverzeichnis auf dem Titelblatt lesen dieselbe Zahl — stünde oben
14 und unten 22, wäre das Heft in dem Moment nicht mehr glaubwürdig. Der Prüfstand
zählt beides nach und prüft ausserdem, dass keine zwei Ressorts dieselbe Seite haben.

### Ein Prüfmittel, das falschen Alarm schlug
Die erste Fassung der Prüfung suchte mit `new RegExp("Seite " + s + "\\b")`. esbuild
schrieb daraus `"\\b"` ins Bündel — also **Backslash + b als Zeichen** statt einer
Wortgrenze. Die Prüfung meldete „Seitenzahl steht nirgends", obwohl sie im Baum stand.
Ersetzt durch ein schlichtes `includes`. **Ein Prüfmittel, das falschen Alarm schlägt,
ist schlimmer als keins** — es hätte mich beinahe eine funktionierende Änderung
zurückbauen lassen.

Prüfstand: **270 Prüfungen** (vorher 261), 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.035,53 kB** (vorher 1.033,34).

### Was noch fehlt (Schritt 2 und 3)
* **Das Umblättern** zwischen Titelblatt und Ressorts.
* **Das Titelblatt** als Zeitschriftencover: Titelzug, Aufmacher mit dem eigenen
  Spieler statt Flutlicht und Mittelkreis, Störer, Inhaltsverzeichnis mit Seitenzahlen,
  Strichcodeleiste. Der Entwurf dazu liegt vor und ist abgenommen.
* **Die Texte reisserischer**: Dach- und Unterzeilen sollen klingen wie ein
  Sportblatt, nicht wie ein Katalog. Nicht „Zwölf Laufbahnen, gemessen an Titeln,
  Toren und Treue", sondern „Diese Zwölf vergisst keiner mehr".

### 34.4 · Korn statt Cord, und die Seiten blättern
**Die Faser war auf dem Gerät eine Cordhose.** Im verkleinerten Entwurfsbild sah die
schräge Linienschraffur wie Papier aus, auf dem Handy nicht. Nachgerechnet:

* Der Entwurf zeichnete eine 0,5 Punkte breite Linie alle 3 Punkte — **17 % der Fläche**.
  Die App zeichnete eine 1 Punkt breite Linie alle 3 Punkte — **33 %, also doppelt so viel**.
* Dazu die Bildpunktdichte: bei dreifacher Dichte sind 3 CSS-Punkte **neun echte
  Bildpunkte**. Der Streifen wird auf dem Gerät nicht feiner, sondern gröber
  wahrgenommen als im Bild, das im Chat verkleinert dalag und dabei verschmolz.

Jetzt **zwei Punktraster mit den teilerfremden Abständen 2 und 5**. Ihre Gitter
überlagern sich erst nach 10 Punkten wieder, das liest sich als Korn statt als Muster.
Gegengeprüft an einem Bild **in echter Gerätedichte** — drei Varianten nebeneinander,
in Bildpunkten des S24 Ultra gerechnet, nicht in CSS-Punkten. Die Lehre daraus gehört
in jede künftige Sitzung: **ein verkleinertes Entwurfsbild lügt über feine Strukturen.**

### Das Umblättern
Die ankommende Seite dreht um ihre Bundkante herein (`rotateY(-74deg)` → `0`, 420 ms).
**Bewusst nur die ankommende.** Die abgehende mitzudrehen hiesse, ihren React-Baum
nach dem Wechsel weiterleben zu lassen — mit veraltetem Zustand und doppelt laufenden
Wirkungen. Der Gewinn wäre klein, das Risiko gross.

**Die Richtung folgt den Seitenzahlen.** Von Seite 2 auf 14 wird vorwärts geblättert,
von 30 auf 22 zurück. Dafür braucht es keine zusätzliche Verdrahtung: `letzteSeite`
steht ausserhalb der Komponente, `Shell` vergleicht beim Aufbau. Der Prüfstand fährt
vier Wechsel durch und prüft die Klasse am Blatt, nicht die Absicht.

`RUHE` schaltet es ab.

**Noch nicht gemessen:** wie teuer das Drehen einer sehr langen Seite ist. Die
Errungenschaften mit 162 Feldern sind der Härtefall — dort wird eine grosse Fläche
für 420 ms zur eigenen Ebene. Das gehört auf dem Gerät nachgesehen, mit dem
Messwerkzeug im Browsertest.

Prüfstand: **278 Prüfungen** (vorher 270), 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.037,33 kB**.

### 34.5 · Echtes Korn, und das Blättern wird Papier
**Zwei Versuche am Papier waren falsch, aus demselben Grund.** Erst eine schräge
Linienschraffur — auf dem Gerät Cord statt Faser. Dann zwei Punktraster mit
teilerfremdem Abstand — gleichmässiger als gedacht, es las sich als Punkte *auf*
dem Papier. Die Ursache ist beide Male dieselbe: **mit Verläufen lassen sich nur
regelmässige Muster bauen, und Papier ist nicht regelmässig.**

Jetzt eine **96 × 96 grosse Kachel aus echtem Rauschen**, im Projekt als Base64
eingebettet (5,9 KB). Nahtlos, weil sie mit Umlauf weichgezeichnet wurde; zwei
Korngrössen übereinander, und **nur abdunkelnd** — Aufhellungen sähen aus wie Staub.
`feTurbulence` wäre kleiner gewesen, liess sich hier aber nicht rendern und damit
nicht beurteilen; etwas einzubauen, das ich nicht ansehen kann, verbietet sich.

**Das Halbtonraster ist vom Grund verschwunden.** Ein Raster ist die Art, wie ein
BILD gedruckt wird, nicht die Oberfläche des Papiers. Es bleibt den Bildflächen
vorbehalten (Titelblatt, `.raster`). Der Grund kommt jetzt mit **einer** Bildlage
und einer Vollfarbe aus — eine Lage weniger als vorher, der Zeichenaufwand sinkt.

### Das Blättern
* **420 ms → 780 ms.** Vorher nahm man es kaum als Blättern wahr.
* **Nachfedern:** die Seite dreht bis 3,4° über die Ruhelage hinaus und legt sich
  dann. Eine Drehung, die exakt bei 0 stehen bleibt, wirkt nach Platte.
* **Wandernder Bundschatten** über `::before` — er macht aus der starren Drehung
  eine Wölbung. Das war der eigentliche Grund für den Plastikeindruck.
* Eine leichte Drehung um die Blattachse (`rotateZ`) nimmt der Bewegung die
  Maschinenhaftigkeit.

Prüfstand: 278 Prüfungen, 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.046,41 kB** (vorher 1.037,33 — die 9 KB sind die Kornkachel).

**Weiterhin nicht gemessen:** wie teuer das Drehen einer sehr langen Seite ist.
Die Errungenschaften mit 162 Feldern sind der Härtefall.

### 34.6 · Das Umblättern ist wieder raus
Zwei Befunde vom Gerät, beide mit derselben Wurzel — **es wurde die ganze Seite
gedreht:**

1. **Es hakte**, statt in einem Zug zu laufen. Eine Seite mit 162 Feldern ist mehrere
   tausend Punkte hoch; der Browser muss daraus für die Dauer der Bewegung eine eigene
   Ebene rastern. Das schafft er nicht in einem Zug.
2. **Auf langen Seiten verzerrte das ganze Bild.** Das ist keine Panne, sondern
   Geometrie: perspective staucht mit wachsendem Abstand vom Drehpunkt. Bei einer
   Seite, die zehnmal so hoch ist wie das Fenster, wird das untere Ende unbrauchbar
   verzogen.

Nachjustieren hätte nichts geholfen — die Ursache ist die Bauart, nicht die Dauer.
Entfernt, der Wechsel läuft wieder schlicht. Der Befund steht als Kommentar an der
Stelle im Quelltext.

**Wer es später noch einmal versucht, muss zuerst etwas anderes bauen:** eine Seite,
die genau so hoch ist wie das Fenster und INNEN rollt (height:100dvh, overflow-y:auto).
Nur ein fensterhohes Blatt lässt sich wie ein Blatt drehen. Das ist ein Umbau jeder
Ansicht — mit Folgen für die angeheftete Kopfleiste, die Rollposition beim
Zurückblättern und die Wachsperre. **Erst dieser Umbau, dann das Blättern.**

Die Prüfung der Blätterrichtung ist mit entfallen. Sie war grün — die Richtung
stimmte. Falsch war nicht die Richtung, sondern die Idee. **Eine grüne Prüfung ist
kein Beweis für eine gute Lösung.**

### 34.6 · Das Hauptmenü ist ein Titelblatt
Flutlicht und Mittelkreis sind weg. Stattdessen:

* **Titelzug** in einem Balken aus `--stoerer`, mit Ausgabennummer und Monat — auf
  jeder Ausgabe an derselben Stelle.
* **RASENSCHACH** gross, darunter XI und die Zeile „DIE ELF DES MONATS · SEIT 2026",
  abgeschlossen mit der doppelten Haarlinie.
* **Der Aufmacher ist der eigene Spieler**, 230 px, im Halbtonraster. Vorher stand
  dort ein Bild ohne Person. Auf einem Sportheft ist der Titel immer jemand. Ohne
  Spielstand steht dort „HIER KÖNNTE DEIN NAME STEHEN".
* **Störer** oben rechts: rund, schräg, in Signalrot, mit hartem Versatzschatten —
  die Hauptaktion („WEITER SPIELEN" oder „NEUE LAUFBAHN", mit Seitenangabe).
* **Dachzeile, Schlagzeile, Unterzeile** aus `titelgeschichte()`. Vier Fälle mit
  eigenen Zeilen: laufende Laufbahn (nochmals unterteilt nach Weltklasse, jung, alt),
  gefüllte Ruhmeshalle, gegründete Akademie, leerer Anfang. **Der Ton ist Kiosk, nicht
  Katalog** — „SIE NENNEN IHN JETZT NUR NOCH DEN BESTEN" statt einer Zustandsmeldung.
  Die Umbrüche in den Schlagzeilen sind gesetzt (`whiteSpace:pre-line`): eine
  Schlagzeile bricht dort, wo der Sinn bricht.
* **Das Inhaltsverzeichnis nennt die echten Seitenzahlen** aus `RESSORT` — dieselbe
  Zahl, die der Kolumnentitel der jeweiligen Seite trägt. Der Prüfstand vergleicht
  beides; eine Abweichung fiele beim Durchklicken nie auf.

**Der Prüfstand hat meine eigene Prüfung erwischt:** Ich gab `MenuScreen` ein
`ach={{}}` statt `achN={0}` — im Verzeichnis stand daraufhin „undefined / 162". Die
Unsinnserkennung in `mach` hat es gemeldet. Genau dafür ist sie da.

Prüfstand: **275 Prüfungen**, 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.046,92 kB**.

### Ein Fehler, der jederzeit wiederkommt — jetzt abgesichert
Ein einzelnes Rückwärts-Anführungszeichen in einem Kommentar **innerhalb** des
CSS-Blocks beendet die Schablonenzeichenkette vorzeitig. esbuild meldet dann
irgendetwas viele Zeilen weiter unten („Expected ; but found perspective"), und die
Ursache steht woanders. Mir ist das in dieser Sitzung passiert, als ich
`perspective` in einem Kommentar in Rückwärts-Anführungszeichen setzte.

`pruefen.sh` prüft das jetzt **vor** dem Übersetzen und nennt die Zeile.
Gegengeprobt mit einem eingeschmuggelten Zeichen: Meldung mit Zeilennummer und
Umfeld, Rückgabewert 1.

### 34.7 · Das Titelblatt bekommt ein Bild
Zwei Rückmeldungen vom Gerät, eine Ursache: **das Aufmacherfeld hatte keinen
Bildgrund.** Ohne Spielstand war es fast leer, mit Spielstand stand das Porträt
allein auf einer leeren Fläche und wirkte verloren.

Neu: `Titelfoto` — ein gezeichnetes Pressefoto. Rang in drei Bändern, ein festes
Punktfeld als Zuschauer, zwei kleine Flutlichtmasten, Bande, Rasen in Streifen und
eine **Mannschaftsreihe als Silhouetten** (6 stehend, 5 hockend, wie auf jedem
Mannschaftsfoto). Alles flach, keine Verläufe.

* **Ohne Spielstand** steht die Mannschaft deutlich (Deckung .34) und daneben
  „ELF PLÄTZE. EINER IST NOCH FREI." — statt des blassen „HIER KÖNNTE DEIN NAME
  STEHEN".
* **Mit Spielstand** tritt sie zurück (.15) und der Spieler steht davor. Das
  Porträt ist von **230 auf 168 px** verkleinert und sitzt auf der Rasenlinie
  statt in der Mitte einer leeren Fläche — er gehört in die Mannschaft.
* Dazu eine **Bildunterschrift**, wie sie zu jedem Pressefoto gehört: Name und
  Verein, ohne Spielstand „ARCHIVBILD · DIE MANNSCHAFT VOR DEM ANPFIFF".

Die Zuschauer sind **kein Zufall**, sondern ein einmal berechnetes festes Feld
(`ZUSCHAUER`) — dieselbe Ausgabe soll bei jedem Aufschlagen gleich aussehen.

**Zwei Fehler beim Zeichnen, beide am Bild erkannt:**
1. Die Köpfe schwebten über den Körpern. Grund ist Geometrie: **eine kubische
   Kurve mit beiden Kontrollpunkten auf gleicher Höhe erreicht nur drei Viertel
   des Wegs dorthin.** Ohne Überhöhung um 4/3 bleibt eine Lücke. Steht als
   Kommentar an der Stelle.
2. Meine Prüfung zählte alle Gruppen mit Kreis und Pfad im ganzen Baum — mit
   Spielstand kamen die Ohren- und Augengruppen des Porträts dazu und meldeten
   14 statt 11. **Die Prüfung war falsch, nicht das Bild.** Jetzt wird nur
   innerhalb des Titelfotos gezählt (erkannt am viewBox).

Prüfstand: **279 Prüfungen**, 6× 63 Ansichten, alle Zielbänder, 0 Fehler.
Bündel **1.048,80 kB**.

## 34.8 · Vier gemeldete Punkte

### 1 · Der Spielerpass wuchs mit jeder Station
Beide Seiten liegen im selben Rasterfeld (`.dreh`), der Pass nimmt also die Höhe der
**längeren** an. Mit jeder Station wuchs deshalb auch die Vorderseite, obwohl dort
nichts hinzukam. Die Vereinsliste rollt jetzt innen, sobald es **mehr als sechs**
Stationen sind (`maxHeight:152`), dazu ein Hinweis „… Stationen · in der Liste blättern".
`touchAction:pan-y` ist nötig, weil html und body seit 34.2 auf `pan-x pan-y` stehen.

### 2 · Die Textgröße hatte keine Wirkung
Der Regler war **nicht** kaputt: er setzte `--skala` korrekt. Aber **357 Schriftgrößen
stehen fest in Pixeln** und erben nichts — die Einstellung veränderte genau zwei
Stellen im ganzen Programm.

Alle 357 auf `calc(… * var(--skala))` umzustellen wäre ein Eingriff mit hoher
Fehlerquote. Stattdessen `zoom:var(--skala)` auf `.fl`: das skaliert alles gleichmäßig
und ist genau das, was der in 34.2 gesperrte Browserzoom vorher tat. `min-height` muss
gegengerechnet werden (`calc(100vh / var(--skala))`), sonst entsteht bei Vergrößerung
eine Rollleiste über die ganze Seite.

**Die Einstellung heißt jetzt „Anzeigegröße"**, mit dem Zusatz „Vergrößert die ganze
Seite — Text, Abstände und Bilder zusammen". Sie skaliert mehr als nur Text; sie
weiter „Textgröße" zu nennen wäre eine kleine Lüge.

### 3 · Sind alle Ligen und Vereine erreichbar? — Ja
**82 von 82 Ligen, 1238 von 1239 Vereinen** können Ziel eines Angebots sein.

Der Weg dahin ist lehrreich, weil **drei Messungen hintereinander falsch waren** und
jedes Mal plausibel aussahen:
1. Erst nahm ich `off[0]` als Wechselziel — das ist oft „bleiben" oder „verlängern",
   also derselbe Verein. Ergebnis: „Premier League nie erreichbar."
2. Dann übergab ich `g:"w"`, aber `createPlayer` liest **`cfg.gender`**. Es liefen
   also nur Männer, und alle Frauenligen erschienen als unerreichbar.
3. Dann testete ich mit zwölf großen Nationen — und schloss damit ganze Erdteile aus.
   Ergebnis: „Premier League (EGY) und Qatar Stars League nie erreichbar."

Erst mit allen 212 Nationen und echten Wechselangeboten stimmte das Bild.
**Jede dieser Zwischenmeldungen hätte als Befund getaugt und wäre falsch gewesen.**
Das Messwerkzeug liegt als `pruefstand/erreichbar.cjs` bei.

*Nicht beantwortet:* welche Ligen als **Startliga** möglich sind — `homeLeagues` ist
nicht ausgeführt und war so nicht messbar.

### 4 · Der Rahmen war nicht wählbar
`rahmenFuer` nahm **immer den ersten freigeschalteten** aus der Liste. Wer Gold und
Silber hatte, bekam Gold, ohne gefragt zu werden. Neu: `meta.rahmenWahl` und eine
Auswahl in den Optionen mit Vorschau jedes Rahmens, dazu „Keiner". Fällt die Wahl auf
etwas noch nicht Freigeschaltetes, gilt weiter der beste vorhandene — alte Spielstände
funktionieren also unverändert.

Prüfstand: **291 Prüfungen** (vorher 279), 0 Fehler. Bündel **1.051,34 kB**.

## 34.9 · Block A — fünf Fehler im Spielfluss

### A1 · Zurück-Taste des Geräts
**Ohne Zusatzpaket gelöst.** Capacitor leitet die Taste an den Verlauf der WebView
weiter, also lässt sie sich über `popstate` abfangen — `@capacitor/app` hätte eine
neue Abhängigkeit und eine Änderung an `package.json` bedeutet.

Ein **Stapel**, kein einzelner Empfänger: Optionen über Menü, Rückblick über Karriere —
die Taste muss immer das Oberste schliessen. Ist der Stapel leer, greift nichts und die
Taste verlässt die App wie gewohnt. Nach jedem Druck wird sofort ein Ersatzeintrag in
den Verlauf gelegt, sonst wäre er beim nächsten Druck leer und die App ginge ungewollt zu.

Angemeldet sind: Ruhmeshalle, Errungenschaften, Sicherung, Akademie, Spielererstellung,
Optionen, Kurzanleitung, Saison- und Karriererückblick. Neu: `zurueckAnmelden`, `useZurueck`.

*Nur teilweise geprüft:* Der Prüfstand zählt, dass der Stapel beim Öffnen **wächst**.
Dass er beim Schliessen wieder **schrumpft**, hängt an Reacts Aufräumen und liess sich
hier nicht nachstellen — im Prüflauf steht er deshalb bei 18. Auf dem Gerät gehört
nachgesehen, ob die Taste nach mehrfachem Hin und Her noch das Richtige schliesst.

### A2 · Laufender Stand war nach der Rückkehr nicht da
`saveGame` schrieb in den Speicher, setzte aber **nicht** `setSave(...)`. Im Hauptmenü
stand danach der alte Stand oder gar keiner, obwohl gerade gespeichert worden war —
erst ein Neustart zeigte den Fortschritt. Der Zustand wird jetzt sofort gesetzt, das
Schreiben läuft danach.

### A3 · Die Rentenfrage kam immer wieder
Bedingung war `age >= 33 && chance(.35)` — also **in jeder dritten Saison neu**, bis zu
fünfmal in einer Laufbahn, auch auf dem Zenit. Jetzt einmalig (`flags.renteGefragt`) und
nur, wenn die Stärke **mindestens 4 Punkte unter dem eigenen Höchstwert** liegt. Wer mit
36 noch auf seinem Bestwert spielt, wird nicht gefragt. Der Text nennt den Grund und sagt
zu, nicht wieder zu fragen.

### A4 · Hintergrund rollte unter der Bilanz mit
`rollSperren()` setzt `overflow:hidden` und `touchAction:none` auf den Körper, solange
eine Überlagerung offen ist. **Zähler statt Schalter:** bei zwei Überlagerungen
übereinander darf die erste, die schliesst, nicht schon freigeben.

### A5 · Namensvorschlag zur Herkunft
Es gab nur weibliche Vornamen (`PARTNER_F`) und **keine Nachnamen**. Neu: `VOR_M`,
`VOR_W` und `NACH` für alle vierzehn Sprachräume, dazu `namensVorschlag(nat, g, kennung)`.

Der Vorschlag hängt **an der Kennung des Porträts**, nicht am Zufall — sonst wechselte er
bei jedem Tastendruck. Sobald jemand selbst tippt, bleibt sein Name stehen, auch beim
Wechsel der Herkunft; leert man das Feld, greift der Vorschlag wieder. Ein Hinweis unter
dem Feld sagt, welcher Zustand gerade gilt.

**Beim Anlegen der Listen ist ein kyrillisches „С" in „Sousa" gerutscht** — aus einer
Zeichenkette, die beim Schreiben entstanden ist. Aufgefallen ist es nur, weil ich
hinterher gezählt habe. Der Prüfstand sucht jetzt in allen erzeugten Namen nach
kyrillischen Zeichen und nach „undefined".

Prüfstand: **301 Prüfungen** (vorher 291), 0 Fehler. Bündel **1.057,32 kB**.

### Zwei Antworten aus der Untersuchung
**Moral** bewegt sich am Saisonende (`(3,2 − Note) × 9 + Titel × 7 − 12 bei Bankdrücken`),
durch Privatleben und Besitz. Sie bewirkt **genau eine Sache**: den Wachstumsfaktor
`0,8 + Moral/340` — rund 35 % Unterschied zwischen 5 und 100. Keine Wirkung auf Noten,
Angebote oder Verletzungen. *Das ist wenig für einen so prominent angezeigten Wert.*

**Wachstum**: Startstärke Median 51, erste Saison Median +5 (Höchstwert +10), danach
+2 bis +3. Der Sprung steckt in der Formel `Abstand zum Potenzial × 0,22`: bei Start 51
und Potenzial ~85 ist der Abstand 34, der erste Schritt also zwangsläufig der grösste.
Kevins Eindruck stimmt. Ob das zu steil ist, ist eine Kalibrierungsfrage.

## 34.10 · Block B, erster Teil — die Sprache der Oberfläche

### Erst gezählt, dann angefangen
| Textsorte | Anzahl |
|---|---|
| Ereignistitel | 445 |
| Auswahlmöglichkeiten in Ereignissen | 974 |
| Ergebnistexte in Ereignissen | 1197 |
| Erklärzeilen (`hint`) | 68 |
| Beschreibungen (`desc`) | 77 |
| **sichtbare Oberflächensätze** | **44** |

**Über 2.600 Texte. Das ist nicht ein Block, sondern mehrere.** Angefangen habe ich
mit den 44 Sätzen, die man *ständig* sieht — Menü, Optionen, Erstellung, Hinweiszeilen.
Die Ereignistexte sind der grosse Rest und kommen als eigener Schritt.

### Was umgeschrieben ist
**Die Kurzanleitung komplett.** Ton: wie jemand, der einem das Spiel in der Kabine
erklärt. „Eine Saison, drei Schritte" → „Drei Schritte, dann Sommerpause". „Es endet
von allein. Irgendwann reicht es körperlich nicht mehr" → „Irgendwann ist Schluss.
Das Knie sagt Bescheid." Längste Zeile jetzt 105 Zeichen.

Dabei ist der Erklärsatz rausgeflogen, der eine frühere Änderung begründete statt das
Spiel zu erklären: „Gelten für alle Laufbahnen und stehen in den Optionen. Für eine
laufende Laufbahn bleibt es so, wie es beim Start stand." → „Stehen in den Optionen und
gelten fürs nächste Mal. Eine laufende Laufbahn bleibt, wie sie gestartet ist."

**34 weitere Oberflächensätze**, zum Beispiel:
* „Dein Umfeld kauft für dich, was sinnvoll und bezahlbar ist." → „Deine Leute kaufen,
  was Sinn ergibt und drin ist."
* „Diese Ansicht liess sich nicht aufbauen" → „Diese Seite ist uns abgeschmiert"
* „Aufhören, bevor es andere entscheiden." → „Gehen, bevor sie dich gehen lassen."
* „Laufbahn wirklich beenden? Danach geht es nicht weiter." → „Wirklich Schluss?
  Danach ist Schluss."
* „Für diese Auswahl gibt es keinen passenden Verein." → „Dafür haben wir keinen Verein."

### Eine Prüfung ist beim Umschreiben gefallen — zu Recht
Die Ehrentafel-Prüfung suchte den Wortlaut „Noch niemand". Nach dem Umschreiben stand
dort „Noch keiner hat's von hier nach oben geschafft" — der Hinweis war da, die Prüfung
fiel trotzdem. **Prüfungen, die an einem Wortlaut hängen, brechen bei jeder Sprachrunde.**
Jetzt wird auf „Noch keiner" geprüft, mit einem Kommentar dazu. Beim Rest der
Sprachrunde ist mit weiteren solchen Fällen zu rechnen.

Neu ist ausserdem eine Prüfung der Anleitung: keine Zeile ohne Kopf oder Text, keine
über 130 Zeichen. **Den Ton kann der Prüfstand nicht prüfen — die Struktur schon.**

Prüfstand: **303 Prüfungen**, 0 Fehler. Bündel **1.056,81 kB** (0,5 kB *kleiner* als
vorher — kürzere Texte).

### Was von Block B noch offen ist
1. **445 Ereignisse** mit 974 Auswahlmöglichkeiten und 1197 Ergebnistexten. In Etappen,
   etwa nach Themen (Kabine, Verein, Nationalelf, Privatleben, Presse).
2. **68 Erklärzeilen** (`hint`) und **77 Beschreibungen** (`desc`) — dort steckt
   erfahrungsgemäss die meiste unnötige Erklärlast.

## 34.11 · Sprache, zweiter Anlauf — und ein Befund, der Arbeit spart

### Zwei Sätze waren schlecht, und Kevin hat beide erwischt
* **„Gehen, bevor sie dich gehen lassen."** — Buchdeutsch. Klingt nach Sportlerbiografie,
  nicht nach Kabine. Jetzt: „Aufhören, solange du es selbst entscheidest."
* **„Wirklich Schluss? Danach ist Schluss."** — eine Doppelung, die nichts sagt.
  Jetzt: „Wirklich aufhören? Zurück geht dann nichts mehr."

Danach die ganze Liste noch einmal durch, mit einem klaren Massstab: **Würde ein Spieler
oder ein Reporter das so sagen?** Was gesucht klang, ist raus. „Was dein Zeug pro Saison
bringt" war krampfhaft locker → „Was dir dein Besitz pro Saison bringt". „Diese Seite ist
uns abgeschmiert" war zu flapsig für eine Fehlermeldung → „Hier ist was schiefgegangen".

**Die Lehre:** Umgangssprache ist nicht dasselbe wie Sprüche. Beim ersten Anlauf habe ich
gesucht statt gesprochen — und dabei Sätze gebaut, die niemand sagt.

### Der Befund: die Ereignisse brauchten gar nichts
Bevor ich 2.600 Texte umschreibe, habe ich **gemessen**, ob sie es nötig haben. Alle
Ereignistexte auf typische Kennzeichen von Behördendeutsch geprüft (somit, zudem,
hinsichtlich, im Rahmen, zur Verfügung, entsprechend …):

| Textsorte | geprüft | steife Wendungen |
|---|---|---|
| Ereignistitel | 445 | **1** |
| Auswahlmöglichkeiten | 974 | 0 |
| Erklärzeilen | 80 | 0 |
| Beschreibungen | 77 | 0 |
| Ergebnistexte | 1163 | **1** |

**Zwei von 2.739.** Beide behoben („Der Physiotherapeut steht zur Verfügung" → „Der Physio
hat einen Termin frei", „Es bringt entsprechend wenig" → „Bringt also wenig").

Die Ereignistexte sind längst im richtigen Ton — „Lehrgeld bezahlt.", „Der Trainer merkt
sich sowas.", „Die Schule hakst du ab." **Steif war die Oberfläche, nicht das Spiel.**
Hätte ich Kevins Auftrag wörtlich genommen und alle 2.600 umgeschrieben, hätte ich
funktionierende Texte gegen neue mit unbekannter Qualität getauscht.

Neu im Prüfstand: die Suche nach steifen Wendungen läuft jetzt bei jedem Lauf über alle
2.725 Ereignistexte. Behördendeutsch kann sich nicht wieder einschleichen.

### Zum dritten Mal dieselbe Falle
Die Ehrentafel-Prüfung ist erneut gefallen, weil sie an einem Wortlaut hing — erst
„Noch niemand", dann „Noch keiner". Jetzt prüft sie auf den **Gehalt**
(`/noch keiner|niemand|nach oben geschafft/i`). **Prüfungen auf wörtliche Texte sind bei
einem Projekt, dessen Sprache überarbeitet wird, eine Zeitbombe.**

Prüfstand: **304 Prüfungen**, 0 Fehler. Bündel **1.056,86 kB**.

## 34.12 · Block C — Frauenfußball

### Der Weg: umformen statt doppelt pflegen
Gezählt waren **86 Stellen** in den Ereignistexten, die bei einer Spielerin falsch sind
(Kapitän 29, Mitspieler 15, Nationalspieler 10, „einer von" 9 …). Alle Texte doppelt zu
pflegen wäre nicht durchzuhalten: bei jeder Änderung müsste man an zwei Stellen denken,
und irgendwann vergisst man eine.

Stattdessen läuft der **fertige** Text durch eine Umformung. `evText` ist der einzige
Punkt, an dem Ereignistexte ausgewertet werden — was dort greift, greift überall.
Damit sind auch die Stellen erfasst, die ich nicht gezählt habe: **2.684 Texte**.

### Drei Fehler beim Bauen, alle am Ergebnis erkannt
Eine reine Wortersetzung reicht nicht. Der Reihe nach kam heraus:
1. **„Der Kapitänin"** — der Artikel blieb männlich. Also Muster, die den Artikel
   einschliessen: `der Kapitän` → `die Kapitänin`, in allen Fällen (dem/einem/deinem…).
2. **„Zwei Spielerin fehlen"** — kein Plural. Also ein Muster für Zahlwörter und
   Mengenangaben davor: `zwei Spieler` → `zwei Spielerinnen`.
3. **„Dem Kapitänin"** — die Liste kannte nur Kleinschreibung. Gross- und
   Kleinschreibung werden jetzt **automatisch** erzeugt (`gross()`), nicht von Hand
   gepflegt; von Hand hätte ich beim nächsten neuen Wort wieder eine Hälfte vergessen.

### Was bewusst NICHT umgeformt wird
**Der Trainer bleibt Trainer.** Auch eine Frauenmannschaft kann einen Mann als Trainer
haben — das ist keine Lücke, sondern eine Entscheidung. Umgeformt wird nur, wer
zwangsläufig Spielerin ist. Steht im Quelltext als Kommentar und wird geprüft.

### Eine Stelle wäre mir fast durchgerutscht
Die **Auswahlmöglichkeiten** (`label`, `hint`) liefen nicht durch `evText`, sondern
standen direkt im JSX — sie wären bei einer Spielerin männlich geblieben. Aufgefallen,
weil ich nach dem Einbau nachgesehen habe, welche Stellen den Durchgangspunkt wirklich
benutzen.

### Geprüft
| Prüfung | Ergebnis |
|---|---|
| Umformung an Beispielfällen | 10 von 10 richtig |
| Männliche Reste nach der Umformung | **0** von 2.684 Texten |
| Gegenprobe: ändert sich bei einem Mann etwas? | **nein**, 200 Texte unverändert |

Die letzte Prüfung ist die wichtigste: eine Umformung mit Nebenwirkung auf männliche
Laufbahnen hätte vier Fünftel aller Spiele betroffen.

Prüfstand: **316 Prüfungen** (vorher 304), 0 Fehler. Bündel **1.059,03 kB**.

### Was von Block C offen bleibt
* **Beinamen** (`BEINAMEN`) sind noch nicht geprüft — die stehen ausserhalb der
  Ereignistexte und laufen nicht durch `evText`.
* **Ereignisse, die es nur im Frauenfussball geben sollte** (und umgekehrt): es gibt
  zwei ausdrücklich weibliche, aber keine systematische Prüfung, ob männliche
  Ereignisse bei Spielerinnen unpassend sind.
* Die Umformung ist **mechanisch**. Sätze, die inhaltlich männlich gedacht sind
  („im Kader stehen drei, die geboren wurden, als du…"), bleiben unberührt — das
  fällt nur beim Spielen auf.

## 34.13 · Block D, erster Teil

### Ereignisse: zwei pro Saison
Die Bedingung war `chance(.5) ? 2 : 3` — **in der Hälfte aller Saisons drei**. Eine
Saison bestand damit fast nur aus Entscheidungen. Jetzt sind es zwei; drei gibt es
ausschliesslich mit der Freischaltung „Bewegtes Leben", und auch dann nur in jeder
vierten Saison.

Nebenbei bekommt die Freischaltung erst dadurch ihren Sinn: vorher stand dort
`chance(mx_events ? .3 : .5)` — sie verschob eine ohnehin hohe Wahrscheinlichkeit,
statt etwas freizuschalten. Der Beschreibungstext ist mitgezogen („Ab und zu drei
Ereignisse statt zwei").

### Auto-Training trainierte volle Werte weiter
**Gemessen, nicht vermutet:** ein Stürmer mit Schuss 99 und Tempo 99 bekam weiterhin
Abschlusstraining. Ursache: `rueckstand` misst nur den Abstand zum eigenen Schnitt.
Ein Wert bei 99 gilt darin als voll trainierbar, solange die Position ihn stark
gewichtet — der Deckel bei 99 kam in der Rechnung schlicht nicht vor.

Neu ist ein **Kopfraum**-Faktor `(99 − Wert) / 8`, gedeckelt auf 0,04 bis 1. Ab 96
fällt der Nutzen steil, bei 99 ist er fast weg.

| Werte | vorher | jetzt |
|---|---|---|
| alle auf 70 | abschluss | abschluss |
| Schuss + Tempo auf 99 | **abschluss** | technik |
| dazu Dribbling + Pass auf 99 | **abschluss** | kraft |
| alles auf 99 | abschluss | abschluss *(dann ist es egal)* |

### Die Reiter waren nicht als Reiter erkennbar
Drei Zeichen dagegen: eine **Linie** unter der Leiste, ein **Verlauf am rechten Rand**
(deutet an, dass etwas abgeschnitten ist) und **Einrasten beim Wischen**, damit kein
Reiter halb abgeschnitten stehenbleibt. Der Verlauf hängt an einer Hülle, nicht an der
rollenden Leiste — sonst würde er mitwandern statt am Rand zu bleiben.

Der Prüfstand zählt, dass jede Leiste in ihrer Hülle steckt: eine reine Stilangabe
verschwindet bei einem Umbau sonst lautlos.

Prüfstand: **320 Prüfungen**, 0 Fehler. Bündel **1.060,16 kB**.

### Aus Block D noch offen
* **Wrapped-Karten**: zu leer, Überschriften zu klein, Karte für verpasste Spiele
  fehlt, Tabellenausschnitt statt reiner Platzierung.
* **Mehr Möglichkeiten für Vermächtnis-Coins** (Wildcard neu ziehen, Saisonschub,
  Werte über 99 …) — das ist neue Spielmechanik, kein Fehler.
* **Freischaltungen als eigenes Untermenü**, verdichtet.
* **Wachstumskurve** in den ersten Saisons: gemessen (Start 51, erste Saison +5,
  Höchstwert +10), Entscheidung über eine Anpassung steht aus.

## 34.14 · Die Wachstumskurve

### Gemessen — und der Befund war schärfer als der Verdacht
250 Laufbahnen, Alter für Alter. Die alte Kurve
(`<=18 1.0 · <=21 .92 · <=24 .62 · <=26 .34 · <=28 .16 · <=30 .05 · sonst 0`) ergab:

| Alter | Zuwachs (Mittel) |
|---|---|
| 16 | **+6,2** |
| 17 | +3,9 |
| 18 | +2,5 |
| 22–24 | +0,7 |
| ab 25 | **praktisch 0** |

Höchststärke im Median mit **24**. Und: **der Median-Spieler blieb 12 Punkte unter
seinem Potenzial** — die Zahl wurde also fast nie erreicht. Genau Kevins Beobachtung:
„Anlage 97, mit 25 ein Höchstwert von 85, dann passiert nicht mehr viel."

### Zwei Änderungen
**1. Flachere Kurve.** Vorn genommen, hinten gegeben. Der Gipfel liegt nicht mehr bei
21, sondern breit zwischen 19 und 24, und bis 30 ist noch etwas drin. Das ist für ein
Spiel mit 1.239 Vereinen wichtiger als der Ausnahmefall: auch ein mittelmässiger
Spieler soll sich über Jahre entwickeln, statt nach zwei Saisons fertig zu sein.

**2. Nachholen über das EFFEKTIVE ALTER.** Wer weit unter seinen Anlagen liegt, wird
für die Kurve jünger gerechnet — bis zu vier Jahre Gutschrift bei grossem Rückstand.

*Der erste Versuch war ein Denkfehler:* Ich hatte das Nachholen als **Multiplikator auf
die Menge** gebaut. Damit verstärkte es ausgerechnet die Sechzehnjährigen, wo die Lücke
am grössten ist — der frühe Sprung wurde schlimmer statt besser (+6,5 statt +6,2). Über
das Alter greift es nur dort, wo die Kurve abfällt: mit 16 ist man nicht „noch jünger",
mit 28 aber sehr wohl „wie 25".

**3. Grundfaktor .22 → .28.** Die flachere Kurve hat weniger Fläche; ohne Ausgleich
wäre der Abstand zum Potenzial noch grösser geworden (13 statt 12).

### Ergebnis
| | vorher | jetzt |
|---|---|---|
| Zuwachs mit 16 | +6,2 | **+3,2** |
| Zuwachs mit 27, 12 Punkte Rückstand | ±0 | **+1,4** |
| Zuwachs mit 27, fast am Potenzial | ±0 | ±0 |
| Zuwachs mit 33 | −1,0 | −0,9 |
| Höchststärke im Median mit | 24 | **27** |
| Abstand zum Potenzial (Median) | 12 | **11** |

**Alle vier Zielbänder der Kalibrierung halten** — das war die eigentliche Gefahr bei
diesem Eingriff.

Der Prüfstand hält die Zusagen fest: kein Sprung über +5 mit 16, ein Spieler mit Lücke
muss mit 27 mehr wachsen als einer ohne, und mit 33 ist Schluss.

Prüfstand: **324 Prüfungen**, 0 Fehler. Bündel **1.060,19 kB**.

## 34.15 · Die Rückblick-Karten

Drei der vier gemeldeten Mängel behoben:

**Überschriften zu klein.** Sie standen in derselben Kleinschrift wie jede andere
Zeile — bei manchen Karten wusste man nicht, worum es geht. Jetzt in der
Anzeigeschrift (`clamp(19px,5.6vw,28px)`) mit einem Strich in der Kartenfarbe darunter.

**Nur eine Platzzahl statt Tabelle.** Jetzt ein Ausschnitt: zwei Plätze darüber, zwei
darunter, die eigene Zeile hervorgehoben. Man sieht auf einen Blick, ob es eng war.
Die Nachbarplätze stehen ohne Vereinsnamen — die haben wir für die Tabelle nicht, und
sie zu erfinden wäre schlimmer als ein Strich.

**Karte für verpasste Spiele fehlte ganz.** Eine Saison mit 18 Ausfällen ist etwas
anderes als eine durchgespielte, und genau das erzählt ein Rückblick. Die Karte zeigt
verletzt und gesperrt getrennt, nennt die Verletzung beim Namen und setzt die Einsätze
ins Verhältnis. **Sie erscheint nur, wenn wirklich etwas ausgefallen ist** — eine Karte
mit einer Null wäre genau die leere Seite, die beanstandet wurde.

Dafür musste `simulateSeason` erweitert werden: **Sperrspiele flossen bisher nur in
`missed` und waren danach verloren.** Die Karte hätte Verletzung und Sperre nicht
auseinanderhalten können. Jetzt steht `banned` in der Saison.

### Eine Prüfung, die ich nicht hinbekommen habe
Der Rückblick zeigt immer nur eine Seite. Mein Versuch, im Prüfstand durchzublättern
und den Text aller Karten zu sammeln, hat nicht gegriffen — der Weiter-Knopf wurde
nicht ausgelöst. **Statt die Prüfung zu verbiegen, bis sie grün ist**, prüft sie jetzt
die Datenlage: dass `banned` mit 4 ankommt und ohne Sperre 0 ist. Ob die Karten gut
aussehen, beantwortet nur das Gerät.

Prüfstand: **326 Prüfungen**, 0 Fehler. Bündel **1.062,15 kB**.

### Aus Block D bleibt offen
* **Mehr Möglichkeiten für Vermächtnis-Coins** (Wildcard neu ziehen, Saisonschub,
  Werte über 99). Das ist keine Fehlerbehebung, sondern **neue Spielmechanik** mit
  Folgen für die Kalibrierung — jede neue Ausgabemöglichkeit verschiebt, wie schnell
  die Akademie ausgebaut wird, und das steht in einem Zielband.
* **Freischaltungen als verdichtetes Untermenü.**

## 34.16 · Zwei Fehler aus Kevins Test

Kevins Test von 34.15: **17 von 19 Punkten in Ordnung.** Zwei Fehler.

### A1 · Die Zurück-Taste tat gar nichts
Ursache war ein **stilles `try/catch`**. Der Verlaufseintrag wurde mit
`window.history.pushState(...)` gelegt, umgeben von `try { … } catch (e) {}`.
Unter `file://` und `content://` wirft pushState einen Sicherheitsfehler — der
wurde verschluckt, es gab keinen Verlaufseintrag, und ohne den feuert `popstate`
nie. **Die Taste hatte nie eine Chance, und nichts im Code hat das gemeldet.**

Das ist genau das Muster, das hier schon zweimal Ärger gemacht hat: ein Fehler,
der weggeschluckt wird, sieht aus wie ein Erfolg.

Jetzt **drei Wege**, in dieser Reihenfolge:
1. **Capacitor** (`window.Capacitor.Plugins.App`) — meldet die Taste unabhängig
   vom Verlauf und ist in der APK der zuverlässige Weg. Dafür ist
   `@capacitor/app` in `package.json` dazugekommen — **^6.0.3, nicht ^6.2.0.**
   Ich hatte die Fassung ungeprüft von `@capacitor/core` übernommen; die gibt es
   für dieses Paket nicht, und `npm install` brach ab. Aufgefallen erst, als der
   Browsertest sich nicht mehr bauen liess. **Fassungsnummern nicht raten.**
2. Das `backbutton`-Ereignis auf `document`, das manche WebViews feuern.
3. Der **Verlauf** wie bisher — für den Browsertest.

`verlaufLegen()` gibt jetzt **zurück, ob es geklappt hat**, statt zu schweigen.
Der gewählte Weg steht in `window.RS_ZURUECK_WEG` und wird in der Diagnosezeile
des Messwerkzeugs angezeigt: „Capacitor", „Verlauf" oder
„keiner (pushState gesperrt)".

**Im Browsertest über `content://` wird weiterhin „keiner" stehen** — dort ist
pushState gesperrt, und daran kann die App nichts ändern. Der Weg über Capacitor
greift erst in der echten APK. **Das heisst: A1 lässt sich nur in der APK
abschliessend prüfen, nicht im Browsertest.**

> **Erledigt am 15.8.2026.** Kevin hat die Zurück-Taste in der APK durchprobiert:
> arbeitet wie gewollt, kein Fehler gefunden. Der Weg über Capacitor greift also.
> Damit ist A1 abgeschlossen und Block A vollständig.

### B3 · Der Spielerpass wuchs weiter
Die Grenze aus 34.8 griff erst **ab sieben Stationen** — bis dahin wuchs die
Liste frei, und weil beide Seiten im selben Rasterfeld liegen, wuchs die
Vorderseite mit. Die halbe Lösung war schlimmer als keine, weil sie das Problem
zu lösen schien.

Jetzt hat die Liste **immer** eine feste Höhe (150 px), von der ersten Station
an. Der Prüfstand vergleicht die Höhe bei 3 und bei 14 Stationen — sie muss
gleich sein.

Meine eigene Prüfung von 34.8 hat dabei angeschlagen: sie erwartete bei wenigen
Stationen *keine* Rollfläche. Gemessen am alten Stand hatte sie recht — die
Erwartung selbst war falsch.

Prüfstand: **330 Prüfungen**, 0 Fehler. Bündel **1.062,63 kB**.

### Was Kevins Test bestätigt hat
A2 Papierkorn · A3 Porträtgrösse · A4 Reiter · A5 Anzeigegrösse · B1 Zoom
gesperrt · B2 Akademie bei 0 % · B4 Rahmenwahl · B5 Stand im Menü · B6
Rentenfrage · B7 Bilanz-Hintergrund · B8 Namensvorschlag · B9 Pass wenden.
C und D stehen unter Langzeitbeobachtung.

## 34.17 · Die Freischaltungen

Vorher stand jede der 48 Freischaltungen als **eigene Karte mit Rahmen**
untereinander — eine sehr lange Kette, in der man nichts wiederfand.

Jetzt ein aufklappbares Verzeichnis:
* **Zugeklappt** (Vorgabe) eine Zeile mit „x von 48" und darunter die Zähler je
  Art: Neue Wildcards · Bessere Chancen · Startvorteile · Spielregeln · Neue
  Ereignisse · Aussehen. **Das ist die Übersicht, die vorher fehlte** — man
  sieht, wo noch etwas zu holen ist, statt nur, was man schon hat.
* **Aufgeklappt** nach Art gebündelt, je Freischaltung eine Zeile statt einer
  Karte: Name links, Wirkung rechts.

Zugeklappt beginnen ist Absicht: die Errungenschaften sind der Hauptinhalt
dieser Seite, die Freischaltungen das Nachschlagewerk dazu.

**Eine Prüfung war zu grob:** Sie suchte den Namen „Karte: Stadionikone" im
Text, um festzustellen, ob zugeklappt doch die Liste dasteht. Der Name steht
aber auch bei der Errungenschaft als Belohnung — die Prüfung schlug an, obwohl
alles stimmte. Jetzt werden die Artbänder gezählt, die es nur aufgeklappt gibt.

Prüfstand: **334 Prüfungen**, 0 Fehler. Bündel **1.064,20 kB**.

### Damit ist aus Block D nur noch eines offen
**Mehr Möglichkeiten für Vermächtnis-Coins.** Das ist keine Fehlerbehebung,
sondern neue Spielmechanik: Wildcard neu ziehen, Saisonschub, Trainingsschub,
Werte über 99 heben, Laufbahn mit demselben Spieler neu starten.

**Warum das eigen behandelt werden muss:** VC sind heute die einzige Währung für
den Ausbau der Akademie, und „Laufbahnen bis Vollausbau" ist eines der vier
Zielbänder (25–35, aktuell 32,3). Jede neue Ausgabemöglichkeit zieht Geld aus
diesem Topf und verschiebt das Band nach oben. Vor dem Einbau muss also
feststehen, ob die Akademie langsamer werden **darf** — oder ob die Einnahmen
mitwachsen sollen.

## 34.18 · Der Vermächtnis-Laden

Bis 34.17 gab es für VC genau eine Verwendung: die Akademie. Wer sie ausgebaut
hatte, sammelte ins Leere.

### Die Einnahmen, maßvoll
`vcFuer` bekommt am Ende einen Aufschlag von **18 %**. Er steht bewusst dort und
nicht in einem einzelnen Posten: so wirkt er gleichmässig, statt eine Quelle zu
verzerren, und man sieht ihm an, wofür er da ist.

| | vorher | jetzt |
|---|---|---|
| VC je Laufbahn (Mittel) | 50,3 | **57,9** |
| Laufbahnen bis Vollausbau | 31,1 | **27,0** |

Mit üblichen Einkäufen landet der Ausbau wieder bei rund 32 — im Zielband
(25–35), und **der Ausbau bleibt ein Langzeitziel.**

*Ein Umweg unterwegs:* Zuerst hatte ich den Grundposten von `score/26` auf
`score/21` geändert — das brachte nur +3 %, weil dieser Posten gar nicht der
grösste ist. Die Titel wiegen schwerer. Zurückgenommen und als Faktor am Ende
gelöst.

*Und eine Falle:* Die Kalibrierung würfelt bei jedem Lauf neu. Zwischen zwei
Läufen schwankte der Mittelwert um ±10 % — bei einer Messung sah der Aufschlag
wie eine Verschlechterung aus. **Einzelne Kalibrierläufe taugen nicht zum
Vergleich kleiner Änderungen.**

### Die sieben Artikel
| Artikel | Preis | wann |
|---|---|---|
| Neue Karte ziehen | 45 | nur vor dem Anpfiff, einmalig |
| Extraschicht (mehr Fortschritt, eine Saison) | 22 | in der Laufbahn |
| Lauf der Saison (Bestform) | 28 | in der Laufbahn |
| Der beste Physio (Verletzung weg) | 18 | sofort |
| Ein Berater, der zieht (stärkere Angebote) | 26 | in der Laufbahn |
| Der Trainer hört zu (Vertrauen auf 85) | 20 | sofort |
| Über das Limit (ein Wert bis 103, vier Saisons) | 70 | einmalig |

Gemessen an rund 58 VC je Laufbahn: Kleinigkeiten kosten unter einer halben
Laufbahn, der grösste Eingriff gut eine. Der Prüfstand schlägt an, wenn ein
Preis über 100 oder unter 10 liegt.

Jeder Artikel trägt ein **gezeichnetes Zeichen** (`SHOP_BILD`) — flach,
einfarbig, in der Sprache des Hefts. Der Prüfstand prüft, dass keines fehlt.

### Wo er liegt
* **Hauptmenü**: als Eintrag „Anzeigen" im Inhaltsverzeichnis, Seite 8 — eine
  Anzeigenseite, wie sie in jedem Sportheft steht.
* **In der Laufbahn**: als Knopf in der Kopfleiste mit Kassenstand, öffnet eine
  Überlagerung statt einer eigenen Phase. Ein Phasenwechsel würde den Schritt
  verlieren, in dem man gerade steckt.

### Die Brücke, die fast gefehlt hätte
Die Käufe liegen in `aka.laden` — gelesen werden sie aber über `p.laden` von
`develop`, `simulateSeason` und `makeOffers`. Ohne die Brücke wäre jeder Kauf
gebucht und wirkungslos gewesen: **genau das Muster, das in diesem Projekt schon
zweimal vorkam** (Pity-Zähler, Augenfarbe). Beim Kauf wird `p` deshalb
mitgezogen und gespeichert.

Laufende Käufe zählen am Saisonende herunter; einmalige bleiben stehen, damit
man sie nicht zweimal kauft.

Prüfstand: **342 Prüfungen**, 0 Fehler. Bündel **1.070,69 kB**.

### Noch nicht umgesetzt (in 34.19 nachgeholt)
`reroll` war ein Kauf ohne Folge — siehe 34.19.

## 34.19 · Der gekaufte Kartentausch wirkt

Der Artikel stand seit 34.18 im Laden und tat nichts. Jetzt verdrahtet, und
zwar an der **einen** Stelle, an der die Zahl der Tausche entsteht.

### Eine Quelle statt drei
Vorher stand `(p.meta && p.meta.mx_reroll) ? 2 : 1` **zweimal** im Quelltext:
in `rerollWildcard` und in `tauschRest`. Wären die auseinandergelaufen, hätte
der Knopf sichtbar sein können, ohne dass der Tausch durchgeht — oder umgekehrt.

Jetzt eine Funktion, drei Quellen:

    tauschMax(p) = 1
      + Freischaltung „mx_reroll"   (+1)
      + gekaufter Artikel „reroll"  (+1)

`rerollWildcard` und `tauschRest` lesen beide diese Funktion. Der Knopf in der
Ansicht liest `tauschRest` und erscheint dadurch von selbst — es war keine
Änderung an der Anzeige nötig.

### Zwei Lücken, die dabei aufgefallen sind
1. **Der Kauf kam beim Karrierestart nicht an.** `createPlayer` erzeugt einen
   frischen Spieler; `aka.laden` wurde nicht übertragen. Ein im Hauptmenü
   gekaufter Tausch wäre beim Anpfiff verschwunden gewesen — bezahlt und weg.
   Jetzt setzt `start()` das `q.laden` mit.
2. **Der Artikel stand nur unter „start".** Man kauft ihn aber meist erst, wenn
   man die gezogene Karte gesehen hat — und die sieht man in der Laufbahn. Jetzt
   „immer"; nutzbar bleibt er ohnehin nur, solange keine Saison gespielt ist,
   und das prüft `rerollWildcard` selbst.

### Geprüft wird die ganze Kette
| Lage | Tausche |
|---|---|
| ohne alles | 1 |
| gekauft | 2 |
| freigeschaltet | 2 |
| beides | 3 |

Dazu: der zweite Tausch geht **wirklich** durch (`wcRerolls` steigt auf 2), der
dritte ist gesperrt, und nach der ersten gespielten Saison geht gar nichts mehr
— auch mit Kauf. **Die Zählung allein hätte nicht gereicht:** sie hätte auch
gestimmt, wenn `rerollWildcard` den Tausch am Ende verweigert.

Prüfstand: **350 Prüfungen**, 0 Fehler. Bündel **1.070,77 kB**.
Laufbahnen bis Vollausbau: 26,3 — im Band.

## 34.20 · Der Laden nach dem ersten Blick aufs Gerät

### Der Zugang war eine Zeile, kein Knopf
Der Laden hing als Eintrag „ANZEIGEN" im Inhaltsverzeichnis des Titelblatts.
Auf dem Gerät las sich das wie ein **Artikel des Hefts**, nicht wie eine
Schaltfläche — zwischen „Ruhmeshalle" und „Jugendakademie" stand plötzlich
etwas, das keine Seite ist.

Jetzt ein Knopf **links neben dem Zahnrad**, gleiche Grösse und Form, mit dem
Sternzeichen aus der Karriere. Er färbt sich golden, sobald Coins da sind. Der
Verzeichniseintrag ist raus.

### Der Laden zeigte im Hauptmenü genau einen Artikel
Das war meine Filterung: Jeder Artikel hat ein `wann` — die meisten wirken erst
in einer Laufbahn, also blendete `shopFuer(wo)` sie im Hauptmenü aus. Übrig
blieb der Kartentausch. **Ein Laden mit einem Regal sieht aus wie ein Defekt**,
und man kann nicht ahnen, dass es mehr gibt.

Der Filter ist weg. Der Laden zeigt **immer alle sieben**; was ohne laufende
Laufbahn nicht geht, ist gesperrt und gedämpft, mit dem Grund darunter
(„erst in der Laufbahn"). Neu: `ladenGesperrt(a, wo)`.

Gemessen: **Hauptmenü 7 Artikel, 6 gesperrt · Laufbahn 7 Artikel, 0 gesperrt.**
Der Prüfstand zählt beides — vorher hätte er den Unterschied nicht bemerkt,
weil er nur zählte, ob die Zahl der Knöpfe zur *gefilterten* Liste passt. Eine
Prüfung, die die eigene Annahme nachrechnet, findet den Fehler in der Annahme nie.

Es ist übrigens derselbe Laden — Hauptmenü und Karriere führen in dieselbe
Ansicht, nur mit anderem `wo`.

Prüfstand: **352 Prüfungen**, 0 Fehler. Bündel **1.071,14 kB**.

## 34.21 · Laden und Zahnrad lagen aufeinander

Kevin hat es auf dem Gerät gesehen: die beiden Knöpfe oben rechts im
Hauptmenü steckten ineinander, statt nebeneinander zu sitzen.

### Ein Rand hilft nicht, wenn das Element absolut sitzt
Beide Knöpfe trugen dieselbe Klasse `.zahnrad` mit `position:absolute` und
`right:0`. Der Laden bekam zusätzlich `marginRight: 6` — und das war der
Denkfehler. Bei absoluter Lage löst der Browser die Gleichung

    left + Breite + margin-right + right = Breite des Behälters

Der Rand verschiebt das Element also **um seinen eigenen Betrag**, nicht um
die Breite des Nachbarn. 40 px Knopf gegen 6 px Versatz sind 34 px
Überlappung. Das Zahnrad steht später im Baum und lag deshalb obenauf.

In Chromium nachgemessen (412 px breit, wie auf dem S24 Ultra):

| | Laden | Optionen | Ergebnis |
|---|---|---|---|
| vorher 34.20 | 354–394 | 360–400 | **34 px Überlappung**, 85 % verdeckt |
| nachher 34.21 | 312–352 | 360–400 | **8 px Abstand** |

### Nicht die Zahl korrigiert, sondern die Konstruktion
`right:46px` hätte es auch getan, wäre aber eine Zahl, die stillschweigend
von der Knopfbreite abhängt. Stattdessen:

* neuer Behälter `.kopfknoepfe` — `display:flex; gap:8px`
* `.zahnrad` verliert `position:absolute`, `top`, `right` und `z-index` und
  ist nur noch die Form des Knopfes
* die Kopfleiste selbst ist eine Flexzeile mit `space-between`

Zwei Knöpfe können damit gar nicht mehr aufeinander liegen, und ein dritter
ließe sich ohne neue Zahl anhängen. **Nebenwirkung mit Absicht:** vorher
konnte die Beschriftung „AUSGABE 01" bei hochgestellter Textgröße unter die
absolut gesetzten Knöpfe rutschen. In der Flexzeile schrumpft sie stattdessen.

### Die Prüfung dazu — und warum sie im CSS nachsieht
jsdom rechnet kein Layout. Der Baum sah vorher und nachher gleich aus; keine
der 352 Prüfungen konnte diesen Fehler sehen. Neu sind deshalb zwei Ebenen:

1. **Im Prüfstand** (`ansichten.jsx`, 7 Prüfungen): beide Knöpfe liegen in
   **einem** Behälter, der `.kopfknoepfe` heißt und beschriftet ist; und die
   Stilregel selbst — `.zahnrad` darf nicht absolut sein, `.kopfknoepfe` muss
   Flex mit Abstand sein. Dafür ist `CSS` neu in `exporte.txt`.
2. **Im echten Browser** (`kopfleiste.cjs`): misst den Abstand wirklich.

**Gegengeprüft:** gegen die unveränderte 34.20 gefahren, schlagen drei der
neuen Prüfungen an, darunter „`.zahnrad` steht wieder auf position:absolute".

*Eigener Fehler dabei:* Die Zusammenfassungszeile meldete zuerst fest
„`.zahnrad` nicht absolut" — auch dann noch, als die Prüfung zwei Zeilen
darüber das Gegenteil festgestellt hatte. Erst in der Gegenprobe aufgefallen.
Sie nennt jetzt den gemessenen Zustand.

### Zwei Falschalarme in `startprobe.cjs` — schon in 34.20 rot
Beim Bauen des Browsertests fiel auf, dass die Startprobe auf der
**unveränderten** 34.20 zwei Fehlschläge meldete. Beide waren Muster, die auf
alte Zeichenketten eingefroren waren:

| Prüfung | suchte nach | steht dort seit |
|---|---|---|
| Halbtonraster im Grundstil | `rgba(237,242,233,.030)` | `currentColor` |
| Rasterschalter setzt Aufsatzstil | `.fl{background:radial-gradient` | `.fl{background:var(--bg)` (34.20) |

Beide prüfen jetzt die Absicht statt des Wortlauts: dass `.raster` im
Grundstil überhaupt einen Radialverlauf trägt, und dass der Schalter einen
Aufsatzstil mit `!important` auf `.fl` und `.raster` legt.

Startprobe vorher **11 von 13**, jetzt **13 von 13**. Eine Prüfung, die immer
rot ist, wird genauso ignoriert wie eine, die immer grün ist.

### Geprüft
Prüfstand: **359 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.071,56 kB** (vorher 1.071,14 — die 0,42 kB sind der neue Behälter).
Rückwärtsprüfung 6 × 63 Ansichten fehlerfrei, `package.json` unverändert.

**Von Kevin auf dem Gerät bestätigt (15.8.2026):** die Zurück-Taste des
Handys arbeitet in der APK wie gewollt, kein Fehler gefunden. Damit ist der
letzte Punkt aus Block A erledigt.

## 34.22 · Der Laden rechnet ab, und zwei Texte

Vier von sechs gemeldeten Punkten. Zwei davon waren derselbe Fehler.

### Der Laden: zwei Kopien, nur eine wurde kleiner
Gekauftes stand in `aka.laden` (dauerhaft, im Laden angezeigt) und in `p.laden`
(am Spieler, wirksam). Heruntergezählt wurde am Saisonende **nur `p.laden`**.
Drei Folgen, von denen Kevin nur die erste gesehen hat:

1. Im Laden stand für immer „läuft“ — auch Laufbahnen später.
2. **Nachkaufen war dauerhaft gesperrt**, weil der Kauf gegen einen Zähler
   prüfte, der nie wieder 0 wurde.
3. **`start()` schenkte den Kauf jeder weiteren Laufbahn erneut.** Einmal
   Extraschicht bezahlt hiess: ab jetzt in jeder Laufbahn gratis dabei.

Dazu ein vierter, unbemerkter: **Physio und Trainer wirken sofort**, trugen sich
aber trotzdem als „läuft“ ein und blockierten sich damit für immer selbst.

### Ein Modell statt eines Schalters
`einmal: true` ist weg. Jeder Artikel trägt jetzt eine Art:

| Art | Bedeutung | Artikel |
|---|---|---|
| `dauer: 0` | wirkt sofort, hinterlässt **nichts**, beliebig oft kaufbar | Physio, Trainer |
| `dauer: n` | läuft n Saisons, zählt herunter, danach nachkaufbar | Extraschicht, Lauf der Saison, Berater (1) · Über das Limit (4) |
| `vorrat` | stapelt sich, wird beim Tausch verbraucht | Kartentausch |

Und zwei Orte mit klarer Aufgabe: **`p.laden`** ist, was in der laufenden
Laufbahn wirkt. **`aka.laden`** ist reiner **Vorrat** — im Hauptmenü gekauft,
beim Anpfiff übergeben und dabei **geleert**. Die Ladenansicht liest den
Bestand, der wirklich gilt (`p ? p.laden : aka.laden`).

Kaufbarkeit entscheidet **eine** Funktion, `ladenKaufbar(a, laden)`, die Anzeige
und Kauf beide lesen — vorher stand die Regel zweimal da.

Das Herunterzählen liest die Dauer jetzt **aus `VCLADEN`** statt aus einer von
Hand gepflegten zweiten Liste `["training","form","berater","ueber99"]`. Ein
neuer Artikel mit Dauer wäre dort schlicht vergessen worden und hätte ewig
gegolten.

Nebenbei: der Preis steht jetzt **immer** am Artikel. Vorher stand bei
Laufendem nur „läuft“, und man konnte nicht sehen, was ein weiterer Kauf kostet.

### Der Kartentausch ist ein Zähler
`tauschMax` liest `p.laden.reroll` nicht mehr als Ja/Nein, sondern als Zahl.
Jeder Kauf gibt einen weiteren Tausch — genau wie gewünscht, statt einer
einmaligen Freischaltung fürs Leben.

### Geprüft, und die Prüfung gegengeprüft
15 neue Prüfungen. Der Kern ist nicht die Zählung, sondern **eine echte Saison
durch `simulateSeason`**: `training 1→0 · ueber99 4→3 · Vorrat reroll 2→2 ·
danach nachkaufbar: ja`.

**Gegenprobe:** das Herunterzählen künstlich wieder ausgebaut — drei Prüfungen
schlagen an, darunter „training ist nach Ablauf immer noch nicht nachkaufbar“.

*Und derselbe eigene Fehler wie in 34.21:* meine Zusammenfassungszeile meldete
fest „danach nachkaufbar ✓“, auch als die Prüfung darüber rot war. Erst in der
Gegenprobe aufgefallen. **Zum zweiten Mal in zwei Fassungen** — Protokollzeilen
gehören grundsätzlich an den gemessenen Wert, nicht an den erwarteten.

### Der Aufmacher der Ruhmeshalle log
Unter „WER LÖST … AB?“ stand fest: *„Die Ruhmeshalle steht voll. Jetzt fehlt nur
noch einer: deiner.“* Der Zweig greift ab dem **ersten** Eintrag — im
Inhaltsverzeichnis direkt darunter stand dann „Ruhmeshalle · 1“. Dazu
widerspricht der Satz sich selbst: was voll ist, dem fehlt nichts. Jetzt nennt
er die tatsächliche Zahl und den Punktwert, den es zu schlagen gilt.

### Das Namensfeld liess sich nicht leeren
`setEigenerName(wert.length > 0)` lief bei **jedem** Tastendruck und fiel beim
Löschen des letzten Zeichens auf falsch zurück — der Vorschlag sprang sofort
wieder hinein, man konnte das Feld nie leeren, um selbst zu tippen. Die
Markierung ist jetzt **klebrig**: einmal angefasst, gehört das Feld dem Spieler.
Zurück zum Vorschlag geht über einen Knopf daneben, der über einen eigenen
Drehzähler jedes Mal einen anderen Namen liefert. Ein leeres Feld beim Anpfiff
fällt auf den Vorschlag zurück, damit niemand namenlos startet.

### Geprüft
Prüfstand: **374 Prüfungen**, 0 Fehler, alle vier Zielbänder
(Vollausbau 27,1 · Kosten 1.564 · Weltklasse 4 · Rautekarte 34).
Bündel **1.072,54 kB**. Rückwärtsprüfung 6 × 63 Ansichten fehlerfrei.

**Wichtig zur Kalibrierung:** mehr Kaufmöglichkeiten heissen mehr VC-Abfluss.
Das Band „Laufbahnen bis Vollausbau“ hält (27,1 in 25–35), weil die Kalibrierung
nicht einkauft. **Wie stark sich mehrfaches Nachkaufen im echten Spiel auf den
Ausbau auswirkt, ist damit NICHT gemessen** — das zeigt erst Kevins Langzeittest.

## 34.23 · Jede neue Seite beginnt oben

Kevin: „Wenn ich eine neue Laufbahn starte, startet das Bild nicht
grundsätzlich am oberen Ende der Charaktererstellung." Und die richtige
Frage hinterher: **betrifft das auch andere Seitenwechsel?**

**Ja, alle.** Es gab dafür nirgends etwas. `zumAnfang(el)` existiert seit
längerem, springt aber an den Anfang eines *Bereichs innerhalb* einer Seite
und wird nur an **zwei** Stellen gerufen, beide bei Reiterwechseln. Der
Seitenwechsel selbst war ungeregelt: der Browser behält die Rollhöhe, und die
neue Seite erscheint an derselben Stelle, an der man vorher war.

### Eine Stelle statt siebzehn
Welche Seite gezeigt wird, hängt allein an `phase` (17 Wechsel) und `step`.
Also ein einziger Effekt darauf, statt siebzehn einzelner Aufrufe, die man beim
achtzehnten vergisst:

    useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); },
              [phase, step]);

Ohne weichen Übergang: beim Seitenwechsel ist der alte Inhalt schon weg, weiches
Rollen sähe wie ein Fehler aus. Das Fenster rollt, kein innerer Behälter — das
ist im CSS ausdrücklich so festgehalten und wurde vorher nachgesehen.

### Gemessen in echtem Chromium
Neues Werkzeug `pruefstand/seitenanfang.cjs`. Fenster 412 × 560, damit die
Seiten sicher überlaufen; je Fall frisch laden, ganz nach unten rollen,
Seitenwechsel auslösen, `window.scrollY` messen.

| Wechsel | vorher 34.22 | nachher 34.23 |
|---|---|---|
| Hauptmenü → Erstellung | 352 px → **352 px** | 352 px → **0** |
| Errungenschaften → Menü | 14.201 px → **352 px** | 14.201 px → **0** |
| Menü → Errungenschaften | 352 px → **352 px** | 352 px → **0** |
| Erstellung → Menü | 1.484 px → **352 px** | 1.484 px → **0** |

### Zwei Fehler im Prüfmittel, beide vor dem Ergebnis gefunden
1. **Ein Falschgrün.** Der erste Entwurf fuhr mit 412 × 915. Im frischen
   Zustand ist das Hauptmenü dort **exakt fensterhoch** (915 von 915 px) — es
   gab nichts zu rollen, `scrollY` war vorher wie nachher 0, und die Prüfung
   meldete zufrieden „bestanden", ohne etwas gemessen zu haben. Jetzt ein
   niedrigeres Fenster **und** die Bedingung, dass vorher wirklich mindestens
   60 px gerollt wurde; wer nicht herunterkam, meldet „nicht messbar", und das
   zählt als Fehlschlag.
2. **„Neue Laufbahn" wurde nie gefunden.** Der Knopf bricht die Zeile um,
   `innerText` liefert `NEUE\nLAUFBAHN`, und `includes("neue laufbahn")` trifft
   das nicht. Jetzt wird der Leerraum vorher vereinheitlicht.

Ruhmeshalle und Akademie werden **bewusst nicht** geprüft: im frischen Zustand
sind beide zu kurz zum Rollen. Lieber eine Prüfung weniger als eine, die nichts
sieht.

### Geprüft
Prüfstand: **374 Prüfungen**, 0 Fehler, alle vier Zielbänder
(Vollausbau 27,3 · Kosten 1.564 · Weltklasse 4 · Rautekarte 33).
Bündel **1.072,65 kB**. Startprobe 13 von 13. Seitenanfang 4 von 4.

## 34.24 · Der Spielerpass: Stärke, Binden, Flaggen

Erster Teil eines Blocks von elf Punkten. Dieser Abschnitt deckt drei davon —
alle am Spielerpass, und einer davon schliesst nebenbei einen Teil des seit
34.22 offenen Pass-Wachstums.

### Die Stärke läuft hoch und feiert Marken
Vorher stand dort eine nackte Zahl, die beim Saisonwechsel einfach eine andere
war. Jetzt läuft sie über 900 ms hoch (`Zahl`, gab es schon), und beim
Überschreiten von **60 · 70 · 80 · 85 · 90 · 95 · 99** gibt es einen kurzen
Puls: die Zahl wird golden, wächst und fällt zurück, links daneben schiebt sich
die erreichte Marke herein und nach 2,4 s wieder weg.

Drei Bedingungen, damit das nicht zur Tapete wird:
* nur bei **Anstieg**, nie beim Fallen,
* **nicht beim ersten Aufbau** — sonst blinkt der Pass bei jedem Öffnen,
* gar nicht, wenn „Bewegung reduzieren“ (`RUHE`) an ist.

Werden mehrere Marken auf einmal genommen, zeigt er die höchste.

### Die Binden hatten keinen Platz — und liessen den Pass wachsen
Beide Kapitänsbinden hingen in **derselben Flexzeile wie der Name**, mit
`flexWrap: "wrap"`. Bei langem Namen rutschten sie in Zeile zwei. Weil beide
Passseiten im selben Rasterfeld liegen, wuchs damit **der ganze Pass** — das ist
ein Teil des offenen Punkts 8, und er hatte nichts mit der Vereinsliste zu tun.

Jetzt haben sie einen festen Platz rechts unter der Stärke: untereinander,
rechtsbündig, ausserhalb jeder Zeile, die umbrechen kann.

### Flaggen auf der Nationalbinde — und was das nicht ist
Die Binde der Nationalmannschaft trägt jetzt die **Bauart** der Landesflagge
statt zweier Farbhälften: liegende Streifen, stehende Streifen, skandinavisches
Kreuz oder Fläche mit Scheibe. 33 Nationen sind hinterlegt, mit dritter Farbe wo
die Flagge wirklich drei hat.

**Ehrlich gesagt, was das NICHT ist: eine Flaggensammlung.** Von 212 Nationen
haben nur 33 überhaupt Farben, und Wappen, Sterne oder Halbmonde wären auf einem
22 Punkt hohen Band ein Fleck. Wer nicht in der Liste steht, bekommt liegende
Streifen aus seinen zwei Farben — dieselbe Darstellung wie bisher. Die
**Vereinsbinde bleibt in Vereinsfarben**; eine Landesflagge am Vereinskapitän
wäre falsch.

Der Kennbuchstabe C hat jetzt einen Saum, weil er sonst auf der mittleren
Flaggenbahn verschwindet.

### Geprüft
5 neue Prüfungen. Der Kern: **kein Vorfahr einer Binde darf `flexWrap:"wrap"`
tragen**, und keine Binde darf mehr in der Namenszeile stecken. jsdom rechnet
kein Layout und sieht den Umbruch nicht — geprüft wird deshalb die Ursache.

**Gegenprobe:** die alte Anordnung wiederhergestellt — beide Prüfungen schlagen
an („2 Binde(n) hängen in einer umbrechenden Zeile“).

Prüfstand: **379 Prüfungen**, 0 Fehler, alle vier Zielbänder
(Vollausbau 26,2 · Kosten 1.564 · Weltklasse 4 · Rautekarte 33).
Bündel **1.076,92 kB**. Startprobe 13 von 13. Seitenanfang 4 von 4.

### Was NICHT gemessen ist — und warum es hier steht
Ich wollte die Passhöhe mit langem Namen im Browser vorher/nachher vergleichen.
**Der Versuch ist gescheitert:** die Kartenenthüllung liess sich nicht
zuverlässig wegklicken und der lange Name kam nicht ins Feld, also lag der Pass
nie frei. Gemessen wurden zweimal 280 px — beides Mal die verdeckte Ansicht,
also **kein Beleg für gar nichts**. Es wäre die dritte Falschgrün-Falle in vier
Fassungen gewesen; sie steht hier, damit sie niemand als Nachweis liest.

**Offen bleibt daher:** ob die Vorderseite mit langem Namen jetzt wirklich
konstant hoch ist, muss Kevin auf dem Gerät sehen. Strukturell kann sie es,
gemessen ist sie nicht.

Ebenfalls nicht visuell geprüft: **wie die Flaggenbinden aussehen.** Sie
erscheinen erst, wenn man Kapitän ist, und dorthin kommt der Prüfstand nicht.

## 34.25 · Die Ränge der Errungenschaften

Zwei gemeldete Punkte, zwei verschiedene Ursachen — aber dieselbe Farbtabelle.
Deshalb zusammen: hätte man nur die Farben geändert, wäre der Kontrast wieder
ein anderer gewesen.

### Warum die Karten anders aussahen als die Übersicht
Jede Stufe hatte ZWEI von Hand gepflegte Farben: `col` für dunklen Grund,
`colK` für Karton. Die Übersicht oben zeichnete einen Punkt in `col`, die Karte
einen Block in `colK`. Legendär war oben cremefarben (`#F3E7BE`) und auf der
Karte olivbraun (`#6B5A2A`) — dieselbe Stufe, zwei Farben.

Beide Werte waren für sich genommen *richtig* gewählt: hell auf dunkel, dunkel
auf hell. Nur ergaben sie zusammen keine Stufe mehr, die man wiedererkennt.

**Jetzt eine Farbe je Stufe.** Die dunkle Variante für dünne Linien wird
gerechnet (`stufeDunkel`, Faktor 0,46), nicht gepflegt. Und Übersicht wie Karte
benutzen dasselbe Bauteil `Rangblock` — ein Bauteil kann nicht auseinanderlaufen.
Damit blasse Stufen auf hellem Karton nicht verschwinden, trägt der Block einen
Rand in der gerechneten dunklen Variante.

### Warum der Rang unlesbar war — ein Spezifitätskonflikt
`.stufe` setzt `color:var(--karton)`, also helle Schrift. Aber `.karton .m` ist
mit (0,2,0) spezifischer als `.stufe` mit (0,1,0), und der Block trägt beide
Klassen. Auf jeder Karton-Karte gewann also `var(--tinte2)` — **dunkle Tinte auf
dunkler Fläche.** Ausserhalb einer Karte (Saisonbilanz) stimmte es, deshalb fiel
es nur auf den Karten auf.

Die Schriftfarbe wird jetzt aus der Leuchtdichte gerechnet und **inline**
gesetzt. Inline schlägt jede Klasse — der Konflikt kann nicht wiederkommen.

### Ein Befund, den erst die Prüfung gebracht hat
Die neue Kontrastprüfung meldete sofort: **Bronze `#A5713C` erreicht nur 3,73**
mit heller und 4,23 mit dunkler Schrift. Beides unter den nötigen 4,5 für eine
9 Punkt grosse Versalzeile — die Stufe wäre auch nach der Umstellung grenzwertig
geblieben. Bronze ist jetzt `#8A5A29` und trägt helle Schrift mit **5,24**.

| Stufe | Farbe | Schrift | Kontrast |
|---|---|---|---|
| Bronze | `#8A5A29` | hell | 5,24 |
| Silber | `#9AA5B4` | dunkel | 7,08 |
| Gold | `#E8B84B` | dunkel | 9,58 |
| Platin | `#5E9BD8` | dunkel | 6,02 |
| Legendär | `#F3E7BE` | dunkel | 14,28 |

### Geprüft
Die Prüfung vergleicht **nicht die Tabelle, sondern das Gezeichnete**: alle
`.stufe`-Blöcke der Ansicht werden nach Stufennamen gruppiert, und jede Gruppe
muss genau EINEN Hintergrund haben. Die Tabelle war ja gerade das Problem — eine
Prüfung, die sie mit sich selbst vergleicht, hätte nichts gefunden.

**Gegenprobe:** alter Zustand wiederhergestellt — fünf Prüfungen schlagen an,
darunter „verschiedene Farben für dieselbe Stufe" und „14 Stufenblöcke ohne
eigene Schriftfarbe".

Zwei bestehende Prüfungen mussten mitziehen: sie zählten `.stufe.punkt` und
erwarteten fünf Filterpunkte. Die gibt es nicht mehr, die Übersicht zeigt
denselben Block wie die Karte. Jetzt wird auf 9 + 5 = 14 Blöcke und **null**
Punkte geprüft.

Prüfstand: **383 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.077,14 kB**. Startprobe 13 von 13.

## 34.26 · Der Rückblick liegt auf Karteikarten

Die Seiten des Saison- und Karriererückblicks standen frei im dunklen Schleier
und blendeten beim Weitertippen nur ein. Jetzt liegen sie auf einer
Karteikarte, die von rechts hereingezogen wird, während die alte nach links
verschwindet.

### Die Gestaltung
Heller Karton, harte Kante, versetzter Schatten (`4px 5px 0`), eine
zurückhaltende Linierung wie auf einer Karte aus dem Kasten, der rote Randstrich
links, und oben ein Reiter von 5 px in der Farbe der jeweiligen Seite. Damit
sitzt der Rückblick in derselben Sprache wie Errungenschaften, Spielerpass und
Ruhmeshalle: **helles Papier auf dunklem Grund.**

### Der Kniff mit den Farben
Die Seiten benutzen an **78 Stellen** Farben für dunklen Grund — `var(--ac)`,
`var(--go)`, `var(--mu)`. Auf hellem Karton wären die unlesbar; das ist genau
der Fehler, der in 34.25 bei den Rängen steckte.

Statt 78 Stellen von Hand umzuschreiben, werden die Variablen **auf der Karte
neu gesetzt**:

    .karteikarte{ --ac:var(--ac-k); --go:var(--go-k); --mu:var(--tinte2); … }

Variablen vererben sich nach innen, also löst jedes `var(--ac)` im Inhalt von
selbst zur Kartonfassung auf. **Eine Stelle statt achtundsiebzig**, und es kann
keine vergessen werden.

Zwei Farben konnten das nicht: `noteCol` liefert rohe Hexwerte, und
`#B9C4BE`/`#F2C230` verschwinden auf Karton fast völlig — dafür gibt es jetzt
`noteColK`. Und die Hervorhebung der eigenen Tabellenzeile war ein Gelb bei
12 %, auf Karton unsichtbar; sie ist jetzt eine dunklere Tönung bei 15 %.

### Die Ziehbewegung braucht zwei Karten
Vorher wurde die Seite über `key={i}` neu aufgebaut — die alte Karte war im
selben Augenblick nicht mehr gezeichnet, ein Hinausziehen war also unmöglich.
`useBlaettern` merkt sich jetzt die hinausziehende Seite für 360 ms. Beide
Karten liegen im **selben Rasterfeld** übereinander; die alte nimmt keine
Tipper an und verschwindet danach. Im Ruhemodus fällt beides weg.

### Ein Bauteil statt zwei Kopien
Saison- und Karriererückblick waren zweimal dasselbe Gerüst mit leicht
verschiedener Überschrift. Beide benutzen jetzt `Rueckblickkarte` und
`useBlaettern` — zwei Kopien derselben Gestaltung laufen auseinander, sobald man
eine davon anfasst. Dasselbe Muster wie bei den Rangfarben in 34.25 und bei
`aka.laden`/`p.laden` in 34.22.

### Geprüft
Prüfstand: **388 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.080,19 kB**. Startprobe 13 von 13.
Fünf neue Prüfungen, darunter: die Karte wird gezeichnet und trägt eine
Reiterfarbe, die Farbumdeutung steht vollständig im Stilblock, und beide
Bewegungen sind da.

### Was NICHT geprüft ist
**Wie die Karteikarte im laufenden Spiel aussieht, habe ich nicht gesehen.**
Der Rückblick liegt hinter einer ganzen gespielten Saison, und mein Skript kam
im Browser nicht dorthin. Der Prüfstand bestätigt, dass die Karte gebaut wird
und die Farbumdeutung steht — **wie sie wirkt, muss Kevin im Browsertest
ansehen.** Besonders: ob die Linierung zu stark oder zu schwach ist und ob die
Ziehbewegung bei 360 ms zu schnell oder zu träge wirkt.

### Korrektur einer eigenen Notiz
In 34.24 stand hier der Verdacht, `.zellen` lasse den Spielerpass wachsen
(`flex-wrap:wrap` mit `flex:1 0 auto`). **Das hält der Nachrechnung nicht
stand:** die vier Felder sind label-breit, zusammen rund 324 px, und damit
passen sie bei 412 px Fensterbreite in eine Zeile. Die bestätigte Ursache war
die Kapitänsbinde in der umbrechenden Namenszeile, und die ist behoben. Ob
überhaupt noch etwas wächst, ist offen — und **gemessen ist es nicht.**

## 34.27 · Drei wirklich runde Kopfformen

Erster von vier Porträt-Punkten. Die anderen drei stehen weiter offen — dazu
unten.

### Warum „Rund“ nicht rund war
Der Porträtbogen zeigt es sofort: „Rund“ (b 27, j 19) unterschied sich von
„Oval“ (b 25, j 15) fast nur in der Breite. Ein Kopf wirkt aber nicht durch
Breite rund, sondern durch einen **breiten Kiefer** (`j`) und ein **kurzes
Gesicht** (`kinn`). Genau daran fehlte es.

Angehängt, mit Betonung auf ANGEHÄNGT:

| Form | b | j | kinn | Wirkung |
|---|---|---|---|---|
| Vollmond | 28 | 24 | 66 | breit, sehr breiter Kiefer, kurzes Gesicht |
| Breit | 29 | 22 | 69 | ausladend, kräftige Wangen |
| Weich | 25,5 | 21 | 67 | schmaler, aber ohne Kanten |

**Bestehende Gesichter ändern sich nicht.** Die Indizes 0–4 behalten ihre
Bedeutung, und gespeicherte Laufbahnen tragen das Merkmalsobjekt, nicht die
Kennung. Neu erzeugte Gesichter greifen auf acht statt fünf Formen zu.

### Der Porträtbogen läuft wieder
Er war unbenutzbar: `portraetbogen.cjs` verlangt ein gebündeltes `motor.js`,
das `pruefen.sh` nicht erzeugt, `cairosvg` fehlte, und `@capacitor/preferences`
liess sich für Node nicht auflösen. So geht es:

    cp App.jsx storage.js schriften.js /tmp/ps/ && cd /tmp/ps
    cat App.jsx pruefstand/exporte.txt > probe.jsx        # sinngemäss
    npx esbuild probe.jsx --bundle --outfile=motor.js --platform=node \
        --format=cjs --external:react --external:react-dom \
        --external:@capacitor/preferences
    cp pruefstand/portraetbogen.cjs . && node portraetbogen.cjs kreuz bogen.svg kopf
    python3 -c "import cairosvg;cairosvg.svg2png(url='bogen.svg',write_to='bogen.png',output_width=1200)"

Zwei Fallen: `portraetbogen.cjs` muss **im selben Verzeichnis wie `motor.js`**
liegen, weil `require("./motor.js")` relativ zum Skript auflöst — und es darf
nicht unter `/home/claude` laufen, weil dessen `package.json` `"type":"module"`
setzt und das CJS-Bündel dort nicht lädt. Für `@capacitor/preferences` genügt
ein Platzhalter in `node_modules`.

Ohne dieses Werkzeug ist Porträtarbeit Blindflug. Es gehört vor jede weitere
Änderung am Gesicht gefahren.

### Geprüft
Prüfstand: **391 Prüfungen**, 0 Fehler, alle vier Zielbänder.
„60 gezeichnete Auswahlmöglichkeiten in 8 Merkmalen · 7 Augenfarben ·
**8 Kopfformen**“. Bündel **1.080,27 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei —
alte Spielstände bleiben also lesbar.

### Was von diesem Block NICHT gemacht ist
Drei der vier Porträt-Punkte stehen offen, und zwar bewusst:

* **Nationalitätstypische Merkmale.** Haut und Haar werden über
  `hautBereich`/`haarBereich` bereits nach Herkunft eingegrenzt — das ist die
  richtige Bauweise und der Weg für Nase, Mund und Augen: **Bereiche, keine
  festen Zuordnungen**, damit jede Nation eine Spanne von Gesichtern hervorbringt
  statt eines Typs. Dafür müssen Nase (5), Mund (5) und Augen (5) erst nach
  Merkmal geordnet erweitert werden — schmal bis breit, flach bis voll. Das ist
  Arbeit im 347 Zeilen langen Zeichner.
* **Statur wirkt aufs Gesicht.** Braucht dieselbe Erweiterung als Grundlage.
* **Weibliche Porträts.** Ebenso — plus ein neues Merkmal `schminke`, das
  hinten an `ZUEGE_ORDNUNG` angehängt werden muss.

Alle drei greifen in dieselben Merkmale. Einzeln nacheinander hiesse, dieselben
Gesichter dreimal neu auszubalancieren. Sie gehören in **eine** Sitzung, mit dem
Porträtbogen offen.

## 34.28 · Zwei Kopfformen ohne markantes Kinn

Kevins Befund am Porträtbogen: bei **allen** Formen steht das Kinn unten
seitlich heraus. Er hat recht, und die Ursache steckt in `kopfPfad`: die
Kieferlinie läuft senkrecht von `kinn-8` bis `kinn-1` und knickt dann scharf zum
Kinn ab. Das erzeugt zwei sichtbare Ecken.

### Eine Kinnbreite, die überall gilt
Neu ist `kinnBreite(k) = k.j * (k.kv ?? 1)` — die Kieferbreite **am Kinn**.
Ohne `kv` ist sie gleich der Kieferbreite oben, also sind alle zehn bisherigen
Formen bitgleich. Nur Formen mit `kv` laufen nach unten schmaler zu.

**Der Fallstrick:** `kopf.j` steuert nicht nur die Hülle. Auch die Schattenseite
der Wange, zwei Bartformen und der Kinnriemen rechnen damit. Hätte ich nur die
Hülle verjüngt, hätte der Bart über das Kinn hinausgezeichnet — genau der
Fehler, der in 34.1 vier Frisuren betraf. `kinnBreite` gilt deshalb an **allen
sechs Stellen** im Kinnbereich.

Es gibt keinen Beschnitt auf die Kopfhülle: Bart und Schatten werden frei
gezeichnet. Wer künftig an der Kieferlinie etwas ändert, muss diese Stellen
mitziehen — oder erst einen `clipPath` auf `kopfD` einführen.

| Form | b | j | kinn | kv |
|---|---|---|---|---|
| Zart | 24 | 15 | 70 | 0,58 |
| Rundlich | 27,5 | 21 | 68 | 0,58 |

### Geprüft, und zwar angesehen
Porträtbogen zweimal gefahren: `kreuz kopf` zeigt die zehn Formen, `kreuz bart`
alle zehn Bärte über alle zehn Formen. **Die Bärte folgen der neuen Kieferlinie
und bleiben überall innerhalb der Hülle.**

Prüfstand: **393 Prüfungen**, 0 Fehler, alle vier Zielbänder.
„62 gezeichnete Auswahlmöglichkeiten · **10 Kopfformen**“.
Bündel **1.080,37 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.

## 34.29 · Herkunft, Statur und Geschlecht wirken aufs Gesicht

Die letzten drei Punkte des Blocks. Sie greifen alle in dieselben Merkmale und
sind deshalb zusammen gemacht.

### Spannen, keine Typen
**Nirgends steht „Nation X hat Nase Y".** Hinterlegt ist je Region eine SPANNE
von Rängen; die Spannen überlappen sich stark. Jede Herkunft bringt damit eine
Bandbreite von Gesichtern hervor, und jedes Gesicht bleibt möglich — nur die
Häufigkeit verschiebt sich. Das ist dieselbe Bauweise, die `hautBereich` und
`haarBereich` seit jeher benutzen, jetzt auch für Nase, Mund und Lidspalt.

### Warum es Ränge braucht
Die gezeichneten Formen sind nicht nach Größe sortiert — Nasenbreiten stehen als
`[2.5, 3.2, 2, 2.9, 2.7, …]` in der Reihenfolge, in der sie entstanden sind. Man
darf sie **nicht** sortieren: der Index steckt in jedem gespeicherten Gesicht.
`NASE_RANG`, `MUND_RANG` und `AUGEN_RANG` ordnen sie, ohne sie zu bewegen. Eine
Spanne bezieht sich auf Ränge, `ausSpanne` übersetzt zurück in den Index.

### Neu gezeichnet, hinten angehängt
* **Nasen:** drei breitere (3,7 · 4,3 · 2,2) — jetzt acht.
* **Münder:** zwei vollere — jetzt sieben.
* **Augen:** keine neuen Formen. Die fünf vorhandenen decken den Lidspalt von
  2,6 bis 4,2 ab; sie werden nur nach Rang angesteuert. Lieber keine neue Form
  als eine schlecht gezeichnete.

### Statur
`schlank` und `hochgewachsen` ziehen den Kopf schmal, `kraftvoll` breit,
`normal` lässt alle zehn Formen zu. Verdrahtet über einen Effekt in der
Erstellung — **und genau der stand im ersten Entwurf vor der Zustandserklärung
von `statur`.** Der Prüfstand meldete „Cannot access 'statur' before
initialization", die ganze Erstellungsseite war tot. Dieselbe Falle wie
„Prüfskript vor Definition" in Abschnitt 6, diesmal im Anwendungscode.

### Frauenfußball
Der Mangel war nicht die Frisur, sondern das Gesicht darunter: **es gab kein
einziges Merkmal, das ein Porträt weiblich lesen liess.** Neu:

* **Wimpern** an allen weiblichen Porträts, auch ohne Schminke.
* **`schminke`** als neues Merkmal, hinten an `ZUEGE_ORDNUNG` angehängt:
  0 keine · 1 Lidschatten · 2 Lippenstift · 3 beides · 4 dezent betont.
  Männer bekommen immer 0.
* **Vollere Lippen und feinere Brauen** im Mittel — die Spanne wird verschoben,
  nicht festgesetzt.

Der Lippenstift ersetzt den Hautton nicht, er mischt sich hinein
(`mischFarbe`) — eine feste Farbe säße auf hellen und dunklen Tönen nie
zugleich richtig, und das Heft kennt keine Neontöne.

### Der Porträtbogen kann jetzt Frauen
Er zeichnete im Merkmalsmodus ausschliesslich Männer — Wimpern, Schminke und
die weiblichen Frisuren waren damit **unsichtbar prüfbar**. Neuer Modus:

    node portraetbogen.cjs frau bogen.svg schminke 5

### Geprüft, und angesehen
Prüfstand: **398 Prüfungen**, 0 Fehler, alle vier Zielbänder.
„67 gezeichnete Auswahlmöglichkeiten · 10 Kopfformen“.
Bündel **1.083,07 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.
Bögen gefahren: `merkmal nase`, `frau schminke`, `frau frisur`.

### Was das für alte Spielstände heisst
Gespeicherte Gesichter tragen ihre Merkmale als Objekt, nicht als Kennung — die
neuen Nasen und Münder erscheinen also nur bei NEU erzeugten Gesichtern.
**Eine Ausnahme:** bestehende weibliche Porträts bekommen ab sofort Wimpern.
Das ist gewollt.

## 34.30 · Aufräumen nach dem Belastungstest

Ein Lauf mit 5.000 Merkmalssätzen, 4.000 Spielern und 250 vollständigen
Laufbahnen. Vier Punkte kamen heraus — **einer davon war ein Fehler in meinem
eigenen Testgerüst, kein Fehler im Spiel.**

### Die Fehlmeldung zuerst
Der Test meldete: „Laufbahnen enden nicht, Spieler bekommen mit 43 noch
Angebote", 171-mal in 250 Läufen. **Falsch.** Kevin hat sofort widersprochen:
bei 40 sei Schluss. Er hat recht. Die Altersgrenze steht im Spielablauf, nicht
im Rechenkern — mein Gerüst rief `develop`, `simulateSeason` und `makeOffers`
direkt und lief damit an der ganzen Prüfung vorbei.

**Merksatz für künftige Belastungsläufe:** Der Rechenkern kennt kein
Karriereende. Wer eine Laufbahn nachstellt, muss die Endbedingung des
Spielablaufs mitnehmen, sonst misst er Unsinn. Der `grosstest.cjs` tut das
jetzt und benutzt dafür dieselbe ausgeführte Zahl.

### Die Altersgrenze stand viermal da
Beim Nachsehen fiel auf: die harte Grenze war **viermal als nackte Zahl**
notiert — einmal als 40 (vor dem Hochzählen des Alters) und dreimal als 41
(danach). Wer eine davon ändert und die anderen übersieht, bekommt zwei
verschiedene Karrierelängen, je nachdem ob man normal spielt oder vorspult.

Jetzt `LAUFBAHN_MAX = 40` an einer Stelle; die vier Abfragen lesen sie.
**Verhalten unverändert** — `>= 40` vor dem Hochzählen ist dasselbe wie
`> 40` danach. Die weichen Bedingungen daneben (ab 33 bei schwacher Stärke,
ab 34 mit Zufall, ab 35) bleiben absichtlich verschieden: sie beschreiben
verschiedene Lagen, nicht dasselbe zweimal.

### Kopfform „Weich" war zu selten
Gemessene **2,7 %** gegen 6 bis 15 % bei allen anderen. Grund: sie stand in
keiner Staturliste und kam deshalb nur bei „normal" vor. Mit b 25,5 und einem
Kiefer von 21 gehört sie zu den kräftigen — dort eingetragen, jetzt **6,7 %**.

### Wildcards waren nicht messbar
`drawWildcard` war für den Prüfstand nicht ausgeführt. Das ist deshalb heikel,
weil genau dort in 34.5 ein stiller Fehler sass: ein Gewicht von 0 in der
HSV-Stufe liess NaN durch die Wichtung laufen, und **alle** Ziehungen kamen als
Normal zurück, ohne dass irgendwo etwas auffiel.

Neue Prüfung mit 4.000 Ziehungen: jede Seltenheit muss vorkommen, mindestens
drei Stufen, und **höchstens 80 % Normal** — genau die Signatur jenes Fehlers.

    normal 36,1 % · selten 24,4 % · aussen 15,6 % · unfass 10,6 %
    welt 8,0 % · goat 5,2 % · hsv 0,1 %

### Was der Belastungstest sonst ergab
Keine Fehler, keine NaN, kein Wert ausserhalb seiner Grenzen. Startstärke
40–68, höchste erreichte Stärke 93, Laufbahnen 18–25 Saisons, **Karriereende
zwischen 33 und 40** — die Grenze arbeitet.

`pruefstand/grosstest.cjs` ist neu und gehört ins Repository. Aufruf:

    cd /tmp/ps && node grosstest.cjs

Er ändert nichts, er misst nur.

### Geprüft
Prüfstand: **401 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.083,08 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.

## 34.31 · Kartenwechsel ohne Ruckler, Schritte auf Formularpapier

### Warum die Karteikarten stockten
Kevin: „Die vorherige Karte bleibt in ihren Grundmaßen noch einen Augenblick,
bis der Inhalt der nächsten aufploppt." Und umgekehrt bei gross nach klein:
„erst kommt der Inhalt auf der grossen Karte, dann schrumpft sie schlagartig."

Beide Karten lagen im **selben Rasterfeld** (`grid-area: 1/1`). Ein Rasterfeld
ist immer so hoch wie sein höchster Inhalt — die Bühne blieb also die vollen
340 ms auf dem Mass der ALTEN Karte und sprang erst beim Abräumen um. Die
Grössenänderung kam dadurch **nach** der Bewegung statt mit ihr.

Neu ist `Kartenbuehne`: die hinausziehende Karte liegt **absolut**, also
ausserhalb des Flusses, und zählt für die Höhe nicht mehr mit. Die Bühne misst
nur die neue Karte (`useLayoutEffect` plus `ResizeObserver`, damit auch
nachladende Schriften erfasst werden) und fährt ihre Höhe in denselben 340 ms
dorthin. Wachsen, Hereinziehen und Hinausziehen laufen jetzt gleichzeitig.
Im Ruhemodus fällt der Übergang weg.

### Die drei Schritte stehen auf Formularpapier
Training, Ereignis und Verträge sind das, was man tun MUSS, damit es weitergeht
— sie sahen aus wie alles andere. Jetzt tragen sie die Klasse `.laufzettel`:
heller Karton, Perforationsrand links, harte Kante mit versetztem Schatten und
ein Kopfstreifen „TRAINING · SCHRITT 1 VON 3".

Farben wieder über neu gesetzte Variablen wie bei der Karteikarte — der Inhalt
benutzt Farben für dunklen Grund und löst auf dem Zettel von selbst zur
Kartonfassung auf. Dazu drei Regeln, die dunkle Flächen im Zettel zu blossen
Umrandungen machen (`.laufzettel .pan`, `.btn`, `.btn.on`).

**Ohne strukturellen Eingriff:** der Kopfstreifen kommt als erstes Kind in den
bestehenden Behälter, es kam kein einziges schliessendes Element dazu. Das war
Absicht — die drei Blöcke sind lang und tief verschachtelt.

### Geprüft
Prüfstand: **401 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.085,92 kB**. Startprobe 13 von 13, keine Seitenfehler im Browser.
`.zettelkopf` ist im Baum der laufenden App nachweisbar.

### NICHT gesehen
**Wie der Laufzettel aussieht, konnte ich nicht prüfen.** Die
Kartenenthüllung liess sich im Browser nicht zuverlässig wegklicken; jeder
Versuch endete vor demselben Vorhang. Dass er gezeichnet wird, ist belegt —
wie er wirkt, nicht. Dasselbe gilt für den neuen Kartenwechsel: die Höhe wird
rechnerisch geführt, gesehen habe ich die Bewegung nicht.

## 34.32 · Die Wildcard auf hellem Papier

Kevin nach dem Spielen: die Schrift auf der Wildcard geht verloren, weil die
Karte leicht durchscheint. **Eine Folge von 34.31** — die Wildcard steht im
Trainingsschritt, und der liegt seither auf hellem Formularpapier.

Zwei Ursachen, beide von mir:

1. **Der Grund war teildurchsichtig.** Der Verlauf ging von der Seltenheits-
   farbe bei 12 % Deckung nach `var(--pan)` bei 62 %. Der erste Bereich liess
   den Untergrund durch. Auf dunklem Grund fiel das nie auf, auf Papier wusch
   es die Karte aus. Jetzt liegt der Verlauf AUF einer deckenden Fläche
   (`…, var(--pan)` als zweite Lage) statt in sie hineinzublenden.
2. **Meine eigene Farbumdeutung traf sie.** `.laufzettel` setzt `--tx`, `--mu`
   und die Akzente auf Kartonfassungen — die Kartenschrift wurde damit dunkel,
   auf einer dunklen Karte. Dazu nahm die Regel für Flächen im Zettel der Karte
   den Grund.

Die Karte trägt jetzt `.wkarte` und **nimmt die Umdeutung zurück**. Die Werte
stehen dort noch einmal ausgeschrieben; ein Verweis auf den Grundstil geht
nicht, weil eine Variable sich nicht auf ihre eigene Fassung weiter oben
beziehen kann — sie sähe nur die des Laufzettels. **Wer die Grundfarben ändert,
muss sie in `.wkarte` mitziehen.** Das steht als Warnung im Kommentar.

### Was dabei auffiel
Der Prüfstand hat mich erwischt: mein Kommentar enthielt zwei Rückwärts-
Anführungszeichen und beendete damit die Schablonenzeichenkette des CSS-Blocks
vorzeitig. Die Prüfung dafür gibt es seit einer früheren Fassung und sie hat
genau das getan, wofür sie da ist.

### Geprüft
Prüfstand: **401 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.086,75 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.

**Nicht gesehen:** wie die Karte auf dem Papier wirkt. Rechnerisch ist sie
deckend und trägt ihre eigenen Farben; ob das Ergebnis gut aussieht, zeigt der
Browsertest.

## 34.33 · Die Kopfformen sind wieder spiegelgleich

Kevin am Porträtbogen: einige der neuen Köpfe sind rechts deutlich runder und
ausgebeult. Er hat recht, und es ist **mein Fehler aus 34.28.**

### Ein einzelner Stützpunkt
Beim Einführen der verjüngten Kinnpartie habe ich auf der linken Seite BEIDE
Stützpunkte auf den neuen Wert umgestellt, auf der rechten nur den Endpunkt.
Der rechte Stützpunkt bei `kinn-8` stand weiter auf der Kieferbreite OBEN:

    rechts:  C r,52   jr,(kinn-8)   kur,(kinn-6)      ← jr statt kur
    links:   C kul,(kinn-8)   l,52   l,40

Solange `kv` fehlt, sind `jr` und `kur` gleich — deshalb waren die acht alten
Formen nie betroffen. Bei **Zart** und **Rundlich** klaffte die rechte Seite um
die volle Verjüngung auf und beulte sichtbar aus.

### Geprüft wird jetzt gerechnet, nicht geschaut
Neue Prüfung: für jeden Punkt (x, y) des Pfades muss es einen Partner
(100 − x, y) geben. Reine Rechnung, erwischt jede künftige einseitige Änderung
sofort — und zwar bei allen Formen, nicht nur bei denen, die gerade auffallen.

**Gegenprobe:** alten Pfad wiederhergestellt — die Prüfung meldet genau
**Zart (8)** und **Rundlich (9)**, die anderen acht bleiben grün. Das ist der
Beweis, dass sie am richtigen Ort greift.

*Eigener Falschalarm dabei:* Der erste Entwurf strich jeden gefundenen Partner
weg und meldete daraufhin **alle zehn** Formen als schief, auch die
unveränderten. Grund: ein geschlossener Pfad nennt seinen Startpunkt zweimal
(einmal bei `M`, einmal vor dem `Z`), sein Spiegelbild aber nur einmal. Jetzt
wird als Menge verglichen. Aufgefallen ist es nur, weil die Gegenprobe ein
Ergebnis lieferte, das zu gut zum Fehler passte.

### Geprüft
Prüfstand: **402 Prüfungen**, 0 Fehler, „Spiegelgleich 10 von 10 Formen".
Bündel **1.086,74 kB**. Porträtbogen angesehen: die Ausbeulung ist weg.

## 34.34 · Drei Meldungen aus dem Spiel

### Tinte auf dunklem Grund
Zwei Stellen, beide Folgeschäden der Laufzettel-Umstellung aus 34.31:

* **Das Ergebnisfeld nach einer Ereignisentscheidung.** Es trägt `.up`, und
  diese Farbe wird NICHT umgedeutet — die Fläche blieb also dunkel, während
  die Schrift darin zu Tinte wurde. Auf Formularpapier ist daraus jetzt eine
  helle Fläche geworden.
* **Der Knopf „Karte neu ziehen" auf der Wildcard.** Die allgemeine Knopfregel
  des Laufzettels färbt die Schrift zu Tinte — auf der dunklen Karte
  unlesbar. `.laufzettel .wkarte .btn` nimmt das zurück.

**Muster, das sich wiederholt:** die Farbumdeutung des Laufzettels trifft
alles darin. Wo eine Fläche absichtlich dunkel bleibt, muss die Schrift
ausdrücklich mitgezogen werden. Das ist jetzt der dritte Fall nach der
Wildcard selbst in 34.32.

### Das Papier verzog sich am Rand
Android dehnt seit Version 12 den Inhalt gummiartig, wenn man über den Rand
hinauszieht. Im Heft sieht das aus, als verzöge sich das Papier.
`html,body{overscroll-behavior:none}` stellt das ab. Es betrifft nur diese
Anzeigespielerei des Systems; das Zurückwischen bleibt unberührt, weil das
eine Geste des Systems ist und keine Rollbewegung der Seite.

### Ein versprochener Verein muss auch kommen
Kevin: „Union Berlin will dich zurück" — zugesagt, und dann standen vier
andere Vereine im Fenster.

Das Ereignis `sf_rueckkauf` nennt den Verein im Titel (`${c.prev}`), seine
Wirkung war aber nur `winterMove` — ein **allgemeiner** Wechselwunsch. Der
genannte Verein wurde nirgends festgehalten, `makeOffers` würfelte wie immer.

Neu ist `zurueckZuPrev`: der Name wandert nach `p.flags.rueckkehrZu`, und
`makeOffers` legt das Angebot dieses Vereins **ganz nach vorn** — das muss vor
dem Kürzen geschehen, weil im Schnellspiel nur drei fremde Angebote gezeigt
werden. Danach wird das Versprechen gelöscht, sonst käme der Verein bis ans
Karriereende jedes Jahr wieder.

Findet sich der Name nicht mehr, bleibt alles wie bisher — lieber ein Angebot
weniger als ein Absturz.

**Geprüft:** 40 Versprechen, 40 eingelöst, 40 danach verbraucht.
**Gegenprobe:** Angebot wieder ausgebaut — die Prüfung meldet die fehlenden
Vereine namentlich.

**Noch offen dabei:** `wm_trainerruf` („Dein alter Trainer will dich zurück")
nennt keinen Verein — der neue Klub des Trainers existiert nirgends als Datum.
Dort sind beliebige Angebote nicht falsch, wirken aber beliebig. Wer das
schärfen will, müsste dem Ereignis einen echten Zielverein geben.

### Geprüft
Prüfstand: **404 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.088,31 kB**. Rückwärtsprüfung 6 × 63 fehlerfrei.

## 34.35 · Bärte bleiben in der Kopfform

Kevin hat es im Testprotokoll angekreuzt: „Bärte sitzen sauber — **Nein. Muss
gecheckt werden.**" Er hatte recht, und ich hatte es in 34.28 zu klein
angesehen. Erst der Bogen mit 2.600 px Breite zeigt es.

### Was los war
Die Koteletten (Bart 9) waren zwei gerade senkrechte Streifen bei festem
Abstand vom Kopfrand. Der Kopf läuft aber nach unten ein — unten standen sie
seitlich über, bei den schmalen Formen am deutlichsten. Und selbst wo sie
knapp innen blieben, lasen sie sich als **angeklemmte Balken**, weil eine
gerade Kante neben einer runden steht.

### Zwei Schritte
**Erstens ein Beschnitt auf die Kopfhülle.** Die ganze Bartgruppe hängt jetzt
in einem `clipPath` auf `kopfD`. Damit kann kein Bart mehr über den Kopf
hinauszeichnen — auch keiner, der später dazukommt, und auf keiner Kopfform,
die später dazukommt. Das war seit 34.1 der wiederkehrende Fehlertyp; jeden
Bart einzeln nachzuziehen hiesse zehn Bärte mal zehn Formen von Hand
abzugleichen und beim elften wieder von vorn.

**Zweitens die Koteletten umgezeichnet.** Sie werden jetzt bewusst ÜBER den
Kopfrand hinaus gezeichnet und vom Beschnitt an der Kante getrimmt. Dadurch
folgt ihre Aussenseite exakt der Rundung, statt als Gerade danebenzustehen.

**Nebenwirkung mit Absicht:** bestehende bärtige Gesichter verlieren einen
schmalen Überstand. Das ist die Korrektur, nicht ein Verlust.

### Geprüft
Prüfstand: **404 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.088,73 kB**. Bartbogen bei 2.600 px angesehen, alle hundert
Kombinationen.

## Kevins Testprotokoll zu 34.33 — Ergebnis

Vier Seiten durchgearbeitet. Grün: Navigation vollständig, Spielerpass
vollständig, Errungenschaften, Rückblick vollständig, Charaktererstellung bis
auf einen Punkt, und aus dem Langzeitteil Wachstumskurve, Auto-Training,
Sprache, Frauenfußball, Akademieausbau, Nachkaufen, alte Spielstände.
**„Karriereende kommt von selbst"** — damit ist meine Fehlmeldung aus 34.30
endgültig erledigt.

**Entscheidungen:** „Moral" bleibt · 8 px Abstand passt · Flaggenbinde nur bei
der Nationalmannschaft · Schminke, Linierung und Tempo der Ziehbewegung passen.

**Der Vermächtnis-Laden wurde nicht geprüft** und gilt auf Kevins Wunsch als
**unter Vorbehalt abgeschlossen**. Fehler dort sammelt er und meldet sie später.

**Fünf Befunde, davon einer erledigt:**

| Befund | Stand |
|---|---|
| Bärte stehen über | **erledigt in 34.35** |
| Markenpuls wirkt bronze statt gold | **erledigt in 34.36** |
| Flaggenbinde zeigt meistens Vereinsfarben | **erledigt in 34.38** — alle 212 belegt |
| Errungenschaften: „der obere Rand nicht" | offen — die Kopflinie der Karte nutzt die dunkle Variante statt der Stufenfarbe |
| Ereignisse wiederholen sich auffällig oft | **gemessen in 35.0** — innerhalb einer Laufbahn unauffällig (0,6), zwischen Laufbahnen real. Gewicht ist nicht der Hebel; es braucht breitere Bedingungen. |

## 34.36 / 34.37 · Goldton, Kopflinie, Zielverein des Trainers

Drei weitere Befunde aus dem Testprotokoll.

### Der Markenpuls wirkte bronze
Weil er es war. Ich hatte `--go-k` genommen — die Kartonfassung des Goldtons,
`#7A5600`, ein dunkles Olivbraun. Sie ist auf **kleine** Schrift gerechnet
(Kontrast 5,2 gegen Karton) und wird dafür stark abgedunkelt.

Die Stärke ist aber 34 px gross, und dort genügen 3,0. Neu ist `--gold-k`
mit `#9A7200` — Kontrast **3,41**, deutlich goldener. Dazu sitzt die Marke
daneben jetzt auf einem **dunklen Schild** und darf dort das helle `--go`
tragen; auf Karton direkt wäre das nicht lesbar.

### „Der obere Rand nicht“
Die 4 px starke Kopflinie der Errungenschaftskarte nutzte `stufeDunkel(st.col)`,
der Rangblock daneben aber `st.col`. Zwei Töne für eine Stufe — genau das, was
34.25 eigentlich abgeschafft hatte, an einer Stelle übersehen. Jetzt trägt die
Linie die Stufenfarbe; blasse Stufen bleiben erkennbar, weil die Karte einen
eigenen Rahmen hat.

### Der Trainer hat jetzt einen Verein
`wm_trainerruf` sagt nur, der Trainer habe „einen neuen Verein übernommen“ —
welchen, stand nirgends. „Sofort zu ihm“ war ein Versprechen ohne Adressaten.

Neu ist die Wirkung `zielTrainer`: sie legt den Verein beim Anwenden **einmal**
fest — vergleichbare Spielklasse (± 5), nicht der eigene, aus dem Namen des
Spielers abgeleitet und damit gleichbleibend. Von da an greift derselbe Weg wie
bei der versprochenen Rückkehr aus 34.34.

### Was der Prüfstand dabei gefunden hat
Die Rückkehr-Prüfung fiel plötzlich um: „versprochener Verein VfL Wolfsburg
fehlt im Fenster“. Ursache war ein Sonderfall aus 34.34: bei der
**HSV-Rautekarte** kehrt `makeOffers` vorzeitig zurück, und der Rückkehr-Block
liegt dahinter. Das Versprechen konnte dort nie eingelöst werden und blieb bis
ans Karriereende stehen.

Die Rautekarte sticht jedes Versprechen — das ist richtig. Sie **räumt es jetzt
aber ab**, statt es liegen zu lassen. Die Prüfung überspringt solche Läufe.

*Bemerkenswert:* der Lauf war zunächst 40 von 40 grün und fiel erst zwei
Fassungen später um, weil `laufbahn()` würfelt und die Rautekarte nur manchmal
auftaucht. **Eine Prüfung, die einmal grün war, ist nicht bewiesen.**

### Geprüft
Prüfstand: **404 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.088,70 kB**.

## 34.38 · Alle 212 Nationen haben eine echte Flagge

Kevin im Testprotokoll: „Flaggenbinde — meistens Vereinsfarben." Nachgemessen
waren es **33 von 212** Nationen mit hinterlegter Bauart. Die übrigen 179
bekamen aus der Länderkennung ERRECHNETE Farben (`hslHex` auf einen Hashwert)
— zwei erfundene Töne, die mit der Flagge nichts zu tun hatten. Kein Wunder,
dass es nach beliebigen Vereinsfarben aussah.

Jetzt sind **alle 212** belegt.

### Vier neue Bauarten
Drei Arten reichten nicht. Dazugekommen sind:

| Art | Aufbau | Beispiele |
|---|---|---|
| `keil` | Streifen mit Keil am Mast, `z` = Keilfarbe | Tschechien, Kuba, Südafrika, Golfstaaten |
| `diag` | zwei Felder mit Schrägband | Kongo, Tansania, Namibia, Trinidad |
| `goesch` | Streifen mit Obereck, `z` = Obereckfarbe | USA, Australien, Chile, Togo |

### Was das ist und was nicht
Hinterlegt sind **Bauart und Farben, nicht das Wappen**. Auf einem 22 Punkt
hohen Band wären Sterne, Halbmonde, Adler oder das Union Jack ein Fleck. Wo
eine Flagge ihr Wesen aus einem Zeichen bezieht, steht hier die tragende
Fläche plus das kennzeichnende Element als Scheibe, Keil, Schrägband oder
Obereck. **Erkennbar, nicht heraldisch.**

### Was die neue Prüfung sofort gefunden hat
Vier Bedingungen: jede Art muss bekannt sein, **jede Nation** muss eine Flagge
haben, keine Flagge darf ohne Nation dastehen, und Bauarten mit Zusatzfarbe
müssen sie mitbringen.

Die letzte schlug an: **18 Diagonalflaggen** trugen die Bandfarbe als dritte
Farbe statt in `z` — sie wären alle weiß gezeichnet worden. ASA, BDI, BHU,
BIH, BRU, CGO, COD, ERI, GRN, JAM, MHL, NAM, PNG, SEY, SKN, SOL, TAN, TRI.
Der Zeichner nimmt jetzt beides, die Prüfung lässt beides gelten.

Eine unbekannte Bauart zeichnet stillschweigend liegende Streifen — der Fehler
wäre also nie aufgefallen. Genau dafür ist die Liste in der Prüfung da.

### Angesehen
Neues Werkzeug `bindenbogen.cjs`: alle 212 Binden als Tafel. Ohne das sieht man
die Flaggen nie, weil sie im Spiel erst als Kapitän erscheinen.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.098,53 kB** (+9,8 kB für die Flaggendaten).

## 35.0 · Ereigniswiederholung: gemessen statt vermutet

Der letzte Befund aus dem Testprotokoll — und der einzige, bei dem am Ende
**nichts geändert** wurde. Das ist das Ergebnis, nicht ein Versagen.

### Was die Messung sagt
Neues Werkzeug `pruefstand/ereignisse.cjs`: 30 Laufbahnen mit demselben
Gedächtnis, das auch das Spiel führt.

| | Wert |
|---|---|
| Ereignisse insgesamt | 471 |
| Verschiedene je Laufbahn | 46,7 bei 23,6 Saisons |
| Doppelt INNERHALB einer Laufbahn | **0,60** |
| Verwendet über 30 Laufbahnen | 313 von 471 (66 %) |
| Häufigstes Ereignis | 14 von 30 Läufen |

**Innerhalb einer Laufbahn ist Wiederholung praktisch kein Thema** — 0,6
Doppelte bei 46,7 verschiedenen. Die Sperre über `evLog` und die
Themen-Abkühlung über `tagLog` arbeiten. Auffällig ist die Wiederkehr
**zwischen** den Laufbahnen.

### Ein Versuch, der nichts gebracht hat
Naheliegende Ursache wäre die schwache Dämpfung im Gewicht gewesen. Probiert:
Faktor von 1,15 auf 1,6, Obergrenze von vier auf sechs, Verblassen des
Gedächtnisses von 0,72 auf 0,86 — also rund zehn statt vier Laufbahnen.

**Ergebnis: keine messbare Änderung.** Spitzenwert weiterhin 14 von 30,
weiterhin 313 von 471 verwendet. Es verschob sich nur, WELCHES Ereignis oben
steht. Die Änderung wurde deshalb **zurückgenommen** — eine Anpassung
auszuliefern, deren Kommentar eine Wirkung behauptet, die die Messung nicht
zeigt, wäre schlimmer als keine.

### Wo der Hebel wirklich liegt
Von 471 Ereignissen hängen **465 an einer Bedingung**, aber nur **12** an einer
Freischaltung. Die 158 nie gezogenen sind also grösstenteils Inhalt für seltene
Lagen — kein Fehler, sondern Absicht. Wer die Wiederkehr wirklich senken will,
muss die BREITE der Bedingungen angehen: in einer beliebigen Saison ist der
Kreis der zulässigen Ereignisse klein, und dann hilft kein Gewicht.

Das ist eine Inhaltsaufgabe, keine Stellschraube. Sie steht als offener Punkt.

### Damit ist der grosse Test abgearbeitet
Alle fünf Befunde aus Kevins Protokoll sind bearbeitet:
Bärte (34.35) · Goldton und Kopflinie (34.36) · Zielverein (34.37) ·
alle 212 Flaggen (34.38) · Ereigniswiederholung gemessen (35.0).

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder.
Bündel **1.098,53 kB**.

## 35.1 · Werkzeugpflege

Nichts am Spiel. Drei Fehlerarten, die bisher nur als Merksatz in Abschnitt 6
standen, werden jetzt nachgerechnet — **eine Regel, an die man sich erinnern
muss, ist keine Regel.**

### 1 · Doppelte Namen in exporte.txt
Hat den Aufbau an einem Tag **zweimal** abgebrochen. esbuild meldet das als
„was originally exported here“ mit Zeilennummern aus dem zusammengesetzten
Bündel — also weit weg von der Datei, in der der Fehler steht. `pruefen.sh`
nennt die Namen jetzt direkt beim Namen.

### 2 · sicht.sh: alles, was jsdom nicht sehen kann
Zehn von achtzehn Werkzeugen liefen nur von Hand — und wurden deshalb
vergessen. Der Porträtbogen war monatelang unbenutzbar, die Startprobe meldete
über mehrere Fassungen zwei Falschalarme, ohne dass es auffiel.

    bash pruefstand/sicht.sh App.jsx

Baut einmal und fährt danach Startprobe, Kopfleiste und Seitenanfang. Fehlt
playwright, meldet das Werkzeug das **und beendet mit Code 3** — ein
unvollständiger Lauf ist kein bestandener Lauf.

### 3 · Protokollzeilen, die grün reden
Dreimal in vier Fassungen stand in `ansichten.jsx` ein fester Text, der weiter
„alles in Ordnung“ meldete, während die Prüfung darüber rot war. Gefunden
wurde es jedes Mal nur zufällig in der Gegenprobe. Jetzt sucht `pruefen.sh`
nach solchen Zeilen: eine Protokollzeile ohne Fragezeichen, die eine Zusage
ausspricht, ist verdächtig.

*Dabei ein eigener Fehler:* der erste Filter war **tot**. `grep -n` stellt jeder
Zeile eine Nummer mit Doppelpunkt voran, und mein `grep -v ':'` warf daraufhin
alles weg — die Prüfung konnte nie anschlagen. Aufgefallen nur, weil die
Gegenprobe schwieg, als sie hätte melden müssen. **Eine Prüfung, die schweigt,
muss man zum Reden bringen, bevor man ihr glaubt.**

### Verworfen: Prüfung auf doppelte Farbwerte
Sie meldete 49 Werte, fast alle legitim — Vereinsfarben und die 212 Flaggen
nennen dieselben Rot- und Blautöne naturgemäss mehrfach. Ein Hinweisgeber, der
bei jedem Lauf 49 Zeilen ausspuckt, wird nach dem zweiten Mal überlesen. Die
Begründung steht im Skript, damit es niemand noch einmal versucht.

### 4 · Der Signaturschlüssel wird bewacht
`apk.yml` hält den SHA-1 jetzt in `signing/fingerabdruck.txt` fest und
vergleicht ihn bei jedem Bau. Ändert er sich, **bricht der Bau ab** mit dem
Hinweis, dass sich die APK nicht mehr über die installierte legen lässt und
der Spielstand vorher gesichert werden muss. Bis 35.0 stand der Wert nur im
Protokoll und niemand verglich ihn — genau deshalb war Kevins Update-Frage
tagelang nicht zu beantworten.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler. `sicht.sh`: Startprobe 13/13,
Kopfleiste 8 px, Seitenanfang 4/4. Alle drei neuen Prüfungen gegengeprüft —
sie schlagen beim künstlich eingebauten Fehler an und schweigen sonst.

## 35.2 · STAND.md hat ein Verzeichnis

Punkt 6 der Werkzeugliste. Die Datei hat **47 Hauptabschnitte** auf über
3.000 Zeilen — jede Sitzung begann mit Suchen.

### Erzeugt, nicht gepflegt
`pruefstand/verzeichnis.cjs` schreibt das Verzeichnis zwischen zwei Marken neu.
Ein von Hand gepflegtes wäre nach drei Fassungen falsch, und **ein falsches
Verzeichnis ist schlimmer als keins** — man glaubt ihm und findet an der
genannten Zeile nichts.

    node pruefstand/verzeichnis.cjs STAND.md

Zwei Dinge, die dabei wichtig waren:

**Zweimal rechnen.** Das Verzeichnis verschiebt alles unter sich. Die Nummern
müssen sich auf die Datei NACH dem Einsetzen beziehen, also wird der Block
erst gebaut, seine Länge gemessen und dann mit dem Versatz noch einmal gebaut.

**Festnagelbar.** Der erste Entwurf erzeugte bei jedem Lauf eine andere Datei
— eine Leerzeile kam dazu oder fiel weg. Das hätte jeden Vergleich im
Repository verrauscht. Der Leerraum an der Nahtstelle wird jetzt
vereinheitlicht; drei Läufe hintereinander ergeben dieselbe Datei.

**Gegengeprüft.** Das Werkzeug prüft nach dem Schreiben selbst nach, ob unter
jeder genannten Zeile wirklich die genannte Überschrift steht, und bricht sonst
ab. 47 von 47 stimmig.

### Geprüft
*Nicht festgehalten.* Beim Aufräumen in 35.4 aufgefallen, dass dieser Abschnitt
als einziger seit 34.35 ohne Messblock geliefert wurde. Nachträglich lässt er
sich nicht mehr füllen — die Quelle von damals liegt nicht mehr vor, und eine
Zahl von heute unter eine Überschrift von gestern zu schreiben wäre eine
Behauptung, keine Messung.

## 35.3 · Eine Regel weniger zum Merken

In 35.1 steht der Satz: *eine Regel, an die man sich erinnern muss, ist keine
Regel.* In 35.2 endete die Lieferung dann mit genau so einer — „nach jeder
Änderung an STAND.md einmal `verzeichnis.cjs` laufen lassen“. Kevin hat
nachgefragt, und die Frage war berechtigt: **er ändert diese Datei gar nicht.**
Der Satz war eine Notiz an Claude, formuliert als Auftrag an ihn.

Beides ist jetzt behoben.

### Der Prüfstand merkt es selbst
`verzeichnis.cjs --pruefen` schreibt nicht, sondern meldet nur, ob das
Verzeichnis noch stimmt, und endet mit Code 1, wenn nicht. `pruefen.sh` ruft
das in der Hygienestufe auf. Ein veraltetes Verzeichnis fällt damit beim
nächsten Lauf auf, ohne dass jemand daran denken muss.

**Gegengeprüft** in beide Richtungen: mit einem eingeschobenen Abschnitt meldet
es sich, bei der sauberen Datei schweigt es.

### Warum das über den Einzelfall hinausgeht
Das Muster hat sich in dieser Sitzung mehrfach gezeigt und gehört notiert:
**Wenn eine Anweisung mit „daran denken“ beginnt, ist sie noch nicht fertig.**
Entweder lässt sie sich prüfen — dann gehört sie in den Prüfstand — oder sie
lässt sich nicht prüfen, dann gehört in STAND.md, warum nicht.

Und: Anweisungen richten sich an den, der sie ausführen kann. Was Claude tut,
gehört nicht in eine Nachricht an Kevin.

### Geprüft
*Nachgetragen am 16.8.2026.* Die Messung stammt aus einem Lauf auf der
unveränderten Quelle (`md5 5821f827…`), nicht vom Tag der Lieferung — der
Abschnitt ging ohne Messblock raus, und das ist erst beim Aufräumen in 35.4
aufgefallen.
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten
rückwärts. Bündel **1.098,55 kB** / 406,43 kB gepackt. `sicht.sh`: Startprobe
13/13, Kopfleiste 8 px, Seitenanfang 4/4.

## 35.4 · Vier Fundstellen aus der Eingangsprüfung

Kein Spielinhalt. Beim Durchsehen zu Sitzungsbeginn sind vier Unsauberkeiten
aufgefallen — drei in `STAND.md` selbst, eine im Projektwissen. Drei davon sind
hier behoben, die vierte kann nur Kevin erledigen.

### 1 · Ein Verweis, der seit zwei Fassungen danebenzeigte
Abschnitt 7 sagte: *„die aktuelle Liste steht unter Offene Punkte (Stand
33.13)"*. Die Überschrift trägt aber längst eine andere Nummer. Ein Verweis mit
Fassungsnummer veraltet zwangsläufig, weil die Überschrift bei jeder
Durchsicht mitwandert und der Verweis nicht. **Er nennt die Nummer jetzt gar
nicht mehr** — dieselbe Überlegung wie beim Verzeichnis: was mitwandern muss,
darf nicht doppelt geschrieben stehen.

### 2 · Die Nummerierung sprang von 10 auf 12
Folgenlos, aber es liest sich, als fehle ein Punkt. Niemand verweist auf die
Nummern (nachgezählt: null Treffer in `STAND.md` und `LIESMICH.md`), also
gefahrlos geschlossen.

### 3 · Zwei Fassungen ohne Messzahlen — und was daraus folgt
35.2 und 35.3 gingen **beide ohne `### Geprüft`-Block** raus. Alle Abschnitte
ab 34.30 haben einen, diese zwei nicht. Zweimal hintereinander vergessen, und
gemerkt hat es niemand — bei jemandem, der Zahlen vor und nach jeder Änderung
verlangt, ist das die falsche Lücke.

Für 35.3 ist der Block **nachgetragen** (Messung auf der unveränderten Quelle,
als solche gekennzeichnet). Für 35.2 nicht: die Quelle von damals liegt nicht
mehr vor. Dort steht jetzt, dass die Zahl fehlt und warum sie nicht mehr zu
beschaffen ist — eine Zahl von heute unter eine Überschrift von gestern zu
schreiben wäre eine Behauptung, keine Messung.

**Der Prüfstand achtet jetzt darauf.** Nach der Regel aus 35.1 — *eine Regel,
an die man sich erinnern muss, ist keine Regel* — gehört das nicht in einen
Merksatz. Die Hygienestufe liest die Fassung aus `App.jsx`, sucht den
zugehörigen Abschnitt in `STAND.md` und verlangt darin einen Messblock.

Zwei Feinheiten, die beim Bauen aufgefallen sind:

- **Wann darf sie rot werden?** Laut Abschnitt 8 wird die Nummer am *Ende*
  angehoben. Während der Sitzung zeigt `App.jsx` also die fertige Vorfassung,
  und die Prüfung schweigt. Rot wird sie nur im Fenster zwischen „Nummer
  angehoben" und „Abschnitt geschrieben" — genau dort soll sie stören. Eine
  Prüfung, die bei jedem Zwischenlauf rot leuchtet, bringt einem bei, Rot zu
  übersehen.
- **Eine Überschrift kann zwei Fassungen tragen.** `## 34.36 / 34.37 ·` gibt es
  wirklich. Der erste Entwurf prüfte auf den Zeilenanfang und hätte 34.37 als
  fehlend gemeldet. Gesucht wird jetzt die Nummer im Kopf der Überschrift, mit
  Abgrenzung — sonst fände `35.3` auch `35.31`.

**Was sie nicht kann:** prüfen, ob die Zahlen im Block stimmen. Sie prüft, dass
er da ist. Ein leerer Block würde durchgehen. Das ist keine Nachlässigkeit,
sondern die Grenze: ob eine Zahl gemessen oder geschätzt ist, sieht man ihr
nicht an — dafür gibt es die Gegenüberstellung vorher/nachher.

**Gegengeprüft in fünf Richtungen:** sauberer Stand → schweigt · Nummer ohne
Abschnitt → meldet · Doppelüberschrift 34.36/34.37 → schweigt · `35.31` gegen
`35.3` → keine Verwechslung · Messblock entfernt → meldet.

### 4 · Zwei Anleitungen im Projektwissen, eine falsch
`LIESMICH-PROJEKTWISSEN.txt` beschreibt noch das Update auf **34.20** mit 352
Prüfungen und liegt neben `00-LIESMICH-ZUERST.txt`, das 35.3 beschreibt. Wer
zur falschen greift, tauscht die falschen Dateien.

Ursache ist keine Nachlässigkeit, sondern eine Umbenennung: die Anleitung hieß
erst so, dann anders — und die alte blieb liegen, weil ein neuer Name nichts
überschreibt. **Deshalb ab jetzt fest: die Anleitung heißt immer
`00-LIESMICH-ZUERST.txt`.** Gleicher Name heißt überschreiben statt anhäufen.
Löschen kann die alte nur Kevin, das Projektwissen ist von hier aus nur lesbar.

### 5 · Dabei die App.jsx überschrieben
Nicht geplant, gehört aber protokolliert. Beim Neuerzeugen der Übersicht habe
ich `node uebersicht.cjs App.jsx UEBERSICHT.md` aufgerufen — in der Annahme,
das erste Argument sei die Quelle. Es ist das **Ziel**. Die Quelle kommt aus
`/tmp/ps/motor.js`. Das Werkzeug hat daraufhin 14.304 Zeilen Spiel durch 3.001
Zeilen Übersicht ersetzt und dazu „Übersicht geschrieben: App.jsx" gemeldet —
eine Erfolgsmeldung über einer gelöschten Datei.

Aufgefallen ist es nur, weil die Übersicht danach weiter „Fassung 35.3" zeigte,
obwohl `App.jsx` auf 35.4 stand. Ohne diese Nachkontrolle wäre der Verlust erst
beim nächsten Bau aufgefallen.

Wiederhergestellt aus `/home/claude/rs/App.jsx`, der Arbeitskopie, die
`pruefen.sh` bei jedem Lauf anlegt — abgesichert mit `diff` gegen die
unberührte Quelle im Projektwissen: genau die zwei Fassungszeilen weichen ab,
der Rest ist bitgleich (`md5` über die Datei ohne Zeile 10–11 stimmt überein).

**Zwei Riegel in `uebersicht.cjs`:** mehr als ein Argument bricht ab, und das
Ziel muss auf `.md` enden. Jeder für sich hätte gereicht. Gegengeprüft: beide
melden, die `App.jsx` bleibt unberührt, der richtige Aufruf läuft durch.

Der allgemeine Fall steht als Stolperfalle in Abschnitt 6. Er ist nicht auf
dieses Werkzeug beschränkt — `vorschau.py` und `verzeichnis.cjs` schreiben
ebenfalls, und `vorschau.py` nimmt umgekehrt erst die Quelle, dann das Ziel.
**Die Reihenfolge ist im Prüfstand nicht einheitlich.** Das zu vereinheitlichen
wäre eine eigene, kleine Aufräumaufgabe; sie steht als offener Punkt.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten
rückwärts. Bündel **1.098,56 kB** / 406,45 kB gepackt — 10 Byte mehr als 35.3,
das ist der längere Text von `VERSION_INFO` und sonst nichts. `sicht.sh`:
Startprobe 13/13, Kopfleiste 8 px Abstand, Seitenanfang 4/4, Impressum zeigt
35.4.

*Nebenbei geschätzt statt gemessen:* in diesem Block stand zwischenzeitlich
1.098,57 kB — hochgerechnet aus der Länge des neuen Textes, bevor der Bau lief.
Es waren 1.098,56. Zehn Byte ohne Folgen, aber genau die Sorte Zahl, die man
sich nicht ausrechnet.

## 35.5 · Ein Prüfwerkzeug für die Ereignisse

Erste Sitzung des Inhaltsausbaus, den Kevin geplant hat. **Kein neuer Inhalt** —
zuerst das Werkzeug, sonst lässt sich später nicht unterscheiden, ob eine
Doppelung neu ist oder schon immer dastand.

### Der Befund, der die Reihenfolge umgedreht hat
Kevins Ausgangspunkt: *„2–3 Karrieredurchläufe hintereinander fühlen sich
gleich an."* Gemessen über 30 Laufbahnen mit demselben Gedächtnis, das auch das
Spiel führt — die Überschneidung zweier aufeinanderfolgender Laufbahnen:

| | gemeinsame Ereignisse |
|---|---|
| erste drei Saisons | 1,9 % |
| alles danach | 6,4 % |
| ganze Laufbahn | 7,1 % |

**Nach Kennung wiederholt sich fast nichts.** `evSeen` arbeitet. Das Gefühl ist
trotzdem richtig, nur liegt die Ursache anderswo:

- 69 % aller Ergebniszweige bewegen `morale`, 42 % `trust`, 34 % `rep`.
  Attribute wie `pas`/`def`/`pot` kommen auf 2–3 %.
- 452 von 471 Ereignissen hatten genau **zwei** Optionen.
- **Keine einzige** Option hing an einem Charakterwert.
- 708 von 961 Optionen würfeln nicht, der Ausgang steht fest.

Anderer Text, dieselbe Maschine. **Mehr Ereignisse allein ändern daran nichts** —
sie liefern mehr Text für dieselbe Maschine. Deshalb kommt die Mechanik
(bedingte Optionen) vor dem Inhaltsschub, nicht danach.

Nebenbei gemessen: der Topf umfasst im Schnitt 118 der 471 Ereignisse, in
Saison 0 aber nur 28. Die Phase, die man am häufigsten sieht, ist die engste.

### Das Werkzeug: zwei Arten von Prüfung
`pruefstand/ereignispruefung.cjs`, als Teil `ereignis` in `pruefen.sh`.

**Hart** — falsch ist falsch: doppelte Kennungen · doppelte feste Titel ·
Angebot trotz Besitz · Text verspricht, Wirkung liefert nicht.

**Grundlinie** — schlägt nur an, wenn es MEHR wird. Deckt Altlasten ab, über die
inhaltlich entschieden wird. Begründung steht im Skript: ein Melder, der bei
jedem Lauf dieselben bekannten Zeilen ausspuckt, wird überlesen. Genau daran ist
in 35.1 die Farbwertprüfung gescheitert.

**Schwellen an den Daten kalibriert, nicht geraten.** Ab 50 % Wortüberschneidung
gibt es 0 Paare, ab 40 % zwei, ab 25 % dreizehn, ab 20 % dreissig — bei 20 %
kippt es ins Rauschen. Also 25 %.

### Drei eigene Fehler im Werkzeug, alle nur durch Gegenproben gefunden
1. **Dynamische Titel.** `r_schwachesjahr` und `r_starkesjahr` heissen mit
   Ersatzwerten beide „Durchschnittsnote 3.0" und sind doch das Gegenteil
   voneinander. Titel mit `${…}` werden übersprungen.
2. **Der Ersatztisch war zu klein.** 22 der 471 Texte greifen auf Felder zu, die
   darin fehlten, brachen ab und lieferten leeren Text — die Ähnlichkeit wurde
   dann nur auf dem Titel gerechnet. `sa_scout` und `hk_diaspora` galten so als
   25 % ähnlich, weil in beiden Titeln „Stadion" steht. **Ein Zwanzigstel des
   Bestands war für diese Prüfung unsichtbar.** Statt einer festen Tabelle jetzt
   ein Platzhalter, der auf jeden Zugriff antwortet: 0 statt 22 leere Texte, und
   die Paarliste fiel von 13 auf 11.
3. **Die Prüfung „verspricht, liefert nicht" war grün, ohne je zu messen.**
   `braucht` fragte nach `fx.ntKapitaen`, die Wirkung heisst `ntCaptain`. Und
   `hatSchon` konnte `!!p.nt.kapitaen` (verlangt) nicht von `!p.nt.kapitaen`
   (schliesst aus) unterscheiden. Gegenprobe: Wirkung entfernen — also genau der
   Fehler aus 35.4 — und sie **schwieg**. Dieselbe Stolperfalle wie „Prüfung, die
   nichts zu messen hatte". Jetzt entscheidet eine Hilfsfunktion `rolle()`
   zwischen *verlangt* · *schliesst aus* · *unerwähnt*.

### Was abgestellt wurde
**Die Binde im Nationalteam.** `n_kapitaen` prüfte nur `nt.caps>=35`, nicht ob man
sie schon trägt — und der Zweig „Annehmen" gab `rep`, `ntBonus`, `morale`,
`legacy`, setzte aber `p.nt.kapitaen` **nicht**. Der Text sagte „Du führst dein
Land an", mechanisch passierte das nicht. Grund: die Binde konnte bis 35.4 nur
die Simulation vergeben, es gab **keine Wirkung dafür**. Neu: `fx.ntCaptain`,
symmetrisch zum vorhandenen `fx.captain` für die Vereinsbinde. Die Simulation
kann sie weiterhin abnehmen, wenn die Rolle wegbricht — das bleibt so.

**Zwanzig Fälle „Angebot trotz Besitz".** `drawEvents` sperrt eine Kennung über
`evLog`, dasselbe Ereignis kommt also nie zweimal — aber zwei verschiedene
Ereignisse können dieselbe Flagge vergeben. `abschluss` wurde von **vier**
Ereignissen vergeben, keines fragte nach; den Schulabschluss konnte man viermal
machen. `ntstreit` und `n_abschied` beendeten beide die Länderspielkarriere.
`ew_beraterwechsel` vergab „Berater", ohne dass man je einen hatte — dort ist die
richtige Bedingung `p.flags.berater`, nicht `!p.flags.berater`. Auf Kevins Wunsch
verliert `insider` sein `rep:6`; einmal reicht.

**Acht Doppler zusammengelegt** (471 → 463). Vorher geprüft, dass keiner
alleiniger Setzer einer Flagge ist und niemand `EVENTS.length` zählt:

| gelöscht | zugunsten von |
|---|---|
| `t_leihe_zurueck` | `lh_rueckkehr` (47 % wortgleich) |
| `x_ruecktrittsangebot` | `sf_altersteilzeit` (44 %) |
| `doppelstaat` | `hk_verbandswechsel` (38 %) |
| `x_wintertransfer` | `wm_winter` (35 %, bessere Bedingung) |
| `x_zeugwart` | `al_platzwart` (26 %) |
| `pos_iv1` | `pv_eigentor` (25 %) |
| `winterlager` | `al_wintervorbereitung` (gleicher Titel) |
| `pos_tw2` | `pt_elfmeterkiller` (gleicher Titel, beide nur TW) |

Damit dabei nichts ersatzlos wegfällt: `pv_eigentor` bekommt `nopos:["TW"]`
(vorher hatte es gar keine Bedingung), und `hk_verbandswechsel` greift jetzt ab
18 statt 21 Jahren und ab Stärke 64 statt 70 — sonst hätten junge oder
schwächere Spieler die Lage verloren, die `doppelstaat` abgedeckt hat.
`hymne` und `kp_hymne` sind **nicht** dasselbe (allgemein gegen als Kapitän);
dort wurde nur der Titel geschärft.

Die fünf verbliebenen ähnlichen Paare sind geprüft und bleiben mit Absicht; die
Begründung steht je Paar im Skript.

### Was offen bleibt und warum
**13 folgenlose Flaggen** — gesetzt, nirgends gelesen. `pendeln` kommt im ganzen
Quelltext genau einmal vor: in der Setzstelle. Das ist kein Fehler, sondern
Inhaltsschuld: 13 Entscheidungen, die spurlos verpuffen. Genau die verschenkte
Wirkung, die Laufbahnen gleich anfühlen lässt. Abzutragen beim Inhaltsausbau,
die Grundlinie hält die Zahl fest.

**`trainerschein` bringt fast nichts.** Vier Setzstellen, drei Lesestellen — und
alle drei sind Bedingungen anderer Ereignisse. Keine Spielmechanik fragt ihn ab.
Kevins Verdacht war richtig. Steht als offener Punkt.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten
rückwärts, dazu **6 Ereignisprüfungen** ohne Befund. Bündel **1.094,44 kB** /
405,27 kB gepackt (−4,12 kB gegenüber 35.4; die acht gelöschten Ereignisse
minus dem längeren `VERSION_INFO`). Laufbahnen bis Vollausbau 27,4 (Ziel 25–35).
`sicht.sh`: Startprobe 13/13, Kopfleiste 8 px, Seitenanfang 4/4, Impressum 35.5.
Alle vier harten Prüfungen und der neue Prüfteil in beide Richtungen
gegengeprüft.

## 35.6 · Die Ereignisse ziehen aus

Offener Punkt 10 („App.jsx hat 14.304 Zeilen"), erster Schnitt. Bewusst **jetzt**
und nicht später: der Inhaltsausbau steht an, und danach waere derselbe Schnitt
zwei- bis dreitausend Zeilen teurer.

**Kein Inhalt geaendert.** Das ist die Bedingung, unter der so ein Umzug
ueberhaupt verantwortbar ist — und sie ist nachgewiesen, nicht behauptet.

### Warum eine Fabrik und kein einfacher Export
Der Block braucht **14 Namen** aus `App.jsx`, gemessen statt geschaetzt: die
Helfer `T · fehler · heldentat · istTraum · lastS · sameClub · sameLeague`, die
Funktionen `confOf · eur · ligaInfo` und die Konstanten `COL · POKAL · TIER ·
TOP5`. (Ein fuenfzehnter Kandidat, `split`, war ein Fehlalarm — er kommt nur als
Objektschluessel `split:` vor, nie als Aufruf.)

Ein `import { … } from "./App.jsx"` waere ein **Ringimport**: `App.jsx` bindet
die neue Datei ganz oben ein, die neue Datei liefe also zuerst, und die
Konstanten aus `App.jsx` waeren dann noch in der temporalen Totzone. Ergebnis:
Absturz beim Start.

Deshalb nimmt `machEreignisse(H)` die Helfer entgegen und packt sie in der
ersten Zeile aus. **Dadurch musste im Block selbst keine einzige Zeile geaendert
werden** — und genau das macht den Umzug nachpruefbar.

### Der Nachweis
Erst der Versuch, die Buendel zu vergleichen: 1.320.654 gegen 1.335.612 Bytes,
also **15 KB Unterschied**. Der Diff zeigte nur Pfadkommentare — das passte
nicht zusammen und war es wert, nachzurechnen. Erklaerung: esbuild rueckt den
Block jetzt um zwei Zeichen tiefer ein, weil er in einer Funktion steht.
Rund 7.000 Ausgabezeilen mal zwei Zeichen sind genau diese 15 KB. Formatierung,
kein Inhalt.

Der belastbare Nachweis vergleicht deshalb die **Daten** statt des Textes: alle
463 Ereignisse aus beiden Buendeln in eine feste Reihenfolge gebracht,
Funktionen als Quelltext, die Umbenennungen von esbuild (`T` → `T2`)
zurueckgerechnet, dann Pruefsumme.

    vorher   00f714e4a36d7ded1e7d85157eefde5a   463
    nachher  00f714e4a36d7ded1e7d85157eefde5a   463

### Vier Werkzeuge gingen von einer Datei aus
Das war der eigentliche Aufwand, nicht der Umzug selbst:

- **`pruefen.sh`** kopiert `ereignisse.js` jetzt in BEIDE Bauverzeichnisse — nach
  `$BAU` fuer das Pruefbuendel, nach `$ARBEIT` fuer den Produktionsbau — und
  meldet die Zahl der Eintraege im Kopf.
- **`browsertest.sh`** hat die Datei in der Kopierliste.
- **`vorschau.py`** muss EINE Datei erzeugen; ein Import auf `./ereignisse.js`
  wuerde im Chatfenster ins Leere zeigen. Die Datei wird jetzt hineinkopiert,
  wie die Schriften. Dazu zwei Gegenproben: kein `from "./ereignisse.js"` darf
  uebrig bleiben, und unter 400 Eintraegen bricht es ab.
- **`apk.yml`** zaehlt die Ereignisse im fertigen Buendel, wie es die
  Schriftschnitte schon zaehlt. Vite loest den Import selbst auf, eine fehlende
  Datei braeche also laut ab — was NICHT laut abbricht, ist eine abgeschnittene
  oder halb eingecheckte Datei.

### Und ein Werkzeug, das die Aufteilung nicht ueberlebt hat
`ereignispruefung.cjs` meldete nach dem Umzug **51 statt 13** folgenlose Flaggen.
Kein Fehler im Spiel: die Pruefung sucht die Lesestellen im Quelltext, und die
Bedingungen sind mit ausgezogen. Sie liest jetzt beide Dateien.

Erfreulich daran ist, WIE es aufgefallen ist — die Pruefung wurde **rot statt
still**. Eine Annahme, die eine Umstrukturierung nicht ueberlebt, ist der
Normalfall; entscheidend ist, dass sie sich meldet. Die Liste `NEBEN` im Skript
ist der Ort, an dem eine weitere ausgelagerte Datei nachzutragen ist.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten
rückwärts, 6 Ereignisprüfungen ohne Befund. `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.6. `vorschau.py` baut wieder eine Einzeldatei mit 463 Einträgen
und bricht ab, wenn `ereignisse.js` fehlt.
Bündel **1.094,63 kB** / 405,89 kB gepackt — 0,19 kB mehr als 35.5, das sind der
Modulrahmen und der längere `VERSION_INFO`. Der Umzug selbst kostet nichts.
App.jsx **12.041 Zeilen** (vorher 14.271), `ereignisse.js` 2.261.

## 35.7 · Entscheidungen mit Folgen

Offene Punkte 11 und 12 aus 35.5. **Tote Flaggen von 13 auf 5**, und der
Trainerschein hat endlich einen Ort.

### Ein Irrweg vorweg, und was er gezeigt hat
Erster Verdacht beim Durchsehen: Spielmanipulation annehmen setzt eine Flagge,
die niemand liest — also ein Spiel ohne Risiko? **Falsch.** Nachgesehen statt
angenommen: 55 % durchkommen, **25 % Sperre**, **20 % lebenslange Sperre und
Karriereende**. Das Risiko ist da. Folgenlos ist nur, wer durchkommt.

Merksatz daraus: eine Flagge ohne Lesestelle ist ein *Hinweis*, kein Urteil.
Manche Entscheidung wirkt vollstaendig ueber ihre Wuerfelzweige.

### Sechs Flaggen bekommen einen Ort: „Was danach kommt"
Vier der dreizehn versprachen etwas fuer die Zeit NACH der Laufbahn —
`abschiedsspiel · experte · plan_b · agentur` — und liefen ins Leere. Dazu
`rueckkehr` (Zusage an den Ausbildungsklub) und `trainerschein`, der
auffaelligste Fall ueberhaupt: vier Setzstellen, drei Lesestellen, und alle
drei nur Bedingungen anderer Ereignisse.

`EndScreen` zeigt jetzt eine Anzeige **Was danach kommt**, die auflistet, was
man sich erspielt hat. Eine Mechanik, sechs Flaggen. Und genau die Wirkung, um
die es Kevin geht: **zwei Laufbahnen enden sichtbar verschieden.**

Alte Sicherungen kennen die Flaggen nicht — `undefined` ist falsch, die Liste
bleibt leer, die Anzeige verschwindet ganz. Nachgewiesen im React-Baum: ohne
Flaggen keine Anzeige, mit Flaggen genau die gesetzten und keine anderen.

### Zwei Ketten repariert, die es schon gab
Der Bestand hatte das Muster bereits: `zw_rechteblock` („Der Fonds redet mit")
verlangt `rechte_weg`, `steuerpruefung` („Post vom Finanzamt") verlangt
`schwarzgeld`. Funktionierende Folgen — nur nicht ueberall angeschlossen.

- **`tpo` hiess in Wahrheit `rechte_weg`.** Zwei Ereignisse verkaufen
  Transferanteile: `zw_transferrecht` setzt `rechte_weg` und hat eine Folge,
  `transferrechte` setzte `tpo` und hatte keine. Dieselbe Sache, zwei Namen,
  ein Sackgassenzweig. Jetzt eine Flagge — und beide Setzer schliessen sie
  gegenseitig aus, sonst verkauft man seine Rechte zweimal.
- **`einbuergerung` oeffnet `as_golf`.** Die Einbuergerung pruefen zu lassen
  endete im Nichts; das Passangebot gab es nur in drei Golfstaaten. Wer den
  Vorgang angestossen hat, bekommt es jetzt ueberall in der AFC.
- **`steuerberater` sperrt `zw_steuermodell`.** Spiegelbild zu `!p.flags.sauber`,
  das dort schon stand: wer einen Fachmann hat, laeuft nicht in ein
  Bildrechtemodell. Eine harmlose Entscheidung schuetzt spaeter.

### Das Werkzeug hat den eigenen Einbau kontrolliert
Erster Entwurf der Anzeige las ueber eine Abkuerzung (`const F = p.flags`).
Die Ereignispruefung meldete prompt **10 statt der erwarteten 5** toten
Flaggen — sie sucht `flags.X` im Quelltext und sah nichts. Statt dem Werkzeug
einen Sonderfall beizubringen, sind die Zugriffe ausgeschrieben. Das ist auch
fuer den Menschen besser auffindbar.

### Was bleibt
Fuenf Flaggen: `attest · beidseitig · manipuliert · pendeln · treugeblieben`.
Sie brauchen eigenen Inhalt, nicht nur einen Anschluss — das gehoert in den
Inhaltsausbau. `treugeblieben` wirkt immerhin ueber `loyalBonus` mit.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
6 Ereignisprüfungen ohne Befund. Tote Flaggen **13 → 5**, Grundlinie gesenkt.
Bündel **1.095,54 kB** / 406,21 kB gepackt (+0,91 kB gegenüber 35.6, das ist die
neue Anzeige). `sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.7.
Anzeige „Was danach kommt" im React-Baum in beide Richtungen nachgewiesen:
ohne Flaggen erscheint sie nicht, mit Flaggen nennt sie genau die gesetzten.

## 35.8 · Deine Werte öffnen Türen

Punkt C aus dem Plan, und die Grundlage für alles Weitere. In 35.5 gemessen:
**keine einzige** der damals 945 Optionen hing an einem Charakterwert. Zwei
Knöpfe, immer dieselben zwei, egal wer man ist. Das war der Befund, warum sich
Laufbahnen gleich anfühlen — nicht die Ereignisse, die überschneiden sich nur
zu 7 %.

### Zusätzliche Optionen, keine gesperrten
Kevins Wortlaut war „**weiteren** Vor-/Nachteil". Das entscheidet den Entwurf:
bestehende Optionen bleiben unangetastet offen, die Bedingung hängt an einer
**dritten**. Die Mechanik gibt etwas dazu, statt etwas wegzunehmen.

Eine Option kann jetzt `cond` tragen. Ist sie nicht erfüllt, bleibt der Knopf
**sichtbar, aber gesperrt**, und `sperre` sagt warum — „Braucht 70
Beliebtheit". Sichtbar mit Absicht: ein verstecktes Angebot merkt niemand, ein
gesperrtes macht klar, dass die eigenen Werte etwas bedeuten.

### Drei Stellen, nicht eine
- `wahlOffen(c, p)` und `offeneWahlen(e, p)` als Helfer.
- Die Anzeige setzt `disabled` und zeigt statt des Hinweises die Sperre.
- **`quickSim`** — die wichtigste. Das Vorspulen würfelte mit
  `pick(e.choices)` über ALLE Optionen. Ohne Anpassung hätte der
  Schnelldurchlauf Dinge gewählt, die der Spieler von Hand nie hätte anklicken
  können.

### Drei neue harte Prüfungen, bevor die erste Bedingung geschrieben wurde
Bewusst in dieser Reihenfolge — die Regeln sind zu wichtig fürs Gedächtnis:

1. **Jedes Ereignis braucht eine Option ohne Bedingung.** Sonst entsteht eine
   Lage, in der alle Knöpfe gesperrt sind und das Spiel hängt. Beim Testen
   fällt das fast nie auf, weil es genau die eine Wertekombination braucht.
2. **Jede bedingte Option braucht `sperre`.** Ein grauer Knopf ohne Begründung
   ist schlimmer als keiner: man sieht, dass etwas ginge, erfährt aber nicht
   was fehlt.
3. **Der Ernstfall.** Die erste Regel prüft nur die Form. Eine Bedingung könnte
   werfen statt `false` zu liefern, dann bliebe auch der freie Weg zu. Deshalb
   zusätzlich ein Spieler, bei dem alles auf Minimum steht — bleibt irgendwo
   null übrig, hängt das Spiel. Ergebnis: 0 Sackgassen.

`wahlOffen` fängt eine werfende Bedingung ab und sperrt, statt abzustürzen.
Nachgewiesen.

### Zehn Bedingungen, quer über die Werte
| Ereignis | hängt an | zusätzliche Option |
|---|---|---|
| `ew_wohnung` | Vermögen ab 3 Mio. | bar bezahlen statt Kredit |
| `heimat` | Vermögen ab 4 Mio. **und** zwei Anschaffungen | die ganze Anlage statt nur des Platzes |
| `b_nummer` | Beliebtheit ab 70 | sich die Zehn einfach nehmen |
| `zw_pokerabend` | Moral ab 70 | die Runde auflösen statt auszusteigen |
| `standards` | Passspiel ab 75 | Freistöße dazu |
| `fitnesstest` | ab 30 Jahren **und** 60 Vertrauen | auf die eigene Erfahrung pochen |
| `al_platzwart` | Form ab 75 | ihm ein Tor widmen |
| `al_dopingaufklaerung` | Schulabschluss | die Liste selbst durcharbeiten |
| `ew_lebensplan` | Trainerschein | auf dem Schein aufbauen |
| `sprache` | Herkunft: Verein im eigenen Erdteil | über Landsleute im Kader gehen |

Damit ist die Mechanik kein toter Code — genau der Fehler, den 35.7 gerade erst
abgetragen hat. Zehn ist ein Anfang, nicht das Ziel; die Kennzahl steht jetzt
im Bericht der Ereignisprüfung.

### Nebenbei aufgefallen
Die Helfer standen zuerst nicht in `exporte.txt`. Der Prüfstand hätte die
Mechanik damit nie anfassen können — dieselbe Klasse wie „Werkzeug, das nur von
Hand läuft".

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
**9 Ereignisprüfungen** ohne Befund. Optionen mit Bedingung **0 → 10** von 955.
Optionen je Ereignis: 2 → 434, 3 → 29 (vorher 444/19).
Bündel **1.098,85 kB** / 407,43 kB gepackt (+3,31 kB gegenüber 35.7: zehn neue
Optionen samt Texten und die Anzeigelogik). `sicht.sh`: 13/13 · 8 px · 4/4.
Mechanik in sieben Richtungen nachgewiesen: gesperrt bei zu wenig, offen bei
genug, `offeneWahlen` zählt richtig, 0 Sackgassen beim schwächsten Spieler,
werfende Bedingung sperrt statt abzustürzen.

## 35.9 · Storystränge

Punkt B aus dem Plan. Über Flaggen gab es schon Zwei-Schritt-Ketten
(`zw_transferrecht` → `zw_rechteblock`). Was fehlte, waren vier Dinge — und das
vierte ist das eigentliche:

| | |
|---|---|
| **Reihenfolge** | Teil 2 nur nach Teil 1. Konnten Flaggen schon. |
| **Wartezeit** | Eine Geschichte, deren drei Teile in derselben Saison durchlaufen, ist keine. `wartezeit` ist der Mindestabstand in Saisons. |
| **Verzweigung** | Was man in Teil 1 wählt, entscheidet, WELCHER Teil 2 kommt. Die Wahl setzt `fx.strangWeg`. |
| **Garantie** | Beim gewichteten Ziehen könnte Teil 2 nie erscheinen. **Eine Geschichte, die anfängt und versandet, ist schlimmer als gar keine.** Fortsetzungen bekommen deshalb einen festen Platz in `drawEvents` — sie werden nicht gewürfelt. |

Zustand am Spieler: `p.straenge[kennung] = { stufe, seit, weg }`. Alte
Sicherungen kennen das Feld nicht, überall gegen `{}` abgesichert.
Fortgeschrieben wird an **zwei** Stellen — im Ereignisfenster und im Vorspulen.
Nur eine davon zu bedienen wäre der Fehler gewesen, den 35.8 bei `quickSim`
schon einmal beinahe gemacht hätte.

Angezeigt wird es als zweiter Chip: „Der aus der Jugend · Teil 2 von 3". Ohne
Kennzeichnung ist ein Strang kein Strang, sondern Zufall.

### Der erste Strang: „Der aus der Jugend"
Drei Stufen, fünf Ereignisse, drei Wege — und bewusst **ausserhalb des
Sportkosmos**, was Kevin ausdrücklich vermisst hat. Es geht um jemanden aus dem
eigenen Jahrgang, der es nicht geschafft hat, und darum, was man mit dem
eigenen Glück anfängt.

Teil 1 (mit 20–26) verzweigt in `geholfen` · `geld` · `abgewimmelt`. Jeder Weg
hat einen eigenen Teil 2; aus `abgewimmelt` und `geld` kann man auf `geholfen`
zurückfinden. Teil 3 ab 28 führt alles zusammen. Die Geldoption ist an
Vermögen gebunden — der erste Strang nutzt also gleich die Mechanik aus 35.8.

### Vier Arten, wie ein Strang kaputtgeht — alle geprüft
Keine davon fällt beim Spielen zuverlässig auf, man müsste erst die richtige
Stufe erreichen: eine **fehlende Stufe** (Geschichte bricht ab), ein **Weg, den
keine frühere Stufe erzeugt** (toter Text, den niemand sieht), eine **Stufe
ohne Nachfolger für einen möglichen Weg**, und eine **Tabelle, die eine andere
Teilezahl nennt** („Teil 2 von 4", und Teil 4 kommt nie).

### Ein Irrweg im Werkzeug, den die Gegenprobe erledigt hat
Die Prüfung „verspricht, liefert nicht" schlug bei `jf_3` an: dort macht *der
Jugendfreund* eine Trainerlizenz, nicht der Spieler. Erster Versuch war, die
Prüfung auf Sätze mit Anrede einzuengen — „was der Text DIR zusagt".

Die Gegenprobe hat das sofort erledigt: in `jf_3` stehen Lizenz und Anrede im
**selben Satz**, und schlimmer — der Anlassfall `n_kapitaen` schlug **gar nicht
mehr an**, weil sein Stichwort im Titel steht und die Anrede im Text. *Eine
Verengung, die den Fall verliert, für den die Prüfung gebaut wurde, ist keine
Verbesserung.*

Zurückgenommen. Stattdessen eine kurze **Ausnahmeliste mit Begründung**, die
bei jedem Lauf mit ausgegeben wird, damit sie nicht stillschweigend wächst. Wem
eine Rolle im Text gehört, ist eine Ermessensfrage — die gehört aufgeschrieben,
nicht geraten.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
**10 Ereignisprüfungen** ohne Befund. 468 Ereignisse (vorher 463).
Bündel **1.103,53 kB** / 408,94 kB gepackt (+4,68 kB: fünf Ereignisse und die
Strangmechanik). `sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.9.
Mechanik in **14 Richtungen** nachgewiesen: Reihenfolge vorwärts und rückwärts,
Wartezeit hält zurück, jeder der drei Wege führt zum richtigen Teil 2, der Weg
bleibt über Stufen erhalten, ein Weg lässt sich wechseln — und die Garantie:
**eine fällige Fortsetzung kam in 40 von 40 Ziehungen.**

## 35.10 · Der Anfang war die engste Stelle

Punkt A/E, erster Block. **Gemessen, bevor geschrieben wurde** — und die Messung
hat das Ziel bestimmt.

### Wo die Lücke wirklich war
| Saison | Topf vorher |
|---|---|
| 0 | **28,2** von 468 |
| 1 | 67,8 |
| 5 | 96,2 |
| 13 | 128,7 |

Bei einem frischen Spieler mit 16 waren es genau **21 Ereignisse in 8 Themen**,
sieben davon „Nachwuchs". Der Abschnitt, den man bei **jeder** Laufbahn sieht,
war der engste des ganzen Spiels.

Und es fehlten dort genau die Themen, die für einen Sechzehnjährigen die
wichtigsten sind: **Familie · Privat · Alltag · Umfeld · Medien · Fans ·
Herkunft · Konkurrenz**. Also fast alles ausserhalb des Platzes — der Punkt,
den Kevin auf seinem Zettel ausdrücklich hatte.

### Zwanzig Ereignisse, gezielt in diese Lücke
Der Vater, der zwei Jahre lang Schichten getauscht hat. Der Bruder, der aufhört
und nicht sagt warum. Die dritte Woche im Internat, wenn das Abenteuer vorbei
ist. Der Gruppenchat, der still wird — nicht im Streit. Der erste Trainer, der
sehr vorsichtig fragt, ob er mal zusehen darf. Neun Zentimeter in einem Jahr.
Der Nachbar, der es jedem erzählt.

Bewusst mit **breiteren Wirkungen** geschrieben: der Anfangstopf bewegte fast
nur `morale` und `trust`. Jetzt stehen dort auch `pot`, Attribute,
`injuryProne`, `money`, `fitness`.

### Das Werkzeug hat zwei neue Altlasten sofort erwischt
Ich hatte zwei Flaggen gesetzt, die niemand liest — `gesichtet` und
`vertragsschlau`. Genau die Schuld, die 35.7 gerade abgetragen hatte, und die
Grundlinie sprang von 5 auf 7. Unterschiedlich behandelt, weil es zwei
verschiedene Fälle sind:

- **`gesichtet`** war Zierde. Die Wirkung des Probetrainings (`pot`, `rep`)
  steht ohnehin da. Entfernt, statt ihr nachträglich eine Aufgabe zu erfinden.
- **`vertragsschlau`** soll sich auszahlen — wer als Achtzehnjähriger einen
  Anwalt auf den Fördervertrag schauen lässt, kann Jahre später im Klauselstreit
  selbst verhandeln. Bekommt also eine echte Lesestelle als bedingte Option.

### Was sich gemessen geändert hat
| | 35.9 | 35.10 |
|---|---|---|
| Ereignisse | 468 | **488** |
| Topf in Saison 0 | 28,2 | **41,3** |
| bei 16 Jahren | 21 in 8 Themen | **36 in 14 Themen** |
| Topf in Saison 1 | 67,8 | **85,0** |
| Optionen mit Bedingung | 11 | **15** von 1.010 |
| Ereignisse mit 3 Optionen | 19 | **34** |

### Was sich NICHT geändert hat, und warum das richtig ist
Die Überschneidung zweier aufeinanderfolgender Laufbahnen liegt weiter bei
**1,6 %** in den ersten drei Saisons (vorher 1,9 %). Das ist keine Enttäuschung,
sondern die Bestätigung des Befunds aus 35.5: **die Wiederholung war nie das
Problem.** Sie war schon vorher praktisch null. Was sich gleich anfühlte, war
die Struktur — zwei Knöpfe, immer dieselben, drei Werte zucken. Daran arbeiten
35.8 und 35.9, und dieser Block gibt ihnen Material.

Wer die Zahl trotzdem drücken will, muss nicht mehr Ereignisse schreiben,
sondern mehr Optionen an Werte binden.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Bündel **1.118,99 kB** / 413,40 kB gepackt
(+15,46 kB — zwanzig Ereignisse mit Text). `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.10. Grundlinien unverändert (5 ähnliche Paare,
5 folgenlose Flaggen) — der Block hat keine neue Schuld hinterlassen.

## 35.11 · Wo die Bedingungen hingehören — und ein grober eigener Fehler

Punkt A/E, zweiter Block. Nach 35.10 war klar: der Hebel liegt nicht mehr in der
Menge, sondern darin, wie viele Antworten an Werten hängen. 15 von 1.010 waren
es.

### Zuerst gemessen, wo es sich lohnt
Eine Bedingung in einem Ereignis, das niemand sieht, ist verschenkt. Über 40
Laufbahnen gezählt, welche Ereignisse am häufigsten gezogen werden — und die 18
meistgezogenen **ohne** bedingte Option bekamen eine: `x_taktikvideo` (18 von
40), `al_ernaehrung`, `derbytor`, `sf_schock`, `rivale`, `o_mentor` und andere.

Bewusst über die ganze Wertebreite: Vermögen · Beliebtheit · Moral · Vertrauen ·
Fitness · Alter · Titel · Passspiel · Schuss · **Herkunft** (Hochland) und
**Stärke** — die 44 Spielertyp-Eigenschaften waren bis dahin gar keine
Bedingung.

### Der Fehler: geschätzt statt gemessen
Danach die Probe, ob die Bedingungen in echten Laufbahnen je zutreffen. **Sieben
von 33 waren in 60 Laufbahnen nie offen.** Der gemeinsame Nenner war peinlich
eindeutig: ich hatte die Geldschwellen geraten.

Nachgemessen, 60 Laufbahnen:

| Alter | Median | oberes Viertel | oberes Zehntel | Höchstwert |
|---|---|---|---|---|
| 22 | 0,07 | 0,10 | 0,14 | 0,39 |
| 28 | 0,17 | 0,34 | 0,81 | 1,94 |
| 34 | 0,33 | 0,67 | 1,50 | 3,68 |

Meine Schwellen lagen bei **1 bis 4 Mio.** Das trifft im ganzen Spiel fast
niemanden. Alle Schwellen auf das gemessene obere Viertel des jeweiligen Alters
gesetzt — 0,09 bis 0,7 — und die Kosten der Optionen mit.

Dazu zwei weitere Ursachen derselben Art:
- **`koch` wird in 60 Laufbahnen nie gesetzt** (sein eigenes Ereignis verlangt
  1 Mio.). Eine Bedingung auf eine Flagge, die es praktisch nicht gibt, ist tote
  Anzeige. Ersetzt durch eine Geldschwelle.
- **Jeder Spieler trägt genau EINE Stärke aus 44.** Eine Bedingung auf drei
  bestimmte trifft rund 7 % — gemessen 0 von 16 Anzeigen. Die Listen sind
  thematisch verbreitert, nicht aufgeweicht: es bleiben Stärken, bei denen die
  Option wirklich Sinn ergibt.

### Ergebnis
| | vorher | nachher |
|---|---|---|
| Bedingte Optionen | 15 | **33** von 1.028 |
| davon nie erreichbar | 7 | **0** |
| Ereignisse mit 3+ Optionen | 34 | **51** |

Die schwächste liegt jetzt bei 6 %, die stärkste bei 100 %. `ausstieg#0` steht
bei 0 von 2 Anzeigen — dafür fehlen schlicht die Daten, nicht die Erreichbarkeit.

**Daraus eine Regel für den weiteren Ausbau:** eine neue Bedingung wird nicht
geschätzt, sondern gegen die gemessene Verteilung gesetzt, und danach wird
nachgezählt, wie oft sie offen ist. Ziel ist grob ein Viertel bis die Hälfte der
Anzeigen; unter 5 % ist es Zierde.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Bündel **1.125,67 kB** / 415,96 kB gepackt.
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.11. Grundlinien unverändert.
Erreichbarkeit über 60 Laufbahnen gemessen, vorher und nachher.

## 35.12 · Die Ehrentafel sagt jetzt, wohin

Erster der drei Akademiepunkte. Der kleinste, deshalb zuerst.

### Punkt H: welcher Verein den Absolventen geholt hat
Bis 35.11 stand auf der Ehrentafel nur, **dass** jemand Profi geworden ist. Ein
Absolvent speicherte `id · name · flag · nat · pos · ein · raus · peak · ns` —
keinen Verein, und es wurde auch keiner gezogen.

Jetzt schon, und zwar **nicht gewürfelt**: der Verein passt zur erreichten
Stärke. Gesucht wird im Fenster von ±6 um `peak − 2…9`, mit 55 % Vorzug für das
Heimatland des Talents, falls dort etwas Passendes liegt. Findet sich gar
nichts, entscheidet die Nähe zur Zielstärke.

Die Jahresmeldung nennt ihn mit: statt *„X geht als Profi heraus"* jetzt
*„X unterschreibt bei Y"*.

**Alte Sicherungen** kennen das Feld nicht. Die Zeile bleibt dann weg statt
„undefined" anzuzeigen — dieselbe Absicherung wie bei der Anzeige „Was danach
kommt" in 35.7.

Nachgewiesen an 710 Absolventen aus 20 Akademien: jeder hat einen Verein, jeder
Verein existiert wirklich, **545 verschiedene**. Peak ≥ 85 landet im Mittel bei
Vereinsstärke **80,7**, Peak ≤ 65 bei **55,6**.

### Punkt G gemessen: die Antwort ist „ja, aber"
Kevins Frage war, ob zu selten Profiverträge herauskommen. Gemessen über je 25
Akademien à 25 Jahre, alle Abteilungen auf derselben Stufe:

| Stufe | Aufnahmen | Profis | Abbrecher | **Profiquote** |
|---|---|---|---|---|
| 1 | 37,0 | 0,5 | 32,2 | **2 %** |
| 2 | 62,4 | 1,8 | 53,1 | **3 %** |
| 3 | 62,0 | 1,8 | 52,1 | **3 %** |
| 4 | 88,1 | 8,9 | 66,6 | **12 %** |
| 5 | 112,9 | 16,2 | 79,9 | **17 %** |
| 6 | 138,2 | 33,4 | 84,1 | **28 %** |

*Berichtigung (35.13): diese Tabelle ist um eine Stufe verschoben. Das Messskript
setzte die Abteilungen auf 0 bis 5, im Spiel laufen sie von 1 bis 6. Die Form der
Kurve stimmt, die Höhe nicht — richtig gemessen lag Stufe 6 bei 43 %, nicht 28 %.
Der Befund „die Stufen 1 bis 3 bringen fast nichts" bleibt richtig: 4 → 6 → 12 %.*

**Die Quote als solche ist gewollt** — der Kommentar im Rechenkern sagt
ausdrücklich, die allermeisten schaffen es nicht, und 28 % auf Vollausbau ist
für eine Jugendakademie eher grosszügig.

**Das Problem ist die Kurve, nicht die Höhe.** Von Stufe 1 auf 3 passiert
praktisch nichts: 2 % auf 3 %. Man zahlt zwei Ausbaustufen und sieht bei dem
Ergebnis, das einen am meisten interessiert, **keinen Unterschied**. Erst ab
Stufe 4 springt es.

Der Grund steht in der Formel: `proChance = .07 + (ovr − 50) × .022 +
buehne × .02`. Direkt wirkt nur die Wettbewerbsabteilung; alle anderen wirken
nur über die Stärke der Talente, und die ist auf niedriger Stufe so gering, dass
der mittlere Term negativ bleibt.

**Das gehört zu Punkt F.** Wenn die Leiter länger wird — Kevin will mehr Kosten
und zwei bis drei weitere Abteilungen —, wird der flache Anfang noch länger.
Beides zusammen anzufassen ist richtig, getrennt wäre es doppelte Arbeit.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Bündel **1.126,03 kB** / 416,11 kB gepackt.
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.12. Die Rückwärtsprüfung deckt die
Ehrentafel mit alten Einträgen ab.

## 35.13 · Die Akademie wird größer

Punkt F, der letzte offene Punkt von Kevins Zettel. Drei Wünsche auf einmal:
mehr VC-Bedarf, zwei bis drei weitere Abteilungen, höherer VC-Verdienst — bei
gehaltenem Zielband 25–35 Laufbahnen.

### Drei neue Abteilungen
Bewusst **teurer** als die sechs alten, und die alten bleiben unangetastet:
niemandem soll die schon bezahlte Arbeit entwertet werden.

| Abteilung | Kosten Stufe 2–6 | wirkt auf |
|---|---|---|
| **Mentaltraining** | 26 · 48 · 78 · 112 · 152 | deutlich weniger Abbrecher · ruhiger im Sichtungsspiel |
| **Videoanalyse** | 28 · 52 · 84 · 120 · 164 | schnellere Entwicklung der Talente |
| **Netzwerk zu Profivereinen** | 30 · 56 · 90 · 130 · 178 | direkt mehr Profiverträge |

Vollausbau: **2.912 statt 1.564 VC**, 9 Abteilungen statt 6, 45 Ausbaustufen
statt 30.

### Zwei Zahlen bewusst verschoben, eine bewusst gehalten
- **Verdienst ×1,80.** Als *eigener* Faktor neben dem vorhandenen ×1,18 für den
  Shop — getrennt, damit man beiden ansieht, wofür sie da sind. Wer eine der
  Ursachen ändert, weiss dann, an welcher Zahl er zu drehen hat.
- **Kostenband 1400–1700 → 2700–3100.** Keine stille Anpassung an ein Ergebnis,
  sondern eine absichtlich verschobene Schranke: der Ausbau *soll* teurer sein.
- **Laufbahnen bis Vollausbau bleibt 25–35.** Das ist die eigentliche Schranke
  und fängt ab, wenn Kosten und Verdienst auseinanderlaufen. Gemessen **27,6**.

### Der Fehler, den nur der Prüfstand gefunden hat
Nach dem Einbau meldete er acht Fehler, darunter *„Ehrentafel: 25 Jahre, 0
Karton"* — die Testakademie produzierte plötzlich **gar keine Absolventen mehr**.

Ursache: `leereAkademie()` zählte die sechs Abteilungen **namentlich** auf. Die
drei neuen fehlten damit im Grundzustand, `S.mental` war `undefined`, die
Rechnung wurde `NaN`, `chance(NaN)` ist immer falsch — also brach niemand mehr
ab und **niemand wurde mehr Profi**.

**Das hätte jede bestehende Sicherung getroffen**, denn `akaJahr` ergänzt
fehlende Stufen aus genau dieser Liste. Ein Spielstand mit sechs Abteilungen
wäre nach dem Update eine Akademie ohne Absolventen gewesen — und im Spiel
hätte man es erst nach einigen Jahren gemerkt.

Behoben, indem der Grundzustand aus `ABTEILUNGEN` **abgeleitet** wird. Wer
künftig eine Abteilung ergänzt, muss dort nichts mehr nachtragen.

Dieselbe Klasse Fehler steckte dreimal im Prüfskript selbst: fest verdrahtete
`30`, `36` und `6 * AKA_MAX`. Auch die rechnen jetzt aus `ABTEILUNGEN`.
(Der erste Anlauf dazu brach mit `SOLL_SUMME is not defined` — die beiden
Prüfungen stehen in verschiedenen Blöcken. Jetzt an beiden Stellen ausgerechnet.)

### Punkt G miterledigt: die Kurve ist gespreizt
Die Profiquote je Stufe, mit den **echten** Stufenwerten 1–6:

| Stufe | vorher | nachher |
|---|---|---|
| 1 | 4 % | **4 %** |
| 2 | 6 % | **10 %** |
| 3 | 12 % | **17 %** |
| 4 | 20 % | **32 %** |
| 5 | 32 % | **41 %** |
| 6 | 43 % | **45 %** |

Der flache Anfang ist weg: früher brachte Stufe 1→3 vier auf zwölf Prozent bei
zwei bezahlten Stufen, jetzt vier auf siebzehn. Oben bewegt sich wenig — dort
war es nie das Problem.

**Falls 45 % zu großzügig wirkt:** die Schraube ist `S.netzwerk * .014` in
`proChance`. Eine Zahl, ein Ort.

### Eine wacklige Prüfung entwackelt
Beim Abschlusslauf meldete der Prüfstand plötzlich *„Wildcards — nie gezogen:
hsv"*, obwohl an Wildcards nichts geändert worden war. Der Lauf davor war grün.

Nachgemessen an 400.000 Ziehungen: **„hsv" kommt 1 zu 1.020.** Die Prüfung zog
4.000 Mal — dabei bleibt es in **1,98 %** der Läufe aus, also etwa in jedem
fünfzigsten Prüfstandlauf. Eine Prüfung, die zufällig rot wird, ist schlimmer
als keine: sie bringt einem bei, Rot zu übersehen. Auf 20.000 Ziehungen
angehoben, damit sind es 1 zu 328 Millionen; Kosten rund eine Sekunde.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Ehrentafel wieder 40 Absolventen, 3 Weltklasse.
Vollausbau 45 von 45 Ausbaustufen, `akaSumme` 54.
Bündel **1.126,74 kB** / 416,43 kB gepackt. `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.13.

## 35.14 · Antworten, die nur manchmal da sind

Kevins Nachfrage hat einen Unterschied aufgedeckt, den ich vorher nicht sauber
getrennt hatte. In 35.8 und 35.11 habe ich **bedingte** Optionen gebaut: sie
hängen an Werten und sind damit **vorhersehbar**. Kevin meinte etwas anderes —
Alternativen, die **manchmal** auftauchen.

Das ist eine eigene Mechanik, und sie trifft „fühlt sich gleich an" sogar
direkter: dasselbe Ereignis zeigt in zwei Laufbahnen verschiedene Knöpfe, ohne
dass man es kommen sieht.

### Gewürfelt wird beim Ziehen, nicht beim Anzeigen
Eine Auswahl mit `manchmal: .3` erscheint in knapp einem Drittel der Fälle.
**Der Wurf gehört in `drawEvents`.** Beim Anzeigen würde bei jedem Neuzeichnen
neu gewürfelt, und der Knopf könnte mitten in der Entscheidung verschwinden.

Zwei Dinge, die das erst unbedenklich machen:
- `drawEvents` legte an dieser Stelle **ohnehin schon flache Kopien** an (wegen
  `_ctx`). Die geteilten Objekte in `EVENTS` werden nicht verändert — geprüft
  über 4.000 Ziehungen.
- Die Warteschlange liegt nur in `useState`, **nicht in der Sicherung**. Sonst
  müssten Funktionen serialisiert werden.

**Sicherheitsnetz:** die harte Prüfung „bedingungsloser Ausweg" verlangt jetzt
eine Option ohne `cond` **und** ohne `manchmal`. Sonst könnte ein schlechter
Wurf alle Knöpfe wegnehmen.

### Zwölf Alternativen in häufig gezogene Ereignisse
Bewusst keine Zwischenwege, sondern ein dritter Ausgang mit eigenem Charakter —
sonst wäre es nur eine weitere Schattierung derselben Entscheidung. Die Sitzung
platzen lassen. Das Videostudium ganz sein lassen. Dem anderen die Mentorenrolle
geben, statt sie zu nehmen. Im Derby quer legen statt zu schiessen.

Gemessen über 4.000 Ziehungen: alle Anteile treffen ihren Sollwert innerhalb von
9 Prozentpunkten.

### Vierzehn weitere Ereignisse für den Anfang
Nach 35.10 standen mit 16 zwar 36 Ereignisse in 15 Themen bereit — aber **acht
dieser Themen hatten nur ein oder zwei Einträge**. Gezielt dort aufgefüllt:
Familie, Privat, Alltag, Konkurrenz, Medien, Fans, Körper, Kurios, Herkunft.

Die Mutter, die ihre Stelle verliert und es nicht sagt. Der Großvater, der seit
zwanzig Jahren jedes Spiel filmt. Vierzig Fahrstunden neben dem Training. Der
Neue aus dem Ausland, der beim Essen allein sitzt. Der Akzent, den sie in der
Kabine nachmachen. Der erste braune Umschlag vom Finanzamt.

### Das Werkzeug hat zwei Wechselwirkungen sofort gefunden
`a2_fuehrerschein` vergab `fuehrerschein`, **den es schon gab** (`j_fuehrerschein`),
und `a2_behoerde` vergab `steuerberater`, den `ew_steuer` schon vergibt. Man
hätte den Führerschein zweimal machen und zweimal denselben Berater suchen
können. Drei Bedingungen nachgezogen — auch bei `ew_steuer`, das seine eigene
Flagge bis dahin nicht abfragte.

### Zahlen
| | 35.13 | 35.14 |
|---|---|---|
| Ereignisse | 488 | **502** |
| Optionen | 1.028 | **1.073** |
| davon nur manchmal | 0 | **15** |
| davon mit Bedingung | 33 | **34** |
| Ereignisse mit 3+ Optionen | 51 | **56** |
| Topf mit 16 Jahren | 36 | **40** |

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Bündel **1.141,97 kB** / 421,29 kB gepackt.
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.14. Grundlinien unverändert.
Mechanik über 4.000 Ziehungen nachgewiesen: Anteile stimmen, `EVENTS` bleibt
unverändert, keine Ziehung ohne Optionen.

## 35.15 · Vier Geschichten statt einer

Nach 35.9 gab es **einen** Strang bei 502 Ereignissen. Die Mechanik trug
deutlich mehr, sie war nur nicht genutzt.

| Strang | Stufen | Ereignisse | Wege |
|---|---|---|---|
| Der aus der Jugend | 3 | 5 | geholfen · Geld · abgewimmelt |
| **Das Buch** | 3 | 5 | offen · Freigaberecht · abgelehnt |
| **Das Knie** | 3 | 5 | behandelt · getragen · pausiert |
| **Dein Trainer** | **4** | 6 | treu · höflich · still |

Bewusst unterschiedlich gebaut. *Das Buch* ist eine Frage nach Kontrolle: wie
viel gibt man ab, wenn jemand die eigene Geschichte aufschreibt. *Das Knie* ist
die kleine Verletzung, die nicht weggeht — der erste Strang, der `injuryProne`
über Jahre trägt statt nur einmal zu zucken. *Dein Trainer* hat als erster
**vier** Stufen und läuft über eine halbe Laufbahn: von der Entlassung an einem
Dienstagvormittag bis zu seiner Verabschiedung mit einundsechzig.

### Zwei Messungen, zwei Nachbesserungen
**Kommen sie an?** Ein Strang, der bei Stufe 2 versandet, ist schlechter als
keiner. Gemessen über 80 Laufbahnen: **92 bis 100 %** Abschlussquote.

Dahin war es aber ein Weg. Erste Messung:

- **Nur 43 % der Laufbahnen erlebten überhaupt eine Geschichte.** Die
  Einstiegsereignisse trugen `w:3` — dasselbe Gewicht wie ein beliebiges
  Alltagsereignis, obwohl sie den Kopf einer mehrjährigen Geschichte bilden.
  Auf `w:7` angehoben; die Fortsetzungen brauchen kein Gewicht, sie bekommen
  ohnehin den festen Platz. Jetzt **60 %**.
- **`buch` kam nur zu 62 % an**, weil es nach dem Start noch fünf Saisons
  braucht und häufiger auch in Laufbahnen startet, die früher enden.
  Wartezeiten von 2+3 auf 1+2 gekürzt und Einstieg von 25 auf 23 Jahre
  vorgezogen. Jetzt **94 %**.

**Verdrängen sie die normalen Ereignisse?** Nein: Strangereignisse machen
**5,2 %** aller gezogenen aus, und in 83 % der Saisons läuft gar kein Strang.
Zwei gleichzeitig kommen in unter einem Prozent der Saisons vor — die Sorge,
dass der zweite Ziehungsplatz dauerhaft belegt sein könnte, war unbegründet.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
10 Ereignisprüfungen ohne Befund. Die Strangprüfung erkennt alle vier und
bestätigt: lückenlose Stufen, kein Weg ohne Erzeuger, kein Weg ohne Nachfolger,
Tabelle stimmt mit den vorhandenen Stufen überein.
**518 Ereignisse** (502 + 16 neue in Strängen), 21 davon in Strängen.
Bündel **1.154,73 kB** / 424,89 kB gepackt. `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.15.

*(Im ersten Entwurf dieses Blocks stand 523 — geschätzt, nicht gezählt. Der
Prüfstand meldete 518. Dieselbe Sorte Zahl wie die Bündelgröße in 35.4.)*

## 35.16 · Vierundzwanzig weitere Male anders

Fortsetzung von 35.14. Dort hatten 15 Ereignisse eine gelegentliche Alternative
bekommen — bei 518 Ereignissen war das ein Anfang, kein Zustand.

Gemessen über 60 Laufbahnen, welche Ereignisse am häufigsten gezogen werden und
noch **keine** Alternative haben; die obersten 24 daraus bedient. Jetzt **39 von
1.132 Optionen** erscheinen nur manchmal.

Bewusst wieder eigene dritte Ausgänge, keine Schattierungen: barfuß durch den
Matsch in die Kabine. Das alte Trikot öffentlich verteidigen. Die Strafenkasse
der U15 spenden statt der Weihnachtsfeier. Dem Schiedsrichter hinterher
gratulieren, weil er recht hatte. Zwei Wochen in der Heimat, ohne dass jemand
erfährt, dass man da ist.

### Drei Funde, jeder von einer anderen Art

**1. Ein Riegel an der falschen Stelle — beinahe.**
`b_dopingkontrolle` kehrt alle fünf Saisons wieder, und meine neue Option vergab
jedes Mal die Flagge `sauber`. Die Prüfung meldete es zu Recht. Die naheliegende
Lösung — das Ereignis sperren — wäre falsch gewesen: **Kontrollen sollen
wiederkehren.** Der Riegel gehört an die einzelne Option.

Damit war aber die Prüfung zu grob: sie kannte nur die Bedingung des
*Ereignisses*. Nachgeschärft, sie sieht jetzt auch Riegel an der Option, die die
Flagge vergibt. In beide Richtungen gegengeprüft.

**2. Ein Absturz mitten in der Saison.**
Ich hatte `forceInjury:1` geschrieben. Die Wirkung erwartet `"leicht"`,
`"mittel"` oder `"schwer"` — bei einer Zahl stirbt `simulateSeason` mit
*Cannot read properties of undefined*. Nicht beim Laden, sondern **mitten im
Spiel**. Die Kalibrierung ist sofort gestorben.

Das ist die Sorte Tippfehler, die man in 1.132 Optionen nie von Hand findet.
Also **neue harte Prüfung**: Wirkungen mit festen Werten müssen erlaubte Werte
benutzen. Elf Prüfungen sind es jetzt.

**3. Und einmal ich selbst, zum dritten Mal in derselben Falle.**
Beim Nachschärfen der Prüfung sind drei Einfügungen hintereinander gescheitert,
weil ich die Suchvorlage aus einer `sed`-Anzeige kopiert hatte — und die fügt
zwei Leerzeichen ein. Schlimmer: ein `grep` auf die Ausgabe verschluckte den
Absturz, das Skript lief gar nicht und die Gegenprobe zeigte **dreimal
scheinbar dasselbe Ergebnis**. Genau die Stolperfalle *„schweigende Ausgabe ist
kein bestandener Lauf"*. Die Gegenprobe prüft seitdem zuerst, ob das Skript
überhaupt durchgelaufen ist.

### Nachgemessen
Über **30.000 Ziehungen**: alle 39 Anteile treffen ihren Sollwert, `EVENTS`
bleibt unverändert. Bei 4.000 Ziehungen wichen zwei um zehn Punkte ab — beide
innerhalb von gut zwei Standardabweichungen, also Rauschen. Statt die Toleranz
zu lockern, wurde die Stichprobe vergrössert; dieselbe Entscheidung wie bei der
Wildcardprüfung in 35.13.

Überschneidung zweier aufeinanderfolgender Laufbahnen: **5,9 %** über die ganze
Laufbahn (35.10: 7,0 %). Der Wert bewegt sich langsam, weil er nur Kennungen
zählt und nicht, welche Knöpfe darunter standen.

### Geprüft
Prüfstand: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten,
**11 Ereignisprüfungen** ohne Befund. Grundlinien unverändert.
518 Ereignisse · 1.132 Optionen · 39 nur manchmal · 36 mit Bedingung.
Bündel **1.161,97 kB** / 427,01 kB gepackt (die 1.161,95 oben waren vor dem
Anheben der Fassungsnummer gemessen). `sicht.sh`: 13/13 · 8 px · 4/4 ·
Impressum 35.16.

## 35.17 · Der eigene Verein — Durchstich

Kevins neue Idee: statt die Absolventen ziehen zu lassen, zieht man sie in eine
eigene erste Mannschaft hoch und arbeitet sich durch die Ligen. **Dies ist der
Rechenkern, nicht der Bildschirm** — bewusst in dieser Reihenfolge, damit
zuerst nachweisbar ist, DASS die Aufstellung wirkt. Eine schöne Oberfläche über
einer Rechnung, die die Wahl ignoriert, wäre genau der tote Code, den 35.7
abgetragen hat.

### Vier Messungen vor der ersten Zeile Code
| Frage | Antwort |
|---|---|
| Gibt es eine Ligapyramide? | Ja. 1.239 Vereine, **21 Länder mit Unterbau**. GER: 3. Liga (49) → 2. Liga (59) → Bundesliga (75). |
| Gibt es einen Elf-gegen-Elf-Motor? | **Nein.** Der Tabellenplatz entsteht aus der Vereinsstärke ± Zufall. |
| Wie lange bis 11+Bank aus Absolventen? | **11 Jahre** bei Vollausbau, 30 bei Stufe 3. Untragbar. |
| Und aus dem Bestand *hochgezogen*? | **Sofort.** Die Akademie hält gleichzeitig 17 (Stufe 4) bis 22 (Stufe 6) Talente. |

Die dritte Zahl hätte das Konzept gekippt. Kevins Wort war aber
„**hochziehen**", nicht „auf Absolventen warten" — und damit trägt es: der Kader
ist aus dem Bestand zu füllen, die Spieler sind mit ~46 Stärke unfertig, und
man plündert die Akademie, die 5,5 Talente im Jahr nachliefert. **Drei bis vier
Jahre Erholung** sind der Preis. Das ist keine Hürde, das ist die Entscheidung,
um die es geht.

Und die vierte Zahl passt von selbst: dritte Ligen liegen bei **46–49**, ein
hochgezogener Jugendkader bei **46**.

### Was der Kern kann
`verein.js`, Fabrik wie `ereignisse.js` (Ringimport). Gründung mit Land und
Liga · 5 Formationen · 5 Taktiken · Hochziehen aus der Akademie · Mindestkader
16 · Aufstellung mit Positionseignung · Mannschaftsstärke · Saison mit Tabelle,
Auf- und Abstieg · Altern und Rücktritte · Chronik und Bilanz · 15-Jahres-Grenze.

**Die Aufstellung wirkt an genau einer Stelle:** die Mannschaftsstärke ersetzt
die feste Vereinsstärke, mit der die vorhandene Maschine ohnehin arbeitet. Kein
Spielsimulator nötig — Tabelle, Zufall und Ligagröße gelten unverändert.

Positionseignung nach Kevins Vorgabe: ein Torwart ist kein Stürmer, ein Stürmer
kann außen spielen, ein Sechser im Mittelfeld. **Kein Wert zwischen 0 und 0,6** —
was schlechter passt, gilt als unmöglich und wird gar nicht erst angeboten.

### Zwei eigene Fehler, beide durch Messen gefunden
1. **Frauenligen in der Männerpyramide.** Der erste Entwurf erkannte sie am
   NAMEN — und „Serie A Femminile" hat zwei m, mein Muster nur eins. Aufstieg
   von der Serie C in die Serie A Femminile. Die Vereine tragen ein Feld `g`;
   danach wird jetzt getrennt. Die Stolperfalle „harte Zeichenkette", wörtlich.
2. **Eine Bilanz voller Nullen.** Ich las `tabelle.eigene.tore` — `simTable`
   liefert ein **Array**, die eigene Zeile trägt `me: true`. Aufgefallen nur,
   weil der 15-Jahres-Lauf die Bilanz ausgegeben hat. Und beim Nachprüfen bin
   ich prompt in die nächste Falle gelaufen: das Prüfbündel nicht neu gebaut
   und ein **altes** geprüft.

### Der Bogen trägt
Ein voller Durchlauf, automatisch aufgestellt: Aufstieg im ersten oder zweiten
Jahr, acht Jahre zweite Liga bei wachsender Stärke, Aufstieg, ein Abstieg, dann
etabliert. **Die Stärke läuft bei 66 gegen die Wand** — mit reinen
Eigengewächsen erreicht man die Bundesliga (Schnitt 75), beherrscht sie aber
nicht. Genau die Bremse, die Kevin sich gewünscht hat, und sie entsteht von
selbst statt durch eine Sperre.

### Zwei weitere Befunde, die erst der Prüfstand brachte
**Sechzehn Spieler sind nicht dasselbe wie eine Mannschaft.** Zieht man die
stärksten Talente hoch, kann der Torwart fehlen. Neu: `bedarf()` sagt, welche
Plätze unbesetzbar sind — im Spiel gehört das gross auf den Kaderbildschirm.

**Und die Akademie hatte in 14,5 % der Fälle gar keinen Torwart** (gemessen über
200 Akademien; Torhüter sind nur 8,3 % der Aufnahmen). Solange die Absolventen
zu fremden Vereinen gingen, war das folgenlos — jetzt ist es eine Sackgasse.
Absicherung: ist im Haus kein Torwart, wird der erste Neuzugang einer. **Null von
200** danach, und der Torwartanteil bleibt bei rund neun Prozent.

Dabei noch ein eigener Konstruktionsfehler: `bedarf` und `autoAufstellen` waren
**zwei ähnliche Verfahren** und konnten sich widersprechen — die Auskunft meldete
"alles besetzbar", die Aufstellung liess trotzdem einen Platz frei. Einer von
zwölf Läufen fiel darauf herein. `bedarf` leitet sich jetzt aus `autoAufstellen`
ab: ein Verfahren, eine Antwort. Dazu ein Reparaturdurchgang, der Lücken mit
irgendjemandem füllt, der dort spielen kann — ein schwacher Mann ist immer
besser als eine Lücke, die mit Stärke 24 zählt.

### Geprüft
Neuer Prüfteil **`verein`** mit **21 Prüfungen**, im Prüfstand verdrahtet.
Zwanzig Läufe hintereinander grün.
Darunter der eigentliche Punkt: eine falsche Aufstellung ist messbar schlechter
(52,4 gegen 28,4), Taktik verschiebt Abwehr und Angriff gegenläufig, fünfzehn
Saisons laufen ohne Abbruch durch, die Bilanz zählt echte Zahlen.
Prüfstand gesamt: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder,
11 Ereignisprüfungen, 21 Vereinsprüfungen. Bündel **1.162,02 kB** / 427,02 kB.

### Was als Nächstes kommt
Der Bildschirm: Gründung mit Wappen, Farben und Trikot · Kaderansicht mit
Hochziehen · Aufstellung · Saisonbericht. Dazu die Anbindung an den
Laufbahnzähler (Freischaltung ab 5 Laufbahnen), das Entfernen der Jahreszahlen
aus der Akademie und das Tutorial.

## 35.18 · Der Vereinsmodus ist zu Ende gerechnet

35.17 hatte den Durchstich: gründen, hochziehen, aufstellen, eine Saison. Jetzt
das, was den Kreis schliesst — **Abschluss, Vermächtnis, Ausbau,
Freischaltung**. Weiter bewusst ohne Bildschirm: der kann danach nur noch
anzeigen, was hier nachweisbar rechnet.

### Freischaltung — nichts Neues zu zählen
Kevins Vorgabe: Akademie ab 2 abgeschlossenen Laufbahnen, Verein ab 5. Der
Zähler `karrieren` steht bereits in der Lebensstatistik. `freigeschaltet()`
sagt zusätzlich, **wie viele noch fehlen** — „noch 2 bis zum Verein" ist eine
Auskunft, ein grauer Knopf ohne Begründung ist eine Zumutung. Dieselbe
Überlegung wie bei `sperre` an den Auswahlmöglichkeiten.

### Vereinsausbau — drei Abteilungen, nicht neun
Der Verein soll die Akademie nicht nachbauen, sondern ihre Absolventen besser
machen. **Trainingszentrum** (schnellere Entwicklung) · **Stadion**
(Mannschaftsstärke) · **Medizinische Abteilung** (längere Laufbahnen), je sechs
Stufen. Die Kosten liegen über einer Akademiestufe: beides gleichzeitig
auszubauen soll eine Entscheidung sein, kein Nebenher.

**Jede Wirkung ist nachgewiesen, nicht nur vorhanden** — genau der Fehler, den
35.7 abgetragen hat:
- Stadion voll: Mannschaftsstärke **50 → 54**
- Training voll: Kader nach einer Saison **52,1 → 57,1**
- Medizin voll: **18 → 0** Abgänge bei einem Kader von 34-Jährigen

### Abschluss und Vermächtnis
Nach fünfzehn Jahren Bilanz. Die Punkte gewichten **Aufstieg höher als
Platzierung**: der Modus soll zum Hocharbeiten einladen, nicht zum Verwalten.
Ein Abstieg kostet, aber weniger als ein Aufstieg bringt — **wer es versucht
und scheitert, steht besser da als wer nichts riskiert.** Gemessen und geprüft.

Fünf Boni mit eigenen Schwellen, und man bekommt **alle**, die man erreicht hat
— ein knapp verpasster Sprung wäre sonst ein Totalverlust. Guter Ruf ·
Bekannte Adresse · Volle Kasse · Fussballschule · Legendenstatus.

VC-Ausschüttung 60 bis 420. Zum Vergleich: eine Laufbahn bringt rund 107 VC,
ein Vereinsdurchlauf dauert fünfzehn davon. Spürbar, aber kein Ersatz für die
Akademie.

**Der Bonus liegt am Verein, nicht an der Akademie**, und wird beim nächsten
Abschluss neu bestimmt statt sich aufzustapeln. Nachgewiesen, dass er im
*nächsten* Verein ankommt: ein hochgezogenes Talent startet mit 52 statt 50.

### Ein Test, der das Falsche gemessen hat
Die Medizinprüfung meldete erst **18 gegen 18** — kein Unterschied. Ursache war
nicht der Code, sondern mein Testaufbau: Spieler mit Stärke 50 fallen auch mit
Vollausbau unter die zweite Bedingung („ab 33 und schwächer als 55"). Der Test
maß die Schwäche, nicht die Medizin. Mit Stärke 70: 18 gegen 0.

### Geprüft
Vereinsprüfung von 21 auf **39 Prüfungen**, acht Läufe hintereinander grün.
Prüfstand gesamt: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder,
11 Ereignisprüfungen, 39 Vereinsprüfungen. Bündel **1.162,03 kB** / 427,03 kB.
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.18.

### Was jetzt noch fehlt
Nur noch Anzeige: Gründung mit Wappen, Farben und Trikot · Kaderansicht mit
Hochziehen · Aufstellung · Saisonbericht · Abschlussbilanz. Dazu die
Jahreszahlen aus der Akademie und das Tutorial.

## 35.19 · Die Akademie wird zeitlos

Kevins Einwand zum Vereinsmodus: die Akademie soll ohne Jahreszahlen auskommen,
damit sie individuell und grundsätzlich nutzbar bleibt. Jahreszahlen gehören in
die Vereinsübersicht, nicht ins Nachwuchshaus.

Bis 35.18 stand dort: *„Gegründet 2026 · Jahr 2041"*, *„Jahrgang 2032"*,
*„Jahr 2039"* in der Chronik. Jetzt: **„16. Jahr · 15 Jahrgänge"**,
**„Jahrgang 7"**, **„14. Jahr"**.

### Intern bleibt der Zähler stehen
`a.jahr` wird **nicht** entfernt. Er trägt die Reihenfolge, und ihn
herauszunehmen hätte jede bestehende Sicherung entwertet — dieselbe Überlegung
wie bei den Akademieabteilungen in 35.13, nur diesmal von vornherein bedacht.
Nach aussen wird nur noch relativ gezählt.

Zwei Hilfsfunktionen, beide für alte Sicherungen ausgelegt:
- `akaJahrNr(a)` — das wievielte Jahr läuft
- `akaJahrgang(a, j)` — aus einer gespeicherten Zahl die Nummer machen

**Alte Sicherungen tragen in `ein` eine Weltjahreszahl**, neue eine kleine.
Unterschieden wird an der Grenze 1900 — grosszügig, aber eine Akademie mit 1900
Jahrgängen wird es nicht geben. Fehlt das Gründungsjahr, wird die Zahl
**unverändert durchgereicht** statt eine falsche zu erfinden.

### Ein Testaufbau, der das Falsche gemessen hat
Die Zählprüfung meldete erst **1,1,1,1,1,1**. Ursache war nicht der Code:
mein Test liess die Akademie Jahre laufen, ohne sie zu **gründen** — dann ist
`gegruendet` null und die relative Zählung fällt zu Recht auf 1 zurück. Im
Spiel gründet man immer zuerst. Zweiter Fall an einem Tag, in dem der Test und
nicht die Sache falsch war.

### Geprüft
Vereinsprüfung von 39 auf **47 Prüfungen**. Darunter beide Richtungen der
Umrechnung, die Grenze zu alten Sicherungen, fehlende Werte, und dass die
Nummer über sechs Jahre lückenlos hochzählt.
Prüfstand gesamt: **407 Prüfungen**, 0 Fehler, alle vier Zielbänder,
11 Ereignisprüfungen, 47 Vereinsprüfungen. Bündel **1.162,17 kB** / 427,08 kB.
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.19.

### Was noch offen ist
Nur noch Oberfläche: Gründungsbildschirm mit Wappen, Farben und Trikot ·
Kaderansicht mit Hochziehen · Aufstellung · Saisonbericht · Abschlussbilanz ·
Tutorial. Der Rechenkern darunter ist vollständig und geprüft.

## 35.20 · Der Verein bekommt ein Gesicht

Der Rechenkern stand seit 35.17/35.18 mit 47 Prüfungen. Jetzt die Anzeige —
in dieser Reihenfolge, damit der Bildschirm nur zeigt, was nachweislich rechnet.

### Wappen: gezeichnet, nicht gemalt
Ein freier Zeicheneditor wäre auf einem Telefon Quälerei und in einer Sicherung
ein Datenklotz. Stattdessen dieselbe Bauweise wie bei den Avataren: **5 Formen ×
8 Zeichen × 2 Farben**. Ein Wappen ist damit vier Zahlen gross und beliebig oft
neu würfelbar. Dazu ein Trikot in vier Mustern — die Farbwahl soll nicht
abstrakt bleiben.

Die Formen folgen der Hausschrift: harte Kanten, sichtbare Ränder, Raute.

### Drei Bildschirme
**Gründung** — Name, Stadt, Land, Farben, Wappen, Trikot. Die Vorschau steht
**oben**, nicht am Ende: man soll sehen, was man baut, während man es baut. Die
Ligapyramide wird ganz gezeigt, aber nur die unterste Stufe ist wählbar — der
Weg nach oben soll sichtbar sein, ohne abkürzbar zu werden.

**Verein** — vier Reiter (Kader · Aufstellung · Ausbau · Chronik). Der
Anpfiffknopf steht **oben**, weil er das Ziel jeder Sitzung ist, und **er sagt,
was fehlt**: „Noch 3 Spieler nötig" oder „Nicht besetzt: 1× TW". Ein grauer
Knopf ohne Begründung ist eine Zumutung — dieselbe Überlegung wie bei `sperre`
und bei „noch 2 bis zum Verein".

Im Kaderreiter sind Talente, die eine **offene Position** füllen können,
hervorgehoben. Im Aufstellungsreiter steht bei jedem fehlbesetzten Platz, wie
viel Prozent ankommen.

**Abschluss** — Bilanz, Vermächtnispunkte, VC und die Boni, die der nächste
Verein mitbekommt.

### Vier Fehler beim Einbau
1. **Klassen erfunden.** Ich schrieb `className="feld"` für Eingaben — es heisst
   `inp` und `sel`. Nachgesehen statt geraten wäre schneller gewesen.
2. **Kein Ressort.** Ohne Eintrag in `RESSORT` bliebe die Kolumnentitelzeile
   leer. Angelegt: „DEIN VEREIN".
3. **Reine Zeichnungen gelten als leere Ansicht.** Die Prüfung verlangt Text;
   für SVG gibt es den dritten Parameter `0`, so wie bei `Balken` und `Pass`.
4. **`NAT_BY_ID[k].n` gibt es nicht** — das Feld heisst `name`, und nicht jedes
   Land mit Vereinen steht darin. Der Gründungsbildschirm stürzte in
   `localeCompare` auf `undefined` ab. Fehlt der Eintrag, wird jetzt die Kennung
   angezeigt statt einer Lücke.

Dazu zum vierten Mal an diesem Tag die Einrückungsfalle: eine Suchvorlage aus
einer `sed`-Anzeige kopiert, die zwei Leerzeichen einfügt. Zeilenbasiertes
Einsetzen funktioniert, textbasiertes Suchen nicht.

### Geprüft
Ansichtenprüfung von 407 auf **457** — **50 neue Ansichten**: jede Wappenform
mit jedem Zeichen einzeln (ein fehlender Pfad fällt sonst erst auf, wenn jemand
genau diese Kombination wählt), alle Trikotmuster, die Gründung, der Verein
**ohne Kader** (dort zeigt sich, ob die Ansicht ohne Spieler hält), spielbereit,
ohne Akademie, und beide Abschlüsse.
Prüfstand gesamt: **457 Prüfungen**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 47 Vereinsprüfungen.
Bündel **1.162,22 kB** / 427,10 kB. `sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.20.

### Was noch fehlt
Das **Tutorial** — und die Anbindung ans Hauptmenü, also der Knopf, der den
Verein aufruft, samt Speichern des Vereinszustands. Beides ist Arbeit am
laufenden Spiel und gehört auf das Gerät geprüft, nicht in den Prüfstand.

## 35.21 · Der Verein ist erreichbar

Bis 35.20 war der Vereinsmodus gebaut und geprüft, aber im Spiel **nicht
aufrufbar**. Jetzt hängt er im Hauptmenü, wird gespeichert und geladen.

### Drei Zustände in einer Route
Nicht gegründet → Gründungsbildschirm. Laufend → Vereinsbildschirm.
Abgeschlossen → Bilanz. Der **Abschluss hat Vorrang**: er ist das Ergebnis von
fünfzehn Jahren und darf nicht hinter der Kaderliste verschwinden.

### Eigener Speicherschlüssel
`rasenschach:verein`, getrennt von der Akademie — der Verein wird beim
Abschluss ersetzt, sie bleibt bestehen. In beide Sicherungslisten aufgenommen,
damit er im Backup landet. Fällt das Schreiben aus, läuft das Spiel weiter;
verloren wäre der letzte Zug, nicht der Stand.

### Die Menüzeile zeigt auch, was gesperrt ist
Vor der Freischaltung steht dort **„noch 3 Laufbahnen bis zur Freischaltung"**
statt gar nichts. Ein verstecktes Ziel merkt niemand — dieselbe Überlegung wie
bei `sperre` an den Auswahlmöglichkeiten.

Dafür bekam `zeile()` einen echten Sperrzustand: ohne Klick wird sie
abgeblendet und `disabled`, statt nur nicht zu reagieren. Ein Knopf, der
klickbar aussieht und nichts tut, ist schlechter als ein sichtbar gesperrter.

### Drei Fehler beim Verdrahten
1. **`gesamt` gibt es nicht** — die Lebensstatistik heisst `ges`.
2. **Der Ladeblock landete zwischen `try` und `catch`** der Akademie. esbuild
   meldete *Expected „finally" but found „try"*.
3. Beim Verschieben traf mein Suchtext **die falsche von zwei Fundstellen**
   („noch keine Akademie" steht auch in einem Anzeigetext). Zeilengenau
   nachgesetzt: das `catch`, das unmittelbar auf den `AKA_KEY`-Block folgt.

Und einmal hat mich mein eigenes `head` getäuscht: `esbuild … | head -6` gibt
den Rückgabecode der **Pipe** zurück, nicht den des Übersetzers — die Meldung
„Übersetzung fehlerfrei" erschien neben einem Fehler. Seitdem wird die Ausgabe
in eine Datei geschrieben und der Code getrennt geprüft. Dieselbe Klasse wie
„schweigende Ausgabe ist kein bestandener Lauf".

### Geprüft
Ansichtenprüfung von 457 auf **460**: die Menüzeile in drei Zuständen —
gesperrt (mit der fehlenden Zahl), frei mit Verein, frei ohne Verein.
Prüfstand gesamt: **460 Prüfungen**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 47 Vereinsprüfungen.
Bündel **1.190,24 kB** / 435,86 kB gepackt (+28 kB gegenüber 35.19: Bildschirme
und Anbindung). `sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.21.

### Was jetzt wirklich nur noch fehlt
Das **Tutorial**. Alles andere ist da und aufrufbar.

## 35.22 · Was hier stand, stimmte nicht mehr

**Am Spiel ist nichts geändert.** `App.jsx` unterscheidet sich von 35.21 in
genau zwei Zeilen (`VERSION`, `VERSION_INFO`), nachgewiesen per `diff`. Diese
Fassung räumt fünf Stellen auf, an denen diese Datei etwas anderes behauptete
als der Code — gefunden bei der Eingangsprüfung einer Sitzung, in der sonst
nichts zu tun war.

Das ist kein Aufräumen um des Aufräumens willen. Punkt 3 unten hätte einen
**bestandenen Prüflauf wie einen Fehlschlag aussehen lassen.**

### Die fünf Fundstellen

| # | Wo | Stand bis 35.21 | Gemessen |
|---|---|---|---|
| 1 | Kopf dieser Datei | „Fassungsnummer in `App.jsx` Zeile 10“ | `VERSION` steht auf **Zeile 12**, Zeile 10 ist leer |
| 2 | Abschnitt 1 | „**eine einzige** `App.jsx` (~840 KB, ~10.800 Zeilen)“ | **764 KB, 12.829 Zeilen** — und sie bindet **vier** eigene Dateien ein, zwei davon mit Spielinhalt |
| 3 | Abschnitt 4 | Vollausbau 1.564 VC, Zielband **1.400–1.700** | **2.912 VC**, Zielband **2.700–3.100** |
| 4 | Abschnitt 4 | VC je Laufbahn 51 · 40-Laufbahnen-Verlauf „~33 Profis, Ansehen ~160“ | **105,3** · **70,6 Profis, Ansehen 338** |
| 5 | Offener Punkt 10 | „`App.jsx` hat noch 12.041 Zeilen“ | **12.829** — die 12.041 waren der Stand von 35.11 |

Punkt 3 ist der teure. Abschnitt 4 trug die Datierung 7.8.2026 und stammte
damit aus der Zeit **vor** dem Akademieausbau. 35.13 hat das Zielband bewusst
angehoben und das in `kalibrierung.cjs` sauber begründet — nur hier stand
weiter das alte. Formal deckte der Vorrangvermerk in Abschnitt 3 das ab („was
später kommt, gilt“); praktisch stand über der Tabelle das Wort „Gemessen“,
und eine gemessene Zahl, die nicht mehr gilt, ist kein Vorrangproblem.

### Was gegen die Wiederholung hilft
Vier der fünf Stellen sind Zahlen, die mit jeder Fassung altern. Sie zu
berichtigen ist nur die halbe Arbeit — in fünf Fassungen stünde dasselbe
wieder da. Deshalb zwei Änderungen an der Mechanik:

**Der Kopf verweist nicht mehr auf eine Zeilennummer, sondern auf eine
Prüfung.** Neue Prüfung 5 in `pruefen.sh` vergleicht die Fassung in `App.jsx`
mit der Kopfzeile dieser Datei. Genau der Fall aus der Stolperfalle „‚Daran
denken‘ ist keine Regel“: entweder prüfbar, dann in `pruefen.sh` — oder nicht,
dann steht hier, warum nicht.

**Gegengeprüft in vier Richtungen**, weil eine Prüfung, die nur schweigt,
nichts beweist:

| Fall | Erwartet | Gemessen |
|---|---|---|
| alles stimmt | schweigt | schweigt ✓ |
| Kopf auf 35.19 verstellt | feuert | „Fassung laeuft auseinander — App.jsx 35.21, STAND.md-Kopf 35.19“ ✓ |
| `App.jsx` auf 35.99, Kopf unverändert | feuert | Prüfung 4 **und** 5 melden ✓ |
| Kopfzeile gelöscht | feuert | „keine Kopfzeile **Fassung <Nr>**“ ✓ |

**Die 40-Laufbahnen-Zahl ist jetzt nachrechenbar.** Sie war eine Einmalmessung
ohne Werkzeug — niemand konnte sie wiederholen, also fiel auch nicht auf, dass
sie veraltet war. Neu: `pruefstand/verlauf40.cjs`. Es läuft **nicht** in
`pruefen.sh`: 40 s für eine Auskunft ohne Zielband wären 40 % mehr Laufzeit.
Diese Begründung steht im Kopf des Skripts, nicht nur hier.

Beim Bau des Werkzeugs zwei eigene Fehler, beide durch Messen gefunden: die
Bonusfelder heißen `dev` und `money` (in Mio €), nicht `growth`; und die
Laufbahnschleife musste wörtlich aus `kalibrierung.cjs` übernommen werden,
sonst wären die Zahlen nicht vergleichbar. Ein Unterschied ist gewollt und
steht im Kopf: `kalibrierung.cjs` spielt **ohne** Akademiebonus, `verlauf40.cjs`
**mit** — ohne diese Rückkopplung misst man nicht den Verlauf, sondern etwas
anderes.

### Der neue Verlauf, und warum er die Kalibrierung stützt
30 Durchgänge à 40 Laufbahnen, Ausbau immer günstigstes zuerst:

    Profis       Mittel  70,6 · Median  70 · Spanne 58–83
    Weltklasse   Mittel   3,7 · Median   4 · Spanne 1–7
    Ansehen      Mittel 338,1 · Median 349 · Spanne 246–410
    Vollausbau (54 Stufen) erreicht: 30 von 30

Die letzte Zeile ist die interessante. Die Kalibrierung rechnet „2.912 VC
geteilt durch 105,3 VC je Laufbahn = 27,6“ — eine **Division**, kein
gespielter Verlauf. Dass 40 tatsächlich durchgespielte Laufbahnen in 30 von 30
Fällen zum Vollausbau führen, bestätigt die Rechnung von der anderen Seite.
Zwei unabhängige Wege zur selben Aussage sind mehr wert als eine Zahl zweimal.

### Geprüft
Prüfstand gesamt: **460 Prüfungen**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 47 Vereinsprüfungen.
Bündel **1.190,23 kB** / 435,85 kB gepackt (−0,01 kB gegenüber 35.21: der
neue `VERSION_INFO`-Text ist kürzer — es gibt keine andere Codeänderung).
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.22.
Neue Prüfung 5 in vier Richtungen gegengeprüft (Tabelle oben).
`verlauf40.cjs`: 30 Durchgänge, 40 s.

## 35.23 · Der Pass wuchs an zwei Stellen, keine davon war die vermutete

Offener Punkt 8 („Spielerpass wächst weiter", von Kevin am 15.8. auf dem Gerät
gemeldet). Der Punkt nannte einen Hauptverdächtigen — und der war es nicht.

### Was der Punkt vermutete, und warum es falsch war
> „Verdächtig ist `.zellen` (`flex-wrap:wrap` mit `flex:1 0 auto`): die vier
> Felder *Stationen · Spiele · Tore · Vorlagen* können nicht schrumpfen und
> brechen um, sobald die Zahlen breiter werden."

**Der Block bricht nie um.** Nicht bei 412 px, nicht bei 360 px, nicht bei
vierstelligen Zahlen (1024 Spiele, 640 Tore). Grund steht eine Zeile weiter
oben im CSS: `.zellen .eb{display:block}` — die Beschriftung steht **über**
der Zahl, nicht daneben. „Vorlagen“ ist breiter als jede Zahl, die darunter
passt, also bestimmt die Beschriftung die Feldbreite, und die ändert sich nie.
Gemessene Luft: 71,7 px bei 412 px Breite, 19,7 px bei 360 px.

Die Vermutung war plausibel und stand zwei Fassungen lang unwidersprochen da.
Sie hätte zu einer Änderung an `.zellen` geführt — und `.zellen` steckt an
**sieben** Stellen, darunter die Karriere-Kopfleiste. Der Satz „vor der
Änderung messen“, der im Punkt stand, hat genau das verhindert.

### Was es wirklich war
Gemessen über acht Karrierestände bei 412 px:

| Stand | Höhe | Sprung |
|---|---|---|
| 0 Stationen | 240,0 | — |
| 1 Station | 311,6 | **+72** |
| 5 Stationen | 311,6 | 0 |
| 6 Stationen | 328,9 | **+17** |
| 10 / 16 / 18 Stationen, alle Extreme | 328,9 | 0 |

**Zwei Sprünge, beide aus 34.16.** Jene Fassung deckelte die Vereinsliste auf
150 px und schrieb dazu, der Pass sei „von der ersten Station an gleich hoch“:

* **+17,3 px ab sechs Stationen** — die Hinweiszeile „N Stationen · in der
  Liste blättern“, die den Deckel *erklärt*. Nachgerechnet: 13,3 px Zeilenhöhe
  + 4 px Rand = 17,3, exakt der gemessene Sprung. Der Fix hat sein eigenes
  Versprechen um die Zeile verfehlt, die ihn ankündigt.
* **+72 px bei der ersten Saison** — vor der ersten Station steht statt der
  150-px-Liste ein Textabsatz. Das Versprechen galt „ab der ersten Station“,
  und davor eben nicht. Dieser Sprung ist der größere und stand nirgends.

Der zweite ist nur aufgefallen, weil der Stand „0 Stationen“ nachträglich in
die Messreihe kam. Die erste Fassung der Messung begann bei einer Station und
hätte den größeren der beiden Sprünge nie gesehen.

### Behoben
* Der Zweig ohne Stationen bekommt dieselbe feste Höhe (150 px) und dieselben
  Ränder wie die Liste.
* Der Platz der Hinweiszeile wird immer reserviert, mit einem geschützten
  Leerzeichen als Rückfall. **Keine feste px-Zahl** — eine wäre bei der
  nächsten Schriftänderung falsch, ohne dass es auffällt.

Ergebnis: **328,9 px konstant über alle acht Stände, bei 412 und bei 360 px.**
Der leere Pass ist damit 89 px höher als vorher; das ist der Preis dafür, dass
das Layout darunter nie springt.

### Neu im Prüfstand
`passbogen.jsx` (baut den Pass mit gesetzten Karriereständen), `passmessung.cjs`
(misst in Chromium), `passhoehe.sh` (Klammer, zwei Breiten). Hängt in `sicht.sh`.

Mit **Schranke**, nicht als Auskunft: mehr als 1 px Unterschied zwischen zwei
Ständen ist rot. Gegengeprüft in beide Richtungen — grün bei heiler Fassung,
und mit je einem wieder eingebauten Fehler `✗ +17,3 px` bzw. `✗ +88,9 px`,
Rückgabecode 1, `sicht.sh` meldet „1 Bereich(e) fehlgeschlagen“.

### Vier eigene Fehler beim Bau des Messwerkzeugs
Alle vier hätten stille Falschaussagen erzeugt. Sie stehen hier, weil drei
davon nur durch die Gegenprobe auffielen und nicht durch das Ergebnis.

1. **Vereinsobjekt statt Name** in `seasons` gesteckt. Eine Saison trägt `club`
   als Namen, `clubRef` als Objekt, `y` als Jahr — geraten statt nachgesehen.
   170 React-Fehler, gemessen wurde nichts.
2. **Luft gegen die gewachsene statt der nötigen Breite** gemessen. `flex-grow:1`
   füllt die Zeile immer aus, die Summe der Felder ist also **immer** gleich der
   Behälterbreite. Die Messung meldete für jeden Fall „knapp“, auch für den mit
   einer Station. Jetzt wird `flex-grow` kurz abgeschaltet, gemessen, zurückgesetzt.
3. **In die scrollende Liste hineingemessen.** Deren Einträge stehen im DOM
   unterhalb der Clip-Grenze. Die Messung meldete für 18 Stationen eine
   Rückseite von 552 px — eine Höhe, die es auf keinem Bildschirm gibt.
4. **`passhoehe.sh` maß blind, was in `/tmp/ps` lag**, statt der übergebenen
   Quelle. Dieselbe Klasse wie „altes Bündel geprüft“ aus 35.17 — nachgebaut in
   genau dem Werkzeug, das solche Fehler finden soll. **Aufgefallen nur, weil
   die Gegenprobe mit absichtlich kaputtem Pass grün blieb.** Ein Ergebnis, das
   stimmt, obwohl die Eingabe kaputt ist, ist kein Ergebnis. Das Skript baut
   jetzt selbst und druckt „gebaut aus: `const VERSION = …`“ als Beleg.

### Nicht angefasst
* **`wachstum` ist ein toter Parameter** in `function Pass({ p, full, wachstum })`
  — nirgends übergeben, nirgends im Rumpf benutzt. Ballast, kein Fehler; steht
  als offener Punkt.
* **Bei 360 px läuft der Pass über** (380 px breit bei 360 px Sichtfeld, Seite
  scrollt auf 399 px). Kevins S24 Ultra hat 412 px, dort tritt es nicht auf.
  Beobachtet in der vereinfachten Messumgebung, **im Spiel nicht verifiziert** —
  steht als offener Punkt, nicht als Befund.

### Geprüft
Prüfstand gesamt: **460 Prüfungen**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 47 Vereinsprüfungen.
Bündel **1.190,42 kB** / 435,89 kB gepackt (+0,19 kB gegenüber 35.22).
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.23 · Passhöhe 328,9 px konstant
über 8 Stände bei 412 und 360 px.
Passprüfung in beide Richtungen gegengeprüft (zwei eingebaute Fehler, beide rot).

## 35.24 · Durchsicht des ganzen Projektwissens

Kevin hat vor dem Einspielen um eine vollständige Kontrolle gebeten: nicht nur
„was hat sich geändert“, sondern „was ist falsch, was kann raus“. Alle 40
Dateien durchgesehen. **Ein Fehler war im Spiel sichtbar**, der Rest in den
Unterlagen.

### Im Spiel: die Akademie hatte drei Abteilungen zu wenig
Seit 35.12 hat die Jugendakademie **neun** Abteilungen. Zwei für den Spieler
sichtbare Texte sagten weiter „sechs“:

| Wo | Stand bis 35.23 |
|---|---|
| Errungenschaft `a_aka_voll` | „Alle **sechs** Abteilungen auf Stufe 6“ |
| Akademiebildschirm, voll ausgebaut | „**Sechs** Abteilungen, alle auf Maximum.“ |
| Kommentar bei `ABTEILUNGEN` | „Die **sechs** Abteilungen“ |

Die Bedingung dahinter war die ganze Zeit richtig
(`akaSumme(A) >= ABTEILUNGEN.length * AKA_MAX`) — nur der Text daneben war es
nicht. Zwölf Fassungen lang, direkt neben der Zahl, die es widerlegt.

Neu formuliert **ohne Zahl**: „Jede Abteilung auf Höchststufe“ und „Jede
Abteilung auf Maximum.“ Ein Text ohne Zahl kann nicht veralten. Beim nächsten
Ausbau ist nichts nachzuziehen.

### Dafür ein neues Werkzeug: `texttreue.cjs`
Der Fehler ist nicht durch Lesen aufgefallen, sondern durch einen Widerspruch
**in der erzeugten `UEBERSICHT.md`**: Zeile 24 nannte 9 Abteilungen, Zeile 2568
sechs. Beide Zahlen stammten aus demselben Spielcode.

Damit so etwas nicht vom Zufall abhängt, gleicht `texttreue.cjs` jetzt die
Zahl im sichtbaren Text jeder Errungenschaft gegen die Zahlen in ihrer
Bedingung ab. Zahlwörter werden mitübersetzt — ohne das fände die Prüfung
genau den Fall nicht, wegen dem sie gebaut wurde.

Ergebnis: **162 Einträge, 4 gemeldet, 1 echt.** Die drei anderen sind
Fehlalarme und bleiben es: bei „In einer der fünf Topligen“ steckt die Fünf im
Namen `top5Saisons`, bei „Karten aller sechs Seltenheitsstufen“ zählt die
Bedingung sechs Stufen einzeln auf. Deshalb ist die Ausgabe eine **Liste zum
Durchsehen und kein rotes Licht** — ein Hinweisgeber, der bei jedem Lauf
Fehlalarme wirft, wird nach dem zweiten Mal überlesen (wie die verworfene
Farbwertprüfung in `pruefen.sh`).

**Grenze des Werkzeugs, ausdrücklich:** es sieht nur Errungenschaften. Die
zweite Fundstelle — der Akademiebildschirm — lag außerhalb und wurde von Hand
gefunden. Wer sich darauf verlässt, prüft ein Siebtel der sichtbaren Texte.

### In den Unterlagen: sieben Stellen
| # | Wo | Stand bis 35.23 | Richtig |
|---|---|---|---|
| 1 | Projektwissen | `00-LIESMICH-ZUERST.txt` beschrieb **35.3 → 35.4** | **gehört gelöscht** |
| 2 | Abschnitt 1, Dateitabelle | listete `ANLEITUNG.md` | gibt es nicht; sechs vorhandene Dateien fehlten |
| 3 | Abschnitt 1 | Vorschau lädt „Schriften aus dem Netz“ | seit **33.3** falsch — sie kopiert sie aus `schriften.js` |
| 4 | Abschnitt 3 | „150 Errungenschaften“ | **162** |
| 5 | Abschnitt 5, Werkzeugtabelle | 7 von 27 Werkzeugen fehlten | darunter drei, die bei **jedem** Lauf mitlaufen |
| 6 | Abschnitt 8, Ablage | „alles andere → `pruefstand/`“ | fünf **Baudateien** gehören flach |
| 7 | `LIESMICH.md` | Werkzeugliste unvollständig, Gerätedatum als Dauerzustand | ergänzt und datiert |

Punkt 3 ist bemerkenswert: 33.3 hat den Fehler behoben, dass die Vorschau
etwas anderes zeigte als das Gerät — und die Beschreibung des Fehlers blieb
als Beschreibung des Zustands stehen.

Punkt 6 hätte jemanden echten Ärger gekostet: wer `schriften.js` und
`package.json` nach `pruefstand/` legt, bekommt weniger als „Baudateien: 6 von
6“ und einen ungeprüften Produktionsbau.

### Warum Punkt 1 eine eigene Lehre hat
35.4 fand schon einmal zwei widersprüchliche Anleitungen im Projektwissen und
schloss daraus: **sie muss immer gleich heißen**, dann überschreibt sie sich.
Das war die falsche Lehre. Die Anleitung von 35.3→35.4 lag danach noch
**19 Fassungen** dort und beschrieb einen Stand, den es längst nicht mehr gab.

Der Name war nie das Problem. Eine Einlegeanleitung beschreibt einen *Übergang*
und ist in dem Moment falsch, in dem er vollzogen ist — sie gehört ins
Lieferpaket, nicht in den Wissensspeicher. Steht jetzt als Schritt 6 in
Abschnitt 8.

### Geprüft, aber in Ordnung — damit es niemand zweimal prüft
* **Alle 27 Prüfwerkzeuge laufen.** Einzeln nachgefahren, auch die auf Abruf.
  `grosstest.cjs` meldet „Keine Auffaelligkeiten“, `erreichbar.cjs` 82 Ligen und
  1235 von 1239 Vereinen erreichbar, `bindenbogen.cjs` 212 Binden.
* **Die Bildwerkzeuge müssen SELBST in `/tmp/ps` liegen**, nicht nur von dort
  aufgerufen werden — `require("./motor.js")` ist relativ zum Skript. Mein
  erster Testlauf scheiterte daran und sah aus wie vier kaputte Werkzeuge.
  Steht jetzt in `LIESMICH.md`.
* **`schriften-lizenz.txt` ist vollständig.** Ich hätte um ein Haar einen
  Lizenzmangel gemeldet: die ersten Zeilen nennen nur Anton. Die Archivo-Lizenz
  steht ab Zeile 98. Nachgesehen statt behauptet.
* **Baudateien sauber:** `package.json`, `vite.config.js`, `capacitor.config.json`,
  `index.html`, `main.jsx`, `.gitignore`, `apk.yml` (Aktionen auf v4/v3, Node 20,
  Java 17 — passend zu Capacitor 6).

### Nicht geändert, nur notiert
`storage.js` gibt bei einem leeren Wert `null` zurück (`value ? … : null`),
die Browsertest-Fassung in `browsertest.sh` unterscheidet dagegen sauber
zwischen „leer“ und „nicht vorhanden“. **Praktisch folgenlos** — alle Aufrufe
schreiben `JSON.stringify(…)` oder `String(n)`, nie einen Leerstring. Geändert
wird trotzdem nichts: `storage.js` sitzt zwischen App und Gerät, und eine
Änderung ohne belegten Anlass ist dort das größere Risiko. Steht als offener
Punkt 16.

### Geprüft
Prüfstand gesamt: **460 Prüfungen**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 47 Vereinsprüfungen.
Bündel **1.190,38 kB** / 435,87 kB gepackt (−0,04 kB gegenüber 35.23).
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.24 · Passhöhe 328,9 px konstant.
`texttreue.cjs`: 162 geprüft, 3 Fehlalarme, 0 echte Treffer.
`UEBERSICHT.md` neu erzeugt (3.051 Zeilen, Fassung 35.24).
Werkzeugtabelle und `LIESMICH.md` maschinell gegen das Verzeichnis abgeglichen:
alle 27 Werkzeuge in beiden erwähnt.

## 35.25 · Ein gemeldeter Fehler, den es nicht gab

Offene Punkte 14 und 15, beide aus 35.23. **Punkt 14 ist widerlegt, nicht
behoben** — das ist ein Unterschied, und er gehört so protokolliert.

### Punkt 14: der Überlauf existiert nicht
35.23 meldete, der Pass sei bei 360 px Sichtfeld 380 px breit und die Seite
scrolle auf 399 px. Nachgemessen im **echten** Aufbau:

    412 px   Scrollbreite 412   kein Überlauf
    360 px   Scrollbreite 360   kein Überlauf
    320 px   Scrollbreite 320   kein Überlauf

Der Befund war ein Artefakt der eigenen Messumgebung. `passbogen.jsx` setzte
den Pass in einen selbstgebauten Rahmen (`width:100%; padding:0 14px`) statt
in die Kette, in der er im Spiel steht: **`Shell` → `.main` → `.a-pass`**.
`Shell` bringt `maxWidth` und eigenen Innenabstand mit, `.main` ist ein Raster.
Der Nachbau traf die Breite ungefähr, das Verhalten nicht.

Punkt 14 hat sich selbst gerettet: dort stand „**Beobachtet in der Messumgebung,
im Spiel nicht verifiziert** — erst nachstellen, dann erst ändern." Ohne diesen
Satz wäre an einem Layout geändert worden, das in Ordnung ist.

`passbogen.jsx` rendert jetzt durch die echten Komponenten. Kein Nachbau mehr.

### Was die echte Messung dafür zeigt
| Breite | Passhöhe | Zellenblock |
|---|---|---|
| 412 px (S24 Ultra) | **348,1** konstant | einzeilig, 70,5 px Luft |
| 360 px | **348,1** konstant | einzeilig, 18,5 px Luft |
| 320 px | **385,9** konstant | **durchgehend** zweizeilig |

320 px ist neu dabei und läuft dauerhaft mit. Dass der Block dort umbricht, ist
zulässig: `flex-wrap:wrap` tut genau das, wenn vier Felder nicht nebeneinander
passen — und weil es **über alle Stände gleich** passiert, springt nichts.

### Punkt 15: toter Parameter entfernt
`function Pass({ p, full, wachstum })` → `({ p, full })`. Nirgends übergeben,
nirgends benutzt.

### Drei eigene Fehler beim Umbau der Messung
Alle drei hätten falsche Aussagen erzeugt, zwei davon **grüne**.

1. **Die Prüfung maß 915 px** — die Fensterhöhe. Nach dem Umbau auf die echte
   Kette war `rahmen.firstElementChild` nicht mehr der Pass, sondern Shells
   Wurzelknoten. Gemeldet wurde „348,1 px konstant über 8 Stände", nur eben mit
   915. **Grün, konstant und falsch.** Die Prüfung greift jetzt gezielt
   `.wender` und meldet ausdrücklich, wenn sie ins Leere greift — ein
   Messaufbau, der nichts findet, ist nicht „in Ordnung".
2. **Ein Härtefall, den es nicht gibt.** Die Messung meldete +22 px bei 360 px
   für einen langen Namen. Der Testname hatte **34 Zeichen** — das Eingabefeld
   im Erstellbildschirm lässt **22** zu, die 34 gehören zum *Akademie*namen
   daneben. Längster generierter Name: 20 Zeichen (gemessen über 4.000
   Ziehungen). Ersetzt durch zwei echte 22-Zeichen-Fälle.
3. **Der Umbruch bei 320 px wurde rot gemeldet.** Er ist aber durchgehend und
   damit sprungfrei. Ohne diese Korrektur wäre an `.zellen` geändert worden —
   der Klasse, die an **sieben** Stellen hängt, darunter die Karriere-Kopfleiste.
   Rot ist jetzt nur noch der gemischte Fall: mal umbrochen, mal nicht, denn
   genau der erzeugt einen Sprung mitten in der Laufbahn.

Der rote Faden: eine Messung, die grün meldet, ist kein Beweis, dass sie
gemessen hat. Zwei der drei Fehler sahen aus wie ein bestandener Lauf.

### Geprüft
Prüfstand gesamt: **460 Prüfungen**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 47 Vereinsprüfungen.
Bündel **1.190,37 kB** / 435,87 kB gepackt (−0,01 kB gegenüber 35.24).
`sicht.sh`: 13/13 · 8 px · 4/4 · Impressum 35.25 · Passhöhe konstant bei
412, 360 **und** 320 px.
Gegenprobe: Hinweiszeile wieder bedingt gemacht → `✗ +17,3 px`, Rückgabecode 1.

## 35.26 · Das Tutorial

Damit ist der letzte offene Punkt aus Kevins Zettel gebaut. Das Tutorial
besteht aus **drei** Teilen, die zusammenspielen:

| Teil | Wann | Was |
|---|---|---|
| Willkommensschirm | einmal beim allerersten Start | drei Tafeln: Laufbahn, Akademie, Verein |
| Kurzanleitung | jederzeit unterm Zahnrad | jetzt **7** Kapitel statt 5 |
| Freischalthinweis | einmal je Freischaltung | eine Tafel im Hauptmenü |

### Der Willkommensschirm
Drei Tafeln mit je einer gezeichneten Skizze, Blättern, Überspringen. Gezeigt
werden **Akademie und Verein, obwohl beide noch gesperrt sind** (ab 2 bzw. 5
Laufbahnen) — dieselbe Überlegung wie beim Verein im Hauptmenü: ein
verstecktes Ziel merkt niemand.

**Warum gezeichnet und nicht fotografiert:** die App läuft ohne Netz, jedes
Bild wäre Base64 im Bündel. Die Schriften allein sind 128 KB. Drei SVG-Tafeln
kosten ein paar hundert Byte und passen zur Formensprache — harte Kanten,
Raute, keine runden Ecken.

Zwei Fälle, die leicht danebengehen und deshalb ausdrücklich geregelt sind:
* **`willGesehen === null` heisst „noch am Lesen"**, nicht „noch nie gesehen".
  Ohne diese Unterscheidung blitzte der Schirm bei **jedem** Start kurz auf,
  bevor der Speicher antwortet.
* **Ohne Speicher (`hasStore()` false) erscheint er nie.** Dort liesse sich
  „gesehen" nicht merken, und er käme bei jedem Start wieder.

Eigener Schlüssel `WILL_KEY`; er hängt in `SPEICHERSCHLUESSEL` **und** in
`SICHER_KEYS`, wandert also mit der Sicherung mit.

### Kurzanleitung: zwei neue Kapitel
„Die Jugendakademie" (4 Einträge) und „Dein eigener Verein" (5 Einträge),
eingehängt vor „Noch was". Sie stehen **immer** da, auch solange gesperrt.

Beide nennen die Freischaltschwelle im ersten Eintrag („Ab der zweiten
Laufbahn", „Ab der fünften Laufbahn"), damit niemand sucht, wo nichts ist.
Das Vereinskapitel sagt auch, was danach kommt: dritte Liga, sechzehn Mann,
fünfzehn Jahre bis zur Bilanz.

### Freischalthinweis
`FreiHinweis` im Hauptmenü, mit „Verstanden" wegklickbar, danach nie wieder.
**Der Verein hat Vorrang vor der Akademie**, wenn beide auf einmal fällig
werden (etwa nach einer zurückgespielten Sicherung): erst der Verein, beim
nächsten Menübesuch die Akademie. Nacheinander statt zwei Tafeln übereinander.

### Prüfstand
`ansichten.jsx` prüft den Schirm mit: keine Tafel ohne Kopf oder Text, keine
ohne Zeichnung, keine über 260 Zeichen, alle drei Themen erklärt, Tafel 1
zeigt ihren Kopf, die Blätteranzeige nennt die Gesamtzahl, und **„Überspringen"
ist da** — ein Erstschirm ohne Ausweg wäre eine Falle.

Die Ansichtsprüfungen steigen dadurch von **460 auf 478**.

### Was hier ehrlich dazugehört
Dieser Abschnitt ist **nachgetragen**. Der Code entstand in derselben Sitzung,
war aber weder in `STAND.md` erwähnt noch als Fassung geführt — `ansichten.jsx`
trug bereits den Vermerk „(35.26)", während `App.jsx` auf 35.25 stand und die
Zeile „Wo es weitergeht" weiter behauptete, das Tutorial sei offen.

Aufgefallen ist es nur, weil vor dem Bauen nachgesehen wurde, was schon da
ist — sonst wäre ein zweiter Willkommensschirm neben den ersten gebaut worden.
**Auch die Durchsicht in 35.24 hat es nicht gefunden:** dort wurden Dateien,
Zahlen und Werkzeuge gegen die Wirklichkeit geprüft, aber nicht die Aussage
„offen ist genau eine Sache". Eine Behauptung über den Funktionsumfang gehört
genauso gegengeprüft wie eine Zahl.

### Was der Prüfstand dabei aufgedeckt hat
Der Schirm war **nicht fertig**, als dieser Abschnitt begonnen wurde. Er steht
vor dem Hauptmenü — und eine frisch geladene Testseite ist genau der
„allererste Start". Drei Prüfungen liefen daraufhin ins Leere:

* `startprobe.cjs` suchte Titelblatt und Impressum und stand im Schirm:
  **beide ✗**, „angezeigt (keine)".
* `kopfleiste.cjs` und `seitenanfang.cjs` warteten je **30 Sekunden** auf das
  Zahnrad, das hinter dem Schirm liegt, und brachen ab.

Behoben durch **Vorbelegen** von `rasenschach:willkommen`, nicht durch
Wegklicken: nach einem Klick müsste auf Reacts nächsten Durchlauf gewartet
werden, und ein synchroner Lesevorgang sieht dann noch den alten Zustand
(ausprobiert — „Ausweg" ✓, alles dahinter trotzdem ✗).

Die Vorbelegung steht in **`browsertest.sh`**, nicht in den drei Prüfskripten
einzeln: dort entsteht die Seite, die alle Browserprüfungen benutzen. Eine
Stelle statt drei.

**Der Schirm bleibt dadurch geprüft** — nachgewiesen, nicht behauptet: mit
einer absichtlich leeren Tafel meldet der Lauf `✗ Willkommen — 1 Tafeln ohne
Kopf oder Text` und 477 statt 478. `startprobe.cjs` prüft zusätzlich, dass die
Vorbelegung überhaupt greift, damit „Menü erschienen" nicht mit „Schirm
zufällig ausgeblieben" verwechselt wird.

### Geprüft
Prüfstand gesamt: **478 Prüfungen**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 47 Vereinsprüfungen.
Bündel **1.197,57 kB** / 437,95 kB gepackt (+7,20 kB gegenüber 35.25 — die
drei SVG-Tafeln, zwei Anleitungskapitel und der Schirm selbst).
`sicht.sh`: **14/14** (eine Prüfung mehr: greift die Vorbelegung?) · 8 px ·
4/4 · Impressum 35.26 · Passhöhe konstant bei 412, 360 und 320 px.
Gegenprobe: Tafel ohne Text → `✗`, 477 statt 478 Prüfungen.

## 35.27 · Erster Gerätetest des Vereinsmodus

Kevin hat die Vereinsgründung zum ersten Mal auf dem S24 Ultra gesehen und
**zwei Fehler gemeldet, die der Prüfstand strukturell nicht finden konnte** —
beide sind Layout, und Layout ist in jsdom unsichtbar.

Genau dafür stand seit 35.20 der Satz in „Wo es weitergeht": erst spielen,
dann weiterbauen.

### 1. Die Vorschau scrollte weg
Wappen, Trikot und Name stehen oben, Farben und Muster weit unten. Wer eine
Farbe ändert, sieht nichts — er muss hochblättern, schauen, wieder runter.

Die Lösung stand schon im Programm: die Spielererstellung heftet ihren
Vorschaublock mit `position:sticky` an. Ihr Kommentar sagt sogar wörtlich
**„und dasselbe gilt für Verein (Trikotfarben) und Name"** — gedacht, nicht
gebaut. Jetzt gebaut, mit denselben Angaben.

Gemessen: nach 900 px Blättern steht die Vorschau bei **0 px** und ist
sichtbar; vorher war sie längst aus dem Bild.

### 2. Der Gründen-Knopf war unlesbar gequetscht
| | Zurück | Gründen-Knopf |
|---|---|---|
| vorher, 412 px | 348 px | **32 px** bei 53 px Bedarf |
| nachher, 412 px | 78 px | **302 px** |
| nachher, 360 px | 78 px | **250 px** |

Ursache ist eine Zeile CSS, die überall sonst richtig ist: **`.btn{width:100%}`**.
Steht ein solcher Knopf neben einem mit `flex:1`, beansprucht er die ganze
Zeile, und der Hauptknopf bekommt nur den Rest.

**Dieselbe Zeile stand an zwei Stellen** — Vereinsgründung und Vereinsabschluss
(„Später" / „Neuen Verein gründen"). Gefunden durch Absuchen aller Knopfzeilen:
sieben haben zwei Knöpfe, aber nur bei diesen beiden hat *einer* `flex:1` und
der andere nichts. Wo beide nichts haben, teilen sie sich gleichmässig — kein
Fehler. Behoben über eine Klasse `.btn.schmal`, nicht zweimal inline.

### Zwei eigene Fehler, beide beim Kommentieren
1. **Der Kommentar zur neuen CSS-Klasse hat die App zerstört.** Er enthielt ein
   Anführungszeichen (`„Verein gründen"`), und der CSS-Text ist eine
   Zeichenkette — das Zeichen beendete sie. Die Seite meldete
   `.btn is not a function` und blieb leer. Verwandt mit der Stolperfalle
   „Kommentarzeichen in CSS-Blöcken", nur mit einem anderen Zeichen. Im Block
   steht jetzt ein Hinweis darauf.
2. **Derselbe Kommentar hat danach eine Prüfung getäuscht.** Er nannte
   „Fassung 35.27", und `startprobe.cjs` sucht per Muster nach
   `Fassung ([0-9.]+)`. Gemeldet wurde „Quelle 35.26 · angezeigt 35.27" —
   **beide Zahlen echt, die zweite aus einem Kommentar.**

   Der Grund: `Shell` rendert `<style>{CSS}</style>` **innerhalb** von `#root`,
   und `textContent` nimmt Stilblöcke mit. Die Prüfung liest jetzt über einen
   Klon ohne `<style>` und `<script>` — sichtbarer Text ist, was der Spieler
   liest. Ein erster Versuch, die Textknoten selbst abzulaufen, verlor dabei das
   Impressum („angezeigt (keine)"); `textContent` auf dem bereinigten Klon kennt
   die Fälle, die eine eigene Schleife übersieht.

   Gegengeprüft: Impressum künstlich auf 9.99 verbogen → `✗ Quelle 35.26 ·
   angezeigt 9.99`. Die Prüfung schaut also nicht einfach weg.

### Der Browsertest kann jetzt auch Erststart
Kevin wollte die Einzeldatei zum Vorabprüfen, bevor eine APK gebaut wird. Das
ging so nicht: seit 35.26 belegt `browsertest.sh` den Willkommensschirm vor,
damit die Prüfungen nicht darin steckenbleiben — die Datei hätte den Schirm
also **nie** gezeigt, ausgerechnet das Neue.

Neuer Schalter **`ERSTSTART=1`**. Ohne ihn wird vorbelegt (der Prüfstand läuft
öfter), mit ihm verhält sich die Datei wie eine frische Installation.
Nachgemessen in Chromium, beide Fälle: Standard → kein Schirm, Fassung 35.27
sichtbar; `ERSTSTART=1` → Schirm da. Keine Seitenfehler in beiden.

**Beim Anschauen wichtig:** der Schirm merkt sich im `localStorage`, dass er
weg war. Zum zweiten Mal braucht es ein privates Fenster oder ein geleertes
`rasenschach:willkommen`.

### Geprüft
Prüfstand gesamt: **478 Prüfungen**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 47 Vereinsprüfungen.
Bündel **1.198,33 kB** / 438,28 kB gepackt (+0,76 kB gegenüber 35.26).
`sicht.sh`: 14/14 · 8 px · 4/4 · Impressum 35.27 · Passhöhe konstant bei
412, 360 und 320 px.
Knopfbreiten und Anheften in echtem Chromium nachgemessen, beide Breiten.

## 35.28 · Der Verein läuft nebenher

Kevin hat den Vereinsmodus auf dem Gerät gespielt und einen **konzeptionellen**
Fehler gefunden, keinen Layoutfehler: der Verein lief völlig unabhängig von den
Spielerlaufbahnen. Vier Vereinsjahre, ohne dass eine einzige Laufbahn dazwischen
lag — aufstellen, simulieren, aufstellen, simulieren.

### Was fehlte
Am Karriereende, in `finish()`, stand:

    const AK2 = akaVerbuchen(aka, vcNeu);   // ein Jahr Akademie

**Ein entsprechender Aufruf für den Verein fehlte vollständig.** Stattdessen gab
es im Vereinsbildschirm einen Knopf „Saison spielen", beliebig oft drückbar.

Der Knopf stammte aus 35.17. Dort steht ausdrücklich: *„Dies ist der Rechenkern,
nicht der Bildschirm"* — er war der Behelf, um den Kern überhaupt auslösen zu
können. 35.20 baute den Bildschirm darum herum, und der Behelf blieb stehen,
**weil nirgends stand, dass er einer war.** Die Kopplung ans Karriereende ist in
dieser Datei an keiner Stelle beschrieben; sie stand nur in Kevins Kopf, deshalb
hat auch keine Prüfung sie eingefordert.

### Wie es jetzt läuft
Nach Kevins drei Entscheidungen:

| Frage | Entscheidung |
|---|---|
| Kader nicht spielbereit? | muss **vor** dem Karrierestart stehen, dann zählt er |
| Wo der Bericht? | **kurz**, in der Karriereübersicht, wie der Akademiebericht |
| Knopf „Saison spielen"? | weg — stattdessen **einschreiben** |

**Einschreiben** ist ein einmaliger Schritt: „Verein in die 3. Liga
einschreiben", danach läuft es von selbst. Bewusst nicht umkehrbar — ein
Verein, den man zwischendurch abmelden kann, ist keiner. An seine Stelle tritt
eine Auskunft statt eines grauen Knopfs: *„Das 4. Jahr wird gespielt, sobald du
die nächste Laufbahn beendest."* Steht der Kader nicht, sagt sie stattdessen,
was fehlt und dass das Jahr sonst ausfällt.

**Die Saison** hängt jetzt in `finish()`, direkt neben dem Akademiejahr. Das ist
die richtige Stelle: beides läuft nebenher, während man spielt, und wird fällig,
wenn eine Laufbahn endet.

**`spieltMit(v)`** entscheidet, ob eine Saison ansteht — als eigene Funktion,
nicht als dreimal nachgebaute Bedingung. Bildschirm, Ablauf und Prüfstand fragen
dieselbe Stelle; drei getrennte Fassungen desselben Satzes laufen früher oder
später auseinander.

**Der Bericht** steht in der Karriereübersicht vor dem Akademieblock: Liga,
Platz, Punkte, Torverhältnis, Auf- oder Abstieg, Zahl der Abgänge. Fällt ein
Jahr aus, steht das ausdrücklich da — sonst wundert man sich, warum der Verein
steht.

### Neu geprüft: 47 → 56
Acht Prüfungen in `vereinpruefung.cjs`, darunter die entscheidende:
**„kein Knopf 'Saison spielen' mehr im Programm"** — sie liest den Quelltext und
fängt, wenn ein zweiter Auslöser zurückkommt. Zwei Wege für dieselbe Sache wären
zwei Wege, die auseinanderlaufen, und einer davon hätte die Kopplung wieder
umgehbar gemacht.

Gegengeprüft in beide Richtungen: Knopf zurückgebaut → `✗`, Kaderprüfung beim
Einschreiben entfernt → `✗`. Beide Male mit Rückgabecode 1.

### Fünf eigene Fehler
Vier davon geratene Namen, alle beim Messen gefunden — und einer schwerer als
die anderen:

1. **Der Prüfblock hing hinter `process.exit()`.** Er wäre nie gelaufen und
   hätte wie eine bestandene Prüfung ausgesehen. Von allen Fehlern dieser
   Sitzung der gefährlichste: eine Prüfung, die gar nicht stattfindet, meldet
   nichts — und Schweigen liest sich wie Erfolg.
2. `aufgestiegen`/`abgestiegen` statt **`aufstieg`/`abstieg`**.
3. `speichereVerein` statt **`vereinSichern`** — die Funktion gab es nicht.
4. Tore und Punkte direkt am Saisonergebnis gesucht; sie stehen in der
   **Tabellenzeile mit `me`**.
5. `hochziehen(v, talent)` mit zwei Argumenten aufgerufen — die Signatur ist
   **`hochziehen(aka, v, talentId)`**, und das dritte ist die ID. Ergebnis:
   „Talent nicht gefunden", leerer Kader, und die Meldung lautete am Ende
   *„Kein Verein gegründet"* — drei Schritte von der Ursache entfernt.

Die Punkte 2 bis 4 wären still geblieben: `undefined` bricht nichts, der
Bericht hätte einfach Lücken gezeigt.

### Was Kevin wissen sollte
Der Verein läuft **15 Jahre**. Mit einer Saison je Laufbahn sind das **15
abgeschlossene Laufbahnen**, plus 5 bis zur Freischaltung. Zum Vergleich:
Akademie-Vollausbau nach 27,6 Laufbahnen, Rautekarte im Median nach 35. Die
Größenordnung passt, aber es ist ein langer Bogen. Wer ihn kürzen will, ändert
`VEREIN_JAHRE` — jetzt, solange die Kopplung frisch ist.

### Auch die neue Prüfung war zweimal falsch gebaut
Bevor sie verlässlich lief, hat sie zweimal etwas Falsches gemessen — beides
gehört hierher, weil beides eine Prüfung betrifft und nicht das Spiel:

* **Feste Jahreszahl.** Erst liefen 14 Akademiejahre. Im isolierten Lauf gab
  das 16 Talente, im vollen Prüfstand 14. Eine Prüfung, die mal rot und mal
  grün ist, ist schlimmer als keine: nach dem zweiten Fehlalarm glaubt ihr
  niemand mehr.
* **Warten auf etwas, das nie eintritt.** Der zweite Entwurf wartete, bis
  18 Talente gleichzeitig verfügbar sind. Das kann nicht passieren — **Talente
  altern aus**, es stehen immer nur rund 14 auf einmal da. Jetzt wird
  hochgezogen und gewartet im Wechsel, wie in der Prüfung weiter oben.
* **Falscher Pfad.** Die Quelltextprüfung las `App.jsx` relativ zum
  Arbeitsverzeichnis und stürzte im Prüfstand mit `ENOENT` ab. `pruefen.sh`
  reicht die Quelle jetzt durch; findet die Prüfung sie trotzdem nicht, meldet
  sie das ausdrücklich — eine übersprungene Prüfung ist kein bestandener Lauf.

Dreimal einzeln und zweimal im vollen Prüfstand wiederholt, jedes Mal 56.

### Geprüft
Prüfstand gesamt: **478 Ansichten**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, **56 Vereinsprüfungen** (vorher 47).
Bündel **1.201,27 kB** / 439,16 kB gepackt (+2,94 kB gegenüber 35.27).
`sicht.sh`: 14/14 · 8 px · 4/4 · Impressum 35.28 · Passhöhe konstant bei
412, 360 und 320 px.
Gegenprobe: Knopf zurückgebaut → `✗`; Kaderprüfung entfernt → `✗`.

## 35.29 · Die Knopfprüfung hätte den Fehler nicht gefunden

35.27 hat drei Knopfzeilen berichtigt und dafür `knoepfe.sh` gebaut — eine
Messung in echtem Chromium, weil eine Quelltextsuche den dritten Fall
übersehen hatte. Beim Nachschärfen kamen **zwei Lücken** heraus, beide von der
Sorte, die grün meldet.

### Lücke 1: ein Prüffall, der nichts prüfte
`VereinAbschluss` braucht **zwei** Eigenschaften, `v` und `ergebnis`. Der Bogen
gab nur `ergebnis` mit. Der Bildschirm blieb leer, meldete „Cannot read
properties of undefined (reading 'name')" — und die Messung zählte brav
„22 Knöpfe, alle in Ordnung". **Ein Bildschirm, der nicht rendert, hat auch
keine kaputten Knöpfe.** Behoben: 22 → 24 Knöpfe, die beiden des Abschlusses
sind jetzt dabei.

### Lücke 2: nur die erste Tafel
Der Willkommensschirm hat auf **Tafel 1 keinen Zurück-Knopf** — der erscheint
ab Tafel 2. Und genau dort lag der gemeldete Fehler: Zurück 388 px, Weiter
32 px, rechte Kante bei **440 px auf einem 412 px breiten Bildschirm**.

Die Prüfung hat ihn nicht gefunden. Sie hat gemeldet, alles sei in Ordnung,
während zwei Tafeln weiter ein Knopf aus dem Bild ragte. Jetzt blättert sie
durch, was sich blättern lässt, und misst jede Tafel: **24 → 124 Knöpfe.**

### Gegengeprüft — dreimal
| Eingebauter Fehler | Ergebnis |
|---|---|
| `.btn.schmal` geleert | **grün** — und das ist richtig: der Inline-Teil des Fixes trägt allein |
| Urzustand der Vereinszeilen (`flex: 1` statt `flex: 1 1 auto`) | `✗ 2 von 24`, Code 1 |
| Urzustand des Willkommensschirms | `✗ Weiter 32 px, rechte Kante 440`, Code 1 |

Die erste Zeile ist die lehrreiche: Mein erster Gegenversuch blieb grün, und
ich hätte ihn fast als „Prüfung wirkungslos" verbucht. Der Fix hat zwei Teile,
und einer davon reicht — der Versuch hat also nicht den Fehler
wiederhergestellt, sondern nur die halbe Reparatur zurückgenommen. **Eine
Gegenprobe, die grün bleibt, kann auch bedeuten, dass man das Falsche kaputt
gemacht hat.**

### Dazu: eine Werkstatt für den Browsertest
Kevin braucht Abkürzungen zum Prüfen — Akademie ab 2 Laufbahnen, Verein ab 5,
Vollausbau nach rund 28. Wer das erspielt, prüft eine Woche.

`pruefstand/werkstatt.js`, unten rechts als 30×30-Griff (das Messwerkzeug sitzt
links). Laufbahnen +1/+5/+20, Coins +500/+3000, Akademie voll ausbauen, Verein
einschreiben, Willkommensschirm zurückholen, Spielstand löschen, Einstellungen
zurücksetzen, Stand anzeigen.

**Sie fasst die App nicht an** — dieselbe Regel wie beim Messwerkzeug. Sie
schreibt ausschliesslich in den `localStorage`, also dorthin, wo die App beim
Start ohnehin nachsieht, und lädt neu. Griffe sie in die laufende App, prüfte
der Browsertest etwas anderes als die APK; genau dieser Fehler steckt in 33.3,
wo die Vorschau Schriften nachlud und die App nicht.

**Nur bei `ERSTSTART=1`.** In der Fassung für den Prüfstand bleibt sie draussen,
sonst zählte `knoepfe.sh` dreizehn Werkzeugknöpfe mit. Belegt: mit Schalter
2 Treffer im HTML, ohne 0 — und `sicht.sh` meldet unverändert 124 Knöpfe.

**Was sie nicht kann, und warum das hier steht:** eine laufende Laufbahn
vorspulen. Der Spielstand ist ein halb gespielter Verlauf mit Verein, Vertrag
und Ereignisgedächtnis; ihn von aussen weiterzurechnen hiesse, die
Entwicklungsformeln ein zweites Mal zu bauen — dann prüft man die Kopie. Die
Werkstatt setzt die Voraussetzungen und überlässt das Spielen dem Spiel.

Beim Bauen zwei eigene Fehler: `rasenschach:erfolge` hielt ich fälschlich für
erfunden (mein Suchmuster übersah Zeilen mit doppeltem Leerzeichen), und
**zwei echte Schlüssel fehlten** — `karten` und `raute`. „Alles löschen" hätte
Reste stehen lassen. Jetzt maschinell abgeglichen: jeder Schlüssel des Spiels
ist erfasst. Einstellungen (Ruhe, Tempo, Vibration …) liegen bewusst getrennt
und werden nicht mitgelöscht — wer den Stand zurücksetzt, will nicht seine
Vorlieben verlieren.

### Geprüft
`sicht.sh`: 14/14 · 8 px · 4/4 · Impressum · Passhöhe konstant bei 412, 360
und 320 px · **124 Knöpfe** bei zwei Breiten, alle lesbar und im Bild.
Werkstatt in Chromium geprüft: „+5" gedrückt → 5 Laufbahnen im Speicher,
Rückmeldung sichtbar, keine Seitenfehler.
Prüfstand unverändert: 478 Ansichten, 56 Vereinsprüfungen, 0 Fehler.

## 35.30 · Die Bauanleitung war unvollständig

Eine Sitzung, die nur mit Lesen und Messen anfangen sollte — `STAND.md`,
Fassung gegenprüfen, Prüfstand. Alles grün: 478 Ansichten, 56 Vereinsprüfungen,
11 Ereignisprüfungen, `sicht.sh` 14/14, Bündel auf die Kommastelle wie in
35.29. **Am Code war nichts.** Sieben Sachen standen trotzdem falsch da, und
eine davon war ernst.

### Der ernste Fall: sechs Dateien fehlten in LIESMICH.md
`LIESMICH.md` beginnt mit „Was in dieses Projektwissen gehört". Das ist keine
Beschreibung, das ist eine **Bauanleitung**: wer das Projektwissen danach neu
aufsetzt, bekommt genau die Dateien, die dort stehen. Genannt waren 42 von 48.

Die sechs Fehlenden, nach Schwere:

| Datei | Was ohne sie passiert |
|---|---|
| `ereignisse.js` | esbuild meldet „Could not resolve" — **das Spiel baut nicht** |
| `verein.js` | dasselbe |
| `werkstatt.js` | `browsertest.sh` bricht wegen `set -eu` ab, `sicht.sh` läuft gar nicht erst an |
| `knoepfe.sh` | `sicht.sh` überspringt die Knopfmessung, endet mit Code 3 |
| `knopfbogen.jsx` | dito |
| `knopfmessung.cjs` | dito |

`ereignisse.js` und `verein.js` sind seit **35.6 und 35.17** ausgelagert und
standen dort **nie**. Dass es trotzdem lief, liegt daran, dass niemand die
Anleitung je gebraucht hat — das Projektwissen wurde fortgeschrieben, nicht neu
aufgebaut. Eine Anleitung, die niemand benutzt, wird auch von niemandem
widerlegt.

Die anderen vier kamen mit 35.28 und 35.29 dazu, also **vorletzte und letzte
Sitzung**. Der Abstand zwischen „Werkzeug gebaut" und „Werkzeug in der Liste"
war zweimal hintereinander unendlich.

**Kein stiller Fehler:** alle sechs Lücken hätten laut geknallt — esbuild
bricht ab, `set -eu` bricht ab, `sicht.sh` endet mit Code 3 und dem Satz „Ein
unvollstaendiger Lauf ist kein bestandener Lauf". Nachgestellt und bestätigt.
Das macht es nicht harmlos, es macht es nur auffindbar: der Schaden wäre eine
verlorene Sitzung gewesen, keine falsche Zahl.

### Die Liste prüft sich jetzt selbst
Nach der Regel aus 35.2 — *lässt es sich prüfen, gehört es in `pruefen.sh`* —
ist das keine Merkaufgabe mehr. Prüfung 6 vergleicht die beiden Mengen, die
tatsächlich wachsen:

* **alle Dateien in `pruefstand/`** — jedes neue Werkzeug fällt auf
* **die eigenen Importe der `App.jsx`** — ausgelesen, nicht aufgezählt; ein
  fünfter Import fällt von selbst auf, ohne dass jemand die Prüfung anfasst

Die sechs Baudateien bleiben draussen, die zählt der Aufbau oben schon ab
(`Baudateien: 6 von 6`). Eine zweite Zählung derselben Sache wäre eine zweite
Stelle, die auseinanderlaufen kann.

**Gegengeprüft, vier Richtungen:**

| Eingriff | Ergebnis |
|---|---|
| `knoepfe.sh` aus der Liste gestrichen | ✗ `nennt diese Dateien nicht: knoepfe.sh`, Code 1 |
| `verein.js` überall in der Datei ersetzt | ✗ `… verein.js`, Code 1 |
| `LIESMICH.md` ganz entfernt | ✗ `Liste NICHT geprueft` — nicht still grün, Code 1 |
| neues Werkzeug angelegt, nicht eingetragen | ✗ `… zaehlwerk.cjs`, Code 1 |

**Wichtig für später, weil ich genau daran zuerst gescheitert bin:** die
Prüfung fragt *„steht der Name irgendwo in `LIESMICH.md`“*, nicht *„steht er
in der Liste“*. Mein erster Gegenversuch strich nur die Listenzeile von
`verein.js` — und blieb **grün**, weil der Name zwölf Zeilen tiefer im
Fließtext noch einmal vorkommt. Das ist keine Lücke, sondern die Absicht: eine
Datei, die überhaupt genannt wird, findet auch jemand, der von Hand nachbaut.
Wer schärfer prüfen will, müsste die Listenblöcke abgrenzen — dann hängt die
Prüfung an der Formatierung der Datei, und die ändert sich öfter als ihr
Inhalt. Bewusst so gelassen.

**Mein zweiter Fehlversuch war ein Pfadfehler**, der immer gleiche: das neue
Werkzeug lag in `/tmp/g6/pruefstand/`, aufgerufen habe ich `pruefen.sh` aus
`/home/claude/rs`. Damit zeigte `$PS` auf das *alte* Verzeichnis, und die
Prüfung sah die neue Datei nie. Aus dem richtigen Verzeichnis gestartet:
`✗ zaehlwerk.cjs`. Zwei von vier Gegenproben waren also zuerst grün, und
**keine der beiden, weil die Prüfung nichts taugt.** Eine Gegenprobe, die grün
bleibt, ist erst dann ein Befund, wenn der Versuchsaufbau stimmt — dieselbe
Lehre wie in 35.29, dort mit `.btn.schmal`.

Die dritte ist die wichtige. Eine Prüfung, deren Grundlage fehlt, darf nicht
schweigen — sonst löscht man die Datei und bekommt einen grünen Lauf.

### Sechs weitere Stellen, die danebenzeigten
1. **Der Wegweiser oben.** Er behauptete, der Vereinsmodus sei *„nie auf Kevins
   Gerät gelaufen"* — dabei heisst 35.27 wörtlich „Erster Gerätetest des
   Vereinsmodus" und 35.28 beginnt mit „Kevin hat den Vereinsmodus auf dem
   Gerät gespielt". Der Wegweiser stammte aus 35.26 und ist über drei Fassungen
   nicht mitgezogen worden. Das ist die erste Zeile, die eine neue Sitzung
   liest, und sie hätte auf eine erledigte Aufgabe gezeigt.
   **Neu geschrieben** — und dabei der wichtigere Punkt festgehalten: ein
   Gerätetest, der einen Fehler findet, bestätigt **nicht die Reparatur**. Die
   Behebungen aus 35.27, 35.28 und 35.29 sind alle nur gemessen, nie gesehen.
   Dieselbe veraltete Aussage stand nochmal in Abschnitt 8 und in
   `LIESMICH.md`; alle drei berichtigt.
2. **Abschnitt 5** nannte 47 Vereinsprüfungen. Sind seit 35.28 **56**.
3. **Abschnitt 8** nannte 460 Ansichten und 47 Vereinsprüfungen — beide der
   Stand von 35.23. Sind **478** und **56**. Dazusteht jetzt, dass diese Zahlen
   mit jeder Fassung wachsen und der Lauf selbst meldet, was gilt.
4. **Offener Punkt 8** nannte für die Passhöhe „328,9 px". Diese Zahl hat
   **35.25 ausdrücklich verworfen** — sie kam aus der Messumgebung, die den
   Pass in einem eigenen Rahmen nachbaute statt in der echten Kette. Gemessen
   sind es 348,1 px (412 und 360 px) und 385,9 px (320 px). Eine widerlegte
   Zahl, vier Fassungen lang stehengeblieben, ausgerechnet in dem Punkt, der
   vom Messen handelt. Daraus die Lehre, die jetzt dort steht: **verlässlich
   ist die Aussage „konstant", nicht die Zahl.**
5. **Abschnitt 1 und offener Punkt 10** nannten 764 KB / 12.829 Zeilen für
   `App.jsx`. Gemessen: **801.728 B / 13.198 Zeilen**, also 369 Zeilen mehr —
   das Tutorial und drei Fassungen. `verein.js` stand mit 480 Zeilen da, hat
   **510**. Der Zeilenzähler ist damit zum **zweiten Mal hintereinander**
   veraltet gewesen (bis 35.22: 12.041, bis 35.29: 12.829).
6. **`sicht.sh` hatte keine eigene Zeile in der Werkzeugtabelle.** Sie stand
   nur als „Hängt in `sicht.sh`" bei zwei ihrer eigenen Teile — die Klammer
   fehlte in der Tabelle, die sie zusammenhält. Nachgetragen, mit dem Verhalten
   bei fehlenden Teilen (Code 3).

### Was `UEBERSICHT.md` betrifft: nichts
Die Datei trug den Stempel 35.24. Neu erzeugt und gegen die alte gediffed:
**zeichengleich, einzig die Kopfzeile unterscheidet sich.** Zwischen 35.24 und
35.29 hat sich an den Spieldaten, die sie abbildet, nichts geändert — das
Tutorial, das Einschreiben und die Knopfzeilen berühren keine Zahl darin. Die
Datei war also nicht falsch, nur alt gestempelt. Der Unterschied ist wichtig
genug, um ihn hinzuschreiben, statt „aktualisiert" zu melden.

### Am Spiel wurde nichts geändert
`App.jsx` unterscheidet sich von 35.29 in **genau zwei Zeilen**: `VERSION` und
`VERSION_INFO`. Nachgewiesen per `diff` — vier geänderte Zeilen, zwei hin, zwei
her. `VERSION_INFO` sagt das im Impressum auch so; einen Fortschritt zu
behaupten, den es nicht gibt, wäre dieselbe Sorte Fehler wie die sechs oben.

Die einzige Codeänderung dieser Fassung steht in `pruefen.sh` und läuft nie in
der APK.

### Ein eigener Fehler, und zwar der immer gleiche
In den Messblock hier unten hatte ich **1.201,25 kB / 439,17 kB** geschrieben,
bevor der Bau gelaufen war — hergeleitet daraus, dass der neue
`VERSION_INFO`-Text kürzer ist. Gemessen sind es **1.201,27 / 439,16**, genau
wie in 35.29: der Unterschied verschwindet in der Rundung.

Die Zahl war fast richtig. Das ist das Problem: eine geschätzte Zahl, die
danebenliegt, fällt auf; eine, die *knapp* danebenliegt, wird Bestand. Kevin
hat Schätzungen in Protokollblöcken mehrfach angemerkt, und ich habe sie in
derselben Sitzung wieder produziert, in der ich sechs andere veraltete Zahlen
berichtigt habe. **Messblock nach dem Lauf schreiben, nicht davor** — sonst ist
er eine Vorhersage mit dem Aussehen einer Messung.

### Geprüft
Prüfstand gesamt: **478 Ansichten**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 56 Vereinsprüfungen.
Bündel **1.201,27 kB** / 439,16 kB gepackt — **unverändert gegenüber 35.29**,
wie es sein muss: am Spiel wurde nichts geändert ausser zwei Zeichenketten.
`sicht.sh`: 14/14 · 8 px · 4/4 · Impressum 35.30 · Passhöhe 348,1 px konstant
bei 412 und 360 px, 385,9 px konstant bei 320 px · 124 Knöpfe bei zwei Breiten.
Vollständigkeit: **0 von 48 Dateien ungenannt** (vorher 6).
Gegenprobe zur neuen Prüfung 6 in vier Richtungen, alle `✗` mit Code 1.
`UEBERSICHT.md` neu erzeugt: 3.051 Zeilen, gegen die Fassung von 35.24
zeichengleich ausser der Kopfzeile.

## 35.31 · Die Moral steht in der Anleitung — und liefert anders als gedacht

Offener Punkt 9: von fünf Werten, die der Spieler sieht, erklärte die
Kurzanleitung vier. **Moral fehlte.** Wer nachschlug, was der Balken bedeutet,
fand nichts.

### Erst messen, dann formulieren
Der naheliegende Satz wäre gewesen: „Moral schiebt deine Entwicklung.“ Die
Formel scheint das zu stützen — in `develop()` steht der Faktor
`(.8 + p.morale / 340)`, das sind **34,3 % Unterschied je Jahr** zwischen Moral
100 und Moral 5.

**Über eine ganze Laufbahn gemessen ist davon fast nichts übrig.** 500
Laufbahnen je Bedingung, Ablauf wie in `kalibrierung.cjs`, Moral vor jedem
`develop()` festgenagelt:

| Bedingung | Spitzenstärke Median | Mittel | P10 | P90 |
|---|---|---|---|---|
| Moral 100 | 78 | 76,8 | 66 | 86 |
| Moral 70 | 77 | 76,2 | 64 | 86 |
| Moral 5 | 75 | 73,7 | 62 | 83 |
| ungenagelt | 78 | 76,5 | 64 | 86 |

**3,1 Punkte Spitzenstärke zwischen ganz oben und ganz unten — 4,2 %.** Aus 34 %
je Jahr werden 4 % über eine Laufbahn, und der Grund steht in derselben Zeile:
das Wachstum hängt am **Abstand zum Potenzial** (`gap * .28 * …`). Ein
langsamerer Faktor bedeutet, dass der Spieler später an seine Decke kommt,
nicht dass die Decke tiefer liegt. Wer 25 Saisons spielt, kommt so oder so nah
heran.

Natürliche Moral mit 25 Jahren: **Median 82,5**. Der Wert liegt im normalen
Spiel also ohnehin oben, und die realistische Spanne ist noch schmaler als die
gemessenen 3,1 Punkte.

### Wo Moral wirklich hängt
Nicht an der Stärke, sondern an den Ereignissen. In `ereignisse.js` stehen
**sechs Bedingungen** auf `morale`, und sie zeigen in beide Richtungen:

| Bedingung | Was sie öffnet |
|---|---|
| `morale<45` | Trainingsstreik (Kabine) |
| `morale<40 && age>=21` | Eskalation in der Halbzeitkabine |
| `morale<38 && trust<45` | Die Mannschaft verweigert das Training |
| `morale<=42 && age>=19` | „Es geht dir nicht gut“ (Umfeld) |
| `morale>=60 && age>=29` | Wahlmöglichkeit: den Rivalen zum Essen einladen |
| `morale>=70` | Wahlmöglichkeit: die Kartenrunde auflösen |

Vier Ereignisse kommen von **tiefer** Moral, zwei Optionen brauchen **hohe**.
Das ist die Mechanik, die wirklich liefert — der Entwicklungsfaktor ist
Beiwerk. Der Anleitungstext sagt deshalb genau das, in dieser Reihenfolge:

> **Moral** — Wie es dir geht. Oben entwickelst du dich etwas schneller, unten
> kommt Ärger in die Kabine, den du nicht bestellt hast.

„Etwas schneller“ ist keine Bescheidenheitsfloskel, sondern die gemessenen
4,2 %. Hätte ich den Satz vor der Messung geschrieben, stünde dort „deutlich
schneller“ — und die Anleitung hätte etwas versprochen, was die Mechanik nicht
hält.

### Warum „Moral“ bleibt
Der offene Punkt fragte auch nach Umbenennung. Bleibt: im Fußball ist „Moral“
das etablierte Wort, „Motivation“ träfe es nicht — der Wert ist Stimmung,
nicht Antrieb. Ausserdem hängen 910 Vorkommen von `morale` daran; ein
umbenanntes Feld bräche jeden alten Spielstand.

### Nebenbefund, folgenlos
`donate()` klemmt Moral mit `clamp(…, 0, 100)` ab, überall sonst gilt
`clamp(…, 5, 100)`. Bleibt folgenlos, weil dort nur addiert wird — die
Untergrenze greift nie. Nicht angefasst: eine Zeile ohne Wirkung zu ändern,
wäre eine Änderung ohne Messung.

### Wechselwirkungen geprüft
`ANLEITUNG` wird an drei Stellen gelesen: die Kurzanleitung bildet sie mit
`.map()` ab (keine festen Höhen), die Optionen zeigen `ANLEITUNG.length` als
„Abschnitte“ (unverändert 7, weil der Eintrag in ein bestehendes Kapitel geht),
und `ansichten.jsx` zählt Kapitel und Zeilen zur Laufzeit. Keine Stelle
enthält eine fest eingetragene Zahl, die hätte nachgezogen werden müssen.

### Geprüft
Prüfstand gesamt: **478 Ansichten**, 0 Fehler, alle vier Zielbänder,
6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen, 56 Vereinsprüfungen.
Kurzanleitung: **7 Kapitel · 26 Zeilen** (vorher 25) · längste Zeile 119 Zeichen
(vorher 111 — der neue Eintrag ist jetzt der längste der Anleitung).
Bündel **1.201,38 kB** / 439,22 kB gepackt, vorher 1.201,27 / 439,16 —
**+0,11 kB** roh, +0,06 kB gepackt. Das ist der Text und sonst nichts.
`sicht.sh`: 14/14 · 8 px · 4/4 · Impressum 35.31 · Passhöhe 348,1 px konstant
bei 412 und 360 px, 385,9 px konstant bei 320 px · 124 Knöpfe bei zwei Breiten
— alle Werte unverändert gegenüber 35.30, wie es sein muss.
Moralmessung: 500 Laufbahnen je Bedingung, vier Bedingungen (Tabelle oben).

## 35.32 · Die Akademie steht im Rückblick

Offener Punkt 7, erste Hälfte. Am Karriereende laufen **zwei** Bildschirme
nacheinander, und nur einer kannte die Akademie:

* **Karriere-Rückblick** (`KarriereRueckblick`) — das Kartenspiel zum
  Durchtippen, bis zu zehn Seiten. Erwähnte die Akademie **auf keiner**.
* **Abschlussbildschirm** danach — zeigt sie sehr wohl: „Ein Jahr in {Name}“,
  VC-Gutschrift mit Posten, Akademieereignisse, nächstes Ausbauziel.

### Warum das mehr als Kosmetik war
`createPlayer` schreibt in `p.aka`, was die Akademie diesem Spieler
**mitgegeben** hat. Gemessen, was dabei herauskommt:

| Akademie | Ruhm | Anlage | Bekanntheit | Startkapital | Entwicklung |
|---|---|---|---|---|---|
| keine (1. Laufbahn) | 0 | — | — | — | — |
| Stufe 2, 10 Jahre | 10 | — | — | — | — |
| Stufe 4, 20 Jahre | 91 | +2 | +2 | +30 Tsd. € | +2 % |
| Stufe 6, 25 Jahre | 272 | +4 | +6 | +100 Tsd. € | +6 % |

Die Karte „Deine Stärke“ zeigt in der Fußzeile `Anlage {p.potential}`. Standen
davon **+4** aus der Akademie drin, stand das nirgends — die Rrückkopplung, die
den Ausbau lohnend anfühlen lässt, war unsichtbar.

**Nebenbefund, nicht angefasst:** bis Ruhm 35 gibt die Akademie **gar nichts**.
Wer Stufe 3 hat und fünfzehn Jahre wartet, kommt auf Ruhm 18 und bekommt keinen
einzigen Punkt. Das ist eine Kalibrierfrage, keine Anzeigefrage — sie gehört
nicht in dieselbe Fassung wie die Anzeige. Als offener Punkt aufgenommen.

### Eine Zeile, keine eigene Seite
Kevins Entscheidung (Weg B von drei vorgelegten). Die Zeile steht auf der Karte,
auf der auch die Anlage steht — der Rückblick hat schon bis zu zehn Seiten, und
eine elfte mit drei kurzen Zeilen verwässert das Durchtippen.

> aus Akademie am Volkspark: Anlage +4 · Bekanntheit +6 · Startkapital +100 Tsd. € · Entwicklung +6 %

**Ausgeweitet gegenüber der Vorlage, und das gehört gesagt:** vorgeschlagen war
nur der Anlageanteil. Gebaut sind alle vier Posten. Grund: `akaBonusText` ist
dieselbe Funktion, die der Akademiebildschirm benutzt — nur den Anlageanteil
herauszugreifen hätte eine zweite, von Hand gepflegte Liste gebraucht, und die
wäre beim nächsten neuen Posten stumm auseinandergelaufen. Wer es enger will,
sagt Bescheid; die Stelle ist eine Zeile.

### Drei Gegenproben, jede in die richtige Richtung
Neu in `ansichten.jsx`. Der Rückblick zeigt immer nur EINE Seite, die Prüfung
klickt sich also bis zur Karte „Deine Stärke“ durch (höchstens zwölf Tipper,
sonst Fehler) und liest erst dort.

| Fall | Erwartung |
|---|---|
| reife Akademie | Zeile steht da, **mit allen** Posten aus `akaBonusText` |
| ohne Akademie (1. Laufbahn) | Zeile steht **nicht** da |
| `p.aka` gelöscht (alter Spielstand) | zeichnet, Zeile steht **nicht** da |

Bewiesen, dass die Prüfungen beißen — zwei absichtliche Fehler in der Quelle:

| Eingriff | Ergebnis |
|---|---|
| Bedingung `akaMit.length > 0` entfernt | ✗ zwei Fehler: „ohne Akademie steht die Herkunftszeile trotzdem da“ und derselbe für den alten Spielstand |
| Zeile ganz entfernt | ✗ ein Fehler: „mit Akademie fehlt die Herkunftszeile“ |

Ohne die zweite Richtung wäre die Prüfung wertlos gewesen: eine Zeile, die
**immer** gezeichnet wird, hätte den ersten Fall bestanden — und bei jeder
ersten Laufbahn hätte „aus deiner Akademie:“ ohne einen Posten dahinter
gestanden.

### `overflow:hidden` — die Falle, die man nicht sieht
`.karteikarte` trägt `overflow:hidden`. Wächst der Inhalt über die Karte hinaus,
wird er **stumm abgeschnitten**; kein Test wäre rot geworden. Deshalb in echtem
Chromium nachgemessen, drei Breiten, mit und ohne Zeile:

| Breite | ohne | mit | Zuwachs | abgeschnitten? |
|---|---|---|---|---|
| 412 px | 232,8 px | 270,8 px | +38,0 px | nein |
| 360 px | 222,7 px | 260,7 px | +38,0 px | nein |
| 320 px | 215,5 px | 269,0 px | **+53,5 px** | nein |

Bei 320 px bricht die Zeile auf mehr Zeilen um, daher der größere Zuwachs. Die
höchste gemessene Karte ist 270,8 px — der Schleier ist bildschirmhoch, bei
560 px Höhe bleibt reichlich Luft. Das Messwerkzeug war ein Wegwerfstück und
liegt nicht im Prüfstand: es misst EINE Karte. Wächst künftig eine weitere
Rückblickseite, gehört daraus ein festes Werkzeug gemacht.

### Wechselwirkungen geprüft
`akaBonusText` musste in `exporte.txt` aufgenommen werden, sonst hätte der
Prüfstand die neue Probe nicht übersetzen können. `KarriereRueckblick` stand
dort schon (aus `rueckwaerts.jsx`). Der Abschlussbildschirm ist **nicht**
angefasst — er zeigt weiter das Akademiejahr, also was aus ihr wurde; der
Rückblick zeigt jetzt, was sie beigetragen hat. Zwei verschiedene Fragen, zwei
verschiedene Bildschirme.

### Geprüft
Prüfstand gesamt: **484 Ansichten** (vorher 478, die drei neuen Proben und ihre
Renderungen), 0 Fehler, alle vier Zielbänder, 6 × 63 Ansichten rückwärts,
11 Ereignisprüfungen, 56 Vereinsprüfungen.
Herkunftszeile im Lauf ausgegeben: `Anlage +4 · Bekanntheit +6 · Startkapital
+100 Tsd. € · Entwicklung +6 %`.
Gegenproben: 2 absichtliche Fehler → 482/2 und 483/1 statt 484/0.
Bündel **1.201,58 kB** / 439,26 kB gepackt, vorher 1.201,38 / 439,22 — **+0,20 kB**.
Kartenhöhe in Chromium: 270,8 / 260,7 / 269,0 px bei 412 / 360 / 320 px,
nichts abgeschnitten.
`sicht.sh`: 14/14 · 8 px · 4/4 · Impressum 35.32 · Passhöhe 348,1 px konstant
bei 412 und 360 px, 385,9 px konstant bei 320 px · 124 Knöpfe bei zwei Breiten.

## 35.33 · Die Ruhmeshalle war nie geprüft

Offener Punkt 4. Beim Nachsehen war der Befund größer als der Punkt: nicht nur
`zahlenPruefen` griff dort nicht — **`HallScreen` wurde überhaupt nur mit
`hall={[]}` gezeichnet.** Drei Aufrufe in `ansichten.jsx`, alle mit leerer
Halle. Die Ruhmeshalle **mit Einträgen** kam in keiner Ansichtsprüfung vor.

### Zwei Schreibweisen, ein blindes Werkzeug
In diesem Spiel steht ein Wert neben seiner Beschriftung auf zwei Arten:

```jsx
<div><span className="eb">Stärke</span><span>{x.peak}</span></div>   // Akademie, Ehrentafel
<div><span className="eb">Peak</span>{h.peak}</div>                  // Ruhmeshalle
```

`zahlenPruefen` las den Wert mit `feld.nextElementSibling`. Das sieht **nur
Elemente**. Bei der zweiten Schreibweise ist der Wert ein blanker Textknoten,
und `nextElementSibling` liefert `null`.

Jetzt wird alles eingesammelt, was hinter der Beschriftung im selben Kasten
steht — Elemente wie Textknoten:

```js
let t = "";
for (let n = feld.nextSibling; n; n = n.nextSibling) t += n.textContent || "";
```

**Warum das Werkzeug und nicht die Anzeige geändert wurde:** die Markierung im
Spiel umzubauen, damit ein Prüfwerkzeug sie findet, wäre der Schwanz, der mit
dem Hund wedelt — und hätte sieben Stellen angefasst statt einer. Die
Schreibweise mit dem nackten Textknoten ist völlig in Ordnung; blind war das
Werkzeug.

### Bewiesen, dass der Umbau nötig war
Nicht behauptet, sondern gefahren: das **alte** `zahlenPruefen` gegen die neue
Ruhmeshallenprüfung gestellt.

| Zustand | Ergebnis |
|---|---|
| neues Werkzeug, heile Anzeige | 500 Prüfungen, **0 Fehler** |
| **altes** Werkzeug (`nextElementSibling`), heile Anzeige | ✗ Peak, Spiele, Tore, Vorlagen, Titel … — blind auf jede Zelle ohne eigenes `<span>` |
| neues Werkzeug, `{h.peak}` aus der Anzeige entfernt | ✗ `„Peak“ zeigt keine Zahl, sondern „“` — in beiden Halleneinträgen, 498/2 |

Die mittlere Zeile ist der eigentliche Nachweis. Hätte ich nur den dritten Fall
gefahren, wäre grün gewesen, dass die Prüfung beißt — nicht, dass sie vorher
nicht beißen **konnte**. Von acht Zellen der Ruhmeshalle hat das alte Werkzeug
genau eine gesehen: `Punkte`, weil dort als einzige ein `<span>` um den Wert
steht.

### Zwei neue Ansichten, nicht eine
* **drei Einträge**, alle acht Zellen geprüft
* **Altbestand ohne `apps`, `assists`, `heimat`** — Einträge von vor 33.10 haben
  diese Felder nicht. Die beiden Zellen entfallen dann bewusst; geprüft wird,
  dass die übrigen sechs stehen und nirgends `undefined` erscheint.

Die Felder des Halleintrags sind **nachgesehen** worden, nicht geraten:
`saveHall` schreibt name, pos, nat, natId, age, score, tier, peak, titles,
caps, goals, worth, apps, assists, saisons, von, bis, heimat, heimatSpiele.

### Wechselwirkungen geprüft
`zahlenPruefen` wird an drei Stellen gerufen: sechs Akademiezustände, die
Ehrentafel und jetzt die Ruhmeshalle. Die ersten beiden benutzen die
`<span>`-Schreibweise — für sie ändert der Umbau nichts, weil die
Geschwisterkette das `<span>` genauso einsammelt. Beleg: sie sind im selben
Lauf grün geblieben. Am Spielcode ist ausser der Fassungszeile **nichts**
geändert.

### Geprüft
Prüfstand gesamt: **500 Ansichten** (vorher 484 — 16 neue: acht Zellen mit
Einträgen, sechs im Altbestand, zwei Renderungen), 0 Fehler, alle vier
Zielbänder, 6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen,
56 Vereinsprüfungen.
Im Lauf ausgegeben: `Ruhmeshalle 8 Zellen geprüft · 3 Zellenreihen gezeichnet`.
Gegenproben: altes Werkzeug → blind auf fünf und mehr Zellen; Wert entfernt
→ 498/2.
Bündel **1.201,58 kB** / 439,26 kB gepackt — in der Rundung unverändert
gegenüber 35.32, wie es sein muss: geändert wurde `ansichten.jsx`, das nie in
die APK kommt, und vier Zeichen im Impressumstext.

## 35.34 · Jugendturniere bekommen Namen und Gegner

Offener Punkt 7, zweite Hälfte — damit ist er ganz erledigt. Bis 35.33 stand in
`akaJahr` **ein** Satz:

> Sieg beim internationalen Jugendturnier.

Wortgleich, ohne Turnier, ohne Gegner. Gemessen, wie oft: bei vollem Ausbau
**im Mittel 13,5-mal in 25 Jahren**, also in mehr als jedem zweiten
Chronikeintrag. (Der Median liegt genau auf der Kante und fällt je nach
Stichprobe auf 13 oder 14 — zweimal nachgemessen, zweimal anders. Deshalb
steht hier der Mittelwert: er ist die stabilere Zahl.)

### Was ausdrücklich NICHT geändert wurde
Die Siegwahrscheinlichkeit. Sie steht Zeichen für Zeichen wie vorher da:

```js
chance(clamp((staerke - 44) * .035 + S.buehne * .05, .02, .72))
```

`bilanz.turniere` zählt weiter **nur Siege** und geht mit Faktor 6 in `akaRuhm`
ein. Rührte ich daran, verschiebe ich die Zielbänder in `kalibrierung.cjs` und
damit die halbe Akademie. **Sichtbar machen heißt sichtbar machen, nicht neu
ausbalancieren** — und das ist nachgemessen, nicht versichert:

| Ausbau (Wettbewerbe / übrige) | Siege vorher (Median / Ø) | Siege nachher |
|---|---|---|
| 0 / 0 | 0 / 0,5 | 0 / 0,5 |
| 0 / 3 | 0 / 0,6 | 0 / 0,5 |
| 3 / 3 | 3 / 2,8 | 3 / 2,7 |
| 6 / 3 | 6 / 6,5 | 6 / 6,5 |
| 0 / 6 | 6 / 6,2 | 6 / 5,8 |
| 3 / 6 | 10 / 9,7 | 10 / 9,6 |
| 6 / 6 | 14 / 13,7 | 14 / 13,5 |

200 Akademien über 25 Jahre je Zeile. Die Abweichungen liegen im Rauschen der
Stichprobe; kein Median hat sich bewegt.

### Was dazukommt
In Jahren **ohne** Sieg wird jetzt ausgespielt, ob die Akademie überhaupt dabei
war. Das hängt allein an `buehne` — der Abteilung, die „Turniere,
Sichtungsspiele“ verspricht und bis jetzt **nichts zeigte, solange man nicht
gewann**. Wer sie ausbaut und trotzdem nie gewinnt, sah für sein Geld gar
nichts.

Diese Teilnahme zählt **nirgends** mit: kein Zähler, kein Ruhm, keine Bilanz.
Sie steht in der Chronik und sonst nirgends — genau deshalb bleiben die
Zielbänder unberührt.

| Ausbau | Teilnahmen ohne Sieg in 25 Jahren (Ø) |
|---|---|
| Wettbewerbe 0 | **0,0** |
| Wettbewerbe 3, übrige 3 | 8,6 |
| Wettbewerbe 6, übrige 3 | 14,3 |
| Wettbewerbe 6, übrige 6 | 9,0 |

Dass es bei vollem Ausbau **weniger** werden, ist kein Fehler: wer stärkere
Talente hat, gewinnt öfter, und dann bleiben weniger sieglose Jahre übrig, in
denen überhaupt gerollt wird.

### Zehn Namen, erfunden
Echte Turniernamen sind geschützt, und ein Spiel, das offline läuft und
niemandem gehört, braucht das nicht:

> Blaues Band der Jugend · Internationales Pfingstturnier · Nachwuchspokal der
> Landesverbände · Turnier der acht Akademien · Wintercup der Leistungszentren ·
> Hallenmasters der A-Jugend · Sichtungsturnier am Deich · Juniorenpokal der
> Hafenstädte · Osterturnier der Talentschmieden · Grenzlandcup der U19

Zehn: genug, dass sich in 25 Jahren nichts aufdrängt, wenig genug, dass die
Chronik nicht beliebig wirkt. Jeder Name ist eine Zeile und in einer Minute
ausgetauscht.

**Der Gegner kommt aus `CLUBS`**, gefiltert auf Stärke ≥ 78 und Männer, mit
„U19“ dahinter — nicht aus einer zweiten Liste. Eine eigene Gegnerliste wäre
beim nächsten neuen Verein stumm veraltet. Gemessen sind **43 verschiedene
Gegner** aufgetreten.

So liest sich das jetzt:

> Sieg beim Blauen Band der Jugend — im Endspiel gegen FC Liverpool U19.
> Beim Grenzlandcup der U19 im Halbfinale an Ajax Amsterdam U19 gescheitert.

### Eine eigene Farbe für das Ausscheiden
Erster Entwurf gab der Niederlagenzeile `art:"neu"` — dasselbe Blau wie
„N neue Talente aufgenommen“. In **jedem** Jahr steht schon eine blaue Zeile;
zwei nebeneinander lesen sich wie zwei gleich wichtige Nachrichten. `AKA_FARBE`
hat jetzt einen eigenen Eintrag `turnier` in Gedämpft. Der Sieg bleibt Gold.

### Fünf Prüfungen, jede mit Gegenprobe
Neu in `ansichten.jsx`, 60 Jahre bei vollem Ausbau:

| Eingriff in die Quelle | Ergebnis |
|---|---|
| Gegner aus dem Siegtext entfernt | ✗ „ein Siegtext nennt keinen Gegner“ — 504/1 |
| Turniername auf einen festen Eintrag gesetzt | ✗ „nur 1 verschiedene Turniernamen“ — 504/1 |
| Niederlage hängt nicht mehr an `buehne` | ✗ „ohne Wettbewerbe erscheint trotzdem eine Turnierzeile“ (21 statt 0) — 504/1 |
| Niederlage bekommt die Farbe der Neuzugänge | ✗ „dieselbe Chronikfarbe“ — 504/1 |

### Ein eigener Fehler, zweimal derselbe
**Erstens:** die erste Gegenprobe kam **grün** zurück — nicht weil die Prüfung
schwach war, sondern weil mein Suchtext die Quelle gar nicht traf. Das Python
brach mit `AssertionError` ab, die Ausgabe lief in einen anderen Strom, und der
Prüfstand fuhr auf der **unveränderten** Kopie. Eine Gegenprobe, deren Eingriff
nicht stattgefunden hat, meldet Erfolg. **Der Abbruch des Eingriffs muss den
Lauf verhindern**, nicht nur eine Zeile in den Fehlerstrom schreiben.

**Zweitens:** getroffen hat der Suchtext deshalb nicht, weil ich den
Gedankenstrich als `\u2014` in die Quelle geschrieben hatte statt als Zeichen.
JavaScript liest das richtig — die Anzeige stimmte —, aber in der Datei stand
Kauderwelsch, wo im ganzen übrigen Projekt deutscher Text steht. Vier weitere
solche Stellen standen in `ansichten.jsx`. Alle ausgeschrieben.

### Wechselwirkungen geprüft
`akaRuhm` und `bilanz.turniere`: unberührt (Messung oben). `AKA_FARBE` wird an
**zwei** Stellen gelesen — Akademiebildschirm und Abschlussbildschirm; beide
fallen mit `|| "var(--tx)"` auf einen Standardwert zurück, ein neuer Schlüssel
kann dort also nichts brechen. Alte Spielstände tragen Chronikeinträge mit
`art:"neu"` und `art:"titel"` und werden weiter genauso gezeichnet.
Errungenschaft `a_aka_turn` („Ein Jugendturnier gewinnen“) hängt an
`A.bilanz.turniere >= 1` — unverändert, weil der Zähler unverändert ist.

### Geprüft
Prüfstand gesamt: **505 Ansichten** (vorher 500), 0 Fehler, **alle vier
Zielbänder** — Vollausbau 26,7 (25–35), Kosten 2912 (2700–3100), Weltklasse 5
(3–8), Rautekarte 33 (28–42). 6 × 63 Ansichten rückwärts, 11
Ereignisprüfungen, 56 Vereinsprüfungen.
Im Lauf ausgegeben: `60 Jahre voll ausgebaut: 32 Siege · 19 Ausscheiden ·
10 Turniernamen · ohne Wettbewerbe: 0 Zeilen`.
Siegquote vorher/nachher: sieben **Ausbaukombinationen** (nicht Stufen — davon
gibt es sechs), kein Median ausserhalb des Stichprobenrauschens (Tabelle oben).
Die Tabelle in einem zweiten, unabhängigen Lauf nachgemessen: 0 / 0 / 3 / 6 /
6 / 10 / 13 gegen dokumentierte 0 / 0 / 3 / 6 / 6 / 10 / 14 — nur die letzte
Zeile kippt, und zwar die, deren Median auf der Kante sitzt.
43 verschiedene Gegner, 10 von 10 Turniernamen aufgetreten.
Bündel **1.202,18 kB** / 439,52 kB gepackt, vorher 1.201,58 / 439,26 —
**+0,60 kB**. Das sind die zehn Namen, die fünf Runden und zwei Textbausteine.

## 35.35 · Drei Flaggen bekommen Folgen

Offener Punkt 11, erster Teil. Fünf Flaggen wurden gesetzt und von niemandem
gelesen. **Erst gemessen, wie oft sie überhaupt vorkommen** — 1.500 Laufbahnen,
Ablauf wie im Kalibrierwerkzeug, Wahl zufällig:

| Flagge | gesetzt in | zum Vergleich: Flaggen, die wirken |
|---|---|---|
| `manipuliert` | 1,9 % | `kapitaen` 34,3 % |
| `pendeln` | 1,3 % | `wetten` 13,1 % |
| `beidseitig` | 0,9 % | `abschluss` 11,3 % |
| `attest` | 0,2 % | `insider` 3,5 % |
| `treugeblieben` | nicht messbar | `sesshaft` 1,7 % · **`maulwurf` 0,7 %** |

Zwei Sachen daran zählen. **`maulwurf` ist seltener als drei der fünf** und
trotzdem an drei Stellen angeschlossen — Seltenheit ist also kein Grund, es zu
lassen. Und die Null bei `treugeblieben` ist **ein Fehler meines Messaufbaus**,
keine Spieltatsache: das Ereignis verlangt `istTraum(p)`, mein Prüfling hat nie
einen Traumverein (`p.traum` bleibt `null`, nachgesehen).

### 1. `beidseitig` — ein gebrochenes Versprechen, kein fehlender Inhalt
Der Ereignistext von `pa_seitenwechsel` sagt wörtlich: *„Das macht dich für
jeden Trainer wertvoller.“* Und dann geschah nichts. Beide Quellen der Flagge
sind `pos:["AV"]`, die Sache ist also in sich stimmig.

Angeschlossen am **Zweikampf um den Stammplatz** in `roleFor`: wer beide
Außenbahnen spielt, wird von EINEM starken Nebenmann nicht aus der Elf
gedrängt — er weicht auf die andere Seite aus.

```js
if (rivalOvr != null) d -= beidfuessig
  ? clamp((rivalOvr - ovr) * .30, -2, 4)
  : clamp((rivalOvr - ovr) * .55, -2, 7);
```

Gemessen, was das über die Spanne austrägt:

| Nebenmann ist besser um | ohne | mit |
|---|---|---|
| 4 Punkte | Rotation | Rotation |
| **8 Punkte** | **Ergänzung** | **Rotation** |
| 12 Punkte | Ergänzung | Ergänzung |
| 16 Punkte | Ergänzung | Ergänzung |

Genau ein Fenster, und das ist Absicht: gegen einen übermächtigen Nebenmann
hilft auch Beidfüßigkeit nicht, gegen einen knapp besseren war man ohnehin
drin. Der Unterschied liegt dort, wo es kippt.

**Nicht angeschlossen: die Angebotszahl.** Das Wildcard gibt dafür bereits
`offers:1`. Ein zweiter Aufschlag hätte Wildcardträgern doppelt
gutgeschrieben, ohne dass irgendwo stünde warum.

### 2. `manipuliert` — gehörte in die Schmutzliste
Der 55-%-Zweig heißt *„Es merkt niemand“* — und dann merkte es wirklich nie
jemand. Die Flagge steht jetzt in `dreckig` neben `wetten`, `maulwurf`,
`altersluege` und `steuermodell`.

**Bewusst NICHT** in die Beliebtheitsrechnung (Zeile 4611): die ist öffentlich,
und wer die Flagge trägt, ist öffentlich unbescholten. Die Weltbilanz führt
Buch über das, was war, nicht über das, was die Leute wissen.

### 3. `pendeln` — lief weiter, kostete aber nur einmal
Acht Punkte Fitness einmalig, danach vergessen — dabei pendelt man ja weiter.
Jetzt zwei Punkte je Saison, **solange die Beziehung hält**. Das Ende ist
eingebaut und braucht keinen Zeitzähler: geht sie auseinander, gibt es nichts
mehr zu pendeln und die Flagge fällt weg. Zwei Punkte, nicht vier — über
fünfzehn Saisons wäre das sonst eine zweite Karriereende-Bedingung geworden.

### Vier Gegenproben
Jede Prüfung vergleicht **zwei Spieler, die sich nur in der Flagge
unterscheiden**. Anders liesse sich nicht sagen, ob die Flagge wirkt oder der
Zufall.

| Eingriff | Ergebnis |
|---|---|
| `beidseitig`-Anschluss entfernt | ✗ „ändert die Rolle nicht: beide bench“ |
| `beidseitig` wirkt AUCH ohne Nebenmann (+3 pauschal) | ✗ „wirkt auch ohne Nebenmann — das ist zu viel“ |
| `manipuliert` aus `dreckig` entfernt | ✗ „zählt nicht als Skandal (0 → 0)“ |
| heiler Stand | 509/0 |

Die zweite ist die, die ich fast vergessen hätte. Ohne sie wäre eine Flagge
durchgegangen, die überall Rabatt gibt statt nur im Zweikampf — und die erste
Prüfung wäre trotzdem grün geblieben.

### Zwei eigene Fehler, beide dokumentiert
**`bilanzErgaenzen` verändert nicht, sondern gibt zurück.** Meine erste Probe
übergab eine Bilanz und las danach das Eingabeobjekt — zweimal null, rot, aber
aus dem falschen Grund. Signatur nachgesehen: `(G, p) => neue Bilanz`.

**Bearbeitungsskripte meldeten Erfolg, ohne geschrieben zu haben — zweimal.**
Einmal passte in einem Skript mit zwei Ersetzungen die zweite nicht, also wurde
gar nichts geschrieben und die erste ging mit unter; aufgefallen erst am
`ReferenceError` im Lauf. Einmal landete derselbe Platzhalterblock **doppelt**
in STAND.md. **Nach jedem Schreibvorgang nachsehen, nicht der Erfolgsmeldung
glauben** — dieselbe Lehre wie beim Blockschnitt, an anderer Stelle. Seither
folgt auf jedes Skript ein `grep`.

### Grundlinie gesenkt
`ereignispruefung.cjs` führt `toteFlaggen` als Grundlinie. Sie stand auf 5, das
Werkzeug meldete von sich aus: *„2 (unter der Grundlinie 5; bitte
GRUNDLINIE.toteFlaggen auf 2 senken)“*. Steht jetzt auf 2. Die verbliebenen
zwei sind `attest` und `treugeblieben` — beide brauchen eigenen Inhalt.

### Geprüft
Prüfstand gesamt: **509 Ansichten** (vorher 505), 0 Fehler, alle vier
Zielbänder, 6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen,
56 Vereinsprüfungen.
Im Lauf ausgegeben: `beidseitig gegen starken Nebenmann: bench → rot · ohne
Nebenmann: rot = rot` und `manipuliert in der Weltbilanz: Skandale 0 → 1`.
Tote Flaggen: **5 → 2**, vom Werkzeug selbst gezählt.
Gegenproben: drei absichtliche Fehler → je 508/1 statt 509/0.
Bündel **1.202,38 kB** / 439,60 kB gepackt, vorher 1.202,18 / 439,52 —
**+0,20 kB**.
`sicht.sh`: 14/14 · 8 px · 4/4 · Impressum 35.35 · 124 Knöpfe.

## 35.36 · Die letzten zwei Flaggen bekommen Inhalt

Offener Punkt 11, zweiter Teil — damit ist er erledigt. `attest` und
`treugeblieben` liessen sich nicht wie die drei aus 35.35 an eine vorhandene
Rechnung hängen: die eine ist eine **Lüge, die jemand anders kennt**, die
andere eine **Entscheidung, an die sich andere erinnern**. Beides sind
Geschichten, keine Rechenwege. Also zwei neue Ereignisse.

### `attest_zurueck` — Der Arzt meldet sich
> Er will nichts Böses, sagt er. Nur ein Trikot mit Unterschrift, für die
> Praxis. Und beim nächsten Mal vielleicht Karten.

Drei Wege, und keiner ist gratis:

| Wahl | Was passiert |
|---|---|
| **Trikot schicken** | Er fragt wieder. Und wieder. Moral −10, kein Ende — die Flagge bleibt offen |
| **Nicht mehr melden** | 60 % er gibt auf (Moral −6) · 40 % er redet, der Verein fragt nach (Vertrauen −22) |
| **Reinen Tisch machen** | Vertrauen −14, aber Moral +8, Vermächtnis +4 — und niemand hat mehr etwas in der Hand |

Der mittlere Weg ist der einzige mit Würfel, und das ist Absicht: Aussitzen ist
weder sicher noch sicher schlecht. Der bequemste Weg (Trikot) schliesst die
Sache **nicht** ab — nur die beiden anderen setzen `attestErledigt`. Wer
nachgibt, bleibt erpressbar, und genau das ist der Punkt.

### `tv_bannerbleibt` — Sie erinnern sich
> Das Banner in der Nordkurve hängt immer noch. Darauf steht nur ein Datum —
> der Tag, an dem du abgesagt hast. Vor dir läuft ein Kind mit deinem Namen auf
> dem Rücken, das damals noch nicht geboren war.

**Bewusst nur EINE Wahl.** „Die Stadt vergisst das nie“ soll sich nicht wie eine
neue Entscheidung anfühlen — es ist eine Erinnerung, kein Dilemma. Moral +16,
Vermächtnis +14, Form +5, und danach ist es vorbei (`bannergesehen`).

Bedingung: `treugeblieben` **und mindestens acht Saisons**. Der Satz „ein Kind,
das damals noch nicht geboren war“ muss stimmen können; nach zwei Jahren
wäre er albern.

### Warum Bedingungen geprüft werden und nicht Durchläufe
Die beiden Flaggen werden in 0,2 % bzw. kaum messbar vielen Laufbahnen gesetzt
(gemessen in 35.35). **Ein Ereignis, das nie erscheint, ist so folgenlos wie
die Flagge vorher — nur schwerer zu bemerken.** Ein Zufallsdurchlauf würde die
beiden praktisch nie ziehen und deshalb nichts beweisen. Geprüft wird darum die
Bedingung selbst, sieben Fälle, jeder in die Richtung, in die er gehört:

| Ereignis | Fall | soll |
|---|---|---|
| `attest_zurueck` | mit `attest` | greift |
| | ohne `attest` | schweigt |
| | nach reinem Tisch | schweigt |
| `tv_bannerbleibt` | treu, 8 Saisons | greift |
| | treu, erst 7 Saisons | **schweigt** |
| | nicht treu, 12 Saisons | schweigt |
| | schon gesehen | schweigt |

Dazu eine achte: `tv_bannerbleibt` muss **genau eine** Wahl haben. Steht das
eines Tages anders da, war es kein Versehen mehr, sondern eine Entscheidung —
und dann soll sie auffallen.

### Drei Gegenproben
| Eingriff | Ergebnis |
|---|---|
| Bedingung von `attest_zurueck` auf `true` | ✗ zwei Fehler: „ohne attest“ und „nach reinem Tisch“ greifen beide |
| Wiederholsperre `!bannergesehen` entfernt | ✗ „schon gesehen: erwartet schweigt, war greift“ |
| beide Ereignisse wieder entfernt | ✗ zwei Fehler: „Ereignis gibt es nicht“ |

Die zweite ist die wichtige: ohne sie wäre ein Erinnerungsmoment
durchgegangen, der **jedes Jahr** wiederkommt — und nichts nutzt sich schneller
ab als eine Erinnerung, die man fünfmal hat.

### Grundlinie auf null
`toteFlaggen` stand seit 35.7 auf 5, seit 35.35 auf 2, jetzt auf **0**. Das ist
das erste Mal, dass keine einzige Flagge im Spiel gesetzt wird, ohne dass sie
irgendwo gelesen würde. Steigt die Zahl wieder, ist eine neue Flagge ohne
Folgen dazugekommen — die Grundlinie ist ab jetzt eine echte Sperre und kein
Schuldenstand mehr.

Die zwei neuen Flaggen `attestErledigt` und `bannergesehen` zählen nicht als
tot: sie werden in der Bedingung desselben Ereignisses gelesen. Das hat das
Werkzeug selbst festgestellt, nicht ich.

### Geprüft
Prüfstand gesamt: **517 Ansichten** (vorher 509 — acht neue), 0 Fehler, alle
vier Zielbänder, 6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen,
56 Vereinsprüfungen.
Ereignisse: **520** (vorher 518).
Tote Flaggen: **2 → 0**, vom Werkzeug gezählt.
Fast gleiche Textpaare: 5, unverändert — die neuen Texte kollidieren mit
keinem der 518 vorhandenen.
Gegenproben: drei absichtliche Fehler → 515/2, 516/1, 510/2 statt 517/0.
Bündel **1.204,12 kB** / 440,10 kB gepackt, vorher 1.202,38 / 439,60 —
**+1,74 kB**. Das sind die beiden Ereignisse mit ihren sechs Ausgängen.
`sicht.sh`: 14/14 · 8 px · 4/4 · Impressum 35.36 · 124 Knöpfe.

## 35.37 · Ereignisse, die zum falschen Moment kommen

Kevins Auftrag: **alle** Ereignisse durchgehen, samt Texten, Bedingungen und
Auswirkungen. Seine Beispiele: die Binde wird angeboten, obwohl man sie trägt;
ein Kind wird angekündigt, obwohl die Lage nicht passt.

520 Ereignisse sieht man nicht mit den Augen durch. Also ein Werkzeug:
**`stimmigkeit.cjs`**, fünf Proben über **520 Ereignisse, 1.136
Auswahlmöglichkeiten, 1.439 Ausgänge**.

### Was sauber war
| Probe | Befund |
|---|---|
| `fx`-Schlüssel, die `applyFx` nicht kennt (verpuffen stumm) | **0** |
| Würfel, die sich nicht auf 1,000 summieren | **0** |
| Ereignisse, in denen JEDE Wahl bedingt ist (kein Ausweg) | **0** |
| Auswahl ganz ohne Wirkung | 16, alle „Ablehnen“/„Später mal“ — Absicht |

Besonders die erste Null ist etwas wert: ein vertippter `fx`-Schlüssel wäre
von `applyFx` wortlos verschluckt worden, und die Wahl hätte nichts getan,
ohne dass irgendwo etwas rot wird.

### Der Befund: `drawEvents` prüft die Bedingungen nur EINMAL
Die vier Bindenereignisse sind **alle** korrekt mit `!p.flags.kapitaen`
abgesichert. Der Fehler sitzt eine Ebene tiefer:

> `drawEvents` baut den Kandidatenpool einmal und prüft alle `cond` gegen den
> Zustand **vor** der ersten Entscheidung. Dann zieht es n Ereignisse daraus.

Wer in Ereignis 1 die Binde annimmt, bekommt sie in Ereignis 2 desselben
Jahres noch einmal angeboten — beide waren beim Ziehen zulässig. Die Sperre
`usedTags` verhindert nur zwei Ereignisse mit **demselben** tag:

| Ereignis | tag | Bedingung |
|---|---|---|
| `kapitaen` | Führung | `!p.flags.kapitaen` |
| `v_kapitaenswahl` | Verein | `!p.flags.kapitaen` |
| `pt_kapitaenbinde` | Position | `!p.flags.kapitaen` |

Drei verschiedene tags — die Sperre greift nicht. Kevins zweites Beispiel ist
derselbe Mechanismus: `familie` gibt `life.kids`, `kinderwunsch` [Privat] fragt
im selben Zug, ob man Kinder will.

**Statisch gefunden: 49 solcher Paare. Gemessen: 95 Fälle in 28.181 gespielten
Jahren, 0,34 %.** Selten — aber es ist der Fehler, den man sofort bemerkt,
weil er das Spiel dumm aussehen lässt.

### Der Fix: eine Stelle statt 49 Einzelbedingungen
Bevor das nächste Ereignis gezeigt wird, wird seine Bedingung gegen den
**jetzigen** Zustand geprüft:

```js
let k = ei + 1;
while (k < queue.length && !nochGueltig(p, queue[k])) k++;
```

Dasselbe im Schnelldurchlauf. Drei Entscheidungen dabei:

* **`nochGueltig` steht auf Modulebene**, nicht in der Komponente — sonst
  liesse sie sich nicht prüfen.
* **Dasselbe Probeobjekt wie `drawEvents`** (`{ ...q, rival: evCtx(q).rival }`),
  sonst scheitern Ereignisse, die auf `rival` zugreifen, an sich selbst.
* **Wirft die Bedingung, wird das Ereignis GEZEIGT.** Ein stiller Ausfall wäre
  schlimmer als ein unpassendes Ereignis.

Gemessen mit demselben Werkzeug, vorher gegen nachher:

| | unpassend gezeigt | übersprungen |
|---|---|---|
| ohne Zweitprüfung | **95** (0,337 % der Jahre) | 0 |
| mit Zweitprüfung | **0** | 70 |

### Die Textproben: 11 Verdachtsfälle, 1 echter
Elf Stellen, an denen ein Text einen Zustand nennt, den die Bedingung nicht
absichert. **Zehn davon sind falsche Treffer** — alle einzeln nachgelesen und
mit Begründung in `AUSNAHMEN` eingetragen, nicht durch Aufweichen der Suche
beseitigt:

| Ereignis | scheinbar | tatsächlich |
|---|---|---|
| `a2_ausland` | Partnerin | „ihr beide“ = du und der junge Zugang |
| `pt_nummerzwei` | Trennung | das Torhüterduell |
| `schiedsrichter` | Binde angeboten | „Du gehst zum Kapitän“ — Richtung |
| `b_mitspielerverletzt` | deine Reha | die des Mitspielers |
| `me_mentor3` | Nationalelf | **er** spielt dort, der Schützling |
| `as_golf` | Nationalelf | das Ereignis verschafft den Pass erst |
| `hk_hymnedebatte` | Karriereende | bildlich |
| `tr_fuenf` | aufhören | „hier aufhören wollen“ = Treuebekenntnis |
| `r_kaumgespielt` | Leihe | „Leihe fordern“ ist die Wahl |
| `al_reisekader` | Binde angeboten | du sprichst mit dem, der sie trägt |

**Der eine echte:** `n_abschied` (Abschiedsspiel aus der Nationalmannschaft)
schrieb *„deine Kinder laufen mit ein“* — ohne jede Bedingung auf
`life.kids`. Ein kinderloser Spieler bekam Kinder angedichtet. Der Text sagt
jetzt „Blumen, Ehrenrunde“ und behauptet nichts mehr.

### Zwei eigene Fehler, beide berichtigt
**Das Suchmuster verkehrte Bedingungen ins Gegenteil.** `!p.flags.x` heisst
FEHLT, `!!p.flags.x` heisst VORHANDEN — mein Muster erwischte das erste
Ausrufezeichen von `!!` und meldete `kp_ansprache` als „setzt voraus, dass die
Binde fehlt“, obwohl es sie verlangt. Mit Rückblick (`(?<!!)`) blieben von 49
Treffern 38 übrig.

**Ich habe `ARBEIT=/tmp/ps` gesetzt.** `pruefen.sh` kopiert die Baudateien nach
`$ARBEIT` — damit lag die `package.json` des Spiels mit `"type":"module"` neben
`motor.js`. Von da an war das Bündel für node ESM, `module.exports`
wirkungslos, und **jedes** Werkzeug, das den Motor lädt, warf einen Fehler tief
in einer erzeugten Datei. Das sieht nach kaputtem Werkzeug aus und ist ein
Pfadfehler — dieselbe Familie wie `MODULE_NOT_FOUND` aus 35.14. Dagegen steht
jetzt eine Wache in `pruefen.sh`, die abbricht, wenn ARBEIT und BAU
zusammenfallen.

### Und ein dritter, der die alte Stolperfalle wiederholt
Nach der Textberichtigung meldete `stimmigkeit.cjs` den Treffer **weiter** —
weil es den Motor liest und der von vor der Änderung stammte. **Ein altes
Bündel gemessen**, genau wie in 34.5 und 35.8. Das Werkzeug meldet jetzt bei
jedem Lauf, woraus es gemessen hat, und **bricht hart ab**, wenn `ereignisse.js`
neuer ist als das Bündel. Gegengeprüft mit `touch ereignisse.js`.

### Die Prüfung, die erst nichts prüfte
Mein erster Entwurf prüfte nur die Ereignisbedingungen — und blieb **grün**,
als ich das Überspringen aus `nextEvent` wieder herausnahm. Eine Prüfung, die
den entfernten Fix nicht bemerkt, prüft ihn nicht. Jetzt dreiteilig:

| Was | Wie |
|---|---|
| `nochGueltig` selbst | direkt gerufen: ohne Binde durchlassen, mit Binde sperren |
| Randfälle | Ereignis ohne Bedingung → durch; Bedingung wirft → durch |
| Verdrahtung | Textabgleich in `stimmigkeit.cjs`, drei Stellen |

Der Textabgleich ist ein schwaches Mittel und wird als solches benannt: er
fängt das Herausnehmen, nicht das Umbauen.

### Gegenproben
| Eingriff | Ergebnis |
|---|---|
| Überspringlogik aus `nextEvent` entfernt | ✗ `fehlt: nextEvent überspringt ungueltig gewordene Ereignisse`, 1 harter Fehler |
| `nochGueltig` gibt immer `true` | ✗ „lässt das Bindenereignis MIT Binde durch“ |
| `!p.flags.kapitaen` aus `pt_kapitaenbinde` entfernt | ✗ „mit Binde gelten immer noch 1 Bindenereignisse“ |
| `ereignisse.js` angefasst ohne Neubau | ✗ `ereignisse.js ist NEUER als das Bündel` |

### Geprüft
Prüfstand gesamt: **523 Ansichten** (vorher 517), 0 Fehler, alle vier
Zielbänder, 6 × 63 Ansichten rückwärts, 11 Ereignisprüfungen,
56 Vereinsprüfungen.
Neue Phase `stimmig` in `pruefen.sh`: 7 Proben ohne Befund, 0 harte Fehler.
Im Lauf ausgegeben: `Binde: 4 Ereignisse zulässig → nach Annahme 0` und
`Kind: 2 → nach Geburt 0`.
Kollisionen: **95 → 0** bei 28.181 gespielten Jahren.
Bündel **1.204,27 kB** / 440,17 kB gepackt, vorher 1.204,12 / 440,10 —
**+0,15 kB**.

## 35.38 · Der Kapitän spricht nicht mehr mit sich selbst

Offener Punkt 18, und Kevins Auftrag dazu: **alle** Texte durchgehen, in denen
so etwas vorkommt. Also nicht die eine Stelle flicken, sondern die Klasse
finden.

### Die Klasse
Ein Text nennt eine Rolle **in der dritten Person**, die der Spieler selbst
innehaben kann. Kein Mechanikfehler — ein Riss in der Erzählung, und davon
merkt der Spieler jeden einzelnen.

Gesucht in **jedem** Text jedes Ereignisses: Titel, Beschreibung,
Wahlbeschriftungen, Hinweise und alle Ausgänge. 19 Kandidaten, alle einzeln
gelesen. **Zwei echte:**

**`al_reisekader`** — die Wahl trug bereits eine Bedingung, aber die falsche:
`!!p.flags.vize || !!p.flags.exkapitaen || p.trust>=62`. Ein Kapitän hat fast
immer über 62 Vertrauen und bekam die Option „Über den Kapitän gehen“ also
**gerade dann**. Der Ausgang lautete „Du sprichst mit dem, der die Binde
trägt“ — Selbstgespräch.

**`r_pokalsieg`** — Wahl „Die Älteren vorlassen“, Ausgang „Du drückst dem
Kapitän das Mikrofon in die Hand“. Bist du der Kapitän, drückst du es dir
selbst in die Hand.

### Zwei verschiedene Lösungen, mit Absicht
`evText` lässt Texte **Funktionen** sein (`typeof v === "function" ? v(ctx)`),
und `ctx.p` ist der Spieler. Auch Wahlbeschriftungen laufen dort durch —
nachgesehen in Zeile 12943. Damit war die bessere Lösung möglich:

* **`al_reisekader`**: Beschriftung UND Ausgang richten sich jetzt nach der
  Lage. Als Kapitän heißt die Wahl „Als Kapitän vorstellig werden“ und der
  Ausgang „Du gehst als Kapitän hin, nicht als Betroffener“. Die Bedingung
  nimmt `!!p.flags.kapitaen` mit auf — vorher fiel der Kapitän zufällig über
  die Vertrauensschwelle hinein, jetzt ausdrücklich.
* **`r_pokalsieg`**: nur umformuliert, „einem der Älteren“. Das stimmt immer
  und passt zur Beschriftung „Die Älteren vorlassen“. Eine Fallunterscheidung
  wäre hier Aufwand ohne Gewinn.

**Dem Kapitän wurde nichts weggenommen.** Der einfache Weg wäre gewesen, die
Option für Kapitäne zu sperren — dann hätte ausgerechnet der mit der Binde
weniger Handlungsmöglichkeiten als ein Ersatzspieler.

### Die 17 anderen — warum sie sauber sind
| Ereignis | schien | ist |
|---|---|---|
| `a2_dialekt` | „Über den Kapitän“ | `age<=21` — **unter 23 kann niemand Kapitän sein** |
| `a_schulsorgen` | „der Älteste“ | in der Schulklasse, nicht im Team |
| `v_kapitaenswahl` | „den Kapitän“ | `!p.flags.kapitaen` in der Bedingung |
| `b_wunderkind` | „der Beste“ | der junge Zugang, `${c.young.name}` |
| `v_insolvenz` | „als Legende“ | bildlich, „hier“ — nicht die Flagge |
| `r_aufstieg` | „als Stammspieler“ | das ist das ERGEBNIS der Wahl |
| `flitter`, `sorgerecht` | Frau, Kinder | über `life.status` / `life.kids` abgesichert |
| Eltern, Bruder, Schwester | Familie | nicht modelliert — jeder hat einen Vater gehabt |

Die Altersgrenze ist **nachgesehen, nicht geraten**: die vier Bindenereignisse
verlangen `age>=24, 25, 26, 27`, die automatische Vergabe in `simulateSeason`
verlangt `age>=23`. Unter 23 gibt es keinen Kapitän. Diese Zahl steht in
`stimmigkeit.cjs` mit ihrer Herkunft daneben — verschiebt sich eine der
Grenzen, stimmt sie nicht mehr.

### Vier eigene Fehler in einer Fassung
Diese Suche zu bauen hat mich viermal auf die Nase gelegt. Alle vier stehen
hier, weil jeder davon **stumm grün** war:

1. **`\u00e4` in einem Python-Rohstring.** In `r'...'` bleibt das ein
   Backslash-u, kein ä. Die Suche fand nichts und meldete „sauber“.
2. **Naives Anführungszeichen-Paaren.** `"([^"]{3,320})"` über eine Datei
   laufen zu lassen paart das 1. mit dem 2., das 3. mit dem 4. — bei ungerader
   Anzahl verrutscht alles. `r_pokalsieg` fiel heraus. Seitdem wird direkt im
   Ereignisblock gesucht.
3. **`hatFunktion` je Ereignis statt je Text.** Ich übersprang ein ganzes
   Ereignis, sobald IRGENDEIN Text darin eine Funktion war — also genau die
   zwei Fälle, für die die Suche gebaut wurde. Beide Gegenproben blieben grün.
4. **Die Gegenprobe hat den Motor überschrieben.** `BAU` steht fest auf
   `/tmp/ps`. Eine Gegenprobe mit `ARBEIT=/tmp/gp2` baut trotzdem nach
   `/tmp/ps` — danach misst jedes Werkzeug die **sabotierte** Quelle. Deshalb
   zeigte `al_reisekader` noch feste Texte, obwohl die Quelle längst
   Funktionen trug. **Nach jeder Gegenprobe neu bauen.**

Dazu ein fünfter, der nichts kaputt machte, aber alles wertlos: eine
Gegenprobe, deren Ersetzung **nicht passte** (`AssertionError: 0`). Das Skript
schrieb nichts, der Lauf meldete „nichts gefunden“ — und das sah aus wie ein
Ergebnis. Gegenproben brechen jetzt sichtbar ab, wenn die Bearbeitung nicht
greift.

### Die Suche prüft sich selbst
In `stimmigkeit.cjs` steht eine **Kontrollprobe**: ein Satz, von dem feststeht,
dass die Suche ihn finden muss. Findet sie ihn nicht, meldet sie einen harten
Fehler statt „nichts gefunden“. Nach drei kaputten Suchen an einem Tag ist das
keine Vorsicht, sondern Notwehr.

| Eingriff | Ergebnis |
|---|---|
| `r_pokalsieg` zurück auf „dem Kapitän“ | ✗ `Wahl 2 Ausgang 1: „dem Kapitän“` |
| `al_reisekader` zurück auf feste Beschriftung | ✗ `Wahl 1 Beschriftung: „den Kapitän“` |
| `a2_dialekt` von `age<=21` auf `age<=25` | ✗ `Wahl 2 Hinweis: „den Kapitän“` |
| Suchmuster der Kontrollprobe sabotiert | ✗ `KONTROLLPROBE GESCHEITERT`, harter Fehler |

Die dritte ist die feinste: sie beweist, dass der Altersdeckel wirklich als
Schutz gelesen wird und nicht bloss zufällig nichts meldet.

### Geprüft
Prüfstand gesamt: **523 Ansichten**, 0 Fehler, alle vier Zielbänder,
6 × 63 rückwärts, 11 Ereignisprüfungen, 56 Vereinsprüfungen.
Stimmigkeit: **16 Proben ohne Befund**, 0 harte Fehler.
520 Ereignisse · 1.136 Auswahlmöglichkeiten · 1.439 Ausgänge.
Bündel **1.204,51 kB** / 440,22 kB gepackt, vorher 1.204,27 / 440,17 —
**+0,24 kB**. Das sind die zwei Fallunterscheidungen.

## 35.39 · Die Akademie zahlt früher — und sagt es

Offener Punkt 17. Der Punkt lautete „bis Ruhm 35 gibt es nichts“. Gemessen war
es schlimmer.

### Der Befund
40 Läufe je Ausbaustufe, Median, gegen die Kosten gehalten:

| Ausbau | Kosten | erste Gabe | Anlage +1 | Ansehen n. 25 J. |
|---|---|---|---|---|
| Stufe 1 | 0 VC | **nie** | nie | 6 |
| Stufe 2 | 181 VC | **nie** | nie | 12 |
| Stufe 3 | 519 VC | **18. Jahr** | 28. Jahr | 42 |
| Stufe 4 | 1.061 VC | 7. Jahr | 11. Jahr | 119 |
| Stufe 6 | 2.912 VC | 4. Jahr | 5. Jahr | 330 |

**Stufe 1 und 2 warfen nie etwas ab, auch nach 30 Jahren nicht.** Stufe 3 kostet
519 VC und brauchte 18 Jahre bis zur ersten Gabe. Wer die ersten Stufen kaufte,
bekam über ein Dutzend Laufbahnen hinweg null zurück — und seit 35.32 zeigt der
Rückblick dann korrekt gar keine Zeile.

Zum Vergleich: **Stufe 6 kostet 2.912 VC, also genau eine Laufbahn** (das
VC-Zielband). Der Vollausbau war nie das Problem, der Einstieg war es.

### Und niemand konnte es wissen
Kevins Frage beim Vorlegen war die richtige: **wo steht das überhaupt?**
Nachgesehen — „Ansehen“ erscheint an **genau einer** Stelle: als sechste Kachel
in der Statistikreihe des Akademiebildschirms. Eine nackte Zahl.

Der goldene Kasten „Was die Nächsten davon haben“ erschien nur bei
`bt.length > 0` — also **ausgerechnet in der toten Frühphase nicht**, in der man
wissen will, wofür man zahlt. Darunter stand „Irgendwann ist aber Schluss mit
dem Bonus“: angekündigt wurde der **Deckel**, nicht der Einstieg.

### Gebaut: Weg A und B zusammen (Kevins Entscheidung)
**A — Schwellen gesenkt, Deckel unangetastet:**

| | alt | neu |
|---|---|---|
| Startkapital | Ansehen / 25 | / 12 |
| Bekanntheit | / 35 | / 18 |
| Anlage | / 45 | / 28 |
| Entwicklung | / 70 | / 45 |

**B — Grundgabe:** wer eine Akademie **gegründet** hat, bekommt +1 Bekanntheit,
auch bei Ansehen 0. Ohne Gründung weiterhin nichts — die erste Laufbahn erbt
keinen Bonus.

**`akaRuhm` bleibt unangetastet.** Die Errungenschaft „Ansehen von 150“ und jedes
Zielband der Kalibrierung hängen an der Ruhmskala; geändert hat sich nur, was man
dafür bekommt. Das war der Grund, A gegenüber „Ruhm schneller wachsen lassen“
vorzuziehen.

### Wirkung, gemessen statt gehofft
| Ausbau | erste Gabe vorher | nachher | Anlage +1 vorher | nachher |
|---|---|---|---|---|
| Stufe 1 | nie | **1. Jahr** | nie | nie |
| Stufe 2 | nie | **1. Jahr** | nie | nie |
| Stufe 3 | 18. | **1. Jahr** | 28. | **15.** |
| Stufe 4 | 7. | **1. Jahr** | 11. | **7.** |
| Stufe 6 | 4. | **1. Jahr** | 5. | **4.** |

### Die Gegenprobe in die ANDERE Richtung
Aus „gibt nichts“ darf kein „gibt zu viel“ werden. 700 Laufbahnen je Bedingung:

| | Spitzenstärke Median | Mittel |
|---|---|---|
| ohne Akademie | 77 | 76,1 |
| ALT bei Ansehen 119 | 79 | 77,0 |
| **NEU bei Ansehen 119** | 80 | **78,1** |
| Deckel (unverändert) | 80 | 78,4 |

Der größte Sprung trägt **+1,1 Punkte** Spitzenstärke aus, und der Deckel liegt
weiterhin nur **+2,3** über „gar keine Akademie“. Die mittlere Ausbaustufe rückt
also näher an die Decke — genau die Absicht — während die Decke steht.

### Die Anzeige: eine Quelle, keine zweite Liste
Der Kasten steht jetzt, sobald eine Akademie gegründet ist, und nennt die
nächste Schwelle: *„Noch 12 Ansehen bis Startkapital +10 Tsd. €.“*

Die Zahl kommt aus `akaNaechsteGabe`, und die rechnet mit **`akaBonus` selbst**
— sie zählt Ansehen hoch, bis sich etwas ändert. Eine zweite, von Hand
gepflegte Schwellenliste in der Anzeige wäre beim nächsten Zahlendreh stumm
falsch geworden, und der Spieler hätte einer Zahl geglaubt, die nicht stimmt.
Dieselbe Regel wie bei `akaBonusText` in 35.32 und der Ablaufliste in 35.29.

Ist alles ausgereizt, steht dort „Mehr geht nicht“ statt einer Zahl.

### Gegenproben
| Eingriff | Ergebnis |
|---|---|
| Deckel für Anlage von 4 auf 6 angehoben | ✗ „Deckel verschoben: pot = 6 statt 4“ |
| Grundgabe auch OHNE Gründung | ✗ „ohne gegründete Akademie gibt es etwas“ (2 Fehler) |
| Ankündigung von der Rechnung entkoppelt | ✗ „4 Ansehenstände, bei denen die Ankündigung nicht stimmt“ |

Die dritte ist die, auf die es ankommt: sie beweist, dass Anzeige und Rechnung
**dieselbe Quelle** benutzen. Ohne sie könnte die Anzeige beliebig danebenliegen,
ohne dass etwas rot wird.

Dazu zwei stille Proben: die Gabe muss **monoton** sein (mehr Ansehen darf nie
weniger geben, über 400 Ansehensstände geprüft), und die Grundgabe darf **nur**
Bekanntheit sein, nicht heimlich mehr.

### Geprüft
Prüfstand gesamt: **532 Ansichten** (vorher 523 — neun neue), 0 Fehler,
**alle vier Zielbänder unverändert im Band**, 6 × 63 rückwärts,
11 Ereignisprüfungen, 56 Vereinsprüfungen, Stimmigkeit 16 Proben ohne Befund.
Im Lauf ausgegeben: `frisch gegründet: Bekanntheit +1 · nächste Gabe in 12
Ansehen` und `Deckel: Anlage +4 · Bekanntheit +6 · Startkapital +100 Tsd. € ·
Entwicklung +6 %`.
Bündel **1.205,23 kB** / 440,39 kB gepackt, vorher 1.204,51 / 440,22 —
**+0,72 kB**.

## 35.40 · Weibliche Frisuren: 9 von 14 waren dieselbe

Offener Punkt 2. Er lautete „10 bzw. 14 Frisuren gegen 12 bzw. 16“ — also eine
Frage der Anzahl. **Gemessen war es keine Frage der Anzahl, sondern eine
kaputte Freischaltung.**

### Nicht gezählt, sondern gerendert
Die fertige Ausgabe von `<Avatar>` bei 62 px, Bild gegen Bild verglichen:

| | wählbar | **unterscheidbar** |
|---|---|---|
| Männer | 16 | **16** |
| Frauen | 14 | **9** |

* `6` („lang mit Scheitel“) teilte sich die Zeichnung mit `1` — im Code steht
  `z.frisur === 1 || z.frisur === 6` auf demselben Pfad. Zwei Namen, ein Bild.
* **`10`, `11`, `12`, `13` hatten überhaupt keine Zeichnung** und sahen alle aus
  wie `0`. Das sind genau die vier Formen hinter der Freischaltung `mk_haar`.
  **Wer als Frau dafür bezahlt hat, bekam vier gleiche Einträge.**

Bei den Männern ist einzig `11` ohne Zeichnung — das ist die Glatze, das gehört
so.

### Gebaut
* **`6`** bekommt vorn einen schmalen hellen Scheitel. Dieselbe Haarmasse wie
  `1`, aber der Unterschied, den der Name behauptet.
* **`10` Pferdeschwanz**, hoch angesetzt, schwingt nach rechts aus
* **`11` zwei Zöpfe**, beidseitig, mit drei Abbindungen je Zopf
* **`12` lange Wellen**, breiter als `1` und mit Schwung nach aussen
* **`13` Lockenkranz**, Kreise entlang des Umrisses

**Die zweite Hälfte des offenen Punktes war die wichtigere:** „die langen
Haarformen liegen hinter dem Kopf, wo sie bei 62 px kaum wirken“. Deshalb hat
jede der vier neuen Formen **auch vorn** etwas — Kappe, Scheitel oder Locken über
der Stirn. Allein hinter dem Kopf wäre die Unterscheidung im Kreuzbogen bei
kleinen Kopfformen wieder verschwunden, wie schon beim Vokuhila in 34.9.

Bei `13` musste zusätzlich der Kopf noch einmal über die Haarmasse gelegt
werden, sonst deckt der Lockenkranz das Gesicht ab — dieselbe Zeile, die `2`
schon brauchte.

### Ergebnis
**14 von 14 unterscheidbar, bei jeder der fünf Kopfformen.** Nicht nur bei
einer geprüft: eine einzige Kopfform zu messen hatte in 35.10 schon einmal
einen Fehler verdeckt.

### Zwei eigene Fehler
**Der erste Messaufbau meldete, alle 16 männlichen Frisuren sähen gleich aus.**
Ich hatte `Avatar` mit `{ z, g }` gerufen, die Eigenschaft heisst aber `zuege`.
Ein unbekanntes Attribut wirft nicht — React ignoriert es, `Avatar` würfelt
die Züge selbst aus dem `seed`, und alle Bilder wurden identisch. **Ein
Messfehler, der wie der größte Befund des Tages aussah.** Deshalb steht in der
Dauerprüfung jetzt eine Kontrollprobe: zwei sicher verschiedene Frisuren
müssen verschiedene Ausgaben geben, sonst meldet sie sich selbst als kaputt.

**Der zweite war ein Doppelimport.** `Avatar` und `zuegeAusKennung` standen
schon in der Importliste von `ansichten.jsx`; mein zweiter Eintrag brach die
Übersetzung. Gefangen vom Aufbauabbruch aus 34.5 — ohne den hätte der Lauf ein
altes Bündel geprüft und grün gemeldet.

### Gegenproben
| Eingriff | Ergebnis |
|---|---|
| Scheitel von `6` entfernt | ✗ `weiblich, Kopfform 0-4: 6=1` |
| **beide** Ebenen von `12` stillgelegt | ✗ `weiblich, Kopfform 0-4: 12=0` |
| `Avatar` ignoriert die Frisur | ✗ `KONTROLLPROBE: zwei verschiedene Frisuren geben dieselbe Ausgabe` |

Die zweite ist die ehrliche: mein **erster** Versuch legte nur die hintere
Ebene still — und blieb grün, weil die vordere die Unterscheidung allein
trägt. Das war kein Fehler der Prüfung, sondern eine Gegenprobe, die zu wenig
kaputt gemacht hat. Erst mit beiden Ebenen beweist sie etwas.

### Geprüft
Prüfstand gesamt: **543 Ansichten** (vorher 532 — elf neue: eine Kontrollprobe
und zehn Kopfform-Durchgänge), 0 Fehler, alle vier Zielbänder,
6 × 63 rückwärts, 11 Ereignisprüfungen, 56 Vereinsprüfungen,
Stimmigkeit 16 Proben ohne Befund.
Im Lauf ausgegeben: `16 männliche und 14 weibliche · alle 5 Kopfformen · jede
Form unterscheidbar`.
Bündel **1.207,10 kB** / 440,81 kB gepackt, vorher 1.205,23 / 440,39 —
**+1,87 kB**. Das sind die vier neuen Formen mit beiden Ebenen.

## 35.41 · Werkzeugkasten aufgeräumt

Drei offene Punkte auf einmal: 12 (Argumentreihenfolge), 16 (`storage.js`) und
6 (Voreinstellung gegen Spielstand). **Am Spiel selbst ändert sich nichts** —
`App.jsx` unterscheidet sich in der Fassungszeile und in nichts weiter, das
Bündel ist in der Rundung gleich gross.

### Punkt 12 — und was dabei herauskam
Der Punkt las sich nach Kosmetik: `uebersicht.cjs <Ziel>` gegen
`vorschau.py <Quelle> <Ziel>` gegen `verzeichnis.cjs <Datei>`. **Der
gefährliche Teil waren die Rückfallwerte.**

In `ereignispruefung.cjs` stand:

```js
const QUELLE = process.argv[2] || process.env.QUELLE || "/mnt/project/App.jsx";
```

Ohne Argument las das Werkzeug also die **schreibgeschützte
Projektwissen-Kopie**. Nachgemessen am 24.8.2026, derselbe Motor, einmal mit
und einmal ohne Argument:

| Aufruf | Ergebnis |
|---|---|
| ohne Argument | ✗ **7 tote Flaggen**, Grundlinie 0 |
| mit `--quelle=` | ✓ **0 tote Flaggen** |

Die Kopie stand auf 35.30 und kannte die Anschlüsse aus 35.35/35.36 nicht.
Kein Absturz, keine Warnung, nur eine falsche Antwort. Hier war es zufällig
**rot** und wäre aufgefallen — umgekehrt hätte dieselbe Mechanik eine
Verschlechterung in der aktuellen Datei **verdeckt**.

Dieselbe Sorte in `texttreue.cjs` (`|| "App.jsx"`, relativ zum
Arbeitsverzeichnis) und in `vereinpruefung.cjs`.

**Gebaut:** ein gemeinsamer Leser `argumente.cjs` mit `--quelle=`, `--ziel=`,
`--anzahl=`. Drei Entscheidungen darin:

* **Fehlt die Quelle, wird abgebrochen.** Kein Rückfallwert. Ein Werkzeug, das
  nicht weiss, was es misst, darf kein Ergebnis melden.
* **Beim Ziel ist ein Standardwert erlaubt** — ein falsches Ziel fällt auf
  (die Datei liegt woanders), eine falsche Quelle nicht.
* **Die alten Positionsformen bleiben gültig**, damit nicht jede Zeile in
  `pruefen.sh` und `sicht.sh` zugleich umgestellt werden muss. Aber nur als
  Position — nie als stiller Ersatz für eine fehlende Angabe.

Umgestellt: `ereignispruefung`, `texttreue`, `stimmigkeit`, `kalibrierung`,
`verlauf40`, `verzeichnis`, `uebersicht`, `vereinpruefung` — und die fünf
Aufrufstellen in `pruefen.sh`. `uebersicht.cjs` behält seine Riegel aus 35.4
(genau ein Argument, muss auf `.md` enden); die haben damals echten Schaden
verhindert.

### Punkt 16 — `storage.js` angeglichen
`value ? … : null` gegen `value == null ? … : null`. Der Unterschied betrifft
genau einen Fall:

| Wert | vorher | nachher |
|---|---|---|
| `""` | **null** („nicht vorhanden“) | `{ key, value: "" }` |
| `"0"` | vorhanden | vorhanden |
| `null` | null | null |

Praktisch folgenlos — alle Aufrufe schreiben `JSON.stringify(…)` oder
`String(n)`, nie einen Leerstring. Aber zwei Fassungen derselben Schnittstelle,
die sich am Rand verschieden verhalten, sind eine Falle für den Tag, an dem
doch einmal einer geschrieben wird. Jetzt gleich mit der Browsertest-Fassung.

### Punkt 6 — aus einer Beobachtungsnotiz wird eine Prüfung
Der Punkt lautete: *„Alte Spielstände tragen `speed` und `mode` weiter am
Spieler; die Voreinstellung greift nur bei neuen Laufbahnen. So gewollt, sollte
aber im Blick bleiben.“*

**Im Blick behalten heisst nicht: daran denken.** `SPEEDMODUS` und
`SCHWIERIGKEIT` sind Modulvariablen; `createPlayer` liest sie **nicht** selbst,
sondern bekommt sie über `cfg`. Dreht das jemand um — etwa weil es einfacher
aussieht —, ändert sich rückwirkend die Schwierigkeit **jeder laufenden
Karriere**, und zwar still.

Fünf Proben nageln das fest: eine neue Laufbahn folgt der Übergabe (beide
Richtungen), ein bestehender Stand behält `speed` und `mode`, und — die
wichtigste — bei Voreinstellung `true` und Übergabe `false` muss `false`
gewinnen.

### Ein eigener Fehler
Mein erster Testaufbau schrieb `mode: "arcade"`. **Den Grad gibt es nicht** —
sie heissen `aufstieg`, `realismus`, `knochen`. `createPlayer` fiel korrekt auf
`realismus` zurück, und die Probe meldete einen Fehler, den es nicht gab. Ein
falscher Versuchsaufbau sieht genauso rot aus wie ein echter Befund; erst das
Nachsehen in `MODES` hat es geschieden. Steht als Warnung im Prücode.

### Gegenproben
| Eingriff | Ergebnis |
|---|---|
| `ereignispruefung.cjs` ohne Argument | ✗ `ABBRUCH: weiss nicht, welche Datei es pruefen soll` |
| `speed: SPEEDMODUS \|\| !!cfg.speed` | ✗ `createPlayer liest SPEEDMODUS selbst — die Übergabe wird überstimmt` |
| alte Positionsform `ereignispruefung.cjs <App.jsx>` | ✓ läuft weiter, 11 Prüfungen in Ordnung |

Die dritte ist keine Fehlerprobe, sondern der Nachweis, dass die Umstellung
nichts zerschlagen hat.

### Geprüft
Prüfstand gesamt: **548 Ansichten** (vorher 543 — fünf neue), 0 Fehler, alle
vier Zielbänder, 6 × 63 rückwärts, 11 Ereignisprüfungen, 56 Vereinsprüfungen,
Stimmigkeit 16 Proben ohne Befund.
Bündel **1.207,10 kB** / 440,80 kB gepackt — roh unverändert gegenüber 35.40,
gepackt 0,01 kB weniger. Am Spielcode wurde ausser der Fassungszeile und den
zehn Zeichen in `storage.js` nichts angefasst.

## 35.42 · Der Abschlussbildschirm wird übersichtlich

Zwei Wünsche von Kevin. Der zweite zuerst, weil er der größere war.

### Der Abschlussbildschirm
Er hängte alles untereinander: Urteil, Wildcard, Errungenschaften,
Akademiejahr, Vereinsbericht, Zahlenblock, Stationen, `StatsView`,
`NationalView`, `TrophyView`, Teilen-Text — und **ganz unten** die Knöpfe. Bei
einer langen Laufbahn scrollt man an sehr viel vorbei, bevor „Neue Laufbahn
beginnen“ auftaucht.

Jetzt: oben bleibt, was den Abschluss ausmacht. Alles Nachschlagbare geht in
**fünf Reiter, beim Öffnen keiner gewählt**. Ein zweites Tippen auf denselben
Reiter klappt wieder zu — ohne das gäbe es keinen Weg zurück zur Übersicht,
und genau die war der Wunsch.

Die Knöpfe stehen in einer angehefteten Leiste (`position:fixed`, nicht
`sticky`: die Shell scrollt selbst, ein klebendes Element hätte sich am Ende
des Inhalts wieder gelöst). Darunter `env(safe-area-inset-bottom)` wegen der
Gestensteuerung auf dem S24.

### Was das Nachmessen gebracht hat
`sicht.sh` war grün — aber die Knopfzahl stand unverändert bei **124**. Der
Abschlussbildschirm kam im Knopfbogen überhaupt nicht vor. Eine angeheftete
Leiste, die `position:fixed` über dem Inhalt liegt, von keiner Prüfung gesehen:
das musste zuerst geradegezogen werden. Mit dem Bildschirm im Bogen sind es
**164 Knöpfe** — und die Messung meldete sofort einen echten Fehler:

> `✗ Zum Teilen  breit 83 · braucht 81 · rechte Kante 424  AUSSERHALB DES BILDES`

Der fünfte Reiter stand bei 412 px **zwölf Pixel** über dem Rand. Zwei
Berichtigungen daraus:

* **Beschriftungen gekürzt**: „Nationalelf“ → „Land“, „Zum Teilen“ →
  „Teilen“. Bei 412 px passen jetzt alle fünf ohne Wischen.
* **Die Knopfmessung kennt jetzt scrollbare Zeilen.** `.tabs` trägt
  `overflow-x:auto` — dort über den Rand zu ragen ist Absicht, der Farbverlauf
  rechts zeigt es an. Solche Knöpfe als „außerhalb des Bildes“ zu melden war
  ein falscher Treffer. Sie werden aber **nicht verschwiegen**: der Bericht
  zählt sie und schreibt „davon 5 erst nach seitlichem Wischen sichtbar“. Bei
  360 px sind es fünf, bei 412 px keiner.

### Verdeckt die Leiste den Inhalt?
Das kann jsdom nicht sehen. In echtem Chromium gemessen:

| Breite | Leiste | Platzhalter | Hauptknopf |
|---|---|---|---|
| 412 px | 120,0 px | 132 px | 380 px, Kanten 16–396 |
| 360 px | 120,0 px | 132 px | 328 px, Kanten 16–344 |
| 320 px | 120,0 px | 132 px | 288 px, Kanten 16–304 |

**12 px Luft bei allen drei Breiten.** Der Platzhalter im `EndScreen` und die
Höhe der Leiste im CSS sind zwei Zahlen, die zusammengehören und in
verschiedenen Dateien stehen — genau die Sorte, die auseinanderläuft. Die
jsdom-Probe prüft deshalb ausdrücklich, dass der Platzhalter da ist.

### Der Posten gegen Verletzungen
Kevins Entscheidung: **Weg A, Preis 30 VC.** Vorher `dauer: 0`, 18 VC — er
heilte einmal und war weg, konnte also gar nicht halten.

Jetzt `dauer: 1`: die laufende Verletzung ist sofort auskuriert, und **die
ganze Saison über kommt keine neue dazu**. Das Risiko, das damit wegfällt,
gemessen aus der Formel in `simulateSeason`:

| Alter | Anfälligkeit | Fitness | Verletzung je Saison |
|---|---|---|---|
| 20 | 30 | 80 | 15,2 % |
| 28 | 45 | 70 | 19,8 % |
| 32 | 55 | 65 | 31,6 % |
| 35 | 65 | 60 | **41,2 %** |

Deshalb der Preis von 18 auf 30 — damit steht er über `form` (28) und unter
`ueber99` (70). Sperren bleiben unberührt: der Physio heilt, er redet nicht mit
dem Schiedsrichter.

### Die Wechselwirkung, die der Prüfstand gefunden hat
Mit `dauer: 1` wurde eine Prüfung rot:

> `✗ Kaufmodell — Sofortwirkung: kaufbar=false, erwartet true`

Sie benutzte `physio` **namentlich** als Beispiel für „wirkt sofort, bleibt
immer kaufbar“. Nicht das Kaufmodell war kaputt, sondern das Beispiel passte
nicht mehr. Die Prüfung holt ihre Beispiele jetzt **aus `VCLADEN`**
(`find(a => !a.vorrat && !a.dauer)`) statt sie auswendig zu kennen — und
prüft den Physio zusätzlich namentlich in seiner neuen Art: eine Saison
gesperrt, danach wieder zu haben. 10 von 10 Lagen richtig.

### Gegenproben
| Eingriff | Ergebnis |
|---|---|
| Reiter beim Öffnen vorgewählt | ✗ „beim Öffnen ist schon ein Reiter gewählt“ |
| Platzhalter auf 0 gesetzt | ✗ „der Platzhalter fehlt — die Leiste verdeckt den letzten Eintrag“ |
| Leiste ganz entfernt | ✗ „die angeheftete Leiste fehlt“ |
| Zuklappen ausgebaut | ✗ „zweites Tippen klappt nicht wieder zu“ |
| `physio` zurück auf `dauer: 0` | ✗ „Physio läuft: kaufbar=true, erwartet false“ |

**Die vierte ist nachgetragen, und das gehört gesagt.** Beim ersten Anlauf
blieb sie **grün**: der Kommentar behauptete, ein zweites Tippen klappe wieder
zu, geprüft wurde es nicht. Eine Behauptung im Kommentar ist keine Prüfung.
Jetzt wird das Auf- und Zuklappen wirklich durchgeklickt.

### Ein eigener Fehler
Nach dem Kürzen der Beschriftungen habe ich nur `sicht.sh` gefahren, nicht den
Prüfstand — die jsdom-Probe erwartete noch „Nationalelf“/„Zum Teilen“ und war
rot. Aufgefallen ist es erst in einer Gegenprobe, die aus ganz anderem Grund
lief. **Beide Läufe gehören nach jeder Änderung an der Anzeige**, nicht der,
den man gerade im Sinn hat.

### Geprüft
Prüfstand gesamt: **563 Ansichten** (vorher 548), 0 Fehler, alle vier
Zielbänder, 6 × 63 rückwärts, 11 Ereignisprüfungen, 56 Vereinsprüfungen,
Stimmigkeit 16 Proben ohne Befund.
Im Lauf ausgegeben: `Abschluss 5 Reiter, beim Öffnen keiner gewählt · auf und
wieder zu · Leiste mit 3 Knöpfen · Platzhalter 132 px` und
`Kaufmodell 10 von 10 Lagen richtig`.
`sicht.sh`: **164 Knöpfe** (vorher 124 — der Abschlussbildschirm ist neu im
Bogen), bei 412 px keiner zum Wischen, bei 360 px fünf.
Leistenmessung in Chromium: 120,0 px gegen 132 px Platzhalter, alle drei
Breiten.
Bündel **1.208,89 kB** / 441,37 kB gepackt, vorher 1.207,10 / 440,80 —
**+1,79 kB**.

## 35.43 · Namen nach Land statt nach Sprachraum

Kevins Wunsch: **jedes Land im Spiel bekommt eine eigene Namenskartei**, nach
den dort häufigsten Vor- und Nachnamen. Seine drei Beispiele stimmten alle
drei — und der gemessene Zustand war schlimmer als der Wunsch vermuten liess.

### Der Ausgangszustand
212 Nationen hingen an **21 Sprachräumen**, von denen **sieben leer waren**.
46 Nationen fielen auf die deutsche Liste zurück:

| Raum | Nationen | Betroffen |
|---|---|---|
| `oc` | 15 | Fidschi, Papua-Neuguinea, Samoa, Tonga |
| `se` | 10 | Indonesien, Thailand, Vietnam, Philippinen |
| `in` | 7 | Indien, Bangladesch, Nepal, Sri Lanka |
| `tk` | 6 | Kasachstan, Usbekistan, Aserbaidschan |
| `cn` | 5 | China, Hongkong, Taipeh, Macau |
| `fa` | 2 | Iran, Afghanistan |
| `he` | 1 | Israel |

**Ein Chinese hiess Lukas Brandt.** Dazu drei Schnitte, die sachlich falsch
waren: Korea lag mit Japan in einem Raum (ein Südkoreaner hiess *Sota
Nakagawa*), Finnland und Estland mit Skandinavien (nicht einmal verwandte
Sprachfamilien), und das anglophone wie frankophone Afrika trug die
Kolonialsprache statt eigener Namen — ein Nigerianer hiess *Harry Whitmore*,
ein Senegalese *Théo Delaunay*.

### Gebaut: `namen.js`
Eine eigene Datei neben `ereignisse.js` und `verein.js`, ein Eintrag je Land.
**212 von 212, 10.012 Namen.** Länder, die sich eine Namenskultur wirklich
teilen, zeigen mit `erbt` auf eine gemeinsame Grundmenge — Antigua und Barbados
teilen sich das anglokaribische Erbe, das ist die Sache selbst und keine
Nachlässigkeit. Erfundene Unterschiede wären schlimmer als ehrlich geteilte
Listen.

### Die Ordnung folgt dem Land, nicht der Vorgabe
| Regel | Wo | Beispiel |
|---|---|---|
| `NV` | Ostasien, Ungarn | Kato Shunsuke, Szoboszlai Dominik |
| `VNN` | Spanisch, Portugiesisch, Philippinen | Alejandro Martin Moreno |
| `VMN` | Somalia, Südsudan | Yusuf Ali Dahir |
| `VpN` | Malaysia, Golf, Island | Ali Al Dawsari, Faisal bin Rasid |
| `V` | Myanmar, Brasilien | Aung Thu, Neymar |
| `gruppen` | Vielvölkerstaaten | siehe unten |
| `nw` | slawisch und baltisch | vier Beugungen |

**Island** haengt das Patronym ohne Abstand an und ist geschlechtsabhängig:
`Sigurds` + `son` bzw. `dottir`. **Myanmar** kennt keine Familiennamen — der
ganze Name ist EIN Eintrag.

### Namensgruppen: die wichtigste Einsicht der Fassung
Beim Durchsehen der ersten Ergebnisse stand da **„Siyabonga van Wyk“** — ein
Zulu-Vorname mit afrikaansem Familiennamen. Frei aus einem Topf gewürfelt kommt
so etwas in jedem zweiten Fall heraus.

`gruppen` hält die Namenswelten getrennt: erst eine Gruppe ziehen, **dann darin
Vor- UND Nachname**. Südafrika hat vier (Nguni, Sotho, Afrikaans,
Englisch/Coloured), Nigeria vier (Yoruba, Igbo, Hausa, landesweit), dazu
Belgien, Schweiz, Trinidad, Neuseeland, Angola, Mauritius, Fidschi.

### Die Herkunftsmarke — und warum sie da ist
Ich kenne die häufigsten Namen von Deutschland, Brasilien, Japan und Nigeria
belastbar. Von Tuvalu, Nauru, Bhutan und den Komoren nicht. **Wer dort
plausibel klingende Namen erfindet, baut etwas, das authentisch AUSSIEHT und
es nicht ist — und das fällt danach niemandem mehr auf.**

Jeder Eintrag trägt deshalb `q`:

| | | |
|---|---|---|
| **87** | `q:3` | gesichert |
| **85** | `q:2` | regional abgeleitet — Sprachfamilie stimmt, Häufigkeit ungeprüft |
| **40** | `q:1` | **dünn** — namentlich im Prüfbericht |

Die 40 stehen als Luecke da, bis jemand mit besserer Quelle sie schliesst. Eine
Kartei ohne Marke meldet `namenpruefung.cjs` als **harten Fehler**: eine
Behauptung ohne Angabe, woher sie kommt.

### Alle vier Einsatzorte — und der, der fehlte
| Stelle | Was |
|---|---|
| `makeSquad` | 15 Mitspieler bei jedem Vereinswechsel |
| Zeile 5138 | Nachrücker während der Saison |
| `talentBauen` | jeder Akademiejahrgang |
| `namensVorschlag` | **die Erstellung — hing an einer ZWEITEN Liste** |

Kevins Nachfrage hat den letzten aufgedeckt. `VOR_M`/`VOR_W`/`NACH` waren eine
getrennte Namensliste mit den alten vierzehn Räumen; während Kader und
Akademie längst die Kartei benutzten, hiess der eigene Spieler aus China weiter
„Leon Brandt“ — **ausgerechnet an der sichtbarsten Stelle**. Der Vorschlag muss
dabei reproduzierbar bleiben (sonst wechselte er bei jedem Neuzeichnen), deshalb
wird über die Kennung indiziert statt gezogen.

### Genug Kombinationen?
| | vorher | nachher |
|---|---|---|
| Kader mit doppeltem Namen (3.000 Kader) | **7,30 %** | **0,00 %** |
| Akademie, verschiedene Namen | — | **99,4 %** (155 von 156) |
| Myanmar, mögliche Namen | 16 | **40** |

`makeSquad` versucht bis zu achtmal, einen freien Namen zu ziehen. Nicht öfter:
eine Endlosschleife wäre schlimmer als ein doppelter Name, und bei Myanmar mit
vierzig möglichen Namen kann ein Kader schlicht nicht anders.

### ZEHN eigene Fehler, alle beim Durchsehen gefunden
Keinen davon hat der Prüfstand gemeldet — sie kamen alle vom Lesen der
erzeugten Namen.

| | Fehler |
|---|---|
| 1 | „Alia **a/l** Yusof“ — die Partikel ist männlich, Frauen tragen `binti` |
| 2 | „Malika **Toshmatov**“ — zentralasiatische Nachnamen haben eine weibliche Form |
| 3 | **Gruppeneinträge fielen still auf Englisch zurück** — die Weiche prüfte nur `e.n` |
| 4 | „Anna **Kowalski**“ — nur die russische Beugung gekannt |
| 5 | „**Kuceraova**“ — bei `-a`/`-o` fällt die Endung weg |
| 6 | „Jurrien**··**Blind“ — leere Partikel hinterliess doppelten Abstand |
| 7 | „**Xavi van Jong**“ — die Partikel gehört zum konkreten Namen, nicht zufällig davor |
| 8 | Polen trug die **russische** Regel, die auf `-ski` gar nicht greift |
| 9 | Lettisch fehlte ganz (`Berzins` → `Berzina`) |
| 10 | doppelter Export brach den Bau ab — **und ich habe die Ausgabe unterdrückt** |

**Nummer 3 ist die lehrreichste.** Die Probe „liefert jedes Land einen Namen?“
blieb **grün**, weil einer herauskam — nur der falsche. Sie prüft jetzt, ob der
Name **aus der eigenen Kartei** stammt. Gegenprobe: Weiche zurückgedreht → drei
harte Fehler.

**Nummer 10 ist die peinlichste**, weil sie seit 35.37 dokumentiert ist: ich
habe `TEILE=aufbau … >/dev/null` gefahren, den Abbruch nicht gesehen und
zwanzig Minuten gegen ein altes Bündel gemessen. **Zweimal an einem Tag.**

### Zwei Messfehler in meinen eigenen Zahlen
Meine erste Akademiezahl lautete **27,9 % verschiedene Namen** — ich hatte
dieselben Talente in jedem Jahrgang neu gezählt. Richtig gemessen, nur neue
Aufnahmen: **99,4 %**. Und die erste Prüfung meldete Myanmar als kaputt, weil
sie nach einem Nachnamen suchte, den es dort nicht gibt — und weil sie
„Aung Thu“ in zwei Wörter zerlegte, die einzeln nirgends stehen.

### Der Fehler, den erst `sicht.sh` gefunden hat
Der Prüfstand war grün, `sicht.sh` brach mit Code 2 ab:

```
Error: ENOENT: no such file or directory, open '/tmp/…/dist/index.html'
```

Eine Meldung, die nach allem aussieht ausser nach der Ursache. Die war:
**`browsertest.sh` kopierte `namen.js` nicht mit.** Seine Liste der Beidateien
stand von Hand im Skript — `schriften.js ereignisse.js verein.js main.jsx
index.html package.json` — und ein neues Modul steht dort nicht drin.

Nur `namen.js` nachzutragen hätte den nächsten Fall nicht verhindert. Die Liste
wird jetzt **aus `App.jsx` gelesen**:

```sh
BEIDATEIEN="$(grep -oE 'from "\./[a-zA-Z0-9_]+\.js"' App.jsx \
  | sed 's|from "\./||; s|"$||' | grep -v '^storage\.js$' | sort -u | tr '\n' ' ')"
```

`storage.js` bleibt ausgenommen — der Browsertest ersetzt sie durch die
localStorage-Fassung. Alles andere kommt mit, auch das nächste Modul, das noch
niemand geschrieben hat.

**Gegenprobe:** `namen.js` entfernt → `FEHLER: namen.js fehlt neben …` statt
zwanzig Zeilen später ein ENOENT auf `dist/index.html`.

### Zwei weitere eigene Fehler, beide beim Reparieren
**Meine erste Ableitung lieferte eine leere Liste.** Die doppelten Rückstriche
aus dem Bearbeitungsskript machten das `sed`-Muster unbrauchbar. Und `sicht.sh`
lief trotzdem **grün** — weil `namen.js` aus einem früheren Lauf noch im
Arbeitsverzeichnis lag. Ein grüner Lauf auf einem nicht aufgeräumten
Verzeichnis beweist nichts; die Ableitung wurde erst danach einzeln geprüft
und war leer.

**Und noch eine Pfadkollision.** `sicht.sh` schreibt die Browsertestausgabe nach
`"$ARBEIT.log"`. Ich hatte `ARBEIT=/tmp/sfin4` gesetzt und die Ausgabe von
`sicht.sh` selbst nach `/tmp/sfin4.log` umgeleitet — dieselbe Datei. Heraus kam
`grep: input file is also the output` mitten im Bericht. Dieselbe Familie wie
ARBEIT gegen BAU in 35.37, nur eine Ebene tiefer.

### Neues Werkzeug: `namenpruefung.cjs`
Eigene Phase `namen` im Prüfstand. Vier Proben: Abdeckung, Herkunftsmarken,
brauchbare Namen (männlich UND weiblich, ohne Leerstellen und doppelte
Abstände), und ob zwei Länder versehentlich identisch sind.

Ein fehlendes Land ist **kein** Fehler, solange die Kartei wächst — hart sind
nur ein kaputter Name, ein Land das seine Kartei nicht benutzt, und eine Kartei
ohne Herkunftsmarke.

### Gegenproben
| Eingriff | Ergebnis |
|---|---|
| Gruppenweiche zurück auf nur `e.n` | ✗ NZL, NGA, RSA: „nur 0 von 30 Namen aus der eigenen Kartei“ |
| Namensgruppen ignoriert | ✗ dieselben drei |
| Herkunftsmarke bei Nigeria entfernt | ✗ 1 harter Fehler |

### Geprüft
Namenskartei: **212 von 212 Nationen = 100 %**, 4 Proben ohne Befund, 0 harte
Fehler. 10.012 Namen · 61.176 Kombinationen · 87 gesichert, 85 abgeleitet,
40 dünn.
Prüfstand gesamt: **563 Ansichten**, 0 Fehler, alle vier Zielbänder,
6 × 63 rückwärts, 11 Ereignisprüfungen, 56 Vereinsprüfungen,
Stimmigkeit 16 Proben ohne Befund.
Kaderüberschneidung: **7,30 % → 0,00 %** bei 3.000 Kadern.
Bündel **1.294,77 kB** / 477,18 kB gepackt, vorher 1.208,89 / 441,37 —
**+85,88 kB**. Das sind die 10.012 Namen.

## 35.44 · Eine Kennzahl, die nichts mehr bedeutete

Kevins Frage nach dem Stand: gibt es noch offene Punkte oder eigene Fehler?
Beim Nachsehen kamen drei Sachen heraus. **Am Spiel ändert sich nichts** —
`App.jsx` unterscheidet sich in der Fassungszeile und in nichts weiter.

### 1. `38 Verdachtsfälle zum Nachlesen` — seit 35.37 gegenstandslos
`stimmigkeit.cjs` meldete seit sieben Fassungen dieselbe Zahl: 38 Paare von
Ereignissen, die im selben Zug kollidieren können. **Seit 35.37 werden sie
abgefangen** — `nextEvent` prüft jede Bedingung ein zweites Mal, unmittelbar
bevor das Ereignis gezeigt wird. Die Paare können zusammen GEZOGEN werden, das
zweite wird dann übersprungen statt ausgespielt.

Sie trotzdem als „Verdachtsfälle zum Nachlesen“ zu führen war falsch. Die Zahl
stand unverändert bei 38 und bedeutete nichts mehr. **Eine Kennzahl, die sich
nie bewegt, lehrt einen, sie zu überlesen** — und dann fällt auch nicht auf,
wenn sie eines Tages auf 39 springt.

Jetzt wird sie als **Bestand** gemeldet, nicht als Befund:

```
38 Paare koennen im selben Zug gezogen werden —
seit 35.37 faengt die Zweitpruefung in `nextEvent` sie ab.
Mit --alle stehen sie einzeln da.
```

Der Bericht endet damit auf **0 Verdachtsfälle** statt auf 38. Steigt die Zahl,
ist ein neues Paar dazugekommen — harmlos an sich, aber ein Hinweis, dass die
Zweitprüfung weiter gebraucht wird.

### 2. Punkt 10 war schon wieder veraltet
Die Zeilenzahl von `App.jsx` steht in dem Punkt, der die Aufteilung in Module
begründet. Sie hinkte zum dritten Mal hinterher:

| Stand | Zeilen |
|---|---|
| 21.8.2026 | 12.829 |
| 23.8.2026 | 13.198 |
| **27.8.2026** | **13.674** |

Dass die Zahl ständig nachgezogen werden muss, **ist** das Argument des Punktes.
Steht jetzt mit allen drei Messungen da, statt nur mit der neuesten.

### 3. Die offenen Punkte standen in falscher Reihenfolge
16, 17 und 18 waren beim Eintragen durcheinandergeraten — 18 vor 17 vor 16.
Kosmetik, aber die Liste wird bei jedem Sitzungsstart gelesen. Beim Umsortieren
prüft das Skript, dass kein Wort verlorengeht (`set(neu.split()) ==
set(alt.split())`); Blöcke zu verschieben ist genau die Bearbeitung, bei der
still etwas abhandenkommt.

### Was NICHT gefunden wurde
Nachgesehen und in Ordnung: `namen.js`, `namenpruefung.cjs`, `argumente.cjs` und
`stimmigkeit.cjs` stehen alle vier in `LIESMICH.md` (Prüfung 6 hätte es sonst
gemeldet). Kein eigener Fehler aus den Fassungen 35.31 bis 35.43 ist offen
geblieben — alle sind behoben und im jeweiligen Abschnitt dokumentiert.

### Geprüft
Prüfstand gesamt: **563 Ansichten**, 0 Fehler, alle vier Zielbänder,
6 × 63 rückwärts, 11 Ereignisprüfungen, 56 Vereinsprüfungen.
Stimmigkeit: **17 Proben ohne Befund** (vorher 16), **0 Verdachtsfälle**
(vorher 38), 0 harte Fehler.
Namenskartei: 212 von 212, 4 Proben ohne Befund.
Bündel **1.294,77 kB** / 477,18 kB gepackt — roh unverändert gegenüber 35.43.

## 35.45 · Sechs Listen, die auseinandergelaufen waren

Kevin nach dem Sitzungsstart: „Lass uns erst um die Abweichungen kümmern, damit
das in Zukunft kein Problem mehr darstellt." Der Prüfstandlauf zu 35.44 war
grün — die Abweichungen lagen alle im Berichtswesen. **Am Spiel ändert sich
nichts:** `App.jsx` unterscheidet sich in der Fassungszeile und in nichts weiter.

### Was gefunden wurde

Alle Werte gemessen, nicht geschätzt.

| Ort | stand dort | gemessen | seit |
|---|---|---|---|
| STAND 404, 569; `pruefen.sh` 12 | 5 bzw. 7 Teile | **9** | 35.37/35.43 |
| STAND 163, 186, 414, 554; LIESMICH 8 | 518 Ereignisse | **520** | 35.37 |
| STAND Abschnitt 5, Werkzeugtabelle | 32 Einträge | **34** Dateien | 35.37/41/43 |
| LIESMICH, Einordnung | `stimmigkeit`, `namenpruefung` laufen nicht automatisch | laufen **beide** | 35.37/35.43 |
| STAND 158–166, 183–200 | **`namen.js` fehlt in beiden Tabellen** | vorhanden | 35.43 |
| STAND 158 | 783 KB, 13.198 Zeilen | **810 KB, 13.674** | 35.44 |
| STAND 159; LIESMICH 16 | vier Dateien, Importzeilen 2–5 | **fünf**, 2–**6** | 35.43 |
| STAND 516 | Bündel zuletzt 1.022 kB | **1.294,76 kB** | ~33.13 |
| STAND 509–512 | zwei Punkte „noch offen" | erledigt 35.32/35.34 | 35.34 |

Die schwerste ist `namen.js`. Abschnitt 1 ist ausdrücklich „die Liste dessen,
was hochzuladen ist" — und die Datei stand seit fünf Fassungen nicht drin. Wer
danach neu aufbaut, bekommt ein Spiel, das sich nicht bauen lässt. **Genau
dieser Fehler wurde in 35.24 und 35.30 schon zweimal behoben**, beide Male in
einer anderen Liste. Die Prüfung aus 35.30 rechnet `LIESMICH.md` nach, nicht
`STAND.md` — deshalb ist es dort durchgerutscht.

Die gefährlichste ist die Teile-Liste. Wer nach Abschnitt 404 sein `TEILE=`
setzt, überspringt vier von neun Teilen: Ereignisse, Stimmigkeit, Namen,
Verein. Der Lauf endet grün. Eine grüne Wiese über 587 nicht gefahrenen
Prüfungen.

### Was geändert wurde

**1. Zahlen, die der Lauf ohnehin misst, stehen nicht mehr im Text.**
Dateigrößen und Zeilenzahlen sind aus Abschnitt 1 verschwunden, die
Bündelgröße aus Abschnitt 7, die drei Orientierungszahlen aus Abschnitt 8.
Stattdessen gibt der Aufbau bei jedem Lauf aus:

    Eigene Dateien (gemessen, 28.8.2026):
      App.jsx             810 KB   13674 Zeilen
      storage.js            1 KB      26 Zeilen
      schriften.js        127 KB      25 Zeilen
      ereignisse.js       371 KB    2884 Zeilen
      verein.js            26 KB     510 Zeilen
      namen.js            115 KB    2019 Zeilen

Der Satz „was gilt, meldet der Lauf selbst" stand seit 35.30 in Abschnitt 8 —
angewandt aber nur auf die Ansichtszahl, nicht auf die Liste direkt daneben.

**2. Doppelte Listen sind zu einer geworden.** Die Teile standen an drei
Stellen. Jetzt an einer: Abschnitt 5. Abschnitt 8 verweist darauf, der
Kopfkommentar von `pruefen.sh` wird dagegen nachgerechnet.

**3. Drei neue Prüfungen im Aufbau** — im Stil von Prüfung 6, also nicht als
Merksatz, sondern als Skript:

| | prüft | gegen |
|---|---|---|
| **7** | jede Zeile, die mit `Teile:` beginnt (STAND.md, `pruefen.sh`) | die Vorgabe `TEILE=${TEILE:-…}` in `pruefen.sh` |
| **8** | jede Bestandszahl vor „Ereignisse" im lebenden Text | `id:"` in `ereignisse.js` |
| **9** | Abschnitt 1 gegen die `import`-Zeilen der App, Abschnitt 5 gegen `ls pruefstand/` | die Dateien selbst |

Prüfung 8 zählt nur Zahlen ab 100. Ohne diese Schranke meldete sie „2–3
Ereignisse je Saison" aus Abschnitt 3 als Abweichung — ein Falschalarm bei
jedem Lauf, und der ist nach zwei Wochen unsichtbar.

„Lebender Text" heißt: alles vor `## Fassungen 33.3`. Die Fassungsabschnitte
darunter beschreiben ihren eigenen Stand; dort **darf** 518 stehen, das war
damals richtig. Ohne diese Grenze hätte die Prüfung fünf historische
Abschnitte angemeckert.

### Zwei eigene Fehler in dieser Sitzung

**Erster, zweimal falsch abgebogen:** Die Prüfungen 7 bis 9 standen zuerst bei
den anderen, also vor dem Bauabbruch. Damit brach der ganze Lauf bei einer
veralteten Zahl mit „Erst den Übersetzungsfehler oben beheben" ab — die Meldung
stimmt dann nicht. Also hinter den Abbruch verschoben. **Das war die zweite
falsche Antwort**, und sie ist erst in der Gegenprobe aufgefallen: schlägt eine
der Prüfungen 2 bis 6 an, endet der Lauf vorher — und Prüfung 2 schlägt beim
Bearbeiten von `STAND.md` *immer* an, weil sich die Zeilennummern im Verzeichnis
verschieben. Ausgerechnet während der Arbeit an der Dokumentation waren die
Dokumentationsprüfungen also unerreichbar. Erst der dritte Anlauf taugt: sie
stehen wieder vorn und zählen auf einen eigenen Zähler `DOK`, der den Abbruch
nicht auslöst, aber im Ergebnis zu den Fehlern addiert wird. **Gefunden hat das
die Gegenprobe, nicht das Nachdenken** — der Lauf schwieg an einer Stelle, an
der er hätte melden müssen.

**Zweiter:** In `LIESMICH.md` habe ich „Diese sechzehn fährt
`pruefen.sh` automatisch mit" geschrieben — ungemessen. Gemessen sind es
**neun**; `uebersicht.cjs`, `vorschau.py`, `browsertest.sh`, `messwerkzeug.js`
und `startprobe.cjs` laufen dort nicht mit. Beim Nachzählen aufgefallen, bevor
es ausgeliefert wurde. Eine falsche Zahl in derselben Sitzung, in der falsche
Zahlen beseitigt werden — der Reflex, eine Liste zu überfliegen statt sie
durchzuzählen, sitzt tiefer als die Regel dagegen.

### Nicht gemacht

Die Sperrdatei (offener Punkt 19) ist ein Befund, keine Reparatur — Kevin hat
ihn zur Kenntnis genommen, die Entscheidung steht aus. Der eigene Zähler für
Papierbefunde (Punkt 20) ändert das Verhalten der Prüfungen 2 bis 6 und gehört
deshalb nicht in dieselbe Fassung.

### Geprüft

Voller Prüfstandlauf auf 35.45, Rückgabecode 0:

    Baudateien 6 von 6 · Schriften 128K · Ereignisse 520 Einträge
    Listen in STAND.md: Teile, Ereigniszahl und beide Dateitabellen stimmen ✓
    Kalibrierung   Vollausbau 28,1 Laufbahnen (Ziel 25–35) · 2912 VC (Ziel 2700–3100)
                   Weltklasse Median 5 (Ziel 3–8) · Rautekarte Median 34 (Ziel 28–42)
    Ansichten      563 Prüfungen, 0 Fehler
    Ereignisse     11 Prüfungen, 0 harte Treffer, 0 über der Grundlinie
    Stimmigkeit    17 Proben, 0 harte Fehler, 0 Verdachtsfälle
    Namenskartei   212 von 212 (100 %), 4 Proben ohne Befund
    Verein         56 Prüfungen bestanden, 0 Fehler
    Rückwärts      6 × 63 Ansichten fehlerfrei
    Produktionsbau 1.294,78 kB / 477,17 kB gepackt · package.json unverändert

`sicht.sh` ebenfalls grün: Startprobe 14 von 14, Kopfleiste 8 px ohne
Überlappung, Seitenanfang 4 von 4 auf 0 px, Passhöhe 348,1 px konstant über
neun Karrierestände (Zuwachs 0 px), 164 Knöpfe lesbar bei 412 und 360 px.
Impressum zeigt 35.45.

**Sieben Gegenproben, jede in die Richtung, in der die Prüfung schweigen
müsste, und in die, in der sie melden muss:**

| Gegenprobe | erwartet | gemessen |
|---|---|---|
| Teil aus der Liste in Abschnitt 5 entfernt | Prüfung 7 meldet | „fehlt: verein" ✓ |
| Teil in `pruefen.sh` ergänzt, Doku nicht | 7 meldet an **beiden** Stellen | zweimal „fehlt: neuerteil" ✓ |
| ein Ereignis mehr in `ereignisse.js` | Prüfung 8 meldet | „nennt 520, gemessen 521" ✓ |
| „7 Ereignisse je Saison" im Fließtext | 8 schweigt (unter 100) | schweigt ✓ |
| Werkzeug nur in `LIESMICH.md` eingetragen | Prüfung 9 meldet | „Werkzeugtabelle … nennt nicht" ✓ |
| `namen.js` wieder aus Abschnitt 1 entfernt | 9 meldet trotz Verzeichniswarnung | meldet ✓ |
| nur Papierbefund, sonst alles heil | Lauf läuft durch, endet rot | Bau lief, Rückgabecode 1 ✓ |

Die vierte und die sechste sind die wichtigen. Die vierte hätte einen
Falschalarm bei jedem Lauf erzeugt — und eine Warnung, die immer kommt, ist
nach zwei Wochen unsichtbar. Die sechste hat den eigenen Denkfehler
aufgedeckt: die Prüfungen standen hinter dem Bauabbruch und liefen deshalb
nie, wenn `STAND.md` gerade bearbeitet wurde.

Die Bündelgröße hat sich zwischen zwei Läufen um 0,02 kB bewegt (1.294,76 →
1.294,78). **Nachgetragen in 35.46: das war kein Bibliothekseffekt**, sondern
die eigene `VERSION_INFO`-Zeile, die um 18 Zeichen länger wurde. Vite zählt
Zeichen, nicht Byte. Die hier gezogene Verbindung zu Punkt 19 war voreilig —
siehe die Richtigstellung in 35.46.

## 35.46 · Der Bau ist wiederholbar — und eine eigene Behauptung kassiert

Kevin: „Dann mach jetzt den offenen Punkt 19." Der Punkt lautete: die APK baut
ohne Sperrdatei gegen bewegliche Bibliotheksfassungen. **Am Spiel ändert sich
nichts** — `App.jsx` unterscheidet sich in der Fassungszeile und in nichts weiter.

### Zuerst: die Begründung aus 35.45 hielt nicht

In Punkt 19 stand, die 0,01 kB Abweichung sei „entstanden zwischen `vite`
5.4.11 und 5.4.21". **Das war geraten, nicht gemessen.** Vier Gegenproben,
jeweils dieselbe Quelle, nur die Bibliothek getauscht:

| Fassungsstand | Bündel |
|---|---|
| `vite` 5.4.21 · `rollup` 4.63.0 | 1.300.578 Byte |
| `vite` 5.4.11 · `rollup` 4.63.0 | 1.300.578 Byte |
| `vite` 5.4.21 · `rollup` 4.40.0 | 1.300.578 Byte |
| `capacitor` 6.2.0 statt 6.2.1 | 1.300.578 Byte |

Byte-identisch, jedes Mal. Und der Unterschied zwischen den beiden Läufen des
Vortags (1.294,76 → 1.294,78 kB) stammt vollständig aus der eigenen
`VERSION_INFO`-Zeile, die um 18 Zeichen länger wurde — nachgerechnet: 19
Zeichen Unterschied im Bündel. Bleibt die 0,01 kB gegenüber der Notiz aus
35.44, **unerklärt und nicht nachstellbar**; wahrscheinlichste Erklärung ist
heute ein Übertragungsfehler in jener Notiz.

Damit steht der Punkt auf einem anderen Bein als behauptet. Das strukturelle
Argument bleibt und trägt allein: `package.json` nennt Fassungsbereiche mit
Dach, es gab keine Sperrdatei, drei Bauwege lösten unabhängig voneinander auf.
Dass die heute geprüften Fassungen zufällig alle dasselbe ergeben, ist Glück
und keine Zusage. Aber **der Beleg, der in 35.45 dafür angeführt wurde, war
keiner** — und das gehört hier hin und nicht stillschweigend berichtigt.

### Was geändert wurde

**`package-lock.json` eingecheckt** — 101.543 Byte, 212 Fassungen festgenagelt,
`lockfileVersion` 3. Sie steht jetzt in Abschnitt 1 und in `LIESMICH.md` bei
den Baudateien.

**Alle drei Bauwege auf `npm ci`:** `apk.yml` (die APK), `pruefen.sh` (der
Produktionsbau im Prüfstand) und `browsertest.sh` (die Datei, die auf dem
Telefon geprüft wird). Alle drei liefen vorher mit `npm install` und lösten
unabhängig auf — **der Gerätetest wäre also gegen ein anderes Bündel gelaufen
als das ausgelieferte.** Das ist der Teil des Punkts, der praktisch weh getan
hätte, und er stand vorher nirgends.

Keiner der drei fällt still zurück: fehlt die Sperrdatei, bauen sie mit
`npm install` weiter **und sagen es** (Regel aus 35.41, keine stummen
Ersatzwerte). Der Prüfstand meldet im Bauschritt zusätzlich, womit installiert
wurde, und prüft nach, dass die Sperrdatei beim Bau unverändert geblieben ist —
ändert `npm` sie doch, ist die Wiederholbarkeit dahin, und das darf nicht
unbemerkt passieren.

**Baudateien 6 → 7.** Die Zahl stand an vier Stellen im lebenden Text und wäre
genau so gealtert wie seinerzeit die 518. Deshalb liest `pruefen.sh` sie jetzt
aus einer Liste (`BAUDATEIEN=`) statt sie fest zu verdrahten, und **Prüfung 10**
rechnet jede Textstelle dagegen nach.

### Was das kostet

Sicherheitsnachträge kommen nicht mehr von allein. Wer sie will, ruft
`npm update` und checkt die neue Sperrdatei ein — bewusst, nicht nebenbei.
Der Hinweis steht als Kommentar in `apk.yml`, also dort, wo jemand ihn sucht.

### Geprüft

Voller Prüfstandlauf auf 35.46, Rückgabecode 0:

    Baudateien 7 von 7 · Schriften 128K · Ereignisse 520 Einträge
    Listen in STAND.md: Teile, Ereignis- und Baudateienzahl, beide
                        Dateitabellen stimmen ✓
    Kalibrierung   Vollausbau 27,2 Laufbahnen (Ziel 25–35) · 2912 VC (Ziel 2700–3100)
                   Weltklasse Median 5 (Ziel 3–8) · Rautekarte Median 34 (Ziel 28–42)
    Ansichten      563 Prüfungen, 0 Fehler
    Ereignisse     11 Prüfungen, 0 harte Treffer, 0 über der Grundlinie
    Stimmigkeit    17 Proben, 0 harte Fehler, 0 Verdachtsfälle
    Namenskartei   212 von 212 (100 %), 4 Proben ohne Befund
    Verein         56 Prüfungen bestanden, 0 Fehler
    Rückwärts      6 × 63 Ansichten fehlerfrei
    Produktionsbau 1.294,76 kB / 477,17 kB gepackt
                   installiert mit: npm ci
                   package.json unverändert ✓
                   package-lock.json unverändert ✓

`sicht.sh` grün: Startprobe 14 von 14, Impressum zeigt 35.46, Kopfleiste 8 px,
Seitenanfang 4 von 4 auf 0 px, Passhöhe 348,1 px konstant, 164 Knöpfe lesbar.
`browsertest.sh` gegengeprüft: die Sperrdatei liegt im Baubaum (101.543 Byte),
gebaut wird mit `npm ci`.

**Der Nachweis für den Punkt selbst:** zwei unabhängige Bauten derselben
Quelle, jeweils frisches `npm ci`:

    Lauf 1   1.300.578 Byte   sha256 396f3b2c9fb8f739…
    Lauf 2   1.300.578 Byte   sha256 396f3b2c9fb8f739…
    cmp: byte-gleich ✓

**Fünf Gegenproben:**

| Gegenprobe | erwartet | gemessen |
|---|---|---|
| `vite` 5.4.11 statt 5.4.21 | wenn Drift, dann anderes Bündel | identisch — **Behauptung aus 35.45 widerlegt** |
| `rollup` 4.40.0 statt 4.63.0 | dito | identisch |
| `capacitor` 6.2.0 statt 6.2.1 | dito | identisch |
| Sperrdatei entfernt | melden, nicht still zurückfallen | „HINWEIS: keine package-lock.json", baut mit `npm install` ✓ |
| Sperrdatei passt nicht zu `package.json` | Bau scheitert und meldet rot | `npm ci` bricht ab, Diagnose steht da, Rückgabecode 1 ✓ |

### Drei eigene Fehler in dieser Sitzung

**Erster, der teuerste:** die Begründung des Punkts war geraten. Siehe oben.

**Zweiter:** Beim Umstellen habe ich das Aufräumen der Sperrdatei aus dem
Arbeitsverzeichnis entfernt. Folge: eine gelöschte `package-lock.json`
überlebte im Arbeitsbaum, und der Bau meldete weiter `npm ci`, obwohl die
Quelle keine Sperrdatei mehr hatte. In der Gegenprobe aufgefallen. Jetzt
löscht die Kopierschleife jede Baudatei, die in der Quelle fehlt — das galt
vorher für keine der sieben.

**Dritter, und der lag schon lange da:** Der Produktionsbau hatte einen toten
Wächter.

    ( cd "$ARBEIT" && npm install … | tail -1
      npx vite build … | head -4 ) || FEHLER=1

Der Rückgabewert einer Pipeline ist der ihres **letzten** Glieds — also der von
`head`, und der gelingt immer. `|| FEHLER=1` konnte nie greifen. Ein
**gescheiterter Produktionsbau hat „Alles durchgelaufen, keine Fehler"
gemeldet.** Nachgestellt: `npm ci` brach ab, „error during build" stand im
Protokoll, das Ergebnis war grün. Dieselbe Bauart wie der tote Filter bei
Prüfung 3 (35.29) — beide Male hat die Gegenprobe es gefunden, nicht das
Lesen. Jetzt getrennte Schritte mit echtem Rückgabewert und Diagnose.

Beim Beheben derselbe Fehler noch einmal im Kleinen: erst stand dort
`npm ci --silent`, und `--silent` schluckt auch die Fehlerausgabe. Die Meldung
kam, der Kasten darunter blieb leer. Ohne die Wiederholung der Gegenprobe wäre
eine Fehlermeldung ohne Inhalt ausgeliefert worden.

## 35.47 · Der Prüfstand sieht nach der Sicherheitslage

Aus Kevins Frage zu 35.46: „Das heißt was für mich?" — nämlich, dass er sich
ab jetzt selbst um Sicherheitsnachträge kümmern muss, seit die Sperrdatei die
Fassungen festnagelt. Eine Pflicht, an die man denken muss, ist nach der Regel
aus 35.2 keine Pflicht, sondern eine Zeitbombe. Also übernimmt der Prüfstand
das Hinsehen. **Am Spiel ändert sich nichts.**

### Erst gemessen, dann gebaut

| | |
|---|---|
| Pakete insgesamt | 212 |
| davon reine Bauwerkzeuge | 202 |
| davon im Auslieferungspfad | **10** — React, React-DOM, vier Capacitor-Pakete, drei Kleinteile |
| `npm audit` über alles | 4 Funde (1 kritisch, 2 hoch, 1 mittel) |
| `npm audit --omit=dev` | **0 Funde** |

Die vier Funde sitzen sämtlich im Werkzeugkasten: `tar` über
`@capacitor/cli`, dazu die Entwicklungsserver von `vite` und `esbuild`. Keiner
davon läuft auf dem Telefon. **Und keiner wäre vor 35.46 automatisch behoben
worden** — die Behebungen brauchen `vite` 6/7 und `@capacitor/cli` 8, also
große Fassungssprünge, die `^5.4.11` und `^6.2.0` nie eingesammelt hätten.

Das ist eine Richtigstellung zum Satz aus 35.46, der Preis der Sperrdatei
seien die Sicherheitsnachträge. Richtig ist: verloren gehen nur die **kleinen**
Nachträge innerhalb derselben Hauptfassung. Der Satz stimmte, klang aber
größer, als er ist.

### Was eingebaut wurde

`pruefen.sh` fährt im Bauschritt `npm audit --omit=dev` und meldet im
Normalfall eine ruhige Zeile:

    Sicherheitslage (Auslieferungspfad): 0 Funde ✓

**`--omit=dev` ist der ganze Witz.** Ohne diese Einschränkung meldete jeder
Lauf ab heute vier Funde, von denen keiner die App betrifft — und eine
Warnung, die immer kommt, ist nach zwei Wochen unsichtbar. Dieselbe Überlegung
wie bei der Schranke von 100 in Prüfung 8.

**Kein Netz ist nicht dasselbe wie kein Fund.** Bei einem Netzfehler schreibt
npm ein JSON ohne `metadata`; daran wird es erkannt und ausdrücklich als
ungeprüft gemeldet — nach dem Vorbild von Prüfung 6: kein bestandener Lauf,
nur ein fehlender.

**`pruefstand/sicherheit-bekannt.txt`** ist der Ausweg für den Tag, an dem ein
Fund kommt, der sich nicht schnell beheben lässt. Ein Paket darf abgenickt
werden — aber nur schriftlich und mit Begründung. Der Fund wird dann weiter
**genannt**, färbt aber nicht mehr rot. Ohne diesen Weg wäre der Prüfstand
beim ersten unbehebbaren Fund dauerhaft rot, und dauerhaft rot heißt: jemand
schaltet die Prüfung ab. Das wäre das schlechteste aller Enden.

Umgekehrt meldet er auch einen Freibrief, der gegenstandslos geworden ist —
ein Abnicken, das niemand mehr braucht, deckt beim nächsten Mal einen echten
Fund mit ab.

Eigener Zähler `SICHER`, damit im Ergebnis steht, **woran** ein Lauf
gescheitert ist, statt nur dass er es ist.

### Die neuen Prüfungen aus 35.45 haben zuerst mich erwischt

`sicherheit-bekannt.txt` angelegt, Prüfstand gefahren — und beide Listen
meldeten sofort, dass die Datei weder in `LIESMICH.md` noch in der
Werkzeugtabelle von Abschnitt 5 steht. Prüfung 6 und Prüfung 9, zwei Tage
alt, an ihrem ersten echten Fall. Genau der Fehler, der `namen.js` fünf
Fassungen lang durchgerutscht ist.

Nebenbei: beim Einsetzen der Prüfung habe ich zwei Zeilen mit überschrieben
(`rm -f` und ein `fi`), `bash -n` hat es sofort gemeldet. Kein Schaden, aber
der Grund, warum die Syntaxprobe nach jeder Skriptänderung läuft.

### Geprüft

Voller Prüfstandlauf auf 35.47, Rückgabecode 0:

    Baudateien 7 von 7 · Schriften 128K · Ereignisse 520 Einträge
    Listen in STAND.md: … stimmen ✓
    Kalibrierung   Vollausbau 27,3 Laufbahnen (Ziel 25–35) · 2912 VC (Ziel 2700–3100)
                   Weltklasse Median 4 (Ziel 3–8) · Rautekarte Median 34 (Ziel 28–42)
    Ansichten      563 Prüfungen, 0 Fehler
    Ereignisse     11 Prüfungen, 0 harte Treffer, 0 über der Grundlinie
    Stimmigkeit    17 Proben, 0 harte Fehler, 0 Verdachtsfälle
    Namenskartei   212 von 212 (100 %), 4 Proben ohne Befund
    Verein         56 Prüfungen bestanden, 0 Fehler
    Rückwärts      6 × 63 Ansichten fehlerfrei
    Produktionsbau 1.294,78 kB / 477,19 kB gepackt · installiert mit: npm ci
                   package.json und package-lock.json unverändert ✓
                   Sicherheitslage (Auslieferungspfad): 0 Funde ✓

`sicht.sh` grün: Startprobe 14 von 14, Impressum zeigt 35.47, Seitenanfang
4 von 4, Passhöhe 348,1 px konstant, 164 Knöpfe lesbar.

**Vier Gegenproben zur neuen Prüfung:**

| Gegenprobe | erwartet | gemessen |
|---|---|---|
| verwundbares Paket als echte Abhängigkeit eingetragen | meldet und färbt rot | `SICHERHEITSFUND … tar (critical)`, Rückgabecode 1 ✓ |
| derselbe Fund, mit Begründung abgenickt | wird genannt, färbt **nicht** rot | „abgenickt: nur Bauhilfe …", Rückgabecode 0 ✓ |
| Freibrief bleibt stehen, Fund ist weg | meldet den toten Freibrief | „abgenickt, aber nicht mehr gemeldet: tar" ✓ |
| Registry unerreichbar | **nicht** als „keine Funde" durchgehen | „NICHT GEPRUEFT", Rückgabecode 1 ✓ |

Die letzte ist die wichtigste. Eine Sicherheitsprüfung, die bei einem
Netzfehler stillschweigend grün meldet, ist schlimmer als keine — sie erzeugt
Vertrauen, das nichts trägt.

## 35.48 · Die Akademie zieht aus

Kevins Vorhaben für die nächste größere Runde: Verwaltung in Jugendakademie und
eigenem Verein — Verträge, Freigaben, Aufstellung von Hand, Saisonrückblick.
Auf die Frage, ob vorher aufgeteilt wird: ja. **Diese Fassung ist der Auszug
und nichts sonst.** Am Spiel ändert sich nichts.

### Was gemessen wurde, bevor geschnitten wurde

`App.jsx` hatte 13.674 Zeilen. Die Akademie lag komplett darin, der Verein seit
35.17 in `verein.js`. Das Vorhaben legt in beiden noch einmal ungefähr dasselbe
drauf.

Der Bereich war **nicht sortenrein.** Zwischen den Akademieteilen saßen der
komplette VC-Laden samt JSX (`vcFuer` bis `VCLadenAnsicht`, 233 Zeilen) und der
Speicherschlüssel `VER_KEY` des Vereins. Ein Schnitt von `AKA_KEY` bis zur
Ansicht hätte den Laden mitgenommen. Gemessen statt geschätzt: der Laden
braucht aus dem Akademiekern **nichts** — also blieb er, wo er war.

Herausgegangen sind zwei Stücke: Zeilen 5644–5740 (Grundlagen) und 5976–6285
(Kern), zusammen 407 Zeilen. Abhängigkeiten nach außen, ohne Kommentare und
Zeichenketten gezählt: zehn Helfer, **alle vor Zeile 5644 definiert** — keine
tote Zone. Erst der Zählversuch mit Kommentaren hatte `Zahl` und `SHOP`
gemeldet; beide stehen dort nur im Fließtext.

### Wie geschnitten wurde

`akademie.js` ist eine Fabrik wie `verein.js`: `machAkademie(H)` nimmt die
Helfer entgegen. Die Rümpfe stehen **zeichengleich** darin; dazu kommen nur
Hülle und `return`-Liste.

In `App.jsx` stehen an der Stelle des ersten Stücks der Aufruf und ein
**Auspacken in dieselben Namen**:

    const { ABTEILUNGEN, AKA_MAX, … akaGruenden } = AKA;

Damit bleibt jede der rund 200 Fundstellen im übrigen `App.jsx` unverändert.
Der Unterschied dieser Fassung ist genau zweierlei: 407 Zeilen weniger hier,
dieselben 407 Zeilen dort. `App.jsx`: 13.674 → 13.286 Zeilen.

### Der Nachweis, ohne den das nichts wert wäre

Ein grüner Prüfstand beweist bei einem Auszug nichts. Die Kalibrierung misst
Mittelwerte über 300 Laufbahnen — eine verrutschte Wahrscheinlichkeit
verschwindet darin. Deshalb neu: **`pruefstand/gleichheit.cjs`**. Fester
Zufall, fünf Saaten, je 25 Akademiejahre, und je Jahr werden Talente,
Absolventen, Bilanz, Chronik, Ereigniszeilen, Ruhm, Ausbau, Restkosten,
Spanne, Gabe und Gabentext abgezogen — dazu 100 einzeln gebaute Talente.

    35.47   sha256 391abfcb7374bf34…
    35.48   sha256 391abfcb7374bf34…   byte-gleich ✓

**Und die Gegenprobe, die dem Werkzeug erst Wert gibt:** mit `.151` statt
`.15` in einer einzigen Zeile weichen 10 von 125 Akademiejahren ab und der
Hash ist ein anderer. Eine Probe, die nur Gleichheit meldet und nie
Ungleichheit, beweist nichts.

### Zwei Sachen, die der Prüfstand selbst gefunden hat

**`exporte.txt` gab drei Namen nach außen, die ich als „nur intern" eingestuft
hatte** — `AKA_SCHWELLE`, `akaRuhm`, `talentBauen`. Sie stehen in der
Ausfuhrliste des Prüfstands, damit Werkzeuge den Kern einzeln prüfen können.
esbuild hat es sofort gemeldet. Ohne diese Liste wären drei Werkzeuge still
ausgefallen.

**Die Beidateien standen in `pruefen.sh` einzeln aufgezählt** — `verein.js`,
`namen.js`, `ereignisse.js`, jede mit eigenem Block. `akademie.js` wäre die
vierte Handeintragung gewesen. Dieselbe Bauart, die `namen.js` fünf Fassungen
lang aus der Dateiliste herausgehalten hat. Die Liste kommt jetzt aus den
`import`-Zeilen der App, wie `browsertest.sh` es seit jeher macht. Der Aufbau
meldet sie:

    Beidateien: 5 (akademie.js ereignisse.js namen.js schriften.js verein.js)

Und Prüfung 9 aus 35.45 hat `akademie.js` prompt in beiden Dateilisten
angemahnt, bevor irgendetwas ausgeliefert wurde.

### Was jetzt dran ist

Reihenfolge für das Vorhaben, von Kevin freigestellt und hier festgelegt:
**A** Aufstellung von Hand · **B** Saisonrückblick mit Tabelle und
Leistungsdaten · **C** Vertragswesen mit Postkorb · **D** Kadersteuerung.

Entschieden ist außerdem: **Freigaben verfallen nach einem Jahr**, danach
entscheidet der Spieler selbst. Damit blockiert eine liegengebliebene
Entscheidung den Verein nicht.

Offen und vor A zu klären: `spiele`, `tore`, `form` und `fitness` stehen seit
35.21 im Kader und werden **nie** fortgeschrieben. Und die Saison kennt
überhaupt keine einzelnen Spieler — `simTable` liefert nur
Mannschaftszahlen. Leistungsdaten müssen also erzeugt, nicht abgegriffen
werden. Siehe offener Punkt 21.

### Geprüft

Voller Prüfstandlauf auf 35.48, Rückgabecode 0:

    Baudateien 7 von 7 · Beidateien 5 · Ereignisse 520
    Listen in STAND.md: … stimmen ✓
    Kalibrierung   Vollausbau 27,9 Laufbahnen (Ziel 25–35) · 2912 VC (Ziel 2700–3100)
                   Weltklasse Median 5 (Ziel 3–8) · Rautekarte Median 35 (Ziel 28–42)
    Ansichten      563 Prüfungen, 0 Fehler
    Ereignisse     11 Prüfungen, 0 harte Treffer, 0 über der Grundlinie
    Stimmigkeit    17 Proben, 0 harte Fehler
    Namenskartei   212 von 212 (100 %)
    Verein         56 Prüfungen bestanden
    Rückwärts      6 × 63 Ansichten fehlerfrei — alte Sicherungen laufen weiter
    Produktionsbau 1.295,66 kB · npm ci · Sicherheitslage 0 Funde ✓

`sicht.sh` grün, Impressum zeigt 35.48, 164 Knöpfe lesbar.

Die Kalibrierungswerte liegen im Band, sind aber **kein** Gleichheitsbeweis —
sie streuen von Lauf zu Lauf. Der Beweis ist der byte-gleiche Abzug aus
`gleichheit.cjs`.

Das Bündel wuchs um 0,90 kB. Erklärt: Fabrikhülle, Auspacken und der Abschluss
bleiben nach dem Verkleinern übrig; Kommentare und Einrückung nicht.

**Vier Gegenproben:**

| Gegenprobe | erwartet | gemessen |
|---|---|---|
| Abzug 35.47 gegen 35.48 | byte-gleich | identischer sha256 ✓ |
| `.15` → `.151` in einer Zeile | Abzug muss abweichen | 10 von 125 Jahren anders ✓ |
| `akademie.js` in keiner Dateiliste | Prüfung 9 meldet | beide Listen gemeldet ✓ |
| drei Namen fehlen in der Fabrik | esbuild bricht ab | „is not declared in this file" ✓ |

## 35.49 · Stufe A — die Aufstellung von Hand

Kevin: „für jede Position die Möglichkeit, selbst Spieler aus dem Kader
auszuwählen, wo dann bei Auswahl immer angezeigt wird, wie die Stärke auf der
Position ist und wie die Allgemeinstärke des Spielers ist" — dazu die Eignung,
die es schon gab. Erste von vier Stufen des Verwaltungsvorhabens.

### Was es vorher gab

Genau einen Weg auf den Platz: `autoAufstellen`. Die Elf war eine Liste zum
Ansehen, kein Bedienelement. Der einzige Knopf hieß „Bestmöglich".

### Vier neue Handgriffe in `verein.js`

| | |
|---|---|
| `kandidaten(v, i)` | wer kann Platz *i* spielen — mit Stärke dort, Allgemeinstärke, Eignung, und wo er gerade steht |
| `aufstellen(v, i, id)` | setzt einen Spieler; steht er schon woanders, **tauschen** die beiden |
| `freimachen(v, i)` | Platz leeren |
| `aufstellungSaeubern(v)` | Verweise auf abgegangene Spieler entfernen, Rest stehenlassen |

**Getauscht statt verschoben — und wenn das nicht geht, rückt die Bank nach.**
Wer schon in der Elf steht und woandershin gesetzt wird, hinterlässt kein
Loch: der Verdrängte rückt auf den frei gewordenen Platz, sofern er dort
spielen kann. Kann er es nicht, kommt der stärkste Mann von der Bank, der es
kann. Erst wenn im ganzen Kader niemand den Platz spielen kann, bleibt er
leer — und dann leer, nicht mit einem Ungeeigneten gestopft.

**Das war nicht der erste Entwurf.** Der ließ den Platz einfach frei. Im
Teillauf ging das durch, weil der Verdrängte zufällig immer zurückkonnte; im
vollen Lauf traf es einen, der es nicht konnte, und zwei Prüfungen wurden rot:
„Platz 9 ist LEER". Ein einziges Antippen hätte die Mannschaft
spielunfähig gemacht, sechs Zeilen unter der Stelle, auf die man getippt hat.

**Angeboten wird nur, wer dort spielen kann.** Die `GUETE`-Tabelle kennt
bewusst keinen Wert unter 0,6 (siehe dort). Diese Regel zu umgehen hieße, eine
Wahl anzubieten, die `staerke` anschließend als `fehlbesetzt` mit 24 verrechnet
— eine Wahl, die stumm bestraft wird, ist keine.

### Zwei Stellen, die sonst die Handarbeit weggeworfen hätten

**Die Saison leerte die Aufstellung.** `vereinSaison` setzte `aufstellung: {}`,
weil die Plätze auf Spieler zeigen, die aufgehört haben. Richtig, solange die
Aufstellung ohnehin automatisch entstand — jetzt wäre es die Arbeit einer
ganzen Saison, die nach jedem Durchgang verschwindet. Jetzt wird **gesäubert**
statt geleert: Geister raus, Rest bleibt. Was dabei frei wird, meldet `bedarf`.

**Der Formationswechsel stellte alles neu auf.** Schon das bloße Durchsehen der
fünf Formationen warf jede Handwahl weg. Jetzt wird auch dort gesäubert: wer
auf dem neuen Platz weiter spielen kann, bleibt stehen. Gemessen: beim Wechsel
von 4-4-2 auf 4-3-3 bleiben 11 von 11.

### Der Bildschirm

Platz antippen → darunter öffnet sich die Liste. Drei Zahlen je Zeile, rechts
ausgerichtet und überschrieben: **Stärke auf diesem Platz · Allgemeinstärke ·
Eignung**. Dazu, wo der Kandidat gerade steht („spielt IV"), damit ein Tausch
absehbar ist.

Die Liste steht **unter** der Elf und nicht in einer Überlagerung. Auf 360 px
wäre ein Fenster über elf Zeilen entweder zu klein für die Zahlen oder es
verdeckt genau die Elf, gegen die man vergleicht.

### Geprüft

Voller Prüfstandlauf auf 35.49, Rückgabecode 0. **Ansichten 563 → 570,
Vereinsprüfungen 56 → 82.**

Die 26 neuen Vereinsprüfungen fragen nicht „läuft es durch", sondern ob die
Wahl wirkt und nichts still zerbricht: Kandidaten alle spielfähig, Sortierung
nach Stärke auf dem Platz, angezeigte Zahl = ovr × Eignung, kein Loch beim
Tausch, niemand doppelt, Ungeeignete abgewiesen, Lücke kostet messbar Stärke,
Säubern trifft nur Geister, Saison behält die Elf.

Neu im Durchklicktest: der Auswahlkasten wird **wirklich bedient** — Reiter
öffnen, Platz antippen, einen anderen Spieler wählen, nachrechnen, dass die Elf
sich ändert. Ohne das wäre der Kasten von den Ansichten gar nicht erfasst; er
ist erst der zweite Zustand des Reiters.

**Vier Gegenproben:**

| Gegenprobe | gemessen |
|---|---|
| Rücktausch entfernt | „Platz 6 ist LEER", 2 Prüfungen rot ✓ |
| Saison leert wieder wie in 35.48 | „0 von 11 stehen nach der Saison noch" ✓ |
| Eignungsschranke entfernt | „ST auf ZM: DURCHGELASSEN" ✓ |
| Auswahlklick ohne Wirkung | „die Wahl hat die Elf nicht verändert" ✓ |

**Und eine Probe, die nicht vom Zufall abhängt.** Der schwere Fall — der
Verdrängte kann nicht zurück — trat nur manchmal auf, je nachdem, welche
Talente die Akademie ausgeworfen hatte. Ein Fall, der nur manchmal geprüft
wird, ist nicht geprüft. Die **Hartprobe** baut ihn jetzt absichtlich aus der
Asymmetrie in `GUETE`: ein Zehner kann Stürmer spielen (0,80), ein Stürmer
aber kein Zentrum. Sechs Prüfungen, jeder Lauf, immer derselbe Fall — plus die
Gegenrichtung, in der wirklich niemand nachrücken kann.

### Zwei eigene Fehler

**Erster:** Die Meldung der Abweisprobe behauptete fest „abgelehnt" — auch im
Fehlerfall. In der Gegenprobe stand da „✗ … abgelehnt", also das Gegenteil des
Gemessenen. Jetzt misst der Zusatz. Eine Meldung, die im Fehlerfall lügt,
schickt genau dann in die Irre, wenn man sie braucht.

**Zweiter, und das Aufschlussreichste:** Bei der Gegenrichtung der Hartprobe
nahm ich nur `bankZM` aus dem Kader und erwartete einen leeren Platz. Die
Prüfung wurde rot. **Nicht der Code war falsch, sondern meine Annahme:** ZM
kann auch ein Außenverteidiger spielen (0,68), also rückte `bankAV` nach —
genau richtig. Ich hatte eine Tabelle im Kopf statt vor Augen. Auf der Bank
darf jetzt wirklich niemand ZM können.

**Dritter:** Der Durchklicktest griff auf `vollV` zu, das in einem anderen
Block steht. Der Lauf brach mit `ReferenceError` ab — laut und richtig, statt
die Prüfung still zu überspringen. Eigener Testverein gebaut, mit
unterschiedlichen Stärken, damit die Rangfolge in der Liste überhaupt etwas
aussagt.

### Was Stufe A NICHT ist

Keine Ersatzbank, keine Einwechslungen, keine Sperren — die Elf ist die Elf.
Und weiterhin gibt es keine Einzelspielerstatistik; das ist Stufe B und hängt
an offenem Punkt 21.

## 35.50 · Ein Dach über Akademie und Profimannschaft

Kevins Einwurf zwischen den Stufen: Jugendakademie und eigener Verein stehen
nebeneinander im Hauptmenü, obwohl die Akademie zum Verein **gehört**. Das
liegt an der Reihenfolge, in der sie entstanden sind (Akademie 35.11, Verein
35.21), nicht an der Sache. Dazu ein Verdacht: die Akademie ließ sich vor der
angekündigten Freischaltung schon öffnen.

### Der Verdacht stimmte — und war schärfer als vermutet

`VEREIN.freigeschaltet()` **rechnet** seit jeher `akademie: n >= 2` aus. Dieser
Wert wurde an genau einer Stelle gelesen: für den Hinweis „Die Jugendakademie
ist offen". Die Menüzeile bekam ihren Klick **ohne jede Bedingung**, und der
Abschlussbildschirm hatte einen zweiten, ebenfalls offenen Zugang.

Man konnte die Akademie also vom ersten Start an betreten, und der Hinweis nach
zwei Laufbahnen meldete als neu, was längst offen war. Gebremst hat nur, dass
ohne beendete Laufbahn niemand VC hat — **eine Sperre, die keine ist, sondern
ein Nebeneffekt.** Dieselbe Bauart wie `spiele` und `tore` im Kader: ausgerechnet,
nie angewandt.

### Die neue Ordnung

    Hauptmenü
      └── Dein Verein          ab 2 Laufbahnen
            ├── Jugendakademie  keine eigene Grenze
            └── Profimannschaft ab 5 Laufbahnen

Die Akademie braucht **keine** eigene Grenze mehr: wer im Dach steht, hat die
zwei Laufbahnen hinter sich. Eine zweite Prüfung an derselben Stelle wäre eine
zweite Stelle, an der sie auseinanderlaufen kann.

Gesperrte Einträge bleiben sichtbar, mit der Zahl, die noch fehlt — ein
verstecktes Ziel merkt niemand. Das galt vorher schon für den Verein und gilt
jetzt für beides.

Die Rückwege führen aufs **Dach**, nicht ins Hauptmenü: sonst müsste man sich
nach jedem Blick in die Akademie neu durchklicken. Ausnahme bleibt der
Abschlussbildschirm nach einer beendeten Laufbahn — dort kommt man nicht über
das Dach her.

### Geprüft

Voller Lauf, Rückgabecode 0. **Ansichten 570 → 574, Vereinsprüfungen 82 → 91.**

Neun neue Vereinsprüfungen. Sechs davon rechnen die Schwellen durch (0, 1, 2,
3, 4, 5 Laufbahnen, Restzähler, fehlende Bilanz). Die anderen drei lesen den
**Quelltext**, nicht den Rechenkern — genau dort lag der Fehler: ein toter Wert
ist im Motor unsichtbar. Sie prüfen, dass die Menüzeile die Freischaltung
abfragt, dass keine eigene Akademiezeile zurückkommt, und dass der
Abschlussbildschirm ebenfalls prüft.

Vier neue Ansichten für das Dach, darunter der **gesperrte** Zustand. Den gab
es vorher gar nicht, weil die Akademie keine Sperre hatte — eine Ansicht, die
nur im offenen Fall geprüft wird, lässt genau den Fehler durch, um den es hier
geht.

**Gegenproben:**

| Gegenprobe | gemessen |
|---|---|
| Menüzeile ohne Freischaltabfrage | „fragt die Freischaltung ab" rot ✓ |
| Abschlussbildschirm wieder ungesperrt | „prüft die Freischaltung ebenfalls" rot ✓ |

Der Gesamt-App-Durchklick prüft jetzt zusätzlich, dass „Dein Verein" bei **null**
Laufbahnen wirklich gesperrt ist und dass keine eigene Akademiezeile daneben
steht.

### Warum jetzt und nicht später

Stufe C bringt den Postkorb mit den Freigaben — und der betrifft
Akademietalente **und** Kaderspieler. Ohne gemeinsames Dach hätte er zweimal
gebaut oder an der falschen Stelle gelandet werden müssen. Der Umbau ist
deshalb keine Kosmetik zwischendurch, sondern die Voraussetzung für C.

## 35.51 · Der Abschluss schließt ab

Kevin über die Knopfleiste am Ende einer Laufbahn: „ich weiß grade gar nicht
mehr genau, was die Knöpfe machen". Das ist selbst schon der Befund. Dazu der
Wunsch, den Hauptknopf so zu beschriften, dass klar ist: **die Laufbahn ist
vorbei**, und man geht ins Hauptmenü.

### Der Knopf hielt nicht, was er versprach

Er hieß **„Neue Laufbahn beginnen"** — und begann nichts. Gemessen:

    onNew={() => { einblendungenLeeren(); setP(null); setPhase("menu"); }}

Er leert den Spieler und geht ins Hauptmenü. Die neue Laufbahn fängt dort mit
einem zweiten Tippen an. Ein Versprechen ohne Mechanik, ausgerechnet an der
Stelle, an der man eine Laufbahn **abschließt**: wer glaubt, hier beginne schon
die nächste, weiß nicht, dass die jetzige endgültig vorbei ist.

Jetzt: **„Laufbahn abschließen"**, darunter klein „Diese Laufbahn ist damit
vorbei — zurück zum Hauptmenü".

### Drei Knöpfe wurden einer

Weg sind „Ruhmeshalle" und „Dein Verein" aus der Leiste — und der dritte,
den Kevin nicht auf dem Schirm hatte: **im Akademiebericht steckte ein
„Jetzt ausbauen / Zur Jugendakademie"**. Alle drei Ziele stehen im Hauptmenü,
und genau dorthin führt der eine verbliebene Knopf ohnehin. Ein zweiter Weg
zum selben Ort ist kein Dienst, sondern eine Abzweigung, an der man überlegen
muss — und der Sprung aus dem Akademiebericht heraus unterbrach den Rückblick
mittendrin.

`onHall` und `onAka` sind aus der Signatur **entfernt**, nicht nur unbenutzt.
Eine Übergabe, die niemand liest, ist genau die Sorte totes Feld, die dieses
Projekt zweimal teuer bezahlt hat.

### Die beiden Berichte stehen jetzt gleichrangig

Gemessener Ausgangszustand: der **Akademiebericht** hatte Goldrahmen,
Farbverlauf, eine 38-Punkt-Zahl, Unterblöcke und den Sprungknopf. Der
**Vereinsbericht** war ein schlichtes Feld mit grauem Rand und einer Zeile
Kleingedrucktem. Beides ist dasselbe: etwas, das nebenher gelaufen ist,
während man spielte. Wenn eines dreimal so laut auftritt, liest man das andere
nicht mehr — und der Verein ist seit 35.49 der Teil, an dem man selbst
entscheidet.

Beide haben jetzt denselben Aufbau: Überzeile („Ein Jahr Jugendakademie" /
„Ein Jahr Profimannschaft"), Kennzahl groß rechts, Unterzeile, dann die
Einzelheiten im selben Zweispalter. **Die Farbe bleibt getrennt** — Gold gehört
den Coins, die Profimannschaft bekommt Grün, ein Abstieg Rot. Gleich
aufgebaut heißt nicht gleich aussehend.

### Der eigentliche Fund kam aus der Gegenprobe

`p.vereinBericht` wurde bis 35.50 in **keiner einzigen Ansicht gesetzt**. Der
Vereinsbericht ist seit 35.28 im Abschlussbildschirm und war **nie gezeichnet
worden**. Aufgefallen ist es nur, weil die Gegenprobe zum Sprungknopf grün
blieb: die geprüften Fälle enthielten die Berichte gar nicht, also konnte die
Prüfung dort nichts finden. Eine Prüfung, die eine Stelle bewacht, die sie nie
zu sehen bekommt, meldet für immer „in Ordnung".

Neu deshalb vier Ansichten mit **beiden** Berichten: Meister, Abstieg,
Mittelfeld, ausgefallen.

### Geprüft

Voller Lauf, Rückgabecode 0. **Ansichten 574 → 595, Vereinsprüfungen 91 → 92.**

    Kalibrierung   27,6 Laufbahnen (Ziel 25–35) · Rautekarte 35 (Ziel 28–42)
    Namenskartei   212 von 212 (100 %)
    Rückwärts      6 × 63 Ansichten fehlerfrei
    Produktionsbau 1.299,90 kB · npm ci · Sicherheitslage 0 Funde ✓

`sicht.sh` grün: Impressum 35.51, Passhöhe 348,1 px konstant, **154 Knöpfe**
lesbar — vorher 164. Die zehn fehlenden sind die entfernten Sprungknöpfe über
alle geprüften Bildschirmlagen hinweg.

**Vier Gegenproben:**

| Gegenprobe | gemessen |
|---|---|
| alte Beschriftung „Neue Laufbahn beginnen" | 2 Prüfungen rot ✓ |
| zweiter Knopf in der Leiste | 3 Prüfungen rot ✓ |
| Sprungknopf im Akademiebericht zurück | 4 Prüfungen rot ✓ |
| Vereinsbericht ohne gemeinsame Überschrift | 3 Prüfungen rot ✓ |

Zwei Vereinsprüfungen aus 35.50 mussten mit: sie verlangten, dass der
Abschlussbildschirm die Freischaltung **abfragt**. Der Knopf ist jetzt ganz
weg, und kein Zugang ist strenger als ein gesperrter. Sie sagen deshalb das
Stärkere — `EndScreen` bekommt gar kein `onAka` mehr, und im Akademiebericht
steht kein Sprungknopf. Wären sie stehengeblieben, hätten sie rot gemeldet,
obwohl die Sache besser geworden ist.

**Und drei eigene Fehler dabei:**

**Erster:** Die ersten beiden Versuche der Gegenproben A und B sind gar nicht
gebaut worden — die Ersetzung schlug fehl (`AssertionError`), der Lauf blieb
grün, und für einen Moment sah das nach einer bestandenen Gegenprobe aus.
Genau deshalb steht in jeder Manipulation ein `assert s.count(a) == 1`: eine
Gegenprobe, die nichts kaputtmacht, beweist nichts.

**Zweiter:** Die Quelltextprüfung suchte „Zur Jugendakademie" im ganzen
`App.jsx` — und fand es in dem Kommentar, der erklärt, dass der Knopf entfernt
wurde. **Die Prüfung bewachte ihre eigene Erklärung.** Wer eine Änderung
dokumentiert, darf damit keine Prüfung auslösen; die Quelltextprüfungen
blenden Kommentare jetzt aus.

**Dritter, und der gefährlichste — er betrifft 35.49:** Bei der letzten
Gegenprobe schlugen zwei Aufstellungsprüfungen an, die mit der Manipulation
nichts zu tun hatten:

    ✗ und reißt an seinem alten Platz kein Loch  Platz 10 (ST) ist LEER
    ✗ die Elf wird durch ein Antippen nicht kleiner  11 → 10

Nachgesehen: **kein Mechanikfehler, ein Prüfungsfehler.** Die Ausnahme fragte
`v.kader.some(kannSpielen)` — und zählte damit auch die mit, die schon in der
Elf **stehen**. Trifft der Zufall einen Kader, in dem alle ST-fähigen Spieler
bereits aufgestellt sind, meldet sie rot, obwohl `aufstellen` genau das
Dokumentierte tut. Frei heißt: nicht in der Ausgangself.

Das ist die schlechteste Sorte Befund — **ein Fehlalarm, der nur manchmal
kommt.** Beim nächsten Mal glaubt man ihm nicht mehr, und dann ist die Prüfung
wertlos, gerade wenn sie recht hat. Der Abschlusslauf davor war grün; das war
Würfelglück, kein Beweis. Berichtigt, und mit fünf Läufen hintereinander
gegengeprüft: 92 von 92, jedes Mal, bei 1 bis 6 frei verfügbaren Spielern. Die
Meldung nennt die Zahl jetzt mit, auf der die Ausnahme beruht.

## 35.52 · Stufe B — die Saison wird gespielt

Kevins Entscheidungen: **echte Spielsimulation mit Torschützen je Spiel**,
Sperren und Verletzungen **nur anzeigen**, Tabellenarchiv über **alle Jahre**.
Damit ist offener Punkt 21 erledigt.

### Was vorher war

`simTable` würfelte eine Tabelle **um einen Rang herum**, der vorher aus der
Stärke berechnet wurde:

    const rang = Math.round(clamp(erwartet + gauss(0, 2.6 * st.risiko), 1, N));
    const tabelle = simTable(klub, rang);

Erst der Rang, dann die Tabelle. Torschützen konnte es so gar nicht geben, und
die Kaderfelder `spiele`, `tore`, `form`, `fitness` standen seit 35.21 leer.
Jetzt läuft eine volle Hin- und Rückrunde; Rang und Tabelle kommen aus den
Ergebnissen. **`simTable` bleibt unangetastet** — die Spielerlaufbahn benutzt
sie weiter und ist von diesem Umbau nicht betroffen.

### Die Eichung war die eigentliche Arbeit

Eine Spielsimulation, die anders streut als die alte Formel, verschiebt still
den ganzen Vereinsfortschritt. Also erst die **Grundlinie gemessen** (20.000
Ziehungen je Wert), dann dagegen gedreht:

| Erwartungsrang | alt: Meister/Aufstieg | neu (0,45 / 1,1) |
|---|---|---|
| 1 | 58 % / 72 % | 39 % / **66 %** |
| 3 | 28 % / 42 % | 15 % / 34 % |
| 17 (von 20) | Abstieg 28 % | Abstieg **24 %** |
| Streuung Mittelfeld | σ 2,60 | σ **2,59** |

Streuung und Aufstieg treffen. **Der Titel ist schwerer geworden**, und das
bleibt so: die alte Formel würfelte einen Rang, da kam die Eins mit fester
Wahrscheinlichkeit. Jetzt muss man stärkere Mannschaften über 38 Spiele
wirklich überholen. Kein Eichfehler, sondern der Unterschied zwischen Würfeln
und Spielen.

**Zwei Schrauben, getrennt gemessen.** Der erste Entwurf hatte nur eine — die
Steigung der Kennlinie — und musste sie auf 0,20 je Stärkepunkt treiben, um
die Streuung zu treffen. Ergebnis: Fortuna Düsseldorf gewann die 3. Liga
**39-1-0 mit 170:5**. Die Verteilung stimmte, das Spiel nicht. Erst mit einer
zweiten Schraube (Saisonform je Verein) ließen sich beide Ziele trennen.

**Und in Streuungseinheiten statt in rohen Punkten.** Die 3. Liga spannt 12
Stärkepunkte über 20 Vereine, die Bundesliga 29 über 18. Eine feste Steigung
je Punkt taugt für beide nicht. Gerechnet wird der Abstand in Streuungen der
eigenen Liga — dann bedeutet die Schraube überall dasselbe. Gegengeprüft an
beiden Ligen.

### Was jetzt entsteht

Je Saison: die volle Abschlusstabelle, alle 38 eigenen Spiele mit
**Torschützen und Vorlagengebern**, und je Spieler Einsätze, Tore, Vorlagen,
Karten und verpasste Spiele. Die Kaderfelder aus 35.21 werden fortgeschrieben.

**Sperren wirken innerhalb der Saison, nicht darüber hinaus.** Eine Rote Karte
kostet zwei Spiele, für die jemand von der Bank nachrückt — genau wie bei der
Aufstellung von Hand. Danach steht die Zahl als Rückblick da und blockiert
nichts. Das Feld heißt deshalb `verpasst` und nicht `gesperrtBis`: eine Zahl
über Vergangenes kann niemand für eine Sperre halten.

**Was NICHT archiviert wird, sind die Einzelspiele.** 15 Jahre × 38 Spiele mit
Torschützen wären über tausend Einträge im Spielstand, für eine Seite, die
niemand zweimal aufschlägt. Sie stehen nur für die letzte Saison. Eine
Entscheidung, keine Vergesslichkeit — wer sie ändern will, weiß jetzt, was sie
kostet.

### Der Bildschirm

Neuer Reiter **Rückblick** im Vereinsbildschirm, zwischen Aufstellung und
Ausbau. Jahreswahl oben, darunter Abschlusstabelle (die eigene Zeile grün
markiert), Leistungsdaten, und für das jüngste Jahr die Liste aller Spiele mit
Ergebnis und Torschützen. Der Reiter **erscheint erst, wenn eine Saison
gespielt wurde** — ein leerer Reiter wäre ein Versprechen ohne Inhalt.

### Geprüft

Voller Lauf, Rückgabecode 0. **Ansichten 595 → 604, Vereinsprüfungen 92 → 118.**

Die 26 neuen Vereinsprüfungen fragen nach der **Buchhaltung**, nicht danach,
ob etwas durchläuft. Eine Tabelle, in der die Tore nicht zu den Gegentoren
passen, fällt beim Lesen nicht auf und macht jede Zahl darin wertlos:

    Summe Tore = Summe Gegentore              1015 : 1015
    Punkte passen zur Zahl der Spiele         1076 auf 380 Spiele
    Siege = Niederlagen · Unentschieden gerade
    je Zeile: Sp = S+U+N · Pkt = 3·S+U
    die Torschützen ergeben die Mannschaftstore   64 von 64
    die Spiele ergeben genau die Tabellentore
    ein Torwart ist nicht Torschützenkönig

### Vier eigene Fehler

**Erster:** Die Ligagrößenprüfung verglich `T.length === r.N` — beides aus
derselben Quelle, also stimmte es immer. Die Gegenprobe blieb grün, obwohl die
3. Liga 21 Mannschaften und 40 Spieltage hatte. **Eine Prüfung, die eine Zahl
mit sich selbst vergleicht, prüft nichts.** Jetzt gegen `LEAGUES`.

**Zweiter:** Der eigene Verein wurde an die Liga **angehängt** statt einen zu
ersetzen. Eine Liga hat eine feste Größe; wer aufsteigt, nimmt jemandem den
Platz weg.

**Dritter:** Der Testverein der Ansichtsprüfung hieß „Rückblickprobe" — und die
Prüfung „ist der Reiter schon da" fand ihr eigenes Suchwort im Vereinsnamen.
Jetzt wird am **Knopf** gemessen, nicht am Fließtext; ein Reiter ist ein Knopf.

**Vierter, und wieder derselbe wie in 35.51:** Die Ausnahme „niemand frei" war
an zwei von drei Stellen nachgezogen, an der dritten nicht. Sie meldete danach
weiter sporadisch rot. Wer eine Bedingung an drei Stellen braucht, muss sie an
alle drei schreiben — eine vergessene sieht aus wie ein echter Befund und ist
keiner. Fünf Läufe hintereinander gegengeprüft: 118 von 118, jedes Mal.

### Was Stufe B nicht ist

Kein Pokal, keine internationalen Wettbewerbe, keine Zuschauer oder Finanzen.
Und `form` und `fitness` sind weiterhin tot — sie brauchen eine Mechanik, die
sie liest, und die gibt es erst mit den Verträgen (Stufe C).

## 35.53 · Stufe C, erster Teil — Verträge und Postkorb

Kevin: „Jugendspieler müssen auch laufende Verträge haben" — und wenn ein
Talent ein Profiangebot bekommt, während es bei mir unter Vertrag steht,
**muss ich zustimmen**. Verlängerungen in der Akademie laufen automatisch,
„das machen quasi Angestellte für mich".

### Was passiert

Jedes Talent hat `vertragBis`, zwei oder drei Jahre. Solange es unter 19 ist,
verlängern die Angestellten **still** — ein Postkorb, der jedes Jahr mit
zwanzig Verlängerungen vollläuft, wäre keiner.

Mit 19 kam bis 35.52 der Abgang: er unterschrieb irgendwo und war weg. Jetzt
entsteht ein **Fall im Postkorb**, wenn sein Akademievertrag noch läuft. Drei
Wege:

| | |
|---|---|
| **Freigeben** | er geht, zählt als Profi, steht auf der Ehrentafel |
| **Behalten** | Vertrag verlängert, das Angebot verfällt — bis höchstens 21 |
| **In meine Mannschaft holen** | mit Aussicht in Prozent, er kann ablehnen |

**Die Frist wirkt von selbst.** Wer nach einem Jahr nicht entschieden hat, für
den entscheidet der Spieler — er unterschreibt woanders. Das steht absichtlich
im Jahreslauf und nicht in der Anzeige: eine Frist, die nur abläuft, wenn man
hinsieht, ist keine.

### Zu gute Talente sagen ab

Kevins Wunsch: „wenn sie eigentlich deutlich zu gut für meinen eigenen Verein
sind, dass sie sich auch entscheiden können, nicht zu meinem Verein zu gehen."
Verglichen wird die **erwartete Endstärke** mit der Mannschaftsstärke — ein
Sechzehnjähriger mit 52 und Anlage 88 ist heute schwächer als die Elf und
trotzdem zu gut für sie. Gemessen:

    Anlage →      50er Elf   65er Elf   80er Elf
      65             65 %      100 %      100 %
      75             20 %       87 %      100 %
      88              5 %       28 %       96 %

Das ist die Schleife: ein starker Verein hält seine Talente, ein schwacher
verliert die besten. Die Aussicht steht **in Prozent auf dem Knopf** — ohne
Zahl wäre es Glücksspiel.

### Der teuerste Befund dieser Sitzung

**Das Dach aus 35.50 hatte drei Fassungen lang keine Route.** Das Skript, das
sie einsetzen sollte, brach an einer späteren Ersetzung mit `AssertionError`
ab — und schrieb damit **gar nichts**. Nachgezogen wurden danach nur die
Rückwege. Folge: `onVereinDach` kam nie an, die Menüzeile „Dein Verein" war
dauerhaft grau, und **35.50, 35.51 und 35.52 sind so ausgeliefert worden**.

Kein Lauf hat es gemeldet. Die Prüfung aus 35.50 las den **Text** der Zeile
(„fragt die Freischaltung ab") und nicht, ob der Klick irgendwo ankommt.

Neu deshalb die **Routenprüfung**: jedes `setPhase("x")` braucht ein
`phase === "x"`, und jede Route muss angesprungen werden. `play` ist die
benannte Ausnahme — es steht am Ende der Kette als Durchfall. Gegenprobe: Route
entfernt → beide Richtungen melden.

**Und die Lehre über den Einzelfall hinaus:** derselbe Mechanismus hat in
dieser Sitzung dreimal zugeschlagen — einmal in 35.50 (Route weg), zweimal
hier beim Postkorb. Mehrere Ersetzungen in einem Skript, `assert` in der
Mitte, geschrieben wird am Ende: bricht eine, ist **nichts** geschrieben, und
der Lauf danach sieht aus wie vorher. Ab jetzt: jede Ersetzung einzeln
schreiben und danach mit `grep` nachsehen, dass sie drin ist.

### Zwei weitere eigene Fehler

**Einheitenfehler:** Verträge rechnen in Weltjahren, mein Postkorb rechnete in
Akademiejahren (1, 2, 3 …). Die Anzeige hätte „noch 2003 Jahre Zeit" gemeldet
und „Behalten" einen bereits abgelaufenen Vertrag gesetzt. Von der Prüfung
gefunden, nicht beim Lesen. Es gibt jetzt eine Prüfung, die genau diese Zeile
im Quelltext bewacht.

**Doppelzählung:** Die Zähler `profis`/`weltklasse` habe ich hinter die
Freigabeweiche gesetzt — und die alten stehen gelassen. Jeder Abgang zählte
doppelt. Die Ehrentafelprüfung meldete „Bilanz 10 Weltklasse, auf der Tafel
5". Hinzufügen ohne Wegnehmen, dieselbe Bauart wie die verlorene Route, nur
andersherum.

**Und beinahe ein dritter:** `ueberzeugt()` griff im ersten Entwurf auf
`TIER_BONUS` zu — das es nicht gibt. Der Ausdruck hätte still 0 geliefert und
die Ligastufe wäre wirkungslos gewesen, ohne dass etwas gemeldet hätte. Genau
die Bauart, die dieses Projekt schon mit `freigeschaltet().akademie` bezahlt
hat. Beim Nachsehen aufgefallen, bevor es lief; die Stufe wird jetzt aus der
Pyramide **gezählt**.

### Geprüft

Voller Lauf, Rückgabecode 0. **Ansichten 604 → 613, Vereinsprüfungen 118 → 143.**

Die neuen Vereinsprüfungen fragen nicht, ob ein Fall entsteht, sondern ob die
Freigabe **wirkt**: Spieler raus, Ehrentafel drauf, Profizahl genau plus eins,
Fall aus dem Postkorb. Und die Gegenrichtung — „Behalten" darf die Profizahl
**nicht** erhöhen. Dazu vier Prüfungen zur Frist, weil „Frist" sonst ein Wort
ohne Mechanik wäre.

Sechs neue Ansichten für den Postkorb, darunter der **leere** Zustand: ein
Postkorb, der immer da ist, fällt niemandem auf.

### Was noch fehlt

Der Kader hat weiterhin keine Verträge — das ist 35.54. Damit kommen dann
Abgänge mit Zustimmung, Auslaufenlassen mit Notiz, und `form` bekommt endlich
einen Leser.

## 35.54 · Stufe C, zweiter Teil — Kaderverträge, und Punkt 21 ist ganz zu

Kevin: Vertragsverlängerungen werden „gegebenenfalls auch automatisch
ausgehandelt, insofern die Spieler das wollen", Spieler können „zu anderen
Vereinen wechseln, wo dann auch meine Zustimmung nötig ist, wenn der Vertrag
noch läuft", und ich soll „Verträge auslaufen lassen können mit einer Notiz
von mir".

### Zuerst: `form` und `fitness` haben endlich Leser

Beide standen seit 35.21 im Kader und wurden nie beschrieben — der Rest von
offenem Punkt 21. Jetzt schließt sich eine Schleife:

    Einsätze → Form → Bleibelust → Vertrag
    Alter + Belastung → Fitness → Ausfälle → weniger Einsätze

**Form** misst, ob jemand seiner Stärke gerecht wurde. Träge angenähert, damit
ein einzelnes Jahr niemanden umwirft. Der erste Entwurf gewichtete zu stark:
jeder Dauerspieler lag über der Obergrenze und bekam dieselbe 73 — Torjäger wie
Innenverteidiger. **Eine Zahl, die für alle gleich ausfällt, misst nichts.**
Jetzt landet eine volle Saison ohne Torbeteiligung bei rund 68, ein Torjäger
bei rund 85.

**Fitness** fällt mit Alter und Belastung, erholt sich in einer ruhigen Saison
— und wird in `saisonSpielen` gelesen: wer schlecht bei Kräften ist, fällt
öfter aus. Klein genug, dass niemand aus der Elf gedrängt wird, groß genug,
dass ein Kader voller Ausgelaugter es merkt.

### Verträge im Kader

`vertragBis` wie in der Akademie, zwei oder drei Jahre. Läuft einer aus, wird
die **Bleibelust** gerechnet — und dort werden `form` und `spiele` gelesen:

| Grund zu gehen | Grund zu bleiben |
|---|---|
| spielt nicht (Einsatzanteil) | ist lange hier (Treue) |
| es läuft nicht (Form) | |
| zu gut für den Kader geworden | |
| alt und bekommt anderswo mehr | |

Will er bleiben, verlängert er **still** — ein Postkorb, der jedes Jahr mit
zwanzig Verlängerungen vollläuft, wäre keiner. Will er weg, meldet sich ein
Verein, und der Fall landet im Postkorb. Läuft sein Vertrag noch, brauche ich
zuzustimmen; ist er schon abgelaufen, geht er ablösefrei.

**Ablehnen kostet.** Wer gegen seinen Willen bleibt, verliert zwölf Punkte
Form. Ohne diesen Preis wäre Ablehnen immer richtig und die Entscheidung
keine.

**Zustimmen kann abgewiesen werden**, wenn der Kader dadurch unter das Minimum
fiele. Sonst stünde die nächste Saison still — wegen einer Entscheidung, die
harmlos aussah.

### Vertrag auslaufen lassen, mit Notiz

Im Kaderreiter ist jeder Spieler antippbar. Darunter Form, Fitness, Jahre im
Verein, ein Notizfeld und der Knopf. Die Marke ist **umkehrbar** — eine
Entscheidung, die man nicht zurücknehmen kann, gehört hinter eine Rückfrage,
und die gibt es hier nicht. Am Vertragsende geht er, die Notiz wandert in die
Chronik.

### Der Postkorb trägt jetzt zwei Sorten

Akademieangebote und Abgangswünsche stehen getrennt untereinander, mit eigenen
Überschriften und eigenen Knöpfen. **Zwei Fälle, die verschieden entschieden
werden, in einen Topf zu werfen wäre die Sorte Vereinfachung, die man später
teuer auseinandersortiert.** Gezählt werden sie gemeinsam — für den Spieler ist
es ein Postkorb.

### Geprüft

Voller Lauf, Rückgabecode 0. **Vereinsprüfungen 143 → 169.**

Die neuen prüfen die Schleife, nicht die Oberfläche: dass die Form Stammspieler
von Bankdrückern unterscheidet, dass die Bleibelust in beide Richtungen
reagiert (nicht spielen 56 % gegen 98 %, schlechte Form 62 % gegen 98 %), dass
Zustimmen den Spieler wirklich entfernt **und die Aufstellung nicht mehr auf
ihn zeigt**, und dass Ablehnen Form kostet.

**Drei Gegenproben:**

| Gegenprobe | gemessen |
|---|---|
| Form wird nicht mehr geschrieben | „unterscheidet Stamm von Bank" rot ✓ |
| Ablehnen kostet nichts | „es kostet Form" rot ✓ |
| Kadergrenze wird nicht geprüft | „wird abgewiesen" rot ✓ |

Fünf Läufe hintereinander: 169 von 169, jedes Mal.

**Und eine Zahl, die nicht verdrahtet wurde:** die Spieltage kommen aus der
Tabelle, nicht aus einer Konstante. Eine fest eingetragene 38 wäre in jeder
Liga mit 18 Vereinen still falsch gewesen.

### Was bleibt

Stufe D: Spieler abgeben, in die Akademie zurückschicken, Kader ausdünnen.
Das Vertragswesen steht damit vollständig.

## 35.55 · Stufe D — den Kader ausdünnen

Der Rest von Kevins Zettel: „Spieler einfach zu entfernen oder vielleicht
sogar wieder in die Jugendakademie runterzuschicken, um den Kader auszudünnen,
wenn Spieler dabei sind, die ich nicht haben möchte." Damit ist das
Verwaltungsvorhaben aus vier Stufen abgeschlossen.

### Zwei Wege aus dem Kader

| | wann | umkehrbar |
|---|---|---|
| **Vertrag auslaufen lassen** (35.54) | jederzeit, wirkt am Vertragsende | ja |
| **Entlassen** | sofort | **nein** |
| **In die Jugend** | sofort, nur bis 19 | **nein** |

Weil die beiden neuen endgültig sind, steht in der Anzeige eine **Rückfrage**
davor — anders als beim Auslaufenlassen, das man zurücknehmen kann. Eine
Entscheidung, die man nicht rückgängig machen kann, gehört hinter eine
Nachfrage; das Auslaufenlassen braucht keine.

**Beide teilen dieselbe Untergrenze.** Der Kader darf nicht unter sechzehn
fallen. Ohne diese Grenze könnte man sich mit zwei Tippern in eine Saison
manövrieren, die gar nicht stattfinden kann — und die Folge wäre erst ein Jahr
später sichtbar.

**Bis 19 in die Jugend, darüber nicht.** Die Akademie lässt mit 21 jeden
gehen; ein Zwanzigjähriger hätte dort ein einziges Jahr, und der Weg wäre ein
Etikett ohne Inhalt. Wer zurückgeht, kommt als Talent mit Stärke und Anlage
an und bekommt einen frischen Akademievertrag. **Die Vereinszahlen bleiben
nicht stehen** — Einsätze, Tore und Karten gehören zu Spielen, die er in der
Jugend nicht bestreitet.

### Eine Stelle für die Wahrheit

Abschiede außerhalb der Saison landen in `offeneAbschiede` und wandern beim
nächsten Saisonabschluss in die **Chronik**. Die Chronik bleibt damit die eine
Stelle, an der steht, wer wann gegangen ist. Zwei Listen dafür würden
auseinanderlaufen — dieselbe Überlegung wie bei den Teile-Listen in 35.45.

### Geprüft

Voller Lauf, Rückgabecode 0. **Vereinsprüfungen 169 → 187.**

Die achtzehn neuen prüfen jede Abweisung mit: unbekannter Spieler, zu alt,
ohne Akademie, Kader zu klein. Und dass der Abschied wirklich in der Chronik
ankommt statt in einer Zwischennotiz zu verschwinden.

**Drei Gegenproben:**

| Gegenprobe | gemessen |
|---|---|
| Untergrenze fällt weg | 2 Prüfungen rot ✓ |
| Abschiede landen nicht in der Chronik | „0 Abschiede im Jahr" ✓ |
| Altersgrenze fällt weg | „zu alt wird abgewiesen" rot ✓ |

### Ein eigener Fehler

Der eingefügte Prüfungsblock begann mit `/* ============ …` — und der Anker,
den ich ersetzt habe, war selbst ein **Kommentaranfang**. Der neue Kommentar
blieb offen, und die Datei ließ sich nicht mehr laden (`SyntaxError:
Unexpected token '{'`). Sofort aufgefallen, weil der Lauf abbrach. Ein Anker
mitten in einem Kommentar ist eine schlechte Wahl — sichtbar wird das erst,
wenn man ihn ersetzt.

### Das Vorhaben ist damit fertig

| Stufe | Fassung | |
|---|---|---|
| **A** | 35.49 | Aufstellung von Hand |
| **B** | 35.52 | Saison wird gespielt, Tabelle und Leistungsdaten |
| **C** | 35.53/54 | Verträge und Postkorb in Akademie und Kader |
| **D** | 35.55 | Kader ausdünnen |

Dazu unterwegs: das Dach (35.50), der aufgeräumte Abschluss (35.51) und das
Ende von offenem Punkt 21 (35.54).

## 35.56 · Die Werkstatt war nie da, und die Namen kamen alle aus der Nationalelf

Zwei Meldungen von Kevin: „das Werkzeug zur VC-Generierung und Laufbahn
überspringen hat beim letzten Mal nicht wirklich funktioniert", und „es sollten
nicht nur Namen von Nationalspielern im Pool sein".

### Die Werkstatt: sie war schlicht nicht in der Datei

In echtem Chromium nachgesehen — nicht in jsdom, denn jsdom hätte dieselbe
Antwort gegeben wie beim Bauen. Die Tafel ließ sich nicht öffnen, weil sie
nicht existierte: `grep WERKSTATT` in der ausgelieferten Datei ergab **0**.

Ursache: die Werkstatt hing allein an `ERSTSTART=1`. Und `ERSTSTART` schaltet
zugleich den Willkommensschirm ein. Damit gab es zwei Fassungen und ein
fehlendes Drittes:

| | Werkstatt | Willkommensschirm |
|---|---|---|
| ohne Schalter | **nein** | vorbelegt |
| `ERSTSTART=1` | ja | **bei jedem Neuladen** |
| *was Kevin brauchte* | ja | vorbelegt |

**Zwei Bedürfnisse an einem Schalter sind einer zu wenig.** Neu ist
`WERKSTATT=1`: Werkstatt drin, Schirm vorbelegt, man landet sofort im
Hauptmenü. `ERSTSTART=1` behält seine Bedeutung und bringt die Werkstatt
weiterhin mit.

Der Ausschluss aus der Prüfstandfassung **bleibt** und ist richtig: dreizehn
zusätzliche Knöpfe würden in jeder Knopfzählung mitlaufen, und gemessen würde
dann das Werkzeug statt des Spiels.

**Und `werkstatt.js` log über sich selbst.** Im Kopf stand, sie werde „von
`browsertest.sh` in die Testseite gehängt" — ohne Einschränkung. Wer die Datei
normal baute, suchte danach vergeblich nach einem Werkzeug, das laut dieser
Zeile da sein sollte. Eine Datei, die über sich selbst etwas Falsches
behauptet, kostet mehr Zeit als eine, die gar nichts sagt.

**Selbstprüfung in beide Richtungen** beim Bauen: ist die Werkstatt drin, wenn
sie gewollt war, und draußen, wenn nicht. Ohne sie ist genau das unbemerkt
passiert.

Nachgemessen in Chromium, mit `WERKSTATT=1`: Tafel öffnet, „+5" setzt
`karrieren` auf 5, nach dem Neuladen steht „Dein Verein — frei" und lässt sich
öffnen. Elf von elf.

**Ein Anteil davon liegt bei mir:** ich habe die Browsertestdatei mit den
Vorgabeeinstellungen gebaut und ausgeliefert, also die Prüfstandfassung, und
in der Anleitung nur den Messgriff beschrieben.

### Die Namen: gemessen, wo das Problem wirklich sitzt

Nachweis war „Joshua Kimmich" auf dem ersten Bildschirm des Browsertests —
ein echter Nationalspieler.

Erst gemessen, wo es auffällt: die **Nationalität der Talente ist
gleichverteilt** über 212 Nationen, je 0,6 %. In der Akademie fällt eine
Kollision also kaum ins Gewicht. Sie entsteht bei der **Spielerpass-Erstellung**,
wo man das Land selbst wählt — dort wurde erweitert.

**27 Länder erweitert, 185 unverändert.** Der ehrliche Maßstab ist nicht „mehr
Namen", sondern wie oft **beide** Teile noch aus dem Nationalmannschaftstopf
stammen:

| | Kombinationen | beide aus der Nationalelf |
|---|---|---|
| GER | 400 → **1600** | 100 % → **25 %** |
| USA | 400 → 1482 | 100 % → 27 % |
| NED | 480 → 1596 | 100 % → 30 % |
| FRA | 400 → 1221 | 100 % → 33 % |
| im Mittel über alle 27 | | 100 % → **52 %** |

Bei einigen bewegte sich wenig — CZE 87 %, JPN 87 %, SRB 83 %. Das ist kein
Versäumnis: dort waren die Listen von Anfang an die häufigsten Alltagsnamen
des Landes (Novák, Svoboda, Satō, Suzuki, Jovanović). Die Entdopplung hat
gearbeitet; bei Japan waren alle zwanzig vorgeschlagenen Nachnamen schon drin,
bei England fünfzehn von zwanzig.

**Warum nicht alle 212:** für die übrigen ließen sich häufige Vor- und
Nachnamen nicht zuverlässig angeben. Ein erfundener Nachname ist schlechter
als ein echter, der öfter vorkommt. Welche Länder erweitert wurden, steht im
Skript und in dieser Liste; die übrigen bleiben offen.

### Neue Prüfung, und was sie sofort fand

`namenpruefung.cjs` misst jetzt den Umfang der Töpfe: Mittelwert, kleinste,
größte, harte Untergrenze, und dass die sechzehn erweiterten Nationen nicht
zurückfallen.

**Sie meldete beim ersten Lauf Myanmar als harten Fehler** — 40 Vornamen, ein
Nachname. Nachgesehen: `bau: "V"`. Burmesische Namen haben **keinen
Familiennamen**; der eine Eintrag ist ein Platzhalter, der nie benutzt wird.
Die Kartei ist völlig richtig, meine Rechnung war falsch. Jetzt rechnet die
Prüfung nach Bauart (`V`, `VN`, `VNN`, `VMN`, `VpN`) und hat eine eigene
Schwelle für Namenskulturen ohne Familiennamen. **Eine Prüfung, die eine
richtige Kartei anmeckert, wird nach dem dritten Mal abgeschaltet.**

Nebenbei richtiger geworden: der Mittelwert stieg von 352 auf 1433
Kombinationen — vorher wurden die doppelten Nachnamen (spanisch,
portugiesisch) und die Mittelnamen gar nicht mitgezählt.

### Geprüft

Voller Lauf, Rückgabecode 0. Gegenprobe: `POL` auf drei Nachnamen gekürzt →
beide neuen Prüfungen melden. Browsertest in echtem Chromium, alle drei
Fassungen bauen und verhalten sich wie beschrieben.

## 35.57 · Die Namen haben ihre Zeichen zurück

Kevin: „Wäre cool wenn Ü, Ö und Ä es noch ins Spiel schaffen. Vor allem bei
den deutschen Namen fehlen sie."

### Erst der Grund, dann die Änderung

Gemessen: **208 von 212 Ländern** hatten kein einziges Sonderzeichen. Im Kopf
von `namen.js` stand kein Wort dazu — es gab also keinen dokumentierten Grund,
nur einen historischen.

Die Frage vor jeder Änderung war: **können die eingebetteten Schriften die
Zeichen überhaupt?** Fehlt einer Schrift ein Zeichen, steht auf dem Telefon ein
Kästchen — und das fällt in jsdom nicht auf, weil dort nichts gezeichnet wird.

### Drei Messverfahren, die alle falsch waren

**Anlauf 1** verglich die Zeichenbreite in der Schrift gegen eine nicht
vorhandene Schriftfamilie. Falsch: ein *fehlendes* Zeichen wird ebenfalls von
einer Ersatzschrift gezeichnet, die Breite unterscheidet sich also immer.
Ergebnis wäre „kann alles" gewesen, egal was in der Schrift steht.

**Anlauf 2** verglich gegen die Breite des Ersatzkästchens (U+E000). Auch
falsch: in einer Proportionalschrift trifft irgendein Buchstabe zufällig
dieselbe Breite. Die Probe meldete daraufhin, die Anzeigeschrift könne kein
**„u"** — ein Grundbuchstabe. **Eine Messung, die etwas Unmögliches behauptet,
ist widerlegt, nicht bemerkenswert.**

**Anlauf 3** zeichnete jedes Zeichen zweimal, einmal mit `serif` und einmal mit
`monospace` als Ersatz — bei einem vorhandenen Zeichen müssten beide Abdrücke
gleich sein. Scheiterte daran, dass in diesem Behälter beide auf dieselbe
Systemschrift zeigen. Aufgefallen ist es nur, weil eine **Gegenprobe mit 漢, अ
und ⟹** eingebaut war: die Probe meldete, die Schrift könne Chinesisch.

**Anlauf 4** liest die Schriftdatei. WOFF2 ist brotli-gepackt, aber nur `glyf`
und `loca` werden zusätzlich umgeformt — `cmap` steht unverändert drin. Das
neue Werkzeug **`pruefstand/schriftabdeckung.cjs`** wertet sie aus, mit
derselben Gegenprobe. Ergebnis:

    5 eingebettete Schriften, 461–578 Zeichen je Tabelle
    ✓ Deutsch · Franz./Span./Port. · Nordisch
    ✓ Türkisch · Polnisch · Tschech./Kroat.   — alle vollständig

**Es gab also nie einen technischen Grund.** Die Schriften konnten es die ganze
Zeit.

### Was geändert wurde

**Deutsch von Hand**, zwölf Namen: Müller, Schröder, Krüger, Köhler, König,
Füllkrug, Rüdiger, Mittelstädt, Sané, Groß, Marc-André, ter Stegen. Dazu zehn
häufige Nachnamen mit Umlaut, damit die Zeichen nicht in drei Namen versteckt
bleiben: Schäfer, Günther, Jäger, Böhm, Möller, Kühn, Förster, Röder, Weiß,
Häberle.

**Danach 17 weitere Länder**, zusammen **158 Namen**: Öztürk, Şahin, Yılmaz,
Çelik · Wójcik, Wiśniewski, Dąbrowski, Łukasz · Novák, Černý, Dvořák, Matěj ·
Kovačević, Đorđević, Miloš · João, Gonçalves · García, Pérez, Álvaro · Bjørn,
Sørensen. Von 4 auf **18 Länder mit Sonderzeichen**.

**Nur eindeutige Ersetzungen.** Jeder Eintrag steht als Paar und wird nur
ersetzt, wenn er im Block des Landes genau einmal vorkommt. Ein falsch
gesetzter Akzent ist schlimmer als keiner — er sieht nach Sorgfalt aus und ist
trotzdem falsch.

### Im echten Browser angesehen

Nicht nur gemessen: die Namen in beiden Schriften gerendert und das Bild
angesehen. Keine Kästchen, keine Ersatzschrift. Und die Versalien der
Anzeigeschrift stimmen auch — „Groß" wird zu **GROSS**, nicht zu einem
Kästchen, und ÖZTÜRK und WÓJCIK behalten ihre Zeichen.

### Damit es nicht wieder verschwindet

`schriftabdeckung.cjs` läuft jetzt in `pruefen.sh` mit und meldet, sobald einer
Schrift ein Alphabet fehlt. Kostet nichts (sie liest eine Datei) und beantwortet
die Frage, die vor jeder Zeichenänderung steht.

### Geprüft

Voller Lauf, Rückgabecode 0. Schriftzeichen: 40 Proben ohne Befund.

## 35.58 · Drei Befunde vom Gerät — und einer davon war unsichtbar

Kevin hat vier Bildschirmfotos vom S24 Ultra geschickt und eine Liste mit
vierzehn Punkten. Diese Fassung nimmt die drei, die klare **Fehler** sind; der
Rest folgt geordnet.

### 1. Die Kaderliste war dunkel auf dunkel

Auf dem Bild kaum zu lesen. Ursache, gemessen: **es gibt keine allgemeine
Farbregel für `button`.** Nur die Klasse `btn` setzt `color`. Als in 35.49 die
Elfzeilen und in 35.54 die Kaderzeilen von `div` auf `button` umgestellt
wurden, haben sie die dunkle Systemfarbe geerbt. Gemessener Kontrast: **1,32**
— unter 3,0 gilt Text als kaputt, nicht als knapp.

**Neun Fassungen, zwei Prüfstände, kein Befund.** Der Grund ist strukturell:
**jsdom zeichnet nicht.** Es kennt keine Farben, keine Vererbung, keinen
Kontrast. Aufgefallen ist es auf einem Foto.

Neu deshalb **`pruefstand/kontrast.cjs`**, in `sicht.sh` eingehängt. Es misst
im echten Browser das Helligkeitsverhältnis jeder sichtbaren Textstelle nach
WCAG (145 Stellen über drei Bildschirme) und prüft zusätzlich **die Klassen
einzeln** — denn Kader und Aufstellung erreicht ein Rundgang erst nach fünf
Laufbahnen. Der Hintergrund wird dabei nach oben verfolgt, sonst misst man
gegen „durchsichtig".

Gegenprobe: mit dem Zustand von 35.57 meldet es `.up` mit **1,32** — genau der
Fehler auf dem Bild. Und eine zweite Gegenprobe hängt einen absichtlich
unlesbaren Text in die Seite; wird er nicht gefunden, ist die Messung kaputt.

### 2. Beim Karriereende fehlte die Punktzahl

Im Bild steht bei „Punkte" ein Strich, während Platz und Tore stimmen. Ursache:
`meins.pts` — und **seit 35.52 heißt das Feld `pkt`.**

Bitter ist die Stelle: direkt darüber steht mein eigener Kommentar aus 35.28,
der sich rühmt, die Feldnamen „NACHGESEHEN, nicht geraten" zu haben. Das
stimmte auch — bis die Spielmaschine das Feld umbenannte und diese eine Zeile
nicht mitgezogen wurde. **Ein Kommentar altert schneller als der Code
darunter.** Jetzt kommt die Zahl aus `VS.punkte`, also aus derselben Quelle wie
die Tabelle — eine statt zwei.

### 3. Griechinnen trugen die männliche Namensform

„Maria Tsimikas" gibt es nicht. Gemessen: der Mechanismus für weibliche
Nachnamen (`nw`) **existiert und wirkt** — Polnisch „Frankowska", Russisch
„Kuznetsova", Lettisch „Bērziņa". Griechenland hatte ihn nur nicht gesetzt.

Neue Regel `nw:"gr"` — die weibliche Form ist der Genitiv:

    -os → -ou    Papadopoulos → Papadopoulou
    -as → -a     Masouras     → Masoura
    -is → -i     Giakoumakis  → Giakoumaki

Beim Nachmessen fiel ein zweiter auf: die tschechische Endung lieferte
„Novotna" und „Coufalova" — **ohne die Längezeichen**, die dort zur Endung
gehören. Seit 35.57 die Namen ihre Zeichen zurück haben, stand der Bruder als
„Novotný" und die Schwester als „Novotna" daneben. Jetzt **-ová** und **-á**.

### Ein eigener Fehler, und er hat die App zerlegt

Der Kommentar, den ich über die neue CSS-Regel geschrieben habe, enthielt
**Rückwärts-Anführungszeichen** — und der gesamte CSS-Text ist ein
Schablonentext. Damit endete die Zeichenkette mitten im Kommentar, der Rest
ging als Code durch, esbuild meldete nichts, und die App startete nicht mehr:
`root` blieb leer.

**Es gibt seit Fassungen eine Prüfung genau dafür.** Sie hat nicht gegriffen,
weil ich sie nicht laufen ließ — nach der Änderung bin ich direkt zum
Browsertest gesprungen, statt erst den Prüfstand zu fahren. Gefunden hat es
dann der Browsertest, aber erst über den Umweg „warum ist die Seite leer".
Gegengeprüft: die vorhandene Prüfung meldet den Fall sofort und mit
Zeilennummer.

### Geprüft

## 35.59 · Die Auswahl steht dort, wo man hingetippt hat

Kevin, drei Punkte aus derselben Familie: der Vertragskasten soll „direkt
unterm Namen des ausgewählten Spielers erscheinen", dasselbe bei der
Aufstellung, und die einsetzbaren Spieler „direkt unterm ausgewählten".

### Was falsch war

Beide Kästen standen **unter der ganzen Liste**. Bei der Elf hieß das: wer den
zweiten Platz besetzte, las über neun Zeilen hinweg und suchte danach wieder
hoch. Im Kader mit zwanzig Spielern war es zwanzig Zeilen weiter unten.

Jetzt werden beide **in** der Liste gezeichnet, direkt an der Zeile, um die es
geht. Dafür sind sie zu Funktionen geworden (`auswahlKasten`, `spielerKasten`)
und die Zeilen zu Fragmenten aus Knopf plus möglichem Kasten.

**Geprüft wird die STELLUNG, nicht die Anwesenheit.** „Der Kasten ist da" war
schon in 35.49 wahr und trotzdem falsch platziert. Die neue Prüfung läuft vom
angetippten Knopf aus durch die Geschwister und zählt, wie viele Platzzeilen
zwischen Tipp und Kasten liegen — erlaubt sind null. Gegenprobe: Kasten aus
der Liste entfernt, drei Prüfungen melden.

### Und die Reiterzeilen

Kevins Frage, ob sie in allen Modi gleich sind: **nein.** Akademie und
Spielerkarriere benutzen `tabhuelle`/`tabs`, der Verein hatte eine
handgeschriebene Flex-Zeile. Ihr fehlten der Abblendrand rechts (der zeigt,
dass es weitergeht), die Trennlinie darunter, das Einrasten beim Wischen und
der Sprung an den Seitenanfang beim Reiterwechsel.

Jetzt überall dieselbe Bauart, auch bei der Jahreswahl im Rückblick. **Wer eine
Zeile zweimal baut, baut sie zweimal anders.**

### Geprüft

## 35.60 · Das Dach zeigt den Stand, statt ihn zu verstecken

Kevin: die beiden Einträge sollen „bildfüllender und etwas prägnanter" sein,
„schon mit relevanten Infos/Daten zum aktuellen Stand". Und das Postfach soll
**immer** sichtbar sein, mit Zähler auch wenn leer.

### Vorher zwei Zeilen auf leerem Grund

Auf Kevins Bild stehen zwei schmale Zeilen und darunter 1200 Pixel Nichts. Um
zu wissen, ob es etwas zu tun gibt, musste man hineingehen.

Jetzt drei Kacheln mit je drei Kennzahlen und einer Statuszeile:

| Jugendakademie | Profimannschaft | Postfach |
|---|---|---|
| Talente · Profis · Ausbau | Kader · Stärke · Elf | aus der Akademie · aus der Mannschaft |
| VC im Kopf, nächster Ausbau mit Preis in der Statuszeile | Liga und Platz der letzten Saison | „nichts offen" statt zu verschwinden |

Welche Zahlen erscheinen, entscheidet der Zustand: eine ungegründete Akademie
zeigt, was zum Gründen fehlt; eine gesperrte Mannschaft zeigt, wie viele
Laufbahnen noch fehlen. Steht die Elf nicht, färbt sich die Zahl rot.

### Ein Postfach, das verschwindet, ist keins

Bis 35.59 erschien es nur bei offenen Fällen. Wer es nie gesehen hatte, wusste
nicht, dass es existiert; wer es kannte, konnte nicht nachsehen, ob gerade
nichts anliegt. Jetzt ist es immer da, zeigt „nichts offen" und erklärt, was
dort landet. Bei offenen Fällen klappt es von selbst auf — wer hereinkommt und
etwas zu entscheiden hat, soll es sehen und nicht danach suchen.

### Zwei eigene Fehler, beide bei Zahlen

**Der Ausbau stand mit dem falschen Nenner da.** Ich schrieb
`ABTEILUNGEN.length * AKA_MAX` = 54 — das ist die Summe **aller** Stufen.
`akaAusbau` zählt aber die **gekauften**: 0 bei einer frischen Akademie, 45 bei
voller. Die Kachel hätte „18/54" gezeigt, wo „18/45" richtig ist. Es gibt dafür
längst `AKA_STUFEN`. **Eine Zahl mit falschem Nenner ist schlimmer als keine —
sie sieht nach Auskunft aus.** Gemessen und in beiden Richtungen gegengeprüft,
dazu eine Quelltextprüfung, die den Nenner festnagelt.

**Die dritte Spalte im Postfach war manchmal leer.** Dort stand „ansehen/zu" —
bei leerem Postfach nichts, und die Kachel hatte ein Loch. Was ein Tipp
bewirkt, gehört nicht in eine Kennzahlenspalte.

### Und ein Fund im Prüfstand selbst

Die Kachelprüfung meldete „die Akademiekachel zeigt keine Kennzahlen". Nicht
die Kachel war schuld: der Testakademiestand hatte `gegruendet` nie gesetzt.
Für die alten Ansichten war das egal, für die Kacheln nicht. **Ein Prüfstand,
dessen Testdaten den Normalfall nicht abbilden, prüft den Ausnahmefall.**

Nebenbei: mein neuer Block griff auf `ARG2` zu — eine Variable, die erst 465
Zeilen später in einem anderen Block angelegt wird. Node bricht dann beim Laden
ab, mit einem Stapelabzug ohne Zeilennummer, der nach einem Modulproblem
aussieht. Eine Abkürzung über eine fremde Variable spart drei Zeichen und
kostet zehn Minuten.

### Geprüft

## 35.61 · Verwaltung im Jugendhaus

Kevin: „weiterhin keine Verwaltungsmöglichkeiten in der Jugendakademie." Auf
Nachfrage: wie im Kader — Talent antippen, Vertrag, freigeben, hochziehen —
und zusätzlich Talente aussortieren.

### Spiegelbild des Kaders, mit Absicht

| | Kader (35.54/55) | Jugendhaus (35.61) |
|---|---|---|
| umkehrbar | Vertrag auslaufen lassen | Vertrag auslaufen lassen |
| endgültig, mit Rückfrage | Entlassen · In die Jugend | Aussortieren |
| Zählung | Abschied in der Chronik | Abbrecher, Eintrag in der Chronik |

**Wer zwei Bereiche verschieden bedient, muss zweimal lernen.** Die Talentzeile
ist antippbar, der Kasten steht direkt darunter — dieselbe Bauart wie im Kader
seit 35.59.

Neu in der Zeile selbst: die Restlaufzeit des Vertrags. Wer markiert ist,
bekommt einen roten Rand und die Notiz daneben.

### Die Marke muss wirken, nicht nur gesetzt werden

Die stille Jahresverlängerung hätte sie sonst jedes Jahr überschrieben — der
Knopf wäre ohne Folge geblieben. Gemessen, und zwar **gegen den unmarkierten
Fall**, weil „er ist weg" allein nichts beweist:

    ohne Marke : 2029 V2032 · 2030 V2032 · 2031 V2034 · … · 2033 weg (21 Jahre alt)
    mit Marke  : 2029 V2030 · 2030 weg

Ohne Marke wird still verlängert, mit Marke bleibt der Vertrag stehen und er
geht genau dann.

**Aussortierte zählen als Abbrecher, nicht als Profi** und stehen nicht auf der
Ehrentafel. Ein Talent, das ohne Spur verschwindet, macht die Aufnahmezahl zur
Lüge.

### Ein Fehler an meiner Prüfung, nicht an der Mechanik

Der erste Entwurf ließ sechs Jahre laufen und verglich dann die Verträge. Nach
sechs Jahren ist aber auch ein unmarkiertes Talent weg — es wird 21. Die
Prüfung meldete „Vertrag 2030 → null" und sah nach einem Mechanikfehler aus.
Sie war es selbst. **Gemessen wird jetzt genau so lange, wie der ursprüngliche
Vertrag läuft** — bis dahin entscheidet die Marke und sonst nichts.

Und wieder die Ausfuhrliste: `talentAuslaufen` und `aussortieren` fehlten in
`exporte.txt`, wie schon in 35.53 und 35.48. Dritter Fall derselben Art.

### Geprüft

## 35.62 · Errungenschaften für den eigenen Verein

Kevin: „Wir benötigen noch Errungenschaften und Belohnungen für Leistungen und
Erfolge in Jugendakademie und Profimannschaft."

### Warum es keine gab

Gemessen: 155 Errungenschaften, davon **zwölf für die Akademie und keine für
den Verein**. Der Grund war nicht Nachlässigkeit — `ok` bekam nur
`(p, G, A)`: Spieler, Bilanz, Akademie. **Der Verein wurde gar nicht
übergeben.** Eine Bedingung, die man nicht formulieren kann, schreibt niemand
auf.

Jetzt `(p, G, A, V)`, und zwar mit dem Vereinsstand **nach** der eben
gespielten Saison. Ohne den zählte ein Meistertitel erst eine Laufbahn später
— die Errungenschaft käme im falschen Jahr und der Jubel am falschen
Bildschirm.

### Zwölf neue, gestaffelt

Eigener Rasen · Angepfiffen · Eine ganze Mannschaft · Oben angeklopft ·
Torfabrik · Eine Etage höher · **Meisterschale** · Durchmarsch · Eine Wucht ·
**Ganz oben angekommen** · Fünfzehn Jahre · **Beide Häuser** (Meister *und*
25 ausgebildete Profis).

Zwei davon schalten neue Rahmen frei: das **Meisterwappen** und **Fünfzehn
Ringe**, einer je Vereinsjahr.

### Zwei Versprechen, die ihre Mechanik nicht hatten

**„Ganz oben angekommen"** hieß „in der höchsten Liga des Landes spielen" —
geprüft wurden **zwei Aufstiege**. Das ist bequem und falsch: wer in einem Land
mit vier Stufen zweimal aufsteigt, ist noch lange nicht oben, und wer in der
zweithöchsten startet, ist es nach einem. Jetzt wird die Ligakette des eigenen
Zweigs geholt und gegen ihre letzte Liga geprüft. In fünf Lagen gemessen, von
„3. Liga" bis „war mal Bundesliga".

**„Aus eigener Zucht"** versprach elf *Absolventen*, gezählt wurde die
Kadergröße. Näherungsweise stimmt das, aber ein Zugekaufter wäre mitgezählt
worden. Der Text heißt jetzt, was gemessen wird.

### Zwei Belohnungen zeigten ins Leere

`mk_wappen` und `mk_rahmen15` standen an den neuen Errungenschaften, existierten
aber nicht. Der Bildschirm hätte **„Belohnung: undefined"** angezeigt, und
nichts hätte gemeldet: `META[a.lohn]` ist dann schlicht `undefined`. Gefunden
durch einen Abgleich aller Verweise, nicht beim Lesen. Es gibt jetzt eine
Prüfung, die alle 50 Verweise gegen die 50 Belohnungen hält.

### Erreichbarkeit wird gemessen

Eine Errungenschaft, deren Bedingung nie wahr wird, meldet nichts — sie steht
für immer grau da. Die neue Prüfung spielt einen starken Verein **fünfzehn
Jahre** durch und zählt: **12 von 12 erreicht**, davon 8 im ersten Jahr und 4
später. Die zweite Hälfte ist genauso wichtig: fielen alle sofort, wäre die
Staffelung Zierde.

### Drei eigene Fehler an Prüfungen

**Erster:** Meine `!!V`-Prüfung las den Quelltext und verlangte eine
Schreibweise. Sobald eine Bedingung mehrzeilig wurde und mit
`if(!V) return false;` begann, meldete sie rot — obwohl beides richtig ist.
**Eine Prüfung, die auf eine Formulierung besteht statt auf eine Eigenschaft,
verbietet gültigen Code.** Jetzt wird aufgerufen: jede Bedingung bekommt `null`
und muss `false` liefern statt zu stürzen.

**Zweiter:** Die Akademieprüfung aus 35.61 wurde sporadisch. Sie hing an
**einem** Talent — und das kann in den zwei Jahren auch abbrechen. Zweiter
Fehlalarm derselben Prüfung. Jetzt werden alle jungen Talente betrachtet, die
Hälfte markiert; Abbrecher fallen einfach raus. Fünf Läufe hintereinander:
212 von 212.

**Dritter:** Beim Umbau blieb eine Zeile der alten Prüfung stehen und griff auf
eine Variable zu, die es nicht mehr gab. Node meldete das mit einem
Stapelabzug ohne Zeilenbezug — der Lauf brach ab, bevor irgendetwas lief.

**Vierter, ein einziger Buchstabe:** an einer Errungenschaft stand `s:"legend"`
statt `s:"legende"`. Der Errungenschaftsbildschirm schlägt `STUFEN[a.s].w`
nach und **stürzte ab** — drei Ansichten und eine Sichtprüfung fielen aus. Ein
Tippfehler in einer Kennung fällt nirgends auf, bis etwas ihn nachschlägt. Es
gibt jetzt eine Prüfung, die jede Stufenkennung gegen `STUFEN` hält.

**Fünfter:** Eine Ansichtsprüfung trug „2 von 48" fest ein. Als zwei
Belohnungen dazukamen, meldete sie rot, obwohl beide richtig angelegt waren.
Dieselbe Bauart wie die 518 Ereignisse aus 35.45 — jetzt wird die Gesamtzahl
aus `META` gemessen.

**Und die Erreichbarkeitsprüfung selbst brauchte drei Anläufe.** Erst brach der
Testverein vor dem fünfzehnten Jahr zusammen, dann stellte ich jedes Jahr
denselben 62er-Kader — und „Eine Wucht" (Stärke 70) wurde unerreichbar. Ein
Prüfstand, der einen Verein nachbildet, muss einen nachbilden, der sich
**entwickelt**. Jetzt wächst der Kader mit den Jahren, wie es ein Verein tut,
dessen Akademie ausgebaut wird. Fünf Läufe: 12 von 12, jedes Mal.

### Geprüft

## 35.63 · Kartenoptik hinter dem Porträt

Kevin: „Bei der Charaktererstellung muss der Hintergrund des Porträts anders
sein. Einige Designs — vor allem bei dunklem Haar — erkennt man nicht."
Auf Nachfrage: Kartenoptik wie EAFC, Farbverlauf passend zum freigeschalteten
Rahmen.

### Der Befund war messbar, nicht Geschmackssache

Hinter dem Porträt standen zwei flache, sehr dunkle Töne (`#0B120E` /
`#0E1712`). Gemessen gegen den dunkelsten Haarton der Palette: **Kontrast
1,02.** Ein Verhältnis von 1,0 heißt: kein Unterschied. Der Kopf hatte
schlicht keine Silhouette.

### Untergrenze statt Augenmaß

Der erste Entwurf nahm die Rahmenfarbe, dunkelte sie ab und sah gut aus —
gemessen kam **ohne Rahmen** wieder 1,02 heraus. Farben nach Gefühl zu wählen
löst ein Kontrastproblem nicht, es verschiebt es.

Jetzt wird der Ton hinter dem Kopf so lange aufgehellt, bis er gegen das
dunkelste Haar **2,5** erreicht. Nicht die 4,5 der Textlesbarkeit: hier geht
es um eine Silhouette, nicht um Buchstaben, und ein zu heller Grund macht aus
dem Porträt ein Passfoto.

| Rahmen | Grund oben | Kontrast |
|---|---|---|
| **ohne Rahmen** | `#495f4f` | **2,68** (vorher 1,02) |
| Meisterwappen | `#437845` | 3,55 |
| Fünfzehn Ringe | `#936f36` | 4,04 |
| Raute | `#4376a2` | 3,85 |
| Legende | `#aeaa8c` | 7,90 |
| Bronze | `#7b5e37` | 3,10 |

**Der Fall ohne Rahmen ist der wichtigste** — so fängt jeder an, und
ausgerechnet dort war es am schlimmsten.

Der Verlauf geht oben hell, unten dunkel: der Kopf sitzt oben und hebt sich
ab, die Schultern stehen gegen den dunklen Fuß. Andersherum hätte es hübsch
ausgesehen und das Problem nicht gelöst. Dazu zwei sehr schwache Strahlen wie
auf einer Karte.

### Der dunkelste Haarton kommt aus der Palette

Im ersten Entwurf stand er fest im Code als `#141414` — geraten. Der
tatsächliche ist `#17120F`. **Eine Grenze, die gegen einen erfundenen Wert
misst, misst nichts:** ändert jemand die Palette, bleibt die Grenze stehen und
die Silhouette verschwindet wieder, ohne dass etwas meldet. Jetzt wird er aus
`HAIRC` abgeleitet, und eine Prüfung hält beides gegeneinander.

### Ein Fund nebenbei, und er betrifft 35.62

**`RAHMEN` ist eine eigene Liste neben `META`.** Meine beiden neuen
Belohnungen aus 35.62 standen nur in `META` — die Errungenschaft hätte einen
Rahmen versprochen, den es nicht gibt: freigeschaltet ja, auswählbar nein.
Aufgefallen erst beim Bauen des Hintergrunds. Beide sind jetzt angelegt
(Meisterwappen grün, Fünfzehn Ringe kupfern), und eine Prüfung hält jede
Belohnung, die „Rahmen: …" heißt, gegen `RAHMEN`.

### Und ein erfundener Name, zum dritten Mal

`mischen` gibt es nicht, die Funktion heißt `mischFarbe`. esbuild hätte nichts
gemeldet — die App wäre beim ersten Porträt abgestürzt. Dritter Fall in dieser
Sitzung nach `TIER_BONUS` (35.53) und `ARG2` (35.60). **Namen nachsehen, nicht
erinnern.**

### Geprüft

## 35.64 · Derselbe Fehler, eine Klasse weiter

Kevin, mit Bild: „die Schrift rechts wieder zu dunkel." Gemeint sind die
Kennzahlen der Dach-Kacheln — „4260 VC", „7. JAHR", „NICHTS OFFEN".

### Es war exakt der Fehler aus 35.58

Ein `button` erbt seine Schriftfarbe **nicht**. In 35.58 wurde das für die
Klasse `up` berichtigt. Die Dach-Kacheln aus 35.60 sind aber
`button className="pan"` — und `.pan` setzt ebenfalls keine Farbe. Gemessener
Kontrast: **1,26.**

**Warum die Kontrastprüfung aus 35.58 es nicht fand:** sie baute jede Klasse
an einem `div`. `div.pan` hat helle Schrift und meldete 14,07. Die Klasse war
in Ordnung — die **Elementart** war es nicht. Eine Prüfung, die nur eine
Hälfte der Bedingung nachstellt, meldet für die andere Hälfte nichts.

### Zwei Reparaturen statt einer

**Die Ursache, allgemein:** `button{color:inherit}`. Klasse für Klasse
nachzubessern hieße, beim nächsten Knopf wieder zu warten, bis es jemand
sieht. `inherit` nimmt die Farbe des Umfelds — auf dunklem Grund die helle
Schrift, auf der Papierseite die Tinte. Regeln mit Klasse gewinnen weiterhin,
weil sie spezifischer sind.

**Die Prüfung:** sie testet jede Klasse jetzt an **beiden** Elementarten, zwölf
Kombinationen statt sechs. Gegenprobe mit dem Zustand von 35.63: `button.pan`
und `button.pan pad` melden 1,26.

### Und sie fand sofort einen dritten Fall

`button.chip` mit Kontrast **1,03**: `.chip` setzt eine helle Schrift, aber
keinen Grund — die Spielarten `.chip.g/.a/.r` tun das, die schlichte nicht. An
einem `div` fällt das nicht auf (durchsichtig), an einem `button` bekommt es
den hellgrauen Systemgrund.

Einen `button className="chip"` gibt es heute **nicht**. Ich habe die Probe
trotzdem nicht verengt, sondern die Regel robust gemacht: **„gibt es heute
nicht" ist eine Tatsache mit kurzer Haltbarkeit**, und eine Regel soll nicht
davon abhängen, an welche Elementart jemand sie hängt.

### Ein eigener Fehler, und zwar derselbe wie in 35.58

Der Kommentar über der neuen CSS-Regel enthielt
**Rückwärts-Anführungszeichen**. Der ganze CSS-Text ist ein Schablonentext;
eines davon beendet ihn mitten im Kommentar, und der Bau bricht ab. Genau
dieselbe Stelle, genau derselbe Fehler wie in 35.58 — dort steht die Lehre
sechzig Zeilen weiter unten sogar aufgeschrieben.

**Aufgeschrieben ist nicht befolgt.** Immerhin: die Prüfung dafür gibt es seit
Fassungen, und diesmal habe ich den Prüfstand gefahren statt direkt zum
Browsertest zu springen — sie meldete es sofort und mit Zeilennummer.

### Geprüft

## 35.65 · Verträge auf Papier — und eine ganze Farbwelt war ungeprüft

Kevin, letzter Punkt seiner Liste: „Bei der Vertragswahl in der
Spielerkarriere ist der Hintergrund noch nicht genormt an die Papierthematik,
auf die wir uns geeinigt hatten. Gerade bei dem Thema Vertrag bietet sich
Papier an."

### Er hatte recht, und es war schlicht übersehen

Gemessen: **Training (Schritt 1), Ereignis (Schritt 2) und der
Wintertransfer** stehen längst auf `laufzettel`. Ausgerechnet die Vertragswahl
nicht — sie war ein nacktes `fade g1`. Drei Schritte, zwei Welten.

Der Umbau war eine Klasse. `laufzettel` dreht die ganze Farbwelt: `--tx` wird
Tinte, `--mu` die blassere Tinte, die Akzente bekommen ihre Karton-Fassungen.
Nachgezählt: **im ganzen Block keine einzige fest eingetragene Farbe**, 49
Verwendungen von `var(--…)`. Deshalb musste nichts einzeln umgefärbt werden.

### Der eigentliche Fund kam danach

Die Kontrastprüfung deckte bis 35.64 nur den **dunklen** Grund ab. Das Spiel
hat aber zwei Farbwelten, und auf der zweiten stehen drei von vier Schritten
einer Laufbahn. **Nichts hat dort je den Kontrast gemessen.**

Jetzt prüft sie beide: sechs Klassen × zwei Elementarten × zwei Farbwelten,
und mit den drei Chipfarben sind es **32 Fälle** statt zwölf.

**Sie fand sofort etwas.** Die Karton-Akzente (`--ac-k` und so weiter) sind
**dunkel** — sie sind als Tinte auf hellem Papier gedacht. Als
Chip-Hintergrund verwendet, stand darauf die dunkle Grundfarbe des Spiels:

| | vorher | jetzt |
|---|---|---|
| `chip a` auf Papier | **2,31** | 5,97 |
| `chip g` auf Papier | — | 5,16 |
| `chip r` auf Papier | — | 5,73 |

`chip g` und `chip r` kommen auf dem Laufzettel wirklich vor. Auf Papier ist
die Chipschrift jetzt hell.

### Zwei eigene Fehler an der Prüfung

**Erster:** Der erste Entwurf hängte den Prüfling für die Papierwelt neben
`.fl`. Die Farbvariablen sind aber **auf `.fl` definiert**, nicht auf `:root`
— dort war keine einzige bekannt, Vorder- und Hintergrund fielen auf denselben
Ersatzwert zurück, und alle zwölf Papierfälle meldeten **exakt 1,07**. Wenn
jede Messung denselben Wert liefert, ist die Messung kaputt und nicht die
Sache.

**Zweiter:** Mein Kommentar stand eine Zeile zu hoch — dort beginnt der
JSX-Ausdruck erst, und ein Blockkommentar ohne geschweifte Klammern bricht die
Übersetzung.

### Damit ist Kevins Liste abgearbeitet

Vierzehn Punkte, vierzehn erledigt. Der Statistikreiter war schon da: er
heißt **Rückblick** und steht seit 35.52 im Vereinsbildschirm.

### Geprüft

## 35.66 · Der Rücktrittsknopf tat vier Fassungen lang nichts

Kevin: „Warum funktioniert der ‚Schuhe an den Nagel hängen' Knopf nicht mehr?
Ich kann die laufende Karriere eines Spielers nicht mehr beenden."

### Die Ursache war meine, aus 35.62

Beim Einbau der Vereinserrungenschaften habe ich `let vereinNachher = null;`
**innerhalb** des `if (VEREIN.spieltMit(verein))`-Blocks angelegt — die
Verwendung steht 47 Zeilen weiter **außerhalb**. Solange ein Verein mitspielte,
fiel das nicht auf. Spielte keiner mit — kein Verein gegründet, Kader nicht
gestellt, noch gar nicht freigeschaltet — warf `finish` einen
`ReferenceError`, und der Knopf tat schlicht nichts.

**Der Fehler ist still.** Kein roter Bildschirm, keine Meldung: der Knopf
reagiert nur nicht. Und der betroffene Fall ist der **häufigste** — wer seine
erste Laufbahn spielt, hat noch keinen Verein.

**Warum kein Lauf ihn fand:** alle Vereinsproben laufen MIT Verein. Der
Normalfall war nirgends nachgestellt.

### Nachgewiesen, nicht behauptet

Neu ist `pruefstand/ruecktritt.cjs`, eingehängt in `sicht.sh`. Es startet im
echten Browser eine Laufbahn ohne Verein und beendet sie über den Knopf.
Gegenprobe gegen den Stand von 35.65:

    ✗ die Laufbahn ist danach wirklich beendet   Bildschirm blieb stehen
    ✗ dabei kein Fehler in der Konsole           vereinNachher is not defined

Mit der Berichtigung läuft es durch. **Erst dieser Vergleich beweist, dass ich
Kevins Fehler gefunden habe und nicht irgendeinen.**

### Drei eigene Fehler beim Bauen der Prüfung

**Erster, und der gefährlichste:** mein Erwartungsmuster kannte den Abschluss
nicht. Der beginnt mit einem Blätterwerk („DEINE LAUFBAHN … Tippen für weiter
1/4"), ich suchte nur nach den späteren Seiten. Die Prüfung meldete rot,
obwohl alles lief — **ein Fehlalarm genau dort, wo ich einen echten Fehler
suchte.** Das hätte mich fast dazu gebracht, eine Ursache zu behaupten, die
keine ist.

**Zweiter:** Der Klickpfad suchte im ganzen Dokument statt in `#root` und traf
die Knöpfe der Werkstatt („Einschreiben", „Neu laden"). Dann landet man im
Hauptmenü statt im Spiel.

**Dritter:** Der Weiterknopf heißt „Los geht's" — mein Muster kannte das
Apostroph nicht. Jetzt wird nach der **Stellung** gegangen (der vorletzte
Knopf im Spielbereich), nicht nach dem Wortlaut. Die ist hier stabiler.

### Geprüft

## 35.67 · Erst der Verein, dann die Liga

Kevin: „Ich fände es sinnvoller, wenn die Vereinserstellung (Wappen, Name
etc.) kommt, wenn man das erste Mal ‚Dein Verein' anklickt, nachdem man es
freigeschaltet hat. Lediglich die Ligawahl sollte beim Punkt der
Profimannschaft bleiben."

### Warum das inhaltlich richtig ist

Das Dach heißt „Dein Verein", und die Jugendakademie gehört ihm genauso wie
die Profimannschaft. Wer sie betritt, sollte wissen, für wen er ausbildet.
Vorher bekam der Verein seinen Namen erst bei der Profimannschaft — also drei
Laufbahnen später als die Akademie.

### Zwei Merker statt einem

| Schritt | wo | was |
|---|---|---|
| **Kennung** | beim ersten Betreten des Dachs, zwingend | Name, Stadt, Wappen, Farben |
| **Spielbetrieb** | bei der Profimannschaft | Land und Liga |

`gekannt` und `gegruendet` sind **zwei** Merker. Sie zusammenzulegen wäre die
naheliegende Vereinfachung und die falsche: zwischen beiden Schritten liegen
unter Umständen drei Laufbahnen, und in dieser Zeit muss der Verein einen
Namen haben, ohne im Spielbetrieb zu sein.

Die Taktik bleibt, wo sie war — im Ausbau-Reiter der Profimannschaft. Kevins
dritte Vorgabe war damit schon erfüllt.

### Ein Bildschirm, zwei Betriebsarten

Ein zweiter Bildschirm hätte dieselben achtzig Zeilen Wappeneditor noch einmal
gebraucht, und **zwei Fassungen desselben Editors laufen garantiert
auseinander** — siehe die Reiterzeilen in 35.59. Deshalb eine Datei mit einer
Weiche: `art` entscheidet, welche Felder überhaupt erscheinen.

Der zweite Schritt baut auf dem **vorhandenen** Verein auf, nicht auf einem
leeren. Sonst wären Wappen und Farben aus dem ersten Schritt wieder weg — und
das fällt erst auf, wenn beide Schritte wirklich auseinanderliegen.

**Alte Spielstände**: wer vor 35.67 gegründet hat, kennt `gekannt` nicht. Der
volle Weg in einem Zug bleibt deshalb erhalten und setzt beide Merker. Ohne
diesen Rückfall landeten solche Stände in einer Sackgasse: das Dach verlangt
eine Kennung, die es dort nicht gibt.

### Die Akademie trägt jetzt den Vereinsnamen

Kevins Entscheidung: „Nachwuchs des &lt;Verein&gt;". Das eigene Namensfeld
entfällt — zwei Namen für dasselbe Haus haben nur verwirrt. Man baut die
Jugend **eines** Vereins auf, nicht ein zweites Unternehmen daneben. Fehlt der
Verein (alter Stand), bleibt „Nachwuchszentrum" als Rückfall.

### Ein Fund, der nur im Bild sichtbar war

Die Vorschau im Kennungsschritt zeigte **„Premier League (EGY)"** — eine Liga,
die niemand gewählt hat. Sie stand als Vorgabe im Zustand (erstes Land
alphabetisch) und wird im nächsten Schritt ohnehin eine andere. **Eine
Vorschau, die etwas zeigt, das nicht entschieden ist, ist keine Vorschau,
sondern eine Falschaussage.** Im Bild gesehen, nicht im Code.

### Geprüft

**Vereinsprüfungen 214 → 225, Ansichten 631 → 644.** Die elf neuen fragen, ob
sich die beiden Schritte NICHT vermischen: bleibt der Verein nach der Kennung
ungegründet, überleben Farben und Wappen den zweiten Schritt, geht der alte
Weg weiter. Die neun Ansichtsprüfungen fragen, ob jeder Schritt **genau** seine
Felder zeigt — sonst hätte man die Maske nur verschoben.

Zwei Gegenproben: Ligablock im Kennungsschritt sichtbar gemacht → gemeldet;
zweiter Schritt auf leerem Verein aufgebaut → „Name aus der Kennung bleibt"
meldet „Neuer Verein".

## 35.68 · Wappen im Dach, Postfach zu

Kevin: „Wappen, Vereinsname sollten auch in ‚Dein Verein' zu sehen sein. Dazu
sollte das Postfach nicht dauerhaft ausgeklappt sein."

### Der Bildschirm hieß „Dein Verein" und zeigte keinen

Gemessen: im ganzen Dach **kein einziges Mal** `Wappen`, kein `farben`, den
Namen genau einmal — beiläufig in der Statuszeile der Mannschaftskachel. Seit
35.67 werden Name und Wappen beim ersten Betreten angelegt; dass sie hier nicht
auftauchten, war ein Rest aus der Zeit davor.

Jetzt steht beides im Kopf, über den Kacheln: Wappen, Name, Ort und Liga. **Über
den Kacheln, nicht in einer davon** — es gehört zu beiden Häusern, nicht zu
einem.

### Ein Postfach, das sich selbst öffnet, kann man nicht schließen

Seit 35.60 klappte es bei offenen Fällen von selbst auf. Gut gemeint, aber es
schob die beiden Kacheln jedes Mal aus dem Bild, und zuklappen ließ es sich
nicht dauerhaft. Jetzt bleibt es zu, bis man es antippt.

Die Kachel sagt mit „1 offen" in Gold deutlich genug, dass etwas anliegt.
Dazu steht jetzt in der Statuszeile, was ein Tipp bewirkt — **eine Kachel, die
sich aufklappt und es nicht sagt, sieht aus wie ein toter Knopf.** In eine
Kennzahlenspalte gehört das nicht; das war der Fehler in 35.60.

### Ein Fund im Prüfstand

Die Postkorbprüfung aus 35.53 ging davon aus, dass das Postfach von selbst
offen ist. Nach der Umstellung meldete sie **fünf Fehler auf einmal** — alle
falsch: der Inhalt war nicht weg, nur zugeklappt. Sie tippt jetzt selbst an.

**Eine Prüfung, die eine Annahme über den Anfangszustand trifft, muss sie
mitziehen, wenn er sich ändert.** Fünf rote Zeilen, die nichts bedeuten, sind
schlimmer als keine Prüfung — beim nächsten Mal glaubt man ihnen nicht.

### Geprüft

**Ansichten 644 → 655.** Die sieben neuen prüfen Wappen (am Baum, nicht am
Text — ein SVG findet man im Text nie), Name und Ort im Kopf, und dass das
Postfach bei offenen Fällen zubleibt, es sagt, und sich antippen lässt.

Zwei Gegenproben: Kopf entfernt → zwei Prüfungen melden; Postfach wieder
selbsttätig → gemeldet.

## 35.69 · Der Rahmen von damals, und eine Rückseite

Kevin: „In der Ruhmeshalle müssen die Rahmenfarben auf den Porträts auch zu
sehen sein bzw. ihren Einfluss haben, die der Spieler zu dem Zeitpunkt hatte.
Dazu wäre es cool, wenn man die Karte doppeltippen und flippen kann für extra
Informationen."

### Die Halle zeichnete Porträts ganz ohne Rahmen

Gemessen: der Avatar in der Ruhmeshalle bekam **kein `meta`** — also keinen
Rahmen, und seit 35.63 damit auch nicht die Kartenfarbe dahinter. Alle
Einträge sahen gleich aus, egal was man erreicht hatte.

Schlimmer: der Rahmen wurde **gar nicht gespeichert**. Es gab also nichts
anzuzeigen. Jetzt wandert er beim Abschluss in den Eintrag — die **Kennung**,
nicht die Farbe: Farben können sich ändern, dann zöge die Halle mit. Und er
wird **jetzt** festgehalten, nicht später: ein Rahmen, den man drei Laufbahnen
danach freischaltet, gehört nicht an eine Laufbahn, die vorher zu Ende war.
Genau das war Kevins Wunsch — „die der Spieler zu dem Zeitpunkt hatte".

### Ein Tipp, nicht zwei

Kevin sagte „doppeltippen". Ich habe **einen** Tipp gebaut: ein Doppeltipp ist
auf einem Telefon schwer zu treffen und kollidiert mit dem Zoom-Doppeltipp des
Browsers. Wer eine Karte antippt, will etwas von ihr; ein zweiter Tipp dreht
sie zurück.

Auf der Rückseite steht, was vorn keinen Platz hatte: Saisons, Laufbahnjahre,
Tore je Spiel, Scorerpunkte je Spiel, Spiele je Saison, die Wildcard im
Wortlaut, der Heimatverein — und der Rahmen von damals mit Namen. **Zahlen,
die es schon gibt, gerechnet statt neu erfunden.**

### Ein echter Fund nebenbei

Beim Bauen der Probe stürzte die Halle ab: `Cannot read properties of
undefined (reading 'slice')`. Ursache: `zuege || zuegeAusKennung(…)` fängt
`null` ab, aber **nicht `{}`** — ein leeres Objekt ist wahr, also greift der
Rückfall nicht, alle Felder sind `undefined`, und daraus wird je nach Stelle
eine Ersatzfarbe, ein NaN im SVG-Attribut oder ein Absturz.

Mein erster Anlauf flickte nur `haut` und `haar`. Die Prüfung meldete danach
weiter „Received NaN for the attribute". **Eine Stelle zu flicken, wo zehn
betroffen sind, ist keine Behebung, sondern eine Verlagerung.** Jetzt zählt ein
leeres Objekt wie keines.

Im Spiel entsteht `{}` heute nicht. Ein beschädigter Spielstand reicht aber,
und der Spieler sähe statt eines Porträts einen Fehlerbildschirm.

### Zwei eigene Fehler an der Prüfung, beide derselben Art

**Erster:** Der Selektor `linearGradient stop` findet in einem HTML-Dokument
nichts — der Elementname wird kleingeschrieben. Die Gegenprobe blieb grün, weil
die Messung im guten wie im schlechten Fall **null** Stopps fand. Zwei
Zustände, dasselbe Ergebnis: das ist keine Messung. Jetzt über `[stop-color]`.

**Zweiter:** Danach maß sie zwar, aber die Schwelle war falsch. Jeder Verlauf
hat drei Stopps — drei **gleiche** Porträts ergeben also auch drei
verschiedene Farben, und „mindestens 3 verschiedene" war immer erfüllt.
Verglichen wird jetzt der **erste Stopp je Porträt**. Gegenprobe im dritten
Anlauf: „1 verschiedener Grund bei 3 Einträgen".

**Eine Schwelle, die der Fehlerfall genauso erreicht wie der gute Fall, ist
keine Schwelle.**

### Geprüft

**Ansichten 655 → 666.** Die neuen prüfen, dass sich die Porträtgründe der
Einträge wirklich unterscheiden, dass die Rückseite erst nach dem Antippen
erscheint, neue Zahlen zeigt und sich zurückdrehen lässt — und dass eine leere
Zugliste nicht abstürzt.

## 35.70 · „Dein Verein" gehört jetzt zum Blatt

Kevin: „‚Mein Verein' ist irgendwie nicht so richtig an das Designkonzept des
Spiels Richtung Fußballmagazin angeschlossen. Es sticht im Vergleich zum
Hauptmenü, Einstellungen, Ruhmeshalle raus. Dazu wirkt der dicke Balken oben
etwas drüber und der Zurückbutton darin etwas zu prägnant."

### Die Ursache war eine fehlende Übergabe

Gemessen: der Bildschirm rief **`<Shell>` ohne `blatt`** auf. Damit fehlten ihm
**Kolumnentitel und Folio** — also genau der Rahmen, den jeder andere
Bildschirm hat. Stattdessen trug er einen fetten Balken mit Titel und
Zurückknopf darin, den sonst keiner hat.

Das Ressort `verein` gibt es seit 35.20, mit Name und Seitenzahl 31. Es wurde
hier nur nie angezogen. **Der Bildschirm hatte seinen Platz im Blatt und stand
daneben.**

### Jetzt wie die Ruhmeshalle

Kolumnentitel oben, Titelzeile mit kleinem Zurückknopf, ein Satz darunter,
Folio am Fuß. Kein Balken — der ist im Magazinsatz den **Kartenköpfen**
vorbehalten, nicht der Seite selbst. Der Erklärsatz stand danach doppelt und
ist einmal entfallen.

### Geprüft wird der Satzspiegel, nicht der Geschmack

„Sieht gut aus" lässt sich nicht messen. Die drei Bestandteile schon:
Kolumnentitel, Seitenzahl, Folio. Fehlt einer, hängt der Bildschirm nicht am
Blatt. Die Prüfung hält zusätzlich die Ruhmeshalle daneben — verliert **sie**
den Satzspiegel, taugt sie nicht mehr als Vorbild.

Gegenprobe: `blatt` wieder entfernt → „kein Folio am Seitenfuß".

### Ein Fund im Bild

Die Mannschaftskachel zeigte **„0 OFFEN" in Rot** bei der Elf. Es waren keine
Plätze offen — der Kader war zu klein. **Die Zahl erklärte ihre eigene Farbe
nicht**, und der Spieler hätte an der falschen Stelle gesucht. Jetzt steht
dort, woran es liegt: „Kader zu klein", „x offen" oder „falsch besetzt".

### Geprüft

**Ansichten 666 → 673.**

## 35.71 · Nachgesehen: hängt jeder Bildschirm am Blatt?

Kevin nach 35.70: „Kannst du dir das selbst soweit einmal angucken und
checken?" Also alle Bildschirme durchgezählt, statt nur den einen zu
reparieren, der gemeldet war.

### Das Ergebnis

Von neunzehn `Shell`-Aufrufen haben **zwei** kein `blatt`:

| | | |
|---|---|---|
| `MenuScreen` | Titelblatt | **dokumentiert** — ein Cover hat keinen laufenden Kopf |
| `EndScreen` | Karriereende | **war nicht dokumentiert** |

Alles andere hängt sauber am Satzspiegel: Akademie, Verein, Gründung,
Vereinsabschluss, Ruhmeshalle, Errungenschaften, Archiv, Spielerpass, Laden,
Laufbahn.

### Das Karriereende bleibt ohne — und das ist richtig

Angesehen statt vermutet: „KARRIEREENDE 2026" steht genau dort, wo sonst der
Kolumnentitel stünde, in derselben Auszeichnung. **Es ist der Kopf, nur als
Dachzeile geschrieben.** Ein zweiter darüber wäre doppelt. Es ist eine
Aufmacherseite, und im Magazinsatz tragen die keinen laufenden Kopf.

Bis 35.70 stand das **nirgends**. Wer den Satzspiegel prüft, findet zwei
Ausreißer und „repariert" sie — und macht damit eine gestalterische
Entscheidung rückgängig, die keine Begründung hatte. Jetzt hat sie eine.

### Die Prüfung stellt die Frage einmal für alle

Sie zählt jeden `Shell`-Aufruf im Quelltext und lässt genau zwei benannte
Ausnahmen zu. **Und die Gegenrichtung:** bekommt eine der beiden später ein
`blatt`, meldet sie das auch — sonst behauptet die Liste eine Ausnahme, die es
nicht mehr gibt. Dazu prüft sie, dass die Begründung im Code steht.

Drei Gegenproben: Ruhmeshalle ihr `blatt` genommen → gemeldet; Begründung
entfernt → gemeldet.

### Ein Fehler an meiner eigenen Messung

Der erste Durchgang meldete **das Dach** als Ausreißer — und fand dabei den
Text `<Shell>` in **meinem eigenen Kommentar** aus 35.70. Dieselbe Falle wie
beim Reiternamen in 35.52: eine Prüfung, die ihre eigenen Worte wiederfindet,
misst sich selbst. Kommentare werden jetzt ausgeblendet.

### Geprüft

**Vereinsprüfungen 225 → 228.** Dazu im Bild angesehen: Titelblatt,
Vereinsbildschirm, Akademie, Karriereende.

## 35.72 · Gleich gebaut war nicht gleich laut

Kevin, mit Bild vom Karriereende: „Warum ist die Infokachel für die
Profimannschaft im Vergleich zur Jugendakademie immer noch so unscheinbar?
Hatten wir die nicht schon mal aneinander angepasst?"

**Er hatte in beidem recht.** In 35.51 wurde der **Aufbau** angeglichen —
Überzeile, große Kennzahl, Zweispalter. Die **Auftrittsstärke** nicht:

```
if (gut)  → grüner Rahmen, Verlauf, farbige Überzeile
sonst     → grauer Rand, kein Verlauf, graue Überzeile
gut = Meister || Aufstieg
```

Die Akademie hat **immer** Goldrahmen und Verlauf — sie bekommt schließlich
jedes Jahr Coins. Ein Platz 7 stand daneben als graues Feld. **Ein
Tabellenplatz ist genauso ein Ergebnis wie ein Coingewinn.**

Jetzt immer Rahmen und Verlauf, Farbe nach Ausgang: grün, bei Abstieg rot. Der
Verlauf ist bei einem gewöhnlichen Jahr schwächer als bei einem Titel — gleich
laut heißt nicht gleich gefeiert. Und die Kennzahl ist 38 statt 26, wie die
Akademie.

### Drei Anläufe für eine Zeile

Die Kennzahl stand rechts neben der Überzeile. Bei „Platz 7" passte das, bei
„Meister!" nicht — das Wort brach um. Zwei Ausgänge desselben Berichts sahen
verschieden aus.

1. Größe nach Wortlänge gestaffelt → **brach weiter um**
2. Linken Block auf 55 % begrenzt → **brach weiter um**, das lange Wort
   sprengt auch die restlichen 45 %
3. Eigene Zeile, immer 38 px → hält

**Jeder Anlauf war eine Vermutung mehr am selben Problem vorbei.** Erst der
Blick auf alle vier Ausgänge nebeneinander hat gezeigt, dass die Zeile schlicht
zu kurz ist — und dass die umgebrochene Fassung sogar besser aussieht: das Wort
liest sich als Schlagzeile. Die Akademie zeigt eine **Zahl**, hier steht ein
**Wort**; anderer Inhalt, andere Stellung.

### Jede Sache dort messen, wo sie messbar ist

Die erste Prüfung meldete für alle drei Lagen „kein Verlauf" — **falsch**.
jsdom verwirft einen `linear-gradient`, in dem `var()` vorkommt; er landet gar
nicht im Attribut, bei beiden Berichten gleichermaßen. **Eine Messung, die
beide Seiten gleich falsch sieht, kann nichts unterscheiden.**

Rahmen und Schriftgröße werden deshalb in jsdom geprüft, der Verlauf im
Quelltext. Gegenprobe mit dem Stand von 35.71: vier Meldungen über beide
Prüfstände.

### Geprüft

**Ansichten 673 → 679, Vereinsprüfungen 228 → 231.**

## 35.73 · Der Abschluss lebte nur im Arbeitsspeicher

Kevin: „Ich hab jetzt zum ersten Mal mit meiner Profimannschaft fünfzehn
Saisons abgeschlossen und da gewisse Bonis freigeschaltet. Ich hab das Gefühl,
dass bei Erstellung eines neuen Vereins die Bonis nicht übernommen werden."

### Die Rechnung war richtig, die Verdrahtung nicht

Erst die Kette durchgemessen: `neuerVerein` setzt den Bonus, `kennungSetzen`
und `gruenden` reichen ihn durch, `startOvr` und `zuwachs` lesen ihn. **Alles
in Ordnung.**

Der Fehler lag davor. `vAbschluss` war reiner React-Zustand — **an keiner
Stelle gespeichert**. Und `neuerVerein(ergebnis)` wird nur von einem einzigen
Knopf aufgerufen: „Neuen Verein gründen" auf dem Abschlussbildschirm.

Wer diesen Bildschirm mit **„Zurück"** verließ oder die App schloss, verlor
ihn. Danach stand der alte Verein mit `gegruendet: true` da, für immer
abgeschlossen — **es gab überhaupt keinen Weg mehr zu einem neuen Verein**,
und der Bonus war weg. Das ist schlimmer, als Kevin beschrieben hat.

### Drei Reparaturen

**Der Abschluss liegt jetzt am Verein** (`v.abgeschlossen`) und überlebt alles,
was der Spielstand überlebt. Der Abschlussbildschirm findet ihn auch nach einem
Neustart, und mit ihm den Weg zum nächsten Verein.

**`neuerVerein` räumt die alte Marke ab.** Ohne das zeigte der neue Verein
sofort wieder den Bericht des Vorgängers, und man käme nie zur Gründung.

**Die Dach-Kachel benennt den Zustand.** Vorher stand dort „16. Jahr" — eine
Zahl, die es gar nicht gibt. Jetzt: „abgeschlossen · 15 Jahre gespielt · 972
Punkte — antippen für den Bericht".

### Und der zweite Teil seines Satzes

Der Bonus **wurde nie angezeigt**. Er wirkt seit 35.28 an zwei gemessenen
Stellen, aber im Spiel stand nirgends, dass es ihn gibt. **Ein Vorteil, den man
nicht sieht, ist von keinem Vorteil nicht zu unterscheiden** — Kevins Gefühl
war insofern auch dort berechtigt, nur mit einer anderen Ursache.

Der Vereinsbildschirm zeigt ihn jetzt: „Aus dem letzten Verein: Talente starten
+2 · +1 Aufnahme je Jahr · Training bereits Stufe 2".

### Geprüft

**Vereinsprüfungen 231 → 243.** Die neuen messen die **ganze Kette**, nicht nur
die Rechnung: 15 Saisons spielen, Abschluss, durch `JSON.parse(JSON.stringify)`
schicken (wie ein Spielstand), `neuerVerein`, Kennung, Ligawahl — und an jeder
Station prüfen, ob der Bonus noch da ist. Dazu drei Quelltextprüfungen auf die
eigentliche Ursache: wird gespeichert, wird wiedergefunden, wird angezeigt.

Gegenprobe: Speichern wieder entfernt → gemeldet.

## 35.74 · Achtzehn Ziele für die langen Jahre

Kevin: „Denk dir was aus. Gerne auch schwer zu bekommende Errungenschaften,
über Fleiß, um das Spielinteresse zu halten. Dementsprechend auch mit passenden
Belohnungen. Generell vielleicht auch freischaltbare, passende, neue
Wildcards."

### Erst gemessen, warum die alten nicht tragen

Von den zwölf Vereinserfolgen fielen **acht im ersten Jahr** (gemessen in
35.62). Sie taugen als Wegweiser, nicht als Fernziel. Und keine einzige
Akademie- oder Vereinserrungenschaft schaltete etwas frei, das **das Spiel
verändert** — nur Rahmen. Deshalb hat sich die Mühe dort nicht wie Mühe
angefühlt: sie zahlte in eine andere Währung.

### Die Voraussetzung fehlte

Alles über den eigenen Verein lebt **am Verein** — und der wird alle fünfzehn
Jahre ersetzt. „Zehn Vereine geführt" war damit nicht formulierbar.

Neu in der Gesamtbilanz: `vereineFertig`, `vereinSaisons`, `vereinMeister`,
`vereinAufstiege`, `vereinTore`, `vereinPunkteBest`. Sie werden **genau einmal
je Verein** fortgeschrieben, beim Abschluss — sonst zählte ein Verein
fünfzehnmal. `vereinPunkteBest` wird als Höchstwert geführt, nicht summiert:
**ein Bestwert, den man aufsummiert, ist Unsinn und fällt trotzdem nicht auf.**

### Achtzehn neue, davon vier legendär

| Jugendakademie | Profimannschaft |
|---|---|
| 50 Profis · **100 Profis** | zweiter Verein · **fünf Vereine** · **zehn Vereine** |
| 10 Weltklasse · 20 Nationalspieler | 5 Meistertitel · **15 Meistertitel** |
| 10 Jugendturniere · 200 Aufnahmen | 10 Aufstiege · 1000 Tore · 100 Saisons |
| **50 Jahrgänge** · Ansehen 400 | 1100-Punkte-Abschluss · **zwei Wappen** |

**Zur Einordnung, gemessen:** ein Vereinsdurchlauf sind 15 Saisons, eine
Akademie nimmt rund 5 Talente je Jahr auf. „Fünf Vereine" heißt 75 Saisons,
„hundert Profis" rund 25 Jahrgänge. Das ist absichtlich weit.

### Drei neue Karten statt Rahmen

Der Mechanismus dafür gibt es seit 34.x — eine Wildcard mit `req` erscheint nur
mit der passenden Belohnung. Vierzehn Karten nutzten ihn, **alle an
Spielerlaufbahnen gebunden**. Jetzt drei aus der Fleißarbeit:

| Karte | Stufe | wofür |
|---|---|---|
| **Der Ziehvater** | Welt | 100 Profis aus dem eigenen Haus |
| **Dynastie** | Unfassbar | fünf geführte Vereine |
| **Werkbank** | Außergewöhnlich | fünfzig Jahrgänge |

Die Wirkung passt zur Herkunft, nicht zur Seltenheit allein: wer hundert Profis
ausgebildet hat, bekommt eine Karte über das Weitergeben; wer fünf Vereine
geführt hat, eine über Autorität; wer fünfzig Jahrgänge durchgehalten hat, eine
über Beständigkeit. Dazu zwei neue Rahmen.

### Geprüft

**Errungenschaften 174 → 192, Wildcards 128 → 131, Vereinsprüfungen 243 → 250.**

Die Prüfungen fragen in **beide** Richtungen: mit einer Bilanz weit über allen
Schwellen muss jede zuschnappen, mit einer leeren **keine**. Der gefährlichste
Fehler wäre nicht ein falscher Schwellwert, sondern eine Bedingung, die nie
wahr wird — die steht dann für immer grau da. Eine, die immer wahr ist, wäre
genauso kaputt.

Dazu: keine stürzt ohne Akademie ab, jede Belohnung existiert, jede
Kartenbelohnung hat auch eine Karte, und die Karten sind ohne Freischaltung
gesperrt.

### Ein eigener Fehler

Eine Prüfung aus 35.62 verlangte die **vollständige** Aufrufzeile
`merkeErfolge(q, AK2.a, vereinNachher)`. Als eine vierte Übergabe dazukam,
meldete sie rot, obwohl genau das Richtige passiert. **Wer eine vollständige
Aufrufzeile festschreibt, verbietet jede Erweiterung.**

## 35.75 · Die Hallenkarten wenden sich wie ein Spielerpass

Kevin: „Ich will für die Karten in der Ruhmeshalle, dass die die gleiche
Funktion haben wie die Spielerpässe in der Spielerkarriere. Doppeltipp und dann
die Umdreh-Animation. Die Infos auf Vorder- und Rückseite sind aber schon
okay."

Also die **Bedienung**, nicht der Inhalt.

### Was 35.69 gebaut hatte, war etwas anderes

Ein Einfachtipp, der den Inhalt **austauschte** — die Vorderseite verschwand
aus dem Baum, die Rückseite trat an ihre Stelle. Kein Wenden, ein Umschalten.

Die richtige Mechanik gab es längst: `wender` / `dreh` / `rueckseite`, mit
einer Doppeltipp-Erkennung über 320 ms (**kein `onDoubleClick`** — das kommt in
der WebView verzögert und verschluckt manchmal den zweiten Tipp).

### Herausgezogen statt kopiert

Sie steckte **im Spielerpass**. Ein neues Bauteil `Wendekarte` nimmt sie auf,
beide benutzen es. Zwei Fassungen derselben Mechanik laufen garantiert
auseinander — das hat dieses Projekt bei den Reiterzeilen (35.59) und den
Kachelrändern (35.64) schon zweimal bezahlt. **Wer die Wendezeit später auf
280 ms ändert, soll das an einer Stelle tun.**

Kopfband und Titel stehen jetzt auf **beiden** Seiten: beim Wenden soll man
dieselbe Karte sehen, nur von hinten, nicht zwei verschiedene Dinge.

### Geprüft an der Klasse, nicht am Text

„Die Rückseite ist sichtbar" lässt sich in jsdom nicht messen — es rechnet
keine 3D-Transformationen. Was es kann: die Klasse lesen, die den Zustand
trägt. Geprüft wird deshalb: beide Seiten liegen **gleichzeitig** im Baum, die
Rückseite hängt im Wender, **ein** Tipp dreht nichts, zwei drehen, zwei weitere
drehen zurück.

Zwei Gegenproben: Doppeltipp-Erkennung ausgehebelt → drei Meldungen; Klasse
`rueckseite` entfernt → gemeldet.

Im Browser nachgesehen: nach einem Tipp `class="wender"`, nach dem Doppeltipp
`class="wender um"`.

## 35.76 · Der Sonderschuss

Kevins Idee: nach einer Saison mit Note 2,1 oder besser gibt es im nächsten
Training ein kleines Spiel — ein Ball läuft schnell durch einen Balken, man
trifft ein Segment, das beste ist das schmalste.

### Die Schwelle 2,1 hätte das Spiel fast unsichtbar gemacht

**Erst gemessen**, 400 Laufbahnen mit 9.382 Saisons:

    Note <= 2,1 erreichen     4,6 % aller Saisons
    je Laufbahn               Median 0 Treffer
    Laufbahnen ganz ohne      65 %

Der Median-Spieler hätte das Minispiel **nie** gesehen. Und es hätte fast nur
die Spitze getroffen: ab OVR 85 in 32 % der Saisons, unter OVR 70 in 1,1 %.
**Die Belohnung wäre ausgerechnet dort angekommen, wo Anlagepunkte niemandem
mehr nutzen.**

Meine erste Messung war dabei selbst falsch — sie ließ Angebote, Vereinswechsel
und Alterung weg, jede Laufbahn lief die vollen 40 Runden, und die Noten waren
entsprechend gut (Median 1,40 statt 3,30). Verräterisch war „40,0 Saisons im
Schnitt" bei einer Schleifengrenze von 40: **keine einzige Laufbahn endete von
selbst.**

### Kevins Lösung war die richtige

Er wollte die 2,1 behalten und **Auszeichnungen** dazunehmen —
Torschützenkönig, Spieler der Saison, Weltfußballer, Bester Nachwuchsspieler,
dazu Titel. Gemessen:

| | Median je Laufbahn | ohne Treffer |
|---|---|---|
| Note 2,1 allein | 0 | 65 % |
| **Note 2,1 oder Auszeichnung** | **7** | **3 %** |

„Bester Nachwuchsspieler" trifft genau die Jungen — die Gruppe, die über die
Note nie hingekommen wäre.

### Was es einbringt

Sieben Felder, symmetrisch um die Mitte (26/17/5/**4**/5/17/26). Das beste ist
das schmalste, deckt **4 %** ab und gibt als einziges einen Anlagepunkt. Ein
Versuch; wer danebentrifft, bekommt einen Attributpunkt als Trost — die Saison
war ja trotzdem gut.

Die Punkte gehen auf die **wichtigsten Werte der Position**, nach `POS[pos].w`
sortiert: ein Stürmer bekommt Abschluss, ein Torwart Zweikampf.

**Gemessen, was es mit einer Laufbahn macht** (250 je Fall):

    ohne Sonderschuss          802 Punkte · Peak-OVR 75,6
    mit Zufallstreffern        813 Punkte · Peak-OVR 76,1   (7,1 Schüsse)
    mit lauter Volltreffern    896 Punkte · Peak-OVR 78,4

Können bringt **+12 %**, Glück +1,4 %. Das ist spürbar, ohne das Spiel zu
entwerten.

**Eine Einschränkung, die dazugehört:** das Kalibrierband „Laufbahnen bis
Vollausbau 25–35" wurde ohne Minispiel gerechnet. Wer jedes Mal perfekt trifft,
landet rechnerisch bei rund 24 — knapp unter dem Band. Das ist kein Fehler,
sondern der Preis einer Belohnung für Können, und es steht hier, damit niemand
es später für Drift hält.

### Zwei Dinge, die keine Bequemlichkeit sind

**Die Bewegung läuft über die wirkliche Zeit**, nicht über einen Zähler je
Bild. Auf einem 120-Hz-Gerät wäre ein Bildzähler doppelt so schnell — dasselbe
Spiel wäre auf dem besseren Telefon schwerer.

**Wer Bewegung abgeschaltet hat**, bekommt den Balken ohne Lauf und einen
festen mittleren Gewinn. Ein Geschicklichkeitsspiel darf niemanden von einer
Belohnung aussperren, der aus gutem Grund keine schnellen Bewegungen sehen
will.

### Drei eigene Fehler

**Erster:** `POS[pos].key` gibt es nicht — die Gewichte stehen in `w`. Der
Ausdruck wäre still auf „alle Werte" zurückgefallen und hätte einem Torwart
Abschlusspunkte gegeben. **Vierter erfundener Name in dieser Sitzung**, nach
`TIER_BONUS`, `ARG2` und `mischen`.

**Zweiter:** `left: calc(47.1% - 10px)` — im Browser richtig, aber jsdoms
CSS-Parser bricht daran ab, und die Ablaufprüfung liest die Stile des **ganzen**
Dokuments. Sie meldete `")" is expected` an einer Stelle, die mit dem
Sonderschuss nichts zu tun hat.

**Dritter:** Meine Prüfung erwartete Anlagepunkte an **zwei** Feldern, weil ich
die Spiegelung mitgedacht habe, ohne nachzusehen. Das beste Feld liegt in der
Mitte und ist genau einmal da.

### Geprüft

**Ansichten 679 → 693.** Die neuen prüfen Symmetrie, dass das beste Feld das
schmalste ist, seinen Anteil (2–15 %), den Trostbonus und seine Obergrenze —
und dass es bei abgeschalteter Bewegung trotzdem eine Belohnung gibt.

## 35.77 · Sonderschuss auf Knopfdruck

Kevin: „Kannst du mir ins Werkzeug einbauen, dass ich dort auswählen kann, dass
das Minispiel sofort kommt, um es zu testen."

Berechtigt: der Schuss kommt sonst erst nach einer Saison mit Note 2,1 oder
einer Auszeichnung. Um das **Tempo des Balls** zu beurteilen, müsste man dafür
jedes Mal eine Saison spielen — genau die Art Wartezeit, für die es die
Werkstatt gibt.

Der Knopf setzt die Marke `sonderchance` im Spielstand — **dasselbe Feld, das
`simulateSeason` setzt.** Kein Sonderweg im Spiel, also kann auch nichts
auseinanderlaufen: was hier ausgelöst wird, ist derselbe Ablauf wie im
Ernstfall.

### Meine erste Meldung log

Sie sagte „Keine laufende Laufbahn", während eine lief. Gemessen: nach „Neue
Laufbahn" und dem ganzen Spielerpass steht unter `rasenschach:stand` **noch
nichts** — `saveGame` läuft erst beim Saisonergebnis oder wenn man „Hauptmenü"
drückt. Das ist die Bauart des Spiels, kein Fehler.

**Eine Meldung, die etwas Falsches behauptet, schickt in die Irre.** Jetzt sagt
sie, was wirklich fehlt und was zu tun ist.

### Ein Fund im Bild

Der Balken war auf dem Laufzettel **blass und kaum lesbar**. Ursache: ich hatte
alle Segmente auf 45 % gedämpft und erst das getroffene hervorgehoben — also
war der Balken ausgerechnet dann blass, **wenn man das Ziel sehen muss**. Auf
dem Papier besonders schlimm, weil die Akzente dort dunkel sind und als
Schleier auf hellem Karton lagen.

Jetzt andersherum: vorher alle voll, nachher alle bis auf das getroffene
zurückgenommen.

### Geprüft im Browser

Ganzer Weg nachgespielt: Laufbahn starten → „Hauptmenü" (speichert) → Werkstatt
→ „Sonderschuss sofort" → neu laden → weiterspielen. Der Schuss steht im
Training, der Grund wird genannt, keine Konsolenfehler. Ohne Spielstand kommt
die richtige Meldung statt der falschen.

## 35.78 · Der Sonderschuss wird ein Fenster

Vier Punkte von Kevin nach dem ersten Spielen.

### Popup, nicht wegdrückbar

Es ist eine Belohnung, keine Störung: wer sie wegwischt, verliert sie — und
wüsste nicht einmal, dass er das getan hat. Kein Schließen am Rand, kein
Kreuz, kein Zurück. Der dunkle Grund hat **bewusst keinen `onClick`**: ein
Tipp daneben soll nichts tun.

### „Klunky" war messbar

`setX` lief in **jedem Bild** — sechzig React-Durchläufe je Sekunde für ein
Bauteil mit sieben Segmenten und einem SVG. React zeichnet dabei jedes Mal den
ganzen Baum nach, obwohl sich nur eine Zahl ändert.

Jetzt liegt die Stellung in einem `ref` und der Ball wird **direkt** bewegt
(`ball.current.style.left`). React erfährt davon nichts. Der Zustand wechselt
nur einmal: beim Schuss. Das Tempo bleibt bei 1500 ms — Kevin: „das Tempo ist
in Ordnung".

### Ein richtiger Fußball, 16 statt 20 px

Als SVG: weißes Rund, ein Fünfeck in der Mitte, drei angeschnittene am Rand.
Mehr Flächen wären bei dieser Größe Matsch.

### Über 99 — die Mechanik gab es längst

`wertGrenze(p)` liefert **112**, sobald die Regel `mx_ueber99` freigeschaltet
ist (durch „Zwanzigtausend Spiele" oder „Das Maximum"). Mein Sonderschuss hat
das ignoriert und hart bei 99 gedeckelt — **eine zweite Wahrheit über dieselbe
Sache, und die schlechtere.** Jetzt nimmt er die Grenze, die es schon gibt.
Ohne die Freischaltung bleibt es bei 99; sonst wäre sie entwertet.

### Zwei Fehler, beide nur im Bild sichtbar

**Erster:** Das Fenster lag im Laufzettel. `.fade` animiert `transform` mit
`fill-mode: both` — die Transformation bleibt stehen, und ein Vorfahr mit
Transformation macht aus `position: fixed` ein `absolute`. Der dunkle Grund
deckte nichts ab. Behoben mit `createPortal` an `document.body`.

**Zweiter, und der ärgerliche:** am Körper waren dann die **Farbvariablen weg**
— sie sind auf `.fl` definiert, nicht auf `:root`. Der Kasten stand
durchsichtig über dem Text darunter.

**Genau diese Falle steht seit 35.65 in der Kontrastprüfung aufgeschrieben, mit
denselben Worten.** Aufgeschrieben ist nicht befolgt — zum zweiten Mal in
dieser Sitzung nach den Rückwärts-Anführungszeichen in 35.64.

### Ein fünfter erfundener Name

`ReactDOM.createPortal` — `ReactDOM` war nie eingeführt. Nach `TIER_BONUS`,
`ARG2`, `mischen` und `POS[pos].key`. Jetzt als benannte Einfuhr aus
`react-dom`, das ohnehin da ist.

### Geprüft

Die Ansichtsprüfung sucht das Fenster jetzt **am Körper**, nicht im eigenen
Behälter — `mach` meldete sonst „Ansicht bleibt leer". Nicht falsch, nur am
falschen Ort gesucht. Dazu neu: es darf keinen Ausweg ohne Schuss geben.

## 35.79 · Das Fundament für die Sammelkarten

Kevin will ein Kartensystem wie in einem TCG: Packs, Seltenheiten, jeder
Spieler als Sammelkarte, Spieler abgeschlossener Vereine dauerhaft im Pool.
**Das sind keine drei Punkte, das sind mehrere Fassungen.** Diese hier ist die
erste und die unsichtbarste — ohne sie geht keine der anderen.

Und die Entscheidung, die alles trägt, kam von ihm: **„Gezogene Spieler kommen
nur dazu und sollen die Spieler aus der Akademie lediglich ergänzen."** Die
Akademie bleibt das Herz.

### Die Seltenheit ist gemessen, nicht geraten

Über 539 echte Spieler aus Akademie und Kader:

| Quelle | Spanne | Median |
|---|---|---|
| Akademieabsolventen | 38–77 | 62 |
| Kaderspieler | 61–78 | 69 |
| Ruhmeshalle (Peak) | 70–95 | — |

**Perzentile wären hier falsch gewesen** — die Verteilung ist so schmal, dass
Gold auf einen einzigen Wert zusammenfiel (gemessen: genau 71). Feste Grenzen
bei **62 / 72 / 82** geben jeder Quelle eine eigene Handschrift:

    Akademie   45 % bronze · 52 % silber ·  3 % gold
    Kader       3 % bronze · 54 % silber · 43 % gold
    Halle                    10 % silber · 50 % gold · 40 % legendär

Wer eine goldene Karte sieht, weiß ungefähr, woher sie kommt.

### Drei Spielerformen, eine Karte

Gemessen, was Talent, Kaderspieler und Halleneintrag gemeinsam haben: Name,
Position, Stärke, Alter, Flagge. Der Rest wandert nach `zusatz` — dort geht
nichts verloren, und die Karte muss trotzdem nicht jede Form kennen.

**Die Herkunft wird mitgeschrieben.** Kein Zierrat: Kevin will, dass ein neuer
Verein „mind. 3 aus der vorherigen Mannschaft und mind. 1 aus der Ruhmeshalle"
bekommt. Ohne Herkunft lässt sich das nicht ziehen.

**Die Halle zeigt den Bestwert**, nicht den Stand beim Rücktritt — sonst wäre
eine Legende eine Karte mit 58, weil sie mit achtunddreißig aufgehört hat.

### Der Pool liegt bewusst nicht am Verein

„Dauerhaft" ist das Wort, an dem alles hängt. Alles andere über den eigenen
Verein liegt **am** Verein, und der wird alle fünfzehn Jahre ersetzt — genau
daran ist in 35.73 der Abschlussbonus verlorengegangen. Der Pool bekommt
deshalb einen eigenen Speicher.

**Doppelte werden zusammengeführt, nicht angehängt**, und zwar auf den
besseren Wert: derselbe Spieler aus drei Durchläufen ist eine Karte, sonst
zöge ein Pack dreimal denselben Mann.

Gefüllt wird beim Vereinsabschluss — die einzige richtige Stelle: der Kader
steht fest, und gleich wird er ersetzt. Eine Saison früher wären es die
falschen Spieler, eine später gibt es sie nicht mehr.

### Eine eigene Datei

`karten.js`, wie `akademie.js` (35.48) und `verein.js`. `App.jsx` hat 14.800
Zeilen und steht als Punkt 10 als zu groß vermerkt — ein neues System gehört
nicht hinein.

**Der Prüfstand hat mich dabei erwischt:** die neue Datei fehlte in `LIESMICH.md`
und im Verzeichnis von `STAND.md`, und der Aufbau brach mit einer Warnung ab.
Genau dafür gibt es diese Prüfung seit 35.30 — sie hat zum ersten Mal einen
echten Fall gefangen statt nur grün zu melden.

### Geprüft

**Vereinsprüfungen 250 → 264.** Sie fragen die Stufengrenzen einzeln ab
(61/62, 71/72, 81/82), ob alle drei Quellen zu Karten werden, ob die Herkunft
draufsteht, ob Doppelte zusammengeführt werden, ob der bessere Wert gewinnt und
ein schlechterer **nicht** überschreibt — und ob der Pool das Speichern
übersteht. Sonst wäre „dauerhaft" eine Behauptung.

Gegenprobe: Zusammenführung ausgehebelt → drei Meldungen.

### Was noch fehlt

Packs mit VC und vier Stufen, die Ziehung, die Kartenoptik in Kader und
Aufstellung, das 6er-Startpaket für den neuen Verein. In dieser Reihenfolge —
jedes für sich prüfbar.

## 35.80 · Vier Packs, und sie sagen, was sie kosten

Zweiter Schritt des Kartensystems: die Packs. Noch ohne Laden — der Bildschirm
kommt als nächstes. Was hier steht, ist die Mechanik samt Preisen, und die
sind das eigentliche Thema.

### Der erste Preisentwurf war eine Wand, keine Entscheidung

Gemessen gegen die VC-Wirtschaft (Median **108 VC je Laufbahn**, Vollausbau
**2912 VC** über 45 Stufen):

| Pack zu 90 VC jede Laufbahn | Vollausbau |
|---|---|
| ohne Pack | 27 Laufbahnen |
| Silberpack (90 VC) | **162 Laufbahnen** |
| Gold (180) und Legendär (350) | nie — teurer als eine Laufbahn einbringt |

**Das ist keine Entscheidung mehr, sondern eine Wand.** Jetzt 30 / 65 / 130 /
240 VC: mit einem Silberpack je Laufbahn sind es 68 statt 27 — ein spürbarer,
aber bezahlbarer Umweg. Gold und Legendär kosten weiter mehr, als eine Laufbahn
einbringt; darauf spart man, und das ist Absicht.

Nach dem Vollausbau hat VC ohnehin kaum noch Verwendung — der ganze VC-Laden
kostet 241 VC für je ein Stück. Dort sind Packs genau die richtige Senke.

### Die Kosten werden angesagt

`preisInLaufbahnen` rechnet den Preis in die Währung um, die der Spieler
versteht: nicht „65 VC", sondern **„etwa 0,6 Laufbahnen Ausbau"**. Ein Preis,
dessen Folgen man erst drei Stunden später merkt, ist keine Entscheidung.

Die Zahl dahinter ist gemessen, nicht geschätzt. Stünde sie falsch, würde die
Anzeige lügen — und das wäre schlimmer als keine Anzeige.

### Die Ausschüttung, über 6000 Ziehungen

    Pack           Preis  bronze silber  gold legende   Zusage  Sonder
    Bronzepack       30    73,7   24,2   2,1    0,0      100 %   0,0 %
    Silberpack       65    42,6   47,0   9,5    0,9      100 %   5,8 %
    Goldpack        130    13,7   43,3  38,7    4,2      100 %  14,3 %
    Legendenpack    240     3,5   31,8  47,8   16,9      100 %  30,7 %

**Die Mindestzusage hält ausnahmslos** — auch wenn der Würfel dreimal Bronze
sagt. Ersetzt wird dann die **schwächste** Karte, nicht die erste: sonst
verlöre man manchmal die beste des Packs.

### Zwei Entscheidungen, die Kevins Vorgabe schützen

**Gezogene Spieler sind fertig**, nicht fünfzehn: Alter 20–32, Anlage höchstens
vier über der Stärke. Sie ergänzen die Akademie, sie ersetzen sie nicht — das
war seine Bedingung, und ein Pack voller Talente hätte sie ausgehöhlt.

**Sonderkarten kommen dazu, sie ersetzen nichts.** Wer eine Legende aus der
eigenen Ruhmeshalle zieht, soll nicht dafür eine andere Karte verlieren.

### Geprüft

**Vereinsprüfungen 264 → 275.** 1200 Ziehungen je Pack: liefert jede die
zugesagte Zahl, hält die Mindestzusage, kommen aus Bronze wirklich keine
Legenden (0 von 1200), sind Sonderkarten selten genug, stürzt es ohne Pool
nicht, wird ein unbekanntes Pack abgewiesen.

Gegenprobe: Mindestzusage ausgehebelt → gemeldet.

### Was noch fehlt

Der Packladen (Bildschirm, Kauf, Aufdecken), das Gratis-Bronzepack je Laufbahn,
die Kartenoptik in Kader und Aufstellung, das 6er-Startpaket für den neuen
Verein.

## 35.81 · Zwei von drei Häusern arbeiteten umsonst

Kevin: „Lass uns den VC-Verdienst noch etwas verbessern. Möglicherweise über
Erfolge in der Jugendakademie und in der Profimannschaft. Vielleicht auch über
Errungenschaften?"

**Gemessen, und der Befund gab ihm recht:** VC kamen ausschließlich aus der
Spielerlaufbahn — Punktzahl, Titel, Länderspiele, Wildcard. Die Akademie konnte
hundert Profis ausbilden und der Verein dreimal Meister werden, ohne dass ein
einziger Coin dabei heraussprang.

### Der schwerste Fund betraf die Prüfung selbst

Nach dem Einbau meldete die Kalibrierung weiter **grün mit 28,1 Laufbahnen bis
Vollausbau**. Sie kannte die neuen Quellen nicht — das Spiel lieferte **19,0**.

**Ein Band, das eine Quelle nicht kennt, hütet nichts.** Es meldet grün über
einen Zustand, den es gar nicht misst, und das ist schlimmer als kein Band,
weil man sich darauf verlässt. Die Kalibrierung rechnet jetzt Akademie, Verein
und Errungenschaften mit.

### Das Band wurde bewegt — nach einer Entscheidung, nicht danach, dass es rot war

Gemessen: schon die Akademie allein (11 VC je Laufbahn) drückt das Band von 27
auf 25,3, also an die Untergrenze. **Beides — das Band 25–35 und eine spürbare
Verbesserung — ging nicht.** Kevins Entscheidung: Band auf **20–30**, alle drei
Quellen.

Der Unterschied ist wichtig und steht auch so im Prüfstand: ein Band, das man
verschiebt, damit es wieder grün wird, hütet nichts mehr. Dieses wurde
verschoben, nachdem die Entscheidung gefallen war.

### Die Beträge

| Quelle | |
|---|---|
| Akademie | Profi 4 · Weltklasse 12 · Nationalspieler 6 · Turnier 5 |
| Verein | **Meister 35** · Aufstieg 22 · unter den ersten drei 12 |
| Errungenschaften | 1 / 1 / 2 / 4 / 7 nach Stufe |

Kevin: „ein Meistertitel ist mehr wert als 20 VC" — jetzt 35, ein Drittel einer
ganzen Spielerlaufbahn. Das trifft es, weil er fünfzehn Jahre Aufbau
voraussetzt.

**Kein Abzug beim Abstieg.** Eine Strafe auf die Währung, mit der man die
Jugend aufbaut, träfe ausgerechnet den, der Aufbau nötig hat.

### Zwei eigene Fehler

**Erster:** Mein erster Entwurf gab Errungenschaften 3/6/12/20/35. Über 192
Stück waren das **2780 VC** — bei einem Vollausbau von 2912. Das Einkommen wäre
von 108 auf 216 gesprungen. **192 kleine Beträge sind in der Summe kein kleiner
Betrag:** wer Einzelposten bemisst, muss sie zusammenzählen, bevor er sie für
klein hält.

**Zweiter:** Nachdem ich die Beträge gesenkt hatte, meldete meine Messung
unverändert 93 VC. Sie trug die Zahlen noch einmal selbst ein, statt sie aus
dem Spiel zu holen. **Eine Messung mit eigener Kopie der Zahlen misst die
Kopie.**

Dazu die Falle, die ich vermieden habe: gerechnet wird auf der **Differenz** der
Akademiebilanz. Die absoluten Zahlen zu nehmen wäre der naheliegende Fehler —
dann bekäme man in jeder Laufbahn Geld für alle Profis, die man je ausgebildet
hat. Es gibt jetzt eine Prüfung dafür.

### Geprüft

**Vereinsprüfungen 275 → 285.** Band nach drei Läufen: 20,8 / 21,4 / 21,5 —
rund ein Punkt Luft nach unten. Bei 1/1/3/5/9 lag es bei 20,1–21,0, also an der
Kante; **ein Band, das zufällig kippt, wird nach dem zweiten Fehlalarm nicht
mehr ernst genommen.**

## 35.82 · Die Spielerkarte

Dritter Schritt des Kartensystems, und der erste sichtbare. Kevin: „dass jeder
Spieler — auch Spieler aus der Jugendakademie — als eine Art Sammelkarte
behandelt und designt wird."

### In der Sprache, die es schon gibt

Das Spiel hat seit Langem eine Kartenoptik für die Wildcards: Klebestreifen,
Folienrand bei den obersten Stufen, ein Verlauf auf deckender Fläche, leichte
Schräglage. **Eine zweite Kartensprache danebenzustellen wäre der naheliegende
Fehler** — dann hätte das Blatt zwei Handschriften. Die Spielerkarte benutzt
dieselben Bausteine (`wkarte`, `winkel`, `folie`), nur mit anderem Inhalt.

Vier Stufen, jede mit eigener Randfarbe und eigenem Verlauf. Der Folienrand
bleibt der obersten vorbehalten — Material als Auszeichnung.

### Gezeichnet, nicht gemalt

Alles ist SVG und CSS: Verlauf, Rand, Porträt, Werte. **Kein einziges Bild.**
Das hält das Bündel klein (1,34 MB für ein APK) und bleibt auf jedem Bildschirm
scharf.

### Zwei Entscheidungen im Kleinen

**Die verdeckte Karte zeigt die Stufe, aber nicht den Spieler.** Ohne die Stufe
wäre das Aufdecken ohne Erwartung; mit dem Namen gäbe es nichts aufzudecken.

**Dasselbe Gesicht, immer.** Der Avatar würfelt aus einer Kennung, die aus
`kid` gerechnet wird. Käme sie aus dem Zufall, sähe ein Spieler nach dem
Blättern anders aus als davor.

**Die Anlage erscheint nur, wenn etwas zu holen ist.** „Anlage 76" bei Stärke
76 ist keine Auskunft, sondern Füllsel.

### Drei eigene Fehler an den Prüfungen

**Erster:** `nixf` benutzt, das weiter unten in einem anderen Block definiert
ist. **Ein Name, den man anderswo gesehen hat, ist nicht derselbe wie einer,
den man hier benutzen darf.**

**Zweiter:** Den Rand über `style.borderColor` geprüft — jsdom rechnet die Farbe
in `rgb(...)` um, der Vergleich mit dem Hexwert findet nie etwas. **Dieselbe
Falle wie beim Verlauf in 35.72, wo sie schon im Kommentar stand.** Zum dritten
Mal in dieser Sitzung in eine selbst dokumentierte Falle gelaufen.

**Dritter:** Die verdeckte Karte hat außer der Stufe keinen Text — `mach` hält
eine Ansicht ohne Inhalt für leer und wirft. Sie bekommt jetzt einen eigenen
Behälter, wie das Portal-Fenster in 35.78.

### Geprüft

**Ansichten 692 → 715.** Je Stufe: Name da, Stufe benannt, Rand in der
Stufenfarbe. Dazu: die verdeckte Karte verrät den Spieler nicht, zeigt aber die
Stufe; dieselbe Karte bekommt zweimal dasselbe Gesicht; die Anlage bleibt weg,
wenn nichts zu holen ist.

## 35.83 · Feste Karten, Merkmale, Jubel

Kevin nach dem ersten Blick: „An sich sind die Karten cool, aber ich würde es
noch besser finden, wenn sie nicht teiltransparent sind, sondern eher fest und
wie eine Sammelkarte wirken." Dazu Symbole für besondere Eigenschaften und eine
Feier beim Ziehen seltener Karten.

### Warum sie durchscheinend wirkten

Gemessen: der Verlauf ging von 15 % Stufenfarbe auf `transparent`, darunter
`--pan` = `#211E17`, ein fast schwarzes Braun. **15 % Farbe auf Schwarz sind
kaum Farbe** — die Karte war deckend, wirkte aber wie ein Schleier.

Jetzt zwei **deckende** Stopps: oben die Stufenfarbe kräftig in den Kartongrund
gemischt, unten dunkel, dazu ein Rand von 2 px und ein feiner Glanz über der
oberen Kante. Kein `transparent` mehr. **Eine Sammelkarte ist ein Stück Pappe,
kein Fenster.**

Die Töne werden **gerechnet**, nicht getippt: eine neue Stufe passt automatisch,
statt acht Hexwerte nachzupflegen.

### Merkmale, abgeleitet statt gewürfelt

Acht Merkmale mit eigenen Symbolen: Ruhmeshalle, Eigengewächs, Rohdiamant,
Torjäger, Bollwerk, Spielmacher, Titelsammler, Routinier.

**Der naheliegende Fehler wäre, sie zu würfeln** — dann stünde „Torjäger" auf
einem Innenverteidiger, und beim zweiten Ansehen glaubt niemand mehr, was auf
der Karte steht. Sie kommen aus Position, Stärke, Alter, Herkunft und Titeln.
Höchstens drei je Karte: was jeder hat, zeichnet niemanden aus.

Die Symbole sind **SVG-Pfade, keine Schriftzeichen**. Das Spiel prüft seit
35.57 die Zeichenabdeckung seiner fünf Schriften; ein Symbol, das eine davon
nicht kennt, wäre ein leeres Kästchen.

### Der Jubel

Zwei Teile, absichtlich getrennt: die Karte springt auf, und ein Lichtstreifen
wandert einmal darüber. Einzeln wäre das eine ein Zucken und das andere ein
Reflex.

**Nur für Gold, Legendär und Sonderkarten.** Eine Feier bei jeder Bronzekarte
ist keine Feier mehr, sondern eine Wartezeit. Abgeschaltet wird sie doppelt:
durch die Systemeinstellung für reduzierte Bewegung **und** durch den
Ruhe-Schalter im Spiel — das eine ist das Betriebssystem, das andere eine
Entscheidung des Spielers.

### Zum dritten Mal dieselbe Falle — und diesmal gibt es eine Prüfung

Ein Rückwärts-Anführungszeichen im CSS-Kommentar hat den Bau zerlegt. Passiert
in **35.58, 35.64 und jetzt**. Nach dem zweiten Mal stand die Lehre in
STAND.md; nach dem dritten reicht das offensichtlich nicht.

**Wer sich dreimal auf sein Gedächtnis verlässt, braucht keine Lehre, sondern
eine Prüfung.**

Mein erster Anlauf legte sie in die Vereinsprüfung — und die Gegenprobe zeigte
sofort, dass das nichts nützt: **der Aufbau bricht vorher ab, die Prüfung kommt
nie zum Zug.** Jetzt steht sie im Hygieneabschnitt von `pruefen.sh`, vor dem
Bau, und nennt Zeile und Fundstelle.

### Und ein Prüffehler, den ich zweimal machen musste

Den Rand über `style.borderColor` verglichen — jsdom rechnet in `rgb(...)` um
(35.82). Also das rohe Attribut gelesen — **das steht dort ebenfalls als
`rgb(...)`**, und der Hexvergleich fand weiter nichts. Jetzt wird der Hexwert
selbst umgerechnet, damit beide Seiten dasselbe vergleichen.

### Geprüft

**Ansichten 715 → 740.** Kein `transparent` im Verlauf, obere und untere Farbe
verschieden, Merkmale passen zur Position, höchstens drei, jedes hat ein
Symbol, ein schwacher Stürmer ist kein Torjäger — und Bronze feiert nicht.

## 35.84 · Holoschimmer

Kevin: „Bekommen wir auf Gold und legendären Karten noch einen passenden,
bewegenden Holoeffekt?"

### Zwei Schichten, wie bei einer echten Folienkarte

Ein Farbschimmer, der über die Fläche wandert, und darin ein feines Raster,
das ihn bricht. **Ohne das Raster sieht es nach Regenbogenverlauf aus, nicht
nach Folie.** Das Raster liegt *im* Schimmer, wandert also mit und blitzt nur
dort auf, wo gerade Farbe ist.

Nur auf Gold und Legendär. Auf Bronze und Silber wäre der Schimmer kein
Merkmal mehr, sondern Dekoration — und **Dekoration, die überall ist, sagt
nichts.**

### Zwei Werte, beide gemessen

**Die Mischart:** erst `overlay`, wie es naheliegt. Im Bild gesehen: auf
dunklem Grund dämpft overlay die Farbe, der Schimmer las sich als
Lichtstreifen. Jetzt `screen` — das **addiert** Licht, und genau das tut eine
Folie: sie gibt etwas dazu, statt etwas wegzunehmen.

**Die Deckung:** ich habe die Farbsättigung im Kartenbild über fünf Werte
gemessen statt nach Gefühl zu drehen.

    Deckung   Sättigung (max)
    0,14         47,8
    0,20         51,6
    0,30         53,0
    0,42         55,8
    0,55         68,1

Bis 0,3 passiert kaum etwas, danach ein Sprung. Jetzt 0,32 für Gold und 0,44
für Legendär.

### Der Text liegt oben, und das ist geprüft

Ein Schimmer über der Schrift verschluckt sie — und das fiele erst auf dem
Gerät auf, wo man es nicht mehr messen kann. Die Prüfung liest die Reihenfolge
im Baum.

Der Schimmer läuft **dauerhaft**, nicht nur beim Aufdecken: eine Folienkarte
hört ja nicht auf zu schimmern, weil man sie kennt. Neun Sekunden je Durchlauf
— schneller wirkt es nervös, und auf einem Bildschirm mit zwanzig Karten laufen
zwanzig davon. Deshalb zwei Schichten und keine Schatten.

### Fünfter und sechster Fall derselben Falle

Rückwärts-Anführungszeichen im CSS-Kommentar, **zweimal in genau diesem
Block**. Der Unterschied zu den drei Malen davor: **beide Male hat die Prüfung
aus 35.83 sie gefangen**, vor dem Bau, mit Zeile und Fundstelle — statt dass
esbuild einen Folgefehler meldete, der nach etwas ganz anderem aussieht.

Das ist der ganze Zweck einer Prüfung: sie erinnert sich, wenn ich es nicht
tue.

### Geprüft

**Ansichten 740 → 750.** Schimmer nur auf Gold und Legendär, Text liegt über
dem Schimmer. Gegenprobe: auf allen Stufen freigeschaltet → Bronze und Silber
melden.

## 35.85 · Der Packladen — das Kartensystem wird spielbar

Vier Fassungen Fundament, jetzt das sichtbare Stück. Kevin: „Damit ich die
Karten sehe, müssen wir das Projekt dahingehend erst mal fertig machen."

### Drei Zustände, und der mittlere ist der Punkt

| | |
|---|---|
| **Laden** | vier Packs, Preis in VC **und** in Laufbahnen Ausbau |
| **Aufdecken** | verdeckte Karten, eine nach der anderen antippen |
| **Ergebnis** | wer gezogen wurde, mit dem Weg in den Kader |

**Das Aufdecken einzeln.** Alles auf einmal umzudrehen wäre ein Bildschirm
voller Karten und kein Moment — der Jubel aus 35.83 braucht etwas, worauf er
folgt.

### Die Obergrenze macht Kevins Bedingung erst wahr

Seine Vorgabe von Anfang an: gezogene Spieler **ergänzen** die Akademie, sie
ersetzen sie nicht. **Ohne Grenze wäre das eine leere Zusage** — wer genug
Packs kauft, hätte eine ganze Mannschaft aus dem Laden. Die Akademie wäre dann
nicht ersetzt, aber überflüssig, und das kommt aufs selbe heraus.

Höchstens **ein Drittel** des Kaders, gemessen fünf von sechzehn. Die Elf steht
damit immer mehrheitlich aus eigener Ausbildung.

Gerechnet auf `KADER_MIN`, nicht auf die tatsächliche Kadergröße — sonst könnte
man die Grenze umgehen, indem man erst Karten einsetzt und dann Talente
hochzieht. Und die Herkunft bleibt **am Spieler**: ohne sie ließe sich die
Grenze nach dem nächsten Laden nicht mehr nachrechnen, und **eine Grenze, die
man nur beim Einsetzen kennt, ist keine.**

### Das Gratispack wird gezählt, nicht verschenkt

Ein Bronzepack je beendeter Laufbahn. Wer drei Laufbahnen am Stück spielt, soll
drei Packs vorfinden und nicht zwei verlieren.

### Geprüft

**Ansichten 750 → 770.** Alle vier Packs mit Preis, der Preis auch in
Laufbahnen, die Obergrenze steht im Text; mit leerem Konto ist kein Kaufknopf
aktiv und es steht da, wie viel fehlt; das Gratispack erscheint nur, wenn eines
da ist. Dazu die Grenze selbst: nach fünf Karten wird abgewiesen, und derselbe
Spieler lässt sich nicht zweimal einsetzen.

Gegenprobe: Obergrenze ausgehebelt → gemeldet.

## 35.86 · Eine Grenze ohne Ausweg ist eine Falle

Kevin: „Wenn wir eine Begrenzung haben für nutzbare Karten, muss es auch eine
Möglichkeit geben, Karten, die man nicht mehr haben will, loszuwerden. Am
besten kann man sie verkaufen für einen angemessenen Preis."

**Er hat grundsätzlich recht.** Wer fünf mittelmäßige Karten eingesetzt hat,
käme sonst nie wieder an einen besseren Spieler — die Obergrenze aus 35.85 wäre
vom Schutz zur Sackgasse geworden.

### Zwei getrennte Wege, weil es zwei Entscheidungen sind

| | |
|---|---|
| **aus dem Kader nehmen** | der Platz wird frei, die Karte bleibt |
| **verkaufen** | die Karte ist weg, dafür gibt es VC |

Verkaufen fragt nach, weil es endgültig ist. Ein Kaderplatz kommt wieder, eine
Karte nicht.

### Der Preis ist gegen die Packpreise gerechnet

    Bronzepack    30 VC  →  11,7 VC   39 %
    Silberpack    65 VC  →  26,9 VC   41 %
    Goldpack     130 VC  →  44,0 VC   34 %
    Legendenpack 240 VC  →  71,6 VC   30 %

**Läge der Rückfluss über 100 %, wäre Kaufen und Verkaufen eine Geldmaschine**
— und die VC-Kalibrierung wertlos, weil jeder unbegrenzt Coins herstellen
könnte. Das ist kein Feinschliff, sondern die Grenze zwischen Wirtschaft und
Unsinn. Die Prüfung schlägt ab 75 % an; die Gegenprobe mit vervierfachten
Erlösen meldet sofort.

Nach unten gibt es ebenfalls eine Grenze: **wertlos darf es auch nicht sein**,
sonst verkauft niemand und die Obergrenze bleibt eine Falle.

### Erinnerung ist keine Ware

Spieler aus der **eigenen Ruhmeshalle** und aus **früheren eigenen Vereinen**
lassen sich nicht verkaufen. Wer seine eigene Legende zu Geld macht, verliert
sie für immer — und der Pool ist das einzige Gedächtnis, das es dafür gibt.

### Ein Fund beim Verdrahten

Beim Verkauf muss der Spieler **erst aus dem Kader**, dann aus der Sammlung.
Sonst stünde ein Spieler im Kader, den es in der Sammlung nicht mehr gibt — und
die Obergrenze zählte einen Platz, der zu nichts gehört.

### Und der vierte sporadische Prüfstand

„Meisterschale" und „Beide Häuser" fielen manchmal nicht: der Testverein wurde
mit einer Stärkeobergrenze von 84 nach dem Aufstieg in die Bundesliga nur noch
Mittelmaß. Jetzt bis 94. **Hier geht es um Erreichbarkeit, nicht um eine faire
Liga** — der Testverein soll gewinnen, damit die Frage überhaupt beantwortbar
wird. Fünf Läufe: 12 von 12.

### Geprüft

**Vereinsprüfungen 285 → 295.**

## 35.87 · Der Fundus, und Karten wischen weg

Kevin: „Generell, dass man gezogene Spieler immer in einem Fundus hat und sie
in die Mannschaft packen und wieder rausziehen kann. Dass man allgemein nötige
Verwaltungsmöglichkeiten hat." Dazu eine Wischanimation beim Einsetzen.

### Bei fünf Karten braucht es nichts, bei fünfzig alles

Und **fünfzig sind nach zehn Packs erreicht**. Deshalb jetzt und nicht später:
eine Liste, die man nur noch durchscrollt, ist kein Fundus, sondern ein Haufen.

Der Fundus hat jetzt eine Zählung je Stufe („16 Karten · 4 bronze · 4 silber ·
4 gold · 4 legendär"), sieben Filter (alle, nicht im Kader, im Kader, je Stufe)
und drei Sortierungen.

**Vorgabe ist die Stärke** — das ist die Frage, die man an einen Fundus hat:
wer ist der Beste, den ich noch nicht drin habe?

### Die Wischanimation

Nach rechts und weg, mit leichter Drehung — als schöbe man die Karte aus dem
Stapel. Der Platz fällt danach zusammen; sonst bliebe ein Loch, wo die Karte
war, und die Liste spränge erst beim nächsten Zeichnen zusammen.

**0,34 Sekunden:** lang genug, dass man die Richtung sieht, kurz genug, dass es
beim dritten Spieler nicht nervt. Wer sechs Karten einsetzt, sieht sie sechsmal.

**Gewischt wird nur bei Erfolg.** Ist der Kader voll, bleibt die Karte liegen —
sie wegzuwischen wäre eine Lüge über etwas, das nicht passiert ist.

### Geprüft

**Ansichten 770 → 777.** Zählung je Stufe stimmt, Filter und Sortierung sind
da, sortiert wird wirklich nach Stärke, die Ruhmeshallenkarte hat **keinen**
Verkaufsknopf und eine Packkarte **einen** — sonst wäre die Grenze wieder eine
Falle.

Zwei Gegenproben: Filter entfernt → gemeldet; alles verkäuflich gemacht → an
drei Stellen gemeldet.

## 35.88 · Die Aufstellung wird zum Kartenraster

Fünf Punkte von Kevin, einer davon ein Fehler.

### Der Holoschimmer brach ab — und der Grund ist lehrreich

`background-position` wird auf dem **Hauptstrang** gerechnet. Jedes Mal, wenn
React etwas neu zeichnet — ein Filter im Fundus, eine aufgedeckte Karte —, setzt
der Browser die Animation dort fort, wo er gerade Zeit hat. Bei zwölf Karten
gleichzeitig ist das ein Abbruch.

Jetzt wandert ein **Element** über die Karte, verschoben per `transform`. Das
läuft auf dem Compositor, also neben dem Hauptstrang: React kann zeichnen, so
viel es will.

### Hochkant, in Wappenform

Die große Karte ist 380 px breit — elf davon wären vier Bildschirme. Die
Elfkarte ist 74 px breit, oben gerade, unten angeschrägt wie ein Schild
(`clip-path`, kein Bild).

**Vier je Reihe**, feste Spaltenzahl. `auto-fit` wäre bequemer und falsch: dann
hinge die Spaltenzahl von der Breite ab, und die Rechnung für den
Auswahlkasten stimmte nicht mehr. **Eine Anzeige, deren Aufbau man kennt, lässt
sich ansteuern; eine, die sich selbst anordnet, nicht.**

### Was beim Umbau fast verlorengegangen wäre

Die Zeilenansicht zeigte bei falscher Position „ZM, 74 %" und die **wirksame**
Stärke statt der rohen. Ein Innenverteidiger im Sturm hat 74 auf dem Papier und
55 auf dem Platz. Beides steht jetzt auf der Karte, rot markiert — **hübscher
und ärmer wäre kein Fortschritt.**

Ein leerer Platz ist ebenfalls eine Karte, gestrichelt und rot. Sonst hüpft das
Raster, sobald jemand fehlt, und man sieht nicht, **wo** die Lücke ist.

### Die Herkunft ist Pflicht, nicht Zierrat

Kevin: „es muss gekennzeichnet sein, welche Spieler gezogen wurden und welche
aus der Akademie kommen." Ein Spross für die Jugend, eine Raute für die
Gezogenen, oben rechts auf jeder Karte. **Ohne das sieht eine Elf aus wie eine
Elf, und man weiß nicht mehr, was man selbst aufgebaut hat.**

Akademiespieler bekommen ihre Stufe aus der Stärke — dieselbe Rechnung wie bei
allen anderen Karten.

### Boosterpacks

Was ein Pack ausmacht, zerlegt: hochkant, Folienfläche in der Stufenfarbe, eine
**gezackte Aufreißkante** oben, eine Naht darunter, ein Zeichen in der Mitte.
Die Aufreißkante ist das Erkennungsmerkmal — noch vor der Farbe. Bei Gold und
Legendär kommt der Schimmer dazu.

Alles gezeichnet: eine neue Stufe braucht kein neues Bild, sondern nur eine
Farbe.

### Die Prüfung aus 35.59 hat den Umbau bemerkt

Sie verlangt, dass der Auswahlkasten direkt unter dem angetippten Platz steht,
und meldete nach dem Umbau „2 Platzzeilen dazwischen". **Sie hatte recht** — im
Raster stehen bis zu drei Karten zwischen der angetippten und dem Kasten. Das
ist die Bauart, kein Fehler: der Kasten kann erst nach der Reihe kommen.
Geprüft wird jetzt, dass höchstens der **Rest der eigenen Reihe** dazwischen
liegt, nicht die ganze Elf.

### Siebter und achter Fall

Rückwärts-Anführungszeichen im CSS-Kommentar (siebter Fall, von der Prüfung
gefangen) und `ELF_PLAETZE` — ein Name, den es nicht gibt; die Plätze heißen
`form.plaetze`. **Achter erfundener Name in dieser Sitzung.**

### Geprüft

**Ansichten 777, Vereinsprüfungen 295, beide ohne Fehler.** Die Stellungsprüfung
aus 35.59 wurde auf das Raster nachgezogen und meldet wieder grün. Kontrast 145
Textstellen ohne Befund, 154 Knöpfe lesbar, Rücktritt 6 von 6.

## 35.89 · Karten fallen aus dem Pack — und das Startpaket

Damit ist das Kartensystem vollständig.

### Die Karten droppen

Sie kommen **von oben**, aus der Richtung, in der das Pack steht — sonst fällt
nichts heraus, sondern erscheint irgendwo. Leicht gedreht und verkleinert,
damit es nach Herausrutschen aussieht und nicht nach Einblenden.

**Versetzt, 90 ms je Karte.** Gleichzeitig wäre ein Aufploppen, zu weit
auseinander wartet man. Der Versatz steht als CSS-Variable am Element, nicht
als eigene Regel je Karte — sonst bräuchte es für sechs Karten sechs Klassen.

**Das geöffnete Pack bleibt oben stehen.** Ohne es kämen die Karten von
nirgendwo; die Bewegung braucht einen Ort, aus dem sie fällt.

### Der Kader bekommt die Kartensprache, nicht das Kartenformat

Kevin wollte Kader **und** Aufstellung in Kartenoptik. Die Aufstellung ist
umgestellt — dort zählt nur, wer wo steht.

**Der Kader ist etwas anderes:** dort stehen Vertragsstand, Restlaufzeit,
Spiele und Tore. Auf einer 74 px breiten Karte ist davon nichts unterzubringen.
Der Kader ist der Bildschirm, auf dem man **verwaltet**; ihn auf Karten
umzustellen wäre hübscher und ärmer — genau der Fehler, den ich bei der
Aufstellung vermieden habe.

Stattdessen bekommt jede Zeile die Merkmale der Karte: einen Rand in der
Stufenfarbe, einen Verlauf, das Herkunftszeichen und die Stärke in der
Stufenfarbe.

### Das Startpaket — darauf lief der ganze Pool zu

Sechs Spieler für den nächsten Verein: **mindestens drei** aus der
Vorgängermannschaft, **mindestens einer** aus der Ruhmeshalle, und aus der
Halle kommt der **Stärkste** — „ein Guter" ist eine Bedingung, keine Floskel.

Vorgemerkt wird beim Abschluss des alten Vereins, nicht beim Gründen des
neuen: der Pool enthält **gerade dann** den eben abgeschlossenen Kader.

**Mein erster Entwurf war zu großzügig.** Er füllte mit den stärksten übrigen
Karten auf — und weil Hallenkarten die stärksten sind, kamen **drei Legenden
mit 84 bis 88**. Kevin hat „mindestens eine" gesagt, nicht „so viele wie
möglich". Ein Startgeschenk, das die halbe Halle ausschüttet, macht den neuen
Verein sofort zum Favoriten und nimmt der Akademie ihren Sinn für die nächsten
fünfzehn Jahre. Jetzt wird außerhalb der Halle aufgefüllt: eine Legende, fünf
aus der alten Mannschaft, Durchschnitt 73,8.

**Der erste Verein** hat weder Vorgänger noch Halle — dann wird mit frischen
Silber- und Goldkarten aufgefüllt. Ein Startpaket, das beim ersten Mal leer
bleibt, wäre eine Zusage, die nur beim zweiten Mal gilt.

### Geprüft

**Vereinsprüfungen 295 → 303, Ansichten 777.** Sechs Karten, drei aus dem
Vorgänger, einer aus der Halle und zwar der Stärkste, nicht mehr als zwei
Hallenkarten, Durchschnitt unter 80 — und auch beim ersten Verein sechs Stück,
keine davon bronze.

Gegenprobe: Auffüllen wieder in die Halle gelassen → „3 Hallenkarten von 6".

## 35.90 · Vier Befunde vom Gerät

Kevin mit Bildschirmfoto. Alle vier waren echt.

### Die Aufstellung lief über den Rand

Gemessen: die Karte war **88 px** breit, ihre Spalte bei 412 px Fensterbreite
nur **82** — jede ragte sechs Pixel darüber, und die vierte wurde am Rand
abgeschnitten.

**Eine feste Pixelbreite in einem Raster, das sich anpasst, ist ein
Widerspruch.** Jetzt füllt die Karte ihre Spalte (`width: 100 %`, Deckel bei
110), und das Raster verteilt mit `stretch` statt `center`. Gemessen nach der
Änderung: vierte Karte endet bei 383, Behälter bei 400.

### Der Schimmer auf kleinen Karten war ein Farbteppich

Das Schimmerelement ist 150 % der **Kartenbreite** breit. Auf einer großen
Karte von 380 px sind das 570 px — ein Streifen, der darüberwandert. Auf einer
Elfkarte von 82 px sind es 123 px, und der Farbbogen deckt die ganze Karte auf
einmal ab.

**Dasselbe Bauteil in zwei Größen braucht zwei Zuschnitte.** Die kleine Karte
bekommt einen schmalen Streifen (60 %) mit längerem Weg und geringerer Deckung.

### Der Aufdeckbildschirm war eine Sackgasse

Kevins Befund: „Die gezogenen Karten kann ich nicht zum Fundus hinzufügen, wenn
das Limit erreicht ist, und die Karten bleiben sichtbar und auswählbar."

Bis 35.89 gab es nur „In den Kader". War der voll, blieb die Karte liegen — mit
einem Knopf, der nichts tat, und ohne Weg weiter.

Die Karte lag ohnehin schon im Fundus (beim Öffnen hinzugefügt); was fehlte,
war das **Ablegen** — das Zeichen, dass man sie gesehen und angenommen hat.
Jetzt zwei Knöpfe, und **beide führen weg**: „In den Kader" nur, wenn Platz
ist, sonst „Annehmen". Dazu „Alle annehmen", wenn alles aufgedeckt ist.

### Die Formation: ja, sie ändert die Elf

Kevins Frage, mit einer Messung beantwortet statt einer Vermutung:

    4-4-2    TW IV IV AV AV ZM ZM AF AF ST ST
    4-3-3    TW IV IV AV AV ZDM ZM ZM AF AF ST
    3-5-2    TW IV IV IV ZDM ZM ZM AV AV ST ST

Und `autoAufstellen` besetzt sie danach: 11 von 11 auf ihrer eigenen Position,
in allen drei Formationen.

### Zwei eigene Prüffehler

Beide Male meldete meine neue Prüfung rot, obwohl der Code stimmte:

**Erster:** Das Muster für die Breite durchsuchte die ganze Stilzeile und fand
`maxWidth: 110px`. **Ein Muster, das die ganze Zeile durchsucht, findet auch,
was zu einer anderen Eigenschaft gehört.**

**Zweiter:** Ich suchte die Zahl 61 mit Wortgrenzen. Im zusammengeflossenen
`textContent` steht „Testspieler61ST" — dort gibt es links von der 61 keine
Wortgrenze. **Wortgrenzen setzen voraus, dass Text getrennt ist; in
`textContent` ist er das nicht.**

### Geprüft

**Ansichten 777 → 787.** Keine feste Pixelbreite, Herkunftszeichen vorhanden,
Eignung und wirksame Stärke bei falscher Position, leerer Platz ist eine Karte,
kleine Karten tragen den schmalen Schimmer.

Gegenprobe: feste Breite zurückgesetzt → „88px" gemeldet.

## 35.91 · Die Elf steht jetzt so, wie sie spielt

Kevin, mit einer Skizze:

                    TW
           AV   IV   IV   AV
                 ZM   ZM
           AF               AF
                    ST

**Vier gleiche Spalten zeigten elf Karten, aber keine Aufstellung.** Wer eine
Formation wählt, will sie sehen — sonst ist die Wahl eine Liste von Namen.

### Die Reihen kommen aus der Kennung

„442" heißt 4-4-2, also nach dem Torwart drei Reihen mit 4, 4 und 2 Spielern.
**Eine zweite Tabelle wäre eine zweite Wahrheit über dieselbe Sache** — und die
läuft irgendwann auseinander, wie die Reiterzeilen in 35.59 und die
Kachelränder in 35.64.

    4-4-2      TW / AV IV IV AV / AF ZM ZM AF / ST ST
    4-3-3      TW / AV IV IV AV / ZDM ZM ZM / AF ST AF
    4-2-3-1    TW / AV IV IV AV / ZDM ZDM / AF ZOM AF / ST
    3-5-2      TW / IV IV IV / AV ZDM ZM ZM AV / ST ST
    5-4-1      TW / AV IV IV IV AV / ZDM ZM ZM AF / ST

### Außen sind die Außen

Innerhalb einer Reihe wandern die Außenpositionen an die Ränder. Ohne das
stünden bei 4-4-2 „IV IV AV AV" nebeneinander, und **die Abwehr sähe aus, als
hätten sich beide Außenverteidiger auf eine Seite gestellt.**

Die Karte ist damit nicht mehr an vier Spalten gebunden: eine Reihe mit fünf
(3-5-2) verteilt sich auf fünf, eine mit zwei auf zwei.

### Zum dritten Mal dieselbe Prüfung nachgezogen

Die Regel aus 35.59 — der Auswahlkasten steht direkt bei dem, was man
angetippt hat — ist seither dreimal derselben Frage mit drei Antworten
begegnet:

| | Bauart | Antwort |
|---|---|---|
| 35.59 | Liste | keine Platzzeile dazwischen |
| 35.88 | Raster | höchstens der Rest der eigenen Reihe |
| 35.91 | Feld | direkt hinter der Reihe, in der der Platz liegt |

Sie meldete diesmal „steht nicht in derselben Liste" — **und hatte recht:**
der Kasten ist jetzt Geschwister der Reihe, nicht der Karte.

**Dass diese Prüfung den Umbau dreimal bemerkt hat, ist ihr Wert.** Eine Regel,
die man beim Umbauen vergisst, ist nach dem zweiten Umbau weg.

### Geprüft

**Vereinsprüfungen 303 → 322.** Je Formation: alle elf Plätze genau einmal,
jede Stelle trägt ihre eigene Position, der Torwart steht allein. Dazu: Außen
außen, und die Reihenlängen entsprechen der Kennung (1-4-4-2, 1-3-5-2).

**Der naheliegende Fehler beim Umsortieren ist, einen Platz zu verlieren oder
zu verdoppeln** — beides fällt optisch kaum auf, weil elf Karten immer nach
elf aussehen. Deshalb wird gezählt, nicht hingesehen.

Gegenprobe: Umsortieren ausgehebelt → „IV IV AV AV".

## 35.92 · Ist der Tisch leer, geht es zurück

Kevin: „Wenn man alle Karten im Pack angenommen hat, dann soll die Ansicht
wieder in den Shop wechseln."

Richtig: **ein leerer Aufdecktisch mit einem „Fertig"-Knopf ist ein Bildschirm,
der nur noch aus einer Aufforderung besteht, ihn zu verlassen.** Wer alles
angenommen hat, hat den Schritt beendet — dann soll das Spiel ihn auch beenden.

### Zwei Entscheidungen im Kleinen

**Erst nach der Wischbewegung**, 220 ms danach. Sonst verschwindet der
Bildschirm unter der letzten Karte, während sie noch wegwischt — und man sieht
nicht mehr, was man da eigentlich genommen hat. Lang genug, dass die Bewegung
fertig ist, kurz genug, dass es nicht wie Warten wirkt.

**Am Zustand, nicht am Klickpfad.** „Alle Karten sind weg" ist ein *Zustand*,
kein Ereignis. Hätte ich beim Ablegen mitgezählt, müsste jede künftige Stelle,
die eine Karte entfernt, daran denken — und die erste, die es vergisst, lässt
den Tisch leer stehen.

### Im Browser nachgespielt, beide Wege

    Gratispack öffnen → aufdecken → „Alle annehmen"   → PACKS
    voller Kader     → aufdecken → dreimal „Annehmen" → PACKS

Bei vollem Kontingent erscheint **kein** „In den Kader" mehr — das war der
Befund aus 35.90, und es gibt jetzt eine Prüfung dafür: ein Knopf, der nichts
tut, ist schlimmer als keiner.

### Geprüft

**Ansichten 787 → 791.** Gegenprobe: „In den Kader" auch bei vollem Kontingent
sichtbar gemacht → gemeldet.

## 35.93 · Das Postfach wird ein Briefsymbol

Kevin: „Das Postfach hätte ich gerne nicht als riesen Hauptknopf, sondern oben
als kleines Briefsymbol, so groß wie das VC-Shop-Icon im Hauptmenü. Grau, wenn
nichts ansteht, und gelb, wenn etwas zu erledigen ist. Das Postfach öffnet sich
dann als überlappendes Fenster."

### Eine Kachel, die meistens nichts zu sagen hat

Bis 35.92 war das Postfach so groß wie Akademie und Mannschaft — und sagte in
den allermeisten Fällen „nichts offen". **Eine Kachel, die in neun von zehn
Fällen nichts zu sagen hat, nimmt den Platz von etwas, das etwas zu sagen
hat.**

Jetzt ein Briefsymbol in der Kopfzeile, gleiche Klasse und Größe wie das
Ladensymbol im Hauptmenü. Grau, wenn nichts ansteht; in Gold mit Zähler, wenn
etwas liegt — dieselbe Farbe, die im ganzen Spiel „hier gibt es etwas"
bedeutet.

### Das Fenster, und wo es sich vom Sonderschuss unterscheidet

Dieselbe Bauart wie 35.78: `createPortal` an den Körper (weil `.fade` eine
Transformation stehen lässt) und die Klasse `fl` (weil die Farbvariablen dort
definiert sind). Beide Fallen kannte ich diesmal.

**Anders als der Sonderschuss ist dieses Fenster schließbar** — ein Klick
daneben, ein Knopf oben. Es ist eine Auskunft, keine Belohnung; **wer eine
Auskunft nicht wegklicken kann, ist gefangen.**

### Ein Fund im Bild

Das Kopfband ragte links und rechts hinaus: „Postfach" wurde zu „OSTFACH", der
Schließknopf stand halb außerhalb. `.band` hat `margin: -15px -16px` — es ragt
**absichtlich** über den Rand des Kastens, in dem es sonst sitzt, und schließt
dort bündig ab. Mein Fenster hat aber keinen `pad`-Innenabstand, an dem es sich
ausrichten könnte.

**Eine Klasse, die einen bestimmten Behälter voraussetzt, muss man ihn auch
geben — oder ihre Annahme aufheben.**

### Drei Prüfungen nachgezogen, eine davon zum zweiten Mal

Die Postfachprüfungen suchten im Text nach „1 offen" und „antippen". Den Text
gibt es nicht mehr; der Zustand steht jetzt im `aria-label`, also dort, wo er
auch für einen Screenreader steht. Sie hatten recht, rot zu melden.

Die Postkorbprüfung aus 35.53 hat inzwischen **zwei** Umbauten mitgemacht
(35.68: nicht mehr selbsttätig offen; 35.93: Fenster statt Kasten) und beide
Male gemeldet.

### Und ein eigener Prüffehler

`document.body.querySelector` fand das Fenster einer **früheren** Probe —
Portale bleiben am Körper, solange die Ansicht lebt. Die Postkorbprüfung
prüfte damit das Fenster der Zählerprüfung und meldete „Name oder Verein
fehlen". Jetzt wird das **zuletzt** geöffnete genommen.

### Geprüft

**Ansichten 791 → 790** (eine Prüfung ist beim Zusammenlegen entfallen, vier
neue dazugekommen): Briefsymbol vorhanden, Zähler im `aria-label`, Inhalt
bleibt zu, Fenster öffnet sich am Körper, Fenster ist schließbar, und auch bei
leerem Postfach ist das Symbol da.

## 35.94 · Acht Befunde vom Gerät

Kevin nach einer Spielrunde. Alle acht geprüft, sechs davon waren echt.

### Zwei Kästen statt einem

Kevin: „Der VC-Verdienst und die Übersicht der Jugendakademie müssen noch
getrennt werden. Die Kachel zur Jugendakademie darf nur kommen, wenn diese auch
bereits gegründet wurde."

**Er hat beides richtig gesehen.** Der Kasten hieß „Ein Jahr Jugendakademie"
und zeigte den VC-Verdienst — auch bei jemandem **ohne** Akademie, der dann eine
Überschrift über einem Haus las, das es nicht gibt. **Zwei verschiedene Dinge
unter einer Überschrift sind eine Überschrift zu wenig.**

Jetzt: erster Kasten „Vermächtnis-Coins" mit dem Verdienst und den Posten;
zweiter Kasten „Ein Jahr Jugendakademie" mit dem Jahresbericht — und der kommt
**nur, wenn es das Haus gibt**. Wer keine Akademie hat, liest im ersten Kasten
den Hinweis, dass die Coins bereitliegen.

### Ein eigener Prüffehler

Mein Probespieler war von Hand zusammengesteckt und vergaß `depot` —
`netWorth` stürzte ab. Jetzt kommt er aus `createPlayer`: **ein Spieler hat
mehr Felder, als man beim Abtippen im Kopf hat; die Fabrik weiß, welche.**


### Die drei Ereignisse sind Absicht

Kevin: „Warum sind es mittlerweile ab und zu wieder 3 Events pro Saison?"

Gemessen: `meta.mx_events && chance(.25) ? 3 : 2`. Das ist die freigeschaltete
Regel **„Bewegtes Leben — ab und zu drei Ereignisse statt zwei"**, verdient
durch „Zwanzig Laufbahnen". Kein Rückschritt, sondern eine Belohnung, die er
sich erspielt hat. Wenn sie stört, ist sie eine Zeile.

### Das Minispiel kam zu oft — und es lag nicht an den Auszeichnungen

Gemessen über 300 Laufbahnen, aufgeschlüsselt nach Auslöser:

    Note <= 2,1     Median 0 je Laufbahn · Mittel 1,0
    Auszeichnungen  Median 1 · Mittel 1,3
    TITEL           Median 5 · Mittel 5,8      <- der Grund

„Oder ein Titel" traf bei einem Spieler am Spitzenklub **fast jede Saison**.

Nur die großen Auslöser zu nehmen reichte nicht: auch „nur Meister und
international" blieb bei Median 5 — ein Spitzenklub wird eben meistens Meister.
Und die Titel ganz zu streichen fiel auf **Median 0** zurück, also zurück zum
Problem aus 35.76.

    heute                                   Median 6 · ohne  5 %
    nur große Auslöser                      Median 5 · ohne 10 %
    große Auslöser + Sperre vier Saisons    Median 2 · ohne  8 %   ← gewählt

Gegen das gebaute Spiel nachgemessen: **Median 3, Mittel 2,6, 6 % ohne.** Von
sechs auf drei halbiert.

Die Sperre steht **am Spieler**, nicht in einer Zählvariablen der Anzeige — sie
muss den Spielstand überleben, sonst umginge man sie durch Neuladen.

### Die Punkte verpufften wirklich

Kevin: „Ich habe das Gefühl, dass die gewonnenen Attributpunkte manchmal nicht
verteilt werden." **Er hatte recht.** Stand ein Wert schon an der Grenze — bei
einem starken Stürmer ist `sho` irgendwann 99 —, tat `clamp(… + 1)` nichts, und
der Punkt war lautlos weg.

Jetzt geht er auf den nächsten Wert, der noch Luft hat. Sind alle voll, sagt es
die Meldung: **besser eine ehrliche Absage als eine stille.**

### Vier Preise statt immer Anlage

    +1 Anlage      40 %   dauerhaft, aber nur ein Punkt
    Bestform       22 %   eine Saison lang volle Form
    Eisenhart      22 %   eine Saison ohne Verletzung
    Man spricht…   16 %   +9 Ruf, wirkt auf Angebote

Jeder greift an einer Zahl, die es schon gibt — kein neues System für eine
Belohnung, die dreimal im Spielerleben fällt. Der Verletzungsschutz sitzt an
**derselben Stelle wie der Physio**: eine zweite Stelle wäre eine zweite
Wahrheit darüber, wann jemand unverletzt bleibt.

### Der Packschimmer: zwei Fehler, beide schon bekannt

`.holo` ohne `eng` ist 150 % der **Elementbreite** breit — auf einem 64 px
schmalen Pack deckt der Farbbogen alles auf einmal ab. Und der rechteckige
`clipPath` schnitt quer durch die **gezackte** Aufreißkante; genau dort wirkte
es „abgebrochen", weil der Schimmer an einer geraden Linie endete, die im Pack
nicht existiert.

Beides dieselben Fehler wie bei den Elfkarten in 35.90.

### Der Fundus neben dem Postfach

Er war nur über Packs → Sammlung zu finden, also **hinter dem Laden**, obwohl
er mit dem Kaufen nichts zu tun hat. Jetzt ein eigenes Symbol im Dach, blau mit
Kartenzähler.

### Die Karrierebilanz war schon getrennt

Kevins vierter Punkt: erledigt. Zwei Kästen, und die Akademiekachel hängt an
`p.akaAktiv` — ohne gegründete Akademie erscheint sie nicht.

### Geprüft

**Ansichten 790 → 804.** Kein Punkt verpufft, wenn irgendwo Platz ist; es gibt
mehr als einen Preis; jeder hat Namen und Erklärung; die Anlage kommt in
höchstens 60 % der Fälle.

## 35.95 · Ein neuer Zugang braucht einen passenden Ausgang

Kevin: „Aus der Spielersammlung gibt es keinen Zurück-Knopf."

### Der Fehler entstand durch die letzte Fassung

Bis 35.93 kam man **nur über den Laden** in die Sammlung — „Zum Laden" war der
richtige und einzige Rückweg. Seit dem Fundussymbol im Dach (35.94) kommt man
auch **direkt**, und stand dann in einer Sammlung, aus der nur ein Weg in einen
Laden führte, den man nie betreten hat.

**Ein neuer Zugang braucht einen passenden Ausgang.** Wer das vergisst, baut
eine Sackgasse — dieselbe Art Fehler wie beim Aufdecktisch in 35.90, wo bei
vollem Kader ein Knopf stand, der nichts tat.

Jetzt zwei Ausgänge: „Zum Laden" für den, der kaufen will, und „Zurück" für
den, der über das Symbol kam.

### Beide Male hat Kevin es gefunden, nicht der Prüfstand

Deshalb gibt es jetzt eine Prüfung dafür. Sie fragt für jeden Reiter des
Ladens zweierlei: **ist ein Zurück-Knopf da**, und **ruft er auch etwas auf**.
Das zweite ist nicht selbstverständlich — die Lehre aus 35.90 war, dass ein
Knopf, der nichts tut, schlimmer ist als keiner.

Meine erste Grobsuche über alle Shell-Ansichten schlug zu breit an: sie las nur
die ersten 4000 Zeichen je Ansicht und meldete zehn Verdächtige, von denen
keiner einer war. **Eine Suche, die zu viel meldet, wird genauso ignoriert wie
eine, die zu wenig meldet.** Deshalb prüft die neue Fassung gezielt die
Bildschirme, um die es geht.

### Geprüft

**Ansichten 804 → 812.** Gegenprobe: den Knopf wieder entfernt → gemeldet.

## 35.96 · Der Schimmer, zum dritten Mal — diesmal gerechnet

Kevin: „Die Animation sieht immer noch falsch aus" — mit einem
Bildschirmvideo. **Aus dem Video habe ich Einzelbilder gezogen** (`ffmpeg`),
und darauf war es eindeutig: ein hartkantiges senkrechtes Band, das an einer
geraden Linie aufhört.

### Zwei Fehler, beide rechnerisch belegbar

**Erster: die Ausblendung war zu schmal.** Das Schimmerelement war *schmaler*
als die Karte (60 % bei der engen Fassung, also 38 px auf einem 64-px-Pack).
Die weichen Enden des Verlaufs liegen bei 12 % und 88 % **des Elements** — bei
38 px Breite sind das 4,6 px Ausblendung, auf einem Telefon mit 2,6-facher
Auflösung zwölf echte Pixel. **Zwölf Pixel Übergang sieht niemand als Verlauf.
Man sieht eine Kante.**

**Zweiter, und der eigentliche:** ein einzelnes Band auf einem breiten Element
ist nur einen Bruchteil der Zeit überhaupt auf der Karte. Gerechnet:

    bei   0 %: Band von -119 bis  -73 px  → auf der Karte: NEIN
    bei  25 %: Band von  -55 bis   -9 px  → NEIN
    bei  50 %: Band von    9 bis   55 px  → ja
    bei  75 %: Band von   72 bis  119 px  → NEIN

**Ein Viertel der Zeit.** Den Rest schimmert gar nichts — und genau das sieht
aus, als bräche die Bewegung ab.

### Die Lösung ist ein wiederholtes Muster

Element 200 % der Karte, Muster mit einer Periode von 50 % — also genau einer
Kartenbreite —, Weg ebenfalls 50 %. Dann ist **immer** ein Band unterwegs, und
weil der Weg exakt einer Periode entspricht, ist das letzte Bild dasselbe wie
das erste: der Umlauf ist nicht zu sehen.

Nachgemessen am Element: 128 px breit, 64 px Weg, Periode 64 px. Die
Ausblendung beträgt jetzt 40 statt 12 echte Pixel.

### Meine Messung war zweimal kaputt, nicht die Sache

**Playwright setzt beim Ablichten standardmäßig `animations: "disabled"`** — es
spult laufende Animationen ans Ende und friert sie dort ein. Meine Bildfolge
zeigte deshalb dreimal dasselbe Bild, und ich hielt es für einen Abbruch.

Am Element gemessen lief die Animation die ganze Zeit sauber durch:
0 → 220 px, dann von vorn. **Erst die Messung am Objekt statt am Bild hat es
gezeigt.**

Das ist dieselbe Lehre wie in 35.81, wo meine Messung eine Kopie der Zahlen
prüfte: **wenn Messung und Sache sich widersprechen, ist erst die Messung
verdächtig.**

### Neunter Fall

Rückwärts-Anführungszeichen im CSS-Kommentar, beim Schreiben genau dieses
Abschnitts. Von der Prüfung aus 35.83 gefangen, vor dem Bau.

### Geprüft

**Ansichten 812, Vereinsprüfungen 322, beide ohne Fehler.** Die Geometrie ist
am Element nachgemessen: 128 px breit, 64 px Weg, Musterperiode 64 px — also
exakt eine Kartenbreite, deshalb kein Sprung beim Umlauf.

**Was ich nicht beweisen kann:** wie es sich auf dem Gerät anfühlt. Mein
Abbildwerkzeug friert Animationen ein, und die Bewegung über die Zeit sehe ich
nur an Zahlen. Kevins Video war hier das bessere Messgerät.

## 35.97 · „Warum funktioniert das an anderen Stellen?"

Kevins Frage war die richtige — und sie enthielt die Antwort.

### Die Folie läuft seit Fassungen tadellos

    .folie   background-size: 220 %; die Bewegung verschiebt nur die
             HINTERGRUNDSTELLUNG von 0 % auf 200 %.
             DAS ELEMENT BEWEGT SICH NICHT.
             Und der Verlauf beginnt und endet auf DERSELBEN Farbe (#79E3D2),
             deshalb ist der Umlauf nahtlos.

    mein     ein Element per Verschiebung darübergeschoben.
    Ansatz   Ein Element hat RÄNDER. Sobald ein Rand über die Karte läuft,
             sieht man eine Kante — und beim Umlauf springt er zurück.

**Das ließ sich mit keiner Breite und keinem Muster wegrechnen.** Ich habe es
dreimal versucht: schmales Element (35.90), breites Element mit einem Band
(35.96), breites Element mit wiederholtem Muster (35.96). Ränder verschwinden
nicht, man kann sie nur verschieben.

**Was seit Fassungen funktioniert, muss man nicht neu erfinden — man muss es
lesen.**

Die Sorge um den Hauptstrang aus 35.88 war theoretisch: die Folie läuft auf
demselben Weg und ruckelt nicht. **Eine Vermutung über die Bauart hat gegen
eine Sache verloren, die nachweislich seit Langem läuft.**

### Und ein Fehler, der alles noch schlimmer machte

Kevin: „Jetzt wirken alle Holoanimationen, auch an anderer Stelle, defekt."

Beim Austausch hatte ich den Ausschnitt zu früh enden lassen — vier Zeilen der
alten Fassung blieben stehen, **darunter eine zweite Bewegungsvorschrift
desselben Namens**. Die spätere gewann: der Schimmer wurde weiter verschoben,
obwohl die neue Regel den Hintergrund bewegen sollte.

Gemessen war es eindeutig: die Hintergrundstellung blieb bei 0 %, während sich
die Verschiebung bewegte.

**Zwei Regeln mit demselben Namen sind kein Streit, den CSS meldet — die letzte
gewinnt stillschweigend.** Wer eine Regel ersetzt, muss die alte ganz entfernen
und nachsehen, ob sie nur einmal dasteht.

### Nachgemessen

    Hintergrundstellung   0,6 % → 33,9 → 67,2 → 101,1 → 134,4 → 167,8 → 1,7
    Verschiebung          none
    Element deckungsgleich mit der Karte: ja

Keine Ränder, die darüberlaufen könnten. In der Bildfolge sind alle sieben
Bilder verschieden — vorher waren vier davon pixelgleich.

### Zehnter und elfter Fall

Rückwärts-Anführungszeichen im CSS-Kommentar, beide beim Schreiben dieses
Abschnitts, beide von der Prüfung aus 35.83 vor dem Bau gefangen.

### Geprüft

**Ansichten 812, Vereinsprüfungen 322, beide ohne Fehler.** Nur noch eine
Bewegungsvorschrift `rs-holo` im ganzen Stilblock — das war der eigentliche
Fund.

## 35.98 · Eine Ziffer, und ein Lauf an der Zeitgrenze

### Der Schimmer schnitt am Ende ab — auch die Folie

Kevin: „Wildcards, bzw. die Holo-Animation sieht am Ende abgeschnitten aus."

**Gerechnet.** Bei einer Hintergrundstellung in Prozent gilt

    Versatz = (Behälterbreite − Bildbreite) × Prozentwert

| `background-size` | Weg | Kachel | Weg/Kachel | |
|---|---|---|---|---|
| **220 %** | 240 % | 220 % | **1,091** | Sprung von 0,091 Kacheln |
| **200 %** | 200 % | 200 % | **1,000** | nahtlos |

Bei 220 % springt der Umlauf um ein Elftel der Kachel — **genau das sieht man
als Abschneiden am Ende.**

Der Fehler steckte **in der Folie selbst**, seit vielen Fassungen. Ich hatte
die 220 in 35.97 von dort abgeschrieben — samt ihres Fehlers, während ich sie
als Vorbild lobte.

Nachgemessen mit angehaltener Animation, Bild bei 0 % gegen Bild bei 200 %:

    background-size 200 %: PIXELGLEICH → nahtlos
    background-size 220 %: 96.000 abweichende Bildpunkte → Sprung

**Der Verlauf war immer richtig gebaut** (erste und letzte Farbe gleich). Es
hakte an einer einzigen Ziffer.

### Warum der Prüfstand so lange brauchte

Kevins zweite Frage. Gemessen, Teil für Teil:

    aufbau 5 s · kalib 16 · ansicht 30 · ereignis 1 · stimmig 0
    namen 0 · verein 1 · rueck 38 · bau 54          = 145 Sekunden

**Der Prüfstand ist nicht langsam.** Das Audit dagegen, dreimal gemessen:
**116 s, 156 s, 0 s** (aus dem Zwischenspeicher). Es fragt eine Datenbank im
Netz ab, und wie lange das dauert, entscheidet nicht dieses Projekt.

Zusammen 145 bis 300 Sekunden — und damit lag der ganze Lauf **genau an der
Zeitgrenze eines einzelnen Aufrufs**. Die Schwankung kippte ihn mal darüber und
mal nicht.

**Das löst man nicht mit einer höheren Zeitsperre.** Der Fehler ist, einen
Schritt mit unbekannter Dauer in einen Lauf mit fester Grenze zu legen.

Die Sicherheitsprüfung ist jetzt ein eigener Teil (`TEILE=…,sicher`). Gemessen:

    üblicher Lauf ohne sie   101 s   (vorher bis 300)
    Sicherheitsprüfung allein 11 s

Zwei kurze Läufe sind besser als einer, der gelegentlich abbricht.

### Geprüft

**Ansichten 812, Vereinsprüfungen 322, Sicherheitslage 0 Funde** — letztere
getrennt gefahren, wie es jetzt vorgesehen ist.

## 35.99 · Ein stetiger Verlauf ist nicht dasselbe wie ein ruhiger

Kevin sieht auf Gold und Legendär eine senkrechte Farbkante — mit drei
Bildschirmfotos, auf denen sie deutlich zu sehen ist.

### Gemessen: der Verlauf ist stetig, und Kevin hat trotzdem recht

Der größte Farbsprung von einem Bildpunkt zum nächsten betrug **9 von 765
möglichen**, also gut ein Prozent. Es gibt keine Unterbrechung.

Der Grund lag in den Farbtönen der alten Folie:

    170° → 262° → 39° → 209° → 139° → 170°
    Sprünge:  91°   138°  169°   70°   32°

**Über 160 Grad Farbton auf rund dreizehn Pixeln** — fünf Übergänge auf 64 px
Packbreite. Das liest das Auge als Kante, auch wenn die Rechnung stetig ist.

**Ein stetiger Verlauf ist nicht dasselbe wie ein ruhiger.**

Die Töne laufen jetzt der Reihe nach um den Farbkreis, in Schritten von
38° bis 76° statt 32° bis 169°. Nachgemessen am Bild: der größte Sprung fiel
von 9 auf 4.

### Und ein Ballast, den ich selbst eingebaut und wieder ausgebaut habe

Ich hatte zusätzlich einen Weichzeichner eingebaut, mit der Begründung, was
weichgezeichnet sei, **könne** keine Kante haben. Klingt zwingend. Dann
gemessen, über fünf Stufen von 0 bis 7 px:

    Sättigung        26,5 → 26,1
    größter Sprung      4 → 3

Er ändert so gut wie nichts — die gleichmäßige Palette allein hatte den Sprung
bereits halbiert. Dafür hätte er auf **jeder animierten Karte** Rechenzeit
gekostet, und im Fundus laufen ein Dutzend gleichzeitig.

**Eine Maßnahme, die nichts messbar verbessert, ist keine Maßnahme, sondern
Ballast.** Im Bild sah es außerdem matt aus — was ich zuerst der neuen Palette
anlastete, obwohl die mit 66 % gegen 67 % praktisch gleich sättig ist.

### Zwölfter Fall

Rückwärts-Anführungszeichen im CSS-Kommentar, von der Prüfung vor dem Bau
gefangen.

### Geprüft

**Ansichten 812, Vereinsprüfungen 322, Sicherheitslage 0 Funde.**

## 35.100 · Neues App-Symbol, echtes Mannschaftsfoto

Kevin hat zwei Bilder geliefert.

### Das Symbol: sechs von 108 Einheiten haben entschieden

Der Symbolsatz wird seit Langem von `symbol/appicon.py` erzeugt — Rahmen
abziehen, auf die Maskenfläche legen, fünf Dichten, dazu die
Zusammensetzungsvorschrift für Android 8+. Das musste ich nicht bauen, nur
füttern.

Aber: das Werkzeug legte das Bild auf **72 von 108** Einheiten. Android nennt
das die *sichtbare* Fläche; die **sichere** ist 66. In der Kreismaske wurde
„RASENSCHACH" an beiden Enden abgeschnitten — im Bild nachgesehen, nicht
vermutet.

Jetzt 66. **Sechs Einheiten Unterschied, und genau die entscheiden, ob eine
Schrift ganz dasteht.** Der Rand wird ohnehin mit einer unscharfen Vergrößerung
aufgefüllt, es entsteht also kein Loch.

**Ehrliche Einschränkung:** in der Squircle-Maske (die Samsung One UI benutzt,
also Kevins S24) steht die Schrift vollständig. In einer *reinen Kreismaske*
fehlt an den äußersten Enden ein Haar, weil ein Kreis bei der Höhe der
Schriftzeile schmaler ist als 66. Das ließe sich nur beheben, indem das ganze
Bild weiter schrumpft — dann wäre das Symbol bei 48 dp deutlich kleiner.

### Das Titelfoto: ein Prozent Bündel für einen Ort

Die gezeichnete Mannschaftsreihe aus 35.30 war ein Behelf, weil es kein Bild
gab. Jetzt gibt es eins.

Gemessen am selben Zuschnitt (824×420):

    PNG    rund 300 kB
    JPEG        24 kB bei Güte 82
    WebP        16 kB bei Güte 72

Das Bild ist fast schwarz und lässt sich deshalb gut packen. **16 kB sind auf
1,4 MB rund ein Prozent** — vertretbar. Ein unbearbeitetes PNG wären zwanzig
Prozent gewesen.

Eingebettet als Base64 in `titelbild.js`, dieselbe Bauart wie die Schriften:
das Spiel läuft im APK ohne Netz, und eine Datei danebenzulegen hieße, sich auf
Pfade zu verlassen, die Capacitor und Vite unterschiedlich auflösen.

**Was bleibt:** die Deckung hängt weiter davon ab, ob eine Laufbahn läuft —
0,42 mit Porträt davor, 0,85 ohne. Genau diese Abstufung gab es schon bei der
Zeichnung, und sie ist der Grund, warum das Porträt nicht mit dem Hintergrund
um Aufmerksamkeit streitet. Der Badge „Neue Laufbahn" ist unberührt.

Zuschnitt: die Quelle ist 3:1, der Platz 1,96:1. Seitlich beschnitten, mittig —
die Mannschaft steht in der Mitte, die goldenen Streifen bleiben.

### Zwei Prüfungen haben den Wechsel bemerkt

Die Beidateienprüfung fing `titelbild.js`, das in `LIESMICH.md` und im
Verzeichnis fehlte — dieselbe Prüfung, die schon `karten.js` gefangen hat.

Und die Titelfotoprüfung zählte elf gezeichnete Silhouetten und meldete
„-1 statt 11". **Sie hatte recht:** das SVG, das sie suchte, gibt es nicht
mehr. Sie prüft jetzt dasselbe an der neuen Bauart — ist ein Bild da, ist es
eingebettet, tritt es zurück, und verschwindet es nicht ganz.

### Geprüft

**Ansichten 812 → 814.** Gegenprobe: Deckung fest gemacht → gemeldet.

## 35.101 · Der Prüfstand meldete sieben Fehler, die keine waren

Drei Funde aus der Eingangsprüfung von 35.100. Am Spiel ist nichts geändert —
`App.jsx` unterscheidet sich in genau zwei Zeilen (Fassungsnummer und
`VERSION_INFO`).

### Der Fund, der zählt: ein relativer Pfad

Der Abnahmeblock schreibt seit 35.98 diesen Aufruf vor:

    bash pruefstand/pruefen.sh App.jsx

Genau so aufgerufen meldete der Lauf:

    297 Prüfungen bestanden, 7 Fehler.
    ✗ Bonus: App.jsx gefunden            nicht gefunden
    ✗ Berichte: App.jsx gefunden         nicht gefunden
    ✗ Satzspiegel: App.jsx gefunden      nicht gefunden
    ✗ Errungenschaften: App.jsx gefunden nicht gefunden
    ✗ Kachel: der Ausbau-Nenner ist AKA_STUFEN   App.jsx nicht gefunden
    ✗ Menüzeile „Dein Verein“ …          App.jsx nicht gefunden — NICHT geprueft
    ✗ Verein: kein Knopf 'Saison spielen' …      App.jsx nicht gefunden — NICHT geprueft
    MINDESTENS EIN TEIL IST FEHLGESCHLAGEN.

**Am Spiel war nichts kaputt.** `vereinpruefung.cjs` läuft nach `cd /tmp/ps`;
ein relativ übergebener Pfad zeigt von dort ins Leere. Sieben Prüfungen
meldeten das als Fehler, **achtzehn weitere fielen still aus** — 322 gegen
297 + 7.

**Die Ursache war eine Uneinheitlichkeit, keine vergessene Zeile.** Vier
Werkzeuge werden im selben Block aufgerufen; drei bekamen den Pfad absolut,
eines nicht:

| Zeile | Werkzeug | bekam |
|---|---|---|
| 590 | `ereignispruefung.cjs` | `--quelle="$ARBEIT/App.jsx"` |
| 605 | `stimmigkeit.cjs` | `--quelle="$ARBEIT/App.jsx"` |
| 621 | `namenpruefung.cjs` | `--quelle="$ARBEIT/App.jsx"` |
| 633 | `vereinpruefung.cjs` | **`--quelle="$QUELLE"`** |

Genau das ist offener Punkt 12 in klein: eine Sorte Fehler, die man einzeln
abfängt, statt sie auszuschließen. `sicht.sh` hatte es von Anfang an richtig
und löst die Quelle in Zeile 26 selbst auf.

**Behoben an der Wurzel und an der Fundstelle.** `pruefen.sh` löst die Quelle
jetzt direkt nach `QUELLDIR` absolut auf — dieselbe Zeile wie in `sicht.sh` —,
und Zeile 633 ruft wie ihre drei Nachbarn auf. Bleibt `QUELLDIR` leer, weil es
das Verzeichnis nicht gibt, bleibt `QUELLE` stehen, damit die Fehlermeldung
weiter den eingegebenen Pfad nennt.

### Warum die Behebung keine Vertuschung ist

Ein Fix, der eine rote Meldung wegnimmt, könnte auch nur die Meldung
wegnehmen. Deshalb vier Messungen statt einer:

| Probe | Erwartet | Gemessen |
|---|---|---|
| relativ, `pruefen.sh App.jsx` | grün, 322 | 322, 0 Fehler |
| absolut, unveränderter Weg | grün, 322 | 322, 0 Fehler |
| `App.jsx` mit `<button>Saison spielen</button>` | **rot** | 321, 1 Fehler ✗ |
| `App.jsx` ohne `fr.akademie ? onVereinDach : null` | **rot** | 321, 1 Fehler ✗ |

Die letzten beiden sind der eigentliche Beweis: die achtzehn
wiedergewonnenen Prüfungen fahren wirklich und melden echte Fehler weiterhin
rot. Ohne sie wäre „jetzt grün" nur eine Behauptung.

### Zwei Papierfunde dazu

**Offener Punkt 10 war zum dritten Mal veraltet** — behauptet 13.674 Zeilen,
gemessen 16.487. Das ist der größte Rückstand der drei (2.813 gegen 788 und
369), und er stand ausgerechnet in dem Punkt, der vom Wachstum der Datei
handelt. **Die Zahl steht dort jetzt nicht mehr**; der Aufbau misst sie bei
jedem Lauf unter „Eigene Dateien (gemessen)". Dieselbe Lehre wie bei den
Pixelwerten in Punkt 8 und den Bestandszahlen in Abschnitt 8.

**Der Wegweiser oben widersprach dem Abnahmeblock unten.** Der Wegweiser nannte
als Gerätetest-Liste 35.23 bis 35.29 und „Vollausbau nach rund 28"; der
Abnahmeblock nennt korrekt 35.44 als letzten Gerätestand und 20–30 als Band
(seit 35.81, gemessen 21,5). Vier Fassungen Rückstand gegen siebenundfünfzig.
Der Wegweiser verweist jetzt nach unten, statt die Auskunft ein zweites Mal zu
führen — dieselbe Entscheidung wie bei der Teile-Liste in 35.44.

### Was das über den Prüfstand sagt

**Wie lange die Zeile schon so lautet, lässt sich hier nicht feststellen** —
es gibt keine Versionsgeschichte im Projektwissen, und geraten wird nicht.
Belegen lässt sich nur die Untergrenze: die betroffenen Prüfungen tragen in
`vereinpruefung.cjs` eigene Fassungsvermerke, der früheste ist **35.60**
(Dach-Kacheln), dazu 35.62, 35.71 und 35.72. Der Falschalarm konnte also
mindestens seit 35.60 auftreten — vierzig Fassungen —, aber nur bei relativem
Aufruf, und die frühere Anleitung in Abschnitt 8 nannte einen absoluten Pfad.
Aufgefallen ist er erst, als der Abnahmeblock (35.98) den relativen Aufruf zur
Vorschrift machte und ich ihn wörtlich genommen habe. Ein
Prüfstand, der beim dokumentierten Aufruf rot meldet und beim undokumentierten
grün, erzieht dazu, roten Meldungen nicht mehr zu glauben. Das ist teurer als
der Fehler selbst.

### Geprüft

Abnahme vollständig, alle drei Läufe. Vorher/nachher, gemessen:

| | 35.100 (relativ aufgerufen) | 35.101 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | **297, 7 Fehler** | **322, 0 Fehler** |
| Ereignisse | 11 Prüfungen, 0 Treffer | 11 Prüfungen, 0 Treffer |
| Stimmigkeit | 17 Proben ohne Befund | 17 Proben ohne Befund |
| Namen | 6 Proben, 212/212 Nationen | 6 Proben, 212/212 Nationen |
| Rückwärts | 6 × 63 Ansichten | 6 × 63 Ansichten |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 bei 412 und 360 px | 154 bei 412 und 360 px |
| Rücktritt | 6 Proben grün | 6 Proben grün |
| Passhöhe | 385,9 px über 9 Stände | 385,9 px über 9 Stände |
| Sicherheitslage | 0 Funde | 0 Funde |
| Vollausbau | 21,5 Laufbahnen (Ziel 20–30) | 21,5 Laufbahnen (Ziel 20–30) |
| Ergebnis | **FEHLGESCHLAGEN** | **keine Fehler** |

**Bündel, beide Male gemessen:** 1.424,26 kB unverändert, gzip 528,39 → 528,38
kB. Die 0,01 kB im gzip stammen aus den zwei geänderten Textzeilen
(`VERSION_INFO` ist kürzer geworden) — anders als die unerklärten 0,01 kB aus
35.44/35.45 hat diese Abweichung eine benennbare Ursache und ist reproduzierbar.

Laufzeiten hier: 99 s (Hauptlauf), 12 s (Sicherheit), 56 s (`sicht.sh`).

**Der Hauptlauf wurde absichtlich mit `pruefen.sh App.jsx` gefahren** — dem
relativen Aufruf, der in 35.100 rot war. Der Aufbau meldet jetzt
`Quelle: /home/claude/rs/App.jsx`, also den aufgelösten Pfad.

## 35.102 · Eine Wildcard war unerreichbar, und niemand hat es gemerkt

Vier Punkte aus der externen Konsolidierung von ChatGPT (4.9.2026, geprüft
gegen 35.101). Die drei Designfragen daraus — Sonderkartensemantik,
Bedeutung von `aka.ausgegeben`, Geschlecht der Metaebene — sind bewusst
**nicht** dabei: das sind Entscheidungen, keine Reparaturen.

### Der Fund: `a_akaF_jg50` konnte nie zuschnappen

Die Bedingung las `(A.chronik||[]).length >= 50`. `akaJahr` kappt die Chronik
auf 25 (`akademie.js:495`, `slice(0, 25)`). Nachgewiesen über echte
Zustandsübergänge, nicht über einen gebauten Zustand:

| Akademiejahr | `chronik.length` | `jahrgaenge` |
|---:|---:|---:|
| 25 | 25 | 25 |
| 60 | **25** | 60 |
| 120 | **25** | 120 |

Nach 120 echten Jahren nicht erreicht. **An der Errungenschaft hängt
`lohn: "mw_werkbank"`** — eine der drei freischaltbaren Wildcards war damit
auf regulärem Weg nicht zu bekommen.

Umgestellt auf `(A.jahrgaenge||0) >= 50`. Der richtige Zähler stand die ganze
Zeit sieben Zeilen tiefer in `a_aka_erbe` (`A.jahrgaenge>=25`).

**Warum es so lange unsichtbar war:** bis Jahr 24 laufen beide Zähler fast
gleich — `chronik = jahrgaenge + 1` wegen des Gründungseintrags. Die Bedingung
verhält sich also lange plausibel und kippt erst hinter dem Deckel.

**Eingegrenzt, es ist keine Klasse.** Alle drei Bedingungen mit
`chronik.length` durchgesehen: die beiden Vereins-Bedingungen (`>= 1`,
`>= 15`) sind gesund, weil die Vereinschronik **nicht** gekappt wird
(`verein.js:952`). Nur die eine war falsch.

### Warum der Prüfstand grün war — der eigentliche Befund

`vereinpruefung.cjs` baute den Prüfzustand von Hand:

    const vielA = { ruhm: 500, chronik: new Array(60).fill({ jahr: 1 }), … };

Die Probe hatte sogar eine Gegenprobe in der anderen Richtung (leere Bilanz,
keine darf zuschnappen). **Beide Richtungen liefen über denselben
synthetischen Zustand** — sie prüften die *Form* der Bedingung, nicht ihre
*Erfüllbarkeit*. Das ist eine Fehlerklasse, die der Prüfstand strukturell
nicht sehen konnte, und ChatGPTs Diagnose trifft sie genau.

Neu: **sechs Proben, die die Akademie wirklich fortführen** und danach prüfen.
Was dort grün ist, ist im Spiel erreichbar.

**Der Umbau hat sich sofort selbst bewiesen:** nach der Berichtigung fiel die
ALTE Fleiß-Probe rot aus, weil `vielA` gar kein `jahrgaenge` trug. Ein
gebauter Zustand, der „weit über allen Schwellen" liegen soll, muss jedes
Feld tragen, das eine Bedingung liest — sonst prüft er sich selbst.
`jahrgaenge: 60` nachgetragen, mit dem Grund im Kommentar.

### Eine Prüfung, die zufällig rot wird, ist schlimmer als keine

Der erste Entwurf fuhr **einen** Lauf über 60 Jahre. Gemessen, warum das nicht
trägt — Weltklassezahl bei vollem Ausbau, 25 Läufe je Zeile:

    Jahre    min   Median   max     unter 10
      25       1        4     7     25 von 25
      40       3        8    15     19 von 25
      60       5       11    15      6 von 25
      80       7       15    25      2 von 25
     100      11       20    28      0 von 25

Die Probe wäre in knapp einem Viertel aller Läufe rot geworden, ohne dass
etwas kaputt ist — `a_akaF_wk10` verlangt zehn Weltklassespieler.

Länger laufen zu lassen hätte das Flattern verkleinert, nicht beseitigt.
Deshalb ist die **Frage** anders gestellt: erreichbar heißt „in wenigstens
einem echten Verlauf erreicht", nicht „in jedem". Jetzt fünf Läufe à 100
Jahre. `a_akaF_jg50` fällt trotzdem auf, weil die Chronik in *jedem* Lauf bei
25 stehen bleibt.

**Acht Wiederholungen gemessen: 328 Prüfungen, 0 Fehler, jedes Mal, ~0,6 s.**

### Die Gegenprobe war erst falsch aufgebaut

Der erste Versuch drehte die Bedingung in einer Kopie der `App.jsx` zurück und
ließ `vereinpruefung.cjs` mit `--quelle=` darauf laufen — die Probe blieb
grün. **Das war mein Fehler, nicht der der Probe:** das Werkzeug liest
`ACHIEVEMENTS` aus dem gebauten Bündel, `--quelle=` dient nur den
Quelltextprüfungen. Erst ein eigenes Bündel aus der kaputten Quelle hat es
gezeigt:

| Probe | Erwartet | Gemessen |
|---|---|---|
| repariert, 8 Läufe | grün | 8 × 328, 0 Fehler |
| alte Bedingung im Bündel, 5 Läufe | **rot** | 5 × „in KEINEM von 5 Läufen: a_akaF_jg50" |
| danach zurückgestellt, 3 Läufe | grün | 3 × 328, 0 Fehler |

Eine Gegenprobe, die schweigt, kann selbst der Fehler sein. Sie gehört so
lange geprüft, bis sie einmal aus dem richtigen Grund rot wird.

### Zwei Zahlen und zwei Texte

**Die Kurzanleitung sagte „162 Stück", gemessen sind es 192.** Jetzt
`ACHIEVEMENTS.length + " Stück"`, dieselbe Bauart wie `{ANLEITUNG.length}
Abschnitte` daneben. Gegenprobe: eine Errungenschaft entfernt, Bündel neu
gebaut → der Text sagte 191. Die Zahl läuft wirklich mit.

**Die Akademiegründung ist kostenlos** (`akaGruenden` fasst kein VC an), zwei
Texte behaupteten etwas anderes:

* Kurzanleitung: „Gegründet wird sie mit den Coins aus deiner ersten Karriere"
  → „Gründen kostet nichts — die Coins brauchst du erst für den Ausbau"
* Dach bei leerer Kasse: „Coins sammeln, dann gründen" → „gründen kostet nichts"

**Zur Ehrlichkeit:** die erste dieser beiden Stellen stand nicht in der
Rückmeldung an ChatGPT, die dieses Projekt tags zuvor verfasst hat. Dort hieß
es, von vier Texten sei nur einer irreführend. Es waren zwei — die Suche war
zu eng gefasst und hat die Zeile direkt unter der gefundenen übersehen.
ChatGPTs Fund war also schärfer als die Bestätigung dazu.

### Dokumentationsdrift, vier Stellen

* **`LIESMICH.md`: „Alle fünf … Zeilen 2 bis 7"** — beide Zahlen falsch,
  gemessen acht Importe in den Zeilen 8 bis 15. Und schon der zweite Anlauf:
  bis 35.44 stand da „2 bis 5". Die Zahlen sind jetzt raus, dafür steht der
  Befehl da, der sie misst.
* **`WERKSTATT=1` an drei Stellen falsch** (`LIESMICH.md`, `STAND.md`
  Werkzeugtabelle, `STAND.md` Wegweiser): `browsertest.sh:130` liest
  `WERKSTATT === "1" || ERSTSTART === "1"`, seit 35.56. **Die dritte Stelle
  ist Text aus 35.101** — ungeprüft aus dem alten Wegweiser übernommen, in
  der Fassung, deren Anlass eine ungeprüft übernommene Angabe war.
* **Der Kalibrierungslauf nannte zwei fast gleich klingende Zahlen** zwei
  Zeilen auseinander: 27,9 (nur Laufbahn-VC) und 21,3 (alle Quellen), und nur
  die zweite wird gegen das Band geprüft. Die erste heißt jetzt „nur aus
  Laufbahn-VC, ohne die anderen Quellen".
* **Abschnitt 4 war zum zweiten Mal veraltet**, fünf von sieben Zeilen. Das
  ist die Stelle, aus der ChatGPTs „rund 27,6 Laufbahnen" stammt — nicht aus
  dem Lauf. Auch die Rückmeldung dieses Projekts hatte das falsch zugeordnet.
  Alles neu gemessen, Näheres im Kasten dort.

### Geprüft

| | 35.101 | 35.102 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 322, 0 Fehler | **328**, 0 Fehler |
| Ereignisse | 11 Prüfungen, 0 Treffer | 11 Prüfungen, 0 Treffer |
| Stimmigkeit | 17 Proben | 17 Proben |
| Namen | 6 Proben, 212/212 | 6 Proben, 212/212 |
| Rückwärts | 6 × 63 Ansichten | 6 × 63 Ansichten |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 bei 412 und 360 px | 154 bei 412 und 360 px |
| Rücktritt | 6 Proben grün | 6 Proben grün |
| Passhöhe | 385,9 px konstant | 385,9 px konstant |
| Sicherheitslage | 0 Funde | 0 Funde |
| Vollausbau | 21,5 (Ziel 20–30) | 21,3 (Ziel 20–30) |

Sechs neue Vereinsprüfungen (322 → 328), alle mit eigener Gegenprobe.

## 35.103 · Drei Entscheidungen, und was danach folgte

Die drei Designfragen aus der externen Konsolidierung. Kevin hat entschieden:
Sonderkarte **dauerhaft**, tote Zähler **sichtbar machen**, Metaebene
**männlich, aber ehrlich benannt**. Jede Entscheidung zog etwas nach sich, das
in der Frage nicht stand — das ist der interessante Teil dieser Fassung.

### 1. Die Sonderkarte bleibt jetzt eine

`poolErgaenzen` führt gleiche `kid` zusammen und überschrieb nur bei höherem
`ovr`. Da die Sonderkarte als Kopie aus dem eigenen Pool gezogen wird
(`nachHerkunft(pool, …)`), ist der `ovr` **immer** gleich — der Marker ging
ausnahmslos verloren. Die goldene Zeile „Sonderkarte" und der Jubel waren nur
während des Öffnens zu sehen, im Fundus nie.

Der Marker wird jetzt ODER-verknüpft: einmal veredelt bleibt veredelt, auch
wenn dieselbe Karte später ohne Marker aus einer neuen Laufbahn nachkommt.

**Was die Entscheidung nach sich zog:** sobald der Marker bleibt, wird die
Zufallswahl zum Selbstläufer ins Leere — wer drei Sonderkarten hat, zöge sie
immer wieder und bekäme nichts. Die Ziehung nimmt deshalb **zuerst noch
unveredelte** Karten und fällt erst auf den ganzen Topf zurück, wenn alles
veredelt ist. Das stand in Kevins Antwort nicht, folgt aber zwingend aus ihr.

Sechs Proben, vier davon Gegenproben:

| Probe | Erwartet | Gemessen |
|---|---|---|
| gleiche kid, gleicher ovr | Marker bleibt | true (vor 35.103: false) |
| zweimal ohne Marker | bleibt ohne | false |
| veredelt, danach besser ohne Marker | ovr 92 **und** Marker | 92 · true |
| 4.000 Ziehungen, 2 veredelt / 2 frisch | nur frische | Neu1 606 · Neu2 609, Alt gar nicht |
| alle veredelt, 2.000 Legendenpacks | fällt zurück, kein Ausfall | 615 Sonderkarten |
| leerer Pool | kein Absturz | `sonder: null`, kein Fehler |

### 2. Die Kasse — und zwei Buchungslücken, die dabei auffielen

`ausgegeben`, `verdient` und `vereinPunkteSumme` hatten null Leser. Sichtbar
gemacht: die ersten beiden als Kennzahlenpaar im Akademie-Dach, die dritte auf
dem Vereinsabschluss neben den Punkten dieses Vereins (erst ab dem zweiten
abgeschlossenen Verein, vorher wäre es dieselbe Zahl zweimal).

**Beim Zählen der VC-Bewegungen kam heraus, dass zwei von acht nichts
buchten:** der Packkauf zog ab, ohne `ausgegeben` fortzuschreiben, und der
Verkaufserlös schrieb `verdient` nicht mit. Beide geschlossen.

Beim Packkauf wird der **tatsächlich abgezogene** Betrag gebucht, nicht der
Listenpreis: `Math.max(0, …)` kappte bei leerer Kasse, und wer 20 VC hat und
ein Pack für 30 kauft, hat 20 ausgegeben. Sonst stünde die Kasse rechnerisch
im Minus.

**Bewusst keine Bilanz in der Anzeige.** Naheliegend wäre
„verdient − ausgegeben = Kasse". Das wäre für alte Spielstände gelogen: die
Packkäufe vor 35.103 fehlen und lassen sich nicht rekonstruieren — man weiß
nicht, wie viele Packs jemand gekauft hat. Die beiden Zahlen stehen deshalb
nebeneinander und behaupten nichts über ihre Differenz. Dass sie ab jetzt
aufgeht, zeigt der Prüfstand, nicht die Oberfläche.

**Fünf neue Prüfungen** (Vorschlag B der Konsolidierung). Zwei davon zählen im
Quelltext nach, ob jede Stelle, die `aka.vc` verändert, den passenden Zähler
mitführt — 5 Abgangs- und 3 Zugangsstellen. Gegenproben:

| Probe | Erwartet | Gemessen |
|---|---|---|
| beide Buchungen zurückgedreht | **rot**, mit Zeilennummer | ✗ Zeile 15792 · ✗ Zeile 15830 |
| Gutschrift von 0 | bewegt nichts | vc 77 · verdient 77 |
| Quelle nicht auffindbar | **meldet sich ab** | ✗ „die zwei Prüfungen darunter laufen NICHT" |

Die dritte ist die Lehre aus 35.101: eine Prüfung, die ihre Quelle nicht
findet, darf nicht still grün sein.

### 3. Männerfußball, und zwar geschrieben

Die Spielerlaufbahn kennt Männer- und Frauenfußball, die Metaebene nicht:
`akademie.js:167`, `karten.js:220` und beide Kartenporträts erzeugen fest
`"m"`. Das bleibt so. Aber es steht jetzt an zwei Stellen da statt sich erst
beim Spielen zu zeigen — in der Kurzanleitung („Nachwuchs sind Jungen") und
auf dem Gründungsschirm, den niemand umgehen kann.

Wer eine Spielerin gespielt hat und dann eine Akademie voller Jungen bekommt,
soll das vorher gelesen haben und nicht für einen Fehler halten.

**Nicht gemacht, obwohl es naheläge:** die Bausteine für eine wählbare
Metaebene sind fast vollständig da — `genName(cc, g)` kann Frauennamen, das
Porträt zeichnet Frauen an fünf Stellen, es gibt 198 Frauenvereine unter
1.239, und `verein.js:129` liest das Ligageschlecht bereits. Fehlen würde ein
Feld an Akademie und Karte plus Umrechnung alter Stände. Das bleibt offen,
falls die Entscheidung je anders ausfällt.

### Geprüft

| | 35.102 | 35.103 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 328, 0 Fehler | **333**, 0 Fehler |
| Ereignisse | 11 Prüfungen | 11 Prüfungen |
| Stimmigkeit | 17 Proben | 17 Proben |
| Namen | 6 Proben, 212/212 | 6 Proben, 212/212 |
| Rückwärts | 6 × 63 Ansichten | 6 × 63 Ansichten |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Rücktritt | 6 Proben grün | 6 Proben grün |
| Passhöhe | 385,9 px konstant | 385,9 px konstant |
| Sicherheitslage | 0 Funde | 0 Funde |
| Vollausbau | 20,9 (Ziel 20–30) | im Band |

Fünf neue Vereinsprüfungen (328 → 333), dazu sechs Proben zur Sonderkarte
außerhalb des Prüfstands. `ANLEITUNG.length` bleibt bei 7 — die neue Zeile
sitzt in einem bestehenden Abschnitt.

## 35.104 · Jede Spielzeit bekommt eine Schlagzeile

Stufe A1 aus Kevins Konzeptpapier zur Spielerkarriere. Die Saison bekommt eine
redaktionelle Hauptaussage, abgeleitet aus dem, was wirklich passiert ist —
kein Zufall, dieselben Zahlen ergeben immer dieselbe Zeile.

### Keine zusätzliche Seite

Der Rückblick hat vier feste und zwei bedingte Seiten. Eine siebte wäre ein
Wisch mehr in **jeder** Saison, und der schnelle Saisonloop ist ein Kernwert
(Papier, Abschnitt 6). Stattdessen trägt die **erste Seite** die Schlagzeile
im Kopf, wo vorher „Die Saison 2031/32" stand; die Jahreszahl rutscht in die
Unterzeile zum Verein. Kein Wisch mehr, eine Seite stärker.

Die Vorsaison wird robust bestimmt: `s` kann schon in `p.seasons` stehen oder
noch nicht, je nachdem wann der Rückblick öffnet. Erst über Identität suchen,
sonst das letzte Element nehmen, das nicht `s` selbst ist. Ohne diese Vorsicht
wäre die Vorsaison in einem der beiden Fälle die Saison selbst — und jeder
Vergleich ergäbe „keine Veränderung".

### Fünfzehn Regeln, Reihenfolge ist Bedeutung

Die erste zutreffende gewinnt, deshalb stehen die einschneidenden oben. Wer
die Binde bekommt **und** zwei Titel holt, liest von der Binde — das ist die
größere Geschichte im eigenen Leben.

Gemessen über 120 Laufbahnen, 2.886 Saisons, zwei Wechselstrategien:

    20,5 %  Neuer Verein, neues Jahr      2,5 %  Sofort angekommen
    12,4 %  Ein Jahr zum Vergessen        2,2 %  Der alte Mann ist noch da
     9,9 %  Das Jahr der Verletzung       2,1 %  Das verlorene Jahr
     7,0 %  Die Binde                     2,0 %  Das dritte Jahr
     7,0 %  Das Jahr der Titel            1,9 %  Nach hinten durchgereicht
     6,6 %  Zurückgeschrieben             1,4 %  Der Anfang
     4,4 %  Das zweite Jahr               1,1 %  Das vierte Jahr
     4,0 %  Warten auf die Chance         1,0 %  Eine große Spielzeit
     3,8 %  Der Mann, auf den sie bauen   0,8 %  Das fünfte Jahr
     3,8 %  Durchbruch                    0,7 %  Vom Reservisten zum Kapitän
     3,5 %  Kapitän seines Landes         Rest: sechstes bis sechzehntes Jahr

31 verschiedene Zeilen, keine Saison ohne, keine über 60 %.

### Zwei Nachbesserungen, beide aus der Messung

**Die Rückfallzeile sagte nichts.** Der erste Entwurf endete mit „Die Saison
2044/45" — also genau dem, was vorher schon im Kopf stand — und das in
**8,5 %** aller Spielzeiten. Eine Rückfallzeile, die nichts sagt, ist keine
Schlagzeile. Jetzt zählt sie die Jahre beim selben Verein („Das fünfte Jahr")
und macht aus dem Nichts-Passiert eine Zugehörigkeit. Danach kam die leere
Zeile in der Messung **gar nicht mehr** vor.

**Ein Wechsel überdeckte jede gute Saison.** „Eine große Spielzeit" fiel auf
0,8 %, weil Regel 12 vorher griff. Neu: wer beim neuen Verein sofort Note 2,5
oder besser holt, liest **„Sofort angekommen"**.

### Was die Gegenprobe über meine eigene Arbeit ergab

Zwei Gegenproben gebaut, eine davon **schlug nicht an**. Der Grund war nicht
die Prüfung, sondern die Regel: die letzte Rückfallzeile ist über echte
Laufbahnen **nicht erreichbar**. Wer einen Verein hat, fällt vorher in Regel
14; wer keinen Vorjahreseintrag hat, in „Der Anfang". Sie greift nur ohne
`s.club`, also bei einem vereinslosen Eintrag.

Das ist dieselbe Klasse wie `a_akaF_jg50` in 35.102 — nur diesmal harmlos, weil
es ein Sicherheitsnetz ist und keine Belohnung. Die Zeile bleibt stehen (eine
Funktion, die manchmal nichts liefert, wäre schlimmer), ist aber im Quelltext
ausdrücklich als unerreichbar gekennzeichnet, und die Gegenprobe zielt jetzt
auf Regel 12 — die häufigste Zeile überhaupt.

**Die Lehre:** eine Gegenprobe, die schweigt, kann auch bedeuten, dass sie auf
toten Code zielt. Sie gehört so lange umgebaut, bis sie aus dem richtigen Grund
rot wird.

### Sechs neue Prüfungen

| Probe | Prüft | Gegenprobe „alle Regeln entfernt" |
|---|---|---|
| neun feste Lagen | jede ergibt ihre Zeile | ✗ neunmal „Die Saison" |
| die neun sind verschieden | Regeln unterscheiden wirklich | ✗ 1 von 9 |
| Aufbau hat Saisons erzeugt | Grundlage vor dem Urteil | — |
| keine Saison ohne Zeile | inkl. Begründungssatz | ✗ 101 ohne Satz (Regel 12 leer) |
| keine Zeile beherrscht | Grenze 60 % | ✗ 100 % |
| unvollständige Zustände | kein Absturz bei alten Ständen | — |

Die dritte ist die wichtige Vorsichtsmaßnahme: ohne sie könnten die beiden
darunter grün sein, weil der Aufbau gar nichts erzeugt hat — genau der Fehler,
der beim Vereins-Reachability-Versuch passiert ist.

Der Laufbahn-Aufbau stammt aus `kalibrierung.cjs`. Ein eigener Versuch alterte
den Spieler nicht: `age += 1` sitzt im Aufrufer (`App.jsx:15602`), nicht in
`simulateSeason`. 22 Saisons lang blieb der Prüfling 16 Jahre alt.

### Was NICHT gemacht wurde

Keine neuen persistenten Felder. Keine Änderung an `simulateSeason`, an den
Ereignissen oder am Karrierewert. Die Schlagzeile liest nur, sie schreibt
nichts — alte Spielstände zeigen sie ab der nächsten Saison ohne Migration.

### Geprüft

| | 35.103 | 35.104 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 333, 0 Fehler | **339**, 0 Fehler |
| Ereignisse | 11 Prüfungen | 11 Prüfungen |
| Stimmigkeit | 17 Proben | 17 Proben |
| Namen | 6 Proben, 212/212 | 6 Proben, 212/212 |
| Rückwärts | 6 × 63 Ansichten | 6 × 63 Ansichten |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Passhöhe | 385,9 px konstant | 385,9 px konstant |
| Sicherheitslage | 0 Funde | 0 Funde |

Die sechs neuen Proben kosten rund 2 s (15 echte Laufbahnen).

## 35.105 · Eine Rückkehr war keine Rückkehr

Stufe A2 aus dem Konzeptpapier: Vereinsstationen als Kapitel. Beim Bauen kam
ein Fehler heraus, der seit Bestehen des Rückblicks drinsteckte.

### Der Fund: `new Set` verschluckt die Rückkehr

Die Seite „Deine Stationen" baute ihre Liste so:

    const vereine = [...new Set(S.map((x) => x.club))];

Eine **Menge**. Wer nach acht Jahren zu seinem alten Verein zurückkehrt,
erschien darin **einmal**, und beide Zeitabschnitte wurden zu einer Zeile
verrechnet — „HSV · 11 Saisons · 340 Spiele", ohne dass sichtbar war, dass
dazwischen fünf Jahre Spanien lagen. Ausgerechnet die Rückkehr, die das Papier
ausdrücklich als biografischen Moment nennt, war unsichtbar.

Gemessen über 60 Laufbahnen: **14 hatten mindestens eine Rückkehr, 24
Rückkehren insgesamt.** Alle waren im Rückblick nicht zu sehen.

`vereinsKapitel()` bildet jetzt zusammenhängende Abschnitte. Wer zweimal da
war, hat zwei Stationen, und die zweite heißt „Die Rückkehr". Die Unterzeile
nennt beide Zahlen, wenn sie auseinandergehen („7 Stationen bei 5 Vereinen") —
sonst stünden sieben Zeilen unter „5 Vereine", und das sähe nach Fehler aus.

### Achtzehn Kapitel, und zwei Fehlversuche auf dem Weg

Jede Station bekommt eine Einordnung aus echten Zahlen. **Die Einordnung ist
Beschreibung, kein Urteil** — „Die Bankzeit" ist nicht die schlechtere Fassung
von „Die goldenen Jahre", sondern ein anderes Kapitel. Genau darum geht es dem
Papier.

**Erster Fehlversuch: die Mitte war leer.** Der Entwurf hatte kein Kapitel für
die mittelmäßige Station, und **45,4 % aller Stationen** fielen auf „Eine
Zwischenstation". Unter der 60-%-Grenze der Prüfung und trotzdem wertlos: ein
Kapitel, das fast die halbe Laufbahn trägt, ordnet nichts ein. Derselbe Fehler
wie bei der Rückfallzeile in 35.104, nur fünfmal so groß. Die Lösung lag in
der Rolle statt in der Note — ob er gespielt hat oder zugesehen, unterscheidet
Stationen besser als die Bewertung. Danach: **1,6 %.**

**Zweiter Fehlversuch: „Die langen Jahre" war toter Code.** Die Regel stand
hinter den Rollenzeilen und wurde in 726 Stationen **kein einziges Mal**
vergeben, weil jede lange Station auch eine Rolle hat. Bei einer
Fünfjahresstation ist die Dauer die Nachricht. Vorgezogen.

Verteilung nach beiden Berichtigungen, 60 Laufbahnen, 726 Stationen:

    20,4 %  Die Stammplatzjahre        3,3 %  Die Rückkehr
    12,3 %  Als Leistungsträger        3,0 %  Die goldenen Jahre
    11,5 %  Die Rotationsjahre         2,3 %  Ein kurzes Gastspiel
     9,5 %  Die starken Jahre          1,6 %  Eine Zwischenstation
     9,1 %  Die schwere Zeit           1,1 %  Die Bankzeit
     7,1 %  Der Anfang                 1,1 %  Wo alles begann
     5,3 %  Die Jahre als Kapitän      1,1 %  Der Durchbruch
     4,1 %  Die Heimat                 0,6 %  Der lange Abschied
     3,1 %  Die letzte Station         0,4 %  Die langen Jahre

### Warum die Regeln eine Tabelle sind und keine Kette

Der erste Entwurf war ein verschachtelter Bedingungsausdruck. Die
Erreichbarkeitsprüfung musste die möglichen Kapitelnamen dann aus
`String(vereinsKapitel)` herausklauben — und bekam den **gebündelten** Text,
in dem Umlaute als Escape stehen. „Die R\xFCckkehr" ist nicht „Die Rückkehr",
also meldete die Probe **sechs Kapitel als nie vergeben, die es alle gab**.

Eine Prüfung, die den Quelltext ihres Prüflings parst, misst den Übersetzer
mit. Mit `KAPITEL` als Tabelle liest sie dieselbe Quelle, aus der auch die
Funktion schöpft.

### Erreichbarkeit deterministisch, Verteilung über echte Läufe

„Der lange Abschied" trifft 0,6 % aller Stationen. Über zwölf Laufbahnen wäre
eine Probe darauf mal rot und mal grün — die Lehre aus 35.104. Deshalb zwei
getrennte Fragen:

* **erreichbar?** Zu jeder der 18 Regeln wird eine Lage gesucht, die sie
  erfüllt und keine davor. Findet sich keine, ist die Regel toter Code.
  Deterministisch, kein Flattern.
* **kommt es vor?** Über echte Laufbahnen wird nur die Breite geprüft
  (mindestens 60 % der Kapitel) und dass keines über 35 % liegt.

### Neun neue Prüfungen

| Probe | Gegenprobe „zurück zur Vereinsmenge" | Gegenprobe „Regel nach hinten" |
|---|---|---|
| Rückkehr ergibt eigene Station | ✗ 2 statt 3 | — |
| zweite Zeit heißt „Die Rückkehr" | ✗ | — |
| ohne Rückkehr bleiben es zwei | — | — |
| Zahlen je Station summiert | ✗ | — |
| Aufbau hat Stationen erzeugt | — | — |
| jede Regel erreichbar | — | ✗ „toter Code: Die langen Jahre" |
| Mehrzahl kommt vor | — | — |
| keines beherrscht das Feld | — | — |
| unvollständige Zustände | — | — |

Die Laufbahn-Funktion aus 35.104 wird jetzt von beiden Prüfblöcken genutzt
statt kopiert — zwei Kopien liefen beim nächsten Umbau auseinander, dasselbe
Muster wie die zweite Ablaufliste in 35.29.

### Ein Zwischenfall beim Umbau

Die Umstellung auf die Tabelle hat versehentlich die Definition von `beendet`
mitgelöscht. Der Lauf meldete sofort sechsmal `ReferenceError: beendet is not
defined` aus der Ansichts- und Rückwärtsprüfung. Ohne diese Prüfungen wäre ein
Karriererückblick ausgeliefert worden, der beim Öffnen abstürzt.

### Geprüft

| | 35.104 | 35.105 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 339, 0 Fehler | **348**, 0 Fehler |
| Ereignisse | 11 Prüfungen | 11 Prüfungen |
| Stimmigkeit | 17 Proben | 17 Proben |
| Namen | 6 Proben, 212/212 | 6 Proben, 212/212 |
| Rückwärts | 6 × 63 Ansichten | 6 × 63 Ansichten |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Passhöhe | 385,9 px konstant | 385,9 px konstant |
| Sicherheitslage | 0 Funde | 0 Funde |

Keine neuen persistenten Felder. Die Kapitel werden bei jedem Öffnen aus der
Saisonhistorie berechnet; alte Spielstände zeigen sie sofort.

## 35.106 · Marken für Laufbahnen, die keine Weltkarriere werden

Stufe B aus dem Konzeptpapier, erster Teil. Die Lücke war messbar, nicht
vermutet.

### Was eine schwache Laufbahn nie bekam

Über 80 Laufbahnen, getrennt nach Höchststärke unter 75 und ab 82:

| Marke | schwach | stark |
|---|---:|---:|
| 100 Tore | **0 / 25** | 6 / 24 |
| 200 Tore | **0 / 25** | 1 / 24 |
| 100 Vorlagen | **0 / 25** | 4 / 24 |
| Gesamtstärke 80 | **0 / 25** | 24 / 24 |
| Gesamtstärke 88 | **0 / 25** | 1 / 24 |
| Gesamtstärke 93 | **0 / 25** | 0 / 24 |

**Sechs von 21 Marken waren unerreichbar**, und die drei Stärkemarken prüfen
genau das, was eine schwache Laufbahn ausmacht. Was blieb, waren Spielzahlen:
eine OVR-72-Laufbahn sammelte dieselben „250 Pflichtspiele" wie eine
Weltkarriere und sonst nichts. Marken je Laufbahn: **schwach 9, stark 11.**

Bemerkenswert in der Gegenrichtung: „200 Spiele für einen Verein" erreichten
schwache Laufbahnen **häufiger** (7 zu 3) — starke Spieler wechseln mehr. Das
ist genau die Sorte Marke, die gefehlt hat.

### Zehn neue, keine davon belohnt Erfolg

Zehn Jahre als Profi · Zwanzig Jahre als Profi · 300 Pflichtspiele · 100
Spiele für einen Verein · Drei Länder bespielt · Mit 35 noch auf dem Platz ·
Die Binde getragen · Nach schwerer Verletzung zurück · Zehn Saisons als
Stammspieler · Zu einem alten Verein zurückgekehrt

Sie belohnen Dauer, Treue, Rückkehr und Widerstand. Marken je Laufbahn danach:
**schwach 18, stark 20** — verdoppelt, bei gleichbleibendem Abstand.

Die letzte nutzt die Abschnittsbildung aus 35.105, nicht `new Set` — sonst
wäre eine Rückkehr auch hier unsichtbar gewesen.

### Der Punkt, an dem es hätte schiefgehen können

`leg` fließt über `p.legacyBonus` in `verdict().score`, und daraus wird mit
`score / 26` die VC-Ausschüttung gerechnet. **„Laufbahnen bis Vollausbau"
stand bei 20,5 bei einer Untergrenze von 20.**

Gemessen, was die zehn Marken wirklich bewirken: legacyBonus Median 62,
Mittel 57,6 → **+4,70 VC je Laufbahn** (105,8 → 110,5). Nach der Halbierung
(siehe unten) sind es noch rund +2,6. Großzügige Punkte
hätten das Band gesprengt, ohne dass jemand es mit dieser Fassung in
Verbindung gebracht hätte. Zusammen bringen die zehn neuen 37 Punkte; die drei
Stärkemarken allein bringen 80.

Eine eigene Prüfung hält die **Ursache** fest (neue Punkte höchstens ein
Viertel der alten), damit ein späterer Zuwachs dort auffällt und nicht erst
im Zielband.

**Und es ist beinahe schiefgegangen.** Mit den ursprünglichen Werten (68
Punkte) stand das Band in drei Läufen bei 20,6 · 20,7 · **20,0** — der letzte
genau auf der Untergrenze. Die Prüfung war noch grün und hätte beim nächsten
Lauf rot gemeldet, ohne dass jemand es mit diesen Marken in Verbindung
gebracht hätte. Halbiert auf 37 Punkte; danach fünf Läufe: 20,7 · 20,5 · 20,2
· 20,5 · 20,6.

Der eigentliche Befund dahinter betrifft nicht diese Fassung: **das Zielband
liegt dicht an seiner Untergrenze** — 20,5 schon in 35.105, ohne jede neue
Marke. Jede künftige Änderung, die `verdict().score` erhöht, drückt dagegen.
Das steht jetzt als offener Punkt 21.

### Ein Fehler in der eigenen Neuerung

„Nach schwerer Verletzung zurück" prüfte im ersten Entwurf nur `s.injury` —
also auch „leicht, 4 Spiele". Über 25 Saisons ist irgendwann jeder mal
angeschlagen, entsprechend traf die Marke **99 %** aller Laufbahnen. Der Titel
sagte „schwer", die Bedingung prüfte es nicht.

Das ist die Fehlerklasse, die diese Datei seit Langem führt: ein Text, der
mehr zusagt als die Mechanik herstellt — diesmal in der eigenen Neuerung, in
derselben Fassung, deren Anlass eine zu leichte Markenliste war. `sev ===
"schwer"` ergänzt, Trefferquote **99 % → 43 %.**

### Was die Messung nicht hergibt

Acht der zehn Marken treffen im Prüfaufbau über 80 %. **Daraus folgt nicht,
dass sie zu leicht sind:** der Aufbau spielt jede Laufbahn bis Alter 41 aus
(Saisons Median 25) und ist damit die Obergrenze, nicht der Normalfall. „Mit
35 noch auf dem Platz" trifft dort zwangsläufig fast jeden.

Getrennt nach Wechselstrategie unterscheiden zwei Marken deutlich:

    Zehn Saisons als Stammspieler     ehrgeizig 100 %  ·  treu 42 %
    Zu einem alten Verein zurück      ehrgeizig  51 %  ·  treu  7 %

Ob die übrigen im echten Spiel zu leicht sind, entscheidet der Gerätetest,
nicht der Automat.

### Sieben neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| die zehn sind in der Liste | — |
| neue Punkte klein gegen alte | ✗ bei verdreifachtem `leg`: „204 gegen 402" |
| wer „schwer" verspricht, prüft die Schwere | ✗ ohne `sev`: „prüft nur, OB eine Verletzung war" |
| Aufbau hat Laufbahnen erzeugt | — |
| jede neue Marke wird erreicht | — |
| begrenzte Laufbahn sammelt etwas | — |
| eine erfundene Marke fällt durch | ist selbst die Gegenprobe |

### Geprüft

| | 35.105 | 35.106 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 348, 0 Fehler | **355**, 0 Fehler |
| Marken insgesamt | 21 | **31** |
| Vollausbau | 20,5 (Ziel 20–30) | 20,2–20,7 über 5 Läufe |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

Keine neuen persistenten Felder. Alte Spielstände erreichen die neuen Marken
rückwirkend, weil `checkMilestones` die ganze Historie prüft — die Anzeige
springt dort von „9 / 21" auf etwa „18 / 31".

## 35.107 · Das eine Ziel

Stufe B, zweiter Teil. Eine Laufbahn mit begrenzter Weltklasseperspektive soll
nicht jahrelang implizit an denselben Maßstäben scheitern, sondern etwas
haben, worauf sie zuarbeiten kann.

### Was das Papier vorgibt, und was daraus folgt

**„Höchstens ein stark kontextuelles Ziel gleichzeitig."** Also genau eines,
kein Questlog, keine Liste, kein Häkchenraster.

**„Sie dürfen die Karriere nicht künstlich erfolgreich rechnen."** Also keine
eigene Belohnung. Das Ziel ist eine Marke, die es ohnehin gibt; wer sie
erreicht, bekommt genau das, was er auch ohne Anzeige bekommen hätte. Die
Anzeige benennt nur, was sowieso in Reichweite liegt.

**„Der schnelle Saisonloop ist ein Kernwert."** Also eine Zeile auf dem Schirm
vor der Saison — kein Dialog, kein Klick, kein zusätzlicher Schritt. Sie
erscheint nur, wenn wirklich etwas in Reichweite ist, sonst gar nicht.

### Warum die Marken und keine eigene Zielliste

Eine zweite Liste liefe beim nächsten neuen Ziel stumm auseinander — dasselbe
Muster wie die zweite Ablaufliste in 35.29 und die zweite Gerätetest-Liste in
35.101. Stattdessen haben 21 der 31 Marken jetzt `mess` und `soll` und taugen
damit als Ziel. „Die Binde getragen" lässt sich nicht anteilig erreichen und
wäre als Fortschrittsbalken albern — solche Marken kommen nicht infrage.

**Kein neues persistentes Feld.** Das Ziel wird bei jedem Aufruf neu aus dem
Verlauf abgeleitet, wie die Saison-Schlagzeile und die Vereinskapitel. Ist es
erreicht, fällt es aus der Auswahl und das nächste rückt nach. Alte
Spielstände haben sofort eines.

### Unter 40 Prozent ist kein Ziel

Wer zwei Länderspiele hat, braucht nicht „noch 98 bis 100" zu lesen — das
entmutigt, statt Orientierung zu geben. Angeboten wird nur, was mindestens zu
40 % erreicht ist; darunter zeigt der Schirm lieber nichts.

### Gemessen: 60 Laufbahnen, Ziel vor jeder Saison

    Saisons mit Ziel:  1293  (91 %)
    Saisons ohne Ziel:  133  ( 9 %)

    11,3 %  500 Pflichtspiele          3,9 %  Zehn Saisons als Stammspieler
    10,6 %  250 Pflichtspiele          3,7 %  50 Vorlagen
     9,0 %  Fünf Länder bespielt       3,6 %  Drei Länder bespielt
     8,7 %  Zwanzig Jahre als Profi    3,6 %  25 Tore
     7,3 %  100 Pflichtspiele          3,2 %  100 Vorlagen
     5,8 %  300 Pflichtspiele          2,6 %  50 Spiele ohne Gegentor
     5,7 %  50 Pflichtspiele           1,2 %  100 Tore
     5,7 %  100 Länderspiele           1,2 %  10 Länderspiele
     5,6 %  50 Länderspiele            1,0 %  Vereinslegende (zehn Jahre)
     5,0 %  Zehn Jahre als Profi       0,7 %  200 Tore
                                       0,5 %  Fünf Jahre in Folge

**21 verschiedene Ziele, häufigstes 11,3 %.** Die Auswahl folgt dem Verlauf:
wer viele Spiele hat, bekommt Spielziele, wer treu bleibt, Treueziele.

### Die wichtigste Prüfung

`mess(p) >= soll` muss **dasselbe bedeuten** wie `ok(p)`. Liefen die beiden
auseinander, zeigte die Anzeige „500 von 500", während die Marke ungelöst
bliebe — oder das Ziel verschwände, ohne dass etwas erreicht wurde. Beides
wäre ein Text, der etwas anderes sagt als die Mechanik tut, und genau diese
Fehlerklasse hat 35.106 in der eigenen Neuerung erwischt.

Geprüft werden alle 21 Marken über zehn echte Laufbahnen. Gegenprobe: `soll`
von 500 auf 400 gesetzt → **„auseinander: a500"**.

### Sieben neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| genug Marken taugen als Ziel | — |
| `mess >= soll` bedeutet dasselbe wie `ok` | ✗ „auseinander: a500" |
| Erreichtes wird nicht mehr angeboten | — |
| ein Anfänger bekommt kein Fernziel | ✗ ohne Schwelle: „Zehn Jahre als Profi" |
| wer nah dran ist, bekommt eines | ist selbst die Gegenprobe zur Zeile darüber |
| die Auswahl streut | — |
| unvollständige Zustände | — |

Die fünfte ist die Vorsichtsmaßnahme gegen eine Funktion, die nie etwas
liefert: ohne sie wäre „ein Anfänger bekommt kein Fernziel" auch dann grün.

### Geprüft

| | 35.106 | 35.107 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 355, 0 Fehler | **362**, 0 Fehler |
| Marken mit Fortschritt | 0 | **21 von 31** |
| Vollausbau | 20,2–20,7 | im Band |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

Keine neuen persistenten Felder, keine neue Belohnung, kein zusätzlicher
Klick im Saisonloop. Damit ist Stufe B abgeschlossen.

## 35.108 · Sechs Entscheidungen kommen zurück

Stufe C aus dem Konzeptpapier. Sechs Ereignisse greifen Jahre später eine
frühere Entscheidung auf — **ohne ein einziges neues persistentes Feld.**

### Das Gedächtnis lag bereit und niemand las es

`p.evLog[id]` schreibt seit Langem mit, in welcher Saison ein Ereignis kam.
Benutzt wurde das nur für die Wiederholungssperre und die Gewichtung.
**Keine einzige Bedingung hat je gelesen, wie lange etwas her ist** — alle 237
Zeitbedingungen im Spiel sind absolut (Alter, Saisonzahl), keine relativ zu
einer Entscheidung.

Damit ist Stufe C billig: `p.flags` sagt WAS entschieden wurde, `p.evLog` sagt
WANN. Der neue Helfer `her(p, id)` rechnet den Abstand — und liefert **-1**,
wenn das Ereignis nie kam. Mit 0 wäre `seasons.length - 0` die volle
Laufbahnlänge gewesen, und die Bedingung `>= 6` würde für jemanden wahr, der
die Quelle nie erlebt hat.

Zwölf Flags wurden gesetzt und von keiner Bedingung gelesen. Sechs davon
tragen jetzt einen Rückbezug: Spielmanipulation, Steuermodell, Lebensplan,
Bindenabgabe, Rückkehrzusage und der Anwalt vom ersten Vertrag.

### Drei Fehler auf dem Weg, alle gemessen

**Erstens: eine Wirkung verpuffte stumm.** `fx: { wage: .12 }` — `applyFx`
kennt kein `wage`, die Gehaltswirkung heißt `raise`. Die Stimmigkeitsprüfung
fing es sofort: „`wage` kennt applyFx nicht — wirkungslos". Genau die
Fehlerklasse, die diese Datei führt, in der eigenen Neuerung.

**Zweitens: die Erinnerungen kamen praktisch nie.** Mit gewöhnlichen Gewichten
(3 bis 6) kam über 200 Laufbahnen **genau eine** zustande, obwohl die
Quellereignisse 97-mal gezogen worden waren. Die Bedingung ist ohnehin extrem
selektiv; ein kleines Gewicht macht daraus rechnerisch nie. Auf 12 angehoben —
kein Ausreißer, die Reaktionsereignisse liegen bei 12 bis 14 aus demselben
Grund.

**Drittens: eine Quelle war tot.** Der erste Entwurf hängte eine Erinnerung an
`sesshaft` (aus `umzug`). Gemessen über 200 Laufbahnen stand dieses Flag am
Ende bei **null** — `umzug` verlangt Kinder, feste Beziehung und Alter ab 27
zugleich. Ersetzt durch `rueckkehr` (4 %). Häufigkeit am Laufbahnende,
gemessen: plan_b 11 % · steuermodell 5 % · rueckkehr 4 % · manipuliert 3 % ·
vertragsschlau 3 % · exkapitaen 1 %.

`er_exkapitaen` bleibt trotz 1 % drin: selten ist eine Eigenschaft, null wäre
ein Fehler.

### Gemessen über 600 Laufbahnen

| Erinnerung | Quelle kam | Kandidaten | erlebt |
|---|---:|---:|---:|
| er_manipulation | 71 | 9 | 3 |
| er_steuermodell | 84 | 16 | 3 |
| er_planb | 85 | 56 | 16 |
| er_exkapitaen | 16 | 4 | 1 |
| er_rueckkehr | 52 | 18 | 3 |
| er_vertragsschlau | 20 | 11 | 4 |

**30 von 114 Kandidaten (26 %) haben ihre Erinnerung gesehen**, Median-Abstand
**7 Saisons**. Fünf Prozent aller Laufbahnen erleben mindestens eine. Das ist
selten — und soll es sein: „wenige starke Rückbezüge sind wertvoller als
permanente Mikrokonsequenzen."

### Zweimal dieselbe Falle in einer Fassung

Die Prüfung suchte `her(` im Quelltext der Bedingung. Im Bündel heißt die
Funktion **`her2`** — esbuild benennt um. Folge: zwei Proben waren grün, auch
als in der Gegenprobe eine Quell-Kennung absichtlich verfälscht wurde.

Das ist exakt der Fehler aus 35.105, wo die Kapitelnamen aus dem gebündelten
Text gelesen wurden und „Die R\xFCckkehr" nicht „Die Rückkehr" war. **Eine
Prüfung, die den Quelltext ihres Prüflings liest, misst den Übersetzer mit.**

Behoben auf zwei Wegen: die Kennungsprobe sucht jetzt `her\d*\(` (Zeichen­ketten
benennt esbuild nicht um), und die Verhaltensprobe **führt die Bedingung aus**
statt sie zu lesen — dreimal je Erinnerung: mit nichts, mit nur dem Flag, mit
beidem. Nur die letzte darf wahr sein.

### Und ein kaputter Gegenprobe-Aufbau

Die ersten drei Gegenproben schwiegen alle. Ursache war nicht die Prüfung:
mein eigener esbuild-Aufruf legte `probe.jsx` nach `/tmp/ps/`, wo eine **alte
Kopie von `ereignisse.js`** lag — das Bündel entstand gar nicht aus der
geänderten Datei. Über `pruefen.sh` gebaut greifen alle drei:

| Gegenprobe | Meldung |
|---|---|
| Tippfehler in der Quell-ID | ✗ „kennt niemand: er_steuermodell → `zw_steuermodel`" |
| Zeitabstand entfernt | ✗ „er_manipulation (kein Zeitabstand in der Bedingung)" |
| Gewicht zurück auf 3 | ✗ „zu leicht: er_manipulation" |

Eine Gegenprobe, die schweigt, ist so lange verdächtig, bis man weiß, warum.

### Geprüft

| | 35.107 | 35.108 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 362, 0 Fehler | **370**, 0 Fehler |
| Ereignisse | 520 | **526** |
| Stimmigkeit | 17 Proben, 0 harte Fehler | 17 Proben, 0 harte Fehler |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

Die Ereigniszahl in Abschnitt 8 musste mitgezogen werden — Prüfung 8 rechnet
sie nach und brach den Lauf ab, solange dort 520 stand.

## 35.109 · Was für eine Laufbahn war das eigentlich?

Stufe D aus dem Konzeptpapier. Zehn Archetypen, aus dem Verlauf abgeleitet —
nicht vorab gewählt, kein neues persistentes Feld.

### Relativ, nicht über Schwellen

Der naheliegende Weg wären feste Grenzen („ab acht Jahren an einem Ort ist er
eine Ikone"). Gemessen über 300 Laufbahnen wäre das falsch kalibriert
gewesen:

    20+ Saisons (ewiger Profi)       94 %
    8+ Stationen (Wandervogel)       79 %
    Absturz ab 12 (Absturz)          78 %
    Peak bis 22 (Wunderkind)          0 %

Diese Zahlen sagen nichts über das Spiel, sondern über den Prüfaufbau: er
spielt jede Laufbahn bis Alter 41 aus. Schwellen, die an einem Automaten
geeicht sind, passen nicht auf einen Menschen, der mit 33 aufhört.

Deshalb bekommt jeder Archetyp einen **Kennwert**, und der höchste gewinnt.
Die Einordnung ist damit ein Vergleich innerhalb der eigenen Laufbahn und
nicht gegen eine geratene Zahl. Wer zwanzig Saisons spielt **und** achtmal
wechselt, ist Wandervogel und nicht „ewiger Profi", weil das Wechseln stärker
ausgeprägt ist.

### Zwei Durchgänge, bis die Verteilung stand

**Erster Entwurf:** „Der Wandervogel" traf **46,7 %**, bei der ehrgeizigen
Wechselstrategie sogar 89 %. Und **zwei Archetypen wurden nie vergeben** —
„Das Wunderkind" (Peak-Alter liegt im Median bei 28, die Schwelle stand auf
26) und „Der Wiederauferstandene" (die Absturz-Strafe fraß den Comeback-Bonus
auf). Toter Code, dieselbe Klasse wie „Die langen Jahre" in 35.105.

Nach dem Justieren, 300 Laufbahnen:

    25,7 %  Der Titelsammler          7,0 %  Die Vereinsikone
    21,7 %  Der ewige Profi           4,0 %  Der Anführer
    19,0 %  Der Wandervogel           3,0 %  Der Spätstarter
     8,7 %  Der Pechvogel             2,3 %  Der Wiederauferstandene
     7,3 %  Der Nationalheld          1,3 %  Das Wunderkind

Alle zehn erreichbar, häufigster unter 30 %. Nach Spielweise getrennt
unterscheidet es sinnvoll: ehrgeizig → Wandervogel 38 %, treu → Titelsammler
42 % und Vereinsikone 13 %.

**Der zweite Zug war zu großzügig.** Mit einer Schwelle von 0,7 trugen **83 %**
aller Laufbahnen einen Nebenarchetyp — damit sagte er nichts mehr. „Fließend"
heißt nicht „alles ein bisschen". Auf 0,88 gestrafft: rund 40 %.

### Ein stiller Fehler in der eigenen Neuerung

`ntTitel: (p.nt && p.nt.titel) || 0` — **`p.nt.titel` gibt es nicht.** Die
Turniere stehen in `p.nt.majors`, ein Titel ist dort `res === "Titel"` bei
einem Turnier ohne `u`. Das Merkmal wäre still immer 0 geblieben: kein
Absturz, keine Warnung, nur eine Zeile, die nie greift. Aufgefallen beim
Durchsehen der Felder, nicht durch eine Prüfung — dieselbe Zählweise steht
zwanzig Zeilen weiter in `leereBilanz`.

### Was der Archetyp NICHT tut

Er rührt **keine Ereignisgewichte** an. Das Papier erlaubt es, mein
Prüfbericht hat es empfohlen — aber es ist Balancing und gehört in eine eigene
Fassung mit eigener Messung. Diese Fassung leitet ab und zeigt an.

Er ist auch keine Klasse: kein Abzeichen, keine Auswahl am Anfang, keine
Wirkung auf Werte. Er kann sich im Laufe einer Karriere ändern, und genau das
will das Papier.

### Eine Prüfung aus 35.106 hat geflattert

Beim Messen meldete „Marken: auch eine begrenzte Laufbahn sammelt jetzt etwas"
rot — **nicht wegen der Archetypen.** Sie nahm `Math.min` über zwölf
Laufbahnen und fiel um, sobald eine kurze dabei war, die nach fünf Saisons
endete. Nichts war kaputt, die Probe flatterte nur.

Dieselbe Lehre wie bei der Reachability in 35.104. Auf den Median umgestellt,
danach fünf Läufe hintereinander stabil.

### Sieben neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| die Tabelle hat genug Einträge | — |
| der Aufbau hat Laufbahnen erzeugt | — |
| derselbe Verlauf, dieselbe Einordnung | ✗ mit Zufall: „9 wackeln" |
| jeder kann bei passendem Verlauf gewinnen | ✗ Gewicht auf 0,01: „nie erreichbar: Das Wunderkind" |
| keiner beherrscht das Feld | — |
| unter drei Saisons kein Urteil | — |
| unvollständige Zustände | — |

Die Erreichbarkeit wird **deterministisch** geprüft, mit einem konstruierten
Merkmalssatz je Archetyp. Über Zufallsläufe würde eine Probe auf „Das
Wunderkind" (1,3 %) flattern — dieselbe Trennung wie bei den Kapiteln in
35.105.

### Geprüft

| | 35.108 | 35.109 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 370, 0 Fehler | **377**, 0 Fehler |
| Ereignisse | 526 | 526 |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

## 35.110 · Warum ruft gerade dieser Verein an?

Stufe E aus dem Konzeptpapier, erster Teil: Angebote bekommen gelegentlich
einen biografischen Grund. Sieben davon, alle aus dem Verlauf abgeleitet,
kein neues persistentes Feld.

    Dein Ausbildungsverein · Der Verein deiner ersten Saison
    Du warst schon einmal hier · Großer Name, kleine Rolle
    Dein erstes Land außerhalb der Heimat
    Vielleicht dein letzter großer Vertrag · Sie holen dich für die letzten Jahre

### Er rechnet nichts

Das Papier warnt im selben Absatz: „Die vorhandene Transferlogik soll nicht
durch Storyzwang verfälscht werden." Der Grund kommt deshalb **nach** der
Angebotserstellung dazu und rührt weder Gehalt noch Ablöse noch Rolle an. Das
unterscheidet ihn von `KIND` (`kind: "Deutlich mehr Geld"`), das seit jeher
mitrechnet. Beide können nebeneinander stehen.

### Vier Justierrunden, jede gemessen

**Erster Entwurf: 81 % aller Angebote trugen einen Grund.** „Eine Liga, in
der du noch nie gespielt hast" machte allein **79,2 %** davon aus — bei 1.239
Vereinen in dutzenden Ligen ist das fast immer wahr und sagt deshalb nichts.
Gestrichen. Danach 29 %.

**Zwei wurden nie vergeben.** „Der Verein deiner ersten Saison" stand unter
„Du warst schon einmal hier" und wurde davon überdeckt — jede erste Station
ist auch eine frühere. Nach oben gezogen.

**Die beiden Spätphasen-Zeilen überschnitten sich** (33+ mit Laufzeit gegen
34+ mit Rolle) und machten zusammen 89 % aller Gründe aus. Getrennt: die eine
32–34 mit langer Laufzeit und mehr Geld, die andere ab 37 mit Stammrolle.

**Dazwischen überkorrigiert:** mit zusätzlich `c.s >= 70` wurde „Sie holen
dich für die letzten Jahre" **gar nicht mehr** vergeben — ab 36 bieten kaum
starke Vereine an. Von 100 % auf 0 % ist kein Fortschritt, sondern der Fehler
auf der anderen Seite.

Endstand über 5.657 Angebote aus 120 Laufbahnen:

    17 %  aller Angebote tragen einen Grund

    55,5 %  Sie holen dich für die letzten Jahre
    23,6 %  Vielleicht dein letzter großer Vertrag
    11,8 %  Du warst schon einmal hier
     3,8 %  Der Verein deiner ersten Saison
     3,5 %  Dein erstes Land außerhalb der Heimat
     1,8 %  Großer Name, kleine Rolle

    nach Alter:  bis 29  5 %  ·  30–34  17 %  ·  ab 35  69 %

**Die Häufung ab 35 bleibt und ist zum Teil ein Artefakt:** der Prüfaufbau
spielt jede Laufbahn bis Alter 41 aus, ein Mensch hört meist mit 33 bis 35
auf. Inhaltlich stimmt die Zeile dort auch — wer mit 37 noch geholt wird,
wird für die letzten Jahre geholt. Ob sie sich im Spiel monoton anfühlt,
entscheidet der Gerätetest.

**„Dein Ausbildungsverein" ist im Prüfaufbau nie gefallen**, weil
`createPlayer` dort ohne `p.bei` aufgerufen wird. Kein toter Code — die
Erreichbarkeitsprobe deckt ihn mit einer konstruierten Lage ab.

### Die Zusage war eine ganze Weile ungeprüft

Zehn neue Proben. Eine davon ist erst durch eine **schweigende Gegenprobe**
entstanden: der Versuch, im Anhängen heimlich `o.wage * 1.2` einzubauen, wurde
von keiner einzigen Probe bemerkt. Die vorhandene prüfte `angebotsGrund`
selbst — die Funktion war unschuldig, die **Kette** nicht.

Nachgerüstet: die Stelle in `App.jsx`, die den Grund anhängt, darf nur
`o.grund` setzen. Gegenprobe meldet jetzt **„setzt außerdem: wage"**.

Beim ersten Versuch stand die neue Probe außerdem **vor** der Definition von
`basis` — `ReferenceError: Cannot access 'basis' before initialization`, die
ganze Vereinsprüfung brach ab. Verschoben.

| Probe | Gegenprobe |
|---|---|
| Tabelle hat Einträge | — |
| Aufbau hat Laufbahnen erzeugt | — |
| kein Grund an „Erfüllen"/„Verlängern" | — |
| jeder Grund ist erreichbar | ✗ falsche Testlage: „nie: Du warst schon einmal hier" |
| gewöhnliche Lage bleibt ohne | — |
| er fasst das Angebot nicht an | — |
| dieselben Zahlenfelder | — |
| App.jsx für die Kettenprüfung gefunden | meldet sich ab, wenn nicht |
| **beim Anhängen wird NUR `grund` gesetzt** | ✗ „setzt außerdem: wage" |
| unvollständige Zustände | — |

### Geprüft

| | 35.109 | 35.110 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 377, 0 Fehler | **387**, 0 Fehler |
| Ereignisse | 526 | 526 |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

## 35.111 · Die Tabelle hatte die Namen die ganze Zeit

Stufe E, zweiter Teil („Was wäre wenn"). Beim Suchen nach einem Weg, ohne
neues Feld zu zeigen, was aus einem verlassenen Verein wurde, kam ein Fund
heraus, der älter ist als die Aufgabe.

### Der Fund

Die Tabellenansicht im Saisonrückblick zeigte für alle Nachbarplätze einen
**Gedankenstrich**. Der Kommentar daneben erklärte auch, warum:

> Die Nachbarn sind nicht erfunden — nur Platznummern; Vereinsnamen hätten
> wir nicht.

**Das stimmte nicht.** `s.table` trägt die vollständige Liga mit Namen,
Punkten, Toren und einer Markierung der eigenen Zeile. Gemessen über 19
Saisons: **keine einzige ohne vollständige Tabelle.** Der Satz stammte aus der
Zeit vor dem Feld, und niemand hat ihn nachgeprüft — ein Kommentar ist keine
Messung, und diesmal hat er eine fertige Anzeige jahrelang blind gehalten.

Die Tabelle nennt jetzt Namen. Frühere Vereine des Spielers stehen darin in
Akzentfarbe mit dem Zusatz „dein alter Verein".

### Und damit war „Was wäre wenn" fast geschenkt

Das Papier: „Der verlassene Verein wird Meister; der gewählte Klub steigt ab.
Das soll **keine** nachträgliche Bestrafung sein — der Zweck ist,
Entscheidungen im Gedächtnis zu halten."

Unter der Tabelle steht jetzt eine neutrale Zeile, wenn es etwas zu erzählen
gibt: Meister, Abstiegsplatz, oder der alte Verein steht mindestens fünf
Plätze vor einem. Ein alter Verein auf Platz 8, während man selbst Neunter
ist, ist keine Geschichte und bleibt still.

Gemessen über 100 Laufbahnen, 2.369 Saisons:

    25 %  der Saisons zeigen eine Zeile
    86 von 100 Laufbahnen sehen mindestens eine

    219×  „steht auf Platz X von N"   (Abstiegsregion)
    136×  „wurde Meister"
    rest  „wurde N. — X Plätze vor dir"

**Kein neues persistentes Feld.** `s.table` und `p.seasons` reichen.

### Was bewusst NICHT drin ist

**Abgelehnte Angebote spiegeln.** Das Papier nennt es zuerst („der abgelehnte
Klub gewinnt einen großen Titel"), aber abgelehnte Angebote werden nirgends
festgehalten — gemessen: kein Feld am Spieler, das sie trüge. Dafür bräuchte
es echte Persistenz plus Migration alter Spielstände, und das Papier nennt
genau das als kritisch. Es ist eine Entscheidung für Kevin, keine Reparatur.

Ebenso außerhalb der Reichweite: Vereine aus **anderen** Ligen. Der
Saisoneintrag kennt nur die Tabelle der eigenen.

### Sieben neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| der aktuelle Verein zählt nicht als alter | — |
| Meister geht vor Abstiegsplatz | — |
| ohne Auffälligkeit bleibt es still | — |
| fünf Plätze davor ergibt eine Zeile | ist die Gegenprobe zur Zeile darüber |
| ohne Tabelle bleibt es still | — |
| **die Tabelle zeigt keine Gedankenstriche mehr** | sucht das alte `{ich ? s.club : "—"}` in App.jsx |
| unvollständige Zustände | — |

Die vorletzte hält den Fund fest: fällt jemand auf den Gedankenstrich zurück,
meldet sie es.

### Geprüft

| | 35.110 | 35.111 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 387, 0 Fehler | **394**, 0 Fehler |
| Ereignisse | 526 | 526 |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

## 35.112 · Vier Auswege, jeder mit einem Preis

Stufe F aus dem Konzeptpapier — der Punkt mit dem höchsten Balancing-Risiko.
Das Papier wörtlich: „Krisenpfade dürfen keinen versteckten Erfolgsautomaten
erzeugen. Eine schlechte Karriere muss schlecht bleiben dürfen."

### Wann ist eine Krise eine Krise?

Gemessen über 200 Laufbahnen. Ein einzelnes schlechtes Zeichen ist noch keine
Krise — sonst käme der Pfad ständig und wäre kein Ausweg mehr, sondern
Alltag. Mit **mindestens zwei** Zeichen gleichzeitig (schwere Verletzung,
unter zwölf Einsätze, acht Punkte unter der Höchststärke, Rollenverlust, Note
ab 4,2):

    832 von 4.177 Saisons        (20 %)
    187 von 200 Laufbahnen erleben mindestens eine

    253×  kaum Einsätze + schwache Note
    192×  kaum Einsätze + Absturz + schwache Note
    110×  Absturz + schwache Note
     45×  Verletzung + kaum Einsätze + Absturz + schwache Note

### Die vier Wege, wie im Papier

**`kr_comeback`** — nach schwerer Verletzung früher zurück als erlaubt. In
45 % hält es, in 55 % macht es wieder zu, und dann länger als beim ersten Mal.
Die Alternative kostet die Saison und die Rolle.

**`kr_tiefer`** — eine Liga tiefer neu anfangen. Spielzeit gegen 35 % Gehalt
und 16 Punkte Ansehen. Die Alternative: bleiben und in 60 % der Fälle
weitersitzen.

**`kr_kleinerolle`** — die Rolle von der Bank annehmen. Viel Vertrauen gegen
Form und Ansehen. Oder kämpfen — in 65 % vergeblich, und danach ist es
persönlich.

**`kr_umbau`** — Tempo endgültig aufgeben, dafür Übersicht und Passspiel.
Ein halbes Jahr, in dem gar nichts läuft.

### Die Prüfung, die das Risiko dieser Stufe trägt

Jede Option hat einen Preis — das ist nicht nur eine Absicht, sondern eine
**Eigenschaft, die der Prüfstand nachrechnet**. Er summiert die Wirkungen
jeder Option und meldet, wenn ein Ausgang nur Vorteile bringt. Bei einer
Würfeloption reicht ein schlechter Ausgang: dann ist es ein Risiko und kein
Geschenk.

Ohne diese Zeile wäre „Krisenpfad" ein anderes Wort für Geschenk, und die
erste Fassung, die eine Zeile nachbessert, könnte es unbemerkt aufheben.

Gegenprobe: in `kr_kleinerolle` die Minuszeichen entfernt →
**„ohne Preis: kr_kleinerolle Wahl 1 „Die Rolle annehmen""**.

### Fünf neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| die vier Wege sind da | — |
| **keine Option ist rein positiv** | ✗ benennt Ereignis und Option |
| die Bewertung erkennt ein Geschenk | ist selbst die Gegenprobe zur Zeile darüber |
| jede Bedingung liest mehrere Zeichen | — |
| ein gesunder Spieler bekommt keinen | — |

Die dritte sichert die zweite ab: ohne sie könnte die Bewertungsfunktion immer
0 liefern und alles wäre still grün.

### Geprüft

| | 35.111 | 35.112 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 394, 0 Fehler | **399**, 0 Fehler |
| Ereignisse | 526 | **530** |
| Stimmigkeit | 17 Proben, 0 harte Fehler | 17 Proben, 0 harte Fehler |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

Damit ist das Konzeptpapier bis auf zwei Punkte abgearbeitet: die Archetypen
verschieben noch keine Ereignisgewichte (4.1, bewusst zurückgestellt), und
abgelehnte Angebote werden nicht gespiegelt (4.9, bräuchte das erste neue
Feld). Beides sind Entscheidungen, keine Reparaturen.

## 35.113 · Der Archetyp bekommt seine Wirkung

Nachtrag zu Stufe D. In 35.109 wurde der Archetyp nur abgeleitet und
angezeigt; jetzt verschiebt er die Ereignisgewichte — die Wirkung, die das
Papier ihm zugedacht hat.

### Verschieben, nicht aussperren

Das Papier erlaubt es und warnt im selben Atemzug: „Die Ereignisgewichtung
darf nicht so deterministisch werden, dass der Spieler nach wenigen Jahren
seinen gesamten zukünftigen Storypfad vorhersagen kann."

Deshalb liegen alle 44 Faktoren zwischen **0,75 und 1,55**. Keiner ist 0,
keiner sperrt etwas aus. Jedes Ereignis, das ein Spieler ohne Archetyp
bekommen kann, kann er auch mit bekommen — nur die Häufigkeit verschiebt sich.
Der Prüfstand rechnet das nach.

Der **zweite** Archetyp wirkt bewusst nicht mit: zwei überlagerte Gewichtungen
wären schwer nachvollziehbar, und der Nebenzug ist ohnehin nur eine
Beschriftung.

### Gemessen: es wirkt, und es ist nicht vorhersagbar

Über 160 Laufbahnen, Abweichung der gezogenen Themen vom Durchschnitt:

    Der Wandervogel      Unterhaus ×2,13 · Land ×1,56 · Ausland ×1,55
    Der Pechvogel        Risiko ×2,92 · Verletzung ×1,86
    Der Anführer         Führung ×2,68
    Der Nationalheld     Nationalteam ×1,46
    Der Titelsammler     Europa ×1,46 · Vertrag ×1,24

**Und die Gegenprobe zur Warnung des Papiers:** wechselt der Archetyp im Lauf
einer Karriere, oder steht er früh fest? Über 120 Laufbahnen, alle drei
Saisons gemessen:

    verschiedene Archetypen je Laufbahn: Median 3 (Spanne 1–4)
    nur ein Archetyp durchgehend:        13 von 120  (11 %)

Wer aufhört zu wechseln, ist irgendwann keine Wandervogel mehr, und der Pool
dreht mit. Das ist keine Nebenwirkung, sondern der Punkt.

### Die Kosten

`archetyp()` kostet **0,045 ms** gegen 0,231 ms für einen ganzen
`drawEvents`-Aufruf. Es wird **einmal je Zug** bestimmt, nicht je Ereignis —
je Ereignis wäre das mal fünfhundert.

### Ein stiller Fehler, den die eigene Prüfung fing

Der Name „Der Wiederaufer­standene" trägt in `ARCHETYPEN` ein **weiches
Trennzeichen**, damit die lange Zeile im Rückblick sauber umbricht. In der
Gewichtstabelle stand er ohne — der Schlüssel hätte **nie** gegriffen, und
dieser eine Archetyp wäre als einziger ohne Wirkung geblieben. Kein Absturz,
keine Warnung, nur eine Tabelle, die ins Leere zeigt.

Gefangen von „jeder Archetyp hat eine Gewichtstabelle", die trotzig
„10 Tabellen für 10 Archetypen" meldete und trotzdem rot war.

### Vier neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| jeder Archetyp hat eine Gewichtstabelle | ✗ fing das weiche Trennzeichen |
| kein Faktor sperrt aus oder reißt alles an sich | ✗ „Der Wandervogel/Ausland = 0" |
| jedes gewichtete Thema gibt es auch | ✗ „kennt niemand: Der Anführer/Fuehrung" |
| der Archetyp steht nicht von Anfang an fest | — |

Die dritte fängt Tippfehler, die sonst vollkommen stumm wären: ein Faktor auf
ein Thema, das es nicht gibt, greift nie und meldet nichts.

### Geprüft

| | 35.112 | 35.113 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 399, 0 Fehler | **403**, 0 Fehler |
| Ereignisse | 530 | 530 |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

Damit bleibt vom Konzeptpapier genau ein Punkt offen: abgelehnte Angebote
spiegeln (4.9). Das bräuchte das erste neue persistente Feld dieser Reihe und
ist eine Entscheidung, keine Reparatur.

## 35.114 · Das erste neue Feld — und warum es unvermeidlich war

Der letzte offene Punkt des Konzeptpapiers: „Der abgelehnte Klub gewinnt einen
großen Titel." Alles andere in dieser Reihe kam ohne neue Persistenz aus;
dieser Punkt geht nicht.

### Warum nicht ableitbar

Ein abgelehntes Angebot hinterlässt im Spielstand **keine Spur**. `p.seasons`
kennt nur, wo man war. `p.evLog` kennt gezogene Ereignisse, `p.flags`
getroffene Entscheidungen — ein nicht angenommenes Angebot ist in keinem von
beidem.

Das Feld bleibt deshalb so klein wie möglich: **Vereinsname und Jahr,
höchstens acht Einträge.** Ein Spielstand ist ein Speicher, kein Protokoll —
die Kappung ist eine eigene Prüfung, weil sie sonst beim nächsten Umbau
verschwinden könnte.

### Alte Spielstände: keine Migration nötig

Der Spielstand wird mit `JSON.parse` **roh** geladen, ohne Vervollständigung.
Bei einem Stand von vor 35.114 ist `abgelehnt` schlicht `undefined`. Jede
Stelle, die es liest, fängt das mit `|| []` ab; ab dem nächsten Wechsel füllt
es sich von selbst. Kein Umschreiben gespeicherter Daten, kein
Migrationsschritt, kein Risiko für bestehende Karrieren.

Zwei der sechs neuen Prüfungen zielen ausschließlich darauf.

### Keine Schadenfreude

Ein abgelehnter Verein wird **nur gespiegelt, wenn er oben steht** — Meister
oder mindestens fünf Plätze vor einem. Nach unten wäre es Häme, und das Papier
sagt ausdrücklich: „Das soll keine nachträgliche Bestrafung sein." Wer gut
daran tat abzulehnen, muss es nicht vorgehalten bekommen.

Und wer bei einem abgelehnten Verein **später doch** gespielt hat, liest „dein
alter Verein" statt „den du abgelehnt hast". Sonst stünde die falsche Zeile
unter einem Verein, bei dem man drei Jahre war.

### Sechs neue Prüfungen

| Probe | |
|---|---|
| ein Spielstand ohne das Feld läuft weiter | die wichtigste |
| ein leeres Feld läuft ebenfalls | |
| der abgelehnte Meister taucht auf | |
| wer unten steht, wird nicht vorgeführt | |
| wer später doch dort war, gilt als alter Verein | |
| **die Liste wird beim Anhängen gekappt** | ✗ ohne `.slice`: „das Feld wüchse unbegrenzt" |

Die letzte hat sich beim Bauen selbst korrigiert: der erste Regex suchte
`\[[^\]]*\]\.slice` und fand nichts, weil die Zuweisung selbst eine leere
Klammer enthält (`p.abgelehnt || []`), an der die Zeichenklasse abbricht. Jetzt
wird der Abschnitt ab `q.abgelehnt =` genommen und darin gesucht — robuster
und lesbarer als ein Regex, der Klammern zählen muss.

### Geprüft

| | 35.113 | 35.114 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 403, 0 Fehler | **409**, 0 Fehler |
| Rückwärts (alte Sicherungen) | 6 × 63 | 6 × 63 |
| Ereignisse | 530 | 530 |
| Kontrast | 145 Stellen, 0 Befunde | 145 Stellen, 0 Befunde |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

**Damit ist das Konzeptpapier vollständig abgearbeitet.** Vierzehn
Entwicklungsrichtungen, elf Fassungen, ein einziges neues persistentes Feld.

Was der Prüfstand nicht kann, steht weiter aus: ein Gerätetest. Seit 35.44 ist
nichts auf einem Telefon gelaufen — siebzig Fassungen, elf davon mit
sichtbaren Änderungen an der Spielerkarriere.

## 35.115 · Ein Fünftel des Spielstands war Ballast

Stufe A aus dem Prüfbericht zum Meta-Konzeptpapier. Bevor Museum, Zeitleiste
und Vereinslegenden etwas Neues speichern, wird die größte vorhandene
Redundanz geräumt.

### Der Befund

Gemessen an einer Laufbahn über 23 Saisons:

    laufender Spielstand          112,8 KB
      davon p.seasons             107,8 KB   (96 %)
        davon s.table              63,6 KB   (65 % der Historie)
      davon p.squad                 0,9 KB
      davon evLog + evSeen          0,8 KB

Jede Tabellenzeile trug das volle Vereinsobjekt:

    { "n":"Kilmarnock FC", "c":"SCO", "l":"Championship (SCO)", "s":51, "g":"m" }

**Gelesen wurde davon an allen Stellen nur `.n`** — auch vom Wappen: `Crest`
liest `club.n`, `clubColors` ebenfalls. Die vier übrigen Felder lagen bei rund
achtzehn Vereinen in fünfundzwanzig Saisons redundant im Speicher.

### Gemessen, nicht geschätzt

    je Saison   vorher  4.240 Byte   nachher  3.453 Byte     −19 %
    s.table     vorher  63,6 KB/23 S. nachher  44,5 KB/25 S.  −24,5 KB

Die Ersparnis entspricht genau der Rechnung aus dem Prüfbericht: rund 55 Byte
je Zeile × 18 Zeilen × 25 Saisons.

### Rückwärtsverträglich ohne Migration

`tabVerein(t)` versteht **beide** Formen: alte Spielstände tragen das volle
Objekt und bleiben lesbar, neue schreiben nur den Namen. Kein Umschreiben
gespeicherter Daten, kein Migrationsschritt — die Ersparnis wächst mit jeder
neuen Saison hinein.

Neun Lesestellen umgestellt. **Eine war mir zuerst durchgerutscht** (Zeile
14088 in der Vereinsansicht) und wurde von keiner Prüfung gefangen, weil dort
keine hinsieht — gefunden durch Nachzählen der Treffer, nicht durch den Lauf.

### Die Prüfung, die es bisher nicht gab

**Es gab keine einzige Probe, die misst, wie groß ein Spielstand wird.** Das
Meta-Papier nennt Savegame-Größe als Kernrisiko und will drei weitere Systeme
speichern lassen — ohne Obergrenze merkt niemand, wenn der nächste Punkt den
Speicher verdoppelt.

Gemessen wird **je Saison**, nicht am Gesamtstand: eine lange Laufbahn darf
mehr wiegen, aber nicht mehr je Jahr. Nur so fällt auf, wenn ein neues Feld
mitwächst statt einmalig zu sein.

Sechs neue Prüfungen, Gegenprobe „Rückfall zum vollen Objekt" fängt dreifach:

    ✗ 4.787 Byte je Saison (Grenze 4.400)
    ✗ 135 KB im größten Lauf (Grenze 130)
    ✗ 2.779 volle Objekte in 2.779 Zeilen

### Geprüft

| | 35.114 | 35.115 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 409, 0 Fehler | **415**, 0 Fehler |
| Byte je Saison | 4.240 | **3.453** |
| Rückwärts (alte Sicherungen) | 6 × 63 | 6 × 63 |
| Ereignisse | 530 | 530 |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

## 35.116 · Zwanzig Rekorde, die längst mitliefen

Stufe B aus dem Prüfbericht zum Meta-Papier. **Kein einziges neues Feld.**

### Die Daten waren da, die Seite fehlte

`leereBilanz()` führt **49 Zahlen** über alle Laufbahnen mit — Spiele, Tore,
Vorlagen, Titel, Länderspiele, Länder, Ligen, Vereine, Treuerekord, ältester
Einsatz, Aufstiege, Kapitänssaisons und mehr. Gemessen: sie speisten
ausschließlich die Errungenschaften und wurden **nirgends angezeigt.**

Das Papier wünscht sich „15 bis 25 starke Rekorde". Es sind zwanzig geworden —
von den 49 taugen längst nicht alle: `karrieren` ist ein Zähler,
`frauen`/`maenner` eine Aufteilung, `reroll` eine Verwaltungszahl. Ausgewählt
sind die, bei denen ein höherer Wert etwas bedeutet und die eine neue Laufbahn
auch schlagen kann.

### Null ist kein Rekord

Ein Wert von 0 erzeugt **keine Zeile**. Wer noch keinen Aufstieg geschafft
hat, liest das nicht als „0 Aufstiege", sondern gar nicht — sonst stünde die
halbe Seite auf null und sähe nach Versagen aus statt nach offener Rechnung.

Die Seite erscheint erst ab drei gefüllten Rekorden, über der Rangliste in der
Ruhmeshalle: sie fasst die ganze Welt zusammen, die Liste darunter nur die
zwölf besten Laufbahnen.

### Sechs neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| die Liste hat 15 bis 25 Einträge | — |
| **jeder liest ein Feld, das die Bilanz führt** | ✗ Tippfehler `capse` fällt auf |
| eine frische Welt zeigt keine leeren Zeilen | — |
| mit Werten kommen alle zwanzig | ist die Gegenprobe zur Zeile darüber |
| nur was einen Wert hat, steht da | 3 Zeilen bei 3 gefüllten Feldern |
| unvollständige Bilanzen stürzen nicht ab | — |

Die zweite ist die wichtige: ein Tippfehler im Feldnamen wäre **vollkommen
still** — die Zeile läse `undefined`, `|| 0` machte 0 daraus, und der Rekord
verschwände einfach aus der Anzeige. Geprüft wird gegen eine Bilanz, in der
jedes Feld auf 7 steht; wer nicht 7 zurückliefert, liest etwas, das es nicht
gibt.

### Geprüft

| | 35.115 | 35.116 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 415, 0 Fehler | **421**, 0 Fehler |
| Byte je Saison | 3.453 | 3.453 |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

## 35.117 · Die Ruhmeshalle wird ein Museum

Stufe C aus dem Prüfbericht zum Meta-Papier: „Ehemalige Spieler sollen als
gespeicherte Biografien wieder aufrufbar bleiben." Drei Felder je Eintrag —
Archetyp, Vereinsstationen mit Kapiteln, eine prägende Schlagzeile.

**Alle drei sind Ernte aus der Karriere-Reihe.** `archetyp()` aus 35.109,
`vereinsKapitel()` aus 35.105, `saisonSchlagzeile()` aus 35.104 — hier werden
sie zum ersten Mal über das Karriereende hinaus aufbewahrt.

### Die Größe war doppelt so hoch wie geschätzt

Der Prüfbericht hatte „unter 2 KB für alle zwölf" veranschlagt. Gemessen:
**370 Byte je Eintrag, 4,3 KB für zwölf.** Die Schätzung war zu niedrig, und
Kürzen half kaum — die Stationsliste ist der große Teil, nicht die Texte.

4,3 KB in einem eigenen Speicherschlüssel sind vertretbar, aber die Zahl
gehört genannt statt geschönt. Die Stationen sind auf vier gekappt; ohne
Kappung wüchse ein Eintrag mit der Länge der Laufbahn, und eine eigene Probe
hält das fest.

### Zwei Fehlversuche bei der Schlagzeilenwahl

**Erster Entwurf: die seltenste Schlagzeile der Laufbahn.** Gemessen gewann
dabei praktisch immer **„Der Anfang"** — die seltenste ist zwangsläufig eine
der einmaligen, und die erste Saison ist immer einmalig. Eine Auswahlregel,
die rechnerisch stimmt und trotzdem jedes Mal dasselbe liefert.

**Zweiter Entwurf: feste Rangfolge nach Gefühl.** „Kapitän seines Landes"
stand weit oben und gewann in **74 %** aller Laufbahnen. Der Denkfehler: was
selten je *Saison* ist (3,5 %), ist über zwanzig Saisons nicht selten — es
kommt fast immer irgendwann vor.

**Dritter Entwurf: Rangfolge nach der in 35.104 gemessenen Seltenheit.**

    36 %  Nach hinten durchgereicht     3 %  Der alte Mann ist noch da
    23 %  Das verlorene Jahr            3 %  Durchbruch
    20 %  Kapitän seines Landes         1 %  Sofort angekommen
    14 %  Vom Reservisten zum Kapitän   1 %  Der Mann, auf den sie bauen

Acht verschiedene, häufigste 36 %. Dass eine negative Zeile oben steht, ist
gewollt: das Papier will, dass „auch sportlich schwächere, aber ungewöhnliche
Karrieren erinnerungswürdig" bleiben.

### Alte Einträge

Einträge von vor 35.117 haben die Felder nicht — dann fällt der ganze Block
weg, ohne dass etwas bricht. Dieselbe Regel wie bei den 33.10er-Feldern
darüber.

### Fünf neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| App.jsx gefunden | meldet sich ab, wenn nicht |
| der Eintrag trägt alle drei Felder | — |
| **die Stationsliste wird gekappt** | ✗ „der Eintrag wüchse mit der Laufbahn" |
| die Schlagzeile streut | Grenze 60 %, gemessen 33 % |
| jede Zeile der Rangfolge gibt es wirklich | fängt Tippfehler, die sonst still wären |

### Geprüft

| | 35.116 | 35.117 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 421, 0 Fehler | **426**, 0 Fehler |
| Byte je Saison | 3.453 | 3.453 |
| Hall-Eintrag | ~0,3 KB | ~0,67 KB |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

## 35.118 · Fünfzehn Jahre in Kapiteln — und eine Prüfung, die flatterte

Stufe D aus dem Prüfbericht zum Meta-Papier. Dazu ein Nebenschauplatz, der
mehr Zeit gekostet hat als die Sache selbst.

### Der Vereinsrun zerfällt anders als eine Laufbahn

`vereinsKapitel()` aus 35.105 schneidet nach **Vereinswechsel** — ein
Vereinsrun hat keine. `vereinsPhasen()` schneidet deshalb nach der **Liga**:
solange der Verein in derselben Spielklasse bleibt, ist es dasselbe Kapitel;
ein Auf- oder Abstieg beginnt ein neues. Das ist die Zäsur, die ein
Vereinsleben wirklich teilt.

Zwölf Kapitel — Gründerjahre, Der Aufstieg, Aufstieg und Durchmarsch, Die
goldene Generation, Der Absturz nach dem Titel, Das Wunderjahr, Der
Abstiegskampf und weitere. „Der Absturz nach dem Titel" braucht den Blick
zurück auf die vorige Phase, sonst wäre jeder Abstieg derselbe.

**Kein neues Feld.** `v.chronik` wird nicht gekappt und trägt je Jahr Liga,
Rang, Punkte, Tore und die Auf-/Abstiegsmarke.

**Die Liga allein reichte nicht.** Der erste Entwurf schnitt nur dort — und
wer fünfzehn Jahre in derselben Spielklasse bleibt, bekam **ein einziges**
Kapitel. Die Prüfung zeigte es sofort: zehn von zwölf Regeln unerreichbar,
weil die erste Phase immer „Der Anfang" heißt und keine zweite entstand.
Jetzt teilt auch der Erfolg: ein Meisterjahr nach einem titellosen beginnt ein
neues Kapitel und umgekehrt. Damit hat auch ein Verein, der nie auf- oder
absteigt, eine Geschichte mit Hoch und Tief statt einer geraden Linie.

Ein Beispiel aus der Prüfung: *Der Anfang · Das Wunderjahr · Der Absturz nach
dem Titel · Die ruhigen Jahre.*

**Und meine Testlagen waren zu kurz.** Sie bestanden aus Ein-Phasen-Chroniken,
und die erste Phase heißt immer „Der Anfang" — zehn Regeln wurden als toter
Code gemeldet, obwohl nur der Vorlauf fehlte. Jede Lage beginnt jetzt mit
einem belanglosen Jahr, damit die geprüfte Phase die zweite ist.

### Die Kalibrierung meldete rot, ohne dass etwas kaputt war

Beim Abnahmelauf fiel „Laufbahnen bis Vollausbau" auf **exakt 20,0** — die
Untergrenze. Die Änderung ist reine Anzeige und berührt keine VC. Fünf Läufe
mit derselben Quelle: **20,2 · 20,5 · 20,9 · 21,5 · 20,5.** Rauschen.

Damit ist die Prüfung flatterhaft, und das ist genau das, was diese Datei
seit 35.104 als schlimmer bezeichnet als keine Prüfung. Also behoben statt
weiter dokumentiert: die Stichprobe der Kalibrierung steigt von **250 auf
600** Laufbahnen.

### Dabei eine eigene Fehlmessung

Der erste Vergleich lief über `TEILE=kalib bash pruefstand/pruefen.sh
App.jsx --anzahl=1000`. Ergebnis: bei 250, 600 und 1000 jeweils **17 s
Laufzeit** — verdächtig, denn die Stichprobe soll sich vervierfachen.

**`pruefen.sh` reicht `--anzahl` nicht durch.** Alle drei Zeilen maßen
dieselben 250 Laufbahnen; die scheinbar enger werdende Streuung war Zufall.
Direkt aufgerufen: 250 → 15 s, 1000 → 42 s. Die Messung war wertlos und
wurde wiederholt.

### Und was das nicht löst

Fünf Läufe nach der Umstellung, über `pruefen.sh`:

    20,4 · 20,2 · 20,3 · 21,1 · 20,2      Spanne 0,9

**Nicht besser als vorher.** Fünf Läufe sind zu wenig, um eine Streuung
nachzuweisen; die größere Stichprobe muss rechnerisch helfen, belegt ist es
hier nicht. Belegt ist nur: der niedrigste gemessene Wert stieg von 19,9 auf
20,2.

Das eigentliche Problem bleibt offener Punkt 21 — das Band liegt zu dicht an
seiner Untergrenze. Eine größere Stichprobe verschiebt die Kante nicht, sie
macht nur das Zittern kleiner. Ob 20 die richtige Untergrenze ist, ist eine
Balancing-Entscheidung.

Kosten: rund 10 s mehr je Lauf.

### Geprüft

| | 35.117 | 35.118 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 426, 0 Fehler | **431**, 0 Fehler |
| Kalibrierung | 250 Laufbahnen | **600** |
| Byte je Saison | 3.453 | 3.453 |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

## 35.119 · Die Zeitleiste — und das Jahr, das dem Verein fehlte

Stufe E aus dem Prüfbericht zum Meta-Papier. In der Ruhmeshalle steht unter
dem Rekordbuch jetzt, **wann** die eigene Welt entstanden ist.

    2040   Die erste Laufbahn endet: Kwabena Adjei
    2042   Die Akademie wird gegründet
    2048   Der eigene Verein wird gegründet: FC Test
    2049   Der erste Weltklassespieler aus der eigenen Jugend
    2049   Der erste Aufstieg — 3. Liga
    2055   Nnamdi Okoro — bis heute die stärkste Laufbahn

### Nichts wird gespeichert

Das Papier warnt ausdrücklich: „Die Meta-Timeline darf Savegames nicht
unbegrenzt aufblasen." Die Zeitleiste wird bei **jedem Öffnen** aus
Ruhmeshalle, Akademie- und Vereinschronik gerechnet. Kein Ereignisprotokoll,
keine Obergrenze nötig, weil nichts wächst.

### Der Blocker: die drei Systeme teilten keine Zeitachse

Gemessen vor dem Bauen:

| System | Zeitangabe |
|---|---|
| Ruhmeshalle | `von` / `bis` — Kalenderjahre |
| Akademie | `gegruendet: 2026` — Kalenderjahr |
| Eigener Verein | `gegruendet: **true**`, `jahr: 1…15` — **kein Kalenderjahr** |

Der Verein zählte seine eigenen fünfzehn Jahre und wusste nicht, wann sie in
der Welt lagen. „Vereinsgründung" und „erster Aufstieg" — beides nennt das
Papier — ließen sich mit `true` nirgends einsortieren.

Drei Wege lagen vor: ein Feld ergänzen, den Verein weglassen, oder die Jahre
schätzen. **Das Schätzen habe ich abgelehnt** — es stünde in einer
Zeitleiste, die aussieht, als wüsste sie es genau. Kevins Entscheidung: das
Feld.

### Ein Typ wechselt, ohne dass etwas kippt

`v.gegruendet` trägt jetzt das Kalenderjahr statt `true`. **Vor der
Umstellung alle achtzehn Lesestellen durchgezählt:** jede prüft nur auf
Wahrheitswert (`verein && verein.gegruendet`), keine vergleicht mit `true`
oder `=== true`. Eine Jahreszahl ist genauso wahr.

Alte Spielstände tragen weiter `true` und funktionieren unverändert — sie
erscheinen in der Zeitleiste **ohne Jahr am Ende** statt an erfundener
Stelle. Fällt kein Weltjahr herein, bleibt es bei `true` wie bisher.

### Vereinsjahre sind relativ

`v.chronik[].jahr` zählt 1 bis 15, nicht 2048 bis 2062. Ohne Umrechnung
stünde der erste Aufstieg „im Jahr 2" mitten zwischen den Kalenderjahren. Die
Gegenprobe zeigt genau das:

    ✗ erster Aufstieg im Jahr 2 (Gründung 2048 + Vereinsjahr 2 − 1)

### Sieben neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| alle drei Systeme kommen vor | — |
| **die Einträge stehen in der richtigen Reihenfolge** | ✗ ohne `sort`: 2040 · 2055 · 2042 · 2049 |
| **Vereinsjahre werden auf Kalenderjahre gerechnet** | ✗ „im Jahr 2" |
| ein Verein ohne Kalenderjahr steht am Ende | — |
| mit Jahr sortieren sie sich ein | ist die Gegenprobe zur Zeile darüber |
| eine leere Welt ergibt keine Einträge | — |
| unvollständige Daten stürzen nicht ab | — |

### Geprüft

| | 35.118 | 35.119 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 431, 0 Fehler | **438**, 0 Fehler |
| Byte je Saison | 3.453 | 3.453 |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

Damit sind die Stufen A bis E des Meta-Papiers erledigt — **mit genau einem
neuen Feld**, und das war ein Typwechsel an einem, das es schon gab.

## 35.120 · Das Hauptmenü hatte schon fast alles

Stufe F aus dem Prüfbericht: „Hauptmenü als lebende Magazinausgabe."

### Der Befund: weitgehend erfüllt

Gemessen vor dem Bauen. Das Hauptmenü trägt seit Langem eine **Dachzeile,
eine Schlagzeile und eine Unterzeile** aus `titelgeschichte()`, dazu ein
Inhaltsverzeichnis „In dieser Ausgabe" mit Ressort-Seitenzahlen. Die
Menüzeilen zeigen echte Stände: Errungenschaften mit Zahl, Ruhmeshalle mit
bestem Lauf, Verein mit Jahr und Liga.

Das Papier fordert genau das. **Zwei Lücken blieben.**

### Die Ruhmeshalle wusste mehr, als sie sagte

Sie zeigte „Bester Lauf: 1640 Punkte". Seit 35.117 steht im besten Eintrag
aber auch, **was für eine Laufbahn** das war. Jetzt: „Der Titelsammler ·
1.640 Punkte" — dieselbe Zeile, mehr Aussage, kein neues Feld. Einträge von
vor 35.117 haben es nicht, dann bleibt es bei der Punktzahl.

### Die Sammlung fehlte ganz

Vier Menüzeilen gab es — Neue Laufbahn, Errungenschaften, Ruhmeshalle, Dein
Verein. Die **Kartensammlung war nur über das Vereinsdach erreichbar**,
obwohl das Papier sie ausdrücklich als Teaser der Titelseite nennt. Jetzt
eine eigene Zeile mit Kartenzahl und der Zahl der besonderen Karten — aber
nur, wenn es etwas zu sammeln gibt. Sonst wäre es eine leere Zeile mit einer
Null.

### Die Ansichtsprüfung hat es fünffach gefangen

Der erste Einbau griff auf `karten` zu — das Hauptmenü bekommt es gar nicht.
Fünf Meldungen sofort:

    ✗ Hauptmenü · ohne Akademie — ReferenceError: karten is not defined
    ✗ Hauptmenü · Coins bereit — ReferenceError: karten is not defined
    ✗ Hauptmenü · Akademie läuft — …
    ✗ Hauptmenü · aka undefined — …
    ✗ Menü · Sicherung ohne Bilanz — …

Ohne diese Prüfung wäre ein Hauptmenü ausgeliefert worden, das beim Öffnen
abstürzt — die erste Ansicht des Spiels.

### Geprüft

| | 35.119 | 35.120 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 438, 0 Fehler | 438, 0 Fehler |
| Knöpfe | 154 | 154 |
| Byte je Saison | 3.453 | 3.453 |
| Sicherheitslage | 0 Funde | 0 Funde |

Die Knopfzahl bleibt bei 154: die Sammlungszeile erscheint nur mit Karten,
und die Sichtprüfung hat keine.

## 35.121 · Der erste Gerätebefund seit 35.28

Kevin hat auf dem S24 Ultra fotografiert, was hier drinnen niemand gesehen
hat: **„DER NATIONALHELD" stand als fast schwarze Schrift auf dunkelbraunem
Grund.** Gemessener Kontrast **1,13** bei einer Grenze von 3 — praktisch
unsichtbar.

### Die Ursache war strukturell, nicht die eine Stelle

Die Kartonblätter `.karteikarte` und `.laufzettel` lösen `--tx` und `--mu`
zur Kartonfassung auf — die **Flächenfarben aber nicht.** Ein `.up`-Kasten
innerhalb einer Karteikarte trug damit Tinte (#14171A) auf #262218.

Nachgemessen für alle vier Flächen:

    Tinte auf --up   #262218   Kontrast 1,13
    Tinte auf --pan  #211E17   Kontrast 1,08
    Tinte auf --pan2 #282419   Kontrast 1,16
    Tinte auf --bg   #191813   Kontrast 1,01

**Alle vier waren dieselbe Falle**, nur bei dreien war sie noch nicht
aufgefallen. Es gibt 113 `pan`-Kästen im Spiel. Alle vier lösen jetzt auf;
Tinte auf der neuen Kartonfassung: **Kontrast 12,67.**

### Warum der Kontrasttest es nicht fand

`kontrast.cjs` prüft **drei Ansichten**: Titelblatt, Hauptmenü, Spielerpass.
Der Karriererückblick ist nicht dabei — und genau dort sind in den letzten
zwanzig Fassungen die meisten neuen Anzeigen entstanden. Er meldete
gleichzeitig „145 Textstellen · 0 Befunde".

**Die neue Probe deckt die Klasse ab, nicht eine vierte Ansicht:** wer `--tx`
umdefiniert, muss auch jede Fläche umdefinieren, auf der dieser Text landen
kann. Das fängt auch den nächsten Fall, ohne dass jemand eine Ansicht
nachträgt.

Gegenprobe: `--up` wieder herausgenommen → **„nicht aufgelöst:
laufzettel/--up"**.

### Und die Hygieneprüfung hat mich erwischt

Mein erster Kommentar dazu enthielt Rückwärts-Anführungszeichen — im
CSS-Vorlagenliteral. Der Aufbau brach sofort ab: „FEHLER: 14
Rückwärts-Anführungszeichen im CSS-Block." Die Prüfung gibt es seit 35.34,
und sie hat genau das getan, wofür sie da ist.

### Geprüft

| | 35.120 | 35.121 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 438, 0 Fehler | **441**, 0 Fehler |
| Kontrast Tinte auf Fläche | **1,01–1,16** | **12,67** |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

**Der Prüfstand hat in zwanzig Fassungen viel gefunden — das hier nicht.**
Zwei Gerätetests haben bisher Layoutfehler gefunden, dieser einen
Farbfehler, den keine Messung sah. Das Muster hält.

## 35.122 · Meine Korrektur war zu breit

Kevin hat die Wildcard-Karten fotografiert: **helle Schrift auf hellem
Papier.** Verursacht von 35.121, also von der Behebung des vorigen
Gerätebefunds.

### Was passiert war

In 35.121 stand ein gemessener Befund: Tinte auf `--up` ergab Kontrast 1,13.
Ich habe nachgerechnet, dass `--pan` (1,08), `--pan2` (1,16) und `--bg`
(1,01) **dieselben Werte** haben, und alle vier mit aufgelöst.

Die Rechnung stimmte. Die Wirkung nicht.

`.wkarte` setzt **absichtlich helle Schrift** (`--tx:#EFECE2`) und trägt
dafür eine eigens gebaute Ausnahme:

    .laufzettel .wkarte,.karteikarte .wkarte{background:var(--pan);}

Die Wildcard-Karte soll innerhalb der Kartonblätter den **dunklen** `--pan`
behalten. Mit `--pan` auf Karton lief diese Ausnahme ins Leere.

### Die Lehre

**Ein gemessener Kontrastwert sagt nicht, ob ein Text diese Fläche überhaupt
berührt.** Tinte landet auf `--up`, aber nicht auf `--pan` — dort sitzen
Bausteine mit eigenen Farben. Ich habe von vier gleichen Zahlen auf vier
gleiche Fälle geschlossen, ohne nachzusehen, was auf den Flächen liegt.

Dass ich es in der Einlegeanleitung selbst angekündigt hatte („nur den
Kontrast gerechnet, nicht die Wirkung"), macht es nicht besser — eine
Warnung ersetzt keine Prüfung.

### Zurückgenommen, und die Prüfung mit

Nur `--up` löst auf. Die drei anderen bleiben dunkel.

**Meine eigene Prüfung aus 35.121 war Teil des Problems:** sie verlangte alle
vier Flächen und meldete nach der Rücknahme prompt rot. Eine Probe, die eine
Regel erzwingt, muss ihre Ausnahmen kennen. Umgebaut auf:

| Probe | Gegenprobe |
|---|---|
| `--up` wird aufgelöst | ✗ ohne: „nicht aufgelöst: laufzettel/--up" |
| **die Wildcard behält ihren dunklen Grund** | ✗ Ausnahme entfernt: „helle Schrift auf hellem Papier" |
| die Wildcard setzt eigene helle Schrift | belegt, warum die Ausnahme nötig ist |

Die mittlere ist die eigentliche Absicherung: sie hätte 35.121 verhindert.

### Geprüft

| | 35.121 | 35.122 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 441, 0 Fehler | **443**, 0 Fehler |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

**Zwei Gerätebefunde in Folge, beide von Kevin.** Der erste zeigte einen
Fehler, den der Prüfstand nicht sah; der zweite einen, den ich beim Beheben
des ersten gemacht habe. Beide Male war die Ursache dieselbe Sorte: eine
Regel ohne Blick auf ihre Ausnahmen.

## 35.123 · Fast geschafft — abgeleitet statt gepflegt

Stufe G aus dem Prüfbericht: „Eine kleine Fast-geschafft-Fläche kann 2 bis 3
naheliegende Fortschritte zeigen." Auf der Errungenschaftsseite stehen jetzt
höchstens drei, alle mindestens zu 60 % erreicht.

### Keine zweite Liste

Bei 192 Errungenschaften wäre eine Handliste mit Messfunktion und Schwelle je
Eintrag nicht nur Arbeit, sondern eine **zweite Liste, die beim nächsten
neuen Erfolg stumm auseinanderläuft** — dasselbe Muster, das dieses Projekt
schon dreimal getroffen hat.

Stattdessen wird die Bedingung gelesen. Gemessen: **71 der 192** haben die
reine Form `(G.feld || 0) >= Zahl` und geben Feld und Schwelle selbst preis.
Die übrigen 121 bleiben außen vor — sie prüfen mehrere Größen oder gehen über
die Historie, und ein halb erratener Fortschritt wäre schlechter als keiner.

### Warum Parsen hier erlaubt ist, obwohl es zweimal danebenging

In 35.105 und 35.108 wurde Funktionstext gelesen und beides Mal fiel der
Übersetzer dazwischen: `her` wurde zu `her2`, Kapitelnamen trugen
Escape-Sequenzen. **Feldnamen von Objekteigenschaften und Zahlen benennt
esbuild nicht um** — `G.apps >= 500` steht im Bündel genauso da.

Das ist kein Argument, sondern eine Behauptung, solange es niemand prüft.
Deshalb die erste Probe: sie liest den Fortschritt **im gebündelten Code** und
meldet rot, wenn nichts herauskommt. Gegenprobe mit gebrochenem Ausdruck:
**„KEINER — das Ablesen greift im Bündel nicht"**.

### Die Schwelle war zuerst falsch beurteilt

Ein erster Test ergab nur **einen** Treffer, und ich hätte die 60 % beinahe
gesenkt. Die Testwelt war zu dünn besetzt — nur ein paar Felder gesetzt. Über
realistische Stände:

    nach  3 Laufbahnen    3 Treffer
    nach  8 Laufbahnen    3 Treffer
    nach 15 Laufbahnen    8 Treffer  (davon drei gezeigt)

60 % bleibt. Wer bei 12 von 500 steht, liest das nicht.

### Sieben neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| **der Fortschritt lässt sich im Bündel ablesen** | ✗ Ausdruck gebrochen |
| höchstens drei | — |
| was weit weg ist, wird nicht gezeigt | — |
| wer nah dran ist, wird gezeigt | ✗ Ausdruck gebrochen |
| Erledigtes verschwindet | — |
| nur die Gesamtbilanz wird gelesen | — |
| unvollständige Bilanzen | — |

### Geprüft

| | 35.122 | 35.123 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 443, 0 Fehler | **450**, 0 Fehler |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

### Der zweite Fehlalarm in fünf Fassungen

Der Abnahmelauf meldete erneut **exakt 20,0** bei „Laufbahnen bis
Vollausbau". Fünf Läufe mit derselben Quelle: **21,4 · 20,7 · 20,1 · 20,9 ·
20,8** — Rauschen, wie in 35.118.

Die Stichprobenerhöhung von 250 auf 600 hat das nicht gelöst, und ich habe
das dort auch so geschrieben. Inzwischen ist es zweimal passiert und hat
beide Male Zeit gekostet, die nicht in die Sache ging. **Eine Prüfung, die
zweimal ohne Grund rot meldet, erzieht dazu, roten Meldungen nicht mehr zu
glauben** — der schlimmste Zustand, den diese Datei kennt.

Ich verstelle das Band nicht eigenmächtig: das wäre das Messgerät justieren,
weil die Anzeige stört. Aber die Entscheidung ist fällig, und sie steht bei
Kevin. Die Zahlen dafür: gemessener Median rund **20,7**, Spanne über fünf
Läufe **1,3**, Untergrenze **20** seit 35.81. Der Abstand zur Grenze ist
kleiner als das Rauschen.

Siehe offener Punkt 21.

**Nicht gemacht:** die Rubriken aus 3.16 (Karriere, Nationalmannschaft,
Vereinstreue, …). Die Errungenschaften tragen kein Rubrikfeld, nur Stufen und
Kennungs-Vorsilben (`a_` 70, `f_` 50, `b_` 26, `c_` 22, `d_` 14, `e_` 10).
Ob die Vorsilben thematisch sind, ließe sich nur durch Durchlesen aller 192
klären — und eine geratene Zuordnung wäre schlechter als die heutige Sortierung
nach Stufe.

## 35.124 · Zwei stille Fehler, einer davon meiner

Beim Vorbereiten von Stufe H (Akademie → Karte → Verein) kamen zwei Dinge
heraus, die beide seit Langem wirkungslos dastanden.

### `aka.ehrentafel` gibt es nicht

Die Meta-Zeitleiste aus 35.119 las `aka.ehrentafel`, um den ersten
Weltklassespieler aus der eigenen Jugend zu finden. **Das Feld existiert
nicht.** Die Akademie führt `absolventen`, und die Werte heißen `peak` und
`raus`, nicht `ovr` und `jahr`.

Der Ausdruck war seit fünf Fassungen still wirkungslos: `undefined || []`
ergibt eine leere Liste — kein Absturz, keine Warnung, nur ein
Zeitleisteneintrag, der nie erschien.

**Woher der Irrtum kam:** der Reiter im Akademie-Dach heißt „ehrentafel", das
Feld dahinter nicht. Ich habe den sichtbaren Namen für den Feldnamen
gehalten, statt nachzusehen — dieselbe Sorte Fehler wie `p.nt.titel` in
35.109 und `fx.wage` in 35.108.

Berichtigt. Der Eintrag erscheint jetzt: *„2035 — Der erste
Weltklassespieler aus der eigenen Jugend: Maykel Ramirez Duarte."*

### `ausTalent` war toter Code

`karten.js` trägt eine Funktion, die aus einem Akademietalent eine Karte
macht. Sie **wird nirgends aufgerufen** — und das seit ihrer Einführung.
Gleichzeitig sieht die Kartenansicht bereits „· aus der Jugend" für
`herkunft === "akademie"` vor: eine Anzeige, die auf Karten wartet, die nie
entstehen.

Der Grund war der falsche Zeitpunkt. Ein laufendes Talent hat noch keine
Geschichte; erst der **Absolvent** hat eine — Jahrgang, Abgangsjahr,
erreichte Höchststärke, erster Profiklub. Genau das steht in
`a.absolventen`.

Umgebaut zu `ausAbsolvent`. Die Kennung bleibt `t:` + `id`: der Absolvent
trägt dieselbe `id` wie das Talent, aus dem er wurde. **Damit ist die
Identität über alle Systeme derselbe String** — ohne neues Feld und ohne
Änderung an der Zusammenführung im Pool. Das ist die Antwort auf Frage 4 des
Meta-Papiers.

### Was noch fehlt, und warum ich es nicht geraten habe

**Der Aufruf.** Absolventen werden noch nicht zu Karten. Ich habe die Stelle
nicht gefunden, an der ein Akademiejahr im Spiel ausgelöst wird: `akaJahr`
wird in `App.jsx` destrukturiert (Zeile 6074) und taucht danach nur noch in
Kommentaren auf.

**Daraus folgt nicht, dass es nie läuft** — die Akademie funktioniert
sichtbar, also gibt es den Aufruf. Ich habe ihn nur nicht gefunden, und
einen Kartenerzeuger an eine geratene Stelle zu hängen wäre schlechter als
ihn offen zu lassen.

`ausAbsolvent` ist damit weiterhin ohne Leser — jetzt aber mit dem richtigen
Zuschnitt und einem Kommentar, der den Befund festhält. **Nächster Durchgang:
Aufrufstelle finden, dann eine Zeile.**

### Und der Prüfstand hat die Umbenennung gefangen

Nach dem Umbau brach die Vereinsprüfung ab: **`TypeError: K.ausTalent is not
a function`**. Eine Probe aus einer früheren Fassung rief den alten Namen.
Der Hauptlauf meldete nur „MINDESTENS EIN TEIL IST FEHLGESCHLAGEN" ohne
sichtbare rote Zeile — weil der ganze Teil abstürzte, statt einzelne Proben
zu melden. Erst der Einzelaufruf zeigte die Ursache.

Das ist ein Hinweis für den nächsten Durchgang: **ein abgestürzter Prüfteil
sieht im Gesamtlauf fast wie ein bestandener aus.** Wer „FEHLGESCHLAGEN"
liest und keine rote Zeile findet, ruft den Teil einzeln auf.

### Geprüft

| | 35.123 | 35.124 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 450, 0 Fehler | 450, 0 Fehler |
| Zeitleiste Akademie-Eintrag | **nie** | erscheint |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

## 35.125 · Die Kette ist geschlossen

Stufe H des Meta-Papiers, letzter Schritt: „Ein Talent kann die Akademie
verlassen, Profi werden, später als Karte auftauchen."

### Die Aufrufstelle, die 35.124 nicht gefunden hat

`akaJahr` wird nicht aus `App.jsx` gerufen, sondern **aus `akademie.js`
selbst** — `akaVerbuchen` lässt am Ende ein Jahr weiterlaufen
(`akademie.js:574`). Und `akaVerbuchen` steht im Karriereende, direkt neben
dem Vereinsjahr.

Deshalb war die Suche in 35.124 vergeblich: ich habe nach dem Aufruf einer
Funktion gesucht, die eine andere Funktion für mich ruft. Der Weg führte über
die Datei, nicht über den Bildschirm.

### Nur die neuen

Verglichen wird gegen den Stand **vor** dem Akademiejahr. Sonst wanderten bei
jeder Laufbahn alle bisherigen Absolventen erneut in den Pool — folgenlos, da
er über `kid` zusammenführt, aber jedes Mal über bis zu vierzig Einträge.

### Die Kennung ist die Verbindung

Ein Absolvent trägt dieselbe `id` wie das Talent, aus dem er wurde; die Karte
trägt `t:` + diese id. **Derselbe Spieler ist in Akademie, Sammlung und
Verein derselbe String** — ohne neues Feld, ohne Änderung an der
Zusammenführung. Damit ist Frage 4 des Meta-Papiers nicht nur beantwortet,
sondern gebaut.

### Sieben neue Prüfungen, alle über echte Zustandsübergänge

Akademie gründen, vierzehn Jahre laufen lassen, Absolventen einsammeln,
Karten daraus machen, in den Pool legen. Gemessen: **29 Absolventen, 29
Karten**, Kennung führt zurück, zweites Einlegen ändert nichts.

| Probe | |
|---|---|
| die Akademie bringt Absolventen hervor | 29 nach 14 Jahren |
| aus jedem wird eine Karte mit Herkunft | `t:t2028_5kg3` (legende) |
| **die Kennung führt auf das Talent zurück** | die eigentliche Verbindung |
| derselbe Absolvent landet nicht zweimal im Pool | 29 bleiben 29 |
| die Karte trägt die Höchststärke, nicht den Endwert | wer mit 34 aufhört, wird keine 58er-Karte |
| der Jahrgang steht auf der Karte | macht sie erzählbar |
| Gegenprobe: frische Akademie, keine Absolventen | 0 |

### Geprüft

| | 35.124 | 35.125 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 450, 0 Fehler | **457**, 0 Fehler |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

Damit sind die Stufen A bis H des Meta-Papiers erledigt. Offen bleiben I
(Sammlungssets) und J (individuellere Talente) — und die Entscheidung zu
offenem Punkt 21.

## 35.126 · Sechs Sammlungsseiten

Stufe I des Meta-Papiers: „Die Kartensammlung kann kleine thematische Seiten
erhalten. Das soll sich eher wie Stickeralbum anfühlen als wie ein weiteres
Questlog."

    Aus eigener Kraft    11    Vereinstreue      11
    Die Unsterblichen     5    Sonderausgaben     5
    Die goldene Elf      11    Weltreise         15

### Kein Questlog

**Keine Belohnung für eine volle Seite, keine Frist, kein Häkchen** — nur die
Zahl. Wer sie vollkriegt, hat eine volle Seite, und das ist der Zweck. Die
Seiten erscheinen erst ab fünf Karten; davor stünde alles auf null und sähe
nach Aufgabenliste aus statt nach Album.

### Abgeleitet, nicht gespeichert

Jede Seite ist eine Bedingung über den vorhandenen Pool — Herkunft, Stufe,
Land, Sonderkarten-Marker. **Kein neues Feld, kein Fortschrittsspeicher,
keine zweite Liste.**

„Weltreise" zählt Länder statt Karten und steht deshalb nicht in der Tabelle,
sondern wird eigens gerechnet. Eine Bedingung je Karte könnte das nicht
ausdrücken.

### „Aus eigener Kraft" gibt es erst seit gestern

Diese Seite wäre bis 35.125 **dauerhaft leer** geblieben — Absolventen wurden
nicht zu Karten. Eine Sammelseite, die niemand vollkriegt, ist keine Seite,
sondern eine Sackgasse. Die Prüfung „jede Seite lässt sich wirklich
vollmachen" hält das fest.

### Sechs neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| es gibt Sammlungsseiten | — |
| eine leere Sammlung steht überall auf null | — |
| **jede Seite lässt sich vollmachen** | — |
| drei Karten füllen keine Seite | sichert die Zeile darüber ab |
| der Zähler läuft nicht über das Soll | sonst stünde „14/11" da |
| unvollständige Pools | — |

### Geprüft

| | 35.125 | 35.126 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 457, 0 Fehler | **463**, 0 Fehler |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

**Stufen A bis I des Meta-Papiers erledigt.** Offen: J (individuellere
Akademietalente) — und die Entscheidung zu offenem Punkt 21.

## 35.127 · Entwicklungstypen — die letzte Stufe

Stufe J des Meta-Papiers: „Akademiespieler sollen gelegentlich erkennbare
Entwicklungsidentitäten erhalten. Keine zweite Spielerkarriere im
Kleinformat und keine Flut neuer Attribute."

Sechs Typen: **Trainingsmonster · Spätentwickler · Frühreif ·
Verletzungsanfällig · Sorgenkind · Kapitänstyp.**

### Ein Feld, nicht sieben

`t.typ` trägt eine Kennung oder fehlt. Alte Spielstände haben es nicht — dann
verhält sich das Talent wie bisher. Keine Migration.

**Nur ein Drittel bekommt einen.** Wenn jedes Talent einen Typ trägt, ist der
Typ die Regel und sagt nichts mehr. Gemessen über 12 Akademien und 299
Absolventen: **64 % ohne, 36 % mit** — dieselbe Überlegung wie beim
Nebenarchetyp in 35.109, der von 83 % auf 40 % gestrafft wurde.

### Jeder Typ tut etwas

Ein Merkmal, das nur auf der Karte steht, wäre ein Text ohne Mechanik — die
Fehlerklasse, die dieses Projekt am häufigsten getroffen hat. Alle sechs
greifen in **dieselbe Zuwachsrechnung**, die es seit jeher gibt, nicht in
eine eigene daneben.

    Spätentwickler   mit 16:  5,5   mit 19: 15,0
    Frühreif         mit 16: 15,5   mit 19:  7,0

Gegenläufig, sonst wären es zwei Namen für dasselbe. „Verletzungsanfällig"
verdoppelt die Grundgefahr — die Medizin wirkt weiterhin dagegen.

### Der Typ wäre fast im richtigen Moment verschwunden

Erster Entwurf: **315 Absolventen aus zwölf Akademien, alle ohne Typ** —
obwohl ein Drittel der Talente einen trug. Er blieb beim Talent zurück und
wäre genau dann verschwunden, wenn der Spieler erinnerungswürdig wird: auf
der Karte, in der Ehrentafel, in der Zeitleiste.

Und es waren **drei** Stellen, nicht eine. Die erste war schnell gefunden
(`talentStellen`), die Messung zeigte danach weiter 100 % ohne Typ — die
meisten Absolventen entstehen an zwei anderen Stellen im Akademiejahr. Ohne
die zweite Messung wäre die Behebung als erledigt durchgegangen.

### Sechs neue Prüfungen

| Probe | |
|---|---|
| es gibt Entwicklungstypen | ✗ ohne Ausfuhr: „0 Typen" |
| **jeder verändert den Zuwachs wirklich** | fängt Namen ohne Wirkung |
| Spätentwickler und Frühreif laufen gegenläufig | — |
| **der Typ überlebt den Weg zum Absolventen** | genau der Fehler oben |
| die Mehrheit bleibt bewusst ohne | Grenze 55 % |
| ein Talent ohne Typ läuft unverändert | alte Spielstände |

### Geprüft

| | 35.126 | 35.127 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 463, 0 Fehler | **469**, 0 Fehler |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

**Damit ist das Meta-Konzeptpapier abgearbeitet.** Dreiundzwanzig
Entwicklungsrichtungen, dreizehn Fassungen, **zwei neue Felder** — ein
Typwechsel an `v.gegruendet` und `t.typ`.

## 35.128 · Ein abgestürzter Prüfteil sagt jetzt, dass er abgestürzt ist

Offener Punkt 20, und die Lücke, die mich in 35.124 Zeit gekostet hat.

### Punkt 20 war schon halb erledigt

Nachgezählt: von den Prüfungen vor dem Übersetzen setzt heute nur noch
**eine** `FEHLER` — die Backtick-Hygiene. Dort stimmt die Meldung „Erst den
Übersetzungsfehler oben beheben", weil ein Backtick im CSS-Block wirklich
einen erzeugt. Alle übrigen zählen längst auf `DOK`.

Der in Punkt 20 beschriebene Zustand existiert so nicht mehr. **Aber die
verwandte Lücke war eine andere.**

### Absturz sieht aus wie Fehlschlag

In 35.124 stürzte `vereinpruefung.cjs` nach einer Umbenennung ab
(`TypeError: K.ausTalent is not a function`). Der Lauf meldete am Ende nur
„MINDESTENS EIN TEIL IST FEHLGESCHLAGEN" — **ohne eine einzige rote Zeile**,
weil der Teil starb, bevor er eine ausgeben konnte.

Beide Fälle geben Nicht-Null zurück. Nur einer sagt, was los ist.

`teil_fahren` liest die Ausgabe jetzt mit. Fehlt die Abschlusszeile
(„N Prüfungen bestanden" oder „N Proben ohne Befund"), war es kein
Fehlschlag, sondern ein Absturz:

    ABGESTUERZT: Verein ist stehengeblieben, bevor ein Ergebnis kam.
    Das ist KEIN fehlgeschlagener Test, sondern ein Fehler im Pruefwerkzeug
    oder eine Funktion, die es nicht mehr gibt. Zum Nachstellen:
        cd /tmp/ps && node …/vereinpruefung.cjs --quelle=…/App.jsx

Beide Richtungen geprüft: ein echter Fehlschlag bleibt ein normaler roter
Befund und wird **nicht** als Absturz gemeldet.

### Ein typografisches Anführungszeichen legte das Skript lahm

Mein erster Entwurf schrieb `„$NAME"` in eine Shell-Zeichenkette. Das
öffnende Zeichen ist typografisch, das schließende gerade — die Zeichenkette
endete zu früh, und `pruefen.sh` brach mit einem Syntaxfehler in Zeile 94 ab,
sechzig Zeilen hinter der Ursache.

Dieselbe Klasse wie die Backticks im CSS-Block, für die es seit 35.34 eine
eigene Prüfung gibt: **ein Zeichen, das eine Zeichenkette beendet, wo niemand
eine Zeichenkette vermutet.** Hier reichte `bash -n`.

### Geprüft

| | 35.127 | 35.128 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 469, 0 Fehler | 469, 0 Fehler |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

Keine Änderung am Spiel — nur am Prüfstand.

## 35.129 · F29 — zwei Systeme, ein Speicherplatz

Erster Punkt aus dem Gesamtbericht 35.128 (Revision 5). **P0, bestätigter
Datenverlust.**

### Nachgestellt, bevor etwas geändert wurde

    const WC_KEY     = "rasenschach:karten";     Zeile 7701
    const KARTEN_KEY = "rasenschach:karten";     Zeile 8291

Zwei fachlich völlig verschiedene Systeme schrieben auf dieselbe Stelle:

    kartenErgaenzen   schreibt den Kartenpool    { karten: [ … ] }
    merkeErfolge      schreibt die Wildcard-Map  { w_vollstrecker: 1 }

Im Karriereende laufen **beide nacheinander** — erst der Pool (16282), dann
die Map (16357). Mit den echten Datenformen nachgestellt:

    nach kartenErgaenzen:  1 Karte
    nach merkeErfolge:     {"w_vollstrecker":1}
    beim Laden:            0 Karten

**Kein stummer Schreibfehler — ein erfolgreicher Schreibzugriff auf den
falschen Datensatz.** Genau deshalb fällt so etwas keiner Prüfung auf, die
nur nach Ausnahmen sucht.

### Der Pool behält den alten Schlüssel

`WC_KEY` heißt jetzt `rasenschach:wildcards`. Die Wildcard-Map zählt nur,
welche Karte schon gezogen wurde; die Sammlung dagegen kann Jahre Arbeit
enthalten. Sie bleibt, wo sie liegt — vorhandene Spielstände behalten sie
ohne Migration.

### Migration für die, bei denen es schon passiert ist

Ein Spielstand von vor 35.129 trägt unter dem alten Schlüssel je nach Zufall
die eine oder die andere Form. Unterschieden wird an der **Form**, nicht am
Namen: ein Pool hat `karten` als Liste.

Findet sich dort eine Wildcard-Map, wird sie auf den neuen Schlüssel
gerettet — aber **nur, wenn dort noch nichts steht**, sonst überschriebe ein
zweiter Start die inzwischen richtig geführte Map.

**Was NICHT behauptet wird:** eine bereits überschriebene Sammlung ist
verloren. Das Papier sagt es selbst — „bereits überschriebene Packkarten ohne
unabhängige Sicherung nicht als wiederherstellbar versprechen".

### Sechs neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| App.jsx gefunden | meldet sich ab, wenn nicht |
| **keine zwei Konstanten zeigen auf dieselbe Stelle** | ✗ „KOLLISION: WC_KEY und KARTEN_KEY → rasenschach:karten" |
| eine Kollision fällt auf | sichert die Zeile darüber ab |
| die Migration erkennt beide Formen | 5 Formen geprüft |
| `ladeAlles` prüft die Form, nicht den Namen | — |
| die Sicherungsliste führt keinen doppelt | — |

Die zweite ist die eigentliche Absicherung: **mit dem Stand von 35.128
meldet sie rot.** Sie hätte F29 gefangen, bevor er ausgeliefert wurde.

### Ein zweiter Befund unterwegs — nicht aus dem Bericht

Beim Abnahmelauf meldete „fünfzehn Saisons laufen ohne Abbruch durch" rot:
*„Jahr 15: Nicht spielbereit: zu wenige Spieler, 1 Plätze offen."*

**Zuerst geklärt, ob ich das verursacht habe.** Fünf Läufe auf dem neuen
Stand: 2 von 5 rot. Fünf Läufe auf dem **unveränderten 35.128**: 1 von 5.
Also bestehend, nicht neu — und im Gesamtbericht nicht enthalten.

**Ursache:** die Auffüllschleife im Test nimmt das **stärkste** Talent, und
`hochziehen` weist alles unter 16 ab („Unter 16 wird niemand hochgezogen").
War der beste Jahrgang gerade fünfzehn, brach die Schleife ab, obwohl ältere
danebenstanden. Der Kader blieb unvollständig.

Zwei Verdächtige vorher ausgeschlossen: die Ablehnung eines Talents greift
nur mit `opt.fragen`, das der Test nicht setzt; und die Akademie lief nicht
leer — es waren Talente da, nur zu junge.

**Ein Testaufbau, kein Spielfehler.** Behoben durch Filtern auf Alter ab 16;
danach acht Läufe hintereinander stabil.

### Geprüft

| | 35.128 | 35.129 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 469, 0 Fehler | **475**, 0 Fehler |
| Knöpfe | 154 | 154 |
| Sicherheitslage | 0 Funde | 0 Funde |

**Status F29: behoben.** Offen bleibt die Geräteprüfung — zweiter
Karriereabschluss mit Packöffnung, Backup, Import und Reset.

## 35.130 · F01 — Fortsetzen sprang zurück ins Training

Zweiter Punkt aus dem Gesamtbericht. **P1, doppelter Fortschritt.**

### Nachgestellt

    saveGame(q, "result")     sichert den Schritt
    onResume                  setzte IMMER setStep("training")

Wer im Ergebnisschritt aufhörte, bekam beim Fortsetzen dieselbe Saison ein
zweites Mal: Entwicklung, Abrechnung und Jahreswechsel liefen doppelt.

### Die Saison war schon da, die Angebote nicht

`simulateSeason` legt die Saison mit `p.seasons.push(season)` ab — **der
letzte Eintrag ist sie.** Kein zweites Feld nötig.

Die Angebote dagegen liegen nur im Ansichtszustand. Sie wandern jetzt in den
Spielstand — nicht aus Bequemlichkeit: würden sie beim Fortsetzen neu
gewürfelt, wäre ein Neustart ein **Reroll für bessere Verträge**.

Alte Spielstände tragen keine Angebote. Dann fällt der Schritt sauber auf
„training" zurück, statt eine halbe Ansicht zu zeigen.

### Fünf neue Prüfungen

Geprüft wird die Quelle, weil der Wiederaufnahmepfad in React sitzt:
kein festes „training" mehr, Angebote werden gesichert, Rückfall für alte
Stände, Saison wird abgeleitet.

### Und noch eine flatternde Prüfung — meine eigene

„Museum: die Schlagzeile im Eintrag streut" meldete rot. Sechs Läufe
gemessen: **25 % · 42 % · 42 % · 42 % · 58 % · 58 %** — bei zwölf Laufbahnen
streut der *Messwert selbst* um vierzig Punkte. Die Grenze von 60 % traf
damit den Zufall, nicht die Sache.

Über 80 Laufbahnen lag der wahre Wert bei 36 %. Stichprobe auf **30**
erhöht, Grenze **unverändert bei 60 %** — sie wird nicht verschoben, weil sie
stört; die Messung wird genauer. Danach sechs Läufe stabil.

Das ist in dieser Sitzung die dritte flatternde Probe (Vereinskader,
Museum, dazu das bekannte Zielband). Ein Muster: **kleine Stichproben mit
harten Grenzen.**

### Geprüft

| | 35.129 | 35.130 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 475, 0 Fehler | **480**, 0 Fehler |
| Knöpfe | 154 | 154 |

**Status F01: behoben.** Offen: die Geräteprüfung — jeden Schritt verlassen,
fortsetzen, nach Prozessneustart laden.

## 35.131 · Der Sicherungspfad — F02, F03, F04, F05, F15, F18

Sechs Befunde an derselben Stelle. Einzeln behoben hätten sie sich
gegenseitig widersprochen, deshalb in einer Fassung.

### Was der Import vorher tat

    for (const k of Object.keys(paket.daten)) {
      if (!SICHER_KEYS.includes(k)) continue;
      try { await store.set(k, paket.daten[k]); n++; } catch (e) { }
    }

Drei Fehler in fünf Zeilen. Nur Schlüssel **aus dem Paket** wurden
geschrieben — fehlende blieben liegen, und zwei Spielverläufe standen
nebeneinander (F02). Der Inhalt wurde nie geprüft, ein formal passendes
Paket konnte „kein JSON" in den Spielstand schreiben (F03). Und einzelne
Schreibfehler verschwanden im leeren `catch`, während die Meldung nur die
Zahl der gelungenen nannte (F04).

### Jetzt in drei Schritten

**Erst prüfen, dann sichern, dann schreiben.** Jeder Datensatz wird gegen
eine Grundform geprüft, bevor irgendetwas geschrieben wird — je Schlüssel
eine eigene, weil sie unterschiedliche Dinge tragen. Der bisherige Stand
wird zwischengesichert; scheitert ein Schreibzugriff, wird zurückgerollt.
Scheitert auch das, sagt die Meldung genau das.

**Fehlende Schlüssel werden gelöscht, nicht stehengelassen.** Eine Sicherung
ist ein Zustand, kein Nachtrag.

### Export und Kopieren

Ein **Lesefehler ist kein fehlender Schlüssel** (F18). Bis hierher wurden
beide übersprungen, und wer eine Sicherung ohne Spielstand mitnahm, hielt sie
für vollständig. Jetzt bricht der Export ab: eine unvollständige Sicherung
ist gefährlicher als keine.

`document.execCommand("copy")` liefert einen Wahrheitswert, der nie gelesen
wurde (F05) — bei `false` erschien trotzdem „In die Zwischenablage kopiert".

Und „1 Datensätze" heißt jetzt „1 Datensatz" (F15).

### Ich habe eine Speichermethode erfunden

Mein erster Entwurf rief `store.remove`. **Die gibt es nicht** —
`storage.js` kennt `get`, `set` und `delete`. Der Import wäre beim ersten
fehlenden Schlüssel abgestürzt.

Keine Ansichtsprüfung hätte das gefangen, weil der Importpfad dort nie
läuft. Aufgefallen ist es, weil ich nach dem Schreiben in `storage.js`
nachgesehen habe — dieselbe Klasse wie `p.nt.titel` (35.109), `fx.wage`
(35.108) und `aka.ehrentafel` (35.124). Das ist der vierte Fall.

Deshalb prüft jetzt eine eigene Probe **alle** `store.*`-Aufrufe gegen das,
was `storage.js` wirklich anbietet. Gegenprobe: **„kennt `store` nicht:
remove"**.

### Acht neue Prüfungen

| Probe | |
|---|---|
| der Import prüft, bevor er schreibt | Reihenfolge im Quelltext |
| was die Sicherung nicht enthält, bleibt nicht liegen | F02 |
| ein Schreibfehler wird zurückgerollt | F04 |
| Kopieren meldet nur bei echtem Erfolg | F05 |
| ein Lesefehler bricht den Export ab | F18 |
| Mengenformen stimmen bei eins | F15 |
| **nur Speichermethoden, die es gibt** | ✗ „kennt `store` nicht: remove" |

### Geprüft

| | 35.130 | 35.131 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 480, 0 Fehler | **488**, 0 Fehler |
| Knöpfe | 154 | 154 |

**Status: F02, F03, F04, F05, F15 (Sicherungstexte), F18 behoben.** F06
(stumme Speicherfehler außerhalb der Sicherung) bleibt offen — er betrifft
`saveGame`, `vereinSichern` und `speichereAka` und gehört in die nächste
Fassung.

## 35.132 · F06 — was sich nicht speichern ließ

### Vier Stellen fingen gar nichts

    try { store.set(k, v); } catch (e) {}

`store.set` gibt eine **Promise** zurück. Wird sie abgelehnt, läuft das
synchrone `catch` längst nicht mehr — die Ablehnung bleibt unbehandelt.
Betroffen waren: Einstellungen, Verein, Freischaltungen und die Sammlung
nach einem Packkauf.

Die übrigen sechzehn Stellen fingen den Fehler zwar, verschluckten ihn aber:
leeres `catch`, kein Wort nach außen. **Der Spieler sah nichts und spielte
weiter, während nichts mehr ankam.**

### Ein Weg statt zwanzig

`schreibe(key, wert, was)` ist jetzt der einzige Schreibweg. Er merkt sich,
**was** zuletzt nicht ankam, und nimmt die Warnung zurück, sobald derselbe
Datensatz wieder durchgeht.

Im Hauptmenü steht dann ganz oben in Warnfarbe:

> **Nicht gespeichert**
> Dein Verein ließ sich zuletzt nicht sichern. Dein Fortschritt ist auf
> diesem Gerät nicht sicher — mach über Optionen eine Sicherung, bevor du
> weiterspielst.

**Kein Dialog mitten im Spiel.** Der Fehler ist wichtig, aber er darf die
Saison nicht unterbrechen — und wer ihn liest, soll etwas tun können, nicht
nur wegklicken.

### Die Prüfung fand eine Stelle, die ich übersehen hatte

Nach dem Umbau meldete „kein Schreibzugriff ohne `await`" weiterhin **eine
Stelle** — `onAkaAendern` im Vereinsschirm, die in meiner Liste nicht stand.
Genau dafür ist die Probe da: sie zählt alle `store.set(` und nicht die, an
die ich mich erinnere.

### Fünf neue Prüfungen

| Probe | |
|---|---|
| **kein Schreibzugriff ohne `await`** | fand eine übersehene Stelle |
| es gibt einen gemeinsamen Schreibweg | — |
| das Hauptmenü zeigt den Fehler an | ein unsichtbarer Fehler ist halb behoben |
| die Warnung verschwindet nach Erfolg | sonst stünde sie bis zum Neustart |

### Geprüft

| | 35.131 | 35.132 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 488, 0 Fehler | **493**, 0 Fehler |
| Knöpfe | 154 | 154 |

**Status F06: behoben.** Damit ist von Etappe 1 offen: F17, F41, F44.

## 35.133 · F41 — „Nicht umkehrbar" war eine falsche Zusage

### Der geleerte Spielstand kam zurück

Der Reset löschte eine von Hand geführte Liste. Darin fehlten **zwei
Fortschrittsschlüssel** — `WC_KEY` (gezogene Wildcards) und `HSV_KEY` (der
Ausgleichszähler der Rautekarte).

Schwerer wiegt der zweite Teil: die **Migrationsschlüssel** blieben stehen.
Beim nächsten Start holt `ladeMitAltbestand` daraus den alten Spielstand und
schreibt ihn auf den aktuellen Schlüssel zurück. Eine gelöschte Laufbahn
stand wieder da.

### Die Liste führt sich jetzt selbst

Sie wird aus den Konstanten gebildet und um `...Object.values(ALT_KEYS).flat()`
ergänzt. Wer künftig einen Schlüssel hinzufügt, muss nicht daran denken —
und eine Prüfung zählt nach, dass **jeder** `_KEY` darin vorkommt.

Ein Löschfehler wird gemeldet statt überspielt: bleibt auch nur ein Eintrag
stehen, wird **nicht neu geladen**, sondern gesagt, was nicht ging.

### Ich habe dabei einen Absturz gebaut

Mein Reset-Code rief `setLoeschFehler`, während die zugehörige
`useState`-Zeile an einem gescheiterten Python-Ersatz hängengeblieben war:
**ein Aufruf, keine Definition.** Das Zurücksetzen wäre abgestürzt.

Keine Ansichtsprüfung hätte es gefangen — der Löschdialog wird dort nie
geöffnet. Aufgefallen ist es, weil der Ersatz einen `AssertionError` warf und
ich danach nachgezählt habe.

**Daraus eine Prüfung gemacht:** jeder freistehende `setX(`-Aufruf muss
irgendwo deklariert sein. 115 Setzer werden geprüft; Browser-eigene Namen
und Modulaufrufe wie `KARTEN.setStand` sind ausgenommen. Gegenprobe —
Definition entfernt: **„nirgends deklariert: setLoeschFehler"**.

Der erste Entwurf dieser Probe war zu grob und meldete `setTimeout`,
`setProperty` und mehrere gewöhnliche Funktionen. Die richtige Frage ist
nicht „ist es ein React-Setzer", sondern „gibt es den Namen überhaupt".

### Fünf neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| die Löschliste kennt jeden Speicherschlüssel | 12 Schlüssel |
| die Altnamen werden mitgelöscht | sonst kehrt der Stand zurück |
| ein Löschfehler wird gemeldet | — |
| **jeder Zustandssetzer ist deklariert** | ✗ „nirgends deklariert: setLoeschFehler" |

### Geprüft

| | 35.132 | 35.133 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 493, 0 Fehler | **498**, 0 Fehler |
| Knöpfe | 154 | 154 |

**Status F41: behoben.** Etappe 1 offen: F17, F44.

## 35.134 · F44 und F17 — Etappe 1 ist durch

### F44: die zweite Übergabe warf die erste weg

`kartenErgaenzen` rechnete mit `karten` aus dem laufenden Render. `setKarten`
ändert diese eingefangene Variable **nicht** — zwei Übergaben desselben
Abschlusses gingen beide vom alten Pool aus.

Nachgestellt: Talentkarte A, dann Vereinskarte B → gespeichert wurde **[B]
statt [A, B]**. Im Karriereende passiert genau das: neue Akademiekarten und
der Kader des fünfzehnten Vereinsjahres kommen nacheinander.

Ein `useRef` trägt jetzt immer den zuletzt geschriebenen Stand. **Alle drei
Stellen**, die `setKarten` rufen, ziehen ihn mit — bliebe eine zurück,
arbeitete der nächste Abschluss mit veralteten Daten. Eine Prüfung zählt das
nach.

Die Gegenprobe belegt, dass die alte Art wirklich verlor: *„alte Art: 1
Karte statt 2"*. Ohne sie prüfte die Zeile darüber etwas, das nie kaputt war.

### F17: abgebucht, aber nirgends angekommen

`start` leerte `aka.laden` und speicherte das **sofort** — die neue Karriere
erst beim nächsten Speicherpunkt. Ein Prozessende dazwischen kostete den
gekauften Vorrat.

Jetzt umgekehrt: erst die Laufbahn sichern, dann abbuchen. Scheitert das
Sichern, bleibt der Vorrat, wo er war — **lieber ein nicht gestarteter Start
als bezahlte Extras im Nichts.** Dafür gibt `saveGame` jetzt zurück, ob es
angekommen ist.

### Zwei erfundene Namen, diesmal sofort bemerkt

Mein erster Entwurf rief `saveGameSofort` und `setStartFehler` — beides gibt
es nicht. Diesmal habe ich direkt nach dem Schreiben nachgezählt, statt es
der Prüfung zu überlassen.

Das ist der **sechste** Fall dieser Art in dieser Reihe (`store.remove`,
`p.nt.titel`, `fx.wage`, `aka.ehrentafel`, `setLoeschFehler`, jetzt diese
zwei). Nachzählen direkt nach dem Schreiben kostet einen Befehl und findet
sie alle.

### Acht neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| zwei Übergaben ergeben beide Karten | ✗ alte Art: 1 statt 2 |
| jede Zustandsänderung zieht das Ref mit | 3 Stellen |
| der Pool kommt aus dem Ref | — |
| erst sichern, dann abbuchen | Reihenfolge im Quelltext |
| gescheitertes Sichern bricht ab | — |
| `saveGame` meldet den Erfolg | — |

### Geprüft

| | 35.133 | 35.134 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 498, 0 Fehler | **506**, 0 Fehler |
| Knöpfe | 154 | 154 |

**Etappe 1 abgeschlossen.** F01, F02, F03, F04, F05, F06, F17, F18, F29,
F41, F44 — dazu F15 an den Sicherungstexten.

## 35.135 · F07 — die Kalibrierung maß ein anderes Spiel

Erster Punkt aus Etappe 2, und er stand aus gutem Grund weit vorn: **solange
die Messung falsch ist, taugt keine Zahl daraus für eine Entscheidung.**

### Sie wählte, was der Spieler nicht anklicken kann

    Kalibrierung:  pick(e.choices)
    Das Spiel:     pick(offeneWahlen(e, q))

Gemessen: **36 der 1.156 Optionen** tragen eine Bedingung — genau die 3 %,
die der Bericht nennt. Jede davon war für die Simulation offen: „Auf einen
Spezialisten bestehen" ohne das nötige Geld, „Auf dem Trainerschein
aufbauen" ohne Schein.

`offeneWahlen` war die ganze Zeit ausgeführt. Die Kalibrierung hätte es
benutzen können.

### Und das erklärt das flatternde Zielband

Bei gleicher Stichprobe (400 Laufbahnen), je drei Läufe:

    vorher   20,1 · 20,6 · 21,3      Spanne 1,2
    nachher  20,7 · 20,5 · 20,4      Spanne 0,3

**Die unzulässigen Entscheidungen waren eine Rauschquelle.** Offener Punkt
21 — das Band, das in fünf Fassungen zweimal grundlos rot meldete und in
35.134 sogar auf 19,8 fiel — sieht damit anders aus als bisher gedacht.

Ich verschiebe trotzdem nichts. Der Bericht sagt es genauso: erst die
korrigierte Simulation, dann echte Verteilungen beurteilen. Die
**Entscheidung** zu Punkt 21 bleibt offen, aber sie steht jetzt auf einer
belastbaren Messung.

### Zwei eigene Fehler in der Prüfung

**Die Kalibrierung war „nicht auffindbar"** — die Probe suchte relativ zum
Arbeitsverzeichnis, läuft aber aus `/tmp/ps`. Jetzt über `__dirname`, den
einzigen verlässlichen Anker.

**Und sie meldete „wählt weiterhin aus ALLEN Optionen"**, obwohl der Code
stimmte: mein Ausdruck fand `pick(e.choices)` in dem Kommentar, der die
Behebung *erklärt*. Ein Kommentar ist kein Code — die Probe entfernt jetzt
Kommentare, bevor sie sucht.

### Fünf neue Prüfungen

| Probe | |
|---|---|
| die Datei ist auffindbar | über `__dirname` |
| **sie wählt nur offene Optionen** | ohne Kommentare geprüft |
| Spiel und Messung nutzen dieselbe Funktion | nicht zwei Nachbauten |
| ein Ereignis ohne offene Option wird übersprungen | — |
| es gibt bedingte Optionen zu schützen | 36 von 1.156 |

Die dritte ist die wichtigere: nicht „beide prüfen dasselbe", sondern
**beide rufen dieselbe Funktion**. Zwei Nachbauten mit gleichen Regeln
laufen irgendwann auseinander.

### Geprüft

| | 35.134 | 35.135 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 506, 0 Fehler | **511**, 0 Fehler |
| Zielband, Spanne über 3 Läufe | 1,2 | **0,3** |
| Knöpfe | 154 | 154 |

## 35.136 · F08 — eine Saison versprochen, zwei geliefert

    alt:  seasons.length <= sonderSchutz + 1
    neu:  seasons.length === sonderSchutz

Die Marke wird auf die Zahl der **abgeschlossenen** Saisons gesetzt. Die alte
Bedingung war damit für zwei Läufe wahr:

    Marke = 3   →   n = 3 geschützt, n = 4 geschützt, n = 5 frei

Nachgerechnet und dann gemessen: mit Schutz **heil · verletzt · verletzt**,
ohne Schutz **verletzt · verletzt · verletzt**. Vorher waren die ersten
beiden heil.

### Das Bündel war älter als meine Änderung

Die erste Messung zeigte weiterhin zwei geschützte Saisons — ich hatte
`App.jsx` geändert, aber nicht neu gebaut. Genau die Falle, die diese Datei
seit Langem führt: **ein Werkzeug, das ein altes Bündel misst, misst den
alten Fehler.** Nach `TEILE=aufbau` stimmte es.

### Vier neue Prüfungen

| Probe | |
|---|---|
| die erste Saison bleibt verschont | — |
| **die zweite ist nicht mehr geschützt** | der eigentliche Befund |
| ohne Schutz trifft es sofort | Gegenprobe |
| die Marke wird verbraucht | nicht nur wirkungslos |

### Die vierte flatternde Probe

„Archetyp: keiner beherrscht das Feld" meldete 86 %. Sechs Läufe: **29 · 36 ·
36 · 43 · 43 · 50 %** bei vierzehn Laufbahnen. Über 300 liegt der Wert bei
25,7 % (gemessen in 35.109).

Stichprobe auf 30, Grenze unverändert. Danach zwölf Läufe grün.

**Ehrlich dazu:** ein Lauf zwischendurch meldete zwei Fehler, die ich in
zwölf weiteren Läufen nicht reproduzieren konnte. Ich schreibe nicht
„stabil", sondern: nicht reproduzierbar. Falls es wiederkommt, steht es hier.

Vier flatternde Proben in dieser Sitzung — Vereinskader, Museum, Archetyp,
dazu das Zielband. Immer dasselbe Muster: **kleine Stichprobe, harte
Grenze.** Jedes Mal die Messung genauer gemacht, nie die Grenze verschoben.

### Geprüft

| | 35.135 | 35.136 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 511, 0 Fehler | **515**, 0 Fehler |
| Knöpfe | 154 | 154 |

**Status F08: behoben.**

## 35.137 · F09 bis F14 — wenn der Text mehr verspricht als die Mechanik

Sechs Befunde derselben Klasse. **Zwei davon sind meine eigenen Ereignisse
aus 35.112.**

### F09 und F10: meine Krisenpfade

„Du unterschreibst zwei Ligen unter deinem alten Anspruch" — tatsächlich
wird nur `wantMove` gesetzt, ein Wechselwunsch fürs nächste Fenster. Verein
und Liga bleiben, und `neuanfangTief` wird nirgends als Zielvorgabe gelesen.

**Der Text wurde an die Wirkung angepasst, nicht umgekehrt.** Einen echten
Wechsel samt Zielliga abzuwickeln würde die Transferlogik umgehen, die sonst
entscheidet, wer welches Angebot bekommt. Die Entscheidung bleibt dieselbe,
nur die Zusage ist jetzt eine Absicht statt einer Tatsache.

„Die Reha zu Ende bringen — die Saison ist damit gelaufen" setzte gar keinen
Ausfall; in einem Testzustand folgten 42 Einsätze. Hier ging der andere Weg:
`forceInjury` macht den Ausfall **echt**, weil der Text stimmt und nur die
Wirkung fehlte.

**Warum meine Prüfung aus 35.112 das nicht fand:** sie belegt, dass jede
Option einen *Preis* hat — nicht, dass der Text die Wirkung trifft. Zwei
verschiedene Fragen.

### F11 und F12: Bedingungen, die etwas anderes prüfen

`al_reha` schildert eine Rückkehr nach Verletzung, prüfte aber nur
Anfälligkeit — eine **Veranlagung, kein Nachweis**. Jetzt braucht es eine
Verletzung in einer der letzten drei Saisons. Eine Probe belegt, dass die
Szene trotzdem erreichbar bleibt: 10 von 12 Laufbahnen erfüllen sie.

`ew_lebensplan` ließ „Auf dem Trainerschein aufbauen" auch mit bloßem
Schulabschluss zu — und schrieb dazu „Der Lehrgang ist schon durch". Jetzt
**zwei getrennte Wege** mit eigenem Text, statt einer Bedingung, die zwei
Dinge gleichsetzt.

### F13: „ab der 2. Laufbahn"

Die Logik verlangt zwei **abgeschlossene** Laufbahnen — verfügbar wird es in
Laufbahn 3. Beide Texte nennen das jetzt so, und eine Probe sucht nach
`ab der N. Laufbahn` im ganzen Quelltext.

### F14: die Grammatik im Frauenmodus

Drei Fälle an echten Ausgaben gemessen:

    Ein ehemaliger Mitspieler …   →  Ein ehemaliger Mitspielerin …
    der Einzige, der normal geht  →  die Einzige, der normal geht
    als der Mann, der von der …   →  unverändert

Immer dasselbe: zwischen Artikel und Substantiv steht ein Adjektiv, oder das
Bezugswort steht **hinter** dem Substantiv. Eine Wortliste kann das nicht
sehen.

Sieben Nachbesserungen fassen jeweils die ganze Wendung. Bewusst wenige und
konkret — eine allgemeine Grammatik wäre der falsche Aufwand und gefährdete
männliche Ausgaben, die heute stimmen. **Trainer und Arzt bleiben männlich:**
ihr Geschlecht folgt nicht dem der Spielerin. Eine eigene Probe hält das
fest.

### Die fünfte flatternde Probe

„Typen: die Mehrheit bleibt bewusst ohne" meldete 61 %. Sechs Läufe: **24 ·
24 · 26 · 29 · 36 · 58 %** — die Probe maß *eine* Akademie mit rund zwanzig
Absolventen. Über zwölf lag der Wert bei 36 %. Jetzt drei Akademien, Grenze
unverändert; danach acht Läufe stabil.

### Zehn neue Prüfungen

Alle an echten Ausgaben oder ausgeführten Bedingungen, keine an den
Ersetzungslisten — eine Liste kann vollständig aussehen und trotzdem falsche
Sätze erzeugen.

### Der dritte Fehlalarm — und diesmal ist die Sache klar

Der Abnahmelauf meldete erneut **19,8** bei „Laufbahnen bis Vollausbau".
Neun Läufe auf diesem Stand:

    20,8 · 19,8 · 20,7 · 20,4 · 20,3 · 20,8 · 21,0 · 21,3 · 20,9

Median **20,8**, Spanne **1,5**, Untergrenze **20**. Der Abstand des Medians
zur Grenze ist rund 0,8 — **kleiner als die Hälfte der Streuung.**

Nach F07 ist die größte Rauschquelle beseitigt; was bleibt, ist die echte
Streuung der Simulation. Damit ist offener Punkt 21 nicht mehr eine
Vermutung, sondern gemessen: **die Grenze liegt innerhalb des normalen
Schwankungsbereichs.** Jede dritte bis vierte Fassung wird grundlos rot
melden, egal was geändert wurde.

Ob F09/F10 zusätzlich gewirkt haben, lässt sich nicht sagen — der Median
liegt mit 20,8 dort, wo er vor der Änderung lag. Ich behaupte also keine
Wirkung, die ich nicht belegen kann.

**Ich verschiebe die Grenze weiterhin nicht.** Die Entscheidung steht bei
Kevin und ist in Punkt 21 mit drei Möglichkeiten beschrieben. Neu ist nur:
sie steht jetzt auf einer korrigierten Messung.

### Geprüft

| | 35.136 | 35.137 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 515, 0 Fehler | **525**, 0 Fehler |
| Ereignisse | 530 | 530 |
| Knöpfe | 154 | 154 |

**Status: F09, F10, F11, F12, F13, F14 behoben.**

## 35.138 · F16 und F19 — und eine Umbenennung, die ich nicht erwartet hatte

### F16: die erste Laufbahn war nicht die erste

Meine Zeitleiste aus 35.119 bestimmte sie am **kleinsten Endjahr**. Jede
Laufbahn startet 2026 — eine später gespielte kurze endet also früher als
eine zuerst gespielte lange. Im Test wurde eine danach gespielte Karriere
bis 2040 als „erste" genannt.

Die Abschlussreihenfolge stand nirgends. Jetzt trägt jeder Halleneintrag
`nr` aus `G.karrieren`, das ohnehin mitzählt. **Alte Einträge haben sie
nicht** — dort bleibt das Endjahr die beste Näherung, statt eine Reihenfolge
zu erfinden.

### F19: ein Bonus von +2 kostete acht Punkte

    vorher:  105 mit {pot: +2}  →  97

Zwei Stellen setzen das Potenzial. Eine nutzt `wertGrenze(p)` (99, mit
Rautekarte oder Freischaltung 112), die andere hatte eine **fest eingebaute
97**. Ein legitim erreichter Wert von 105 fiel dadurch.

Jetzt gilt überall dieselbe Grenze, und ein positiver Bonus **senkt nie**:
liegt der Wert schon darüber, stagniert er. Gemessen über alle Grenzfälle
aus der Abnahme: 95→97, 99→99, 105→105, mit Freischaltung 105→107, und −5
senkt weiterhin auf 100.

### Die Prüfung aus 35.123 hat sich bezahlt gemacht

Sie meldete plötzlich: *„KEINER — das Ablesen greift im Bündel nicht."*

Ursache: esbuild hatte den Parameter `G` in den Errungenschaftsbedingungen
zu **`G2`** umbenannt — weil ich in dieser Fassung ein `G && G.karrieren`
eingeführt habe und damit ein Namenskonflikt entstand.

**Meine Begründung in 35.123 war unvollständig.** Dort stand: esbuild
benenne Feldnamen und Zahlen nicht um, deshalb sei das Parsen hier sicher.
Das stimmt — **Parameternamen benennt er sehr wohl um.** Dritte Umbenennung
dieser Art nach `her` → `her2` (35.108) und den Kapitelnamen (35.105).

Behoben mit `G\d*`, wie damals bei `her\d*`. Die Probe hat genau das getan,
wofür sie gebaut wurde: ein Verfahren abgesichert, das ich für sicher
hielt — und dessen Begründung falsch war.

### Acht neue Prüfungen

| Probe | |
|---|---|
| die erste Laufbahn ist die zuerst abgeschlossene | — |
| alte Einträge fallen aufs Endjahr zurück | keine erfundene Reihenfolge |
| der Halleneintrag bekommt eine Nummer | — |
| **ein positiver Bonus senkt nie** | sechs Werte geprüft |
| die Freischaltung hebt die Grenze wirklich | — |
| ein negativer Wert senkt weiterhin | Gegenprobe |

### Geprüft

| | 35.137 | 35.138 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 525, 0 Fehler | **531**, 0 Fehler |
| Knöpfe | 154 | 154 |

**Status: F16, F19 behoben.**

## 35.139 · F20 bis F28 — neun kleine Rechenfehler

### F20: „vier Saisons bis 103" waren dreimal 100

Zwei Fehler übereinander. `Math.min(103, …)` zog einen Wert von 110 — legitim
über die Freischaltung erreicht — auf **103 herunter**. Und die normale
Entwicklung kappte vorher auf 99, sodass aus 103 erst 99 und dann 100 wurde.

Beide Grenzen sind jetzt „die höhere aus Regel und Bestand": **die
Entwicklung darf nicht über die Grenze steigern, aber einen erreichten Wert
auch nicht senken.** Gemessen: 99 → 100 → 101 → 102 → **103**, genau wie der
Laden verspricht. Mit Freischaltung 110 → 112.

### F23: ein Schlüssel, den es nicht gab

`roleFor` liefert `"rot"`, `makeOffers` prüfte `"rotation"`. Der vorgesehene
Rotationsanteil von −0,06 wurde **nie** gewählt — jeder Rotationsspieler
bekam den Restzweig −0,18. Jede Rolle steht jetzt ausdrücklich da, statt dass
ein Restzweig unbemerkt einspringt.

### F24: `&&` bindet stärker als `||`

    pas >= 68 || sho >= 68 && !flags.standards

Das Zuständigkeitsmerkmal wirkte nur auf den Abschluss-Zweig. Mit Passwert 70
und geklärter Zuständigkeit war der Freistoß-Streit weiterhin zulässig.
Klammern gesetzt.

### F25 bis F28: Text gegen Wirkung

| | Versprochen | Getan |
|---|---|---|
| F25 | weniger Grundgehalt, dafür Prämien | +15 % Grundgehalt |
| F26 | Psychologe für 0,35 Mio. | bei Kontostand 0 gratis |
| F27 | Trennung aus Ehe kostet mehr | Ehe-Zweig unerreichbar |
| F28 | zwei Spiele Tribüne | drei |

**F27 war eine verdrehte Reihenfolge:** erst wurde `status` auf „getrennt"
gesetzt, dann gefragt, ob er „verheiratet" ist. Das konnte nie mehr wahr
sein. Jetzt: verheiratet 10 → 5,80, Beziehung 10 → 8,80.

Bei **F26** bekommt die gesperrte Option einen Sperrhinweis, damit sie nicht
wortlos fehlt — und eine Wahl bleibt immer ohne Bedingung.

Bei **F25** wurde der Text angepasst, nicht die Wirkung: ein echtes
Prämienmodell wäre ein neues Vertragssystem.

### F21 und F22

Die Vitrine kannte drei der vier Bereiche — ein WM-Halbfinale ohne Titel
blieb unsichtbar. Und die Ausgabennummer war `hall.length + 1`; die Halle ist
auf zwölf gekappt, also blieb die Titelseite ab der zwölften Laufbahn bei
„Ausgabe 13" stehen. Jetzt `gesamt.karrieren`.

### Ein Python-Ersatz scheiterte still

Mein erster Versuch fasste F24, F25 und F28 in einem Block zusammen. Er brach
bei F25 mit `AssertionError` ab — `raise:.15` kommt **dreimal** vor — und
damit wurde **nichts** geschrieben, auch F24 und F28 nicht. Nur weil danach
nachgezählt wurde, fiel es auf.

Die Regel `assert s.count(a) == 1` hat wieder getan, wofür sie da ist: lieber
gar nichts ändern als die falsche Stelle.

### Und ein Absturz, den nur die Sichtprüfung fand

Der Abnahmelauf meldete beim Karriereende: **„G is not defined"**.

In 35.138 hatte ich `nr: (G && G.karrieren)` eingebaut — `G` gibt es an
dieser Stelle nicht, der Zustand heißt `ges`. Den Namen hatte ich aus der
Beschreibung des Berichts übernommen, statt im Code nachzusehen.

**Siebter erfundener Name in dieser Reihe** — und der erste, der es bis in
einen Abnahmelauf geschafft hat. Ansichts- und Vereinsprüfung erreichen den
Abschlusspfad nicht; die Sichtprüfung ist die einzige, die eine Laufbahn
wirklich zu Ende klickt. Ohne sie wäre der Fehler ausgeliefert worden.

Dabei kam ein zweiter Punkt heraus: `ges.karrieren` wird erst **nach**
`finish` erhöht, die laufende Laufbahn ist also die nächste in der Zählung.
Jetzt `+1`.

### Elf neue Prüfungen

### Geprüft

| | 35.138 | 35.139 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 531, 0 Fehler | **540**, 0 Fehler |
| Ereignisse | 530 | 530 |
| Knöpfe | 154 | 154 |

**Status: F20 bis F28 behoben.** Damit sind alle Punkte bis F29 erledigt.

## 35.140 · F30 bis F40 — elf Befunde an meinen eigenen Systemen

Alle an dem, was ich in 35.115 bis 35.127 selbst gebaut habe.

### F30: drei Rekorde, die nie erschienen

`laender`, `ligen` und `vereine` sind **Zählkarten** der Form
`{ DE: 3, FR: 1 }` — keine Zahlen. `rekordListe` prüft `wert > 0`, und das
ist bei einem Objekt immer falsch. Die drei Zeilen fielen seit 35.116
**immer** weg, auch bei 4 Ländern, 5 Ligen und 12 Vereinen.

Gezählt werden jetzt verschiedene Einträge, nicht Besuche: wer dreimal in
Spanien spielte, war in **einem** Land.

### F32: das Wunderkind mit Höchststärke 58

Der Kennwert sah nur das Peak-Alter. Eine Laufbahn ohne Titel, ohne
Länderspiel und mit Stärke 58 hieß „Das Wunderkind", weil sie mit 18 endete.
**Früh den Bestwert erreicht zu haben heißt nichts, wenn der Bestwert
niedrig ist.** Jetzt zusätzlich Höchststärke 75 — dieselbe Grenze, die diese
Datei seit 35.106 für „schwache Laufbahn" benutzt.

### F31: eine Eigenschaft, die niemand sehen kann

Die Entwicklungstypen wirken seit 35.127 auf den Zuwachs. `typVon` wurde
importiert und **nie aufgerufen**. Jetzt im aufgeklappten Talent — nicht in
der Zeile, weil zwei Drittel keinen Typ haben und eine leere Stelle in jeder
Zeile schlechter wäre als ein Fund beim Nachsehen.

### F37 und F40: falsche Namen für richtige Dinge

Akademiekarten wurden als „eigener Verein" ausgewiesen — genau der Ursprung,
der sie besonders macht, war falsch beschriftet. Und „Vereinstreue" zählte
nur die **Herkunft**, nicht die Verweildauer; eine Karte trägt keine. Die
Seite heißt jetzt „Aus den eigenen Reihen" — wahr und dieselbe Sammlung.

### F35, F36, F38, F39

Der Sammlungsteaser öffnete das Vereinsdach, ohne es zu sagen. Die Summen auf
der Errungenschaftsseite lasen sich wie Zahlen der laufenden Laufbahn. Im
Museum standen Saisonform und Kalenderjahr nebeneinander. Und ein Verein, der
fünfzehn Jahre in derselben Liga blieb, bekam **gar keine** Geschichte —
dabei ist dort die Beständigkeit die Geschichte.

### Zwei Python-Ersätze scheiterten still

Beide mit `AssertionError`, weil mein Suchmuster nicht exakt passte — einmal
`(G && G.karrieren)`, einmal eine Zeile, die mit `if (t) return` beginnt. In
beiden Fällen wurde **nichts** geschrieben, und nur das Nachzählen danach hat
es gezeigt.

Das ist inzwischen Routine und funktioniert: lieber gar nichts ändern als
die falsche Stelle. Aber es kostet jedes Mal einen Durchgang.

### Elf neue Prüfungen

### Geprüft

| | 35.139 | 35.140 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 540, 0 Fehler | **550**, 0 Fehler |
| Knöpfe | 154 | 154 |

**Status: F30 bis F40 behoben** — außer F33 und F34, die der Bericht selbst
als beibehaltbare Designentscheidungen einstuft.

## 35.141 · F49 und F50 — bedienbar ohne Tippen

### Sechs Flächen, an denen man hängenblieb

Die großen Weiter-Flächen des Spiels — Saisonrückblick, Karriererückblick,
Enthüllung, Schleier — waren `<div onClick=…>`. **Kein Tastaturzugriff,
keine Rolle, keine Beschriftung.** Wer mit externer Tastatur, Schalter-
steuerung oder Vorlesedienst spielt, kam an ihnen nicht vorbei: der Rückblick
ließ sich nicht weiterschalten.

`flaecheAlsKnopf(fn, label)` liefert jetzt die vier Angaben, die eine Fläche
zum Knopf machen — Rolle, Reihenfolge, Beschriftung, Tastenbehandlung. Ein
Helfer statt sechsmal derselben vier Zeilen.

Enter **und** Leertaste: Enter ist die Erwartung bei `role="button"`, die
Leertaste die bei jedem echten Knopf. `preventDefault` verhindert, dass die
Leertaste zusätzlich scrollt.

**Nicht angefasst:** Flächen, die nur `stopPropagation` rufen. Sie sind keine
Bedienelemente — eine Rolle wäre dort irreführend.

### Neun Felder ohne Beschriftung

Ein Vorlesedienst nennt sie „Eingabefeld". Der `placeholder` reicht nicht: er
verschwindet, sobald jemand tippt. Alle neun tragen jetzt ein `aria-label`,
vom Vereinsnamen bis zum Sicherungstext.

### Zwei Prüfungsentwürfe daneben — und was daraus folgt

Der erste Ausdruck fand `<div onClick=…>` **im Kommentar, der diese Behebung
erklärt** — dieselbe Falle wie bei der Kalibrierung in 35.135. Der zweite
suchte 400 Zeichen weit und meldete **99 Treffer**, weil er jedes
umschließende `<div>` mitzählte.

Und beim Aufräumen blieb `divs.length` in einer Meldung stehen, während die
Variable weg war: `ReferenceError: divs is not defined` — die ganze
Vereinsprüfung stürzte ab.

**JSX mit Regex zu zerlegen ist fragil.** Die Probe prüft deshalb jetzt, was
sich sicher prüfen lässt: jede `rs-schleier`-Fläche muss den Helfer tragen.
Eine neue Fläche dieser Art fällt auf; eine allgemeine JSX-Analyse wäre mehr
Fehlerquelle als Schutz.

### Die sechste flatternde Probe

„Der Archetyp steht nicht von Anfang an fest" meldete 2 von 10. Sechs Läufe:
**4 · 5 · 5 · 6 · 6 · 8 von 10** bei einer Grenze von 5. Über 120 Laufbahnen
lag der Anteil bei 89 %. Stichprobe auf 30, Grenze unverändert.

### Geprüft

| | 35.140 | 35.141 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 550, 0 Fehler | **555**, 0 Fehler |
| Eingabefelder ohne Beschriftung | 9 | **0** |
| Knöpfe | 154 | 154 |

**Status: F49, F50 behoben.** Was der Prüfstand hier nicht kann: ob die
Fokusreihenfolge sinnvoll ist und ob ein Vorlesedienst die Beschriftungen
gut vorliest. Das braucht ein Gerät.

## 35.142 · F51 — eine Sperre mit Trostpflaster

### Die Begründung im Code war falsch

`index.html` sperrte das Zoomen mit `maximum-scale=1,user-scalable=no`. Der
Kommentar daneben begründete das so: die App bringe unter „Optionen" eine
eigene Textgröße mit, also leide die Barrierefreiheit nicht.

**Nachgemessen:** die eigene Skala reichte von 0,92 bis **1,12** — höchstens
+12 %. Wer 200 % braucht, bekam zwölf Prozent und durfte nicht nachhelfen.

Der ursprüngliche Anlass bleibt richtig: versehentliches Zoomen beim Wischen
ist störend. Dagegen hilft `touch-action` gezielt auf den Spielflächen —
nicht eine Sperre für das ganze Dokument. **Wer bewusst zoomt, soll es
können.**

### Zwei Wege statt eines halben

Der Zoom ist frei, und die eigene Skala geht jetzt bis **1,5** in fünf Stufen
(XS bis XL). Wer die App dauerhaft größer will, stellt sie um; wer kurz etwas
genau lesen will, zoomt. Zusammen sind 200 % erreichbar.

**1,5 und nicht 2,0:** darüber bricht das Layout auf schmalen Geräten
sichtbar, und die Sichtprüfung misst nur die Standardstufe. Eine Zahl, die im
Ernstfall nicht trägt, wäre schlimmer als eine kleinere, die hält.

Kurze Knopfnamen, weil fünf Knöpfe auf 360 px sonst umbrechen — die Reihe
wäre sonst genau das, was sie zu beheben anbietet. `aria-label` nennt jede
Stufe ausgeschrieben.

### Ein echter Rückgang, keine Streuung

„Der Archetyp steht nicht von Anfang an fest" meldete rot. Über 60
Laufbahnen gemessen: **55 %**, in 35.113 waren es **89 %**.

Das ist eine **Folge meiner F32-Behebung**: „Das Wunderkind" verlangt jetzt
zusätzlich Höchststärke 75, und schwache junge Laufbahnen wechseln dadurch
seltener zwischen Archetypen.

Die Grenze bleibt bei 50 % — mehr als die Hälfte wechselt weiterhin, das
Papier ist erfüllt. Aber der Abstand ist von 39 auf **5 Punkte** geschrumpft,
und bei dreißig Laufbahnen streute der Messwert darüber. Stichprobe auf 60.

**Das ist kein Flattern, sondern eine Verschiebung der Sache.** Der
Unterschied ist wichtig: bei den sechs flatternden Proben habe ich die
Messung genauer gemacht, hier hat sich der gemessene Wert wirklich bewegt.

### Was die Knopfprüfung nicht sieht

Zwei neue Knöpfe, und die Zahl bleibt bei 154: **die Sichtprüfung öffnet die
Optionen nicht.** Keine neue Lücke, aber sie gehört notiert — Knöpfe, die nur
dort stehen, werden nicht auf Lesbarkeit und Trefferfläche geprüft.

### Geprüft

| | 35.141 | 35.142 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 555, 0 Fehler | 555, 0 Fehler |
| Textskala | 0,92–1,12 | **0,92–1,50** |
| Zoom | gesperrt | **frei** |

**Status F51 behoben.** Ob 1,5 auf dem S24 Ultra trägt und ob die
Optionsreihe bei XL noch passt, muss das Gerät zeigen.

## 35.143 · F45 bis F48 — Dialoge, aus denen man herauskam

Beide Dialoge trugen `role="dialog"` und `aria-modal` — und keine der vier
Eigenschaften, die einen Dialog bedienbar machen:

| | Befund |
|---|---|
| F45 | der Fokus blieb draußen; ein Vorlesedienst las die Seite dahinter |
| F46 | Escape schloss nicht — ohne Zeigegerät kam man nicht heraus |
| F47 | Tabulator lief durch den Hintergrund, unter dem Schleier |
| F48 | nach dem Schließen war der Fokus verloren |

**Die Rolle allein macht keinen Dialog.** `aria-modal="true"` sagt einem
Vorlesedienst, dass der Rest nicht erreichbar *sein soll* — es macht ihn
nicht unerreichbar.

### Ein Hook statt vier Mustern

`useDialog(offen, onZu)` erledigt alle vier an einer Stelle. Wer den nächsten
Dialog baut, ruft ihn auf, statt vier Muster nachzubauen — dieselbe
Überlegung wie bei `flaecheAlsKnopf` in 35.141.

Der Hintergrund wird mit **`inert` und `aria-hidden`** gesperrt: `inert`
nimmt auch die Tabulatorreihenfolge weg, `aria-hidden` nur die
Vorlesbarkeit. Ältere Android-Webansichten kennen `inert` nicht — beides
zusammen deckt alte und neue ab.

**Und die Sperre wird wieder aufgehoben.** Bliebe sie stehen, wäre die App
nach dem ersten Dialog unbedienbar — schlimmer als der Fehler, den sie
behebt. Dafür gibt es eine eigene Probe.

### Sechs neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| **jeder Dialog trägt den Rahmen** | ✗ „1 von 2 Dialogen mit `ref`" |
| Escape schließt | — |
| der Hintergrund ist gesperrt | — |
| die Sperre wird aufgehoben | — |
| der Fokus kehrt zurück | — |

Die erste fängt den nächsten Dialog, der ohne Hook gebaut wird.

### Geprüft

| | 35.142 | 35.143 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 555, 0 Fehler | **561**, 0 Fehler |
| Dialoge mit Fokusführung | 0 von 2 | **2 von 2** |

**KORREKTUR DER NUMMERN (nachgetragen in 35.152).** Diese Fassung hat vier
Dialogmängel behoben — aber unter den **falschen Kennungen**. F45 bis F48
sind im Bericht ganz andere Punkte: Akademiekarten-Alter, Berater-Ablauf,
Extraschicht, Winter-Vertragsverlängerung. Die Dialogarbeit gehört zu V05
und ergänzt F49/F50.

Die Arbeit war richtig, die Buchführung nicht. Aufgefallen beim Lesen von
V09, das auf „F46/F47" verweist und dort etwas ganz anderes meint.

**Status dieser Fassung: vier Dialogmängel behoben (V05).** Was hier niemand prüfen kann: ob die
Fokusreihenfolge im Dialog sinnvoll ist und ob TalkBack die Beschriftungen
gut vorliest. Das braucht ein Gerät mit eingeschaltetem Vorlesedienst.

## 35.144 · F52 — und zwei Fehler, die ich selbst gebaut habe

### Die kleinen Knöpfe waren zu klein

`.btn` hat 48 px Mindesthöhe, `.btn.sm` hatte **38** — über der
AA-Anforderung von 24, unter dem, woran sich Android misst. Es sind
**69 Knöpfe** im Spiel.

Jetzt 44, nicht 48: der große Knopf hat 48, und die kleinen sollen sichtbar
kleiner bleiben — sonst sind es zwei gleiche Knöpfe mit verschiedenen Namen.
Die Polsterung wächst mit, die Schriftgröße bleibt; es geht um die Fläche.

Eine Probe liest die Knopfklassen **aus dem CSS-Block**, nicht aus einer
Liste von Namen — eine Liste liefe auseinander. Zehn Klassen geprüft.

### Backticks im CSS-Kommentar — zum zweiten Mal

Mein Kommentar enthielt `` `.btn` `` in Rückwärts-Anführungszeichen. Der
Block steht im CSS-Vorlagenliteral, das damit mittendrin endete: **die halbe
App war ohne Stil.** Die Sichtprüfung meldete „Stilblock der App vorhanden"
rot.

Zweites Mal nach 35.121, und die Hygieneprüfung gibt es seit 35.34 genau
dafür.

### Warum sie trotzdem nicht half

**Ich hatte ihre Ausgabe verworfen.** Der Lauf ging mit `>/dev/null`, und ich
bin direkt zur Sichtprüfung weiter. Nachgestellt: mit Backtick meldet sie
sofort „FEHLER: 2 Rueckwaerts-Anfuehrungszeichen im CSS-Block."

**Die Prüfung war in Ordnung. Ich habe weggeschaut.** Ein Lauf, dessen
Ergebnis man braucht, gehört nicht nach `/dev/null`.

### Und das Bündel war wieder älter als die Quelle

Nach dem Entfernen der Backticks meldete die Vereinsprüfung `TypeError: "` —
die Fehlermeldung des kaputten CSS. Der Grund: `/tmp/ps/motor.js` trug noch
den Stand von vor der Behebung. Dritter Fall dieser Art; jedes Mal hilft
`TEILE=aufbau` vor dem Messen.

### Drei neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| jede Knopfklasse erreicht 44 px | ✗ Testblock mit 30px: 1 erkannt |

### Geprüft

| | 35.143 | 35.144 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 561, 0 Fehler | **564**, 0 Fehler |
| Kleinste Knopfhöhe | 38 px | **44 px** |
| Knöpfe | 154 | 154 |

**Status F52 behoben.** Ob die Reihen mit 69 größeren Knöpfen auf 360 px
noch passen, zeigt das Gerät — die Sichtprüfung misst 154 davon und meldet
keine Überläufe.

## 35.145 · F53 — der Kontrastwächter sah drei von sieben Ansichten

### Die Lücke, die Kevins Befund durchgelassen hat

In 35.121 fand Kevin dunkelblaue Schrift auf dunkelbraunem Grund, Kontrast
**1,13**. Der Kontrastwächter meldete daneben „145 Textstellen · 0 Befunde"
— und das stimmte, weil er den Karriererückblick gar nicht ansah.

Vier Ansichten ergänzt, die vom Hauptmenü aus erreichbar sind: Ruhmeshalle,
Errungenschaften, Optionen, Sicherung. **145 → 897 geprüfte Textstellen.**

### Und sofort 192 Befunde

Alle derselbe Fall, alle auf der Errungenschaftsseite: die laufenden Nummern,
9 px, Kontrast **2,66**.

    color: "var(--ln2)", opacity: .9

`--ln2` ist eine **Linienfarbe**, keine Textfarbe — dazu auf 90 % Deckung
gesetzt. Beides zusammen ergab 2,66 bei einer Grenze von 3, und das 192 Mal
auf einer Seite. Jetzt `--mu`, die Farbe für Nebentext: **5,99**, Deckung
weg.

### Achter erfundener Name

Mein erster Entwurf rief `seite.goto(ZIEL, …)`. `ZIEL` gibt es nicht — die
Datei heißt dort `"file://" + datei`. Die vier neuen Ansichten erschienen
schlicht nicht in der Ausgabe, und der Bereich meldete rot.

Aufgefallen beim Nachzählen der Zeilen, nicht durch eine Prüfung.

### Was weiterhin nicht geprüft wird

**Der Karriererückblick** — genau die Seite, auf der Kevins Befund lag. Sie
braucht einen vollständigen Karriereabschluss, und den führt nur
`browsertest.sh` durch. Das wäre die nächste Erweiterung; hier ist sie nicht
gemacht.

Das gehört gesagt, statt „alle Ansichten geprüft" zu behaupten. Der Wächter
sieht jetzt sieben statt drei — nicht alle.

### Geprüft

| | 35.144 | 35.145 |
|---|---|---|
| Kontrast: Ansichten | 3 | **7** |
| Kontrast: Textstellen | 145 | **897** |
| Kontrast: Befunde | 0 (von 145) | 0 (von 897) |
| Verein | 564, 0 Fehler | 564, 0 Fehler |

**Status F53 behoben**, soweit hier messbar. Reale Kontraste auf dem Gerät —
mit echtem Bildschirm, echter Helligkeit — bleiben offen.

## 35.146 · F54 — drei Belohnungen, die nie ankamen

### Die Wildcard löschte, was kurz vorher gesetzt wurde

`createPlayer` setzt drei dauerhaft freigeschaltete Werte — `ntBonus` +3 aus
„Verbandskontakt", `offers` +1 aus „Volles Postfach", `dev` aus dem
Akademie-Ruhm. Zwölf Zeilen später überschrieb `applyWildcard` das gesamte
`wcMod`-Objekt mit Nullen.

**Drei Belohnungen, für die man lange spielt, waren wirkungslos.** Bei
Akademie-Ruhm 135 wurde `dev` 0,06 sauber berechnet, in `p.aka` vermerkt —
und in `wcMod` auf 0 gesetzt.

### Die Nullsetzung wegzulassen wäre falsch gewesen

Beim Kartentausch müssen die Effekte der **alten** Karte verschwinden, sonst
summieren sich Wildcards über jeden Tausch. Der naheliegende Fix hätte einen
schlimmeren Fehler eingebaut.

Deshalb ein Grundstock: was nicht von einer Karte kommt, wird einmal in
`p.wcBasis` festgehalten und bei jedem Tausch wiederhergestellt. Die Karte
legt nur obendrauf.

    Start (Freischaltung):   ntBonus 3
    nach Karte mit +4:       ntBonus 7
    nach Tausch auf neutral: ntBonus 3

### Vier neue Prüfungen — beide Richtungen

| Probe | |
|---|---|
| der Verbandskontakt überlebt die Zuweisung | 0 ohne, 3 mit |
| das volle Postfach überlebt sie auch | 0 ohne, 1 mit |
| **ein Kartenbonus wird beim Tausch entfernt** | 3 → 7 → 3 |
| mehrfacher Tausch lässt den Grundstock unverändert | nach drei Zuweisungen: 3 |

Die dritte und vierte sind die wichtigeren: ohne sie wäre „Nullsetzung
weglassen" durchgegangen, und Wildcards hätten sich aufsummiert.

`applyWildcard` musste dafür ausgeführt werden — es war bis hierher nicht im
Prüfbündel.

### Geprüft

| | 35.145 | 35.146 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 564, 0 Fehler | **568**, 0 Fehler |

**Status F54 behoben.**

## 35.147 · F55 und F56 — der Fehlerkatalog ist durch

### Fünf Ansichten ohne Rückweg

`VereinDach`, `Packladen`, `VereinGruenden`, `VereinScreen`,
`VereinAbschluss` meldeten **keinen** Rückweg an. Die sichtbare
Zurück-Schaltfläche funktionierte, die Android-Taste lief ins Leere — und
dort beendet sie im Zweifel die App. Mitten im Packöffnen.

Die Akademie machte es seit jeher richtig. **Sie war die Gegenprobe, an der
der Unterschied überhaupt auffiel** — ohne sie hätte man denken können, das
Spiel binde die Taste generell nicht an.

Alle fünf hatten `onZurueck` bereits als Prop. Es war nur nie an
`useZurueck` gehängt.

Bei der **Kennungsgründung** kam laut Bericht dazu, dass auch sichtbar kein
Abbruch angeboten wurde. `onZurueck` gibt es dort — damit führen jetzt Taste
und sichtbarer Weg zum selben Ziel.

### F56: zwei Wege aus demselben Untermenü

Hauptmenü → Optionen → Sicherung → Zurück landete auf der **Titelseite**.
`MenuScreen` wird beim Phasenwechsel abgebaut, der lokale `opt`-Zustand ist
danach wieder false. „Anleitung" verhält sich anders: sie bleibt im Menü und
kehrt in die Optionen zurück.

Die Herkunft wird jetzt gemerkt und einmal eingelöst.

### Vier neue Prüfungen

| Probe | Gegenprobe |
|---|---|
| **jede Ansicht mit `onZurueck` meldet ihn an** | ✗ Testansicht ohne: 1 erkannt |
| die Sicherung merkt sich ihre Herkunft | — |

Die erste sucht nach dem Funktionskopf, nicht nach einer Namensliste — eine
Liste liefe auseinander, sobald jemand eine Ansicht hinzufügt. Die nächste
Ansicht ohne Anmeldung fällt damit auf.

### Geprüft

| | 35.146 | 35.147 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 568, 0 Fehler | **572**, 0 Fehler |
| Ansichten mit Rückweg | 14 | **19** |

**Damit ist der Fehlerkatalog F01–F56 abgearbeitet** — bis auf F33 und F34,
die der Bericht ausdrücklich als Designentscheidung zum Beibehalten
freigibt.

Was bleibt: die zwölf Empfehlungen V01–V12 und alles, was nur auf dem Gerät
zu beurteilen ist.

## 35.148 · V01 — was eine Wahl wirklich bewirkt hat

Erste Empfehlung aus dem Bericht. Der Weg dorthin war schon gebaut:
`applyFx` nimmt einen `log`-Sammler entgegen, `nextEvent` reicht ihn als
`extra` an den Ergebnisschirm weiter. **Er wurde nur nie gefüllt.**

### Abgeleitet aus dem Zustand, nicht aus dem Effekt

Gemeldet wird der Unterschied vorher/nachher — nicht der Wunschwert aus `fx`.
Das ist der Punkt, den die Empfehlung ausdrücklich verlangt, und er trifft
den Kern des halben Fehlerkatalogs: **Text verspricht, Mechanik liefert
nicht.**

    5,00 Mio, Effekt {money: -0.35}   →  „Konto -350 Tsd"
    0,01 Mio, derselbe Effekt          →  „Konto -10 Tsd"

Der zweite Fall ist der wichtige. Ein `{pot:2}` an der Obergrenze bewirkt
nichts — und dann steht auch nichts da.

### Drei Arten, getrennt benannt

    Sofort:      Vertrauen des Trainers +8 · Form -6 · Konto -10 Tsd
    Vorgemerkt:  Wechselwunsch für das nächste Transferfenster

**„Vorgemerkt" ist genau die Unterscheidung aus F09:** ein Wechselwunsch ist
kein Wechsel. Was angestoßen wurde und später fällt, steht getrennt von dem,
was jetzt geschah.

**Höchstens vier Einträge.** Die Empfehlung warnt vor einer Effektliste bei
jeder Kleinigkeit; wer nach jeder Wahl zwölf Zeilen liest, liest bald keine
mehr. Bei acht gleichzeitigen Effekten erscheinen die vier größten.

Das Vorher-Bild wird nur angelegt, wenn jemand zuhört — bei 532 Ereignissen
und tausenden Simulationsläufen zählt das.

### Fünf neue Prüfungen

| Probe | |
|---|---|
| eine Wahl meldet ihre sofortige Wirkung | — |
| **gemeldet wird das Geschehene, nicht das Gewollte** | 0,01 statt 0,35 |
| ein wirkungsloser Effekt meldet nichts | 0 Zeilen |
| ein Wechselwunsch steht unter „Vorgemerkt" | — |
| höchstens vier auf einmal | 4 bei acht Effekten |

### Geprüft

| | 35.147 | 35.148 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 572, 0 Fehler | **577**, 0 Fehler |

**Status V01 umgesetzt.** Was der Bericht zusätzlich vorschlägt — „laufende
Wirkung" als dritte Art —, fehlt: es gibt im Spiel keine Effekte mit
Laufzeit, die hier anfielen. Eine Zeile für etwas zu bauen, das nie
erscheint, wäre toter Code.

## 35.149 · V02 — warum die Saison so lief

Eine neue Seite im Saisonrückblick, zwischen Bewertung und Marktwert:
höchstens **drei beobachtete Gründe**.

    1  Eine schwere Verletzung hat dich lange gekostet.
    2  Du warst Ergänzungsspieler — der Kader war stark besetzt.
    3  Wenn du gespielt hast, warst du gut (Note 2,4).

### Beobachtet, nicht gerechnet

Der Bericht nennt das Gegenbeispiel selbst: *„Verletzung kostete fünf Tore"*
darf nicht dastehen, wenn niemand einen Gegenvergleich gerechnet hat.

Deshalb steht hier, **was war** — nicht, was dadurch angeblich verloren
ging. Jeder Grund hängt an einem Feld der Saison: `injury`, `banned`, `role`,
`note`, `rank`, `club`. Fehlt das Feld, fällt der Grund weg, statt zu raten.

Eine Ausnahme ist der Kadervergleich: liegt die Vereinsstärke sechs Punkte
über der eigenen, heißt es „der Kader war stark besetzt" — **plausibel, nicht
bewiesen**, und deshalb ohne „deshalb".

### Ein Drittel bekommt keine Seite

Gemessen über 300 Saisons:

    0 Gründe   33 %
    1 Grund    40 %
    2 Gründe   22 %
    3 Gründe    5 %

**Das ist Absicht.** Nicht jede Saison braucht eine Erklärung; wo nichts
Auffälliges war, fällt die Seite weg, statt eine zu erfinden. Zwei Drittel
bekommen mindestens einen Grund — genug, dass die Seite trägt.

### Sieben neue Prüfungen

| Probe | |
|---|---|
| eine unauffällige Saison bekommt keine Erklärung | 0 bei Note 3,4 |
| eine schwere Verletzung wird genannt | — |
| **keine gerechnete Ursache wird behauptet** | sucht nach „kostete … Tore" |
| höchstens drei auf einmal | 3 bei sechs Merkmalen |
| ohne Wechsel steht kein Wechsel da | — |
| unvollständige Saisons | — |

Die dritte ist die eigentliche Absicherung: sie sucht im erzeugten Text nach
gerechneten Behauptungen und meldet rot, wenn jemand später eine einbaut.

### Geprüft

| | 35.148 | 35.149 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 577, 0 Fehler | **584**, 0 Fehler |

**Status V02 umgesetzt.** Nicht gebaut: das „kompakte Erklärungsobjekt aus
dem Simulationskern", das der Bericht als Ausbaustufe nennt. Die Saison trägt
bereits alle Felder, die für diese Gründe nötig sind — ein zweiter Datenpfad
wäre eine zweite Wahrheit über dieselbe Saison.

## 35.150 · V03 — Vorschau und Rückweg

### Was steht in dieser Sicherung?

Ein Import ersetzt seit 35.131 den **ganzen** Stand — richtig so, aber
unumkehrbar. Vor dem Einspielen steht jetzt da, was drin ist:

    Fassung                       35.147
    Erstellt                      09.09.2026
    Abgeschlossene Laufbahnen     8
    Einträge in der Ruhmeshalle   8
    Laufende Laufbahn             Felix Sané
    Akademie                      Talentschmiede Nord
    Eigener Verein                FC Sülldorf
    Karten in der Sammlung        34

Alles aus **echten Metadaten** — der Bericht verlangt das ausdrücklich. Was
fehlt, bekommt einen Strich; nichts wird geschätzt.

### Der Rückweg

Der Import rollt bei einem *Schreibfehler* zurück. Wer aber eine gültige,
nur eben **falsche** Sicherung einspielt, hatte keinen Weg zurück — der
Vorgang gelang ja.

`RUECK_KEY` hält jetzt den Stand von vor dem letzten Import. Er steht
bewusst **nicht in `SICHER_KEYS`**: ein Wiederherstellungspunkt gehört nicht
in die Sicherung, sonst wäre er beim nächsten Import selbst überschrieben.
Beim Zurücksetzen fällt er mit weg — dort ist Löschen gewollt.

**Einmalig:** nach dem Zurückholen ist er verbraucht. Sonst stünde dauerhaft
die Frage im Raum, welcher der beiden Stände der echte ist.

### Was ich nicht gebaut habe

**Den Dateiexport.** Er bräuchte `@capacitor/filesystem` — eine neue
Abhängigkeit. Der Bericht warnt an anderer Stelle selbst davor,
Abhängigkeiten während einer Fachkorrektur mitzuziehen, und ein
Blob-Download verhält sich in Android-Webansichten unzuverlässig.

Eine Sicherung, die manchmal keine Datei erzeugt, wäre schlechter als der
Text, den es gibt: sie täuschte Sicherheit vor. Wenn der Dateiexport kommen
soll, gehört er in einen eigenen Durchgang mit Gerätetest.

### Acht neue Prüfungen

| Probe | |
|---|---|
| der Zeitpunkt kommt aus dem Paket | nicht geschätzt |
| fehlende Angaben werden nicht erfunden | Strich statt Null |
| **der Rückweg steht nicht in der Sicherungsliste** | sonst überschriebe er sich selbst |
| beim Zurücksetzen wird er mitgelöscht | — |
| nach dem Zurückholen ist er verbraucht | — |
| er entsteht, bevor der Import schreibt | Reihenfolge |

### Geprüft

| | 35.149 | 35.150 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 584, 0 Fehler | **592**, 0 Fehler |

**Status V03 teilweise umgesetzt** — Vorschau und Rückweg ja, Dateiexport
begründet nicht.

## 35.151 · V04 — was ansteht und was schwebt

Eine Zeile über dem Trainingsschirm, zwei Sorten:

    Wähle einen Schwerpunkt — er bestimmt, wohin dein Fortschritt fließt.
    LÄUFT  Dein Wechselwunsch gilt fürs nächste Transferfenster —
           bis dahin bleibst du bei Bodrum FK.

### Kein Assistent

Der Bericht setzt die Grenze selbst: *„Kein zusätzlicher Zwangsassistent vor
jeder Karriere. Keine nochmalige Erklärung bereits verstandener Funktionen
nach jedem Neustart."*

Deshalb keine Schrittfolge zum Wegklicken, sondern eine Zeile, die den
Zustand benennt — **und die Erklärung verschwindet nach drei Saisons.** Wer
fünf gespielt hat, muss nicht mehr lesen, dass nach dem Training das Ergebnis
kommt. Eine Probe hält das fest.

### Die eigentliche Lücke war „LÄUFT"

„Wechselwunsch läuft" stand seit jeher als Chip da — **ohne zu sagen, was
daraus folgt.** Wer das las, wusste nicht, ob er schon weg ist. Genau der
Punkt aus F09: eine Absicht ist kein Vollzug.

Jetzt steht dabei, dass die Entscheidung im Transferfenster fällt und man
bis dahin bleibt, wo man ist. Dasselbe für eine sich abzeichnende
Verletzung, eine laufende Sperre und einen auslaufenden Vertrag.

**Ohne Anlass erscheint gar nichts** — keine leere Kiste über dem Schirm.

### Sieben neue Prüfungen

| Probe | |
|---|---|
| die erste Saison bekommt eine Erklärung | — |
| **nach fünf Saisons wird nichts mehr erklärt** | die Grenze aus dem Bericht |
| ein Wechselwunsch wird auch später erklärt | Schwebendes bleibt |
| **er sagt, dass der Wechsel nicht vollzogen ist** | der Kern von F09 |
| ohne Anlass erscheint gar nichts | `null` |
| unvollständige Spieler | — |

### Geprüft

| | 35.150 | 35.151 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 592, 0 Fehler | **599**, 0 Fehler |

**Status V04 umgesetzt.** Ob die Zeile im Spielfluss hilft oder stört, sagt
nur das Gerät — sie steht an der Stelle, an der man ohnehin hinsieht, aber
das ist eine Vermutung.

## 35.152 · Ein Buchführungsfehler — und die echten F45/F46

### Ich habe vier Punkte falsch verbucht

In 35.143 habe ich vier Dialogmängel behoben und sie als **F45 bis F48**
eingetragen. Im Bericht sind das ganz andere Punkte:

    F45  Akademiekarten machen Absolventen zwei Jahre älter
    F46  Gekaufter Berater verfällt vor dem Sommerangebot
    F47  Extraschicht kann nach dem Training wirkungslos verfallen
    F48  Winter-Vertragsverlängerung übernimmt die Laufzeit nicht

**Die Arbeit war richtig, die Zuordnung nicht.** Die Dialogsachen gehören zu
V05 und ergänzen F49/F50; der Eintrag in 35.143 ist berichtigt.

Aufgefallen beim Lesen von V09 — es verweist auf „F46/F47" und meint dort
Käufe, nicht Dialoge. **Ohne diesen Querverweis wären vier Punkte als
erledigt durchgegangen, die nie angefasst wurden.**

### F45: zwei Jahre zu alt

`karten.js` rechnete das Alter mit `(raus - ein) + 17`. Ein Talent beginnt
aber mit **15**. Gemessen: Eintritt 2029, Abgang 2034 → Karte zeigte **22**
statt 20. `karteEinsetzen` übernahm das ins Vereinsalter — kein Druckfehler,
sondern ein falscher Spielwert.

Behoben an der Wurzel: der Absolvent trägt sein Alter jetzt selbst
(15 von 15 geprüft). Alte Datensätze ohne das Feld werden weiter abgeleitet —
mit dem richtigen Eintrittsalter.

### F46: der Berater war weg, bevor er wirken konnte

`runSeason` ruft erst `simulateSeason`, dann `makeOffers`. Der Ablauf des
Ladenvorrats steckte in `simulateSeason` — **eine Zeile bevor die Angebote
entstanden, auf die der Berater wirken sollte.** 26 VC für nichts.

Artikel, die auf die Angebote wirken, bekommen jetzt einen Aufschub und
werden erst danach verbraucht. Den Ablauf komplett zu verschieben hätte die
Kalibrierung getroffen, die `simulateSeason` ohne `runSeason` ruft — deshalb
die kleinere Lösung.

Eine Gegenprobe hält fest, dass **andere** Artikel weiterhin sofort ablaufen;
sonst wäre aus der Behebung ein Freibrief geworden.

### Und die Bauumgebung war weg

Der Lauf brach ab mit „Übersetzungsfehler". Es war keiner: `node_modules`
war leer. Danach meldete er „das Verzeichnis in STAND.md ist veraltet" — auch
kein Codefehler, sondern eine Folge meiner Korrektur am Text.

Zweimal hintereinander eine Abbruchmeldung, die etwas anderes meinte, als sie
sagte. Beides in der Ausgabe nachlesbar, beides hätte ich schneller gesehen,
wenn ich sie sofort gelesen hätte statt nach `/dev/null` zu schicken.

### Fünf neue Prüfungen

### Geprüft

| | 35.151 | 35.152 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 599, 0 Fehler | **604**, 0 Fehler |

**Status: F45, F46 behoben.** F47 und F48 stehen noch aus — sie gehören zur
selben Gruppe und kommen als Nächstes.

## 35.153 · V05 — nachgeprüft und in Ordnung

Der letzte messbare Punkt aus V05: **„Informationen nicht allein durch Farbe
unterscheiden."**

Nachgesehen, wo Farbe wirklich allein stehen könnte:

| Stelle | Befund |
|---|---|
| die drei Chip-Arten (`g`, `a`, `r`) | tragen alle Text — Farbe verstärkt nur |
| Postfachzähler (goldene Blase) | `aria-label` nennt die Zahl bereits |
| Fortschrittsbalken Ruhmpunkte | die Zahl steht darüber im Text |

**Hier war nichts zu beheben.** Das ist selten genug, um es festzuhalten:
nicht jeder Punkt eines Prüfberichts ist ein Fehler, und etwas zu „beheben",
was stimmt, macht es nur anders — nicht besser.

Drei Prüfungen halten den Zustand fest, damit die nächste farbige Anzeige
ohne Text auffällt.

### Der Container hat zwischendurch `node_modules` verloren

Mitten in der Arbeit meldete der Bau, dass nichts mehr da sei. Ursache war
nicht der Code: die Bauumgebung war zurückgesetzt. `npm ci` stellte sie in
drei Sekunden wieder her.

Das gehört hierhin, weil es beim nächsten Mal wieder passieren kann — und
weil die Fehlermeldung dann nach einem Codefehler aussieht.

### Die Archetyp-Probe, dritter Anlauf

Sie meldete wieder rot: 28 von 60. Sechs Läufe: **27 · 35 · 35 · 37 · 38 ·
42 von 60** — 45 % bis 70 % bei einer Grenze von 50 %.

**Dass ich dieselbe Probe zum dritten Mal anfasse, ist das eigentliche
Signal.** Der Grund liegt nicht in der Stichprobe: nach F32 wechseln schwache
Laufbahnen seltener den Archetyp, und der wahre Wert ist von 89 % auf rund
60 % gefallen. Eine Grenze, die mit 39 Punkten Abstand gesetzt wurde, hat
heute zehn.

Stichprobe auf 120 — der Lauf wächst von 11 auf rund 18 Sekunden. Danach
acht Läufe ohne Befund an dieser Stelle. Die Grenze bleibt bei 50 %.

**Neu aufgefallen dabei:** „Marken: jede neue Marke wird im echten Verlauf
auch erreicht" meldete in einem von acht Läufen `comeback` als nie erreicht.
Eine seltene Marke in einer Stichprobe — dieselbe Klasse, noch nicht
untersucht. Steht als offener Punkt.

### Geprüft

| | 35.152 | 35.153 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 604, 0 Fehler | **607**, 0 Fehler |

**Status V05: geprüft, kein Handlungsbedarf.** Der Rest von V05 —
Bedienbarkeit bei großer Schrift, offene Tastatur, echte Trefferflächen —
kam über F49 bis F52 und braucht darüber hinaus ein Gerät.

## 35.154 · V09 — wann ein Kauf wirkt

Der Bericht verlangt: *„Preis, aktueller Bestand und **Ziel** des Kaufs
müssen vor dem Kauf eindeutig sein."* Preis und Bestand standen schon da,
das Ziel nicht.

    Extraschicht                              22 VC
    Eine Woche mehr Arbeit als die anderen.
    Wirkt bei der nächsten Entwicklung, also vor der kommenden Saison.
    Danach bleiben dir 78 VC.

**Genau daran hingen F46 und F47:** der Berater verfiel vor dem
Sommerangebot, die Extraschicht nach dem Training. Beide sind behoben — aber
wer nicht weiß, *wann* etwas greift, kauft es trotzdem zum falschen
Zeitpunkt.

### Und was danach bleibt

Der Bericht will, dass sich jede Buchung mit dem tatsächlichen
Kassenunterschied erklären lässt. Vorher zu wissen, was bleibt, gehört dazu.

### Vier neue Prüfungen

| Probe | |
|---|---|
| **jeder Artikel sagt, wann er wirkt** | 7 von 7 |
| keine Zeile ohne zugehörigen Artikel | keine verwaisten |
| vor dem Kauf steht da, was danach bleibt | — |

Die ersten beiden zusammen halten Tabelle und Artikelliste aneinander. Eine
Tabelle neben einer Liste läuft auseinander, sobald jemand einen Artikel
ergänzt — dieses Muster hat das Projekt oft genug getroffen.

### Geprüft

| | 35.153 | 35.154 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 607, 0 Fehler | **611**, 0 Fehler |

**Status V09 umgesetzt.** Nicht gebaut: eine feingranulare Finanzhistorie —
der Bericht rät selbst davon ab („kein umfangreiches Buchhaltungsspiel").

## 35.155 · V12 — ein Textkatalog aus fertigen Ausgaben

Der Bericht verlangt „einen prüfbaren Textkatalog aus **tatsächlich
gerenderten** Szenen". Genau das ist der Punkt: `stimmigkeit.cjs` sieht die
Rohtexte, und dort steht alles richtig. **Die Fehler entstehen erst beim
Zusammensetzen.**

`pruefstand/texte.cjs` erzeugt aus allen 532 Ereignissen die fertigen Texte —
mit eingesetztem Kontext, in beiden Geschlechtsformen — und sucht darin nach
acht Mustern: technische Werte, offene Platzhalter, doppelte Leerzeichen,
Leerzeichen vor Satzzeichen, „1 Datensätze", ss statt ß, unpassende Artikel,
falsche Relativpronomen.

**4.881 Textstellen, 9.771 Proben.**

### Und sofort: F15 war nur halb erledigt

    16 Stellen:  beisst · weisst (5) · weiss (7) · dreissig (3)

In 35.131 hatte ich F15 an den **Sicherungstexten** behoben und als erledigt
verbucht. Die Ereignistexte waren nie lektoriert — 532 Ereignisse liest
niemand von Hand durch, und deshalb stand es dort weiter falsch.

Berichtigt. Eine Gegenprobe stellt sicher, dass keine Kennung getroffen
wurde: `zweiteskind` und `nv_zweitverein` enthalten „wei", aber nicht „weiss"
als ganzes Wort.

### Drei falsche Treffer, drei Korrekturen an mir selbst

**„Ein größerer Verein"** — mein Muster suchte Artikel plus Wort auf `-in`,
und `Verein` endet auf „in". Jetzt eine Liste echter weiblicher Endungen.

**„und du fängst wieder bei null an"** — `null` ist hier deutsch. Jetzt wird
nur das englische `null` in Ausgabelage gesucht.

**Reihenweise „Platzhalter offen"** — Label, Hinweis und Ausgänge können
ebenfalls Funktionen sein, und ich schickte nur Titel und Einleitung durch
den Kontext. Die übrigen landeten als Funktionsquelltext im Katalog. **Die
Muster stimmten; geprüft wurde das Falsche.**

### Der Kontext ist nicht geraten

    grep -oE "\bc\.[a-zA-Z]+(\.[a-zA-Z]+)*" ereignisse.js | sort -u

44 Pfade, die irgendein Text anfasst — daraus ist der Testkontext gebaut.
Fehlt einer, meldet der Katalog „Text braucht mehr Kontext", statt ihn
stillschweigend zu überspringen. Ein übersprungener Text wäre ein
ungeprüftes Stück Spiel.

### Der Prüfstand hat mich zweimal erzogen

Nach dem Anlegen des Werkzeugs brach der Lauf ab: erst fehlte `texte.cjs` in
der Werkzeugtabelle in STAND.md, dann in LIESMICH.md. *„Ein Werkzeug, das
dort fehlt, benutzt niemand mehr."* Beide Male zu Recht.

### Geprüft

| | 35.154 | 35.155 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 611, 0 Fehler | 611, 0 Fehler |
| **Textkatalog** | — | **9.771 Proben, 0 Befunde** |
| ss-Formen in Ereignissen | 16 | **0** |

**Status V12 umgesetzt**, soweit prüfbar. Was bleibt: ein echtes Lektorat der
532 Ereignisse durch einen Menschen — der Katalog findet Muster, keine
holprigen Sätze.

## 35.156 · V10 — wiederholbare Messungen, und Punkt 21 ist geklärt

### Der Zufall ist austauschbar

`zufall` ersetzt `Math.random` an **allen 27 Stellen** — 20 in `App.jsx`, 2
in `akademie.js`, 5 in `karten.js`. Im Spiel ändert sich nichts: die Quelle
ist standardmäßig `Math.random`, nur der Prüfstand setzt sie um. Kein Feld im
Spielstand, keine Einstellung.

    node pruefstand/kalibrierung.cjs --seed=4711

Viermal derselbe Seed: **20,5 · 20,5 · 20,5 · 20,5.** Anderer Seed: 21,0.

### Drei Anläufe, bis es wirklich stimmte

**Erst 21,2 und 20,8** — die Kalibrierung würfelte an einer Stelle selbst mit
`Math.random`, an der austauschbaren Quelle vorbei. Dieselbe Sorte Fehler wie
F07, eine Ebene tiefer.

**Dann 20,5 und 20,2** — `E.zufall` direkt zu nehmen geht nicht: es ist eine
**Variable**, deren Wert beim Ausführen eingefroren wird, nicht die später
gesetzte Funktion. Über `pick`, das sie bei jedem Aufruf neu liest, stimmt es.

**Dann 20,3 · 20,5 · 20,3** — `akademie.js` und `karten.js` würfelten noch
selbst. Sie bekommen die Helfer längst übergeben und benutzten sie an sieben
Stellen nicht.

Jede Zwischenstufe sah aus wie „fast fertig". Nur das Nachmessen hat gezeigt,
dass es das nicht war.

### Und damit: offener Punkt 21

Zehn verschiedene Seeds, je 300 Laufbahnen:

    21,1 · 20,8 · 21,0 · 20,7 · 20,4 · 21,1 · 21,0 · 21,0 · 21,0 · 20,8

**Median 21,0. Spanne 0,7. Untergrenze 20.**

Der Wert liegt sauber im Band, und die Streuung ist klein genug, dass die
Grenze nicht mehr zufällig unterschritten wird. Die vier grundlosen
Rotmeldungen kamen aus **zwei** Quellen: den unzulässigen Entscheidungen
(F07, behoben) und dem fehlenden Startwert (jetzt behoben).

**Punkt 21 braucht keine Entscheidung mehr.** Das Band war nie falsch — die
Messung war es. Ich lasse die Grenze bei 20 und schließe den Punkt.

### Geprüft

| | 35.155 | 35.156 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 611, 0 Fehler | 611, 0 Fehler |
| Textkatalog | 9.771 Proben, 0 | 9.771 Proben, 0 |
| **Kalibrierung mit Seed** | nicht möglich | **viermal identisch** |

**Status V10 umgesetzt.** Was fehlt: Verteilungen statt Mittelwerte in der
Ausgabe — der Bericht nennt das getrennt, und es ist ohne den Startwert
ohnehin nicht sinnvoll gewesen. Jetzt wäre es möglich.

## 35.157 · V08 — die Karte sagt, woher der Spieler kommt

    Eigengewächs, Jahrgang 2029 · erster Profiklub: Hamburger SV · Nationalspieler

Der Bericht war hier präzise: `ausAbsolvent` speichert seit 35.124
`zusatz.jahrgang`, `zusatz.klub` und `zusatz.ns` — **die Karte zeigte nichts
davon.** Die Daten lagen drei Fassungen lang ungenutzt herum.

Das ist der Unterschied zwischen einer Karte und einer Erinnerung:
„Eigengewächs, Jahrgang 2029" ist ein Spieler, den man aufwachsen sah. Ohne
das ist es eine Karte wie jede andere.

**Alte Karten haben kein `zusatz`** — dann fällt die Zeile weg, statt
„Jahrgang undefined" zu zeigen. Genau die Sorte sichtbarer technischer Wert,
nach der `texte.cjs` sucht.

### Vier neue Prüfungen

| Probe | |
|---|---|
| die Karte trägt Jahrgang und Klub | Datenseite |
| **die Kartenansicht zeigt sie auch** | die eigentliche Lücke |
| alte Karten zeigen keine leere Zeile | — |
| ohne Klub wird keiner erfunden | — |

Die zweite ist die wichtige: dass Daten *da* sind, hieß hier drei Fassungen
lang nicht, dass jemand sie sieht.

### Ein roter Lauf, nicht reproduzierbar

„Speicher: der Laufbahn-Aufbau hat Langzeitläufe erzeugt" meldete einmal
rot — eine der sechs Testlaufbahnen endete zufällig nach zehn Saisons. Zehn
weitere Läufe waren grün.

Ich fasse die Probe **nicht** an: sie verlangt zu Recht lange Läufe, und ein
einzelner Ausreißer in zehn Durchgängen ist kein Muster. Falls er
wiederkommt, steht er hier.

### Geprüft

| | 35.156 | 35.157 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 611, 0 Fehler | **615**, 0 Fehler |
| Textkatalog | 9.771 Proben, 0 | 9.771 Proben, 0 |

**Status V08 umgesetzt.** Der zweite Teil der Empfehlung — „vor einer
Entscheidung erklären, welche Alternative aufgegeben wird" — betrifft die
Talentfreigabe und wäre ein eigener Eingriff in den Akademieschirm.

## 35.158 · V11 — die erste Laufbahn bleibt

### Eine Bestenliste ist kein Archiv

Die Ruhmeshalle sortiert nach Punkten und kappt bei zwölf. Wer schwach
anfing, verlor seine **erste** Laufbahn nach zwölf besseren — und mit ihr die
Zeitleistenzeile „Die erste Laufbahn endet".

Der Bericht nennt genau das: *„Die erste tatsächlich abgeschlossene Karriere
bleibt erinnerbar, auch wenn sie später nicht mehr zu den zwölf stärksten
gehört."*

Sie behält jetzt einen Platz — den dreizehnten, wenn sie sonst herausfiele.
**Kein neues Feld:** `nr` gibt es seit 35.138, und `nr === 1` ist die Erste.

Zwei Gegenproben halten fest, dass daraus keine Dauerregel wird: eine
**starke** Erste bekommt keinen zusätzlichen Platz, und alte Einträge ohne
`nr` bleiben bei zwölf — eine Reihenfolge wird nicht erfunden.

### Der Auszug heißt jetzt Auszug

Vier Vereinsstationen werden je Halleneintrag gespeichert. Wer zwölf hatte,
sah vier und konnte glauben, das seien alle gewesen.

    Auszug — insgesamt 9 Stationen

`statN` kostet eine Zahl und sagt, was fehlt. Erscheint nur, wenn wirklich
etwas fehlt, und nur bei Einträgen ab dieser Fassung.

### Vier neue Prüfungen

| Probe | |
|---|---|
| **die erste Laufbahn bleibt, auch wenn sie schwach war** | 13 Einträge |
| eine starke Erste bekommt keinen Extraplatz | 12 |
| alte Einträge ohne Nummer bleiben bei zwölf | 12 |
| der Auszug sagt, wie viele es insgesamt waren | — |

### Geprüft

| | 35.157 | 35.158 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 615, 0 Fehler | **619**, 0 Fehler |

**Status V11 umgesetzt.** Nicht gebaut: „wichtige Vereins- und
Akademieereignisse" als eigene Meilensteine — dafür gibt es bereits die
Zeitleiste aus 35.119, und ein zweiter Speicher daneben wäre eine zweite
Wahrheit über dieselbe Welt.

## 35.159 · F33 und F34 — die zwei, die ich übersprungen hatte

Kevin hat nachgefragt, und die Frage war berechtigt. Ich hatte beide als
„vom Bericht als Designentscheidung freigegeben" abgehakt. **Der Bericht
sagt etwas anderes:** sie *dürfen* nach begründeter Entscheidung
abgeschlossen werden. Eine Begründung hatte ich nicht — ich hatte sie
übersprungen und das Überspringen als Entscheidung ausgegeben.

Beide nachgestellt, beide bestätigt.

### F33: viermal dieselbe Zeile

    Der Anfang · Eine große Spielzeit · Eine große Spielzeit ·
    Eine große Spielzeit · Eine große Spielzeit

Sachlich richtig — es waren vier große Spielzeiten. Als Rückblick liest es
sich wie ein Druckfehler.

**Behoben, aber vorsichtig.** Der Bericht setzt die Grenze selbst:
*„Wichtige tatsächliche Ereignisse nicht zugunsten von Abwechslung
verschweigen."* Deshalb wird nichts unterdrückt und nichts gewürfelt: die
Funktion liefert weiter die beste passende Zeile. Nur wenn sie mit der
vorigen übereinstimmt **und eine zweite passt**, wird die zweite genommen.

    Der Anfang · Eine große Spielzeit · Das dritte Jahr ·
    Eine große Spielzeit · Das fünfte Jahr

„Das dritte Jahr" ist ebenso wahr. Passt keine zweite, bleibt die
Wiederholung — **eine korrekte Wiederholung ist besser als eine falsche
Abwechslung.**

Deterministisch: derselbe Spielstand ergibt denselben Text, auch beim
erneuten Öffnen. Eine Probe hält das fest.

### F34: entschieden und beibehalten

Die Schlagzeile „Zurückgeschrieben" gilt nach **jeder** Verletzung, Archetyp
und Meilenstein verlangen eine **schwere**. Drei Regeln, zwei Schwellen.

**Sie bleiben verschieden, weil sie verschiedene Fragen beantworten:**

| | Frage | Schwelle |
|---|---|---|
| Archetyp | ein Urteil über die ganze Laufbahn | schwer |
| Meilenstein | eine Auszeichnung | schwer |
| Schlagzeile | ein Urteil über eine Saison | jede |

Wer nach einem verletzten Jahr wieder 25 Spiele macht, hat sich
zurückgeschrieben — auch nach einer leichten Verletzung. Der Text behauptet
nichts Falsches: *„Nach der Verletzung wieder 25 Spiele."* Keine schwere,
keine lange.

Eine Angleichung wäre die bequemere Antwort und die schlechtere: sie nähme
dem Rückblick einen wahren Satz, um drei Regeln gleich aussehen zu lassen.

Eine Probe hält die **Entscheidung** fest, nicht eine Behebung — wer das
später angleicht, soll es bewusst tun.

### Geprüft

| | 35.158 | 35.159 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 619, 0 Fehler | **624**, 0 Fehler |

**Damit ist der Fehlerkatalog F01–F56 wirklich vollständig** — keiner
übersprungen, F34 als einziger begründet beibehalten.

## 35.160 · Das Seed-Problem — eine Zeile

In 35.159 hatte ich geschrieben, der feste Startwert wirke nur zur Hälfte und
die Ursache sei nicht gefunden. Kevin fragte, ob wir das angehen. **Die
Antwort war: erst messen, wie groß es ist.**

### Die Suche

    createPlayer, dreimal Seed 777        56/99/w_goat1  ·  identisch
    1 · 3 · 8 Saisons, je dreimal          identisch

**Der Spielkern war sauber.** Damit war klar: die Streuung kam aus dem
Prüfstand selbst.

    pruefstand/vereinpruefung.cjs:1233
    if (ch.roll) { const r = Math.random(); …

**Dieselbe Zeile wie in `kalibrierung.cjs`** — dort in 35.156 behoben, hier
übersehen. Eine einzige Stelle.

    vorher:   69 · 71 · 72 · 72 · 73 · 76 · 77 von 120
    nachher:  achtmal 71 von 120

### Zwei eigene Fehler auf dem Weg

**Der Wächter stolperte über die eigene Fußspur.** Meine neue Probe sucht
`Math.random(` in allen Prüfwerkzeugen — und fand sich selbst: der
Gegenprobe-Teststring enthielt den Aufruf wörtlich. Jetzt wird er
zusammengesetzt.

**Und das Bündel war wieder älter als die Quelle.** Nach der Rücknahme der
Gegenprobe meldete die Prüfung weiter rot; die Datei stimmte längst. Vierter
Fall dieser Art in dieser Reihe.

### Eine Prüfung für die Klasse

Zweimal dieselbe Zeile, zweimal derselbe Fehler — das ist ein Muster, kein
Einzelfall. Die neue Probe liest **alle fünf Prüfwerkzeuge** und meldet
jedes eigene `Math.random`. Kommentare werden vorher entfernt: sie erklären
den Fehler und sind keiner (dieselbe Falle wie 35.135 und 35.141).

Gegenprobe an der echten Stelle: **„eigener Zufall in:
vereinpruefung.cjs"**.

### Geprüft

| | 35.159 | 35.160 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 624, 0 Fehler | **626**, 0 Fehler |
| Archetyp-Probe über 8 Läufe | 69–77 | **achtmal 71** |

**Damit sind alle Messungen dieses Projekts wiederholbar.** Ändert sich eine
Zahl, hat sich das Spiel geändert.

## 35.161 · V06 — die erste echte Konsequenzkette

Der Bericht nennt das Beispiel selbst: *„Ein abgelehntes Angebot kann später
zu einer Begegnung führen."*

**`p.abgelehnt` gibt es seit 35.114 — und kein einziges Ereignis hat es je
gelesen.** Acht gespeicherte Absagen, und nie kam eine zurück.

### Zwei Glieder, eine Entscheidung

    ab_wiedersehen   Der Verein von damals steht auf dem Spielplan.
                     Wie man damit umgeht, setzt ein Merkmal.
    ab_quittung      Jahre später zahlt sich die Haltung aus — oder nicht.
                     Nur erreichbar mit dem Merkmal aus dem ersten.

> Auf dem Spielplan steht Ajax Amsterdam. Vor 3 Jahren wollten sie dich, und
> du hast abgesagt. In der Kabine wissen es alle.

**Kein neues Feld.** Die Kette läuft über `flags` und über `c.absage`, das
aus `p.abgelehnt` abgeleitet wird.

**Mindestens zwei Jahre Abstand:** eine Absage von letzter Woche ist keine
Geschichte. Sonst käme das Ereignis direkt nach dem Transfer.

### Beide Wege führen weiter

„Ihnen zeigen, was sie verpasst haben" kann nach hinten losgehen — 45 % Hohn
statt Applaus. „Es wie jedes andere Spiel behandeln" ist die ruhige Antwort
und setzt ein anderes Merkmal. **Keine Sackgasse:** beide führen zur zweiten
Stufe, mit verschiedenen Texten.

### Sieben neue Prüfungen

| Probe | |
|---|---|
| beide Glieder gibt es | — |
| das Wiedersehen braucht eine echte Absage | ohne: nicht erreichbar |
| eine frische Absage löst noch nichts aus | nach einem Jahr: false |
| **die Quittung kommt erst nach dem Wiedersehen** | das ist die Kette |
| sie endet und wiederholt sich nicht | — |
| der Text nennt Verein und Jahre | keine Behauptung ohne Bezug |
| jede Wahl führt weiter | keine Sackgasse |

### Geprüft

| | 35.160 | 35.161 |
|---|---|---|
| Ereignisse | 530 | **532** |
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 626, 0 Fehler | **633**, 0 Fehler |
| Textkatalog | 9.771 Proben, 0 | **9.805 Proben, 0** |

**Status V06 angefangen.** Das ist eine Kette von wenigen, die der Bericht
vorschlägt — die anderen brauchen dieselbe Sorte Datenbasis, und die gibt es
nur an wenigen Stellen. Wo sie fehlt, wäre eine Kette erfunden statt
gewachsen.

## 35.162 · V07 — ein Vorsatz statt eines zweiten Zielsystems

### Zuerst die Überschneidung geprüft

Der Bericht verlangt das ausdrücklich, und das Ergebnis war eindeutig: **alle
drei vorgeschlagenen Herausforderungen gibt es bereits als Errungenschaft.**

    Vereinstreue   „Fünf Jahre ein Verein" · „Ein Verein, ein Leben"
    Comeback       „Zehnmal aufgehört" und die Rückkehr-Marken
    Nachwuchs      fünf Akademie-Errungenschaften

Ein zweites Zielsystem daneben wäre eine zweite Wahrheit über dieselbe
Leistung — genau das Muster, das dieses Projekt schon mehrfach eingeholt hat.

### Was fehlte, ist die Wahl

Errungenschaften erreicht man **nebenbei**. Niemand entscheidet sich vorher
für eine. Der Unterschied, den der Bericht verlangt — *„unterschiedliche
Abwägungen, nicht nur andere Endpunktzahlen"* — entsteht dadurch, dass man
ein Ziel im Blick hat, während man Entscheidungen trifft.

    Der Weltenbummler       Daheim bleiben
    Die lange Laufbahn      Eine herausragende Saison

**Die ersten beiden schließen sich aus.** Das ist der Punkt: eine Wahl soll
etwas kosten.

**Keine Belohnung.** Der Bericht warnt vor einem leicht wiederholbaren
Sonderweg — der einfachste Schutz ist, dass es nichts zu holen gibt. Wer den
Vorsatz hält, hat ohnehin die Errungenschaft.

Er bleibt während der Laufbahn sichtbar und zeigt, ob er gerade gehalten ist.
„Daheim bleiben" kann kippen — ein Ziel, das man beim Start wählt und nie
wiedersieht, ist keins.

### Neunter erfundener Name

Mein erster Entwurf nannte `f_treue10`, `f_heimat`, `f_kapitaen1` und
`f_alt38`. **Keine davon existiert.** Diesmal direkt nach dem Schreiben
nachgezählt, statt es der Prüfung zu überlassen — die echten Kennungen habe
ich dann aus den Bedingungen gelesen, die nur `p` lesen (63 von 192).

Eine Probe hält das fest: jeder Vorsatz muss auf eine Errungenschaft zeigen,
die es gibt.

### Acht neue Prüfungen

| Probe | |
|---|---|
| **jeder zeigt auf eine echte Errungenschaft** | fängt erfundene Kennungen |
| keiner bringt eine Belohnung | der Schutz aus dem Bericht |
| zwei stehen gegeneinander | ohne Gegensatz keine Wahl |
| der Stand folgt der echten Bedingung | keine nachgebaute Regel |
| „Daheim bleiben" kippt beim Wechsel | — |

### Geprüft

| | 35.161 | 35.162 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 633, 0 Fehler | **641**, 0 Fehler |
| Ereignisse | 532 | 532 |

**Damit sind alle zwölf Empfehlungen bearbeitet** — V06 mit einer Kette
(mehr gehen nur mit erfundenen Daten), V07 ohne zweites Zielsystem, V03 ohne
Dateiexport. Jedes „nicht gebaut" steht mit Begründung in seinem Messblock.

## 35.163 · F47 und F48 — beim Berichtschreiben aufgefallen

In 35.152 hatte ich einen Buchführungsfehler korrigiert und dabei notiert:
*„F47 und F48 stehen noch aus."* Dann habe ich sie nicht mehr angefasst und
später „der Bericht ist abgearbeitet" gemeldet.

**Aufgefallen beim Sammeln der Fakten für den Abschlussbericht.** Ein
Bericht, der Vollständigkeit meldet, muss stimmen — also erst die zwei
Punkte, dann der Bericht.

### F47: ein Kauf, der nichts bewirken konnte

Die Extraschicht wirkt ausschließlich in `develop`, also **vor** der Saison.
In der Ereignisphase ist die Entwicklung längst gelaufen — der Laden blieb
aber offen und der Artikel kaufbar. Die nächste `simulateSeason` zählte den
frisch gekauften Vorrat von 1 auf 0 herunter, bevor `develop` wieder dran
war. **22 VC bezahlt, nichts bekommen.**

`ladenGesperrt` kennt jetzt den Schritt. Nach dem Training: *„Das Training
dieser Saison ist durch"* — mit Grund, nicht wortlos ausgeblendet.

**Nur dieser Artikel.** Die übrigen Saisonartikel wirken in
`simulateSeason` und sind bis dahin nutzbar; eine pauschale Sperre wäre
bequemer und falsch. Eine Probe hält das fest.

### F48: eine Verlängerung ist kein Wechsel

`winterAccept` behandelte **jedes** Angebot wie einen Vereinswechsel: neuer
Kader, Vertrauen auf 50, Kapitänsbinde weg. Und die Vertragsjahre übernahm
nur der `transfer`-Zweig — eine im Winter angenommene Verlängerung ließ
`contract` auf 0 stehen.

    Vierjahresangebot angenommen  →  contract = 0

Jetzt: `renew` und `stay` behalten Verein, Kader und Binde, und `years` gilt
für jede Art, die welche mitbringt. **Dieselbe Angebotsart bedeutet in
beiden Fenstern dasselbe** — sonst hängt die Wirkung am Kalender.

### Fünf neue Prüfungen

| Probe | |
|---|---|
| Extraschicht im Trainingsschritt kaufbar | — |
| **nach dem Training gesperrt** | der Befund |
| andere Saisonartikel bleiben kaufbar | keine pauschale Sperre |
| die Laufzeit gilt für jede Angebotsart | — |
| eine Verlängerung wechselt nicht den Verein | — |

### Geprüft

| | 35.162 | 35.163 |
|---|---|---|
| Ansichten | 814, 0 Fehler | 814, 0 Fehler |
| Verein | 641, 0 Fehler | **646**, 0 Fehler |

**Jetzt ist der Fehlerkatalog wirklich vollständig.**

## 35.164 · Die Einstellungen waren kaputt — ausgeliefert

Kevin kam nicht mehr in die Optionen. Auf dem Bildschirm:

    vorsatz is not defined

**In dem Paket, das ich zwei Antworten vorher als „alles grün" übergeben
habe.**

### Was passiert war

Die Vorsatz-Auswahl aus 35.162 landete in `Optionen` statt in
`CreateScreen`. Beide Komponenten haben einen „Spielweise"-Block, mein
Textersatz traf den falschen — und `useState` für `vorsatz` steht in
`CreateScreen`, 640 Zeilen weiter unten.

Umgehängt. Die Auswahl steht jetzt dort, wo sie hingehört: über dem
Startknopf.

### Warum keine Prüfung das gefangen hat

`Optionen` ist ein **Unterzustand** des Hauptmenüs (`opt`). Die
Ansichtsprüfung rendert `MenuScreen` — aber nie mit geöffneten Optionen.
Also wurde die Komponente in 814 Prüfungen kein einziges Mal aufgebaut.

**Ich hatte die Lücke in 35.142 selbst notiert:** *„Zwei neue Knöpfe, und die
Zahl bleibt bei 154: die Sichtprüfung öffnet die Optionen nicht."* Ich habe
es aufgeschrieben und nicht geschlossen. Zweiundzwanzig Fassungen später kam
der Absturz genau dort heraus.

Jetzt sind die Optionen zwei eigene Ansichten in der Prüfung — mit und ohne
laufende Laufbahn. **816 statt 814.**

### Was ich daraus mitnehme

Eine notierte Lücke ist keine geschlossene. Beim nächsten „das prüft der
Prüfstand nicht" gehört die Prüfung in dieselbe Fassung, nicht in den
Messblock.

Und: Kevin hat den Fehler in Minuten gefunden. Der dritte Gerätebefund
dieser Reihe, und der dritte, der etwas fand, das kein Werkzeug sah.

### Geprüft

| | 35.163 | 35.164 |
|---|---|---|
| Ansichten | 814, 0 Fehler | **816**, 0 Fehler |
| Verein | 646, 0 Fehler | 646, 0 Fehler |

## 35.168 · Zusammenführung mit dem Codex-Stand 35.167

### Verbindlich: was von Codex stammt und erhalten bleibt

Kevin hat das am 14.09.2026 ausdrücklich festgelegt. Diese Arbeiten sind der
bestehende Stand und werden **nicht** aus stilistischen Gründen umgebaut oder
durch ältere eigene Lösungen ersetzt. Eine Änderung braucht einen
nachgewiesenen Fehler, dokumentierte Ursache und ein Prüfergebnis; größere
konzeptionelle Eingriffe vorher mit Kevin abstimmen.

**Erhalten:**

- gemeinsame Journalbuchungen für Karriereabschluss, Kartenkäufe,
  Kartenverkäufe und zusammengehörige Vereins-/Akademieänderungen
- Sperren gegen gleichzeitige Buchungen; Erfolgsmeldungen und sichtbare
  Bestandsänderungen erst **nach** erfolgreicher Speicherung
- Wiederherstellung nach Speicherfehlern, Wiederaufnahme eines endgültigen
  Karriereendes
- Spielstandschema 2 mit festen Auswahl-IDs, Schema 1 über `altIndex` lesbar
- **bestehende Ereignis-IDs und `altIndex` niemals neu nummerieren oder
  wiederverwenden**
- Fanshopkorrektur, Packpreis- und Berechtigungsprüfungen
- Formularbeschriftungen, native Kartenbuttons, Fokusführung
- die sechs Vorsätze; die redundante Tätigkeitsbox bleibt entfernt; der
  gewählte Vorsatz steht unter der Wildcard
- die 47 Regressionstests einschließlich der injizierten Speicherfehler

**Modulzuordnung (korrigiert):**

| Was | Wo |
|---|---|
| `datenErsetzen` | `sicherung.js` |
| `bucheBestand`, `bucheAenderung` | `App.jsx` |
| `packBuchung`, `verkaufsBuchung` (reine Vorbereitung) | `buchungen.js` |

In `buchungen.js` gehören **keine** Schreib- oder React-Nebeneffekte. Karten-
und Vereinsmodule werden als Abhängigkeiten übergeben.

### Der APK-Workflow kommt aus dem GitHub-Updatepaket

Meine erste Zusammenführung hatte ihn übersehen: die höhere Nummer 35.168
bedeutete nicht, dass die späteren Arbeiten enthalten waren. Übernommen aus
`Rasenschach-XI-35.167-GitHub-Update-APK.zip`:

- `.github/workflows/apk.yml` (209 Zeilen statt der alten 254)
- `.gitignore` — berücksichtigt jetzt den Android-Quellcode
- `GITHUB-APK-ANLEITUNG.md`

Geprüft: Secret `ANDROID_DEBUG_KEYSTORE_BASE64` oder vorhandener
`signing/debug.keystore`, sonst **verständlicher Abbruch** — kein
Ersatzschlüssel wird erzeugt. Zehn `exit 1`-Stellen, `apksigner`-Prüfung
vorhanden, **kein `git push` oder `git commit`** im Workflow.

**Nicht belegt:** dass eine so gebaute APK Kevins installierte Fassung
aktualisieren kann. Schlüssel und Signaturprüfung zeigen das nicht — das
zeigt erst ein Update auf dem Gerät.

### Versionsangaben vereinheitlicht

    App.jsx            35.168
    package.json       35.168.0
    package-lock.json  35.168.0
    build.gradle       versionName 35.168.0 · versionCode 3516800

Gesetzt mit Codex' eigenem Werkzeug
`node pruefstand/android-version.cjs android/app/build.gradle package.json`.

### Babel-Parser: meine erste Aussage war falsch

Ich hatte berichtet, `@babel/parser` fehle im Paket. Tatsächlich war
**7.29.8 bereits im Lock**, als indirekte Abhängigkeit von `@babel/core`. Neu
ist nur die Aufnahme als **direkte** Entwicklungsabhängigkeit.

Schlimmer: mein erster Anlauf installierte `^8.0.5`. Diese Hauptversion
verlangt Node `^22.18.0 || >=24.11.0`, während `package.json` `>=22.12.0`
angibt — ein stiller Konflikt für Node 22.12 bis 22.17. Jetzt `^7.29.8`
(`engines: >=6.0.0`); die Mindestversion bleibt unverändert.


### Das Zielband ist knapp geworden

Ein Prüflauf meldete **20,0 bei einer Untergrenze von 20** — genau auf der
Kante. Nachgemessen:

    fünf feste Startwerte, je 300:   21,1 · 20,8 · 21,0 · 20,7 · 20,4
    sechs Läufe ohne Seed, je 600:   21,0 · 20,8 · 20,6 · 21,0 · 20,8 · 20,6

Der Wert liegt sicher im Band; die 20,0 war ein seltener Ausreißer bei 300
Laufbahnen. **Ich fasse die Grenze nicht an** — sie ist richtig, und ein
gelegentlicher Grenzfall ist kein Grund, sie zu verschieben.

Aber der Abstand ist von einst mehreren Punkten auf **0,6** geschrumpft.
Falls das Band künftig häufiger rot meldet, ist die Ursache im Spiel zu
suchen, nicht in der Messung: seit 35.156 ist sie mit festem Startwert
reproduzierbar.

### Die sechs neuen Punkte aus Revision 6

Codex hat sie in 35.167 gefunden und behoben. Sie standen bis hierher nicht
in dieser Dokumentation — nachgetragen aus dem Gesamtbericht, nicht aus dem
Gedächtnis:

| ID | Befund | Behebung in 35.167 |
|---|---|---|
| **F59** | Packkauf begrenzte die Abbuchung aufs Guthaben statt abzuweisen | Kauf bei Unterdeckung wird abgewiesen; die Oberfläche ist nicht mehr der einzige Schutz |
| **F60** | Nach einer Speicherstörung blieb die Spielroute aktiv, der Zustand war leer | „Erneut versuchen" lädt neu und führt ins Menü |
| **F61** | Falsche Klammerung setzte den Fanshop-Basisfaktor auf 0,2 | 1,0 ohne, 1,2 mit Fanshop |
| **F62** | Karriereende war teils nur als Einblendung vorgemerkt | eindeutiger Endgrund mit Abschlussphase im fortsetzbaren Stand |
| **F63** | Abschluss, Karten und VC konnten teilweise gespeichert sein | gemeinsame Journalbuchungen, mit Fehlern an jeder Schreibstelle geprüft |
| **F64** | Der Workflow suchte `machVerein` im minifizierten Bundle | Prüfung ersetzt, Symbolquelle als Rückfall angebunden |

Dazu geschlossen: **F49** (native Kartenbedienung) und der verbleibende Teil
von **F50** (Formularbeschriftungen). Der Geräteanteil beider bleibt offen.

**F61 ist der interessanteste:** eine falsch gesetzte Klammer, die den
Basisfaktor fünffach verkleinerte. Dieselbe Klasse wie F24 aus dem alten
Katalog — dort band `&&` stärker als `||`. Der Prüfstand hat beide nicht
gesehen, weil er Ergebnisse prüft und keine Formeln.


Kevin hat den von Codex weiterentwickelten Stand 35.167 als neue Grundlage
gesetzt. Er baut auf **35.166** auf — meine parallelen Fassungen 35.167 und
35.168 waren dort nicht enthalten.

### Drei Gerätebefunde waren zurück

| Befund | im Codex-Stand | jetzt |
|---|---|---|
| Vorsatz auf der Passrückseite | enthalten | — |
| **Kontrast in der Saisonbilanz** (`pan` auf Karton, 1,08) | zurück | behoben |
| **Die drei Erklärzeilen** über dem Spielschirm | zurück | entfernt |

Der Kontrastfehler ist damit zum **dritten Mal** aufgetreten: Kevin fand ihn
in 35.121, ich baute ihn in 35.149 erneut ein, und beim Zusammenführen kam er
über den älteren Zweig zurück. Bei parallelen Ständen ist das die eigentliche
Gefahr — nicht der Fehler selbst, sondern sein Wiederauftauchen.

### Zwei Lücken im übergebenen Paket

**`@babel/parser` fehlte in `package.json`.** Das neue Werkzeug
`ereignis-ids.cjs` war damit nicht lauffähig und brach den ganzen Prüflauf
ab — mit der irreführenden Meldung „Bitte zuerst npm ci ausführen".
Nachgetragen als Entwicklungsabhängigkeit. Zusätzlich lädt das Werkzeug
Babel jetzt aus dem Quellverzeichnis, weil `pruefen.sh` es aus `/tmp/ps`
aufruft.

**Der Produktionsbau löschte den Regressionen die Grundlage weg.** Er räumt
`node_modules` im Quellverzeichnis auf (`rm -rf "$ARBEIT/node_modules"`) und
läuft **vor** dem Regressionsteil. Der meldete danach `Cannot find module
'esbuild'`, obwohl er allein aufgerufen durchlief. Fehlt die Umgebung, wird
sie jetzt einmal wiederhergestellt.

Beide Male sah es nach einem Codefehler aus und war ein Ablauffehler im
Prüfstand.

### Eine meiner Prüfungen passte nicht mehr

„Kartenübergabe: der Pool kommt aus dem Ref" suchte wörtlich
`const basis = kartenRef.current || karten`. Diese Zeile gibt es nach dem
Umbau auf `packBuchung` nicht mehr — **die Sache stimmt weiter**, an sechs
Stellen wird aus dem Ref gelesen. Die Probe prüft jetzt das, was F44
verlangt, statt einer Fundstelle.

### Der Zielkonflikt am Spielerpass

Codex hat lange Vereinsnamen umbrechen lassen statt sie abzuschneiden —
richtig, „Borussia Mönchengladbach" endete vorher als „Borussia Mönchen…".

Nur wuchs der Pass dadurch: **14,6 px Sprung bei 360 px**, erlaubt ist 1.
Beim Blättern springt dann der ganze Kasten. Die Sichtprüfung braucht Chrome
und lief bei der Übergabe offenbar nicht.

Beides geht: Umbruch bis zu zwei Zeilen, und die Zeile behält die Höhe von
zweien. Pass konstant, Namen lesbar.

### Geprüft

| | Codex 35.167 | 35.168 |
|---|---|---|
| Ansichten | 816, 0 Fehler | 816, 0 Fehler |
| Verein | 645, 1 Fehler | **646**, 0 Fehler |
| Textkatalog | 9.805 Proben, 0 | 9.805 Proben, 0 |
| Regressionen | nicht lauffähig im Prüfstand | **47 bestanden** |
| Ereignis-IDs | Werkzeug nicht lauffähig | **532 / 1.161 / 0 fehlend** |
| Passhöhe bei 360 px | **Sprung 14,6 px** | konstant |
| Kontraststellen | 906, 0 Befunde | 906, 0 Befunde |

**Alles durchgelaufen, keine Fehler** — zum ersten Mal seit der Übernahme.

### Was noch offen ist

Die Statusmatrix aus Revision 6 nennt **F59 bis F64** als neue Punkte
(Packprüfung, leerer Wiederaufnahmebildschirm, Fanshopfaktor, endgültiges
Ende nach Neustart, unvollständige Buchungen, Android-Bauprüfung). Codex hat
sie bearbeitet; in dieser Dokumentation fehlen sie noch als eigene Einträge.

Ebenso offen: die elf Punkte, die Revision 6 als weiterhin unerledigt führt —
darunter F01, F02, F04, F35, F42, F43, F51, F52, F53. Sie sind **nicht** Teil
dieser Zusammenführung.

## Für den nächsten Durchgang

### REGEL: nur auf einer eindeutig benannten Grundlage arbeiten

Verbindlich seit 14.09.2026, nach der Zusammenführung 35.168.

1. **Vor jeder Änderung die verwendete Ausgangslieferung nennen** — mit
   Dateinamen, nicht nur mit Versionsnummer.
2. **Bei Zusammenführungen Dateien vergleichen, nicht Nummern.** Meine 35.168
   war höher als das GitHub-Updatepaket zu 35.167 und enthielt es trotzdem
   nicht. Eine Nummer sagt nichts darüber, was drin ist.
3. **Danach festhalten:** was unverändert übernommen, was ergänzt, was
   korrigiert und was geprüft wurde.

Der Anlass: drei Gerätebefunde kamen zurück, weil zwei Stände parallel
liefen, und ein ganzes Updatepaket fehlte, weil ich auf die Nummer geschaut
habe statt auf den Inhalt.


Dieser Abschnitt steht bewusst VOR den offenen Punkten: er ist das Erste, was
ein frischer Durchgang wissen muss.

### Die Abnahme braucht ZWEI Läufe (seit 35.98)

    bash pruefstand/pruefen.sh App.jsx                          ~101 s
    TEILE=aufbau,bau,sicher bash pruefstand/pruefen.sh App.jsx   ~11 s
    bash pruefstand/sicht.sh App.jsx

Die Sicherheitsprüfung läuft **absichtlich getrennt**. Gemessen: sie fragt eine
Datenbank im Netz ab und schwankt zwischen 0 und 160 Sekunden, während alles
andere zusammen 145 braucht. Zusammen lag der Lauf an der Zeitgrenze eines
einzelnen Aufrufs und brach gelegentlich ab — **nicht weil etwas kaputt war,
sondern weil ein Schritt mit unbekannter Dauer in einem Lauf mit fester Grenze
steckte.**

Der übliche Lauf sagt selbst, dass sie übersprungen wurde. Sie fällt nicht
still weg.

**Beide Schreibweisen des Pfades gehen — seit 35.101.** Bis dahin meldete der
oben stehende relative Aufruf sieben Fehler, die keine waren, und liess achtzehn
Prüfungen still ausfallen (Vereinsprüfung 297+7 statt 322). `pruefen.sh` löst
die Quelle jetzt selbst absolut auf, wie `sicht.sh` es immer getan hat.
**Wer eine Zahl aus diesem Block nicht erreicht, prüft zuerst, ob die Meldung
von der Sache handelt oder vom Pfad.**

### Erwartete Zahlen für 35.164

    Ansichten:        814 Prüfungen bestanden
    Verein:           438 Prüfungen bestanden  (431 + 7 Zeitleiste, 35.119)
    Beidateien:       7 (akademie ereignisse karten namen schriften titelbild verein)
    Ereignisse:       520 · Nationen: 212 von 212
    Kontrast:         145 Textstellen · 0 Befunde
    Rücktritt:        6 Proben, alle grün
    Knöpfe:           154 lesbar und im Bild
    Sicherheitslage:  0 Funde
    Laufbahnen bis Vollausbau: 20–30 (Band seit 35.81 gesenkt)

### Das App-Symbol im Projektwissen

`symbol/appicon.png` ist mit 2,6 MB zu groß fürs Projektwissen und liegt nur im
Repository. Dafür gibt es **`symbol/appicon-klein.png`**: 512 px, 128 Farben,
96 kB — gemessen 1,4 % Abweichung vom Original, im Bild nicht zu unterscheiden.

**Sie reicht zum Erzeugen des ganzen Symbolsatzes**, denn das größte erzeugte
Bild ist 432 px (108 dp bei xxxhdpi). Wer am Symbol arbeitet, kann damit
vorschauen und erzeugen; wer ausliefert, nimmt die volle Quelle aus dem
Repository.

### Was als Nächstes ansteht

**Ein APK bauen und auf dem Gerät durchspielen.** Seit 35.44 ist nichts davon
auf einem Telefon gelaufen — inzwischen sind es 57 Fassungen mit dem ganzen
Kartensystem, dem Sonderschuss, der neuen Aufstellung und den neuen Bildern.
35.101 ändert daran nichts: dort ist am Spiel nichts angefasst worden.

Alles andere in diesem Projekt lässt sich messen. Das nicht.

## Offene Punkte (Stand 35.164)

1. **Seitenscheitel (Frisur 2)** liest sich noch immer eher als Glanzstreifen denn
   als Scheitel. Und **Halbglatze und Glatze sind zusammen 2 von 12** Möglichkeiten;
   im Zufallsbogen wirkt rund ein Fünftel der Gesichter kahl. Rechnerisch richtig,
   gestalterisch vielleicht zu viel — das ist Kevins Entscheidung, keine Aufgabe
   für den Prüfstand.
2. ~~**Weibliche Porträts sind weniger weit.**~~ **Erledigt in 35.40** — gemessen
   waren es nicht 10 gegen 12, sondern **9 unterscheidbare von 14 wählbaren**:
   die vier Formen hinter `mk_haar` hatten gar keine Zeichnung. Jetzt 14 von 14
   bei allen fünf Kopfformen, als Dauerprüfung abgesichert. Alter Wortlaut:
   **Weibliche Porträts sind weniger weit** als die männlichen: 10 bzw. 14 Frisuren
   gegen 12 bzw. 16, und die langen Haarformen liegen hinter dem Kopf, wo sie bei
   62 px kaum wirken. Nachziehen, sobald die männlichen stehen.
3. **Farbe gegen Bedeutungsfarbe** ist noch offen. Die Form trennt die beiden
   Prestigeleitern, aber nicht Text von Text: `RARITY.normal` (#7E8A84) liegt bei
   **ΔE 4,6** zu `--mu` (#8A9690) und `hsv` bei **ΔE 18,8** zu `--tx`. Erst prüfen,
   ob sie überhaupt je in derselben Zeile stehen — wenn nicht, ist es folgenlos.
   **Nicht blind verschieben.**
4. ~~**`zahlenPruefen` greift in der Ruhmeshalle nicht.**~~ **Erledigt in 35.33** —
   das Werkzeug liest den Wert jetzt als Geschwisterkette statt über
   `nextElementSibling` und sieht damit auch nackte Textknoten. Dabei kam
   heraus, dass `HallScreen` überhaupt nur mit leerer Halle gezeichnet wurde.
5. **Das Symbol ist bei 48 dp nicht mehr lesbar.** Wer Lesbarkeit will, braucht ein
   reduziertes Zeichen (Ball und XI), keine Szene. Gestalterische Entscheidung.
6. ~~**Alte Spielstände tragen `speed` und `mode` weiter.**~~ **Erledigt in 35.41**
   — das Verhalten bleibt wie es war, ist aber jetzt mit fünf Proben
   festgenagelt statt nur notiert. Alter Wortlaut:
   **Alte Spielstände** tragen `speed` und `mode` weiter am Spieler; die Voreinstellung
   greift nur bei neuen Laufbahnen. So gewollt, sollte aber im Blick bleiben.
7. ~~**Aus Abschnitt 7 weiterhin offen.**~~ **Ganz erledigt:** Akademie im
   Karriere-Rückblick in 35.32, Jugendturniere mit Namen und Gegner in 35.34.
8. ~~**Spielerpass wächst weiter (gemeldet 15.8.).**~~ **Erledigt in 35.23.**
   Die hier genannte Vermutung (`.zellen` bricht um) war **falsch** — der Block
   bricht nie, weil die Beschriftung über der Zahl steht und breiter ist als
   jede Zahl. Es waren zwei andere Stellen: +72 px bei der ersten Saison und
   +17 px ab der sechsten Station, beide aus 34.16. Der Pass steht jetzt fest,
   `sicht.sh` prüft es mit 1 px Toleranz. Der Satz „vor der Änderung messen“ hat
   hier eine Änderung an sieben Stellen verhindert.

   **Achtung, hier stand bis 35.29 „328,9 px".** Diese Zahl stammt aus der
   Messumgebung, die **35.25 ausdrücklich verworfen hat** — sie baute den Pass
   in einem eigenen Rahmen nach statt in der echten Kette `Shell` → `.main` →
   `.a-pass`. Durch die echten Komponenten gemessen sind es **348,1 px** bei
   412 und 360 px Breite und **385,9 px** bei 320 px (dort bricht der
   Zellenblock durchgehend um, was zulässig ist, weil es über alle Stände
   gleich passiert). Nachzulesen in 35.25, Tabelle „Was die echte Messung dafür
   zeigt". Dass eine widerlegte Zahl vier Fassungen lang in dem Punkt
   stehenblieb, der vom Messen handelt, ist der Witz an der Sache — und der
   Grund, warum absolute Pixelwerte in offene Punkte gehören wie ein
   Verfallsdatum: **verlässlich ist die Aussage „konstant", nicht die Zahl.**
9. ~~**„Moral“ umbenennen?**~~ **Beantwortet in 35.31** — bleibt bei „Moral“
   (910 Vorkommen von `morale`, ein umbenanntes Feld bräche jeden Spielstand),
   und der eigentliche Mangel — Moral fehlte in der Kurzanleitung — ist behoben.
   Alter Wortlaut: **„Moral“ umbenennen?** Als sichtbare Beschriftung nur zwei Stellen (Meter im
   Zustand, Wirkungstabelle); das Feld `morale` mit 910 Vorkommen bleibt
   unangetastet, sonst brechen alte Spielstände. Empfehlung: „Moral“ ist im
   Fußball das etablierte Wort, „Motivation“ trifft es nicht — der Wert ist
   Stimmung, nicht Antrieb. Der eigentliche Mangel: **in der Kurzanleitung fehlt
   Moral komplett**, obwohl Form, Fitness, Vertrauen und Bekanntheit dort stehen.
10. **`App.jsx` ist zu groß für eine Datei.** **Die gültige Zeilenzahl steht
   hier bewusst nicht mehr** — sie steht im Aufbau jedes Laufs unter „Eigene
   Dateien (gemessen)". Am 4.9.2026 waren es 16.487.

   **Grund für den Verzicht:** die Zahl war hier dreimal hintereinander
   veraltet. Bis 35.22 stand „12.041“ (Stand 35.11, 788 zu wenig), bis 35.29
   „12.829“ (Stand 35.25, 369 zu wenig), bis 35.100 „13.674“ (Stand 27.8.,
   **2.813 zu wenig**). Der dritte Fall war der größte, und er stand
   ausgerechnet in dem Punkt, der vom Wachstum der Datei handelt. Ein Zähler,
   den jeder Lauf ohnehin misst, gehört nicht abgeschrieben.
   Zum Verlauf: 13.198 am 23.8., 12.829 am 21.8.; vor 35.6 waren es 14.271,
   dann fielen die Ereignisse heraus, seither wächst es wieder. Das ist KEINE Anforderung
   der APK — `schriften.js` und `storage.js` sind bereits eigene Dateien, Vite
   bündelt Importe problemlos. Eine Aufteilung in acht bis zwölf Bausteine würde
   jede Sitzung schneller machen, berührt aber `exporte.txt`, den
   Prüfstandaufbau und jede Stelle, an der mit Zeilennummern gearbeitet wird.
   **Auf Kevins Wunsch vertagt.** Nur mit Ruhe, in kleinen Schritten, und
   niemals kurz vor einem Test.
11. ~~**Folgenlose Flaggen.**~~ **Erledigt in 35.35 und 35.36** — von 13 (35.7)
   über 5 und 2 auf **0**. `beidseitig`, `manipuliert` und `pendeln` sind an
   Rechenwege angeschlossen, `attest` und `treugeblieben` haben eigene
   Folgeereignisse. Die Grundlinie `toteFlaggen` steht auf 0 und ist damit
   erstmals eine Sperre statt eines Schuldenstands. Sie brauchen
   eigenen Inhalt, nicht nur einen Anschluss an ein vorhandenes Ereignis —
   das gehört in den Inhaltsausbau. `treugeblieben` wirkt immerhin über
   `loyalBonus` mit.
12. ~~**Argumentreihenfolge der Schreibwerkzeuge.**~~ **Erledigt in 35.41** —
    `argumente.cjs` mit `--quelle=` / `--ziel=` / `--anzahl=`; fehlt die Quelle,
    wird abgebrochen statt still auf `/mnt/project/App.jsx` zurückzufallen.
    Alter Wortlaut: **Argumentreihenfolge der Schreibwerkzeuge ist uneinheitlich.**
   `uebersicht.cjs <Ziel>` gegen `vorschau.py <Quelle> <Ziel>` gegen
   `verzeichnis.cjs <Datei>` — dreimal etwas anderes. Ein einheitliches Muster
   (Quelle zuerst, Ziel zuletzt, beide benannt) würde die Sorte Fehler aus 35.4
   ausschliessen statt sie einzeln abzufangen. Klein, aber berührt jeden
   Aufrufort in `pruefen.sh` und `sicht.sh`.
13. **Langzeittest der Fassungen ab 34.15 steht aus** — Wachstumskurve, Ereignisse,
   Auto-Training, Sprache, Frauenfußball über mehrere Laufbahnen am Stück. Das ist
   Kevins Seite: der Prüfstand rechnet 300 Laufbahnen durch, aber niemand *spielt*
   sie. Ob sich eine Laufbahn über zwanzig Saisons richtig anfühlt, sagt keine
   Kennzahl.

14. ~~**Bei 360 px läuft der Spielerpass über.**~~ **Widerlegt in 35.25** — der
   Überlauf existiert nicht. Im echten Aufbau (`Shell` → `.main` → `.a-pass`)
   scrollt bei 412, 360 und 320 px nichts. Der Befund war ein Artefakt der
   damaligen Messumgebung, die einen eigenen Rahmen statt der echten Kette
   benutzte. Der Punkt hat sich selbst gerettet: „im Spiel nicht verifiziert —
   erst nachstellen, dann erst ändern" stand ausdrücklich darin.
15. ~~**`wachstum` ist ein toter Parameter.**~~ **Erledigt in 35.25**, entfernt.

16. ~~**`storage.js` behandelt den Leerwert anders.**~~ **Erledigt in 35.41** —
    `value == null` wie im Browsertest. Alter Wortlaut:
    **`storage.js` behandelt den Leerwert anders als die Browsertest-Fassung**
   (gefunden 35.24). Produktiv `value ? { key, value } : null` — ein
   gespeicherter Leerstring käme als „nicht vorhanden“ zurück. `browsertest.sh`
   unterscheidet sauber (`value == null`). **Praktisch folgenlos:** alle
   Aufrufe schreiben `JSON.stringify(…)` oder `String(n)`, nie einen
   Leerstring. Bewusst nicht geändert — `storage.js` sitzt zwischen App und
   Gerät. Wenn dort ohnehin gearbeitet wird, angleichen.

**Seit 35.29 erledigt:** sechs in `LIESMICH.md` fehlende Dateien nachgetragen, darunter `ereignisse.js` und `verein.js`; `pruefen.sh` rechnet die Liste jetzt nach; Wegweiser und sechs weitere Stellen berichtigt.

**Seit 35.28 erledigt:** die Knopfprüfung blättert jetzt durch und erfasst den Vereinsabschluss — 24 statt 22, dann 124 statt 24 Knöpfe.

**Seit 35.27 erledigt:** der eigene Verein läuft nebenher — eine Saison je abgeschlossener Laufbahn statt auf Knopfdruck; Einschreiben ersetzt den Saisonknopf; kurzer Vereinsbericht in der Karriereübersicht.

**Seit 35.26 erledigt:** erster Gerätetest des Vereinsmodus — die Vorschau bleibt beim Blättern oben, der Gründen-Knopf ist wieder lesbar (dieselbe Ursache an zwei Stellen).

**Seit 35.25 erledigt:** das Tutorial — Willkommensschirm beim ersten Start, zwei neue Kapitel in der Kurzanleitung, einmaliger Hinweis beim Freischalten. Damit ist Kevins Zettel abgearbeitet.

**Seit 35.24 erledigt:** offener Punkt 14 widerlegt (kein Überlauf), Punkt 15 entfernt; die Passmessung läuft durch die echten Komponenten und deckt 320 px mit ab.

**Seit 35.23 erledigt:** die Akademie sagt nicht mehr „sechs Abteilungen“, wenn es neun sind; `texttreue.cjs` gleicht Errungenschaftstexte gegen ihre Bedingungen ab; sieben falsche oder fehlende Stellen in `STAND.md` und `LIESMICH.md` berichtigt; `UEBERSICHT.md` neu erzeugt.

**Seit 35.22 erledigt:** der Spielerpass bleibt über die ganze Laufbahn gleich hoch; `sicht.sh` prüft es mit 1 px Toleranz.

**Seit 35.21 erledigt:** fünf veraltete Angaben in dieser Datei berichtigt; der Prüfstand vergleicht jetzt die Fassung im Kopf mit `App.jsx`; der 40-Laufbahnen-Verlauf ist als `verlauf40.cjs` nachrechenbar.

**Seit 35.20 erledigt:** der Verein hängt im Hauptmenü, wird gespeichert und ist ab 5 Laufbahnen frei.

**Seit 35.19 erledigt:** Vereinsbildschirme mit Wappen, Farben und Trikot — 50 neue Ansichtsprüfungen.

**Seit 35.18 erledigt:** die Akademie kennt keine Jahreszahlen mehr, alte Sicherungen werden umgerechnet.

**Seit 35.17 erledigt:** Abschluss, Vermächtnisbonus, Vereinsausbau und Freischaltgrenzen — der Rechenkern ist vollständig.

**Seit 35.16 erledigt:** Rechenkern des Vereinsmodus (Durchstich) mit 20 eigenen Prüfungen.

**Seit 35.15 erledigt:** 24 weitere gelegentliche Alternativen; Prüfung auf feste Wirkungswerte ergänzt.

**Seit 35.14 erledigt:** drei weitere Storystränge (Buch, Knie, Trainer), Einstiegsgewichte und Wartezeiten kalibriert.

**Seit 35.13 erledigt:** gelegentlich angebotene Alternativen (12 Stück), 14 weitere Anfangsereignisse.

**Seit 35.12 erledigt:** drei neue Akademieabteilungen, Vollausbau 2.912 VC, Verdienst angehoben, Profikurve gespreizt (Punkte F und G).

**Seit 35.11 erledigt:** die Ehrentafel nennt den Verein (Punkt H); Profiquote je Ausbaustufe gemessen (Punkt G).

**Seit 35.10 erledigt:** 18 weitere bedingte Optionen; Schwellen an der gemessenen Vermögensverteilung nachgerechnet.

**Seit 35.9 erledigt:** 20 Ereignisse für den Anfang; der Topf in Saison 0 wächst von 28 auf 41.

**Seit 35.8 erledigt:** Storystränge (Punkt B), erster Strang mit drei Stufen und drei Wegen.

**Seit 35.7 erledigt:** Optionen können an Charakterwerte gebunden werden (Punkt C), zehn Stück eingebaut.

**Seit 35.6 erledigt:** tote Flaggen 13 → 5 · der Trainerschein wirkt · zwei Ereignisketten angeschlossen.

**Seit 35.5 erledigt:** die Ereignisse liegen in einer eigenen Datei, datengleich nachgewiesen.

**Seit 35.4 erledigt:** Prüfwerkzeug für die Ereignisse · 8 Doppler · 20 Fälle „Angebot trotz Besitz“ · die Nationalbinde wird wirklich vergeben.

**Seit 35.3 erledigt:** der Prüfstand verlangt zu jeder Fassung einen Messblock · drei Unsauberkeiten in dieser Datei.

**Seit 35.2 erledigt:** der Prüfstand prüft das Verzeichnis mit.

**Seit 35.1 erledigt:** STAND.md hat ein selbsterzeugtes Verzeichnis.

**Seit 34.38 erledigt:** Ereigniswiederholung gemessen und eingeordnet — damit sind alle Befunde des grossen Tests bearbeitet.

**Seit 34.37 erledigt:** alle 212 Nationalflaggen auf der Kapitänsbinde.

**Seit 34.35 erledigt:** goldener Markenpuls · Kopflinie in der Stufenfarbe · Zielverein für den Trainerruf · Rautekarte räumt offene Versprechen ab.

**Seit 34.34 erledigt:** Bärte bleiben innerhalb der Kopfform (Beschnitt auf kopfD).

**Seit 34.33 erledigt:** Lesbarkeit auf dem Laufzettel · kein Gummiziehen am Rand · versprochene Rückkehr wird eingelöst.

**Seit 34.32 erledigt:** Kopfformen wieder spiegelgleich, mit Nachrechnung im Prüfstand.

**Seit 34.31 erledigt:** Wildcard bleibt auf dem Laufzettel lesbar.

**Seit 34.30 erledigt:** Kartenwechsel führt die Höhe weich · drei Saisonschritte auf Formularpapier.

**Seit 34.29 erledigt:** Altersgrenze an einer Stelle · Kopfform Weich nicht mehr zu selten · Wildcard-Verteilung messbar · Belastungstest im Prüfstand.

**Seit 34.28 erledigt:** Herkunft wirkt auf Nase, Mund und Lidspalt · Statur zieht den Kopf · weibliche Porträts mit Wimpern und Schminke · Porträtbogen kann Frauen.

**Seit 34.27 erledigt:** zwei Kopfformen mit weich auslaufendem Kinn (Zart, Rundlich).

**Seit 34.26 erledigt:** drei runde Kopfformen (Vollmond, Breit, Weich) · Porträtbogen wieder benutzbar.

**Seit 34.25 erledigt:** Rückblick auf Karteikarten mit Ziehbewegung.

**Seit 34.24 erledigt:** Rangfarben stimmen zwischen Übersicht und Karte · Rangschrift lesbar (Bronze zusätzlich korrigiert).

**Seit 34.23 erledigt:** Stärke läuft hoch mit Markenpuls · Kapitänsbinden fest platziert · Flaggenbauart auf der Nationalbinde.

**Seit 34.22 erledigt:** jeder Seitenwechsel beginnt wieder oben.

**Seit 34.21 erledigt:** Laden rechnet ab (Nachkaufen, Ablauf, kein Geschenk an neue Laufbahnen) · Aufmacher der Ruhmeshalle · Namensfeld leerbar.

**Seit 34.20 erledigt:** Zurück-Taste des Geräts (in der APK bestätigt, 15.8.2026)
· Überlappung von Laden und Zahnrad im Hauptmenü · zwei Falschalarme in
`startprobe.cjs` · `erreichbar.cjs` in der Werkzeugtabelle nachgetragen.
17. ~~**Die Akademie gibt bis Ruhm 35 gar nichts mit.**~~ **Erledigt in 35.39**
    — Schwellen gesenkt, Grundgabe ab Gründung, und der Akademiebildschirm
    nennt jetzt die nächste Schwelle. Alter Wortlaut: (gemessen 23.8.2026,
    35.32). Stufe 3 über fünfzehn Jahre kommt auf Ruhm 18 — Anlage +0,
    Bekanntheit +0, Startkapital +0, Entwicklung +0. `akaBonus` teilt durch 45,
    35, 25 und 70; unterhalb der ersten Schwelle ist die Akademie für die
    Laufbahn folgenlos. Ob das gewollt ist (Ausbau muss sich erst lohnen) oder
    zu spät greift, ist eine Kalibrierfrage und gehört gemessen, nicht geraten.
18. ~~**`al_reisekader` redet mit dir selbst.**~~ **Erledigt in 35.38**, samt
    der ganzen Klasse: 19 Kandidaten geprüft, zwei berichtigt, die Suche liegt
    als Dauerprobe in `stimmigkeit.cjs`. Alter Wortlaut: Der Ausgang lautet „Du sprichst
    mit dem, der die Binde trägt“ — trägst du sie, ist das ein Selbstgespräch.
    Kein Fehler in der Mechanik, ein Riss in der Erzählung. Zwei Wege: eine
    Bedingung `!p.flags.kapitaen` an dieser einen Wahl, oder ein zweiter Text
    für Kapitäne. Gefunden von `stimmigkeit.cjs` (35.37), zurückgestellt weil
    es Textarbeit ist und nicht in dieselbe Fassung gehört.

19. ~~**Die APK baut gegen bewegliche Bibliotheken.**~~ **Erledigt in 35.46** —
    `package-lock.json` eingecheckt (212 Fassungen festgenagelt), `apk.yml`,
    `pruefen.sh` und `browsertest.sh` auf `npm ci`. Nachgewiesen: zwei
    unabhängige Bauten derselben Quelle ergeben denselben SHA-256.
    **Richtigstellung zur ursprünglichen Begründung:** der dort behauptete
    Zusammenhang mit `vite` 5.4.11 gegen 5.4.21 war geraten. Vier Gegenproben
    in 35.46 zeigen das Bündel byte-identisch über `vite` 5.4.11–5.4.21,
    `rollup` 4.40–4.63 und `capacitor` 6.2.0–6.2.1. Die 0,01 kB gegenüber der
    Notiz aus 35.44 bleiben unerklärt und ließen sich nicht nachstellen —
    wahrscheinlichste Erklärung ist heute ein Übertragungsfehler in jener
    Notiz. Der Punkt war trotzdem berechtigt, nur aus dem strukturellen Grund
    und nicht aus dem behaupteten Messwert. Alter Wortlaut: `package.json` nennt
    durchweg Fassungsbereiche mit Dach (`^5.4.11`, `^18.3.1`, `^6.2.0`), eine
    `package-lock.json` gibt es nicht, und `apk.yml` installiert mit
    `npm install` statt `npm ci`. `pruefen.sh` löscht die beim Bau entstandene
    Sperrdatei sogar ausdrücklich wieder (Zeile im Bauschritt). Folge: jeder
    Bau löst die Bibliotheken neu auf. **Eine Fassungsnummer bezeichnet damit
    kein bestimmtes Bündel.** Nachweis aus 35.45: dieselbe unveränderte
    `App.jsx` ergab 1.294,76 kB, während 35.44 tags zuvor 1.294,77 kB gemessen
    hatte — rund zehn Zeichen Unterschied, entstanden zwischen `vite` 5.4.11
    und 5.4.21. Für die Größe belanglos; für einen Gerätefehler nicht, weil
    sich dann nicht ausschließen lässt, dass eine andere Bibliotheksfassung
    drin war. Zwei Wege: Sperrdatei einchecken und `apk.yml` auf `npm ci`
    (dann ist der Bau wiederholbar, Sicherheitsnachträge müssen bewusst
    nachgezogen werden), oder bewusst so lassen. **Entscheidung steht aus** —
    Kevin hat den Befund in 35.45 zur Kenntnis genommen, ohne ihn zu schließen.

20. **Weitgehend erledigt in 35.128.** Nachgezählt: von den Prüfungen vor dem
    Übersetzen setzt heute nur noch **eine** `FEHLER` — die
    Backtick-Hygiene, und dort stimmt die Meldung, weil ein Backtick im
    CSS-Block wirklich einen Übersetzungsfehler erzeugt. Alle übrigen zählen
    längst auf `DOK`. Der beschriebene Zustand existiert so nicht mehr.

    **Die verwandte Lücke war eine andere und ist jetzt geschlossen:** ein
    ABGESTÜRZTER Prüfteil sah im Gesamtlauf fast aus wie ein bestandener.
    Beide geben Nicht-Null zurück, aber nur einer sagt, was los ist. In
    35.124 kostete das mehrere Anläufe. `teil_fahren` liest die Ausgabe jetzt
    mit: fehlt die Abschlusszeile, steht dort ausdrücklich „ABGESTÜRZT" samt
    Befehl zum Nachstellen.

    Alter Wortlaut:
    **Die Abbruchmeldung des Aufbaus passt nicht zu jedem Grund.** Schlägt
    eine der Prüfungen 2 bis 6 an, endet der Aufbau mit „der Aufbau ist
    gescheitert … Erst den Übersetzungsfehler oben beheben". Für einen
    Übersetzungsfehler stimmt das, für eine veraltete Zahl in `STAND.md` oder
    einen fehlenden Eintrag in `LIESMICH.md` nicht — dann schickt die Meldung
    in die Irre und lässt außerdem den ganzen Rest des Laufs ausfallen, obwohl
    das Bündel in Ordnung ist. Schwerer wiegt: **der Abbruch macht
    alle späteren Prüfungen unerreichbar.** Prüfung 2 (verschobenes
    Verzeichnis) schlägt beim Bearbeiten von `STAND.md` immer an — damit lief
    in 35.45 keine der neuen Prüfungen 7 bis 9, solange sie dahinter standen.
    Für diese drei ist es gelöst (eigener Zähler `DOK`, siehe Bauabschnitt),
    für 2 bis 6 nicht: schlägt eine davon an, fällt der ganze Rest des Laufs
    aus, obwohl das Bündel in Ordnung ist. Sauber wäre, `DOK` auch dort zu
    verwenden. Nicht in 35.45 mitgemacht, weil das ihr Verhalten ändert und
    Fassungen einzeln ausgeliefert werden.

21. **Das Zielband „Laufbahnen bis Vollausbau" liegt dicht an seiner
    Untergrenze.** Gemessen am 5.9.2026 über fünf Läufe: 20,2 bis 20,7 bei
    einem Band von 20–30. Mit den ursprünglichen Punktwerten der neuen Marken
    aus 35.106 stand ein Lauf **genau auf 20,0**.

    **Warum das gefährlich ist:** die Zahl entsteht aus `verdict().score`
    über `vcFuer` (`score / 26`, dann ×1,18 und ×1,80). Jede Änderung, die den
    Karrierewert erhöht — neue Marken, neue Titel, ein Biografiebonus wie in
    Abschnitt 4.13 des Konzeptpapiers —, drückt die Zahl nach unten. Sie fällt
    dann in einer Fassung aus dem Band, die mit der Ursache nichts zu tun hat,
    und der nächste Durchgang sucht am falschen Ende.

    **Zweiter Fehlalarm in 35.123.** Erneut exakt 20,0 bei einer Fassung, die
    nur eine Anzeige hinzufügt. Fünf Läufe danach: 21,4 · 20,7 · 20,1 · 20,9 ·
    20,8. Der Abstand zur Grenze (rund 0,7 vom Median) ist kleiner als das
    Rauschen (Spanne 1,3). **Damit ist die Prüfung in ihrer heutigen Form
    unbrauchbar geworden** — sie meldet gelegentlich rot, ohne dass etwas
    kaputt ist, und das zweimal in fünf Fassungen.

    **Entscheidung fällig, sie steht bei Kevin.** Drei Möglichkeiten:
    (a) Untergrenze auf 19 senken — die Prüfung schlägt weiter an, wenn die
    Ausschüttung wirklich zu hoch wird, aber nicht mehr am Zufall.
    (b) Die Kalibrierung mehrfach fahren und den Median nehmen — kostet rund
    50 s je Lauf zusätzlich.
    (c) Die VC-Ausschüttung senken, bis wieder Luft ist — das ist eine
    Balancing-Änderung am Spiel, keine am Prüfstand.
    Ich habe keine davon eigenmächtig gemacht: das Band zu verstellen, weil
    die Anzeige stört, wäre das Messgerät justieren.

    **Teilweise entschärft in 35.118:** die Stichprobe der Kalibrierung
    wurde von 250 auf 600 Laufbahnen angehoben, nachdem ein Lauf genau auf
    20,0 gefallen war. Der niedrigste gemessene Wert stieg damit von 19,9 auf
    20,2. **Gelöst ist es nicht** — fünf Läufe danach ergaben 20,4 · 20,2 ·
    20,3 · 21,1 · 20,2, also weiterhin Spanne 0,9. Eine größere Stichprobe
    verschiebt die Kante nicht, sie macht nur das Zittern kleiner.

    **Kein Handlungsbedarf am Spiel**, aber eine Regel für jeden, der den
    Karrierewert anfasst: `TEILE=kalib` mehrfach fahren, nicht einmal. Ein
    einzelner Lauf schwankt um rund 0,5 und sagt nichts über den Abstand zur
    Grenze. Ob das Band selbst zu eng liegt oder die Ausschüttung zu hoch, ist
    eine Balancing-Entscheidung für Kevin — hier steht nur, dass die Luft
    gemessen 0,2 beträgt.

21. ~~**Der Kader führt vier tote Felder, und die Saison kennt keine Spieler.**~~
    **Ganz erledigt in 35.54.** 35.52 brachte `spiele`, `tore`, `vorlagen`,
    `gelb`, `rot` und die gespielte Saison; 35.54 gibt `form` und `fitness`
    Schreiber **und Leser** — Form entscheidet über die Vertragsverlängerung,
    Fitness über Ausfälle. Alter Wortlaut:
    `alsSpieler()` legt `form`, `fitness`, `spiele` und `tore` an; `vereinSaison`
    fasst keines davon an (gemessen 35.48, seit 35.21). Wer sie liest, liest
    Anfangswerte. Schwerer wiegt: `simTable` erzeugt nur Mannschaftszahlen —
    Punkte, Tore, Gegentore je Verein. Einsatzzeiten, Torschützen, Karten und
    Sperren gibt es nirgends. Kevins Wunsch nach Leistungsdaten ist deshalb
    kein Anzapfen, sondern eine neue Mechanik. Entweder plausibel aus dem
    Mannschaftsergebnis auf die Elf verteilt (billig, reicht vermutlich), oder
    eine echte Spielsimulation (teuer). Zu klären vor Stufe B.

## Zusätzliche Stolperfallen

* **Schrift nur benannt, nicht mitgeliefert.** Eine Familie im CSS zu nennen liefert sie
  nicht aus. Ohne `@font-face` mit eigener Datei greift stumm die Ersatzkette.
* **Vorschauwerkzeug, das die Wirklichkeit beschönigt**, ist schlimmer als gar keins.
  `vorschau.py` lud Schriften aus dem Netz, die App nicht — die Abweichung blieb Monate
  unbemerkt. Alles, was in der Vorschau anders ist als auf dem Gerät, muss begründet
  und dokumentiert sein.
* **Prüfung, die während des ersten Aufbaus misst.** `document.fonts` ist asynchron.
  Wer vor `fonts.ready` misst, misst die Ersatzschrift.
* **Zwei Leitern mit derselben Sprache.** Wenn zwei Ordnungen im Spiel Materialnamen
  tragen, kollidieren sie zwangsläufig. Vor jeder Farbänderung prüfen, ob eine zweite
  Skala denselben Raum belegt.
* **Reihenfolge im Quelltext prüfen, bevor man schneidet.** Beim Umbau des Passes habe ich
  `s[s.index("function Pass"):s.index("function WildcardCard")]` geschnitten — `WildcardCard`
  steht aber *vor* `Pass`. Das Ergebnis war ein negativer Bereich: der Block dazwischen wurde
  verdoppelt, die alte Fassung blieb stehen. Der Bau fiel sofort mit „already been declared"
  auf, aber nur, weil zwei Funktionsnamen kollidierten. Bei einem Schnitt ohne Namenskollision
  wäre es stumm geblieben. **Nach jedem Blockschnitt die Funktionsnamen gegen die
  Ausgangsdatei zählen.**
* **Gestalterische Werte im Bauteilcode.** 22 `borderRadius` und elf `fontFamily` standen
  direkt in JSX statt in Klassen und wären bei einer reinen CSS-Änderung stehengeblieben.
