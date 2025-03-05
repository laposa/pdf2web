export type PdfManifest = {
  id: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  pages: PdfPage[];
};

export type PdfPage = {
  id: string;
  order: number;
  filename: string;
  hotspots: PdfPageHotspot[];
};

export type PdfPageHotspot = {
  left: number;
  top: number;
  width: number;
  height: number;
  title: string;
  url: string;
};
