/* ==========================================================================
   Kopfleiste des Titelblatts vermessen — Rasenschach XI
   --------------------------------------------------------------------------
       node pruefstand/kopfleiste.cjs <browsertest.html> <bild.png> [Name]

   Warum ein echter Browser: jsdom rechnet kein Layout. Ob zwei Knoepfe
   uebereinander liegen, ist eine reine Layoutfrage — der Pruefstand kann sie
   strukturell nicht beantworten. Chromium ist dieselbe Maschine, die Android
   als WebView benutzt.

   Gemeldet wird der waagerechte Abstand zwischen den Knoepfen. Ein negativer
   Wert ist eine Ueberlappung.
   ========================================================================== */
const { chromium } = require("playwright");

(async () => {
  const datei = process.argv[2];
  const bild = process.argv[3];
  const name = process.argv[4] || datei;

  const browser = await chromium.launch();
  // Breite und Pixeldichte nach dem Geraet, auf dem Kevin prueft (S24 Ultra).
  const page = await browser.newPage({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 3,
  });
  await page.goto("file://" + datei);
  await page.waitForSelector(".zahnrad", { timeout: 30000 });
  await page.waitForTimeout(900);          // Schriften und Einblendung abwarten

  const mass = await page.evaluate(() => {
    const r2 = (x) => Math.round(x * 10) / 10;
    const knoepfe = [...document.querySelectorAll(".zahnrad")].map((e) => {
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return {
        name: e.getAttribute("aria-label"),
        links: r2(r.left), rechts: r2(r.right), oben: r2(r.top),
        breite: r2(r.width), hoehe: r2(r.height),
        position: s.position,
      };
    });
    // Nach der Lage von links nach rechts ordnen, nicht nach Reihenfolge im DOM.
    knoepfe.sort((a, b) => a.links - b.links);

    // Deckt einer den anderen zu? Anteil der ueberdeckten Flaeche.
    let luecke = null, deckung = 0;
    if (knoepfe.length === 2) {
      luecke = r2(knoepfe[1].links - knoepfe[0].rechts);
      const ueber = Math.min(knoepfe[0].rechts, knoepfe[1].rechts)
                  - Math.max(knoepfe[0].links, knoepfe[1].links);
      if (ueber > 0) deckung = r2((ueber / knoepfe[0].breite) * 100);
    }

    // Rutscht die Beschriftung links unter die Knoepfe?
    const lab = document.querySelector(".lab-kasten");
    let labelUeber = null;
    if (lab && knoepfe.length) {
      const lr = lab.getBoundingClientRect();
      labelUeber = r2(lr.right - knoepfe[0].links);   // >0 heisst: rutscht darunter
    }

    const behaelter = document.querySelector(".kopfknoepfe");
    return {
      knoepfe, luecke, deckung, labelUeber,
      behaelter: behaelter
        ? { vorhanden: true, kinder: behaelter.children.length,
            anzeige: getComputedStyle(behaelter).display,
            abstand: getComputedStyle(behaelter).gap }
        : { vorhanden: false },
    };
  });

  console.log("### " + name);
  for (const k of mass.knoepfe) {
    console.log("  " + String(k.name).padEnd(20) +
      "links " + String(k.links).padStart(6) +
      " · rechts " + String(k.rechts).padStart(6) +
      " · " + k.breite + "x" + k.hoehe +
      " · position:" + k.position);
  }
  if (mass.luecke === null) {
    console.log("  FEHLER: es sind nicht genau zwei Knoepfe da (" + mass.knoepfe.length + ")");
  } else if (mass.luecke < 0) {
    console.log("  UEBERLAPPUNG: " + (-mass.luecke) + " px — " + mass.deckung + " % des Knopfes verdeckt");
  } else {
    console.log("  Abstand: " + mass.luecke + " px, keine Ueberlappung");
  }
  console.log("  Beschriftung links endet " + Math.abs(mass.labelUeber) + " px " +
    (mass.labelUeber > 0 ? "UNTER dem ersten Knopf" : "vor dem ersten Knopf"));
  console.log("  Behaelter .kopfknoepfe: " + JSON.stringify(mass.behaelter));

  // Bild nur von der Kopfleiste, damit der Unterschied sichtbar wird.
  await page.screenshot({ path: bild, clip: { x: 0, y: 0, width: 412, height: 150 } });
  console.log("  Bild: " + bild);

  await browser.close();
  process.exit(mass.luecke !== null && mass.luecke >= 0 ? 0 : 1);
})().catch((e) => { console.error("ABBRUCH: " + e.message); process.exit(2); });
