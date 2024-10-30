import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `[name].editor.js`,
          chunkFileNames: `[name].editor.js`,
          assetFileNames: `[name].editor.[ext]`,
        },
      },
    },
  };
});
