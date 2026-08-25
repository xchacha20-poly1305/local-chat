import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    target: "chrome139",
    cssMinify: "esbuild", // Use "true" will lose the liquid glass
    // Shiki grammars (emacs-lisp/cpp/wasm) are already lazy-split and exceed 500 kB.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        translate: resolve(import.meta.dirname, "translate/index.html"),
      },
    },
  },
});
