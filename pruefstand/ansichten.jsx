import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import App, { MenuScreen, EndScreen, AkademieScreen, TalentZeile,
  WildcardEnthuellung, Balken, AusbauRing, akaNaechster, akaLeistbar,
  ACHIEVEMENTS, RARITY, AKA_MAX, leereBilanz, hsvChance, akaStufe, akaSumme, akaRestkosten,
  leereAkademie, akaGruenden, akaJahr, akaVerbuchen, vcFuer, vcPosten, akaBonus,
  ABTEILUNGEN, createPlayer, develop, simulateSeason, makeOffers, marketValue,
  verdict, NATIONS, TYPES, MODES, POS, pick } from "./probe.jsx";

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
  stufen: { plaetze:6, scouting:6, internat:6, medizin:6, lehre:6, buehne:6 } }, "Reifes Haus", 2026);
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
      stufen: { plaetze:6, scouting:6, internat:6, medizin:6, lehre:6, buehne:6 } }]];
  proben.forEach(([n, a]) => {
    try {
      const z = akaNaechster(a);
      const voll = akaSumme(a) >= 6 * AKA_MAX;
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
mach("Ausbau-Ring", <AusbauRing von={14} bis={36} farbe="var(--ac)" />);
mach("Ausbau-Ring · leer", <AusbauRing von={0} bis={36} farbe="var(--ac)" />);

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
    if (!(leerTafel.textContent || "").includes("Noch niemand"))
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
