/* ==========================================================================
   PORTRÄTBOGEN — rendert echte <Avatar>-Ausgaben als SVG-Tafel.
   An Grafik ohne Augen zu arbeiten geht nicht. Die Bilder kommen aus
   derselben Komponente, die in der App läuft.

     node portraetbogen.cjs zufall  <ziel.svg> [anzahl] [spalten]
     node portraetbogen.cjs merkmal <ziel.svg> <feld> [anzahl]
     node portraetbogen.cjs gross   <ziel.svg> <feld> <werte,mit,komma>
     node portraetbogen.cjs kreuz   <ziel.svg> <feld>   (Merkmal × alle Kopfformen)

   Aus dem Bauverzeichnis des Prüfstands aufrufen (dort liegt motor.js).
   In PNG wandeln:  python3 -c "import cairosvg;cairosvg.svg2png(
                     url='ziel.svg',write_to='ziel.png',scale=2)"
   ========================================================================== */
const fs = require("fs");
const { JSDOM } = require(process.env.JSDOM || "/tmp/ps/node_modules/jsdom");

const dom = new JSDOM("<!doctype html><html><body></body></html>", { pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document; global.navigator = dom.window.navigator;
global.requestAnimationFrame = (f) => setTimeout(() => f(Date.now()), 0);
global.cancelAnimationFrame = clearTimeout;
global.matchMedia = global.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };

const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const App = require("./motor.js");

const art = process.argv[2] || "zufall";
const ziel = process.argv[3] || "/tmp/portraetbogen.svg";
const K = 100, L = 8;
let stuecke = [];

/* Feste Grundeinstellung, damit im Musterbogen wirklich nur EIN Merkmal
   wechselt. Sonst vergleicht man Gesichter statt Merkmale. */
const grund = (meta) => ({ ...App.zuegeAusKennung(4242, "m", "GER", meta),
  haut: 1, haar: 1, frisur: 1, bart: 0, brauen: 0, augen: 0, augenfarbe: 1,
  nase: 0, mund: 0, ohren: 1, wangen: 0, schmuck: 0, kopf: 0 });

if (art === "zufall") {
  const anzahl = parseInt(process.argv[4] || "32", 10), spalten = parseInt(process.argv[5] || "8", 10);
  const nat = ["GER", "BRA", "NGA", "JPN", "SEN", "ESP", "NOR", "ARG"];
  for (let i = 0; i < anzahl; i++)
    stuecke.push({ props: { seed: 1000 + i * 7919, g: i % 9 === 4 ? "w" : "m", nat: nat[i % nat.length] },
      marke: "", spalten });
} else if (art === "merkmal" || art === "frau") {
  /* „frau" ist derselbe Bogen mit g:"w". Ohne ihn bleiben Wimpern, Schminke
     und die weiblichen Frisuren unsichtbar — sie haengen alle am Geschlecht,
     und der Merkmalsbogen zeichnete bis 34.29 ausschliesslich Maenner. */
  const weiblich = art === "frau";
  const feld = process.argv[4] || "frisur";
  const meta = { mk_haar: true, mk_acc: true };
  const n = parseInt(process.argv[5] || String(App.ZUEGE_ANZAHL(meta, weiblich)[feld] || 8), 10);
  for (let v = 0; v < n; v++)
    stuecke.push({ props: { zuege: { ...grund(meta), bart: 0, [feld]: v },
      g: weiblich ? "w" : "m", nat: "GER" },
      marke: feld + " " + v, spalten: 8 });
} else if (art === "kreuz") {
  /* Jede Auspraegung ueber JEDER Kopfform. Frisuren und Baerte richten sich
     nach Wange und Kiefer — was bei „Oval" sitzt, kann bei „Rund" ueberstehen.
     Genau dieses Kreuz faellt bei einem Zufallsbogen selten auf. */
  const feld = process.argv[4] || "frisur";
  const meta = { mk_haar: true, mk_acc: true };
  const n = App.ZUEGE_ANZAHL(meta, false)[feld] || 8;
  App.KOPFFORM.forEach((kf, ki) => {
    for (let v = 0; v < n; v++)
      stuecke.push({ props: { zuege: { ...grund(meta), [feld]: v, kopf: ki }, g: "m", nat: "GER" },
        marke: kf.n + " · " + v, spalten: n });
  });
} else {
  const feld = process.argv[4] || "bart";
  const werte = (process.argv[5] || "0,1,2,3").split(",").map(Number);
  werte.forEach((v) => stuecke.push({ props: { zuege: { ...grund({ mk_haar: true }), [feld]: v }, g: "m", nat: "GER" },
    marke: feld + " " + v, spalten: werte.length }));
}

const spalten = stuecke[0].spalten;
const beschriftet = stuecke.some((s) => s.marke);
const hz = K + L + (beschriftet ? 14 : 0);
let inhalt = "";
stuecke.forEach((st, i) => {
  const svg = renderToStaticMarkup(React.createElement(App.Avatar, { size: K, club: null, ...st.props }));
  /* Kennungen eindeutig machen, sonst greift ein clipPath über Kacheln hinweg. */
  const innen = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
    .replace(/(av|hk)(\d+)/g, "$1$2_" + i);
  const x = (i % spalten) * (K + L), y = Math.floor(i / spalten) * hz;
  inhalt += '<g transform="translate(' + x + "," + y + ')">' + innen + "</g>";
  if (st.marke) inhalt += '<text x="' + (x + 3) + '" y="' + (y + K + 11)
    + '" fill="#8A9690" font-family="sans-serif" font-size="10">' + st.marke + "</text>";
});
const zeilen = Math.ceil(stuecke.length / spalten);
const br = spalten * (K + L) - L, ho = zeilen * hz - (beschriftet ? 0 : L);
fs.writeFileSync(ziel, '<svg xmlns="http://www.w3.org/2000/svg" width="' + br + '" height="' + ho
  + '" viewBox="0 0 ' + br + " " + ho + '"><rect width="100%" height="100%" fill="#070D0A"/>' + inhalt + "</svg>");
console.log("geschrieben: " + ziel + "  " + stuecke.length + " Porträts, " + br + "x" + ho);
