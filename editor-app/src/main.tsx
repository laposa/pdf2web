import { defineWebComponent } from "./define-web-component.tsx";

export type AppConfig = {
  apiUrl: string;
  apiKey: string;
  imagesBaseUrl?: string;
  publicationId?: number;
};

window.pdf2webEditor = (options: AppConfig) => {
  window.pdf2webEditorConfig = options;

  defineWebComponent();
};

window.dispatchEvent(new Event("pdf2webEditor.loaded"));
