/* stimmigkeit.cjs — 35.37
   ===========================================================================
   Prueft JEDES Ereignis und JEDE Auswahlmoeglichkeit auf drei Fragen:

     1. WIRKT die Wahl ueberhaupt?  (fx-Schluessel, die applyFx nicht kennt,
        werden stumm verschluckt — der gefaehrlichste Fehler von allen)
     2. KANN die Wahl getroffen werden?  (Wuerfel, die sich nicht zu 1
        summieren; Optionen ohne jede Wirkung)
     3. PASST das Ereignis zum Moment?  (Text spricht von Ehefrau, Bedingung
        laesst Ledige zu — Kevins Befund)

   ZUR DRITTEN FRAGE, UND DAS IST WICHTIG:
   Ein Rechner kann Deutsch nicht verstehen. Er kann nur nachsehen, ob ein
   Text ein Merkmal traegt UND ob die Bedingung den dazugehoerigen Zustand
   absichert. Jeder Treffer ist deshalb ein VERDACHT, kein Urteil. Die Liste
   ist zum Nachlesen da, nicht zum blinden Abarbeiten. Falsche Treffer werden
   NICHT durch Aufweichen der Suche beseitigt, sondern namentlich in
   AUSNAHMEN eingetragen — mit Begruendung. Eine Suche, die man so lange
   entschaerft, bis sie schweigt, prueft nichts mehr.

   Aufruf:  node pruefstand/stimmigkeit.cjs [--alle]
            --alle zeigt auch die als geprueft eingetragenen Ausnahmen.
   Rueckgabe: 1 bei harten Fehlern, sonst 0.
   =========================================================================== */
const path = require("path");
const ARG = require("./argumente.cjs");
const fsA = require("fs");
const MOTOR = path.join(process.env.PS_MOTOR || "/tmp/ps", "motor.js");
/* Der Motor ist ein GEBAUTES Buendel. Wer ereignisse.js aendert und dieses
   Werkzeug ohne neuen Aufbau laufen laesst, misst den Stand von vorher und
   sieht seinen eigenen Fix nicht. Am 24.8.2026 genau so passiert: ein
   berichtigter Text stand danach noch als Treffer da.
   Deshalb wird das Alter hier ausdruecklich gemeldet. */
const E = require(MOTOR);
const { EVENTS } = E;

const ZEIGE_ALLE = process.argv.includes("--alle");
let hart = 0, verdacht = 0, ok = 0;

const kopf = (t) => console.log("\n  -- " + t + " --");
const zeile = (s) => console.log("      " + s);
const melde = (art, liste, n = 20) => {
  if (!liste.length) { console.log("    \u2713 " + art + " \u2014 nichts gefunden"); ok++; return; }
  console.log("    " + (liste.length) + "\u00d7 " + art + ":");
  liste.slice(0, n).forEach(zeile);
  if (liste.length > n) zeile("\u2026 und " + (liste.length - n) + " weitere");
};

/* ----------------------------------------------------------- Datenaufnahme */
const AK = ["pac", "sho", "pas", "dri", "def", "phy"];
/* Aus applyFx ausgelesen, nicht aus dem Gedaechtnis: einfache Werte,
   wcMod-Werte und die benannten Sonderfaelle. */
const FX_BEKANNT = new Set([
  ...AK,
  "form", "morale", "fitness", "trust", "rep", "injuryProne",
  "pot", "money", "legacy", "flag", "clearInjuryFlag", "ban", "ban2",
  "forceInjury", "extend", "freeAgent", "penalty", "dreamOffer", "wantLoan",
  "dev", "slow", "slowDecay", "injMod", "note", "wageMult", "offers",
  "ntBonus", "goalMod", "assistMod", "csMod", "bigGame", "loyalBonus",
  "fit", "wantMove", "winterMove", "zurueckZuPrev", "zielTrainer",
  "forceTransfer", "terminate", "suspend", "repos", "raise", "cut",
  "instantOvr", "endCareer", "caps", "captain", "ntCaptain", "ntPenalty",
  "kids", "lifeStatus", "partner", "newPartner", "split", "divorce",
  "wedding", "buyAsset", "strangWeg", "strang",
]);

const alle = [];
EVENTS.forEach((e) => {
  const cond = e.cond ? String(e.cond) : "";
  const texte = [];
  const nimm = (v) => {
    if (typeof v === "string") texte.push(v);
    else if (v && typeof v === "object") {
      if (typeof v.de === "string") texte.push(v.de);
      Object.values(v).forEach((x) => { if (typeof x === "string") texte.push(x); });
    }
  };
  nimm(e.title); nimm(e.text);
  const wahlen = (e.choices || []).map((c, i) => {
    nimm(c.label); nimm(c.hint);
    const ausgaenge = c.roll ? c.roll : [{ p: 1, text: c.text, fx: c.fx }];
    ausgaenge.forEach((r) => nimm(r.text));
    return { i, c, cond: c.cond ? String(c.cond) : "", ausgaenge };
  });
  alle.push({ e, id: e.id, tag: e.tag || "", cond, wahlen,
    text: texte.filter(Boolean).join("  ") });
});

console.log("########## STIMMIGKEIT DER EREIGNISSE ##########");
{
  const quelle = ARG.quelle("stimmigkeit.cjs", /App\.jsx$/);
  const mAlt = fsA.statSync(MOTOR).mtimeMs;
  const eQuelle = quelle ? path.join(path.dirname(quelle), "ereignisse.js") : null;
  console.log("  gemessen aus: " + MOTOR);
  if (eQuelle && fsA.existsSync(eQuelle)) {
    const eAlt = fsA.statSync(eQuelle).mtimeMs;
    if (eAlt > mAlt) {
      console.log("  ACHTUNG: ereignisse.js ist NEUER als das B\u00fcndel.");
      console.log("           Dieses Ergebnis beschreibt den Stand von VORHER.");
      console.log("           Erst `TEILE=aufbau bash pruefstand/pruefen.sh` fahren.");
      hart += 1;
    } else console.log("  B\u00fcndel ist aktuell (neuer als ereignisse.js) \u2713");
  }
}
console.log("  " + alle.length + " Ereignisse \u00b7 "
  + alle.reduce((s, d) => s + d.wahlen.length, 0) + " Auswahlm\u00f6glichkeiten \u00b7 "
  + alle.reduce((s, d) => s + d.wahlen.reduce((t, w) => t + w.ausgaenge.length, 0), 0)
  + " Ausg\u00e4nge");

/* =================================================== 1) Wirkt die Wahl? === */
kopf("Wirkung");
{
  const unbekannt = [];
  alle.forEach((d) => d.wahlen.forEach((w) => w.ausgaenge.forEach((r, j) => {
    Object.keys(r.fx || {}).forEach((k) => {
      if (!FX_BEKANNT.has(k))
        unbekannt.push(d.id.padEnd(22) + " Wahl " + (w.i + 1) + " Ausgang " + (j + 1)
          + ": \u201e" + k + "\u201c kennt applyFx nicht \u2014 wirkungslos");
    });
  })));
  melde("Wirkung, die stumm verpufft", unbekannt);
  if (unbekannt.length) hart += unbekannt.length;
}
{
  const leer = [];
  alle.forEach((d) => d.wahlen.forEach((w) => {
    const hatWirkung = w.ausgaenge.some((r) => r.fx && Object.keys(r.fx).length);
    if (!hatWirkung) leer.push(d.id.padEnd(22) + " Wahl " + (w.i + 1)
      + " \u201e" + (typeof w.c.label === "string" ? w.c.label : "?") + "\u201c hat gar keine Wirkung");
  }));
  melde("Auswahl ohne jede Wirkung", leer);
}

/* ================================= 2) Kann die Wahl getroffen werden? === */
kopf("Erreichbarkeit");
{
  const schief = [];
  alle.forEach((d) => d.wahlen.forEach((w) => {
    if (!w.c.roll) return;
    const s = w.c.roll.reduce((a, r) => a + (r.p || 0), 0);
    if (Math.abs(s - 1) > 0.005)
      schief.push(d.id.padEnd(22) + " Wahl " + (w.i + 1) + ": W\u00fcrfel summiert "
        + s.toFixed(3) + " statt 1,000");
  }));
  melde("W\u00fcrfel, die nicht aufgehen", schief);
  if (schief.length) hart += schief.length;
}
{
  const einzeln = [];
  alle.forEach((d) => {
    const mitBed = d.wahlen.filter((w) => w.cond);
    if (mitBed.length && mitBed.length === d.wahlen.length)
      einzeln.push(d.id.padEnd(22) + " ALLE " + d.wahlen.length
        + " Wahlen haben eine Bedingung \u2014 es kann ein Ereignis ohne Ausweg entstehen");
  });
  melde("Ereignisse, in denen jede Wahl bedingt ist", einzeln);
  if (einzeln.length) hart += einzeln.length;
}

/* ============================ 3) Passt das Ereignis zum Moment? ========= */
/* Jede Probe: WENN der Text dieses Merkmal traegt, DANN muss die Bedingung
   einen dieser Zustaende erwaehnen. Erwaehnen genuegt — ob richtig herum,
   entscheidet der Mensch beim Nachlesen. */
const PROBEN = [
  { n: "Partnerin/Partner im Text",
    text: /\b(deine[rn]? Frau|dein Mann|deine Freundin|dein Freund|Ehefrau|Ehemann|Partnerin|eure Beziehung|ihr beide|zu Hause wartet)\b/i,
    braucht: /life\.status|LIFE_|verheiratet|verlobt|beziehung|life\.partner/ },
  { n: "Kind oder Schwangerschaft",
    text: /\b(schwanger|Schwangerschaft|euer Kind|dein Kind|deine Tochter|dein Sohn|Vater wirst|Mutter wirst|Nachwuchs erwartet|Geburt)\b/i,
    braucht: /life\.kids|life\.status|kinderwunsch|mutterschaft|schwanger/ },
  { n: "Hochzeit",
    text: /\b(Hochzeit|heiraten|Antrag machen|Trauung|Verlobung)\b/i,
    braucht: /life\.status|verlobt|beziehung|verheiratet/ },
  { n: "Trennung oder Scheidung",
    text: /\b(Scheidung|Trennung|ihr trennt euch|auszieht|getrennte Wege)\b/i,
    braucht: /life\.status|verheiratet|verlobt|beziehung/ },
  { n: "Kapit\u00e4nsbinde wird ANGEBOTEN",
    text: /\b(Kapit\u00e4n werden|die Binde|zum Kapit\u00e4n|Spielf\u00fchrer)\b/i,
    braucht: /flags\.kapitaen|flags\.exkapitaen|nt\.kapitaen|flags\.vize/ },
  { n: "Nationalmannschaft",
    text: /\b(Nationalmannschaft|Nationaltrainer|L\u00e4nderspiel|Nationalelf|f\u00fcr dein Land)\b/i,
    braucht: /nt\.|caps|verbandswechsel|eingebuergert/ },
  { n: "Leihe",
    text: /\b(Leihe|ausgeliehen|Leihgesch\u00e4ft|zur\u00fcck zu deinem Verein)\b/i,
    braucht: /aufLeihe|wantLoan|warAufLeihe|loanHome/ },
  { n: "Verletzung oder Reha",
    text: /\b(Reha|Kreuzband|Operation|verletzt bist|deiner Verletzung|Genesung)\b/i,
    braucht: /injury|schwereVerletzung|fitness|injuryProne/ },
  { n: "Karriereende oder R\u00fccktritt",
    text: /\b(Karriereende|aufh\u00f6ren|R\u00fccktritt|letzte Saison|Abschiedsspiel)\b/i,
    braucht: /age\s*>=|seasons\.length\s*>=|ntRuecktritt/ },
  { n: "Traumverein",
    text: /\b(Verein deines Lebens|Traumverein|Verein deiner Kindheit)\b/i,
    braucht: /traum|istTraum/ },
  { n: "Kinder im Haus (nicht Geburt)",
    text: /\b(dein Kind will|deine Kinder|die Kinder|Bambini)\b/i,
    braucht: /life\.kids/ },
];

/* Namentliche Ausnahmen. Jede mit Begruendung — ohne Begruendung keine
   Ausnahme, sonst wird die Liste zum Muellabladeplatz. */
const AUSNAHMEN = {
  a2_ausland:   { "Partnerin/Partner im Text":
    "\u201eihr beide\u201c meint dich und den jungen Zugang, keine Beziehung." },
  pt_nummerzwei:{ "Trennung oder Scheidung":
    "\u201eIhr trennt euch\u201c meint das Torh\u00fcterduell, nicht eine Beziehung." },
  schiedsrichter:{ "Kapit\u00e4nsbinde wird ANGEBOTEN":
    "\u201eDu gehst direkt zum Kapit\u00e4n\u201c \u2014 Richtung, kein Angebot." },
  al_reisekader:{ "Kapit\u00e4nsbinde wird ANGEBOTEN":
    "\u201edem, der die Binde tr\u00e4gt\u201c \u2014 du sprichst mit ihm. Siehe aber offener Punkt 18: "
    + "tr\u00e4gst DU sie, redest du mit dir selbst." },
  b_mitspielerverletzt:{ "Verletzung oder Reha":
    "die Reha ist die des Mitspielers, nicht deine." },
  me_mentor3:   { "Nationalmannschaft":
    "\u201eZwei Jahre sp\u00e4ter spielt ER in der Nationalmannschaft\u201c \u2014 der Schuetzling." },
  as_golf:      { "Nationalmannschaft":
    "das Ereignis VERSCHAFFT den Pass, es setzt ihn nicht voraus." },
  hk_hymnedebatte:{ "Karriereende oder R\u00fccktritt":
    "\u201ebegleitet dich bis zum Karriereende\u201c \u2014 bildlich, kein Zeitpunkt." },
  tr_fuenf:     { "Karriereende oder R\u00fccktritt":
    "\u201ehier aufh\u00f6ren wollen\u201c ist ein Treuebekenntnis, kein R\u00fccktritt. "
    + "loyalty>=5 sichert die Lage ab." },
  r_kaumgespielt:{ "Leihe":
    "\u201eLeihe fordern\u201c ist die Wahl \u2014 man muss nicht auf Leihe sein, um eine zu verlangen." },
};

kopf("Passt das Ereignis zum Moment?");
{
  const gesamt = [];
  PROBEN.forEach((pr) => {
    const treffer = [];
    alle.forEach((d) => {
      if (!pr.text.test(d.text)) return;
      if (pr.braucht.test(d.cond)) return;
      const grund = (AUSNAHMEN[d.id] || {})[pr.n];
      if (grund) { if (ZEIGE_ALLE) zeile("(gepr\u00fcft) " + d.id + " \u00b7 " + pr.n + ": " + grund); return; }
      const m = d.text.match(pr.text);
      treffer.push(d.id.padEnd(22) + " [" + d.tag + "] \u201e" + (m ? m[0] : "?") + "\u201c"
        + (d.cond ? "  cond: " + d.cond.replace(/\s+/g, " ").slice(0, 64) : "  OHNE BEDINGUNG"));
    });
    if (treffer.length) {
      console.log("    " + treffer.length + "\u00d7 " + pr.n + " ohne passende Bedingung:");
      treffer.slice(0, 12).forEach(zeile);
      if (treffer.length > 12) zeile("\u2026 und " + (treffer.length - 12) + " weitere");
      gesamt.push(...treffer);
    } else { console.log("    \u2713 " + pr.n + " \u2014 alle abgesichert"); ok++; }
  });
  verdacht += gesamt.length;
}

/* ============= 4) Zwei Ereignisse im selben Jahr, die kollidieren ========
   DER BEFUND, DER DIESES WERKZEUG AUSGELOEST HAT.

   `drawEvents` baut den Pool EINMAL und prueft alle `cond` gegen den Zustand
   VOR der ersten Entscheidung. Dann zieht es n Ereignisse daraus. Wer also
   in Ereignis 1 die Binde annimmt, bekommt sie in Ereignis 2 desselben
   Jahres noch einmal angeboten — beide waren beim Ziehen zulaessig.

   `usedTags` verhindert zwei Ereignisse mit DEMSELBEN tag in einem Zug.
   Verschiedene tags gehen also durch: `kapitaen` traegt „Fuehrung",
   `pt_kapitaenbinde` traegt „Position".

   Gesucht sind Paare, bei denen A einen Zustand HERSTELLT und B dessen
   ABWESENHEIT voraussetzt — bei verschiedenen tags.                      */
kopf("Zwei Ereignisse im selben Jahr");
{
  /* Was ein Ausgang herstellt. Aus applyFx abgelesen, nicht geraten. */
  const stellther = (d) => {
    const z = new Set();
    d.wahlen.forEach((w) => w.ausgaenge.forEach((r) => {
      const f = r.fx || {};
      if (f.flag) z.add("flags." + f.flag);
      if (f.captain) z.add("flags.kapitaen");
      if (f.ntCaptain) z.add("nt.kapitaen");
      if (f.kids) z.add("life.kids");
      if (f.wedding || f.lifeStatus || f.newPartner || f.partner) z.add("life.status");
      if (f.split || f.divorce) z.add("life.status");
      if (f.endCareer) z.add("ENDE");
      if (f.terminate || f.freeAgent) z.add("vertragslos");
    }));
    return z;
  };
  /* Was eine Bedingung als ABWESEND voraussetzt. */
  const brauchtWeg = (cond) => {
    const z = new Set();
    let m;
    /* `!!p.flags.x` heisst VORHANDEN, `!p.flags.x` heisst FEHLT. Mein erster
       Entwurf hat das erste Ausrufezeichen von `!!` erwischt und jede
       Voraussetzung ins Gegenteil verkehrt — kp_ansprache (`!!kapitaen`)
       erschien als "setzt voraus, dass die Binde fehlt". Der Rueckblick nach
       hinten schliesst das aus. */
    const re = /(?<!!)!\s*p\.flags\.\s*([a-zA-Z_][a-zA-Z0-9_]*)/g;
    while ((m = re.exec(cond))) z.add("flags." + m[1]);
    if (/(?<!!)!\s*p\.nt\.kapitaen/.test(cond)) z.add("nt.kapitaen");
    if (/life\.kids\s*===?\s*0|!\s*p\.life\.kids/.test(cond)) z.add("life.kids");
    return z;
  };
  const daten = alle.map((d) => ({ ...d, gibt: stellther(d), weg: brauchtWeg(d.cond) }));
  const paare = [];
  for (let i = 0; i < daten.length; i++) {
    for (let j = 0; j < daten.length; j++) {
      if (i === j) continue;
      const A = daten[i], B = daten[j];
      if (A.tag && B.tag && A.tag === B.tag) continue;      // usedTags sperrt das
      [...A.gibt].forEach((z) => {
        if (!B.weg.has(z)) return;
        if (i > j && daten[j].gibt.has(z) && daten[i].weg.has(z)) return;  // Paar nur einmal
        paare.push(A.id.padEnd(20) + " gibt " + z.padEnd(20)
          + " \u2014 " + B.id.padEnd(20) + " [" + B.tag + "] setzt voraus, dass es fehlt");
      });
    }
  }
  /* 35.44: seit 35.37 prueft `nextEvent` jede Bedingung ein zweites Mal,
     unmittelbar bevor das Ereignis gezeigt wird. Diese Paare koennen also
     zusammen GEZOGEN werden, aber das zweite wird uebersprungen statt
     ausgespielt — der Fehler ist abgefangen.

     Sie trotzdem als "Verdachtsfaelle zum Nachlesen" zu melden war falsch:
     die Zahl stand seit 35.37 unveraendert bei 38 und bedeutete nichts mehr.
     Eine Kennzahl, die sich nie bewegt, lehrt einen, sie zu ueberlesen — und
     dann faellt auch nicht auf, wenn sie eines Tages auf 39 springt.

     Jetzt wird sie als Bestand gemeldet, nicht als Befund. Steigt sie, ist
     ein neues Paar dazugekommen; das ist an sich harmlos, sagt aber, dass die
     Zweitpruefung weiter gebraucht wird. */
  if (paare.length) {
    console.log("    " + paare.length + " Paare koennen im selben Zug gezogen werden \u2014");
    console.log("    seit 35.37 f\u00e4ngt die Zweitpr\u00fcfung in `nextEvent` sie ab.");
    console.log("    Mit --alle stehen sie einzeln da.");
    if (ZEIGE_ALLE) paare.forEach(zeile);
    ok++;
  } else {
    console.log("    \u2713 keine Paare, die im selben Zug kollidieren k\u00f6nnten");
    ok++;
  }
}

/* ================== 5) Ist die Zweitpruefung noch verdrahtet? ============
   `nochGueltig` selbst wird in ansichten.jsx gegen echte Ereignisse geprueft.
   Was dort NICHT auffaellt: ob `nextEvent` sie noch aufruft. Genau das ist
   mir beim ersten Entwurf passiert — ich nahm das Ueberspringen heraus, und
   alle Pruefungen blieben gruen.

   Ein Textabgleich ist ein schwaches Mittel und wird hier bewusst als solches
   benannt. Er faengt das Herausnehmen, nicht das Umbauen. */
kopf("Verdrahtung der Zweitpruefung");
{
  const fs = require("fs");
  const quelle = ARG.quelle("stimmigkeit.cjs", /App\.jsx$/);
  if (!quelle || !fs.existsSync(quelle)) {
    console.log("    \u00dcBERSPRUNGEN \u2014 kein Pfad zu App.jsx \u00fcbergeben.");
    console.log("    Ohne Quelle ist das kein Ergebnis. Aufruf:");
    console.log("      node pruefstand/stimmigkeit.cjs /pfad/zu/App.jsx");
    hart += 1;
  } else {
    const t = fs.readFileSync(quelle, "utf8");
    const proben = [
      [/while \(k < queue\.length && !nochGueltig\(p, queue\[k\]\)\) k\+\+;/,
       "nextEvent \u00fcberspringt ungueltig gewordene Ereignisse"],
      [/^function nochGueltig\(q, e\) \{/m,
       "nochGueltig steht auf Modulebene (sonst nicht pruefbar)"],
      [/35\.37: auch hier/,
       "der Schnelldurchlauf prueft ebenfalls nach"],
    ];
    const fehlt = proben.filter(([re]) => !re.test(t)).map(([, n]) => n);
    if (fehlt.length) { fehlt.forEach((n) => zeile("\u2717 fehlt: " + n)); hart += fehlt.length; }
    else { console.log("    \u2713 alle drei Stellen verdrahtet"); ok++; }
  }
}

/* ========== 6) Rollen in der dritten Person, die DU sein koenntest ========
   Punkt 18. `al_reisekader` liess einen Kapitaen "mit dem, der die Binde
   traegt" sprechen — ein Selbstgespraech. Kein Mechanikfehler, ein Riss in
   der Erzaehlung, und davon merkt der Spieler jeden einzelnen.

   Gesucht wird in JEDEM Text des Ereignisses (Titel, Text, Beschriftungen,
   Hinweise, Ausgaenge) nach einer Rolle in der dritten Person, die der
   Spieler selbst innehaben kann. Ist der Text eine FUNKTION, gilt er als
   abgesichert: dann passt er sich der Lage an — genau die Loesung, die
   `al_reisekader` bekommen hat.

   KONTROLLPROBE eingebaut. Beim Bauen dieser Suche bin ich zweimal
   hereingefallen: einmal auf `\u00e4` in einem Python-Rohstring, einmal auf
   naives Anfuehrungszeichen-Paaren, das bei ungerader Anzahl verrutscht.
   Beide Male meldete die Suche "nichts gefunden", und beide Male war die
   Suche kaputt, nicht die Datei sauber. Eine Suche ohne Kontrollprobe ist
   kein Ergebnis. */
kopf("Rollen in der dritten Person");
{
  const ROLLEN = [
    { n: "Kapit\u00e4n", re: /(?:der|dem|den|des|euer|eurem|euren|unser) Kapit\u00e4n|die Binde tr\u00e4gt|mit der Binde/,
      haelt: /flags\.kapitaen/ },
    { n: "Vizekapit\u00e4n", re: /(?:der|dem|den) Vizekapit\u00e4n/, haelt: /flags\.vize/ },
    { n: "Nationalmannschaftskapit\u00e4n", re: /(?:der|dem|den) Kapit\u00e4n (?:der|des) National/,
      haelt: /nt\.kapitaen/ },
  ];
  /* Ein Altersdeckel unter der Mindestgrenze fuer die Binde schuetzt genauso
     gut wie `!p.flags.kapitaen`. Die Grenze ist NACHGESEHEN, nicht geraten:
     die vier Bindenereignisse verlangen age>=24, 25, 26 und 27, die
     automatische Vergabe in simulateSeason verlangt age>=23. Unter 23 kann
     niemand Kapitaen sein. `a2_dialekt` (age<=21) ist deshalb sauber, obwohl
     der Hinweis „\u00dcber den Kapit\u00e4n" lautet.

     Aendert sich eine dieser Grenzen, stimmt diese Zahl nicht mehr — deshalb
     steht sie hier mit ihrer Herkunft und nicht nackt im Code. */
  const KAPI_MIN = 23;
  const jungGenug = (cond) => {
    const m = /age\s*<=?\s*(\d+)/.exec(cond || "");
    return !!m && (+m[1] + (cond.includes("age <") && !cond.includes("<=") ? -1 : 0)) < KAPI_MIN;
  };

  /* Sammelt alle Texte EINES Ereignisses, samt Angabe ob sie Funktionen sind. */
  const texteVon = (d) => {
    const raus = [];
    const nimm = (v, wo) => {
      if (typeof v === "function") { raus.push({ t: "", fn: true, wo }); return; }
      if (typeof v === "string") raus.push({ t: v, fn: false, wo });
      else if (v && typeof v === "object")
        Object.values(v).forEach((x) => { if (typeof x === "string") raus.push({ t: x, fn: false, wo }); });
    };
    nimm(d.e.title, "Titel"); nimm(d.e.text, "Text");
    (d.e.choices || []).forEach((c, i) => {
      nimm(c.label, "Wahl " + (i + 1) + " Beschriftung");
      nimm(c.hint, "Wahl " + (i + 1) + " Hinweis");
      (c.roll || [{ text: c.text }]).forEach((r, j) => nimm(r.text, "Wahl " + (i + 1) + " Ausgang " + (j + 1)));
    });
    return raus;
  };

  /* Kontrollprobe: dieser Text MUSS gefunden werden. Findet die Suche ihn
     nicht, ist sie kaputt und schweigt aus dem falschen Grund. */
  const probeText = "Du sprichst mit dem, der die Binde tr\u00e4gt, statt mit dem Trainer.";
  if (!ROLLEN[0].re.test(probeText)) {
    zeile("\u2717 KONTROLLPROBE GESCHEITERT \u2014 die Suche findet ihren eigenen Pr\u00fcfsatz nicht.");
    zeile("  Das Ergebnis unten ist wertlos.");
    hart += 1;
  } else {
    const treffer = [];
    alle.forEach((d) => {
      const texte = texteVon(d);
      /* FRUEHERER FEHLER, hier festgehalten: erst stand hier
         `const hatFunktion = texte.some(x => x.fn)` und ein ganzes Ereignis
         wurde uebersprungen, sobald IRGENDEIN Text darin eine Funktion war.
         Damit fielen genau die zwei Faelle durch, fuer die diese Suche gebaut
         wurde — beide Gegenproben blieben gruen. Es zaehlt je Text, nicht je
         Ereignis: eine Funktion passt sich an, ihre Nachbarn nicht. */
      ROLLEN.forEach((r) => {
        const t = texte.find((x) => !x.fn && r.re.test(x.t));
        if (!t) return;
        if (r.haelt.test(d.cond)) return;          // Ereignis schliesst die Rolle aus
        if (r.n === "Kapit\u00e4n" && jungGenug(d.cond)) return;
        treffer.push(d.id.padEnd(20) + " [" + d.tag + "] " + t.wo + ": \u201e"
          + (t.t.match(r.re) || [""])[0] + "\u201c");
      });
    });
    melde("Rolle in dritter Person, die der Spieler selbst haben kann", treffer, 20);
    if (treffer.length) verdacht += treffer.length;
  }
}

console.log("\n  ----------------------------------------------------------");
console.log("  " + ok + " Proben ohne Befund \u00b7 " + hart + " harte Fehler \u00b7 "
  + verdacht + " Verdachtsf\u00e4lle zum Nachlesen");
process.exit(hart > 0 ? 1 : 0);
