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
  /* ================= ZWEI SCHRITTE STATT EINEM (35.67) ===================
     Kevin: „ich faende es sinnvoller, wenn die Vereinserstellung (Wappen,
     Name etc.) kommt, wenn man das erste Mal ‚Dein Verein' anklickt, nachdem
     man es freigeschaltet hat. Lediglich die Ligawahl sollte beim Punkt der
     Profimannschaft bleiben."

     Das ist inhaltlich richtig: das Dach heisst „Dein Verein", und die
     Jugendakademie gehoert ihm genauso wie die Profimannschaft. Wer sie
     betritt, sollte wissen, fuer wen er ausbildet.

     Deshalb zerfaellt die Gruendung in zwei Schritte:
       KENNUNG   Name, Stadt, Wappen, Farben — beim ersten Betreten des Dachs,
                 zwingend (Kevins Entscheidung: „ohne Verein kommt man nicht
                 in die Akademie").
       SPIELBETRIEB   Land und Liga — erst bei der Profimannschaft.

     `gekannt` und `gegruendet` sind deshalb ZWEI Merker. Sie zusammenzulegen
     waere die naheliegende Vereinfachung und die falsche: zwischen beiden
     Schritten liegen unter Umstaenden drei Laufbahnen, und in dieser Zeit
     muss der Verein einen Namen haben, ohne im Spielbetrieb zu sein.        */
  const kennungSetzen = (v0, { name, stadt, farben, wappen }) => {
    const v = { ...leererVerein(), ...v0 };
    const n = String(name || "").trim();
    if (!n) return { v, fehler: "Ohne Namen geht es nicht." };
    return {
      v: { ...v, gekannt: true, name: n, stadt: stadt || "",
           farben: farben || v.farben, wappen: wappen || v.wappen },
      fehler: null,
    };
  };

  const gruenden = (v0, { name, stadt, land, liga, farben, weltjahr }) => {
    const v = { ...leererVerein(), ...v0 };
    const moeglich = startligen(land);
    if (!moeglich.length) return { v, fehler: "Für dieses Land gibt es keine Liga." };
    const gewaehlt = moeglich.includes(liga) ? liga : moeglich[0];
    /* Name und Farben kommen jetzt normalerweise aus der Kennung. Die
       Uebergaben bleiben trotzdem erlaubt: alte Spielstaende haben `gekannt`
       nicht, und der Pruefstand ruft `gruenden` an vielen Stellen in einem
       Zug auf. Wer beides mitgibt, bekommt beides — wer nichts mitgibt,
       behaelt, was in der Kennung steht. */
    return {
      /* `gegruendet` traegt seit 35.119 das KALENDERJAHR statt `true`.
         Die Akademie macht das laengst so (`a.gegruendet: 2026`), der Verein
         zaehlte nur seine eigenen fuenfzehn Jahre und wusste nicht, WANN sie
         in der Rasenschach-Welt lagen. Fuer die Meta-Zeitleiste ist genau das
         noetig — „Vereinsgruendung" muss sich neben „Akademiegruendung" und
         den Laufbahnen einsortieren lassen.

         RUECKWAERTSVERTRAEGLICH OHNE MIGRATION: alle achtzehn Lesestellen
         pruefen nur auf Wahrheitswert (`verein && verein.gegruendet`), keine
         vergleicht mit `true` oder `=== true` — nachgezaehlt vor der
         Umstellung. Eine Jahreszahl ist genauso wahr. Alte Spielstaende
         tragen weiter `true` und funktionieren unveraendert; sie erscheinen
         in der Zeitleiste ohne Jahr.

         Faellt kein `weltjahr` herein, bleibt es bei `true` — dann ist es
         wie vorher und nichts bricht. */
      v: { ...v, gegruendet: weltjahr || true, gekannt: true,
           name: String(name || "").trim() || v.name || "Neuer Verein",
           stadt: stadt || v.stadt || "", land, liga: gewaehlt, jahr: 1,
           farben: farben || v.farben, kader: [], chronik: [] },
      fehler: null,
    };
  };

  /* ----------------------------------------------------- Kader hochziehen */
  /* Aus einem Akademietalent wird ein Kaderspieler. Bewusst dieselben Felder
     wie beim Talent plus die, die nur im Verein eine Rolle spielen. */
  /* ================= Kadervertraege (35.54) ==============================
     Wie in der Akademie: `vertragBis` ist ein Weltjahr. Alte Spielstaende
     kennen das Feld nicht — `spVertrag` faengt das ab, indem es dann einen
     frischen Vertrag annimmt. Ohne diesen Rueckfall staende nach dem Einlegen
     der ganze Kader vertragslos da und wollte auf einmal weg. */
  const SP_VERTRAG = [2, 3];
  const spVertrag = (s, jahr) =>
    (s && s.vertragBis != null) ? s.vertragBis : jahr + SP_VERTRAG[0];

  /* Will er verlaengern? Hier werden `form` und `spiele` GELESEN — das ist der
     Leser, ohne den beide Felder seit 35.21 nur Zahlen waren.

     Vier Gruende, warum jemand gehen will:
       * er spielt nicht (Einsatzanteil)
       * es laeuft nicht (Form)
       * er ist zu gut fuer den Kader geworden
       * er ist alt und bekommt anderswo mehr Spielzeit
     Und einer, warum er bleibt: er ist lange hier. */
  const bleibeLust = (v, s, spieltage) => {
    const kader = v.kader || [];
    const schnitt = kader.length
      ? kader.reduce((a2, x) => a2 + x.ovr, 0) / kader.length : s.ovr;
    const anteil = Math.min(1, (s.spiele || 0) / Math.max(1, spieltage || 38));
    const form = (s.form == null ? 50 : s.form);
    const zuGut = Math.max(0, s.ovr - schnitt - 8);
    const alt = Math.max(0, (s.alter || 25) - 30);
    const treue = Math.min(3, s.jahreImVerein || 0);
    return clamp(0.52 + anteil * 0.42 + (form - 50) * 0.006
                 - zuGut * 0.030 - alt * 0.045 + treue * 0.035, 0.03, 0.99);
  };

  const alsSpieler = (t) => ({
    id: t.id, name: t.name, nat: t.nat, flag: t.flag, pos: t.pos,
    ovr: t.ovr, pot: t.pot, alter: t.alter,
    form: 50, fitness: 80, spiele: 0, tore: 0, jahreImVerein: 0,
  });

  /* Zieht ein Talent aus der Akademie in den Kader. Gibt beide neuen Zustaende
     zurueck; es wird NICHTS an den uebergebenen Objekten geaendert. */
  /* Wie ueberzeugend der eigene Verein auf ein Talent wirkt (35.53). Kevin:
     „Spieler, wenn sie besonders talentiert sind oder eigentlich deutlich zu
     gut fuer meinen eigenen Verein, koennen sich auch entscheiden, nicht zu
     meinem Verein zu gehen."

     Verglichen wird die ERWARTETE Endstaerke des Talents mit der Staerke der
     Mannschaft, nicht seine heutige: ein Sechzehnjaehriger mit 52 und Anlage
     88 ist heute schwaecher als die Elf und trotzdem zu gut fuer sie.
     Zurueckgegeben wird die Wahrscheinlichkeit, dass er JA sagt. */
  const ueberzeugt = (v, t) => {
    const st = staerke(v);
    const ziel = Math.max(t.ovr, t.pot || t.ovr);
    const abstand = ziel - (st.gesamt || 0);
    /* Bis etwa gleich stark: praktisch sicher. Ab rund 15 Punkten darueber
       wird es eng, ab 25 fast aussichtslos.
       DIE LIGASTUFE WIRKT MIT — wer in der ersten Liga spielt, ueberzeugt
       eher als ein Drittligist, auch bei gleicher Mannschaftsstaerke.
       Sie wird aus der Pyramide GEZAEHLT, nicht aus einer Tabelle geholt:
       ein erster Entwurf griff auf `TIER_BONUS` zu — das es nicht gibt. Der
       Ausdruck haette still 0 geliefert und die Ligastufe waere wirkungslos
       gewesen, ohne dass irgendetwas gemeldet haette. Genau die Bauart, die
       dieses Projekt schon mit `freigeschaltet().akademie` bezahlt hat. */
    const p2 = pyramide(v.land) || [];
    const stufe = p2.findIndex((t2) => t2.some((x) => x.liga === v.liga));
    const oben = stufe < 0 ? 0 : (p2.length - 1 - stufe);
    return clamp(1 - Math.max(0, abstand - 6) * 0.045 + oben * 0.05, 0.05, 1);
  };

  const hochziehen = (aka, v, talentId, opt = {}) => {
    const t = (aka.talente || []).find((x) => x.id === talentId);
    if (!t) return { aka, v, fehler: "Talent nicht gefunden." };
    if (t.alter < 16) return { aka, v, fehler: "Unter 16 wird niemand hochgezogen." };
    /* Der Wurf passiert NUR, wenn ausdruecklich danach gefragt wird
       (`opt.fragen`). Der alte Aufrufweg — Talent aus dem Jahrgang in den
       Kader — bleibt damit unveraendert; wer ein ANGEBOT ueberbietet, muss
       den Spieler ueberzeugen. Zwei verschiedene Vorgaenge, zwei Wege. */
    if (opt.fragen) {
      const p = ueberzeugt(v, t);
      if (!chance(p)) {
        return { aka, v, fehler: null, abgelehnt: true, wahrscheinlichkeit: p,
          text: t.name + " sieht sich in einer höheren Liga als " + v.liga + "." };
      }
    }
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
  /* ---- Entscheidungen ueber Abgangswuensche (35.54) ----------------------
     Rein, ohne Nebenwirkung, wie in der Akademie. */
  const vFall = (v, id) => (v.faelle || []).find((f) => f.id === id && !f.erledigt);

  const zustimmen = (v, fallId) => {
    const f = vFall(v, fallId);
    if (!f) return { v, fehler: "Fall nicht gefunden." };
    const s = (v.kader || []).find((x) => x.id === f.spielerId);
    if (!s) return { v, fehler: "Spieler nicht mehr im Kader." };
    /* Der Kader darf nicht unter das Minimum fallen — sonst steht die naechste
       Saison still, und zwar wegen einer Entscheidung, die harmlos aussah. */
    if ((v.kader || []).length - 1 < KADER_MIN)
      return { v, fehler: "Dann sind es nur noch " + ((v.kader || []).length - 1)
        + " Spieler — " + KADER_MIN + " sind das Minimum." };
    const nv = aufstellungSaeubern({ ...v,
      kader: (v.kader || []).filter((x) => x.id !== f.spielerId),
      faelle: (v.faelle || []).filter((x) => x.id !== fallId) });
    return { v: nv, fehler: null,
      text: f.name + " wechselt zu " + f.klub + "." };
  };

  /* Ablehnen heisst: er bleibt, der Vertrag laeuft weiter. Es kostet aber —
     wer gegen seinen Willen bleibt, spielt schlechter. Ohne diesen Preis waere
     Ablehnen immer richtig und die Entscheidung keine. */
  const ablehnen = (v, fallId, jahr) => {
    const f = vFall(v, fallId);
    if (!f) return { v, fehler: "Fall nicht gefunden." };
    const s = (v.kader || []).find((x) => x.id === f.spielerId);
    if (!s) return { v, fehler: "Spieler nicht mehr im Kader." };
    return { v: { ...v,
      kader: (v.kader || []).map((x) => x.id === s.id
        ? { ...x, vertragBis: jahr + 1, form: Math.max(20, (x.form == null ? 50 : x.form) - 12) }
        : x),
      faelle: (v.faelle || []).filter((x) => x.id !== fallId) },
      fehler: null,
      text: f.name + " bleibt — begeistert ist er nicht." };
  };

  /* Vertrag auslaufen lassen, mit Notiz. Umkehrbar, solange die Saison nicht
     gelaufen ist: eine Entscheidung, die man nicht zuruecknehmen kann, gehoert
     hinter eine Rueckfrage, und die gibt es hier nicht. */
  const auslaufenLassen = (v, spielerId, notiz) => {
    const s = (v.kader || []).find((x) => x.id === spielerId);
    if (!s) return { v, fehler: "Spieler nicht gefunden." };
    return { v: { ...v, kader: (v.kader || []).map((x) => x.id === spielerId
      ? { ...x, auslaufen: !x.auslaufen, notiz: !x.auslaufen ? (notiz || "") : undefined } : x) },
      fehler: null };
  };

  /* ================= Kader ausduennen (35.55, Stufe D) ===================
     Kevin: „Spieler einfach zu entfernen oder vielleicht sogar wieder in die
     Jugendakademie runterzuschicken, um den Kader auszuduennen, wenn Spieler
     dabei sind, die ich nicht haben moechte."

     Beide Wege haben DIESELBE Untergrenze: der Kader darf nicht unter
     KADER_MIN fallen. Ohne sie koennte man sich in eine Saison manoevrieren,
     die gar nicht stattfinden kann — und zwar mit zwei Tippern, deren Folge
     erst ein Jahr spaeter sichtbar wuerde. */
  const darfWeg = (v) => (v.kader || []).length - 1 >= KADER_MIN;

  /* Sofort und endgueltig. Anders als „Vertrag auslaufen lassen" (35.54) ist
     das NICHT umkehrbar — deshalb steht in der Anzeige eine Rueckfrage davor.
     Der Abschied wird gemerkt und wandert beim naechsten Saisonabschluss in
     die Chronik: die Chronik bleibt die eine Stelle, an der steht, wer wann
     gegangen ist. Zwei Stellen dafuer wuerden auseinanderlaufen. */
  const entlassen = (v, spielerId, notiz) => {
    const s = (v.kader || []).find((x) => x.id === spielerId);
    if (!s) return { v, fehler: "Spieler nicht gefunden." };
    if (!darfWeg(v)) return { v, fehler: "Dann sind es nur noch "
      + ((v.kader || []).length - 1) + " Spieler — " + KADER_MIN + " sind das Minimum." };
    const nv = aufstellungSaeubern({ ...v,
      kader: (v.kader || []).filter((x) => x.id !== spielerId),
      faelle: (v.faelle || []).filter((f) => f.spielerId !== spielerId),
      offeneAbschiede: [...(v.offeneAbschiede || []),
        { name: s.name, alter: s.alter, pos: s.pos, grund: "entlassen", notiz: notiz || "" }] });
    return { v: nv, fehler: null, text: s.name + " ist nicht mehr im Kader." };
  };

  /* Zurueck in die Jugend. Nur bis 19 — die Akademie laesst mit 21 jeden
     gehen (AKA_HOECHTSALTER dort), ein Zwanzigjaehriger haette also ein
     einziges Jahr und der Weg waere ein Etikett ohne Inhalt.
     Er kommt als Talent zurueck, mit frischem Akademievertrag. Was im Verein
     entstanden ist — Einsaetze, Tore, Karten — bleibt NICHT stehen: in der
     Jugend spielt er andere Spiele. */
  const ZURUECK_ALTER = 19;
  const alsTalent = (s, jahr) => ({
    id: s.id, name: s.name, nat: s.nat, flag: s.flag, pos: s.pos,
    ovr: s.ovr, pot: s.pot, alter: s.alter, ein: jahr, verletzt: 0, ruf: 0,
    vertragBis: jahr + 2, zurueck: true,
  });

  const zurueckInDieJugend = (aka, v, spielerId, jahr) => {
    const s = (v.kader || []).find((x) => x.id === spielerId);
    if (!s) return { aka, v, fehler: "Spieler nicht gefunden." };
    if (!aka || !aka.gegruendet) return { aka, v, fehler: "Es gibt keine Akademie." };
    if (s.alter > ZURUECK_ALTER)
      return { aka, v, fehler: s.name + " ist " + s.alter + " — über " + ZURUECK_ALTER
        + " nimmt die Jugend niemanden mehr." };
    if (!darfWeg(v)) return { aka, v, fehler: "Dann sind es nur noch "
      + ((v.kader || []).length - 1) + " Spieler — " + KADER_MIN + " sind das Minimum." };
    const nv = aufstellungSaeubern({ ...v,
      kader: (v.kader || []).filter((x) => x.id !== spielerId),
      faelle: (v.faelle || []).filter((f) => f.spielerId !== spielerId),
      offeneAbschiede: [...(v.offeneAbschiede || []),
        { name: s.name, alter: s.alter, pos: s.pos, grund: "jugend" }] });
    return { aka: { ...aka, talente: [...(aka.talente || []), alsTalent(s, jahr)] },
      v: nv, fehler: null,
      text: s.name + " spielt wieder in der Jugend." };
  };

  /* ---- Die Aufstellung als Feld (35.91) ----------------------------------
     Kevin: „Die Aufstellung der Karten sollte schon passend zur Aufstellung
     sein", mit einer Skizze:
                    TW
           AV   IV   IV   AV
                 ZM   ZM
           AF               AF
                    ST

     Ein Raster mit vier gleichen Spalten zeigt elf Karten, aber keine
     Aufstellung. Wer eine Formation waehlt, will sie SEHEN — sonst ist die
     Wahl eine Liste von Namen.

     DIE REIHEN KOMMEN AUS DER KENNUNG, nicht aus einer zweiten Tabelle. „442"
     heisst 4-4-2, also nach dem Torwart drei Reihen mit 4, 4 und 2 Spielern.
     Eine zweite Tabelle waere eine zweite Wahrheit ueber dieselbe Sache — und
     die laeuft irgendwann auseinander (siehe Reiterzeilen 35.59,
     Kachelraender 35.64).

     AUSSEN SIND DIE AUSSEN. Innerhalb einer Reihe wandern die
     Aussenpositionen (AV, AF) an die Raender, die zentralen in die Mitte.
     Ohne das stuenden bei 4-4-2 „IV IV AV AV" nebeneinander, und die Abwehr
     saehe aus, als haetten sich beide Aussenverteidiger auf eine Seite
     gestellt.                                                              */
  const AUSSEN = ["AV", "AF"];

  const reihenOrdnen = (pos) => {
    const aussen = pos.filter((x) => AUSSEN.indexOf(x) >= 0);
    const innen = pos.filter((x) => AUSSEN.indexOf(x) < 0);
    if (aussen.length < 2) return pos.slice();
    /* Erste und letzte nach aussen, der Rest bleibt in der Mitte. Bei drei
       Aussenspielern (kommt in keiner Formation vor, koennte aber) landet der
       dritte in der Mitte — besser als ihn wegzulassen. */
    return [aussen[0], ...innen, ...aussen.slice(2), aussen[1]];
  };

  /* Gibt die Plaetze als Reihen zurueck, jede mit ihren Stellen im
     Aufstellungsfeld. Die Stelle (`i`) muss mitwandern: die Aufstellung wird
     ueber sie gefuehrt, und nach dem Umsortieren stimmt die Reihenfolge im
     Feld nicht mehr mit der im Array ueberein. */
  const feldReihen = (formation) => {
    const F = FORMATIONEN.find((x) => x.id === formation) || FORMATIONEN[0];
    const ziffern = String(F.id).split("").map(Number).filter((n) => n > 0);
    const reihen = [];
    let k = 0;
    /* Der Torwart steht allein. */
    reihen.push([{ pos: F.plaetze[0], i: 0 }]);
    k = 1;
    ziffern.forEach((anz) => {
      const teil = [];
      for (let j = 0; j < anz && k < F.plaetze.length; j++, k++) {
        teil.push({ pos: F.plaetze[k], i: k });
      }
      if (!teil.length) return;
      /* Umsortieren, aber die Stellen mitnehmen. */
      const nurPos = teil.map((x) => x.pos);
      const geordnet = reihenOrdnen(nurPos);
      const genommen = {};
      reihen.push(geordnet.map((pz) => {
        const kandidat = teil.find((x) => x.pos === pz && !genommen[x.i]);
        if (kandidat) { genommen[kandidat.i] = true; return kandidat; }
        return teil.find((x) => !genommen[x.i]);
      }).filter(Boolean));
    });
    /* Reste (falls die Ziffern nicht aufgehen) hinten anhaengen — besser eine
       schiefe Reihe als ein fehlender Spieler. */
    while (k < F.plaetze.length) { reihen.push([{ pos: F.plaetze[k], i: k }]); k++; }
    return reihen;
  };

  const kaderVoll = (v) => (v.kader || []).length >= KADER_MIN;

  /* ---- Gezogene Karten in den Kader (35.85) ------------------------------
     Kevins Bedingung von Anfang an: „Gezogene Spieler kommen nur DAZU und
     sollen die Spieler aus der Akademie lediglich ERGAENZEN."

     Ohne Grenze waere das eine leere Zusage. Wer genug Packs kauft, haette
     eine ganze Mannschaft aus dem Laden — die Akademie waere dann nicht
     ersetzt, aber ueberfluessig, und das kommt aufs selbe heraus.

     PACK_ANTEIL sagt, welcher Teil des Kaders aus Packs stammen darf. Ein
     Drittel: die Elf steht dann immer mehrheitlich aus eigener Ausbildung,
     und die gezogenen Spieler sind Verstaerkung, nicht Grundstock.
     Gerechnet auf KADER_MIN, nicht auf die tatsaechliche Kadergroesse —
     sonst koennte man die Grenze umgehen, indem man erst Karten einsetzt und
     dann Talente hochzieht. */
  const PACK_ANTEIL = 1 / 3;
  const packImKader = (v) => (v.kader || []).filter((s) => s.ausPack).length;
  const packPlatz = (v) => Math.max(0, Math.floor(KADER_MIN * PACK_ANTEIL) - packImKader(v));

  /* Einen gezogenen Spieler wieder aus dem Kader nehmen (35.86). Er bleibt in
     der Sammlung — nur der Kaderplatz wird frei. Wer ihn ganz loswerden will,
     verkauft ihn im Laden; das sind zwei verschiedene Entscheidungen. */
  const karteEntfernen = (v0, kid) => {
    const v = { ...v0, kader: [...((v0 && v0.kader) || [])] };
    const i = v.kader.findIndex((s2) => s2.id === kid);
    if (i < 0) return { v: v0, fehler: "Der steht nicht im Kader." };
    if (!v.kader[i].ausPack) {
      return { v: v0, fehler: "Eigengewächse gehen über die Kaderverwaltung." };
    }
    v.kader.splice(i, 1);
    /* Die Aufstellung kann ihn noch enthalten — dann stuende dort ein Spieler,
       den es nicht mehr gibt. */
    if (v.elf) v.elf = v.elf.map((x) => (x === kid ? null : x));
    return { v, fehler: null };
  };

  const karteEinsetzen = (v0, karte) => {
    const v = { ...v0, kader: [...((v0 && v0.kader) || [])] };
    if (!v.gegruendet) return { v: v0, fehler: "Erst einen Verein gründen." };
    if (!karte) return { v: v0, fehler: "Keine Karte." };
    if (packPlatz(v) <= 0) {
      return { v: v0, fehler: "Höchstens " + Math.floor(KADER_MIN * PACK_ANTEIL)
        + " gezogene Spieler im Kader — der Rest kommt aus der Jugend." };
    }
    if (v.kader.some((s) => s.id === karte.kid)) {
      return { v: v0, fehler: "Der steht schon im Kader." };
    }
    v.kader.push({
      id: karte.kid, name: karte.name, nat: karte.nat, flag: karte.flag,
      pos: karte.pos, ovr: karte.ovr, pot: karte.pot, alter: karte.alter,
      form: 50, fitness: 80, spiele: 0, tore: 0, jahreImVerein: 0,
      /* DIE HERKUNFT BLEIBT AM SPIELER. Ohne sie liesse sich die Grenze nach
         dem naechsten Laden des Spielstands nicht mehr nachrechnen — und eine
         Grenze, die man nur beim Einsetzen kennt, ist keine. */
      ausPack: true, stufe: karte.stufe,
    });
    return { v, fehler: null };
  };

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

  /* ------------------------------------------------- Aufstellung von Hand
     Bis 35.48 gab es genau einen Weg auf den Platz: `autoAufstellen`. Kevins
     Einwand: "man hat da ja ueberhaupt keine Moeglichkeiten, andere Spieler
     aufzustellen". Ab 35.49 setzt man jeden Platz selbst; `autoAufstellen`
     bleibt als Vorschlag daneben stehen.

     ANGEBOTEN WIRD NUR, WER DORT SPIELEN KANN. Die GUETE-Tabelle kennt
     bewusst keinen Wert unter 0,6 — was schlechter passt, gilt als unmoeglich
     (siehe dort). Diese Regel hier zu umgehen hiesse, dem Spieler eine Wahl
     anzubieten, die `staerke` anschliessend als `fehlbesetzt` verrechnet und
     mit 24 bewertet. Eine Wahl, die stumm bestraft wird, ist keine. */
  const kandidaten = (v, platzIndex) => {
    const form = FORMATIONEN.find((f) => f.id === v.formation) || FORMATIONEN[0];
    const platz = form.plaetze[platzIndex];
    if (!platz) return [];
    const auf = v.aufstellung || {};
    /* Wo steht wer gerade? Damit die Liste sagen kann "spielt schon IV" —
       sonst waehlt man jemanden aus und wundert sich, dass anderswo eine
       Luecke entsteht. */
    const stehtAuf = {};
    Object.keys(auf).forEach((i) => { if (auf[i] != null) stehtAuf[auf[i]] = Number(i); });
    return (v.kader || [])
      .map((s) => {
        const g = guete(s.pos, platz);
        const wo = stehtAuf[s.id];
        return { sp: s, guete: g, wert: Math.round(s.ovr * g),
                 stehtAuf: wo == null ? null : wo,
                 stehtAufPlatz: wo == null ? null : form.plaetze[wo] };
      })
      .filter((k) => k.guete > 0)
      .sort((a, b) => b.wert - a.wert || a.sp.name.localeCompare(b.sp.name));
  };

  /* Setzt einen Spieler auf einen Platz. Steht er schon woanders, WECHSELN
     die beiden die Plaetze — er verschwindet nicht einfach von seinem alten.
     Ein stilles Loch an anderer Stelle waere die Sorte Nebenwirkung, die man
     erst in der Tabelle bemerkt. */
  const aufstellen = (v, platzIndex, spielerId) => {
    const form = FORMATIONEN.find((f) => f.id === v.formation) || FORMATIONEN[0];
    if (!form.plaetze[platzIndex]) return v;
    const sp = (v.kader || []).find((x) => x.id === spielerId);
    if (!sp) return v;
    if (!kannSpielen(sp, form.plaetze[platzIndex])) return v;
    const auf = { ...(v.aufstellung || {}) };
    const vorher = auf[platzIndex] != null ? auf[platzIndex] : null;
    let alterPlatz = null;
    Object.keys(auf).forEach((i) => { if (auf[i] === spielerId) alterPlatz = Number(i); });
    auf[platzIndex] = spielerId;
    if (alterPlatz != null && alterPlatz !== platzIndex) {
      /* Der Verdraengte rueckt auf den frei gewordenen Platz — wenn er dort
         spielen KANN. */
      const rueck = vorher != null ? (v.kader || []).find((x) => x.id === vorher) : null;
      if (rueck && kannSpielen(rueck, form.plaetze[alterPlatz])) auf[alterPlatz] = vorher;
      else {
        /* Kann er nicht, rueckt der staerkste Mann von der Bank nach, der es
           kann. GEFUNDEN 35.49 im vollen Lauf: der Teillauf traf zufaellig
           nur Faelle, in denen der Tausch aufging. Ohne dieses Nachruecken
           reisst ein einziges Antippen ein Loch an ganz anderer Stelle — die
           Mannschaft ist dann nicht mehr spielbereit, und der Grund steht
           sechs Zeilen weiter oben auf dem Schirm.
           Kein stiller Eingriff: der neue Name steht sofort in der Elf. Ein
           leerer Platz waere die unauffaelligere, aber schlechtere Antwort. */
        const drin = new Set(Object.values(auf).filter((x) => x != null));
        const bank = (v.kader || [])
          .filter((s) => !drin.has(s.id) && kannSpielen(s, form.plaetze[alterPlatz]))
          .sort((a, b) => b.ovr * guete(b.pos, form.plaetze[alterPlatz])
                        - a.ovr * guete(a.pos, form.plaetze[alterPlatz]));
        if (bank.length) auf[alterPlatz] = bank[0].id;
        else delete auf[alterPlatz];   /* niemand im Kader kann dort spielen */
      }
    }
    return { ...v, aufstellung: auf };
  };

  const freimachen = (v, platzIndex) => {
    const auf = { ...(v.aufstellung || {}) };
    delete auf[platzIndex];
    return { ...v, aufstellung: auf };
  };

  /* Nach einer Saison zeigen Plaetze auf Spieler, die aufgehoert haben. Bis
     35.48 wurde die Aufstellung deshalb komplett geleert. Das war richtig,
     solange sie ohnehin automatisch entstand — jetzt waere es die Handarbeit
     einer ganzen Saison, die nach jedem Durchgang verschwindet. Also nur die
     Geister entfernen, den Rest stehenlassen. Was frei wird, meldet `bedarf`. */
  const aufstellungSaeubern = (v) => {
    const form = FORMATIONEN.find((f) => f.id === v.formation) || FORMATIONEN[0];
    const da = new Set((v.kader || []).map((s) => s.id));
    const nachId = {};
    (v.kader || []).forEach((s) => (nachId[s.id] = s));
    const auf = {};
    Object.keys(v.aufstellung || {}).forEach((i) => {
      const id = v.aufstellung[i];
      const platz = form.plaetze[Number(i)];
      /* Auch die Formation kann sich geaendert haben: ein Platz, den es nicht
         mehr gibt, oder einer, auf dem der Spieler nicht mehr spielen kann. */
      if (id != null && da.has(id) && platz && kannSpielen(nachId[id], platz)) auf[i] = id;
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
    /* 35.52: GESPIELT statt gewuerfelt. Bis 35.51 stand hier
         const rang = Math.round(clamp(erwartet + gauss(0, 2.6 * st.risiko), 1, N));
         const tabelle = simTable(klub, rang);
       — also erst der Rang aus der Staerke, dann eine Tabelle darum herum.
       Torschuetzen und Einsaetze konnte es so nicht geben. Jetzt laeuft eine
       volle Hin- und Rueckrunde; Rang und Tabelle kommen aus den Ergebnissen.
       Die Eichung gegen die alte Verteilung steht bei `SAISONFORM`.
       `simTable` bleibt unangetastet — die Spielerlaufbahn benutzt sie
       weiter, und die ist von diesem Umbau nicht betroffen. */
    const erg = saisonSpielen(v);
    const N = erg.N;
    const rang = erg.rang == null ? N : erg.rang;
    const tabelle = erg.tabelle;

    const stufen = stufenVon(v.land, v.liga);
    const idx = stufen.findIndex((x) => x.liga === v.liga);
    const aufstieg = rang <= 2 && idx >= 0 && idx < stufen.length - 1;
    const abstieg = rang >= N - 1 && idx > 0;
    const neueLiga = aufstieg ? stufen[idx + 1].liga : abstieg ? stufen[idx - 1].liga : v.liga;

    /* Kader altert. Entwicklung wie in der Akademie: jung waechst, ab 30 faellt
       ab, mit 35 ist Schluss. Wer geht, taucht in der Chronik auf. */
    /* Die Saisonzahlen in den Kader schreiben. `spiele` und `tore` gab es seit
       35.21, sie wurden NIE beschrieben (offener Punkt 21). Jetzt tragen sie
       etwas — und `vorlagen`, `gelb`, `rot` kommen dazu. Alte Spielstaende
       kennen die neuen Felder nicht; `|| 0` faengt das ab. */
    const zahlen = {};
    (erg.spieler || []).forEach((x) => (zahlen[x.id] = x));
    /* Die Zahl der Spieltage kommt aus der Tabelle, nicht aus einer Konstante:
       eine Liga mit 18 Vereinen hat 34 Spiele, eine mit 20 hat 38. Eine fest
       verdrahtete 38 waere in jeder anderen Liga still falsch. */
    const spieltage = (erg.tabelle && erg.tabelle[0] ? erg.tabelle[0].sp : 38) || 38;
    /* Abschiede AUSSERHALB der Saison (35.55): entlassen oder in die Jugend
       geschickt. Sie stehen seit dem Tippen in `offeneAbschiede` und wandern
       jetzt in die Chronik — die eine Stelle, an der steht, wer wann ging. */
    const bleiben = [], weg = [], abschiede = [...(v.offeneAbschiede || [])];
    v.kader.forEach((s) => {
      const zs = zahlen[s.id];
      s.spiele = (s.spiele || 0) + (zs ? zs.spiele : 0);
      s.tore = (s.tore || 0) + (zs ? zs.tore : 0);
      s.vorlagen = (s.vorlagen || 0) + (zs ? zs.vorlagen : 0);
      s.gelb = (s.gelb || 0) + (zs ? zs.gelb : 0);
      s.rot = (s.rot || 0) + (zs ? zs.rot : 0);
      /* FORM aus der Saison (35.54). Das Feld gibt es seit 35.21 und wurde nie
         beschrieben — der letzte Rest von offenem Punkt 21. Es misst, ob
         jemand seiner Staerke gerecht wurde: viele Einsaetze und Beteiligung
         heben, eine Saison auf der Bank drueckt. Bewusst traege (halbe
         Annaeherung), damit ein einzelnes Jahr keinen Spieler umwirft.
         Gelesen wird es von der Verlaengerungsbereitschaft weiter unten —
         ohne Leser waere es wieder nur eine Zahl. */
      if (zs) {
        const anteil = zs.spiele / Math.max(1, spieltage);
        const beteiligt = (zs.tore + zs.vorlagen) / Math.max(1, zs.spiele);
        /* GEMESSEN 35.54: mit 38 + anteil·46 lag jeder Dauerspieler ueber der
           Obergrenze und bekam dieselbe 73 — Torjaeger wie Innenverteidiger.
           Eine Zahl, die fuer alle gleich ausfaellt, misst nichts. Jetzt
           landet eine volle Saison ohne Torbeteiligung bei rund 68, ein
           Torjaeger bei rund 85. */
        const ziel = clamp(30 + anteil * 38 + beteiligt * 30, 12, 96);
        s.form = Math.round(((s.form || 50) + ziel) / 2);
      } else {
        /* Kein einziger Einsatz: das drueckt, aber es zerstoert niemanden. */
        s.form = Math.round(((s.form || 50) * 0.72) + 8);
      }
      /* FITNESS (35.54) — der letzte tote Rest aus 35.21. Sie faellt mit dem
         Alter und mit vielen Spielen, erholt sich in einer ruhigen Saison.
         GELESEN wird sie in `saisonSpielen`: wer schlecht bei Kraeften ist,
         faellt oefter aus. Damit schliesst sich die Schleife — Fitness kostet
         Spiele, fehlende Spiele druecken die Form, die Form entscheidet ueber
         die Verlaengerung. Ein Feld ohne Leser waere wieder nur eine Zahl. */
      const last = zs ? zs.spiele / Math.max(1, spieltage) : 0;
      const altLast = Math.max(0, s.alter - 29) * 2.4;
      const med = (ausbauStufe(v, "medizin") - 1) * 1.8;
      s.fitness = Math.round(clamp((s.fitness == null ? 80 : s.fitness)
        + 7 - last * 9 - altLast + med, 35, 99));
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

    /* ---- Vertraege abwickeln (35.54) --------------------------------------
       Reihenfolge ist wichtig: erst altern und aussortieren, DANN Vertraege.
       Wer ohnehin aufhoert, braucht keinen Fall im Postkorb — ein Angebot fuer
       einen Spieler, der gerade seine Laufbahn beendet, waere Papier. */
    const jetzt = v.jahr;
    const faelleNeu = [];
    const noch = [];
    bleiben.forEach((s) => {
      const bis = spVertrag(s, jetzt);
      if (bis > jetzt + 1) { s.vertragBis = bis; noch.push(s); return; }

      /* Ich habe entschieden, ihn ziehen zu lassen. Kevins Wunsch: „dass ich
         die Moeglichkeit hab, Vertraege auslaufen zu lassen mit einer Notiz
         von mir." Die Notiz wandert in die Chronik — der Verein bekommt damit
         eine Erzaehlung und nicht nur Zahlen. */
      if (s.auslaufen) {
        weg.push(s);
        abschiede.push({ name: s.name, alter: s.alter, pos: s.pos,
          grund: "auslaufen", notiz: s.notiz || "" });
        return;
      }

      const lust = bleibeLust(v, s, spieltage);
      if (chance(lust)) {
        /* Verlaengert. STILL — ein Postkorb, der jedes Jahr mit zwanzig
           Verlaengerungen vollaeuft, ist keiner (dieselbe Ueberlegung wie in
           der Akademie 35.53). */
        s.vertragBis = jetzt + (chance(.5) ? SP_VERTRAG[0] : SP_VERTRAG[1]);
        noch.push(s);
        return;
      }

      /* Er will weg — und ein anderer Verein bietet an. Laeuft sein Vertrag
         noch (also bis jetzt+1), brauche ich zuzustimmen. Ist er schon
         abgelaufen, geht er ohne Rueckfrage. */
      const zielS = clamp(s.ovr + ri(-3, 6), 30, 92);
      const passend = CLUBS.filter((c) => Math.abs(c.s - zielS) <= 6);
      const klub = passend.length ? pick(passend)
        : CLUBS.reduce((b2, c) => (Math.abs(c.s - zielS) < Math.abs(b2.s - zielS) ? c : b2), CLUBS[0]);
      if (bis > jetzt) {
        faelleNeu.push({ id: "vf" + s.id + "_" + jetzt, art: "abgangswunsch",
          spielerId: s.id, name: s.name, flag: s.flag, pos: s.pos, alter: s.alter,
          ovr: s.ovr, form: s.form, spiele: s.spiele, klub: klub.n, klubLiga: klub.l,
          gestellt: jetzt, frist: jetzt + 1, vertragBis: bis, lust: Math.round(lust * 100) });
        s.vertragBis = bis;
        noch.push(s);
      } else {
        weg.push(s);
        abschiede.push({ name: s.name, alter: s.alter, pos: s.pos,
          grund: "ablösefrei", klub: klub.n });
      }
    });

    /* Fristen der offenen Faelle — dieselbe Regel wie in der Akademie:
       ein Jahr, danach entscheidet der Spieler. */
    const alte = (v.faelle || []).filter((f) => !f.erledigt);
    alte.forEach((f) => {
      if (jetzt < f.frist) { faelleNeu.push(f); return; }
      const i = noch.findIndex((s) => s.id === f.spielerId);
      if (i < 0) return;
      const s = noch[i];
      noch.splice(i, 1);
      weg.push(s);
      abschiede.push({ name: s.name, alter: s.alter, pos: s.pos,
        grund: "frist", klub: f.klub });
    });

    const eigene = { gf: erg.tore, ga: erg.gegentore, pts: erg.punkte };
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

    /* Aufstellung SAEUBERN statt leeren (35.49). Die Plaetze zeigen auf
       Spieler, von denen einige aufgehoert haben — die muessen raus, sonst
       zeigt der naechste Kaderaufbau auf Geister. Bis 35.48 wurde deshalb
       alles geleert. Seit es die Aufstellung von Hand gibt, waere das die
       Arbeit einer ganzen Saison, die nach jedem Durchgang verschwindet.
       Was dabei frei wird, meldet `bedarf` — es bleibt also sichtbar. */
    /* `noch` statt `bleiben`: nach der Vertragsabwicklung ist `noch` der
       wirkliche Kader. `bleiben` enthaelt auch die, die ueber einen Vertrag
       gegangen sind — die Aufstellung darf nicht auf sie zeigen. */
    const gesaeubert = aufstellungSaeubern({ ...v, kader: noch }).aufstellung;
    return {
      v: { ...v, jahr: v.jahr + 1, liga: neueLiga, kader: noch, aufstellung: gesaeubert,
           faelle: faelleNeu, offeneAbschiede: [],
           bilanz: neueBilanz,
           /* DAS ARCHIV (35.52). Kevins Wunsch: alle Jahre nachschlagbar.
              Je Jahr wandern die volle Abschlusstabelle und die Saisonzahlen
              der eigenen Spieler mit in die Chronik.
              WAS NICHT MITWANDERT, sind die einzelnen Spiele. 15 Jahre x 38
              Spiele x Torschuetzen waeren ueber tausend Eintraege im
              Spielstand, fuer eine Seite, die niemand zweimal aufschlaegt.
              Sie stehen deshalb nur fuer die LETZTE Saison unter `spiele` —
              dort, wo man sie liest. Eine Entscheidung, keine Vergesslichkeit;
              wer sie aendern will, weiss jetzt, was sie kostet. */
           chronik: [...v.chronik, { jahr: v.jahr, liga: v.liga, rang, N,
             staerke: st.gesamt, aufstieg, abstieg,
             punkte: erg.punkte, tore: erg.tore, gegentore: erg.gegentore,
             tabelle: erg.tabelle, spieler: erg.spieler,
             abgaenge: weg.map((s) => s.name + " (" + s.alter + ")"),
             abschiede }],
           spiele: erg.spiele },
      tabelle, rang, N, aufstieg, abstieg, staerke: st, abgaenge: weg,
      spiele: erg.spiele, spieler: erg.spieler, abschiede, faelle: faelleNeu,
      punkte: erg.punkte, tore: erg.tore, gegentore: erg.gegentore,
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
    /* KEINE ALTE MARKE MITNEHMEN (35.73). Seit der Abschluss am Verein
       gespeichert wird, muss der neue ausdruecklich OHNE dastehen — sonst
       zeigt der Vereinsbildschirm sofort wieder den Abschlussbericht des
       Vorgaengers, und man kaeme nie zur Gruendung.
       `leererVerein()` hat das Feld gar nicht; die Zeile steht trotzdem hier,
       weil sie die Absicht festhaelt und den Fall abfaengt, dass jemand
       `neuerVerein` spaeter auf einem bestehenden Verein aufbaut. */
    delete v.abgeschlossen;
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

  /* ======================== Die Spielmaschine (35.52) ====================
     Bis 35.51 gab es keine Spiele. `simTable` WUERFELTE eine Tabelle um einen
     Rang herum, der vorher aus der Staerke berechnet wurde — die Reihenfolge
     war also: Rang zuerst, Tabelle danach. Torschuetzen, Einsaetze und Karten
     konnte es so gar nicht geben; die Felder `spiele` und `tore` im Kader
     standen seit 35.21 leer da (offener Punkt 21).

     Jetzt umgekehrt: jeder Spieltag wird gespielt, aus den Ergebnissen
     entsteht die Tabelle, und aus der Tabelle der Rang.

     DIE EICHUNG IST DER EIGENTLICHE PUNKT. Die alte Formel streute den Rang
     mit sigma = 2,6 · Risiko um den Erwartungsrang (gemessen 35.52: Meister
     28 % bei Erwartungsrang 3, Abstieg 28,5 % bei Rang 17 von 20). Eine
     Spielsimulation, die enger oder breiter streut, verschiebt still den
     ganzen Vereinsfortschritt — Aufstiege kaemen doppelt so oft oder gar
     nicht mehr. Die Schrauben unten wurden gegen genau diese Grundlinie
     gedreht, nicht nach Gefuehl.                                            */

  const HEIMVORTEIL = 0.30;
  /* Erwartete Tore gegen einen Gegner. Flache Kennlinie: 10 Punkte Vorsprung
     sind rund ein halbes Tor. Steiler waere fussballerisch falsch — auch der
     Letzte gewinnt beim Ersten gelegentlich. */
  /* IN STREUUNGSEINHEITEN, nicht in rohen Punkten. Die Ligen sind
     unterschiedlich eng: die 3. Liga spannt 12 Staerkepunkte ueber 20
     Vereine (Streuung 2,9), die Bundesliga 29 ueber 18 (Streuung 7,5).
     Eine feste Steigung je Punkt taugt fuer beide nicht — erst gemessen
     35.52: mit 0,20 je Punkt gewann der Beste die 3. Liga 39-1-0 mit 170:5.
     Gerechnet wird deshalb der Abstand in Streuungen der eigenen Liga; die
     Schraube heisst dann „wie entscheidend ist Qualitaet", und sie bedeutet
     ueberall dasselbe. */
  const erwarteteTore = (zEigen, zGegner, heim, steigung) =>
    Math.max(0.18, 1.32 + (zEigen - zGegner) * steigung + (heim ? HEIMVORTEIL : -HEIMVORTEIL * 0.6));

  /* Poisson nach Knuth. Gedeckelt bei 9 — ein 12:0 im Spielbericht liest sich
     wie ein Fehler, auch wenn es rechnerisch geht. */
  const poisson = (lam) => {
    const L = Math.exp(-lam);
    let k = 0, p = 1;
    do { k++; p *= rnd(0, 1); } while (p > L && k < 40);
    return Math.min(9, k - 1);
  };

  /* Ein voller Spielplan: jeder gegen jeden, Hin- und Rueckrunde. Geliefert
     wird die fertige Tabelle und — nur fuer die eigene Mannschaft — die Liste
     der Spiele. Die Spiele der anderen interessieren niemanden und wuerden den
     Spielstand bei 20 Vereinen um 380 Eintraege je Jahr aufblaehen. */
  /* SAISONFORM. Eine Mannschaft ist nicht jedes Jahr gleich gut — Zugaenge,
     Trainerwechsel, Verletzungspech. Ohne diesen Faktor entsteht die ganze
     Streuung aus dem Spielzufall, und der laesst sich nur ueber die Steigung
     der Kennlinie drehen: flach genug fuer sigma 2,6 heisst dann so flach,
     dass Staerke kaum noch entscheidet (gemessen 35.52: bei Steigung 0,048
     streut ein Mittelfeldplatz mit sigma 4,3).
     Mit der Saisonform gehen beide Schrauben getrennt: die Steigung macht
     Spiele entscheidbar, die Form macht Jahre verschieden. */
  /* GEEICHT 35.52 gegen die alte Formel (20er Liga, 500 Saisons je Wert):

       Erwartungsrang   alt: Meister/Aufstieg   neu (0,45 / 1,1)
              1              58 % / 72 %             39 % / 66 %
              3              28 % / 42 %             15 % / 34 %
             17              Abstieg 28 %            Abstieg 24 %
       Streuung Mittelfeld   sigma 2,60              sigma 2,59
       Tore des Meisters     —                       84 in 38 Spielen

     Streuung und Aufstieg treffen. DER TITEL IST SCHWERER GEWORDEN, und das
     bleibt so: die alte Formel wuerfelte einen Rang, da kam die Eins mit
     fester Wahrscheinlichkeit. Jetzt muss man staerkere Mannschaften ueber
     38 Spiele wirklich ueberholen. Das ist kein Eichfehler, sondern der
     Unterschied zwischen Wuerfeln und Spielen — er gehoert hierher
     geschrieben, damit ihn niemand spaeter fuer einen haelt.

     ZWEI SCHRAUBEN, GETRENNT GEMESSEN: die Steigung macht Qualitaet
     entscheidend (und bestimmt damit, wie hoch die Ergebnisse ausfallen), die
     Saisonform macht Jahre verschieden. Ein erster Entwurf hatte nur die
     Steigung und musste sie auf 0,20 je Staerkepunkt treiben — dann gewann
     der Beste die 3. Liga 39-1-0 mit 170:5. Die Zahlen stimmten, das Spiel
     nicht. */
  const SAISONFORM = 1.1;
  const ligaSpielen = (teams0, meinIndex, risiko, steigung, formStreuung) => {
    const fs = formStreuung == null ? SAISONFORM : formStreuung;
    const N = teams0.length;
    const st = steigung == null ? 0.45 : steigung;
    /* Erst Saisonform aufschlagen, DANN normieren — sonst waere die Form
       relativ zu einer Streuung gerechnet, die sie selbst veraendert. */
    const roh = teams0.map((t) => t.s + gauss(0, fs));
    const mittel = roh.reduce((a, b2) => a + b2, 0) / Math.max(1, N);
    const sd = Math.max(1, Math.sqrt(roh.reduce((a, b2) => a + (b2 - mittel) ** 2, 0) / Math.max(1, N)));
    const teams = teams0.map((t, i) => ({ ...t, z: (roh[i] - mittel) / sd }));
    const tab = teams.map((t, i) => ({ i, name: t.n, s: teams0[i].s, sp: 0, w: 0, u: 0, n: 0,
                                       gf: 0, ga: 0, pkt: 0 }));
    const meine = [];
    /* Das Risiko der Taktik wirkt HIER statt auf den Rang: mehr Risiko heisst
       mehr Tore auf beiden Seiten, also groessere Ausschlaege ueber eine
       Saison. Dieselbe Wirkung wie vorher, an der richtigen Stelle. */
    const rf = risiko == null ? 1 : 0.72 + 0.28 * risiko * 1.0;
    for (let h = 0; h < N; h++) {
      for (let a = 0; a < N; a++) {
        if (h === a) continue;
        const ich = h === meinIndex || a === meinIndex;
        const f = ich ? rf : 1;
        const tH = poisson(erwarteteTore(teams[h].z, teams[a].z, true, st) * f);
        const tA = poisson(erwarteteTore(teams[a].z, teams[h].z, false, st) * f);
        tab[h].sp++; tab[a].sp++;
        tab[h].gf += tH; tab[h].ga += tA;
        tab[a].gf += tA; tab[a].ga += tH;
        if (tH > tA) { tab[h].w++; tab[a].n++; tab[h].pkt += 3; }
        else if (tH < tA) { tab[a].w++; tab[h].n++; tab[a].pkt += 3; }
        else { tab[h].u++; tab[a].u++; tab[h].pkt++; tab[a].pkt++; }
        if (ich) {
          const heim = h === meinIndex;
          meine.push({ heim, gegner: teams0[heim ? a : h].n,
                       eigene: heim ? tH : tA, fremde: heim ? tA : tH });
        }
      }
    }
    tab.sort((x, y) => y.pkt - x.pkt || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf
                       || String(x.name).localeCompare(String(y.name)));
    tab.forEach((z, i) => { z.pos = i + 1; });
    return { tabelle: tab, meine };
  };

  /* ---- Wer hat getroffen? ------------------------------------------------
     Es wird NICHT Minute fuer Minute gespielt. Die Tore eines Spiels stehen
     fest; verteilt werden sie auf die Elf, gewichtet nach Position und
     Staerke. Das ist der ehrliche Zuschnitt: ein Spielverlauf, den niemand
     sieht, waere Rechenzeit ohne Ertrag — aber WER getroffen hat, steht im
     Bericht und muss deshalb wirklich entschieden werden. */
  const TORNEIGUNG = { ST: 10, AF: 6.5, ZOM: 5, ZM: 2.2, ZDM: 1.1, AV: 0.9, IV: 0.8, TW: 0.02 };
  const VORNEIGUNG = { AF: 8, ZOM: 8, ZM: 4.5, AV: 4, ST: 3.5, ZDM: 1.4, IV: 0.7, TW: 0.05 };

  const wuerfelAus = (kandidaten, gewicht) => {
    if (!kandidaten.length) return null;
    let summe = 0;
    const g = kandidaten.map((k) => { const w = Math.max(0.01, gewicht(k)); summe += w; return w; });
    let z = rnd(0, summe);
    for (let i = 0; i < kandidaten.length; i++) { z -= g[i]; if (z <= 0) return kandidaten[i]; }
    return kandidaten[kandidaten.length - 1];
  };

  /* ---- Eine Saison der eigenen Mannschaft, mit allem drin (35.52) --------
     Liefert: Tabelle, die eigenen Spiele mit Torschuetzen, und je Spieler die
     Saisonzahlen. Der Kader wird NICHT veraendert — das macht `vereinSaison`.

     WAS HIER NICHT PASSIERT: Sperren und Verletzungen greifen nicht in die
     Aufstellung ein. Kevins Entscheidung 35.52: „nur anzeigen". Karten und
     verpasste Spiele entstehen INNERHALB der Saison und wirken dort (wer
     gesperrt ist, spielt dieses Spiel nicht mit) — danach stehen sie als
     Rueckblick da und nicht als offener Zustand, der die naechste Aufstellung
     blockiert. Deshalb heisst das Feld `verpasst` und nicht `gesperrtBis`:
     eine Zahl ueber Vergangenes kann niemand fuer eine Sperre halten. */
  const saisonSpielen = (v) => {
    const st = staerke(v);
    const form = FORMATIONEN.find((f) => f.id === v.formation) || FORMATIONEN[0];
    /* Der eigene Verein ERSETZT den schwaechsten der Liga, er kommt nicht
       dazu. Der erste Entwurf haengte ihn an — dann hatte die 3. Liga 21
       Mannschaften und 40 Spieltage, und `N` stimmte nicht mehr mit dem
       ueberein, was Auf- und Abstieg annehmen. Eine Liga hat eine feste
       Groesse; wer aufsteigt, nimmt jemandem den Platz weg. */
    const liga = (LEAGUES[v.liga] || []).slice().sort((a2, b2) => b2.s - a2.s);
    const teams = liga.slice(0, Math.max(1, liga.length - 1)).map((c) => ({ n: c.n, s: c.s }));
    const meinIndex = teams.length;
    teams.push({ n: v.name, s: st.gesamt });

    const { tabelle, meine } = ligaSpielen(teams, meinIndex, st.risiko);

    /* Die Elf und die Bank. Die Elf spielt, von der Bank kommt gelegentlich
       jemand — sonst haetten sechzehn Mann nie einen Einsatz, und der Kader
       waere eine Liste ohne Bedeutung. */
    const nachId = {}; (v.kader || []).forEach((sp) => (nachId[sp.id] = sp));
    const elf = Object.keys(v.aufstellung || {})
      .map((i) => ({ sp: nachId[v.aufstellung[i]], platz: form.plaetze[Number(i)] }))
      .filter((x) => x.sp);
    const bank = (v.kader || []).filter((sp) => !elf.some((e) => e.sp.id === sp.id));

    const z = {};
    (v.kader || []).forEach((sp) => (z[sp.id] = { id: sp.id, name: sp.name, pos: sp.pos,
      spiele: 0, tore: 0, vorlagen: 0, gelb: 0, rot: 0, verpasst: 0, note: 0 }));

    const spiele = [];
    let gesperrt = {};                       /* id -> noch zu verbuessende Spiele */
    meine.forEach((m) => {
      /* Wer gesperrt ist, spielt nicht mit — die Sperre wirkt INNERHALB der
         Saison, nicht darueber hinaus. */
      const raus = [];
      const dabei = elf.filter((e) => {
        if (gesperrt[e.sp.id] > 0) { gesperrt[e.sp.id]--; z[e.sp.id].verpasst++; raus.push(e.platz); return false; }
        /* FITNESS WIRKT (35.54). Wer schlecht bei Kraeften ist, faellt oefter
           aus. Bei 99 sind das rund 1,5 % der Spiele, bei 50 rund 9 %, bei 35
           rund 13 %. Klein genug, dass es niemanden aus der Elf draengt, gross
           genug, dass ein Kader mit lauter Ausgelaugten es merkt. */
        const fit = e.sp.fitness == null ? 80 : e.sp.fitness;
        if (chance(clamp((100 - fit) * 0.0026 + 0.012, 0.005, 0.2))) {
          z[e.sp.id].verpasst++; raus.push(e.platz); return false;
        }
        return true;
      });
      /* Fuer jeden gesperrten Platz rueckt jemand von der Bank nach, der ihn
         spielen kann — genau wie in der Aufstellung von Hand (35.49). */
      const drin = new Set(dabei.map((e) => e.sp.id));
      raus.forEach((platz) => {
        const frei = bank.filter((sp) => !drin.has(sp.id) && kannSpielen(sp, platz));
        if (frei.length) {
          const w = frei.sort((a2, b2) => b2.ovr * guete(b2.pos, platz) - a2.ovr * guete(a2.pos, platz))[0];
          dabei.push({ sp: w, platz }); drin.add(w.id);
        }
      });
      dabei.forEach((e) => { z[e.sp.id].spiele++; });

      /* Torschuetzen und Vorlagen. Feldspieler nach Neigung und Staerke. */
      const feld = dabei.filter((e) => e.platz !== "TW");
      const tore = [];
      for (let t = 0; t < m.eigene; t++) {
        const sch = wuerfelAus(feld, (e) => (TORNEIGUNG[e.platz] || 1) * (0.55 + e.sp.ovr / 100));
        if (!sch) break;
        z[sch.sp.id].tore++;
        let vor = null;
        if (chance(0.68)) {
          const kand = feld.filter((e) => e.sp.id !== sch.sp.id);
          vor = wuerfelAus(kand, (e) => (VORNEIGUNG[e.platz] || 1) * (0.55 + e.sp.ovr / 100));
          if (vor) z[vor.sp.id].vorlagen++;
        }
        tore.push({ sp: sch.sp.name, vor: vor ? vor.sp.name : null });
      }

      /* Karten. Rund 2,4 Gelbe und 0,09 Rote je Spiel — Defensive haeufiger.
         Rot heisst: zwei Spiele Sperre, und die wirkt sofort. */
      const KARTE = { IV: 1.6, ZDM: 1.6, AV: 1.3, ZM: 1.1, ZOM: .8, AF: .7, ST: .8, TW: .3 };
      const anzGelb = poisson(2.4);
      for (let g = 0; g < anzGelb; g++) {
        const k = wuerfelAus(dabei, (e) => KARTE[e.platz] || 1);
        if (k) z[k.sp.id].gelb++;
      }
      if (chance(0.09)) {
        const k = wuerfelAus(dabei, (e) => KARTE[e.platz] || 1);
        if (k) { z[k.sp.id].rot++; gesperrt[k.sp.id] = (gesperrt[k.sp.id] || 0) + 2; }
      }
      spiele.push({ heim: m.heim, gegner: m.gegner, eigene: m.eigene, fremde: m.fremde, tore });
    });

    const eigene = tabelle.find((r) => r.i === meinIndex) || null;
    return {
      tabelle: tabelle.map((r) => ({ name: r.name, pos: r.pos, sp: r.sp, w: r.w, u: r.u,
        n: r.n, gf: r.gf, ga: r.ga, pkt: r.pkt, me: r.i === meinIndex })),
      spiele,
      spieler: Object.values(z).filter((x) => x.spiele > 0)
        .sort((a2, b2) => b2.tore - a2.tore || b2.vorlagen - a2.vorlagen || b2.spiele - a2.spiele),
      rang: eigene ? eigene.pos : null,
      N: teams.length,
      punkte: eigene ? eigene.pkt : 0,
      tore: eigene ? eigene.gf : 0,
      gegentore: eigene ? eigene.ga : 0,
    };
  };

  return { KADER_MIN, VEREIN_JAHRE, FORMATIONEN, TAKTIKEN, GUETE,
           leererVerein, gruenden, kennungSetzen, pyramide, stufenVon, startligen,
           hochziehen, kaderVoll, bedarf, startklar, alsSpieler, guete, kannSpielen,
           karteEinsetzen, karteEntfernen, packPlatz, packImKader, PACK_ANTEIL,
           feldReihen, reihenOrdnen,
           staerke, autoAufstellen, vereinSaison, einschreiben, spieltMit,
           ligaSpielen, erwarteteTore, poisson, saisonSpielen,
           kandidaten, aufstellen, freimachen, aufstellungSaeubern, ueberzeugt,
           zustimmen, ablehnen, auslaufenLassen, bleibeLust, spVertrag,
           entlassen, zurueckInDieJugend, ZURUECK_ALTER,
           FREI_AKADEMIE, FREI_VEREIN, freigeschaltet,
           VEREIN_AUSBAU, AUSBAU_MAX, ausbauStufe, ausbauKosten, ausbauen,
           BONI, punkte, abschluss, neuerVerein };
};
