/* Strukturell statt per Zufall. Simulation beantwortet die Frage nicht:
   bei 212 Nationen gleichverteilt kommt Deutschland ein-, zweimal vor, und
   ob dann ein Bundesligist auftaucht, ist Würfelglück. Also direkt fragen:
   welche Liga kann START sein, welche kann ZIEL eines Wechsels sein? */
const A = require("./motor.js");
const C = A.CLUBS, LG = [...new Set(C.map((c) => c.l))];
const alle = {}; C.forEach((c) => { alle[c.l] = (alle[c.l] || 0) + 1; });

/* 1. Startligen: homeLeagues für JEDE Nation, beide Geschlechter. */
const start = new Set();
A.NATIONS.forEach((n) => ["m", "w"].forEach((g) => {
  try { (A.homeLeagues(n.id, g) || []).forEach((l) => start.add(l)); } catch (e) {}
}));

/* 2. Wechselziele: makeOffers vielfach über ein breites Feld von Spielern —
   verschiedene Stärken, Alter, Nationen, beide Geschlechter. */
const ziel = new Set(), zielV = new Set();
const TY = Object.keys(A.TYPES), MO = Object.keys(A.MODES), PO = Object.keys(A.POS);
const grosse = A.NATIONS.map((n) => n.id);   /* ALLE Nationen, nicht nur die grossen — der erste Versuch nahm zwoelf und schloss damit ganze Erdteile aus. */
for (let i = 0; i < 4000; i++) {
  const g = i % 3 === 0 ? "w" : "m";
  let p;
  try {
    p = A.createPlayer({ name: "P", nation: grosse[i % grosse.length], pos: PO[i % PO.length],
      foot: "r", number: 9, type: TY[i % TY.length], mode: MO[i % MO.length], gender: g });
  } catch (e) { continue; }
  /* Stärke künstlich anheben: nur so kommen Spitzenvereine ins Angebot. */
  p.ovr = 40 + (i % 55); p.age = 18 + (i % 18); p.contract = 0; p.trust = 50 + (i % 50);
  p.lastNote = 2 + (i % 3); p.seasons = [{ apps: 20 + (i % 15), goals: i % 20 }];
  try { (A.makeOffers(p) || []).forEach((o) => { if (o.club) { ziel.add(o.club.l); zielV.add(o.club.n); } }); } catch (e) {}
}

const erreichbar = new Set([...start, ...ziel]);
console.log("Ligen gesamt:            " + LG.length);
console.log("als Startliga möglich:   " + start.size);
console.log("als Wechselziel möglich: " + ziel.size);
console.log("insgesamt erreichbar:    " + erreichbar.size);
const nie = LG.filter((l) => !erreichbar.has(l));
console.log("Vereine als Ziel moeglich: " + zielV.size + " von " + C.length);
console.log("NIE erreichbar:          " + nie.length);
nie.forEach((l) => console.log("   " + l + " (" + alle[l] + " Vereine)"));
