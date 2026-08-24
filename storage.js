/* Speicher für Spielstand und Ruhmeshalle.
   In der Android-App läuft das über Capacitor Preferences, im Browser
   über denselben Aufruf mit localStorage darunter. Beides ohne Netz. */
import { Preferences } from "@capacitor/preferences";

export const store = {
  async get(key) {
    const { value } = await Preferences.get({ key });
    /* 35.41 (offener Punkt 16): hier stand `value ? … : null`. Ein gespeicherter
       Leerstring kam damit als „nicht vorhanden" zurueck — anders als in der
       Browsertest-Fassung, die `value == null` prueft. Praktisch folgenlos,
       weil alle Aufrufe `JSON.stringify(…)` oder `String(n)` schreiben und nie
       einen Leerstring; aber zwei Fassungen derselben Schnittstelle, die sich
       am Rand verschieden verhalten, sind eine Falle fuer den Tag, an dem doch
       einmal ein Leerstring geschrieben wird. Jetzt gleich. */
    return value == null ? null : { key, value };
  },
  async set(key, value) {
    await Preferences.set({ key, value });
    return { key, value };
  },
  async delete(key) {
    await Preferences.remove({ key });
    return { key, deleted: true };
  },
};
