/* Startet ein gebündeltes Prüfskript in einer jsdom-Umgebung.
   Aufruf:  node jsdom.cjs <bündel.js> [zusätzliche Argumente]        */
const { JSDOM, VirtualConsole } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>",
  { pretendToBeVisual: true, url: "http://x/", virtualConsole: new VirtualConsole() });
global.window = dom.window; global.document = dom.window.document;
global.navigator = dom.window.navigator; global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element; global.Node = dom.window.Node;
global.MouseEvent = dom.window.MouseEvent;
global.requestAnimationFrame = (f) => setTimeout(f, 0);
global.cancelAnimationFrame = (i) => clearTimeout(i);
global.IS_REACT_ACT_ENVIRONMENT = true;
const buendel = process.argv[2];
if (!buendel) { console.log("FEHLER: kein Bündel angegeben"); process.exit(1); }
process.argv = [process.argv[0], buendel, ...process.argv.slice(3)];
require(buendel);
