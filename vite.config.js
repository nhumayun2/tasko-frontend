import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import commonjs from "@rollup/plugin-commonjs"; // Import the commonjs plugin

// https://vitejs.dev.config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    commonjs(), // Add the commonjs plugin here
  ],
  build: {
    rollupOptions: {
      // Explicitly externalize dependencies that Rollup fails to resolve
      external: [
        "react-router-dom",
        "js-cookie",
        // 'date-fns' should NOT be here, as commonjs plugin will help bundle it
        // Add any other packages here if they cause similar 'failed to resolve import' errors
      ],
    },
  },
});
