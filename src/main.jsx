import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { EffectsProvider } from "./components/EffectsProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EffectsProvider>
      <App />
    </EffectsProvider>
  </StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((error) => {
        console.error("Service Worker non enregistré :", error);
      });
  });
}
