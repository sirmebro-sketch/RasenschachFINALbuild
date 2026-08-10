/* Speicher für Spielstand und Ruhmeshalle.
   In der Android-App läuft das über Capacitor Preferences, im Browser
   über denselben Aufruf mit localStorage darunter. Beides ohne Netz. */
import { Preferences } from "@capacitor/preferences";

export const store = {
  async get(key) {
    const { value } = await Preferences.get({ key });
    return value ? { key, value } : null;
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
