import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AccentProvider } from "./lib/accent";
import "./styles/base.css";
import "./styles/site.css";
import "./styles/desktop.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccentProvider>
      <App />
    </AccentProvider>
  </StrictMode>,
);
