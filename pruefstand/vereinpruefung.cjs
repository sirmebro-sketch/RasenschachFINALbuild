/* ==========================================================================
   vereinpruefung.cjs — der eigene Verein (35.17)
   --------------------------------------------------------------------------
       node pruefstand/vereinpruefung.cjs
   Braucht /tmp/ps/motor.js, also einen Lauf von pruefen.sh davor.

   Die wichtigste Pruefung hier ist nicht "laeuft es durch", sondern
   "WIRKT DIE WAHL". Ein Aufstellungsbildschirm ueber einer Rechnung, die die
   Aufstellung ignoriert, waere genau der tote Code, den 35.7 abgetragen hat.
   ========================================================================== */
const App = require("/tmp/ps/motor.js");
const V = App.VEREIN;

let ok = 0, fehler = 0;
const pr = (name, gut, zusatz) => {
  if (gut) { ok++; console.log("  ✓ " + name + (zusatz ? "  " + zusatz : "")); }
  else { fehler++; console.log("  ✗ " + name + (zusatz ? "  " + zusatz : "")); }
};

console.log("=== Vereinsprüfung ===\n");

/* ------------------------------------------------------ Ligapyramiden */
{
  const laender = [...new Set(App.CLUBS.map((c) => c.c))];
  let mehrstufig = 0, kaputt = [];
  laender.forEach((l) => {
    const p = V.pyramide(l);
    p.forEach((teil) => {
      if (teil.length > 1) mehrstufig++;
      /* Aufsteigend nach Staerke — sonst stiege man nach unten auf. */
      for (let i = 1; i < teil.length; i++)
        if (teil[i].staerke < teil[i - 1].staerke) kaputt.push(l + ": " + teil[i - 1].liga + " → " + teil[i].liga);
    });
    /* Frauen- und Maennerligen duerfen nie in derselben Pyramide stehen. */
    p.forEach((teil) => {
      const g = new Set(teil.map((x) => {
        const c = App.CLUBS.find((y) => y.l === x.liga); return c ? (c.g || "m") : "m";
      }));
      if (g.size > 1) kaputt.push(l + ": Frauen- und Männerliga in derselben Pyramide");
    });
  });
  pr("Ligapyramiden sind aufsteigend sortiert und getrennt", !kaputt.length,
     kaputt.length ? kaputt.slice(0, 3).join(" | ") : mehrstufig + " Pyramiden mit Unterbau");
  pr("Deutschland hat drei Stufen",
     V.startligen("GER").join(" → ") === "3. Liga → 2. Bundesliga → Bundesliga",
     V.startligen("GER").join(" → "));
}

/* --------------------------------------------------------- Positionen */
{
  const p = Object.keys(App.POS);
  let unmoeglich = [], fehlend = [];
  p.forEach((x) => { if (!V.GUETE[x]) fehlend.push(x); });
  pr("jede Position hat eine Eignungstabelle", !fehlend.length, fehlend.join(", "));
  pr("ein Torwart kann nur ins Tor",
     p.every((x) => x === "TW" ? V.guete("TW", x) === 1 : V.guete("TW", x) === 0));
  pr("kein Feldspieler kann ins Tor", p.filter((x) => x !== "TW").every((x) => V.guete(x, "TW") === 0));
  /* Jede eigene Position muss mit voller Guete besetzbar sein, sonst gaebe es
     Plaetze, die nie ideal zu fuellen sind. */
  pr("jede Position ist auf sich selbst voll geeignet", p.every((x) => V.guete(x, x) === 1));
  /* Und keine Guete unter 0,6: was schlechter passt, gilt als unmoeglich. */
  const zuKlein = [];
  Object.entries(V.GUETE).forEach(([von, m]) => Object.entries(m).forEach(([auf, w]) => {
    if (w > 0 && w < .6) zuKlein.push(von + "→" + auf + " = " + w);
  }));
  pr("keine Eignung zwischen 0 und 0,6", !zuKlein.length, zuKlein.join(", "));
}

/* ------------------------------------------------------- Formationen */
{
  const schlecht = [];
  V.FORMATIONEN.forEach((f) => {
    if (f.plaetze.length !== 11) schlecht.push(f.id + " hat " + f.plaetze.length + " Plätze");
    if (f.plaetze.filter((x) => x === "TW").length !== 1) schlecht.push(f.id + " hat nicht genau einen Torwart");
    f.plaetze.forEach((x) => { if (!App.POS[x]) schlecht.push(f.id + " kennt Position " + x + " nicht"); });
  });
  pr("jede Formation hat elf Plätze und genau einen Torwart", !schlecht.length, schlecht.join(" | "));
}

/* ---------------------------------------------- Der eigentliche Punkt */
/* Eine Akademie hochziehen, aufstellen, und pruefen, ob die Wahl das Ergebnis
   bewegt. Ohne diesen Nachweis waere der ganze Modus Dekoration. */
{
  let a = App.leereAkademie();
  App.ABTEILUNGEN.forEach((x) => { a.stufen[x.id] = 5; });
  for (let j = 0; j < 14; j++) { const r = App.akaJahr(a, 2026 + j); a = r.a || a; }

  let { v, fehler: gf } = V.gruenden(V.leererVerein(), { name: "Prüfverein", land: "GER", liga: "3. Liga" });
  pr("Gründung liefert einen bespielbaren Verein", !gf && v.gegruendet && v.liga === "3. Liga");

  let warte = 0;
  while (v.kader.length < V.KADER_MIN && warte < 8) {
    /* Nach BEDARF hochziehen, nicht nach Staerke: die sechzehn staerksten
       Talente koennen ohne Torwart sein. Genau das ist im Prueflauf passiert. */
    for (let n = 0; n < 40 && (!V.kaderVoll(v) || V.bedarf(v).offen > 0); n++) {
      const fehlt = Object.keys(V.bedarf(v).fehlt);
      const kand = [...a.talente].filter((t) => !fehlt.length || fehlt.some((pz) => V.kannSpielen(t, pz)));
      const t = (kand.length ? kand : a.talente).sort((x, y) => y.ovr - x.ovr)[0];
      if (!t) break;
      const r = V.hochziehen(a, v, t.id);
      if (r.fehler) break;
      a = r.aka; v = r.v;
    }
    if (v.kader.length < V.KADER_MIN) { const r = App.akaJahr(a, 2040 + warte); a = r.a || a; warte++; }
  }
  pr("Kader aus eigener Jugend füllbar", V.kaderVoll(v),
     v.kader.length + " Spieler nach " + warte + " Wartejahr(en)");
  pr("und aufstellbar — 16 Spieler sind nicht dasselbe wie eine Mannschaft",
     V.startklar(v), JSON.stringify(V.bedarf(v).fehlt));

  pr("ohne Aufstellung nicht spielbereit", !V.staerke(v).spielbereit);
  pr("Saison wird ohne Aufstellung verweigert", !!V.vereinSaison(v).fehler);

  v = V.autoAufstellen(v);
  const gut = V.staerke(v);
  pr("nach dem Aufstellen spielbereit", gut.spielbereit, "Stärke " + gut.gesamt);

  /* Vertauscht: dieselben Spieler, falsche Plaetze. */
  const ids = Object.values(v.aufstellung);
  const dreh = { ...v, aufstellung: Object.fromEntries(
    Object.keys(v.aufstellung).map((k, i) => [k, ids[ids.length - 1 - i]])) };
  const schlecht = V.staerke(dreh);
  pr("eine falsche Aufstellung ist messbar schlechter", schlecht.gesamt < gut.gesamt - 3,
     gut.gesamt + " gegen " + schlecht.gesamt);

  const tief = V.staerke({ ...v, taktik: "tief" });
  const press = V.staerke({ ...v, taktik: "pressing" });
  pr("Taktik verschiebt Abwehr und Angriff gegenläufig",
     tief.abwehr > press.abwehr && press.angriff > tief.angriff);
  pr("Taktik verändert das Risiko", press.risiko > tief.risiko);

  /* Fuenfzehn Jahre am Stueck: laeuft der Bogen durch, ohne haengenzubleiben? */
  let vv = v, jahre = 0, aufstiege = 0, abstiege = 0, kaputt = null;
  for (let j = 1; j <= V.VEREIN_JAHRE; j++) {
    for (let n = 0; n < 40 && (vv.kader.length < V.KADER_MIN + 2 || V.bedarf(vv).offen > 0); n++) {
      const fehlt = Object.keys(V.bedarf(vv).fehlt);
      const kand = [...a.talente].filter((t) => !fehlt.length || fehlt.some((pz) => V.kannSpielen(t, pz)));
      const t = (kand.length ? kand : a.talente).sort((x, y) => y.ovr - x.ovr)[0];
      if (!t) break;
      const r = V.hochziehen(a, vv, t.id);
      if (r.fehler) break;
      a = r.aka; vv = r.v;
    }
    vv = V.autoAufstellen(vv);
    const r = V.vereinSaison(vv);
    if (r.fehler) { kaputt = "Jahr " + j + ": " + r.fehler; break; }
    if (r.aufstieg) aufstiege++;
    if (r.abstieg) abstiege++;
    vv = r.v; jahre++;
    const ar = App.akaJahr(a, 2050 + j); a = ar.a || a;
  }
  pr("fünfzehn Saisons laufen ohne Abbruch durch", jahre === V.VEREIN_JAHRE && !kaputt,
     kaputt || (jahre + " Saisons · " + aufstiege + " Aufstiege · " + abstiege + " Abstiege"));
  pr("die Bilanz zählt echte Zahlen, keine Nullen",
     vv.bilanz.punkte > 0 && vv.bilanz.tore > 0,
     vv.bilanz.punkte + " Punkte · " + vv.bilanz.tore + ":" + vv.bilanz.gegentore + " Tore");
  pr("die Chronik hat für jede Saison einen Eintrag", vv.chronik.length === jahre);
  pr("der Verein bleibt in seiner Pyramide",
     V.startligen("GER").includes(vv.liga), vv.liga);
}

/* ------------------------------------------- Freischaltung und Ausbau */
{
  const f0 = V.freigeschaltet({ karrieren: 0 });
  const f3 = V.freigeschaltet({ karrieren: 3 });
  const f5 = V.freigeschaltet({ karrieren: 5 });
  pr("ohne Laufbahn ist nichts frei", !f0.akademie && !f0.verein);
  pr("ab 2 Laufbahnen die Akademie, der Verein noch nicht", f3.akademie && !f3.verein,
     "noch " + f3.nochVerein + " bis zum Verein");
  pr("ab 5 Laufbahnen der Verein", f5.akademie && f5.verein);
  pr("fehlende Zahlen stürzen nicht ab", V.freigeschaltet(null).karrieren === 0);

  let { v } = V.gruenden(V.leererVerein(), { name: "X", land: "GER", liga: "3. Liga" });
  pr("Ausbau kostet, was die Tabelle sagt", V.ausbauKosten(v, "training") === V.VEREIN_AUSBAU[0].kosten[1]);
  pr("ohne genug VC kein Ausbau", !!V.ausbauen(v, "training", 0).fehler);
  const r = V.ausbauen(v, "training", 9999);
  pr("mit genug VC schon", !r.fehler && V.ausbauStufe(r.v, "training") === 2, "Kosten " + r.kosten);
  let voll = v;
  for (let n = 0; n < 9; n++) { const x = V.ausbauen(voll, "stadion", 9999); if (x.fehler) break; voll = x.v; }
  pr("Ausbau endet bei der Höchststufe", V.ausbauStufe(voll, "stadion") === V.AUSBAU_MAX &&
     V.ausbauKosten(voll, "stadion") === null);
}

/* -------------------------------------- Wirken Ausbau und Bonus wirklich? */
{
  /* Ein fester Kader, damit nur die eine Schraube den Unterschied macht. */
  const kader = [];
  const posFolge = ["TW","TW","IV","IV","IV","AV","AV","ZDM","ZDM","ZM","ZM","ZOM","AF","AF","ST","ST","ST","ZM"];
  posFolge.forEach((pz, i) => kader.push({ id: "s" + i, name: "S" + i, pos: pz,
    ovr: 50, pot: 80, alter: 19, form: 50, fitness: 80, spiele: 0, tore: 0, jahreImVerein: 0 }));
  let { v } = V.gruenden(V.leererVerein(), { name: "Vergleich", land: "GER", liga: "3. Liga" });
  v = V.autoAufstellen({ ...v, kader });
  const ohne = V.staerke(v).gesamt;
  const mit = V.staerke({ ...v, ausbau: { ...v.ausbau, stadion: 6 } }).gesamt;
  pr("das Stadion hebt die Mannschaftsstärke", mit > ohne, ohne + " → " + mit);

  /* Training: nach einer Saison muessen die Spieler weiter sein. */
  const nach = (stufen) => {
    const r = V.vereinSaison({ ...v, ausbau: { training: stufen, stadion: 1, medizin: 1 } });
    return r.v.kader.reduce((a, s) => a + s.ovr, 0) / r.v.kader.length;
  };
  const t1 = nach(1), t6 = nach(6);
  pr("das Trainingszentrum beschleunigt die Entwicklung", t6 > t1, t1.toFixed(1) + " → " + t6.toFixed(1));

  /* Medizin: aeltere Kader verlieren weniger Spieler. */
  /* Stärke 70, nicht 50: bei schwachen Spielern greift die zweite Bedingung
     ("ab 33 und schwächer als 55") auch mit Ausbau, und der Test maesse dann
     nicht die Medizin, sondern die Schwaeche. Erster Anlauf: 18 gegen 18. */
  const alt = kader.map((s) => ({ ...s, alter: 34, ovr: 70 }));
  const weg = (med) => V.vereinSaison({ ...V.autoAufstellen({ ...v, kader: alt }),
    ausbau: { training: 1, stadion: 1, medizin: med } }).abgaenge.length;
  pr("die medizinische Abteilung verlängert Laufbahnen", weg(6) < weg(1), weg(1) + " gegen " + weg(6) + " Abgänge");
}

/* --------------------------------------- Abschluss und Vermächtnisbonus */
{
  const mach = (b) => V.abschluss({ bilanz: { saisons: 15, aufstiege: 0, abstiege: 0, meister: 0,
    tore: 0, gegentore: 0, punkte: 0, bestePlatzierung: null, ...b }, kader: [] });
  const schwach = mach({ punkte: 300, bestePlatzierung: 12 });
  const stark = mach({ aufstiege: 3, meister: 2, punkte: 900, bestePlatzierung: 1 });
  pr("ein schwacher Durchlauf bringt weniger als ein starker",
     schwach.punkte < stark.punkte && schwach.vc < stark.vc,
     schwach.punkte + "/" + schwach.vc + " VC gegen " + stark.punkte + "/" + stark.vc + " VC");
  pr("auch der schwächste Durchlauf bringt etwas", schwach.vc >= 60);
  pr("Boni kommen gestaffelt, nicht alles oder nichts",
     schwach.boni.length < stark.boni.length && stark.boni.length >= 2,
     schwach.boni.length + " gegen " + stark.boni.length + " Boni");
  pr("ein Abstieg kostet weniger als ein Aufstieg bringt",
     mach({ aufstiege: 1, abstiege: 1 }).punkte > mach({}).punkte);
  pr("das Urteil passt zur Punktzahl", stark.urteil !== schwach.urteil, schwach.urteil + " / " + stark.urteil);

  /* Der Bonus muss im NAECHSTEN Verein ankommen — sonst ist er Zierde. */
  const nv = V.neuerVerein(stark);
  pr("der neue Verein trägt den Bonus", Object.keys(nv.bonus).length > 0, JSON.stringify(nv.bonus));
  const aka = { talente: [{ id: "t1", name: "T", pos: "ST", ovr: 50, pot: 80, alter: 18 }] };
  const ohneB = V.hochziehen(aka, V.leererVerein(), "t1").v.kader[0].ovr;
  const mitB = V.hochziehen(aka, nv, "t1").v.kader[0].ovr;
  pr("Bonus Guter Ruf macht hochgezogene Spieler stärker", mitB > ohneB, ohneB + " → " + mitB);
}


/* ------------------------------- Akademie ohne Jahreszahlen (35.19) */
{
  const A2 = App;
  /* Neue Sicherung: gegruendet 2026, laeuft im Weltjahr 2038 */
  const neu = { gegruendet: 2026, jahr: 2038, jahrgaenge: 12 };
  pr("das laufende Jahr wird relativ gezählt", A2.akaJahrNr(neu) === 13, A2.akaJahrNr(neu) + ". Jahr");
  pr("eine frische Akademie ist im ersten Jahr",
     A2.akaJahrNr({ gegruendet: 2026, jahr: 2026 }) === 1);

  /* ALTE Sicherung: in `ein` steht eine Weltjahreszahl. */
  pr("alte Jahrgangszahlen werden umgerechnet", A2.akaJahrgang(neu, 2032) === 7,
     "2032 → " + A2.akaJahrgang(neu, 2032));
  /* NEUE Sicherung: dort steht schon eine kleine Zahl. */
  pr("neue Jahrgangszahlen bleiben unverändert", A2.akaJahrgang(neu, 7) === 7);
  pr("nie kleiner als 1", A2.akaJahrgang(neu, 2020) === 1);
  /* Ohne Gruendungsjahr darf nichts erfunden werden. */
  pr("ohne Gründungsjahr wird durchgereicht", A2.akaJahrgang({}, 2032) === 2032);
  pr("fehlende Werte stürzen nicht ab",
     A2.akaJahrNr(null) === 1 && A2.akaJahrgang(null, null) === null);

  /* Und der Gang durch eine echte Akademie: die Nummern muessen laufen. */
  /* Gegruendet werden muss sie — sonst ist `gegruendet` null und die relative
     Zaehlung faellt zu Recht auf 1 zurueck. Im Spiel gruendet man immer zuerst;
     der erste Testaufbau hat das uebersprungen und 1,1,1,1,1,1 gemessen. */
  let a = { ...App.leereAkademie(), gegruendet: 2026, jahr: 2026 };
  App.ABTEILUNGEN.forEach((x) => { a.stufen[x.id] = 4; });
  const nr = [];
  for (let j = 0; j < 6; j++) { const r = App.akaJahr(a, 2026 + j); a = r.a || a; nr.push(A2.akaJahrNr(a)); }
  pr("die Jahresnummer zählt lückenlos hoch", nr.join(",") === "1,2,3,4,5,6", nr.join(","));
}


console.log("\n" + ok + " Prüfungen bestanden, " + fehler + " Fehler.");
process.exit(fehler ? 1 : 0);
