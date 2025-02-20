import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/manifest.json",
          dest: ".",
        },
        {
          src: "public/icon.png",
          dest: ".",
        },
        {
          src: "public/icon16.png",
          dest: ".",
        },
        {
          src: "public/icon48.png",
          dest: ".",
        },
        {
          src: "public/icon128.png",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  server: {
    proxy: {
      "/analyze-mood":
        "https://moodweb-extension-backend.vercel.app/api/analyze-mood",
    },
    open: true,
    port: 3001,
    hmr: true,
  },
});
