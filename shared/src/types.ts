export type PdfManifest = {
  id: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  pages: PdfPage[];
}

export type PdfPage = {
  id: string;
  order: number;
  filename: string;
  areas: any[];
}

export type PdfPageArea = {
  left: number;
  top: number;
  width: number;
  height: number;
  tooltip: string;
  url: string;
}
