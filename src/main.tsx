import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/cinzel";
import "@fontsource-variable/eb-garamond";
import "@fontsource/shippori-mincho-b1/500.css";
import "@fontsource/shippori-mincho-b1/700.css";
import "@fontsource/shippori-mincho-b1/800.css";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
