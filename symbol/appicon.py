#!/usr/bin/env python3
"""
Erzeugt aus einem quadratischen Bild den vollständigen Symbolsatz für Android.

Warum das nötig ist: Android legt seit Version 8 eine eigene Maske über jedes
App-Symbol — je nach Startbildschirm ein Kreis, ein Squircle oder ein
abgerundetes Quadrat. Ein fertig gerahmtes Bild bekommt dadurch eine zweite
Rundung und einen dunklen Ring. Deshalb wird hier
  * der eingebaute Rahmen entfernt,
  * das Bild auf die mittleren 72 von 108 Einheiten gelegt (die Fläche, die
    jede Maske sicher zeigt),
  * der Rand ringsum mit einer unscharfen Vergrößerung aufgefüllt, damit bei
    der Wischbewegung des Startbildschirms nichts leer läuft.

Aufruf:  python3 appicon.py <Bild.png> <Zielverzeichnis> [Rahmenbreite]
"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter

if len(sys.argv) < 3:
    print("Aufruf: appicon.py <Bild.png> <Zielverzeichnis> [Rahmenbreite]"); sys.exit(1)
quelle, ziel = sys.argv[1], sys.argv[2]
rahmen = int(sys.argv[3]) if len(sys.argv) > 3 else None

im = Image.open(quelle).convert("RGB")
W, H = im.size
if W != H:
    s = min(W, H)
    im = im.crop(((W - s) // 2, (H - s) // 2, (W - s) // 2 + s, (H - s) // 2 + s))
    W = H = s

# --- Rahmen bestimmen, falls nicht vorgegeben: wie weit reicht das Schwarz? ---
if rahmen is None:
    px = im.load()
    def dunkel(x, y, s=26):
        r, g, b = px[x, y]; return r < s and g < s and b < s
    links = next((x for x in range(W // 3) if not dunkel(x, H // 2)), 0)
    oben  = next((y for y in range(H // 3) if not dunkel(W // 2, y)), 0)
    rahmen = int(max(links, oben) * 1.25)      # etwas Zugabe für die helle Kante
print("Rahmen entfernt: %d Pixel je Seite" % rahmen)
kunst = im.crop((rahmen, rahmen, W - rahmen, H - rahmen))
print("Bildinhalt: %dx%d" % kunst.size)

# --- Ebenen bauen ---
ANTEIL = 72 / 108        # sichere Fläche der Maske

def vordergrund(kante):
    """Scharfes Bild auf den mittleren 72 von 108 Einheiten, außen durchsichtig.

    Die Kante läuft weich aus. Ohne das steht das scharfe Bild als hartes
    Rechteck auf der unscharfen Auffüllung — unter einer runden Maske sieht
    man dann ein Quadrat im Kreis. Der Saum ist 4 % der Innenkante breit;
    volle Deckung bleibt damit innerhalb der sicheren Fläche von 66/108."""
    innen = int(round(kante * ANTEIL))
    b = Image.new("RGBA", (kante, kante), (0, 0, 0, 0))
    bild = kunst.resize((innen, innen), Image.LANCZOS).convert("RGBA")
    saum = max(2, int(innen * .04))
    m = Image.new("L", (innen, innen), 0)
    ImageDraw.Draw(m).rectangle([saum, saum, innen - 1 - saum, innen - 1 - saum], fill=255)
    bild.putalpha(m.filter(ImageFilter.GaussianBlur(radius=saum * .6)))
    b.paste(bild, ((kante - innen) // 2,) * 2)
    return b

def hintergrund(kante):
    """Unscharfe Vergrößerung als Auffüllung — nie eine leere Ecke."""
    gross = kunst.resize((kante, kante), Image.LANCZOS)
    return gross.filter(ImageFilter.GaussianBlur(radius=max(3, kante // 26))).convert("RGBA")

def flach(kante, rund=False):
    """Fertiges Bild für ältere Android-Fassungen ohne Maskensystem."""
    b = hintergrund(kante).copy()
    v = vordergrund(kante); b.paste(v, (0, 0), v)
    m = Image.new("L", (kante, kante), 0); d = ImageDraw.Draw(m)
    if rund: d.ellipse([0, 0, kante - 1, kante - 1], fill=255)
    else:    d.rounded_rectangle([0, 0, kante - 1, kante - 1], radius=int(kante * .16), fill=255)
    aus = Image.new("RGBA", (kante, kante), (0, 0, 0, 0)); aus.paste(b, (0, 0), m)
    return aus

DICHTEN = [("mdpi", 1), ("hdpi", 1.5), ("xhdpi", 2), ("xxhdpi", 3), ("xxxhdpi", 4)]
res = os.path.join(ziel, "res")
for name, f in DICHTEN:
    ordner = os.path.join(res, "mipmap-" + name)
    os.makedirs(ordner, exist_ok=True)
    k108, k48 = int(round(108 * f)), int(round(48 * f))
    vordergrund(k108).save(os.path.join(ordner, "ic_launcher_foreground.png"))
    hintergrund(k108).save(os.path.join(ordner, "ic_launcher_background.png"))
    flach(k48).save(os.path.join(ordner, "ic_launcher.png"))
    flach(k48, rund=True).save(os.path.join(ordner, "ic_launcher_round.png"))
    print("  mipmap-%-8s 108dp = %4d px · 48dp = %3d px" % (name, k108, k48))

# --- Die Beschreibung, die Android das Zusammensetzen erklärt ---
anydpi = os.path.join(res, "mipmap-anydpi-v26")
os.makedirs(anydpi, exist_ok=True)
# Kein <monochrome>: Android nutzt davon nur die Alphamaske, und die waere
# bei einem vollflaechigen Bild ein einfarbiger Klotz. Ohne den Eintrag
# zeigt der Startbildschirm im Themenmodus das normale Symbol.
xml = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
"""
for n in ["ic_launcher.xml", "ic_launcher_round.xml"]:
    open(os.path.join(anydpi, n), "w", encoding="utf-8").write(xml)
print("  mipmap-anydpi-v26/ic_launcher.xml und ic_launcher_round.xml")

# --- Für den Store und zur Ansicht ---
flach(512).convert("RGB").save(os.path.join(ziel, "symbol-512.png"))
kunst.resize((1024, 1024), Image.LANCZOS).save(os.path.join(ziel, "symbol-quelle-1024.png"))
print("  symbol-512.png und symbol-quelle-1024.png")
print("Fertig: " + res)
