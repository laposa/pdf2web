import { AppConfig } from "../main";

declare global {
  interface Window {
    pdf2webEditor: (options: AppConfig) => void;
    pdf2webEditorConfig: AppConfig;
  }
}

export {};
