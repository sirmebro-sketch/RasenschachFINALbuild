/* gleichheit.cjs — beweist, dass eine Umschichtung nichts veraendert hat.
   =========================================================================
   AUFRUF:  node pruefstand/gleichheit.cjs <pfad/zu/motor.js>
   Gibt einen JSON-Abzug auf die Ausgabe. Zwei Staende sind gleich, wenn die
   Abzuege byte-gleich sind:

       node pruefstand/gleichheit.cjs /tmp/alt/motor.js > /tmp/a.json
       node pruefstand/gleichheit.cjs /tmp/neu/motor.js > /tmp/b.json
       cmp /tmp/a.json /tmp/b.json

   WARUM ES DAS GIBT: beim Auszug der Akademie nach akademie.js (35.48) war
   der Pruefstand gruen — er waere es aber auch gewesen, wenn dabei eine
   Wahrscheinlichkeit verrutscht waere. Die Kalibrierung misst Mittelwerte
   ueber 300 Laufbahnen; eine Verschiebung um ein Prozent verschwindet darin.
   Deshalb hier: fester Zufall, Zeichen fuer Zeichen verglichen.

   GEGENPROBE, die dieses Werkzeug selbst rechtfertigt: mit `.15` statt `.151`
   in einer einzigen Zeile von akademie.js weichen 10 von 125 Akademiejahren
   ab. Eine Probe, die nur Gleichheit meldet und nie Ungleichheit, beweist
   nichts — das ist bei jeder kuenftigen Umschichtung mitzupruefen.

   NICHT geeignet fuer Aenderungen, die etwas veraendern SOLLEN. Dafuer ist
   sie gerade nicht gedacht.                                                */
const M = require(process.argv[2]);

/* Fester Zufall. Wird NACH dem Laden gesetzt, damit Modulcode beim Laden
   nicht schon Zahlen aus der Folge zieht und beide Staende verschoben sind. */
function saat(z) {
  return function () {
    z |= 0; z = (z + 0x6D2B79F5) | 0;
    let t = Math.imul(z ^ (z >>> 15), 1 | z);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const raus = [];
const zeig = (x) => JSON.parse(JSON.stringify(x));

for (const s of [1, 7, 42, 1234, 99999]) {
  Math.random = saat(s);
  let a = M.akaGruenden(M.leereAkademie(), "Probeakademie", 2026);
  const lauf = { saat: s, jahre: [] };

  for (let j = 1; j <= 25; j++) {
    /* Ausbau in fester Reihenfolge, damit alle Abteilungen vorkommen */
    const abt = M.ABTEILUNGEN[(j - 1) % M.ABTEILUNGEN.length];
    a = { ...a, vc: (a.vc || 0) + 40 };
    const preis = M.akaPreis(a, abt.id);
    if (preis != null && a.vc >= preis) {
      a = { ...a, vc: a.vc - preis,
            stufen: { ...a.stufen, [abt.id]: M.akaStufe(a, abt.id) + 1 } };
    }
    const r = M.akaJahr(a, 2026 + j);
    a = r.a || r.akademie || r[0] || r;
    lauf.jahre.push({
      j,
      talente: (a.talente || []).map((t) => [t.name, t.pos, t.alter, t.ovr, t.pot, t.nat]),
      absolventen: (a.absolventen || []).map((x) => [x.name, x.peak, x.ns, x.klub, x.raus]),
      bilanz: zeig(a.bilanz),
      chronik: (a.chronik || []).slice(-3),
      ereignisse: zeig(r.E || r.ereignisse || []),
      ruhm: M.akaRuhm(a),
      ausbau: M.akaAusbau(a),
      rest: M.akaRestkosten(a),
      spanne: M.akaSpanne(a),
      leistbar: M.akaLeistbar(a),
      jahrNr: M.akaJahrNr(a),
      gabe: zeig(M.akaBonus(a)),
      naechste: zeig(M.akaNaechsteGabe(a)),
      gabeText: M.akaBonusText(M.akaBonus(a)),
      naechsterAusbau: zeig(M.akaNaechster(a)),
    });
  }

  /* talentBauen einzeln, mit denselben Zahlen */
  lauf.talente20 = [];
  for (let i = 0; i < 20; i++) {
    const t = M.talentBauen(a, 2051, i % 4 === 0 ? "TW" : null);
    lauf.talente20.push([t.name, t.pos, t.alter, t.ovr, t.pot, t.nat, t.flag]);
  }
  lauf.verbucht = zeig(M.akaVerbuchen(a, 123, 2052));
  lauf.schwelle = zeig(M.AKA_SCHWELLE);
  lauf.konstanten = [M.AKA_MAX, M.AKA_STUFEN, M.ABTEILUNGEN.map((x) => x.id).join(",")];
  raus.push(lauf);
}

process.stdout.write(JSON.stringify(raus));
