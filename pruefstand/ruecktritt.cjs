/* ruecktritt.cjs — laesst sich eine laufende Laufbahn beenden? (seit 35.66)
   =========================================================================
       node pruefstand/ruecktritt.cjs <pfad/zur/browsertest.html>

   WARUM ES DAS GIBT: der Knopf „Schuhe an den Nagel haengen" hat vier
   Fassungen lang NICHTS getan, wenn kein Verein mitspielte. Ursache war eine
   Variable, die innerhalb eines if-Blocks angelegt und ausserhalb benutzt
   wurde — `finish` warf einen ReferenceError.

   DER FEHLER IST STILL. In einem React-Ereignishandler geworfen, passiert
   einfach nichts: kein roter Bildschirm, keine Meldung, der Knopf reagiert
   nur nicht. Kein Prueflauf hat ihn gefunden, und zwar aus einem Grund, der
   sich verallgemeinern laesst: die Vereinsproben laufen immer MIT Verein.
   Der haeufigste Fall — jemand spielt seine erste Laufbahn, hat noch gar
   keinen Verein — war nirgends nachgestellt.

   Geprueft wird deshalb GENAU DIESER Fall, im echten Browser, mit Blick auf
   die Konsole. jsdom taugt hier nicht: es rendert zwar, aber der Weg vom
   Knopf bis zum Karriereende laeuft ueber Zustandswechsel, die man klicken
   muss.                                                                    */
const { chromium } = require("playwright");

const datei = process.argv[2];
if (!datei) { console.error("Aufruf: ruecktritt.cjs <html>"); process.exit(1); }

(async () => {
  const browser = await chromium.launch();
  const seite = await browser.newPage({ viewport: { width: 412, height: 915 } });
  const fehler = [];
  seite.on("pageerror", (e) => fehler.push(e.message));
  seite.on("console", (m) => { if (m.type() === "error") fehler.push(m.text()); });

  const pr = (n, gut, z) => {
    console.log("    " + (gut ? "\u2713" : "\u2717") + " " + n + (z ? "   " + z : ""));
    return gut;
  };
  const tippe = (muster) => seite.evaluate((m) => {
    const b = [...document.querySelectorAll("button")]
      .find((x) => new RegExp(m, "i").test((x.textContent || "").replace(/\s+/g, " ")));
    if (b && !b.disabled) { b.click(); return true; }
    return false;
  }, muster);
  const text = () => seite.evaluate(() => document.body.innerText || "");

  await seite.goto("file://" + datei, { waitUntil: "load" });
  await seite.waitForTimeout(1400);

  /* Frischer Stand: KEIN Verein, keine Akademie — der Normalfall beim ersten
     Spielen und genau der, der kaputt war. */
  await seite.evaluate(() => {
    try {
      localStorage.removeItem("rasenschach:verein");
      localStorage.removeItem("rasenschach:akademie");
      localStorage.setItem("rasenschach:gesamt", JSON.stringify({ karrieren: 0 }));
    } catch (e) { /* egal */ }
  });
  await seite.reload({ waitUntil: "load" });
  await seite.waitForTimeout(1200);

  let schlimm = 0;
  if (!(await tippe("NEUE\\s*LAUFBAHN"))) {
    pr("eine neue Laufbahn laesst sich starten", false, "Knopf nicht gefunden");
    await browser.close(); process.exit(1);
  }
  await seite.waitForTimeout(700);

  /* Den Spielerpass durchklicken. NUR IM SPIELBEREICH suchen (#root) — die
     Werkstatt haengt AUSSERHALB davon und hat eigene Knoepfe („Einschreiben",
     „Neu laden"). Der erste Entwurf suchte im ganzen Dokument und traf sie;
     dann landet man im Hauptmenue statt im Spiel, und die Probe meldet einen
     Fehler, den es nicht gibt.
     Der Weiterknopf ist der VORLETZTE im Spielbereich („Los geht's",
     danach „Zurueck"). Nach dem Text zu suchen war ebenfalls ein Fehlweg:
     mein Muster kannte das Apostroph in „Los geht's" nicht. Die Stellung ist
     hier stabiler als der Wortlaut. */
  for (let i = 0; i < 12; i++) {
    const t = await text();
    if (/Schuhe an den Nagel/i.test(t)) break;
    const weiter = await seite.evaluate(() => {
      const w = document.getElementById("root");
      if (!w) return false;
      const b = [...w.querySelectorAll("button")].filter((x) => !x.disabled);
      /* „Zurueck" ist der letzte — den wollen wir gerade nicht. */
      const ziel = b.filter((x) => !/^Zur(ü|ue)ck$/i.test((x.textContent || "").trim()));
      if (!ziel.length) return false;
      ziel[ziel.length - 1].click();
      return true;
    });
    if (!weiter) break;
    await seite.waitForTimeout(500);
  }

  const imSpiel = /Schuhe an den Nagel/i.test(await text());
  if (!pr("der Rücktrittsknopf ist erreichbar", imSpiel,
          imSpiel ? "" : "Spielbildschirm nicht erreicht")) schlimm++;

  if (imSpiel) {
    const vorher = fehler.length;
    if (!pr("er lässt sich antippen", await tippe("Schuhe an den Nagel"))) schlimm++;
    await seite.waitForTimeout(400);
    const frage = /Wirklich aufhören/i.test(await text());
    if (!pr("die Rückfrage erscheint", frage)) schlimm++;

    if (frage) {
      if (!pr("„Ja, beenden“ lässt sich antippen", await tippe("Ja, beenden"))) schlimm++;
      await seite.waitForTimeout(1400);
      const t2 = await text();
      /* DAS IST DER PUNKT: nach dem Bestaetigen MUSS der Abschluss kommen.
         Vorher blieb der Bildschirm einfach stehen. */
      if (process.env.LAUT === "1") {
        console.log("      [laut] Bildschirm danach: "
          + t2.split("\n").filter((z) => z.trim()).slice(0, 6).join(" | ").slice(0, 220));
      }
      /* Der Abschluss beginnt mit einem Blaetterwerk („DEINE LAUFBAHN … Tippen
         fuer weiter 1/4"), erst danach kommt der Bericht. Mein erstes Muster
         suchte nur nach den spaeteren Seiten und meldete deshalb rot, obwohl
         alles lief — ein Fehlalarm, und zwar an der Stelle, an der ich gerade
         einen echten Fehler suchte. Das ist die gefaehrlichste Sorte: sie
         haette mich fast dazu gebracht, eine Ursache zu behaupten, die keine
         war. */
      const fertig = /DEINE LAUFBAHN|KARRIEREENDE|Laufbahn abschließen|Rücktritt aus freien Stücken/i.test(t2);
      if (!pr("die Laufbahn ist danach wirklich beendet", fertig,
              fertig ? (t2.split("\n").find((z) => z.trim()) || "").slice(0, 40)
                     : "Bildschirm blieb stehen")) schlimm++;
      const neu = fehler.slice(vorher);
      if (!pr("dabei kein Fehler in der Konsole", neu.length === 0,
              neu.slice(0, 2).join(" | "))) schlimm++;
    }
  }

  await browser.close();
  console.log("    " + (schlimm ? schlimm + " Befunde" : "Rücktritt ohne Verein läuft durch"));
  process.exit(schlimm > 0 ? 1 : 0);
})();
