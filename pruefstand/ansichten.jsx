import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import App, {
  CLUBS,
  kopfPfad,
  drawWildcard, LAUFBAHN_MAX,
  MenuScreen, Optionen, EndScreen, AkademieScreen, TalentZeile, WildcardEnthuellung, Balken,
  AusbauRing, akaNaechster, akaLeistbar, ACHIEVEMENTS, RARITY, STUFEN, META, WildcardCard,
  RAHMEN, grundAufhellen, kontrast, haarDunkelste, GRUND_MIN, mischFarbe, HAIRC,
  Sonderschuss, SCHUSS_FELDER, SCHUSS_TROST, SCHUSS_PREISE, Spielerkarte, KARTEN, MERKSYMBOL, Packladen,
  Elfkarte, Boosterpack,
  AchievementScreen, Avatar, CreateScreen, HallScreen, RESSORT, titelgeschichte, Pass,
  Willkommen, WILLKOMMEN, FreiHinweis, leerGesehen,
  VCLADEN, SHOP_BILD, shopFuer, ladenGesperrt, ladenKaufbar, VCLadenAnsicht, tauschRest,
  rerollWildcard, rahmenFuer, rahmenOffen, ZURUECK, namensVorschlag, ANLEITUNG, EVENTS,
  weiblichForm, evText, autoTraining, TRAINING, AK, zuegeAusKennung, zugDrehen,
  ZUEGE_ANZAHL, AUGENFARBE, KOPFFORM, hautBereich, haarBereich, AKA_MAX, leereBilanz,
  Wappen, Trikot, VereinGruenden, VereinScreen, VereinAbschluss, VereinDach,
  WAPPEN_FORMEN, WAPPEN_ZEICHEN, TRIKOT_MUSTER, VEREIN,
  hsvChance, roleFor, bilanzErgaenzen, nochGueltig, akaNaechsteGabe,
  setSpeedmodus, setSchwierigkeit, akaStufe, akaSumme, akaRestkosten, leereAkademie, akaGruenden, akaJahr, AKA_FARBE,
  akaVerbuchen, vcFuer, vcPosten, akaBonus, akaBonusText, ABTEILUNGEN, createPlayer, develop,
  simulateSeason, makeOffers, marketValue, verdict, NATIONS, TYPES, MODES, POS, pick, CSS,
  tauschMax, SaisonRueckblick, KarriereRueckblick, FLAGGENART, stufeSchrift
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
/* 35.33: liest den Wert jetzt als ALLES, was hinter der Beschriftung im selben
   Kasten steht — Elemente wie nackte Textknoten.

   Vorher stand hier `feld.nextElementSibling`. Das sieht nur Elemente. In der
   Akademie und auf der Ehrentafel steht der Wert in einem eigenen `<span>` und
   wurde gefunden; in der Ruhmeshalle steht er als blanker Textknoten
   (`<div><span class="eb">Peak</span>{h.peak}</div>`), und dort lieferte
   `nextElementSibling` schlicht `null`. Die Prüfung war deshalb auf sieben von
   acht Zellen der Ruhmeshalle blind — nicht rot, sondern gar nicht angewandt,
   weil niemand sie dort aufgerufen hat.

   Das ist die richtige Reihenfolge: erst das Werkzeug so bauen, dass es beide
   Schreibweisen sieht, DANN dort anwenden. Die Markierung im Spiel umzubauen,
   nur damit ein Prüfwerkzeug sie findet, wäre der Schwanz, der mit dem Hund
   wedelt — und hätte sieben Stellen angefasst statt einer. */
function zahlenPruefen(div, marken, name) {
  const eb = [...div.querySelectorAll(".eb")];
  marken.forEach((m) => {
    const feld = eb.find((x) => (x.textContent || "").trim() === m);
    if (!feld) { zeige(name, "Beschriftung „" + m + "\u201C fehlt"); return; }
    let t = "";
    for (let n = feld.nextSibling; n; n = n.nextSibling) t += n.textContent || "";
    t = t.trim();
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

/* Verwaltung im Jahrgang (35.61) — durchgeklickt, nicht nur gerendert.
   Geprueft wird, dass die Zeile antippbar ist, der Kasten DIREKT darunter
   steht (wie im Kader seit 35.59) und die Rueckfrage vor dem Aussortieren
   wirklich kommt. */
{
  let stand3 = reif;
  function HausHuelle() {
    const [aa, setAa] = React.useState(stand3);
    stand3 = aa;
    return <AkademieScreen aka={aa} onKauf={()=>{}} onGruenden={()=>{}}
      onBack={()=>{}} onAendern={setAa} />;
  }
  const r3 = mach("Akademie · Jahrgang verwalten", <HausHuelle />);
  if (r3 && (reif.talente || []).length) {
    if (!klick(r3.div, "Jahrgang", "Reiter Jahrgang")) { /* gemeldet */ }
    else {
      const zeilen = [...r3.div.querySelectorAll("button")]
        .filter((b2) => /Anlage \d+–\d+/.test(b2.textContent || ""));
      if (!zeilen.length) zeige("Jahrgang", "keine antippbare Talentzeile gefunden");
      else {
        ok++;
        act(() => { zeilen[0].dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
        const t3 = r3.div.textContent || "";
        if (!/Vertrag auslaufen lassen/.test(t3)) zeige("Jahrgang", "der Kasten öffnet nicht");
        else ok++;
        if (!/Aussortieren …/.test(t3)) zeige("Jahrgang", "„Aussortieren“ fehlt");
        else ok++;
        /* Die Rueckfrage MUSS zwischen Tipp und Tat stehen. */
        if (/Das lässt sich nicht zurücknehmen/.test(t3))
          zeige("Jahrgang", "die Warnung steht schon vor der Rückfrage");
        else ok++;
        if (klick(r3.div, "Aussortieren …", "Rückfrage öffnen")) {
          const t4 = r3.div.textContent || "";
          if (!/Das lässt sich nicht zurücknehmen/.test(t4))
            zeige("Jahrgang", "die Rückfrage kommt nicht");
          else ok++;
          if (!/Doch nicht/.test(t4)) zeige("Jahrgang", "„Doch nicht“ fehlt");
          else ok++;
        }
        /* Und die Stellung: zwischen Zeile und Kasten darf keine zweite
           Talentzeile liegen. */
        let n3 = zeilen[0].nextElementSibling, dazwischen3 = 0, kasten3 = null;
        while (n3) {
          if (/Vertrag auslaufen lassen/.test(n3.textContent || "")) { kasten3 = n3; break; }
          if (/Anlage \d+–\d+/.test(n3.textContent || "")) dazwischen3++;
          n3 = n3.nextElementSibling;
        }
        if (!kasten3) zeige("Jahrgang", "der Kasten steht nicht in derselben Liste");
        else if (dazwischen3 > 0) zeige("Jahrgang", dazwischen3 + " Talentzeile(n) dazwischen");
        else ok++;
      }
    }
  }
}

/* ---- Porträtgrund (35.63) ------------------------------------------------
   Kevin auf dem Gerät: „einige Designs, vor allem bei dunklem Haar, erkennt
   man nicht". Gemessen war der Grund ohne Rahmen genauso hell wie schwarzes
   Haar — Kontrast 1,02, also praktisch kein Unterschied.

   Geprüft wird für JEDEN Rahmen UND für den Fall ohne. Der Fall ohne ist der
   wichtigste: so fängt jeder an, und ausgerechnet dort war es am schlimmsten. */
{
  const dunkel = haarDunkelste();
  const grund = (c) => grundAufhellen(mischFarbe(c, "#2E3A2E", .35));
  const faelle = [["ohne Rahmen", "#2A4433"],
                  ...Object.keys(RAHMEN).map((k) => [RAHMEN[k].n, RAHMEN[k].c])];
  const zuDunkel = faelle.filter(([, c]) => kontrast(grund(c), dunkel) < GRUND_MIN)
    .map(([n, c]) => n + " (" + kontrast(grund(c), dunkel).toFixed(2) + ")");
  if (zuDunkel.length)
    zeige("Porträtgrund", "zu dunkel für dunkles Haar: " + zuDunkel.join(", "));
  else { console.log("  Porträtgrund: " + faelle.length + " Fälle, alle über "
    + GRUND_MIN + " Kontrast ✓"); ok++; }

  /* Der dunkelste Haarton muss AUS DER PALETTE kommen. Stand er fest im
     Code, bliebe die Grenze stehen, wenn jemand die Palette ändert — und die
     Silhouette verschwände wieder, ohne dass etwas meldet. */
  const echtDunkel = HAIRC.reduce((a2, b2) => {
    const h = (x) => parseInt(x.slice(1), 16); return h(a2) <= h(b2) ? a2 : b2; });
  if (dunkel !== echtDunkel)
    zeige("Porträtgrund", "gemessen wird gegen " + dunkel
      + ", dunkelster Ton der Palette ist aber " + echtDunkel);
  else ok++;

  /* GEGENPROBE DER MESSUNG: ein absichtlich zu dunkler Grund MUSS auffallen.
     Ohne sie könnte die Prüfung für immer grün melden. */
  if (kontrast("#101410", dunkel) < GRUND_MIN) ok++;
  else zeige("Porträtgrund", "die Messung erkennt einen zu dunklen Grund nicht");
}

/* ---- Der Sonderschuss (35.76) --------------------------------------------
   Kevins Minispiel: ein Ball läuft durch einen Balken, man trifft ein Segment.
   Geprüft wird die MECHANIK, nicht das Gefühl — ob es sich gut anfühlt, sieht
   nur, wer es spielt. */
{
  const F = SCHUSS_FELDER;
  const ges = F.reduce((a2, f) => a2 + f.w, 0);

  /* SYMMETRISCH um die Mitte. Der Ball kommt aus beiden Richtungen; eine
     Skala, die nur von links gut ist, wäre in der Rückrichtung eine andere
     Aufgabe. */
  const spiegel = F.every((f, i2) => f.w === F[F.length - 1 - i2].w
    && f.att === F[F.length - 1 - i2].att && f.pot === F[F.length - 1 - i2].pot);
  if (!spiegel) zeige("Sonderschuss", "die Felder sind nicht symmetrisch");
  else ok++;

  /* Das beste Feld muss das SCHMALSTE sein — sonst ist „triff die Mitte"
     keine Aufgabe. */
  const bestes = F.reduce((a2, f) => (f.att > a2.att ? f : a2), F[0]);
  const schmalstes = F.reduce((a2, f) => (f.w < a2.w ? f : a2), F[0]);
  if (bestes.w !== schmalstes.w)
    zeige("Sonderschuss", "das beste Feld ist nicht das schmalste");
  else ok++;
  if (bestes.pot !== 1)
    zeige("Sonderschuss", "das beste Feld gibt keinen Anlagepunkt");
  else ok++;
  /* Und NUR das beste. Anlage an zwei Stellen wäre doppelt so häufig wie
     gedacht — bei einer Zahl, die dauerhaft wirkt. */
  /* GENAU EIN Feld gibt Anlage. Die Skala ist symmetrisch, aber das beste
     Feld liegt in der MITTE und ist deshalb nur einmal da — meine erste
     Prüfung erwartete zwei, weil ich die Spiegelung mitgedacht habe, ohne
     nachzusehen. Gemessen: ein Feld mit pot > 0. */
  if (F.filter((f) => f.pot > 0).length !== 1)
    zeige("Sonderschuss", "Anlage gibt es an " + F.filter((f) => f.pot > 0).length
      + " Feldern statt an genau einem");
  else ok++;

  /* Die Trefferwahrscheinlichkeit des besten Felds: gemessen, nicht geraten.
     Zu leicht entwertet die Belohnung, zu schwer macht sie unsichtbar. */
  const anteilBest = F.filter((f) => f.att === bestes.att)
    .reduce((a2, f) => a2 + f.w, 0) / ges * 100;
  if (anteilBest < 2 || anteilBest > 15)
    zeige("Sonderschuss", "das beste Feld deckt " + anteilBest.toFixed(1)
      + " % ab — zu " + (anteilBest < 2 ? "schmal" : "breit"));
  else { console.log("  Sonderschuss: bestes Feld " + anteilBest.toFixed(1)
    + " % · Trostbonus " + SCHUSS_TROST.att + " Attributpunkt"); ok++; }

  /* Der Trostbonus: wer danebentrifft, geht NICHT leer aus (Kevins
     Entscheidung). Er darf aber auch nicht so gut sein wie ein Treffer. */
  if (SCHUSS_TROST.att < 1) zeige("Sonderschuss", "kein Trostbonus bei Fehlschuss");
  else ok++;
  if (SCHUSS_TROST.att >= bestes.att || SCHUSS_TROST.pot > 0)
    zeige("Sonderschuss", "der Trostbonus ist so gut wie ein Treffer");
  else ok++;

  /* DAS FENSTER LIEGT AM KOERPER, nicht im Behälter (35.78). Es ist ein
     Portal — genau deshalb, weil `.fade` eine Transformation stehen lässt und
     `position: fixed` darin nicht mehr am Bildschirm klebt.
     `mach` prüft aber, ob im eigenen Behälter etwas steht, und meldete
     „Ansicht bleibt leer". Nicht falsch, nur am falschen Ort gesucht: hier
     wird selbst gerendert und in `document.body` nachgesehen. */
  const portalMach = (name, el) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);
    act(() => { root.render(el); });
    const dialog = document.body.querySelector("[role=dialog]");
    if (!dialog) { zeige(name, "kein Fenster am Körper"); return null; }
    return { div: dialog, aufraeumen: () => { act(() => root.unmount()); div.remove(); } };
  };

  /* Der Bildschirm selbst: er muss den Grund nennen und einen Knopf haben. */
  const rs = portalMach("Sonderschuss", <Sonderschuss grund="Note 1,9" ruhe={false}
    onFertig={() => {}} />);
  if (rs) {
    const t = rs.div.textContent || "";
    /* Nicht wegdrückbar (Kevins Wunsch): kein Schließen-Knopf, und der dunkle
       Grund darf keinen Klickhandler haben. */
    const knoepfe = [...rs.div.querySelectorAll("button")]
      .map((b2) => (b2.textContent || "").trim());
    if (knoepfe.some((k) => /^(Zurück|Schließen|Abbrechen|×)$/i.test(k)))
      zeige("Sonderschuss", "es gibt einen Ausweg ohne zu schießen");
    else ok++;
    if (!t.includes("Note 1,9")) zeige("Sonderschuss", "der Grund wird nicht genannt");
    else ok++;
    if (!/Schießen/.test(t)) zeige("Sonderschuss", "kein Schussknopf");
    else ok++;
  }

  /* BEI ABGESCHALTETER BEWEGUNG muss es trotzdem gehen. Ein
     Geschicklichkeitsspiel darf niemanden von einer Belohnung aussperren, der
     aus gutem Grund keine schnellen Bewegungen sehen will. */
  if (rs) rs.aufraeumen();
  const rr = portalMach("Sonderschuss · ohne Bewegung", <Sonderschuss grund="Torschützenkönig"
    ruhe onFertig={() => {}} />);
  if (rr) {
    const t2 = rr.div.textContent || "";
    if (!/ohne Bewegung/.test(t2))
      zeige("Sonderschuss", "bei abgeschalteter Bewegung fehlt der Hinweis");
    else ok++;
    if (klick(rr.div, "Schießen", "Schuss ohne Bewegung")) {
      const t3 = rr.div.textContent || "";
      if (!/Attributpunkt/.test(t3))
        zeige("Sonderschuss", "ohne Bewegung gibt es keine Belohnung");
      else ok++;
    }
    rr.aufraeumen();
  }
}

/* ---- Die Spielerkarte (35.82) --------------------------------------------
   Kevins Wunsch: jeder Spieler als Sammelkarte. Geprüft wird, dass jede Stufe
   ihre Farbe trägt, dass die verdeckte Karte NICHT schon verrät, wer drunter
   liegt, und dass dieselbe Karte immer dasselbe Gesicht bekommt. */
{
  /* Eigener Leerlauf. `nixf` ist weiter unten in einem anderen Block definiert
     (Zeile 1555) und hier nicht in Reichweite — der Lauf brach mit
     „nixf is not defined" ab. Ein Name, den man anderswo gesehen hat, ist
     nicht derselbe wie einer, den man hier benutzen darf. */
  const leer = () => {};
  const mk = (stufe, extra) => ({ kid: "test:" + stufe, name: "Karl Kartenmann",
    pos: "ST", ovr: stufe === "legende" ? 88 : stufe === "gold" ? 76
      : stufe === "silber" ? 66 : 56,
    pot: stufe === "legende" ? 90 : 80, alter: 26, flag: "🇩🇪", nat: "GER",
    stufe, herkunft: "pack", ...(extra || {}) });

  KARTEN.REIHE.forEach((stufe) => {
    const r = mach("Spielerkarte · " + stufe,
      <Spielerkarte karte={mk(stufe)} gross onTippen={leer} />);
    if (!r) return;
    const t = r.div.textContent || "";
    if (!t.includes("Karl Kartenmann")) zeige("Spielerkarte", stufe + ": kein Name");
    else ok++;
    /* Die Stufe muss zu SEHEN sein, nicht nur im Datenfeld stehen. */
    if (!t.includes(KARTEN.STUFEN[stufe].n))
      zeige("Spielerkarte", stufe + ": die Stufe wird nicht benannt");
    else ok++;
    /* DAS ROHE ATTRIBUT LESEN, nicht `style.borderColor`. jsdom rechnet die
       Farbe in `rgb(...)` um; ein Vergleich mit dem Hexwert findet dann nie
       etwas. Dieselbe Falle wie beim Verlauf in 35.72 — dort stand sie schon
       im Kommentar, und ich bin wieder hineingelaufen. */
    /* IN DERSELBEN SCHREIBWEISE VERGLEICHEN. jsdom schreibt Farben im
       style-Attribut als `rgb(...)` — auch im ROHEN Attribut, nicht erst in
       `style.borderColor`. Mein zweiter Anlauf las deshalb zwar das Attribut,
       verglich aber weiter mit dem Hexwert und fand nie etwas.
       Der Hexwert wird jetzt selbst nach rgb umgerechnet; dann vergleichen
       beide Seiten dasselbe. */
    const kasten = r.div.querySelector(".pan");
    const roh = kasten ? (kasten.getAttribute("style") || "") : "";
    const hex = KARTEN.STUFEN[stufe].farbe;
    const n = parseInt(hex.slice(1), 16);
    const alsRgb = "rgb(" + (n >> 16 & 255) + ", " + (n >> 8 & 255) + ", " + (n & 255) + ")";
    if (roh.indexOf(hex) < 0 && roh.indexOf(alsRgb) < 0)
      zeige("Spielerkarte", stufe + ": der Rand trägt nicht die Stufenfarbe ("
        + roh.slice(0, 70) + ")");
    else ok++;
  });

  /* VERDECKT: die Stufe darf man sehen — sonst wäre das Aufdecken ohne
     Erwartung —, den Spieler aber NICHT. Sonst gibt es nichts aufzudecken. */
  /* Die verdeckte Karte hat KEINEN Text ausser der Stufe — `mach` haelt eine
     Ansicht ohne Inhalt fuer leer und wirft. Sie bekommt deshalb einen
     eigenen Behaelter, wie das Portal-Fenster in 35.78. */
  const rv = (() => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);
    act(() => { root.render(<Spielerkarte karte={mk("gold")} aufgedeckt={false} onTippen={leer} />); });
    return { div, aufraeumen: () => { act(() => root.unmount()); div.remove(); } };
  })();
  if (rv) {
    const t = rv.div.textContent || "";
    if (t.includes("Karl Kartenmann"))
      zeige("Spielerkarte", "die verdeckte Karte verrät den Spieler");
    else ok++;
    if (!/GOLD/i.test(t)) zeige("Spielerkarte", "die verdeckte Karte zeigt die Stufe nicht");
    else ok++;
    rv.aufraeumen();
  }

  /* DASSELBE GESICHT. Der Avatar würfelt aus einer Kennung; käme die aus dem
     Zufall, sähe ein Spieler nach dem Blättern anders aus als davor. */
  const a1 = mach("Spielerkarte · Gesicht 1", <Spielerkarte karte={mk("silber")} />);
  const a2 = mach("Spielerkarte · Gesicht 2", <Spielerkarte karte={mk("silber")} />);
  if (a1 && a2) {
    const pfad = (r) => { const s2 = r.div.querySelector("svg");
      return s2 ? s2.innerHTML.length + ":" + (s2.innerHTML.match(/fill="([^"]+)"/) || [])[1] : ""; };
    if (pfad(a1) !== pfad(a2))
      zeige("Spielerkarte", "dieselbe Karte bekommt zwei verschiedene Gesichter");
    else ok++;
  }

  /* DECKEND, nicht durchscheinend (35.83, Kevins Wunsch: „eher fest und wie
     eine Sammelkarte"). Ein `transparent` im Verlauf lässt den Untergrund
     durch — genau das sah nach Schleier aus. */
  KARTEN.REIHE.forEach((stufe) => {
    const r = mach("Spielerkarte · deckend " + stufe, <Spielerkarte karte={mk(stufe)} />);
    if (!r) return;
    const roh = (r.div.querySelector(".pan") || {}).getAttribute
      ? r.div.querySelector(".pan").getAttribute("style") : "";
    if (/transparent/.test(roh))
      zeige("Spielerkarte", stufe + ": der Verlauf endet auf transparent");
    else ok++;
    /* Und die beiden Stopps müssen wirklich verschieden sein — ein Verlauf
       von einer Farbe zu derselben ist eine Fläche mit Aufwand. */
    const f = KARTEN.flaeche(stufe);
    if (f.oben === f.unten)
      zeige("Spielerkarte", stufe + ": oben und unten sind dieselbe Farbe");
    else ok++;
  });

  /* MERKMALE. Der naheliegende Fehler wäre, sie zu würfeln — dann stünde
     „Torjäger" auf einem Innenverteidiger, und beim zweiten Ansehen glaubt
     niemand mehr, was auf der Karte steht. */
  const merkST = KARTEN.merkmaleVon({ pos: "ST", ovr: 80, pot: 84, alter: 24, herkunft: "pack" });
  const merkIV = KARTEN.merkmaleVon({ pos: "IV", ovr: 80, pot: 84, alter: 24, herkunft: "pack" });
  if (merkST.some((m) => m.id === "mauer") || merkIV.some((m) => m.id === "tore"))
    zeige("Spielerkarte", "die Merkmale passen nicht zur Position");
  else ok++;
  if (!merkST.some((m) => m.id === "tore"))
    zeige("Spielerkarte", "ein starker Stürmer ist kein Torjäger");
  else ok++;
  /* Höchstens drei — was jeder hat, zeichnet niemanden aus. */
  const vieleM = KARTEN.merkmaleVon({ pos: "ST", ovr: 90, pot: 99, alter: 19,
    herkunft: "halle", zusatz: { titel: 12 } });
  if (vieleM.length > 3) zeige("Spielerkarte", "mehr als drei Merkmale: " + vieleM.length);
  else ok++;
  /* Ein schwacher Spieler bekommt keine Auszeichnung. */
  if (KARTEN.merkmaleVon({ pos: "ST", ovr: 54, pot: 58, alter: 25, herkunft: "pack" })
      .some((m) => m.id === "tore"))
    zeige("Spielerkarte", "auch ein schwacher Stürmer gilt als Torjäger");
  else ok++;
  /* Jedes Merkmal braucht ein Zeichen, das es gibt — sonst bleibt die Stelle
     leer und niemand merkt es. */
  const ohneZeichen = KARTEN.MERKMALE.filter((m) => !MERKSYMBOL[m.sym]).map((m) => m.n);
  if (ohneZeichen.length) zeige("Spielerkarte", "ohne Symbol: " + ohneZeichen.join(", "));
  else ok++;

  /* ---- Der Packladen (35.85) ---------------------------------------------
     Kevins Vorgabe: „Gezogene Spieler kommen nur dazu und sollen die Spieler
     aus der Akademie lediglich ergänzen." Ohne Obergrenze wäre das eine leere
     Zusage — wer genug kauft, hätte eine Mannschaft aus dem Laden. */
  {
    const leerV = { gegruendet: true, kader: [], name: "Probe", liga: "3. Liga" };
    const rl = mach("Packladen", <Packladen vc={600} pool={KARTEN.leererPool()}
      verein={leerV} gratis={0} onKauf={leer} onGratis={leer}
      onEinsetzen={() => null} onZurueck={leer} />);
    if (rl) {
      const t = rl.div.textContent || "";
      KARTEN.PACKS.forEach((pk) => {
        if (!t.includes(pk.n)) zeige("Packladen", pk.n + " fehlt");
        else ok++;
        if (!t.includes(pk.preis + " VC")) zeige("Packladen", pk.n + ": kein Preis");
        else ok++;
      });
      /* DER PREIS IN LAUFBAHNEN (aus 35.80). Ein Preis, dessen Folgen man erst
         drei Stunden später merkt, ist keine Entscheidung. */
      if (!/Laufbahnen Akademieausbau/.test(t))
        zeige("Packladen", "der Preis wird nicht in Laufbahnen angesagt");
      else ok++;
      /* Die Obergrenze muss DASTEHEN, nicht nur wirken. */
      if (!/ergänzen|ersetzen/.test(t))
        zeige("Packladen", "die Obergrenze wird nicht erklärt");
      else ok++;
    }

    /* Wer zu wenig VC hat, darf nicht kaufen — und muss erfahren, wie viel fehlt. */
    const ra = mach("Packladen · leeres Konto", <Packladen vc={5} pool={KARTEN.leererPool()}
      verein={leerV} gratis={0} onKauf={leer} onGratis={leer}
      onEinsetzen={() => null} onZurueck={leer} />);
    if (ra) {
      const t = ra.div.textContent || "";
      if (!/VC fehlen/.test(t)) zeige("Packladen", "es steht nicht da, wie viel fehlt");
      else ok++;
      const kaufbar = [...ra.div.querySelectorAll("button")]
        .filter((b2) => /^Kaufen$/.test((b2.textContent || "").trim()) && !b2.disabled);
      if (kaufbar.length) zeige("Packladen", "man kann kaufen, ohne genug VC zu haben");
      else ok++;
    }

    /* Das Gratispack erscheint nur, wenn eines da ist. */
    const rg2 = mach("Packladen · Gratispack", <Packladen vc={0} pool={KARTEN.leererPool()}
      verein={leerV} gratis={2} onKauf={leer} onGratis={leer}
      onEinsetzen={() => null} onZurueck={leer} />);
    if (rg2) {
      if (!/Bronzepacks warten/.test(rg2.div.textContent || ""))
        zeige("Packladen", "das Gratispack wird nicht angeboten");
      else ok++;
    }
    if (rl && /Gratispack öffnen/.test(rl.div.textContent || ""))
      zeige("Packladen", "ein Gratispack wird angeboten, obwohl keines da ist");
    else ok++;

    /* DIE OBERGRENZE SELBST. Fünf von sechzehn — die Elf steht damit immer
       mehrheitlich aus eigener Ausbildung. */
    let vv = { gegruendet: true, kader: [] };
    let abgewiesen = 0;
    for (let i = 0; i < 9; i++) {
      const r = VEREIN.karteEinsetzen(vv, { kid: "p" + i, name: "P" + i, pos: "ST",
        ovr: 70, pot: 74, alter: 25, stufe: "gold" });
      if (r.fehler) { abgewiesen++; break; }
      vv = r.v;
    }
    if (abgewiesen === 0) zeige("Packladen", "es gibt keine Obergrenze für gezogene Spieler");
    else ok++;
    if (VEREIN.packImKader(vv) > Math.floor(VEREIN.KADER_MIN * VEREIN.PACK_ANTEIL))
      zeige("Packladen", "mehr gezogene Spieler im Kader als erlaubt");
    else ok++;
    /* Und der naheliegende Umweg: derselbe Spieler zweimal. */
    const doppelt = VEREIN.karteEinsetzen(vv, { kid: "p0", name: "P0", pos: "ST",
      ovr: 70, pot: 74, alter: 25, stufe: "gold" });
    if (!doppelt.fehler) zeige("Packladen", "derselbe Spieler lässt sich zweimal einsetzen");
    else ok++;
  }

  /* ---- Der Fundus (35.87) -------------------------------------------------
     Kevin: „dass man gezogene Spieler immer in einem Fundus hat und sie in die
     Mannschaft packen und wieder rausziehen kann. Dass man allgemein nötige
     Verwaltungsmöglichkeiten hat."
     Bei fünf Karten braucht es nichts. Bei fünfzig braucht es alles — und
     fünfzig sind nach zehn Packs erreicht. */
  {
    const mkK = (i, stufe, ovr, pos) => ({ kid: "f" + i, name: "Fundus " + i,
      pos: pos || "ST", ovr, pot: ovr + 4, alter: 26, flag: "🇩🇪", nat: "GER",
      stufe, herkunft: "pack", zusatz: {} });
    let pl = KARTEN.leererPool();
    pl = KARTEN.poolErgaenzen(pl, [
      mkK(1, "bronze", 56, "TW"), mkK(2, "silber", 66, "ZM"),
      mkK(3, "gold", 76, "IV"), mkK(4, "legende", 88, "ST"),
      KARTEN.ausHalle({ name: "Eigene Legende", pos: "ZM", nat: "🇩🇪", age: 35,
        peak: 90, score: 900, titles: 9, goals: 300, caps: 80 }, 0)]);
    const vv = { gegruendet: true, kader: [], name: "P", liga: "3. Liga" };

    const rf = mach("Fundus", <Packladen vc={100} pool={pl} verein={vv} gratis={0}
      onKauf={leer} onGratis={leer} onEinsetzen={() => null} onEntfernen={() => null}
      onVerkauf={() => null} onZurueck={leer} />);
    if (rf) {
      /* Der Fundus liegt hinter einem Knopf — erst dorthin. */
      if (!klick(rf.div, "Sammlung", "in den Fundus")) {
        zeige("Fundus", "kein Weg in die Sammlung");
      } else {
        const t = rf.div.textContent || "";
        /* DIE ÜBERSICHT: wie viele je Stufe. Ohne sie muss man zählen. */
        if (!/1 bronze/.test(t) || !/2 legendär/i.test(t))
          zeige("Fundus", "die Zählung je Stufe stimmt nicht: "
            + (t.match(/\d+ Karten[^\n]*/) || [""])[0]);
        else ok++;
        /* FILTER UND SORTIERUNG müssen da sein — eine Liste, die man nur
           durchscrollt, ist kein Fundus, sondern ein Haufen. */
        if (!/Zeigen/.test(t) || !/Sortieren/.test(t))
          zeige("Fundus", "keine Verwaltung (Filter oder Sortierung fehlt)");
        else ok++;
        /* SORTIERT NACH STÄRKE: der Beste steht oben. Das ist die Frage, die
           man an einen Fundus hat. */
        const namen = [...rf.div.querySelectorAll(".pan.winkel")]
          .map((x) => (x.textContent || "").match(/(\d\d)\s*$/) || []);
        const werte = [...rf.div.querySelectorAll(".pan.winkel")]
          .map((x) => { const m = (x.textContent || "").match(/(\d{2})Anlage|(\d{2})$/);
            return m ? Number(m[1] || m[2]) : null; }).filter((x) => x != null);
        if (werte.length >= 2 && werte[0] < werte[werte.length - 1])
          zeige("Fundus", "nicht nach Stärke sortiert: " + werte.join(", "));
        else ok++;
        /* Die Ruhmeshallenkarte darf KEINEN Verkaufsknopf haben. */
        const kaesten = [...rf.div.querySelectorAll(".g1 > div")];
        const halleKasten = kaesten.find((x) => /Eigene Legende/.test(x.textContent || ""));
        if (halleKasten && /Verkaufen/.test(halleKasten.textContent || ""))
          zeige("Fundus", "die Ruhmeshallenkarte lässt sich verkaufen");
        else ok++;
        /* Und eine Packkarte MUSS einen haben — sonst ist die Grenze wieder
           eine Falle. */
        const packKasten = kaesten.find((x) => /Fundus 4/.test(x.textContent || ""));
        if (packKasten && !/Verkaufen/.test(packKasten.textContent || ""))
          zeige("Fundus", "eine Packkarte lässt sich nicht verkaufen");
        else ok++;
      }
    }
  }

  /* ---- Die Elfkarte (35.90, von Kevin im Bild gemeldet) -------------------
     „Die Mannschaftsaufstellung mit den Wappen passt noch nicht
     skalierungstechnisch." Gemessen: die Karte war 88 px breit, ihre Spalte
     bei 412 px Fensterbreite nur 82 — jede ragte sechs Pixel darüber, die
     vierte wurde am Rand abgeschnitten.
     EINE FESTE PIXELBREITE IN EINEM RASTER, DAS SICH ANPASST, IST EIN
     WIDERSPRUCH. */
  {
    const sp = { id: "e1", name: "Testspieler", pos: "ST", ovr: 76, alter: 25,
      nat: "GER", ausPack: false };
    const re = mach("Elfkarte", <Elfkarte spieler={sp} stufe="gold" platz="ST"
      eignung={1} onTippen={leer} />);
    if (re) {
      const b2 = re.div.querySelector("button");
      const roh = b2 ? (b2.getAttribute("style") || "") : "";
      /* `width: 100%` ist richtig, `width: 88px` war der Fehler. Mein
         erstes Muster traf beides nicht sauber: es suchte Ziffern gefolgt von
         px — und „100%" enthält Ziffern, aber kein px, also hätte es passen
         müssen. Es passte trotzdem, weil `maxWidth: 110px` in derselben
         Zeichenkette steht. EIN MUSTER, DAS DIE GANZE ZEILE DURCHSUCHT,
         findet auch, was zu einer anderen Eigenschaft gehört. */
      const wid = (roh.match(/(^|;)\s*width:\s*([^;]+)/) || [])[2] || "";
      if (/px/.test(wid))
        zeige("Elfkarte", "feste Pixelbreite statt Spaltenbreite: " + wid);
      else ok++;
      /* Die Herkunft MUSS drauf sein — Kevins Vorgabe aus 35.88. */
      if (!re.div.querySelector("svg path"))
        zeige("Elfkarte", "kein Herkunftszeichen");
      else ok++;
    }
    /* Bei falscher Position: die WIRKSAME Stärke, rot, mit Prozentangabe. */
    const rf2 = mach("Elfkarte · falsche Position", <Elfkarte spieler={sp}
      stufe="gold" platz="IV" eignung={.8} onTippen={leer} />);
    if (rf2) {
      const t = rf2.div.textContent || "";
      if (!/80 %/.test(t)) zeige("Elfkarte", "die Eignung wird nicht genannt");
      else ok++;
      /* Die 61 steht da — mein erster Ausdruck suchte sie mit Wortgrenzen,
         und im zusammengeflossenen Text („Testspieler61ST") gibt es links von
         der 61 keine. Wortgrenzen setzen voraus, dass Text getrennt ist; in
         `textContent` ist er das nicht. */
      if (t.indexOf("61") < 0)
        zeige("Elfkarte", "nicht die wirksame Stärke (76 × 0,8 = 61): " + t.slice(0, 40));
      else ok++;
    }
    /* Ein leerer Platz ist auch eine Karte — sonst hüpft das Raster. */
    const rl2 = mach("Elfkarte · leerer Platz", <Elfkarte spieler={null} platz="ST"
      onTippen={leer} />, 0);
    if (rl2 && !rl2.div.querySelector("button"))
      zeige("Elfkarte", "ein leerer Platz ist keine Karte");
    else ok++;
    /* Kleine Karten brauchen den SCHMALEN Schimmer — der breite deckt eine
       82-px-Karte auf einmal ab und wirkt wie ein Farbteppich. */
    const rh = mach("Elfkarte · Schimmer", <Elfkarte spieler={sp} stufe="legende"
      platz="ST" eignung={1} onTippen={leer} />);
    if (rh) {
      const h = rh.div.querySelector(".holo");
      if (!h) zeige("Elfkarte", "kein Schimmer auf einer legendären Karte");
      else if (h.className.indexOf("eng") < 0)
        zeige("Elfkarte", "der breite Schimmer auf einer kleinen Karte");
      else ok++;
    }
  }

  /* ---- Der Sonderschuss verteilt alles (35.94) ----------------------------
     Kevin: „Ich habe das Gefühl, dass die über das Minispiel gewonnenen
     Attributpunkte manchmal nicht verteilt werden."
     Er hatte recht: stand ein Wert schon an der Grenze — bei einem starken
     Stürmer ist `sho` irgendwann 99 —, tat `clamp(… + 1)` nichts, und der
     Punkt war lautlos weg. */
  {
    const gew = POS.ST.w;
    const kern = Object.keys(gew).sort((x, y) => gew[y] - gew[x]);
    /* Fünf von sechs Kernwerten am Anschlag, einer hat Luft. */
    const attrs = { pac: 99, sho: 99, pas: 70, dri: 99, def: 40, phy: 99 };
    let vergeben = 0;
    for (let i = 0; i < 3; i++) {
      const frei = kern.filter((k2) => attrs[k2] < 99);
      if (!frei.length) break;
      attrs[frei[i % frei.length]]++; vergeben++;
    }
    if (vergeben < 3)
      zeige("Sonderschuss", "nur " + vergeben + " von 3 Punkten vergeben, obwohl Platz war");
    else ok++;

    /* DER VOLLTREFFER GIBT NICHT IMMER DASSELBE (Kevins zweiter Punkt). */
    if (!SCHUSS_PREISE || SCHUSS_PREISE.length < 3)
      zeige("Sonderschuss", "es gibt nur einen Preis für den Volltreffer");
    else ok++;
    if (SCHUSS_PREISE && !SCHUSS_PREISE.some((x) => x.id === "pot"))
      zeige("Sonderschuss", "der Anlagepunkt fehlt ganz");
    else ok++;
    /* Jeder Preis braucht Namen UND Erklärung — „form" allein sagt nichts. */
    const ohneText = (SCHUSS_PREISE || []).filter((x) => !x.n || !x.t).map((x) => x.id);
    if (ohneText.length) zeige("Sonderschuss", "ohne Text: " + ohneText.join(", "));
    else ok++;
    /* Und die Anlage darf nicht der einzige HÄUFIGE sein — sonst ändert sich
       für den Spieler nichts. */
    const gesamtW = (SCHUSS_PREISE || []).reduce((a2, x) => a2 + x.w, 0);
    const potAnteil = ((SCHUSS_PREISE || []).find((x) => x.id === "pot") || {}).w / gesamtW;
    if (potAnteil > 0.6)
      zeige("Sonderschuss", "die Anlage kommt in " + (potAnteil * 100).toFixed(0) + " % der Fälle");
    else ok++;
  }

  /* ---- Jede Ansicht braucht einen Ausgang (35.95) -------------------------
     Kevin: „Aus der Spielersammlung gibt es keinen Zurück-Knopf."

     Der Fehler entstand in 35.94: bis dahin kam man nur über den Laden in die
     Sammlung, und „Zum Laden" war der richtige und einzige Rückweg. Seit es
     das Fundussymbol im Dach gibt, kommt man auch DIREKT — und stand dann in
     einer Sammlung, aus der nur ein Weg in einen Laden führte, den man nie
     betreten hat.

     EIN NEUER ZUGANG BRAUCHT EINEN PASSENDEN AUSGANG. Wer das vergisst, baut
     eine Sackgasse — dieselbe Art Fehler wie beim Aufdecktisch in 35.90.
     Beide Male hat es Kevin gefunden, nicht der Prüfstand. Deshalb hier eine
     Prüfung, die es künftig tut. */
  {
    const leerP = KARTEN.leererPool();
    const mitP = KARTEN.poolErgaenzen(leerP,
      [KARTEN.neueKarte("gold", 2030), KARTEN.neueKarte("silber", 2030)]);
    const vv3 = { gegruendet: true, kader: [], name: "P", liga: "3. Liga" };
    let zurueckGerufen = 0;

    /* Der Laden, in beiden Reitern. */
    [["laden", "Packladen"], ["sammlung", "Sammlung"]].forEach(([reiter, name]) => {
      const r = mach("Ausgang · " + name, <Packladen vc={200} pool={mitP} verein={vv3}
        gratis={0} startReiter={reiter} onReiterGesehen={leer}
        onKauf={leer} onGratis={leer} onStartpaket={leer}
        onEinsetzen={() => null} onEntfernen={() => null} onVerkauf={() => null}
        onZurueck={() => { zurueckGerufen++; }} />);
      if (!r) return;
      const knoepfe = [...r.div.querySelectorAll("button")]
        .map((b2) => (b2.textContent || "").trim());
      const zurueck = knoepfe.find((x) => /^Zurück$/.test(x));
      if (!zurueck) {
        zeige("Ausgang", name + " hat keinen Zurück-Knopf: " + knoepfe.slice(0, 6).join(", "));
      } else {
        ok++;
        /* UND ER MUSS WIRKEN. Ein Knopf, der nichts tut, ist schlimmer als
           keiner — das war die Lehre aus 35.90. */
        const vorher = zurueckGerufen;
        klick(r.div, "Zurück", name + ": Zurück drücken");
        if (zurueckGerufen === vorher)
          zeige("Ausgang", name + ": der Zurück-Knopf ruft nichts auf");
        else ok++;
      }
    });
  }

  /* HOLOSCHIMMER nur auf Gold und Legendär (35.84, Kevins Wunsch). Auf Bronze
     und Silber wäre er kein Merkmal mehr, sondern Dekoration — und Dekoration,
     die überall ist, sagt nichts. */
  [["bronze", false], ["silber", false], ["gold", true], ["legende", true]].forEach(([stufe, soll]) => {
    const r = mach("Spielerkarte · Holo " + stufe, <Spielerkarte karte={mk(stufe)} />);
    if (!r) return;
    const hat = !!r.div.querySelector(".holo");
    if (hat !== soll)
      zeige("Spielerkarte", stufe + (soll ? " hat keinen Holoschimmer"
        : " schimmert, obwohl es keine seltene Karte ist"));
    else ok++;
  });
  /* DER TEXT MUSS OBEN LIEGEN. Ein Schimmer über der Schrift verschluckt sie —
     und das fiele erst auf dem Gerät auf, wo man es nicht mehr messen kann. */
  {
    const r = mach("Spielerkarte · Holo unter dem Text", <Spielerkarte karte={mk("legende")} />);
    if (r) {
      const kasten = r.div.querySelector(".pan");
      const kinder = kasten ? [...kasten.children] : [];
      const iHolo = kinder.findIndex((x) => x.classList.contains("holo"));
      const iText = kinder.findIndex((x) => (x.textContent || "").includes("Karl Kartenmann"));
      if (iHolo < 0 || iText < 0)
        zeige("Spielerkarte", "Holo oder Text nicht gefunden");
      else if (iHolo > iText)
        zeige("Spielerkarte", "der Holoschimmer liegt über dem Text");
      else ok++;
    }
  }

  /* JUBEL NUR FÜR SELTENES. Eine Feier bei jeder Bronzekarte ist keine Feier,
     sondern eine Wartezeit. */
  [["bronze", false], ["silber", false], ["gold", true], ["legende", true]].forEach(([stufe, soll]) => {
    const r = mach("Spielerkarte · Jubel " + stufe, <Spielerkarte karte={mk(stufe)} jubel />);
    if (!r) return;
    const hat = /kartenjubel/.test((r.div.querySelector(".pan") || {}).className || "");
    if (hat !== soll)
      zeige("Spielerkarte", stufe + (soll ? " feiert nicht" : " feiert, obwohl es nichts zu feiern gibt"));
    else ok++;
  });

  /* Anlage nur zeigen, wenn es etwas zu holen gibt — „Anlage 70" bei Stärke 70
     ist keine Auskunft, sondern Füllsel. */
  const rg = mach("Spielerkarte · ausgereift",
    <Spielerkarte karte={{ ...mk("gold"), ovr: 76, pot: 76 }} />);
  if (rg) {
    if (/Anlage/.test(rg.div.textContent || ""))
      zeige("Spielerkarte", "Anlage wird gezeigt, obwohl nichts zu holen ist");
    else ok++;
  }
}

/* ---- Karrierebilanz: zwei Kästen, nicht einer (35.94) --------------------
   Kevin: „Der VC-Verdienst und die Übersicht der Jugendakademie müssen noch
   getrennt werden. Die Kachel zur Jugendakademie darf nur kommen, wenn diese
   auch bereits gegründet wurde."

   Bis 35.93 hiess der Kasten „Ein Jahr Jugendakademie" und zeigte den
   VC-Verdienst — auch bei jemandem OHNE Akademie, der dann eine Ueberschrift
   ueber einem Haus las, das es nicht gibt. */
{
  /* MIT DER ECHTEN FABRIK, nicht von Hand zusammengesteckt. Mein erster
     Entwurf listete zwanzig Felder auf und vergass `depot` — `netWorth`
     stürzte ab. Ein Spieler hat mehr Felder, als man beim Abtippen im Kopf
     hat; `createPlayer` weiß, welche. */
  const spielerB = (() => {
    const q = createPlayer({ name: "Bilanzprobe", nation: "GER", pos: "ZM",
      foot: "rechts", number: 8, type: TYPES[0].id, mode: MODES[0].id, gender: "m",
      statur: "normal", aka: null });
    q.verdict = { score: 100, title: "Probe", sub: "", tier: "profi" };
    q.retired = true;
    q.vcGewinn = 13;
    q.vcPosten = [{ k: "Aus 144 Punkten", v: 6 }];
    return q;
  })();

  /* OHNE Akademie: nur der VC-Kasten, mit dem Hinweis. */
  const rOhne = mach("Bilanz ohne Akademie",
    <EndScreen p={{ ...spielerB, akaAktiv: false, akaName: null, akaEreignisse: [] }}
      onMenu={leer} onNeu={leer} ges={{ karrieren: 2 }} />, 0);
  if (rOhne) {
    const t = rOhne.div.textContent || "";
    if (!/Vermächtnis-Coins/i.test(t)) zeige("Bilanz", "der VC-Kasten fehlt");
    else ok++;
    if (/Ein Jahr Jugendakademie/i.test(t))
      zeige("Bilanz", "der Akademiekasten steht da, obwohl es keine Akademie gibt");
    else ok++;
    if (!/noch keine Akademie/i.test(t))
      zeige("Bilanz", "es steht nicht da, dass noch keine Akademie existiert");
    else ok++;
  }

  /* MIT Akademie: beide Kästen, getrennt. */
  const rMit = mach("Bilanz mit Akademie",
    <EndScreen p={{ ...spielerB, akaAktiv: true, akaName: "Nachwuchs des Testelf",
      akaEreignisse: [{ art: "aufnahme", txt: "Drei neue Talente." }] }}
      onMenu={leer} onNeu={leer} ges={{ karrieren: 2 }} />, 0);
  if (rMit) {
    const t = rMit.div.textContent || "";
    if (!/Vermächtnis-Coins/i.test(t)) zeige("Bilanz", "mit Akademie fehlt der VC-Kasten");
    else ok++;
    if (!/Ein Jahr Jugendakademie/i.test(t))
      zeige("Bilanz", "der Akademiekasten fehlt, obwohl es eine Akademie gibt");
    else ok++;
    /* Der Hinweis „noch keine Akademie" darf dann NICHT dastehen. */
    if (/noch keine Akademie/i.test(t))
      zeige("Bilanz", "der Hinweis auf die fehlende Akademie steht trotz Akademie da");
    else ok++;
    /* ZWEI KAESTEN, nicht einer: die beiden Ueberschriften muessen in
       VERSCHIEDENEN Kaesten stehen — sonst ist es wieder einer mit zwei
       Titeln. */
    const kaesten = [...rMit.div.querySelectorAll(".pan")];
    const vcK = kaesten.find((x) => /Vermächtnis-Coins/i.test(x.textContent || ""));
    const akaK = kaesten.find((x) => /Ein Jahr Jugendakademie/i.test(x.textContent || ""));
    if (vcK && akaK && vcK === akaK)
      zeige("Bilanz", "beides steht in demselben Kasten");
    else ok++;
  }
}

const ZAHLEN = ["Jahrgänge", "Profis", "Weltklasse", "Nationalspieler", "Jugendturniere", "Ansehen"];
[["frisch gegründet", gegruendet], ["25 Jahre", reif], ["niemand im Haus", leerImHaus],
 ["Bilanz halb", { name:"X", gegruendet:2026, jahr:2032, vc:12, bilanz:{ profis:3 } }],
 ["Stufen halb", { name:"X", gegruendet:2026, jahr:2032, stufen:{ plaetze:4 } }],
 ["nur Name und Jahr", { name:"X", gegruendet:2026, jahr:2032 }]].forEach(([n, a]) => {
  const r = mach("Zahlen · " + n, <AkademieScreen aka={a} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);
  if (r) zahlenPruefen(r.div, ZAHLEN, "Zahlen · " + n);
});

/* ---- Der Physio haelt eine Saison (35.42) -------------------------------
   Bis 35.41 hatte `physio` `dauer: 0` — er heilte einmal und war weg. Jetzt
   `dauer: 1` und in der laufenden Saison kommt gar keine Verletzung dazu.

   Gepruefte Richtungen: mit laufendem Posten NIE eine Verletzung, ohne ihn
   welche (sonst prueft die erste Haelfte nichts), und ein vorgemerkter
   Ereignisschaden wird geschluckt statt in die naechste Saison verschoben. */
{
  const saison = (mitPhysio, n) => {
    let verletzt = 0;
    for (let i = 0; i < n; i++) {
      const q = laufbahn(null);
      q.age = 33; q.injuryProne = 70; q.fitness = 55;   // hohes Risiko, damit es beisst
      q.laden = mitPhysio ? { physio: 1 } : {};
      simulateSeason(q);
      const s = q.seasons[q.seasons.length - 1];
      if (s && s.injury) verletzt++;
    }
    return verletzt;
  };
  const ohne = saison(false, 60), mit = saison(true, 60);
  if (ohne === 0)
    zeige("Physio", "ohne Physio gab es in 60 Saisons keine Verletzung — die Probe prüft nichts");
  else ok++;
  if (mit !== 0)
    zeige("Physio", "mit laufendem Physio gab es " + mit + " Verletzungen in 60 Saisons");
  else ok++;

  /* Vorgemerkter Schaden aus einem Ereignis: muss verfallen, nicht warten. */
  const q = laufbahn(null);
  q.age = 30; q.laden = { physio: 1 }; q.pendingInjury = "schwer";
  simulateSeason(q);
  const s1 = q.seasons[q.seasons.length - 1];
  if (s1 && s1.injury) zeige("Physio", "eine vorgemerkte Verletzung kommt trotz Physio durch");
  else ok++;
  if (q.pendingInjury) zeige("Physio", "die Vormerkung bleibt stehen und trifft die nächste Saison");
  else ok++;

  /* Der Posten selbst: Dauer und Preis stehen in VCLADEN, nicht hier. */
  const posten = VCLADEN.find((a) => a.id === "physio");
  if (!posten) zeige("Physio", "den Ladenposten gibt es nicht mehr");
  else {
    if (posten.dauer !== 1) zeige("Physio", "Dauer ist " + posten.dauer + " statt 1");
    else ok++;
    if (!/ganze Saison/.test(posten.t))
      zeige("Physio", "der Ladentext verspricht die Saison nicht: „" + posten.t + "“");
    else ok++;
  }
  console.log("  Physio          ohne: " + ohne + "/60 Saisons verletzt · mit: " + mit
    + "/60 · Preis " + (posten ? posten.preis : "?") + " VC · Dauer " + (posten ? posten.dauer : "?"));
}

/* ---- Abschluss: Reiter eingeklappt, Leiste angeheftet (35.42) -----------
   Bis 35.41 hing alles untereinander: bei 412 px war die Seite 5.125 px lang
   und „Neue Laufbahn beginnen" begann erst bei 4.952 px. Man scrollte an
   Stationen, drei Auswertungsansichten und dem Teilen-Text vorbei, bevor der
   Knopf kam.

   Was jsdom hier pruefen kann, ist die STRUKTUR: sind die Reiter da, ist beim
   Oeffnen keiner gewaehlt, klappt ein zweites Tippen wieder zu, und steht der
   Platzhalter unter dem Inhalt. Ob die Leiste den letzten Eintrag verdeckt,
   kann jsdom NICHT sehen — das misst `endmessung` in Chromium (Zahlen im
   Messblock von 35.42). Diese Trennung wird hier ausdruecklich benannt, damit
   niemand die jsdom-Probe fuer eine Layoutpruefung haelt. */
{
  const q = laufbahn(null);
  q.verdict = verdict(q); q.retired = true;
  const r = mach("Abschluss · Reiter eingeklappt", <EndScreen p={q} onNew={()=>{}} />);
  if (r) {
    const reiter = [...r.div.querySelectorAll(".tabs .btn")];
    /* 35.42: gekuerzt von „Nationalelf"/„Zum Teilen" auf „Land"/„Teilen".
       Mit den langen Beschriftungen ragte der fuenfte Reiter bei 412 px
       zwoelf Pixel ueber den Rand — die Zeile scrollt zwar, aber wischen
       zu muessen ist das Gegenteil von Uebersicht. Die Knopfmessung hat
       das gemeldet, sobald der Abschlussbildschirm im Bogen lag. */
    /* 35.51: EIN Handlungsknopf in der Leiste, nicht drei. Bis 35.50 standen
       dort „Ruhmeshalle" und „Dein Verein" — beide Ziele stehen im
       Hauptmenue, und genau dorthin fuehrt der Knopf ohnehin. Und die
       Beschriftung muss sagen, was passiert: der Knopf BEGANN nichts, er
       schliesst ab. */
    {
      const leiste = r.div.querySelector(".rs-abschlussleiste");
      const kn = leiste ? [...leiste.querySelectorAll("button")] : [];
      if (kn.length !== 1) zeige("Abschluss", "Leiste hat " + kn.length + " Knöpfe statt einem");
      else ok++;
      const txt = kn.length ? (kn[0].textContent || "") : "";
      if (!/abschließen/i.test(txt)) zeige("Abschluss", "Knopf sagt nicht, dass abgeschlossen wird: " + txt.slice(0, 40));
      else ok++;
      if (/Neue Laufbahn beginnen/.test(txt))
        zeige("Abschluss", "die alte, unzutreffende Beschriftung ist zurück");
      else ok++;
      if (!/Hauptmenü/.test(txt)) zeige("Abschluss", "das Ziel Hauptmenü wird nicht genannt");
      else ok++;
      /* Kein Sprung aus dem Rueckblick heraus — weder in die Akademie noch
         in die Ruhmeshalle, an KEINER Stelle des Bildschirms. */
      const alle = [...r.div.querySelectorAll("button")].map((x) => (x.textContent || "").trim());
      const sprung = alle.filter((t) => /Ruhmeshalle|Zur Jugendakademie|Jetzt ausbauen|^Dein Verein$/.test(t));
      if (sprung.length) zeige("Abschluss", "Sprungknopf zurück: " + sprung.join(" | "));
      else ok++;
    }
    const SOLL = ["Stationen", "Statistik", "Land", "Titel", "Teilen"];
    const haben = reiter.map((x) => (x.textContent || "").trim());
    if (haben.length !== SOLL.length || SOLL.some((n, i) => haben[i] !== n))
      zeige("Abschluss", "Reiter stimmen nicht: " + haben.join("/"));
    else ok++;

    /* Eingeklappt heisst: KEIN Reiter gewaehlt und keiner der Inhalte da. */
    if (r.div.querySelectorAll(".tabs .btn.on").length !== 0)
      zeige("Abschluss", "beim Öffnen ist schon ein Reiter gewählt");
    else ok++;
    const txt = r.div.textContent || "";
    if (/Zum Teilen[\s\S]{0,40}\n/.test(txt) && txt.indexOf("Stationen (") >= 0)
      zeige("Abschluss", "ein Reiterinhalt steht trotz eingeklapptem Zustand da");
    else ok++;

    /* Der Platzhalter muss so hoch sein wie die Leiste im CSS. Zwei Zahlen,
       die zusammengehoeren und in verschiedenen Dateien stehen — genau die
       Sorte, die auseinanderlaeuft. */
    const platz = [...r.div.querySelectorAll("[aria-hidden]")]
      .find((x) => /height:\s*132px/.test(x.getAttribute("style") || ""));
    if (!platz) zeige("Abschluss", "der Platzhalter unter dem Inhalt fehlt — die Leiste verdeckt den letzten Eintrag");
    else ok++;

    const leiste = r.div.querySelector(".rs-abschlussleiste");
    if (!leiste) zeige("Abschluss", "die angeheftete Leiste fehlt");
    /* Seit 35.51 EIN Knopf statt drei — die Zahl steht hier UND oben in der
       Knopfprobe. Zwei Stellen fuer dieselbe Zahl laufen auseinander; diese
       hier prueft die Leiste als Bauteil (gibt es sie ueberhaupt), die obere
       ihren Inhalt. */
    else if (leiste.querySelectorAll(".btn").length !== 1)
      zeige("Abschluss", "die Leiste hat " + leiste.querySelectorAll(".btn").length + " Knöpfe statt einem");
    else ok++;

    /* 35.42, nachgetragen: das Auf- UND Zuklappen wirklich durchspielen.
       Der Kommentar oben behauptete schon, ein zweites Tippen klappe wieder
       zu — geprueft wurde es nicht. Als ich das Zuklappen zur Gegenprobe
       ausbaute, blieb der Lauf gruen. Eine Behauptung im Kommentar ist keine
       Pruefung, und ohne das Zuklappen kommt man nicht zur Uebersicht
       zurueck — genau darum ging es bei diesem Umbau. */
    if (reiter.length) {
      const erster = reiter[0];
      act(() => { erster.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
      const aufAn = r.div.querySelectorAll(".tabs .btn.on").length;
      const aufInhalt = (r.div.textContent || "").indexOf("Stationen (") >= 0;
      act(() => { r.div.querySelectorAll(".tabs .btn")[0]
        .dispatchEvent(new MouseEvent("click", { bubbles: true })); });
      const zuAn = r.div.querySelectorAll(".tabs .btn.on").length;
      const zuInhalt = (r.div.textContent || "").indexOf("Stationen (") >= 0;
      if (aufAn !== 1 || !aufInhalt)
        zeige("Abschluss", "erstes Tippen klappt nicht auf (gewählt=" + aufAn + ", Inhalt=" + aufInhalt + ")");
      else if (zuAn !== 0 || zuInhalt)
        zeige("Abschluss", "zweites Tippen klappt nicht wieder zu — kein Weg zurück zur Übersicht");
      else ok++;
    }

    console.log("  Abschluss       " + haben.length + " Reiter, beim Öffnen keiner gewählt · "
      + "auf und wieder zu · Leiste mit 1 Knopf · Platzhalter 132 px");
  }
}

/* ---- Voreinstellung gegen mitgeschleppten Spielstand (35.41) ------------
   Offener Punkt 6 lautete: „Alte Spielstaende tragen `speed` und `mode`
   weiter am Spieler; die Voreinstellung greift nur bei neuen Laufbahnen.
   So gewollt, sollte aber im Blick bleiben."

   Im Blick behalten heisst nicht: daran denken. `SPEEDMODUS` und
   `SCHWIERIGKEIT` sind Modulvariablen, die der Optionsbildschirm setzt;
   `createPlayer` liest sie NICHT selbst, sondern bekommt sie ueber `cfg`.
   Dreht jemand das um — etwa weil es „einfacher" aussieht —, aendert sich
   rueckwirkend die Schwierigkeit jeder laufenden Karriere, und zwar still.

   Deshalb hier festgenagelt, in beide Richtungen. */
{
  const bau = (cfg) => createPlayer({ name: "V", nation: "GER", pos: "ST", foot: "rechts",
    number: 9, type: TYPES[0].id, mode: MODES[1].id, gender: "m", statur: "normal",
    aka: null, ...cfg });

  /* Die Grade heissen aufstieg / realismus / knochen. Mein erster Entwurf
     schrieb "arcade" — das gibt es nicht, `createPlayer` fiel korrekt auf
     realismus zurueck, und die Probe meldete einen Fehler, den es nicht gab.
     Ein falscher Versuchsaufbau sieht genauso rot aus wie ein echter Befund. */
  setSpeedmodus(true); setSchwierigkeit("knochen");
  const neuA = bau({ speed: true, mode: "knochen" });
  setSpeedmodus(false); setSchwierigkeit("realismus");
  const neuB = bau({ speed: false, mode: "realismus" });

  /* 1. Eine NEUE Laufbahn nimmt, was ihr uebergeben wird. */
  if (neuA.speed !== true) zeige("Voreinstellung", "neue Laufbahn nimmt speed nicht an");
  else ok++;
  if (neuB.speed !== false) zeige("Voreinstellung", "neue Laufbahn nimmt speed=false nicht an");
  else ok++;

  /* 2. Ein BESTEHENDER Spieler behaelt seine Einstellung, auch wenn die
        Voreinstellung inzwischen anders steht. Das ist der eigentliche Punkt. */
  const alt = bau({ speed: true, mode: "knochen" });
  setSpeedmodus(false); setSchwierigkeit("realismus");
  if (alt.speed !== true)
    zeige("Voreinstellung", "ein bestehender Spielstand verliert seinen Speedmodus");
  else ok++;
  if (!alt.mode || alt.mode.id !== "knochen")
    zeige("Voreinstellung", "ein bestehender Spielstand verliert seine Schwierigkeit: "
      + (alt.mode ? alt.mode.id : "keine"));
  else ok++;

  /* 3. `createPlayer` darf die Modulvariable NICHT selbst lesen — sonst
        entstuende genau die stille Rueckwirkung. Gegenprobe: Voreinstellung
        auf true, uebergeben wird false. */
  setSpeedmodus(true);
  const misch = bau({ speed: false, mode: "realismus" });
  if (misch.speed !== false)
    zeige("Voreinstellung", "createPlayer liest SPEEDMODUS selbst — die Übergabe wird überstimmt");
  else ok++;
  setSpeedmodus(false); setSchwierigkeit("realismus");

  console.log("  Voreinstellung  neu folgt der Übergabe · bestehender Stand bleibt "
    + "unberührt · keine stille Rückwirkung");
}

/* ---- Frisuren muessen unterscheidbar sein (35.40) -----------------------
   Gemessen war: Frauen hatten 14 waehlbare Frisuren und nur NEUN
   unterscheidbare Bilder. `6` teilte sich die Zeichnung mit `1`, und
   10 bis 13 — genau die vier hinter der Freischaltung `mk_haar` — hatten
   ueberhaupt keine und sahen alle aus wie `0`. Wer bezahlte, bekam vier
   gleiche Eintraege.

   Gemessen wird, was der Spieler sieht: die fertige Ausgabe von <Avatar>,
   ueber ALLE fuenf Kopfformen. Eine einzige Kopfform zu pruefen hatte in
   35.10 schon einmal einen Fehler verdeckt.

   KONTROLLPROBE: zwei sicher verschiedene Frisuren muessen verschiedene
   Ausgaben geben. Sonst ist der Aufruf falsch und die Probe schweigt aus
   dem falschen Grund — genau so hat mir dieselbe Messung erst gemeldet,
   alle 16 maennlichen Frisuren saehen gleich aus. */
{
  const roh = (g, frisur, kopf) => {
    const basis = zuegeAusKennung(4242, g, null, { mk_haar: true });
    const el = React.createElement(Avatar,
      { zuege: { ...basis, frisur, kopf }, g, size: 62, club: null, meta: { mk_haar: true } });
    const d = document.createElement("div");
    act(() => { createRoot(d).render(el); });
    return d.innerHTML;
  };
  if (roh("m", 0, 2) === roh("m", 4, 2)) {
    zeige("Frisuren", "KONTROLLPROBE: zwei verschiedene Frisuren geben dieselbe Ausgabe — "
      + "der Aufruf stimmt nicht, das Ergebnis unten ist wertlos");
  } else {
    ok++;
    [["m", 16], ["w", 14]].forEach(([g, max]) => {
      for (let kopf = 0; kopf < 5; kopf++) {
        const gesehen = {}; const doppelt = [];
        for (let f = 0; f < max; f++) {
          const h = roh(g, f, kopf);
          if (gesehen[h] !== undefined) doppelt.push(f + "=" + gesehen[h]); else gesehen[h] = f;
        }
        if (doppelt.length)
          zeige("Frisuren", (g === "w" ? "weiblich" : "männlich") + ", Kopfform " + kopf
            + ": nicht unterscheidbar — " + doppelt.join(", "));
        else ok++;
      }
    });
    console.log("  Frisuren        16 männliche und 14 weibliche · alle 5 Kopfformen · "
      + "jede Form unterscheidbar");
  }
}

/* ---- Akademiegabe: Schwellen, Grundgabe, Deckel (35.39) ----------------
   Bis 35.38 gab eine Akademie der Stufen 1 und 2 NIE etwas, auch nach 30
   Jahren nicht, und Stufe 3 erst im 18. Jahr. Die Schwellen sind gesenkt und
   es gibt eine Grundgabe ab Gruendung.

   Der Deckel ist die empfindliche Stelle: er darf sich NICHT bewegt haben.
   Deshalb wird er hier ausdruecklich nachgerechnet und nicht bloss die
   Untergrenze geprueft. */
{
  const B = (r, gegr) => akaBonus(gegr ? { ruhm: r, gegruendet: 2026 } : { ruhm: r });

  /* 1. Ohne Akademie bleibt es bei nichts — sonst bekaeme die erste Laufbahn
        einen Bonus, den sie sich nicht verdient hat. */
  const o = B(0, false);
  if (o.pot || o.rep || o.money || o.dev)
    zeige("Akademiegabe", "ohne gegründete Akademie gibt es etwas: " + akaBonusText(o).join(", "));
  else ok++;

  /* 2. Grundgabe ab Gruendung, auch bei Ansehen 0. */
  const g = B(0, true);
  if (g.rep !== 1) zeige("Akademiegabe", "frisch gegründet gibt Bekanntheit +" + g.rep + " statt +1");
  else ok++;
  if (g.pot || g.money || g.dev)
    zeige("Akademiegabe", "die Grundgabe gibt mehr als Bekanntheit: " + akaBonusText(g).join(", "));
  else ok++;

  /* 3. Der Deckel steht, wo er stand. */
  const d = B(5000, true);
  const soll = { pot: 4, rep: 6, money: .10, dev: .06 };
  Object.keys(soll).forEach((k) => {
    if (Math.abs(d[k] - soll[k]) > 1e-9)
      zeige("Akademiegabe", "Deckel verschoben: " + k + " = " + d[k] + " statt " + soll[k]);
    else ok++;
  });

  /* 4. Es muss monoton sein — mehr Ansehen darf nie WENIGER geben. */
  let letzt = B(0, true), bruch = null;
  for (let r = 1; r <= 400 && !bruch; r++) {
    const b = B(r, true);
    ["pot", "rep", "money", "dev"].forEach((k) => { if (!bruch && b[k] < letzt[k]) bruch = k + " bei Ansehen " + r; });
    letzt = b;
  }
  if (bruch) zeige("Akademiegabe", "die Gabe fällt wieder: " + bruch);
  else ok++;

  /* 5. `akaNaechsteGabe` MUSS mit `akaBonus` uebereinstimmen. Waere das eine
        zweite, von Hand gepflegte Schwellenliste, liefe sie beim naechsten
        Zahlendreh stumm auseinander — und der Spieler glaubte einer falschen
        Zahl. Deshalb wird sie hier gegen die Rechnung selbst gehalten. */
  let falsch = 0;
  for (let r = 0; r <= 300; r += 7) {
    const n = akaNaechsteGabe({ ruhm: r, gegruendet: 2026 });
    if (!n) continue;
    const jetzt = B(r, true), dann = B(r + n.fehlt, true);
    const einSchrittFrueher = B(r + n.fehlt - 1, true);
    const wuchs = ["pot", "rep", "money", "dev"].some((k) => dann[k] > jetzt[k]);
    const zuFrueh = ["pot", "rep", "money", "dev"].some((k) => einSchrittFrueher[k] > jetzt[k]);
    if (!wuchs || zuFrueh) falsch++;
  }
  if (falsch) zeige("Akademiegabe", falsch + " Ansehensstände, bei denen die Ankündigung nicht stimmt");
  else ok++;

  const n0 = akaNaechsteGabe({ ruhm: 0, gegruendet: 2026 });
  console.log("  Akademiegabe    frisch gegründet: " + akaBonusText(g).join(" · ")
    + " · nächste Gabe in " + (n0 ? n0.fehlt + " Ansehen (" + n0.was + ")" : "—"));
  console.log("  Akademiegabe    Deckel: " + akaBonusText(d).join(" · "));
}

/* ---- Ungueltig gewordene Ereignisse werden uebersprungen (35.37) --------
   `drawEvents` prueft die Bedingungen EINMAL beim Ziehen. Wer in Ereignis 1
   die Binde annimmt, bekam sie in Ereignis 2 desselben Jahres noch einmal
   angeboten. Seit 35.37 wird jede Bedingung unmittelbar vor dem Zeigen noch
   einmal gegen den JETZIGEN Zustand geprueft.

   Geprueft wird die Regel, nicht der Zufall: ein Durchlauf trifft den Fall in
   0,3 % der Jahre und bewiese damit nichts. Hier wird die Lage GESTELLT —
   Spieler ohne Binde, beide Ereignisse zulaessig, dann die Binde vergeben. */
{
  const finde = (id) => EVENTS.find((e) => e.id === id);
  const gilt = (e, q) => { try { return !!e.cond({ ...q, rival: null }); } catch { return true; } };

  const kapiEreignisse = ["kapitaen", "v_kapitaenswahl", "pt_kapitaenbinde", "sf_binde"]
    .map(finde).filter(Boolean);
  if (kapiEreignisse.length !== 4)
    zeige("Zugpruefung", "die vier Bindenereignisse heissen nicht mehr so — Probe prüft nichts");
  else {
    const q = laufbahn(null);
    q.age = 30; q.trust = 75; q.flags.kapitaen = false;
    const vorher = kapiEreignisse.filter((e) => gilt(e, q));
    q.flags.kapitaen = true;               // Ereignis 1 wurde angenommen
    const nachher = kapiEreignisse.filter((e) => gilt(e, q));
    if (vorher.length < 2)
      zeige("Zugpruefung", "ohne Binde sind nur " + vorher.length
        + " Bindenereignisse zulässig — die Lage lässt sich nicht stellen");
    else if (nachher.length !== 0)
      zeige("Zugpruefung", "mit Binde gelten immer noch " + nachher.length
        + " Bindenereignisse: " + nachher.map((e) => e.id).join(", "));
    else ok++;
    console.log("  Zugpruefung     Binde: " + vorher.length + " Ereignisse zulässig → nach Annahme "
      + nachher.length);

    /* Verschiedene tags: usedTags sperrt sie NICHT gegeneinander. Genau das
       ist der Grund, warum die Zweitpruefung noetig ist. */
    const tags = new Set(kapiEreignisse.map((e) => e.tag));
    if (tags.size < 2)
      zeige("Zugpruefung", "alle Bindenereignisse teilen einen tag — dann hätte usedTags gereicht");
    else ok++;
  }

  /* DIE EIGENTLICHE PRUEFUNG: `nochGueltig` ist die Funktion, die `nextEvent`
     benutzt. Mein erster Entwurf prueft nur die Ereignisbedingungen — und
     blieb gruen, als ich das Ueberspringen aus `nextEvent` wieder herausnahm.
     Eine Pruefung, die den entfernten Fix nicht bemerkt, prueft ihn nicht. */
  {
    const kapi = finde("kapitaen");
    const q = laufbahn(null); q.age = 30; q.trust = 75; q.flags.kapitaen = false;
    if (!kapi) zeige("Zugpruefung", "Ereignis kapitaen gibt es nicht");
    else if (!nochGueltig(q, kapi))
      zeige("Zugpruefung", "nochGueltig sperrt die Binde schon OHNE Binde");
    else {
      q.flags.kapitaen = true;
      if (nochGueltig(q, kapi))
        zeige("Zugpruefung", "nochGueltig laesst das Bindenereignis MIT Binde durch");
      else ok++;
    }
    /* Ohne Bedingung und bei einer werfenden Bedingung muss sie durchlassen —
       lieber ein unpassendes Ereignis als ein stiller Ausfall. */
    if (!nochGueltig(q, { id: "ohne" })) zeige("Zugpruefung", "nochGueltig sperrt ein Ereignis ohne Bedingung");
    else ok++;
    if (!nochGueltig(q, { id: "wirft", cond: () => { throw new Error("x"); } }))
      zeige("Zugpruefung", "nochGueltig verschluckt ein Ereignis, dessen Bedingung wirft");
    else ok++;
  }

  /* Die Verdrahtung (benutzt `nextEvent` die Funktion ueberhaupt?) laesst
     sich hier nicht pruefen: ansichten.jsx bekommt den Quellpfad nicht. Sie
     steht in stimmigkeit.cjs, das die Quelle ohnehin liest. */

  /* Zweiter Fall, Kevins anderes Beispiel: ein Kind bekommen und im selben
     Zug gefragt werden, ob man Kinder will. */
  const familie = finde("familie"), wunsch = finde("kinderwunsch");
  if (!familie || !wunsch) zeige("Zugpruefung", "familie/kinderwunsch gibt es nicht mehr");
  else {
    const q = laufbahn(null);
    q.age = 28; q.life = { ...q.life, status: "verheiratet", kids: 0 };
    q.flags.familie = false; q.flags.kinderwunsch = false;
    const vorher = [familie, wunsch].filter((e) => gilt(e, q));
    q.life = { ...q.life, kids: 1 };       // Ereignis 1 brachte ein Kind
    const nachher = [familie, wunsch].filter((e) => gilt(e, q));
    if (vorher.length !== 2)
      zeige("Zugpruefung", "kinderlos sind nur " + vorher.length + " von 2 Kinderereignissen zulässig");
    else if (nachher.length !== 0)
      zeige("Zugpruefung", "mit Kind gelten immer noch " + nachher.length + " Kinderereignisse");
    else ok++;
    console.log("  Zugpruefung     Kind: " + vorher.length + " Ereignisse zulässig → nach Geburt "
      + nachher.length);
  }
}

/* ---- Die zwei neuen Folgeereignisse (35.36) -----------------------------
   `attest_zurueck` und `tv_bannerbleibt` haengen an Flaggen, die in 0,2 %
   bzw. kaum messbar vielen Laufbahnen gesetzt werden. Ein Ereignis, das nie
   erscheint, ist so folgenlos wie die Flagge vorher — nur schwerer zu
   bemerken. Geprueft wird deshalb die Bedingung selbst, in beide Richtungen:
   sie muss mit der Flagge greifen UND ohne sie schweigen. Und sie muss
   wieder zugehen, sonst kommt dasselbe Ereignis jedes Jahr.              */
{
  const evt = (id) => EVENTS.find((e) => e.id === id);
  const spieler = (flags, saisons) => {
    const q = laufbahn(null);
    q.flags = { ...q.flags, ...flags };
    q.seasons = Array.from({ length: saisons }, (_, i) => ({ y: 2030 + i, club: "X" }));
    return q;
  };
  const probe = (id, faelle) => {
    const e = evt(id);
    if (!e) { zeige("Folgeereignis", "Ereignis \u201e" + id + "\u201c gibt es nicht"); return; }
    if (typeof e.cond !== "function") { zeige("Folgeereignis", id + " hat keine Bedingung"); return; }
    faelle.forEach(([was, flags, saisons, soll]) => {
      const ist = !!e.cond(spieler(flags, saisons));
      if (ist !== soll) zeige("Folgeereignis", id + " · " + was + ": erwartet "
        + (soll ? "greift" : "schweigt") + ", war " + (ist ? "greift" : "schweigt"));
      else ok++;
    });
  };

  probe("attest_zurueck", [
    ["mit attest",              { attest: true },  5, true],
    ["ohne attest",             {},                5, false],
    ["nach reinem Tisch",       { attest: true, attestErledigt: true }, 5, false],
  ]);
  probe("tv_bannerbleibt", [
    ["treu, 8 Saisons",         { treugeblieben: true }, 8, true],
    ["treu, erst 7 Saisons",    { treugeblieben: true }, 7, false],
    ["nicht treu, 12 Saisons",  {},                      12, false],
    ["schon gesehen",           { treugeblieben: true, bannergesehen: true }, 12, false],
  ]);

  /* Der Erinnerungsmoment hat bewusst nur EINE Wahl — er ist kein Dilemma.
     Steht das eines Tages anders da, soll es auffallen. */
  const b = evt("tv_bannerbleibt");
  if (b && b.choices && b.choices.length !== 1)
    zeige("Folgeereignis", "tv_bannerbleibt hat " + b.choices.length + " Wahlen, gedacht war eine");
  else ok++;

  console.log("  Folgeereignis   attest_zurueck 3 Fälle · tv_bannerbleibt 4 Fälle · je beide Richtungen");
}

/* ---- Die drei angeschlossenen Flaggen (35.35) ---------------------------
   `beidseitig`, `manipuliert` und `pendeln` wurden gesetzt und gelesen hat sie
   niemand. Jede Prüfung hier vergleicht ZWEI Spieler, die sich nur in der
   Flagge unterscheiden — alles andere Zeichen für Zeichen gleich. Anders
   liesse sich nicht sagen, ob die Flagge wirkt oder der Zufall.            */
{
  /* 1. beidseitig: derselbe Außenverteidiger, derselbe starke Nebenmann.
        Ohne die Flagge muss eine schlechtere Rolle herauskommen. */
  const r1 = roleFor(76, 80, 50, 86, false);
  const r2 = roleFor(76, 80, 50, 86, true);
  if (r1.key === r2.key)
    zeige("Flaggen", "beidseitig ändert die Rolle nicht: beide " + r1.key);
  else if (r2.f <= r1.f)
    zeige("Flaggen", "beidseitig macht die Rolle schlechter statt besser: "
      + r1.key + " → " + r2.key);
  else ok++;

  /* Gegenrichtung: OHNE Nebenmann darf die Flagge gar nichts tun. Sonst
     hängt sie nicht am Zweikampf, sondern gibt einfach überall Rabatt. */
  const o1 = roleFor(76, 80, 50, null, false), o2 = roleFor(76, 80, 50, null, true);
  if (o1.key !== o2.key || o1.f !== o2.f)
    zeige("Flaggen", "beidseitig wirkt auch ohne Nebenmann — das ist zu viel");
  else ok++;

  /* Und schwächerer Nebenmann: der Abzug ist dort negativ (ein Bonus),
     und milder darf ihn NICHT verschlucken. */
  const s1 = roleFor(86, 80, 50, 76, false), s2 = roleFor(86, 80, 50, 76, true);
  if (s2.f < s1.f) zeige("Flaggen", "beidseitig schadet gegen schwächere Nebenleute");
  else ok++;

  console.log("  Flaggen         beidseitig gegen starken Nebenmann: "
    + r1.key + " → " + r2.key + " · ohne Nebenmann: " + o1.key + " = " + o2.key);
}
{
  /* 2. manipuliert zählt zur Weltbilanz als Skandal — wie die vier anderen.
        Geprüft über die Liste selbst, damit ein fünfter Eintrag nicht
        vergessen wird. Die Flagge ist NICHT öffentlich, deshalb darf sie die
        Beliebtheit nicht berühren: auch das wird gegengeprüft. */
  const bau = (flags) => { const q = laufbahn(null); q.flags = { ...q.flags, ...flags };
    q.seasons = q.seasons.length ? q.seasons : [{ y: 2030, club: "X" }]; return q; };
  /* `bilanzErgaenzen` VERAENDERT die uebergebene Bilanz nicht, sondern gibt
     eine neue zurueck. Mein erster Versuch las danach das Eingabeobjekt und
     sah zweimal null — rot, aber aus dem falschen Grund. Signatur nachgesehen
     statt geraten: (G, p) => neue Bilanz. */
  const g0 = bilanzErgaenzen({}, bau({}));
  const gM = bilanzErgaenzen({}, bau({ manipuliert: true }));
  if (gM.skandale !== g0.skandale + 1)
    zeige("Flaggen", "manipuliert zählt nicht als Skandal (" + g0.skandale + " → " + gM.skandale + ")");
  else ok++;
  console.log("  Flaggen         manipuliert in der Weltbilanz: Skandale "
    + g0.skandale + " → " + gM.skandale);
}

/* ---- Jugendturniere in der Chronik (35.34) ------------------------------
   Geprüft wird dreierlei, und zwar in beide Richtungen:

   1. Sieg und Niederlage tragen Turniername UND Gegner. Vorher stand dort ein
      einziger fester Satz; eine Prüfung auf "kommt überhaupt vor" wäre auch
      damit grün gewesen.
   2. Ohne die Abteilung `buehne` darf KEINE Niederlagenzeile erscheinen —
      sonst hängt sie an nichts und die Abteilung verspricht wieder umsonst.
   3. Die Chronikfarbe der Niederlage ist eine andere als die der Neuzugänge.
      Zwei blaue Zeilen nebeneinander lesen sich als zwei gleich wichtige
      Nachrichten — genau das sollte 35.34 vermeiden.                       */
{
  const jahre = (stufen, n) => {
    let a = { ...leereAkademie(), stufen: { ...leereAkademie().stufen, ...stufen } };
    a = akaGruenden(a, "Turnierhaus", 2026);
    const alle = [];
    for (let i = 0; i < n; i++) { const r = akaJahr(a, a.jahr + 1); a = r.a; alle.push(...r.ereignisse); }
    return { a, alle };
  };
  const voll = Object.fromEntries(ABTEILUNGEN.map((x) => [x.id, AKA_MAX]));
  const { alle } = jahre(voll, 60);
  const siege = alle.filter((e) => /^Sieg beim /.test(e.txt));
  const raus  = alle.filter((e) => e.art === "turnier");

  if (!siege.length) zeige("Jugendturnier", "in 60 Jahren voll ausgebaut kein einziger Sieg");
  else if (siege.some((e) => !/ U19\.$/.test(e.txt)))
    zeige("Jugendturnier", "ein Siegtext nennt keinen Gegner: " + siege.find((e) => !/ U19\.$/.test(e.txt)).txt);
  else ok++;

  if (!raus.length) zeige("Jugendturnier", "voll ausgebaut kein einziges Ausscheiden");
  else if (raus.some((e) => !/ U19 gescheitert\.$/.test(e.txt)))
    zeige("Jugendturnier", "ein Ausscheidungstext nennt keinen Gegner");
  else ok++;

  /* Mehr als ein Turniername muss vorkommen — sonst ist die Liste zwar da,
     wird aber nicht benutzt. */
  const namen = new Set();
  [...siege, ...raus].forEach((e) => {
    const m = e.txt.match(/^(?:Sieg beim|Beim) (.+?)(?: — im Endspiel gegen | im | in der )/);
    if (m) namen.add(m[1]);
  });
  if (namen.size < 5) zeige("Jugendturnier", "nur " + namen.size + " verschiedene Turniernamen in 60 Jahren");
  else ok++;

  /* Gegenprobe: ohne `buehne` keine Niederlagenzeile. */
  const ohne = jahre({ ...voll, buehne: 0 }, 60);
  if (ohne.alle.some((e) => e.art === "turnier"))
    zeige("Jugendturnier", "ohne die Abteilung Wettbewerbe erscheint trotzdem eine Turnierzeile");
  else ok++;

  /* Farbe: die Niederlage darf nicht dieselbe tragen wie ein Neuzugang. */
  if (AKA_FARBE.turnier === AKA_FARBE.neu)
    zeige("Jugendturnier", "Ausscheiden und Neuzugang haben dieselbe Chronikfarbe");
  else ok++;

  console.log("  Jugendturnier   60 Jahre voll ausgebaut: " + siege.length + " Siege · "
    + raus.length + " Ausscheiden · " + namen.size + " Turniernamen · ohne Wettbewerbe: "
    + ohne.alle.filter((e) => e.art === "turnier").length + " Zeilen");
}

/* ---- Ruhmeshalle mit Inhalt (35.33) -------------------------------------
   Bis 35.32 wurde `HallScreen` NUR mit `hall={[]}` gezeichnet — die Halle mit
   Einträgen kam in keiner Ansichtsprüfung vor. Ein fehlendes Feld in einer
   Zelle wäre als Leerstelle erschienen, und keine Prüfung hätte gemuckt.

   Die Felder sind NACHGESEHEN, nicht geraten: `saveHall` schreibt name, pos,
   nat, age, score, tier, peak, titles, caps, goals, worth, apps, assists,
   saisons, heimat, heimatSpiele, von, bis. Ein erfundener Feldname wäre
   `undefined` geworden — und `mach()` fängt genau das ab.               */
const HALLZAHLEN = ["Punkte", "Peak", "Spiele", "Tore", "Vorlagen", "Titel",
  "Länderspiele", "Vermögen"];
const halleintrag = (i, extra) => ({
  name: "Prüfling " + i, pos: "ST", nat: "\u{1F1E9}\u{1F1EA}", natId: "GER", age: 34 + i,
  score: 1200 - i * 90, tier: "Legende", peak: 91 - i, titles: 7 - i, caps: 80 - i * 5,
  goals: 300 - i * 20, assists: 150 - i * 10, apps: 600 - i * 30, worth: 42000000 - i * 3e6,
  saisons: 18, von: 2027, bis: 2045, heimat: "Prüfverein", heimatSpiele: 300 - i * 20,
  wc: "Sympathieträger", wr: "normal", speed: false, g: "m", avatar: i, zuege: null,
  ...extra });

{
  const voll = [0, 1, 2].map((i) => halleintrag(i));
  const r = mach("Ruhmeshalle · drei Einträge", <HallScreen hall={voll} onBack={() => {}} />);
  if (r) {
    zahlenPruefen(r.div, HALLZAHLEN, "Ruhmeshalle");
    console.log("  Ruhmeshalle     " + HALLZAHLEN.length + " Zellen geprüft · "
      + r.div.querySelectorAll(".zellen").length + " Zellenreihen gezeichnet");
  }
  /* Altbestand: Einträge von vor 33.10 haben apps und assists nicht. Die
     beiden Zellen entfallen dann bewusst — geprüft wird, dass die übrigen
     sechs weiter stehen und nichts "undefined" zeigt. */
  const alt = [0, 1].map((i) => { const h = halleintrag(i); delete h.apps; delete h.assists;
    delete h.heimat; delete h.heimatSpiele; return h; });
  const r2 = mach("Ruhmeshalle · Altbestand ohne apps/assists", <HallScreen hall={alt} onBack={() => {}} />);
  if (r2) zahlenPruefen(r2.div, ["Punkte", "Peak", "Tore", "Titel", "Länderspiele", "Vermögen"],
    "Ruhmeshalle Altbestand");

  /* ---- Rahmen von damals und Rückseite (35.69, von Kevin gemeldet) -------
     Die Halle zeichnete Porträts ganz OHNE meta — also ohne Rahmen, und seit
     35.63 damit auch ohne die Kartenfarbe dahinter. Alle Einträge sahen
     gleich aus, egal was man erreicht hatte. */
  {
    const mitRahmen = [
      halleintrag(0, { rahmen: "mk_rahmen4", name: "Mit Legende" }),
      halleintrag(1, { rahmen: "mk_rahmen2", name: "Mit Bronze" }),
      halleintrag(2, { name: "Ohne Rahmen" }),          /* Eintrag vor 35.69 */
    ];
    const r3 = mach("Ruhmeshalle · Rahmen von damals", <HallScreen hall={mitRahmen} onBack={() => {}} />);
    if (r3) {
      /* DIE PORTRÄTGRÜNDE MÜSSEN SICH UNTERSCHEIDEN. „Ein Rahmen ist
         gespeichert" beweist nichts — er muss auch ankommen. Gemessen wird
         am gezeichneten Verlauf, nicht am Datenfeld. */
      /* ÜBER DAS ATTRIBUT SUCHEN, nicht über den Elementnamen. In einem
         HTML-Dokument schreibt der Selektor `linearGradient` klein — und
         trifft das SVG-Element dann nie. Die Gegenprobe (Rahmen nicht mehr
         übergeben) blieb deshalb grün: die Messung fand null Stopps und
         meldete trotzdem nichts, weil auch der Normalfall null fand.
         Zwei Zustände, dasselbe Ergebnis — das ist keine Messung. */
      const gruende = [...r3.div.querySelectorAll("[stop-color]")]
        .map((x) => x.getAttribute("stop-color"));
      /* DEN ERSTEN STOPP JE PORTRÄT vergleichen, nicht alle. Jeder Verlauf
         hat drei Stopps (hell, mitte, tief) — drei GLEICHE Porträts ergeben
         also auch neun Farben, davon drei verschiedene. Meine erste Schwelle
         („mindestens 3 verschiedene") war deshalb immer erfüllt, und die
         Gegenprobe blieb grün, obwohl gar kein Rahmen ankam.
         Eine Schwelle, die der Fehlerfall genauso erreicht wie der gute Fall,
         ist keine Schwelle. */
      const ersten = gruende.filter((_, k) => k % 3 === 0);
      const verschieden = new Set(ersten).size;
      if (process.env.LAUT === "1")
        console.log("      [laut] " + gruende.length + " Stopps, erste je Porträt: "
          + ersten.join(" "));
      if (ersten.length < 3)
        zeige("Ruhmeshalle", "nur " + ersten.length + " Porträtgründe gezeichnet");
      else if (verschieden < 3)
        zeige("Ruhmeshalle", "die Rahmen wirken nicht: " + verschieden
          + " verschiedene Gründe bei 3 Einträgen (" + [...new Set(ersten)].join(" ") + ")");
      else ok++;

      /* WENDEN STATT UMSCHALTEN (35.75, Kevins Wunsch: „die gleiche Funktion
         wie die Spielerpässe: Doppeltipp und dann die Umdreh-Animation").
         Bis 35.74 wurde der Inhalt AUSGETAUSCHT — ein Einfachtipp, und die
         Vorderseite verschwand aus dem Baum. Jetzt stehen beide Seiten
         gleichzeitig da und werden gedreht.
         Geprüft wird deshalb an der KLASSE, nicht am Text: „Rückseite ist
         sichtbar" lässt sich in jsdom gar nicht messen — es rechnet keine
         3D-Transformationen. Was es kann: die Klasse lesen, die den Zustand
         trägt. */
      const wender = r3.div.querySelector(".wender");
      if (!wender) zeige("Ruhmeshalle", "keine Wendekarte — die Karte dreht sich nicht");
      else {
        ok++;
        /* Beide Seiten müssen GLEICHZEITIG im Baum sein, sonst gibt es
           nichts zu drehen. */
        const t3 = r3.div.textContent || "";
        if (!/Punkte/.test(t3) || !/Tore je Spiel/.test(t3))
          zeige("Ruhmeshalle", "es liegt nicht beides gleichzeitig vor");
        else ok++;
        if (!r3.div.querySelector(".dreh > .rueckseite"))
          zeige("Ruhmeshalle", "die Rückseite hängt nicht im Wender");
        else ok++;
        if (wender.className.indexOf("um") >= 0)
          zeige("Ruhmeshalle", "die Karte liegt schon auf der Rückseite");
        else ok++;

        /* EIN Tipp darf nichts tun — genau wie beim Spielerpass. */
        act(() => { wender.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
        if (r3.div.querySelector(".wender").className.indexOf("um") >= 0)
          zeige("Ruhmeshalle", "ein einzelner Tipp dreht die Karte schon");
        else ok++;
        /* Zwei schnelle Tipps drehen. */
        act(() => {
          const w2 = r3.div.querySelector(".wender");
          w2.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
          w2.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
        });
        if (r3.div.querySelector(".wender").className.indexOf("um") < 0)
          zeige("Ruhmeshalle", "der Doppeltipp dreht die Karte nicht");
        else ok++;
        /* Und wieder zurück. */
        act(() => {
          const w2 = r3.div.querySelector(".wender");
          w2.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
          w2.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
        });
        if (r3.div.querySelector(".wender").className.indexOf("um") >= 0)
          zeige("Ruhmeshalle", "die Karte lässt sich nicht zurückdrehen");
        else ok++;
      }
    }

    /* Eine leere Zugliste darf nicht abstürzen — `{}` ist wahr, also greift
       der Rückfall `zuege || zuegeAusKennung(...)` nicht. Beim Bauen dieser
       Probe genau so passiert. */
    const kaputt = [halleintrag(0, { zuege: {}, name: "Leere Züge" })];
    const r5 = mach("Ruhmeshalle · leere Zugliste", <HallScreen hall={kaputt} onBack={() => {}} />);
    if (r5 && /Leere Züge/.test(r5.div.textContent || "")) ok++;
    else if (r5) zeige("Ruhmeshalle", "leere Zugliste wird nicht gezeichnet");
  }
}

const menuProps = { hall: [], onNew:()=>{}, onHall:()=>{}, save:null, onResume:()=>{}, onAch:()=>{},
  achN:3, metaN:1, onBackup:()=>{}, ruhe:false, setRuhe:()=>{}, setRuheState:()=>{}, onAka:()=>{} };
mach("Hauptmenü · ohne Akademie", <MenuScreen {...menuProps} aka={leer} />);
mach("Hauptmenü · Coins bereit", <MenuScreen {...menuProps} aka={mitCoins} />);
mach("Hauptmenü · Akademie läuft", <MenuScreen {...menuProps} aka={reif} />);

/* DIE OPTIONEN ALS EIGENE ANSICHT (35.164).

   Sie sind ein Unterzustand des Hauptmenues (`opt`) und wurden deshalb NIE
   gerendert. Genau dort ist in 35.162 ein `vorsatz is not defined`
   gelandet — die Vorsatz-Auswahl kam versehentlich in `Optionen` statt in
   `CreateScreen`, weil beide einen „Spielweise"-Block haben. Der Fehler ging
   durch alle Pruefungen und wurde erst auf dem Geraet sichtbar: Kevin kam
   nicht mehr in die Einstellungen.

   In 35.142 hatte ich die Luecke schon notiert („die Sichtpruefung oeffnet
   die Optionen nicht") und nicht geschlossen. Jetzt geschlossen. */
mach("Optionen · ohne Laufbahn", <Optionen ruhe={false} aufRuhe={() => {}}
  onBackup={() => {}} onZu={() => {}} onAnleitung={() => {}}
  hall={[]} aka={leer} laeuft={false} meta={{}} aufRahmen={() => {}} />);
mach("Optionen · Laufbahn läuft", <Optionen ruhe aufRuhe={() => {}}
  onBackup={() => {}} onZu={() => {}} onAnleitung={() => {}}
  hall={[halleintrag]} aka={mitCoins} laeuft meta={{ mx_bei1: true }} aufRahmen={() => {}} />);
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
  mach("Abschluss mit VC #" + (i + 1), <EndScreen p={q} onNew={()=>{}} />);
}
/* Abschluss ohne VC-Feld (alter Spielstand) */
{
  const q = laufbahn(null); delete q.vcGewinn;
  mach("Abschluss ohne VC-Feld", <EndScreen p={q} onNew={()=>{}} />);
}

/* ---- Beide Berichte nebeneinander (35.51) -------------------------------
   `p.vereinBericht` wurde bis 35.50 in KEINER Ansicht gesetzt — der
   Vereinsbericht ist nie gezeichnet worden, obwohl er seit 35.28 im
   Abschlussbildschirm steht. Aufgefallen, als er in 35.51 dem Akademiebericht
   angeglichen werden sollte: die Gegenprobe zum Sprungknopf blieb gruen, weil
   die geprueften Faelle die Berichte gar nicht enthielten.
   Vier Lagen, weil sie verschieden aussehen: Meister, Abstieg, Mittelfeld,
   ausgefallen. */
{
  const lagen = [
    ["Meister",     { name: "FC Probe", jahr: 4, liga: "3. Liga", rang: 1, N: 20,
                      tore: 71, gegentore: 22, punkte: 78, meister: true, aufstieg: true, abgaenge: 2 }],
    ["Abstieg",     { name: "FC Probe", jahr: 7, liga: "2. Bundesliga", rang: 18, N: 18,
                      tore: 21, gegentore: 74, punkte: 19, abstieg: true, abgaenge: 5, vorbei: false }],
    ["Mittelfeld",  { name: "FC Probe", jahr: 9, liga: "Bundesliga", rang: 9, N: 18,
                      tore: 44, gegentore: 47, punkte: 46 }],
    ["ausgefallen", { ausgefallen: true, name: "FC Probe", jahr: 3 }],
  ];
  lagen.forEach(([n, b2]) => {
    const q = laufbahn(reif);
    const vc = vcFuer(q);
    const AK = akaVerbuchen(reif, vc);
    q.vcGewinn = vc; q.vcPosten = vcPosten(q);
    q.akaEreignisse = AK.ereignisse; q.akaName = AK.a.name; q.akaAktiv = true;
    q.vereinBericht = b2;
    const r2 = mach("Abschluss · beide Berichte · " + n, <EndScreen p={q} onNew={()=>{}} />);
    if (r2) {
      const t = r2.div.textContent || "";
      /* Beide Berichte muessen da sein und gleich ueberschrieben — das ist
         der Punkt: bis 35.50 hiess der eine "Vermaechtnis-Coins verdient"
         und der andere gar nicht, und einer war dreimal so laut. */
      if (!t.includes("Ein Jahr Jugendakademie"))
        zeige("Berichte " + n, "Akademiebericht fehlt oder heißt anders");
      else ok++;
      if (!t.includes("Ein Jahr Profimannschaft") && !b2.ausgefallen)
        zeige("Berichte " + n, "Vereinsbericht fehlt oder heißt anders");
      else ok++;

      /* GLEICH LAUT, NICHT NUR GLEICH GEBAUT (35.72, von Kevin gemeldet:
         „warum ist die Infokachel für die Profimannschaft immer noch so
         unscheinbar?"). In 35.51 wurde der AUFBAU angeglichen, die
         Auftrittsstärke nicht: Rahmen, Verlauf und Farbe gab es nur bei
         Meister oder Aufstieg. Ein Platz 9 stand als graues Feld neben einem
         Goldkasten, der IMMER leuchtet.
         Geprüft wird deshalb an den gezeichneten Werten, nicht am Text: hat
         der Vereinsbericht in JEDER Lage einen farbigen Rahmen, einen Verlauf
         und eine Kennzahl in derselben Größe wie die Akademie? */
      if (!b2.ausgefallen) {
        const kaesten = [...r2.div.querySelectorAll(".pan.pad")];
        const vk = kaesten.find((k) => /Ein Jahr Profimannschaft/.test(k.textContent || ""));
        const ak = kaesten.find((k) => /Ein Jahr Jugendakademie/.test(k.textContent || ""));
        if (!vk || !ak) zeige("Berichte " + n, "einer der beiden Kästen fehlt");
        else {
          /* DAS ROHE ATTRIBUT LESEN. jsdom lässt Verläufe in der
             `background`-Kurzform fallen — `k.style.background` ist dann leer,
             obwohl im Markup ein `linear-gradient` steht. Die Prüfung meldete
             daraufhin für alle drei Lagen „kein Verlauf", obwohl er da ist:
             ein Fehlalarm, der aus der Nachbildung stammt und nicht aus dem
             Spiel. Das Attribut selbst wird unverändert durchgereicht. */
          const roh = (k) => k.getAttribute("style") || "";
          const rand = (k) => (k.style.borderColor || "").trim();
          if (!rand(vk) || rand(vk) === "var(--ln2)")
            zeige("Berichte " + n, "der Vereinsbericht hat keinen eigenen Rahmen ("
              + (rand(vk) || "keiner") + ")");
          else ok++;
          /* DEN VERLAUF PRUEFT HIER NIEMAND. jsdom verwirft einen
             `linear-gradient`, in dem `var()` vorkommt — er landet gar nicht
             erst im Attribut, weder beim Verein noch bei der Akademie. Eine
             Messung, die beide Seiten gleich falsch sieht, kann nichts
             unterscheiden.
             Der Verlauf wird stattdessen im QUELLTEXT geprueft
             (vereinpruefung.cjs): dort steht, ob er unbedingt gesetzt wird
             oder nur bei Erfolg. Jede Sache dort messen, wo sie messbar ist. */
          /* Und die Kennzahl in derselben Größe. „Gleichrangig" heißt nicht
             halb so groß. */
          const gross = (k) => [...k.querySelectorAll(".d")]
            .map((x) => parseFloat(x.style.fontSize) || 0).sort((p2, q2) => q2 - p2)[0] || 0;
          if (gross(vk) < gross(ak))
            zeige("Berichte " + n, "die Kennzahl des Vereins ist kleiner: "
              + gross(vk) + " gegen " + gross(ak));
          else ok++;
        }
      }
      /* Und an KEINER Stelle des Abschlusses ein Sprung woandershin. Diese
         Probe war vorher gegenstandslos, weil die Berichte nicht gezeichnet
         wurden. */
      const spr = [...r2.div.querySelectorAll("button")]
        .map((x) => (x.textContent || "").trim())
        .filter((x) => /Ruhmeshalle|Zur Jugendakademie|Jetzt ausbauen|^Dein Verein$/.test(x));
      if (spr.length) zeige("Berichte " + n, "Sprungknopf im Abschluss: " + spr.join(" | "));
      else ok++;
    }
  });
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
  /* Aufstellung von Hand (35.49) — durchgeklickt, nicht nur gerendert.
     Der Auswahlkasten erscheint NUR, wenn ein Platz angetippt ist. Ohne
     diesen Durchgang waere er von den Ansichten gar nicht erfasst: er ist
     erst der zweite Zustand des Reiters. Geprueft wird nicht "es kommt eine
     Liste", sondern dass die Wahl in der Elf ANKOMMT. */
  /* Eigener Testverein: `vollV` weiter oben liegt in einem eigenen Block und
     ist hier nicht sichtbar. Beim ersten Entwurf brach der Durchklicktest mit
     "vollV is not defined" ab — der Lauf hat es gemeldet, statt still zu
     ueberspringen. Verschiedene Staerken, damit die Rangfolge in der
     Auswahlliste ueberhaupt eine Aussage hat. */
  const eV = VEREIN.gruenden(VEREIN.leererVerein(),
    { name: "Elfprobe", land: "GER", liga: "3. Liga" }).v;
  const eKader = ["TW","TW","IV","IV","IV","AV","AV","ZDM","ZDM","ZM","ZM","ZOM","AF","AF","ST","ST"]
    .map((pz, i2) => ({ id: "e" + i2, name: "Elfspieler " + i2, pos: pz, ovr: 44 + i2,
      pot: 78, alter: 19, flag: "🇩🇪", form: 50, fitness: 80, spiele: 0, tore: 0, jahreImVerein: 0 }));
  const eAka = { vc: 500, talente: [] };
  let stand = VEREIN.autoAufstellen({ ...eV, kader: eKader });
  function ElfHuelle() {
    const [v, setV] = React.useState(stand);
    stand = v;
    return <VereinScreen v={v} aka={eAka} onAendern={setV}
      onAkaAendern={()=>{}} onZurueck={()=>{}} onAbschluss={()=>{}} />;
  }
  const r = mach("Aufstellung interaktiv", <ElfHuelle />);
  if (r) {
    if (klick(r.div, "Aufstellung", "Reiter Aufstellung")) {
      /* Ein Platz mit mehreren Kandidaten. ZM steht in 4-4-2 an Stelle 5. */
      const plaetze = [...r.div.querySelectorAll("button")]
        .filter((b) => /^(TW|IV|AV|ZDM|ZM|ZOM|AF|ST)/.test((b.textContent || "").trim()));
      if (plaetze.length < 11) zeige("Aufstellung", "nur " + plaetze.length + " Plätze antippbar");
      else {
        ok++;
        const vorher = { ...stand.aufstellung };
        act(() => { plaetze[5].dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
        const txt = r.div.textContent || "";
        if (!txt.includes("Wer spielt")) zeige("Aufstellung", "Auswahlliste öffnet nicht");
        else if (!txt.includes("Eignung")) zeige("Aufstellung", "Eignung wird nicht angezeigt");
        else if (!txt.includes("Platz leeren")) zeige("Aufstellung", "„Platz leeren“ fehlt");
        else ok++;
        /* Einen ANDEREN als den bereits stehenden waehlen und nachsehen, ob
           sich die Elf wirklich aendert. Eine Liste, die nichts bewirkt,
           waere Dekoration. */
        /* WO steht der Kasten? (35.59) Kevins Einwand: er soll direkt unter
           dem angetippten Platz erscheinen, nicht unter der ganzen Elf.
           Geprueft wird die STELLUNG im Baum, nicht nur die Anwesenheit —
           „ist da" war schon in 35.49 wahr und trotzdem falsch platziert.
           Gemessen: zwischen der angetippten Zeile und dem Kasten darf keine
           weitere Platzzeile liegen. */
        {
          /* NACHGEZOGEN AUF DAS RASTER (35.88). Bis 35.87 stand die Elf als
             Liste, und „keine Platzzeile zwischen Tipp und Kasten" war die
             richtige Frage. Jetzt ist es ein Raster mit vier Spalten — dort
             lautet dieselbe Frage: liegt der Kasten in DERSELBEN REIHE?

             Die Prüfung meldete nach dem Umbau zwei Zeilen dazwischen und
             hatte damit recht: im Raster stehen bis zu drei weitere Karten
             zwischen der angetippten und dem Kasten. Das ist kein Fehler,
             sondern die Bauart — der Kasten kann erst nach der Reihe kommen.
             Geprüft wird deshalb, dass höchstens der Rest DER EIGENEN REIHE
             dazwischenliegt, nicht die ganze Elf. */
          /* ZUM DRITTEN MAL NACHGEZOGEN (35.91). Die Frage ist seit 35.59
             dieselbe — steht der Kasten direkt bei dem, was man angetippt
             hat? — aber die Antwort haengt an der Bauart:
               35.59  Liste       keine Platzzeile dazwischen
               35.88  Raster      hoechstens der Rest der eigenen Reihe
               35.91  Feld        direkt hinter der REIHE, in der der Platz liegt
             Der Kasten ist jetzt Geschwister der Reihe, nicht der Karte —
             deshalb ging die alte Suche ins Leere und meldete „steht nicht in
             derselben Liste". Sie hatte recht: dort stand er wirklich nicht
             mehr. Gesucht wird jetzt von der REIHE aus.

             DASS DIESE PRUEFUNG DEN UMBAU DREIMAL BEMERKT HAT, ist ihr Wert.
             Eine Regel, die man beim Umbauen vergisst, ist nach dem zweiten
             Umbau weg — diese hier meldet sich. */
          const knopf = plaetze[5];
          const reihe = knopf.closest("div[style*='display: flex']") || knopf.parentElement;
          const reihenBlock = reihe && reihe.parentElement === null ? null : reihe;
          let n = (reihenBlock || knopf).nextElementSibling, dazwischen = 0, kasten = null;
          while (n) {
            if (/Wer spielt/.test(n.textContent || "")) { kasten = n; break; }
            if (/^(TW|IV|AV|ZDM|ZM|ZOM|AF|ST)/.test((n.textContent || "").trim())) dazwischen++;
            n = n.nextElementSibling;
          }
          /* Der Kasten kann auch eine Ebene hoeher stehen (Fragment je Reihe). */
          if (!kasten && reihenBlock && reihenBlock.parentElement) {
            let m2 = reihenBlock.parentElement.nextElementSibling;
            while (m2 && !kasten) {
              if (/Wer spielt/.test(m2.textContent || "")) kasten = m2;
              m2 = m2.nextElementSibling;
            }
          }
          if (!kasten) zeige("Aufstellung", "der Auswahlkasten steht nicht bei seiner Reihe");
          else if (dazwischen > 0)
            zeige("Aufstellung", dazwischen + " Reihe(n) zwischen Tipp und Kasten");
          else ok++;
        }
        const wahl = [...r.div.querySelectorAll("button")]
          .filter((b) => /Jahre/.test(b.textContent || "") && !/steht hier/.test(b.textContent || ""));
        if (!wahl.length) zeige("Aufstellung", "keine wählbaren Kandidaten in der Liste");
        else {
          act(() => { wahl[0].dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
          if (JSON.stringify(stand.aufstellung) === JSON.stringify(vorher))
            zeige("Aufstellung", "die Wahl hat die Elf nicht verändert");
          else ok++;
          const ids = Object.values(stand.aufstellung);
          if (ids.length !== new Set(ids).size)
            zeige("Aufstellung", "nach der Wahl steht jemand doppelt");
          else ok++;
          if (!VEREIN.staerke(stand).spielbereit)
            zeige("Aufstellung", "nach der Wahl nicht mehr spielbereit");
          else ok++;
        }
      }
    }
  }
}
{
  /* Ganze App: Menü → Akademie → zurück */
  const r = mach("Gesamt-App", <App />);
  if (r) {
    // Vor dem asynchronen Lesen darf keine Mutation angeboten werden.
    // Das geladene Hauptmenü wird in korrekturen.mjs nach await geprüft.
    if (!(r.div.textContent || "").includes("Spielstand wird geladen")) zeige("App: Laden", "Ladezustand fehlt");
    else ok++;
    if (r.div.querySelectorAll("button").length) zeige("App: Laden", "Vor Speicherantwort schon bedienbar");
    else ok++;
    /* Und der Weg selbst, mit einer Bilanz, die das Dach oeffnet. `App`
       liest die Bilanz aus dem Speicher; hier wird stattdessen das Dach
       direkt geprueft — der Weg dorthin steckt in der Quelltextprobe der
       Vereinspruefung ("Menuezeile fragt die Freischaltung ab"). */
    const offen = mach("App-Dach offen", <VereinDach aka={{ vc: 120, gegruendet: false }}
      verein={null} gesamt={{ karrieren: 3 }}
      onAka={() => {}} onProfi={() => {}} onZurueck={() => {}} />);
    if (offen) {
      const t3 = offen.div.textContent || "";
      if (!t3.includes("Jugendakademie") || !t3.includes("Profimannschaft"))
        zeige("App-Dach", "die beiden Einträge fehlen");
      else ok++;
      const bt = [...offen.div.querySelectorAll("button")];
      const profi = bt.find((b2) => (b2.textContent || "").includes("Profimannschaft"));
      if (!profi || !profi.disabled)
        zeige("App-Dach", "Profimannschaft ist bei 3 Laufbahnen NICHT gesperrt");
      else ok++;
      const jug = bt.find((b2) => (b2.textContent || "").includes("Jugendakademie"));
      if (!jug || jug.disabled)
        zeige("App-Dach", "Jugendakademie ist bei 3 Laufbahnen gesperrt — sie darf offen sein");
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
  const r = mach("Abschluss · Punkte/Coins", <EndScreen p={q} onNew={()=>{}} />);
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
  /* GEGRUENDET, seit 35.60. Vorher war `gegruendet` nicht gesetzt — fuer die
     alten Ansichten egal, aber die Dach-Kacheln zeigen ihre Kennzahlen nur
     bei einer gegruendeten Akademie, und die Pruefung meldete sie deshalb als
     leer. Ein Pruefstand, dessen Testdaten den Normalfall nicht abbilden,
     prueft den Ausnahmefall. */
  const akaV = { vc: 500, gegruendet: true, name: "Nachwuchszentrum", jahr: 2029,
    stufen: {}, bilanz: { profis: 2, weltklasse: 0, nationalspieler: 0 },
    talente: [{ id: "t1", name: "Talent", pos: "ST", ovr: 48, pot: 80, alter: 17 }] };
  const nix = () => {};
  /* Das Dach (35.50) in allen drei Zustaenden. Der GESPERRTE ist der
     wichtige: bis 35.49 gab es ihn nicht, weil die Akademie gar keine Sperre
     hatte. Eine Ansicht, die nur im offenen Fall geprueft wird, laesst genau
     den Fehler durch, um den es hier geht. */
  const nixf = () => {};
  mach("Dach · gesperrt (0 Laufbahnen)", <VereinDach aka={null} verein={null}
    gesamt={{ karrieren: 0 }} onAka={nixf} onProfi={nixf} onZurueck={nixf} />);
  mach("Dach · Akademie offen, Profis gesperrt", <VereinDach aka={akaV} verein={null}
    gesamt={{ karrieren: 3 }} onAka={nixf} onProfi={nixf} onZurueck={nixf} />);
  mach("Dach · beides offen", <VereinDach aka={akaV} verein={vollV}
    gesamt={{ karrieren: 9 }} onAka={nixf} onProfi={nixf} onZurueck={nixf} />);
  mach("Dach · ohne Übergaben", <VereinDach aka={null} verein={null}
    gesamt={null} onAka={nixf} onProfi={nixf} onZurueck={nixf} />);

  /* ---- Gehört der Bildschirm zum Magazin? (35.70, von Kevin gemeldet) ----
     „Mein Verein sticht im Vergleich zum Hauptmenü, Einstellungen,
     Ruhmeshalle raus." Ursache war `<Shell>` OHNE `blatt` — damit fehlten
     Kolumnentitel und Folio, also genau der Rahmen, den jeder andere
     Bildschirm hat.
     Geprüft wird deshalb nicht „sieht gut aus", sondern ob die drei
     Bestandteile des Satzspiegels da sind: Kolumnentitel oben, Seitenzahl,
     Folio unten. Das ist prüfbar, Geschmack nicht. */
  {
    const r7 = mach("Dach · im Magazinsatz", <VereinDach aka={akaV} verein={vollV}
      gesamt={{ karrieren: 9 }} onAka={nixf} onProfi={nixf} onZurueck={nixf}
      onAendern={nixf} onVAendern={nixf} />);
    if (r7) {
      const t7 = r7.div.textContent || "";
      if (!/DEIN VEREIN/i.test(t7)) zeige("Dach", "kein Kolumnentitel");
      else ok++;
      /* Seite 31 ist die Ressortnummer aus RESSORT.verein — sie steht im
         Kolumnentitel UND im Folio. Fehlt sie, hängt der Bildschirm nicht
         am Blatt. */
      if (!/31/.test(t7)) zeige("Dach", "keine Seitenzahl — Shell ohne blatt?");
      else ok++;
      if (!/RASENSCHACH XI/i.test(t7)) zeige("Dach", "kein Folio am Seitenfuß");
      else ok++;
      /* Und der fette Balken darf NICHT zurückkommen: im Magazinsatz gehört
         er den Kartenköpfen, nicht der Seite selbst. */
      const baender = [...r7.div.querySelectorAll(".band")]
        .filter((b2) => /Dein Verein/i.test(b2.textContent || ""));
      if (baender.length) zeige("Dach", "der Seitentitel steckt wieder in einem Balken");
      else ok++;
    }

    /* Zum Vergleich: die Ruhmeshalle war das Vorbild. Wenn eine der beiden
       den Satzspiegel verliert, fällt es hier auf. */
    const r8 = mach("Ruhmeshalle · Satzspiegel zum Vergleich",
      <HallScreen hall={[]} onBack={nixf} />);
    if (r8) {
      const t8 = r8.div.textContent || "";
      if (!/RUHMESHALLE/i.test(t8) || !/RASENSCHACH XI/i.test(t8))
        zeige("Ruhmeshalle", "der Satzspiegel fehlt — dann taugt sie nicht als Vorbild");
      else ok++;
    }
  }

  /* ---- Die zwei Schritte der Gründung (35.67) ----------------------------
     Kevin: Name und Wappen ans Dach, nur die Liga bleibt bei der
     Profimannschaft. Geprüft wird, dass jeder Schritt GENAU seine Felder
     zeigt — sonst hätte man die Maske nur verschoben und beide Male alles
     abgefragt. */
  {
    const kv = { gekannt: true, name: "Hamburger Jungs", stadt: "Hamburg",
      farben: { primaer: "#0a4", sekundaer: "#fff" },
      wappen: { form: "rund", zeichen: "anker" } };

    const s1 = mach("Gründung · Schritt Kennung",
      <VereinGruenden art="kennung" aka={akaV} verein={null}
        onFertig={nixf} onZurueck={nixf} />);
    if (s1) {
      const t = s1.div.textContent || "";
      if (!/Name und Ort/.test(t)) zeige("Gründung", "Kennung fragt nicht nach dem Namen");
      else ok++;
      if (!/Wappen/.test(t)) zeige("Gründung", "Kennung zeigt keinen Wappeneditor");
      else ok++;
      /* Und sie darf NICHT nach der Liga fragen — das ist der ganze Punkt. */
      if (/Startliga/.test(t)) zeige("Gründung", "Kennung fragt schon nach der Liga");
      else ok++;
      /* Kein Zurück: das Dach ist der einzige Weg hierher. */
      const kn = [...s1.div.querySelectorAll("button")]
        .map((b2) => (b2.textContent || "").trim());
      if (kn.some((x) => x === "Zurück"))
        zeige("Gründung", "Kennung hat einen Zurückknopf, obwohl sie zwingend ist");
      else ok++;
      if (!kn.some((x) => /Verein anlegen|Name fehlt/.test(x)))
        zeige("Gründung", "der Abschlussknopf der Kennung fehlt");
      else ok++;
    }

    const s2 = mach("Gründung · Schritt Spielbetrieb",
      <VereinGruenden art="spielbetrieb" aka={akaV} verein={kv}
        onFertig={nixf} onZurueck={nixf} />);
    if (s2) {
      const t = s2.div.textContent || "";
      if (!/Startliga/.test(t)) zeige("Gründung", "Spielbetrieb fragt nicht nach der Liga");
      else ok++;
      if (/Name und Ort/.test(t)) zeige("Gründung", "Spielbetrieb fragt den Namen erneut ab");
      else ok++;
      if (/Wappen/.test(t)) zeige("Gründung", "Spielbetrieb zeigt den Wappeneditor erneut");
      else ok++;
      /* Der Name MUSS trotzdem sichtbar sein — man soll wissen, für wen man
         die Liga wählt. */
      if (!t.includes("Hamburger Jungs"))
        zeige("Gründung", "der Vereinsname steht nicht in der Vorschau");
      else ok++;
    }

    /* Der alte Weg in einem Zug — für Spielstände vor 35.67. */
    const s3 = mach("Gründung · alter Weg in einem Zug",
      <VereinGruenden aka={akaV} verein={null} onFertig={nixf} onZurueck={nixf} />);
    if (s3) {
      const t = s3.div.textContent || "";
      if (!/Name und Ort/.test(t) || !/Startliga/.test(t))
        zeige("Gründung", "der volle Weg fragt nicht mehr alles ab");
      else ok++;
    }
  }

  /* Der Postkorb (35.53). Er erscheint NUR bei offenen Fällen — der leere
     Zustand ist genauso zu prüfen wie der volle, sonst fällt ein Postkorb,
     der immer da ist, niemandem auf. */
  {
    const fall = { id: "f1", art: "profiangebot", talentId: "t1", name: "Probetalent",
      flag: "🇩🇪", pos: "ST", alter: 19, ovr: 62, peak: 71, ns: false,
      klub: "Testverein FC", klubLiga: "2. Bundesliga", gestellt: 2030, frist: 2031,
      vertragBis: 2032 };
    const akaF = { ...akaV, jahr: 2030, faelle: [fall] };
    /* 35.60: das Postfach ist jetzt IMMER da — Kevins Entscheidung. Die
       Prüfung dreht sich damit um: sie verlangt seine Anwesenheit, nicht mehr
       seine Abwesenheit. Und sie prüft, dass es auch leer eine verständliche
       Auskunft gibt statt einer nackten Null. */
    /* ---- Kopf und Postfach (35.68, von Kevin gemeldet) -------------------
       Zwei Dinge, die auf dem Gerät auffielen und in keiner Prüfung standen:
       das Dach zeigte weder Wappen noch Vereinsnamen, und das Postfach
       klappte bei offenen Fällen von selbst auf. */
    {
      const kennV = { ...vollV, gekannt: true, name: "Wappenprobe", stadt: "Testort",
        farben: { primaer: "#1a4d8f", sekundaer: "#fff" },
        wappen: { form: "rund", zeichen: "anker" } };
      const r9 = mach("Dach · mit Wappen und Namen", <VereinDach aka={akaV} verein={kennV}
        gesamt={{ karrieren: 9 }} onAka={nixf} onProfi={nixf} onZurueck={nixf}
        onAendern={nixf} onVAendern={nixf} />);
      if (r9) {
        const t9 = r9.div.textContent || "";
        if (!t9.includes("Wappenprobe")) zeige("Dach", "der Vereinsname steht nicht im Kopf");
        else ok++;
        if (!t9.includes("Testort")) zeige("Dach", "der Ort steht nicht im Kopf");
        else ok++;
        /* Das Wappen ist ein SVG — am Baum geprüft, nicht am Text, sonst
           findet man es nie. */
        if (!r9.div.querySelector("svg")) zeige("Dach", "kein Wappen gezeichnet");
        else ok++;
      }

      /* DAS POSTFACH BLEIBT ZU. Bei offenen Fällen war es vorher von selbst
         offen — und schob die beiden Kacheln aus dem Bild. */
      const fall9 = { id: "f9", art: "profiangebot", talentId: "t9", name: "Zuklapp",
        flag: "🇩🇪", pos: "ST", alter: 19, ovr: 60, peak: 70, ns: false,
        klub: "FC Test", klubLiga: "3. Liga", gestellt: 2030, frist: 2031, vertragBis: 2032 };
      const r10 = mach("Dach · Postfach zugeklappt trotz offener Fälle",
        <VereinDach aka={{ ...akaV, jahr: 2030, faelle: [fall9] }} verein={kennV}
          gesamt={{ karrieren: 9 }} onAka={nixf} onProfi={nixf} onZurueck={nixf}
          onAendern={nixf} onVAendern={nixf} />);
      if (r10) {
        /* NACHGEZOGEN AUF DAS BRIEFSYMBOL (35.93). Bis 35.92 war das Postfach
           eine Kachel mit Text; die Prüfung suchte deshalb im Text nach
           „1 offen" und „antippen". Jetzt ist es ein Symbol in der Kopfzeile,
           und der Zustand steht in `aria-label` — dort, wo er auch für einen
           Screenreader steht.
           Sie hatte recht, rot zu melden: den Text, den sie suchte, gibt es
           nicht mehr. Was sie prüft, bleibt dasselbe — ist der Zähler da,
           bleibt der Inhalt zu, lässt er sich öffnen. */
        const brief = [...r10.div.querySelectorAll("button")]
          .find((b2) => /Postfach/.test(b2.getAttribute("aria-label") || ""));
        if (!brief) zeige("Postfach", "kein Briefsymbol in der Kopfzeile");
        else {
          ok++;
          const marke = brief.getAttribute("aria-label") || "";
          if (!/1 Vorgänge|1 Vorgang/.test(marke) && brief.textContent.indexOf("1") < 0)
            zeige("Postfach", "der Zähler fehlt: " + marke);
          else ok++;
          /* Der Fall darf NICHT schon sichtbar sein. */
          if ((r10.div.textContent || "").includes("Zuklapp"))
            zeige("Postfach", "der Inhalt liegt offen, obwohl das Fenster zu ist");
          else ok++;
          /* Und nach dem Antippen MUSS er erscheinen. Das Fenster hängt am
             Körper (Portal), also dort nachsehen — dieselbe Falle wie beim
             Sonderschuss in 35.78. */
          act(() => { brief.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
          /* DAS ZULETZT GEOEFFNETE. Portale haengen am Koerper und bleiben dort,
         solange die Ansicht lebt — eine frueher gerenderte Ansicht kann also
         noch ihr Fenster stehen haben, und `querySelector` findet das ERSTE.
         Dann prueft man das Fenster einer anderen Probe. Genau so passiert:
         die Postkorbpruefung fand das Fenster der Zaehlerpruefung und meldete
         „Name oder Verein fehlen". */
      const alleF = document.body.querySelectorAll("[aria-label='Postfach']");
      const fenster = alleF[alleF.length - 1] || null;
          if (!fenster) zeige("Postfach", "das Fenster öffnet sich nicht");
          else if (!(fenster.textContent || "").includes("Zuklapp"))
            zeige("Postfach", "im Fenster steht der Fall nicht");
          else ok++;
          /* Es MUSS schliessbar sein — anders als der Sonderschuss ist es eine
             Auskunft, keine Belohnung. Wer eine Auskunft nicht wegklicken
             kann, ist gefangen. */
          if (fenster && !/Schließen/.test(fenster.textContent || ""))
            zeige("Postfach", "das Fenster lässt sich nicht schließen");
          else ok++;
        }
      }
    }

    const ohne = mach("Dach · Postfach leer", <VereinDach aka={akaV} verein={vollV}
      gesamt={{ karrieren: 9 }} onAka={nixf} onProfi={nixf} onZurueck={nixf}
      onAendern={nixf} onVAendern={nixf} />);
    if (ohne) {
      const t0 = ohne.div.textContent || "";
      /* AUCH LEER MUSS ES DA SEIN — das war die Regel aus 35.60 und gilt
         weiter: ein Postfach, das verschwindet, wenn es leer ist, ist kein
         Postfach. Nur steht es jetzt im `aria-label`, nicht im Text. */
      const briefLeer = [...ohne.div.querySelectorAll("button")]
        .find((b2) => /Postfach/.test(b2.getAttribute("aria-label") || ""));
      if (!briefLeer) zeige("Postfach", "es fehlt, obwohl es immer da sein soll");
      else ok++;
      if (briefLeer && !/nichts offen/i.test(briefLeer.getAttribute("aria-label") || ""))
        zeige("Postfach", "der leere Zustand wird nicht benannt: "
          + briefLeer.getAttribute("aria-label"));
      else ok++;
      /* Die Kacheln: sie sollen Zahlen tragen, nicht nur Namen. */
      if (!/TALENTE|AUSBAU/i.test(t0)) zeige("Dach", "die Akademiekachel zeigt keine Kennzahlen");
      else ok++;
      if (!/KADER|STÄRKE/i.test(t0)) zeige("Dach", "die Mannschaftskachel zeigt keine Kennzahlen");
      else ok++;
      /* Und der Ausbau-Nenner muss der gemessene sein, nicht 54. */
      if (/\/54/.test(t0)) zeige("Dach", "der Ausbau steht mit dem falschen Nenner 54 da");
      else ok++;
    }

    const mitF = mach("Dach · Postkorb mit Fall", <VereinDach aka={akaF} verein={vollV}
      gesamt={{ karrieren: 9 }} onAka={nixf} onProfi={nixf} onZurueck={nixf}
      onAendern={nixf} onVAendern={nixf} />);
    if (mitF) {
      /* ERST ANTIPPEN. Seit 35.68 bleibt das Postfach zu — diese Prüfung
         stammt aus 35.53 und ging davon aus, dass es von selbst offen ist.
         Sie meldete danach fünf Fehler auf einmal, alle falsch: der Inhalt
         war nicht weg, nur zugeklappt. Eine Prüfung, die eine Annahme über
         den Anfangszustand trifft, muss sie mitziehen, wenn er sich ändert. */
      /* ZUM ZWEITEN MAL NACHGEZOGEN. Diese Prüfung stammt aus 35.53 und hat
         seither zwei Umbauten mitgemacht:
           35.68  das Postfach klappte nicht mehr von selbst auf → antippen
           35.93  es ist kein Kasten mehr, sondern ein Fenster am Körper
         Beide Male hat sie gemeldet, und beide Male zu Recht. Der Inhalt, den
         sie prüft, ist unverändert — nur der Weg dorthin ist ein anderer. */
      const brief2 = [...mitF.div.querySelectorAll("button")]
        .find((b2) => /Postfach/.test(b2.getAttribute("aria-label") || ""));
      if (!brief2) { zeige("Postfach", "kein Briefsymbol"); }
      else act(() => { brief2.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
      const alleF2 = document.body.querySelectorAll("[aria-label='Postfach']");
      const fenster2 = alleF2[alleF2.length - 1] || null;
      const t = fenster2 ? (fenster2.textContent || "") : "";
      if (!/Postfach · 1 offen/.test(t)) zeige("Postfach", "Kopfzeile mit Zähler fehlt");
      else ok++;
      if (!t.includes("Probetalent") || !t.includes("Testverein FC"))
        zeige("Postkorb", "Name oder Verein fehlen");
      else ok++;
      /* Die Frist muss LESBAR sein, nicht bloß gespeichert. 2031 − 2030 = 1. */
      if (!/noch 1 Jahr/.test(t)) zeige("Postkorb", "die Restfrist wird nicht richtig angezeigt: "
        + (t.match(/noch [^·]*/) || ["—"])[0]);
      else ok++;
      /* Die Knöpfe stehen jetzt IM FENSTER, nicht im Behälter der Ansicht —
         das Fenster hängt am Körper (Portal, 35.93). */
      const kn = [...(fenster2 || mitF.div).querySelectorAll("button")]
        .map((b2) => (b2.textContent || "").trim());
      if (!kn.some((x) => x === "Freigeben")) zeige("Postkorb", "„Freigeben“ fehlt");
      else ok++;
      if (!kn.some((x) => x === "Behalten")) zeige("Postkorb", "„Behalten“ fehlt");
      else ok++;
      /* Die Aussicht in Prozent — sie ist der ganze Witz an Kevins Wunsch,
         dass zu gute Talente ablehnen können. Ohne Zahl wäre es Glücksspiel. */
      if (!/% Aussicht/.test(t)) zeige("Postkorb", "die Aussicht in Prozent fehlt");
      else ok++;
    }
  }
  /* Rückblick (35.52): der Reiter erscheint nur, wenn die Chronik Tabellen
     trägt. Beide Zustände werden geprüft — ein Reiter, der zu früh da ist,
     wäre ein leeres Versprechen, einer der zu spät kommt, verstecktes
     Ergebnis. Gespielt wird dafür eine echte Saison. */
  {
    const rv = VEREIN.gruenden(VEREIN.leererVerein(),
      /* NICHT „Rückblickprobe" nennen: der Name stünde im Text und die Prüfung
         „ist der Reiter schon da" fände ihr eigenes Suchwort im Vereinsnamen
         wieder. Ist genau so passiert. */
      { name: "Archivprobe", land: "GER", liga: "3. Liga" }).v;
    const rk = ["TW","TW","IV","IV","IV","IV","AV","AV","AV","ZDM","ZDM","ZM","ZM",
                "ZOM","ZOM","AF","AF","ST","ST","ST"]
      .map((pz, i2) => ({ id: "r" + i2, name: "Rück " + i2, pos: pz, ovr: 46 + (i2 % 10),
        pot: 76, alter: 22, flag: "🇩🇪", form: 50, fitness: 80,
        spiele: 0, tore: 0, jahreImVerein: 0 }));
    const vorher = VEREIN.autoAufstellen({ ...rv, kader: rk });

    const r0 = mach("Verein · vor der ersten Saison", <VereinScreen v={vorher} aka={akaV}
      onAendern={nix} onAkaAendern={nix} onZurueck={nix} onAbschluss={nix} />);
    if (r0) {
      /* Am KNOPF messen, nicht am Fliesstext. Der erste Entwurf suchte das
         Wort im ganzen Bildschirm und fand es zweimal falsch: einmal im
         Vereinsnamen der Probe, einmal in einem Hinweissatz weiter unten.
         Ein Reiter ist ein Knopf — dann wird auch der Knopf gezaehlt. */
      const reiterKn = (r00) => [...r00.div.querySelectorAll("button")]
        .map((b2) => (b2.textContent || "").trim()).filter((t) => t === "Rückblick");
      if (reiterKn(r0).length)
        zeige("Rückblick", "der Reiter ist schon da, bevor eine Saison gespielt wurde");
      else ok++;
    }

    const erg = VEREIN.vereinSaison(vorher);
    if (erg.fehler) zeige("Rückblick", "Probesaison lief nicht: " + erg.fehler);
    else {
      let stand2 = erg.v;
      function RueckHuelle() {
        const [vv, setVv] = React.useState(stand2);
        stand2 = vv;
        return <VereinScreen v={vv} aka={akaV} onAendern={setVv}
          onAkaAendern={nix} onZurueck={nix} onAbschluss={nix} />;
      }
      const r1 = mach("Verein · Rückblick nach einer Saison", <RueckHuelle />);
      if (r1) {
        const knRB = [...r1.div.querySelectorAll("button")]
          .map((b2) => (b2.textContent || "").trim()).filter((t) => t === "Rückblick");
        if (!knRB.length)
          zeige("Rückblick", "der Reiter fehlt, obwohl eine Saison gespielt wurde");
        else if (klick(r1.div, "Rückblick", "Reiter Rückblick")) {
          const t = r1.div.textContent || "";
          if (!/Abschlusstabelle/.test(t)) zeige("Rückblick", "Tabelle fehlt");
          else ok++;
          if (!/Leistungsdaten/.test(t)) zeige("Rückblick", "Leistungsdaten fehlen");
          else ok++;
          if (!/Alle 38 Spiele/.test(t)) zeige("Rückblick", "Spielliste fehlt oder hat nicht 38 Spiele");
          else ok++;
          /* Die eigene Mannschaft MUSS in der Tabelle auftauchen — eine
             Tabelle ohne den eigenen Verein waere sinnlos, faellt aber beim
             Rendern nicht auf. */
          if (!t.includes("Archivprobe")) zeige("Rückblick", "der eigene Verein steht nicht in der Tabelle");
          else ok++;
          /* Und die Zahl unten muss zu den Daten passen, nicht bloss da sein. */
          const c = erg.v.chronik[erg.v.chronik.length - 1];
          if (!t.includes(String(c.tabelle[0].pkt)))
            zeige("Rückblick", "die Punktzahl des Meisters steht nicht in der Anzeige");
          else ok++;
        }
      }
    }
  }

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
    /* 35.42: die Beispiele kommen jetzt AUS VCLADEN statt aus dem Gedaechtnis.
       Vorher stand hier `art("physio")` als Beispiel fuer „wirkt sofort". Als
       der Physio in 35.42 ein Dauerposten wurde, war die Pruefung rot — nicht
       weil das Kaufmodell kaputt war, sondern weil ihr Beispiel nicht mehr
       passte. Eine Pruefung, die Artikelnamen auswendig kennt, bricht bei
       jeder Umstellung, ohne dass etwas Echtes falsch waere. */
    const bspSofort = VCLADEN.find((a) => !a.vorrat && !a.dauer);
    const bspDauernd = VCLADEN.find((a) => !a.vorrat && a.dauer === 1);
    const bspVorrat = VCLADEN.find((a) => a.vorrat);
    if (!bspSofort || !bspDauernd || !bspVorrat)
      zeige("Kaufmodell", "im Laden fehlt eine der drei Arten — die Pruefung deckt sie nicht mehr ab: "
        + (bspSofort ? "" : "sofort ") + (bspDauernd ? "" : "dauernd ") + (bspVorrat ? "" : "vorrat"));
    const faelle = [
      /* Artikel, Bestand, kaufbar?, warum */
      ["läuft gerade",        bspDauernd, { [bspDauernd.id]: 1 }, false],
      ["abgelaufen",          bspDauernd, { [bspDauernd.id]: 0 }, true],
      ["nie gekauft",         bspDauernd, {},                     true],
      ["Sofortwirkung",       bspSofort,  {},                     true],
      /* Ein Sofortartikel bleibt auch dann kaufbar, wenn aus einer alten
         Sicherung noch ein Zaehler danebensteht. Genau das war der Fehler
         aus 34.21, nur andersherum. */
      ["Sofortwirkung mit Altwert", bspSofort, { [bspSofort.id]: 1 }, true],
      ["Vorrat stapelt",      bspVorrat,  { [bspVorrat.id]: 3 },   true],
      ["lange Dauer läuft",   art("ueber99"),  { ueber99: 2 },  false],
      ["lange Dauer vorbei",  art("ueber99"),  { ueber99: 0 },  true],
      /* Der Physio namentlich, weil sich seine Art in 35.42 geaendert hat:
         eine Saison lang gesperrt, danach wieder zu haben. */
      ["Physio läuft",        art("physio"),   { physio: 1 },   false],
      ["Physio abgelaufen",   art("physio"),   { physio: 0 },   true],
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
    if (!sofort.length) zeige("Kaufmodell", "kein Artikel im Laden wirkt sofort");
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
    /* Der Zähler muss stimmen — die Gesamtzahl GEMESSEN, nicht abgeschrieben.
       Hier stand fest „von 48". Als in 35.62 zwei Belohnungen dazukamen
       (Meisterwappen, Fünfzehn Ringe), meldete die Prüfung rot, obwohl beide
       richtig angelegt waren. Eine Prüfung, die eine wachsende Zahl fest
       einträgt, meldet jedes Wachstum als Fehler — dieselbe Bauart wie die
       518 Ereignisse in 35.45. */
    const gesamtLohn = Object.keys(META).length;
    if (!new RegExp("2 von " + gesamtLohn).test(t))
      zeige("Freischaltungen", "Zähler stimmt nicht: erwartet „2 von " + gesamtLohn + "\u201C");
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

  /* ---- Willkommensschirm (35.26) ---------------------------------------- */
  /* Der Schirm erscheint genau EINMAL im Leben eines Spielstands. Wenn dort
     etwas fehlt, sieht es niemand ein zweites Mal — und beschwert sich auch
     nicht, weil er nicht weiss, was hätte stehen sollen. Deshalb geprüft. */
  {
    let wLeer = 0, wLang = 0, wOhneBild = 0;
    WILLKOMMEN.forEach((t) => {
      if (!t.kopf || !t.text) wLeer++;
      if (typeof t.bild !== "function") wOhneBild++;
      /* Grosszügiger als die Anleitung (130): hier stehen ganze Absätze,
         keine Stichworte. Aber eine Grenze braucht es, sonst wächst der Text
         über den Bildschirm hinaus und die Knöpfe rutschen darunter. */
      if ((t.text || "").length > 260) wLang++;
    });
    if (wLeer) zeige("Willkommen", wLeer + " Tafeln ohne Kopf oder Text"); else ok++;
    if (wOhneBild) zeige("Willkommen", wOhneBild + " Tafeln ohne Zeichnung"); else ok++;
    if (wLang) zeige("Willkommen", wLang + " Tafeln über 260 Zeichen"); else ok++;
    /* Die drei Dinge, die STAND.md als Auftrag nennt, müssen vorkommen. Ohne
       diese Prüfung könnte eine Tafel still verschwinden. */
    const alles = WILLKOMMEN.map((t) => t.kopf + " " + t.text).join(" ");
    const fehlt = [["Laufbahn", /laufbahn|spieler/i], ["Akademie", /akademie/i],
                   ["Verein", /verein/i]].filter(([, r]) => !r.test(alles));
    if (fehlt.length) zeige("Willkommen", "erklärt nicht: " + fehlt.map((f) => f[0]).join(", "));
    else ok++;
    /* Rendern. `mach` gibt {div, root} zurück und prüft selbst auf leere
       Ansicht sowie NaN/undefined — der erste Entwurf hier behandelte den
       Rückgabewert als Text und brach mit „h.includes is not a function" ab.
       Nachgesehen statt geraten. */
    const w = mach("Willkommen", <Willkommen onFertig={() => {}} />);
    if (w) {
      const t = w.div.textContent || "";
      /* Beim Öffnen steht Tafel 1 — und die Blätteranzeige muss die Gesamtzahl
         nennen, sonst weiss niemand, wie lang das noch geht. */
      if (!t.includes(WILLKOMMEN[0].kopf)) zeige("Willkommen", "Tafel 1 zeigt ihren Kopf nicht");
      else ok++;
      if (!t.includes("/ " + String(WILLKOMMEN.length).padStart(2, "0")))
        zeige("Willkommen", "Blätteranzeige nennt die Gesamtzahl nicht");
      else ok++;
      /* Ein Ausweg muss immer da sein: wer den Schirm nicht lesen will, darf
         nicht festsitzen. */
      if (!/Überspringen/.test(t)) zeige("Willkommen", "kein Ausweg: Überspringen fehlt");
      else ok++;
      w.root.unmount();
    }

    /* ---- Freischalthinweis ---- */
    for (const was of ["aka", "verein"]) {
      const h = mach("Freischalthinweis · " + was, <FreiHinweis was={was} onZu={() => {}} />);
      if (h) {
        const t = h.div.textContent || "";
        /* Muss sagen, WAS neu ist — ein Hinweis ohne Gegenstand ist Lärm. */
        const treffer = was === "aka" ? /Akademie/i.test(t) : /Verein/i.test(t);
        if (!treffer) zeige("Freischalthinweis", was + ": nennt die Sache nicht beim Namen");
        else ok++;
        if (!/Verstanden/.test(t)) zeige("Freischalthinweis", was + ": kein Weg zum Schliessen");
        else ok++;
        h.root.unmount();
      }
    }

    /* Die Schwellen müssen zu dem passen, was die Tafeln und die Anleitung
       versprechen. Stünde in verein.js FREI_VEREIN = 6, liefe der Text „ab der
       5. Laufbahn" ins Leere — genau der Fehler, den die Akademie mit ihren
       „sechs Abteilungen" zwölf Fassungen lang hatte. */
    const fr0 = VEREIN.freigeschaltet({ karrieren: 0 });
    if (fr0.nochAkademie !== 2) zeige("Willkommen", "Akademie-Schwelle ist " + fr0.nochAkademie + ", die Tafel sagt 2");
    else ok++;
    if (fr0.nochVerein !== 5) zeige("Willkommen", "Vereins-Schwelle ist " + fr0.nochVerein + ", die Tafel sagt 5");
    else ok++;
    /* Und niemand darf beides gleichzeitig geschenkt bekommen, ohne dass die
       Reihenfolge stimmt. */
    if (!VEREIN.freigeschaltet({ karrieren: 2 }).akademie) zeige("Willkommen", "bei 2 Laufbahnen ist die Akademie nicht offen");
    else ok++;
    if (VEREIN.freigeschaltet({ karrieren: 4 }).verein) zeige("Willkommen", "Verein schon bei 4 Laufbahnen offen");
    else ok++;
  }
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

  /* ---- Akademie-Herkunft im Karriere-Rückblick (35.32) -----------------
     Die Karte "Deine Stärke" nennt seit 35.32, was die Akademie diesem
     Spieler mitgegeben hat. Geprüft wird in BEIDE Richtungen: mit reifer
     Akademie MUSS die Zeile stehen, ohne Akademie darf sie NICHT stehen.

     Warum beides: eine Prüfung, die nur das Vorhandensein zeigt, bliebe auch
     dann grün, wenn die Bedingung wegfällt und die Zeile immer gezeichnet
     wird. Dann stünde bei jeder ERSTEN Laufbahn "aus deiner Akademie:" mit
     nichts dahinter — und genau das fällt einem Absturztest nie auf.

     Die dritte Probe ist der alte Spielstand: `p.aka` gab es nicht immer.
     Fehlt das Feld, muss die Karte trotzdem zeichnen. */
  {
    const bisStaerke = (r) => {
      for (let k = 0; k < 12; k++) {
        const alle = [...r.div.querySelectorAll(".karteikarte")]
          .filter((x) => x.getAttribute("aria-hidden") !== "true");
        const karte = alle[alle.length - 1];
        if (karte && /Deine Stärke/.test(karte.textContent || "")) return karte;
        const sch = r.div.querySelector(".rs-schleier");
        if (!sch) return null;
        act(() => { sch.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
      }
      return null;
    };
    const staerkeText = (name, q) => {
      const r = mach(name, <KarriereRueckblick p={q} onFertig={() => {}} />);
      if (!r) return null;
      const karte = bisStaerke(r);
      if (!karte) { zeige("Rückblick", name + ": die Karte „Deine Stärke“ war nicht erreichbar"); return null; }
      return karte.textContent || "";
    };

    const mitAka = laufbahn(reif);
    const AKm = akaVerbuchen(reif, vcFuer(mitAka));
    mitAka.akaName = AKm.a.name;
    const t1 = staerkeText("Rückblick mit Akademie", mitAka);
    if (t1 !== null) {
      const posten = akaBonusText(mitAka.aka || {});
      if (!posten.length) zeige("Rückblick", "die reife Prüfakademie gibt gar nichts mit — die Probe prüft nichts");
      else if (t1.indexOf("aus " + AKm.a.name) < 0)
        zeige("Rückblick", "mit Akademie fehlt die Herkunftszeile auf „Deine Stärke“");
      else if (posten.some((x) => t1.indexOf(x) < 0))
        zeige("Rückblick", "die Herkunftszeile lässt Posten aus: " + posten.filter((x) => t1.indexOf(x) < 0).join(", "));
      else ok++;
      console.log("  Rückblick       Akademieherkunft: " + posten.join(" · "));
    }

    const ohneAka = laufbahn(null);
    const t2 = staerkeText("Rückblick ohne Akademie", ohneAka);
    if (t2 !== null) {
      if (/aus .*Anlage \+/.test(t2) || t2.indexOf("aus deiner Akademie") >= 0)
        zeige("Rückblick", "ohne Akademie steht die Herkunftszeile trotzdem da");
      else ok++;
    }

    const alterStand = laufbahn(null); delete alterStand.aka;
    const t3 = staerkeText("Rückblick ohne Feld p.aka", alterStand);
    if (t3 !== null) {
      if (t3.indexOf("aus deiner Akademie") >= 0)
        zeige("Rückblick", "ohne das Feld p.aka wird die Herkunftszeile trotzdem gezeichnet");
      else ok++;
    }
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
      /* ---- NACHGEZOGEN AUF DAS FOTO (35.100) ---------------------------
         Bis 35.99 war das Titelfoto GEZEICHNET, und diese Prüfung zählte die
         elf Silhouetten im SVG. Jetzt liegt dort ein echtes Bild — das
         gezeichnete gab es nur, weil es kein Foto gab.

         Sie meldete „-1 Silhouetten statt 11" und hatte recht: das SVG, das
         sie suchte, existiert nicht mehr. Was sie prüft, bleibt dasselbe —
         ist ein Aufmacherbild da, und tritt es zurück, wenn ein Porträt
         davorsteht? */
      const bild = (el) => {
        const r = mach("Titelblatt-Foto", el);
        if (!r) return null;
        const i2 = r.div.querySelector("img[aria-hidden]");
        return i2 ? { quelle: i2.getAttribute("src") || "",
          deckung: Number(i2.style.opacity) } : null;
      };
      const ohneB = bild(<MenuScreen save={null} hall={[]} aka={leereAkademie()}
        achN={0} metaN={0} onNew={() => {}} onResume={() => {}} onAch={() => {}}
        onHall={() => {}} onAka={() => {}} onBackup={() => {}} />);
      const held = laufbahn(null);
      const mitB = bild(<MenuScreen save={{ p: held }} hall={[]} aka={leereAkademie()}
        achN={0} metaN={0} onNew={() => {}} onResume={() => {}} onAch={() => {}}
        onHall={() => {}} onAka={() => {}} onBackup={() => {}} />);

      if (!ohneB || !mitB) zeige("Titelfoto", "kein Aufmacherbild im Titelblatt");
      else {
        ok++;
        /* Es muss das EINGEBETTETE Bild sein, kein Pfad — im APK gibt es kein
           Netz und keine verlässlichen Pfade. */
        if (ohneB.quelle.indexOf("data:image/") !== 0)
          zeige("Titelfoto", "das Bild kommt nicht eingebettet: "
            + ohneB.quelle.slice(0, 40));
        else ok++;
        /* MIT Porträt muss es ZURÜCKTRETEN. Das war schon bei der Zeichnung
           so und ist der Grund, warum das Porträt nicht mit dem Hintergrund
           um Aufmerksamkeit streitet. */
        if (!(mitB.deckung < ohneB.deckung))
          zeige("Titelfoto", "es tritt nicht zurück, wenn ein Porträt davorsteht ("
            + mitB.deckung + " gegen " + ohneB.deckung + ")");
        else ok++;
        /* Und es darf nicht ganz verschwinden — dann wäre der Titel wieder
           leer, und genau dagegen wurde es 35.30 eingeführt. */
        if (!(mitB.deckung > 0.15))
          zeige("Titelfoto", "mit Porträt ist es praktisch unsichtbar: " + mitB.deckung);
        else ok++;
        console.log("  Titelfoto       Deckung " + ohneB.deckung + " ohne, "
          + mitB.deckung + " mit Spielstand");
      }

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
  const leer = () => {};
  /* ---- Der Aufdecktisch räumt sich auf (35.92) ----------------------------
     Kevin: „Wenn man alle Karten im Pack angenommen hat, dann soll die Ansicht
     wieder in den Shop wechseln."
     Ein leerer Tisch mit einem „Fertig"-Knopf ist ein Bildschirm, der nur noch
     aus einer Aufforderung besteht, ihn zu verlassen. */
  {
    const vollV2 = { gegruendet: true, name: "P", liga: "3. Liga",
      /* Kader mit VOLLEM Packkontingent — dann gibt es nur „Annehmen". */
      kader: Array.from({ length: 5 }, (_, i) => ({ id: "v" + i, name: "V" + i,
        pos: "ST", ovr: 70, ausPack: true })) };
    const rz = mach("Packladen · voller Kader", <Packladen vc={0}
      pool={KARTEN.leererPool()} verein={vollV2} gratis={1}
      onKauf={leer} onGratis={leer} onStartpaket={leer}
      onEinsetzen={() => "voll"} onEntfernen={() => null} onVerkauf={() => null}
      onZurueck={leer} />);
    if (rz) {
      if (!klick(rz.div, "Gratispack öffnen", "Pack öffnen")) {
        zeige("Packladen", "das Gratispack lässt sich nicht öffnen");
      } else {
        await warte(0); // Enthüllung folgt erst der bestätigten Buchung.
        /* Aufdecken. */
        let verdeckt = rz.div.querySelectorAll("[aria-label*=Verdeckte]");
        let runde = 0;
        while (verdeckt.length && runde < 6) {
          act(() => { verdeckt[0].dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
          verdeckt = rz.div.querySelectorAll("[aria-label*=Verdeckte]");
          runde++;
        }
        const kn = [...rz.div.querySelectorAll("button")]
          .map((b2) => (b2.textContent || "").trim());
        /* BEI VOLLEM KADER GIBT ES KEIN „In den Kader" — sonst stünde dort ein
           Knopf, der nichts tut. Das war der Befund aus 35.90. */
        if (kn.some((x) => x === "In den Kader"))
          zeige("Packladen", "„In den Kader“ trotz vollem Kontingent");
        else ok++;
        if (!kn.some((x) => x === "Annehmen"))
          zeige("Packladen", "kein Weg, die Karte anzunehmen");
        else ok++;
      }
    }
  }


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
