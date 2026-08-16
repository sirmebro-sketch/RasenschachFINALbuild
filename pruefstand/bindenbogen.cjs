/* Alle Kapitaensbinden als Tafel — sonst sieht man die Flaggen nie. */
const { JSDOM } = require("/tmp/ps/node_modules/jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>");
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator;
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const App = require("./motor.js");
const N = App.NATIONS, SP = 12, BR = 96, HO = 52;
const zeilen = Math.ceil(N.length / SP);
let teile = "";
N.forEach((nat, i) => {
  const x = (i % SP) * BR, y = Math.floor(i / SP) * HO;
  const inner = renderToStaticMarkup(React.createElement(App.Binde, {
    farben: App.landesFarben(nat), flagge: App.flaggenBild(nat), size: 34,
    titel: nat.id }));
  teile += '<g transform="translate(' + (x + 14) + ',' + (y + 6) + ')">' + inner + '</g>'
    + '<text x="' + (x + BR / 2) + '" y="' + (y + 47) + '" font-size="9" fill="#9AA5B4" '
    + 'text-anchor="middle" font-family="sans-serif">' + nat.id + '</text>';
});
const w = SP * BR, h = zeilen * HO;
require("fs").writeFileSync(process.argv[2],
  '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">'
  + '<rect width="' + w + '" height="' + h + '" fill="#191813"/>' + teile + '</svg>');
console.log("geschrieben: " + process.argv[2] + "  " + N.length + " Binden");
