/* akademie.js — die Jugendakademie (ausgezogen aus App.jsx in 35.48)
   =========================================================================
   REINE UMSCHICHTUNG. An der Mechanik aendert sich in dieser Fassung NICHTS.
   Die Rumpfe stehen zeichengleich so da, wie sie in App.jsx standen; dazu
   kommen nur diese Huelle und die `return`-Liste am Ende. Nachgewiesen wird
   das nicht durch Hinsehen, sondern durch einen Gleichheitslauf mit fest
   gesetztem Zufall — siehe STAND.md, Fassung 35.48.

   WARUM: App.jsx hatte 13.674 Zeilen, und die Verwaltung von Akademie und
   Verein (Vertraege, Freigaben, Aufstellung von Hand, Saisonrueckblick) legt
   in beiden noch einmal ungefaehr dasselbe drauf. Der Verein liegt seit 35.17
   in verein.js, die Akademie lag bis 35.47 komplett in App.jsx.

   WAS HIER NICHT DRIN IST, obwohl es dazwischen stand:
   * der VC-Laden (`vcFuer`, `vcPosten`, `VCLADEN`, `LadenSeite` …). Er sass
     mitten im Akademieblock, ist aber ein eigenes Thema und haengt am
     Laufbahnende, nicht an der Akademie. Gemessen: er braucht aus dem
     Akademiekern nichts.
   * die Ansicht (`AKA_FARBE`, `AkademieScreen`, `TalentZeile` …). Hier steht
     Rechnen, kein JSX — wie in verein.js.
   * die Speicherschluessel `AKA_KEY` und `VER_KEY`. Sie gehoeren zur
     Speicherung in App.jsx, nicht zur Mechanik.

   BAUART wie verein.js: eine Fabrik, die ihre Helfer entgegennimmt. Damit
   bleibt akademie.js frei von Verweisen auf App.jsx, und der Pruefstand kann
   sie einzeln laden.                                                      */

export const machAkademie = (H) => {
  const { CLUBS, NATIONS, NAT_BY_ID, REGION_KEYS,
          chance, clamp, gauss, genName, pick, ri } = H;

  const ABTEILUNGEN = [
    { id:"plaetze",  n:"Trainingsplätze",        kurz:"Plätze",
      t:"Mehr Einheiten, bessere Böden, längere Abende unter Flutlicht.",
      kosten:[0, 16, 30, 48, 70, 96],  wirkt:"Grundstärke der Talente" },
    { id:"scouting", n:"Scouting",               kurz:"Scouting",
      t:"Wer nicht sucht, findet auch nichts. Und wer schlecht sucht, findet das Falsche.",
      kosten:[0, 18, 34, 54, 78, 106], wirkt:"Zahl der Talente · Einschätzung der Anlage" },
    { id:"internat", n:"Internat",               kurz:"Internat",
      t:"Ein Dach über dem Kopf, ein warmes Essen, jemand, der nachfragt.",
      kosten:[0, 14, 27, 43, 63, 86],  wirkt:"Weniger Abbrecher" },
    { id:"medizin",  n:"Medizinische Abteilung", kurz:"Medizin",
      t:"Eine verschleppte Verletzung kostet einen ganzen Jahrgang.",
      kosten:[0, 15, 28, 45, 66, 90],  wirkt:"Geringeres Verletzungsrisiko" },
    { id:"lehre",    n:"Ausbildung",             kurz:"Ausbildung",
      t:"Taktik, Schule, Umgang mit Druck und mit den eigenen Eltern.",
      kosten:[0, 20, 37, 58, 84, 114], wirkt:"Höhere Anlage der Talente" },
    { id:"buehne",   n:"Wettbewerbe",            kurz:"Wettbewerbe",
      t:"Turniere, Sichtungsspiele, Aufmerksamkeit von außen.",
      kosten:[0, 14, 26, 42, 60, 82],  wirkt:"Bessere Vermittlung · Jugendturniere" },
    /* Drei weitere Abteilungen (35.13). Sie sind BEWUSST teurer als die sechs
       alten: der Vollausbau soll ein Langzeitziel bleiben, und die vorhandenen
       Kosten bleiben unangetastet, damit niemandem die schon bezahlte Arbeit
       entwertet wird.
       Jede greift an einer anderen Stelle an — und zwei davon wirken FRUEH,
       weil die Messung in 35.12 gezeigt hat, dass die Stufen 1 bis 3 beim
       Ergebnis, das den Spieler am meisten interessiert, fast nichts bewegen. */
    { id:"mental",   n:"Mentaltraining",          kurz:"Mental",
      t:"Der Kopf hält seltener durch als die Beine. Jemand, der zuhört, bevor es zu spät ist.",
      kosten:[0, 26, 48, 78, 112, 152], wirkt:"Deutlich weniger Abbrecher · ruhiger im Sichtungsspiel" },
    { id:"analyse",  n:"Videoanalyse",            kurz:"Analyse",
      t:"Jede Einheit aufgezeichnet, jeder Fehler zweimal gesehen. Langweilig und wirksam.",
      kosten:[0, 28, 52, 84, 120, 164], wirkt:"Schnellere Entwicklung der Talente" },
    { id:"netzwerk", n:"Netzwerk zu Profivereinen", kurz:"Netzwerk",
      t:"Wer angerufen wird, wird auch eingeladen. Der Rest schickt Bewerbungen.",
      kosten:[0, 30, 56, 90, 130, 178], wirkt:"Direkt mehr Profiverträge" },
  ];
  const AKA_MAX = 6;
  const abtById = (id) => ABTEILUNGEN.find((x) => x.id === id);

  const leereAkademie = () => ({
    name: "", gegruendet: null, jahr: 2026,
    vc: 0, verdient: 0, ausgegeben: 0, jahrgaenge: 0,
    /* Aus ABTEILUNGEN abgeleitet statt aufgezaehlt (35.13). Vorher standen hier
       sechs feste Namen — beim Hinzufuegen der drei neuen Abteilungen fehlten sie
       im Grundzustand, `S.mental` war undefined, die Rechnung wurde NaN und
       NIEMAND wurde mehr Profi. Der Pruefstand hat das als "25 Jahre: 0 Karton"
       gemeldet. Betroffen waeren auch alle bestehenden Sicherungen gewesen: die
       kennen nur sechs Schluessel, und akaJahr ergaenzt aus genau dieser Liste.
       Wer kuenftig eine Abteilung ergaenzt, muss hier nichts mehr nachtragen. */
    stufen: Object.fromEntries(ABTEILUNGEN.map((x) => [x.id, 1])),
    talente: [], absolventen: [], chronik: [], ruhm: 0, faelle: [],
    bilanz: { aufgenommen:0, profis:0, weltklasse:0, nationalspieler:0, turniere:0, abbrecher:0 },
  });

  /* ---- Jahreszaehlung der Akademie (35.19) --------------------------------
     Bis 35.18 stand in der Akademie eine Weltjahreszahl: "Gegruendet 2026 ·
     Jahr 2041", "Jahrgang 2032". Kevins Einwand: die Akademie soll zeitlos
     bleiben, Jahreszahlen gehoeren in die Vereinsuebersicht.

     Intern bleibt `a.jahr` als Zaehler stehen — er traegt die Reihenfolge, und
     ihn zu entfernen haette jede bestehende Sicherung entwertet. Nach aussen
     wird nur noch RELATIV gezaehlt: das wievielte Jahr, der wievielte Jahrgang.

     `akaJahrNr(a)`     — das wievielte Jahr laeuft gerade
     `akaJahrgang(a, j)` — aus einer gespeicherten Jahreszahl die Nummer machen
     Beide vertragen alte Sicherungen: dort steht in `ein` eine Weltjahreszahl,
     hier wird sie gegen `gegruendet` verrechnet. Fehlt `gegruendet`, wird die
     Zahl unveraendert durchgereicht statt eine falsche zu erfinden. */
  const akaJahrNr = (a) => {
    if (!a || !a.gegruendet) return 1;
    return Math.max(1, (a.jahr || a.gegruendet) - a.gegruendet + 1);
  };
  const akaJahrgang = (a, j) => {
    if (j == null) return null;
    if (!a || !a.gegruendet) return j;
    /* Kleine Zahlen sind bereits relativ (neue Sicherungen), grosse sind
       Weltjahre (alte). Die Grenze bei 1900 ist grosszuegig: eine Akademie
       mit 1900 Jahrgaengen wird es nicht geben. */
    return j < 1900 ? j : Math.max(1, j - a.gegruendet + 1);
  };

  const akaStufe = (a, id) => clamp((a && a.stufen && a.stufen[id]) || 1, 1, AKA_MAX);
  const akaSumme = (a) => ABTEILUNGEN.reduce((s, x) => s + akaStufe(a, x.id), 0);
  /* Jede Abteilung STARTET auf Stufe 1. `akaSumme` ist deshalb direkt nach der
     Gründung schon 6 von 36 — der Ring zeigte 17 %, obwohl noch nichts gebaut
     ist. Fortschritt heisst hier: was ueber die Gruendung hinaus erreicht wurde.
     `akaSumme` selbst bleibt unveraendert, weil die Errungenschaft „voller
     Ausbau" darauf prueft. */
  const AKA_GRUND = ABTEILUNGEN.length;                  /* 6 · alles auf Stufe 1 */
  const AKA_VOLL = ABTEILUNGEN.length * AKA_MAX;         /* 54 seit 35.13 */
  const AKA_STUFEN = AKA_VOLL - AKA_GRUND;               /* 30 wirklich baubare Stufen */
  const akaAusbau = (a) => akaSumme(a) - AKA_GRUND;
  const akaPreis = (a, id) => { const st = akaStufe(a, id);
    return st >= AKA_MAX ? null : abtById(id).kosten[st]; };
  /* Was der volle Ausbau ab dem jetzigen Stand noch kostet */
  const akaRestkosten = (a) => ABTEILUNGEN.reduce((s, x) => {
    let n = 0; for (let st = akaStufe(a, x.id); st < AKA_MAX; st++) n += x.kosten[st]; return s + n; }, 0);

  /* ---------------- Talente ---------------- */
  const AKA_POS = ["TW","IV","IV","AV","AV","ZDM","ZM","ZM","ZOM","AF","AF","ST"];

  /* Ein Talent tritt mit fünfzehn ein. Wie gut es ist und was in ihm steckt,
     hängt an den Abteilungen — Plätze an der Grundstärke, Ausbildung an der
     Anlage, Scouting an der Streuung (man findet auch mal einen Ausreißer). */
  /* `wunschPos` (35.17) erzwingt eine Position. Gebraucht wird das genau fuer
     Torhueter: sie sind 8,3 % der Aufnahmen, und gemessen ueber 200 Akademien
     hatten 14,5 % gar keinen. Solange die Absolventen zu fremden Vereinen
     gingen, war das folgenlos. Seit man mit ihnen eine eigene Mannschaft
     bildet, ist es eine Sackgasse: ohne Torwart keine Aufstellung, ohne
     Aufstellung keine Saison. */
  /* ---- Vertraege (35.53) --------------------------------------------------
     Kevin: „Jugendspieler muessen auch laufende Vertraege haben, die eine
     gewisse Zeit gehen." Und: die Verlaengerung in der Akademie laeuft
     automatisch — „das machen quasi Angestellte fuer mich". Die FREIGABE bei
     einem Profiangebot dagegen nicht.

     `vertragBis` ist ein Akademiejahr, kein Kalenderjahr — dieselbe Zaehlung
     wie `a.jahr` (siehe akaJahrNr). Alte Spielstaende kennen das Feld nicht;
     `vertragVon` faengt das ab, indem es dann einen frischen Vertrag setzt.
     Ohne diesen Rueckfall staende jedes Talent aus einer alten Sicherung
     sofort vertragslos da und koennte ohne Freigabe gehen. */
  const VERTRAG_JAHRE = [2, 3];
  const vertragVon = (t, jahr) =>
    (t && t.vertragBis != null) ? t.vertragBis : jahr + VERTRAG_JAHRE[0];
  const unterVertrag = (t, jahr) => vertragVon(t, jahr) > jahr;

  function talentBauen(a, jahr, wunschPos) {
    const S = { ...leereAkademie().stufen, ...((a && a.stufen) || {}) };
    const natId = pick(REGION_KEYS);
    const nat = NAT_BY_ID[natId] || NATIONS[0];
    const pos = wunschPos || pick(AKA_POS);
    const ovr = clamp(Math.round(34 + S.plaetze * 1.2 + gauss(0, 3)), 26, 56);
    const pot = clamp(Math.round(ovr + 10 + S.lehre * 2.6 + gauss(0, 3.5 + S.scouting * .9)), ovr + 3, 97);
    return {
      id: "t" + jahr + "_" + Math.floor(Math.random() * 1e6).toString(36),
      name: genName(natId, "m"), nat: natId, flag: nat.flag,
      pos, alter: 15, ovr, pot, ein: jahr, verletzt: 0, ruf: 0,
      /* Zwei oder drei Jahre. Laenger nicht: ein Jahr ist eine abgeschlossene
         Spielerlaufbahn, ein Fuenfjahresvertrag liefe nie ab. */
      vertragBis: jahr + (chance(.5) ? VERTRAG_JAHRE[0] : VERTRAG_JAHRE[1]),
    };
  }

  /* ---- Entscheidungen ueber offene Faelle (35.53) -------------------------
     Rein und ohne Nebenwirkung: sie bekommen die Akademie und geben eine neue
     zurueck. Der Jahreslauf fasst sie nicht an — sonst haetten wir zwei
     Stellen, an denen ein Fall geschlossen wird, und die laufen auseinander. */
  const fallVon = (a, fallId) => (a.faelle || []).find((f) => f.id === fallId && !f.erledigt);

  const freigeben = (a0, fallId) => {
    const f = fallVon(a0, fallId);
    if (!f) return { a: a0, fehler: "Fall nicht gefunden." };
    const t = (a0.talente || []).find((x) => x.id === f.talentId);
    const a = { ...a0,
      bilanz: { ...a0.bilanz, profis: a0.bilanz.profis + 1,
        weltklasse: a0.bilanz.weltklasse + (f.peak >= 85 ? 1 : 0),
        nationalspieler: a0.bilanz.nationalspieler + (f.ns ? 1 : 0) },
      talente: (a0.talente || []).filter((x) => x.id !== f.talentId),
      faelle: (a0.faelle || []).filter((x) => x.id !== fallId),
      absolventen: [...(a0.absolventen || []), { id: f.talentId, name: f.name, flag: f.flag,
        nat: t ? t.nat : null, pos: f.pos, ein: t ? t.ein : null, raus: f.gestellt,
        peak: f.peak, ns: f.ns, klub: f.klub, klubLiga: f.klubLiga }],
    };
    return { a, fehler: null,
      text: f.name + " unterschreibt bei " + f.klub + "." };
  };

  /* Behalten heisst: Vertrag verlaengern, Angebot abgelehnt. Es geht NICHT
     unbegrenzt — mit 21 ist Schluss, dann laeuft der Vertrag aus und er geht,
     ob es mir passt oder nicht. Ein Talent, das man ewig blockieren kann,
     waere kein Talent, sondern ein Gegenstand. */
  const AKA_HOECHSTALTER = 21;
  const behalten = (a0, fallId, jahr) => {
    const f = fallVon(a0, fallId);
    if (!f) return { a: a0, fehler: "Fall nicht gefunden." };
    const t = (a0.talente || []).find((x) => x.id === f.talentId);
    if (!t) return { a: a0, fehler: "Talent nicht mehr da." };
    if (t.alter >= AKA_HOECHSTALTER)
      return { a: a0, fehler: t.name + " ist " + t.alter + " — laenger geht es nicht." };
    return { a: { ...a0,
      talente: (a0.talente || []).map((x) => x.id === t.id
        ? { ...x, vertragBis: jahr + 1, angebot: false } : x),
      faelle: (a0.faelle || []).filter((x) => x.id !== fallId) },
      fehler: null,
      text: f.name + " bleibt noch ein Jahr — " + f.klub + " geht leer aus." };
  };

  /* ---- Verwaltung im Haus (35.61) ----------------------------------------
     Kevin: „weiterhin keine Verwaltungsmoeglichkeiten in der Jugendakademie",
     und auf Nachfrage: wie im Kader — Talent antippen, Vertrag, freigeben,
     hochziehen — plus Talente aussortieren.

     BEIDE WEGE HIER SIND SPIEGELBILDER DES KADERS (35.54/35.55): auslaufen
     lassen ist umkehrbar, aussortieren nicht. Wer zwei Bereiche verschieden
     bedient, muss zweimal lernen. */

  /* Umkehrbar. Wer markiert ist, wird von der stillen Jahresverlaengerung
     uebersprungen und geht, wenn sein Vertrag ablaeuft. */
  const talentAuslaufen = (a0, talentId, notiz) => {
    const t = (a0.talente || []).find((x) => x.id === talentId);
    if (!t) return { a: a0, fehler: "Talent nicht gefunden." };
    return { a: { ...a0, talente: (a0.talente || []).map((x) => x.id === talentId
      ? { ...x, auslaufen: !x.auslaufen, notiz: !x.auslaufen ? (notiz || "") : undefined } : x) },
      fehler: null };
  };

  /* Sofort und endgueltig. KEIN Profi, keine Ehrentafel — wer aussortiert
     wird, hat es nicht geschafft. Er zaehlt als Abbrecher, damit die Bilanz
     stimmt: ein Talent, das ohne Spur verschwindet, macht die Aufnahmezahl
     zur Luege. */
  const aussortieren = (a0, talentId, notiz) => {
    const t = (a0.talente || []).find((x) => x.id === talentId);
    if (!t) return { a: a0, fehler: "Talent nicht gefunden." };
    return { a: { ...a0,
      talente: (a0.talente || []).filter((x) => x.id !== talentId),
      faelle: (a0.faelle || []).filter((f) => f.talentId !== talentId),
      bilanz: { ...a0.bilanz, abbrecher: (a0.bilanz.abbrecher || 0) + 1 },
      chronik: [...(a0.chronik || []),
        { jahr: a0.jahr, art: "aussortiert", txt: t.name + " wurde aussortiert."
          + (notiz ? " (" + notiz + ")" : "") }] },
      fehler: null, text: t.name + " ist nicht mehr im Haus." };
  };

  /* Wie genau die Anlage eingeschätzt werden kann — schlechtes Scouting
     liefert nur ein grobes Band. */
  const akaSpanne = (a) => Math.max(1, 9 - akaStufe(a, "scouting") * 1.4) | 0;

  /* Turniere, bei denen Jugendmannschaften antreten. Erfunden, nicht abgeschrieben
     — echte Turniernamen sind geschützt, und ein Spiel, das offline laeuft und
     niemandem gehoert, braucht das nicht. Zehn Stück: genug, dass sich in
     25 Jahren nichts aufdraengt, wenig genug, dass die Chronik nicht beliebig
     wirkt. Ton wie der Rest des Spiels: so, wie ein Zeugwart es sagen würde. */
  const JUGENDTURNIERE = [
    "Blauen Band der Jugend",
    "Internationalen Pfingstturnier",
    "Nachwuchspokal der Landesverbände",
    "Turnier der acht Akademien",
    "Wintercup der Leistungszentren",
    "Hallenmasters der A-Jugend",
    "Sichtungsturnier am Deich",
    "Juniorenpokal der Hafenstädte",
    "Osterturnier der Talentschmieden",
    "Grenzlandcup der U19",
  ];
  /* In welcher Runde es zu Ende ging. Steht getrennt, damit derselbe Gegner in
     verschiedenen Jahren verschieden weit kommt. */
  const TURNIER_AUS = ["im Endspiel", "im Halbfinale", "im Viertelfinale",
    "in der Vorrunde", "im Elfmeterschießen"];

  /* Ein Jahr in der Akademie. Gibt den neuen Zustand und die Ereignisse
     zurück, damit man beim nächsten Besuch nachlesen kann, was war. */
  function akaJahr(a0, weltjahr) {
    const a = {
      ...leereAkademie(), ...a0,
      stufen: { ...leereAkademie().stufen, ...(a0.stufen || {}) },
      talente: [...(a0.talente || [])],
      absolventen: [...(a0.absolventen || [])],
      chronik: [...(a0.chronik || [])],
      bilanz: { ...leereAkademie().bilanz, ...(a0.bilanz || {}) },
    };
    const S = a.stufen;
    const jahr = weltjahr || (a.jahr + 1);
    const E = [];

    /* 1. Vorhandene Talente: ein Jahr älter, Abbruch, Verletzung, Fortschritt */
    const bleiben = [];
    a.talente.forEach((t0) => {
      const t = { ...t0 };
      t.alter += 1;
      /* Mentaltraining wirkt hier zusaetzlich zum Internat — und schon auf Stufe 1,
     damit fruehe Ausbaustufen sichtbar etwas bringen (Befund aus 35.12). */
        const abbruch = clamp(.15 - S.internat * .023 - S.mental * .008 - (t.ovr - 44) * .004, .008, .32);
      if (chance(abbruch)) {
        a.bilanz.abbrecher++;
        E.push({ art: "weg", txt: t.name + " (" + t.alter + ") hört auf." });
        return;
      }
      let mult = 1;
      if (chance(clamp(.13 - S.medizin * .019, .008, .2))) {
        mult = .3; t.verletzt++;
        E.push({ art: "pech", txt: t.name + " fällt fast das ganze Jahr aus." });
      }
      /* Videoanalyse (35.13) wirkt hier mit — sie ist die dritte Quelle des
           Zuwachses neben Plaetzen und Ausbildung. */
        const zuwachs = (ri(1, 3) + S.plaetze * .35 + S.lehre * .2 + S.analyse * .26) * mult;
      t.ovr = clamp(Math.round(t.ovr + zuwachs), t.ovr, t.pot);
      /* Automatische Verlaengerung — „das machen quasi Angestellte fuer mich".
         Nur solange er noch nicht 19 ist: danach entscheidet ein Angebot,
         nicht die Verwaltung. Und nur STILL: ein Postkorb, der jedes Jahr mit
         zwanzig Verlaengerungen volllaeuft, ist keiner. */
      /* WER MARKIERT IST, WIRD NICHT VERLAENGERT (35.61). Ohne diese Zeile
         waere „Vertrag auslaufen lassen" ein Knopf ohne Wirkung: die stille
         Jahresverlaengerung haette die Markierung jedes Jahr ueberschrieben.
         Laeuft der Vertrag dann ab, geht er — mit Eintrag in der Chronik,
         damit der Abgang nicht spurlos ist. */
      if (t.auslaufen && vertragVon(t, jahr) <= jahr) {
        a.bilanz.abbrecher = (a.bilanz.abbrecher || 0) + 1;
        E.push({ art: "weg", txt: t.name + " verlässt das Haus — Vertrag ausgelaufen."
          + (t.notiz ? " (" + t.notiz + ")" : "") });
        return;
      }
      if (!t.auslaufen && t.alter < 19 && vertragVon(t, jahr) <= jahr + 1)
        t.vertragBis = jahr + (chance(.5) ? VERTRAG_JAHRE[0] : VERTRAG_JAHRE[1]);
      bleiben.push(t);
    });

    /* 2. Wer neunzehn wird, verlässt die Akademie */
    const bleibenNach = [];
    bleiben.forEach((t) => {
      if (t.alter < 19) { bleibenNach.push(t); return; }
      /* Wer schon einen offenen Fall hat, bekommt kein zweites Angebot.
         Ohne diese Sperre wuerfelt der naechste Jahrgangslauf fuer denselben
         Spieler erneut — und im Postkorb staenden zwei Angebote fuer einen
         Mann, von denen nur eines gelten kann. */
      if ((a.faelle || []).some((f) => f.talentId === t.id && !f.erledigt)) {
        bleibenNach.push(t); return;
      }
      /* Ob es für einen Profivertrag reicht, ist keine feste Schwelle: Es hängt
         an der Stärke, an den Wettbewerben, in denen man gesehen wurde, und an
         einer Portion Glück. Die allermeisten schaffen es nicht. */
      /* 35.13: Bis dahin wirkte hier nur die Wettbewerbsabteilung, und die Quote
           stieg von Stufe 1 bis 3 nur von 2 auf 3 Prozent — man zahlte zwei
           Ausbaustufen und sah beim wichtigsten Ergebnis keinen Unterschied.
           Das Netzwerk wirkt jetzt staerker als die Wettbewerbe und schon ab
           der ersten Stufe; Mentaltraining hilft im Sichtungsspiel. */
        const proChance = clamp(.07 + (t.ovr - 50) * .022 + S.buehne * .02
          + S.netzwerk * .014 + S.mental * .005, .04, .5);
      if (!chance(proChance)) {
        a.bilanz.abbrecher++;
        E.push({ art: "weg", txt: t.name + " bekommt keinen Profivertrag." });
        return;
      }
      /* Der weitere Weg: Anlage plus Glück, minus dem, was im Profialltag
         verloren geht. Die Wettbewerbsabteilung sorgt für bessere Vermittlung. */
      const peak = clamp(Math.round(t.pot + gauss(0, 4) + S.buehne * 1.0 - ri(0, 6)), t.ovr, 99);
      const natStr = (NAT_BY_ID[t.nat] || { str: 50 }).str;
      const ns = peak >= 74 && chance(clamp((peak - 70) * .05 + (60 - natStr) * .003, .05, .7));
      /* HIER WURDE BIS 35.53 GEZAEHLT. Die Zaehler stehen jetzt weiter unten,
         hinter der Freigabeweiche — wer ein Angebot bekommt, ist noch kein
         Profi. Beim Einbau standen sie kurzzeitig an BEIDEN Stellen und jeder
         Abgang zaehlte doppelt; die Ehrentafelpruefung hat es gemeldet
         ("Bilanz 10 Weltklasse, auf der Tafel 5"). Hinzufuegen ohne
         Wegnehmen — dieselbe Bauart wie die verlorene Route in dieser
         Fassung, nur andersherum. */
      /* Wohin er gegangen ist (35.12). Bis dahin stand auf der Ehrentafel nur,
         DASS jemand Profi wurde — nicht wo. Der Verein wird nicht gewuerfelt,
         sondern passt zur erreichten Staerke: wer auf 88 kommt, landet nicht in
         der dritten Liga. Gesucht wird im Fenster um die Zielstaerke, mit Vorzug
         fuer das Heimatland; findet sich dort nichts, entscheidet die Naehe. */
      const zielS = clamp(peak - ri(2, 9), 30, 92);
      const passend = CLUBS.filter((c) => Math.abs(c.s - zielS) <= 6);
      const daheim = passend.filter((c) => c.c === t.nat);
      const topf = (daheim.length && chance(.55)) ? daheim : passend;
      const verein = topf.length ? pick(topf)
        : CLUBS.reduce((b, c) => (Math.abs(c.s - zielS) < Math.abs(b.s - zielS) ? c : b), CLUBS[0]);
      /* ---- FREIGABE STATT ABGANG (35.53) --------------------------------
         Bis 35.52 unterschrieb er hier und war weg. Kevin: „wenn sie einen
         Profivertrag eines anderen Vereins bekommen, dass ich zustimmen
         muss" — solange er bei mir unter Vertrag steht.

         Laeuft sein Akademievertrag noch, wird daraus ein FALL im Postkorb.
         Er bleibt so lange in der Akademie. Ist der Vertrag abgelaufen, geht
         er ohne Rueckfrage — das ist der Weg, den ein Talent selbst waehlen
         kann, indem es den Vertrag aussitzt.

         DIE FRIST steht im Fall selbst (`frist`), nicht in einer zweiten
         Liste: eine Frist, die woanders gefuehrt wird als der Fall, laeuft
         irgendwann daneben. */
      if (unterVertrag(t, jahr) && t.alter < 21) {
        a.faelle = a.faelle || [];
        a.faelle.push({ id: "f" + t.id + "_" + jahr, art: "profiangebot",
          talentId: t.id, name: t.name, flag: t.flag, pos: t.pos, alter: t.alter,
          ovr: t.ovr, peak, ns, klub: verein.n, klubLiga: verein.l,
          gestellt: jahr, frist: jahr + 1, vertragBis: vertragVon(t, jahr) });
        t.angebot = true;
        bleibenNach.push(t);
        E.push({ art: "profi", txt: t.name + " hat ein Angebot von " + verein.n
          + " — du musst zustimmen." });
        return;
      }
      a.bilanz.profis++;
      if (peak >= 85) a.bilanz.weltklasse++;
      if (ns) a.bilanz.nationalspieler++;
      a.absolventen.push({ id: t.id, name: t.name, flag: t.flag, nat: t.nat, pos: t.pos,
        ein: t.ein, raus: jahr, peak, ns, klub: verein.n, klubLiga: verein.l });
      E.push({ art: peak >= 85 ? "gross" : "profi",
        txt: t.name + " unterschreibt bei " + verein.n
          + (peak >= 85 ? " — daraus wird ein Weltklassespieler." : ".") });
    });

    /* ---- Fristen (35.53) ---------------------------------------------------
       Kevins Vorgabe: „Frist von einem Jahr, danach entscheidet der Spieler
       selbst." Wer nicht entscheidet, entscheidet auch — nur eben gegen sich.
       Das steht ABSICHTLICH hier und nicht bei der Anzeige: eine Frist, die
       nur ablaeuft, wenn man hinsieht, ist keine. */
    (a.faelle || []).forEach((f) => {
      if (f.art !== "profiangebot" || f.erledigt) return;
      if (jahr < f.frist) return;
      const t = bleibenNach.find((x) => x.id === f.talentId);
      f.erledigt = "frist";
      if (!t) return;
      a.bilanz.profis++;
      if (f.peak >= 85) a.bilanz.weltklasse++;
      if (f.ns) a.bilanz.nationalspieler++;
      a.absolventen.push({ id: t.id, name: t.name, flag: t.flag, nat: t.nat, pos: t.pos,
        ein: t.ein, raus: jahr, peak: f.peak, ns: f.ns, klub: f.klub, klubLiga: f.klubLiga });
      const i = bleibenNach.indexOf(t);
      if (i >= 0) bleibenNach.splice(i, 1);
      E.push({ art: "weg", txt: t.name + " hat lange genug gewartet und bei "
        + f.klub + " unterschrieben." });
    });
    a.faelle = (a.faelle || []).filter((f) => !f.erledigt);

    /* 3. Neuer Jahrgang */
    const anzahl = Math.max(1, ri(1, 2) + Math.round(S.scouting * .7));
    /* Erst der Regelfall, dann die Absicherung: ist im ganzen Haus kein
       Torwart, wird der erste Neuzugang einer. Greift nur im Notfall und
       verschiebt die Verteilung deshalb kaum. */
    for (let i = 0; i < anzahl; i++) {
      const keinTW = !bleibenNach.some((t) => t.pos === "TW");
      bleibenNach.push(talentBauen(a, jahr, (i === 0 && keinTW) ? "TW" : null));
      a.bilanz.aufgenommen++;
    }
    E.push({ art: "neu", txt: anzahl + " neue Talente aufgenommen." });

    /* 4. Jugendturnier (Namen und Gegner seit 35.34)
       -------------------------------------------------------------------------
       Bis 35.33 stand hier EIN Satz: "Sieg beim internationalen Jugendturnier."
       Bei vollem Ausbau erscheint der 14-mal in 25 Chronikeintraegen (gemessen),
       immer wortgleich, ohne Turnier und ohne Gegner.

       WAS SICH NICHT AENDERT: die Siegwahrscheinlichkeit. Sie steht Zeichen fuer
       Zeichen wie vorher da. `bilanz.turniere` zaehlt weiter nur Siege und geht
       mit Faktor 6 in `akaRuhm` ein — ruehrte ich daran, verschoebe ich die
       Zielbaender in `kalibrierung.cjs` und damit die halbe Akademie. Sichtbar
       machen heisst hier: sichtbar machen, nicht neu ausbalancieren.

       WAS DAZUKOMMT: in Jahren OHNE Sieg wird ausgespielt, ob die Akademie
       ueberhaupt dabei war. Das haengt allein an `buehne` — der Abteilung, die
       "Turniere, Sichtungsspiele" verspricht und bis jetzt nichts zeigte, solange
       man nicht gewann. Diese Teilnahme zaehlt NIRGENDS mit: kein Zaehler, kein
       Ruhm, keine Bilanz. Sie steht in der Chronik und sonst nirgends.

       Der Gegner kommt aus CLUBS, nicht aus einer zweiten Liste. Eine eigene
       Gegnerliste waere beim naechsten neuen Verein stumm veraltet. */
    const staerke = bleibenNach.length
      ? bleibenNach.reduce((s, t) => s + t.ovr, 0) / bleibenNach.length : 0;
    const turnier = pick(JUGENDTURNIERE);
    const gegner = pick(CLUBS.filter((c) => c.g === "m" && c.s >= 78)) || CLUBS[0];
    if (chance(clamp((staerke - 44) * .035 + S.buehne * .05, .02, .72))) {
      a.bilanz.turniere++;
      E.push({ art: "titel", txt: "Sieg beim " + turnier + " — im Endspiel gegen "
        + gegner.n + " U19." });
    } else if (chance(clamp(S.buehne * .13, 0, .78))) {
      E.push({ art: "turnier", txt: "Beim " + turnier + " " + pick(TURNIER_AUS)
        + " an " + gegner.n + " U19 gescheitert." });
    }

    a.talente = bleibenNach.sort((x, y) => y.ovr - x.ovr);
    a.absolventen = a.absolventen.sort((x, y) => y.peak - x.peak).slice(0, 40);
    a.jahrgaenge++;
    a.jahr = jahr;
    a.ruhm = akaRuhm(a);
    a.chronik = [{ jahr, e: E }, ...a.chronik].slice(0, 25);
    return { a, ereignisse: E };
  }

  const akaRuhm = (a) => {
    const b = a.bilanz || {};
    return Math.round((b.profis || 0) * 2 + (b.weltklasse || 0) * 14
      + (b.nationalspieler || 0) * 5 + (b.turniere || 0) * 6);
  };

  /* Was die Akademie einer neuen Laufbahn mitgibt. Absichtlich gedeckelt:
     Es soll sich lohnen, aber das Spiel nicht zerlegen.

     35.39: die DECKEL sind unveraendert (+4 / +6 / +100 Tsd. / +6 %), die
     SCHWELLEN sind gesenkt. Gemessen (40 Laeufe je Ausbaustufe, Median):

       Stufe 1  (     0 VC)  gab NIE etwas, auch nach 30 Jahren nicht
       Stufe 2  (   181 VC)  gab NIE etwas
       Stufe 3  (   519 VC)  erste Gabe im 18. Jahr, Anlage +1 im 28.
       Stufe 4  ( 1.061 VC)  erste Gabe im  7. Jahr
       Stufe 6  ( 2.912 VC)  erste Gabe im  4. Jahr

     Wer die ersten Ausbaustufen kauft, bekam ueber ein Dutzend Laufbahnen
     hinweg NULL zurueck — und seit 35.32 zeigt der Rueckblick dann korrekt gar
     keine Zeile. Die Rueckkopplung, die den Ausbau lohnend anfuehlen laesst,
     setzte erst bei Stufe 4 bis 5 ein.

     `akaRuhm` bleibt UNANGETASTET. Die Errungenschaft „Ansehen von 150" und
     jedes Zielband der Kalibrierung haengen an der Ruhmskala; nur was man dafuer
     bekommt, aendert sich. Das ist der chirurgische Schnitt.

     GRUNDGABE: wer eine Akademie GEGRUENDET hat, bekommt +1 Bekanntheit, auch
     bei Ansehen 0. Nicht viel — aber die Zeile im Rueckblick erscheint ab dem
     ersten Tag, und der Spieler sieht, dass die Sache ueberhaupt wirkt. */
  const AKA_SCHWELLE = { pot: 28, rep: 18, money: 12, dev: 45 };
  function akaBonus(a) {
    const r = (a && a.ruhm) || 0;
    const gegruendet = !!(a && a.gegruendet);
    return {
      pot:   Math.min(4, Math.floor(r / AKA_SCHWELLE.pot)),
      rep:   Math.min(6, (gegruendet ? 1 : 0) + Math.floor(r / AKA_SCHWELLE.rep)),
      money: Math.min(.10, Math.floor(r / AKA_SCHWELLE.money) * .01),
      dev:   Math.min(.06, Math.floor(r / AKA_SCHWELLE.dev) * .02),
      ruhm:  r,
    };
  }
  /* Wieviel Ansehen fehlt bis zur naechsten Gabe? Gibt null zurueck, wenn alles
     ausgereizt ist. EINE Quelle mit akaBonus — eine zweite, von Hand gepflegte
     Schwellenliste in der Anzeige waere beim naechsten Zahlendreh stumm falsch
     geworden, und der Spieler haette einer Zahl geglaubt, die nicht stimmt. */
  function akaNaechsteGabe(a) {
    const jetzt = akaBonus(a);
    const r = (a && a.ruhm) || 0;
    for (let x = r + 1; x <= r + 400; x++) {
      const b = akaBonus({ ...(a || {}), ruhm: x });
      if (b.pot > jetzt.pot)   return { fehlt: x - r, was: "Anlage +" + b.pot };
      if (b.rep > jetzt.rep)   return { fehlt: x - r, was: "Bekanntheit +" + b.rep };
      if (b.money > jetzt.money) return { fehlt: x - r, was: "Startkapital +" + (b.money * 1000).toFixed(0) + " Tsd. €" };
      if (b.dev > jetzt.dev)   return { fehlt: x - r, was: "Entwicklung +" + Math.round(b.dev * 100) + " %" };
    }
    return null;
  }
  const akaBonusText = (b) => {
    const L = [];
    if (b.pot)   L.push("Anlage +" + b.pot);
    if (b.rep)   L.push("Bekanntheit +" + b.rep);
    if (b.money) L.push("Startkapital +" + (b.money * 1000).toFixed(0) + " Tsd. €");
    if (b.dev)   L.push("Entwicklung +" + Math.round(b.dev * 100) + " %");
    return L;
  };

  /* VC gutschreiben und — sofern gegründet — ein Jahr weiterlaufen lassen */
  function akaVerbuchen(a0, vc, weltjahr) {
    const a = { ...leereAkademie(), ...(a0 || {}),
      stufen: { ...leereAkademie().stufen, ...((a0 && a0.stufen) || {}) },
      bilanz: { ...leereAkademie().bilanz, ...((a0 && a0.bilanz) || {}) } };
    a.vc = (a.vc || 0) + vc;
    a.verdient = (a.verdient || 0) + vc;
    if (!a.gegruendet) return { a, ereignisse: [] };
    return akaJahr(a, (a.jahr || 2026) + 1);
  }

  /* Gründung: drei Jahrgänge auf einmal, damit nicht vier Laufbahnen lang
     nichts passiert. */
  function akaGruenden(a0, name, jahr) {
    const a = { ...leereAkademie(), ...(a0 || {}) };
    a.name = (name || "").trim() || "Nachwuchszentrum";
    a.gegruendet = jahr || 2026;
    a.jahr = jahr || 2026;
    a.talente = [];
    [17, 16, 15].forEach((alt) => {
      const n = Math.max(1, ri(1, 2) + Math.round(a.stufen.scouting * .7));
      for (let i = 0; i < n; i++) {
        const t = talentBauen(a, a.jahr - (alt - 15));
        t.alter = alt;
        t.ovr = clamp(t.ovr + (alt - 15) * ri(2, 4), t.ovr, t.pot);
        a.talente.push(t);
        a.bilanz.aufgenommen++;
      }
    });
    a.talente.sort((x, y) => y.ovr - x.ovr);
    a.chronik = [{ jahr: a.jahr, e: [{ art: "titel", txt: a.name + " wird gegründet." }] }];
    return a;
  }

  /* Was als Nächstes drin wäre — und wie weit es noch ist. Das ist der Faden,
     an dem die ganze Motivation hängt: Es soll immer ein sichtbares nächstes
     Ziel geben, das in greifbarer Nähe liegt. */
  function akaNaechster(a) {
    let best = null;
    ABTEILUNGEN.forEach((x) => {
      const preis = akaPreis(a, x.id);
      if (preis == null) return;
      if (!best || preis < best.preis) best = { abt: x, preis, stufe: akaStufe(a, x.id) };
    });
    if (!best) return null;
    const vc = (a && a.vc) || 0;
    return { ...best, fehlt: Math.max(0, best.preis - vc), reicht: vc >= best.preis,
      anteil: Math.min(1, vc / best.preis) };
  }
  /* Wie viele Abteilungen könnte man sich gerade leisten? */
  const akaLeistbar = (a) => ABTEILUNGEN.filter((x) => {
    const pr = akaPreis(a, x.id); return pr != null && ((a && a.vc) || 0) >= pr; }).length;

  return {
    ABTEILUNGEN, AKA_MAX, AKA_STUFEN,
    leereAkademie, akaJahrNr, akaJahrgang, akaStufe, akaSumme, akaAusbau,
    akaPreis, akaRestkosten, akaSpanne, akaLeistbar,
    akaJahr, akaBonus, akaBonusText, akaNaechsteGabe, akaNaechster,
    akaVerbuchen, akaGruenden,
    freigeben, behalten, unterVertrag, vertragVon, AKA_HOECHSTALTER,
    talentAuslaufen, aussortieren,
    /* Diese drei braucht App.jsx selbst nicht — wohl aber der Pruefstand:
       sie stehen in pruefstand/exporte.txt. Beim Auszug waren sie zuerst
       nicht dabei, und esbuild hat es sofort gemeldet ("is not declared in
       this file"). Ein Werkzeug, das den Kern nicht mehr einzeln pruefen
       kann, faellt still aus — deshalb gehen sie mit. */
    AKA_SCHWELLE, akaRuhm, talentBauen,
  };
};
