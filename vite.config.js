import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev.config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Explicitly externalize dependencies that Rollup fails to resolve
      external: [
        "react-router-dom",
        "js-cookie",
        // Add any other packages here if they cause similar 'failed to resolve import' errors
      ],
    },
  },
});
