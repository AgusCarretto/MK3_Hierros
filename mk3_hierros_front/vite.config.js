import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/MK3_Hierros/",
  plugins: [react(), tailwindcss()],
  // Backend CORS (mk3_hierros_back/src/main.ts) only allowlists
  // http://localhost:3001 for local dev — keep the dev server pinned
  // to that port so `npm run dev` can hit the real API.
  server: {
    port: 3001,
    strictPort: true,
  },
  build: {
    outDir: "build",
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    globals: true,
    css: true,
  },
});
