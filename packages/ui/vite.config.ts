import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@oraichain/oraidex-evm-sdk": path.resolve(
        __dirname,
        "../sdk/dist/index"
      ),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/components/index.tsx"),
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
  },
  optimizeDeps: {
    include: ["@oraichain/oraidex-evm-sdk"],
  },
  server: {
    watch: {
      ignored: ["!**/node_modules/@oraichain/oraidex-evm-sdk/**"],
    },
  },
  plugins: [react(), dts({ rollupTypes: true })],
});
