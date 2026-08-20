/* ==========================================================================
   ereignispruefung.cjs — was bei 471 Ereignissen kein Mensch mehr uebersieht
   --------------------------------------------------------------------------
       node pruefstand/ereignispruefung.cjs [Quelle.jsx]

   Braucht /tmp/ps/motor.js, also einen Lauf von pruefen.sh davor.

   ZWEI ARTEN VON PRUEFUNG, und der Unterschied ist wichtig:

   HARTE PRUEFUNGEN schlagen sofort fehl. Sie finden Dinge, die schlicht
   falsch sind — doppelte Kennungen, ein Ereignis, das etwas verspricht und
   nicht liefert.

   GRUNDLINIEN vergleichen gegen einen festgehaltenen Stand und schlagen nur
   an, wenn es MEHR wird. Sie decken Altlasten ab, ueber die inhaltlich
   entschieden werden muss (13 aehnliche Paare, 14 folgenlose Flaggen). Ein
   Melder, der bei jedem Lauf dieselben 27 bekannten Zeilen ausspuckt, wird
   nach dem zweiten Mal ueberlesen — das ist in 35.1 schon passiert und hat
   zur Verwerfung der Farbwertpruefung gefuehrt. Neuer Inhalt darf die Schuld
   nicht vergroessern; abtragen kann man sie jederzeit und die Zahl senken.
   ========================================================================== */
const fs = require("fs");
const App = require("/tmp/ps/motor.js");
const EV = App.EVENTS;
const QUELLE = process.argv[2] || process.env.QUELLE || "/mnt/project/App.jsx";
/* Gelesen wird der Quelltext BEIDER Dateien. Seit 35.6 liegen die Ereignisse in
   ereignisse.js — die Pruefung auf folgenlose Flaggen sucht die Lesestellen im
   Text, und die Bedingungen sind mit umgezogen. Nur App.jsx zu lesen meldete
   nach der Aufteilung 51 statt 13 tote Flaggen. Das war kein Fehler im Spiel,
   sondern eine Annahme im Pruefwerkzeug, die die Aufteilung nicht ueberlebt
   hat. Wer weiter aufteilt, traegt die neue Datei hier nach. */
const NEBEN = ["ereignisse.js"];
const path = require("path");
const dir = path.dirname(path.resolve(QUELLE));
let quelle = fs.readFileSync(QUELLE, "utf8");
NEBEN.forEach((n) => {
  const f = path.join(dir, n);
  if (fs.existsSync(f)) quelle += "\n" + fs.readFileSync(f, "utf8");
  else { console.log("  ! " + n + " nicht gefunden neben " + QUELLE + " — Flaggenprüfung unvollständig"); }
});

/* Festgehaltener Stand vom 16.8.2026, Fassung 35.4. Gemessen, nicht geschaetzt.
   Wird eine Zahl unterschritten, meldet das Werkzeug das als Hinweis — dann
   gehoert sie hier gesenkt, sonst verliert die Grundlinie ihre Wirkung. */
const GRUNDLINIE = {
  /* Nach dem Aufraeumen in 35.5. Die fuenf verbliebenen Paare sind geprueft
     und bleiben mit Absicht — sie beschreiben verschiedene Lagen und teilen
     nur das Vokabular:
       a_jugend / r_aufstieg          altern gegen Aufstieg, beide "Neue auf
                                      deiner Position"
       sf_praemie / sf_investorpraemie Titelgeld gegen Platzierungsgeld
       fitnesstest / al_schlaf        Ausdauer gegen Schlaf
       kapitaen / n_kapitaen          Verein gegen Land
       ausstieg / sf_ausstiegsklausel Streit gegen Verhandlung; beide setzen
                                      "klausel" und schliessen einander seit
                                      35.5 gegenseitig aus */
  aehnlichePaare: 5,
  /* 13 folgenlose Flaggen. Das ist Inhaltsschuld, kein Fehler — jede davon
     ist eine Entscheidung des Spielers, die spurlos verpufft. Beim
     Inhaltsausbau abzutragen. */
  /* 35.7: von 13 auf 5 abgetragen. Sechs wanderten in die Anzeige „Was danach
     kommt" am Karriereende (trainerschein · experte · plan_b · agentur ·
     abschiedsspiel · rueckkehr), zwei wurden an vorhandene Folgeereignisse
     angeschlossen (tpo hiess in Wahrheit rechte_weg; einbuergerung oeffnet
     jetzt as_golf). Die restlichen fuenf — attest · beidseitig · manipuliert ·
     pendeln · treugeblieben — brauchen eigenen Inhalt und warten auf den
     Inhaltsausbau. treugeblieben wirkt immerhin ueber loyalBonus mit. */
  toteFlaggen: 5,
};
/* Schwelle fuer "aehnlich". An den Daten kalibriert, nicht geraten:
   ab 50 % gibt es 0 Paare, ab 40 % zwei, ab 25 % dreizehn, ab 20 % dreissig.
   Bei 20 % kippt es ins Rauschen. 25 % ist die Kante. */
const AEHNLICH_AB = 0.25;

let hart = 0, weich = 0, ok = 0;
const zeig = (liste, n = 14) => {
  liste.slice(0, n).forEach(z => console.log("      " + z));
  if (liste.length > n) console.log("      … und " + (liste.length - n) + " weitere");
};
const hartePruefung = (was, treffer) => {
  if (!treffer.length) { ok++; console.log("  ✓ " + was); return; }
  hart += treffer.length;
  console.log("  ✗ " + was + " — " + treffer.length);
  zeig(treffer);
};
const grundlinie = (was, schluessel, treffer) => {
  const soll = GRUNDLINIE[schluessel];
  if (treffer.length > soll) {
    weich += treffer.length - soll;
    console.log("  ✗ " + was + " — " + treffer.length + ", Grundlinie " + soll +
                " (" + (treffer.length - soll) + " NEU)");
    zeig(treffer);
  } else if (treffer.length < soll) {
    ok++;
    console.log("  ✓ " + was + " — " + treffer.length + " (unter der Grundlinie " + soll +
                "; bitte GRUNDLINIE." + schluessel + " auf " + treffer.length + " senken)");
  } else {
    ok++;
    console.log("  ✓ " + was + " — " + treffer.length + ", unveraendert zur Grundlinie");
  }
};

/* ---------------------------------------------------------- Hilfsmittel */
/* Titel und Text sind oft Funktionen (title:c=>`...`). Ohne Ersatzzusammen-
   hang steht "undefined" drin — dieselbe Stolperfalle, die uebersicht.cjs
   abfaengt. Ein Titel, der aus dem Zusammenhang RECHNET, ist ausserdem fuer
   den Doppelvergleich unbrauchbar: r_schwachesjahr und r_starkesjahr heissen
   mit Ersatzwerten beide "Durchschnittsnote 3.0", sind aber das Gegenteil
   voneinander. Solche Titel werden uebersprungen. */
/* Ein fester Ersatztisch reicht NICHT: 22 der 471 Texte greifen auf Felder zu,
   die darin fehlen, brechen ab und liefern einen leeren Text. Die Aehnlichkeit
   wird dann nur auf dem Titel gerechnet — sa_scout und hk_diaspora galten so
   als 25 % aehnlich, weil in beiden Titeln "Stadion" steht. Ein Zwanzigstel
   des Bestands war fuer diese Pruefung unsichtbar.
   Stattdessen ein Platzhalter, der auf JEDEN Zugriff antwortet und sich sowohl
   als Text als auch als Zahl benutzen laesst. */
const platzhalter = (wort) => new Proxy(function () {}, {
  get(_, k) {
    if (k === Symbol.toPrimitive) return (hint) => (hint === "number" ? 7 : wort);
    if (k === "toString" || k === "toLocaleString") return () => wort;
    if (k === "valueOf") return () => 7;
    if (k === "toFixed") return () => "7.0";
    if (k === "length") return 7;
    if (typeof k === "symbol") return undefined;
    if (k === "map" || k === "filter" || k === "slice") return () => [];
    if (k === "includes") return () => false;
    return platzhalter(wort);
  },
  apply: () => wort,
});
const ERSATZ = platzhalter("Platzhalter");
const alsText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "function") { try { return String(v(ERSATZ) ?? ""); } catch { return ""; } }
  return String(v);
};
/* Fest ist ein Titel, wenn er nichts aus dem Zusammenhang einsetzt. T("...")
   liefert eine Funktion ohne Parameterzugriff; c=>`... ${c.x} ...` nicht. */
const istFest = (v) => {
  if (typeof v !== "function") return true;
  const s = String(v);
  return !/\$\{/.test(s);
};

const STOPP = new Set(("der die das den dem des ein eine einen einem einer und oder aber " +
  "du dir dich dein deine deinen deinem ist sind war waren hat haben wird werden " +
  "sich nicht noch schon auch nur mit ohne von vom zum zur bei beim in im an am auf " +
  "für über unter vor nach seit aus als wie wenn dass es sie er ihn ihm ihr").split(" "));
const worte = (s) => s.toLowerCase().replace(/[^a-zäöüß ]/g, " ")
  .split(/\s+/).filter(w => w.length > 3 && !STOPP.has(w));

const daten = EV.map(e => {
  const flaggen = new Set(); const fxk = new Set(); let zweige = 0;
  (e.choices || []).forEach(c => (c.roll || []).forEach(r => {
    zweige++;
    if (!r.fx) return;
    Object.keys(r.fx).forEach(k => fxk.add(k));
    if (r.fx.flag) flaggen.add(r.fx.flag);
  }));
  const titel = alsText(e.title), text = alsText(e.text);
  return { e, id: e.id, titel, text, flaggen, fxk, zweige,
           festerTitel: istFest(e.title),
           cond: e.cond ? e.cond.toString() : "",
           w: worte(titel + " " + text) };
});

console.log("=== Ereignisprüfung · " + EV.length + " Ereignisse ===\n");
console.log("-- hart --");

/* -------------------------------------------------- H1) Doppelte Kennungen */
{
  const z = {}; EV.forEach(e => z[e.id] = (z[e.id] || 0) + 1);
  hartePruefung("Kennungen sind eindeutig",
    Object.entries(z).filter(([, n]) => n > 1).map(([k, n]) => k + " kommt " + n + "x vor"));
}

/* ----------------------------------------------------- H2) Doppelte Titel */
{
  const z = {};
  daten.filter(d => d.festerTitel && d.titel).forEach(d => (z[d.titel] = z[d.titel] || []).push(d.id));
  hartePruefung("feste Titel sind eindeutig",
    Object.entries(z).filter(([, ids]) => ids.length > 1)
      .map(([t, ids]) => "„" + t.slice(0, 44) + "“ → " + ids.join(", ")));
}

/* ------------------------------------------- H3) Angebot trotz Besitz */
/* drawEvents sperrt eine Kennung ueber evLog — dasselbe Ereignis kommt kein
   zweites Mal, AUSSER es traegt rep. Zweimal dasselbe angeboten zu bekommen
   geht daher nur so:
     a) ein wiederkehrendes Ereignis vergibt eine Flagge, die man schon hat
     b) ZWEI verschiedene Ereignisse vergeben dieselbe Flagge, und mindestens
        eines fragt nicht nach, ob sie schon gesetzt ist
   Ohne diese Einschraenkung meldet die Pruefung 44 Zeilen, fast alle
   folgenlos. */
{
  /* Der Riegel darf auch an der EINZELNEN OPTION sitzen, und oft ist das die
     bessere Stelle: b_dopingkontrolle SOLL wiederkehren — Kontrollen kommen
     mehrfach —, aber die Option, die „sauber" vergibt, soll nur einmal
     erscheinen. Das ganze Ereignis zu sperren waere falsch gewesen: die
     naheliegende "Loesung" haette ein funktionierendes Ereignis kaputtgemacht. */
  const optionGeschuetzt = (d, f) =>
    (d.e.choices || []).some((c) =>
      c.cond && new RegExp("p\\.flags\\.\\s*" + f + "\\b").test(String(c.cond)) &&
      (c.roll || []).some((r) => r.fx && r.fx.flag === f));
  const setzer = {};
  daten.forEach(d => d.flaggen.forEach(f => (setzer[f] = setzer[f] || new Set()).add(d)));
  const treffer = [];
  Object.entries(setzer).forEach(([f, menge]) => {
    const ds = [...menge];
    ds.forEach(d => {
      /* Gesucht ist nicht "schliesst aus", sondern "hat darueber nachgedacht".
         ew_beraterwechsel VERLANGT die Flagge (man kann nur wechseln, was man
         hat) — das ist richtig so und darf nicht als Fehler gelten. Gemeldet
         wird nur, wenn die Bedingung die Flagge GAR NICHT erwaehnt. */
      const erwaehnt = new RegExp("p\\.flags\\.\\s*" + f + "\\b").test(d.cond) ||
                       new RegExp("p\\.flags\\[[\"'`]" + f).test(d.cond);
      if (erwaehnt) return;
      if (optionGeschuetzt(d, f)) return;   // Riegel sitzt an der Option
      if (d.e.rep != null)
        treffer.push(d.id.padEnd(22) + " vergibt „" + f + "“ und darf wiederkehren (rep:" + d.e.rep + ")");
      else if (ds.length > 1)
        treffer.push(d.id.padEnd(22) + " vergibt „" + f + "“ ohne Nachfrage; auch: " +
                     ds.filter(x => x !== d).map(x => x.id).join(", "));
    });
  });
  hartePruefung("niemand bekommt angeboten, was er schon hat", treffer);
}

/* --------------------------------------- H4) Verspricht, liefert nicht */
/* Die Stolperfalle aus 34.37: nennt ein Ereignistext eine konkrete Rolle,
   muss die Wirkung sie auch herstellen. Bewusst eine kurze, von Hand
   gepflegte Liste — ein allgemeiner Sprachabgleich wuerde raten. */
/* Ein Ereignis, das den Zustand VORAUSSETZT, muss ihn nicht herstellen:
   kp_ntbinde feiert die Binde (cond: !!p.nt.kapitaen). Ein Ereignis, das ihn
   AUSSCHLIESST (cond: !p.nt.kapitaen), vergibt ihn dagegen gerade.

   Diese Unterscheidung war im ersten Entwurf nicht drin — ein schlichtes
   /p\.nt\.kapitaen/ traf beide Schreibweisen. Die Pruefung galt dadurch als
   bestanden, OHNE den Fall je bewertet zu haben: Gegenprobe B (Wirkung
   entfernt, also genau der Fehler aus 35.4) blieb stumm. Dieselbe Stolperfalle
   wie "Pruefung, die nichts zu messen hatte" in Abschnitt 6.
   Dazu ein zweiter Fehler: `braucht` fragte nach fx.ntKapitaen, die Wirkung
   heisst aber ntCaptain. Beide nur durch die Gegenprobe aufgefallen. */
const rolle = (cond, ausdruck) => {
  const e = ausdruck.replace(/[.[\]]/g, (m) => "\\" + m);
  if (new RegExp("!!\\s*" + e).test(cond)) return "verlangt";
  if (new RegExp("!\\s*" + e).test(cond)) return "schliesst aus";
  if (new RegExp(e).test(cond)) return "verlangt";
  return "unerwaehnt";
};
const VERSPRECHEN = [
  { muster: /binde im nationalteam|kapitän deines landes|führst dein land an/i,
    zustand: "p.nt.kapitaen", braucht: (d) => d.fxk.has("ntCaptain"),
    was: "die Nationalmannschafts-Binde", wirkung: "fx.ntCaptain" },
  { muster: /trainerschein|trainerlizenz/i,
    zustand: "p.flags.trainerschein", braucht: (d) => d.flaggen.has("trainerschein"),
    was: "den Trainerschein", wirkung: "flag:trainerschein" },
  { muster: /vertrag.{0,24}verlänger|verlängerst du/i,
    zustand: null, braucht: (d) => d.fxk.has("extend"),
    was: "eine Vertragsverlängerung", wirkung: "fx.extend" },
];
/* AUSNAHMEN, ausdruecklich und begruendet. Der erste Versuch war, die Pruefung
   auf Saetze mit Anrede einzuengen — "was der Text DIR zusagt". Die Gegenprobe
   hat das sofort erledigt: in jf_3 stehen Trainerlizenz und Anrede im selben
   Satz, und schlimmer, der Anlassfall n_kapitaen schlug gar nicht mehr an, weil
   sein Stichwort im Titel steht und die Anrede im Text. Eine Verengung, die den
   Fall verliert, fuer den die Pruefung gebaut wurde, ist keine Verbesserung.

   Wem eine Rolle im Text gehoert, ist eine Ermessensfrage. Die gehoert
   aufgeschrieben, nicht geraten — deshalb eine kurze Liste mit Begruendung.
   Sie wird bei jedem Lauf mit ausgegeben, damit sie nicht in Vergessenheit
   geraet und stillschweigend waechst. */
const AUSNAHMEN = {
  jf_3: "Die Trainerlizenz gehört dem Jugendfreund, nicht dem Spieler.",
};
{
  const treffer = [];
  daten.forEach(d => {
    const t = d.titel + ". " + d.text;
    VERSPRECHEN.forEach(v => {
      if (!v.muster.test(t)) return;
      if (AUSNAHMEN[d.id]) return;
      if (v.zustand && rolle(d.cond, v.zustand) === "verlangt") return;  // feiert ihn nur
      if (v.braucht(d)) return;
      treffer.push(d.id.padEnd(22) + " nennt " + v.was + ", ohne " + v.wirkung);
    });
  });
  hartePruefung("was ein Text zusagt, stellt die Wirkung auch her", treffer);
  Object.entries(AUSNAHMEN).forEach(([id, grund]) =>
    console.log("      (Ausnahme " + id + ": " + grund + ")"));
}

/* ------------------------- H5) Immer ein Ausweg, immer eine Begruendung */
/* Seit 35.8 kann eine Option eine Bedingung tragen. Zwei Dinge muessen dann
   stimmen, und beide sind zu wichtig, um sie dem Gedaechtnis zu ueberlassen:
     a) Jedes Ereignis braucht mindestens eine Option OHNE Bedingung. Sonst
        entsteht eine Lage, in der alle Knoepfe gesperrt sind und das Spiel
        haengt. Das faellt beim Testen fast nie auf, weil es genau die
        Wertekombination braucht, die keine Bedingung erfuellt.
     b) Eine gesperrte Option muss `sperre` tragen. Ein grauer Knopf ohne
        Begruendung ist schlimmer als gar keiner — der Spieler sieht, dass
        etwas ginge, erfaehrt aber nicht was ihm fehlt. */
{
  const ohneAusweg = [], ohneGrund = [];
  daten.forEach((d) => {
    const ch = d.e.choices || [];
    /* Seit 35.14 kann eine Option auch NUR MANCHMAL erscheinen. Der garantierte
       Ausweg muss deshalb beides sein: ohne Bedingung UND ohne Wuerfel. */
    if (ch.length && !ch.some((c) => !c.cond && c.manchmal == null))
      ohneAusweg.push(d.id + " — keine Option ist unbedingt UND immer da (" + ch.length + " Optionen)");
    ch.forEach((c, i) => {
      if (c.cond && !c.sperre)
        ohneGrund.push(d.id + " Option " + (i + 1) + " („" + alsText(c.label).slice(0, 28) + "“) hat cond ohne sperre");
    });
  });
  hartePruefung("jedes Ereignis hat einen bedingungslosen Ausweg", ohneAusweg);
  hartePruefung("jede bedingte Option sagt, was fehlt", ohneGrund);

  /* Die Regel oben prueft die FORM (mindestens eine Option ohne cond). Das
     genuegt nicht: eine Bedingung koennte werfen statt false zu liefern, und
     dann bliebe auch der vermeintlich freie Weg zu. Deshalb zusaetzlich der
     Ernstfall — ein Spieler, bei dem alles auf Minimum steht. Wenn dabei
     irgendwo null Optionen uebrig bleiben, haengt das Spiel. */
  const nackt = {
    rep: 0, morale: 0, money: 0, age: 16, trust: 0, form: 0, fitness: 0, ovr: 40,
    attrs: { pac: 5, sho: 5, pas: 5, dri: 5, def: 5, phy: 5 },
    assets: [], flags: {}, club: { c: "GER", n: "X", l: "X", s: 50 },
    nation: { id: "GER" }, seasons: [], nt: { caps: 0 }, life: {}, contract: 1,
  };
  const offen = (c) => { if (!c.cond) return true; try { return !!c.cond(nackt); } catch { return false; } };
  hartePruefung("kein Ereignis ist beim schwaechsten Spieler eine Sackgasse",
    daten.filter((d) => (d.e.choices || []).length && !(d.e.choices || []).some(offen))
         .map((d) => d.id + " — keine einzige Option offen"));
}

/* -------------------------------------------- H6) Storystraenge (35.9) */
/* Ein Strang kann auf vier Arten kaputtgehen, und keine davon faellt beim
   Spielen zuverlaessig auf — man muesste erst die richtige Stufe erreichen:
     1. Eine Stufe fehlt. Dann bricht die Geschichte in der Mitte ab und der
        Spieler wartet auf eine Fortsetzung, die es nicht gibt.
     2. Eine spaetere Stufe verlangt einen Weg, den keine fruehere erzeugt.
        Der Zweig ist dann tot — geschriebener Text, den niemand je sieht.
     3. Die Tabelle STRAENGE nennt eine andere Teilezahl als vorhanden ist.
        Dann steht "Teil 2 von 4" im Fenster und Teil 4 kommt nie.
     4. Eine Stufe hat keinen Nachfolger, ist aber nicht die letzte. */
{
  const straenge = {};
  daten.forEach((d) => {
    const k = d.e.strang; if (!k) return;
    (straenge[k] = straenge[k] || []).push(d);
  });
  const fehler = [];
  Object.entries(straenge).forEach(([k, ds]) => {
    const stufen = [...new Set(ds.map((d) => d.e.stufe || 1))].sort((a, b) => a - b);
    const hoechste = stufen[stufen.length - 1];
    for (let i = 1; i <= hoechste; i++)
      if (!stufen.includes(i)) fehler.push(k + ": Stufe " + i + " fehlt (vorhanden: " + stufen.join(", ") + ")");
    /* Wege: was eine spaetere Stufe fordert, muss eine fruehere setzen koennen. */
    const gesetzt = new Set();
    ds.forEach((d) => (d.e.choices || []).forEach((c) => (c.roll || []).forEach((r) => {
      if (r.fx && r.fx.strangWeg) gesetzt.add(r.fx.strangWeg);
    })));
    ds.forEach((d) => {
      if (d.e.weg && !gesetzt.has(d.e.weg))
        fehler.push(k + "/" + d.id + ": verlangt Weg „" + d.e.weg + "“, den keine Wahl setzt");
    });
    /* Jede Stufe ausser der letzten braucht einen Nachfolger, der ohne Weg
       auskommt ODER jeden gesetzten Weg abdeckt. */
    for (let i = 1; i < hoechste; i++) {
      const naechste = ds.filter((d) => (d.e.stufe || 1) === i + 1);
      const frei = naechste.some((d) => !d.e.weg);
      if (frei) continue;
      const abgedeckt = new Set(naechste.map((d) => d.e.weg));
      const vonHier = new Set();
      ds.filter((d) => (d.e.stufe || 1) === i).forEach((d) =>
        (d.e.choices || []).forEach((c) => (c.roll || []).forEach((r) => {
          if (r.fx && r.fx.strangWeg) vonHier.add(r.fx.strangWeg); })));
      [...vonHier].forEach((w) => {
        if (!abgedeckt.has(w))
          fehler.push(k + ": Stufe " + i + " kann auf Weg „" + w + "“ enden, Stufe " + (i + 1) + " deckt ihn nicht ab");
      });
    }
    const tab = App.STRAENGE && App.STRAENGE[k];
    if (!tab) fehler.push(k + ": fehlt in der Tabelle STRAENGE (Anzeige „Teil x von ?“)");
    else if (tab.teile !== hoechste)
      fehler.push(k + ": Tabelle sagt " + tab.teile + " Teile, vorhanden sind " + hoechste);
  });
  hartePruefung("Storystränge sind lückenlos und erreichbar", fehler);
  if (Object.keys(straenge).length)
    console.log("      " + Object.entries(straenge)
      .map(([k, ds]) => k + " (" + ds.length + " Ereignisse, " +
        Math.max(...ds.map((d) => d.e.stufe || 1)) + " Stufen)").join(" · "));
}

/* --------------------------------- H7) Wirkungen mit festen Werten */
/* forceInjury erwartet "leicht" | "mittel" | "schwer" und schlaegt sonst mit
   `Cannot read properties of undefined` in simulateSeason auf — ein Absturz
   MITTEN in der Saison, nicht beim Laden. Ich habe in 35.16 forceInjury:1
   geschrieben; die Kalibrierung ist sofort gestorben. Genau die Sorte Tippfehler,
   die man in 1.132 Optionen nie von Hand findet.
   Dieselbe Pruefung fuer alle Wirkungen, die nur bestimmte Werte vertragen. */
{
  const ERLAUBT = {
    forceInjury: ["leicht", "mittel", "schwer"],
    suspend: null,          // Zahl
  };
  const treffer = [];
  daten.forEach((d) => (d.e.choices || []).forEach((c, ci) => (c.roll || []).forEach((r) => {
    if (!r.fx) return;
    Object.entries(ERLAUBT).forEach(([k, werte]) => {
      if (r.fx[k] == null || !werte) return;
      if (!werte.includes(r.fx[k]))
        treffer.push(d.id + " Option " + (ci + 1) + ": fx." + k + " = " +
          JSON.stringify(r.fx[k]) + ", erlaubt sind " + werte.join(" | "));
    });
  })));
  hartePruefung("Wirkungen mit festen Werten benutzen erlaubte Werte", treffer);
}


console.log("\n-- Grundlinie --");

/* ------------------------------- G1) Inhaltlich fast gleiche Ereignisse */
{
  const treffer = [];
  for (let i = 0; i < daten.length; i++) {
    for (let j = i + 1; j < daten.length; j++) {
      const A = new Set(daten[i].w), B = new Set(daten[j].w);
      if (!A.size || !B.size) continue;
      const s = [...A].filter(x => B.has(x)).length / new Set([...A, ...B]).size;
      if (s >= AEHNLICH_AB) treffer.push({ s, a: daten[i], b: daten[j] });
    }
  }
  treffer.sort((x, y) => y.s - x.s);
  grundlinie("keine neuen fast gleichen Paare (ab " + Math.round(100 * AEHNLICH_AB) + " % Wortüberschneidung)",
    "aehnlichePaare",
    treffer.map(t => (100 * t.s).toFixed(0).padStart(3) + " %  " + t.a.id.padEnd(20) + " ↔ " +
      t.b.id.padEnd(20) + " „" + t.a.titel.slice(0, 26) + "“ / „" + t.b.titel.slice(0, 26) + "“"));
}

/* ------------------------------------------- G2) Flaggen ohne Wirkung */
/* Eine Flagge, die niemand liest, ist eine Entscheidung ohne Folgen. Kein
   Fehler — aber die verschenkte Wirkung, die Laufbahnen gleich anfuehlen
   laesst. Dasselbe Muster wie hsvZaehler in Abschnitt 6. */
{
  const gesetzt = new Set(); daten.forEach(d => d.flaggen.forEach(f => gesetzt.add(f)));
  const tot = [...gesetzt].filter(f =>
    (quelle.match(new RegExp("flags\\.\\s*" + f + "\\b", "g")) || []).length +
    (quelle.match(new RegExp("flags\\[[\"'`]" + f, "g")) || []).length === 0).sort();
  grundlinie("keine neuen folgenlosen Flaggen", "toteFlaggen", tot.map(f => "„" + f + "“"));
}

/* ------------------------------------------------- Bericht ohne Urteil */
console.log("\n-- Bericht --");
const anz = {}; daten.forEach(d => { const n = (d.e.choices || []).length; anz[n] = (anz[n] || 0) + 1; });
console.log("  Optionen je Ereignis:   " + Object.entries(anz).sort().map(([k, v]) => k + " → " + v).join("  ·  "));
const gesamtOpt = daten.reduce((n, d) => n + (d.e.choices || []).length, 0);
const mitBed = daten.reduce((n, d) => n + (d.e.choices || []).filter(c => c.cond).length, 0);
const mitWurf = daten.reduce((n, d) => n + (d.e.choices || []).filter((c) => c.manchmal != null).length, 0);
console.log("  Optionen nur manchmal:  " + mitWurf + " von " + gesamtOpt);
console.log("  Optionen mit Bedingung: " + mitBed + " von " + gesamtOpt +
    "   (35.7: 0 — Kennzahl für Punkt C)");
const feste = daten.reduce((n, d) => n + (d.e.choices || []).filter(c => (c.roll || []).length === 1).length, 0);
console.log("  Optionen ohne Würfel:   " + feste + " von " + gesamtOpt);
const fx = {}; daten.forEach(d => d.fxk.forEach(k => fx[k] = (fx[k] || 0) + 1));
console.log("  Häufigste Wirkungen:    " + Object.entries(fx).sort((a, b) => b[1] - a[1])
  .slice(0, 6).map(([k, v]) => k + " " + Math.round(100 * v / EV.length) + " %").join("  ·  "));
const tags = {}; EV.forEach(e => tags[e.tag] = (tags[e.tag] || 0) + 1);
const groesstes = Object.entries(tags).sort((a, b) => b[1] - a[1])[0];
console.log("  Themen:                 " + Object.keys(tags).length +
  ", größtes „" + groesstes[0] + "“ mit " + groesstes[1]);

console.log("\n" + ok + " Prüfungen in Ordnung · " + hart + " harte Treffer · " + weich + " über der Grundlinie");
process.exit(hart + weich ? 1 : 0);
