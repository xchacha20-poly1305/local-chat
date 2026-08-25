import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    target: "chrome139",
    cssMinify: "esbuild", // Use "true" will lose the liquid glass
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        translate: resolve(import.meta.dirname, "translate/index.html"),
      },
    },
  },
});
