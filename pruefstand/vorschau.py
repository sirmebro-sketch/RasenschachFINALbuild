#!/usr/bin/env python3
"""
Erzeugt aus App.jsx (Android-Fassung) eine Vorschaufassung für den Chat.

Unterschiede der beiden Fassungen — und nur diese:
  1. Speicher:  ./storage.js (Capacitor)  →  window.storage (Chat-Umgebung)
  2. Schriften: aus schriften.js            →  in die Datei hineinkopiert

Die Spielmechanik bleibt Zeichen für Zeichen identisch. Wenn dieses Skript
etwas nicht findet, bricht es ab — lieber gar keine Vorschau als eine, die
sich anders verhält als die App.

Aufruf:  python3 pruefstand/vorschau.py <App.jsx> <Ziel.jsx>
"""
import sys, re

if len(sys.argv) < 3:
    print("Aufruf: vorschau.py <App.jsx> <Ziel.jsx>"); sys.exit(1)
quelle, ziel = sys.argv[1], sys.argv[2]
s = open(quelle, encoding="utf-8").read()
schritte = []

def ersetze(alt, neu, name, pflicht=True):
    global s
    if alt in s:
        s = s.replace(alt, neu, 1); schritte.append(name)
    elif pflicht:
        print("ABBRUCH — nicht gefunden: " + name); sys.exit(1)

# --- 1. Einbindung von storage.js entfernen ---
ersetze('import { store } from "./storage.js";\n', "", "Einbindung entfernt")

# --- 2. Speicherprüfung auf die Chat-Umgebung umstellen ---
ersetze("""const hasStore = () => {
  try { return !!(store && typeof store.get === "function" && typeof store.set === "function"); }
  catch (e) { return false; }
};""",
"""const hasStore = () => {
  try { return !!(typeof window !== "undefined" && window.storage
    && typeof window.storage.get === "function" && typeof window.storage.set === "function"); }
  catch (e) { return false; }
};""", "Speicherprüfung umgestellt")

# --- 3. Alle Zugriffe umbiegen ---
vorher = len(re.findall(r"\bstore\.(get|set|delete)\(", s))
s = re.sub(r"(?<![\w.])store\.(get|set|delete)\(", r"window.storage.\1(", s)
nachher = len(re.findall(r"(?<![\w.])store\.(get|set|delete)\(", s))
if nachher:
    print("ABBRUCH — " + str(nachher) + " Zugriffe auf store nicht umgestellt"); sys.exit(1)
schritte.append(str(vorher) + " Speicherzugriffe umgebogen")

# --- 4. Schriften einsetzen ---
# Frueher wurden hier Schriften aus dem Netz nachgeladen. Das war der Grund,
# warum jede Vorschau typografisch richtig aussah und das Geraet nicht: die
# App lieferte gar keine Schriften mit. Jetzt liegen sie in schriften.js und
# werden hier hineinkopiert, damit Vorschau und App dieselbe Schrift zeigen.
import os
pfad = os.path.join(os.path.dirname(os.path.abspath(quelle)), "schriften.js")
if not os.path.exists(pfad):
    print("ABBRUCH — schriften.js nicht gefunden neben " + quelle); sys.exit(1)
sch = open(pfad, encoding="utf-8").read()
m = re.search(r"export const SCHRIFTEN = `(.*?)`;", sch, re.S)
if not m:
    print("ABBRUCH — SCHRIFTEN in schriften.js nicht lesbar"); sys.exit(1)
ersetze('import { SCHRIFTEN } from "./schriften.js";\n', "", "Einbindung schriften.js entfernt")
ersetze("const CSS = SCHRIFTEN + `\n", "const CSS = `\n" + m.group(1).strip() + "\n",
        "Schriften eingesetzt (" + str(round(len(m.group(1))/1024)) + " KB)")

# --- 5. Kennzeichnung, damit die beiden Fassungen nie verwechselt werden ---
ersetze('const VERSION_INFO = "', 'const VERSION_INFO = "Vorschau · ', "Fassung gekennzeichnet")

# --- 6. Gegenprobe: nichts darf übrig bleiben ---
rest = re.findall(r'from "\./storage\.js"|from "\./schriften\.js"|(?<![\w.])store\b(?!\w)|\bSCHRIFTEN\b', s)
if rest:
    print("ABBRUCH — Reste gefunden: " + str(set(rest))); sys.exit(1)
if "@font-face" not in s:
    print("ABBRUCH — Schriften fehlen in der Vorschau"); sys.exit(1)
if "window.storage" not in s:
    print("ABBRUCH — window.storage fehlt"); sys.exit(1)

open(ziel, "w", encoding="utf-8").write(s)
print("Vorschaufassung gebaut: " + ziel)
for x in schritte: print("  + " + x)
