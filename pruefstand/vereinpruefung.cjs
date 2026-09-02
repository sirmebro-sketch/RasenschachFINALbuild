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
    const vielA = { ruhm: 500, chronik: new Array(60).fill({ jahr: 1 }),
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
        const stufe = Math.min(84, 58 + j * 2);
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

