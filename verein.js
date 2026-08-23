/* ==========================================================================
   verein.js — der eigene Verein (35.17, Durchstich)
   --------------------------------------------------------------------------
   Aufbauend auf der Jugendakademie: statt die Absolventen ziehen zu lassen,
   zieht man sie in die eigene erste Mannschaft hoch und arbeitet sich mit
   ihnen durch die Ligen.

   WARUM EINE FABRIK UND KEIN EINFACHER EXPORT — dieselbe Begruendung wie bei
   ereignisse.js: die Datei braucht Namen aus App.jsx (CLUBS, simTable, clamp
   und andere). Ein Import von dort waere ein Ringimport, App.jsx liefe dann
   nach dieser Datei und die Konstanten waeren noch in der temporalen Totzone.
   `machVerein` nimmt die Helfer entgegen und packt sie oben aus.

   WAS HIER (NOCH) NICHT DRIN IST
   Der Durchstich rechnet, er zeichnet nicht. Wappen, Trikot, Aufstellungs-
   bildschirm und Tutorial kommen danach — bewusst in dieser Reihenfolge, damit
   zuerst nachweisbar ist, DASS die Aufstellung das Ergebnis bewegt. Eine
   schoene Oberflaeche ueber einer Rechnung, die die Wahl ignoriert, waere
   genau der Fehler, den 35.7 abgetragen hat.

   GEMESSENE GRUNDLAGEN (nicht geschaetzt)
   - Die Akademie haelt gleichzeitig 17 (Stufe 4) bis 22 (Stufe 6) Talente,
     mittlere Staerke 46 bis 51. Ein Kader von 16 ist daraus sofort zu fuellen.
   - Sie liefert rund 5,5 neue Talente im Jahr nach: wer den Kader auf einmal
     fuellt, braucht drei bis vier Jahre, bis die Akademie sich erholt hat.
     Genau das ist die Entscheidung, um die es geht.
   - Die dritten Ligen liegen bei Staerke 46 bis 49 — ein hochgezogener
     Jugendkader passt dort ohne jede Anpassung hinein.
   ========================================================================== */
export const machVerein = (H) => {
  const { CLUBS, LEAGUES, simTable, clamp, ri, rnd, gauss, chance, pick, POS, ligaInfo } = H;

  /* Mindestkader fuer den Ligastart: elf plus fuenf auf der Bank. Kevins
     Vorgabe. Darunter laesst sich keine Saison spielen — eine Verletzung und
     man stuende zu zehnt da. */
  const KADER_MIN = 16;
  const VEREIN_JAHRE = 15;          /* danach Bilanz und Neugruendung */

  /* ---------------------------------------------------------- Formationen */
  /* Die Reihenfolge der Plaetze ist die Anzeigereihenfolge von hinten nach
     vorne. Mehr Formationen sind reine Datenarbeit. */
  const FORMATIONEN = [
    { id: "442",  n: "4-4-2",   plaetze: ["TW","IV","IV","AV","AV","ZM","ZM","AF","AF","ST","ST"] },
    { id: "433",  n: "4-3-3",   plaetze: ["TW","IV","IV","AV","AV","ZDM","ZM","ZM","AF","AF","ST"] },
    { id: "4231", n: "4-2-3-1", plaetze: ["TW","IV","IV","AV","AV","ZDM","ZDM","ZOM","AF","AF","ST"] },
    { id: "352",  n: "3-5-2",   plaetze: ["TW","IV","IV","IV","ZDM","ZM","ZM","AV","AV","ST","ST"] },
    { id: "541",  n: "5-4-1",   plaetze: ["TW","IV","IV","IV","AV","AV","ZDM","ZM","ZM","AF","ST"] },
  ];

  /* -------------------------------------------------------- Positionsguete */
  /* Kevins Vorgabe: ein Torwart ist kein Stuermer, aber ein Stuermer kann
     aussen spielen und ein Sechser im Mittelfeld. Der Wert ist der Anteil der
     Staerke, der auf dem fremden Platz ankommt.
     Bewusst KEIN Wert unter 0,6: was schlechter passt, gilt als unmoeglich
     und wird gar nicht erst angeboten. Sonst stellt man aus Versehen den
     Torwart in den Sturm und wundert sich ueber die Tabelle. */
  const GUETE = {
    TW:  { TW: 1 },
    IV:  { IV: 1, ZDM: .82, AV: .80 },
    AV:  { AV: 1, IV: .80, AF: .74, ZM: .68 },
    ZDM: { ZDM: 1, ZM: .90, IV: .80 },
    ZM:  { ZM: 1, ZDM: .90, ZOM: .90, AV: .68 },
    ZOM: { ZOM: 1, ZM: .90, AF: .84, ST: .80 },
    AF:  { AF: 1, ZOM: .84, ST: .84, AV: .74 },
    ST:  { ST: 1, AF: .84, ZOM: .78 },
  };
  /* guete(spielerPos, platzPos) — 0 heisst: dort nicht aufstellbar. */
  const guete = (von, auf) => (GUETE[von] && GUETE[von][auf]) || 0;
  const kannSpielen = (sp, platz) => guete(sp.pos, platz) > 0;

  /* ------------------------------------------------------------- Taktiken */
  /* Jede Taktik verschiebt Staerke, keine ist umsonst besser. Die Zahlen sind
     Prozentpunkte auf die Mannschaftsstaerke, getrennt nach Abwehr und Angriff,
     plus ein Risikoanteil, der die Streuung des Tabellenplatzes veraendert. */
  const TAKTIKEN = [
    { id: "ausgeglichen", n: "Ausgeglichen", t: "Nichts Besonderes, nichts Falsches.", def: 0,  off: 0,  risiko: 1.00 },
    { id: "pressing",     n: "Hohes Pressing", t: "Frueh stoeren, viel laufen.",        def: -3, off: +5, risiko: 1.25 },
    { id: "tief",         n: "Tief stehen",    t: "Kompakt, geduldig, unbequem.",       def: +5, off: -3, risiko: 0.80 },
    { id: "konter",       n: "Konter",         t: "Den Ball hergeben und schnell sein.", def: +2, off: +2, risiko: 1.15 },
    { id: "ballbesitz",   n: "Ballbesitz",     t: "Ruhe hineinbringen, Fehler vermeiden.", def: +2, off: 0, risiko: 0.88 },
  ];

  /* ------------------------------------------------------------ Zustaende */
  const leererVerein = () => ({
    gegruendet: false,
    name: "", stadt: "", land: "", liga: "",
    farben: { primaer: "#c0392b", sekundaer: "#f4f1ea" },
    wappen: null,                  /* kommt mit dem Editor, hier nur der Platz */
    jahr: 0,                       /* 1 bis VEREIN_JAHRE */
    /* EINGESCHRIEBEN heisst: der Verein nimmt am Spielbetrieb teil und spielt
       ab jetzt bei JEDER abgeschlossenen Spielerlaufbahn eine Saison. Bis 35.28
       gab es das nicht — stattdessen einen Knopf „Saison spielen", den man
       beliebig oft druecken konnte. Der Verein lief damit voellig unabhaengig
       von den Laufbahnen, was nie so gedacht war (Kevin am 21.8. auf dem
       Geraet gesehen). Der Knopf war ein Behelf aus 35.17, als es den
       Rechenkern schon gab und den Bildschirm noch nicht. */
    eingeschrieben: false,
    kader: [],
    formation: "442",
    taktik: "ausgeglichen",
    aufstellung: {},               /* platzIndex -> spielerId */
    bonus: {},                     /* Vermaechtnis des vorigen Vereins */
    chronik: [],
    bilanz: { saisons: 0, aufstiege: 0, abstiege: 0, meister: 0, tore: 0, gegentore: 0, punkte: 0, bestePlatzierung: null },
    ausbau: { training: 1, stadion: 1, medizin: 1 },   /* per VC, spaeter */
  });

  /* -------------------------------------------------------- Ligapyramide */
  /* Aus den Vereinsdaten abgeleitet statt aufgezaehlt: die Ligen eines Landes
     nach mittlerer Staerke sortiert ergeben die Stufen. Damit funktioniert der
     Aufstieg in jedem der 24 Laender mit Unterbau, ohne eine Tabelle zu pflegen
     — und ein neu ergaenztes Land ist von selbst dabei. */
  const _pyr = {};
  const pyramide = (land) => {
    if (_pyr[land]) return _pyr[land];
    const nachLiga = {};
    CLUBS.filter((c) => c.c === land).forEach((c) => (nachLiga[c.l] = nachLiga[c.l] || []).push(c.s));
    const alle = Object.entries(nachLiga)
      .map(([l, a]) => ({ liga: l, staerke: a.reduce((x, y) => x + y, 0) / a.length, n: a.length }))
      .filter((x) => x.n >= 8);            /* zu kleine Ligen taugen nicht als Stufe */
    /* Frauen- und Maennerligen sind getrennte Pyramiden, nicht Stufen
       voneinander — ein Aufstieg von der Frauen-Bundesliga in die 2. Bundesliga
       waere Unsinn. Der erste Entwurf erkannte sie am NAMEN und ist prompt
       gescheitert: "Serie A Femminile" hat zwei m, mein Muster nur eins, und
       die Liga landete in der Maennerpyramide. Genau die Stolperfalle
       "harte Zeichenkette" aus Abschnitt 6.
       Die Vereine tragen ein Feld `g` ("m" oder "w"). Danach wird getrennt. */
    const geschlecht = {};
    CLUBS.filter((c) => c.c === land).forEach((c) => (geschlecht[c.l] = c.g || "m"));
    const teile = [alle.filter((x) => geschlecht[x.liga] !== "w"),
                   alle.filter((x) => geschlecht[x.liga] === "w")];
    return (_pyr[land] = teile.map((t) => t.sort((a, b) => a.staerke - b.staerke)));
  };
  /* Alle Ligen eines Landes, von unten nach oben, in der passenden Pyramide. */
  const stufenVon = (land, liga) => {
    const p = pyramide(land);
    for (const t of p) if (t.some((x) => x.liga === liga)) return t;
    return p[0] || [];
  };
  const startligen = (land) => (pyramide(land)[0] || []).map((x) => x.liga);

  /* ------------------------------------------------------------ Gruendung */
  const gruenden = (v0, { name, stadt, land, liga, farben }) => {
    const v = { ...leererVerein(), ...v0 };
    const moeglich = startligen(land);
    if (!moeglich.length) return { v, fehler: "Für dieses Land gibt es keine Liga." };
    const gewaehlt = moeglich.includes(liga) ? liga : moeglich[0];
    return {
      v: { ...v, gegruendet: true, name: String(name || "").trim() || "Neuer Verein",
           stadt: stadt || "", land, liga: gewaehlt, jahr: 1,
           farben: farben || v.farben, kader: [], chronik: [] },
      fehler: null,
    };
  };

  /* ----------------------------------------------------- Kader hochziehen */
  /* Aus einem Akademietalent wird ein Kaderspieler. Bewusst dieselben Felder
     wie beim Talent plus die, die nur im Verein eine Rolle spielen. */
  const alsSpieler = (t) => ({
    id: t.id, name: t.name, nat: t.nat, flag: t.flag, pos: t.pos,
    ovr: t.ovr, pot: t.pot, alter: t.alter,
    form: 50, fitness: 80, spiele: 0, tore: 0, jahreImVerein: 0,
  });

  /* Zieht ein Talent aus der Akademie in den Kader. Gibt beide neuen Zustaende
     zurueck; es wird NICHTS an den uebergebenen Objekten geaendert. */
  const hochziehen = (aka, v, talentId) => {
    const t = (aka.talente || []).find((x) => x.id === talentId);
    if (!t) return { aka, v, fehler: "Talent nicht gefunden." };
    if (t.alter < 16) return { aka, v, fehler: "Unter 16 wird niemand hochgezogen." };
    /* Vermaechtnisbonus "Guter Ruf" und "Legendenstatus": wer bei einem
       angesehenen Verein anfaengt, ist von Tag eins ein Stueck weiter. Wirkt
       beim Hochziehen, nicht in der Akademie — der Bonus gehoert dem Verein. */
    const sp = alsSpieler(t);
    const plus = (v.bonus && v.bonus.startOvr) || 0;
    if (plus) { sp.ovr = Math.min(sp.pot, sp.ovr + plus); }
    return {
      aka: { ...aka, talente: aka.talente.filter((x) => x.id !== talentId) },
      v: { ...v, kader: [...v.kader, sp] },
      fehler: null,
    };
  };
  const kaderVoll = (v) => (v.kader || []).length >= KADER_MIN;

  /* Sechzehn Spieler sind NICHT dasselbe wie eine aufstellbare Mannschaft.
     Zieht man die staerksten Talente hoch, kann der Torwart fehlen — dann
     stehen sechzehn Leute da und die Aufstellung bleibt trotzdem luecken-
     haft. Aufgefallen im Prueflauf: "1 Plaetze offen" bei vollem Kader.

     `bedarf` sagt, welche Plaetze der gewaehlten Formation mit dem aktuellen
     Kader NICHT zu besetzen sind. Im Spiel gehoert das gross auf den
     Kaderbildschirm: "Dir fehlt ein Torwart" ist eine Auskunft, ein grauer
     Startknopf ohne Begruendung ist eine Zumutung. */
  const autoAufstellen = (v) => {
    const form = FORMATIONEN.find((f) => f.id === v.formation) || FORMATIONEN[0];
    const frei = [...(v.kader || [])];
    const reihenfolge = form.plaetze
      .map((platz, i) => ({ platz, i, n: frei.filter((s) => kannSpielen(s, platz)).length }))
      .sort((a, b) => a.n - b.n);
    const auf = {};
    reihenfolge.forEach(({ platz, i }) => {
      let best = null, bestWert = -1;
      frei.forEach((s) => {
        const w = s.ovr * guete(s.pos, platz);
        if (w > bestWert) { bestWert = w; best = s; }
      });
      if (best && bestWert > 0) {
        auf[i] = best.id;
        frei.splice(frei.indexOf(best), 1);
      }
    });
    /* Reparaturdurchgang. Der gierige Lauf oben nimmt fuer jeden Platz den
       STAERKSTEN — und kann damit einen Spieler verbrauchen, den ein spaeterer
       Platz zwingend gebraucht haette. Was danach offen ist, wird mit irgend-
       jemandem besetzt, der dort spielen kann. Ein schwacher Mann auf dem Platz
       ist immer besser als eine Luecke: eine Luecke zaehlt mit Staerke 24. */
    form.plaetze.forEach((platz, i) => {
      if (auf[i] != null) return;
      const k = frei.findIndex((sp) => kannSpielen(sp, platz));
      if (k >= 0) { auf[i] = frei[k].id; frei.splice(k, 1); }
    });
    return { ...v, aufstellung: auf };
  };

  const bedarf = (v) => {
    /* Abgeleitet aus autoAufstellen statt eigenstaendig gerechnet. Der erste
       Entwurf hatte ein zweites, aehnliches Verfahren — und die beiden konnten
       sich widersprechen: `bedarf` meldete "alles besetzbar", die Aufstellung
       liess trotzdem einen Platz frei. Einer von zwoelf Pruefläufen fiel darauf
       herein. Eine Auskunft, die etwas anderes sagt als die Aufstellung, ist
       wertlos. Jetzt gibt es ein Verfahren und eine Antwort. */
    const form = FORMATIONEN.find((f) => f.id === v.formation) || FORMATIONEN[0];
    const auf = autoAufstellen(v).aufstellung;
    const fehlt = {};
    form.plaetze.forEach((platz, i) => { if (auf[i] == null) fehlt[platz] = (fehlt[platz] || 0) + 1; });
    return { fehlt, offen: Object.values(fehlt).reduce((a, b) => a + b, 0) };
  };

  /* Genau ein Kriterium fuer "kann losgehen" — Kadergroesse UND Aufstellbarkeit. */
  const startklar = (v) => kaderVoll(v) && bedarf(v).offen === 0;

  /* ---------------------------------------------------- Mannschaftsstaerke */
  /* DAS ist die Stelle, an der die Aufstellung wirkt. Ohne sie waere jede
     Wahl Dekoration: der Tabellenplatz entsteht in App.jsx aus der
     Vereinsstaerke, und die war bisher eine feste Zahl aus den Vereinsdaten.
     Hier wird sie aus dem gerechnet, was auf dem Platz steht.

     Torwart und Feld werden getrennt gewichtet, weil ein einzelner Torwart
     sonst im Mittel von zehn Feldspielern verschwindet. */
  const staerke = (v) => {
    const form = FORMATIONEN.find((f) => f.id === v.formation) || FORMATIONEN[0];
    const tak = TAKTIKEN.find((t) => t.id === v.taktik) || TAKTIKEN[0];
    const nachId = {};
    (v.kader || []).forEach((s) => (nachId[s.id] = s));

    let tw = 0, feld = [], leer = 0, fehlbesetzt = 0;
    form.plaetze.forEach((platz, i) => {
      const s = nachId[(v.aufstellung || {})[i]];
      if (!s) { leer++; return; }
      const g = guete(s.pos, platz);
      if (g <= 0) { fehlbesetzt++; return; }          /* zaehlt wie unbesetzt */
      const wert = s.ovr * g;
      if (platz === "TW") tw = wert; else feld.push(wert);
    });

    /* Ein unbesetzter Platz kostet mehr als ein schwacher Spieler — es steht
       schlicht niemand da. 24 ist knapp unter der schwaechsten Vereinsstaerke
       im Spiel und damit die Untergrenze des Denkbaren. */
    const fehlend = leer + fehlbesetzt;
    for (let i = 0; i < fehlend; i++) feld.push(24);
    if (!tw) tw = 24;

    const feldMittel = feld.length ? feld.reduce((a, b) => a + b, 0) / feld.length : 24;
    /* 25 % Torwart, 75 % Feld — ein guter Torwart traegt, aber gewinnt nichts
       allein. */
    const roh = tw * .25 + feldMittel * .75;
    /* Das Stadion wirkt hier, nicht im Kader: Rueckhalt ist keine Eigenschaft
       eines Spielers. 0,8 je Stufe ueber der ersten — bei Vollausbau also 4
       Punkte, das ist knapp ein halber Ligaplatz und damit spuerbar, ohne die
       Aufstellung zu entwerten. */
    const stadion = (ausbauStufe(v, "stadion") - 1) * .8;
    const gesamt = roh + (tak.def + tak.off) / 2 + stadion;

    return {
      gesamt: Math.round(clamp(gesamt, 20, 99) * 10) / 10,
      torwart: Math.round(tw * 10) / 10,
      feld: Math.round(feldMittel * 10) / 10,
      abwehr: Math.round((roh + tak.def) * 10) / 10,
      angriff: Math.round((roh + tak.off) * 10) / 10,
      risiko: tak.risiko,
      leer, fehlbesetzt,
      spielbereit: fehlend === 0 && kaderVoll(v),
    };
  };

  /* Beste Aufstellung automatisch — als Vorschlag, nicht als Zwang. Greedy:
     die schwierigsten Plaetze zuerst besetzen (die mit den wenigsten
     Kandidaten), damit der Torwart nicht am Ende fehlt. */

  /* --------------------------------------------------------- Eine Saison */
  const vereinSaison = (v0, opt = {}) => {
    const v = { ...v0, kader: (v0.kader || []).map((s) => ({ ...s })) };
    const st = staerke(v);
    if (!st.spielbereit)
      return { v: v0, fehler: "Nicht spielbereit: " + (kaderVoll(v0) ? "" : "zu wenige Spieler, ") +
        (st.leer + st.fehlbesetzt) + " Plätze offen." };

    /* Der eigene Verein wird der vorhandenen Maschine als ganz normaler Klub
       untergeschoben — mit der Staerke aus der Aufstellung statt einer festen
       Zahl. Dadurch gelten Tabelle, Zufall und Ligagroesse unveraendert. */
    const klub = { n: v.name, l: v.liga, c: v.land, s: st.gesamt };
    const liga = (LEAGUES[v.liga] || []).slice().sort((a, b) => b.s - a.s);
    const N = Math.max(2, liga.length);
    const erwartet = Math.max(1, liga.filter((c) => c.s > st.gesamt).length + 1);
    /* Die Taktik veraendert die Streuung, nicht den Erwartungswert: Konter und
       Pressing koennen weiter oben und weiter unten landen als Ballbesitz. */
    const rang = Math.round(clamp(erwartet + gauss(0, 2.6 * st.risiko), 1, N));
    const tabelle = simTable(klub, rang);

    const stufen = stufenVon(v.land, v.liga);
    const idx = stufen.findIndex((x) => x.liga === v.liga);
    const aufstieg = rang <= 2 && idx >= 0 && idx < stufen.length - 1;
    const abstieg = rang >= N - 1 && idx > 0;
    const neueLiga = aufstieg ? stufen[idx + 1].liga : abstieg ? stufen[idx - 1].liga : v.liga;

    /* Kader altert. Entwicklung wie in der Akademie: jung waechst, ab 30 faellt
       ab, mit 35 ist Schluss. Wer geht, taucht in der Chronik auf. */
    const bleiben = [], weg = [];
    v.kader.forEach((s) => {
      s.alter += 1; s.jahreImVerein += 1;
      /* Trainingszentrum und der Vermaechtnisbonus "Fussballschule" wirken
         beide auf den Zuwachs — der Bonus ist absichtlich schwaecher als eine
         Ausbaustufe, sonst waere Ausbauen sinnlos. */
      const zusatz = (ausbauStufe(v, "training") - 1) + ((v.bonus && v.bonus.zuwachs) || 0);
      if (s.alter <= 28) s.ovr = Math.min(s.pot, s.ovr + ri(1, 3) + zusatz);
      else if (s.alter >= 31) s.ovr = Math.max(30, s.ovr - ri(1, 3));
      /* Die medizinische Abteilung verlaengert Laufbahnen — je zwei Stufen ein
         Jahr. Bei Vollausbau spielt man bis 37 statt bis 35. */
      const laenger = Math.floor((ausbauStufe(v, "medizin") - 1) / 2);
      if (s.alter >= 35 + laenger || (s.alter >= 33 + laenger && s.ovr < 55)) weg.push(s); else bleiben.push(s);
    });

    const eigene = (tabelle || []).find((z) => z.me) || null;
    const b = v.bilanz;
    const neueBilanz = {
      saisons: b.saisons + 1,
      aufstiege: b.aufstiege + (aufstieg ? 1 : 0),
      abstiege: b.abstiege + (abstieg ? 1 : 0),
      meister: b.meister + (rang === 1 ? 1 : 0),
      /* simTable liefert ein ARRAY von Zeilen; die eigene traegt `me: true`.
         Der erste Entwurf las `tabelle.eigene.tore` — das Feld gibt es nicht,
         also stand in der Bilanz jahrelang stumm eine 0. Aufgefallen nur, weil
         der 15-Jahres-Lauf sie ausgegeben hat. */
      tore: b.tore + (eigene ? eigene.gf : 0),
      gegentore: (b.gegentore || 0) + (eigene ? eigene.ga : 0),
      punkte: b.punkte + (eigene ? eigene.pts : 0),
      bestePlatzierung: b.bestePlatzierung == null ? rang : Math.min(b.bestePlatzierung, rang),
    };

    /* Aufstellung zuruecksetzen: die Plaetze zeigen auf Spieler, von denen
       einige aufgehoert haben. Sie stehenzulassen waere die Sorte stiller
       Fehler, bei der der naechste Kaderaufbau auf Geister zeigt. */
    return {
      v: { ...v, jahr: v.jahr + 1, liga: neueLiga, kader: bleiben, aufstellung: {},
           bilanz: neueBilanz,
           chronik: [...v.chronik, { jahr: v.jahr, liga: v.liga, rang, N,
             staerke: st.gesamt, aufstieg, abstieg,
             abgaenge: weg.map((s) => s.name + " (" + s.alter + ")") }] },
      tabelle, rang, N, aufstieg, abstieg, staerke: st, abgaenge: weg,
      vorbei: v.jahr + 1 > VEREIN_JAHRE,
      fehler: null,
    };
  };

  /* ============================ Freischaltung ============================ */
  /* Kevins Vorgabe: Akademie ab 2 abgeschlossenen Laufbahnen, eigener Verein
     ab 5. Der Zaehler `karrieren` steht bereits in der Lebensstatistik — es
     musste nichts Neues gezaehlt werden. */
  const FREI_AKADEMIE = 2, FREI_VEREIN = 5;
  const freigeschaltet = (gesamt) => {
    const n = (gesamt && gesamt.karrieren) || 0;
    return {
      akademie: n >= FREI_AKADEMIE,
      verein: n >= FREI_VEREIN,
      karrieren: n,
      nochAkademie: Math.max(0, FREI_AKADEMIE - n),
      nochVerein: Math.max(0, FREI_VEREIN - n),
    };
  };

  /* ============================ Vereinsausbau ============================ */
  /* Der Verein laesst sich mit denselben VC ausbauen wie die Akademie. Drei
     Abteilungen, bewusst wenige — der Verein soll nicht die Akademie
     nachbauen, sondern ihre Absolventen besser machen.
     Die Kosten liegen ueber denen einer Akademiestufe: der Vollausbau der
     Akademie kostet 2.912 VC, und beides gleichzeitig auszubauen soll eine
     echte Entscheidung sein, kein Nebenher. */
  const VEREIN_AUSBAU = [
    { id: "training", n: "Trainingszentrum", kosten: [0, 40, 75, 120, 175, 240],
      t: "Deine Spieler entwickeln sich schneller.", wirkt: "+1 Stärke je Stufe und Jahr" },
    { id: "stadion",  n: "Stadion",           kosten: [0, 45, 84, 135, 196, 268],
      t: "Mehr Zuschauer, mehr Rückhalt, mehr Druck auf Gäste.", wirkt: "+0,8 Mannschaftsstärke je Stufe" },
    { id: "medizin",  n: "Medizinische Abteilung", kosten: [0, 36, 68, 110, 160, 220],
      t: "Weniger Ausfälle, längere Laufbahnen.", wirkt: "Spieler halten ein Jahr länger durch" },
  ];
  const AUSBAU_MAX = 6;
  const ausbauStufe = (v, id) => clamp(((v.ausbau || {})[id]) || 1, 1, AUSBAU_MAX);
  const ausbauKosten = (v, id) => {
    const a = VEREIN_AUSBAU.find((x) => x.id === id);
    const st = ausbauStufe(v, id);
    return (a && st < AUSBAU_MAX) ? a.kosten[st] : null;      /* null = fertig */
  };
  const ausbauen = (v, id, vcVorrat) => {
    const k = ausbauKosten(v, id);
    if (k == null) return { v, kosten: 0, fehler: "Schon voll ausgebaut." };
    if (vcVorrat < k) return { v, kosten: 0, fehler: "Dafür fehlen " + (k - vcVorrat) + " VC." };
    return { v: { ...v, ausbau: { ...v.ausbau, [id]: ausbauStufe(v, id) + 1 } }, kosten: k, fehler: null };
  };

  /* ========================= Abschluss und Vermaechtnis ================== */
  /* Nach VEREIN_JAHRE ist Schluss. Kevins Vorgabe: Bilanz ziehen, VC
     ausschuetten, und der naechste Verein startet mit einem Bonus, der vom
     Erfolg des vorigen abhaengt.

     Die Punkte sind bewusst so gewichtet, dass ein Aufstieg mehr zaehlt als
     eine gute Platzierung: der Modus soll zum Hocharbeiten einladen, nicht zum
     Verwalten. Ein Abstieg kostet, aber weniger als ein Aufstieg bringt —
     wer es versucht und scheitert, steht besser da als wer nichts riskiert. */
  const punkte = (b) => Math.max(0, Math.round(
      (b.aufstiege || 0) * 120
    + (b.meister || 0) * 90
    - (b.abstiege || 0) * 45
    + (b.punkte || 0) * 0.35
    + Math.max(0, 60 - (b.bestePlatzierung == null ? 60 : b.bestePlatzierung) * 4) * 3
  ));

  /* Die Boni. Jeder hat eine Schwelle in Punkten; man bekommt ALLE, die man
     erreicht hat — sonst waere ein knapp verpasster Sprung ein Totalverlust. */
  const BONI = [
    { id: "ruf",       ab: 150,  n: "Guter Ruf",        t: "Deine Talente starten eine Stufe stärker.",        fx: { startOvr: 2 } },
    { id: "netzwerk2", ab: 350,  n: "Bekannte Adresse", t: "Die Akademie nimmt jedes Jahr ein Talent mehr auf.", fx: { aufnahmen: 1 } },
    { id: "kasse",     ab: 550,  n: "Volle Kasse",      t: "Der neue Verein startet mit einer Ausbaustufe.",    fx: { ausbauStart: 1 } },
    { id: "schule",    ab: 800,  n: "Fußballschule",    t: "Talente entwickeln sich schneller.",                fx: { zuwachs: .4 } },
    { id: "legende",   ab: 1100, n: "Legendenstatus",   t: "Deine Talente starten deutlich stärker.",           fx: { startOvr: 4 } },
  ];

  const abschluss = (v) => {
    const b = v.bilanz || {};
    const pkt = punkte(b);
    /* VC-Ausschuettung. Zum Vergleich: eine Laufbahn bringt rund 107 VC, ein
       Vereinsdurchlauf dauert 15 davon. Die Ausschuettung soll spuerbar sein,
       aber die Akademie nicht ersetzen — deshalb etwa ein bis drei Laufbahnen
       wert. */
    const vc = Math.round(clamp(60 + pkt * .55, 60, 420));
    const boni = BONI.filter((x) => pkt >= x.ab);
    const wirkung = boni.reduce((a, x) => {
      Object.entries(x.fx).forEach(([k, w]) => { a[k] = (a[k] || 0) + w; });
      return a;
    }, {});
    return {
      punkte: pkt, vc, boni, wirkung,
      urteil: pkt >= 1100 ? "Legendär" : pkt >= 800 ? "Herausragend" : pkt >= 550 ? "Stark"
            : pkt >= 350 ? "Solide" : pkt >= 150 ? "Ordentlich" : "Ein Anfang",
      /* Wer noch im Kader steht, taucht kuenftig in der Akademie als jemand
         auf, der es in den Profifussball geschafft hat — Kevins Wunsch. */
      kader: (v.kader || []).map((s) => ({ ...s })),
    };
  };

  /* Der naechste Verein, mit dem Bonus des vorigen. Der Bonus liegt AM VEREIN,
     nicht an der Akademie: er ist der Ertrag dieses Durchlaufs, und beim
     naechsten Abschluss wird er neu bestimmt statt sich aufzustapeln. */
  const neuerVerein = (letzterAbschluss) => {
    const w = (letzterAbschluss && letzterAbschluss.wirkung) || {};
    const v = leererVerein();
    if (w.ausbauStart) v.ausbau = { training: 1 + w.ausbauStart, stadion: 1, medizin: 1 };
    v.bonus = { ...w };
    return v;
  };

  /* ---- Einschreiben in den Spielbetrieb --------------------------------
     Ein einmaliger Schritt: danach spielt der Verein bei jeder abgeschlossenen
     Spielerlaufbahn eine Saison, ohne dass jemand etwas druecken muss. Der
     Kader muss dafuer stehen — Kevins Vorgabe: „vor dem Spieler-Karrierestart
     gesetzt, dann zaehlt er".
     Bewusst NICHT umkehrbar: wer sich einschreibt, spielt die fuenfzehn Jahre.
     Ein Verein, den man zwischendurch abmelden kann, waere kein Verein.      */
  const einschreiben = (v) => {
    if (!v || !v.gegruendet) return { fehler: "Kein Verein gegruendet." };
    if (v.eingeschrieben) return { fehler: "Schon eingeschrieben." };
    const st = staerke(v);
    if (!st.spielbereit) return { fehler: "Kader oder Aufstellung fehlen." };
    return { v: { ...v, eingeschrieben: true } };
  };

  /* Laeuft am Ende einer Laufbahn eine Saison? Genau dann, wenn eingeschrieben,
     noch nicht durch und spielbereit. Als eigene Funktion, damit Bildschirm,
     Ablauf und Pruefstand DIESELBE Antwort bekommen — drei Stellen, die
     denselben Satz einzeln nachbauen, laufen frueher oder spaeter auseinander. */
  const spieltMit = (v) => !!(v && v.gegruendet && v.eingeschrieben
    && v.jahr <= VEREIN_JAHRE && staerke(v).spielbereit);

  return { KADER_MIN, VEREIN_JAHRE, FORMATIONEN, TAKTIKEN, GUETE,
           leererVerein, gruenden, pyramide, stufenVon, startligen,
           hochziehen, kaderVoll, bedarf, startklar, alsSpieler, guete, kannSpielen,
           staerke, autoAufstellen, vereinSaison, einschreiben, spieltMit,
           FREI_AKADEMIE, FREI_VEREIN, freigeschaltet,
           VEREIN_AUSBAU, AUSBAU_MAX, ausbauStufe, ausbauKosten, ausbauen,
           BONI, punkte, abschluss, neuerVerein };
};
