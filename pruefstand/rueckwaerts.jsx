import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { Shell, Pass, MenuScreen, CreateScreen, CompetitionView, StatsView, MoneyView,
  HistoryView, SquadView, TrophyView, HallScreen, EndScreen, NationalView, SocialView,
  AchievementScreen, BackupScreen, AkademieScreen, KarriereRueckblick, SaisonRueckblick,
  WildcardEnthuellung, WildcardCard, Guard,
  createPlayer, develop, drawEvents, applyFx, simulateSeason, makeOffers, marketValue, ovrOf,
  verdict, makeSquad, netWorth, leereBilanz, pick, CONT, POS, NATIONS, TYPES, MODES,
  leereAkademie, akaGruenden, akaJahr, vcFuer, vcPosten, akaVerbuchen,
} from "./probe.jsx";

let ok = 0, fehler = 0;
const meldungen = [];
const origErr = console.error;
/* Zwei Meldungen stammen aus der Prüfumgebung, nicht aus dem Spiel:
   die act()-Warnung zeitgesteuerter Animationen und das fehlende
   Canvas in jsdom. Alles andere zählt als Fehler. */
const HARMLOS = ["not wrapped in act", "getContext", "Not implemented"];
console.error = (...a) => { const t = String(a[0]);
  if (!HARMLOS.some((h) => t.includes(h))) meldungen.push(t.slice(0, 200)); };

function mach(name, el, minLaenge = 5) {
  const div = document.createElement("div"); document.body.appendChild(div);
  try {
    const root = createRoot(div);
    act(() => { root.render(el); });
    const t = div.textContent || "";
    if (t.length < minLaenge) throw new Error("Inhalt zu kurz (" + t.length + " Zeichen)");
    ok++;
  } catch (e) { fehler++; console.log("  ✗ " + name + " — " + (e && e.message ? e.message : e)); }
}

/* Eine vollständige Laufbahn, damit die Ansichten echte Daten bekommen */
function laufbahn(jahre, aka) {
  const nat = pick(NATIONS), pos = pick(Object.keys(POS));
  const typen = TYPES.filter((t) => !t.pos || t.pos.includes(pos));
  const q = createPlayer({ name:"Prüfling", nation:nat.id, pos, foot:"rechts", number:9,
    type:(pick(typen)||TYPES[0]).id, mode:pick(MODES).id, gender:"m", statur:"normal", aka });
  let letzte = null;
  for (let i = 0; i < jahre; i++) {
    if (q.age >= 41) break;
    develop(q); q.mv = marketValue(q);
    drawEvents(q, 2).forEach((e) => {
      q.evLog[e.id] = q.seasons.length;
      const ch = pick(e.choices); let out;
      if (ch.roll) { const r = Math.random(); let acc = 0; out = ch.roll[ch.roll.length - 1];
        for (const o of ch.roll) { acc += o.p; if (r <= acc) { out = o; break; } } } else out = { fx: ch.fx };
      applyFx(q, out.fx); q.ovr = ovrOf(q.attrs, q.pos);
    });
    if (q.endNow) break;
    letzte = simulateSeason(q);
    const of = makeOffers(q); if (!of.length) break;
    const best = [...of].sort((a, b) => b.club.s - a.club.s)[0];
    if (best.type === "transfer" || best.type === "loan") {
      q.club = best.club; q.squad = makeSquad(best.club, q.g); q.trust = 52;
      if (best.type === "transfer") { q.contract = best.years; q.wage = best.wage; }
      q.europeNext = best.club.s >= 74 ? CONT(best.club, 4) : null;
    } else if (best.type === "renew") { q.contract = best.years; q.wage = best.wage; }
    q.age += 1; q.year += 1;
  }
  q.verdict = verdict(q); q.retired = true;
  return { q, letzte };
}

const durchlauf = +(process.argv[2] || 1);
console.log("=== Rückwärtsprüfung, Durchlauf " + durchlauf + " ===");

let reif = akaGruenden({ ...leereAkademie(), vc: 700,
  stufen:{ plaetze:6, scouting:6, internat:6, medizin:6, lehre:6, buehne:6 } }, "Reifes Haus", 2026);
for (let i = 0; i < 22; i++) reif = akaJahr(reif, reif.jahr + 1).a;

/* Vier ganz verschiedene Laufbahnen: kurz, mittel, lang, mit Akademiebonus */
const faelle = [laufbahn(1, null), laufbahn(8, null), laufbahn(24, null), laufbahn(20, reif)];

faelle.forEach(({ q, letzte }, i) => {
  const nr = " #" + (i + 1);
  mach("Pass" + nr, <Shell><Pass p={q} full /></Shell>);
  mach("Verlauf" + nr, <Shell><HistoryView p={q} /></Shell>);
  mach("Statistik" + nr, <Shell><Guard><StatsView p={q} /></Guard></Shell>);
  mach("Tabelle" + nr, <Shell><Guard><CompetitionView p={q} /></Guard></Shell>);
  mach("Länderspiele" + nr, <Shell><Guard><NationalView p={q} /></Guard></Shell>);
  mach("Kader" + nr, <Shell><SquadView p={q} /></Shell>);
  mach("Öffentlichkeit" + nr, <Shell><Guard><SocialView p={q} /></Guard></Shell>);
  mach("Vitrine" + nr, <Shell><Guard><TrophyView p={q} /></Guard></Shell>);
  mach("Vermögen" + nr, <Shell><MoneyView p={q} onBuy={()=>{}} onInvest={()=>{}} onSell={()=>{}} onDonate={()=>{}} /></Shell>);
  mach("Wildcard" + nr, <Shell><WildcardCard card={q.wc} /></Shell>);
  const vc = vcFuer(q); const AK = akaVerbuchen(reif, vc);
  q.vcGewinn = vc; q.vcPosten = vcPosten(q);
  q.akaEreignisse = AK.ereignisse; q.akaName = AK.a.name; q.akaAktiv = true;
  mach("Abschluss" + nr, <EndScreen p={q} onNew={()=>{}} onHall={()=>{}} onAka={()=>{}} />);
  mach("Karriere-Rückblick" + nr, <KarriereRueckblick p={q} onFertig={()=>{}} />);
  if (letzte) mach("Saison-Rückblick" + nr, <SaisonRueckblick p={q} s={letzte} onFertig={()=>{}} />);
  if (q.wc) mach("Karten-Enthüllung" + nr, <WildcardEnthuellung card={q.wc} onFertig={()=>{}} />);
});

const halle = faelle.map(({ q }) => ({ name:q.name, pos:q.pos, nat:q.nation.flag, age:q.age,
  score:q.verdict.score, tier:q.verdict.tier, peak:q.peakOvr, titles:q.trophies.length,
  caps:q.nt.caps, goals:q.tot.goals, worth:netWorth(q), wc:q.wc?q.wc.n:null, wr:q.wc?q.wc.r:null }));
mach("Ruhmeshalle", <HallScreen hall={halle} onBack={()=>{}} />);
mach("Ruhmeshalle leer", <HallScreen hall={[]} onBack={()=>{}} />);
mach("Errungenschaften", <AchievementScreen ach={{}} ges={leereBilanz()} meta={{}} onBack={()=>{}} />);
mach("Sicherung", <BackupScreen onBack={()=>{}} onImport={()=>{}} />);
mach("Spielererstellung", <CreateScreen onStart={()=>{}} onBack={()=>{}} meta={{}} />);
mach("Hauptmenü", <MenuScreen hall={halle} onNew={()=>{}} onHall={()=>{}} save={null} onResume={()=>{}}
  onAch={()=>{}} achN={2} metaN={0} onBackup={()=>{}} ruhe={false} setRuhe={()=>{}} setRuheState={()=>{}}
  aka={reif} onAka={()=>{}} />);
mach("Akademie reif", <AkademieScreen aka={reif} onKauf={()=>{}} onGruenden={()=>{}} onBack={()=>{}} />);

/* Nicht auf console.error zurückstellen: Warnungen aus zeitgesteuerten
   Animationen treffen erst nach dem Skriptende ein und würden die
   Ausgabe zumüllen. Echte Meldungen kommen weiterhin durch. */
console.error = (...a) => { const t = String(a[0]);
  if (!HARMLOS.some((h) => t.includes(h))) origErr("  ! " + t.slice(0, 200)); };
if (meldungen.length) {
  console.log("  Meldungen von React:");
  [...new Set(meldungen)].slice(0, 6).forEach((x) => console.log("    ! " + x));
  fehler += meldungen.length;
}
console.log("  " + ok + " Ansichten fehlerfrei, " + fehler + " Fehler.");
if (fehler) process.exit(1);
