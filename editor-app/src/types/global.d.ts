import { AppConfig } from "../main";

declare global {
  interface Window {
    pdf2web: (options: AppConfig) => void;
    pdf2WebConfig: AppConfig;
  }
}

export {};
