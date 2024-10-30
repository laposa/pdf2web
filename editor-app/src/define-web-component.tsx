import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import globalCss from  './index.css?inline';


export function defineWebComponent() {
  class Pdf2WebEditorComponent extends HTMLElement {
    public static Name = "pdf2web-editor";
    private mountPoint!: HTMLDivElement;

    constructor() {
      super();
    }

    connectedCallback() {
      this.mountPoint = document.createElement("div");
      this.mountPoint.id = "pdf2web-editor";
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(this.mountPoint);

      ReactDOM.createRoot(this.mountPoint).render(
        <React.StrictMode>
          <style>{globalCss}</style>
          <App configuration={window.pdf2webEditorConfig} />
        </React.StrictMode>
      );
    }
  }

  window.customElements.get(Pdf2WebEditorComponent.Name) ||
    window.customElements.define(Pdf2WebEditorComponent.Name, Pdf2WebEditorComponent);
}
