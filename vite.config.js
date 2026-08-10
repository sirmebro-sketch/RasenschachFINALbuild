import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",            // relative Pfade, damit es auch in der App-Hülle läuft
  build: { outDir: "dist", assetsInlineLimit: 0 },
});
