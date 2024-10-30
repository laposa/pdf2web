import { AppConfig } from "../main.tsx";

declare global {
  interface Window {
    pdf2web: (options: AppConfig) => void;
  }
}

export {};
