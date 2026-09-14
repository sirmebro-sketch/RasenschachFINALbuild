/* Ereignisse enthalten Funktionen. Gespeichert werden ihre Kennungen und die
   bereits gewürfelte Auswahl, beim Laden kommen Funktionen aus dem Katalog. */
export function laufStand(p, step, ui, events, version) {
  const queue=(ui.queue || []).map(e => {
    const base=events.find(x=>x.id===e.id);
    if (!base) throw Error('Ereignis fehlt: '+e.id);
    const wahlen=e.choices.map(c=>base.choices.indexOf(c));
    if (wahlen.some(i=>i<0)) throw Error('Unbekannte Ereignisauswahl.');
    const auswahlIds=e.choices.map(c=>c.id);
    if (auswahlIds.some(id=>typeof id!=='string') || new Set(auswahlIds).size!==auswahlIds.length)
      throw Error('Ereignisauswahl ohne eindeutige Kennung.');
    return {id:e.id,ctx:e._ctx || {},auswahlIds};
  });
  return {v:version,t:Date.now(),step,angebote:['result','winter'].includes(step) ? (ui.offers || []) : null,
    p:{...p,verdict:undefined},ablauf:{schema:2,queue,ei:ui.ei || 0,er:ui.er || null,growth:ui.growth || null,season:step === "result" ? (p.seasons.at(-1) || ui.season || null) : (ui.season || null)}};
}
export function laufWeiter(save, events) {
  const a=save.ablauf;
  if (a && ![1,2].includes(a.schema)) throw Error('Unbekanntes Ablauf-Format.');
  const queue=(a?.queue || []).map(e=>{
    const base=events.find(x=>x.id===e.id);
    if (!base) throw Error('Ein gespeichertes Ereignis fehlt im aktuellen Katalog.');
    let choices;
    if (a.schema === 2) {
      if (!Array.isArray(e.auswahlIds) || !e.auswahlIds.length || new Set(e.auswahlIds).size !== e.auswahlIds.length)
        throw Error('Ungültige gespeicherte Ereignisauswahl.');
      choices=e.auswahlIds.map(id=>base.choices.find(c=>c.id===id));
    } else {
      // Die ursprüngliche Reihenfolge ist ausdrücklich am Katalog erhalten.
      // Umordnen der Anzeige darf alte Spielstände nicht auf andere Folgen umlenken.
      if (!Array.isArray(e.wahlen) || !e.wahlen.length || e.wahlen.some(i=>!Number.isInteger(i)||i<0))
        throw Error('Ungültige historische Ereignisauswahl.');
      const historisch=base.choices.some(c=>Number.isInteger(c.altIndex));
      choices=e.wahlen.map(i=>historisch ? base.choices.find(c=>c.altIndex===i) : base.choices[i]);
    }
    if (choices.some(c=>!c)) throw Error('Eine gespeicherte Auswahl ist nicht mehr verfügbar. Eine Formatmigration ist erforderlich.');
    return {...base,choices,_ctx:e.ctx || {}};
  });
  const step=save.step || 'training';
  if (step==='event' && (!Number.isInteger(a?.ei) || !queue[a.ei])) throw Error('Die gespeicherte Ereignisfolge fehlt. Bitte eine frühere Sicherung verwenden.');
  const season=a?.season || save.p.seasons.at(-1) || null;
  if (step==='result' && !season) throw Error('Das gespeicherte Saisonergebnis fehlt.');
  return {step,queue,ei:a?.ei||0,er:a?.er||null,growth:a?.growth||null,season,offers:save.angebote};
}
