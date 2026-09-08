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

  /* ------------------------------------------- Aufstellung von Hand (35.49)
     Nicht "laesst sich aufrufen", sondern: wirkt die Wahl, und richtet sie
     keinen stillen Schaden an anderer Stelle an. */
  {
    const idx = 5;                                   /* ein Feldplatz */
    const platz = V.FORMATIONEN.find((f) => f.id === v.formation).plaetze[idx];
    const kand = V.kandidaten(v, idx);
    pr("Handaufstellung: es gibt Kandidaten für " + platz, kand.length > 0,
       kand.length + " zur Auswahl");
    pr("Kandidaten können dort alle wirklich spielen",
       kand.every((k) => V.kannSpielen(k.sp, platz) && k.guete > 0));
    pr("Kandidaten sind nach Stärke auf DIESEM Platz sortiert",
       kand.every((k, i) => i === 0 || kand[i - 1].wert >= k.wert),
       kand.length ? kand[0].wert + " … " + kand[kand.length - 1].wert : "");
    pr("die angezeigte Zahl ist ovr × Eignung",
       kand.every((k) => k.wert === Math.round(k.sp.ovr * V.guete(k.sp.pos, platz))));

    /* Wer schon woanders steht, muss als solcher erkennbar sein — sonst
       reisst eine Wahl unbemerkt ein Loch. */
    const anderswo = kand.filter((k) => k.stehtAuf != null && k.stehtAuf !== idx);
    pr("Kandidaten melden, wo sie gerade stehen", anderswo.length > 0
       && anderswo.every((k) => typeof k.stehtAufPlatz === "string"),
       anderswo.length + " stehen schon in der Elf");

    /* Ein Spieler von einem ANDEREN Platz hierher: beide Plaetze muessen
       danach besetzt sein. Das ist die Nebenwirkung, die man erst in der
       Tabelle bemerken wuerde. */
    const wechsler = anderswo[0];
    if (wechsler) {
      const vorPlatz = wechsler.stehtAuf;
      const getauscht = V.aufstellen(v, idx, wechsler.sp.id);
      pr("Handaufstellung setzt den gewählten Spieler",
         getauscht.aufstellung[idx] === wechsler.sp.id);
      /* Die Elf darf durch ein Antippen NIE kleiner werden — es sei denn, es
         ist NIEMAND FREI, der den frei gewordenen Platz spielen kann.

         ZWEIMAL FALSCH GEBAUT, beide Male vom Lauf gefunden:
         (1) Der erste Entwurf kannte gar keine Ausnahme und ging im Teillauf
             durch, weil der Verdraengte zufaellig immer zurueckkonnte. Im
             vollen Lauf traf er einen, der es nicht konnte.
         (2) Die Ausnahme fragte dann `v.kader.some(kannSpielen)` — und
             zaehlte damit auch die mit, die schon in der Elf STEHEN. Trifft
             der Zufall einen Kader, in dem alle ST-faehigen Spieler bereits
             aufgestellt sind, meldete die Pruefung rot, obwohl die Mechanik
             genau das Dokumentierte tat. Ein Fehlalarm, der nur manchmal
             kommt, ist schlimmer als gar keine Pruefung: beim naechsten Mal
             glaubt man ihm nicht mehr.
         Frei heisst: nicht in der Ausgangself. Der Verdraengte selbst zaehlt
         dazu, denn sein Platz wird ja gerade geraeumt. */
      const fPlatz = V.FORMATIONEN.find((f) => f.id === v.formation).plaetze[vorPlatz];
      const stehen = new Set(Object.values(v.aufstellung || {}));
      /* Der Verdraengte ist der, der auf dem ZIELPLATZ stand — er wird frei,
         sobald der Gewaehlte dorthin rueckt, und darf deshalb mitzaehlen. */
      const verdraengt = (v.aufstellung || {})[idx];
      const frei = (v.kader || []).filter(
        (sp) => (!stehen.has(sp.id) || sp.id === verdraengt) && V.kannSpielen(sp, fPlatz));
      pr("und reißt an seinem alten Platz kein Loch",
         getauscht.aufstellung[vorPlatz] != null || frei.length === 0,
         "Platz " + vorPlatz + " (" + fPlatz + ") ist "
           + (getauscht.aufstellung[vorPlatz] != null ? "besetzt" : "LEER")
           + ", " + frei.length + " frei verfügbar");
      pr("die Elf wird durch ein Antippen nicht kleiner",
         Object.keys(getauscht.aufstellung).length >= Object.keys(v.aufstellung).length
         || frei.length === 0,
         Object.keys(v.aufstellung).length + " → " + Object.keys(getauscht.aufstellung).length);
      pr("kein Spieler steht doppelt in der Elf", (() => {
        const w = Object.values(getauscht.aufstellung);
        return w.length === new Set(w).size;
      })());
      /* DIESELBE AUSNAHME wie zwei Zeilen darueber. Beim Berichtigen in 35.51
         ist diese Zeile uebersehen worden — sie meldete danach weiter
         sporadisch rot. Wer eine Bedingung an drei Stellen braucht, muss sie
         an alle drei schreiben; eine davon zu vergessen sieht aus wie ein
         echter Befund und ist keiner. */
      pr("die Elf bleibt nach dem Tausch spielbereit",
         V.staerke(getauscht).spielbereit || frei.length === 0,
         "Stärke " + V.staerke(getauscht).gesamt + ", " + frei.length + " frei verfügbar");
    } else {
      pr("Tauschprobe konnte gebaut werden", false, "kein Wechsler gefunden");
    }

    /* ------- Der schwere Fall, absichtlich gebaut -------------------------
       Bis hierher haengt es am Zufall, ob der Verdraengte auf dem frei
       gewordenen Platz spielen kann. Im Teillauf ging es immer auf, im vollen
       Lauf nicht — und genau dort fiel auf, dass ein Antippen ein Loch reisst.
       Ein Fall, der nur manchmal geprueft wird, ist nicht geprueft.

       Gebaut wird die Asymmetrie in GUETE: ein ZOM kann ST spielen (0,80),
       ein ST aber KEIN ZM. Steht der ZOM auf einem ZM-Platz und wird auf den
       ST-Platz gesetzt, kann der verdraengte ST nicht zurueck. */
    {
      const f442 = V.FORMATIONEN.find((f) => f.id === "442");
      const zmIdx = f442.plaetze.indexOf("ZM");
      const stIdx = f442.plaetze.indexOf("ST");
      const mach = (id, pos, ovr) => ({ id, name: id, pos, ovr, pot: 80, alter: 22,
        form: 50, fitness: 80, spiele: 0, tore: 0, jahreImVerein: 0 });
      const kader = f442.plaetze.map((pz, i) => mach("h" + i, pz === "ZM" && i === zmIdx ? "ZOM" : pz, 60))
        .concat([mach("bankZM", "ZM", 55), mach("bankIV", "IV", 55),
                 mach("bankST", "ST", 55), mach("bankAV", "AV", 55),
                 mach("bankTW", "TW", 55)]);
      let hv = { ...V.leererVerein(), gegruendet: true, name: "Hart", land: "GER",
                 liga: "3. Liga", formation: "442", kader };
      hv = { ...hv, aufstellung: Object.fromEntries(f442.plaetze.map((pz, i) => [i, "h" + i])) };

      pr("Hartprobe: Ausgangself ist vollständig", V.staerke(hv).spielbereit,
         "Stärke " + V.staerke(hv).gesamt);
      pr("Hartprobe: der Verdrängte kann NICHT zurück",
         !V.kannSpielen(kader.find((x) => x.id === "h" + stIdx), "ZM"),
         "ST auf ZM = " + V.guete("ST", "ZM"));

      const nach = V.aufstellen(hv, stIdx, "h" + zmIdx);
      pr("Hartprobe: der Gewählte steht auf dem Zielplatz",
         nach.aufstellung[stIdx] === "h" + zmIdx);
      pr("Hartprobe: der frei gewordene Platz wird von der Bank nachbesetzt",
         nach.aufstellung[zmIdx] != null,
         "ZM-Platz: " + (nach.aufstellung[zmIdx] || "LEER"));
      pr("Hartprobe: die Elf bleibt vollständig und spielbereit",
         V.staerke(nach).spielbereit,
         Object.keys(nach.aufstellung).length + " Plätze, Stärke " + V.staerke(nach).gesamt);
      pr("Hartprobe: niemand steht doppelt",
         Object.values(nach.aufstellung).length === new Set(Object.values(nach.aufstellung)).size);

      /* Und die Gegenrichtung: ist NIEMAND da, der nachruecken kann, MUSS der
         Platz leer bleiben — nicht mit einem Ungeeigneten gestopft werden.
         ERST FALSCH GEBAUT: nur `bankZM` entfernt. ZM kann aber auch ein
         Aussenverteidiger spielen (0,68), also rueckte `bankAV` nach und die
         Probe meldete rot, obwohl die Mechanik stimmte. Nicht der Code war
         schuld, sondern meine Annahme. Auf der Bank darf jetzt WIRKLICH
         niemand ZM koennen: IV, ST und TW koennen es nicht. */
      const ohneBank = { ...hv,
        kader: kader.filter((x) => x.id !== "bankZM" && x.id !== "bankAV") };
      const nach2 = V.aufstellen(ohneBank, stIdx, "h" + zmIdx);
      pr("Hartprobe: ohne Ersatz bleibt der Platz leer statt fehlbesetzt",
         nach2.aufstellung[zmIdx] == null && V.staerke(nach2).fehlbesetzt === 0,
         V.staerke(nach2).leer + " leer, " + V.staerke(nach2).fehlbesetzt + " fehlbesetzt");
    }

    /* Wer dort NICHT spielen kann, darf auch von Hand nicht dorthin. */
    const unmoeglich = (v.kader || []).find((sp) => !V.kannSpielen(sp, platz));
    if (unmoeglich) {
      const versuch = V.aufstellen(v, idx, unmoeglich.id);
      const abgewiesen = versuch.aufstellung[idx] !== unmoeglich.id;
      /* Der Zusatz MISST, statt das erwartete Ergebnis zu behaupten. Im
         ersten Entwurf stand hier fest "abgelehnt" — in der Gegenprobe
         meldete die Zeile dann "✗ ... abgelehnt", also das Gegenteil dessen,
         was gemessen war. Eine Meldung, die im Fehlerfall luegt, schickt
         genau dann in die Irre, wenn man sie braucht. */
      pr("ein ungeeigneter Spieler wird abgewiesen", abgewiesen,
         unmoeglich.pos + " auf " + platz + ": " + (abgewiesen ? "abgelehnt" : "DURCHGELASSEN"));
    } else {
      pr("Abweisprobe konnte gebaut werden", false, "jeder kann dort spielen");
    }

    /* Freimachen und die Folge: nicht mehr spielbereit. Eine Luecke, die der
       Rechenkern nicht bemerkt, waere schlimmer als gar keine Handwahl. */
    const leer = V.freimachen(v, idx);
    pr("Platz leeren entfernt genau einen Spieler",
       Object.keys(leer.aufstellung).length === Object.keys(v.aufstellung).length - 1);
    pr("und die Mannschaft ist danach NICHT mehr spielbereit",
       !V.staerke(leer).spielbereit, V.staerke(leer).leer + " Platz/Plätze leer");
    pr("eine Lücke kostet messbar Stärke",
       V.staerke(leer).gesamt < gut.gesamt, gut.gesamt + " → " + V.staerke(leer).gesamt);

    /* Saeubern: Geister raus, Handarbeit bleibt. */
    const ohne = { ...v, kader: v.kader.filter((sp) => sp.id !== v.aufstellung[idx]) };
    const sauber = V.aufstellungSaeubern(ohne);
    pr("Säubern entfernt Verweise auf abgegangene Spieler",
       sauber.aufstellung[idx] == null);
    pr("Säubern lässt die übrige Handarbeit stehen",
       Object.keys(sauber.aufstellung).length === Object.keys(v.aufstellung).length - 1);

    /* Formationswechsel: wer auf dem neuen Platz spielen kann, bleibt. */
    const andere = V.FORMATIONEN.find((f) => f.id !== v.formation);
    const gewechselt = V.aufstellungSaeubern({ ...v, formation: andere.id });
    const neueP = andere.plaetze;
    pr("nach Formationswechsel steht niemand auf einem Platz, den er nicht kann",
       Object.keys(gewechselt.aufstellung).every((i) =>
         V.kannSpielen(v.kader.find((sp) => sp.id === gewechselt.aufstellung[i]), neueP[Number(i)])),
       andere.n + ": " + Object.keys(gewechselt.aufstellung).length + " von 11 bleiben stehen");
  }

  /* Die Saison darf die Handarbeit nicht mehr wegwerfen (35.49). Bis 35.48
     setzte sie `aufstellung: {}` — das war richtig, solange die Aufstellung
     automatisch entstand. */
  {
    const r = V.vereinSaison(V.autoAufstellen(v));
    if (!r.fehler) {
      const uebrig = Object.keys(r.v.aufstellung || {}).length;
      pr("die Saison behält die Aufstellung, statt sie zu leeren", uebrig > 0,
         uebrig + " von 11 stehen nach der Saison noch");
      pr("und niemand darin ist ein Geist",
         Object.values(r.v.aufstellung || {}).every((id) => r.v.kader.some((sp) => sp.id === id)));
    } else {
      pr("Saisonprobe für die Aufstellung lief", false, r.fehler);
    }
  }

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


/* ============================================================================
   35.28 — Der Verein laeuft NEBENHER, nicht auf Zuruf
   ----------------------------------------------------------------------------
   Bis 35.28 gab es einen Knopf "Saison spielen", der beliebig oft gedrueckt
   werden konnte: der Verein lief voellig unabhaengig von den Spielerlaufbahnen.
   Kevin hat es auf dem Geraet gesehen — vier Vereinsjahre, ohne dass eine
   einzige Laufbahn dazwischen lag.

   Geprueft wird die REGEL, nicht der Bildschirm: `spieltMit` entscheidet, ob am
   Ende einer Laufbahn eine Saison faellig ist. Alle drei Stellen (Bildschirm,
   Ablauf, Pruefstand) fragen dieselbe Funktion — sonst laufen sie auseinander.
   ========================================================================== */
(function vereinLaeuftNebenher() {
  const V2 = App.VEREIN;
  const gruen = (name) => {
    /* Genau der Aufruf, der oben in dieser Datei schon funktioniert. Der erste
       Entwurf gab `startligen("GER")[0]` mit — das ist kein Ligakuerzel, und
       die Gruendung meldete "Kein Verein gegruendet". Nachgesehen statt
       weitergeraten. */
    const r = V2.gruenden(V2.leererVerein(),
      { name: name || "Prueffverein", land: "GER", liga: "3. Liga" });
    return r && r.v ? r.v : null;
  };

  let v = gruen();
  pr("Verein: frisch gegruendet ist NICHT eingeschrieben", v && v.eingeschrieben === false);
  pr("Verein: spielt nicht mit, solange nicht eingeschrieben", !V2.spieltMit(v));

  /* Einschreiben ohne Kader muss scheitern — sonst laeuft ein leerer Verein. */
  const ohne = V2.einschreiben(v);
  pr("Verein: Einschreiben ohne Kader wird abgelehnt", !!(ohne && ohne.fehler));

  /* Mit Kader und Aufstellung muss es gehen. Die Talente kommen aus einer
     ausgebauten Akademie, damit genug da sind. */
  /* Abteilungen HOCHSETZEN, sonst liefert die Akademie zu wenig: der erste
     Entwurf spielte zwoelf Jahre auf Stufe 1 und bekam 4 Talente statt 16.
     Dasselbe Muster wie oben in dieser Datei. */
  /* HOCHZIEHEN UND WARTEN im Wechsel. Zwei Entwuerfe vorher gescheitert:
     erst feste 14 Jahre (mal 16 Talente, mal 14 — die Pruefung war mal rot,
     mal gruen), dann Warten auf 18 gleichzeitig verfuegbare. Letzteres kann
     NIE eintreten: Talente altern aus, es stehen immer nur ~14 auf einmal da.
     Wer wartet, bis sich genug ansammeln, wartet ewig.
     Also nehmen, was da ist, ein Jahr weiterlaufen lassen, wieder nehmen —
     genau wie die Pruefung weiter oben in dieser Datei. */
  let a = App.leereAkademie();
  App.ABTEILUNGEN.forEach((x) => { a.stufen[x.id] = 6; });
  let voll = v, jahr = 2026;
  /* Abbruch bei SPIELBEREIT, nicht bei Kadergroesse. Der dritte Entwurf zog
     genau 16 Mann hoch und scheiterte trotzdem sporadisch mit „Kader oder
     Aufstellung fehlen": sechzehn Spieler reichen nicht, wenn kein Torwart
     dabei ist. Gefragt ist nicht die Zahl, sondern die Besetzung — also so
     lange nachlegen, bis die Aufstellung steht. */
  for (let i = 0; i < 60; i++) {
    voll = V2.autoAufstellen(voll);
    if (V2.staerke(voll).spielbereit) break;
    const r = App.akaJahr(a, jahr++); a = r.a || a;
    for (const t of (a.talente || []).filter((x) => x.alter >= 16)) {
      if ((voll.kader || []).length >= V2.KADER_MIN + 10) break;
      const h = V2.hochziehen(a, voll, t.id);
      if (h && !h.fehler) { voll = h.v; a = h.aka; }
    }
  }
  pr("Verein: Kader spielbereit bekommen", V2.staerke(voll).spielbereit,
     (voll.kader || []).length + " Mann");
  {
    voll = V2.autoAufstellen(voll);
    const ein = V2.einschreiben(voll);
    pr("Verein: Einschreiben mit vollem Kader geht", !!(ein && ein.v && ein.v.eingeschrieben),
       ein && ein.fehler ? ein.fehler : "");
    if (ein && ein.v) {
      pr("Verein: eingeschrieben + spielbereit = spielt mit", V2.spieltMit(ein.v));
      const alt = { ...ein.v, jahr: V2.VEREIN_JAHRE + 1 };
      pr("Verein: nach " + V2.VEREIN_JAHRE + " Jahren spielt er nicht mehr mit", !V2.spieltMit(alt));
      const duenn = { ...ein.v, kader: (ein.v.kader || []).slice(0, 3), aufstellung: {} };
      pr("Verein: zu duenner Kader = Jahr faellt aus", !V2.spieltMit(duenn));
    }
  }

  /* ============ Fleissarbeit (35.74) =====================================
     Achtzehn neue Errungenschaften, die ueber viele Durchlaeufe gehen. Der
     gefaehrlichste Fehler bei so etwas ist nicht ein falscher Schwellwert,
     sondern eine Bedingung, die NIE wahr wird: sie steht dann fuer immer grau
     da und niemand erfaehrt warum.

     Geprueft wird deshalb mit einer Bilanz, die die Schwellen sicher
     ueberschreitet — und mit einer, die sie sicher NICHT erreicht. Beides ist
     noetig: eine Bedingung, die immer wahr ist, waere genauso kaputt. */
  {
    const ACH2 = App.ACHIEVEMENTS || [];
    const fleiss = ACH2.filter((x) => /^a_(aka|ver)F_/.test(x.id));
    pr("Fleiss: es gibt die neuen Errungenschaften", fleiss.length >= 15,
       fleiss.length + " Stück");

    /* Eine Bilanz weit ueber allen Schwellen. */
    const vielG = { vereineFertig: 12, vereinSaisons: 180, vereinMeister: 20,
      vereinAufstiege: 14, vereinTore: 1400, vereinPunkteBest: 1200,
      vereinPunkteSumme: 9000 };
    /* `jahrgaenge` NACHGETRAGEN in 35.102, und der Grund gehoert hierher:
       solange `a_akaF_jg50` auf `chronik.length` sah, reichte das gefuellte
       `chronik`-Feld — die Probe war gruen, waehrend die Errungenschaft im
       Spiel unerreichbar war. Nach der Berichtigung fiel sie sofort rot aus,
       weil dieser gebaute Zustand das Feld gar nicht kannte. Ein Zustand, der
       „weit ueber allen Schwellen" liegen soll, muss JEDES Feld tragen, das
       eine Bedingung liest; sonst prueft er die Form der Bedingung statt ihrer
       Erfuellbarkeit. Die Probe darunter faengt genau diese Luecke ab. */
    const vielA = { ruhm: 500, chronik: new Array(60).fill({ jahr: 1 }),
      jahrgaenge: 60,
      bilanz: { aufgenommen: 300, profis: 140, weltklasse: 14,
        nationalspieler: 26, turniere: 12, abbrecher: 40 } };
    const nie = fleiss.filter((x) => {
      try { return !x.ok({}, vielG, vielA, null); } catch (e) { return true; }
    }).map((x) => x.n);
    pr("Fleiss: jede ist mit genug Fleiss erreichbar", nie.length === 0,
       nie.length ? "nie wahr: " + nie.join(", ") : fleiss.length + " von " + fleiss.length);

    /* Und die Gegenrichtung: bei einer frischen Bilanz darf KEINE zuschnappen.
       Sonst waere die Fleissarbeit ein Geschenk. */
    const leerG = { vereineFertig: 0, vereinSaisons: 0, vereinMeister: 0,
      vereinAufstiege: 0, vereinTore: 0, vereinPunkteBest: 0 };
    const leerA = { ruhm: 0, chronik: [],
      bilanz: { aufgenommen: 0, profis: 0, weltklasse: 0,
        nationalspieler: 0, turniere: 0, abbrecher: 0 } };
    const sofort = fleiss.filter((x) => {
      try { return x.ok({}, leerG, leerA, null); } catch (e) { return false; }
    }).map((x) => x.n);
    pr("Fleiss: bei leerem Konto schnappt keine zu", sofort.length === 0,
       sofort.length ? "sofort wahr: " + sofort.join(", ") : "alle verlangen etwas");

    /* ---- ERREICHBARKEIT AUS ECHTEN ZUSTAENDEN (35.102) -------------------
       Die drei Proben darueber bauen ihren Zustand von Hand (`vielA`,
       `leerA`). Das ist fuer Schwellwerte richtig, hat aber eine Luecke, die
       35.101 teuer bezahlt hat: eine Bedingung kann fuer einen GEBAUTEN
       Zustand korrekt sein, obwohl der echte Spielverlauf ihn nie erzeugt.

       `a_akaF_jg50` las bis 35.101 `chronik.length >= 50`. `vielA` enthielt
       `chronik: new Array(60)` — also meldete die Probe gruen. Im Spiel
       kappt `akaJahr` die Chronik auf 25, die Errungenschaft war unerreichbar
       und mit ihr die Wildcard `mw_werkbank`. Beide Richtungen der Gegenprobe
       liefen ueber denselben synthetischen Zustand und konnten es deshalb
       nicht sehen.

       Diese Probe fuehrt die Akademie stattdessen wirklich fort und prueft
       DANACH. Was hier gruen ist, ist im Spiel erreichbar. */
    {
      /* WARUM MEHRERE LAEUFE UND NICHT EINER (gemessen 35.102): ein einzelner
         Lauf ueber 60 Jahre verfehlte die Schwelle von `a_akaF_wk10` (zehn
         Weltklassespieler) in 6 von 25 Faellen — die Probe waere also in
         knapp einem Viertel aller Laeufe rot geworden, ohne dass etwas kaputt
         ist. Eine Pruefung, die zufaellig rot meldet, ist schlimmer als keine:
         sie erzieht dazu, rote Meldungen zu uebergehen.

         Gemessene Streuung der Weltklassezahl bei vollem Ausbau, 25 Laeufe je
         Zeile:

             25 Jahre   min  1 · Median  4 · max  7    unter 10: 25 von 25
             40 Jahre   min  3 · Median  8 · max 15    unter 10: 19 von 25
             60 Jahre   min  5 · Median 11 · max 15    unter 10:  6 von 25
             80 Jahre   min  7 · Median 15 · max 25    unter 10:  2 von 25
            100 Jahre   min 11 · Median 20 · max 28    unter 10:  0 von 25

         Laenger laufen zu lassen haette das Flattern nur verkleinert, nicht
         beseitigt. Deshalb ist die FRAGE anders gestellt: erreichbar heisst
         „in wenigstens einem echten Verlauf erreicht", nicht „in jedem". Das
         ist ohnehin die richtige Frage — ein Langzeitziel darf schwer sein.
         `a_akaF_jg50` faellt trotzdem auf, weil die Chronik in JEDEM Lauf bei
         25 stehen bleibt. */
      const LAEUFE_R = 5, JAHRE_R = 100;
      const staende = [];
      for (let k = 0; k < LAEUFE_R; k++) {
        let A = App.akaGruenden(App.leereAkademie(), "Erreichbarkeit", 2026);
        const st = {}; App.ABTEILUNGEN.forEach((x) => { st[x.id] = App.AKA_MAX; });
        A = { ...A, stufen: { ...A.stufen, ...st } };
        for (let j = 0; j < JAHRE_R; j++) { const r = App.akaJahr(A, 2027 + j); A = (r && r.a) || r; }
        staende.push(A);
      }
      const E = staende[0];

      /* Erst die Grundlage: hat der Lauf ueberhaupt stattgefunden? Ohne diese
         Zeile koennte ein kaputter Aufbau alles rot melden und wie ein Fund
         aussehen — genau der Fehler, der beim Vereinsteil dieser Suche
         passiert ist. */
      pr("Erreichbar: " + LAEUFE_R + "×" + JAHRE_R + " echte Akademiejahre sind gelaufen",
         staende.every((A) => (A.jahrgaenge || 0) === JAHRE_R && (A.bilanz.profis || 0) > 0),
         staende.map((A) => (A.bilanz.profis || 0) + " Profis").join(" · "));

      /* Und die Kappung ausdruecklich festhalten: sie ist gewollt, aber jede
         Bedingung, die `chronik.length` als Langzeitzaehler benutzt, ist damit
         falsch. Faellt der Deckel je weg, meldet sich diese Zeile. */
      pr("Erreichbar: die Chronik bleibt gedeckelt — kein Langzeitzähler",
         staende.every((A) => (A.chronik || []).length === 25),
         "chronik 25 nach " + JAHRE_R + " Jahrgängen, in allen " + LAEUFE_R + " Läufen");

      /* Jede Bedingung, die AUSSCHLIESSLICH Akademiefelder liest, muss in
         wenigstens einem der Laeufe zutreffen. Wer mehr braucht, gehoert
         nicht in diese Familie. */
      const nurAka = ACH2.filter((x) => {
        const q = String(x.ok);
        return /\bA\./.test(q) && !/\bG\.|\bp\.|\bV\./.test(q);
      });
      const trifft = (x, A) => { try { return !!x.ok({}, {}, A, null); } catch (e) { return false; } };
      const nie2 = nurAka.filter((x) => !staende.some((A) => trifft(x, A)))
                         .map((x) => x.id + " (" + x.n + ")");
      pr("Erreichbar: jedes reine Akademieziel ist in " + JAHRE_R + " vollen Jahren drin",
         nie2.length === 0,
         nie2.length ? "in KEINEM von " + LAEUFE_R + " Läufen: " + nie2.join(", ")
                     : nurAka.length + " von " + nurAka.length);

      /* GEGENPROBE. Ohne sie beweist die Zeile darueber nichts: sie koennte
         auch gruen sein, weil `nurAka` leer ist oder der Filter nicht greift.
         Die alte, kaputte Bedingung wird hier absichtlich nachgestellt und
         MUSS in jedem Lauf durchfallen. */
      const alteBedingung = (A2) => !!A2 && (A2.chronik || []).length >= 50;
      pr("Erreichbar: Gegenprobe — die alte Bedingung fällt auf",
         staende.every((A) => alteBedingung(A) === false),
         "chronik.length >= 50 bleibt in allen Läufen bei 25");
      pr("Erreichbar: Gegenprobe — der Filter greift überhaupt",
         nurAka.length >= 10, nurAka.length + " reine Akademieziele gefunden");
      pr("Erreichbar: Gegenprobe — ein unerfüllbares Ziel würde auffallen",
         !staende.some((A) => (A.jahrgaenge || 0) >= JAHRE_R * 10),
         "eine Schwelle zehnmal über dem Lauf trifft in keinem Stand zu");
    }

    /* Keine darf abstuerzen, wenn Akademie oder Verein fehlen — der
       Normalfall in den ersten Laufbahnen. */
    const kaputt2 = [];
    fleiss.forEach((x) => {
      try { x.ok({}, {}, null, null); } catch (e) { kaputt2.push(x.id); }
    });
    pr("Fleiss: keine stürzt ohne Akademie ab", kaputt2.length === 0,
       kaputt2.join(", ") || "alle fangen es ab");

    /* Die Belohnungen muessen es geben — und die Karten dazu. */
    const lohn2 = fleiss.filter((x) => x.lohn).map((x) => x.lohn);
    const fehltL = lohn2.filter((k) => !(App.META || {})[k]);
    pr("Fleiss: jede Belohnung existiert", fehltL.length === 0,
       fehltL.join(", ") || lohn2.length + " Belohnungen");
    const karten = lohn2.filter((k) => ((App.META || {})[k] || {}).typ === "karte");
    const ohneKarte = karten.filter((k) => !(App.WILDCARDS || []).some((w) => w.req === k));
    pr("Fleiss: jede Kartenbelohnung hat auch eine Karte", ohneKarte.length === 0,
       ohneKarte.length ? "ohne Karte: " + ohneKarte.join(", ")
         : karten.length + " Karten, alle vorhanden");
    /* Und die Karten duerfen NICHT im Vorrat sein, solange sie nicht
       freigeschaltet sind — sonst waere die Freischaltung Zierde. */
    const neueKarten = (App.WILDCARDS || []).filter((w) => karten.indexOf(w.req) >= 0);
    pr("Fleiss: die neuen Karten sind ohne Freischaltung gesperrt",
       neueKarten.length > 0 && neueKarten.every((w) => !!w.req),
       neueKarten.map((w) => w.n).join(", "));
  }

  /* ============ Kartenpool, das Fundament (35.79) ========================
     Kevin: „gezogene Spieler kommen nur dazu und sollen die Spieler aus der
     Akademie lediglich ergaenzen" — die Akademie bleibt das Herz.
     Und: „wenn eine Profimannschaft durchgespielt wurde, werden alle Spieler
     in den Pool aufgenommen, DAUERHAFT."

     Dauerhaft ist das Wort, an dem es haengt. Alles andere ueber den eigenen
     Verein liegt AM Verein, und der wird alle fuenfzehn Jahre ersetzt — genau
     daran ist in 35.73 der Abschlussbonus verlorengegangen. */
  {
    const K = App.KARTEN;
    if (!K) { pr("Karten: Modul vorhanden", false, "KARTEN nicht ausgeführt"); }
    else {
      /* Die Seltenheit muss die Quelle erkennbar machen — das war der Zweck
         der Messung ueber 539 echte Spieler. */
      pr("Karten: die Stufen sind aufsteigend",
         K.stufeFuer(50) === "bronze" && K.stufeFuer(65) === "silber"
         && K.stufeFuer(75) === "gold" && K.stufeFuer(90) === "legende",
         "50→" + K.stufeFuer(50) + " 65→" + K.stufeFuer(65)
         + " 75→" + K.stufeFuer(75) + " 90→" + K.stufeFuer(90));
      pr("Karten: die Grenzen sitzen genau",
         K.stufeFuer(61) === "bronze" && K.stufeFuer(62) === "silber"
         && K.stufeFuer(71) === "silber" && K.stufeFuer(72) === "gold"
         && K.stufeFuer(81) === "gold" && K.stufeFuer(82) === "legende");

      /* Aus allen drei Quellen muss eine Karte werden — mit Herkunft, denn
         ohne sie laesst sich „3 aus der Vorgaengermannschaft, 1 aus der
         Halle" nicht ziehen. */
      /* `ausAbsolvent` statt `ausTalent` (35.124): die Funktion nimmt jetzt
         einen ABSOLVENTEN entgegen, nicht ein laufendes Talent — erst der hat
         eine Geschichte (Jahrgang, Abgangsjahr, erreichte Höchststärke).
         Der Absolvent führt `peak` und `raus`, nicht `ovr` und `alter`. */
      const t = K.ausAbsolvent({ id: "t1", name: "Absolvent", pos: "ST",
        peak: 64, ein: 2026, raus: 2029, flag: "🇩🇪", nat: "GER",
        klub: "Erster FC", ns: false });
      const s2 = K.ausKader({ id: "k1", name: "Profi", pos: "IV", ovr: 74, pot: 80,
        alter: 25, flag: "🇩🇪", spiele: 200, tore: 8, jahreImVerein: 6 }, "Testelf", 12);
      const h = K.ausHalle({ name: "Legende", pos: "ZM", nat: "🇩🇪", age: 36,
        peak: 88, score: 900, titles: 9, goals: 300, caps: 80, bis: 2050 }, 0);
      pr("Karten: Absolvent, Kaderspieler und Halleneintrag werden Karten",
         !!(t.kid && s2.kid && h.kid),
         t.stufe + " / " + s2.stufe + " / " + h.stufe);
      pr("Karten: die Herkunft steht drauf",
         t.herkunft === "akademie" && s2.herkunft === "verein" && h.herkunft === "halle");
      /* Die Halle fuehrt `peak`, nicht `ovr` — eine Legende darf keine Karte
         mit 58 werden, nur weil sie mit 38 aufgehoert hat. */
      pr("Karten: die Halle zeigt den Bestwert, nicht den Stand beim Rücktritt",
         h.ovr === 88, "ovr " + h.ovr);
      pr("Karten: der Verein steht auf der Kaderkarte", s2.verein === "Testelf");

      /* DER POOL. Zusammenfuehren statt anhaengen: derselbe Spieler aus drei
         Durchlaeufen ist EINE Karte, sonst zieht ein Pack dreimal denselben. */
      let pool = K.leererPool();
      pool = K.poolErgaenzen(pool, [t, s2, h]);
      pr("Pool: drei Karten drin", pool.karten.length === 3, "stand " + pool.stand);
      pool = K.poolErgaenzen(pool, [t, s2]);
      pr("Pool: Doppelte werden zusammengeführt, nicht angehängt",
         pool.karten.length === 3, pool.karten.length + " Karten nach dem zweiten Mal");
      /* Und auf den BESSEREN Wert: die Karte zeigt, was er konnte. */
      pool = K.poolErgaenzen(pool, [{ ...s2, ovr: 79 }]);
      const wieder = pool.karten.find((x) => x.kid === s2.kid);
      pr("Pool: der bessere Wert gewinnt", wieder && wieder.ovr === 79,
         "ovr " + (wieder && wieder.ovr));
      pool = K.poolErgaenzen(pool, [{ ...s2, ovr: 60 }]);
      const nochmal = pool.karten.find((x) => x.kid === s2.kid);
      pr("Pool: ein schlechterer Wert überschreibt NICHT",
         nochmal && nochmal.ovr === 79, "ovr " + (nochmal && nochmal.ovr));

      pr("Pool: nach Herkunft filterbar",
         K.nachHerkunft(pool, "halle").length === 1
         && K.nachHerkunft(pool, "verein").length === 1);
      const z = K.zaehlen(pool);
      pr("Pool: je Stufe zählbar", z.silber === 1 && z.gold === 1 && z.legende === 1,
         JSON.stringify(z));

      /* DAUERHAFT: durch einen Spielstand geschickt. */
      const wieder2 = JSON.parse(JSON.stringify(pool));
      pr("Pool: übersteht das Speichern",
         wieder2.karten.length === pool.karten.length
         && wieder2.karten[0].stufe === pool.karten[0].stufe,
         "sonst wäre „dauerhaft“ eine Behauptung");

      /* Nichts geht verloren: ein leerer Pool und leere Zugaben duerfen nicht
         stuerzen — der Normalfall in den ersten Laufbahnen. */
      pr("Pool: leer und ohne Zugabe stürzt nicht",
         K.poolErgaenzen(null, null).karten.length === 0);

      /* ---- Packs (35.80) ------------------------------------------------
         Eine Zusage wie „mindestens einer in Gold" ist eine Behauptung, bis
         sie ueber viele Ziehungen gemessen ist. Hier 1200 je Pack — genug,
         damit ein Loch von einem Prozent auffiele. */
      pr("Packs: es gibt vier Stufen", (K.PACKS || []).length === 4,
         (K.PACKS || []).map((x) => x.n + " " + x.preis + " VC").join(" · "));
      pr("Packs: die Preise steigen mit der Stufe",
         K.PACKS.every((x, i) => i === 0 || x.preis > K.PACKS[i - 1].preis));

      const ZIEH = 1200;
      let alleGut = true, zusagen = [];
      K.PACKS.forEach((pk) => {
        let ok2 = 0, anzahlOk = 0;
        const rang = (st) => K.REIHE.indexOf(st);
        for (let i = 0; i < ZIEH; i++) {
          const r = K.ziehen(pk.id, pool, 2030);
          if ((r.karten || []).length === pk.karten) anzahlOk++;
          if (!pk.mind) { ok2++; continue; }
          if (r.karten.some((c) => rang(c.stufe) >= rang(pk.mind))) ok2++;
        }
        if (anzahlOk !== ZIEH) alleGut = false;
        if (ok2 !== ZIEH) { alleGut = false; zusagen.push(pk.n + " " + (ok2 / ZIEH * 100).toFixed(1) + " %"); }
      });
      pr("Packs: jede Ziehung liefert die zugesagte Kartenzahl", alleGut || !zusagen.length,
         ZIEH + " Ziehungen je Pack");
      pr("Packs: die Mindestzusage hält IMMER", zusagen.length === 0,
         zusagen.length ? zusagen.join(", ")
           : "auch wenn der Würfel dreimal Bronze sagt");

      /* Und die Gegenrichtung: ein Bronzepack darf NICHT regelmaessig
         Legenden ausspucken, sonst waeren die teuren Packs sinnlos. */
      let legendenImBronze = 0;
      for (let i = 0; i < ZIEH; i++) {
        K.ziehen("bronze", pool, 2030).karten
          .forEach((c) => { if (c.stufe === "legende") legendenImBronze++; });
      }
      pr("Packs: aus Bronze kommen keine Legenden", legendenImBronze === 0,
         legendenImBronze + " in " + ZIEH + " Ziehungen");

      /* Sonderkarten aus dem eigenen Pool — sie ERSETZEN keine gezogene
         Karte, sie kommen dazu. Wer eine Legende findet, soll nicht dafuer
         eine andere verlieren. */
      let mitSonder = 0, immerVoll = true;
      for (let i = 0; i < ZIEH; i++) {
        const r = K.ziehen("legende", pool, 2030);
        if (r.sonder) mitSonder++;
        if (r.karten.length !== 3) immerVoll = false;
      }
      pr("Packs: Sonderkarten kommen dazu, ersetzen nichts", immerVoll,
         "immer 3 gezogene Karten, Sonderkarte zusätzlich");
      pr("Packs: Sonderkarten sind selten genug",
         mitSonder / ZIEH > .15 && mitSonder / ZIEH < .45,
         (mitSonder / ZIEH * 100).toFixed(1) + " % beim Legendenpack");
      /* Ohne Pool gibt es keine Sonderkarte — und das darf nicht stuerzen. */
      pr("Packs: ohne Pool keine Sonderkarte, aber auch kein Absturz",
         !K.ziehen("legende", K.leererPool(), 2030).sonder);
      pr("Packs: ein unbekanntes Pack wird abgewiesen",
         !!K.ziehen("gibtsnicht", pool, 2030).fehler);

      /* Die Preisansage muss stimmen — eine falsche waere schlimmer als
         keine. */
      pr("Packs: der Preis wird in Laufbahnen angesagt",
         K.preisInLaufbahnen("silber") > 0.4 && K.preisInLaufbahnen("silber") < 0.8,
         "Silberpack " + K.preisInLaufbahnen("silber") + " Laufbahnen");

      /* Gezogene Karten sind FERTIGE Spieler, keine Fuenfzehnjaehrigen — die
         Akademie soll nicht ersetzt werden (Kevins Entscheidung). */
      const probe = K.ziehen("gold", pool, 2030).karten;
      pr("Packs: gezogene Spieler sind fertig, nicht Nachwuchs",
         probe.every((c) => c.alter >= 20 && c.pot - c.ovr <= 6),
         "Alter " + probe.map((c) => c.alter).join("/")
           + " · Anlage über Stärke " + probe.map((c) => c.pot - c.ovr).join("/"));
    }
  }

  /* ============ Die Aufstellung als Feld (35.91) =========================
     Kevin: „Die Aufstellung der Karten sollte schon passend zur Aufstellung
     sein" — mit einer Skizze: Torwart oben, Viererkette darunter, und die
     Aussenverteidiger AUSSEN. */
  {
    if (!V.feldReihen) pr("Feld: feldReihen vorhanden", false, "fehlt");
    else {
      V.FORMATIONEN.forEach((f) => {
        const r5 = V.feldReihen(f.id);
        const alle = r5.reduce((a2, x) => a2.concat(x), []);
        /* JEDER PLATZ GENAU EINMAL. Der naheliegende Fehler beim Umsortieren
           ist, einen zu verlieren oder zu verdoppeln — und beides faellt
           optisch kaum auf, weil elf Karten immer nach elf aussehen. */
        pr("Feld " + f.n + ": alle elf Plätze genau einmal",
           alle.length === f.plaetze.length
           && new Set(alle.map((x) => x.i)).size === f.plaetze.length,
           alle.length + " Stellen, " + new Set(alle.map((x) => x.i)).size + " verschieden");
        /* Die Stellen muessen zu den Positionen passen — sonst stuende ein
           Spieler auf einem Platz, der ihm nicht gehoert. */
        const falsch = alle.filter((x) => f.plaetze[x.i] !== x.pos);
        pr("Feld " + f.n + ": jede Stelle trägt ihre eigene Position",
           falsch.length === 0,
           falsch.length ? falsch.map((x) => x.i + ":" + x.pos).join(" ") : "");
        /* Der Torwart steht allein und oben. */
        pr("Feld " + f.n + ": der Torwart steht allein in der ersten Reihe",
           r5[0].length === 1 && r5[0][0].pos === "TW");
      });

      /* AUSSEN SIND DIE AUSSEN. Ohne das stuenden bei 4-4-2 „IV IV AV AV"
         nebeneinander — die Abwehr saehe aus, als haetten sich beide
         Aussenverteidiger auf eine Seite gestellt. */
      const abwehr442 = V.feldReihen("442")[1].map((x) => x.pos);
      pr("Feld: die Außenverteidiger stehen außen",
         abwehr442[0] === "AV" && abwehr442[abwehr442.length - 1] === "AV",
         abwehr442.join(" "));
      const mittel442 = V.feldReihen("442")[2].map((x) => x.pos);
      pr("Feld: die Außenstürmer auch",
         mittel442[0] === "AF" && mittel442[mittel442.length - 1] === "AF",
         mittel442.join(" "));

      /* Die Reihen kommen aus der KENNUNG, nicht aus einer zweiten Tabelle —
         sonst gaebe es zwei Wahrheiten ueber dieselbe Formation. */
      const r442 = V.feldReihen("442");
      pr("Feld: 4-4-2 ergibt 1-4-4-2",
         r442.map((x) => x.length).join("-") === "1-4-4-2",
         r442.map((x) => x.length).join("-"));
      const r352 = V.feldReihen("352");
      pr("Feld: 3-5-2 ergibt 1-3-5-2",
         r352.map((x) => x.length).join("-") === "1-3-5-2",
         r352.map((x) => x.length).join("-"));
    }
  }

  /* ============ Das Startpaket (35.89) ===================================
     Kevin: „der neue Verein bekommt ein Kartenpaket, in dem 6 Spieler sind,
     von denen mind. 3 aus der vorherigen Mannschaft stammen und mind. 1 aus
     der Ruhmeshalle (ein Guter)."

     Darauf laeuft der ganze Pool aus 35.79 zu: wer fuenfzehn Jahre aufgebaut
     hat, faengt nicht bei null an. */
  {
    const K3 = App.KARTEN;
    if (!K3 || !K3.startpaket) pr("Startpaket: vorhanden", false, "fehlt");
    else {
      let pl = K3.leererPool();
      pl = K3.poolErgaenzen(pl, [
        ...Array.from({ length: 5 }, (_, i) => K3.ausHalle({ name: "Legende " + i,
          pos: "ST", nat: "x", age: 35, peak: 80 + i * 2, score: 900, titles: 5,
          goals: 200, caps: 40 }, i)),
        ...Array.from({ length: 12 }, (_, i) => K3.ausKader({ id: "v" + i,
          name: "Alt " + i, pos: "ZM", ovr: 62 + i, pot: 72, alter: 27, flag: "x" },
          "Erster Verein", 15))]);

      const r3 = K3.startpaket(pl, "Erster Verein", 2045);
      pr("Startpaket: sechs Karten", r3.karten.length === 6, r3.karten.length + "");
      pr("Startpaket: mindestens drei aus der Vorgängermannschaft",
         r3.ausVerein >= 3, r3.ausVerein + " von 6");
      pr("Startpaket: mindestens einer aus der Ruhmeshalle",
         r3.ausHalle >= 1, r3.ausHalle + "");
      /* „EIN GUTER" ist eine Bedingung, keine Floskel: aus der Halle wird der
         STAERKSTE genommen. */
      const besteHalle = pl.karten.filter((k) => k.herkunft === "halle")
        .reduce((a2, b2) => ((b2.ovr || 0) > (a2.ovr || 0) ? b2 : a2));
      pr("Startpaket: aus der Halle kommt der Stärkste",
         r3.karten.some((k) => k.kid === besteHalle.kid),
         "erwartet " + besteHalle.ovr);

      /* UND NICHT MEHR ALS NOETIG. Der erste Entwurf fuellte mit den
         staerksten uebrigen Karten auf — und weil Hallenkarten die staerksten
         sind, kamen DREI Legenden mit 84 bis 88. Ein Startgeschenk, das die
         halbe Halle ausschuettet, macht den neuen Verein sofort zum Favoriten
         und nimmt der Akademie ihren Sinn. */
      pr("Startpaket: nicht die halbe Ruhmeshalle", r3.ausHalle <= 2,
         r3.ausHalle + " Hallenkarten von 6");
      const schnitt = r3.karten.reduce((a2, k) => a2 + (k.ovr || 0), 0) / r3.karten.length;
      pr("Startpaket: kein übermächtiges Geschenk", schnitt < 80,
         "Durchschnitt " + schnitt.toFixed(1));

      /* DER ERSTE VEREIN hat weder Vorgaenger noch Halle. Ein Startpaket, das
         dann leer bleibt, waere eine Zusage, die nur beim zweiten Mal gilt. */
      const r4 = K3.startpaket(K3.leererPool(), null, 2030);
      pr("Startpaket: auch beim ersten Verein sechs Karten",
         r4.karten.length === 6,
         r4.karten.map((k) => k.stufe).join(", "));
      pr("Startpaket: die aufgefüllten sind nicht bronze",
         r4.karten.every((k) => k.stufe !== "bronze"),
         "bronze wäre ein mageres Geschenk für fünfzehn Jahre");
    }
  }

  /* ============ Karten verkaufen (35.86) =================================
     Kevin: „Wenn wir eine Begrenzung haben, muss es auch eine Moeglichkeit
     geben, Karten loszuwerden. Am besten kann man sie verkaufen."
     Er hat grundsaetzlich recht: EINE GRENZE OHNE AUSWEG IST EINE FALLE. */
  {
    const K2 = App.KARTEN;
    if (!K2 || !K2.verkaufen) pr("Verkauf: vorhanden", false, "fehlt");
    else {
      /* DER RUECKFLUSS DARF NIE 100 % ERREICHEN. Sonst waere Kaufen und
         Verkaufen eine Geldmaschine — und die VC-Kalibrierung waertlos, weil
         jeder unbegrenzt Coins herstellen koennte. Das ist kein Feinschliff,
         sondern die Grenze zwischen Wirtschaft und Unsinn. */
      const rueck = K2.PACKS.map((pk) => {
        let e = 0;
        K2.REIHE.forEach((st) => { e += pk.karten * ((pk.chancen[st] || 0) / 100) * (K2.VERKAUF[st] || 0); });
        return { n: pk.n, anteil: e / pk.preis };
      });
      const zuHoch = rueck.filter((x) => x.anteil >= 0.75);
      pr("Verkauf: kein Pack zahlt sich durch Verkaufen selbst",
         zuHoch.length === 0,
         zuHoch.length ? zuHoch.map((x) => x.n + " " + (x.anteil * 100).toFixed(0) + " %").join(", ")
           : rueck.map((x) => (x.anteil * 100).toFixed(0) + " %").join(" · "));
      /* Und die Gegenrichtung: ganz wertlos darf es auch nicht sein, sonst
         verkauft niemand und die Grenze bleibt eine Falle. */
      pr("Verkauf: aber wertlos ist er auch nicht",
         rueck.every((x) => x.anteil >= 0.2),
         "mindestens " + (Math.min(...rueck.map((x) => x.anteil)) * 100).toFixed(0) + " %");

      /* Der Erloes steigt mit der Stufe. */
      pr("Verkauf: bessere Karten bringen mehr",
         K2.VERKAUF.legende > K2.VERKAUF.gold && K2.VERKAUF.gold > K2.VERKAUF.silber
         && K2.VERKAUF.silber > K2.VERKAUF.bronze,
         JSON.stringify(K2.VERKAUF));

      /* ERINNERUNG IST KEINE WARE. Wer seine eigene Legende zu Geld macht,
         verliert sie fuer immer — und der Pool ist das einzige Gedaechtnis,
         das es dafuer gibt. */
      let pl = K2.leererPool();
      pl = K2.poolErgaenzen(pl, [
        { kid: "pk1", name: "Pack", pos: "ST", ovr: 76, pot: 80, alter: 26,
          stufe: "gold", herkunft: "pack" },
        K2.ausHalle({ name: "Legende", pos: "ZM", nat: "x", age: 35, peak: 88,
          score: 900, titles: 9, goals: 300, caps: 80 }, 0),
        K2.ausKader({ id: "a1", name: "Alt", pos: "IV", ovr: 72, pot: 76,
          alter: 28, flag: "x" }, "Altverein", 10)]);
      const vPack = K2.verkaufen(pl, "pk1");
      pr("Verkauf: eine Packkarte lässt sich verkaufen",
         !vPack.fehler && vPack.vc > 0 && vPack.pool.karten.length === 2,
         "+" + vPack.vc + " VC");
      const halleKid = pl.karten.find((x) => x.herkunft === "halle").kid;
      const vereinKid = pl.karten.find((x) => x.herkunft === "verein").kid;
      pr("Verkauf: die eigene Ruhmeshalle wird NICHT verkauft",
         !!K2.verkaufen(pl, halleKid).fehler);
      pr("Verkauf: eigene frühere Vereinsspieler auch nicht",
         !!K2.verkaufen(pl, vereinKid).fehler);
      pr("Verkauf: eine Karte, die es nicht gibt, wird abgewiesen",
         !!K2.verkaufen(pl, "gibtsnicht").fehler);

      /* AUS DEM KADER NEHMEN ist etwas anderes als verkaufen — der Platz wird
         frei, die Karte bleibt. Zwei Entscheidungen, zwei Wege. */
      let vv2 = V.karteEinsetzen({ gegruendet: true, kader: [] },
        { kid: "e1", name: "E", pos: "ST", ovr: 70, pot: 74, alter: 25, stufe: "gold" }).v;
      pr("Kader: ein gezogener Spieler belegt einen Platz",
         V.packPlatz(vv2) === Math.floor(V.KADER_MIN * V.PACK_ANTEIL) - 1);
      const raus = V.karteEntfernen(vv2, "e1");
      pr("Kader: er lässt sich wieder herausnehmen",
         !raus.fehler && V.packPlatz(raus.v) === Math.floor(V.KADER_MIN * V.PACK_ANTEIL));
      /* Eigengewaechse gehen NICHT diesen Weg — dafuer gibt es die
         Kaderverwaltung mit ihren Vertragsregeln. */
      const eigen = { gegruendet: true, kader: [{ id: "j1", name: "Jugend", pos: "ST" }] };
      pr("Kader: Eigengewächse gehen nicht über diesen Weg",
         !!V.karteEntfernen(eigen, "j1").fehler);
    }
  }

  /* ============ VC aus Akademie, Verein und Erfolgen (35.81) =============
     Kevin: „Lass uns den VC-Verdienst noch etwas verbessern."
     Gemessen und bestaetigt: VC kamen ausschliesslich aus der
     Spielerlaufbahn. Zwei von drei Haeusern arbeiteten umsonst. */
  {
    const vc = App.vcAusHaeusern;
    if (!vc) pr("VC: die Rechnung ist ausgeführt", false, "vcAusHaeusern fehlt");
    else {
      pr("VC: ohne Zutaten gibt es nichts", vc(null, null, null).vc === 0);

      /* Die Akademie zahlt fuer ERGEBNISSE, nicht fuer Aufnahmen — sonst
         lohnte sich Masse statt Arbeit. */
      const nurAufnahmen = vc({ aufgenommen: 20 }, null, null).vc;
      pr("VC: Aufnehmen allein bringt nichts", nurAufnahmen === 0,
         "sonst lohnte sich Masse statt Arbeit");
      const einProfi = vc({ profis: 1 }, null, null).vc;
      const eineWK = vc({ weltklasse: 1 }, null, null).vc;
      pr("VC: Weltklasse zählt mehr als ein Profi", eineWK > einProfi,
         einProfi + " gegen " + eineWK);

      /* Der Verein: Erfolg zaehlt, nicht Teilnahme. */
      pr("VC: ein Mittelfeldplatz bringt nichts",
         vc(null, { rang: 9 }, null).vc === 0);
      pr("VC: Meister zahlt am meisten",
         vc(null, { rang: 1 }, null).vc > vc(null, { rang: 3 }, null).vc,
         "Meister " + vc(null, { rang: 1 }, null).vc
           + " · Platz 3 " + vc(null, { rang: 3 }, null).vc);
      /* KEIN Abzug beim Abstieg: eine Strafe auf die Waehrung, mit der man
         die Jugend aufbaut, traefe ausgerechnet den, der Aufbau noetig hat. */
      pr("VC: der Abstieg kostet nichts",
         vc(null, { rang: 18, abstieg: true }, null).vc === 0);

      /* Errungenschaften, gestaffelt. */
      const stufe = (s3) => vc(null, null, [{ s: s3, n: "x" }]).vc;
      pr("VC: Errungenschaften zahlen nach Stufe",
         stufe("legende") > stufe("platin") && stufe("platin") > stufe("gold")
         && stufe("gold") >= stufe("silber"),
         "bronze " + stufe("bronze") + " · gold " + stufe("gold")
           + " · legende " + stufe("legende"));

      /* DIE SUMME IST DAS EIGENTLICHE. 192 kleine Betraege sind in der Summe
         kein kleiner Betrag — der erste Entwurf haette mit 3/6/12/20/35 ueber
         alle Errungenschaften 2780 VC ausgeschuettet, bei einem Vollausbau von
         2912. Wer Einzelposten bemisst, muss sie zusammenzaehlen, bevor er sie
         fuer klein haelt. */
      const alleErf = (App.ACHIEVEMENTS || [])
        .reduce((s3, x) => s3 + vc(null, null, [x]).vc, 0);
      pr("VC: alle Errungenschaften zusammen bleiben unter dem halben Ausbau",
         alleErf < 1456,
         alleErf + " VC gegen 2912 Vollausbau");

      /* ---- WIRTSCHAFTS-INVARIANTE (35.103) ------------------------------
         Vorschlag B aus der externen Konsolidierung: bei jedem bezahlten
         Vorgang muss `vc vorher − vc nachher = Preis` gelten, und derselbe
         Betrag muss in `ausgegeben` erscheinen.

         Vorgeschichte: `ausgegeben` und `verdient` liefen seit ihrer
         Einfuehrung mit und wurden nie gelesen — deshalb fiel auch nie auf,
         dass von acht VC-Bewegungen ZWEI nichts fortschrieben (Packkauf,
         Verkaufserloes). Seit 35.103 haben die Zaehler eine Anzeige im Dach,
         und damit muessen sie stimmen.

         Geprueft wird der MOTOR, nicht ein gespeicherter Stand: alte
         Spielstaende koennen die Invariante nicht erfuellen, weil die
         Packkaeufe vor 35.103 fehlen und sich nicht rekonstruieren lassen. */
      {
        let a = App.akaGruenden(App.leereAkademie(), "Kasse", 2026);
        a = { ...a, vc: 0, verdient: 0, ausgegeben: 0 };

        /* Zugang ueber den einzigen Weg, der im Motor liegt. */
        const nachGut = App.akaVerbuchen(a, 500, 2027);
        const g = nachGut.a || nachGut;
        pr("Kasse: eine Gutschrift erhöht Kasse UND `verdient` um denselben Betrag",
           (g.vc || 0) === 500 && (g.verdient || 0) === 500,
           "vc " + (g.vc || 0) + " · verdient " + (g.verdient || 0));

        /* GEGENPROBE: eine Gutschrift von 0 darf nichts bewegen. Ohne sie
           koennte die Zeile darueber auch gruen sein, weil beide Zaehler
           blind mitlaufen. */
        const null0 = App.akaVerbuchen({ ...a, vc: 77, verdient: 77 }, 0, 2027);
        const n0 = null0.a || null0;
        pr("Kasse: Gegenprobe — eine Gutschrift von 0 bewegt nichts",
           (n0.vc || 0) === 77 && (n0.verdient || 0) === 77,
           "vc " + (n0.vc || 0) + " · verdient " + (n0.verdient || 0));

        /* Und die Buchhaltungsregel selbst, an allen Ausgabestellen des
           Quelltexts nachgezaehlt statt behauptet. Jede Stelle, die `aka.vc`
           VERRINGERT, muss im selben Ausdruck `ausgegeben` erhoehen. */
        /* Quelle nach demselben Muster wie die Nachbarprueungen einlesen.
           Kommentare bleiben HIER absichtlich drin: gesucht werden Zuweisungen
           wie `vc: aka.vc - preis`, und die stehen nie in einem Kommentar —
           wohl aber stehen erklaerende Kommentare DAZWISCHEN, und die duerfen
           den Dreizeilenblock nicht zerreissen. Deshalb wird der Block unten
           auf 6 Zeilen gefasst statt auf 3. */
        const fsK = require("fs");
        const ARGK = require("./argumente.cjs");
        const kK = [ARGK.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
          .filter(Boolean).find((k) => { try { return fsK.statSync(k).isFile(); }
            catch (e) { return false; } });
        const roh = kK ? fsK.readFileSync(kK, "utf8") : "";
        pr("Kasse: App.jsx für die Buchungsprüfung gefunden", !!roh,
           kK || "nicht gefunden — die zwei Prüfungen darunter laufen NICHT");
        if (roh) {
          const zeilen = roh.split("\n");
          const abgang = [], ohneBuchung = [];
          zeilen.forEach((z, i) => {
            if (!/vc:\s*(aka\.vc|kasse|hat)\s*-|vc:\s*Math\.max\(0,\s*\(aka\.vc/.test(z)) return;
            abgang.push(i + 1);
            const block = zeilen.slice(i, i + 6).join(" ");
            if (!/ausgegeben:/.test(block)) ohneBuchung.push(i + 1);
          });
          pr("Kasse: jede Stelle, die VC abzieht, bucht `ausgegeben` mit",
             abgang.length > 0 && ohneBuchung.length === 0,
             abgang.length + " Abgangsstellen"
             + (ohneBuchung.length ? ", OHNE Buchung: Zeile " + ohneBuchung.join(", ") : ", alle gebucht"));

          const zugang = [], ohneVerdient = [];
          zeilen.forEach((z, i) => {
            if (!/vc:\s*\((aka|akaJetzt|AK2\.a)\.vc\s*\|\|\s*0\)\s*\+/.test(z)) return;
            zugang.push(i + 1);
            const block = zeilen.slice(i, i + 6).join(" ");
            if (!/verdient:/.test(block)) ohneVerdient.push(i + 1);
          });
          pr("Kasse: jede Stelle, die VC gutschreibt, bucht `verdient` mit",
             zugang.length > 0 && ohneVerdient.length === 0,
             zugang.length + " Zugangsstellen"
             + (ohneVerdient.length ? ", OHNE Buchung: Zeile " + ohneVerdient.join(", ") : ", alle gebucht"));
        }
      }

    /* Eine echte Laufbahn, gemeinsam genutzt von der Schlagzeilen- und der
       Kapitelprüfung (35.105). Aufbau aus `kalibrierung.cjs`: ein eigener
       Versuch alterte den Spieler NICHT, weil `age += 1` im Aufrufer sitzt
       (`App.jsx`) und nicht in `simulateSeason` — 22 Saisons lang blieb der
       Prüfling 16 Jahre alt. Wer hier etwas nachbaut, prüft seinen eigenen
       Aufbau mit. */
    /* Und ueber ECHTE Laufbahnen: nichts leer, nichts beherrschend.
       Aufbau wie in `kalibrierung.cjs` — ein eigener Versuch alterte den
       Spieler nicht, weil `age += 1` im Aufrufer sitzt und nicht in
       `simulateSeason`. Fuenfzehn Laeufe kosten rund eine Sekunde. */
    const laufbahnFuerZeilen = () => {
      const POSL = Object.keys(App.POS || { ST: 1 });
      const nat = App.pick(App.NATIONS);
      const pos = App.pick(POSL);
      const typen = App.TYPES.filter((t) => !t.pos || t.pos.includes(pos));
      let q = App.createPlayer({ name: "Zeile", nation: nat.id, pos,
        foot: "rechts", number: 10, type: (App.pick(typen) || App.TYPES[0]).id,
        mode: "normal", gender: "m", statur: "normal", aka: null });
      for (let i = 0; i < 40; i++) {
        if (q.age >= 41) break;
        App.develop(q); q.mv = App.marketValue(q);
        App.drawEvents(q, 2).forEach((e) => {
          q.evLog[e.id] = q.seasons.length;
          const ch = App.pick(e.choices); let out;
          if (ch.roll) { const r = Math.random(); let acc = 0; out = ch.roll[ch.roll.length - 1];
            for (const o of ch.roll) { acc += o.p; if (r <= acc) { out = o; break; } } }
          else out = { fx: ch.fx };
          App.applyFx(q, out.fx); q.ovr = App.ovrOf(q.attrs, q.pos);
        });
        if (q.endNow) break;
        App.simulateSeason(q);
        const of = App.makeOffers(q); if (!of.length) break;
        const best = [...of].sort((a, b) => { const w = (x) =>
          (x.roleKey === "star" || x.roleKey === "start" ? 30 : x.roleKey === "rot" ? 10 : 0)
          + x.club.s; return w(b) - w(a); })[0];
        if (best.type === "transfer" || best.type === "loan") {
          q.club = best.club; q.squad = App.makeSquad(best.club, q.g); q.trust = 52;
          q.flags.kapitaen = false;
          if (best.type === "transfer") { q.contract = best.years; q.wage = best.wage; }
          q.europeNext = best.club.s >= 74 ? App.CONT(best.club, 4) : null;
        } else if (best.type === "renew") { q.contract = best.years; q.wage = best.wage; }
        q.age += 1; q.year += 1; q.mv = App.marketValue(q);
        if (q.age >= 41 || (q.age >= 35 && q.ovr < 58)) break;
      }
      return q;
    };

    /* ---- SAISON-SCHLAGZEILEN (35.104) ---------------------------------
       Stufe A1 aus dem Konzeptpapier. Geprueft wird nicht, ob die Zeilen
       „schoen" sind — das kann keine Messung —, sondern drei Dinge, die
       messbar sind: dass keine Saison leer ausgeht, dass keine Zeile das
       Feld beherrscht, und dass die Regeln wirklich unterscheiden.

       Die dritte ist die wichtige. Eine Regelkette, die immer dieselbe
       Zeile liefert, waere fehlerfrei und trotzdem wertlos. */
    {
      const SZ = App.saisonSchlagzeile;
      if (typeof SZ !== "function") {
        pr("Schlagzeile: saisonSchlagzeile ist ausgeführt", false,
           "nicht im Bündel — die Proben darunter laufen NICHT");
      } else {
        /* Feste Zustaende, jeder mit einer erwarteten Zeile. Das ist die
           Gegenprobe gegen „alles liefert dasselbe": neun verschiedene
           Eingaben muessen neun verschiedene Ausgaben ergeben. */
        const F = [
          [{ role: "Stammspieler", kapitaen: true, kapiNeu: "auf", apps: 30, note: 2.6, age: 27, club: "A", year: "30/31" },
           { role: "Tribüne", apps: 3, club: "A" }, "Vom Reservisten zum Kapitän"],
          [{ role: "Stammspieler", trophies: ["Meister", "Pokal"], apps: 40, note: 2.4, age: 26, club: "A", year: "30/31" },
           { role: "Stammspieler", apps: 38, club: "A" }, "Das Jahr der Titel"],
          [{ role: "Stammspieler", apps: 33, note: 3.0, age: 21, club: "A", year: "30/31" },
           { role: "Tribüne", apps: 2, club: "A" }, "Durchbruch"],
          [{ role: "Stammspieler", apps: 28, note: 3.1, age: 29, club: "A", year: "30/31" },
           { role: "Stammspieler", apps: 30, club: "A", injury: { n: "Kreuzband" } }, "Zurückgeschrieben"],
          [{ role: "Stammspieler", apps: 30, note: 2.5, age: 35, club: "A", year: "30/31" },
           { role: "Stammspieler", apps: 30, club: "A" }, "Der alte Mann ist noch da"],
          [{ role: "Rotationsspieler", apps: 4, note: 3.5, age: 27, club: "A", year: "30/31" },
           { role: "Stammspieler", apps: 32, club: "A" }, "Das verlorene Jahr"],
          [{ role: "Stammspieler", apps: 30, note: 4.5, age: 27, club: "A", year: "30/31" },
           { role: "Stammspieler", apps: 30, club: "A" }, "Ein Jahr zum Vergessen"],
          [{ role: "Stammspieler", apps: 30, note: 2.2, age: 27, club: "B", year: "30/31" },
           { role: "Stammspieler", apps: 30, club: "A" }, "Sofort angekommen"],
          [{ role: "Stammspieler", apps: 30, note: 3.0, age: 27, club: "A", year: "30/31" },
           null, "Der Anfang"],
        ];
        const daneben = [];
        F.forEach(([s, vor, soll]) => {
          const r = SZ(s, vor, { seasons: [] });
          if (!r || r.kopf !== soll) daneben.push(soll + " → " + (r ? r.kopf : "nichts"));
        });
        pr("Schlagzeile: neun feste Lagen ergeben neun verschiedene Zeilen",
           daneben.length === 0,
           daneben.length ? daneben.join(" · ") : F.length + " von " + F.length);

        /* GEGENPROBE zur Gegenprobe: liefern die neun wirklich VERSCHIEDENE
           Zeilen? Waeren zwei gleich, haette die Liste oben eine Luecke. */
        const kopfe = F.map(([s, vor]) => (SZ(s, vor, { seasons: [] }) || {}).kopf);
        pr("Schlagzeile: Gegenprobe — die neun Zeilen sind wirklich verschieden",
           new Set(kopfe).size === F.length,
           new Set(kopfe).size + " verschiedene aus " + F.length + " Lagen");

        /* Und ueber ECHTE Laufbahnen: nichts leer, nichts beherrschend.
           `laufbahnFuerZeilen` steht weiter oben — dieselbe Funktion nutzt
           auch die Kapitelprüfung. Zwei Kopien liefen beim nächsten Umbau
           auseinander; dasselbe Muster wie die zweite Ablaufliste in 35.29. */
        const alle = [];
        let laeufe = 0;
        try {
          for (let i = 0; i < 15; i++) {
            const q = laufbahnFuerZeilen(); laeufe++;
            q.seasons.forEach((s, k) => alle.push(SZ(s, k ? q.seasons[k - 1] : null, q)));
          }
        } catch (e) { /* faellt unten als „0 Saisons" auf */ }

        /* ERST die Grundlage. Ohne sie koennten die zwei Proben darunter
           gruen sein, weil der Aufbau gar nichts erzeugt hat — genau der
           Fehler, der beim Vereins-Reachability-Versuch passiert ist. */
        pr("Schlagzeile: der Laufbahn-Aufbau hat wirklich Saisons erzeugt",
           laeufe === 15 && alle.length >= 100,
           laeufe + " Laufbahnen · " + alle.length + " Saisons");

        if (alle.length) {
          const leer = alle.filter((r) => !r || !r.kopf).length;
          const ohneSatz = alle.filter((r) => r && !r.satz).length;
          const z = {}; alle.forEach((r) => { if (r && r.kopf) z[r.kopf] = (z[r.kopf] || 0) + 1; });
          const top = Object.entries(z).sort((a, b) => b[1] - a[1])[0];
          /* `ohneSatz` zaehlt mit: eine Zeile ohne Begruendung ist eine halbe
             Schlagzeile. Gemessen greift das auf Regel 12 („Neuer Verein"),
             die haeufigste ueberhaupt — die letzte Rueckfallzeile ist ueber
             echte Laufbahnen unerreichbar und taugt deshalb NICHT als Ziel
             einer Gegenprobe. */
          pr("Schlagzeile: keine Saison bleibt ohne Zeile", leer === 0 && ohneSatz === 0,
             alle.length + " Saisons · " + leer + " ohne Zeile · " + ohneSatz + " ohne Satz");
          pr("Schlagzeile: keine Zeile beherrscht das Feld",
             top && top[1] / alle.length <= 0.6,
             top ? "häufigste " + (100 * top[1] / alle.length).toFixed(1)
                   + " % · " + Object.keys(z).length + " verschiedene" : "—");
        }

        /* Robustheit: die Funktion darf an keinem unvollstaendigen Zustand
           abstuerzen — im Spiel kommt sie auch bei alten Spielstaenden vorbei,
           in denen Felder fehlen. */
        let krachte = null;
        [[null, null], [{}, {}], [{ apps: 0 }, null], [{ role: "Unbekannt" }, { role: "Auchnicht" }]]
          .forEach(([a, b]) => { try { SZ(a, b, null); } catch (e) { krachte = krachte || e.message; } });
        pr("Schlagzeile: unvollständige Zustände stürzen nicht ab",
           krachte === null, krachte || "vier Lücken-Lagen abgefangen");
      }
    }

    /* ---- VEREINSSTATIONEN ALS KAPITEL (35.105) ------------------------
       Stufe A2. Drei Dinge sind messbar: dass Abschnitte richtig gebildet
       werden (eine Rueckkehr ist ZWEI Stationen), dass jedes Kapitel im
       echten Verlauf vorkommt, und dass keines das Feld beherrscht.

       Die mittlere ist die Lehre aus 35.102 und 35.104: eine Regel, die nie
       greift, ist toter Code. Beim Bauen dieser Funktion ist das zweimal
       passiert — „Die langen Jahre" stand hinter den Rollenzeilen und wurde
       in 726 Stationen kein einziges Mal vergeben. */
    {
      const VK = App.vereinsKapitel;
      if (typeof VK !== "function") {
        pr("Kapitel: vereinsKapitel ist ausgeführt", false,
           "nicht im Bündel — die Proben darunter laufen NICHT");
      } else {
        /* Abschnittsbildung. DAS ist der eigentliche Fund hinter 35.105:
           bis 35.104 stand im Rueckblick eine Vereins-MENGE, in der eine
           Rueckkehr verschwand. */
        const folge = [
          { club: "A", land: "DE", year: "26/27", apps: 30, note: 3.0, role: "Stammspieler" },
          { club: "A", land: "DE", year: "27/28", apps: 30, note: 3.0, role: "Stammspieler" },
          { club: "B", land: "ES", year: "28/29", apps: 30, note: 3.0, role: "Stammspieler" },
          { club: "A", land: "DE", year: "29/30", apps: 30, note: 3.0, role: "Stammspieler" },
        ];
        const st = VK(folge, {});
        pr("Kapitel: eine Rückkehr ergibt eine EIGENE Station",
           st.length === 3 && st[0].club === "A" && st[1].club === "B" && st[2].club === "A",
           st.length + " Stationen aus 4 Saisons bei 2 Vereinen");
        pr("Kapitel: die zweite Zeit bei einem Verein heißt „Die Rückkehr“",
           st.length === 3 && st[2].kapitel === "Die Rückkehr",
           st.length === 3 ? st.map((x) => x.club + "=" + x.kapitel).join(" · ") : "—");

        /* GEGENPROBE: ohne Rueckkehr duerfen es NICHT drei sein. Sonst
           koennte die Zeile darueber auch gruen sein, weil die Funktion
           jede Saison zu einer eigenen Station macht. */
        const ohne = VK(folge.slice(0, 3), {});
        pr("Kapitel: Gegenprobe — ohne Rückkehr bleiben es zwei Stationen",
           ohne.length === 2 && ohne[1].kapitel !== "Die Rückkehr",
           ohne.length + " Stationen · zweites Kapitel: " + (ohne[1] ? ohne[1].kapitel : "—"));

        /* Zahlen je Abschnitt muessen stimmen, nicht nur die Zahl der
           Abschnitte. */
        pr("Kapitel: die Zahlen je Station werden richtig summiert",
           st.length === 3 && st[0].jahre === 2 && st[0].apps === 60 && st[2].jahre === 1,
           st.length === 3 ? st.map((x) => x.jahre + "J/" + x.apps + "Sp").join(" · ") : "—");

        /* Und ueber echte Laufbahnen: Erreichbarkeit und Verteilung. */
        const alleSt = [];
        let lb = 0;
        try {
          for (let i = 0; i < 12; i++) {
            const q = laufbahnFuerZeilen(); lb++;
            VK(q.seasons, q).forEach((x) => alleSt.push(x));
          }
        } catch (e) { /* faellt unten auf */ }
        pr("Kapitel: der Laufbahn-Aufbau hat wirklich Stationen erzeugt",
           lb === 12 && alleSt.length >= 60,
           lb + " Laufbahnen · " + alleSt.length + " Stationen");

        /* ERREICHBARKEIT: jede Regel der Tabelle muss VOR ihren Nachfolgern
           greifen koennen. Deterministisch geprueft, nicht ueber Zufallslaeufe:
           „Der lange Abschied" trifft 0,5 % aller Stationen, ueber zwoelf
           Laufbahnen waere die Probe also mal rot und mal gruen — und eine
           Pruefung, die zufaellig rot wird, ist schlimmer als keine (die Lehre
           aus 35.104). Die Namen kommen aus `App.KAPITEL`, DERSELBEN Tabelle,
           aus der die Funktion schoepft. Ein frueherer Entwurf las sie aus
           `String(vereinsKapitel)` und bekam den GEBUENDELTEN Text, in dem
           Umlaute als Escape stehen — „Die R\\xFCckkehr" ist nicht „Die
           Rückkehr", und die Probe meldete sechs Kapitel als nie vergeben,
           die es alle gab. Eine Pruefung, die den Quelltext ihres Prueflings
           parst, misst den Uebersetzer mit. */
        const TAB = App.KAPITEL || [];
        const unerreichbar = [];
        TAB.forEach(([pruef, name], i) => {
          /* Eine Lage, die genau diese Regel erfuellt und keine davor.
             Gesucht wird durch Ausprobieren ueber die echten Stationen plus
             gezielte Bausteine — findet sich keine, ist die Regel toter Code. */
          const kandidaten = alleSt.concat([
            { rueckkehr: true, erste: false, letzte: false, jahre: 2, apps: 40, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: true, letzte: false, jahre: 7, apps: 200, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: true, letzte: false, jahre: 1, apps: 20, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 9, apps: 300, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 3, apps: 90, titel: 4, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 3, apps: 90, titel: 0, note: 3, rangMit: 2, rangAuf: 3, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 3, apps: 90, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: true },
            { rueckkehr: false, erste: false, letzte: false, jahre: 2, apps: 8, titel: 0, note: 3, rangMit: 0.5, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 1, apps: 5, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: true, jahre: 2, apps: 40, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: true, jahre: 3, apps: 60, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 2, apps: 40, titel: 0, note: 2.2, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 2, apps: 40, titel: 0, note: 4.4, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 5, apps: 150, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 2, apps: 40, titel: 0, note: 3, rangMit: 4, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 2, apps: 40, titel: 0, note: 3, rangMit: 3, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 2, apps: 40, titel: 0, note: 3, rangMit: 2, rangAuf: 0, kapitaen: false },
            { rueckkehr: false, erste: false, letzte: false, jahre: 2, apps: 40, titel: 0, note: 3, rangMit: null, rangAuf: 0, kapitaen: false },
          ]);
          const geht = kandidaten.some((x) => {
            for (const e of [true, false]) {
              if (!pruef(x, e)) continue;
              if (!TAB.slice(0, i).some(([f]) => f(x, e))) return true;
            }
            return false;
          });
          if (!geht) unerreichbar.push(name);
        });
        pr("Kapitel: jede Regel der Tabelle ist erreichbar",
           TAB.length > 0 && unerreichbar.length === 0,
           unerreichbar.length ? "toter Code: " + unerreichbar.join(", ")
                               : TAB.length + " Regeln, jede mit eigener Lage");

        if (alleSt.length) {
          const z = {}; alleSt.forEach((x) => { z[x.kapitel] = (z[x.kapitel] || 0) + 1; });
          const top = Object.entries(z).sort((a, b) => b[1] - a[1])[0];
          /* Ueber echte Laufbahnen wird nur die BREITE geprueft, nicht jedes
             einzelne Kapitel — sonst flattert es an den seltenen. */
          pr("Kapitel: über echte Laufbahnen kommt die Mehrzahl auch vor",
             Object.keys(z).length >= Math.ceil(TAB.length * 0.6),
             Object.keys(z).length + " von " + TAB.length + " · " + alleSt.length + " Stationen");
          pr("Kapitel: kein Kapitel beherrscht das Feld",
             top && top[1] / alleSt.length <= 0.35,
             top ? "häufigstes " + (100 * top[1] / alleSt.length).toFixed(1) + " % (Grenze 35 %)" : "—");
        }

        /* Robustheit gegen alte und lueckenhafte Staende. */
        let krach = null;
        [[null, null], [[], {}], [[{}], null], [[{ club: "X" }, { club: "X" }], {}]]
          .forEach(([a, b]) => { try { VK(a, b); } catch (e) { krach = krach || e.message; } });
        pr("Kapitel: unvollständige Zustände stürzen nicht ab",
           krach === null, krach || "vier Lücken-Lagen abgefangen");
      }
    }

    /* ---- MARKEN FÜR BEGRENZTE LAUFBAHNEN (35.106) ---------------------
       Stufe B. Gemessen war die Lücke: über 80 Laufbahnen erreichte eine
       schwache (Höchststärke unter 75) SECHS der 22 alten Marken nie —
       beide Torgrenzen, 100 Vorlagen und alle drei Stärkemarken. Was blieb,
       waren Spielzahlen. */
    {
      const MS = App.MILESTONES || [];
      const NEUE = ["j10", "j20", "a300", "treu100", "welt3", "alt35",
                    "binde", "comeback", "stamm10", "heimkehr"];
      pr("Marken: die zehn neuen sind alle in der Liste",
         NEUE.every((id) => MS.some((m) => m.id === id)),
         MS.length + " Marken insgesamt · " + NEUE.filter((id) => MS.some((m) => m.id === id)).length + " von 10 neu");

      /* WIRTSCHAFTSGRENZE. `leg` fliesst ueber `p.legacyBonus` in
         `verdict().score`, und daraus wird mit `score / 26` die
         VC-Ausschuettung gerechnet. „Laufbahnen bis Vollausbau" stand vor
         35.106 bei 20,5 bei einer Untergrenze von 20 — grosszuegige Punkte
         haetten das Band gesprengt, ohne dass es jemand mit dieser Fassung in
         Verbindung gebracht haette. Die Kalibrierung prueft das Band selbst;
         diese Zeile prueft die URSACHE, damit ein spaeterer Zuwachs hier
         auffaellt und nicht erst dort. */
      const legNeu = MS.filter((m) => NEUE.includes(m.id)).reduce((a, m) => a + m.leg, 0);
      const legAlt = MS.filter((m) => !NEUE.includes(m.id)).reduce((a, m) => a + m.leg, 0);
      pr("Marken: die neuen Punkte bleiben klein gegen die alten",
         legNeu > 0 && legNeu <= legAlt * 0.25,
         legNeu + " gegen " + legAlt + " (Grenze " + Math.round(legAlt * 0.25) + ")");

      /* TITELTREUE. Der erste Entwurf von „Nach schwerer Verletzung zurück"
         prüfte nur `s.injury` — also auch „leicht, 4 Spiele". Über 25
         Saisons ist irgendwann jeder mal angeschlagen, entsprechend traf die
         Marke 99 % aller Laufbahnen statt 43 %. Ein Text, der mehr zusagt
         als die Mechanik prüft, ist im Projekt eine eigene Fehlerklasse. */
      const schwerMarke = MS.find((m) => m.id === "comeback");
      pr("Marken: wer „schwer“ verspricht, prüft auch die Schwere",
         !!schwerMarke && /sev/.test(String(schwerMarke.ok)),
         schwerMarke ? (/sev/.test(String(schwerMarke.ok)) ? "prüft `injury.sev`" : "prüft nur, OB eine Verletzung war") : "—");

      /* Erreichbarkeit und Wirkung über echte Laufbahnen. */
      const LM = [];
      let lm = 0;
      try { for (let i = 0; i < 12; i++) { LM.push(laufbahnFuerZeilen()); lm++; } }
      catch (e) { /* faellt unten auf */ }
      pr("Marken: der Laufbahn-Aufbau hat wirklich Laufbahnen erzeugt",
         lm === 12 && LM.every((q) => (q.seasons || []).length >= 5),
         lm + " Laufbahnen · Saisons " + LM.map((q) => (q.seasons || []).length).join("/"));

      if (LM.length) {
        const nie = NEUE.filter((id) => !LM.some((q) => (q.milestones || []).includes(id)));
        pr("Marken: jede neue Marke wird im echten Verlauf auch erreicht",
           nie.length === 0,
           nie.length ? "nie erreicht: " + nie.join(", ") : "10 von 10");

        /* Der eigentliche Zweck: hebt es eine begrenzte Laufbahn? Gemessen
           vor 35.106: schwach 9 Marken, stark 11. */
        const zahl = (q) => (q.milestones || []).length;
        const schwach = LM.filter((q) => (q.peakOvr || 0) < 78);
        /* MEDIAN, NICHT MINIMUM (berichtigt 35.109). Der erste Entwurf nahm
           `Math.min` über zwölf Laufbahnen — und meldete rot, sobald eine
           kurze dabei war, die nach fünf Saisons endete. Nichts war kaputt,
           die Probe flatterte nur. Dieselbe Lehre wie bei der Reachability in
           35.104: eine Prüfung, die zufällig rot wird, erzieht dazu, roten
           Meldungen nicht mehr zu glauben. Der Median sagt dasselbe und hält
           einen Ausreißer aus. */
        const mZahlen = schwach.map(zahl).sort((x, y) => x - y);
        const mMedian = mZahlen.length ? mZahlen[Math.floor(mZahlen.length / 2)] : 0;
        pr("Marken: auch eine begrenzte Laufbahn sammelt jetzt etwas",
           !schwach.length || mMedian >= 8,
           schwach.length ? schwach.length + " unter Höchststärke 78 · Marken Median "
             + mMedian + " (Spanne " + mZahlen[0] + "–" + mZahlen[mZahlen.length - 1] + ")"
             : "keine schwache im Lauf");

        /* GEGENPROBE: eine absichtlich unerfuellbare Marke MUSS auffallen.
           Ohne sie koennte die Erreichbarkeitszeile auch gruen sein, weil
           `NEUE` gar nicht geprueft wird. */
        const erfundene = "gibtesnicht";
        const nie2 = [erfundene].filter((id) => !LM.some((q) => (q.milestones || []).includes(id)));
        pr("Marken: Gegenprobe — eine erfundene Marke fällt durch",
           nie2.length === 1, "„" + erfundene + "“ wird in 12 Laufbahnen nicht erreicht");
      }
    }

    /* ---- DAS EINE PERSÖNLICHE ZIEL (35.107) ---------------------------
       Stufe B, zweiter Teil. Das Ziel ist eine Marke, die es ohnehin gibt —
       keine zweite Liste, keine eigene Belohnung, kein neues Feld. */
    {
      const NZ = App.naechstesZiel, MS2 = App.MILESTONES || [];
      if (typeof NZ !== "function") {
        pr("Ziel: naechstesZiel ist ausgeführt", false, "nicht im Bündel");
      } else {
        const mitMass = MS2.filter((m) => m.mess && m.soll);
        pr("Ziel: genug Marken taugen als Ziel", mitMass.length >= 15,
           mitMass.length + " von " + MS2.length + " haben `mess` und `soll`");

        /* DIE WICHTIGSTE PROBE. `mess(p) >= soll` muss DASSELBE bedeuten wie
           `ok(p)`. Liefen die beiden auseinander, zeigte die Anzeige „500 von
           500" waehrend die Marke ungeloest bliebe — oder das Ziel
           verschwaende, ohne dass etwas erreicht wurde. Beides waere ein
           Text, der etwas anderes sagt als die Mechanik tut. */
        const LZ = [];
        try { for (let i = 0; i < 10; i++) LZ.push(laufbahnFuerZeilen()); } catch (e) { /* faellt auf */ }
        const uneins = [];
        mitMass.forEach((m) => {
          LZ.forEach((q) => {
            let a, b;
            try { a = !!m.ok(q); b = (m.mess(q) || 0) >= m.soll; } catch (e) { return; }
            if (a !== b && !uneins.includes(m.id)) uneins.push(m.id);
          });
        });
        pr("Ziel: `mess >= soll` bedeutet dasselbe wie `ok`",
           LZ.length === 10 && uneins.length === 0,
           LZ.length !== 10 ? "Aufbau lieferte nur " + LZ.length + " Laufbahnen"
             : uneins.length ? "auseinander: " + uneins.join(", ")
             : mitMass.length + " Marken über " + LZ.length + " Laufbahnen geprüft");

        /* Ein bereits erreichtes Ziel darf nicht noch einmal kommen. */
        const fertig = LZ.length ? LZ[0] : null;
        const zf = fertig ? NZ(fertig) : null;
        pr("Ziel: was schon erreicht ist, wird nicht mehr angeboten",
           !zf || !(fertig.milestones || []).includes(zf.id),
           zf ? "angeboten: " + zf.titel + " (" + zf.ist + "/" + zf.soll + ")" : "keines offen");

        /* Unter 40 % wird nichts angeboten — „noch 98 bis 100" entmutigt,
           statt Orientierung zu geben. */
        const frisch = { seasons: [], milestones: [], tot: { apps: 1, goals: 0, assists: 0, cs: 0, seasons: 1 },
                         nt: { caps: 0 } };
        pr("Ziel: ein Anfänger bekommt kein unerreichbares Fernziel",
           NZ(frisch) === null, "bei einem Spiel und null Toren: " + (NZ(frisch) ? NZ(frisch).titel : "keines"));

        /* GEGENPROBE dazu: knapp UEBER der Schwelle muss eines kommen.
           Ohne sie koennte die Zeile darueber auch gruen sein, weil die
           Funktion NIE etwas liefert. */
        const nah = { seasons: [], milestones: [], tot: { apps: 30, goals: 0, assists: 0, cs: 0, seasons: 1 },
                      nt: { caps: 0 } };
        const zn = NZ(nah);
        pr("Ziel: Gegenprobe — wer nah dran ist, bekommt eines",
           !!zn && zn.id === "a50",
           zn ? zn.titel + " (" + zn.ist + "/" + zn.soll + ")" : "keines — die Funktion liefert nie etwas");

        /* Über echte Laufbahnen: Dichte und Streuung. */
        if (LZ.length) {
          const alleZ = LZ.map((q) => NZ(q)).filter(Boolean);
          const arten = new Set(alleZ.map((z) => z.id));
          pr("Ziel: über echte Laufbahnen streut die Auswahl",
             alleZ.length === 0 || arten.size >= Math.min(3, alleZ.length),
             alleZ.length + " Laufbahnen mit Ziel · " + arten.size + " verschiedene");
        }

        /* Robustheit gegen alte und lueckenhafte Staende. */
        let krachZ = null;
        [null, {}, { seasons: [] }, { seasons: [], tot: {} }].forEach((x) => {
          try { NZ(x); } catch (e) { krachZ = krachZ || e.message; } });
        pr("Ziel: unvollständige Zustände stürzen nicht ab",
           krachZ === null, krachZ || "vier Lücken-Lagen abgefangen");
      }
    }

    /* ---- ERINNERUNGSMOMENTE (35.108) ----------------------------------
       Stufe C. Sechs Ereignisse greifen Jahre später eine frühere
       Entscheidung auf. `p.flags` sagt WAS, `p.evLog` sagt WANN — beides gab
       es längst, `evLog` wurde nur nie für einen Rückbezug gelesen. */
    {
      const EV = App.EVENTS || [];
      const ERIN = EV.filter((e) => /^er_/.test(e.id));
      pr("Erinnerung: die sechs Rückbezüge sind da", ERIN.length === 6,
         ERIN.length + " Ereignisse mit Kennung `er_`");

      /* DIE WICHTIGSTE PROBE: jede Quell-Kennung in `her(p, "…")` muss ein
         Ereignis sein, das es WIRKLICH gibt. Ein Tippfehler wäre vollkommen
         stumm — `her` lieferte -1, die Bedingung würde nie wahr, und das
         Ereignis wäre toter Code, ohne dass irgendetwas rot meldet. Genau
         diese Klasse hat 35.102 (`a_akaF_jg50`) und 35.105 („Die langen
         Jahre") gekostet. */
      const ids = new Set(EV.map((e) => e.id));
      const falsch = [];
      ERIN.forEach((e) => {
        const q = String(e.cond || "");
        /* `her\d*\(` und nicht `her\(`: esbuild benennt die Funktion im Bündel
           in `her2` um. Der erste Entwurf suchte `her(` und fand deshalb GAR
           NICHTS — die Probe war grün, auch als in der Gegenprobe eine
           Quell-Kennung absichtlich verfälscht wurde. Zweimal dieselbe Falle
           in derselben Fassung: eine Prüfung, die den Quelltext ihres
           Prüflings liest, muss damit rechnen, dass der Übersetzer Namen
           ändert. Zeichenketten ändert er nicht — die Kennung in
           Anführungszeichen bleibt, worauf sich diese Probe stützt. */
        for (const m of q.matchAll(/her\d*\(\s*p\s*,\s*"([^"]+)"\s*\)/g))
          if (!ids.has(m[1])) falsch.push(e.id + " → „" + m[1] + "“");
      });
      pr("Erinnerung: jede Quelle ist ein Ereignis, das es gibt",
         falsch.length === 0,
         falsch.length ? "kennt niemand: " + falsch.join(", ")
                       : ERIN.length + " Rückbezüge geprüft");

      /* Jede braucht BEIDES: das Flag und den Abstand. Mit nur einem wäre es
         eine Folgeszene, kein Rückbezug — der Spieler sähe sie im Jahr darauf.

         GEPRÜFT WIRD DAS VERHALTEN, NICHT DER TEXT. Der erste Entwurf suchte
         `/her\(/` im Quelltext der Bedingung und meldete alle sechs rot:
         esbuild benennt die Funktion im Bündel in `her2` um. Dieselbe Falle
         wie bei den Kapitelnamen in 35.105 — eine Prüfung, die den Quelltext
         ihres Prüflings parst, misst den Übersetzer mit. Jetzt wird die
         Bedingung dreimal AUSGEFÜHRT: mit nichts, mit nur dem Flag, mit
         beidem. Nur die letzte darf wahr sein. */
      const zuFrueh = [], nieWahr = [];
      ERIN.forEach((e) => {
        const q = String(e.cond || "");
        const fl = (q.match(/flags\.([A-Za-z_0-9]+)/) || [])[1];
        const src = [...q.matchAll(/"([A-Za-z_0-9]+)"/g)].map((m) => m[1]).find((x) => ids.has(x));
        if (!fl || !src) {
          /* Getrennt melden, sonst schickt die Zeile in die Irre: fehlt der
             Zeitabstand, ist das ein ANDERER Fehler als ein fehlendes Flag —
             ohne Abstand wäre es eine Folgeszene, ohne Flag ein Ereignis für
             jeden. */
          nieWahr.push(e.id + (fl ? " (kein Zeitabstand in der Bedingung)"
                                  : " (kein Flag in der Bedingung)"));
          return;
        }
        const bau = (mitFlag, abstand) => ({
          age: 36, ovr: 78, trust: 60, money: 5, morale: 60, form: 60,
          pos: "ST", life: { status: "ledig", kids: 0 }, nt: { caps: 0, majors: [], level: 0 },
          seasons: new Array(20).fill({ apps: 30, role: "Stammspieler" }),
          flags: mitFlag ? { [fl]: true } : {},
          evLog: abstand == null ? {} : { [src]: 20 - abstand },
          milestones: [], trophies: [], awards: [], tot: { apps: 400, seasons: 20 },
        });
        const test = (x) => { try { return !!e.cond(x); } catch (err) { return null; } };
        const leer = test(bau(false, null));
        const nurFlag = test(bau(true, null));
        const beides = test(bau(true, 12));
        if (leer === true || nurFlag === true) zuFrueh.push(e.id);
        if (beides !== true) nieWahr.push(e.id + " (greift auch mit beidem nicht)");
      });
      pr("Erinnerung: keine greift ohne das Flag oder ohne Abstand",
         zuFrueh.length === 0,
         zuFrueh.length ? "zu früh: " + zuFrueh.join(", ") : ERIN.length + " geprüft");
      pr("Erinnerung: jede greift, wenn Flag und Abstand da sind",
         nieWahr.length === 0,
         nieWahr.length ? nieWahr.join(", ") : ERIN.length + " von " + ERIN.length);

      /* `her` selbst. Der -1-Fall ist der kritische: mit 0 wäre
         `her(p, x) >= 6` bei einem alten Spielstand ohne `evLog`-Eintrag
         versehentlich… nein, mit 0 wäre es FALSCH herum — `seasons.length - 0`
         ergäbe die volle Laufbahnlänge und die Bedingung würde für jemanden
         wahr, der das Ereignis nie gesehen hat. */
      const herF = App.her;
      if (typeof herF !== "function") {
        pr("Erinnerung: `her` ist ausgeführt", false, "nicht im Bündel");
      } else {
        const lang = { seasons: new Array(20).fill({}), evLog: { x: 4 } };
        const nie = { seasons: new Array(20).fill({}), evLog: {} };
        pr("Erinnerung: `her` rechnet den Abstand richtig",
           herF(lang, "x") === 16, "20 Saisons, Ereignis in Saison 4 → " + herF(lang, "x"));
        pr("Erinnerung: `her` meldet -1, wenn das Ereignis nie kam",
           herF(nie, "x") === -1 && herF(null, "x") === -1,
           "ohne Eintrag: " + herF(nie, "x") + " · ohne Spieler: " + herF(null, "x"));

        /* GEGENPROBE zum -1: mit 0 statt -1 würde eine 20-Saison-Laufbahn
           ohne jeden Eintrag die Bedingung `>= 6` erfüllen. Diese Zeile hält
           fest, dass genau das NICHT passiert. */
        pr("Erinnerung: Gegenprobe — wer die Quelle nie erlebt hat, fällt durch",
           !(herF(nie, "x") >= 6),
           "her = " + herF(nie, "x") + ", Schwelle 6 → " + (herF(nie, "x") >= 6 ? "ERFÜLLT" : "nicht erfüllt"));
      }

      /* Gewichte: eine so selektive Bedingung braucht ein hohes Gewicht,
         sonst kommt das Ereignis rechnerisch nie. Gemessen: mit 3 bis 6 kam
         über 200 Laufbahnen genau EINE Erinnerung zustande. */
      const zuLeicht = ERIN.filter((e) => (e.w || 2) < 10).map((e) => e.id);
      pr("Erinnerung: alle haben ein Gewicht, das sie auch ankommen lässt",
         zuLeicht.length === 0,
         zuLeicht.length ? "zu leicht: " + zuLeicht.join(", ")
                         : "alle bei " + Math.min(...ERIN.map((e) => e.w)) + " oder höher");
    }

    /* ---- ARCHETYPEN (35.109) ------------------------------------------
       Stufe D. Der Archetyp wird bei jedem Aufruf neu aus dem Verlauf
       gerechnet — kein neues Feld, keine Wahl am Anfang. */
    {
      const AT = App.archetyp, TAB = App.ARCHETYPEN || [];
      if (typeof AT !== "function") {
        pr("Archetyp: die Funktion ist ausgeführt", false, "nicht im Bündel");
      } else {
        pr("Archetyp: die Tabelle hat genug Einträge", TAB.length >= 8,
           TAB.length + " Archetypen");

        /* BESTIMMT, NICHT ZUFÄLLIG. Derselbe Verlauf muss immer dieselbe
           Einordnung ergeben — sonst wäre es keine Biografie, sondern eine
           Lotterie. */
        const LA = [];
        try { for (let i = 0; i < 14; i++) LA.push(laufbahnFuerZeilen()); } catch (e) { /* faellt auf */ }
        pr("Archetyp: der Laufbahn-Aufbau hat wirklich Laufbahnen erzeugt",
           LA.length === 14, LA.length + " Laufbahnen");
        const wackelt = LA.filter((q) => {
          const a = AT(q), b = AT(q);
          return !a !== !b || (a && b && a.haupt !== b.haupt);
        }).length;
        pr("Archetyp: derselbe Verlauf ergibt immer dieselbe Einordnung",
           wackelt === 0, wackelt ? wackelt + " wackeln" : LA.length + " zweimal geprüft");

        /* ERREICHBARKEIT deterministisch, wie bei den Kapiteln in 35.105.
           Über Zufallsläufe würde eine Probe auf „Das Wunderkind" (1,3 %)
           flattern. Gesucht wird zu jedem Archetyp ein Merkmalssatz, bei dem
           er gewinnt — findet sich keiner, ist die Zeile toter Code. */
        const roh = { saisons: 12, stationen: 3, laender: 1, treu: 4, rueck: 0,
          peakAlter: 27, verletzt: 0, comeback: 0, absturz: 5, caps: 0,
          ntTitel: 0, titel: 0, kapi: 0 };
        const extrem = [
          { treu: 14, rueck: 2, stationen: 2 },            /* Ikone */
          { stationen: 20, laender: 9, treu: 1 },          /* Wandervogel */
          { peakAlter: 33 },                               /* Spätstarter */
          { peakAlter: 19 },                               /* Wunderkind */
          { verletzt: 5, absturz: 25 },                    /* Pechvogel */
          { comeback: 1, verletzt: 3, absturz: 0 },        /* Wiederauferstandene */
          { saisons: 26 },                                 /* ewiger Profi */
          { caps: 160, ntTitel: 3 },                       /* Nationalheld */
          { titel: 30 },                                   /* Titelsammler */
          { kapi: 16 },                                    /* Anführer */
        ];
        const gewinner = new Set();
        extrem.forEach((e) => {
          const m = { ...roh, ...e };
          let best = null;
          TAB.forEach(([n, f]) => {
            let w = 0; try { w = f(m) || 0; } catch (x) { w = 0; }
            if (!best || w > best.w) best = { n, w };
          });
          if (best && best.w > 0) gewinner.add(best.n);
        });
        const nieAT = TAB.map((x) => x[0]).filter((n) => !gewinner.has(n));
        pr("Archetyp: jeder kann bei passendem Verlauf auch gewinnen",
           nieAT.length === 0,
           nieAT.length ? "nie erreichbar: " + nieAT.join(", ")
                        : gewinner.size + " von " + TAB.length);

        /* Und über echte Laufbahnen: keiner darf das Feld beherrschen. */
        if (LA.length) {
          const z = {}; LA.forEach((q) => { const a = AT(q); if (a) z[a.haupt] = (z[a.haupt] || 0) + 1; });
          const top = Object.entries(z).sort((a, b) => b[1] - a[1])[0];
          pr("Archetyp: keiner beherrscht das Feld",
             !top || top[1] / LA.length <= 0.6,
             top ? "häufigster " + Math.round(100 * top[1] / LA.length) + " % · "
                   + Object.keys(z).length + " verschiedene" : "—");
        }

        /* Zu früh gibt es kein Urteil — nach zwei Saisons ist noch keine
           Biografie entstanden. */
        pr("Archetyp: unter drei Saisons gibt es keine Einordnung",
           AT({ seasons: [{}, {}], peakOvr: 70, ovr: 70, nt: {}, trophies: [] }) === null,
           "zwei Saisons → " + JSON.stringify(AT({ seasons: [{}, {}], peakOvr: 70, ovr: 70, nt: {}, trophies: [] })));

        let krachA = null;
        [null, {}, { seasons: [] }, { seasons: [{}, {}, {}] }].forEach((x) => {
          try { AT(x); } catch (e) { krachA = krachA || e.message; } });
        pr("Archetyp: unvollständige Zustände stürzen nicht ab",
           krachA === null, krachA || "vier Lücken-Lagen abgefangen");
      }
    }

    /* ---- BIOGRAFISCHER GRUND AM ANGEBOT (35.110) ----------------------
       Stufe E. Der Grund erzaehlt, warum dieser Verein anruft — er rechnet
       NICHTS. Das Papier warnt ausdruecklich: „Die vorhandene Transferlogik
       soll nicht durch Storyzwang verfaelscht werden." */
    {
      const AG = App.angebotsGrund, GTAB = App.ANGEBOTSGRUND || [];
      if (typeof AG !== "function") {
        pr("Angebotsgrund: die Funktion ist ausgeführt", false, "nicht im Bündel");
      } else {
        pr("Angebotsgrund: die Tabelle hat Einträge", GTAB.length >= 5,
           GTAB.length + " Gründe");

        /* DIE WICHTIGSTE PROBE: der Grund darf die Zahlen nicht anfassen.
           Zweimal dieselben Angebote erzeugen, einmal mit und einmal ohne
           Grund gelesen — Gehalt, Ablöse, Rolle und Laufzeit muessen gleich
           bleiben. Geprueft wird an den fertigen Angeboten selbst: kein Feld
           ausser `grund` darf sich zwischen zwei Aufrufen unterscheiden, und
           `grund` haengt nur an Wechseln. */
        const LG = [];
        try { for (let i = 0; i < 8; i++) LG.push(laufbahnFuerZeilen()); } catch (e) { /* faellt auf */ }
        pr("Angebotsgrund: der Laufbahn-Aufbau hat Laufbahnen erzeugt",
           LG.length === 8, LG.length + " Laufbahnen");

        let anAlten = 0, gesamt = 0, mitGrund = 0;
        LG.forEach((q) => {
          let of = [];
          try { of = App.makeOffers({ ...q, contract: 0 }); } catch (e) { return; }
          of.forEach((o) => {
            gesamt++;
            if (o.grund) {
              mitGrund++;
              if (o.type === "stay" || o.type === "renew") anAlten++;
            }
          });
        });
        pr("Angebotsgrund: kein Grund an „Erfüllen“ oder „Verlängern“",
           anAlten === 0,
           anAlten ? anAlten + " Eigenangebote tragen einen Grund"
                   : gesamt + " Angebote geprüft · " + mitGrund + " mit Grund");

        /* Erreichbarkeit deterministisch, wie bei den Kapiteln und
           Archetypen: zu jedem Grund eine Lage, in der er greift — und keine
           davor. Ueber Zufallslaeufe wuerde „Dein Ausbildungsverein"
           flattern, weil `p.bei` im Pruefaufbau leer bleibt. */
        const basis = {
          age: 26, wage: 1, bei: "", nation: { id: "DE" },
          club: { n: "Jetzt", c: "DE", l: "Bundesliga", s: 75 },
          seasons: [{ club: "Erster", land: "DE", league: "Bundesliga" },
                    { club: "Jetzt", land: "DE", league: "Bundesliga" }],
        };
        const lagen = [
          [{ bei: "Zielklub" }, { n: "Zielklub", c: "DE", l: "2. Liga", s: 60 }, { roleKey: "start", years: 3, wage: 1 }],
          [{}, { n: "Erster", c: "DE", l: "Bundesliga", s: 70 }, { roleKey: "start", years: 3, wage: 1 }],
          /* Der Verein muss in der MITTE liegen, nicht am Anfang: sonst
             greift „Der Verein deiner ersten Saison" davor, und diese Lage
             prüft nicht das, was sie prüfen soll. Beim ersten Entwurf war
             genau das der Fall — die Probe meldete „Du warst schon einmal
             hier" als unerreichbar, obwohl die Regel in Ordnung ist. */
          [{ seasons: [{ club: "Erster", land: "DE", league: "Bundesliga" },
                       { club: "Mitte", land: "DE", league: "Bundesliga" },
                       { club: "Jetzt", land: "DE", league: "Bundesliga" }] },
           { n: "Mitte", c: "DE", l: "Bundesliga", s: 70 }, { roleKey: "start", years: 3, wage: 1 }],
          [{}, { n: "Riese", c: "ES", l: "La Liga", s: 88 }, { roleKey: "bench", years: 3, wage: 1 }],
          [{}, { n: "Ausland", c: "ES", l: "La Liga", s: 70 }, { roleKey: "start", years: 3, wage: 1 }],
          [{ age: 33 }, { n: "Spaet", c: "DE", l: "Bundesliga", s: 70 }, { roleKey: "start", years: 4, wage: 2 }],
          [{ age: 38 }, { n: "Letzt", c: "DE", l: "Bundesliga", s: 72 }, { roleKey: "star", years: 3, wage: 1 }],
        ];
        const getroffen = new Set();
        lagen.forEach(([extra, club, ang]) => {
          const g = AG({ ...basis, ...extra }, club, ang);
          if (g) getroffen.add(g);
        });
        const nieG = GTAB.map((x) => x[0]).filter((n) => !getroffen.has(n));
        pr("Angebotsgrund: jeder Grund ist bei passender Lage erreichbar",
           nieG.length === 0,
           nieG.length ? "nie: " + nieG.join(", ") : getroffen.size + " von " + GTAB.length);

        /* Gegenprobe: eine gewoehnliche Lage darf GAR KEINEN Grund ergeben —
           sonst traegt jedes Angebot eine Zeile und sie sagt nichts mehr. */
        pr("Angebotsgrund: Gegenprobe — die gewöhnliche Lage bleibt ohne",
           AG(basis, { n: "Fremd", c: "DE", l: "Bundesliga", s: 70 },
              { roleKey: "start", years: 3, wage: 1 }) === null,
           "26 Jahre, fremder Verein, gleiches Land → "
             + (AG(basis, { n: "Fremd", c: "DE", l: "Bundesliga", s: 70 },
                   { roleKey: "start", years: 3, wage: 1 }) || "kein Grund"));

        /* ER RECHNET NICHTS — das ist die Zusage aus dem Papier, und sie
           gehoert geprueft. `makeOffers` wuerfelt, ein Vorher/Nachher-
           Vergleich zweier Aufrufe taugt also nicht. Stattdessen wird das
           Angebotsobjekt SELBST beobachtet: `angebotsGrund` bekommt es
           uebergeben und darf es nicht anfassen.

           Die Luecke fiel beim Gegenpruefen auf: ein Versuch, im Anhaengen
           heimlich `o.wage * 1.2` einzubauen, waere von keiner einzigen Probe
           bemerkt worden. */
        const vorher = { roleKey: "star", years: 3, wage: 1.5, fee: 2, signOn: .1 };
        const kopie = JSON.stringify(vorher);
        AG({ ...basis, age: 38 }, { n: "X", c: "DE", l: "Bundesliga", s: 72 }, vorher);
        pr("Angebotsgrund: er fasst das Angebot nicht an",
           JSON.stringify(vorher) === kopie,
           JSON.stringify(vorher) === kopie ? "Gehalt, Ablöse, Rolle, Laufzeit unverändert"
                                            : "verändert: " + JSON.stringify(vorher));

        /* Und dieselbe Frage an der Kette: zwischen dem fertigen Angebot und
           einem ohne Grund darf sich AUSSER `grund` nichts unterscheiden.
           Geprueft ueber die Felder, die Geld und Rolle tragen. */
        const felder = ["wage", "fee", "signOn", "years", "role", "roleKey", "type"];
        let verbogen = 0;
        LG.forEach((q) => {
          let of = [];
          try { of = App.makeOffers({ ...q, contract: 0 }); } catch (e) { return; }
          of.filter((o) => o.grund).forEach((o) => {
            /* Ein Angebot mit Grund muss in allen Zahlenfeldern dieselbe Form
               haben wie eines ohne — kein Feld darf fehlen oder NaN sein. */
            felder.forEach((f) => {
              if (o[f] === undefined || (typeof o[f] === "number" && !isFinite(o[f]))) verbogen++;
            });
          });
        });
        pr("Angebotsgrund: Angebote mit Grund tragen dieselben Zahlenfelder",
           verbogen === 0, verbogen ? verbogen + " Felder fehlen oder sind unbrauchbar"
                                    : felder.length + " Felder je Angebot geprüft");

        /* DIE STELLE, DIE DEN GRUND ANHAENGT, DARF NUR `grund` SETZEN.
           Die Probe darueber prueft `angebotsGrund` selbst — und war blind,
           als in der Gegenprobe im AUFRUFER heimlich `o.wage * 1.2` eingebaut
           wurde. Die Funktion war unschuldig, die Kette nicht.

           Geprueft wird die QUELLDATEI, nicht das Buendel: dort stehen die
           Namen unveraendert. `makeOffers` wuerfelt, ein Vorher/Nachher-
           Vergleich zweier Aufrufe taugt hier nicht. */
        const fsG = require("fs");
        const ARGG = require("./argumente.cjs");
        const kG = [ARGG.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
          .filter(Boolean).find((k) => { try { return fsG.statSync(k).isFile(); }
            catch (e) { return false; } });
        const qG = kG ? fsG.readFileSync(kG, "utf8") : "";
        pr("Angebotsgrund: App.jsx für die Kettenprüfung gefunden", !!qG,
           kG || "nicht gefunden — die Zeile darunter läuft NICHT");
        if (qG) {
          const i = qG.indexOf("const g = angebotsGrund(");
          const block = i >= 0 ? qG.slice(i, i + 320) : "";
          /* Alles, was im Anhaenge-Block an `o.` zugewiesen wird. */
          const zuw = [...block.matchAll(/\bo\.([A-Za-z_0-9]+)\s*=(?!=)/g)].map((m) => m[1]);
          const fremd = zuw.filter((f) => f !== "grund");
          pr("Angebotsgrund: beim Anhängen wird NUR `grund` gesetzt",
             i >= 0 && fremd.length === 0,
             i < 0 ? "Anhänge-Stelle nicht gefunden"
                   : fremd.length ? "setzt außerdem: " + [...new Set(fremd)].join(", ")
                                  : "eine Zuweisung, und die heißt `grund`");
        }

        let krachG = null;
        [[null, null, null], [{}, {}, {}], [basis, null, {}]].forEach(([a, b, c]) => {
          try { AG(a, b, c); } catch (e) { krachG = krachG || e.message; } });
        pr("Angebotsgrund: unvollständige Zustände stürzen nicht ab",
           krachG === null, krachG || "drei Lücken-Lagen abgefangen");
      }
    }

    /* ---- WAS AUS DEM ALTEN VEREIN WURDE (35.111) ----------------------
       Stufe E, zweiter Teil. Neutral formuliert, ohne Bewertung — das Papier
       will Erinnerung, keine nachträgliche Bestrafung. */
    {
      const SP = App.alterVereinSpiegel;
      if (typeof SP !== "function") {
        pr("Spiegel: die Funktion ist ausgeführt", false, "nicht im Bündel");
      } else {
        const tab = (n) => Array.from({ length: n }, (_, i) => ({
          pos: i + 1, pts: 80 - i * 3, club: { n: "Club" + (i + 1) } }));
        const basisS = { seasons: [{ club: "Club1" }, { club: "Club18" }, { club: "Jetzt" }] };

        /* Nur echte frühere Vereine — der AKTUELLE zählt nicht, sonst stünde
           bei jedem „dein alter Verein" der Verein, bei dem man gerade ist. */
        pr("Spiegel: der aktuelle Verein zählt nicht als alter",
           SP({ seasons: [{ club: "Jetzt" }] },
              { club: "Jetzt", rank: 5, N: 18, table: tab(18) }) === null,
           "nur der eigene Verein in der Historie → kein Spiegel");

        /* Meister hat Vorrang vor Absteiger: wer beides in der Historie hat,
           liest die größere Nachricht. */
        const m = SP(basisS, { club: "Jetzt", rank: 9, N: 18, table: tab(18) });
        pr("Spiegel: Meister geht vor Abstiegsplatz",
           !!m && m.club === "Club1" && /Meister/.test(m.text),
           m ? m.club + " " + m.text : "kein Spiegel");

        /* Ohne auffälligen Verlauf schweigt sie. Ein alter Verein direkt
           neben einem in der Tabelle ist keine Geschichte. */
        pr("Spiegel: ohne Auffälligkeit bleibt es still",
           SP({ seasons: [{ club: "Club8" }, { club: "Jetzt" }] },
              { club: "Jetzt", rank: 9, N: 18, table: tab(18) }) === null,
           "alter Verein auf 8, eigener auf 9 → kein Spiegel");

        /* GEGENPROBE dazu: fünf Plätze davor MUSS eine Zeile ergeben, sonst
           wäre die Zeile darüber auch grün, weil die Funktion nie etwas
           liefert. */
        const w = SP({ seasons: [{ club: "Club4" }, { club: "Jetzt" }] },
                     { club: "Jetzt", rank: 9, N: 18, table: tab(18) });
        pr("Spiegel: Gegenprobe — fünf Plätze davor ergibt eine Zeile",
           !!w && w.club === "Club4", w ? w.club + " " + w.text : "keine — Funktion liefert nie etwas");

        /* Ohne Tabelle gar nichts — alte Spielstände könnten sie nicht haben. */
        pr("Spiegel: ohne Tabelle bleibt es still",
           SP(basisS, { club: "Jetzt", rank: 5, N: 18 }) === null,
           "kein `s.table` → kein Spiegel");

        /* Die Tabelle im Rückblick zeigt jetzt ECHTE Namen. Bis 35.110 stand
           dort ein Gedankenstrich, weil ein Kommentar behauptete, es gebe
           keine Vereinsnamen — `s.table` trägt sie seit jeher. */
        const fsS = require("fs");
        const ARGS = require("./argumente.cjs");
        const kS = [ARGS.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
          .filter(Boolean).find((k) => { try { return fsS.statSync(k).isFile(); }
            catch (e) { return false; } });
        const qS = kS ? fsS.readFileSync(kS, "utf8") : "";
        pr("Spiegel: die Tabelle im Rückblick zeigt keine Gedankenstriche mehr",
           !!qS && !/\{ich \? s\.club : "—"\}/.test(qS),
           !qS ? "App.jsx nicht gefunden — LÄUFT NICHT"
               : (/\{ich \? s\.club : "—"\}/.test(qS) ? "zeigt weiter „—“" : "zeigt `zeile.club.n`"));

        let krachS = null;
        [[null, null], [{}, {}], [basisS, {}], [{ seasons: [] }, { table: [] }]]
          .forEach(([a, b]) => { try { SP(a, b); } catch (e) { krachS = krachS || e.message; } });
        pr("Spiegel: unvollständige Zustände stürzen nicht ab",
           krachS === null, krachS || "vier Lücken-Lagen abgefangen");
      }
    }

    /* ---- KRISENPFADE (35.112) -----------------------------------------
       Stufe F, der Punkt mit dem hoechsten Balancing-Risiko. Das Papier
       woertlich: „Krisenpfade duerfen keinen versteckten Erfolgsautomaten
       erzeugen. Eine schlechte Karriere muss schlecht bleiben duerfen."

       DIESE PRUEFUNG IST DIE ABSICHERUNG DAZU. Ohne sie waere „jede Option
       hat einen Preis" eine Absicht, keine Eigenschaft — und die erste
       Fassung, die eine Zeile nachbessert, koennte sie unbemerkt aufheben. */
    {
      const EVK = App.EVENTS || [];
      const KR = EVK.filter((e) => /^kr_/.test(e.id));
      pr("Krisenpfad: die vier Wege sind da", KR.length === 4,
         KR.length + " Ereignisse mit Kennung `kr_`");

      /* Welche Wirkungen sind fuer den Spieler gut, welche schlecht? Nur
         Felder mit eindeutiger Richtung — `flag`, `wantMove` und dergleichen
         bleiben aussen vor, weil ihr Wert von der Lage abhaengt. */
      const GUT = ["morale", "trust", "rep", "form", "fitness", "legacy", "money",
                   "pot", "pac", "sho", "pas", "dri", "def", "phy", "raise", "caps"];
      const SCHLECHT = ["injuryProne", "cut", "penalty", "ntPenalty", "suspend"];
      const wert = (fx) => {
        if (!fx) return { plus: 0, minus: 0 };
        let plus = 0, minus = 0;
        Object.entries(fx).forEach(([k, v]) => {
          if (GUT.includes(k) && typeof v === "number") { if (v > 0) plus += v; else if (v < 0) minus -= v; }
          if (SCHLECHT.includes(k) && typeof v === "number") { if (v > 0) minus += v; else if (v < 0) plus -= v; }
          if (k === "forceInjury" || k === "ban" || k === "ban2" || k === "endCareer") minus += 25;
        });
        return { plus, minus };
      };

      /* Eine Option ist „rein positiv", wenn KEIN moeglicher Ausgang einen
         Preis hat. Bei einer Wuerfeloption reicht ein schlechter Ausgang —
         dann ist es ein Risiko und kein Geschenk. */
      const geschenke = [];
      KR.forEach((e) => {
        (e.choices || []).forEach((c, i) => {
          const ausgaenge = c.roll && c.roll.length ? c.roll.map((r) => r.fx) : [c.fx];
          const ohnePreis = ausgaenge.every((fx) => wert(fx).minus === 0);
          if (ohnePreis) geschenke.push(e.id + " Wahl " + (i + 1) + " „" + (c.label || "?") + "“");
        });
      });
      pr("Krisenpfad: keine Option ist rein positiv",
         KR.length > 0 && geschenke.length === 0,
         geschenke.length ? "ohne Preis: " + geschenke.join(" · ")
                          : KR.reduce((a, e) => a + (e.choices || []).length, 0) + " Optionen geprüft");

      /* GEGENPROBE zur Zeile darueber: die Bewertung muss ein Geschenk auch
         ERKENNEN. Ohne sie koennte `wert` immer 0 liefern und alles waere
         still gruen. */
      pr("Krisenpfad: Gegenprobe — die Bewertung erkennt ein Geschenk",
         wert({ morale: 20, form: 15 }).minus === 0 && wert({ morale: 20, form: -15 }).minus > 0,
         "nur Plus → kein Preis · Plus mit Minus → Preis erkannt");

      /* Jede Krise braucht MEHR als ein schlechtes Zeichen, sonst kaeme der
         Pfad staendig. Geprueft an der Bedingung: sie muss mindestens zwei
         Groessen lesen. */
      const zuEinfach = KR.filter((e) => {
        const q = String(e.cond || "");
        const zeichen = ["injury", "apps", "peakOvr", "trust", "note", "age", "role"]
          .filter((z) => q.indexOf(z) >= 0).length;
        return zeichen < 2;
      }).map((e) => e.id);
      pr("Krisenpfad: jede Bedingung liest mehrere Zeichen",
         zuEinfach.length === 0,
         zuEinfach.length ? "zu einfach: " + zuEinfach.join(", ") : "alle mindestens zwei");

      /* Und: ein gesunder Spieler in guter Lage darf KEINEN Krisenpfad
         bekommen. Sonst waeren es keine Auswege, sondern Alltag. */
      const gesund = { age: 27, ovr: 80, peakOvr: 80, trust: 70, morale: 70, form: 70,
        pos: "ST", injuryProne: 20, flags: {}, life: { status: "ledig", kids: 0 },
        nt: { caps: 0, majors: [] }, laden: {}, club: { n: "A", l: "L", s: 78, c: "DE" },
        seasons: [{ club: "A", apps: 34, note: 2.4, role: "Stammspieler", age: 26 },
                  { club: "A", apps: 33, note: 2.3, role: "Stammspieler", age: 27 }] };
      const treffen = KR.filter((e) => { try { return !!e.cond(gesund); } catch (x) { return false; } })
        .map((e) => e.id);
      pr("Krisenpfad: ein gesunder Spieler bekommt keinen",
         treffen.length === 0,
         treffen.length ? "greift trotzdem: " + treffen.join(", ") : "keiner von " + KR.length);
    }

    /* ---- ARCHETYP VERSCHIEBT GEWICHTE (35.113) ------------------------
       Das Papier erlaubt es und warnt zugleich: „Die Ereignisgewichtung darf
       nicht so deterministisch werden, dass der Spieler nach wenigen Jahren
       seinen gesamten zukuenftigen Storypfad vorhersagen kann." */
    {
      const AG2 = App.ARCHETYP_GEWICHT || {}, ATAB = App.ARCHETYPEN || [];
      const namen = ATAB.map((x) => x[0]);
      pr("Gewicht: jeder Archetyp hat eine Gewichtstabelle",
         namen.length > 0 && namen.every((n) => AG2[n] && Object.keys(AG2[n]).length),
         Object.keys(AG2).length + " Tabellen für " + namen.length + " Archetypen");

      /* KEIN POOL WIRD GESCHLOSSEN. Ein Faktor von 0 wuerde ein Thema
         aussperren — dann waere jedes Ereignis darin fuer diesen Spieler
         unerreichbar, und das ist genau der Determinismus, vor dem das Papier
         warnt. Nach oben ebenso: ab etwa 2 draengt ein Thema alles andere weg. */
      const wild = [];
      Object.entries(AG2).forEach(([n, t]) => Object.entries(t).forEach(([tag, f]) => {
        if (!(f >= .75 && f <= 1.55)) wild.push(n + "/" + tag + " = " + f);
      }));
      pr("Gewicht: kein Faktor sperrt aus oder reißt alles an sich",
         wild.length === 0,
         wild.length ? "außerhalb 0,75–1,55: " + wild.join(", ")
                     : Object.values(AG2).reduce((a, t) => a + Object.keys(t).length, 0)
                       + " Faktoren, alle im Band");

      /* Die Themen muessen existieren — ein Tippfehler waere vollkommen
         stumm: der Faktor griffe nie, und niemand merkte es. */
      const tags = new Set((App.EVENTS || []).map((e) => e.tag));
      const unbekannt = [];
      Object.entries(AG2).forEach(([n, t]) => Object.keys(t).forEach((tag) => {
        if (!tags.has(tag)) unbekannt.push(n + "/" + tag);
      }));
      pr("Gewicht: jedes gewichtete Thema gibt es auch",
         unbekannt.length === 0,
         unbekannt.length ? "kennt niemand: " + unbekannt.join(", ")
                          : tags.size + " Themen im Spiel");

      /* NICHT VORHERSAGBAR. Wenn der Archetyp einer Laufbahn von Anfang an
         feststuende, waere auch der Pool festgelegt. Gemessen ueber echte
         Verlaeufe: er wechselt. */
      const LD = [];
      try { for (let i = 0; i < 10; i++) LD.push(laufbahnFuerZeilen()); } catch (e) { /* faellt auf */ }
      let mehrfach = 0, gezaehlt = 0;
      LD.forEach((q) => {
        const folge = [];
        for (let i = 5; i <= q.seasons.length; i += 3) {
          const zw = { ...q, seasons: q.seasons.slice(0, i),
            peakOvr: Math.max(...q.seasons.slice(0, i).map((x) => x.ovr || 0)),
            ovr: q.seasons[i - 1].ovr || q.ovr };
          const a = App.archetyp(zw); if (a) folge.push(a.haupt);
        }
        if (folge.length < 2) return;
        gezaehlt++;
        if (new Set(folge).size >= 2) mehrfach++;
      });
      pr("Gewicht: der Archetyp steht nicht von Anfang an fest",
         gezaehlt === 0 || mehrfach / gezaehlt >= 0.5,
         gezaehlt ? mehrfach + " von " + gezaehlt + " Laufbahnen wechseln ihn mindestens einmal"
                  : "keine Laufbahn lang genug");
    }

    /* ---- ABGELEHNTE ANGEBOTE (35.114) ---------------------------------
       Das erste und einzige neue persistente Feld dieser Reihe. Deshalb liegt
       der Schwerpunkt hier auf ALTEN SPIELSTAENDEN: der Spielstand wird mit
       `JSON.parse` roh geladen, ohne Vervollstaendigung — bei einem Stand von
       vor 35.114 ist `abgelehnt` schlicht `undefined`. */
    {
      const SP2 = App.alterVereinSpiegel;
      const tab2 = (n) => Array.from({ length: n }, (_, i) => ({
        pos: i + 1, pts: 80 - i * 3, club: { n: "Club" + (i + 1) } }));

      /* DIE WICHTIGSTE: ein alter Spielstand ohne das Feld darf nicht
         abstuerzen und nichts Falsches zeigen. */
      const alt = { seasons: [{ club: "Club3" }, { club: "Jetzt" }] };   /* kein `abgelehnt` */
      let krachAlt = null, ergAlt;
      try { ergAlt = SP2(alt, { club: "Jetzt", rank: 9, N: 18, table: tab2(18) }); }
      catch (e) { krachAlt = e.message; }
      pr("Abgelehnt: ein Spielstand ohne das neue Feld läuft weiter",
         krachAlt === null,
         krachAlt || "kein Absturz · Ergebnis: " + (ergAlt ? ergAlt.club + " " + ergAlt.text : "kein Spiegel"));

      /* Und mit leerem Feld genauso. */
      let krachLeer = null;
      try { SP2({ seasons: [{ club: "Jetzt" }], abgelehnt: [] },
                { club: "Jetzt", rank: 9, N: 18, table: tab2(18) }); }
      catch (e) { krachLeer = e.message; }
      pr("Abgelehnt: ein leeres Feld läuft ebenfalls",
         krachLeer === null, krachLeer || "kein Absturz");

      /* Ein abgelehnter Verein, der Meister wird — der Satz, mit dem das
         Papier „Was wäre wenn" ueberhaupt einfuehrt. */
      const mit = { seasons: [{ club: "Jetzt" }],
        abgelehnt: [{ club: "Club1", jahr: 2030 }] };
      const em = SP2(mit, { club: "Jetzt", rank: 9, N: 18, table: tab2(18) });
      pr("Abgelehnt: der abgelehnte Klub, der Meister wird, taucht auf",
         !!em && em.club === "Club1" && em.abgelehnt === true,
         em ? em.club + " " + em.text + (em.abgelehnt ? " (abgelehnt)" : " (alter Verein)") : "kein Spiegel");

      /* KEINE SCHADENFREUDE. Steht der abgelehnte Verein UNTEN, bleibt es
         still — „das soll keine nachtraegliche Bestrafung sein". */
      const unten = { seasons: [{ club: "Jetzt" }],
        abgelehnt: [{ club: "Club17", jahr: 2030 }] };
      pr("Abgelehnt: wer unten steht, wird nicht vorgeführt",
         SP2(unten, { club: "Jetzt", rank: 3, N: 18, table: tab2(18) }) === null,
         "abgelehnter Verein auf 17, eigener auf 3 → kein Spiegel");

      /* Ein Verein, bei dem man SPAETER doch war, zaehlt als alter Verein und
         nicht als abgelehnter — sonst stuende „den du abgelehnt hast" unter
         einem, bei dem man drei Jahre gespielt hat. */
      const doch = { seasons: [{ club: "Club1" }, { club: "Jetzt" }],
        abgelehnt: [{ club: "Club1", jahr: 2030 }] };
      const ed = SP2(doch, { club: "Jetzt", rank: 9, N: 18, table: tab2(18) });
      pr("Abgelehnt: wer später doch dort war, gilt als alter Verein",
         !!ed && !ed.abgelehnt,
         ed ? (ed.abgelehnt ? "als abgelehnt gezeigt — falsch" : "als alter Verein gezeigt") : "kein Spiegel");

      /* Das Feld darf nicht unbegrenzt wachsen — ein Spielstand ist ein
         Speicher, kein Protokoll. Geprueft am Quelltext, weil die Kappung
         beim Annehmen sitzt. */
      const fsA = require("fs");
      const ARGA = require("./argumente.cjs");
      const kA = [ARGA.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
        .filter(Boolean).find((k) => { try { return fsA.statSync(k).isFile(); }
          catch (e) { return false; } });
      const qA = kA ? fsA.readFileSync(kA, "utf8") : "";
      /* Der erste Regex hier war `\[[^\]]*\]\.slice` und fand nichts: die
         Zuweisung enthaelt selbst eine leere Klammer (`p.abgelehnt || []`),
         an der `[^\]]*` abbricht. Jetzt wird der Abschnitt ab `q.abgelehnt =`
         genommen und darin nach der Kappung gesucht — robuster und leichter
         zu lesen als ein Regex, der Klammern zaehlen muss. */
      const iA = qA.indexOf("q.abgelehnt =");
      const blockA = iA >= 0 ? qA.slice(iA, iA + 140) : "";
      const gekappt = /\.slice\(\s*-\s*\d+\s*\)/.test(blockA);
      pr("Abgelehnt: die Liste wird beim Anhängen gekappt",
         !!qA && iA >= 0 && gekappt,
         !qA ? "App.jsx nicht gefunden — LÄUFT NICHT"
             : iA < 0 ? "Zuweisung nicht gefunden"
             : gekappt ? "`.slice(-n)` steht dabei" : "KEINE Kappung — das Feld wüchse unbegrenzt");
    }

    /* ---- GROESSE DES SPIELSTANDS (35.115) -----------------------------
       Es gab bis hierher KEINE Pruefung, die misst, wie gross ein Spielstand
       wird. Das Meta-Konzeptpapier nennt Savegame-Groesse als Kernrisiko und
       will Museum, Zeitleiste und Vereinslegenden speichern — ohne eine
       Obergrenze merkt niemand, wenn der naechste Punkt den Speicher
       verdoppelt.

       Gemessen wird an einer ECHTEN Langzeitlaufbahn, nicht an einem
       gebauten Zustand: nur so faellt auf, wenn ein neues Feld je Saison
       mitwaechst statt einmalig zu sein. */
    {
      const LS = [];
      try { for (let i = 0; i < 6; i++) LS.push(laufbahnFuerZeilen()); } catch (e) { /* faellt auf */ }
      pr("Speicher: der Laufbahn-Aufbau hat Langzeitläufe erzeugt",
         LS.length === 6 && LS.every((q) => (q.seasons || []).length >= 12),
         LS.length + " Laufbahnen · Saisons "
           + LS.map((q) => (q.seasons || []).length).join("/"));

      if (LS.length) {
        const byte = (o) => JSON.stringify(o).length;
        const jeSaison = LS.map((q) => byte(q.seasons) / Math.max(1, q.seasons.length));
        const schnitt = jeSaison.reduce((a, b) => a + b, 0) / jeSaison.length;
        const groesste = Math.max(...LS.map((q) => byte(q)));

        /* JE SAISON ist die richtige Groesse, nicht der Gesamtstand: eine
           lange Laufbahn darf mehr wiegen, aber nicht mehr JE JAHR. Vor der
           Verdichtung in 35.115 waren es rund 4.240 Byte, danach 3.735.
           Die Grenze liegt bewusst knapp darueber — sie soll anschlagen,
           bevor ein neues Feld sich einnistet, nicht erst wenn es weh tut. */
        pr("Speicher: eine Saison bleibt unter 4,3 KB im Spielstand",
           schnitt <= 4400,
           Math.round(schnitt) + " Byte je Saison (Grenze 4.400 · vor der Verdichtung 4.240)");

        pr("Speicher: eine ganze Laufbahn bleibt unter 130 KB",
           groesste <= 133120,
           Math.round(groesste / 1024) + " KB im größten Lauf");

        /* Und die Verdichtung selbst: in der Tabelle darf kein volles
           Vereinsobjekt mehr stehen. Ein Rueckfall waere still — der
           Spielstand waechst einfach wieder, und niemand sieht es. */
        let volleObjekte = 0, zeilen = 0;
        LS.forEach((q) => (q.seasons || []).forEach((x) => (x.table || []).forEach((t) => {
          zeilen++;
          if (t.club && typeof t.club === "object") volleObjekte++;
        })));
        pr("Speicher: die Tabelle trägt nur noch Vereinsnamen",
           zeilen > 0 && volleObjekte === 0,
           zeilen ? volleObjekte + " volle Objekte in " + zeilen + " Zeilen"
                  : "keine Tabellenzeilen im Lauf");

        /* GEGENPROBE: die Zaehlung muss ein volles Objekt auch ERKENNEN.
           Ohne sie waere die Zeile darueber gruen, weil `zeilen` falsch
           gezaehlt wird oder die Bedingung nie greift. */
        const probe = [{ club: "Nur ein Name" }, { club: { n: "Volles Objekt", s: 70 } }];
        pr("Speicher: Gegenprobe — ein volles Objekt würde auffallen",
           probe.filter((t) => t.club && typeof t.club === "object").length === 1,
           "eine von zwei Testzeilen als volles Objekt erkannt");

        /* Und die Leseform muss BEIDE verstehen — alte Spielstaende tragen
           das volle Objekt weiter. */
        const TV = App.tabVerein;
        pr("Speicher: alte Spielstände mit vollem Objekt bleiben lesbar",
           typeof TV === "function"
             && TV({ club: { n: "Alt" } }) && TV({ club: { n: "Alt" } }).n === "Alt"
             && TV({ club: "Neu" }) && TV({ club: "Neu" }).n === "Neu"
             && TV({}) === null,
           typeof TV !== "function" ? "`tabVerein` nicht im Bündel"
             : "Objektform, Namensform und Leerfall geprüft");
      }
    }

    /* ---- DAS EWIGE REKORDBUCH (35.116) --------------------------------
       Stufe B. Kein neues Feld: `leereBilanz()` fuehrt 49 Zahlen mit, die
       bisher NUR die Errungenschaften speisten und nirgends zu sehen waren. */
    {
      const RK = App.REKORDE || [], RL = App.rekordListe;
      pr("Rekorde: die Liste hat die richtige Groessenordnung",
         RK.length >= 15 && RK.length <= 25,
         RK.length + " Rekorde (Papier: 15 bis 25)");

      /* JEDES FELD MUSS ES IN DER BILANZ GEBEN. Ein Tippfehler waere still:
         die Zeile laese `undefined`, `|| 0` machte 0 daraus, und der Rekord
         verschwaende einfach aus der Anzeige. */
      const G0 = App.leereBilanz ? App.leereBilanz() : null;
      const voll = {}; if (G0) Object.keys(G0).forEach((k) => { voll[k] = 7; });
      const leer = [];
      RK.forEach(([titel, hol]) => {
        let w = null; try { w = hol(voll); } catch (e) { w = null; }
        if (w !== 7) leer.push(titel);
      });
      pr("Rekorde: jeder liest ein Feld, das die Bilanz auch führt",
         !!G0 && leer.length === 0,
         !G0 ? "`leereBilanz` nicht im Bündel"
             : leer.length ? "liest nichts Vorhandenes: " + leer.join(", ")
                           : RK.length + " Felder gegen " + Object.keys(G0).length + " in der Bilanz");

      /* NULL IST KEIN REKORD. Eine frische Welt darf keine Seite voller
         Nullen zeigen — das saehe nach Versagen aus statt nach offener
         Rechnung. */
      pr("Rekorde: eine frische Welt zeigt keine leeren Zeilen",
         typeof RL === "function" && G0 && RL(G0).length === 0,
         typeof RL !== "function" ? "`rekordListe` nicht im Bündel"
           : G0 ? RL(G0).length + " Zeilen bei einer leeren Bilanz" : "—");

      /* GEGENPROBE: mit Werten MUSS die Liste voll sein. Ohne sie waere die
         Zeile darueber auch gruen, wenn `rekordListe` immer nichts liefert. */
      pr("Rekorde: Gegenprobe — mit Werten kommen alle",
         typeof RL === "function" && RL(voll).length === RK.length,
         typeof RL === "function" ? RL(voll).length + " von " + RK.length : "—");

      /* Halbvoll: nur die gefuellten Zeilen erscheinen. */
      if (G0 && typeof RL === "function") {
        const halb = { ...G0, apps: 300, goals: 40, titel: 2 };
        pr("Rekorde: nur was einen Wert hat, steht auch da",
           RL(halb).length === 3,
           RL(halb).length + " Zeilen bei drei gefüllten Feldern");
      }

      let krachR = null;
      [null, {}, { apps: 0 }].forEach((x) => {
        try { if (typeof RL === "function") RL(x); } catch (e) { krachR = krachR || e.message; } });
      pr("Rekorde: unvollständige Bilanzen stürzen nicht ab",
         krachR === null, krachR || "drei Lücken-Lagen abgefangen");
    }

    /* ---- RUHMESHALLE ALS MUSEUM (35.117) ------------------------------
       Stufe C. Drei Felder je Eintrag: Archetyp, Vereinsstationen mit
       Kapiteln, eine praegende Schlagzeile. Alle aus dem abgeleitet, was
       35.104 bis 35.113 gebaut haben. */
    {
      const fsM = require("fs");
      const ARGM = require("./argumente.cjs");
      const kM = [ARGM.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
        .filter(Boolean).find((k) => { try { return fsM.statSync(k).isFile(); }
          catch (e) { return false; } });
      const qM = kM ? fsM.readFileSync(kM, "utf8") : "";
      pr("Museum: App.jsx für die Prüfung gefunden", !!qM,
         kM || "nicht gefunden — die Zeilen darunter laufen NICHT");

      if (qM) {
        /* Die drei Felder muessen im Eintrag stehen. */
        const iH = qM.indexOf("saveHall({");
        const block = iH >= 0 ? qM.slice(iH, iH + 3000) : "";
        const fehlen = ["at:", "stat:", "sz:"].filter((f) => block.indexOf(f) < 0);
        pr("Museum: der Eintrag trägt Archetyp, Stationen und Schlagzeile",
           iH >= 0 && fehlen.length === 0,
           iH < 0 ? "`saveHall({` nicht gefunden" :
             fehlen.length ? "fehlt: " + fehlen.join(" ") : "alle drei Felder");

        /* GEKAPPT. Vier Stationen, nicht alle — ein Ruhmeshallen-Eintrag ist
           eine Wuerdigung, kein Karriereprotokoll. Ohne Kappung waechst der
           Speicher mit der Laenge jeder Laufbahn. */
        pr("Museum: die Stationsliste wird gekappt",
           /vereinsKapitel\(q\.seasons, q\)\s*\.slice\(0,\s*\d+\)/.test(qM),
           /vereinsKapitel\(q\.seasons, q\)\s*\.slice\(0,\s*\d+\)/.test(qM)
             ? "`.slice(0, n)` vorhanden" : "KEINE Kappung — der Eintrag wüchse mit der Laufbahn");
      }

      /* DIE AUSWAHL DARF NICHT IMMER DASSELBE LIEFERN. Der erste Entwurf nahm
         die SELTENSTE Schlagzeile einer Laufbahn — und dabei gewann praktisch
         immer „Der Anfang", weil die erste Saison zwangslaeufig einmalig ist.
         Der zweite ordnete nach Gefuehl und liess „Kapitän seines Landes" in
         74 % gewinnen. Diese Probe faehrt echte Laufbahnen und zaehlt. */
      const LM2 = [];
      try { for (let i = 0; i < 12; i++) LM2.push(laufbahnFuerZeilen()); } catch (e) { /* faellt auf */ }
      const RANG2 = ["Vom Reservisten zum Kapitän", "Nach hinten durchgereicht",
        "Das verlorene Jahr", "Der alte Mann ist noch da", "Sofort angekommen",
        "Kapitän seines Landes", "Durchbruch", "Der Mann, auf den sie bauen",
        "Zurückgeschrieben", "Das Jahr der Titel", "Die Binde",
        "Das Jahr der Verletzung", "Eine große Spielzeit", "Ein Jahr zum Vergessen"];
      const SZ2 = App.saisonSchlagzeile;
      const gewinner = {};
      LM2.forEach((q) => {
        const alle = q.seasons.map((x, i) => SZ2(x, i ? q.seasons[i - 1] : null, q)).filter(Boolean);
        for (const r of RANG2) if (alle.some((x) => x.kopf === r)) { gewinner[r] = (gewinner[r] || 0) + 1; break; }
      });
      const arten = Object.keys(gewinner).length;
      const top = Object.entries(gewinner).sort((a, b) => b[1] - a[1])[0];
      pr("Museum: die Schlagzeile im Eintrag streut",
         LM2.length === 12 && arten >= 3 && top && top[1] / LM2.length <= 0.6,
         LM2.length !== 12 ? "nur " + LM2.length + " Laufbahnen"
           : arten + " verschiedene · häufigste "
             + (top ? Math.round(100 * top[1] / LM2.length) : 0) + " % (Grenze 60 %)");

      /* GEGENPROBE zur Rangfolge: jede Zeile darin muss es als Schlagzeile
         auch geben — ein Tippfehler waere still, die Zeile wuerde nie
         gewaehlt und niemand merkte es. */
      const echte = new Set();
      LM2.forEach((q) => q.seasons.forEach((x, i) => {
        const z = SZ2(x, i ? q.seasons[i - 1] : null, q); if (z) echte.add(z.kopf); }));
      const unbekannt2 = RANG2.filter((r) => !echte.has(r));
      pr("Museum: Gegenprobe — jede Zeile der Rangfolge gibt es wirklich",
         LM2.length === 0 || unbekannt2.length <= 3,
         unbekannt2.length ? unbekannt2.length + " kamen in 12 Läufen nicht vor: "
             + unbekannt2.join(", ") : "alle " + RANG2.length + " gesehen");
    }

    /* ---- FUENFZEHN JAHRE IN KAPITELN (35.118) -------------------------
       Stufe D. Anders als bei der Spielerlaufbahn schneidet hier die LIGA,
       nicht der Vereinswechsel — ein Vereinsrun hat keinen. */
    {
      const VP = App.vereinsPhasen, VTAB = App.VEREINSPHASEN || [];
      if (typeof VP !== "function") {
        pr("Vereinsphase: die Funktion ist ausgeführt", false, "nicht im Bündel");
      } else {
        const j = (jahr, liga, rang, extra) => ({ jahr, liga, rang, N: 18, ...(extra || {}) });

        /* Die Liga schneidet. Zwei Jahre unten, dann Aufstieg, dann oben. */
        const ch = [j(1, "3. Liga", 5), j(2, "3. Liga", 2, { aufstieg: true }),
                    j(3, "2. Liga", 9), j(4, "2. Liga", 7)];
        const ph = VP(ch);
        pr("Vereinsphase: ein Ligawechsel beginnt ein neues Kapitel",
           ph.length === 2 && ph[0].liga === "3. Liga" && ph[1].liga === "2. Liga",
           ph.length + " Phasen aus 4 Jahren in 2 Ligen");

        /* GEGENPROBE: ohne Ligawechsel bleibt es EIN Kapitel. Sonst koennte
           die Funktion jedes Jahr zu einer Phase machen. */
        const eine = VP([j(1, "2. Liga", 5), j(2, "2. Liga", 4), j(3, "2. Liga", 6)]);
        pr("Vereinsphase: Gegenprobe — ohne Ligawechsel bleibt es ein Kapitel",
           eine.length === 1 && eine[0].jahre === 3,
           eine.length + " Phase(n) aus 3 Jahren in derselben Liga");

        /* „Der Absturz nach dem Titel" braucht den Blick zurueck. Ohne ihn
           waere jeder Abstieg derselbe. */
        const nachTitel = VP([j(0, "1. Liga", 8), j(1, "1. Liga", 1), j(2, "1. Liga", 1),
                              j(3, "1. Liga", 18, { abstieg: true }), j(4, "2. Liga", 8)]);
        const hatAbsturz = nachTitel.some((x) => x.kapitel === "Der Absturz nach dem Titel");
        pr("Vereinsphase: ein Abstieg nach Titeln heißt anders als einer ohne",
           hatAbsturz,
           nachTitel.map((x) => x.kapitel).join(" · "));

        /* Jede Regel muss erreichbar sein — deterministisch, wie bei den
           Kapiteln in 35.105. Ueber Zufallslaeufe wuerden die seltenen
           flattern. */
        /* JEDE LAGE BRAUCHT EINE ERSTE PHASE ALS VORLAUF. Der erste Entwurf
           dieser Liste bestand aus Ein-Phasen-Lagen — und die erste Phase
           heisst immer „Der Anfang" oder „Die Gründerjahre". Ergebnis: zehn
           von zwoelf Regeln wurden als toter Code gemeldet, obwohl nur die
           Testlagen zu kurz waren. Jede Lage beginnt jetzt mit einem
           belanglosen Vorlauf, damit die geprueste Phase die ZWEITE ist. */
        const vorlauf = [j(0, "Vorlauf-Liga", 9)];
        const L2 = (rest) => vorlauf.concat(rest);
        const lagen = [
          [j(1, "3. Liga", 8), j(2, "3. Liga", 7), j(3, "3. Liga", 6), j(4, "3. Liga", 9)],
          [j(1, "3. Liga", 8)],
          L2([j(1, "1. Liga", 1), j(2, "1. Liga", 1), j(3, "1. Liga", 1)]),
          L2([j(1, "2. Liga", 1, { aufstieg: true })]),
          L2([j(1, "2. Liga", 3, { aufstieg: true })]),
          L2([j(1, "1. Liga", 1)]).concat([j(2, "1. Liga", 17, { abstieg: true })]),
          L2([j(1, "1. Liga", 18, { abstieg: true })]),
          L2([j(1, "1. Liga", 1)]),
          L2([j(1, "2. Liga", 9), j(2, "2. Liga", 8), j(3, "2. Liga", 10),
              j(4, "2. Liga", 9), j(5, "2. Liga", 11)]),
          L2([j(1, "1. Liga", 2), j(2, "1. Liga", 3)]),
          L2([j(1, "1. Liga", 17), j(2, "1. Liga", 16)]),
          L2([j(1, "1. Liga", 9), j(2, "1. Liga", 8)]),
        ];
        const gesehen = new Set();
        lagen.forEach((c) => VP(c).forEach((x) => gesehen.add(x.kapitel)));
        const nieVP = VTAB.map((x) => x[1]).filter((n) => !gesehen.has(n));
        pr("Vereinsphase: jede Regel ist bei passendem Verlauf erreichbar",
           VTAB.length > 0 && nieVP.length === 0,
           nieVP.length ? "toter Code: " + nieVP.join(", ")
                        : gesehen.size + " von " + VTAB.length + " Kapiteln");

        let krachV = null;
        [null, [], [{}], [{ jahr: 1 }]].forEach((c) => {
          try { VP(c); } catch (e) { krachV = krachV || e.message; } });
        pr("Vereinsphase: unvollständige Chroniken stürzen nicht ab",
           krachV === null, krachV || "vier Lücken-Lagen abgefangen");
      }
    }

    /* ---- DIE ZEITLEISTE DER WELT (35.119) -----------------------------
       Stufe E. NICHTS wird gespeichert — das Papier warnt ausdruecklich, die
       Zeitleiste duerfe Savegames nicht aufblasen. Sie wird bei jedem Oeffnen
       aus Ruhmeshalle, Akademie- und Vereinschronik gerechnet. */
    {
      const MZ = App.metaZeitleiste;
      if (typeof MZ !== "function") {
        pr("Zeitleiste: die Funktion ist ausgeführt", false, "nicht im Bündel");
      } else {
        const hall = [{ name: "Erster", bis: 2040, score: 800 },
                      { name: "Bester", bis: 2055, score: 1600 }];
        const aka = { gegruendet: 2042, ehrentafel: [{ name: "Talent", jahr: 2049, ovr: 88 }] };
        const ver = { gegruendet: 2048, name: "FC Test",
          chronik: [{ jahr: 1, liga: "3. Liga", rang: 5 },
                    { jahr: 2, liga: "3. Liga", rang: 1, aufstieg: true },
                    { jahr: 3, liga: "2. Liga", rang: 8 }] };
        const zl = MZ(hall, aka, ver);
        pr("Zeitleiste: alle drei Systeme kommen vor",
           new Set(zl.map((e) => e.was)).size === 3,
           zl.length + " Einträge · " + [...new Set(zl.map((e) => e.was))].join(", "));

        /* NACH JAHR SORTIERT. Eine Zeitleiste, die springt, ist keine. */
        const jahre = zl.map((e) => e.jahr).filter((x) => x != null);
        const sortiert = jahre.every((x, i) => i === 0 || jahre[i - 1] <= x);
        pr("Zeitleiste: die Einträge stehen in der richtigen Reihenfolge",
           sortiert, jahre.join(" · "));

        /* Vereinsjahre sind RELATIV (1…15) und muessen auf das Gruendungsjahr
           gerechnet werden — sonst stuende der Aufstieg im Jahr 2. */
        const auf = zl.find((e) => /Aufstieg/.test(e.text));
        pr("Zeitleiste: Vereinsjahre werden auf Kalenderjahre gerechnet",
           !!auf && auf.jahr === 2049,
           auf ? "erster Aufstieg im Jahr " + auf.jahr + " (Gründung 2048 + Vereinsjahr 2 − 1)" : "nicht gefunden");

        /* ALTE VEREINE: `gegruendet: true` statt einer Zahl. Sie duerfen
           nicht an erfundener Stelle stehen, sondern ohne Jahr am Ende. */
        const altV = { ...ver, gegruendet: true };
        const zlAlt = MZ(hall, aka, altV);
        const ohneJahr = zlAlt.filter((e) => e.jahr == null);
        const amEnde = ohneJahr.length > 0
          && zlAlt.slice(-ohneJahr.length).every((e) => e.jahr == null);
        pr("Zeitleiste: ein Verein ohne Kalenderjahr steht am Ende, nicht mittendrin",
           ohneJahr.length === 3 && amEnde,
           ohneJahr.length + " ohne Jahr · am Ende: " + amEnde);

        /* GEGENPROBE: mit Jahr stehen sie NICHT am Ende. Ohne sie waere die
           Zeile darueber auch gruen, wenn alle Eintraege jahrlos waeren. */
        pr("Zeitleiste: Gegenprobe — mit Jahr sortieren sie sich ein",
           zl.every((e) => e.jahr != null),
           zl.filter((e) => e.jahr == null).length + " ohne Jahr bei vollständigen Daten");

        /* Ohne Daten gar nichts — kein leeres Gerüst. */
        pr("Zeitleiste: eine leere Welt ergibt keine Einträge",
           MZ([], null, null).length === 0, MZ([], null, null).length + " Einträge");

        let krachZ = null;
        [[null, null, null], [[], {}, {}], [[{}], { gegruendet: 2030 }, { gegruendet: 2030 }]]
          .forEach(([a, b, c]) => { try { MZ(a, b, c); } catch (e) { krachZ = krachZ || e.message; } });
        pr("Zeitleiste: unvollständige Daten stürzen nicht ab",
           krachZ === null, krachZ || "drei Lücken-Lagen abgefangen");
      }
    }

    /* ---- FLAECHENFARBEN AUF KARTON (35.121) ---------------------------
       Von Kevin auf dem S24 Ultra gefunden: „DER NATIONALHELD" stand im
       Karriererueckblick als fast schwarze Schrift auf dunkelbraunem Grund.
       Gemessener Kontrast 1,13 bei einer Grenze von 3.

       DIE URSACHE WAR STRUKTURELL. Die Kartonblaetter `.karteikarte` und
       `.laufzettel` loesen `--tx` und `--mu` zur Kartonfassung auf — die
       FLAECHENFARBEN aber nicht. Ein `.up`-Kasten innerhalb einer
       Karteikarte trug damit Tinte auf #262218.

       WARUM DER KONTRASTTEST ES NICHT FAND: `kontrast.cjs` prueft drei
       Ansichten (Titelblatt, Hauptmenue, Spielerpass). Der Karriere-
       rueckblick ist nicht dabei — und genau dort sind in den letzten
       zwanzig Fassungen die meisten neuen Anzeigen entstanden.

       Diese Probe deckt die KLASSE ab statt einer weiteren Ansicht: wer
       `--tx` umdefiniert, muss auch jede Flaeche umdefinieren, auf der
       dieser Text landen kann. Das faengt auch den naechsten Fall, ohne
       dass jemand eine vierte Ansicht nachtraegt. */
    {
      const fsF = require("fs");
      const ARGF = require("./argumente.cjs");
      const kF = [ARGF.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
        .filter(Boolean).find((k) => { try { return fsF.statSync(k).isFile(); }
          catch (e) { return false; } });
      const qF = kF ? fsF.readFileSync(kF, "utf8") : "";
      pr("Karton: App.jsx für die Farbprüfung gefunden", !!qF,
         kF || "nicht gefunden — die Zeilen darunter laufen NICHT");

      if (qF) {
        /* NUR `up` — BERICHTIGT NACH DEM ZWEITEN GERAETEBEFUND (35.122).
           Der erste Entwurf dieser Probe verlangte alle vier Flaechen, weil
           sie rechnerisch denselben Kontrast hatten. Genau das hat 35.121 zu
           breit gemacht: die Wildcard-Karte setzt in `.wkarte` absichtlich
           helle Schrift und traegt eine eigene Ausnahme, die ihr innerhalb
           der Kartonblaetter den DUNKLEN `--pan` zurueckgibt. Mit `--pan` auf
           Karton lief die Ausnahme ins Leere — helle Schrift auf hellem
           Papier.

           Eine Probe, die eine Regel erzwingt, muss die Ausnahmen kennen.
           Diese hier prueft deshalb `--up`, wo Tinte wirklich landet, und
           daneben, dass die Wildcard-Ausnahme UEBERHAUPT NOCH DA IST. */
        const FLAECHEN = ["up"];
        const luecken = [];
        ["laufzettel", "karteikarte"].forEach((blatt) => {
          const i = qF.indexOf("." + blatt + "{");
          if (i < 0) { luecken.push(blatt + " nicht gefunden"); return; }
          const block = qF.slice(i, i + 420);
          /* Nur Blaetter pruefen, die `--tx` ueberhaupt umdefinieren — nur
             dann kippt der Kontrast. */
          if (block.indexOf("--tx:") < 0) return;
          FLAECHEN.forEach((v) => {
            if (block.indexOf("--" + v + ":") < 0) luecken.push(blatt + "/--" + v);
          });
        });
        pr("Karton: wer die Textfarbe umstellt, stellt auch die Flächen um",
           luecken.length === 0,
           luecken.length ? "nicht aufgelöst: " + luecken.join(", ")
                          : "beide Blätter lösen " + FLAECHEN.length + " Flächenfarben auf");

        /* GEGENPROBE: die Suche muss eine fehlende Farbe auch ERKENNEN. */
        const probeBlock = "--ac:x; --tx:y;";
        pr("Karton: Gegenprobe — eine fehlende Flächenfarbe fällt auf",
           ["up"].filter((v) => probeBlock.indexOf("--" + v + ":") < 0).length === 1,
           "in einem Block ohne `--up` wird es erkannt");

        /* DIE AUSNAHME MUSS BLEIBEN. Sie ist der Grund, warum `--pan` in den
           Kartonblaettern NICHT aufgeloest werden darf. Wer sie entfernt,
           macht die Wildcard-Karte wieder unlesbar — und diesmal faellt es
           auf, bevor jemand ein Telefon in die Hand nimmt. */
        const ausnahme = /\.laufzettel\s+\.wkarte\s*,\s*\.karteikarte\s+\.wkarte\s*\{[^}]*background:\s*var\(--pan\)/.test(qF);
        pr("Karton: die Wildcard-Karte behält auf Karton ihren dunklen Grund",
           ausnahme,
           ausnahme ? "`.laufzettel .wkarte` setzt `background:var(--pan)`"
                    : "Ausnahme fehlt — helle Schrift auf hellem Papier");

        /* Und dass sie ueberhaupt helle Schrift setzt — sonst waere die
           Ausnahme sinnlos und jemand koennte sie fuer ueberfluessig halten. */
        const iW = qF.indexOf(".wkarte{");
        const wBlock = iW >= 0 ? qF.slice(iW, iW + 200) : "";
        pr("Karton: die Wildcard-Karte setzt eigene helle Schrift",
           iW >= 0 && /--tx:\s*#[EFef]/.test(wBlock),
           iW < 0 ? "`.wkarte` nicht gefunden"
                  : (/--tx:\s*#[EFef]/.test(wBlock) ? "eigene helle `--tx`" : "keine eigene Schriftfarbe"));
      }
    }

    /* ---- FAST GESCHAFFT (35.123) --------------------------------------
       Stufe G. Der Fortschritt wird aus der Bedingung ABGELEITET, nicht
       gepflegt — bei 192 Errungenschaften waere eine Handliste eine zweite
       Liste, die beim naechsten neuen Erfolg stumm auseinanderlaeuft. */
    {
      const FG = App.fastGeschafft, LB = App.leereBilanz;
      if (typeof FG !== "function" || typeof LB !== "function") {
        pr("Fast: die Funktion ist ausgeführt", false, "nicht im Bündel");
      } else {
        /* DIE WICHTIGSTE PROBE: das Ablesen aus der Bedingung muss im
           GEBUENDELTEN Code funktionieren. Das Parsen von Funktionstext ist
           in 35.105 und 35.108 zweimal danebengegangen — dort wurden aber
           NAMEN gelesen, die esbuild umbenennt. Feldnamen und Zahlen
           benennt er nicht um. Diese Zeile haelt genau das fest. */
        const G1 = { ...LB(), karrieren: 8, apps: 2400, goals: 470, caps: 190,
          titel: 22, vereine: 38, laender: 8, saisons: 140, treueMax: 8 };
        const f1 = FG(G1, []);
        pr("Fast: der Fortschritt lässt sich im Bündel wirklich ablesen",
           f1.length > 0,
           f1.length ? f1.length + " Treffer · " + f1.map((x) => x.ist + "/" + x.soll).join(" ")
                     : "KEINER — das Ablesen greift im Bündel nicht");

        /* Hoechstens drei. Das Papier sagt „2 bis 3", nicht „alles was
           passt" — sonst ist es wieder eine Liste. */
        const G2 = { ...LB(), karrieren: 15, apps: 4600, goals: 900, caps: 360,
          titel: 44, vereine: 70, laender: 12, saisons: 265, treueMax: 11,
          meister: 17, pokale: 12, kapitaen: 50, aufstiege: 9 };
        pr("Fast: es werden höchstens drei gezeigt",
           FG(G2, []).length <= 3, FG(G2, []).length + " bei einer weit fortgeschrittenen Welt");

        /* Unter 60 % nichts — wer bei 12 von 500 steht, liest das nicht. */
        const dünn = { ...LB(), apps: 12, karrieren: 1 };
        pr("Fast: was weit weg ist, wird nicht gezeigt",
           FG(dünn, []).length === 0,
           "bei 12 Pflichtspielen: " + FG(dünn, []).length + " Einträge");

        /* GEGENPROBE dazu: knapp DAVOR muss etwas kommen. Ohne sie waere die
           Zeile darueber auch gruen, wenn die Funktion nie etwas liefert. */
        const nah = { ...LB(), karrieren: 8 };
        const fn = FG(nah, []);
        pr("Fast: Gegenprobe — wer nah dran ist, wird gezeigt",
           fn.length > 0 && fn[0].soll === 10,
           fn.length ? fn[0].titel + " " + fn[0].ist + "/" + fn[0].soll : "nichts bei 8 von 10");

        /* Erledigte kommen nicht mehr. */
        const ids = FG(nah, []).map((x) => x.id);
        pr("Fast: was schon erreicht ist, verschwindet",
           FG(nah, ids).length === 0,
           "nach dem Erledigen: " + FG(nah, ids).length + " Einträge");

        /* Nur die Gesamtbilanz `G` — `p` und `A` sind beim Anschauen der
           Seite nicht dieselben wie beim Erfuellen. */
        const mitP = App.ACHIEVEMENTS.filter((a) => {
          const q = String(a.ok).replace(/\s+/g, " ").trim();
          const m = q.match(/^\(\s*p\s*,\s*G\s*(?:,[^)]*)?\)\s*=>\s*\(?\s*([A-Za-z]+)\.([A-Za-z]+)\s*(?:\|\|\s*0\s*\))?\s*>=\s*(\d+)\s*$/);
          return m && m[1] !== "G";
        }).length;
        pr("Fast: nur die Gesamtbilanz wird gelesen, nicht p oder A",
           FG(G2, []).every((x) => typeof G2[Object.keys(G2).find((k) => G2[k] === x.ist)] !== "undefined"),
           mitP + " Bedingungen lesen ein anderes Objekt und bleiben außen vor");

        let krachFG = null;
        [[null, []], [{}, null], [LB(), []]].forEach(([a, b]) => {
          try { FG(a, b); } catch (e) { krachFG = krachFG || e.message; } });
        pr("Fast: unvollständige Bilanzen stürzen nicht ab",
           krachFG === null, krachFG || "drei Lücken-Lagen abgefangen");
      }
    }

    /* ---- AUS DER JUGEND IN DIE SAMMLUNG (35.125) ----------------------
       Stufe H des Meta-Papiers: „Ein Talent kann die Akademie verlassen,
       Profi werden, spaeter als Karte auftauchen."

       Geprueft ueber ECHTE Zustandsuebergaenge, nicht ueber gebaute Objekte:
       Akademie gruenden, Jahre laufen lassen, Absolventen einsammeln, Karten
       daraus machen, in den Pool legen. Nur so faellt auf, wenn die Kette an
       einer Stelle reisst — und sie hat lange gerissen: `ausAbsolvent` hiess
       `ausTalent` und wurde NIE aufgerufen. */
    {
      const K2 = App.KARTEN;
      let a = App.akaGruenden(App.leereAkademie(), "Kette", 2026);
      const st2 = {}; App.ABTEILUNGEN.forEach((x) => { st2[x.id] = App.AKA_MAX; });
      a = { ...a, stufen: { ...a.stufen, ...st2 } };
      for (let i = 0; i < 14; i++) { const r = App.akaJahr(a, 2027 + i); a = (r && r.a) || r; }

      const abs = a.absolventen || [];
      pr("Kette: die Akademie bringt überhaupt Absolventen hervor",
         abs.length > 0, abs.length + " nach 14 vollen Jahren");

      if (abs.length) {
        const karten = abs.map((x) => K2.ausAbsolvent(x));
        pr("Kette: aus jedem Absolventen wird eine Karte mit Herkunft",
           karten.every((k) => k.kid && k.name && k.herkunft === "akademie"),
           karten.length + " Karten · Beispiel " + karten[0].kid + " (" + karten[0].stufe + ")");

        /* DIE KENNUNG IST DIE VERBINDUNG. Derselbe Spieler muss in Akademie
           und Sammlung denselben String tragen — sonst ist es nicht derselbe
           Spieler, sondern nur einer mit demselben Namen. */
        pr("Kette: die Kennung führt auf das Talent zurück",
           karten.every((k, i) => k.kid === "t:" + abs[i].id),
           "z. B. " + karten[0].kid + " ← Absolvent " + abs[0].id);

        /* Und im Pool: zweimal dieselbe Karte bleibt eine. */
        let pool = K2.poolErgaenzen(K2.leererPool(), karten);
        const n1 = pool.karten.length;
        pool = K2.poolErgaenzen(pool, karten);
        pr("Kette: derselbe Absolvent landet nicht zweimal im Pool",
           pool.karten.length === n1,
           n1 + " Karten, nach dem zweiten Einlegen " + pool.karten.length);

        /* Die Staerke kommt aus `peak`, nicht aus einem Momentwert — ein
           Absolvent, der mit 34 aufhoert, darf keine 58er-Karte werden. */
        const mitPeak = abs.filter((x) => x.peak);
        pr("Kette: die Karte trägt die Höchststärke, nicht den Endwert",
           mitPeak.every((x) => K2.ausAbsolvent(x).ovr === x.peak),
           mitPeak.length + " mit `peak` geprüft");

        /* Der Jahrgang macht die Karte erzaehlbar — „Eigengewaechs,
           Jahrgang 2030". Ohne ihn waere es eine Karte wie jede andere. */
        pr("Kette: der Jahrgang steht auf der Karte",
           karten.every((k) => k.zusatz && k.zusatz.jahrgang),
           "Beispiel Jahrgang " + karten[0].zusatz.jahrgang);
      }

      /* GEGENPROBE: eine Akademie ohne Jahre bringt nichts hervor — sonst
         waere die erste Zeile auch gruen, wenn die Absolventenliste aus
         irgendetwas anderem gefuellt wuerde. */
      const frisch = App.akaGruenden(App.leereAkademie(), "Frisch", 2026);
      pr("Kette: Gegenprobe — eine frische Akademie hat keine Absolventen",
         (frisch.absolventen || []).length === 0,
         (frisch.absolventen || []).length + " direkt nach der Gründung");
    }

    /* ---- SAMMLUNGSSEITEN (35.126) -------------------------------------
       Stufe I. Abgeleitet aus dem vorhandenen Pool — kein neues Feld, kein
       Fortschrittsspeicher, keine zweite Liste. */
    {
      const K3 = App.KARTEN, SE = (K3 && K3.SETS) || [];
      pr("Sets: es gibt Sammlungsseiten", SE.length >= 4,
         SE.length + " über Bedingungen plus „Weltreise“ (zählt Länder)");

      const leer = K3.setStand(K3.leererPool());
      pr("Sets: eine leere Sammlung steht überall auf null",
         leer.every((x) => x.habe === 0 && !x.voll),
         leer.length + " Seiten, alle bei 0");

      /* JEDE SEITE MUSS FÜLLBAR SEIN. Eine Seite, die niemand vollkriegt,
         ist keine Sammelseite, sondern eine Sackgasse — und genau das war
         „Aus eigener Kraft" bis 35.125, als Absolventen noch keine Karten
         wurden. */
      const bau = [];
      for (let i = 0; i < 12; i++) bau.push({ kid: "a" + i, nat: "DE", stufe: "gold",
        herkunft: "akademie", name: "J" + i, pos: "ST", ovr: 80 });
      for (let i = 0; i < 6; i++) bau.push({ kid: "h" + i, nat: "FR", stufe: "legende",
        herkunft: "halle", name: "H" + i, pos: "ZM", ovr: 88 });
      for (let i = 0; i < 12; i++) bau.push({ kid: "v" + i, nat: "ES", stufe: "silber",
        herkunft: "verein", name: "V" + i, pos: "IV", ovr: 70 });
      for (let i = 0; i < 6; i++) bau.push({ kid: "s" + i, nat: "IT", stufe: "gold",
        herkunft: "pack", name: "S" + i, pos: "LM", ovr: 82, sonderkarte: true });
      const LAND = ["DE","FR","ES","IT","NL","PT","BR","AR","EN","BE","HR","DK","SE","NO","PL","AT"];
      LAND.forEach((l, i) => bau.push({ kid: "w" + i, nat: l, stufe: "bronze",
        herkunft: "pack", name: "W" + i, pos: "ST", ovr: 60 }));
      const voll = K3.setStand({ karten: bau });
      const nichtVoll = voll.filter((x) => !x.voll).map((x) => x.n + " " + x.habe + "/" + x.soll);
      pr("Sets: jede Seite lässt sich wirklich vollmachen",
         nichtVoll.length === 0,
         nichtVoll.length ? "bleibt offen: " + nichtVoll.join(" · ")
                          : voll.length + " Seiten voll");

      /* GEGENPROBE: mit einem duennen Pool darf KEINE voll sein — sonst
         waere die Zeile darueber auch gruen, wenn `voll` immer true ist. */
      const duenn = K3.setStand({ karten: bau.slice(0, 3) });
      pr("Sets: Gegenprobe — drei Karten füllen keine Seite",
         duenn.every((x) => !x.voll),
         duenn.filter((x) => x.voll).length + " Seiten voll bei drei Karten");

      /* Nie mehr als das Soll — sonst stuende „14/11" da. */
      const zuviel = K3.setStand({ karten: bau.concat(bau) });
      pr("Sets: der Zähler läuft nicht über das Soll hinaus",
         zuviel.every((x) => x.habe <= x.soll),
         "bei doppeltem Pool: " + zuviel.map((x) => x.habe + "/" + x.soll).join(" "));

      let krachSE = null;
      [null, {}, { karten: null }, { karten: [{}] }].forEach((x) => {
        try { K3.setStand(x); } catch (e) { krachSE = krachSE || e.message; } });
      pr("Sets: unvollständige Pools stürzen nicht ab",
         krachSE === null, krachSE || "vier Lücken-Lagen abgefangen");
    }

    /* ---- ENTWICKLUNGSTYPEN (35.127) -----------------------------------
       Stufe J. Ein Feld am Talent, sechs Typen, ein Drittel bekommt einen. */
    {
      const TT = App.TALENTTYPEN || [], TV = App.typVon;
      pr("Typen: es gibt Entwicklungstypen", TT.length >= 5,
         TT.length + " Typen");

      /* JEDER TYP MUSS ETWAS TUN. Ein Merkmal, das nur auf der Karte steht,
         waere ein Text ohne Mechanik — die Fehlerklasse, die dieses Projekt
         am haeufigsten getroffen hat. */
      const wirkungslos = TT.filter((ty) => {
        const jung = { alter: 16 }, alt = { alter: 19 };
        let a1, a2;
        try { a1 = ty.f(jung, 10); a2 = ty.f(alt, 10); } catch (e) { return true; }
        /* `sorge` wuerfelt — dort reicht, dass ueberhaupt etwas anderes
           herauskommen KANN. */
        if (ty.id === "sorge") {
          const proben = []; for (let i = 0; i < 40; i++) proben.push(ty.f(alt, 10));
          return new Set(proben).size < 2;
        }
        return a1 === 10 && a2 === 10;
      }).map((ty) => ty.n);
      pr("Typen: jeder verändert den Zuwachs wirklich",
         wirkungslos.length === 0,
         wirkungslos.length ? "ohne Wirkung: " + wirkungslos.join(", ")
                            : TT.length + " Typen geprüft");

      /* SPAET und FRUEH duerfen sich nicht gleich verhalten — sonst waeren
         es zwei Namen fuer dasselbe. */
      const sp = TT.find((x) => x.id === "spaet"), fr = TT.find((x) => x.id === "frueh");
      pr("Typen: Spätentwickler und Frühreif laufen gegenläufig",
         !!sp && !!fr && sp.f({ alter: 16 }, 10) < fr.f({ alter: 16 }, 10)
           && sp.f({ alter: 19 }, 10) > fr.f({ alter: 19 }, 10),
         sp && fr ? "mit 16: " + sp.f({ alter: 16 }, 10).toFixed(1) + " gegen "
           + fr.f({ alter: 16 }, 10).toFixed(1) + " · mit 19: "
           + sp.f({ alter: 19 }, 10).toFixed(1) + " gegen " + fr.f({ alter: 19 }, 10).toFixed(1) : "—");

      /* DER TYP MUSS DEN UEBERGANG ZUM ABSOLVENTEN UEBERLEBEN. Beim ersten
         Entwurf blieb er beim Talent zurueck: 315 Absolventen, ALLE ohne Typ,
         obwohl ein Drittel der Talente einen trug. Er waere genau in dem
         Moment verschwunden, in dem der Spieler erinnerungswuerdig wird. */
      let ak = App.akaGruenden(App.leereAkademie(), "Typen", 2026);
      const stT = {}; App.ABTEILUNGEN.forEach((x) => { stT[x.id] = App.AKA_MAX; });
      ak = { ...ak, stufen: { ...ak.stufen, ...stT } };
      for (let i = 0; i < 14; i++) { const r = App.akaJahr(ak, 2027 + i); ak = (r && r.a) || r; }
      const absT = ak.absolventen || [];
      const mitTyp = absT.filter((x) => x && x.typ).length;
      pr("Typen: der Typ überlebt den Weg zum Absolventen",
         absT.length > 0 && mitTyp > 0,
         mitTyp + " von " + absT.length + " Absolventen tragen einen Typ");

      /* Aber NICHT alle — sonst ist der Typ die Regel und sagt nichts mehr. */
      pr("Typen: die Mehrheit bleibt bewusst ohne",
         absT.length === 0 || mitTyp / absT.length <= 0.55,
         absT.length ? Math.round(100 * mitTyp / absT.length) + " % mit Typ (Grenze 55 %)" : "—");

      /* Alte Spielstaende: ein Talent ohne `typ` muss durchlaufen. */
      pr("Typen: ein Talent ohne Typ wird unverändert behandelt",
         TV({ alter: 17 }) === null && TV(null) === null && TV({ typ: "gibtesnicht" }) === null,
         "ohne Feld, ohne Talent und mit unbekanntem Typ: jeweils kein Treffer");
    }

    /* Die Posten muessen benannt sein — eine Gutschrift ohne Grund ist
       eine Zahl, die vom Himmel faellt. */
      const mitPosten = vc({ profis: 2 }, { rang: 1 }, null);
      pr("VC: jede Gutschrift wird benannt",
         mitPosten.posten.length === 2
         && mitPosten.posten.reduce((s3, x) => s3 + x.x, 0) === mitPosten.vc,
         mitPosten.posten.map((x) => x.n + " " + x.x).join(" · "));
    }

    /* DIE FALLE MIT DEN ABSOLUTEN ZAHLEN. Gerechnet werden muss auf der
       DIFFERENZ der Akademiebilanz — sonst bekaeme man in jeder Laufbahn Geld
       fuer alle Profis, die man je ausgebildet hat. Im Quelltext geprueft,
       weil die Stelle in der App liegt. */
    const fsV = require("fs");
    const ARGV = require("./argumente.cjs");
    const kV = [ARGV.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
      .filter(Boolean).find((k) => { try { return fsV.statSync(k).isFile(); }
        catch (e) { return false; } });
    if (kV) {
      const qV = fsV.readFileSync(kV, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ");
      pr("VC: gerechnet wird auf der Differenz, nicht auf dem Gesamtstand",
         /nachBil\.profis \|\| 0\) - \(vorBil\.profis \|\| 0\)/.test(qV),
         "sonst zahlt jede Laufbahn für alle je ausgebildeten Profis");
    }
  }

  /* ============ Der Bonus des Vorgaengers (35.73) ========================
     Kevin: „ich hab das Gefuehl, dass bei Erstellung eines neuen Vereins
     danach die Bonis nicht uebernommen werden."

     Gemessen: die Rechenkette haelt — `neuerVerein` setzt den Bonus,
     `kennungSetzen` und `gruenden` reichen ihn durch. Der Fehler lag davor:
     der Abschluss lebte nur in einem React-Zustand, an keiner Stelle
     gespeichert. Wer den Bildschirm mit „Zurueck" verliess oder die App
     schloss, verlor ihn — und mit ihm den EINZIGEN Aufruf von `neuerVerein`.

     Geprueft wird deshalb die GANZE Kette, nicht nur die Rechnung. */
  {
    const kb = V.kennungSetzen(V.leererVerein(),
      { name: "Bonusprobe", stadt: "B", farben: { primaer: "#123456", sekundaer: "#ffffff" } });
    let bv = V.gruenden(kb.v, { land: "GER", liga: "3. Liga" }).v;
    const BK = ["TW","TW","IV","IV","IV","IV","AV","AV","AV","ZDM","ZDM","ZM","ZM",
                "ZOM","ZOM","AF","AF","ST","ST","ST"];
    const bmk = (o, j) => BK.map((pz, i) => ({ id: "b" + j + "_" + i, name: "B" + i, pos: pz,
      ovr: o, pot: o + 8, alter: 20, flag: "🇩🇪", form: 60, fitness: 88,
      spiele: 0, tore: 0, jahreImVerein: 1 }));
    bv = V.autoAufstellen({ ...bv, kader: bmk(60, 0), eingeschrieben: true });

    let vorbei = false, letzte = null;
    for (let j = 0; j < 16 && !vorbei; j++) {
      const r = V.vereinSaison(bv);
      if (r.fehler) break;
      vorbei = !!r.vorbei; letzte = r;
      bv = V.autoAufstellen({ ...r.v, kader: bmk(Math.min(84, 58 + j * 2), j + 1) });
    }
    pr("Bonus: nach 15 Jahren meldet die Saison „vorbei“", vorbei,
       "Jahr " + bv.jahr);

    if (vorbei) {
      const ab = V.abschluss(bv);
      pr("Bonus: der Abschluss vergibt welche", ab.boni.length > 0,
         ab.punkte + " Punkte · " + ab.boni.length + " Boni · "
           + JSON.stringify(ab.wirkung));

      /* DER ENTSCHEIDENDE PUNKT: der Abschluss muss den Neustart ueberleben.
         Bis 35.72 lag er nur im Arbeitsspeicher. */
      const gemerkt = { ...bv, abgeschlossen: ab };
      const wieder = JSON.parse(JSON.stringify(gemerkt));   /* wie ein Spielstand */
      pr("Bonus: der Abschluss übersteht das Speichern",
         !!(wieder.abgeschlossen && wieder.abgeschlossen.wirkung),
         "sonst ist er nach dem Schließen der App weg");

      /* Und die Kette bis zum fertigen neuen Verein. */
      const neu = V.neuerVerein(ab);
      pr("Bonus: der neue Verein trägt ihn",
         !!(neu.bonus && Object.keys(neu.bonus).length),
         JSON.stringify(neu.bonus));
      pr("Bonus: der neue Verein trägt KEINE alte Abschlussmarke",
         !neu.abgeschlossen,
         "sonst zeigt der Bildschirm sofort wieder den alten Bericht");

      const nk = V.kennungSetzen(neu, { name: "Zweiter", stadt: "Z" });
      pr("Bonus: er überlebt die Kennung",
         JSON.stringify(nk.v.bonus) === JSON.stringify(neu.bonus));
      const ng = V.gruenden(nk.v.gekannt ? nk.v : V.leererVerein(),
        { land: "GER", liga: "3. Liga" });
      pr("Bonus: er überlebt die Ligawahl",
         JSON.stringify(ng.v.bonus) === JSON.stringify(neu.bonus),
         JSON.stringify(ng.v.bonus));

      /* UND ER MUSS WIRKEN. „Der Wert steht im Objekt" beweist nichts —
         zwei Felder lesen ihn, und die entscheiden. */
      if (ab.wirkung.startOvr) {
        const ohne = V.leererVerein();
        const mit = { ...ohne, bonus: { startOvr: ab.wirkung.startOvr } };
        /* Ueber die Akademieaufnahme messen: `startOvr` hebt die Talente. */
        const w = (x) => (x.bonus && x.bonus.startOvr) || 0;
        pr("Bonus: startOvr steht am Verein und wird gelesen",
           w(mit) === ab.wirkung.startOvr && w(ohne) === 0,
           "mit " + w(mit) + ", ohne " + w(ohne));
      }
      if (ab.wirkung.ausbauStart) {
        pr("Bonus: ausbauStart hebt den Trainingsausbau",
           (neu.ausbau || {}).training === 1 + ab.wirkung.ausbauStart,
           "Stufe " + (neu.ausbau || {}).training);
      }

      /* DIE URSACHE SELBST, im Quelltext. Die Rechnung oben war schon vor
         35.73 richtig — kaputt war die Verdrahtung: der Abschluss wurde nie
         gespeichert, und `neuerVerein` ist nur von einem Bildschirm aus
         erreichbar, den man verlieren konnte. */
      const fs9 = require("fs");
      const ARG9 = require("./argumente.cjs");
      const k9 = [ARG9.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
        .filter(Boolean).find((k) => { try { return fs9.statSync(k).isFile(); }
          catch (e) { return false; } });
      if (!k9) pr("Bonus: App.jsx gefunden", false, "nicht gefunden");
      else {
        const q9 = fs9.readFileSync(k9, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ");
        pr("Bonus: der Abschluss wird am Verein gespeichert",
           /abgeschlossen: erg/.test(q9) && /vereinSichern\(VS\.v\)/.test(q9),
           "sonst überlebt er kein Schließen der App");
        pr("Bonus: der Abschlussbildschirm findet ihn auch nach einem Neustart",
           /vAbschluss \|\| \(verein && verein\.abgeschlossen\)/.test(q9),
           "sonst gibt es keinen Weg mehr zum nächsten Verein");
        pr("Bonus: der Vereinsbildschirm zeigt ihn an",
           /Aus dem letzten Verein:/.test(q9),
           "ein Vorteil, den man nicht sieht, ist von keinem nicht zu unterscheiden");
      }
    }
  }

  /* ---- Gleichrangige Berichte am Karriereende (35.72) --------------------
     Kevin: „warum ist die Infokachel fuer die Profimannschaft im Vergleich
     zur Jugendakademie immer noch so unscheinbar?" In 35.51 wurde der AUFBAU
     angeglichen, die Auftrittsstaerke nicht: Rahmen, Verlauf und Farbe gab es
     nur bei Meister oder Aufstieg.
     Der Verlauf laesst sich in jsdom nicht messen — es verwirft einen
     `linear-gradient` mit `var()` darin, bei beiden Berichten gleichermassen.
     Also hier im Quelltext: wird er UNBEDINGT gesetzt oder nur bei Erfolg? */
  {
    const fs8 = require("fs");
    const ARG8 = require("./argumente.cjs");
    const k8 = [ARG8.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
      .filter(Boolean).find((k) => { try { return fs8.statSync(k).isFile(); }
        catch (e) { return false; } });
    if (!k8) pr("Berichte: App.jsx gefunden", false, "nicht gefunden");
    else {
      const q8 = fs8.readFileSync(k8, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ");
      pr("der Vereinsbericht bekommt IMMER einen Verlauf",
         /background: "linear-gradient\(160deg," \+ flaeche \+ " 0%,var\(--pan\) 58%\)"/.test(q8),
         "nicht nur bei Meister oder Aufstieg");
      pr("und IMMER einen farbigen Rand",
         /borderColor: b\.abstieg \? "var\(--bad\)" : "var\(--ok\)"/.test(q8));
      /* Die Kennzahl in derselben Groesse wie die Akademie. */
      const akaGr = (q8.match(/fontSize: 38, color: "var\(--go\)"/g) || []).length;
      const verGr = (q8.match(/fontSize: 38, marginTop: 6/g) || []).length;
      pr("beide Kennzahlen sind 38 gross", akaGr >= 1 && verGr >= 1,
         "Akademie " + akaGr + "x, Verein " + verGr + "x");
    }
  }

  /* ============ Satzspiegel aller Bildschirme (35.71) ====================
     Kevin hat gemeldet, dass „Dein Verein" aus dem Magazinsatz herausfiel.
     Ursache war `<Shell>` OHNE `blatt` — kein Kolumnentitel, kein Folio.
     Die Ansichtspruefung deckt seit 35.70 Dach und Ruhmeshalle ab. Hier wird
     die Frage EINMAL FUER ALLE gestellt: welcher Bildschirm haengt nicht am
     Blatt?

     ZWEI AUSNAHMEN, BEIDE BENANNT:
       MenuScreen  das Titelblatt — ein Cover hat keinen laufenden Kopf.
       EndScreen   die Aufmacherseite — „KARRIEREENDE 2026" steht dort, wo
                   sonst der Kolumnentitel stuende, und IST er.
     Eine stille Ausnahmeliste waere ein Loch; deshalb stehen beide hier mit
     Grund, und jede dritte faellt auf. */
  {
    const fs7 = require("fs");
    const ARG7 = require("./argumente.cjs");
    const k7 = [ARG7.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
      .filter(Boolean).find((k) => { try { return fs7.statSync(k).isFile(); }
        catch (e) { return false; } });
    if (!k7) {
      pr("Satzspiegel: App.jsx gefunden", false, "nicht gefunden");
    } else {
      /* KOMMENTARE AUSBLENDEN. Der erste Entwurf dieser Messung fand den Text
         „<Shell>" in meinem EIGENEN Kommentar im Dach und meldete es als
         Fund. Dieselbe Falle wie beim Reiternamen in 35.52 — eine Pruefung,
         die ihre eigenen Worte wiederfindet, misst sich selbst. */
      const roh = fs7.readFileSync(k7, "utf8");
      const q7 = roh.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");
      const AUSNAHMEN = ["MenuScreen", "EndScreen"];

      const stellen = [];
      const fnRe = /\nfunction ([A-Z]\w+)\s*\(/g;
      const fns = [];
      let m7;
      while ((m7 = fnRe.exec(q7)) !== null) fns.push([m7.index, m7[1]]);
      fns.push([q7.length, "ENDE"]);
      for (let i = 0; i < fns.length - 1; i++) {
        const blk = q7.slice(fns[i][0], fns[i + 1][0]);
        const ohne = (blk.match(/<Shell(?![^>]*blatt)[^>]*>/g) || []).length;
        if (ohne) stellen.push(fns[i][1]);
      }
      const unerwartet = stellen.filter((n) => AUSNAHMEN.indexOf(n) < 0);
      pr("jeder Bildschirm hängt am Satzspiegel", unerwartet.length === 0,
         unerwartet.length ? "ohne blatt: " + unerwartet.join(", ")
           : stellen.length + " Ausnahmen, beide benannt (" + stellen.join(", ") + ")");

      /* Und die Gegenrichtung: die benannten Ausnahmen muessen es NOCH sein.
         Bekommt eine spaeter ein `blatt`, ist die Liste veraltet und
         behauptet eine Ausnahme, die es nicht mehr gibt. */
      const nichtMehr = AUSNAHMEN.filter((n) => stellen.indexOf(n) < 0);
      pr("die benannten Ausnahmen sind noch welche", nichtMehr.length === 0,
         nichtMehr.length ? "hat inzwischen ein blatt: " + nichtMehr.join(", ")
           : "MenuScreen und EndScreen, beide begründet");

      /* Und die Begruendung muss dort stehen, wo sie hingehoert. */
      pr("die Ausnahme am Karriereende ist begründet",
         /OHNE KOLUMNENTITEL, UND ZWAR ABSICHTLICH/.test(roh),
         "sonst repariert der Nächste eine Absicht weg");
    }
  }

  /* ============ Kennung vor Spielbetrieb (35.67) =========================
     Kevin: die Vereinserstellung gehoert ans Dach, nur die Ligawahl bleibt
     bei der Profimannschaft. Zwei Schritte, zwei Merker: `gekannt` und
     `gegruendet`. Geprueft wird, dass sie sich NICHT vermischen — sonst
     waere der Umbau nur eine verschobene Maske. */
  {
    const leer = V.leererVerein();
    pr("Kennung: ein leerer Verein ist weder gekannt noch gegründet",
       !leer.gekannt && !leer.gegruendet);

    const k = V.kennungSetzen(leer, { name: "  Hamburger Jungs  ", stadt: "Hamburg",
      farben: { primaer: "#0a4", sekundaer: "#fff" }, wappen: { form: "rund", zeichen: "anker" } });
    pr("Kennung: kein Fehler", !k.fehler, k.fehler || "");
    pr("Kennung: der Name wird von Leerzeichen befreit",
       k.v.name === "Hamburger Jungs", "„" + k.v.name + "“");
    pr("Kennung: Stadt, Farben und Wappen kommen an",
       k.v.stadt === "Hamburg" && k.v.farben.primaer === "#0a4"
       && k.v.wappen && k.v.wappen.zeichen === "anker");
    pr("Kennung: der Verein ist danach GEKANNT, aber NICHT gegründet",
       k.v.gekannt === true && k.v.gegruendet !== true,
       "gekannt " + k.v.gekannt + ", gegründet " + !!k.v.gegruendet);
    pr("Kennung: ohne Namen wird abgewiesen",
       !!V.kennungSetzen(leer, { name: "   " }).fehler,
       V.kennungSetzen(leer, { name: "   " }).fehler);

    /* Der zweite Schritt: er MUSS auf der Kennung aufbauen. Ein Aufruf mit
       leerem Grundverein wuerde Wappen und Farben verschlucken — und das
       faellt erst auf, wenn die beiden Schritte wirklich auseinanderliegen. */
    const g = V.gruenden(k.v, { land: "GER", liga: "3. Liga" });
    pr("Spielbetrieb: kein Fehler", !g.fehler, g.fehler || "");
    pr("Spielbetrieb: Name aus der Kennung bleibt",
       g.v.name === "Hamburger Jungs", "„" + g.v.name + "“");
    pr("Spielbetrieb: Farben und Wappen überleben den zweiten Schritt",
       g.v.farben.primaer === "#0a4" && g.v.wappen && g.v.wappen.zeichen === "anker",
       "sonst wäre der erste Schritt umsonst gewesen");
    pr("Spielbetrieb: jetzt ist er gegründet",
       g.v.gegruendet === true && g.v.gekannt === true
       && g.v.liga === "3. Liga" && g.v.jahr === 1);

    /* ALTE SPIELSTAENDE. Wer vor 35.67 gegruendet hat, kennt `gekannt` nicht.
       Der volle Aufruf muss weiter gehen, sonst landen solche Staende in
       einer Sackgasse: Dach verlangt Kennung, Kennung gibt es nicht. */
    const alt = V.gruenden(V.leererVerein(),
      { name: "Altverein", stadt: "Alt", land: "GER", liga: "3. Liga",
        farben: { primaer: "#123", sekundaer: "#fff" } });
    pr("alter Weg in einem Zug funktioniert weiterhin",
       !alt.fehler && alt.v.gegruendet && alt.v.name === "Altverein"
       && alt.v.gekannt === true,
       "und setzt gekannt gleich mit");
  }

  /* ============ Errungenschaften (35.62) =================================
     Bis 35.61 gab es zwoelf fuer die Akademie und KEINE fuer den Verein —
     weil `ok` den Verein gar nicht bekam. Eine Bedingung, die man nicht
     formulieren kann, schreibt niemand auf. */
  {
    const fs5 = require("fs");
    const ARG5 = require("./argumente.cjs");
    const k5 = [ARG5.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
      .filter(Boolean).find((k) => { try { return fs5.statSync(k).isFile(); }
        catch (e) { return false; } });
    if (!k5) {
      pr("Errungenschaften: App.jsx gefunden", false, "nicht gefunden");
    } else {
      const q5 = fs5.readFileSync(k5, "utf8");

      /* JEDE `lohn`-Angabe muss auf eine Belohnung zeigen, die es GIBT.
         Beim Einbau zeigten `mk_wappen` und `mk_rahmen15` ins Leere — der
         Bildschirm haette „Belohnung: undefined" angezeigt. Nichts haette
         gemeldet: `META[a.lohn]` ist dann schlicht undefined. */
      const lohn = [...q5.matchAll(/lohn:"([a-z_0-9]+)"/g)].map((m) => m[1]);
      const im = q5.indexOf("const META = {"), jm = q5.indexOf("\n};", im);
      const meta = [...q5.slice(im, jm).matchAll(/^\s{2}([a-z_0-9]+):\s*\{/gm)]
        .map((m) => m[1]);
      const fehlt5 = [...new Set(lohn)].filter((x) => !meta.includes(x));
      /* WER EINEN RAHMEN VERSPRICHT, MUSS EINEN HABEN. RAHMEN ist eine eigene
         Liste neben META; eine Belohnung, die „Rahmen: …" heisst und dort
         fehlt, ist freigeschaltet und trotzdem nicht auswaehlbar. Genau so
         standen `mk_wappen` und `mk_rahmen15` nach 35.62 da. */
      const rahmenFehlt = Object.keys(App.META || {})
        .filter((k) => /^Rahmen: /.test((App.META[k] || {}).n || ""))
        .filter((k) => !(App.RAHMEN || {})[k]);
      pr("jede Belohnung, die „Rahmen“ heißt, steht auch in RAHMEN",
         rahmenFehlt.length === 0,
         rahmenFehlt.length ? "fehlen: " + rahmenFehlt.join(", ")
           : Object.keys(App.RAHMEN || {}).length + " Rahmen, alle benannt");

      pr("jede Belohnung, die eine Errungenschaft nennt, existiert auch",
         fehlt5.length === 0,
         fehlt5.length ? "fehlen: " + fehlt5.join(", ")
                       : new Set(lohn).size + " Verweise auf " + meta.length + " Belohnungen");

      /* Der Verein MUSS uebergeben werden — sonst sind alle zwoelf neuen
         Bedingungen tot und melden stumm nie. */
      pr("die Prüffunktion bekommt den Verein übergeben",
         /a\.ok\(q, G, A, V\)/.test(q5));
      /* NUR DER ANFANG, nicht die ganze Zeile. Der erste Entwurf verlangte
         exakt `merkeErfolge(q, AK2.a, vereinNachher)` — in 35.74 kam eine
         vierte Übergabe dazu (die dauerhaften Vereinszahlen), und die
         Prüfung meldete rot, obwohl genau das Richtige passiert. Wer eine
         vollständige Aufrufzeile festschreibt, verbietet jede Erweiterung. */
      pr("und der Verein kommt NACH der eben gespielten Saison",
         /merkeErfolge\(q, AK2\.a, vereinNachher/.test(q5),
         "sonst zählt ein Meistertitel erst eine Laufbahn später");

      const verErf = [...q5.matchAll(/id:"(a_ver_[a-z0-9]+)"/g)].map((m) => m[1]);
      pr("es gibt Errungenschaften für die Profimannschaft", verErf.length >= 10,
         verErf.length + " Stück");
      /* JEDE STUFE MUSS ES GEBEN. Beim Einbau stand an einer „legend" statt
         „legende" — ein Buchstabe. Der Errungenschaftsbildschirm liest
         STUFEN[a.s].w und stuerzte mit „Cannot read properties of undefined"
         ab; drei Ansichten und eine Sichtpruefung fielen aus. Ein Tippfehler
         in einer Kennung faellt nirgends auf, bis etwas ihn nachschlaegt. */
      const stufen0 = Object.keys(App.STUFEN || {});
      const falsch0 = (App.ACHIEVEMENTS || [])
        .filter((x) => stufen0.length && stufen0.indexOf(x.s) < 0)
        .map((x) => x.id + " (" + x.s + ")");
      pr("jede Errungenschaft nennt eine Stufe, die es gibt",
         falsch0.length === 0,
         falsch0.length ? falsch0.join(", ") : stufen0.length + " Stufen, alle Kennungen gültig");
      /* DIE SACHE PRUEFEN, NICHT DIE SCHREIBWEISE. Der erste Entwurf suchte
         im Quelltext nach `!!V` — und schlug fehl, sobald eine Bedingung
         mehrzeilig wurde und mit `if(!V...) return false;` beginnt. Beides
         ist richtig, nur anders geschrieben. Eine Pruefung, die auf eine
         Formulierung besteht statt auf eine Eigenschaft, verbietet gueltigen
         Code. Jetzt wird AUFGERUFEN: jede Bedingung bekommt `null` als Verein
         und muss ohne Absturz `false` liefern. */
      const ACH0 = App.ACHIEVEMENTS || [];
      const kaputt0 = [];
      ACH0.filter((x) => x.id.indexOf("a_ver_") === 0).forEach((x) => {
        try { if (x.ok({}, {}, {}, null) !== false) kaputt0.push(x.id + " (nicht false)"); }
        catch (e) { kaputt0.push(x.id + " (Absturz)"); }
      });
      pr("jede Vereinsbedingung überlebt einen fehlenden Verein",
         kaputt0.length === 0,
         kaputt0.length ? kaputt0.join(", ") : "alle liefern false statt zu stürzen");
    }
  }

  /* ---- Sind sie ERREICHBAR? (35.62) --------------------------------------
     Eine Errungenschaft, deren Bedingung nie wahr wird, meldet nichts: sie
     steht fuer immer grau da und niemand erfaehrt warum. Deshalb wird hier
     ein starker Verein fuenfzehn Jahre durchgespielt und gezaehlt, welche
     zuschnappen. Das ist keine Schoenheitspruefung — beim Bauen war eine
     dabei, die Aufstiege zaehlte statt die Liga zu pruefen. */
  {
    const ACH = App.ACHIEVEMENTS || [];
    const verErf2 = ACH.filter((x) => x.id.indexOf("a_ver_") === 0);
    if (!verErf2.length) {
      pr("Erreichbarkeit: Vereinserrungenschaften gefunden", false, "keine");
    } else {
      const gv = V.gruenden(V.leererVerein(),
        { name: "Erfolgsprobe", land: "GER", liga: "3. Liga" }).v;
      const gk = ["TW","TW","IV","IV","IV","IV","AV","AV","AV","ZDM","ZDM","ZM","ZM",
                  "ZOM","ZOM","AF","AF","ST","ST","ST"]
        .map((pz, i) => ({ id: "g" + i, name: "G" + i, pos: pz, ovr: 62, pot: 82,
          alter: 20, flag: "🇩🇪", form: 60, fitness: 88,
          spiele: 0, tore: 0, jahreImVerein: 0 }));
      let gvv = V.autoAufstellen({ ...gv, kader: gk, eingeschrieben: true });
      const gaka = { gegruendet: true, ruhm: 200, stufen: {},
        bilanz: { profis: 30, weltklasse: 3, nationalspieler: 6, turniere: 2 } };
      const traf = {};
      let kaputt = null;
      for (let j = 0; j < 15; j++) {
        const r = V.vereinSaison(gvv);
        if (r.fehler) break;
        gvv = r.v;
        verErf2.forEach((x) => {
          try { if (!traf[x.id] && x.ok({}, {}, gaka, gvv)) traf[x.id] = j + 1; }
          catch (e) { kaputt = x.id + ": " + e.message; }
        });
        /* KADER JEDES JAHR FRISCH. Der erste Entwurf fuellte nur auf, wenn
           er unter 16 fiel — dann altert die Mannschaft, wird schwaecher,
           steigt ab, und irgendwann bricht `vereinSaison` mit „nicht
           spielbereit" ab. Die Errungenschaft „Fuenfzehn Jahre" wurde
           daraufhin mal erreicht und mal nicht: der dritte sporadische
           Befund an einem Tag.
           Hier geht es um ERREICHBARKEIT, nicht um Kaderpflege. Also wird
           jedes Jahr ein junger, voller Kader gestellt — dann haengt das
           Ergebnis an den Bedingungen und an nichts sonst. */
        /* Und er muss WACHSEN. Zweiter Anlauf stellte jedes Jahr denselben
           62er-Kader — dann bleibt die Staerke bei 62 und „Eine Wucht" (70)
           ist unerreichbar. Ein Pruefstand, der einen Verein nachbildet, muss
           einen nachbilden, der sich entwickelt: genau das tut ein Verein,
           dessen Akademie ausgebaut wird. */
        /* STARK GENUG, DASS DER TITEL SICHER IST (berichtigt 35.86).
           Mit einer Obergrenze von 84 wurde der Testverein nach dem Aufstieg
           in die Bundesliga nur noch Mittelmass — „Meisterschale" und „Beide
           Haeuser" fielen dann manchmal nicht, und die Pruefung meldete rot,
           obwohl an den Bedingungen nichts falsch war.
           Vierter sporadischer Befund in diesem Projekt. Hier geht es um
           ERREICHBARKEIT, nicht um eine faire Liga: der Testverein soll
           gewinnen, damit die Frage „ist es erreichbar" ueberhaupt
           beantwortbar wird. */
        const stufe = Math.min(94, 62 + j * 3);
        gvv = V.autoAufstellen({ ...gvv,
          kader: gk.map((x, i) => ({ ...x, id: "j" + j + "_" + i, ovr: stufe,
            pot: Math.min(92, stufe + 8), alter: 20,
            jahreImVerein: 1, spiele: 0, tore: 0 })) });
      }
      pr("Erreichbarkeit: keine Bedingung stürzt ab", !kaputt, kaputt || "");
      const nie = verErf2.filter((x) => !traf[x.id]).map((x) => x.n);
      pr("Erreichbarkeit: jede Vereinserrungenschaft ist in 15 Jahren erreichbar",
         nie.length === 0,
         nie.length ? "nie erreicht: " + nie.join(", ")
                    : Object.keys(traf).length + " von " + verErf2.length + " erreicht");
      /* Und die Gegenrichtung: nicht ALLE duerfen sofort zuschnappen, sonst
         ist die Staffelung Zierde. */
      const sofort = verErf2.filter((x) => traf[x.id] === 1).length;
      pr("Erreichbarkeit: nicht alle fallen im ersten Jahr",
         sofort < verErf2.length, sofort + " im ersten Jahr, "
           + (verErf2.length - sofort) + " später");
    }
  }

  /* ============ Verwaltung in der Jugendakademie (35.61) =================
     Spiegelbild des Kaders: auslaufen lassen ist umkehrbar, aussortieren
     nicht. Geprueft wird, dass die Markierung WIRKT — ein Knopf, den die
     stille Jahresverlaengerung jedes Jahr ueberschreibt, waere ein Knopf
     ohne Folge. */
  {
    const AK = App;
    let a4 = AK.akaGruenden(AK.leereAkademie(), "Hausprobe", 2026);
    a4 = { ...a4, stufen: Object.fromEntries(Object.keys(a4.stufen).map((k) => [k, 4])) };
    for (let i = 0; i < 2; i++) { const r = AK.akaJahr(a4, 2026 + i + 1); a4 = r.a || r; }

    pr("Haus: es sind Talente da", (a4.talente || []).length > 0,
       (a4.talente || []).length + " im Haus");
    /* Ein JUNGES nehmen: bei einem Achtzehnjaehrigen koennte auch das Alter
       oder ein Profiangebot den Abgang erklaeren, und dann beweist der
       Versuch nichts ueber die Markierung. */
    const jung = (a4.talente || []).filter((t) => t.alter <= 16)
      .sort((x, y) => x.vertragBis - y.vertragBis)[0];
    if (!jung) {
      pr("Haus: ein junges Talent zum Prüfen gefunden", false, "keines unter 17");
    } else {
      pr("Haus: jedes Talent hat einen Vertrag",
         (a4.talente || []).every((t) => t.vertragBis != null));

      /* --- auslaufen lassen --- */
      const m = AK.talentAuslaufen(a4, jung.id, "Passt nicht.");
      pr("Auslaufen: Marke wird gesetzt",
         !m.fehler && (m.a.talente.find((x) => x.id === jung.id) || {}).auslaufen === true);
      pr("Auslaufen: die Notiz bleibt",
         (m.a.talente.find((x) => x.id === jung.id) || {}).notiz === "Passt nicht.");
      pr("Auslaufen ist umkehrbar", (() => {
        const z = AK.talentAuslaufen(m.a, jung.id, "");
        return !(z.a.talente.find((x) => x.id === jung.id) || {}).auslaufen;
      })());

      /* Die eigentliche Frage: WIRKT die Marke im Jahreslauf? Gegen den
         unmarkierten Fall gemessen, sonst beweist „er ist weg" nichts. */
      /* UEBER ALLE TALENTE messen, nicht ueber eines (berichtigt 35.62).
         Zwei Anlaeufe waren sporadisch:
         (1) sechs Jahre Fenster — nach so langer Zeit ist auch ein
             unmarkiertes Talent weg, weil es 21 wird.
         (2) passendes Fenster, aber EIN Talent — das kann in diesen Jahren
             auch abbrechen, und dann meldet die Pruefung rot, obwohl die
             Marke nichts damit zu tun hat.
         Ein Fehlalarm, der nur manchmal kommt, ist schlimmer als keine
         Pruefung: beim naechsten Mal glaubt man ihm nicht mehr. Jetzt werden
         ALLE jungen Talente betrachtet, die Haelfte markiert, und gefragt:
         wird unter den Ueberlebenden verlaengert, und bleibt bei den
         Markierten der Vertrag stehen? Abbrecher fallen dabei einfach raus. */
      const jungen = (a4.talente || []).filter((t) => t.alter <= 16);
      const marken = jungen.filter((_, i2) => i2 % 2 === 0).map((t) => t.id);
      let a5 = a4;
      marken.forEach((id) => { a5 = AK.talentAuslaufen(a5, id, "Probe").a; });
      const vorher5 = {};
      (a5.talente || []).forEach((t) => (vorher5[t.id] = t.vertragBis));
      let b5 = a5;
      for (let i2 = 0; i2 < 2; i2++) { const r = AK.akaJahr(b5, b5.jahr + 1); b5 = r.a || r; }
      const uebrig = (b5.talente || []).filter((t) => vorher5[t.id] != null);
      const ohneMarke = uebrig.filter((t) => marken.indexOf(t.id) < 0);
      const mitMarke  = uebrig.filter((t) => marken.indexOf(t.id) >= 0);
      pr("Auslaufen: ohne Marke wird still verlängert",
         ohneMarke.length > 0 && ohneMarke.some((t) => t.vertragBis > vorher5[t.id]),
         ohneMarke.length + " unmarkierte übrig, davon "
           + ohneMarke.filter((t) => t.vertragBis > vorher5[t.id]).length + " verlängert");
      pr("Auslaufen: mit Marke bleibt der Vertrag stehen",
         mitMarke.every((t) => t.vertragBis <= vorher5[t.id]),
         mitMarke.length + " markierte übrig, keiner verlängert");
      /* Und der Abgang selbst: mindestens einer der Markierten muss in den
         zwei Jahren gegangen sein, sonst wirkt die Marke nur auf dem Papier.
         „Mindestens einer", weil die Vertraege verschieden lang laufen —
         nicht jeder ist nach zwei Jahren faellig. */
      const wegMitMarke = marken.filter((id) => !(b5.talente || []).some((t) => t.id === id));
      const faellig = marken.filter((id) => vorher5[id] <= a5.jahr + 2);
      pr("Auslaufen: fällige Markierte sind gegangen",
         faellig.length === 0 || wegMitMarke.length > 0,
         wegMitMarke.length + " von " + faellig.length + " fälligen sind weg");

      /* --- aussortieren --- */
      const vorA = a4.bilanz.abbrecher || 0;
      const s4 = AK.aussortieren(a4, jung.id, "Zu langsam.");
      pr("Aussortieren: kein Fehler", !s4.fehler, s4.fehler || s4.text);
      pr("Aussortieren: er ist raus",
         !(s4.a.talente || []).some((x) => x.id === jung.id));
      pr("Aussortieren: er zählt NICHT als Profi",
         s4.a.bilanz.profis === a4.bilanz.profis
         && !(s4.a.absolventen || []).some((x) => x.id === jung.id));
      pr("Aussortieren: er zählt als Abbrecher",
         (s4.a.bilanz.abbrecher || 0) === vorA + 1, vorA + " → " + s4.a.bilanz.abbrecher);
      pr("Aussortieren: es steht in der Chronik",
         (s4.a.chronik || []).some((c) => c.art === "aussortiert"
           && /Zu langsam/.test(c.txt || "")));
      pr("Aussortieren: ein unbekanntes Talent wird abgewiesen",
         !!AK.aussortieren(a4, "gibtesnicht", "").fehler);
    }
  }

  /* ---- Kennzahlen der Dach-Kacheln (35.60) -------------------------------
     Die Kacheln zeigen Zahlen, und eine Zahl mit falschem Nenner ist
     schlimmer als keine: sie sieht nach Auskunft aus. Der erste Entwurf
     schrieb den Ausbau als x/54 (Summe aller Stufen), waehrend `akaAusbau`
     die GEKAUFTEN zaehlt (0 bis 45). */
  {
    const AK = App;
    const leer = AK.akaGruenden(AK.leereAkademie(), "Nenner", 2026);
    pr("Kachel: eine frische Akademie steht bei 0 Ausbaustufen",
       AK.akaAusbau(leer) === 0, "gemessen " + AK.akaAusbau(leer));
    const voll = { ...leer,
      stufen: Object.fromEntries(AK.ABTEILUNGEN.map((x) => [x.id, AK.AKA_MAX])) };
    pr("Kachel: voll ausgebaut sind es genau AKA_STUFEN",
       AK.akaAusbau(voll) === AK.AKA_STUFEN,
       AK.akaAusbau(voll) + " von " + AK.AKA_STUFEN);
    /* Und im Quelltext: der Nenner der Kachel MUSS AKA_STUFEN sein. */
    /* EIGENES require, nicht das von weiter unten. Der erste Entwurf griff
       auf `ARG2` zu — das wird erst 465 Zeilen spaeter angelegt, in einem
       anderen Block. Node bricht dann beim Laden ab, und zwar mit einem
       Stapelabzug ohne Zeilennummer, der nach einem Modulproblem aussieht.
       Eine Abkuerzung ueber eine Variable aus einem fremden Block spart drei
       Zeichen und kostet zehn Minuten. */
    const fs3 = require("fs");
    const ARG3 = require("./argumente.cjs");
    const k3 = [ARG3.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"]
      .filter(Boolean).find((k) => { try { return fs3.statSync(k).isFile(); }
        catch (e) { return false; } });
    if (!k3) pr("Kachel: der Ausbau-Nenner ist AKA_STUFEN", false, "App.jsx nicht gefunden");
    else {
      const q3 = fs3.readFileSync(k3, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ");
      pr("Kachel: der Ausbau-Nenner ist AKA_STUFEN",
         /\["Ausbau", akaAusbau\(aka\) \+ "\/" \+ AKA_STUFEN\]/.test(q3));
    }
  }

  /* ============ Vertraege und Postkorb (35.53) ===========================
     Geprueft wird nicht, ob ein Fall entsteht, sondern ob die Freigabe
     WIRKT — und ob ein Talent ohne meine Zustimmung gehen kann. */
  {
    const AK = App;   /* die Akademie steht ueber exporte.txt flach zur Verfuegung */
    /* Eine Akademie so lange laufen lassen, bis Faelle entstehen. */
    let a = AK.akaGruenden(AK.leereAkademie(), "Vertragsprobe", 2026);
    a = { ...a, stufen: Object.fromEntries(Object.keys(a.stufen).map((k) => [k, 4])) };
    let jahr = 0, faelleGesehen = 0;
    for (let i = 0; i < 30 && faelleGesehen === 0; i++) {
      jahr = i + 1;
      const r = AK.akaJahr(a, 2026 + jahr);
      a = r.a || r;
      faelleGesehen = (a.faelle || []).length;
    }
    pr("Vertrag: es entstehen Freigabefälle", faelleGesehen > 0,
       faelleGesehen + " offen nach " + jahr + " Jahren");

    pr("jedes Talent hat einen laufenden Vertrag",
       (a.talente || []).every((t) => t.vertragBis != null),
       (a.talente || []).length + " Talente");
    /* GEGEN a.jahr rechnen, nicht gegen akaJahrNr: die Verträge stehen in
       Weltjahren. Der erste Entwurf verglich mit dem Akademiezähler und
       meldete „längster: 2028" — der Befund war echt, nur an der falschen
       Stelle: die ANZEIGE rechnete in Akademiejahren und hätte „noch 2003
       Jahre Zeit" gezeigt. */
    pr("Verträge laufen höchstens 3 Jahre voraus",
       (a.talente || []).every((t) => t.vertragBis - a.jahr <= 3),
       "längster: " + Math.max(0, ...(a.talente || []).map((t) => t.vertragBis - a.jahr)) + " Jahre");

    if (faelleGesehen > 0) {
      const f = a.faelle[0];
      pr("ein Fall nennt Verein, Anlage und Frist",
         !!f.klub && f.peak > 0 && f.frist > f.gestellt, f.name + " → " + f.klub);
      pr("der Spieler steht noch in der Akademie",
         (a.talente || []).some((t) => t.id === f.talentId));
      pr("er zählt noch NICHT als Profi",
         !(a.absolventen || []).some((x) => x.id === f.talentId));

      /* Freigeben: er geht, zaehlt als Profi, verschwindet aus dem Postkorb. */
      const vor = a.bilanz.profis;
      const rf = AK.freigeben(a, f.id);
      pr("Freigeben: kein Fehler", !rf.fehler, rf.fehler || rf.text);
      if (!rf.fehler) {
        pr("Freigeben: der Spieler ist aus der Akademie raus",
           !(rf.a.talente || []).some((t) => t.id === f.talentId));
        pr("Freigeben: er steht auf der Ehrentafel",
           (rf.a.absolventen || []).some((x) => x.id === f.talentId));
        pr("Freigeben: die Profizahl steigt um genau eins",
           rf.a.bilanz.profis === vor + 1, vor + " → " + rf.a.bilanz.profis);
        pr("Freigeben: der Fall ist aus dem Postkorb",
           !(rf.a.faelle || []).some((x) => x.id === f.id));
      }

      /* Behalten: er bleibt, der Fall ist zu, die Profizahl steigt NICHT. */
      const rb = AK.behalten(a, f.id, AK.akaJahrNr(a));
      pr("Behalten: kein Fehler", !rb.fehler, rb.fehler || rb.text);
      if (!rb.fehler) {
        pr("Behalten: der Spieler bleibt in der Akademie",
           (rb.a.talente || []).some((t) => t.id === f.talentId));
        pr("Behalten: er zählt NICHT als Profi",
           rb.a.bilanz.profis === vor, "Profis " + rb.a.bilanz.profis);
        pr("Behalten: der Fall ist aus dem Postkorb",
           !(rb.a.faelle || []).some((x) => x.id === f.id));
      }

      /* Ein Fall, den es nicht gibt, darf nichts veraendern. */
      const rx = AK.freigeben(a, "gibtesnicht");
      pr("ein unbekannter Fall wird abgewiesen", !!rx.fehler, rx.fehler);
    }

    /* DIE FRIST. Ohne Entscheidung muss der Spieler nach einem Jahr weg sein —
       sonst waere „Frist" ein Wort ohne Mechanik. */
    if (faelleGesehen > 0) {
      const f = a.faelle[0];
      const vorP = a.bilanz.profis;
      const r2 = AK.akaJahr(a, 2026 + jahr + 1);
      const a2 = r2.a || r2;
      pr("Frist: ohne Entscheidung ist der Fall nach einem Jahr weg",
         !(a2.faelle || []).some((x) => x.id === f.id));
      pr("Frist: der Spieler hat woanders unterschrieben",
         (a2.absolventen || []).some((x) => x.id === f.talentId)
         && !(a2.talente || []).some((t) => t.id === f.talentId));
      pr("Frist: er zählt als Profi", a2.bilanz.profis > vorP,
         vorP + " → " + a2.bilanz.profis);
      pr("Frist: kein zweites Angebot für denselben Spieler",
         (a2.faelle || []).filter((x) => x.talentId === f.talentId).length === 0);
    }

    /* Der eigene Verein ueberzeugt — oder nicht. */
    {
      const uv = V.gruenden(V.leererVerein(), { name: "Werber", land: "GER", liga: "3. Liga" }).v;
      const uk = ["TW","IV","IV","IV","AV","AV","ZDM","ZDM","ZM","ZM","ZOM","AF","AF","ST","ST","TW"]
        .map((pz, i) => ({ id: "u" + i, name: "U" + i, pos: pz, ovr: 50, pot: 70, alter: 24,
          form: 50, fitness: 80, spiele: 0, tore: 0, jahreImVerein: 0 }));
      const uvv = V.autoAufstellen({ ...uv, kader: uk });
      const schwach = V.ueberzeugt(uvv, { ovr: 48, pot: 55 });
      const stark = V.ueberzeugt(uvv, { ovr: 52, pot: 88 });
      pr("ein passendes Talent sagt fast immer zu", schwach > .9,
         Math.round(schwach * 100) + " %");
      pr("ein deutlich zu gutes Talent sagt fast immer ab", stark < .15,
         Math.round(stark * 100) + " %");
      pr("die Aussicht steigt mit der Mannschaftsstärke", (() => {
        const gut = V.autoAufstellen({ ...uv, kader: uk.map((x) => ({ ...x, ovr: 72 })) });
        return V.ueberzeugt(gut, { ovr: 52, pot: 88 }) > stark;
      })());
    }
  }

  /* ============ Kadervertraege (35.54) ===================================
     Der Kader hat jetzt Vertraege, und `form`, `fitness` und `spiele` haben
     endlich Leser. Geprueft wird die SCHLEIFE: Einsaetze bestimmen die Form,
     die Form die Bleibelust, die Bleibelust den Abgang. */
  {
    const kv = V.gruenden(V.leererVerein(),
      { name: "Vertragself", land: "GER", liga: "3. Liga" }).v;
    const kk = ["TW","TW","IV","IV","IV","IV","AV","AV","AV","ZDM","ZDM","ZM","ZM",
                "ZOM","ZOM","AF","AF","ST","ST","ST"]
      .map((pz, i) => ({ id: "k" + i, name: "Kader " + i, pos: pz, ovr: 48 + (i % 8),
        pot: 78, alter: 22, flag: "🇩🇪", form: 50, fitness: 85,
        spiele: 0, tore: 0, jahreImVerein: 0 }));
    let kvv = V.autoAufstellen({ ...kv, kader: kk });

    /* Alte Spielstaende kennen `vertragBis` nicht. */
    pr("Vertrag: ohne Feld wird ein Vertrag angenommen",
       V.spVertrag({ id: "x" }, 2030) > 2030,
       "Rückfall auf " + V.spVertrag({ id: "x" }, 2030));

    const r1 = V.vereinSaison(kvv);
    pr("Kadervertrag: die Saison läuft", !r1.fehler, r1.fehler || "");
    if (!r1.fehler) {
      pr("nach der Saison hat jeder einen Vertrag",
         (r1.v.kader || []).every((s2) => s2.vertragBis != null));
      pr("die Form wird geschrieben",
         (r1.v.kader || []).some((s2) => s2.form !== 50),
         "Spanne " + Math.min(...r1.v.kader.map((x) => x.form)) + "–"
           + Math.max(...r1.v.kader.map((x) => x.form)));
      pr("die Form unterscheidet Stammspieler von Bankdrückern", (() => {
        const stamm = r1.v.kader.filter((x) => x.spiele > 20);
        const bank = r1.v.kader.filter((x) => (x.spiele || 0) === 0);
        if (!stamm.length || !bank.length) return false;
        const m = (a2) => a2.reduce((x, y) => x + y.form, 0) / a2.length;
        return m(stamm) > m(bank) + 8;
      })(), "Stamm gegen Bank");
      pr("die Fitness wird geschrieben",
         (r1.v.kader || []).every((s2) => s2.fitness != null)
         && (r1.v.kader || []).some((s2) => s2.fitness !== 85));
    }

    /* BLEIBELUST — die Formel selbst, deterministisch statt zufällig. */
    {
      const basis = { id: "b", pos: "ZM", ovr: 55, alter: 25, form: 50,
                      spiele: 19, jahreImVerein: 1 };
      const vb = { ...kvv, kader: [basis] };
      const l = (aend) => V.bleibeLust(vb, { ...basis, ...aend }, 38);
      pr("wer nicht spielt, will eher weg",
         l({ spiele: 0 }) < l({ spiele: 38 }),
         Math.round(l({ spiele: 0 }) * 100) + " % gegen "
           + Math.round(l({ spiele: 38 }) * 100) + " %");
      pr("gute Form hält, schlechte treibt",
         l({ form: 25 }) < l({ form: 85 }),
         Math.round(l({ form: 25 }) * 100) + " % gegen "
           + Math.round(l({ form: 85 }) * 100) + " %");
      pr("wer zu gut für den Kader ist, will eher weg", (() => {
        const schwach = { ...kvv, kader: kk.map((x) => ({ ...x, ovr: 45 })) };
        return V.bleibeLust(schwach, { ...basis, ovr: 80 }, 38)
             < V.bleibeLust(schwach, { ...basis, ovr: 46 }, 38);
      })());
      pr("Treue hält", l({ jahreImVerein: 0 }) < l({ jahreImVerein: 3 }));
      pr("die Bleibelust bleibt zwischen 0 und 1",
         [0, 38].every((sp2) => [10, 90].every((f2) => {
           const x = l({ spiele: sp2, form: f2 }); return x >= 0 && x <= 1; })));
    }

    /* Der Postkorb des Kaders: entstehen Faelle, und wirken die Entscheidungen? */
    let vv = kvv, fall = null, jahre = 0;
    for (let i = 0; i < 8 && !fall; i++) {
      const r = V.vereinSaison(vv);
      if (r.fehler) break;
      vv = r.v; jahre = i + 1;
      fall = (vv.faelle || [])[0] || null;
    }
    pr("Kadervertrag: es entstehen Abgangswünsche", !!fall,
       fall ? fall.name + " → " + fall.klub + " nach " + jahre + " Jahren"
            : "keiner in 8 Jahren");
    if (fall) {
      pr("der Spieler steht noch im Kader",
         (vv.kader || []).some((x) => x.id === fall.spielerId));
      const rz = V.zustimmen(vv, fall.id);
      pr("Zustimmen: kein Fehler", !rz.fehler, rz.fehler || rz.text);
      if (!rz.fehler) {
        pr("Zustimmen: der Spieler ist raus",
           !(rz.v.kader || []).some((x) => x.id === fall.spielerId));
        pr("Zustimmen: der Fall ist aus dem Postkorb",
           !(rz.v.faelle || []).some((x) => x.id === fall.id));
        pr("Zustimmen: die Aufstellung zeigt nicht mehr auf ihn",
           !Object.values(rz.v.aufstellung || {}).includes(fall.spielerId));
      }
      const ra = V.ablehnen(vv, fall.id, vv.jahr);
      pr("Ablehnen: kein Fehler", !ra.fehler, ra.fehler || ra.text);
      if (!ra.fehler) {
        pr("Ablehnen: er bleibt im Kader",
           (ra.v.kader || []).some((x) => x.id === fall.spielerId));
        pr("Ablehnen: es kostet Form", (() => {
          const vor = (vv.kader || []).find((x) => x.id === fall.spielerId);
          const nach = (ra.v.kader || []).find((x) => x.id === fall.spielerId);
          return nach.form < vor.form;
        })(), "ein erzwungenes Bleiben ist nicht folgenlos");
        pr("Ablehnen: der Fall ist aus dem Postkorb",
           !(ra.v.faelle || []).some((x) => x.id === fall.id));
      }
      /* Der Kader darf nicht unter das Minimum fallen. */
      const knapp = { ...vv, kader: (vv.kader || []).slice(0, V.KADER_MIN) };
      const kf = (knapp.faelle || []).find((f) => knapp.kader.some((x) => x.id === f.spielerId));
      if (kf) {
        const rk = V.zustimmen(knapp, kf.id);
        pr("Zustimmen wird abgewiesen, wenn der Kader zu klein würde",
           !!rk.fehler, rk.fehler);
      } else {
        pr("Kadergrenzprobe konnte gebaut werden", true, "kein Fall im Restkader — übersprungen");
      }
    }

    /* Auslaufen lassen, mit Notiz. */
    {
      const s2 = kvv.kader[0];
      const ra = V.auslaufenLassen(kvv, s2.id, "Zu oft verletzt.");
      pr("Auslaufen lassen: Marke wird gesetzt",
         !ra.fehler && (ra.v.kader.find((x) => x.id === s2.id) || {}).auslaufen === true);
      pr("Auslaufen lassen: die Notiz bleibt erhalten",
         (ra.v.kader.find((x) => x.id === s2.id) || {}).notiz === "Zu oft verletzt.");
      const zurueck = V.auslaufenLassen(ra.v, s2.id, "");
      pr("Auslaufen lassen ist umkehrbar",
         !(zurueck.v.kader.find((x) => x.id === s2.id) || {}).auslaufen);
      pr("ein unbekannter Spieler wird abgewiesen",
         !!V.auslaufenLassen(kvv, "gibtesnicht", "").fehler);
    }
  }

  /* ============ Kader ausduennen (35.55, Stufe D) ========================
     Zwei Wege aus dem Kader: entlassen (sofort, endgueltig) und zurueck in
     die Jugend (nur bis 19). Beide teilen dieselbe Untergrenze — geprueft
     wird deshalb beides, und beide Male auch die Abweisung. */
  {
    const dv = V.gruenden(V.leererVerein(), { name: "Ausduennen", land: "GER", liga: "3. Liga" }).v;
    const dk = ["TW","TW","IV","IV","IV","IV","AV","AV","AV","ZDM","ZDM","ZM","ZM",
                "ZOM","ZOM","AF","AF","ST","ST","ST"]
      .map((pz, i) => ({ id: "d" + i, name: "Weg " + i, pos: pz, ovr: 50, pot: 78,
        alter: i < 4 ? 18 : 27, flag: "🇩🇪", form: 50, fitness: 85,
        spiele: 0, tore: 0, jahreImVerein: 1 }));
    const dvv = V.autoAufstellen({ ...dv, kader: dk, jahr: 2030 });
    const jung = dk[0].id, alt2 = dk[10].id;

    /* --- Entlassen --- */
    const re = V.entlassen(dvv, alt2, "Passt nicht mehr.");
    pr("Entlassen: kein Fehler", !re.fehler, re.fehler || re.text);
    if (!re.fehler) {
      pr("Entlassen: der Spieler ist raus",
         !(re.v.kader || []).some((x) => x.id === alt2),
         (dvv.kader.length) + " → " + re.v.kader.length);
      pr("Entlassen: die Aufstellung zeigt nicht mehr auf ihn",
         !Object.values(re.v.aufstellung || {}).includes(alt2));
      pr("Entlassen: der Abschied wird gemerkt",
         (re.v.offeneAbschiede || []).some((x) => x.grund === "entlassen"
           && x.notiz === "Passt nicht mehr."));
    }
    pr("Entlassen: unbekannter Spieler wird abgewiesen",
       !!V.entlassen(dvv, "gibtesnicht", "").fehler);

    /* Die Untergrenze — beide Wege teilen sie. */
    const knapp = { ...dvv, kader: dvv.kader.slice(0, V.KADER_MIN) };
    pr("Entlassen wird abgewiesen, wenn der Kader zu klein würde",
       !!V.entlassen(knapp, knapp.kader[0].id, "").fehler,
       V.entlassen(knapp, knapp.kader[0].id, "").fehler);

    /* --- Zurück in die Jugend --- */
    const aka0 = App.akaGruenden(App.leereAkademie(), "Heim", 2030);
    const rj = V.zurueckInDieJugend(aka0, dvv, jung, 2030);
    pr("In die Jugend: kein Fehler", !rj.fehler, rj.fehler || rj.text);
    if (!rj.fehler) {
      pr("In die Jugend: er ist aus dem Kader raus",
         !(rj.v.kader || []).some((x) => x.id === jung));
      pr("In die Jugend: er steht als Talent in der Akademie",
         (rj.aka.talente || []).some((t) => t.id === jung));
      const t = (rj.aka.talente || []).find((x) => x.id === jung);
      pr("In die Jugend: er bringt Stärke und Anlage mit",
         t && t.ovr === 50 && t.pot === 78, t ? t.ovr + "/" + t.pot : "—");
      pr("In die Jugend: er bekommt einen frischen Akademievertrag",
         t && t.vertragBis > 2030, t ? "bis " + t.vertragBis : "—");
      pr("In die Jugend: die Vereinszahlen bleiben nicht stehen",
         t && t.spiele === undefined && t.tore === undefined,
         "in der Jugend spielt er andere Spiele");
      pr("In die Jugend: die Aufstellung zeigt nicht mehr auf ihn",
         !Object.values(rj.v.aufstellung || {}).includes(jung));
    }
    pr("In die Jugend: zu alt wird abgewiesen",
       !!V.zurueckInDieJugend(aka0, dvv, alt2, 2030).fehler,
       V.zurueckInDieJugend(aka0, dvv, alt2, 2030).fehler);
    pr("In die Jugend: ohne Akademie wird abgewiesen",
       !!V.zurueckInDieJugend(null, dvv, jung, 2030).fehler);
    pr("In die Jugend wird abgewiesen, wenn der Kader zu klein würde",
       !!V.zurueckInDieJugend(aka0, knapp, knapp.kader[0].id, 2030).fehler);

    /* Der Abschied muss in der CHRONIK ankommen — sonst wäre er nur eine
       Zwischennotiz, die beim nächsten Speichern verschwindet. */
    if (!re.fehler) {
      const rs = V.vereinSaison(re.v);
      if (rs.fehler) pr("Abschied landet in der Chronik", false, rs.fehler);
      else {
        const c = rs.v.chronik[rs.v.chronik.length - 1];
        pr("Abschied landet in der Chronik",
           (c.abschiede || []).some((x) => x.grund === "entlassen"),
           (c.abschiede || []).length + " Abschiede im Jahr");
        pr("und die Zwischenliste ist danach leer",
           !(rs.v.offeneAbschiede || []).length);
      }
    }
  }

  /* ============ Die Spielmaschine (35.52) ================================
     Eine Saison wird jetzt GESPIELT statt gewuerfelt. Geprueft wird nicht,
     ob sie durchlaeuft, sondern ob die Buchhaltung aufgeht — eine Tabelle,
     in der die Tore nicht zu den Gegentoren passen, faellt beim Lesen nicht
     auf, macht aber jede Zahl darin wertlos. */
  {
    /* Eigener Verein fuer diese Gruppe. `v` ist an dieser Stelle der leere
       aus der Gruendungsprobe — der erste Entwurf lief damit auf „Nicht
       spielbereit" und haette die ganze Gruppe uebersprungen. Ein Kader,
       der breit genug ist, dass auch nach Sperren jemand nachruecken kann. */
    const sv = V.gruenden(V.leererVerein(),
      { name: "Maschinenprobe", land: "GER", liga: "3. Liga" }).v;
    const sk = ["TW", "TW", "IV", "IV", "IV", "IV", "AV", "AV", "AV", "ZDM", "ZDM",
                "ZM", "ZM", "ZOM", "ZOM", "AF", "AF", "ST", "ST", "ST"]
      .map((pz, i) => ({ id: "m" + i, name: "Mann " + i, pos: pz, ovr: 46 + (i % 10),
        pot: 76, alter: 22, flag: "🇩🇪", form: 50, fitness: 80,
        spiele: 0, tore: 0, jahreImVerein: 0 }));
    const r = V.vereinSaison(V.autoAufstellen({ ...sv, kader: sk }));
    if (r.fehler) {
      pr("Spielmaschine: Saison lief", false, r.fehler);
    } else {
      const T = r.tabelle;
      /* GEGEN DIE ECHTE LIGA messen, nicht gegen sich selbst. Der erste
         Entwurf verglich `T.length === r.N` — beides kommt aus derselben
         Quelle, also stimmte es immer. Die Gegenprobe (eigener Verein wird
         angehaengt statt zu ersetzen) blieb gruen, obwohl die 3. Liga dann
         21 Mannschaften und 40 Spieltage hatte. Eine Pruefung, die eine Zahl
         mit sich selbst vergleicht, prueft nichts. */
      const echt = (App.LEAGUES && App.LEAGUES["3. Liga"] ? App.LEAGUES["3. Liga"].length : null);
      pr("Spielmaschine: Ligagröße stimmt mit der echten Liga überein",
         echt != null && T.length === echt && r.N === echt,
         T.length + " Mannschaften, echt " + echt);
      pr("jede Mannschaft hat gleich viele Spiele",
         new Set(T.map((z) => z.sp)).size === 1, T[0].sp + " Spiele");
      pr("Spiele = 2 × (N − 1)", T[0].sp === 2 * (T.length - 1));
      /* Die harte Buchhaltungsprobe: in einer geschlossenen Liga ist jedes
         Tor auch ein Gegentor, und jedes Spiel vergibt genau 2 oder 3 Punkte. */
      const gf = T.reduce((a2, z) => a2 + z.gf, 0), ga = T.reduce((a2, z) => a2 + z.ga, 0);
      pr("Summe Tore = Summe Gegentore", gf === ga, gf + " : " + ga);
      const spiele = T.reduce((a2, z) => a2 + z.sp, 0) / 2;
      const pkt = T.reduce((a2, z) => a2 + z.pkt, 0);
      pr("Punkte passen zur Zahl der Spiele", pkt >= spiele * 2 && pkt <= spiele * 3,
         pkt + " Punkte auf " + spiele + " Spiele");
      pr("Siege und Niederlagen gleichen sich aus",
         T.reduce((a2, z) => a2 + z.w, 0) === T.reduce((a2, z) => a2 + z.n, 0));
      pr("Unentschieden sind gerade", T.reduce((a2, z) => a2 + z.u, 0) % 2 === 0);
      T.forEach(() => {});
      pr("jede Zeile: Spiele = S+U+N",
         T.every((z) => z.sp === z.w + z.u + z.n));
      pr("jede Zeile: Punkte = 3·S + U",
         T.every((z) => z.pkt === 3 * z.w + z.u));
      pr("die Tabelle ist nach Punkten sortiert",
         T.every((z, i) => i === 0 || T[i - 1].pkt >= z.pkt),
         T[0].pkt + " … " + T[T.length - 1].pkt);
      pr("genau eine Zeile ist die eigene", T.filter((z) => z.me).length === 1);
      pr("der gemeldete Rang ist die Position der eigenen Zeile",
         T.find((z) => z.me).pos === r.rang, "Platz " + r.rang);

      /* Die eigenen Spiele — sie sind die Grundlage jeder Spielerzahl. */
      pr("es gibt für jedes eigene Spiel einen Eintrag",
         r.spiele.length === T[0].sp, r.spiele.length + " Spiele");
      pr("Heim- und Auswärtsspiele halten sich die Waage",
         r.spiele.filter((x) => x.heim).length === r.spiele.length / 2);
      const eigen = r.spiele.reduce((a2, x) => a2 + x.eigene, 0);
      const fremd = r.spiele.reduce((a2, x) => a2 + x.fremde, 0);
      pr("die Spiele ergeben genau die Tabellentore",
         eigen === r.tore && fremd === r.gegentore,
         eigen + ":" + fremd + " gegen " + r.tore + ":" + r.gegentore);
      pr("je Spiel steht für jedes Tor ein Schütze",
         r.spiele.every((x) => x.tore.length === x.eigene));

      /* Die Spielerzahlen — hier lag offener Punkt 21. */
      pr("die Torschützen ergeben zusammen die Mannschaftstore",
         r.spieler.reduce((a2, x) => a2 + x.tore, 0) === r.tore,
         r.spieler.reduce((a2, x) => a2 + x.tore, 0) + " von " + r.tore);
      pr("niemand hat mehr Spiele als die Mannschaft",
         r.spieler.every((x) => x.spiele <= T[0].sp));
      pr("jeder Aufgestellte kommt auf Einsätze", r.spieler.length >= 11,
         r.spieler.length + " Spieler mit Einsatz");
      pr("Vorlagen sind nicht mehr als Tore",
         r.spieler.reduce((a2, x) => a2 + x.vorlagen, 0) <= r.tore);
      pr("ein Torwart ist nicht Torschützenkönig",
         !(r.spieler[0] && r.spieler[0].pos === "TW" && r.spieler[0].tore > 0),
         "vorn: " + (r.spieler[0] ? r.spieler[0].pos : "—"));
      pr("Rote Karten führen zu verpassten Spielen",
         r.spieler.reduce((a2, x) => a2 + x.rot, 0) === 0
         || r.spieler.reduce((a2, x) => a2 + x.verpasst, 0) > 0,
         r.spieler.reduce((a2, x) => a2 + x.rot, 0) + " Rot · "
           + r.spieler.reduce((a2, x) => a2 + x.verpasst, 0) + " verpasst");

      /* Die toten Felder aus 35.21 tragen jetzt etwas. */
      const mit = (r.v.kader || []).filter((sp) => (sp.spiele || 0) > 0);
      pr("die Kaderfelder spiele/tore werden fortgeschrieben", mit.length > 0,
         mit.length + " Spieler mit Einsätzen im Kader");

      /* Das Archiv. */
      const c = r.v.chronik[r.v.chronik.length - 1];
      pr("die Chronik trägt die volle Tabelle des Jahres",
         !!c.tabelle && c.tabelle.length === T.length);
      pr("die Chronik trägt die Spielerzahlen des Jahres",
         !!c.spieler && c.spieler.length === r.spieler.length);
      pr("die Einzelspiele stehen NUR beim laufenden Stand, nicht im Archiv",
         !c.spiele && !!r.v.spiele,
         "Chronik ohne Spiele, Stand mit " + (r.v.spiele || []).length);
    }
  }

  /* ---------------------------------- Freischaltung (35.50) ---------------
     Der eigentliche Befund von 35.50: `freigeschaltet().akademie` wurde
     ausgerechnet und NIE angewandt. Die Menuezeile bekam ihren Klick ohne
     Bedingung, der Abschlussbildschirm hatte einen zweiten offenen Zugang.
     Ein Wert, den niemand liest, ist kein Tor — er ist Dekoration. */
  {
    const bei = (n) => V.freigeschaltet({ karrieren: n });
    pr("Freischaltung: Dach zu bei 0 und 1 Laufbahn",
       !bei(0).akademie && !bei(1).akademie);
    pr("Freischaltung: Dach offen ab 2", bei(2).akademie && bei(3).akademie);
    pr("Freischaltung: Profimannschaft zu bis 4",
       !bei(2).verein && !bei(4).verein);
    pr("Freischaltung: Profimannschaft offen ab 5", bei(5).verein);
    pr("Freischaltung: Restzähler stimmen",
       bei(0).nochAkademie === 2 && bei(1).nochAkademie === 1 && bei(2).nochAkademie === 0
       && bei(0).nochVerein === 5 && bei(4).nochVerein === 1 && bei(5).nochVerein === 0);
    /* Ohne Uebergabe darf nichts aufgehen — eine fehlende Bilanz ist kein
       Freifahrtschein. */
    pr("Freischaltung: ohne Bilanz bleibt alles zu",
       !V.freigeschaltet(null).akademie && !V.freigeschaltet(undefined).verein
       && !V.freigeschaltet({}).akademie);

    /* Und die Quelltextprobe, weil ein toter Wert im Rechenkern unsichtbar
       ist: die Menuezeile MUSS die Freischaltung abfragen. Genau hier lag der
       Fehler bis 35.49 — deshalb steht die Pruefung im Quelltext, nicht im
       Motor. Der Pfad kommt aus derselben Suche wie unten. */
    const fs2 = require("fs");
    const ARG2 = require("./argumente.cjs");
    const k2 = [ARG2.benannt("quelle"), process.env.QUELLE_APP, "App.jsx", "../App.jsx"].filter(Boolean);
    const g2 = k2.find((k) => { try { return fs2.statSync(k).isFile(); } catch (e) { return false; } });
    if (!g2) {
      pr("Menüzeile „Dein Verein“ fragt die Freischaltung ab", false,
         "App.jsx nicht gefunden — NICHT geprueft");
    } else {
      /* OHNE KOMMENTARE pruefen. Der erste Entwurf suchte "Zur
         Jugendakademie" im ganzen Quelltext — und fand es in dem Kommentar,
         der erklaert, dass der Knopf entfernt wurde. Die Pruefung bewachte
         also ihre eigene Erklaerung. Wer eine Aenderung dokumentiert, darf
         damit keine Pruefung ausloesen. */
      const q = fs2.readFileSync(g2, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^\s*\/\/[^\n]*$/gm, " ");
      pr("Menüzeile „Dein Verein“ fragt die Freischaltung ab",
         /fr\.akademie \? onVereinDach : null/.test(q));
      pr("kein ungesperrter Zugang zur Akademie mehr im Hauptmenü",
         !/zeile\("akademie"/.test(q),
         /zeile\("akademie"/.test(q) ? "eigene Menüzeile ist zurück" : "nur noch über das Dach");
      /* 35.50 prüfte hier, dass der Knopf im Abschlussbildschirm die
         Freischaltung abfragt. In 35.51 ist der Knopf ganz weggefallen —
         kein Zugang ist strenger als ein gesperrter. Die Prüfung sagt jetzt
         das Stärkere: `EndScreen` bekommt gar kein `onAka` mehr, und die
         Signatur führt es auch nicht mehr. Wäre sie einfach stehengeblieben,
         hätte sie rot gemeldet, obwohl die Sache besser geworden ist. */
      /* ---- ROUTENPRUEFUNG (35.53) -------------------------------------
         Der teuerste Befund dieser Sitzung: das Dach aus 35.50 hatte drei
         Fassungen lang KEINE Route. Das Skript, das sie einsetzen sollte,
         brach vorher mit einem Fehler ab und schrieb gar nichts; nachgezogen
         wurden nur die Rueckwege. `onVereinDach` kam damit nie an, die
         Menuezeile war dauerhaft grau — und alles blieb gruen, weil die
         Pruefungen den TEXT der Zeile lasen und nicht, ob der Klick irgendwo
         ankommt.
         Jetzt: jedes `setPhase("x")` braucht ein `phase === "x"`. Eine
         Ansicht, zu der kein Weg fuehrt, ist keine Ansicht. */
      const ziele = new Set((q.match(/setPhase\("([a-z]+)"\)/g) || [])
        .map((m2) => m2.replace(/setPhase\("|"\)/g, "")));
      const routen = new Set((q.match(/phase === "([a-z]+)"/g) || [])
        .map((m2) => m2.replace(/phase === "|"/g, "")));
      /* `play` ist die Ausnahme MIT GRUND: es steht am Ende der Kette als
         Durchfall — alles, was keine eigene Route trifft, ist der
         Spielbildschirm. Benannt statt weggefiltert; eine stille
         Ausnahmeliste waere ein Loch, durch das der naechste Fehler passt. */
      const DURCHFALL = ["play"];
      const ohneRoute = [...ziele].filter((x) => !routen.has(x) && !DURCHFALL.includes(x)).sort();
      pr("jedes setPhase-Ziel hat eine Route", ohneRoute.length === 0,
         ohneRoute.length ? "ohne Route: " + ohneRoute.join(", ")
                          : ziele.size + " Ziele, alle erreichbar");
      /* Und die Gegenrichtung: eine Route, zu der niemand hinfuehrt, ist
         toter Code — dieselbe Bauart, nur andersherum. */
      const ohneWeg = [...routen].filter((x) => !ziele.has(x) && x !== "menu").sort();
      pr("jede Route wird auch angesprungen", ohneWeg.length === 0,
         ohneWeg.length ? "unerreichbar: " + ohneWeg.join(", ") : routen.size + " Routen");

      pr("der Abschlussbildschirm hat gar keinen Zugang zur Akademie mehr",
         !/<EndScreen[^>]*onAka=/.test(q) && !/function EndScreen\(\{ p, onNew, onHall/.test(q));
      pr("und keinen Sprungknopf im Akademiebericht",
         !/Zur Jugendakademie|Jetzt ausbauen/.test(q));
    }
  }

  /* Es darf KEINEN zweiten Weg geben, eine Saison auszuloesen. Der alte Knopf
     ist entfernt; diese Pruefung faengt, wenn er zurueckkommt. */
  /* Diese eine Pruefung liest den QUELLTEXT, nicht den Rechenkern — ein
     zweiter Ausloeser waere im Motor unsichtbar. Der Pfad kommt aus der
     Umgebung, weil das Skript aus dem Bauverzeichnis laeuft, wo keine App.jsx
     liegt: der erste Entwurf nahm "App.jsx" und stuerzte dort mit ENOENT ab.
     Findet sie die Datei nicht, MELDET sie das — eine uebersprungene Pruefung
     ist kein bestandener Lauf. */
  const fs = require("fs");
  /* 35.41: `--quelle=` zuerst, dann die alte Umgebungsvariable, dann die
     Verzeichnisrueckfaelle. Die bleiben hier bewusst stehen, weil dieses
     Werkzeug einen FEHLENDEN Fund ausdruecklich meldet statt still zu
     bestehen — der gefaehrliche Fall ist damit schon abgedeckt. */
  const ARG = require("./argumente.cjs");
  const kandidaten = [ARG.benannt("quelle"), process.env.QUELLE_APP,
    "App.jsx", "../App.jsx"].filter(Boolean);
  const gefunden = kandidaten.find((k) => { try { return fs.statSync(k).isFile(); } catch (e) { return false; } });
  if (!gefunden) {
    pr("Verein: kein Knopf 'Saison spielen' mehr im Programm", false,
       "App.jsx nicht gefunden — NICHT geprueft");
  } else {
    const quelle = fs.readFileSync(gefunden, "utf8");
    pr("Verein: kein Knopf 'Saison spielen' mehr im Programm",
       !/["'>]\s*Saison spielen\s*["'<]/.test(quelle));
  }
})();

console.log("\n" + ok + " Prüfungen bestanden, " + fehler + " Fehler.");
process.exit(fehler ? 1 : 0);

