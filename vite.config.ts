import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// A relative base, so the build works at a domain root and under /des-website/ alike.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
