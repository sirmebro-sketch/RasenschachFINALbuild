/* 35.165: gemeinsamer Speichervertrag für App und Browser, mit Fehlerweitergabe. */
export function serialisierterSpeicher(adapter) {
  let ende = Promise.resolve();
  const reihe = (fn) => { const job = ende.then(fn); ende = job.catch(() => {}); return job; };
  return {
    get: (k) => reihe(() => adapter.get(k)),
    set: (k, v) => reihe(() => adapter.set(k, v)),
    delete: (k) => reihe(() => adapter.delete(k)),
    transaktion: (fn) => reihe(() => fn(adapter)),
  };
}
export const IMPORT_JOURNAL = 'rasenschach:import-transaktion';
const objekt = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const zahl = (x) => typeof x === 'number' && Number.isFinite(x);
export function spielerGueltig(p) {
  return objekt(p) && typeof p.name === 'string' && ['TW','IV','AV','ZDM','ZM','ZOM','AF','ST'].includes(p.pos)
    && objekt(p.nation) && typeof p.nation.id === 'string'
    && objekt(p.club) && typeof p.club.n === 'string'
    && objekt(p.attrs) && ['pac','sho','pas','dri','def','phy'].every(k => zahl(p.attrs[k]) && p.attrs[k] >= 0 && p.attrs[k] <= 150)
    && ['age','year','ovr','potential','money','wage','contract'].every(k => zahl(p[k]))
    && p.age >= 15 && p.age <= 100 && p.year >= 1900 && p.year <= 3000
    && p.money >= 0 && p.wage >= 0 && p.ovr >= 0 && p.ovr <= 150
    && p.potential >= 0 && p.potential <= 150
    && objekt(p.flags) && objekt(p.evLog) && objekt(p.nt) && Array.isArray(p.nt.majors)
    && objekt(p.tot) && objekt(p.depot) && objekt(p.type) && objekt(p.mode)
    && ['assets','milestones','seasons','trophies','awards','squad','traits'].every(k => Array.isArray(p[k]));
}
export function datensatzGueltig(k, x) {
  if (k.endsWith(':stand')) return objekt(x) && spielerGueltig(x.p)
    && (x.step == null || ['training','event','winter','result','retire'].includes(x.step))
    && (x.angebote == null || (Array.isArray(x.angebote) && x.angebote.every(o => objekt(o) && objekt(o.club) && typeof o.club.n === 'string' && zahl(o.wage))));
  if (k.endsWith(':halle')) return Array.isArray(x) && x.every(h => objekt(h) && typeof h.name === 'string' && zahl(h.score));
  if (k.endsWith(':karten')) return objekt(x) && Array.isArray(x.karten) && x.karten.every(c => objekt(c) && typeof c.kid === 'string' && typeof c.name === 'string' && zahl(c.ovr));
  if (k.endsWith(':raute')) return (zahl(x) && Number.isInteger(x) && x >= 0) || (typeof x === 'string' && /^\d+$/.test(x));
  if (k.endsWith(':gesehen')) return objekt(x) || Array.isArray(x); // historische Liste
  if (!objekt(x)) return false;
  if (k.endsWith(':akademie')) return ['talente','absolventen'].every(a => Array.isArray(x[a]) && x[a].every(t => objekt(t) && typeof t.id === 'string' && typeof t.name === 'string')) && zahl(x.vc) && x.vc >= 0;
  if (k.endsWith(':verein')) return (x.kader == null || Array.isArray(x.kader)) && (x.chronik == null || Array.isArray(x.chronik));
  return true;
}
export function backupLesen(text, keys, version) {
  const p = JSON.parse(text);
  if (!objekt(p) || p.spiel !== 'rasenschach' || !objekt(p.daten)) throw Error('Der Text gehört nicht zu diesem Spiel oder enthält keine Datensätze.');
  if (p.v != null) {
    if (typeof p.v !== 'string' || !/^\d+\.\d+$/.test(p.v)) throw Error('Unbekannte Sicherungsversion.');
    const a=p.v.split('.').map(Number), b=version.split('.').map(Number);
    if (a[0]>b[0] || (a[0]===b[0] && a[1]>b[1])) throw Error('Diese Sicherung stammt aus einer neueren Spielversion. Bitte zuerst das Spiel aktualisieren.');
  }
  const daten = {};
  for (const k of keys) if (Object.hasOwn(p.daten,k)) {
    const raw=p.daten[k];
    if (typeof raw !== 'string' || !datensatzGueltig(k,JSON.parse(raw))) throw Error('Beschädigter oder unvollständiger Datensatz: '+k);
    daten[k]=raw;
  }
  if (!Object.keys(daten).length) throw Error('In dieser Sicherung steht kein verwendbarer Datensatz.');
  return daten;
}
async function lesen(s, keys) {
  const daten={};
  for (const k of keys) { const r=await s.get(k); daten[k]=r?.value ?? null; }
  return daten;
}
async function anwenden(s, daten) {
  for (const [k,v] of Object.entries(daten)) { if (v == null) await s.delete(k); else await s.set(k,v); }
  for (const [k,v] of Object.entries(daten)) if (((await s.get(k))?.value ?? null) !== v) throw Error('Speicherkontrolle fehlgeschlagen: '+k);
}
const exklusiv = (s, fn) => s.transaktion ? s.transaktion(fn) : fn(s);
export async function importWiederherstellen(store, erlaubt) {
  return exklusiv(store, async s => {
    const r=await s.get(IMPORT_JOURNAL);
    if (!r) return false;
    const j=JSON.parse(r.value);
    if (!objekt(j.vorher) || !Object.keys(j.vorher).every(k => erlaubt.includes(k))
      || !Object.values(j.vorher).every(v => v === null || typeof v === 'string')) throw Error('Unlesbare Import-Wiederherstellung.');
    await anwenden(s,j.vorher);
    await s.delete(IMPORT_JOURNAL);
    return true;
  });
}
/* Journal wird VOR der ersten Änderung geschrieben. Bei Prozessabbruch setzt
   der nächste Start den vorherigen Stand zurück. Erfolg erst nach Kontrolle. */
export async function datenErsetzen(store, daten, keys, undoKey, version, ruecknahme=false) {
  return exklusiv(store, async s => {
    if (await s.get(IMPORT_JOURNAL)) throw Error('Eine frühere Wiederherstellung ist noch offen. Bitte zuerst neu starten.');
    const alle=[...new Set([...keys, ...(undoKey ? [undoKey] : [])])];
    const vorher=await lesen(s,alle); // Lesefehler bricht VOR JEDEM Schreiben ab.
    const ziel=Object.fromEntries(keys.map(k => [k,daten[k] ?? null]));
    if (undoKey) ziel[undoKey]=ruecknahme ? null : JSON.stringify({t:Date.now(),v:version,daten:Object.fromEntries(keys.map(k=>[k,vorher[k]]).filter(([,v])=>v!=null))});
    const journal = JSON.stringify({vorher});
    await s.set(IMPORT_JOURNAL,journal);
    if ((await s.get(IMPORT_JOURNAL))?.value !== journal) throw Error('Die Wiederherstellung konnte nicht gesichert werden. Der bisherige Stand bleibt unverändert.');
    try {
      await anwenden(s,ziel);
      await s.delete(IMPORT_JOURNAL);
    } catch (e) {
      try { await anwenden(s,vorher); await s.delete(IMPORT_JOURNAL); }
      catch (r) { const e = Error('Speichern fehlgeschlagen. Die Wiederherstellung ist noch offen; bitte neu starten. Bis dahin keine weiteren Änderungen vornehmen.'); e.wiederherstellungOffen = true; throw e; }
      throw Error('Speichern fehlgeschlagen. Der bisherige Stand wurde vollständig wiederhergestellt.');
    }
    return ziel[undoKey] ? JSON.parse(ziel[undoKey]) : null;
  });
}
