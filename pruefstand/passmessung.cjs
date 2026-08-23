/* ==========================================================================
   passmessung.cjs — misst den gebauten Passbogen in Chromium
   --------------------------------------------------------------------------
   Wird von passhoehe.sh aufgerufen, nicht direkt.

   Gemeldet wird je Karrierestand die Passhöhe, dazu die Zeilenzahl des
   Zellenblocks und die verbleibende Luft bis zum Umbruch. Die Luft ist der
   eigentliche Wert: sie sagt, wie NAH der Block am Kippen steht, auch
   solange er noch hält. Eine Messung, die nur „bricht / bricht nicht" kennt,
   findet den Fall erst, wenn er schon eingetreten ist.
   ========================================================================== */
const { chromium } = require("playwright");

(async () => {
  const datei = process.argv[2];
  const bild = process.argv[3] || "";

  const browser = await chromium.launch();
  // Breite und Pixeldichte nach Kevins Geraet (S24 Ultra).
  /* Breite einstellbar: 412 ist Kevins S24 Ultra, 360 das verbreitetste
     kleine Android-Format. Ein Umbruch, der bei 412 nicht auftritt, kann bei
     360 auftreten — wer nur ein Geraet misst, misst ein Geraet. */
  const BREITE = parseInt(process.env.BREITE || "412", 10);
  const page = await browser.newPage({ viewport: { width: BREITE, height: 915 }, deviceScaleFactor: 2 });
  const fehler = [];
  page.on("pageerror", (e) => fehler.push(e.message));
  await page.goto("file://" + datei);
  await page.waitForFunction(() => window.__FERTIG === true, { timeout: 30000 });
  await page.waitForTimeout(600);          // Schriften und Einblendungen

  const mass = await page.evaluate(() => {
    const r1 = (x) => Math.round(x * 10) / 10;
    return [...document.querySelectorAll(".fall")].map((f) => {
      /* GEZIELT den Pass greifen, nicht „das erste Kind". Als der Messaufbau
         in 35.25 auf die echte Shell-Kette umgestellt wurde, war das erste
         Kind plötzlich Shells Wurzel-<div> — die Prüfung meldete daraufhin
         915 px (die Fensterhöhe) als Passhöhe, ueber alle Stände konstant,
         und blieb GRÜN. Ein falsches Ziel, das sich nicht widerspricht, ist
         schlimmer als ein Fehler. Deshalb: `.wender` oder gar nichts. */
      const pass = f.querySelector(".wender");
      const zellen = f.querySelector(".zellen");
      let zeilen = 0, felder = 0, breite = 0, noetig = 0;
      if (zellen) {
        const kinder = [...zellen.children];
        felder = kinder.length;
        breite = zellen.getBoundingClientRect().width;
        // Zeilen ueber verschiedene Oberkanten zaehlen — so sieht man den
        // Umbruch, statt ihn aus Breiten zu erraten.
        zeilen = new Set(kinder.map((k) => Math.round(k.getBoundingClientRect().top))).size;
        /* NOETIGE Breite, nicht die gewachsene. `flex:1 0 auto` heisst
           flex-grow:1 — die Felder ziehen sich auf die volle Zeile auseinander,
           und ein Vergleich "Summe gegen Behaelter" ergaebe IMMER null Luft.
           Der erste Entwurf dieser Messung hat genau das getan und fuer jeden
           Fall "knapp" gemeldet, auch fuer den mit einer Station. Deshalb
           grow kurz abschalten, messen, zuruecksetzen. */
        const vorher = kinder.map((k) => k.style.flexGrow);
        kinder.forEach((k) => { k.style.flexGrow = "0"; });
        void zellen.offsetWidth;
        for (const k of kinder) noetig += k.getBoundingClientRect().width;
        kinder.forEach((k, i) => { k.style.flexGrow = vorher[i]; });
      }
      const hinweis = [...f.querySelectorAll(".eb")]
        .some((e) => /Stationen · in der Liste/.test(e.textContent || ""));
      // Liste soll seit 34.16 fest 150 px hoch sein — mitmessen, sonst
      // sucht man an der falschen Stelle.
      const liste = [...f.querySelectorAll("div")]
        .find((d) => d.style && d.style.overflowY === "auto");
      /* Beide Seiten liegen im selben Rasterfeld — der Pass nimmt die Hoehe
         der LAENGEREN an. Ihre gemessene Hoehe ist deshalb IMMER gleich, und
         der erste Entwurf dieser Messung meldete brav zweimal denselben Wert.
         Damit war die Frage "welche Seite treibt?" unbeantwortbar.
         Gemessen wird jetzt die GENUTZTE Hoehe: Unterkante des tiefsten
         Kindes minus Oberkante der Seite. Die kennt keine Streckung. */
      const genutzt = (el) => {
        if (!el) return null;
        const o = el.getBoundingClientRect().top;
        let u = o;
        /* NICHT in abgeschnittene Behaelter hineinmessen. Die Vereinsliste
           rollt innen (overflow-y:auto, 150 px): ihre Eintraege stehen im
           DOM weit unterhalb der Clip-Grenze, sind aber unsichtbar. Der
           zweite Entwurf dieser Messung zaehlte sie mit und meldete fuer
           18 Stationen eine Rueckseite von 552 px — eine Hoehe, die es auf
           keinem Bildschirm gibt. Wo abgeschnitten wird, zaehlt der
           Behaelter selbst und nichts darunter. */
        const geht = (k) => {
          for (let a = k.parentElement; a && a !== el; a = a.parentElement) {
            const ov = getComputedStyle(a).overflowY;
            if (ov === "auto" || ov === "scroll" || ov === "hidden") return false;
          }
          return true;
        };
        for (const k of el.querySelectorAll("*")) {
          if (!geht(k)) continue;
          const r = k.getBoundingClientRect();
          if (r.height > 0 && r.bottom > u) u = r.bottom;
        }
        const pb = parseFloat(getComputedStyle(el).paddingBottom) || 0;
        return r1(u - o + pb);
      };
      const seitenEl = [...f.querySelectorAll(".dreh > *")];
      const seiten = seitenEl.map(genutzt);
      return {
        titel: f.dataset.titel,
        vorn: seiten[0] != null ? seiten[0] : null,
        hinten: seiten[1] != null ? seiten[1] : null,
        hoehe: pass ? r1(pass.getBoundingClientRect().height) : null,
        zeilen, felder, breite: r1(breite), noetig: r1(noetig),
        luft: r1(breite - noetig),
        hinweis,
        liste: liste ? r1(liste.getBoundingClientRect().height) : null,
      };
    });
  });

  /* Kein Pass gefunden heisst NICHT „in Ordnung". */
  const ohne = mass.filter((m) => m.hoehe == null);
  if (ohne.length) {
    console.log("  ✗ Kein `.wender` gefunden in " + ohne.length + " von " + mass.length
      + " Fällen — der Messaufbau greift ins Leere, es wurde NICHTS geprüft.");
    process.exitCode = 1;
  }

  console.log("=== Passhöhe über wachsende Karrierestände (" + BREITE + " px breit) ===\n");
  console.log("  " + "Fall".padEnd(34) + "Höhe".padStart(7) + "  Δ".padEnd(7)
    + "vorn".padStart(6) + "hinten".padStart(8) + "  " + "Zellen".padEnd(10)
    + "Liste".padEnd(7) + "Hinweis");
  let vorher = null;
  for (const m of mass) {
    const d = vorher == null ? "—" : (m.hoehe - vorher >= 0 ? "+" : "") + r0(m.hoehe - vorher);
    console.log("  " + m.titel.padEnd(34)
      + String(m.hoehe).padStart(7) + "  " + String(d).padEnd(5)
      + String(m.vorn).padStart(6) + String(m.hinten).padStart(8) + "  "
      + (m.zeilen + "×" + m.felder).padEnd(10)
      + String(m.liste).padEnd(7)
      + (m.hinweis ? "ja" : "—"));
    vorher = m.hoehe;
  }

  console.log("\n=== Wie nah steht der Zellenblock am Umbruch? ===");
  for (const m of mass) {
    console.log("  " + m.titel.padEnd(34)
      + "verfügbar " + String(m.breite).padStart(6)
      + " · gebraucht " + String(m.noetig).padStart(6)
      + " · Luft " + String(m.luft).padStart(7)
      + (m.zeilen > 1 ? "   ← UMBROCHEN" : m.luft < 12 ? "   ← knapp" : ""));
  }

  const h = mass.map((m) => m.hoehe);
  const zuwachs = Math.max(...h) - Math.min(...h);
  console.log("\n  Spanne " + Math.min(...h) + " bis " + Math.max(...h)
    + " px · Zuwachs " + r0(zuwachs) + " px");
  if (fehler.length) console.log("  SEITENFEHLER: " + fehler.join(" | "));

  /* Das eigentliche Versprechen aus 34.16: der Pass bleibt gleich hoch. Bis
     35.23 hat er es zweimal gebrochen (+72 bei der ersten Saison, +17 bei der
     sechsten Station). Ein Toleranzwert von 1 px faengt Rundung ab, ohne einen
     echten Sprung durchzulassen — die kleinste bisher beobachtete Abweichung
     war 17 px.
     Ohne diese Schranke waere die Messung eine Auskunft, die niemand liest.  */
  const GRENZE = 1;
  if (zuwachs > GRENZE) {
    console.log("\n  ✗ Der Pass wechselt die Höhe (" + r1(zuwachs) + " px, erlaubt " + GRENZE + ").");
    for (let i = 1; i < mass.length; i++) {
      const d = mass[i].hoehe - mass[i - 1].hoehe;
      if (Math.abs(d) > GRENZE)
        console.log("      " + mass[i - 1].titel + "  →  " + mass[i].titel
          + "   " + (d > 0 ? "+" : "") + r1(d) + " px");
    }
    process.exitCode = 1;
  } else {
    console.log("  ✓ Der Pass bleibt über alle " + mass.length
      + " Karrierestände gleich hoch (" + h[0] + " px).");
  }
  /* Umbruch des Zellenblocks: bis 35.23 galt er als Hauptverdaechtiger fuer
     den wachsenden Pass. Er war es nicht — die Beschriftung steht UEBER der
     Zahl und ist breiter als jede Zahl. Trotzdem mitgeprueft, damit die
     Entwarnung nicht auf einer einmaligen Messung beruht. */
  const gebrochen = mass.filter((m) => m.zeilen > 1);
  const engste = Math.min(...mass.map((m) => m.luft));
  if (!gebrochen.length) {
    console.log("  ✓ Zellenblock einzeilig, engste Stelle " + r1(engste) + " px Luft.");
  } else if (gebrochen.length === mass.length) {
    /* DURCHGEHEND umbrochen ist kein Fehler. Bei 320 px passen vier Felder
       nicht mehr nebeneinander — dann bricht `flex-wrap:wrap` um, genau wie
       vorgesehen, und der Pass ist über ALLE Stände gleichmässig höher. Was
       zählt, ist die Konstanz, nicht die Zeilenzahl. Die erste Fassung dieser
       Prüfung meldete das rot und hätte zu einer Änderung an `.zellen`
       geführt — der Klasse, die an sieben Stellen hängt. */
    console.log("  · Zellenblock durchgehend zweizeilig (zu schmal für vier Felder)"
      + " — gleichmässig, also kein Sprung.");
  } else {
    /* GEMISCHT ist der schlimme Fall: mal umbrochen, mal nicht, also ein
       Höhensprung mitten in der Laufbahn. Die Höhenprüfung oben fängt ihn
       ohnehin — hier steht die Ursache dazu. */
    console.log("  ✗ Zellenblock bricht NUR TEILWEISE um — das ist ein Sprung:");
    for (const m of gebrochen) console.log("      " + m.titel + " (" + m.zeilen + " Zeilen)");
    process.exitCode = 1;
  }

  function r1(x) { return Math.round(x * 10) / 10; }

  if (bild) {
    await page.screenshot({ path: bild, fullPage: true });
    console.log("  Bild: " + bild);
  }
  await browser.close();

  function r0(x) { return Math.round(x); }
})().catch((e) => { console.error("ABBRUCH: " + e.message); process.exit(2); });
