/* ==========================================================================
   Erzeugt die Spielübersicht — direkt aus den Daten der App.jsx.
   Nichts wird abgeschrieben oder geschätzt: Jede Zahl in der Ausgabe stammt
   aus dem laufenden Spielcode. Ändert sich das Spiel, ändert sich die Datei.

   Aufruf:  node uebersicht.cjs <Zieldatei.md>
   ========================================================================== */
const E = require("/tmp/ps/motor.js");
const fs = require("fs");
const {
  CLUBS, NATIONS, WILDCARDS, EVENTS, ACHIEVEMENTS, TYPES, MODES, POS, RARITY,
  LEAGUES, INVEST, META, ABTEILUNGEN, AKA_MAX, hsvChance, akaBonus,
  akaRestkosten, leereAkademie, akaStufe,
} = E;

/* Das Ziel ist das ERSTE Argument, nicht die Quelle — die kommt aus
   /tmp/ps/motor.js. Ein "node uebersicht.cjs App.jsx UEBERSICHT.md" hat
   deshalb am 16.8.2026 wortlos die App.jsx ueberschrieben: 14.304 Zeilen
   Spiel gegen 3.001 Zeilen Uebersicht, ohne eine einzige Rueckfrage. Zwei
   Riegel, beide haetten genau das verhindert. */
const args = process.argv.slice(2);
if (args.length > 1) {
  console.error("FEHLER: uebersicht.cjs nimmt GENAU ein Argument — die Zieldatei.");
  console.error("        Die Quelle kommt aus /tmp/ps/motor.js und wird nicht uebergeben.");
  console.error("        Bekommen: " + args.join(" "));
  process.exit(1);
}
const ziel = args[0] || "/tmp/UEBERSICHT.md";
if (!/\.md$/i.test(ziel)) {
  console.error("FEHLER: das Ziel muss auf .md enden. Bekommen: " + ziel);
  console.error("        Ein Quelltextpfad an dieser Stelle loescht die Datei.");
  process.exit(1);
}
const L = [];
const p = (x = "") => L.push(x);
const z1 = (x) => (Math.round(x * 10) / 10).toFixed(1);
const z2 = (x) => (Math.round(x * 100) / 100).toFixed(2);
const pz = (x) => z2(x * 100) + " %";

/* ---------------------------------------------------------------- Kopf */
p("# Rasenschach XI — Was alles drin ist");
p();
p("> Diese Datei wird aus dem Quelltext erzeugt, nicht von Hand gepflegt.");
p("> Jede Zahl stammt aus den Daten des laufenden Spiels.");
p();
p("**Fassung " + (E.VERSION || "—") + "** · erzeugt am " +
  new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }));
p();

/* ------------------------------------------------------------ Inhalt */
p("## Inhalt auf einen Blick");
p();
p("| Bereich | Anzahl |");
p("|---|---|");
p("| Vereine | " + CLUBS.length + " |");
p("| Ligen | " + Object.keys(LEAGUES).length + " |");
p("| Nationen | " + NATIONS.length + " |");
p("| Positionen | " + Object.keys(POS).length + " |");
p("| Spielertypen | " + TYPES.length + " |");
p("| Spielweisen | " + MODES.length + " |");
p("| Wildcards | " + WILDCARDS.length + " |");
p("| Seltenheitsstufen | " + Object.keys(RARITY).length + " |");
p("| Ereignisse | " + EVENTS.length + " |");
p("| Errungenschaften | " + ACHIEVEMENTS.length + " |");
p("| Freischaltungen | " + Object.keys(META).length + " |");
p("| Anlageformen | " + (INVEST ? INVEST.length : 0) + " |");
p("| Abteilungen der Akademie | " + ABTEILUNGEN.length + " (je " + AKA_MAX + " Stufen) |");
p();

/* ------------------------------------------------------------ Vereine */
p("## Vereine");
p();
const proLiga = {};
CLUBS.forEach((c) => { (proLiga[c.l] = proLiga[c.l] || []).push(c); });
p("| Liga | Vereine | Stärke Ø | schwächster | stärkster |");
p("|---|---|---|---|---|");
Object.keys(proLiga).sort((a, b) => {
  const sa = proLiga[a].reduce((x, y) => x + y.s, 0) / proLiga[a].length;
  const sb = proLiga[b].reduce((x, y) => x + y.s, 0) / proLiga[b].length;
  return sb - sa;
}).forEach((k) => {
  const cs = [...proLiga[k]].sort((a, b) => a.s - b.s);
  const nm = (LEAGUES[k] && (LEAGUES[k].n || LEAGUES[k].name)) || k;
  p("| " + nm + " | " + cs.length + " | " + z1(cs.reduce((x, y) => x + y.s, 0) / cs.length)
    + " | " + cs[0].n + " (" + cs[0].s + ") | " + cs[cs.length - 1].n + " (" + cs[cs.length - 1].s + ") |");
});
p();
p("**Die zwanzig stärksten Vereine**");
p();
p("| # | Verein | Land | Liga | Stärke |");
p("|---|---|---|---|---|");
[...CLUBS].sort((a, b) => b.s - a.s).slice(0, 20).forEach((c, i) => {
  p("| " + (i + 1) + " | " + c.n + " | " + c.c + " | " + c.l + " | " + c.s + " |");
});
p();
p("<details><summary>Alle " + CLUBS.length + " Vereine</summary>");
p();
p("| Verein | Land | Liga | Stärke | Bereich |");
p("|---|---|---|---|---|");
[...CLUBS].sort((a, b) => (a.l + a.n).localeCompare(b.l + b.n)).forEach((c) =>
  p("| " + c.n + " | " + c.c + " | " + c.l + " | " + c.s + " | " + (c.g === "w" ? "Frauen" : "Männer") + " |"));
p();
p("</details>");
p();
const frauen = CLUBS.filter((c) => c.g === "w").length;
p("Davon " + frauen + " Vereine im Frauenfußball und " + (CLUBS.length - frauen) + " im Männerfußball.");
p();

/* --------------------------------------------------------- Seltenheit */
p("## Wildcards");
p();
p("### Seltenheitsstufen und ihre Wahrscheinlichkeit");
p();
const gew = Object.keys(RARITY).filter((k) => RARITY[k].w > 0);
const summe = gew.reduce((a, k) => a + RARITY[k].w, 0);
p("Ohne Glückssträhne. Die Gewichte werden auf die Stufen mit echtem Gewicht verteilt;");
p("Sonderstufen mit Gewicht 0 werden eigens gezogen.");
p();
p("| Stufe | Gewicht | Wahrscheinlichkeit | Karten |");
p("|---|---|---|---|");
Object.keys(RARITY).forEach((k) => {
  const anz = WILDCARDS.filter((w) => w.r === k).length;
  const w = RARITY[k].w;
  p("| " + RARITY[k].name + " | " + w + " | " + (w > 0 ? pz(w / summe) : "eigene Ziehung") + " | " + anz + " |");
});
p();
p("Bei einer vollen Glückssträhne verschiebt sich das Gewicht spürbar nach oben:");
p("Normal wird halbiert, GOAT etwa verdoppelt.");
p();

/* ------------------------------------------------- Rautekarte */
p("### Die Rautekarte");
p();
p("Sie wird nicht über die Stufen gezogen, sondern eigens — mit einem Zähler,");
p("der nach jeder abgeschlossenen Laufbahn ohne sie steigt.");
p();
p("| Abgeschlossene Laufbahnen ohne sie | Wahrscheinlichkeit |");
p("|---|---|");
[0, 5, 10, 20, 30, 50, 80].forEach((n) => p("| " + n + " | " + pz(hsvChance(n)) + " |"));
p();

/* ------------------------------------------------- Karten im Einzelnen */
p("### Alle Karten");
p();
Object.keys(RARITY).forEach((k) => {
  const kart = WILDCARDS.filter((w) => w.r === k);
  if (!kart.length) return;
  p("**" + RARITY[k].name + "** (" + kart.length + ")");
  p();
  p("| Karte | Wirkung | Nur für |");
  p("|---|---|---|");
  kart.forEach((w) => {
    let wirk = "—";
    try {
      const fx = typeof w.fx === "function" ? w.fx() : w.fx;
      if (fx && typeof fx === "object") {
        wirk = Object.entries(fx).map(([a, b]) =>
          a + " " + (typeof b === "number" ? (b > 0 && !String(b).startsWith("-") ? "+" + b : b)
            : b === true ? "ja" : String(b))).join(", ");
      }
    } catch (e) { wirk = "wirkt im Spielverlauf"; }
    const nur = w.pos && w.pos.length ? w.pos.join(", ") : "alle";
    p("| " + w.n + " | " + wirk.slice(0, 150) + " | " + nur + " |");
  });
  p();
});

/* ------------------------------------------------------- Ereignisse */
p("## Ereignisse");
p();
p("Je Saison werden zwei bis drei Ereignisse gezogen. Bereits Erlebtes wird");
p("seltener nachgezogen, damit sich nichts wiederholt.");
p();
const mitWahl = EVENTS.filter((e) => e.choices && e.choices.length > 1).length;
const mitZufall = EVENTS.filter((e) => e.choices && e.choices.some((c) => c.roll && c.roll.length > 1)).length;
p("- Ereignisse insgesamt: **" + EVENTS.length + "**");
p("- davon mit echter Wahl: **" + mitWahl + "**");
p("- davon mit ungewissem Ausgang: **" + mitZufall + "**");
p();
const mitBed = EVENTS.filter((e) => e.cond).length;
p("- an eine Bedingung geknüpft (Alter, Lage, Verein): **" + mitBed + "**");
p("- jederzeit möglich: **" + (EVENTS.length - mitBed) + "**");
p();
const gwt = {};
EVENTS.forEach((e) => { const k = e.w != null ? String(e.w) : "ohne"; gwt[k] = (gwt[k] || 0) + 1; });
p("| Ziehungsgewicht | Ereignisse |");
p("|---|---|");
Object.keys(gwt).sort((a, b) => Number(b) - Number(a)).forEach((k) =>
  p("| " + k + " | " + gwt[k] + " |"));
p("");
p("Ein höheres Gewicht heißt: kommt öfter. Bereits Erlebtes wird zusätzlich");
p("heruntergewichtet, damit sich nichts wiederholt.");
p();
/* Titel sind teils Funktionen, die einen Zusammenhang erwarten. Wir reichen
   einen unverfänglichen Ersatz hinein; klappt das nicht, nehmen wir die
   Kennung. Erfunden wird nichts. */
const ERSATZ = { mate:{name:"ein Mitspieler"}, rival:{name:"ein Rivale"},
  club:{n:"dein Verein",name:"dein Verein"}, coach:{name:"der Trainer"},
  p:{name:"du"}, nat:{n:"dein Land"}, foe:{n:"der Gegner",name:"der Gegner"},
  pn:"deine Partnerin", prev:"dein alter Verein", agent:"dein Berater" };
const titelVon = (e) => {
  let t = e.title != null ? e.title : (e.t != null ? e.t : e.n);
  if (typeof t === "function") { try { t = t(ERSATZ); } catch (x) { t = null; } }
  if (t == null || typeof t === "function") t = e.id;
  t = String(t);
  /* Nichts Halbfertiges stehen lassen: Bleibt ein Platzhalter leer, nehmen
     wir lieber die Kennung als „undefined". */
  if (t.indexOf("undefined") >= 0 || t.indexOf("[object") >= 0) t = e.id;
  return t.replace(/\|/g, "/");
};
const proTag = {};
EVENTS.forEach((e) => { const k = e.tag || "ohne Einordnung"; (proTag[k] = proTag[k] || []).push(e); });
p("| Bereich | Ereignisse |");
p("|---|---|");
Object.keys(proTag).sort((a, b) => proTag[b].length - proTag[a].length)
  .forEach((k) => p("| " + k + " | " + proTag[k].length + " |"));
p();
p("<details><summary>Alle Ereignisse im Einzelnen</summary>");
p();
Object.keys(proTag).sort().forEach((k) => {
  p("**" + k + "** (" + proTag[k].length + ")");
  p();
  p("| Ereignis | Wahl | Ungewiss | Gewicht | Bedingung |");
  p("|---|---|---|---|---|");
  proTag[k].forEach((e) => {
    const w = e.choices ? e.choices.length : 0;
    const zuf = e.choices && e.choices.some((c) => c.roll && c.roll.length > 1) ? "ja" : "nein";
    const bed = e.cond ? "ja" : "—";
    p("| " + titelVon(e).slice(0, 80) + " | " + w + " | " + zuf + " | " + (e.w != null ? e.w : "—")
      + " | " + bed + " |");
  });
  p();
});
p();
p("</details>");
p();

/* --------------------------------------------------- Errungenschaften */
p("## Errungenschaften");
p();
const stufen = {};
ACHIEVEMENTS.forEach((a) => { (stufen[a.s] = stufen[a.s] || []).push(a); });
p("| Stufe | Anzahl | mit Freischaltung |");
p("|---|---|---|");
["bronze", "silber", "gold", "platin", "legende"].forEach((k) => {
  if (!stufen[k]) return;
  p("| " + k.charAt(0).toUpperCase() + k.slice(1) + " | " + stufen[k].length
    + " | " + stufen[k].filter((a) => a.lohn).length + " |");
});
p("| **Gesamt** | **" + ACHIEVEMENTS.length + "** | **" + ACHIEVEMENTS.filter((a) => a.lohn).length + "** |");
p();
["bronze", "silber", "gold", "platin", "legende"].forEach((k) => {
  if (!stufen[k]) return;
  p("### " + k.charAt(0).toUpperCase() + k.slice(1) + " (" + stufen[k].length + ")");
  p();
  p("| Errungenschaft | Bedingung | Schaltet frei |");
  p("|---|---|---|");
  stufen[k].forEach((a) => {
    const lohn = a.lohn && META[a.lohn] ? (META[a.lohn].n || META[a.lohn].name || a.lohn) : (a.lohn || "—");
    p("| " + a.n + " | " + (a.t || "").replace(/\|/g, "/") + " | " + lohn + " |");
  });
  p();
});

/* ------------------------------------------------------ Freischaltungen */
p("## Freischaltungen");
p();
p("Dauerhafte Vorteile, die über alle Laufbahnen hinweg bestehen bleiben.");
p();
p("| Freischaltung | Wirkung |");
p("|---|---|");
Object.keys(META).forEach((k) => {
  const m = META[k];
  p("| " + (m.n || m.name || k) + " | " + ((m.t || m.hint || "—") + "").replace(/\|/g, "/") + " |");
});
p();

/* ------------------------------------------------ Typen und Spielweisen */
p("## Spielertypen");
p();
p("| Typ | Nur für | Beschreibung |");
p("|---|---|---|");
TYPES.forEach((t) => p("| " + (t.n || t.name) + " | " + (t.pos ? t.pos.join(", ") : "alle")
  + " | " + ((t.t || t.hint || "—") + "").replace(/\|/g, "/").slice(0, 110) + " |"));
p();
p("## Spielweisen");
p();
p("| Spielweise | Beschreibung |");
p("|---|---|");
MODES.forEach((m) => p("| " + (m.n || m.name) + " | " + ((m.t || m.hint || "—") + "").replace(/\|/g, "/").slice(0, 130) + " |"));
p();
p("## Positionen");
p();
p("| Kürzel | Position |");
p("|---|---|");
Object.keys(POS).forEach((k) => p("| " + k + " | " + (POS[k].n || POS[k].name || POS[k].kurz || k) + " |"));
p();

/* -------------------------------------------------------- Nationen */
p("## Nationen");
p();
p("Die Stärke bestimmt, wie schwer der Weg in die Nationalmannschaft ist.");
p();
const sortiert = [...NATIONS].sort((a, b) => (b.str || 0) - (a.str || 0));
p("**Die zwanzig stärksten**");
p();
p("| # | Land | Stärke |");
p("|---|---|---|");
sortiert.slice(0, 20).forEach((n, i) =>
  p("| " + (i + 1) + " | " + (n.flag ? n.flag + " " : "") + (n.n || n.name)
    + " | " + (n.str != null ? n.str : "—") + " |"));
p();
const stufenN = [[85, 100, "Weltspitze"], [72, 84, "stark"], [58, 71, "Mittelfeld"],
  [40, 57, "Außenseiter"], [0, 39, "kaum vertreten"]];
p("| Einordnung | Stärke | Länder |");
p("|---|---|---|");
stufenN.forEach(([lo, hi, nm]) => {
  const anz = sortiert.filter((n) => (n.str || 0) >= lo && (n.str || 0) <= hi).length;
  p("| " + nm + " | " + lo + "–" + hi + " | " + anz + " |");
});
p();
p("<details><summary>Alle " + NATIONS.length + " Nationen</summary>");
p();
p("| Land | Stärke |");
p("|---|---|");
sortiert.forEach((n) =>
  p("| " + (n.flag ? n.flag + " " : "") + (n.n || n.name) + " | " + (n.str != null ? n.str : "—") + " |"));
p();
p("</details>");
p();

/* -------------------------------------------------------- Akademie */
p("## Jugendakademie");
p();
p("### Abteilungen und Kosten");
p();
p("| Abteilung | Wirkung | Stufe 2 | 3 | 4 | 5 | 6 | gesamt |");
p("|---|---|---|---|---|---|---|---|");
let ges = 0;
ABTEILUNGEN.forEach((x) => {
  const su = x.kosten.reduce((a, b) => a + b, 0); ges += su;
  p("| " + x.n + " | " + x.wirkt + " | " + x.kosten.slice(1).join(" | ") + " | " + su + " |");
});
p("| **Gesamt** | | | | | | | **" + ges + " VC** |");
p();
p("### Was das Ansehen einer neuen Laufbahn mitgibt");
p();
p("| Ansehen | Anlage | Bekanntheit | Startkapital | Entwicklung |");
p("|---|---|---|---|---|");
[0, 50, 100, 150, 200, 250, 300].forEach((r) => {
  const b = akaBonus({ ruhm: r });
  p("| " + r + " | +" + b.pot + " | +" + b.rep + " | +" + Math.round(b.money * 1000)
    + " Tsd. € | +" + Math.round(b.dev * 100) + " % |");
});
p();
p("Der Vorteil ist fest gedeckelt: höchstens +4 Anlage, +6 Bekanntheit,");
p("+100 Tsd. € Startkapital und +6 % Entwicklung.");
p();

/* ---------------------------------------------------------- Anlagen */
if (INVEST && INVEST.length) {
  p("## Anlageformen");
  p();
  p("| Anlage | Einsatz | Beschreibung |");
  p("|---|---|---|");
  INVEST.forEach((i) => p("| " + (i.n || i.name) + " | " + (i.min != null ? i.min : "—")
    + " | " + ((i.t || i.hint || "—") + "").replace(/\|/g, "/").slice(0, 110) + " |"));
  p();
}

fs.writeFileSync(ziel, L.join("\n") + "\n", "utf8");
console.log("Übersicht geschrieben: " + ziel);
console.log("  " + L.length + " Zeilen · " + (fs.statSync(ziel).size / 1024).toFixed(1) + " KB");
