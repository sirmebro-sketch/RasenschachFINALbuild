/* kontrast.cjs — ist jeder sichtbare Text lesbar? (seit 35.58)
   =========================================================================
       node pruefstand/kontrast.cjs <pfad/zur/browsertest.html>

   WARUM ES DAS GIBT: in 35.49 und 35.54 sind antippbare Zeilen von <div> auf
   <button className="up"> umgestellt worden. Ein <button> erbt seine
   Schriftfarbe NICHT — ohne eigene Angabe nimmt er die dunkle Systemfarbe.
   Die Kaderliste war damit dunkel auf dunkel und praktisch unlesbar.

   Zwei Prüfstände und neun Fassungen haben das nicht gemeldet, und zwar aus
   einem strukturellen Grund: jsdom ZEICHNET NICHT. Es kennt keine Farben,
   keine Vererbung, keinen Kontrast. Aufgefallen ist es erst auf dem Geraet,
   auf einem Bildschirmfoto.

   Gemessen wird nach WCAG: das Verhaeltnis der relativen Helligkeiten von
   Vordergrund und Hintergrund. Unter 3,0 ist Text auch bei guter Beleuchtung
   schwer zu lesen; unter 4,5 gilt normaler Fliesstext als zu schwach. Die
   harte Grenze hier ist 3,0 — darunter ist etwas kaputt, nicht bloss knapp.

   DER HINTERGRUND WIRD GESUCHT, nicht angenommen: ein Element mit
   durchsichtigem Hintergrund erbt den seines Elternteils. Wer das nicht
   verfolgt, misst Schrift gegen „rgba(0,0,0,0)" und bekommt Unsinn.       */
const { chromium } = require("playwright");

const datei = process.argv[2];
if (!datei) { console.error("Aufruf: kontrast.cjs <html>"); process.exit(1); }

(async () => {
  const browser = await chromium.launch();
  const seite = await browser.newPage({ viewport: { width: 412, height: 915 } });
  await seite.goto("file://" + datei, { waitUntil: "load" });
  await seite.waitForTimeout(1500);

  const messen = async (was) => seite.evaluate(() => {
    const zahl = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const hell = (c) => {
      const [r, g, b] = c.map((x) => {
        const v = x / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const verhaeltnis = (a, b) => {
      const [h, d] = [hell(a), hell(b)].sort((x, y) => y - x);
      return (h + 0.05) / (d + 0.05);
    };
    /* Den wirklich sichtbaren Hintergrund suchen: nach oben laufen, bis
       eine Flaeche nicht mehr durchsichtig ist. */
    const grund = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const c = zahl(getComputedStyle(n).backgroundColor);
        if (c.length >= 3 && (c.length < 4 || c[3] > 0.5)) return c.slice(0, 3);
        n = n.parentElement;
      }
      return [13, 15, 13];
    };

    const raus = [];
    document.querySelectorAll("*").forEach((el) => {
      /* Nur Elemente mit EIGENEM Text, sonst wird derselbe Text mehrfach
         gemessen und die Liste ist unbrauchbar lang. */
      const eigen = [...el.childNodes]
        .filter((k) => k.nodeType === 3 && k.textContent.trim())
        .map((k) => k.textContent.trim()).join(" ");
      if (!eigen) return;
      const st = getComputedStyle(el);
      if (st.visibility === "hidden" || st.display === "none") return;
      if (Number(st.opacity) < 0.2) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const vg = zahl(st.color).slice(0, 3);
      const v = verhaeltnis(vg, grund(el));
      raus.push({ text: eigen.slice(0, 40), v: Math.round(v * 100) / 100,
                  gr: Math.round(parseFloat(st.fontSize)), tag: el.tagName.toLowerCase(),
                  klasse: (el.className || "").toString().slice(0, 24) });
    });
    return raus;
  });

  /* Mehrere Bildschirme durchgehen — der Fehler sass im Kader, nicht auf dem
     Titelblatt. Ein Kontrastwaechter, der nur die erste Seite ansieht, haette
     ihn genauso wenig gefunden wie jsdom. */
  const wege = [
    ["Titelblatt", async () => {}],
    ["Hauptmenü", async () => {
      await seite.evaluate(() => {
        try { localStorage.setItem("rasenschach:willkommen",
          JSON.stringify({ schirm: true, aka: true, verein: true })); } catch (e) {}
      });
      await seite.reload({ waitUntil: "load" }); await seite.waitForTimeout(900);
    }],
    ["Spielerpass", async () => {
      await seite.evaluate(() => {
        const b = [...document.querySelectorAll("button")]
          .find((x) => /NEUE\s*LAUFBAHN/i.test(x.textContent || ""));
        if (b) b.click();
      });
      await seite.waitForTimeout(700);
    }],
  ];

  let schlimm = 0, gemessen = 0;
  const GRENZE = 3.0;
  for (const [name, hin] of wege) {
    await hin();
    const w = await messen();
    gemessen += w.length;
    const schwach = w.filter((x) => x.v < GRENZE).sort((a, b) => a.v - b.v);
    console.log("    " + name.padEnd(14) + w.length + " Textstellen, "
      + (schwach.length ? schwach.length + " unter " + GRENZE : "alle über " + GRENZE));
    schwach.slice(0, 6).forEach((x) => {
      console.log("      " + String(x.v).padStart(5) + " : " + x.gr + "px "
        + x.tag + (x.klasse ? "." + x.klasse : "") + "  „" + x.text + "“");
    });
    schlimm += schwach.length;
  }

  /* GEZIELT: die Klassen, aus denen die antippbaren Zeilen gebaut sind.
     Der Rundgang oben erreicht Kader und Aufstellung nicht — dorthin kommt
     man erst nach fuenf Laufbahnen und einem aufgebauten Verein. Genau dort
     sass der Fehler. Statt den Weg nachzuspielen wird hier die KLASSE
     geprueft: eine Zeile derselben Bauart in die Seite haengen und messen.
     Das beweist die Regel, nicht den Bildschirm — aber die Regel war kaputt. */
  const klassen = await seite.evaluate(() => {
    const zahl = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const hell = (c) => { const [r, g, b] = c.map((x) => { const v = x / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const kontrast = (a2, b2) => { const [h, d] = [hell(a2), hell(b2)].sort((x, y) => y - x);
      return (h + 0.05) / (d + 0.05); };
    const raus = [];
    /* JEDE KLASSE AN BEIDEN ELEMENTARTEN (35.64). Der erste Entwurf entschied
       je Klasse, ob div oder button — und pruefte `pan` deshalb nur als div.
       Genau dort sass der naechste Fehler: die Dach-Kacheln sind
       button className="pan", und ein button erbt seine Schriftfarbe nicht.
       Die Probe meldete 14,07 und war blind fuer den Fall, den sie haette
       finden sollen. NICHT DIE KLASSE entscheidet ueber die Farbe, sondern
       das Zusammenspiel aus Klasse und Elementart — also wird beides
       geprueft. */
    /* UND IN BEIDEN FARBWELTEN (35.65). Das Spiel hat zwei: den dunklen
       Grund und den Laufzettel — eine Papierseite, auf der `laufzettel` alle
       Farbvariablen umdreht (tx wird Tinte, die Akzente bekommen ihre
       Karton-Fassungen). Bis 35.64 hat NICHTS die Papierseite auf Kontrast
       geprueft, obwohl Training, Ereignis und Wintertransfer laengst darauf
       stehen und seit 35.65 auch die Vertragswahl.
       Zwei Farbwelten mal zwei Elementarten mal sechs Klassen: 24 Faelle. */
    const paare = [];
    ["up", "btn", "pan pad", "pan", "chip", "chip a", "chip g", "chip r"].forEach((k) => {
      ["div", "button"].forEach((tag) => {
        paare.push([k, tag, "fl"], [k, tag, "laufzettel"]);
      });
    });
    paare.forEach(([k, tag, welt]) => {
      /* IMMER INNERHALB VON .fl. Die Farbvariablen — auch die des Papiers
         (karton, tinte) — sind auf `.fl` definiert, nicht auf `:root`. Der
         erste Entwurf haengte den Laufzettel danebendran; dort war keine
         einzige Variable bekannt, Vorder- und Hintergrund fielen auf
         denselben Ersatzwert zurueck und ALLE zwoelf Papierfaelle meldeten
         exakt 1,07. Wenn jede Messung denselben Wert liefert, ist die
         Messung kaputt und nicht die Sache. */
      const rahmen = document.createElement("div");
      rahmen.className = "fl";
      rahmen.setAttribute("style", "position:fixed;left:-9999px;top:0;");
      const wirt = document.createElement("div");
      if (welt !== "fl") wirt.className = welt;
      rahmen.appendChild(wirt);
      const el = document.createElement(tag);
      el.className = k;
      el.textContent = "Probeschrift";
      wirt.appendChild(el); document.body.appendChild(rahmen);
      const st = getComputedStyle(el);
      let n = el, g2 = [13, 15, 13];
      while (n && n !== document.documentElement) {
        const c = zahl(getComputedStyle(n).backgroundColor);
        if (c.length >= 3 && (c.length < 4 || c[3] > 0.5)) { g2 = c.slice(0, 3); break; }
        n = n.parentElement;
      }
      raus.push({ k: (welt === "fl" ? "dunkel " : "papier ") + tag + "." + k,
                  v: Math.round(kontrast(zahl(st.color).slice(0, 3), g2) * 100) / 100 });
      rahmen.remove();
    });
    return raus;
  });
  console.log("    Klassen einzeln:");
  klassen.forEach((x) => {
    const gut = x.v >= GRENZE;
    console.log("      " + (gut ? "\u2713" : "\u2717") + " " + x.k.padEnd(24)
      + " Kontrast " + x.v);
    if (!gut) schlimm++;
  });

  /* GEGENPROBE DER MESSUNG: ein absichtlich unlesbarer Text MUSS gefunden
     werden. Sonst meldet die Pruefung fuer immer „alles gut" — genau der
     Fall, den sie verhindern soll. */
  await seite.evaluate(() => {
    const d = document.createElement("div");
    d.setAttribute("style", "background:#222218;color:#26241c;font-size:14px;padding:4px;");
    d.textContent = "Gegenprobe unlesbar";
    document.body.appendChild(d);
  });
  const nach = await messen();
  const gefunden = nach.some((x) => x.text.startsWith("Gegenprobe") && x.v < GRENZE);
  console.log("    " + (gefunden ? "\u2713" : "\u2717")
    + " Gegenprobe: ein absichtlich unlesbarer Text wird gefunden");
  if (!gefunden) schlimm++;

  await browser.close();
  console.log("    " + gemessen + " Textstellen gemessen \u00b7 " + schlimm + " Befunde");
  process.exit(schlimm > 0 ? 1 : 0);
})();
