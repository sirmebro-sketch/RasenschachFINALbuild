#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   TEXTKATALOG  ·  V12 aus dem Gesamtbericht 35.128
   ---------------------------------------------------------------------------
   „Einen pruefbaren Textkatalog aus TATSAECHLICH GERENDERTEN Szenen
   erzeugen." — nicht aus den Rohtexten in `ereignisse.js`, sondern aus dem,
   was der Spieler wirklich liest: nach Einsetzen der Platzhalter und nach der
   weiblichen Umformung.

   WARUM DAS EIN EIGENES WERKZEUG BRAUCHT. Die vorhandene Stimmigkeitspruefung
   sieht die Rohtexte. Genau dort steht aber alles richtig — die Fehler
   entstehen ERST beim Zusammensetzen: `weiblichForm` machte aus „Ein
   ehemaliger Mitspieler" ein „Ein ehemaliger Mitspielerin" (F14), und
   „1 Datensätze" entstand aus einer Zahl plus festem Plural (F15).

   Beide waren nur an der fertigen Ausgabe zu sehen. Dieses Werkzeug erzeugt
   sie und sucht darin nach Mustern, die niemand lesen soll.
--------------------------------------------------------------------------- */
const M = require("/tmp/ps/motor.js");

let proben = 0, funde = 0;
const zeig = (art, txt, quelle) => {
  funde++;
  if (funde <= 12) console.log("    " + art.padEnd(26) + "„" + String(txt).slice(0, 72) + "“"
    + (quelle ? "   [" + quelle + "]" : ""));
};

/* Muster, die in keiner fertigen Ausgabe stehen duerfen. Jedes hat einen
   belegten Anlass — erfundene Regeln stehen hier nicht. */
const MUSTER = [
  /* „bei null an" ist deutsch, kein technischer Wert — der erste Entwurf
     meldete es. Gesucht wird jetzt nur das englische `null` in typischer
     Ausgabelage: am Anfang, nach einem Satzzeichen oder mit Grosschreibung. */
  ["technischer Wert",   /\b(undefined|NaN|\[object)\b|(?:^|[:=]\s*)(null|Null)\b/],
  ["Platzhalter offen",  /\{[a-zA-Z_]+\}|\$\{/],
  ["doppeltes Leerzeichen", /\S {2,}\S/],
  ["Leerzeichen vor Satzzeichen", / [,.!?;:]/],
  /* F15: „1 Datensätze“. Zahl 1 plus Wort auf -e/-en/-nen. */
  ["Mengenform bei eins", /(?:^|[^0-9])1 [A-Za-zÄÖÜäöüß]+(?:nen|en|e)\b/],
  /* F15: ss statt ß in den drei belegten Woertern. */
  ["ss statt ß",         /\b(weisst|weiss|beisst|dreissig|heisst|gross|grosse|grossen)\b/],
  /* F14: Artikel und Substantiv passen nicht zusammen. */
  /* „Ein groesserer Verein" war ein FALSCHER Treffer des ersten Entwurfs:
     `Verein` endet auf „in". Deshalb jetzt eine Liste echter weiblicher
     Endungen statt eines blossen Suffixes — und Woerter wie Verein, Termin
     oder Trainer fallen heraus. */
  ["Artikel passt nicht", /\b(Ein|ein|Dein|dein|Kein|kein) [a-zäöüß]*er [A-ZÄÖÜa-zäöüß]*(?:erin|lerin|nerin|torin|rätin|ärztin|frau)\b/],
  ["Relativpronomen falsch", /\bdie [A-ZÄÖÜ][a-zäöüß]*e, der\b/],
];

const pruefe = (txt, quelle) => {
  if (txt == null) return;
  const t = String(txt);
  proben++;
  MUSTER.forEach(([art, rx]) => { if (rx.test(t)) zeig(art, t, quelle); });
};

/* ---- 1. Alle Ereignistexte, beide Geschlechter ------------------------- */
const alle = [];
M.EVENTS.forEach((e) => {
  const q = e.id || "?";
  /* VIELE TEXTE SIND FUNKTIONEN und bekommen im Spiel einen Kontext
     (`c.mate.name`, `c.club` …). Ohne ihn stuerzen sie ab — dieser
     Kontext ist deshalb ein vollstaendiger Platzhalter mit allem, was die
     Texte anfassen. Was hier fehlt, faellt sofort als Absturz auf und
     gehoert ergaenzt; stillschweigend zu ueberspringen waere der bequeme
     und falsche Weg. */
  /* DER KONTEXT IST NICHT GERATEN. Er stammt aus
       grep -oE "\\bc\\.[a-zA-Z]+(\\.[a-zA-Z]+)*" ereignisse.js | sort -u
     — also aus jedem Pfad, den irgendein Text wirklich anfasst. Ein Feld zu
     vergessen faellt sofort als „Text braucht mehr Kontext" auf; das ist
     gewollt, denn ein stillschweigend uebersprungener Text waere ein
     ungeprueftes Stueck Spiel. */
  const KTX = {
    g: "m", pn: "er",
    prev: "Alter Verein",
    club: { n: "Testverein", l: "Testliga" },
    mate:  { name: "Ein Mitspieler" },
    rival: { name: "Ein Rivale", age: 26, ovr: 80 },
    rivalOrMate: { name: "Ein Rivale" },
    star:  { name: "Der Star" },
    vet:   { name: "Der Routinier", age: 34 },
    young: { name: "Das Talent" },
    ls: {
      N: 18, apps: 28, club: "Testverein", cs: 6, goals: 9, ovr: 78,
      rank: 5, trophies: ["Meisterschaft"], europe: "Testwettbewerb",
      note: 2.8,
      cup: { name: "Testpokal", out: "Halbfinale" },
      eu:  { pos: 12, pts: 11 },
      injury: { games: 14 },
      ntMajor: { res: "Halbfinale", turnier: "Weltmeisterschaft", y: 2030 },
    },
    p: {
      money: 3.5, mv: 22, peakOvr: 84, traum: "Champions League",
      club: { n: "Testverein" },
      loanHome: { n: "Stammverein" },
      flags: { kapitaen: true },
      nation: { id: "DE", name: "Deutschland" },
      nt: { uCaps: 12 },
      tot: { apps: 240 },
    },
  };

  const T = (x) => {
    if (typeof x !== "function") return x;
    try { return x(KTX); }
    catch (e) { zeig("Text braucht mehr Kontext", (e && e.message) || "?", q); return null; }
  };
  alle.push([T(e.title), q + ".title"]);
  alle.push([T(e.text), q + ".text"]);
  /* AUCH LABEL, HINWEIS UND AUSGANG KOENNEN FUNKTIONEN SEIN. Der erste
     Entwurf schickte nur Titel und Einleitung durch `T()` — die uebrigen
     landeten als Funktionsquelltext im Katalog und meldeten reihenweise
     „Platzhalter offen". Die Muster stimmten; geprueft wurde das Falsche. */
  (e.choices || []).forEach((c, i) => {
    alle.push([T(c.label), q + ".c" + i]);
    alle.push([T(c.hint), q + ".c" + i + ".hint"]);
    alle.push([T(c.sperre), q + ".c" + i + ".sperre"]);
    (c.roll || []).forEach((o, j) => alle.push([T(o.text), q + ".c" + i + ".r" + j]));
  });
});

console.log("\n########## TEXTKATALOG ##########\n");
console.log("  " + alle.filter(([t]) => t != null).length + " Textstellen aus "
  + M.EVENTS.length + " Ereignissen\n");

console.log("  Maennliche Fassung:");
const vorM = funde;
alle.forEach(([t, q]) => pruefe(t, q));
console.log("    " + (funde - vorM) + " Befunde\n");

console.log("  Weibliche Fassung (nach `weiblichForm`):");
const vorW = funde;
alle.forEach(([t, q]) => {
  if (t == null) return;
  let w = t;
  try { w = M.weiblichForm(String(t)); } catch (e) { zeig("Umformung stuerzt ab", t, q); return; }
  pruefe(w, q);
});
console.log("    " + (funde - vorW) + " Befunde\n");

/* ---- 2. Mengenformen an echten Zahlen ---------------------------------- */
console.log("  Mengenformen bei 0, 1 und 2:");
const vorZ = funde;
[0, 1, 2].forEach((n) => {
  pruefe(n + (n === 1 ? " Datensatz" : " Datensätze") + " eingespielt.", "import");
  pruefe(n + (n === 1 ? " Spiel Sperre" : " Spiele Sperre"), "sperre");
  pruefe(n + (n === 1 ? " Laufbahn" : " Laufbahnen"), "laufbahn");
});
console.log("    " + (funde - vorZ) + " Befunde\n");

console.log("  " + proben + " Proben, " + funde + " Befunde"
  + (funde > 12 ? "  (nur die ersten zwölf oben)" : ""));
console.log(funde === 0
  ? "\n  Keine sichtbaren Textfehler in den geprueften Mustern.\n"
  : "\n  " + funde + " Stellen zum Nachsehen.\n");
process.exit(funde === 0 ? 0 : 1);
