import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/cinzel";
import "@fontsource-variable/eb-garamond";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
