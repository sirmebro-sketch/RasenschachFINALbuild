/* ==========================================================================
   texttreue.cjs — nennt der sichtbare Text dieselbe Zahl wie die Bedingung?
   --------------------------------------------------------------------------
       node pruefstand/texttreue.cjs App.jsx

   Warum es das gibt: die Errungenschaft „Alles ausgebaut" versprach dem
   Spieler bis 35.23 „Alle SECHS Abteilungen auf Stufe 6". Es sind neun, seit
   35.12 die Akademie erweitert wurde. Der Text stand direkt neben der
   Bedingung und ist trotzdem zwei Fassungen lang niemandem aufgefallen —
   weil niemand 162 Eintraege von Hand gegenliest.

   Gesucht wird eine Zahl im Text, die in der Bedingung NICHT vorkommt.
   Zahlwoerter werden mituebersetzt („sechs" -> 6), sonst faende die Pruefung
   genau den Fall nicht, wegen dem sie gebaut wurde.

   BEWUSSTE UNSCHAERFE: die Pruefung kennt den Sinn der Zahlen nicht. Eine
   Bedingung, die ihre Grenze aus einer Konstanten holt, wird gemeldet, obwohl
   sie stimmt. Deshalb ist die Ausgabe eine LISTE ZUM DURCHSEHEN und kein
   rotes Licht — ein Hinweisgeber, der bei jedem Lauf Fehlalarme wirft, wird
   nach dem zweiten Mal ueberlesen (siehe die verworfene Farbwertpruefung in
   pruefen.sh). Was hier steht, gehoert einmal angeschaut und dann in die
   Ausnahmeliste unten, mit Begruendung.
   ========================================================================== */
const fs = require("fs");

const quelle = fs.readFileSync(process.argv[2] || "App.jsx", "utf8");

const WORT = {
  "eine": 1, "einen": 1, "einem": 1, "zwei": 2, "drei": 3, "vier": 4, "fünf": 5,
  "sechs": 6, "sieben": 7, "acht": 8, "neun": 9, "zehn": 10, "elf": 11,
  "zwölf": 12, "zwanzig": 20, "fünfzig": 50, "hundert": 100, "tausend": 1000,
};

/* Zahlen, die in Texten stehen, ohne eine Grenze zu sein. Ohne diese Liste
   meldet die Pruefung Positionsnamen und Redewendungen. */
const HARMLOS = new Set([1, 2, 9, 10, 11, 16, 25]);

function zahlenAusText(t) {
  const z = new Set();
  for (const m of t.matchAll(/\b(\d[\d.]*)\b/g)) {
    const n = parseInt(m[1].replace(/\./g, ""), 10);
    if (!isNaN(n)) z.add(n);
  }
  for (const [w, n] of Object.entries(WORT))
    if (new RegExp("\\b" + w + "\\b", "i").test(t)) z.add(n);
  return z;
}

function zahlenAusCode(c) {
  const z = new Set();
  for (const m of c.matchAll(/\b(\d[\d_]*)\b/g)) {
    const n = parseInt(m[1].replace(/_/g, ""), 10);
    if (!isNaN(n)) z.add(n);
  }
  return z;
}

/* Den ACHIEVEMENTS-Block herausschneiden und Eintrag fuer Eintrag zerlegen.
   Klammern werden gezaehlt, nicht per Regex gesucht: eine Bedingung kann
   selbst geschweifte Klammern enthalten. */
const start = quelle.indexOf("const ACHIEVEMENTS = [");
if (start < 0) { console.log("ACHIEVEMENTS nicht gefunden."); process.exit(2); }
let i = quelle.indexOf("[", start), tiefe = 0, ende = i;
for (; ende < quelle.length; ende++) {
  const c = quelle[ende];
  if (c === "[") tiefe++;
  else if (c === "]") { tiefe--; if (tiefe === 0) break; }
}
const block = quelle.slice(i + 1, ende);

const eintraege = [];
let stand = 0;
while (stand < block.length) {
  const auf = block.indexOf("{", stand);
  if (auf < 0) break;
  let t = 0, zu = auf;
  for (; zu < block.length; zu++) {
    if (block[zu] === "{") t++;
    else if (block[zu] === "}") { t--; if (t === 0) break; }
  }
  eintraege.push(block.slice(auf, zu + 1));
  stand = zu + 1;
}

const treffer = [];
for (const e of eintraege) {
  const mId = e.match(/id:\s*"([^"]+)"/);
  const mT = e.match(/\bt:\s*"([^"]*)"/);
  if (!mId || !mT) continue;
  const mOk = e.match(/\bok:\s*([\s\S]*)$/);
  const bedingung = mOk ? mOk[1] : "";
  const zt = zahlenAusText(mT[1]);
  const zc = zahlenAusCode(bedingung);
  const fehlt = [...zt].filter((n) => !zc.has(n) && !HARMLOS.has(n));
  if (fehlt.length && bedingung)
    treffer.push({ id: mId[1], text: mT[1], fehlt, code: bedingung.replace(/\s+/g, " ").slice(0, 88) });
}

console.log("=== Texttreue der Errungenschaften ===");
console.log("  " + eintraege.length + " Einträge geprüft, " + treffer.length + " zum Durchsehen\n");
for (const t of treffer) {
  console.log("  " + t.id);
  console.log("     Text:      " + t.text);
  console.log("     im Text, nicht in der Bedingung: " + t.fehlt.join(", "));
  console.log("     Bedingung: " + t.code);
  console.log();
}
if (!treffer.length) console.log("  Keine Abweichung gefunden.");
