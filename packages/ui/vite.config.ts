import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser",
      buffer: "buffer",
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/index.tsx"),
      name: "OraiDEX EVM UI",
      fileName: "oraidex-evm-ui",
    },
    rollupOptions: {
      external: ["react", "react-dom", "buffer", "vite-plugin-node-polyfills/shims/buffer"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          buffer: "Buffer",
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {},
  server: {
    watch: {},
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: "tsconfig.app.json",
    }),
    nodePolyfills(),
  ],
});