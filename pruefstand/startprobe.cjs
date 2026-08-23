/* Startprobe fuer die Einzeldatei.
   jsdom kann keine Modulskripte, deshalb wird fuer die Probe EINE Kopie
   angelegt, in der type="module" zu einem gewoehnlichen Skript wird. Der
   Inhalt bleibt Zeichen fuer Zeichen gleich; geprueft wird also dasselbe
   Buendel, das im Browser laeuft.                                        */
const fs = require("fs"), { JSDOM, VirtualConsole } = require(process.env.JSDOM || "/tmp/ps/node_modules/jsdom");

const datei = process.argv[2] || __dirname + "/rasenschach-browsertest.html";
/* Die erwartete Fassungsnummer kommt aus der QUELLE, nicht aus dem Ergebnis —
   sonst pruefte sich die Datei gegen sich selbst und koennte nie durchfallen.
   Fest verdrahtet war sie einmal, und ging beim Sprung 33.13 auf 33.14 prompt
   kaputt: die App war richtig, die Pruefung veraltet. */
const quelle = process.argv[3];
let sollFassung = null;
if (quelle) {
  const m = fs.readFileSync(quelle, "utf8").match(/const VERSION\s*=\s*"([^"]+)"/);
  if (!m) { console.error("FEHLER: keine Fassungsnummer in " + quelle); process.exit(1); }
  sollFassung = m[1];
}
let html = fs.readFileSync(datei, "utf8");
/* Ein Modulskript laeuft laut Norm erst NACH dem Aufbau des Dokuments — ein
   gewoehnliches im Kopf sofort. Fuer die Probe wandert es deshalb ans Ende
   des Koerpers, sonst gaebe es #root noch gar nicht. Das ist eine Eigenheit
   der Probe, nicht der ausgelieferten Datei.                              */
{
  const a = html.indexOf('<script type="module">');
  const e = html.indexOf("</scr" + "ipt>", a);
  const rumpf = html.slice(a + '<script type="module">'.length, e);
  html = html.slice(0, a) + html.slice(e + ("</scr" + "ipt>").length);
  /* Wieder als Funktion — sonst liest replace die neun "$&" im Buendel als
     Muster und setzt "</body>" mitten in den Code. Genau daran ist die
     erste Fassung dieser Probe gescheitert. */
  html = html.replace("</body>", () => "<scr" + "ipt>" + rumpf + "</scr" + "ipt></body>");
}

/* WILLKOMMENSSCHIRM VORBELEGEN. Seit 35.26 steht er vor dem Menue, und ein
   frisch geladenes Buendel ist genau der "allererste Start". Diese Probe lief
   danach sofort rot: sie suchte Titelblatt und Impressum und stand im Schirm.

   Weggeklickt wird er NICHT — nach dem Klick muesste auf Reacts naechsten
   Durchlauf gewartet werden, und ein synchroner Lesevorgang sieht dann noch
   den alten Zustand (ausprobiert: "Ausweg" ✓, alles dahinter trotzdem ✗).
   Stattdessen den Schluessel setzen, bevor die App laeuft.

   Der Schirm selbst ist dadurch nicht ungeprueft: `ansichten.jsx` nimmt ihn
   mit sieben eigenen Pruefungen auseinander (Koepfe, Texte, Zeichnungen,
   Laenge, Blaetteranzeige, Ueberspringen). Arbeitsteilung: dort der INHALT,
   hier dass die App ueberhaupt bis zum Menue kommt. */
html = html.replace("</head>", () => "<scr" + "ipt>try{localStorage.setItem("
  + "'rasenschach:willkommen',JSON.stringify({schirm:true,aka:true,verein:true}));}"
  + "catch(e){}</scr" + "ipt></head>");

const vc = new VirtualConsole();
const fehler = [];
vc.on("jsdomError", (e) => fehler.push(String(e && e.message).slice(0, 200)));
vc.on("error", (...a) => fehler.push(a.join(" ").slice(0, 200)));

const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "http://x/", virtualConsole: vc });

setTimeout(() => {
  const d = dom.window.document;
  /* NICHT body.textContent: darin steckt der Quelltext des Buendels, in dem
     jede gesuchte Zeichenfolge ohnehin vorkommt. Nur die Wurzel zaehlt. */
  /* Nach einem Klick muss der Text NEU gelesen werden — eine einmal
     gespeicherte Zeichenkette altert sofort. */
  const roh = () => {
    const w = d.querySelector("#root");
    if (!w) return "";
    /* Den STILBLOCK ausklammern. `Shell` rendert <style>{CSS}</style> INNERHALB
       von #root, und dessen textContent enthaelt jeden Kommentar im CSS. Ein
       Kommentar mit dem Wort „Fassung" und einer Nummer liess die
       Impressumspruefung darauf anspringen statt auf das Impressum: gemeldet
       wurde „Quelle 35.26 · angezeigt 35.27" — beide Zahlen echt, nur die
       zweite aus einem Kommentar. Sichtbarer Text ist, was der Spieler liest.

       Ueber einen KLON, nicht ueber eine eigene Sammelschleife: der erste
       Versuch lief die Kindknoten selbst ab und verlor dabei das Impressum
       ("angezeigt (keine)"). textContent kennt alle Faelle, die so eine
       Schleife uebersieht. */
    const k = w.cloneNode(true);
    k.querySelectorAll("style,script").forEach((e) => e.remove());
    return k.textContent || "";
  };
  const w = (b) => (b ? "\u2713" : "\u2717");
  let ok = 0, schlecht = 0;
  const pruef = (name, b, zusatz) => {
    console.log("  " + w(b) + " " + name + (zusatz ? "   " + zusatz : ""));
    b ? ok++ : schlecht++;
  };

  console.log("=== Startprobe ===");
  pruef("Wurzel gefuellt", (d.querySelector("#root") || {}).childElementCount > 0,
        "Kindelemente: " + ((d.querySelector("#root") || {}).childElementCount || 0));

  /* Belegt der Schluessel oben wirklich vor? Ohne diese Zeile waere nicht zu
     unterscheiden, ob das Menue erscheint oder der Schirm nur zufaellig
     ausbleibt. */
  const t = roh();
  pruef("Willkommensschirm vorbelegt, Menue erreicht", !/Überspringen/.test(t));

  pruef("Titelblatt da", t.includes("KARRIERE-SIMULATION"));
  const gezeigt = (t.match(/Fassung ([0-9.]+)/) || [])[1] || "(keine)";
  if (sollFassung)
    pruef("Impressum zeigt die Fassung der Quelle", gezeigt === sollFassung,
          "Quelle " + sollFassung + " · angezeigt " + gezeigt);
  else
    pruef("Impressum nennt eine Fassung", gezeigt !== "(keine)", "angezeigt " + gezeigt);
  /* Bewusst KEINE Pruefung auf „SCHRIFT FEHLT": `useSchriftBefund` misst ueber
     eine Zeichenflaeche, und jsdom hat kein getContext. Der Befund bleibt hier
     immer leer — eine Pruefung darauf koennte nie durchfallen und waere eine
     Beruhigung ohne Deckung. Das beantwortet nur das Geraet. */
  console.log("  · Schriftbefund: in jsdom nicht messbar (kein getContext) — nur auf dem Geraet");
  pruef("kein NaN/undefined im Text", !/NaN|undefined/.test(t));
  pruef("Stilblock der App vorhanden", !!d.querySelector("#root style"));
  /* Geprueft wird, DASS das Raster im Grundstil steht — nicht, in welcher
     Farbe. Bis 34.20 stand hier die Farbe rgba(237,242,233,.030) fest im
     Muster; seit der Umstellung auf currentColor traf es nie mehr zu, und
     die Startprobe meldete bei jedem Lauf rot, ohne dass etwas kaputt war.
     Eine Pruefung, die immer rot ist, wird ignoriert wie eine, die immer
     gruen ist — nur aergerlicher. */
  pruef("Halbtonraster im Grundstil",
        /\.raster\{[^}]*background-image:\s*radial-gradient\(/.test((d.querySelector("#root style") || {}).textContent || ""));

  console.log("=== Messwerkzeug ===");
  const griff = [...d.querySelectorAll("button")].find((b) => b.textContent === "fps");
  pruef("Griff vorhanden", !!griff);
  pruef("Kasten zunaechst zu", !!d.querySelector("#mw-zahl") &&
        d.querySelector("#mw-zahl").parentElement.style.display === "none");
  pruef("keine Bildschleife vor dem Einschalten", (d.querySelector("#mw-zahl") || {}).textContent === "aus");
  if (griff) {
    griff.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    const diag = (d.querySelector("#mw-diag") || {}).textContent || "";
    pruef("Diagnose gefuellt", diag.includes("Protokoll") && diag.includes("wakeLock"), diag.slice(0, 120));
    const kasten = d.querySelector("#mw-zahl").parentElement;
    pruef("Kasten offen", kasten.style.display === "block");
    /* A/B-Schalter */
    const cb = d.querySelector("#mw-raster");
    cb.checked = true; cb.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    const auf = [...d.querySelectorAll("body > style")].map((s) => s.textContent).join("");
    /* Der Schalter nimmt dem Papier seine Struktur. WIE er das tut, hat sich
       in 34.20 geaendert (vorher der alte Rasenverlauf, jetzt die Papierfarbe)
       — das Muster hier zeigte danach ins Leere. Geprueft wird deshalb die
       Wirkung: ein Aufsatzstil, der Flaeche und Raster mit !important
       ueberschreibt. */
    pruef("Rasterschalter setzt Aufsatzstil",
          auf.includes("!important") && /\.raster\b/.test(auf) && /\.fl\b/.test(auf));
    cb.checked = false; cb.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    const auf2 = [...d.querySelectorAll("body > style")].map((s) => s.textContent).join("");
    pruef("Rasterschalter raeumt wieder auf", auf2 === "");
  }

  console.log("\n" + ok + " bestanden, " + schlecht + " nicht bestanden.");
  if (fehler.length) { console.log("Meldungen aus der Seite:"); fehler.slice(0, 5).forEach((f) => console.log("  " + f)); }
  process.exit(schlecht ? 1 : 0);
}, 2500);
