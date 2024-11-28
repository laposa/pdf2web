import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PdfManifest } from "@/shared";

export type AppOptions = {
  manifest: PdfManifest;
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
