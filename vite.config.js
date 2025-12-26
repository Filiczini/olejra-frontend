import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep the dev server predictable while we add TS checks and CI later.
  server: { port: 5173, strictPort: true },
});
