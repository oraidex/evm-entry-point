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
      // "@oraichain/oraidex-evm-sdk": path.resolve(
      //   __dirname,
      //   "../sdk/dist/index"
      // ),
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
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
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
  plugins: [react(), dts({ rollupTypes: true }), nodePolyfills()],
});
