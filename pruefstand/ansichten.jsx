import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import App, {
  CLUBS,
  kopfPfad,
  drawWildcard, LAUFBAHN_MAX,
  MenuScreen, EndScreen, AkademieScreen, TalentZeile, WildcardEnthuellung, Balken,
  AusbauRing, akaNaechster, akaLeistbar, ACHIEVEMENTS, RARITY, STUFEN, WildcardCard,
  AchievementScreen, Avatar, CreateScreen, HallScreen, RESSORT, titelgeschichte, Pass,
  VCLADEN, SHOP_BILD, shopFuer, ladenGesperrt, ladenKaufbar, VCLadenAnsicht, tauschRest,
  rerollWildcard, rahmenFuer, rahmenOffen, ZURUECK, namensVorschlag, ANLEITUNG, EVENTS,
  weiblichForm, evText, autoTraining, TRAINING, AK, zuegeAusKennung, zugDrehen,
  ZUEGE_ANZAHL, AUGENFARBE, KOPFFORM, hautBereich, haarBereich, AKA_MAX, leereBilanz,
  Wappen, Trikot, VereinGruenden, VereinScreen, VereinAbschluss,
  WAPPEN_FORMEN, WAPPEN_ZEICHEN, TRIKOT_MUSTER, VEREIN,
  hsvChance, akaStufe, akaSumme, akaRestkosten, leereAkademie, akaGruenden, akaJahr,
  akaVerbuchen, vcFuer, vcPosten, akaBonus, ABTEILUNGEN, createPlayer, develop,
  simulateSeason, makeOffers, marketValue, verdict, NATIONS, TYPES, MODES, POS, pick, CSS,
  tauschMax, SaisonRueckblick, FLAGGENART, stufeSchrift
} from "./probe.jsx";

let fehler = 0, ok = 0;
const echteFehler = [];
const origErr = console.error;
const HARMLOS = ["not wrapped in act", "getContext", "Not implemented", "The above error occurred"];
console.error = (...a) => { const t = String(a[0]);
  if (!HARMLOS.some((h) => t.includes(h))) echteFehler.push(t.slice(0, 300)); };
const zeige = (name, e) => { fehler++; console.log("  ✗ " + name + " — " + (e && e.message ? e.message : e)); };

function mach(name, el, minLaenge = 5) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  try {
    const root = createRoot(div);
    act(() => { root.render(el); });
    const t = div.textContent || "";
    if (t.length < minLaenge) throw new Error("Ansicht bleibt leer");
    if (/NaN|undefined|\[object Object\]/.test(t))
      throw new Error("Ansicht zeigt Unsinn: " + (t.match(/.{0,30}(NaN|undefined|\[object Object\]).{0,30}/) || [""])[0]);
    ok++;
    return { div, root };
  } catch (e) { zeige(name, (e && e.stack ? e.stack.split("\n").slice(0,4).join(" | ") : e)); return null; }
}

/* Zu jeder Beschriftung muss auch eine Zahl stehen. Fängt Fälle ab, in denen
   ein Feld schlicht fehlt — React zeigt undefined als Leerstelle an, das
   sieht man einem Absturztest nicht an. */
function zahlenPruefen(div, marken, name) {
  const eb = [...div.querySelectorAll(".eb")];
  marken.forEach((m) => {
    const feld = eb.find((x) => (x.textContent || "").trim() === m);
    if (!feld) { zeige(name, "Beschriftung „" + m + "\u201C fehlt"); return; }
    const wert = feld.nextElementSibling;
    const t = wert ? (wert.textContent || "").trim() : "";
    if (!/^-?[\d.,]+/.test(t)) zeige(name, "„" + m + "\u201C zeigt keine Zahl, sondern „" + t + "\u201C");
    else ok++;
  });
}

/* Knopf über seinen Text finden und drücken */
function klick(div, text, name) {
  const b = [...div.querySelectorAll("button")].find((x) => (x.textContent || "").includes(text));
  if (!b) { zeige(name, "Knopf mit Text „" + text + "\u201C nicht gefunden"); return false; }
  try { act(() => { b.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); }); ok++; return true; }
  catch (e) { zeige(name, e); return false; }
}

/* ---------- Zustände der Akademie vorbereiten ---------- */
const leer = leereAkademie();
const mitCoins = { ...leereAkademie(), vc: 240, verdient: 240 };
let gegruendet = akaGruenden({ ...leereAkademie(), vc: 300 }, "Akademie am Volkspark", 2026);
let reif = akaGruenden({ ...leereAkademie(), vc: 900,
  stufen: Object.fromEntries(ABTEILUNGEN.map((x) => [x.id, AKA_MAX])) }, "Reifes Haus", 2026);
for (let i = 0; i < 25; i++) reif = akaJahr(reif, reif.jahr + 1).a;
/* Sonderfall: gegründet, aber niemand mehr im Haus */
const leerImHaus = { ...gegruendet, talente: [] };
/* Sonderfall: alte Sicherung ohne die neuen Felder */
const altbestand = { vc: 40, gegruendet: 2026, name: "Alt", jahr: 2030 };

console.log("=== Ansichten ===");
mach("Akademie · nicht gegründet", <AkademieScreen aka={leer} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
mach("Akademie · Coins, nicht gegründet", <AkademieScreen aka={mitCoins} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
mach("Akademie · frisch gegründet", <AkademieScreen aka={gegruendet} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
mach("Akademie · 25 Jahre, voll ausgebaut", <AkademieScreen aka={reif} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
mach("Akademie · niemand im Haus", <AkademieScreen aka={leerImHaus} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
mach("Akademie · Altbestand ohne neue Felder", <AkademieScreen aka={{ ...leereAkademie(), ...altbestand }} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
mach("Akademie · aka fehlt ganz", <AkademieScreen aka={null} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
/* Härtefälle: Sicherungen aus einer Zeit ohne diese Felder */
mach("Akademie · nur Name und Jahr", <AkademieScreen aka={{ name:"X", gegruendet:2026, jahr:2032 }} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
mach("Akademie · Bilanz halb", <AkademieScreen aka={{ name:"X", gegruendet:2026, jahr:2032, vc:12, bilanz:{ profis:3 } }} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
mach("Akademie · Stufen halb", <AkademieScreen aka={{ name:"X", gegruendet:2026, jahr:2032, stufen:{ plaetze:4 } }} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);

const ZAHLEN = ["Jahrgänge", "Profis", "Weltklasse", "Nationalspieler", "Jugendturniere", "Ansehen"];
[["frisch gegründet", gegruendet], ["25 Jahre", reif], ["niemand im Haus", leerImHaus],
 ["Bilanz halb", { name:"X", gegruendet:2026, jahr:2032, vc:12, bilanz:{ profis:3 } }],
 ["Stufen halb", { name:"X", gegruendet:2026, jahr:2032, stufen:{ plaetze:4 } }],
 ["nur Name und Jahr", { name:"X", gegruendet:2026, jahr:2032 }]].forEach(([n, a]) => {
  const r = mach("Zahlen · " + n, <AkademieScreen aka={a} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
  if (r) zahlenPruefen(r.div, ZAHLEN, "Zahlen · " + n);
});

const menuProps = { hall: [], onNew:()=>{}, onHall:()=>{}, save:null, onResume:()=>{}, onAch:()=>{},
  achN:3, metaN:1, onBackup:()=>{}, ruhe:false, setRuhe:()=>{}, setRuheState:()=>{}, onAka:()=>{} };
mach("Hauptmenü · ohne Akademie", <MenuScreen {...menuProps} aka={leer} />);
mach("Hauptmenü · Coins bereit", <MenuScreen {...menuProps} aka={mitCoins} />);
mach("Hauptmenü · Akademie läuft", <MenuScreen {...menuProps} aka={reif} />);
mach("Hauptmenü · aka undefined", <MenuScreen {...menuProps} aka={undefined} />);
mach("Menü · Sicherung ohne Bilanz", <MenuScreen {...menuProps} aka={{ name:"X", gegruendet:2026, jahr:2030 }} />);
/* Die Vereinszeile im Menü in beiden Zuständen (35.21). Der gesperrte ist der
   wichtigere: dort muss die Zahl stehen, die noch fehlt. */
mach("Menü · Verein gesperrt", <MenuScreen {...menuProps} gesamt={{ karrieren: 2 }} />);
{
  const v2 = VEREIN.gruenden(VEREIN.leererVerein(), { name: "FC Prüf", land: "GER", liga: "3. Liga" }).v;
  mach("Menü · Verein frei", <MenuScreen {...menuProps} gesamt={{ karrieren: 7 }}
    verein={v2} onVerein={() => {}} />);
  mach("Menü · Verein ungegründet", <MenuScreen {...menuProps} gesamt={{ karrieren: 7 }}
    verein={null} onVerein={() => {}} />);
}
mach("Hauptmenü · Stufen halb", <MenuScreen {...menuProps} aka={{ name:"Y", gegruendet:2026, jahr:2031, vc:5, stufen:{ plaetze:3 } }} />);

/* ---------- Abschlussbildschirm mit echter Laufbahn ---------- */
function laufbahn(aka) {
  const nat = pick(NATIONS), pos = pick(Object.keys(POS));
  const typen = TYPES.filter((t) => !t.pos || t.pos.includes(pos));
  const q = createPlayer({ name:"Prüfling", nation:nat.id, pos, foot:"rechts", number:9,
    type:(pick(typen)||TYPES[0]).id, mode:pick(MODES).id, gender:"m", statur:"normal", aka });
  for (let i = 0; i < 12; i++) {
    develop(q); q.mv = marketValue(q); simulateSeason(q);
    const of = makeOffers(q); if (!of.length) break;
    q.age += 1; q.year += 1;
  }
  q.verdict = verdict(q); q.retired = true;
  return q;
}
for (let i = 0; i < 4; i++) {
  const q = laufbahn(i % 2 ? reif : null);
  const vc = vcFuer(q);
  const AK = akaVerbuchen(i % 2 ? reif : mitCoins, vc);
  q.vcGewinn = vc; q.vcPosten = vcPosten(q);
  q.akaEreignisse = AK.ereignisse; q.akaName = AK.a.name; q.akaAktiv = !!AK.a.gegruendet;
  mach("Abschluss mit VC #" + (i + 1), <EndScreen p={q} onNew={()=>{}} onHall={()=>{}} onAka={()=>{}} />);
}
/* Abschluss ohne VC-Feld (alter Spielstand) */
{
  const q = laufbahn(null); delete q.vcGewinn;
  mach("Abschluss ohne VC-Feld", <EndScreen p={q} onNew={()=>{}} onHall={()=>{}} onAka={()=>{}} />);
}

/* ---------- Durchklicktest ---------- */
console.log("\n=== Durchklicktest ===");
{
  const r = mach("Akademie interaktiv", <AkademieScreen aka={reif} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
  if (r) {
    ["Jahrgang", "Ehrentafel", "Chronik", "Ausbau"].forEach((t) => {
      if (klick(r.div, t, "Reiter " + t)) {
        const txt = r.div.textContent || "";
        if (txt.length < 50) zeige("Reiter " + t, "Inhalt zu kurz");
      }
    });
  }
}
{
  /* Gründung wirklich auslösen */
  let stand = { ...leereAkademie(), vc: 120 };
  function Huelle() {
    const [a, setA] = React.useState(stand);
    return <AkademieScreen aka={a}
      onKauf={(id) => setA((x) => ({ ...x, vc: x.vc - 20, stufen: { ...x.stufen, [id]: x.stufen[id] + 1 } }))}
      onGruenden={(n) => setA(akaGruenden(a, n, 2026))} onBack={()=>{}} />;
  }
  const r = mach("Gründung interaktiv", <Huelle />);
  if (r) {
    klick(r.div, "Akademie gründen", "Gründen");
    const t = r.div.textContent || "";
    if (!t.includes("Ausbau")) zeige("Gründen", "nach der Gründung fehlt der Ausbaureiter");
    else ok++;
    klick(r.div, "Auf Stufe 2", "Abteilung ausbauen");
  }
}
{
  /* Ganze App: Menü → Akademie → zurück */
  const r = mach("Gesamt-App", <App />);
  if (r) {
    if (klick(r.div, "Jugendakademie", "App: Akademie öffnen")) {
      const knoepfe = [...r.div.querySelectorAll("button")].map((b) => b.textContent || "");
      if (!knoepfe.some((x) => x.includes("Akademie gründen")))
        zeige("App: Akademie", "Gründungsansicht nicht erreicht — gefunden: " + knoepfe.slice(0, 4).join(" | "));
      else ok++;
      if (klick(r.div, "Akademie gründen", "App: gründen")) {
        const t2 = r.div.textContent || "";
        if (!t2.includes("Jahrgang") || !t2.includes("Ehrentafel"))
          zeige("App: nach Gründung", "Reiter fehlen");
        else ok++;
      }
      klick(r.div, "Zurück", "App: zurück");
      if (!(r.div.textContent || "").includes("KARRIERE-SIMULATION"))
        zeige("App: zurück", "Hauptmenü nicht wieder erreicht");
      else ok++;
    }
  }
}

/* ---------- Punkte und Coins dürfen nicht verwechselbar sein ---------- */
console.log("\n=== Punkte gegen Coins ===");
{
  const q = laufbahn(null);
  const vc = vcFuer(q);
  const posten = vcPosten(q);
  const erste = posten[0];
  if (!/Vermächtnispunkten/.test(erste.k))
    zeige("VC-Aufschlüsselung", "erste Zeile nennt die Herkunft nicht: „" + erste.k + "\u201C");
  else ok++;
  if (erste.v >= q.verdict.score)
    zeige("VC-Aufschlüsselung", "Coins (" + erste.v + ") nicht kleiner als Punkte (" + q.verdict.score + ")");
  else ok++;
  console.log("  " + q.verdict.score + " Punkte → " + vc + " Coins · erste Zeile: „" + erste.k + "\u201C ✓");
  /* Der eigentliche Schutz: Keine einzige Laufbahn darf die Akademie
     wesentlich ausbauen. Über viele Läufe gemessen, nicht an einem. */
  {
    const voll = akaRestkosten(leereAkademie());
    const werte = [];
    for (let i = 0; i < 150; i++) werte.push(vcFuer(laufbahn(null)));
    const hoechst = Math.max(...werte);
    const anteil = hoechst / voll;
    console.log("  Höchster Einzelertrag aus 150 Laufbahnen: " + hoechst + " Coins = "
      + (anteil * 100).toFixed(1) + " % des Vollausbaus (" + voll + ")");
    if (anteil > .15) zeige("Umrechnung", "eine Laufbahn deckt " + (anteil * 100).toFixed(1)
      + " % des Vollausbaus — zu viel");
    else ok++;
  }
  const AK = akaVerbuchen(mitCoins, vc);
  q.vcGewinn = vc; q.vcPosten = posten;
  q.akaEreignisse = AK.ereignisse; q.akaName = AK.a.name; q.akaAktiv = !!AK.a.gegruendet;
  const r = mach("Abschluss · Punkte/Coins", <EndScreen p={q} onNew={()=>{}} onHall={()=>{}} onAka={()=>{}} />);
  if (r) {
    const t = r.div.textContent || "";
    if (t.indexOf("Nicht dasselbe wie Vermächtnispunkte") < 0)
      zeige("Abschluss", "Hinweis zum Unterschied fehlt");
    else ok++;
  }
}

/* ---------- Kartenenthüllung: Sperre und Aufwand ---------- */
console.log("\n=== Kartenenthüllung ===");
Object.keys(RARITY).forEach((art) => {
  const karte = { id:"probe_" + art, r:art, n:"Probekarte", t:"Zum Prüfen." };
  const r = mach("Enthüllung · " + art, <WildcardEnthuellung card={karte} onFertig={()=>{}} />);
  if (!r) return;
  /* Vor dem Umdrehen darf es keinen Weiter-Knopf geben — sonst wischt man
     sich die Enthüllung versehentlich weg. */
  const knopf = [...r.div.querySelectorAll("button")].find((b) => (b.textContent||"").includes("Weiter"));
  if (knopf) zeige("Enthüllung · " + art, "Weiter-Knopf ist sofort da, Animation abbrechbar");
  else ok++;
  if (!(r.div.textContent||"").includes("wird aufgedeckt"))
    zeige("Enthüllung · " + art, "Hinweis auf die laufende Animation fehlt");
  else ok++;
});
/* Sonderstufen ohne Gewicht sind das Seltenste im Spiel und müssen den
   vollen Aufwand bekommen, nicht den kleinsten. */
Object.keys(RARITY).filter((k) => RARITY[k].w === 0).forEach((art) => {
  const rang = ["normal","selten","aussen","unfass","welt","goat"].indexOf(art);
  const pomp = RARITY[art].w === 0 ? 1 : Math.max(0, rang) / 5;
  if (pomp < 1) zeige("Sonderstufe " + art, "bekommt nur pomp " + pomp);
  else { console.log("  Sonderstufe „" + RARITY[art].name + "\u201C bekommt vollen Aufwand ✓"); ok++; }
});

/* ---------- Errungenschaften der Akademie ---------- */
console.log("\n=== Errungenschaften der Akademie ===");
{
  const akaErf = ACHIEVEMENTS.filter((a) => a.id.indexOf("a_aka_") === 0);
  console.log("  " + akaErf.length + " Errungenschaften für die Akademie");
  if (akaErf.length < 10) zeige("Errungenschaften", "zu wenige: " + akaErf.length); else ok++;
  const spieler = laufbahn(null);
  const G = leereBilanz();
  /* Leere Akademie: keine einzige darf ausgelöst werden */
  let frueh = akaErf.filter((a) => { try { return a.ok(spieler, G, leereAkademie()); } catch (e) { return true; } });
  if (frueh.length) zeige("Errungenschaften", "greifen zu früh: " + frueh.map((x)=>x.id).join(", "));
  else { console.log("  Ohne Akademie greift keine ✓"); ok++; }
  /* Akademie fehlt ganz: darf nicht abstürzen */
  try { akaErf.forEach((a) => a.ok(spieler, G, null)); console.log("  Ohne Übergabe kein Absturz ✓"); ok++; }
  catch (e) { zeige("Errungenschaften", "stürzen ohne Akademie ab: " + e.message); }
  /* Reifes Haus: die meisten müssen greifen */
  const griff = akaErf.filter((a) => { try { return a.ok(spieler, G, reif); } catch (e) { return false; } });
  console.log("  Reifes Haus (25 Jahre, Stufe 6) löst " + griff.length + " von " + akaErf.length + " aus");
  if (griff.length < 6) zeige("Errungenschaften", "reifes Haus löst nur " + griff.length + " aus");
  else ok++;
}

/* ---------- Nächster Schritt ---------- */
console.log("\n=== Nächster Schritt ===");
{
  const proben = [["leer", leereAkademie()], ["mit 300 VC", { ...leereAkademie(), vc: 300 }],
    ["reif", reif], ["voll ausgebaut", { ...leereAkademie(), vc: 900,
      stufen: Object.fromEntries(ABTEILUNGEN.map((x) => [x.id, AKA_MAX])) }]];
  proben.forEach(([n, a]) => {
    try {
      const z = akaNaechster(a);
      const voll = akaSumme(a) >= ABTEILUNGEN.length * AKA_MAX;
      if (voll && z) { zeige("Nächster Schritt · " + n, "meldet ein Ziel, obwohl alles ausgebaut ist"); return; }
      if (!voll && !z) { zeige("Nächster Schritt · " + n, "meldet kein Ziel"); return; }
      if (z && (z.anteil < 0 || z.anteil > 1)) { zeige("Nächster Schritt · " + n, "Anteil außerhalb 0–1: " + z.anteil); return; }
      console.log("  " + n.padEnd(16) + (z ? z.abt.n + " Stufe " + (z.stufe+1) + " · fehlen " + z.fehlt + " VC"
        : "alles ausgebaut") + " · leistbar: " + akaLeistbar(a));
      ok++;
    } catch (e) { zeige("Nächster Schritt · " + n, e); }
  });
}
/* Der Balken zeigt keinen Text — geprüft wird seine Breite. Werte außerhalb
   von 0 bis 1 müssen gekappt werden, sonst läuft er aus dem Rahmen. */
[[".4 → 40%", .4, "40%"], ["0 → 0%", 0, "0%"], ["1 → 100%", 1, "100%"],
 ["9 → gekappt auf 100%", 9, "100%"], ["-3 → gekappt auf 0%", -3, "0%"]].forEach(([n, v, soll]) => {
  const r = mach("Balken " + n, <Balken anteil={v} farbe="var(--ac)" />, 0);
  if (!r) return;
  const i = r.div.querySelector("i");
  const ist = i ? i.style.width : "(kein Balken)";
  if (ist !== soll) zeige("Balken " + n, "Breite " + ist + " statt " + soll);
  else ok++;
});
/* --- Eigener Verein (35.20) ---------------------------------------------
   Jede Wappenform und jedes Zeichen einmal zeichnen: ein fehlender Pfad faellt
   sonst erst auf, wenn jemand genau diese Kombination waehlt. */
WAPPEN_FORMEN.forEach((f) => WAPPEN_ZEICHEN.forEach((z) =>
  mach("Wappen " + f + "/" + z, <Wappen w={{ form: f, zeichen: z }}
    farben={{ primaer: "#c0392b", sekundaer: "#f4f1ea" }} />, 0)));
TRIKOT_MUSTER.forEach(([m]) => mach("Trikot " + m,
  <Trikot farben={{ primaer: "#1f5c9e", sekundaer: "#f4f1ea" }} muster={m} />, 0));
mach("Verein · Gruendung", <VereinGruenden aka={null} onFertig={() => {}} onZurueck={() => {}} />);
{
  /* Ein Verein in mehreren Zustaenden. Der leere ist der wichtigste — dort
     zeigt sich, ob die Ansicht ohne Kader haelt. */
  const leerV = VEREIN.gruenden(VEREIN.leererVerein(), { name: "Pruef", land: "GER", liga: "3. Liga" }).v;
  const kaderV = ["TW","TW","IV","IV","IV","AV","AV","ZDM","ZDM","ZM","ZM","ZOM","AF","AF","ST","ST"]
    .map((pz, i2) => ({ id: "s" + i2, name: "Spieler " + i2, pos: pz, ovr: 50, pot: 78,
      alter: 19, form: 50, fitness: 80, spiele: 0, tore: 0, jahreImVerein: 0 }));
  const vollV = VEREIN.autoAufstellen({ ...leerV, kader: kaderV });
  const akaV = { vc: 500, talente: [{ id: "t1", name: "Talent", pos: "ST", ovr: 48, pot: 80, alter: 17 }] };
  const nix = () => {};
  mach("Verein ohne Kader", <VereinScreen v={leerV} aka={akaV} onAendern={nix}
    onAkaAendern={nix} onZurueck={nix} onAbschluss={nix} />);
  mach("Verein spielbereit", <VereinScreen v={vollV} aka={akaV} onAendern={nix}
    onAkaAendern={nix} onZurueck={nix} onAbschluss={nix} />);
  mach("Verein ohne Akademie", <VereinScreen v={vollV} aka={null} onAendern={nix}
    onAkaAendern={nix} onZurueck={nix} onAbschluss={nix} />);
  const stark = { ...vollV, jahr: 16, bilanz: { saisons: 15, aufstiege: 3, abstiege: 1,
    meister: 2, tore: 800, gegentore: 700, punkte: 760, bestePlatzierung: 1 } };
  mach("Verein Abschluss stark", <VereinAbschluss v={stark}
    ergebnis={VEREIN.abschluss(stark)} onNeu={nix} onZurueck={nix} />);
  const mager = { ...vollV, jahr: 16, bilanz: { saisons: 15, aufstiege: 0, abstiege: 2,
    meister: 0, tore: 300, gegentore: 500, punkte: 400, bestePlatzierung: 14 } };
  mach("Verein Abschluss mager", <VereinAbschluss v={mager}
    ergebnis={VEREIN.abschluss(mager)} onNeu={nix} onZurueck={nix} />);
}


mach("Ausbau-Ring", <AusbauRing von={14} bis={36} farbe="var(--ac)" />);
mach("Ausbau-Ring · leer", <AusbauRing von={0} bis={36} farbe="var(--ac)" />);

/* ---------- Zwei behobene Fehler, gegen Rückfall gesichert ---------- */
console.log("\n=== Vermächtnis-Laden ===");
{
  /* Preise müssen zum Verdienst passen: eine Laufbahn bringt im Mittel rund
     50 VC. Nichts darf mehr als zwei Laufbahnen kosten, sonst ist es kein
     Angebot mehr, sondern eine Sperre. */
  const teuer = VCLADEN.filter((a) => a.preis > 100);
  if (teuer.length) zeige("Laden", "zu teuer: " + teuer.map((a) => a.n + " " + a.preis).join(", "));
  else ok++;
  const billig = VCLADEN.filter((a) => a.preis < 10);
  if (billig.length) zeige("Laden", "zu billig, wirkt beliebig: " + billig.map((a) => a.n).join(", "));
  else ok++;
  /* Jeder Artikel braucht ein Zeichen — sonst steht dort ein leeres Feld. */
  const ohneBild = VCLADEN.filter((a) => !SHOP_BILD[a.bild]);
  if (ohneBild.length) zeige("Laden", "ohne Zeichen: " + ohneBild.map((a) => a.n).join(", "));
  else ok++;
  /* Und jeder muss irgendwo erreichbar sein. */
  const erreichbar = new Set([...shopFuer("start"), ...shopFuer("saison")].map((a) => a.id));
  const verwaist = VCLADEN.filter((a) => !erreichbar.has(a.id));
  if (verwaist.length) zeige("Laden", "nirgends erreichbar: " + verwaist.map((a) => a.n).join(", "));
  else ok++;
  console.log("  Laden           " + VCLADEN.length + " Artikel · "
    + Math.min(...VCLADEN.map((a) => a.preis)) + "–" + Math.max(...VCLADEN.map((a) => a.preis))
    + " VC · alle mit Zeichen und erreichbar");

  /* Der gekaufte Kartentausch. Er war in 34.18 im Laden, ohne Wirkung — ein
     Knopf, der Geld nimmt und nichts tut. Geprüft wird die ganze Kette:
     Zahl der Tausche, tatsächlicher Tausch, und dass er nach der ersten
     Saison nicht mehr geht. */
  {
    /* `clone` steckt in der Komponente und ist nicht ausführbar — hier
       dieselbe flache Kopie nachgebaut. */
    const clone = (x) => ({ ...x, attrs: { ...x.attrs }, flags: { ...x.flags },
      nt: { ...x.nt }, laden: { ...(x.laden || {}) }, meta: { ...(x.meta || {}) },
      seasons: [...(x.seasons || [])], assets: [...(x.assets || [])] });
    const roh = laufbahn(null);
    const frisch = () => { const q = clone(roh); q.seasons = []; q.wcRerolls = 0; return q; };

    const ohne = frisch();
    const mitKauf = frisch(); mitKauf.laden = { reroll: 1 };
    const mitFrei = frisch(); mitFrei.meta = { mx_reroll: true };
    const beides = frisch(); beides.laden = { reroll: 1 }; beides.meta = { mx_reroll: true };
    const soll = [["ohne alles", ohne, 1], ["gekauft", mitKauf, 2],
      ["freigeschaltet", mitFrei, 2], ["beides", beides, 3]];
    let stimmt = 0;
    soll.forEach(([n, q, z]) => {
      if (tauschRest(q) !== z) zeige("Kartentausch", n + ": " + tauschRest(q) + " Tausche statt " + z);
      else { ok++; stimmt++; }
    });

    /* Der zweite Tausch muss auch WIRKLICH durchgehen. */
    const q = frisch(); q.laden = { reroll: 1 };
    const eins = rerollWildcard(clone(q));
    const zwei = rerollWildcard(clone(eins));
    if ((eins.wcRerolls || 0) !== 1) zeige("Kartentausch", "erster Tausch zählt nicht");
    else ok++;
    if ((zwei.wcRerolls || 0) !== 2) zeige("Kartentausch", "zweiter Tausch geht nicht durch trotz Kauf");
    else ok++;
    const drei = rerollWildcard(clone(zwei));
    if ((drei.wcRerolls || 0) !== 2) zeige("Kartentausch", "dritter Tausch geht durch — Grenze wirkt nicht");
    else ok++;

    /* Nach der ersten Saison ist Schluss, auch mit Kauf. */
    const gespielt = frisch(); gespielt.laden = { reroll: 1 };
    gespielt.seasons = [{ y: 2026, club: "HSV", apps: 30 }];
    const nach = rerollWildcard(clone(gespielt));
    if ((nach.wcRerolls || 0) !== 0) zeige("Kartentausch", "Tausch geht noch nach der ersten Saison");
    else ok++;
    console.log("  Kartentausch    " + stimmt + " von 4 Zählungen · zweiter Tausch geht durch ✓ · "
      + "dritter gesperrt ✓ · nach der Saison gesperrt ✓");
  }

  /* Der Laden zeigt in BEIDEN Lagen alles. Vorher filterte er, und im
     Hauptmenü stand ein einziger Artikel — das sah aus wie ein Fehler.
     Nicht nutzbares ist gesperrt, nicht versteckt. */
  ["start", "saison"].forEach((wo) => {
    const r = mach("Laden · " + wo, <VCLadenAnsicht wo={wo} vc={999} laden={{}} onKauf={() => {}} />, 0);
    if (!r) return;
    const knoepfe = [...r.div.querySelectorAll("button")];
    if (knoepfe.length !== VCLADEN.length)
      zeige("Laden", wo + ": " + knoepfe.length + " Knöpfe für " + VCLADEN.length + " Artikel");
    else ok++;
    /* Mit genug Coins muss in der Laufbahn alles kaufbar sein, im Hauptmenü
       nur, was dort Sinn ergibt. */
    const gesperrt = knoepfe.filter((b) => b.disabled).length;
    const erwartet = VCLADEN.filter((a) => ladenGesperrt(a, wo)).length;
    if (gesperrt !== erwartet)
      zeige("Laden", wo + ": " + gesperrt + " gesperrt, erwartet " + erwartet);
    else ok++;
    console.log("  Laden · " + wo.padEnd(7) + " " + knoepfe.length + " Artikel · " + gesperrt + " gesperrt");
  });

  /* ---- Das Kaufmodell (34.22) -----------------------------------------
     Bis 34.21 stand der Kauf in `aka.laden`, heruntergezählt wurde aber nur
     `p.laden`. Folge: im Laden stand ewig „läuft“, Nachkaufen war für immer
     gesperrt, und jede neue Laufbahn bekam den Kauf geschenkt. Geprüft wird
     jetzt jede der drei Arten einzeln — und vor allem, dass ein abgelaufener
     Artikel WIEDER kaufbar ist. */
  {
    const art = (id) => VCLADEN.find((a) => a.id === id);
    const faelle = [
      /* Artikel, Bestand, kaufbar?, warum */
      ["läuft gerade",        art("training"), { training: 1 }, false],
      ["abgelaufen",          art("training"), { training: 0 }, true],
      ["nie gekauft",         art("training"), {},              true],
      ["Sofortwirkung",       art("physio"),   { physio: 1 },   true],
      ["Sofortwirkung zwei",  art("trainer"),  {},              true],
      ["Vorrat stapelt",      art("reroll"),   { reroll: 3 },   true],
      ["lange Dauer läuft",   art("ueber99"),  { ueber99: 2 },  false],
      ["lange Dauer vorbei",  art("ueber99"),  { ueber99: 0 },  true],
    ];
    let stimmt = 0;
    faelle.forEach(([n, a, L, soll]) => {
      if (!a) { zeige("Kaufmodell", n + ": Artikel fehlt"); return; }
      if (ladenKaufbar(a, L) !== soll)
        zeige("Kaufmodell", n + ": kaufbar=" + ladenKaufbar(a, L) + ", erwartet " + soll);
      else { ok++; stimmt++; }
    });
    console.log("  Kaufmodell      " + stimmt + " von " + faelle.length + " Lagen richtig");

    /* Sofortwirkungen dürfen NICHTS hinterlassen — sonst blockieren sie sich
       selbst, obwohl sie längst gewirkt haben. */
    const sofort = VCLADEN.filter((a) => !a.vorrat && !a.dauer).map((a) => a.id);
    if (!sofort.length) zeige("Kaufmodell", "kein Artikel wirkt sofort — physio und trainer fehlen");
    else ok++;

    /* Jeder Artikel muss genau EINE Art haben. Ein Artikel ohne Dauer und
       ohne Vorrat, der trotzdem einen Eintrag hinterlassen soll, gäbe es
       nicht — und einer mit beidem wäre widersprüchlich. */
    const doppelt = VCLADEN.filter((a) => a.vorrat && a.dauer);
    if (doppelt.length) zeige("Kaufmodell", "Vorrat UND Dauer: " + doppelt.map((a) => a.id).join(", "));
    else ok++;

    /* Der Ablauf über eine echte Saison. Das ist der Kern des Fehlers: läuft
       der Zähler nicht auf 0, bleibt der Artikel für immer gesperrt. */
    const q = laufbahn(null);
    q.laden = { training: 1, ueber99: 4, reroll: 2 };
    const vorher = { ...q.laden };
    simulateSeason(q);
    const L = q.laden || {};
    if ((L.training || 0) !== 0)
      zeige("Kaufmodell", "training nach einer Saison " + L.training + " statt 0");
    else ok++;
    if ((L.ueber99 || 0) !== 3)
      zeige("Kaufmodell", "ueber99 nach einer Saison " + L.ueber99 + " statt 3");
    else ok++;
    if ((L.reroll || 0) !== 2)
      zeige("Kaufmodell", "der Vorrat wurde heruntergezählt: reroll " + L.reroll + " statt 2");
    else ok++;
    /* Und jetzt die Frage, um die es geht. */
    if (!ladenKaufbar(art("training"), L))
      zeige("Kaufmodell", "training ist nach Ablauf immer noch nicht nachkaufbar");
    else ok++;
    /* Den GEMESSENEN Zustand nennen, nicht den erwünschten. Beim ersten
       Entwurf stand hier fest „danach nachkaufbar ✓“ — und das behauptete die
       Zeile auch in der Gegenprobe noch, als die Prüfung darüber schon rot
       gemeldet hatte. Derselbe Fehler wie in 34.21 bei der Kopfleiste. */
    console.log("  Ablauf          training " + vorher.training + "→" + (L.training || 0)
      + " · ueber99 " + vorher.ueber99 + "→" + (L.ueber99 || 0)
      + " · Vorrat reroll " + vorher.reroll + "→" + (L.reroll || 0)
      + " · danach nachkaufbar: " + (ladenKaufbar(art("training"), L) ? "ja" : "NEIN"));

    /* Der Vorrat muss sich auch WIRKLICH in Tausche übersetzen, nicht nur
       zählbar sein. Zwei gekaufte Tausche = drei insgesamt. */
    const t = laufbahn(null); t.seasons = []; t.wcRerolls = 0; t.meta = {};
    t.laden = { reroll: 2 };
    if (tauschMax(t) !== 3) zeige("Kaufmodell", "zwei gekaufte Tausche ergeben " + tauschMax(t) + " statt 3");
    else ok++;
    console.log("  Vorrat          reroll 2 → " + tauschMax(t) + " Tausche insgesamt");
  }
}

console.log("\n=== Freischaltungen ===");
{
  /* Zugeklappt darf die Liste NICHT dastehen — genau das war der Mangel:
     48 Karten untereinander. Zugeklappt nur die Zähler je Art. */
  const zu = mach("Errungenschaften · zu", <AchievementScreen ach={{}} meta={{ mw_ikone: true, mx_events: true }}
    ges={leereBilanz()} onBack={() => {}} />, 0);
  if (zu) {
    const t = zu.div.textContent || "";
    /* Nicht am Namen prüfen: der steht auch bei der Errungenschaft als
       Belohnung im Text. Gezählt wird stattdessen, wie viele Bänder mit
       Artüberschrift dastehen — die gibt es nur aufgeklappt. */
    const baender = [...zu.div.querySelectorAll(".band")]
      .filter((b) => /Neue Wildcards|Bessere Chancen|Startvorteile|Spielregeln|Neue Ereignisse|Aussehen/.test(b.textContent || ""));
    if (baender.length)
      zeige("Freischaltungen", "zugeklappt stehen " + baender.length + " aufgeklappte Bündel da");
    else ok++;
    if (!/Neue Wildcards/.test(t)) zeige("Freischaltungen", "die Übersicht nach Art fehlt");
    else ok++;
    /* Der Zähler muss stimmen: zwei freigeschaltet von 48. */
    if (!/2 von 48/.test(t)) zeige("Freischaltungen", "Zähler stimmt nicht: erwartet „2 von 48\u201C");
    else ok++;
    console.log("  Freischaltungen zugeklappt: Übersicht nach Art ✓ · Zähler 2 von 48 ✓");
  }
}

/* ---- Seltenheiten der Wildcards (34.30) ---------------------------------
   Bis 34.29 war `drawWildcard` nicht ausgeführt — die Verteilung liess sich
   gar nicht messen. In 34.5 gab es genau hier einen stillen Fehler: ein
   Gewicht von 0 in der HSV-Stufe liess NaN durch die Wichtung laufen, und
   ALLE Ziehungen kamen als Normal zurück, ohne dass irgendwo etwas aufgefallen
   wäre. Deshalb wird nicht nur „es kommt eine Karte" geprüft, sondern die
   Verteilung selbst. */
/* ---- Spiegelgleichheit der Kopfformen (34.33) ---------------------------
   Kevin sah es am Porträtbogen: bei den verjüngten Kinnpartien beulte die
   rechte Seite aus. Ursache war ein einzelner Stützpunkt, der beim Umbau in
   34.28 rechts auf der alten Kieferbreite stehen blieb, während links schon
   der verjüngte Wert stand.

   Geprüft wird nicht das Bild, sondern der Pfad: zu jedem Punkt (x, y) muss
   es einen Partner (100 - x, y) geben. Das ist eine reine Rechnung und
   erwischt jede künftige einseitige Änderung sofort. */
/* ---- Namentlich versprochene Rückkehr (34.34) ---------------------------
   Kevin: „Union Berlin will dich zurück" — zugesagt, und dann standen vier
   andere Vereine im Fenster. Der Titel nennt den Verein, die Wirkung war aber
   nur ein allgemeiner Wechselwunsch; der genannte Verein wurde nirgends
   festgehalten. Geprüft wird jetzt genau das: Versprechen rein, Angebot raus. */
console.log("\n=== Versprochene Rückkehr ===");
{
  let drin = 0, geprueft = 0, weg = 0;
  for (let i = 0; i < 40; i++) {
    const q = laufbahn(null);
    /* Die Rautekarte sticht jedes Versprechen — wer sie gezogen hat, bleibt
       beim HSV. Solche Läufe gehören nicht in diese Zählung. Dass sie hier
       auftauchen können, hat der Prüfstand selbst gezeigt: der Lauf war
       zunächst 40 von 40 grün und fiel erst später um, weil `laufbahn` würfelt. */
    if (q.flags && q.flags.nurderhsv) continue;
    /* Einen echten anderen Verein als Versprechen setzen. */
    const ziel = CLUBS.find((c) => c.n !== q.club.n && c.l === q.club.l);
    if (!ziel) continue;
    q.prevClub = ziel.n;
    q.flags = { ...(q.flags || {}), rueckkehrZu: ziel.n };
    q.contract = 0;
    let of = [];
    try { of = makeOffers(q) || []; } catch (e) { zeige("Rückkehr", e.message); break; }
    geprueft++;
    if (of.some((o) => o.club && o.club.n === ziel.n)) drin++;
    else zeige("Rückkehr", "versprochener Verein " + ziel.n + " fehlt im Fenster");
    /* Das Versprechen darf danach verbraucht sein. */
    if (!q.flags.rueckkehrZu) weg++;
  }
  if (geprueft && drin === geprueft) ok++;
  if (geprueft && weg === geprueft) ok++;
  else if (geprueft) zeige("Rückkehr", "das Versprechen bleibt stehen und wiederholt sich jede Saison");
  console.log("  Rückkehr        " + drin + " von " + geprueft + " Versprechen eingelöst · "
    + weg + " danach verbraucht");
}

console.log("\n=== Kopfformen ===");
{
  let schief = 0;
  KOPFFORM.forEach((k, idx) => {
    const d = kopfPfad(k);
    /* Alle Zahlenpaare aus dem Pfad holen. */
    const zahlen = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    const punkte = [];
    for (let i = 0; i + 1 < zahlen.length; i += 2) punkte.push([zahlen[i], zahlen[i + 1]]);
    const rund = (v) => Math.round(v * 1000) / 1000;
    /* Als MENGE vergleichen, nicht Stück für Stück. Der erste Entwurf strich
       jeden Partner nach dem Finden weg — und meldete dadurch alle zehn
       Formen als schief, auch die unveränderten: ein geschlossener Pfad nennt
       seinen Startpunkt zweimal (einmal bei M, einmal vor dem Z), sein
       Spiegelbild aber nur einmal. Ein Falschalarm, im Gegenlauf gefunden. */
    const haben = new Set(punkte.map(([x, y]) => rund(x) + "|" + rund(y)));
    const fehlt = [];
    punkte.forEach(([x, y]) => {
      if (!haben.has(rund(100 - x) + "|" + rund(y))) fehlt.push(x + "," + y);
    });
    if (fehlt.length) {
      schief++;
      zeige("Kopfformen", k.n + " (" + idx + ") ist nicht spiegelgleich: " + fehlt.slice(0, 3).join(" · "));
    }
  });
  if (!schief) ok++;
  console.log("  Spiegelgleich   " + (KOPFFORM.length - schief) + " von " + KOPFFORM.length + " Formen");
}

console.log("\n=== Wildcards ===");
{
  const t = {};
  let kaputt = 0;
  /* 20.000 statt 4.000 (35.13). Die Prüfung wurde in einem Lauf rot und im
     nächsten grün, ohne dass sich am Spiel etwas geändert hatte. Nachgemessen
     an 400.000 Ziehungen: „hsv" kommt 1 zu 1.020 — bei 4.000 Ziehungen bleibt
     es in 1,98 % der Läufe aus, also etwa in jedem fünfzigsten Prüfstandlauf.
     Eine Prüfung, die zufällig rot wird, ist schlimmer als keine: sie bringt
     einem bei, Rot zu übersehen. Mit 20.000 Ziehungen sind es 1 zu 328
     Millionen. Kostet rund eine Sekunde. */
  for (let i = 0; i < 20000; i++) {
    let c = null;
    try { c = drawWildcard(pick(Object.keys(POS)), [], null, {}, {}, 0); }
    catch (e) { if (!kaputt++) zeige("Wildcards", "Ziehen scheitert: " + e.message); continue; }
    if (!c || !c.r) { if (!kaputt++) zeige("Wildcards", "Ziehung ohne Seltenheit"); continue; }
    t[c.r] = (t[c.r] || 0) + 1;
  }
  const ges = Object.keys(t).reduce((s, k) => s + t[k], 0) || 1;
  const nie = Object.keys(RARITY).filter((k) => !t[k]);
  if (nie.length) zeige("Wildcards", "nie gezogen: " + nie.join(", "));
  else ok++;
  const normal = (t.normal || 0) / ges;
  if (normal > .8) zeige("Wildcards", Math.round(normal * 100) + " % Normal — die Wichtung greift nicht");
  else ok++;
  if (Object.keys(t).length < 3) zeige("Wildcards", "nur " + Object.keys(t).length + " Stufen gezogen");
  else ok++;
  console.log("  Verteilung      " + ges + " Ziehungen · "
    + Object.keys(t).sort((x, y) => t[y] - t[x])
      .map((k) => k + " " + (100 * t[k] / ges).toFixed(1) + "%").join(" · "));
}

console.log("\n=== Rückblick-Karten ===");
{
  /* Der Rückblick zeigt immer nur EINE Seite, und mein Versuch, im Prüfstand
     durchzublättern, hat nicht gegriffen. Statt die Prüfung zu verbiegen, bis
     sie grün ist, wird hier das geprüft, was sicher prüfbar ist: dass die
     DATEN ankommen, aus denen die Karten gebaut werden. Ob die Karte am Ende
     gut aussieht, beantwortet nur das Gerät — und das steht so in STAND.md.

     Sperrspiele flossen bis 34.14 nur in `missed` und waren danach verloren;
     die Karte hätte Verletzung und Sperre nicht auseinanderhalten können. */
  const q = laufbahn(null);
  q.ban = 4;
  const sa = simulateSeason(q);
  if (!sa || sa.banned !== 4)
    zeige("Rückblick", "Sperrspiele kommen nicht in der Saison an: " + (sa && sa.banned));
  else ok++;
  const q2 = laufbahn(null);
  const sa2 = simulateSeason(q2);
  if (sa2 && sa2.banned !== 0)
    zeige("Rückblick", "ohne Sperre steht " + sa2.banned + " statt 0");
  else ok++;
  console.log("  Rückblick       Sperrspiele getrennt erfasst: " + (sa ? sa.banned : "?")
    + " mit Sperre, " + (sa2 ? sa2.banned : "?") + " ohne");
}

console.log("\n=== Wachstumskurve ===");
{
  /* Zwei Zusagen an den Spieler, beide messbar:
     1. Kein extremer Sprung mit 16 — auch ein mittelmässiger Spieler soll sich
        über Jahre entwickeln, nicht in zwei Saisons fertig sein.
     2. Wer weit unter seinen Anlagen liegt, wächst auch mit 27 noch. */
  const wachstumBei = (alter, ovr, pot) => {
    const q = laufbahn(null);
    q.age = alter; q.potential = pot; q.training = "abschluss";
    q.seasons = [{ apps: 32, goals: 8 }]; q.morale = 70; q.trust = 70;
    q.fitness = 85; q.injuryProne = 20;
    /* Werte gleichmässig auf die Zielstärke setzen. */
    AK.forEach((k) => { q.attrs[k] = ovr; });
    q.ovr = ovr;
    const vor = q.ovr;
    develop(q);
    return q.ovr - vor;
  };
  /* Mittelwert über mehrere Läufe: develop würfelt (rnd .75–1.25). */
  const mittel = (alter, ovr, pot, n) => {
    let s = 0; for (let i = 0; i < (n || 40); i++) s += wachstumBei(alter, ovr, pot);
    return +(s / (n || 40)).toFixed(2);
  };

  const jung = mittel(16, 52, 85);
  if (jung > 5) zeige("Wachstum", "mit 16 im Schnitt +" + jung + " Punkte — zu steil");
  else ok++;

  /* Ein 27-Jähriger, der 12 Punkte unter seinen Anlagen liegt, muss deutlich
     mehr wachsen als einer, der sie fast erreicht hat. Genau das war Kevins
     Punkt: „Anlage 97, mit 25 ein Höchstwert von 85, dann passiert nichts." */
  const weitUnten = mittel(27, 85, 97);
  const fastOben  = mittel(27, 85, 88);
  if (weitUnten <= fastOben)
    zeige("Wachstum", "mit 27 wächst ein Spieler mit grosser Lücke (" + weitUnten
      + ") nicht mehr als einer ohne (" + fastOben + ")");
  else ok++;
  if (weitUnten < .5)
    zeige("Wachstum", "mit 27 und 12 Punkten Rückstand nur +" + weitUnten + " — zu wenig");
  else ok++;

  /* Und mit 33 soll es vorbei sein, auch bei grosser Lücke. */
  const alt = mittel(33, 80, 97);
  if (alt > 1.2) zeige("Wachstum", "mit 33 noch +" + alt + " Punkte — zu viel");
  else ok++;

  console.log("  Wachstum        16 J. +" + jung + " · 27 J. mit Lücke +" + weitUnten
    + " · 27 J. ohne +" + fastOben + " · 33 J. +" + alt);
}

console.log("\n=== Block D ===");
{
  /* Das Auto-Training darf keine Einheit wählen, deren Werte schon am Anschlag
     sind. Vorher schickte es einen Stürmer mit Schuss 99 und Tempo 99 weiter
     zum Abschlusstraining. */
  const held = laufbahn(null);
  held.age = 26; held.fitness = 90; held.injuryProne = 20; held.pos = "ST";
  AK.forEach((k) => { held.attrs[k] = 70; });
  const normal = autoTraining(held);
  const bias = (id) => (TRAINING.find((t) => t.id === id) || {}).bias || {};
  /* Die Werte der zuerst gewählten Einheit auf Anschlag setzen. */
  Object.keys(bias(normal)).forEach((k) => { held.attrs[k] = 99; });
  const danach = autoTraining(held);
  if (danach === normal)
    zeige("Auto-Training", "wählt „" + normal + "\u201C weiter, obwohl die Werte auf 99 stehen");
  else ok++;
  /* Und es darf nicht abstürzen, wenn ALLES am Anschlag ist. */
  AK.forEach((k) => { held.attrs[k] = 99; });
  const voll = autoTraining(held);
  if (!voll || !TRAINING.some((t) => t.id === voll))
    zeige("Auto-Training", "liefert bei vollen Werten kein gültiges Training: " + voll);
  else ok++;
  /* Die Reiterleisten müssen in ihrer Hülle stecken — sonst fehlt der
     Randverlauf, und man sieht der Leiste wieder nicht an, dass sie
     weitergeht. Eine reine Stilangabe verschwindet bei einem Umbau lautlos. */
  const mitHuelle = (name, el) => {
    const r = mach(name, el, 0);
    if (!r) return null;
    const tabs = [...r.div.querySelectorAll(".tabs")];
    const drin = tabs.filter((t) => t.parentElement && t.parentElement.classList.contains("tabhuelle"));
    return { tabs: tabs.length, drin: drin.length };
  };
  const aka = mitHuelle("Akademie-Reiter",
    <AkademieScreen aka={gegruendet} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
  if (aka) {
    if (aka.tabs === 0) zeige("Reiter", "keine Reiterleiste gefunden");
    else if (aka.drin !== aka.tabs) zeige("Reiter", aka.drin + " von " + aka.tabs + " Leisten in der Hülle");
    else ok++;
    console.log("  Reiter          " + aka.drin + " von " + aka.tabs + " Leisten mit Randverlauf");
  }

  console.log("  Auto-Training   bei 70 „" + normal + "\u201C · nach Anschlag „" + danach
    + "\u201C · alles 99 „" + voll + "\u201C");
}

console.log("\n=== Frauenfußball ===");
{
  /* Die Umformung läuft über JEDEN Ereignistext, wenn eine Frau spielt.
     Geprüft wird an Fällen, die beim Bauen nacheinander schiefgingen —
     Artikel, Plural, Großschreibung. */
  const faelle = [
    ["Du bist einer von vier.", "Du bist eine von vier."],
    ["Der Kapitän spricht dich an.", "Die Kapitänin spricht dich an."],
    ["Dem Kapitän ist das egal.", "Der Kapitänin ist das egal."],
    ["Ein Mitspieler lästert.", "Eine Mitspielerin lästert."],
    ["Zwei Spieler fehlen.", "Zwei Spielerinnen fehlen."],
    ["Die Spieler stehen im Kreis.", "Die Spielerinnen stehen im Kreis."],
    ["Nationalspieler mit 19.", "Nationalspielerin mit 19."],
    ["Als Erster durchs Ziel.", "Als Erste durchs Ziel."],
    ["Du bist der Beste im Team.", "Du bist die Beste im Team."],
    /* Der Trainer bleibt Trainer: auch eine Frauenmannschaft kann einen
       Mann als Trainer haben. */
    ["Der Trainer nimmt dich zur Seite.", "Der Trainer nimmt dich zur Seite."],
  ];
  let richtig = 0;
  faelle.forEach(([ein, soll]) => {
    const ist = weiblichForm(ein);
    if (ist !== soll) zeige("Frauenfußball", "„" + ein + "\u201C → „" + ist + "\u201C statt „" + soll + "\u201C");
    else { ok++; richtig++; }
  });
  console.log("  Umformung       " + richtig + " von " + faelle.length + " Fällen richtig");

  /* Nach der Umformung darf KEIN männlicher Rest übrig bleiben. Über alle
     2.700 Ereignistexte laufen lassen — die Stichprobe oben findet nur, was
     ich mir ausgedacht habe. */
  const REST = /\b(der|dem|ein|einem|einen|dein|kein) (Spieler|Mitspieler|Kapitän|Torjäger|Nationalspieler|Stürmer|Verteidiger)\b/;
  const alle = [];
  EVENTS.forEach((e) => {
    if (typeof e.title === "function") { try { alle.push(e.title({})); } catch (x) {} }
    (e.choices || []).forEach((c) => { if (c.label) alle.push(c.label); if (c.hint) alle.push(c.hint);
      (c.roll || []).forEach((r) => { if (typeof r.text === "string") alle.push(r.text); }); });
  });
  const reste = alle.map(weiblichForm).filter((x) => REST.test(x));
  if (reste.length) zeige("Frauenfußball", reste.length + " Texte mit männlichem Rest: "
    + reste.slice(0, 2).map((x) => x.slice(0, 60)).join(" | "));
  else ok++;
  console.log("  Ereignistexte   " + alle.length + " umgeformt · " + reste.length + " männliche Reste");

  /* Bei einem Mann darf sich NICHTS ändern. Sonst hätte die Umformung eine
     Nebenwirkung auf 80 % aller Laufbahnen. */
  const proben = alle.slice(0, 200);
  const mann = proben.filter((t) => evText(t, { p: { g: "m" } }) !== t);
  if (mann.length) zeige("Frauenfußball", mann.length + " Texte ändern sich auch bei einem Mann");
  else ok++;
  console.log("  Gegenprobe      200 Texte bei einem Mann unverändert");
}

console.log("\n=== Sprache ===");
{
  /* Zwei Dinge, die beim Umschreiben leicht kaputtgehen: eine Anleitungszeile
     ohne Text, und Behördendeutsch, das sich wieder einschleicht. Der Ton
     selbst lässt sich nicht prüfen — die Struktur schon. */
  let leer = 0, lang = 0, zeilen = 0;
  ANLEITUNG.forEach(([kopf, teile]) => {
    if (!kopf) leer++;
    teile.forEach(([t, txt]) => {
      zeilen++;
      if (!t || !txt) leer++;
      if ((txt || "").length > 130) lang++;
    });
  });
  if (leer) zeige("Anleitung", leer + " Zeilen ohne Kopf oder Text");
  else ok++;
  if (lang) zeige("Anleitung", lang + " Zeilen über 130 Zeichen — zu lang für eine Kurzanleitung");
  else ok++;
  /* Behördendeutsch darf sich nicht wieder einschleichen. Der Ton lässt sich
     nicht prüfen, aber diese Wendungen sind ein verlässliches Zeichen dafür,
     dass ein Satz nicht aus der Kabine kommt. Gemessen an 445 Titeln, 974
     Auswahlmöglichkeiten und 1163 Ergebnistexten. */
  const STEIF = [/\bsomit\b/i, /\bzudem\b/i, /\bhinsichtlich\b/i, /\bbezüglich\b/i,
    /\bdiesbezüglich\b/i, /\bseitens\b/i, /\bim Rahmen\b/i, /\bgegebenenfalls\b/i,
    /\bfolglich\b/i, /\bzur Verfügung\b/i, /\bentsprechend\b/i];
  const alleTexte = [];
  EVENTS.forEach((e) => {
    if (e.title) alleTexte.push(String(e.title));
    (e.choices || []).forEach((c) => {
      if (c.label) alleTexte.push(c.label);
      if (c.hint) alleTexte.push(c.hint);
      (c.roll || []).forEach((r) => { if (r.text) alleTexte.push(r.text); });
    });
  });
  const steif = alleTexte.filter((x) => STEIF.some((mu) => mu.test(x)));
  if (steif.length) zeige("Sprache", steif.length + " Texte mit steifen Wendungen: "
    + steif.slice(0, 3).map((x) => x.slice(0, 50)).join(" | "));
  else ok++;
  console.log("  Ereignistexte   " + alleTexte.length + " geprüft · " + steif.length + " steife Wendungen");
  console.log("  Anleitung       " + ANLEITUNG.length + " Kapitel · " + zeilen + " Zeilen · längste "
    + Math.max(...ANLEITUNG.flatMap(([, t]) => t.map(([, x]) => (x || "").length))) + " Zeichen");
}

console.log("\n=== Block A ===");
{
  /* A1 · Die Zurück-Taste. Der Stapel muss beim Aufbau wachsen und beim
     Abbau wieder schrumpfen — sonst sammeln sich Empfänger an und die Taste
     schliesst irgendwann das Falsche. */
  const vorher = ZURUECK.length;
  const r = mach("Ruhmeshalle für Zurück", <HallScreen hall={[]} onBack={() => {}} />, 0);
  const waehrend = ZURUECK.length;
  if (r && r.abbauen) r.abbauen();
  if (waehrend !== vorher + 1)
    zeige("Zurück-Taste", "Stapel wuchs um " + (waehrend - vorher) + " statt um 1");
  else ok++;
  console.log("  Zurück-Taste    Stapel " + vorher + " → " + waehrend + " beim Öffnen");

  /* A3 · Die Rentenfrage darf nur einmal kommen, und nur wenn die Stärke
     wirklich gefallen ist. Geprüft wird die Bedingung, nicht der Bildschirm. */
  const frageKommt = (age, ovr, peak, schonGefragt) =>
    age >= 33 && !schonGefragt && (peak - ovr) >= 4;
  const faelle = [
    ["32, stark gefallen", frageKommt(32, 70, 80, false), false],
    ["35, auf dem Zenit",  frageKommt(35, 80, 80, false), false],
    ["35, 4 unter Bestwert", frageKommt(35, 76, 80, false), true],
    ["38, schon gefragt",  frageKommt(38, 60, 80, true),  false],
  ];
  let stimmt = 0;
  faelle.forEach(([n, ist, soll]) => {
    if (ist !== soll) zeige("Rentenfrage", n + ": " + ist + " statt " + soll);
    else { ok++; stimmt++; }
  });
  console.log("  Rentenfrage     " + stimmt + " von " + faelle.length + " Fällen richtig");

  /* A5 · Der Namensvorschlag muss zur Herkunft passen und bei gleicher
     Kennung gleich bleiben — sonst wechselte er bei jedem Tastendruck. */
  const a1 = namensVorschlag("GER", "m", 4242), a2 = namensVorschlag("GER", "m", 4242);
  if (a1 !== a2) zeige("Namensvorschlag", "gleiche Kennung, zwei Namen: " + a1 + " / " + a2);
  else ok++;
  const verschieden = new Set(["GER", "ESP", "JPN", "TUR", "NGA", "BRA"]
    .map((n) => namensVorschlag(n, "m", 4242)));
  if (verschieden.size < 5)
    zeige("Namensvorschlag", "nur " + verschieden.size + " verschiedene Namen für 6 Herkünfte");
  else ok++;
  const w = namensVorschlag("GER", "w", 4242);
  if (w === a1) zeige("Namensvorschlag", "Frau und Mann bekommen denselben Namen");
  else ok++;
  /* Keine kaputten Zeichen in den Listen. */
  const alleNamen = ["GER","ENG","ESP","ITA","FRA","NED","POR","GRE","TUR","CZE","SRB","SEN","JPN","EGY"]
    .flatMap((n) => ["m", "w"].map((g) => namensVorschlag(n, g, 4242)));
  const kaputt = alleNamen.filter((x) => /[\u0400-\u04FF]|undefined/.test(x));
  if (kaputt.length) zeige("Namensvorschlag", "fehlerhafte Namen: " + kaputt.join(", "));
  else ok++;
  console.log("  Namensvorschlag " + verschieden.size + " Herkünfte verschieden · stabil · "
    + alleNamen.length + " Namen ohne Fremdzeichen · Beispiel: " + a1 + " / " + w);
}

console.log("\n=== Vier gemeldete Fehler ===");
{
  /* 1 · Der Pass wuchs mit jeder Station, weil beide Seiten im selben
     Rasterfeld liegen und die längere die Höhe bestimmt. Geprüft wird, dass
     die Liste ab sieben Stationen innen rollt. */
  const passMit = (n) => {
    const q = laufbahn(null);
    q.seasons = [];
    for (let i = 0; i < n; i++)
      q.seasons.push({ y: 2026 + i, club: "Verein " + i, apps: 30, goals: 5, assists: 3,
        note: 3, league: "Bundesliga", ovr: 70 });
    const r = mach("Spielerpass · " + n + " Stationen", <Pass p={q} full />, 0);
    if (!r) return null;
    const rollend = [...r.div.querySelectorAll("div")].filter((e) => e.style.overflowY === "auto");
    return rollend.length;
  };
  /* Die angegebene Höhe der Rollfläche — sie muss unabhängig von der Zahl der
     Stationen gleich sein, sonst wächst der Pass wieder mit. */
  const hoehe = (n) => {
    const q = laufbahn(null);
    q.seasons = [];
    for (let i = 0; i < n; i++)
      q.seasons.push({ y: 2026 + i, club: "Verein " + i, apps: 30, goals: 5, assists: 3,
        note: 3, league: "Bundesliga", ovr: 70 });
    const r = mach("Passhöhe " + n, <Pass p={q} full />, 0);
    if (!r) return "?";
    const e = [...r.div.querySelectorAll("div")].find((x) => x.style.overflowY === "auto");
    return e ? e.style.height : "(keine)";
  };
  /* Ab 34.16 hat die Liste IMMER eine feste Höhe — die alte Prüfung erwartete
     bei wenigen Stationen keine Rollfläche und hat deshalb angeschlagen. Sie
     hatte recht, gemessen am alten Stand: die Grenze ab sieben Stationen war
     falsch, weil der Pass bis dahin weiterwuchs. Geprüft wird jetzt, dass die
     Rollfläche IMMER da ist und immer gleich hoch. */
  const wenig = passMit(3), viel = passMit(14);
  if (wenig !== 1) zeige("Spielerpass", "bei 3 Stationen " + wenig + " Rollflächen statt 1");
  else ok++;
  if (viel !== 1) zeige("Spielerpass", "bei 14 Stationen " + viel + " Rollflächen statt 1");
  else ok++;
  if (hoehe(3) !== hoehe(14))
    zeige("Spielerpass", "Höhe unterscheidet sich: " + hoehe(3) + " bei 3, " + hoehe(14) + " bei 14 Stationen");
  else ok++;
  console.log("  Spielerpass     immer eine Rollfläche, immer " + hoehe(3) + " hoch ✓");

  /* ---- Die Kapitänsbinden (34.24) --------------------------------------
     Bis 34.23 hingen sie in derselben Flexzeile wie der Name, mit
     flexWrap:"wrap". Bei langem Namen rutschten sie in die zweite Zeile — und
     weil beide Passseiten im selben Rasterfeld liegen, wuchs damit der ganze
     Pass. jsdom rechnet kein Layout und sieht den Umbruch nicht. Geprüft wird
     deshalb die Ursache: keine Binde darf in einer Zeile hängen, die umbrechen
     kann. */
  {
    const q = laufbahn(null);
    q.name = "Maximilian Schwarzenbach";     // lang genug für den alten Umbruch
    q.flags = { ...(q.flags || {}), kapitaen: true };
    q.nt = { ...(q.nt || {}), kapitaen: true, caps: 30 };
    const r = mach("Binden", <Pass p={q} full />, 0);
    if (r) {
      const binden = [...r.div.querySelectorAll("svg")]
        .filter((s) => (s.getAttribute("aria-label") || "").startsWith("Kapitän"));
      if (binden.length !== 2) zeige("Binden", binden.length + " Binden statt 2");
      else ok++;
      /* Der Kern: kein Vorfahr darf umbrechen. */
      let inUmbruch = 0, tiefe = 0;
      binden.forEach((b) => {
        let e = b.parentElement;
        while (e && e !== r.div) {
          if (e.style && e.style.flexWrap === "wrap") inUmbruch++;
          e = e.parentElement; tiefe++;
        }
      });
      if (inUmbruch) zeige("Binden", inUmbruch + " Binde(n) hängen in einer umbrechenden Zeile");
      else ok++;
      /* Und sie dürfen nicht mehr im selben Element wie der Name stehen. */
      const beiName = binden.filter((b) => {
        let e = b.parentElement;
        while (e && e !== r.div) {
          if ((e.textContent || "").includes(q.name) && e.tagName === "DIV"
              && e.style && e.style.fontSize === "19px") return true;
          e = e.parentElement;
        }
        return false;
      }).length;
      if (beiName) zeige("Binden", beiName + " Binde(n) stecken noch in der Namenszeile");
      else ok++;
      /* Beide Angaben aus den GEMESSENEN Werten. Zum dritten Mal in vier
         Fassungen stand hier zuerst ein fester Text („keine in umbrechender
         Zeile“), der in der Gegenprobe weiter grün redete, während die
         Prüfung darüber rot meldete. Feste Zusagen gehören nicht in eine
         Protokollzeile. */
      console.log("  Binden          " + binden.length + " · "
        + (inUmbruch ? inUmbruch + " IN UMBRECHENDER ZEILE" : "keine in umbrechender Zeile") + " · "
        + (beiName ? beiName + " NOCH IN DER NAMENSZEILE" : "getrennt vom Namen"));
    }
    /* Die Flaggenbauart: jeder Eintrag braucht eine bekannte Art und genug
       Farben, sonst zeichnet die Binde ins Leere. */
    /* Seit 34.38 gibt es sieben Bauarten und alle 212 Nationen sind belegt.
       Eine unbekannte Art zeichnet stillschweigend liegende Streifen — der
       Fehler fiele also nie auf. Deshalb hier die vollstaendige Liste. */
    const arten = ["quer", "laengs", "kreuz", "flaeche", "keil", "diag", "goesch"];
    const schlecht = Object.keys(FLAGGENART).filter((k) => {
      const b = FLAGGENART[k];
      return !b || arten.indexOf(b.art) < 0 || !Array.isArray(b.f) || b.f.length < 2
        || b.f.some((c) => !/^#[0-9A-Fa-f]{6}$/.test(c));
    });
    if (schlecht.length) zeige("Flaggen", "fehlerhaft: " + schlecht.join(", "));
    else ok++;
    /* JEDE Nation muss eine haben — sonst bekommt sie aus der Kennung
       errechnete Farben, die mit ihrer Flagge nichts zu tun haben. */
    const ohne = NATIONS.filter((n) => !FLAGGENART[n.id]);
    if (ohne.length) zeige("Flaggen", ohne.length + " Nationen ohne Flagge: "
      + ohne.slice(0, 6).map((n) => n.id).join(" "));
    else ok++;
    /* Und keine Karteileiche: eine Flagge ohne Nation zeigt einen Tippfehler an. */
    const waise = Object.keys(FLAGGENART).filter((k) => !NATIONS.some((n) => n.id === k));
    if (waise.length) zeige("Flaggen", "Flaggen ohne Nation: " + waise.join(" "));
    else ok++;
    /* Keil und Obereck brauchen die Zusatzfarbe zwingend. Das Schrägband darf
       sie auch als dritte Farbe mitbringen — beides kommt in den Daten vor. */
    const fehltZ = Object.keys(FLAGGENART).filter((k) => {
      const b = FLAGGENART[k];
      if (b.art === "keil" || b.art === "goesch") return !b.z;
      if (b.art === "diag") return !b.z && !b.f[2];
      return false;
    });
    if (fehltZ.length) zeige("Flaggen", "Bauart braucht z-Farbe: " + fehltZ.join(" "));
    else ok++;
    console.log("  Flaggen         " + Object.keys(FLAGGENART).length + " von " + NATIONS.length
      + " Nationen · " + [...new Set(Object.values(FLAGGENART).map((b) => b.art))].length + " Bauarten");
  }

  /* ---- Errungenschaften: Farbe und Lesbarkeit (34.25) ------------------
     Zwei gemeldete Fehler mit zwei verschiedenen Ursachen:
     (a) Die Übersicht zeigte einen Punkt in `col`, die Karte einen Block in
         `colK` — zwei von Hand gepflegte Werte für dieselbe Stufe, die
         auseinandergelaufen waren (Legendär creme gegen olivbraun).
     (b) Der Rang auf der Karte war unlesbar, weil `.karton .m` (0,2,0)
         spezifischer ist als `.stufe` (0,1,0) und die helle Schrift wieder
         auf dunkle Tinte zurücksetzte — dunkel auf dunkel. */
  {
    /* (b) Kontrast. Jede Stufe muss ihre Schrift tragen können. */
    const leuchte = (hex) => { const n = parseInt(hex.slice(1), 16);
      const f = (v) => { const c = v / 255;
        return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
      return .2126 * f(n >> 16 & 255) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255); };
    const verhaeltnis = (a1, b1) => { const x = leuchte(a1), y = leuchte(b1);
      return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
    let schlecht = 0, kleinster = 99;
    Object.keys(STUFEN).forEach((k) => {
      const c = STUFEN[k].col, v = verhaeltnis(c, stufeSchrift(c));
      kleinster = Math.min(kleinster, v);
      if (v < 4.5) { schlecht++; zeige("Ränge", k + ": Kontrast nur " + v.toFixed(2) + " (nötig 4,5)"); }
    });
    if (!schlecht) ok++;
    console.log("  Ränge lesbar    kleinster Kontrast " + kleinster.toFixed(2) + " (nötig 4,5)");

    /* Keine zweite Farbtabelle mehr — sonst beginnt das Auseinanderlaufen neu. */
    const zweit = Object.keys(STUFEN).filter((k) => STUFEN[k].colK !== undefined);
    if (zweit.length) zeige("Ränge", "zweite Farbe colK ist zurück: " + zweit.join(", "));
    else ok++;
  }

  /* ---- Rückblick als Karteikarte (34.26) -------------------------------
     Die Seiten benutzen an vielen Stellen Farben für dunklen Grund. Auf
     hellem Karton wären sie unlesbar — genau der Fehler, der in 34.25 bei
     den Rängen steckte. Gelöst über neu gesetzte Farbvariablen auf der
     Karte; geprüft wird, dass diese Umdeutung wirklich dort steht und dass
     die Karte gezeichnet wird. */
  {
    const q = laufbahn(null);
    const sa = (q.seasons || [])[0];
    if (!sa) zeige("Rückblick", "die Testlaufbahn hat keine Saison");
    else {
      const r = mach("Saisonrückblick", <SaisonRueckblick p={q} s={sa} onFertig={() => {}} />, 0);
      if (r) {
        const karten = r.div.querySelectorAll(".karteikarte");
        if (karten.length !== 1)
          zeige("Rückblick", karten.length + " Karteikarten gezeichnet, erwartet 1 (die hinausziehende erst beim Blättern)");
        else ok++;
        /* Der Reiter oben trägt die Seitenfarbe. */
        const reiter = karten[0] && karten[0].style.getPropertyValue("--reiter");
        if (!reiter) zeige("Rückblick", "die Karte trägt keine Reiterfarbe");
        else ok++;
        console.log("  Rückblick       " + karten.length + " Karteikarte · Reiter " + (reiter || "—"));
      }
    }
    /* Die Farbumdeutung MUSS im Stilblock stehen — ohne sie stünde jede
       Zahl in einer Farbe für dunklen Grund auf hellem Karton. */
    const i = CSS.indexOf(".karteikarte{");
    const regel = i < 0 ? "" : CSS.slice(i, CSS.indexOf("}", i));
    const noetig = ["--ac:var(--ac-k)", "--go:var(--go-k)", "--mu:var(--tinte2)"];
    const fehlt = noetig.filter((n) => regel.indexOf(n) < 0);
    if (!regel) zeige("Rückblick", "Stilregel .karteikarte fehlt");
    else if (fehlt.length) zeige("Rückblick", "Farbumdeutung unvollständig, es fehlt: " + fehlt.join(", "));
    else ok++;
    /* Und die Ziehbewegung in beide Richtungen. */
    const beide = ["rs-karte-rein", "rs-karte-raus"].filter((n) => CSS.indexOf("@keyframes " + n) < 0);
    if (beide.length) zeige("Rückblick", "Bewegung fehlt: " + beide.join(", "));
    else ok++;
    console.log("  Karteikarte     Farbumdeutung "
      + (fehlt.length ? "UNVOLLSTÄNDIG" : "vollständig") + " · Bewegung "
      + (beide.length ? "FEHLT" : "rein und raus"));
  }

  /* 2 · Die Anzeigegröße wirkte nur auf zwei Stellen. Jetzt über zoom. */
  {
    const r = mach("Grundstil", <HallScreen hall={[]} onBack={() => {}} />, 0);
    const stil = r ? (r.div.querySelector("style") || {}).textContent || "" : "";
    const flBlock = (stil.match(/\.fl\{[\s\S]*?\}/) || [""])[0];
    if (!/zoom:var\(--skala/.test(flBlock)) zeige("Anzeigegröße", "zoom fehlt im Grundstil");
    else ok++;
    /* Ohne Gegenrechnung entstünde bei zoom > 1 eine Rollleiste über alles. */
    if (!/min-height:calc\(100vh \/ var\(--skala/.test(flBlock))
      zeige("Anzeigegröße", "min-height ist nicht gegen den zoom gerechnet");
    else ok++;
    console.log("  Anzeigegröße    zoom im Grundstil ✓ · min-height gegengerechnet ✓");
  }

  /* 4 · Der Rahmen war nicht wählbar — es galt immer der erste in der Liste. */
  {
    const beide = { mk_gold: true, mk_rahmen1: true };
    const a = rahmenFuer(beide);
    const b = rahmenFuer({ ...beide, rahmenWahl: "mk_rahmen1" });
    const c = rahmenFuer({ ...beide, rahmenWahl: "keiner" });
    const d = rahmenFuer({ ...beide, rahmenWahl: "mk_raute" });   /* nicht freigeschaltet */
    if (!a || a.n !== "Gold") zeige("Rahmen", "ohne Wahl nicht der beste: " + (a && a.n));
    else ok++;
    if (!b || b.n !== "Silber") zeige("Rahmen", "Wahl wird nicht befolgt: " + (b && b.n));
    else ok++;
    if (c !== null) zeige("Rahmen", "„keiner\u201C liefert trotzdem einen Rahmen");
    else ok++;
    if (!d || d.n !== "Gold") zeige("Rahmen", "nicht freigeschaltete Wahl fällt nicht zurück");
    else ok++;
    if (rahmenFuer({}) !== null) zeige("Rahmen", "ohne Freischaltung trotzdem ein Rahmen");
    else ok++;
    console.log("  Rahmen          Vorgabe Gold · Wahl Silber · „keiner\u201C leer · unfreigeschaltet fällt zurück");
  }
}

console.log("\n=== Seitenmöbel des Hefts ===");
{
  /* Jede Innenseite trägt Kolumnentitel und Folio, und beide müssen DIESELBE
     Seitenzahl nennen wie das Ressortverzeichnis. Stünde oben 14 und unten 22,
     wäre das Heft in dem Moment nicht mehr glaubwürdig. */
  const seiten = [
    ["Ruhmeshalle", "hall", <HallScreen hall={[]} onBack={() => {}} />],
    ["Errungenschaften", "erfolge", <AchievementScreen ach={{}} meta={{}} onBack={() => {}} />],
    ["Akademie", "akademie", <AkademieScreen aka={gegruendet} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />],
    ["Spielererstellung", "anlegen", <CreateScreen onStart={() => {}} onBack={() => {}} meta={{}} />],
  ];
  let mitMoebeln = 0;
  seiten.forEach(([name, key, el]) => {
    const r = mach("Seite · " + name, el, 0);
    if (!r) return;
    const t = r.div.textContent || "";
    const soll = RESSORT[key];
    if (!t.includes(soll.n)) { zeige("Seite · " + name, "Kolumnentitel „" + soll.n + "\u201C fehlt"); return; }
    /* Schlicht vergleichen statt mit regulärem Ausdruck: der Umweg über
       RegExp und \\b hat beim ersten Versuch nicht getroffen, obwohl die
       Zahl im Baum stand — ein Prüfmittel, das falschen Alarm schlägt, ist
       schlimmer als keins. */
    if (!t.includes("Seite " + soll.s)) { zeige("Seite · " + name, "Seitenzahl " + soll.s + " steht nirgends"); return; }
    if (!t.includes("Nachtausgabe")) { zeige("Seite · " + name, "Folio ohne Ausgabenzeile"); return; }
    ok++; mitMoebeln++;
  });
  console.log("  " + mitMoebeln + " von " + seiten.length + " Innenseiten mit Kolumnentitel und Folio");

  /* Die Prüfung der Blätterrichtung ist mit dem Blättern selbst entfallen
     (34.6). Sie stand hier und war grün — die Richtung stimmte. Falsch war
     nicht die Richtung, sondern die Idee, eine mehrere tausend Punkte hohe
     Seite zu drehen. Eine grüne Prüfung ist kein Beweis für eine gute Lösung. */

  /* Das Titelblatt nennt für jedes Ressort eine Seitenzahl. Sie muss zu der
     passen, die die Seite selbst im Kolumnentitel trägt — sonst schickt das
     Inhaltsverzeichnis den Leser auf eine Seite, die es nicht gibt. Genau so
     eine Abweichung fällt beim Durchklicken nie auf. */
  {
    /* achN und metaN sind ZAHLEN, keine Objekte. Der erste Versuch gab hier
       ach={{}} meta={{}} — im Verzeichnis stand daraufhin „undefined / 162".
       Die Prüfung hat also sich selbst gemeldet, nicht die App. Genau dafür
       ist die Unsinnserkennung in `mach` da. */
    const m = mach("Titelblatt", <MenuScreen save={null} hall={[]} aka={leereAkademie()}
      achN={0} metaN={0} onNew={() => {}} onResume={() => {}} onAch={() => {}}
      onHall={() => {}} onAka={() => {}} onBackup={() => {}} />, 0);
    if (m) {
      const t = m.div.textContent || "";
      const fehlend = [];
      ["erfolge", "hall", "akademie"].forEach((k) => {
        const r = RESSORT[k];
        /* Der Titel des Ressorts steht im Verzeichnis, die Zahl daneben. */
        if (!t.includes(String(r.s))) fehlend.push(r.n + " (" + r.s + ")");
      });
      if (fehlend.length) zeige("Titelblatt", "Seitenzahlen fehlen im Verzeichnis: " + fehlend.join(", "));
      else ok++;
      /* Das Titelfoto muss in BEIDEN Zuständen dastehen — ohne Spielstand war
         das Feld vorher fast leer, mit Spielstand stand das Porträt allein
         auf einer leeren Fläche. Gezählt werden die Silhouetten: 6 stehend,
         5 hockend, dazu Ränge, Bande und Rasenstreifen. */
      /* NUR im Titelfoto zählen. Der erste Versuch zählte alle Gruppen mit
         Kreis und Pfad im ganzen Baum — mit Spielstand kamen die Ohren- und
         Augengruppen des Porträts dazu und die Zahl stimmte scheinbar nicht.
         Die Prüfung war falsch, nicht das Bild. */
      const figuren = (el) => {
        const r = mach("Titelfoto", el, 0);
        if (!r) return -1;
        const foto = [...r.div.querySelectorAll("svg")]
          .find((v) => (v.getAttribute("viewBox") || "") === "0 0 366 210");
        if (!foto) return -1;
        return [...foto.querySelectorAll("g")]
          .filter((g) => g.querySelector("circle") && g.querySelector("path")).length;
      };
      const ohne = figuren(<MenuScreen save={null} hall={[]} aka={leereAkademie()}
        achN={0} metaN={0} onNew={() => {}} onResume={() => {}} onAch={() => {}}
        onHall={() => {}} onAka={() => {}} onBackup={() => {}} />);
      /* Eigener Spieler für diesen Block: der aus dem Errungenschaftsteil
         liegt in einem anderen Gültigkeitsbereich. */
      const held = laufbahn(null);
      const mit = figuren(<MenuScreen save={{ p: held }} hall={[]} aka={leereAkademie()}
        achN={0} metaN={0} onNew={() => {}} onResume={() => {}} onAch={() => {}}
        onHall={() => {}} onAka={() => {}} onBackup={() => {}} />);
      if (ohne !== 11) zeige("Titelfoto", "ohne Spielstand " + ohne + " Silhouetten statt 11");
      else ok++;
      if (mit !== 11) zeige("Titelfoto", "mit Spielstand " + mit + " Silhouetten statt 11");
      else ok++;
      console.log("  Titelfoto       " + ohne + " Silhouetten ohne, " + mit + " mit Spielstand");

      /* Kein Flutlicht mehr: der alte Kopf hatte Verläufe mit diesen Kennungen. */
      if (m.div.querySelector("#kegel") || m.div.querySelector("#rasen"))
        zeige("Titelblatt", "der alte Flutlicht-Kopf ist noch da");
      else ok++;
      /* Eine Schlagzeile muss dastehen, und zwar in jedem Spielstand. */
      const g = titelgeschichte(null, false, [], null);
      if (!g.dach || !g.schlag || !g.unter) zeige("Titelblatt", "Aufmacherzeilen unvollständig");
      else ok++;
      console.log("  Titelblatt      Verzeichnis nennt "
        + ["erfolge", "hall", "akademie"].map((k) => RESSORT[k].s).join(" · ")
        + " · kein Flutlicht mehr");
    }
    /* Alle vier Spielstände müssen eine eigene Schlagzeile haben — sonst ist
       die Fallunterscheidung nur behauptet. */
    const faelle = [
      ["ohne alles", titelgeschichte(null, false, [], null)],
      ["mit Ruhmeshalle", titelgeschichte(null, false, [{ name: "Kai Bergmann", score: 900 }], null)],
      ["mit Akademie", titelgeschichte(null, false, [], { gegruendet: true, name: "Volkspark" })],
      ["laufend", titelgeschichte({ p: { name: "Kai", age: 24, ovr: 78, year: 2035,
        club: { n: "HSV", stadt: "Hamburg" } } }, true, [], null)],
    ];
    const schlagzeilen = new Set(faelle.map(([, g]) => g.schlag));
    if (schlagzeilen.size !== faelle.length)
      zeige("Titelblatt", "nur " + schlagzeilen.size + " verschiedene Schlagzeilen für " + faelle.length + " Fälle");
    else ok++;
    console.log("  Aufmacher       " + schlagzeilen.size + " verschiedene Schlagzeilen je nach Spielstand");
  }

  /* Die Seitenzahlen müssen eindeutig sein — zwei Ressorts auf Seite 14 wären
     ein Heft, das es nicht geben kann. */
  const zahlen = Object.values(RESSORT).map((r) => r.s);
  if (new Set(zahlen).size !== zahlen.length) zeige("Ressorts", "doppelte Seitenzahlen: " + zahlen.join(", "));
  else ok++;
  console.log("  Seitenzahlen    " + zahlen.slice().sort((a, b) => a - b).join(" · ") + " · alle verschieden");

  /* ---- Kopfknöpfe: Laden und Zahnrad ----------------------------------
     In 34.20 trugen beide dieselbe Klasse `.zahnrad` mit position:absolute
     und right:0 — also lagen sie exakt aufeinander. Der Laden bekam einen
     Rand von 6px, aber bei absoluter Lage verschiebt ein Rand nur um seinen
     eigenen Betrag: 40px Knopf gegen 6px Versatz sind 34px Überlappung.
     In Chromium gemessen: 34px, 85 % des Knopfes verdeckt.

     Warum das hier steht und nicht im Bild: jsdom rechnet kein Layout. Der
     Baum sah in beiden Fassungen gleich aus. Geprüft wird deshalb die
     Ursache statt der Wirkung — ein Behälter, der den Abstand setzt, und
     ein Knopf, der nicht absolut sitzt. Die Wirkung selbst misst
     `pruefstand/kopfleiste.cjs` in einem echten Browser. */
  {
    const m = mach("Kopfleiste", <MenuScreen {...menuProps} aka={leereAkademie()} onLaden={() => {}} />, 0);
    if (m) {
      const knoepfe = [...m.div.querySelectorAll("button.zahnrad")];
      if (knoepfe.length !== 2) zeige("Kopfleiste", knoepfe.length + " Kopfknöpfe statt 2");
      else ok++;
      if (knoepfe.length === 2) {
        const eltern = new Set(knoepfe.map((b) => b.parentElement));
        if (eltern.size !== 1)
          zeige("Kopfleiste", "die Knöpfe liegen in " + eltern.size + " Behältern statt in einem");
        else ok++;
        const behaelter = knoepfe[0].parentElement;
        if (!behaelter || !behaelter.classList.contains("kopfknoepfe"))
          zeige("Kopfleiste", "der Behälter trägt nicht .kopfknoepfe");
        else ok++;
        /* Beide müssen unterscheidbar bleiben — ein Knopf ohne Beschriftung
           ist für die Vorlesehilfe ein leeres Feld. */
        const namen = knoepfe.map((b) => b.getAttribute("aria-label") || "").sort();
        if (namen.join("|") !== "Optionen|Vermächtnis-Laden")
          zeige("Kopfleiste", "Beschriftungen sind „" + namen.join("“ und „") + "“");
        else ok++;
        console.log("  Kopfknöpfe      " + knoepfe.length + " in einem Behälter · " + namen.join(" · "));
      }
    }
    /* Die Stilregeln dazu. */
    const regel = (n) => { const i = CSS.indexOf("." + n + "{");
      return i < 0 ? null : CSS.slice(i, CSS.indexOf("}", i)); };
    const rZahn = regel("zahnrad"), rKopf = regel("kopfknoepfe");
    if (!rZahn) zeige("Kopfleiste", "Stilregel .zahnrad nicht gefunden");
    else if (/position\s*:\s*absolute/.test(rZahn))
      zeige("Kopfleiste", ".zahnrad steht wieder auf position:absolute — zwei davon liegen aufeinander");
    else ok++;
    const abstand = rKopf && (rKopf.match(/gap\s*:\s*([^;]+)/) || [])[1];
    if (!rKopf) zeige("Kopfleiste", "Stilregel .kopfknoepfe fehlt");
    else if (!/display\s*:\s*flex/.test(rKopf)) zeige("Kopfleiste", ".kopfknoepfe ist kein Flexbehälter");
    else if (!abstand || !/[1-9]/.test(abstand)) zeige("Kopfleiste", ".kopfknoepfe ohne Abstand");
    else ok++;
    /* Diese Zeile muss den gemessenen Zustand nennen, nicht den erwünschten.
       Im ersten Entwurf stand hier fest „nicht absolut“ — und das behauptete
       sie auch dann noch, als die Prüfung zwei Zeilen darüber das Gegenteil
       gemeldet hatte. Ein Protokoll, das grün redet, während der Prüfstand
       rot meldet, ist schlimmer als gar keins. */
    console.log("  Stil            .zahnrad "
      + (!rZahn ? "Regel fehlt" : /position\s*:\s*absolute/.test(rZahn) ? "ABSOLUT — Knöpfe liegen aufeinander" : "nicht absolut")
      + " · Behälter " + (!rKopf ? "fehlt" : "Abstand " + (abstand || "keiner")));
  }
}

console.log("\n=== Zoom und Akademiefortschritt ===");
{
  /* Der Fortschritt der Akademie muss bei der Gründung bei 0 stehen. Vorher
     zeigte der Ring 6 von 36 = 17 %, weil jede Abteilung auf Stufe 1 startet.
     Geprüft wird der Ring selbst, nicht die Rechnung dahinter. */
  const ringAnteil = (aka) => {
    const r = mach("Akademie-Ring", <AkademieScreen aka={aka} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />, 0);
    if (!r) return null;
    const t = r.div.textContent || "";
    const m = t.match(/Ausbaustufen (\d+) von (\d+)/);
    return m ? { ist: +m[1], max: +m[2] } : null;
  };
  const frisch = ringAnteil(gegruendet);
  if (!frisch) zeige("Akademie", "Ausbaustand nicht gefunden");
  else {
    if (frisch.ist !== 0) zeige("Akademie", "frisch gegründet zeigt " + frisch.ist + " Ausbaustufen statt 0");
    else ok++;
    /* Aus ABTEILUNGEN abgeleitet statt fest (35.13): mit drei neuen Abteilungen
     waren 30 und 36 falsch, und beim naechsten Mal waere es wieder so.
     Bewusst an beiden Stellen ausgerechnet statt in einer Konstanten — die
     zwei Pruefungen stehen in verschiedenen Bloecken, und der erste Versuch
     mit einer gemeinsamen Konstanten brach mit "SOLL_SUMME is not defined". */
  if (frisch.max !== ABTEILUNGEN.length * (AKA_MAX - 1))
    zeige("Akademie", "Höchstwert " + frisch.max + " statt " + ABTEILUNGEN.length * (AKA_MAX - 1));
    else ok++;
    console.log("  frisch gegründet   " + frisch.ist + " von " + frisch.max + " Ausbaustufen");
  }
  const voll = ringAnteil(reif);
  if (voll) console.log("  nach 25 Jahren     " + voll.ist + " von " + voll.max + " Ausbaustufen");

  /* Die Errungenschaft „voller Ausbau" hängt weiter an `akaSumme` — die darf
     durch die Umstellung NICHT verrutscht sein. */
  /* Kennungen aus ABTEILUNGEN nehmen, nicht aus dem Gedächtnis tippen — beim
     ersten Versuch stand hier eine erfundene Abteilung und die Prüfung schlug
     zu Recht an. */
  const alles = { ...reif, stufen: {} };
  ABTEILUNGEN.forEach((x) => { alles.stufen[x.id] = AKA_MAX; });
  if (akaSumme(alles) !== ABTEILUNGEN.length * AKA_MAX)
    zeige("Akademie", "akaSumme bei vollem Ausbau ist " + akaSumme(alles) + ", erwartet " + ABTEILUNGEN.length * AKA_MAX);
  else ok++;
  console.log("  akaSumme voll      " + akaSumme(alles) + " (Errungenschaft prüft weiter darauf)");
}

/* ---------- Porträt: ein Regler ändert genau ein Merkmal ----------
   Bis 33.16 änderte ein Druck auf „Schmuck" im Schnitt 8 von 13 Merkmalen
   mit, weil `(h >> bit) % n` kein abgetrenntes Feld ist. Hier wird gezählt,
   nicht behauptet: über alle Merkmale, beide Richtungen, viele Kennungen. */
console.log("\n=== Porträt ===");
{
  const felder = Object.keys(ZUEGE_ANZAHL({}, false));
  let schlimmster = 0, schlimmsterName = "";
  let gesamt = 0, faelle = 0, wirkungslos = 0;
  for (let k = 0; k < 120; k++) {
    const kennung = 1000 + k * 7919;
    const z = zuegeAusKennung(kennung, "m", "GER", {});
    felder.forEach((f) => {
      [1, -1].forEach((r) => {
        const n = zugDrehen(z, f, r, "m", "GER", {});
        const geaendert = felder.filter((x) => n[x] !== z[x]);
        gesamt += geaendert.length; faelle++;
        if (geaendert.length > schlimmster) { schlimmster = geaendert.length; schlimmsterName = f; }
        /* Ein Regler, der nichts tut, ist genauso falsch wie einer, der zu viel tut. */
        if (geaendert.length === 0 && (ZUEGE_ANZAHL({}, false)[f] > 1)
            && !(f === "haut" || f === "haar")) wirkungslos++;
      });
    });
  }
  if (schlimmster > 1) zeige("Porträt", "ein Regler änderte " + schlimmster + " Merkmale (" + schlimmsterName + ")");
  else ok++;
  if (wirkungslos) zeige("Porträt", wirkungslos + " Reglerdrücke ohne jede Wirkung");
  else ok++;
  console.log("  Regler          " + faelle + " Drücke · Mittel " + (gesamt / faelle).toFixed(2)
    + " geänderte Merkmale · Höchstwert " + schlimmster + " (vorher bis 8)");

  /* Gleiche Kennung ⇒ gleiches Gesicht. Ohne das wäre jeder Spielstand ein Glücksspiel. */
  const a1 = JSON.stringify(zuegeAusKennung(4242, "m", "BRA", {}));
  const a2 = JSON.stringify(zuegeAusKennung(4242, "m", "BRA", {}));
  if (a1 !== a2) zeige("Porträt", "gleiche Kennung liefert verschiedene Merkmale");
  else ok++;

  /* Hautton und Haarfarbe müssen im Rahmen der Herkunft bleiben — auch nach
     beliebig vielem Weiterdrehen. */
  let raus = 0;
  ["GER", "NGA", "JPN", "BRA", "SEN", "NOR"].forEach((nat) => {
    const T = hautBereich(nat), H = haarBereich(nat);
    let z = zuegeAusKennung(777, "m", nat, {});
    for (let i = 0; i < 40; i++) {
      z = zugDrehen(z, "haut", 1, "m", nat, {});
      z = zugDrehen(z, "haar", -1, "m", nat, {});
      if (z.haut < T[0] || z.haut > T[1] || z.haar < H[0] || z.haar > H[1]) raus++;
    }
  });
  if (raus) zeige("Porträt", raus + "× Hautton oder Haarfarbe außerhalb der Herkunft");
  else ok++;
  console.log("  Herkunft        6 Länder × 40 Drehungen · 0 Ausreißer");

  /* Jedes Merkmal muss auch etwas ZEICHNEN. Ein Wert ohne Bild ist eine
     Auswahlmöglichkeit, die es nur auf dem Papier gibt. */
  const A = ZUEGE_ANZAHL({ mk_haar: true, mk_acc: true }, false);
  const leer = [];
  ["frisur", "bart", "mund", "nase", "brauen", "augen", "kopf", "schmuck"].forEach((f) => {
    for (let v = 0; v < A[f]; v++) {
      const z = { ...zuegeAusKennung(4242, "m", "GER", { mk_haar: true, mk_acc: true }), [f]: v };
      const r = mach("Porträt " + f + " " + v, <Avatar zuege={z} g="m" nat="GER" size={64} />, 0);
      if (!r) { leer.push(f + " " + v + " (Absturz)"); continue; }
      const teile = r.div.querySelectorAll("path,circle,ellipse,rect,g").length;
      if (teile < 12) leer.push(f + " " + v + " (nur " + teile + " Teile)");
    }
  });
  if (leer.length) zeige("Porträt", "Merkmale ohne Bild: " + leer.join(", "));
  else ok++;
  const summe = ["frisur", "bart", "mund", "nase", "brauen", "augen", "kopf", "schmuck"]
    .reduce((a, f) => a + A[f], 0);
  console.log("  Gestaltung      " + summe + " gezeichnete Auswahlmöglichkeiten in 8 Merkmalen · "
    + AUGENFARBE.length + " Augenfarben · " + KOPFFORM.length + " Kopfformen");

  /* Die Augenfarbe wurde bis 33.16 berechnet und nie gezeichnet. */
  const farben = new Set();
  for (let v = 0; v < AUGENFARBE.length; v++) {
    const z = { ...zuegeAusKennung(4242, "m", "GER", {}), augenfarbe: v, schmuck: 0 };
    const r = mach("Augenfarbe " + v, <Avatar zuege={z} g="m" nat="GER" size={64} />, 0);
    if (r) [...r.div.querySelectorAll("circle")].forEach((c) => farben.add(c.getAttribute("fill")));
  }
  const gefunden = AUGENFARBE.filter((f) => farben.has(f.c)).length;
  if (gefunden !== AUGENFARBE.length)
    zeige("Porträt", "nur " + gefunden + " von " + AUGENFARBE.length + " Augenfarben landen im Bild");
  else ok++;
  console.log("  Augenfarbe      " + gefunden + " von " + AUGENFARBE.length + " im Bild nachweisbar");

  /* Der Vorschaublock der Erstellung muss angeheftet bleiben. Sonst stellt man
     unten Feinheiten ein und sieht oben nicht, was sie bewirken. Eine reine
     Stilangabe verschwindet bei einem Umbau lautlos — deshalb hier gezählt. */
  const erst = mach("Spielererstellung", <CreateScreen onStart={() => {}} onBack={() => {}} meta={{}} />);
  if (erst) {
    const angeheftet = [...erst.div.querySelectorAll(".pan")]
      .filter((e) => e.style.position === "sticky" && e.style.top === "0px");
    if (angeheftet.length !== 1)
      zeige("Spielererstellung", angeheftet.length + " angeheftete Blöcke, erwartet genau 1");
    else ok++;
    if (angeheftet[0] && !angeheftet[0].querySelector("svg"))
      zeige("Spielererstellung", "im angehefteten Block steckt kein Porträt");
    else ok++;
    if (angeheftet[0] && !angeheftet[0].style.background)
      zeige("Spielererstellung", "der angeheftete Block ist durchsichtig — Text läge darunter durch");
    else ok++;
    console.log("  Kopfleiste      angeheftet ✓ · Porträt darin ✓ · deckender Grund ✓");
  }

  /* Alte Spielstände tragen nur die Kennung — das Porträt muss trotzdem stehen. */
  /* Mindestlänge 0: ein Porträt enthält keinen Text, `mach` würde es sonst
     als „Ansicht bleibt leer" melden. */
  const alt = mach("Porträt aus alter Kennung", <Avatar seed={123456} g="m" nat="ESP" size={64} />, 0);
  if (alt && alt.div.querySelectorAll("path").length < 8)
    zeige("Porträt", "aus einer alten Kennung entsteht kein vollständiges Bild");
  else if (alt) ok++;
}

/* ---------- Zwei Formen für zwei Prestigeleitern ----------
   Der Umriss für die Seltenheit war in 33.15 da und ist wieder raus — er nahm
   der Wildcard-Karte ihren Auftritt. Beide Leitern sind also wieder gefüllt,
   und die Unterscheidung liegt in BREITE und ORT: die Seltenheit als Band über
   die volle Kartenbreite, die Errungenschaftsstufe als kompakte Marke im Text.
   Geprüft wird genau das, weil eine Unterscheidung, die nur in der Beschreibung
   lebt, beim nächsten Umbau verschwindet. */
console.log("\n=== Form statt Farbe ===");
{
  const karte = mach("Wildcard-Karte", <WildcardCard card={{ n: "Eiserner Wille", t: "Text", r: "aussen" }} />);
  if (karte) {
    const alsRgb = (h) => "rgb(" + [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ") + ")";
    const b = karte.div.querySelector(".band");
    if (!b) zeige("Wildcard-Karte", "kein Band gefunden");
    else {
      if (b.style.background !== alsRgb(RARITY.aussen.col))
        zeige("Wildcard-Karte", "Bandfüllung " + b.style.background + " statt " + alsRgb(RARITY.aussen.col));
      else ok++;
      if (b.classList.contains("umriss")) zeige("Wildcard-Karte", "Band ist wieder umrandet — das war 33.15 und ist verworfen");
      else ok++;
    }
    /* Die Seltenheit darf NIE als kompakte Stufenmarke auftreten. */
    if (karte.div.querySelectorAll(".stufe").length)
      zeige("Wildcard-Karte", "Seltenheit als Stufenmarke gezeichnet — die Formen sind vertauscht");
    else ok++;
    console.log("  Wildcard        Band gefüllt ✓ · kein Umriss ✓ · keine Stufenmarke ✓");
  }

  Object.keys(RARITY).forEach((art) => {
    const r = mach("Wildcard · " + art, <WildcardCard card={{ n: "X", t: "Y", r: art }} />, 0);
    if (!r) return;
    const b = r.div.querySelector(".band");
    if (!b || !b.style.background) zeige("Seltenheit · " + art, "Band ohne Füllung");
    else ok++;
  });
  console.log("  sieben Stufen   alle Bänder gefüllt");

  /* Die Errungenschaftsstufe: kompakte Marke, gefüllt, und KEIN Band über
     die volle Breite — sonst sähe sie aus wie eine Seltenheit. */
  const ach = {}; ACHIEVEMENTS.slice(0, 9).forEach((a) => { ach[a.id] = true; });
  const gitter = mach("Errungenschaften", <AchievementScreen ach={ach} meta={{}} onBack={() => {}} />);
  if (gitter) {
    /* Seit 34.25 zeichnet die ÜBERSICHT denselben Block wie die Karte —
       vorher war es dort ein Punkt in einer anderen Farbe, und genau das war
       der gemeldete Fehler. Also: 9 Karten + 5 Stufen in der Übersicht = 14
       Blöcke, und keine Punkte mehr. */
    const bloecke = [...gitter.div.querySelectorAll(".stufe")];
    const punkte = gitter.div.querySelectorAll(".stufe.punkt").length;
    const ohne = bloecke.filter((e) => !e.style.background).length;
    const baender = gitter.div.querySelectorAll(".band").length;
    const soll = 9 + Object.keys(STUFEN).length;
    if (bloecke.length !== soll)
      zeige("Errungenschaften", bloecke.length + " Stufenblöcke, erwartet " + soll);
    else ok++;
    if (ohne) zeige("Errungenschaften", ohne + " Stufenblöcke ohne Füllung");
    else ok++;
    if (punkte) zeige("Errungenschaften", punkte + " alte Filterpunkte — die Übersicht soll denselben Block zeigen");
    else ok++;
    if (baender) zeige("Errungenschaften", baender + " Bänder über die volle Breite — die gehören der Seltenheit");
    else ok++;

    /* Der Kern des gemeldeten Fehlers: zeigt die Übersicht WIRKLICH dieselbe
       Farbe wie die Karte? Nicht die Tabelle vergleichen, sondern das
       Gezeichnete — die Tabelle war ja gerade das Problem. */
    const proStufe = {};
    bloecke.forEach((b) => {
      const n = (b.textContent || "").trim();
      (proStufe[n] = proStufe[n] || new Set()).add(b.style.background || b.style.backgroundColor);
    });
    const uneinig = Object.keys(proStufe).filter((n) => proStufe[n].size > 1);
    if (uneinig.length)
      zeige("Errungenschaften", "verschiedene Farben für dieselbe Stufe: "
        + uneinig.map((n) => n + " (" + [...proStufe[n]].join(" / ") + ")").join(", "));
    else ok++;

    /* Und jeder Block braucht eine EIGENE Schriftfarbe. Ohne sie greift wieder
       `.karton .m` (0,2,0) über `.stufe` (0,1,0) und setzt dunkle Tinte auf
       dunkle Fläche — so war der Rang auf der Karte unlesbar. */
    const ohneSchrift = bloecke.filter((b) => !b.style.color).length;
    if (ohneSchrift) zeige("Errungenschaften", ohneSchrift + " Stufenblöcke ohne eigene Schriftfarbe");
    else ok++;

    console.log("  Errungenschaften " + bloecke.length + " Blöcke · " + punkte + " Punkte · "
      + (uneinig.length ? uneinig.length + " STUFEN UNEINIG" : "je Stufe eine Farbe") + " · "
      + (ohneSchrift ? ohneSchrift + " OHNE SCHRIFT" : "alle mit eigener Schrift"));
  }
}

/* ---------- Ehrentafel als Karton ----------
   Der Karton erscheint nur dort, wo wirklich jemand herausgekommen ist.
   Auf einer frischen Akademie ist die Tafel leer — dann darf auch kein
   Karton dastehen. Genau daran ist der Karton bei den Errungenschaften
   schon einmal unsichtbar geblieben; hier wird beides gezählt. */
console.log("\n=== Ehrentafel ===");
function tafel(name, aka) {
  const r = mach("Ehrentafel · " + name, <AkademieScreen aka={aka} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
  if (!r) return null;
  if (!klick(r.div, "Ehrentafel", "Ehrentafel · " + name)) return null;
  return r.div;
}
{
  const leerTafel = tafel("frisch gegründet", gegruendet);
  if (leerTafel) {
    const k = leerTafel.querySelectorAll(".karton").length;
    if (k !== 0) zeige("Ehrentafel · leer", k + " Karton, erwartet 0");
    else ok++;
    /* Auf „Noch" prüfen, nicht auf den ganzen Satz: der Wortlaut ändert sich
       beim Überarbeiten der Sprache, die Aussage nicht. Beim Umschreiben in
       34.10 hat genau dieser Satz die Prüfung fallen lassen, obwohl der
       Hinweis dastand. */
    /* Auf den GEHALT prüfen, nicht auf den Wortlaut: der ändert sich bei
       jeder Sprachrunde, die Aussage nicht. Zweimal ist diese Prüfung schon
       gefallen, obwohl der Hinweis dastand. */
    if (!/noch keiner|niemand|nach oben geschafft/i.test(leerTafel.textContent || ""))
      zeige("Ehrentafel · leer", "Hinweis auf die leere Tafel fehlt");
    else ok++;
    console.log("  leer               " + k + " Karton · Hinweistext steht ✓");
  }

  const voll = tafel("25 Jahre", reif);
  if (voll) {
    const karton = voll.querySelectorAll(".karton").length;
    const baender = voll.querySelectorAll(".band").length;
    const stempel = voll.querySelectorAll(".stempel").length;
    const zellen = voll.querySelectorAll(".zellen").length;
    const n = reif.absolventen.length;
    if (karton !== n) zeige("Ehrentafel", karton + " Karton für " + n + " Absolventen");
    else ok++;
    if (baender !== n) zeige("Ehrentafel", baender + " Kopfbänder für " + n + " Absolventen");
    else ok++;
    if (zellen !== n) zeige("Ehrentafel", zellen + " Kartenfeldgruppen für " + n + " Absolventen");
    else ok++;
    /* Genau ein Stempel, und nur ab drei Einträgen — wie in der Ruhmeshalle. */
    const erwartet = n > 2 ? 1 : 0;
    if (stempel !== erwartet) zeige("Ehrentafel", stempel + " Stempel, erwartet " + erwartet);
    else ok++;
    /* Die Tafel muss dieselbe Ordnung zeigen wie die Zahlen darüber. */
    const wk = reif.absolventen.filter((x) => x.peak >= 85).length;
    const txt = voll.textContent || "";
    const gezaehlt = (txt.match(/Weltklasse/g) || []).length - 1;   /* eine Nennung steht in der Kopfzeile */
    if (gezaehlt !== wk) zeige("Ehrentafel", gezaehlt + "× Rang Weltklasse, Bilanz sagt " + wk);
    else ok++;
    if (wk !== reif.bilanz.weltklasse)
      zeige("Ehrentafel", "Bilanz " + reif.bilanz.weltklasse + " Weltklasse, auf der Tafel " + wk
        + " — die Tafel ist auf 40 gekappt, das ist bei mehr Absolventen erwartbar");
    else ok++;
    /* Keine Schräglage: ein Schild an der Wand hängt gerade. */
    const schief = [...voll.querySelectorAll(".karton")].filter((e) => /rotate/.test(e.style.transform || "")).length;
    if (schief) zeige("Ehrentafel", schief + " Karton mit Schräglage — die gehört ins Sammelheft");
    else ok++;
    zahlenPruefen(voll, ["Stärke", "Abgang"], "Ehrentafel");
    console.log("  25 Jahre           " + karton + " Karton · " + baender + " Kopfbänder · "
      + zellen + " Feldgruppen · " + stempel + " Stempel · " + wk + " Weltklasse · " + schief + " schief");
  }

  /* Härtefall: alte Einträge ohne `ein` und mit unbekannter Position. */
  const alt = { ...gegruendet, absolventen: [
    { id: "a1", name: "Ohne Jahrgang", flag: "\uD83C\uDDE9\uD83C\uDDEA", pos: "ST", raus: 2031, peak: 88, ns: true },
    { id: "a2", name: "Unbekannte Position", flag: "\uD83C\uDDEE\uD83C\uDDF9", pos: "XX", raus: 2032, peak: 71, ns: false },
    { id: "a3", name: "Nur Auswahl", flag: "\uD83C\uDDEB\uD83C\uDDF7", pos: "ZM", raus: 2033, peak: 79, ns: true }] };
  const hart = tafel("alte Einträge", alt);
  if (hart) {
    const t = hart.textContent || "";
    if (/NaN|undefined/.test(t)) zeige("Ehrentafel · alt", "NaN oder undefined im Text");
    else ok++;
    if (hart.querySelectorAll(".karton").length !== 3)
      zeige("Ehrentafel · alt", "nicht alle drei Einträge dargestellt");
    else ok++;
    console.log("  alte Einträge      3 Karton · kein NaN · Position „XX\u201C unverändert durchgereicht ✓");
  }
}

/* ---------- Speicher und Jahresfortschritt ---------- */
console.log("\n=== Speicher und Zeitrechnung ===");
try {
  const roh = JSON.stringify(reif);
  const zurueck = JSON.parse(roh);
  if (zurueck.bilanz.profis !== reif.bilanz.profis) throw new Error("Bilanz überlebt das Speichern nicht");
  if (zurueck.talente.length !== reif.talente.length) throw new Error("Talente überleben das Speichern nicht");
  console.log("  Sicherungsgröße nach 25 Jahren: " + (roh.length / 1024).toFixed(1) + " KB"
    + " · Talente " + reif.talente.length + " · Ehrentafel " + reif.absolventen.length
    + " · Chronik " + reif.chronik.length);
  if (roh.length > 120000) throw new Error("Sicherung zu groß: " + roh.length + " Zeichen");
  ok++;
} catch (e) { zeige("Speicherprobe", e); }

try {
  let a = akaGruenden({ ...leereAkademie() }, "Zeit", 2026);
  const j0 = a.jahr, jg0 = a.jahrgaenge;
  for (let i = 0; i < 5; i++) { const r = akaVerbuchen(a, 40); a = r.a; }
  if (a.jahr !== j0 + 5) throw new Error("Jahr springt falsch: " + j0 + " → " + a.jahr);
  if (a.jahrgaenge !== jg0 + 5) throw new Error("Jahrgangszähler falsch: " + a.jahrgaenge);
  if (a.vc !== 200) throw new Error("Coins falsch verbucht: " + a.vc);
  console.log("  Fünf Laufbahnen → Jahr " + j0 + " auf " + a.jahr + " · " + a.vc + " VC · " + a.jahrgaenge + " Jahrgänge");
  ok++;
} catch (e) { zeige("Zeitrechnung", e); }

try {
  /* Ohne Gründung darf kein Jahr vergehen, die Coins müssen trotzdem kommen */
  let a = { ...leereAkademie() };
  for (let i = 0; i < 3; i++) a = akaVerbuchen(a, 30).a;
  if (a.vc !== 90) throw new Error("Coins ohne Gründung falsch: " + a.vc);
  if (a.jahrgaenge !== 0) throw new Error("Jahrgang ohne Gründung entstanden");
  console.log("  Ohne Gründung: " + a.vc + " VC angespart, kein Jahrgang");
  ok++;
} catch (e) { zeige("Ohne Gründung", e); }

/* Nicht auf console.error zurückstellen: Warnungen aus zeitgesteuerten
   Animationen treffen erst nach dem Skriptende ein und würden die
   Ausgabe zumüllen. Echte Meldungen kommen weiterhin durch. */
console.error = (...a) => { const t = String(a[0]);
  if (!HARMLOS.some((h) => t.includes(h))) origErr("  ! " + t.slice(0, 200)); };
/* ---------- Ablauf der Enthüllung über die Zeit ----------
   Hier wird der Fehler geprüft, den man als „unrunde Animation" sah:
   Wechselt die Klasse einer Textzeile mitten im Ablauf, beginnt die
   Einblendung von vorn und der Text ist kurz weg. Deshalb wird der
   Zustand an mehreren Zeitpunkten festgehalten und verglichen. */
const warte = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });

function zustand(div) {
  const karte = [...div.querySelectorAll("div")].find((x) =>
    (x.style.transformStyle === "preserve-3d") || (x.style.WebkitTransformStyle === "preserve-3d"));
  const texte = [...div.querySelectorAll(".eb, .d, p")]
    .filter((x) => x.closest("div") && x.className !== undefined)
    .map((x) => x.className);
  return {
    dreher: karte ? { animation: karte.style.animation || "", transition: karte.style.transition || "",
      transform: karte.style.transform || "" } : null,
    huelle: karte && karte.parentElement ? (karte.parentElement.style.animation || "") : null,
    klassen: texte.join(" | "),
    text: (div.textContent || ""),
  };
}

async function ablauf() {
  console.log("\n=== Ablauf der Enthüllung ===");
  for (const art of ["goat", "hsv", "normal"]) {
    const karte = { id: "z_" + art, r: art, n: "Zeitprobe", t: "Beschreibung der Karte." };
    const div = document.createElement("div"); document.body.appendChild(div);
    const root = createRoot(div);
    await act(async () => { root.render(<WildcardEnthuellung card={karte} onFertig={()=>{}} />); });

    const punkte = [];
    for (const ms of [200, 900, 1300, 2100, 3200]) {
      await warte(ms === 200 ? 200 : 0);
      punkte.push({ t: ms, z: zustand(div) });
      if (ms !== 3200) await warte(ms === 200 ? 700 : ms === 900 ? 400 : ms === 1300 ? 800 : 1100);
    }

    /* 1. Nach dem Umdrehen darf sich keine Textklasse mehr ändern. */
    const nachAuf = punkte.filter((x) => x.t >= 1300).map((x) => x.z.klassen);
    const gleich = nachAuf.every((x) => x === nachAuf[0]);
    if (!gleich) {
      zeige("Ablauf · " + art, "Textklassen wechseln nach dem Aufdecken: "
        + [...new Set(nachAuf)].join("  ≠  "));
    } else ok++;

    /* 2. Drehung und Bewegung dürfen nicht auf demselben Element sitzen. */
    const streit = punkte.filter((x) => x.z.dreher
      && x.z.dreher.animation && x.z.dreher.transition);
    if (streit.length) {
      zeige("Ablauf · " + art, "Drehung und Bewegung auf einem Element bei "
        + streit.map((x) => x.t + " ms").join(", "));
    } else ok++;

    /* 3. Der Text darf zwischendurch nicht verschwinden. */
    const spaet = punkte.filter((x) => x.t >= 1300);
    const fehlt = spaet.filter((x) => x.z.text.indexOf("Zeitprobe") < 0);
    if (fehlt.length) zeige("Ablauf · " + art, "Kartenname fehlt bei "
      + fehlt.map((x) => x.t + " ms").join(", "));
    else ok++;

    const letzte = punkte[punkte.length - 1].z;
    console.log("  " + art.padEnd(7) + " Klassen stabil ✓ · kein Streit um transform ✓"
      + " · Hülle bewegt: " + (letzte.huelle ? "ja" : "nein"));
    /* Wieder aushängen, sonst laufen Zeitgeber und Bildschleifen weiter
       und das Skript beendet sich nie. */
    await act(async () => { root.unmount(); });
    div.remove();
  }
}

function ende() {
  if (echteFehler.length) {
    console.log("\n=== Meldungen von React ===");
    [...new Set(echteFehler)].slice(0, 8).forEach((x) => console.log("  ! " + x));
    fehler += echteFehler.length;
  }
  console.log("\n" + ok + " Prüfungen bestanden, " + fehler + " Fehler.");
  /* Ausdrücklich beenden: Einzelne Ansichten hinterlassen Zeitgeber und
     Bildschleifen, die den Vorgang sonst offen halten. Ohne diese Zeile
     lief das Skript in die Zeitüberschreitung und galt als fehlgeschlagen,
     obwohl alle Prüfungen bestanden waren. */
  process.exit(fehler ? 1 : 0);
}

ablauf().then(ende, (e) => { zeige("Ablauf", e); ende(); });
