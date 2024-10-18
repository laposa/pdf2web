import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

export type AppConfig = {
  api_url: string;
  api_key: string;
  publication_id?: number;
};

window.pdf2web = (options: AppConfig) => {
  window.pdf2WebConfig = options;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App configuration={options} />
    </React.StrictMode>
  );
};

window.dispatchEvent(new Event("pdf2web.loaded"));
