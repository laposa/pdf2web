import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    pdf2webPublic: (options: any) => void;
  }
}

window.pdf2webPublic = (options) => {
  console.log("Rendering pdf2webPublic editor", options);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App configuration={options} />
    </React.StrictMode>
  );
};

window.dispatchEvent(new Event("pdf2webPublic.loaded"));
