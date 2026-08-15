/* ==========================================================================
   Beginnt jede neue Seite oben? — Rasenschach XI
   --------------------------------------------------------------------------
       node pruefstand/seitenanfang.cjs <browsertest.html>

   Warum ein echter Browser: die Rollhöhe des Fensters ist Layout. jsdom hat
   kein `window.scrollTo`, das etwas bewegt, und kennt keine Seitenhöhe — der
   Pruefstand kann diese Frage strukturell nicht beantworten.

   Ablauf je Fall: Seite frisch laden, in eine LANGE Ansicht gehen, ganz nach
   unten rollen, den Seitenwechsel auslösen, `window.scrollY` messen.

   WICHTIG — der erste Entwurf war ein Falschgrün: bei 412x915 ist das
   Hauptmenü im frischen Zustand exakt fensterhoch (915 von 915 px). Es gab
   nichts zu rollen, `scrollY` war vorher wie nachher 0, und die Prüfung
   meldete zufrieden „bestanden“, ohne etwas gemessen zu haben. Deshalb ein
   niedrigeres Fenster UND die Bedingung, dass vorher wirklich gerollt wurde:
   wer nicht herunterkam, meldet „nicht messbar“, nicht „bestanden“.
   ========================================================================== */
const { chromium } = require("playwright");

const GRENZE = 4;     // px Toleranz für Rundung und Ankerversatz
const MINDEST = 60;   // so weit muss es vorher heruntergegangen sein

(async () => {
  const datei = process.argv[2];
  if (!datei) { console.error("Aufruf: node seitenanfang.cjs <browsertest.html>"); process.exit(2); }

  const browser = await chromium.launch();
  /* Niedriges Fenster, damit die Seiten sicher überlaufen. */
  const page = await browser.newPage({ viewport: { width: 412, height: 560 } });
  const seitenfehler = [];
  page.on("pageerror", (e) => seitenfehler.push(String(e.message).slice(0, 200)));

  await page.goto("file://" + datei);
  await page.waitForSelector(".zahnrad", { timeout: 30000 });
  await page.waitForTimeout(900);

  let ok = 0, schlecht = 0, blind = 0;
  const runter = async () => {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(200);
    return page.evaluate(() => Math.round(window.scrollY));
  };
  /* Einen Knopf über seinen sichtbaren Text finden. `getByRole` trifft hier
     nicht zuverlässig, weil die Beschriftungen in Kindelementen stehen. */
  const tippe = async (text) => {
    const traf = await page.evaluate((t) => {
      const b = [...document.querySelectorAll("button")]
        /* Leerraum vereinheitlichen. Im ersten Entwurf fehlte das, und
           „Neue Laufbahn“ wurde nie gefunden: der Knopf bricht die Zeile
           um, `innerText` liefert „NEUE\nLAUFBAHN“, und `includes` mit
           einem Leerzeichen trifft das nicht. */
        .find((x) => !x.disabled
          && (x.innerText || "").replace(/\s+/g, " ").toLowerCase().includes(t.toLowerCase()));
      if (!b) return false;
      b.click(); return true;
    }, text);
    await page.waitForTimeout(700);
    return traf;
  };
  const frisch = async () => {
    await page.goto("file://" + datei);
    await page.waitForSelector(".zahnrad", { timeout: 30000 });
    await page.waitForTimeout(700);
  };

  /* hin: Kette von Knöpfen, die in die lange Ansicht führt.
     weiter: der Knopf, dessen Seitenwechsel geprüft wird. */
  const pruef = async (name, hin, weiter) => {
    await frisch();
    for (const k of hin) {
      if (!(await tippe(k))) { console.log("  · " + name.padEnd(32) + "Weg über „" + k + "“ nicht gefunden"); blind++; return; }
    }
    const vor = await runter();
    if (vor < MINDEST) {
      blind++;
      console.log("  · " + name.padEnd(32) + "nicht messbar — Seite rollt nur " + vor + " px");
      return;
    }
    if (!(await tippe(weiter))) { console.log("  · " + name.padEnd(32) + "Knopf „" + weiter + "“ nicht gefunden"); blind++; return; }
    const nach = await page.evaluate(() => Math.round(window.scrollY));
    if (nach <= GRENZE) { ok++; console.log("  ✓ " + name.padEnd(32) + vor + " px → " + nach + " px"); }
    else { schlecht++; console.log("  ✗ " + name.padEnd(32) + vor + " px → " + nach + " px (bleibt stehen)"); }
  };

  console.log("=== Seitenanfang ===");
  /* Aus dem heruntergerollten Hauptmenü in die Charaktererstellung — der
     von Kevin gemeldete Fall. */
  await pruef("Hauptmenü → Erstellung", [], "Neue Laufbahn");
  /* Und der Rückweg aus einer langen Ansicht ins Menü. */
  await pruef("Errungenschaften → Menü", ["Errungenschaften"], "Zurück");
  /* Ruhmeshalle und Akademie sind im frischen Zustand zu kurz zum Messen —
     bewusst nicht geprüft, statt eine Prüfung zu bauen, die nichts sieht. */
  await pruef("Menü → Errungenschaften", [], "Errungenschaften");
  await pruef("Erstellung → Menü", ["Neue Laufbahn"], "Zurück");

  console.log("\n" + ok + " bestanden, " + schlecht + " nicht bestanden, " + blind + " nicht messbar.");
  if (seitenfehler.length) { console.log("Seitenfehler:"); seitenfehler.slice(0, 3).forEach((f) => console.log("  " + f)); }
  await browser.close();
  /* „nicht messbar“ zählt als Fehlschlag: ein Prüfmittel, das nichts sieht,
     darf nicht grün melden. */
  process.exit((schlecht || blind) ? 1 : 0);
})().catch((e) => { console.error("ABBRUCH: " + e.message); process.exit(2); });
