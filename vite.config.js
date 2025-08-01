import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // We will not externalize modules here.
      // The default Vite/Rollup bundling should handle everything correctly.
    },
  },
});
