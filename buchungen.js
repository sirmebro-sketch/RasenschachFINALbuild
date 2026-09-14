/* Gemeinsame, vor dem Schreiben geprüfte Karten-/Coinbuchungen. */

export function packBuchung(aka, pool, art, packId, neue, KARTEN) {
  if (!Array.isArray(neue) || !neue.length) throw Error('Das Pack enthält keine Karten.');
  const a = { ...aka };
  if (art === 'kauf') {
    const pk = KARTEN.packById(packId);
    if (!pk) throw Error('Dieses Pack ist nicht verfügbar.');
    if (!Number.isFinite(a.vc) || a.vc < pk.preis) throw Error('Für dieses Pack fehlen VC.');
    a.vc -= pk.preis;
    a.ausgegeben = (a.ausgegeben || 0) + pk.preis;
  } else if (art === 'gratis') {
    if (!(a.gratisPacks > 0)) throw Error('Kein Gratispack verfügbar.');
    a.gratisPacks -= 1;
  } else if (art === 'start') {
    if (!a.startpaket) throw Error('Kein Startpaket verfügbar.');
    delete a.startpaket;
  } else throw Error('Unbekannte Packbuchung.');
  return { aka: a, pool: KARTEN.poolErgaenzen(pool, neue) };
}

export function verkaufsBuchung(aka, pool, verein, kid, KARTEN, VEREIN) {
  let v = verein;
  if ((v?.kader || []).some(sp => sp.id === kid)) {
    const w = VEREIN.karteEntfernen(v, kid);
    if (w.fehler) throw Error(w.fehler);
    v = w.v;
  }
  const r = KARTEN.verkaufen(pool, kid);
  if (r.fehler) throw Error(r.fehler);
  return { aka: { ...aka, vc: (aka.vc || 0) + r.vc,
    verdient: (aka.verdient || 0) + r.vc }, pool: r.pool, verein: v };
}
