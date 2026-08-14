import React, { useState, useEffect, useRef, useMemo } from "react";
import { store } from "./storage.js";
import { SCHRIFTEN } from "./schriften.js";

/* ================================================================
   FLUTLICHT v4 — Karriere-Simulator
   ================================================================ */

const NAME = "Rasenschach XI";
const VERSION = "34.20";
const VERSION_INFO = "Der Laden hat ein Symbol neben dem Zahnrad und zeigt immer alle Artikel — was noch nicht geht, ist gesperrt statt unsichtbar.";

/* Fester Zufallsstrom aus einer Zeichenkette — damit Angebote des eigenen
   Vereins nicht bei jedem Klick anders aussehen.                        */
const hashStr = (t) => { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
/* Fester Winkel je Gegenstand — sieht zufällig aus, ist es aber nicht.
   Dieselbe Errungenschaft, dieselbe Karte sitzt dadurch immer gleich schief. */
const winkel = (k) => (((hashStr(String(k)) % 13) - 6) / 8) + "deg";
const mulberry = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const chance = (p) => Math.random() < p;
const gauss = (m, s) => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const eur = (m) => {
  if (m == null || !isFinite(m)) return "—";
  const x = Math.abs(m), s = m < 0 ? "−" : "";
  if (x >= 1000) return s + (x / 1000).toFixed(2) + " Mrd";
  if (x >= 100) return s + Math.round(x) + " Mio";
  if (x >= 10) return s + x.toFixed(0) + " Mio";
  if (x >= 1) return s + x.toFixed(1) + " Mio";
  return s + Math.round(x * 1000) + " Tsd";
};
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); };
/* Poisson-verteilte Torzahl für die Spielsimulation */
const poisson = (l) => { const L = Math.exp(-Math.max(.02, l)); let k = 0, p = 1, g = 0;
  do { k++; p *= Math.random(); } while (p > L && g++ < 60); return k - 1; };
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => clamp(Math.round(v + amt), 0, 255);
  return "#" + [f((n >> 16) & 255), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("");
};

/* ---------------- Positionen ---------------- */
const POS = {
  TW:  { label:"Torwart",               short:"TW",  w:{pac:.20,sho:.05,pas:.10,dri:.20,def:.35,phy:.10}, g:0,    a:.012 },
  IV:  { label:"Innenverteidiger",      short:"IV",  w:{pac:.12,sho:.03,pas:.12,dri:.05,def:.45,phy:.23}, g:.055, a:.03 },
  AV:  { label:"Außenverteidiger",      short:"AV",  w:{pac:.24,sho:.04,pas:.18,dri:.14,def:.28,phy:.12}, g:.04,  a:.15 },
  ZDM: { label:"Defensives Mittelfeld", short:"ZDM", w:{pac:.10,sho:.06,pas:.24,dri:.12,def:.32,phy:.16}, g:.07,  a:.11 },
  ZM:  { label:"Zentrales Mittelfeld",  short:"ZM",  w:{pac:.10,sho:.14,pas:.30,dri:.20,def:.14,phy:.12}, g:.14,  a:.20 },
  ZOM: { label:"Offensives Mittelfeld", short:"ZOM", w:{pac:.12,sho:.20,pas:.28,dri:.26,def:.04,phy:.10}, g:.25,  a:.30 },
  AF:  { label:"Flügelstürmer",         short:"AF",  w:{pac:.26,sho:.20,pas:.16,dri:.28,def:.02,phy:.08}, g:.35,  a:.26 },
  ST:  { label:"Mittelstürmer",         short:"ST",  w:{pac:.20,sho:.38,pas:.08,dri:.16,def:.01,phy:.17}, g:.58,  a:.15 },
};
const AK = ["pac", "sho", "pas", "dri", "def", "phy"];
const AL = { pac:"Tempo", sho:"Abschluss", pas:"Passspiel", dri:"Dribbling", def:"Defensive", phy:"Physis" };
const AL_TW = { pac:"Reflexe", sho:"Strafraum", pas:"Aufbau", dri:"Handling", def:"Stellung", phy:"Sprungkraft" };
const aLab = (pos, k) => (pos === "TW" ? AL_TW[k] : AL[k]);

const TYPES = [
  /* ---------------- TORWART ---------------- */
  { id:"tw_linie",     name:"Linientorhüter",      desc:"Auf der Linie kaum zu überwinden, mit dem Fuß unsicher.", mod:{def:9,dri:4,pas:-8,phy:-3}, pos:["TW"], trait:"Reflexstark" },
  { id:"tw_strafraum", name:"Strafraumbeherrscher",desc:"Bei Flanken gehört ihm der Sechzehner.",                  mod:{phy:9,def:5,pac:-4,dri:-4}, pos:["TW"], inj:-8, trait:"Luftherrschaft" },
  { id:"tw_fuss",      name:"Mitspielender Torhüter",desc:"Elfter Feldspieler, auf der Linie fehleranfällig.",     mod:{pas:11,dri:6,def:-5,phy:-4}, pos:["TW"], trait:"Fuß wie ein Sechser" },
  { id:"tw_elfer",     name:"Elfmetertöter",       desc:"Liest jeden Anlauf, im Spiel eher unauffällig.",          mod:{def:6,dri:5,pas:-4,phy:-3}, pos:["TW"], trait:"Nervenstark" },
  { id:"tw_kommando",  name:"Kommandogeber",       desc:"Organisiert die Abwehr, bleibt selbst lieber stehen.",    mod:{def:7,pas:4,pac:-6,dri:-2}, pos:["TW"], trait:"Chef der Kette" },
  { id:"tw_athlet",    name:"Athletischer Keeper", desc:"Sprungkraft und Reichweite wie kaum jemand sonst.",       mod:{pac:7,phy:7,pas:-6,def:-1}, pos:["TW"], inj:-10, trait:"Katzenhaft" },

  /* ---------------- INNENVERTEIDIGUNG ---------------- */
  { id:"iv_abraeumer", name:"Abräumer",            desc:"Räumt alles ab, im Aufbau begrenzt.",                     mod:{def:9,phy:6,pas:-6,dri:-5}, pos:["IV"], trait:"Unüberwindbar" },
  { id:"iv_aufbau",    name:"Spieleröffner",       desc:"Beginnt jeden Angriff, im Duell weniger stark.",          mod:{pas:10,dri:4,def:-5,phy:-4}, pos:["IV"], trait:"Diagonalball" },
  { id:"iv_kopf",      name:"Luftkämpfer",         desc:"In beiden Strafräumen eine Waffe bei Standards.",         mod:{phy:8,sho:4,pac:-5,dri:-3}, pos:["IV"], trait:"Kopfballstark" },
  { id:"iv_tempo",     name:"Tempoverteidiger",    desc:"Bügelt jeden Fehler mit Geschwindigkeit aus.",            mod:{pac:9,def:3,phy:-4,pas:-4}, pos:["IV"], trait:"Letzter Mann" },
  { id:"iv_mann",      name:"Manndecker",          desc:"Klebt am Gegenspieler, kümmert sich um sonst nichts.",    mod:{def:10,phy:4,pas:-7,sho:-4}, pos:["IV"], trait:"Klettenmanndecker" },
  { id:"iv_libero",    name:"Libero",              desc:"Liest das Spiel und schiebt heraus, bevor es brennt.",    mod:{pas:6,def:6,dri:3,pac:-5,phy:-4}, pos:["IV"], trait:"Spielintelligenz" },

  /* ---------------- AUSSENVERTEIDIGUNG ---------------- */
  { id:"av_schiene",   name:"Schienenspieler",     desc:"Rauf und runter, neunzig Minuten lang.",                  mod:{pac:8,phy:6,sho:-4,def:-2}, pos:["AV"], trait:"Endlose Bahn" },
  { id:"av_flanke",    name:"Flankengeber",        desc:"Seine Hereingaben kommen an, auch aus vollem Lauf.",      mod:{pas:9,dri:3,def:-4,phy:-3}, pos:["AV"], trait:"Präzise Hereingabe" },
  { id:"av_defensiv",  name:"Defensiver Außen",    desc:"Macht die Seite zu, nach vorn passiert wenig.",           mod:{def:9,phy:4,pas:-5,dri:-5}, pos:["AV"], trait:"Seite dicht" },
  { id:"av_invers",    name:"Invertierter Außen",  desc:"Zieht ins Zentrum und spielt wie ein Sechser.",           mod:{pas:8,dri:5,phy:-5,def:-3}, pos:["AV"], trait:"Rückt ein" },
  { id:"av_tempo",     name:"Tempodribbler",       desc:"Geht jedes Eins gegen eins, defensiv ein Risiko.",        mod:{dri:8,pac:6,def:-7,phy:-2}, pos:["AV"], trait:"Über außen weg" },
  { id:"av_kampf",     name:"Zweikampftier",       desc:"Kein Flügelstürmer geht gern in dieses Duell.",           mod:{def:7,phy:7,pas:-5,sho:-4}, pos:["AV"], trait:"Kompromisslos" },

  /* ---------------- DEFENSIVES MITTELFELD ---------------- */
  { id:"zdm_abraeumer",name:"Staubsauger",         desc:"Erobert mehr Bälle als der Rest zusammen.",               mod:{def:9,phy:5,pas:-4,dri:-6}, pos:["ZDM"], trait:"Ballgewinner" },
  { id:"zdm_regista",  name:"Aufbausechser",       desc:"Das ganze Spiel läuft über seinen Fuß.",                  mod:{pas:11,dri:3,def:-4,phy:-5}, pos:["ZDM"], trait:"Taktgeber" },
  { id:"zdm_box",      name:"Box-to-Box",          desc:"In beiden Strafräumen zu Hause, nirgends perfekt.",       mod:{phy:6,pac:5,sho:3,dri:-4,pas:-4}, pos:["ZDM","ZM"], trait:"Dauerläufer" },
  { id:"zdm_zerstoerer",name:"Zerstörer",          desc:"Unterbindet jeden Spielaufbau, notfalls mit Foul.",       mod:{def:10,phy:6,pas:-7,sho:-5}, pos:["ZDM"], trait:"Taktisches Foul" },
  { id:"zdm_absich",   name:"Absicherer",          desc:"Steht immer richtig, läuft nie zu viel.",                 mod:{def:7,pas:5,pac:-6,dri:-3}, pos:["ZDM"], trait:"Stellungsspiel" },
  { id:"zdm_metronom", name:"Metronom",            desc:"Bestimmt das Tempo, ohne selbst aufzufallen.",            mod:{pas:8,dri:4,phy:-4,pac:-4}, pos:["ZDM"], trait:"Ballsicher" },

  /* ---------------- ZENTRALES MITTELFELD ---------------- */
  { id:"zm_regisseur", name:"Regisseur",           desc:"Sieht den Pass vor allen anderen.",                       mod:{pas:10,sho:2,phy:-5,pac:-4}, pos:["ZM"], trait:"Der letzte Pass" },
  { id:"zm_techniker", name:"Techniker",           desc:"Erste Berührung sitzt, Zweikampf nicht.",                 mod:{dri:8,pas:5,phy:-7,def:-3}, pos:["ZM","ZOM"], inj:6, trait:"Feiner Fuß" },
  { id:"zm_distanz",   name:"Distanzschütze",      desc:"Aus fünfundzwanzig Metern denkt er nicht lange nach.",    mod:{sho:9,pas:3,def:-5,phy:-4}, pos:["ZM"], trait:"Aus der Zweiten" },
  { id:"zm_arbeit",    name:"Arbeitsbiene",        desc:"Wenig Talent, unendlich Fleiß.",                          mod:{phy:7,def:5,pac:3,dri:-6,sho:-6}, pos:["ZM"], trait:"Laufwunder" },
  { id:"zm_stratege",  name:"Stratege",            desc:"Verliert nie den Ball, riskiert aber auch wenig.",        mod:{pas:7,def:4,dri:2,sho:-6,pac:-5}, pos:["ZM"], trait:"Ballsicher" },

  /* ---------------- OFFENSIVES MITTELFELD ---------------- */
  { id:"zom_zehner",   name:"Klassischer Zehner",  desc:"Lebt zwischen den Linien, arbeitet nicht zurück.",        mod:{pas:9,dri:6,sho:3,def:-10,phy:-5}, pos:["ZOM"], trait:"Zwischen den Linien" },
  { id:"zom_schatten", name:"Schattenstürmer",     desc:"Kommt aus der zweiten Reihe und trifft.",                 mod:{sho:8,dri:5,def:-8,pas:-2}, pos:["ZOM"], trait:"Zweite Welle" },
  { id:"zom_dribbler", name:"Dribbelkünstler",     desc:"Eins gegen eins fast unhaltbar, im Abschluss wechselhaft.",mod:{dri:10,pac:5,sho:-3,def:-7}, pos:["ZOM","AF"], trait:"Eins gegen eins" },
  { id:"zom_standard", name:"Standardspezialist",  desc:"Freistöße und Ecken sind seine Waffe.",                   mod:{pas:7,sho:6,phy:-6,def:-5}, pos:["ZOM"], trait:"Ruhender Ball" },
  { id:"zom_pressing", name:"Pressingmaschine",    desc:"Jagt jeden Ball, technisch nicht der Feinste.",           mod:{pac:7,phy:6,def:4,dri:-6,pas:-5}, pos:["ZOM"], trait:"Gegenpressing" },

  /* ---------------- FLÜGEL ---------------- */
  { id:"af_tiefe",     name:"Tiefenläufer",        desc:"Der Ball in die Schnittstelle, und er ist weg.",          mod:{pac:9,sho:4,pas:-5,def:-4}, pos:["AF","ST"], trait:"Schnittstelle" },
  { id:"af_flanke",    name:"Klassischer Flügel",  desc:"Geht bis zur Grundlinie und flankt.",                     mod:{pas:8,pac:5,sho:-4,def:-5}, pos:["AF"], trait:"Bis zur Linie" },
  { id:"af_invers",    name:"Invertierter Flügel", desc:"Zieht nach innen und sucht den Abschluss.",               mod:{sho:9,dri:4,def:-7,phy:-3}, pos:["AF"], trait:"Zieht rein" },
  { id:"af_arbeit",    name:"Arbeitender Flügel",  desc:"Verteidigt mit, dafür fehlt der letzte Glanz.",           mod:{def:7,phy:6,pac:3,dri:-6,sho:-5}, pos:["AF"], trait:"Nach hinten arbeitend" },
  { id:"af_strasse",   name:"Straßenfußballer",    desc:"Unberechenbar am Ball, defensiv nachlässig.",             mod:{dri:8,pas:3,def:-7,phy:-3}, pos:["AF"], trait:"Unberechenbar" },

  /* ---------------- MITTELSTÜRMER ---------------- */
  { id:"st_vollstr",   name:"Vollstrecker",        desc:"Eine halbe Chance genügt ihm.",                           mod:{sho:11,pac:3,pas:-6,def:-6}, pos:["ST"], trait:"Kaltschnäuzig" },
  { id:"st_wand",      name:"Wandspieler",         desc:"Hält jeden Ball fest und legt ab.",                       mod:{phy:9,pas:6,pac:-6,dri:-4}, pos:["ST"], trait:"Rücken zum Tor" },
  { id:"st_kopf",      name:"Kopfballstürmer",     desc:"Jede Flanke in den Sechzehner ist eine Torchance.",       mod:{phy:8,sho:6,pac:-5,dri:-5}, pos:["ST"], trait:"Luftherrschaft" },
  { id:"st_falsche9",  name:"Falsche Neun",        desc:"Lässt sich fallen und legt auf, statt selbst zu treffen.",mod:{pas:9,dri:6,phy:-6,sho:-3}, pos:["ST"], trait:"Kommt entgegen" },
  { id:"st_kaempfer",  name:"Arbeitsstürmer",      desc:"Stört, läuft und ackert. Tore macht er nebenbei.",        mod:{phy:8,def:6,pac:3,sho:-6,dri:-5}, pos:["ST"], trait:"Erster Verteidiger" },
];
const typesFor = (pos) => TYPES.filter((t) => !t.pos || t.pos.includes(pos));
const MODES = [
  { id:"aufstieg", name:"Aufstieg",     desc:"Mehr Talent, weniger Pech.",   pot:6,  inj:-8, decay:.8 },
  { id:"realismus",name:"Realismus",    desc:"Ausgeglichen. Empfohlen.",     pot:0,  inj:0,  decay:1 },
  { id:"knochen",  name:"Knochenmühle", desc:"Wenig Talent, harte Landung.", pot:-7, inj:12, decay:1.25 },
];

/* NATIONEN: siehe Block nach den Ligen */

/* ---------------- Vereine ---------------- */
const RAW = [
  ["FC Bayern München","GER","Bundesliga",93],["Bayer Leverkusen","GER","Bundesliga",84],["Borussia Dortmund","GER","Bundesliga",85],
  ["RB Leipzig","GER","Bundesliga",82],["VfB Stuttgart","GER","Bundesliga",81],["Eintracht Frankfurt","GER","Bundesliga",80],
  ["SC Freiburg","GER","Bundesliga",75],["VfL Wolfsburg","GER","2. Bundesliga",69],["Bor. Mönchengladbach","GER","Bundesliga",74],
  ["Werder Bremen","GER","Bundesliga",73],["TSG Hoffenheim","GER","Bundesliga",74],["1. FSV Mainz 05","GER","Bundesliga",72],
  ["1. FC Union Berlin","GER","Bundesliga",71],["FC Augsburg","GER","Bundesliga",70],["FC St. Pauli","GER","2. Bundesliga",64],
  ["1. FC Heidenheim","GER","2. Bundesliga",62],["VfL Bochum","GER","2. Bundesliga",61],["Holstein Kiel","GER","2. Bundesliga",60],
  ["Hamburger SV","GER","Bundesliga",70],["1. FC Köln","GER","Bundesliga",69],["FC Schalke 04","GER","Bundesliga",68],
  ["Hertha BSC","GER","2. Bundesliga",63],["Fortuna Düsseldorf","GER","3. Liga",56],["Hannover 96","GER","2. Bundesliga",62],
  ["1. FC Nürnberg","GER","2. Bundesliga",61],["1. FC Kaiserslautern","GER","2. Bundesliga",61],["Karlsruher SC","GER","2. Bundesliga",60],
  ["SC Paderborn","GER","Bundesliga",64],["SV Elversberg","GER","Bundesliga",64],["1. FC Magdeburg","GER","2. Bundesliga",58],
  ["Greuther Fürth","GER","2. Bundesliga",57],["Eintracht Braunschweig","GER","2. Bundesliga",56],["Preußen Münster","GER","3. Liga",51],
  ["SSV Ulm","GER","2. Bundesliga",54],["Jahn Regensburg","GER","2. Bundesliga",53],
  ["Hansa Rostock","GER","3. Liga",52],["Dynamo Dresden","GER","3. Liga",52],["Arminia Bielefeld","GER","3. Liga",52],
  ["Rot-Weiss Essen","GER","3. Liga",51],["VfL Osnabrück","GER","2. Bundesliga",55],["1. FC Saarbrücken","GER","3. Liga",50],
  ["Erzgebirge Aue","GER","3. Liga",49],["SV Waldhof Mannheim","GER","3. Liga",49],["MSV Duisburg","GER","3. Liga",48],
  ["Energie Cottbus","GER","2. Bundesliga",54],["SV Sandhausen","GER","3. Liga",47],["SC Verl","GER","3. Liga",47],
  ["Manchester City","ENG","Premier League",90],["FC Liverpool","ENG","Premier League",89],["FC Arsenal","ENG","Premier League",90],
  ["FC Chelsea","ENG","Premier League",87],["Manchester United","ENG","Premier League",84],["Tottenham Hotspur","ENG","Premier League",79],
  ["Newcastle United","ENG","Premier League",83],["Aston Villa","ENG","Premier League",81],["Brighton & Hove","ENG","Premier League",79],
  ["West Ham United","ENG","Championship",70],["AFC Bournemouth","ENG","Premier League",75],["Crystal Palace","ENG","Premier League",75],
  ["FC Brentford","ENG","Premier League",74],["FC Fulham","ENG","Premier League",74],["Nottingham Forest","ENG","Premier League",74],
  ["FC Everton","ENG","Premier League",72],["Wolverhampton","ENG","Championship",66],["Leicester City","ENG","Championship",65],
  ["Leeds United","ENG","Premier League",71],["AFC Sunderland","ENG","Premier League",72],["Sheffield United","ENG","Championship",63],
  ["West Bromwich Albion","ENG","Championship",62],["Norwich City","ENG","Championship",62],["FC Middlesbrough","ENG","Championship",61],
  ["Coventry City","ENG","Premier League",68],["FC Watford","ENG","Championship",59],["Blackburn Rovers","ENG","Championship",58],
  ["Stoke City","ENG","Championship",57],["Hull City","ENG","Premier League",66],["Portsmouth FC","ENG","Championship",55],
  ["Real Madrid","ESP","La Liga",91],["FC Barcelona","ESP","La Liga",93],["Atlético Madrid","ESP","La Liga",85],
  ["Athletic Bilbao","ESP","La Liga",81],["Real Sociedad","ESP","La Liga",77],["FC Villarreal","ESP","La Liga",79],
  ["Real Betis","ESP","La Liga",78],["FC Sevilla","ESP","La Liga",76],["FC Girona","ESP","LaLiga 2",66],
  ["FC Valencia","ESP","La Liga",74],["Celta Vigo","ESP","La Liga",72],["CA Osasuna","ESP","La Liga",71],
  ["Rayo Vallecano","ESP","La Liga",70],["RCD Mallorca","ESP","LaLiga 2",64],["FC Getafe","ESP","La Liga",69],
  ["Deportivo Alavés","ESP","La Liga",68],
  ["RCD Espanyol","ESP","LaLiga 2",62],["UD Levante","ESP","LaLiga 2",61],["Sporting Gijón","ESP","LaLiga 2",60],
  ["Racing Santander","ESP","La Liga",68],["Deportivo La Coruña","ESP","La Liga",67],["SD Eibar","ESP","LaLiga 2",58],
  ["Real Zaragoza","ESP","LaLiga 2",57],["FC Málaga","ESP","LaLiga 2",56],
  ["Inter Mailand","ITA","Serie A",90],["AC Mailand","ITA","Serie A",86],["Juventus Turin","ITA","Serie A",83],
  ["SSC Neapel","ITA","Serie A",85],["Atalanta Bergamo","ITA","Serie A",83],["AS Rom","ITA","Serie A",82],
  ["Lazio Rom","ITA","Serie A",79],["AC Florenz","ITA","Serie A",78],["FC Bologna","ITA","Serie A",77],
  ["FC Turin","ITA","Serie A",73],["Udinese Calcio","ITA","Serie A",72],["Como 1907","ITA","Serie A",75],
  ["FC Genua","ITA","Serie A",70],["Cagliari Calcio","ITA","Serie A",68],["Hellas Verona","ITA","Serie B",60],["FC Empoli","ITA","Serie A",66],
  ["FC Parma","ITA","Serie B",61],["Palermo FC","ITA","Serie B",60],["Sampdoria Genua","ITA","Serie B",60],
  ["US Cremonese","ITA","Serie B",57],["Pisa SC","ITA","Serie B",56],["SSC Bari","ITA","Serie C",52],
  ["Spezia Calcio","ITA","Serie C",52],["US Catanzaro","ITA","Serie B",56],
  ["Paris Saint-Germain","FRA","Ligue 1",93],["AS Monaco","FRA","Ligue 1",80],["Olympique Marseille","FRA","Ligue 1",82],
  ["OSC Lille","FRA","Ligue 1",79],["Olympique Lyon","FRA","Ligue 1",78],["OGC Nizza","FRA","Ligue 1",75],
  ["RC Lens","FRA","Ligue 1",76],["Stade Rennes","FRA","Ligue 1",75],["RC Straßburg","FRA","Ligue 1",73],
  ["FC Toulouse","FRA","Ligue 1",72],["Stade Brest","FRA","Ligue 1",71],["FC Nantes","FRA","Ligue 2",62],
  ["Stade Reims","FRA","Ligue 1",68],["AJ Auxerre","FRA","Ligue 1",67],["Le Havre AC","FRA","Ligue 1",65],["Angers SCO","FRA","Ligue 1",64],
  ["AS Saint-Étienne","FRA","Ligue 2",62],["FC Metz","FRA","Ligue 2",58],["Girondins Bordeaux","FRA","Ligue 2",58],
  ["SM Caen","FRA","Ligue 2",56],["EA Guingamp","FRA","Ligue 2",55],["Grenoble Foot","FRA","Ligue 2",55],
  ["PSV Eindhoven","NED","Eredivisie",80],["Feyenoord Rotterdam","NED","Eredivisie",79],["Ajax Amsterdam","NED","Eredivisie",78],
  ["AZ Alkmaar","NED","Eredivisie",73],["FC Twente","NED","Eredivisie",72],["FC Utrecht","NED","Eredivisie",70],
  ["NEC Nijmegen","NED","Eredivisie",66],["SC Heerenveen","NED","Eredivisie",65],["FC Groningen","NED","Eredivisie",64],
  ["Sparta Rotterdam","NED","Eredivisie",63],["Willem II","NED","Eredivisie",62],["Go Ahead Eagles","NED","Eredivisie",63],
  ["SL Benfica","POR","Liga Portugal",83],["Sporting Lissabon","POR","Liga Portugal",82],["FC Porto","POR","Liga Portugal",81],
  ["SC Braga","POR","Liga Portugal",76],["Vitória Guimarães","POR","Liga Portugal",70],["FC Famalicão","POR","Liga Portugal",64],
  ["Boavista Porto","POR","Liga Portugal",63],["Rio Ave FC","POR","Liga Portugal",62],["GD Estoril","POR","Liga Portugal",62],
  ["Olympiakos Piräus","GRE","Super League",75],["PAOK Thessaloniki","GRE","Super League",73],["Panathinaikos Athen","GRE","Super League",73],
  ["AEK Athen","GRE","Super League",72],["Aris Thessaloniki","GRE","Super League",68],["OFI Kreta","GRE","Super League",62],
  ["Asteras Tripolis","GRE","Super League",60],["Volos NFC","GRE","Super League",59],["Levadiakos FC","GRE","Super League",57],
  ["Galatasaray Istanbul","TUR","Süper Lig",78],["Fenerbahce Istanbul","TUR","Süper Lig",78],["Besiktas Istanbul","TUR","Süper Lig",74],
  ["Trabzonspor","TUR","Süper Lig",72],["Istanbul Basaksehir","TUR","Süper Lig",69],["Samsunspor","TUR","Süper Lig",65],
  ["Konyaspor","TUR","Süper Lig",63],["Antalyaspor","TUR","Süper Lig",62],
  ["Celtic Glasgow","SCO","Scottish Premiership",72],["Glasgow Rangers","SCO","Scottish Premiership",71],["Heart of Midlothian","SCO","Scottish Premiership",62],
  ["FC Brügge","BEL","Jupiler Pro League",74],["RSC Anderlecht","BEL","Jupiler Pro League",71],["KRC Genk","BEL","Jupiler Pro League",71],
  ["Royal Antwerpen","BEL","Jupiler Pro League",69],["Union Saint-Gilloise","BEL","Jupiler Pro League",72],
  ["RB Salzburg","AUT","Bundesliga (AT)",73],["Sturm Graz","AUT","Bundesliga (AT)",70],["Rapid Wien","AUT","Bundesliga (AT)",66],["Austria Wien","AUT","Bundesliga (AT)",64],
  ["BSC Young Boys","SUI","Super League (CH)",70],["FC Basel","SUI","Super League (CH)",69],["FC Zürich","SUI","Super League (CH)",64],["FC Luzern","SUI","Super League (CH)",62],
  ["FC Kopenhagen","DEN","Superliga",70],["FC Midtjylland","DEN","Superliga",69],["Bröndby IF","DEN","Superliga",65],
  ["Bodö/Glimt","NOR","Eliteserien",70],["Rosenborg Trondheim","NOR","Eliteserien",63],["Malmö FF","SWE","Allsvenskan",66],["AIK Solna","SWE","Allsvenskan",63],
  ["Slavia Prag","CZE","Chance Liga",71],["Sparta Prag","CZE","Chance Liga",70],["Dinamo Zagreb","CRO","HNL",71],["Hajduk Split","CRO","HNL",66],
  ["Roter Stern Belgrad","SRB","Superliga (SRB)",71],["Partizan Belgrad","SRB","Superliga (SRB)",66],
  ["Legia Warschau","POL","Ekstraklasa",66],["Lech Posen","POL","Ekstraklasa",65],["Ferencváros Budapest","HUN","NB I",67],
  ["Schachtar Donezk","UKR","Premjer-Liha",72],["Dynamo Kiew","UKR","Premjer-Liha",69],["Ludogorez Rasgrad","BUL","Parva Liga",64],
  ["CR Flamengo","BRA","Série A",77],["SE Palmeiras","BRA","Série A",77],["Botafogo FR","BRA","Série A",74],
  ["Fluminense FC","BRA","Série A",72],["São Paulo FC","BRA","Série A",73],["SC Corinthians","BRA","Série A",71],
  ["River Plate","ARG","Liga Profesional",76],["Boca Juniors","ARG","Liga Profesional",75],["Racing Club","ARG","Liga Profesional",72],
  ["CA Independiente","ARG","Liga Profesional",70],["Vélez Sarsfield","ARG","Liga Profesional",70],
  ["Al-Hilal","KSA","Saudi Pro League",78],["Al-Nassr","KSA","Saudi Pro League",76],["Al-Ittihad","KSA","Saudi Pro League",75],["Al-Ahli Jeddah","KSA","Saudi Pro League",74],
  ["Inter Miami","USA","MLS",70],["Los Angeles FC","USA","MLS",70],["Seattle Sounders","USA","MLS",67],["Atlanta United","USA","MLS",66],
  ["Kawasaki Frontale","JPN","J1 League",67],["Urawa Red Diamonds","JPN","J1 League",65],["Ulsan HD","KOR","K League 1",66],
  ["Al Ahly Kairo","EGY","Premier League (EGY)",68],["Wydad Casablanca","MAR","Botola",65],["Mamelodi Sundowns","RSA","Premiership (RSA)",66],
];
/* Auffüllung, damit jede Liga eine vollständige Tabelle ergibt */
const RAW2 = [
  ["Burnley FC","ENG","Championship",64],["Luton Town","ENG","EFL League One",54],
  ["Sheffield Wednesday","ENG","Championship",56],["Bristol City","ENG","Championship",57],["Swansea City","ENG","Championship",56],
  ["Queens Park Rangers","ENG","Championship",55],["Derby County","ENG","Championship",55],["Oxford United","ENG","Championship",53],
  ["Plymouth Argyle","ENG","Championship",53],["Cardiff City","ENG","Championship",56],["Millwall FC","ENG","Championship",58],
  ["Preston North End","ENG","Championship",56],["Birmingham City","ENG","Championship",55],["Wrexham AFC","ENG","Championship",52],
  ["Real Valladolid","ESP","La Liga",64],["Granada CF","ESP","La Liga",65],["Cádiz CF","ESP","La Liga",64],["Elche CF","ESP","La Liga",63],
  ["Real Oviedo","ESP","LaLiga 2",57],["Albacete Balompié","ESP","LaLiga 2",54],["SD Huesca","ESP","LaLiga 2",55],
  ["CD Mirandés","ESP","LaLiga 2",53],["Burgos CF","ESP","LaLiga 2",54],["Racing Ferrol","ESP","LaLiga 2",52],
  ["CD Tenerife","ESP","LaLiga 2",54],["FC Cartagena","ESP","LaLiga 2",53],["UD Almería","ESP","LaLiga 2",58],
  ["Córdoba CF","ESP","LaLiga 2",53],["CD Eldense","ESP","LaLiga 2",51],["SD Amorebieta","ESP","LaLiga 2",51],
  ["US Sassuolo","ITA","Serie A",68],["Venezia FC","ITA","Serie A",66],["US Salernitana","ITA","Serie A",63],["Frosinone Calcio","ITA","Serie A",65],
  ["Modena FC","ITA","Serie B",55],["AC Reggiana","ITA","Serie C",50],["Cosenza Calcio","ITA","Serie B",53],["Ternana Calcio","ITA","Serie B",53],
  ["Ascoli Calcio","ITA","Serie B",54],["FC Südtirol","ITA","Serie B",54],["AS Cittadella","ITA","Serie B",53],
  ["FeralpiSalò","ITA","Serie B",52],["SPAL Ferrara","ITA","Serie B",53],["Brescia Calcio","ITA","Serie B",56],
  ["Clermont Foot","FRA","Ligue 2",56],["FC Lorient","FRA","Ligue 1",63],
  ["Paris FC","FRA","Ligue 2",60],["AC Ajaccio","FRA","Ligue 2",55],["Rodez AF","FRA","Ligue 2",53],["Amiens SC","FRA","Ligue 2",55],
  ["Pau FC","FRA","Ligue 2",52],["USL Dunkerque","FRA","Ligue 2",52],["Stade Laval","FRA","Ligue 2",53],["ESTAC Troyes","FRA","Ligue 1",63],
  ["Valenciennes FC","FRA","Ligue 2",52],["Quevilly-Rouen","FRA","Ligue 2",51],["Annecy FC","FRA","Ligue 2",52],["SC Bastia","FRA","Ligue 2",53],
  ["SV Darmstadt 98","GER","2. Bundesliga",59],
  ["Alemannia Aachen","GER","3. Liga",48],["FC Ingolstadt","GER","3. Liga",47],["SV Wehen Wiesbaden","GER","3. Liga",46],
  ["VfB Lübeck","GER","3. Liga",45],["FC Viktoria Köln","GER","3. Liga",46],["TSV 1860 München","GER","3. Liga",49],
  ["SpVgg Unterhaching","GER","3. Liga",45],["Stuttgarter Kickers","GER","3. Liga",44],
  ["Fortuna Sittard","NED","Eredivisie",61],["PEC Zwolle","NED","Eredivisie",62],["RKC Waalwijk","NED","Eredivisie",60],
  ["Heracles Almelo","NED","Eredivisie",60],["Almere City","NED","Eredivisie",59],["NAC Breda","NED","Eredivisie",60],
  ["Moreirense FC","POR","Liga Portugal",63],["FC Arouca","POR","Liga Portugal",62],["Gil Vicente","POR","Liga Portugal",62],
  ["Casa Pia AC","POR","Liga Portugal",61],["CD Nacional","POR","Liga Portugal",60],["CD Santa Clara","POR","Liga Portugal",61],
  ["SC Farense","POR","Liga Portugal",59],["Estrela Amadora","POR","Liga Portugal",59],["AVS Futebol","POR","Liga Portugal",58],
  ["Kasimpasa","TUR","Süper Lig",62],["Alanyaspor","TUR","Süper Lig",63],["Caykur Rizespor","TUR","Süper Lig",61],
  ["Sivasspor","TUR","Süper Lig",62],["Kayserispor","TUR","Süper Lig",61],["Gaziantep FK","TUR","Süper Lig",61],
  ["Hatayspor","TUR","Süper Lig",60],["Adana Demirspor","TUR","Süper Lig",63],["Göztepe","TUR","Süper Lig",61],["Eyüpspor","TUR","Süper Lig",60],
  ["Panserraikos","GRE","Super League",58],["Atromitos Athen","GRE","Super League",63],["Lamia FC","GRE","Super League",57],
  ["PAS Giannina","GRE","Super League",58],["Kifisia FC","GRE","Super League",57],
  ["Hibernian FC","SCO","Scottish Premiership",60],["Aberdeen FC","SCO","Scottish Premiership",61],["FC Dundee United","SCO","Scottish Premiership",57],
  ["St. Mirren","SCO","Scottish Premiership",57],["Motherwell FC","SCO","Scottish Premiership",57],["Kilmarnock FC","SCO","Scottish Premiership",56],
  ["Ross County","SCO","Scottish Premiership",54],["Dundee FC","SCO","Scottish Premiership",55],["St. Johnstone","SCO","Scottish Premiership",54],
  ["KAA Gent","BEL","Jupiler Pro League",68],["Cercle Brügge","BEL","Jupiler Pro League",65],["Standard Lüttich","BEL","Jupiler Pro League",66],
  ["KV Mechelen","BEL","Jupiler Pro League",63],["KVC Westerlo","BEL","Jupiler Pro League",62],["OH Leuven","BEL","Jupiler Pro League",62],
  ["Sint-Truiden","BEL","Jupiler Pro League",62],["Sporting Charleroi","BEL","Jupiler Pro League",63],["KV Kortrijk","BEL","Jupiler Pro League",60],
  ["FCV Dender EH","BEL","Jupiler Pro League",58],["Beerschot VA","BEL","Jupiler Pro League",58],
  ["LASK Linz","AUT","Bundesliga (AT)",65],["WAC Wolfsberg","AUT","Bundesliga (AT)",62],["Austria Klagenfurt","AUT","Bundesliga (AT)",60],
  ["TSV Hartberg","AUT","Bundesliga (AT)",60],["SCR Altach","AUT","Bundesliga (AT)",59],["Blau-Weiß Linz","AUT","Bundesliga (AT)",58],
  ["SV Ried","AUT","Bundesliga (AT)",58],["Grazer AK","AUT","Bundesliga (AT)",57],
  ["FC St. Gallen","SUI","Super League (CH)",64],["Servette Genf","SUI","Super League (CH)",65],["FC Lugano","SUI","Super League (CH)",63],
  ["FC Sion","SUI","Super League (CH)",60],["Grasshopper Zürich","SUI","Super League (CH)",60],["Yverdon Sport","SUI","Super League (CH)",57],
  ["FC Winterthur","SUI","Super League (CH)",57],["FC Lausanne-Sport","SUI","Super League (CH)",59],
  ["AGF Aarhus","DEN","Superliga",62],["FC Nordsjaelland","DEN","Superliga",64],["Silkeborg IF","DEN","Superliga",61],
  ["Randers FC","DEN","Superliga",60],["Viborg FF","DEN","Superliga",60],["Odense BK","DEN","Superliga",60],
  ["Lyngby BK","DEN","Superliga",58],["Vejle BK","DEN","Superliga",57],["Sönderjyske","DEN","Superliga",57],
  ["Molde FK","NOR","Eliteserien",66],["Brann Bergen","NOR","Eliteserien",63],["Viking Stavanger","NOR","Eliteserien",62],
  ["Lillestrøm SK","NOR","Eliteserien",60],["Vålerenga Oslo","NOR","Eliteserien",60],["Sarpsborg 08","NOR","Eliteserien",58],
  ["Tromsø IL","NOR","Eliteserien",58],["Odds BK","NOR","Eliteserien",57],["HamKam","NOR","Eliteserien",56],
  ["Fredrikstad FK","NOR","Eliteserien",56],["KFUM Oslo","NOR","Eliteserien",55],["Kristiansund BK","NOR","Eliteserien",55],
  ["Sandefjord Fotball","NOR","Eliteserien",54],["FK Haugesund","NOR","Eliteserien",56],
  ["Hammarby IF","SWE","Allsvenskan",64],["IF Elfsborg","SWE","Allsvenskan",63],["Djurgardens IF","SWE","Allsvenskan",64],
  ["IFK Göteborg","SWE","Allsvenskan",61],["BK Häcken","SWE","Allsvenskan",63],["IFK Norrköping","SWE","Allsvenskan",60],
  ["Kalmar FF","SWE","Allsvenskan",58],["Mjällby AIF","SWE","Allsvenskan",59],["IK Sirius","SWE","Allsvenskan",56],
  ["Halmstads BK","SWE","Allsvenskan",56],["GAIS Göteborg","SWE","Allsvenskan",55],["Västerås SK","SWE","Allsvenskan",54],
  ["IF Brommapojkarna","SWE","Allsvenskan",55],["Degerfors IF","SWE","Allsvenskan",54],
  ["Viktoria Pilsen","CZE","Chance Liga",67],["Banik Ostrava","CZE","Chance Liga",62],["Sigma Olomouc","CZE","Chance Liga",61],
  ["Slovan Liberec","CZE","Chance Liga",60],["Mladá Boleslav","CZE","Chance Liga",59],["Bohemians Prag","CZE","Chance Liga",58],
  ["FK Jablonec","CZE","Chance Liga",59],["FK Teplice","CZE","Chance Liga",57],["FK Pardubice","CZE","Chance Liga",56],
  ["FC Zlín","CZE","Chance Liga",55],["MFK Karviná","CZE","Chance Liga",55],["1. FC Slovácko","CZE","Chance Liga",58],
  ["Hradec Králové","CZE","Chance Liga",57],["Dukla Prag","CZE","Chance Liga",54],
  ["HNK Rijeka","CRO","HNL",65],["NK Osijek","CRO","HNL",62],["Slaven Belupo","CRO","HNL",57],["Lokomotiva Zagreb","CRO","HNL",57],
  ["NK Varazdin","CRO","HNL",56],["Istra 1961","CRO","HNL",55],["HNK Gorica","CRO","HNL",55],["HNK Sibenik","CRO","HNL",54],
  ["FK Vojvodina","SRB","Superliga (SRB)",61],["TSC Backa Topola","SRB","Superliga (SRB)",60],["FK Cukaricki","SRB","Superliga (SRB)",59],
  ["Radnicki Nis","SRB","Superliga (SRB)",58],["FK Napredak","SRB","Superliga (SRB)",55],["Spartak Subotica","SRB","Superliga (SRB)",56],
  ["FK Javor","SRB","Superliga (SRB)",54],["Mladost Lucani","SRB","Superliga (SRB)",55],["FK Vozdovac","SRB","Superliga (SRB)",54],
  ["IMT Belgrad","SRB","Superliga (SRB)",54],["FK Radnik","SRB","Superliga (SRB)",53],["Zeleznicar Pancevo","SRB","Superliga (SRB)",53],
  ["Novi Pazar","SRB","Superliga (SRB)",55],["FK Tekstilac","SRB","Superliga (SRB)",52],
  ["Rakow Czestochowa","POL","Ekstraklasa",64],["Jagiellonia Bialystok","POL","Ekstraklasa",63],["Pogon Stettin","POL","Ekstraklasa",62],
  ["Slask Breslau","POL","Ekstraklasa",61],["Wisla Plock","POL","Ekstraklasa",59],["Widzew Lodz","POL","Ekstraklasa",60],
  ["Cracovia Krakau","POL","Ekstraklasa",59],["Gornik Zabrze","POL","Ekstraklasa",59],["Radomiak Radom","POL","Ekstraklasa",58],
  ["Motor Lublin","POL","Ekstraklasa",57],["Piast Gliwice","POL","Ekstraklasa",59],["Korona Kielce","POL","Ekstraklasa",57],
  ["Stal Mielec","POL","Ekstraklasa",57],["GKS Katowice","POL","Ekstraklasa",57],["Zaglebie Lubin","POL","Ekstraklasa",58],
  ["Puszcza Niepolomice","POL","Ekstraklasa",55],
  ["Puskás Akadémia","HUN","NB I",61],["Debreceni VSC","HUN","NB I",59],["Fehérvár FC","HUN","NB I",59],["Paksi FC","HUN","NB I",59],
  ["Újpest FC","HUN","NB I",58],["MTK Budapest","HUN","NB I",57],["Kecskeméti TE","HUN","NB I",57],["Diósgyőri VTK","HUN","NB I",56],
  ["Nyíregyháza Spartacus","HUN","NB I",55],["ZTE Zalaegerszeg","HUN","NB I",56],["Kisvárda FC","HUN","NB I",55],
  ["Sorja Luhansk","UKR","Premjer-Liha",63],["Kryvbas Krywyj Rih","UKR","Premjer-Liha",60],["Oleksandrija","UKR","Premjer-Liha",60],
  ["Weres Riwne","UKR","Premjer-Liha",58],["Polissja Schytomyr","UKR","Premjer-Liha",60],["Kolos Kowaliwka","UKR","Premjer-Liha",58],
  ["LNZ Tscherkassy","UKR","Premjer-Liha",57],["Karpaty Lwiw","UKR","Premjer-Liha",58],["Rukh Lwiw","UKR","Premjer-Liha",57],
  ["Obolon Kiew","UKR","Premjer-Liha",56],["Inhulez Petrowe","UKR","Premjer-Liha",56],["Livyi Bereh Kiew","UKR","Premjer-Liha",55],
  ["Metalist 1925","UKR","Premjer-Liha",58],["Tschornomorez Odessa","UKR","Premjer-Liha",57],
  ["Levski Sofia","BUL","Parva Liga",60],["ZSKA Sofia","BUL","Parva Liga",60],["Lokomotive Plowdiw","BUL","Parva Liga",58],
  ["Botew Plowdiw","BUL","Parva Liga",57],["Slawia Sofia","BUL","Parva Liga",56],["Beroe Stara Sagora","BUL","Parva Liga",55],
  ["Arda Kardschali","BUL","Parva Liga",56],["Cherno More Warna","BUL","Parva Liga",55],["Septemvri Sofia","BUL","Parva Liga",54],
  ["Krumovgrad","BUL","Parva Liga",55],["Botev Vratsa","BUL","Parva Liga",54],["Spartak Warna","BUL","Parva Liga",54],
  ["Hebar Pasardschik","BUL","Parva Liga",53],["Dobrudscha Dobritsch","BUL","Parva Liga",53],["ZSKA 1948 Sofia","BUL","Parva Liga",57],
  ["Cruzeiro EC","BRA","Série A",71],["Grêmio Porto Alegre","BRA","Série A",70],["Atlético Mineiro","BRA","Série A",72],
  ["SC Internacional","BRA","Série A",71],["Fortaleza EC","BRA","Série A",70],["EC Bahia","BRA","Série A",69],
  ["Vasco da Gama","BRA","Série A",68],["Santos FC","BRA","Série A",68],["EC Vitória","BRA","Série A",66],
  ["RB Bragantino","BRA","Série A",68],["Cuiabá EC","BRA","Série A",65],["Criciúma EC","BRA","Série A",64],
  ["EC Juventude","BRA","Série A",64],["Atlético Goianiense","BRA","Série A",64],
  ["Estudiantes La Plata","ARG","Liga Profesional",69],["Argentinos Juniors","ARG","Liga Profesional",68],["San Lorenzo","ARG","Liga Profesional",67],
  ["Talleres Córdoba","ARG","Liga Profesional",68],["Rosario Central","ARG","Liga Profesional",67],["Club Atlético Lanús","ARG","Liga Profesional",66],
  ["Defensa y Justicia","ARG","Liga Profesional",65],["Newell's Old Boys","ARG","Liga Profesional",65],["Club Atlético Huracán","ARG","Liga Profesional",65],
  ["Godoy Cruz","ARG","Liga Profesional",64],["Belgrano Córdoba","ARG","Liga Profesional",64],
  ["Al-Shabab","KSA","Saudi Pro League",70],["Al-Ettifaq","KSA","Saudi Pro League",68],["Al-Taawoun","KSA","Saudi Pro League",67],
  ["Al-Fateh","KSA","Saudi Pro League",65],["Al-Khaleej","KSA","Saudi Pro League",64],["Al-Fayha","KSA","Saudi Pro League",64],
  ["Al-Riyadh","KSA","Saudi Pro League",63],["Al-Wehda","KSA","Saudi Pro League",63],["Damac FC","KSA","Saudi Pro League",63],
  ["Al-Raed","KSA","Saudi Pro League",62],["Al-Qadsiah","KSA","Saudi Pro League",66],["Al-Orobah","KSA","Saudi Pro League",61],
  ["Al-Kholood","KSA","Saudi Pro League",61],["Al-Okhdood","KSA","Saudi Pro League",61],
  ["New York City FC","USA","MLS",67],["Columbus Crew","USA","MLS",68],["FC Cincinnati","USA","MLS",68],
  ["Philadelphia Union","USA","MLS",66],["Portland Timbers","USA","MLS",65],["Real Salt Lake","USA","MLS",65],
  ["Austin FC","USA","MLS",64],["Nashville SC","USA","MLS",64],["Orlando City","USA","MLS",66],
  ["New York Red Bulls","USA","MLS",65],["Charlotte FC","USA","MLS",63],["Toronto FC","USA","MLS",62],
  ["Vissel Kobe","JPN","J1 League",67],["Sanfrecce Hiroshima","JPN","J1 League",66],["Gamba Osaka","JPN","J1 League",64],
  ["Cerezo Osaka","JPN","J1 League",64],["FC Tokyo","JPN","J1 League",63],["Yokohama F. Marinos","JPN","J1 League",65],
  ["Nagoya Grampus","JPN","J1 League",63],["Kashima Antlers","JPN","J1 League",65],["Avispa Fukuoka","JPN","J1 League",61],
  ["Kyoto Sanga","JPN","J1 League",61],["Shonan Bellmare","JPN","J1 League",60],["Albirex Niigata","JPN","J1 League",60],
  ["Consadole Sapporo","JPN","J1 League",60],["Júbilo Iwata","JPN","J1 League",60],["Tokyo Verdy","JPN","J1 League",61],
  ["Machida Zelvia","JPN","J1 League",62],
  ["Jeonbuk Motors","KOR","K League 1",65],["FC Seoul","KOR","K League 1",64],["Pohang Steelers","KOR","K League 1",64],
  ["Gimcheon Sangmu","KOR","K League 1",62],["Gangwon FC","KOR","K League 1",62],["Suwon FC","KOR","K League 1",61],
  ["Daejeon Hana","KOR","K League 1",62],["Gwangju FC","KOR","K League 1",62],["Jeju United","KOR","K League 1",61],
  ["Daegu FC","KOR","K League 1",60],["Incheon United","KOR","K League 1",60],
  ["Zamalek SC","EGY","Premier League (EGY)",66],["Pyramids FC","EGY","Premier League (EGY)",65],["Ismaily SC","EGY","Premier League (EGY)",61],
  ["Al Masry","EGY","Premier League (EGY)",62],["ENPPI Kairo","EGY","Premier League (EGY)",60],["Ceramica Cleopatra","EGY","Premier League (EGY)",60],
  ["Smouha SC","EGY","Premier League (EGY)",59],["National Bank FC","EGY","Premier League (EGY)",59],["Ittihad Alexandria","EGY","Premier League (EGY)",60],
  ["Pharco FC","EGY","Premier League (EGY)",59],["ZED FC","EGY","Premier League (EGY)",58],
  ["Raja Casablanca","MAR","Botola",64],["AS FAR Rabat","MAR","Botola",63],["RS Berkane","MAR","Botola",64],
  ["MA Tétouan","MAR","Botola",60],["Maghreb Fès","MAR","Botola",59],["Olympique Safi","MAR","Botola",58],
  ["Hassania Agadir","MAR","Botola",58],["Difaâ El Jadidi","MAR","Botola",59],["Union Touarga","MAR","Botola",58],
  ["Chabab Mohammédia","MAR","Botola",57],["COD Meknès","MAR","Botola",57],["Ittihad Tanger","MAR","Botola",57],
  ["Renaissance Zemamra","MAR","Botola",56],
  ["Orlando Pirates","RSA","Premiership (RSA)",63],["Kaizer Chiefs","RSA","Premiership (RSA)",62],["SuperSport United","RSA","Premiership (RSA)",60],
  ["Stellenbosch FC","RSA","Premiership (RSA)",61],["Sekhukhune United","RSA","Premiership (RSA)",59],["Golden Arrows","RSA","Premiership (RSA)",58],
  ["AmaZulu FC","RSA","Premiership (RSA)",59],["Cape Town City","RSA","Premiership (RSA)",59],["Polokwane City","RSA","Premiership (RSA)",57],
  ["Chippa United","RSA","Premiership (RSA)",57],["Richards Bay","RSA","Premiership (RSA)",57],["Marumo Gallants","RSA","Premiership (RSA)",56],
  ["Magesi FC","RSA","Premiership (RSA)",55],
];
/* Dritte Ausbaustufe: weitere Ligen aus Europa, Süd- und Mittelamerika, Asien und Ozeanien */
const RAW3 = [
  /* England – EFL League One */
  ["Bolton Wanderers","ENG","EFL League One",50],["Barnsley FC","ENG","EFL League One",49],["Huddersfield Town","ENG","EFL League One",49],
  ["Charlton Athletic","ENG","EFL League One",48],["Blackpool FC","ENG","EFL League One",48],["Reading FC","ENG","EFL League One",48],
  ["Wigan Athletic","ENG","EFL League One",47],["Peterborough United","ENG","EFL League One",47],["Lincoln City","ENG","EFL League One",46],
  ["Stockport County","ENG","EFL League One",46],["Rotherham United","ENG","EFL League One",46],["Mansfield Town","ENG","EFL League One",45],
  ["Wycombe Wanderers","ENG","EFL League One",46],["Stevenage FC","ENG","EFL League One",45],["Shrewsbury Town","ENG","EFL League One",44],
  ["Northampton Town","ENG","EFL League One",44],["Burton Albion","ENG","EFL League One",43],["Cambridge United","ENG","EFL League One",43],
  ["Exeter City","ENG","EFL League One",44],["Leyton Orient","ENG","EFL League One",45],
  /* Italien – Serie C */
  ["Vicenza Calcio","ITA","Serie C",50],["Padova Calcio","ITA","Serie B",55],["AC Cesena","ITA","Serie C",49],
  ["Avellino Calcio","ITA","Serie B",55],["Benevento Calcio","ITA","Serie C",48],["AC Perugia","ITA","Serie C",47],
  ["Delfino Pescara","ITA","Serie C",47],["FC Crotone","ITA","Serie C",46],["Catania FC","ITA","Serie C",46],
  ["Foggia Calcio","ITA","Serie C",45],["SS Juve Stabia","ITA","Serie C",46],["Torres Sassari","ITA","Serie C",45],
  ["AS Gubbio","ITA","Serie C",44],["Rimini FC","ITA","Serie C",44],["US Triestina","ITA","Serie C",45],
  ["Trapani Calcio","ITA","Serie C",43],["Pineto Calcio","ITA","Serie C",42],["Legnago Salus","ITA","Serie C",42],
  /* Spanien – Primera Federación */
  ["Real Murcia","ESP","Primera Federación",50],["Cultural Leonesa","ESP","Primera Federación",49],["SD Ponferradina","ESP","Primera Federación",49],
  ["Nàstic Tarragona","ESP","Primera Federación",48],["CE Sabadell","ESP","Primera Federación",47],["AD Alcorcón","ESP","Primera Federación",48],
  ["CF Fuenlabrada","ESP","Primera Federación",46],["Algeciras CF","ESP","Primera Federación",46],["UD Ibiza","ESP","Primera Federación",47],
  ["CD Atlético Baleares","ESP","Primera Federación",45],["Real Madrid Castilla","ESP","Primera Federación",50],["Bilbao Athletic","ESP","Primera Federación",49],
  ["Osasuna Promesas","ESP","Primera Federación",47],["Celta Fortuna","ESP","Primera Federación",48],["Barakaldo CF","ESP","Primera Federación",44],
  ["Unionistas Salamanca","ESP","Primera Federación",44],["Antequera CF","ESP","Primera Federación",43],["Real Avilés","ESP","Primera Federación",43],
  /* Portugal – Liga Portugal 2 */
  ["FC Penafiel","POR","Liga Portugal 2",55],["UD Oliveirense","POR","Liga Portugal 2",54],["SC Covilhã","POR","Liga Portugal 2",53],
  ["Leixões SC","POR","Liga Portugal 2",54],["FC Paços de Ferreira","POR","Liga Portugal 2",57],["Vitória Guimarães B","POR","Liga Portugal 2",52],
  ["CD Feirense","POR","Liga Portugal 2",54],["GD Chaves","POR","Liga Portugal 2",56],["Portimonense SC","POR","Liga Portugal 2",56],
  ["CD Tondela","POR","Liga Portugal 2",55],["SC Marítimo","POR","Liga Portugal 2",56],["Académico Viseu","POR","Liga Portugal 2",53],
  ["FC Alverca","POR","Liga Portugal 2",52],["CD Mafra","POR","Liga Portugal 2",51],["União Torreense","POR","Liga Portugal 2",51],
  ["SC Beira-Mar","POR","Liga Portugal 2",50],
  /* Niederlande – Eerste Divisie */
  ["Vitesse Arnheim","NED","Eerste Divisie",57],["SC Cambuur","NED","Eerste Divisie",56],["Roda JC Kerkrade","NED","Eerste Divisie",55],
  ["De Graafschap","NED","Eerste Divisie",54],["ADO Den Haag","NED","Eerste Divisie",55],["FC Emmen","NED","Eerste Divisie",54],
  ["VVV-Venlo","NED","Eerste Divisie",53],["MVV Maastricht","NED","Eerste Divisie",52],["FC Eindhoven","NED","Eerste Divisie",53],
  ["FC Dordrecht","NED","Eerste Divisie",52],["Telstar Velsen","NED","Eerste Divisie",51],["TOP Oss","NED","Eerste Divisie",51],
  ["Helmond Sport","NED","Eerste Divisie",50],["FC Den Bosch","NED","Eerste Divisie",50],["Jong Ajax","NED","Eerste Divisie",54],
  ["Jong PSV","NED","Eerste Divisie",54],["Jong AZ","NED","Eerste Divisie",52],["FC Volendam","NED","Eerste Divisie",56],
  /* Belgien – Challenger Pro League */
  ["Lommel SK","BEL","Challenger Pro League",55],["RWD Molenbeek","BEL","Challenger Pro League",56],["SV Zulte Waregem","BEL","Challenger Pro League",57],
  ["KV Oostende","BEL","Challenger Pro League",54],["Patro Eisden","BEL","Challenger Pro League",53],["Lierse Kempenzonen","BEL","Challenger Pro League",53],
  ["RFC Seraing","BEL","Challenger Pro League",52],["SK Beveren","BEL","Challenger Pro League",54],["RAAL La Louvière","BEL","Challenger Pro League",52],
  ["Francs Borains","BEL","Challenger Pro League",50],["Club NXT","BEL","Challenger Pro League",51],["Jong Genk","BEL","Challenger Pro League",51],
  ["RSCA Futures","BEL","Challenger Pro League",52],["KMSK Deinze","BEL","Challenger Pro League",50],
  /* Türkei – TFF 1. Lig */
  ["Bandirmaspor","TUR","TFF 1. Lig",57],["Boluspor","TUR","TFF 1. Lig",56],["Erzurumspor FK","TUR","TFF 1. Lig",56],
  ["Genclerbirligi","TUR","TFF 1. Lig",57],["Sakaryaspor","TUR","TFF 1. Lig",55],["Kocaelispor","TUR","TFF 1. Lig",56],
  ["Manisa FK","TUR","TFF 1. Lig",55],["Ümraniyespor","TUR","TFF 1. Lig",54],["Pendikspor","TUR","TFF 1. Lig",55],
  ["Corum FK","TUR","TFF 1. Lig",54],["Sanliurfaspor","TUR","TFF 1. Lig",53],["Keciörengücü","TUR","TFF 1. Lig",53],
  ["Adanaspor","TUR","TFF 1. Lig",52],["Bodrum FK","TUR","TFF 1. Lig",54],["Igdir FK","TUR","TFF 1. Lig",52],
  ["Amed SK","TUR","TFF 1. Lig",53],["Fatih Karagümrük","TUR","TFF 1. Lig",56],["Istanbulspor","TUR","TFF 1. Lig",52],
  /* Dänemark – 1. Division */
  ["Hvidovre IF","DEN","1. Division",54],["Kolding IF","DEN","1. Division",52],["FC Fredericia","DEN","1. Division",53],
  ["HB Köge","DEN","1. Division",53],["B93 Kopenhagen","DEN","1. Division",51],["Hillerød Fodbold","DEN","1. Division",50],
  ["Hobro IK","DEN","1. Division",52],["Esbjerg fB","DEN","1. Division",54],["Vendsyssel FF","DEN","1. Division",52],
  ["AC Horsens","DEN","1. Division",53],["Naestved BK","DEN","1. Division",50],["FC Roskilde","DEN","1. Division",49],
  /* Polen – I liga */
  ["Arka Gdynia","POL","I liga",55],["Wisla Krakau","POL","I liga",56],["Ruch Chorzow","POL","I liga",54],
  ["Lechia Danzig","POL","I liga",55],["Odra Opole","POL","I liga",52],["Miedz Legnica","POL","I liga",53],
  ["GKS Tychy","POL","I liga",52],["Chrobry Glogow","POL","I liga",51],["Polonia Warschau","POL","I liga",53],
  ["Znicz Pruszkow","POL","I liga",50],["Stal Rzeszow","POL","I liga",51],["Warta Posen","POL","I liga",52],
  ["Termalica Nieciecza","POL","I liga",53],["Górnik Leczna","POL","I liga",50],["Kotwica Kolobrzeg","POL","I liga",49],
  ["Pogon Siedlce","POL","I liga",49],
  /* Schottland – Championship */
  ["Dunfermline Athletic","SCO","Championship (SCO)",53],["Raith Rovers","SCO","Championship (SCO)",52],["Partick Thistle","SCO","Championship (SCO)",52],
  ["Ayr United","SCO","Championship (SCO)",51],["Greenock Morton","SCO","Championship (SCO)",50],["Falkirk FC","SCO","Championship (SCO)",52],
  ["Livingston FC","SCO","Championship (SCO)",53],["Airdrieonians","SCO","Championship (SCO)",49],["Queen's Park","SCO","Championship (SCO)",50],
  ["Hamilton Academical","SCO","Championship (SCO)",48],
  /* Österreich – 2. Liga */
  ["FC Liefering","AUT","2. Liga (AT)",53],["SKN St. Pölten","AUT","2. Liga (AT)",54],["Kapfenberger SV","AUT","2. Liga (AT)",51],
  ["SV Horn","AUT","2. Liga (AT)",50],["First Vienna FC","AUT","2. Liga (AT)",52],["FC Admira Wacker","AUT","2. Liga (AT)",53],
  ["SW Bregenz","AUT","2. Liga (AT)",50],["FC Dornbirn","AUT","2. Liga (AT)",49],["SKU Amstetten","AUT","2. Liga (AT)",50],
  ["SV Stripfing","AUT","2. Liga (AT)",48],["Sturm Graz II","AUT","2. Liga (AT)",50],["Rapid Wien II","AUT","2. Liga (AT)",50],
  ["FC Hertha Wels","AUT","2. Liga (AT)",48],["ASK Voitsberg","AUT","2. Liga (AT)",47],
  /* Schweiz – Challenge League */
  ["FC Aarau","SUI","Challenge League",56],["FC Thun","SUI","Challenge League",57],["FC Wil","SUI","Challenge League",54],
  ["Neuchâtel Xamax","SUI","Challenge League",54],["FC Vaduz","SUI","Challenge League",55],["SC Kriens","SUI","Challenge League",51],
  ["FC Schaffhausen","SUI","Challenge League",52],["Stade Nyonnais","SUI","Challenge League",50],["AC Bellinzona","SUI","Challenge League",51],
  ["Étoile Carouge","SUI","Challenge League",50],
  /* Tschechien – FNL */
  ["Vysocina Jihlava","CZE","FNL",52],["FK Prostejov","CZE","FNL",50],["MFK Chrudim","CZE","FNL",51],
  ["FC Táborsko","CZE","FNL",50],["Zbrojovka Brünn","CZE","FNL",53],["Viktoria Zizkov","CZE","FNL",50],
  ["Sparta Prag B","CZE","FNL",52],["SFC Opava","CZE","FNL",51],["FC Vlasim","CZE","FNL",49],
  ["FK Trinec","CZE","FNL",49],["SK Kromeriz","CZE","FNL",48],["Usti nad Labem","CZE","FNL",48],
  ["FK Varnsdorf","CZE","FNL",47],["Banik Sokolov","CZE","FNL",47],
  /* Norwegen – 1. divisjon */
  ["Start Kristiansand","NOR","1. divisjon",53],["Aalesunds FK","NOR","1. divisjon",54],["Raufoss IL","NOR","1. divisjon",50],
  ["Skeid Oslo","NOR","1. divisjon",49],["Ranheim IL","NOR","1. divisjon",50],["Sogndal IL","NOR","1. divisjon",51],
  ["Stabaek Fotball","NOR","1. divisjon",53],["Mjöndalen IF","NOR","1. divisjon",51],["Egersunds IK","NOR","1. divisjon",49],
  ["Kongsvinger IL","NOR","1. divisjon",49],["Levanger FK","NOR","1. divisjon",48],["Lyn Oslo","NOR","1. divisjon",50],
  ["Moss FK","NOR","1. divisjon",49],["Bryne FK","NOR","1. divisjon",52],
  /* Russland – Premjer-Liga */
  ["Zenit St. Petersburg","RUS","Premjer-Liga",74],["Spartak Moskau","RUS","Premjer-Liga",71],["ZSKA Moskau","RUS","Premjer-Liga",71],
  ["Lokomotive Moskau","RUS","Premjer-Liga",70],["Dynamo Moskau","RUS","Premjer-Liga",70],["FK Krasnodar","RUS","Premjer-Liga",72],
  ["Rubin Kasan","RUS","Premjer-Liga",67],["FK Rostow","RUS","Premjer-Liga",66],["Achmat Grosny","RUS","Premjer-Liga",65],
  ["Krylja Sowetow","RUS","Premjer-Liga",65],["Fakel Woronesch","RUS","Premjer-Liga",62],["FK Orenburg","RUS","Premjer-Liga",63],
  ["Baltika Kaliningrad","RUS","Premjer-Liga",63],["Paris Nischni Nowgorod","RUS","Premjer-Liga",62],["Ural Jekaterinburg","RUS","Premjer-Liga",64],
  ["FK Chimki","RUS","Premjer-Liga",61],
  /* Brasilien – Série B */
  ["Sport Recife","BRA","Série B",64],["Ceará SC","BRA","Série B",63],["Grêmio Novorizontino","BRA","Série B",61],
  ["Mirassol FC","BRA","Série B",62],["Avaí FC","BRA","Série B",61],["Coritiba FC","BRA","Série B",63],
  ["Goiás EC","BRA","Série B",62],["Paysandu SC","BRA","Série B",59],["Amazonas FC","BRA","Série B",58],
  ["América Mineiro","BRA","Série B",62],["Chapecoense","BRA","Série B",59],["Ponte Preta","BRA","Série B",60],
  ["Guarani FC","BRA","Série B",59],["Botafogo-SP","BRA","Série B",58],["Operário Ferroviário","BRA","Série B",57],
  ["CRB Maceió","BRA","Série B",59],["Ituano FC","BRA","Série B",57],["Brusque FC","BRA","Série B",56],
  ["Vila Nova FC","BRA","Série B",59],["Sampaio Corrêa","BRA","Série B",56],
  /* Argentinien – Primera Nacional */
  ["Colón Santa Fe","ARG","Primera Nacional",62],["Gimnasia Mendoza","ARG","Primera Nacional",59],["San Martín Tucumán","ARG","Primera Nacional",60],
  ["Almirante Brown","ARG","Primera Nacional",57],["Chacarita Juniors","ARG","Primera Nacional",58],["Ferro Carril Oeste","ARG","Primera Nacional",58],
  ["All Boys","ARG","Primera Nacional",57],["Nueva Chicago","ARG","Primera Nacional",56],["Atlanta Buenos Aires","ARG","Primera Nacional",56],
  ["Deportivo Morón","ARG","Primera Nacional",56],["Quilmes AC","ARG","Primera Nacional",58],["CA Temperley","ARG","Primera Nacional",55],
  ["Estudiantes Río Cuarto","ARG","Primera Nacional",55],["Defensores de Belgrano","ARG","Primera Nacional",55],["CA Alvarado","ARG","Primera Nacional",54],
  ["Gimnasia Jujuy","ARG","Primera Nacional",55],["Talleres Remedios","ARG","Primera Nacional",54],["San Miguel","ARG","Primera Nacional",53],
  /* Kolumbien – Categoría Primera A */
  ["Atlético Nacional","COL","Categoría Primera A",68],["Millonarios FC","COL","Categoría Primera A",67],["América de Cali","COL","Categoría Primera A",66],
  ["Deportivo Cali","COL","Categoría Primera A",65],["Junior Barranquilla","COL","Categoría Primera A",67],["Independiente Medellín","COL","Categoría Primera A",65],
  ["Independiente Santa Fe","COL","Categoría Primera A",65],["Once Caldas","COL","Categoría Primera A",63],["Deportivo Pereira","COL","Categoría Primera A",63],
  ["Atlético Bucaramanga","COL","Categoría Primera A",63],["Alianza FC Valledupar","COL","Categoría Primera A",61],["Deportes Tolima","COL","Categoría Primera A",64],
  ["La Equidad","COL","Categoría Primera A",61],["Envigado FC","COL","Categoría Primera A",60],["Águilas Doradas","COL","Categoría Primera A",62],
  ["Fortaleza CEIF","COL","Categoría Primera A",60],["Boyacá Chicó","COL","Categoría Primera A",59],["Jaguares de Córdoba","COL","Categoría Primera A",59],
  /* Ecuador – Liga Pro */
  ["Independiente del Valle","ECU","Liga Pro",68],["LDU Quito","ECU","Liga Pro",67],["Barcelona SC Guayaquil","ECU","Liga Pro",66],
  ["CS Emelec","ECU","Liga Pro",64],["Universidad Católica Quito","ECU","Liga Pro",62],["Delfín SC","ECU","Liga Pro",61],
  ["SD Aucas","ECU","Liga Pro",63],["Orense SC","ECU","Liga Pro",60],["Técnico Universitario","ECU","Liga Pro",59],
  ["Deportivo Cuenca","ECU","Liga Pro",60],["CSD Macará","ECU","Liga Pro",59],["El Nacional Quito","ECU","Liga Pro",60],
  ["Mushuc Runa","ECU","Liga Pro",58],["Libertad FC Loja","ECU","Liga Pro",58],["Imbabura SC","ECU","Liga Pro",57],
  ["Cumbayá FC","ECU","Liga Pro",57],
  /* Uruguay – Primera División */
  ["CA Peñarol","URU","Primera División (URU)",68],["Club Nacional","URU","Primera División (URU)",67],["Defensor Sporting","URU","Primera División (URU)",63],
  ["Liverpool Montevideo","URU","Primera División (URU)",63],["Danubio FC","URU","Primera División (URU)",61],["Montevideo City Torque","URU","Primera División (URU)",62],
  ["Boston River","URU","Primera División (URU)",60],["Racing Montevideo","URU","Primera División (URU)",59],["Cerro Largo FC","URU","Primera División (URU)",59],
  ["CA Progreso","URU","Primera División (URU)",58],["River Plate Montevideo","URU","Primera División (URU)",59],["Plaza Colonia","URU","Primera División (URU)",58],
  ["Miramar Misiones","URU","Primera División (URU)",57],["CA Juventud","URU","Primera División (URU)",57],
  /* Chile – Primera División */
  ["Colo-Colo","CHI","Primera División (CHI)",67],["Universidad de Chile","CHI","Primera División (CHI)",66],["Universidad Católica","CHI","Primera División (CHI)",65],
  ["CD Cobresal","CHI","Primera División (CHI)",62],["CD Huachipato","CHI","Primera División (CHI)",62],["CD Palestino","CHI","Primera División (CHI)",61],
  ["Unión Española","CHI","Primera División (CHI)",61],["Audax Italiano","CHI","Primera División (CHI)",61],["CD O'Higgins","CHI","Primera División (CHI)",60],
  ["Coquimbo Unido","CHI","Primera División (CHI)",60],["Everton Viña del Mar","CHI","Primera División (CHI)",60],["Ñublense","CHI","Primera División (CHI)",59],
  ["Deportes Iquique","CHI","Primera División (CHI)",58],["Unión La Calera","CHI","Primera División (CHI)",59],["Cobreloa","CHI","Primera División (CHI)",57],
  ["Deportes Limache","CHI","Primera División (CHI)",56],
  /* Paraguay – Primera División */
  ["Club Olimpia","PAR","Primera División (PAR)",65],["Cerro Porteño","PAR","Primera División (PAR)",65],["Club Libertad","PAR","Primera División (PAR)",64],
  ["Club Guaraní","PAR","Primera División (PAR)",62],["Club Nacional Asunción","PAR","Primera División (PAR)",60],["Sportivo Luqueño","PAR","Primera División (PAR)",58],
  ["Sportivo Ameliano","PAR","Primera División (PAR)",59],["General Caballero JLM","PAR","Primera División (PAR)",57],["Tacuary FBC","PAR","Primera División (PAR)",57],
  ["Club 2 de Mayo","PAR","Primera División (PAR)",56],["Sportivo Trinidense","PAR","Primera División (PAR)",57],["Recoleta FC","PAR","Primera División (PAR)",56],
  /* Mexiko – Liga MX */
  ["Club América","MEX","Liga MX",73],["CD Guadalajara","MEX","Liga MX",70],["Cruz Azul","MEX","Liga MX",71],
  ["Tigres UANL","MEX","Liga MX",72],["CF Monterrey","MEX","Liga MX",72],["Pumas UNAM","MEX","Liga MX",68],
  ["Deportivo Toluca","MEX","Liga MX",70],["Santos Laguna","MEX","Liga MX",67],["Club León","MEX","Liga MX",68],
  ["CF Pachuca","MEX","Liga MX",69],["Atlas FC","MEX","Liga MX",67],["Club Necaxa","MEX","Liga MX",65],
  ["Club Puebla","MEX","Liga MX",64],["Club Tijuana","MEX","Liga MX",65],["Querétaro FC","MEX","Liga MX",64],
  ["Mazatlán FC","MEX","Liga MX",63],["FC Juárez","MEX","Liga MX",64],["Atlético San Luis","MEX","Liga MX",65],
  /* Japan – J2 League */
  ["Shimizu S-Pulse","JPN","J2 League",59],["V-Varen Nagasaki","JPN","J2 League",58],["Yokohama FC","JPN","J2 League",58],
  ["Ventforet Kofu","JPN","J2 League",57],["Roasso Kumamoto","JPN","J2 League",55],["Montedio Yamagata","JPN","J2 League",56],
  ["JEF United Chiba","JPN","J2 League",57],["Fujieda MYFC","JPN","J2 League",53],["Tokushima Vortis","JPN","J2 League",56],
  ["Blaublitz Akita","JPN","J2 League",54],["Iwaki FC","JPN","J2 League",54],["Renofa Yamaguchi","JPN","J2 League",54],
  ["Mito HollyHock","JPN","J2 League",55],["Omiya Ardija","JPN","J2 League",56],["Sagan Tosu","JPN","J2 League",57],
  ["Kataller Toyama","JPN","J2 League",53],["FC Imabari","JPN","J2 League",52],["Ehime FC","JPN","J2 League",53],
  /* Vereinigte Arabische Emirate – UAE Pro League */
  ["Al Ain FC","UAE","UAE Pro League",66],["Shabab Al Ahli","UAE","UAE Pro League",65],["Al Wasl","UAE","UAE Pro League",64],
  ["Al Jazira","UAE","UAE Pro League",64],["Sharjah FC","UAE","UAE Pro League",64],["Al Nasr Dubai","UAE","UAE Pro League",62],
  ["Al Wahda Abu Dhabi","UAE","UAE Pro League",63],["Bani Yas","UAE","UAE Pro League",61],["Khor Fakkan","UAE","UAE Pro League",60],
  ["Ajman Club","UAE","UAE Pro League",60],["Al Bataeh","UAE","UAE Pro League",59],["Al Ittihad Kalba","UAE","UAE Pro League",59],
  ["Dibba Al Fujairah","UAE","UAE Pro League",58],["Emirates Club","UAE","UAE Pro League",58],
  /* Katar – Qatar Stars League */
  ["Al Sadd SC","QAT","Qatar Stars League",67],["Al Duhail SC","QAT","Qatar Stars League",66],["Al Rayyan SC","QAT","Qatar Stars League",64],
  ["Al Gharafa SC","QAT","Qatar Stars League",64],["Al Arabi SC","QAT","Qatar Stars League",62],["Umm Salal SC","QAT","Qatar Stars League",60],
  ["Al Wakrah SC","QAT","Qatar Stars League",61],["Qatar SC","QAT","Qatar Stars League",60],["Al Ahli Doha","QAT","Qatar Stars League",59],
  ["Al Shamal SC","QAT","Qatar Stars League",58],["Muaither SC","QAT","Qatar Stars League",58],["Al Markhiya SC","QAT","Qatar Stars League",57],
  /* Australien – A-League Men */
  ["Ipswich Town","ENG","Premier League",67],["AC Monza","ITA","Serie A",64],["Le Mans FC","FRA","Ligue 1",61],
  ["Melbourne City","AUS","A-League Men",63],["Melbourne Victory","AUS","A-League Men",62],["Sydney FC","AUS","A-League Men",62],
  ["Western Sydney Wanderers","AUS","A-League Men",61],["Central Coast Mariners","AUS","A-League Men",62],["Adelaide United","AUS","A-League Men",60],
  ["Brisbane Roar","AUS","A-League Men",59],["Perth Glory","AUS","A-League Men",58],["Wellington Phoenix","AUS","A-League Men",60],
  ["Macarthur FC","AUS","A-League Men",59],["Newcastle Jets","AUS","A-League Men",58],["Western United","AUS","A-League Men",59],
];
/* ================= FRAUENFUSSBALL =================
   Eigene Ligen, Vereine, Gehaltsniveaus und Wettbewerbe. Die Wirtschaft
   liegt deutlich unter der des Männerfußballs, die Spitze ist enger.     */
const RAW_W = [
  /* England – Women's Super League */
  ["Chelsea FC Women","ENG","Women's Super League",88],["Arsenal Women","ENG","Women's Super League",86],
  ["Manchester City Women","ENG","Women's Super League",85],["Manchester United Women","ENG","Women's Super League",82],
  ["Tottenham Hotspur Women","ENG","Women's Super League",76],["Liverpool FC Women","ENG","Women's Super League",76],
  ["Aston Villa Women","ENG","Women's Super League",74],["Brighton Women","ENG","Women's Super League",72],
  ["Everton Women","ENG","Women's Super League",72],["West Ham United Women","ENG","Women's Super League",71],
  ["Leicester City Women","ENG","Women's Super League",70],["Crystal Palace Women","ENG","Women's Super League",68],
  /* England – Women's Championship */
  ["London City Lionesses","ENG","Women's Championship",64],["Birmingham City Women","ENG","Women's Championship",62],
  ["Southampton Women","ENG","Women's Championship",61],["Charlton Athletic Women","ENG","Women's Championship",60],
  ["Sunderland Women","ENG","Women's Championship",61],["Durham Women","ENG","Women's Championship",60],
  ["Sheffield United Women","ENG","Women's Championship",59],["Newcastle United Women","ENG","Women's Championship",60],
  ["Bristol City Women","ENG","Women's Championship",62],["Blackburn Rovers Women","ENG","Women's Championship",58],
  ["Portsmouth Women","ENG","Women's Championship",57],["Watford Women","ENG","Women's Championship",57],
  /* Deutschland – Frauen-Bundesliga */
  ["FC Bayern München Frauen","GER","Frauen-Bundesliga",87],["VfL Wolfsburg Frauen","GER","Frauen-Bundesliga",86],
  ["Eintracht Frankfurt Frauen","GER","Frauen-Bundesliga",79],["TSG Hoffenheim Frauen","GER","Frauen-Bundesliga",76],
  ["Bayer Leverkusen Frauen","GER","Frauen-Bundesliga",74],["SC Freiburg Frauen","GER","Frauen-Bundesliga",73],
  ["Werder Bremen Frauen","GER","Frauen-Bundesliga",70],["SGS Essen","GER","Frauen-Bundesliga",70],
  ["RB Leipzig Frauen","GER","Frauen-Bundesliga",69],["1. FC Köln Frauen","GER","Frauen-Bundesliga",68],
  ["Carl Zeiss Jena Frauen","GER","Frauen-Bundesliga",65],["1. FC Nürnberg Frauen","GER","Frauen-Bundesliga",64],
  /* Deutschland – 2. Frauen-Bundesliga */
  ["Turbine Potsdam","GER","2. Frauen-Bundesliga",63],["FC Ingolstadt Frauen","GER","2. Frauen-Bundesliga",60],
  ["SV Meppen Frauen","GER","2. Frauen-Bundesliga",59],["Borussia Bocholt","GER","2. Frauen-Bundesliga",58],
  ["1. FC Union Berlin Frauen","GER","2. Frauen-Bundesliga",60],["SC Sand","GER","2. Frauen-Bundesliga",58],
  ["Hamburger SV Frauen","GER","2. Frauen-Bundesliga",61],["FC Gütersloh","GER","2. Frauen-Bundesliga",56],
  ["SV Weinberg","GER","2. Frauen-Bundesliga",55],["Arminia Bielefeld Frauen","GER","2. Frauen-Bundesliga",57],
  ["VfL Bochum Frauen","GER","2. Frauen-Bundesliga",56],["1. FFC Montabaur","GER","2. Frauen-Bundesliga",54],
  /* Spanien – Liga F */
  ["FC Barcelona Femení","ESP","Liga F",93],["Real Madrid Femenino","ESP","Liga F",84],
  ["Atlético Madrid Femenino","ESP","Liga F",79],["Levante UD Femenino","ESP","Liga F",74],
  ["Real Sociedad Femenino","ESP","Liga F",73],["Athletic Club Femenino","ESP","Liga F",72],
  ["Sevilla FC Femenino","ESP","Liga F",70],["Real Betis Féminas","ESP","Liga F",69],
  ["Granada CF Femenino","ESP","Liga F",67],["Valencia CF Femenino","ESP","Liga F",69],
  ["Madrid CFF","ESP","Liga F",68],["RCD Espanyol Femenino","ESP","Liga F",66],
  /* Frankreich – Première Ligue */
  ["Olympique Lyon Féminin","FRA","Première Ligue",91],["Paris Saint-Germain Féminines","FRA","Première Ligue",85],
  ["Paris FC Féminines","FRA","Première Ligue",76],["FC Fleury 91","FRA","Première Ligue",70],
  ["Montpellier HSC Féminines","FRA","Première Ligue",70],["Stade de Reims Féminines","FRA","Première Ligue",69],
  ["Dijon FCO Féminines","FRA","Première Ligue",67],["EA Guingamp Féminines","FRA","Première Ligue",66],
  ["FC Nantes Féminines","FRA","Première Ligue",65],["RC Strasbourg Féminines","FRA","Première Ligue",64],
  ["Le Havre AC Féminines","FRA","Première Ligue",64],["Olympique Marseille Féminines","FRA","Première Ligue",66],
  /* Italien – Serie A Femminile */
  ["Juventus Women","ITA","Serie A Femminile",79],["AS Roma Femminile","ITA","Serie A Femminile",80],
  ["ACF Fiorentina Femminile","ITA","Serie A Femminile",73],["Inter Women","ITA","Serie A Femminile",73],
  ["AC Milan Women","ITA","Serie A Femminile",72],["US Sassuolo Femminile","ITA","Serie A Femminile",69],
  ["Napoli Femminile","ITA","Serie A Femminile",66],["SS Lazio Femminile","ITA","Serie A Femminile",67],
  ["Sampdoria Women","ITA","Serie A Femminile",65],["Como Women","ITA","Serie A Femminile",66],
  ["Freedom FC Women","ITA","Serie A Femminile",64],["Hellas Verona Women","ITA","Serie A Femminile",64],
  /* USA – NWSL */
  ["Orlando Pride","USA","NWSL",86],["NJ/NY Gotham FC","USA","NWSL",84],
  ["Portland Thorns","USA","NWSL",82],["Kansas City Current","USA","NWSL",83],
  ["Washington Spirit","USA","NWSL",82],["San Diego Wave","USA","NWSL",79],
  ["Angel City FC","USA","NWSL",77],["North Carolina Courage","USA","NWSL",78],
  ["Seattle Reign","USA","NWSL",77],["Chicago Red Stars","USA","NWSL",74],
  ["Racing Louisville","USA","NWSL",74],["Houston Dash","USA","NWSL",73],
  ["Bay FC","USA","NWSL",73],["Utah Royals","USA","NWSL",71],
  /* Mexiko – Liga MX Femenil */
  ["Club América Femenil","MEX","Liga MX Femenil",76],["Tigres UANL Femenil","MEX","Liga MX Femenil",78],
  ["CF Monterrey Femenil","MEX","Liga MX Femenil",75],["Chivas Guadalajara Femenil","MEX","Liga MX Femenil",73],
  ["Pachuca Femenil","MEX","Liga MX Femenil",72],["Cruz Azul Femenil","MEX","Liga MX Femenil",68],
  ["Toluca Femenil","MEX","Liga MX Femenil",67],["Pumas UNAM Femenil","MEX","Liga MX Femenil",66],
  ["Club Tijuana Femenil","MEX","Liga MX Femenil",65],["Atlas Femenil","MEX","Liga MX Femenil",65],
  ["Santos Laguna Femenil","MEX","Liga MX Femenil",64],["Club León Femenil","MEX","Liga MX Femenil",63],
  /* Schweden – Damallsvenskan */
  ["BK Häcken FF","SWE","Damallsvenskan",74],["Rosengård","SWE","Damallsvenskan",73],
  ["Hammarby IF Dam","SWE","Damallsvenskan",72],["Djurgardens IF Dam","SWE","Damallsvenskan",70],
  ["Linköpings FC","SWE","Damallsvenskan",68],["Kristianstads DFF","SWE","Damallsvenskan",67],
  ["AIK Dam","SWE","Damallsvenskan",66],["Vittsjö GIK","SWE","Damallsvenskan",65],
  ["Piteå IF Dam","SWE","Damallsvenskan",64],["IFK Norrköping Dam","SWE","Damallsvenskan",63],
  ["Brommapojkarna Dam","SWE","Damallsvenskan",62],["Alingsås FC","SWE","Damallsvenskan",61],
  /* Norwegen – Toppserien */
  ["Brann Kvinner","NOR","Toppserien",73],["Vålerenga Kvinner","NOR","Toppserien",72],
  ["Rosenborg Kvinner","NOR","Toppserien",69],["LSK Kvinner","NOR","Toppserien",70],
  ["Lyn Kvinner","NOR","Toppserien",65],["Stabaek Kvinner","NOR","Toppserien",66],
  ["Åsane Kvinner","NOR","Toppserien",63],["Rälingen","NOR","Toppserien",62],
  ["Arna-Bjørnar","NOR","Toppserien",64],["Kolbotn","NOR","Toppserien",63],
  /* Niederlande – Eredivisie Vrouwen */
  ["Ajax Vrouwen","NED","Eredivisie Vrouwen",73],["FC Twente Vrouwen","NED","Eredivisie Vrouwen",74],
  ["PSV Vrouwen","NED","Eredivisie Vrouwen",72],["Feyenoord Vrouwen","NED","Eredivisie Vrouwen",68],
  ["FC Utrecht Vrouwen","NED","Eredivisie Vrouwen",66],["AZ Vrouwen","NED","Eredivisie Vrouwen",65],
  ["SC Heerenveen Vrouwen","NED","Eredivisie Vrouwen",64],["Fortuna Sittard Vrouwen","NED","Eredivisie Vrouwen",63],
  ["Excelsior Vrouwen","NED","Eredivisie Vrouwen",61],["PEC Zwolle Vrouwen","NED","Eredivisie Vrouwen",62],
  /* Portugal – Liga BPI */
  ["SL Benfica Feminino","POR","Liga BPI",75],["Sporting CP Feminino","POR","Liga BPI",72],
  ["SC Braga Feminino","POR","Liga BPI",70],["Famalicão Feminino","POR","Liga BPI",64],
  ["Torreense Feminino","POR","Liga BPI",62],["Racing Power","POR","Liga BPI",62],
  ["Damaiense","POR","Liga BPI",60],["Länk Vilaverdense","POR","Liga BPI",61],
  ["Valadares Gaia","POR","Liga BPI",60],["Ouriense","POR","Liga BPI",59],
  /* Australien – A-League Women */
  ["Melbourne City Women","AUS","A-League Women",70],["Sydney FC Women","AUS","A-League Women",70],
  ["Melbourne Victory Women","AUS","A-League Women",68],["Central Coast Mariners Women","AUS","A-League Women",67],
  ["Brisbane Roar Women","AUS","A-League Women",66],["Western Sydney Wanderers Women","AUS","A-League Women",65],
  ["Adelaide United Women","AUS","A-League Women",64],["Perth Glory Women","AUS","A-League Women",63],
  ["Wellington Phoenix Women","AUS","A-League Women",64],["Newcastle Jets Women","AUS","A-League Women",62],
  ["Canberra United","AUS","A-League Women",63],["Western United Women","AUS","A-League Women",62],
  /* Japan – WE League */
  ["INAC Kobe Leonessa","JPN","WE League",74],["Urawa Reds Ladies","JPN","WE League",75],
  ["Tokyo Verdy Beleza","JPN","WE League",73],["Omiya Ardija Ventus","JPN","WE League",68],
  ["Albirex Niigata Ladies","JPN","WE League",67],["Sanfrecce Hiroshima Regina","JPN","WE League",68],
  ["Cerezo Osaka Yanmar Ladies","JPN","WE League",66],["JEF United Chiba Ladies","JPN","WE League",65],
  ["Nojima Stella Kanagawa","JPN","WE League",64],["AC Nagano Parceiro Ladies","JPN","WE League",63],
  ["Sendai Mynavi Ladies","JPN","WE League",64],["Hokkaido Consadole Ladies","JPN","WE League",62],
  /* Brasilien – Brasileirão Feminino */
  ["SE Palmeiras Feminino","BRA","Brasileirão Feminino",76],["Corinthians Feminino","BRA","Brasileirão Feminino",79],
  ["São Paulo FC Feminino","BRA","Brasileirão Feminino",73],["Ferroviária Feminino","BRA","Brasileirão Feminino",72],
  ["Internacional Feminino","BRA","Brasileirão Feminino",71],["Cruzeiro Feminino","BRA","Brasileirão Feminino",70],
  ["Flamengo Feminino","BRA","Brasileirão Feminino",70],["Grêmio Feminino","BRA","Brasileirão Feminino",68],
  ["Santos Feminino","BRA","Brasileirão Feminino",69],["Bahia Feminino","BRA","Brasileirão Feminino",66],
  ["Botafogo Feminino","BRA","Brasileirão Feminino",66],["Real Brasília","BRA","Brasileirão Feminino",64],
  /* Kolumbien – Liga Femenina */
  ["Atlético Nacional Femenino","COL","Liga Femenina",69],["América de Cali Femenino","COL","Liga Femenina",70],
  ["Independiente Santa Fe Femenino","COL","Liga Femenina",71],["Deportivo Cali Femenino","COL","Liga Femenina",68],
  ["Millonarios Femenino","COL","Liga Femenina",66],["Deportivo Pereira Femenino","COL","Liga Femenina",64],
  ["Junior Femenino","COL","Liga Femenina",64],["Atlético Huila","COL","Liga Femenina",65],
  ["Independiente Medellín Femenino","COL","Liga Femenina",65],["Real Santander","COL","Liga Femenina",62],
];
const CLUBS = [
  ...[...RAW, ...RAW2, ...RAW3].filter((r, i, a) => a.findIndex((x) => x[0] === r[0]) === i)
    .map(([n, c, l, s]) => ({ n, c, l, s, g: "m" })),
  ...RAW_W.filter((r, i, a) => a.findIndex((x) => x[0] === r[0]) === i)
    .map(([n, c, l, s]) => ({ n, c, l, s, g: "w" })),
];
const LEAGUES = {}; CLUBS.forEach((c) => { (LEAGUES[c.l] = LEAGUES[c.l] || []).push(c); });
Object.values(LEAGUES).forEach((l) => l.sort((a, b) => b.s - a.s));
const TOP5 = ["Bundesliga", "Premier League", "La Liga", "Serie A", "Ligue 1"];
const HOME = {
  GER:["Bundesliga","2. Bundesliga","3. Liga"], ENG:["Premier League","Championship","EFL League One"],
  ESP:["La Liga","LaLiga 2","Primera Federación"], ITA:["Serie A","Serie B","Serie C"],
  FRA:["Ligue 1","Ligue 2"], NED:["Eredivisie","Eerste Divisie"], POR:["Liga Portugal","Liga Portugal 2"],
  GRE:["Super League"], TUR:["Süper Lig","TFF 1. Lig"], BEL:["Jupiler Pro League","Challenger Pro League"],
  AUT:["Bundesliga (AT)","2. Liga (AT)"], SUI:["Super League (CH)","Challenge League"],
  DEN:["Superliga","1. Division"], NOR:["Eliteserien","1. divisjon"], SWE:["Allsvenskan"],
  CRO:["HNL"], SRB:["Superliga (SRB)"], POL:["Ekstraklasa","I liga"],
  BRA:["Série A","Série B"], ARG:["Liga Profesional","Primera Nacional"], USA:["MLS"],
  JPN:["J1 League","J2 League"], MAR:["Botola"],
  SCO:["Scottish Premiership","Championship (SCO)"], CZE:["Chance Liga","FNL"],
  HUN:["NB I"], BUL:["Parva Liga"], UKR:["Premjer-Liha"], KOR:["K League 1"],
  KSA:["Saudi Pro League"], EGY:["Premier League (EGY)"], RSA:["Premiership (RSA)"],
  UAE:["UAE Pro League"], QAT:["Qatar Stars League"],
  MEX:["Liga MX"], COL:["Categoría Primera A"], URU:["Primera División (URU)"],
  CHI:["Primera División (CHI)"], ECU:["Liga Pro"], PAR:["Primera División (PAR)"],
  AUS:["A-League Men"], RUS:["Premjer-Liga"] };
/* Auf- und Abstieg: [Liga darüber, Liga darunter] */
const TIER = {
  "Bundesliga":["", "2. Bundesliga"], "2. Bundesliga":["Bundesliga","3. Liga"], "3. Liga":["2. Bundesliga",""],
  "Premier League":["", "Championship"], "Championship":["Premier League","EFL League One"], "EFL League One":["Championship",""],
  "La Liga":["", "LaLiga 2"], "LaLiga 2":["La Liga","Primera Federación"], "Primera Federación":["LaLiga 2",""],
  "Serie A":["", "Serie B"], "Serie B":["Serie A","Serie C"], "Serie C":["Serie B",""],
  "Ligue 1":["", "Ligue 2"], "Ligue 2":["Ligue 1",""],
  "Liga Portugal":["", "Liga Portugal 2"], "Liga Portugal 2":["Liga Portugal",""],
  "Eredivisie":["", "Eerste Divisie"], "Eerste Divisie":["Eredivisie",""],
  "Jupiler Pro League":["", "Challenger Pro League"], "Challenger Pro League":["Jupiler Pro League",""],
  "Süper Lig":["", "TFF 1. Lig"], "TFF 1. Lig":["Süper Lig",""],
  "Superliga":["", "1. Division"], "1. Division":["Superliga",""],
  "Ekstraklasa":["", "I liga"], "I liga":["Ekstraklasa",""],
  "Scottish Premiership":["", "Championship (SCO)"], "Championship (SCO)":["Scottish Premiership",""],
  "Bundesliga (AT)":["", "2. Liga (AT)"], "2. Liga (AT)":["Bundesliga (AT)",""],
  "Super League (CH)":["", "Challenge League"], "Challenge League":["Super League (CH)",""],
  "Chance Liga":["", "FNL"], "FNL":["Chance Liga",""],
  "Eliteserien":["", "1. divisjon"], "1. divisjon":["Eliteserien",""],
  "Série A":["", "Série B"], "Série B":["Série A",""],
  "Liga Profesional":["", "Primera Nacional"], "Primera Nacional":["Liga Profesional",""],
  "J1 League":["", "J2 League"], "J2 League":["J1 League",""],
  "Women's Super League":["", "Women's Championship"], "Women's Championship":["Women's Super League",""],
  "Frauen-Bundesliga":["", "2. Frauen-Bundesliga"], "2. Frauen-Bundesliga":["Frauen-Bundesliga",""],
};
const POKAL = { GER:"DFB-Pokal", ENG:"FA Cup", ESP:"Copa del Rey", ITA:"Coppa Italia", FRA:"Coupe de France",
  NED:"KNVB-Beker", POR:"Taça de Portugal", GRE:"Griechischer Pokal", TUR:"Türkischer Pokal", SCO:"Scottish Cup",
  BEL:"Belgischer Pokal", AUT:"ÖFB-Cup", SUI:"Schweizer Cup", DEN:"Dänischer Pokal", NOR:"Norwegischer Pokal",
  SWE:"Svenska Cupen", CZE:"Tschechischer Pokal", CRO:"Kroatischer Pokal", SRB:"Serbischer Pokal", POL:"Polnischer Pokal",
  HUN:"Ungarischer Pokal", UKR:"Ukrainischer Pokal", BUL:"Bulgarischer Pokal", BRA:"Copa do Brasil", ARG:"Copa Argentina",
  KSA:"King's Cup", USA:"US Open Cup", JPN:"Kaiserpokal", KOR:"Koreanischer Pokal", EGY:"Ägyptischer Pokal",
  MAR:"Marokkanischer Pokal", RSA:"Nedbank Cup", RUS:"Russischer Pokal", COL:"Copa Colombia",
  ECU:"Copa Ecuador", URU:"Copa Uruguay", CHI:"Copa Chile", PAR:"Copa Paraguay", MEX:"Copa MX",
  UAE:"President's Cup", QAT:"Emir Cup", AUS:"Australia Cup" };
const pokalName = (c) => POKAL[c] || "Landespokal";

/* ---------------- Nationen ----------------
   Aufbau je Zeile: Kürzel | Name | Flagge | Stärke | Namenspool | Sprachraum | Klima | Konföderation
   Sprachraum und Klima steuern zusammen mit historischen Bindungen, welche
   Vereine sich für dich interessieren.                                        */
const HOME_W = {
  ENG:["Women's Super League","Women's Championship"], GER:["Frauen-Bundesliga","2. Frauen-Bundesliga"],
  ESP:["Liga F"], FRA:["Première Ligue"], ITA:["Serie A Femminile"], USA:["NWSL"],
  MEX:["Liga MX Femenil"], SWE:["Damallsvenskan"], NOR:["Toppserien"], NED:["Eredivisie Vrouwen"],
  POR:["Liga BPI"], AUS:["A-League Women"], JPN:["WE League"], BRA:["Brasileirão Feminino"],
  COL:["Liga Femenina"],
};
const START_W = {
  en:["Women's Championship","A-League Women","Eredivisie Vrouwen"],
  es:["Liga Femenina","Liga MX Femenil","Liga BPI"],
  pt:["Liga BPI","Brasileirão Feminino"],
  fr:["Première Ligue","Eredivisie Vrouwen","Liga BPI"],
  de:["2. Frauen-Bundesliga","Eredivisie Vrouwen"],
  nl:["Eredivisie Vrouwen","2. Frauen-Bundesliga"],
  it:["Serie A Femminile","Liga BPI"],
  sk:["Toppserien","Damallsvenskan"], fi:["Damallsvenskan","Toppserien"],
  sl:["2. Frauen-Bundesliga","Liga BPI","Damallsvenskan"],
  jp:["WE League"], ko:["WE League"], cn:["WE League","A-League Women"],
  ar:["Liga BPI","Liga Femenina"], sw:["Liga Femenina","Liga BPI"], af:["Liga BPI","Liga Femenina"],
  oc:["A-League Women"], in:["A-League Women"], se:["A-League Women","WE League"],
};
const NAT_STR_W = {
  USA:92,ESP:92,ENG:89,GER:87,FRA:86,SWE:85,JPN:83,NED:83,BRA:82,CAN:80,AUS:79,NOR:78,
  DEN:76,ITA:75,COL:74,POR:73,CHN:72,KOR:72,ISL:72,SUI:72,NGA:72,AUT:71,IRL:70,BEL:70,
  MEX:70,POL:68,SCO:68,WAL:68,ARG:68,JAM:68,RSA:68,CZE:64,FIN:66,NZL:66,MAR:66,ZAM:66,
  HAI:62,SRB:62,UKR:62,RUS:62,CHI:62,CRC:62,PAN:60,NIR:60,VIE:58,PHI:58,VEN:58,
  PER:55,ECU:55,URU:55,PAR:52,GRE:52,TUR:52,CRO:52,ISR:50,IND:45,
};
const natStrength = (nat, g) => g === "w"
  ? (NAT_STR_W[nat.id] != null ? NAT_STR_W[nat.id] : clamp(Math.round(nat.str * .78), 14, 66))
  : nat.str;

const NAT_DATA = `
ALB|Albanien|🇦🇱|62|ea|sl|med|UEFA
AND|Andorra|🇦🇩|33|es|es|med|UEFA
ARM|Armenien|🇦🇲|54|ea|ka|high|UEFA
AUT|Österreich|🇦🇹|75|de|de|temp|UEFA
AZE|Aserbaidschan|🇦🇿|54|tk|tk|arid|UEFA
BLR|Belarus|🇧🇾|58|ea|sl|cold|UEFA
BEL|Belgien|🇧🇪|82|fr|fr|temp|UEFA
BIH|Bosnien und Herzegowina|🇧🇦|67|ea|sl|temp|UEFA
BUL|Bulgarien|🇧🇬|58|ea|sl|temp|UEFA
CRO|Kroatien|🇭🇷|80|ea|sl|med|UEFA
CYP|Zypern|🇨🇾|53|gr|gr|med|UEFA
CZE|Tschechien|🇨🇿|70|ea|sl|temp|UEFA
DEN|Dänemark|🇩🇰|77|sk|sk|temp|UEFA
ENG|England|🏴󠁧󠁢󠁥󠁮󠁧󠁿|90|en|en|oce|UEFA
EST|Estland|🇪🇪|48|sk|fi|cold|UEFA
FRO|Färöer|🇫🇴|38|sk|sk|cold|UEFA
FIN|Finnland|🇫🇮|60|sk|fi|cold|UEFA
FRA|Frankreich|🇫🇷|92|fr|fr|temp|UEFA
GEO|Georgien|🇬🇪|61|ea|ka|high|UEFA
GER|Deutschland|🇩🇪|88|de|de|temp|UEFA
GIB|Gibraltar|🇬🇮|30|en|en|med|UEFA
GRE|Griechenland|🇬🇷|64|gr|gr|med|UEFA
HUN|Ungarn|🇭🇺|64|ea|hu|temp|UEFA
ISL|Island|🇮🇸|61|sk|sk|cold|UEFA
ISR|Israel|🇮🇱|63|he|he|med|UEFA
ITA|Italien|🇮🇹|84|it|it|med|UEFA
KAZ|Kasachstan|🇰🇿|54|tk|tk|arid|UEFA
KOS|Kosovo|🇽🇰|59|ea|sl|temp|UEFA
LVA|Lettland|🇱🇻|47|sk|lv|cold|UEFA
LIE|Liechtenstein|🇱🇮|28|de|de|temp|UEFA
LTU|Litauen|🇱🇹|48|sk|lv|cold|UEFA
LUX|Luxemburg|🇱🇺|50|de|fr|temp|UEFA
MLT|Malta|🇲🇹|42|it|it|med|UEFA
MDA|Moldau|🇲🇩|48|ea|ro|temp|UEFA
MCO|Monaco|🇲🇨|30|fr|fr|med|UEFA
MNE|Montenegro|🇲🇪|58|ea|sl|med|UEFA
NED|Niederlande|🇳🇱|85|nl|nl|temp|UEFA
MKD|Nordmazedonien|🇲🇰|57|ea|sl|temp|UEFA
NIR|Nordirland|🇬🇧|60|en|en|oce|UEFA
NOR|Norwegen|🇳🇴|70|sk|sk|cold|UEFA
POL|Polen|🇵🇱|71|ea|sl|temp|UEFA
POR|Portugal|🇵🇹|87|pt|pt|med|UEFA
IRL|Irland|🇮🇪|67|en|en|oce|UEFA
ROU|Rumänien|🇷🇴|65|ea|ro|temp|UEFA
RUS|Russland|🇷🇺|69|ea|sl|cold|UEFA
SMR|San Marino|🇸🇲|22|it|it|med|UEFA
SCO|Schottland|🏴󠁧󠁢󠁳󠁣󠁴󠁿|70|en|en|oce|UEFA
SUI|Schweiz|🇨🇭|74|de|de|temp|UEFA
SRB|Serbien|🇷🇸|73|ea|sl|temp|UEFA
SVK|Slowakei|🇸🇰|62|ea|sl|temp|UEFA
SVN|Slowenien|🇸🇮|64|ea|sl|temp|UEFA
ESP|Spanien|🇪🇸|91|es|es|med|UEFA
SWE|Schweden|🇸🇪|68|sk|sk|cold|UEFA
TUR|Türkei|🇹🇷|72|tr|tr|med|UEFA
UKR|Ukraine|🇺🇦|71|ea|sl|temp|UEFA
WAL|Wales|🏴󠁧󠁢󠁷󠁬󠁳󠁿|67|en|en|oce|UEFA
ARG|Argentinien|🇦🇷|90|es|es|temp|CONMEBOL
BOL|Bolivien|🇧🇴|58|es|es|high|CONMEBOL
BRA|Brasilien|🇧🇷|89|pt|pt|trop|CONMEBOL
CHI|Chile|🇨🇱|71|es|es|med|CONMEBOL
COL|Kolumbien|🇨🇴|79|es|es|trop|CONMEBOL
ECU|Ecuador|🇪🇨|73|es|es|trop|CONMEBOL
PAR|Paraguay|🇵🇾|68|es|es|trop|CONMEBOL
PER|Peru|🇵🇪|66|es|es|high|CONMEBOL
URU|Uruguay|🇺🇾|80|es|es|temp|CONMEBOL
VEN|Venezuela|🇻🇪|62|es|es|trop|CONMEBOL
ATG|Antigua und Barbuda|🇦🇬|32|en|en|trop|CONCACAF
ARU|Aruba|🇦🇼|25|nl|nl|trop|CONCACAF
BAH|Bahamas|🇧🇸|28|en|en|trop|CONCACAF
BRB|Barbados|🇧🇧|32|en|en|trop|CONCACAF
BLZ|Belize|🇧🇿|30|en|en|trop|CONCACAF
BER|Bermuda|🇧🇲|33|en|en|oce|CONCACAF
CAN|Kanada|🇨🇦|71|en|en|cold|CONCACAF
CRC|Costa Rica|🇨🇷|64|es|es|trop|CONCACAF
DMA|Dominica|🇩🇲|25|en|en|trop|CONCACAF
DOM|Dominikanische Republik|🇩🇴|42|es|es|trop|CONCACAF
SLV|El Salvador|🇸🇻|45|es|es|trop|CONCACAF
GRN|Grenada|🇬🇩|30|en|en|trop|CONCACAF
GUA|Guatemala|🇬🇹|48|es|es|trop|CONCACAF
GUY|Guyana|🇬🇾|33|en|en|trop|CONCACAF
HAI|Haiti|🇭🇹|50|fr|fr|trop|CONCACAF
HON|Honduras|🇭🇳|52|es|es|trop|CONCACAF
JAM|Jamaika|🇯🇲|58|en|en|trop|CONCACAF
CUB|Kuba|🇨🇺|45|es|es|trop|CONCACAF
CUW|Curaçao|🇨🇼|45|nl|nl|trop|CONCACAF
MEX|Mexiko|🇲🇽|74|es|es|arid|CONCACAF
NCA|Nicaragua|🇳🇮|35|es|es|trop|CONCACAF
PAN|Panama|🇵🇦|58|es|es|trop|CONCACAF
PUR|Puerto Rico|🇵🇷|33|es|es|trop|CONCACAF
SKN|St. Kitts und Nevis|🇰🇳|28|en|en|trop|CONCACAF
LCA|St. Lucia|🇱🇨|26|en|en|trop|CONCACAF
VIN|St. Vincent und die Grenadinen|🇻🇨|26|en|en|trop|CONCACAF
SUR|Suriname|🇸🇷|42|nl|nl|trop|CONCACAF
TRI|Trinidad und Tobago|🇹🇹|48|en|en|trop|CONCACAF
USA|USA|🇺🇸|73|en|en|temp|CONCACAF
EGY|Ägypten|🇪🇬|72|ar|ar|arid|CAF
ALG|Algerien|🇩🇿|75|ar|ar|arid|CAF
ANG|Angola|🇦🇴|52|pt|pt|trop|CAF
EQG|Äquatorialguinea|🇬🇶|45|es|es|trop|CAF
ETH|Äthiopien|🇪🇹|40|af|am|high|CAF
BEN|Benin|🇧🇯|50|fr|fr|trop|CAF
BOT|Botsuana|🇧🇼|38|en|en|arid|CAF
BFA|Burkina Faso|🇧🇫|60|fr|fr|arid|CAF
BDI|Burundi|🇧🇮|38|fr|fr|trop|CAF
CIV|Elfenbeinküste|🇨🇮|72|fr|fr|trop|CAF
ERI|Eritrea|🇪🇷|28|af|am|arid|CAF
SWZ|Eswatini|🇸🇿|32|en|en|trop|CAF
GAB|Gabun|🇬🇦|52|fr|fr|trop|CAF
GAM|Gambia|🇬🇲|50|en|en|trop|CAF
GHA|Ghana|🇬🇭|70|en|en|trop|CAF
GUI|Guinea|🇬🇳|60|fr|fr|trop|CAF
GNB|Guinea-Bissau|🇬🇼|48|pt|pt|trop|CAF
CMR|Kamerun|🇨🇲|70|fr|fr|trop|CAF
CPV|Kap Verde|🇨🇻|58|pt|pt|trop|CAF
KEN|Kenia|🇰🇪|45|af|sw|high|CAF
COM|Komoren|🇰🇲|38|fr|fr|trop|CAF
CGO|Republik Kongo|🇨🇬|48|fr|fr|trop|CAF
COD|DR Kongo|🇨🇩|64|fr|fr|trop|CAF
LES|Lesotho|🇱🇸|30|en|en|high|CAF
LBR|Liberia|🇱🇷|38|en|en|trop|CAF
LBY|Libyen|🇱🇾|45|ar|ar|arid|CAF
MAD|Madagaskar|🇲🇬|48|fr|fr|trop|CAF
MWI|Malawi|🇲🇼|38|en|en|trop|CAF
MLI|Mali|🇲🇱|65|fr|fr|arid|CAF
MAR|Marokko|🇲🇦|78|ar|ar|med|CAF
MTN|Mauretanien|🇲🇷|42|ar|ar|arid|CAF
MRI|Mauritius|🇲🇺|28|fr|fr|trop|CAF
MOZ|Mosambik|🇲🇿|45|pt|pt|trop|CAF
NAM|Namibia|🇳🇦|38|en|en|arid|CAF
NIG|Niger|🇳🇪|42|fr|fr|arid|CAF
NGA|Nigeria|🇳🇬|74|en|en|trop|CAF
RWA|Ruanda|🇷🇼|38|fr|fr|high|CAF
ZAM|Sambia|🇿🇲|48|en|en|trop|CAF
STP|São Tomé und Príncipe|🇸🇹|25|pt|pt|trop|CAF
SEN|Senegal|🇸🇳|78|fr|fr|arid|CAF
SEY|Seychellen|🇸🇨|22|en|en|trop|CAF
SLE|Sierra Leone|🇸🇱|38|en|en|trop|CAF
ZIM|Simbabwe|🇿🇼|42|en|en|trop|CAF
SOM|Somalia|🇸🇴|22|af|ar|arid|CAF
RSA|Südafrika|🇿🇦|60|en|en|temp|CAF
SUD|Sudan|🇸🇩|38|ar|ar|arid|CAF
SSD|Südsudan|🇸🇸|25|en|ar|trop|CAF
TAN|Tansania|🇹🇿|42|af|sw|trop|CAF
TOG|Togo|🇹🇬|48|fr|fr|trop|CAF
CHA|Tschad|🇹🇩|33|fr|fr|arid|CAF
TUN|Tunesien|🇹🇳|68|ar|ar|med|CAF
UGA|Uganda|🇺🇬|45|af|sw|high|CAF
CTA|Zentralafrikanische Republik|🇨🇫|35|fr|fr|trop|CAF
DJI|Dschibuti|🇩🇯|25|fr|ar|arid|CAF
AFG|Afghanistan|🇦🇫|30|fa|fa|arid|AFC
AUS|Australien|🇦🇺|66|en|en|arid|AFC
BHR|Bahrain|🇧🇭|45|ar|ar|arid|AFC
BAN|Bangladesch|🇧🇩|28|in|bn|trop|AFC
BHU|Bhutan|🇧🇹|22|in|in|high|AFC
BRU|Brunei|🇧🇳|22|se|ms|trop|AFC
CHN|China|🇨🇳|52|cn|cn|temp|AFC
TPE|Chinesisch Taipeh|🇹🇼|32|cn|cn|trop|AFC
GUM|Guam|🇬🇺|20|oc|en|trop|AFC
HKG|Hongkong|🇭🇰|38|cn|cn|trop|AFC
IND|Indien|🇮🇳|38|in|in|trop|AFC
IDN|Indonesien|🇮🇩|42|se|ms|trop|AFC
IRQ|Irak|🇮🇶|55|ar|ar|arid|AFC
IRN|Iran|🇮🇷|68|fa|fa|arid|AFC
JPN|Japan|🇯🇵|76|jp|jp|temp|AFC
YEM|Jemen|🇾🇪|25|ar|ar|arid|AFC
JOR|Jordanien|🇯🇴|52|ar|ar|arid|AFC
KHM|Kambodscha|🇰🇭|30|se|km|trop|AFC
QAT|Katar|🇶🇦|58|ar|ar|arid|AFC
KGZ|Kirgisistan|🇰🇬|38|tk|tk|high|AFC
KUW|Kuwait|🇰🇼|42|ar|ar|arid|AFC
LAO|Laos|🇱🇦|25|se|lo|trop|AFC
LBN|Libanon|🇱🇧|42|ar|ar|med|AFC
MAC|Macau|🇲🇴|20|cn|cn|trop|AFC
MAS|Malaysia|🇲🇾|40|se|ms|trop|AFC
MDV|Malediven|🇲🇻|25|in|in|trop|AFC
MNG|Mongolei|🇲🇳|22|cn|mn|cold|AFC
MYA|Myanmar|🇲🇲|30|se|my|trop|AFC
NEP|Nepal|🇳🇵|28|in|in|high|AFC
PRK|Nordkorea|🇰🇵|42|jp|ko|temp|AFC
OMA|Oman|🇴🇲|50|ar|ar|arid|AFC
PAK|Pakistan|🇵🇰|22|in|ur|arid|AFC
PLE|Palästina|🇵🇸|45|ar|ar|med|AFC
PHI|Philippinen|🇵🇭|33|se|ph|trop|AFC
KSA|Saudi-Arabien|🇸🇦|62|ar|ar|arid|AFC
SIN|Singapur|🇸🇬|30|se|ms|trop|AFC
SRI|Sri Lanka|🇱🇰|25|in|in|trop|AFC
KOR|Südkorea|🇰🇷|74|jp|ko|temp|AFC
SYR|Syrien|🇸🇾|48|ar|ar|arid|AFC
TJK|Tadschikistan|🇹🇯|42|tk|fa|high|AFC
THA|Thailand|🇹🇭|45|se|th|trop|AFC
TLS|Timor-Leste|🇹🇱|20|pt|pt|trop|AFC
TKM|Turkmenistan|🇹🇲|35|tk|tk|arid|AFC
UZB|Usbekistan|🇺🇿|55|tk|tk|arid|AFC
UAE|Vereinigte Arabische Emirate|🇦🇪|55|ar|ar|arid|AFC
VIE|Vietnam|🇻🇳|42|se|vi|trop|AFC
ASA|Amerikanisch-Samoa|🇦🇸|15|oc|en|trop|OFC
COK|Cookinseln|🇨🇰|15|oc|en|trop|OFC
FIJ|Fidschi|🇫🇯|30|oc|en|trop|OFC
KIR|Kiribati|🇰🇮|12|oc|en|trop|OFC
MHL|Marshallinseln|🇲🇭|12|oc|en|trop|OFC
FSM|Mikronesien|🇫🇲|12|oc|en|trop|OFC
NRU|Nauru|🇳🇷|10|oc|en|trop|OFC
NCL|Neukaledonien|🇳🇨|30|fr|fr|trop|OFC
NZL|Neuseeland|🇳🇿|55|en|en|oce|OFC
PLW|Palau|🇵🇼|12|oc|en|trop|OFC
PNG|Papua-Neuguinea|🇵🇬|25|oc|en|trop|OFC
SOL|Salomonen|🇸🇧|25|oc|en|trop|OFC
SAM|Samoa|🇼🇸|18|oc|en|trop|OFC
TAH|Tahiti|🇵🇫|28|fr|fr|trop|OFC
TGA|Tonga|🇹🇴|15|oc|en|trop|OFC
TUV|Tuvalu|🇹🇻|10|oc|en|trop|OFC
VAN|Vanuatu|🇻🇺|20|oc|en|trop|OFC
`;
const NATIONS = [], REGION = {}, SPHERE = {}, CLIMATE = {}, NAT_CONF = {};
NAT_DATA.trim().split("\n").forEach((line) => {
  const [id, name, flag, str, pool, sph, cli, conf] = line.split("|");
  NATIONS.push({ id, name, flag, str: +str, conf });
  REGION[id] = pool; SPHERE[id] = sph; CLIMATE[id] = cli; NAT_CONF[id] = conf;
});
NATIONS.sort((a, b) => a.name.localeCompare(b.name, "de"));
const CONF_LABEL = { UEFA:"Europa (UEFA)", CONMEBOL:"Südamerika (CONMEBOL)",
  CONCACAF:"Nord- und Mittelamerika (CONCACAF)", CAF:"Afrika (CAF)",
  AFC:"Asien (AFC)", OFC:"Ozeanien (OFC)" };
const NAT_BY_ID = {};
NATIONS.forEach((n) => { NAT_BY_ID[n.id] = n; });
const REGION_KEYS = Object.keys(REGION);

/* Historische Bindungen: Kolonialgeschichte, Auswanderung, gemeinsame Vergangenheit.
   Vereine aus diesen Ländern interessieren sich eher für dich.               */
const TIES = {
  FRA:["SEN","ALG","MAR","TUN","CIV","CMR","MLI","BFA","GUI","GAB","COD","CGO","MAD","HAI","BEN","TOG","NIG","CHA","CTA","COM","DJI","MRI","NCL","TAH","MCO","LBN","VIE","LAO","KHM","BDI","RWA","BEL","SUI","LUX"],
  ESP:["ARG","MEX","COL","PER","CHI","URU","PAR","VEN","ECU","BOL","CUB","DOM","CRC","GUA","HON","SLV","NCA","PAN","PUR","EQG","AND"],
  POR:["BRA","ANG","MOZ","CPV","GNB","STP","TLS","MAC"],
  ENG:["IRL","SCO","WAL","NIR","NGA","GHA","RSA","KEN","UGA","TAN","ZAM","ZIM","JAM","TRI","BRB","GUY","IND","PAK","BAN","SRI","AUS","NZL","MLT","CYP","SIN","MAS","HKG","GAM","SLE","BOT","LES","SWZ","MWI","NAM","BLZ","BER","GIB"],
  NED:["SUR","CUW","ARU","IDN","BEL","RSA"],
  BEL:["COD","RWA","BDI","FRA","NED","LUX"],
  GER:["AUT","SUI","LIE","LUX","TUR","POL","RUS","KAZ","NAM","CRO","BIH","KOS","SRB"],
  TUR:["AZE","TKM","UZB","KGZ","KOS","MKD","BIH","ALB","CYP","GER","BUL","NED"],
  RUS:["BLR","KAZ","UZB","KGZ","TJK","TKM","ARM","GEO","MDA","LVA","LTU","EST","AZE","SRB"],
  USA:["MEX","PUR","CAN","PHI","LBR","GUM","ASA","JAM","TRI"],
  ITA:["ALB","SMR","MLT","LBY","ERI","SOM","ETH","SUI","CRO","SVN","ARG","BRA"],
  BRA:["POR","ANG","MOZ","CPV","JPN","ARG","PAR","URU"],
  ARG:["ESP","ITA","URU","PAR","CHI","BOL"],
  JPN:["BRA","PER","KOR","TPE","THA"],
  KOR:["JPN","CHN","USA","UZB"],
  AUS:["NZL","ENG","SCO","IRL","PNG","FIJ","SOL","VAN","GRE","ITA","CRO","LBN"],
  MEX:["USA","ESP","GUA","HON","SLV","CRC"],
  KSA:["EGY","MAR","TUN","JOR","SYR","LBN","IRQ","SUD","BHR","KUW","OMA","QAT","UAE","YEM"],
  QAT:["KSA","UAE","EGY","MAR","TUN","JOR","IRQ","SUD","ALG"],
  UAE:["KSA","QAT","EGY","MAR","JOR","IRQ","IND","PAK","BAN","PHI"],
  GRE:["CYP","ALB","AUS","GER"],
  SUI:["ITA","FRA","GER","AUT","KOS","ALB","POR","ESP","TUR"],
  SWE:["NOR","DEN","FIN","ISL","IRQ","SYR","BIH"],
  NOR:["SWE","DEN","ISL","FRO","FIN"],
  DEN:["SWE","NOR","ISL","FRO","GER"],
};
const TIE_SET = {};
Object.keys(TIES).forEach((a) => TIES[a].forEach((b) => {
  TIE_SET[a + ">" + b] = 1; TIE_SET[b + ">" + a] = 1;
}));

/* Konflikte: Wechsel dorthin sind sehr unwahrscheinlich, aber nicht ausgeschlossen. */
const HOSTILE = [["KOR","PRK"],["PRK","JPN"],["PRK","USA"],["IND","PAK"],["ARM","AZE"],
  ["RUS","UKR"],["BLR","UKR"],["ISR","IRN"],["ISR","SYR"],["ISR","LBN"],["ISR","IRQ"],
  ["ISR","YEM"],["ISR","LBY"],["ISR","PLE"],["ISR","AFG"],["SRB","KOS"],["ETH","ERI"],
  ["SUD","SSD"],["CHN","TPE"],["MAR","ALG"],["RUS","GEO"]];
const TENSE = [["GRE","TUR"],["SRB","ALB"],["SRB","CRO"],["SRB","BIH"],["KSA","IRN"],
  ["UAE","IRN"],["AFG","PAK"],["CUB","USA"],["VEN","USA"],["RUS","POL"],["RUS","LVA"],
  ["RUS","LTU"],["RUS","EST"],["CYP","TUR"],["ARM","TUR"],["IRN","USA"],["IRQ","IRN"],
  ["VIE","CHN"],["PHI","CHN"],["JPN","CHN"],["IND","CHN"],["BOL","CHI"],["MKD","GRE"],
  ["RUS","MDA"],["AZE","IRN"],["EGY","ETH"],["ALG","FRA"]];
const REL_SET = {};
HOSTILE.forEach(([a, b]) => { REL_SET[a + ">" + b] = .05; REL_SET[b + ">" + a] = .05; });
TENSE.forEach(([a, b]) => { if (!REL_SET[a + ">" + b]) { REL_SET[a + ">" + b] = .35; REL_SET[b + ">" + a] = .35; } });

/* Verhältnis zwischen zwei Ländern aus Sicht eines Spielers */
function relation(a, b) {
  if (!a || !b) return 1;
  if (a === b) return 2.4;
  let v = 1;
  if (SPHERE[a] && SPHERE[a] === SPHERE[b]) v += .95;
  if (TIE_SET[a + ">" + b]) v += 1.15;
  if (CLIMATE[a] && CLIMATE[a] === CLIMATE[b]) v += .3;
  if (NAT_CONF[a] && NAT_CONF[a] === NAT_CONF[b]) v += .35;
  const r = REL_SET[a + ">" + b];
  if (r) v *= r;
  return v;
}

/* Wo fängt ein Talent an, dessen Land keine eigene Liga im Spiel hat?
   Abgeleitet aus Sprachraum und historischer Bindung.                     */
const START_BY_SPHERE = {
  fr:["Ligue 2","Challenger Pro League","Jupiler Pro League","Super League (CH)"],
  es:["Primera Federación","LaLiga 2","Primera Nacional","Liga Pro"],
  pt:["Liga Portugal 2","Primera Federación","Série B"],
  en:["EFL League One","Championship (SCO)","Eerste Divisie","A-League Men"],
  ar:["UAE Pro League","Qatar Stars League","TFF 1. Lig","Botola"],
  sl:["I liga","FNL","Superliga (SRB)","HNL","Premjer-Liha"],
  sk:["1. divisjon","1. Division","Allsvenskan"],
  fi:["1. divisjon","Allsvenskan","1. Division"],
  lv:["I liga","1. divisjon","FNL"],
  ro:["I liga","FNL","Premjer-Liha"],
  hu:["I liga","FNL","Chance Liga"],
  tk:["TFF 1. Lig","Premjer-Liha","I liga"],
  ka:["Premjer-Liha","TFF 1. Lig","FNL"],
  fa:["Qatar Stars League","UAE Pro League","TFF 1. Lig"],
  he:["TFF 1. Lig","Challenge League","2. Liga (AT)"],
  cn:["J2 League","K League 1","A-League Men"],
  ko:["K League 1","J2 League"],
  jp:["J2 League","K League 1"],
  ms:["J2 League","A-League Men","K League 1"],
  th:["J2 League","A-League Men"],
  vi:["J2 League","A-League Men"],
  km:["J2 League","A-League Men"],
  lo:["J2 League","A-League Men"],
  my:["J2 League","A-League Men"],
  ph:["J2 League","A-League Men","K League 1"],
  in:["A-League Men","J2 League","EFL League One"],
  ur:["A-League Men","UAE Pro League"],
  bn:["A-League Men","J2 League"],
  mn:["J2 League","K League 1"],
  sw:["Premiership (RSA)","Botola","Premier League (EGY)"],
  am:["Premiership (RSA)","Premier League (EGY)","Serie C"],
  af:["Premiership (RSA)","Botola","Premier League (EGY)"],
  nl:["Eerste Divisie","Challenger Pro League"],
  de:["2. Liga (AT)","Challenge League","3. Liga"],
  it:["Serie C","Challenge League"],
  gr:["Super League","Serie C","TFF 1. Lig"],
  tr:["TFF 1. Lig","Super League"],
};
function homeLeagues(natId, g) {
  if (g === "w") {
    if (HOME_W[natId]) return HOME_W[natId];
    const bw = START_W[SPHERE[natId]];
    if (bw) { const ok = bw.filter((l) => LEAGUES[l]); if (ok.length) return ok; }
    return ["Women's Championship", "Liga BPI", "2. Frauen-Bundesliga"];
  }
  if (HOME[natId]) return HOME[natId];
  /* Ozeanien: der kurze Weg führt nach Australien */
  if (NAT_CONF[natId] === "OFC" && LEAGUES["A-League Men"]) return ["A-League Men", "J2 League"];
  const byS = START_BY_SPHERE[SPHERE[natId]];
  if (byS) { const ok = byS.filter((l) => LEAGUES[l]); if (ok.length) return ok; }
  return ["Serie C", "EFL League One", "Primera Federación"];
}

/* ---------------- Ligaökonomie ---------------- */
const LIGA = {
  "Premier League":{pay:16,mv:1.15}, "La Liga":{pay:13,mv:1.12}, "Bundesliga":{pay:12,mv:1.08},
  "Serie A":{pay:11,mv:1.05}, "Ligue 1":{pay:11,mv:1.00}, "Saudi Pro League":{pay:30,mv:0.62},
  "MLS":{pay:5.5,mv:0.70}, "Süper Lig":{pay:5.5,mv:0.82}, "Liga Portugal":{pay:3.6,mv:0.92},
  "Série A":{pay:3.6,mv:0.85}, "Eredivisie":{pay:3.0,mv:0.92}, "Championship":{pay:3.0,mv:0.78},
  "Jupiler Pro League":{pay:2.6,mv:0.85}, "Liga Profesional":{pay:2.4,mv:0.82},
  "Scottish Premiership":{pay:2.4,mv:0.72}, "Bundesliga (AT)":{pay:2.2,mv:0.80},
  "Super League (CH)":{pay:2.0,mv:0.78}, "J1 League":{pay:2.0,mv:0.68}, "Superliga":{pay:1.9,mv:0.78},
  "Premjer-Liha":{pay:1.8,mv:0.72}, "Super League":{pay:1.7,mv:0.72}, "K League 1":{pay:1.5,mv:0.62},
  "2. Bundesliga":{pay:1.4,mv:0.70}, "Serie B":{pay:1.4,mv:0.68}, "LaLiga 2":{pay:1.2,mv:0.66},
  "Eliteserien":{pay:1.2,mv:0.66}, "Chance Liga":{pay:1.2,mv:0.68}, "HNL":{pay:1.2,mv:0.70},
  "Premier League (EGY)":{pay:1.2,mv:0.55}, "Ligue 2":{pay:1.1,mv:0.62}, "Ekstraklasa":{pay:1.1,mv:0.64},
  "NB I":{pay:1.0,mv:0.60}, "Superliga (SRB)":{pay:1.0,mv:0.66}, "Allsvenskan":{pay:1.0,mv:0.64},
  "Premiership (RSA)":{pay:1.0,mv:0.52}, "Botola":{pay:1.0,mv:0.55}, "Parva Liga":{pay:0.8,mv:0.58},
  "3. Liga":{pay:0.35,mv:0.50},
  "Premjer-Liga":{pay:4.5,mv:0.72}, "Liga MX":{pay:4.0,mv:0.68}, "Qatar Stars League":{pay:5.5,mv:0.52},
  "UAE Pro League":{pay:5.0,mv:0.55}, "TFF 1. Lig":{pay:1.3,mv:0.60}, "Série B":{pay:1.2,mv:0.62},
  "Categoría Primera A":{pay:1.1,mv:0.66}, "Primera División (CHI)":{pay:1.1,mv:0.62},
  "Eerste Divisie":{pay:1.0,mv:0.62}, "A-League Men":{pay:1.0,mv:0.58}, "Liga Pro":{pay:0.9,mv:0.62},
  "Challenge League":{pay:0.9,mv:0.58}, "Challenger Pro League":{pay:0.9,mv:0.60},
  "Primera División (URU)":{pay:0.8,mv:0.64}, "Primera División (PAR)":{pay:0.8,mv:0.60},
  "Liga Portugal 2":{pay:0.8,mv:0.58}, "J2 League":{pay:0.8,mv:0.55}, "Primera Nacional":{pay:0.7,mv:0.58},
  "1. Division":{pay:0.7,mv:0.56}, "2. Liga (AT)":{pay:0.7,mv:0.55}, "Championship (SCO)":{pay:0.6,mv:0.52},
  "1. divisjon":{pay:0.6,mv:0.54}, "EFL League One":{pay:0.55,mv:0.52}, "I liga":{pay:0.55,mv:0.54},
  "Primera Federación":{pay:0.5,mv:0.52}, "FNL":{pay:0.5,mv:0.52}, "Serie C":{pay:0.45,mv:0.50},
  "NWSL":{pay:0.46,mv:0.024}, "Women's Super League":{pay:0.42,mv:0.023},
  "Première Ligue":{pay:0.34,mv:0.021}, "Liga F":{pay:0.32,mv:0.021},
  "Frauen-Bundesliga":{pay:0.28,mv:0.019}, "Liga MX Femenil":{pay:0.19,mv:0.013},
  "Serie A Femminile":{pay:0.17,mv:0.015}, "WE League":{pay:0.15,mv:0.012},
  "Damallsvenskan":{pay:0.11,mv:0.010}, "Women's Championship":{pay:0.10,mv:0.008},
  "Brasileirão Feminino":{pay:0.10,mv:0.010}, "Toppserien":{pay:0.09,mv:0.009},
  "Eredivisie Vrouwen":{pay:0.09,mv:0.009}, "A-League Women":{pay:0.09,mv:0.009},
  "Liga BPI":{pay:0.07,mv:0.008}, "Liga Femenina":{pay:0.06,mv:0.007},
  "2. Frauen-Bundesliga":{pay:0.05,mv:0.005},
};
const ligaInfo = (l) => LIGA[l] || { pay: 1, mv: .6 };
/* Vollständige Ligaliste inklusive auf- oder abgestiegenem Verein des Spielers */
function leagueClubs(club) {
  const base = LEAGUES[club.l] || [];
  if (base.some((c) => c.n === club.n)) return base;
  /* Auf- oder abgestiegener Verein: schwächster Klub der Liga weicht, Ligagröße bleibt gleich */
  const others = base.slice().sort((a, b) => b.s - a.s);
  if (others.length) others.pop();
  return [...others, club].sort((a, b) => b.s - a.s);
}
const _tw = {};
function clubTopWage(club) {
  const key = club.n + "|" + club.l + "|" + club.s;
  if (_tw[key] != null) return _tw[key];
  const arr = leagueClubs(club);
  return (_tw[key] = ligaInfo(club.l).pay * Math.pow(clamp(club.s / arr[0].s, .3, 1), 6));
}
const clubBudget = (club) => Math.pow(clubTopWage(club), 1.42) * 3;
const AGE_WAGE = {16:.10,17:.13,18:.20,19:.32,20:.45,21:.60,22:.75,23:.88,24:1,25:1,26:1,27:1,28:1,
  29:1,30:1,31:.97,32:.92,33:.85,34:.75,35:.62,36:.52,37:.45,38:.40,39:.35,40:.30};
function wageFor(p, club) {
  const top = clubTopWage(club);
  const d = p.ovr - (club.s - 2);
  const share = d >= 6 ? 1 : d >= 3 ? .82 : d >= 0 ? .62 : d >= -3 ? .45 : d >= -6 ? .30 : d >= -10 ? .19 : d >= -15 ? .11 : .06;
  const v = top * share * (AGE_WAGE[clamp(p.age, 16, 40)] ?? .3) * (.88 + p.rep / 500) * rnd(.9, 1.12);
  return clamp(Number(v.toFixed(3)), Math.max(.02, top * .025), top * 1.05);
}

/* ---------------- Wappen ---------------- */
const COL = {
  "FC Bayern München":["#D80028","#0B2A5B"],"Borussia Dortmund":["#F5D000","#111111"],"Bayer Leverkusen":["#C8102E","#111111"],
  "RB Leipzig":["#C8102E","#0B2A5B"],"VfB Stuttgart":["#D80028","#E8E8E8"],"Eintracht Frankfurt":["#111111","#C8102E"],
  "SC Freiburg":["#C8102E","#111111"],"VfL Wolfsburg":["#4A9B2E","#E8E8E8"],"Bor. Mönchengladbach":["#111111","#1E8A4C"],
  "Werder Bremen":["#1E8A4C","#E8E8E8"],"TSG Hoffenheim":["#0B4FA0","#E8E8E8"],"1. FSV Mainz 05":["#C8102E","#E8E8E8"],
  "1. FC Union Berlin":["#C8102E","#F5D000"],"FC Augsburg":["#1B5E20","#C8102E"],"FC St. Pauli":["#5C3317","#C8102E"],
  "Hamburger SV":["#0B2A5B","#111111"],"1. FC Köln":["#C8102E","#E8E8E8"],"FC Schalke 04":["#0B4FA0","#E8E8E8"],
  "Hertha BSC":["#0B4FA0","#E8E8E8"],"Fortuna Düsseldorf":["#C8102E","#E8E8E8"],"Hannover 96":["#1E8A4C","#111111"],
  "1. FC Nürnberg":["#8A1128","#111111"],"1. FC Kaiserslautern":["#C8102E","#E8E8E8"],"Karlsruher SC":["#0B4FA0","#E8E8E8"],
  "Hansa Rostock":["#0B4FA0","#E8E8E8"],"Dynamo Dresden":["#F5D000","#111111"],"Arminia Bielefeld":["#0B4FA0","#E8E8E8"],
  "Rot-Weiss Essen":["#C8102E","#E8E8E8"],"MSV Duisburg":["#0B4FA0","#E8E8E8"],"Energie Cottbus":["#C8102E","#111111"],
  "Manchester City":["#5FA8D3","#0B2A5B"],"FC Liverpool":["#C8102E","#1B6B4C"],"FC Arsenal":["#C8102E","#0B2A5B"],
  "FC Chelsea":["#0B3D91","#E8E8E8"],"Manchester United":["#C8102E","#111111"],"Tottenham Hotspur":["#E8E8E8","#0B2A5B"],
  "Newcastle United":["#111111","#E8E8E8"],"Aston Villa":["#6B1F3B","#5FA8D3"],"Brighton & Hove":["#0B4FA0","#E8E8E8"],
  "West Ham United":["#6B1F3B","#5FA8D3"],"FC Everton":["#0B3D91","#E8E8E8"],"Leeds United":["#E8E8E8","#F5D000"],
  "AFC Sunderland":["#C8102E","#E8E8E8"],"Nottingham Forest":["#C8102E","#E8E8E8"],"Leicester City":["#0B4FA0","#F5D000"],
  "Real Madrid":["#E8E8E8","#C7A24B"],"FC Barcelona":["#0B2A5B","#8A1128"],"Atlético Madrid":["#C8102E","#0B2A5B"],
  "Athletic Bilbao":["#C8102E","#E8E8E8"],"Real Sociedad":["#0B4FA0","#E8E8E8"],"FC Villarreal":["#F5D000","#0B2A5B"],
  "Real Betis":["#1E8A4C","#E8E8E8"],"FC Sevilla":["#E8E8E8","#C8102E"],"FC Valencia":["#E8E8E8","#F58220"],
  "Celta Vigo":["#5FA8D3","#E8E8E8"],"Rayo Vallecano":["#E8E8E8","#C8102E"],"RCD Espanyol":["#0B4FA0","#E8E8E8"],
  "Inter Mailand":["#0B2A5B","#111111"],"AC Mailand":["#C8102E","#111111"],"Juventus Turin":["#E8E8E8","#111111"],
  "SSC Neapel":["#12A0D7","#E8E8E8"],"Atalanta Bergamo":["#0B2A5B","#111111"],"AS Rom":["#8A1128","#F58220"],
  "Lazio Rom":["#8FCFE8","#E8E8E8"],"AC Florenz":["#6B3FA0","#E8E8E8"],"FC Bologna":["#8A1128","#0B2A5B"],
  "FC Turin":["#6B1F1F","#E8E8E8"],"FC Genua":["#8A1128","#0B2A5B"],"Sampdoria Genua":["#0B4FA0","#E8E8E8"],
  "Paris Saint-Germain":["#0B2A5B","#C8102E"],"AS Monaco":["#C8102E","#E8E8E8"],"Olympique Marseille":["#5FC8E8","#E8E8E8"],
  "OSC Lille":["#C8102E","#0B2A5B"],"Olympique Lyon":["#E8E8E8","#0B4FA0"],"OGC Nizza":["#C8102E","#111111"],
  "RC Lens":["#F5D000","#C8102E"],"Stade Rennes":["#C8102E","#111111"],"AS Saint-Étienne":["#1E8A4C","#E8E8E8"],
  "PSV Eindhoven":["#C8102E","#E8E8E8"],"Ajax Amsterdam":["#C8102E","#E8E8E8"],"Feyenoord Rotterdam":["#C8102E","#E8E8E8"],
  "SL Benfica":["#C8102E","#E8E8E8"],"FC Porto":["#0B2A5B","#E8E8E8"],"Sporting Lissabon":["#1E8A4C","#E8E8E8"],
  "SC Braga":["#C8102E","#E8E8E8"],
  "Olympiakos Piräus":["#C8102E","#E8E8E8"],"PAOK Thessaloniki":["#111111","#E8E8E8"],"Panathinaikos Athen":["#1E8A4C","#E8E8E8"],
  "AEK Athen":["#F5D000","#111111"],"Aris Thessaloniki":["#F5D000","#111111"],"OFI Kreta":["#111111","#E8E8E8"],
  "Galatasaray Istanbul":["#C8102E","#F5D000"],"Fenerbahce Istanbul":["#F5D000","#0B2A5B"],"Besiktas Istanbul":["#111111","#E8E8E8"],
  "Trabzonspor":["#8A1128","#5FA8D3"],
  "Celtic Glasgow":["#1E8A4C","#E8E8E8"],"Glasgow Rangers":["#0B3D91","#E8E8E8"],"FC Brügge":["#0B4FA0","#111111"],
  "RSC Anderlecht":["#6B1F3B","#E8E8E8"],"RB Salzburg":["#C8102E","#E8E8E8"],"Sturm Graz":["#111111","#E8E8E8"],
  "FC Basel":["#C8102E","#0B2A5B"],"BSC Young Boys":["#F5D000","#111111"],"FC Kopenhagen":["#E8E8E8","#0B4FA0"],
  "Bodö/Glimt":["#F5D000","#111111"],"Slavia Prag":["#C8102E","#E8E8E8"],"Sparta Prag":["#8A1128","#F5D000"],
  "Dinamo Zagreb":["#0B4FA0","#E8E8E8"],"Roter Stern Belgrad":["#C8102E","#E8E8E8"],"Legia Warschau":["#1B5E20","#E8E8E8"],
  "Schachtar Donezk":["#F58220","#111111"],"CR Flamengo":["#C8102E","#111111"],"SE Palmeiras":["#1B5E20","#E8E8E8"],
  "River Plate":["#E8E8E8","#C8102E"],"Boca Juniors":["#0B2A5B","#F5D000"],"Al-Hilal":["#0B4FA0","#E8E8E8"],
  "Al-Nassr":["#F5D000","#0B4FA0"],"Inter Miami":["#F2A8C0","#111111"],"Los Angeles FC":["#111111","#C7A24B"],
};
/* Echte Vereinsfarben, Format: Name|Hauptfarbe|Zweitfarbe */
const COL_DATA = `
Chelsea FC Women|#0B3D91|#E8E8E8
Arsenal Women|#C8102E|#0B2A5B
Manchester City Women|#5FA8D3|#0B2A5B
Manchester United Women|#C8102E|#111111
Tottenham Hotspur Women|#E8E8E8|#0B2A5B
Liverpool FC Women|#C8102E|#1B6B4C
Aston Villa Women|#6B1F3B|#5FA8D3
Brighton Women|#0B4FA0|#E8E8E8
Everton Women|#0B3D91|#E8E8E8
West Ham United Women|#6B1F3B|#5FA8D3
Leicester City Women|#0B4FA0|#F5D000
Crystal Palace Women|#C8102E|#0B4FA0
London City Lionesses|#0B2A5B|#C8A24B
Birmingham City Women|#0B4FA0|#E8E8E8
Southampton Women|#C8102E|#E8E8E8
Charlton Athletic Women|#C8102E|#E8E8E8
Sunderland Women|#C8102E|#E8E8E8
Durham Women|#0B2A5B|#F5D000
Sheffield United Women|#C8102E|#111111
Newcastle United Women|#111111|#E8E8E8
Bristol City Women|#C8102E|#E8E8E8
Blackburn Rovers Women|#0B4FA0|#E8E8E8
Portsmouth Women|#0B4FA0|#E8E8E8
Watford Women|#F5D000|#111111
FC Bayern München Frauen|#D80028|#0B2A5B
VfL Wolfsburg Frauen|#4A9B2E|#E8E8E8
Eintracht Frankfurt Frauen|#111111|#C8102E
TSG Hoffenheim Frauen|#0B4FA0|#E8E8E8
Bayer Leverkusen Frauen|#C8102E|#111111
SC Freiburg Frauen|#C8102E|#111111
Werder Bremen Frauen|#1E8A4C|#E8E8E8
SGS Essen|#C8102E|#E8E8E8
RB Leipzig Frauen|#C8102E|#0B2A5B
1. FC Köln Frauen|#C8102E|#E8E8E8
Carl Zeiss Jena Frauen|#1E8A4C|#E8E8E8
1. FC Nürnberg Frauen|#8A1128|#111111
Turbine Potsdam|#0B4FA0|#E8E8E8
FC Ingolstadt Frauen|#C8102E|#111111
SV Meppen Frauen|#0B4FA0|#E8E8E8
Borussia Bocholt|#0B4FA0|#E8E8E8
1. FC Union Berlin Frauen|#C8102E|#F5D000
SC Sand|#1E8A4C|#E8E8E8
Hamburger SV Frauen|#0B2A5B|#111111
FC Gütersloh|#1E8A4C|#E8E8E8
SV Weinberg|#C8102E|#E8E8E8
Arminia Bielefeld Frauen|#0B4FA0|#E8E8E8
VfL Bochum Frauen|#0B4FA0|#E8E8E8
1. FFC Montabaur|#0B4FA0|#F5D000
FC Barcelona Femení|#0B2A5B|#8A1128
Real Madrid Femenino|#E8E8E8|#C7A24B
Atlético Madrid Femenino|#C8102E|#0B2A5B
Levante UD Femenino|#0B4FA0|#8A1128
Real Sociedad Femenino|#0B4FA0|#E8E8E8
Athletic Club Femenino|#C8102E|#E8E8E8
Sevilla FC Femenino|#E8E8E8|#C8102E
Real Betis Féminas|#1E8A4C|#E8E8E8
Granada CF Femenino|#C8102E|#E8E8E8
Valencia CF Femenino|#E8E8E8|#F58220
Madrid CFF|#6B3FA0|#E8E8E8
RCD Espanyol Femenino|#0B4FA0|#E8E8E8
Olympique Lyon Féminin|#E8E8E8|#0B4FA0
Paris Saint-Germain Féminines|#0B2A5B|#C8102E
Paris FC Féminines|#0B2A5B|#E8E8E8
FC Fleury 91|#0B4FA0|#F5D000
Montpellier HSC Féminines|#0B2A5B|#F58220
Stade de Reims Féminines|#C8102E|#E8E8E8
Dijon FCO Féminines|#C8102E|#E8E8E8
EA Guingamp Féminines|#C8102E|#111111
FC Nantes Féminines|#F5D000|#1E8A4C
RC Strasbourg Féminines|#0B4FA0|#E8E8E8
Le Havre AC Féminines|#5FA8D3|#0B2A5B
Olympique Marseille Féminines|#5FC8E8|#E8E8E8
Juventus Women|#E8E8E8|#111111
AS Roma Femminile|#8A1128|#F58220
ACF Fiorentina Femminile|#6B3FA0|#E8E8E8
Inter Women|#0B2A5B|#111111
AC Milan Women|#C8102E|#111111
US Sassuolo Femminile|#1E8A4C|#111111
Napoli Femminile|#12A0D7|#E8E8E8
SS Lazio Femminile|#8FCFE8|#E8E8E8
Sampdoria Women|#0B4FA0|#E8E8E8
Como Women|#0B2A5B|#E8E8E8
Freedom FC Women|#C8102E|#F5D000
Hellas Verona Women|#F5D000|#0B2A5B
Orlando Pride|#6B3FA0|#E8E8E8
NJ/NY Gotham FC|#111111|#5FC8E8
Portland Thorns|#C8102E|#111111
Kansas City Current|#12A0D7|#C8102E
Washington Spirit|#0B2A5B|#C8102E
San Diego Wave|#0B2A5B|#F2A8C0
Angel City FC|#F2A8C0|#111111
North Carolina Courage|#0B2A5B|#F5D000
Seattle Reign|#6B3FA0|#111111
Chicago Red Stars|#C8102E|#5FA8D3
Racing Louisville|#6B3FA0|#111111
Houston Dash|#F58220|#111111
Bay FC|#5FA8D3|#111111
Utah Royals|#F5D000|#0B2A5B
Club América Femenil|#F5D000|#0B2A5B
Tigres UANL Femenil|#F5A000|#0B2A5B
CF Monterrey Femenil|#0B2A5B|#E8E8E8
Chivas Guadalajara Femenil|#C8102E|#E8E8E8
Pachuca Femenil|#0B2A5B|#E8E8E8
Cruz Azul Femenil|#0B4FA0|#E8E8E8
Toluca Femenil|#C8102E|#E8E8E8
Pumas UNAM Femenil|#0B2A5B|#F5D000
Club Tijuana Femenil|#C8102E|#111111
Atlas Femenil|#C8102E|#111111
Santos Laguna Femenil|#1E8A4C|#E8E8E8
Club León Femenil|#1E8A4C|#E8E8E8
BK Häcken FF|#F5D000|#111111
Rosengård|#C8102E|#E8E8E8
Hammarby IF Dam|#1E8A4C|#E8E8E8
Djurgardens IF Dam|#0B2A5B|#5FA8D3
Linköpings FC|#0B4FA0|#F5D000
Kristianstads DFF|#C8102E|#E8E8E8
AIK Dam|#111111|#F5D000
Vittsjö GIK|#C8102E|#111111
Piteå IF Dam|#C8102E|#111111
IFK Norrköping Dam|#0B4FA0|#E8E8E8
Brommapojkarna Dam|#C8102E|#111111
Alingsås FC|#1E8A4C|#E8E8E8
Brann Kvinner|#C8102E|#E8E8E8
Vålerenga Kvinner|#0B2A5B|#C8102E
Rosenborg Kvinner|#E8E8E8|#111111
LSK Kvinner|#F5D000|#111111
Lyn Kvinner|#C8102E|#E8E8E8
Stabaek Kvinner|#0B4FA0|#E8E8E8
Åsane Kvinner|#F58220|#111111
Rälingen|#0B4FA0|#E8E8E8
Arna-Bjørnar|#1E8A4C|#E8E8E8
Kolbotn|#C8102E|#111111
Ajax Vrouwen|#C8102E|#E8E8E8
FC Twente Vrouwen|#C8102E|#E8E8E8
PSV Vrouwen|#C8102E|#E8E8E8
Feyenoord Vrouwen|#C8102E|#E8E8E8
FC Utrecht Vrouwen|#C8102E|#E8E8E8
AZ Vrouwen|#C8102E|#E8E8E8
SC Heerenveen Vrouwen|#0B4FA0|#E8E8E8
Fortuna Sittard Vrouwen|#F5D000|#1E8A4C
Excelsior Vrouwen|#C8102E|#111111
PEC Zwolle Vrouwen|#0B4FA0|#E8E8E8
SL Benfica Feminino|#C8102E|#E8E8E8
Sporting CP Feminino|#1E8A4C|#E8E8E8
SC Braga Feminino|#C8102E|#E8E8E8
Famalicão Feminino|#E8E8E8|#0B4FA0
Torreense Feminino|#1E8A4C|#E8E8E8
Racing Power|#0B2A5B|#C8A24B
Damaiense|#0B4FA0|#E8E8E8
Länk Vilaverdense|#1E8A4C|#E8E8E8
Valadares Gaia|#0B4FA0|#F5D000
Ouriense|#C8102E|#111111
Melbourne City Women|#5FA8D3|#0B2A5B
Sydney FC Women|#5FC8E8|#0B2A5B
Melbourne Victory Women|#0B2A5B|#E8E8E8
Central Coast Mariners Women|#F5D000|#0B2A5B
Brisbane Roar Women|#F58220|#111111
Western Sydney Wanderers Women|#C8102E|#111111
Adelaide United Women|#C8102E|#111111
Perth Glory Women|#6B3FA0|#E8E8E8
Wellington Phoenix Women|#F5D000|#111111
Newcastle Jets Women|#0B2A5B|#F5D000
Canberra United|#1E8A4C|#E8E8E8
Western United Women|#1E8A4C|#111111
INAC Kobe Leonessa|#C8102E|#111111
Urawa Reds Ladies|#C8102E|#111111
Tokyo Verdy Beleza|#1E8A4C|#E8E8E8
Omiya Ardija Ventus|#F58220|#0B2A5B
Albirex Niigata Ladies|#F58220|#5FA8D3
Sanfrecce Hiroshima Regina|#6B3FA0|#E8E8E8
Cerezo Osaka Yanmar Ladies|#F2A8C0|#111111
JEF United Chiba Ladies|#F5D000|#1E8A4C
Nojima Stella Kanagawa|#0B4FA0|#E8E8E8
AC Nagano Parceiro Ladies|#F58220|#111111
Sendai Mynavi Ladies|#F5D000|#0B4FA0
Hokkaido Consadole Ladies|#C8102E|#111111
SE Palmeiras Feminino|#1B5E20|#E8E8E8
Corinthians Feminino|#111111|#E8E8E8
São Paulo FC Feminino|#C8102E|#111111
Ferroviária Feminino|#C8102E|#111111
Internacional Feminino|#C8102E|#E8E8E8
Cruzeiro Feminino|#0B2A5B|#E8E8E8
Flamengo Feminino|#C8102E|#111111
Grêmio Feminino|#5FA8D3|#111111
Santos Feminino|#E8E8E8|#111111
Bahia Feminino|#0B4FA0|#C8102E
Botafogo Feminino|#111111|#E8E8E8
Real Brasília|#0B2A5B|#F5D000
Atlético Nacional Femenino|#1E8A4C|#E8E8E8
América de Cali Femenino|#C8102E|#E8E8E8
Independiente Santa Fe Femenino|#C8102E|#E8E8E8
Deportivo Cali Femenino|#1E8A4C|#E8E8E8
Millonarios Femenino|#0B2A5B|#E8E8E8
Deportivo Pereira Femenino|#F5D000|#C8102E
Junior Femenino|#C8102E|#E8E8E8
Atlético Huila|#F5D000|#111111
Independiente Medellín Femenino|#C8102E|#0B4FA0
Real Santander|#F5D000|#1E8A4C
Burnley FC|#6B1F3B|#5FC8E8
Luton Town|#F58220|#0B2A5B
Sheffield Wednesday|#0B4FA0|#E8E8E8
Bristol City|#C8102E|#E8E8E8
Swansea City|#E8E8E8|#111111
Queens Park Rangers|#0B4FA0|#E8E8E8
Derby County|#E8E8E8|#111111
Oxford United|#F5D000|#0B2A5B
Plymouth Argyle|#1B5E20|#E8E8E8
Birmingham City|#0B4FA0|#E8E8E8
Wrexham AFC|#C8102E|#E8E8E8
Bolton Wanderers|#E8E8E8|#0B2A5B
Barnsley FC|#C8102E|#E8E8E8
Huddersfield Town|#0B4FA0|#E8E8E8
Charlton Athletic|#C8102E|#E8E8E8
Blackpool FC|#F58220|#E8E8E8
Reading FC|#0B4FA0|#E8E8E8
Wigan Athletic|#0B4FA0|#E8E8E8
Peterborough United|#0B4FA0|#E8E8E8
Lincoln City|#C8102E|#E8E8E8
Stockport County|#0B4FA0|#E8E8E8
Rotherham United|#C8102E|#E8E8E8
Mansfield Town|#F5D000|#0B4FA0
Wycombe Wanderers|#0B2A5B|#5FC8E8
Stevenage FC|#C8102E|#E8E8E8
Shrewsbury Town|#0B4FA0|#F5D000
Northampton Town|#8A1128|#E8E8E8
Burton Albion|#F5D000|#111111
Cambridge United|#F5D000|#111111
Exeter City|#C8102E|#E8E8E8
Leyton Orient|#C8102E|#E8E8E8
`;

const COL_DATA2 = `
Real Valladolid|#6B3FA0|#E8E8E8
Granada CF|#C8102E|#E8E8E8
Cádiz CF|#F5D000|#0B4FA0
Elche CF|#1E8A4C|#E8E8E8
UD Levante|#0B4FA0|#8A1128
Sporting Gijón|#C8102E|#E8E8E8
Racing Santander|#1E8A4C|#E8E8E8
Deportivo La Coruña|#0B4FA0|#E8E8E8
SD Eibar|#8A1128|#0B4FA0
Real Zaragoza|#E8E8E8|#0B4FA0
FC Málaga|#5FA8D3|#E8E8E8
CD Castellón|#111111|#F58220
Real Oviedo|#0B4FA0|#E8E8E8
Albacete Balompié|#E8E8E8|#111111
SD Huesca|#0B4FA0|#C8102E
CD Mirandés|#C8102E|#111111
Burgos CF|#111111|#E8E8E8
Racing Ferrol|#1E8A4C|#E8E8E8
CD Tenerife|#0B4FA0|#E8E8E8
FC Cartagena|#111111|#F5D000
UD Almería|#C8102E|#E8E8E8
Córdoba CF|#1E8A4C|#E8E8E8
CD Eldense|#0B4FA0|#E8E8E8
SD Amorebieta|#0B4FA0|#E8E8E8
Real Murcia|#C8102E|#E8E8E8
Cultural Leonesa|#8A1128|#E8E8E8
SD Ponferradina|#0B4FA0|#E8E8E8
Nàstic Tarragona|#C8102E|#E8E8E8
CE Sabadell|#111111|#E8E8E8
AD Alcorcón|#F5D000|#0B4FA0
CF Fuenlabrada|#0B4FA0|#E8E8E8
Algeciras CF|#C8102E|#E8E8E8
UD Ibiza|#C8102E|#111111
CD Atlético Baleares|#C8102E|#0B4FA0
Real Madrid Castilla|#E8E8E8|#C7A24B
Bilbao Athletic|#C8102E|#E8E8E8
Osasuna Promesas|#C8102E|#0B2A5B
Celta Fortuna|#5FA8D3|#E8E8E8
Barakaldo CF|#F5D000|#111111
Unionistas Salamanca|#111111|#E8E8E8
Antequera CF|#1E8A4C|#E8E8E8
Real Avilés|#E8E8E8|#0B4FA0
US Sassuolo|#1E8A4C|#111111
Venezia FC|#F58220|#1E8A4C
US Salernitana|#8A1128|#E8E8E8
Frosinone Calcio|#F5D000|#0B4FA0
FC Parma|#F5D000|#0B4FA0
Palermo FC|#F2A8C0|#111111
US Cremonese|#C8102E|#E8E8E8
Pisa SC|#0B2A5B|#E8E8E8
SSC Bari|#C8102E|#E8E8E8
Spezia Calcio|#111111|#E8E8E8
US Catanzaro|#F5D000|#C8102E
Brescia Calcio|#0B4FA0|#E8E8E8
Modena FC|#F5D000|#0B4FA0
AC Reggiana|#C8102E|#E8E8E8
Cosenza Calcio|#C8102E|#0B4FA0
Ternana Calcio|#1E8A4C|#C8102E
Ascoli Calcio|#111111|#E8E8E8
FC Südtirol|#E8E8E8|#C8102E
AS Cittadella|#8A1128|#E8E8E8
FeralpiSalò|#1E8A4C|#0B4FA0
SPAL Ferrara|#5FA8D3|#E8E8E8
Vicenza Calcio|#C8102E|#E8E8E8
Padova Calcio|#C8102E|#E8E8E8
AC Cesena|#E8E8E8|#111111
Avellino Calcio|#1E8A4C|#E8E8E8
Benevento Calcio|#F5D000|#C8102E
AC Perugia|#C8102E|#E8E8E8
Delfino Pescara|#5FA8D3|#E8E8E8
FC Crotone|#C8102E|#0B4FA0
Catania FC|#C8102E|#5FA8D3
Foggia Calcio|#C8102E|#111111
SS Juve Stabia|#F5D000|#0B4FA0
Torres Sassari|#C8102E|#0B4FA0
AS Gubbio|#C8102E|#0B4FA0
Rimini FC|#C8102E|#5FA8D3
US Triestina|#C8102E|#E8E8E8
Trapani Calcio|#C8102E|#E8E8E8
Pineto Calcio|#F5D000|#0B4FA0
Legnago Salus|#0B4FA0|#E8E8E8
Clermont Foot|#C8102E|#0B4FA0
FC Lorient|#F58220|#111111
FC Metz|#8A1128|#E8E8E8
Girondins Bordeaux|#0B2A5B|#C8102E
SM Caen|#C8102E|#0B4FA0
EA Guingamp|#C8102E|#111111
Grenoble Foot|#0B4FA0|#E8E8E8
Paris FC|#0B2A5B|#E8E8E8
AC Ajaccio|#C8102E|#E8E8E8
Rodez AF|#C8102E|#E8E8E8
Amiens SC|#0B4FA0|#E8E8E8
Pau FC|#F5D000|#0B4FA0
USL Dunkerque|#0B4FA0|#C8102E
Stade Laval|#F5D000|#111111
ESTAC Troyes|#5FA8D3|#E8E8E8
Valenciennes FC|#C8102E|#E8E8E8
Quevilly-Rouen|#C8102E|#F5D000
Annecy FC|#C8102E|#E8E8E8
SC Bastia|#0B4FA0|#E8E8E8
Montpellier HSC|#0B2A5B|#F58220
AS Saint-Étienne|#1E8A4C|#E8E8E8
SC Paderborn|#0B4FA0|#E8E8E8
SV Elversberg|#C8102E|#111111
1. FC Magdeburg|#0B4FA0|#E8E8E8
Greuther Fürth|#1E8A4C|#E8E8E8
Eintracht Braunschweig|#F5D000|#0B4FA0
Preußen Münster|#1E8A4C|#E8E8E8
SSV Ulm|#E8E8E8|#111111
Jahn Regensburg|#C8102E|#E8E8E8
SV Darmstadt 98|#0B4FA0|#E8E8E8
SpVgg Bayreuth|#F5D000|#111111
VfL Osnabrück|#6B1F3B|#E8E8E8
1. FC Saarbrücken|#0B4FA0|#111111
Erzgebirge Aue|#6B1F3B|#E8E8E8
SV Waldhof Mannheim|#0B4FA0|#E8E8E8
SV Sandhausen|#111111|#E8E8E8
SC Verl|#0B4FA0|#E8E8E8
FC Ingolstadt|#C8102E|#111111
SV Wehen Wiesbaden|#C8102E|#111111
VfB Lübeck|#1E8A4C|#E8E8E8
FC Viktoria Köln|#C8102E|#E8E8E8
TSV 1860 München|#5FA8D3|#E8E8E8
SpVgg Unterhaching|#C8102E|#0B4FA0
Stuttgarter Kickers|#0B4FA0|#F5D000
TSV Havelse|#1E8A4C|#E8E8E8
FC Volendam|#F58220|#111111
Vitesse Arnheim|#F5D000|#111111
SC Cambuur|#F5D000|#0B4FA0
Roda JC Kerkrade|#F5D000|#111111
De Graafschap|#0B4FA0|#E8E8E8
ADO Den Haag|#1E8A4C|#F5D000
FC Emmen|#C8102E|#E8E8E8
VVV-Venlo|#F5D000|#111111
MVV Maastricht|#C8102E|#111111
FC Eindhoven|#0B4FA0|#E8E8E8
FC Dordrecht|#C8102E|#E8E8E8
Telstar Velsen|#E8E8E8|#111111
TOP Oss|#C8102E|#111111
Helmond Sport|#C8102E|#111111
FC Den Bosch|#0B4FA0|#E8E8E8
Jong Ajax|#C8102E|#E8E8E8
Jong PSV|#C8102E|#E8E8E8
Jong AZ|#C8102E|#E8E8E8
NEC Nijmegen|#1E8A4C|#111111
SC Heerenveen|#0B4FA0|#E8E8E8
FC Groningen|#1E8A4C|#E8E8E8
Sparta Rotterdam|#C8102E|#E8E8E8
Willem II|#0B4FA0|#E8E8E8
Go Ahead Eagles|#C8102E|#F5D000
Fortuna Sittard|#F5D000|#1E8A4C
PEC Zwolle|#0B4FA0|#E8E8E8
RKC Waalwijk|#F5D000|#0B4FA0
Heracles Almelo|#111111|#E8E8E8
Almere City|#C8102E|#111111
NAC Breda|#F5D000|#111111
AZ Alkmaar|#C8102E|#E8E8E8
FC Twente|#C8102E|#E8E8E8
FC Utrecht|#C8102E|#E8E8E8
Vitória Guimarães|#E8E8E8|#111111
FC Famalicão|#E8E8E8|#0B4FA0
Boavista Porto|#111111|#E8E8E8
Rio Ave FC|#1E8A4C|#E8E8E8
GD Estoril|#F5D000|#0B4FA0
Moreirense FC|#1E8A4C|#E8E8E8
FC Arouca|#F5D000|#C8102E
Gil Vicente|#C8102E|#E8E8E8
Casa Pia AC|#111111|#E8E8E8
CD Nacional|#111111|#E8E8E8
CD Santa Clara|#C8102E|#E8E8E8
SC Farense|#111111|#E8E8E8
Estrela Amadora|#C8102E|#111111
AVS Futebol|#F5D000|#111111
FC Penafiel|#C8102E|#E8E8E8
UD Oliveirense|#0B4FA0|#E8E8E8
SC Covilhã|#0B4FA0|#E8E8E8
Leixões SC|#C8102E|#E8E8E8
FC Paços de Ferreira|#F5D000|#1E8A4C
Vitória Guimarães B|#E8E8E8|#111111
CD Feirense|#C8102E|#E8E8E8
GD Chaves|#C8102E|#0B4FA0
Portimonense SC|#111111|#E8E8E8
CD Tondela|#F5D000|#1E8A4C
SC Marítimo|#1E8A4C|#C8102E
Académico Viseu|#C8102E|#E8E8E8
FC Alverca|#C8102E|#E8E8E8
CD Mafra|#1E8A4C|#E8E8E8
União Torreense|#1E8A4C|#E8E8E8
SC Beira-Mar|#0B4FA0|#E8E8E8
Union Saint-Gilloise|#F5D000|#0B4FA0
KAA Gent|#0B4FA0|#E8E8E8
Cercle Brügge|#1E8A4C|#111111
Standard Lüttich|#C8102E|#E8E8E8
Royal Antwerpen|#C8102E|#E8E8E8
KRC Genk|#0B4FA0|#E8E8E8
KV Mechelen|#C8102E|#F5D000
KVC Westerlo|#F5D000|#0B4FA0
OH Leuven|#E8E8E8|#0B4FA0
Sint-Truiden|#F5D000|#0B4FA0
Sporting Charleroi|#111111|#E8E8E8
KV Kortrijk|#C8102E|#E8E8E8
FCV Dender EH|#C8102E|#E8E8E8
Beerschot VA|#6B3FA0|#E8E8E8
Lommel SK|#1E8A4C|#E8E8E8
RWD Molenbeek|#111111|#C8102E
SV Zulte Waregem|#C8102E|#111111
KV Oostende|#C8102E|#F5D000
Patro Eisden|#F5D000|#111111
Lierse Kempenzonen|#F5D000|#111111
RFC Seraing|#C8102E|#111111
SK Beveren|#F5D000|#0B4FA0
RAAL La Louvière|#C8102E|#E8E8E8
Francs Borains|#1E8A4C|#E8E8E8
Club NXT|#0B4FA0|#111111
Jong Genk|#0B4FA0|#E8E8E8
RSCA Futures|#6B1F3B|#E8E8E8
KMSK Deinze|#C8102E|#E8E8E8
`;

const COL_DATA3 = `
Club América|#F5D000|#0B2A5B
CD Guadalajara|#C8102E|#E8E8E8
Cruz Azul|#0B4FA0|#E8E8E8
Tigres UANL|#F5A000|#0B2A5B
CF Monterrey|#0B2A5B|#E8E8E8
Pumas UNAM|#0B2A5B|#F5D000
Deportivo Toluca|#C8102E|#E8E8E8
Santos Laguna|#1E8A4C|#E8E8E8
Club León|#1E8A4C|#E8E8E8
CF Pachuca|#0B2A5B|#E8E8E8
Atlas FC|#C8102E|#111111
Club Necaxa|#C8102E|#E8E8E8
Club Puebla|#0B2A5B|#E8E8E8
Club Tijuana|#C8102E|#111111
Querétaro FC|#0B2A5B|#111111
Mazatlán FC|#6B3FA0|#E8E8E8
FC Juárez|#1E8A4C|#111111
Atlético San Luis|#C8102E|#E8E8E8
Seattle Sounders|#1E8A4C|#5FA8D3
Atlanta United|#8A1128|#111111
New York City FC|#5FA8D3|#0B2A5B
Columbus Crew|#F5D000|#111111
FC Cincinnati|#F58220|#0B2A5B
Philadelphia Union|#0B2A5B|#F5D000
Portland Timbers|#1B5E20|#F5D000
Real Salt Lake|#8A1128|#F5D000
Austin FC|#1E8A4C|#111111
Nashville SC|#F5D000|#0B2A5B
Orlando City|#6B3FA0|#E8E8E8
New York Red Bulls|#C8102E|#F5D000
Charlotte FC|#5FC8E8|#111111
Toronto FC|#C8102E|#E8E8E8
Racing Club|#5FC8E8|#E8E8E8
CA Independiente|#C8102E|#E8E8E8
Vélez Sarsfield|#E8E8E8|#0B4FA0
Estudiantes La Plata|#C8102E|#E8E8E8
Argentinos Juniors|#C8102E|#E8E8E8
San Lorenzo|#0B2A5B|#8A1128
Talleres Córdoba|#0B2A5B|#E8E8E8
Rosario Central|#F5D000|#0B4FA0
Club Atlético Lanús|#8A1128|#E8E8E8
Defensa y Justicia|#F5D000|#1E8A4C
Newell's Old Boys|#C8102E|#111111
Club Atlético Huracán|#E8E8E8|#C8102E
Godoy Cruz|#0B2A5B|#E8E8E8
Belgrano Córdoba|#5FC8E8|#E8E8E8
Colón Santa Fe|#C8102E|#111111
Gimnasia Mendoza|#0B4FA0|#E8E8E8
San Martín Tucumán|#C8102E|#E8E8E8
Almirante Brown|#111111|#F5D000
Chacarita Juniors|#C8102E|#111111
Ferro Carril Oeste|#1E8A4C|#E8E8E8
All Boys|#111111|#E8E8E8
Nueva Chicago|#1E8A4C|#111111
Atlanta Buenos Aires|#F5D000|#0B4FA0
Deportivo Morón|#C8102E|#E8E8E8
Quilmes AC|#E8E8E8|#0B4FA0
CA Temperley|#5FC8E8|#E8E8E8
Estudiantes Río Cuarto|#111111|#1E8A4C
Defensores de Belgrano|#C8102E|#111111
CA Alvarado|#F5D000|#1E8A4C
Gimnasia Jujuy|#E8E8E8|#0B4FA0
Talleres Remedios|#C8102E|#E8E8E8
San Miguel|#F5D000|#111111
Botafogo FR|#111111|#E8E8E8
Fluminense FC|#8A1128|#1E8A4C
São Paulo FC|#C8102E|#111111
SC Corinthians|#111111|#E8E8E8
Cruzeiro EC|#0B2A5B|#E8E8E8
Grêmio Porto Alegre|#5FA8D3|#111111
Atlético Mineiro|#111111|#E8E8E8
SC Internacional|#C8102E|#E8E8E8
Fortaleza EC|#0B2A5B|#C8102E
EC Bahia|#0B4FA0|#C8102E
Vasco da Gama|#111111|#E8E8E8
Santos FC|#E8E8E8|#111111
EC Vitória|#C8102E|#111111
RB Bragantino|#E8E8E8|#C8102E
Cuiabá EC|#F5D000|#1E8A4C
Criciúma EC|#F5D000|#111111
EC Juventude|#1E8A4C|#E8E8E8
Atlético Goianiense|#C8102E|#111111
Sport Recife|#C8102E|#111111
Ceará SC|#111111|#E8E8E8
Grêmio Novorizontino|#F5D000|#111111
Mirassol FC|#F5D000|#1E8A4C
Avaí FC|#0B4FA0|#E8E8E8
Coritiba FC|#1E8A4C|#E8E8E8
Goiás EC|#1E8A4C|#E8E8E8
Paysandu SC|#0B4FA0|#E8E8E8
Amazonas FC|#111111|#1E8A4C
América Mineiro|#1E8A4C|#E8E8E8
Chapecoense|#1E8A4C|#E8E8E8
Ponte Preta|#111111|#E8E8E8
Guarani FC|#1E8A4C|#E8E8E8
Botafogo-SP|#C8102E|#111111
Operário Ferroviário|#111111|#C8102E
CRB Maceió|#C8102E|#111111
Ituano FC|#C8102E|#111111
Brusque FC|#0B4FA0|#E8E8E8
Vila Nova FC|#C8102E|#111111
Sampaio Corrêa|#C8102E|#F5D000
Istanbul Basaksehir|#0B2A5B|#F58220
Samsunspor|#C8102E|#E8E8E8
Konyaspor|#1E8A4C|#E8E8E8
Antalyaspor|#C8102E|#E8E8E8
Kasimpasa|#0B2A5B|#E8E8E8
Alanyaspor|#F58220|#1E8A4C
Caykur Rizespor|#1E8A4C|#5FA8D3
Sivasspor|#C8102E|#E8E8E8
Kayserispor|#C8102E|#F5D000
Gaziantep FK|#C8102E|#111111
Hatayspor|#8A1128|#E8E8E8
Adana Demirspor|#0B4FA0|#E8E8E8
Göztepe|#C8102E|#F5D000
Eyüpspor|#6B1F3B|#F5D000
Bandirmaspor|#C8102E|#0B4FA0
Boluspor|#C8102E|#E8E8E8
Erzurumspor FK|#0B4FA0|#E8E8E8
Genclerbirligi|#C8102E|#111111
Sakaryaspor|#1E8A4C|#111111
Kocaelispor|#1E8A4C|#111111
Manisa FK|#C8102E|#111111
Ümraniyespor|#C8102E|#E8E8E8
Pendikspor|#C8102E|#E8E8E8
Corum FK|#C8102E|#E8E8E8
Sanliurfaspor|#F58220|#1E8A4C
Keciörengücü|#C8102E|#E8E8E8
Adanaspor|#F58220|#E8E8E8
Bodrum FK|#1E8A4C|#E8E8E8
Igdir FK|#0B4FA0|#E8E8E8
Amed SK|#1E8A4C|#C8102E
Fatih Karagümrük|#C8102E|#111111
Istanbulspor|#F5D000|#111111
Al-Ittihad|#111111|#F5D000
Al-Ahli Jeddah|#1E8A4C|#E8E8E8
Al-Shabab|#111111|#E8E8E8
Al-Ettifaq|#1E8A4C|#E8E8E8
Al-Taawoun|#F5D000|#0B4FA0
Al-Fateh|#0B4FA0|#E8E8E8
Al-Khaleej|#1E8A4C|#E8E8E8
Al-Fayha|#0B4FA0|#E8E8E8
Al-Riyadh|#0B4FA0|#F5D000
Al-Wehda|#8A1128|#E8E8E8
Damac FC|#1E8A4C|#E8E8E8
Al-Raed|#F5D000|#111111
Al-Qadsiah|#F5D000|#0B4FA0
Al-Orobah|#0B4FA0|#E8E8E8
Al-Kholood|#C8102E|#E8E8E8
Al-Okhdood|#F58220|#111111
Heart of Midlothian|#8A1128|#E8E8E8
Hibernian FC|#1E8A4C|#E8E8E8
Aberdeen FC|#C8102E|#E8E8E8
FC Dundee United|#F58220|#111111
St. Mirren|#111111|#E8E8E8
Motherwell FC|#F5D000|#8A1128
Kilmarnock FC|#0B4FA0|#E8E8E8
Ross County|#0B4FA0|#C8102E
Dundee FC|#0B2A5B|#E8E8E8
St. Johnstone|#0B4FA0|#E8E8E8
Dunfermline Athletic|#111111|#E8E8E8
Raith Rovers|#0B2A5B|#E8E8E8
Partick Thistle|#C8102E|#F5D000
Ayr United|#111111|#E8E8E8
Greenock Morton|#0B4FA0|#E8E8E8
Falkirk FC|#0B2A5B|#E8E8E8
Livingston FC|#F5D000|#111111
Airdrieonians|#E8E8E8|#C8102E
Queen's Park|#111111|#E8E8E8
Hamilton Academical|#C8102E|#E8E8E8
Asteras Tripolis|#F5D000|#0B4FA0
Volos NFC|#0B4FA0|#E8E8E8
Levadiakos FC|#1E8A4C|#E8E8E8
Panserraikos|#C8102E|#E8E8E8
Atromitos Athen|#0B4FA0|#E8E8E8
Lamia FC|#C8102E|#E8E8E8
PAS Giannina|#0B4FA0|#E8E8E8
Kifisia FC|#1E8A4C|#E8E8E8
Al Ain FC|#6B3FA0|#E8E8E8
Shabab Al Ahli|#C8102E|#E8E8E8
Al Wasl|#F5D000|#111111
Al Jazira|#F5D000|#111111
Sharjah FC|#C8102E|#E8E8E8
Al Nasr Dubai|#0B4FA0|#E8E8E8
Al Wahda Abu Dhabi|#8A1128|#E8E8E8
Bani Yas|#F58220|#111111
Khor Fakkan|#0B4FA0|#F5D000
Ajman Club|#C8102E|#E8E8E8
Al Bataeh|#1E8A4C|#E8E8E8
Al Ittihad Kalba|#0B4FA0|#E8E8E8
Dibba Al Fujairah|#F5D000|#111111
Emirates Club|#0B4FA0|#E8E8E8
Al Sadd SC|#E8E8E8|#111111
Al Duhail SC|#8A1128|#E8E8E8
Al Rayyan SC|#C8102E|#111111
Al Gharafa SC|#111111|#F5D000
Al Arabi SC|#F5D000|#111111
Umm Salal SC|#F58220|#111111
Al Wakrah SC|#0B4FA0|#E8E8E8
Qatar SC|#8A1128|#E8E8E8
Al Ahli Doha|#C8102E|#E8E8E8
Al Shamal SC|#0B4FA0|#F5D000
Muaither SC|#1E8A4C|#E8E8E8
Al Markhiya SC|#F58220|#0B4FA0
Ipswich Town|#0B4FA0|#E8E8E8
AC Monza|#C8102E|#E8E8E8
Le Mans FC|#C8102E|#F5D000
Melbourne City|#5FA8D3|#0B2A5B
Melbourne Victory|#0B2A5B|#E8E8E8
Sydney FC|#5FC8E8|#0B2A5B
Western Sydney Wanderers|#C8102E|#111111
Central Coast Mariners|#F5D000|#0B2A5B
Adelaide United|#C8102E|#111111
Brisbane Roar|#F58220|#111111
Perth Glory|#6B3FA0|#E8E8E8
Wellington Phoenix|#F5D000|#111111
Macarthur FC|#111111|#5FC8E8
Newcastle Jets|#0B2A5B|#F5D000
Western United|#1E8A4C|#111111
`;

const COL_DATA4 = `
1. FC Heidenheim|#C8102E|#0B2A5B
VfL Bochum|#0B4FA0|#E8E8E8
Holstein Kiel|#0B4FA0|#E8E8E8
Alemannia Aachen|#F5D000|#111111
AFC Bournemouth|#C8102E|#111111
Crystal Palace|#C8102E|#0B4FA0
FC Brentford|#C8102E|#E8E8E8
FC Fulham|#E8E8E8|#111111
Wolverhampton|#F5A000|#111111
Sheffield United|#C8102E|#111111
West Bromwich Albion|#0B2A5B|#E8E8E8
Norwich City|#F5D000|#1E8A4C
FC Middlesbrough|#C8102E|#E8E8E8
Coventry City|#5FC8E8|#111111
FC Watford|#F5D000|#111111
Blackburn Rovers|#0B4FA0|#E8E8E8
Stoke City|#C8102E|#E8E8E8
Hull City|#F58220|#111111
Portsmouth FC|#0B4FA0|#E8E8E8
Cardiff City|#0B4FA0|#E8E8E8
Millwall FC|#0B2A5B|#E8E8E8
Preston North End|#E8E8E8|#0B2A5B
FC Girona|#C8102E|#E8E8E8
CA Osasuna|#C8102E|#0B2A5B
RCD Mallorca|#C8102E|#111111
FC Getafe|#0B4FA0|#E8E8E8
Deportivo Alavés|#0B4FA0|#E8E8E8
Udinese Calcio|#111111|#E8E8E8
Como 1907|#0B2A5B|#E8E8E8
Cagliari Calcio|#8A1128|#0B2A5B
Hellas Verona|#F5D000|#0B2A5B
FC Empoli|#0B4FA0|#E8E8E8
RC Straßburg|#0B4FA0|#E8E8E8
FC Toulouse|#6B3FA0|#E8E8E8
Stade Brest|#C8102E|#E8E8E8
FC Nantes|#F5D000|#1E8A4C
Stade Reims|#C8102E|#E8E8E8
AJ Auxerre|#E8E8E8|#0B4FA0
Le Havre AC|#5FA8D3|#0B2A5B
Angers SCO|#111111|#E8E8E8
Rapid Wien|#1E8A4C|#E8E8E8
Austria Wien|#6B3FA0|#E8E8E8
LASK Linz|#111111|#E8E8E8
WAC Wolfsberg|#E8E8E8|#111111
Austria Klagenfurt|#6B3FA0|#E8E8E8
TSV Hartberg|#0B4FA0|#E8E8E8
SCR Altach|#C8102E|#E8E8E8
Blau-Weiß Linz|#0B4FA0|#E8E8E8
SV Ried|#1E8A4C|#E8E8E8
Grazer AK|#C8102E|#111111
FC Liefering|#C8102E|#E8E8E8
SKN St. Pölten|#F5D000|#0B4FA0
Kapfenberger SV|#0B4FA0|#E8E8E8
SV Horn|#1E8A4C|#E8E8E8
First Vienna FC|#0B4FA0|#F5D000
FC Admira Wacker|#111111|#E8E8E8
SW Bregenz|#E8E8E8|#111111
FC Dornbirn|#C8102E|#E8E8E8
SKU Amstetten|#0B4FA0|#E8E8E8
SV Stripfing|#1E8A4C|#E8E8E8
Sturm Graz II|#111111|#E8E8E8
Rapid Wien II|#1E8A4C|#E8E8E8
FC Hertha Wels|#0B4FA0|#E8E8E8
ASK Voitsberg|#C8102E|#111111
FC Zürich|#0B4FA0|#E8E8E8
FC Luzern|#0B4FA0|#E8E8E8
FC St. Gallen|#1E8A4C|#E8E8E8
Servette Genf|#8A1128|#E8E8E8
FC Lugano|#111111|#E8E8E8
FC Sion|#C8102E|#E8E8E8
Grasshopper Zürich|#0B4FA0|#E8E8E8
Yverdon Sport|#1E8A4C|#E8E8E8
FC Winterthur|#C8102E|#E8E8E8
FC Lausanne-Sport|#0B4FA0|#E8E8E8
FC Aarau|#111111|#E8E8E8
FC Thun|#C8102E|#E8E8E8
FC Wil|#C8102E|#E8E8E8
Neuchâtel Xamax|#C8102E|#111111
FC Vaduz|#C8102E|#0B4FA0
SC Kriens|#0B4FA0|#E8E8E8
FC Schaffhausen|#111111|#E8E8E8
Stade Nyonnais|#C8102E|#E8E8E8
AC Bellinzona|#C8102E|#0B4FA0
Étoile Carouge|#5FC8E8|#111111
FC Midtjylland|#111111|#C8102E
Bröndby IF|#F5D000|#0B4FA0
AGF Aarhus|#E8E8E8|#0B4FA0
FC Nordsjaelland|#C8102E|#F5D000
Silkeborg IF|#0B4FA0|#E8E8E8
Randers FC|#C8102E|#111111
Viborg FF|#1E8A4C|#E8E8E8
Odense BK|#0B4FA0|#E8E8E8
Lyngby BK|#5FC8E8|#E8E8E8
Vejle BK|#C8102E|#E8E8E8
Sönderjyske|#0B4FA0|#F5D000
Hvidovre IF|#C8102E|#E8E8E8
Kolding IF|#C8102E|#111111
FC Fredericia|#C8102E|#E8E8E8
HB Köge|#F5D000|#0B4FA0
B93 Kopenhagen|#0B4FA0|#E8E8E8
Hillerød Fodbold|#0B4FA0|#E8E8E8
Hobro IK|#F5D000|#111111
Esbjerg fB|#0B4FA0|#E8E8E8
Vendsyssel FF|#F5D000|#0B4FA0
AC Horsens|#F5D000|#0B4FA0
Naestved BK|#C8102E|#E8E8E8
FC Roskilde|#F5D000|#111111
Rosenborg Trondheim|#E8E8E8|#111111
Molde FK|#5FA8D3|#E8E8E8
Brann Bergen|#C8102E|#E8E8E8
Viking Stavanger|#0B2A5B|#E8E8E8
Lillestrøm SK|#F5D000|#111111
Vålerenga Oslo|#0B2A5B|#C8102E
Sarpsborg 08|#0B4FA0|#E8E8E8
Tromsø IL|#C8102E|#E8E8E8
Odds BK|#E8E8E8|#111111
HamKam|#C8102E|#111111
Fredrikstad FK|#C8102E|#E8E8E8
KFUM Oslo|#0B4FA0|#F5D000
Kristiansund BK|#0B4FA0|#E8E8E8
Sandefjord Fotball|#0B4FA0|#E8E8E8
FK Haugesund|#0B4FA0|#E8E8E8
Start Kristiansand|#F5D000|#111111
Aalesunds FK|#F58220|#0B4FA0
Raufoss IL|#C8102E|#E8E8E8
Skeid Oslo|#C8102E|#E8E8E8
Ranheim IL|#0B4FA0|#E8E8E8
Sogndal IL|#0B4FA0|#E8E8E8
Stabaek Fotball|#0B4FA0|#E8E8E8
Mjöndalen IF|#5FA8D3|#111111
Egersunds IK|#0B4FA0|#E8E8E8
Kongsvinger IL|#C8102E|#E8E8E8
Levanger FK|#0B4FA0|#E8E8E8
Lyn Oslo|#C8102E|#E8E8E8
Moss FK|#0B4FA0|#F5D000
Bryne FK|#C8102E|#E8E8E8
Malmö FF|#5FC8E8|#E8E8E8
AIK Solna|#111111|#F5D000
Hammarby IF|#1E8A4C|#E8E8E8
IF Elfsborg|#F5D000|#111111
Djurgardens IF|#0B2A5B|#5FA8D3
IFK Göteborg|#0B4FA0|#E8E8E8
BK Häcken|#F5D000|#111111
IFK Norrköping|#0B4FA0|#E8E8E8
Kalmar FF|#C8102E|#E8E8E8
Mjällby AIF|#F5D000|#111111
IK Sirius|#0B4FA0|#E8E8E8
Halmstads BK|#0B4FA0|#E8E8E8
GAIS Göteborg|#1E8A4C|#111111
Västerås SK|#111111|#E8E8E8
IF Brommapojkarna|#C8102E|#111111
Degerfors IF|#C8102E|#E8E8E8
Viktoria Pilsen|#C8102E|#0B4FA0
Banik Ostrava|#0B4FA0|#E8E8E8
Sigma Olomouc|#0B4FA0|#E8E8E8
Slovan Liberec|#0B4FA0|#E8E8E8
Mladá Boleslav|#0B4FA0|#E8E8E8
Bohemians Prag|#1E8A4C|#E8E8E8
FK Jablonec|#1E8A4C|#F5D000
FK Teplice|#F5D000|#0B4FA0
FK Pardubice|#C8102E|#E8E8E8
FC Zlín|#F5D000|#0B4FA0
MFK Karviná|#1E8A4C|#E8E8E8
1. FC Slovácko|#0B4FA0|#E8E8E8
Hradec Králové|#0B4FA0|#E8E8E8
Dukla Prag|#F5D000|#8A1128
Vysocina Jihlava|#0B4FA0|#E8E8E8
FK Prostejov|#0B4FA0|#E8E8E8
MFK Chrudim|#C8102E|#E8E8E8
FC Táborsko|#0B4FA0|#E8E8E8
Zbrojovka Brünn|#C8102E|#0B4FA0
Viktoria Zizkov|#C8102E|#E8E8E8
Sparta Prag B|#8A1128|#F5D000
SFC Opava|#0B4FA0|#E8E8E8
FC Vlasim|#C8102E|#E8E8E8
FK Trinec|#1E8A4C|#E8E8E8
SK Kromeriz|#0B4FA0|#E8E8E8
Usti nad Labem|#0B4FA0|#E8E8E8
FK Varnsdorf|#0B4FA0|#F5D000
Banik Sokolov|#111111|#F5D000
Lech Posen|#0B4FA0|#E8E8E8
Rakow Czestochowa|#8A1128|#0B4FA0
Jagiellonia Bialystok|#F5D000|#C8102E
Pogon Stettin|#0B4FA0|#8A1128
Slask Breslau|#1E8A4C|#E8E8E8
Wisla Plock|#0B4FA0|#E8E8E8
Widzew Lodz|#C8102E|#E8E8E8
Cracovia Krakau|#C8102E|#E8E8E8
Gornik Zabrze|#0B4FA0|#E8E8E8
Radomiak Radom|#1E8A4C|#111111
Motor Lublin|#0B4FA0|#E8E8E8
Piast Gliwice|#C8102E|#0B4FA0
Korona Kielce|#F5D000|#C8102E
Stal Mielec|#0B4FA0|#E8E8E8
GKS Katowice|#F5D000|#0B4FA0
Zaglebie Lubin|#F58220|#111111
Puszcza Niepolomice|#1E8A4C|#E8E8E8
Arka Gdynia|#F5D000|#0B4FA0
Wisla Krakau|#C8102E|#E8E8E8
Ruch Chorzow|#0B4FA0|#E8E8E8
Lechia Danzig|#1E8A4C|#E8E8E8
Odra Opole|#0B4FA0|#C8102E
Miedz Legnica|#1E8A4C|#E8E8E8
GKS Tychy|#0B4FA0|#E8E8E8
Chrobry Glogow|#C8102E|#E8E8E8
Polonia Warschau|#111111|#C8102E
Znicz Pruszkow|#C8102E|#111111
Stal Rzeszow|#0B4FA0|#E8E8E8
Warta Posen|#1E8A4C|#E8E8E8
Termalica Nieciecza|#C8102E|#E8E8E8
Górnik Leczna|#1E8A4C|#111111
Kotwica Kolobrzeg|#0B4FA0|#E8E8E8
Pogon Siedlce|#C8102E|#E8E8E8
Hajduk Split|#E8E8E8|#0B4FA0
HNK Rijeka|#E8E8E8|#0B4FA0
NK Osijek|#0B4FA0|#E8E8E8
Slaven Belupo|#0B4FA0|#F5D000
Lokomotiva Zagreb|#0B4FA0|#E8E8E8
NK Varazdin|#F5D000|#0B4FA0
Istra 1961|#1E8A4C|#F5D000
HNK Gorica|#0B4FA0|#E8E8E8
HNK Sibenik|#0B4FA0|#E8E8E8
Partizan Belgrad|#111111|#E8E8E8
FK Vojvodina|#C8102E|#E8E8E8
TSC Backa Topola|#0B4FA0|#E8E8E8
FK Cukaricki|#C8102E|#E8E8E8
Radnicki Nis|#C8102E|#E8E8E8
FK Napredak|#C8102E|#E8E8E8
Spartak Subotica|#0B4FA0|#E8E8E8
FK Javor|#1E8A4C|#E8E8E8
Mladost Lucani|#1E8A4C|#E8E8E8
FK Vozdovac|#C8102E|#E8E8E8
IMT Belgrad|#0B4FA0|#E8E8E8
FK Radnik|#0B4FA0|#E8E8E8
Zeleznicar Pancevo|#0B4FA0|#E8E8E8
Novi Pazar|#0B4FA0|#E8E8E8
FK Tekstilac|#1E8A4C|#E8E8E8
Ludogorez Rasgrad|#1E8A4C|#E8E8E8
Levski Sofia|#0B4FA0|#E8E8E8
ZSKA Sofia|#C8102E|#E8E8E8
Lokomotive Plowdiw|#111111|#E8E8E8
Botew Plowdiw|#F5D000|#111111
Slawia Sofia|#E8E8E8|#111111
Beroe Stara Sagora|#1E8A4C|#E8E8E8
Arda Kardschali|#0B4FA0|#E8E8E8
Cherno More Warna|#0B4FA0|#E8E8E8
Septemvri Sofia|#C8102E|#E8E8E8
Krumovgrad|#C8102E|#E8E8E8
Botev Vratsa|#1E8A4C|#E8E8E8
Spartak Warna|#0B4FA0|#E8E8E8
Hebar Pasardschik|#1E8A4C|#E8E8E8
Dobrudscha Dobritsch|#0B4FA0|#E8E8E8
ZSKA 1948 Sofia|#C8102E|#0B2A5B
Ferencváros Budapest|#1E8A4C|#E8E8E8
Puskás Akadémia|#0B4FA0|#E8E8E8
Debreceni VSC|#C8102E|#E8E8E8
Fehérvár FC|#C8102E|#0B4FA0
Paksi FC|#1E8A4C|#E8E8E8
Újpest FC|#6B3FA0|#E8E8E8
MTK Budapest|#0B4FA0|#E8E8E8
Kecskeméti TE|#6B3FA0|#E8E8E8
Diósgyőri VTK|#C8102E|#E8E8E8
Nyíregyháza Spartacus|#0B4FA0|#F5D000
ZTE Zalaegerszeg|#0B4FA0|#E8E8E8
Kisvárda FC|#C8102E|#E8E8E8
Dynamo Kiew|#0B4FA0|#E8E8E8
Sorja Luhansk|#C8102E|#111111
Kryvbas Krywyj Rih|#C8102E|#E8E8E8
Oleksandrija|#F5D000|#0B4FA0
Weres Riwne|#1E8A4C|#E8E8E8
Polissja Schytomyr|#1E8A4C|#F5D000
Kolos Kowaliwka|#F5D000|#1E8A4C
LNZ Tscherkassy|#0B4FA0|#E8E8E8
Karpaty Lwiw|#1E8A4C|#E8E8E8
Rukh Lwiw|#C8102E|#111111
Obolon Kiew|#0B4FA0|#E8E8E8
Inhulez Petrowe|#1E8A4C|#E8E8E8
Livyi Bereh Kiew|#0B2A5B|#E8E8E8
Metalist 1925|#F5D000|#0B4FA0
Tschornomorez Odessa|#0B4FA0|#E8E8E8
Zenit St. Petersburg|#5FC8E8|#E8E8E8
Spartak Moskau|#C8102E|#E8E8E8
ZSKA Moskau|#C8102E|#0B2A5B
Lokomotive Moskau|#C8102E|#1E8A4C
Dynamo Moskau|#0B4FA0|#E8E8E8
FK Krasnodar|#111111|#1E8A4C
Rubin Kasan|#C8102E|#1E8A4C
FK Rostow|#F5D000|#0B4FA0
Achmat Grosny|#1E8A4C|#E8E8E8
Krylja Sowetow|#0B4FA0|#E8E8E8
Fakel Woronesch|#C8102E|#E8E8E8
FK Orenburg|#0B4FA0|#E8E8E8
Baltika Kaliningrad|#0B4FA0|#E8E8E8
Paris Nischni Nowgorod|#0B4FA0|#E8E8E8
Ural Jekaterinburg|#F58220|#111111
FK Chimki|#C8102E|#E8E8E8
Kawasaki Frontale|#5FA8D3|#111111
Urawa Red Diamonds|#C8102E|#111111
Vissel Kobe|#8A1128|#E8E8E8
Sanfrecce Hiroshima|#6B3FA0|#E8E8E8
Gamba Osaka|#0B2A5B|#111111
Cerezo Osaka|#F2A8C0|#111111
FC Tokyo|#0B4FA0|#C8102E
Yokohama F. Marinos|#0B2A5B|#C8102E
Nagoya Grampus|#C8102E|#F5D000
Kashima Antlers|#8A1128|#111111
Avispa Fukuoka|#0B2A5B|#F5D000
Kyoto Sanga|#6B3FA0|#E8E8E8
Shonan Bellmare|#1E8A4C|#5FA8D3
Albirex Niigata|#F58220|#5FA8D3
Consadole Sapporo|#C8102E|#111111
Júbilo Iwata|#5FC8E8|#E8E8E8
Tokyo Verdy|#1E8A4C|#E8E8E8
Machida Zelvia|#0B4FA0|#E8E8E8
Shimizu S-Pulse|#F58220|#111111
V-Varen Nagasaki|#0B4FA0|#F58220
Yokohama FC|#5FC8E8|#111111
Ventforet Kofu|#0B4FA0|#C8102E
Roasso Kumamoto|#C8102E|#111111
Montedio Yamagata|#5FA8D3|#F5D000
JEF United Chiba|#F5D000|#1E8A4C
Fujieda MYFC|#6B3FA0|#E8E8E8
Tokushima Vortis|#5FA8D3|#E8E8E8
Blaublitz Akita|#0B4FA0|#E8E8E8
Iwaki FC|#C8102E|#111111
Renofa Yamaguchi|#F58220|#E8E8E8
Mito HollyHock|#1E8A4C|#5FA8D3
Omiya Ardija|#F58220|#0B2A5B
Sagan Tosu|#5FA8D3|#F2A8C0
Kataller Toyama|#5FA8D3|#111111
FC Imabari|#5FA8D3|#E8E8E8
Ehime FC|#F58220|#5FA8D3
Ulsan HD|#0B4FA0|#F5D000
Jeonbuk Motors|#1E8A4C|#E8E8E8
FC Seoul|#C8102E|#111111
Pohang Steelers|#C8102E|#111111
Gimcheon Sangmu|#C8102E|#0B4FA0
Gangwon FC|#F58220|#0B2A5B
Suwon FC|#C8102E|#111111
Daejeon Hana|#6B3FA0|#E8E8E8
Gwangju FC|#F5D000|#111111
Jeju United|#F58220|#C8102E
Daegu FC|#5FC8E8|#111111
Incheon United|#0B4FA0|#111111
Atlético Nacional|#1E8A4C|#E8E8E8
Millonarios FC|#0B2A5B|#E8E8E8
América de Cali|#C8102E|#E8E8E8
Deportivo Cali|#1E8A4C|#E8E8E8
Junior Barranquilla|#C8102E|#E8E8E8
Independiente Medellín|#C8102E|#0B4FA0
Independiente Santa Fe|#C8102E|#E8E8E8
Once Caldas|#E8E8E8|#111111
Deportivo Pereira|#F5D000|#C8102E
Atlético Bucaramanga|#F5D000|#1E8A4C
Alianza FC Valledupar|#C8102E|#E8E8E8
Deportes Tolima|#C8102E|#F5D000
La Equidad|#1E8A4C|#E8E8E8
Envigado FC|#F58220|#E8E8E8
Águilas Doradas|#1E8A4C|#F5D000
Fortaleza CEIF|#F5D000|#0B4FA0
Boyacá Chicó|#F5D000|#1E8A4C
Jaguares de Córdoba|#0B4FA0|#E8E8E8
Independiente del Valle|#0B2A5B|#E8E8E8
LDU Quito|#E8E8E8|#0B4FA0
Barcelona SC Guayaquil|#F5D000|#C8102E
CS Emelec|#0B4FA0|#E8E8E8
Universidad Católica Quito|#0B4FA0|#E8E8E8
Delfín SC|#5FC8E8|#E8E8E8
SD Aucas|#F5D000|#C8102E
Orense SC|#1E8A4C|#E8E8E8
Técnico Universitario|#C8102E|#E8E8E8
Deportivo Cuenca|#C8102E|#E8E8E8
CSD Macará|#5FC8E8|#E8E8E8
El Nacional Quito|#C8102E|#0B4FA0
Mushuc Runa|#1E8A4C|#E8E8E8
Libertad FC Loja|#C8102E|#E8E8E8
Imbabura SC|#F5D000|#111111
Cumbayá FC|#0B4FA0|#E8E8E8
Colo-Colo|#E8E8E8|#111111
Universidad de Chile|#0B4FA0|#C8102E
Universidad Católica|#E8E8E8|#0B4FA0
CD Cobresal|#F58220|#111111
CD Huachipato|#5FC8E8|#111111
CD Palestino|#1E8A4C|#C8102E
Unión Española|#C8102E|#E8E8E8
Audax Italiano|#1E8A4C|#E8E8E8
CD O'Higgins|#5FC8E8|#E8E8E8
Coquimbo Unido|#F5D000|#111111
Everton Viña del Mar|#0B4FA0|#F5D000
Ñublense|#C8102E|#0B4FA0
Deportes Iquique|#C8102E|#F5D000
Unión La Calera|#C8102E|#E8E8E8
Cobreloa|#F58220|#111111
Deportes Limache|#1E8A4C|#E8E8E8
CA Peñarol|#F5D000|#111111
Defensor Sporting|#6B3FA0|#E8E8E8
Liverpool Montevideo|#111111|#5FC8E8
Danubio FC|#F5D000|#111111
Montevideo City Torque|#5FA8D3|#111111
Boston River|#C8102E|#E8E8E8
Racing Montevideo|#5FC8E8|#E8E8E8
Cerro Largo FC|#1E8A4C|#E8E8E8
CA Progreso|#C8102E|#111111
River Plate Montevideo|#C8102E|#E8E8E8
Plaza Colonia|#F5D000|#1E8A4C
Miramar Misiones|#0B2A5B|#F5D000
CA Juventud|#0B4FA0|#E8E8E8
Club Olimpia|#E8E8E8|#111111
Cerro Porteño|#C8102E|#0B4FA0
Club Libertad|#F5D000|#111111
Club Nacional Asunción|#C8102E|#E8E8E8
Sportivo Luqueño|#F5D000|#0B4FA0
Sportivo Ameliano|#0B4FA0|#F5D000
General Caballero JLM|#111111|#F5D000
Tacuary FBC|#0B4FA0|#E8E8E8
Club 2 de Mayo|#C8102E|#111111
Sportivo Trinidense|#0B4FA0|#E8E8E8
Recoleta FC|#1E8A4C|#E8E8E8
Wydad Casablanca|#C8102E|#E8E8E8
Raja Casablanca|#1E8A4C|#E8E8E8
AS FAR Rabat|#1E8A4C|#E8E8E8
RS Berkane|#F58220|#E8E8E8
MA Tétouan|#C8102E|#E8E8E8
Maghreb Fès|#8A1128|#E8E8E8
Olympique Safi|#0B4FA0|#E8E8E8
Hassania Agadir|#C8102E|#111111
Difaâ El Jadidi|#F5D000|#111111
Union Touarga|#0B4FA0|#E8E8E8
Chabab Mohammédia|#1E8A4C|#E8E8E8
COD Meknès|#C8102E|#E8E8E8
Ittihad Tanger|#C8102E|#E8E8E8
Renaissance Zemamra|#1E8A4C|#E8E8E8
Al Ahly Kairo|#C8102E|#E8E8E8
Zamalek SC|#E8E8E8|#C8102E
Pyramids FC|#0B2A5B|#5FC8E8
Ismaily SC|#1E8A4C|#E8E8E8
Al Masry|#1E8A4C|#E8E8E8
ENPPI Kairo|#C8102E|#E8E8E8
Ceramica Cleopatra|#0B4FA0|#E8E8E8
Smouha SC|#0B4FA0|#E8E8E8
National Bank FC|#1E8A4C|#F5D000
Ittihad Alexandria|#1E8A4C|#E8E8E8
Pharco FC|#0B4FA0|#E8E8E8
ZED FC|#C8102E|#111111
Mamelodi Sundowns|#F5D000|#111111
Orlando Pirates|#111111|#E8E8E8
Kaizer Chiefs|#F5D000|#111111
SuperSport United|#0B4FA0|#E8E8E8
Stellenbosch FC|#C8102E|#111111
Sekhukhune United|#1E8A4C|#F5D000
Golden Arrows|#F5D000|#1E8A4C
AmaZulu FC|#1E8A4C|#E8E8E8
Cape Town City|#F5D000|#0B4FA0
Polokwane City|#C8102E|#E8E8E8
Chippa United|#C8102E|#111111
Richards Bay|#0B4FA0|#F5D000
Marumo Gallants|#1E8A4C|#F5D000
Magesi FC|#0B4FA0|#E8E8E8
`;

/* Alle Tabellen zu einer zusammenführen */
[COL_DATA, COL_DATA2, COL_DATA3, COL_DATA4].forEach((blk) => {
  blk.trim().split("\n").forEach((line) => {
    const [n, c1, c2] = line.split("|");
    if (n && c1 && c2) COL[n.trim()] = [c1.trim(), c2.trim()];
  });
});

/* Frauenmannschaften erben die Farben ihres Stammvereins, sofern nicht
   eigens hinterlegt. Dazu werden Zusätze und Vereinskürzel entfernt.   */
const CLUBWORDS = /\b(fc|sc|ac|cf|sv|sd|cd|ud|as|us|ss|ssc|rc|rcd|afc|vfl|vfb|tsv|tsg|spvgg|bsc|kv|kaa|krc|rsc|nk|hnk|fk|club|calcio|futebol|feminino|femenino|feminine|feminines|femminile|femenil|feminil|femeni|frauen|women|womens|vrouwen|kvinner|dam|damen|ladies|beleza|regina|ventus|leonessa)\b/g;
const norm = (n) => n.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9 ]/g, " ")
  .replace(CLUBWORDS, " ")
  .replace(/\s+/g, "");
const NORM_COL = {};
CLUBS.forEach((c) => { if (c.g === "m" && COL[c.n]) { const k = norm(c.n); if (k && !NORM_COL[k]) NORM_COL[k] = COL[c.n]; } });
CLUBS.forEach((c) => {
  if (COL[c.n]) return;
  const k = norm(c.n);
  if (NORM_COL[k]) COL[c.n] = NORM_COL[k];
});

const FALLBACK = [["#C8102E","#E8E8E8"],["#0B2A5B","#E8E8E8"],["#1B5E20","#E8E8E8"],["#F5D000","#111111"],
  ["#111111","#E8E8E8"],["#6B1F3B","#F5D000"],["#0B4FA0","#F5D000"],["#8A1128","#E8E8E8"],["#F58220","#111111"],["#5FA8D3","#0B2A5B"]];
const clubColors = (c) => (c && COL[c.n]) || FALLBACK[hash(c ? c.n : "x") % FALLBACK.length];
/* Vereinsfarben kommen als Paar [erste, zweite], Landesfarben als Objekt.
   Diese Hilfe macht beides gleich benutzbar.                            */
/* HSL nach Hex — damit jede Farbe im Spiel auf dieselbe Weise prüfbar ist. */
function hslHex(h, s, l) {
  const S = s / 100, L = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const z = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return "#" + z(f(0)) + z(f(8)) + z(f(4));
}

/* Hebt sich die Farbe auf dunklem Grund ab? */
const hell = (hex) => {
  try { const n = parseInt(String(hex).slice(1), 16);
    return ((n >> 16 & 255) * .299 + (n >> 8 & 255) * .587 + (n & 255) * .114) > 70; }
  catch (e) { return true; }
};
const farbPaar = (x) => Array.isArray(x) ? { p: x[0], s: x[1] }
  : (x && x.p) ? { p: x.p, s: x.s || "#DCE3D8" } : { p: "#E8B84B", s: "#DCE3D8" };
const monogram = (n) => {
  const skip = ["FC","SC","SV","VfL","VfB","TSG","AC","AS","SS","SSC","CA","CR","SE","RC","RB","AFC","BSC","1.","04","05","96","1907","EA","SM","GD","UD","RCD","SD","OGC","OSC","US","SSV","KRC"];
  const w = n.replace(/[.,]/g, " ").split(/\s+/).filter((x) => x && !skip.includes(x));
  if (!w.length) return n.slice(0, 2).toUpperCase();
  if (w.length === 1) return w[0].slice(0, 3).toUpperCase();
  return (w[0][0] + w[1][0] + (w[2] ? w[2][0] : "")).toUpperCase();
};
const CREST_SHAPES = [
  "M4 3 H36 V22 C36 32 20 38 20 38 C20 38 4 32 4 22 Z",
  "M20 2 A18 18 0 1 1 19.9 2 Z",
  "M6 3 H34 A3 3 0 0 1 37 6 V34 A3 3 0 0 1 34 37 H6 A3 3 0 0 1 3 34 V6 A3 3 0 0 1 6 3 Z",
  "M4 3 H36 V30 L20 38 L4 30 Z",
];
function Crest({ club, size = 32 }) {
  if (!club) return null;
  const [a, b] = clubColors(club);
  const h = hash(club.n), shape = h % 4, div = (h >> 3) % 4, id = "cr" + (h % 999983);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0, display: "block" }} role="img" aria-label={"Wappen " + club.n}>
      <defs><clipPath id={id}><path d={CREST_SHAPES[shape]} /></clipPath></defs>
      <g clipPath={"url(#" + id + ")"}>
        <rect width="40" height="40" fill={a} />
        {div === 0 && <rect x="20" width="20" height="40" fill={b} opacity=".92" />}
        {div === 1 && <rect y="20" width="40" height="20" fill={b} opacity=".92" />}
        {div === 2 && <polygon points="0,40 40,0 40,40" fill={b} opacity=".92" />}
        {div === 3 && <><rect x="12" width="7" height="40" fill={b} opacity=".9" /><rect x="26" width="7" height="40" fill={b} opacity=".9" /></>}
      </g>
      <path d={CREST_SHAPES[shape]} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth="2.6" />
      <path d={CREST_SHAPES[shape]} fill="none" stroke="rgba(255,255,255,.20)" strokeWidth="1" />
      <text x="20" y={shape === 3 ? 22.4 : 23.4} textAnchor="middle" fontSize="12" fontWeight="400" fontFamily="'Rasen Anzeige','Roboto Condensed',sans-serif" fill="rgba(0,0,0,.7)">{monogram(club.n)}</text>
      <text x="20" y={shape === 3 ? 21.6 : 22.6} textAnchor="middle" fontSize="12" fontWeight="400" fontFamily="'Rasen Anzeige','Roboto Condensed',sans-serif" fill="#F2F4F7">{monogram(club.n)}</text>
    </svg>
  );
}

/* ---------------- Spielerporträt ---------------- */
const SKIN = ["#F0D0B4", "#E5BC96", "#D6A177", "#B87C4F", "#8D5A32", "#61402A"];
const HAIRC = ["#17120F", "#33241A", "#5E4028", "#8E6234", "#C9A052", "#9A9A9A", "#B04A2C"];
/* Hauttöne nach Herkunft. Der Namenspool taugt dafür nicht — Nigeria und
   England teilen sich denselben Eintrag. Deshalb über Verband und Klima,
   mit einer kurzen Liste für die Länder, wo das zu grob wäre.          */
const HAUT_LAND = {
  MAR:[1,3], ALG:[1,3], TUN:[1,3], EGY:[1,3], LBY:[1,3], SUD:[3,5],
  RSA:[1,5], NAM:[1,5], BOT:[3,5], ZIM:[3,5],
  BRA:[0,5], USA:[0,5], CAN:[0,4], FRA:[0,5], ENG:[0,4], NED:[0,4], BEL:[0,4],
  POR:[0,3], ESP:[0,2], ITA:[0,2], SUI:[0,3], SWE:[0,3], GER:[0,3],
  COL:[1,4], VEN:[1,4], ECU:[1,4], PER:[1,4], PAN:[2,5], SUR:[2,5],
  CUB:[1,5], DOM:[2,5], JAM:[3,5], HAI:[4,5], TRI:[2,5], GUY:[2,5],
  IND:[2,4], PAK:[2,4], BAN:[2,4], SRI:[2,4], NEP:[1,3], MDV:[2,4],
  AUS:[0,3], NZL:[0,3], PNG:[4,5], SOL:[4,5], FIJ:[3,5], VAN:[4,5], TAH:[2,4],
};
function hautBereich(id) {
  if (HAUT_LAND[id]) return HAUT_LAND[id];
  const conf = NAT_CONF[id], reg = REGION[id];
  if (conf === "CAF") return [3, 5];                       // Afrika südlich der Sahara
  if (conf === "OFC") return [2, 5];
  if (conf === "AFC") return ["in", "fa"].includes(reg) ? [2, 4] : reg === "ar" ? [1, 3] : [0, 2];
  if (conf === "CONMEBOL") return [0, 4];
  if (conf === "CONCACAF") return [1, 4];
  if (reg === "ar" || reg === "tr" || reg === "fa") return [1, 3];
  return [0, 2];                                            // Europa
}
function haarBereich(id) {
  const conf = NAT_CONF[id], reg = REGION[id];
  if (conf === "CAF" || conf === "OFC") return [0, 1];
  if (conf === "AFC") return ["jp", "cn", "se", "ea"].includes(reg) ? [0, 0] : [0, 1];
  if (conf === "CONMEBOL" || conf === "CONCACAF") return [0, 2];
  if (["ar", "tr", "fa", "gr", "it", "es", "pt", "he"].includes(reg)) return [0, 2];
  if (["nl", "sk"].includes(reg)) return [2, 4];
  if (reg === "en") return [1, 6];
  return [0, 4];
}

/* ==========================================================================
   PORTRÄT
   --------------------------------------------------------------------------
   Bis 33.16 steckten alle Merkmale in EINER Zahl, ausgelesen mit
   `(h >> bit) % n`. Das ist kein abgetrenntes Feld: `h >> bit` enthält
   ALLE höheren Bits, und ein Zuschlag von 2^bit trägt in jedes höhere
   Merkmal hinein. Gemessen an 400 Proben änderte ein Druck auf „Schmuck"
   im Schnitt 8 von 13 Merkmalen mit, „Kinn" 7 von 13. Deshalb würfelte
   die Feineinstellung das halbe Porträt neu.

   Jetzt: die Merkmale liegen als eigenes Objekt (`zuege`) vor. Wer eines
   ändert, ändert genau eines — der Fehler ist damit nicht behoben, sondern
   unmöglich gemacht. Aus einer alten Kennung (Zahl) werden die Merkmale
   über eine Mischfunktion abgeleitet, die je Merkmal einen eigenen Strom
   zieht; Überlappung kann es dort ebenfalls nicht geben.

   ACHTUNG: Alte Spielstände tragen nur die Zahl. Ihre Gesichter sehen nach
   diesem Umbau ANDERS aus als vorher — bei einer Neuzeichnung aller Teile
   ließe sich das ohnehin nicht vermeiden. Der Spielstand bleibt gültig.
   ========================================================================== */

/* Ein eigener Zufallsstrom je Merkmal. xorshift auf Kennung ⊕ Merkmalsnummer:
   gleiche Kennung ⇒ gleiches Gesicht, aber kein Merkmal hängt am anderen. */
function mische(kennung, i) {
  let x = ((kennung | 0) ^ ((i + 1) * 0x9E3779B1)) >>> 0;
  x ^= x << 13; x >>>= 0;
  x ^= x >>> 17;
  x ^= x << 5;  x >>>= 0;
  return x >>> 0;
}

/* Augenfarben. Bis 33.16 wurde `eyeC` berechnet und NIE benutzt — die Augen
   waren immer #2A2118. Der Regler „Augen" in der Feineinstellung hat deshalb
   sichtbar nichts getan. Jetzt trägt die Iris die Farbe wirklich. */
const AUGENFARBE = [
  { n: "Dunkelbraun", c: "#3B2416" }, { n: "Braun", c: "#6B4423" },
  { n: "Bernstein",   c: "#9C6B24" }, { n: "Haselnuss", c: "#7A6A34" },
  { n: "Grün",        c: "#4A6B45" }, { n: "Graublau",  c: "#5A7183" },
  { n: "Blau",        c: "#3E6C8E" },
];

/* Kopfformen. Wange (b) und Kiefer (j) als Zahlen, damit Haare und Bart
   sich danach richten können, statt vier Mal von Hand nachgezeichnet zu
   werden. kinn ist die Höhe der Kinnspitze. */
const KOPFFORM = [
  { n: "Oval",   b: 25, j: 15, kinn: 71 },
  { n: "Rund",   b: 27, j: 19, kinn: 69 },
  { n: "Kantig", b: 26, j: 21, kinn: 70 },
  { n: "Schmal", b: 23, j: 12, kinn: 73 },
  { n: "Herz",   b: 26, j: 11, kinn: 72 },
];
const kopfPfad = (k) => {
  const l = 50 - k.b, r = 50 + k.b, jl = 50 - k.j, jr = 50 + k.j;
  return "M" + l + ",40 C" + l + ",21 " + (l + 9) + ",12 50,12 C" + (r - 9) + ",12 " + r + ",21 " + r + ",40"
    + " C" + r + ",52 " + jr + "," + (k.kinn - 8) + " " + jr + "," + (k.kinn - 6)
    + " C" + jr + "," + (k.kinn - 1) + " " + (50 + k.j * .45) + "," + k.kinn + " 50," + k.kinn
    + " C" + (50 - k.j * .45) + "," + k.kinn + " " + jl + "," + (k.kinn - 1) + " " + jl + "," + (k.kinn - 6)
    + " C" + jl + "," + (k.kinn - 8) + " " + l + ",52 " + l + ",40 Z";
};

/* Zahl der Auswahlmöglichkeiten je Merkmal. `mk_haar` und `mk_acc` schalten
   zusätzliche frei — die Grundzahl ist trotzdem deutlich größer als vorher. */
const ZUEGE_ANZAHL = (meta, w) => ({
  kopf: KOPFFORM.length,
  haut: 6,
  haar: HAIRC.length,
  frisur: w ? (meta && meta.mk_haar ? 14 : 10) : (meta && meta.mk_haar ? 16 : 12),
  bart: w ? 1 : 10,
  brauen: 5,
  augen: 5,
  augenfarbe: AUGENFARBE.length,
  nase: 5,
  mund: 5,
  ohren: 3,
  wangen: 3,
  schmuck: meta && meta.mk_acc ? 6 : 2,
});

/* Reihenfolge ist die Nummer im Mischstrom — NIE umsortieren, sonst ändert
   sich jedes bestehende Gesicht. Neues immer hinten anhängen. */
const ZUEGE_ORDNUNG = ["haut", "haar", "frisur", "bart", "brauen", "augen", "augenfarbe",
  "nase", "mund", "ohren", "wangen", "schmuck", "kopf"];

/* Merkmale aus einer alten Kennung ableiten. Hautton und Haarfarbe bleiben
   im Rahmen der Herkunft — das war vorher so und bleibt so. */
function zuegeAusKennung(kennung, g, nat, meta) {
  const h = Math.abs(kennung | 0), w = g === "w";
  const A = ZUEGE_ANZAHL(meta, w);
  const z = {};
  ZUEGE_ORDNUNG.forEach((k, i) => { z[k] = mische(h, i) % A[k]; });
  const TONE = hautBereich(nat), HAAR = haarBereich(nat);
  z.haut = TONE[0] + (z.haut % (TONE[1] - TONE[0] + 1));
  z.haar = HAAR[0] + (z.haar % (HAAR[1] - HAAR[0] + 1));
  if (w) z.bart = 0;
  return z;
}

/* Ein Merkmal weiterdrehen — genau eines. Ersetzt `bitDrehen`. */
function zugDrehen(zuege, feld, richtung, g, nat, meta) {
  const A = ZUEGE_ANZAHL(meta, g === "w");
  const z = { ...zuege };
  if (feld === "haut" || feld === "haar") {
    const R = feld === "haut" ? hautBereich(nat) : haarBereich(nat);
    const spanne = R[1] - R[0] + 1;
    const rel = ((z[feld] - R[0]) % spanne + spanne) % spanne;
    z[feld] = R[0] + ((rel + richtung) % spanne + spanne) % spanne;
    return z;
  }
  const n = A[feld] || 1;
  if (n <= 1) return z;
  z[feld] = (((z[feld] || 0) + richtung) % n + n) % n;
  return z;
}

function Avatar({ seed = 1, zuege, club, size = 72, ring, g, nat, meta }) {
  const K = meta || {};
  const w = g === "w";
  const z = zuege || zuegeAusKennung(seed, g, nat, K);
  const kennung = Math.abs((seed | 0)) % 999979;

  const kopf = KOPFFORM[z.kopf % KOPFFORM.length] || KOPFFORM[0];
  const haut = SKIN[clamp(z.haut, 0, SKIN.length - 1)];
  const schatten = shade(haut, -26);      /* Flächenschatten, keine Verläufe */
  const tief = shade(haut, -46);
  const haar = HAIRC[clamp(z.haar, 0, HAIRC.length - 1)];
  const haarHell = shade(haar, 26);
  const iris = (AUGENFARBE[z.augenfarbe % AUGENFARBE.length] || AUGENFARBE[0]).c;
  const [c1, c2] = clubColors(club);
  const R = rahmenFuer(K);

  const augenY = 46 + (z.augen === 3 ? 1.5 : 0);
  const lidH = z.augen === 1 ? 2.6 : z.augen === 4 ? 4.2 : 3.4;   /* Lidspalt */
  const kinnY = kopf.kinn;
  const kopfD = kopfPfad(kopf);

  /* Haaransatz folgt der Kopfbreite, damit keine Frisur neben dem Kopf sitzt. */
  const hl = 50 - kopf.b, hr = 50 + kopf.b;
  const dach = (tiefe) => "M" + hl + "," + (40 - tiefe) + " C" + hl + ",20 " + (hl + 9) + ",11 50,11 C"
    + (hr - 9) + ",11 " + hr + ",20 " + hr + "," + (40 - tiefe);
  /* Die geschlossene Kappe. Alle Verzierungen — Scheitel, Stacheln, Zöpfe —
     werden darauf BESCHNITTEN. Ohne das ragen sie über den Kopf hinaus und
     sehen aus wie eine Krone; genau das zeigte der erste Musterbogen. */
  const kappe = dach(1) + " C" + (hr - 4) + ",25 " + (hl + 4) + ",25 " + hl + ",39 Z";
  const kid = "hk" + kennung;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Spielerporträt"
      style={{ display: "block", flexShrink: 0, borderRadius: 0, background: "#0B120E",
        border: ring ? (R ? R.w + "px solid " + R.c : "1px solid " + ring) : "none",
        boxShadow: R ? "0 0 12px -2px " + R.c : undefined }}>
      <clipPath id={"av" + kennung}><rect width="100" height="100" /></clipPath>
      <clipPath id={kid}><path d={kappe} /></clipPath>
      <g clipPath={"url(#av" + kennung + ")"}>
        {/* Grund: Rasen bei Nacht, nicht das alte Marineblau. Zwei flache
            Töne statt eines Verlaufs — dieselbe Sprache wie der Rest. */}
        <rect width="100" height="100" fill="#0B120E" />
        <path d="M0,64 H100 V100 H0 Z" fill="#0E1712" />

        {/* Schultern und Trikot */}
        <path d="M2,100 C4,82 22,74 50,74 C78,74 96,82 98,100 Z" fill={c1} />
        <path d="M2,100 C4,82 22,74 34,74 L40,100 Z" fill={shade(c1, -16)} />
        <path d="M40,74 L50,87 L60,74 L56,73 L50,82 L44,73 Z" fill={c2} />

        {/* Hals mit Schatten unter dem Kiefer */}
        <path d={"M43," + (kinnY - 10) + " h14 v14 c0,4 -14,4 -14,0 Z"} fill={schatten} />
        <path d={"M43," + (kinnY - 10) + " h14 v4 c-4,3 -10,3 -14,0 Z"} fill={tief} />

        {/* Ohren */}
        {(() => { const ry = 5.6 + z.ohren * 1.2, cy = 47, ex = kopf.b - 1;
          return (<g fill={haut}>
            <ellipse cx={50 - ex} cy={cy} rx={3.6} ry={ry} />
            <ellipse cx={50 + ex} cy={cy} rx={3.6} ry={ry} />
            <ellipse cx={50 - ex + .8} cy={cy} rx={1.1} ry={ry - 3.2} fill={schatten} opacity=".7" />
            <ellipse cx={50 + ex - .8} cy={cy} rx={1.1} ry={ry - 3.2} fill={schatten} opacity=".7" />
          </g>); })()}

        {/* Kopf, dazu eine Schattenseite — Volumen ohne Verlauf */}
        <path d={kopfD} fill={haut} />
        {/* Schattenseite NUR an der aeusseren Wange. Ein Schatten bis zur Mitte
            hinterlaesst eine harte Naht mitten im Gesicht — das sah aus wie ein
            Riss und war der groesste Makel des ersten Wurfs. */}
        <path d={"M" + (50 + kopf.b - 10) + ",16 C" + (50 + kopf.b - 2) + ",20 " + (50 + kopf.b) + ",28 "
          + (50 + kopf.b) + ",40 C" + (50 + kopf.b) + ",52 " + (50 + kopf.j) + "," + (kinnY - 8) + " "
          + (50 + kopf.j) + "," + (kinnY - 6) + " C" + (50 + kopf.j) + "," + (kinnY - 3) + " "
          + (50 + kopf.j * .7) + "," + (kinnY - 1) + " " + (50 + kopf.j * .5) + "," + (kinnY - 1)
          + " C" + (50 + kopf.j * .8) + "," + (kinnY - 9) + " " + (50 + kopf.b - 7) + ",30 "
          + (50 + kopf.b - 10) + ",16 Z"} fill={schatten} opacity=".2" />

        {/* Wangenknochen / Kinngrübchen */}
        {z.wangen === 1 && <ellipse cx="50" cy={kinnY - 6} rx="3.6" ry="2" fill={schatten} opacity=".55" />}
        {z.wangen === 2 && <><path d={"M" + (50 - kopf.j - 1) + "," + (kinnY - 16) + " q4,7 7,10"} fill="none"
          stroke={schatten} strokeWidth="1.4" strokeLinecap="round" opacity=".6" />
          <path d={"M" + (50 + kopf.j + 1) + "," + (kinnY - 16) + " q-4,7 -7,10"} fill="none"
            stroke={schatten} strokeWidth="1.4" strokeLinecap="round" opacity=".6" /></>}

        {/* ---- Haare hinter dem Kopf ---- */}
        {!w && z.frisur === 5 && <ellipse cx="50" cy="30" rx={kopf.b + 9} ry="25" fill={haar} />}
        {!w && z.frisur === 8 && <g fill={haar}>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={50 - kopf.b + 4 + i * ((kopf.b * 2 - 12) / 3)}
            y="34" width="4" height={20 + (i % 2) * 6} rx="2" />)}</g>}
        {w && (z.frisur === 1 || z.frisur === 6) && <path d={"M" + (hl - 2) + ",36 C" + (hl - 4) + ",62 "
          + (hl + 1) + ",82 " + (hl + 7) + ",84 C" + (hl + 4) + ",64 " + (hl + 3) + ",48 " + (hl + 4) + ",38 Z"
          + " M" + (hr + 2) + ",36 C" + (hr + 4) + ",62 " + (hr - 1) + ",82 " + (hr - 7) + ",84 C"
          + (hr - 4) + ",64 " + (hr - 3) + ",48 " + (hr - 4) + ",38 Z"} fill={haar} />}
        {w && z.frisur === 2 && <ellipse cx="50" cy="34" rx={kopf.b + 8} ry="26" fill={haar} />}
        {w && z.frisur === 4 && <circle cx={50 + kopf.b - 3} cy="22" r="7.5" fill={haar} />}
        {w && z.frisur === 5 && <path d={"M" + (hr - 4) + ",24 C" + (hr + 10) + ",32 " + (hr + 11) + ",56 "
          + (hr + 4) + ",72 C" + (hr + 4) + ",52 " + (hr - 1) + ",34 " + (hr - 8) + ",28 Z"} fill={haar} />}

        {/* Kopf noch einmal über die Haarmasse, damit das Gesicht frei bleibt */}
        {((!w && (z.frisur === 5 || z.frisur === 8)) || (w && z.frisur === 2))
          && <path d={kopfD} fill={haut} />}
        {/* Knoten sitzt OBEN, nicht hinter dem Kopf — hinten war er unsichtbar
            und die Frisur sah aus wie eine Glatze. */}
        {!w && z.frisur === 9 && <circle cx="50" cy="9.5" r="7" fill={haar} />}

        {/* ---- Frisuren auf dem Kopf ----
            0 rasiert · 1 kurz · 2 Seitenscheitel · 3 Undercut · 4 Locken
            5 Afro · 6 Igel · 7 Halbglatze · 8 Zöpfe · 9 Knoten
            10 Vokuhila · 11 Glatze · 12–15 freigeschaltet
            Bei Frauen: 0 kurz · 1 lang offen · 2 voluminös · 3 Bob
            4 Knoten · 5 Seitenzopf · 6 lang mit Scheitel · 7 Pixie … */}
        {!w && <>
          {z.frisur === 0 && <g><path d={kappe} fill={haar} />
            <path d={"M" + (hl + 3) + ",38 q" + (kopf.b - 3) + ",-9 " + (kopf.b * 2 - 6) + ",0 q-"
              + (kopf.b - 3) + ",4 -" + (kopf.b * 2 - 6) + ",0 Z"} fill={haut} opacity=".35" /></g>}
          {z.frisur === 1 && <path d={dach(1) + " C" + (hr - 4) + ",25 " + (hl + 4) + ",25 " + hl + ",39 Z"} fill={haar} />}
          {z.frisur === 2 && <><path d={kappe} fill={haar} />
            <path d={"M" + (hl + 4) + ",30 C" + (hl + 10) + ",20 " + (50 + 6) + ",20 " + (hr - 2) + ",27 C"
              + (50 + 4) + ",25 " + (hl + 12) + ",28 " + (hl + 4) + ",38 Z"} fill={haarHell} opacity=".5" /></>}
          {z.frisur === 3 && <><path d={dach(-4) + " C" + (hr - 5) + ",22 " + (hl + 5) + ",22 " + hl + ",44 Z"} fill={haar} />
            <g clipPath={"url(#" + kid + ")"}>
              <rect x={hl - 4} y="27" width="7" height="20" fill={haut} />
              <rect x={hr - 3} y="27" width="7" height="20" fill={haut} /></g></>}
          {z.frisur === 4 && <g fill={haar}>
            <path d={kappe} />
            {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={50 - kopf.b + 3 + i * ((kopf.b * 2 - 6) / 5)}
              cy={19 + (i % 2 ? 3 : 0)} r="7.5" />)}</g>}
          {z.frisur === 5 && <path d={dach(2) + " C" + (hr - 4) + ",24 " + (hl + 4) + ",24 " + hl + ",38 Z"} fill={haar} />}
          {z.frisur === 6 && (() => {
            /* Eine durchgehende Zackenlinie ueber der Kappe. Einzelne Dreiecke
               schwebten sichtbar ueber dem Kopf. */
            const n = 6, von = 50 - kopf.b + 2, bis = 50 + kopf.b - 2, br = (bis - von) / n;
            let d = "M" + von + ",26";
            for (let i = 0; i < n; i++) d += " L" + (von + br * (i + .5)) + "," + (8 + (i % 2) * 3)
              + " L" + (von + br * (i + 1)) + "," + (20 - (i % 2) * 2);
            d += " L" + bis + ",26 Z";
            return <g fill={haar}><path d={kappe} /><path d={d} /></g>; })()}
          {z.frisur === 7 && <g clipPath={"url(#" + kid + ")"}><path d={kappe} fill={haar} />
            {/* Zurückweichender Haaransatz: die Stirn wird frei, an den Schläfen
                und hinten bleibt Haar stehen. Eine Ellipse obendrauf las sich
                als Stirnband — das war der zweite Fehlversuch hier. */}
            <path d={"M" + (hl - 1) + ",41 C" + (hl + 2) + ",22 " + (hr - 2) + ",22 " + (hr + 1) + ",41 Z"}
              fill={haut} /></g>}
          {z.frisur === 8 && <><path d={kappe} fill={haar} />
            <g clipPath={"url(#" + kid + ")"}>
              {[0, 1, 2, 3, 4].map((i) => <path key={i} d={"M" + (50 - kopf.b + 5 + i * ((kopf.b * 2 - 10) / 4))
                + ",8 v38"} stroke={haut} strokeWidth="1.4" opacity=".38" fill="none" />)}</g></>}
          {z.frisur === 9 && <path d={dach(1) + " C" + (hr - 4) + ",25 " + (hl + 4) + ",25 " + hl + ",39 Z"} fill={haar} />}
          {z.frisur === 10 && <><path d={dach(1) + " C" + (hr - 4) + ",25 " + (hl + 4) + ",25 " + hl + ",39 Z"} fill={haar} />
            <path d={"M" + (hl - 1) + ",34 C" + (hl - 2) + ",54 " + (hl + 1) + ",66 " + (hl + 5) + ",68 L"
              + (hl + 3) + ",38 Z M" + (hr + 1) + ",34 C" + (hr + 2) + ",54 " + (hr - 1) + ",66 "
              + (hr - 5) + ",68 L" + (hr - 3) + ",38 Z"} fill={haar} />
            {/* Ohren noch einmal darüber: langes Haar gehört HINTER das Ohr.
                Ohne das verschwanden die Ohren und der Vokuhila sah aus wie
                ein Bob — im Kreuzbogen bei drei von fünf Kopfformen. */}
            {(() => { const ry2 = 5.6 + z.ohren * 1.2, ex2 = kopf.b - 1;
              return (<g fill={haut}>
                <ellipse cx={50 - ex2} cy="47" rx={3.6} ry={ry2} />
                <ellipse cx={50 + ex2} cy="47" rx={3.6} ry={ry2} />
                <ellipse cx={50 - ex2 + .8} cy="47" rx={1.1} ry={ry2 - 3.2} fill={schatten} opacity=".7" />
                <ellipse cx={50 + ex2 - .8} cy="47" rx={1.1} ry={ry2 - 3.2} fill={schatten} opacity=".7" />
              </g>); })()}</>}
          {z.frisur === 12 && <><path d={dach(1) + " C" + (hr - 4) + ",25 " + (hl + 4) + ",25 " + hl + ",39 Z"} fill={haar} />
            <path d={dach(1) + " C" + (hr - 4) + ",25 " + (hl + 4) + ",25 " + hl + ",39 Z"} fill={haarHell} opacity=".5"
              transform="translate(0,-3) scale(1,0.94)" /></>}
          {z.frisur === 13 && <><path d={kappe} fill={haar} />
            <g clipPath={"url(#" + kid + ")"}>
              {[0, 1, 2, 3].map((i) => <rect key={i} x={50 - kopf.b + 6 + i * ((kopf.b * 2 - 12) / 3)} y="6"
                width="2.2" height="40" fill={haut} opacity=".55" />)}</g></>}
          {z.frisur === 14 && <path d={dach(3) + " C" + (hr - 6) + ",22 " + (hl + 6) + ",22 " + hl + ",37 Z"} fill={haar} />}
          {z.frisur === 15 && <><path d={kappe} fill={haar} />
            <path d={"M" + (50 - 9) + ",13 q9,-10 18,0 q-9,4 -18,0 Z"} fill={haarHell} /></>}
        </>}

        {w && <>
          <path d={dach(1) + " C" + (hr - 4) + ",25 " + (hl + 4) + ",25 " + hl + ",39 Z"} fill={haar} />
          {z.frisur === 3 && <path d={"M" + (hl - 1) + ",34 C" + (hl - 3) + ",50 " + (hl + 1) + ",58 "
            + (hl + 6) + ",59 L" + (hl + 6) + ",40 Z M" + (hr + 1) + ",34 C" + (hr + 3) + ",50 "
            + (hr - 1) + ",58 " + (hr - 6) + ",59 L" + (hr - 6) + ",40 Z"} fill={haar} />}
          {z.frisur === 4 && <circle cx="50" cy="10" r="7.5" fill={haar} />}
          {z.frisur === 7 && <path d={dach(3) + " C" + (hr - 6) + ",23 " + (hl + 6) + ",23 " + hl + ",37 Z"} fill={haar} />}
          {z.frisur === 8 && <g fill={haar}>{[0, 1, 2, 3].map((i) =>
            <circle key={i} cx={50 - kopf.b + 5 + i * ((kopf.b * 2 - 10) / 3)} cy="20" r="8" />)}</g>}
          {z.frisur === 9 && <path d={"M" + (50 - 6) + ",12 q6,-6 12,0 q-6,4 -12,0 Z"} fill={haarHell} />}
        </>}

        {/* ---- Augenbrauen ---- */}
        <g fill={shade(haar, -12)}>
          {z.brauen === 0 && <><rect x="33" y="39.5" width="13" height="2.6" rx="1.3" />
            <rect x="54" y="39.5" width="13" height="2.6" rx="1.3" /></>}
          {z.brauen === 1 && <><path d="M33,41.5 Q39.5,37.6 46,40.4 L46,42.6 Q39.5,40.2 33,43.4 Z" />
            <path d="M67,41.5 Q60.5,37.6 54,40.4 L54,42.6 Q60.5,40.2 67,43.4 Z" /></>}
          {z.brauen === 2 && <><path d="M33,39.6 L46,41.4 L46,43.6 L33,42 Z" />
            <path d="M67,39.6 L54,41.4 L54,43.6 L67,42 Z" /></>}
          {z.brauen === 3 && <><rect x="34.5" y="40" width="10.5" height="1.9" rx="1" />
            <rect x="55" y="40" width="10.5" height="1.9" rx="1" /></>}
          {z.brauen === 4 && <><path d="M32.5,42.4 Q39.5,36.8 46.5,41 L46.5,43.6 Q39.5,39.4 32.5,44.6 Z" />
            <path d="M67.5,42.4 Q60.5,36.8 53.5,41 L53.5,43.6 Q60.5,39.4 67.5,44.6 Z" /></>}
        </g>

        {/* ---- Augen: Lidspalt, Iris in der gewählten Farbe, Pupille, Glanz ----
            Vorher waren es zwei weiße Ellipsen mit einem Punkt darin. */}
        {[40, 60].map((cx) => (
          <g key={cx}>
            <path d={"M" + (cx - 6) + "," + augenY + " q6," + (-lidH - 1.6) + " 12,0 q-6," + (lidH + 1.6) + " -12,0 Z"}
              fill="#F2F4F1" />
            <circle cx={cx} cy={augenY - .3} r={Math.min(3.1, lidH + .5)} fill={iris} />
            <circle cx={cx} cy={augenY - .3} r={Math.min(1.5, lidH * .45)} fill="#120E0B" />
            <circle cx={cx - 1.1} cy={augenY - 1.5} r=".8" fill="#FFFFFF" opacity=".85" />
            <path d={"M" + (cx - 6) + "," + augenY + " q6," + (-lidH - 1.8) + " 12,0"} fill="none"
              stroke={shade(haut, -62)} strokeWidth={z.augen === 2 ? 1.5 : 1} strokeLinecap="round" />
            {z.augen === 4 && <path d={"M" + (cx - 6.4) + "," + (augenY + 1.6) + " q6,2.4 12.8,0"} fill="none"
              stroke={shade(haut, -30)} strokeWidth=".9" opacity=".7" />}
          </g>))}

        {/* ---- Nase ---- */}
        {(() => {
          const y0 = 49, y1 = 56 + (z.nase === 3 ? 1.5 : 0);
          const br = [2.5, 3.2, 2, 2.9, 2.7][z.nase] || 2.5;
          return (<g>
            <path d={"M50," + y0 + " C" + (50 - br * .5) + "," + (y0 + 6) + " " + (50 - br) + "," + (y1 - 3)
              + " " + (50 - br) + "," + y1 + " q" + br + ",2 " + (br * 2) + ",0 C" + (50 + br) + "," + (y1 - 3)
              + " " + (50 + br * .5) + "," + (y0 + 6) + " 50," + y0 + " Z"} fill={schatten} opacity=".45" />
            <ellipse cx={50 - br * .75} cy={y1 - .4} rx=".9" ry=".7" fill={tief} />
            <ellipse cx={50 + br * .75} cy={y1 - .4} rx=".9" ry=".7" fill={tief} />
          </g>); })()}

        {/* ---- Mund ---- */}
        {(() => {
          const y = kinnY - 8;
          const lippe = w ? shade(haut, -48) : shade(haut, -58);
          if (z.mund === 0) return <path d={"M43," + y + " Q50," + (y + 4) + " 57," + y}
            fill="none" stroke={lippe} strokeWidth="2" strokeLinecap="round" />;
          if (z.mund === 1) return <rect x="43" y={y - 1} width="14" height="2.4" rx="1.2" fill={lippe} />;
          if (z.mund === 2) return <path d={"M42.5," + (y + 1) + " Q50," + (y - 2.6) + " 57.5," + (y + 1)
            + " Q50," + (y + 2) + " 42.5," + (y + 1) + " Z"} fill={lippe} />;
          if (z.mund === 3) return <><path d={"M43.5," + y + " q6.5,3.4 13,0 q-6.5,2.4 -13,0 Z"} fill={shade(haut, -70)} />
            <path d={"M43.5," + y + " q6.5,-1 13,0"} fill="none" stroke={lippe} strokeWidth="1.5" strokeLinecap="round" /></>;
          return <><path d={"M43," + (y - .6) + " Q50," + (y - 3) + " 57," + (y - .6) + " Q50," + (y + 3.4)
            + " 43," + (y - .6) + " Z"} fill={lippe} />
            <path d={"M43," + (y - .6) + " q7,1.2 14,0"} fill="none" stroke={tief} strokeWidth=".7" opacity=".6" /></>;
        })()}

        {/* ---- Bartwuchs ----
            0 keiner · 1 Stoppeln · 2 Drei-Tage · 3 Schnauzer · 4 Kinnbart
            5 Ziegenbart · 6 Vollbart kurz · 7 Vollbart lang · 8 Kinnriemen
            9 Backenbart */}
        {!w && z.bart > 0 && (() => {
          const y = kinnY, jl = 50 - kopf.j - 2, jr = 50 + kopf.j + 2;
          const rahmen = "M" + (50 - kopf.b + 1) + ",44 C" + (50 - kopf.b + 2) + "," + (y - 8) + " " + jl + ","
            + (y + 2) + " 50," + (y + 2) + " C" + jr + "," + (y + 2) + " " + (50 + kopf.b - 2) + ","
            + (y - 8) + " " + (50 + kopf.b - 1) + ",44 C" + (50 + kopf.b - 5) + "," + (y - 10) + " "
            + (50 + 8) + "," + (y - 5) + " 50," + (y - 5) + " C" + (50 - 8) + "," + (y - 5) + " "
            + (50 - kopf.b + 5) + "," + (y - 10) + " " + (50 - kopf.b + 1) + ",44 Z";
          return (<g fill={haar}>
            {z.bart === 1 && <path d={rahmen} opacity=".22" />}
            {z.bart === 2 && <path d={rahmen} opacity=".45" />}
            {z.bart === 3 && <path d={"M41," + (kinnY - 13.5) + " q9,-3.4 18,0 q-2.5,3 -5.5,3 q-3.5,0 -3.5,-1.4 q0,1.4 -3.5,1.4 q-3,0 -5.5,-3 Z"} />}
            {z.bart === 4 && <path d={"M44," + (kinnY - 3.5) + " q6,-1.6 12,0 q-1,5.5 -6,5.5 q-5,0 -6,-5.5 Z"} />}
            {(z.bart === 5) && <><path d={"M41," + (kinnY - 13.5) + " q9,-3.4 18,0 q-2.5,3 -5.5,3 q-3.5,0 -3.5,-1.4 q0,1.4 -3.5,1.4 q-3,0 -5.5,-3 Z"} />
              <path d={"M45," + (kinnY - 3.5) + " q5,-1.4 10,0 q-1,5.5 -5,5.5 q-4,0 -5,-5.5 Z"} /></>}
            {z.bart === 6 && <path d={rahmen} />}
            {z.bart === 7 && <><path d={rahmen} />
              <path d={"M" + (50 - kopf.j) + "," + (y - 3) + " q" + kopf.j + ",14 " + (kopf.j * 2) + ",0 q-"
                + kopf.j + ",5 -" + (kopf.j * 2) + ",0 Z"} /></>}
            {/* Kinnriemen: schmales Band der Kieferlinie entlang. Die frühere
                Fassung war ein Pfad mit fast deckungsgleicher Innen- und
                Außenkante — im Musterbogen war schlicht nichts zu sehen. */}
            {z.bart === 8 && <path d={"M" + (50 - kopf.b + 1) + ",44 C" + (50 - kopf.b + 2) + "," + (y - 8)
              + " " + jl + "," + (y + 2) + " 50," + (y + 2) + " C" + jr + "," + (y + 2) + " "
              + (50 + kopf.b - 2) + "," + (y - 8) + " " + (50 + kopf.b - 1) + ",44 L" + (50 + kopf.b - 6) + ",44 C"
              + (50 + kopf.b - 7) + "," + (y - 9) + " " + (50 + kopf.j * .8) + "," + (y - 3) + " 50," + (y - 3) + " C"
              + (50 - kopf.j * .8) + "," + (y - 3) + " " + (50 - kopf.b + 7) + "," + (y - 9) + " "
              + (50 - kopf.b + 6) + ",44 Z"} />}
            {/* Koteletten: zwei senkrechte Streifen vor den Ohren. */}
            {/* Koteletten laufen nach unten schmal aus und setzen am Haaransatz
                an. Als Rechtecke lasen sie sich als angeklemmte Balken. */}
            {z.bart === 9 && <><path d={"M" + (50 - kopf.b + 4) + ",39 h4.6 l-1.4," + (y - 51) + " h-2.4 Z"} />
              <path d={"M" + (50 + kopf.b - 8.6) + ",39 h4.6 l-1.4," + (y - 51) + " h-2.4 Z"} /></>}
          </g>); })()}

        {/* ---- Schmuck ---- */}
        {z.schmuck === 1 && <><circle cx={50 - kopf.b + 1} cy="52" r="1.8" fill="#C8A24B" />
          <circle cx={50 + kopf.b - 1} cy="52" r="1.8" fill="#C8A24B" /></>}
        {z.schmuck === 2 && <rect x={50 - kopf.b} y="31" width={kopf.b * 2} height="5.5" fill={c1} />}
        {z.schmuck === 3 && <><circle cx="39" cy={augenY} r="8.4" fill="none" stroke="#243026" strokeWidth="1.5" />
          <circle cx="61" cy={augenY} r="8.4" fill="none" stroke="#243026" strokeWidth="1.5" />
          <path d={"M47.4," + augenY + " H52.6"} stroke="#243026" strokeWidth="1.5" /></>}
        {z.schmuck === 4 && <><path d="M43,88 Q50,93 57,88" fill="none" stroke="#C7A24B" strokeWidth="1.8" />
          <circle cx="50" cy="91.4" r="2.2" fill="#C7A24B" /></>}
        {z.schmuck === 5 && <path d={"M" + (50 - kopf.b + 3) + ",30 h" + (kopf.b * 2 - 6) + " v3 h-"
          + (kopf.b * 2 - 6) + " Z"} fill={shade(c2, 20)} />}
      </g>
    </svg>
  );
}

/* ---------------- Namen ---------------- */
const NP = {
  de:[["Lukas","Jonas","Niklas","Felix","Maximilian","Tim","Leon","Moritz","Julian","Fabian","Kai","Nico","Jannik","Sven","Marlon","Til"],
      ["Brandt","Keller","Hofmann","Weigl","Sander","Reuter","Vogt","Krämer","Lindner","Stach","Ehlers","Nowak","Rieder","Schuster","Baumgart","Kienle"]],
  en:[["Harry","Callum","Reece","Ollie","Declan","Jude","Marcus","Kyle","Tyler","Aaron","Josh","Elliot","Freddie","Curtis","Rhys","Nathan"],
      ["Whitmore","Hazeldine","Barclay","Ferris","Nolan","Kendrick","Alcock","Marsden","Prewitt","Bagshaw","Doyle","Trent","Ashworth","Sowerby","Lockhart","Rennie"]],
  es:[["Álvaro","Iker","Sergio","Rubén","Nacho","Pablo","Aitor","Javi","Unai","Diego","Manu","Gonzalo","Bruno","Marcos","Hugo","Iván"],
      ["Berruezo","Cañizares","Elorza","Larrea","Mendizábal","Ochoa","Quintanilla","Sarabia","Zubeldía","Arrieta","Calvo","Requena","Talavera","Vergara","Otxoa","Barrios"]],
  it:[["Matteo","Lorenzo","Andrea","Davide","Simone","Nicolò","Federico","Giacomo","Alessio","Riccardo","Tommaso","Emanuele","Gianluca","Pietro","Samuele","Cristian"],
      ["Bertolussi","Chiavari","Della Rocca","Fanelli","Grimaldi","Lombardi","Mazzanti","Palladino","Ronchi","Scarpa","Tonelli","Vicari","Zanetti","Orlandi","Bardi","Cocci"]],
  fr:[["Théo","Enzo","Maxence","Lucas","Nolan","Ilan","Rayan","Malo","Kylian","Amine","Bilal","Corentin","Ugo","Sacha","Mattéo","Noa"],
      ["Barthélemy","Coulibaly","Delaunay","Fontaine","Gaillard","Lemoine","Marchal","Ndiaye","Pichon","Rousselet","Tavernier","Vasseur","Boisseau","Guérin","Lacaze","Perrot"]],
  nl:[["Sem","Daan","Luuk","Bram","Thijs","Ruben","Jesse","Mees","Stijn","Teun","Joep","Koen","Milan","Ties","Kas","Sven"],
      ["van Doorn","de Wilde","Kuipers","Bakhuis","Verstraeten","Hoogland","Steenbergen","van Leeuwen","Dekkers","Meijerink","Roelofs","Verhoeff","Nijhuis","Grootveld","de Ridder","Wolthuis"]],
  pt:[["Rúben","Gonçalo","Tiago","Vitinho","Rafael","Diogo","Bernardo","Matheus","Kaio","Éder","Wesley","Lucas","Igor","Danilo","Léo","Caio"],
      ["Almeida","Bragança","Carvalhal","Esteves","Fontoura","Guedes","Leitão","Meireles","Nogueira","Pacheco","Queirós","Salgueiro","Tavares","Vilela","Rezende","Bastos"]],
  gr:[["Giorgos","Dimitris","Nikos","Vasilis","Kostas","Panagiotis","Stefanos","Thanasis","Christos","Petros","Andreas","Manolis","Lefteris","Alexis","Ilias","Sotiris"],
      ["Papadakis","Zervas","Katsaros","Vlachos","Mavridis","Stergiou","Antoniou","Kaloudis","Fotakis","Dimopoulos","Rizos","Chatzis","Lambrou","Sideris","Nikolaidis","Tsakiris"]],
  tr:[["Emre","Kerem","Yusuf","Baris","Onur","Cengiz","Arda","Ferdi","Ozan","Halil","Mert","Kaan","Berkay","Umut","Deniz","Efe"],
      ["Karaman","Demirci","Özdemir","Yalçin","Kilinç","Ergün","Sahin","Bayram","Tekin","Ünal","Coskun","Aydemir","Duran","Sezer","Kurtulus","Yildirim"]],
  sk:[["Mikkel","Rasmus","Emil","Viktor","Anton","Sander","Jonas","Kasper","Elias","Noah","Isak","Alfred","Oscar","Vilmer","Aksel","Hugo"],
      ["Halvorsen","Lindqvist","Nyborg","Sjöberg","Aakerlund","Bergström","Dahlin","Fjeldstad","Grönvall","Haugen","Kvist","Mörk","Ravnsborg","Thorsen","Ekdal","Lund"]],
  ea:[["Mateusz","Kacper","Ivan","Luka","Marko","Stefan","Filip","Tomás","Adam","Bogdan","Nikola","Dusan","Jakub","Andrij","Milos","Vlad"],
      ["Wojcik","Zielinski","Kovacevic","Petrovic","Novák","Horvat","Simic","Dvorák","Balogh","Melnyk","Ivanov","Kubica","Radulovic","Tarasenko","Bednar","Ostrowski"]],
  af:[["Yassine","Anass","Ismaïl","Cheikh","Moussa","Amadou","Chinedu","Ebube","Kwabena","Tarek","Hamza","Sekou","Ousmane","Nabil","Idris","Kofi"],
      ["El Fassi","Boukhari","Diarra","Traoré","Okonkwo","Adeyemi","Mensah","Ndoye","Zerhouni","Camara","Sylla","Bamba","Achraf","Hassine","Owusu","Dieng"]],
  jp:[["Sota","Ren","Yuto","Kaito","Riku","Haruto","Takumi","Sora","Minjae","Jihoon","Seungho","Eunwoo","Hyunjin","Daiki","Kenta","Yuki"],
      ["Nakagawa","Kurihara","Hoshino","Mizuno","Sakaguchi","Takeda","Yamashiro","Onodera","Kang","Baek","Yoon","Seo","Jung","Han","Fujimoto","Ogawa"]],
  ar:[["Faisal","Turki","Salem","Abdullah","Majed","Yasser","Nawaf","Saud","Rami","Khalid","Fahad","Bandar","Ziyad","Omar","Meshal","Hattan"],
      ["Al-Harbi","Al-Qahtani","Al-Dosari","Al-Shehri","Al-Otaibi","Al-Mutairi","Al-Ghamdi","Al-Zahrani","Al-Rashid","Al-Anazi","Al-Suwaidi","Al-Balawi","Al-Nasser","Al-Faraj","Al-Amri","Al-Sahli"]],
};
NP.in = [["Sunil","Arjun","Rohit","Vikram","Anirudh","Sandesh","Manvir","Rahul","Ashique","Jeakson","Naveen","Lallianzuala","Pritam","Sahal","Deepak","Nikhil"],
  ["Chhetri","Sharma","Jhingan","Singh","Thapa","Kumar","Nair","Patel","Reddy","Das","Bose","Mandal","Rana","Iyer","Menon","Gowda"]];
NP.se = [["Bagus","Rizky","Egy","Witan","Marselino","Chanathip","Teerasil","Nguyen","Quang","Cong","Safawi","Faisal","Arif","Adisak","Supachok","Rafael"],
  ["Wahyudi","Pratama","Kurniawan","Setiawan","Songkrasin","Dangda","Van Hau","Thanh Binh","Minh Vuong","Rashid","Aziz","Sukhum","Iskandar","Halim","Putra","Saputra"]];
NP.fa = [["Alireza","Mehdi","Sardar","Karim","Saman","Milad","Omid","Ramin","Vahid","Ehsan","Kaveh","Shoja","Amir","Hossein","Ali","Reza"],
  ["Jahanbakhsh","Taremi","Azmoun","Ansarifard","Ghoddos","Hajsafi","Ebrahimi","Rezaeian","Amiri","Beiranvand","Noorafkan","Mohammadi","Karimi","Sadeghi","Ahmadi","Nazari"]];
NP.he = [["Eran","Manor","Omri","Dor","Liel","Yarden","Shon","Ilay","Tai","Idan","Neta","Gavriel","Ofir","Bibras","Mohammad","Sagiv"],
  ["Zahavi","Solomon","Peretz","Dasa","Abu Fani","Shua","Weissman","Glazer","Baribo","Nachmias","Lavi","Kanichowsky","Turgeman","Yehezkel","Menachem","Gropper"]];
NP.cn = [["Wu","Zhang","Wei","Hao","Jun","Lei","Yang","Cheng","Kai","Bin","Long","Feng","Tao","Peng","Chao","Ming"],
  ["Lei","Yuning","Shixin","Guoping","Jinheng","Yanjun","Xiaoting","Zhenpeng","Hanchao","Xuepeng","Boxuan","Yuanjie","Junmin","Linpeng","Yaokun","Shenchao"]];
NP.tk = [["Eldor","Jaloliddin","Otabek","Azizbek","Sardor","Islom","Rustam","Bekzod","Aziz","Timur","Nurlan","Baurzhan","Aybar","Ramazan","Dias","Alibek"],
  ["Shomurodov","Masharipov","Yusupov","Turgunboev","Rashidov","Zoirov","Nazarov","Bektursun","Zaynutdinov","Abiken","Suyumbayev","Kenzhebek","Toktar","Aliyev","Murzayev","Sadykov"]];
NP.oc = [["Roy","Tevita","Sione","Jale","Nickel","Bill","Kaltack","Tomasi","Alvin","Emmanuel","Raymond","Micah","Joses","Manasa","Setareki","Ratu"],
  ["Krishna","Fifita","Tuiloma","Naicker","Chichirua","Kaltack","Gete","Cama","Singh","Kaiko","Hughes","Nawo","Tass","Radrodro","Bale","Vodo"]];

const genName = (cc, g) => {
  const r = NP[REGION[cc] || "de"] || NP.de;
  if (g === "w") { const fw = PARTNER_F[REGION[cc] || "de"] || PARTNER_F.de; return pick(fw) + " " + pick(r[1]); }
  return pick(r[0]) + " " + pick(r[1]);
};

const SQUAD_SHAPE = ["TW","TW","IV","IV","IV","AV","AV","ZDM","ZM","ZM","ZOM","AF","AF","ST","ST"];
function makeSquad(club, g) {
  return SQUAD_SHAPE.map((pos) => {
    const cc = chance(.4) ? pick(REGION_KEYS) : club.c;
    return { name: genName(cc, g), pos, cc, ovr: clamp(Math.round(club.s + gauss(-1.5, 5)), 40, 96), age: ri(19, 34) };
  }).sort((a, b) => b.ovr - a.ovr);
}
const rivalOf = (sq, pos) => sq.filter((x) => x.pos === pos).sort((a, b) => b.ovr - a.ovr)[0] || null;

/* ---------------- Marktwert und Kernwerte ---------------- */
const MVA = [[45,.05],[50,.15],[55,.5],[60,1.2],[65,3],[70,8],[73,13],[76,22],[79,36],[82,58],[85,84],[87,104],[89,128],[91,158],[93,188],[95,215]];
const AGEMV = {16:1.4,17:1.42,18:1.45,19:1.42,20:1.35,21:1.3,22:1.25,23:1.18,24:1.1,25:1.05,26:1,27:.96,28:.86,29:.72,30:.58,31:.45,32:.34,33:.25,34:.17,35:.11,36:.07,37:.05,38:.04,39:.03,40:.02};
function marketValue(p) {
  const o = p.ovr; let base = o > 95 ? 230 : .03;
  for (let i = 0; i < MVA.length - 1; i++) { const [x1, y1] = MVA[i], [x2, y2] = MVA[i + 1];
    if (o >= x1 && o <= x2) { base = y1 + (y2 - y1) * (o - x1) / (x2 - x1); break; } }
  return Math.max(.02, base * (AGEMV[clamp(p.age, 16, 40)] ?? .02) * (.88 + p.rep / 420) * (.9 + p.form / 500) * ligaInfo(p.club.l).mv);
}
const ovrOf = (a, pos) => Math.round(AK.reduce((s, k) => s + a[k] * POS[pos].w[k], 0));
function roleFor(ovr, clubS, trust, rivalOvr) {
  let d = ovr - clubS + (trust - 50) * .06;
  if (rivalOvr != null) d -= clamp((rivalOvr - ovr) * .55, -2, 7);
  if (d >= 4) return { key:"star", label:"Leistungsträger", f:.94 };
  if (d >= -2) return { key:"start", label:"Stammspieler", f:.82 };
  if (d >= -7) return { key:"rot", label:"Rotationsspieler", f:.58 };
  if (d >= -13) return { key:"bench", label:"Ergänzungsspieler", f:.30 };
  return { key:"tribune", label:"Tribüne", f:.09 };
}
/* Wachstum nach Alter. Bis 34.13 stand hier eine Kurve, die mit 16 auf voller
   Kraft lief und ab 25 fast nichts mehr zuliess:
     <=18 1.0 · <=21 .92 · <=24 .62 · <=26 .34 · <=28 .16 · <=30 .05 · sonst 0
   Gemessen an 250 Laufbahnen ergab das +5 bis +6 Punkte mit 16, ab 25 praktisch
   nichts, Höchststärke im Median mit 24 — und einen Median-Abstand von
   **12 Punkten zum Potenzial**, das damit fast nie erreicht wurde.

   Die neue Kurve nimmt vorn heraus und gibt hinten dazu. Der Gipfel liegt nicht
   mehr bei 21, sondern breiter zwischen 19 und 24, und bis 30 ist noch etwas
   drin. Sprünge mit 16 sind damit kleiner, dafür entwickelt sich ein Spieler
   über die ganze erste Hälfte der Zwanziger weiter — auch ein mittelmässiger,
   was für ein Spiel mit 1.239 Vereinen wichtiger ist als der Ausnahmefall. */
const growthAge = (a) => (a <= 17 ? .44 : a <= 19 ? .62 : a <= 21 ? .70 : a <= 24 ? .64
  : a <= 26 ? .50 : a <= 28 ? .36 : a <= 30 ? .21 : a <= 32 ? .09 : .03);
/* Nachholen: wer weit unter seinen Anlagen liegt, hat auch mit 27 noch Luft.
   Der Bonus wirkt auf das EFFEKTIVE ALTER, nicht als Multiplikator auf die
   Menge — das war der erste Versuch und ein Denkfehler: als Multiplikator
   verstärkte er ausgerechnet die Sechzehnjährigen, wo die Lücke am grössten
   ist. Über das Alter greift er nur dort, wo die Kurve schon abfällt: mit 16
   ist man nicht „noch jünger", mit 28 aber sehr wohl „wie 25".
   Bis 6 Punkte Rückstand nichts, dann bis zu vier Jahre Gutschrift. */
const nachholJahre = (gap) => clamp((gap - 6) / 5, 0, 4);
const declineAge = (a) => (a <= 29 ? 0 : a <= 31 ? .6 : a <= 33 ? 1.5 : a <= 35 ? 2.6 : a <= 37 ? 3.6 : 4.6);

const TRAINING = [
  { id:"kraft",     name:"Kraft & Athletik", bias:{phy:3,pac:2.4}, inj:-5, fit:4 },
  { id:"technik",   name:"Technik",          bias:{dri:3,pas:2.6}, inj:1 },
  { id:"abschluss", name:"Abschluss",        bias:{sho:4,dri:1},   inj:1 },
  { id:"defensiv",  name:"Defensivverhalten",bias:{def:4,phy:1},   inj:0 },
  { id:"taktik",    name:"Spielintelligenz", bias:{pas:1.6,def:1.2,sho:1.2,dri:1.2}, note:.15, inj:0 },
  { id:"reha",      name:"Regeneration",     bias:{}, inj:-16, fit:14, mult:.35 },
];

/* Was der Vermögensverwalter nach jeder Saison erledigt: Rücklage sichern,
   sinnvolle Anschaffungen tätigen, den Rest breit anlegen. Er handelt
   vorsichtig — je größer das Vermögen, desto mehr wandert ins Depot.    */
const VERWALTER_KAUF = ["physio", "athletik", "mental", "koch2", "analyst", "kaelte",
  "wohnung", "haus", "ferienhaus", "villa", "restaurant", "immo", "weinberg", "fanshop",
  "akademie", "amateur", "anteile"];
function verwalterRunde(p, log) {
  if (!p.assets.includes("verwalter")) return 0;
  let n = 0;
  const jahresGehalt = p.wage || 0;
  const rueckstellung = Math.max(.25, jahresGehalt * 1.2);   // Puffer für schlechte Jahre
  /* 1. Anschaffungen, aber nur aus dem, was über der Rücklage liegt */
  for (const id of VERWALTER_KAUF) {
    if (n >= 2) break;
    const it = shopItem(id);
    if (!it || p.assets.includes(id)) continue;
    if (it.req && !p.assets.includes(it.req)) continue;
    if (p.money - it.cost < rueckstellung) continue;
    if (it.up && it.up * 12 > jahresGehalt * .22) continue;  // Unterhalt muss tragbar bleiben
    p.money -= it.cost; p.assets.push(id); applyFx(p, it.fx); n++;
    if (log) log.push("Dein Verwalter hat gekauft: " + it.name + ".");
  }
  /* 2. Freies Geld anlegen — Aufteilung nach Vermögen und Alter */
  const frei = p.money - rueckstellung;
  if (frei > .4) {
    const anteil = p.age >= 33 ? .35 : p.age >= 29 ? .5 : .6;
    let summe = frei * anteil;
    const mix = p.age >= 32 ? [["anleihe", .45], ["immo", .35], ["etf", .2]]
      : p.money >= 12 ? [["etf", .5], ["immo", .28], ["anleihe", .14], ["startup", .08]]
      : [["etf", .58], ["immo", .3], ["anleihe", .12]];
    mix.forEach(([id, q]) => {
      const it = investItem(id);
      const betrag = Math.round(summe * q * 100) / 100;
      if (!it || betrag < it.min) return;
      p.money -= betrag;
      p.depot[id] = (p.depot[id] || 0) + betrag;
      n++;
    });
    if (log && n) log.push("Dein Verwalter hat " + (summe >= 1 ? summe.toFixed(1) + " Mio" : Math.round(summe * 1000) + " Tsd") + " angelegt.");
  }
  return n;
}

/* Wählt im Speedmodus den Schwerpunkt, der zur Position passt und dort
   ansetzt, wo im Verhältnis zur Position am meisten fehlt.             */
function autoTraining(p) {
  if (p.fitness < 52 || p.injuryProne > 68) return "reha";
  const w = POS[p.pos].w;                       // Gewichte der Position
  const summe = AK.reduce((a, k) => a + (w[k] || 0), 0);
  const anteil = {}; AK.forEach((k) => { anteil[k] = (w[k] || 0) / summe; });
  /* Wo steht der Spieler gemessen an dem, was die Position verlangt? */
  const schnitt = AK.reduce((a, k) => a + p.attrs[k] * anteil[k], 0);
  const rueckstand = {};
  AK.forEach((k) => { rueckstand[k] = clamp((schnitt + 3 - p.attrs[k]) / 14, -.3, 1.0); });
  /* Kopfraum: was an einem Wert überhaupt noch zu holen ist. Bis 34.12 fehlte
     das — `rueckstand` misst nur den Abstand zum eigenen Schnitt, und ein Wert
     bei 99 galt als voll trainierbar, solange die Position ihn stark
     gewichtet. Gemessen: Schuss und Tempo auf 99, und der Trainerstab schickte
     weiter zum Abschlusstraining. Ab 96 fällt der Nutzen steil, bei 99 ist er
     fast weg — die Einheit wäre verschenkt. */
  const kopfraum = {};
  AK.forEach((k) => { kopfraum[k] = clamp((99 - p.attrs[k]) / 8, .04, 1); });
  let best = "defensiv", bestWert = -1;
  TRAINING.forEach((t) => {
    const keys = Object.keys(t.bias);
    if (!keys.length) return;                   // Regeneration nur als Notfall, siehe oben
    const gew = keys.reduce((a, k) => a + t.bias[k], 0);
    /* Nutzen: was die Einheit trifft, gewichtet nach Bedeutung für die
       Position, nach dem Rückstand — und danach, ob da noch Luft ist.   */
    let wert = 0;
    keys.forEach((k) => { wert += (t.bias[k] / gew) * anteil[k] * (1 + rueckstand[k] * .6) * kopfraum[k]; });
    if (t.note) wert *= 1.12;                   // Spielintelligenz zahlt auf die Note ein
    if (p.age >= 31 && t.fit) wert *= 1.15;     // ältere Spieler brauchen Substanz
    if (p.age <= 19 && t.id === "kraft") wert *= 1.12;
    if (wert > bestWert) { bestWert = wert; best = t.id; }
  });
  return best;
}

/* Sinnvolle Anschaffungen im Speedmodus: erst Umfeld, dann Anlagen */
const AUTO_KAUF = ["berater", "physio", "athletik", "mental", "analyst", "wohnung",
  "koch2", "kaelte", "haus", "immo", "restaurant", "villa", "akademie", "amateur", "anteile"];
function autoKauf(p, log) {
  let n = 0;
  for (const id of AUTO_KAUF) {
    if (n >= 2) break;                          // höchstens zwei je Saison
    const it = shopItem(id);
    if (!it || p.assets.includes(id)) continue;
    if (it.req && !p.assets.includes(it.req)) continue;
    if (p.money < it.cost * 2.2) continue;      // Puffer lassen
    p.money -= it.cost; p.assets.push(id); applyFx(p, it.fx); n++;
    if (log) log.push("Angeschafft: " + it.name + ".");
  }
  return n;
}

/* ---------------- Anschaffungen und Anlagen ---------------- */
/* perk = dauerhafte Wirkung pro Saison:
   dev  Entwicklungstempo · slow  bremst den Altersverfall · inj  Verletzungsrisiko
   fit  Fitness · morale  Moral · note  Notenbonus · rep  Bekanntheit
   income  Einnahmen pro Jahr (Mio) · net  höherer Nettoanteil vom Gehalt        */
const SHOP = [
  { id:"wohnung",  cat:"Wohnen", name:"Eigentumswohnung",      cost:.35, up:.008, fx:{morale:5},
    perk:{morale:1}, desc:"Eigene vier Wände statt Vereinsappartement." },
  { id:"haus",     cat:"Wohnen", name:"Haus im Grünen",         cost:1.8, up:.03,  fx:{morale:9}, req:"wohnung",
    perk:{morale:2,fit:1}, desc:"Platz, Ruhe und ein Garten für später." },
  { id:"villa",    cat:"Wohnen", name:"Villa mit Trainingsraum", cost:6.5, up:.09, fx:{morale:12,rep:5}, req:"haus",
    perk:{morale:3,fit:3,slow:.08,dev:.04}, desc:"Eigener Kraftraum, eigener Physiotermin." },
  { id:"ferienhaus",cat:"Wohnen",name:"Ferienhaus am Meer",     cost:2.2, up:.04,  fx:{morale:10},
    perk:{morale:4,fit:2}, desc:"Sechs Wochen Sommerpause fühlen sich anders an." },
  { id:"platz",    cat:"Wohnen", name:"Kunstrasen im Garten",   cost:.9,  up:.02,  fx:{morale:4}, req:"haus",
    perk:{dev:.05,note:.03}, desc:"Nach dem Training nochmal eine halbe Stunde Technik." },

  { id:"auto1",    cat:"Fahrzeug", name:"Solider Kombi",        cost:.06, up:.004, fx:{morale:3},
    perk:{}, desc:"Unauffällig, zuverlässig, hält ewig." },
  { id:"auto2",    cat:"Fahrzeug", name:"Sportwagen",           cost:.28, up:.012, fx:{morale:6,rep:5},
    perk:{rep:1}, desc:"Fällt auf. Auch der Presse." },
  { id:"auto3",    cat:"Fahrzeug", name:"Oldtimer-Sammlung",    cost:2.4, up:.05,  fx:{morale:8,rep:4}, req:"auto2",
    perk:{morale:2,income:.04}, desc:"Wertstabil, solange man sie pflegt." },
  { id:"boot",     cat:"Fahrzeug", name:"Motorboot",            cost:1.1, up:.035, fx:{morale:7,rep:3},
    perk:{morale:2}, desc:"Liegt elf Monate im Hafen und lohnt sich trotzdem." },

  { id:"verwalter", cat:"Umfeld", name:"Vermögensverwalter und Lebensberater", cost:.55, up:.06,
    fx:{morale:6}, perk:{morale:2},
    desc:"Eine Person für beides: Anlagen, Anschaffungen und Beteiligungen laufen ab sofort ohne dein Zutun." },
  { id:"berater",  cat:"Umfeld", name:"Steuer- und Finanzberater", cost:.4, up:.02, fx:{},
    perk:{net:.10}, desc:"Holt jedes Jahr spürbar mehr netto heraus." },
  { id:"physio",   cat:"Umfeld", name:"Privater Physiotherapeut",  cost:.9, up:.06, fx:{injuryProne:-14,fitness:8},
    perk:{inj:-4,fit:4,slow:.18}, desc:"Rundumbetreuung. Verlängert Karrieren." },
  { id:"koch2",    cat:"Umfeld", name:"Privatkoch",                cost:.5, up:.045,fx:{fitness:6},
    perk:{fit:3,inj:-2,slow:.05}, desc:"Kein Fertigkram mehr nach Auswärtsspielen." },
  { id:"mental",   cat:"Umfeld", name:"Sportpsychologe",           cost:.6, up:.04, fx:{morale:8},
    perk:{morale:4,note:.06}, desc:"Arbeitet daran, dass ein Fehler nicht das ganze Spiel frisst." },
  { id:"analyst",  cat:"Umfeld", name:"Eigener Videoanalyst",      cost:1.2, up:.07, fx:{},
    perk:{note:.09,dev:.06}, desc:"Zerlegt jeden Gegner, bevor du ihn triffst." },
  { id:"athletik", cat:"Umfeld", name:"Athletiktrainer",           cost:.7, up:.05, fx:{fitness:7},
    perk:{fit:4,dev:.05,inj:-3}, desc:"Zwei Extraeinheiten pro Woche, sauber dosiert." },
  { id:"kaelte",   cat:"Umfeld", name:"Kältekammer im Keller",     cost:1.4, up:.05, fx:{}, req:"haus",
    perk:{slow:.10,inj:-3,fit:2}, desc:"Drei Minuten bei minus 110 Grad. Jeden Tag."},
  { id:"jet",      cat:"Umfeld", name:"Anteil an einem Flugzeug",  cost:5.5, up:.22, fx:{rep:6},
    perk:{fit:3,morale:2}, desc:"Nach Auswärtsspielen im eigenen Bett statt im Hotel." },

  { id:"restaurant",cat:"Geschäft", name:"Restaurantbeteiligung",  cost:.85, up:0, fx:{rep:6},
    perk:{income:.06,rep:1}, desc:"Wirft etwas ab. Kann auch schiefgehen." },
  { id:"immo",     cat:"Geschäft", name:"Mietshaus",               cost:3.2, up:.06, fx:{},
    perk:{income:.19}, desc:"Vier Wohnungen, verlässliche Mieten, gelegentlich Ärger." },
  { id:"weinberg", cat:"Geschäft", name:"Weinberg",                cost:1.6, up:.05, fx:{morale:6,rep:3},
    perk:{income:.07,morale:1}, desc:"Zweitausend Flaschen im Jahr, davon dreihundert verschenkt." },
  { id:"fanshop",  cat:"Geschäft", name:"Beteiligung am Fanshop",  cost:1.1, up:.02, fx:{rep:5},
    perk:{income:.08,rep:2}, desc:"An jedem verkauften Trikot verdienst du mit." },

  { id:"akademie", cat:"Vermächtnis", name:"Eigene Jugendakademie", cost:4, up:.12, fx:{rep:14,morale:12},
    perk:{rep:2,morale:2,income:.05}, desc:"Trägt deinen Namen und überdauert dich." },
  { id:"amateur",  cat:"Vermächtnis", name:"Anteile am Heimatverein", cost:1.3, up:.03, fx:{rep:9,morale:9},
    perk:{morale:3,rep:1}, desc:"Der Klub, bei dem alles angefangen hat." },
  { id:"anteile",  cat:"Vermächtnis", name:"Anteile an deinem Verein", cost:14, up:0, fx:{rep:18,morale:10},
    perk:{rep:3,morale:3}, desc:"Ein Stück deines Klubs gehört jetzt dir." },
];
const shopItem = (id) => SHOP.find((s) => s.id === id);

const INVEST = [
  { id:"anleihe", name:"Staatsanleihen",        min:.2,  lo:.004, hi:.05,  risk:"minimal",    desc:"Langweilig und verlässlich." },
  { id:"immo",    name:"Immobilienfonds",       min:.5,  lo:-.05, hi:.15,  risk:"niedrig",    desc:"Schwankt kaum, wächst langsam." },
  { id:"etf",     name:"Breites ETF-Depot",     min:.1,  lo:-.16, hi:.26,  risk:"mittel",     desc:"Über zehn Jahre fast immer im Plus." },
  { id:"startup", name:"Start-up-Beteiligung",  min:.5,  lo:-.86, hi:1.22, risk:"hoch",       desc:"Meistens weg. Manchmal das Zehnfache." },
  { id:"krypto",  name:"Kryptowährungen",       min:.05, lo:-.80, hi:1.10, risk:"sehr hoch",  desc:"Dein Berater rät ab. Dein Mitspieler nicht." },
];
const investItem = (id) => INVEST.find((i) => i.id === id);
/* Summiert die dauerhaften Wirkungen aller Anschaffungen */
function perk(p, k) {
  let v = 0;
  const a = p && p.assets ? p.assets : [];
  for (const id of a) { const it = shopItem(id); if (it && it.perk && it.perk[k]) v += it.perk[k]; }
  return v;
}
/* Familienstand */
const LIFE = { single:"ledig", beziehung:"in Beziehung", verlobt:"verlobt", verheiratet:"verheiratet", getrennt:"getrennt" };
const PARTNER_F = {
  de:["Lena","Marie","Jana","Sophie","Nele","Antonia","Ida","Frieda","Mia","Hanna","Greta","Pia"],
  en:["Emily","Chloe","Sophie","Grace","Amy","Holly","Ruby","Ellie","Megan","Katie","Lucy","Freya"],
  es:["Lucía","Carmen","Paula","Marta","Nerea","Alba","Irene","Sara","Elena","Rocío","Nuria","Aitana"],
  it:["Giulia","Chiara","Sara","Martina","Elisa","Francesca","Alice","Beatrice","Ilaria","Greta","Noemi","Silvia"],
  fr:["Camille","Léa","Manon","Chloé","Inès","Jade","Louise","Sarah","Emma","Alice","Zoé","Anaïs"],
  nl:["Sanne","Fleur","Lotte","Anne","Julia","Eva","Roos","Isa","Noor","Sophie","Lieke","Maud"],
  pt:["Beatriz","Matilde","Inês","Carolina","Mariana","Rita","Joana","Sofia","Catarina","Leonor","Diana","Marta"],
  gr:["Eleni","Maria","Katerina","Sofia","Dimitra","Ioanna","Christina","Anna","Georgia","Vasiliki","Nefeli","Danai"],
  tr:["Elif","Zeynep","Ayse","Merve","Ece","Selin","Buse","Derya","Melis","Irem","Esra","Sena"],
  sk:["Ida","Emma","Astrid","Freja","Elin","Saga","Alma","Nora","Maja","Signe","Linnea","Tuva"],
  ea:["Zuzanna","Ana","Ivana","Marta","Petra","Katarina","Lucia","Milica","Dorota","Olha","Tereza","Iva"],
  af:["Amina","Fatima","Yasmine","Nour","Salma","Aicha","Chiamaka","Abena","Layla","Rania","Hawa","Zainab"],
  jp:["Yui","Aoi","Sakura","Hina","Mio","Rin","Nanami","Kaede","Minji","Seoyeon","Haru","Akari"],
  ar:["Noura","Sara","Reem","Lama","Hessa","Maha","Dana","Aisha","Rana","Ghada","Amal","Layan"],
};
PARTNER_F.in = ["Aditi","Priya","Ananya","Neha","Kavya","Riya","Meera","Divya","Sneha","Ishita","Pooja","Tara"];
PARTNER_F.se = ["Siti","Nurul","Dewi","Ayu","Mai","Linh","Ploy","Nadia","Farah","Intan","Thu","Chandra"];
PARTNER_F.fa = ["Sara","Niloofar","Parisa","Shirin","Maryam","Elham","Yasaman","Nazanin","Mahsa","Roya","Setareh","Golnaz"];
PARTNER_F.he = ["Noa","Shira","Maya","Yael","Tamar","Adi","Or","Roni","Lior","Gali","Hila","Sivan"];
PARTNER_F.cn = ["Xin","Yan","Mei","Ling","Jia","Ting","Qing","Hui","Wen","Yun","Fang","Lan"];
PARTNER_F.tk = ["Dilnoza","Aizhan","Gulnara","Madina","Zarina","Nargiza","Aisulu","Kamila","Sevara","Aliya","Malika","Dinara"];
PARTNER_F.oc = ["Losana","Mere","Ana","Sina","Talei","Vika","Litia","Sela","Maria","Elenoa","Lupe","Kalisi"];
const partnerName = (cc) => pick(PARTNER_F[REGION[cc] || "de"] || PARTNER_F.de);

/* ---- Namensvorschlag für die Erstellung ----------------------------------
   In der Erstellung stand das Namensfeld leer, und wer nichts eintrug, hiess
   „Der Namenlose". Jetzt schlägt das Feld einen Namen vor, der zur Herkunft
   passt — und wechselt mit, solange man nichts Eigenes eingetippt hat.
   Dieselben vierzehn Sprachräume wie bei PARTNER_F.                        */
const VOR_M = {
  de:["Leon","Jonas","Finn","Luca","Noah","Elias","Paul","Emil","Jan","Tim","Nico","Felix"],
  en:["Jack","Harry","Callum","Kyle","Reece","Lewis","Owen","Connor","Liam","Josh","Alfie","Ethan"],
  es:["Álvaro","Iker","Sergio","Pablo","Hugo","Marcos","Diego","Rubén","Adrián","Javier","Mateo","Aitor"],
  it:["Matteo","Lorenzo","Andrea","Davide","Simone","Federico","Nicolò","Riccardo","Alessio","Marco","Luca","Giulio"],
  fr:["Théo","Hugo","Enzo","Lucas","Nathan","Maxime","Clément","Bastien","Rayan","Kylian","Yanis","Léo"],
  nl:["Daan","Sem","Lars","Bram","Thijs","Jesse","Sven","Ruben","Stijn","Joris","Niels","Koen"],
  pt:["Diogo","Rúben","Tiago","Gonçalo","Bruno","Rafael","Miguel","André","Vasco","Duarte","Nuno","João"],
  gr:["Giorgos","Nikos","Dimitris","Kostas","Vasilis","Panagiotis","Stelios","Christos","Thanasis","Alexis","Manos","Petros"],
  tr:["Emre","Burak","Kerem","Arda","Cenk","Ozan","Yusuf","Hakan","Berkay","Umut","Serkan","Volkan"],
  sk:["Jakub","Tomáš","Marek","Filip","Ondřej","Michal","Patrik","Lukáš","Adam","Dávid","Matej","Peter"],
  ea:["Ivan","Dmitri","Andrej","Nikola","Luka","Stefan","Marko","Vuk","Miloš","Danijel","Filip","Aleksandar"],
  af:["Kwame","Samuel","Ibrahim","Youssef","Emeka","Sadio","Kofi","Ismaël","Cheikh","Abdou","Musa","Baba"],
  jp:["Takumi","Sora","Haruto","Ren","Yuto","Kaito","Riku","Daiki","Hiroto","Shota","Kenta","Yuki"],
  ar:["Omar","Karim","Yousef","Hassan","Faisal","Tarek","Rami","Nasser","Bilal","Ziad","Sami","Adel"],
};
const VOR_W = {
  de:["Lena","Marie","Jana","Sophie","Nele","Antonia","Ida","Frieda","Mia","Hanna","Greta","Pia"],
  en:["Emily","Chloe","Grace","Amy","Holly","Ruby","Ellie","Megan","Katie","Lucy","Freya","Beth"],
  es:["Lucía","Carmen","Paula","Marta","Nerea","Alba","Irene","Sara","Elena","Rocío","Nuria","Aitana"],
  it:["Giulia","Chiara","Sara","Martina","Elisa","Alice","Federica","Valentina","Ilaria","Beatrice","Arianna","Noemi"],
  fr:["Camille","Manon","Léa","Chloé","Inès","Jade","Louise","Emma","Sarah","Clara","Anaïs","Zoé"],
  nl:["Sanne","Fenna","Lotte","Julia","Eva","Anne","Iris","Maud","Femke","Roos","Lieke","Nienke"],
  pt:["Beatriz","Inês","Matilde","Carolina","Rita","Mariana","Joana","Leonor","Catarina","Sofia","Diana","Marta"],
  gr:["Eleni","Maria","Katerina","Sofia","Dimitra","Georgia","Anna","Ioanna","Christina","Vasiliki","Niki","Zoi"],
  tr:["Elif","Zeynep","Ayşe","Merve","Deniz","Ece","Selin","Buse","Melis","Ceren","Nur","Sena"],
  sk:["Tereza","Kristýna","Katarína","Petra","Lucia","Veronika","Barbora","Simona","Zuzana","Eliška","Nikola","Martina"],
  ea:["Ana","Milica","Jelena","Ivana","Sofija","Katarina","Nina","Teodora","Marija","Anja","Dunja","Lena"],
  af:["Amina","Fatou","Aisha","Nala","Zainab","Adaeze","Mariam","Awa","Chiamaka","Halima","Yaa","Sanaa"],
  jp:["Yui","Sakura","Aoi","Hina","Mio","Rin","Nanami","Koharu","Akari","Riko","Emi","Miu"],
  ar:["Layla","Nour","Salma","Rania","Yasmin","Amira","Hala","Dina","Farah","Maha","Lina","Sara"],
};
const NACH = {
  de:["Bergmann","Hofmann","Vogt","Reinhardt","Kessler","Brandt","Lindner","Sauer","Kraft","Wendt","Rieger","Stein"],
  en:["Carter","Whitfield","Bramley","Hollis","Ashcroft","Pemberton","Drake","Reeves","Shaw","Ainsley","Cole","Radley"],
  es:["Serrano","Ibáñez","Cabrera","Peralta","Montoya","Escobar","Rivas","Bellido","Quintana","Vidal","Cortés","Lozano"],
  it:["Bellini","Rossetti","Conti","Marchetti","Vitale","Ferrara","Bruno","Marino","Costa","Rinaldi","Greco","Sartori"],
  fr:["Lemaire","Dupont","Marchand","Girard","Fontaine","Roussel","Bonnet","Perrin","Leroy","Charpentier","Vasseur","Colin"],
  nl:["van Dijk","de Boer","Visser","Bakker","Jansen","Kuiper","Hendriks","Smit","Vermeer","de Wit","Groot","Kramer"],
  pt:["Almeida","Fonseca","Teixeira","Moreira","Cardoso","Braga","Pinto","Azevedo","Sousa","Faria","Lopes","Correia"],
  gr:["Papadopoulos","Nikolaidis","Vlachos","Karagiannis","Stefanidis","Mavridis","Antoniou","Samaras","Petridis","Lambros","Dimou","Sakellaris"],
  tr:["Yıldırım","Demir","Kaya","Şahin","Aslan","Doğan","Çelik","Arslan","Koç","Polat","Tekin","Ergün"],
  sk:["Novák","Horák","Svoboda","Kučera","Procházka","Doležal","Blažek","Kováč","Bartoš","Vlček","Šimek","Mareš"],
  ea:["Petrović","Jovanović","Ilić","Marković","Novak","Kovač","Radić","Simić","Babić","Vuković","Lazić","Đurić"],
  af:["Diallo","Traoré","Okafor","Mensah","Keita","Ndiaye","Bamba","Owusu","Cissé","Adeyemi","Camara","Zongo"],
  jp:["Tanaka","Sato","Yamamoto","Nakamura","Kobayashi","Watanabe","Ito","Suzuki","Takahashi","Inoue","Kimura","Hayashi"],
  ar:["Al-Rashid","Haddad","Nassar","Khalil","Mansour","Saleh","Farouk","Aziz","Jabari","Kassem","Shadid","Barakat"],
};
/* Der Vorschlag hängt AN DER KENNUNG, nicht am Zufall: dieselbe Kennung
   liefert denselben Namen, sonst wechselte er bei jedem Tastendruck. */
const namensVorschlag = (natId, g, kennung) => {
  const r = REGION[natId] || "de";
  const v = (g === "w" ? VOR_W : VOR_M)[r] || (g === "w" ? VOR_W : VOR_M).de;
  const n = NACH[r] || NACH.de;
  const h = Math.abs(kennung | 0);
  return v[h % v.length] + " " + n[(h >> 5) % n.length];
};

const MILESTONES = [
  { id:"a50",  t:"50 Pflichtspiele",       leg:4,  ok:(p)=>p.tot.apps>=50 },
  { id:"a100", t:"100 Pflichtspiele",      leg:8,  ok:(p)=>p.tot.apps>=100 },
  { id:"a250", t:"250 Pflichtspiele",      leg:16, ok:(p)=>p.tot.apps>=250 },
  { id:"a500", t:"500 Pflichtspiele",      leg:32, ok:(p)=>p.tot.apps>=500 },
  { id:"g25",  t:"25 Tore",                leg:5,  ok:(p)=>p.tot.goals>=25 },
  { id:"g100", t:"100 Tore",               leg:18, ok:(p)=>p.tot.goals>=100 },
  { id:"g200", t:"200 Tore",               leg:38, ok:(p)=>p.tot.goals>=200 },
  { id:"as50", t:"50 Vorlagen",            leg:9,  ok:(p)=>p.tot.assists>=50 },
  { id:"as100",t:"100 Vorlagen",           leg:20, ok:(p)=>p.tot.assists>=100 },
  { id:"cs50", t:"50 Spiele ohne Gegentor",leg:12, ok:(p)=>p.tot.cs>=50 },
  { id:"n10",  t:"10 Länderspiele",        leg:6,  ok:(p)=>p.nt.caps>=10 },
  { id:"n50",  t:"50 Länderspiele",        leg:16, ok:(p)=>p.nt.caps>=50 },
  { id:"n100", t:"100 Länderspiele",       leg:34, ok:(p)=>p.nt.caps>=100 },
  { id:"o80",  t:"Gesamtstärke 80",        leg:10, ok:(p)=>p.peakOvr>=80 },
  { id:"o88",  t:"Gesamtstärke 88",        leg:24, ok:(p)=>p.peakOvr>=88 },
  { id:"o93",  t:"Gesamtstärke 93",        leg:46, ok:(p)=>p.peakOvr>=93 },
  { id:"loyal",t:"Zehn Jahre bei einem Verein", leg:26, ok:(p)=>{
      const m={}; p.seasons.forEach(s=>{m[s.club]=(m[s.club]||0)+1;}); return Object.values(m).some(v=>v>=10); } },
  { id:"welt", t:"Fünf Länder bespielt",   leg:14, ok:(p)=>new Set(p.seasons.map(s=>s.land)).size>=5 },
  { id:"treu5",  t:"Fünf Jahre in Folge bei einem Verein", leg:12, ok:(p)=>loyalty(p)>=5 },
  { id:"treu10", t:"Vereinslegende (zehn Jahre)",          leg:30, ok:(p)=>loyalty(p)>=10 },
  { id:"treu200",t:"200 Spiele für einen Verein",          leg:22, ok:(p)=>{
      const m={}; p.seasons.forEach(s=>{m[s.club]=(m[s.club]||0)+s.apps;}); return Object.values(m).some(v=>v>=200); } },
];

/* ---------------- Wettbewerbssimulation ---------------- */
/* Verteilt eine Gesamtzahl ganzzahlig nach Gewichten (größte Reste zuerst) */
function split(total, w) {
  const n = w.length;
  if (!n) return [];
  const sum = w.reduce((a, b) => a + b, 0);
  if (!(sum > 0) || !(total > 0)) { const z = w.map(() => 0); if (total > 0) z[0] = total; return z; }
  const raw = w.map((x) => (total * x) / sum);
  const out = raw.map((v) => Math.floor(v));
  let rest = total - out.reduce((a, b) => a + b, 0);
  const order = raw.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
  for (let i = 0; i < rest; i++) out[order[i % n][1]]++;
  return out;
}

/* Zerlegt eine Punktzahl in Siege/Unentschieden/Niederlagen.
   Nicht jede Punktzahl ist erreichbar (etwa 3n−1 bei n Spielen), deshalb
   wird notfalls nach unten korrigiert und die tatsächliche Punktzahl zurückgegeben. */
function wdl(pts, games) {
  pts = clamp(Math.round(pts), 0, games * 3);
  const target = Math.round(games * .25);
  for (let p = pts; p >= 0; p--) {
    for (let k = 0; k <= games; k++) {
      for (const d of (k === 0 ? [target] : [target - k, target + k])) {
        if (d < 0 || d > games) continue;
        const rest = p - d;
        if (rest >= 0 && rest % 3 === 0 && rest / 3 + d <= games) return [rest / 3, d, games - rest / 3 - d, p];
      }
    }
  }
  return [0, 0, games, 0];
}
function simTable(club, myRank) {
  const arr = leagueClubs(club);
  const N = arr.length, games = Math.max(2, (N - 1) * 2);
  const me = arr.find((c) => c.n === club.n) || club;
  const others = arr.filter((c) => c.n !== club.n)
    .map((c) => ({ c, sc: c.s + gauss(0, 3.1) })).sort((a, b) => b.sc - a.sc).map((x) => x.c);
  const ordered = [...others];
  ordered.splice(clamp(myRank - 1, 0, others.length), 0, me);
  const topPts = Math.round(games * (2.06 + rnd(-.13, .17)));
  const botPts = Math.round(games * (.62 + rnd(-.08, .1)));
  let last = 1e9;
  return ordered.map((c, i) => {
    const t = N <= 1 ? 0 : i / (N - 1);
    let raw = Math.round(topPts - (topPts - botPts) * Math.pow(t, .92) + gauss(0, 2.2));
    raw = clamp(raw, 0, games * 3);
    if (raw >= last) raw = Math.max(0, last - ri(0, 2));
    const [w, d, l, pts] = wdl(raw, games);
    last = pts;
    return { club: c, pos: i + 1, games, w, d, l, pts, me: c.n === club.n,
      gf: Math.max(3, Math.round(games * (.82 + (1 - t) * 1.3) + gauss(0, 4))),
      ga: Math.max(3, Math.round(games * (.78 + t * 1.3) + gauss(0, 4))) };
  });
}
/* Konföderationen: bestimmen, an welchem internationalen Wettbewerb ein Verein teilnimmt */
const CONF = {};
Object.keys(NAT_CONF).forEach((c) => { (CONF[NAT_CONF[c]] = CONF[NAT_CONF[c]] || []).push(c); });
const confOf = (cc) => NAT_CONF[cc] || null;
const CUPS = {
  UEFA:    ["Champions League", "Europa League", "Conference League"],
  CONMEBOL:["Copa Libertadores", "Copa Sudamericana", null],
  CONCACAF:["CONCACAF Champions Cup", "CONCACAF Central American Cup", null],
  AFC:     ["AFC Champions League Elite", "AFC Champions League Two", null],
  CAF:     ["CAF Champions League", "CAF Confederation Cup", null],
};
const CUPS_W = {
  UEFA:    ["Women's Champions League", "Women's Europa Cup", null],
  CONMEBOL:["Copa Libertadores Femenina", null, null],
  CONCACAF:["CONCACAF W Champions Cup", null, null],
  AFC:     ["AFC Women's Champions League", null, null],
  CAF:     ["CAF Women's Champions League", null, null],
};
const cupsFor = (g) => (g === "w" ? CUPS_W : CUPS);
const CUP_TIER = (comp) => {
  for (const k of Object.keys(CUPS)) { const i = CUPS[k].indexOf(comp); if (i >= 0) return { conf: k, tier: i, g: "m" }; }
  for (const k of Object.keys(CUPS_W)) { const i = CUPS_W[k].indexOf(comp); if (i >= 0) return { conf: k, tier: i, g: "w" }; }
  return { conf: "UEFA", tier: 1, g: "m" };
};

function zoneOf(league, pos, N) {
  const arr = LEAGUES[league] || [];
  const cc = arr.length ? arr[0].c : "";
  const conf = confOf(cc);
  const t = TIER[league];
  const pay = ligaInfo(league).pay;
  if (conf === "UEFA" && cc !== "RUS") {
    if (TOP5.includes(league)) { if (pos <= 4) return "cl"; if (pos === 5) return "el"; if (pos === 6) return "conf"; }
    else if (pay >= 1.5 && !t) { if (pos === 1) return "cl"; if (pos <= 3) return "el"; if (pos === 4) return "conf"; }
  } else if (conf && conf !== "UEFA" && !(t && t[0])) {
    const lim = conf === "CONMEBOL" ? [4, 8] : conf === "AFC" ? [3, 5] : [2, 4];
    if (pos <= lim[0]) return "int";
    if (pos <= lim[1]) return "int2";
  }
  if (t) { if (t[1] && pos > N - 3) return "ab"; if (t[0] && pos <= 2) return "auf"; }
  return null;
}
const ZONE = { cl:{ c:"#5E9BD8", t:"Champions League" }, el:{ c:"#3DA35D", t:"Europa League" },
  conf:{ c:"#5E8A7A", t:"Conference League" }, int:{ c:"#5E9BD8", t:"Kontinentaler Hauptwettbewerb" },
  int2:{ c:"#3DA35D", t:"Zweiter kontinentaler Wettbewerb" },
  auf:{ c:"#E8B84B", t:"Aufstieg" }, ab:{ c:"#C13A2E", t:"Abstieg" } };

function simMatch(a, b, home = .3) {
  const d = (a.s - b.s) / 7 + home;
  return [poisson(clamp(1.32 + d * .5, .25, 4.6)), poisson(clamp(1.32 - d * .5, .25, 4.6))];
}
function ko(a, b) {
  let [x, y] = simMatch(a, b, .2);
  if (x === y) { if (chance(clamp(.5 + (a.s - b.s) / 30, .12, .88))) x++; else y++; }
  return { s: x + ":" + y, won: x > y };
}
const CUP_ROUNDS = ["1. Runde", "2. Runde", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale"];
function simCup(club) {
  const pool = CLUBS.filter((c) => c.c === club.c && c.n !== club.n && c.g === club.g);
  const path = []; let won = true, out = null;
  if (!pool.length) return { name: pokalName(club.c), path, won: false, out: "1. Runde" };
  for (let i = 0; i < CUP_ROUNDS.length; i++) {
    const target = club.s - 20 + i * 5.5 + gauss(0, 4);
    const near = pool.filter((c) => Math.abs(c.s - target) < 9);
    const opp = near.length ? pick(near) : pick(pool);
    const r = ko(club, opp);
    path.push({ round: CUP_ROUNDS[i], opp, s: r.s, won: r.won });
    if (!r.won) { won = false; out = CUP_ROUNDS[i]; break; }
  }
  return { name: pokalName(club.c), path, won, out };
}
const EU_KO = ["Playoff-Runde", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale"];
function simEurope(club, comp) {
  const ct = CUP_TIER(comp);
  const base = ct.g === "w" ? [70, 64, 60]
    : ct.conf === "UEFA" ? [71, 63, 56] : ct.conf === "CONMEBOL" ? [62, 56, 52]
    : ct.conf === "AFC" ? [61, 56, 52] : ct.conf === "CONCACAF" ? [60, 55, 52] : [58, 54, 50];
  const floor = base[ct.tier] != null ? base[ct.tier] : 54;
  const own = CONF[ct.conf] || [];
  const gg = club.g || "m";
  let pool = CLUBS.filter((c) => c.n !== club.n && c.g === gg && c.s >= floor && own.includes(c.c)
    && !(TIER[c.l] && TIER[c.l][0]) && c.c !== "RUS");
  if (pool.length < 6) pool = CLUBS.filter((c) => c.n !== club.n && c.g === gg && c.s >= floor - 12 && own.includes(c.c));
  if (pool.length < 4) pool = CLUBS.filter((c) => c.n !== club.n && c.g === gg && c.s >= floor - 20);
  if (!pool.length) return null;
  const groups = ct.g === "w" ? 6 : ct.conf === "UEFA" ? 8 : 6;
  const lg = [];
  for (let i = 0; i < groups; i++) {
    const opp = pick(pool);
    const [x, y] = simMatch(club, opp, i % 2 ? .3 : -.3);
    lg.push({ opp, s: x + ":" + y, r: x > y ? "S" : x === y ? "U" : "N" });
  }
  const pts = lg.reduce((s, m) => s + (m.r === "S" ? 3 : m.r === "U" ? 1 : 0), 0);
  const field = ct.g === "w" ? 18 : ct.conf === "UEFA" ? 36 : 32;
  const cut = Math.round(field * .67);
  const pos = clamp(Math.round(field - (pts / (groups * 3)) * (field - 1) + gauss(0, 3)), 1, field);
  const path = []; let won = false, out = null;
  if (pos > cut) out = ct.conf === "UEFA" ? "Ligaphase" : "Gruppenphase";
  else {
    let alive = true;
    for (let i = pos <= Math.round(field * .22) ? 1 : 0; i < EU_KO.length; i++) {
      const opp = pick(pool);
      const r = ko(club, opp);
      path.push({ round: EU_KO[i], opp, s: r.s, won: r.won });
      if (!r.won) { alive = false; out = EU_KO[i]; break; }
    }
    won = alive;
  }
  return { comp, lg, pts, pos, path, won, out };
}
const CONT = (club, rank) => {
  const conf = confOf(club.c);
  if (!conf) return null;
  if (TIER[club.l] && TIER[club.l][0]) return null;
  const C = cupsFor(club.g);
  if (club.g === "w") {
    if (club.s < 62) return null;
    if (conf === "UEFA" && club.c === "RUS") return null;
    const stark = ligaInfo(club.l).pay >= .15;
    const lim = conf === "UEFA" ? (stark ? [2, 3] : [1, 2]) : [1, 2];
    return rank <= lim[0] ? C[conf][0] : (C[conf][1] && rank <= lim[1] ? C[conf][1] : null);
  }
  if (conf === "UEFA") {
    if (club.c === "RUS") return null;
    if (TOP5.includes(club.l)) return rank <= 4 ? CUPS.UEFA[0] : rank === 5 ? CUPS.UEFA[1] : rank === 6 ? CUPS.UEFA[2] : null;
    if (ligaInfo(club.l).pay >= 1.5 && club.s >= 62)
      return rank === 1 ? CUPS.UEFA[0] : rank <= 3 ? CUPS.UEFA[1] : rank === 4 ? CUPS.UEFA[2] : null;
    return null;
  }
  if (club.s < 56) return null;
  const lim = conf === "CONMEBOL" ? [4, 8] : conf === "AFC" ? [3, 5] : [2, 4];
  return rank <= lim[0] ? CUPS[conf][0] : rank <= lim[1] ? CUPS[conf][1] : null;
};

/* ---------------- Ereignisse ---------------- */
/* Spielst du noch bei dem Verein, um den es in der letzten Saison ging?
   Ohne diese Prüfung erzählen Nachwirkungs-Ereignisse vom alten Klub. */
/* Zeitliche Einordnung, damit Ereignisse in sinnvoller Reihenfolge kommen:
   1 Nachwirkung der Vorsaison · 2 Sommer und Vorbereitung
   3 Saisonverlauf · 4 Winter und Endspurt                              */
const PHASE_BY_TAG = {
  Nachwirkung:1, Treue:1,
  Vorbereitung:2, Vertrag:2, Transfer:2, Geschäft:2, Privat:2, Familie:2, Herkunft:2,
  Umfeld:2, Zukunft:2, Lifestyle:2, Alter:2, Nachwuchs:2, Leihe:2, Frauenfußball:2,
  Kabine:3, Konkurrenz:3, Taktik:3, Führung:3, Sportlich:3, Position:3, Körper:3,
  Land:3, Medien:3, Verein:3, Fans:3, Kurios:3, Risiko:3, Verletzung:3, Zwielichtig:3,
  Nationalteam:3, Europa:3, Unterhaus:3, Südamerika:3, Nordamerika:3, Asien:3,
  Afrika:3, Ozeanien:3, Osteuropa:3,
  Pokal:4, Aufstiegsrunde:4, Wechselfrage:4,
};
const phaseOf = (e) => e.ph || PHASE_BY_TAG[e.tag] || 3;

/* Was in einem großen Spiel zu deiner Position passt — ein Torhüter
   schießt keine Tore, ein Innenverteidiger legt selten zwei auf.       */
const HELD = {
  TW: ["hältst in der Nachspielzeit einen Elfmeter", "machst zwei Paraden, die niemand erklären kann",
       "hältst den Kasten sauber und wirst zum Spieler des Spiels gewählt"],
  IV: ["köpfst nach einer Ecke den Siegtreffer", "rettest zweimal auf der Linie",
       "gewinnst jeden Kopfball und hältst hinten alles zusammen"],
  AV: ["legst den Siegtreffer mit einer Flanke auf", "klärst kurz vor der Linie",
       "bereitest beide Treffer über deine Seite vor"],
  ZDM:["gewinnst jeden zweiten Ball und leitest den Siegtreffer ein",
       "hältst das Mittelfeld praktisch allein zusammen"],
  ZM: ["legst den Siegtreffer auf", "schlägst den Pass, über den danach alle reden",
       "bestimmst neunzig Minuten lang das Tempo"],
  ZOM:["machst den Siegtreffer", "legst zwei Treffer auf", "triffst und bereitest vor"],
  AF: ["machst den Siegtreffer", "legst zwei Treffer über deine Seite auf"],
  ST: ["machst den Siegtreffer", "triffst doppelt", "machst beide Tore"],
};
const heldentat = (p) => pick(HELD[p.pos] || HELD.ZM);
/* Und das Gegenstück, wenn es schiefgeht */
const patzer = {
  TW: "lässt einen haltbaren Ball durch die Hände rutschen",
  IV: "verursachst den Elfmeter zum Ausgleich",
  AV: "lässt deinen Gegenspieler zweimal davonziehen",
  ZDM:"verlierst den Ball vor dem Gegentor",
  ZM: "verlierst den Ball vor dem Gegentor",
  ZOM:"vergibst die beste Gelegenheit des Spiels",
  AF: "vergibst freistehend",
  ST: "vergibst zwei hundertprozentige Chancen",
};
const fehler = (p) => patzer[p.pos] || patzer.ZM;

/* Spielt der Spieler gerade bei dem Verein, den er sich gewünscht hat? */
const istTraum = (p) => !!p.traum && p.club && p.club.n === p.traum;

const lastS = (p) => p.seasons[p.seasons.length - 1] || null;
const sameClub = (p) => { const s = lastS(p); return !!s && s.club === p.club.n; };
const sameLeague = (p) => { const s = lastS(p); return !!s && s.league === p.club.l; };

const T = (s) => () => s;
const EVENTS = [
/* --- Nachwuchs --- */
{ id:"internat", tag:"Nachwuchs", w:4, cond:p=>p.age<=18, title:T("Du darfst mit ins Trainingslager"),
  text:c=>`Vier aus der Jugend dürfen mit zu den Profis, und du bist einer davon. Im Training stehst du plötzlich gegen ${c.mate.name}, der im Monat mehr verdient als dein Vater im Jahr.`,
  choices:[{label:"In jeder Einheit Vollgas",hint:"Auffallen, egal was es kostet",
    roll:[{p:.7,text:"Du machst dich jeden Tag komplett kaputt und stehst am nächsten Morgen trotzdem wieder da. Der Trainer merkt sich sowas.",fx:{trust:12,fitness:-9,phy:1,pot:2}},
          {p:.3,text:"Du hast es übertrieben. In der zweiten Woche reißt eine Muskelfaser. Lehrgeld bezahlt.",fx:{trust:4,fitness:-16,injuryProne:6}}]},
    {label:"Kräfte einteilen",hint:"Körper schonen",roll:[{p:1,text:"Du kommst ohne Blessuren durch, aber aufgefallen bist du niemandem.",fx:{fitness:4,trust:-3}}]}]},
{ id:"schule", tag:"Nachwuchs", w:3, cond:p=>p.age<=18, title:T("Prüfungen oder Trainingslager"),
  text:T("Deine Abschlussprüfungen liegen genau in der Vorbereitung. Beides gleichzeitig geht nicht, du musst dich entscheiden."),
  choices:[{label:"Abschluss machen",hint:"Was zum Vorzeigen, falls es nicht klappt",roll:[{p:1,text:"Du bestehst. Falls das mit dem Fußball nichts wird, hast du wenigstens was in der Hand.",fx:{trust:-8,morale:8,flag:"abschluss",legacy:6}}]},
    {label:"Alles auf Fußball setzen",hint:"Kein Plan B",roll:[{p:1,text:"Du fährst mit ins Trainingslager. Die Schule hakst du ab.",fx:{trust:10,pot:2,morale:-4}}]}]},
{ id:"heimweh", tag:"Nachwuchs", w:3, cond:p=>p.age<=19, title:T("Das erste Jahr im Internat"),
  text:T("Zweihundert Kilometer weg von zu Hause, Doppelzimmer, und sonntags ein Telefonat, das immer zu kurz ist."),
  choices:[{label:"Durchbeißen",hint:"",roll:[{p:1,text:"Nach vier Monaten ist es normal. Nach acht fühlt es sich an wie dein Zuhause.",fx:{morale:-6,trust:8,pot:1}}]},
    {label:"Jedes Wochenende heimfahren",hint:"Kostet Erholung",roll:[{p:1,text:"Vier Stunden Zug hin, vier zurück, jedes Wochenende. Montags bist du platt, aber du hältst durch.",fx:{morale:10,fitness:-8}}]}]},
{ id:"berater", tag:"Nachwuchs", w:3, cond:p=>p.age>=17&&p.age<=24&&!p.flags.berater, title:T("Eine Agentur meldet sich"),
  text:T("Eine der großen Beratungen will dich unter Vertrag nehmen. Acht Prozent Provision, dafür öffnen sie dir Türen, die sonst zubleiben."),
  choices:[{label:"Unterschreiben",hint:"Mehr Angebote",roll:[{p:1,text:"Ab jetzt klingelt in jedem Transferfenster ein anderes Telefon.",fx:{rep:10,flag:"berater"}}]},
    {label:"Beim Alten bleiben",hint:"Weniger Reichweite, mehr Vertrauen",roll:[{p:1,text:"Dein alter Jugendtrainer macht das weiter für dich. Langsamer, aber ehrlich.",fx:{morale:8,trust:4}}]}]},
{ id:"debut", tag:"Nachwuchs", w:4, cond:p=>p.age<=20&&p.tot.apps<5, title:T("Dein Profidebüt in der 84. Minute"),
  text:T("Deine Nummer leuchtet auf der Tafel auf. Du reißt dir das Leibchen über den Kopf und läufst raus. Sechs Minuten plus Nachspielzeit."),
  choices:[{label:"Sofort das Risiko suchen",hint:"",roll:[{p:.5,text:"Erster Ballkontakt, du gehst ins Dribbling und holst einen Elfmeter raus. Jetzt kennt das ganze Stadion deinen Namen.",fx:{rep:10,trust:10,form:12,morale:12}},
    {p:.5,text:"Ballverlust in der eigenen Hälfte, daraus fällt das 1:2. Die Nacht wird lang.",fx:{trust:-8,morale:-12,form:-8}}]},
    {label:"Einfach nichts falsch machen",hint:"",roll:[{p:1,text:"Sieben Ballkontakte, sechs Querpässe. Unauffällig, aber du bist angekommen.",fx:{trust:4,morale:8}}]}]},
/* --- Kabine und Konkurrenz --- */
{ id:"rivale", tag:"Konkurrenz", w:5, rep:5, cond:p=>!!p.rival, title:c=>`${c.rival.name} steht dir im Weg`,
  text:c=>`${c.rival.name} ist ${c.rival.age}, hat eine Stärke von ${c.rival.ovr} und spielt genau deine Position. Der Trainer hält zu ihm. Ihr passt nicht beide in die Startelf.`,
  choices:[{label:"Im Training angreifen",hint:"Direktes Duell suchen",
    roll:[{p:.5,text:"Du drehst drei Wochen lang komplett frei. Der Trainer stellt um, und du beginnst.",fx:{trust:16,form:10,fitness:-6}},
          {p:.5,text:"Du willst zu viel und wirkst verkrampft. Es ändert sich nichts.",fx:{form:-10,fitness:-6,morale:-6}}]},
    {label:"Nach einer anderen Position fragen",hint:"Ausweichen statt kämpfen",roll:[{p:1,text:"Der Trainer probiert dich woanders aus. Neue Aufgabe, neuer Anlauf.",fx:{repos:true,trust:6,form:-8}}]},
    {label:"Abwarten",hint:"Geduld haben",roll:[{p:.45,text:"Im Winter verletzt er sich. Deine Tür geht auf.",fx:{trust:10,form:8}},{p:.55,text:"Er bleibt fit und spielt jedes Spiel durch.",fx:{morale:-10,form:-5}}]}]},
{ id:"abend", tag:"Kabine", w:3, rep:4, cond:p=>p.seasons.length>=1&&p.tot.apps>=6, title:T("Mannschaftsabend nach dem Auswärtssieg"),
  text:c=>`${c.mate.name} hat einen Tisch reserviert. Das nächste Spiel ist erst in fünf Tagen.`,
  choices:[{label:"Mitgehen",hint:"Gut für die Kabine, schlecht für die Beine",
    roll:[{p:.8,text:"Danach gehörst du richtig dazu. Das Dienstagstraining war allerdings zäh.",fx:{morale:10,trust:6,fitness:-7}},
          {p:.2,text:"Irgendwer filmt mit. Am Montag steht ihr in der Zeitung.",fx:{morale:2,rep:8,trust:-12,fitness:-8}}]},
    {label:"Früh ins Hotel",hint:"Profi bleibt Profi",roll:[{p:1,text:"Am Dienstag bist du der Frischeste auf dem Platz. Gemerkt hat es sonst keiner.",fx:{fitness:6,morale:-4}}]}]},
{ id:"mentor", tag:"Kabine", w:3, cond:p=>p.age<=23, title:c=>`${c.vet.name} nimmt dich unter seine Fittiche`,
  text:c=>`${c.vet.name} ist ${c.vet.age} und bietet dir an, nach dem Training noch eine Stunde dranzuhängen. Videos schauen, Stellungsspiel, lauter Kleinkram.`,
  choices:[{label:"Jede Woche mitmachen",hint:"Kostet Zeit, bringt Verständnis",roll:[{p:1,text:"Er zeigt dir Sachen, die dir kein Trainer erklärt, weil sie zu selbstverständlich klingen.",fx:{pas:2,def:2,pot:2,morale:5}}]},
    {label:"Dankend ablehnen",hint:"",roll:[{p:1,text:"Du machst dein eigenes Ding. Geht auch.",fx:{morale:4}}]}]},
{ id:"streit", tag:"Kabine", w:3, rep:6, cond:p=>p.age>=21, title:c=>`Krach mit ${c.star.name}`,
  text:c=>`${c.star.name} hat dich vor der ganzen Mannschaft zusammengefaltet. Zu Unrecht, findest du.`,
  choices:[{label:"Ihn direkt zur Rede stellen",hint:"Klärt es oder macht es schlimmer",
    roll:[{p:.55,text:"Fünf Minuten lang wird es laut, danach habt ihr Respekt voreinander. Ab jetzt läuft es zwischen euch.",fx:{trust:10,morale:8,form:6}},
          {p:.45,text:"Es eskaliert bis zum Trainer, und der stellt sich hinter seinen Star.",fx:{trust:-16,morale:-12}}]},
    {label:"Runterschlucken",hint:"",roll:[{p:1,text:"Du sagst nichts dazu. Es nagt trotzdem an dir.",fx:{morale:-8,form:-4}}]}]},
{ id:"talent", tag:"Kabine", w:3, cond:p=>p.age>=27, title:T("Der Siebzehnjährige"),
  text:c=>`${c.young.name} spielt deine Position, ist schneller als du und macht sich über deine Musik lustig.`,
  choices:[{label:"Ihn mitziehen",hint:"Er spielt sowieso irgendwann",roll:[{p:1,text:"Du zeigst ihm alles, was du weißt. Zwei Jahre später bedankt er sich bei seiner ersten großen Pressekonferenz namentlich bei dir.",fx:{rep:9,morale:8,trust:8,legacy:8}}]},
    {label:"Auf Abstand halten",hint:"Konkurrenz bleibt Konkurrenz",roll:[{p:1,text:"Die Kabine kriegt das mit. Spielen tut er am Ende trotzdem.",fx:{trust:-10,morale:-6,form:4}}]}]},
{ id:"kapitaen", tag:"Führung", w:3, cond:p=>p.age>=24&&p.trust>=60&&!p.flags.kapitaen, title:T("Die Binde"),
  text:T("Der Kapitän ist weg, und der Trainer fragt, ob du übernehmen willst."),
  choices:[{label:"Binde nehmen",hint:"Verantwortung und Aufmerksamkeit",roll:[{p:1,text:"Ab jetzt stehst du vor der Kurve, wenn es schiefläuft. Und wenn es gut läuft, natürlich auch.",fx:{rep:12,trust:12,morale:8,flag:"kapitaen",legacy:10}}]},
    {label:"Ablehnen",hint:"Kopf frei behalten",roll:[{p:1,text:"Du spielst lieber Fußball, als Pressekonferenzen zu geben.",fx:{form:5,trust:-6}}]}]},
{ id:"mannschaftsrat", tag:"Kabine", w:2, cond:p=>p.age>=25, title:T("Der Mannschaftsrat will den Trainer kippen"),
  text:T("Drei Spieler wollen zum Sportdirektor gehen und den Trainer loswerden. Sie fragen, ob du mitkommst."),
  choices:[{label:"Mitgehen",hint:"Riskant",roll:[{p:.5,text:"Der Trainer wird entlassen. Sein Nachfolger weiß, wer dahintersteckte, und schätzt es, wenn jemand Klartext redet.",fx:{trust:8,rep:6,morale:6}},
    {p:.5,text:"Der Verein stellt sich hinter den Trainer. Du stehst jetzt auf einer Liste.",fx:{trust:-22,morale:-10}}]},
    {label:"Raushalten",hint:"",roll:[{p:1,text:"Du sagst, du spielst für jeden Trainer. Beide Seiten finden das feige und respektieren es gleichzeitig.",fx:{trust:4}}]}]},
{ id:"neuzugang", tag:"Kabine", w:3, rep:5, cond:p=>p.seasons.length>=1, title:T("Ein Neuzugang für 30 Millionen"),
  text:c=>`${c.rivalOrMate} kommt für eine Rekordablöse und spielt genau da, wo du spielst. Die Presse will von dir wissen, was du davon hältst.`,
  choices:[{label:"Ihn willkommen heißen",hint:"",roll:[{p:1,text:"Du holst ihn vom Flughafen ab. Er bedankt sich später mit Vorlagen.",fx:{trust:8,morale:6,form:5}}]},
    {label:"Eine Ansage machen",hint:"",roll:[{p:.45,text:"Du sagst in der Kabine klar, wem der Platz gehört. Er nimmt es hin.",fx:{trust:6,form:8,rep:5}},
      {p:.55,text:"Es kommt als Arroganz an. Der Trainer bringt ihn und nicht dich.",fx:{trust:-14,form:-8}}]}]},
{ id:"trainingsstreik", tag:"Kabine", w:2, cond:p=>p.morale<45, title:T("Die Mannschaft will die Sondereinheit boykottieren"),
  text:T("Nach der vierten Niederlage setzt der Trainer am freien Tag ein Zusatztraining an. Die halbe Mannschaft will nicht hingehen."),
  choices:[{label:"Trotzdem hingehen",hint:"",roll:[{p:1,text:"Ihr seid zu acht auf dem Platz. Der Trainer vergisst das nicht.",fx:{trust:16,fitness:-5,morale:-4}}]},
    {label:"Solidarisch fernbleiben",hint:"",roll:[{p:1,text:"Der Verein verhängt Geldstrafen. Dafür hält die Kabine zusammen.",fx:{money:-.08,trust:-12,morale:8}}]}]},
/* --- Medien --- */
{ id:"boulevard", tag:"Medien", w:3, rep:6, cond:p=>p.rep>=32&&p.tot.apps>=15, title:T("Eine Zeitung will ein Exklusivinterview"),
  text:c=>`Ein Boulevardblatt zahlt richtig gut für ein Gespräch über den Streit zwischen Trainer und ${c.star.name}. Du warst dabei, als es passiert ist.`,
  choices:[{label:"Auspacken",hint:"Geld und Schlagzeilen",
    roll:[{p:.6,text:"Die Titelseite gehört dir. Dafür redet die Kabine drei Wochen lang nicht mit dir.",fx:{money:.6,rep:14,trust:-18,morale:-8}},
          {p:.4,text:"Sie drehen dir zwei Sätze im Mund um. Jetzt bist du der Unruhestifter.",fx:{money:.6,rep:6,trust:-24,morale:-12}}]},
    {label:"Ablehnen",hint:"Was in der Kabine passiert, bleibt da",roll:[{p:1,text:"Es spricht sich rum, dass du nicht geredet hast. Ab da darfst du im Bus vorne sitzen.",fx:{trust:10,morale:5,rep:-3}}]}]},
{ id:"kritik", tag:"Medien", w:3, rep:5, cond:p=>p.lastNote>3.7&&p.age>=22, title:T("Ein Experte zerlegt dich im Fernsehen"),
  text:T("Zehn Minuten lang analysiert er im Standbild, wie du beim Umschalten stehst. Ärgerlich ist vor allem, dass nichts davon erfunden ist."),
  choices:[{label:"Annehmen und dran arbeiten",hint:"",roll:[{p:1,text:"Du schaust dir den Beitrag dreimal an. Beim vierten Mal machst du dir Notizen.",fx:{def:2,pas:1,morale:-6,note:.12}}]},
    {label:"Öffentlich zurückschießen",hint:"",roll:[{p:1,text:"Deine Antwort geht viral. Das Problem auf dem Platz ist damit trotzdem nicht gelöst.",fx:{rep:10,morale:4,trust:-6}}]}]},
{ id:"doku", tag:"Medien", w:2, cond:p=>p.rep>=55, title:T("Ein Streamingdienst will eine Doku über dich drehen"),
  text:T("Ein Jahr lang Kamera dabei, auch zu Hause, auch nach Niederlagen. Es gibt viel Geld und wenig Rückzugsraum."),
  choices:[{label:"Zusagen",hint:"",roll:[{p:.6,text:"Die Serie läuft gut, und du kommst darin sympathisch rüber. Neue Werbepartner melden sich.",fx:{money:1.8,rep:18,morale:-5}},
    {p:.4,text:"Sie schneiden dich als arroganten Typen. Der Ruf hängt dir jahrelang nach.",fx:{money:1.8,rep:-10,morale:-12}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Du sagst ihnen, privat bleibt privat.",fx:{morale:5}}]}]},
{ id:"presseeklat", tag:"Medien", w:2, cond:p=>p.age>=22, title:T("Pressekonferenz nach dem 0:4"),
  text:T("Der Reporter stellt dreimal dieselbe Frage. Beim dritten Mal reicht es dir."),
  choices:[{label:"Aufstehen und gehen",hint:"",roll:[{p:1,text:"Das Video läuft überall. Die Fans finden es stark, der Verein deutlich weniger.",fx:{rep:9,trust:-8,money:-.05}}]},
    {label:"Ruhig bleiben",hint:"",roll:[{p:1,text:"Du antwortest ein viertes Mal. Der Verein ist froh, dass du nicht ausgerastet bist.",fx:{trust:7,rep:2}}]},
    {label:"Die Mannschaft schützen",hint:"",roll:[{p:1,text:"Du nimmst alles auf deine Kappe. Die Kabine kriegt das mit.",fx:{trust:12,morale:-4,rep:6}}]}]},
{ id:"socialmedia", tag:"Medien", w:3, rep:5, cond:p=>p.age>=17, title:T("Nachts ein Like, das keiner hätte sehen sollen"),
  text:T("Um 2:14 Uhr, ohne groß nachzudenken. Screenshots gibt es innerhalb von Minuten."),
  choices:[{label:"Kommentarlos löschen",hint:"",roll:[{p:1,text:"Zu spät, aber nach zwei Tagen redet keiner mehr davon.",fx:{rep:-5,morale:-3}}]},
    {label:"Erklären",hint:"",roll:[{p:.6,text:"Deine Erklärung klingt ehrlich, und das Thema ist erledigt.",fx:{rep:3}},{p:.4,text:"Durch die Erklärung wird alles nur noch schlimmer.",fx:{rep:-10,morale:-6}}]},
    {label:"Konto löschen",hint:"",roll:[{p:1,text:"Ein halbes Jahr lang hast du deine Ruhe. Deine Sponsoren finden das nicht so gut.",fx:{rep:-8,morale:10,money:-.15}}]}]},
{ id:"ghostwriter", tag:"Medien", w:2, cond:p=>p.age>=29&&p.rep>=55, title:T("Ein Verlag will deine Autobiografie"),
  text:T("Interessant wird das Buch aber nur, wenn du auch über andere schreibst."),
  choices:[{label:"Ehrlich schreiben",hint:"",roll:[{p:1,text:"Es verkauft sich gut und kostet dich zwei Freundschaften.",fx:{money:1.2,rep:12,trust:-12}}]},
    {label:"Höflich bleiben",hint:"",roll:[{p:1,text:"Ein nettes Buch, das niemand liest.",fx:{money:.25,rep:3}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Vielleicht später mal.",fx:{}}]}]},
{ id:"schiri", tag:"Medien", w:2, rep:6, cond:p=>p.age>=20, title:T("Im Spielertunnel eskaliert es"),
  text:T("Glasklarer Elfmeter, kein Pfiff. Nach dem Abpfiff sagst du dem Schiedsrichter im Tunnel deine Meinung. Das Mikro läuft noch."),
  choices:[{label:"Öffentlich entschuldigen",hint:"Kürzere Sperre",roll:[{p:1,text:"Zwei Spiele Sperre statt fünf.",fx:{rep:2,ban2:2,morale:-4}}]},
    {label:"Dazu stehen",hint:"",roll:[{p:1,text:"Fünf Spiele Sperre und ein Kultstatus, den du gar nicht wolltest.",fx:{rep:12,ban2:5,trust:-8}}]}]},
{ id:"legende", tag:"Medien", w:2, cond:p=>p.peakOvr>=82, title:T("Eine alte Legende nennt dich überbewertet"),
  text:T("Ein ehemaliger Weltmeister sagt in einem Podcast, in seiner Generation hättest du nicht gespielt."),
  choices:[{label:"Auf dem Platz antworten",hint:"",roll:[{p:.65,text:"Drei Scorerpunkte in zwei Wochen. Er nimmt es öffentlich zurück.",fx:{form:14,rep:9,morale:8}},
    {p:.35,text:"Du willst es zu sehr erzwingen und triffst gar nichts.",fx:{form:-12,morale:-8}}]},
    {label:"Ihn einfach anrufen",hint:"",roll:[{p:1,text:"Zwanzig Minuten am Telefon, danach ist er dein größter Fürsprecher.",fx:{rep:7,morale:7,pas:1}}]}]},
/* --- Sportliches und Taktik --- */
{ id:"umbau", tag:"Taktik", w:3, cond:p=>p.age>=19&&p.pos!=="TW"&&!p.flags.umgeschult, title:T("Der Trainer will dich umbauen"),
  text:T("Er sieht dich auf einer anderen Position. Neue Aufgaben, neue Laufwege, und du fängst wieder bei null an."),
  choices:[{label:"Umschulung mitmachen",hint:"",roll:[{p:1,text:"Eine halbe Saison lang fühlt es sich falsch an. Danach, als wärst du nie woanders gewesen.",fx:{repos:true,trust:10,form:-12}}]},
    {label:"Auf deiner Position bleiben",hint:"",roll:[{p:1,text:"Er akzeptiert das. Merken wird er es sich trotzdem.",fx:{trust:-12}}]}]},
{ id:"trainerwechsel", tag:"Taktik", w:4, rep:4, cond:p=>p.age>=19, title:T("Neuer Trainer, neues System"),
  text:T("Der Neue spielt komplett anders als sein Vorgänger. Und er hat eigene Leute mitgebracht."),
  choices:[{label:"Voll auf ihn einlassen",hint:"",roll:[{p:.75,text:"Nach acht Wochen bist du sein Mann für die Umschaltmomente.",fx:{trust:14,form:6,pas:1}},
    {p:.25,text:"Du machst alles genau so, wie er es will, und spielst trotzdem nicht.",fx:{trust:4,morale:-10,form:-8}}]},
    {label:"Dein eigenes Spiel durchziehen",hint:"",roll:[{p:.4,text:"Zwei Tore in drei Spielen. Damit ist die Diskussion beendet.",fx:{form:12,trust:6,rep:6}},
      {p:.6,text:"Er stellt dich wochenlang ab.",fx:{trust:-18,form:-10,morale:-8}}]}]},
{ id:"elfer", tag:"Sportlich", w:3, cond:p=>!["TW","IV"].includes(p.pos)&&!p.flags.elfer, title:T("Wer schießt jetzt die Elfmeter?"),
  text:c=>`Der bisherige Schütze ist weg. Der Trainer fragt in die Runde, und ${c.mate.name} schaut demonstrativ zur Seite.`,
  choices:[{label:"Melden",hint:"Mehr Tore, aber auch mehr Risiko",roll:[{p:.72,text:"Sieben von acht sitzen. Der Job gehört dir.",fx:{sho:2,rep:7,form:6,penalty:true}},
    {p:.28,text:"Zwei verschossen in vier Wochen, einer davon im Pokal. Das war es dann.",fx:{form:-12,rep:-5,morale:-8}}]},
    {label:"Lieber nicht",hint:"",roll:[{p:1,text:"Jemand anders übernimmt. Auch gut.",fx:{}}]}]},
{ id:"standards", nopos:["TW"], tag:"Sportlich", w:2, cond:p=>!p.flags.standards&&p.attrs.pas>=62, title:T("Standards übernehmen"),
  text:T("Der Standardtrainer will dich als Schützen für ruhende Bälle. Das heißt Zusatzarbeit nach jedem Training."),
  choices:[{label:"Übernehmen",hint:"",roll:[{p:1,text:"Hundert Flanken pro Woche. Ab der Rückrunde kommt jede zweite genau da an, wo sie hin soll.",fx:{pas:3,fitness:-4,flag:"standards"}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du hast genug um die Ohren.",fx:{}}]}]},
{ id:"bank", tag:"Sportlich", w:4, rep:4, cond:p=>["bench","tribune"].includes(p.role), title:T("Vierter Monat ohne Startelf"),
  text:T("Du trainierst gut und spielst trotzdem nicht. Der Trainer redet nicht mit dir darüber."),
  choices:[{label:"Wechselwunsch öffentlich machen",hint:"Macht eine Tür auf und eine zu",roll:[{p:1,text:"Der Verein bestätigt, dass es Gespräche gibt. Der Trainer grüßt dich nicht mehr.",fx:{trust:-20,rep:5}}]},
    {label:"Weiter Gas geben",hint:"",roll:[{p:.5,text:"Der vor dir verletzt sich, du kommst rein und bleibst drin.",fx:{trust:16,form:12}},
      {p:.5,text:"Es passiert einfach nichts. Die Saison ist weg.",fx:{morale:-14,form:-8,trust:6}}]}]},
{ id:"leihe", tag:"Sportlich", w:3, cond:p=>p.age<=22&&p.club.s-p.ovr>=8, title:T("Verleihen lassen oder bleiben?"),
  text:T("Der Verein hat drei Anfragen auf dem Tisch. Alle drei Klubs sind kleiner, alle drei garantieren dir Spielzeit."),
  choices:[{label:"Verleihen lassen",hint:"",roll:[{p:1,text:"Ein Jahr, in dem du jede Woche neunzig Minuten machst, statt sie dir von draußen anzuschauen.",fx:{wantLoan:true}}]},
    {label:"Hierbleiben",hint:"",roll:[{p:1,text:"Jeden Tag gegen Weltklasse trainieren und sonntags zuschauen.",fx:{pot:2,form:-6}}]}]},
{ id:"videoanalyse", tag:"Sportlich", w:3, rep:4, cond:p=>p.seasons.length>=1, title:T("Der Analyst bietet Einzelsitzungen an"),
  text:T("Zwei Stunden pro Woche vor dem Bildschirm. Klingt öde, soll aber angeblich viel bringen."),
  choices:[{label:"Regelmäßig hingehen",hint:"",roll:[{p:1,text:"Du siehst plötzlich Räume, an denen du vorher einfach vorbeigelaufen bist.",fx:{pas:2,def:1,note:.1,morale:-2}}]},
    {label:"Lieber auf den Platz",hint:"",roll:[{p:1,text:"Du übst lieber, als dir Videos anzuschauen.",fx:{dri:1,sho:1}}]}]},
{ id:"derbytor", nopos:["TW"], tag:"Sportlich", w:4, rep:4, cond:p=>p.age>=19&&p.tot.apps>=10, title:T("Derbywoche"),
  text:T("Das Stadion ist seit Wochen ausverkauft. Der Trainer sagt, es sei auch nur ein Spiel. Das glaubt ihm keiner."),
  choices:[{label:"Alles riskieren",hint:"",roll:[{p:.5,text:"Du triffst zum 1:0 und rennst zur Kurve. Diesen Moment nimmt dir keiner mehr weg.",fx:{rep:12,morale:16,form:12}},
    {p:.5,text:"Gelb-Rot in der 61. Minute, am Ende verliert ihr 0:3.",fx:{ban2:1,morale:-14,trust:-10,rep:-6}}]},
    {label:"Fehlerfrei bleiben",hint:"",roll:[{p:1,text:"Ein sauberes, unauffälliges Derby. Am Ende 0:0.",fx:{trust:5,note:.06}}]}]},
{ id:"fitnesstest", tag:"Sportlich", w:3, rep:4, cond:p=>p.fitness<74&&p.age>=22, title:T("Die Leistungsdiagnostik ist eindeutig"),
  text:T("Deine Ausdauerwerte sind die schlechtesten im ganzen Kader. Der Athletiktrainer legt dir das Blatt wortlos hin."),
  choices:[{label:"Sonderschichten annehmen",hint:"",roll:[{p:1,text:"Vier Wochen lang früher da und später weg. Beim nächsten Test liegst du im Mittelfeld.",fx:{fitness:16,phy:2,pac:1,morale:-6}}]},
    {label:"Die Zahlen anzweifeln",hint:"",roll:[{p:1,text:"Du diskutierst über die Messmethode. Die Werte bleiben trotzdem, wie sie sind.",fx:{trust:-8,fitness:-3}}]}]},
{ id:"winterlager", tag:"Sportlich", w:3, rep:4, cond:p=>p.seasons.length>=1, title:T("Trainingslager im Januar"),
  text:T("Zehn Tage Doppeleinheiten. Der Trainer nennt es Grundlagenarbeit, die Mannschaft nennt es anders."),
  choices:[{label:"Bei den Läufen vorne mitlaufen",hint:"",roll:[{p:1,text:"Du gewinnst zwei von drei Läufen. In die Rückrunde startest du in der Startelf.",fx:{fitness:12,phy:1,trust:10,morale:-4}}]},
    {label:"Kräfte einteilen",hint:"",roll:[{p:1,text:"Du kommst gesund raus, aber auch nicht besser.",fx:{fitness:4,injuryProne:-3}}]}]},
/* --- Verletzung und Körper --- */
{ id:"derbyrisiko", tag:"Risiko", w:3, rep:5, cond:p=>p.age>=20, title:T("Angeschlagen vor dem wichtigsten Spiel"),
  text:T("Der Arzt sagt, es kann halten oder reißen, das weiß man vorher nicht. Der Trainer sagt gar nichts und schaut dich nur an."),
  choices:[{label:"Spielen",hint:"",roll:[{p:.62,text:"Du spielst durch und ihr gewinnt. Die nächsten zwei Tage kommst du keine Treppe hoch.",fx:{trust:14,rep:5,fitness:-10,injuryProne:5}},
    {p:.38,text:"Nach 27 Minuten ist Schluss. Es hat gerissen.",fx:{forceInjury:"mittel",trust:6}}]},
    {label:"Passen",hint:"",roll:[{p:1,text:"Du sitzt im Anzug auf der Bank und schaust zu, wie die Mannschaft verliert.",fx:{trust:-11,morale:-5,fitness:6}}]}]},
{ id:"comeback", tag:"Verletzung", w:6, cond:p=>p.flags.schwereVerletzung, title:T("Zurück nach der langen Verletzung"),
  text:T("Der Arzt gibt dich frei. Der Kopf ist noch nicht ganz so weit, und das Knie fühlt sich fremd an."),
  choices:[{label:"Sofort voll belasten",hint:"",roll:[{p:.5,text:"Es hält. Nach sechs Wochen ist alles wieder wie vorher.",fx:{form:8,fitness:-5,clearInjuryFlag:true}},
    {p:.5,text:"Rückfall. Nochmal vier Monate raus.",fx:{forceInjury:"schwer",morale:-18}}]},
    {label:"Den Stufenplan einhalten",hint:"",roll:[{p:1,text:"Zehn Wochen Aufbau, dann wieder Startelf. Und nichts geht dabei kaputt.",fx:{fitness:10,injuryProne:-8,form:-6,clearInjuryFlag:true}}]}]},
{ id:"spezialist", tag:"Verletzung", w:2, cond:p=>p.injuryProne>=55, title:T("Zweitmeinung bei einem Spezialisten"),
  text:T("Er könnte das wiederkehrende Problem operativ lösen. Vier Monate raus, danach soll angeblich Ruhe sein."),
  choices:[{label:"Operieren lassen",hint:"Teuer und langwierig",roll:[{p:.75,text:"Vier zähe Monate. Danach ist das Ziehen tatsächlich weg.",fx:{injuryProne:-26,money:-.25,fitness:-14,forceInjury:"mittel"}},
    {p:.25,text:"Die Operation bringt nichts. Vier Monate umsonst.",fx:{money:-.25,forceInjury:"mittel",morale:-14}}]},
    {label:"Ohne OP weitermachen",hint:"",roll:[{p:1,text:"Tapen, spritzen, weiterspielen. Wie immer.",fx:{injuryProne:4,fitness:3}}]}]},
{ id:"schlaf", tag:"Körper", w:2, cond:p=>p.age>=21&&!p.flags.schlaf, title:T("Der Verein stellt einen Schlafcoach ein"),
  text:T("Neue Abteilung, viele Sensoren, klingt erstmal albern. Angeblich ist es der größte Hebel überhaupt."),
  choices:[{label:"Voll mitmachen",hint:"",roll:[{p:1,text:"Nach drei Monaten schläfst du fast eine Stunde länger pro Nacht. Das merkst du in der 85. Minute.",fx:{injuryProne:-10,fitness:9,phy:1,flag:"schlaf"}}]},
    {label:"Kein Interesse",hint:"",roll:[{p:1,text:"Du schläfst weiter so, wie du willst.",fx:{}}]}]},
{ id:"hitze", tag:"Körper", w:2, rep:5, cond:p=>p.seasons.length>=1, title:T("Saisonstart bei 34 Grad"),
  text:T("Anpfiff um halb vier, weil die Übertragung es so will. Auf dem Rasen steht die Luft."),
  choices:[{label:"Trotzdem hoch pressen",hint:"",roll:[{p:.6,text:"Ihr gewinnt, weil der Gegner noch früher einbricht als ihr.",fx:{form:8,fitness:-9,trust:7}},
    {p:.4,text:"Krampf in der 63. Minute, du musst runter.",fx:{fitness:-14,form:-6}}]},
    {label:"Tempo rausnehmen",hint:"",roll:[{p:1,text:"Ein zähes 1:1 bei brütender Hitze.",fx:{fitness:-3}}]}]},
{ id:"gehirn", tag:"Verletzung", w:2, rep:6, cond:p=>p.age>=20, title:T("Kopfballduell mit Nachwirkungen"),
  text:T("Du warst kurz weggetreten. Der Arzt will dich rausnehmen, du fühlst dich aber schon wieder klar."),
  choices:[{label:"Sofort runtergehen",hint:"",roll:[{p:1,text:"Protokoll eingehalten, eine Woche Pause. Vernünftig.",fx:{fitness:-3,trust:-3,morale:3}}]},
    {label:"Weiterspielen",hint:"",roll:[{p:.55,text:"Es geht gut. Du hast Glück gehabt.",fx:{trust:8,rep:4}},
      {p:.45,text:"Am nächsten Tag Kopfschmerzen. Sechs Wochen Pause und eine sehr unangenehme Diskussion.",fx:{forceInjury:"leicht",rep:-4,morale:-10,injuryProne:6}}]}]},
{ id:"reha", tag:"Verletzung", w:3, rep:5, cond:p=>p.fitness<60, title:T("Der Verein schickt dich für eine Woche in die Reha"),
  text:T("Eine Woche Klinik statt Mannschaftstraining. Fühlt sich an, als hätte man dich aussortiert."),
  choices:[{label:"Hinfahren",hint:"",roll:[{p:1,text:"Sieben Tage Ruhe, Massage und ein vernünftiger Ernährungsplan. Du kommst wie ausgewechselt zurück.",fx:{fitness:18,injuryProne:-6,morale:5}}]},
    {label:"Beim Team bleiben",hint:"",roll:[{p:1,text:"Du trainierst mit und bleibst müde.",fx:{trust:4,fitness:-5}}]}]},
/* --- Vertrag und Transfer --- */
{ id:"ablösefrei", tag:"Vertrag", w:3, cond:p=>p.contract<=1&&p.age>=22, title:T("Ablösefrei gehen oder verlängern?"),
  text:T("Dein Vertrag läuft aus. Dein Berater sagt, du sollst warten. Der Sportdirektor will jetzt eine Entscheidung."),
  choices:[{label:"Auslaufen lassen",hint:"Handgeld statt Sicherheit",roll:[{p:1,text:"Ab Januar darfst du frei verhandeln. Das Handgeld wird ordentlich.",fx:{money:1.6,freeAgent:true,trust:-8}}]},
    {label:"Jetzt verlängern",hint:"",roll:[{p:1,text:"Zwei Jahre mehr und etwas mehr Gehalt.",fx:{extend:2,trust:10,morale:6}}]}]},
{ id:"ausstieg", tag:"Vertrag", w:2, cond:p=>p.ovr>=76&&p.age<=28, title:T("Streit um die Ausstiegsklausel"),
  text:T("Der Verein will verlängern. Dein Berater besteht auf einer Klausel, der Sportdirektor will davon nichts wissen."),
  choices:[{label:"Auf der Klausel bestehen",hint:"",roll:[{p:.6,text:"Sie geben nach. Ab jetzt bist du für einen festen Preis zu haben.",fx:{extend:3,flag:"klausel",trust:-6}},
    {p:.4,text:"Die Gespräche platzen komplett. Du stehst ohne neuen Vertrag da.",fx:{trust:-14,freeAgent:true}}]},
    {label:"Ohne Klausel unterschreiben",hint:"",roll:[{p:1,text:"Vier Jahre, gutes Gehalt, keine Hintertür.",fx:{extend:4,trust:14,morale:8}}]}]},
{ id:"traumverein", tag:"Transfer", w:3, cond:p=>p.ovr>=80&&p.age<=30&&!p.flags.traumklub, title:T("Der Anruf, auf den man wartet"),
  text:T("Der Trainer eines der größten Klubs Europas ruft dich persönlich an. Ohne Berater, ohne Verein, einfach so."),
  choices:[{label:"Offen sein",hint:"",roll:[{p:1,text:"Es gibt jetzt eine Verbindung, die sich um keine Ablösesumme schert.",fx:{dreamOffer:true,flag:"traumklub",morale:10}}]},
    {label:"Höflich abblocken",hint:"",roll:[{p:1,text:"Du sagst, du fühlst dich hier wohl. Ihr wisst beide, dass das nicht ganz stimmt.",fx:{trust:10,morale:5}}]}]},
{ id:"rueckkehr", tag:"Transfer", w:2, cond:p=>p.age>=29&&p.seasons.length>=6, title:T("Dein Jugendverein fragt an"),
  text:T("Dein alter Ausbildungsklub spielt inzwischen zwei Ligen tiefer. Ums Geld geht es dabei erkennbar nicht."),
  choices:[{label:"Für später zusagen",hint:"",roll:[{p:1,text:"Ihr verabredet euch für das Ende deiner Karriere. Alle finden die Idee schön.",fx:{morale:12,rep:8,flag:"rueckkehr",legacy:12}}]},
    {label:"Nichts versprechen",hint:"",roll:[{p:1,text:"Du sagst, man werde sehen.",fx:{}}]}]},
{ id:"sportdirektor", tag:"Vertrag", w:2, cond:p=>p.age>=26, title:T("Neuer Sportdirektor, alte Vorbehalte"),
  text:T("Der Neue hat dich nicht geholt und macht auch keinen Hehl daraus. Dein Vertrag läuft aber noch."),
  choices:[{label:"Ihn überzeugen",hint:"",roll:[{p:.55,text:"Nach einer halben Saison sagt er öffentlich, er habe sich geirrt.",fx:{trust:12,form:8,rep:5}},
    {p:.45,text:"Er bleibt bei seiner Meinung, egal was du machst.",fx:{trust:-14,morale:-10}}]},
    {label:"Den Vertrag aussitzen",hint:"",roll:[{p:1,text:"Du kassierst dein Gehalt und wartest ihn einfach aus. Sauber ist das, schön nicht.",fx:{morale:-8,money:.1}}]}]},
{ id:"beraterwechsel", tag:"Vertrag", w:2, cond:p=>p.flags.berater&&p.age>=25, title:T("Deine Agentur wird verkauft"),
  text:T("Ein Investmentfonds übernimmt. Dein bisheriger Betreuer ist weg, du bekommst einen neuen zugeteilt."),
  choices:[{label:"Agentur wechseln",hint:"",roll:[{p:1,text:"Neue Agentur, neuer Ansprechpartner und ein paar Wochen Chaos.",fx:{money:-.2,rep:3}}]},
    {label:"Bleiben",hint:"",roll:[{p:.6,text:"Der Neue ist deutlich besser als der Alte.",fx:{rep:8}},{p:.4,text:"Er kümmert sich, wenn er Zeit hat. Hat er selten.",fx:{rep:-6,morale:-5}}]}]},
{ id:"treuepraemie", tag:"Vertrag", w:2, cond:p=>p.seasons.filter(s=>s.club===p.club.n).length>=5, title:T("Treueprämie statt Gehaltserhöhung"),
  text:T("Fünf Jahre beim selben Verein. Der Klub bietet dir eine einmalige Prämie an, statt das Gehalt anzuheben."),
  choices:[{label:"Prämie nehmen",hint:"",roll:[{p:1,text:"Einmal richtig was auf dem Konto, dafür bleibt das Gehalt, wie es ist.",fx:{money:.9,morale:6}}]},
    {label:"Mehr Gehalt fordern",hint:"",roll:[{p:.55,text:"Sie geben nach. Dauerhaft mehr auf dem Konto.",fx:{extend:2,trust:-4,morale:8}},
      {p:.45,text:"Sie ziehen das Angebot komplett zurück.",fx:{trust:-10,morale:-8}}]}]},
/* --- Nationalmannschaft --- */
{ id:"ntdebut", tag:"Nationalteam", w:5, cond:p=>p.nt.level==="A"&&p.nt.caps<=4, title:T("Erste Nominierung für die A-Nationalmannschaft"),
  text:T("Der Umschlag liegt in deinem Spind. Ein Freundschaftsspiel, wahrscheinlich zwanzig Minuten Einsatzzeit."),
  choices:[{label:"Die Familie einfliegen lassen",hint:"",roll:[{p:1,text:"Sie stehen alle auf der Tribüne, als du in der 71. reinkommst. An mehr wirst du dich später nicht erinnern.",fx:{morale:18,money:-.2,rep:6}}]},
    {label:"Nüchtern durchziehen",hint:"",roll:[{p:1,text:"Du machst deine zwanzig Minuten ordentlich runter. Der Trainer nickt dir zu.",fx:{trust:5,form:5}}]}]},
{ id:"ntabsage", tag:"Nationalteam", w:5, rep:5, cond:p=>p.nt.level==="A"&&p.fitness<66, title:T("Länderspielreise trotz Überlastung"),
  text:T("Zwei Testspiele auf einem anderen Kontinent. Dein Verein hätte dich lieber hier behalten."),
  choices:[{label:"Absagen",hint:"",roll:[{p:1,text:"Der Bundestrainer sagt öffentlich nichts dazu. Beim nächsten Kader fehlst du.",fx:{fitness:12,trust:8,ntPenalty:14}}]},
    {label:"Trotzdem hinfliegen",hint:"",roll:[{p:1,text:"Donnerstag zurück, Samstag wieder auflaufen. Irgendwie geht das.",fx:{fitness:-14,ntBonus:8,caps:2}}]}]},
{ id:"ntstreit", tag:"Nationalteam", w:2, cond:p=>p.nt.caps>=20, title:T("Streit um deine Rolle im Nationalteam"),
  text:T("Der Bundestrainer sieht dich als Einwechselspieler. Du siehst das anders."),
  choices:[{label:"Das Gespräch suchen",hint:"",roll:[{p:.5,text:"Er erklärt dir seinen Plan. Am Ende wirst du der wichtigste Joker des Turniers.",fx:{ntBonus:10,morale:6}},
    {p:.5,text:"Er nimmt es als Kritik. Bei der nächsten Nominierung fehlst du.",fx:{ntPenalty:20,morale:-10}}]},
    {label:"Zurücktreten",hint:"Endgültig",roll:[{p:1,text:"Du erklärst deinen Rücktritt aus der Nationalmannschaft. Dein Verein freut sich über die freien Wochen.",fx:{ntPenalty:99,fitness:10,morale:-6,flag:"ntRuecktritt"}}]}]},
{ id:"turnierkader", tag:"Nationalteam", w:3, cond:p=>p.nt.level==="A", title:T("Vorläufiger Turnierkader"),
  text:T("Sechsundzwanzig Plätze, dreißig Kandidaten. Du stehst auf der Kippe."),
  choices:[{label:"Im Verein alles geben",hint:"",roll:[{p:.6,text:"Zwei Tore in den letzten drei Spielen. Du fährst mit.",fx:{ntBonus:12,form:8,fitness:-6}},
    {p:.4,text:"Du willst es zu sehr und spielst schlecht. Der Anruf kommt nicht.",fx:{ntPenalty:10,form:-10,morale:-12}}]},
    {label:"Fit bleiben und hoffen",hint:"",roll:[{p:1,text:"Du fährst am Ende doch mit, weil sich ein anderer verletzt.",fx:{ntBonus:4,fitness:6}}]}]},
{ id:"hymne", tag:"Nationalteam", w:2, cond:p=>p.nt.caps>=5, title:T("Debatte um die Hymne"),
  text:T("Eine Zeitung zählt aus, wer mitsingt und wer nicht. Dein Name steht in der falschen Spalte."),
  choices:[{label:"Kurz erklären",hint:"",roll:[{p:1,text:"Du sagst ruhig, dass Konzentration nichts mit Haltung zu tun hat. Damit ist die Sache durch.",fx:{rep:4,morale:-4}}]},
    {label:"Gar nicht reagieren",hint:"",roll:[{p:1,text:"Es kocht drei Wochen hoch und ist dann vorbei.",fx:{rep:-3}}]}]},
{ id:"doppelstaat", tag:"Nationalteam", w:2, cond:p=>p.nt.level!=="A"&&p.age<=23, title:T("Ein zweiter Verband fragt an"),
  text:T("Über deine Großmutter wärst du auch für ein anderes Land spielberechtigt. Dort wärst du sofort gesetzt."),
  choices:[{label:"Wechseln",hint:"Sofort Länderspiele",roll:[{p:1,text:"Du entscheidest dich um. Beim ersten Spiel läufst du gleich mit der Binde auf.",fx:{ntBonus:30,rep:8,morale:6}}]},
    {label:"Weiter warten",hint:"",roll:[{p:1,text:"Du glaubst weiter an den Anruf.",fx:{morale:-4}}]}]},
/* --- Geschäft --- */
{ id:"ausruester", tag:"Geschäft", w:3, cond:p=>p.rep>=50&&!p.flags.ausruester, title:T("Ausrüstervertrag auf dem Tisch"),
  text:T("Ein Hersteller will dich für vier Jahre. Dafür Kampagne, vorgeschriebene Schuhfarbe und Fototermine mitten im Winter."),
  choices:[{label:"Unterschreiben",hint:"",roll:[{p:1,text:"Dein Gesicht klebt an jeder zweiten Bushaltestelle.",fx:{money:2.2,rep:14,fitness:-3,flag:"ausruester"}}]},
    {label:"Frei bleiben",hint:"",roll:[{p:1,text:"Du behältst deinen alten Schuh, weil er einfach passt.",fx:{morale:5}}]}]},
{ id:"asien", tag:"Geschäft", w:2, rep:5, cond:p=>p.club.s>=74, title:T("Vermarktungsreise nach Asien"),
  text:T("Zwölf Tage, drei Testspiele und vierzehn Sponsorentermine. Und das mitten in der Vorbereitung."),
  choices:[{label:"Komplett mitfahren",hint:"",roll:[{p:1,text:"Du kommst mit einer Erkältung und einem neuen Sponsor zurück.",fx:{money:.5,rep:9,fitness:-10,trust:7}}]},
    {label:"Zu Hause aufbauen",hint:"",roll:[{p:1,text:"Zwölf Tage allein auf dem Vereinsgelände. Dafür gehört dir der Saisonstart.",fx:{fitness:12,phy:1,rep:-4,trust:-5}}]}]},
{ id:"eigenemarke", tag:"Geschäft", w:2, cond:p=>p.rep>=60&&p.money>=1, title:T("Zwei Freunde wollen mit dir eine Modemarke gründen"),
  text:T("Sie haben die Idee, du hast das Gesicht und das Startkapital."),
  choices:[{label:"Einsteigen",hint:"",roll:[{p:.45,text:"Die erste Kollektion ist ausverkauft. Daraus wird ein zweites Standbein.",fx:{money:1.4,rep:10}},
    {p:.55,text:"Zwei Kollektionen, dann ist die Firma pleite. Das Geld ist weg.",fx:{money:-1.1,rep:-4,morale:-8}}]},
    {label:"Nur das Gesicht hergeben",hint:"",roll:[{p:1,text:"Du kassierst eine Lizenzgebühr und trägst kein Risiko.",fx:{money:.35,rep:5}}]}]},
{ id:"wettanbieter", tag:"Geschäft", w:2, cond:p=>p.rep>=55, title:T("Werbedeal mit einem Wettanbieter"),
  text:T("Sehr viel Geld für sehr wenig Arbeit. Der Fanbeirat hat dazu eine ziemlich klare Meinung."),
  choices:[{label:"Annehmen",hint:"Geld gegen Ansehen",roll:[{p:1,text:"Auf dem Konto stimmt es. Beim nächsten Aufwärmen pfeift dich die Kurve aus.",fx:{money:3.2,rep:-12,morale:-5}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Der Fanbeirat schreibt einen offenen Brief, in dem er sich bei dir bedankt.",fx:{rep:7,morale:6}}]}]},
{ id:"immobilienangebot", tag:"Geschäft", w:2, rep:6, cond:p=>p.money>=2, title:T("Ein Bekannter bietet dir ein Bauprojekt an"),
  text:T("Ferienwohnungen am Meer, garantierte Rendite, Unterschrift bitte bis Freitag. Klingt gut. Eigentlich zu gut."),
  choices:[{label:"Investieren",hint:"",roll:[{p:.4,text:"Es läuft tatsächlich. Nach drei Jahren hat sich dein Einsatz verdoppelt.",fx:{money:1.6,morale:6}},
    {p:.6,text:"Baustopp, Insolvenz und ein Prozess, der Jahre dauert. Das Geld ist weg.",fx:{money:-1.5,morale:-12,rep:-3}}]},
    {label:"Erst prüfen lassen",hint:"",roll:[{p:1,text:"Dein Berater rät ab. Zwei Jahre später steht das Projekt in der Zeitung, als Skandal.",fx:{morale:8,rep:2}}]}]},
{ id:"testimonial", tag:"Geschäft", w:3, rep:5, cond:p=>p.rep>=40, title:T("Drei Werbeanfragen aus der Region"),
  text:T("Ein Autohaus, eine Brauerei und eine Sparkasse. Alle drei zahlen ordentlich."),
  choices:[{label:"Alle drei machen",hint:"",roll:[{p:1,text:"Volles Konto und ein voller Terminkalender.",fx:{money:.45,rep:6,fitness:-4}}]},
    {label:"Nur eine",hint:"",roll:[{p:1,text:"Du nimmst die Sparkasse. Unaufgeregt und auf lange Sicht.",fx:{money:.18,rep:3}}]},
    {label:"Keine",hint:"",roll:[{p:1,text:"Du willst einfach deine Ruhe.",fx:{morale:4}}]}]},
{ id:"agentur", tag:"Geschäft", w:2, cond:p=>p.age>=30, title:T("Beteiligung an einer Spielerberatung"),
  text:T("Ein ehemaliger Mitspieler baut eine Agentur auf und will dich als Gesellschafter dabeihaben."),
  choices:[{label:"Einsteigen",hint:"",roll:[{p:.6,text:"Nach drei Jahren betreut ihr zwanzig Profis. Damit hast du einen Beruf für danach.",fx:{money:-.6,rep:8,legacy:14,flag:"agentur"}},
    {p:.4,text:"Ihr zerstreitet euch über die Provisionen und geht im Streit auseinander.",fx:{money:-.6,rep:-6,morale:-8}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Nach der Karriere willst du erstmal gar nichts machen.",fx:{}}]}]},
/* --- Umfeld und Familie --- */
{ id:"heimat", tag:"Umfeld", w:2, rep:6, cond:p=>p.age>=19&&p.rep>=22, title:T("Anfrage aus deiner Heimat"),
  text:T("Dein alter Jugendverein braucht einen Kunstrasen. Sie fragen nicht direkt nach Geld, aber sie fragen."),
  choices:[{label:"Den Platz finanzieren",hint:"",roll:[{p:1,text:"Der Platz trägt jetzt deinen Namen. Deine Mutter weint bei der Einweihung.",fx:{money:-.9,rep:10,morale:12,legacy:10}}]},
    {label:"Trikots schicken",hint:"",roll:[{p:1,text:"Zwei Kisten Material. Sie freuen sich trotzdem riesig.",fx:{rep:2,morale:3}}]}]},
{ id:"sprache", tag:"Ausland", w:3, cond:p=>p.club.c!==p.nation.id&&!p.flags.sprache, title:T("Die ersten Monate im Ausland"),
  text:c=>`In der Kabine spricht keiner deine Sprache. Nur ${c.mate.name} übersetzt dir ab und zu was.`,
  choices:[{label:"Dreimal pro Woche Unterricht nehmen",hint:"",roll:[{p:1,text:"Nach vier Monaten verstehst du die Ansprache, nach sechs auch die Witze.",fx:{pas:1,trust:10,morale:10,flag:"sprache"}}]},
    {label:"Geht auch mit Händen und Füßen",hint:"",roll:[{p:1,text:"Du bleibst der Typ, der nach dem Training sofort ins Auto steigt.",fx:{morale:-10,trust:-6}}]}]},
{ id:"familie", tag:"Familie", w:3, g:"m", cond:p=>p.age>=24&&!p.flags.familie&&p.life.kids===0&&["beziehung","verlobt","verheiratet"].includes(p.life.status), title:T("Ihr bekommt ein Kind"),
  text:T("Der Geburtstermin liegt genau in der englischen Woche."),
  choices:[{label:"Dabei sein",hint:"",roll:[{p:1,text:"Du verpasst ein Spiel und bist bei der Geburt dabei. Diese Entscheidung bereust du nie.",fx:{morale:22,trust:-4,flag:"familie",legacy:6,kids:1}}]},
    {label:"Spielen und danach hinfahren",hint:"",roll:[{p:1,text:c=>`Du ${heldentat(c.p)} und fährst danach 400 Kilometer durch die Nacht. Beides hat geklappt.`,fx:{morale:10,form:8,fitness:-6,flag:"familie",kids:1}}]}]},
{ id:"umzug", tag:"Familie", w:2, cond:p=>p.life.kids>=1&&["beziehung","verlobt","verheiratet"].includes(p.life.status)&&p.age>=27, title:T("Die Familie will nicht schon wieder umziehen"),
  text:T("Das dritte Land in fünf Jahren, und die Kinder haben sich gerade eingelebt. Deine Partnerin sagt: nicht nochmal."),
  choices:[{label:"Bleiben, wo ihr seid",hint:"",roll:[{p:1,text:"Du sagst deinem Berater, er soll nur noch in Fahrtweite suchen.",fx:{morale:14,flag:"sesshaft",rep:-3}}]},
    {label:"Trotzdem offen bleiben",hint:"",roll:[{p:1,text:"Ihr streitet euch monatelang. Beruflich bleibst du dafür flexibel.",fx:{morale:-14,form:-6}}]}]},
{ id:"eltern", tag:"Familie", w:2, cond:p=>p.money>=.8, title:T("Deine Eltern arbeiten immer noch"),
  text:T("Beide über sechzig und beide im Schichtdienst. Du könntest das beenden."),
  choices:[{label:"Für sie aufkommen",hint:"",roll:[{p:1,text:"Sie wehren sich zwei Monate lang und hören dann doch auf. Das fühlt sich besser an als jeder Titel.",fx:{money:-.6,morale:20,legacy:6}}]},
    {label:"Sie machen lassen",hint:"",roll:[{p:1,text:"Sie sagen, sie brauchen die Aufgabe. Vielleicht stimmt das ja sogar.",fx:{morale:2}}]}]},
{ id:"freundeskreis", tag:"Umfeld", w:3, rep:5, cond:p=>p.money>=1.5, title:T("Der alte Freundeskreis will mitverdienen"),
  text:T("Vier Leute von früher wollen irgendwas mit dir zusammen machen. Zwei davon meinen es ernst."),
  choices:[{label:"Alle einbinden",hint:"",roll:[{p:.45,text:"Es funktioniert. Du hast Leute um dich, die dich schon vorher kannten.",fx:{morale:12,money:-.3}},
    {p:.55,text:"Geld verschwindet, Freundschaften gehen kaputt, und einer verkauft am Ende eine Geschichte an die Presse.",fx:{money:-.8,morale:-14,rep:-8}}]},
    {label:"Klar trennen",hint:"",roll:[{p:1,text:"Freundschaft ja, Geschäft nein. Zwei sind beleidigt, zwei bleiben.",fx:{morale:4}}]}]},
{ id:"stiftung", tag:"Umfeld", w:2, cond:p=>p.money>=3&&!p.flags.stiftung, title:T("Eine eigene Stiftung gründen"),
  text:T("Jugendarbeit in deiner Heimatstadt. Das kostet ordentlich Startkapital und macht ordentlich Verwaltungsaufwand."),
  choices:[{label:"Gründen",hint:"",roll:[{p:1,text:"Nach drei Jahren betreut die Stiftung 400 Kinder. Das bleibt, auch wenn du längst aufgehört hast.",fx:{money:-2.2,rep:16,morale:14,flag:"stiftung",legacy:30}}]},
    {label:"Später mal",hint:"",roll:[{p:1,text:"Erstmal weiter Fußball spielen.",fx:{}}]}]},
{ id:"kurve", tag:"Fans", w:3, rep:5, cond:p=>p.lastNote>3.5, title:T("Die Kurve wartet am Zaun"),
  text:T("Nach dem vierten sieglosen Spiel bleibt der ganze Block stehen. Der Bus läuft schon."),
  choices:[{label:"Hingehen und zuhören",hint:"",roll:[{p:1,text:"Zehn Minuten Klartext. Beim nächsten Heimspiel hängt ein Banner mit deinem Namen.",fx:{rep:9,morale:6,trust:6}}]},
    {label:"In den Bus steigen",hint:"",roll:[{p:1,text:"Am Freitag hängt ein anderes Banner. Deins ist nicht dabei.",fx:{rep:-8,morale:-6}}]}]},
/* --- Kurioses --- */
{ id:"aberglaube", tag:"Kurios", w:2, rep:5, title:T("Das Ritual"),
  text:T("Seit sieben Spielen ohne Niederlage ziehst du immer denselben Socken zuerst an und isst dasselbe Frühstück."),
  choices:[{label:"Konsequent durchziehen",hint:"",roll:[{p:1,text:"Es läuft weiter gut. Ob es daran liegt, ist egal, solange du dran glaubst.",fx:{form:7,morale:5}}]},
    {label:"Bewusst brechen",hint:"",roll:[{p:.5,text:"Ihr gewinnt 4:0. Damit hat sich das Thema erledigt.",fx:{form:5,morale:4}},{p:.5,text:"0:3. Du fühlst dich schuldig, obwohl das natürlich Quatsch ist.",fx:{form:-8,morale:-6}}]}]},
{ id:"maskottchen", tag:"Kurios", w:2, rep:6, cond:p=>p.rep>=35, title:T("Ein Fan will sich deinen Namen tätowieren lassen"),
  text:T("Er zeigt dir den Entwurf. Unterarm, groß, mit Datum."),
  choices:[{label:"Mitmachen und Foto teilen",hint:"",roll:[{p:1,text:"Das Bild geht durch die ganze Fanszene. Du bist jetzt Kult.",fx:{rep:8,morale:6}}]},
    {label:"Ihm davon abraten",hint:"",roll:[{p:1,text:"Du sagst ihm, er soll sich lieber das Vereinswappen stechen lassen. Er hört nicht auf dich.",fx:{rep:3,morale:3}}]}]},
{ id:"platzsturm", tag:"Fans", w:9, rep:3, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.move&&s.move.dir==="auf");}, title:T("Platzsturm nach dem Aufstieg"),
  text:T("Zwanzigtausend Leute auf dem Rasen. Irgendwer zieht dir das Trikot über den Kopf."),
  choices:[{label:"Mittendrin bleiben",hint:"",roll:[{p:.75,text:"Du wirst durchgereicht und kommst ohne Schuhe in der Kabine an. Bester Abend deines Lebens.",fx:{rep:12,morale:20}},
    {p:.25,text:"Jemand tritt dir aufs Sprunggelenk. Bänderriss beim Feiern.",fx:{forceInjury:"leicht",morale:8,rep:8}}]},
    {label:"Sofort in die Kabine",hint:"",roll:[{p:1,text:"Sicher ist sicher. Aber du hast was verpasst.",fx:{morale:6}}]}]},
{ id:"trikottausch", tag:"Kurios", w:2, rep:5, cond:p=>p.age>=22, title:T("Trikottausch mit deinem Kindheitsidol"),
  text:T("Nach dem Spiel steht er vor dir und fragt zuerst. Als Kind hattest du sein Poster über dem Bett."),
  choices:[{label:"Tauschen und behalten",hint:"",roll:[{p:1,text:"Es hängt jetzt gerahmt bei deinen Eltern, und du zeigst es jedem.",fx:{morale:12}}]},
    {label:"Deins verschenken",hint:"",roll:[{p:1,text:"Du gibst es einem Kind auf der Tribüne. Das Foto davon geht überall rum.",fx:{rep:10,morale:8}}]}]},
{ id:"wetterchaos", tag:"Kurios", w:2, rep:6, cond:p=>p.seasons.length>=1, title:T("Spielabbruch wegen Unwetter"),
  text:T("Beim Stand von 2:0 für euch, in der 68. Minute. Das Wiederholungsspiel fängt bei 0:0 an."),
  choices:[{label:"Protest einlegen lassen",hint:"",roll:[{p:1,text:"Der Verband lehnt ab, und ihr verliert die Wiederholung.",fx:{morale:-8,form:-5}}]},
    {label:"Nochmal anfangen",hint:"",roll:[{p:.55,text:"Ihr gewinnt auch beim zweiten Mal.",fx:{morale:8,form:6}},{p:.45,text:"Diesmal reicht es nicht.",fx:{morale:-6}}]}]},
/* --- Zwielichtiges --- */
{ id:"manipulation", tag:"Zwielichtig", w:2, cond:p=>p.age>=22, title:T("Ein Angebot im Hotelflur"),
  text:T("Zwei Männer, die niemand kennt, nennen dir eine sechsstellige Summe. Es geht nur darum, dass ein bestimmtes Spiel bestimmt ausgeht."),
  choices:[{label:"Annehmen",hint:"Sehr viel Geld, sehr hohes Risiko",
    roll:[{p:.55,text:"Es merkt niemand. Das Geld liegt bar in einem Schließfach, und du schläfst trotzdem schlecht.",fx:{money:2.5,morale:-16,flag:"manipuliert"}},
          {p:.25,text:"Zwei Jahre später ermittelt die Staatsanwaltschaft. Verfahren, Prozess und ein Name, den du nicht mehr loswirst.",fx:{money:1.2,rep:-40,ban:true,morale:-30,trust:-40,legacy:-60}},
          {p:.20,text:"Der Verband sperrt dich lebenslang. Damit ist deine Karriere vorbei.",fx:{endCareer:"Lebenslange Sperre wegen Spielmanipulation.",rep:-70,legacy:-120}}]},
    {label:"Sofort dem Verein melden",hint:"",roll:[{p:1,text:"Der Sicherheitsbeauftragte schaltet die Behörden ein. Intern wirst du als Vorbild hingestellt.",fx:{trust:16,rep:10,morale:8,legacy:12}}]},
    {label:"Höflich ablehnen und schweigen",hint:"",roll:[{p:.7,text:"Du hörst nie wieder etwas von ihnen.",fx:{morale:-4}},{p:.3,text:"Ein halbes Jahr später fragen sie nochmal. Diesmal weniger höflich.",fx:{morale:-10,rep:-3}}]}]},
{ id:"schwarzgeld", tag:"Zwielichtig", w:2, cond:p=>p.money>=1.5, title:T("Handgeld an der Steuer vorbei"),
  text:T("Dein Berater schlägt eine Konstruktion über eine Firma im Ausland vor. Das würden alle so machen, sagt er."),
  choices:[{label:"Mitmachen",hint:"",roll:[{p:.6,text:"Es fällt niemandem auf. Netto bleibt deutlich mehr übrig.",fx:{money:1.4,flag:"schwarzgeld"}},
    {p:.4,text:"Steuerfahndung, Hausdurchsuchung, Bewährungsstrafe. Der Name klebt an dir.",fx:{money:-2.2,rep:-28,morale:-24,trust:-16,legacy:-30}}]},
    {label:"Sauber versteuern",hint:"",roll:[{p:1,text:"Weniger auf dem Konto, dafür schläfst du gut.",fx:{morale:6}}]}]},
{ id:"steuerpruefung", tag:"Zwielichtig", w:4, cond:p=>p.flags.schwarzgeld, title:T("Post vom Finanzamt"),
  text:T("Betriebsprüfung, rückwirkend über sechs Jahre. Dein Berater geht plötzlich nicht mehr ans Telefon."),
  choices:[{label:"Selbstanzeige stellen",hint:"",roll:[{p:1,text:"Teuer, aber du kommst um eine Strafe herum. Damit ist die Sache erledigt.",fx:{money:-2.6,rep:-10,morale:-12}}]},
    {label:"Aussitzen",hint:"",roll:[{p:.35,text:"Sie finden nichts, womit sie dir wirklich beikommen.",fx:{morale:-8}},
      {p:.65,text:"Anklage, Prozess und monatelang Schlagzeilen.",fx:{money:-3.5,rep:-32,morale:-26,trust:-14,legacy:-40}}]}]},
{ id:"transferrechte", tag:"Zwielichtig", w:2, cond:p=>p.ovr>=72&&p.age<=27, title:T("Ein Investor will Anteile an dir"),
  text:T("Ein Fonds bietet Geld dafür, an deinem nächsten Transfer beteiligt zu werden. Erlaubt ist das nicht."),
  choices:[{label:"Unterschreiben",hint:"",roll:[{p:.55,text:"Das Geld kommt sofort, und es steht nirgends, wo es jemand finden könnte.",fx:{money:1.8,flag:"tpo",morale:-8}},
    {p:.45,text:"Der Verband bekommt Wind davon. Sperre, Geldstrafe, Vertragsauflösung.",fx:{money:-.8,ban2:8,rep:-24,trust:-30,morale:-20,legacy:-25}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Dein Berater ist enttäuscht. Sonst passiert nichts.",fx:{morale:3}}]}]},
{ id:"insider", tag:"Zwielichtig", w:2, rep:6, cond:p=>p.age>=21, title:T("Ein alter Bekannter fragt nach der Aufstellung"),
  text:T("Nur eine Info, einen Tag vor dem Spiel. Er sagt, es sei für einen Freund."),
  choices:[{label:"Weitergeben",hint:"",roll:[{p:.6,text:"Er überweist dir Geld, um das du nie gebeten hast. Damit steckst du drin.",fx:{money:.25,flag:"insider",morale:-12}},
    {p:.4,text:"Der Verein lässt Wettbewegungen überwachen. Dein Name taucht dabei auf.",fx:{trust:-26,rep:-16,ban2:4,morale:-16}}]},
    {label:"Abblocken",hint:"",roll:[{p:1,text:"Du schreibst ihm, er soll das lassen. Danach meldet er sich nicht mehr.",fx:{morale:-3}}]}]},
{ id:"attest", tag:"Zwielichtig", w:2, cond:p=>p.trust<45, title:T("Ein Attest, das eigentlich keins sein dürfte"),
  text:T("Ein befreundeter Arzt bietet an, dir eine Verletzung zu bescheinigen, damit du das Auswärtsspiel auslassen kannst."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:.6,text:"Es fragt keiner nach. Du hast zwei Wochen frei.",fx:{fitness:10,morale:5,flag:"attest"}},
    {p:.4,text:"Der Vereinsarzt untersucht dich selbst und findet nichts. Der Trainer erfährt alles.",fx:{trust:-30,rep:-12,morale:-14,money:-.1}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du fährst mit und sitzt neunzig Minuten auf der Bank.",fx:{trust:5}}]}]},
{ id:"poker", tag:"Zwielichtig", w:2, rep:5, cond:p=>p.money>=.6, title:T("Die private Pokerrunde"),
  text:T("Ein Hinterzimmer, hohe Einsätze, keine Quittungen. Zwei Mitspieler sind da Stammgäste."),
  choices:[{label:"Mitspielen",hint:"",roll:[{p:.35,text:"Du gewinnst deutlich und gehst früh nach Hause.",fx:{money:.35,morale:6}},
    {p:.4,text:"Du verlierst mehr, als du wolltest, und gehst später, als du solltest.",fx:{money:-.5,fitness:-8,morale:-10}},
    {p:.25,text:"Eine Razzia. Am nächsten Tag steht dein Name in der Zeitung.",fx:{money:-.4,rep:-18,trust:-14,morale:-16}}]},
    {label:"Nicht hingehen",hint:"",roll:[{p:1,text:"Du bleibst zu Hause und machst am Samstag ein gutes Spiel.",fx:{form:5}}]}]},
{ id:"zoll", tag:"Zwielichtig", w:2, cond:p=>p.money>=2, title:T("Zwei Uhren im Handgepäck"),
  text:T("Im Urlaub gekauft, zusammen so teuer wie ein Mittelklassewagen. Der grüne Ausgang ist rechts."),
  choices:[{label:"Einfach durchgehen",hint:"",roll:[{p:.7,text:"Es hält dich niemand an.",fx:{money:.08}},
    {p:.3,text:"Kontrolle. Nachzahlung, Bußgeld und eine Meldung, die es in die Presse schafft.",fx:{money:-.35,rep:-12,morale:-10}}]},
    {label:"Anmelden",hint:"",roll:[{p:1,text:"Zwanzig Minuten Papierkram, dann ist es erledigt.",fx:{money:-.06}}]}]},
{ id:"kryptowerbung", tag:"Zwielichtig", w:2, cond:p=>p.rep>=50, title:T("Werbung für ein Krypto-Projekt"),
  text:T("Ein Beitrag, eine sechsstellige Summe. Was das Projekt eigentlich macht, kann dir keiner richtig erklären."),
  choices:[{label:"Posten",hint:"",roll:[{p:.4,text:"Das Geld kommt, das Projekt läuft weiter, es passiert nichts.",fx:{money:.7,rep:-4}},
    {p:.6,text:"Das Projekt kollabiert. Die Anleger verklagen alle, die dafür geworben haben, dich eingeschlossen.",fx:{money:-.9,rep:-24,morale:-16}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Ein halbes Jahr später weißt du, warum das richtig war.",fx:{morale:5,rep:3}}]}]},
{ id:"schlaegerei", tag:"Zwielichtig", w:2, rep:5, cond:p=>p.age>=20, title:T("Vor dem Club um drei Uhr nachts"),
  text:T("Einer filmt, einer provoziert, einer schubst deinen Bruder. Sechs Handys sind schon oben."),
  choices:[{label:"Dazwischengehen",hint:"",roll:[{p:.45,text:"Du trennst die beiden, mehr passiert nicht. Auf dem Video sieht man, dass du geschlichtet hast.",fx:{rep:6,morale:4}},
    {p:.55,text:"Es eskaliert. Anzeige, Vereinsstrafe und eine hässliche Schlagzeile.",fx:{money:-.2,rep:-20,trust:-18,ban2:2,morale:-14}}]},
    {label:"Sofort ins Taxi",hint:"",roll:[{p:1,text:"Feige, sagt dein Bruder. Klug, sagt dein Berater.",fx:{morale:-5,rep:-2}}]}]},
{ id:"raser", tag:"Zwielichtig", w:2, rep:5, cond:p=>p.money>=.5, title:T("Nachts auf der Landstraße"),
  text:T("Leere Straße, starkes Auto, und daneben sitzt ein Mitspieler, der alles filmt."),
  choices:[{label:"Gasgeben",hint:"",roll:[{p:.55,text:"Es passiert nichts. Das Video bleibt im privaten Chat.",fx:{morale:5}},
    {p:.30,text:"Geblitzt. Drei Monate ohne Führerschein und eine unangenehme Meldung.",fx:{money:-.15,rep:-14,morale:-10}},
    {p:.15,text:"Du kommst von der Straße ab. Zum Glück nur Blechschaden, aber du hast ein Schleudertrauma.",fx:{money:-.3,forceInjury:"leicht",rep:-16,trust:-12,morale:-18}}]},
    {label:"Runterschalten",hint:"",roll:[{p:1,text:"Ihr fahrt in Ruhe nach Hause und hört Musik.",fx:{}}]}]},
{ id:"praeparat", tag:"Zwielichtig", w:2, cond:p=>p.age>=20, title:T("Das Mittel ohne Zertifikat"),
  text:c=>`${c.mate.name} schwört auf ein Regenerationsmittel aus dem Ausland. Auf der Verbotsliste steht es angeblich nicht.`,
  choices:[{label:"Ausprobieren",hint:"",roll:[{p:.84,text:"Du regenerierst spürbar besser, und keiner fragt nach.",fx:{phy:2,fitness:9,injuryProne:-6}},
    {p:.16,text:"Dopingkontrolle nach dem Heimspiel. Lange Sperre und ein Name, den du nicht mehr loswirst.",fx:{ban:true,rep:-25,morale:-25,trust:-25,legacy:-25}}]},
    {label:"In den Müll damit",hint:"",roll:[{p:1,text:"Du nimmst nur das, was der Verein freigegeben hat.",fx:{morale:2}}]}]},
{ id:"beraterbetrug", tag:"Zwielichtig", w:2, cond:p=>p.money>=3&&p.flags.berater, title:T("Auf deinem Konto fehlt Geld"),
  text:T("Eine größere Summe ist an eine Firma gegangen, die du nicht kennst. Dein Berater erklärt das ziemlich umständlich."),
  choices:[{label:"Anwalt einschalten",hint:"",roll:[{p:.65,text:"Der Großteil kommt zurück, und er verliert seine Lizenz.",fx:{money:-.6,rep:4,morale:-8}},
    {p:.35,text:"Das Geld ist über drei Länder verteilt und nicht mehr aufzufinden.",fx:{money:-2.4,morale:-20,rep:-4}}]},
    {label:"Ihm glauben",hint:"",roll:[{p:.3,text:"Es klärt sich tatsächlich auf.",fx:{morale:3}},
      {p:.7,text:"Ein Jahr später fehlt noch viel mehr.",fx:{money:-3.2,morale:-24}}]}]},
{ id:"autogramme", tag:"Zwielichtig", w:2, rep:6, cond:p=>p.rep>=30, title:T("Ein Händler bringt 400 Karten"),
  text:T("Er zahlt bar pro Unterschrift. Die Karten verkauft er danach als angebliche Einzelstücke weiter."),
  choices:[{label:"Unterschreiben",hint:"",roll:[{p:.75,text:"Zwei Stunden Arbeit und ordentlich Bargeld.",fx:{money:.12}},
    {p:.25,text:"Der Verein erfährt davon und untersagt es. Die Fanclubs sind sauer.",fx:{rep:-9,trust:-8}}]},
    {label:"Nur für echte Fans",hint:"",roll:[{p:1,text:"Du schreibst zwei Stunden lang am Trainingsgelände Autogramme. Umsonst.",fx:{rep:8,morale:5}}]}]},
{ id:"schiedsrichter", tag:"Zwielichtig", w:2, cond:p=>p.age>=25, title:T("Ein Anruf vor dem Abstiegsduell"),
  text:T("Jemand aus dem Vereinsumfeld erzählt dir, er kenne den Schiedsrichter privat, und fragt, ob du das in Ordnung findest."),
  choices:[{label:"Nichts sagen",hint:"",roll:[{p:.6,text:"Das Spiel läuft ganz normal. Du erfährst nie, ob da wirklich was war.",fx:{morale:-8}},
    {p:.4,text:"Die Sache wird untersucht, und du wirst als Mitwisser vernommen.",fx:{rep:-18,trust:-16,morale:-18,legacy:-20}}]},
    {label:"Sofort unterbinden",hint:"",roll:[{p:1,text:"Du gehst direkt zum Kapitän und zum Verein. Der Mann verschwindet aus dem Umfeld.",fx:{trust:12,rep:8,morale:6,legacy:10}}]}]},
/* --- Alltag und Zukunft --- */
{ id:"koch", tag:"Lifestyle", w:3, cond:p=>p.money>=1&&!p.flags.koch, title:T("Eigener Koch und eigener Physio"),
  text:T("Rundumbetreuung zu Hause. Kostet einiges, soll dir aber ein paar Jahre extra bringen."),
  choices:[{label:"Einrichten",hint:"",roll:[{p:1,text:"Deine Regenerationswerte sehen aus wie die von einem Zweiundzwanzigjährigen.",fx:{money:-.8,injuryProne:-14,fitness:8,flag:"koch"}}]},
    {label:"Weiter selber machen",hint:"",roll:[{p:1,text:"Geht ja auch so.",fx:{}}]}]},
{ id:"trainerschein", tag:"Zukunft", w:2, cond:p=>p.age>=30&&!p.flags.trainerschein, title:T("Trainerschein nebenbei machen"),
  text:T("Der Verband bietet einen Lehrgang parallel zur Saison an. Zwei Wochenenden im Monat."),
  choices:[{label:"Machen",hint:"",roll:[{p:1,text:"Du siehst Spiele plötzlich ganz anders. Das hilft dir auf dem Platz mehr, als du gedacht hättest.",fx:{pas:1,def:1,note:.1,fitness:-5,flag:"trainerschein",legacy:10}}]},
    {label:"Danach",hint:"",roll:[{p:1,text:"Erst zu Ende spielen, dann weitersehen.",fx:{fitness:4}}]}]},
{ id:"abschiedsspiel", tag:"Zukunft", w:2, cond:p=>p.age>=33&&p.rep>=55, title:T("Anfrage für ein Abschiedsspiel"),
  text:T("Dein Ex-Verein plant schon, obwohl du noch gar nicht aufgehört hast."),
  choices:[{label:"Zusagen",hint:"",roll:[{p:1,text:"Es steht im Kalender. Irgendwann.",fx:{morale:10,rep:6,flag:"abschiedsspiel",legacy:8}}]},
    {label:"Noch zu früh",hint:"",roll:[{p:1,text:"Du bittest um Aufschub, und man versteht das.",fx:{morale:4}}]}]},
{ id:"experte", tag:"Zukunft", w:2, cond:p=>p.age>=32&&p.rep>=55, title:T("Ein Sender bietet dir einen Expertenvertrag"),
  text:T("Direkt nach der Karriere ins Studio. Sie hätten gern früh Klarheit."),
  choices:[{label:"Zusagen",hint:"",roll:[{p:1,text:"Der Anschluss ist geregelt, und das nimmt eine Menge Druck raus.",fx:{morale:10,rep:8,flag:"experte",legacy:8}}]},
    {label:"Offenlassen",hint:"",roll:[{p:1,text:"Du willst erst zu Ende spielen.",fx:{}}]}]},
{ id:"sommer", tag:"Vorbereitung", w:4, rep:3, cond:p=>p.seasons.length>=1, title:T("Sechs Wochen Sommerpause"),
  text:T("Der Verein schickt dir einen Laufplan mit. Ob du ihn machst, sieht keiner."),
  choices:[{label:"Individualtraining durchziehen",hint:"",roll:[{p:1,text:"Beim Leistungstest im Juli bist du der Einzige, der besser dasteht als im Mai.",fx:{phy:2,pac:1,fitness:12,morale:-6,trust:6}}]},
    {label:"Wirklich Urlaub machen",hint:"",roll:[{p:1,text:"Du kommst erholt und drei Kilo schwerer zurück.",fx:{morale:14,fitness:-8}}]}]},
{ id:"wohnort", tag:"Lifestyle", w:2, rep:6, cond:p=>p.money>=.15&&p.age>=19, title:T("Stadt oder Land"),
  text:T("Vierzig Minuten Fahrt zum Trainingsgelände, dafür deine Ruhe. Oder mittendrin wohnen und ständig erkannt werden."),
  choices:[{label:"Aufs Land ziehen",hint:"",roll:[{p:1,text:"Ruhig und anonym, dafür viel Zeit im Auto.",fx:{morale:8,fitness:-3,rep:-3}}]},
    {label:"In die Stadt ziehen",hint:"",roll:[{p:1,text:"Kurze Wege, dafür wirst du überall erkannt.",fx:{rep:6,fitness:4,morale:-3}}]}]},
/* ================= PRIVATLEBEN ================= */
{ id:"kennen1", tag:"Privat", w:6, cond:p=>p.life.status==="single"&&p.age>=18&&p.age<=32, title:T("Jemand aus der Physiopraxis"),
  text:T("Du liegst seit drei Wochen zweimal die Woche auf derselben Liege, und irgendwann redet ihr nicht mehr nur über dein Sprunggelenk."),
  choices:[{label:"Nach der Nummer fragen",hint:"",roll:[{p:.65,text:c=>`Sie heißt ${c.pn} und sagt ja. Ihr geht am Donnerstag essen.`,fx:{partner:true,morale:14,form:6}},
    {p:.35,text:"Sie sagt freundlich, dass sie da eine klare Trennlinie zieht. Die Behandlung ist danach etwas still.",fx:{morale:-5}}]},
    {label:"Nichts sagen",hint:"",roll:[{p:1,text:"Du lässt es. Zwei Monate später arbeitet sie woanders.",fx:{morale:-3}}]}]},
{ id:"kennen2", tag:"Privat", w:5, cond:p=>p.life.status==="single"&&p.age>=19, title:c=>`${c.mate.name} will dich verkuppeln`,
  text:c=>`${c.mate.name} erzählt seit Wochen von einer Freundin seiner Frau. Am Samstag sitzt ihr zu viert am Tisch, und es ist offensichtlich abgesprochen.`,
  choices:[{label:"Sich drauf einlassen",hint:"",roll:[{p:.6,text:c=>`${c.pn} ist witzig und hat null Ahnung von Fußball. Genau das ist der Punkt.`,fx:{partner:true,morale:15}},
    {p:.4,text:"Netter Abend, mehr nicht. Ihr schreibt euch noch zwei Wochen, dann schläft es ein.",fx:{morale:2}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Du sagst, du hast gerade keinen Kopf dafür. Stimmt ja auch.",fx:{form:4}}]}]},
{ id:"kennen3", tag:"Privat", w:4, cond:p=>p.life.status==="single"&&p.rep>=45, title:T("Kennenlernen mit Hindernis"),
  text:T("Ihr schreibt seit zwei Wochen. Dann fragt sie, ob du dieser Fußballer bist, und du merkst, wie sich der Ton ändert."),
  choices:[{label:"Offen damit umgehen",hint:"",roll:[{p:.6,text:c=>`${c.pn} sagt, sie habe kein Problem damit, solange du keins draus machst. Ihr trefft euch.`,fx:{partner:true,morale:12}},
    {p:.4,text:"Sie schickt am nächsten Tag Screenshots an ihre Freundinnen. Du beendest das.",fx:{morale:-8,rep:2}}]},
    {label:"Erstmal abblocken",hint:"",roll:[{p:1,text:"Du weichst aus. Sie merkt es und meldet sich nicht mehr.",fx:{morale:-4}}]}]},
{ id:"zusammen", tag:"Privat", w:9, cond:p=>p.life.status==="beziehung"&&!p.flags.zusammen, title:c=>`${c.pn} will zusammenziehen`,
  text:T("Ein Jahr Hin und Her zwischen zwei Wohnungen. Sie sagt, entweder richtig oder gar nicht."),
  choices:[{label:"Zusammenziehen",hint:"",roll:[{p:1,text:"Nach vier Wochen Chaos fühlt es sich an, als wäre es immer so gewesen. Du kommst abends nach Hause statt in eine Wohnung.",fx:{morale:16,fitness:4,flag:"zusammen"}}]},
    {label:"Noch warten",hint:"",roll:[{p:.5,text:"Sie akzeptiert es, aber es steht ab jetzt im Raum.",fx:{morale:-7}},
      {p:.5,text:"Sie zieht die Konsequenz und beendet es.",fx:{split:true,morale:-16,form:-8}}]}]},
{ id:"fernbeziehung", tag:"Privat", w:5, cond:p=>p.life.status==="beziehung"&&p.club.c!==p.nation.id, title:T("Fernbeziehung über Ländergrenzen"),
  text:c=>`${c.pn} hat einen Job, den sie nicht aufgeben will. Zwischen euch liegen jetzt vierzehnhundert Kilometer.`,
  choices:[{label:"Jede freie Woche fliegen",hint:"",roll:[{p:1,text:"Es funktioniert, kostet aber jede Regenerationsphase und einiges an Geld.",fx:{morale:9,fitness:-9,money:-.12}}]},
    {label:"Sie bitten mitzukommen",hint:"",roll:[{p:.55,text:"Sie kündigt und kommt. Das rechnet sie dir jahrelang an, im guten Sinne.",fx:{morale:16,flag:"zusammen"}},
      {p:.45,text:"Sie will nicht, und ihr zerredet es über Monate, bis nichts mehr da ist.",fx:{split:true,morale:-18,form:-10}}]}]},
{ id:"antrag", tag:"Privat", w:9, cond:p=>p.life.status==="beziehung"&&(p.flags.zusammen||(p.life.since!=null&&p.year-p.life.since>=2)), title:T("Der Ring liegt seit zwei Monaten im Schrank"),
  text:T("Du hast ihn nach dem Auswärtsspiel in Mailand gekauft und seitdem keinen passenden Moment gefunden."),
  choices:[{label:"Antrag machen",hint:"",roll:[{p:.88,text:c=>`${c.pn} sagt ja, bevor du den Satz zu Ende hast.`,fx:{lifeStatus:"verlobt",morale:22,form:10}},
    {p:.12,text:"Sie sagt, es sei zu früh. Ihr bleibt zusammen, aber der Abend hängt euch nach.",fx:{morale:-12}}]},
    {label:"Weiter warten",hint:"",roll:[{p:1,text:"Der Ring bleibt im Schrank.",fx:{morale:-3}}]}]},
{ id:"hochzeit", tag:"Privat", w:11, cond:p=>p.life.status==="verlobt", title:T("Der Hochzeitstermin"),
  text:T("Der einzige freie Zeitraum liegt in der Sommerpause, direkt vor dem Trainingsauftakt. Die Alternative wäre im Winter."),
  choices:[{label:"Groß feiern im Sommer",hint:"Kostet Vorbereitung",roll:[{p:1,text:"Zweihundert Gäste, drei Tage, und du kommst mit vier Kilo mehr und einem sehr guten Gefühl ins Trainingslager.",fx:{wedding:true,morale:26,money:-.32,fitness:-11,rep:6}}]},
    {label:"Klein und im Winter",hint:"",roll:[{p:1,text:"Standesamt, zwölf Leute, danach Essen. Am Montag wieder Training.",fx:{wedding:true,morale:18,money:-.05}}]}]},
{ id:"flitter", tag:"Privat", w:7, cond:p=>p.life.status==="verheiratet"&&!p.flags.flitter, title:T("Flitterwochen oder Vorbereitung"),
  text:T("Zwei Wochen wären drin, aber genau dann beginnt die Vorbereitung."),
  choices:[{label:"Fahren",hint:"",roll:[{p:1,text:"Zwei Wochen komplett abschalten. Der Trainer ist mäßig begeistert, deine Frau umso mehr.",fx:{morale:18,fitness:-8,trust:-7,money:-.1,flag:"flitter"}}]},
    {label:"Verschieben",hint:"",roll:[{p:1,text:"Ihr holt es irgendwann nach. Sagt ihr euch.",fx:{morale:-5,trust:6,flag:"flitter"}}]}]},
{ id:"kinderwunsch", tag:"Privat", w:9, g:"m", cond:p=>["verheiratet","verlobt"].includes(p.life.status)&&p.life.kids===0&&p.age>=23, title:T("Kinderwunsch"),
  text:T("Sie bringt es beim Frühstück auf. Du merkst, dass sie länger darüber nachgedacht hat als du."),
  choices:[{label:"Ja, jetzt",hint:"",roll:[{p:1,text:"Ihr redet den ganzen Vormittag. Am Ende seid ihr euch einig.",fx:{morale:14,flag:"kinderwunsch"}}]},
    {label:"Nach der Karriere",hint:"",roll:[{p:.6,text:"Sie versteht das, sagt aber, dass sie nicht ewig warten will.",fx:{morale:-6}},
      {p:.4,text:"Der Satz steht monatelang zwischen euch.",fx:{morale:-14,form:-6}}]}]},
{ id:"geburt", tag:"Privat", w:13, g:"m", cond:p=>(p.flags.kinderwunsch||(p.life.status==="verheiratet"&&p.age>=24))&&p.life.kids===0, title:T("Es geht los"),
  text:T("Der Anruf kommt in der 62. Minute eines Auswärtsspiels. Du sitzt auf der Bank und siehst dein Handy auf dem Trikot leuchten."),
  choices:[{label:"Sofort losfahren",hint:"",roll:[{p:1,text:"Du schaffst es zwanzig Minuten vor der Geburt. Alles andere ist an diesem Tag völlig egal.",fx:{kids:1,morale:26,trust:-6,fitness:-6}}]},
    {label:"Spiel zu Ende bringen",hint:"",roll:[{p:1,text:"Du kommst in der Nacht an. Sie sagt, sie versteht es. Ganz sicher bist du dir nicht.",fx:{kids:1,morale:12,trust:8}}]}]},
{ id:"ungeplant", tag:"Privat", w:6, g:"m", cond:p=>["beziehung","verlobt"].includes(p.life.status)&&p.life.kids===0&&p.age>=21, title:T("Ein Test auf dem Badezimmerregal"),
  text:T("Ihr hattet das eigentlich für später geplant. Jetzt liegt da ein Streifen, der die Reihenfolge über den Haufen wirft."),
  choices:[{label:"Sich darauf freuen",hint:"",roll:[{p:1,text:"Nach dem ersten Schreck ist ziemlich schnell klar, dass ihr euch freut. Sieben Monate später ist es soweit.",fx:{kids:1,morale:20,fitness:-6,flag:"kinderwunsch"}}]},
    {label:"Erstmal Panik",hint:"",roll:[{p:1,text:"Zwei Wochen redet ihr über nichts anderes. Danach freut ihr euch trotzdem, nur mit mehr Plan.",fx:{kids:1,morale:12,form:-5,flag:"kinderwunsch"}}]}]},
{ id:"babynacht", tag:"Privat", w:9, g:"m", cond:p=>p.life.kids>=1&&!p.flags.babynacht, title:T("Vier Monate kaum Schlaf"),
  text:T("Der Kleine schläft nicht durch, und du trainierst morgens um halb zehn. Der Athletiktrainer fragt, ob alles in Ordnung sei."),
  choices:[{label:"Nächte übernehmen",hint:"",roll:[{p:1,text:"Du stehst mit auf, jede zweite Nacht. Auf dem Platz merkt man es, zu Hause zählt es.",fx:{morale:12,fitness:-14,form:-7,flag:"babynacht"}}]},
    {label:"Ihr die Nächte überlassen",hint:"",roll:[{p:1,text:"Du schläfst durch und spielst besser. Sie sagt nichts, aber sie merkt es sich.",fx:{fitness:6,form:6,morale:-11,flag:"babynacht"}}]}]},
{ id:"zweiteskind", tag:"Privat", w:7, g:"m", cond:p=>p.life.kids===1&&p.life.status==="verheiratet"&&p.age>=26, title:T("Ein zweites Kind"),
  text:T("Das erste ist gerade aus dem Gröbsten raus. Jetzt oder erst in ein paar Jahren."),
  choices:[{label:"Jetzt",hint:"",roll:[{p:1,text:"Neun Monate später seid ihr zu viert. Das Haus ist voll, der Schlaf knapp, die Stimmung gut.",fx:{kids:1,morale:18,fitness:-8}}]},
    {label:"Später",hint:"",roll:[{p:1,text:"Ihr verschiebt es. Erstmal reicht es so.",fx:{morale:3}}]}]},
{ id:"kitaplatz", tag:"Privat", w:6, cond:p=>p.life.kids>=1, title:T("Kita, Schule, Alltag"),
  text:T("Ihr wohnt vierzig Minuten vom Trainingsgelände weg, und die Kita ist genau in die andere Richtung."),
  choices:[{label:"Näher an die Kita ziehen",hint:"",roll:[{p:1,text:"Kürzere Wege für die Familie, längere für dich. Das ist es wert.",fx:{morale:11,fitness:-4,money:-.09}}]},
    {label:"Nach dem Training fahren",hint:"",roll:[{p:1,text:"Du übernimmst die Nachmittage. Die Regeneration leidet.",fx:{morale:8,fitness:-7}}]}]},
{ id:"ehekrise", tag:"Privat", w:5, cond:p=>p.life.status==="verheiratet"&&p.life.since!==null, title:T("Es kriselt"),
  text:T("Ihr redet seit Wochen nur noch über Termine. Beim Abendessen sagt sie, dass sie sich fühlt wie eine Angestellte deines Kalenders."),
  choices:[{label:"Paartherapie vorschlagen",hint:"",roll:[{p:.72,text:"Nach vier Monaten geht es euch beiden deutlich besser. Kostet Zeit und Überwindung.",fx:{morale:14,money:-.05,fitness:-3}},
    {p:.28,text:"Ihr geht hin, aber es kommt zu spät. Ihr trennt euch im Guten.",fx:{split:true,divorce:true,morale:-20,form:-10}}]},
    {label:"Aussitzen",hint:"",roll:[{p:.35,text:"Es beruhigt sich von selbst, als die Saison vorbei ist.",fx:{morale:-6}},
      {p:.65,text:"Ein halbes Jahr später zieht sie aus. Die Scheidung kostet dich einen erheblichen Teil deines Vermögens.",fx:{split:true,divorce:true,morale:-26,form:-14}}]}]},
{ id:"neubeziehung", tag:"Privat", w:7, cond:p=>p.life.status==="getrennt", title:T("Nach der Trennung"),
  text:T("Ein halbes Jahr allein war in Ordnung. Jetzt fragt jemand, ob du am Wochenende Zeit hast."),
  choices:[{label:"Ja sagen",hint:"",roll:[{p:.72,text:c=>`Es entwickelt sich langsam und ohne Drama. ${c.pn} weiß, worauf sie sich einlässt.`,fx:{newPartner:true,morale:16,form:6}},
    {p:.28,text:"Es fühlt sich noch zu früh an. Ihr belasst es bei einem Abend.",fx:{morale:-3}}]},
    {label:"Erstmal allein bleiben",hint:"",roll:[{p:1,text:"Du sortierst dich. Der Fußball hilft dabei mehr als gedacht.",fx:{form:8,morale:4}}]}]},
{ id:"sorgerecht", tag:"Privat", w:7, cond:p=>p.life.status==="getrennt"&&p.life.kids>=1, title:T("Wochenendvater"),
  text:T("Die Regelung sieht jedes zweite Wochenende vor. Nur liegen deine Spiele meistens genau dann."),
  choices:[{label:"Neue Regelung aushandeln",hint:"",roll:[{p:.7,text:"Ihr einigt euch auf die spielfreien Tage in der Woche. Anstrengend, aber du siehst deine Kinder.",fx:{morale:12,fitness:-5}},
    {p:.3,text:"Es endet vor Gericht. Teuer und zermürbend.",fx:{money:-.25,morale:-16,form:-8}}]},
    {label:"Es so lassen",hint:"",roll:[{p:1,text:"Du siehst sie in der Saison kaum. Das nagt.",fx:{morale:-14}}]}]},
{ id:"schwieger", tag:"Privat", w:4, cond:p=>["verlobt","verheiratet"].includes(p.life.status), title:T("Dein Schwiegervater hat eine Meinung"),
  text:T("Er ist seit vierzig Jahren Anhänger des Vereins, gegen den ihr am Samstag spielt, und er sagt dir das jedes Mal."),
  choices:[{label:"Mitspielen",hint:"",roll:[{p:1,text:"Ihr wettet eine Kiste Bier. Du gewinnst und lässt ihn das ein Jahr lang spüren.",fx:{morale:8,form:5}}]},
    {label:"Thema wechseln",hint:"",roll:[{p:1,text:"Du redest über den Garten. Auch eine Lösung.",fx:{morale:2}}]}]},
{ id:"partnerjob", tag:"Privat", w:4, cond:p=>["beziehung","verlobt","verheiratet"].includes(p.life.status), title:T("Sie bekommt ein Angebot"),
  text:c=>`${c.pn} könnte eine Stelle haben, für die ihr umziehen müsstet. Sie hat lange auf sowas gewartet.`,
  choices:[{label:"Ihr den Vortritt lassen",hint:"",roll:[{p:1,text:"Du pendelst ab jetzt. Sie sagt, das vergisst sie dir nicht.",fx:{morale:14,fitness:-8,flag:"pendeln"}}]},
    {label:"Bitten, abzusagen",hint:"",roll:[{p:.5,text:"Sie sagt ab. Ihr redet lange darüber und findet einen Weg.",fx:{morale:-6,form:4}},
      {p:.5,text:"Sie sagt zu und geht. Zwischen euch ist es danach nie wieder ganz wie vorher.",fx:{split:true,morale:-18}}]}]},
{ id:"kindfussball", tag:"Privat", w:5, cond:p=>p.life.kids>=1&&p.age>=31, title:T("Dein Kind will in den Verein"),
  text:T("Sechs Jahre alt, Bambini, Samstagmorgen um neun. Der Trainer dort erkennt dich sofort."),
  choices:[{label:"Jedes Training mitgehen",hint:"",roll:[{p:1,text:"Du stehst am Spielfeldrand und sagst kein Wort. Das ist schwerer, als es klingt, und genau richtig.",fx:{morale:18,legacy:8}}]},
    {label:"Bewusst raushalten",hint:"",roll:[{p:1,text:"Du lässt sie fahren, damit dein Name nicht mitläuft. Vermutlich klug.",fx:{morale:6,legacy:4}}]}]},
{ id:"hochzeitstag", tag:"Privat", w:4, cond:p=>p.life.status==="verheiratet", title:T("Der Hochzeitstag liegt auf einem Spieltag"),
  text:T("Auswärts, dreihundert Kilometer, Rückkehr gegen Mitternacht."),
  choices:[{label:"Nachts noch was organisieren",hint:"",roll:[{p:1,text:"Du hast im Voraus alles vorbereitet. Um halb eins sitzt ihr auf dem Balkon.",fx:{morale:14,fitness:-4,money:-.03}}]},
    {label:"Verschieben",hint:"",roll:[{p:.6,text:"Ihr holt es am Dienstag nach. Passt schon.",fx:{morale:4}},
      {p:.4,text:"Du vergisst es komplett. Das gibt Ärger.",fx:{morale:-12}}]}]},
{ id:"hund", tag:"Privat", w:2, cond:p=>!p.flags.hund&&p.money>=.3, title:T("Ein Hund zieht ein"),
  text:T("Aus dem Tierheim, drei Jahre alt, misstrauisch gegenüber allem außer dir."),
  choices:[{label:"Mitnehmen",hint:"",roll:[{p:1,text:"Jeden Morgen eine Stunde raus, egal wie das Spiel ausging. Das erdet mehr als jede Therapie.",fx:{morale:14,fitness:4,money:-.02,flag:"hund"}}]},
    {label:"Passt gerade nicht",hint:"",roll:[{p:1,text:"Zu viele Auswärtsfahrten. Vernünftig.",fx:{}}]}]},
{ id:"elternkrank", tag:"Privat", w:2, cond:p=>p.age>=27, title:T("Anruf aus der Heimat"),
  text:T("Dein Vater liegt im Krankenhaus. Nichts Akutes, sagen sie, aber sie sagen es zu ruhig."),
  choices:[{label:"Sofort hinfahren",hint:"",roll:[{p:1,text:"Du fehlst zwei Tage im Training und sitzt dafür an seinem Bett. Er tut so, als sei das übertrieben, und freut sich sehr.",fx:{morale:10,trust:-5,fitness:-4}}]},
    {label:"Nach dem Spiel",hint:"",roll:[{p:1,text:"Du spielst, fährst danach und kommst spät an. Es geht ihm besser.",fx:{morale:2,trust:4}}]}]},
{ id:"freundausjugend", tag:"Privat", w:2, cond:p=>p.money>=.35&&p.age>=20, title:T("Ein alter Freund braucht Hilfe"),
  text:T("Er hat sich mit einer Selbstständigkeit übernommen und traut sich kaum zu fragen."),
  choices:[{label:"Aushelfen",hint:"",roll:[{p:.6,text:"Er zahlt in Raten zurück, jeden Monat pünktlich. Eure Freundschaft hält.",fx:{money:-.15,morale:8}},
    {p:.4,text:"Das Geld ist weg und die Freundschaft auch.",fx:{money:-.15,morale:-12}}]},
    {label:"Beim Aufräumen helfen statt zahlen",hint:"",roll:[{p:1,text:"Du gehst mit ihm zur Beratungsstelle und sitzt drei Termine ab. Das hilft mehr als Geld.",fx:{morale:9}}]}]},
/* ================= LÄNDER UND LIGEN ================= */
{ id:"l_winter", tag:"Land", w:4, rep:4, cond:p=>["GER","AUT","SUI","POL","CZE","UKR"].includes(p.club.c)&&p.seasons.length>=1, title:T("Winterpause"),
  text:T("Sechs Wochen ohne Pflichtspiel. Der Verein fliegt Anfang Januar ins Warme, davor liegen zwei Wochen frei."),
  choices:[{label:"Durchtrainieren",hint:"",roll:[{p:1,text:"Du nimmst nur drei Tage komplett raus. Im Trainingslager bist du der Einzige, der nicht schnauft.",fx:{fitness:11,trust:8,morale:-6}}]},
    {label:"Wirklich abschalten",hint:"",roll:[{p:1,text:"Zwei Wochen Familie, Essen, Schlafen. Der Kopf ist danach frei, die Beine schwer.",fx:{morale:14,fitness:-7,form:5}}]}]},
{ id:"l_boxing", tag:"Land", w:3, rep:5, cond:p=>p.club.c==="ENG", title:T("Weihnachten in England"),
  text:T("Vier Spiele in elf Tagen, dazwischen Heiligabend im Hotel. Winterpause gibt es hier nicht."),
  choices:[{label:"Alle vier spielen",hint:"",roll:[{p:.6,text:"Du überstehst die Englischen Wochen und stehst danach fest in der Elf.",fx:{trust:14,form:8,fitness:-14}},
    {p:.4,text:"Im letzten Spiel zwickt die Wade. Zwei Wochen raus.",fx:{forceInjury:"leicht",trust:8,fitness:-12}}]},
    {label:"Ein Spiel aussetzen",hint:"",roll:[{p:1,text:"Der Trainer rotiert dich raus. Du kommst besser durch die Rückrunde.",fx:{fitness:6,trust:-5}}]}]},
{ id:"l_clasico", tag:"Land", w:3, rep:5, cond:p=>["ESP"].includes(p.club.c)&&p.club.s>=76, title:T("Woche vor dem großen Spiel"),
  text:T("Seit Montag steht ein Übertragungswagen vor dem Trainingsgelände. Jede Übung wird gefilmt und ausgewertet."),
  choices:[{label:"Die Aufmerksamkeit annehmen",hint:"",roll:[{p:.55,text:"Du lieferst im wichtigsten Spiel des Jahres und bist über Nacht international bekannt.",fx:{rep:18,form:12,morale:10}},
    {p:.45,text:"Du willst zu viel und wirst zur Pause ausgewechselt.",fx:{form:-12,trust:-8,morale:-10}}]},
    {label:"Alles ausblenden",hint:"",roll:[{p:1,text:"Kopfhörer auf, Handy aus. Ein solides Spiel ohne Aufreger.",fx:{trust:6,note:.08}}]}]},
{ id:"l_tifo", tag:"Land", w:4, rep:4, cond:p=>["ITA","GRE","TUR","SRB","CRO","POL"].includes(p.club.c)&&p.seasons.length>=1, title:T("Die Kurve macht Druck"),
  text:T("Eine Abordnung steht nach dem Training am Zaun. Nicht bedrohlich, aber sehr deutlich."),
  choices:[{label:"Zuhören und antworten",hint:"",roll:[{p:.72,text:"Du redest zwanzig Minuten mit ihnen. Beim nächsten Heimspiel hängt eine Choreo mit deiner Nummer.",fx:{rep:12,morale:8,form:6}},
    {p:.28,text:"Es wird lauter, als dir lieb ist. Der Verein stellt danach Ordner ab.",fx:{morale:-10,rep:4}}]},
    {label:"Den Verein regeln lassen",hint:"",roll:[{p:1,text:"Der Sicherheitsbeauftragte übernimmt. Die Kurve findet dich ab jetzt distanziert.",fx:{rep:-6,trust:4}}]}]},
{ id:"l_hitze", tag:"Land", w:4, rep:4, cond:p=>["KSA","EGY","MAR"].includes(p.club.c)&&p.seasons.length>=1, title:T("Training um Mitternacht"),
  text:T("Tagsüber sind es 44 Grad. Die Einheiten liegen um 23 Uhr, Spiele um 21 Uhr, dein Schlafrhythmus ist im Eimer."),
  choices:[{label:"Komplett umstellen",hint:"",roll:[{p:1,text:"Nach sechs Wochen lebst du nachts und schläfst vormittags. Der Körper macht es mit.",fx:{fitness:9,morale:-6,phy:1}}]},
    {label:"Am alten Rhythmus festhalten",hint:"",roll:[{p:1,text:"Du bist ständig müde und weißt nie genau, warum.",fx:{fitness:-11,form:-6,morale:-4}}]}]},
{ id:"l_reisen", tag:"Land", w:4, rep:4, cond:p=>["USA","BRA","ARG"].includes(p.club.c)&&p.seasons.length>=1, title:T("Fünf Stunden Flug zum Auswärtsspiel"),
  text:T("Drei Zeitzonen hin, drei zurück, und am Mittwoch steht schon das nächste Spiel an."),
  choices:[{label:"Im Flieger konsequent schlafen",hint:"",roll:[{p:1,text:"Kompressionsstrümpfe, Schlafmaske, kein Bildschirm. Klingt spießig, wirkt aber.",fx:{fitness:7,phy:1}}]},
    {label:"Durchziehen wie immer",hint:"",roll:[{p:1,text:"Nach dem vierten Trip in sechs Wochen fühlen sich die Beine an wie geliehen.",fx:{fitness:-12,form:-6}}]}]},
{ id:"l_strasse", tag:"Land", w:3, rep:5, cond:p=>(["BRA","ARG"].includes(p.club.c)||["BRA","ARG"].includes(p.nation.id))&&p.seasons.length>=1, title:T("Zurück auf dem Platz von früher"),
  text:T("Betonboden, kaputte Netze, zwanzig Kinder, die genau wissen, wer du bist."),
  choices:[{label:"Mitspielen",hint:"",roll:[{p:.8,text:"Zwei Stunden Straßenfußball. Dein Dribbling erinnert sich an Sachen, die du im Verein verlernt hast.",fx:{dri:2,morale:14,rep:6}},
    {p:.2,text:"Du knickst auf dem unebenen Boden um. Peinlich und schmerzhaft.",fx:{forceInjury:"leicht",morale:4}}]},
    {label:"Nur Fotos machen",hint:"",roll:[{p:1,text:"Du bleibst zwanzig Minuten und schreibst Autogramme.",fx:{rep:5,morale:6}}]}]},
{ id:"l_position", tag:"Land", w:2, cond:p=>p.club.c==="NED", title:T("Positionsspiel bis zum Umfallen"),
  text:T("Der Trainer lässt jede Einheit dieselbe Rondo-Form spielen. Wer den Ball verliert, geht in die Mitte."),
  choices:[{label:"Verbissen mitmachen",hint:"",roll:[{p:1,text:"Nach einem halben Jahr spielst du unter Druck sauberer als je zuvor.",fx:{pas:3,dri:1,note:.08}}]},
    {label:"Innerlich abhaken",hint:"",roll:[{p:1,text:"Du machst mit, ohne dabei zu sein. Bringt also wenig.",fx:{morale:-4}}]}]},
{ id:"l_oldfirm", tag:"Land", w:2, cond:p=>p.club.c==="SCO", title:T("Die Stadt ist zweigeteilt"),
  text:T("Seit Montag wirst du in jedem Geschäft darauf angesprochen. Es gibt hier keine Neutralität."),
  choices:[{label:"Sich klar bekennen",hint:"",roll:[{p:1,text:"Die eigenen Fans lieben dich dafür, die anderen pfeifen dich zwei Jahre lang aus.",fx:{rep:10,morale:8,form:6}}]},
    {label:"Diplomatisch bleiben",hint:"",roll:[{p:1,text:"Du sagst, du spielst für den Verein, der dich bezahlt. Kommt nirgends gut an.",fx:{rep:-4}}]}]},

/* ================= POSITION ================= */
{ id:"pos_tw1", tag:"Position", w:4, rep:4, cond:p=>p.pos==="TW", title:T("Der Fehler in der 89. Minute"),
  text:T("Ein Rückpass, ein Ausrutscher, ein Gegentor. Das Bild läuft am Abend in jeder Sendung."),
  choices:[{label:"Sofort hinstellen und reden",hint:"",roll:[{p:1,text:"Du gehst als Erster vor die Kameras und nimmst alles auf dich. Die Mannschaft steht danach geschlossen hinter dir.",fx:{trust:12,rep:6,morale:-6,form:-4}}]},
    {label:"Nichts sagen",hint:"",roll:[{p:1,text:"Zwei Wochen lang wirst du bei jedem Rückpass ausgepfiffen.",fx:{form:-12,morale:-12,trust:-6}}]}]},
{ id:"pos_tw2", tag:"Position", w:3, rep:5, cond:p=>p.pos==="TW", title:T("Elfmeterschießen im Pokal"),
  text:T("Fünf Schützen, und du hast dir alle Videos angeschaut. Der vierte schießt angeblich immer links."),
  choices:[{label:"Auf die Analyse vertrauen",hint:"",roll:[{p:.55,text:"Zwei gehalten, beide in die vorbereitete Ecke. Du wirst zum Helden des Abends.",fx:{rep:16,form:14,morale:16,trust:12}},
    {p:.45,text:"Alle fünf gehen ins Eck, in das du dich nicht bewegt hast.",fx:{morale:-12,form:-6}}]},
    {label:"Auf Instinkt gehen",hint:"",roll:[{p:.45,text:"Einer gehalten, das reicht.",fx:{rep:10,form:10,morale:10}},{p:.55,text:"Kein einziger. Ihr scheidet aus.",fx:{morale:-10}}]}]},
{ id:"pos_tw3", tag:"Position", w:3, cond:p=>p.pos==="TW"&&p.age<=24, title:T("Der Torwarttrainer will dein Spiel umbauen"),
  text:T("Höhere Grundposition, mehr Fuß, weniger Linie. Anfangs fühlt sich das an wie ein Fehler pro Spiel."),
  choices:[{label:"Umstellen",hint:"",roll:[{p:1,text:"Ein halbes Jahr wackelig, danach spielst du in einer anderen Kategorie.",fx:{pas:4,dri:2,form:-9,pot:3}}]},
    {label:"Auf der Linie bleiben",hint:"",roll:[{p:1,text:"Du hältst, was zu halten ist. Für die ganz großen Klubs reicht das nicht.",fx:{def:2,pot:-2,trust:-4}}]}]},
{ id:"pos_iv1", tag:"Position", w:3, rep:5, cond:p=>p.pos==="IV", title:T("Eigentor in der Nachspielzeit"),
  text:T("Klärungsversuch, abgefälscht, unhaltbar. Das 1:1 fühlt sich an wie eine Niederlage."),
  choices:[{label:"Als Erster in die Kabine gehen",hint:"",roll:[{p:1,text:"Du sagst vor allen, dass es an dir lag. Danach ist die Sache erledigt.",fx:{trust:10,morale:-6}}]},
    {label:"Auf den Abpraller schieben",hint:"",roll:[{p:1,text:"Kommt nicht gut an. Bei den Videos am Montag ist es sehr still.",fx:{trust:-10,morale:-8}}]}]},
{ id:"pos_iv2", tag:"Position", w:3, cond:p=>p.pos==="IV"||p.pos==="AV", title:T("Der schnellste Stürmer der Liga"),
  text:T("Am Sonntag stehst du gegen jemanden, der jede Woche zwei Verteidiger stehen lässt."),
  choices:[{label:"Tief stehen und zumachen",hint:"",roll:[{p:.7,text:"Er kommt kein einziges Mal an dir vorbei. Die Zeitung nennt dich am Montag beim Namen.",fx:{def:2,rep:8,form:10,note:.1}},
    {p:.3,text:"Beim einzigen langen Ball ist er weg. 0:1.",fx:{form:-8,morale:-6}}]},
    {label:"Früh attackieren",hint:"",roll:[{p:.4,text:"Du erwischst ihn zweimal im Aufbau. Er wird zur Pause ausgewechselt.",fx:{def:2,rep:10,form:12}},
      {p:.6,text:"Zweimal überlaufen, dazu Gelb. Ein langer Nachmittag.",fx:{form:-11,trust:-6}}]}]},
{ id:"pos_av", tag:"Position", w:3, cond:p=>p.pos==="AV", title:T("Hinten dicht oder vorne mitspielen"),
  text:T("Der Trainer will, dass du hoch schiebst. Der Innenverteidiger neben dir will, dass du bleibst."),
  choices:[{label:"Nach vorne schieben",hint:"",roll:[{p:.6,text:"Vier Vorlagen in acht Spielen. Die Diskussion ist beendet.",fx:{pac:1,pas:2,rep:7,form:8}},
    {p:.4,text:"Zweimal wirst du ausgekontert. Der Innenverteidiger sagt nichts, guckt aber.",fx:{def:-1,trust:-8,form:-6}}]},
    {label:"Absichern",hint:"",roll:[{p:1,text:"Solide, unauffällig, der Trainer hätte gern mehr gesehen.",fx:{def:2,trust:-3,note:.05}}]}]},
{ id:"pos_zdm", tag:"Position", w:3, cond:p=>p.pos==="ZDM"||p.pos==="ZM", title:T("Vierte Gelbe Karte im Oktober"),
  text:T("Noch eine und du fehlst im Derby. Deine Spielweise lebt aber genau von diesen Zweikämpfen."),
  choices:[{label:"Weiter voll reingehen",hint:"",roll:[{p:.5,text:"Du kommst ohne weitere Karte durch und bist beim Derby dabei.",fx:{trust:8,form:8}},
    {p:.5,text:"Gelb-Sperre genau vor dem Derby.",fx:{ban2:1,trust:-8,morale:-10}}]},
    {label:"Zurücknehmen",hint:"",roll:[{p:1,text:"Du gehst seltener rein und wirkst zahnlos. Dafür bist du im Derby dabei.",fx:{def:-1,note:.1,form:-4}}]}]},
{ id:"pos_zm", tag:"Position", w:3, cond:p=>["ZM","ZOM"].includes(p.pos), title:T("Der Trainer will mehr Tempo im Spiel"),
  text:T("Zwei Kontakte maximal, sagt er. Du brauchst normalerweise drei."),
  choices:[{label:"Umstellen",hint:"",roll:[{p:1,text:"Anfangs verlierst du reihenweise Bälle. Nach zwei Monaten ist dein Spiel schneller als vorher.",fx:{pas:3,form:-7,pot:2}}]},
    {label:"Dein Tempo behalten",hint:"",roll:[{p:1,text:"Du spielst schön, aber der Trainer sieht darin ein Problem.",fx:{dri:1,trust:-9}}]}]},
{ id:"pos_fluegel", tag:"Position", w:3, cond:p=>p.pos==="AF", title:T("Seitenwechsel"),
  text:T("Der Trainer will dich auf die andere Seite stellen, damit du nach innen ziehen kannst."),
  choices:[{label:"Probieren",hint:"",roll:[{p:.68,text:"Von der falschen Seite nach innen und abziehen. Sechs Tore mehr als in der Vorsaison.",fx:{sho:3,dri:1,form:10,rep:6}},
    {p:.32,text:"Du findest die Räume nicht und wirkst verloren.",fx:{form:-10,trust:-6}}]},
    {label:"Auf der gewohnten Seite bleiben",hint:"",roll:[{p:1,text:"Flanke um Flanke. Verlässlich, aber ausrechenbar.",fx:{pas:2,note:.05}}]}]},
{ id:"pos_st1", tag:"Position", w:4, rep:4, cond:p=>p.pos==="ST", title:T("Elf Spiele ohne Tor"),
  text:T("Du triffst den Ball gut, er geht nur nirgends rein. Beim letzten Heimspiel gab es Pfiffe, als dein Name durchgesagt wurde."),
  choices:[{label:"Nach dem Training Extraschichten",hint:"",roll:[{p:.65,text:"Hundert Abschlüsse am Tag. Beim nächsten Spiel fällt er nach zwölf Minuten, und danach läuft es wieder.",fx:{sho:2,form:14,morale:10}},
    {p:.35,text:"Du wirst immer verkrampfter. Die Flaute hält an.",fx:{form:-12,morale:-14,trust:-8}}]},
    {label:"Für die Mannschaft arbeiten",hint:"",roll:[{p:1,text:"Du legst auf, statt selbst zu schießen. Der Trainer schätzt es, die Statistik nicht.",fx:{pas:2,trust:9,note:.1}}]}]},
{ id:"pos_st2", tag:"Position", w:2, cond:p=>p.pos==="ST"&&p.tot.goals>=40, title:T("Vereinsrekord in Reichweite"),
  text:T("Noch drei Tore bis zur Bestmarke des Klubs. Alle wissen es, und alle reden darüber."),
  choices:[{label:"Bewusst darauf zuspielen",hint:"",roll:[{p:.55,text:"Du knackst ihn im vorletzten Heimspiel. Das Stadion steht.",fx:{rep:16,morale:18,legacy:14,form:8}},
    {p:.45,text:"Du willst zu sehr und triffst in acht Spielen nicht.",fx:{form:-12,morale:-10}}]},
    {label:"Nicht drüber nachdenken",hint:"",roll:[{p:1,text:"Du spielst normal weiter. Ob er fällt, entscheidet sich von selbst.",fx:{form:6,note:.06}}]}]},

/* ================= VEREIN UND SAISONVERLAUF ================= */
{ id:"v_abstieg", tag:"Verein", w:6, rep:3, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(p.age>=19&&s&&s.rank>s.N*.62);}, title:T("Abstiegskampf im Frühjahr"),
  text:T("Vier Punkte Rückstand bei sieben ausstehenden Spielen. Der Verein hat eine Krisensitzung anberaumt."),
  choices:[{label:"Vorangehen",hint:"",roll:[{p:.55,text:"Du machst in den letzten Wochen zwei Spiele fast allein. Der Klassenerhalt gelingt.",fx:{trust:16,rep:12,form:12,fitness:-9,legacy:6}},
    {p:.45,text:"Es reicht nicht. Der Abstieg steht zwei Spieltage vor Schluss fest.",fx:{morale:-18,rep:-4}}]},
    {label:"Ruhig bleiben und Fehler vermeiden",hint:"",roll:[{p:1,text:"Du spielst fehlerfrei und unauffällig. Am Ende entscheiden andere.",fx:{note:.1,trust:4}}]}]},
{ id:"v_aufstieg", tag:"Verein", w:6, rep:3, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(!!TIER[p.club.l]&&!!TIER[p.club.l][0]&&s&&s.rank<=Math.max(6,s.N*.4));}, title:T("Endspurt um den Aufstieg"),
  text:T("Drei Spiele, zwei Siege reichen. Die Stadt redet über nichts anderes mehr."),
  choices:[{label:"Alles auf diese drei Wochen",hint:"",roll:[{p:.6,text:"Zwei Tore, eine Vorlage, Aufstieg. Danach zwei Tage Ausnahmezustand.",fx:{form:14,rep:12,morale:18,fitness:-10}},
    {p:.4,text:"Im entscheidenden Spiel läuft nichts zusammen. Nächstes Jahr wieder.",fx:{morale:-14,form:-8}}]},
    {label:"Nüchtern bleiben",hint:"",roll:[{p:1,text:"Du behandelst es wie jedes andere Spiel. Hilft dir, nicht der Mannschaft.",fx:{note:.08,morale:2}}]}]},
{ id:"v_investor", tag:"Verein", w:3, cond:p=>p.club.s<=80, title:T("Ein Investor steigt ein"),
  text:T("Neues Geld, neue Ziele, neue Leute in der sportlichen Leitung. Die Fans protestieren seit drei Wochen."),
  choices:[{label:"Sich öffentlich auf die Seite der Fans stellen",hint:"",roll:[{p:1,text:"Die Kurve feiert dich, die Führungsetage merkt es sich.",fx:{rep:12,morale:8,trust:-14}}]},
    {label:"Raushalten",hint:"",roll:[{p:1,text:"Du sagst, du bist Angestellter. Wahr, aber niemand mag die Antwort.",fx:{trust:6,rep:-5}}]},
    {label:"Das Geld begrüßen",hint:"",roll:[{p:1,text:"Der Verein rüstet auf, du bekommst bessere Mitspieler und schlechtere Stimmung im Stadion.",fx:{trust:12,rep:-8,form:5}}]}]},
{ id:"v_insolvenz", tag:"Verein", w:2, cond:p=>p.club.s<=64&&p.contract>=1, title:T("Die Gehälter kommen zu spät"),
  text:T("Zweiter Monat in Folge. In der Kabine kursiert das Wort Insolvenz."),
  choices:[{label:"Bleiben und mitziehen",hint:"",roll:[{p:.55,text:"Der Verein wird gerettet, die Nachzahlung kommt. Du giltst hier ab jetzt als Legende.",fx:{money:.1,rep:12,trust:16,legacy:10}},
    {p:.45,text:"Punktabzug und ein halbes Jahr ohne volles Gehalt.",fx:{money:-.2,morale:-14}}]},
    {label:"Vertragsauflösung fordern",hint:"",roll:[{p:1,text:"Du kommst raus, aber ablösefrei und mit einem Ruf als jemand, der zuerst geht.",fx:{freeAgent:true,rep:-9,trust:-18}}]}]},
{ id:"v_meister", tag:"Verein", w:5, rep:3, cond:p=>sameClub(p)&&(p.club.s>=82&&p.seasons.length>=1&&p.seasons[p.seasons.length-1].rank<=4), title:T("Titelendspurt"),
  text:T("Ein Punkt Vorsprung, vier Spieltage. Jeder Trainingsfehler wird auseinandergenommen."),
  choices:[{label:"Die Jüngeren mitnehmen",hint:"",roll:[{p:1,text:"Du redest vor jedem Spiel mit den Neuen. Am Ende reicht es, und alle wissen, wer die Kabine zusammengehalten hat.",fx:{trust:14,legacy:10,form:8,rep:6}}]},
    {label:"Nur auf dich schauen",hint:"",roll:[{p:.55,text:"Deine Zahlen stimmen, der Titel kommt.",fx:{form:12,rep:8}},{p:.45,text:"Ihr gebt die Führung am letzten Spieltag her.",fx:{morale:-18,form:-8}}]}]},
{ id:"v_trainerraus", tag:"Verein", w:5, rep:3, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&(s.rank>s.N*.55||p.lastNote>3.6));}, title:T("Der Trainer wird entlassen"),
  text:T("Dienstagmorgen, halb neun, Aushang am schwarzen Brett. Er verabschiedet sich in vier Sätzen."),
  choices:[{label:"Ihn zum Auto bringen",hint:"",roll:[{p:1,text:"Ihr steht zwanzig Minuten am Parkplatz. So etwas spricht sich in der Branche herum.",fx:{rep:6,morale:-5,legacy:4}}]},
    {label:"Sofort auf den Neuen einstellen",hint:"",roll:[{p:1,text:"Du bist am Mittwoch der Erste im Kraftraum, als der Nachfolger vorgestellt wird.",fx:{trust:10,form:5,morale:-3}}]}]},
{ id:"v_kapitaenswahl", tag:"Verein", w:2, cond:p=>p.age>=26&&!p.flags.kapitaen, title:T("Die Mannschaft wählt den Kapitän"),
  text:T("Zettelwahl in der Kabine. Du weißt, dass du Stimmen bekommst, aber nicht wie viele."),
  choices:[{label:"Kandidieren",hint:"",roll:[{p:.5,text:"Du wirst gewählt. Ab jetzt gehört dir die Ansprache vor dem Anpfiff.",fx:{flag:"kapitaen",rep:10,trust:12,morale:10,legacy:8}},
    {p:.5,text:"Zwei Stimmen. Das sitzt tiefer, als du zugeben würdest.",fx:{morale:-12}}]},
    {label:"Nicht antreten",hint:"",roll:[{p:1,text:"Du unterstützt den, der es macht. Auch eine Rolle.",fx:{trust:5}}]}]},
{ id:"v_kleinklub", tag:"Verein", w:3, cond:p=>p.club.s<=60, title:T("Alles selber machen"),
  text:T("Hier gibt es keine zwölf Betreuer. Die Trikots wäscht jemand, der auch den Rasen mäht."),
  choices:[{label:"Mit anpacken",hint:"",roll:[{p:1,text:"Du hilfst beim Aufbau und lernst alle beim Vornamen kennen. Der Klub wird für ein paar Jahre dein Zuhause.",fx:{morale:14,trust:12,rep:4}}]},
    {label:"Auf Profibedingungen bestehen",hint:"",roll:[{p:1,text:"Du bekommst deinen Willen und gleichzeitig einen Ruf weg.",fx:{fitness:6,trust:-12,morale:-4}}]}]},

/* ================= POKAL UND EUROPA ================= */
{ id:"k_amateur", tag:"Pokal", w:4, rep:3, cond:p=>p.seasons.length>=1, title:T("Erste Pokalrunde beim Viertligisten"),
  text:T("Aschenbahn, dreitausend Zuschauer, ein Platz wie ein Acker. Nichts zu gewinnen und alles zu verlieren."),
  choices:[{label:"Von Anfang an ernst nehmen",hint:"",roll:[{p:.82,text:"3:0 nach dreißig Minuten. Danach spielt ihr es locker runter.",fx:{form:6,trust:6}},
    {p:.18,text:"Ihr verliert nach Elfmeterschießen. Die Bilder laufen tagelang.",fx:{morale:-16,trust:-10,rep:-6}}]},
    {label:"Kräfte schonen",hint:"",roll:[{p:.5,text:"Es reicht knapp. Der Trainer ist trotzdem sauer.",fx:{fitness:6,trust:-6}},
      {p:.5,text:"Blamage in der ersten Runde.",fx:{morale:-18,trust:-14,rep:-8}}]}]},
{ id:"k_finale", tag:"Pokal", w:4, rep:4, cond:p=>p.club.s>=68&&p.seasons.length>=1, title:T("Pokalfinale"),
  text:T("Einmal neunzig Minuten, danach entscheidet sich, wie diese Saison in Erinnerung bleibt."),
  choices:[{label:"Alles riskieren",hint:"",roll:[{p:.5,text:"Du bist an beiden Toren beteiligt. Diesen Abend nimmt dir keiner mehr.",fx:{form:16,rep:18,morale:22,legacy:10}},
    {p:.5,text:"Ein Ballverlust vor dem Gegentor. Du wirst das Video nie wieder anschauen.",fx:{morale:-18,form:-10}}]},
    {label:"Absichern und auf Konter spielen",hint:"",roll:[{p:1,text:"Ein zähes Finale, das erst in der Verlängerung kippt.",fx:{note:.1,fitness:-8,morale:6}}]}]},
{ id:"e_erste", tag:"Europa", w:8, cond:p=>!!p.europeNext&&!p.seasons.some(s=>s.europe), title:T("Erster Europapokalabend"),
  text:T("Die Hymne läuft, das Stadion ist voll, und dir wird zum ersten Mal seit Jahren wieder flau."),
  choices:[{label:"Den Moment aufsaugen",hint:"",roll:[{p:1,text:"Du stehst länger im Mittelkreis als nötig. Danach machst du ein starkes Spiel.",fx:{morale:16,form:10,rep:8}}]},
    {label:"Wie jedes andere Spiel behandeln",hint:"",roll:[{p:1,text:"Funktioniert. Ist aber auch schade.",fx:{note:.08,trust:5}}]}]},
{ id:"e_ausw", tag:"Europa", w:4, rep:3, cond:p=>!!p.europeNext&&p.seasons.some(s=>s.europe), title:T("Auswärts in einem sehr lauten Stadion"),
  text:T("Beim Aufwärmen hörst du deinen Nebenmann nicht, obwohl er zwei Meter neben dir steht."),
  choices:[{label:"Sich davon tragen lassen",hint:"",roll:[{p:.5,text:"Ihr gewinnt gegen alle Erwartungen. Das schweißt zusammen.",fx:{form:12,morale:14,trust:8}},
    {p:.5,text:"Nach zwanzig Minuten steht es 0:2 und du hast noch keinen Ball gehabt.",fx:{form:-10,morale:-8}}]},
    {label:"Sich komplett abschotten",hint:"",roll:[{p:1,text:"Kopf runter, Aufgaben abarbeiten. Ein ordentliches 1:1.",fx:{note:.1,trust:5}}]}]},
{ id:"e_ausscheiden", tag:"Europa", w:4, rep:3, cond:p=>!!p.europeNext&&p.seasons.some(s=>s.europe), title:T("Ausgeschieden nach Elfmeterschießen"),
  text:T("Zwei Spiele, 240 Minuten, und am Ende entscheidet es der fünfte Schütze."),
  choices:[{label:"Zu den mitgereisten Fans gehen",hint:"",roll:[{p:1,text:"Zweitausend Leute klatschen euch trotzdem ab. Das trägt durch die nächsten Wochen.",fx:{rep:8,morale:6,trust:6}}]},
    {label:"Direkt in die Kabine",hint:"",roll:[{p:1,text:"Du willst niemanden sehen. Verständlich, kommt aber nicht gut an.",fx:{rep:-6,morale:-8}}]}]},

/* ================= REAKTION AUF TRANSFERS ================= */
{ id:"t_ankunft", tag:"Transfer", w:6, cond:p=>!!p.flags.justMoved, title:T("Erste Wochen beim neuen Verein"),
  text:c=>`Neue Kabine, neue Abläufe, und ${c.mate.name} ist der Einzige, der von sich aus mit dir redet.`,
  choices:[{label:"Aktiv auf alle zugehen",hint:"",roll:[{p:.75,text:"Nach drei Wochen bist du drin. Auf dem Platz merkt man es sofort.",fx:{trust:12,morale:10,form:8}},
    {p:.25,text:"Du wirkst zu forsch. Ein paar halten Abstand.",fx:{trust:-5,morale:-5}}]},
    {label:"Erstmal beobachten",hint:"",roll:[{p:1,text:"Du hältst dich zurück und wirst als schwierig eingeschätzt, bevor jemand dich kennt.",fx:{trust:-7,form:-5,morale:-4}}]}]},
{ id:"t_exverein", tag:"Transfer", w:6, cond:p=>!!p.prevClub, title:c=>`Rückspiel gegen ${c.prev}`,
  text:c=>`Du kennst dort jeden Handgriff. Und sie kennen dich. Die Kurve von ${c.prev} hat sich etwas überlegt.`,
  choices:[{label:"Nach einem Tor nicht jubeln",hint:"",roll:[{p:1,text:"Du hebst nur die Hand. Beide Seiten rechnen dir das an.",fx:{rep:9,morale:6,form:6}}]},
    {label:"Voll jubeln",hint:"",roll:[{p:1,text:"Du rennst zur gegnerischen Kurve. Ab jetzt bist du dort für immer der Feind.",fx:{rep:6,morale:8,form:8,trust:5}}]},
    {label:"Vorher hinfahren und Hallo sagen",hint:"",roll:[{p:1,text:"Du besuchst am Vortag die Zeugwarte und den Platzwart. Zwei Anrufe, große Wirkung.",fx:{rep:7,morale:8,legacy:4}}]}]},
{ id:"t_rekord", tag:"Transfer", w:4, cond:p=>!!p.flags.justMoved&&p.mv>=25, title:T("Rekordablöse lastet schwer"),
  text:T("Bei jedem Fehlpass raunt das Stadion. Die Summe steht in jeder Überschrift über deinem Namen."),
  choices:[{label:"Offen darüber reden",hint:"",roll:[{p:1,text:"Du sagst in einem Interview, dass dich die Zahl belastet. Das nimmt der Sache viel Wucht.",fx:{morale:12,rep:5,form:6}}]},
    {label:"Ignorieren und liefern wollen",hint:"",roll:[{p:.45,text:"Du drehst nach acht Wochen auf und alle vergessen die Summe.",fx:{form:12,rep:8}},
      {p:.55,text:"Du spielst verkrampft und wirst zur Zielscheibe.",fx:{form:-12,morale:-14}}]}]},
{ id:"t_pfiffe", tag:"Transfer", w:5, cond:p=>!!p.flags.wechselwunschAlt&&!p.flags.justMoved&&sameClub(p), title:T("Die eigenen Fans haben nicht vergessen"),
  text:T("Du hattest den Wechsel öffentlich erzwungen. Beim ersten Heimspiel pfeift der halbe Block bei deiner Ballberührung."),
  choices:[{label:"Sich hinstellen und entschuldigen",hint:"",roll:[{p:.7,text:"Du gehst nach dem Spiel allein vor die Kurve. Nach vier Wochen ist Ruhe.",fx:{rep:8,morale:8,form:6}},
    {p:.3,text:"Sie nehmen es dir nicht ab. Es bleibt eine zähe Saison.",fx:{morale:-12,form:-8}}]},
    {label:"Aussitzen",hint:"",roll:[{p:1,text:"Du spielst gegen dein eigenes Publikum an. Das kostet Kraft.",fx:{form:-8,morale:-8}}]}]},
{ id:"t_leihe_zurueck", tag:"Transfer", w:3, cond:p=>p.age<=24&&!p.flags.aufLeihe&&!!p.flags.warAufLeihe&&p.seasons.length>=2&&sameClub(p), title:T("Zurück von der Leihe"),
  text:T("Ein Jahr lang jede Woche gespielt. Jetzt stehst du wieder in einer Kabine, in der dich die Hälfte nicht kennt."),
  choices:[{label:"Selbstbewusst auftreten",hint:"",roll:[{p:.6,text:"Du zeigst im ersten Testspiel, was du gelernt hast. Der Trainer plant mit dir.",fx:{trust:14,form:10,morale:8}},
    {p:.4,text:"Es kommt als überheblich an. Du fängst wieder ganz hinten an.",fx:{trust:-10,morale:-8}}]},
    {label:"Klein anfangen",hint:"",roll:[{p:1,text:"Du arbeitest dich langsam hoch. Dauert, hält aber.",fx:{trust:7,form:4}}]}]},

/* ================= REAKTION AUF BESITZ ================= */
{ id:"b_auto", tag:"Besitz", w:3, rep:5, cond:p=>p.assets.includes("auto2"), title:T("Der Sportwagen fällt auf"),
  text:T("Ein Foto von dir und dem Wagen vor dem Trainingsgelände macht die Runde. Die Fanseite darunter diskutiert über Gehälter."),
  choices:[{label:"Ihn stehen lassen",hint:"",roll:[{p:1,text:"Du fährst wochenlang den Kombi. Die Diskussion verläuft.",fx:{rep:3,morale:-2}}]},
    {label:"Selbstironisch reagieren",hint:"",roll:[{p:.7,text:"Dein Kommentar dazu wird tausendfach geteilt. Sympathiepunkte.",fx:{rep:9,morale:6}},
      {p:.3,text:"Es wirkt herablassend. Das Thema wächst.",fx:{rep:-10,morale:-6}}]}]},
{ id:"b_villa", tag:"Besitz", w:2, cond:p=>p.assets.includes("villa")||p.assets.includes("haus"), title:T("Einbruch während des Auswärtsspiels"),
  text:T("Sie wussten genau, wann du nicht da bist. Der Zeitpunkt war kein Zufall."),
  choices:[{label:"Sicherheitsdienst engagieren",hint:"",roll:[{p:1,text:"Teuer, aber danach schläft die Familie wieder ruhig.",fx:{money:-.14,morale:6}}]},
    {label:"Nur die Versicherung regeln lassen",hint:"",roll:[{p:1,text:"Der Schaden wird ersetzt, das mulmige Gefühl bleibt.",fx:{morale:-10}}]}]},
{ id:"b_akademie", tag:"Besitz", w:3, cond:p=>p.assets.includes("akademie"), title:T("Der erste Absolvent deiner Akademie"),
  text:T("Ein Sechzehnjähriger aus deinem Jahrgang unterschreibt bei einem Erstligisten. Er bedankt sich in seinem ersten Interview bei dir."),
  choices:[{label:"Hinfahren und dabei sein",hint:"",roll:[{p:1,text:"Du sitzt bei der Unterschrift daneben. Das ist mehr wert als jeder eigene Titel.",fx:{morale:18,rep:10,legacy:20}}]},
    {label:"Nur gratulieren",hint:"",roll:[{p:1,text:"Ein Anruf, zehn Minuten. Er freut sich trotzdem.",fx:{morale:8,legacy:8}}]}]},
{ id:"b_anteile", tag:"Besitz", w:2, cond:p=>p.assets.includes("anteile")||p.assets.includes("amateur"), title:T("Mitgliederversammlung"),
  text:T("Als Anteilseigner darfst du reden. Es geht um den Bau einer neuen Nachwuchshalle, und die Stimmung ist gespalten."),
  choices:[{label:"Dafür sprechen",hint:"",roll:[{p:.7,text:"Deine Rede kippt die Abstimmung. Die Halle kommt.",fx:{rep:12,legacy:16,morale:8}},
    {p:.3,text:"Der Antrag scheitert knapp. Man wirft dir vor, Vereinspolitik zu machen.",fx:{rep:-6,morale:-6}}]},
    {label:"Nur zuhören",hint:"",roll:[{p:1,text:"Du hältst dich raus und wirst hinterher gefragt, warum.",fx:{morale:-3}}]}]},
{ id:"b_restaurant", tag:"Besitz", w:2, cond:p=>p.assets.includes("restaurant"), title:T("Eine Kritik in der Lokalzeitung"),
  text:T("Zwei von fünf Punkten. Der Name des Restaurants steht direkt neben deinem."),
  choices:[{label:"Küche komplett neu aufstellen",hint:"",roll:[{p:.7,text:"Neuer Koch, neue Karte. Ein halbes Jahr später ist der Laden voll.",fx:{money:-.16,rep:6}},
    {p:.3,text:"Es hilft nichts, du machst zu.",fx:{money:-.3,rep:-5,morale:-8}}]},
    {label:"Laufen lassen",hint:"",roll:[{p:1,text:"Es dümpelt weiter vor sich hin.",fx:{money:-.04}}]}]},
{ id:"b_jet", tag:"Besitz", w:2, cond:p=>p.assets.includes("jet"), title:T("Der Flugzeuganteil wird zum Thema"),
  text:T("Eine Umweltinitiative rechnet öffentlich vor, wie viele Kurzstrecken du im Jahr fliegst."),
  choices:[{label:"Reagieren und umstellen",hint:"",roll:[{p:1,text:"Du fliegst Kurzstrecken nicht mehr und sagst das auch. Kommt gut an.",fx:{rep:10,morale:6,fit:-1}}]},
    {label:"Nichts sagen",hint:"",roll:[{p:1,text:"Das Thema hält sich zwei Monate.",fx:{rep:-11}}]}]},
{ id:"b_mental", tag:"Besitz", w:2, cond:p=>p.assets.includes("mental"), title:T("Über den Psychologen reden"),
  text:T("Ein Journalist fragt dich direkt, ob du dir Hilfe holst. In der Kabine ist das immer noch ein heikles Thema."),
  choices:[{label:"Offen ja sagen",hint:"",roll:[{p:1,text:"Zwei Mitspieler fragen dich in der Woche darauf nach der Nummer. Das ist mehr wert als jede Schlagzeile.",fx:{rep:10,morale:12,trust:8,legacy:8}}]},
    {label:"Ausweichen",hint:"",roll:[{p:1,text:"Du redest drumherum. Schade eigentlich.",fx:{morale:-4}}]}]},

/* ================= ALTER UND KARRIEREENDE ================= */
{ id:"a_koerper", tag:"Alter", w:4, rep:3, cond:p=>p.age>=32, title:T("Der Körper meldet sich"),
  text:T("Aufstehen dauert morgens länger als früher das ganze Aufwärmen."),
  choices:[{label:"Programm komplett umstellen",hint:"",roll:[{p:1,text:"Weniger Umfang, mehr Qualität, viel mehr Regeneration. Du hältst zwei Jahre länger durch.",fx:{injuryProne:-14,fitness:10,pot:1}}]},
    {label:"Weitermachen wie immer",hint:"",roll:[{p:.5,text:"Geht nochmal gut.",fx:{fitness:-4}},{p:.5,text:"Es reißt in der Rückrunde.",fx:{forceInjury:"mittel"}}]}]},
{ id:"a_jugend", tag:"Alter", w:3, cond:p=>p.age>=33, title:T("Der Verein plant ohne dich"),
  text:T("Sie holen zwei Spieler auf deiner Position, beide unter 22. Gesagt hat dir das niemand."),
  choices:[{label:"Klärendes Gespräch suchen",hint:"",roll:[{p:.55,text:"Der Sportdirektor sagt ehrlich, dass sie dich noch ein Jahr wollen, als Führungsspieler.",fx:{trust:10,morale:8,extend:1}},
    {p:.45,text:"Er weicht aus. Damit weißt du auch Bescheid.",fx:{morale:-14,trust:-8}}]},
    {label:"Auf dem Platz antworten",hint:"",roll:[{p:.5,text:"Du spielst die beste Rückrunde seit Jahren und bleibst gesetzt.",fx:{form:14,trust:12,morale:10}},
      {p:.5,text:"Der Körper macht die Ansage nicht mit.",fx:{fitness:-12,form:-8,morale:-10}}]}]},
{ id:"a_letzte", tag:"Alter", w:3, cond:p=>p.age>=35, title:T("Noch eine Saison oder Schluss"),
  text:T("Es gibt ein Angebot aus einer kleineren Liga und eine Stelle im Verein. Beides gleichzeitig geht nicht."),
  choices:[{label:"Nochmal spielen",hint:"",roll:[{p:1,text:"Du willst es auf dem Platz beenden, nicht am Schreibtisch.",fx:{morale:10,trust:5}}]},
    {label:"Auf das Ende zuarbeiten",hint:"",roll:[{p:1,text:"Du bereitest dich innerlich vor. Das nimmt Druck und kostet ein bisschen Biss.",fx:{morale:8,form:-5,legacy:8}}]}]},
{ id:"a_ehrung", tag:"Alter", w:2, cond:p=>p.age>=33&&p.tot.apps>=300, title:T("Ehrung für 300 Spiele"),
  text:T("Vor dem Heimspiel, Blumen, ein gerahmtes Trikot, dreißig Sekunden Applaus."),
  choices:[{label:"Kurz sprechen",hint:"",roll:[{p:1,text:"Du sagst vier Sätze ins Mikrofon und musst dabei schlucken. Alle auch.",fx:{morale:16,rep:8,legacy:10}}]},
    {label:"Nur winken",hint:"",roll:[{p:1,text:"Du willst kein Aufheben. Verstehen alle.",fx:{morale:8,legacy:4}}]}]},

/* ================= NATIONALMANNSCHAFT ZUSATZ ================= */
{ id:"n_qualifikation", tag:"Nationalteam", w:3, cond:p=>p.nt.level==="A", title:T("Entscheidungsspiel in der Qualifikation"),
  text:T("Ein Sieg reicht für das Turnier. Auswärts, ausverkauft, feindselig."),
  choices:[{label:"Verantwortung übernehmen",hint:"",roll:[{p:.55,text:"Du machst das entscheidende Tor. Ein ganzes Land kennt jetzt deinen Namen.",fx:{rep:20,ntBonus:14,morale:18}},
    {p:.45,text:c=>`Du ${fehler(c.p)}. Ihr qualifiziert euch trotzdem, aber die Bilder bleiben.`,fx:{morale:-10,ntBonus:2}}]},
    {label:"Absichern",hint:"",roll:[{p:1,text:"Ein ordentliches 0:0, das reicht.",fx:{ntBonus:6,note:.06}}]}]},
{ id:"n_verletzt", tag:"Nationalteam", w:2, cond:p=>p.nt.level==="A"&&p.age>=24, title:T("Verletzt aus dem Länderspiel zurück"),
  text:T("Muskelverletzung im zweiten Testspiel. Dein Verein hatte davor abgeraten und schreibt jetzt einen Brief an den Verband."),
  choices:[{label:"Dich vor den Verband stellen",hint:"",roll:[{p:1,text:"Du sagst, es war deine Entscheidung. Der Bundestrainer vergisst das nicht.",fx:{ntBonus:12,trust:-10,forceInjury:"leicht"}}]},
    {label:"Deinem Verein recht geben",hint:"",roll:[{p:1,text:"Der Klub steht hinter dir, der Verband wird zurückhaltender bei Nominierungen.",fx:{trust:12,ntPenalty:12,forceInjury:"leicht"}}]}]},
{ id:"n_kapitaen", tag:"Nationalteam", w:2, cond:p=>p.nt.caps>=35, title:T("Die Binde im Nationalteam"),
  text:T("Der bisherige Kapitän hört auf. Der Bundestrainer fragt dich vor allen anderen."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Du führst dein Land an. Das steht später in jedem Text über dich.",fx:{rep:18,ntBonus:12,morale:16,legacy:20}}]},
    {label:"Einem anderen überlassen",hint:"",roll:[{p:1,text:"Du sagst, jemand anders passt besser. Ehrlich, aber eine verpasste Gelegenheit.",fx:{morale:4,ntBonus:4}}]}]},
{ id:"n_abschied", tag:"Nationalteam", w:2, cond:p=>p.nt.caps>=60&&p.age>=32, title:T("Abschied aus der Nationalmannschaft"),
  text:T("Der Verband bietet dir ein Abschiedsspiel an, mit Aufstellung, Auswechslung in der 60. Minute und allem Drum und Dran."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Ausverkauftes Haus, deine Kinder laufen mit ein. Danach ist der Vereinsalltag leichter.",fx:{morale:20,rep:12,legacy:18,ntPenalty:99,flag:"ntRuecktritt",fitness:8}}]},
    {label:"Ohne Aufhebens aufhören",hint:"",roll:[{p:1,text:"Eine kurze Mitteilung, mehr nicht. Passt zu dir.",fx:{morale:6,legacy:8,ntPenalty:99,flag:"ntRuecktritt",fitness:8}}]}]},

/* ================= SONSTIGES ================= */
{ id:"s_kabinenmusik", tag:"Kurios", w:2, rep:6, cond:p=>p.seasons.length>=1, title:T("Streit um die Kabinenmusik"),
  text:T("Die Boxbedienung liegt seit Jahren bei denselben zwei Leuten. Diese Woche sagt jemand laut, was alle denken."),
  choices:[{label:"Eigene Playlist durchsetzen",hint:"",roll:[{p:.5,text:"Es wird tatsächlich besser. Man dankt es dir.",fx:{morale:8,trust:4}},{p:.5,text:"Dein Geschmack wird einstimmig abgelehnt.",fx:{morale:-4}}]},
    {label:"Kopfhörer aufsetzen",hint:"",roll:[{p:1,text:"Problem gelöst, zumindest für dich.",fx:{form:3}}]}]},
{ id:"s_dokujunior", tag:"Kurios", w:2, cond:p=>p.rep>=32, title:T("Ein Kind schreibt dir einen Brief"),
  text:T("Handschriftlich, mit Zeichnung. Es fragt, wie man es schafft, Profi zu werden, und ob du zurückschreibst."),
  choices:[{label:"Handschriftlich antworten",hint:"",roll:[{p:1,text:"Zwei Seiten. Die Mutter postet ein Foto davon, und es rührt eine ganze Menge Leute.",fx:{rep:9,morale:12,legacy:6}}]},
    {label:"Trikot schicken lassen",hint:"",roll:[{p:1,text:"Der Fanshop schickt ein signiertes Trikot. Freut das Kind trotzdem.",fx:{rep:4,morale:5}}]}]},
{ id:"s_altertrainer", tag:"Kurios", w:2, cond:p=>p.age>=25, title:T("Dein alter Jugendtrainer sitzt auf der Tribüne"),
  text:T("Er hat sich nicht angekündigt und wartet nach dem Spiel am Spielereingang."),
  choices:[{label:"Ihn mit in die Kabine nehmen",hint:"",roll:[{p:1,text:"Er sagt kaum etwas und strahlt die ganze Zeit. Ihr telefoniert seitdem jeden Monat.",fx:{morale:16,legacy:6}}]},
    {label:"Kurz Hallo sagen",hint:"",roll:[{p:1,text:"Fünf Minuten, ein Foto, dann muss der Bus los.",fx:{morale:5}}]}]},
{ id:"s_wetterderby", tag:"Kurios", w:2, rep:6, cond:p=>p.seasons.length>=1, title:T("Schneetreiben beim Anpfiff"),
  text:T("Der Ball ist orange, die Linien sind weg, und niemand weiß, ob überhaupt angepfiffen wird."),
  choices:[{label:"Spielen wollen",hint:"",roll:[{p:.6,text:"Ein absurdes Spiel, das ihr 3:2 gewinnt. Solche Nachmittage bleiben hängen.",fx:{morale:12,form:8}},
    {p:.4,text:"Abbruch in der 30. Minute beim Stand von 1:0 für euch.",fx:{morale:-6}}]},
    {label:"Für Absage plädieren",hint:"",roll:[{p:1,text:"Der Schiedsrichter entscheidet ohnehin allein. Er sagt ab.",fx:{fitness:4}}]}]},
{ id:"s_ehrenamt", tag:"Umfeld", w:2, cond:p=>p.age>=24, title:T("Anfrage von einer Klinik"),
  text:T("Die Kinderstation fragt, ob du zur Weihnachtszeit vorbeikommst. Ohne Presse, ohne Fotos."),
  choices:[{label:"Hinfahren",hint:"",roll:[{p:1,text:"Drei Stunden, kein einziges Bild davon. Du fährst anders nach Hause, als du gekommen bist.",fx:{morale:16,legacy:8}}]},
    {label:"Mit Presse hinfahren",hint:"",roll:[{p:1,text:"Es hilft der Klinik bei den Spenden und dir beim Image. Beides legitim.",fx:{rep:10,morale:8,legacy:4}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Der Terminkalender ist voll. Bleibt ein komisches Gefühl.",fx:{morale:-5}}]}]},
{ id:"s_dokureihe", tag:"Medien", w:2, cond:p=>p.tot.apps>=150, title:T("Podcast über deine Laufbahn"),
  text:T("Neunzig Minuten, ein Gespräch, keine vorbereiteten Fragen. Sie wollen auch über die schlechten Jahre reden."),
  choices:[{label:"Alles erzählen",hint:"",roll:[{p:1,text:"Die Folge wird das Ehrlichste, was es über dich gibt. Viele melden sich danach.",fx:{rep:12,morale:10,legacy:8}}]},
    {label:"Bei den Erfolgen bleiben",hint:"",roll:[{p:1,text:"Nett und belanglos.",fx:{rep:3}}]}]},
/* ============ REAKTION AUF DIE LETZTE SAISON ============ */
{ id:"r_abstieg", tag:"Nachwirkung", w:14, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.move&&s.move.dir==="ab");},
  title:c=>`Nach dem Abstieg mit ${c.ls.club}`,
  text:c=>`${c.ls.club} spielt nächste Saison in der ${c.club.l}. Der halbe Kader hat Ausstiegsklauseln, die jetzt greifen.`,
  choices:[{label:"Bleiben und wieder hochgehen",hint:"",roll:[{p:1,text:"Du sagst öffentlich zu. Die Fans machen dich über Nacht zum Gesicht des Wiederaufbaus.",fx:{rep:14,trust:16,morale:10,legacy:8}}]},
    {label:"Wechsel prüfen",hint:"",roll:[{p:1,text:"Dein Berater telefoniert. Die Fans lesen das in der Zeitung.",fx:{rep:-8,trust:-10,wantMove:true}}]}]},
{ id:"r_aufstieg", tag:"Nachwirkung", w:13, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.move&&s.move.dir==="auf");},
  title:T("Nach dem Aufstieg"),
  text:c=>`${c.ls.club} ist oben angekommen. Der Verein holt vier neue Spieler, zwei davon auf deiner Position.`,
  choices:[{label:"Den Kampf annehmen",hint:"",roll:[{p:.6,text:"Du setzt dich in der Vorbereitung durch und startest als Stammspieler in die höhere Liga.",fx:{trust:14,form:10,morale:10}},
    {p:.4,text:"Die Neuen sind besser. Du beginnst auf der Bank.",fx:{trust:-8,morale:-10,form:-6}}]},
    {label:"Auf Spielzeit woanders setzen",hint:"",roll:[{p:1,text:"Lieber unten spielen als oben zuschauen, sagst du dem Sportdirektor.",fx:{wantMove:true,trust:-6}}]}]},
{ id:"r_meister", tag:"Nachwirkung", w:13, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.trophies.some(t=>t.indexOf("Meister")===0));},
  title:T("Die Meisterfeier hallt nach"),
  text:c=>`Drei Tage Autokorso, dann Sommerpause. Beim ersten Training im Juli sind sechs Mann sichtbar schwerer.`,
  choices:[{label:"Sofort wieder ernst machen",hint:"",roll:[{p:1,text:"Du bist der Erste, der wieder in den Zweikampf geht. Der Trainer nennt dich beim Namen.",fx:{trust:14,fitness:6,form:8}}]},
    {label:"Den Erfolg auskosten",hint:"",roll:[{p:1,text:"Sechs Wochen Feiern und Termine. Der Start in die neue Saison wird zäh.",fx:{morale:14,rep:8,fitness:-11,form:-8}}]}]},
{ id:"r_pokalsieg", tag:"Nachwirkung", w:11, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.cup&&s.cup.won);},
  title:c=>`${c.ls.cup.name} gewonnen`,
  text:T("Der Pokal steht im Vereinsmuseum, und die Stadt hat einen Empfang im Rathaus organisiert."),
  choices:[{label:"Zur Rede ansetzen",hint:"",roll:[{p:1,text:"Du sprichst vom Balkon, nennst die Zeugwarte beim Namen und wirst dafür jahrelang gemocht.",fx:{rep:12,morale:14,legacy:10}}]},
    {label:"Die Älteren vorlassen",hint:"",roll:[{p:1,text:"Du drückst dem Kapitän das Mikrofon in die Hand. Auch das merken sich Leute.",fx:{trust:10,morale:8}}]}]},
{ id:"r_pokalaus", tag:"Nachwirkung", w:9, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.cup&&!s.cup.won&&["Halbfinale","Finale"].includes(s.cup.out));},
  title:c=>`Aus im ${c.ls.cup.out}`,
  text:T("So nah dran und dann doch nicht. In der Kabine sagt eine halbe Stunde lang niemand ein Wort."),
  choices:[{label:"Die Mannschaft auffangen",hint:"",roll:[{p:1,text:"Du redest, als es sonst keiner tut. Nächste Saison seid ihr wieder da.",fx:{trust:12,legacy:5,morale:-4}}]},
    {label:"Alleine verarbeiten",hint:"",roll:[{p:1,text:"Du fährst nach Hause und redest zwei Tage mit niemandem.",fx:{morale:-10,form:-4}}]}]},
{ id:"r_europa", tag:"Nachwirkung", w:10, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.eu&&s.eu.won);},
  title:c=>`${c.ls.europe} gewonnen`,
  text:T("Der größte Abend deiner Laufbahn liegt sechs Wochen zurück, und du hast das Trikot noch nicht gewaschen."),
  choices:[{label:"Jetzt den nächsten Schritt suchen",hint:"",roll:[{p:1,text:"Nach so einem Titel klingelt das Telefon deines Beraters ununterbrochen.",fx:{dreamOffer:true,rep:16,morale:12}}]},
    {label:"Hier weitermachen",hint:"",roll:[{p:1,text:"Du verlängerst gedanklich, bevor jemand fragt.",fx:{trust:16,morale:14,legacy:10}}]}]},
{ id:"r_ligaphase", tag:"Nachwirkung", w:8, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.eu&&s.eu.out==="Ligaphase");},
  title:T("In der Ligaphase gescheitert"),
  text:c=>`Acht Spiele, ${c.ls.eu.pts} Punkte, Platz ${c.ls.eu.pos}. Der Verein hatte fest mit dem Achtelfinale gerechnet.`,
  choices:[{label:"Kritik annehmen",hint:"",roll:[{p:1,text:"Du sagst in der Analyse offen, wo du selbst zu wenig gebracht hast. Der Trainer schätzt das.",fx:{trust:10,note:.08,morale:-5}}]},
    {label:"Auf den Spielplan verweisen",hint:"",roll:[{p:1,text:"Vier englische Wochen hintereinander, sagst du. Stimmt sogar, hilft nur niemandem.",fx:{trust:-6,morale:2}}]}]},
{ id:"r_torjaeger", tag:"Nachwirkung", w:11, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameLeague(p)&&(s&&s.awards.some(a=>a.indexOf("Torschützenkönig")===0));},
  title:T("Torschützenkönig"),
  text:c=>`${c.ls.goals} Tore in einer Saison. Jeder Verteidiger der Liga hat jetzt ein Video über dich gesehen.`,
  choices:[{label:"Spiel weiterentwickeln",hint:"",roll:[{p:1,text:"Du arbeitest an Tiefenläufen und Rückwärtsbewegung, statt dich auszuruhen.",fx:{pas:2,pac:1,note:.1,pot:2}}]},
    {label:"Weitermachen wie bisher",hint:"",roll:[{p:.45,text:"Es funktioniert nochmal.",fx:{form:8,sho:1}},{p:.55,text:"Sie stellen sich auf dich ein. Die Quote bricht ein.",fx:{form:-11,morale:-8}}]}]},
{ id:"r_elfsaison", tag:"Nachwirkung", w:10, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameLeague(p)&&(s&&s.awards.some(a=>a.indexOf("Elf der Saison")===0||a.indexOf("Spieler der Saison")===0));},
  title:T("In die Elf der Saison gewählt"),
  text:T("Eine Auszeichnung, über die man sich einen Abend freut und die danach zur Erwartung wird."),
  choices:[{label:"Anspruch anheben",hint:"",roll:[{p:1,text:"Du forderst intern mehr Verantwortung. Der Trainer gibt sie dir.",fx:{trust:12,rep:8,form:6}}]},
    {label:"Klein bleiben",hint:"",roll:[{p:1,text:"Du sagst, die Mannschaft habe das gemacht. Kommt gut an.",fx:{trust:8,morale:6}}]}]},
{ id:"r_langeverletzt", tag:"Nachwirkung", w:12, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.injury&&s.injury.games>=18);},
  title:c=>`${c.ls.injury.games} Spiele verpasst`,
  text:T("Die halbe Saison auf der Behandlungsliege. Der Verein hat in der Zwischenzeit Ersatz geholt."),
  choices:[{label:"Vorsichtig aufbauen",hint:"",roll:[{p:1,text:"Zwölf Wochen Stufenplan. Du kommst zurück, ohne wieder umzufallen.",fx:{injuryProne:-12,fitness:12,form:-5,clearInjuryFlag:true}}]},
    {label:"Sofort angreifen",hint:"",roll:[{p:.5,text:"Du bist nach vier Wochen wieder drin und spielst, als wäre nichts gewesen.",fx:{form:12,trust:10,clearInjuryFlag:true}},
      {p:.5,text:"Rückfall. Nochmal drei Monate.",fx:{forceInjury:"mittel",morale:-16}}]}]},
{ id:"r_kaumgespielt", tag:"Nachwirkung", w:13, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.apps<=8&&!s.injury&&p.age>=18);},
  title:c=>`Nur ${c.ls.apps} Einsätze`,
  text:T("Eine ganze Saison praktisch nicht gespielt und trotzdem jeden Tag trainiert. Das zehrt anders als eine Verletzung."),
  choices:[{label:"Klares Gespräch mit dem Trainer",hint:"",roll:[{p:.5,text:"Er sagt dir ehrlich, woran es liegt, und gibt dir einen Plan. Das hilft mehr als jede Ansage.",fx:{trust:10,form:8,morale:8}},
    {p:.5,text:"Er weicht aus. Damit ist die Sache klar.",fx:{morale:-12,wantMove:true}}]},
    {label:"Leihe fordern",hint:"",roll:[{p:1,text:"Du willst spielen, egal wo. Der Verein hört zu.",fx:{wantLoan:true,trust:-4}}]}]},
{ id:"r_durchgespielt", tag:"Nachwirkung", w:9, cond:p=>{const s=p.seasons[p.seasons.length-1];return s&&s.apps>=38;},
  title:c=>`${c.ls.apps} Pflichtspiele in einer Saison`,
  text:T("Kaum ein Spieler der Liga stand öfter auf dem Platz. Dein Körper hat davon eine sehr klare Meinung."),
  choices:[{label:"Sommer komplett zur Regeneration",hint:"",roll:[{p:1,text:"Sechs Wochen kein Ball. Du startest frisch und hältst das Pensum ein weiteres Jahr durch.",fx:{fitness:16,injuryProne:-9,form:-4}}]},
    {label:"Durchziehen",hint:"",roll:[{p:.45,text:"Der Körper macht mit. Noch.",fx:{trust:8,fitness:-6}},
      {p:.55,text:"In der Hinrunde geht die Muskulatur kaputt.",fx:{forceInjury:"mittel",fitness:-10}}]}]},
{ id:"r_schwachesjahr", tag:"Nachwirkung", w:12, cond:p=>{const s=p.seasons[p.seasons.length-1];return s&&s.note>=4;},
  title:c=>`Durchschnittsnote ${c.ls.note.toFixed(1)}`,
  text:T("Das schlechteste Jahr deiner Laufbahn, und es gibt keine Ausrede, die trägt."),
  choices:[{label:"Alles hinterfragen",hint:"",roll:[{p:.65,text:"Du wechselst Ernährung, Schlaf und Trainingsschwerpunkt. Es dauert, aber es kippt zurück.",fx:{fitness:10,note:.12,morale:6,form:8}},
    {p:.35,text:"Du zerdenkst dein Spiel und wirst noch unsicherer.",fx:{form:-10,morale:-10}}]},
    {label:"Einfach weiterspielen",hint:"",roll:[{p:1,text:"Manchmal reicht es, nicht zu viel nachzudenken.",fx:{form:5,morale:3}}]}]},
{ id:"r_starkesjahr", tag:"Nachwirkung", w:11, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.note<=2.2&&s.apps>=20);},
  title:c=>`Durchschnittsnote ${c.ls.note.toFixed(1)}`,
  text:T("Die beste Saison deiner Laufbahn. Ab jetzt wirst du daran gemessen."),
  choices:[{label:"Vertrag nachverhandeln",hint:"",roll:[{p:.6,text:"Der Verein zieht mit. Deutlich mehr Gehalt, zwei Jahre länger.",fx:{extend:2,trust:6,morale:10,money:.3}},
    {p:.4,text:"Sie lehnen ab und verweisen auf die Laufzeit. Das ärgert dich monatelang.",fx:{morale:-10,trust:-6}}]},
    {label:"Nichts fordern",hint:"",roll:[{p:1,text:"Du spielst einfach weiter. Der Verein rechnet dir das an.",fx:{trust:14,morale:6}}]}]},
{ id:"r_neuerplatz", tag:"Nachwirkung", w:8, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&s.rank<=3&&!s.trophies.length);},
  title:c=>`Platz ${c.ls.rank} und trotzdem nichts gewonnen`,
  text:T("Eine gute Saison ohne Titel. In der Analyse fällt oft der Satz, es habe an Kleinigkeiten gelegen."),
  choices:[{label:"An den Kleinigkeiten arbeiten",hint:"",roll:[{p:1,text:"Standards, letzte fünfzehn Minuten, Chancenverwertung. Ihr macht daraus ein Programm.",fx:{note:.1,trust:8,fitness:-4}}]},
    {label:"Zufrieden sein",hint:"",roll:[{p:1,text:"Der Verein ist es auch. Nur die Kurve nicht.",fx:{morale:5,rep:-3}}]}]},
{ id:"r_ntfehlt", tag:"Nachwirkung", w:9, cond:p=>{const s=p.seasons[p.seasons.length-1];return s&&s.ntCaps===0&&p.ovr>=76&&p.age>=22&&p.age<=31;},
  title:T("Wieder keine Nominierung"),
  text:T("Deine Zahlen stimmen, dein Verein spielt oben mit, und trotzdem stand dein Name nicht auf der Liste."),
  choices:[{label:"Öffentlich nachfragen",hint:"",roll:[{p:.45,text:"Der Bundestrainer ruft dich an und erklärt es. Beim nächsten Mal bist du dabei.",fx:{ntBonus:18,rep:6}},
    {p:.55,text:"Es wirkt fordernd. Das kommt beim Verband nicht gut an.",fx:{ntPenalty:14,rep:4,morale:-8}}]},
    {label:"Weiter Zahlen liefern",hint:"",roll:[{p:1,text:"Du sagst nichts und spielst. Irgendwann kommt der Anruf oder eben nicht.",fx:{form:7,ntBonus:5}}]}]},
{ id:"r_turnier", tag:"Nachwirkung", w:10, cond:p=>{const s=p.seasons[p.seasons.length-1];return s&&s.ntMajor;},
  title:c=>`Nach dem Turnier: ${c.ls.ntMajor.turnier} ${c.ls.ntMajor.y}`,
  text:c=>`${c.ls.ntMajor.res} — und drei Wochen später beginnt schon wieder die Vorbereitung. Urlaub gab es zehn Tage.`,
  choices:[{label:"Später einsteigen",hint:"",roll:[{p:1,text:"Der Verein gibt dir zwei Wochen extra. Du startest verspätet, aber erholt.",fx:{fitness:12,trust:-6,form:-4}}]},
    {label:"Normal mitmachen",hint:"",roll:[{p:.5,text:"Es geht gut. Du bist von Anfang an drin.",fx:{trust:10,form:6,fitness:-8}},
      {p:.5,text:"Der Sommer ohne Pause rächt sich im Oktober.",fx:{forceInjury:"leicht",fitness:-12}}]}]},
{ id:"r_torlos", tag:"Nachwirkung", w:10, cond:p=>{const s=p.seasons[p.seasons.length-1];return s&&["ST","AF","ZOM"].includes(s.pos)&&s.goals<=2&&s.apps>=18;},
  title:c=>`${c.ls.goals} Tore in ${c.ls.apps} Spielen`,
  text:T("Für einen Offensivspieler ist das eine Zahl, die man nicht wegdiskutiert."),
  choices:[{label:"Abschlusstraining zum Schwerpunkt machen",hint:"",roll:[{p:1,text:"Jeden Tag hundert Abschlüsse. Es dauert, aber die Quote kommt zurück.",fx:{sho:3,note:.08,fitness:-4}}]},
    {label:"Rolle im Spiel ändern",hint:"",roll:[{p:1,text:"Du gehst mehr in die Vorbereitung statt in den Abschluss.",fx:{pas:3,repos:true}}]}]},
{ id:"r_zunull", tag:"Nachwirkung", w:9, cond:p=>{const s=p.seasons[p.seasons.length-1];return s&&s.pos==="TW"&&s.cs>=12;},
  title:c=>`${c.ls.cs} Spiele ohne Gegentor`,
  text:T("Der beste Wert der Liga. Zwei größere Klubs haben Beobachter geschickt."),
  choices:[{label:"Sich zeigen wollen",hint:"",roll:[{p:1,text:"Du spielst die Rückrunde mit dem Gedanken im Kopf. Es klappt.",fx:{rep:12,dreamOffer:true,form:6}}]},
    {label:"Nichts drauf geben",hint:"",roll:[{p:1,text:"Du machst weiter deine Arbeit. Die Beobachter kommen von selbst wieder.",fx:{note:.08,trust:8}}]}]},
{ id:"r_wechselreue", tag:"Nachwirkung", w:9, cond:p=>{const s=p.seasons[p.seasons.length-1];return sameClub(p)&&(s&&!!p.prevClub&&s.note>=3.8);},
  title:T("War der Wechsel ein Fehler?"),
  text:c=>`Bei ${c.prev} hattest du gespielt. Hier läuft es seit einem Jahr nicht, und alle wissen, was du gekostet hast.`,
  choices:[{label:"Durchbeißen",hint:"",roll:[{p:.55,text:"Im zweiten Jahr kippt es. Genau darauf haben ein paar gewartet.",fx:{form:12,trust:10,morale:8}},
    {p:.45,text:"Es wird nicht besser. Du zählst die Wochen.",fx:{morale:-14,wantMove:true}}]},
    {label:"Rückkehr sondieren",hint:"",roll:[{p:1,text:"Dein Berater fragt beim alten Verein an. Man reagiert freundlich.",fx:{wantMove:true,morale:6}}]}]},
{ id:"r_geldnochda", tag:"Nachwirkung", w:8, cond:p=>p.money>=3&&p.assets.length<=7&&p.age>=25,
  title:T("Das Konto wächst und liegt nur herum"),
  text:c=>`${eur(c.p.money)} Euro auf dem Girokonto. Dein Berater fragt vorsichtig, ob das Absicht ist.`,
  choices:[{label:"Einen Plan machen",hint:"",roll:[{p:1,text:"Ihr geht einen Nachmittag alles durch: Anlage, Absicherung, ein Puffer für danach.",fx:{morale:8,rep:2}}]},
    {label:"Liegen lassen",hint:"",roll:[{p:1,text:"Du willst es einfach halten. Die Inflation sieht das anders.",fx:{money:-.15}}]}]},
{ id:"r_erstesjahr", tag:"Nachwirkung", w:12, fresh:true, cond:p=>sameClub(p)&&p.seasons.length===1&&p.age<=19,
  title:T("Das erste Profijahr ist rum"),
  text:c=>`${c.ls.apps} Pflichtspiele, Note ${c.ls.note.toFixed(1)}. Der Nachwuchsleiter setzt sich mit dir zusammen und geht alles durch.`,
  choices:[{label:"Ehrlich über Schwächen reden",hint:"",roll:[{p:1,text:"Ihr legt zwei konkrete Baustellen fest. Genau daran arbeitest du das nächste Jahr.",fx:{pot:3,trust:8,note:.06}}]},
    {label:"Erfolge betonen",hint:"",roll:[{p:1,text:"Er nickt höflich und schreibt sich seine eigenen Notizen.",fx:{morale:5,trust:-3}}]}]},
{ id:"r_alterspiel", tag:"Nachwirkung", w:9, late:true, cond:p=>p.age>=31&&p.seasons.length>=10&&p.seasons[p.seasons.length-1].ovr<p.peakOvr-3,
  title:T("Die Werte gehen zurück"),
  text:c=>`Deine Bestmarke lag bei ${c.p.peakOvr}. Diese Saison stand ${c.ls.ovr} zu Buche, und das war kein Ausreißer.`,
  choices:[{label:"Spiel umstellen",hint:"",roll:[{p:1,text:"Weniger Sprints, mehr Stellungsspiel, früher abkippen. Du hältst dadurch länger durch.",fx:{pas:3,def:2,note:.1,pot:1}}]},
    {label:"Gegen die Zahlen ankämpfen",hint:"",roll:[{p:.4,text:"Ein letztes starkes Jahr durch schiere Sturheit.",fx:{form:12,fitness:-10}},
      {p:.6,text:"Der Körper gewinnt diese Diskussion.",fx:{fitness:-14,forceInjury:"leicht",morale:-8}}]}]},
{ id:"r_kapitaenjahr", tag:"Nachwirkung", w:8, cond:p=>sameClub(p)&&p.flags.kapitaen&&lastS(p).rank>lastS(p).N/2,
  title:T("Als Kapitän in einer enttäuschenden Saison"),
  text:c=>`Platz ${c.ls.rank} von ${c.ls.N}. Beim Fantreffen im Sommer stellst du dich zwei Stunden lang den Fragen.`,
  choices:[{label:"Alle Fragen beantworten",hint:"",roll:[{p:1,text:"Du gehst als Letzter. Danach gibt es kaum noch jemanden, der dir etwas vorwirft.",fx:{rep:12,trust:10,morale:6,legacy:6}}]},
    {label:"Nach einer Stunde gehen",hint:"",roll:[{p:1,text:"Verständlich, aber es bleibt hängen.",fx:{rep:-7,morale:-4}}]}]},
{ id:"r_derbyniederlage", tag:"Nachwirkung", w:8, cond:p=>{const s=p.seasons[p.seasons.length-1];return s&&s.note>3.2&&s.rank>3;},
  title:T("Der Sommer nach einer mittelmäßigen Saison"),
  text:T("Kein Abstieg, kein Titel, keine Geschichte. Genau diese Jahre sind die zähen."),
  choices:[{label:"Sich neue Ziele setzen",hint:"",roll:[{p:1,text:"Du schreibst dir drei Zahlen auf einen Zettel und hängst ihn in den Spind.",fx:{form:9,morale:8,note:.06}}]},
    {label:"Abstand nehmen",hint:"",roll:[{p:1,text:"Vier Wochen ohne Fußball, ohne Nachrichten, ohne alles. Danach geht es wieder.",fx:{morale:12,fitness:5,form:-3}}]}]},
{ id:"r_transferrekord", tag:"Nachwirkung", w:7, cond:p=>p.mv>=45&&p.age<=27,
  title:T("Dein Marktwert steht in jeder Meldung"),
  text:c=>`${eur(c.p.mv)} Euro. Jede Zeitung schreibt die Zahl neben deinen Namen, als wäre sie eine Leistung.`,
  choices:[{label:"Klarstellen, dass das nichts bedeutet",hint:"",roll:[{p:1,text:"Du sagst, die Zahl mache kein einziges Tor. Kommt an.",fx:{rep:8,morale:8}}]},
    {label:"Genießen",hint:"",roll:[{p:1,text:"Du teilst die Meldung. Ein paar finden das unsympathisch.",fx:{rep:4,morale:6,trust:-5}}]}]},

/* ============ MEHR AUSWAHL IN BESTEHENDEN THEMEN ============ */
{ id:"x_taktikvideo", tag:"Taktik", w:5, rep:4, cond:p=>p.seasons.length>=1, title:T("Der Gegner hat euch komplett durchschaut"),
  text:T("Nach dem 0:3 zeigt der Analyst, wie der Gegner jede eurer Verlagerungen vorhergesehen hat."),
  choices:[{label:"Muster bewusst brechen",hint:"",roll:[{p:1,text:"Ihr baut zwei neue Abläufe ein. Ab November seid ihr wieder schwer auszurechnen.",fx:{pas:2,note:.08,trust:6}}]},
    {label:"Auf die eigene Stärke setzen",hint:"",roll:[{p:1,text:"Ihr zieht euer Ding durch. Funktioniert gegen sechs Gegner und gegen zwei überhaupt nicht.",fx:{form:5}}]}]},
{ id:"x_pressing", tag:"Taktik", w:4, rep:4, cond:p=>p.seasons.length>=1, title:T("Neues Pressingschema"),
  text:T("Der Trainer will zehn Meter höher verteidigen. Für dich heißt das deutlich mehr Sprints pro Spiel."),
  choices:[{label:"Athletisch nachlegen",hint:"",roll:[{p:1,text:"Zusatzeinheiten im Sommer. Ab Herbst läufst du das Pensum ohne Probleme.",fx:{pac:2,phy:2,fitness:-5,trust:8}}]},
    {label:"Position klug wählen",hint:"",roll:[{p:1,text:"Du sparst dir Wege durch besseres Stellungsspiel. Der Analyst lobt dich, der Athletiktrainer nicht.",fx:{def:2,pas:1,note:.06}}]}]},
{ id:"x_kabinenordnung", tag:"Kabine", w:4, rep:5, cond:p=>p.seasons.length>=1, title:T("Strafenkatalog"),
  text:T("Zu spät kommen, Handy im Meeting, falsche Schuhe. Der Mannschaftsrat will die Sätze verdoppeln."),
  choices:[{label:"Dafür stimmen",hint:"",roll:[{p:1,text:"Die Kasse füllt sich, die Disziplin auch.",fx:{trust:8,money:-.02}}]},
    {label:"Dagegen",hint:"",roll:[{p:1,text:"Du sagst, Disziplin komme nicht aus dem Geldbeutel. Manche sehen das anders.",fx:{morale:4,trust:-4}}]}]},
{ id:"x_jungerkapitaen", tag:"Führung", w:4, rep:5, cond:p=>p.age>=22&&p.age<=27, title:T("Ein Jüngerer bittet dich um Rat"),
  text:c=>`${c.young.name} kommt nach dem Training zu dir, weil er nicht weiß, ob er einen Beraterwechsel machen soll.`,
  choices:[{label:"Ehrlich raten",hint:"",roll:[{p:1,text:"Du erzählst ihm von deinen eigenen Fehlern. Er hört genau zu.",fx:{trust:8,morale:6,legacy:4}}]},
    {label:"Raushalten",hint:"",roll:[{p:1,text:"Du sagst, das müsse er selbst entscheiden. Stimmt, hilft ihm nur nicht.",fx:{morale:-2}}]}]},
{ id:"x_zeugwart", tag:"Umfeld", w:4, rep:6, cond:p=>p.seasons.length>=1, title:T("Der Zeugwart geht in Rente"),
  text:T("Vierunddreißig Jahre im Verein. Er kennt jede Schuhgröße und jeden Aberglauben im Kader."),
  choices:[{label:"Etwas organisieren",hint:"",roll:[{p:1,text:"Du sammelst im Kader und organisierst eine Feier. Er weint, und die halbe Kabine auch.",fx:{morale:12,trust:10,rep:5,money:-.02,legacy:4}}]},
    {label:"Nur die Hand geben",hint:"",roll:[{p:1,text:"Ein Händedruck und ein Trikot. Auch in Ordnung.",fx:{morale:3}}]}]},
{ id:"x_platzwart", tag:"Kurios", w:3, rep:6, cond:p=>p.seasons.length>=1, title:T("Der Rasen ist eine Katastrophe"),
  text:T("Nach drei Wochen Regen ist das Spielfeld ein Acker. Der Platzwart sagt, mehr sei nicht drin."),
  choices:[{label:"Sich anpassen",hint:"",roll:[{p:1,text:"Lange Bälle, zweite Bälle, Zweikämpfe. Nicht schön, aber wirksam.",fx:{phy:1,form:6}}]},
    {label:"Sich beschweren",hint:"",roll:[{p:1,text:"Der Verein bekommt eine Rüge vom Verband, der Platzwart einen schlechten Tag.",fx:{trust:-5,morale:-3}}]}]},
{ id:"x_torhueterduell", tag:"Konkurrenz", w:5, rep:4, cond:p=>p.pos==="TW"&&!!p.rival, title:c=>`Torwartfrage: du oder ${c.rival.name}`,
  text:c=>`Der Trainer sagt öffentlich, er habe zwei Nummer-eins-Torhüter. Genau das ist das Problem.`,
  choices:[{label:"Eine Entscheidung einfordern",hint:"",roll:[{p:.5,text:"Er entscheidet sich für dich. Endlich Klarheit.",fx:{trust:12,form:10,morale:10}},
    {p:.5,text:"Er entscheidet sich gegen dich.",fx:{trust:-12,morale:-14,wantMove:true}}]},
    {label:"Rotation akzeptieren",hint:"",roll:[{p:1,text:"Ihr wechselt euch ab. Für einen Torhüter ist das die schlechteste aller Welten, aber es geht.",fx:{form:-5,fitness:4}}]}]},
{ id:"x_ausruestertest", tag:"Geschäft", w:4, rep:5, cond:p=>p.rep>=40, title:T("Neue Schuhe im Test"),
  text:T("Der Ausrüster schickt ein Modell, das noch nicht im Handel ist. Du sollst es vier Wochen tragen und Rückmeldung geben."),
  choices:[{label:"Testen",hint:"",roll:[{p:.7,text:"Sie passen erstaunlich gut. Du bekommst ein besseres Vertragsangebot.",fx:{money:.2,morale:5}},
    {p:.3,text:"Zwei Blasen und eine gereizte Achillessehne.",fx:{fitness:-7,injuryProne:4}}]},
    {label:"Bei den alten bleiben",hint:"",roll:[{p:1,text:"Never change a running system.",fx:{form:3}}]}]},
{ id:"x_stadionumbau", tag:"Verein", w:4, rep:6, cond:p=>p.seasons.length>=1, title:T("Die Haupttribüne wird umgebaut"),
  text:T("Eine Saison lang halbe Kapazität und eine Baustelle im Rücken der Bank."),
  choices:[{label:"Die Stimmung selbst machen",hint:"",roll:[{p:1,text:"Du gehst vor jedem Spiel zur Kurve und klatschst sie an. Aus zehntausend klingt es wie zwanzig.",fx:{rep:9,morale:8,form:6}}]},
    {label:"Es hinnehmen",hint:"",roll:[{p:1,text:"Ein zähes Jahr vor halbleeren Rängen.",fx:{morale:-6,form:-3}}]}]},
{ id:"x_wintertransfer", tag:"Transfer", w:5, rep:3, cond:p=>p.seasons.length>=1, title:T("Winterwechselperiode"),
  text:T("Ende Januar meldet sich ein Verein, der dringend jemanden braucht. Mitten in der Saison."),
  choices:[{label:"Sofort wechseln",hint:"",roll:[{p:.55,text:"Du gehst im Winter und spielst dort ab dem ersten Tag.",fx:{trust:-8,form:8,morale:8,money:.1}},
    {p:.45,text:"Der Verein blockt ab. Die Sache belastet die Rückrunde.",fx:{trust:-12,form:-8,morale:-8}}]},
    {label:"Im Sommer neu bewerten",hint:"",roll:[{p:1,text:"Du sagst, mitten in der Saison gehst du nicht. Der Trainer hört das gern.",fx:{trust:12,morale:4}}]}]},
{ id:"x_beobachter", tag:"Transfer", w:4, rep:3, cond:p=>p.lastNote<=2.8&&p.seasons.length>=1, title:T("Beobachter auf der Tribüne"),
  text:T("Zwei Männer mit Klemmbrett, direkt über der Trainerbank. Der Zeugwart weiß, für wen sie arbeiten."),
  choices:[{label:"Ein Sonderspiel machen wollen",hint:"",roll:[{p:.45,text:"Du spielst groß auf. Zwei Wochen später kommt ein konkretes Angebot.",fx:{dreamOffer:true,form:10,rep:8}},
    {p:.55,text:"Du willst zu viel und wirkst hektisch.",fx:{form:-9,note:-.05,morale:-6}}]},
    {label:"Normal spielen",hint:"",roll:[{p:1,text:"Genau das wollten sie sehen. Sie kommen nochmal.",fx:{rep:6,note:.06}}]}]},
{ id:"x_medizincheck", tag:"Transfer", w:4, rep:4, cond:p=>!!p.flags.justMoved, title:T("Der Medizincheck zieht sich"),
  text:T("Ein alter Befund am Knie taucht auf. Der neue Verein will nachverhandeln."),
  choices:[{label:"Auf dem Vertrag bestehen",hint:"",roll:[{p:.6,text:"Sie unterschreiben wie besprochen. Der Arzt bleibt skeptisch.",fx:{morale:6}},
    {p:.4,text:"Der Wechsel platzt fast. Am Ende unterschreibst du mit weniger Gehalt.",fx:{morale:-10,trust:-4}}]},
    {label:"Entgegenkommen",hint:"",roll:[{p:1,text:"Du akzeptierst eine erfolgsabhängige Komponente. Fair für beide.",fx:{trust:10,morale:4}}]}]},
{ id:"x_ruecktrittsangebot", tag:"Zukunft", w:4, late:true, cond:p=>p.age>=34, title:T("Ein Verein bietet dir eine Doppelrolle"),
  text:T("Spieler und Co-Trainer gleichzeitig, ab sofort. Zwei Jahre, danach ein Vertrag im Verein."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Du stehst morgens am Whiteboard und nachmittags auf dem Platz. Anstrengend und genau richtig.",fx:{morale:14,legacy:16,fitness:-6,flag:"trainerschein"}}]},
    {label:"Nur spielen",hint:"",roll:[{p:1,text:"Erst zu Ende spielen, dann der Rest.",fx:{form:5}}]}]},
/* ============ SÜDAMERIKA ============ */
{ id:"sa_barra", tag:"Südamerika", w:6, rep:4, cond:p=>confOf(p.club.c)==="CONMEBOL"&&p.seasons.length>=1, title:T("Die Barra steht am Trainingsgelände"),
  text:T("Nach zwei Niederlagen warten dreißig Leute am Tor. Sie wollen reden, sagen sie. Der Sicherheitsmann sagt, du sollst im Auto bleiben."),
  choices:[{label:"Aussteigen und reden",hint:"",roll:[{p:.6,text:"Zwanzig Minuten Klartext am Zaun. Ab da bist du für sie einer von ihnen.",fx:{rep:12,morale:8,trust:6}},
    {p:.4,text:"Es wird laut und eng. Der Verein untersagt so etwas künftig.",fx:{morale:-12,rep:4,trust:-6}}]},
    {label:"Weiterfahren",hint:"",roll:[{p:1,text:"Am Wochenende hängt ein Banner mit deinem Namen. Kein freundliches.",fx:{rep:-8,morale:-8,form:-5}}]}]},
{ id:"sa_libertadores", tag:"Südamerika", w:6, cond:p=>p.europeNext==="Copa Libertadores", title:T("Nachts in einem vollen Stadion"),
  text:T("Anpfiff um halb zehn Ortszeit, Feuerwerk vor dem Anpfiff, und der Rasen ist unter Konfetti kaum zu sehen."),
  choices:[{label:"Die Stimmung mitnehmen",hint:"",roll:[{p:.55,text:c=>`Du ${heldentat(c.p)}. Auf so einem Platz merkt man das sofort.`,fx:{form:14,rep:14,morale:14}},
    {p:.45,text:"Der Lärm frisst deine Konzentration. Zwei Ballverluste, zwei Gegentore.",fx:{form:-10,morale:-8}}]},
    {label:"Nüchtern durchziehen",hint:"",roll:[{p:1,text:"Ein diszipliniertes 0:0 auswärts. Genau das war der Plan.",fx:{note:.1,trust:8}}]}]},
{ id:"sa_hoehe", tag:"Südamerika", w:5, rep:4, cond:p=>["ECU","COL","BOL","PER"].includes(p.club.c)||["Liga Pro","Categoría Primera A"].includes(p.club.l), title:T("Auswärts auf 2.800 Metern"),
  text:T("Nach zehn Minuten fühlen sich deine Beine an wie nach neunzig. Die Gastgeber laufen, als sei nichts."),
  choices:[{label:"Zwei Tage vorher anreisen",hint:"",roll:[{p:1,text:"Der Körper gewöhnt sich zumindest teilweise. Du hältst siebzig Minuten durch.",fx:{fitness:-6,note:.08,trust:6}}]},
    {label:"Am Spieltag anreisen",hint:"",roll:[{p:.4,text:"Erstaunlicherweise geht es gut. Ihr klaut einen Punkt.",fx:{form:6,fitness:-8}},
      {p:.6,text:"Ab der 55. Minute geht gar nichts mehr. 0:3.",fx:{fitness:-14,form:-10,morale:-6}}]}]},
{ id:"sa_scout", tag:"Südamerika", w:6, cond:p=>confOf(p.club.c)==="CONMEBOL"&&p.age<=23&&p.ovr>=66, title:T("Ein europäischer Beobachter im Stadion"),
  text:c=>`Sie sitzen bei jedem Heimspiel in derselben Reihe. Dein Berater sagt, es gehe um einen Verein aus ${c.p.nation.id==="BRA"?"Portugal":"Europa"}.`,
  choices:[{label:"Das Schaufenster nutzen",hint:"",roll:[{p:.5,text:"Du lieferst genau dann ab, wenn sie da sind. Im Winter liegt ein Angebot auf dem Tisch.",fx:{dreamOffer:true,rep:12,form:10}},
    {p:.5,text:"Du spielst verkrampft und sie kommen nicht wieder.",fx:{form:-10,morale:-10}}]},
    {label:"Erst hier reifen",hint:"",roll:[{p:1,text:"Du willst zuerst hier etwas gewinnen. Vernünftig, sagt dein Vater.",fx:{pot:2,trust:10,morale:6}}]}]},
{ id:"sa_clausura", tag:"Südamerika", w:5, rep:3, cond:p=>confOf(p.club.c)==="CONMEBOL"&&p.seasons.length>=1, title:T("Apertura und Clausura"),
  text:T("Zwei Titel pro Jahr, dazwischen drei Wochen Pause. Wer im Februar schlecht startet, hat im Juli schon eine zweite Chance."),
  choices:[{label:"Auf die zweite Hälfte setzen",hint:"",roll:[{p:1,text:"Du nimmst dir die Pause wirklich und kommst frisch zurück.",fx:{fitness:10,form:8}}]},
    {label:"Beides voll spielen",hint:"",roll:[{p:.55,text:"Zwei starke Halbjahre. Deine Zahlen sind die besten im Kader.",fx:{form:10,rep:8,fitness:-10}},
      {p:.45,text:"Im zweiten Halbjahr ist nichts mehr übrig.",fx:{fitness:-14,form:-9}}]}]},
{ id:"sa_rasen", tag:"Südamerika", w:4, rep:5, cond:p=>confOf(p.club.c)==="CONMEBOL", title:T("Der Platz ist eine Zumutung"),
  text:T("Löcher, harte Stellen, und beim Aufwärmen springt der Ball dreimal unterschiedlich."),
  choices:[{label:"Spiel umstellen",hint:"",roll:[{p:1,text:"Flach und kurz geht hier nicht. Du spielst direkter und kommst überraschend gut zurecht.",fx:{pas:1,phy:1,note:.06}}]},
    {label:"Wie immer spielen",hint:"",roll:[{p:.5,text:"Es klappt trotzdem.",fx:{form:4}},{p:.5,text:"Umgeknickt in einem Loch vor dem Strafraum.",fx:{forceInjury:"leicht"}}]}]},

/* ============ NORD- UND MITTELAMERIKA ============ */
{ id:"na_playoff", tag:"Nordamerika", w:6, cond:p=>["MLS","Liga MX"].includes(p.club.l)&&p.seasons.length>=1, title:T("Die Meisterschaft entscheidet sich in den Playoffs"),
  text:T("Die ganze Saison zählt am Ende nur, um überhaupt dabei zu sein. Danach sind es zwei, drei Spiele."),
  choices:[{label:"Alles auf die Playoffs",hint:"",roll:[{p:.5,text:c=>`Du ${heldentat(c.p)} — im Halbfinale und im Endspiel. In diesem Land vergisst man so etwas nicht.`,fx:{form:14,rep:14,morale:16}},
    {p:.5,text:"Nach einer guten Saison ist in einem einzigen Spiel alles vorbei.",fx:{morale:-14,form:-6}}]},
    {label:"Die Saison gleichmäßig angehen",hint:"",roll:[{p:1,text:"Du bringst konstant Leistung. Die Statistik mag das mehr als die Zuschauer.",fx:{note:.1,trust:8}}]}]},
{ id:"na_reise", tag:"Nordamerika", w:5, rep:4, cond:p=>["MLS","Liga MX"].includes(p.club.l), title:T("Vier Zeitzonen an einem Wochenende"),
  text:T("Hinflug am Freitag, Spiel am Samstagabend, Rückflug in der Nacht. Am Dienstag steht die nächste Reise an."),
  choices:[{label:"Reiseroutine aufbauen",hint:"",roll:[{p:1,text:"Schlafmaske, feste Essenszeiten, kein Bildschirm im Flieger. Nach zwei Monaten merkst du den Unterschied.",fx:{fitness:8,phy:1}}]},
    {label:"Durchbeißen",hint:"",roll:[{p:1,text:"Du kommst nie richtig an. Im Frühjahr ist der Akku leer.",fx:{fitness:-12,form:-6}}]}]},
{ id:"na_dp", tag:"Nordamerika", w:5, cond:p=>p.club.l==="MLS", title:T("Die Gehaltsobergrenze"),
  text:T("Der Verein hat drei Plätze für Spitzenverdiener. Zwei sind vergeben, um den dritten bewirbt sich auch ein bekannter Name aus Europa."),
  choices:[{label:"Den Platz einfordern",hint:"",roll:[{p:.45,text:"Sie entscheiden sich für dich. Dein Gehalt vervielfacht sich.",fx:{money:.9,rep:10,trust:6}},
    {p:.55,text:"Sie holen den Namen aus Europa. Du bleibst im Mittelbau.",fx:{morale:-10,trust:-4}}]},
    {label:"Nicht drängeln",hint:"",roll:[{p:1,text:"Du sagst, du willst spielen und nicht verhandeln. Das kommt in der Kabine gut an.",fx:{trust:12,morale:5}}]}]},
{ id:"na_clasico", tag:"Nordamerika", w:5, rep:4, cond:p=>p.club.l==="Liga MX", title:T("Ausverkauft, 80.000 Zuschauer"),
  text:T("In diesem Land ist ein großes Ligaspiel ein Feiertag. Die Woche davor kommst du nirgends unerkannt hin."),
  choices:[{label:"Sich reinstürzen",hint:"",roll:[{p:.55,text:c=>`Du ${heldentat(c.p)}, und am nächsten Tag hängt dein Gesicht an jeder Straßenecke.`,fx:{rep:16,form:12,morale:14}},
    {p:.45,text:"Rote Karte nach einer Stunde. Das Video läuft wochenlang.",fx:{ban2:2,rep:6,morale:-12,trust:-8}}]},
    {label:"Fokussiert bleiben",hint:"",roll:[{p:1,text:"Ein ordentliches Spiel ohne Aufreger.",fx:{note:.08,trust:6}}]}]},
{ id:"na_kunstrasen", tag:"Nordamerika", w:4, rep:5, cond:p=>["MLS","A-League Men"].includes(p.club.l), title:T("Auswärts auf Kunstrasen"),
  text:T("Das Stadion gehört einem Footballteam. Der Belag ist hart, und die Linien passen nicht zum Fußballfeld."),
  choices:[{label:"Extra tapen und durchspielen",hint:"",roll:[{p:.75,text:"Du kommst ohne Blessur durch, spürst die Knie aber zwei Tage.",fx:{fitness:-5}},
    {p:.25,text:"Das Sprunggelenk hält der Belastung nicht stand.",fx:{forceInjury:"leicht",injuryProne:4}}]},
    {label:"Pausieren lassen",hint:"",roll:[{p:1,text:"Der Trainer schont dich. Der Verein verliert.",fx:{trust:-7,fitness:5}}]}]},

/* ============ ASIEN ============ */
{ id:"as_acl", tag:"Asien", w:6, cond:p=>confOf(p.club.c)==="AFC"&&!!p.europeNext, title:T("Sieben Stunden Flug zum Gruppenspiel"),
  text:T("Die Auslosung schickt euch quer über den Kontinent. Hinflug Montag, Spiel Dienstag, Liga am Samstag."),
  choices:[{label:"Voll mitreisen",hint:"",roll:[{p:1,text:"Du machst beide Spiele. Der Trainer weiß, worauf er sich verlassen kann.",fx:{trust:14,fitness:-11,rep:6}}]},
    {label:"Eines auslassen",hint:"",roll:[{p:1,text:"Du bleibst für die Liga zu Hause. Sinnvoll, aber es fällt auf.",fx:{fitness:7,trust:-6}}]}]},
{ id:"as_quote", tag:"Asien", w:6, cond:p=>confOf(p.club.c)==="AFC"&&p.club.c!==p.nation.id, title:T("Die Ausländerquote"),
  text:T("Der Kader darf nur eine bestimmte Zahl ausländischer Spieler aufbieten. Ihr seid einer zu viel."),
  choices:[{label:"Um den Platz kämpfen",hint:"",roll:[{p:.55,text:"Du setzt dich durch. Ein Mitspieler wird verliehen.",fx:{trust:12,form:8,morale:6}},
    {p:.45,text:"Der Trainer entscheidet sich gegen dich. Du sitzt auf der Tribüne, ohne verletzt zu sein.",fx:{trust:-14,morale:-14,wantMove:true}}]},
    {label:"Einbürgerung prüfen lassen",hint:"Zählt dann nicht mehr als Ausländer",roll:[{p:.5,text:"Nach zwei Jahren Wartezeit ginge das. Der Verein unterstützt es.",fx:{morale:8,trust:10,flag:"einbuergerung"}},
      {p:.5,text:"Die Bestimmungen geben es nicht her. Thema erledigt.",fx:{morale:-5}}]}]},
{ id:"as_militaer", tag:"Asien", w:8, g:"m", cond:p=>p.nation.id==="KOR"&&p.age>=20&&p.age<=27&&!p.flags.wehrdienst, title:T("Der Wehrdienst steht an"),
  text:T("Anderthalb Jahre. Es gibt eine Ausnahme, aber nur bei einem Titel bei den großen Turnieren."),
  choices:[{label:"Antreten und in der Militärmannschaft spielen",hint:"",roll:[{p:1,text:"Du spielst weiter, nur eben dort. Sportlich ist es ein Rückschritt, danach bist du frei.",fx:{ban2:14,flag:"wehrdienst",trust:-6,pot:-1,morale:-6}}]},
    {label:"Aufschub beantragen",hint:"",roll:[{p:.45,text:"Der Aufschub wird bewilligt. Zwei Jahre Aufschub, danach dieselbe Frage.",fx:{morale:6}},
      {p:.55,text:"Abgelehnt. Du musst mitten in der Saison gehen.",fx:{ban2:16,flag:"wehrdienst",morale:-14,form:-8}}]}]},
{ id:"as_ramadan", tag:"Herkunft", w:5, rep:4, cond:p=>["ar","fa","ms","ur","bn"].includes(SPHERE[p.nation.id])&&p.age>=18, title:T("Fastenmonat mitten in der Saison"),
  text:T("Vier Wochen ohne Essen und Trinken bei Tageslicht, dazu drei Pflichtspiele pro Woche."),
  choices:[{label:"Mit dem Verein einen Plan machen",hint:"",roll:[{p:1,text:"Ernährungsberater, verlegte Trainingszeiten, Nachtmahlzeiten. Es kostet trotzdem Substanz, aber du kommst durch.",fx:{fitness:-6,morale:10,trust:8}}]},
    {label:"Ohne Anpassung durchziehen",hint:"",roll:[{p:.5,text:"Es geht besser als gedacht.",fx:{morale:10,fitness:-8}},
      {p:.5,text:"Der Körper macht nicht mit. Zwei schwache Wochen und eine Zerrung.",fx:{fitness:-14,forceInjury:"leicht",morale:6}}]}]},
{ id:"as_jleague", tag:"Asien", w:5, rep:4, cond:p=>["J1 League","J2 League"].includes(p.club.l), title:T("Alles ist bis auf die Minute geplant"),
  text:T("Abfahrt 8:47 Uhr, nicht 8:50. Wer zu spät kommt, entschuldigt sich vor der Mannschaft."),
  choices:[{label:"Sich voll anpassen",hint:"",roll:[{p:1,text:"Nach drei Monaten bist du der Pünktlichste im Kader. Die Kabine nimmt dich auf.",fx:{trust:14,morale:10,note:.06}}]},
    {label:"Die eigene Art behalten",hint:"",roll:[{p:1,text:"Man sagt dir nichts, aber du merkst, dass es auffällt.",fx:{trust:-9,morale:-4}}]}]},
{ id:"as_golf", tag:"Asien", w:5, cond:p=>confOf(p.club.c)==="AFC"&&["KSA","QAT","UAE"].includes(p.club.c)&&p.ovr>=70&&p.age>=24, title:T("Ein Angebot zur Einbürgerung"),
  text:T("Man bietet dir einen Pass an. Damit könntest du für dieses Land in der Nationalmannschaft spielen, und die Ausländerquote wäre kein Thema mehr."),
  choices:[{label:"Annehmen",hint:"Neuer Pass, neue Nationalmannschaft",roll:[{p:1,text:"Der Papierkram dauert Monate. Danach läufst du mit einer anderen Hymne auf, und dein Konto sieht anders aus.",fx:{money:1.8,ntBonus:26,rep:8,morale:-6,flag:"eingebuergert"}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du sagst, du willst für dein eigenes Land spielen, auch wenn dich nie jemand nominiert.",fx:{morale:10,rep:6,legacy:8}}]}]},
{ id:"as_wueste", tag:"Asien", w:4, rep:5, cond:p=>["KSA","QAT","UAE"].includes(p.club.c), title:T("Sandsturm am Spieltag"),
  text:T("Die Sicht liegt bei achtzig Metern, und der Verband entscheidet erst zwei Stunden vor Anpfiff."),
  choices:[{label:"Spielen wollen",hint:"",roll:[{p:.6,text:"Es wird gespielt. Ein absurder Abend, den ihr gewinnt.",fx:{form:8,morale:8}},
    {p:.4,text:"Abgesagt, nachdem ihr schon aufgewärmt habt.",fx:{fitness:-4,morale:-4}}]},
    {label:"Für Absage plädieren",hint:"",roll:[{p:1,text:"Der Verband verlegt auf Dienstag.",fx:{fitness:3}}]}]},

/* ============ AFRIKA ============ */
{ id:"af_afcon", tag:"Afrika", w:8, cond:p=>NAT_CONF[p.nation.id]==="CAF"&&p.nt.level==="A", title:T("Der Afrika-Cup liegt mitten in der Saison"),
  text:T("Vier Wochen im Januar. Dein Verein steht im Abstiegskampf und schreibt einen sehr höflichen, sehr deutlichen Brief."),
  choices:[{label:"Fahren",hint:"",roll:[{p:1,text:"Du fährst, weil man für sein Land fährt. Der Verein akzeptiert es, der Trainer weniger.",fx:{ban2:5,ntBonus:16,caps:5,trust:-10,rep:8,morale:10}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Zu Hause verstehen das viele nicht. Der Verein dafür umso mehr.",fx:{trust:14,ntPenalty:22,morale:-12,rep:-6}}]}]},
{ id:"af_caf", tag:"Afrika", w:5, cond:p=>confOf(p.club.c)==="CAF"&&!!p.europeNext, title:T("Auswärtsfahrt über Land"),
  text:T("Umsteigeverbindung, zwölf Stunden Reise, danach ein Hotel ohne Klimaanlage. Anpfiff ist am nächsten Nachmittag."),
  choices:[{label:"Das Beste draus machen",hint:"",roll:[{p:1,text:"Ihr holt ein Unentschieden und feiert es wie einen Sieg.",fx:{morale:10,trust:8,fitness:-8}}]},
    {label:"Sich beim Verein beschweren",hint:"",roll:[{p:1,text:"Beim nächsten Mal wird eine Charter gebucht. Der Sportdirektor rechnet dir vor, was das kostet.",fx:{fitness:5,trust:-5,rep:3}}]}]},
{ id:"af_heimat", tag:"Herkunft", w:5, cond:p=>NAT_CONF[p.nation.id]==="CAF"&&p.money>=.5&&p.club.c!==p.nation.id, title:T("Die Familie zu Hause zählt auf dich"),
  text:T("Nicht nur die Eltern. Onkel, Cousins, die halbe Straße. Jeden Monat kommen neue Bitten."),
  choices:[{label:"Alles unterstützen",hint:"",roll:[{p:1,text:"Du zahlst und zahlst. Es tut gut und es hört nie auf.",fx:{money:-.35,morale:10,legacy:6}}]},
    {label:"Eine feste Summe festlegen",hint:"",roll:[{p:1,text:"Ein monatlicher Betrag, klar geregelt. Ein paar sind beleidigt, der Rest versteht es.",fx:{money:-.12,morale:4}}]},
    {label:"In ein Projekt investieren statt bar",hint:"",roll:[{p:1,text:"Du baust eine Schule statt Geld zu verteilen. Das trägt weiter.",fx:{money:-.45,rep:10,morale:12,legacy:18}}]}]},
{ id:"af_alter", tag:"Herkunft", w:4, cond:p=>NAT_CONF[p.nation.id]==="CAF"&&p.age<=22&&p.club.c!==p.nation.id, title:T("Zweifel am Geburtsdatum"),
  text:T("Eine Zeitung behauptet, du seist älter als angegeben. Deine Papiere sind in Ordnung, aber die Geschichte hält sich."),
  choices:[{label:"Alle Unterlagen offenlegen",hint:"",roll:[{p:1,text:"Der Verband bestätigt alles. Es bleibt ein schaler Beigeschmack, den du nicht verschuldet hast.",fx:{rep:5,morale:-8,trust:6}}]},
    {label:"Nicht darauf eingehen",hint:"",roll:[{p:1,text:"Das Gerücht begleitet dich noch Jahre.",fx:{rep:-8,morale:-6}}]}]},
{ id:"af_akademie", tag:"Herkunft", w:4, cond:p=>NAT_CONF[p.nation.id]==="CAF"&&p.age>=27, title:T("Deine alte Akademie ruft an"),
  text:T("Der Mann, der dich mit zwölf entdeckt hat, betreibt sie immer noch. Es fehlt an allem außer an Talenten."),
  choices:[{label:"Ausrüstung und Geld schicken",hint:"",roll:[{p:1,text:"Zwei Container. Ein Jahr später spielt einer von dort in Belgien.",fx:{money:-.2,rep:9,morale:12,legacy:14}}]},
    {label:"Selbst hinfahren",hint:"",roll:[{p:1,text:"Drei Tage vor Ort, ohne Presse. Du kommst mit anderen Maßstäben zurück.",fx:{money:-.06,morale:16,legacy:10,fitness:-3}}]}]},

/* ============ OZEANIEN UND AUSTRALIEN ============ */
{ id:"oz_grandfinal", tag:"Ozeanien", w:5, cond:p=>p.club.l==="A-League Men"&&p.seasons.length>=1, title:T("Grand Final"),
  text:T("Ein Spiel, ein Titel, und davor eine Woche, in der das halbe Land so tut, als sei Fußball hier die wichtigste Sportart."),
  choices:[{label:"Vorangehen",hint:"",roll:[{p:.5,text:c=>`Du ${heldentat(c.p)} in der Verlängerung. Danach kennt dich auch der Rest des Landes.`,fx:{rep:14,form:12,morale:16}},
    {p:.5,text:"Ihr verliert im Elfmeterschießen. Du hast einen davon verschossen.",fx:{morale:-16,form:-8}}]},
    {label:"Deine Rolle erfüllen",hint:"",roll:[{p:1,text:"Du machst deinen Job und hältst hinten dicht.",fx:{note:.1,trust:8}}]}]},
{ id:"oz_distanz", tag:"Ozeanien", w:4, rep:4, cond:p=>p.club.l==="A-League Men"||NAT_CONF[p.nation.id]==="OFC", title:T("Weit weg von allem"),
  text:T("Von hier ist jede europäische Liga vierundzwanzig Stunden entfernt. Beobachter kommen selten."),
  choices:[{label:"Selbst Videos verschicken",hint:"",roll:[{p:.5,text:"Ein Zweitligist aus Europa meldet sich tatsächlich.",fx:{rep:8,dreamOffer:true}},
    {p:.5,text:"Keine Antwort. Von niemandem.",fx:{morale:-8}}]},
    {label:"Hier eine Marke aufbauen",hint:"",roll:[{p:1,text:"Wenn sie dich nicht suchen, sollen sie dich eben nicht übersehen können.",fx:{form:8,rep:6,morale:6}}]}]},

/* ============ RUSSLAND UND OSTEUROPA ============ */
{ id:"ru_winter", tag:"Osteuropa", w:5, rep:4, cond:p=>["RUS","UKR","BLR","KAZ"].includes(p.club.c), title:T("Minus achtzehn Grad beim Anpfiff"),
  text:T("Der Ball springt wie ein Stein, der Rasen ist beheizt und trotzdem hart, und die Kurve steht seit zwei Stunden draußen."),
  choices:[{label:"Doppelt aufwärmen",hint:"",roll:[{p:1,text:"Vierzig Minuten Aufwärmen statt zwanzig. Du kommst ohne Muskelverletzung durch.",fx:{fitness:-4,injuryProne:-3,note:.06}}]},
    {label:"Wie immer",hint:"",roll:[{p:.55,text:"Nichts passiert.",fx:{}},{p:.45,text:"Adduktorenzerrung in der 20. Minute.",fx:{forceInjury:"leicht"}}]}]},
{ id:"ru_isoliert", tag:"Osteuropa", w:5, cond:p=>p.club.c==="RUS", title:T("Kein internationaler Wettbewerb"),
  text:T("Die Liga ist gut bezahlt und international abgemeldet. Wer hier spielt, verschwindet aus dem Blick der großen Klubs."),
  choices:[{label:"Bleiben und kassieren",hint:"",roll:[{p:1,text:"Das Konto wächst schneller als deine Bekanntheit.",fx:{money:.5,rep:-10,morale:-4}}]},
    {label:"Auf einen Wechsel drängen",hint:"",roll:[{p:1,text:"Du sagst deinem Berater, er soll suchen. Egal wohin, Hauptsache sichtbar.",fx:{wantMove:true,rep:3,trust:-8}}]}]},

/* ============ UNTERHAUS ============ */
{ id:"uh_playoff", tag:"Aufstiegsrunde", w:8, cond:p=>{const t=TIER[p.club.l];const s=lastS(p);return sameClub(p)&&sameLeague(p)&&t&&t[0]&&s&&s.rank>=3&&s.rank<=6;},
  title:T("Aufstiegsspiele"),
  text:c=>`Platz ${c.ls.rank} reicht nicht direkt, aber für die Relegation. Zwei Halbfinalspiele, dann ein Endspiel vor ausverkauftem Haus.`,
  choices:[{label:"Volles Risiko",hint:"",roll:[{p:.45,text:c=>`Du ${heldentat(c.p)}. Der Aufstieg ist perfekt, und dieser Moment läuft in dreißig Jahren noch.`,fx:{form:16,rep:16,morale:20,legacy:10}},
    {p:.55,text:"Im Halbfinale ist Schluss. Die Rückfahrt dauert vier Stunden und niemand sagt ein Wort.",fx:{morale:-16,form:-8}}]},
    {label:"Absichern",hint:"",roll:[{p:.5,text:"Ein 0:0 und ein 1:0. Aufgestiegen ist aufgestiegen.",fx:{morale:14,trust:10,note:.08}},
      {p:.5,text:"Zu wenig nach vorne. Es reicht nicht.",fx:{morale:-12}}]}]},
{ id:"uh_nebenjob", tag:"Unterhaus", w:6, cond:p=>ligaInfo(p.club.l).pay<=.6&&p.age>=18, title:T("Vom Fußball allein leben?"),
  text:T("Das Gehalt reicht knapp. Zwei Mitspieler arbeiten vormittags, einer als Elektriker, einer im Lager."),
  choices:[{label:"Nebenjob annehmen",hint:"",roll:[{p:1,text:"Vormittags arbeiten, nachmittags Training. Es geht, kostet aber jede Regeneration.",fx:{money:.02,fitness:-9,morale:4,pot:-1}}]},
    {label:"Nur Fußball",hint:"",roll:[{p:1,text:"Du lebst sparsam und trainierst doppelt. Riskant, aber du willst es wissen.",fx:{money:-.03,dev:0,pot:2,fitness:6,morale:-5}}]}]},
{ id:"uh_auswaerts", tag:"Unterhaus", w:5, rep:4, cond:p=>ligaInfo(p.club.l).pay<=.8, title:T("Sechs Stunden im Bus"),
  text:T("Kein Charterflug, kein Hotel. Abfahrt um sechs, Spiel um 15 Uhr, Rückkehr gegen Mitternacht."),
  choices:[{label:"Die Fahrt nutzen",hint:"",roll:[{p:1,text:"Kartenspiele, Videoanalyse, Schlaf. Diese Busfahrten schweißen mehr zusammen als jedes Trainingslager.",fx:{trust:10,morale:8,fitness:-4}}]},
    {label:"Kopfhörer auf",hint:"",roll:[{p:1,text:"Du schläfst und kommst frischer an als die anderen.",fx:{fitness:4,trust:-3}}]}]},
{ id:"uh_geld", tag:"Unterhaus", w:5, cond:p=>ligaInfo(p.club.l).pay<=.7, title:T("Dem Verein fehlt die Lizenz"),
  text:T("Der Verband verlangt Nachweise bis Freitag. Ohne sie steht der Klub nächste Saison nicht im Spielplan."),
  choices:[{label:"Auf Gehalt verzichten",hint:"",roll:[{p:.7,text:"Der halbe Kader verzichtet auf zwei Monatsgehälter. Die Lizenz kommt durch.",fx:{money:-.04,rep:10,trust:14,morale:8,legacy:6}},
    {p:.3,text:"Es reicht trotzdem nicht. Zwangsabstieg.",fx:{money:-.04,morale:-16}}]},
    {label:"Auf deinem Vertrag bestehen",hint:"",roll:[{p:1,text:"Rechtlich einwandfrei. In der Kabine wird es trotzdem still, wenn du reinkommst.",fx:{trust:-16,morale:-8}}]}]},
{ id:"uh_pokalschlag", tag:"Unterhaus", w:6, rep:3, cond:p=>ligaInfo(p.club.l).pay<=1.5&&p.seasons.length>=1, title:T("Pokal gegen einen Erstligisten"),
  text:T("Zu Hause, ausverkauft, Flutlicht, und die Fernsehsender haben sich angemeldet."),
  choices:[{label:"Hoch pressen und angreifen",hint:"",roll:[{p:.4,text:"Ihr werft ihn raus. Solche Abende gibt es einmal pro Karriere, und alle wissen danach, wie du heißt.",fx:{rep:18,morale:20,form:14,dreamOffer:true}},
    {p:.6,text:"Nach zwanzig Minuten steht es 0:2 und danach wird es hässlich.",fx:{morale:-10,form:-6}}]},
    {label:"Tief stehen und hoffen",hint:"",roll:[{p:.45,text:"0:0 nach neunzig Minuten, dann Elfmeterschießen. Ihr gewinnt.",fx:{rep:14,morale:16,trust:10}},
      {p:.55,text:"Ein Gegentor in der 88. Minute. Ehrenvoll, aber raus.",fx:{morale:-4,rep:5}}]}]},
{ id:"uh_stadion", tag:"Unterhaus", w:4, rep:5, cond:p=>ligaInfo(p.club.l).pay<=.8, title:T("Achthundert Zuschauer"),
  text:T("Man hört den Trainer, den Gegner und einzelne Zurufe von der Gegengerade. Namentlich."),
  choices:[{label:"Den Zuruf beantworten",hint:"",roll:[{p:.6,text:"Du drehst dich um und lachst. Ab da ist der Mann dein größter Fan.",fx:{morale:8,rep:4}},
    {p:.4,text:"Du reagierst zu deutlich. Der Schiedsrichter zeigt Gelb.",fx:{morale:-5,trust:-3}}]},
    {label:"Ignorieren",hint:"",roll:[{p:1,text:"Nach neunzig Minuten weißt du trotzdem noch, was er gerufen hat.",fx:{form:3}}]}]},

/* ============ HERKUNFT UND STAATSANGEHÖRIGKEIT ============ */
{ id:"hk_arbeitserlaubnis", tag:"Herkunft", w:6, cond:p=>!!p.flags.justMoved&&p.club.c==="ENG"&&p.nation.id!=="ENG"&&NAT_CONF[p.nation.id]!=="UEFA", title:T("Die Arbeitserlaubnis wackelt"),
  text:T("Ein Punktesystem entscheidet über deine Spielberechtigung. Länderspiele, Ligaklasse, Einsatzminuten — dir fehlen zwei Punkte."),
  choices:[{label:"Ausnahmeantrag stellen",hint:"",roll:[{p:.6,text:"Die Kommission gibt dir recht. Du darfst spielen, hast aber sechs Wochen verloren.",fx:{ban2:4,morale:-6,trust:4}},
    {p:.4,text:"Abgelehnt. Der Verein leiht dich für ein Jahr ins Ausland.",fx:{wantLoan:true,morale:-14,trust:-6}}]},
    {label:"Ein Jahr woanders sammeln",hint:"",roll:[{p:1,text:"Du gehst erst in eine Liga ohne Hürden und kommst mit Länderspielen zurück.",fx:{wantLoan:true,pot:1,morale:-4}}]}]},
{ id:"hk_erster", tag:"Herkunft", w:6, cond:p=>p.ovr>=72&&["OFC","AFC","CAF"].includes(NAT_CONF[p.nation.id])&&TOP5.includes(p.club.l), title:T("Der erste aus deinem Land"),
  text:c=>`Noch nie hat jemand aus ${c.p.nation.name} in dieser Liga gespielt. Zu Hause laufen deine Spiele mitten in der Nacht, und trotzdem schauen sie zu.`,
  choices:[{label:"Die Rolle annehmen",hint:"",roll:[{p:1,text:"Du gibst jedes Interview, das dein Heimatsender will. Ein Jahr später kommen zwei Landsleute nach.",fx:{rep:14,morale:12,legacy:20,fitness:-3}}]},
    {label:"Einfach Fußball spielen",hint:"",roll:[{p:1,text:"Du sagst, du bist Spieler und kein Symbol. Verstehen nicht alle.",fx:{form:7,legacy:4}}]}]},
{ id:"hk_sprachbarriere", tag:"Herkunft", w:5, cond:p=>p.club.c!==p.nation.id&&SPHERE[p.club.c]!==SPHERE[p.nation.id]&&!p.flags.sprache2, title:T("Niemand spricht deine Sprache"),
  text:T("Nicht der Trainer, nicht die Mitspieler, nicht der Vermieter. Der Verein stellt einen Dolmetscher für die ersten Wochen."),
  choices:[{label:"Sofort Unterricht nehmen",hint:"",roll:[{p:1,text:"Fünf Stunden pro Woche zusätzlich. Nach einem halben Jahr brauchst du den Dolmetscher nicht mehr.",fx:{trust:12,morale:10,note:.06,flag:"sprache2",fitness:-3}}]},
    {label:"Auf Englisch durchkommen",hint:"",roll:[{p:1,text:"Geht auf dem Platz. Beim Abendessen sitzt du still daneben.",fx:{morale:-9,trust:-5}}]}]},
{ id:"hk_diaspora", tag:"Herkunft", w:4, cond:p=>p.club.c!==p.nation.id&&p.seasons.length>=2, title:T("Landsleute im Stadion"),
  text:c=>`Ein Fanclub aus der ${c.p.nation.name}-Gemeinde der Stadt hat sich gemeldet. Sie kommen zu jedem Heimspiel, ganz oben in Block C.`,
  choices:[{label:"Sie einladen",hint:"",roll:[{p:1,text:"Du besorgst dreißig Karten und gehst nach dem Spiel hoch. Von da an fühlt sich die fremde Stadt weniger fremd an.",fx:{morale:14,rep:6,money:-.02}}]},
    {label:"Freundlich Abstand halten",hint:"",roll:[{p:1,text:"Du winkst nach dem Spiel. Mehr Nähe willst du nicht.",fx:{morale:2}}]}]},
{ id:"hk_krise", tag:"Herkunft", w:4, cond:p=>p.money>=.6&&p.age>=22, title:T("Schlechte Nachrichten aus der Heimat"),
  text:T("Ein Unwetter hat eine ganze Region getroffen. Deine Familie ist in Sicherheit, viele andere nicht."),
  choices:[{label:"Eine Hilfsaktion starten",hint:"",roll:[{p:1,text:"Du spendest, sammelst im Kader und beim Verein. Am Ende kommt ein Vielfaches deines eigenen Betrags zusammen.",fx:{money:-.3,rep:14,morale:12,legacy:16}}]},
    {label:"Still spenden",hint:"",roll:[{p:1,text:"Ohne Foto, ohne Meldung. Genau richtig.",fx:{money:-.18,morale:10,legacy:8}}]}]},
{ id:"hk_verbandswechsel", tag:"Herkunft", w:5, cond:p=>p.nt.level!=="A"&&p.age>=21&&p.age<=29&&p.ovr>=70&&!p.flags.eingebuergert, title:T("Ein anderer Verband klopft an"),
  text:c=>`Über deine Großmutter wärst du auch für ein anderes Land spielberechtigt. Dort stünden dir Länderspiele sofort offen, während du hier auf einen Anruf wartest, der nie kommt.`,
  choices:[{label:"Wechseln",hint:"",roll:[{p:1,text:"Ein neuer Verband, eine neue Hymne, und beim ersten Spiel läuft dein Vater am Spielfeldrand mit Tränen in den Augen mit.",fx:{ntBonus:34,rep:8,morale:8,flag:"verbandswechsel"}}]},
    {label:"Weiter warten",hint:"",roll:[{p:.4,text:"Ein halbes Jahr später kommt die erste Nominierung doch noch.",fx:{ntBonus:16,morale:12}},
      {p:.6,text:"Der Anruf kommt nicht. Du wirst nie ein Länderspiel machen.",fx:{morale:-12,ntPenalty:8}}]}]},
{ id:"hk_hymnedebatte", tag:"Herkunft", w:4, cond:p=>p.flags.verbandswechsel||p.flags.eingebuergert, title:T("Zweifel an deiner Entscheidung"),
  text:T("Eine Zeitung im Land, für das du nicht spielst, nennt dich einen Söldner. Eine im anderen Land nennt dich einen Zugereisten."),
  choices:[{label:"Einmal ausführlich erklären",hint:"",roll:[{p:1,text:"Du erzählst deine ganze Familiengeschichte in einem Interview. Danach ist das Thema für die meisten erledigt.",fx:{rep:8,morale:8}}]},
    {label:"Nichts sagen",hint:"",roll:[{p:1,text:"Es begleitet dich bis zum Karriereende.",fx:{rep:-6,morale:-6}}]}]},
{ id:"hk_klima", tag:"Herkunft", w:4, cond:p=>p.club.c!==p.nation.id&&CLIMATE[p.club.c]!==CLIMATE[p.nation.id]&&!p.flags.klima, title:T("Ein ganz anderes Wetter"),
  text:c=>`Du bist in einem anderen Klima aufgewachsen. Der erste Winter beziehungsweise der erste Sommer hier trifft dich härter als erwartet.`,
  choices:[{label:"Umstellen und anpassen",hint:"",roll:[{p:1,text:"Anderes Aufwärmen, andere Ernährung, andere Kleidung. Nach einem Jahr merkst du nichts mehr.",fx:{fitness:8,injuryProne:-5,flag:"klima"}}]},
    {label:"Aussitzen",hint:"",roll:[{p:1,text:"Die erste Saison verläuft zäh, danach wird es besser. Von selbst.",fx:{fitness:-9,form:-5,flag:"klima"}}]}]},
{ id:"hk_wm", tag:"Herkunft", w:5, cond:p=>p.nt.level==="A"&&p.nation.str<=62&&p.nt.caps>=8, title:T("Erste Weltmeisterschaft für dein Land"),
  text:T("Zum ersten Mal überhaupt hat sich dein Land qualifiziert. Zu Hause ist der Tag der Auslosung ein Feiertag."),
  choices:[{label:"Alles auf das Turnier ausrichten",hint:"",roll:[{p:1,text:"Du spielst die Saison mit einem einzigen Ziel vor Augen und kommst topfit ins Turnier.",fx:{ntBonus:18,fitness:8,morale:16,rep:10,legacy:12}}]},
    {label:"Den Verein nicht vernachlässigen",hint:"",roll:[{p:1,text:"Du machst beides ordentlich, keins herausragend.",fx:{trust:10,ntBonus:6,note:.06}}]}]},

/* ============ NEUE VEREINSSITUATIONEN ============ */
{ id:"nv_investor", tag:"Verein", w:5, rep:4, cond:p=>ligaInfo(p.club.l).pay>=1&&ligaInfo(p.club.l).pay<=5.5, title:T("Ein Investor aus dem Ausland übernimmt"),
  text:T("Neue Eigentümer, neue Pläne, ein Trainer aus einem anderen Land und Gerüchte über ein Dutzend Neuzugänge."),
  choices:[{label:"Als Erster auf sie zugehen",hint:"",roll:[{p:.6,text:"Sie sehen dich als Achse des neuen Teams und verlängern deinen Vertrag.",fx:{extend:2,trust:14,morale:10,money:.2}},
    {p:.4,text:"Du wirst höflich angehört und dann aussortiert.",fx:{trust:-12,wantMove:true}}]},
    {label:"Abwarten",hint:"",roll:[{p:1,text:"Nach vier Monaten weißt du auch nicht mehr als am Anfang.",fx:{morale:-5}}]}]},
{ id:"nv_zweitverein", tag:"Verein", w:4, cond:p=>p.age<=23&&ligaInfo(p.club.l).pay>=3, title:T("Dein Verein gehört zu einem Klubverbund"),
  text:T("Derselbe Eigentümer besitzt vier Vereine in vier Ländern. Man könnte dich intern verschieben, ohne dass eine Ablöse fließt."),
  choices:[{label:"Den Weg mitgehen",hint:"",roll:[{p:1,text:"Ein Jahr im Partnerverein, dann zurück. Der Plan ist klar und er funktioniert meistens.",fx:{wantLoan:true,pot:2,trust:8}}]},
    {label:"Sich dagegen wehren",hint:"",roll:[{p:1,text:"Du sagst, du bist kein Verschiebebahnhof. Sie akzeptieren es und planen anders.",fx:{trust:-8,morale:6}}]}]},
{ id:"nv_derbygross", tag:"Verein", w:5, rep:4, cond:p=>p.club.s>=74&&confOf(p.club.c)!=="UEFA", title:T("Das größte Spiel deines Kontinents"),
  text:T("Zwei Rekordmeister, ein Stadion, das seit Wochen ausverkauft ist, und Kameras aus zwanzig Ländern."),
  choices:[{label:"Die Bühne suchen",hint:"",roll:[{p:.5,text:c=>`Du ${heldentat(c.p)}, und die Bilder laufen weltweit. Plötzlich kennen dich Leute, die deine Liga noch nie geschaut haben.`,fx:{rep:18,form:12,morale:14,dreamOffer:true}},
    {p:.5,text:c=>`Du ${fehler(c.p)}, und zwar in Großaufnahme.`,fx:{rep:-6,form:-10,morale:-10}}]},
    {label:"Die Aufgabe erfüllen",hint:"",roll:[{p:1,text:"Solide neunzig Minuten. Der Trainer ist zufrieden, die Kameras nicht.",fx:{note:.1,trust:8}}]}]},
/* ============ JUNGE SPIELER ============ */
{ id:"j_ersterprofi", tag:"Nachwuchs", w:9, fresh:true, cond:p=>p.age<=19&&!p.flags.ersterVertrag, title:T("Der erste Profivertrag"),
  text:T("Drei Jahre, ein Gehalt, von dem deine Eltern früher zu viert gelebt haben. Der Sportdirektor schiebt dir einen Stift über den Tisch."),
  choices:[{label:"Sofort unterschreiben",hint:"",roll:[{p:1,text:"Du unterschreibst, ohne die Klauseln zu lesen. Vor der Tür wartet deine Mutter und weint.",fx:{morale:20,trust:10,flag:"ersterVertrag"}}]},
    {label:"Erst prüfen lassen",hint:"",roll:[{p:.65,text:"Ein Anwalt findet zwei Punkte, die du später nicht bereuen willst. Sie ändern beides.",fx:{money:.06,morale:12,trust:4,flag:"ersterVertrag"}},
      {p:.35,text:"Der Verein findet das kleinlich. Am Ende unterschreibst du dasselbe Papier.",fx:{trust:-6,morale:8,flag:"ersterVertrag"}}]}]},
{ id:"j_einstand", tag:"Kabine", w:7, cond:p=>p.age<=21&&!p.flags.einstand, title:T("Das Einstandslied"),
  text:T("Auf den Stuhl, mitten in der Kantine, vor achtundzwanzig Profis. Es gibt kein Entkommen und kein Erbarmen."),
  choices:[{label:"Voll durchziehen",hint:"",roll:[{p:1,text:"Du singst laut und falsch bis zum Ende. Danach klopfen dir Leute auf die Schulter, die dich vorher nicht gegrüßt haben.",fx:{trust:12,morale:12,flag:"einstand"}}]},
    {label:"Abbrechen",hint:"",roll:[{p:1,text:"Nach zwei Zeilen setzt du dich hin. Es wird still, und die Sache hängt dir Wochen nach.",fx:{trust:-8,morale:-8,flag:"einstand"}}]}]},
{ id:"j_erstesgeld", tag:"Nachwuchs", w:7, cond:p=>p.age<=20&&p.money<=.2, title:T("Die erste richtige Überweisung"),
  text:T("Auf dem Konto steht eine Zahl, bei der du dreimal nachschaust, ob die Kommastelle stimmt."),
  choices:[{label:"Etwas für die Eltern",hint:"",roll:[{p:1,text:"Du zahlst die Küche, die seit zehn Jahren gemacht werden sollte. Dein Vater sagt nichts und schaut die Wand an.",fx:{money:-.02,morale:16,legacy:4}}]},
    {label:"Ein Auto kaufen",hint:"",roll:[{p:1,text:"Zu groß, zu laut, zu teuer. Aber du bist neunzehn und es fühlt sich richtig an.",fx:{money:-.04,morale:12,rep:3}}]},
    {label:"Alles anlegen",hint:"",roll:[{p:1,text:"Dein Berater ist begeistert. Deine Freunde finden dich langweilig.",fx:{money:.01,morale:4,rep:-2}}]}]},
{ id:"j_ausziehen", tag:"Nachwuchs", w:6, cond:p=>p.age>=18&&p.age<=21&&!p.flags.ausgezogen, title:T("Die erste eigene Wohnung"),
  text:T("Vierzig Quadratmeter, zwei Kartons und eine Waschmaschine, die niemand angeschlossen hat."),
  choices:[{label:"Alleine wohnen",hint:"",roll:[{p:1,text:"Nach drei Wochen kannst du Nudeln kochen und Hemden bügeln. Nach drei Monaten ist es dein Zuhause.",fx:{morale:8,fitness:-3,flag:"ausgezogen"}}]},
    {label:"Mit einem Mitspieler zusammenziehen",hint:"",roll:[{p:1,text:"Ihr fahrt gemeinsam zum Training und redet abends über nichts anderes als Fußball. Perfekt und ein bisschen zu viel.",fx:{morale:12,trust:8,flag:"ausgezogen"}}]}]},
{ id:"j_uyouth", tag:"Nachwuchs", w:6, cond:p=>p.age<=19&&p.club.s>=72, title:T("Internationales Nachwuchsturnier"),
  text:T("Dieselben Gegner wie bei den Profis, nur zwanzig Jahre jünger. Auf der Tribüne sitzen Beobachter mit Klemmbrettern."),
  choices:[{label:"Alles zeigen wollen",hint:"",roll:[{p:.55,text:c=>`Du ${heldentat(c.p)}, und der Cheftrainer der Profis nimmt dich am Montag mit ins Training.`,fx:{trust:16,rep:8,pot:2,form:8}},
    {p:.45,text:"Du willst zu viel und verlierst zwölf Bälle in einem Spiel.",fx:{trust:-6,morale:-8}}]},
    {label:"Einfach mitspielen",hint:"",roll:[{p:1,text:"Unauffällig und ordentlich. Niemand redet über dich, im Guten wie im Schlechten.",fx:{pot:1,note:.05}}]}]},
{ id:"j_reserve", tag:"Nachwuchs", w:7, cond:p=>p.age<=21&&["bench","tribune"].includes(p.role), title:T("Runter zur zweiten Mannschaft"),
  text:T("Samstag um vierzehn Uhr, dritter Platz, hundert Zuschauer. Für dich fühlt es sich an wie eine Strafe."),
  choices:[{label:"Es ernst nehmen",hint:"",roll:[{p:.7,text:"Du machst dort in acht Spielen sieben Tore. Im Winter bist du wieder oben.",fx:{form:12,trust:10,pot:1,morale:6}},
    {p:.3,text:"Du spielst ordentlich, aber niemand schaut hin.",fx:{morale:-8,form:4}}]},
    {label:"Sich hängen lassen",hint:"",roll:[{p:1,text:"Der Trainer der Zweiten meldet nach oben, dass du nicht willst. Das ist der Anfang vom Ende.",fx:{trust:-16,morale:-12,pot:-2}}]}]},
{ id:"j_wachstum", tag:"Körper", w:6, cond:p=>p.age<=19, title:T("Der Körper wächst schneller als der Rest"),
  text:T("Acht Zentimeter in einem Jahr. Die Knie schmerzen nach jeder Einheit, und der Arzt sagt, das sei normal."),
  choices:[{label:"Belastung zurückfahren",hint:"",roll:[{p:1,text:"Drei Monate reduziert trainieren. Danach ist der Schmerz weg und du bist der Größte im Jahrgang.",fx:{phy:3,fitness:-6,injuryProne:-8,form:-5}}]},
    {label:"Voll weitermachen",hint:"",roll:[{p:.45,text:"Es geht gut aus. Du hast Glück gehabt.",fx:{phy:2,pac:1}},
      {p:.55,text:"Eine Sehnenreizung, die ein halbes Jahr bleibt.",fx:{forceInjury:"mittel",injuryProne:9}}]}]},
{ id:"j_vergleich", tag:"Medien", w:6, cond:p=>p.age<=21&&p.rep>=30, title:T("Der Vergleich mit einer Legende"),
  text:c=>`Eine Zeitung nennt dich den neuen Großen dieses Vereins. Du hast elf Profispiele gemacht.`,
  choices:[{label:"Sofort abwehren",hint:"",roll:[{p:1,text:"Du sagst, du seist der erste du und sonst gar nichts. Das nimmt viel Druck raus.",fx:{morale:10,rep:5,form:5}}]},
    {label:"Genießen",hint:"",roll:[{p:.4,text:"Du wächst an der Erwartung.",fx:{form:10,rep:8}},
      {p:.6,text:"Bei jedem Fehlpass wird der Vergleich neu aufgewärmt.",fx:{form:-10,morale:-10}}]}]},
{ id:"j_ersterote", tag:"Sportlich", w:6, cond:p=>p.age<=21&&p.tot.apps>=10, title:T("Die erste Rote Karte"),
  text:T("Notbremse, klare Sache, und du bist zum ersten Mal in deinem Leben vom Platz geflogen."),
  choices:[{label:"Sich bei der Mannschaft entschuldigen",hint:"",roll:[{p:1,text:"Du sprichst am Montag vor allen. Die Älteren finden das erwachsen.",fx:{trust:10,ban2:1,morale:-4}}]},
    {label:"Es abschütteln",hint:"",roll:[{p:1,text:"Passiert. Der Trainer sieht das anders.",fx:{ban2:1,trust:-6}}]}]},
{ id:"j_fuehrerschein", tag:"Nachwuchs", w:5, cond:p=>p.age>=18&&p.age<=20&&!p.flags.fuehrerschein, title:T("Die Fahrprüfung"),
  text:T("Vierzig Fahrstunden zwischen Training und Auswärtsfahrten. Der Fahrlehrer ist Fan des Stadtrivalen."),
  choices:[{label:"Durchziehen",hint:"",roll:[{p:.8,text:"Bestanden im ersten Anlauf. Ab jetzt musst du nicht mehr abgeholt werden.",fx:{morale:10,money:-.01,flag:"fuehrerschein"}},
    {p:.2,text:"Durchgefallen. Die Kabine erfährt es noch am selben Tag.",fx:{morale:-6,money:-.01}}]},
    {label:"Verschieben",hint:"",roll:[{p:1,text:"Erst nach der Saison. Bis dahin fährt dich dein Vater.",fx:{}}]}]},
{ id:"j_socialfame", tag:"Medien", w:5, cond:p=>p.age<=20&&p.rep>=25, title:T("Ein Clip von dir geht viral"),
  text:T("Zwanzig Sekunden aus dem Training, vier Millionen Aufrufe. Über Nacht folgen dir mehr Leute als deinem Verein."),
  choices:[{label:"Die Reichweite nutzen",hint:"",roll:[{p:1,text:"Zwei Anfragen von Ausrüstern, eine davon ernst gemeint.",fx:{rep:12,money:.08,trust:-4}}]},
    {label:"Handy abgeben und trainieren",hint:"",roll:[{p:1,text:"Du löschst die App bis zum Saisonende. Der Trainer erfährt davon und lobt dich vor der Mannschaft.",fx:{trust:12,form:8,rep:-4}}]}]},

/* ============ BESTE JAHRE ============ */
{ id:"b_achse", tag:"Führung", w:7, cond:p=>p.age>=24&&p.age<=30&&p.ovr>=p.club.s-1, title:T("Der Trainer baut die Mannschaft um dich"),
  text:T("Er zeigt dir die Tafel und sagt, das System stehe und falle mit deiner Position. Das ist ein Kompliment und eine Ansage."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Ab jetzt hängt jede Woche an dir. Genau das wolltest du immer.",fx:{trust:14,rep:8,form:8,fitness:-5,legacy:6}}]},
    {label:"Um Entlastung bitten",hint:"",roll:[{p:1,text:"Er verteilt die Last auf drei Spieler. Weniger Ruhm, weniger Druck.",fx:{fitness:8,trust:-4,note:.06}}]}]},
{ id:"b_spitzenverdiener", tag:"Vertrag", w:6, cond:p=>p.age>=25&&p.ovr>=p.club.s+2, title:T("Du bist der Bestverdiener im Kader"),
  text:T("Irgendwer hat die Zahl durchgestochen, und jetzt steht sie in einer Tabelle im Internet."),
  choices:[{label:"Offen dazu stehen",hint:"",roll:[{p:1,text:"Du sagst in der Kabine, was du verdienst, und warum. Das entzieht dem Thema die Luft.",fx:{trust:10,morale:6,rep:4}}]},
    {label:"Nicht darüber reden",hint:"",roll:[{p:.55,text:"Es beruhigt sich von selbst.",fx:{morale:-3}},
      {p:.45,text:"Zwei Mitspieler ziehen daraus falsche Schlüsse.",fx:{trust:-10,morale:-8}}]}]},
{ id:"b_schmerzmittel", tag:"Risiko", w:6, cond:p=>p.age>=23&&p.age<=32&&p.fitness<80, title:T("Eine Spritze vor dem Anpfiff"),
  text:T("Der Arzt sagt, danach spürst du nichts mehr. Er sagt auch, dass das nicht heißt, dass nichts kaputt ist."),
  choices:[{label:"Nehmen und spielen",hint:"",roll:[{p:.6,text:"Du spielst durch und lieferst ab. Am Sonntag kommst du kaum aus dem Bett.",fx:{trust:12,form:8,injuryProne:8,fitness:-8}},
    {p:.4,text:"Du merkst zu spät, dass etwas reißt, weil du nichts spürst.",fx:{forceInjury:"mittel",injuryProne:10,trust:6}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du sagst nein und sitzt draußen. Der Arzt respektiert das, der Trainer schweigt.",fx:{trust:-8,fitness:6,injuryProne:-4}}]}]},
{ id:"b_taktikbank", tag:"Taktik", w:6, cond:p=>p.age>=24&&p.role==="start", title:T("Aus taktischen Gründen auf der Bank"),
  text:T("Kein Formtief, keine Verletzung. Der Trainer sagt, gegen diesen Gegner brauche er ein anderes Profil."),
  choices:[{label:"Sachlich nachfragen",hint:"",roll:[{p:1,text:"Er erklärt es dir am Video, und es leuchtet dir sogar ein. Nach zwei Spielen bist du zurück.",fx:{trust:10,note:.06,morale:-3}}]},
    {label:"Sauer sein",hint:"",roll:[{p:1,text:"Du gehst kommentarlos in die Kabine. Er bringt dich in den nächsten drei Spielen nicht.",fx:{trust:-12,morale:-10,form:-6}}]}]},
{ id:"b_mitspielerverletzt", tag:"Kabine", w:6, rep:5, cond:p=>p.age>=21, title:c=>`${c.mate.name} liegt lange`,
  text:c=>`Kreuzbandriss im Training, ohne Gegnerkontakt. ${c.mate.name} schreit so, dass alle sofort wissen, wie schlimm es ist.`,
  choices:[{label:"Ihn durch die Reha begleiten",hint:"",roll:[{p:1,text:"Du fährst ihn wochenlang zur Behandlung. Er wird das nie vergessen und die Kabine auch nicht.",fx:{trust:12,morale:6,legacy:6,fitness:-3}}]},
    {label:"Auf dem Platz für ihn spielen",hint:"",roll:[{p:1,text:c=>`Beim nächsten Erfolgserlebnis hältst du sein Trikot in die Kameras.`,fx:{form:8,rep:6,morale:6}}]}]},
{ id:"b_sponsorkonflikt", tag:"Geschäft", w:5, cond:p=>p.rep>=48&&p.age>=23, title:T("Zwei Sponsoren, ein Problem"),
  text:T("Dein persönlicher Ausrüster und der Trikotsponsor des Vereins sind Konkurrenten. Beide bestehen auf ihren Verträgen."),
  choices:[{label:"Beim eigenen Vertrag bleiben",hint:"",roll:[{p:1,text:"Der Verein zahlt am Ende eine Ablöse an deinen Ausrüster. Rechtlich sauber, atmosphärisch nicht.",fx:{money:.15,trust:-8}}]},
    {label:"Zugunsten des Vereins verzichten",hint:"",roll:[{p:1,text:"Du gibst nach. Der Vorstand rechnet dir das hoch an.",fx:{money:-.12,trust:14,morale:4}}]}]},
{ id:"b_wunderkind", tag:"Konkurrenz", w:6, cond:p=>p.age>=26&&p.age<=32, title:T("Ein Siebzehnjähriger trainiert hoch"),
  text:c=>`${c.young.name} ist seit drei Wochen dabei und schon jetzt der Beste im Abschlusstraining. Alle reden über ihn.`,
  choices:[{label:"Ihn fördern",hint:"",roll:[{p:1,text:"Du nimmst ihn unter die Fittiche, obwohl er dir irgendwann den Platz nimmt. Genau das macht dich zum Führungsspieler.",fx:{trust:14,legacy:12,morale:6}}]},
    {label:"Den Abstand halten",hint:"",roll:[{p:1,text:"Er kommt trotzdem. Nur ohne deine Hilfe und mit einer Meinung über dich.",fx:{form:5,trust:-8,legacy:-4}}]}]},
{ id:"b_hoehepunkt", tag:"Vertrag", w:6, cond:p=>p.age>=26&&p.age<=29&&p.ovr>=p.peakOvr-1, title:T("Der Vertrag deines Lebens"),
  text:T("Dein Berater sagt, jetzt sei der Moment. Danach wirst du nie wieder so viel wert sein wie heute."),
  choices:[{label:"Auf Höchstgehalt gehen",hint:"",roll:[{p:1,text:"Du unterschreibst den größten Vertrag deiner Laufbahn. Ab jetzt wirst du daran gemessen.",fx:{extend:4,money:.6,rep:8,trust:-4,morale:8}}]},
    {label:"Auf Sicherheit gehen",hint:"",roll:[{p:1,text:"Weniger Gehalt, dafür fünf Jahre Laufzeit und keine Klausel. Dein Vater nickt zufrieden.",fx:{extend:5,trust:12,morale:10}}]}]},
{ id:"b_dopingkontrolle", tag:"Kurios", w:5, rep:5, cond:p=>p.age>=20, title:T("Kontrolle um sechs Uhr morgens"),
  text:T("Zwei Kontrolleure vor der Haustür. Du hast das Meldesystem letzte Woche nicht aktualisiert."),
  choices:[{label:"Alles offenlegen",hint:"",roll:[{p:.8,text:"Es lässt sich klären. Ein Vermerk bleibt, mehr nicht.",fx:{morale:-4}},
    {p:.2,text:"Ein Versäumnis wird eingetragen. Zwei weitere und es wird ernst.",fx:{morale:-9,rep:-5}}]},
    {label:"Ab jetzt penibel führen",hint:"",roll:[{p:1,text:"Du trägst die Aufenthaltsorte künftig selbst ein, jede Woche.",fx:{morale:3}}]}]},
{ id:"b_vizekapitaen", tag:"Führung", w:5, cond:p=>p.age>=24&&p.trust>=55&&!p.flags.kapitaen&&!p.flags.vize, title:T("Zweiter Kapitän"),
  text:T("Nicht die Binde, aber die Rolle daneben. Bedeutet vor allem: Gespräche führen, die sonst niemand führen will."),
  choices:[{label:"Übernehmen",hint:"",roll:[{p:1,text:"Du wirst der, zu dem die Jungen kommen, bevor sie zum Trainer gehen.",fx:{trust:12,morale:8,rep:5,flag:"vize",legacy:6}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du willst dich auf dein Spiel konzentrieren. Nachvollziehbar.",fx:{form:6}}]}]},
{ id:"b_var", nopos:["TW"], tag:"Sportlich", w:5, rep:4, cond:p=>p.age>=20, title:T("Der Videobeweis nimmt dir ein Tor"),
  text:T("Drei Minuten Überprüfung, Standbild, Fußspitze. Das Stadion hat schon gejubelt."),
  choices:[{label:"Sich sofort wieder sammeln",hint:"",roll:[{p:1,text:"Zehn Minuten später machst du eins, das zählt.",fx:{form:9,morale:6,note:.06}}]},
    {label:"Ausrasten",hint:"",roll:[{p:1,text:"Gelb für Meckern und ein Interview, das du am nächsten Tag bereust.",fx:{rep:6,trust:-6,morale:-6}}]}]},
{ id:"b_zweispiele", tag:"Sportlich", w:5, rep:3, cond:p=>p.age>=21&&p.club.s>=68, title:T("Drei Spiele in acht Tagen"),
  text:T("Pokal, Liga, international. Der Trainer fragt dich direkt, ob du alle drei machen kannst."),
  choices:[{label:"Alle drei",hint:"",roll:[{p:.6,text:"Du machst 270 Minuten und bist danach zwei Wochen platt, aber der Trainer weiß Bescheid.",fx:{trust:16,fitness:-13,form:6}},
    {p:.4,text:"Im dritten Spiel geht die Muskulatur zu.",fx:{forceInjury:"leicht",trust:10,fitness:-10}}]},
    {label:"Eins auslassen",hint:"",roll:[{p:1,text:"Du sagst ehrlich, dass zwei reichen. Er nimmt es an.",fx:{fitness:6,trust:4,note:.05}}]}]},
{ id:"b_rassismus", tag:"Umfeld", w:5, cond:p=>p.age>=19&&p.club.c!==p.nation.id, title:T("Rufe von der Tribüne"),
  text:T("Beim Eckball hörst du es deutlich. Der Schiedsrichter unterbricht und fragt dich, ob du weiterspielen willst."),
  choices:[{label:"Vom Platz gehen",hint:"",roll:[{p:1,text:"Die ganze Mannschaft geht mit. Das Spiel wird abgebrochen, und über nichts anderes wird tagelang gesprochen.",fx:{rep:16,trust:14,morale:-8,legacy:14}}]},
    {label:"Weiterspielen",hint:"",roll:[{p:1,text:"Du spielst und triffst. Danach sagst du vor den Kameras sehr ruhig, was gesagt werden muss.",fx:{rep:12,form:8,morale:-6,legacy:10}}]}]},
{ id:"b_trauer", tag:"Umfeld", w:4, rep:6, cond:p=>p.seasons.length>=2, title:T("Trauerflor"),
  text:T("Ein langjähriger Mitarbeiter des Vereins ist gestorben. Vor dem Anpfiff gibt es eine Schweigeminute."),
  choices:[{label:"Etwas sagen",hint:"",roll:[{p:1,text:"Du sprichst kurz ins Stadionmikrofon. Vierzigtausend Menschen sind vollkommen still.",fx:{rep:8,morale:6,trust:8,legacy:6}}]},
    {label:"Nur mitschweigen",hint:"",roll:[{p:1,text:"Manchmal ist das genau richtig.",fx:{morale:3}}]}]},
{ id:"b_nummer", tag:"Kabine", w:5, cond:p=>p.age>=22&&!p.flags.nummer, title:T("Die freie Rückennummer"),
  text:T("Die Zehn ist frei geworden. Zwei andere im Kader hätten sie auch gern."),
  choices:[{label:"Sie nehmen",hint:"",roll:[{p:.6,text:"Mit der Zehn auf dem Rücken spielst du, als hättest du sie schon immer getragen.",fx:{rep:8,form:8,flag:"nummer",morale:8}},
    {p:.4,text:"Die Nummer wiegt schwerer als gedacht. Jeder Fehler zählt doppelt.",fx:{form:-8,rep:4,flag:"nummer"}}]},
    {label:"Bei deiner bleiben",hint:"",roll:[{p:1,text:"Deine Nummer hat eine Geschichte, die Zehn nicht.",fx:{morale:5,trust:4}}]}]},

/* ============ ROUTINIERS ============ */
{ id:"o_mentor", tag:"Führung", w:7, late:true, cond:p=>p.age>=31, title:T("Der Verein will dich als Mentor"),
  text:T("Weniger Spielzeit, dafür eine offizielle Rolle für die Jungen. Der Sportdirektor formuliert es sehr freundlich."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Du bist plötzlich der wichtigste Mann im Kader, ohne jede Woche zu spielen. Ungewohnt und sinnvoll.",fx:{trust:16,legacy:16,morale:6,form:-4}}]},
    {label:"Weiter um den Platz kämpfen",hint:"",roll:[{p:.5,text:"Du spielst dich zurück in die Elf. Mit fünfunddreißig.",fx:{form:12,trust:10,fitness:-8,morale:10}},
      {p:.5,text:"Der Körper macht die Ansage nicht mit.",fx:{fitness:-12,form:-8,morale:-10}}]}]},
{ id:"o_gehaltsverzicht", tag:"Vertrag", w:6, late:true, cond:p=>p.age>=33&&p.wage>=1, title:T("Verlängerung nur mit weniger Gehalt"),
  text:T("Der Verein will dich behalten, aber nicht zu diesem Preis. Das Angebot liegt vierzig Prozent unter deinem jetzigen Vertrag."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Du unterschreibst, weil du hier aufhören willst. Der Vorstand weiß, was das wert ist.",fx:{extend:2,trust:16,morale:10,legacy:8}}]},
    {label:"Ablehnen und suchen",hint:"",roll:[{p:1,text:"Dein Berater soll etwas anderes finden. Mit dreiunddreißig wird die Liste kurz.",fx:{wantMove:true,trust:-8}}]}]},
{ id:"o_letztederby", tag:"Sportlich", w:6, late:true, cond:p=>p.age>=34&&p.tot.apps>=250, title:T("Wahrscheinlich dein letztes Derby"),
  text:T("Du weißt es, die Kurve weiß es, und irgendjemand hat ein Banner vorbereitet."),
  choices:[{label:"Nochmal alles geben",hint:"",roll:[{p:.55,text:c=>`Du ${heldentat(c.p)} und wirst danach unter Tränen ausgewechselt. Das ganze Stadion steht.`,fx:{rep:16,morale:22,form:12,legacy:14}},
    {p:.45,text:"Nach sechzig Minuten ist die Kraft weg, und ihr verliert.",fx:{morale:-12,fitness:-8}}]},
    {label:"Es genießen",hint:"",roll:[{p:1,text:"Du merkst dir jede Einzelheit. Das Ergebnis wirst du in zehn Jahren vergessen haben, den Abend nicht.",fx:{morale:16,legacy:6}}]}]},
{ id:"o_knie", tag:"Verletzung", w:6, late:true, cond:p=>p.age>=32&&p.injuryProne>=45, title:T("Operation oder weitermachen"),
  text:T("Der Knorpel ist an einer Stelle weg. Operieren heißt sechs Monate Pause mit ungewissem Ausgang."),
  choices:[{label:"Operieren lassen",hint:"",roll:[{p:.6,text:"Sechs zähe Monate. Danach spielst du noch drei Jahre ohne Schmerzen.",fx:{forceInjury:"schwer",injuryProne:-24,slow:0,morale:-8}},
    {p:.4,text:"Es bringt nicht das, was man dir versprochen hat.",fx:{forceInjury:"schwer",injuryProne:-6,morale:-16}}]},
    {label:"Mit Schmerzen spielen",hint:"",roll:[{p:1,text:"Tape, Spritze, Eis. Du hältst noch zwei Saisons durch, danach ist Schluss.",fx:{injuryProne:12,fitness:-8,trust:8}}]}]},
{ id:"o_spielertrainer", tag:"Zukunft", w:6, late:true, cond:p=>p.age>=33&&p.flags.trainerschein, title:T("Spielertrainer bei der Zweiten"),
  text:T("Der Verein bietet dir an, die zweite Mannschaft zu übernehmen und dort noch selbst mitzuspielen."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Du stehst auf dem Platz und an der Linie gleichzeitig. Anstrengend, lehrreich, richtig.",fx:{morale:12,legacy:20,trust:10,form:-6}}]},
    {label:"Oben bleiben",hint:"",roll:[{p:1,text:"Solange es geht, willst du ganz oben spielen.",fx:{morale:6,form:4}}]}]},
{ id:"o_kinderstadion", tag:"Familie", w:5, late:true, cond:p=>p.age>=32&&p.life.kids>=1, title:T("Deine Kinder verstehen jetzt, was du machst"),
  text:T("Zum ersten Mal sitzen sie im Stadion und wissen wirklich, warum vierzigtausend Leute deinen Namen rufen."),
  choices:[{label:"Nach dem Spiel zu ihnen",hint:"",roll:[{p:1,text:"Du holst sie auf den Platz und drehst mit ihnen eine Runde. Diese Bilder hängen später bei euch im Flur.",fx:{morale:20,rep:6,legacy:6}}]},
    {label:"Nichts Besonderes draus machen",hint:"",roll:[{p:1,text:"Für dich ist es Arbeit. Für sie war es trotzdem der beste Tag des Jahres.",fx:{morale:10}}]}]},
{ id:"o_rekordspiel", tag:"Alter", w:5, late:true, cond:p=>p.tot.apps>=400, title:T("Vereinsrekord an Einsätzen"),
  text:c=>`${c.p.tot.apps} Pflichtspiele. Nur noch wenige trennen dich von einer Marke, die seit Jahrzehnten steht.`,
  choices:[{label:"Sie holen",hint:"",roll:[{p:1,text:"Du spielst, bis die Zahl fällt. Danach hängt ein Trikot im Museum.",fx:{rep:12,legacy:24,morale:16,fitness:-6}}]},
    {label:"Nicht darauf hinspielen",hint:"",roll:[{p:1,text:"Du sagst, Zahlen seien für andere Leute wichtig. Die Fans sehen das anders.",fx:{morale:6,legacy:6}}]}]},
{ id:"o_ausland", tag:"Transfer", w:5, late:true, cond:p=>p.age>=32&&p.ovr>=68, title:T("Ein letztes Abenteuer im Ausland"),
  text:T("Ein Angebot aus einer Liga, in der du nie gespielt hast. Gutes Geld, weiter Weg, andere Kultur."),
  choices:[{label:"Es wagen",hint:"",roll:[{p:1,text:"Mit dreiunddreißig nochmal alles neu. Die Familie ist skeptisch, du bist es nicht.",fx:{wantMove:true,morale:12,rep:6}}]},
    {label:"Zu Hause aufhören",hint:"",roll:[{p:1,text:"Du willst dort aufhören, wo dich die Leute kennen.",fx:{morale:10,trust:10,legacy:8}}]}]},

/* ============ LEIHEN ============ */
{ id:"lh_ankunft", tag:"Leihe", w:9, cond:p=>!!p.flags.aufLeihe&&!!p.flags.justMoved, title:c=>`Auf Leihbasis bei ${c.club.n}`,
  text:c=>`Ein Jahr, keine Ablöse, und alle wissen, dass du danach wieder weg bist. Genau darin liegt der Unterschied zu einem echten Neuzugang.`,
  choices:[{label:"Behandeln, als wäre es dein Verein",hint:"",roll:[{p:1,text:"Du ziehst voll mit, und nach drei Monaten redet niemand mehr darüber, dass du nur geliehen bist.",fx:{trust:14,form:10,morale:10}}]},
    {label:"Auf dich schauen",hint:"",roll:[{p:1,text:"Du sammelst Minuten und Statistik. Funktioniert sportlich, aber die Kabine merkt es.",fx:{form:6,trust:-8,morale:-4}}]}]},
{ id:"lh_stammverein", tag:"Leihe", w:7, cond:p=>!!p.flags.aufLeihe&&!!p.loanHome, title:c=>`Anruf vom Stammverein`,
  text:c=>`Der Nachwuchskoordinator von ${c.p.loanHome?c.p.loanHome.n:"deinem Stammverein"} ruft an und will wissen, wie es läuft. Er hat jedes deiner Spiele gesehen.`,
  choices:[{label:"Ehrlich berichten",hint:"",roll:[{p:1,text:"Du erzählst auch von den schlechten Wochen. Er sagt, genau darum gehe es bei einer Leihe.",fx:{morale:8,pot:1,trust:5}}]},
    {label:"Nur die guten Zahlen",hint:"",roll:[{p:1,text:"Er kennt die Videos ohnehin. Das Gespräch wird kurz.",fx:{morale:-4}}]}]},
{ id:"lh_gegenstamm", tag:"Leihe", w:6, cond:p=>!!p.flags.aufLeihe&&!!p.loanHome, title:T("Spiel gegen deinen eigenen Verein"),
  text:c=>`${c.p.loanHome?c.p.loanHome.n:"Dein Stammverein"} kommt am Samstag. Im Leihvertrag steht eine Klausel, die dich sperren könnte.`,
  choices:[{label:"Auf einem Einsatz bestehen",hint:"",roll:[{p:.6,text:c=>`Die Klausel greift nicht. Du spielst gegen deine eigenen Leute — und ${heldentat(c.p)}.`,fx:{form:12,rep:10,morale:10}},
    {p:.4,text:"Der Stammverein zieht die Klausel. Du sitzt auf der Tribüne.",fx:{morale:-10,trust:-4}}]},
    {label:"Freiwillig aussetzen",hint:"",roll:[{p:1,text:"Du sagst, das wäre dir unangenehm. Beide Vereine finden das anständig.",fx:{trust:8,morale:4,rep:3}}]}]},
{ id:"lh_kaufoption", tag:"Leihe", w:7, cond:p=>!!p.flags.aufLeihe&&p.seasons.length>=1, title:T("Die Kaufoption steht im Raum"),
  text:T("Der Leihverein würde dich fest verpflichten. Dein Stammverein hat allerdings gerade den Trainer gewechselt und plant plötzlich wieder mit dir."),
  choices:[{label:"Hierbleiben wollen",hint:"",roll:[{p:1,text:"Du machst öffentlich klar, wo du spielen willst. Das schafft Fakten.",fx:{trust:12,morale:10,rep:4}}]},
    {label:"Zurückgehen",hint:"",roll:[{p:1,text:"Ein neuer Trainer heißt eine neue Chance. Der Leihverein ist enttäuscht.",fx:{trust:-6,morale:6,pot:1}}]},
    {label:"Offenlassen",hint:"",roll:[{p:1,text:"Du sagst, das entscheide sich im Sommer. Beide Seiten warten ab.",fx:{morale:-3}}]}]},
{ id:"lh_rueckkehr", tag:"Leihe", w:7, cond:p=>!p.flags.aufLeihe&&!!p.flags.warAufLeihe&&p.seasons.length>=2&&sameClub(p), title:T("Zurück aus der Leihe"),
  text:T("Ein Jahr weg, jede Woche gespielt, gereift. Hier kennt dich die Hälfte des Kaders nicht mehr."),
  choices:[{label:"Sofort Ansprüche anmelden",hint:"",roll:[{p:.55,text:"Du zeigst in der Vorbereitung, was das Jahr gebracht hat. Der Trainer plant mit dir.",fx:{trust:14,form:10,morale:8}},
    {p:.45,text:"Es kommt als Überheblichkeit an. Du beginnst wieder auf der Bank.",fx:{trust:-10,morale:-10}}]},
    {label:"Ruhig arbeiten",hint:"",roll:[{p:1,text:"Du sagst wenig und trainierst gut. Nach sechs Wochen spielst du.",fx:{trust:8,form:6}}]}]},

/* ============ WEITERE KLASSIKER ============ */
{ id:"k_trikotpraesentation", tag:"Geschäft", w:4, rep:5, cond:p=>p.seasons.length>=1, title:T("Präsentation des neuen Trikots"),
  text:T("Fotoshooting um sieben Uhr morgens, ein Trikot, über das die Fanszene seit Wochen streitet."),
  choices:[{label:"Es gut aussehen lassen",hint:"",roll:[{p:1,text:"Deine Bilder werden zum Aushängeschild der Kampagne. Der Verein bedankt sich handfest.",fx:{money:.05,rep:6,trust:4}}]},
    {label:"Ehrlich sagen, was du denkst",hint:"",roll:[{p:1,text:"Die Fanszene liebt dich dafür, die Marketingabteilung weniger.",fx:{rep:9,trust:-7,morale:5}}]}]},
{ id:"k_altertrainerneu", tag:"Kabine", w:5, cond:p=>p.age>=26, title:T("Ein früherer Mitspieler wird dein Trainer"),
  text:T("Vor vier Jahren habt ihr noch nebeneinander in der Kabine gesessen. Jetzt schreibt er die Aufstellung."),
  choices:[{label:"Klar die neue Rolle akzeptieren",hint:"",roll:[{p:1,text:"Du siezt ihn im Scherz und hältst dich an alles. Das erleichtert ihm den Start enorm.",fx:{trust:14,morale:6,form:5}}]},
    {label:"Weitermachen wie früher",hint:"",roll:[{p:.45,text:"Es funktioniert, weil ihr euch kennt.",fx:{trust:8,morale:8}},
      {p:.55,text:"Er muss ein Zeichen setzen und setzt es an dir.",fx:{trust:-14,form:-8}}]}]},
{ id:"k_stimmungsboykott", tag:"Fans", w:5, cond:p=>p.seasons.length>=1, title:T("Die Kurve schweigt"),
  text:T("Aus Protest gegen den Vorstand bleibt es zwanzig Minuten still. Man hört jeden Zuruf vom Platz."),
  choices:[{label:"Zur Kurve gehen und applaudieren",hint:"",roll:[{p:1,text:"Nach dem Abpfiff stellst du dich als Einziger vor den Block und klatschst. Das bleibt hängen.",fx:{rep:12,morale:6,trust:-4}}]},
    {label:"Raushalten",hint:"",roll:[{p:1,text:"Nicht dein Kampf, sagst du dir.",fx:{}}]}]},
{ id:"k_benefiz", tag:"Umfeld", w:4, rep:5, cond:p=>p.rep>=35, title:T("Benefizspiel in der Sommerpause"),
  text:T("Ein Ehemaligenteam gegen eine Auswahl, Eintritt für einen guten Zweck. Es liegt genau in deiner freien Woche."),
  choices:[{label:"Mitspielen",hint:"",roll:[{p:.85,text:"Ein entspannter Abend, zwölftausend Zuschauer und eine sechsstellige Summe für den guten Zweck.",fx:{rep:8,morale:10,legacy:6,fitness:-3}},
    {p:.15,text:"Ausgerechnet im Benefizspiel ziehst du dir etwas zu.",fx:{forceInjury:"leicht",rep:6}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Du brauchst die Woche wirklich.",fx:{fitness:5,rep:-3}}]}]},
{ id:"k_zimmerpartner", tag:"Kabine", w:4, rep:4, cond:p=>p.seasons.length>=1, title:T("Zimmeraufteilung im Trainingslager"),
  text:c=>`Zehn Tage mit ${c.mate.name} auf zwanzig Quadratmetern. Er schnarcht, telefoniert nachts und lässt alles liegen.`,
  choices:[{label:"Durchhalten",hint:"",roll:[{p:1,text:"Nach zehn Tagen kennst du seine halbe Familiengeschichte. Ihr werdet Freunde.",fx:{trust:10,morale:8,fitness:-4}}]},
    {label:"Umziehen lassen",hint:"",roll:[{p:1,text:"Du schläfst besser und stehst als schwierig da.",fx:{fitness:6,trust:-6}}]}]},
{ id:"k_torjubel", nopos:["TW"], tag:"Medien", w:4, rep:5, cond:p=>p.tot.goals>=5, title:T("Dein Jubel sorgt für Diskussionen"),
  text:T("Eine Geste, die du seit der Jugend machst. Diesmal deutet sie jemand um und macht daraus eine Geschichte."),
  choices:[{label:"Erklären, was sie bedeutet",hint:"",roll:[{p:1,text:"Es geht um deinen Großvater. Danach fragt niemand mehr nach.",fx:{rep:7,morale:6}}]},
    {label:"Sie weglassen",hint:"",roll:[{p:1,text:"Du jubelst ab jetzt anders. Es fühlt sich falsch an.",fx:{morale:-7,rep:-2}}]}]},
{ id:"k_stadionwechsel", tag:"Verein", w:4, cond:p=>p.club.s>=66&&p.seasons.length>=2, title:T("Der Verein zieht in ein neues Stadion"),
  text:T("Mehr Plätze, mehr Einnahmen, weniger Enge. Die alte Kurve stand direkt hinter dem Tor, die neue ist zwölf Meter weiter weg."),
  choices:[{label:"Die Veränderung annehmen",hint:"",roll:[{p:1,text:"Nach einem halben Jahr ist es euer Zuhause. Die Zuschauerzahlen steigen deutlich.",fx:{morale:6,rep:6,money:.05}}]},
    {label:"Der alten Hütte nachtrauern",hint:"",roll:[{p:1,text:"Du sagst öffentlich, dass dir der alte Kessel fehlt. Die Kurve dankt es dir.",fx:{rep:9,trust:-6}}]}]},
{ id:"k_regen", tag:"Kurios", w:4, rep:6, cond:p=>p.seasons.length>=1, title:T("Neunzig Minuten Dauerregen"),
  text:T("Der Ball bleibt in Pfützen liegen, der Schiedsrichter prüft dreimal die Bespielbarkeit, und keiner sieht mehr, wer welches Trikot trägt."),
  choices:[{label:"Es genießen",hint:"",roll:[{p:1,text:"Solche Spiele hast du als Kind auf dem Bolzplatz geliebt. Genau so spielst du auch.",fx:{form:8,morale:8}}]},
    {label:"Auf Sicherheit spielen",hint:"",roll:[{p:1,text:"Kein Risiko, keine Fehler, kein Spektakel.",fx:{note:.08}}]}]},
{ id:"k_altstadion", tag:"Fans", w:4, cond:p=>p.tot.apps>=100, title:T("Ein Fan schenkt dir etwas Selbstgemachtes"),
  text:T("Ein geschnitztes Wappen, offensichtlich viele Stunden Arbeit. Er wartet seit zwei Stunden am Spielereingang."),
  choices:[{label:"Zeit nehmen",hint:"",roll:[{p:1,text:"Zwanzig Minuten Gespräch, ein Foto, und das Wappen steht heute in deinem Wohnzimmer.",fx:{morale:12,rep:6}}]},
    {label:"Kurz bedanken",hint:"",roll:[{p:1,text:"Ein Händedruck, dann muss der Bus los.",fx:{morale:4,rep:2}}]}]},
{ id:"k_erstesheimspiel", tag:"Transfer", w:6, cond:p=>!!p.flags.justMoved&&!p.flags.aufLeihe, title:T("Erstes Heimspiel beim neuen Verein"),
  text:T("Vorstellung vor dem Anpfiff, dein Name über die Anlage, und du weißt noch nicht, wo genau du dich hinstellen sollst."),
  choices:[{label:"Vor die Kurve gehen",hint:"",roll:[{p:1,text:"Du klatschst sie ab, bevor du überhaupt gespielt hast. Etwas früh, aber sie nehmen es an.",fx:{rep:8,morale:10,form:5}}]},
    {label:"Erst liefern, dann feiern",hint:"",roll:[{p:1,text:"Du sagst dir, Applaus musst du dir verdienen. Nach dem Siegtor hast du ihn.",fx:{form:8,trust:6,note:.06}}]}]},
/* ============ NUR FRAUENFUSSBALL ============ */
{ id:"w_bezahlung", tag:"Frauenfußball", w:8, g:"w", cond:p=>p.age>=19, title:T("Die Prämien der Männer stehen in der Zeitung"),
  text:T("Dasselbe Turnier, derselbe Verband, dieselbe Anzahl Spiele. Ein Reporter fragt dich, ob dich das ärgert."),
  choices:[{label:"Deutlich Stellung beziehen",hint:"",roll:[{p:.7,text:"Dein Satz wird tausendfach geteilt. Der Verband setzt sich zwei Monate später mit euch an einen Tisch.",fx:{rep:16,morale:10,legacy:12,trust:-4}},
    {p:.3,text:"Ein Teil der Öffentlichkeit dreht es dir im Mund um. Du bleibst trotzdem dabei.",fx:{rep:6,morale:-6,legacy:8}}]},
    {label:"Auf den Sport lenken",hint:"",roll:[{p:1,text:"Du sagst, du wollest über Fußball reden. Verständlich, ändert nur nichts.",fx:{form:5,morale:-3}}]}]},
{ id:"w_nebenjob", tag:"Frauenfußball", w:8, g:"w", cond:p=>ligaInfo(p.club.l).pay<=.12&&p.age>=18, title:T("Vom Fußball allein geht es nicht"),
  text:T("Halbtags im Büro, nachmittags Training, abends Physiotherapie auf eigene Rechnung. Zwei Mitspielerinnen studieren nebenbei."),
  choices:[{label:"Job behalten",hint:"",roll:[{p:1,text:"Es geht, kostet aber jede Erholung und jede freie Minute.",fx:{money:.015,fitness:-9,morale:5,pot:-1}}]},
    {label:"Alles auf Fußball setzen",hint:"",roll:[{p:1,text:"Du kündigst und lebst sparsam. Riskant, aber du trainierst zum ersten Mal wie eine Profi.",fx:{money:-.02,fitness:8,pot:3,morale:-4}}]},
    {label:"Ausbildung zu Ende bringen",hint:"",roll:[{p:1,text:"Weniger Schlaf, dafür ein Abschluss in der Tasche. Für die Zeit danach zählt das.",fx:{fitness:-6,legacy:10,flag:"abschluss",morale:6}}]}]},
{ id:"w_platz", tag:"Frauenfußball", w:7, g:"w", rep:4, title:T("Trainingsplatz zweiter Wahl"),
  text:T("Die Profis der Männer haben Rasen, ihr habt den Nebenplatz mit Kunstrasen von 2011. Die Knie merken das."),
  choices:[{label:"Beim Verein Druck machen",hint:"",roll:[{p:.6,text:"Nach vier Monaten steht ein Sanierungsplan. Ab dem Winter trainiert ihr auf Rasen.",fx:{injuryProne:-9,fitness:6,trust:8,rep:6}},
    {p:.4,text:"Man vertröstet euch aufs nächste Haushaltsjahr.",fx:{injuryProne:5,morale:-8}}]},
    {label:"Damit arrangieren",hint:"",roll:[{p:1,text:"Ihr tapt mehr und sagt nichts.",fx:{injuryProne:6,fitness:-4}}]}]},
{ id:"w_kreuzband", tag:"Frauenfußball", w:6, g:"w", cond:p=>p.age>=19&&p.age<=30, title:T("Vorbeugung gegen Kreuzbandrisse"),
  text:T("Die Verletzung trifft Fußballerinnen deutlich häufiger. Der Verein bietet ein Programm an, das dreimal pro Woche zwanzig Minuten kostet."),
  choices:[{label:"Konsequent mitmachen",hint:"",roll:[{p:1,text:"Landetechnik, Rumpf, Sprungkraft. Stumpf, aber es wirkt nachweislich.",fx:{injuryProne:-16,phy:1,fitness:4}}]},
    {label:"Nur wenn Zeit ist",hint:"",roll:[{p:.6,text:"Du kommst durch. Glück gehabt.",fx:{}},{p:.4,text:"Im Frühjahr trifft es dich beim Landen nach einem Kopfball.",fx:{forceInjury:"schwer",morale:-16}}]}]},
{ id:"w_rekordkulisse", tag:"Frauenfußball", w:7, g:"w", cond:p=>p.club.s>=72, title:T("Zum ersten Mal im großen Stadion"),
  text:T("Der Verein verlegt euer Spitzenspiel in die Arena der Männer. Vorverkauf: über vierzigtausend."),
  choices:[{label:"Die Bühne annehmen",hint:"",roll:[{p:.65,text:c=>`Du ${heldentat(c.p)}, ihr gewinnt vor Rekordkulisse, und die Bilder gehen um die Welt.`,fx:{rep:20,morale:18,form:12,legacy:10}},
    {p:.35,text:"Die Kulisse lähmt euch. Ein zähes 0:0 vor vollem Haus.",fx:{rep:10,form:-6,morale:4}}]},
    {label:"Wie ein normales Spiel behandeln",hint:"",roll:[{p:1,text:"Du blendest die Zahl aus und machst dein Spiel.",fx:{note:.1,rep:8,trust:6}}]}]},
{ id:"w_mutterschaft", tag:"Frauenfußball", w:7, g:"w", cond:p=>p.age>=25&&p.life.kids===0&&["beziehung","verlobt","verheiratet"].includes(p.life.status), title:T("Kinderwunsch mitten in der Laufbahn"),
  text:T("Inzwischen gibt es Regeln für Mutterschaft im Profifußball: Weiterzahlung, Rückkehrrecht, medizinische Begleitung. Trotzdem heißt es ein Jahr ohne Wettkampf."),
  choices:[{label:"Jetzt",hint:"Ein Jahr Pause, danach Rückkehr",roll:[{p:1,text:"Ein Jahr ohne Pflichtspiel und danach ein Comeback, das dir kaum jemand zugetraut hat.",fx:{kids:1,ban2:26,morale:22,fitness:-12,legacy:12,flag:"mutterschaft"}}]},
    {label:"Nach der Karriere",hint:"",roll:[{p:1,text:"Ihr verschiebt es. Die Entscheidung fühlt sich richtig an und trotzdem nicht leicht.",fx:{morale:-5,form:5}}]}]},
{ id:"w_rueckkehr", tag:"Frauenfußball", w:8, g:"w", cond:p=>p.flags.mutterschaft&&!p.flags.mutterRueck, title:T("Zurück nach der Babypause"),
  text:T("Zwölf Monate ohne Wettkampf, ein Kind zu Hause und ein Körper, der sich fremd anfühlt."),
  choices:[{label:"Stufenweise aufbauen",hint:"",roll:[{p:1,text:"Sechs Monate Geduld. Danach spielst du besser als vorher, weil du anders trainierst.",fx:{fitness:14,injuryProne:-8,form:-6,flag:"mutterRueck",legacy:8}}]},
    {label:"Sofort voll einsteigen",hint:"",roll:[{p:.45,text:"Es klappt. Nach acht Wochen stehst du wieder in der Startelf.",fx:{form:10,trust:10,flag:"mutterRueck"}},
      {p:.55,text:"Der Körper ist noch nicht so weit. Muskelverletzung nach vier Wochen.",fx:{forceInjury:"mittel",flag:"mutterRueck",morale:-10}}]}]},
{ id:"w_zyklus", tag:"Frauenfußball", w:6, g:"w", cond:p=>p.age>=19, title:T("Training nach dem Zyklus"),
  text:T("Der Verein führt ein Konzept ein, das Belastung und Ernährung anpasst. Manche in der Kabine finden das übergriffig, andere überfällig."),
  choices:[{label:"Voll mitmachen",hint:"",roll:[{p:1,text:"Nach einem halben Jahr weißt du genau, wann du hart trainieren kannst und wann nicht.",fx:{fitness:10,injuryProne:-7,note:.06,pot:1}}]},
    {label:"Nicht mitmachen",hint:"",roll:[{p:1,text:"Du willst deine Daten für dich behalten. Auch das wird akzeptiert.",fx:{morale:4}}]}]},
{ id:"w_sichtbarkeit", tag:"Frauenfußball", w:6, g:"w", cond:p=>p.rep>=45, title:T("Der erste große Fernsehvertrag"),
  text:T("Ab der neuen Saison läuft jedes Spiel eurer Liga live. Das verändert alles: Prämien, Sponsoren, Druck."),
  choices:[{label:"Die Chance nutzen",hint:"",roll:[{p:1,text:"Du gehst auf jede Kamera zu und wirst zum Gesicht der Liga.",fx:{rep:18,money:.12,fitness:-3,legacy:10}}]},
    {label:"Im Hintergrund bleiben",hint:"",roll:[{p:1,text:"Sollen andere das machen. Du spielst lieber.",fx:{form:7}}]}]},
{ id:"w_ausruester", tag:"Frauenfußball", w:6, g:"w", cond:p=>p.rep>=40, title:T("Endlich Schuhe, die passen"),
  text:T("Ein Hersteller entwickelt zum ersten Mal einen Fußballschuh nach weiblichen Leisten und sucht Spielerinnen für die Testreihe."),
  choices:[{label:"Mitmachen",hint:"",roll:[{p:1,text:"Ein Jahr Rückmeldungen geben. Danach hast du einen Schuh, der wirklich passt, und einen Vertrag dazu.",fx:{money:.22,injuryProne:-6,rep:8}}]},
    {label:"Beim gewohnten Modell bleiben",hint:"",roll:[{p:1,text:"Du hast dich an das alte gewöhnt, mit allen Blasen.",fx:{}}]}]},
{ id:"w_streik", tag:"Frauenfußball", w:6, g:"w", cond:p=>p.nt.level==="A", title:T("Die Nationalmannschaft droht mit Streik"),
  text:T("Es geht um Reisebedingungen, medizinische Betreuung und Prämien. Fünfzehn Spielerinnen haben unterschrieben, du fehlst noch."),
  choices:[{label:"Mitunterschreiben",hint:"",roll:[{p:.7,text:"Der Verband lenkt nach zwei Wochen ein. Für alle, die nach euch kommen, ist es der wichtigste Sieg des Jahres.",fx:{rep:14,legacy:20,ntBonus:6,morale:12}},
    {p:.3,text:"Der Verband bleibt hart und nominiert eine komplett neue Mannschaft.",fx:{ntPenalty:20,rep:10,legacy:14,morale:-10}}]},
    {label:"Nicht unterschreiben",hint:"",roll:[{p:1,text:"Du fährst mit und spielst. Die anderen sagen nichts, aber sie merken es sich.",fx:{ntBonus:8,morale:-10,rep:-6}}]}]},
{ id:"w_vergleich", tag:"Frauenfußball", w:5, g:"w", rep:4, title:T("Wieder die Frage nach den Männern"),
  text:T("Im Interview kommt zum vierten Mal in diesem Jahr die Frage, wie ihr gegen die Männermannschaft des Vereins abschneiden würdet."),
  choices:[{label:"Schlagfertig kontern",hint:"",roll:[{p:1,text:"Deine Antwort läuft in jeder Sportsendung. Die Frage wird dir seltener gestellt.",fx:{rep:12,morale:8}}]},
    {label:"Ernsthaft antworten",hint:"",roll:[{p:1,text:"Du erklärst geduldig, warum die Frage nicht weiterführt. Ein paar verstehen es.",fx:{rep:5,morale:-3}}]}]},
{ id:"w_doppelbelastung", tag:"Frauenfußball", w:6, g:"w", cond:p=>p.age<=24, title:T("Studium oder Vollprofi"),
  text:T("Du stehst kurz vor dem Abschluss. Die Prüfungsphase liegt genau in der entscheidenden Saisonphase."),
  choices:[{label:"Abschluss durchziehen",hint:"",roll:[{p:1,text:"Zwei zähe Monate mit vier Stunden Schlaf. Danach hast du beides.",fx:{legacy:12,flag:"abschluss",fitness:-10,form:-6,morale:8}}]},
    {label:"Studium pausieren",hint:"",roll:[{p:1,text:"Du meldest dich ab und konzentrierst dich voll. Die Saison wird deine beste.",fx:{form:10,pot:2,trust:8}}]}]},
{ id:"w_umzug", tag:"Frauenfußball", w:5, g:"w", cond:p=>!!p.flags.justMoved, title:T("Umzug ohne Umzugshilfe"),
  text:T("Der Verein zahlt zwei Monate Hotel. Wohnung, Möbel und Kaution sind deine Sache."),
  choices:[{label:"Selbst organisieren",hint:"",roll:[{p:1,text:"Drei Wochenenden Möbelaufbau. Danach hast du eine Wohnung, die dir gehört.",fx:{money:-.03,morale:6,fitness:-4}}]},
    {label:"Bei einer Mitspielerin unterkommen",hint:"",roll:[{p:1,text:"Erstmal auf dem Sofa. Ihr werdet Freundinnen fürs Leben.",fx:{trust:10,morale:10}}]}]},
{ id:"w_fananstieg", tag:"Frauenfußball", w:5, g:"w", cond:p=>p.seasons.length>=2, title:T("Die Zuschauerzahlen verdoppeln sich"),
  text:T("Vor drei Jahren waren es achthundert, jetzt sind es viertausend. Nach jedem Spiel warten Kinder mit Trikots am Zaun."),
  choices:[{label:"Bis zum letzten Autogramm bleiben",hint:"",roll:[{p:1,text:"Manchmal eine Stunde nach Abpfiff. Genau daraus wächst die nächste Generation.",fx:{rep:14,morale:12,legacy:14,fitness:-3}}]},
    {label:"Zeitlich begrenzen",hint:"",roll:[{p:1,text:"Zwanzig Minuten, dann Regeneration. Auch das ist Profitum.",fx:{fitness:5,rep:4}}]}]},

/* ============ NUR MÄNNERFUSSBALL ============ */
{ id:"m_vaterschaft", tag:"Familie", w:6, g:"m", cond:p=>p.life.kids>=1&&p.age>=24&&!p.flags.vaterrolle, title:T("Zwischen Kabine und Kinderzimmer"),
  text:T("Die Mannschaft trifft sich am freien Tag zum Padel. Zu Hause wartet ein Kind, das dich diese Woche kaum gesehen hat."),
  choices:[{label:"Nach Hause",hint:"",roll:[{p:1,text:"Du sagst ab und wirst dafür aufgezogen. Es ist dir egal.",fx:{morale:14,trust:-4,flag:"vaterrolle"}}]},
    {label:"Mitgehen",hint:"",roll:[{p:1,text:"Zwei Stunden Kabine außerhalb der Kabine. Wichtig für die Mannschaft, weniger für zu Hause.",fx:{trust:8,morale:-6,flag:"vaterrolle"}}]}]},
{ id:"m_junggeselle", tag:"Privat", w:5, g:"m", cond:p=>p.life.status==="verlobt", title:T("Junggesellenabschied"),
  text:T("Deine Freunde planen ein Wochenende, über dessen Ziel sie nichts sagen. Es liegt zwei Wochen vor dem Saisonstart."),
  choices:[{label:"Mitmachen",hint:"",roll:[{p:.75,text:"Zwei Tage, an die du dich kaum erinnerst, und Fotos, die zum Glück niemand veröffentlicht.",fx:{morale:14,fitness:-8}},
    {p:.25,text:"Ein Video landet im Netz. Der Verein lädt dich zum Gespräch.",fx:{morale:8,rep:-10,trust:-8,fitness:-8}}]},
    {label:"Kleiner Rahmen",hint:"",roll:[{p:1,text:"Ein Abend, gutes Essen, früh im Bett. Deine Freunde sind enttäuscht, dein Trainer nicht.",fx:{morale:8,trust:5}}]}]},
{ id:"m_vatervergleich", tag:"Herkunft", w:5, g:"m", cond:p=>p.age>=20&&p.rep>=35, title:T("Dein Vater hat auch gespielt"),
  text:T("Nicht so hoch wie du, aber in derselben Stadt. Bei jedem Interview kommt sein Name vor deinem."),
  choices:[{label:"Ihn einbinden",hint:"",roll:[{p:1,text:"Du nimmst ihn mit zu einem Termin. Er redet zwanzig Minuten und du siehst ihn zum ersten Mal so stolz.",fx:{morale:16,rep:6,legacy:6}}]},
    {label:"Eigene Geschichte schreiben",hint:"",roll:[{p:1,text:"Du bittest darum, nicht ständig verglichen zu werden. Zu Hause gibt das eine Diskussion.",fx:{form:6,morale:-6}}]}]},
{ id:"m_kabinenkultur", tag:"Kabine", w:5, g:"m", cond:p=>p.age>=23, title:T("Ein Spruch geht zu weit"),
  text:c=>`${c.mate.name} macht einen Witz, über den früher alle gelacht hätten. Diesmal wird es still.`,
  choices:[{label:"Es ansprechen",hint:"",roll:[{p:.7,text:"Du sagst ruhig, dass das nicht geht. Zwei nicken, der Rest denkt darüber nach.",fx:{trust:10,rep:5,legacy:6}},
    {p:.3,text:"Du wirst als Spaßbremse abgestempelt.",fx:{trust:-8,morale:-5}}]},
    {label:"Überhören",hint:"",roll:[{p:1,text:"Du sagst nichts und ärgerst dich noch auf der Heimfahrt.",fx:{morale:-6}}]}]},

/* ============ VEREINSTREUE UND LEGENDENSTATUS ============ */
{ id:"tr_fuenf", tag:"Treue", w:9, cond:p=>loyalty(p)>=5&&loyalty(p)<8&&sameClub(p)&&!p.flags.treu5, title:T("Fünf Jahre bei einem Verein"),
  text:c=>`Fünf Jahre bei ${c.club.n}. In der heutigen Zeit ist das eine kleine Ewigkeit, und die Kurve weiß das.`,
  choices:[{label:"Öffentlich bekennen",hint:"",roll:[{p:1,text:"Du sagst in einem Interview, dass du hier aufhören willst. Ab dem nächsten Heimspiel singen sie deinen Namen.",fx:{rep:12,morale:14,trust:12,legacy:14,flag:"treu5"}}]},
    {label:"Sachlich bleiben",hint:"",roll:[{p:1,text:"Du sagst, im Fußball wisse man nie. Ehrlich, aber es kommt nicht gut an.",fx:{rep:-4,trust:4,flag:"treu5"}}]}]},
{ id:"tr_legende", tag:"Treue", w:10, cond:p=>loyalty(p)>=10&&sameClub(p)&&!p.flags.legende, title:T("Vereinslegende"),
  text:T("Zehn Jahre, hunderte Spiele, drei Trainerwechsel und zwei Abstiegskämpfe. In der Vereinszeitung steht ein Sonderteil über dich."),
  choices:[{label:"Ehrenspielführer werden",hint:"",roll:[{p:1,text:"Der Verein ernennt dich auf Lebenszeit. Egal was danach kommt, dieses Kapitel gehört dir.",fx:{rep:18,morale:18,legacy:40,trust:16,flag:"legende"}}]},
    {label:"Es klein halten",hint:"",roll:[{p:1,text:"Du bittest darum, kein Aufheben zu machen. Genau dafür mögen sie dich.",fx:{rep:10,morale:14,legacy:28,flag:"legende"}}]}]},
{ id:"tr_nummer", tag:"Treue", w:7, cond:p=>p.flags.legende&&sameClub(p)&&!p.flags.nummergesperrt, title:T("Deine Rückennummer soll gesperrt werden"),
  text:T("Der Verein will sie nach deinem Karriereende niemandem mehr geben. Ein paar Mitglieder finden das übertrieben."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Kein Spieler dieses Vereins wird sie je wieder tragen.",fx:{legacy:30,rep:12,morale:14,flag:"nummergesperrt"}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du sagst, die Nummer soll weiterleben. Der Verein macht daraus eine Nachwuchsauszeichnung mit deinem Namen.",fx:{legacy:24,rep:8,morale:12,flag:"nummergesperrt"}}]}]},
{ id:"tr_angebot", tag:"Treue", w:8, cond:p=>loyalty(p)>=5&&sameClub(p)&&p.ovr>=p.club.s+3, title:T("Ein großes Angebot gegen die Treue"),
  text:T("Ein deutlich größerer Verein legt das Dreifache deines Gehalts auf den Tisch. Dein Klub würde dich ziehen lassen, wenn du willst."),
  choices:[{label:"Bleiben",hint:"Weniger Geld, mehr Bedeutung",roll:[{p:1,text:"Du sagst ab. Am nächsten Heimspieltag hängt eine Choreo über den ganzen Block.",fx:{legacy:34,rep:14,morale:18,trust:18,extend:3}}]},
    {label:"Gehen",hint:"Wechsel zum Saisonende",roll:[{p:1,text:"Du gehst. Nachvollziehbar, und trotzdem wird man dir das hier noch Jahre nachtragen.",fx:{wantMove:true,rep:4,morale:-8,legacy:-10}}]}]},
{ id:"tr_statue", tag:"Treue", w:6, cond:p=>p.flags.legende&&p.age>=33&&!p.flags.statue, title:T("Eine Statue vor dem Stadion"),
  text:T("Der Verein hat einen Bildhauer beauftragt. Die Enthüllung soll an deinem letzten Heimspieltag stattfinden."),
  choices:[{label:"Es zulassen",hint:"",roll:[{p:1,text:"Zwei Meter Bronze neben dem Haupteingang. Deine Mutter fotografiert eine Stunde lang.",fx:{legacy:40,rep:16,morale:20,flag:"statue"}}]},
    {label:"Auf später verschieben",hint:"",roll:[{p:1,text:"Du bittest darum, damit zu warten, bis du wirklich aufgehört hast.",fx:{legacy:20,morale:10,flag:"statue"}}]}]},
{ id:"tr_treuebruch", tag:"Treue", w:6, cond:p=>loyalty(p)>=6&&sameClub(p)&&p.club.s<p.ovr-6, title:T("Der Verein steht unten, du könntest gehen"),
  text:T("Nach so vielen Jahren würde dir niemand einen Wechsel verübeln. In deinem Vertrag steht sogar eine Klausel dafür."),
  choices:[{label:"Bleiben und wieder hochführen",hint:"",roll:[{p:1,text:"Du bleibst, obwohl du nirgends musst. Solche Entscheidungen machen Legenden.",fx:{legacy:30,rep:14,morale:14,trust:20,extend:2}}]},
    {label:"Die Klausel ziehen",hint:"Wechsel zum Saisonende",roll:[{p:1,text:"Du gehst. Sportlich richtig, emotional teuer.",fx:{wantMove:true,morale:-10,legacy:-12,rep:-4}}]}]},

/* ============ WECHSEL MIT SOFORTIGER FOLGE ============ */
{ id:"wm_winter", tag:"Wechselfrage", w:7, rep:3, cond:p=>p.seasons.length>=1&&(["bench","tribune"].includes(p.role)||p.lastNote>3.6), title:T("Anfrage im Wintertransferfenster"),
  text:T("Ende Januar meldet sich ein Verein, der sofort jemanden braucht. Entscheiden musst du diese Woche."),
  choices:[{label:"Jetzt sofort wechseln",hint:"Öffnet direkt das Winterfenster",roll:[{p:1,text:"Dein Berater bringt die Sache in vier Tagen durch. Am Wochenende spielst du woanders.",fx:{winterMove:true,trust:-10,morale:8}}]},
    {label:"Im Sommer neu bewerten",hint:"Wechselwunsch zum Saisonende",roll:[{p:1,text:"Du sagst, mitten in der Saison gehst du nicht. Aber du meldest an, dass es so nicht weitergeht.",fx:{wantMove:true,trust:-4,morale:4}}]},
    {label:"Ablehnen und kämpfen",hint:"",roll:[{p:1,text:"Du bleibst und arbeitest dich zurück in die Elf.",fx:{trust:12,form:8,morale:5}}]}]},
{ id:"wm_notruf", tag:"Wechselfrage", w:6, rep:4, cond:p=>p.seasons.length>=1&&p.ovr>=p.club.s&&p.age>=22, title:T("Ein Abstiegskandidat ruft an"),
  text:T("Sie stehen auf dem vorletzten Platz, haben Geld und brauchen genau deinen Spielertyp. Sofort, nicht im Sommer."),
  choices:[{label:"Die Rettungsmission annehmen",hint:"Sofortiger Wechsel",roll:[{p:1,text:"Du unterschreibst binnen achtundvierzig Stunden und wirst am Freitag vorgestellt.",fx:{winterMove:true,money:.15,rep:6,trust:-8}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Du willst nicht in einen Abstiegskampf. Verständlich, aber dein Berater ärgert sich über das Geld.",fx:{morale:3}}]}]},
{ id:"wm_trainerruf", tag:"Wechselfrage", w:6, rep:4, cond:p=>p.seasons.length>=2&&p.rep>=45, title:T("Dein alter Trainer will dich zurück"),
  text:T("Er hat einen neuen Verein übernommen und will genau die Spieler, mit denen er schon erfolgreich war."),
  choices:[{label:"Sofort zu ihm",hint:"Sofortiger Wechsel",roll:[{p:1,text:"Du kennst seine Abläufe im Schlaf. Nach zwei Wochen spielst du, als wärst du nie weg gewesen.",fx:{winterMove:true,form:10,trust:8}}]},
    {label:"Zum Saisonende",hint:"Wechselwunsch",roll:[{p:1,text:"Ihr verabredet euch für den Sommer.",fx:{wantMove:true,morale:8}}]},
    {label:"Dankend ablehnen",hint:"",roll:[{p:1,text:"Du willst dich hier durchsetzen, nicht den bequemen Weg gehen.",fx:{trust:10,form:6}}]}]},
{ id:"w_geburt", tag:"Privat", w:12, g:"w", cond:p=>p.flags.mutterschaft&&p.life.kids>=1&&!p.flags.wgeburt, title:T("Das Kind ist da"),
  text:T("Nach Monaten ohne Wettkampf liegt plötzlich alles andere still. Der Verein hat den Vertrag durchgezahlt, wie es die Regeln vorsehen."),
  choices:[{label:"Ganz da sein",hint:"",roll:[{p:1,text:"Drei Monate ohne Ball, ohne schlechtes Gewissen. Danach hast du eine Klarheit, die du vorher nicht hattest.",fx:{morale:22,fitness:-6,flag:"wgeburt"}}]},
    {label:"Früh wieder ins Athletiktraining",hint:"",roll:[{p:1,text:"Sechs Wochen nach der Geburt stehst du wieder im Kraftraum. Die Ärztin bremst dich zweimal.",fx:{fitness:8,morale:10,injuryProne:5,flag:"wgeburt"}}]}]},
{ id:"w_kinderbetreuung", tag:"Familie", w:6, g:"w", cond:p=>p.life.kids>=1, title:T("Betreuung an Spieltagen"),
  text:T("Auswärtsspiele, Trainingslager, Länderspielreisen. Der Verein hat dafür bislang keine Lösung."),
  choices:[{label:"Eine Regelung durchsetzen",hint:"",roll:[{p:.7,text:"Ab der Rückrunde gibt es einen Betreuungsraum am Trainingsgelände. Drei Mitspielerinnen nutzen ihn auch.",fx:{morale:16,rep:8,legacy:14,trust:6}},
    {p:.3,text:"Es scheitert am Budget. Du organisierst es privat.",fx:{money:-.05,morale:-6,fitness:-4}}]},
    {label:"Privat regeln",hint:"",roll:[{p:1,text:"Deine Mutter zieht in die Nähe. Ohne sie ginge es nicht.",fx:{money:-.04,morale:8}}]}]},
/* ============ EREIGNISSE MIT SOFORTIGER FOLGE ============ */
{ id:"sf_aufloesung", tag:"Vertrag", w:6, ph:2, cond:p=>p.trust<32&&p.contract>=1&&p.age>=21, title:T("Der Verein bietet die Vertragsauflösung an"),
  text:T("Man plant nicht mehr mit dir und will das Gehalt sparen. Auf dem Tisch liegt eine Abfindung."),
  choices:[{label:"Annehmen und sofort frei sein",hint:"Vertrag endet sofort",roll:[{p:1,text:"Unterschrift, Handschlag, Schlüssel abgegeben. Ab heute Mittag bist du ablösefrei.",fx:{terminate:true,money:.35,morale:-6}}]},
    {label:"Auf dem Vertrag bestehen",hint:"",roll:[{p:.5,text:"Sie geben nach. Du trainierst weiter mit der Mannschaft.",fx:{trust:8,morale:6}},
      {p:.5,text:"Du trainierst ein halbes Jahr mit der Zweiten.",fx:{suspend:8,morale:-14,form:-8}}]}]},
{ id:"sf_gehalt", tag:"Vertrag", w:7, ph:2, cond:p=>p.lastNote<=2.5&&p.contract>=1&&p.seasons.length>=1, title:T("Nachverhandlung nach starker Saison"),
  text:c=>`Note ${c.ls.note.toFixed(1)}, ${c.ls.apps} Einsätze. Dein Berater sagt, der Markt gebe deutlich mehr her.`,
  choices:[{label:"Erhöhung fordern",hint:"Wirkt sofort",roll:[{p:.62,text:"Der Verein zieht mit. Ab diesem Monat steht mehr auf der Abrechnung.",fx:{raise:.35,morale:10,trust:-4}},
    {p:.38,text:"Sie lehnen ab und verweisen auf die Laufzeit. Das Verhältnis kühlt ab.",fx:{trust:-12,morale:-10}}]},
    {label:"Prämienmodell vorschlagen",hint:"",roll:[{p:1,text:"Weniger Grundgehalt, dafür Prämien für Einsätze und Tore. Beide Seiten können damit leben.",fx:{raise:.15,trust:10,morale:6}}]}]},
{ id:"sf_aussortiert", tag:"Vertrag", w:6, ph:2, cond:p=>p.trust<38&&p.age>=24&&p.seasons.length>=2, title:T("Du stehst nicht mehr im Kaderplan"),
  text:T("Der neue Sportdirektor legt dir eine Liste mit drei Vereinen hin. Auf einen davon sollst du dich einigen."),
  choices:[{label:"Den Wechsel akzeptieren",hint:"Du musst im nächsten Fenster gehen",roll:[{p:1,text:"Man einigt sich schnell. Bleiben ist ab sofort keine Möglichkeit mehr.",fx:{forceTransfer:true,morale:-6}}]},
    {label:"Sich querstellen",hint:"",roll:[{p:.45,text:"Nach vier Wochen lenkt der Verein ein und du trainierst wieder mit.",fx:{trust:10,morale:6}},
      {p:.55,text:"Du wirst suspendiert und trainierst allein.",fx:{suspend:10,morale:-16,trust:-14,forceTransfer:true}}]}]},
{ id:"sf_eklat", tag:"Kabine", w:5, ph:3, cond:p=>p.morale<40&&p.age>=21, title:T("Eskalation in der Halbzeitkabine"),
  text:T("Du wirfst dem Trainer vor versammelter Mannschaft vor, dass er dich verheizt. Es fallen Worte, die man nicht zurücknimmt."),
  choices:[{label:"Dabei bleiben",hint:"Sofortige Folgen",roll:[{p:1,text:"Der Verein suspendiert dich noch am selben Abend.",fx:{suspend:8,trust:-26,rep:6,morale:-8,forceTransfer:true}}]},
    {label:"Noch am Abend entschuldigen",hint:"",roll:[{p:.65,text:"Er nimmt es an. Die Sache bleibt zwischen euch.",fx:{trust:-6,morale:-4}},
      {p:.35,text:"Zu spät. Zwei Spiele Tribüne.",fx:{suspend:3,trust:-16,morale:-8}}]}]},
{ id:"sf_binde", tag:"Führung", w:6, ph:2, cond:p=>p.trust>=68&&p.age>=25&&!p.flags.kapitaen&&sameClub(p), title:T("Der Kapitän hört auf"),
  text:T("Der Trainer verkündet die Nachfolge am Montag. Am Sonntagabend ruft er dich an."),
  choices:[{label:"Sofort zusagen",hint:"Du bist ab sofort Kapitän",roll:[{p:1,text:"Am Montag stehst du vor der Mannschaft. Ab diesem Moment ist es dein Team.",fx:{captain:true,rep:14,morale:14,legacy:12}}]},
    {label:"Einen Älteren vorschlagen",hint:"",roll:[{p:1,text:"Du empfiehlst jemand anderen. Das rechnet dir die halbe Kabine hoch an.",fx:{trust:12,morale:6}}]}]},
{ id:"sf_praemie", tag:"Geschäft", w:6, ph:1, cond:p=>{const s=lastS(p);return s&&s.trophies.length>0;}, title:T("Titelprämie wird ausgezahlt"),
  text:c=>`Für ${c.ls.trophies[0]} hat der Verein eine Prämie zugesagt. Sie liegt über dem, was im Vertrag stand.`,
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Der Betrag ist am nächsten Werktag auf dem Konto.",fx:{money:.4,morale:10}}]},
    {label:"An die Mannschaftskasse abgeben",hint:"",roll:[{p:1,text:"Du gibst alles an Zeugwarte, Physios und Platzwarte weiter. Das spricht sich herum.",fx:{trust:18,rep:12,legacy:10,morale:8}}]}]},
{ id:"sf_ausruestung", tag:"Lifestyle", w:5, ph:2, cond:p=>p.money>=1&&!p.assets.includes("physio"), title:T("Der Physio hat einen Termin frei"),
  text:T("Er hat zwei Weltmeister betreut und sucht einen neuen Spieler, den er ganzjährig begleitet."),
  choices:[{label:"Sofort verpflichten",hint:"Ab sofort in deinem Besitz",roll:[{p:1,text:"Ab nächster Woche kommt er dreimal wöchentlich zu dir nach Hause.",fx:{buyAsset:"physio",money:-.9,fitness:8,injuryProne:-12}}]},
    {label:"Nächstes Jahr",hint:"",roll:[{p:1,text:"Du willst erst sehen, wie die Saison läuft.",fx:{}}]}]},
{ id:"sf_durchbruch", tag:"Sportlich", w:6, ph:3, cond:p=>p.age<=23&&p.form>=70&&p.seasons.length>=1, title:T("Der Knoten platzt"),
  text:T("Vier Wochen, in denen dir alles gelingt. Der Trainer sagt, so etwas habe er selten gesehen."),
  choices:[{label:"Weiter Vollgas",hint:"Sofortiger Leistungssprung",roll:[{p:.72,text:"Du nimmst den Schwung mit. Auf einmal spielst du eine Klasse höher als noch im Sommer.",fx:{instantOvr:3,form:12,pot:4,rep:10}},
    {p:.28,text:"Du überziehst und ziehst dir eine Muskelverletzung zu.",fx:{forceInjury:"leicht",form:-6}}]},
    {label:"Kräfte einteilen",hint:"",roll:[{p:1,text:"Du bleibst konstant statt spektakulär.",fx:{instantOvr:1,note:.08,fitness:6}}]}]},
{ id:"sf_rueckkauf", tag:"Transfer", w:5, ph:4, cond:p=>!!p.prevClub&&p.seasons.length>=2&&p.lastNote<=3, title:c=>`${c.prev} will dich zurück`,
  text:T("Ein neuer Trainer, ein neuer Plan und eine Rückkaufklausel, von der du gar nichts wusstest."),
  choices:[{label:"Sofort zurück",hint:"Wechsel noch im Winter",roll:[{p:1,text:"Zwei Telefonate, ein Medizincheck, fertig. Du kommst zurück, wo alles angefangen hat.",fx:{winterMove:true,morale:14,rep:6}}]},
    {label:"Im Sommer entscheiden",hint:"",roll:[{p:1,text:"Ihr verabredet euch für die Sommerpause.",fx:{wantMove:true,morale:6}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Man geht nicht zweimal in denselben Fluss, sagst du.",fx:{trust:8,form:5}}]}]},
{ id:"sf_klausel", tag:"Vertrag", w:5, ph:2, cond:p=>p.flags.klausel&&p.ovr>=76, title:T("Jemand zahlt deine Ausstiegsklausel"),
  text:T("Der Betrag ist heute Morgen überwiesen worden. Dein Verein hat dabei kein Mitspracherecht."),
  choices:[{label:"Gehen",hint:"Wechsel steht fest",roll:[{p:1,text:"Der Wechsel ist damit beschlossene Sache. Am Nachmittag steht der Flieger bereit.",fx:{forceTransfer:true,money:.3,rep:10}}]},
    {label:"Nicht unterschreiben",hint:"",roll:[{p:1,text:"Ohne dich läuft nichts. Der andere Verein zieht das Geld zurück, dein Klub bedankt sich mit einer Verlängerung.",fx:{extend:2,trust:20,morale:12,raise:.15}}]}]},
{ id:"sf_investorpraemie", tag:"Verein", w:5, ph:1, cond:p=>{const s=lastS(p);return s&&s.rank<=3&&sameClub(p);}, title:T("Bonus für die Platzierung"),
  text:c=>`Platz ${c.ls.rank} bringt dem Verein Geld — und dir eine Prämie, die im Vertrag steht.`,
  choices:[{label:"Auszahlen lassen",hint:"",roll:[{p:1,text:"Der Betrag kommt mit der nächsten Abrechnung.",fx:{money:.22,morale:6}}]},
    {label:"In eine Vertragsverlängerung umwandeln",hint:"Sofort mehr Grundgehalt",roll:[{p:1,text:"Statt einmalig lieber dauerhaft. Der Verein geht mit.",fx:{raise:.18,extend:1,trust:10}}]}]},
{ id:"sf_schock", tag:"Verein", w:5, ph:4, cond:p=>p.seasons.length>=1&&p.club.s<=70, title:T("Der Verein muss sofort Gehälter senken"),
  text:T("Ein Sponsor ist abgesprungen. Der Vorstand bittet alle Spieler um einen freiwilligen Verzicht."),
  choices:[{label:"Verzichten",hint:"Sofort weniger Gehalt",roll:[{p:1,text:"Zwanzig Prozent weniger, dafür bleibt der Verein handlungsfähig. Die Fans erfahren davon.",fx:{cut:.2,rep:14,trust:18,morale:6,legacy:8}}]},
    {label:"Nicht verzichten",hint:"",roll:[{p:1,text:"Rechtlich einwandfrei. In der Kabine wird darüber geredet.",fx:{trust:-14,morale:-6}}]}]},
{ id:"sf_ausbildung", tag:"Zukunft", w:5, ph:2, cond:p=>p.age>=28&&p.money>=.5&&!p.flags.trainerschein, title:T("Lehrgang mit Sofortwirkung"),
  text:T("Ein Kompaktkurs über sechs Wochen im Sommer. Danach hast du die erste Trainerlizenz."),
  choices:[{label:"Buchen",hint:"Sofort im Besitz",roll:[{p:1,text:"Sechs Wochen ohne richtigen Urlaub. Dafür siehst du Spiele ab jetzt mit anderen Augen.",fx:{flag:"trainerschein",money:-.06,note:.08,pas:2,def:1,legacy:10,fitness:-4}}]},
    {label:"Später",hint:"",roll:[{p:1,text:"Erst noch spielen.",fx:{fitness:5}}]}]},
{ id:"sf_ultimatum", tag:"Wechselfrage", w:6, ph:4, cond:p=>["bench","tribune"].includes(p.role)&&p.age>=23, title:T("Ultimatum an den Trainer"),
  text:T("Du sagst ihm ins Gesicht, dass du im Winter gehst, wenn sich nichts ändert."),
  choices:[{label:"Ernst machen",hint:"Sofortiger Winterwechsel",roll:[{p:1,text:"Er ändert nichts. Also gehst du.",fx:{winterMove:true,trust:-14}}]},
    {label:"Eine letzte Chance geben",hint:"",roll:[{p:.5,text:"Zwei Wochen später stehst du wieder in der Startelf.",fx:{trust:10,form:10,morale:8}},
      {p:.5,text:"Es bleibt, wie es ist.",fx:{morale:-12,forceTransfer:true}}]}]},

/* ============ WEITERE PASSENDE EREIGNISSE ============ */
{ id:"nn_saisonziel", tag:"Verein", w:6, ph:2, cond:p=>p.seasons.length>=1, title:T("Die Zielvorgabe für die Saison"),
  text:c=>`Der Vorstand nennt vor der Vorbereitung ein Ziel. Nach Platz ${c.ls.rank} im Vorjahr klingt es ehrgeizig.`,
  choices:[{label:"Öffentlich dahinterstellen",hint:"",roll:[{p:1,text:"Du sagst in die Kameras, dass ihr das schafft. Ab jetzt werdet ihr daran gemessen.",fx:{trust:10,rep:6,morale:6}}]},
    {label:"Vorsichtig bleiben",hint:"",roll:[{p:1,text:"Du sprichst von Schritt für Schritt. Langweilig, aber schlau.",fx:{note:.05}}]}]},
{ id:"nn_hinrunde", tag:"Sportlich", w:6, ph:3, cond:p=>p.seasons.length>=1, title:T("Halbzeit der Saison"),
  text:T("Die Hinrunde ist vorbei. Der Trainer setzt sich mit jedem einzeln zusammen und legt Zahlen auf den Tisch."),
  choices:[{label:"Klare Ziele vereinbaren",hint:"",roll:[{p:1,text:"Ihr legt drei messbare Punkte fest. In der Rückrunde arbeitest du genau daran.",fx:{note:.1,trust:8,form:6}}]},
    {label:"Nur zuhören",hint:"",roll:[{p:1,text:"Du nickst und gehst. Er hätte gern mehr gehört.",fx:{trust:-5}}]}]},
{ id:"nn_endspurt", tag:"Sportlich", w:6, ph:4, cond:p=>p.seasons.length>=1, title:T("Die letzten fünf Spiele"),
  text:T("Jetzt entscheidet sich, wofür die ganze Saison gut war. Der Trainer kürzt die Einheiten und erhöht die Intensität."),
  choices:[{label:"Alles investieren",hint:"",roll:[{p:.62,text:"Du spielst die stärksten Wochen des Jahres, genau dann, wenn es zählt.",fx:{form:14,note:.1,fitness:-9,trust:10}},
    {p:.38,text:"Der Körper macht im vorletzten Spiel zu.",fx:{forceInjury:"leicht",fitness:-10}}]},
    {label:"Auf die Gesundheit achten",hint:"",roll:[{p:1,text:"Du kommst ohne Blessur durch die entscheidenden Wochen.",fx:{fitness:6,injuryProne:-4}}]}]},
{ id:"nn_sommerpause", tag:"Vorbereitung", w:5, ph:2, cond:p=>p.seasons.length>=1&&p.age>=20, title:T("Zwei Wochen vor dem Trainingsauftakt"),
  text:T("Der Athletiktrainer schickt Werte, die er am ersten Tag sehen will. Wer sie verfehlt, trainiert zwei Wochen extra."),
  choices:[{label:"Die Werte übertreffen",hint:"",roll:[{p:1,text:"Du bist der Erste im Ziel. Der Trainer erwähnt es vor allen.",fx:{fitness:12,trust:10,phy:1,morale:-4}}]},
    {label:"Gerade so bestehen",hint:"",roll:[{p:1,text:"Reicht, fällt aber auf.",fx:{fitness:3,trust:-3}}]}]},
{ id:"nn_tabellenblick", tag:"Verein", w:5, ph:4, cond:p=>{const s=lastS(p);return s&&s.rank>=s.N-4;}, title:T("Blick auf die Tabelle"),
  text:c=>`Nach ${c.ls.rank} von ${c.ls.N} im Vorjahr steht ihr wieder unten drin. In der Kabine hängt seit Wochen eine ausgedruckte Tabelle.`,
  choices:[{label:"Sie abhängen",hint:"",roll:[{p:1,text:"Du reißt sie ab und sagst, ihr sollt auf euer Spiel schauen. Danach wird es besser.",fx:{trust:12,morale:10,form:8}}]},
    {label:"Hängen lassen",hint:"",roll:[{p:1,text:"Jeder Blick darauf macht es schlimmer.",fx:{morale:-8,form:-5}}]}]},
{ id:"nn_wildcardfrage", tag:"Medien", w:5, ph:3, cond:p=>!!p.wc&&p.rep>=40, title:T("Woher kommt das eigentlich?"),
  text:c=>`Ein Reporter fragt, was dich ausmacht. Er hat sich vorbereitet und nennt genau das, was dich seit der Jugend auszeichnet.`,
  choices:[{label:"Offen darüber reden",hint:"",roll:[{p:1,text:"Du erzählst die ganze Geschichte. Sie wird oft zitiert.",fx:{rep:12,morale:8,legacy:6}}]},
    {label:"Herunterspielen",hint:"",roll:[{p:1,text:"Du sagst, du arbeitest einfach hart. Stimmt auch.",fx:{trust:8,rep:3}}]}]},
{ id:"nn_uteam", tag:"Nationalteam", w:7, ph:2, cond:p=>p.age<=21&&(p.nt.uCaps||0)>=5&&p.nt.level!=="A", title:T("Sprung von der U-Auswahl ins A-Team"),
  text:c=>`${c.p.nt.uCaps} Einsätze in den Juniorenteams. Der Bundestrainer lädt dich erstmals zum Lehrgang der A-Auswahl ein.`,
  choices:[{label:"Alles darauf ausrichten",hint:"",roll:[{p:.6,text:"Du überzeugst im Lehrgang und stehst beim nächsten Spiel im Kader.",fx:{ntBonus:16,rep:10,morale:12}},
    {p:.4,text:"Es reicht noch nicht ganz. Du sammelst weiter in der U21.",fx:{ntBonus:6,morale:-4}}]},
    {label:"Erst im Verein durchsetzen",hint:"",roll:[{p:1,text:"Du sagst ab und arbeitest an deiner Spielzeit. Vernünftig.",fx:{trust:10,form:8,pot:1}}]}]},
{ id:"nn_ujugend", tag:"Nationalteam", w:6, ph:3, cond:p=>p.age<=19&&(p.nt.uCaps||0)>=3, title:T("Turnier mit der Juniorenauswahl"),
  text:T("Drei Wochen im Sommer mit dem Jahrgang. Für viele hier ist es das erste Mal in einem Flugzeug."),
  choices:[{label:"Verantwortung übernehmen",hint:"",roll:[{p:1,text:"Du führst die Mannschaft an und wirst danach von drei größeren Klubs beobachtet.",fx:{pot:3,rep:10,ntBonus:5,trust:6}}]},
    {label:"Mitlaufen",hint:"",roll:[{p:1,text:"Eine schöne Erfahrung, mehr nicht.",fx:{morale:8,pot:1}}]}]},
/* ============ TORHÜTER ============ */
{ id:"pt_elfmeterkiller", tag:"Position", w:7, pos:["TW"], ph:3, cond:p=>p.ovr>=62, title:T("Elfmeterschießen im Pokal"),
  text:T("Der Torwarttrainer drückt dir einen Zettel in den Stutzen. Darauf steht, wohin die fünf Schützen in dieser Saison geschossen haben."),
  choices:[{label:"Dem Zettel vertrauen",hint:"",roll:[{p:.6,text:"Zwei gehalten, genau in die Ecken vom Zettel. Deine Mannschaft trägt dich vom Platz.",fx:{rep:16,form:14,morale:16,note:.12,csMod:.06}},
    {p:.4,text:"Alle fünf gehen in die andere Ecke. So ist das mit Statistik.",fx:{morale:-10,form:-5}}]},
    {label:"Auf dein Gefühl hören",hint:"",roll:[{p:.45,text:"Du liest den Anlauf und hältst den entscheidenden.",fx:{rep:14,form:12,morale:14,def:1}},
      {p:.55,text:"Kein einziger Ball in deiner Reichweite.",fx:{morale:-8}}]}]},
{ id:"pt_spielaufbau", tag:"Position", w:7, pos:["TW"], ph:2, cond:p=>p.age>=18, title:T("Der neue Trainer will einen mitspielenden Torhüter"),
  text:T("Aufbau von hinten, hohe Kette, Anspiel unter Druck. Dein bisheriges Spiel war ein anderes."),
  choices:[{label:"Umstellen und lernen",hint:"Wirkt sofort",roll:[{p:.68,text:"Nach acht Wochen bist du der zweite Sechser. Der Trainer baut alles über dich auf.",fx:{pas:6,dri:3,note:.1,trust:14,instantOvr:1}},
    {p:.32,text:"Zwei Ballverluste im eigenen Sechzehner, zwei Gegentore, eine Bank.",fx:{pas:3,trust:-16,morale:-12,form:-10}}]},
    {label:"Beim gewohnten Spiel bleiben",hint:"",roll:[{p:1,text:"Du schlägst weiter lang. Der Trainer sucht im Winter einen anderen Torhüter.",fx:{def:2,trust:-14,forceTransfer:true}}]}]},
{ id:"pt_nummerzwei", tag:"Position", w:7, pos:["TW"], ph:2, cond:p=>["bench","tribune"].includes(p.role)&&p.age>=21, title:T("Ein Torhüter, ein Platz"),
  text:T("Auf deiner Position gibt es keine Rotation. Entweder du spielst alles oder nichts. Der Trainer sagt, er entscheide nach der Vorbereitung."),
  choices:[{label:"Angreifen",hint:"",roll:[{p:.5,text:"Du hältst in jedem Testspiel zu null und verdrängst ihn.",fx:{trust:20,form:14,morale:14,csMod:.08}},
    {p:.5,text:"Er bleibt die Nummer eins. Ein weiteres Jahr Bank ist keine Option mehr.",fx:{morale:-14,forceTransfer:true}}]},
    {label:"Sofort das Gespräch über einen Wechsel suchen",hint:"Wechsel im Winter",roll:[{p:1,text:"Ihr trennt euch im Guten. Der Verein hilft sogar bei der Suche.",fx:{winterMove:true,trust:6,morale:6}}]}]},
{ id:"pt_kapitaenbinde", tag:"Position", w:6, pos:["TW"], ph:2, cond:p=>p.trust>=62&&p.age>=27&&!p.flags.kapitaen, title:T("Ein Torhüter als Kapitän"),
  text:T("Manche in der Kabine finden, die Binde gehöre auf den Platz und nicht ins Tor. Der Trainer sieht das anders."),
  choices:[{label:"Annehmen",hint:"Du bist ab sofort Kapitän",roll:[{p:1,text:"Du führst von hinten und redest mehr als je zuvor. Es funktioniert.",fx:{captain:true,trust:16,rep:12,legacy:12,note:.06}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du sagst, du willst dich aufs Halten konzentrieren. Auch das ist eine Ansage.",fx:{def:2,form:6}}]}]},
{ id:"pt_verletzung", tag:"Position", w:6, pos:["TW"], ph:3, title:T("Zusammenprall im Fünfmeterraum"),
  text:T("Du gehst voran in den Zweikampf mit dem Stürmer. Danach liegen beide."),
  choices:[{label:"Weitermachen",hint:"",roll:[{p:.55,text:"Nur eine Platzwunde. Du spielst mit Turban zu Ende und wirst dafür gefeiert.",fx:{rep:12,trust:14,morale:8,phy:1}},
    {p:.45,text:"Schulterverletzung. Der Ersatzmann spielt drei Monate.",fx:{forceInjury:"mittel",trust:-4}}]},
    {label:"Sofort auswechseln lassen",hint:"",roll:[{p:1,text:"Vernünftig, aber die Kurve pfeift, weil sie den Ernst nicht sieht.",fx:{rep:-5,injuryProne:-4}}]}]},

/* ============ INNENVERTEIDIGER ============ */
{ id:"pv_kette", tag:"Position", w:7, pos:["IV"], ph:2, cond:p=>p.age>=21, title:T("Dreierkette statt Viererkette"),
  text:T("Der neue Trainer stellt um. Als linker Halbverteidiger sollst du plötzlich mit aufrücken und Pässe ins Mittelfeld spielen."),
  choices:[{label:"Die neue Rolle annehmen",hint:"Wirkt sofort",roll:[{p:.7,text:"Nach drei Spielen bist du der Aufbauspieler des Systems.",fx:{pas:5,dri:2,note:.1,trust:12,instantOvr:1}},
    {p:.3,text:"Du wirst zweimal ausgespielt und stehst wieder ganz hinten.",fx:{def:2,trust:-8,morale:-6}}]},
    {label:"Auf der gewohnten Position bestehen",hint:"",roll:[{p:1,text:"Er stellt dich neben den Sechser. Deine Werte bleiben, deine Bedeutung sinkt.",fx:{def:3,trust:-6}}]}]},
{ id:"pv_gelbsperre", tag:"Position", w:6, pos:["IV","ZDM","AV"], ph:4, cond:p=>p.seasons.length>=1, title:T("Vierte Gelbe Karte vor dem Spitzenspiel"),
  text:T("Ein taktisches Foul in der 80. Minute eines längst entschiedenen Spiels — und du fehlst nächste Woche."),
  choices:[{label:"Dazu stehen",hint:"Sofort gesperrt",roll:[{p:1,text:"Du sagst, das Foul war nötig. Der Trainer nickt, die Sperre bleibt.",fx:{suspend:2,trust:6,def:1}}]},
    {label:"Sich ärgern",hint:"",roll:[{p:1,text:"Du redest zwei Tage mit niemandem.",fx:{suspend:2,morale:-8,form:-4}}]}]},
{ id:"pv_gegenspieler", tag:"Position", w:6, pos:["IV","AV"], ph:3, cond:p=>p.ovr>=64, title:c=>`Duell mit einem Weltklassestürmer`,
  text:T("Vierzig Millionen Ablöse, achtzehn Saisontore, und die ganze Woche redet jeder nur über eure Zweikämpfe."),
  choices:[{label:"Ihn körperlich fordern",hint:"",roll:[{p:.55,text:"Er sieht in neunzig Minuten keinen Ball. Nach dem Spiel tauscht er das Trikot mit dir.",fx:{def:4,rep:14,form:12,trust:12,instantOvr:1}},
    {p:.45,text:"Er zieht dir zweimal davon und du siehst Gelb-Rot.",fx:{suspend:2,def:1,morale:-12,trust:-10}}]},
    {label:"Abstand halten und absichern",hint:"",roll:[{p:1,text:"Kein Spektakel, aber auch kein Gegentor. Der Trainer lobt genau das.",fx:{note:.1,def:2,trust:8}}]}]},
{ id:"pv_eigentor", tag:"Position", w:5, pos:["IV","AV","TW"], ph:3, title:T("Unglückliches Eigentor"),
  text:T("Abgefälscht, unhaltbar, und ausgerechnet in einem Spiel, das ihr dominiert habt."),
  choices:[{label:"Sofort Verantwortung übernehmen",hint:"",roll:[{p:1,text:"Du stellst dich nach dem Spiel vor die Kameras. Das nimmt der Sache die Schärfe.",fx:{rep:8,trust:10,morale:-4}}]},
    {label:"Es wegschieben",hint:"",roll:[{p:.5,text:"Nächste Woche redet niemand mehr darüber.",fx:{}},
      {p:.5,text:"Der Clip begleitet dich die ganze Saison.",fx:{rep:-8,morale:-8,form:-5}}]}]},

/* ============ AUSSENVERTEIDIGER ============ */
{ id:"pa_flanke", tag:"Position", w:7, pos:["AV"], ph:2, cond:p=>p.age>=19, title:T("Offensiver Außenverteidiger"),
  text:T("Der Trainer will, dass du in jeder Angriffssituation bis zur Grundlinie durchläufst. Zwölf Kilometer werden vierzehn."),
  choices:[{label:"Voll durchziehen",hint:"Wirkt sofort",roll:[{p:.65,text:"Neun Vorlagen in einer Saison für einen Außenverteidiger. Das fällt auf.",fx:{pac:4,pas:4,assistMod:.25,rep:12,fitness:-8,instantOvr:1}},
    {p:.35,text:"Zweimal wirst du im Rücken überlaufen, beide Male fällt ein Tor.",fx:{def:-2,trust:-10,form:-8}}]},
    {label:"Defensiv absichern",hint:"",roll:[{p:1,text:"Du bleibst hinten. Solide, aber niemand schreibt über Außenverteidiger, die nur verteidigen.",fx:{def:4,note:.08,rep:-3}}]}]},
{ id:"pa_seitenwechsel", tag:"Position", w:6, pos:["AV"], ph:2, cond:p=>p.age>=20, title:T("Auf die andere Seite"),
  text:T("Der Stammspieler auf der anderen Außenbahn fällt aus. Du sollst dort spielen — mit dem falschen Fuß außen."),
  choices:[{label:"Übernehmen",hint:"Wirkt sofort",roll:[{p:.6,text:"Nach vier Spielen bist du auf beiden Seiten einsetzbar. Das macht dich für jeden Trainer wertvoller.",fx:{dri:3,pas:3,trust:14,instantOvr:2,flag:"beidseitig"}},
    {p:.4,text:"Es funktioniert nicht. Nach zwei Spielen sitzt du wieder draußen.",fx:{trust:-8,morale:-8}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du sagst, du spielst nur deine Seite. Der Trainer merkt sich das.",fx:{trust:-12}}]}]},

/* ============ MITTELFELD ============ */
{ id:"pm_sechser", tag:"Position", w:6, pos:["ZDM","ZM"], ph:3, cond:p=>p.ovr>=62, title:T("Alleiniger Sechser"),
  text:T("Der zweite defensive Mittelfeldspieler fällt für den Rest der Saison aus. Der Raum vor der Abwehr gehört ab sofort dir allein."),
  choices:[{label:"Den Raum übernehmen",hint:"Wirkt sofort",roll:[{p:.65,text:"Du läufst mehr als je zuvor und wirst zum unverzichtbaren Teil der Mannschaft.",fx:{def:4,phy:3,trust:18,note:.1,fitness:-8,instantOvr:1}},
    {p:.35,text:"Allein ist der Raum zu groß. Nach fünf Spielen holt der Verein einen Ersatz.",fx:{trust:-8,form:-8,morale:-6}}]},
    {label:"Um Verstärkung bitten",hint:"",roll:[{p:1,text:"Der Verein leiht jemanden aus. Vernünftig, kostet dich aber Bedeutung.",fx:{fitness:6,trust:-4}}]}]},
{ id:"pm_zehner", tag:"Position", w:6, pos:["ZOM","ZM"], ph:2, cond:p=>p.age>=20, title:T("Kein Platz mehr für einen Zehner"),
  text:T("Das neue System kennt deine Position nicht mehr. Der Trainer bietet dir an, entweder auf den Flügel oder auf die Acht zu gehen."),
  choices:[{label:"Auf den Flügel",hint:"Positionswechsel wirkt sofort",roll:[{p:1,text:"Mehr Raum, mehr Tempo, weniger Ball. Dafür kommst du in aussichtsreichere Zonen.",fx:{repos:"AF",pac:3,dri:3,trust:10}}]},
    {label:"Auf die Acht",hint:"Positionswechsel wirkt sofort",roll:[{p:1,text:"Mehr Laufarbeit, mehr Verantwortung im Aufbau. Deine Zahlen sinken, dein Wert steigt.",fx:{repos:"ZM",pas:4,def:2,trust:12,note:.06}}]},
    {label:"Auf deiner Position bestehen",hint:"",roll:[{p:1,text:"Du bleibst der Zehner in einem System ohne Zehner. Das geht selten gut.",fx:{trust:-14,forceTransfer:true}}]}]},
{ id:"pm_freistoss", tag:"Position", w:6, nopos:["TW"], ph:3, cond:p=>p.attrs.pas>=68||p.attrs.sho>=68, title:T("Streit um den Freistoß"),
  text:c=>`Zwanzig Meter, halblinks. ${c.mate.name} nimmt sich den Ball und schaut dich an.`,
  choices:[{label:"Den Ball nehmen",hint:"",roll:[{p:.45,text:"Oberkante Latte und rein. Ab sofort schießt du sie alle.",fx:{sho:3,pas:2,rep:12,morale:12,flag:"standards"}},
    {p:.55,text:"Zwei Meter über das Tor. Er sagt nichts, nimmt sie sich aber beim nächsten Mal.",fx:{morale:-6,trust:-4}}]},
    {label:"Ihm überlassen",hint:"",roll:[{p:1,text:"Er trifft. Ihr umarmt euch, und du weißt, dass es richtig war.",fx:{trust:10,morale:6}}]}]},

/* ============ ANGRIFF ============ */
{ id:"ps_ladehemmung", tag:"Position", w:7, pos:["ST","AF","ZOM"], ph:4, cond:p=>p.seasons.length>=1&&p.form<58, title:T("Zwölf Spiele ohne Treffer"),
  text:T("Die Zeitungen zählen mit. Der Trainer stellt dich trotzdem jedes Mal auf, was es fast noch schlimmer macht."),
  choices:[{label:"Einen Sportpsychologen holen",hint:"Ab sofort im Umfeld",roll:[{p:.7,text:"Drei Sitzungen, dann fällt der Knoten. Beim nächsten Spiel triffst du doppelt.",fx:{buyAsset:"mental",money:-.35,form:16,morale:14,goalMod:.1}},
    {p:.3,text:"Es hilft nicht sofort. Aber du gehst wenigstens anders damit um.",fx:{buyAsset:"mental",money:-.35,morale:8}}]},
    {label:"Öffentlich Druck ablassen",hint:"",roll:[{p:.4,text:"Nach dem Interview fällt alles ab. Zwei Tore am Wochenende.",fx:{form:14,rep:6,morale:12}},
      {p:.6,text:"Der Verein findet es unprofessionell und stellt dich auf die Bank.",fx:{trust:-14,morale:-10,form:-6}}]}]},
{ id:"ps_torpraemie", tag:"Position", w:6, pos:["ST","AF"], ph:2, cond:p=>p.tot.goals>=25, title:T("Prämienmodell für Tore"),
  text:T("Der Verein bietet an, dein Grundgehalt zu senken und dafür jedes Tor einzeln zu vergüten."),
  choices:[{label:"Annehmen",hint:"Sofort weniger Grundgehalt, mehr Anreiz",roll:[{p:1,text:"Ab jetzt zählt jeder Treffer doppelt. Für dich und fürs Konto.",fx:{cut:.18,goalMod:.2,money:.15,morale:8}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du willst planbar verdienen. Nachvollziehbar.",fx:{trust:-4}}]}]},
{ id:"ps_neunerkonkurrenz", tag:"Position", w:6, pos:["ST"], ph:2, cond:p=>p.age>=22, title:T("Der Verein holt einen zweiten Neuner"),
  text:c=>`Zwölf Millionen Ablöse, dein Alter, deine Position. Der Sportdirektor sagt, ihr könntet auch zusammen spielen.`,
  choices:[{label:"Um den Platz kämpfen",hint:"",roll:[{p:.5,text:"Du machst in der Vorbereitung sechs Tore und bleibst gesetzt.",fx:{form:12,trust:14,morale:12,goalMod:.08}},
    {p:.5,text:"Er spielt, du sitzt. Nach der Hinrunde reicht es dir.",fx:{morale:-14,trust:-8,winterMove:true}}]},
    {label:"Sofort das Gespräch suchen",hint:"",roll:[{p:1,text:"Du fragst direkt nach der Planung. Die ehrliche Antwort tut weh, aber du kannst planen.",fx:{trust:8,wantMove:true,morale:-4}}]}]},
{ id:"ps_hattrick", tag:"Position", w:6, pos:["ST","AF","ZOM"], ph:3, cond:p=>p.form>=66&&p.ovr>=66, title:T("Drei Tore in einem Spiel"),
  text:T("Nach dem Spiel hältst du den Ball in der Hand, den alle im Kader unterschrieben haben."),
  choices:[{label:"Den Schwung mitnehmen",hint:"Sofortiger Sprung",roll:[{p:.7,text:"Aus einem Spiel werden acht Wochen, in denen du nicht zu stoppen bist.",fx:{instantOvr:2,form:16,rep:14,goalMod:.12,morale:14}},
    {p:.3,text:"Danach kommt die Erwartung, und mit ihr die Verkrampfung.",fx:{rep:10,form:-8,morale:-4}}]},
    {label:"Klein halten",hint:"",roll:[{p:1,text:"Du sagst, das war die Mannschaft. Die Kabine hört das gern.",fx:{trust:14,rep:6,form:6}}]}]},

/* ============ WEITERE MIT SOFORTIGER FOLGE ============ */
{ id:"sf_ausstiegsklausel", tag:"Vertrag", w:6, ph:2, cond:p=>p.ovr>=72&&p.contract>=2&&!p.flags.klausel, title:T("Ausstiegsklausel verhandeln"),
  text:T("Dein Berater will eine Klausel in den Vertrag schreiben. Der Verein würde zustimmen, verlangt dafür aber Gehaltsverzicht."),
  choices:[{label:"Klausel gegen Gehalt",hint:"Sofort weniger Gehalt",roll:[{p:1,text:"Zwölf Prozent weniger, dafür kannst du jederzeit gehen, wenn jemand die Summe zahlt.",fx:{cut:.12,flag:"klausel",morale:8}}]},
    {label:"Beim Geld bleiben",hint:"",roll:[{p:1,text:"Kein Ausweg, dafür volles Gehalt.",fx:{morale:4}}]}]},
{ id:"sf_leihabbruch", tag:"Leihe", w:6, ph:4, cond:p=>!!p.flags.aufLeihe&&p.trust<40, title:T("Die Leihe wird abgebrochen"),
  text:T("Der Leihverein hat einen neuen Trainer und der plant nicht mit dir. Dein Stammverein kann dich im Winter zurückholen."),
  choices:[{label:"Sofort zurück",hint:"Wechsel noch im Winter",roll:[{p:1,text:"Du packst und fährst. Halbe Saison verloren, aber wenigstens trainierst du wieder normal.",fx:{winterMove:true,morale:-6,trust:6}}]},
    {label:"Durchhalten",hint:"",roll:[{p:.4,text:"Der neue Trainer ändert seine Meinung, als zwei Spieler ausfallen.",fx:{trust:14,form:10,morale:8}},
      {p:.6,text:"Ein halbes Jahr Tribüne, ohne einen einzigen Einsatz.",fx:{morale:-16,trust:-10,pot:-1}}]}]},
{ id:"sf_bonuszahlung", tag:"Geschäft", w:6, ph:1, cond:p=>{const s=lastS(p);return s&&s.apps>=30;}, title:T("Einsatzprämie erreicht"),
  text:c=>`${c.ls.apps} Pflichtspiele. Damit greift eine Klausel, an die du selbst nicht mehr gedacht hast.`,
  choices:[{label:"Auszahlen lassen",hint:"",roll:[{p:1,text:"Der Betrag kommt am Monatsende.",fx:{money:.18,morale:6}}]},
    {label:"In den Grundvertrag einrechnen lassen",hint:"Sofort mehr Gehalt",roll:[{p:1,text:"Statt einmalig lieber dauerhaft. Der Verein geht mit.",fx:{raise:.12,trust:8}}]}]},
{ id:"sf_trainingsstreik", tag:"Kabine", w:5, ph:3, cond:p=>p.morale<38&&p.trust<45, title:T("Die Mannschaft verweigert das Training"),
  text:T("Ausstehende Prämien, ein Trainer, dem keiner mehr folgt. Der Kader beschließt, am Dienstag nicht zu erscheinen."),
  choices:[{label:"Mitmachen",hint:"",roll:[{p:.55,text:"Der Vorstand lenkt binnen einer Woche ein. Alles wird nachgezahlt.",fx:{money:.12,trust:10,morale:12,rep:6}},
    {p:.45,text:"Der Verein suspendiert die drei Wortführer. Du bist einer davon.",fx:{suspend:6,trust:-18,morale:-10,rep:8}}]},
    {label:"Trotzdem erscheinen",hint:"",roll:[{p:1,text:"Du stehst allein auf dem Platz. Der Trainer dankt es dir, die Kabine nicht.",fx:{trust:20,morale:-12,rep:-6}}]}]},
{ id:"sf_altersteilzeit", tag:"Alter", w:5, ph:2, cond:p=>p.age>=34&&p.contract<=1, title:T("Ein Vertrag mit Übergang"),
  text:T("Der Verein bietet zwei Jahre: eines noch als Spieler, danach eine feste Rolle im Klub."),
  choices:[{label:"Unterschreiben",hint:"Sofort verlängert",roll:[{p:1,text:"Die Zeit nach dem Fußball ist damit geklärt, bevor sie anfängt.",fx:{extend:2,cut:.15,morale:16,legacy:20,trust:16,flag:"trainerschein"}}]},
    {label:"Nur als Spieler",hint:"",roll:[{p:1,text:"Du willst nicht ans Ende denken, solange du spielst.",fx:{extend:1,morale:6}}]}]},
{ id:"sf_stadionverbot", tag:"Zwielichtig", w:4, ph:3, cond:p=>p.rep>=45&&p.age>=22, title:T("Ein Fan wird ausfällig"),
  text:T("Beim Aufwärmen wirst du von einem einzelnen Zuschauer übel beleidigt. Der Ordner steht daneben und tut nichts."),
  choices:[{label:"Sofort den Schiedsrichter holen",hint:"",roll:[{p:1,text:"Das Spiel wird unterbrochen, der Mann bekommt lebenslanges Stadionverbot. Danach ist Ruhe.",fx:{rep:12,trust:10,morale:6,legacy:6}}]},
    {label:"Selbst reagieren",hint:"",roll:[{p:.35,text:"Du gehst hin und redest mit ihm. Er entschuldigt sich tatsächlich.",fx:{rep:14,morale:10}},
      {p:.65,text:"Du wirst laut, und plötzlich stehst du in der Kritik.",fx:{rep:-10,suspend:2,morale:-10}}]}]},
/* ============ SPORTLERALLTAG ============ */
{ id:"al_schlaf", tag:"Körper", w:6, ph:2, cond:p=>p.age>=18, title:T("Der Schlaftracker sagt fünf Stunden"),
  text:T("Der Verein hat allen Ringe ausgeteilt. Deine Werte sind die schlechtesten im Kader, und der Athletiktrainer legt sie dir wortlos hin."),
  choices:[{label:"Schlafhygiene ernst nehmen",hint:"",roll:[{p:1,text:"Kein Bildschirm nach 22 Uhr, feste Zeiten, dunkles Zimmer. Nach sechs Wochen fühlt sich alles leichter an.",fx:{fitness:12,injuryProne:-8,note:.06,flag:"schlaf"}}]},
    {label:"Weiter wie bisher",hint:"",roll:[{p:1,text:"Du sagst, du kommst mit fünf Stunden klar. Im Frühjahr sagst du das nicht mehr.",fx:{fitness:-9,injuryProne:6}}]}]},
{ id:"al_ernaehrung", tag:"Körper", w:6, ph:2, cond:p=>p.age>=17, title:T("Die Körperfettmessung"),
  text:T("Zwei Prozentpunkte über dem Wert vom Saisonende. Der Verein stellt dir einen Ernährungsberater, wenn du willst."),
  choices:[{label:"Annehmen",hint:"",roll:[{p:1,text:"Kein Verzicht, nur andere Mengen zur anderen Zeit. Nach drei Monaten läufst du leichter.",fx:{pac:2,phy:2,fitness:10,money:-.03}}]},
    {label:"Selbst regeln",hint:"",roll:[{p:.5,text:"Du bekommst es allein hin.",fx:{fitness:5}},
      {p:.5,text:"Beim nächsten Test sind es drei Punkte mehr.",fx:{pac:-1,fitness:-8,trust:-6}}]}]},
{ id:"al_kaeltebad", tag:"Körper", w:5, ph:3, cond:p=>p.age>=18, title:T("Eistonne nach jedem Spiel"),
  text:T("Elf Grad, drei Minuten, und der Physio steht mit der Stoppuhr daneben. Die halbe Mannschaft drückt sich davor."),
  choices:[{label:"Jedes Mal durchziehen",hint:"",roll:[{p:1,text:"Unangenehm und wirksam. Am Montag bist du der Einzige, der normal geht.",fx:{fitness:9,injuryProne:-7}}]},
    {label:"Lieber ausrollen",hint:"",roll:[{p:1,text:"Radfahren statt frieren. Funktioniert auch, nur langsamer.",fx:{fitness:4}}]}]},
{ id:"al_reha", tag:"Verletzung", w:6, ph:3, cond:p=>p.injuryProne>=40&&p.age>=20, title:T("Rückkehr nach der Verletzung"),
  text:T("Der Arzt gibt grün, das Gefühl im Bein nicht. Der Trainer fragt, ob du am Samstag im Kader stehen willst."),
  choices:[{label:"Zwei Wochen dranhängen",hint:"",roll:[{p:1,text:"Du wartest, bis es sich wirklich richtig anfühlt. Danach kein Rückfall.",fx:{injuryProne:-14,fitness:8,trust:-4}}]},
    {label:"Sofort spielen",hint:"",roll:[{p:.5,text:"Es hält. Nach zwanzig Minuten hast du die Verletzung vergessen.",fx:{trust:12,form:8,morale:10}},
      {p:.5,text:"Nach einer halben Stunde geht dieselbe Stelle wieder zu.",fx:{forceInjury:"mittel",injuryProne:10,morale:-12}}]}]},
{ id:"al_videostudium", tag:"Taktik", w:6, ph:2, cond:p=>p.age>=18, title:T("Der Analyst schickt dir eine Datei"),
  text:T("Vierzig Minuten Zusammenschnitt, nur deine Ballverluste. Kein Kommentar dazu, nur der Anhang."),
  choices:[{label:"Alles durcharbeiten",hint:"",roll:[{p:1,text:"Du siehst Muster, die dir vorher niemand erklären konnte. Ab Januar passiert es seltener.",fx:{pas:3,note:.12,trust:10,dri:2}}]},
    {label:"Kurz überfliegen",hint:"",roll:[{p:1,text:"Du kennst deine Fehler ja. Vermeintlich.",fx:{note:-.04}}]}]},
{ id:"al_frueh", tag:"Vorbereitung", w:5, ph:2, cond:p=>p.age>=18, title:T("Extraschichten vor dem Training"),
  text:T("Eine Stunde früher da, allein mit dem Torwarttrainer oder der Ballmaschine. Niemand verlangt das von dir."),
  choices:[{label:"Jeden Tag",hint:"",roll:[{p:1,text:"Nach einem halben Jahr merkt es jeder. Auch der Trainer.",fx:{dev:0,pot:2,trust:14,fitness:-5,note:.08}}]},
    {label:"Zweimal die Woche",hint:"",roll:[{p:1,text:"Vernünftiges Maß, spürbarer Effekt.",fx:{pot:1,trust:8}}]},
    {label:"Ausschlafen",hint:"",roll:[{p:1,text:"Erholung ist auch Training, sagst du dir.",fx:{fitness:7}}]}]},
{ id:"al_reisekader", tag:"Sportlich", w:5, ph:3, cond:p=>p.age>=19&&p.seasons.length>=1, title:T("Nicht im Reisekader"),
  text:T("Der Bus fährt ohne dich. Du erfährst es aus einer Liste am schwarzen Brett, nicht vom Trainer."),
  choices:[{label:"Ihn darauf ansprechen",hint:"",roll:[{p:.65,text:"Er entschuldigt sich für die Form und erklärt die Gründe. Ab dann redet er vorher mit dir.",fx:{trust:12,morale:6}},
    {p:.35,text:"Er sagt, so laufe das hier. Punkt.",fx:{trust:-8,morale:-10}}]},
    {label:"Schlucken und trainieren",hint:"",roll:[{p:1,text:"Am Montag bist du der Erste auf dem Platz.",fx:{form:8,trust:6,morale:-4}}]}]},
{ id:"al_ausruestung", tag:"Alltag", w:5, ph:2, cond:p=>p.age>=17, title:T("Neue Schuhe, neues Gefühl"),
  text:T("Der Ausrüster bringt ein Modell, das leichter ist und weniger Dämpfung hat. Die halbe Liga läuft damit."),
  choices:[{label:"Umsteigen",hint:"",roll:[{p:.55,text:"Nach zwei Wochen Eingewöhnung fühlst du dich schneller. Bist du auch.",fx:{pac:3,dri:2}},
    {p:.45,text:"Deine Achillessehne verträgt die fehlende Dämpfung nicht.",fx:{injuryProne:10,fitness:-6}}]},
    {label:"Beim alten Modell bleiben",hint:"",roll:[{p:1,text:"Du lässt dir dein Modell nachproduzieren. Kostet, funktioniert.",fx:{money:-.02,injuryProne:-4}}]}]},
{ id:"al_platzwart", tag:"Verein", w:4, ph:3, cond:p=>p.seasons.length>=1, title:T("Der Platzwart geht in Rente"),
  text:T("Vierzig Jahre auf demselben Gelände. Er kennt jeden Spieler seit den Achtzigern beim Vornamen."),
  choices:[{label:"Eine Abschiedsfeier organisieren",hint:"",roll:[{p:1,text:"Du sammelst im Kader, mietest einen Saal und hältst die Rede. Er weint, du auch ein bisschen.",fx:{money:-.02,trust:16,morale:12,legacy:8,rep:6}}]},
    {label:"Unterschriebenes Trikot",hint:"",roll:[{p:1,text:"Er hängt es sich in den Flur.",fx:{trust:8,morale:6}}]}]},
{ id:"al_wintervorbereitung", tag:"Vorbereitung", w:5, ph:4, cond:p=>p.seasons.length>=1, title:T("Trainingslager im Januar"),
  text:T("Zehn Tage in der Wärme, zweimal täglich, dazu Laktattests am dritten und am neunten Tag."),
  choices:[{label:"An die Grenze gehen",hint:"",roll:[{p:.7,text:"Deine Werte am neunten Tag sind die besten des Kaders. Die Rückrunde wird deine stärkste Phase.",fx:{fitness:14,phy:3,form:12,trust:12}},
    {p:.3,text:"Am siebten Tag macht die Muskulatur zu.",fx:{forceInjury:"leicht",fitness:-6}}]},
    {label:"Dosiert arbeiten",hint:"",roll:[{p:1,text:"Du kommst gesund und ordentlich vorbereitet zurück.",fx:{fitness:8,injuryProne:-4}}]}]},
{ id:"al_zeugwart", tag:"Kabine", w:4, ph:3, title:T("Deine Trikots verschwinden"),
  text:T("Nach jedem Spiel fehlt eins. Der Zeugwart sagt, das passiere im ganzen Kader, aber bei dir am häufigsten."),
  choices:[{label:"Es laufen lassen",hint:"",roll:[{p:1,text:"Irgendwo hängen sie an Wänden von Leuten, denen sie mehr bedeuten als dir.",fx:{morale:5,rep:4}}]},
    {label:"Nachforschen",hint:"",roll:[{p:.5,text:"Ein Praktikant verkauft sie im Netz. Der Verein kündigt ihm.",fx:{trust:6,morale:-4}},
      {p:.5,text:"Es klärt sich nie, und du hast dir Feinde in der Kabine gemacht.",fx:{trust:-10}}]}]},
{ id:"al_schiedsrichtergespraech", tag:"Sportlich", w:5, ph:3, cond:p=>p.age>=22, title:T("Aussprache mit dem Schiedsrichter"),
  text:T("Der Verband lädt Kapitäne und erfahrene Spieler zu einem Abend mit den Unparteiischen ein."),
  choices:[{label:"Hingehen und zuhören",hint:"",roll:[{p:1,text:"Du verstehst zum ersten Mal, wie sie entscheiden. Ab jetzt reklamierst du weniger und bekommst mehr.",fx:{note:.08,trust:8,rep:5}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Freier Abend, unveränderte Situation.",fx:{fitness:3}}]}]},
{ id:"al_kapitaensrat", tag:"Führung", w:5, ph:2, cond:p=>p.age>=24&&p.trust>=52, title:T("Wahl des Mannschaftsrats"),
  text:T("Vier Plätze, zwölf Kandidaten, geheime Abstimmung in der Kabine."),
  choices:[{label:"Kandidieren",hint:"",roll:[{p:.6,text:"Du wirst mit der zweitmeisten Stimmenzahl gewählt. Ab jetzt sitzt du bei jedem wichtigen Gespräch dabei.",fx:{trust:16,rep:8,morale:10,flag:"vize"}},
    {p:.4,text:"Du bekommst drei Stimmen. Das sagt dir mehr über deinen Stand, als dir lieb ist.",fx:{morale:-10,trust:-4}}]},
    {label:"Nicht antreten",hint:"",roll:[{p:1,text:"Du willst spielen, nicht verwalten.",fx:{form:6}}]}]},
{ id:"al_jugendtraining", tag:"Verein", w:5, ph:2, cond:p=>p.age>=25, title:T("Eine Einheit mit der U15"),
  text:T("Der Nachwuchsleiter fragt, ob du eine Einheit übernimmst. Vierzig Kinder, die dich seit Jahren im Fernsehen sehen."),
  choices:[{label:"Machen",hint:"",roll:[{p:1,text:"Neunzig Minuten, in denen du mehr über dein eigenes Spiel lernst als in einem Monat Videoanalyse.",fx:{note:.06,legacy:10,rep:8,morale:10}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Du hast an dem Tag frei und willst ihn auch frei haben.",fx:{fitness:4}}]}]},
{ id:"al_dopingaufklaerung", tag:"Alltag", w:4, ph:2, cond:p=>p.age>=18, title:T("Schulung zu Nahrungsergänzung"),
  text:T("Der Verbandsarzt zeigt eine Liste mit Präparaten, die im Netz frei verkäuflich sind und trotzdem gesperrte Stoffe enthalten."),
  choices:[{label:"Alles über den Verein beziehen",hint:"",roll:[{p:1,text:"Umständlicher, aber du wirst nie ein Problem haben.",fx:{trust:8,flag:"sauber"}}]},
    {label:"Weiter selbst einkaufen",hint:"",roll:[{p:.85,text:"Nichts passiert.",fx:{}},
      {p:.15,text:"Ein Präparat schlägt in der Kontrolle an. Du kommst mit einer Verwarnung davon.",fx:{rep:-12,suspend:4,morale:-14}}]}]},
{ id:"al_fanpost", tag:"Fans", w:4, ph:3, cond:p=>p.rep>=35, title:T("Ein Sack voller Post"),
  text:T("Die Geschäftsstelle stellt dir zweimal im Jahr eine Kiste hin. Zeichnungen, Briefe, Autogrammkarten mit Rückumschlag."),
  choices:[{label:"Alles beantworten",hint:"",roll:[{p:1,text:"Drei Abende Arbeit. Manche dieser Briefe heben Familien ihr Leben lang auf.",fx:{rep:10,morale:10,legacy:6,fitness:-2}}]},
    {label:"Die Geschäftsstelle machen lassen",hint:"",roll:[{p:1,text:"Vorgedruckte Karten mit gedruckter Unterschrift. Besser als nichts.",fx:{rep:3}}]}]},
{ id:"al_sprachkurs", tag:"Alltag", w:5, ph:2, cond:p=>p.club.c!==p.nation.id&&!p.flags.sprache2, title:T("Der Verein zahlt einen Sprachkurs"),
  text:T("Dreimal die Woche, morgens vor dem Training. Freiwillig, aber sie führen eine Anwesenheitsliste."),
  choices:[{label:"Regelmäßig hingehen",hint:"",roll:[{p:1,text:"Nach einem Jahr gibst du dein erstes Interview in der Landessprache. Das Stadion applaudiert.",fx:{rep:12,trust:14,morale:10,flag:"sprache2"}}]},
    {label:"Unregelmäßig",hint:"",roll:[{p:1,text:"Du verstehst das Wichtigste. Beim Rest lächelst du.",fx:{trust:-4}}]}]},
{ id:"al_sponsorentermin", tag:"Geschäft", w:5, ph:2, cond:p=>p.rep>=38, title:T("Sechs Termine an einem freien Tag"),
  text:T("Autogrammstunde, Fotoshooting, zwei Interviews, ein Sponsorenessen, eine Autoübergabe. Der Verein hat es so geplant."),
  choices:[{label:"Alles mitnehmen",hint:"",roll:[{p:1,text:"Ein voller Tag ohne Erholung. Der Verein rechnet es dir hoch an, dein Körper nicht.",fx:{money:.1,trust:12,fitness:-8}}]},
    {label:"Die Hälfte absagen",hint:"",roll:[{p:1,text:"Du sagst, du brauchst den Tag. Die Marketingabteilung ist wenig begeistert.",fx:{fitness:6,trust:-6,money:.04}}]}]},
{ id:"al_saisonabschluss", tag:"Kabine", w:5, ph:1, cond:p=>p.seasons.length>=1, title:T("Abschlussfeier der Mannschaft"),
  text:T("Nach dem letzten Spieltag, alle zusammen, ohne Handys. Manche sieht man danach nie wieder."),
  choices:[{label:"Bis zum Schluss bleiben",hint:"",roll:[{p:1,text:"Um vier Uhr morgens sitzt ihr zu acht da und redet über Dinge, die im Trainingsalltag nie zur Sprache kommen.",fx:{trust:14,morale:14,fitness:-5}}]},
    {label:"Früh gehen",hint:"",roll:[{p:1,text:"Du fährst nach zwei Stunden. Niemand nimmt es dir übel, aber gefehlt hast du.",fx:{fitness:4,trust:-4}}]}]},

/* ============ ERWACHSENWERDEN ============ */
{ id:"ew_steuer", tag:"Alltag", w:6, ph:2, cond:p=>p.age>=19&&p.money>=.15, title:T("Die erste Steuererklärung"),
  text:T("Ein Umschlag vom Finanzamt und Zahlen, die du noch nie gesehen hast. Ein Mitspieler empfiehlt seinen Berater."),
  choices:[{label:"Fachmann beauftragen",hint:"",roll:[{p:1,text:"Kostet, spart aber mehr, als es kostet, und schützt dich vor Ärger.",fx:{money:-.03,flag:"steuerberater",morale:8}}]},
    {label:"Selbst versuchen",hint:"",roll:[{p:.5,text:"Es geht gut. Zwei Wochenenden dafür, aber du verstehst jetzt, wo dein Geld hingeht.",fx:{money:.02,morale:5}},
      {p:.5,text:"Ein Fehler, eine Nachzahlung, ein sehr unangenehmer Brief.",fx:{money:-.12,morale:-10}}]}]},
{ id:"ew_wohnung", tag:"Alltag", w:5, ph:2, cond:p=>p.age>=21&&p.money>=.4&&!p.assets.includes("wohnung"), title:T("Mieten oder kaufen"),
  text:T("Dein Berater sagt kaufen, deine Mutter sagt kaufen, dein Steuerberater sagt, es kommt darauf an, wie lange du bleibst."),
  choices:[{label:"Kaufen",hint:"Sofort im Besitz",roll:[{p:1,text:"Zum ersten Mal gehört dir etwas Größeres als ein Auto.",fx:{buyAsset:"wohnung",money:-.4,morale:14}}]},
    {label:"Mieten",hint:"",roll:[{p:1,text:"Flexibel bleiben, sagst du dir. Im Fußball ist das selten falsch.",fx:{morale:4}}]}]},
{ id:"ew_altefreunde", tag:"Umfeld", w:6, ph:2, cond:p=>p.age>=20&&p.money>=.5, title:T("Der Freundeskreis von früher"),
  text:T("Sie verdienen in einem Jahr, was du in einem Monat bekommst. Beim Bezahlen wird es jedes Mal seltsam."),
  choices:[{label:"Immer einladen",hint:"",roll:[{p:.55,text:"Sie nehmen es an, und irgendwann ist es normal. Ihr bleibt Freunde.",fx:{money:-.06,morale:12}},
    {p:.45,text:"Es entsteht ein Gefälle, das keiner ausspricht. Zwei melden sich nicht mehr.",fx:{money:-.06,morale:-10}}]},
    {label:"Getrennt zahlen wie früher",hint:"",roll:[{p:1,text:"Ein bisschen unangenehm, dafür ehrlich. Genau deshalb bleiben sie.",fx:{morale:10,legacy:4}}]}]},
{ id:"ew_verantwortung", tag:"Umfeld", w:5, ph:2, cond:p=>p.age>=22&&p.money>=1, title:T("Dein Bruder braucht einen Job"),
  text:T("Er fragt, ob du ihn als Fahrer und Assistent anstellen kannst. Er ist zuverlässig, aber es ist dein Bruder."),
  choices:[{label:"Anstellen",hint:"",roll:[{p:.55,text:"Es funktioniert. Er hält dir alles vom Leib, und du hast jemanden, dem du vollständig vertraust.",fx:{money:-.1,morale:14,fitness:4}},
    {p:.45,text:"Nach einem Jahr redet ihr nur noch über Termine. Die Beziehung leidet.",fx:{money:-.1,morale:-12}}]},
    {label:"Ihm woanders helfen",hint:"",roll:[{p:1,text:"Du zahlst ihm eine Ausbildung statt ein Gehalt. Klüger, sagt später auch er.",fx:{money:-.06,morale:8,legacy:4}}]}]},
{ id:"ew_erstesauto", tag:"Alltag", w:5, ph:2, cond:p=>p.age>=19&&p.age<=24&&p.money>=.2, title:T("Der Wagen auf dem Spielerparkplatz"),
  text:T("Die Etablierten fahren große deutsche Autos. Dein Wagen ist elf Jahre alt und hat eine Delle in der Beifahrertür."),
  choices:[{label:"Aufrüsten",hint:"",roll:[{p:1,text:"Du kaufst dir etwas Schnelles. Es fühlt sich zwei Wochen großartig und danach normal an.",fx:{money:-.15,morale:10,rep:4}}]},
    {label:"Den alten behalten",hint:"",roll:[{p:1,text:"Du parkst weiter neben Sportwagen. Die Kurve findet das grandios.",fx:{rep:8,morale:6,money:.01}}]}]},
{ id:"ew_beraterwechsel", tag:"Geschäft", w:6, ph:2, cond:p=>p.age>=20&&p.rep>=35, title:T("Eine große Agentur wirbt um dich"),
  text:T("Dein bisheriger Berater ist der Onkel deines besten Freundes. Die Agentur hat vierzig Nationalspieler im Portfolio."),
  choices:[{label:"Wechseln",hint:"",roll:[{p:.65,text:"Plötzlich öffnen sich Türen, von denen du nicht wusstest, dass es sie gibt.",fx:{offers:1,wageMult:.1,rep:8,morale:-6,flag:"berater"}},
    {p:.35,text:"Du bist einer von vierzig. Der Rückruf dauert jetzt drei Tage.",fx:{morale:-10,trust:-4}}]},
    {label:"Treu bleiben",hint:"",roll:[{p:1,text:"Er hat an dich geglaubt, als es niemand tat. Das zählt.",fx:{morale:12,legacy:6}}]}]},
{ id:"ew_lebensplan", tag:"Zukunft", w:5, ph:2, cond:p=>p.age>=23&&p.age<=30, title:T("Was kommt danach?"),
  text:T("Ein ehemaliger Mitspieler, mit dreiunddreißig aufgehört, sitzt seit zwei Jahren zu Hause und weiß nicht wohin."),
  choices:[{label:"Nebenbei etwas aufbauen",hint:"",roll:[{p:1,text:"Zwei Abende pro Woche für etwas, das nichts mit Fußball zu tun hat. Es beruhigt ungemein.",fx:{legacy:12,morale:10,fitness:-3,flag:"plan_b"}}]},
    {label:"Erst mal spielen",hint:"",roll:[{p:1,text:"Du willst dich nicht ablenken lassen. Verständlich.",fx:{form:6}}]}]},
{ id:"ew_therapie", tag:"Umfeld", w:5, ph:2, cond:p=>p.morale<=42&&p.age>=19, title:T("Es geht dir nicht gut"),
  text:T("Nicht sportlich. Du schläfst schlecht, freust dich auf nichts, und der Weg zum Training fühlt sich schwer an."),
  choices:[{label:"Hilfe holen",hint:"",roll:[{p:1,text:"Der Verein vermittelt jemanden, mit dem du reden kannst. Nach drei Monaten geht es dir merklich besser.",fx:{morale:24,form:8,fitness:5,legacy:6}}]},
    {label:"Allein durch",hint:"",roll:[{p:.35,text:"Es wird von selbst wieder besser.",fx:{morale:8}},
      {p:.65,text:"Es wird schlechter, bevor es besser wird. Eine halbe Saison geht dabei verloren.",fx:{morale:-14,form:-12,fitness:-8}}]}]},
{ id:"ew_ausbildung", tag:"Zukunft", w:5, ph:2, cond:p=>p.age>=19&&p.age<=26&&!p.flags.abschluss, title:T("Fernstudium neben dem Profivertrag"),
  text:T("Die Spielergewerkschaft bietet Studiengänge an, die auf Trainingszeiten Rücksicht nehmen."),
  choices:[{label:"Einschreiben",hint:"",roll:[{p:1,text:"Vier Jahre lang zwei Abende pro Woche. Am Ende hast du etwas, das dir niemand nehmen kann.",fx:{flag:"abschluss",legacy:14,morale:8,fitness:-4}}]},
    {label:"Nicht jetzt",hint:"",roll:[{p:1,text:"Später vielleicht. Sagen viele.",fx:{}}]}]},
{ id:"ew_heimatbesuch", tag:"Umfeld", w:5, ph:2, cond:p=>p.club.c!==p.nation.id&&p.age>=20, title:T("Zwei Wochen zu Hause"),
  text:T("Die einzige längere Pause im Jahr. Alle wollen dich sehen, und die Liste ist länger als die Zeit."),
  choices:[{label:"Alle abarbeiten",hint:"",roll:[{p:1,text:"Vierzehn Tage Termine statt Urlaub. Alle sind glücklich außer deinem Körper.",fx:{morale:12,fitness:-9}}]},
    {label:"Nur die Familie",hint:"",roll:[{p:1,text:"Du sagst den Rest ab und schläfst zwölf Stunden am Tag. Ein paar sind beleidigt.",fx:{fitness:12,morale:8,rep:-4}}]}]},
{ id:"ew_vorbild", tag:"Umfeld", w:5, ph:3, cond:p=>p.rep>=45&&p.age>=22, title:T("Jemand ahmt dich nach"),
  text:T("Ein Sechzehnjähriger aus dem Nachwuchs trägt deine Frisur, deine Schuhe und feiert wie du. Der Nachwuchsleiter erzählt es dir grinsend."),
  choices:[{label:"Ihn ernst nehmen",hint:"",roll:[{p:1,text:"Du nimmst ihn mit ins Krafttraining und sagst ihm, was du mit sechzehn falsch gemacht hast.",fx:{legacy:14,trust:10,morale:10}}]},
    {label:"Es lustig finden",hint:"",roll:[{p:1,text:"Du machst einen Witz darüber in der Kabine. Er lacht mit und schaut danach anders.",fx:{morale:4,legacy:-3}}]}]},
/* ============ ZWIELICHTIG UND NEGATIV ============ */
{ id:"zw_wettanbieter", tag:"Zwielichtig", w:5, ph:3, cond:p=>p.age>=20&&p.rep>=30, title:T("Ein Wettanbieter zahlt für Informationen"),
  text:T("Kein Ergebnis manipulieren, sagen sie. Nur wissen, wer verletzt ist, bevor es öffentlich wird. Fünfstellig pro Monat."),
  choices:[{label:"Ablehnen und melden",hint:"",roll:[{p:1,text:"Der Verband ermittelt, du bist raus aus der Sache und hast dir Respekt verdient.",fx:{rep:12,trust:14,legacy:8,morale:6}}]},
    {label:"Ein paar Monate mitmachen",hint:"",roll:[{p:.55,text:"Niemand merkt es. Das Geld liegt auf einem Konto, über das du mit niemandem sprichst.",fx:{money:.4,morale:-8,flag:"wetten"}},
      {p:.45,text:"Der Chatverlauf landet bei den Ermittlern. Sechs Monate Sperre und ein Ruf, der bleibt.",fx:{suspend:22,rep:-30,trust:-30,morale:-22,forceTransfer:true}}]}]},
{ id:"zw_gelbekarte", tag:"Zwielichtig", w:5, ph:3, cond:p=>p.age>=21, title:T("Eine Gelbe Karte auf Bestellung"),
  text:T("Jemand bietet dir Geld dafür, dich in einem bedeutungslosen Spiel absichtlich verwarnen zu lassen. Sportlich ändert es nichts."),
  choices:[{label:"Ablehnen",hint:"",roll:[{p:1,text:"Du sagst nein und erzählst es dem Mannschaftsrat. Das war die einzig richtige Reihenfolge.",fx:{trust:10,rep:6,morale:4}}]},
    {label:"Machen",hint:"",roll:[{p:.6,text:"Ein Foul in der 70. Minute, Gelb, fertig. Niemand fragt nach.",fx:{money:.18,morale:-10,flag:"wetten"}},
      {p:.4,text:"Die Wettmuster fallen auf. Der Verband lädt dich vor, und der Verein stellt dich frei.",fx:{suspend:14,rep:-26,trust:-28,forceTransfer:true,morale:-18}}]}]},
{ id:"zw_steuermodell", tag:"Zwielichtig", w:5, ph:2, cond:p=>p.money>=2, title:T("Ein Modell, das zu gut klingt"),
  text:T("Bildrechte über eine Gesellschaft im Ausland. Völlig legal, sagt der Vermittler, das machen alle."),
  choices:[{label:"Vom eigenen Steuerberater prüfen lassen",hint:"",roll:[{p:1,text:"Er zerlegt das Modell in zwanzig Minuten. Du zahlst mehr Steuern und schläfst besser.",fx:{money:-.2,morale:8,flag:"sauber"}}]},
    {label:"Einsteigen",hint:"",roll:[{p:.55,text:"Es läuft. Deine Steuerlast sinkt spürbar.",fx:{money:1.2,flag:"steuermodell"}},
      {p:.45,text:"Vier Jahre später steht die Steuerfahndung vor der Tür. Nachzahlung, Strafe, Schlagzeilen.",fx:{money:-2.4,rep:-22,morale:-20}}]}]},
{ id:"zw_pokerabend", tag:"Zwielichtig", w:5, ph:3, cond:p=>p.age>=21&&p.money>=.6, title:T("Die Runde spielt um echtes Geld"),
  text:T("Jede zweite Woche, immer dieselben acht Leute, und die Einsätze steigen seit einem halben Jahr."),
  choices:[{label:"Aussteigen",hint:"",roll:[{p:1,text:"Du sagst, dir wird es zu viel. Zwei lachen dich aus, einer bedankt sich später bei dir.",fx:{morale:6,money:.02}}]},
    {label:"Weiterspielen",hint:"",roll:[{p:.45,text:"Ein guter Abend. Du gehst mit einem Monatsgehalt nach Hause.",fx:{money:.35,morale:8,flag:"poker"}},
      {p:.55,text:"Drei schlechte Abende hintereinander und eine Summe, die du niemandem nennen willst.",fx:{money:-.9,morale:-16,fitness:-6,flag:"poker"}}]}]},
{ id:"zw_schuldner", tag:"Zwielichtig", w:4, ph:3, cond:p=>p.flags.poker||p.flags.wetten, title:T("Jemand will sein Geld"),
  text:T("Zwei Männer warten am Trainingsgelände. Sie sind höflich und lassen keinen Zweifel daran, dass sie wiederkommen."),
  choices:[{label:"Sofort begleichen",hint:"",roll:[{p:1,text:"Du zahlst noch am selben Tag alles zurück und hörst nie wieder von ihnen.",fx:{money:-.7,morale:-8,fitness:-4}}]},
    {label:"Den Verein einschalten",hint:"",roll:[{p:.6,text:"Die Rechtsabteilung regelt es. Unangenehm, aber sauber.",fx:{money:-.35,trust:-14,rep:-8}},
      {p:.4,text:"Die Geschichte landet in der Zeitung.",fx:{money:-.35,rep:-20,trust:-18,morale:-16}}]}]},
{ id:"zw_praeparat", tag:"Zwielichtig", w:4, ph:2, cond:p=>p.age>=22&&p.injuryProne>=45&&!p.flags.sauber, title:T("Etwas, das schneller heilen lässt"),
  text:T("Ein Bekannter eines Mitspielers verspricht halbierte Ausfallzeiten. Auf der Verpackung steht nichts, was du nachschlagen könntest."),
  choices:[{label:"Finger weg",hint:"",roll:[{p:1,text:"Du gibst es zurück und meldest es dem Mannschaftsarzt.",fx:{trust:10,rep:5,flag:"sauber"}}]},
    {label:"Ausprobieren",hint:"",roll:[{p:.5,text:"Es wirkt tatsächlich. Du bist schneller zurück als angekündigt.",fx:{injuryProne:-16,fitness:10,morale:-4}},
      {p:.5,text:"Positive Probe. Zwei Jahre Sperre wären möglich, es werden acht Monate.",fx:{suspend:26,rep:-34,trust:-30,morale:-26,forceTransfer:true}}]}]},
{ id:"zw_schwarzarbeit", tag:"Zwielichtig", w:4, ph:2, cond:p=>p.money>=1.5, title:T("Handwerker ohne Rechnung"),
  text:T("Die Renovierung wäre dreißig Prozent günstiger. Der Meister sagt, das mache er bei allen so."),
  choices:[{label:"Auf Rechnung bestehen",hint:"",roll:[{p:1,text:"Teurer, aber vollständig dokumentiert. Bei deinem Einkommen ist alles andere Wahnsinn.",fx:{money:-.3,morale:5}}]},
    {label:"Bar bezahlen",hint:"",roll:[{p:.7,text:"Niemand fragt je danach.",fx:{money:-.18}},
      {p:.3,text:"Eine Betriebsprüfung beim Handwerker bringt deinen Namen in eine Akte.",fx:{money:-.5,rep:-10,morale:-10}}]}]},
{ id:"zw_vertrauensbruch", tag:"Zwielichtig", w:5, ph:3, cond:p=>p.age>=22&&p.trust<=50, title:T("Ein Reporter bietet Geld für Interna"),
  text:T("Aufstellung vor der Bekanntmachung, Streit in der Kabine, medizinische Details. Bar, anonym, regelmäßig."),
  choices:[{label:"Ablehnen",hint:"",roll:[{p:1,text:"Du sagst ihm, er solle sich einen anderen suchen. Er tut es vermutlich.",fx:{trust:8,morale:4}}]},
    {label:"Zuträger werden",hint:"",roll:[{p:.5,text:"Über Monate fließen kleine Summen. Niemand kommt darauf.",fx:{money:.25,morale:-10,flag:"maulwurf"}},
      {p:.5,text:"Der Verein lässt die Handys prüfen. Du fliegst auf.",fx:{trust:-32,rep:-18,suspend:6,forceTransfer:true,morale:-20}}]}]},
{ id:"zw_agentendruck", tag:"Zwielichtig", w:5, ph:2, cond:p=>p.rep>=45&&p.age>=22, title:T("Dein Berater will einen Wechsel erzwingen"),
  text:T("Er streut gezielt Gerüchte über Unzufriedenheit, die du nie geäußert hast. Die Provision wäre erheblich."),
  choices:[{label:"Ihn zurückpfeifen",hint:"",roll:[{p:1,text:"Du stellst öffentlich klar, dass das nicht von dir kam. Der Verein weiß das zu schätzen.",fx:{trust:18,rep:8,morale:6}}]},
    {label:"Ihn machen lassen",hint:"",roll:[{p:.5,text:"Es funktioniert. Ein größerer Verein meldet sich.",fx:{dreamOffer:true,trust:-16,rep:-6}},
      {p:.5,text:"Der Verein durchschaut es und stellt dich kalt.",fx:{trust:-24,suspend:6,forceTransfer:true,morale:-14}}]}]},
{ id:"zw_unfall", tag:"Risiko", w:4, ph:3, cond:p=>p.age>=19&&p.assets.some(a=>["auto1","auto2","auto3"].includes(a)), title:T("Zu schnell auf nasser Straße"),
  text:T("Niemand verletzt, aber der Wagen ist Schrott und die Polizei hat die Geschwindigkeit gemessen."),
  choices:[{label:"Sofort öffentlich einräumen",hint:"",roll:[{p:1,text:"Du entschuldigst dich, zahlst die Strafe und lässt den Führerschein ruhen. Das nimmt der Sache viel.",fx:{money:-.15,rep:-6,morale:-8,trust:4}}]},
    {label:"Es kleinreden",hint:"",roll:[{p:.4,text:"Es dringt nicht nach außen.",fx:{money:-.12,morale:-5}},
      {p:.6,text:"Ein Foto vom Unfallort kursiert. Der Verein verhängt eine interne Strafe.",fx:{money:-.25,rep:-16,trust:-14,morale:-12}}]}]},
{ id:"zw_nachtclub", tag:"Zwielichtig", w:5, ph:3, cond:p=>p.age>=19&&p.age<=28, title:T("Video aus einem Club um vier Uhr morgens"),
  text:T("Zwei Tage vor einem wichtigen Spiel. Das Video ist nicht schlimm, aber es zeigt eindeutig dich und eindeutig die Uhrzeit."),
  choices:[{label:"Von selbst zum Trainer gehen",hint:"",roll:[{p:1,text:"Du legst es ihm hin, bevor er es woanders sieht. Eine Geldstrafe, ein Gespräch, erledigt.",fx:{money:-.06,trust:6,morale:-6}}]},
    {label:"Abwarten",hint:"",roll:[{p:.4,text:"Es verläuft im Sande.",fx:{morale:-4}},
      {p:.6,text:"Es steht am Spieltag in der Zeitung. Du wirst suspendiert.",fx:{suspend:3,rep:-14,trust:-18,morale:-12}}]}]},
{ id:"zw_investment", tag:"Zwielichtig", w:5, ph:2, cond:p=>p.money>=2.5, title:T("Ein Mitspieler hat einen todsicheren Tipp"),
  text:T("Immobilienprojekt im Ausland, zwölf Prozent Rendite garantiert, Einstieg nur diese Woche."),
  choices:[{label:"Ablehnen",hint:"",roll:[{p:1,text:"Du sagst, garantierte zwölf Prozent gibt es nicht. Zwei Jahre später bedankt er sich dafür.",fx:{morale:6,legacy:4}}]},
    {label:"Einsteigen",hint:"",roll:[{p:.3,text:"Es läuft tatsächlich. Nach drei Jahren hast du dein Geld verdoppelt.",fx:{money:2.2,morale:12}},
      {p:.7,text:"Das Projekt existiert nur auf dem Papier. Das Geld ist weg, der Vermittler auch.",fx:{money:-2,morale:-22,rep:-6}}]}]},
{ id:"zw_erpressung", tag:"Zwielichtig", w:4, ph:3, cond:p=>p.rep>=50&&p.age>=23, title:T("Jemand hat Fotos"),
  text:T("Private Aufnahmen, entstanden in einem Moment, in dem du nicht an Kameras gedacht hast. Der Betrag ist sechsstellig."),
  choices:[{label:"Anzeige erstatten",hint:"",roll:[{p:.75,text:"Die Polizei greift zu. Die Sache wird nie öffentlich, und du hast richtig gehandelt.",fx:{morale:-6,trust:8,rep:4}},
    {p:.25,text:"Es kommt trotzdem heraus. Unangenehm, aber du stehst als jemand da, der sich nicht erpressen lässt.",fx:{rep:-8,morale:-14,legacy:6}}]},
    {label:"Zahlen",hint:"",roll:[{p:.45,text:"Ruhe. Vorerst.",fx:{money:-.8,morale:-14}},
      {p:.55,text:"Ein halbes Jahr später kommt die nächste Forderung.",fx:{money:-1.6,morale:-22,rep:-10}}]}]},
{ id:"zw_transferrecht", tag:"Zwielichtig", w:4, ph:2, cond:p=>p.age<=24&&p.ovr>=68, title:T("Ein Fonds will Anteile an deinen Transferrechten"),
  text:T("Sofort eine hohe Summe, dafür ein Anteil an jeder künftigen Ablöse. Verboten ist es nicht überall."),
  choices:[{label:"Ablehnen",hint:"",roll:[{p:1,text:"Du willst dir selbst gehören. Das kostet heute Geld und spart später Ärger.",fx:{morale:8,legacy:6}}]},
    {label:"Verkaufen",hint:"",roll:[{p:.5,text:"Das Geld verändert dein Leben. Später wird es teuer, aber jetzt hilft es der Familie.",fx:{money:1.6,morale:10,flag:"rechte_weg"}},
      {p:.5,text:"Der Fonds blockiert deinen Wunschwechsel, weil ihm die Ablöse zu niedrig ist.",fx:{money:1.6,trust:-10,morale:-16,flag:"rechte_weg"}}]}]},
{ id:"zw_rechteblock", tag:"Zwielichtig", w:4, ph:2, cond:p=>!!p.flags.rechte_weg&&p.ovr>=72, title:T("Der Fonds redet mit"),
  text:T("Ein Verein hat angefragt, du wärst einverstanden. Der Fonds sagt nein, weil die Summe seine Rendite nicht trifft."),
  choices:[{label:"Anteile zurückkaufen",hint:"",roll:[{p:1,text:"Teuer, aber ab heute entscheidest wieder du allein über deine Laufbahn.",fx:{money:-2.2,morale:16,legacy:8}}]},
    {label:"Abwarten",hint:"",roll:[{p:1,text:"Der Wechsel platzt. Du spielst ein weiteres Jahr, wo du nicht mehr sein willst.",fx:{morale:-16,trust:-6,form:-6}}]}]},
{ id:"zw_falschesalter", tag:"Zwielichtig", w:3, ph:2, cond:p=>p.age<=21&&NAT_CONF[p.nation.id]!=="UEFA", title:T("Jemand schlägt vor, dein Alter zu ändern"),
  text:T("Zwei Jahre jünger auf dem Papier wären für Wechsel nach Europa deutlich wertvoller, sagt der Vermittler."),
  choices:[{label:"Auf keinen Fall",hint:"",roll:[{p:1,text:"Du bist, wer du bist. Die Sache ist damit beendet.",fx:{morale:8,legacy:8,rep:4}}]},
    {label:"Zustimmen",hint:"",roll:[{p:.45,text:"Niemand prüft nach. Dein Marktwert steigt spürbar.",fx:{money:.4,rep:10,flag:"altersluege"}},
      {p:.55,text:"Ein Verband gleicht Daten ab. Ein Jahr Sperre und eine Geschichte, die dir ewig anhängt.",fx:{suspend:20,rep:-28,trust:-20,morale:-20}}]}]},
{ id:"zw_glaubwuerdig", tag:"Medien", w:4, ph:3, cond:p=>p.flags.altersluege||p.flags.wetten||p.flags.maulwurf, title:T("Eine alte Geschichte kommt hoch"),
  text:T("Ein Journalist recherchiert seit Monaten und legt dir Unterlagen vor, die du längst vergessen glaubtest."),
  choices:[{label:"Alles zugeben",hint:"",roll:[{p:1,text:"Du erzählst offen, wie es dazu kam. Die Reaktionen sind härter als gehofft und milder als befürchtet.",fx:{rep:-12,morale:-10,trust:6,legacy:4}}]},
    {label:"Bestreiten",hint:"",roll:[{p:.35,text:"Ohne Beweise verläuft die Sache.",fx:{rep:-4,morale:-6}},
      {p:.65,text:"Zwei Wochen später kommen die Belege. Jetzt ist es doppelt schlimm.",fx:{rep:-26,trust:-20,morale:-20,forceTransfer:true}}]}]},

/* ============ WEITERE NEGATIVE WENDUNGEN ============ */
{ id:"ng_formtief", tag:"Sportlich", w:6, ph:3, cond:p=>p.form<=52&&p.seasons.length>=1, title:T("Acht Wochen ohne gutes Spiel"),
  text:T("Kein Selbstvertrauen, keine Bindung zum Ball, und die eigenen Fans stöhnen bei jeder Annahme."),
  choices:[{label:"Um eine Pause bitten",hint:"",roll:[{p:1,text:"Drei Spiele Bank, danach kommst du befreit zurück.",fx:{form:14,trust:-4,morale:6}}]},
    {label:"Weiterspielen",hint:"",roll:[{p:.4,text:"Du spielst dich frei. Genau so muss es gehen.",fx:{form:14,trust:10,morale:10}},
      {p:.6,text:"Es wird schlimmer, und irgendwann setzt der Trainer dich sowieso.",fx:{form:-10,trust:-12,morale:-12}}]}]},
{ id:"ng_pfeifkonzert", tag:"Fans", w:5, ph:3, cond:p=>p.lastNote>=3.6&&p.seasons.length>=1, title:T("Pfiffe bei deiner Auswechslung"),
  text:T("Nicht die ganze Kurve, aber genug, dass man es hört. Du gehst mit gesenktem Kopf vom Platz."),
  choices:[{label:"Danach vor die Kurve gehen",hint:"",roll:[{p:.6,text:"Du stellst dich hin und applaudierst. Beim nächsten Heimspiel singen sie deinen Namen.",fx:{rep:10,morale:10,form:8}},
    {p:.4,text:"Es wird lauter. Manche Situationen lassen sich nicht drehen.",fx:{rep:-6,morale:-12}}]},
    {label:"In die Kabine",hint:"",roll:[{p:1,text:"Du sagst danach nichts. Es bleibt zwischen euch stehen.",fx:{morale:-8}}]}]},
{ id:"ng_trainerfeind", tag:"Konkurrenz", w:5, ph:2, cond:p=>p.trust<=42&&p.age>=22, title:T("Der neue Trainer mag dich nicht"),
  text:T("Kein Streit, kein Vorfall. Er redet einfach nicht mit dir, und du stehst seit sechs Wochen nicht im Kader."),
  choices:[{label:"Ihn direkt fragen",hint:"",roll:[{p:.5,text:"Er sagt ehrlich, was ihm fehlt. Du arbeitest daran und spielst nach vier Wochen wieder.",fx:{trust:16,form:10,morale:8}},
    {p:.5,text:"Er weicht aus. Damit weißt du alles.",fx:{morale:-12,forceTransfer:true}}]},
    {label:"Über den Sportdirektor gehen",hint:"",roll:[{p:.35,text:"Der Sportdirektor stellt sich hinter dich.",fx:{trust:8,morale:6}},
      {p:.65,text:"Der Trainer erfährt davon. Jetzt ist es persönlich.",fx:{trust:-20,suspend:4,forceTransfer:true}}]}]},
{ id:"ng_abstiegsdruck", tag:"Verein", w:6, ph:4, cond:p=>{const s=lastS(p);return s&&s.rank>=s.N-3&&sameClub(p);}, title:T("Krisensitzung nach dem sechsten Spiel ohne Sieg"),
  text:T("Vorstand, Trainer, Mannschaftsrat, vier Stunden. Danach steht fest, dass sich etwas ändern muss."),
  choices:[{label:"Selbstkritisch vorangehen",hint:"",roll:[{p:1,text:"Du sagst als Erster, was du falsch machst. Das öffnet die Runde.",fx:{trust:16,morale:8,form:8,rep:4}}]},
    {label:"Den Trainer angreifen",hint:"",roll:[{p:.45,text:"Er wird entlassen, der Nachfolger setzt auf dich.",fx:{trust:8,form:10,rep:-4}},
      {p:.55,text:"Er bleibt, und du stehst auf seiner Liste ganz oben.",fx:{trust:-22,suspend:4,morale:-12}}]}]},
{ id:"ng_verletzungspech", tag:"Verletzung", w:5, ph:3, cond:p=>p.injuryProne>=55&&p.age>=24, title:T("Dritte Verletzung in einer Saison"),
  text:T("Immer dieselbe Muskelgruppe, immer beim Antritt. Der Arzt spricht das erste Mal von einem strukturellen Problem."),
  choices:[{label:"Alles umstellen",hint:"",roll:[{p:.7,text:"Anderes Krafttraining, andere Schuhe, anderer Schlafrhythmus. Es hört auf.",fx:{injuryProne:-22,fitness:8,pac:-1,form:-5}},
    {p:.3,text:"Es bleibt, wie es ist. Du lernst, damit zu spielen.",fx:{injuryProne:-4,morale:-12}}]},
    {label:"Weitermachen wie bisher",hint:"",roll:[{p:1,text:"Die vierte kommt im Frühjahr.",fx:{forceInjury:"mittel",injuryProne:8,morale:-14}}]}]},
{ id:"ng_kaderstreichung", tag:"Vertrag", w:5, ph:2, cond:p=>p.age>=29&&p.trust<=45, title:T("Nicht mehr im Meldebogen"),
  text:T("Für den internationalen Wettbewerb dürfen nur fünfundzwanzig Spieler gemeldet werden. Du stehst nicht darauf."),
  choices:[{label:"Es sportlich nehmen",hint:"",roll:[{p:1,text:"Du trainierst weiter, als wäre nichts, und spielst in der Liga stark.",fx:{form:10,trust:10,morale:-6}}]},
    {label:"Öffentlich Kritik üben",hint:"",roll:[{p:.4,text:"Der Druck wirkt. Nach der Winterpause wirst du nachgemeldet.",fx:{trust:6,morale:8,rep:6}},
      {p:.6,text:"Der Verein stellt klar, dass er nicht mehr plant.",fx:{trust:-18,forceTransfer:true,morale:-12}}]}]},
{ id:"ng_karriereknick", tag:"Alter", w:5, ph:1, cond:p=>p.age>=30&&p.ovr<p.peakOvr-4, title:T("Die Zahlen sagen es deutlich"),
  text:T("Sprintwerte, Zweikampfquote, Passquote. Alles zwei Jahre in Folge schlechter, und niemand redet drum herum."),
  choices:[{label:"Spielweise anpassen",hint:"",roll:[{p:1,text:"Weniger Wege, mehr Kopf. Du wirst nicht schneller, aber wieder wichtig.",fx:{pas:3,note:.1,trust:12,pac:-1}}]},
    {label:"Dagegen antrainieren",hint:"",roll:[{p:.4,text:"Ein letztes Aufbäumen, das tatsächlich funktioniert.",fx:{pac:2,phy:2,fitness:8,form:10}},
      {p:.6,text:"Der Körper macht das nicht mehr mit.",fx:{forceInjury:"mittel",fitness:-10,morale:-12}}]}]},
/* ============ NUR ALS KAPITÄN ============ */
{ id:"kp_ansprache", tag:"Führung", w:8, ph:3, cond:p=>!!p.flags.kapitaen, title:T("Deine Ansprache vor dem entscheidenden Spiel"),
  text:T("Der Trainer tritt einen Schritt zurück und sagt: «Sag du was.» Achtundzwanzig Augenpaare richten sich auf dich."),
  choices:[{label:"Emotional werden",hint:"",roll:[{p:.6,text:"Du redest zwei Minuten, und danach würde jeder für dich durch die Wand gehen. Ihr gewinnt.",fx:{form:14,trust:14,morale:14,rep:8}},
    {p:.4,text:"Es klingt aufgesetzt. Zwei schauen auf den Boden.",fx:{trust:-8,morale:-6}}]},
    {label:"Ruhig und sachlich",hint:"",roll:[{p:1,text:"Drei Punkte, klar benannt. Genau so kennen sie dich.",fx:{note:.1,trust:10,form:6}}]}]},
{ id:"kp_konflikt", tag:"Führung", w:7, ph:3, cond:p=>!!p.flags.kapitaen&&p.seasons.length>=1, title:c=>`Streit zwischen ${c.mate.name} und dem Trainer`,
  text:T("Es ist eskaliert, und beide erwarten von dir, dass du dich auf ihre Seite stellst."),
  choices:[{label:"Zur Mannschaft halten",hint:"",roll:[{p:.55,text:"Der Trainer lenkt ein. Die Kabine weiß jetzt, wofür du stehst.",fx:{trust:-6,morale:14,rep:8,legacy:6}},
    {p:.45,text:"Der Trainer merkt es sich. Zwei Spiele Bank.",fx:{trust:-16,morale:8,form:-8}}]},
    {label:"Zum Trainer halten",hint:"",roll:[{p:1,text:"Sportlich klug. In der Kabine wird es kühler.",fx:{trust:14,morale:-8}}]},
    {label:"Vermitteln",hint:"",roll:[{p:.7,text:"Du setzt beide an einen Tisch. Nach einer Stunde ist die Sache erledigt.",fx:{trust:12,morale:10,legacy:8,rep:5}},
      {p:.3,text:"Beide finden, du hättest dich entscheiden müssen.",fx:{trust:-8,morale:-6}}]}]},
{ id:"kp_vorstand", tag:"Führung", w:7, ph:2, cond:p=>!!p.flags.kapitaen&&p.age>=25, title:T("Der Vorstand lädt dich ein"),
  text:T("Ohne Trainer, ohne Sportdirektor. Man will von dir wissen, was in der Mannschaft wirklich los ist."),
  choices:[{label:"Ehrlich berichten",hint:"",roll:[{p:.6,text:"Zwei Wochen später ändert sich tatsächlich etwas. Niemand erfährt, woher es kam.",fx:{trust:10,morale:12,legacy:10}},
    {p:.4,text:"Es sickert durch, wer geredet hat.",fx:{trust:-18,morale:-12,rep:-6}}]},
    {label:"Nichts nach außen tragen",hint:"",roll:[{p:1,text:"Du sagst, das regelt die Mannschaft selbst. Der Vorstand ist unzufrieden, die Kabine erfährt es und dankt es dir.",fx:{morale:14,trust:8,rep:6}}]}]},
{ id:"kp_bindeabgabe", tag:"Führung", w:6, ph:2, cond:p=>!!p.flags.kapitaen&&p.age>=32, title:T("Ein Jüngerer wäre bereit"),
  text:T("Der Trainer fragt vorsichtig, ob du dir vorstellen könntest, die Binde weiterzugeben."),
  choices:[{label:"Freiwillig abgeben",hint:"Du bist danach nicht mehr Kapitän",roll:[{p:1,text:"Du übergibst sie vor versammelter Mannschaft. Größer kann man eine Rolle kaum beenden.",fx:{flag:"exkapitaen",legacy:22,rep:10,morale:10,trust:14}}]},
    {label:"Behalten",hint:"",roll:[{p:.55,text:"Du machst weiter und rechtfertigst es mit deiner Leistung.",fx:{trust:8,form:8}},
      {p:.45,text:"Es wirkt verbissen. Die Stimmung leidet.",fx:{morale:-10,trust:-10}}]}]},
{ id:"kp_ntbinde", tag:"Nationalteam", w:8, ph:2, cond:p=>!!p.nt.kapitaen&&!p.flags.ntbindegefeiert, title:T("Kapitän deines Landes"),
  text:c=>`Der Bundestrainer verkündet es auf einer Pressekonferenz. Zu Hause laufen die Bilder in jeder Nachrichtensendung.`,
  choices:[{label:"Die Rolle annehmen",hint:"",roll:[{p:1,text:"Du bist ab jetzt das Gesicht einer ganzen Fußballnation. Das trägt und es wiegt.",fx:{rep:20,morale:16,legacy:26,flag:"ntbindegefeiert",ntBonus:4}}]},
    {label:"Klein halten",hint:"",roll:[{p:1,text:"Du sagst, die Binde sei nur ein Stück Stoff. Genau deshalb passt sie zu dir.",fx:{rep:10,morale:12,legacy:18,flag:"ntbindegefeiert",trust:8}}]}]},
{ id:"kp_ntfuehrung", tag:"Nationalteam", w:7, ph:3, cond:p=>!!p.nt.kapitaen, title:T("Vor dem Turnier: die Mannschaft ist gespalten"),
  text:T("Zwei Lager im Kader, ein Trainer, der es nicht sieht, und ein Turnier in vier Wochen."),
  choices:[{label:"Alle an einen Tisch holen",hint:"",roll:[{p:.65,text:"Ein Abend ohne Handys, ohne Betreuer. Danach ist es eine Mannschaft.",fx:{ntBonus:8,rep:14,legacy:16,morale:12}},
    {p:.35,text:"Es hilft nicht. Das Turnier wird eine Enttäuschung.",fx:{ntPenalty:6,morale:-12,rep:-4}}]},
    {label:"Auf den Trainer verweisen",hint:"",roll:[{p:1,text:"Nicht dein Job, sagst du. Formal richtig.",fx:{morale:-6}}]}]},
{ id:"kp_hymne", tag:"Nationalteam", w:6, ph:3, cond:p=>!!p.nt.kapitaen&&p.nt.caps>=30, title:T("Debatte um die Hymne"),
  text:T("Ein Teil des Landes fordert, dass alle mitsingen. Als Kapitän wirst du gefragt."),
  choices:[{label:"Für die Mannschaft sprechen",hint:"",roll:[{p:1,text:"Du sagst, jeder zeige seinen Stolz auf seine Weise. Der Satz wird tausendfach zitiert.",fx:{rep:14,legacy:12,morale:8}}]},
    {label:"Ausweichen",hint:"",roll:[{p:1,text:"Du redest über Fußball. Manche finden, ein Kapitän müsse mehr sagen.",fx:{rep:-6,form:5}}]}]},
{ id:"kp_kabinenregeln", tag:"Führung", w:6, ph:2, cond:p=>!!p.flags.kapitaen, title:T("Neue Kabinenordnung"),
  text:T("Handyverbot beim Essen, Strafenkatalog, Kleiderordnung auf Reisen. Der Mannschaftsrat will, dass du entscheidest."),
  choices:[{label:"Strenge Regeln",hint:"",roll:[{p:.6,text:"Anfangs Murren, nach zwei Monaten läuft alles wie geschmiert.",fx:{trust:14,note:.08,morale:-4}},
    {p:.4,text:"Drei Ältere sehen nicht ein, sich von dir etwas sagen zu lassen.",fx:{morale:-10,trust:-6}}]},
    {label:"Möglichst wenige Regeln",hint:"",roll:[{p:1,text:"Du setzt auf Eigenverantwortung. Funktioniert bei den meisten.",fx:{morale:10,trust:4}}]}]},
/* ============ NUR ÜBER DEN META-FORTSCHRITT ============
   Diese Situationen entstehen aus dem, was frühere Laufbahnen hinterlassen
   haben. Ohne die zugehörige Freischaltung erscheinen sie nicht.        */
{ id:"me_mentor1", req:"me_mentor", tag:"Umfeld", w:7, ph:2, cond:p=>p.age<=22, title:T("Ein alter Bekannter meldet sich"),
  text:T("Ein Name, den du aus einer anderen Zeit kennst, steht plötzlich im Trainingszentrum. Er ist heute Sportdirektor und sagt, er habe dich im Blick."),
  choices:[{label:"Das Angebot annehmen, sich fördern zu lassen",hint:"",roll:[{p:1,text:"Ein Anruf pro Monat, ehrliche Einschätzungen, keine Schmeicheleien. Genau das fehlte dir.",fx:{pot:4,note:.08,trust:10,morale:8}}]},
    {label:"Erst mal Abstand halten",hint:"",roll:[{p:1,text:"Du willst es allein schaffen. Auch das respektiert er.",fx:{morale:6,form:5}}]}]},
{ id:"me_mentor2", req:"me_mentor", tag:"Zukunft", w:6, ph:2, cond:p=>p.age>=28, title:T("Man erinnert sich an dich"),
  text:T("Ein Verein, bei dem du nie gespielt hast, will dich trotzdem. Der Trainer sagt, er habe in seiner Jugend von jemandem gehört, der genauso spielte wie du."),
  choices:[{label:"Sich das anhören",hint:"",roll:[{p:1,text:"Ein langes Gespräch über Fußball, das mit einem Angebot endet, das besser ist als erwartet.",fx:{dreamOffer:true,rep:8,morale:8}}]},
    {label:"Höflich ablehnen",hint:"",roll:[{p:1,text:"Du bleibst, wo du bist. Der Anruf tut trotzdem gut.",fx:{morale:10,trust:6}}]}]},
{ id:"me_mentor3", req:"me_mentor", tag:"Führung", w:6, ph:3, cond:p=>p.age>=26, title:T("Du bist jetzt der Ältere"),
  text:c=>`${c.young.name} kommt mit derselben Frage zu dir, die du vor Jahren jemandem gestellt hast.`,
  choices:[{label:"Dieselbe Antwort weitergeben",hint:"",roll:[{p:1,text:"Der Kreis schließt sich. Zwei Jahre später spielt er in der Nationalmannschaft und nennt deinen Namen.",fx:{legacy:20,trust:14,morale:12,rep:6}}]},
    {label:"Eine bessere Antwort geben",hint:"",roll:[{p:1,text:"Du sagst ihm, was du damals gern gehört hättest. Er hört zu.",fx:{legacy:14,trust:10,note:.05}}]}]},

{ id:"me_netz1", req:"me_netzwerk", tag:"Geschäft", w:7, ph:2, cond:p=>p.age>=21, title:T("Ein Netzwerk, das es vorher nicht gab"),
  text:T("Ehemalige aus verschiedenen Vereinen treffen sich zweimal im Jahr. Diesmal bist du eingeladen."),
  choices:[{label:"Hingehen",hint:"",roll:[{p:1,text:"Zwei Abende, ein Dutzend Kontakte. Dein Berater staunt, wer sich danach bei ihm meldet.",fx:{offers:1,rep:10,morale:6}}]},
    {label:"Absagen",hint:"",roll:[{p:1,text:"Nicht deine Welt. Verständlich.",fx:{fitness:4}}]}]},
{ id:"me_netz2", req:"me_netzwerk", tag:"Transfer", w:6, ph:4, cond:p=>p.seasons.length>=2, title:T("Jemand legt ein gutes Wort ein"),
  text:T("Ein Verein, der eigentlich nicht auf dich gekommen wäre, ruft an. Auf Empfehlung, sagt man."),
  choices:[{label:"Das Gespräch führen",hint:"",roll:[{p:.7,text:"Ein Angebot, das über dem Markt liegt, weil jemand für dich gebürgt hat.",fx:{dreamOffer:true,wageMult:.08,rep:6}},
    {p:.3,text:"Es passt sportlich nicht. Trotzdem eine gute Erfahrung.",fx:{morale:5,rep:3}}]},
    {label:"Ablehnen",hint:"",roll:[{p:1,text:"Du willst nichts, was auf Beziehungen beruht.",fx:{morale:6,legacy:4}}]}]},
{ id:"me_netz3", req:"me_netzwerk", tag:"Geschäft", w:6, ph:2, cond:p=>p.money>=.8, title:T("Eine Beteiligung unter Ehemaligen"),
  text:T("Drei frühere Profis bauen etwas auf und fragen, ob du einsteigst. Alle drei haben ihre Laufbahn sauber beendet."),
  choices:[{label:"Einsteigen",hint:"",roll:[{p:.75,text:"Nach vier Jahren wirft es mehr ab als jeder Fonds — und du hast dabei Freunde behalten.",fx:{money:1.4,morale:12,legacy:8}},
    {p:.25,text:"Es läuft nicht. Immerhin habt ihr es gemeinsam versucht.",fx:{money:-.5,morale:-6,legacy:4}}]},
    {label:"Nur zuschauen",hint:"",roll:[{p:1,text:"Du wünschst ihnen Glück und behältst dein Geld.",fx:{money:.03}}]}]},

{ id:"me_ruf1", req:"me_ruf", tag:"Medien", w:7, ph:3, cond:p=>p.rep>=35, title:T("Dein Name trägt weiter, als du denkst"),
  text:T("Ein Reporter aus einem anderen Land schreibt eine lange Geschichte über dich, ohne dich je gesprochen zu haben."),
  choices:[{label:"Das Gespräch nachholen",hint:"",roll:[{p:1,text:"Ein ehrliches Interview über Umwege und Rückschläge. Es wird in acht Sprachen übersetzt.",fx:{rep:18,morale:10,legacy:10}}]},
    {label:"Es so stehen lassen",hint:"",roll:[{p:1,text:"Manche Geschichten erzählen sich besser ohne einen selbst.",fx:{rep:8,morale:5}}]}]},
{ id:"me_ruf2", req:"me_ruf", tag:"Vertrag", w:6, ph:2, cond:p=>p.age>=24&&p.contract<=2, title:T("Ein Verein bietet mehr, als er müsste"),
  text:T("Der Sportdirektor sagt offen, er zahle einen Aufschlag für das, was du mitbringst — nicht nur für das, was du auf dem Platz machst."),
  choices:[{label:"Annehmen",hint:"Sofort mehr Gehalt",roll:[{p:1,text:"Zwanzig Prozent über dem, was die Tabelle hergibt. Weil man weiß, wen man da bekommt.",fx:{raise:.2,trust:10,morale:10}}]},
    {label:"Auf dem üblichen Satz bestehen",hint:"",roll:[{p:1,text:"Du willst nach Leistung bezahlt werden. Der Sportdirektor nickt anerkennend.",fx:{trust:16,rep:6,legacy:6}}]}]},
{ id:"me_ruf3", req:"me_ruf", tag:"Nationalteam", w:6, ph:2, cond:p=>p.nt.level!=="A"&&p.age>=21, title:T("Der Verband hat ein Auge auf dich"),
  text:T("Man kennt dich dort besser, als du dachtest. Ein Beobachter begleitet dich für eine ganze Hinrunde."),
  choices:[{label:"Zeigen, was geht",hint:"",roll:[{p:.65,text:"Die Nominierung kommt im Winter.",fx:{ntBonus:12,rep:10,morale:12}},
    {p:.35,text:"Noch nicht. Aber sie bleiben dran.",fx:{ntBonus:5,morale:4}}]},
    {label:"Sich nicht verrückt machen",hint:"",roll:[{p:1,text:"Du spielst dein Spiel. Was kommt, kommt.",fx:{form:8,note:.05}}]}]},

{ id:"me_erbe1", req:"me_erbe", tag:"Herkunft", w:7, ph:2, cond:p=>p.age>=19, title:T("Ein Name mit Geschichte"),
  text:T("In deiner Familie hat schon jemand auf höchstem Niveau gespielt. Das öffnet Türen und setzt dich unter Druck."),
  choices:[{label:"Die Erwartung annehmen",hint:"",roll:[{p:.65,text:"Du wächst daran. Vergleiche stören dich nicht, sie treiben dich.",fx:{pot:6,rep:12,morale:8,note:.06}},
    {p:.35,text:"Jeder Fehler wird doppelt gemessen. Das zermürbt.",fx:{rep:8,morale:-10,form:-5}}]},
    {label:"Den eigenen Weg suchen",hint:"",roll:[{p:1,text:"Du bittest darum, nicht verglichen zu werden. Man hält sich meistens daran.",fx:{morale:10,form:6,legacy:6}}]}]},
{ id:"me_erbe2", req:"me_erbe", tag:"Zukunft", w:6, ph:1, cond:p=>p.age>=30, title:T("Die Vitrine der Familie"),
  text:T("Ein Raum voller Erinnerungsstücke aus mehreren Laufbahnen. Deine stehen inzwischen daneben."),
  choices:[{label:"Alles öffentlich zeigen",hint:"",roll:[{p:1,text:"Ein kleines Museum im Heimatverein. Schulklassen kommen jeden Monat.",fx:{legacy:26,rep:12,money:-.08,morale:12}}]},
    {label:"Im Privaten lassen",hint:"",roll:[{p:1,text:"Manches gehört nur der Familie.",fx:{legacy:12,morale:14}}]}]},
{ id:"me_erbe3", req:"me_erbe", tag:"Vermächtnis", w:6, ph:2, cond:p=>p.age>=32&&p.money>=1.5, title:T("Eine Stiftung mit deinem Namen"),
  text:T("Was du aufgebaut hast, könnte über deine Laufbahn hinaus wirken. Ein Anwalt legt dir Papiere hin."),
  choices:[{label:"Gründen",hint:"",roll:[{p:1,text:"Zwanzig Plätze pro Jahrgang, unabhängig vom Geldbeutel der Eltern. Das überdauert dich.",fx:{money:-1.2,legacy:44,rep:16,morale:16}}]},
    {label:"Später",hint:"",roll:[{p:1,text:"Erst wenn du sicher bist, dass es trägt.",fx:{money:.02}}]}]},
/* ============ NUR BEIM WUNSCHVEREIN ============
   Wer bei dem Verein spielt, den er sich am Anfang ausgesucht hat, erlebt
   Dinge, die für alle anderen bloß Arbeitsalltag wären.                 */
{ id:"tv_ankunft", tag:"Wunschverein", w:11, ph:2, cond:p=>istTraum(p)&&!p.flags.traumAngekommen, title:T("Der erste Tag an einem Ort, den du dir ausgesucht hast"),
  text:c=>`Du stehst in der Kabine von ${c.p.club.n}. Du kennst diesen Raum aus Bildern, seit du sechzehn warst.`,
  choices:[{label:"Den Moment auskosten",hint:"",roll:[{p:1,text:"Du setzt dich auf deinen Platz und bleibst zehn Minuten sitzen, nachdem alle gegangen sind.",fx:{morale:24,form:12,trust:10,flag:"traumAngekommen",legacy:10}}]},
    {label:"Sofort auf Arbeit umschalten",hint:"",roll:[{p:1,text:"Kein Blick zurück. Du bist nicht hier, um zu staunen.",fx:{form:16,trust:14,note:.08,flag:"traumAngekommen"}}]}]},
{ id:"tv_kindheit", tag:"Wunschverein", w:9, ph:3, cond:p=>istTraum(p), title:T("Das Trikot aus deiner Kindheit"),
  text:T("Deine Eltern haben es aufgehoben. Es ist verwaschen, zwei Nummern zu klein und hat einen anderen Ausrüster."),
  choices:[{label:"Es dem Vereinsmuseum geben",hint:"",roll:[{p:1,text:"Es hängt jetzt in einer Vitrine, mit einem Schild daneben. Deine Mutter weint bei der Übergabe.",fx:{legacy:18,rep:10,morale:16}}]},
    {label:"Behalten",hint:"",roll:[{p:1,text:"Manche Dinge gehören niemandem sonst.",fx:{morale:14,form:6}}]}]},
{ id:"tv_kurve", tag:"Wunschverein", w:9, ph:3, cond:p=>istTraum(p)&&p.rep>=35, title:T("Die Kurve singt deinen Namen"),
  text:T("Nicht höflich, nicht pflichtschuldig. Sie singen ihn, als wärst du immer dagewesen."),
  choices:[{label:"Hingehen und stehen bleiben",hint:"",roll:[{p:1,text:"Neunzig Sekunden vor der Kurve. Danach bist du keiner von vielen mehr.",fx:{rep:16,morale:20,form:10,loyalBonus:.6}}]},
    {label:"Winken und weiterlaufen",hint:"",roll:[{p:1,text:"Du willst es dir verdienen, bevor du es annimmst.",fx:{morale:10,form:8,trust:6}}]}]},
{ id:"tv_altemarke", tag:"Wunschverein", w:8, ph:4, cond:p=>istTraum(p)&&p.tot.goals>=20, title:T("Du näherst dich einer Vereinsmarke"),
  text:T("Eine Bestmarke, die seit Jahrzehnten steht. Bei jedem Spiel zählt die halbe Stadt mit."),
  choices:[{label:"Den Rekord jagen",hint:"",roll:[{p:.55,text:"Du knackst ihn im vorletzten Spiel. Der bisherige Rekordhalter überreicht dir persönlich den Ball.",fx:{legacy:30,rep:20,morale:18,goalMod:.1}},
    {p:.45,text:"Zwei fehlen am Ende. Die Enttäuschung sitzt tiefer als erwartet.",fx:{morale:-12,form:-6,rep:6}}]},
    {label:"Nicht daran denken",hint:"",roll:[{p:1,text:"Du spielst weiter dein Spiel. Am Ende fehlt einer — und es ist dir egal.",fx:{note:.1,morale:8,trust:10}}]}]},
{ id:"tv_derby", tag:"Wunschverein", w:9, ph:3, cond:p=>istTraum(p), title:T("Dein erstes Derby von der richtigen Seite"),
  text:T("Du hast dieses Spiel dein Leben lang geschaut. Diesmal stehst du drin."),
  choices:[{label:"Alles reinwerfen",hint:"",roll:[{p:.6,text:c=>`Du ${heldentat(c.p)}. Die Stadt gehört an diesem Abend dir.`,fx:{rep:20,morale:22,form:14,legacy:14,bigGame:.12}},
    {p:.4,text:"Zu verkrampft. Du wirst nach einer Stunde ausgewechselt.",fx:{morale:-14,form:-8,trust:-6}}]},
    {label:"Ruhig bleiben",hint:"",roll:[{p:1,text:"Kein Spektakel, aber auch kein Fehler. Solide durch ein Spiel, das dir viel bedeutet.",fx:{note:.1,morale:10,trust:8}}]}]},
{ id:"tv_vertragsangebot", tag:"Wunschverein", w:8, ph:2, cond:p=>istTraum(p)&&p.contract<=2&&loyalty(p)>=2, title:T("Der Verein will dich langfristig"),
  text:T("Ein Vertrag über fünf Jahre, deutlich unter dem, was du woanders bekämst. Der Sportdirektor sagt es offen."),
  choices:[{label:"Unterschreiben",hint:"Sofort verlängert",roll:[{p:1,text:"Du nimmst weniger Geld und mehr Bedeutung. In der Kurve hängt am Wochenende ein Banner mit deinem Namen.",fx:{extend:5,cut:.14,loyalBonus:1.2,rep:14,morale:20,legacy:20,trust:18}}]},
    {label:"Marktwert einfordern",hint:"",roll:[{p:.5,text:"Sie strecken sich. Es tut ihnen weh, aber sie zahlen.",fx:{extend:4,raise:.15,trust:6}},
      {p:.5,text:"Sie können nicht. Das Gespräch endet freundlich und ergebnislos.",fx:{trust:-8,morale:-8}}]}]},
{ id:"tv_abwerbung", tag:"Wunschverein", w:9, ph:2, cond:p=>istTraum(p)&&p.ovr>=72, title:T("Ein größerer Verein klopft an"),
  text:T("Mehr Geld, mehr Titel, mehr Bühne. Alles, was man vernünftigerweise wollen sollte."),
  choices:[{label:"Ablehnen und bleiben",hint:"",roll:[{p:1,text:"Du sagst ab, ohne lange nachzudenken. Die Stadt vergisst das nie.",fx:{loyalBonus:1.5,rep:18,morale:20,legacy:26,trust:20,flag:"treugeblieben"}}]},
    {label:"Ernsthaft verhandeln",hint:"",roll:[{p:.55,text:"Am Ende bleibst du doch — aber zu deutlich besseren Bedingungen.",fx:{raise:.22,trust:-8,morale:6}},
      {p:.45,text:"Das Verhältnis ist beschädigt. Manche in der Kurve pfeifen jetzt.",fx:{rep:-10,trust:-14,morale:-12}}]}]},
{ id:"tv_verletzung", tag:"Wunschverein", w:7, ph:3, cond:p=>istTraum(p)&&p.injuryProne>=38, title:T("Verletzt beim Verein deines Lebens"),
  text:T("Ausgerechnet hier. Sechs Wochen Pause, und du sitzt auf der Tribüne deines eigenen Stadions."),
  choices:[{label:"Bei jedem Heimspiel da sein",hint:"",roll:[{p:1,text:"Du sitzt in der Kurve statt in der Loge. Die Bilder gehen durch die Stadt.",fx:{rep:12,morale:12,trust:12,legacy:8,fitness:-4}}]},
    {label:"Nur an der Reha arbeiten",hint:"",roll:[{p:1,text:"Sechs Wochen Tunnelblick. Du kommst früher zurück als geplant.",fx:{injuryProne:-12,fitness:10,form:8}}]}]},
{ id:"tv_legende", tag:"Wunschverein", w:8, ph:1, cond:p=>istTraum(p)&&loyalty(p)>=6, title:T("Du bist Teil der Vereinsgeschichte"),
  text:T("Im Vereinsheim hängt eine Tafel mit den Namen derer, die hier etwas bedeutet haben. Deiner kommt dazu."),
  choices:[{label:"Eine Rede halten",hint:"",roll:[{p:1,text:"Du sprichst über den Jungen, der als Kind auf der Gegengeraden stand. Es fällt dir schwerer als jedes Spiel.",fx:{legacy:34,rep:16,morale:22}}]},
    {label:"Still danebenstehen",hint:"",roll:[{p:1,text:"Du bedankst dich in zwei Sätzen. Auch das passt.",fx:{legacy:22,morale:16,trust:8}}]}]},
{ id:"tv_nachwuchs", tag:"Wunschverein", w:7, ph:2, cond:p=>istTraum(p)&&p.age>=26, title:T("Die Jugend deines Vereins"),
  text:T("Dieselben Plätze, dieselben Kabinen, dieselben Träume. Der Nachwuchsleiter fragt, ob du dich einbringst."),
  choices:[{label:"Regelmäßig hingehen",hint:"",roll:[{p:1,text:"Einmal im Monat, über Jahre. Zwei der Jungen schaffen es später zu den Profis.",fx:{legacy:26,rep:10,morale:14,trust:10}}]},
    {label:"Einmalig vorbeischauen",hint:"",roll:[{p:1,text:"Ein Nachmittag, vierzig Fotos, viel Freude.",fx:{legacy:8,rep:5,morale:8}}]}]},
{ id:"tv_abstiegskampf", tag:"Wunschverein", w:8, ph:4, cond:p=>{const s=lastS(p);return istTraum(p)&&s&&s.rank>=s.N-4;}, title:T("Dein Verein steht am Abgrund"),
  text:T("Vier Spieltage, drei Punkte Rückstand. Es geht um mehr als eine Tabelle."),
  choices:[{label:"Vorangehen",hint:"",roll:[{p:.55,text:"Ihr rettet euch am letzten Spieltag. Danach liegen zwanzigtausend Menschen einander in den Armen.",fx:{rep:20,morale:24,legacy:20,trust:18,form:12}},
    {p:.45,text:"Es reicht nicht. Du sitzt nach dem Abpfiff eine halbe Stunde auf dem Rasen.",fx:{morale:-22,rep:8,legacy:10}}]},
    {label:"Nüchtern bleiben",hint:"",roll:[{p:1,text:"Du machst deinen Job und redest nicht viel. Manche nehmen dir das übel.",fx:{note:.08,rep:-6,morale:-6}}]}]},
{ id:"tv_rueckkehr", tag:"Wunschverein", w:8, ph:2, cond:p=>!istTraum(p)&&!!p.traum&&(p.traumMale||0)>=1&&p.seasons.some(s=>s.club===p.traum), title:T("Zurück zum Verein deines Lebens?"),
  text:c=>`${c.p.traum} meldet sich wieder. Man würde dich gern noch einmal sehen, bevor es vorbei ist.`,
  choices:[{label:"Ernsthaft prüfen",hint:"",roll:[{p:1,text:"Du legst dir das Angebot auf den Nachttisch und liest es jeden Abend noch einmal.",fx:{morale:12,wantMove:true,dreamOffer:true}}]},
    {label:"Diesmal nicht",hint:"",roll:[{p:1,text:"Manche Geschichten soll man nicht fortsetzen. Du bleibst, wo du bist.",fx:{morale:6,trust:10,form:6}}]}]},
];
const EV_BY_ID = {}; EVENTS.forEach((e) => { EV_BY_ID[e.id] = e; });

/* ================= WILDCARDS =================
   Zu Beginn jeder Karriere wird genau eine Karte gezogen. Die Seltenheit
   bestimmt, wie stark sie wirkt — und wie unwahrscheinlich sie ist.      */
/* Seltenheit hat eine eigene Leiter: Papier, Patina, Eis, Bernstein,
   Amethyst, Rosé. Sie muss zweimal ausweichen — der Ampel aus Grün/Gelb/Rot
   UND den Errungenschaftsstufen, die schon Bronze/Silber/Gold/Platin heißen.
   Gemessen: 0 Kollisionen unter Abstand 60, alle Stufen über Kontrast 4,5. */
const RARITY = {
  normal:  { name:"Normal",          col:"#7E8A84", w:35 },   // Papier
  selten:  { name:"Selten",          col:"#4FB8A0", w:25 },   // Patina
  aussen:  { name:"Außergewöhnlich", col:"#5FD3E8", w:16 },   // Eis
  unfass:  { name:"Unfassbar",       col:"#D97706", w:11 },   // Bernstein
  welt:    { name:"Weltmeisterlich", col:"#B77BE8", w:8 },    // Amethyst
  goat:    { name:"GOAT",            col:"#EFA48C", w:5 },    // Rosé
  hsv:     { name:"Schwarz-Weiß-Blau", col:"#C6DCF2", w:0 },  // wird eigens gezogen
};
/* Positionsgruppen für zugeschnittene Karten */
const OFF = ["ST", "AF", "ZOM"], DEF = ["IV", "AV", "ZDM"], MID = ["ZDM", "ZM", "ZOM"];
const posAttr = (p) => (p.pos === "TW" ? "def" : OFF.includes(p.pos) ? "sho" : DEF.includes(p.pos) ? "def" : "pas");

const WILDCARDS = [
/* ---------- NORMAL ---------- */
{ id:"w_schnell", r:"normal", n:"Antritt", t:"Über die ersten fünf Meter warst du schon immer weg.", fx:()=>({ pac:4 }) },
{ id:"w_kopfball", kon:["iv_kopf","st_kopf"], r:"normal", n:"Gefahr bei Standards", t:"Bei Standards bist du immer eine Option.", fx:()=>({ phy:3, sho:2 }) },
{ id:"w_ausdauer", r:"normal", n:"Lunge", t:"In der 90. Minute läufst du noch wie in der ersten.", fx:()=>({ phy:4, fitness:6 }) },
{ id:"w_ruhe", r:"normal", n:"Ruhiger Fuß", t:"Hektik ist nichts, was du kennst.", fx:()=>({ pas:3, dri:2 }) },
{ id:"w_zweikampf", kon:["av_kampf"], r:"normal", n:"Zweikampfhärte", t:"Du gehst in jeden Zweikampf, als wäre es der letzte.", fx:()=>({ def:4 }) },
{ id:"w_beidfuss", r:"normal", n:"Beidfüßig", t:"Welcher Fuß, ist dir egal.", fx:()=>({ dri:2, sho:2, pas:2 }) },
{ id:"w_frueh", r:"normal", n:"Früh dran", t:"Du warst schon immer ein Jahr weiter als dein Jahrgang.", fx:()=>({ pot:3 }) },
{ id:"w_diszi", r:"normal", n:"Vorbildlich", t:"Nie zu spät, nie ein Wort zu viel.", fx:()=>({ trust:14 }) },
{ id:"w_liebling", r:"normal", n:"Sympathieträger", t:"Die Leute mögen dich, bevor du gespielt hast.", fx:()=>({ rep:12, morale:8 }) },
{ id:"w_sparbuch", r:"normal", n:"Sparbuch der Oma", t:"Ein kleines Startkapital, ehrlich verdient von jemand anderem.", fx:()=>({ money:.06 }) },
{ id:"w_taktik", r:"normal", n:"Spielverständnis", t:"Du siehst Räume, bevor sie entstehen.", fx:()=>({ note:.06, pas:2 }) },
{ id:"w_robust", r:"normal", n:"Zäh", t:"Du warst noch nie länger als zwei Wochen raus.", fx:()=>({ injuryProne:-10 }) },
{ id:"w_standard", kon:["zom_standard"], r:"normal", n:"Standardgefahr", t:"Freistöße und Ecken übernimmst du seit der Jugend.", fx:()=>({ pas:3, flag:"standards" }) },
{ id:"w_kabine", r:"normal", n:"Kabinenmensch", t:"Du bringst eine Gruppe zusammen, ohne es zu wollen.", fx:()=>({ trust:8, morale:10 }) },
{ id:"w_kaltschnauze", kon:["st_vollstr"], r:"normal", n:"Nerven aus Draht", t:"Je größer der Druck, desto klarer dein Kopf.", fx:()=>({ flag:"elfer", sho:2 }) },
{ id:"w_lauf", kon:["zm_arbeit"], r:"normal", n:"Zwölf Kilometer", t:"Zwölf Kilometer sind für dich ein normaler Arbeitstag.", fx:()=>({ pac:2, phy:3, fitness:4 }) },
{ id:"w_technik", r:"normal", n:"Erste Berührung", t:"Der Ball klebt, egal wie er kommt.", fx:()=>({ dri:4 }) },
{ id:"w_schule", r:"normal", n:"Abschluss in der Tasche", t:"Du hast einen Plan B, und das nimmt Druck.", fx:()=>({ morale:10, flag:"abschluss", legacy:6 }) },

/* ---------- SELTEN ---------- */
{ id:"w_talent", r:"selten", n:"Rohdiamant", t:"Alle sagen, da geht noch deutlich mehr.", fx:()=>({ pot:7 }) },
{ id:"w_positions", r:"selten", n:"Naturtalent", t:"Genau für deine Position gebaut.", fx:(p)=>({ [posAttr(p)]:6 }) },
{ id:"w_eisern", r:"selten", n:"Eisenmann", t:"Verletzungen kennst du nur vom Hörensagen.", fx:()=>({ injuryProne:-22, injMod:-.3 }) },
{ id:"w_berater", r:"selten", n:"Starker Berater", t:"Er kennt jeden und hebt bei jedem ab.", fx:()=>({ flag:"berater", offers:1, wageMult:.12 }) },
{ id:"w_akademie", r:"selten", n:"Eliteakademie", t:"Du kommst aus einer Ausbildung, um die dich alle beneiden.", fx:()=>({ pot:4, pas:3, note:.06 }) },
{ id:"w_erbe", r:"selten", n:"Familienerbe", t:"Ein Haus, das dir niemand nehmen kann.", fx:()=>({ money:.6, morale:8 }) },
{ id:"w_torriecher", kon:["st_vollstr"], r:"selten", n:"Torriecher", t:"Du stehst da, wo der Ball hinfällt.", fx:(p)=>(OFF.includes(p.pos) ? { sho:5, goalMod:.18 } : { sho:3, goalMod:.10 }) },
{ id:"w_vorlage", kon:["zm_regisseur"], r:"selten", n:"Der öffnende Ball", t:"Du siehst die Lücke, die keiner sieht.", fx:()=>({ pas:5, assistMod:.22 }) },
{ id:"w_mauer", kon:["iv_abraeumer"], r:"selten", n:"Bollwerk", t:"An dir kommt selten jemand vorbei.", fx:(p)=>(p.pos === "TW" ? { def:5, csMod:.2 } : { def:5, csMod:.1 }) },
{ id:"w_fuehrung", r:"selten", n:"Geborener Anführer", t:"Man hört dir zu, auch mit neunzehn.", fx:()=>({ trust:18, flag:"vize", rep:8 }) },
{ id:"w_liebkind", r:"selten", n:"Liebling der Kurve", t:"Sie singen deinen Namen, bevor du ihn verdient hast.", fx:()=>({ rep:20, loyalBonus:.5 }) },
{ id:"w_spaet", r:"selten", n:"Spätzünder", t:"Deine besten Jahre kommen später als bei den anderen.", fx:()=>({ pot:6, slowDecay:.25 }) },
{ id:"w_intl", r:"selten", n:"Früh im Blick des Verbands", t:"Der Verband beobachtet dich seit der U15.", fx:()=>({ ntBonus:4, ntStanding:10 }) },
{ id:"w_regen", r:"selten", n:"Schnelle Regeneration", t:"Nach 48 Stunden bist du wieder frisch.", fx:()=>({ fitness:12, injuryProne:-8, slowDecay:.1 }) },
{ id:"w_medien", r:"selten", n:"Kamerasicher", t:"Du sagst nie das Falsche.", fx:()=>({ rep:14, note:.04, morale:6 }) },
{ id:"w_wechselgeld", r:"selten", n:"Handgeld inklusive", t:"Dein erster Vertrag enthält eine Klausel, die dir gefällt.", fx:()=>({ money:.25, wageMult:.10 }) },

/* ---------- AUSSERGEWÖHNLICH ---------- */
{ id:"w_wunderkind", r:"aussen", n:"Wunderkind", t:"Mit sechzehn spielst du wie mit zwanzig.", fx:()=>({ pot:10, pac:3, dri:3, rep:10 }) },
{ id:"w_maschine", kon:["tw_athlet"], r:"aussen", n:"Athletische Ausnahme", t:"Deine Werte sprengen jede Tabelle der Sportwissenschaft.", fx:()=>({ pac:6, phy:7, fitness:12, injuryProne:-12 }) },
{ id:"w_kopf", r:"aussen", n:"Fußballhirn", t:"Du löst Spiele im Kopf, bevor sie auf dem Platz stattfinden.", fx:()=>({ pas:6, def:3, note:.14, pot:4 }) },
{ id:"w_vollstrecker", kon:["st_vollstr"], r:"aussen", n:"Der letzte Schritt", t:"Eine Chance reicht dir.", fx:(p)=>(OFF.includes(p.pos) ? { sho:8, goalMod:.32 } : { sho:5, goalMod:.18 }) },
{ id:"w_dirigent", kon:["zdm_regista"], r:"aussen", n:"Dirigent", t:"Das ganze Spiel läuft über deinen Fuß.", fx:(p)=>(MID.includes(p.pos) ? { pas:8, assistMod:.32, note:.08 } : { pas:5, assistMod:.16 }) },
{ id:"w_titan", kon:["tw_linie"], r:"aussen", n:"Titan", t:"Hinter dir ist die Tür zu.", fx:(p)=>(p.pos === "TW" ? { def:8, csMod:.38, note:.1 } : { def:8, csMod:.16, note:.06 }) },
{ id:"w_kapital", r:"aussen", n:"Wohlhabende Familie", t:"Geld war für dich nie ein Argument.", fx:()=>({ money:2.2, morale:10, asset:"berater" }) },
{ id:"w_unverwundbar", r:"aussen", n:"Aus Stein", t:"Dein Körper verzeiht dir alles.", fx:()=>({ injuryProne:-30, injMod:-.5, slowDecay:.2 }) },
{ id:"w_liebling2", r:"aussen", n:"Sohn der Stadt", t:"Hier bist du geboren, hier wirst du verehrt.", fx:()=>({ rep:22, trust:18, loyalBonus:1.2, morale:12 }) },
{ id:"w_nationalheld", r:"aussen", n:"Hoffnungsträger", t:"Ein ganzes Land wartet auf dich.", fx:()=>({ ntBonus:8, ntStanding:22, rep:14 }) },
{ id:"w_scout", r:"aussen", n:"Von allen beobachtet", t:"In jedem Stadion sitzt jemand mit einem Klemmbrett.", fx:()=>({ offers:2, rep:12, dreamOffer:true }) },
{ id:"w_doppel", r:"aussen", n:"Zwei Positionen", t:"Du bist überall einsetzbar, und zwar richtig.", fx:()=>({ pas:4, def:4, dri:4, note:.08 }) },
{ id:"w_bigmatch", r:"aussen", n:"Großer Anlass", t:"Je wichtiger das Spiel, desto besser du.", fx:()=>({ bigGame:.3, note:.1, morale:8 }) },
{ id:"w_vertrag", r:"aussen", n:"Traumvertrag zum Start", t:"Dein erster Vertrag ist besser als der von manchem Stammspieler.", fx:()=>({ wageMult:.4, money:.5, contract:2 }) },
{ id:"w_lehrmeister", r:"aussen", n:"Ein großer Mentor", t:"Eine Legende nimmt dich unter die Fittiche.", fx:()=>({ pot:6, note:.08, trust:14, legacy:10 }) },

/* ---------- UNFASSBAR ---------- */
{ id:"w_jahrhundert", r:"unfass", n:"Jahrhunderttalent", t:"So einen gab es hier seit vierzig Jahren nicht.", fx:()=>({ pot:15, rep:18, dev:.18 }) },
{ id:"w_komplett", r:"unfass", n:"Komplettspieler", t:"Es gibt nichts, das du nicht kannst.", fx:()=>({ pac:5, sho:5, pas:5, dri:5, def:5, phy:5 }) },
{ id:"w_ewigjung", r:"unfass", n:"Ewig jung", t:"Mit fünfunddreißig läufst du wie mit fünfundzwanzig.", fx:()=>({ slowDecay:.55, injuryProne:-20, fitness:14 }) },
{ id:"w_torgarant", r:"unfass", n:"Torgarantie", t:"Du triffst in Spielen, in denen sonst nichts geht.", fx:(p)=>(OFF.includes(p.pos) ? { sho:10, goalMod:.55, rep:12 } : { sho:7, goalMod:.3, rep:10 }) },
{ id:"w_weltklasse", r:"unfass", n:"Fertig ausgebildet", t:"Mit siebzehn bist du schon da, wo andere mit dreiundzwanzig sind.", fx:()=>({ ovrBoost:9, pot:8 }) },
{ id:"w_magnet", r:"unfass", n:"Magnet für Angebote", t:"Dein Telefon steht in jedem Fenster nicht still.", fx:()=>({ offers:3, wageMult:.35, dreamOffer:true, rep:16 }) },
{ id:"w_dynastie", r:"unfass", n:"Dynastie", t:"Dein Vater und dein Großvater haben hier gespielt. Beide sind Legenden.", fx:()=>({ rep:20, trust:22, loyalBonus:2, legacy:30, morale:12 }) },
{ id:"w_millionen", r:"unfass", n:"Vermögende Herkunft", t:"Du musst nie eine Entscheidung wegen des Geldes treffen.", fx:()=>({ money:9, asset:"berater", asset2:"physio", morale:12 }) },
{ id:"w_kapitaen", r:"unfass", n:"Geborener Kapitän", t:"Die Binde kommt zu dir, egal wo du spielst.", fx:()=>({ flag:"kapitaen", trust:26, rep:16, legacy:16, morale:10 }) },
{ id:"w_unsterblich", r:"unfass", n:"Verletzungsfrei", t:"Du wirst in deiner Laufbahn kaum ein Spiel verpassen.", fx:()=>({ injuryProne:-45, injMod:-.75 }) },
{ id:"w_ikone", r:"unfass", n:"Vom Verband gesetzt", t:"Du bist im Nationalteam gesetzt, bevor du dein erstes Ligaspiel hast.", fx:()=>({ ntBonus:14, ntStanding:38, rep:18 }) },

/* ---------- GOAT ---------- */
{ id:"w_goat1", r:"goat", n:"Der Auserwählte", t:"Man wird deinen Namen in fünfzig Jahren noch kennen. Alles ist angelegt.", fx:()=>({ pot:22, dev:.3, rep:25, ovrBoost:6, note:.12 }) },
{ id:"w_goat2", r:"goat", n:"Generationentalent", t:"Trainer sagen, sie hätten so etwas noch nie gesehen.", fx:()=>({ pot:18, pac:6, dri:6, sho:6, pas:6, dev:.22, rep:20 }) },
{ id:"w_goat3", r:"goat", n:"Unantastbar", t:"Weder Verletzungen noch Alter scheinen für dich zu gelten.", fx:()=>({ injuryProne:-60, injMod:-.85, slowDecay:.7, fitness:18, pot:10 }) },
{ id:"w_goat4", r:"goat", n:"Weltstar von Tag eins", t:"Du bist berühmt, bevor du gespielt hast. Und du wirst es einlösen.", fx:()=>({ ovrBoost:12, pot:12, rep:35, money:4, offers:3, wageMult:.5, dreamOffer:true }) },
{ id:"w_goat5", r:"goat", n:"Der Rekordjäger", t:"Jede Bestmarke, die es gibt, wird deinen Namen tragen.", fx:(p)=>({ pot:16, goalMod:.45, assistMod:.35, csMod:.3, sho:5, pas:5, rep:20 }) },

/* ---------- ZWEISCHNEIDIGE KARTEN ---------- */
{ id:"w_glaskoerper", r:"selten", n:"Glasknochen mit Klasse", t:"Enormes Talent in einem Körper, der ständig streikt.", fx:()=>({ pot:12, injuryProne:28, injMod:.5 }) },
{ id:"w_egomane", r:"selten", n:"Egomane", t:"Du bist besser als die anderen und lässt es sie spüren.", fx:()=>({ sho:5, dri:4, goalMod:.15, trust:-18, morale:-6 }) },
{ id:"w_heimweh", r:"normal", n:"Heimatverbunden", t:"Weit weg von zu Hause wirst du nie richtig glücklich.", fx:()=>({ flag:"sesshaft", morale:14, trust:10, loyalBonus:1 }) },
{ id:"w_spielsucht", r:"normal", n:"Riskanter Lebensstil", t:"Du lebst schnell. Auf dem Platz hilft dir das manchmal sogar.", fx:()=>({ dri:4, pac:3, money:-.03, morale:-4, riskEvents:true }) },
{ id:"w_spaetstarter", r:"aussen", n:"Der lange Weg", t:"Mit zwanzig will dich niemand. Mit siebenundzwanzig alle.", fx:()=>({ pot:14, ovrBoost:-6, slowDecay:.35, dev:.12 }) },
{ id:"w_wanderer", r:"normal", n:"Weltenbummler", t:"Du fühlst dich überall zu Hause und nirgends lange.", fx:()=>({ offers:2, trust:-8, morale:6 }) },
{ id:"w_arbeitstier", kon:["zm_arbeit","st_kaempfer"], r:"selten", n:"Arbeitstier", t:"Talent hast du wenig, Fleiß dafür ohne Ende.", fx:()=>({ dev:.25, phy:4, trust:16, pot:-3 }) },
{ id:"w_kuenstler", kon:["af_strasse"], r:"aussen", n:"Straßenkünstler", t:"Du machst Dinge mit dem Ball, die im Lehrbuch nicht stehen.", fx:()=>({ dri:9, pas:4, def:-4, rep:14, bigGame:.2 }) },
{ id:"w_pechvogel", r:"normal", n:"Schwerer Start", t:"Am Anfang läuft für dich gar nichts. Danach umso mehr.", fx:()=>({ ovrBoost:-4, pot:8, morale:-6, dev:.15 }) },
{ id:"w_lieblingskind", r:"aussen", n:"Sohn des Trainers", t:"Man sagt, du spielst nur wegen deines Nachnamens. Beweise das Gegenteil.", fx:()=>({ trust:28, rep:-10, note:.06, morale:-4 }) },
/* ---------- POSITIONSGEBUNDEN: TORHÜTER ---------- */
{ id:"wp_reflex", kon:["tw_linie"], r:"normal", pos:["TW"], n:"Reflexbestie", t:"Auf der Linie bist du kaum zu überwinden.", fx:()=>({ def:5, csMod:.06 }) },
{ id:"wp_strafraum", kon:["tw_strafraum"], r:"selten", pos:["TW"], n:"Herr über den Sechzehner", t:"Bei Flanken gehört der Sechzehner dir.", fx:()=>({ def:5, phy:4, csMod:.14, note:.06 }) },
{ id:"wp_fuss", kon:["tw_fuss"], r:"selten", pos:["TW"], n:"Aufbau aus dem Tor", t:"Der Aufbau läuft über dich, nicht über die Innenverteidiger.", fx:()=>({ pas:9, dri:3, note:.08 }) },
{ id:"wp_elfer", kon:["tw_elfer"], r:"aussen", pos:["TW"], n:"Vom Punkt unbezwingbar", t:"Du liest den Anlauf, bevor der Schütze weiß, wohin er will.", fx:()=>({ def:5, csMod:.16, bigGame:.28, rep:10 }) },
{ id:"wp_kommando", kon:["tw_kommando"], r:"aussen", pos:["TW"], n:"Chef der Abwehr", t:"Deine Stimme hört man bis auf die Gegengerade.", fx:()=>({ def:6, csMod:.2, trust:20, note:.08, flag:"vize" }) },
{ id:"wp_titan2", kon:["tw_linie"], r:"unfass", pos:["TW"], n:"Nicht zu bezwingen", t:"Es gibt Spiele, in denen einfach nichts an dir vorbeigeht.", fx:()=>({ def:10, csMod:.42, note:.14, rep:14 }) },

/* ---------- POSITIONSGEBUNDEN: INNENVERTEIDIGUNG ---------- */
{ id:"wp_kopfball2", kon:["iv_kopf","st_kopf"], r:"normal", pos:["IV"], n:"Über allen in der Luft", t:"In beiden Strafräumen bist du eine Waffe.", fx:()=>({ phy:5, sho:2, def:3 }) },
{ id:"wp_stellung", kon:["zdm_absich","iv_libero"], r:"selten", pos:["IV","ZDM"], n:"Immer richtig gestanden", t:"Du bist da, bevor der Ball ankommt.", fx:()=>({ def:7, note:.08, pac:-1 }) },
{ id:"wp_aufbau", kon:["iv_aufbau"], r:"selten", pos:["IV"], n:"Aufbauspieler", t:"Deine Diagonalbälle sind das erste Angriffsmittel deiner Mannschaft.", fx:()=>({ pas:8, def:3, assistMod:.12 }) },
{ id:"wp_leader", kon:["iv_libero"], r:"aussen", pos:["IV"], n:"Abwehrchef", t:"Die Kette steht, weil du sie stehen lässt.", fx:()=>({ def:8, phy:4, csMod:.2, trust:20, note:.08 }) },
{ id:"wp_mauer2", kon:["iv_abraeumer","iv_mann"], r:"unfass", pos:["IV"], n:"Die Mauer", t:"An dir kommt in dieser Laufbahn fast niemand vorbei.", fx:()=>({ def:11, phy:6, csMod:.34, rep:14, note:.1 }) },

/* ---------- POSITIONSGEBUNDEN: AUSSENVERTEIDIGUNG ---------- */
{ id:"wp_motor", kon:["av_schiene"], r:"normal", pos:["AV","AF"], n:"Endlose Außenbahn", t:"Rauf und runter, neunzig Minuten lang.", fx:()=>({ pac:4, phy:4, fitness:6 }) },
{ id:"wp_flanke2", kon:["av_flanke"], r:"selten", pos:["AV","AF"], n:"Maßflanke", t:"Deine Flanken kommen an, auch aus vollem Lauf.", fx:()=>({ pas:6, assistMod:.24, dri:2 }) },
{ id:"wp_beidseitig", r:"selten", pos:["AV"], n:"Beide Außenbahnen", t:"Links wie rechts, für jeden Trainer ein Geschenk.", fx:()=>({ dri:4, pas:4, def:3, offers:1, flag:"beidseitig" }) },
{ id:"wp_wingback", kon:["av_schiene"], r:"aussen", pos:["AV"], n:"Moderner Schienenspieler", t:"Du bist Verteidiger und Flügelstürmer in einer Person.", fx:()=>({ pac:6, pas:5, def:4, phy:4, assistMod:.28, fitness:8 }) },

/* ---------- POSITIONSGEBUNDEN: MITTELFELD ---------- */
{ id:"wp_ballgewinn", kon:["zdm_abraeumer"], r:"normal", pos:["ZDM","ZM"], n:"Ballräuber", t:"Du eroberst mehr Bälle als der Rest der Mannschaft zusammen.", fx:()=>({ def:5, phy:3 }) },
{ id:"wp_metronom", kon:["zdm_metronom"], r:"selten", pos:["ZDM","ZM"], n:"Immer im Takt", t:"Das Tempo deiner Mannschaft ist dein Tempo.", fx:()=>({ pas:7, note:.1, dri:2 }) },
{ id:"wp_boxtobox", kon:["zdm_box"], r:"selten", pos:["ZM"], n:"Zwei Strafräume", t:"Du bist in beiden Strafräumen gefährlich und dazwischen überall.", fx:()=>({ phy:5, pac:4, sho:3, pas:3, fitness:8 }) },
{ id:"wp_letzterpass", kon:["zm_regisseur"], r:"aussen", pos:["ZM","ZOM"], n:"Der Schlüsselpass", t:"Du siehst Lösungen, die es aus Sicht der Kamera gar nicht gibt.", fx:()=>({ pas:9, dri:4, assistMod:.36, note:.1 }) },
{ id:"wp_fernschuss", kon:["zm_distanz"], r:"selten", pos:["ZM","ZOM","ZDM"], n:"Aus zwanzig Metern", t:"Aus fünfundzwanzig Metern denkst du nicht lange nach.", fx:()=>({ sho:7, goalMod:.16 }) },
{ id:"wp_regisseur", kon:["zm_regisseur","zdm_regista"], r:"unfass", pos:["ZM","ZOM"], n:"Regisseur einer Ära", t:"Mannschaften werden um Spieler wie dich herum gebaut.", fx:()=>({ pas:11, dri:6, assistMod:.5, note:.16, trust:18, rep:14 }) },

/* ---------- POSITIONSGEBUNDEN: ANGRIFF ---------- */
{ id:"wp_dribbler", kon:["zom_dribbler"], r:"normal", pos:["AF","ZOM"], n:"Kein Verteidiger hält dich", t:"Im Duell mit dem Verteidiger bist du der Favorit.", fx:()=>({ dri:6, pac:2 }) },
{ id:"wp_tempo", kon:["af_tiefe"], r:"selten", pos:["AF","ST"], n:"Eine Länge voraus", t:"Der Ball in die Schnittstelle, und du bist weg.", fx:()=>({ pac:7, sho:3, goalMod:.14 }) },
{ id:"wp_wandspieler", kon:["st_wand"], r:"selten", pos:["ST"], n:"Prellbock", t:"Du hältst jeden Ball fest und legst ab, als hättest du Augen im Rücken.", fx:()=>({ phy:7, pas:5, assistMod:.2 }) },
{ id:"wp_kaltblut", kon:["st_vollstr"], r:"aussen", pos:["ST","AF"], n:"Eiskalt vor dem Tor", t:"Eine halbe Chance genügt dir.", fx:()=>({ sho:9, goalMod:.34, flag:"elfer" }) },
{ id:"wp_kopfjaeger", kon:["st_kopf","iv_kopf"], r:"aussen", pos:["ST"], n:"Kopfballungeheuer", t:"Jede Flanke in den Sechzehner ist eine Torchance.", fx:()=>({ phy:7, sho:6, goalMod:.26 }) },
{ id:"wp_neuner", kon:["st_vollstr"], r:"unfass", pos:["ST"], n:"Der geborene Neuner", t:"Du wirst Tore machen, solange du auf dem Platz stehst.", fx:()=>({ sho:11, phy:5, goalMod:.6, rep:16 }) },
{ id:"wp_flügelstar", r:"unfass", pos:["AF"], n:"Unaufhaltsam über außen", t:"Kein Außenverteidiger dieser Liga schläft vor einem Spiel gegen dich.", fx:()=>({ dri:10, pac:8, goalMod:.3, assistMod:.3, rep:14 }) },

/* ---------- WELTMEISTERLICH ---------- */
/* ---------- ÜBER DEN META-FORTSCHRITT FREIGESCHALTET ---------- */
{ id:"mw_bollwerk", r:"unfass", req:"mw_bollwerk", pos:["TW","IV","AV","ZDM"], n:"Letzte Bastion", t:"Hinter dir ist Schluss. Freigeschaltet mit 500 weißen Westen.", fx:()=>({ def:9, phy:5, csMod:.4, note:.12, injuryProne:-14 }) },
{ id:"mw_kontinent", r:"welt", req:"mw_kontinent", n:"Kontinentalheld", t:"Die großen Nächte gehören dir. Freigeschaltet mit fünfzehn Europapokalen.", fx:()=>({ bigGame:.5, rep:20, note:.12, goalMod:.18, assistMod:.18 }) },
{ id:"mw_kosmopolit", r:"aussen", req:"mw_kosmopolit", n:"Weltbürger", t:"Überall sofort zu Hause. Freigeschaltet nach fünfzehn Ländern.", fx:()=>({ offers:2, trust:16, morale:14, flag:"sprache2" }) },
{ id:"mw_auserwaehlt", r:"goat", req:"mw_auserwaehlt", n:"Der Erwählte", t:"Alles zugleich. Freigeschaltet mit zehn weltmeisterlichen Karten.", fx:()=>({ pot:24, dev:.34, rep:26, slowDecay:.5, injuryProne:-26, note:.14 }) },
{ id:"mw_pionierin", r:"welt", req:"mw_pionierin", n:"Wegbereiterin", t:"Du veränderst, wie man über das Spiel redet. Freigeschaltet mit 25 Laufbahnen im Frauenfußball.", fx:()=>({ rep:26, legacy:30, dev:.2, morale:14, ntBonus:8 }) },
{ id:"mw_schattenmann", r:"unfass", req:"mw_schattenmann", n:"Der Schattenmann", t:"Du kennst Wege, die andere nicht sehen. Freigeschaltet nach fünf Skandalen.", fx:()=>({ money:3, wageMult:.3, offers:2, rep:-10, trust:-8 }) },
{ id:"mw_ausdauer", r:"selten", req:"mw_ausdauer", n:"Unermüdlich", t:"Dein Körper kennt keine Pause. Freigeschaltet durch eine Laufbahn im Frauenfußball.", fx:()=>({ phy:5, fitness:14, slowDecay:.18, injuryProne:-10 }) },
{ id:"mw_ikone", r:"aussen", req:"mw_ikone", n:"Stadionikone", t:"Man kennt dich, bevor du ein Spiel gemacht hast. Freigeschaltet als Vereinslegende.", fx:()=>({ rep:24, trust:18, loyalBonus:1.5, morale:12, legacy:14 }) },
{ id:"mw_pechlos", r:"unfass", req:"mw_pechlos", n:"Vom Glück verfolgt", t:"Was schiefgehen kann, geht bei dir gut aus. Freigeschaltet mit der ersten GOAT-Karte.", fx:()=>({ injuryProne:-30, injMod:-.5, note:.1, bigGame:.25, morale:14 }) },
{ id:"mw_zwilling", r:"aussen", req:"mw_zwilling", n:"Zweitgeboren", t:"Auf jeder Position sofort brauchbar. Freigeschaltet, nachdem du überall gespielt hast.", fx:()=>({ pac:4, sho:4, pas:4, dri:4, def:4, phy:4, offers:1 }) },
{ id:"mw_lehrmeis", r:"welt", req:"mw_lehrmeis", n:"Schule des Lebens", t:"Du lernst schneller als alle anderen. Freigeschaltet als Weltmeister.", fx:()=>({ dev:.28, pot:12, note:.08, trust:12 }) },
{ id:"mw_phoenix", r:"welt", req:"mw_phoenix", n:"Wiederauferstehung", t:"Nach jedem Rückschlag kommst du stärker zurück. Freigeschaltet mit 900 Vermächtnispunkten.", fx:()=>({ injMod:-.4, slowDecay:.4, dev:.16, morale:16, fitness:12 }) },
{ id:"mw_urgestein", r:"unfass", req:"mw_urgestein", n:"Urgestein", t:"Du spielst, bis andere längst Trainer sind. Freigeschaltet mit 600 Pflichtspielen.", fx:()=>({ slowDecay:.55, injuryProne:-22, fitness:14, loyalBonus:1 }) },
{ id:"mw_erbe", r:"goat", req:"mw_erbe", n:"Das Erbe", t:"Alles, was vor dir war, fließt in dich ein. Freigeschaltet mit zwanzig Titeln.", fx:()=>({ pot:20, dev:.26, rep:24, trust:16, legacy:24, note:.1 }) },

/* ---------- Außer der Reihe ---------- */
{ id:"w_nurderhsv", r:"hsv", n:"NUR DER HSV",
  t:"Scheiß auf Schule und Arbeit, das macht mich nicht glücklich – sieben Tage die Woche denk' ich an dich: HSV!",
  fx:()=>({ flag:"nurderhsv" }) },

{ id:"ww_ausnahme", r:"welt", n:"Ausnahmeerscheinung", t:"Einmal pro Jahrzehnt kommt jemand wie du. Alles ist angelegt, es fehlt nur die Karriere.", fx:()=>({ pot:19, dev:.24, rep:22, note:.1 }) },
{ id:"ww_turnierheld", r:"welt", n:"Turnierspieler", t:"Bei den großen Turnieren spielst du auf einem Niveau, das dir sonst niemand zutraut.", fx:()=>({ ntBonus:16, ntStanding:32, bigGame:.45, rep:20, note:.08 }) },
{ id:"ww_titanenkoerper", r:"welt", n:"Körper aus Granit", t:"Verletzungen und Alter scheinen an dir vorbeizugehen.", fx:()=>({ injuryProne:-52, injMod:-.8, slowDecay:.6, fitness:16, phy:6 }) },
{ id:"ww_torfabrik", r:"welt", pos:["ST","AF","ZOM"], n:"Torfabrik", t:"Deine Zahlen werden Jahr für Jahr die Liga anführen.", fx:()=>({ sho:10, goalMod:.62, pot:10, rep:18 }) },
{ id:"ww_festung", r:"welt", pos:["TW","IV","ZDM","AV"], n:"Bollwerk einer Generation", t:"Mannschaften mit dir kassieren einfach kaum Gegentore.", fx:()=>({ def:11, phy:6, csMod:.45, pot:10, note:.14, rep:16 }) },
{ id:"ww_spielmacher", r:"welt", pos:["ZM","ZOM","ZDM"], n:"Der Taktgeber", t:"Solange du auf dem Platz stehst, spielt deine Mannschaft nach deinen Regeln.", fx:()=>({ pas:12, dri:6, assistMod:.55, note:.18, pot:9, trust:18 }) },
{ id:"ww_weltstar", r:"welt", n:"Global vermarktbar", t:"Trikots mit deinem Namen verkaufen sich auf jedem Kontinent.", fx:()=>({ rep:32, money:6, wageMult:.45, offers:3, dreamOffer:true, pot:8 }) },
{ id:"ww_kapitaen2", r:"welt", n:"Anführer einer Ära", t:"Du wirst Kapitän von Verein und Nationalmannschaft — und beide werden dich vermissen.", fx:()=>({ flag:"kapitaen", trust:30, rep:22, legacy:34, ntBonus:10, morale:14, pot:7 }) },
{ id:"ww_ewig", r:"welt", n:"Zwanzig Jahre auf höchstem Niveau", t:"Andere hören auf, wenn du gerade erst deine besten Jahre hast.", fx:()=>({ slowDecay:.62, pot:12, fitness:14, injuryProne:-24, dev:.14 }) },
{ id:"ww_doppelbegabung", r:"welt", n:"Zwei Weltklassefüße", t:"Es gibt keinen schwachen Fuß, keine schwache Seite, keine schwache Zone.", fx:()=>({ pac:6, sho:7, pas:7, dri:7, def:5, phy:5, pot:8 }) },
];
const wcByRarity = (r) => WILDCARDS.filter((w) => w.r === r);
/* Zieht eine Karte. Positionsgebundene Karten erscheinen nur für die
   passende Position, und eine bereits gezogene wird ausgeschlossen.   */
/* Die Rautekarte wird außerhalb der normalen Stufen gezogen. Sie beginnt
   bei 0,1 Prozent und steigt nach jeder abgeschlossenen Laufbahn ohne sie
   um 0,12 Punkte. Wird sie gezogen, geht es wieder bei 0,1 los.
   Damit liegt der Median bei rund 33 Laufbahnen.
   Der Zähler liegt unter HSV_KEY und übersteht das Beenden des Spiels.  */
const HSV_KARTE = "w_nurderhsv";
function hsvChance(zaehler) { return clamp(.001 + Math.max(0, zaehler || 0) * .0012, .001, .95); }

function drawWildcard(pos, exclude, typeId, meta, gesehen, hsvZaehler) {
  if (exclude !== HSV_KARTE && chance(hsvChance(hsvZaehler))) {
    const k = WILDCARDS.find((w) => w.id === HSV_KARTE);
    if (k) return k;
  }
  /* Karten, die denselben Gedanken tragen wie der gewählte Spielertyp,
     werden übersprungen — sonst stünde dasselbe zweimal im Pass.
     Freigeschaltete Karten kommen erst dazu, wenn sie verdient sind. */
  const frei = (w) => !w.req || (meta && meta[w.req]);
  /* Was eine freigeschaltete Belohnung bereits leistet, wird nicht noch
     einmal als Karte gezogen — sonst stünde dasselbe doppelt im Pass. */
  const metaSperre = new Set();
  if (meta) Object.keys(meta).forEach((k) => {
    if (meta[k] && META[k] && META[k].sperrt) META[k].sperrt.forEach((id) => metaSperre.add(id));
  });
  const passt = (w) => (!w.pos || !pos || w.pos.includes(pos)) && w.id !== exclude
    && !(typeId && w.kon && w.kon.includes(typeId)) && frei(w) && !metaSperre.has(w.id);
  /* Glückssträhne verschiebt Gewicht von den unteren auf die oberen Stufen */
  const bonus = meta ? (meta.mr_4 ? .52 : meta.mr_3 ? .36 : meta.mr_2 ? .22 : meta.mr_1 ? .12 : 0) : 0;
  const SCHUB = { normal:-1, selten:-.45, aussen:.15, unfass:.7, welt:1.15, goat:1.6 };
  /* Nur Stufen mit echtem Gewicht kommen in die Ziehung. Sonderstufen wie
     die Raute werden eigens gezogen und hätten die Rechnung sonst zerlegt. */
  const stufen = Object.keys(RARITY).filter((k) => RARITY[k].w > 0 && SCHUB[k] != null);
  const gew = {};
  stufen.forEach((k) => { gew[k] = Math.max(.2, RARITY[k].w * (1 + bonus * SCHUB[k])); });
  const tot = stufen.reduce((a, k) => a + gew[k], 0);
  let x = Math.random() * tot, key = stufen[0] || "normal";
  for (const k of stufen) { x -= gew[k]; if (x <= 0) { key = k; break; } }
  let pool = wcByRarity(key).filter(passt);
  if (!pool.length) pool = WILDCARDS.filter(passt);
  if (!pool.length) pool = WILDCARDS.filter((w) => !w.req);
  /* Karten aus den letzten Laufbahnen treten zurück, damit sich nicht
     immer dieselben wiederholen.                                      */
  if (gesehen && pool.length > 3) {
    const gew = pool.map((w) => 1 / (1 + 1.6 * Math.min(gesehen[w.id] || 0, 4)));
    const tot2 = gew.reduce((a, b) => a + b, 0);
    let y = Math.random() * tot2;
    for (let i = 0; i < pool.length; i++) { y -= gew[i]; if (y <= 0) return pool[i]; }
  }
  return pool.length ? pick(pool) : pick(WILDCARDS);
}
/* Ausgangszustand sichern, damit die Karte einmal getauscht werden kann */
function snapWildcardBase(p) {
  p.wcBase = { attrs:{ ...p.attrs }, potential:p.potential, money:p.money, rep:p.rep,
    trust:p.trust, morale:p.morale, fitness:p.fitness, injuryProne:p.injuryProne,
    legacyBonus:p.legacyBonus, flags:{ ...p.flags }, contract:p.contract,
    ntStanding:p.nt.standing, assets:[ ...p.assets ] };
  return p;
}
/* Alles, was die Rautekarte auslöst. */
/* Normalerweise ist bei 99 Schluss. Wer es sich verdient hat, geht darüber
   hinaus — und das wird dann auch deutlich sichtbar gemacht.           */
const wertGrenze = (p) => (p && (p.flags.nurderhsv || (p.meta && p.meta.mx_ueber99))) ? 112 : 99;
const ueber99 = (v) => v > 99;

function hsvEinrichten(p) {
  const hsv = CLUBS.find((c) => c.n === "Hamburger SV" && c.g === p.g)
    || CLUBS.find((c) => c.n === "Hamburger SV");
  if (hsv) { p.club = hsv; p.squad = makeSquad(hsv, p.g); p.youthClub = hsv.n; }
  p.potential = clamp(Math.round(p.potential * 1.3), 42, 130);
  p.rep = 100; p.morale = 100; p.form = 100; p.trust = 96;
  p.contract = Math.max(p.contract, 4);
  p.wcMod.dev += .3; p.wcMod.loyalBonus += 3;
  p.flags.nurderhsv = true;
  p.mv = marketValue(p); p.wage = wageFor(p, p.club);
  return p;
}
/* Hält, was die Karte verspricht — Saison für Saison. */
function hsvHalten(p) {
  if (!p.flags.nurderhsv) return;
  p.rep = 100; p.morale = 100; p.form = 100;
  p.trust = Math.max(p.trust, 90);
}

/* Wie oft darf getauscht werden? Eine Stelle, drei Quellen:
   Grundrecht 1 · Freischaltung „mx_reroll" +1 · gekaufter Artikel „reroll" +1.
   Die Zahl steht NUR hier — `rerollWildcard` und `tauschRest` lesen dieselbe
   Funktion. Stünde sie an zwei Stellen, könnte der Knopf sichtbar sein, ohne
   dass der Tausch durchgeht. */
const tauschMax = (p) => 1
  + ((p && p.meta && p.meta.mx_reroll) ? 1 : 0)
  + ((p && p.laden && p.laden.reroll) ? 1 : 0);

function rerollWildcard(p) {
  const b = p.wcBase;
  const maxTausch = tauschMax(p);
  if (!b || (p.wcRerolls || 0) >= maxTausch || p.seasons.length) return p;
  p.attrs = { ...b.attrs }; p.potential = b.potential; p.money = b.money;
  p.rep = b.rep; p.trust = b.trust; p.morale = b.morale; p.fitness = b.fitness;
  p.injuryProne = b.injuryProne; p.legacyBonus = b.legacyBonus;
  p.flags = { ...b.flags }; p.contract = b.contract; p.assets = [ ...b.assets ];
  p.nt.standing = b.ntStanding;
  applyWildcard(p, drawWildcard(p.pos, p.wc ? p.wc.id : null, p.type && p.type.id, p.meta, p.wcSeen, p.hsvZaehler));
  if (p.flags.nurderhsv) hsvEinrichten(p);
  p.wcRerolls = (p.wcRerolls || 0) + 1;
  p.wcRerolled = true;
  return p;
}
const tauschRest = (p) => tauschMax(p) - (p.wcRerolls || 0);
/* Wirkung der Karte auf den frisch angelegten Spieler übertragen */
function applyWildcard(p, card) {
  const f = typeof card.fx === "function" ? card.fx(p) : (card.fx || {});
  p.wc = { id: card.id, n: card.n, r: card.r, t: card.t };
  p.wcMod = { dev:0, slowDecay:0, injMod:0, note:0, wageMult:0, offers:0,
    ntBonus:0, goalMod:0, assistMod:0, csMod:0, bigGame:0, loyalBonus:0 };
  Object.keys(p.wcMod).forEach((k) => { if (f[k]) p.wcMod[k] += f[k]; });
  AK.forEach((k) => { if (f[k]) p.attrs[k] = clamp(p.attrs[k] + f[k], 8, wertGrenze(p)); });
  if (f.ovrBoost) AK.forEach((k) => { p.attrs[k] = clamp(p.attrs[k] + f.ovrBoost, 8, wertGrenze(p)); });
  if (f.pot) p.potential = clamp(p.potential + f.pot, 42, wertGrenze(p));
  if (f.money) p.money = Math.max(0, p.money + f.money);
  if (f.rep) p.rep = clamp(p.rep + f.rep, 0, 100);
  if (f.trust) p.trust = clamp(p.trust + f.trust, 3, 98);
  if (f.morale) p.morale = clamp(p.morale + f.morale, 5, 100);
  if (f.fitness) p.fitness = clamp(p.fitness + f.fitness, 20, 100);
  if (f.injuryProne) p.injuryProne = clamp(p.injuryProne + f.injuryProne, 2, 95);
  if (f.legacy) p.legacyBonus += f.legacy;
  if (f.flag) p.flags[f.flag] = true;
  if (f.dreamOffer) p.flags.dreamOffer = true;
  if (f.riskEvents) p.flags.riskEvents = true;
  if (f.contract) p.contract += f.contract;
  if (f.ntStanding) p.nt.standing = clamp(p.nt.standing + f.ntStanding, -40, 45);
  if (f.asset && !p.assets.includes(f.asset)) p.assets.push(f.asset);
  if (f.asset2 && !p.assets.includes(f.asset2)) p.assets.push(f.asset2);
  p.ovr = ovrOf(p.attrs, p.pos);
  p.peakOvr = Math.max(p.peakOvr, p.ovr);
  p.mv = marketValue(p);
  p.wage = wageFor(p, p.club);
  return p;
}

/* ---------------- Spieler und Motor ---------------- */
const FBACK = { name: "ein Mitspieler", age: 27, ovr: 70, pos: "ZM", cc: "GER" };
/* Fortlaufende Nummer je Laufbahn. Damit lässt sich sicher unterscheiden,
   ob eine Einblendung noch zur alten oder schon zur neuen Karriere gehört. */
let laufZaehler = Date.now();

function createPlayer(cfg) {
  const nat = NATIONS.find((n) => n.id === cfg.nation) || NATIONS[0];
  const posOk = typesFor(cfg.pos);
  const type = posOk.find((t) => t.id === cfg.type)
    || TYPES.find((t) => t.id === cfg.type)      // alte Spielstände behalten ihren Typ
    || posOk[0] || TYPES[0];
  const mode = MODES.find((m) => m.id === cfg.mode) || MODES[1];
  const attrs = {};
  AK.forEach((k) => { attrs[k] = clamp(Math.round(34 + POS[cfg.pos].w[k] * 62 + rnd(-5, 5) + (type.mod[k] || 0)), 12, 70); });
  const start = ovrOf(attrs, cfg.pos);
  const g = cfg.gender === "w" ? "w" : "m";
  const leagues = homeLeagues(nat.id, g);
  const pool = CLUBS.filter((c) => c.g === g && leagues.includes(c.l));
  const club = cfg.club ? (CLUBS.find((c) => c.n === cfg.club) || pick(pool) || CLUBS[0])
    : (pick(pool.filter((c) => c.s <= (g === "w" ? 74 : 66))) || pick(pool) || CLUBS[0]);
  const p = {
    name: (cfg.name || "").trim() || "Der Namenlose", nation: nat, pos: cfg.pos, foot: cfg.foot,
    number: cfg.number, avatar: cfg.avatar ?? ri(1, 999999), zuege: cfg.zuege || null, type, mode, g, bei: cfg.bei || "",
    statur: cfg.statur || "normal",
    lauf: ++laufZaehler,                        // eindeutige Kennung dieser Laufbahn
    traum: cfg.traum || null, traumMale: 0,
    speed: !!cfg.speed,
    age: 16, year: 2026, attrs,
    potential: clamp(Math.round(start + rnd(16, 44) + mode.pot + gauss(0, 4)), start + 6, 95),
    ovr: start, peakOvr: start, form: 55, fitness: 78, morale: 70, trust: 45, rep: 12,
    injuryProne: clamp(30 + (type.inj || 0) + mode.inj + ri(-8, 8), 5, 80),
    club, squad: makeSquad(club, g), contract: 3, wage: .02, money: .01,
    assets: [], depot: {}, donated: 0, legacyBonus: 0, milestones: [],
    life: { status:"single", partner:null, kids:0, weddingY:null, since:null },
    wageAsk: "markt", prevClub: null, loanHome: null,
    role: "bench", lastNote: 3.5, training: "taktik",
    nt: { level:"none", caps:0, goals:0, standing:0, majors:[], rolle:null, kapitaen:false,
          u:{ U17:0, U19:0, U21:0 }, uCaps:0, uGoals:0 },
    tot: { apps:0, goals:0, assists:0, cs:0, seasons:0, topSeasons:0, mins:0 },
    trophies: [], awards: [], seasons: [], traits: [type.trait], flags: {}, evLog: {}, tagLog: {},
    ban: 0, endNow: null, europeNext: null,
  };
  p.wcMod = { dev:0, slowDecay:0, injMod:0, note:0, wageMult:0, offers:0,
    ntBonus:0, goalMod:0, assistMod:0, csMod:0, bigGame:0, loyalBonus:0 };
  p.evSeen = cfg.seen || {};
  p.wcSeen = cfg.wcSeen || {};
  p.hsvZaehler = Math.max(0, cfg.hsvZaehler || 0);
  p.mv = marketValue(p);
  p.wage = wageFor(p, club);
  /* Freigeschaltete Startvorteile, bevor die Karte gezogen wird */
  /* Die Statur verschiebt die Anlagen leicht */
  const ST = { schlank:{ pac:3, phy:-3 }, kraftvoll:{ phy:4, pac:-3 },
    hochgewachsen:{ phy:3, sho:1, dri:-3 }, normal:{} }[cfg.statur || "normal"] || {};
  AK.forEach((k) => { if (ST[k]) p.attrs[k] = clamp(p.attrs[k] + ST[k], 8, 99); });
  p.ovr = ovrOf(p.attrs, p.pos);
  const M = cfg.meta || {};
  if (M.ms_geld)    p.money += .12;
  if (M.ms_anlage)  p.potential = clamp(p.potential + 2, 42, 99);
  if (M.ms_talent)  p.potential = clamp(p.potential + 5, 42, 99);
  if (M.ms_ruf)     p.rep = clamp(p.rep + 8, 0, 100);
  if (M.ms_koerper) p.injuryProne = clamp(p.injuryProne - 8, 2, 95);
  if (M.ms_vertrag) p.contract += 1;
  if (M.mx_ntbonus) p.wcMod.ntBonus += 3;
  if (M.mx_offers)  p.wcMod.offers += 1;
  p.meta = M;
  /* Was die Jugendakademie einer neuen Laufbahn mitgibt — fest gedeckelt */
  const AB = akaBonus(cfg.aka);
  if (AB.pot)   p.potential = clamp(p.potential + AB.pot, 42, 99);
  if (AB.rep)   p.rep = clamp(p.rep + AB.rep, 0, 100);
  if (AB.money) p.money += AB.money;
  if (AB.dev)   p.wcMod.dev += AB.dev;
  p.aka = AB;
  snapWildcardBase(p);
  applyWildcard(p, cfg.wildcard || drawWildcard(p.pos, null, type.id, M, cfg.wcSeen, cfg.hsvZaehler));
  if (p.flags.nurderhsv) hsvEinrichten(p);
  return p;
}

function applyFx(p, f, log) {
  if (!f) return;
  AK.forEach((k) => { if (f[k]) p.attrs[k] = clamp(p.attrs[k] + f[k], 5, wertGrenze(p)); });
  const S = { form:[0,100], morale:[0,100], fitness:[0,100], trust:[0,100], rep:[0,100], injuryProne:[3,95] };
  Object.keys(S).forEach((k) => { if (f[k] != null) p[k] = clamp(p[k] + f[k], S[k][0], S[k][1]); });
  if (f.pot) p.potential = clamp(p.potential + f.pot, 40, 97);
  if (f.money) p.money = Math.max(0, p.money + f.money);
  if (f.legacy) p.legacyBonus += f.legacy;
  if (f.flag) p.flags[f.flag] = true;
  if (f.clearInjuryFlag) p.flags.schwereVerletzung = false;
  if (f.ban) p.ban = 16;
  if (f.ban2) p.ban = (p.ban || 0) + f.ban2;
  if (f.forceInjury) p.pendingInjury = f.forceInjury;
  if (f.extend) p.contract += f.extend;
  if (f.freeAgent) p.contract = 0;
  if (f.penalty) p.flags.elfer = true;
  if (f.dreamOffer) p.flags.dreamOffer = true;
  if (f.wantLoan) p.flags.wantLoan = true;
  /* Dauerhafte Veränderungen, wie sie auch Wildcards setzen */
  if (p.wcMod) {
    const M = { dev:"dev", slow:"slowDecay", slowDecay:"slowDecay", injMod:"injMod",
      note:"note", wageMult:"wageMult", offers:"offers", ntBonus:"ntBonus",
      goalMod:"goalMod", assistMod:"assistMod", csMod:"csMod", bigGame:"bigGame",
      loyalBonus:"loyalBonus" };
    Object.keys(M).forEach((k) => { if (f[k] != null && k !== "note") p.wcMod[M[k]] += f[k]; });
  }
  if (f.fit) p.fitness = clamp(p.fitness + f.fit * 10, 0, 100);
  if (f.wantMove) { p.flags.wechselwunsch = true; p.flags.wechselwunschAlt = true; }
  if (f.winterMove) { p.flags.winterMove = true; p.flags.wechselwunsch = true; }
  /* Sofort wirksame Folgen */
  if (f.terminate) {                                   // Vertragsauflösung
    p.contract = 0; p.flags.wechselwunsch = true;
    p.flags.aufgeloestBis = p.seasons.length + 1;
    p.trust = clamp(p.trust - 20, 3, 98);
    if (log) log.push("Der Vertrag ist ab sofort aufgelöst — du bist ablösefrei.");
  }
  if (f.raise) {                                       // Gehaltserhöhung mit sofortiger Wirkung
    p.wage = Number((p.wage * (1 + f.raise)).toFixed(3));
    if (log) log.push("Dein Gehalt steigt sofort auf " + eur(p.wage) + " €.");
  }
  if (f.cut) {
    p.wage = Number((p.wage * (1 - f.cut)).toFixed(3));
    if (log) log.push("Dein Gehalt sinkt auf " + eur(p.wage) + " €.");
  }
  if (f.forceTransfer) {                               // Wechsel zum nächstmöglichen Zeitpunkt
    p.flags.wechselwunsch = true; p.flags.wechselwunschAlt = true;
    /* Gilt genau für das kommende Fenster und läuft danach von selbst ab */
    p.flags.mussWegBis = p.seasons.length + 1;
    p.trust = clamp(p.trust - 12, 3, 98);
    if (log) log.push("Der Verein plant nicht mehr mit dir — du wirst im nächsten Fenster wechseln.");
  }
  if (f.suspend) {                                     // Suspendierung
    p.flags.suspendiert = true; p.ban = (p.ban || 0) + (f.suspend || 6);
    p.trust = clamp(p.trust - 18, 3, 98);
    if (log) log.push("Du bist bis auf Weiteres suspendiert.");
  }
  if (f.captain) { p.flags.kapitaen = true; if (log) log.push("Du bist ab sofort Kapitän."); }
  if (f.buyAsset && !p.assets.includes(f.buyAsset)) {
    p.assets.push(f.buyAsset);
    if (log) log.push("Neu in deinem Besitz: " + (shopItem(f.buyAsset) ? shopItem(f.buyAsset).name : f.buyAsset) + ".");
  }
  if (f.instantOvr) { AK.forEach((k) => { p.attrs[k] = clamp(p.attrs[k] + f.instantOvr, 8, wertGrenze(p)); }); }
  if (f.ntBonus) p.nt.standing += f.ntBonus;
  if (f.ntPenalty) p.nt.standing -= f.ntPenalty;
  if (f.caps) p.nt.caps += f.caps;
  if (f.note) p.noteBonus = (p.noteBonus || 0) + f.note;
  if (f.endCareer) p.endNow = f.endCareer;
  if (f.partner) { p.life.partner = partnerName(p.nation.id); p.life.status = "beziehung"; p.life.since = p.year; }
  if (f.lifeStatus) p.life.status = f.lifeStatus;
  if (f.wedding) { p.life.status = "verheiratet"; p.life.weddingY = p.year + 1; }
  if (f.kids) p.life.kids += f.kids;
  if (f.split) {
    p.life.status = "getrennt";
    p.money = Math.max(0, p.money * (p.life.status === "verheiratet" || f.divorce ? .58 : .88));
    p.life.partner = null;
  }
  if (f.newPartner) { p.life.partner = partnerName(p.nation.id); p.life.status = "beziehung"; p.life.since = p.year; }
  if (f.repos && p.pos !== "TW") {
    /* repos:true schult auf eine benachbarte Position um,
       repos:"AF" setzt gezielt eine bestimmte Position.            */
    const near = { IV:["ZDM","AV"], AV:["AF","IV"], ZDM:["ZM","IV"], ZM:["ZOM","ZDM"], ZOM:["ZM","AF"], AF:["ZOM","ST"], ST:["AF","ZOM"] };
    const np = (typeof f.repos === "string" && POS[f.repos] && f.repos !== "TW")
      ? f.repos : pick(near[p.pos] || ["ZM"]);
    if (np !== p.pos) {
      p.pos = np; p.flags.umgeschult = true;
      p.ovr = ovrOf(p.attrs, p.pos);
      if (log) log.push("Neue Position: " + POS[np].label + ".");
    }
  }
}

function evCtx(p) {
  const o = p.squad && p.squad.length ? p.squad : [FBACK];
  const rival = rivalOf(o, p.pos);
  const byAge = [...o].sort((a, b) => a.age - b.age);
  return { p, club: p.club, mate: pick(o), rival, star: o[0] || FBACK,
    vet: byAge[byAge.length - 1] || FBACK, young: byAge[0] || FBACK,
    rivalOrMate: (rival || o[0] || FBACK).name,
    ls: p.seasons[p.seasons.length - 1] || null,
    conf: confOf(p.club.c), natconf: NAT_CONF[p.nation.id], nat: p.nation,
    pn: p.life.partner || partnerName(p.nation.id),
    prev: p.prevClub || "deinem alten Verein",
    land: p.club.c, liga: p.club.l };
}
function drawEvents(p, n) {
  const ctx = evCtx(p);
  const si = p.seasons.length;
  const probe = { ...p, rival: ctx.rival };
  const pool = EVENTS.filter((e) => {
    const last = p.evLog[e.id];
    if (last != null && !(e.rep && si - last >= e.rep)) return false;
    if (e.g && e.g !== p.g) return false;
    if (e.req && !(p.meta && p.meta[e.req])) return false;   // erst nach Freischaltung
    if (e.pos && !e.pos.includes(p.pos)) return false;      // nur für bestimmte Positionen
    if (e.nopos && e.nopos.includes(p.pos)) return false;   // für diese Positionen unsinnig
    if (e.cond) { try { if (!e.cond(probe)) return false; } catch { return false; } }
    return true;
  });
  if (!pool.length) return [];
  /* Gewicht: kürzlich gezogene Themen werden zurückgestellt, damit sich
     nicht Saison für Saison dieselben Situationen wiederholen. */
  p.tagLog = p.tagLog || {};
  const weigh = (e) => {
    let w = e.w || 2;
    const lastTag = p.tagLog[e.tag];
    if (lastTag != null) {
      const d = si - lastTag;
      w *= d <= 0 ? .15 : d === 1 ? .40 : d === 2 ? .70 : 1;
    }
    const lastId = p.evLog[e.id];
    if (lastId != null) w *= .45;                       // schon einmal erlebt
    /* Was in den letzten Laufbahnen schon vorkam, tritt zurück, damit sich
       nicht über Karrieren hinweg dieselben Situationen wiederholen.      */
    const frueher = p.evSeen && p.evSeen[e.id];
    if (frueher) w *= 1 / (1 + 1.15 * Math.min(frueher, 4));
    /* Beim Wunschverein rücken die passenden Ereignisse etwas nach vorn */
    if (e.tag === "Wunschverein") w *= 1.45;
    if (e.fresh && si === 0) w *= 3;                    // Einstiegsereignisse zuerst
    if (e.late && p.age < 26) w *= .3;
    return Math.max(.05, w);
  };
  const out = [], usedTags = new Set();
  const target = Math.min(n, pool.length);
  let guard = 0;
  while (out.length < target && guard++ < 300) {
    const cand = pool.filter((e) => !out.includes(e) && !usedTags.has(e.tag));
    const list = cand.length ? cand : pool.filter((e) => !out.includes(e));
    if (!list.length) break;
    const tot = list.reduce((a, e) => a + weigh(e), 0);
    let r = Math.random() * tot, hit = list[list.length - 1];
    for (const e of list) { r -= weigh(e); if (r <= 0) { hit = e; break; } }
    out.push(hit); usedTags.add(hit.tag);
    p.tagLog[hit.tag] = si;
  }
  out.sort((a, b) => phaseOf(a) - phaseOf(b));
  return out.map((e) => ({ ...e, _ctx: ctx }));
}
/* ---- Weibliche Formen ----------------------------------------------------
   Die 2.700 Ereignistexte sind in männlicher Form geschrieben. Sie alle
   doppelt zu pflegen wäre nicht durchzuhalten — bei jeder Änderung müsste
   man an zwei Stellen denken, und irgendwann vergisst man eine.

   Stattdessen läuft der fertige Text durch eine Umformung. `evText` ist der
   EINZIGE Punkt, an dem Ereignistexte ausgewertet werden; was hier greift,
   greift überall: Titel, Fliesstext, Auswahlmöglichkeiten, Ergebnisse.

   Achtung bei der Reihenfolge: längere Wörter zuerst, sonst macht
   „Nationalspieler" den Umweg über „Spieler" und wird zu „Nationalspielerin"
   … was zwar stimmt, aber nur zufällig. Zusammengesetzte stehen deshalb oben.

   Im Frauenfussball sind auch die ANDEREN weiblich: Mitspielerinnen, die
   Kapitänin, die Trainerin gibt es hier nicht automatisch — der Trainer kann
   ein Mann sein, deshalb bleibt „Trainer" stehen. Nur Personen, die
   zwangsläufig Spielerinnen sind, werden umgeformt.                        */
/* Die Wörter, die im Frauenfussball weiblich werden. Trainer bleibt Trainer:
   der kann auch bei einer Frauenmannschaft ein Mann sein. */
const W_WORT = [
  ["Nationalspieler", "Nationalspielerin"], ["Mitspieler", "Mitspielerin"],
  ["Torjäger", "Torjägerin"], ["Torhüter", "Torhüterin"], ["Kapitän", "Kapitänin"],
  ["Spieler", "Spielerin"], ["Stürmer", "Stürmerin"], ["Verteidiger", "Verteidigerin"],
  ["Verlierer", "Verliererin"], ["Sieger", "Siegerin"],
];
/* Begleiter, die sich mitändern. Ohne sie entsteht „Der Kapitänin" und
   „Ein Mitspielerin" — genau das kam beim ersten Versuch heraus. */
const W_ARTIKEL_ROH = [
  ["der", "die"], ["ein", "eine"], ["dein", "deine"], ["kein", "keine"],
  ["einen", "eine"], ["deinen", "deine"], ["keinen", "keine"],
  ["dem", "der"], ["einem", "einer"], ["deinem", "deiner"],
  ["des", "der"], ["eines", "einer"], ["unser", "unsere"],
  ["jeder", "jede"], ["dieser", "diese"], ["unserem", "unserer"],
];
/* Gross- und Kleinschreibung automatisch — beim ersten Versuch stand nur die
   Kleinschreibung in der Liste, und „Dem Kapitän" blieb unverändert stehen. */
const gross = (w) => w.charAt(0).toUpperCase() + w.slice(1);
const W_ARTIKEL = W_ARTIKEL_ROH.flatMap(([m, w]) => [[m, w], [gross(m), gross(w)]]);
/* Was einen Plural ankündigt: danach heisst es Spielerinnen, nicht Spielerin. */
const W_PLURAL_ROH = ["zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun",
  "zehn", "elf", "zwölf", "viele", "einige", "alle", "beide", "mehrere", "die", "keine",
  "andere", "unsere", "diese", "manche"];
const W_PLURAL = "(?:" + W_PLURAL_ROH.concat(W_PLURAL_ROH.map(gross)).join("|") + "|\\d+)";

/* Aus den Listen werden einmalig die Ersetzungen gebaut — nicht bei jedem
   Aufruf, das liefe sonst tausendfach je Saison. Reihenfolge: erst Plural,
   dann Artikel + Wort, zuletzt das nackte Wort. Längere Wörter zuerst, sonst
   greift „Spieler" schon in „Nationalspieler". */
const WEIBLICH = (() => {
  const aus = [];
  W_WORT.forEach(([m, w]) => {
    /* Plural: „zwei Spieler" → „zwei Spielerinnen" */
    aus.push([new RegExp("\\b(" + W_PLURAL + ")\\s+" + m + "\\b", "g"), "$1 " + w + "nen"]);
    aus.push([new RegExp("\\b(" + W_PLURAL + ")\\s+" + m + "n\\b", "g"), "$1 " + w + "nen"]);
    /* Artikel + Wort */
    W_ARTIKEL.forEach(([am, aw]) => {
      aus.push([new RegExp("\\b" + am + "\\s+" + m + "\\b", "g"), aw + " " + w]);
      aus.push([new RegExp("\\b" + am + "\\s+" + m + "s\\b", "g"), aw + " " + w]);
    });
    /* nacktes Wort, zuletzt */
    aus.push([new RegExp("\\b" + m + "s\\b", "g"), w]);
    aus.push([new RegExp("\\b" + m + "\\b", "g"), w]);
  });
  /* Wendungen über die Person selbst */
  [["du bist einer", "du bist eine"], ["Du bist einer", "Du bist eine"],
   ["du warst einer", "du warst eine"], ["Du warst einer", "Du warst eine"],
   ["einer davon", "eine davon"], ["einer von", "eine von"],
   ["als Erster", "als Erste"], ["Als Erster", "Als Erste"],
   ["als Bester", "als Beste"], ["Als Bester", "Als Beste"],
   ["als Einziger", "als Einzige"], ["Als Einziger", "Als Einzige"],
   ["als Letzter", "als Letzte"], ["Als Letzter", "Als Letzte"],
   ["der Einzige", "die Einzige"], ["Der Einzige", "Die Einzige"],
   ["der Beste", "die Beste"], ["Der Beste", "Die Beste"],
   ["der Erste", "die Erste"], ["Der Erste", "Die Erste"],
   ["ein Junge", "ein Mädchen"], ["der Junge", "das Mädchen"],
  ].forEach(([m, w]) => aus.push([new RegExp("\\b" + m + "\\b", "g"), w]));
  return aus;
})();
const weiblichForm = (t) => {
  let x = String(t);
  for (let i = 0; i < WEIBLICH.length; i++) x = x.replace(WEIBLICH[i][0], WEIBLICH[i][1]);
  return x;
};
const evText = (v, ctx) => {
  const t = typeof v === "function" ? v(ctx) : v;
  if (t == null) return t;
  const p = ctx && ctx.p;
  return (p && p.g === "w") ? weiblichForm(t) : t;
};

function develop(p) {
  const t = TRAINING.find((x) => x.id === p.training) || TRAINING[4];
  const gap = Math.max(0, p.potential - p.ovr);
  const mins = clamp((p.seasons.length ? p.seasons[p.seasons.length - 1].apps : 20) / 40, .25, 1.1);
  /* .22 → .28: die flachere Alterskurve hat weniger Fläche, dadurch blieb der
     Abstand zum Potenzial noch grösser als vorher (13 statt 12 Punkte). Der
     höhere Grundfaktor gleicht das aus, ohne den frühen Sprung zurückzubringen
     — der hängt an der Alterskurve, nicht hieran. */
  /* Gekaufte Extraschicht: eine Saison lang deutlich mehr Fortschritt. Der
     Faktor steht hier und nicht im Training, weil er unabhängig von der
     gewählten Einheit wirken soll. */
  const schicht = (p.laden && p.laden.training) > 0 ? 1.85 : 1;
  const base = gap * .28 * schicht * growthAge(p.age - nachholJahre(gap)) * (t.mult ?? 1) * (.6 + mins * .5)
    * (.8 + p.morale / 340) * (.85 + p.trust / 380) * rnd(.75, 1.25)
    * (1 + perk(p, "dev") + (p.wcMod ? p.wcMod.dev : 0)) * (p.life.kids >= 2 ? .94 : 1);
  const dec = declineAge(p.age) * p.mode.decay
    * clamp(1 - perk(p, "slow") - (p.wcMod ? p.wcMod.slowDecay : 0) - (p.flags.schlaf ? .14 : 0), .18, 1);
  const biasSum = Object.values(t.bias).reduce((a, b) => a + b, 0) || 1;
  const before = { ...p.attrs };
  AK.forEach((k) => {
    let d = base * (((t.bias[k] || .35) / (biasSum + 2.1)) * 6);
    if (k === "pac" || k === "phy") d -= dec * 1.5;
    else if (k === "dri" || k === "def") d -= dec * .8;
    else if (k === "sho") d -= dec * .35;
    else d -= dec * .1;
    if (p.age >= 30 && (k === "pas" || k === "def")) d += .35;
    p.attrs[k] = clamp(Math.round(p.attrs[k] + d), 8, wertGrenze(p));
  });
  const diff = {};
  AK.forEach((k) => { const d = p.attrs[k] - before[k]; if (d) diff[k] = d; });
  p.ovr = ovrOf(p.attrs, p.pos);
  p.peakOvr = Math.max(p.peakOvr, p.ovr);
  p.injuryProne = clamp(p.injuryProne + (t.inj || 0) * .5 + Math.max(0, p.age - 28) * 1.4
    + perk(p, "inj"), 3, 95);
  p.fitness = clamp(p.fitness + (t.fit || 0) + perk(p, "fit") + rnd(-4, 6)
    - Math.max(0, p.age - 30) * 1.5 - p.life.kids * 1.2, 20, 100);
  /* Über das Limit: der beste Wert darf über 99. Die Obergrenze steckt sonst
     fest in `clamp(..., 99)` an vielen Stellen — hier wird sie nur für den
     einen Wert und nur für die gekaufte Zeit angehoben. */
  if ((p.laden && p.laden.ueber99) > 0) {
    let best = AK[0];
    AK.forEach((k) => { if (p.attrs[k] > p.attrs[best]) best = k; });
    if (p.attrs[best] >= 99) p.attrs[best] = Math.min(103, p.attrs[best] + 1);
    p.ovr = ovrOf(p.attrs, p.pos);
  }
  p.morale = clamp(p.morale + perk(p, "morale")
    + (p.life.status === "verheiratet" ? 2 : p.life.status === "beziehung" ? 1 : 0)
    + p.life.kids * 1.5 - (p.life.status === "getrennt" ? 3 : 0), 5, 100);
  p.rep = clamp(p.rep + perk(p, "rep"), 0, 100);
  hsvHalten(p);
  return diff;
}

/* Jahresabrechnung: Gehalt netto, Unterhalt, Kapitalerträge */
function finance(p) {
  const hasBerater = p.assets.includes("berater");
  const net = p.wage * clamp(.50 + perk(p, "net"), .4, .72);
  const lines = [{ t: "Gehalt netto", v: net }];
  let total = net;
  let up = 0;
  p.assets.forEach((id) => { const s = shopItem(id); if (s) up += s.up || 0; });
  if (up > 0) { lines.push({ t: "Unterhalt", v: -up }); total -= up; }
  Object.keys(p.depot).forEach((id) => {
    const it = investItem(id);
    if (!it || !(p.depot[id] > 0)) return;
    let r = rnd(it.lo, it.hi);
    if (hasBerater) r = r * .92 + .012;
    const gain = p.depot[id] * r;
    p.depot[id] = Math.max(0, p.depot[id] + gain);
    lines.push({ t: it.name, v: gain, dep: true });
  });
  const pi = perk(p, "income");
  if (pi > 0) { const g = pi * rnd(.6, 1.5); lines.push({ t: "Beteiligungen und Mieten", v: g }); total += g; }
  if (p.life.kids > 0 || p.life.status === "verheiratet") {
    const fam = p.life.kids * .022 + (p.life.status === "verheiratet" ? .03 : 0);
    lines.push({ t: "Familie", v: -fam }); total -= fam;
  }
  if (p.life.status === "getrennt" && p.life.kids > 0) {
    const u = p.life.kids * .03; lines.push({ t: "Unterhalt", v: -u }); total -= u;
  }
  if (p.assets.includes("restaurant")) { const g = rnd(-.1, .28); lines.push({ t: "Restaurant", v: g }); total += g; }
  if (p.assets.includes("anteile")) { const g = clubTopWage(p.club) * .07; lines.push({ t: "Dividende Vereinsanteile", v: g }); total += g; }
  if (p.assets.includes("akademie")) { const g = rnd(-.02, .09); lines.push({ t: "Akademie", v: g }); total += g; }
  p.money = Math.max(0, p.money + total);
  return lines;
}
const depotValue = (p) => Object.values(p.depot).reduce((a, b) => a + (b || 0), 0);
/* Vereinstreue: Saisons in Folge beim selben Verein */
function loyalty(p) {
  let n = 0;
  for (let i = p.seasons.length - 1; i >= 0; i--) {
    if (p.seasons[i].club === p.club.n) n++; else break;
  }
  return n;
}
const LEGEND = [
  { y:3,  t:"Stammkraft",          rep:1, mo:1, leg:4 },
  { y:5,  t:"Identifikationsfigur",rep:2, mo:2, leg:10 },
  { y:8,  t:"Publikumsliebling",   rep:3, mo:3, leg:20 },
  { y:10, t:"Vereinslegende",      rep:4, mo:4, leg:38 },
  { y:14, t:"Unsterblich beim Klub",rep:5,mo:5, leg:60 },
];
const legendRank = (n) => { let r = null; for (const l of LEGEND) if (n >= l.y) r = l; return r; };

/* Öffentliche Wahrnehmung: Reichweite, Beliebtheit, Ansehen im Umfeld.
   Alles abgeleitet aus dem, was in der Laufbahn tatsächlich passiert ist. */
function socialStats(p) {
  const S = p.seasons || [];
  const titel = (p.trophies || []).length;
  const tore = p.tot.goals || 0, spiele = p.tot.apps || 0;
  const liga = ligaInfo(p.club.l).pay;
  const buehne = clamp(Math.log10(1 + liga * 3) * 26, 0, 42);
  /* Reichweite wächst überproportional mit Bekanntheit und Bühne */
  const basis = Math.pow(Math.max(1, p.rep), 2.35) * (1 + buehne / 55)
    * (1 + titel * .16) * (1 + (p.nt.caps || 0) / 140) * (1 + (p.wc && p.wc.r === "goat" ? .3 : 0));
  const follower = Math.round(basis * 62 * (1 + (p.flags.eigenemarke ? .55 : 0)) * (1 + (p.assets || []).includes("fanshop") ? .2 : 0));
  const beliebt = clamp(Math.round(46 + (3.4 - (p.lastNote || 3.4)) * 13 + titel * 2.6
    + loyalty(p) * 2.2 + (p.legacyBonus || 0) * .16 + (p.flags.legende ? 12 : 0)
    - (p.flags.wechselwunschAlt ? 7 : 0) - (p.flags.wetten || p.flags.maulwurf ? 22 : 0)
    - (p.flags.altersluege ? 12 : 0)), 2, 99);
  const akzeptanz = clamp(Math.round(44 + (p.trust - 50) * .58 + loyalty(p) * 2.8
    + (p.flags.kapitaen ? 10 : 0) + (p.nt.kapitaen ? 6 : 0) + (p.flags.abschluss ? 4 : 0)
    - (p.flags.suspendiert ? 12 : 0) - (p.flags.mussWegBis != null ? 10 : 0)), 2, 99);
  const medien = clamp(Math.round(38 + p.rep * .48 + titel * 3 + (p.nt.caps || 0) * .16
    + (p.flags.socialstar ? 10 : 0) - (p.flags.presseeklat ? 14 : 0)), 2, 99);
  const druck = clamp(Math.round(28 + p.rep * .42 + liga * 1.3 + titel * 2.2
    + (p.flags.kapitaen ? 8 : 0) - (p.age >= 32 ? 8 : 0)), 2, 99);
  const marktwert = clamp(Math.round(30 + p.rep * .5 + Math.log10(1 + follower / 1000) * 9), 2, 99);
  const verlauf = S.map((x) => clamp(Math.round(x.rep != null ? x.rep : p.rep), 0, 100));
  return { follower, beliebt, akzeptanz, medien, druck, marktwert, verlauf,
    reichweite: follower >= 1e6 ? (follower / 1e6).toFixed(1) + " Mio" : follower >= 1000 ? Math.round(follower / 1000) + " Tsd" : String(follower),
    titel, spiele, tore };
}

const netWorth = (p) => p.money + depotValue(p) + p.assets.reduce((a, id) => a + (shopItem(id)?.cost || 0) * .7, 0);

function checkMilestones(p) {
  const got = [];
  MILESTONES.forEach((m) => {
    if (p.milestones.includes(m.id)) return;
    if (m.ok(p)) { p.milestones.push(m.id); p.legacyBonus += m.leg; got.push(m.t); }
  });
  return got;
}

function simulateSeason(p) {
  const club = p.club;
  const arr = leagueClubs(club);
  const N = arr.length;
  const lg = Math.max(2, (N - 1) * 2);
  const europe = p.europeNext || null;
  const total = lg + 4 + (europe ? (europe === "Champions League" ? 10 : 8) : 0);
  const rival = rivalOf(p.squad, p.pos);
  const ro = roleFor(p.ovr, club.s, p.trust, rival ? rival.ovr : null);
  p.role = ro.key;

  let injury = null;
  if (p.pendingInjury) { injury = { sev: p.pendingInjury }; p.pendingInjury = null; }
  else if (chance(clamp((.13 + p.injuryProne / 380 + Math.max(0, p.age - 28) * .022 - p.fitness / 1400) * (1 + (p.wcMod ? p.wcMod.injMod : 0)), .02, .65))) {
    const r = Math.random();
    injury = { sev: r < .55 ? "leicht" : r < .86 ? "mittel" : "schwer" };
  }
  let missed = 0;
  if (injury) {
    const map = { leicht:[3,8], mittel:[9,20], schwer:[22,40] };
    missed = ri(map[injury.sev][0], map[injury.sev][1]);
    injury.games = missed;
    if (injury.sev === "schwer") {
      p.flags.schwereVerletzung = true;
      p.attrs.pac = clamp(p.attrs.pac - ri(2, 5), 8, 99);
      p.attrs.phy = clamp(p.attrs.phy - ri(1, 3), 8, 99);
      p.injuryProne = clamp(p.injuryProne + 14, 3, 95);
      p.ovr = ovrOf(p.attrs, p.pos);
    } else if (injury.sev === "mittel") p.injuryProne = clamp(p.injuryProne + 5, 3, 95);
  }
  /* Sperrspiele getrennt festhalten. Sie flossen bisher nur in `missed` ein
     und waren danach verloren — die Wrapped-Karte kann sonst nicht sagen, ob
     jemand verletzt war oder gesperrt. */
  const gesperrteSpiele = p.ban || 0;
  missed += gesperrteSpiele;
  const avail = clamp(total - missed, 0, total);
  const apps = clamp(Math.round(avail * ro.f * clamp(.78 + p.fitness / 420, .6, 1.1) * rnd(.9, 1.08)), 0, avail);

  /* Gekaufter Lauf der Saison: wirkt auf die Grundgüte, aus der Note, Tore
     und Vorlagen entstehen — also auf alles gleichzeitig, wie eine echte
     Bestform. */
  const laufBonus = (p.laden && p.laden.form) > 0 ? 1.16 : 1;
  const q = clamp((p.ovr - 40) / 45 * laufBonus, .05, 1.35);
  const cm = .85 + (club.s - 70) / 110, fm = .86 + p.form / 340, eff = apps * .85;
  const expG = POS[p.pos].g * Math.pow(q, 1.2) * cm * fm * eff;
  const expA = POS[p.pos].a * Math.pow(q, 1.1) * cm * fm * eff;
  let goals = Math.max(0, Math.round(expG * (1 + (p.wcMod ? p.wcMod.goalMod : 0)) * rnd(.66, 1.42) + (p.flags.elfer && p.pos !== "TW" ? apps * .055 : 0)));
  let assists = Math.max(0, Math.round(expA * (1 + (p.wcMod ? p.wcMod.assistMod : 0)) * rnd(.62, 1.45)));
  let cs = 0;
  if (p.pos === "TW") { goals = 0; cs = clamp(Math.round(apps * (.18 + (club.s - 62) / 190 + (p.ovr - club.s) / 260) * (1 + (p.wcMod ? p.wcMod.csMod : 0)) * rnd(.8, 1.2)), 0, apps); }
  /* Auch Feldspieler in der Defensive stehen an Zu-Null-Spielen beteiligt */
  else if (["IV", "AV", "ZDM"].includes(p.pos)) {
    cs = clamp(Math.round(apps * (.17 + (club.s - 62) / 200 + (p.ovr - club.s) / 280)
      * (1 + (p.wcMod ? p.wcMod.csMod : 0) * .6) * rnd(.78, 1.22)), 0, apps);
  }
  /* Defensivarbeit: Zweikämpfe, Balleroberungen, verhinderte Gegentore */
  const dq = clamp(.42 + (p.attrs.def - 55) / 130 + (p.ovr - club.s) / 240, .30, .82);
  const duelleProSpiel = { TW:2.2, IV:9.5, AV:8.6, ZDM:9.9, ZM:7.0, ZOM:4.6, AF:4.2, ST:4.0 }[p.pos] || 6;
  const duelle = Math.round(apps * duelleProSpiel * rnd(.9, 1.1));
  const duelleGew = Math.round(duelle * dq * rnd(.94, 1.06));
  const eroberungen = Math.round(apps * ({ TW:.5, IV:3.3, AV:3.6, ZDM:4.4, ZM:3.0, ZOM:1.8, AF:1.6, ST:1.2 }[p.pos] || 2)
    * (.75 + p.attrs.def / 190) * rnd(.88, 1.12));
  const verhindert = p.pos === "TW"
    ? Math.round(apps * (.9 + (p.attrs.def - 55) / 42) * rnd(.85, 1.15))       // Paraden über Erwartung
    : Math.round(apps * ({ IV:.42, AV:.30, ZDM:.28, ZM:.14, ZOM:.06, AF:.05, ST:.04 }[p.pos] || .1)
      * (.7 + p.attrs.def / 170) * rnd(.8, 1.2));                              // Klärungen und Blocks
  const dstat = { duelle, duelleGew, quote: duelle ? duelleGew / duelle : 0, eroberungen, verhindert };

  const expRank = Math.max(1, arr.findIndex((c) => c.n === club.n) + 1) || Math.ceil(N / 2);
  const impact = clamp((p.ovr - club.s) / 3.2 * (apps / Math.max(1, total)), -2.5, 4.5);
  const rank = Math.round(clamp(expRank + gauss(0, 2.6) - impact, 1, N));

  const table = simTable(club, rank);
  const cup = simCup(club);
  const eu = europe ? simEurope(club, europe) : null;

  /* Aufteilung der Saisonwerte auf die einzelnen Wettbewerbe */
  const cdef = [{ k:"liga", name: club.l, g: lg, m: 1 }, { k:"pokal", name: cup.name, g: 4, m: 1.12 }];
  if (europe) cdef.push({ k:"eu", name: europe, g: europe === "Champions League" ? 10 : 8, m: .86 });
  const aSp = split(apps, cdef.map((c) => c.g));
  const gw = cdef.map((c, i) => aSp[i] * c.m);
  const gSp = split(goals, gw), asSp = split(assists, gw), csSp = split(cs, aSp);
  const comps = cdef.map((c, i) => ({ key: c.k, name: c.name, apps: aSp[i], goals: gSp[i], assists: asSp[i], cs: csSp[i] }));

  const trophies = [];
  if (rank === 1) trophies.push("Meister " + club.l);
  if (cup.won && apps > total * .15) trophies.push(cup.name);
  if (eu && eu.won) trophies.push(europe);

  /* Note aus drei Teilen: Leistung im Verhältnis zur Erwartung, absolute
     Ausbeute gemessen an einem Richtwert der Position, und der Rahmen
     (eigene Stärke gegen Vereinsstärke, Form, Tabellenplatz).           */
  const csErw = { TW:.165, IV:.152, AV:.140, ZDM:.135 }[p.pos] || 0;   // erwartete Zu-Null-Anteile
  const pr = (goals + assists * .7 + cs * .55)
    / Math.max(.8, expG + expA * .7 + apps * csErw);
  const NORM = { TW:.30, IV:.10, AV:.15, ZDM:.14, ZM:.24, ZOM:.45, AF:.48, ST:.58 };
  const ist = p.pos === "TW" ? cs / Math.max(1, apps) : (goals + assists * .7) / Math.max(1, apps);
  const abs = clamp(ist / (NORM[p.pos] || .2) - 1, -.85, 2.2);
  /* Defensive Positionen leben von Zweikampfquote, Zu-Null-Spielen und
     verhinderten Gegentoren — sonst wären sie bei den Noten chancenlos. */
  const DEFGEW = { TW:1.15, IV:1.0, AV:.85, ZDM:.85, ZM:.42, ZOM:.18, AF:.14, ST:.10 }[p.pos] || .3;
  const csQuote = cs / Math.max(1, apps);
  const csNorm = { TW:.30, IV:.28, AV:.26, ZDM:.25 }[p.pos] || .22;
  const vNorm = p.pos === "TW" ? 1.05 : { IV:.44, AV:.31, ZDM:.29, ZM:.15 }[p.pos] || .08;
  const dwert = (dq - .52) / .22 * .60                                       // Zweikampfquote
    + (["TW","IV","AV","ZDM"].includes(p.pos) ? (csQuote / csNorm - 1) * .55 : 0)
    + (verhindert / Math.max(1, apps) / vNorm - 1) * .45;
  const defBeitrag = clamp(dwert, -1.4, 1.8) * DEFGEW;
  let note = 3.02 - (pr - 1) * 1.35 - abs * .62 - defBeitrag * .52 - (p.ovr - club.s) * .052 - (p.form - 55) * .005
    - (rank <= 3 ? .15 : rank >= N - 3 ? -.2 : 0) - (p.noteBonus || 0) + gauss(0, .22);
  note -= perk(p, "note") + (p.wcMod ? p.wcMod.note : 0) + (p.wcMod && p.europeNext ? p.wcMod.bigGame * .25 : 0);
  if (apps < total * .15) note += .5;
  note = clamp(Number(note.toFixed(1)), 1.2, 5.4);
  p.noteBonus = 0; p.lastNote = note;
  hsvHalten(p);              // die Rautekarte hält Ansehen, Moral und Form oben

  /* ---- Kapitänsamt: wird jede Saison neu bewertet ---- */
  const kapiWert = (p.trust - 50) * .9 + (p.age - 24) * 2.2 + loyalty(p) * 3.4
    + (p.ovr - club.s) * 1.6 + (3.4 - p.lastNote) * 6 + (p.flags.fuehrung ? 12 : 0);
  let kapiNeu = null;
  if (p.flags.kapitaen) {
    /* Wer die Binde hat, verliert sie bei schwacher Vorstellung wieder */
    if (kapiWert < -14 || apps < total * .35) { p.flags.kapitaen = false; kapiNeu = "ab"; }
  } else if (kapiWert >= 26 && apps > total * .55 && p.age >= 23 && chance(.55)) {
    p.flags.kapitaen = true; kapiNeu = "auf";
  }
  if (p.flags.kapitaen) { p.rep = clamp(p.rep + 2, 0, 100); p.legacyBonus += 1.5; }

  /* ---- Nationalmannschaft: U17 bis A-Team, abgestufte Rolle ---- */
  const nstr = natStrength(p.nation, p.g);
  const thrA = Math.max(56, 47 + nstr * .30) - p.nt.standing * .10 - (p.wcMod ? p.wcMod.ntBonus : 0);
  let ntCaps = 0, ntGoals = 0, ntNote = null, ntTeam = null;
  const spielt = apps > total * .30;
  if (p.flags.ntRuecktritt) { p.nt.level = "none"; }
  else {
    const d = p.ovr - thrA;
    /* Junge Spieler kommen nicht sofort ins A-Team. Wer erst achtzehn ist,
       muss deutlich über der Schwelle liegen — und der Weg führt in aller
       Regel über die Junioren. Auch die Bühne zählt: Wer im Unterhaus
       spielt, wird schlicht seltener gesehen.                          */
    const jung = p.age <= 18 ? 9 : p.age <= 19 ? 6.5 : p.age <= 20 ? 4 : p.age <= 21 ? 2 : 0;
    const buehne = clamp((ligaInfo(p.club.l).pay - 2.2) * .55, -4.5, 2.5);
    const dA = d - jung + buehne + Math.min(4, (p.nt.uCaps || 0) * .12);
    if (spielt && dA >= 0 && p.age >= 17) { p.nt.level = "A"; ntTeam = "A"; }
    else if (p.age <= 21 && p.ovr >= thrA - 8) { p.nt.level = "U21"; ntTeam = "U21"; }
    else if (p.age <= 19 && p.ovr >= thrA - 13) { p.nt.level = "U19"; ntTeam = "U19"; }
    else if (p.age <= 17 && p.ovr >= thrA - 18) { p.nt.level = "U17"; ntTeam = "U17"; }
    else p.nt.level = "none";
  }
  if (ntTeam === "A") {
    const jung2 = p.age <= 19 ? 7 : p.age <= 21 ? 4 : p.age <= 23 ? 1.5 : 0;
    const d = p.ovr - thrA - jung2 + Math.min(4, (p.nt.caps || 0) * .06);
    /* Stammspieler, Rotation oder Ergänzung — kein Alles-oder-nichts mehr */
    const rolle = d >= 7 ? "Stammspieler" : d >= 3 ? "Rotation" : d >= 0 ? "Kaderspieler" : "Ergänzung";
    const spanne = d >= 7 ? [6, 10] : d >= 3 ? [4, 7] : d >= 0 ? [2, 5] : [1, 3];
    ntCaps = ri(spanne[0], spanne[1]);
    ntGoals = Math.max(0, Math.round(POS[p.pos].g * ntCaps * .7 * rnd(.3, 1.5)));
    p.nt.caps += ntCaps; p.nt.goals += ntGoals; p.nt.rolle = rolle;
    /* Kapitän der Nationalmannschaft: eigene Bewertung, eigene Binde */
    if (p.nt.kapitaen) {
      if (d < 1 || p.nt.caps < 12) { p.nt.kapitaen = false; kapiNeu = kapiNeu || "ntab"; }
    } else if (d >= 7 && p.nt.caps >= 25 && p.age >= 26 && rolle === "Stammspieler" && chance(.4)) {
      p.nt.kapitaen = true; kapiNeu = "ntauf";
    }
    if (p.nt.kapitaen) { p.rep = clamp(p.rep + 2, 0, 100); p.legacyBonus += 2; }
    p.nt.standing = clamp(p.nt.standing + (d >= 3 ? 5 : 2), -40, 45);
    const y = p.year + 1;
    if (y % 2 === 0 && d >= -1) {
      const eur5 = ["GER","ESP","ENG","FRA","ITA","POR","NED","CRO","BEL","TUR","AUT","SUI","DEN","SWE","NOR","POL","SRB","GRE","SCO","WAL","IRL","CZE","HUN","UKR","RUS","BUL","ROU","SVK","SVN","ISL","FIN","BIH","MKD","ALB","KOS","MNE","GEO","ARM","AZE","BLR","LVA","LTU","EST","LUX","MLT","CYP","ISR","MDA","FRO","GIB","AND","SMR","LIE","NIR","KAZ"];
      const turnier = y % 4 === 2 ? "WM" : (eur5.includes(p.nation.id) ? "EM" : "Kontinentalmeisterschaft");
      /* Nur bei einer WM muss man sich überhaupt qualifizieren */
      const qual = turnier === "WM" ? clamp((nstr - 44) / 46, .05, .96) : clamp((nstr - 30) / 55, .12, .98);
      if (chance(qual)) {
        const st = nstr + clamp((p.ovr - 80) * .45, -6, 7), r = Math.random() * 100;
        const res = r > 100 - (st - 70) * .40 ? "Titel" : r > 100 - (st - 62) * .95 ? "Finale"
          : r > 100 - (st - 54) * 1.7 ? "Halbfinale" : r > 100 - (st - 44) * 2.8 ? "Viertelfinale" : "Vorrunde";
        p.nt.majors.push({ y, turnier, res });
        if (res === "Titel") { p.trophies.push(turnier + " " + y); p.rep = clamp(p.rep + 22, 0, 100); }
        else if (res === "Finale") p.rep = clamp(p.rep + 10, 0, 100);
        ntNote = turnier + " " + y + ": " + res;
        ntCaps += ri(3, 6); p.nt.caps += 0;
      } else {
        ntNote = turnier + " " + y + ": Qualifikation verpasst";
        p.nt.standing = clamp(p.nt.standing - 3, -40, 45);
      }
    }
  } else if (ntTeam) {
    /* Juniorenauswahlen: eigene Einsatzzahlen, Erfahrung fürs spätere Niveau */
    p.nt.u = p.nt.u || { U17: 0, U19: 0, U21: 0 };
    const uc = ri(3, 8);
    p.nt.u[ntTeam] += uc;
    p.nt.uCaps = (p.nt.uCaps || 0) + uc;
    p.nt.uGoals = (p.nt.uGoals || 0) + Math.max(0, Math.round(POS[p.pos].g * uc * .8 * rnd(.3, 1.6)));
    p.potential = clamp(p.potential + (chance(.35) ? 1 : 0), 40, 97);
    p.rep = clamp(p.rep + 2, 0, 100);
    p.nt.standing = clamp(p.nt.standing + 2, -40, 45);
    ntNote = ntTeam + "-Nationalmannschaft: " + uc + " Einsätze";
    /* Juniorenturniere alle zwei Jahre */
    const y = p.year + 1;
    if (y % 2 === 1 && chance(.55)) {
      const st = nstr * .9 + clamp((p.ovr - thrA + 12) * .8, -8, 10), r = Math.random() * 100;
      const res = r > 100 - (st - 60) * .5 ? "Titel" : r > 100 - (st - 50) * 1.4 ? "Halbfinale" : "Vorrunde";
      p.nt.majors.push({ y, turnier: ntTeam + "-EM", res, u: true });
      if (res === "Titel") { p.rep = clamp(p.rep + 8, 0, 100); p.potential = clamp(p.potential + 1, 40, 97); }
      ntNote = ntTeam + "-EM " + y + ": " + res;
    }
  }

  const awards = [], lvl = TOP5.includes(club.l) ? 1 : club.s >= 68 ? 2 : 3;
  if (p.pos !== "TW" && goals >= [21,18,15][lvl-1] && chance(.55)) awards.push("Torschützenkönig " + club.l);
  if (p.pos === "TW" && cs >= 14 && chance(.4)) awards.push("Torhüter der Saison " + club.l);
  if (note <= 2.5 && apps > total * .5 && chance(.35)) awards.push("Elf der Saison " + club.l);
  if (note <= 2.2 && rank <= 3 && chance(.3)) awards.push("Spieler der Saison " + club.l);
  if (p.age <= 21 && note <= 2.8 && apps > total * .4 && chance(.4)) awards.push("Bester Nachwuchsspieler " + club.l);
  if (p.ovr >= 88 && trophies.length && note <= 2.3 && TOP5.includes(club.l) && chance(.3)) awards.push("Weltfußballer des Jahres");
  awards.forEach((a) => p.awards.push({ y: p.year + 1, a }));
  trophies.forEach((t) => p.trophies.push(t + " " + (p.year + 1)));

  p.form = clamp(55 + (2.9 - note) * 22 + rnd(-8, 8), 10, 98);
  p.morale = clamp(p.morale + (3.2 - note) * 9 + trophies.length * 7 - (apps < total * .25 ? 12 : 0), 5, 100);
  hsvHalten(p);              // die Rautekarte hält Ansehen, Moral und Form oben
  p.trust = clamp(p.trust + (3.3 - note) * 8 + (apps > total * .5 ? 4 : -6), 3, 98);
  const loy = legendRank(loyalty(p) + 1 + (p.wcMod ? Math.round(p.wcMod.loyalBonus) : 0));
  p.rep = clamp(p.rep + (3.2 - note) * 5 + trophies.length * 5 + awards.length * 6
    + (TOP5.includes(club.l) ? 2 : 0) - 1 + (loy ? loy.rep : 0), 0, 100);
  hsvHalten(p);              // zuletzt: die Rautekarte hält alles oben
  if (loy) { p.morale = clamp(p.morale + loy.mo, 5, 100); p.trust = Math.max(p.trust, 40 + loy.y); }
  p.fitness = clamp(p.fitness - apps * .22 + 8 - (injury ? 8 : 0), 20, 100);
  p.ban = 0;
  /* Gekauftes läuft ab. Einmaliges (reroll) bleibt stehen, damit man es nicht
     zweimal kaufen kann. */
  if (p.laden) {
    const L = { ...p.laden };
    ["training", "form", "berater", "ueber99"].forEach((k) => {
      if (L[k] > 0) L[k] = L[k] - 1;
    });
    p.laden = L;
  }
  p.flags.justMoved = false;
  p.flags.wechselwunsch = false;
  p.flags.suspendiert = false;
  /* Abgelaufene Zwangslagen aufräumen, damit nichts hängen bleibt */
  if (p.flags.mussWegBis != null && p.flags.mussWegBis < p.seasons.length) delete p.flags.mussWegBis;
  if (p.flags.aufgeloestBis != null && p.flags.aufgeloestBis < p.seasons.length) delete p.flags.aufgeloestBis;
  p.contract = Math.max(0, p.contract - 1);
  const ledger = finance(p);
  p.mv = marketValue(p);

  p.squad = p.squad.map((s) => ({ ...s, age: s.age + 1,
      ovr: clamp(s.ovr + (s.age < 25 ? ri(0, 2) : s.age > 31 ? ri(-3, 0) : ri(-1, 1)), 40, 96) }))
    .filter((s) => s.age <= 36);
  while (p.squad.length < 15) {
    p.squad.push({ name: genName(chance(.6) ? club.c : pick(REGION_KEYS), p.g), pos: pick(SQUAD_SHAPE),
      cc: club.c, ovr: clamp(Math.round(club.s + gauss(-2, 5)), 40, 96), age: ri(18, 24) });
  }
  p.squad.sort((a, b) => b.ovr - a.ovr);

  /* Auf- und Abstieg */
  let move = null;
  const tier = TIER[club.l];
  if (tier) {
    if (tier[1] && rank > N - 3) move = { l: tier[1], dir: "ab" };
    else if (tier[0] && rank <= 2) move = { l: tier[0], dir: "auf" };
  }
  p.europeNext = move ? null : CONT(club, rank);
  if (move) {
    p.club = { ...club, l: move.l, s: clamp(club.s + (move.dir === "auf" ? 2 : -5), 40, 96) };
    p.squad = p.squad.map((s) => ({ ...s, ovr: clamp(s.ovr + (move.dir === "auf" ? 1 : -1), 40, 96) }));
  }

  const season = {
    year: p.year + "/" + String(p.year + 1).slice(2), y: p.year + 1, age: p.age,
    club: club.n, clubRef: club, league: club.l, land: club.c, ovr: p.ovr, mv: p.mv, pos: p.pos,
    apps, goals, assists, cs, note, rank, N, role: ro.label, trophies, awards, injury, europe,
    banned: gesperrteSpiele,
    ntCaps, ntGoals, ntNote, ntLevel: p.nt.level, ntTeam, ntRolle: p.nt.rolle, dstat, kapiNeu, rep: Math.round(p.rep),
    kapitaen: !!p.flags.kapitaen, ntKapitaen: !!p.nt.kapitaen,
    ntMajor: (p.nt.majors.length && p.nt.majors[p.nt.majors.length - 1].y === p.year + 1) ? p.nt.majors[p.nt.majors.length - 1] : null,
    comps, table, cup, eu, move, ledger, wage: p.wage,
    rival: rival ? rival.name : null, netWorth: netWorth(p),
  };
  p.seasons.push(season);
  p.tot.apps += apps; p.tot.goals += goals; p.tot.assists += assists; p.tot.cs += cs; p.tot.seasons++;
  if (TOP5.includes(club.l) && ro.f >= .8) p.tot.topSeasons++;
  season.milestones = checkMilestones(p);
  return season;
}

/* Wie nah steht ein Verein dir? Heimatland, gemeinsame Sprachregion,
   eingespielte Transferwege zwischen Ligen und deine Bekanntheit dort.  */
const ROUTE = {
  "2. Bundesliga":["Bundesliga","Super League (CH)","Bundesliga (AT)","Eredivisie"],
  "Bundesliga":["Premier League","La Liga","Serie A","Ligue 1","Saudi Pro League","Süper Lig","2. Bundesliga"],
  "Championship":["Premier League","Scottish Premiership","Eredivisie"],
  "Premier League":["La Liga","Serie A","Bundesliga","Ligue 1","Saudi Pro League","Championship","Süper Lig"],
  "Eredivisie":["Premier League","Bundesliga","Liga Portugal","Serie A","Jupiler Pro League"],
  "Jupiler Pro League":["Eredivisie","Premier League","Bundesliga","Ligue 1"],
  "Liga Portugal":["Premier League","La Liga","Serie A","Ligue 1","Süper Lig"],
  "Série A":["Liga Portugal","La Liga","Serie A","Ligue 1","Premier League","Süper Lig"],
  "Liga Profesional":["Liga Portugal","La Liga","Serie A","Ligue 1","Süper Lig","MLS"],
  "Super League":["Süper Lig","Serie A","Liga Portugal","Eredivisie"],
  "Süper Lig":["Saudi Pro League","Serie A","Premier League","Super League"],
  "Ligue 1":["Premier League","La Liga","Serie A","Saudi Pro League","Süper Lig"],
  "La Liga":["Premier League","Serie A","Ligue 1","Saudi Pro League","Liga Portugal"],
  "Serie A":["Premier League","La Liga","Ligue 1","Saudi Pro League","Süper Lig"],
  "Bundesliga (AT)":["Bundesliga","2. Bundesliga","Super League (CH)"],
  "Super League (CH)":["Bundesliga","2. Bundesliga","Serie A"],
  "Superliga":["Eredivisie","Bundesliga","Premier League","Championship"],
  "Eliteserien":["Eredivisie","Bundesliga","Championship","Superliga"],
  "Allsvenskan":["Eredivisie","Superliga","Bundesliga","Championship"],
  "Chance Liga":["Bundesliga","Serie A","Eredivisie","Bundesliga (AT)"],
  "Ekstraklasa":["Bundesliga","Serie A","Eredivisie","Chance Liga"],
  "HNL":["Serie A","Bundesliga","Süper Lig","Liga Portugal"],
  "Superliga (SRB)":["Serie A","Süper Lig","Bundesliga","HNL"],
  "Premjer-Liha":["Serie A","Liga Portugal","Süper Lig","Ekstraklasa"],
  "MLS":["Liga Profesional","Série A","Championship","Eredivisie"],
  "J1 League":["Eredivisie","Bundesliga","Jupiler Pro League","K League 1"],
  "3. Liga":["2. Bundesliga","Bundesliga (AT)","Super League (CH)"],
  "EFL League One":["Championship","Scottish Premiership"],
  "Serie C":["Serie B","Super League (CH)"],
  "Primera Federación":["LaLiga 2","Liga Portugal 2"],
  "Liga Portugal 2":["Liga Portugal","LaLiga 2","Süper Lig"],
  "Eerste Divisie":["Eredivisie","Jupiler Pro League","2. Bundesliga","Championship"],
  "Challenger Pro League":["Jupiler Pro League","Eerste Divisie","Ligue 2"],
  "TFF 1. Lig":["Süper Lig","Super League","Saudi Pro League"],
  "1. Division":["Superliga","Eliteserien","Allsvenskan","Eerste Divisie"],
  "I liga":["Ekstraklasa","Chance Liga","2. Bundesliga"],
  "Championship (SCO)":["Scottish Premiership","EFL League One","Championship"],
  "2. Liga (AT)":["Bundesliga (AT)","2. Bundesliga","Challenge League"],
  "Challenge League":["Super League (CH)","2. Bundesliga","Serie B"],
  "FNL":["Chance Liga","Ekstraklasa","2. Liga (AT)"],
  "1. divisjon":["Eliteserien","Superliga","Allsvenskan"],
  "Premjer-Liga":["Süper Lig","Serie A","Saudi Pro League","Premjer-Liha"],
  "Série B":["Série A","Liga Portugal","Primera Nacional","Liga MX"],
  "Primera Nacional":["Liga Profesional","Primera División (CHI)","Liga MX","Liga Portugal 2"],
  "Categoría Primera A":["Liga MX","Liga Portugal","MLS","Série A","Liga Profesional"],
  "Liga Pro":["Liga MX","Categoría Primera A","Liga Portugal","Série A"],
  "Primera División (URU)":["Liga Profesional","Série A","Liga MX","Liga Portugal"],
  "Primera División (CHI)":["Liga Profesional","Liga MX","Série A","Categoría Primera A"],
  "Primera División (PAR)":["Liga Profesional","Série A","Liga MX","Primera División (URU)"],
  "Liga MX":["MLS","La Liga","Liga Portugal","Série A","Categoría Primera A"],
  "J2 League":["J1 League","K League 1","A-League Men"],
  "UAE Pro League":["Saudi Pro League","Qatar Stars League","Süper Lig"],
  "Qatar Stars League":["Saudi Pro League","UAE Pro League","Süper Lig"],
  "A-League Men":["J1 League","K League 1","Championship","Eredivisie"],
};
/* Wie nah steht dir ein Verein? Sprache, gemeinsame Geschichte, Klima,
   übliche Transferwege — und politische Konflikte, die einen Wechsel
   sehr unwahrscheinlich machen, ohne ihn ganz auszuschließen.           */
function affinity(p, c) {
  let a = 1;
  a *= relation(p.nation.id, c.c);                                      // Sprachraum, Bindung, Klima, Konflikt
  a *= .55 + .45 * relation(p.club.c, c.c) / 2.4;                       // Verhältnis deines jetzigen Landes
  if (c.l === p.club.l) a += .8;                                        // Wechsel innerhalb der Liga
  if ((ROUTE[p.club.l] || []).includes(c.l)) a += 1.2;                  // übliche Transferroute
  if (p.seasons.some((x) => x.land === c.c)) a += .5;                   // dort schon gespielt
  const rep = p.rep / 100;
  a += (ligaInfo(c.l).mv > ligaInfo(p.club.l).mv ? rep * .9 : .25);      // Bekanntheit öffnet größere Ligen
  if (p.flags.sesshaft && c.c !== p.club.c) a *= .15;
  return Math.max(.01, a);
}

const ASK = {
  max:    { f:1.10, n:-1, m:1.20, name:"Maximal",      hint:"Du verlangst das Höchste. Wenige Angebote, aber gut bezahlt." },
  markt:  { f:.72,  n:0,  m:1.00, name:"Marktüblich",  hint:"Übliche Spanne für deinen Marktwert." },
  wenig:  { f:.42,  n:1,  m:.84,  name:"Zurückhaltend",hint:"Mehr Auswahl, dafür spürbar weniger Gehalt." },
  egal:   { f:.16,  n:2,  m:.68,  name:"Nebensache",   hint:"Hauptsache spielen. Viele Angebote, niedriges Gehalt." },
};
/* Angebotsarten sorgen dafür, dass nicht jedes Angebot gleich aussieht */
const KIND = {
  normal:   { tag:null,             wage:1,    fee:1,    roleUp:0 },
  spielzeit:{ tag:"Mehr Spielzeit, weniger Geld", wage:.62, fee:.85, roleUp:1 },
  geld:     { tag:"Deutlich mehr Geld", wage:1.85, fee:1.1, roleUp:0 },
  prestige: { tag:"Großer Name",    wage:1.12, fee:1.25, roleUp:-1 },
  heimat:   { tag:"Rückkehr in die Heimat", wage:.88, fee:.95, roleUp:0 },
  bindung:  { tag:"Vertrautes Umfeld", wage:.95, fee:1, roleUp:0 },
  projekt:  { tag:"Langfristiges Projekt", wage:.92, fee:1,  roleUp:1 },
  notnagel: { tag:"Sofortlösung",   wage:1.28, fee:1.15, roleUp:1 },
};
function offerKind(p, c) {
  const payUp = ligaInfo(c.l).pay > ligaInfo(p.club.l).pay * 1.8;
  const petro = ["Saudi Pro League", "MLS", "Süper Lig", "K League 1", "J1 League"].includes(c.l);
  if (petro && payUp && chance(.75)) return "geld";
  if (c.c === p.nation.id && c.c !== p.club.c && chance(.55)) return "heimat";
  if (TIE_SET[p.nation.id + ">" + c.c] && c.c !== p.club.c && chance(.3)) return "bindung";
  if (c.s >= p.ovr + 7 && chance(.7)) return "prestige";
  if (c.s <= p.ovr - 3 && chance(.72)) return "spielzeit";
  if (p.age <= 23 && c.s <= p.ovr + 3 && chance(.5)) return "projekt";
  if (p.age >= 30 && c.s >= p.ovr - 2 && chance(.35)) return "notnagel";
  return "normal";
}
const ROLE_ORDER = ["tribune", "bench", "rot", "start", "star"];
function shiftRole(r, up) {
  const i = ROLE_ORDER.indexOf(r.key);
  const j = clamp(i + up, 0, ROLE_ORDER.length - 1);
  const lab = { tribune:"Tribüne", bench:"Ergänzungsspieler", rot:"Rotation", start:"Stammspieler", star:"Führungsspieler" };
  return { key: ROLE_ORDER[j], label: lab[ROLE_ORDER[j]] };
}

function makeOffers(p) {
  const free = p.contract <= 0;
  const last = p.seasons[p.seasons.length - 1];
  const mins = last ? last.apps / Math.max(1, last.apps + 12) : .5;
  const benched = p.role === "bench" || p.role === "tribune" || (last && last.apps < 12);
  const desperate = p.age >= 34 || benched;
  /* Gekaufter Berater: hebt die wahrgenommene Klasse, dadurch melden sich
     stärkere Vereine. Wirkt wie eine sehr gute Saisonnote obendrauf. */
  const beraterB = (p.laden && p.laden.berater) > 0 ? 9 : 0;
  const noteB = clamp((3.5 - p.lastNote) * 5, -8, 10) + beraterB;
  /* Wer die Rautekarte gezogen hat, bleibt beim HSV — der Verein hält
     immer die Hand hin, wenn der Vertrag es verlangt.                  */
  if (p.flags.nurderhsv) {
    const c = p.club;
    const r0 = roleFor(p.ovr, c.s, p.trust);
    const nur = [];
    if (p.contract > 0) nur.push({ type:"stay", club:c, fee:0, signOn:0, years:p.contract,
      wage:p.wage, role:r0.label, roleKey:r0.key });
    nur.push({ type:"renew", club:c, fee:0, years: p.age >= 34 ? 2 : 4,
      wage: Number(Math.max(p.wage, wageFor(p, c)).toFixed(3)),
      signOn: 0, role:r0.label, roleKey:r0.key, extend:true, kind:"Vertrag verlängern" });
    return nur;
  }
  const ask = ASK[p.wageAsk] || ASK.markt;
  /* Der eigene Verein verhandelt unabhängig davon, was du auf dem Markt
     verlangst — sonst änderte sich dein laufender Vertrag per Klick.    */
  const eigen = mulberry(hashStr(p.name + p.club.n + p.seasons.length + p.year));
  const push = !!p.flags.wechselwunsch;
  const appeal = p.ovr + noteB + (p.rep - 50) * .09 - Math.max(0, p.age - 29) * 2.6 + (p.age <= 21 ? 3 : 0);
  let feeAsk = p.mv * (p.contract >= 3 ? 1.15 : p.contract === 2 ? 1 : .82);
  feeAsk *= ask.f < .3 ? .55 : ask.f < .55 ? .74 : ask.f < .9 ? .92 : 1.12;
  if (push) feeAsk *= .72;
  const wageFloor = p.wage * ask.f * (desperate ? .72 : 1);

  /* Ein Verein aus deinem Heimatland streckt sich für einen Rückkehrer —
     national bekannte Spieler sind dort mehr wert als auf dem freien Markt. */
  const stretch = (c) => Math.min(1.8, 1 + (c.c === p.nation.id ? .8 : 0)
    + (SPHERE[c.c] && SPHERE[c.c] === SPHERE[p.nation.id] ? .2 : 0)
    + (TIE_SET[p.nation.id + ">" + c.c] ? .18 : 0) + p.rep / 300);
  const fits = (c) => {
    if (c.n === p.club.n) return false;
    if (c.g !== p.g) return false;
    const floorS = p.ovr - 15 - (ask.f < .5 ? 12 : 0) - (push ? 4 : 0);
    if (c.s > appeal + 4 + (push ? 2 : 0) || c.s < floorS) return false;
    const st = stretch(c);
    if (!free && feeAsk > clubBudget(c) * st) return false;
    if (clubTopWage(c) * 1.9 * Math.min(st, 1.35) < wageFloor) return false;
    if (p.flags.sesshaft && c.c !== p.club.c) return false;
    return true;
  };
  /* Kandidaten nach Nähe gewichtet ziehen statt rein zufällig */
  const cand = CLUBS.filter(fits).map((c) => ({ c, a: affinity(p, c) * rnd(.55, 1.55) }))
    .sort((x, y) => y.a - x.a).map((x) => x.c);

  const n = clamp(Math.round(2 + (p.lastNote < 3 ? 1 : 0) + (p.rep > 60 ? 1 : 0) + ri(0, 2)
    + ask.n + (push ? 2 : 0) + (p.wcMod ? p.wcMod.offers : 0)) + (p.speed ? 0 : 3),
    p.speed ? 1 : 4, p.speed ? 3 : 10);
  const out = [], seen = {};
  for (const c of cand) {
    if (out.length >= n) break;
    if ((seen[c.l] || 0) >= (c.l === p.club.l ? 2 : 1)) continue;
    const k = KIND[offerKind(p, c)];
    let wage = wageFor(p, c) * k.wage * (ask.m != null ? ask.m : 1) * (1 + (p.wcMod ? p.wcMod.wageMult : 0)) * rnd(.94, 1.09);
    wage = Math.min(wage, clubTopWage(c) * 1.25 * Math.min(stretch(c), 1.35));
    /* Bei einem Angebot mit klar besserer Rolle akzeptierst du auch weniger Geld */
    const tol = k.roleUp > 0 ? .58 : .82;
    if (wage < wageFloor * tol) continue;
    seen[c.l] = (seen[c.l] || 0) + 1;
    const r = shiftRole(roleFor(p.ovr, c.s, 55), k.roleUp);
    out.push({ type:"transfer", club:c, years: ri(2, 5), role:r.label, roleKey:r.key,
      wage: Number(wage.toFixed(3)), kind: k.tag,
      fee: free ? 0 : Math.min(clubBudget(c) * stretch(c), p.mv * k.fee * rnd(.85, 1.4)),
      signOn: free ? Math.min(clubBudget(c) * .2, Math.max(.03, p.mv * rnd(.06, .2))) : 0 });
  }

  /* An den Rändern der Spielstärke bricht die Auswahl sonst zusammen: Wer in
     Saudi-Arabien ein Vielfaches des europäischen Höchstgehalts verdient, fällt
     bei jedem anderen Verein durch die Gehaltsuntergrenze. Deshalb wird
     gestaffelt gelockert, bis mindestens drei Vereine zur Wahl stehen — dann
     eben zu deutlich niedrigerem Gehalt, wie im echten Fußball auch.        */
  const mindest = p.speed ? 3 : 4;
  if (out.length < mindest) {
    const stufen = [{ f:.55, liga:2, band:0 }, { f:.25, liga:3, band:8 }, { f:0, liga:9, band:20 }];
    for (const st2 of stufen) {
      if (out.length >= mindest) break;
      const weit = CLUBS.filter((c) => c.n !== p.club.n && c.g === p.g
        && !out.some((o) => o.club.n === c.n)
        && c.s <= appeal + 4 + st2.band && c.s >= p.ovr - 15 - st2.band
        && (free || feeAsk <= clubBudget(c) * stretch(c) * (1 + st2.band / 16))
        && !(p.flags.sesshaft && c.c !== p.club.c))
        .map((c) => ({ c, a: affinity(p, c) * rnd(.6, 1.5) }))
        .sort((x, y) => y.a - x.a).map((x) => x.c);
      for (const c of weit) {
        if (out.length >= mindest) break;
        if ((seen[c.l] || 0) >= st2.liga) continue;
        const k2 = KIND[offerKind(p, c)];
        let w2 = wageFor(p, c) * k2.wage * (ask.m != null ? ask.m : 1) * rnd(.94, 1.09);
        w2 = Math.min(w2, clubTopWage(c) * 1.25 * Math.min(stretch(c), 1.35));
        if (w2 < wageFloor * st2.f) continue;
        seen[c.l] = (seen[c.l] || 0) + 1;
        const r2 = shiftRole(roleFor(p.ovr, c.s, 55), k2.roleUp);
        out.push({ type:"transfer", club:c, years: ri(2, 4), role:r2.label, roleKey:r2.key,
          wage: Number(w2.toFixed(3)), kind: k2.tag,
          fee: free ? 0 : Math.min(clubBudget(c) * stretch(c), p.mv * k2.fee * rnd(.85, 1.4)),
          signOn: free ? Math.min(clubBudget(c) * .2, Math.max(.03, p.mv * rnd(.06, .2))) : 0 });
      }
    }
  }

  /* Ein Angebot aus heiterem Himmel: manchmal meldet sich ein Verein, mit dem
     niemand gerechnet hätte — auch aus einem Land, das sonst nicht infrage käme. */
  if (chance(.16) && out.length) {
    const rest = CLUBS.filter(fits).filter((c) => !out.some((o) => o.club.n === c.n));
    if (rest.length) {
      const c = pick(rest);
      const k = KIND[offerKind(p, c)];
      let wage = wageFor(p, c) * k.wage * rnd(1, 1.35);
      wage = Math.min(wage, clubTopWage(c) * 1.3);
      if (wage >= wageFloor * .5) {
        const r = shiftRole(roleFor(p.ovr, c.s, 55), k.roleUp);
        out[out.length - 1] = { type:"transfer", club:c, years: ri(2, 4), role:r.label, roleKey:r.key,
          wage: Number(wage.toFixed(3)), kind: "Überraschende Anfrage",
          fee: free ? 0 : Math.min(clubBudget(c) * 1.4, p.mv * rnd(.9, 1.5)),
          signOn: free ? Math.max(.03, p.mv * rnd(.08, .22)) : 0 };
      }
    }
  }

  if (p.flags.dreamOffer) {
    const big = CLUBS.filter((x) => x.g === p.g && x.s >= (p.g === "w" ? 82 : 86) && x.n !== p.club.n && (free || feeAsk <= clubBudget(x)));
    if (big.length) {
      const c = pick(big), r = roleFor(p.ovr, c.s, 55);
      out.unshift({ type:"transfer", club:c, years:5, role:r.label, roleKey:r.key, dream:true, signOn:0,
        kind:"Traumverein", fee: free ? 0 : Math.min(clubBudget(c), p.mv * rnd(1.2, 2)), wage: wageFor(p, c) * 1.15 });
    }
    p.flags.dreamOffer = false;
  }

  /* Leihen: für junge Spieler ohne Spielzeit der Normalfall, nicht die Ausnahme */
  /* Leihen: Regelfall für junge Spieler ohne Spielzeit, sonst die Ausnahme */
  const loanNeed = p.age <= 23 && p.contract > 0 && !p.flags.aufLeihe
    && (benched || p.ovr < p.club.s - 5);
  const wantLoan = p.contract > 0 && p.age <= 26 && !p.flags.aufLeihe &&
    (p.flags.wantLoan || (loanNeed && chance(.82)) || (p.age <= 20 && p.ovr < p.club.s - 2 && chance(.45)));
  if (wantLoan) {
    const weit = !!p.flags.wantLoan;                 // ausdrücklicher Wunsch: großzügiger suchen
    const lp = CLUBS.filter((c) => c.n !== p.club.n && c.g === p.g
      && c.s <= p.ovr + (weit ? 10 : 6) && c.s >= p.ovr - (weit ? 22 : 14)
      && clubTopWage(c) >= p.wage * (weit ? .06 : .18))
      .map((c) => ({ c, a: affinity(p, c) * rnd(.5, 1.6) })).sort((x, y) => y.a - x.a).map((x) => x.c);
    const lseen = new Set();
    let cnt = 0;
    const lmax = benched ? ri(1, 3) : 1;
    for (const c of lp) {
      if (cnt >= lmax) break;
      if (lseen.has(c.l)) continue;
      lseen.add(c.l); cnt++;
      const opt = chance(.35);
      out.push({ type:"loan", club:c, fee:0, signOn:0, years:1,
        wage: Number((p.wage * rnd(.55, .95)).toFixed(3)),
        role: c.s <= p.ovr ? "Stammspieler (Leihe)" : "Rotation (Leihe)",
        roleKey: c.s <= p.ovr ? "start" : "rot",
        kind: opt ? "Leihe mit Kaufoption" : "Leihe" });
    }
    p.flags.wantLoan = false;
  }

  const r0 = roleFor(p.ovr, p.club.s, p.trust, rivalOf(p.squad, p.pos)?.ovr);
  const base = [];
  const mussWeg = p.flags.mussWegBis === p.seasons.length;
  if (p.contract > 0 && !push && !mussWeg) {
    base.push({ type:"stay", club:p.club, fee:0, signOn:0, wage:p.wage, years:p.contract,
      role:r0.label, roleKey:r0.key });
  }
  if (p.contract <= 1 && p.trust > 22 && p.ovr >= p.club.s - 16) {
    const yrs = p.age >= 33 ? 1 : p.age >= 30 ? 2 : 2 + Math.floor(eigen() * 3);
    /* Der Verein bewertet neu: Leistung, Stärke im Kaderverhältnis, Rolle
       und Alter. Ein schwaches Jahr auf der Bank kostet auch Gehalt.     */
    const lr = legendRank(loyalty(p));
    const marktwert = wageFor(p, p.club);
    let faktor = 1;
    faktor += p.lastNote <= 2.4 ? .22 : p.lastNote <= 3.0 ? .10 : p.lastNote <= 3.6 ? 0 : -.12;
    faktor += p.ovr >= p.club.s + 3 ? .12 : p.ovr >= p.club.s - 2 ? 0 : -.10;
    faktor += r0.key === "star" ? .10 : r0.key === "start" ? .03 : r0.key === "rotation" ? -.06 : -.18;
    faktor += p.age >= 33 ? -.16 : p.age >= 31 ? -.08 : p.age <= 23 ? .06 : 0;
    faktor += lr ? lr.y * .012 : 0;
    /* Entscheidend ist, was der Verein überhaupt zahlen kann. Auch nach
       zehn Verlängerungen bleibt das Gehalt an seinem Etat gebunden.    */
    const deckel = clubTopWage(p.club) * (lr ? 1 + lr.y * .02 : 1) * 1.15;
    const roh = p.wage * clamp(faktor, .55, 1.5);
    const w = clamp(Math.min(roh, Math.max(marktwert * 1.35, deckel)), marktwert * .55, deckel);
    base.push({ type:"renew", club:p.club, fee:0, signOn:p.contract === 0 ? Math.max(.02, p.mv * .05) : 0,
      wage:Number(w.toFixed(3)), years:yrs, role:r0.label, roleKey:r0.key, extend:true,
      kind: p.contract === 0 ? "Neuer Vertrag" : "Vorzeitige Verlängerung" });
  }
  if (p.flags.aufLeihe && p.loanHome) {
    const rr = roleFor(p.ovr, p.loanHome.s, 52, null);
    base.unshift({ type:"return", club:p.loanHome, fee:0, signOn:0, years:Math.max(1, p.contract),
      wage:wageFor(p, p.loanHome), role:rr.label, roleKey:rr.key, kind:"Rückkehr vom Leihgeschäft" });
  }
  /* Der Wunschverein aus der Erstellung meldet sich im Lauf der Karriere.
     Höchstens dreimal, und nur wenn er sportlich zum Spieler passt.
     Kam er bis zur zehnten Saison nie, wird einmal nachgeholfen.      */
  if (p.traum && (p.traumMale || 0) < 3 && p.contract <= 2) {
    const tc = CLUBS.find((c) => c.n === p.traum && c.g === p.g);
    const sn = p.seasons.length;
    if (tc && tc.n !== p.club.n && !out.some((o) => o.club.n === tc.n)) {
      const nah = tc.s <= p.ovr + 6 && tc.s >= p.ovr - 22;
      const nachhilfe = sn >= 10 && sn <= 16 && (p.traumMale || 0) === 0 && tc.s <= p.ovr + 13;
      if (nah || nachhilfe) {
        const chance2 = nachhilfe ? 1 : (sn <= 16 ? .34 : .18);
        if (chance(chance2)) {
          const rr = roleFor(p.ovr, tc.s, 55);
          const w = wageFor(p, tc) * (ask.m != null ? ask.m : 1) * rnd(.98, 1.14);
          out.push({ type:"transfer", club:tc, fee:Math.round(p.mv * rnd(.9, 1.5) * 10) / 10,
            signOn:Math.round(w * rnd(.3, .9) * 100) / 100, years:ri(3, 5),
            wage:Number(w.toFixed(3)), role:rr.label, roleKey:rr.key, traum:true,
            kind:"Dein Wunschverein" });
          p.traumMale = (p.traumMale || 0) + 1;
        }
      }
    }
  }
  out.sort((a, b) => b.wage - a.wage);         // nach Gehalt, das beste zuerst
  if (!p.speed && out.length > 10) out.length = 10;
  const list = [...base, ...out];
  if (p.speed) {
    /* Übersichtlich halten: eigener Verein plus höchstens drei fremde Angebote */
    const eigenTyp = ["stay", "renew", "return"];
    const eigen = list.filter((o) => eigenTyp.includes(o.type));
    const fremd = list.filter((o) => !eigenTyp.includes(o.type)).slice(0, 3);
    const kurz = [...eigen, ...fremd];
    return kurz.length ? kurz : list.slice(0, 3);
  }
  return (list.length ? list : out).slice(0, 12);
}

/* Vermächtnistitel für außergewöhnliche Laufbahnen. Nach Seltenheit sortiert —
   der erste Treffer wird groß angezeigt.                                    */
const LEGENDEN = [
  { id:"goat", n:"Der Größte aller Zeiten", t:"Alles gewonnen, alles überragt.", col:"#F3E7BE",
    ok:(p,v)=>v.score>=1500&&v.majors>=1&&v.cl>=2&&p.tot.goals>=250 },
  { id:"unbesiegbar", n:"Die Unbezwingbare Wand", t:"Kein Torhüter hat je mehr Spiele ohne Gegentor.", col:"#5E9BD8",
    ok:(p)=>p.pos==="TW"&&p.tot.cs>=280 },
  { id:"torgott", n:"Der Vollstrecker einer Ära", t:"Eine Torausbeute, die niemand einordnen kann.", col:"#E8B84B",
    ok:(p)=>p.tot.goals>=450 },
  { id:"koenig", n:"König von Europa", t:"Die Königsklasse war dein Wohnzimmer.", col:"#B79AE2",
    ok:(p,v)=>v.cl>=6 },
  { id:"weltmeister", n:"Der Weltmeistermacher", t:"Zweimal den größten Titel geholt, den es gibt.", col:"#3DA35D",
    ok:(p)=>p.nt.majors.filter((m)=>m.turnier==="WM"&&m.res==="Titel").length>=2 },
  { id:"denkmal", n:"Ein Denkmal im eigenen Verein", t:"Zwanzig Jahre, ein Wappen, eine Statue.", col:"#E8B84B",
    ok:(p)=>!!p.flags.statue&&loyalty(p)>=15 },
  { id:"ewig", n:"Der Ewige", t:"Niemand hat länger auf diesem Niveau gespielt.", col:"#5E9BD8",
    ok:(p)=>p.tot.apps>=850&&p.age>=38 },
  { id:"nationalheld", n:"Nationalheld", t:"Für dein Land öfter aufgelaufen als fast jeder andere.", col:"#3DA35D",
    ok:(p)=>p.nt.caps>=150 },
  { id:"komplett", n:"Der Komplettspieler", t:"Tore, Vorlagen, Titel — nichts fehlt.", col:"#E8B84B",
    ok:(p)=>p.tot.goals>=200&&p.tot.assists>=180&&p.trophies.length>=18 },
  { id:"weltenbummler", n:"Der Weltenbummler", t:"Sechs Verbände, ein Koffer.", col:"#5E9BD8",
    ok:(p)=>new Set(p.seasons.map((s)=>confOf(s.land)).filter(Boolean)).size>=5 },
  { id:"sammler", n:"Der Titelsammler", t:"Eine Vitrine, für die ein Raum nicht reicht.", col:"#E8B84B",
    ok:(p)=>p.trophies.length>=30 },
  { id:"eintagsfliege", n:"Die eine große Saison", t:"Ein Jahr, in dem dir niemand das Wasser reichen konnte.", col:"#B79AE2",
    ok:(p)=>p.seasons.some((s)=>s.note<=1.6)&&p.seasons.length<=12 },
  { id:"aufsteiger", n:"Vom Unterhaus nach ganz oben", t:"Angefangen im Nichts, geendet im Rampenlicht.", col:"#3DA35D",
    ok:(p)=>p.seasons.length>=8&&p.seasons[0]&&!TOP5.includes(p.seasons[0].league)
      &&p.seasons[0].ovr<=60&&p.peakOvr>=84 },
  { id:"treu", n:"Ein Verein, ein Leben", t:"Nie gewechselt. Nicht ein einziges Mal.", col:"#E8B84B",
    ok:(p)=>p.seasons.length>=12&&new Set(p.seasons.map((s)=>s.club)).size===1 },
  { id:"sauber", n:"Ohne Fehl und Tadel", t:"Zwanzig Jahre Profifußball, kein einziger Skandal.", col:"#3DA35D",
    ok:(p,v)=>p.seasons.length>=20&&v.score>=900&&!p.flags.wetten&&!p.flags.maulwurf&&!p.flags.altersluege&&!p.flags.steuermodell },
  { id:"raute", n:"Nur der HSV", t:"Sieben Tage die Woche. Nichts anderes kam je infrage.", col:"#4E96E0",
    ok:(p)=>!!p.flags.nurderhsv&&p.seasons.length>=10 },
  { id:"kaempfer", n:"Der Stehaufmann", t:"So oft verletzt, so oft zurückgekommen.", col:"#C13A2E",
    ok:(p)=>p.seasons.filter((s)=>s.injury).length>=8&&p.tot.apps>=400 },
  { id:"mentor", n:"Der Lehrmeister", t:"Was du hinterlässt, spielt heute noch.", col:"#5E9BD8",
    ok:(p)=>p.assets.includes("akademie")&&p.legacyBonus>=90 },
];

function verdict(p) {
  const majors = p.nt.majors.filter((m) => m.res === "Titel").length;
  const cl = p.trophies.filter((t) => t.indexOf("Champions League") === 0).length;
  const bdo = p.awards.filter((a) => a.a === "Weltfußballer des Jahres").length;
  const score = Math.round(p.peakOvr * 3.2 + p.trophies.length * 9 + cl * 34 + majors * 46 + bdo * 75
    + p.nt.caps * .55 + p.tot.goals * .34 + p.tot.assists * .25 + p.tot.cs * .4
    + p.tot.topSeasons * 5.5 + p.tot.seasons * 2.2 + p.awards.length * 5
    + p.legacyBonus + p.donated * 6 + (legendRank(loyalty(p)) ? legendRank(loyalty(p)).leg : 0));
  const tiers = [[1750,"Unsterblich","Man wird in fünfzig Jahren noch Videos von dir schauen."],
    [1400,"Jahrhundertspieler","Eine Laufbahn, die man Kindern als Maßstab erzählt."],
    [1120,"Weltklasse","Du gehörst in jede ernsthafte Diskussion über deine Generation."],
    [900,"Weltklasseformat","Über Jahre einer der Besten auf deiner Position."],
    [730,"Große Karriere","Titel, Länderspiele, Jahre auf höchstem Niveau."],
    [590,"Erstklassige Laufbahn","Oben angekommen und oben geblieben."],
    [470,"Etablierter Profi","Fünfzehn Jahre oben mitgespielt. Das schafft fast niemand."],
    [370,"Solider Erstligist","Kein Superstar, aber jede Woche auf dem Platz."],
    [280,"Journeyman","Viele Vereine, viele Umzüge, immer Fußballer geblieben."],
    [200,"Zweitliga-Konstante","Nie ganz oben, nie ganz weg."],
    [120,"Unterhaus-Urgestein","Kleine Bühnen, große Treue."],
    [0,"Kurzes Kapitel","Es hat nicht gereicht. Aber du warst drin."]];
  const t = tiers.find((x) => score >= x[0]) || tiers[tiers.length - 1];
  /* Neben dem Rang: ein eigener Beiname für das, was aus der Reihe fällt.
     Der erste Treffer in der Liste gewinnt — sie steht nach Seltenheit.  */
  const ehren = LEGENDEN.filter((L) => { try { return L.ok(p, { majors, cl, bdo, score }); } catch (e) { return false; } });
  return { score, tier: t[1], text: t[2], majors, cl, bdo,
    ehre: ehren.length ? ehren[0] : null, ehrenAlle: ehren.slice(0, 3) };
}

/* ================================================================
   JUGENDAKADEMIE UND VERMÄCHTNIS-COINS
   ================================================================
   Ein Nebenstrang, der zwischen den Laufbahnen weiterläuft. Nach jeder
   beendeten Karriere gibt es Vermächtnis-Coins (VC), dafür baut man eine
   Akademie aus. Jede beendete Laufbahn ist zugleich ein Jahr in der
   Akademie: Ein neuer Jahrgang rückt nach, die vorhandenen Talente
   werden ein Jahr älter, einige gehen als Profis heraus, andere hören
   auf. Man kommt also zurück und schaut, was in der Zwischenzeit
   geschehen ist.
   ================================================================ */

const AKA_KEY = "rasenschach:akademie";

/* Die sechs Abteilungen. Stufe 1 hat man von Anfang an, die Kosten stehen
   für den Sprung auf die jeweils nächste Stufe. Voller Ausbau kostet
   1.564 VC — das entspricht rund dreißig ordentlich gespielten Laufbahnen. */
const ABTEILUNGEN = [
  { id:"plaetze",  n:"Trainingsplätze",        kurz:"Plätze",
    t:"Mehr Einheiten, bessere Böden, längere Abende unter Flutlicht.",
    kosten:[0, 16, 30, 48, 70, 96],  wirkt:"Grundstärke der Talente" },
  { id:"scouting", n:"Scouting",               kurz:"Scouting",
    t:"Wer nicht sucht, findet auch nichts. Und wer schlecht sucht, findet das Falsche.",
    kosten:[0, 18, 34, 54, 78, 106], wirkt:"Zahl der Talente · Einschätzung der Anlage" },
  { id:"internat", n:"Internat",               kurz:"Internat",
    t:"Ein Dach über dem Kopf, ein warmes Essen, jemand, der nachfragt.",
    kosten:[0, 14, 27, 43, 63, 86],  wirkt:"Weniger Abbrecher" },
  { id:"medizin",  n:"Medizinische Abteilung", kurz:"Medizin",
    t:"Eine verschleppte Verletzung kostet einen ganzen Jahrgang.",
    kosten:[0, 15, 28, 45, 66, 90],  wirkt:"Geringeres Verletzungsrisiko" },
  { id:"lehre",    n:"Ausbildung",             kurz:"Ausbildung",
    t:"Taktik, Schule, Umgang mit Druck und mit den eigenen Eltern.",
    kosten:[0, 20, 37, 58, 84, 114], wirkt:"Höhere Anlage der Talente" },
  { id:"buehne",   n:"Wettbewerbe",            kurz:"Wettbewerbe",
    t:"Turniere, Sichtungsspiele, Aufmerksamkeit von außen.",
    kosten:[0, 14, 26, 42, 60, 82],  wirkt:"Bessere Vermittlung · Jugendturniere" },
];
const AKA_MAX = 6;
const abtById = (id) => ABTEILUNGEN.find((x) => x.id === id);

const leereAkademie = () => ({
  name: "", gegruendet: null, jahr: 2026,
  vc: 0, verdient: 0, ausgegeben: 0, jahrgaenge: 0,
  stufen: { plaetze:1, scouting:1, internat:1, medizin:1, lehre:1, buehne:1 },
  talente: [], absolventen: [], chronik: [], ruhm: 0,
  bilanz: { aufgenommen:0, profis:0, weltklasse:0, nationalspieler:0, turniere:0, abbrecher:0 },
});

const akaStufe = (a, id) => clamp((a && a.stufen && a.stufen[id]) || 1, 1, AKA_MAX);
const akaSumme = (a) => ABTEILUNGEN.reduce((s, x) => s + akaStufe(a, x.id), 0);
/* Jede Abteilung STARTET auf Stufe 1. `akaSumme` ist deshalb direkt nach der
   Gründung schon 6 von 36 — der Ring zeigte 17 %, obwohl noch nichts gebaut
   ist. Fortschritt heisst hier: was ueber die Gruendung hinaus erreicht wurde.
   `akaSumme` selbst bleibt unveraendert, weil die Errungenschaft „voller
   Ausbau" darauf prueft. */
const AKA_GRUND = ABTEILUNGEN.length;                  /* 6 · alles auf Stufe 1 */
const AKA_VOLL = ABTEILUNGEN.length * AKA_MAX;         /* 36 */
const AKA_STUFEN = AKA_VOLL - AKA_GRUND;               /* 30 wirklich baubare Stufen */
const akaAusbau = (a) => akaSumme(a) - AKA_GRUND;
const akaPreis = (a, id) => { const st = akaStufe(a, id);
  return st >= AKA_MAX ? null : abtById(id).kosten[st]; };
/* Was der volle Ausbau ab dem jetzigen Stand noch kostet */
const akaRestkosten = (a) => ABTEILUNGEN.reduce((s, x) => {
  let n = 0; for (let st = akaStufe(a, x.id); st < AKA_MAX; st++) n += x.kosten[st]; return s + n; }, 0);

/* Vermächtnis-Coins für eine beendete Laufbahn. Bewusst so bemessen, dass
   ein guter Durchgang spürbar etwas bringt, ohne alles sofort zu kaufen. */
function vcFuer(p) {
  if (!p) return 0;
  const v = p.verdict || verdict(p);
  /* /26 → /21: rund ein Fünftel mehr. Der Shop zieht Geld aus demselben Topf,
     mit dem die Akademie bezahlt wird; ohne Ausgleich fiele „Laufbahnen bis
     Vollausbau" aus dem Zielband. BEWUSST knapp bemessen — der Ausbau soll ein
     Langzeitziel bleiben, nicht nach zehn Laufbahnen erledigt sein. */
  let vc = Math.round(v.score / 26);
  if (v.ehre) vc += 11;                                   // Vermächtnistitel
  vc += (p.trophies || []).length;
  vc += Math.round(((p.nt && p.nt.caps) || 0) / 26);
  if (p.flags && p.flags.legende) vc += 7;
  if (p.wc && (p.wc.r === "goat" || p.wc.r === "hsv")) vc += 9;
  /* Ausgleich für den Shop (34.18). Er zieht Geld aus demselben Topf, mit dem
     die Akademie bezahlt wird; ohne das fiele „Laufbahnen bis Vollausbau" aus
     dem Zielband, sobald jemand einkauft.

     Der Aufschlag steht bewusst HIER und nicht in einem der Posten: er wirkt
     dann gleichmässig statt eine einzelne Quelle zu verzerren, und man sieht
     ihm an, wofür er da ist. 18 % sind knapp bemessen — der Ausbau soll ein
     Langzeitziel bleiben. Ohne Einkäufe sinkt er von 30 auf rund 25 Laufbahnen,
     mit üblichen Einkäufen landet er wieder bei etwa 31. */
  vc = Math.round(vc * 1.18);
  return Math.max(5, vc);
}
/* Aufschlüsselung für die Anzeige nach dem Karriereende */
function vcPosten(p) {
  const v = p.verdict || verdict(p);
  const L = [{ k: "Aus " + v.score.toLocaleString("de-DE") + " Vermächtnispunkten",
    v: Math.round(v.score / 26) }];
  if (v.ehre) L.push({ k: "Vermächtnistitel", v: 11 });
  if ((p.trophies || []).length) L.push({ k: p.trophies.length + " Titel", v: p.trophies.length });
  const c = Math.round(((p.nt && p.nt.caps) || 0) / 26);
  if (c) L.push({ k: p.nt.caps + " Länderspiele", v: c });
  if (p.flags && p.flags.legende) L.push({ k: "Vereinslegende", v: 7 });
  if (p.wc && (p.wc.r === "goat" || p.wc.r === "hsv")) L.push({ k: "Besondere Karte", v: 9 });
  return L;
}

/* ==========================================================================
   SHOP — Vermächtnis-Coins ausgeben
   --------------------------------------------------------------------------
   Bis 34.17 gab es für VC genau eine Verwendung: die Akademie. Wer sie
   ausgebaut hatte, sammelte ins Leere.

   Die Preise sind an dem gemessen, was eine Laufbahn einbringt (im Mittel
   rund 50 VC): Kleinigkeiten kosten unter einer halben Laufbahn, die
   grossen Eingriffe ein bis zwei. Nichts hier ist Pflicht — der Ausbau der
   Akademie bleibt der Hauptzweck, und wer alles kauft, braucht dafür länger.

   Jeder Artikel trägt ein eigenes Zeichen. Gezeichnet, nicht als Bild:
   flach, einfarbig, in der Sprache des Hefts.                             */

const SHOP_BILD = {
  wuerfel: (c) => (<g fill="none" stroke={c} strokeWidth="1.6">
    <rect x="4" y="4" width="16" height="16" /><circle cx="9" cy="9" r="1.4" fill={c} stroke="none" />
    <circle cx="15" cy="15" r="1.4" fill={c} stroke="none" /><circle cx="12" cy="12" r="1.4" fill={c} stroke="none" /></g>),
  pfeil: (c) => (<g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="square">
    <path d="M12,20 V5" /><path d="M6,11 L12,5 L18,11" /><path d="M5,22 H19" /></g>),
  stern: (c) => (<path d="M12,3 L14.4,9.2 L21,9.6 L15.9,13.8 L17.6,20.2 L12,16.6 L6.4,20.2 L8.1,13.8 L3,9.6 L9.6,9.2 Z"
    fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="miter" />),
  pfeife: (c) => (<g fill="none" stroke={c} strokeWidth="1.6">
    <path d="M4,9 H20 V13 A6,6 0 0 1 8,13 V9" /><path d="M4,9 L2,6" /><circle cx="14" cy="13" r="1.2" fill={c} stroke="none" /></g>),
  kreuz: (c) => (<g fill="none" stroke={c} strokeWidth="1.8">
    <path d="M9,3 H15 V9 H21 V15 H15 V21 H9 V15 H3 V9 H9 Z" /></g>),
  uhr: (c) => (<g fill="none" stroke={c} strokeWidth="1.6">
    <circle cx="12" cy="12" r="8.5" /><path d="M12,7 V12 L15.5,14" /></g>),
  vertrag: (c) => (<g fill="none" stroke={c} strokeWidth="1.6">
    <path d="M6,3 H15 L18,6 V21 H6 Z" /><path d="M9,10 H15" /><path d="M9,14 H15" /><path d="M9,18 H12" /></g>),
};

/* preis: in VC · wann: "start" nur vor dem Anpfiff, "saison" jederzeit in der
   Laufbahn, "immer" beides. `einmal` heisst: nur einmal je Laufbahn. */
/* Heisst VCLADEN, nicht SHOP: `SHOP` gibt es schon für die Anschaffungen
   aus dem Gehalt (Wohnung, Auto, Berater). Zwei Dinge mit demselben Namen
   sind eine Falle für die nächste Sitzung. */
const VCLADEN = [
  /* „immer", nicht „start": man kauft ihn oft erst, wenn man die gezogene
     Karte gesehen hat — und die sieht man in der Laufbahn. Nutzbar bleibt er
     nur, solange keine Saison gespielt ist; das prüft `rerollWildcard`. */
  { id: "reroll", n: "Noch eine Karte ziehen", bild: "wuerfel", preis: 45, wann: "immer", einmal: true,
    t: "Ein zusätzlicher Tausch der Wildcard. Geht nur, solange keine Saison gespielt ist." },
  { id: "training", n: "Extraschicht", bild: "pfeil", preis: 22, wann: "saison",
    t: "Eine Saison lang deutlich mehr Fortschritt im Training." },
  { id: "form", n: "Lauf der Saison", bild: "stern", preis: 28, wann: "saison",
    t: "Eine Saison in Bestform: bessere Noten, mehr Tore, mehr Vorlagen." },
  { id: "physio", n: "Der beste Physio", bild: "kreuz", preis: 18, wann: "saison",
    t: "Eine laufende Verletzung ist sofort auskuriert." },
  { id: "berater", n: "Ein Berater, der zieht", bild: "vertrag", preis: 26, wann: "saison",
    t: "Die nächsten Angebote kommen von stärkeren Vereinen." },
  { id: "trainer", n: "Der Trainer hört zu", bild: "pfeife", preis: 20, wann: "saison",
    t: "Vertrauen sofort auf 85. Du spielst wieder." },
  { id: "ueber99", n: "Über das Limit", bild: "uhr", preis: 70, wann: "saison", einmal: true,
    t: "Dein bester Wert darf vier Saisons lang über 99 steigen, bis 103." },
];
/* Der Laden zeigt IMMER alles. Bis 34.19 filterte er nach Lage — im
   Hauptmenü stand dann ein einziger Artikel, und man konnte nicht wissen,
   dass es mehr gibt. Ein Laden mit einem Regal sieht aus wie ein Fehler.
   Nicht nutzbare Artikel bleiben sichtbar und sind gesperrt, mit Grund. */
const shopFuer = () => VCLADEN;
const ladenGesperrt = (a, wo) =>
  (a.wann === "saison" && wo !== "saison") ? "erst in der Laufbahn" : null;

/* Ein Artikel im Laden. Zeichen links, Preis rechts, Wirkung darunter. */
function LadenPosten({ a, vc, gekauft, aktiv, sperre, onKauf }) {
  const kann = vc >= a.preis && !gekauft && !aktiv && !sperre;
  const farbe = gekauft ? "var(--mu)" : aktiv ? "var(--ok)" : kann ? "var(--go)" : "var(--ln2)";
  /* Gesperrtes bleibt lesbar, nur gedämpft — es soll neugierig machen, nicht
     verschwinden. */
  return (
    <button className="btn" disabled={!kann} onClick={() => onKauf(a)}
      style={{ display: "block", width: "100%", padding: "11px 12px", textAlign: "left",
        borderColor: aktiv ? "var(--ok)" : "var(--ln2)", opacity: gekauft ? .55 : 1 }}>
      <span style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
          {(SHOP_BILD[a.bild] || SHOP_BILD.stern)(farbe)}
        </svg>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="d" style={{ fontSize: 14.5 }}>{a.n}</span>
            <span className="d" style={{ fontSize: 14.5, color: farbe, marginLeft: "auto", whiteSpace: "nowrap" }}>
              {gekauft ? "gekauft" : aktiv ? "läuft" : a.preis + " VC"}</span>
          </span>
          <span className="m" style={{ fontSize: 11, color: "var(--mu)", display: "block", marginTop: 3 }}>
            {a.t}</span>
          {sperre && (
            <span className="eb" style={{ display: "block", marginTop: 4, color: "var(--ln2)" }}>
              {sperre}</span>)}
        </span>
      </span>
    </button>);
}

/* Der Laden. `wo` entscheidet, was zu sehen ist: vor dem Anpfiff nur, was
   dort Sinn ergibt. Was schon läuft oder schon gekauft wurde, bleibt sichtbar
   — sonst wüsste man nicht mehr, wofür das Geld weg ist. */
/* Eine schlichte Überlagerung über der laufenden Ansicht. Sperrt das Rollen
   dahinter (siehe rollSperren) und hört auf die Zurück-Taste. */
function Ueberlagerung({ children, onZu }) {
  useZurueck(onZu);
  useEffect(() => { rollSperren(true); return () => rollSperren(false); }, []);
  return (
    <div onClick={onZu} style={{ position: "fixed", inset: 0, zIndex: 60,
      background: "rgba(9,8,6,.86)", overflowY: "auto", padding: "18px 12px 40px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="pan pad">{children}
          <button className="btn" style={{ marginTop: 14 }} onClick={onZu}>Schließen</button>
        </div>
      </div>
    </div>);
}

function LadenSeite({ wo, vc, laden, onKauf, onBack }) {
  useZurueck(onBack);
  return (
    <div className="fade">
      <VCLadenAnsicht wo={wo} vc={vc} laden={laden} onKauf={onKauf} />
      <button className="btn" style={{ marginTop: 14 }} onClick={onBack}>Zurück</button>
    </div>);
}

function VCLadenAnsicht({ wo, vc, laden, onKauf }) {
  const artikel = shopFuer();
  const L = laden || {};
  return (
    <div>
      <div className="band matt">
        <span>Vermächtnis-Laden</span>
        <span style={{ color: "var(--go)" }}>{vc} VC</span>
      </div>
      <div className="g1" style={{ marginTop: 10 }}>
        {artikel.map((a) => (
          <LadenPosten key={a.id} a={a} vc={vc} onKauf={onKauf}
            sperre={ladenGesperrt(a, wo)}
            gekauft={!!(a.einmal && L[a.id])}
            aktiv={!a.einmal && (L[a.id] || 0) > 0} />))}
      </div>
      <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginTop: 10 }}>
        Dieselben Coins bauen die Jugendakademie aus. Was du hier ausgibst, fehlt dort.
      </div>
    </div>);
}


/* ---------------- Talente ---------------- */
const AKA_POS = ["TW","IV","IV","AV","AV","ZDM","ZM","ZM","ZOM","AF","AF","ST"];

/* Ein Talent tritt mit fünfzehn ein. Wie gut es ist und was in ihm steckt,
   hängt an den Abteilungen — Plätze an der Grundstärke, Ausbildung an der
   Anlage, Scouting an der Streuung (man findet auch mal einen Ausreißer). */
function talentBauen(a, jahr) {
  const S = { ...leereAkademie().stufen, ...((a && a.stufen) || {}) };
  const natId = pick(REGION_KEYS);
  const nat = NAT_BY_ID[natId] || NATIONS[0];
  const pos = pick(AKA_POS);
  const ovr = clamp(Math.round(34 + S.plaetze * 1.2 + gauss(0, 3)), 26, 56);
  const pot = clamp(Math.round(ovr + 10 + S.lehre * 2.6 + gauss(0, 3.5 + S.scouting * .9)), ovr + 3, 97);
  return {
    id: "t" + jahr + "_" + Math.floor(Math.random() * 1e6).toString(36),
    name: genName(natId, "m"), nat: natId, flag: nat.flag,
    pos, alter: 15, ovr, pot, ein: jahr, verletzt: 0, ruf: 0,
  };
}

/* Wie genau die Anlage eingeschätzt werden kann — schlechtes Scouting
   liefert nur ein grobes Band. */
const akaSpanne = (a) => Math.max(1, 9 - akaStufe(a, "scouting") * 1.4) | 0;

/* Ein Jahr in der Akademie. Gibt den neuen Zustand und die Ereignisse
   zurück, damit man beim nächsten Besuch nachlesen kann, was war. */
function akaJahr(a0, weltjahr) {
  const a = {
    ...leereAkademie(), ...a0,
    stufen: { ...leereAkademie().stufen, ...(a0.stufen || {}) },
    talente: [...(a0.talente || [])],
    absolventen: [...(a0.absolventen || [])],
    chronik: [...(a0.chronik || [])],
    bilanz: { ...leereAkademie().bilanz, ...(a0.bilanz || {}) },
  };
  const S = a.stufen;
  const jahr = weltjahr || (a.jahr + 1);
  const E = [];

  /* 1. Vorhandene Talente: ein Jahr älter, Abbruch, Verletzung, Fortschritt */
  const bleiben = [];
  a.talente.forEach((t0) => {
    const t = { ...t0 };
    t.alter += 1;
    const abbruch = clamp(.15 - S.internat * .023 - (t.ovr - 44) * .004, .012, .32);
    if (chance(abbruch)) {
      a.bilanz.abbrecher++;
      E.push({ art: "weg", txt: t.name + " (" + t.alter + ") hört auf." });
      return;
    }
    let mult = 1;
    if (chance(clamp(.13 - S.medizin * .019, .008, .2))) {
      mult = .3; t.verletzt++;
      E.push({ art: "pech", txt: t.name + " fällt fast das ganze Jahr aus." });
    }
    const zuwachs = (ri(1, 3) + S.plaetze * .35 + S.lehre * .2) * mult;
    t.ovr = clamp(Math.round(t.ovr + zuwachs), t.ovr, t.pot);
    bleiben.push(t);
  });

  /* 2. Wer neunzehn wird, verlässt die Akademie */
  const bleibenNach = [];
  bleiben.forEach((t) => {
    if (t.alter < 19) { bleibenNach.push(t); return; }
    /* Ob es für einen Profivertrag reicht, ist keine feste Schwelle: Es hängt
       an der Stärke, an den Wettbewerben, in denen man gesehen wurde, und an
       einer Portion Glück. Die allermeisten schaffen es nicht. */
    const proChance = clamp(.07 + (t.ovr - 50) * .022 + S.buehne * .02, .04, .5);
    if (!chance(proChance)) {
      a.bilanz.abbrecher++;
      E.push({ art: "weg", txt: t.name + " bekommt keinen Profivertrag." });
      return;
    }
    /* Der weitere Weg: Anlage plus Glück, minus dem, was im Profialltag
       verloren geht. Die Wettbewerbsabteilung sorgt für bessere Vermittlung. */
    const peak = clamp(Math.round(t.pot + gauss(0, 4) + S.buehne * 1.0 - ri(0, 6)), t.ovr, 99);
    const natStr = (NAT_BY_ID[t.nat] || { str: 50 }).str;
    const ns = peak >= 74 && chance(clamp((peak - 70) * .05 + (60 - natStr) * .003, .05, .7));
    a.bilanz.profis++;
    if (peak >= 85) a.bilanz.weltklasse++;
    if (ns) a.bilanz.nationalspieler++;
    a.absolventen.push({ id: t.id, name: t.name, flag: t.flag, nat: t.nat, pos: t.pos,
      ein: t.ein, raus: jahr, peak, ns });
    E.push({ art: peak >= 85 ? "gross" : "profi",
      txt: t.name + " geht als Profi heraus" + (peak >= 85 ? " — daraus wird ein Weltklassespieler." : ".") });
  });

  /* 3. Neuer Jahrgang */
  const anzahl = Math.max(1, ri(1, 2) + Math.round(S.scouting * .7));
  for (let i = 0; i < anzahl; i++) { bleibenNach.push(talentBauen(a, jahr)); a.bilanz.aufgenommen++; }
  E.push({ art: "neu", txt: anzahl + " neue Talente aufgenommen." });

  /* 4. Jugendturnier */
  const staerke = bleibenNach.length
    ? bleibenNach.reduce((s, t) => s + t.ovr, 0) / bleibenNach.length : 0;
  if (chance(clamp((staerke - 44) * .035 + S.buehne * .05, .02, .72))) {
    a.bilanz.turniere++;
    E.push({ art: "titel", txt: "Sieg beim internationalen Jugendturnier." });
  }

  a.talente = bleibenNach.sort((x, y) => y.ovr - x.ovr);
  a.absolventen = a.absolventen.sort((x, y) => y.peak - x.peak).slice(0, 40);
  a.jahrgaenge++;
  a.jahr = jahr;
  a.ruhm = akaRuhm(a);
  a.chronik = [{ jahr, e: E }, ...a.chronik].slice(0, 25);
  return { a, ereignisse: E };
}

const akaRuhm = (a) => {
  const b = a.bilanz || {};
  return Math.round((b.profis || 0) * 2 + (b.weltklasse || 0) * 14
    + (b.nationalspieler || 0) * 5 + (b.turniere || 0) * 6);
};

/* Was die Akademie einer neuen Laufbahn mitgibt. Absichtlich gedeckelt:
   Es soll sich lohnen, aber das Spiel nicht zerlegen. */
function akaBonus(a) {
  const r = (a && a.ruhm) || 0;
  return {
    pot:   Math.min(4, Math.floor(r / 45)),
    rep:   Math.min(6, Math.floor(r / 35)),
    money: Math.min(.10, Math.floor(r / 25) * .01),
    dev:   Math.min(.06, Math.floor(r / 70) * .02),
    ruhm:  r,
  };
}
const akaBonusText = (b) => {
  const L = [];
  if (b.pot)   L.push("Anlage +" + b.pot);
  if (b.rep)   L.push("Bekanntheit +" + b.rep);
  if (b.money) L.push("Startkapital +" + (b.money * 1000).toFixed(0) + " Tsd. €");
  if (b.dev)   L.push("Entwicklung +" + Math.round(b.dev * 100) + " %");
  return L;
};

/* VC gutschreiben und — sofern gegründet — ein Jahr weiterlaufen lassen */
function akaVerbuchen(a0, vc, weltjahr) {
  const a = { ...leereAkademie(), ...(a0 || {}),
    stufen: { ...leereAkademie().stufen, ...((a0 && a0.stufen) || {}) },
    bilanz: { ...leereAkademie().bilanz, ...((a0 && a0.bilanz) || {}) } };
  a.vc = (a.vc || 0) + vc;
  a.verdient = (a.verdient || 0) + vc;
  if (!a.gegruendet) return { a, ereignisse: [] };
  return akaJahr(a, (a.jahr || 2026) + 1);
}

/* Gründung: drei Jahrgänge auf einmal, damit nicht vier Laufbahnen lang
   nichts passiert. */
function akaGruenden(a0, name, jahr) {
  const a = { ...leereAkademie(), ...(a0 || {}) };
  a.name = (name || "").trim() || "Nachwuchszentrum";
  a.gegruendet = jahr || 2026;
  a.jahr = jahr || 2026;
  a.talente = [];
  [17, 16, 15].forEach((alt) => {
    const n = Math.max(1, ri(1, 2) + Math.round(a.stufen.scouting * .7));
    for (let i = 0; i < n; i++) {
      const t = talentBauen(a, a.jahr - (alt - 15));
      t.alter = alt;
      t.ovr = clamp(t.ovr + (alt - 15) * ri(2, 4), t.ovr, t.pot);
      a.talente.push(t);
      a.bilanz.aufgenommen++;
    }
  });
  a.talente.sort((x, y) => y.ovr - x.ovr);
  a.chronik = [{ jahr: a.jahr, e: [{ art: "titel", txt: a.name + " wird gegründet." }] }];
  return a;
}

/* Was als Nächstes drin wäre — und wie weit es noch ist. Das ist der Faden,
   an dem die ganze Motivation hängt: Es soll immer ein sichtbares nächstes
   Ziel geben, das in greifbarer Nähe liegt. */
function akaNaechster(a) {
  let best = null;
  ABTEILUNGEN.forEach((x) => {
    const preis = akaPreis(a, x.id);
    if (preis == null) return;
    if (!best || preis < best.preis) best = { abt: x, preis, stufe: akaStufe(a, x.id) };
  });
  if (!best) return null;
  const vc = (a && a.vc) || 0;
  return { ...best, fehlt: Math.max(0, best.preis - vc), reicht: vc >= best.preis,
    anteil: Math.min(1, vc / best.preis) };
}
/* Wie viele Abteilungen könnte man sich gerade leisten? */
const akaLeistbar = (a) => ABTEILUNGEN.filter((x) => {
  const pr = akaPreis(a, x.id); return pr != null && ((a && a.vc) || 0) >= pr; }).length;

/* ---------------- Ansicht ---------------- */
const AKA_FARBE = { neu:"var(--ac)", profi:"var(--ok)", gross:"var(--go)",
  titel:"var(--go)", weg:"var(--mu)", pech:"var(--bad)" };

/* Rang eines Absolventen auf der Ehrentafel. Die Schwellen sind DIESELBEN,
   mit denen `akaJahr` die Bilanz führt (85 = Weltklasse, Auswahl über `ns`) —
   sonst stünde auf der Tafel eine andere Ordnung als in den Zahlen darüber.
   `col` füllt das Kopfband (Text darin ist --bg), `tinte` ist der Wert auf
   dem hellen Karton; die dunklen Grundfarben wären dort nicht lesbar.      */
const ABS_RANG = [
  { n: "Weltklasse",      col: "var(--go)", tinte: "var(--go-k)" },
  { n: "Nationalspieler", col: "var(--ac)", tinte: "var(--ac-k)" },
  { n: "Profi",           matt: true,       tinte: "var(--tinte)" },
];
const absRang = (x) => (!x ? ABS_RANG[2] : (x.peak || 0) >= 85 ? ABS_RANG[0] : x.ns ? ABS_RANG[1] : ABS_RANG[2]);

/* Ein schlichter Balken. Wird an mehreren Stellen gebraucht. */
function Balken({ anteil, farbe, hoehe = 7 }) {
  return (
    <div style={{ height: hoehe, borderRadius: 0, background: "var(--ln2)", overflow: "hidden" }}>
      <i style={{ display: "block", height: "100%", borderRadius: 0,
        width: Math.round(clamp(anteil, 0, 1) * 100) + "%", background: farbe || "var(--ac)",
        transition: RUHE ? "none" : "width .9s cubic-bezier(.2,.8,.3,1)" }} />
    </div>
  );
}

/* Ring, der den Gesamtausbau zeigt. Sichtbarer Fortschritt an einer Stelle,
   die man bei jedem Besuch sieht. */
function AusbauRing({ von, bis, farbe }) {
  const anteil = bis > 0 ? clamp(von / bis, 0, 1) : 0;
  const R = 34, U = 2 * Math.PI * R;
  return (
    <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}>
      <svg viewBox="0 0 84 84" style={{ width: 84, height: 84, transform: "rotate(-90deg)" }}>
        <circle cx="42" cy="42" r={R} fill="none" stroke="var(--ln2)" strokeWidth="7" />
        <circle cx="42" cy="42" r={R} fill="none" stroke={farbe} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={U} strokeDashoffset={U * (1 - anteil)}
          style={{ transition: RUHE ? "none" : "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.3,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center" }}>
        <div className="d" style={{ fontSize: 20, lineHeight: 1 }}>{Math.round(anteil * 100)}%</div>
        <div className="m" style={{ fontSize: 8.5, color: "var(--mu)" }}>{von}/{bis}</div>
      </div>
    </div>
  );
}

function TalentZeile({ t, spanne }) {
  const lo = Math.max(t.ovr, t.pot - spanne), hi = Math.min(99, t.pot + spanne);
  return (
    <div className="up" style={{ padding: "9px 11px", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 17 }}>{t.flag}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
        <div className="m" style={{ fontSize: 9.5, color: "var(--mu)" }}>
          {POS[t.pos].short} · {t.alter} Jahre{t.verletzt ? " · verletzungsanfällig" : ""}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="m" style={{ fontSize: 13, color: "var(--ac)" }}>{t.ovr}</div>
        <div className="m" style={{ fontSize: 9.5, color: "var(--mu)" }}>Anlage {lo}–{hi}</div>
      </div>
    </div>
  );
}

function AkademieScreen({ aka, onKauf, onGruenden, onBack }) {
  useZurueck(onBack);
  const [name, setName] = useState("");
  const [reiter, setReiter] = useState("ausbau");
  const [jubel, setJubel] = useState(null);      // zuletzt ausgebaute Abteilung
  const reiterRef = useRef(null);
  /* Gegen alte oder unvollständige Sicherungen absichern: fehlende Felder
     werden aus dem Ausgangszustand aufgefüllt. */
  const g = leereAkademie();
  const a = { ...g, ...(aka || {}),
    stufen: { ...g.stufen, ...((aka && aka.stufen) || {}) },
    bilanz: { ...g.bilanz, ...((aka && aka.bilanz) || {}) },
    talente: (aka && aka.talente) || [],
    absolventen: (aka && aka.absolventen) || [],
    chronik: (aka && aka.chronik) || [] };
  const b = akaBonus(a);
  const bt = akaBonusText(b);

  if (!a.gegruendet) return (
    <Shell blatt="akademie">
      <div className="fade" style={{ maxWidth: 620, margin: "0 auto" }}>
        <div className="eb">Nebenstrang</div>
        <div className="d" style={{ fontSize: 34, marginTop: 2 }}>Jugendakademie</div>
        <p style={{ color: "var(--mu)", marginTop: 10 }}>
          Deine Laufbahnen enden irgendwann. Eine Akademie nicht. Sie läuft neben allem her,
          nimmt Jahr für Jahr einen neuen Jahrgang auf und bringt Spieler hervor, die du nie
          selbst gesteuert hast — manche schaffen es bis ganz nach oben.
        </p>
        <p style={{ color: "var(--mu)", marginTop: 8 }}>
          Bezahlt wird mit <b style={{ color: "var(--go)" }}>Vermächtnis-Coins</b>. Die bekommst
          du nach jeder beendeten Karriere, je nachdem, was du erreicht hast. Jede beendete
          Laufbahn ist zugleich ein Jahr in der Akademie.
        </p>
        <div className="pan pad" style={{ marginTop: 14 }}>
          <div className="eb">Guthaben</div>
          <div className="d" style={{ fontSize: 30, color: "var(--go)" }}>{a.vc} VC</div>
          <div className="eb" style={{ marginTop: 12 }}>Name der Akademie</div>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={34}
            placeholder="Nachwuchszentrum" className="inp" style={{ marginTop: 4 }} />
          <button className="btn pri" style={{ marginTop: 10 }} onClick={() => onGruenden(name)}>
            <span className="d" style={{ fontSize: 16 }}>Akademie gründen</span>
            <span className="m" style={{ fontSize: 10.5, color: "#04050A", opacity: .8, display: "block" }}>
              kostenlos · drei Jahrgänge rücken sofort ein</span>
          </button>
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={onBack}>Zurück</button>
      </div>
    </Shell>
  );

  const spanne = akaSpanne(a);
  const rest = akaRestkosten(a);
  const naechster = akaNaechster(a);
  const REITER = [["ausbau", "Ausbau"], ["jahrgang", "Jahrgang"],
    ["ehrentafel", "Ehrentafel"], ["chronik", "Chronik"]];

  return (
    <Shell wide blatt="akademie">
      {jubel && !RUHE && (
        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 40, pointerEvents: "none" }}>
          <Konfetti farben={["#E8B84B", "var(--ok)", "#DCE3D8"]}
            staerke={jubel.stufe >= AKA_MAX ? 1.2 : .7} dauer={2200} />
        </div>)}
      <div className="fade">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div className="eb">Gegründet {a.gegruendet} · Jahr {a.jahr}</div>
            <div className="d" style={{ fontSize: "clamp(26px,7vw,44px)" }}>{a.name}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="eb">Guthaben</div>
            <div className="d" style={{ fontSize: 30, color: "var(--go)" }}>
              <Zahl v={a.vc} dauer={800} suffix=" VC" /></div>
          </div>
        </div>

        {/* Das Erste, was man sieht: wie weit das Haus ist und was als
            Nächstes ansteht. Ohne sichtbares nächstes Ziel fehlt der Grund
            weiterzuspielen. */}
        <div className="pan pad" style={{ marginTop: 14,
          borderColor: naechster && naechster.reicht ? "var(--go)" : "var(--ln2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <AusbauRing von={akaAusbau(a)} bis={AKA_STUFEN}
              farbe={akaAusbau(a) >= AKA_STUFEN ? "var(--go)" : "var(--ac)"} />
            <div style={{ flex: "1 1 190px", minWidth: 0 }}>
              {!naechster ? (
                <>
                  <div className="eb" style={{ color: "var(--go)" }}>Vollständig ausgebaut</div>
                  <div className="d" style={{ fontSize: 19, marginTop: 2 }}>Alles steht</div>
                  <p style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 4 }}>
                    Sechs Abteilungen, alle auf Maximum. Mehr geht nicht.</p>
                </>
              ) : naechster.reicht ? (
                <>
                  <div className="eb" style={{ color: "var(--go)" }}>Du kannst ausbauen</div>
                  <div className="d" style={{ fontSize: 19, marginTop: 2 }}>
                    {naechster.abt.n} · Stufe {naechster.stufe + 1}</div>
                  <p style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 4 }}>
                    {naechster.preis} VC — bezahlbar{akaLeistbar(a) > 1
                      ? " (" + akaLeistbar(a) + " Abteilungen wären möglich)" : ""}.</p>
                </>
              ) : (
                <>
                  <div className="eb">Nächster Schritt</div>
                  <div className="d" style={{ fontSize: 19, marginTop: 2 }}>
                    {naechster.abt.n} · Stufe {naechster.stufe + 1}</div>
                  <div style={{ marginTop: 7 }}><Balken anteil={naechster.anteil} farbe="var(--ac)" /></div>
                  <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginTop: 4 }}>
                    Noch <b style={{ color: "var(--go)" }}>{naechster.fehlt} VC</b> — etwa{" "}
                    {Math.max(1, Math.ceil(naechster.fehlt / 51))} Laufbahn
                    {Math.ceil(naechster.fehlt / 51) > 1 ? "en" : ""}.</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="g3" style={{ marginTop: 12 }}>
          <Stat k="Jahrgänge" v={<Zahl v={a.jahrgaenge} dauer={900} />} />
          <Stat k="Profis" v={<Zahl v={a.bilanz.profis} dauer={1100} />} acc />
          <Stat k="Weltklasse" v={<Zahl v={a.bilanz.weltklasse} dauer={1300} />} acc />
          <Stat k="Nationalspieler" v={<Zahl v={a.bilanz.nationalspieler} dauer={1100} />} />
          <Stat k="Jugendturniere" v={<Zahl v={a.bilanz.turniere} dauer={1000} />} />
          <Stat k="Ansehen" v={<Zahl v={a.ruhm} dauer={1500} />} acc />
        </div>

        {bt.length > 0 && (
          <div className="pan pad" style={{ marginTop: 12, borderColor: "var(--go)" }}>
            <div className="eb" style={{ color: "var(--go)" }}>Was die Nächsten davon haben</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{bt.join(" · ")}</div>
            <div className="m" style={{ fontSize: 10, color: "var(--mu)", marginTop: 4 }}>
              Gilt ab der nächsten Laufbahn. Irgendwann ist aber Schluss mit dem Bonus.
            </div>
          </div>)}

        <div className="tabhuelle"><div className="tabs" style={{ marginTop: 14 }} ref={reiterRef}>
          {REITER.map(([k, l]) => (
            <button key={k} className={"btn sm" + (reiter === k ? " on" : "")}
              style={{ flexShrink: 0 }}
              onClick={() => { setReiter(k); zumAnfang(reiterRef.current); }}>{l}</button>))}
        </div></div>

        {reiter === "ausbau" && (
          <div className="g1" style={{ marginTop: 12 }}>
            <div className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>
              Voller Ausbau: noch {rest} VC · Ausbaustufen {akaAusbau(a)} von {AKA_STUFEN}
            </div>
            {ABTEILUNGEN.map((x) => {
              const st = akaStufe(a, x.id);
              const preis = akaPreis(a, x.id);
              const geht = preis != null && a.vc >= preis;
              return (
                <div className="pan pad" key={x.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <div className="d" style={{ fontSize: 17 }}>{x.n}</div>
                    <div className="m" style={{ fontSize: 11, color: st >= AKA_MAX ? "var(--go)" : "var(--mu)" }}>
                      Stufe {st} von {AKA_MAX}</div>
                  </div>
                  <div style={{ display: "flex", gap: 3, marginTop: 7 }}>
                    {Array.from({ length: AKA_MAX }, (_, i) => (
                      <i key={i} style={{ flex: 1, height: 6, borderRadius: 0, display: "block",
                        background: i < st ? (st >= AKA_MAX ? "var(--go)" : "var(--ok)") : "var(--ln2)",
                        boxShadow: jubel && jubel.id === x.id && i === st - 1
                          ? "0 0 10px var(--go)" : "none",
                        transition: RUHE ? "none" : "background .5s ease, box-shadow .5s ease" }} />))}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--mu)", marginTop: 7 }}>{x.t}</p>
                  <div className="m" style={{ fontSize: 10, color: "var(--ac)", marginTop: 3 }}>{x.wirkt}</div>
                  {preis == null
                    ? <div className="m" style={{ fontSize: 11.5, color: "var(--go)", marginTop: 9 }}>Vollständig ausgebaut.</div>
                    : <button className={"btn sm" + (geht ? " pri" : "")} disabled={!geht}
                        style={{ marginTop: 9, width: "auto", opacity: geht ? 1 : .5 }}
                        onClick={() => { if (!geht) return; haptik(st + 1 >= AKA_MAX ? "gross" : "gut");
                          setJubel({ id: x.id, stufe: st + 1 }); onKauf(x.id);
                          setTimeout(() => setJubel(null), 2600); }}>
                        Auf Stufe {st + 1} · {preis} VC
                      </button>}
                  {jubel && jubel.id === x.id && (
                    <div className="rs-auf m" style={{ fontSize: 11.5, marginTop: 8, color: "var(--go)" }}>
                      {x.n} steht jetzt auf Stufe {jubel.stufe}
                      {jubel.stufe >= AKA_MAX ? " — fertig ausgebaut." : "."}
                    </div>)}
                </div>);
            })}
          </div>)}

        {reiter === "jahrgang" && (
          <div className="g1" style={{ marginTop: 12 }}>
            <div className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>
              {a.talente.length} Talente im Haus · Anlage wird auf ±{spanne} genau eingeschätzt
              {akaStufe(a, "scouting") < AKA_MAX ? " (besseres Scouting schärft die Einschätzung)" : ""}
            </div>
            {a.talente.length === 0
              ? <div className="pan pad" style={{ fontSize: 13, color: "var(--mu)" }}>Zurzeit ist niemand im Haus.</div>
              : a.talente.map((t) => <TalentZeile key={t.id} t={t} spanne={spanne} />)}
          </div>)}

        {reiter === "ehrentafel" && (
          <div className="g1" style={{ marginTop: 12 }}>
            <div className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>
              {a.absolventen.length} {a.absolventen.length === 1 ? "Absolvent" : "Absolventen"} ·
              nach höchster erreichter Stärke · die besten 40 bleiben stehen
            </div>
            {a.absolventen.length === 0
              ? <div className="pan pad" style={{ fontSize: 13, color: "var(--mu)" }}>
                  Von hier hat es noch keiner nach oben geschafft.</div>
              : a.absolventen.map((x, i) => {
                  /* Eine Ehrentafel ist ein Brett mit angeschraubten Schildern:
                     helles Papier auf der dunklen Seite, Kopfband mit dem Rang,
                     Nummer rechts. BEWUSST OHNE Schräglage — die gehört ins
                     Sammelheft, ein Schild an der Wand hängt gerade. */
                  const r = absRang(x);
                  return (
                    <div className="pan pad klebe karton rs-auf" key={x.id ?? i}
                      style={{ animationDelay: Math.min(i, 12) * 45 + "ms" }}>
                      <div className={"band" + (r.matt ? " matt" : "")}
                        style={r.matt ? undefined : { background: r.col }}>
                        <span>{r.n}</span>
                        <span style={{ letterSpacing: ".08em" }}>{String(i + 1).padStart(3, "0")}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ fontSize: 19, lineHeight: 1.15 }}>{x.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="d" style={{ fontSize: 17, wordBreak: "break-word" }}>{x.name}</div>
                          <div className="m" style={{ fontSize: 10.5 }}>
                            {POS[x.pos] ? POS[x.pos].short : x.pos}
                            {x.ein ? " · Jahrgang " + x.ein : ""}
                          </div>
                        </div>
                        {i === 0 && a.absolventen.length > 2 && (
                          <span className="d stempel" style={{ fontSize: 11, color: "var(--go-k)", flexShrink: 0 }}>
                            Bester</span>)}
                      </div>
                      <div className="m zellen" style={{ fontSize: 11, marginTop: 10 }}>
                        <div><span className="eb">Stärke</span>
                          <span style={{ color: r.tinte }}>{x.peak}</span></div>
                        <div><span className="eb">Abgang</span><span>{x.raus}</span></div>
                        <div><span className="eb">Auswahl</span>{x.ns ? "Nationalspieler" : "—"}</div>
                      </div>
                    </div>);
                })}
          </div>)}

        {reiter === "chronik" && (
          <div className="g1" style={{ marginTop: 12 }}>
            {(a.chronik || []).length === 0
              ? <div className="pan pad" style={{ fontSize: 13, color: "var(--mu)" }}>Noch nichts geschehen.</div>
              : a.chronik.map((c, i) => (
                  <div className="pan pad" key={c.jahr + "_" + i}>
                    <div className="eb">Jahr {c.jahr}</div>
                    <div className="g1" style={{ gap: 4, marginTop: 6 }}>
                      {c.e.map((e, j) => (
                        <div key={j} style={{ fontSize: 12.5, color: AKA_FARBE[e.art] || "var(--tx)" }}>{e.txt}</div>))}
                    </div>
                  </div>))}
          </div>)}

        <button className="btn" style={{ marginTop: 16, maxWidth: 320 }} onClick={onBack}>Zurück</button>
      </div>
    </Shell>
  );
}

/* ================================================================
   Darstellung — alle Komponenten auf Modulebene, damit React sie
   zwischen Renderdurchläufen nicht neu erzeugt (sonst verliert ein
   Eingabefeld bei jedem Tastendruck den Fokus).
   ================================================================ */
/* Sagt, ob die mitgelieferten Schriften wirklich ankommen.
   Wichtig: erst NACH document.fonts.ready messen. Eine Zeichenfläche sieht
   nur Schriften, die schon geladen sind — misst man während des ersten
   Aufbaus, meldet sie immer „fehlt". Deshalb Zustand statt Rückgabewert.  */
function useSchriftBefund() {
  const [befund, setBefund] = useState("");
  useEffect(() => {
    let lebt = true;
    const messen = () => {
      try {
        const cv = document.createElement("canvas");
        const cx = cv.getContext && cv.getContext("2d");
        if (!cx || !cx.measureText) return;
        const probe = "HAMBURGER SV 88";
        const br = (f) => { cx.font = "16px " + f; return cx.measureText(probe).width; };
        const grund = br("monospace");
        const fehlt = [];
        if (br("'Rasen Anzeige',monospace") === grund) fehlt.push("Anzeige");
        if (br("'Rasen Text',monospace") === grund) fehlt.push("Text");
        if (lebt) setBefund(fehlt.length ? " · SCHRIFT FEHLT: " + fehlt.join("+") : "");
      } catch (e) {}
    };
    try {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(messen);
      else setTimeout(messen, 600);
    } catch (e) {}
    return () => { lebt = false; };
  }, []);
  return befund;
}

const CSS = SCHRIFTEN + `
.fl{
 /* Grund: dunkles Zeitungspapier — die Nachtausgabe. Vorher Rasen bei Nacht,
    davor ein Blauschwarz. Warm, weil der Karton der Sammelkarten (#E9E2D3)
    warm ist: dasselbe Papier, nur im Dunkeln. Ungestrichen, also matt und
    mit sichtbarer Faser, kein Glanz — Glanz ließe sich hier nur über einen
    Verlauf erzählen, und die haben wir überall abgeschafft. */
 --bg:#191813;--pan:#211E17;--pan2:#282419;--up:#262218;--ln:#3A3628;--ln2:#625C49;
 --tx:#EFECE2;--mu:#A09B8C;
 /* Bedeutung als Ampel des Sports: Rasengrün, Gelbe Karte, Rote Karte.
    Akzent ist das Blau der Stadionhefte. */
 --ac:#3D8FDB;--go:#F2C230;--ok:#3DA35D;--bad:#EC6152;
 /* Signalrot des Störers auf dem Titelblatt. Nur als Fläche, nie als Text. */
 --stoerer:#D93A2B;
 /* Zweitwerte für helle Flächen (Karton). Ohne die ist auf Papier nichts lesbar. */
 --karton:#E9E2D3;--karton2:#DBD2BF;--tinte:#14171A;--tinte2:#565C58;
 --ac-k:#15558F;--go-k:#7A5600;--ok-k:#146B33;--bad-k:#A81C13;
 /* Zeitungspapier: unregelmässiges Korn. EINE Bildlage und eine Vollfarbe —
    weniger als vorher, der Zeichenaufwand sinkt also.

    Zwei Versuche davor waren falsch. Erst eine schräge Linienschraffur: auf
    dem Gerät Cord, nicht Faser. Dann zwei Punktraster mit teilerfremdem
    Abstand: gleichmässiger als gedacht, es sah aus wie Punkte AUF dem Papier.
    Beides hat dieselbe Ursache — mit Verläufen lassen sich nur regelmässige
    Muster bauen, und Papier ist nicht regelmässig.

    Jetzt eine 96x96 grosse Kachel aus echtem Rauschen, nahtlos (weichgezeichnet
    mit Umlauf), zwei Korngrössen übereinander, nur abdunkelnd — Aufhellungen
    sähen aus wie Staub. 5,9 KB.

    Das HALBTONRASTER ist vom Grund verschwunden und bleibt den Bildflächen
    vorbehalten. Ein Raster ist die Art, wie ein Bild gedruckt wird, nicht die
    Oberfläche des Papiers; auf dem Grund las es sich als Punktgitter. */
 background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAW/UlEQVR42qVd2Y4jOZL0uE9FhK68qrqnF1hg5/8/ad8XO5jtnqkjM2sfml4ymdxJKjuAglRKKUg6/TA3OhkiIjv58xrkclXwvhSRY3jdiUgdvruIfZ3g/RB+h58dRKQRkSncq4PXJnxnJ/ddVbgHX52IFCIywv9FRGb4TmG830fa6kNbbXhfZPSvCHKYw+sYXqUSkR/hZl/gy+9BGG349yP8/V1EzkFAv4vIa+jMOzT2r/Bah0Z6EflnuIeIyBZ+V4bvFOF+38Jnr+G7PxKD6sOAvoQJ/gKfv4b3b+H1PQj199DGEl6/Gf2XMPZvTruTiPw7TKb2tYP+TqHdEj4rQxuqJF+CXN/0j0PoOM/WCDfV7zyD9r/ATcuEhuL7QkQ+w/0b0trzHdp/gD7GrobaQYudQ7tqGWsQkKfN3hgbQxZVGM8MXmECeZsNFUFTUShTaOA/w022cJPe6VBN5ryF9w/k9vrQB3VNx0zB70CwLPyW3GBKgEX4V4ErLMCFSVC6itoo4HVH40UXPYfvLEabsg9/6KDjDWmrBMG04AM7mO0hIqgy3K8C37cFzauCtqlGjBFLKkkhugyNF/re4MSXFsbeQVu1YzVCQj5GFPAI7vjX0E6D5vFFRL4Gf4Q+U8DPaaD8Fibke/i7+urXiFkO4X6vofHX4EP/FX5bB8H/O/SDrw3aPIbvjKGvA7jKbzDRn8Prd/LlfYgDBQn/W7jfFH7zBpP+GvrwBSzvG7x/DW19pXtqv77AxP8Rxv2OMaAnDRtI06rQsQJuvmQEyF2wrhr8dBP84Qjt1GQpg6FheH0Onw9guXqN4HNZ+0sS/GxYWBH6U4M1Iro6hvsvQSbqkh7A9ewMJFYalrRoHzoYdAFC6CAgebCwhd95fngKAllhIjlu7GEw6iv1s4p8fQuBegBLm52g24Mg9mEsDdynJEUYSJH4+jV8XoYx1U4c3VHfheR6FJGqDKZTgEtpg4l8DTd4E5H/czr0A16/k3ZVwXTrYHo/SFAdaG0BZj8EE1eo+hYG8B369zVAW0RRv8MEKxQ8glavIvK/YWzqmr6Cuy0BbAj8Dse0ish/ByS4Brf5akDWMriajpQIle9/0EJbivBnRyMwglfklmbje0cwt5XQgwddSwO+VuQqG3Bjexgom/5s+GV2TehyBNzaBuNXlNPTZImRAO5oLJt84GK/asG3HqCa9xshLedOlpR74Gej07cVEBNezyCMKriKBeLPABMxOW7jHO7jxbU+TPhgyEXHUIELnWGsa/jN5GTtPwXTUKNdIiEZ4Ts7utdGPrCn5ImDYUf3mOjvsRyhJc0bIHcpI/kKjvVkTFYFf3+hyeiMpK4N32tF5D/CP7TIyfIshREUvU6igMuIIMrQ2GokRWUEt38C4bWQGGHusRh9/o2yY2zr7LSFUFkiLpe5pIKE31E23oZxvMBYK/iumzcNjkblpOTWpO0dPxm75iDAzogNY8I9oVBLSPSGxJg657MBCMiZJs/KwAvy+x0ooMaR0ZJHl9GxJlOAW0KbYi5gD79rw/9H4qqewgT1RtxRGN1F4OHk5Bg8vkeICy24v8LIeBXTt6RwGyhDYcSTG23uMog1FjSa40eFz/xKB370HDrbEL5ujfjVGvyLJdxDxCp14hQZtRGUJoaLQQt8NtCZ8l6lx13w+9IIsMj8bfA6w28LwzR1khcQ0t6YPAFNbpzM1ftMMniiisbZU5bfGZB7MZRqNfqApNsG99/IMhar/zsw0Tnha0fw841BaXgxozG+U9NnNU30ozHw1ri/LngcnGw9NnlVpqttDbdVO3mA5HqEEX54BH/WGibEAlLhne5wPWXm9zQhakALLUS2d9YDUq60JkEWRJ33GfAVlSIGSgrigWqeGeS0FROXiaAZ0/QpIvwlQSOfQ/sjuIXZ+e7+DoGroIqI4E5hbENmoipGDFgNl46w+NGylpYmpMoYTEWCbxOQcwQfW2cuktTBKnfE0zRG4JRI3wsCDZYrxBWxU3jdJ8bNLnxHE1uRG7IIwJ//qeRjVwcsapOwkCZiTZOBqE4wuJ6C9REQUg3fbyB+xJBdAYjlGL6/ymXVrowkpYPBCGgfK2M9YwSSErkk05z6D0yC4vABGpsc5DETtPQGOAPziPdZgZOJweQiogS87HoI0Pfvclm1GmECVkM2DShOS5nyPqxdxNDa6SPa3mb4xkeH0o0FQs+q0N38LWjnGeiFYxCUxguL99kMV6f3PkAQV3a1NaBxGen/AZJGFPgeJq0yPMyIs5BK78uE4AbigY7Q4OiYf5+gN8RhWDuiw3uHEKwcC9fFlCX0eQWuiQU1Zli+vp7B6o9yXTc0gAwn7KDW8XxPaPW7XPP/38MAvsqF7/9HuKeuAZ/kshjzTvd8FbuuyLu+w6Sv4R5jGOSb/Ln2ushl8UhCu28RGPyPcJ83udQ/vctlIWoK8tEaH6z10XF8AaHqerJSD+/AJak3+O7JmrNDXGZsgIqtofHWQCS46q+czUJ+vMjIVnMSmcpxiaXxHtdsz+AmKxH5Ra7XI6zAfUi45TFo/efQhsYYhLUTAIMxh+UcHZKtBHJqSwjg0RBIG0FcSmE3pO1MbZzpN1skGH8GVDNBHsKrZj3lQmK0zTBZl1kfSEHR3WhONecwzbMTaD5Bp5QBbJwA/WtCmyeiF0qDcLOUIgcmN0DMcXKkBWWPQaNbsMyZWNT6Dip+A4VE5nQIilIZMbQRY4ZLuV5UWCiyN04ArhxuZDCCZB0maAPOHUmxkRKbWeLFunWgqEcn8NYEXzcQ+s5Qvj78vSKmUxfsY7xPTwG3zyA7b5KjwmlASwiniAlhZdvBaQNXoJpILuJlkjzxT3Jbze356b1htaWB4nrK3LXE5Rk0HqmFjWQygaB3ND5drXvGbBIH2kGQeDLMviIiDgVTRzLHfSTBmw0LrEmra2JOd/D/nlzg+Q73IQAXLXAwOQqgLm4XyfJHRyk+QcIqFSAcCUL3KIOSOmBR0IWRMeoAVwhalWMhSFv3DvpAPucRglyfsR7ArGRpKJjGvI2QXm3ESKZGcOJ0GTWb4mkc+gA7vtDszgZs5Y0LpfH/WCZcRTQJC4jXYMqTk2mmYG0L7Cxb8ySXMhIepzgKq/IriKbg6yGHWKsi7mSW6/0EMcxu4fdHhxfhwikLvu7u4FIqB6kVhos5RpDWTIqgAGWheNVG8H1hUN83nXiUy5JhbGWrMgK3av2jY/KNYQH82hIR1xv8vbq+0qGmu4gbWii/KOlviKBGuRTdbuDzlSlVBa2hfweC0kdI9AQydxNFdZm+Hz/L3RXjYXkrY9VlxV9IY3pCGkWEk/c+LyghsjLSTxTcj0EhXiAeLQagKGnS9/QqnkcpKHE4wUQ8AelVO6k6wrfF8Ou4PrDJdaWwBT21gll98CbXNUE9+NDGmNQu4g7rhJL0RkzENpRSOYtfsmlROw8J5fjpfhq5rdsvSMh888pwT88UKI+0ZsCCKYktxGVL3ptQEF3cUNabmoDKSNAslhctBV3TkplzYKGCUt8vkEc96Tg0++ycwNo4CZdVRXBILEAMDirgSSypHy3RvmNEq3Oq8GonW54hvpTUL9yQYSFFVIwRENFIcHTH7qoyGhOCUQealC7MYBFZO0DWdCIUkRLSIyyWTERpWGRWIbf72yyXVESSwYrQFS6kz8TyFqSEo9M2b+rD3GnFbLiETBB/vIeZ3BtIAmeydzQKcwuexBEsp5W8pdA+QQtPpEQFCLUjaLk6bmiDtkoQPhaJjZC5j0aSirlEL7ebye+qHKwAeq4QVCbDD6KL2BmB5549wKlrhX7krC+UjlUwVEU3patkR/hc2dLacc8bEJDIrDbWRGOQLA0fyVVrmLiMjqkfids5GUipNYJ9GaENOsg8FyOb1iD+OZFkcsHxYLjdOkLPoybjxBf0Wy2/eTBc0lWVN3P8AtDPWzzY5LII3hpCWkkjjsA3lZScDWSSe0nvwsTFjgGIO51EhL6VAyjaD1jcAQKpByk3uWybQkvdARN6wIlcxC6ojWXNagXPcikdHx0fvZEmYTDC+tI20oda7NrOFjLl2qHBV7mu2W8By1saXhoQs4LJnQzhMzMww+si15tHFqDkN8wwPa7iFAmGVUAsyO8fIrBwNQbNhVxTRlaLhNkz9aUijcVqh41obs8aOupD79DT7C4foH9NBiNbML5F/9RFTL+hxKhOmHQDbqUxKAL1ly+GH+aNDcMdwXx18pXFQH1egMcyylQBAHsKr6QeofnPm493uCE1SaUMdBF9bwy2ATezkQbPINi9EQ88H4uD/PsdSA6zdU+gjcOI9qG9I7jE1tHqhf7WG8ypEo4320KrhOnUhOtbMO9dZACWdllCPSdygL2hmSlqXWnsNiOXYE/A7/VEF29b7ilhGbUxKT+3zSCE9HxvH4TUUWCN0QNHYlt/EXuRZTOskJc+8QSTz4YwUTnuPXlLhTkB1cwKcJJLlbP2+yGjrcKz5iERXHKTGy1ILUJgRB/bUUI3E0T9LzLz4o72mRFtDfAwOZZXEP2BEFt/xxvuzmHij+JvXhkSXJp5LRGepjcsYXOE0RJl+0iTW9IgP98Z4DpCL7xTRtHcClZdAy0gTuI0g9A/RVwgV2ozzVJK/tLoJHf4RAuWbnK9MFNAMMZjbWLJ1fpBy8Nq5MFgKsdIMD45PFJJaKUm12gdbOgtPDW5LK0HH/GMM65rSWWRNSQtc2SSczaG436yFvpWUKI1OokYW8uYiHGWJxgj+VBFzKjGtEHsijjXpGsnpe4p28XyDy796yhIMgPYgvYi//7Rq5J4nenRQCpzxL3sHIV4EntXfCx27knxhhSyiUGxc7jhHijqOXTsUS7bcxriaPpIPCkSQVWXRAsK4rPhR3mh3qMYhoiL6CIwvACFrCh+IStaGn3s73HzvHlMC5/05JMNuCAtI6nI7PuM+6f+NhoTVEZyB7SIlVzhQYyNEcYkMlffEk2yEEzVM4wO4IIqI4BvTv8rtoKS0JAKejNYRZwkxcOdMQklQbgxQxNm6iRWInBFttZuruSDxYGmsQTPO1d0A6Smh3eUoPnP5I6QchkdtHlVm8THQa7kw1vHXTQGYcU7FrtIguVqQ8aFtT94/Atm4mqlhTMJCA4UvT0brqs20NqeAIBn3dbZQDeLWL0Bt3KuzRAopuFWndGYMEWrcrmIuCtvHbt1gILI9Q7IRa6r7UqiCvhEYY2BO4KqVqml3nfIjQFNAiXEICeXbPQJMkwSFuVRIinKw5qoR8PKhfKHzoGZcyRviUFarCqvI7TEQYgW+JSgARRv45lpo1zXVZYZk8xQb5Pb4to5gxnN2QbLR1viETSNXB/JMN1h/TnK3AIUL5xM/udAugxCaRC70kxNejO0BgP44NzT2hTyV/IDK8i2BBY813eQ2yNrqgTWT8UqfF+Sa7pJaqwfK+OnnUVO/RTyhBe5Xq7kwSnUw+W7wTDTLUILf4TKOMj1kQT1Bye4JH/unamBljwTQtqRpc0x8xkpcms6XhvaUQBPHjtpUa0NK+hKsgZGUDvym63Yxxw0GRO1QAKJ/R9AsZQsZNKtIaqhi9AoHj+kpwdrXwr8I/LfD+SLmwxttI636QnqjdRhXVHbg4aOjvZpgdeB8PYgecfUvABELiJjYdjdRaCzutc9CR3PDX2RSxHaBNB5Rje0JBKjU9Dup0hQfKQ0XM19BFSjFRgtWMpvQF55x8uXkIlzgK4z3Qf77coJppOD1tqIZfWOK6zusVIr0HwCt+J1ooKOIM+iC/EVmfoA1nQA+Dc7wfNkJIRj0KwnZ+CtwcsXjrIdnInKPWozlVxWqQC9RILXKJcC0sX47kzBE1eD9gDD0Ac+gquZ5Ho/wglobD5ztAAf3hioKSWQl+Barcx+ytTSzgnMJyPJY9Q3p5S+MsytS5hgRVyK1kHOzn1ruX5OgGaS+gSNiZDU6ljFo5Fxe4BiisSKNfK7MqKYDAy6vwKb8chgD57VBq26kZCtMzZzy/8e4N57Q6hMlewd87YgcG3A4yICuVsjax8/wO7u5Hrh3nVTD0Be6Wkee2h4yGgYCTGPnLJcA+4XwPMjtszBWrsSrUmZ5cLnzzSxkyPgveM+Ork9e7o1JiqVV5nCmQAj7+T68SWD3C40ePWYsYy0N2gCXMzpJK+SYHMm6ECJ0ETuD7+vsBDd1ItxT8t9lUbMqOUvXPUd1PAAwqoi5jll3quC5GZwuPSJLGcTeyVsg9fJEBLjdauNLkdryRItd1MTfH6RCKeBCZmu8PCpIo3jk2PFrrkUNydpmOovoIU1cUhLhqvqIy6tI7JMffff5Pr4/SqRZzC3hM+QGXNj4gtMAlZ7VSRMrZGMLUyXCWaVdzta5FwZ4ZVwsmuDQNM22HL01JTJQEOr4VImuX2qRkexz+KD9rn+H82xdYJuHQlynNozX29VGjQAQbdMZtHC5IVcH2+PHJF1zPxsWEwFpJlaymeKGZrtHuh3qxMfFmNyVRbHGGxajdnqyCVsxP/wAwme5HqTWgy+tUbw965fErFLhb5zXNCDXDZ15NQ24V5lPEd7cBJAMWh3dZEvcr3gU8YmQSS+CFIbkHNPNPVmxJhNbgt6W7k99j6VhRaOm6kzEjLreTdDJH85Ql4yGSyoSLqOtY4Fdos2fZPbRxPq0Y51+JseyajP9fpDLkc0VvLn0ZGqPXqkZCWXxyLqQL7K5VGB/5TL43WtwXmPuC3kz+d4vUeg4HsQ/h8AMPS9Pt/sTS5HU+qlj1tsoP03sY/Z1EccIpjRRwCra5/CmDvxH/9oXpORZGFNKJbmce3o6KCRDvyhtTuRV8pwET33ED+sxDsF5nUA6MrFuqOTlLWUoXd0/zrhXmpwRz14iyKFzwsH/zN03IPJ1s5vOcHSQNwn4oWI8+injFwkRn6VBk9VQTDWB0aPQMmz79+MCbhnT0LhwaSd3G7HzznGsQbW9Ei/s7bz6DO3NhLoZPBESwYVPDvBFauzT2SN3rkYXET2YNAY4gTmOkL6PRCK+wmtcsw5dZwAk169XO8/7g3h6Xk8/BDNWHnM8U5+fnYgaBMZq07m2dFs7e+zMbbYxo3oDspa0ovgLaGgVJLB68cTDIpPI+khCdyDP32kCZnuYCVRC58CxudETBfSu0jf+VHkLeUXksi210hWfhNI6wTBNMntDpOYIJoMgs2rmENy7dEwaYkkcuyOsM60S7CoYtDtJXkDFGidoD9eKHYkcwGPu7C2+/dg6g3hbv07H9C0GjhZ2Uk8m1pRwwaWU2cmUxgoZ7mUz9Ri702waGXdlKiTdg6/PSaQl4i9d6GzKIicCrPTHdrrPSTnk0ElcOf12S28+XuU+66B0M4A2bQKf4lYlOUhDjCpXBcUO+B7pNi1xoS3ZqbpOcFvgJR+k+tNbaksW11GKbePFi8TEJP7sKM4wy6JYemY6GOTqRC4AbAAGj2JlQvgZhaxT6jKudTVoDvizqeQSSv2oaw52H8hmtkroFrlet+yV3jLdMZgBFk+RwgPf10oll1pSXeHxqdmvwN3gr95IHi6JTRng3tZENZjIfGUq5EYTUuJvEq2gT6rjfcsp9lwMw3kAIN8wL1IhG6NlZu3lID8Bvx5bAvS2UAS1ibr7E3QFJQL0sTUIYVn8Y9GbglAbMAs7+TPhZ3FmdQbXqZ1coFK/OKs1IzimuwEneN7TYlJXai9vfz1y4LHpZFU7SW+ARsfUPoUoXKiSl4leIwHB6J5Nx4MjcVJxANNUwIdaJAniR/q0WT8fyKrwD1m1nMK8GRfSWB+bKONBO1VJH3gnecfp4hG8OHeuF1pcdrQYLvK7QN/rBxllvSjRlBAyHR2NKFojTmQtCIYXcl14W0MRWIyKP8PO+k7YPcr1RkAAAAASUVORK5CYII=) repeat 0 0/96px 96px,var(--bg);
 color:var(--tx);line-height:1.5;
 font-family:'Rasen Text',Roboto,system-ui,-apple-system,'Segoe UI',sans-serif;
 font-size:14.5px;-webkit-font-smoothing:antialiased;
 /* Die Textgrösse wirkt über zoom, nicht über die Grundschriftgrösse. Grund:
    357 Schriftgrössen stehen fest in Pixeln und erben nichts — der Regler
    veränderte bis 34.7 genau zwei Stellen im ganzen Programm und war damit
    praktisch wirkungslos. zoom skaliert alles gleichmässig, also auch
    Abstände und Bilder; das ist genau, was der gesperrte Browserzoom vorher
    tat. Deshalb heisst die Einstellung jetzt „Anzeigegrösse".
    min-height muss gegengerechnet werden, sonst entsteht bei zoom > 1 eine
    Rollleiste über die ganze Seite. */
 zoom:var(--skala,1);min-height:calc(100vh / var(--skala,1));}
.fl *{box-sizing:border-box;min-width:0;}
.fl h1,.fl h2,.fl h3{margin:0;}
.d{font-family:'Rasen Anzeige','Roboto Condensed','Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:.9;letter-spacing:.015em;}
.m{font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1;}
.eb{font-weight:700;font-size:9.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--mu);line-height:1.4;}
.pan{background:var(--pan);border:1px solid var(--ln2);position:relative;}
.up{background:var(--up);border:1px solid var(--ln2);}
.pad{padding:15px 16px;}
@media(min-width:640px){.pad{padding:17px 19px;}}
.bar{height:7px;background:#0D1119;border:1px solid var(--ln);overflow:hidden;}
.bar>i{display:block;height:100%;}
.btn{background:var(--pan);
 border:1px solid var(--ln2);color:var(--tx);cursor:pointer;
 text-align:left;width:100%;min-height:48px;padding:13px 15px;font-family:inherit;font-size:14px;font-weight:600;
 transition:background .14s,border-color .14s,transform .09s;}
.btn:active{transform:translateY(1px);background:var(--up);}
.btn:hover{background:var(--up);border-color:var(--ln2);}
.btn:focus-visible{outline:2px solid var(--ac);outline-offset:2px;}
.btn.on{border-color:var(--ac);background:rgba(127,166,212,.14);
 box-shadow:inset 3px 0 0 var(--ac);}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.btn.pri{background:var(--tx);border-color:var(--tx);color:var(--bg);font-weight:600;
 border-bottom:4px solid #8E97A6;}
.btn.pri:hover{background:#F2F5FA;border-color:#F2F5FA;}
.btn.pri:active{transform:translateY(2px);border-bottom-width:2px;background:var(--tx);}
.btn.sm{min-height:38px;padding:8px 13px;width:auto;font-size:12.5px;}
.chip{border:1px solid var(--ln2);color:var(--tx);font-size:10.5px;font-weight:600;padding:3px 9px;
 display:inline-block;white-space:nowrap;line-height:1.6;}
.chip.g{background:var(--go);border-color:var(--go);color:var(--bg);}
.chip.a{background:var(--ac);border-color:var(--ac);color:var(--bg);}
.chip.r{background:var(--bad);border-color:var(--bad);color:var(--bg);}
.sel,.inp{border:1px solid var(--ln2);background:var(--pan2);color:var(--tx);padding:11px 13px;width:100%;
 font-size:16px;font-family:inherit;min-height:48px;}
.sel:focus,.inp:focus{outline:2px solid var(--ac);outline-offset:1px;}
.tbar{position:sticky;top:0;z-index:30;background:rgba(4,5,10,.95);backdrop-filter:blur(8px);border-bottom:1px solid var(--ln);}
table.led{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:11.5px;}
table.led th{text-align:left;font-weight:500;color:var(--mu);font-size:9.5px;letter-spacing:.1em;
 text-transform:uppercase;padding:6px 5px;border-bottom:1px solid var(--ln2);white-space:nowrap;}
table.led td{padding:6px 5px;border-bottom:1px solid var(--ln);white-space:nowrap;}
table.led tr:hover td{background:var(--up);}
table.led td.r,table.led th.r{text-align:right;}
.sc{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.sc::-webkit-scrollbar{height:6px;width:6px;}
.sc::-webkit-scrollbar-thumb{background:var(--ln2);}
.fade{animation:f .26s ease both;}
@keyframes f{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:none;}}
.g1{display:grid;gap:12px;}
.g2{display:grid;gap:10px;grid-template-columns:1fr;}
@media(min-width:640px){.g2{grid-template-columns:1fr 1fr;}}
.g3{display:grid;gap:10px;grid-template-columns:repeat(2,1fr);}
@media(min-width:480px){.g3{grid-template-columns:repeat(3,1fr);}}
/* ---- Bewegung. Alles über transform und opacity, damit es auch auf
   schwächeren Geräten flüssig bleibt. ---- */
@keyframes rs-auf{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
@keyframes rs-rein{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
@keyframes rs-puls{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes rs-blitz{0%{background:var(--go);opacity:.35}100%{background:transparent;opacity:0}}
@keyframes rs-dreh{to{transform:rotate(360deg)}}
@keyframes rs-flip{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
@keyframes rs-schimmer{0%{transform:translateX(-120%)}100%{transform:translateX(220%)}}
@keyframes rs-zeichnen{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}
.rs-linie{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);
  animation:rs-zeichnen 1.05s cubic-bezier(.3,.75,.35,1) .12s both;}
.rs-still .rs-linie{animation:none;stroke-dashoffset:0;}
@keyframes rs-welle{0%{transform:scale(.25);opacity:.95}100%{transform:scale(2.8);opacity:0}}
@keyframes rs-sog{0%{transform:scale(1.9);opacity:0}55%{opacity:.8}100%{transform:scale(.85);opacity:0}}
@keyframes rs-funke{0%{transform:translateY(0) scale(1);opacity:0}12%{opacity:1}100%{transform:translateY(-150px) scale(.25);opacity:0}}
@keyframes rs-schweben{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes rs-glanz{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes rs-strahl{to{transform:rotate(360deg)}}
@keyframes rs-pochen{0%,100%{box-shadow:0 0 0 0 rgba(155,188,226,.55)}70%{box-shadow:0 0 0 14px rgba(155,188,226,0)}}
@keyframes rs-beben{0%,100%{transform:translate(0,0)}20%{transform:translate(-2px,1px)}
  40%{transform:translate(2px,-1px)}60%{transform:translate(-1px,-1px)}80%{transform:translate(1px,1px)}}
.rs-auf{animation:rs-auf .34s cubic-bezier(.16,.84,.44,1) both;}
.rs-pochen{animation:rs-pochen 2.1s ease-out infinite;}
.rs-rein{animation:rs-rein .3s cubic-bezier(.16,.84,.44,1) both;}
/* ---- Sammelalbum. Nur für die Bereiche, in denen wirklich gesammelt
   wird: Errungenschaften, gezogene Karte, Enthüllung, Ruhmeshalle. ---- */
.klebe{box-shadow:3px 4px 0 rgba(0,0,0,.55);}   /* harter Versatz, kein weicher Schein */
.leerfeld{border:2px dashed var(--ln2);background:transparent;}
/* Perforation — das Kennzeichen. Genau eine Stelle im Spiel: dort, wo die
   Saison endet und der Transfermarkt beginnt. Häufiger eingesetzt nutzt es sich ab. */
.perf{height:1px;margin:20px 0 14px;position:relative;
  background:repeating-linear-gradient(90deg,var(--ln2) 0 5px,transparent 5px 11px);}
.perf::before,.perf::after{content:"";position:absolute;top:-6px;width:11px;height:11px;
  background:var(--bg);border:1px solid var(--ln2);border-radius:50%;}
.perf::before{left:-6px;} .perf::after{right:-6px;}
/* Kartenfelder nach dem Vorbild von Block/Reihe/Platz: umrandetes Raster
   mit Trennlinien, Beschriftung über dem Wert. */
.zellen{display:flex;flex-wrap:wrap;border:1px solid var(--ln2);}
.zellen>div{padding:3px 9px;border-right:1px solid var(--ln2);border-bottom:1px solid var(--ln2);flex:1 0 auto;}
.zellen>div:last-child{border-right:0;}
.zellen>div:last-child{border-right:0;}
.zellen .eb{display:block;margin-bottom:1px;}
/* Karton. Nur dort, wo etwas gesammelt wurde — die Seite bleibt dunkel,
   das Gesammelte liegt als helles Papier darauf. */
.karton{background:var(--karton);color:var(--tinte);border:1px solid var(--karton2);}
/* Kopfband. Im Stadionheft steht die Bereichsbeschriftung in einem gefüllten
   Balken über dem Abschnitt, nicht frei schwebend darin. Die negativen Ränder
   ziehen es aus der Polsterung von .pad heraus. */
.band{display:flex;justify-content:space-between;align-items:center;gap:8px;
  margin:-15px -16px 12px;padding:5px 11px;font-weight:700;font-size:9.5px;
  letter-spacing:.16em;text-transform:uppercase;color:var(--bg);}
.band.matt{background:var(--ln2);color:var(--tx);}
/* ---- Zwei Formen fuer zwei Prestigeleitern ---------------------------------
   Die Seltenheit der Wildcard traegt ein GEFUELLTES BAND ueber die volle
   Kartenbreite. Die Errungenschaftsstufe traegt eine KOMPAKTE MARKE mitten
   im Text. Beide sind gefuellt — unterschieden wird ueber Breite und Ort,
   nicht ueber die Farbe. Das ist noetig, weil „Aussergewoehnlich" gegen
   Stufe Platin nur dE76 34 auseinanderliegt.

   Ein Umriss fuer die Seltenheit war in 33.15 ausprobiert und wieder
   verworfen: er nahm der Wildcard-Karte ihren Auftritt. Nicht erneut
   vorschlagen, ohne das zu bedenken.                                       */
.stufe{display:inline-block;padding:1px 6px;color:var(--karton);font-weight:700;
  font-size:9px;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;}
.stufe.punkt{width:10px;height:10px;padding:0;margin-right:6px;vertical-align:-1px;}
.karton .eb{color:var(--tinte2);}
.karton .m{color:var(--tinte2);}
.karton .bar{background:rgba(20,23,26,.10);border-color:rgba(20,23,26,.24);}
.karton .zellen,.karton .zellen>div{border-color:rgba(20,23,26,.22);}
.karton .btn{background:transparent;border-color:rgba(20,23,26,.30);color:var(--tinte);}
.karton .btn:active{background:rgba(20,23,26,.07);}
/* Linierte Zeile wie auf einem echten Pass: Beschriftung links, Wert rechts,
   dazwischen eine durchgezogene Linie. */
/* Wenden. Drei getrennte Aufgaben auf drei Ebenen, damit sich nie zwei
   Vorschriften um „transform" streiten — dieselbe Regel wie bei der
   Kartenenthüllung: außen die Perspektive, innen die Drehung, darin die
   beiden Seiten. Beide Seiten liegen im selben Rasterfeld, dadurch nimmt
   der Pass immer die Höhe der längeren Seite an. */
/* ---- Umblättern ----------------------------------------------------------
   Die neue Seite dreht um ihre Bundkante herein, wie ein Blatt, das man
   umschlägt. BEWUSST nur die ankommende Seite: die abgehende mitzudrehen
   hiesse, ihren React-Baum nach dem Wechsel weiterleben zu lassen — mit
   veraltetem Zustand und doppelt laufenden Wirkungen. Der Gewinn wäre klein,
   das Risiko gross.
   Die Richtung folgt den Seitenzahlen: von Seite 2 auf 14 wird vorwärts
   geblättert, zurück andersherum. Dieselbe Technik wie beim Spielerpass
   (preserve-3d), die am 10.8. auf dem Gerät bestätigt wurde. */
/* ---- Umblättern: entfernt in 34.6 ---------------------------------------
   Der Versuch stand in 34.4/34.5 und ist wieder raus. Zwei Befunde vom Gerät,
   beide mit derselben Wurzel — es wurde die GANZE Seite gedreht:

   1. Es hakte, statt in einem Zug zu laufen. Eine Seite mit 162 Feldern ist
      mehrere tausend Punkte hoch; Chrome muss daraus für die Dauer der
      Bewegung eine eigene Ebene rastern. Das schafft es nicht in einem Zug.
   2. Auf langen Seiten verzerrte das ganze Bild. Das ist keine Panne, sondern
      Geometrie: perspective staucht mit wachsendem Abstand vom Drehpunkt.
      Bei einer Seite, die zehnmal so hoch ist wie das Fenster, wird das untere
      Ende unbrauchbar verzogen.

   WER ES SPÄTER NOCH EINMAL VERSUCHT, muss zuerst etwas anderes bauen: eine
   Seite, die genau so hoch ist wie das Fenster und INNEN rollt
   (height:100dvh und overflow-y:auto). Nur ein fensterhohes Blatt lässt sich
   wie ein Blatt drehen. Das ist ein Umbau jeder Ansicht — mit Folgen für die
   angeheftete Kopfleiste, für die Rollposition beim Zurückblättern und für die
   Wachsperre. Erst diesen Umbau, dann das Blättern; nicht umgekehrt.       */
.wender{perspective:1500px;}
.dreh{display:grid;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;
  transition:transform .6s cubic-bezier(.2,.85,.25,1);will-change:transform;}
.wender.um .dreh{transform:rotateY(180deg);}
.dreh>*{grid-area:1/1;backface-visibility:hidden;-webkit-backface-visibility:hidden;}
.dreh>.rueckseite{transform:rotateY(180deg);}
.rs-still .dreh{transition:none;will-change:auto;}
.passhinweis{font-weight:700;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--tinte2);opacity:.75;text-align:right;margin-top:9px;}
/* Inhaltsverzeichnis nach dem Vorbild einer Zeitschrift: Nummer, Titel,
   Punktlinie, Angabe rechts. Die Punktlinie füllt den Rest der Zeile. */
.inhalt{display:flex;align-items:baseline;gap:9px;width:100%;text-align:left;}
.inhalt .nr{font-weight:700;font-size:10px;letter-spacing:.10em;color:var(--mu);flex:0 0 auto;}
.inhalt .punkte{flex:1 1 auto;min-width:14px;border-bottom:1px dotted var(--ln2);
  transform:translateY(-4px);}
.inhalt .wert{flex:0 0 auto;font-variant-numeric:tabular-nums;color:var(--mu);font-size:11.5px;}
/* Zahnrad — unauffällig oben rechts, außerhalb des Leseflusses. */
.zahnrad{position:absolute;top:0;right:0;width:40px;height:40px;padding:0;min-height:0;
  display:flex;align-items:center;justify-content:center;background:transparent;
  border:1px solid var(--ln2);color:var(--mu);z-index:4;}
.zahnrad:active{background:var(--up);}
/* Impressumsstreifen am Fuß, wie die Zeile mit Strichcode und Preis auf einem Heft. */
.impressum{display:flex;align-items:center;gap:10px;border-top:2px solid var(--ln2);
  margin-top:26px;padding-top:9px;flex-wrap:wrap;}
.strichcode{flex:0 0 auto;height:22px;width:74px;
  background:repeating-linear-gradient(90deg,var(--mu) 0 1px,transparent 1px 3px,
    var(--mu) 3px 5px,transparent 5px 6px,var(--mu) 6px 7px,transparent 7px 10px);
  opacity:.55;}
.passzeile{display:flex;align-items:baseline;gap:8px;padding:4px 0;
  border-bottom:1px solid rgba(20,23,26,.16);}
.passzeile>span:first-child{flex:0 0 78px;}
.passzeile>span:last-child{margin-left:auto;text-align:right;font-weight:600;}
/* Klebewinkel an zwei Ecken. Wie der Streifen nur für Einzelstücke. */
.winkel::before,.winkel::after{content:"";position:absolute;width:0;height:0;
  pointer-events:none;z-index:2;}
.winkel::before{top:0;left:0;border-top:17px solid rgba(237,242,233,.16);
  border-right:17px solid transparent;}
.winkel::after{bottom:0;right:0;border-bottom:17px solid rgba(237,242,233,.16);
  border-left:17px solid transparent;}
.karton.winkel::before{border-top-color:rgba(20,23,26,.16);}
.karton.winkel::after{border-bottom-color:rgba(20,23,26,.16);}
/* Klebestreifen. Bewusst nur für Einzelstücke — an einem Raster aus 162
   Feldern würde die Geste zur Tapete. */
.streifen{position:absolute;top:-7px;left:50%;width:74px;height:15px;margin-left:-37px;
  transform:rotate(-1.6deg);pointer-events:none;z-index:2;
  /* Milchig und an den Enden auslaufend — vorher ein grauer Kasten mit
     schwarzen Strichen, die auf dunklem Grund unsichtbar waren. */
  background:linear-gradient(90deg,rgba(237,242,233,.02),rgba(237,242,233,.16) 22%,
    rgba(237,242,233,.16) 78%,rgba(237,242,233,.02));
  border-top:1px solid rgba(237,242,233,.13);border-bottom:1px solid rgba(0,0,0,.30);}
.stempel{display:inline-block;border:3px solid currentColor;padding:0 7px 1px;
  line-height:1.25;transform:rotate(-7deg);opacity:.85;white-space:nowrap;}
.folie{background:linear-gradient(115deg,#79E3D2,#B79BE8,#F2C878,#7FB6E8,#8FE0A8,#79E3D2);
  background-size:220% 100%;animation:rs-folie 6.5s linear infinite;}
.rs-still .folie{animation:none;}
.raster{background-image:radial-gradient(circle at center,currentColor 1.05px,transparent 1.4px);
  background-size:5px 5px;}
@keyframes rs-folie{0%{background-position:0% 50%}100%{background-position:200% 50%}}
.rs-blitz{position:relative;}
.rs-blitz::after{content:"";position:absolute;inset:-3px;pointer-events:none;
  animation:rs-blitz .9s ease-out both;}
.bar i{transition:transform 1.45s cubic-bezier(.18,.86,.28,1);transform-origin:left center;}
.rs-still .rs-auf,.rs-still .rs-rein{animation:none!important;}
.rs-still .bar i{transition:none!important;}
.rs-schleier{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;
  flex-direction:column;gap:14px;background:rgba(4,5,10,.72);backdrop-filter:blur(7px);
  -webkit-backdrop-filter:blur(7px);}
.rs-kreis{width:74px;height:74px;border-radius:50%;border:4px solid var(--ln2);
  border-top-color:var(--ac);border-right-color:var(--ac);animation:rs-dreh .85s linear infinite;}
.rs-still .rs-kreis{animation-duration:2.4s;}
.rs-band{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none;}
.rs-band>i{position:absolute;top:0;bottom:0;width:38%;display:block;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.22),transparent);
  animation:rs-schimmer 1.5s ease-in-out infinite;}
.main{display:grid;gap:12px;grid-template-columns:1fr;
  grid-template-areas:"pass" "buehne" "zustand";}
.a-pass{grid-area:pass;}.a-buehne{grid-area:buehne;}.a-zustand{grid-area:zustand;}
@media(min-width:860px){.main{grid-template-columns:288px 1fr;align-items:start;
  grid-template-areas:"pass buehne" "zustand buehne";}}
@media(min-width:1180px){.main{grid-template-columns:320px 1fr;}}
@media(orientation:landscape) and (max-height:520px){.tbar{position:static;}}
/* Reiterleiste. Man sah ihr nicht an, dass sie weitergeht — wer die Ränder
   nicht kannte, hat die hinteren Reiter nie gefunden. Drei Zeichen dagegen:
   1. eine Linie darunter, die die Leiste als Leiste lesbar macht,
   2. ein Verlauf am rechten Rand, der andeutet, dass etwas abgeschnitten ist,
   3. Einrasten beim Wischen, damit ein Reiter nie halb abgeschnitten steht.
   Der Verlauf hängt an der Hülle, nicht an der rollenden Leiste — sonst
   würde er mitwandern statt am Rand zu bleiben. */
.tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:7px;
  scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;}
.tabs>*{scroll-snap-align:start;flex-shrink:0;}
.tabs::-webkit-scrollbar{display:none;}
.tabhuelle{position:relative;}
.tabhuelle::after{content:"";position:absolute;right:0;top:0;bottom:7px;width:28px;
  pointer-events:none;background:linear-gradient(90deg,transparent,var(--bg));}
.tabhuelle::before{content:"";position:absolute;left:0;right:0;bottom:4px;height:1px;
  background:var(--ln2);opacity:.7;}
@media (prefers-reduced-motion:reduce){.fade{animation:none;}}
`;
/* Der Speicher der Ruhmeshalle steht nicht in jeder Umgebung bereit
   (etwa beim Aufruf über einen geteilten Link im Browser). */
const hasStore = () => {
  try { return !!(store && typeof store.get === "function" && typeof store.set === "function"); }
  catch (e) { return false; }
};
/* Die Schlüssel hängen bewusst nicht mehr am Spielnamen, damit Spielstand
   und Ruhmeshalle eine Umbenennung überleben. Ältere Stände werden einmalig
   übernommen.                                                              */
const SAVE_KEY = "rasenschach:stand";
const SEEN_KEY = "rasenschach:gesehen";
const ACH_KEY  = "rasenschach:erfolge";
/* ================= META-FORTSCHRITT =================
   Alles, was über einzelne Laufbahnen hinaus zählt: eine lebenslange
   Statistik, 100 Errungenschaften in fünf Stufen und die Belohnungen,
   die daraus freigeschaltet werden.                                    */
const LIFE_KEY = "rasenschach:gesamt";
const META_KEY = "rasenschach:meta";
const WC_KEY   = "rasenschach:karten";
const HSV_KEY  = "rasenschach:raute";      // Ausgleichszähler der Rautekarte

const leereBilanz = () => ({
  karrieren:0, saisons:0, apps:0, goals:0, assists:0, cs:0, titel:0, meister:0, pokale:0,
  intTitel:0, caps:0, ntTitel:0, punkte:0, bestPunkte:0, geld:0, bestGeld:0,
  laender:{}, ligen:{}, positionen:{}, vereine:{}, karten:{}, seltenheit:{},
  legenden:0, kapitaen:0, ntKapitaen:0, statuen:0, aufstiege:0, abstiege:0,
  frauen:0, maenner:0, wm:0, ruecktritte:0, sauber:0, skandale:0, verletzungen:0,
  top5Saisons:0, u21:0, reroll:0, treueMax:0, altMax:0, ovrMax:0, toreSaisonMax:0,
});

/* Eine beendete Laufbahn in die Gesamtbilanz einrechnen */
function bilanzErgaenzen(G, p) {
  const g = { ...leereBilanz(), ...(G || {}) };
  const zaehl = (obj, k) => { if (k) obj[k] = (obj[k] || 0) + 1; };
  g.karrieren += 1;
  g.saisons += p.seasons.length;
  g.apps += p.tot.apps || 0;
  g.goals += p.tot.goals || 0;
  g.assists += p.tot.assists || 0;
  g.cs += p.seasons.reduce((a, s) => a + (s.cs || 0), 0);
  g.titel += (p.trophies || []).length;
  g.meister += (p.trophies || []).filter((x) => /^Meister/.test(x)).length;
  g.pokale += (p.trophies || []).filter((x) => /Pokal|Cup|Copa|Coppa|Coupe|Beker/i.test(x)).length;
  g.intTitel += (p.trophies || []).filter((x) => /Champions League|Libertadores|Europa League|Sudamericana|Conference/i.test(x)).length;
  g.caps += p.nt.caps || 0;
  g.ntTitel += (p.nt.majors || []).filter((m) => !m.u && m.res === "Titel").length;
  g.wm += (p.nt.majors || []).filter((m) => m.turnier === "WM" && m.res === "Titel").length;
  const v = p.verdict || verdict(p);
  g.punkte += v.score; g.bestPunkte = Math.max(g.bestPunkte, v.score);
  const w = netWorth(p);
  g.geld += w; g.bestGeld = Math.max(g.bestGeld, w);
  p.seasons.forEach((s) => { zaehl(g.laender, s.land); zaehl(g.ligen, s.league); zaehl(g.vereine, s.club);
    if (TOP5.includes(s.league)) g.top5Saisons += 1; });
  zaehl(g.positionen, p.pos);
  if (p.wc) { zaehl(g.karten, p.wc.id); zaehl(g.seltenheit, p.wc.r); }
  if (p.flags.legende) g.legenden += 1;
  if (p.flags.kapitaen || p.flags.exkapitaen) g.kapitaen += 1;
  if (p.nt.kapitaen || p.flags.ntbindegefeiert) g.ntKapitaen += 1;
  if (p.flags.statue) g.statuen += 1;
  g.aufstiege += p.seasons.filter((s) => s.move && s.move.dir === "auf").length;
  g.abstiege += p.seasons.filter((s) => s.move && s.move.dir === "ab").length;
  g[p.g === "w" ? "frauen" : "maenner"] += 1;
  if (p.endReason && /Rücktritt/.test(p.endReason)) g.ruecktritte += 1;
  const dreckig = p.flags.wetten || p.flags.maulwurf || p.flags.altersluege || p.flags.steuermodell;
  if (dreckig) g.skandale += 1; else if (p.seasons.length >= 10) g.sauber += 1;
  g.verletzungen += p.seasons.filter((s) => s.injury).length;
  g.u21 += (p.nt.uCaps || 0) > 0 ? 1 : 0;
  if (p.wcRerolled) g.reroll += 1;
  g.treueMax = Math.max(g.treueMax, ...p.seasons.map((_, i, arr) => {
    let n = 0; const c = arr[i].club;
    for (let j = i; j < arr.length && arr[j].club === c; j++) n++;
    return n;
  }), 0);
  g.altMax = Math.max(g.altMax, p.age);
  g.ovrMax = Math.max(g.ovrMax, p.peakOvr);
  g.toreSaisonMax = Math.max(g.toreSaisonMax, ...p.seasons.map((s) => s.goals || 0), 0);
  return g;
}

/* Zwei Werte je Stufe: „col" für dunklen Grund, „colK" für Karton. Ohne den
   zweiten ist auf Papier nichts lesbar — Legendär erreicht dort Kontrast 1,04. */
const STUFEN = {
  bronze:  { n:"Bronze",     col:"#A5713C", colK:"#7A4E1F", w:1 },
  silber:  { n:"Silber",     col:"#9AA5B4", colK:"#4E5866", w:2 },
  gold:    { n:"Gold",       col:"#E8B84B", colK:"#7A5600", w:4 },
  platin:  { n:"Platin",     col:"#5E9BD8", colK:"#1B4F87", w:7 },
  legende: { n:"Legendär",   col:"#F3E7BE", colK:"#6B5A2A", w:12 },
};

/* ---- Belohnungen, die sich freischalten lassen ---- */
const META = {
  /* Neue Karten für den Wildcard-Stapel */
  mw_ausdauer:  { n:"Karte: Unermüdlich",       t:"Neue Wildcard im Stapel",             typ:"karte" },
  mw_ikone:     { n:"Karte: Stadionikone",      t:"Neue Wildcard im Stapel",             typ:"karte" },
  mw_pechlos:   { n:"Karte: Vom Glück verfolgt", t:"Neue Wildcard im Stapel",            typ:"karte" },
  mw_zwilling:  { n:"Karte: Zweitgeboren",      t:"Neue Wildcard im Stapel",             typ:"karte" },
  mw_lehrmeis:  { n:"Karte: Schule des Lebens", t:"Neue Wildcard im Stapel",             typ:"karte" },
  mw_phoenix:   { n:"Karte: Wiederauferstehung",t:"Neue Wildcard im Stapel",             typ:"karte" },
  mw_urgestein: { n:"Karte: Urgestein",         t:"Neue Wildcard im Stapel",             typ:"karte" },
  mw_erbe:      { n:"Karte: Das Erbe",          t:"Neue Wildcard im Stapel",             typ:"karte" },
  /* Bessere Chancen auf seltene Karten */
  mr_1: { n:"Glückssträhne I",   t:"Seltene Karten erscheinen etwas häufiger",  typ:"rar", wert:.12 },
  mr_2: { n:"Glückssträhne II",  t:"Seltene Karten erscheinen deutlich häufiger", typ:"rar", wert:.22 },
  mr_3: { n:"Glückssträhne III", t:"Beste Chancen auf die hohen Stufen",         typ:"rar", wert:.36 },
  /* Zusätzliche Startvorteile */
  ms_geld:   { n:"Startkapital",      t:"Jede Laufbahn beginnt mit etwas Geld",        typ:"start", wert:{ money:.12 }, sperrt:["w_sparbuch"] },
  ms_anlage: { n:"Früh gefördert",    t:"Etwas höhere Anlage zu Beginn",               typ:"start", wert:{ pot:2 }, sperrt:["w_frueh"] },
  ms_ruf:    { n:"Bekannter Name",    t:"Mehr Ansehen zum Start",                      typ:"start", wert:{ rep:8 }, sperrt:["w_liebling"] },
  ms_koerper:{ n:"Robuste Konstitution", t:"Geringere Verletzungsanfälligkeit",        typ:"start", wert:{ inj:-8 }, sperrt:["w_robust"] },
  ms_vertrag:{ n:"Guter Berater",     t:"Ein Jahr mehr Vertragslaufzeit zum Start",    typ:"start", wert:{ contract:1 }, sperrt:["w_wechselgeld"] },
  ms_talent: { n:"Ausnahmejahrgang",  t:"Deutlich höhere Anlage zu Beginn",            typ:"start", wert:{ pot:5 }, sperrt:["w_talent","w_frueh","w_akademie"] },
  /* Regeländerungen */
  mx_reroll: { n:"Zweiter Versuch",   t:"Die Wildcard darf zweimal getauscht werden",  typ:"regel" },
  mx_ntbonus:{ n:"Verbandskontakt",   t:"Der Weg ins Nationalteam ist etwas kürzer",   typ:"regel", sperrt:["w_intl"] },
  mx_offers: { n:"Volles Postfach",   t:"Ein zusätzliches Transferangebot je Fenster", typ:"regel", sperrt:["w_berater"] },
  mx_events: { n:"Bewegtes Leben",    t:"Ab und zu drei Ereignisse statt zwei",       typ:"regel" },
  /* Freigeschaltete Ereignisse */
  me_mentor:   { n:"Alte Bekannte",     t:"Drei Ereignisse rund um Weggefährten früherer Laufbahnen", typ:"ereignis" },
  me_netzwerk: { n:"Netzwerk",          t:"Drei Ereignisse, die Türen öffnen",                        typ:"ereignis" },
  me_ruf:      { n:"Der Ruf eilt voraus", t:"Drei Ereignisse, weil man deinen Namen kennt",           typ:"ereignis" },
  me_erbe:     { n:"Familienerbe",      t:"Drei Ereignisse über das, was bleibt",                     typ:"ereignis" },
  /* Zweiter Satz Belohnungen */
  mw_bollwerk:    { n:"Karte: Letzte Bastion",   t:"Neue Wildcard im Stapel",                    typ:"karte" },
  mw_kontinent:   { n:"Karte: Kontinentalheld",  t:"Neue Wildcard im Stapel",                    typ:"karte" },
  mw_kosmopolit:  { n:"Karte: Weltbürger",       t:"Neue Wildcard im Stapel",                    typ:"karte" },
  mw_auserwaehlt: { n:"Karte: Der Erwählte",  t:"Neue Wildcard im Stapel",                    typ:"karte" },
  mw_pionierin:   { n:"Karte: Wegbereiterin",    t:"Neue Wildcard im Stapel",                    typ:"karte" },
  mw_schattenmann:{ n:"Karte: Der Schattenmann", t:"Neue Wildcard im Stapel",                    typ:"karte" },
  mr_4:  { n:"Glückssträhne IV", t:"Die höchsten Stufen so oft wie nie",         typ:"rar", wert:.52 },
  ms_start2: { n:"Vorsprung",    t:"Deutlich mehr Anlage und Startkapital",      typ:"start", wert:{ pot:4, money:.3 } },
  mx_ueber99:{ n:"Über das Maximum", t:"Deine Werte dürfen die 99 überschreiten", typ:"regel" },
  mk_rahmen1:{ n:"Rahmen: Silber",  t:"Silberner Rand um dein Porträt",           typ:"kosmetik" },
  mk_rahmen2:{ n:"Rahmen: Bronze",  t:"Bronzener Rand um dein Porträt",           typ:"kosmetik" },
  mk_rahmen3:{ n:"Rahmen: Platin",  t:"Platinrand mit Schimmer",                  typ:"kosmetik" },
  mk_rahmen4:{ n:"Rahmen: Legende", t:"Ein Rand, den fast niemand sieht",         typ:"kosmetik" },
  mk_raute:  { n:"Rahmen: Raute",   t:"Schwarz-weiß-blauer Rand",                 typ:"kosmetik" },
  mk_bei4:   { n:"Beinamen IV",     t:"Fünf weitere Beinamen",                    typ:"kosmetik" },
  mk_bei5:   { n:"Beinamen V",      t:"Beinamen für Weitgereiste",                typ:"kosmetik" },
  mk_bei6:   { n:"Beinamen VI",     t:"Beinamen für Saubermänner",                typ:"kosmetik" },
  /* Aussehen und Auftreten */
  mk_haar:   { n:"Frisurenstudio",    t:"Mehr Frisuren im Porträt",                    typ:"kosmetik" },
  mk_acc:    { n:"Accessoires",       t:"Stirnband, Brille, Kette und mehr",           typ:"kosmetik" },
  mk_gold:   { n:"Goldener Rahmen",   t:"Dein Porträt bekommt einen goldenen Rand",    typ:"kosmetik" },
  mk_bei1:   { n:"Beinamen I",        t:"Vier Beinamen für den Spielerpass",           typ:"kosmetik" },
  mk_bei2:   { n:"Beinamen II",       t:"Sechs weitere Beinamen",                      typ:"kosmetik" },
  mk_bei3:   { n:"Beinamen III",      t:"Die seltensten Beinamen",                     typ:"kosmetik" },
};
const BEINAMEN = {
  mk_bei1: ["der Zuverlässige", "das Talent", "der Kämpfer", "der Stille"],
  mk_bei2: ["der Unbeugsame", "die Wand", "der Zauberer", "das Uhrwerk", "der Wanderer", "der Verlässliche"],
  mk_bei3: ["der Unsterbliche", "die Legende", "das Phänomen", "der Auserwählte"],
  mk_bei4: ["der Eiserne", "der Titan", "das Uhrwerk", "der Wolf", "die Bank"],
  mk_bei5: ["der Weltenbummler", "der Nomade", "der Kosmopolit", "der Wanderfalke"],
  mk_bei6: ["der Saubermann", "der Aufrechte", "der Ehrliche", "der Vorbildliche"],
};
/* Rahmen um das Porträt, freischaltbar */
const RAHMEN = {
  mk_raute:   { n:"Raute",   c:"#4E96E0", w:3 },
  mk_rahmen4: { n:"Legende", c:"#F3E7BE", w:3 },
  mk_rahmen3: { n:"Platin",  c:"#B9C4D4", w:3 },
  mk_gold:    { n:"Gold",    c:"#C7A24B", w:3 },
  mk_rahmen1: { n:"Silber",  c:"#9AA5B4", w:2 },
  mk_rahmen2: { n:"Bronze",  c:"#A5713C", w:2 },
};
/* Bis 34.7 nahm dies IMMER den ersten freigeschalteten Rahmen aus der Liste —
   eine Wahl gab es nicht, obwohl mehrere freigeschaltet sein können. Jetzt
   entscheidet `meta.rahmenWahl`; bleibt sie leer oder verweist auf etwas noch
   nicht Freigeschaltetes, gilt weiter der beste vorhandene. */
const rahmenOffen = (meta) => Object.keys(RAHMEN).filter((k) => meta && meta[k]);
const rahmenFuer = (meta) => {
  const offen = rahmenOffen(meta);
  if (!offen.length) return null;
  const w = meta && meta.rahmenWahl;
  if (w === "keiner") return null;
  if (w && offen.includes(w)) return RAHMEN[w];
  return RAHMEN[offen[0]];
};
/* ---- 100 Errungenschaften. p = beendete Laufbahn, G = Gesamtbilanz ---- */
const ACHIEVEMENTS = [
/* ============ JUGENDAKADEMIE (12) ============ */
{ id:"a_aka_grund", s:"bronze", n:"Das erste Tor auf",     t:"Eine Jugendakademie gründen",
  ok:(p,G,A)=>!!(A&&A.gegruendet) },
{ id:"a_aka_pro1",  s:"bronze", n:"Einer von uns",         t:"Der erste Absolvent wird Profi",
  ok:(p,G,A)=>!!A&&A.bilanz.profis>=1 },
{ id:"a_aka_bau3",  s:"silber", n:"Es wird gebaut",        t:"Eine Abteilung auf Stufe 3 bringen",
  ok:(p,G,A)=>!!A&&ABTEILUNGEN.some((x)=>akaStufe(A,x.id)>=3) },
{ id:"a_aka_pro10", s:"silber", n:"Eine ganze Elf",        t:"Elf Absolventen werden Profi",
  ok:(p,G,A)=>!!A&&A.bilanz.profis>=11 },
{ id:"a_aka_turn",  s:"silber", n:"Der erste Pokal",       t:"Ein Jugendturnier gewinnen",
  ok:(p,G,A)=>!!A&&A.bilanz.turniere>=1 },
{ id:"a_aka_welt1", s:"gold",   n:"Aus dem eigenen Haus",  t:"Ein Absolvent wird Weltklasse",
  ok:(p,G,A)=>!!A&&A.bilanz.weltklasse>=1 },
{ id:"a_aka_nat5",  s:"gold",   n:"Fünf für ihr Land",     t:"Fünf Absolventen werden Nationalspieler",
  ok:(p,G,A)=>!!A&&A.bilanz.nationalspieler>=5 },
{ id:"a_aka_pro25", s:"gold",   n:"Eine Adresse",          t:"25 Absolventen werden Profi",
  ok:(p,G,A)=>!!A&&A.bilanz.profis>=25 },
{ id:"a_aka_ruhm",  s:"platin", n:"Ein Name in der Szene", t:"Ansehen von 150 erreichen",
  ok:(p,G,A)=>!!A&&(A.ruhm||0)>=150 },
{ id:"a_aka_welt3", s:"platin", n:"Kein Zufall",           t:"Drei Absolventen werden Weltklasse",
  ok:(p,G,A)=>!!A&&A.bilanz.weltklasse>=3 },
{ id:"a_aka_voll",  s:"platin", n:"Alles ausgebaut",       t:"Alle sechs Abteilungen auf Stufe 6",
  ok:(p,G,A)=>!!A&&akaSumme(A)>=ABTEILUNGEN.length*AKA_MAX },
{ id:"a_aka_erbe",  s:"legende",n:"Ein Lebenswerk",        t:"Zehn Weltklassespieler und 25 Jahrgänge",
  ok:(p,G,A)=>!!A&&A.bilanz.weltklasse>=10&&A.jahrgaenge>=25 },

/* ============ BRONZE (28) ============ */
{ id:"a_debut",   s:"bronze", n:"Der erste Schritt",     t:"Ein Pflichtspiel bei den Profis",           ok:(p,G)=>G.apps>=1 },
{ id:"a_tor1",    s:"bronze", n:"Das erste Tor",         t:"Einen Treffer erzielen",                    ok:(p,G)=>G.goals>=1 },
{ id:"a_50",      s:"bronze", n:"Angekommen",            t:"50 Pflichtspiele in einer Laufbahn",        ok:(p)=>p.tot.apps>=50 },
{ id:"a_100",     s:"bronze", n:"Hundert Einsätze",      t:"100 Pflichtspiele in einer Laufbahn",       ok:(p)=>p.tot.apps>=100 },
{ id:"a_vorlage", s:"bronze", n:"Der Vorbereiter",       t:"25 Vorlagen in einer Laufbahn",             ok:(p)=>p.tot.assists>=25, lohn:"mk_bei1" },
{ id:"a_note",    s:"bronze", n:"Starke Saison",         t:"Eine Saison mit Note 2,5 oder besser",      ok:(p)=>p.seasons.some((s)=>s.note<=2.5) },
{ id:"a_kader",   s:"bronze", n:"Im Kader",              t:"Erstmals für ein Nationalteam nominiert",   ok:(p)=>p.nt.caps>0||(p.nt.uCaps||0)>0 },
{ id:"a_ujugend", s:"bronze", n:"Juniorennationalspieler", t:"Einsätze in einer U-Auswahl",             ok:(p)=>(p.nt.uCaps||0)>=5 },
{ id:"a_wechsel", s:"bronze", n:"Der erste Wechsel",     t:"Einmal den Verein wechseln",                ok:(p)=>new Set(p.seasons.map((s)=>s.club)).size>=2 },
{ id:"a_ausland", s:"bronze", n:"Ins Ausland",           t:"In einem anderen Land spielen",             ok:(p)=>p.seasons.some((s)=>s.land!==p.nation.id) },
{ id:"a_leihe",   s:"bronze", n:"Auf Leihbasis",         t:"Einmal verliehen werden",                   ok:(p)=>!!p.flags.warAufLeihe },
{ id:"a_aufst",   s:"bronze", n:"Nach oben",             t:"Mit einem Verein aufsteigen",               ok:(p,G)=>G.aufstiege>=1 },
{ id:"a_pokal1",  s:"bronze", n:"Erster Titel",          t:"Irgendeinen Titel gewinnen",                ok:(p,G)=>G.titel>=1 },
{ id:"a_geld1",   s:"bronze", n:"Erste Million",         t:"Eine Million Gesamtvermögen",               ok:(p)=>netWorth(p)>=1 },
{ id:"a_kauf",    s:"bronze", n:"Erster Besitz",         t:"Etwas kaufen",                              ok:(p)=>p.assets.length>=1 },
{ id:"a_wohnung", s:"bronze", n:"Eigene vier Wände",     t:"Eine Wohnung besitzen",                     ok:(p)=>p.assets.includes("wohnung") },
{ id:"a_beruf",   s:"bronze", n:"Plan B",                t:"Einen Abschluss machen",                    ok:(p)=>!!p.flags.abschluss },
{ id:"a_liebe",   s:"bronze", n:"Nicht allein",          t:"Eine feste Beziehung",                      ok:(p)=>["beziehung","verlobt","verheiratet"].includes(p.life.status) },
{ id:"a_kind",    s:"bronze", n:"Familienmensch",        t:"Ein Kind bekommen",                         ok:(p)=>p.life.kids>=1 },
{ id:"a_zehn",    s:"bronze", n:"Zehn Jahre dabei",      t:"Zehn Saisons spielen",                      ok:(p)=>p.seasons.length>=10 },
{ id:"a_karr2",   s:"bronze", n:"Nochmal von vorn",      t:"Zwei Laufbahnen abschließen",               ok:(p,G)=>G.karrieren>=2, lohn:"ms_geld" },
{ id:"a_karr5",   s:"bronze", n:"Wiederholungstäter",    t:"Fünf Laufbahnen abschließen",               ok:(p,G)=>G.karrieren>=5, lohn:"mk_haar" },
{ id:"a_frau",    s:"bronze", n:"Im Frauenfußball",      t:"Eine Laufbahn als Spielerin",               ok:(p,G)=>G.frauen>=1, lohn:"mw_ausdauer" },
{ id:"a_tw",      s:"bronze", n:"Zwischen den Pfosten",  t:"Eine Laufbahn als Torhüter",                ok:(p,G)=>(G.positionen.TW||0)>=1 },
{ id:"a_iv",      s:"bronze", n:"Aus der Tiefe",         t:"Eine Laufbahn als Innenverteidiger",        ok:(p,G)=>(G.positionen.IV||0)>=1 },
{ id:"a_st",      s:"bronze", n:"Vorne drin",            t:"Eine Laufbahn als Mittelstürmer",           ok:(p,G)=>(G.positionen.ST||0)>=1 },
{ id:"a_reroll",  s:"bronze", n:"Zweite Meinung",        t:"Die Wildcard einmal tauschen",              ok:(p)=>!!p.wcRerolled },
{ id:"a_top5",    s:"bronze", n:"Große Bühne",           t:"In einer der fünf Topligen spielen",        ok:(p,G)=>G.top5Saisons>=1 },

/* ============ SILBER (26) ============ */
{ id:"b_300",     s:"silber", n:"Dreihundert Spiele",    t:"300 Pflichtspiele in einer Laufbahn",       ok:(p)=>p.tot.apps>=300, lohn:"ms_koerper" },
{ id:"b_g100",    s:"silber", n:"Hundert Tore",          t:"100 Tore in einer Laufbahn",                ok:(p)=>p.tot.goals>=100 },
{ id:"b_meister", s:"silber", n:"Meister",               t:"Eine Meisterschaft gewinnen",               ok:(p,G)=>G.meister>=1, lohn:"mk_bei2" },
{ id:"b_pokal",   s:"silber", n:"Pokalsieger",           t:"Einen Landespokal gewinnen",                ok:(p,G)=>G.pokale>=1 },
{ id:"b_intl",    s:"silber", n:"International",         t:"Einen kontinentalen Wettbewerb spielen",    ok:(p)=>p.seasons.some((s)=>s.europe) },
{ id:"b_caps25",  s:"silber", n:"Stammspieler im Land",  t:"25 A-Länderspiele",                         ok:(p)=>p.nt.caps>=25 },
{ id:"b_turnier", s:"silber", n:"Turnierteilnehmer",     t:"Bei einem großen Turnier dabei sein",       ok:(p)=>p.nt.majors.some((m)=>!m.u) },
{ id:"b_kapitaen",s:"silber", n:"Spielführer",           t:"Kapitän eines Vereins werden",              ok:(p,G)=>G.kapitaen>=1, lohn:"ms_ruf" },
{ id:"b_treu5",   s:"silber", n:"Fünf Jahre ein Verein", t:"Fünf Saisons in Folge beim selben Klub",    ok:(p,G)=>G.treueMax>=5 },
{ id:"b_note2",   s:"silber", n:"Herausragend",          t:"Eine Saison mit Note 2,0 oder besser",      ok:(p)=>p.seasons.some((s)=>s.note<=2.0) },
{ id:"b_tore25",  s:"silber", n:"Torjäger",              t:"25 Tore in einer Saison",                   ok:(p,G)=>G.toreSaisonMax>=25 },
{ id:"b_zunull",  s:"silber", n:"Die Null steht",        t:"20 Spiele ohne Gegentor in einer Saison",   ok:(p)=>p.seasons.some((s)=>(s.cs||0)>=20) },
{ id:"b_drei",    s:"silber", n:"Drei Länder",           t:"In drei Ländern spielen",                   ok:(p)=>new Set(p.seasons.map((s)=>s.land)).size>=3 },
{ id:"b_geld10",  s:"silber", n:"Wohlhabend",            t:"Zehn Millionen Gesamtvermögen",             ok:(p)=>netWorth(p)>=10, lohn:"ms_vertrag" },
{ id:"b_haus",    s:"silber", n:"Ein richtiges Haus",    t:"Ein Haus besitzen",                         ok:(p)=>p.assets.includes("haus") },
{ id:"b_anlage",  s:"silber", n:"Anleger",               t:"In drei Anlageformen investieren",          ok:(p)=>Object.keys(p.depot||{}).length>=3 },
{ id:"b_hochzeit",s:"silber", n:"Verheiratet",           t:"Heiraten",                                  ok:(p)=>p.life.status==="verheiratet" },
{ id:"b_karr10",  s:"silber", n:"Zehn Laufbahnen",       t:"Zehn Karrieren abschließen",                ok:(p,G)=>G.karrieren>=10, lohn:"mr_1" },
{ id:"b_alle_pos",s:"silber", n:"Allrounder",            t:"Auf vier verschiedenen Positionen spielen", ok:(p,G)=>Object.keys(G.positionen).length>=4, lohn:"mk_acc" },
{ id:"b_gesamt1k",s:"silber", n:"Tausend Spiele",        t:"1.000 Pflichtspiele insgesamt",             ok:(p,G)=>G.apps>=1000, lohn:"me_netzwerk" },
{ id:"b_gesamt_t",s:"silber", n:"Zweihundert Tore",      t:"200 Tore insgesamt",                        ok:(p,G)=>G.goals>=200 },
{ id:"b_ttitel5", s:"silber", n:"Titelsammler",          t:"Fünf Titel insgesamt",                      ok:(p,G)=>G.titel>=5, lohn:"me_ruf" },
{ id:"b_sauber",  s:"silber", n:"Ohne Fehl und Tadel",   t:"Eine lange Laufbahn ohne jeden Skandal",    ok:(p,G)=>G.sauber>=1 },
{ id:"b_akademie",s:"silber", n:"Etwas hinterlassen",    t:"Eine eigene Fußballakademie",               ok:(p)=>p.assets.includes("akademie") },
{ id:"b_selten",  s:"silber", n:"Seltene Karte",         t:"Eine Karte der Stufe Außergewöhnlich",      ok:(p,G)=>(G.seltenheit.aussen||0)>=1 },
{ id:"b_alt36",   s:"silber", n:"Der Routinier",         t:"Bis 36 spielen",                            ok:(p,G)=>G.altMax>=36 },

/* ============ GOLD (22) ============ */
{ id:"c_600",     s:"gold", n:"Sechshundert Spiele",     t:"600 Pflichtspiele in einer Laufbahn",       ok:(p)=>p.tot.apps>=600, lohn:"mw_urgestein" },
{ id:"c_g250",    s:"gold", n:"Zweihundertfünfzig Tore", t:"250 Tore in einer Laufbahn",                ok:(p)=>p.tot.goals>=250 },
{ id:"c_meister3",s:"gold", n:"Serienmeister",           t:"Drei Meisterschaften in einer Laufbahn",    ok:(p)=>p.trophies.filter((x)=>/^Meister/.test(x)).length>=3 },
{ id:"c_cl",      s:"gold", n:"Königsklasse",            t:"Champions League oder Libertadores gewinnen", ok:(p,G)=>G.intTitel>=1, lohn:"mr_2" },
{ id:"c_caps75",  s:"gold", n:"Rekordnationalspieler",   t:"75 A-Länderspiele",                         ok:(p)=>p.nt.caps>=75 },
{ id:"c_ntTitel", s:"gold", n:"Kontinentalmeister",      t:"EM oder kontinentalen Titel gewinnen",      ok:(p,G)=>G.ntTitel>=1, lohn:"ms_anlage" },
{ id:"c_legende", s:"gold", n:"Vereinslegende",          t:"Zehn Jahre bei einem Verein",               ok:(p,G)=>G.legenden>=1, lohn:"mw_ikone" },
{ id:"c_ntkap",   s:"gold", n:"Kapitän des Landes",      t:"Die Nationalmannschaft anführen",           ok:(p,G)=>G.ntKapitaen>=1 },
{ id:"c_note15",  s:"gold", n:"Fast perfekt",            t:"Eine Saison mit Note 1,7 oder besser",      ok:(p)=>p.seasons.some((s)=>s.note<=1.7) },
{ id:"c_double",  s:"gold", n:"Das Double",              t:"Meisterschaft und Pokal in einer Saison",   ok:(p)=>p.seasons.some((s)=>s.trophies.some((x)=>/^Meister/.test(x))&&s.trophies.some((x)=>/Pokal|Cup|Copa|Coppa|Coupe/i.test(x))) },
{ id:"c_fuenf",   s:"gold", n:"Weltenbummler",           t:"In fünf Ländern spielen",                   ok:(p)=>new Set(p.seasons.map((s)=>s.land)).size>=5, lohn:"mx_offers" },
{ id:"c_geld50",  s:"gold", n:"Vermögend",               t:"Fünfzig Millionen Gesamtvermögen",          ok:(p)=>netWorth(p)>=50 },
{ id:"c_villa",   s:"gold", n:"Die Villa",               t:"Eine Villa besitzen",                       ok:(p)=>p.assets.includes("villa") },
{ id:"c_statue",  s:"gold", n:"In Bronze",               t:"Eine Statue vor dem Stadion",               ok:(p,G)=>G.statuen>=1, lohn:"mk_gold" },
{ id:"c_punkte700",s:"gold",n:"Große Laufbahn",          t:"700 Vermächtnispunkte erreichen",           ok:(p,G)=>G.bestPunkte>=700 },
{ id:"c_karr20",  s:"gold", n:"Zwanzig Laufbahnen",      t:"Zwanzig Karrieren abschließen",             ok:(p,G)=>G.karrieren>=20, lohn:"mx_events" },
{ id:"c_gesamt3k",s:"gold", n:"Dreitausend Spiele",      t:"3.000 Pflichtspiele insgesamt",             ok:(p,G)=>G.apps>=3000, lohn:"me_mentor" },
{ id:"c_ttitel20",s:"gold", n:"Titelsammlung",           t:"Zwanzig Titel insgesamt",                   ok:(p,G)=>G.titel>=20, lohn:"mw_erbe" },
{ id:"c_alle_pos8",s:"gold",n:"Jede Position",           t:"Auf allen acht Positionen gespielt",        ok:(p,G)=>Object.keys(G.positionen).length>=8, lohn:"mw_zwilling" },
{ id:"c_unfass",  s:"gold", n:"Unfassbare Karte",        t:"Eine Karte der Stufe Unfassbar ziehen",     ok:(p,G)=>(G.seltenheit.unfass||0)>=1 },
{ id:"c_beide",   s:"gold", n:"Beide Welten",            t:"Je fünf Laufbahnen als Mann und als Frau",  ok:(p,G)=>G.frauen>=5&&G.maenner>=5, lohn:"mk_bei3" },
{ id:"c_kontinente",s:"gold",n:"Vier Konföderationen",   t:"In vier Konföderationen gespielt",          ok:(p,G)=>new Set(Object.keys(G.laender).map((c)=>confOf(c)).filter(Boolean)).size>=4 },

/* ============ PLATIN (14) ============ */
{ id:"d_1000",    s:"platin", n:"Tausend Spiele",        t:"1.000 Pflichtspiele in einer Laufbahn",     ok:(p)=>p.tot.apps>=1000 },
{ id:"d_g400",    s:"platin", n:"Vierhundert Tore",      t:"400 Tore in einer Laufbahn",                ok:(p)=>p.tot.goals>=400, lohn:"mr_3" },
{ id:"d_wm",      s:"platin", n:"Weltmeister",           t:"Eine Weltmeisterschaft gewinnen",           ok:(p,G)=>G.wm>=1, lohn:"mw_lehrmeis" },
{ id:"d_treble",  s:"platin", n:"Das Triple",            t:"Meister, Pokal und Königsklasse in einer Saison",
  ok:(p)=>p.seasons.some((s)=>s.trophies.some((x)=>/^Meister/.test(x))&&s.trophies.some((x)=>/Pokal|Cup|Copa|Coppa|Coupe/i.test(x))&&s.trophies.some((x)=>/Champions League|Libertadores/i.test(x))) },
{ id:"d_caps120", s:"platin", n:"Hundertzwanzig Mal",    t:"120 A-Länderspiele",                        ok:(p)=>p.nt.caps>=120 },
{ id:"d_meister7",s:"platin", n:"Eine Ära",              t:"Sieben Meisterschaften in einer Laufbahn",  ok:(p)=>p.trophies.filter((x)=>/^Meister/.test(x)).length>=7 },
{ id:"d_punkte900",s:"platin",n:"Unsterblich",           t:"900 Vermächtnispunkte erreichen",           ok:(p,G)=>G.bestPunkte>=900, lohn:"mw_phoenix" },
{ id:"d_geld200", s:"platin", n:"Zweihundert Millionen", t:"200 Millionen Gesamtvermögen",              ok:(p)=>netWorth(p)>=200 },
{ id:"d_treu15",  s:"platin", n:"Ein Verein, ein Leben", t:"Fünfzehn Jahre bei einem einzigen Verein",  ok:(p,G)=>G.treueMax>=15, lohn:"ms_talent" },
{ id:"d_karr50",  s:"platin", n:"Fünfzig Laufbahnen",    t:"Fünfzig Karrieren abschließen",             ok:(p,G)=>G.karrieren>=50, lohn:"mx_reroll" },
{ id:"d_gesamt10k",s:"platin",n:"Zehntausend Spiele",    t:"10.000 Pflichtspiele insgesamt",            ok:(p,G)=>G.apps>=10000 },
{ id:"d_ttitel60",s:"platin", n:"Vitrine voll",          t:"Sechzig Titel insgesamt",                   ok:(p,G)=>G.titel>=60, lohn:"me_erbe" },
{ id:"d_welt",    s:"platin", n:"Weltmeisterliche Karte",t:"Eine Karte der Stufe Weltmeisterlich",      ok:(p,G)=>(G.seltenheit.welt||0)>=1 },
{ id:"d_alle_konf",s:"platin",n:"Alle sechs Verbände",   t:"In allen sechs Konföderationen gespielt",   ok:(p,G)=>new Set(Object.keys(G.laender).map((c)=>confOf(c)).filter(Boolean)).size>=6, lohn:"mx_ntbonus" },

/* ============ LEGENDÄR (10) ============ */
{ id:"e_goat",    s:"legende", n:"Die GOAT-Karte",       t:"Eine Karte der höchsten Stufe ziehen",      ok:(p,G)=>(G.seltenheit.goat||0)>=1, lohn:"mw_pechlos" },
{ id:"e_goat3",   s:"legende", n:"Dreimal auserwählt",   t:"Drei GOAT-Karten über alle Laufbahnen",     ok:(p,G)=>(G.seltenheit.goat||0)>=3 },
{ id:"e_derGOAT", s:"legende", n:"Der Größte aller Zeiten",
  t:"1.000 Punkte, Weltmeister, Königsklasse und Vereinslegende in einer Laufbahn",
  ok:(p,G)=>{ const v=p.verdict||verdict(p);
    return v.score>=1000 && p.nt.majors.some((m)=>m.turnier==="WM"&&m.res==="Titel")
      && p.trophies.some((x)=>/Champions League|Libertadores/i.test(x)) && !!p.flags.legende; } },
{ id:"e_perfekt", s:"legende", n:"Makellos",             t:"Eine Saison mit Note 1,3 oder besser",      ok:(p)=>p.seasons.some((s)=>s.note<=1.3) },
{ id:"e_treuGoat",s:"legende", n:"Nur ein Wappen",       t:"Zwanzig Saisons beim selben Verein",        ok:(p,G)=>G.treueMax>=20 },
{ id:"e_alleKarten",s:"legende",n:"Der ganze Stapel",    t:"Fünfzig verschiedene Wildcards erlebt",     ok:(p,G)=>Object.keys(G.karten).length>=50 },
{ id:"e_1000tore",s:"legende", n:"Tausend Tore",         t:"1.000 Tore über alle Laufbahnen",           ok:(p,G)=>G.goals>=1000 },
{ id:"e_karr100", s:"legende", n:"Hundert Leben",        t:"Hundert Karrieren abschließen",             ok:(p,G)=>G.karrieren>=100 },
{ id:"e_tw_goat", s:"legende", n:"Der unbezwingbare Kasten", t:"Als Torhüter 250 Spiele ohne Gegentor", ok:(p)=>p.pos==="TW"&&p.seasons.reduce((a,s)=>a+(s.cs||0),0)>=250 },
{ id:"e_alles",   s:"legende", n:"Alles gewonnen",       t:"Meister, Pokal, Königsklasse, WM und EM in einer Laufbahn",
  ok:(p)=>p.trophies.some((x)=>/^Meister/.test(x))&&p.trophies.some((x)=>/Pokal|Cup|Copa|Coppa|Coupe/i.test(x))
    &&p.trophies.some((x)=>/Champions League|Libertadores/i.test(x))
    &&p.nt.majors.some((m)=>m.turnier==="WM"&&m.res==="Titel")
    &&p.nt.majors.some((m)=>!m.u&&m.turnier!=="WM"&&m.res==="Titel") },
/* ---- Zweiter Satz: Fleißarbeit, Ausdauer und die ganz harten Brocken ---- */
{ id:"f_apps2k",  s:"silber", n:"Zweitausend Spiele",     t:"2.000 Pflichtspiele insgesamt",            ok:(p,G)=>G.apps>=2000 },
{ id:"f_apps5k",  s:"gold",   n:"Fünftausend Spiele",     t:"5.000 Pflichtspiele insgesamt",            ok:(p,G)=>G.apps>=5000, lohn:"mk_rahmen1" },
{ id:"f_apps20k", s:"legende",n:"Zwanzigtausend Spiele",  t:"20.000 Pflichtspiele insgesamt",           ok:(p,G)=>G.apps>=20000, lohn:"mx_ueber99" },
{ id:"f_tore500", s:"gold",   n:"Fünfhundert Tore",       t:"500 Tore insgesamt",                       ok:(p,G)=>G.goals>=500 },
{ id:"f_tore2500",s:"legende",n:"Zweieinhalbtausend Tore",t:"2.500 Tore insgesamt",                     ok:(p,G)=>G.goals>=2500 },
{ id:"f_vorl500", s:"gold",   n:"Fünfhundert Vorlagen",   t:"500 Vorlagen insgesamt",                   ok:(p,G)=>G.assists>=500 },
{ id:"f_cs500",   s:"gold",   n:"Fünfhundert weiße Westen",t:"500 Spiele ohne Gegentor insgesamt",      ok:(p,G)=>G.cs>=500, lohn:"mw_bollwerk" },
{ id:"f_caps500", s:"gold",   n:"Fünfhundert Länderspiele",t:"500 A-Länderspiele insgesamt",            ok:(p,G)=>G.caps>=500 },
{ id:"f_caps1500",s:"platin", n:"Anderthalbtausend Kappen",t:"1.500 A-Länderspiele insgesamt",          ok:(p,G)=>G.caps>=1500 },
{ id:"f_titel40", s:"gold",   n:"Vierzig Titel",          t:"40 Titel insgesamt",                       ok:(p,G)=>G.titel>=40 },
{ id:"f_titel150",s:"legende",n:"Hundertfünfzig Titel",   t:"150 Titel insgesamt",                      ok:(p,G)=>G.titel>=150, lohn:"mk_rahmen3" },
{ id:"f_meister25",s:"platin",n:"Fünfundzwanzig Meisterschaften", t:"25 Meistertitel insgesamt",        ok:(p,G)=>G.meister>=25 },
{ id:"f_int15",   s:"platin", n:"Fünfzehn Europapokale",  t:"15 internationale Titel insgesamt",        ok:(p,G)=>G.intTitel>=15, lohn:"mw_kontinent" },
{ id:"f_wm5",     s:"legende",n:"Fünf Weltmeistertitel",  t:"Fünfmal Weltmeister über alle Laufbahnen", ok:(p,G)=>G.wm>=5 },
{ id:"f_karr30",  s:"gold",   n:"Dreißig Laufbahnen",     t:"30 Karrieren abschließen",                 ok:(p,G)=>G.karrieren>=30, lohn:"mk_bei4" },
{ id:"f_karr75",  s:"platin", n:"Fünfundsiebzig Laufbahnen", t:"75 Karrieren abschließen",              ok:(p,G)=>G.karrieren>=75, lohn:"ms_start2" },
{ id:"f_karr250", s:"legende",n:"Zweihundertfünfzig Leben", t:"250 Karrieren abschließen",              ok:(p,G)=>G.karrieren>=250, lohn:"mk_rahmen4" },
{ id:"f_saisons300",s:"gold", n:"Dreihundert Saisons",    t:"300 Saisons insgesamt gespielt",           ok:(p,G)=>G.saisons>=300 },
{ id:"f_saisons1k",s:"platin",n:"Tausend Saisons",        t:"1.000 Saisons insgesamt gespielt",         ok:(p,G)=>G.saisons>=1000 },
{ id:"f_laender15",s:"gold",  n:"Fünfzehn Länder",        t:"In 15 verschiedenen Ländern gespielt",     ok:(p,G)=>Object.keys(G.laender).length>=15, lohn:"mw_kosmopolit" },
{ id:"f_laender40",s:"platin",n:"Vierzig Länder",         t:"In 40 verschiedenen Ländern gespielt",     ok:(p,G)=>Object.keys(G.laender).length>=40 },
{ id:"f_ligen30", s:"gold",   n:"Dreißig Ligen",          t:"In 30 verschiedenen Ligen gespielt",       ok:(p,G)=>Object.keys(G.ligen).length>=30 },
{ id:"f_vereine50",s:"platin",n:"Fünfzig Vereine",        t:"Für 50 verschiedene Vereine gespielt",     ok:(p,G)=>Object.keys(G.vereine).length>=50, lohn:"mk_bei5" },
{ id:"f_karten80",s:"platin", n:"Achtzig Karten",         t:"80 verschiedene Wildcards erlebt",         ok:(p,G)=>Object.keys(G.karten).length>=80 },
{ id:"f_kartenAlle",s:"legende",n:"Der vollständige Stapel", t:"Hundert verschiedene Wildcards erlebt", ok:(p,G)=>Object.keys(G.karten).length>=100, lohn:"mr_4" },
{ id:"f_goat10",  s:"legende",n:"Zehnmal auserwählt",     t:"Zehn GOAT-Karten über alle Laufbahnen",    ok:(p,G)=>(G.seltenheit.goat||0)>=10 },
{ id:"f_welt10",  s:"platin", n:"Zehnmal weltmeisterlich",t:"Zehn Karten der Stufe Weltmeisterlich",    ok:(p,G)=>(G.seltenheit.welt||0)>=10, lohn:"mw_auserwaehlt" },
{ id:"f_hsv",     s:"legende",n:"Nur der HSV",            t:"Die Rautekarte ziehen",                    ok:(p)=>!!p.flags.nurderhsv, lohn:"mk_raute" },
{ id:"f_legenden10",s:"platin",n:"Zehn Vereinslegenden",  t:"Zehnmal Vereinslegende geworden",          ok:(p,G)=>G.legenden>=10 },
{ id:"f_kapitaen25",s:"gold", n:"Fünfundzwanzig Mal Kapitän", t:"25 Laufbahnen als Spielführer",        ok:(p,G)=>G.kapitaen>=25 },
{ id:"f_statuen5",s:"platin", n:"Fünf Statuen",           t:"Fünfmal ein Denkmal bekommen",             ok:(p,G)=>G.statuen>=5, lohn:"mk_rahmen2" },
{ id:"f_geld1000",s:"platin", n:"Eine Milliarde",         t:"1.000 Millionen insgesamt verdient",       ok:(p,G)=>G.geld>=1000 },
{ id:"f_punkte20k",s:"platin",n:"Zwanzigtausend Punkte",  t:"20.000 Vermächtnispunkte insgesamt",       ok:(p,G)=>G.punkte>=20000 },
{ id:"f_punkte100k",s:"legende",n:"Hunderttausend Punkte",t:"100.000 Vermächtnispunkte insgesamt",      ok:(p,G)=>G.punkte>=100000 },
{ id:"f_aufstiege20",s:"gold",n:"Zwanzig Aufstiege",      t:"20 Aufstiege insgesamt",                   ok:(p,G)=>G.aufstiege>=20 },
{ id:"f_frauen25",s:"gold",   n:"Fünfundzwanzig Spielerinnen", t:"25 Laufbahnen im Frauenfußball",      ok:(p,G)=>G.frauen>=25, lohn:"mw_pionierin" },
{ id:"f_ruecktritt10",s:"silber",n:"Zehnmal aufgehört",   t:"Zehnmal freiwillig zurückgetreten",        ok:(p,G)=>G.ruecktritte>=10 },
{ id:"f_top5_100",s:"gold",   n:"Hundert Topliga-Saisons",t:"100 Saisons in den fünf Topligen",         ok:(p,G)=>G.top5Saisons>=100 },
{ id:"f_ovr95",   s:"platin", n:"Fünfundneunzig",         t:"Eine Gesamtstärke von 95 erreichen",       ok:(p,G)=>G.ovrMax>=95 },
{ id:"f_ovr99",   s:"legende",n:"Das Maximum",            t:"Eine Gesamtstärke von 99 erreichen",       ok:(p,G)=>G.ovrMax>=99, lohn:"mx_ueber99" },
{ id:"f_tore60",  s:"platin", n:"Sechzig Tore in einer Saison", t:"60 Tore in einer einzigen Spielzeit", ok:(p,G)=>G.toreSaisonMax>=60 },
{ id:"f_alt42",   s:"platin", n:"Mit zweiundvierzig",     t:"Bis 42 weiterspielen",                     ok:(p,G)=>G.altMax>=42 },
{ id:"f_sauber10",s:"gold",   n:"Zehnmal makellos",       t:"Zehn lange Laufbahnen ohne jeden Skandal", ok:(p,G)=>G.sauber>=10, lohn:"mk_bei6" },
{ id:"f_skandal5",s:"silber", n:"Der zwielichtige Weg",   t:"Fünf Laufbahnen mit Skandal",              ok:(p,G)=>G.skandale>=5, lohn:"mw_schattenmann" },
{ id:"f_ntkap10", s:"platin", n:"Zehnmal Landeskapitän",  t:"Zehnmal die Nationalelf angeführt",        ok:(p,G)=>G.ntKapitaen>=10 },
{ id:"f_alleStufen",s:"platin",n:"Jede Stufe erlebt",     t:"Karten aller sechs Seltenheitsstufen",     ok:(p,G)=>["normal","selten","aussen","unfass","welt","goat"].every((r)=>(G.seltenheit[r]||0)>=1) },
{ id:"f_alleKonf5",s:"gold",  n:"Rund um den Globus",     t:"In allen sechs Verbänden je fünf Saisons",
  ok:(p,G)=>{ const z={}; Object.keys(G.laender).forEach((c)=>{ const k=confOf(c); if(k) z[k]=(z[k]||0)+G.laender[c]; });
    return Object.keys(z).length>=6 && Object.values(z).every((v)=>v>=5); } },
{ id:"f_verletzt50",s:"gold", n:"Der Dauerpatient",       t:"50 Verletzungen über alle Laufbahnen",     ok:(p,G)=>G.verletzungen>=50 },
{ id:"f_reroll25",s:"silber", n:"Immer zweiter Versuch",  t:"25-mal die Wildcard getauscht",            ok:(p,G)=>G.reroll>=25 },
{ id:"f_treu25",  s:"legende",n:"Ein Vierteljahrhundert", t:"25 Saisons bei einem einzigen Verein",     ok:(p,G)=>G.treueMax>=25 },
];

const ALT_KEYS = {
  [SAVE_KEY]: ["mittelkreis:stand", "rasenschach-goat:stand", "rasenschach3:stand", "rasenschach2:stand"],
  [SEEN_KEY]: ["mittelkreis:gesehen"],
  ["rasenschach:halle"]: ["mittelkreis:halle", "rasenschach-goat:halle", "rasenschach3:halle", "rasenschach2:halle"],
};
/* Liest einen Schlüssel und greift auf frühere Fassungen zurück, falls leer */
async function ladeMitAltbestand(key) {
  try { const r = await store.get(key); if (r && r.value) return r.value; } catch (e) {}
  for (const alt of (ALT_KEYS[key] || [])) {
    try {
      const r = await store.get(alt);
      if (r && r.value) { try { await store.set(key, r.value); } catch (e2) {} return r.value; }
    } catch (e) {}
  }
  return null;
}
const HALL_KEY = "rasenschach:halle";
/* Alles, was die App dauerhaft ablegt — einzige Wahrheit für „Alles
   zurücksetzen". Wer einen neuen Schlüssel einführt, trägt ihn hier ein. */
const SPEICHERSCHLUESSEL = [SAVE_KEY, SEEN_KEY, ACH_KEY, LIFE_KEY, META_KEY, HALL_KEY, AKA_KEY,
  "rasenschach:ruhe", "rasenschach:vib", "rasenschach:text",
  "rasenschach:speed", "rasenschach:schwer", "rasenschach:wach"];
/* Schulnoten laufen von 1 bis 6 — die Farbe soll das auch tun. Vorher:
   Gold, Grün, Grau, Braun, Rot ohne erkennbare Ordnung. */
const noteCol = (n) => (n <= 2 ? "#3DA35D" : n <= 2.7 ? "#7FBF6A" : n <= 3.5 ? "#B9C4BE" : n <= 4.2 ? "#F2C230" : "#E5493C");
const sgn = (v) => (v > 0 ? "+" : "");

/* Schutzhülle um die gesamte App. Ohne sie hängt React bei einem Fehler den
   kompletten Baum aus und der Bildschirm bleibt weiß. Bewusst nur mit
   Inline-Gestaltung, damit die Meldung auch dann erscheint, wenn der
   Gestaltungsblock selbst nicht geladen wurde.                        */
class AppGuard extends React.Component {
  constructor(pr) { super(pr); this.state = { err: null, info: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { this.setState({ info }); try { console.error(err); } catch (e) {} }
  render() {
    if (!this.state.err) return this.props.children;
    const e = this.state.err;
    const msg = (e && (e.message || String(e))) || "Unbekannter Fehler";
    const st = ((this.state.info && this.state.info.componentStack) || (e && e.stack) || "").split("\n").slice(0, 6).join("\n");
    const box = { background: "#04050A", color: "#DCE3D8", minHeight: "100vh", padding: "22px 16px",
      fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 14, lineHeight: 1.5 };
    const btn = { background: "#5E9BD8", color: "#04050A", border: 0, borderRadius: 0, padding: "12px 16px",
      fontSize: 14, fontWeight: 600, marginRight: 8, marginTop: 14, minHeight: 44, cursor: "pointer" };
    return (
      <div style={box}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".01em" }}>Da hat was nicht geklappt</div>
        <p style={{ color: "#909C96", marginTop: 8 }}>
          Das Spiel konnte diese Ansicht nicht aufbauen. Unten steht die technische Meldung —
          ein Bildschirmfoto davon reicht, um den Fehler zu finden.
        </p>
        <pre style={{ background: "#0D1018", border: "1px solid #232838", borderRadius: 0, padding: 11,
          marginTop: 12, fontSize: 11.5, whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#C4A46A" }}>
{msg}{st ? "\n\n" + st : ""}
        </pre>
        <div>
          <button style={btn} onClick={() => this.setState({ err: null, info: null })}>Nochmal versuchen</button>
          <button style={{ ...btn, background: "#232838", color: "#DCE3D8" }}
            onClick={() => { try { window.location.reload(); } catch (x) { this.setState({ err: null, info: null }); } }}>Neu laden</button>
        </div>
      </div>
    );
  }
}

/* Fängt Fehler einzelner Ansichten ab, damit nie die ganze App weiß wird */
class Guard extends React.Component {
  constructor(pr) { super(pr); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="pan pad" style={{ borderLeft: "3px solid var(--bad)" }}>
        <div className="d" style={{ fontSize: 16, color: "var(--bad)" }}>Hier ist was schiefgegangen</div>
        <p style={{ fontSize: 12, color: "var(--mu)", marginTop: 5 }}>
          Der Rest läuft normal weiter — dein Spielstand ist nicht betroffen. Klick auf Nochmal versuchen
          oder wechsel kurz den Reiter.
        </p>
        <button className="btn sm" style={{ marginTop: 9 }} onClick={() => this.setState({ err: null })}>Nochmal versuchen</button>
      </div>
    );
  }
}

/* Die Ressorts des Hefts. Die Seitenzahl steht NUR hier: Kolumnentitel oben,
   Folio unten und das Inhaltsverzeichnis auf dem Titelblatt müssen dasselbe
   sagen, sonst ist das Heft nicht mehr glaubwürdig. */
const RESSORT = {
  laufbahn:  { n: "LAUFBAHN",         s: 2,  f: "var(--go)" },
  anlegen:   { n: "SPIELERPASS",      s: 3,  f: "var(--stoerer)" },
  hall:      { n: "RUHMESHALLE",      s: 14, f: "var(--ac)" },
  erfolge:   { n: "ERRUNGENSCHAFTEN", s: 22, f: "var(--ok)" },
  akademie:  { n: "JUGENDAKADEMIE",   s: 30, f: "var(--mu)" },
  optionen:  { n: "REDAKTION",        s: 46, f: "var(--mu)" },
  archiv:    { n: "ARCHIV",           s: 48, f: "var(--mu)" },
  laden:     { n: "ANZEIGEN",         s: 8,  f: "var(--go)" },
};

/* Seitenkopf. „Jede Seite hat einen Namen, damit sich der Leser zurechtfindet" —
   das ist der Kolumnentitel. Darunter die doppelte Haarlinie, wie im Satz üblich. */
function Kolumnentitel({ r, zusatz }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <span className="d" style={{ fontSize: 15, letterSpacing: ".09em", borderLeft: "3px solid " + r.f,
          paddingLeft: 8 }}>{r.n}{zusatz ? " · " + zusatz : ""}</span>
        <span className="eb" style={{ whiteSpace: "nowrap" }}>Seite {r.s}</span>
      </div>
      <div style={{ height: 2, background: "var(--ln2)", marginTop: 7 }} />
      <div style={{ height: 1, background: "var(--ln2)", marginTop: 3, opacity: .6 }} />
    </div>
  );
}

/* Folio: Seitenzahl außen, Publikationsname innen. */
function Folio({ r }) {
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ height: 1, background: "var(--ln2)" }} />
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
        <span className="d" style={{ fontSize: 20 }}>{r.s}</span>
        <span className="eb" style={{ textAlign: "right" }}>
          Rasenschach XI · {r.n}<br />
          <span style={{ letterSpacing: ".06em", textTransform: "none" }}>Nachtausgabe</span>
        </span>
      </div>
    </div>
  );
}

function Shell({ children, wide, blatt, zusatz }) {
  const r = blatt ? RESSORT[blatt] : null;
  return (
    <div className="fl">
      <style>{CSS}</style>
      <div style={{ margin: "0 auto", maxWidth: wide ? 1120 : 860, padding: "14px 12px 40px" }}>
        {r && <Kolumnentitel r={r} zusatz={zusatz} />}
        {children}
        {r && <Folio r={r} />}
      </div>
    </div>
  );
}
function Stat({ k, v, acc, sub }) {
  return (
    <div className="pan" style={{ padding: "8px 10px" }}>
      <div className="eb">{k}</div>
      <div className="d" style={{ fontSize: 21, marginTop: 2, color: acc ? "var(--ac)" : "var(--tx)" }}>{v}</div>
      {sub && <div className="m" style={{ fontSize: 9.5, color: "var(--mu)", marginTop: 1 }}>{sub}</div>}
    </div>
  );
}
/* Bewegung lässt sich abschalten — im Menü und über die Systemeinstellung. */
/* Vibration und Textgröße laufen nach demselben Muster wie RUHE: ein Wert
   auf Modulebene, eine Setzfunktion, die zusätzlich eine Klasse am Wurzel-
   element pflegt. Dadurch greift der Schalter sofort und überall. */
let VIBRATION = true;
const setVibration = (v) => { VIBRATION = !!v; };
/* Spielweise und Schwierigkeit sind Voreinstellungen, keine Frage bei jeder
   Laufbahn. Sie stehen in den Optionen; die Erstellung zeigt nur noch an,
   womit gespielt wird. */
let SPEEDMODUS = false;
const setSpeedmodus = (v) => { SPEEDMODUS = !!v; };
let SCHWIERIGKEIT = "realismus";
const setSchwierigkeit = (v) => { SCHWIERIGKEIT = v || "realismus"; };
/* Bildschirm während langer Simulationen wach halten. Reine Netzschnittstelle,
   kein zusätzliches Kapsel-Erweiterungsmodul. Ältere Geräte können das nicht —
   dann passiert schlicht nichts. */
let WACH = false;
let wachSperre = null;
const setWach = (v) => {
  WACH = !!v;
  try {
    if (!WACH) { if (wachSperre && wachSperre.release) wachSperre.release(); wachSperre = null; return; }
    if (typeof navigator === "undefined" || !navigator.wakeLock) return;
    navigator.wakeLock.request("screen").then((sp) => { wachSperre = sp; }).catch(() => {});
  } catch (e) { wachSperre = null; }
};
const wachMoeglich = () => {
  try { return typeof navigator !== "undefined" && !!navigator.wakeLock; } catch (e) { return false; }
};
let TEXTSTUFE = 1;   // 0 klein · 1 normal · 2 groß
const TEXTSKALA = [0.92, 1, 1.12];
const setTextstufe = (n) => {
  TEXTSTUFE = Math.max(0, Math.min(2, n | 0));
  if (typeof document !== "undefined" && document.documentElement)
    document.documentElement.style.setProperty("--skala", String(TEXTSKALA[TEXTSTUFE]));
};
/* Rollen der Seite sperren, solange eine Überlagerung offen ist. Ohne das
   rollt der Hintergrund unter der Saisonbilanz mit, sobald man am Rand der
   Karte wischt — man sieht dann die Seite darunter wandern und weiss nicht
   mehr, was gerade reagiert. Zähler statt Schalter: bei zwei Überlagerungen
   übereinander darf die erste, die schliesst, nicht schon freigeben. */
let ROLLSPERRE = 0;
const rollSperren = (an) => {
  if (typeof document === "undefined" || !document.body) return;
  ROLLSPERRE = Math.max(0, ROLLSPERRE + (an ? 1 : -1));
  document.body.style.overflow = ROLLSPERRE > 0 ? "hidden" : "";
  document.body.style.touchAction = ROLLSPERRE > 0 ? "none" : "";
};

/* ---- Zurück-Taste des Geräts ---------------------------------------------
   Ohne Zusatzpaket: Capacitor leitet die Taste an den Verlauf der WebView
   weiter, also lässt sie sich über `popstate` abfangen. Für jede Ansicht,
   die sich schliessen lässt, wird ein Eintrag in den Verlauf gelegt; die
   Taste nimmt ihn wieder herunter.

   Ein STAPEL, kein einzelner Empfänger: Optionen über Menü, Rückblick über
   Karriere — die Taste muss immer das Oberste schliessen, nicht irgendetwas.
   Ist der Stapel leer, greift nichts und die Taste verlässt die App wie
   gewohnt. */
const ZURUECK = [];
let zurueckBereit = false;
let ZURUECK_WEG = "keiner";      /* für die Diagnose im Messwerkzeug */

/* Einen Verlaufseintrag legen. Gibt zurück, ob es geklappt hat — der erste
   Versuch hatte hier ein stilles try/catch, und genau deshalb tat die Taste
   gar nichts: unter file:// wirft pushState einen Sicherheitsfehler, der
   verschluckt wurde. Ohne Eintrag im Verlauf gibt es kein popstate. */
const verlaufLegen = () => {
  try {
    if (typeof window === "undefined" || !window.history || !window.history.pushState) return false;
    const vorher = window.history.length;
    window.history.pushState({ rs: Date.now() }, "");
    return window.history.length > vorher || window.history.state != null;
  } catch (e) { return false; }
};

const zurueckAusloesen = () => {
  const oben = ZURUECK[ZURUECK.length - 1];
  if (!oben) return false;
  oben();
  return true;
};

const zurueckBereitstellen = () => {
  if (zurueckBereit || typeof window === "undefined") return;
  zurueckBereit = true;

  /* Weg 1: Capacitor. Wenn das App-Plugin da ist, ist das der zuverlässige
     Weg — es meldet die Taste unabhängig vom Verlauf. */
  try {
    const cap = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (cap && cap.addListener) {
      cap.addListener("backButton", () => {
        if (!zurueckAusloesen() && cap.exitApp) cap.exitApp();
      });
      ZURUECK_WEG = "Capacitor";
      try { window.RS_ZURUECK_WEG = ZURUECK_WEG; } catch (e2) {}
      return;
    }
  } catch (e) { /* kein Capacitor */ }

  /* Weg 2: das Ereignis, das Cordova und einige WebViews auf document feuern. */
  try {
    document.addEventListener("backbutton", (ev) => {
      if (zurueckAusloesen() && ev.preventDefault) ev.preventDefault();
    }, false);
  } catch (e) { /* egal */ }

  /* Weg 3: der Verlauf. Funktioniert überall dort, wo pushState erlaubt ist. */
  window.addEventListener("popstate", () => {
    if (ZURUECK.length) { verlaufLegen(); zurueckAusloesen(); }
  });
  ZURUECK_WEG = verlaufLegen() ? "Verlauf" : "keiner (pushState gesperrt)";
  /* Für die Diagnose im Browsertest sichtbar machen. */
  try { window.RS_ZURUECK_WEG = ZURUECK_WEG; } catch (e) {}
};

const zurueckAnmelden = (fn) => {
  if (typeof window === "undefined") return () => {};
  zurueckBereitstellen();
  /* Je offener Ansicht ein eigener Eintrag — nur beim Verlaufsweg nötig. */
  if (ZURUECK_WEG === "Verlauf") verlaufLegen();
  ZURUECK.push(fn);
  return () => {
    const i = ZURUECK.lastIndexOf(fn);
    if (i >= 0) ZURUECK.splice(i, 1);
  };
};
/* In einer Ansicht: useZurueck(() => onBack()). Meldet beim Aufbau an und
   beim Abbau wieder ab. */
function useZurueck(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => zurueckAnmelden(() => ref.current && ref.current()), []);
}

let RUHE = false;
const setRuhe = (v) => { RUHE = !!v; if (typeof document !== "undefined")
  document.documentElement.classList.toggle("rs-still", !!v); };
try {
  if (typeof window !== "undefined" && window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches) RUHE = true;
} catch (e) { /* keine Systemangabe */ }

/* Ein kurzer Impuls im Gerät. Läuft über die Weboberfläche, ohne Zusatzpaket. */
const HAP = { tipp:8, wahl:14, gut:[12, 40, 22], gross:[18, 50, 26, 50, 40], schlecht:[26, 60, 26] };
const HAP_RANG = { tipp:1, wahl:2, gut:3, schlecht:3, gross:4 };
let hapZeit = 0, hapRang = 0;
/* Android gibt die Wachsperre frei, sobald die App in den Hintergrund geht.
   Beim Zurückkommen muss sie neu angefordert werden. */
if (typeof document !== "undefined" && document.addEventListener) {
  document.addEventListener("visibilitychange", () => {
    if (WACH && document.visibilityState === "visible" && !wachSperre) setWach(true);
  });
}

function haptik(art) {
  if (RUHE) return;
  /* Die Rückmeldung für Schaltflächen läuft zentral, einzelne Stellen melden
     zusätzlich. Damit daraus kein Doppelrütteln wird: kurz hintereinander nur
     einmal — ein kräftigerer Impuls darf einen schwächeren aber ablösen. */
  const jetzt = Date.now(), rang = HAP_RANG[art] || 1;
  if (jetzt - hapZeit < 160 && rang <= hapRang) return;
  hapZeit = jetzt; hapRang = rang;
  if (!VIBRATION) return;
  try {
    const H = typeof window !== "undefined" && window.Capacitor && window.Capacitor.Plugins
      && window.Capacitor.Plugins.Haptics;
    if (H && H.impact) { H.impact({ style: art === "tipp" ? "Light" : art === "wahl" ? "Medium" : "Heavy" }); return; }
    if (!VIBRATION) return;
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(HAP[art] || 10);
  } catch (e) { /* Gerät kann das nicht */ }
}

/* Nach einem Reiterwechsel an den Anfang des Bereichs springen. Ohne das
   bleibt man bei kürzerem Inhalt irgendwo unterhalb der Seite stehen. */
function zumAnfang(el) {
  try {
    if (!el || typeof window === "undefined" || !window.scrollTo) return;
    const bar = document.querySelector(".tbar");
    const hoch = (bar && bar.getBoundingClientRect ? bar.getBoundingClientRect().height : 0) + 10;
    const y = el.getBoundingClientRect().top + (window.scrollY || 0) - hoch;
    window.scrollTo({ top: Math.max(0, y), behavior: RUHE ? "auto" : "smooth" });
  } catch (e) { /* ohne Fenster nichts zu tun */ }
}

/* Zahl, die von ihrem alten auf den neuen Wert hochläuft. */
function Zahl({ v, dez = 0, dauer = 1500, suffix = "", style, className }) {
  const [z, setZ] = useState(v);
  const von = useRef(v);
  useEffect(() => {
    if (RUHE) { von.current = v; setZ(v); return; }
    const a = von.current, b = v, t0 = Date.now();
    if (a === b) return;
    let id = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - t0) / dauer);
      const e = 1 - Math.pow(1 - t, 3);              // weiches Abbremsen
      setZ(a + (b - a) * e);
      if (t < 1) id = requestAnimationFrame(tick); else von.current = b;
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [v, dauer]);
  return <span className={className} style={style}>{z.toFixed(dez)}{suffix}</span>;
}

/* Grüner Pfeil hoch, roter Pfeil runter — mit der Veränderung daneben. */
function Delta({ v, dez = 0, klein }) {
  if (!v || Math.abs(v) < (dez ? .05 : .5)) return null;
  const hoch = v > 0;
  return (
    <span className="m rs-auf" style={{ fontSize: klein ? 9.5 : 11.5, marginLeft: 5,
      color: hoch ? "var(--ok)" : "var(--bad)", whiteSpace: "nowrap" }}>
      {hoch ? "▲" : "▼"} {hoch ? "+" : "−"}{Math.abs(v).toFixed(dez)}
    </span>
  );
}

/* Liste, deren Einträge nacheinander einfliegen. */
function Reihe({ children, i = 0, takt = 55, className = "", style }) {
  return (
    <div className={"rs-auf " + className} style={{ animationDelay: (RUHE ? 0 : i * takt) + "ms", ...(style || {}) }}>
      {children}
    </div>
  );
}

function Meter({ label, v, inv, delta, blitz }) {
  const c = inv ? (v > 60 ? "var(--bad)" : v > 35 ? "var(--go)" : "var(--ok)") : (v > 66 ? "var(--ok)" : v > 38 ? "var(--go)" : "var(--bad)");
  return (
    <div className={blitz ? "rs-blitz" : ""}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="m" style={{ fontSize: 9.5, color: "var(--mu)" }}>{label}</span>
        <span className="m" style={{ fontSize: 10.5, color: ueber99(v) ? "var(--go)" : undefined,
          fontWeight: ueber99(v) ? 700 : undefined }}>
          <Zahl v={v} /><Delta v={delta} klein /></span>
      </div>
      {/* Der Balken wird gestaucht statt in der Breite verändert — das läuft
          auf der Grafikeinheit und bleibt auch auf alten Geräten flüssig. */}
      <div className="bar" style={{ marginTop: 2, boxShadow: ueber99(v) ? "0 0 7px var(--go)" : "none" }}>
        <i style={{ width: "100%", background: ueber99(v) ? "var(--go)" : c,
          transform: "scaleX(" + clamp(v, 0, 100) / 100 + ")" }} />
      </div>
    </div>
  );
}
/* Zeigt unübersehbar, was gerade zu tun ist. Ein Blick genügt. */
/* Wo im Saisonablauf stehe ich gerade? */
function Schritte({ aktiv }) {
  const L = [["training", "Training"], ["event", "Entscheidung"], ["result", "Saisonende"]];
  const i0 = Math.max(0, L.findIndex(([k]) => k === aktiv));
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "nowrap" }}>
      {L.map(([k, l], i) => (
        <React.Fragment key={k}>
          {i > 0 && <span style={{ width: 7, height: 1, background: i <= i0 ? "var(--ok)" : "var(--ln2)" }} />}
          <span className="m" style={{ fontSize: 8.8, letterSpacing: ".02em", padding: "1px 5px", borderRadius: 0,
            border: "1px solid " + (i === i0 ? "var(--ac)" : i < i0 ? "var(--ok)" : "var(--ln2)"),
            color: i === i0 ? "var(--ac)" : i < i0 ? "var(--ok)" : "var(--mu)",
            background: i === i0 ? "var(--ac)1A" : "transparent" }}>
            {i < i0 ? "✓ " : ""}{l}
          </span>
        </React.Fragment>))}
    </div>
  );
}

/* Farben für Nationalmannschaften — aus der Flagge abgeleitet, mit einer
   kurzen Liste für die bekanntesten.                                    */
const LANDFARBE = {
  GER:["#000000","#FFCE00"], BRA:["#009C3B","#FFDF00"], ARG:["#75AADB","#FFFFFF"],
  FRA:["#002395","#ED2939"], ESP:["#AA151B","#F1BF00"], ITA:["#008C45","#0057B8"],
  ENG:["#FFFFFF","#CE1124"], NED:["#FF7F00","#21468B"], POR:["#006600","#FF0000"],
  BEL:["#000000","#FDDA24"], CRO:["#FF0000","#171796"], URU:["#7BAFD4","#FFFFFF"],
  MEX:["#006847","#CE1126"], USA:["#3C3B6E","#B22234"], JPN:["#BC002D","#FFFFFF"],
  KOR:["#0047A0","#CD2E3A"], NGA:["#008751","#FFFFFF"], SEN:["#00853F","#FDEF42"],
  MAR:["#C1272D","#006233"], EGY:["#CE1126","#000000"], CMR:["#007A5E","#CE1126"],
  GHA:["#CE1126","#FCD116"], COL:["#FCD116","#003893"], CHI:["#0039A6","#D52B1E"],
  POL:["#FFFFFF","#DC143C"], SUI:["#D52B1E","#FFFFFF"], AUT:["#ED2939","#FFFFFF"],
  DEN:["#C60C30","#FFFFFF"], SWE:["#006AA7","#FECC00"], NOR:["#BA0C2F","#FFFFFF"],
  TUR:["#E30A17","#FFFFFF"], GRE:["#0D5EAF","#FFFFFF"], SCO:["#0065BF","#FFFFFF"],
};
function landesFarben(nat) {
  const f = LANDFARBE[nat.id];
  if (f) {
    /* Weiß ist eine gültige Flaggenfarbe — es darf nur nicht die führende
       sein, sonst verschwindet sie auf hellem Grund.                     */
    const p = f[0] === "#FFFFFF" ? f[1] : f[0];
    const s = p === f[1] ? f[0] : f[1];
    return { p, s };
  }
  /* Sonst aus der Kennung eine feste Farbe ableiten — als Hexwert, damit
     sich überall die Helligkeit prüfen lässt.                          */
  const h = hashStr(nat.id) % 360;
  return { p: hslHex(h, 62, 46), s: hslHex((h + 42) % 360, 58, 68) };
}

/* Konfetti auf einer Zeichenfläche — ohne Zusatzpaket, ohne Bilddateien. */
function Konfetti({ farben, staerke = 1, dauer = 2600 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (RUHE) return;
    const cv = ref.current; if (!cv) return;
    let ctx = null;
    try { ctx = cv.getContext("2d"); } catch (e) { return; }   // manche Umgebungen können das nicht
    if (!ctx || !ctx.fillRect) return;
    const W = cv.width = cv.offsetWidth * 2, H = cv.height = cv.offsetHeight * 2;
    const F = farben && farben.length ? farben : ["#F2C230", "#3DA35D", "#EDF2E9"];
    const n = Math.round(90 * staerke);
    const teile = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: -Math.random() * H * .6,
      b: 5 + Math.random() * 9 * staerke, h: 8 + Math.random() * 14 * staerke,
      vy: 2.4 + Math.random() * 4.6, vx: (Math.random() - .5) * 2.6,
      dr: (Math.random() - .5) * .26, r: Math.random() * 6.3,
      c: F[Math.floor(Math.random() * F.length)],
    }));
    const t0 = Date.now(); let id = 0;
    const tick = () => {
      const t = (Date.now() - t0) / dauer;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = t > .7 ? Math.max(0, 1 - (t - .7) / .3) : 1;
      teile.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.dr; p.vy += .06;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.b / 2, -p.h / 2, p.b, p.h); ctx.restore();
      });
      if (t < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
    pointerEvents: "none", zIndex: 2 }} />;
}

/* Kurze Einblendung nach einem Titelgewinn, in den Farben des Vereins. */
/* Runde Marken, die einen eigenen Moment verdienen. */
const MARKEN = [
  { f:(p)=>p.tot.apps, w:[100,250,500,750,1000], n:(v)=>v + ". Pflichtspiel", u:"Ein Leben auf dem Platz" },
  { f:(p)=>p.tot.goals, w:[50,100,200,300,500], n:(v)=>v + ". Tor", u:"Der Ball war drin" },
  { f:(p)=>p.tot.assists, w:[50,100,200], n:(v)=>v + ". Vorlage", u:"Aufgelegt und weitergegeben" },
  { f:(p)=>p.tot.cs, w:[50,100,200], n:(v)=>v + ". Spiel ohne Gegentor", u:"Die Null stand" },
  { f:(p)=>p.nt.caps, w:[25,50,100,150], n:(v)=>v + ". Länderspiel", u:"Für dein Land" },
];
function markenPruefen(vorher, nachher) {
  const treffer = [];
  MARKEN.forEach((M) => {
    const a = M.f(vorher), b = M.f(nachher);
    M.w.forEach((g) => { if (a < g && b >= g) treffer.push({ n: M.n(g), u: M.u }); });
  });
  return treffer;
}

/* Kurze Einblendung für eine erreichte Marke. */
function MarkeJubel({ marke, onFertig }) {
  useEffect(() => {
    haptik("gut");
    const t = setTimeout(() => onFertig && onFertig(), RUHE ? 700 : 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="rs-schleier" onClick={onFertig} style={{ cursor: "pointer", padding: "0 18px" }}>
      <Konfetti farben={["#E8B84B", "#DCE3D8", "#5E9BD8"]} staerke={.7} dauer={2000} />
      <div className="rs-rein" style={{ textAlign: "center", zIndex: 3 }}>
        <div className="eb" style={{ color: "var(--go)", letterSpacing: ".22em" }}>MEILENSTEIN</div>
        <div className="d" style={{ fontSize: "clamp(26px,8vw,52px)", lineHeight: 1.08, marginTop: 6,
          textShadow: "0 3px 24px rgba(176,141,78,.45)" }}>{marke.n}</div>
        <div className="m" style={{ fontSize: 13, color: "var(--mu)", marginTop: 8 }}>{marke.u}</div>
      </div>
    </div>
  );
}

function TitelJubel({ titel, club, land, onFertig }) {
  useEffect(() => {
    haptik("gross");
    const t = setTimeout(() => onFertig && onFertig(), RUHE ? 900 : 1400 + titel.length * 900);
    return () => clearTimeout(t);
  }, []);
  /* Konfetti in den Farben dessen, für den gewonnen wurde */
  const f = farbPaar(land ? landesFarben(land) : club ? clubColors(club) : null);
  const gross = titel.length === 1;
  return (
    <div className="rs-schleier" onClick={onFertig} style={{ cursor: "pointer", padding: "0 16px" }}>
      <Konfetti farben={[f.p, f.s, f.p, "#DCE3D8"]} staerke={1.1 + titel.length * .18} dauer={3000} />
      <div className="rs-rein" style={{ textAlign: "center", zIndex: 3, maxWidth: 520 }}>
        <div className="eb" style={{ color: hell(f.p) ? f.p : hell(f.s) ? f.s : "var(--go)",
          letterSpacing: ".22em" }}>
          {land ? "FÜR DEIN LAND" : titel.length > 1 ? "GEWONNEN" : "GEWONNEN"}
        </div>
        {titel.map((t, i) => (
          <div key={i} className="rs-auf" style={{ animationDelay: (RUHE ? 0 : 260 + i * 420) + "ms" }}>
            <div className="d" style={{ lineHeight: 1.06, marginTop: i ? 10 : 6,
              fontSize: gross ? "clamp(30px,9vw,62px)" : "clamp(21px,6.2vw,40px)",
              textShadow: "0 3px 26px " + (hell(f.p) ? f.p + "70" : "rgba(176,141,78,.45)") }}>{t}</div>
          </div>))}
        <div className="m" style={{ fontSize: 13, color: "var(--mu)", marginTop: 12 }}>
          {land ? "mit " + land.name : club ? "mit " + club.n : ""}
        </div>
      </div>
    </div>
  );
}

/* Der Moment, in dem die Saison gerechnet wird. */
/* Der Saisonrückblick als Abfolge — eine Seite nach der anderen, wie ein
   Jahresrückblick. Es geht nichts verloren, es kommt nur nacheinander.   */
/* Der Rückblick auf die ganze Laufbahn — dieselbe Machart wie nach einer
   Saison, nur über alles. Danach folgt die gewohnte Abschlussbilanz.    */
function KarriereRueckblick({ p, onFertig }) {
  const [i, setI] = useState(0);
  useZurueck(onFertig);
  /* Solange der Rückblick offen ist, rollt die Seite darunter nicht mit. */
  useEffect(() => { rollSperren(true); return () => rollSperren(false); }, []);
  const isTW = p.pos === "TW";
  const S = p.seasons || [];
  const v = p.verdict || verdict(p);
  const seiten = [];
  const K = (kopf, unter, inhalt, farbe) => seiten.push({ kopf, unter, inhalt, farbe });
  const GZ = { fontSize: "clamp(46px,15vw,96px)", lineHeight: 1 };
  const MZ = { fontSize: "clamp(30px,9vw,56px)", lineHeight: 1 };

  K("Deine Laufbahn", p.name + " · " + (S.length ? String(S[0].year).slice(0, 4) : p.year) + " bis " + p.year, (
    <div style={{ textAlign: "center" }}>
      <Zahl v={S.length} className="d" style={{ ...GZ, color: "var(--ac)" }} />
      <div className="eb" style={{ marginTop: 4 }}>{S.length === 1 ? "Saison als Profi" : "Saisons als Profi"}</div>
      <div className="m" style={{ fontSize: 12.5, color: "var(--mu)", marginTop: 12 }}>
        {S.length
          ? POS[p.pos].label + " · mit " + S[0].age + " angefangen, mit " + p.age + " aufgehört"
          : POS[p.pos].label + " · aufgehört, bevor es losging"}</div>
    </div>), "var(--ac)");

  if (p.tot.apps > 0) K("Auf dem Platz", "Alles zusammengerechnet", (
    <div style={{ textAlign: "center" }}>
      <Zahl v={p.tot.apps} className="d" style={{ ...GZ, color: "var(--go)" }} />
      <div className="eb" style={{ marginTop: 4 }}>Pflichtspiele</div>
      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px,6vw,40px)", marginTop: 22 }}>
        <div><Zahl v={isTW ? p.tot.cs : p.tot.goals} className="d" style={{ ...MZ, color: "var(--go)" }} />
          <div className="eb" style={{ marginTop: 3 }}>{isTW ? "Zu Null" : "Tore"}</div></div>
        <div><Zahl v={p.tot.assists} className="d" style={{ ...MZ, color: "var(--ac)" }} />
          <div className="eb" style={{ marginTop: 3 }}>Vorlagen</div></div>
      </div>
    </div>), "var(--go)");

  K("Deine Stärke", "Was am Ende dabei herauskam", (
    <div style={{ textAlign: "center" }}>
      <Zahl v={p.peakOvr} className="d" style={{ ...GZ, color: ueber99(p.peakOvr) ? "var(--go)" : "var(--ac)" }} />
      <div className="eb" style={{ marginTop: 4 }}>Bestwert</div>
      <div className="m" style={{ fontSize: 12.5, color: "var(--mu)", marginTop: 14 }}>
        Anlage {p.potential} · beste Saisonnote {S.length ? Math.min(...S.map((x) => x.note)).toFixed(1) : "—"}
      </div>
    </div>), "var(--ac)");

  const laender = [...new Set(S.map((x) => x.land))];
  const vereine = [...new Set(S.map((x) => x.club))];
  if (vereine.length) K("Deine Stationen", vereine.length + " Vereine in " + laender.length + (laender.length === 1 ? " Land" : " Ländern"), (
    <div className="g1" style={{ maxWidth: 400, margin: "0 auto", maxHeight: "46vh", overflowY: "auto" }}>
      {vereine.slice(0, 10).map((cn, k) => {
        const dort = S.filter((x) => x.club === cn);
        return (
          <Reihe key={cn} i={k} takt={80}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "6px 0", borderBottom: "1px solid var(--ln)" }}>
              <span style={{ fontSize: 13, textAlign: "left" }}>{cn}</span>
              <span className="m" style={{ fontSize: 11.5, color: "var(--mu)" }}>
                {dort.length} {dort.length === 1 ? "Saison" : "Saisons"} · {dort.reduce((a, x) => a + x.apps, 0)} Spiele</span>
            </div>
          </Reihe>); })}
      {vereine.length > 10 && <div className="m" style={{ fontSize: 11, color: "var(--mu)" }}>und {vereine.length - 10} weitere</div>}
    </div>), "var(--ac)");

  if (p.nt.caps > 0 || (p.nt.uCaps || 0) > 0) K("Für dein Land", p.nation.flag + " " + p.nation.name, (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px,6vw,40px)" }}>
        <div><Zahl v={p.nt.caps} className="d" style={{ ...MZ, color: "var(--ac)" }} />
          <div className="eb" style={{ marginTop: 3 }}>Länderspiele</div></div>
        <div><Zahl v={p.nt.goals} className="d" style={{ ...MZ, color: "var(--go)" }} />
          <div className="eb" style={{ marginTop: 3 }}>Tore</div></div>
      </div>
      {(p.nt.uCaps || 0) > 0 && <div className="m" style={{ fontSize: 12, color: "var(--mu)", marginTop: 14 }}>
        dazu {p.nt.uCaps} Einsätze in den Juniorenteams</div>}
      {p.nt.majors.filter((m) => !m.u).length > 0 && (
        <div className="g1" style={{ maxWidth: 340, margin: "16px auto 0" }}>
          {p.nt.majors.filter((m) => !m.u).slice(-6).map((m, k) => (
            <Reihe key={k} i={k} takt={90}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0",
                borderBottom: "1px solid var(--ln)" }}>
                <span style={{ fontSize: 12.5 }}>{m.turnier} {m.y}</span>
                <span className="m" style={{ fontSize: 11.5, color: m.res === "Titel" ? "var(--go)" : "var(--mu)" }}>{m.res}</span>
              </div>
            </Reihe>))}
        </div>)}
    </div>), "var(--ok)");

  if (p.trophies.length) K("Die Vitrine", p.trophies.length + (p.trophies.length === 1 ? " Titel" : " Titel"), (
    <div className="g1" style={{ maxWidth: 400, margin: "0 auto", maxHeight: "46vh", overflowY: "auto" }}>
      {(() => { const z = {}; p.trophies.forEach((t) => { const k = t.replace(/\s+\d{4}(\/\d+)?$/, ""); z[k] = (z[k] || 0) + 1; });
        return Object.entries(z).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t, n], k) => (
          <Reihe key={t} i={k} takt={80}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0",
              borderBottom: "1px solid var(--ln)" }}>
              <span style={{ fontSize: 13, color: "var(--go)", textAlign: "left" }}>{t}</span>
              {n > 1 && <span className="m" style={{ fontSize: 12, color: "var(--mu)" }}>{n}×</span>}
            </div>
          </Reihe>)); })()}
    </div>), "var(--go)");

  if (p.awards && p.awards.length) K("Auszeichnungen", p.awards.length + " persönliche Ehrungen", (
    <div className="g1" style={{ maxWidth: 400, margin: "0 auto", maxHeight: "46vh", overflowY: "auto" }}>
      {(() => { const z = {}; p.awards.forEach((a) => { z[a.a] = (z[a.a] || 0) + 1; });
        return Object.entries(z).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t, n], k) => (
          <Reihe key={t} i={k} takt={80}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0",
              borderBottom: "1px solid var(--ln)" }}>
              <span style={{ fontSize: 13, textAlign: "left" }}>{t}</span>
              {n > 1 && <span className="m" style={{ fontSize: 12, color: "var(--mu)" }}>{n}×</span>}
            </div>
          </Reihe>)); })()}
    </div>), "var(--go)");

  K("Was du verdient hast", "Über die ganze Laufbahn", (
    <div style={{ textAlign: "center" }}>
      <div className="d" style={{ ...MZ, color: "var(--ac)" }}>{eur(netWorth(p))} €</div>
      <div className="eb" style={{ marginTop: 4 }}>Gesamtvermögen</div>
      <div className="m" style={{ fontSize: 12.5, color: "var(--mu)", marginTop: 14 }}>
        {p.assets.length} Anschaffungen · {Object.keys(p.depot || {}).length} Anlageformen
        {p.donated > 0 ? " · " + eur(p.donated) + " € gespendet" : ""}</div>
    </div>), "var(--ac)");

  if (v.ehre) K("Dein Vermächtnis", "Was von dir bleibt", (
    <div style={{ textAlign: "center" }}>
      <div className="d" style={{ fontSize: "clamp(24px,7vw,44px)", lineHeight: 1.12, color: v.ehre.col }}>{v.ehre.n}</div>
      <p style={{ fontSize: 13, color: "var(--mu)", marginTop: 8 }}>{v.ehre.t}</p>
      {v.ehrenAlle && v.ehrenAlle.length > 1 && (
        <div className="m" style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 16 }}>
          außerdem: {v.ehrenAlle.slice(1).map((x) => x.n).join(" · ")}</div>)}
    </div>), v.ehre.col);

  K("Das Urteil", v.tier, (
    <div style={{ textAlign: "center" }}>
      <Zahl v={v.score} dauer={1800} className="d" style={{ ...GZ, color: "var(--go)" }} />
      <div className="eb" style={{ marginTop: 4 }}>Vermächtnispunkte</div>
      <div className="d" style={{ fontSize: "clamp(20px,5.6vw,34px)", marginTop: 16 }}>{v.tier}</div>
      <p style={{ fontSize: 13, color: "var(--mu)", marginTop: 6 }}>{v.text}</p>
    </div>), "var(--go)");

  const letzte = i >= seiten.length - 1;
  const se = seiten[Math.min(i, seiten.length - 1)];
  const weiter = () => { haptik(letzte ? "gut" : "tipp"); if (letzte) onFertig(); else setI(i + 1); };
  /* Diese Ansicht steht für sich und muss ihr Stylesheet selbst mitbringen —
     sie wird nicht innerhalb der Spielansicht ausgegeben.                  */
  return (
    <div className="fl">
      <style>{CSS}</style>
      <div className="rs-schleier" onClick={weiter} style={{ cursor: "pointer", padding: "0 16px" }}>
        <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", gap: 4 }}>
          {seiten.map((_, k) => <i key={k} style={{ flex: 1, height: 3, borderRadius: 0, display: "block",
            background: k <= i ? "var(--go)" : "var(--ln2)" }} />)}
        </div>
        <div key={i} className="rs-rein" style={{ zIndex: 3, width: "100%", maxWidth: 480, textAlign: "center" }}>
          <div className="eb" style={{ color: se.farbe, letterSpacing: ".18em" }}>{se.kopf.toUpperCase()}</div>
          <div className="m" style={{ fontSize: 12, color: "var(--mu)", margin: "3px 0 20px" }}>{se.unter}</div>
          {se.inhalt}
        </div>
        <div className="m rs-auf" style={{ position: "absolute", bottom: 22, fontSize: 11, color: "var(--mu)" }}>
          {letzte ? "Tippen für die Abschlussbilanz" : "Tippen für weiter"} · {i + 1}/{seiten.length}
        </div>
      </div>
    </div>
  );
}

function SaisonRueckblick({ p, s, onFertig }) {
  const [i, setI] = useState(0);
  useZurueck(onFertig);
  /* Solange der Rückblick offen ist, rollt die Seite darunter nicht mit. */
  useEffect(() => { rollSperren(true); return () => rollSperren(false); }, []);
  const isTW = p.pos === "TW";
  const titel = s.trophies || [];
  const seiten = [];
  const S = (kopf, unter, inhalt, farbe) => seiten.push({ kopf, unter, inhalt, farbe });

  S("Die Saison " + s.year, s.club, (
    <div style={{ textAlign: "center" }}>
      <Zahl v={s.apps} className="d" style={{ fontSize: "clamp(52px,17vw,104px)", lineHeight: 1, color: "var(--ac)" }} />
      <div className="eb" style={{ marginTop: 4 }}>Pflichtspiele</div>
      <div className="m" style={{ fontSize: 12, color: "var(--mu)", marginTop: 10 }}>
        {s.role} · {s.minutes ? s.minutes + " Minuten" : "Saison abgeschlossen"}</div>
    </div>), "var(--ac)");

  /* Ausbeute und Aufteilung auf einer Seite */
  S(isTW ? "Deine Zu-Null-Spiele" : "Deine Ausbeute", isTW ? "So oft blieb der Kasten sauber" : "Tore und Vorlagen", (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(18px,7vw,48px)", textAlign: "center" }}>
        <div>
          <Zahl v={isTW ? s.cs : s.goals} className="d" style={{ fontSize: "clamp(40px,12.5vw,76px)", lineHeight: 1, color: "var(--go)" }} />
          <div className="eb" style={{ marginTop: 3 }}>{isTW ? "Zu Null" : "Tore"}</div>
        </div>
        <div>
          <Zahl v={s.assists} className="d" style={{ fontSize: "clamp(40px,12.5vw,76px)", lineHeight: 1, color: "var(--ac)" }} />
          <div className="eb" style={{ marginTop: 3 }}>Vorlagen</div>
        </div>
      </div>
      {s.comps && s.comps.filter((c) => c.apps > 0).length > 1 && (
        <div className="g1" style={{ maxWidth: 360, margin: "20px auto 0" }}>
          {s.comps.filter((c) => c.apps > 0).map((c, k) => (
            <Reihe key={c.key} i={k} takt={90}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline",
                padding: "5px 0", borderBottom: "1px solid var(--ln)" }}>
                <span style={{ fontSize: 12.5 }}>{c.name}</span>
                <span className="m" style={{ fontSize: 11.5, color: "var(--mu)" }}>
                  {c.apps} Spiele · {isTW ? c.cs + " zu Null" : c.goals + " Tore"}</span>
              </div>
            </Reihe>))}
        </div>)}
    </div>), "var(--go)");

  /* Note, Defensivarbeit und Tabellenplatz auf einer Seite */
  S("Bewertung", s.note <= 2.5 ? "Eine starke Saison" : s.note <= 3.4 ? "Solide Arbeit" : "Da geht mehr", (
    <div style={{ textAlign: "center" }}>
      <Zahl v={s.note} dez={1} dauer={1400} className="d"
        style={{ fontSize: "clamp(52px,17vw,104px)", lineHeight: 1, color: noteCol(s.note) }} />
      <div className="eb" style={{ marginTop: 4 }}>Saisonnote</div>
      {/* Ein Ausschnitt aus der Tabelle statt einer nackten Zahl: zwei Plätze
          darüber, zwei darunter, die eigene Zeile hervorgehoben. Man sieht auf
          einen Blick, ob es eng war oder eindeutig. Die Nachbarn sind nicht
          erfunden — nur Platznummern; Vereinsnamen hätten wir nicht. */}
      <div style={{ marginTop: 18, textAlign: "left", maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
        <div className="eb" style={{ marginBottom: 5 }}>{s.league}</div>
        {(() => {
          const von = clamp(s.rank - 2, 1, Math.max(1, s.N - 4));
          const zeilen = [];
          for (let r = von; r < von + 5 && r <= s.N; r++) zeilen.push(r);
          return zeilen.map((r) => {
            const ich = r === s.rank;
            return (
              <div key={r} style={{ display: "flex", alignItems: "baseline", gap: 9,
                padding: "3px 7px", borderLeft: "3px solid " + (ich ? "var(--go)" : "transparent"),
                background: ich ? "rgba(242,194,48,.12)" : "transparent" }}>
                <span className="d" style={{ fontSize: ich ? 19 : 14, minWidth: 26,
                  color: ich ? "var(--go)" : "var(--mu)" }}>{r}</span>
                <span className="m" style={{ fontSize: ich ? 13.5 : 11.5,
                  color: ich ? "var(--tx)" : "var(--ln2)", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ich ? s.club : "—"}</span>
              </div>);
          });
        })()}
        <div className="m" style={{ fontSize: 11, color: "var(--mu)", marginTop: 5, textAlign: "right" }}>
          Platz {s.rank} von {s.N}</div>
      </div>
      {s.move && <div className="m" style={{ fontSize: 12.5, marginTop: 8,
        color: s.move.dir === "auf" ? "var(--ok)" : "var(--bad)" }}>
        {s.move.dir === "auf" ? "▲ Aufgestiegen" : "▼ Abgestiegen"}</div>}
      {s.dstat && (
        <div className="m" style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 14 }}>
          {s.dstat.duelle} Zweikämpfe · {Math.round(s.dstat.quote * 100)} % gewonnen · {s.dstat.eroberungen} Balleroberungen
        </div>)}
    </div>), noteCol(s.note));

  /* Verpasste Spiele. Die Karte fehlte ganz — dabei ist eine Saison mit
     18 Ausfällen etwas völlig anderes als eine durchgespielte, und genau
     das erzählt ein Rückblick. Nur zeigen, wenn wirklich etwas ausgefallen
     ist; eine Karte mit einer Null wäre die Sorte leere Seite, die Kevin
     beanstandet hat. */
  {
    const verletzt = (s.injury && s.injury.games) || 0;
    const gesperrt = s.banned || 0;
    const weg = verletzt + gesperrt;
    if (weg > 0) S("Ausgefallen", weg === 1 ? "Ein Spiel nicht dabei" : weg + " Spiele nicht dabei", (
      <div style={{ textAlign: "center" }}>
        <Zahl v={weg} className="d" style={{ fontSize: "clamp(52px,17vw,104px)", lineHeight: 1,
          color: weg >= 12 ? "var(--bad)" : "var(--go)" }} />
        <div className="eb" style={{ marginTop: 4 }}>verpasste Spiele</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(18px,7vw,44px)", marginTop: 20 }}>
          <div><Zahl v={verletzt} className="d" style={{ fontSize: "clamp(26px,8vw,44px)", lineHeight: 1,
            color: "var(--bad)" }} />
            <div className="eb" style={{ marginTop: 3 }}>verletzt</div></div>
          <div><Zahl v={gesperrt} className="d" style={{ fontSize: "clamp(26px,8vw,44px)", lineHeight: 1,
            color: "var(--go)" }} />
            <div className="eb" style={{ marginTop: 3 }}>gesperrt</div></div>
        </div>
        {s.injury && s.injury.name && (
          <div className="m" style={{ fontSize: 12.5, color: "var(--mu)", marginTop: 18 }}>
            {s.injury.name}</div>)}
        <div className="m" style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 12 }}>
          {s.apps} von {s.apps + weg} möglichen Einsätzen</div>
      </div>), weg >= 12 ? "var(--bad)" : "var(--go)");
  }

  /* Nationalmannschaft und Wert auf einer Seite */
  S((s.ntCaps || 0) > 0 ? "Land und Wert" : "Dein Wert",
    (s.ntCaps || 0) > 0 ? (s.ntTeam === "A" ? "Nationalmannschaft" : s.ntTeam) + " · Marktwert" : "Marktwert und Vermögen", (
    <div style={{ textAlign: "center" }}>
      {(s.ntCaps || 0) > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px,6vw,40px)", marginBottom: 22 }}>
          <div><Zahl v={s.ntCaps} className="d" style={{ fontSize: "clamp(30px,9vw,54px)", lineHeight: 1, color: "var(--ac)" }} />
            <div className="eb" style={{ marginTop: 3 }}>Einsätze</div></div>
          <div><Zahl v={s.ntGoals || 0} className="d" style={{ fontSize: "clamp(30px,9vw,54px)", lineHeight: 1, color: "var(--go)" }} />
            <div className="eb" style={{ marginTop: 3 }}>Tore</div></div>
          {s.ntRolle && <div><div className="d" style={{ fontSize: "clamp(15px,4.2vw,24px)", lineHeight: 1.5, color: "var(--tx)" }}>{s.ntRolle}</div>
            <div className="eb" style={{ marginTop: 3 }}>Rolle</div></div>}
        </div>)}
      <div className="d" style={{ fontSize: "clamp(30px,9.5vw,58px)", lineHeight: 1.1, color: "var(--ac)" }}>{eur(s.mv)} €</div>
      <div className="eb" style={{ marginTop: 3 }}>Marktwert</div>
      <div className="m" style={{ fontSize: 12.5, color: "var(--mu)", marginTop: 12 }}>
        Konto {eur(p.money)} € · Gesamtvermögen {eur(netWorth(p))} €</div>
    </div>), "var(--ac)");

  if (titel.length) S(titel.length > 1 ? "Deine Titel" : "Dein Titel", "Diese Saison gewonnen", (
    <div style={{ textAlign: "center" }}>
      {titel.map((t, k) => (
        <Reihe key={k} i={k} takt={220}>
          <div className="d" style={{ fontSize: "clamp(22px,6vw,38px)", lineHeight: 1.2, color: "var(--go)", marginTop: k ? 8 : 0 }}>{t}</div>
        </Reihe>))}
    </div>), "var(--go)");

  const letzte = i >= seiten.length - 1;
  const se = seiten[Math.min(i, seiten.length - 1)];
  const weiter = () => { haptik("tipp"); if (letzte) onFertig(); else setI(i + 1); };
  return (
    <div className="rs-schleier" onClick={weiter} style={{ cursor: "pointer", padding: "0 16px" }}>
      {/* Fortschritt oben, wie bei einer Bildergeschichte */}
      <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", gap: 4 }}>
        {seiten.map((_, k) => <i key={k} style={{ flex: 1, height: 3, borderRadius: 0, display: "block",
          background: k <= i ? "var(--go)" : "var(--ln2)" }} />)}
      </div>
      <div key={i} className="rs-rein" style={{ zIndex: 3, width: "100%", maxWidth: 460, textAlign: "center" }}>
        {/* Die Überschrift war eine Kleinschrift-Zeile wie jede andere — man
            wusste bei manchen Karten nicht, worum es geht. Jetzt in der
            Anzeigeschrift und deutlich grösser, mit einem Strich in der
            Kartenfarbe darunter. */}
        <div className="d" style={{ color: se.farbe, fontSize: "clamp(19px,5.6vw,28px)",
          lineHeight: 1.05, letterSpacing: ".01em" }}>{se.kopf}</div>
        <div style={{ height: 2, width: 46, background: se.farbe, margin: "8px 0 6px", opacity: .8 }} />
        <div className="m" style={{ fontSize: 12.5, color: "var(--mu)", margin: "0 0 20px" }}>{se.unter}</div>
        {se.inhalt}
      </div>
      <div className="m rs-auf" style={{ position: "absolute", bottom: 22, fontSize: 11, color: "var(--mu)" }}>
        {letzte ? "Tippen zum Abschließen" : "Tippen für weiter"} · {i + 1}/{seiten.length}
      </div>
    </div>
  );
}

function Simuliert({ text }) {
  return (
    <div className="rs-schleier">
      <div className="rs-kreis" />
      <div className="m rs-auf" style={{ fontSize: 12.5, color: "var(--mu)", letterSpacing: ".08em" }}>
        {text || "Die Saison läuft…"}</div>
    </div>
  );
}

/* Die Enthüllung der Wildcard. Je seltener, desto größer der Auftritt. */
/* ================================================================
   Enthüllung einer Wildcard — in vier Stufen:
     0 Aufbau     Die Karte liegt verdeckt, das Licht sammelt sich.
     1 Umschlag   Blitz, Druckwelle, die Karte dreht sich.
     2 Nachglühen Funken, Schimmer, der Text baut sich gestaffelt auf.
     3 Bereit     Erst jetzt lässt sich weitertippen.
   Je seltener die Karte, desto länger und größer der Aufbau. Im
   Ruhemodus fällt alles weg und die Karte liegt sofort offen da.
   ================================================================ */
function Strahlen({ farbe, staerke }) {
  if (RUHE) return null;
  return (
    <div aria-hidden style={{ position: "absolute", zIndex: 0, pointerEvents: "none",
      width: "min(150vw,760px)", height: "min(150vw,760px)",
      left: "50%", top: "50%", marginLeft: "min(-75vw,-380px)", marginTop: "min(-75vw,-380px)",
      willChange: "transform", opacity: .16 + staerke * .3,
      background: "repeating-conic-gradient(from 0deg," + farbe + "00 0deg," + farbe
        + "AA 3deg," + farbe + "00 6deg," + farbe + "00 14deg)",
      animation: "rs-strahl " + (26 - staerke * 12).toFixed(0) + "s linear infinite",
      maskImage: "radial-gradient(circle,#000 12%,transparent 66%)",
      WebkitMaskImage: "radial-gradient(circle,#000 12%,transparent 66%)" }} />
  );
}

function Funken({ farbe, anzahl }) {
  if (RUHE || anzahl <= 0) return null;
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none", overflow: "visible" }}>
      {Array.from({ length: anzahl }, (_, i) => {
        const l = 6 + (i * 97) % 88, gr = 3 + ((i * 37) % 5), verz = (i * 83) % 900;
        const c = i % 3 ? farbe : "#F2F5FA";
        return <i key={i} style={{ position: "absolute", left: l + "%", bottom: "8%",
          width: gr * 3, height: gr * 3, borderRadius: "50%",
          background: "radial-gradient(circle," + c + " 0%," + c + "88 35%,transparent 70%)",
          willChange: "transform, opacity",
          animation: "rs-funke " + (1500 + (i * 61) % 900) + "ms ease-out " + verz + "ms infinite" }} />;
      })}
    </div>
  );
}

function WildcardEnthuellung({ card, onFertig }) {
  const [stufe, setStufe] = useState(0);
  const r = RARITY[card.r] || RARITY.normal;
  const rang = ["normal", "selten", "aussen", "unfass", "welt", "goat"].indexOf(card.r);
  /* Sonderstufen stehen nicht in der Reihe, sind aber das Seltenste im Spiel:
     die Rautekarte bekommt den vollen Aufwand, nicht den kleinsten. */
  const pomp = RARITY[card.r] && RARITY[card.r].w === 0 ? 1 : Math.max(0, rang) / 5;
  const gross = pomp >= .55;
  const bereit = stufe >= 3;

  /* Zeitplan. Im Ruhemodus springt alles sofort auf die letzte Stufe. */
  const T = RUHE ? [0, 0, 0, 0]
    : [0, 620 + Math.round(pomp * 420), 0, 0];
  T[2] = T[1] + 820;      /* 700 ms Drehung plus 120 ms Abstand, damit sich
                             Drehung und Schweben nicht überschneiden */
  T[3] = T[2] + 420 + Math.round(pomp * 700);

  useEffect(() => {
    haptik(gross ? "gross" : pomp >= .3 ? "gut" : "wahl");
    if (RUHE) { setStufe(3); return; }
    const uhren = [
      setTimeout(() => { setStufe(1); haptik(gross ? "gross" : "gut"); }, T[1]),
      setTimeout(() => setStufe(2), T[2]),
      setTimeout(() => setStufe(3), T[3]),
    ];
    return () => uhren.forEach(clearTimeout);
  }, []);

  const auf = stufe >= 1;
  return (
    <div className="rs-schleier" onClick={() => bereit && onFertig && onFertig()}
      style={{ cursor: bereit ? "pointer" : "default", overflow: "hidden" }}>

      {/* Blitz im Moment des Umschlags */}
      {!RUHE && stufe === 1 && gross && (
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: r.col,
          animation: "rs-blitz .45s ease-out forwards", pointerEvents: "none" }} />)}

      {/* Licht, das sich vor dem Umschlag sammelt */}
      {!RUHE && !auf && gross && (
        <div aria-hidden style={{ position: "absolute", width: "min(80vw,340px)", height: "min(80vw,340px)",
          borderRadius: "50%", border: "2px solid " + r.col, zIndex: 1, pointerEvents: "none",
          animation: "rs-sog " + T[1] + "ms ease-in forwards" }} />)}

      {/* Druckwelle beim Umschlag */}
      {!RUHE && auf && pomp >= .35 && (
        <div aria-hidden style={{ position: "absolute", width: "min(70vw,300px)", height: "min(70vw,300px)",
          borderRadius: "50%", border: (2 + Math.round(pomp * 3)) + "px solid " + r.col,
          zIndex: 1, pointerEvents: "none", animation: "rs-welle .9s cubic-bezier(.15,.7,.3,1) forwards" }} />)}

      {auf && gross && <Strahlen farbe={r.col} staerke={pomp} />}
      {auf && pomp >= .5 && <Konfetti farben={[r.col, "#DCE3D8", r.col, "#F2F5FA"]}
        staerke={.5 + pomp} dauer={2200 + Math.round(pomp * 1400)} />}

      <div className="eb rs-auf" style={{ color: "var(--mu)", letterSpacing: ".2em", zIndex: 3 }}>
        {auf ? (pomp >= .8 ? "DAS GIBT ES FAST NIE" : gross ? "DAS IST SELTEN" : "DEINE KARTE") : "DEINE KARTE"}
      </div>

      {/* Drei getrennte Ebenen: Perspektive · Bewegung · Drehung.
          Beben und Schweben verschieben nur, gedreht wird eine Ebene
          tiefer — so streiten sich nie zwei Vorschriften um „transform". */}
      <div style={{ perspective: 1000, zIndex: 3, position: "relative" }}>
        {stufe >= 2 && gross && <Funken farbe={r.col} anzahl={Math.round(5 + pomp * 7)} />}
        <div style={{ animation: RUHE ? "none"
            : !auf && gross ? "rs-beben .42s ease-in-out infinite"
            : stufe >= 2 && pomp >= .35 ? "rs-schweben 3.4s ease-in-out infinite" : "none",
          willChange: RUHE ? "auto" : "transform" }}>
          <div style={{ position: "relative", width: "min(78vw,320px)", height: "min(46vw,190px)",
            transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d",
            transition: RUHE ? "none" : "transform .7s cubic-bezier(.2,.85,.25,1)",
            transform: auf ? "rotateY(180deg)" : "rotateY(0deg)",
            willChange: RUHE ? "auto" : "transform" }}>

            {/* Rückseite */}
            <div style={{ position: "absolute", inset: 0,
              backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
              borderRadius: 0, border: "1px solid " + (gross ? r.col + "88" : "var(--ln2)"),
              background: "var(--pan2)", display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              boxShadow: !RUHE && gross ? "0 0 " + Math.round(14 + pomp * 46) + "px " + r.col + "55" : "none" }}>
              <span className="d" style={{ fontSize: 40, color: gross ? r.col : "var(--ln2)",
                animation: !RUHE && gross ? "rs-glanz 1.1s ease-in-out infinite" : "none" }}>?</span>
              <span className="rs-band"><i /></span>
            </div>

            {/* Vorderseite. Die Einblendung der Zeilen hängt an „auf" und
                wird danach nicht mehr angefasst — sonst begänne sie von
                vorn und der Text wäre kurz weg. */}
            <div style={{ position: "absolute", inset: 0,
              backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)", borderRadius: 0, overflow: "hidden",
              border: (1 + Math.round(pomp * 3)) + "px solid " + r.col,
              background: "linear-gradient(140deg," + r.col + (gross ? "4E" : "38") + " 0%,var(--pan) 62%)",
              boxShadow: pomp >= .5 ? "0 0 " + Math.round(24 + pomp * 80) + "px " + r.col + "80" : "none",
              padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Folie für die obersten Stufen. Liegt INNERHALB der Vorderseite und
                  fasst kein transform an — die drei Bewegungsebenen bleiben unberührt. */}
              {pomp >= .8 && (
                <span className="folie" aria-hidden="true" style={{ position: "absolute", inset: 0,
                  opacity: .17, pointerEvents: "none", zIndex: 0 }} />)}
              <div className={auf && !RUHE ? "eb rs-auf" : "eb"}
                style={{ color: r.col, letterSpacing: ".14em", animationDelay: "300ms",
                  position: "relative", zIndex: 1 }}>
                {r.name.toUpperCase()}</div>
              <div className={auf && !RUHE ? "d rs-auf" : "d"}
                style={{ fontSize: "clamp(20px,5.6vw,30px)", lineHeight: 1.08, marginTop: 4,
                  animationDelay: "390ms" }}>{card.n}</div>
              <p className={auf && !RUHE ? "rs-auf" : ""}
                style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 6,
                  animationDelay: "480ms" }}>{card.t}</p>
              {pomp >= .5 && <span className="rs-band"><i /></span>}
            </div>
          </div>
        </div>
      </div>

      {bereit
        ? <button className="btn sm rs-auf" style={{ zIndex: 3 }} onClick={() => onFertig && onFertig()}>
            <span className="m" style={{ fontSize: 11 }}>Weiter</span></button>
        : <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", opacity: .55, zIndex: 3,
            letterSpacing: ".12em" }}>{auf ? "…" : "wird aufgedeckt"}</div>}
    </div>
  );
}

function WildcardCard({ card, big, onReroll, rerollLeft, rerollN }) {
  if (!card) return null;
  const r = RARITY[card.r] || RARITY.normal;
  const nur = card.pos && card.pos.length
    ? card.pos.map((k) => (POS[k] ? POS[k].kurz || k : k)).join(", ") : null;
  return (
    <div className="pan pad klebe winkel" style={{ borderColor: r.col,
      background: "linear-gradient(140deg," + r.col + "1F 0%,var(--pan) 62%)",
      transform: RUHE ? "none" : "rotate(" + winkel(card.n) + ")" }}>
      {/* Ein Streifen hält die eine Karte fest, die dich die ganze Laufbahn begleitet. */}
      <span className="streifen" aria-hidden="true" />
      {/* Seltenheit als Material: die obersten Stufen bekommen einen Folienrand. */}
      {RARITY[card.r] && (RARITY[card.r].w === 0 || RARITY[card.r].w <= 8) && (
        <span className="folie" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0,
          height: 3, pointerEvents: "none", zIndex: 1 }} />)}
      <div className="band" style={{ background: r.col }}>
        <span>Wildcard · {r.name}</span>
        {nur && <span style={{ letterSpacing: ".08em" }}>nur {nur}</span>}
      </div>
      <div className="d" style={{ fontSize: big ? 24 : 18, color: r.col }}>{card.n}</div>
      <p style={{ fontSize: big ? 13 : 11.5, color: "var(--mu)", marginTop: 4 }}>{card.t}</p>
      {onReroll && (
        <div style={{ marginTop: 10 }}>
          {rerollLeft ? (
            <button className="btn sm" onClick={onReroll}>Karte neu ziehen{rerollN > 1 ? " (" + rerollN + " übrig)" : ""}</button>
          ) : (
            <div className="m" style={{ fontSize: 10, color: "var(--mu)" }}>
              Kein Tausch mehr — die Karte bleibt bis zum Schluss.
            </div>)}
        </div>)}
    </div>
  );
}

function Pass({ p, full, wachstum }) {
  const [c1] = clubColors(p.club);
  const [um, setUm] = useState(false);
  const letzterTipp = useRef(0);
  /* Doppeltippen. Kein onDoubleClick — das kommt in der WebView verzögert und
     verschluckt manchmal den zweiten Tipp. Zwei Berührungen unter 320 ms. */
  const tippen = () => {
    const jetzt = Date.now();
    if (jetzt - letzterTipp.current < 320) { letzterTipp.current = 0; setUm((u) => !u); haptik("wahl"); }
    else letzterTipp.current = jetzt;
  };
  const taste = (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setUm((u) => !u); }
  };

  /* Nach dem Vorbild echter Spielerpässe: Kopfband mit Verband und Passnummer,
     Lichtbild im harten Rahmen, linierte Felder, Gültigkeitsstempel.
     Die Nummer ist aus Name und Bildkern abgeleitet — gleicher Spieler,
     gleiche Nummer, ein Leben lang. */
  const nr = String(hashStr(p.name + "|" + p.avatar) % 100000000).padStart(8, "0")
    .replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3");
  const seit = p.year - (p.age - 16);

  /* Stationen für die Rückseite: aufeinanderfolgende Saisons beim selben
     Verein werden zu einer Station zusammengezogen. */
  const stationen = [];
  (p.seasons || []).forEach((sa) => {
    const letzte = stationen[stationen.length - 1];
    if (letzte && letzte.name === sa.club) {
      letzte.bis = sa.y; letzte.apps += sa.apps || 0; letzte.goals += sa.goals || 0;
    } else {
      stationen.push({ name: sa.club, ref: sa.clubRef, von: sa.y - 1, bis: sa.y,
        apps: sa.apps || 0, goals: sa.goals || 0 });
    }
  });
  const titel = (p.trophies || []).length;

  const vorderseite = (
    <div className="pan pad karton winkel" style={{ borderColor: "var(--karton2)" }}>
      <div className="band" style={{ background: "var(--tinte)", color: "var(--karton)" }}>
        <span>Spielerpass</span>
        <span className="m" style={{ letterSpacing: ".10em" }}>{nr}</span>
      </div>
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
        {/* Lichtbild — auf jedem Pass derselbe harte Rahmen */}
        <div style={{ border: "2px solid var(--tinte)", padding: 2, flexShrink: 0, background: c1 + "1A" }}>
          <Avatar seed={p.avatar} zuege={p.zuege} club={p.club} size={62} g={p.g} nat={p.nation.id} meta={p.meta} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="d" style={{ fontSize: 19, wordBreak: "break-word", display: "flex",
            alignItems: "center", gap: 7, flexWrap: "wrap", color: "var(--tinte)" }}>
            <span>{p.nation.flag} {p.name}</span>
            {p.flags.kapitaen && (
              <Binde farben={clubColors(p.club)} size={19} titel={"Kapitän von " + p.club.n} />)}
            {p.nt.kapitaen && (
              <Binde farben={landesFarben(p.nation)} size={19}
                titel={"Kapitän der Nationalmannschaft " + p.nation.name} />)}
          </div>
          {p.bei && <div className="m" style={{ fontSize: 10.5, color: "var(--go-k)", marginTop: -1 }}>{p.bei}</div>}
          <div className="passzeile" style={{ marginTop: 6 }}>
            <span className="eb">Verein</span>
            <Crest club={p.club} size={17} />
            <span className="m" style={{ fontSize: 11, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--tinte)" }}>{p.club.n}</span>
          </div>
          <div className="passzeile">
            <span className="eb">Position</span>
            <span className="m" style={{ fontSize: 11, color: "var(--tinte)" }}>
              {POS[p.pos].short} · #{p.number} · {p.foot}</span>
          </div>
          <div className="passzeile" style={{ borderBottom: 0 }}>
            <span className="eb">Spielrecht</span>
            <span className="m" style={{ fontSize: 11, color: "var(--tinte)" }}>seit {seit} · {p.age} Jahre</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="d" style={{ fontSize: 34, color: "var(--ac-k)" }}>{p.ovr}</div>
          <div className="eb">Gesamt</div>
        </div>
      </div>
      {full && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 14px",
          marginTop: 12, paddingTop: 11, borderTop: "1px solid rgba(20,23,26,.22)" }}>
          {AK.map((k) => (
            <div key={k}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="m" style={{ fontSize: 9 }}>{aLab(p.pos, k)}</span>
                <span className="m" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--tinte)" }}>{p.attrs[k]}</span>
              </div>
              <div className="bar" style={{ marginTop: 2 }}><i style={{ width: p.attrs[k] + "%", background: "var(--tinte)" }} /></div>
            </div>
          ))}
        </div>
      )}
      {full && <div className="passhinweis">Doppeltippen · Rückseite</div>}
    </div>
  );

  /* Rückseite. Auf einem echten Pass stehen dort die Vereinswechsel und die
     Stempel der Passstelle — hier also die Laufbahn selbst. */
  const rueckseite = (
    <div className="pan pad karton winkel rueckseite" style={{ borderColor: "var(--karton2)" }}>
      <div className="band" style={{ background: "var(--tinte)", color: "var(--karton)" }}>
        <span>Vereinswechsel</span>
        <span className="m" style={{ letterSpacing: ".10em" }}>{nr}</span>
      </div>
      {!stationen.length ? (
        <div style={{ fontSize: 12.5, color: "var(--tinte2)" }}>
          Noch keine Saison gespielt. Der erste Eintrag kommt im Sommer.
        </div>
      ) : (
        /* Beide Seiten liegen im selben Rasterfeld, der Pass nimmt also die
           Höhe der LÄNGEREN an. Mit jeder Station wuchs deshalb auch die
           Vorderseite, obwohl dort nichts hinzukam. Die Liste rollt jetzt
           innen: über sechs Stationen bleibt der Pass gleich hoch.
           `touchAction: pan-y` ist nötig, weil html/body auf pan-x pan-y
           stehen — ohne die Angabe schluckt die Seite das Wischen. */
        /* FESTE Höhe, nicht erst ab sieben Stationen. Der erste Versuch
           begrenzte die Liste ab sieben — bis dahin wuchs der Pass weiter, und
           weil beide Seiten im selben Rasterfeld liegen, wuchs die Vorderseite
           mit. Jetzt ist die Rückseite von der ersten Station an gleich hoch. */
        <div style={{ height: 150, overflowY: "auto", touchAction: "pan-y",
          borderTop: "1px solid rgba(20,23,26,.16)", borderBottom: "1px solid rgba(20,23,26,.16)",
          overscrollBehavior: "contain" }}>
          {stationen.map((st, i) => (
            <div key={i} className="passzeile" style={{ gap: 7 }}>
              <span className="m" style={{ flex: "0 0 auto", fontSize: 10, color: "var(--tinte2)" }}>
                {st.von === st.bis ? st.von : st.von + "–" + st.bis}</span>
              {st.ref && <Crest club={st.ref} size={16} />}
              <span className="m" style={{ fontSize: 11, color: "var(--tinte)", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap", flex: "1 1 auto" }}>{st.name}</span>
              <span className="m" style={{ fontSize: 10.5, color: "var(--tinte2)", flex: "0 0 auto" }}>
                {st.apps} Sp · {st.goals} T</span>
            </div>
          ))}
        </div>
      )}

      {stationen.length > 5 && (
        <div className="eb" style={{ marginTop: 4, textAlign: "right" }}>
          {stationen.length} Stationen · in der Liste blättern</div>)}

      <div className="m zellen" style={{ fontSize: 11, marginTop: 11 }}>
        <div><span className="eb">Stationen</span>{stationen.length}</div>
        <div><span className="eb">Spiele</span>{p.tot.apps}</div>
        <div><span className="eb">Tore</span>{p.tot.goals}</div>
        <div><span className="eb">Vorlagen</span>{p.tot.assists}</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 10, marginTop: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ borderBottom: "1px solid var(--tinte)", paddingBottom: 2 }}>
            <span className="d" style={{ fontSize: 15, color: "var(--tinte)" }}>{p.name}</span>
          </div>
          <div className="eb" style={{ marginTop: 3 }}>Unterschrift</div>
        </div>
        {titel > 0 && (
          <span className="d stempel" style={{ fontSize: 12, color: "var(--ok-k)", flexShrink: 0 }}>
            {titel} {titel === 1 ? "Titel" : "Titel"}</span>)}
        {!titel && p.nt.caps > 0 && (
          <span className="d stempel" style={{ fontSize: 12, color: "var(--ac-k)", flexShrink: 0 }}>
            {p.nt.caps} Länderspiele</span>)}
      </div>
      <div className="passhinweis">Doppeltippen · Vorderseite</div>
    </div>
  );

  if (!full) return vorderseite;
  return (
    <div className={"wender" + (um ? " um" : "")} onClick={tippen} onKeyDown={taste}
      role="button" tabIndex={0} aria-label={um ? "Rückseite des Spielerpasses. Doppeltippen zum Wenden."
        : "Spielerpass. Doppeltippen zeigt die Rückseite mit den Vereinswechseln."}
      style={{ cursor: "pointer", outlineOffset: 3 }}>
      <div className="dreh">{vorderseite}{rueckseite}</div>
    </div>
  );
}

/* ---------- Kurzanleitung ---------- */
/* Erklärt in fünf Abschnitten, wie das Spiel funktioniert. Bewusst knapp:
   wer nachschlägt, sucht eine Antwort, keinen Aufsatz. */
/* Die Anleitung. Ton: wie jemand, der dir das Spiel in der Kabine erklärt,
   nicht wie eine Bedienungsanleitung. Kurz halten — wer hier lange liest,
   spielt nicht. In 34.10 von Erklärsätzen befreit, die frühere Änderungen
   begründeten statt das Spiel zu erklären. */
const ANLEITUNG = [
  ["So läuft's", [
    ["Drei Schritte, dann Sommerpause", "Training festlegen, eine Entscheidung treffen, Saison anschauen. Weiter geht's."],
    ["Du bist der Spieler, nicht der Trainer", "Aufstellung und Einkäufe macht ein anderer. Du entscheidest, was du selbst tust."],
    ["Irgendwann ist Schluss", "Das Knie sagt Bescheid. Wann, hängt von Alter, Fitness und Verletzungen ab."]]],
  ["Deine Werte", [
    ["Stärke", "Der Schnitt aus deinen sechs Werten. Da schauen Vereine zuerst hin."],
    ["Form und Fitness", "Form schwankt von Jahr zu Jahr. Fitness geht runter, wenn du älter wirst oder dich hinlegst."],
    ["Vertrauen", "Was der Trainer von dir hält. Traut er dir nichts zu, sitzt du draußen — egal wie stark du bist."],
    ["Bekanntheit", "Entscheidet, wer anruft. Vereine, Nationaltrainer, Sponsoren."]]],
  ["Wildcards", [
    ["Eine pro Laufbahn", "Am Anfang ziehst du eine. Die bleibt bis zum Schluss und dreht an irgendwas."],
    ["Sieben Stufen", "Von Normal bis GOAT. Je seltener, desto dicker der Eingriff."],
    ["Einmal neu ziehen", "Ganz am Anfang. Danach lebst du damit."]]],
  ["Wenn es vorbei ist", [
    ["Vermächtnispunkte", "Zählen, was du geschafft hast, und bestimmen deinen Platz in der Ruhmeshalle."],
    ["Vermächtnis-Coins", "Was anderes. Damit baust du die Jugendakademie aus — die bleibt über alle Laufbahnen."],
    ["Errungenschaften", "162 Stück. Ein paar schalten Karten oder Startvorteile frei."]]],
  ["Noch was", [
    ["Bleibt alles auf dem Handy", "Kein Konto, kein Netz. Neues Gerät? Sicherung mitnehmen, unterm Zahnrad."],
    ["Spielweise und Schwierigkeit", "Stehen in den Optionen und gelten fürs nächste Mal. Eine laufende Laufbahn bleibt, wie sie gestartet ist."],
    ["Ein Spielstand", "Genau einer. Fängst du neu an, ist der alte weg — was fertig ist, steht in der Ruhmeshalle."]]],
];


function Kurzanleitung({ onZu }) {
  useZurueck(onZu);
  return (
    <div className="fade" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <div className="d" style={{ fontSize: 26 }}>Kurzanleitung</div>
        <button className="btn sm" onClick={onZu}>Zurück</button>
      </div>
      {ANLEITUNG.map(([kopf, zeilen], i) => (
        <div className="pan" key={kopf} style={{ marginTop: 12 }}>
          <div className="band matt">
            <span>{kopf}</span><span className="m">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <div className="pad" style={{ paddingTop: 10 }}>
            {zeilen.map(([t2, txt], j) => (
              <div key={t2} style={{ marginTop: j ? 11 : 0 }}>
                <div className="d" style={{ fontSize: 14.5 }}>{t2}</div>
                <p style={{ fontSize: 12.5, color: "var(--mu)", marginTop: 2 }}>{txt}</p>
              </div>))}
          </div>
        </div>))}
      <button className="btn" style={{ maxWidth: 180, marginTop: 16 }} onClick={onZu}>Zurück</button>
    </div>
  );
}

/* ---------- Optionen ---------- */
/* Alles, was man einmal einstellt und dann in Ruhe lässt: Darstellung,
   Rückmeldung, Sicherung, Rechtliches. Liegt hinter dem Zahnrad, damit das
   Titelblatt frei bleibt. */
function Optionen({ ruhe, aufRuhe, onBackup, onZu, onAnleitung, hall, aka, laeuft, meta, aufRahmen }) {
  useZurueck(onZu);
  const [vib, setVib] = useState(VIBRATION);
  const [stufe, setStufe] = useState(TEXTSTUFE);
  const [speed, setSpeed] = useState(SPEEDMODUS);
  const [schwer, setSchwer] = useState(SCHWIERIGKEIT);
  const [wach, setWachAn] = useState(WACH);
  const [loeschen, setLoeschen] = useState(false);
  const [lizenz, setLizenz] = useState(false);
  const wachGeht = wachMoeglich();

  const merken = (k, v) => { try { store.set(k, v); } catch (e) {} };

  return (
    <div className="fade" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <div className="d" style={{ fontSize: 26 }}>Optionen</div>
        <button className="btn sm" onClick={onZu}>Zurück</button>
      </div>

      <div className="pan" style={{ marginTop: 14 }}>
        <div className="band matt"><span>Spiel</span></div>
        <div className="pad" style={{ paddingTop: 9 }}>
          <span className="eb">Spielweise</span>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {[[false, "Karriere"], [true, "Speedmodus"]].map(([v, n]) => (
              <button key={n} className={"btn sm" + (speed === v ? " on" : "")} style={{ flex: 1 }}
                onClick={() => { setSpeedmodus(v); setSpeed(v);
                  merken("rasenschach:speed", v ? "1" : "0"); haptik("tipp"); }}>{n}</button>))}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 6 }}>
            {speed
              ? "Ein Ereignis je Saison, Training und Anschaffungen laufen von selbst."
              : "Alles selbst entscheiden: Training, Einkäufe, Gehaltspoker."}</p>

          <div style={{ borderTop: "1px solid var(--ln)", paddingTop: 11, marginTop: 11 }}>
            <span className="eb">Schwierigkeit</span>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {MODES.map((m) => (
                <button key={m.id} className={"btn sm" + (schwer === m.id ? " on" : "")} style={{ flex: 1 }}
                  onClick={() => { setSchwierigkeit(m.id); setSchwer(m.id);
                    merken("rasenschach:schwer", m.id); haptik("tipp"); }}>{m.name}</button>))}
            </div>
            <p style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 6 }}>
              {(MODES.find((m) => m.id === schwer) || MODES[1]).desc}</p>
          </div>

          {laeuft && (
            <div className="up pad" style={{ marginTop: 11, borderLeft: "3px solid var(--go)" }}>
              <div className="m" style={{ fontSize: 11, color: "var(--mu)" }}>
                Eine Laufbahn läuft gerade. Sie behält, womit sie gestartet ist —
                die Änderung greift erst bei der nächsten.
              </div>
            </div>)}
        </div>
      </div>

      <div className="pan" style={{ marginTop: 12 }}>
        <div className="band matt"><span>Darstellung</span></div>
        <div className="pad" style={{ paddingTop: 4 }}>
          <button className="btn" style={{ border: 0, padding: "11px 0" }}
            onClick={() => { const n = !ruhe; aufRuhe(n); merken("rasenschach:ruhe", n ? "1" : "0"); }}>
            <span className="inhalt">
              <span className="d" style={{ fontSize: 15 }}>Bewegung</span>
              <span className="punkte" />
              <span className="wert">{ruhe ? "ruhig" : "an"}</span>
            </span>
            <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block", marginTop: 2 }}>
              {ruhe ? "Karten drehen und blenden nicht mehr" : "Enthüllung, Wenden und Folie laufen"}</span>
          </button>

          <button className="btn" style={{ border: 0, padding: "11px 0", opacity: wachGeht ? 1 : .45 }}
            disabled={!wachGeht}
            onClick={() => { const n = !wach; setWach(n); setWachAn(n);
              merken("rasenschach:wach", n ? "1" : "0"); haptik("tipp"); }}>
            <span className="inhalt">
              <span className="d" style={{ fontSize: 15 }}>Bildschirm anlassen</span>
              <span className="punkte" />
              <span className="wert">{!wachGeht ? "nicht möglich" : wach ? "an" : "aus"}</span>
            </span>
            <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block", marginTop: 2 }}>
              {!wachGeht
                ? "Dieses Gerät bietet die Bildschirmsperre nicht an"
                : "Der Bildschirm geht während langer Simulationen nicht aus"}</span>
          </button>

          <div style={{ borderTop: "1px solid var(--ln)", paddingTop: 11, marginTop: 4 }}>
            <span className="eb">Anzeigegröße</span>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {["Klein", "Normal", "Groß"].map((n, i) => (
                <button key={n} className={"btn sm" + (stufe === i ? " on" : "")} style={{ flex: 1 }}
                  onClick={() => { setTextstufe(i); setStufe(i); merken("rasenschach:text", String(i)); haptik("tipp"); }}>
                  <span style={{ fontSize: [11, 12.5, 14][i] }}>{n}</span>
                </button>))}
            </div>
            <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block", marginTop: 6 }}>
              Macht alles größer: Text, Abstände und Bilder.</span>
          </div>

          {/* Rahmen. Bis 34.7 galt immer der erste freigeschaltete — man konnte
              sich nichts aussuchen, obwohl mehrere offen sein können. */}
          {(() => {
            const offen = rahmenOffen(meta);
            if (!offen.length) return (
              <div style={{ borderTop: "1px solid var(--ln)", paddingTop: 11, marginTop: 11 }}>
                <span className="eb">Rahmen um das Porträt</span>
                <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block", marginTop: 5 }}>
                  Noch keinen freigespielt. Rahmen gibt es für Errungenschaften.</span>
              </div>);
            const jetzt = (meta && meta.rahmenWahl) || offen[0];
            return (
              <div style={{ borderTop: "1px solid var(--ln)", paddingTop: 11, marginTop: 11 }}>
                <span className="eb">Rahmen um das Porträt</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7 }}>
                  {[["keiner", { n: "Keiner", c: "var(--ln2)", w: 1 }], ...offen.map((k) => [k, RAHMEN[k]])]
                    .map(([k, r]) => (
                    <button key={k} className={"btn sm" + (jetzt === k ? " on" : "")}
                      onClick={() => { aufRahmen && aufRahmen(k); haptik("tipp"); }}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span aria-hidden="true" style={{ width: 14, height: 14, flexShrink: 0,
                        border: r.w + "px solid " + r.c, background: "var(--pan2)" }} />
                      <span style={{ fontSize: 11.5 }}>{r.n}</span>
                    </button>))}
                </div>
                <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block", marginTop: 6 }}>
                  {offen.length} von {Object.keys(RAHMEN).length} freigeschaltet.</span>
              </div>);
          })()}
        </div>
      </div>

      <div className="pan" style={{ marginTop: 12 }}>
        <div className="band matt"><span>Rückmeldung</span></div>
        <div className="pad" style={{ paddingTop: 4 }}>
          <button className="btn" style={{ border: 0, padding: "11px 0" }}
            onClick={() => { const n = !vib; setVibration(n); setVib(n);
              merken("rasenschach:vib", n ? "1" : "0"); if (n) haptik("wahl"); }}>
            <span className="inhalt">
              <span className="d" style={{ fontSize: 15 }}>Vibration</span>
              <span className="punkte" />
              <span className="wert">{vib ? "an" : "aus"}</span>
            </span>
            <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block", marginTop: 2 }}>
              Kurzes Brummen bei Entscheidungen</span>
          </button>
        </div>
      </div>

      <div className="pan" style={{ marginTop: 12 }}>
        <div className="band matt"><span>Daten</span></div>
        <div className="pad" style={{ paddingTop: 4 }}>
          <button className="btn" style={{ border: 0, padding: "11px 0" }} onClick={onBackup}>
            <span className="inhalt">
              <span className="d" style={{ fontSize: 15 }}>Sicherung</span>
              <span className="punkte" />
              <span className="wert">{hall.length} Laufbahnen</span>
            </span>
            <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block", marginTop: 2 }}>
              Spielstand sichern oder zurückholen</span>
          </button>
          <div style={{ borderTop: "1px solid var(--ln)", paddingTop: 9, marginTop: 4 }}>
            {!loeschen ? (
              <button className="btn sm" onClick={() => setLoeschen(true)}
                style={{ borderColor: "var(--bad)", color: "var(--bad)" }}>Alles zurücksetzen</button>
            ) : (
              <div className="up pad" style={{ borderLeft: "3px solid var(--bad)" }}>
                <div style={{ fontSize: 12.5 }}>
                  Das löscht <b>alles</b>: laufende Laufbahn, Ruhmeshalle
                  ({hall.length}), Errungenschaften und Akademie
                  {aka && aka.gegruendet ? " („" + aka.name + "“)" : ""}. Nicht umkehrbar.
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                  <button className="btn sm" style={{ borderColor: "var(--bad)", color: "var(--bad)" }}
                    onClick={async () => {
                      for (const k of SPEICHERSCHLUESSEL) { try { await store.delete(k); } catch (e) {} }
                      try { if (typeof location !== "undefined") location.reload(); } catch (e) {}
                    }}>Ja, alles löschen</button>
                  <button className="btn sm" onClick={() => setLoeschen(false)}>Abbrechen</button>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      <div className="pan" style={{ marginTop: 12 }}>
        <div className="band matt"><span>Über</span></div>
        <div className="pad" style={{ paddingTop: 9 }}>
          <div className="m zellen" style={{ fontSize: 11 }}>
            <div><span className="eb">Fassung</span>{VERSION}</div>
            <div><span className="eb">Vereine</span>{CLUBS.length}</div>
            <div><span className="eb">Nationen</span>{NATIONS.length}</div>
            <div><span className="eb">Ereignisse</span>{EVENTS.length}</div>
          </div>
          <p style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 9 }}>{VERSION_INFO}</p>
          <button className="btn" style={{ border: 0, padding: "11px 0", marginTop: 4 }} onClick={onAnleitung}>
            <span className="inhalt">
              <span className="d" style={{ fontSize: 15 }}>Kurzanleitung</span>
              <span className="punkte" />
              <span className="wert">{ANLEITUNG.length} Abschnitte</span>
            </span>
            <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block", marginTop: 2 }}>
              Wie das Spiel läuft, in zwei Minuten</span>
          </button>
          <button className="btn sm" style={{ marginTop: 9 }} onClick={() => setLizenz((x) => !x)}>
            {lizenz ? "Schriften ausblenden" : "Verwendete Schriften"}</button>
          {lizenz && (
            <p className="m" style={{ fontSize: 10, color: "var(--mu)", marginTop: 8, lineHeight: 1.65 }}>
              Anzeigeschrift: Anton, Copyright 2020 The Anton Project Authors — verändert
              (zugeschnitten, Ziffern auf gleiche Breite). Textschrift: Archivo,
              Copyright 2020 The Archivo Project Authors — verändert (zugeschnitten).
              Beide unter der SIL Open Font License 1.1. Der Lizenztext liegt der App
              als schriften-lizenz.txt bei.
            </p>)}
        </div>
      </div>
    </div>
  );
}

/* ---------- Startbildschirm ---------- */
/* Das Titelblatt einer Ausgabe: Kopfleiste, Zeitschriftenkopf, Aufmacher,
   Inhaltsverzeichnis, Impressumsstreifen. Die Ausgabennummer zählt die
   abgeschlossenen Laufbahnen mit — jede beendete Karriere ist ein Heft. */
/* Das Titelfoto. Bewusst ohne Feinheiten: Rang, Bande, Rasenstreifen und
   eine Mannschaftsreihe als Silhouetten. Ein gezeichnetes Pressefoto, das
   nicht mit dem Porträt davor um Aufmerksamkeit streitet.

   Alles flach, keine Verläufe — dieselbe Sprache wie der Rest. Die Zuschauer
   sind ein festes Punktfeld, kein Zufall: dieselbe Ausgabe soll bei jedem
   Aufschlagen gleich aussehen. */
function Titelfoto({ laeuft }) {
  const deck = laeuft ? .15 : .34;
  /* Eine Silhouette. Die Kurve der Schultern muss um 4/3 überhöht werden:
     eine kubische Kurve mit beiden Kontrollpunkten auf gleicher Höhe erreicht
     nur drei Viertel des Wegs, sonst schwebt der Kopf über dem Körper. */
  const figur = (x, fuss, hoch, o, hocke) => {
    const kopfR = hoch * .155;
    const schulter = fuss - hoch * (hocke ? .52 : .66);
    const br = hoch * (hocke ? .30 : .24);
    const ctrl = fuss + (schulter - fuss) * (4 / 3);
    return (
      <g key={x + "-" + fuss} fill="var(--tx)" opacity={o}>
        <circle cx={x} cy={schulter - kopfR * .62} r={kopfR} />
        <path d={"M" + (x - br) + "," + fuss + " C" + (x - br) + "," + ctrl + " "
          + (x + br) + "," + ctrl + " " + (x + br) + "," + fuss + " Z"} />
      </g>);
  };
  return (
    <svg viewBox="0 0 366 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {/* Rang */}
      {[[0, 34, .10], [34, 26, .15], [60, 22, .21]].map(([y, h, o], i) =>
        <rect key={i} x="0" y={y} width="366" height={h} fill="var(--ln2)" opacity={o} />)}
      {ZUSCHAUER.map((z, i) =>
        <circle key={i} cx={z[0]} cy={z[1]} r={z[2]} fill="var(--mu)" opacity={z[3]} />)}
      {[26, 340].map((x) => (
        <g key={x}>
          <path d={"M" + x + ",82 L" + x + ",18"} stroke="var(--ln2)" strokeWidth="2" opacity=".35" />
          <rect x={x - 11} y="10" width="22" height="10" fill="var(--mu)" opacity=".5" />
        </g>))}
      {/* Bande und Rasen */}
      <rect x="0" y="82" width="366" height="9" fill="var(--ln2)" opacity=".55" />
      {[0, 1, 2, 3, 4, 5].map((i) =>
        <rect key={i} x="0" y={91 + i * 11} width="366" height="11" fill="var(--ln2)"
          opacity={i % 2 ? .07 : .12} />)}
      {/* Mannschaft: hinten stehend, vorne hockend */}
      {[0, 1, 2, 3, 4, 5].map((i) => figur(38 + i * 58, 168, 74, deck, false))}
      {[0, 1, 2, 3, 4].map((i) => figur(67 + i * 58, 200, 58, deck * 1.25, true))}
    </svg>
  );
}

/* Festes Punktfeld für die Ränge. Einmal berechnet und hier abgelegt, damit
   dieselbe Ausgabe bei jedem Aufschlagen gleich aussieht. */
const ZUSCHAUER = (() => {
  let z = 1234567;
  const w = () => { z = (z * 1103515245 + 12345) & 0x7fffffff; return z / 0x7fffffff; };
  const aus = [];
  for (let i = 0; i < 260; i++)
    aus.push([+(w() * 366).toFixed(1), +(2 + w() * 76).toFixed(1),
      +(.8 + w() * .9).toFixed(1), +(.10 + w() * .20).toFixed(2)]);
  return aus;
})();

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"];

/* Die Aufmacherzeilen. Ein Sportblatt schreibt nicht sachlich, es ruft — also
   klingen Dachzeile und Schlagzeile hier nach Kiosk und nicht nach Katalog.
   Welche Geschichte oben steht, richtet sich nach dem Spielstand: wer gerade
   spielt, ist selbst die Titelgeschichte. */
function titelgeschichte(save, laeuft, hall, aka) {
  if (laeuft) {
    const p = save.p;
    const verein = p.club ? p.club.n : "ohne Verein";
    const stadt = p.club && p.club.stadt ? p.club.stadt : verein;
    if (p.ovr >= 85) return {
      dach: "WELTKLASSE · SAISON " + p.year + "/" + String(p.year + 1).slice(2),
      schlag: "SIE NENNEN IHN\nJETZT NUR NOCH\nDEN BESTEN",
      unter: p.name + ", " + p.age + ", spielt bei " + verein + " in einer eigenen Liga. Und der Rest? Schaut zu." };
    if (p.age <= 19) return {
      dach: "DER NEUE · SAISON " + p.year + "/" + String(p.year + 1).slice(2),
      schlag: "MIT " + p.age + " SCHON\nGANZ OBEN?",
      unter: "Bei " + verein + " reden sie über niemanden sonst. " + p.name + " soll liefern — ab sofort." };
    if (p.age >= 33) return {
      dach: "DIE LETZTEN JAHRE · SAISON " + p.year + "/" + String(p.year + 1).slice(2),
      schlag: "NOCH EINMAL\nALLES ODER NICHTS",
      unter: p.name + " ist " + p.age + ". Bei " + verein + " weiß jeder: So viele Spielzeiten kommen nicht mehr." };
    return {
      dach: "TITELGESCHICHTE · SAISON " + p.year + "/" + String(p.year + 1).slice(2),
      schlag: "DER MANN,\nÜBER DEN " + (stadt || "die Stadt").toUpperCase() + "\nSPRICHT",
      unter: p.name + ", " + p.age + ", " + verein + ". Stärke " + p.ovr + " — und die Saison hat gerade erst angefangen." };
  }
  if (hall && hall.length) return {
    dach: "DAS NÄCHSTE KAPITEL",
    schlag: "WER LÖST\n" + String(hall[0].name || "IHN").toUpperCase() + "\nAB?",
    unter: "Die Ruhmeshalle steht voll. Jetzt fehlt nur noch einer: deiner." };
  if (aka && aka.gegruendet) return {
    dach: "AUS DER AKADEMIE",
    schlag: "DIE TALENTE\nSIND DA.\nUND DU?",
    unter: aka.name + " arbeitet längst. Zeit, dass oben jemand nachkommt." };
  return {
    dach: "SAISONAUFTAKT · JETZT GEHT ES LOS",
    schlag: "MIT 16 INS\nINTERNAT —\nUND DANN?",
    unter: "Trainingsschwerpunkte, Vertragspoker, Leihen, Angebote, die man besser ablehnt. Eine Laufbahn, eine Entscheidung nach der anderen." };
}

function MenuScreen({ hall, onNew, onHall, save, onResume, onAch, achN, metaN, onBackup, ruhe, setRuhe, setRuheState, aka, onAka, onLaden, meta, aufRahmen }) {
  const [ask, setAsk] = useState(false);
  const [opt, setOpt] = useState(false);
  const [anleitung, setAnleitung] = useState(false);
  const schriftBefund = useSchriftBefund();
  const ausgabe = String(hall.length + 1).padStart(2, "0");
  const laeuft = save && save.p;

  if (anleitung) return <Shell blatt="optionen" zusatz="ANLEITUNG"><Kurzanleitung onZu={() => setAnleitung(false)} /></Shell>;
  if (opt) return (
    <Shell blatt="optionen">
      <Optionen ruhe={ruhe} hall={hall} aka={aka} laeuft={!!laeuft} onBackup={onBackup}
        meta={meta} aufRahmen={aufRahmen}
        onZu={() => setOpt(false)} onAnleitung={() => setAnleitung(true)}
        aufRuhe={(n) => { setRuhe(n); setRuheState(n); }} />
    </Shell>);

  /* Eine Zeile des Inhaltsverzeichnisses. Statt einer laufenden Nummer steht
     rechts die SEITENZAHL des Ressorts — dieselbe, die der Kolumnentitel dort
     zeigt. Links ein Strich in der Ressortfarbe. */
  const zeile = (schl, titel, wert, unter, klick) => {
    const r = RESSORT[schl] || { s: "—", f: "var(--mu)" };
    return (
      <button className="btn" style={{ border: 0, borderBottom: "1px solid var(--ln)",
        padding: "11px 0 11px 10px", borderLeft: "3px solid " + r.f }} onClick={klick}>
        <span className="inhalt">
          <span className="d" style={{ fontSize: 16 }}>{titel}</span>
          <span className="punkte" />
          <span className="wert">{wert}</span>
          <span className="d" style={{ fontSize: 16, color: r.f, minWidth: 26, textAlign: "right" }}>{r.s}</span>
        </span>
        {unter && <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", display: "block",
          marginTop: 2 }}>{unter}</span>}
      </button>);
  };

  return (
    <Shell>
      <div className="fade">
        {/* Kopfleiste: Ausgabennummer links, Zahnrad rechts */}
        <div style={{ position: "relative", minHeight: 40, marginBottom: 2 }}>
          <span className="lab-kasten" style={{ display: "inline-block", background: "var(--tx)",
            color: "var(--bg)", fontWeight: 700, fontSize: 9.5, letterSpacing: ".16em",
            textTransform: "uppercase", padding: "4px 9px" }}>
            Ausgabe {ausgabe} · <span>KARRIERE-SIMULATION</span>
          </span>
          {/* Laden neben dem Zahnrad, gleiche Grösse und Form. Vorher stand er
              als Zeile „Anzeigen" im Inhaltsverzeichnis — das las sich wie ein
              Artikel des Hefts und nicht wie ein Knopf. */}
          <button className="zahnrad" onClick={() => { onLaden(); haptik("tipp"); }}
            aria-label="Vermächtnis-Laden" title="Vermächtnis-Laden"
            style={{ marginRight: 6, color: (aka && aka.vc) ? "var(--go)" : undefined }}>
            <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
              {SHOP_BILD.stern("currentColor")}
            </svg>
          </button>
          <button className="zahnrad" onClick={() => { setOpt(true); haptik("tipp"); }}
            aria-label="Optionen" title="Optionen">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3.1" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* ---- Titelzug ----
            Name und Ausgabe stehen auf jeder Ausgabe an derselben Stelle. Der
            Balken darüber ist die Ressortfarbe des Hefts. */}
        <div style={{ background: "var(--stoerer)", margin: "0 -12px", padding: "6px 12px",
          display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span className="d" style={{ fontSize: 12, letterSpacing: ".22em", color: "#fff" }}>FUSSBALL-MAGAZIN</span>
          <span className="m" style={{ fontSize: 9.5, letterSpacing: ".12em", color: "#fff", opacity: .92 }}>
            NR. {ausgabe} · {MONATE[(new Date()).getMonth()]}</span>
        </div>

        <div style={{ marginTop: 16 }}>
          <h1 className="d" style={{ fontSize: "clamp(40px,13.5vw,96px)", letterSpacing: "-.012em",
            lineHeight: .84, margin: 0 }}>RASENSCHACH</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 2 }}>
            <span className="d" style={{ fontSize: 30, color: "var(--stoerer)" }}>XI</span>
            <span className="m" style={{ fontSize: 9.5, color: "var(--mu)", letterSpacing: ".14em" }}>
              DIE ELF DES MONATS · SEIT 2026</span>
          </div>
          <div style={{ height: 2, background: "var(--ln2)", marginTop: 9 }} />
          <div style={{ height: 1, background: "var(--ln2)", marginTop: 3, opacity: .6 }} />
        </div>

        {/* ---- Aufmacher ----
            Vorher standen hier Flutlicht und Mittelkreis — ein Bild ohne
            Person. Jetzt ein Titelfoto: Rang, Bande, Rasen und eine
            Mannschaftsreihe als Silhouette, davor der eigene Spieler.

            Das Foto ist NICHT nur Schmuck. Ohne es stand das Porträt vor einer
            leeren Fläche und wirkte verloren, und ohne Spielstand war das Feld
            fast leer. Die Mannschaft gibt dem Titel einen Ort. */}
        <div style={{ position: "relative", marginTop: 14, background: "var(--pan)",
          border: "1px solid var(--ln2)", overflow: "hidden" }}>
          <Titelfoto laeuft={!!laeuft} />
          <div className="raster" aria-hidden="true" style={{ position: "absolute", inset: 0,
            color: "var(--tx)", opacity: .10, pointerEvents: "none" }} />
          {laeuft ? (
            /* Kleiner als vorher (230 → 168) und auf der Rasenlinie stehend,
               nicht schwebend: der Spieler gehört in die Mannschaft, nicht
               in die Mitte einer leeren Fläche. */
            <div style={{ position: "relative", display: "flex", justifyContent: "center",
              alignItems: "flex-end", height: 210, paddingBottom: 6 }}>
              <Avatar seed={save.p.avatar} zuege={save.p.zuege} club={save.p.club} size={168}
                g={save.p.g} nat={save.p.nation ? save.p.nation.id : null} />
            </div>
          ) : (
            <div style={{ position: "relative", height: 210, display: "flex", alignItems: "center",
              justifyContent: "flex-start", padding: "0 18px" }}>
              <span className="d" style={{ fontSize: 25, lineHeight: 1.04, letterSpacing: ".02em",
                textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>ELF PLÄTZE.<br />EINER IST<br />NOCH FREI.</span>
            </div>
          )}
          {/* Störer: schräg, laut, rund — die Hauptaktion der Seite. */}
          <button onClick={laeuft ? onResume : onNew}
            style={{ position: "absolute", right: 8, top: 8, width: 92, height: 92, borderRadius: "50%",
              border: "none", background: "var(--stoerer)", color: "#fff", cursor: "pointer",
              transform: "rotate(-11deg)", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 1, padding: 0,
              boxShadow: "3px 4px 0 rgba(0,0,0,.55)" }}>
            <span className="d" style={{ fontSize: 15, lineHeight: 1 }}>{laeuft ? "WEITER" : "NEUE"}</span>
            <span className="d" style={{ fontSize: 13, lineHeight: 1 }}>{laeuft ? "SPIELEN" : "LAUFBAHN"}</span>
            <span className="m" style={{ fontSize: 8, opacity: .92 }}>
              ab Seite {laeuft ? RESSORT.laufbahn.s : RESSORT.anlegen.s}</span>
          </button>
          {/* Bildunterschrift — gehört zu jedem Pressefoto. */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0,
            background: "rgba(9,8,6,.72)", padding: "4px 10px" }}>
            <span className="m" style={{ fontSize: 8.5, color: "var(--mu)", letterSpacing: ".08em" }}>
              {laeuft
                ? save.p.name.toUpperCase() + (save.p.club ? " · " + save.p.club.n.toUpperCase() : "")
                : "ARCHIVBILD · KURZ VOR DEM ANPFIFF"}</span>
          </div>
        </div>

        {/* ---- Dachzeile · Schlagzeile · Unterzeile ---- */}
        {(() => {
          const g = titelgeschichte(save, laeuft, hall, aka);
          return (<div style={{ marginTop: 15 }}>
            <div className="m" style={{ fontSize: 10, color: "var(--go)", letterSpacing: ".18em" }}>{g.dach}</div>
            {/* whiteSpace pre-line: die Umbrüche in der Schlagzeile sind
                gesetzt, nicht zufällig — eine Schlagzeile bricht dort, wo der
                Sinn bricht. */}
            <div className="d" style={{ fontSize: "clamp(27px,8.4vw,44px)", lineHeight: .96,
              marginTop: 5, whiteSpace: "pre-line" }}>{g.schlag}</div>
            <div className="m" style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 7, lineHeight: 1.5 }}>
              {g.unter}</div>
          </div>);
        })()}

        {/* Inhaltsverzeichnis. Die Seitenzahlen kommen aus RESSORT — dieselbe
            Zahl, die der Kolumnentitel der jeweiligen Seite zeigt. */}
        <div style={{ height: 1, background: "var(--ln2)", margin: "20px 0 0", opacity: .6 }} />
        <div className="eb" style={{ margin: "14px 0 2px" }}>In dieser Ausgabe</div>
        <div style={{ borderTop: "2px solid var(--ln2)" }}>
          {laeuft && !ask && zeile("anlegen", "Neue Laufbahn", "ersetzt den Spielstand", null, () => setAsk(true))}
          {ask && (
            <div className="up pad" style={{ borderLeft: "3px solid var(--bad)", margin: "9px 0" }}>
              <div style={{ fontSize: 12.5 }}>
                Der gespeicherte Spielstand von {save && save.p ? save.p.name : "—"} wird dabei gelöscht.
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                <button className="btn sm" onClick={() => { setAsk(false); onNew(); }}>Ja, neu anfangen</button>
                <button className="btn sm" onClick={() => setAsk(false)}>Abbrechen</button>
              </div>
            </div>)}
          {zeile("erfolge", "Errungenschaften", achN + " / " + ACHIEVEMENTS.length,
            metaN + " Belohnungen freigeschaltet", onAch)}
          {zeile("hall", "Ruhmeshalle", String(hall.length),
            hall.length ? "Bester Lauf: " + hall[0].score + " Punkte" : "noch keine Laufbahn beendet", onHall)}
          {zeile("akademie", "Jugendakademie", (aka && aka.gegruendet ? (aka.vc || 0) + " VC" : "geschlossen"),
            aka && aka.gegruendet
              ? aka.name + " · " + ((aka.bilanz && aka.bilanz.profis) || 0) + " Profis"
              : ((aka && aka.vc ? aka.vc + " VC liegen bereit — " : "") + "noch nicht gegründet"), onAka)}
        </div>

        {/* Impressumsstreifen */}
        <div className="impressum">
          <span className="strichcode" aria-hidden="true" />
          <span className="m" style={{ fontSize: 9.5, color: "var(--mu)", lineHeight: 1.7, flex: 1 }}>
            {NAME} · Fassung {VERSION}{schriftBefund} · {CLUBS.length} Vereine · {NATIONS.length} Nationen
            · {EVENTS.length} Ereignisse
          </span>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- Spielererstellung (eigener Zustand: Tastatur bleibt offen) ---------- */
/* Dreht einen bestimmten Abschnitt der Porträtkennung weiter — so lassen
   sich einzelne Merkmale ändern, ohne alles neu zu würfeln.            */
function bitDrehen(seed, bit, n, richtung) {
  if (n <= 1) return seed;
  const h = Math.abs(seed | 0);
  const alt = (h >> bit) % n;
  const neu = ((alt + richtung) % n + n) % n;
  return h + (neu - alt) * Math.pow(2, bit);
}

/* Reihenfolge der Regler in der Feineinstellung. Was einen Namen hat, zeigt
   ihn an — „Frisur 7/12" allein sagt niemandem, was er einstellt. */
const PORTRAET_REGLER = (g) => [
  ["Kopfform", "kopf", (z) => (KOPFFORM[z.kopf] || {}).n],
  ["Hautton", "haut", null],
  ["Haarfarbe", "haar", null],
  ["Frisur", "frisur", null],
  ...(g === "w" ? [] : [["Bartwuchs", "bart", null]]),
  ["Augenform", "augen", null],
  ["Augenfarbe", "augenfarbe", (z) => (AUGENFARBE[z.augenfarbe] || {}).n],
  ["Augenbrauen", "brauen", null],
  ["Nase", "nase", null],
  ["Mund", "mund", null],
  ["Ohren", "ohren", null],
  ["Wangen und Kinn", "wangen", null],
  ["Schmuck", "schmuck", null],
];

function CreateScreen({ onStart, onBack, meta }) {
  useZurueck(onBack);
  const [name, setName] = useState("");
  const [nation, setNation] = useState("GER");
  const [pos, setPos] = useState("ZM");
  const [foot, setFoot] = useState("rechts");
  const [number, setNumber] = useState("8");
  const [type, setType] = useState("techniker");
  const mode = SCHWIERIGKEIT, speed = SPEEDMODUS;   // aus den Optionen, nicht hier gewählt
  const [gender, setGender] = useState("m");
  const [bei, setBei] = useState("");
  const [traum, setTraum] = useState(null);
  const [suche, setSuche] = useState("");
  /* Vereine für die Wunschauswahl: passend zum Geschlecht, nach Stärke sortiert */
  const traumTreffer = useMemo(() => {
    const q = suche.trim().toLowerCase();
    if (q.length < 2) return [];
    return CLUBS.filter((c) => c.g === gender && c.n.toLowerCase().includes(q))
      .sort((a, b) => b.s - a.s).slice(0, 8);
  }, [suche, gender]);
  const beinamen = ["mk_bei1", "mk_bei2", "mk_bei3"].filter((k) => meta && meta[k])
    .flatMap((k) => BEINAMEN[k] || []);
  const [avatar, setAvatar] = useState(() => ri(1, 999999));
  /* Der Name ist ein VORSCHLAG, solange nichts Eigenes getippt wurde. Er
     wechselt mit Herkunft und Geschlecht mit; sobald jemand selbst schreibt,
     bleibt sein Name stehen — auch beim Wechsel der Herkunft. */
  const [eigenerName, setEigenerName] = useState(false);
  /* Die Merkmale liegen einzeln vor. Jeder Regler ändert genau eines —
     das ist der Grund, warum die Feineinstellung nicht mehr würfelt. */
  const [zuege, setZuege] = useState(() => zuegeAusKennung(ri(1, 999999), "m", "GER", meta));
  /* Herkunft oder Geschlecht gewechselt: Hautton und Haarfarbe müssen in den
     Rahmen der neuen Herkunft, sonst stünde ein Wert dort, den die Regler gar
     nicht erreichen können. Alles andere bleibt, wie es eingestellt war. */
  useEffect(() => {
    if (!eigenerName) setName(namensVorschlag(nation, gender, avatar));
  }, [nation, gender, avatar, eigenerName]);
  useEffect(() => {
    setZuege((z) => {
      const T = hautBereich(nation), H = haarBereich(nation);
      const A = ZUEGE_ANZAHL(meta, gender === "w");
      const n = { ...z, haut: clamp(z.haut, T[0], T[1]), haar: clamp(z.haar, H[0], H[1]) };
      Object.keys(A).forEach((k) => { if (n[k] >= A[k]) n[k] = A[k] - 1; });
      if (gender === "w") n.bart = 0;
      return n;
    });
  }, [nation, gender]);
  const [fein, setFein] = useState(false);
  const [statur, setStatur] = useState("normal");
  const [club, setClub] = useState(null);
  const nat = NATIONS.find((n) => n.id === nation) || NATIONS[0];
  /* Nach einem Positionswechsel muss der Spielertyp dazu passen */
  useEffect(() => {
    const ok = typesFor(pos);
    if (!ok.some((t) => t.id === type)) setType(ok[0].id);
  }, [pos]);
  /* Jugendvereine: zufällige, aber zur Herkunft und zum Geschlecht passende Auswahl */
  const [seed, setSeed] = useState(() => ri(1, 999999));
  const jugend = useMemo(() => {
    const lg = homeLeagues(nation, gender);
    const pool = CLUBS.filter((c) => c.g === gender && lg.includes(c.l) && c.s <= (gender === "w" ? 78 : 70));
    const src = pool.length >= 4 ? pool : CLUBS.filter((c) => c.g === gender && lg.includes(c.l));
    /* Feste, aber pseudozufällige Auswahl: gleiche Nation und gleiches
       Geschlecht ergeben immer dieselben Vereine — kein Neuwürfeln.    */
    let h = 2166136261;
    const misch = (t) => { for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } };
    misch(nation + "|" + gender + "|" + seed);
    const rndFest = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return Math.abs(h % 100000) / 100000; };
    const list = [...src].sort(() => rndFest() - .5).slice(0, 5);
    /* Ein bis zwei Vereine aus dem Ausland, die zur Herkunft passen:
       gleicher Sprachraum, gemeinsame Geschichte oder Nachbarschaft.    */
    const fremd = CLUBS.filter((c) => c.g === gender && !lg.includes(c.l)
      && c.c !== nation && c.s <= (gender === "w" ? 76 : 68)
      && !list.some((x) => x.n === c.n)
      && (SPHERE[c.c] === SPHERE[nation] || TIE_SET[nation + ">" + c.c]
          || (NAT_CONF[c.c] === NAT_CONF[nation] && CLIMATE[c.c] === CLIMATE[nation])));
    const zusatz = [...fremd].sort(() => rndFest() - .5).slice(0, fremd.length >= 2 ? 2 : fremd.length);
    return [...list, ...zusatz].sort((a, b) => b.s - a.s);
  }, [nation, gender, seed]);
  useEffect(() => { setClub(jugend.length ? jugend[jugend.length - 1].n : null); }, [jugend]);
  return (
    <Shell blatt="anlegen">
      <div className="fade">
        <div className="d" style={{ fontSize: 26 }}>Spielerpass anlegen</div>
        {/* Der Vorschaublock bleibt beim Blättern oben hängen. Sonst stellt man
            unten Feinheiten ein, ohne zu sehen, was sie am Gesicht bewirken —
            und dasselbe gilt für Verein (Trikotfarben) und Name.
            `.pan` bringt `position:relative` mit; die Angabe hier sticht sie
            aus, weil sie direkt am Element steht. Der Grund ist deckend, sonst
            läge der Text darunter durch. */}
        <div className="pan pad" style={{ marginTop: 12, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap",
          position: "sticky", top: 0, zIndex: 5, borderBottomWidth: 2, background: "var(--pan)" }}>
          <Avatar zuege={zuege} seed={avatar} club={CLUBS.find((c) => c.n === club) || null} size={86} ring="var(--ln2)" g={gender} nat={nation} meta={meta} />
          <div style={{ flex: 1, minWidth: 180 }}>
            <div className="d" style={{ fontSize: 20 }}>{nat.flag} {name.trim() || "Der Namenlose"}</div>
            <div className="m" style={{ fontSize: 11, color: "var(--mu)", marginTop: 4 }}>
              {POS[pos].label} · {foot} · Rückennummer {number || "—"}
            </div>
            {club && <div className="m" style={{ fontSize: 10.5, color: "var(--go)", marginTop: 3 }}>{club}</div>}
            <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
              <button className="btn sm" onClick={() => { const k = ri(1, 999999); setAvatar(k);
                setZuege(zuegeAusKennung(k, gender, nation, meta)); }}>Neu würfeln</button>
              <button className="btn sm" onClick={() => setFein(!fein)}>
                <span className="m" style={{ fontSize: 11 }}>{fein ? "Feinheiten zu" : "Feinheiten"}</span></button>
            </div>
          </div>
        </div>

        {fein && (
          <div className="pan pad" style={{ marginTop: 10 }}>
            <div className="eb" style={{ marginBottom: 8 }}>Porträt anpassen</div>
            <div className="g2">
              {PORTRAET_REGLER(gender).map(([lbl, feld, wert]) => {
                const anz = ZUEGE_ANZAHL(meta, gender === "w");
                const spanne = feld === "haut" ? hautBereich(nation) : feld === "haar" ? haarBereich(nation) : null;
                const n = spanne ? spanne[1] - spanne[0] + 1 : (anz[feld] || 1);
                const jetzt = spanne ? zuege[feld] - spanne[0] + 1 : (zuege[feld] || 0) + 1;
                return (
                  <div key={feld} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span className="m" style={{ fontSize: 11, color: "var(--mu)" }}>
                      {lbl}{wert ? " · " + wert(zuege) : ""}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span className="m" style={{ fontSize: 9.5, color: "var(--ln2)", minWidth: 30, textAlign: "right" }}>
                        {n > 1 ? jetzt + "/" + n : "—"}</span>
                      <button className="btn sm" style={{ padding: "4px 10px" }} disabled={n <= 1}
                        onClick={() => setZuege((z) => zugDrehen(z, feld, -1, gender, nation, meta))}>‹</button>
                      <button className="btn sm" style={{ padding: "4px 10px" }} disabled={n <= 1}
                        onClick={() => setZuege((z) => zugDrehen(z, feld, 1, gender, nation, meta))}>›</button>
                    </div>
                  </div>);
              })}
            </div>
            <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginTop: 9 }}>
              Hautton und Haarfarbe bleiben im Rahmen deiner Herkunft. Jeder Regler ändert
              genau eine Sache, der Rest bleibt, wie er ist.
            </div>
          </div>)}

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", marginTop: 12 }}>
          <div style={{ gridColumn: "span 2" }}>
            <div className="eb" style={{ marginBottom: 5 }}>Name</div>
            <input className="inp" value={name} maxLength={22} placeholder="z. B. Kevin Sarantis"
              onChange={(e) => { setName(e.target.value);
                /* Ab dem ersten eigenen Zeichen bleibt der Name stehen. Leert
                   man das Feld wieder, greift der Vorschlag erneut. */
                setEigenerName(e.target.value.trim().length > 0); }}
              autoComplete="off" />
            <span className="m" style={{ fontSize: 10, color: "var(--mu)", display: "block", marginTop: 3 }}>
              {eigenerName ? "Bleibt deiner, auch wenn du die Herkunft wechselst."
                : "Vorschlag zur Herkunft. Einfach überschreiben."}</span>
          </div>
          <div>
            <div className="eb" style={{ marginBottom: 5 }}>Nummer</div>
            <input className="inp m" inputMode="numeric" value={number} maxLength={2}
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))} />
          </div>
          <div>
            <div className="eb" style={{ marginBottom: 5 }}>Starker Fuß</div>
            <select className="sel" value={foot} onChange={(e) => setFoot(e.target.value)}>
              <option value="rechts">rechts</option><option value="links">links</option><option value="beidfüßig">beidfüßig</option>
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <div className="eb" style={{ marginBottom: 5 }}>Nation</div>
            <select className="sel" value={nation} onChange={(e) => setNation(e.target.value)}>
              {["UEFA","CONMEBOL","CONCACAF","CAF","AFC","OFC"].map((cf) => (
                <optgroup key={cf} label={CONF_LABEL[cf]}>
                  {NATIONS.filter((n) => n.conf === cf).map((n) =>
                    <option key={n.id} value={n.id}>{n.flag} {n.name}</option>)}
                </optgroup>))}
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <div className="eb" style={{ marginBottom: 5 }}>Position</div>
            <select className="sel" value={pos} onChange={(e) => setPos(e.target.value)}>
              {Object.keys(POS).map((k) => <option key={k} value={k}>{POS[k].short} — {POS[k].label}</option>)}
            </select>
          </div>
        </div>

        {beinamen.length > 0 && (<>
          <div className="eb" style={{ margin: "18px 0 6px" }}>Beiname</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <button className={"btn sm" + (bei === "" ? " on" : "")} onClick={() => setBei("")}>ohne</button>
            {beinamen.map((b) => (
              <button key={b} className={"btn sm" + (bei === b ? " on" : "")} onClick={() => setBei(b)}>{b}</button>))}
          </div>
        </>)}
        <div className="eb" style={{ margin: "18px 0 6px" }}>Geschlecht</div>
        <div className="g2">
          {[["m","Männerfußball","Größere Etats, mehr Ligen, härtere Konkurrenz."],
            ["w","Frauenfußball","Kleinere Etats, engere Spitze, andere Wettbewerbe."]].map(([k, t, h]) => (
            <button key={k} className={"btn" + (gender === k ? " on" : "")} onClick={() => setGender(k)}>
              <div className="d" style={{ fontSize: 15, color: gender === k ? "var(--ac)" : "var(--tx)" }}>{t}</div>
              <div style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 2 }}>{h}</div>
            </button>))}
        </div>

        <div className="eb" style={{ margin: "18px 0 6px" }}>Jugendverein</div>
        <div className="g2">
          {jugend.map((c) => (
            <button key={c.n} className={"btn" + (club === c.n ? " on" : "")} onClick={() => setClub(c.n)}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Crest club={c} size={26} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="d" style={{ fontSize: 14, color: club === c.n ? "var(--ac)" : "var(--tx)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.n}</div>
                  <div className="m" style={{ fontSize: 10, color: "var(--mu)" }}>{c.l} · Stärke {c.s}</div>
                </div>
              </div>
            </button>))}
          {!jugend.length && <div style={{ fontSize: 12, color: "var(--mu)" }}>Dazu passt gerade kein Verein.</div>}
        </div>

        <div className="eb" style={{ margin: "18px 0 6px" }}>Wunschverein</div>
        <div style={{ fontSize: 11.5, color: "var(--mu)", marginBottom: 7 }}>
          Musst du nicht. Der Verein klopft im Lauf der Jahre ein- bis dreimal an —
          sofern du sportlich dorthin passt.
        </div>
        {traum ? (() => { const c = CLUBS.find((x) => x.n === traum); return (
          <div className="pan pad" style={{ borderColor: "var(--go)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {c && <Crest club={c} size={30} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="d" style={{ fontSize: 15, color: "var(--go)" }}>{traum}</div>
                {c && <div className="m" style={{ fontSize: 10, color: "var(--mu)" }}>{c.l} · Stärke {c.s}</div>}
              </div>
              <button className="btn sm" onClick={() => { setTraum(null); setSuche(""); }}>
                <span className="m" style={{ fontSize: 10 }}>ändern</span></button>
            </div>
          </div>); })() : (<>
          <input value={suche} onChange={(e) => setSuche(e.target.value)} placeholder="Verein suchen, z. B. Hamburger"
            style={{ width: "100%", background: "var(--pan2)", color: "var(--tx)", border: "1px solid var(--ln)",
              borderRadius: 0, padding: "8px 10px", fontSize: 13 }} />
          {traumTreffer.length > 0 && (
            <div className="g2" style={{ marginTop: 7 }}>
              {traumTreffer.map((c) => (
                <button key={c.n} className="btn" onClick={() => setTraum(c.n)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <Crest club={c} size={24} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d" style={{ fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.n}</div>
                      <div className="m" style={{ fontSize: 9.5, color: "var(--mu)" }}>{c.l} · Stärke {c.s}</div>
                    </div>
                  </div>
                </button>))}
            </div>)}
          {suche.trim().length >= 2 && !traumTreffer.length && (
            <div style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 6 }}>Kein Verein gefunden.</div>)}
        </>)}

        <div className="eb" style={{ margin: "18px 0 6px" }}>Spielertyp</div>
        <div className="g3">
          {typesFor(pos).map((t) => (
            <button key={t.id} className={"btn" + (type === t.id ? " on" : "")} onClick={() => setType(t.id)}>
              <div className="d" style={{ fontSize: 14.5, color: type === t.id ? "var(--ac)" : "var(--tx)" }}>{t.name}</div>
              <div style={{ fontSize: 11, color: "var(--mu)", marginTop: 2 }}>{t.desc}</div>
            </button>
          ))}
        </div>

        <div className="eb" style={{ margin: "18px 0 6px" }}>Statur</div>
        <div className="g3">
          {[["schlank", "Schlank", "Wendig und ausdauernd, im Zweikampf leichter zu verdrängen.", { pac:3, phy:-3 }],
            ["normal", "Normal", "Ausgeglichen gebaut, ohne Ausschläge nach oben oder unten.", {}],
            ["kraftvoll", "Kraftvoll", "Schwer vom Ball zu trennen, dafür einen Schritt langsamer.", { phy:4, pac:-3 }],
            ["hochgewachsen", "Hochgewachsen", "Bei Standards eine Waffe, in engen Räumen unhandlicher.", { phy:3, sho:1, dri:-3 }]].map(([k, t, h]) => (
            <button key={k} className={"btn" + (statur === k ? " on" : "")} onClick={() => setStatur(k)}>
              <div className="d" style={{ fontSize: 14, color: statur === k ? "var(--ac)" : "var(--tx)" }}>{t}</div>
              <div style={{ fontSize: 11, color: "var(--mu)", marginTop: 2 }}>{h}</div>
            </button>))}
        </div>

        {/* Spielweise und Schwierigkeit werden nicht mehr hier gewählt — sie
            stehen in den Optionen und gelten für alle Laufbahnen. Hier steht
            nur noch, womit gespielt wird. */}
        <div className="eb" style={{ margin: "18px 0 6px" }}>Womit du spielst</div>
        <div className="m zellen" style={{ fontSize: 11.5 }}>
          <div><span className="eb">Spielweise</span>{speed ? "Speedmodus" : "Karriere"}</div>
          <div><span className="eb">Schwierigkeit</span>
            {(MODES.find((m) => m.id === mode) || MODES[1]).name}</div>
        </div>
        <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginTop: 5 }}>
          Beides änderst du im Hauptmenü unter dem Zahnrad. Für die laufende Laufbahn
          bleibt es dann so, wie es beim Start stand.
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button className="btn pri" style={{ maxWidth: 200 }}
            onClick={() => onStart({ name, nation, pos, foot, zuege, number: clamp(parseInt(number || "1", 10) || 1, 1, 99),
              type, mode, avatar, gender, club, bei, speed, traum, statur })}>
            <span className="d" style={{ fontSize: 17 }}>Los geht's</span>
          </button>
          <button className="btn" style={{ maxWidth: 120 }} onClick={onBack}>Zurück</button>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- Tabelle und Wettbewerbe ---------- */
function CompetitionView({ p }) {
  const seasons = p.seasons;
  const [idx, setIdx] = useState(seasons.length - 1);
  useEffect(() => { setIdx(seasons.length - 1); }, [seasons.length]);
  if (!seasons.length) return <div style={{ fontSize: 12.5, color: "var(--mu)" }}>Die erste Saison steht noch aus.</div>;
  const s = seasons[clamp(idx, 0, seasons.length - 1)];
  if (!s.table) return <div style={{ fontSize: 12.5, color: "var(--mu)" }}>Für diese Saison gibt es keine Tabelle.</div>;
  return (
    <div className="g1">
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <select className="sel" style={{ maxWidth: 200, minHeight: 36, fontSize: 13 }} value={idx}
          onChange={(e) => setIdx(parseInt(e.target.value, 10))}>
          {seasons.map((x, i) => <option key={i} value={i}>{x.year} · {x.club}</option>)}
        </select>
        <span className="chip a">{s.league}</span>
        {s.move && <span className={"chip " + (s.move.dir === "auf" ? "g" : "r")}>{s.move.dir === "auf" ? "Aufstieg" : "Abstieg"}</span>}
      </div>

      <div className="pan" style={{ padding: 8 }}>
        <div className="eb" style={{ padding: "2px 4px 8px" }}>Abschlusstabelle {s.league} {s.year}</div>
        <div className="sc">
          <table className="led">
            <thead><tr><th>#</th><th>Verein</th><th className="r">Sp</th><th className="r">S</th><th className="r">U</th><th className="r">N</th><th className="r">Tore</th><th className="r">Diff</th><th className="r">Pkt</th></tr></thead>
            <tbody>
              {s.table.map((r) => {
                const z = zoneOf(s.league, r.pos, s.table.length);
                return (
                  <tr key={r.pos} style={{ background: r.me ? "rgba(110,147,190,.10)" : undefined }}>
                    <td style={{ borderLeft: "3px solid " + (z ? ZONE[z].c : "transparent"), paddingLeft: 6, color: "var(--mu)" }}>{r.pos}</td>
                    <td style={{ maxWidth: 190, overflow: "hidden", textOverflow: "ellipsis" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Crest club={r.club} size={16} />
                        <span style={{ color: r.me ? "var(--ac)" : "var(--tx)", fontWeight: r.me ? 600 : 400 }}>{r.club.n}</span>
                      </span>
                    </td>
                    <td className="r">{r.games}</td><td className="r">{r.w}</td><td className="r">{r.d}</td><td className="r">{r.l}</td>
                    <td className="r">{r.gf}:{r.ga}</td>
                    <td className="r" style={{ color: r.gf - r.ga > 0 ? "var(--ok)" : r.gf - r.ga < 0 ? "var(--bad)" : "var(--mu)" }}>{sgn(r.gf - r.ga)}{r.gf - r.ga}</td>
                    <td className="r" style={{ color: "var(--ac)", fontWeight: 600 }}>{r.pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "9px 4px 2px" }}>
          {[...new Set(s.table.map((r) => zoneOf(s.league, r.pos, s.table.length)).filter(Boolean))].map((z) => (
            <span key={z} className="m" style={{ fontSize: 9.5, color: "var(--mu)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <i style={{ width: 8, height: 8, borderRadius: 0, background: ZONE[z].c, display: "inline-block" }} />{ZONE[z].t}
            </span>
          ))}
        </div>
      </div>

      {s.comps && s.comps.length > 0 && (
        <div className="pan" style={{ padding: 8 }}>
          <div className="eb" style={{ padding: "2px 4px 8px" }}>Deine Bilanz {s.year} nach Wettbewerb</div>
          <div className="sc">
            <table className="led">
              <thead><tr><th>Wettbewerb</th><th className="r">Sp</th><th className="r">{s.pos === "TW" ? "ZN" : "Tore"}</th><th className="r">Vor</th><th>Abschneiden</th></tr></thead>
              <tbody>
                {s.comps.map((c) => (
                  <tr key={c.key}>
                    <td>{c.name}</td><td className="r">{c.apps}</td>
                    <td className="r">{s.pos === "TW" ? c.cs : c.goals}</td><td className="r">{c.assists}</td>
                    <td style={{ color: "var(--mu)" }}>
                      {c.key === "liga" ? "Platz " + s.rank + " von " + s.N
                        : c.key === "pokal" ? (s.cup.won ? "Pokalsieger" : "raus im " + (s.cup.out || "—"))
                        : s.eu ? (s.eu.won ? "Titel" : "raus im " + (s.eu.out || "—")) : "—"}
                    </td>
                  </tr>))}
                {(s.ntCaps > 0 || s.ntMajor) && (
                  <tr>
                    <td style={{ color: "var(--go)" }}>Nationalmannschaft</td>
                    <td className="r">{s.ntCaps}</td><td className="r">{s.ntGoals}</td><td className="r">—</td>
                    <td style={{ color: "var(--mu)" }}>{s.ntMajor ? s.ntMajor.turnier + ": " + s.ntMajor.res : (s.ntLevel === "A" ? "A-Team" : s.ntLevel)}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>)}

      <div className="g2">
        <div className="pan pad">
          <div className="eb" style={{ marginBottom: 7 }}>{s.cup.name}</div>
          {s.cup.path.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", borderBottom: "1px solid var(--ln)" }}>
              <span className="m" style={{ fontSize: 9.5, color: "var(--mu)", width: 84, flexShrink: 0 }}>{r.round}</span>
              <Crest club={r.opp} size={16} />
              <span style={{ fontSize: 11.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.opp.n}</span>
              <span className="m" style={{ fontSize: 11.5, color: r.won ? "var(--ok)" : "var(--bad)" }}>{r.s}</span>
            </div>
          ))}
          <div className="m" style={{ fontSize: 11, marginTop: 8, color: s.cup.won ? "var(--go)" : "var(--mu)" }}>
            {s.cup.won ? "Pokalsieger." : "Ausgeschieden: " + (s.cup.out || "—")}
          </div>
        </div>

        <div className="pan pad">
          <div className="eb" style={{ marginBottom: 7 }}>{s.europe || "Kein internationaler Wettbewerb"}</div>
          {!s.eu ? (
            <div style={{ fontSize: 12, color: "var(--mu)" }}>Diese Saison international nicht dabei.</div>
          ) : (
            <>
              <div className="m" style={{ fontSize: 11, color: "var(--mu)", marginBottom: 6 }}>
                Gruppen-/Ligaphase: {s.eu.pts} Punkte · Platz {s.eu.pos}
              </div>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 8 }}>
                {s.eu.lg.map((m, i) => (
                  <span key={i} className="m" title={m.opp.n + " " + m.s}
                    style={{ fontSize: 9.5, width: 22, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 0, background: m.r === "S" ? "rgba(76,143,110,.25)" : m.r === "U" ? "var(--up)" : "rgba(150,71,63,.25)",
                      color: m.r === "S" ? "var(--ok)" : m.r === "U" ? "var(--mu)" : "var(--bad)" }}>{m.r}</span>
                ))}
              </div>
              {s.eu.path.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", borderBottom: "1px solid var(--ln)" }}>
                  <span className="m" style={{ fontSize: 9.5, color: "var(--mu)", width: 84, flexShrink: 0 }}>{r.round}</span>
                  <Crest club={r.opp} size={16} />
                  <span style={{ fontSize: 11.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.opp.n}</span>
                  <span className="m" style={{ fontSize: 11.5, color: r.won ? "var(--ok)" : "var(--bad)" }}>{r.s}</span>
                </div>
              ))}
              <div className="m" style={{ fontSize: 11, marginTop: 8, color: s.eu.won ? "var(--go)" : "var(--mu)" }}>
                {s.eu.won ? "Titel gewonnen." : "Ausgeschieden: " + (s.eu.out || "—")}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Diagramme: selbst gezeichnet, ohne externe Bibliothek ----------
   Bewusst ohne Diagrammbibliothek, damit die Statistik nicht von einem
   fremden Paket abhängt und in jeder Umgebung identisch aussieht.        */
const GRID = "#171B26", MUT = "#636B7C";
function useBoxWidth(ref, fallback) {
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const upd = () => {
      try { const c = ref.current && ref.current.clientWidth; if (c && c > 60) setW(c); } catch (e) { /* Messung nicht möglich */ }
    };
    upd();
    let t = setTimeout(upd, 60);
    let on = false;
    try { if (typeof window !== "undefined" && window.addEventListener) { window.addEventListener("resize", upd); on = true; } }
    catch (e) { /* kein Fenster verfügbar */ }
    return () => { clearTimeout(t); try { if (on) window.removeEventListener("resize", upd); } catch (e) {} };
  }, []);
  return w;
}
const labelIdx = (n, max) => {
  if (n <= max) return Array.from({ length: n }, (_, i) => i);
  const out = [];
  for (let k = 0; k < max; k++) out.push(Math.round((k * (n - 1)) / (max - 1)));
  return [...new Set(out)];
};

/* Zwei Linien mit getrennten Achsen: Gesamtstärke links, Marktwert rechts */
function CurveChart({ rows }) {
  const ref = useRef(null);
  const w = useBoxWidth(ref, 320);
  const H = 156, L = 26, R = 40, T = 14, B = 20;
  const iw = Math.max(60, w - L - R), ih = H - T - B;
  const n = rows.length;
  const px = (i) => L + (n <= 1 ? iw / 2 : (i * iw) / (n - 1));
  const av = rows.map((r) => r.ovr), bv = rows.map((r) => r.mv);
  const aLo = Math.max(20, Math.floor((Math.min(...av) - 4) / 5) * 5);
  const aHi = Math.min(99, Math.max(aLo + 10, Math.ceil((Math.max(...av) + 4) / 5) * 5));
  const aR = aHi - aLo;
  const bHi = Math.max(Math.max(...bv), .1) * 1.15;
  const ay = (v) => T + ih * (1 - clamp((v - aLo) / aR, 0, 1));
  const by = (v) => T + ih * (1 - clamp(v / bHi, 0, 1));
  const line = (vals, fy) => vals.map((v, i) => (i ? "L" : "M") + px(i).toFixed(1) + " " + fy(v).toFixed(1)).join(" ");
  const idx = labelIdx(n, w < 300 ? 4 : 6);
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width={w} height={H} style={{ display: "block", overflow: "visible" }} role="img" aria-label="Gesamtstärke und Marktwert je Saison">
        {[0, .25, .5, .75, 1].map((t, i) => {
          const y = T + ih * t, v = Math.round(aHi - aR * t);
          return (<g key={i}>
            <line x1={L} y1={y} x2={L + iw} y2={y} stroke={GRID} strokeDasharray="2 5" />
            <text x={L - 5} y={y + 3} textAnchor="end" fontSize="9.5" fill={MUT} fontFamily="'Rasen Text',Roboto,sans-serif">{v}</text>
          </g>);
        })}
        <text x={L + iw + 5} y={T + 3} fontSize="9.5" fill="#E8B84B" fontFamily="'Rasen Text',Roboto,sans-serif">{eur(bHi)}</text>
        <text x={L + iw + 5} y={T + ih + 3} fontSize="9.5" fill="#E8B84B" fontFamily="'Rasen Text',Roboto,sans-serif">0</text>
        {/* Die Kurven zeichnen sich beim Öffnen von links nach rechts auf */}
        {n > 1 && <path className="rs-linie" style={{ "--len": iw * 2.2 }} d={line(bv, by)}
          fill="none" stroke="#E8B84B" strokeWidth="1.4" strokeLinejoin="round" />}
        {n > 1 && <path className="rs-linie" style={{ "--len": iw * 2.2, animationDelay: ".22s" }} d={line(av, ay)}
          fill="none" stroke="#5E9BD8" strokeWidth="1.9" strokeLinejoin="round" />}
        {n === 1 && <><circle cx={px(0)} cy={ay(av[0])} r="3" fill="#5E9BD8" /><circle cx={px(0)} cy={by(bv[0])} r="3" fill="#E8B84B" /></>}
        {rows.map((r, i) => <circle key={i} cx={px(i)} cy={ay(r.ovr)} r={n > 18 ? 0 : 2} fill="#04050A" stroke="#5E9BD8" strokeWidth="1.2">
          <title>{r.year + ": Stärke " + r.ovr + ", Marktwert " + eur(r.mv) + " €"}</title></circle>)}
        {idx.map((i) => <text key={i} x={px(i)} y={H - 5} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
          fontSize="9.5" fill={MUT} fontFamily="'Rasen Text',Roboto,sans-serif">{rows[i].lab}</text>)}
      </svg>
      <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
        <span className="m" style={{ fontSize: 9.5, color: "#5E9BD8" }}>— Gesamtstärke</span>
        <span className="m" style={{ fontSize: 9.5, color: "#E8B84B" }}>— Marktwert</span>
      </div>
    </div>
  );
}

/* Zwei Balken je Saison nebeneinander */
function DuoBars({ rows, l1, l2 }) {
  const ref = useRef(null);
  const w = useBoxWidth(ref, 320);
  const H = 148, L = 22, R = 6, T = 12, B = 18;
  const iw = Math.max(50, w - L - R), ih = H - T - B;
  const n = rows.length;
  const hi = Math.max(1, ...rows.map((r) => Math.max(r.a, r.b)));
  const step = iw / n, bw = Math.max(1.5, Math.min(9, step / 2.6));
  const idx = labelIdx(n, w < 300 ? 4 : 7);
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width={w} height={H} style={{ display: "block" }} role="img" aria-label={l1 + " und " + l2 + " je Saison"}>
        {[0, .5, 1].map((t, i) => {
          const y = T + ih * t;
          return (<g key={i}>
            <line x1={L} y1={y} x2={L + iw} y2={y} stroke={GRID} strokeDasharray="2 5" />
            <text x={L - 4} y={y + 3} textAnchor="end" fontSize="9" fill={MUT} fontFamily="'Rasen Text',Roboto,sans-serif">{Math.round(hi - hi * t)}</text>
          </g>);
        })}
        {rows.map((r, i) => {
          const c = L + step * i + step / 2;
          const ha = ih * (r.a / hi), hb = ih * (r.b / hi);
          return (<g key={i}>
            <rect x={c - bw - 1} y={T + ih - ha} width={bw} height={Math.max(0, ha)} fill="#5E9BD8" rx="1"><title>{r.lab + ": " + r.a + " " + l1}</title></rect>
            <rect x={c + 1} y={T + ih - hb} width={bw} height={Math.max(0, hb)} fill="#3DA35D" rx="1"><title>{r.lab + ": " + r.b + " " + l2}</title></rect>
          </g>);
        })}
        {idx.map((i) => <text key={i} x={L + step * i + step / 2} y={H - 5} textAnchor="middle"
          fontSize="9" fill={MUT} fontFamily="'Rasen Text',Roboto,sans-serif">{rows[i].lab}</text>)}
      </svg>
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <span className="m" style={{ fontSize: 9.5, color: "#5E9BD8" }}>■ {l1}</span>
        <span className="m" style={{ fontSize: 9.5, color: "#3DA35D" }}>■ {l2}</span>
      </div>
    </div>
  );
}

/* Notenbalken: je besser die Note, desto höher der Balken */
function NoteBars({ rows }) {
  const ref = useRef(null);
  const w = useBoxWidth(ref, 320);
  const H = 148, L = 24, R = 6, T = 12, B = 18;
  const iw = Math.max(50, w - L - R), ih = H - T - B;
  const n = rows.length;
  const step = iw / n, bw = Math.max(2, Math.min(15, step * .62));
  const good = (v) => clamp((5.5 - v) / 4.3, 0, 1);
  const idx = labelIdx(n, w < 300 ? 4 : 7);
  const y3 = T + ih * (1 - good(3));
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width={w} height={H} style={{ display: "block" }} role="img" aria-label="Durchschnittsnote je Saison">
        {[1.5, 3, 4.5].map((v, i) => {
          const y = T + ih * (1 - good(v));
          return (<g key={i}>
            <line x1={L} y1={y} x2={L + iw} y2={y} stroke={GRID} strokeDasharray="2 5" />
            <text x={L - 4} y={y + 3} textAnchor="end" fontSize="9" fill={MUT} fontFamily="'Rasen Text',Roboto,sans-serif">{v.toFixed(1)}</text>
          </g>);
        })}
        <line x1={L} y1={y3} x2={L + iw} y2={y3} stroke="#232838" />
        {rows.map((r, i) => {
          const h = ih * good(r.note);
          return (<rect key={i} x={L + step * i + step / 2 - bw / 2} y={T + ih - h} width={bw} height={Math.max(1, h)}
            fill={noteCol(r.note)} rx="1"><title>{r.lab + ": Note " + r.note.toFixed(1)}</title></rect>);
        })}
        {idx.map((i) => <text key={i} x={L + step * i + step / 2} y={H - 5} textAnchor="middle"
          fontSize="9" fill={MUT} fontFamily="'Rasen Text',Roboto,sans-serif">{rows[i].lab}</text>)}
      </svg>
      <div className="m" style={{ fontSize: 9.5, color: MUT, marginTop: 4 }}>Je höher der Balken, desto besser die Note.</div>
    </div>
  );
}

/* ---------- Statistik ---------- */
function StatsView({ p }) {
  const S = p.seasons;
  if (!S.length) return <div style={{ fontSize: 12.5, color: "var(--mu)" }}>Noch keine Saison gespielt.</div>;
  const isTW = p.pos === "TW";
  const curve = S.map((s) => ({ lab: String(s.age), year: s.year, ovr: s.ovr, mv: s.mv }));
  const scorer = S.map((s) => ({ lab: String(s.age), a: isTW ? s.cs : s.goals, b: s.assists }));
  const notes = S.map((s) => ({ lab: String(s.age), note: s.note }));
  const byClub = {};
  S.forEach((s) => {
    const b = byClub[s.club] || (byClub[s.club] = { club: s.clubRef, sa: 0, apps: 0, g: 0, a: 0, cs: 0, note: 0 });
    b.sa++; b.apps += s.apps; b.g += s.goals; b.a += s.assists; b.cs += s.cs; b.note += s.note;
  });
  const best = [...S].sort((a, b) => a.note - b.note)[0];
  const per = (v) => (p.tot.apps ? (v / p.tot.apps).toFixed(2) : "0.00");
  const avgNote = (S.reduce((a, s) => a + s.note, 0) / S.length).toFixed(2);
  /* Defensivarbeit über die gesamte Laufbahn */
  const D = S.filter((x) => x.dstat).reduce((acc, x) => ({
    duelle: acc.duelle + x.dstat.duelle, gew: acc.gew + x.dstat.duelleGew,
    erob: acc.erob + x.dstat.eroberungen, verh: acc.verh + x.dstat.verhindert,
    sp: acc.sp + x.apps,
  }), { duelle:0, gew:0, erob:0, verh:0, sp:0 });
  const dQuote = D.duelle ? Math.round(D.gew / D.duelle * 100) : 0;
  const csGesamt = S.reduce((a, x) => a + (x.cs || 0), 0);
  return (
    <div className="g1">
      <div className="g3">
        <Stat k="Spiele" v={p.tot.apps} />
        <Stat k={isTW ? "Zu Null" : "Tore"} v={isTW ? p.tot.cs : p.tot.goals} sub={per(isTW ? p.tot.cs : p.tot.goals) + " pro Spiel"} />
        <Stat k="Vorlagen" v={p.tot.assists} sub={per(p.tot.assists) + " pro Spiel"} />
        <Stat k="Ø Note" v={avgNote} acc />
        <Stat k="Länderspiele" v={p.nt.caps} sub={p.nt.goals + " Tore"} />
        <Stat k="Titel" v={p.trophies.length} />
      </div>
      <div className="pan pad">
        <div className="eb" style={{ marginBottom: 4 }}>Beste Saison</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Crest club={best.clubRef} size={22} />
          <div>
            <div style={{ fontSize: 13 }}>{best.year} · {best.club}</div>
            <div className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>
              {best.apps} Spiele · {isTW ? best.cs + " zu Null" : best.goals + " Tore"} · {best.assists} Vorlagen · Note {best.note.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
      <div className="pan pad">
        <div className="eb" style={{ marginBottom: 4 }}>Gesamtstärke und Marktwert</div>
        <CurveChart rows={curve} />
      </div>
      <div className="g2">
        <div className="pan pad">
          <div className="eb" style={{ marginBottom: 4 }}>{isTW ? "Weiße Westen" : "Tore"} und Vorlagen je Saison</div>
          <DuoBars rows={scorer} l1={isTW ? "Zu Null" : "Tore"} l2="Vorlagen" />
        </div>
        <div className="pan pad">
          <div className="eb" style={{ marginBottom: 4 }}>Durchschnittsnote je Saison</div>
          <NoteBars rows={notes} />
        </div>
      </div>
      {(p.nt.caps > 0 || (p.nt.uCaps || 0) > 0) && (() => {
        const ntS = S.filter((x) => (x.ntCaps || 0) > 0);
        const majors = p.nt.majors.filter((m) => !m.u);
        const uMajors = p.nt.majors.filter((m) => m.u);
        const titel = majors.filter((m) => m.res === "Titel").length;
        const finale = majors.filter((m) => m.res === "Finale").length;
        const letzteMeldung = [...ntS].reverse().find((x) => x.ntNote);
        const rollen = {}; ntS.forEach((x) => { if (x.ntRolle) rollen[x.ntRolle] = (rollen[x.ntRolle] || 0) + 1; });
        return (
          <div className="pan pad">
            <div className="eb" style={{ marginBottom: 8 }}>{p.nation.flag} Nationalmannschaft</div>
            <div className="g3">
              <Stat k="A-Länderspiele" v={p.nt.caps} sub={ntS.length + " Jahre im Kader"} />
              <Stat k="Tore für das Land" v={p.nt.goals}
                sub={p.nt.caps ? (p.nt.goals / p.nt.caps).toFixed(2) + " je Spiel" : ""} />
              <Stat k="Junioreneinsätze" v={p.nt.uCaps || 0}
                sub={["U17", "U19", "U21"].filter((u) => p.nt.u[u] > 0).map((u) => u + " " + p.nt.u[u]).join(" · ") || "—"} />
              <Stat k="Große Turniere" v={majors.length} sub={uMajors.length ? "+ " + uMajors.length + " als Junior" : ""} />
              <Stat k="Titel" v={titel} sub={finale ? finale + "× Finale" : ""} acc={titel > 0} />
              <Stat k="Kapitän" v={p.nt.kapitaen || p.flags.ntbindegefeiert ? "ja" : "—"}
                sub={p.nt.rolle || ""} />
            </div>
            {Object.keys(rollen).length > 0 && (
              <div className="m" style={{ fontSize: 11, color: "var(--mu)", marginTop: 9 }}>
                Rolle im Kader: {Object.entries(rollen).sort((a, b) => b[1] - a[1])
                  .map(([r, n]) => r + " (" + n + ")").join(" · ")}
              </div>)}
            {letzteMeldung && (
              <div className="m" style={{ fontSize: 11, color: "var(--mu)", marginTop: 4 }}>
                Zuletzt: {letzteMeldung.ntNote}
              </div>)}
            {majors.length > 0 && (
              <div style={{ marginTop: 11, paddingTop: 9, borderTop: "1px solid var(--ln)" }}>
                <div className="eb" style={{ marginBottom: 5 }}>Turnierbilanz</div>
                {majors.slice().reverse().slice(0, 8).map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between",
                    padding: "4px 0", borderBottom: "1px solid var(--ln)" }}>
                    <span style={{ fontSize: 12.5 }}>{m.turnier} {m.y}</span>
                    <span className="m" style={{ fontSize: 11.5,
                      color: m.res === "Titel" ? "var(--go)" : m.res === "Finale" ? "var(--ac)" : "var(--mu)" }}>{m.res}</span>
                  </div>))}
              </div>)}
            {ntS.length > 1 && (
              <div style={{ marginTop: 11 }}>
                <div className="eb" style={{ marginBottom: 6 }}>Einsätze je Jahr</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 56 }}>
                  {ntS.slice(-18).map((x, i) => (
                    <div key={i} title={x.year + ": " + x.ntCaps} style={{ flex: 1, display: "flex",
                      flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                      <div style={{ height: Math.max(6, x.ntCaps / Math.max(1, Math.max(...ntS.map((y) => y.ntCaps))) * 100) + "%",
                        background: x.ntLevel === "A" ? "var(--ac)" : "var(--ln2)", borderRadius: 0 }} />
                    </div>))}
                </div>
                <div className="m" style={{ display: "flex", justifyContent: "space-between",
                  fontSize: 9.5, color: "var(--mu)", marginTop: 3 }}>
                  <span>{ntS.length > 18 ? ntS[ntS.length - 18].age : ntS[0].age} Jahre</span>
                  <span>{ntS[ntS.length - 1].age} Jahre</span>
                </div>
              </div>)}
          </div>);
      })()}
      <div className="pan pad">
        <div className="eb" style={{ marginBottom: 8 }}>Defensivarbeit</div>
        <div className="g3">
          <Stat k="Zweikämpfe" v={D.duelle} sub={D.sp ? (D.duelle / D.sp).toFixed(1) + " je Spiel" : ""} />
          <Stat k="Zweikampfquote" v={dQuote + " %"} sub={D.gew + " gewonnen"} />
          <Stat k="Balleroberungen" v={D.erob} sub={D.sp ? (D.erob / D.sp).toFixed(1) + " je Spiel" : ""} />
          <Stat k={isTW ? "Paraden über Erwartung" : "Klärungen und Blocks"} v={D.verh}
            sub={D.sp ? (D.verh / D.sp).toFixed(2) + " je Spiel" : ""} />
          <Stat k="Spiele ohne Gegentor" v={csGesamt}
            sub={D.sp ? Math.round(csGesamt / D.sp * 100) + " % der Einsätze" : ""} />
          <Stat k="Defensivpunkte" v={Math.round(D.gew * .35 + D.erob * .8 + D.verh * 2.2 + csGesamt * 3.5)}
            sub="Zweikämpfe, Eroberungen, Klärungen, weiße Westen" />
        </div>
      </div>
      <div className="pan" style={{ padding: 8 }}>
        <div className="eb" style={{ padding: "2px 4px 8px" }}>Bilanz nach Verein</div>
        <div className="sc">
          <table className="led">
            <thead><tr><th>Verein</th><th className="r">Saisons</th><th className="r">Sp</th><th className="r">{isTW ? "ZN" : "Tore"}</th><th className="r">Vor</th><th className="r">Ø Note</th></tr></thead>
            <tbody>{Object.entries(byClub).map(([k, b]) => (
              <tr key={k}>
                <td><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Crest club={b.club} size={15} />{k}</span></td>
                <td className="r">{b.sa}</td><td className="r">{b.apps}</td>
                <td className="r">{isTW ? b.cs : b.g}</td><td className="r">{b.a}</td>
                <td className="r" style={{ color: noteCol(b.note / b.sa) }}>{(b.note / b.sa).toFixed(2)}</td>
              </tr>))}</tbody>
          </table>
        </div>
      </div>
      <div className="pan" style={{ padding: 8 }}>
        <div className="eb" style={{ padding: "2px 4px 8px" }}>Bilanz nach Wettbewerb</div>
        <div className="sc">
          <table className="led">
            <thead><tr><th>Wettbewerb</th><th className="r">Saisons</th><th className="r">Sp</th>
              <th className="r">{isTW ? "ZN" : "Tore"}</th><th className="r">Vor</th></tr></thead>
            <tbody>
              {(() => {
                const m = {};
                S.forEach((s) => (s.comps || []).forEach((c) => {
                  const b = m[c.name] || (m[c.name] = { sa: 0, apps: 0, g: 0, a: 0, cs: 0, key: c.key });
                  b.sa++; b.apps += c.apps; b.g += c.goals; b.a += c.assists; b.cs += c.cs;
                }));
                const rows = Object.entries(m).sort((x, y) => y[1].apps - x[1].apps);
                if (p.nt.caps > 0) rows.push(["Nationalmannschaft " + p.nation.name,
                  { sa: S.filter((x) => x.ntCaps > 0).length, apps: p.nt.caps, g: p.nt.goals, a: 0, cs: 0, key: "nt" }]);
                return rows.map(([name, b]) => (
                  <tr key={name}>
                    <td style={{ color: b.key === "nt" ? "var(--go)" : "var(--tx)" }}>{name}</td>
                    <td className="r">{b.sa}</td><td className="r">{b.apps}</td>
                    <td className="r">{isTW && b.key !== "nt" ? b.cs : b.g}</td>
                    <td className="r">{b.key === "nt" ? "—" : b.a}</td>
                  </tr>));
              })()}
            </tbody>
          </table>
        </div>
      </div>
      {p.milestones.length > 0 && (
        <div className="pan pad">
          <div className="eb" style={{ marginBottom: 6 }}>Meilensteine ({p.milestones.length}/{MILESTONES.length})</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {MILESTONES.filter((m) => p.milestones.includes(m.id)).map((m) => <span key={m.id} className="chip g">{m.t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Vermögen ---------- */
function MoneyView({ p, onBuy, onInvest, onSell, onDonate }) {
  const owned = p.assets;
  const auto = !!p.speed;                        // im Speedmodus kauft der Berater
  const cats = [...new Set(SHOP.map((s) => s.cat))];
  const last = p.seasons.length ? p.seasons[p.seasons.length - 1] : null;
  return (
    <div className="g1">
      {!auto && p.assets.includes("verwalter") && (
        <div className="up pad">
          <div className="eb" style={{ color: "var(--ok)" }}>Vermögensverwalter aktiv</div>
          <div style={{ fontSize: 12, color: "var(--mu)", marginTop: 3 }}>
            Anschaffungen und Anlagen laufen nach jeder Saison von selbst. Eine Rücklage
            von etwa einem Jahresgehalt bleibt immer liegen. Du kannst weiterhin selbst eingreifen.
          </div>
        </div>)}
      {auto && (
        <div className="up pad">
          <div className="eb" style={{ color: "var(--go)" }}>Speedmodus</div>
          <div style={{ fontSize: 12, color: "var(--mu)", marginTop: 3 }}>
            Dein Berater kauft, was sinnvoll ist und was du dir leisten kannst.
          </div>
        </div>)}
      <div className="g3">
        <Stat k="Verfügbar" v={eur(p.money) + " €"} acc />
        <Stat k="Depot" v={eur(depotValue(p)) + " €"} />
        <Stat k="Gesamtvermögen" v={eur(netWorth(p)) + " €"} />
      </div>
      {last && last.ledger && (
        <div className="pan pad">
          <div className="eb" style={{ marginBottom: 6 }}>Kontoauszug {last.year}</div>
          {last.ledger.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid var(--ln)" }}>
              <span style={{ fontSize: 12, color: "var(--mu)" }}>{l.t}{l.dep ? " (im Depot)" : ""}</span>
              <span className="m" style={{ fontSize: 11.5, color: l.v >= 0 ? "var(--ok)" : "var(--bad)" }}>{sgn(l.v)}{eur(l.v)} €</span>
            </div>
          ))}
        </div>
      )}

      {(() => {
        const ks = [["dev","Entwicklung","%"],["slow","Alterung gebremst","%"],["inj","Verletzungsrisiko",""],
          ["fit","Fitness",""],["morale","Moral",""],["note","Note",""],["rep","Bekanntheit",""],
          ["income","Einnahmen","€"],["net","Nettoanteil","%"]];
        const rows = ks.map(([k,l,u]) => [l, perk(p,k), u]).filter((r) => r[1]);
        if (!rows.length) return null;
        return (
          <div className="pan pad">
            <div className="eb" style={{ marginBottom: 6 }}>Was dir dein Besitz pro Saison bringt</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {rows.map(([l, v, u]) => (
                <span key={l} className={"chip " + ((l === "Verletzungsrisiko" ? v < 0 : v > 0) ? "a" : "r")}>
                  {l} {v > 0 ? "+" : ""}{u === "%" ? Math.round(v * 100) + " %" : u === "€" ? eur(v) + " €" : v.toFixed(1)}
                </span>))}
            </div>
          </div>);
      })()}
      <div className="pan pad">
        <div className="eb" style={{ marginBottom: 8 }}>Geldanlage</div>
        {INVEST.map((it) => {
          const held = p.depot[it.id] || 0;
          const steps = [.1, .5, 2, 10].filter((v) => v >= it.min && v <= p.money);
          return (
            <div key={it.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--ln)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 13 }}>{it.name}</span>
                  <span className="chip" style={{ marginLeft: 7 }}>Risiko {it.risk}</span>
                </div>
                <span className="m" style={{ fontSize: 11.5, color: held > 0 ? "var(--ac)" : "var(--mu)" }}>{eur(held)} €</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 2 }}>{it.desc}</div>
              <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
                {steps.map((v) => <button key={v} className="btn sm" disabled={auto}
                  onClick={() => { if (!auto) onInvest(it.id, v); }}>+{eur(v)}</button>)}
                {held > 0 && <button className="btn sm" onClick={() => onSell(it.id)}>Auflösen</button>}
                {!steps.length && held === 0 && <span className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>Mindestanlage {eur(it.min)} €</span>}
              </div>
            </div>
          );
        })}
      </div>

      {cats.map((cat) => (
        <div className="pan pad" key={cat}>
          <div className="eb" style={{ marginBottom: 8 }}>{cat}</div>
          <div className="g1">
            {SHOP.filter((s) => s.cat === cat).map((s) => {
              const has = owned.includes(s.id);
              const cost = s.id === "anteile" ? Math.max(6, clubBudget(p.club) * .45) : s.cost;
              const blocked = s.req && !owned.includes(s.req);
              return (
                <div key={s.id} style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 170 }}>
                    <div style={{ fontSize: 13, color: has ? "var(--go)" : "var(--tx)" }}>{s.name}{has ? " ✓" : ""}</div>
                    <div style={{ fontSize: 11.5, color: "var(--mu)" }}>{s.desc}</div>
                    <div className="m" style={{ fontSize: 10, color: "var(--mu)", marginTop: 2 }}>
                      {eur(cost)} €{s.up ? " · Unterhalt " + eur(s.up) + " €/Jahr" : ""}
                      {blocked ? " · setzt " + shopItem(s.req).name + " voraus" : ""}
                    </div>
                  </div>
                  <button className="btn sm" disabled={auto || has || blocked || p.money < cost}
                    onClick={() => { if (!auto) onBuy(s.id, cost); }}>
                    {has ? "Vorhanden" : "Kaufen"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pan pad">
        <div className="eb" style={{ marginBottom: 6 }}>Spenden</div>
        <div style={{ fontSize: 12, color: "var(--mu)", marginBottom: 8 }}>
          Bisher gespendet: {eur(p.donated)} €. Zahlt auf Ansehen und Vermächtnis ein, nicht auf dein Konto.
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[.1, .5, 2].filter((v) => v <= p.money).map((v) => (
            <button key={v} className="btn sm" onClick={() => onDonate(v)}>{eur(v)} € spenden</button>
          ))}
          {p.money < .1 && <span className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>Dafür reicht das Geld nicht.</span>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Verlauf, Kader, Vitrine ---------- */
function NationalView({ p }) {
  const S = p.seasons.filter((s) => s.ntCaps > 0 || (s.ntLevel && s.ntLevel !== "none"));
  const lvl = { none: "nicht nominiert", U19: "U19", U21: "U21", A: "A-Nationalmannschaft" };
  if (!p.nt.caps && !(p.nt.uCaps > 0) && !S.length) {
    return (
      <div>
        <div className="d" style={{ fontSize: 17 }}>Noch keine Nominierung</div>
        <p style={{ fontSize: 12.5, color: "var(--mu)", marginTop: 6, maxWidth: 460 }}>
          Für {p.nation.flag} {p.nation.name} musst du erst stark genug werden und regelmäßig spielen.
          Je stärker die Nation, desto höher die Hürde — in einem Land mit vielen guten Spielern
          brauchst du deutlich mehr als anderswo.
        </p>
      </div>
    );
  }
  const first = S[0], majors = p.nt.majors;
  return (
    <div className="g1">
      <div className="g3">
        <Stat k="Länderspiele" v={p.nt.caps} acc />
        <Stat k="Tore" v={p.nt.goals} />
        <Stat k="Status" v={lvl[p.nt.level] === "A-Nationalmannschaft" ? "A-Team" : (lvl[p.nt.level] || "—")} />
        <Stat k="Turniere" v={majors.length} />
        <Stat k="Titel" v={majors.filter((m) => m.res === "Titel").length} />
        <Stat k="Debüt" v={first ? first.year : "—"} sub={first ? "mit " + first.age : ""} />
        <Stat k="U-Einsätze" v={p.nt.uCaps || 0} sub={p.nt.u ? "U17 " + p.nt.u.U17 + " · U19 " + p.nt.u.U19 + " · U21 " + p.nt.u.U21 : ""} />
        <Stat k="U-Tore" v={p.nt.uGoals || 0} />
      </div>

      {majors.length > 0 && (
        <div className="pan" style={{ padding: 8 }}>
          <div className="eb" style={{ padding: "2px 4px 8px" }}>Große Turniere</div>
          <div className="sc">
            <table className="led">
              <thead><tr><th>Jahr</th><th>Turnier</th><th>Ergebnis</th></tr></thead>
              <tbody>{[...majors].reverse().map((m, i) => (
                <tr key={i}>
                  <td>{m.y}</td><td>{m.turnier}</td>
                  <td style={{ color: m.res === "Titel" ? "var(--go)" : m.res === "Vorrunde" ? "var(--bad)" : "var(--tx)" }}>{m.res}</td>
                </tr>))}</tbody>
            </table>
          </div>
        </div>)}

      <div className="pan" style={{ padding: 8 }}>
        <div className="eb" style={{ padding: "2px 4px 8px" }}>Länderspiele je Jahr</div>
        <div className="sc">
          <table className="led">
            <thead><tr><th>Saison</th><th className="r">Alter</th><th>Auswahl</th><th className="r">Spiele</th><th className="r">Tore</th><th>Verein</th></tr></thead>
            <tbody>{[...S].reverse().map((x, i) => (
              <tr key={i}>
                <td>{x.year}</td><td className="r">{x.age}</td>
                <td style={{ color: x.ntLevel === "A" ? "var(--ac)" : "var(--mu)" }}>{lvl[x.ntLevel] || "—"}</td>
                <td className="r">{x.ntCaps}</td><td className="r">{x.ntGoals}</td>
                <td style={{ color: "var(--mu)" }}>{x.club}</td>
              </tr>))}</tbody>
          </table>
        </div>
      </div>

      {p.flags.ntRuecktritt && (
        <div className="up" style={{ padding: "9px 11px", borderLeft: "3px solid var(--go)" }}>
          <span style={{ fontSize: 12.5 }}>Du bist zurückgetreten. Es kommt keine Nominierung mehr.</span>
        </div>)}
    </div>
  );
}

function HistoryView({ p }) {
  if (!p.seasons.length) return <div style={{ fontSize: 12.5, color: "var(--mu)" }}>Noch keine Saison gespielt.</div>;
  const isTW = p.pos === "TW";
  return (
    <div className="sc">
      <table className="led">
        <thead><tr><th>Saison</th><th className="r">Alt</th><th>Verein</th><th>Pos</th><th className="r">Pl</th>
          <th className="r">Sp</th><th className="r">{isTW ? "ZN" : "Tore"}</th><th className="r">Vor</th>
          <th className="r">Note</th><th className="r">OVR</th><th className="r">Gehalt</th></tr></thead>
        <tbody>{[...p.seasons].reverse().map((x, i) => (
          <tr key={i}>
            <td>{x.year}</td><td className="r">{x.age}</td>
            <td><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Crest club={x.clubRef} size={15} />{x.club}</span></td>
            <td>{POS[x.pos].short}</td><td className="r">{x.rank}</td><td className="r">{x.apps}</td>
            <td className="r">{x.pos === "TW" ? x.cs : x.goals}</td><td className="r">{x.assists}</td>
            <td className="r" style={{ color: noteCol(x.note) }}>{x.note.toFixed(1)}</td>
            <td className="r" style={{ color: "var(--ac)" }}>{x.ovr}</td>
            <td className="r" style={{ color: "var(--mu)" }}>{eur(x.wage)}</td>
          </tr>))}</tbody>
      </table>
    </div>
  );
}
function SquadView({ p }) {
  const rival = rivalOf(p.squad, p.pos);
  const list = [...p.squad.slice(0, 15).map((s) => ({ ...s })),
    { name: p.name, pos: p.pos, ovr: p.ovr, age: p.age, cc: p.nation.id, me: true }]
    .sort((a, b) => b.ovr - a.ovr);
  return (
    <div>
      <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginBottom: 8 }}>
        {p.club.n} · {list.length} Spieler · Durchschnitt {Math.round(list.reduce((a, x) => a + x.ovr, 0) / list.length)}
      </div>
      <div style={{ display: "grid", gap: "0 18px", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
        {list.map((s, i) => {
          const isR = !s.me && rival && s.name === rival.name;
          return (
            <div key={i} className="m" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5,
              padding: "5px 6px", borderBottom: "1px solid var(--ln)", borderRadius: 0,
              background: s.me ? "rgba(110,147,190,.12)" : undefined }}>
              <span className={"chip" + (s.pos === p.pos ? " a" : "")} style={{ minWidth: 36, textAlign: "center", padding: "1px 4px" }}>{POS[s.pos].short}</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                color: s.me ? "var(--ac)" : isR ? "var(--go)" : "var(--tx)", fontWeight: s.me ? 600 : 400 }}>
                {s.me ? p.nation.flag + " " + s.name : s.name}{isR ? " ◂" : ""}{s.me ? " ◂ du" : ""}
              </span>
              <span style={{ color: "var(--mu)" }}>{s.age}</span>
              <span style={{ color: s.me ? "var(--ac)" : "var(--tx)", minWidth: 22, textAlign: "right" }}>{s.ovr}</span>
            </div>
          );
        })}
      </div>
      <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginTop: 9, lineHeight: 1.7 }}>
        Blau hinterlegt bist du selbst. Blau umrandete Positionskürzel zeigen, wer auf deiner Position spielt.
        {rival ? " Dein direkter Konkurrent ist " + rival.name + " (" + rival.ovr + "). Ist er stärker als du, kostet dich das Spielzeit." : ""}
      </div>
    </div>
  );
}
function SocialView({ p }) {
  const s = socialStats(p);
  const B = ({ k, v, sub }) => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="eb">{k}</span>
        <span className="m" style={{ fontSize: 11, color: v >= 70 ? "var(--ok)" : v >= 45 ? "var(--go)" : "var(--bad)" }}>{v}</span>
      </div>
      <Meter v={v} />
      <div style={{ fontSize: 10.5, color: "var(--mu)", marginTop: 2 }}>{sub}</div>
    </div>
  );
  return (
    <div className="fade g1">
      <div className="pan pad">
        <div className="eb" style={{ marginBottom: 4 }}>Reichweite</div>
        <div className="d" style={{ fontSize: 34, color: "var(--ac)" }}>{s.reichweite}</div>
        <div style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 2 }}>
          Wie viele dir folgen. Wächst mit Bekanntheit, großer Bühne, Titeln und Länderspielen.
        </div>
      </div>
      <div className="pan pad">
        <div className="eb" style={{ marginBottom: 10 }}>Wie man dich sieht</div>
        <div className="g1" style={{ gap: 12 }}>
          <B k="Beliebtheit bei den Fans" v={s.beliebt}
            sub="Leistung, Titel, Vereinstreue — Wechselgesuche und Skandale kosten." />
          <B k="Akzeptanz in der Kabine" v={s.akzeptanz}
            sub="Vertrauen des Trainers, Jahre im Verein, Kapitänsamt." />
          <B k="Medienpräsenz" v={s.medien}
            sub="Wie oft über dich berichtet wird, im Guten wie im Schlechten." />
          <B k="Öffentlicher Druck" v={s.druck}
            sub="Was von dir erwartet wird. Hoch heißt: jeder Fehler wird groß." />
          <B k="Werbewert" v={s.marktwert}
            sub="Was du für Sponsoren wert bist." />
        </div>
      </div>
      {s.verlauf.length >= 2 && (
        <div className="pan pad">
          <div className="eb" style={{ marginBottom: 8 }}>Bekanntheit im Verlauf</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 84 }}>
            {s.verlauf.slice(-16).map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column",
                justifyContent: "flex-end", height: "100%" }}>
                <div style={{ height: Math.max(3, v) + "%", background: "var(--ac)", borderRadius: 0, opacity: .55 + v / 240 }} />
              </div>))}
          </div>
          <div className="m" style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "var(--mu)", marginTop: 4 }}>
            <span>{p.seasons.length > 16 ? p.seasons[p.seasons.length - 16].age : p.seasons[0].age} Jahre</span>
            <span>{p.seasons[p.seasons.length - 1].age} Jahre</span>
          </div>
        </div>)}
      <div className="pan pad">
        <div className="eb" style={{ marginBottom: 8 }}>Woraus sich das speist</div>
        <div className="g2">
          <Stat k="Titel" v={s.titel} />
          <Stat k="Pflichtspiele" v={s.spiele} />
          <Stat k="Tore" v={s.tore} />
          <Stat k="Länderspiele" v={p.nt.caps} />
          <Stat k="Jahre im Verein" v={loyalty(p) || 1} />
          <Stat k="Kapitänsamt" v={p.flags.kapitaen ? (p.nt.kapitaen ? "Verein + Land" : "Verein") : p.nt.kapitaen ? "Nationalteam" : "—"} />
        </div>
      </div>
    </div>
  );
}

function TrophyView({ p }) {
  if (!p.trophies.length && !p.awards.length && !p.assets.length)
    return <div style={{ fontSize: 12.5, color: "var(--mu)" }}>Noch nichts gewonnen, noch nichts aufgebaut.</div>;
  return (
    <div className="g1">
      {p.trophies.length > 0 && <div><div className="eb" style={{ marginBottom: 6 }}>Titel ({p.trophies.length})</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{p.trophies.map((t, i) => <span key={i} className="chip g">{t}</span>)}</div></div>}
      {p.awards.length > 0 && <div><div className="eb" style={{ marginBottom: 6 }}>Auszeichnungen ({p.awards.length})</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{p.awards.map((a, i) => <span key={i} className="chip">{a.a} {a.y}</span>)}</div></div>}
      {p.assets.length > 0 && <div><div className="eb" style={{ marginBottom: 6 }}>Besitz</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{p.assets.map((id) => <span key={id} className="chip a">{shopItem(id)?.name}</span>)}</div></div>}
      {p.nt.majors.length > 0 && <div><div className="eb" style={{ marginBottom: 6 }}>Turniere</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{p.nt.majors.map((m, i) =>
          <span key={i} className={"chip" + (m.res === "Titel" ? " g" : "")}>{m.turnier} {m.y}: {m.res}</span>)}</div></div>}
    </div>
  );
}

/* ---------- Ruhmeshalle und Abschluss ---------- */
/* Sicherung: alle dauerhaften Daten als Text ausgeben und wieder einlesen.
   Damit überlebt der Fortschritt Gerätewechsel und Neuinstallationen.   */
const SICHER_KEYS = [SAVE_KEY, HALL_KEY, SEEN_KEY, ACH_KEY, META_KEY, WC_KEY, LIFE_KEY, AKA_KEY, HSV_KEY];

function BackupScreen({ onBack, onImport }) {
  useZurueck(onBack);
  const [text, setText] = useState("");
  const [eingabe, setEingabe] = useState("");
  const [info, setInfo] = useState("");
  const [modus, setModus] = useState("aus");

  const exportieren = async () => {
    if (!hasStore()) { setInfo("Auf diesem Gerät ist kein Speicher verfügbar."); return; }
    const daten = {};
    for (const k of SICHER_KEYS) {
      try { const r = await store.get(k); if (r && r.value) daten[k] = r.value; }
      catch (e) { /* Schlüssel nicht vorhanden */ }
    }
    const paket = JSON.stringify({ spiel: "rasenschach", v: VERSION, t: Date.now(), daten });
    setText(paket);
    setInfo(Object.keys(daten).length + " Datensätze gesichert (" + Math.round(paket.length / 1024) + " KB).");
  };

  const kopieren = () => {
    try {
      const el = document.getElementById("sicherungsfeld");
      if (el) { el.focus(); el.select(); document.execCommand("copy"); setInfo("In die Zwischenablage kopiert."); }
    } catch (e) { setInfo("Bitte den Text von Hand markieren und kopieren."); }
  };

  const importieren = async () => {
    let paket;
    try { paket = JSON.parse(eingabe.trim()); }
    catch (e) { setInfo("Das ist kein gültiger Sicherungstext."); return; }
    if (!paket || paket.spiel !== "rasenschach" || !paket.daten) { setInfo("Der Text gehört nicht zu diesem Spiel."); return; }
    if (!hasStore()) { setInfo("Auf diesem Gerät ist kein Speicher verfügbar."); return; }
    let n = 0;
    for (const k of Object.keys(paket.daten)) {
      if (!SICHER_KEYS.includes(k)) continue;
      try { await store.set(k, paket.daten[k]); n++; } catch (e) { /* überspringen */ }
    }
    setInfo(n + " Datensätze eingespielt. Die Ansicht wird aktualisiert.");
    if (onImport) await onImport();
  };

  return (
    <Shell blatt="archiv">
      <div className="fade" style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div className="d" style={{ fontSize: 26 }}>Sicherung</div>
          <button className="btn sm" onClick={onBack}>Zurück</button>
        </div>
        <p style={{ fontSize: 12, color: "var(--mu)", margin: "6px 0 14px" }}>
          Spielstand als Text mitnehmen und auf einem anderen Gerät wieder einspielen.
        </p>

        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <button className={"btn sm" + (modus === "aus" ? " on" : "")} onClick={() => { setModus("aus"); setInfo(""); }}>Sichern</button>
          <button className={"btn sm" + (modus === "ein" ? " on" : "")} onClick={() => { setModus("ein"); setInfo(""); }}>Einspielen</button>
        </div>

        {modus === "aus" ? (
          <div className="pan pad">
            <div className="eb" style={{ marginBottom: 6 }}>Daten auslesen</div>
            <button className="btn sm" onClick={exportieren}>Sicherungstext erzeugen</button>
            {text && (<>
              <textarea id="sicherungsfeld" readOnly value={text} spellCheck="false"
                style={{ width: "100%", height: 150, marginTop: 10, background: "var(--pan2)", color: "var(--tx)",
                  border: "1px solid var(--ln)", borderRadius: 0, fontSize: 10, fontFamily: "monospace", padding: 8 }} />
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                <button className="btn sm" onClick={kopieren}>Kopieren</button>
              </div>
              <div style={{ fontSize: 11, color: "var(--mu)", marginTop: 8 }}>
                Text sicher ablegen: Notiz, Mail an dich selbst oder Textdatei.
              </div>
            </>)}
          </div>
        ) : (
          <div className="pan pad" style={{ borderColor: "var(--bad)" }}>
            <div className="eb" style={{ marginBottom: 6, color: "var(--bad)" }}>Daten einspielen</div>
            <div style={{ fontSize: 11.5, color: "var(--mu)", marginBottom: 8 }}>
              Achtung: Der vorhandene Fortschritt auf diesem Gerät wird dabei überschrieben.
            </div>
            <textarea value={eingabe} onChange={(e) => setEingabe(e.target.value)} spellCheck="false"
              placeholder="Sicherungstext hier einfügen"
              style={{ width: "100%", height: 150, background: "var(--pan2)", color: "var(--tx)",
                border: "1px solid var(--ln)", borderRadius: 0, fontSize: 10, fontFamily: "monospace", padding: 8 }} />
            <button className="btn sm" style={{ marginTop: 8 }} disabled={!eingabe.trim()} onClick={importieren}>
              Einspielen und überschreiben</button>
          </div>
        )}
        {info && <div className="up pad" style={{ marginTop: 12, fontSize: 12 }}>{info}</div>}
      </div>
    </Shell>
  );
}

function AchievementScreen({ ach, ges, meta, onBack }) {
  useZurueck(onBack);
  const [filter, setFilter] = useState("alle");
  /* Zugeklappt beginnen: die Errungenschaften sind der Hauptinhalt dieser
     Seite, die Freischaltungen sind das Nachschlagewerk dazu. */
  const [freiAuf, setFreiAuf] = useState(false);
  const erreicht = ACHIEVEMENTS.filter((a) => ach && ach[a.id]);
  const pkt = erreicht.reduce((a, x) => a + STUFEN[x.s].w, 0);
  const maxPkt = ACHIEVEMENTS.reduce((a, x) => a + STUFEN[x.s].w, 0);
  const liste = filter === "alle" ? ACHIEVEMENTS : ACHIEVEMENTS.filter((a) => a.s === filter);
  const G = ges || leereBilanz();
  return (
    <Shell blatt="erfolge">
      <div className="fade" style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div className="d" style={{ fontSize: 28 }}>Errungenschaften</div>
          <button className="btn sm" onClick={onBack}>Zurück</button>
        </div>
        <div className="m" style={{ fontSize: 12, color: "var(--mu)", marginTop: 4 }}>
          {erreicht.length} von {ACHIEVEMENTS.length} · {pkt} von {maxPkt} Ruhmpunkten
        </div>
        <div style={{ height: 6, background: "var(--ln)", borderRadius: 0, marginTop: 8, overflow: "hidden" }}>
          <div style={{ width: (pkt / maxPkt * 100) + "%", height: "100%", background: "var(--go)" }} />
        </div>

        <div className="g3" style={{ marginTop: 14 }}>
          <Stat k="Laufbahnen" v={G.karrieren} />
          <Stat k="Pflichtspiele" v={G.apps} />
          <Stat k="Tore" v={G.goals} />
          <Stat k="Titel" v={G.titel} />
          <Stat k="Länderspiele" v={G.caps} />
          <Stat k="Bester Lauf" v={G.bestPunkte + " Pkt"} />
        </div>

        {/* Freischaltungen. Vorher stand jede einzeln als eigene Karte mit
            Rahmen untereinander — bei 48 Stück eine sehr lange Kette, in der
            man nichts wiederfand. Jetzt aufklappbar, nach Art gebündelt, und
            zugeklappt nur eine Zeile mit den Zahlen. */}
        <button className="btn" onClick={() => setFreiAuf(!freiAuf)}
          style={{ margin: "18px 0 0", padding: "10px 12px", display: "block", width: "100%" }}>
          <span className="inhalt">
            <span className="d" style={{ fontSize: 15 }}>Freigeschaltet</span>
            <span className="punkte" />
            <span className="wert">{Object.keys(meta || {}).filter((k) => META[k]).length} von {Object.keys(META).length}</span>
            <span className="d" style={{ fontSize: 15, color: "var(--mu)", minWidth: 18, textAlign: "right" }}>
              {freiAuf ? "\u2212" : "+"}</span>
          </span>
        </button>

        {(() => {
          const offen = Object.keys(meta || {}).filter((k) => META[k]);
          const ARTEN = [["karte", "Neue Wildcards"], ["rar", "Bessere Chancen"],
            ["start", "Startvorteile"], ["regel", "Spielregeln"],
            ["ereignis", "Neue Ereignisse"], ["kosmetik", "Aussehen"]];
          /* Zugeklappt: eine Zeile je Art mit Zähler. Das ist die Übersicht,
             die vorher fehlte — man sieht, wo noch etwas zu holen ist. */
          const zaehler = {};
          ARTEN.forEach(([t]) => { zaehler[t] = { auf: 0, alle: 0 }; });
          Object.keys(META).forEach((k) => {
            const t = META[k].typ; if (!zaehler[t]) return;
            zaehler[t].alle++; if (meta && meta[k]) zaehler[t].auf++;
          });
          if (!freiAuf) return (
            <div className="zellen" style={{ marginTop: 8, fontSize: 11 }}>
              {ARTEN.map(([t, n]) => (
                <div key={t}><span className="eb">{n}</span>
                  <span style={{ color: zaehler[t].auf ? "var(--ok)" : "var(--mu)" }}>
                    {zaehler[t].auf}/{zaehler[t].alle}</span></div>))}
            </div>);
          if (!offen.length) return (
            <div className="pan pad" style={{ fontSize: 12, color: "var(--mu)", marginTop: 8 }}>
              Noch nichts freigeschaltet. Errungenschaften mit einem Geschenk bringen neue Karten,
              bessere Chancen, Startvorteile oder Kosmetik.</div>);
          /* Aufgeklappt: nach Art gebündelt, eine Zeile je Freischaltung. */
          return (
            <div style={{ marginTop: 8 }}>
              {ARTEN.map(([t, n]) => {
                const drin = offen.filter((k) => META[k].typ === t);
                if (!drin.length) return null;
                return (
                  <div key={t} className="pan pad" style={{ marginTop: 8 }}>
                    <div className="band matt"><span>{n}</span>
                      <span>{drin.length} von {zaehler[t].alle}</span></div>
                    {drin.map((k) => (
                      <div key={k} style={{ display: "flex", gap: 8, alignItems: "baseline",
                        padding: "3px 0", borderBottom: "1px solid var(--ln)" }}>
                        <span className="d" style={{ fontSize: 12.5, color: "var(--ok)", flexShrink: 0 }}>
                          {META[k].n}</span>
                        <span className="m" style={{ fontSize: 10.5, color: "var(--mu)", textAlign: "right",
                          marginLeft: "auto" }}>{META[k].t}</span>
                      </div>))}
                  </div>);
              })}
            </div>);
        })()}

        <div style={{ display: "flex", gap: 5, margin: "18px 0 8px", flexWrap: "wrap" }}>
          <button className={"btn sm" + (filter === "alle" ? " on" : "")} onClick={() => setFilter("alle")}>Alle</button>
          {Object.keys(STUFEN).map((k) => {
            const n = ACHIEVEMENTS.filter((a) => a.s === k).length;
            const e = erreicht.filter((a) => a.s === k).length;
            return (
              <button key={k} className={"btn sm" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>
                <span className="stufe punkt" aria-hidden="true" style={{ background: STUFEN[k].col }} />
                <span>{STUFEN[k].n}</span>
                <span className="m" style={{ color: "var(--mu)", marginLeft: 5, fontSize: 10 }}>{e}/{n}</span>
              </button>);
          })}
        </div>

        <div className="g2">
          {liste.map((a) => {
            const hat = ach && ach[a.id];
            const st = STUFEN[a.s];
            /* Gesammeltes liegt als Klebebild auf der Seite, Fehlendes ist ein
               Leerfeld mit seiner Nummer — wie im Sammelheft. Der Text bleibt
               in beiden Fällen stehen, sonst wüsste man nicht, worauf man spielt. */
            const nr = String(ACHIEVEMENTS.indexOf(a) + 1).padStart(3, "0");
            return (
              <div key={a.id} className={hat ? "pad klebe karton" : "pad leerfeld"}
                style={hat ? { borderTop: "4px solid " + st.colK,
                               transform: RUHE ? "none" : "rotate(" + winkel(a.id) + ")" }
                           : { opacity: .62 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
                  <span className="d" style={{ fontSize: 14.5, color: hat ? "var(--tinte)" : "var(--mu)" }}>{a.n}</span>
                  {/* Erspielt: gefüllter Block in der Stufenfarbe. Nicht erspielt:
                      nur die Nummer, damit das Leerfeld leer bleibt. */}
                  {hat
                    ? <span className="m stufe" style={{ background: st.colK }}>{st.n}</span>
                    : <span className="m" style={{ fontSize: 9, color: "var(--ln2)", opacity: .9 }}>{nr}</span>}
                </div>
                <div style={{ fontSize: 11.5, color: hat ? "var(--tinte2)" : "var(--mu)", marginTop: 3 }}>{a.t}</div>
                {a.lohn && META[a.lohn] && (
                  <div className="m" style={{ fontSize: 10, color: hat ? "var(--ok-k)" : "var(--go)", marginTop: 5 }}>
                    {hat ? "Freigeschaltet: " : "Belohnung: "}{META[a.lohn].n}
                  </div>)}
                {hat && hat.name && <div className="m" style={{ fontSize: 9.5, color: "var(--ac-k)", marginTop: 3 }}>{hat.y} · {hat.name}</div>}
              </div>);
          })}
        </div>
      </div>
    </Shell>
  );
}

function HallScreen({ hall, onBack }) {
  useZurueck(onBack);
  /* Rangliste, aber jeder Eintrag ist eine Würdigung: Rangzahl, Bildnis im
     Trikot des Vereins mit den meisten Einsätzen, Wappen, Kennzahlen als
     Kartenfelder. Einträge aus Fassungen vor 33.10 haben weder Bildnis noch
     Heimatverein — dann fällt beides weg, ohne dass etwas bricht. */
  return (
    <Shell blatt="hall">
      <div className="fade">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div className="d" style={{ fontSize: 26 }}>Ruhmeshalle</div>
          <button className="btn sm" onClick={onBack}>Zurück</button>
        </div>
        <p style={{ fontSize: 12, color: "var(--mu)", margin: "5px 0 14px" }}>
          Abgeschlossene Laufbahnen nach Vermächtnispunkten. Nur auf diesem Gerät.
        </p>
        {!hall.length ? (
          <div className="pan pad"><div className="d" style={{ fontSize: 17 }}>Noch leer</div>
            <p style={{ fontSize: 12, color: "var(--mu)", marginTop: 5 }}>
              Spiel eine Laufbahn zu Ende, dann steht sie hier.</p></div>
        ) : (
          <div className="g1">
            {hall.map((h, i) => {
              const heim = h.heimat ? CLUBS.find((c) => c.n === h.heimat) : null;
              const r = h.wr ? (RARITY[h.wr] || RARITY.normal) : null;
              return (
                <div key={i} className="pan pad klebe rs-auf" style={{ animationDelay: (i * 55) + "ms",
                  borderColor: i === 0 ? "var(--go)" : "var(--ln2)" }}>
                  {r && <div className="band" style={{ background: r.col }}>
                    <span>{h.tier}</span><span style={{ letterSpacing: ".08em" }}>{h.wc}</span></div>}
                  {!r && <div className="band matt"><span>{h.tier}</span></div>}

                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div className="d" style={{ fontSize: 34, color: i === 0 ? "var(--go)" : "var(--ln2)",
                      minWidth: 34, textAlign: "right", lineHeight: 1 }}>{i + 1}</div>
                    {h.avatar != null && (
                      <Avatar seed={h.avatar} zuege={h.zuege} club={heim} size={56} ring="var(--ln2)" g={h.g} nat={h.natId} />)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d" style={{ fontSize: 17, wordBreak: "break-word" }}>{h.nat} {h.name}</div>
                      <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginTop: 2 }}>
                        {POS[h.pos] ? POS[h.pos].short : h.pos}
                        {h.von ? " · " + h.von + "–" + h.bis : ""}
                        {" · Ende mit " + h.age}
                        {h.speed ? " · Speedmodus" : ""}
                      </div>
                      {heim && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
                          <Crest club={heim} size={18} />
                          <span className="m" style={{ fontSize: 11, overflow: "hidden",
                            textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{heim.n}</span>
                          {h.heimatSpiele > 0 && <span className="m" style={{ fontSize: 9.5, color: "var(--mu)" }}>
                            {h.heimatSpiele} Spiele</span>}
                        </div>)}
                    </div>
                    {i === 0 && hall.length > 2 && (
                      <span className="d stempel" style={{ fontSize: 11, color: "var(--go)", flexShrink: 0 }}>Bester</span>)}
                  </div>

                  <div className="m zellen" style={{ fontSize: 11, marginTop: 11, flexWrap: "wrap" }}>
                    <div><span className="eb">Punkte</span><span style={{ color: "var(--ac)" }}>{h.score}</span></div>
                    <div><span className="eb">Peak</span>{h.peak}</div>
                    {h.apps != null && <div><span className="eb">Spiele</span>{h.apps}</div>}
                    <div><span className="eb">Tore</span>{h.goals}</div>
                    {h.assists != null && <div><span className="eb">Vorlagen</span>{h.assists}</div>}
                    <div><span className="eb">Titel</span>{h.titles}</div>
                    <div><span className="eb">Länderspiele</span>{h.caps}</div>
                    <div><span className="eb">Vermögen</span>{eur(h.worth || 0)}</div>
                  </div>
                </div>);
            })}
          </div>
        )}
        <button className="btn" style={{ maxWidth: 180, marginTop: 16 }} onClick={onBack}>Zurück</button>
      </div>
    </Shell>
  );
}

function EndScreen({ p, onNew, onHall, onAka }) {
  /* Ein Weltklassespieler aus dem eigenen Haus ist das seltenste Ereignis
     der Akademie — das darf man auch sehen und spüren. */
  const grossesJahr = (p.akaEreignisse || []).some((e) => e.art === "gross");
  useEffect(() => { if (grossesJahr) haptik("gross"); }, [grossesJahr]);
  const v = p.verdict;
  const clubs = p.seasons.filter((s, i, a) => i === 0 || a[i - 1].club !== s.club);
  const share = p.nation.flag + " " + p.name + " · " + POS[p.pos].short + " · " + (p.seasons[0] ? p.seasons[0].age : 16) + "–" + p.age + "\n"
    + "Peak " + p.peakOvr + " OVR · " + p.tot.apps + " Spiele · " + p.tot.goals + " Tore · " + p.tot.assists + " Vorlagen\n"
    + p.nt.caps + " Länderspiele · " + p.trophies.length + " Titel · Vermögen " + eur(netWorth(p)) + " €\n"
    + (p.wc ? "Wildcard: " + p.wc.n + " (" + (RARITY[p.wc.r] || RARITY.normal).name + ")\n" : "")
    + "Vermächtnis: " + v.tier + " (" + v.score + " Punkte) — RASENSCHACH XI";
  return (
    <Shell wide>
      <div className="fade">
        <div className="eb">Karriereende {p.year}</div>
        <div className="d" style={{ fontSize: "clamp(32px,9vw,64px)", color: "var(--ac)" }}>{v.tier}</div>
        <p style={{ maxWidth: 560, marginTop: 8, color: "var(--mu)" }}>{v.text}</p>
        {p.endReason && <div className="pan pad" style={{ marginTop: 10, borderLeft: "3px solid var(--bad)" }}>
          <div className="eb" style={{ color: "var(--bad)" }}>Grund</div>
          <div style={{ fontSize: 13.5, marginTop: 3 }}>{p.endReason}</div></div>}
        <div style={{ marginTop: 12 }}><WildcardCard card={p.wc} /></div>
        {p.neueErfolge && p.neueErfolge.length > 0 && (
          <div className="pan pad" style={{ marginTop: 12, borderColor: "var(--go)" }}>
            <div className="eb" style={{ color: "var(--go)", marginBottom: 6 }}>
              {p.neueErfolge.length} neue Errungenschaft{p.neueErfolge.length > 1 ? "en" : ""}
            </div>
            <div className="g2">
              {p.neueErfolge.map((a) => (
                <div key={a.id} style={{ fontSize: 12 }}>
                  <span className="stufe punkt" aria-hidden="true" style={{ background: STUFEN[a.s].col }} />
                  <span>{a.n}</span>
                  {a.lohn && META[a.lohn] && (
                    <span className="m" style={{ fontSize: 10, color: "var(--ok)", display: "block" }}>
                      schaltet frei: {META[a.lohn].n}</span>)}
                </div>))}
            </div>
          </div>)}
        {grossesJahr && !RUHE && (
          <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 30, pointerEvents: "none" }}>
            <Konfetti farben={["#E8B84B", "#DCE3D8", "#E8B84B"]} staerke={1} dauer={3000} />
          </div>)}
        {p.vcGewinn != null && (() => {
          const gross = (p.akaEreignisse || []).filter((e) => e.art === "gross" || e.art === "titel");
          const rest = (p.akaEreignisse || []).filter((e) => e.art !== "gross" && e.art !== "titel");
          const zl = p.akaZiel;                       // nächster Ausbauschritt
          return (
          <div className="pan pad rs-rein" style={{ marginTop: 12, borderColor: "var(--go)",
            background: "linear-gradient(160deg,#E8B84B1A 0%,var(--pan) 58%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div className="eb" style={{ color: "var(--go)" }}>Vermächtnis-Coins verdient</div>
                <div className="m" style={{ fontSize: 10, color: "var(--mu)", marginTop: 2 }}>
                  Nicht dasselbe wie Vermächtnispunkte — die bewerten die Laufbahn,
                  die Coins bauen die Akademie.</div>
              </div>
              <div className="d" style={{ fontSize: 38, color: "var(--go)", lineHeight: 1 }}>
                +<Zahl v={p.vcGewinn} dauer={1400} /></div>
            </div>
            <div className="g2" style={{ marginTop: 8 }}>
              {(p.vcPosten || []).map((x, i) => (
                <div key={i} className="m" style={{ fontSize: 11, display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ color: "var(--mu)" }}>{x.k}</span><span>+{x.v}</span>
                </div>))}
            </div>

            {p.akaAktiv ? (<>
              {gross.length > 0 && (
                <div style={{ marginTop: 11 }}>
                  {gross.map((e, i) => (
                    <div key={i} className="rs-auf" style={{ marginTop: i ? 6 : 0, padding: "9px 11px",
                      borderRadius: 0, border: "1px solid var(--go)", background: "#E8B84B1F",
                      animationDelay: (300 + i * 220) + "ms" }}>
                      <div className="eb" style={{ color: "var(--go)" }}>
                        {e.art === "gross" ? "Aus deinem Haus" : "Titel"}</div>
                      <div className="d" style={{ fontSize: 15, marginTop: 2 }}>{e.txt}</div>
                    </div>))}
                </div>)}
              <div style={{ marginTop: 10, paddingTop: 9, borderTop: "1px solid var(--ln)" }}>
                <div className="eb">Ein Jahr in {p.akaName}</div>
                <div className="g1" style={{ gap: 3, marginTop: 5 }}>
                  {rest.map((e, i) => (
                    <div key={i} style={{ fontSize: 12.5, color: AKA_FARBE[e.art] || "var(--tx)" }}>{e.txt}</div>))}
                </div>
              </div>
            </>) : (
              <div className="m" style={{ fontSize: 11.5, color: "var(--go)", marginTop: 10 }}>
                Du hast noch keine Akademie. Die Coins liegen bereit — gegründet wird kostenlos.</div>)}

            {zl && (
              <div style={{ marginTop: 11, paddingTop: 10, borderTop: "1px solid var(--ln)" }}>
                {zl.reicht ? (<>
                  <div className="eb" style={{ color: "var(--go)" }}>Du kannst jetzt ausbauen</div>
                  <div className="d" style={{ fontSize: 16, marginTop: 2 }}>
                    {zl.name} · Stufe {zl.stufe} für {zl.preis} VC</div>
                </>) : (<>
                  <div className="eb">Nächster Schritt: {zl.name} · Stufe {zl.stufe}</div>
                  <div style={{ marginTop: 7 }}><Balken anteil={zl.anteil} farbe="var(--go)" hoehe={9} /></div>
                  <div className="m" style={{ fontSize: 11, color: "var(--mu)", marginTop: 5 }}>
                    Noch <b style={{ color: "var(--go)" }}>{zl.fehlt} VC</b> — etwa{" "}
                    {Math.max(1, Math.ceil(zl.fehlt / Math.max(20, p.vcGewinn)))} Laufbahn
                    {Math.ceil(zl.fehlt / Math.max(20, p.vcGewinn)) > 1 ? "en" : ""} von dieser Güte.</div>
                </>)}
              </div>)}

            <button className={"btn sm" + (zl && zl.reicht ? " pri" : "")} style={{ marginTop: 11 }} onClick={onAka}>
              {zl && zl.reicht ? "Jetzt ausbauen" : "Zur Jugendakademie"}</button>
          </div>); })()}
        <div className="g2" style={{ marginTop: 14 }}>
          <Pass p={p} full />
          <div className="g3" style={{ alignContent: "start" }}>
            <Stat k="Spiele" v={p.tot.apps} />
            <Stat k={p.pos === "TW" ? "Zu Null" : "Tore"} v={p.pos === "TW" ? p.tot.cs : p.tot.goals} />
            <Stat k="Vorlagen" v={p.tot.assists} />
            <Stat k="Länderspiele" v={p.nt.caps} />
            <Stat k="Titel" v={p.trophies.length} />
            <Stat k="Peak" v={p.peakOvr} acc />
            <Stat k="Vermögen" v={eur(netWorth(p)) + " €"} />
            <Stat k="Gespendet" v={eur(p.donated) + " €"} />
            <Stat k="Punkte" v={v.score} acc />
          </div>
        </div>
        <div className="pan pad" style={{ marginTop: 12 }}>
          <div className="eb" style={{ marginBottom: 7 }}>Stationen ({new Set(p.seasons.map((s) => s.club)).size})</div>
          <div className="g1">{clubs.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Crest club={s.clubRef} size={20} />
              <span style={{ fontSize: 12.5 }}>{s.club}</span>
              <span className="m" style={{ fontSize: 10, color: "var(--mu)" }}>ab {s.year} · {s.league}</span>
            </div>))}</div>
        </div>
        <div style={{ marginTop: 12 }}><Guard><StatsView p={p} /></Guard></div>
        <div className="pan pad" style={{ marginTop: 12 }}><Guard><NationalView p={p} /></Guard></div>
        <div className="pan pad" style={{ marginTop: 12 }}><Guard><TrophyView p={p} /></Guard></div>
        <div className="pan pad" style={{ marginTop: 12 }}>
          <div className="eb" style={{ marginBottom: 6 }}>Zum Teilen</div>
          <pre className="m" style={{ fontSize: 11.5, whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.65 }}>{share}</pre>
        </div>
        <div className="g1" style={{ marginTop: 18 }}>
          <button className="btn pri rs-pochen" onClick={onNew} style={{ padding: "16px 18px" }}>
            <span className="d" style={{ fontSize: 21, letterSpacing: ".02em" }}>Neue Laufbahn beginnen</span>
            <span className="m" style={{ fontSize: 11, color: "#04050A", opacity: .82, display: "block", marginTop: 3 }}>
              Zurück ins Hauptmenü, dann von vorn</span>
          </button>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn" style={{ flex: "1 1 150px" }} onClick={onHall}>Ruhmeshalle</button>
            <button className="btn" style={{ flex: "1 1 150px" }} onClick={onAka}>Jugendakademie</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ================================================================
   Hauptkomponente
   ================================================================ */
function FlutlichtApp() {
  const [phase, setPhase] = useState("menu");
  const [p, setP] = useState(null);
  const [step, setStep] = useState("training");
  const [queue, setQueue] = useState([]);
  const [ei, setEi] = useState(0);
  const [er, setEr] = useState(null);
  const [season, setSeason] = useState(null);
  const [offers, setOffers] = useState([]);
  const askCache = useRef({});
  const [growth, setGrowth] = useState(null);
  const [tab, setTab] = useState("verlauf");
  const [hall, setHall] = useState([]);
  const [save, setSave] = useState(null);
  const [seen, setSeen] = useState({});
  const [wcSeen, setWcSeen] = useState({});
  const [ach, setAch] = useState({});
  const [ges, setGes] = useState(leereBilanz());
  const [meta, setMeta] = useState({});
  const [stopAsk, setStopAsk] = useState(false);
  /* Der Laden liegt in der Laufbahn als Überlagerung, nicht als eigene Phase:
     ein Wechsel würde den Schritt verlieren, in dem man gerade steckt. */
  const [ladenAuf, setLadenAuf] = useState(false);
  const [detail, setDetail] = useState(false);
  const [simLauf, setSimLauf] = useState(false);
  const [rueckblick, setRueckblick] = useState(null);
  const [jubel, setJubel] = useState(null);
  const [enthuellung, setEnthuellung] = useState(null);
  const [ruhe, setRuheState] = useState(RUHE);
  const [ovrAlt, setOvrAlt] = useState(null);
  const [schluss, setSchluss] = useState(null);
  const [karriereRueck, setKarriereRueck] = useState(null);
  const [marken, setMarken] = useState([]);
  const [aka, setAka] = useState(leereAkademie());
  const [hsvZ, setHsvZ] = useState(0);
  const reiterRef = useRef(null);
  const [log, setLog] = useState([]);
  const topRef = useRef(null);

  /* Alles Dauerhafte aus dem Speicher holen — auch nach einer Sicherung */
  const ladeAlles = async () => {
      if (!hasStore()) return;
      try { const v = await ladeMitAltbestand(HALL_KEY); if (v) setHall(JSON.parse(v)); }
      catch (e) { /* noch keine Einträge */ }
      try { const v = await ladeMitAltbestand(SAVE_KEY); if (v) setSave(JSON.parse(v)); }
      catch (e) { /* kein Spielstand vorhanden */ }
      try { const v = await ladeMitAltbestand(SEEN_KEY); if (v) setSeen(JSON.parse(v)); }
      catch (e) { /* noch keine früheren Laufbahnen */ }
      try { const r = await store.get(ACH_KEY); if (r && r.value) setAch(JSON.parse(r.value)); }
      catch (e) { /* noch keine Errungenschaften */ }
      try { const r = await store.get(LIFE_KEY); if (r && r.value) setGes({ ...leereBilanz(), ...JSON.parse(r.value) }); }
      catch (e) { /* noch keine Gesamtbilanz */ }
      try { const r = await store.get(META_KEY); if (r && r.value) setMeta(JSON.parse(r.value)); }
      catch (e) { /* noch nichts freigeschaltet */ }
      try { const r = await store.get(WC_KEY); if (r && r.value) setWcSeen(JSON.parse(r.value)); }
      catch (e) { /* noch keine Karten erlebt */ }
      try { const r = await store.get(HSV_KEY);
        if (r && r.value != null) setHsvZ(Math.max(0, parseInt(r.value, 10) || 0)); }
      catch (e) { /* noch kein Zähler */ }
      try { const r = await store.get(AKA_KEY);
        if (r && r.value) setAka({ ...leereAkademie(), ...JSON.parse(r.value) }); }
      catch (e) { /* noch keine Akademie */ }
      try { const r = await store.get("rasenschach:ruhe");
        if (r && r.value != null) { setRuhe(r.value === "1"); setRuheState(r.value === "1"); } }
      catch (e) { /* Voreinstellung behalten */ }
      try { const r = await store.get("rasenschach:vib");
        if (r && r.value != null) setVibration(r.value === "1"); }
      catch (e) { /* Voreinstellung behalten */ }
      try { const r = await store.get("rasenschach:text");
        if (r && r.value != null) setTextstufe(parseInt(r.value, 10) || 0); }
      catch (e) { /* Voreinstellung behalten */ }
      try { const r = await store.get("rasenschach:speed");
        if (r && r.value != null) setSpeedmodus(r.value === "1"); }
      catch (e) { /* Voreinstellung behalten */ }
      try { const r = await store.get("rasenschach:schwer");
        if (r && r.value) setSchwierigkeit(r.value); }
      catch (e) { /* Voreinstellung behalten */ }
      try { const r = await store.get("rasenschach:wach");
        if (r && r.value === "1") setWach(true); }
      catch (e) { /* Voreinstellung behalten */ }
  };
  useEffect(() => { ladeAlles(); }, []);

  /* Vibration für jede Schaltfläche — an einer Stelle statt an zweiundsiebzig.
     Auf pointerdown, damit die Rückmeldung im selben Moment kommt wie die
     Berührung. Gesperrte Schaltflächen bleiben stumm, kräftige Aktionen
     (Klasse „pri") bekommen den deutlicheren Impuls. */
  useEffect(() => {
    if (typeof document === "undefined") return;
    const beiBeruehrung = (e) => {
      const el = e.target && e.target.closest ? e.target.closest("button") : null;
      if (!el || el.disabled) return;
      haptik(el.classList && el.classList.contains("pri") ? "wahl" : "tipp");
    };
    document.addEventListener("pointerdown", beiBeruehrung, true);
    return () => document.removeEventListener("pointerdown", beiBeruehrung, true);
  }, []);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ block: "start" }); }, [step, phase]);

  const clone = (x) => ({ ...x, attrs: { ...x.attrs }, flags: { ...x.flags }, evLog: { ...x.evLog },
    nt: { ...x.nt, majors: [...x.nt.majors] }, tot: { ...x.tot }, depot: { ...x.depot },
    assets: [...x.assets], milestones: [...x.milestones], seasons: [...x.seasons],
    trophies: [...x.trophies], awards: [...x.awards], squad: [...x.squad], traits: [...x.traits] });

  /* Spielstand sichern, damit man die Seite verlassen kann */
  const saveGame = async (q, st) => {
    if (!hasStore() || !q || q.retired) return;
    const stand = { v: VERSION, t: Date.now(), step: st || "training",
      p: { ...q, verdict: undefined } };
    /* `save` MUSS mitgezogen werden. Bis 34.8 schrieb dies nur in den
       Speicher — im Hauptmenü stand danach weiter der alte Stand oder gar
       keiner, obwohl gerade gespeichert worden war. Erst ein Neustart der
       App zeigte den Fortschritt. Der Zustand wird sofort gesetzt, das
       Schreiben darf danach in Ruhe laufen. */
    setSave(stand);
    try {
      await store.set(SAVE_KEY, JSON.stringify(stand));
    } catch (e) { /* Speichern nicht verfügbar */ }
  };
  const dropSave = async () => {
    if (!hasStore()) return;
    try { await store.delete(SAVE_KEY); } catch (e) {}
    setSave(null);
  };

  const saveHall = async (e) => {
    const next = [e, ...hall].sort((a, b) => b.score - a.score).slice(0, 12);
    setHall(next);
    if (!hasStore()) return;
    try { await store.set(HALL_KEY, JSON.stringify(next)); } catch (err) { /* Speichern nicht verfügbar */ }
  };
  /* Erlebte Ereignisse für kommende Laufbahnen merken, ältere verblassen lassen */
  const merkeErlebtes = async (q) => {
    const next = {};
    Object.keys(seen || {}).forEach((k) => { const v = seen[k] * .72; if (v >= .25) next[k] = v; });
    Object.keys(q.evLog || {}).forEach((k) => { next[k] = (next[k] || 0) + 1; });
    setSeen(next);
    if (!hasStore()) return;
    try { await store.set(SEEN_KEY, JSON.stringify(next)); } catch (e) { /* kein Speicher */ }
  };

  /* Errungenschaften über alle Laufbahnen hinweg festhalten */
  const merkeErfolge = async (q, akaJetzt) => {
    const A = akaJetzt || aka || leereAkademie();
    const G = bilanzErgaenzen(ges, q);
    const next = { ...(ach || {}) };
    const frei = { ...(meta || {}) };
    const neu = [];
    ACHIEVEMENTS.forEach((a) => {
      try {
        if (!next[a.id] && a.ok(q, G, A)) {
          next[a.id] = { y: q.year, name: q.name };
          neu.push(a);
          if (a.lohn) frei[a.lohn] = true;
        }
      } catch (e) { /* Bedingung nicht auswertbar */ }
    });
    const wcN = { ...(wcSeen || {}) };
    Object.keys(wcN).forEach((k) => { const v = wcN[k] * .7; if (v >= .25) wcN[k] = v; else delete wcN[k]; });
    if (q.wc) wcN[q.wc.id] = (wcN[q.wc.id] || 0) + 1;
    setGes(G); setAch(next); setMeta(frei); setWcSeen(wcN);
    q.neueErfolge = neu.map((a) => ({ id: a.id, n: a.n, s: a.s, lohn: a.lohn }));
    if (!hasStore()) return;
    try {
      await store.set(LIFE_KEY, JSON.stringify(G));
      await store.set(ACH_KEY, JSON.stringify(next));
      await store.set(META_KEY, JSON.stringify(frei));
      await store.set(WC_KEY, JSON.stringify(wcN));
    } catch (e) { /* kein Speicher */ }
  };

  const speichereHsv = async (n) => {
    setHsvZ(n);
    if (!hasStore()) return;
    try { await store.set(HSV_KEY, String(n)); } catch (e) { /* kein Speicher */ }
  };

  const speichereAka = async (n) => {
    if (!hasStore()) return;
    try { await store.set(AKA_KEY, JSON.stringify(n)); } catch (e) { /* kein Speicher */ }
  };

  /* Eine Abteilung ausbauen */
  const akaKaufen = (id) => {
    const preis = akaPreis(aka, id);
    if (preis == null || (aka.vc || 0) < preis) return;
    haptik("wahl");
    const n = { ...aka, vc: aka.vc - preis, ausgegeben: (aka.ausgegeben || 0) + preis,
      stufen: { ...aka.stufen, [id]: akaStufe(aka, id) + 1 } };
    setAka(n); speichereAka(n);
  };

  /* Im Laden kaufen. Die Coins liegen in derselben Kasse wie die der Akademie
     (`aka.vc`) — das ist Absicht: es soll wehtun, hier auszugeben.
     Was gekauft wurde, steht in `aka.laden`; einmalige Artikel bleiben dort
     stehen, laufende zählen die verbleibenden Saisons herunter. */
  const ladenKauf = (a) => {
    const kasse = aka.vc || 0;
    if (kasse < a.preis) return;
    const L = { ...(aka.laden || {}) };
    if (a.einmal && L[a.id]) return;
    if (!a.einmal && (L[a.id] || 0) > 0) return;      /* läuft schon */
    L[a.id] = a.einmal ? 1 : (a.id === "ueber99" ? 4 : 1);
    haptik("wahl");
    const n = { ...aka, vc: kasse - a.preis, ausgegeben: (aka.ausgegeben || 0) + a.preis, laden: L };
    setAka(n); speichereAka(n);
    /* Der Spieler muss die Käufe kennen: `develop`, `simulateSeason` und
       `makeOffers` lesen `p.laden`. Ohne diese Brücke wäre der Kauf gebucht
       und wirkungslos — genau die Sorte Fehler, die in diesem Projekt schon
       mehrfach vorkam (Pity-Zähler, Augenfarbe). */
    if (p) {
      const q = { ...p, laden: L };
      setP(q); saveGame(q, step);
    }
    /* Sofortwirkungen, die keine Saison brauchen. */
    if (p && (a.id === "physio" || a.id === "trainer")) {
      const q = { ...p, laden: L };
      if (a.id === "physio") { q.injury = null; q.fitness = clamp((p.fitness || 70) + 18, 0, 100); }
      if (a.id === "trainer") q.trust = Math.max(p.trust || 0, 85);
      setP(q); saveGame(q, step);
    }
  };

  const finish = (q, reason) => {
    q.verdict = verdict(q); q.retired = true; q.endReason = reason || q.endNow || null;
    /* Vermächtnis-Coins und ein Jahr Akademie */
    /* Ausgleichszähler der Rautekarte: nach jeder abgeschlossenen Laufbahn
       ohne sie steigt die Aussicht, mit ihr beginnt alles von vorn. */
    speichereHsv(q.flags.nurderhsv ? 0 : Math.max(hsvZ, q.hsvZaehler || 0) + 1);
    const vcNeu = vcFuer(q);
    const AK2 = akaVerbuchen(aka, vcNeu);
    q.vcGewinn = vcNeu; q.vcPosten = vcPosten(q);
    q.akaEreignisse = AK2.ereignisse; q.akaName = AK2.a.name; q.akaAktiv = !!AK2.a.gegruendet;
    const zl = akaNaechster(AK2.a);
    q.akaZiel = zl ? { name: zl.abt.n, stufe: zl.stufe + 1, preis: zl.preis,
      fehlt: zl.fehlt, reicht: zl.reicht, anteil: zl.anteil } : null;
    setAka(AK2.a); speichereAka(AK2.a);
    setRueckblick(null); setJubel([]); setMarken([]); setSchluss(null); setSimLauf(false);
    setKarriereRueck({ ...q, lauf: q.lauf });
    dropSave(); merkeErlebtes(q); merkeErfolge(q, AK2.a);
    setP(q); setPhase("end"); setStopAsk(false);
    /* Verein mit den meisten Einsätzen — das ist der Verein, für den man
       in Erinnerung bleibt, nicht der letzte. */
    const proVerein = {};
    q.seasons.forEach((x) => { proVerein[x.club] = (proVerein[x.club] || 0) + (x.apps || 0); });
    const heimat = Object.keys(proVerein).sort((a, b) => proVerein[b] - proVerein[a])[0] || null;
    saveHall({ name: q.name, pos: q.pos, nat: q.nation.flag, age: q.age, score: q.verdict.score,
      tier: q.verdict.tier, peak: q.peakOvr, titles: q.trophies.length, caps: q.nt.caps,
      goals: q.tot.goals, worth: netWorth(q), wc: q.wc ? q.wc.n : null, wr: q.wc ? q.wc.r : null,
      speed: !!q.speed,
      /* Ab 33.10 für die Würdigung in der Ruhmeshalle. Ältere Einträge haben
         das nicht — jede Auswertung muss ohne diese Felder auskommen. */
      avatar: q.avatar, zuege: q.zuege, g: q.g, natId: q.nation.id, von: q.year + 1 - (q.age - 16), bis: q.year + 1,
      heimat, heimatSpiele: heimat ? proVerein[heimat] : 0,
      apps: q.tot.apps, assists: q.tot.assists, saisons: q.seasons.length });
  };

  /* Alles wegräumen, was von einer vorherigen Laufbahn noch offen sein könnte */
  const einblendungenLeeren = () => {
    setRueckblick(null); setJubel([]); setMarken([]); setSchluss(null);
    setKarriereRueck(null); setSimLauf(false); setEnthuellung(null); setStopAsk(false);
  };

  const start = (cfg) => {
    const q = createPlayer({ ...cfg, seen, meta, wcSeen, aka, hsvZaehler: hsvZ });
    /* Gekauftes an den neuen Spieler weiterreichen. Ohne das wäre ein im
       Hauptmenü gekaufter Kartentausch beim Anpfiff verschwunden — bezahlt
       und weg. */
    q.laden = { ...(aka.laden || {}) };
    /* Kommt die Raute, beginnt der Zähler sofort wieder von vorn — auch dann,
       wenn die Laufbahn später abgebrochen statt beendet wird. */
    if (q.flags.nurderhsv) { q.hsvZaehler = 0; speichereHsv(0); }
    einblendungenLeeren();
    setP(q); setPhase("play"); setStep("training"); setGrowth(null); setLog([]);
    setSeason(null); setTab("verlauf"); setOvrAlt(null); setDetail(false);
    if (q.wc) setEnthuellung(q.wc);
  };

  const chooseTraining = (id) => {
    haptik("wahl");
    const q = clone(p);
    q.training = q.speed ? autoTraining(q) : id;
    setOvrAlt(p.ovr);
    setGrowth(develop(q));
    q.mv = marketValue(q);
    /* Zwei pro Saison, Punkt. Vorher war es in der HÄLFTE aller Saisons drei
       (chance(.5) ? 2 : 3) — das war zu viel, eine Saison bestand fast nur aus
       Entscheidungen. Drei gibt es jetzt nur mit der Freischaltung „Bewegtes
       Leben", und auch dann nur in jeder vierten Saison. Damit bekommt die
       Freischaltung erst ihren Sinn: vorher senkte sie die Zahl nicht, sie
       verschob nur eine ohnehin hohe Wahrscheinlichkeit. */
    const evs = drawEvents(q, q.speed ? 1 : (meta.mx_events && chance(.25) ? 3 : 2));
    evs.forEach((e) => { q.evLog[e.id] = q.seasons.length; });
    setP(q); setQueue(evs); setEi(0); setEr(null); setLog([]);
    if (evs.length) setStep("event"); else runSeason(q);
  };
  const resolve = (choice) => {
    const q = clone(p);
    let out;
    if (choice.roll) {
      const r = Math.random(); let acc = 0;
      out = choice.roll[choice.roll.length - 1];
      for (const o of choice.roll) { acc += o.p; if (r <= acc) { out = o; break; } }
    } else out = { text: choice.text, fx: choice.fx };
    const extra = [];
    applyFx(q, out.fx, extra);
    q.ovr = ovrOf(q.attrs, q.pos);
    q.mv = marketValue(q);
    setP(q);
    setEr({ text: evText(out.text, queue[ei] ? queue[ei]._ctx : {}), extra });
  };
  const nextEvent = () => {
    if (p.endNow) { finish(clone(p)); return; }
    if (ei + 1 < queue.length) { setEi(ei + 1); setEr(null); }
    else if (p.flags.winterMove) {
      const q = clone(p);
      setEr(null); setOffers(makeOffers(q)); setStep("winter");
    }
    else {
      setEr(null);
      if (RUHE) { runSeason(p); return; }
      setSimLauf(true);
      setTimeout(() => { setSimLauf(false); runSeason(p); }, 1250);
    }
  };
  /* Wechsel mitten in der Saison als Folge eines Ereignisses */
  const winterAccept = (o) => {
    const q = clone(p);
    q.flags.winterMove = false; q.flags.wechselwunsch = false;
    if (o) {
      q.prevClub = p.club.n; q.flags.justMoved = true;
      if (o.type === "loan") { q.loanHome = p.club; q.flags.aufLeihe = true; }
      else { q.loanHome = null; q.flags.aufLeihe = false; }
      q.club = o.club; q.squad = makeSquad(o.club, q.g); q.trust = 50; q.flags.kapitaen = false;
      if (o.type === "transfer") { q.contract = o.years; q.wage = o.wage; q.money += (o.signOn || 0) * .5; }
      else q.wage = o.wage;
      q.europeNext = null;
      q.mv = marketValue(q);
    }
    setP(q); runSeason(q);
  };
  const runSeason = (base) => {
    const q = clone(base);
    const vorher = { tot: { ...base.tot }, nt: { caps: base.nt.caps } };
    const s = simulateSeason(q);
    setMarken(markenPruefen(vorher, q).map((m) => ({ ...m, lauf: q.lauf })));
    if (q.speed) { const kauf = []; autoKauf(q, kauf); if (kauf.length) s.notes = [...(s.notes || []), ...kauf]; }
    else { const vk = []; verwalterRunde(q, vk); if (vk.length) s.notes = [...(s.notes || []), ...vk]; }
    const erste = makeOffers(q);
    /* Steht das Ende ohnehin fest, wird nicht erst noch ein Markt vorgegaukelt */
    const ausAlter = q.age >= 40 || (q.age >= 35 && q.ovr < 56) || (q.age >= 33 && q.ovr < 48);
    if (!erste.length || ausAlter) {
      setSeason(s); setP(q); setRueckblick({ p: q, s, lauf: q.lauf });
      const nt0 = (s.ntMajor && s.ntMajor.res === "Titel") ? [s.ntMajor.turnier + " " + s.ntMajor.y] : [];
      const v0 = (s.trophies || []).filter((t) => !nt0.includes(t));
      const jr = [];
      if (v0.length) jr.push({ titel: v0, club: s.clubRef, lauf: q.lauf });
      if (nt0.length) jr.push({ titel: nt0, land: q.nation, lauf: q.lauf });
      if (jr.length) setJubel(jr);
      setSchluss({ q, lauf: q.lauf, grund: ausAlter ? "Der Körper macht es nicht mehr mit."
        : "Kein Verein meldet sich mehr." });
      return;
    }
    askCache.current = { [q.wageAsk]: erste,
      _eigen: erste.filter((o) => o.type === "stay" || o.type === "renew") };
    setSeason(s); setP(q); setOffers(erste); setStep("result"); setTab("tabelle"); saveGame(q, "result");
    /* Erst der Rückblick, danach — falls etwas gewonnen wurde — der Jubel */
    setRueckblick({ p: q, s, lauf: q.lauf });
    /* Vereinstitel und Titel mit der Nationalmannschaft getrennt feiern */
    const ntTitel = (s.ntMajor && s.ntMajor.res === "Titel") ? [s.ntMajor.turnier + " " + s.ntMajor.y] : [];
    const vereinTitel = (s.trophies || []).filter((t) => !ntTitel.includes(t));
    const jubelReihe = [];
    if (vereinTitel.length) jubelReihe.push({ titel: vereinTitel, club: s.clubRef, lauf: q.lauf });
    if (ntTitel.length) jubelReihe.push({ titel: ntTitel, land: q.nation, lauf: q.lauf });
    if (jubelReihe.length) setJubel(jubelReihe);
  };
  const accept = (o) => {
    const q = clone(p);
    if (o.type === "transfer" || o.type === "loan") {
      q.prevClub = p.club.n; q.flags.justMoved = true;
      if (o.type === "loan") { q.loanHome = p.club; q.flags.aufLeihe = true; }
      else { q.loanHome = null; q.flags.aufLeihe = false; }
      q.club = o.club; q.squad = makeSquad(o.club, q.g); q.trust = 52;
      q.flags.kapitaen = false;   // die Binde wird beim neuen Verein neu vergeben
      if (o.type === "transfer") { q.contract = o.years; q.wage = o.wage; q.money += o.signOn || 0; }
      else { q.wage = o.wage; }
      q.europeNext = o.club.s >= 74 ? CONT(o.club, 4) : null;
    } else if (o.type === "renew") { q.contract = o.years; q.wage = o.wage; q.money += o.signOn || 0; }
    else if (o.type === "return") {
      q.flags.warAufLeihe = true;                     // Merker für spätere Ereignisse
      q.club = o.club; q.squad = makeSquad(o.club, q.g); q.trust = 55;
      q.flags.kapitaen = false;   // die Binde wird beim neuen Verein neu vergeben
      q.loanHome = null; q.flags.aufLeihe = false; q.flags.justMoved = true;
      q.prevClub = p.club.n; q.wage = wageFor(q, o.club);
      q.europeNext = o.club.s >= 74 ? CONT(o.club, 4) : null;
    }
    q.age += 1; q.year += 1; q.mv = marketValue(q);
    if (q.age >= 41 || (q.age >= 34 && q.ovr < 58 && chance(.5))) { finish(q, "Es kam kein Angebot mehr, das noch Sinn ergab."); return; }
    /* Die Frage kam ab 33 in jeder dritten Saison wieder — bis zu fünfmal in
       einer Laufbahn, auch wenn man auf dem Zenit stand. Jetzt EINMAL, und
       nur wenn die Stärke wirklich nachgelassen hat: mindestens 4 Punkte
       unter dem eigenen Höchstwert. Wer mit 36 noch auf seinem Bestwert
       spielt, wird nicht gefragt. */
    if (q.age >= 33 && !q.flags.renteGefragt && (q.peakOvr - q.ovr) >= 4) {
      q.flags.renteGefragt = true; setP(q); setStep("retire"); return; }
    setP(q); setGrowth(null); setStep("training"); setTab("verlauf"); saveGame(q, "training");
  };
  const quickSim = (n) => {
    let q = clone(p);
    const lines = [];
    for (let i = 0; i < n; i++) {
      if (q.age >= 41) break;
      develop(q); q.mv = marketValue(q);
      const evs = drawEvents(q, 2);
      evs.forEach((e) => {
        q.evLog[e.id] = q.seasons.length;
        const ch = pick(e.choices);
        let out;
        if (ch.roll) { const r = Math.random(); let acc = 0; out = ch.roll[ch.roll.length - 1];
          for (const o of ch.roll) { acc += o.p; if (r <= acc) { out = o; break; } } } else out = { fx: ch.fx };
        applyFx(q, out.fx); q.ovr = ovrOf(q.attrs, q.pos);
      });
      if (q.endNow) { setLog(lines); finish(q); return; }
      const s = simulateSeason(q);
      lines.push(s.year + " · " + s.club + " · " + s.apps + " Sp · "
        + (s.pos === "TW" ? s.cs + " zu Null" : s.goals + " Tore") + " · Note " + s.note.toFixed(1)
        + (s.trophies.length ? " · " + s.trophies.join(", ") : "") + (s.move ? " · " + (s.move.dir === "auf" ? "Aufstieg" : "Abstieg") : ""));
      const of = makeOffers(q);
      if (!of.length) { setLog(lines); finish(q, "Es kam kein Angebot mehr, das noch Sinn ergab."); return; }
      const best = [...of].sort((a, b) => {
        const w = (x) => (x.roleKey === "star" || x.roleKey === "start" ? 30 : x.roleKey === "rot" ? 10 : 0) + x.club.s;
        return w(b) - w(a); })[0];
      if (best.type === "transfer" || best.type === "loan") {
        q.club = best.club; q.squad = makeSquad(best.club, q.g); q.trust = 52;
      q.flags.kapitaen = false;   // die Binde wird beim neuen Verein neu vergeben
        if (best.type === "transfer") { q.contract = best.years; q.wage = best.wage; }
        q.europeNext = best.club.s >= 74 ? CONT(best.club, 4) : null;
      } else if (best.type === "renew") { q.contract = best.years; q.wage = best.wage; }
      q.age += 1; q.year += 1; q.mv = marketValue(q);
      if (q.age >= 41 || (q.age >= 35 && q.ovr < 58)) { setLog(lines); finish(q); return; }
    }
    setLog(lines); setP(q); setGrowth(null); setStep("training"); setSeason(null); setTab("verlauf");
  };

  /* Beim Umschalten der Gehaltsstufe werden die Angebote je Stufe einmal
     berechnet und dann behalten — sonst wechselten die Vereine bei jedem Klick. */
  /* Beim Umschalten der Gehaltsstufe ändern sich nur die fremden Angebote.
     Der eigene Verein bleibt, wie er ist.                                 */
  const setAsk = (k) => {
    const q = clone(p); q.wageAsk = k;
    const c = askCache.current;
    if (!c[k]) {
      const neu = makeOffers(q);
      const eigen = (c._eigen || []).length ? c._eigen : neu.filter((o) => o.type === "stay" || o.type === "renew");
      c._eigen = eigen;
      c[k] = [...eigen, ...neu.filter((o) => o.type !== "stay" && o.type !== "renew")];
    }
    setP(q); setOffers(c[k]);
  };
  const forceMove = () => {
    const q = clone(p);
    q.flags.wechselwunsch = true; q.flags.wechselwunschAlt = true;
    q.trust = clamp(q.trust - 14, 3, 98); q.rep = clamp(q.rep + 4, 0, 100); q.morale = clamp(q.morale - 4, 5, 100);
    const neu = makeOffers(q);
    askCache.current = { [q.wageAsk]: neu,
      _eigen: neu.filter((o) => o.type === "stay" || o.type === "renew") };
    setP(q); setOffers(neu);
  };

  const buy = (id, cost) => {
    const q = clone(p); const it = shopItem(id);
    if (!it || q.assets.includes(id) || q.money < cost) return;
    q.money -= cost; q.assets.push(id); applyFx(q, it.fx);
    q.ovr = ovrOf(q.attrs, q.pos); setP(q);
  };
  const invest = (id, amt) => {
    const q = clone(p); if (q.money < amt) return;
    q.money -= amt; q.depot[id] = (q.depot[id] || 0) + amt; setP(q);
  };
  const sell = (id) => { const q = clone(p); q.money += q.depot[id] || 0; q.depot[id] = 0; setP(q); };
  const donate = (v) => {
    const q = clone(p); if (q.money < v) return;
    q.money -= v; q.donated += v;
    q.rep = clamp(q.rep + Math.min(10, v * 4), 0, 100);
    q.morale = clamp(q.morale + Math.min(8, v * 3), 0, 100);
    setP(q);
  };

  if (phase === "menu") return <MenuScreen hall={hall} save={save}
    onNew={() => { dropSave(); setPhase("create"); }}
    onResume={() => { if (save && save.p) { einblendungenLeeren();
      setP(save.p); setPhase("play"); setStep("training");
      setGrowth(null); setSeason(null); setLog([]); setTab("verlauf"); setOvrAlt(null); } }}
    onHall={() => setPhase("hall")} onAch={() => setPhase("erfolge")}
    achN={ACHIEVEMENTS.filter((a) => ach && ach[a.id]).length}
    metaN={Object.keys(meta || {}).filter((k) => META[k]).length}
    onBackup={() => setPhase("sicherung")}
    aka={aka} onAka={() => setPhase("akademie")} onLaden={() => setPhase("laden")}
    meta={meta} aufRahmen={(k) => { const n = { ...(meta || {}), rahmenWahl: k };
      setMeta(n); store.set(META_KEY, JSON.stringify(n)); }}
    ruhe={ruhe} setRuhe={setRuhe} setRuheState={setRuheState} />;
  if (phase === "akademie") return <AkademieScreen aka={aka} onKauf={akaKaufen}
    onGruenden={(n) => { const x = akaGruenden(aka, n, (aka && aka.jahr) || 2026);
      setAka(x); speichereAka(x); }}
    onBack={() => setPhase(p && p.retired ? "end" : "menu")} />;
  if (phase === "hall") return <HallScreen hall={hall} onBack={() => setPhase(p && p.retired ? "end" : "menu")} />;
  if (phase === "erfolge") return <AchievementScreen ach={ach} ges={ges} meta={meta} onBack={() => setPhase("menu")} />;
  if (phase === "sicherung") return <BackupScreen onBack={() => setPhase("menu")} onImport={ladeAlles} />;
  /* Der Laden heisst im Heft „Anzeigen" — eine Seite mit Angeboten, wie sie
     in jedem Sportheft steht. */
  if (phase === "laden") return (
    <Shell blatt="laden">
      <LadenSeite wo={p ? "saison" : "start"} vc={aka.vc || 0} laden={aka.laden}
        onKauf={ladenKauf} onBack={() => setPhase("menu")} />
    </Shell>);
  if (phase === "create") return <CreateScreen onStart={start} onBack={() => setPhase("menu")} meta={meta} />;
  if (!p) return null;
  /* Der Rückblick auf die Laufbahn liegt über allem — sonst käme er nie zum
     Zug, weil der Abschlussbildschirm eine eigene Ansicht ist.          */
  /* Der Karriere-Rückblick gehört nur zu einer tatsächlich beendeten Laufbahn */
  if (karriereRueck && karriereRueck.retired && phase === "end")
    return <KarriereRueckblick p={karriereRueck} onFertig={() => setKarriereRueck(null)} />;
  if (phase === "end") return <EndScreen p={p}
    onNew={() => { einblendungenLeeren(); setP(null); setPhase("menu"); }}
    onAka={() => setPhase("akademie")}
    onHall={() => setPhase("hall")} />;

  const rival = rivalOf(p.squad, p.pos);
  const role = roleFor(p.ovr, p.club.s, p.trust, rival ? rival.ovr : null);
  const steps = ["training", "event", "result"];
  const stepLbl = step === "winter" ? "event" : step;
  const si = Math.max(0, steps.indexOf(stepLbl === "retire" ? "result" : stepLbl));
  const TABS = [["verlauf", "Verlauf"], ["statistik", "Statistik"], ["tabelle", "Tabelle"],
    ["laender", "Länderspiele"], ["kader", "Kader"], ["oeffentlich", "Öffentlichkeit"],
    ["vermoegen", "Vermögen"], ["vitrine", "Vitrine"]];

  return (
    <Shell wide blatt="laufbahn">
      <div ref={topRef} />
      <div className="tbar" style={{ margin: "-14px -12px 12px", padding: "9px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Crest club={p.club} size={28} />
          <div style={{ flex: "1 1 130px" }}>
            <div className="m" style={{ fontSize: 11.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.club.n}</div>
            <div className="eb">{p.club.l}</div>
          </div>
          {/* Saison, Alter, Stärke, Konto sind dieselbe Art Angabe wie Block,
              Reihe und Platz auf einer Eintrittskarte — also auch dieselbe Form. */}
          <div className="m zellen" style={{ fontSize: 11 }}>
            <div><span className="eb">Saison</span>{p.year}/{String(p.year + 1).slice(2)}</div>
            <div><span className="eb">Alter</span>{p.age}</div>
            <div><span className="eb">Stärke</span>
              <span style={{ color: "var(--ac)" }}><Zahl v={p.ovr} /></span>
              <Delta v={ovrAlt != null ? p.ovr - ovrAlt : 0} klein />
            </div>
            <div><span className="eb">Konto</span>{eur(p.money)}</div>
          </div>
          {/* Zugang zum Laden auch mitten in der Laufbahn — die meisten Artikel
              ergeben erst dort Sinn. Zeigt den Kassenstand, damit man nicht
              erst hineinklicken muss, um zu sehen, ob sich das lohnt. */}
          <button className="btn sm" onClick={() => setLadenAuf(true)}
            style={{ padding: "5px 9px", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
              {SHOP_BILD.stern("var(--go)")}
            </svg>
            <span className="m" style={{ fontSize: 11, color: "var(--go)" }}>{aka.vc || 0} VC</span>
          </button>
          <div style={{ marginLeft: "auto" }}><Schritte aktiv={stepLbl === "retire" ? "result" : stepLbl} /></div>
        </div>
      </div>

      <div className="main">
        <div className="a-pass"><Pass p={p} full /></div>
        <div className="a-zustand g1" style={{ alignContent: "start" }}>
          <div className="pan pad">
            <div className="eb" style={{ marginBottom: 8 }}>Zustand</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" }}>
              <Meter label="Form" v={p.form} /><Meter label="Fitness" v={p.fitness} />
              <Meter label="Moral" v={p.morale} /><Meter label="Vertrauen" v={p.trust} />
              <Meter label="Bekanntheit" v={p.rep} /><Meter label="Verletzungsrisiko" v={p.injuryProne} inv />
            </div>
            <div className="m" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 10.5, marginTop: 11, paddingTop: 10, borderTop: "1px solid var(--ln)" }}>
              <div><div className="eb">Rolle</div>{role.label}</div>
              <div><div className="eb">Vertrag</div>{p.contract > 0 ? p.contract + " J." : "läuft aus"}</div>
              <div><div className="eb">Gehalt</div>{eur(p.wage)} €</div>
              <div><div className="eb">Marktwert</div>{eur(p.mv)} €</div>
            </div>
            {detail && (
              <div className="m" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 10.5, marginTop: 9 }}>
                <div><div className="eb">International</div>{p.europeNext || "—"}</div>
                <div><div className="eb">Nationalteam</div>{p.nt.level === "none" ? "—"
                  : p.nt.level === "A" ? "A · " + p.nt.caps + (p.nt.rolle ? " (" + p.nt.rolle + ")" : "")
                  : p.nt.level + " · " + (p.nt.uCaps || 0)}</div>
                <div><div className="eb">Privat</div>{LIFE[p.life.status]}{p.life.partner ? " · " + p.life.partner : ""}</div>
                <div><div className="eb">Kinder</div>{p.life.kids || "—"}</div>
                <div><div className="eb">Vereinstreue</div>{(() => { const n = loyalty(p); const r = legendRank(n);
                  return n <= 0 ? "1. Jahr" : n + " J." + (r ? " · " + r.t : ""); })()}</div>
                <div><div className="eb">Amt</div>{p.flags.kapitaen ? (p.nt.kapitaen ? "Kapitän · Land" : "Kapitän") : p.nt.kapitaen ? "Kapitän Land" : "—"}</div>
              </div>)}
            <button className="btn sm" style={{ marginTop: 9, padding: "3px 9px" }} onClick={() => setDetail(!detail)}>
              <span className="m" style={{ fontSize: 10, color: "var(--mu)" }}>{detail ? "weniger" : "mehr anzeigen"}</span>
            </button>
            {p.wc && (() => { const r = RARITY[p.wc.r] || RARITY.normal; return (
              <div style={{ marginTop: 11, paddingTop: 9, borderTop: "1px solid var(--ln)" }}>
                <div className="eb" style={{ color: r.col }}>Wildcard</div>
                <div className="d" style={{ fontSize: 15, marginTop: 1 }}>{p.wc.n}</div>
              </div>); })()}
          </div>
        </div>

        <div className="a-buehne g1" style={{ alignContent: "start", minWidth: 0 }}>
          {step === "training" && (
            <div className="fade g1">
              {p.seasons.length === 0 && p.wc && (
                <div>
                  <div className="eb" style={{ marginBottom: 6 }}>Deine Karte für diese Laufbahn</div>
                  <WildcardCard card={p.wc} big rerollLeft={tauschRest(p) > 0} rerollN={tauschRest(p)}
                    onReroll={() => { const q = rerollWildcard(clone(p)); setP(q); saveGame(q, "training");
                      if (q.wc) setEnthuellung(q.wc); }} />
                </div>)}
              {growth && Object.keys(growth).length > 0 && (
                <div className="up" style={{ padding: "8px 11px" }}>
                  <span className="eb">Entwicklung</span>{" "}
                  {Object.entries(growth).map(([k, v]) => (
                    <span key={k} className="m" style={{ fontSize: 11, marginRight: 10, color: v > 0 ? "var(--ok)" : "var(--bad)" }}>
                      {aLab(p.pos, k)} {sgn(v)}{v}</span>))}
                </div>)}
              {log.length > 0 && (
                <div className="up" style={{ padding: "9px 11px" }}>
                  <div className="eb" style={{ marginBottom: 4 }}>Schnellsimulation</div>
                  {log.map((l, i) => <div key={i} className="m" style={{ fontSize: 10.5, color: "var(--mu)", lineHeight: 1.7 }}>{l}</div>)}
                </div>)}
              <div className="pan pad">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
                  <div className="d" style={{ fontSize: 19 }}>{p.speed ? "Saison beginnen" : "Trainingsschwerpunkt"}</div>
                  <div className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>Saison {p.year}/{String(p.year + 1).slice(2)}</div>
                </div>
                {p.speed ? (() => {
                  const t = TRAINING.find((x) => x.id === autoTraining(p)) || TRAINING[0];
                  return (<>
                    <p style={{ fontSize: 12, color: "var(--mu)", marginTop: 4 }}>
                      Der Trainerstab wählt für dich — nach Position und größtem Rückstand.
                    </p>
                    <div className="up pad" style={{ marginTop: 10 }}>
                      <div className="eb" style={{ color: "var(--go)" }}>Vorgesehen</div>
                      <div className="d" style={{ fontSize: 17, marginTop: 2 }}>{t.name}</div>
                      <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginTop: 3 }}>
                        {Object.keys(t.bias).length ? Object.keys(t.bias).map((k) => aLab(p.pos, k)).join(" · ") : "Erholung"}</div>
                    </div>
                    <button className="btn pri" style={{ marginTop: 12 }} onClick={() => chooseTraining(t.id)}>
                      <span className="d" style={{ fontSize: 16 }}>Saison starten</span>
                    </button>
                  </>);
                })() : (<>
                  <p style={{ fontSize: 12, color: "var(--mu)", marginTop: 4 }}>Wohin dein Fortschritt fließt.</p>
                  <div className="g3" style={{ marginTop: 10 }}>
                    {TRAINING.map((t) => (
                      <button key={t.id} className="btn" onClick={() => chooseTraining(t.id)}>
                        <div className="d" style={{ fontSize: 14 }}>{t.name}</div>
                        <div className="m" style={{ fontSize: 9.5, color: "var(--mu)", marginTop: 3 }}>
                          {Object.keys(t.bias).length ? Object.keys(t.bias).map((k) => aLab(p.pos, k)).join(" · ") : "Erholung"}</div>
                      </button>))}
                  </div>
                </>)}
              </div>
            </div>)}

          {step === "event" && queue[ei] && (() => {
            const e = queue[ei], ctx = e._ctx;
            return (
              <div className="fade g1">
              <div className="pan pad">
                {!er && queue.length > 1 && (
                  <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", marginBottom: 7,
                    letterSpacing: ".08em" }}>
                    Ereignis {ei + 1} von {queue.length}</div>)}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span className={"chip " + (e.tag === "Zwielichtig" ? "r" : "a")}>{e.tag}</span>
                </div>
                <div className="d" style={{ fontSize: "clamp(20px,4.5vw,27px)" }}>{evText(e.title, ctx)}</div>
                <p style={{ marginTop: 9 }}>{evText(e.text, ctx)}</p>
                {!er ? (
                  <div className="g1" style={{ marginTop: 14 }}>
                    {e.choices.map((c, i) => (
                      <button key={i} className="btn" onClick={() => resolve(c)}>
                        {/* Auch durch evText: die Auswahlmöglichkeiten liefen
                            zuerst daran vorbei und wären bei einer Spielerin
                            männlich geblieben. */}
                        <div className="d" style={{ fontSize: 15 }}>{evText(c.label, ctx)}</div>
                        {c.hint && <div style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 2 }}>{evText(c.hint, ctx)}</div>}
                      </button>))}
                  </div>
                ) : (
                  <div style={{ marginTop: 14 }}>
                    <div className="up pad" style={{ borderLeft: "3px solid var(--ac)" }}>
                      <p>{er.text}</p>
                      {er.extra.map((x, i) => <p key={i} className="m" style={{ fontSize: 11, color: "var(--ac)", marginTop: 6 }}>{x}</p>)}
                      {p.endNow && <p className="m" style={{ fontSize: 11.5, color: "var(--bad)", marginTop: 8 }}>{p.endNow}</p>}
                    </div>
                    <button className="btn pri" style={{ maxWidth: 230, marginTop: 12 }} onClick={nextEvent}>
                      <span className="d" style={{ fontSize: 15 }}>
                        {p.endNow ? "Bilanz ziehen" : ei + 1 < queue.length ? "Weiter" : "Saison simulieren"}</span>
                    </button>
                  </div>)}
              </div>
              </div>);
          })()}

          {step === "result" && season && (
            <div className="fade g1">
              {/* Zuerst der Transfermarkt: Nach dem Saisonrückblick will man
                  weiterspielen, nicht noch einmal dieselben Zahlen lesen. */}
              <div className="pan pad">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
                  <div className="d" style={{ fontSize: 18 }}>Transferfenster {p.year + 1}</div>
                  <div className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>aktuell {eur(p.wage)} €/Jahr</div>
                </div>
                <p style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 3 }}>
                  Nur Vereine, die dich bezahlen können — und zu denen der Weg realistisch ist.</p>
                {offers.length > 0 && (() => {
                  const t = offers.filter((o) => o.type === "transfer").length;
                  const l = offers.filter((o) => o.type === "loan").length;
                  const lander = [...new Set(offers.filter((o) => o.type === "transfer").map((o) => o.club.c))].length;
                  return (
                    <div className="m" style={{ fontSize: 10.5, color: "var(--go)", marginTop: 5 }}>
                      Marktlage: {t} Angebot{t === 1 ? "" : "e"}{l > 0 ? ", " + l + " Leihe" + (l === 1 ? "" : "n") : ""}
                      {lander > 1 ? " aus " + lander + " Ländern" : ""}
                    </div>);
                })()}

                <div className="up" style={{ padding: 10, marginTop: 10 }}>
                  <div style={{ fontSize: 11.5, color: "var(--mu)" }}>
                    Nur Vereine, die dich bezahlen können. Nach Gehalt sortiert.
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                    {p.contract > 0 && !p.flags.wechselwunsch && (
                      <button className="btn sm" onClick={() => forceMove()}>Wechselwunsch anmelden</button>)}
                    {p.flags.wechselwunsch && <span className="chip r" style={{ alignSelf: "center" }}>Wechselwunsch läuft</span>}
                  </div>
                  {p.contract <= 1 && (
                    <div className="m" style={{ fontSize: 10.5, color: "var(--go)", marginTop: 8 }}>
                      {p.contract === 0 ? "Dein Vertrag ist ausgelaufen — du bist ablösefrei." :
                        "Letztes Vertragsjahr. Verlängern oder jetzt schon wechseln."}
                    </div>)}
                </div>
                {offers.some((o) => o.type === "stay" || o.type === "renew") && (
                  <div style={{ marginTop: 10 }}>
                    <div className="eb" style={{ marginBottom: 6, color: "var(--ok)" }}>Dein Verein</div>
                    <div className="g1">
                      {offers.filter((o) => o.type === "stay" || o.type === "renew").map((o, i) => {
                        const dd = p.wage > 0 ? (o.wage / p.wage - 1) * 100 : 0;
                        return (
                          <button key={"e" + i} className="btn" style={{ borderColor: "var(--ok)" }} onClick={() => accept(o)}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                              <Crest club={o.club} size={26} />
                              <div style={{ flex: "1 1 140px" }}>
                                <div className="d" style={{ fontSize: 15, color: "var(--ok)" }}>
                                  {o.type === "stay" ? "Laufenden Vertrag erfüllen" : (o.kind || "Vertrag verlängern")}
                                </div>
                                <div className="m" style={{ fontSize: 10, color: "var(--mu)" }}>
                                  {o.club.n} · noch {o.years} {o.years === 1 ? "Jahr" : "Jahre"} · {o.role}
                                </div>
                              </div>
                              <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", textAlign: "right" }}>
                                <div>{eur(o.wage)} €{Math.abs(dd) >= 3 && (
                                  <span style={{ color: dd > 0 ? "var(--ok)" : "var(--bad)", marginLeft: 5 }}>{sgn(dd)}{Math.round(dd)} %</span>)}</div>
                                {o.signOn > 0 && <div>Handgeld {eur(o.signOn)} €</div>}
                              </div>
                            </div>
                          </button>);
                      })}
                    </div>
                    <div className="m" style={{ fontSize: 10, color: "var(--mu)", marginTop: 5 }}>
                      Unabhängig vom Gehaltsanspruch.
                    </div>
                  </div>)}

                {/* Hier endet die Saison und der Markt beginnt — die einzige
                    Stelle im Spiel, an der abgetrennt wird. */}
                <div className="perf" aria-hidden="true" />
                <div className="eb" style={{ margin: "0 0 6px", color: "var(--ac)" }}>Angebote anderer Vereine</div>
                <div className="g1">
                  {!offers.filter((o) => o.type !== "stay" && o.type !== "renew").length && (
                    <div className="up pad">
                      <div style={{ fontSize: 12, color: "var(--mu)" }}>
                        Kein anderer Verein meldet sich in diesem Fenster.</div>
                    </div>)}
                  {!offers.length && (
                    <div className="up pad">
                      <div className="d" style={{ fontSize: 16 }}>Kein Verein meldet sich</div>
                      <button className="btn pri sm" style={{ marginTop: 10 }} onClick={() => finish(clone(p), "Es kam kein Angebot mehr, das noch Sinn ergab.")}>Bilanz ziehen</button>
                    </div>)}
                  {offers.filter((o) => o.type !== "stay" && o.type !== "renew").map((o, i) => {
                    const d = p.wage > 0 ? (o.wage / p.wage - 1) * 100 : 0;
                    return (
                      <button key={i} className={"btn" + (o.dream || o.traum ? " on" : "")} onClick={() => accept(o)}
                        style={o.traum ? { borderColor: "var(--go)" } : undefined}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <Crest club={o.club} size={26} />
                          <div style={{ flex: "1 1 130px" }}>
                            <div className="d" style={{ fontSize: 15, color: o.traum ? "var(--go)" : o.dream ? "var(--ac)" : "var(--tx)" }}>
                              {o.type === "stay" ? "Vertrag erfüllen" : o.type === "renew" ? "Verlängern bei " + o.club.n : o.type === "loan" ? "Leihe: " + o.club.n : o.type === "return" ? "Zurück zu " + o.club.n : o.club.n}
                            </div>
                            <div className="m" style={{ fontSize: 10, color: "var(--mu)" }}>{o.club.l} · Stärke {o.club.s}</div>
                            {o.kind && <span className={"chip " + (o.type === "loan" ? "a" : o.kind.indexOf("Geld") >= 0 ? "g" : "")}
                              style={{ marginTop: 3 }}>{o.kind}</span>}
                          </div>
                          <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", textAlign: "right" }}>
                            <div style={{ color: o.roleKey === "star" || o.roleKey === "start" ? "var(--ok)" : o.roleKey === "rot" ? "var(--go)" : "var(--bad)" }}>{o.role}</div>
                            <div>{eur(o.wage)} € · {o.years} J.
                              {o.type !== "stay" && Math.abs(d) >= 5 &&
                                <span style={{ color: d > 0 ? "var(--ok)" : "var(--bad)", marginLeft: 5 }}>{sgn(d)}{Math.round(d)} %</span>}</div>
                            {o.fee > 0 && <div>Ablöse {eur(o.fee)} €</div>}
                            {o.signOn > 0 && <div style={{ color: "var(--go)" }}>Handgeld {eur(o.signOn)} €</div>}
                          </div>
                        </div>
                      </button>);
                  })}
                </div>
              </div>

              <div className="pan pad">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Crest club={season.clubRef} size={32} />
                    <div>
                      <div className="d" style={{ fontSize: 22 }}>{season.year}</div>
                      <div className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>
                        {season.role} · Platz {season.rank} von {season.N}{season.europe ? " · " + season.europe : ""}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="d" style={{ fontSize: 34, color: noteCol(season.note) }}>{season.note.toFixed(1)}</div>
                    <div className="eb">Note</div>
                  </div>
                </div>
                <div className="g3" style={{ marginTop: 11 }}>
                  <Stat k="Spiele" v={season.apps} />
                  <Stat k={p.pos === "TW" ? "Zu Null" : "Tore"} v={p.pos === "TW" ? season.cs : season.goals} />
                  <Stat k="Vorlagen" v={season.assists} />
                  <Stat k="Marktwert" v={eur(season.mv)} acc />
                  <Stat k="Konto" v={eur(p.money)} />
                  <Stat k="Vermögen" v={eur(netWorth(p))} />
                </div>
                {season.move && (
                  <div className="up" style={{ padding: "8px 11px", marginTop: 9, borderLeft: "3px solid " + (season.move.dir === "auf" ? "var(--go)" : "var(--bad)") }}>
                    <span style={{ fontSize: 12.5 }}>{season.move.dir === "auf"
                      ? "Aufstieg! Nächste Saison spielst du in der " + season.move.l + "."
                      : "Abstieg. Nächste Saison " + season.move.l + "."}</span>
                  </div>)}
                {season.injury && (
                  <div className="up" style={{ padding: "8px 11px", marginTop: 9, borderLeft: "3px solid var(--bad)" }}>
                    <span className="eb" style={{ color: "var(--bad)" }}>Ausfall</span>
                    <div style={{ fontSize: 12.5, marginTop: 3 }}>Verletzung ({season.injury.sev}) — {season.injury.games} Spiele verpasst.
                      {season.injury.sev === "schwer" && " Tempo und Physis haben dauerhaft gelitten."}</div>
                  </div>)}
                {(season.trophies.length > 0 || season.awards.length > 0 || season.milestones.length > 0) && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 9 }}>
                    {season.trophies.map((t, i) => <span key={i} className="chip g">{t}</span>)}
                    {season.awards.map((a, i) => <span key={"a" + i} className="chip">{a}</span>)}
                    {season.milestones.map((m, i) => <span key={"m" + i} className="chip a">Meilenstein: {m}</span>)}
                  </div>)}
                {(season.ntCaps > 0 || season.ntNote) && (
                  <div className="m" style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 9 }}>
                    {p.nation.flag} {season.ntCaps > 0 ? season.ntCaps + " Länderspiele, " + season.ntGoals + " Tore." : ""}{season.ntNote ? " " + season.ntNote + "." : ""}
                  </div>)}
              </div>
            </div>)}

          {step === "winter" && (
            <div className="pan pad fade">
              <span className="chip g">Wintertransferfenster</span>
              <div className="d" style={{ fontSize: 22, marginTop: 8 }}>Sofort wechseln?</div>
              <p style={{ marginTop: 8, color: "var(--mu)" }}>
                Du hast den Wechsel selbst angestoßen. Ein Wechsel jetzt kostet Eingewöhnung.
              </p>
              <div className="g1" style={{ marginTop: 12 }}>
                {offers.filter((o) => o.type === "transfer" || o.type === "loan").slice(0, 4).map((o, i) => {
                  const dd = p.wage > 0 ? (o.wage / p.wage - 1) * 100 : 0;
                  return (
                    <button key={i} className="btn" onClick={() => winterAccept(o)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <Crest club={o.club} size={26} />
                        <div style={{ flex: "1 1 130px" }}>
                          <div className="d" style={{ fontSize: 15 }}>{o.type === "loan" ? "Leihe: " + o.club.n : o.club.n}</div>
                          <div className="m" style={{ fontSize: 10, color: "var(--mu)" }}>{o.club.l} · Stärke {o.club.s}</div>
                        </div>
                        <div className="m" style={{ fontSize: 10.5, color: "var(--mu)", textAlign: "right" }}>
                          <div style={{ color: o.roleKey === "star" || o.roleKey === "start" ? "var(--ok)" : "var(--go)" }}>{o.role}</div>
                          <div>{eur(o.wage)} €{Math.abs(dd) >= 5 && <span style={{ color: dd > 0 ? "var(--ok)" : "var(--bad)", marginLeft: 5 }}>{sgn(dd)}{Math.round(dd)} %</span>}</div>
                          {o.fee > 0 && <div>Ablöse {eur(o.fee)} €</div>}
                        </div>
                      </div>
                    </button>);
                })}
                <button className="btn" onClick={() => winterAccept(null)}>
                  <div className="d" style={{ fontSize: 15 }}>Doch bleiben</div>
                  <div style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 2 }}>
                    Die Saison hier zu Ende spielen und im Sommer neu entscheiden.</div>
                </button>
              </div>
            </div>)}

          {step === "retire" && (
            <div className="pan pad fade">
              <span className="chip a">Karriereende</span>
              <div className="d" style={{ fontSize: 24, marginTop: 8 }}>Wie lange noch?</div>
              <p style={{ marginTop: 8, color: "var(--mu)" }}>
                Du bist {p.age} und merkst es. {p.peakOvr - p.ovr} Punkte unter deinem Bestwert, das Knie ist morgens
                vor dem Wecker wach, und im Kader stehen drei, die noch nicht auf der Welt waren, als du dein
                erstes Profispiel gemacht hast. Wir fragen einmal. Danach machst du das mit dir aus.</p>
              <div className="g1" style={{ marginTop: 14 }}>
                <button className="btn" onClick={() => { setGrowth(null); setStep("training"); }}>
                  <div className="d" style={{ fontSize: 15 }}>Weitermachen</div>
                  <div style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 2 }}>Noch eine Saison. Vielleicht zwei.</div></button>
                <button className="btn" onClick={() => finish(clone(p), "Aufgehört, solange es die eigene Entscheidung war.")}>
                  <div className="d" style={{ fontSize: 15 }}>Schluss machen</div>
                  <div style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 2 }}>Aufhören, solange du es selbst entscheidest.</div></button>
              </div>
            </div>)}

          <div className="pan pad" ref={reiterRef}>
            <div className="tabhuelle"><div className="tabs" style={{ marginBottom: 10 }}>
              {TABS.map(([k, l]) => (
                <button key={k} className={"btn sm" + (tab === k ? " on" : "")} style={{ flexShrink: 0 }}
                  onClick={() => { setTab(k); zumAnfang(reiterRef.current); }}>
                  <span className="d" style={{ fontSize: 13, color: tab === k ? "var(--ac)" : "var(--mu)" }}>{l}</span>
                </button>))}
            </div></div>
            <Guard key={tab}>
              {tab === "verlauf" && <HistoryView p={p} />}
              {tab === "statistik" && <StatsView p={p} />}
              {tab === "tabelle" && <CompetitionView p={p} />}
              {tab === "laender" && <NationalView p={p} />}
              {tab === "kader" && <SquadView p={p} />}
              {tab === "vermoegen" && <MoneyView p={p} onBuy={buy} onInvest={invest} onSell={sell} onDonate={donate} />}
              {tab === "oeffentlich" && <SocialView p={p} />}
              {tab === "vitrine" && <TrophyView p={p} />}
            </Guard>
          </div>
        </div>
        {!p.retired && (
          <div style={{ marginTop: 26, paddingTop: 12, borderTop: "1px solid var(--ln)",
            display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
            {!stopAsk ? (<>
              <button className="btn sm" style={{ padding: "5px 12px" }}
                onClick={() => { saveGame(p, step === "result" ? "result" : "training");
                  einblendungenLeeren(); setPhase("menu"); }}>
                <span className="m" style={{ fontSize: 11 }}>Hauptmenü</span>
              </button>
              <button className="btn sm" style={{ padding: "5px 12px", borderColor: "var(--bad)",
                background: "var(--bad)1A" }} onClick={() => setStopAsk(true)}>
                <span className="m" style={{ fontSize: 11, color: "var(--bad)" }}>Schuhe an den Nagel hängen</span>
              </button>
            </>) : (<>
              <span className="m" style={{ fontSize: 10.5, color: "var(--mu)" }}>
                Wirklich aufhören? Zurück geht dann nichts mehr.</span>
              <button className="btn sm" style={{ padding: "4px 10px" }}
                onClick={() => { setStopAsk(false); finish(clone(p), "Rücktritt aus freien Stücken"); }}>
                <span className="m" style={{ fontSize: 10.5, color: "var(--bad)" }}>Ja, beenden</span>
              </button>
              <button className="btn sm" style={{ padding: "4px 10px" }} onClick={() => setStopAsk(false)}>
                <span className="m" style={{ fontSize: 10.5 }}>Abbrechen</span>
              </button>
            </>)}
          </div>)}
      </div>

      {/* Einblendungen liegen über allem und blockieren nichts dauerhaft */}
      {simLauf && <Simuliert />}
      {enthuellung && <WildcardEnthuellung card={enthuellung}
        onFertig={() => setEnthuellung(null)} />}
      {rueckblick && rueckblick.lauf === p.lauf && !simLauf && (
        <SaisonRueckblick p={rueckblick.p} s={rueckblick.s} onFertig={() => setRueckblick(null)} />)}

      {ladenAuf && (
        <Ueberlagerung onZu={() => setLadenAuf(false)}>
          <VCLadenAnsicht wo="saison" vc={aka.vc || 0} laden={aka.laden} onKauf={ladenKauf} />
        </Ueberlagerung>)}
      {schluss && schluss.lauf === p.lauf && !rueckblick && (!jubel || !jubel.length) && !simLauf && (
        <div className="rs-schleier" style={{ padding: "0 18px" }}>
          <div className="rs-rein" style={{ textAlign: "center", maxWidth: 460 }}>
            <div className="eb" style={{ color: "var(--bad)", letterSpacing: ".2em" }}>KARRIEREENDE</div>
            <div className="d" style={{ fontSize: "clamp(26px,7.5vw,46px)", lineHeight: 1.1, marginTop: 6 }}>
              Es ist so weit</div>
            <p style={{ fontSize: 13, color: "var(--mu)", marginTop: 10 }}>{schluss.grund}</p>
            <button className="btn pri" style={{ marginTop: 18, maxWidth: 240, margin: "18px auto 0" }}
              onClick={() => { const q = schluss.q; setSchluss(null); finish(clone(q), schluss.grund); }}>
              <span className="d" style={{ fontSize: 16 }}>Bilanz ziehen</span>
            </button>
          </div>
        </div>)}
      {marken.length > 0 && marken[0].lauf === p.lauf && !rueckblick && !simLauf && (!jubel || !jubel.length) && (
        <MarkeJubel marke={marken[0]} onFertig={() => setMarken(marken.slice(1))} />)}
      {jubel && jubel.length > 0 && jubel[0].lauf === p.lauf && !rueckblick && !simLauf && (
        <TitelJubel titel={jubel[0].titel} club={jubel[0].club} land={jubel[0].land}
          onFertig={() => setJubel(jubel.slice(1))} />)}
    </Shell>
  );
}

/* Die Kapitänsbinde neben dem Namen — in den Farben dessen, den man anführt.
   Gezeichnet als schräg liegendes Band mit zweifarbigem Verlauf und einem C. */
function Binde({ farben, size = 19, titel }) {
  const { p: c1, s: c2 } = farbPaar(farben);
  const id = "bd" + Math.abs(hash(c1 + c2 + (titel || "")));
  const dunkel = (hex) => {
    try { const n = parseInt(hex.slice(1), 16);
      return ((n >> 16 & 255) * .299 + (n >> 8 & 255) * .587 + (n & 255) * .114) < 128; }
    catch (e) { return true; }
  };
  const schrift = dunkel(c1) ? "#F2F5FA" : "#0B120E";
  return (
    <svg viewBox="0 0 30 22" width={size * 1.28} height={size} role="img" aria-label={titel}
      style={{ display: "inline-block", verticalAlign: "-0.14em", flexShrink: 0 }}>
      <title>{titel}</title>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} /><stop offset="49%" stopColor={c1} />
          <stop offset="51%" stopColor={c2} /><stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <g transform="rotate(-11 15 11)">
        {/* das Band selbst */}
        <rect x="2" y="5.5" width="26" height="11" rx="3.2" fill={"url(#" + id + ")"}
          stroke="rgba(0,0,0,.55)" strokeWidth="1" />
        {/* Naht oben, damit es plastisch wirkt */}
        <rect x="3.4" y="6.8" width="23.2" height="1.5" rx=".75" fill="#FFFFFF" opacity=".22" />
        {/* Kennbuchstabe */}
        <text x="15" y="14.6" textAnchor="middle" fontSize="8.6" fontWeight="700"
          fontFamily="'Rasen Anzeige','Roboto Condensed',sans-serif" fill={schrift}>C</text>
      </g>
    </svg>
  );
}

export default function RasenschachXI() {
  return <AppGuard><FlutlichtApp /></AppGuard>;
}
