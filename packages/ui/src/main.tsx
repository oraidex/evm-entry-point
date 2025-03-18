import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { Buffer as BufferPolyfill } from "buffer";
import App from "./App";
declare let Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
