import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

export type AppOptions = {
  manifestUrl: string;
  imagesBaseUrl?: string;
}

window.pdf2web = (options: AppOptions) => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App configuration={options} />
    </React.StrictMode>
  );
};

window.dispatchEvent(new Event("pdf2web.loaded"));
