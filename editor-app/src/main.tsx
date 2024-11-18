import type { PdfManifest } from "@/shared";
import { defineWebComponent } from "./define-web-component.tsx";

export type AppConfig = {
  manifest: PdfManifest;
  imagesBaseUrl: string;
};

window.pdf2webEditor = (options: AppConfig) => {
  window.pdf2webEditorConfig = options;

  defineWebComponent();
};

window.dispatchEvent(new Event("pdf2webEditor.loaded"));
