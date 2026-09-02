/* schriftabdeckung.cjs — welche Zeichen kennen die eingebetteten Schriften?
   =========================================================================
       node pruefstand/schriftabdeckung.cjs schriften.js

   WARUM NICHT IM BROWSER MESSEN: drei Anlaeufe sind daran gescheitert
   (35.57). Breitenvergleich gegen eine fehlende Schriftfamilie meldet immer
   „vorhanden", weil auch ein fehlendes Zeichen von einer Ersatzschrift
   gezeichnet wird. Breitenvergleich gegen das Ersatzkaestchen meldete, die
   Anzeigeschrift koenne kein „u" — in einer Proportionalschrift trifft
   irgendein Buchstabe zufaellig dieselbe Breite. Und der Vergleich „serif
   gegen monospace" scheitert dort, wo beide auf dieselbe Systemschrift
   zeigen; die Gegenprobe meldete daraufhin, die Schrift koenne chinesisch.

   Hier wird stattdessen die Datei GELESEN. WOFF2 ist brotli-gepackt, aber
   nur `glyf` und `loca` werden zusaetzlich umgeformt — `cmap` steht
   unveraendert drin und laesst sich direkt auswerten.

   Die Ausgabe ist eine Liste von Bereichen und eine Antwort auf die Frage,
   die dahintersteht: reichen die Zeichen fuer die Namen, die im Spiel
   vorkommen?                                                             */
const fs = require("fs");
const zlib = require("zlib");

/* ---- WOFF2 aufmachen ---------------------------------------------------- */
const BEKANNT = [
  "cmap","head","hhea","hmtx","maxp","name","OS/2","post","cvt ","fpgm","glyf",
  "loca","prep","CFF ","VORG","EBDT","EBLC","gasp","hdmx","kern","LTSH","PCLT",
  "VDMX","vhea","vmtx","BASE","GDEF","GPOS","GSUB","EBSC","JSTF","MATH","CBDT",
  "CBLC","COLR","CPAL","SVG ","sbix","acnt","avar","bdat","bloc","bsln","cvar",
  "fdsc","feat","fmtx","fvar","gvar","hsty","just","lcar","mort","morx","opbd",
  "prop","trak","Zapf","Silf","Glat","Gloc","Feat","Sill",
];

function base128(b, p) {          /* UIntBase128 nach WOFF2-Norm */
  let w = 0;
  for (let i = 0; i < 5; i++) {
    const z = b[p.o++];
    w = (w << 7) | (z & 0x7f);
    if (!(z & 0x80)) return w >>> 0;
  }
  throw new Error("UIntBase128 zu lang");
}

function cmapAus(woff2) {
  if (woff2.toString("ascii", 0, 4) !== "wOF2") throw new Error("kein WOFF2");
  const anzahl = woff2.readUInt16BE(12);
  const p = { o: 48 };
  const tabellen = [];
  for (let i = 0; i < anzahl; i++) {
    const flags = woff2[p.o++];
    const idx = flags & 0x3f;
    let tag;
    if (idx === 63) { tag = woff2.toString("ascii", p.o, p.o + 4); p.o += 4; }
    else tag = BEKANNT[idx];
    const orig = base128(woff2, p);
    /* Umformung gibt es nur fuer glyf/loca; dort folgt die verwandelte
       Laenge. Fuer alle anderen ist Version 0 = keine Umformung. */
    const ver = (flags >> 6) & 0x03;
    let laenge = orig;
    if ((tag === "glyf" || tag === "loca") ? ver === 0 : ver !== 0) laenge = base128(woff2, p);
    tabellen.push({ tag, laenge });
  }
  const roh = zlib.brotliDecompressSync(woff2.slice(p.o));
  let ab = 0;
  for (const t of tabellen) {
    if (t.tag === "cmap") return roh.slice(ab, ab + t.laenge);
    ab += t.laenge;
  }
  throw new Error("keine cmap-Tabelle");
}

/* ---- cmap auswerten (Format 4 und 12) ----------------------------------- */
function zeichenAus(cmap) {
  const menge = new Set();
  const n = cmap.readUInt16BE(2);
  for (let i = 0; i < n; i++) {
    const ab = cmap.readUInt32BE(4 + i * 8 + 4);
    const format = cmap.readUInt16BE(ab);
    if (format === 4) {
      const segX2 = cmap.readUInt16BE(ab + 6), seg = segX2 / 2;
      const endeAb = ab + 14, startAb = endeAb + segX2 + 2;
      const deltaAb = startAb + segX2, rangeAb = deltaAb + segX2;
      for (let s = 0; s < seg; s++) {
        const ende = cmap.readUInt16BE(endeAb + s * 2);
        const start = cmap.readUInt16BE(startAb + s * 2);
        if (start === 0xffff) continue;
        const ro = cmap.readUInt16BE(rangeAb + s * 2);
        for (let c = start; c <= ende && c !== 0x10000; c++) {
          if (ro === 0) { menge.add(c); continue; }
          const gi = rangeAb + s * 2 + ro + (c - start) * 2;
          if (gi + 1 < cmap.length && cmap.readUInt16BE(gi) !== 0) menge.add(c);
        }
      }
    } else if (format === 12) {
      const gruppen = cmap.readUInt32BE(ab + 12);
      for (let g = 0; g < gruppen; g++) {
        const b = ab + 16 + g * 12;
        const von = cmap.readUInt32BE(b), bis = cmap.readUInt32BE(b + 4);
        for (let c = von; c <= bis && c - von < 70000; c++) menge.add(c);
      }
    }
  }
  return menge;
}

/* ---- Ausgabe ------------------------------------------------------------ */
const quelle = process.argv[2] || "schriften.js";
const text = fs.readFileSync(quelle, "utf8");
const treffer = [...text.matchAll(/data:font\/woff2;base64,([A-Za-z0-9+/=]+)/g)];
const namen = [...text.matchAll(/font-family:\s*"([^"]+)"/g)].map((m) => m[1]);
let hart = 0, ok = 0;

console.log("  " + treffer.length + " eingebettete Schriften in " + quelle);

const PROBE = {
  "Grundlatein":        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  "Deutsch":            "äöüÄÖÜß",
  "Franz./Span./Port.": "éèêëàâçîïôûùñáíóúãõ",
  "Nordisch":           "øåæÆØÅ",
  "Türkisch":           "şŞğĞıİçÇöÖüÜ",
  "Polnisch":           "ąćęłńóśźżĄĆĘŁŃŚŹŻ",
  "Tschech./Kroat.":    "čďěňřšťůžČŠŽĆĐ",
};

treffer.forEach((m, i) => {
  const name = namen[i] || "Schrift " + (i + 1);
  let zeichen;
  try { zeichen = zeichenAus(cmapAus(Buffer.from(m[1], "base64"))); }
  catch (e) { console.log("    " + name + ": NICHT LESBAR — " + e.message); hart++; return; }

  console.log("\n    " + name + "  \u2014 " + zeichen.size + " Zeichen in der Tabelle");
  Object.keys(PROBE).forEach((gruppe) => {
    const fehlt = [...PROBE[gruppe]].filter((c) => !zeichen.has(c.codePointAt(0)));
    console.log("      " + (fehlt.length ? "\u2717" : "\u2713") + " " + gruppe.padEnd(20)
      + (fehlt.length ? "fehlt: " + fehlt.join(" ") : "vollstaendig"));
  });

  /* GEGENPROBE DER MESSUNG. Eine lateinische Schrift kann kein Chinesisch.
     Meldet die Auswertung es trotzdem, ist sie kaputt — und alles darueber
     waere wertlos. Drei Verfahren sind in 35.57 genau daran gescheitert. */
  const fremd = ["漢", "अ", "ك"].filter((c) => zeichen.has(c.codePointAt(0)));
  const grund = zeichen.has(0x61) && zeichen.has(0x41) && zeichen.has(0x30);
  if (!grund) { console.log("      ! unglaubwuerdig: a, A oder 0 fehlen"); hart++; }
  else if (fremd.length) { console.log("      ! unglaubwuerdig: " + fremd.join(" ") + " gemeldet"); hart++; }
  else { console.log("      \u2713 Gegenprobe: a/A/0 da, kein Chinesisch/Devanagari/Arabisch"); ok++; }
});

console.log("\n  " + ok + " Schriften geprueft \u00b7 " + hart + " harte Fehler");
process.exit(hart > 0 ? 1 : 0);
