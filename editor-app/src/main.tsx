import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    pdf2web: () => void;
  }
}

window.pdf2web = (options) => {
  console.log("Rendering pdf2web editor", options);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

window.dispatchEvent(new Event("pdf2web.loaded"));
