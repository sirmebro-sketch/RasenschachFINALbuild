/* karten.js — Sammelkarten für Rasenschach XI (seit 35.79)
   ==========================================================================
   Kevin: „Generell, dass jeder Spieler — auch Spieler aus der Jugendakademie —
   dann als eine Art Sammelkarte behandelt und designt wird."

   Und die Entscheidung, die alles andere traegt: „Gezogene Spieler kommen nur
   dazu und sollen die Spieler aus der Akademie lediglich ergaenzen."
   Die Akademie bleibt das Herz. Karten sind Zugabe, nicht Ersatz.

   DIESE DATEI IST DAS FUNDAMENT, nicht das fertige System. Sie kann:
     * aus jeder der drei Spielerformen eine Karte machen
     * die Seltenheit aus der Staerke ableiten
     * einen dauerhaften Pool fuehren, der Vereinswechsel ueberlebt
   Packs, Ziehung und Kartenoptik kommen danach — jedes fuer sich pruefbar.

   WARUM EINE EIGENE DATEI: App.jsx hat 14.800 Zeilen und ist als Punkt 10 in
   STAND.md als zu gross vermerkt. Ein neues System gehoert nicht hinein.
   Dasselbe Vorgehen wie bei akademie.js (35.48) und verein.js.              */

export const machKarten = (H) => {
  const { NATIONS, NAT_BY_ID, REGION_KEYS, chance, clamp, gauss, genName, pick, ri } = H;

  /* ---- Seltenheit -------------------------------------------------------
     GEMESSEN, nicht geraten. Ueber 539 echte Spieler aus Akademie und Kader:
       Akademieabsolventen   38 bis 77, Median 62
       Kaderspieler          61 bis 78, Median 69
       Ruhmeshalle (Peak)    deutlich hoeher, 70 bis 95

     Perzentile waeren hier falsch: die Verteilung ist so schmal, dass Gold auf
     einen einzigen Wert zusammenfiele (gemessen: genau 71). Feste Grenzen
     geben jeder Quelle eine eigene Handschrift, und genau das soll die Stufe
     erzaehlen:
       Akademie   45 % bronze · 52 % silber ·  3 % gold
       Kader       3 % bronze · 54 % silber · 43 % gold
       Halle                    10 % silber · 50 % gold · 40 % legendaer
     Wer eine goldene Karte sieht, weiss ungefaehr, woher sie kommt.          */
  const STUFEN = {
    bronze:  { n: "Bronze",    ab:  0, farbe: "#A5713C", w: 1 },
    silber:  { n: "Silber",    ab: 62, farbe: "#9AA5B4", w: 2 },
    gold:    { n: "Gold",      ab: 72, farbe: "#C7A24B", w: 3 },
    legende: { n: "Legendär",  ab: 82, farbe: "#F3E7BE", w: 4 },
  };
  const REIHE = ["bronze", "silber", "gold", "legende"];

  const stufeFuer = (ovr) => {
    const o = Number(ovr) || 0;
    /* Von oben nach unten, sonst gewinnt immer Bronze. */
    for (let i = REIHE.length - 1; i >= 0; i--) {
      if (o >= STUFEN[REIHE[i]].ab) return REIHE[i];
    }
    return "bronze";
  };

  /* ---- Aus den drei Spielerformen eine Karte ----------------------------
     Gemessen, was die drei Quellen gemeinsam haben:
       Talent      id name nat flag pos alter ovr pot ein verletzt ruf vertragBis
       Kaderspieler id name pos ovr pot alter flag form fitness spiele tore …
       Halleneintrag name pos nat age score peak titles caps goals …

     Gemeinsam sind: Name, Position, Staerke, Alter, Flagge. Der Rest ist
     quellenabhaengig und wandert nach `zusatz` — dort geht nichts verloren,
     und die Karte muss trotzdem nicht jede Form kennen.

     DIE HERKUNFT WIRD MITGESCHRIEBEN. Sie ist kein Zierrat: Kevin will, dass
     ein neuer Verein „mind. 3 aus der vorherigen Mannschaft und mind. 1 aus
     der Ruhmeshalle" bekommt. Ohne Herkunft laesst sich das nicht ziehen.   */
  /* AUS EINEM ABSOLVENTEN, NICHT AUS EINEM TALENT (35.124).

     Diese Funktion hiess `ausTalent`, nahm ein laufendes Talent entgegen —
     und WURDE NIE AUFGERUFEN. Sie stand seit ihrer Einfuehrung als toter
     Code da, waehrend die Kartenansicht bereits „· aus der Jugend" fuer
     `herkunft === "akademie"` vorsah: eine Anzeige, die auf Karten wartete,
     die nie entstanden.

     Der Grund war der falsche Zeitpunkt. Ein laufendes Talent hat noch keine
     Geschichte; erst der ABSOLVENT hat eine — Jahrgang, Abgangsjahr,
     erreichte Hoechststaerke, erster Profiklub. Genau das steht in
     `a.absolventen`, und genau daraus wird jetzt die Karte.

     DIE KENNUNG BLEIBT `t:` + id. Der Absolvent traegt dieselbe `id` wie das
     Talent, aus dem er wurde. Damit ist die Identitaet ueber alle Systeme
     hinweg derselbe String, ohne neues Feld und ohne Aenderung an der
     Zusammenfuehrung im Pool — die Antwort auf Frage 4 des Meta-Papiers. */
  const ausAbsolvent = (t) => ({
    kid: "t:" + t.id,
    name: t.name, pos: t.pos, ovr: t.peak || t.ovr || 0, pot: t.peak || t.pot || 0,
    alter: (t.raus && t.ein) ? (t.raus - t.ein) + 17 : (t.alter || 21),
    flag: t.flag || "", nat: t.nat || "",
    stufe: stufeFuer(t.peak || t.ovr || 0), herkunft: "akademie",
    jahr: t.raus || t.ein || null,
    /* Der Jahrgang ist das, was die Karte erzaehlbar macht: „Eigengewaechs,
       Jahrgang 2030". Der erste Profiklub steht daneben, wenn es ihn gibt. */
    zusatz: { jahrgang: t.ein || null, klub: t.klub || "", ns: !!t.ns },
  });

  const ausKader = (s, vereinName, jahr) => ({
    kid: "k:" + s.id,
    name: s.name, pos: s.pos, ovr: s.ovr, pot: s.pot,
    alter: s.alter, flag: s.flag || "", nat: s.nat || "",
    stufe: stufeFuer(s.ovr), herkunft: "verein", verein: vereinName || "",
    jahr: jahr || null,
    zusatz: { spiele: s.spiele || 0, tore: s.tore || 0,
              jahreImVerein: s.jahreImVerein || 0 },
  });

  /* Die Halle fuehrt `age` und `peak`, nicht `alter` und `ovr`. Eine Karte
     aus einer beendeten Laufbahn zeigt den BESTWERT, nicht den Stand beim
     Ruecktritt — sonst waere eine Legende eine Karte mit 58, weil sie mit
     achtunddreissig aufgehoert hat. */
  const ausHalle = (h, i) => ({
    kid: "h:" + i + ":" + (h.name || ""),
    name: h.name, pos: h.pos, ovr: h.peak || 0, pot: h.peak || 0,
    alter: h.age || 0, flag: h.nat || "", nat: h.natId || "",
    stufe: stufeFuer(h.peak), herkunft: "halle", jahr: h.bis || null,
    zusatz: { score: h.score, titel: h.titles, tore: h.goals,
              laenderspiele: h.caps, wildcard: h.wc || null,
              rahmen: h.rahmen || null },
  });

  /* ---- Der dauerhafte Pool ----------------------------------------------
     Kevin: „Wenn eine Profimannschaft durchgespielt wurde, werden alle Spieler
     in den Pool fuer die Karten mit aufgenommen, dauerhaft."

     DAUERHAFT heisst: er ueberlebt den Vereinswechsel. Alles andere ueber den
     eigenen Verein liegt AM Verein — und der wird nach fuenfzehn Jahren
     ersetzt. Genau daran ist in 35.73 der Abschlussbonus verlorengegangen.
     Der Pool liegt deshalb in einem eigenen Speicher.

     DOPPELTE WERDEN ZUSAMMENGEFUEHRT, nicht angehaengt: ein Spieler, der
     dreimal in verschiedenen Vereinen auftauchte, ist EINE Karte. Sonst
     verwaessert jeder Durchlauf den Pool mit Wiederholungen, und ein Pack
     zoege dreimal denselben Mann.
     Zusammengefuehrt wird auf den BESSEREN Wert — die Karte zeigt, was der
     Spieler konnte, nicht was er zuletzt war.                               */
  const leererPool = () => ({ karten: [], stand: 0 });

  const poolErgaenzen = (pool, neue) => {
    const p = { ...leererPool(), ...(pool || {}) };
    const nach = { ...leererPool(), karten: [...(p.karten || [])] };
    const wo = {};
    nach.karten.forEach((k, i) => { wo[k.kid] = i; });
    (neue || []).forEach((k) => {
      if (!k || !k.kid) return;
      const i = wo[k.kid];
      if (i == null) { wo[k.kid] = nach.karten.length; nach.karten.push(k); return; }
      const alt = nach.karten[i];
      /* DER SONDERKARTEN-MARKER UEBERLEBT DIE ZUSAMMENFUEHRUNG (35.103).
         Bis 35.102 ging er hier IMMER verloren: eine Sonderkarte wird als
         Kopie einer Poolkarte gezogen (`nachHerkunft(pool, …)` weiter unten),
         hat also dieselbe `kid` UND denselben `ovr` — die Bedingung darunter
         greift nie, die alte Karte bleibt stehen, und mit ihr das fehlende
         Merkmal. Die goldene Zeile „Sonderkarte" und der Jubel waren damit
         nur waehrend des Oeffnens zu sehen, im Fundus nie.
         Der Marker wird ODER-verknuepft, nicht ueberschrieben: einmal
         veredelt bleibt veredelt, auch wenn spaeter dieselbe Karte ohne
         Marker aus einer neuen Laufbahn nachkommt. */
      const veredelt = !!(alt.sonderkarte || k.sonderkarte);
      if ((k.ovr || 0) > (alt.ovr || 0)) nach.karten[i] = { ...alt, ...k };
      if (veredelt && !nach.karten[i].sonderkarte)
        nach.karten[i] = { ...nach.karten[i], sonderkarte: true };
    });
    nach.stand = nach.karten.length;
    return nach;
  };

  /* Wie viele je Stufe? Fuer die Anzeige und fuer die Ziehung — ein Pack kann
     keine goldene Karte versprechen, wenn keine da ist. */
  const zaehlen = (pool) => {
    const z = { bronze: 0, silber: 0, gold: 0, legende: 0 };
    ((pool && pool.karten) || []).forEach((k) => { if (z[k.stufe] != null) z[k.stufe]++; });
    return z;
  };

  const nachHerkunft = (pool, herkunft) =>
    ((pool && pool.karten) || []).filter((k) => k.herkunft === herkunft);

  /* ---- Packs ------------------------------------------------------------
     Kevin: „Packs werden ueber VC gekauft. Es sollte verschiedene Packs geben
     (Bronze, Silber, Gold, Legendaer), einmal nach jeder Spielerkarriere gibt
     es ein Bronzepack gratis."

     DIE PREISE SIND GEMESSEN, nicht gesetzt. Die VC-Wirtschaft steht seit
     34.x und ist kalibriert:
       je Laufbahn        Median 108 VC
       Vollausbau         2912 VC ueber 45 Stufen, also ~65 VC je Stufe
       Laufbahnen bis zum Vollausbau   26,8  (Zielband 25-35)

     Jeder VC, der in ein Pack geht, fehlt der Akademie. Das ist kein Fehler,
     sondern die Entscheidung, die das System interessant macht — aber sie
     muss BEZIFFERBAR sein. Die Preise sind deshalb an der Laufbahn gemessen:
     ein Bronzepack kostet ein Drittel Laufbahn, ein legendaeres drei.

     ERSTER ENTWURF WAR ZU TEUER. Gemessen: wer jede Laufbahn ein Silberpack
     zu 90 VC kauft, braucht bis zum Vollausbau 162 statt 27 Laufbahnen. Gold
     und Legendaer kosteten mehr, als eine Laufbahn ueberhaupt einbringt —
     regelmaessig kaufen war damit unmoeglich, nicht teuer.
     Das ist keine Entscheidung mehr, sondern eine Wand. Jetzt liegen die
     Preise so, dass gelegentliches Kaufen ein spuerbarer, aber bezahlbarer
     Umweg ist.

     UND DIE KOSTEN WERDEN ANGESAGT. `preisInLaufbahnen` rechnet sie in die
     Waehrung um, die der Spieler versteht: nicht „90 VC", sondern „etwa eine
     Laufbahn Ausbau". Ein Preis, dessen Folgen man erst drei Stunden spaeter
     merkt, ist keine Entscheidung.

     Nach dem Vollausbau hat VC ohnehin kaum noch eine Verwendung — gemessen:
     der ganze VC-Laden kostet 241 VC fuer je ein Stueck. Dort sind Packs
     genau die richtige Senke.                                              */
  const PACKS = [
    { id: "bronze",  n: "Bronzepack",   preis:  30, karten: 2,
      t: "Zwei Spieler. Selten mehr als solide.",
      mind: null,       chancen: { bronze: 74, silber: 24, gold:  2, legende: 0 } },
    { id: "silber",  n: "Silberpack",   preis:  65, karten: 3,
      t: "Drei Spieler, mindestens einer in Silber.",
      mind: "silber",   chancen: { bronze: 46, silber: 44, gold:  9, legende: 1 } },
    { id: "gold",    n: "Goldpack",     preis: 130, karten: 3,
      t: "Drei Spieler, mindestens einer in Gold.",
      mind: "gold",     chancen: { bronze: 20, silber: 47, gold: 29, legende: 4 } },
    { id: "legende", n: "Legendenpack", preis: 240, karten: 3,
      t: "Drei Spieler, mindestens einer in Gold — und eine echte Aussicht auf mehr.",
      mind: "gold",     chancen: { bronze:  4, silber: 33, gold: 46, legende: 17 } },
  ];
  const packById = (id) => PACKS.find((x) => x.id === id) || null;

  /* Der Preis in der Waehrung, die der Spieler versteht. VC_JE_LAUFBAHN ist
     GEMESSEN (Median ueber 300 Laufbahnen), nicht geschaetzt — steht die Zahl
     falsch, luegt die Anzeige, und das waere schlimmer als keine Anzeige. */
  const VC_JE_LAUFBAHN = 108;
  const preisInLaufbahnen = (packId) => {
    const pk = packById(packId);
    if (!pk) return 0;
    return Math.round(pk.preis / VC_JE_LAUFBAHN * 10) / 10;
  };

  /* Ein Spieler fuer eine Stufe. FERTIG, nicht fuenfzehn: eine Packkarte
     soll man einsetzen koennen, nicht grossziehen — dafuer gibt es die
     Akademie, und die soll sie nicht ersetzen (Kevins Entscheidung).
     Die Staerkespanne kommt aus den gemessenen Grenzen: eine silberne Karte
     liegt zwischen 62 und 71, eine goldene zwischen 72 und 81. */
  const SPANNE = { bronze: [52, 61], silber: [62, 71], gold: [72, 81], legende: [82, 90] };
  const PACK_POS = ["TW", "IV", "IV", "AV", "AV", "ZDM", "ZM", "ZM", "ZOM", "AF", "AF", "ST", "ST"];

  const neueKarte = (stufe, jahr) => {
    const sp = SPANNE[stufe] || SPANNE.bronze;
    const ovr = clamp(Math.round(sp[0] + Math.random() * (sp[1] - sp[0])), sp[0], sp[1]);
    const natId = pick(REGION_KEYS);
    const nat = NAT_BY_ID[natId] || NATIONS[0];
    /* Alter passend zur Staerke: eine legendaere Karte ist kein Neunzehnjaehriger,
       und ein Bronzespieler selten dreiunddreissig. */
    const alter = stufe === "legende" ? ri(26, 32)
      : stufe === "gold" ? ri(23, 31) : ri(20, 29);
    return {
      kid: "p:" + jahr + ":" + Math.floor(Math.random() * 1e9).toString(36),
      name: genName(natId, "m"), nat: natId, flag: nat.flag,
      pos: pick(PACK_POS), ovr,
      /* Anlage nur knapp ueber der Staerke: der Spieler ist fertig. */
      pot: clamp(ovr + ri(0, 4), ovr, 97),
      alter, stufe, herkunft: "pack", jahr: jahr || null, zusatz: {},
    };
  };

  /* Ziehen. `pool` liefert die Sonderkarten: Kevin wollte, dass „als
     Spezialkarten auch Spieler aus der Ruhmeshalle darin auftauchen".
     Sie kommen NICHT bei jedem Pack — sonst waeren sie keine.             */
  const SONDER_CHANCE = { bronze: 0, silber: .06, gold: .14, legende: .30 };

  const ziehen = (packId, pool, jahr) => {
    const pk = packById(packId);
    if (!pk) return { fehler: "Dieses Pack gibt es nicht.", karten: [] };
    const raus = [];
    const wuerfeln = () => {
      let r = Math.random() * 100;
      for (const st of REIHE) { r -= pk.chancen[st] || 0; if (r <= 0) return st; }
      return "bronze";
    };
    for (let i = 0; i < pk.karten; i++) raus.push(neueKarte(wuerfeln(), jahr));

    /* DIE ZUSAGE EINLOESEN. „Mindestens einer in Gold" muss stimmen, auch wenn
       der Wuerfel dreimal Bronze sagt — sonst ist die Zusage eine Werbung.
       Ersetzt wird die SCHWAECHSTE Karte, nicht die erste: sonst verliert man
       manchmal die beste des Packs. */
    if (pk.mind) {
      const rang = (st) => REIHE.indexOf(st);
      if (!raus.some((k) => rang(k.stufe) >= rang(pk.mind))) {
        let schwach = 0;
        raus.forEach((k, i) => { if (rang(k.stufe) < rang(raus[schwach].stufe)) schwach = i; });
        raus[schwach] = neueKarte(pk.mind, jahr);
      }
    }

    /* Eine Sonderkarte aus dem eigenen Pool — Ruhmeshalle zuerst, sonst ein
       Spieler aus einem frueheren Verein. Sie ERSETZT keine gezogene Karte,
       sie kommt dazu: das Pack verspricht `karten` Stueck, und wer eine
       Legende findet, soll nicht dafuer eine andere verlieren. */
    let sonder = null;
    if (Math.random() < (SONDER_CHANCE[pk.id] || 0)) {
      const ausHalleP = nachHerkunft(pool, "halle");
      const ausVerein = nachHerkunft(pool, "verein");
      const topf = ausHalleP.length ? ausHalleP : ausVerein;
      /* NOCH NICHT VEREDELTE ZUERST (35.103). Seit der Marker dauerhaft ist,
         waere die blosse Zufallswahl ein Selbstlaeufer ins Leere: wer schon
         drei Sonderkarten hat, zoege sie immer wieder und bekaeme nichts.
         Solange es unveredelte Hallen- oder Vereinskarten gibt, kommt eine
         davon. Erst wenn alles veredelt ist, faellt es auf den ganzen Topf
         zurueck — dann ist die Sonderkarte wieder nur ein Moment, aber der
         Spieler hat dann auch jede Karte, die es zu veredeln gab. */
      const frisch = topf.filter((k) => !k.sonderkarte);
      const woraus = frisch.length ? frisch : topf;
      if (woraus.length) sonder = { ...pick(woraus), sonderkarte: true };
    }
    return { fehler: null, karten: raus, sonder, pack: pk };
  };

  /* ---- Die Fläche einer Karte (35.83) ------------------------------------
     Kevin: „ich wuerde es noch besser finden, wenn sie nicht teiltransparent
     sind, sondern eher fest und wie eine Sammelkarte wirken."

     Gemessen, woran das lag: der Verlauf ging von 15 % Stufenfarbe auf
     `transparent`, darunter lag `--pan` = #211E17, ein fast schwarzes Braun.
     15 % Farbe auf Schwarz sind kaum Farbe — die Karte war deckend, WIRKTE
     aber wie ein Schleier.

     Jetzt zwei DECKENDE Stopps: oben die Stufenfarbe kraeftig in den
     Kartongrund gemischt, unten dunkel. Kein `transparent` mehr. Eine
     Sammelkarte ist ein Stueck Pappe, kein Fenster.

     Gerechnet statt getippt: die Mischung entsteht aus der Stufenfarbe, damit
     eine neue Stufe automatisch passt und nicht acht Hexwerte nachgepflegt
     werden muessen.                                                        */
  const GRUNDTON = "#211E17";
  const mischen = (a2, b2, t) => {
    const z = (h) => parseInt(String(h).slice(1), 16);
    const A2 = z(a2), B2 = z(b2);
    const m = (x, y) => Math.round(x + (y - x) * t);
    const h2 = (v) => v.toString(16).padStart(2, "0");
    return "#" + h2(m(A2 >> 16 & 255, B2 >> 16 & 255))
      + h2(m(A2 >> 8 & 255, B2 >> 8 & 255)) + h2(m(A2 & 255, B2 & 255));
  };
  const flaeche = (stufe) => {
    const f = (STUFEN[stufe] || STUFEN.bronze).farbe;
    /* Oben 26 % Stufenfarbe, unten 6 % — beide auf dem Kartongrund, beide
       deckend. Legendaer bekommt etwas mehr, weil die Farbe hell ist und
       sonst kaum traegt. */
    const stark = stufe === "legende" ? .30 : .26;
    return { oben: mischen(GRUNDTON, f, stark),
             unten: mischen(GRUNDTON, f, .06),
             kante: mischen(GRUNDTON, f, .55) };
  };

  /* ---- Merkmale als Symbole (35.83) --------------------------------------
     Kevin: „bei besonderen Spielern waere es noch cool, wenn besondere
     Eigenschaften als Symbole dargestellt werden."

     ABGELEITET AUS DEM, WAS DIE KARTE WIRKLICH WEISS. Der naheliegende Fehler
     waere, Merkmale zu wuerfeln — dann stuende „Torjaeger" auf einem
     Innenverteidiger, und beim zweiten Ansehen glaubt niemand mehr etwas,
     was auf der Karte steht.
     Es gibt hoechstens drei je Karte: was jeder hat, zeichnet niemanden aus. */
  const MERKMALE = [
    { id: "halle",  n: "Ruhmeshalle",   sym: "stern",
      gilt: (k) => k.herkunft === "halle" },
    { id: "jugend", n: "Eigengewächs",  sym: "spross",
      gilt: (k) => k.herkunft === "akademie" },
    { id: "juwel",  n: "Rohdiamant",    sym: "raute",
      gilt: (k) => k.alter <= 22 && (k.pot - k.ovr) >= 6 },
    { id: "tore",   n: "Torjäger",      sym: "ball",
      gilt: (k) => ["ST", "AF"].indexOf(k.pos) >= 0 && k.ovr >= 72 },
    { id: "mauer",  n: "Bollwerk",      sym: "schild",
      gilt: (k) => ["IV", "TW"].indexOf(k.pos) >= 0 && k.ovr >= 72 },
    { id: "regie",  n: "Spielmacher",   sym: "zirkel",
      gilt: (k) => ["ZM", "ZOM", "ZDM"].indexOf(k.pos) >= 0 && k.ovr >= 72 },
    { id: "titel",  n: "Titelsammler",  sym: "schale",
      gilt: (k) => ((k.zusatz || {}).titel || 0) >= 5 },
    { id: "alt",    n: "Routinier",     sym: "uhr",
      gilt: (k) => k.alter >= 31 },
  ];
  const merkmaleVon = (k) => (k ? MERKMALE.filter((m) => {
    try { return m.gilt(k); } catch (e) { return false; }
  }).slice(0, 3) : []);

  /* ---- Karten verkaufen (35.86) ------------------------------------------
     Kevin: „Wenn wir eine Begrenzung haben fuer nutzbare Karten, muss es auch
     eine Moeglichkeit geben, Karten, die man nicht mehr haben will,
     loszuwerden. Am besten kann man sie verkaufen fuer einen angemessenen
     Preis."

     Er hat recht, und zwar grundsaetzlich: EINE GRENZE OHNE AUSWEG IST EINE
     FALLE. Wer fuenf mittelmaessige Karten eingesetzt hat, kaeme sonst nie
     wieder an einen besseren Spieler.

     DIE PREISE SIND GEGEN DIE PACKPREISE GERECHNET, nicht geschaetzt. Der
     Rueckfluss — was alle Karten eines Packs zusammen einbringen — liegt bei
     30 bis 41 Prozent des Packpreises:
       Bronzepack    30 VC  ->  11,7 VC   39 %
       Silberpack    65 VC  ->  26,9 VC   41 %
       Goldpack     130 VC  ->  44,0 VC   34 %
       Legendenpack 240 VC  ->  71,6 VC   30 %
     Laege er ueber 100 %, waere Kaufen und Verkaufen eine Geldmaschine — und
     die VC-Kalibrierung waere wertlos, weil jeder unbegrenzt Coins herstellen
     koennte. Das ist kein Feinschliff, sondern die Grenze zwischen Wirtschaft
     und Unsinn.

     WAS MAN NICHT VERKAUFEN KANN: Spieler aus der eigenen Ruhmeshalle und aus
     frueheren eigenen Vereinen. Die sind Erinnerung, keine Ware. Wer seine
     eigene Legende zu Geld macht, verliert sie fuer immer — und der Pool ist
     das einzige Gedaechtnis, das es dafuer gibt.                           */
  const VERKAUF = { bronze: 4, silber: 10, gold: 24, legende: 55 };

  const verkaeuflich = (k) => !!k && k.herkunft === "pack";
  const erloes = (k) => (verkaeuflich(k) ? (VERKAUF[k.stufe] || 0) : 0);

  const verkaufen = (pool, kid) => {
    const p = { ...leererPool(), ...(pool || {}) };
    const karten = [...(p.karten || [])];
    const i = karten.findIndex((x) => x.kid === kid);
    if (i < 0) return { pool: p, vc: 0, fehler: "Diese Karte ist nicht in der Sammlung." };
    const k = karten[i];
    if (!verkaeuflich(k)) {
      return { pool: p, vc: 0,
        fehler: k.herkunft === "halle"
          ? "Spieler aus deiner Ruhmeshalle werden nicht verkauft."
          : "Spieler aus deinen eigenen Vereinen werden nicht verkauft." };
    }
    karten.splice(i, 1);
    return { pool: { ...p, karten, stand: karten.length }, vc: erloes(k), fehler: null };
  };

  /* ---- Das Startpaket fuer den naechsten Verein (35.89) -------------------
     Kevin: „der neue Verein bekommt ein Kartenpaket, in dem 6 Spieler sind,
     von denen mind. 3 aus der vorherigen Mannschaft stammen und mind. 1 aus
     der Ruhmeshalle (ein Guter)."

     DAS IST DER SINN DES POOLS. Alles, was in 35.79 gebaut wurde — dauerhafte
     Karten, Herkunft, Zusammenfuehren — laeuft auf diesen einen Moment zu:
     wer fuenfzehn Jahre aufgebaut hat, faengt nicht bei null an, sondern mit
     Leuten, die er kennt.

     „EIN GUTER" ist keine Floskel, sondern eine Bedingung: aus der Halle wird
     der STAERKSTE genommen, nicht irgendeiner. Wer seine eigene Legende
     wiedersieht, soll die Legende wiedersehen.

     WENN NICHTS DA IST, wird aufgefuellt: der erste Verein hat keinen
     Vorgaenger und keine Halle. Ein Startpaket, das dann leer bleibt, waere
     eine Zusage, die nur beim zweiten Mal gilt.                            */
  const STARTPAKET = { karten: 6, ausVerein: 3, ausHalle: 1 };

  const startpaket = (pool, vorigerVereinName, jahr) => {
    const alle = (pool && pool.karten) || [];
    const genommen = [];
    const nimm = (k) => { if (k && !genommen.some((x) => x.kid === k.kid)) genommen.push(k); };

    /* Aus der Halle: der STAERKSTE. */
    const halle = alle.filter((k) => k.herkunft === "halle")
      .slice().sort((a2, b2) => (b2.ovr || 0) - (a2.ovr || 0));
    for (let i = 0; i < STARTPAKET.ausHalle && i < halle.length; i++) nimm(halle[i]);

    /* Aus dem VORIGEN Verein, wenn er benannt ist — sonst aus irgendeinem
       frueheren. Der Name ist die genauere Zusage; ohne ihn waere „aus der
       vorherigen Mannschaft" nicht pruefbar. */
    const ausV = alle.filter((k) => k.herkunft === "verein"
      && (!vorigerVereinName || k.verein === vorigerVereinName))
      .slice().sort((a2, b2) => (b2.ovr || 0) - (a2.ovr || 0));
    const ausVAlt = alle.filter((k) => k.herkunft === "verein")
      .slice().sort((a2, b2) => (b2.ovr || 0) - (a2.ovr || 0));
    const topf = ausV.length >= STARTPAKET.ausVerein ? ausV : ausVAlt;
    for (let i = 0; i < STARTPAKET.ausVerein && i < topf.length; i++) nimm(topf[i]);

    /* Auffuellen — ABER NICHT AUS DER HALLE. Der erste Entwurf nahm einfach
       die staerksten uebrigen Karten, und weil Hallenkarten die staerksten
       sind, lieferte er DREI Legenden mit 84 bis 88. Gemessen und sofort
       sichtbar: sechs Karten, davon die halbe Ruhmeshalle.
       Kevin hat „mindestens eine" gesagt, nicht „so viele wie moeglich". Ein
       Startgeschenk, das die halbe Halle ausschuettet, macht den neuen Verein
       in der ersten Saison zum Favoriten — und nimmt der Akademie ihren Sinn
       fuer die naechsten fuenfzehn Jahre.
       Aufgefuellt wird deshalb aus allem AUSSER der Halle; erst wenn das
       nicht reicht, kommen weitere Hallenkarten dazu. */
    const restOhneHalle = alle.filter((k) => k.herkunft !== "halle"
      && !genommen.some((x) => x.kid === k.kid))
      .slice().sort((a2, b2) => (b2.ovr || 0) - (a2.ovr || 0));
    let i2 = 0;
    while (genommen.length < STARTPAKET.karten && i2 < restOhneHalle.length) {
      nimm(restOhneHalle[i2++]);
    }
    while (genommen.length < STARTPAKET.karten) {
      /* Frische Karten in der Mitte: silber und gold. Bronze waere ein
         mageres Geschenk fuer fuenfzehn Jahre Arbeit, legendaer zu viel. */
      genommen.push(neueKarte(Math.random() < .3 ? "gold" : "silber", jahr));
    }
    return {
      karten: genommen.slice(0, STARTPAKET.karten),
      ausHalle: genommen.filter((k) => k.herkunft === "halle").length,
      ausVerein: genommen.filter((k) => k.herkunft === "verein").length,
    };
  };

  /* ---------------------------------------- Sammlungsseiten ---------------
     Stufe I des Meta-Papiers: „Die Kartensammlung kann kleine thematische
     Seiten erhalten. Das soll sich eher wie Stickeralbum anfuehlen als wie
     ein weiteres Questlog."

     ABGELEITET, NICHT GESPEICHERT. Jede Seite ist eine Bedingung ueber den
     vorhandenen Pool — Herkunft, Stufe, Land, Sonderkarten-Marker. Kein
     neues Feld, kein Fortschrittsspeicher, keine zweite Liste, die
     auseinanderlaufen koennte.

     KEIN QUESTLOG. Es gibt keine Belohnung fuer eine volle Seite und keine
     Frist. Wer sie vollkriegt, hat eine volle Seite — das ist der Zweck.
     Deshalb steht auch ueberall die Zahl und kein Haekchen.

     SECHS, NICHT ZWANZIG. Jede Seite muss ohne Erklaerung verstaendlich sein
     und aus dem entstehen, was man ohnehin tut. „Aus eigener Kraft" gibt es
     erst, seit Absolventen in 35.125 wirklich zu Karten werden — vorher
     waere die Seite dauerhaft leer geblieben. */
  const SETS = [
    { id: "jugend", n: "Aus eigener Kraft", soll: 11,
      t: "Elf Spieler aus der eigenen Jugend.",
      passt: (k) => k.herkunft === "akademie" },
    { id: "halle", n: "Die Unsterblichen", soll: 5,
      t: "Fuenf Karten aus der Ruhmeshalle.",
      passt: (k) => k.herkunft === "halle" },
    { id: "gold11", n: "Die goldene Elf", soll: 11,
      t: "Elf Karten in Gold oder besser.",
      passt: (k) => k.stufe === "gold" || k.stufe === "legende" },
    { id: "treue", n: "Vereinstreue", soll: 11,
      t: "Elf Spieler aus dem eigenen Verein.",
      passt: (k) => k.herkunft === "verein" },
    { id: "sonder", n: "Sonderausgaben", soll: 5,
      t: "Fuenf veredelte Karten.",
      passt: (k) => !!k.sonderkarte },
  ];

  /* „Weltreise" zaehlt LAENDER, nicht Karten — deshalb steht sie nicht in
     der Tabelle oben, sondern wird eigens gerechnet. Eine Bedingung je Karte
     koennte das nicht ausdruecken. */
  const setStand = (pool) => {
    const K = (pool && pool.karten) || [];
    const liste = SETS.map((s) => {
      const habe = K.filter(s.passt).length;
      return { id: s.id, n: s.n, t: s.t, soll: s.soll,
        habe: Math.min(habe, s.soll), voll: habe >= s.soll };
    });
    const laender = new Set(K.map((k) => k.nat).filter(Boolean)).size;
    liste.push({ id: "welt", n: "Weltreise", t: "Karten aus fuenfzehn Laendern.",
      soll: 15, habe: Math.min(laender, 15), voll: laender >= 15 });
    return liste;
  };

  return { STUFEN, REIHE, stufeFuer, ausAbsolvent, ausKader, ausHalle,
    SETS, setStand,
           STARTPAKET, startpaket,
           flaeche, MERKMALE, merkmaleVon,
           VERKAUF, verkaeuflich, erloes, verkaufen,
           leererPool, poolErgaenzen, zaehlen, nachHerkunft,
           PACKS, packById, SPANNE, neueKarte, ziehen, SONDER_CHANCE,
           VC_JE_LAUFBAHN, preisInLaufbahnen };
};
