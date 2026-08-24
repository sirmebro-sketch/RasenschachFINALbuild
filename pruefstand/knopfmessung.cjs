/* ==========================================================================
   knopfmessung.cjs — misst jeden Knopf: passt der Text hinein, bleibt er
   im Bild?
   --------------------------------------------------------------------------
   Wird von knoepfe.sh aufgerufen, nicht direkt.

   Zwei Fragen je Knopf, beide nur im Layout beantwortbar:
     1. Ist der Text abgeschnitten?  scrollWidth > Breite
     2. Ragt er aus dem Bildschirm?  rechte Kante > Fensterbreite
   Die zweite fand den Willkommensfall: der Knopf war 32 px breit UND lag zu
   28 px ausserhalb. Wer nur auf abgeschnittenen Text prueft, sieht das halbe
   Problem.
   ========================================================================== */
const { chromium } = require("playwright");

(async () => {
  const datei = process.argv[2];
  const BREITE = parseInt(process.env.BREITE || "412", 10);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: BREITE, height: 915 } });
  const fehler = [];
  page.on("pageerror", (e) => fehler.push(e.message.slice(0, 120)));
  await page.goto("file://" + datei);
  await page.waitForFunction(() => window.__FERTIG === true, { timeout: 30000 });
  await page.waitForTimeout(700);

  const messen = () => page.evaluate((BREITE) => {
    const r0 = (x) => Math.round(x);
    return [...document.querySelectorAll(".fall")].map((f) => ({
      titel: f.dataset.titel,
      knoepfe: [...f.querySelectorAll("button.btn")].map((e) => {
        const b = e.getBoundingClientRect();
        /* 35.42: Knoepfe in einer seitlich scrollbaren Zeile (`.tabs` traegt
           `overflow-x:auto`) duerfen ueber den Rand hinausragen — man wischt
           sie herein, der Farbverlauf rechts zeigt das an. Sie als "ausserhalb
           des Bildes" zu melden waere ein falscher Treffer.

           ABER: still uebergehen darf man sie nicht. Sie werden gezaehlt und
           mit `wischbar` gekennzeichnet, damit im Bericht steht, wie viele es
           sind. Verschwindet ein Knopf ganz aus einer scrollbaren Zeile, faellt
           das nur auf, wenn jemand die Zahl im Blick hat. */
        const wischbar = !!e.closest(".tabs");
        return {
          text: (e.textContent || "").trim().slice(0, 18) || "(ohne Text)",
          breite: r0(b.width), rechts: r0(b.right), links: r0(b.left),
          noetig: e.scrollWidth,
          eng: e.scrollWidth > Math.ceil(b.width) + 1,
          raus: !wischbar && (b.right > BREITE + 1 || b.left < -1),
          wischbar,
        };
      }),
    }));
  }, BREITE);
  const mass = await messen();

  /* WEITERBLÄTTERN. Der Willkommensschirm hat auf Tafel 1 keinen Zurück-Knopf —
     der erscheint erst ab Tafel 2, und GENAU DORT lag der gemeldete Fehler
     (Zurück 388 px, Weiter 32 px und 28 px ausserhalb des Bildes). Eine
     Messung, die nur die erste Tafel sieht, haette ihn nie gefunden: sie hat
     brav "alle Knoepfe in Ordnung" gemeldet, waehrend zwei Tafeln weiter ein
     Knopf aus dem Bildschirm ragte.
     Also durchblaettern, was sich blaettern laesst, und jede Tafel messen. */
  const weiter = async () => page.evaluate(() => {
    const b = [...document.querySelectorAll("button.btn")]
      .find((e) => /^(Weiter|Los geht)/.test((e.textContent || "").trim()));
    if (!b) return false;
    b.click();
    return true;
  });
  const runden = [mass];
  for (let n = 0; n < 4; n++) {
    if (!(await weiter())) break;
    await page.waitForTimeout(250);
    runden.push(await messen());
  }
  for (let n = 1; n < runden.length; n++)
    for (const b of runden[n])
      mass.push({ ...b, titel: b.titel + " · nach " + n + "× Weiter" });

  console.log("=== Knopfzeilen bei " + BREITE + " px ===\n");
  let schlecht = 0, gesamt = 0;
  for (const b of mass) {
    console.log("  " + b.titel);
    for (const k of b.knoepfe) {
      gesamt++;
      const mangel = k.eng ? "TEXT ABGESCHNITTEN" : k.raus ? "AUSSERHALB DES BILDES" : "";
      if (mangel) schlecht++;
      console.log("     " + (mangel ? "✗ " : "· ") + k.text.padEnd(20)
        + "breit " + String(k.breite).padStart(4)
        + " · braucht " + String(k.noetig).padStart(4)
        + " · rechte Kante " + String(k.rechts).padStart(4)
        + (mangel ? "   " + mangel : ""));
    }
  }
  console.log();
  if (schlecht) {
    console.log("  ✗ " + schlecht + " von " + gesamt + " Knöpfen sind nicht benutzbar.");
    process.exitCode = 1;
  } else {
    /* Die wischbaren werden mitgezaehlt und genannt. Sonst verschwaende ein
       Knopf, der aus einer scrollbaren Zeile faellt, spurlos im Wort "alle". */
    const gewischt = mass.reduce((n, f) => n + f.knoepfe.filter((k) => k.wischbar
      && (k.rechts > BREITE + 1 || k.links < -1)).length, 0);
    console.log("  ✓ Alle " + gesamt + " Knöpfe lesbar und im Bild"
      + (gewischt ? " — davon " + gewischt + " erst nach seitlichem Wischen sichtbar" : "") + ".");
  }
  if (fehler.length) { console.log("  SEITENFEHLER: " + fehler[0]); process.exitCode = 1; }
  await browser.close();
})().catch((e) => { console.error("ABBRUCH: " + e.message); process.exit(2); });
