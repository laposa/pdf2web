import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';
import { v4 as uuidv4 } from 'uuid';
import { PdfManifest } from './convert.types';
import { AppConfig, InjectConfig } from '@/app.config';
import { ConvertDto } from './dtos/ConvertDto';
import { createCanvas, Image, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as PDFjs from 'pdfjs-dist';
import * as path from 'path';
import { pathToFileURL } from 'node:url';

@Injectable()
export class ConvertService {
  pdfJs: typeof PDFjs;

  constructor(@InjectConfig() private readonly config: AppConfig) {
    this.importPdfLib().then((pdfJs) => {
      this.pdfJs = pdfJs;
    });
    this.applyWorkarounds();
  }

  async convert(data: ConvertDto, file: Express.Multer.File): Promise<Buffer> {

    const archive = archiver('zip', { zlib: { level: 9 } });
    const buffers = [];
    const manifest: PdfManifest = {
      id: uuidv4(),
      source: file.originalname,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [],
    };

    archive.on('data', (data) => buffers.push(data));
    archive.on('error', (err) => {
      throw err;
    });

    const loadingTask = this.pdfJs.getDocument(new Uint8Array(file.buffer));
    const pdfDocument = await loadingTask.promise;

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);

      const viewport = this.createViewport(page, data);
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');

      let quality = this.config.convertDefaultQuality;
      if (data.quality) quality = +data.quality;

      const format = this.getOutputFormat(data);
      const image = await this.renderImage(page, context, canvas, viewport, format.mime, quality);

      const id = uuidv4();
      const filename = `${id}.${format.extension}`;
      archive.append(image, { name: filename });

      manifest.pages.push({
        id,
        order: i,
        filename: filename,
        hotspots: [],
      });

      // Release page resources.
      page.cleanup();
    }

    archive.append(JSON.stringify(manifest, null, 2), {
      name: 'manifest.json',
    });
    archive.finalize();

    return new Promise<Buffer>((resolve, reject) => {
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', reject);
    });
  }

  async importPdfLib(): Promise<typeof PDFjs> {
    const dynamicImport = new Function('specifier', 'return import(specifier)');
    const pdfjsLib = await dynamicImport('pdfjs-dist/legacy/build/pdf.mjs');
    return pdfjsLib as typeof PDFjs;
  }

  applyWorkarounds() {
    // pdfjs-dist 5.x expects browser globals. We must polyfill these before any pdf.js imports:
    // Without these, embedded images in PDFs will fail to render with cryptic errors like "Image or Canvas expected".
    const g = globalThis as any;
    if (!g.Image) g.Image = Image;
    if (!g.DOMMatrix) g.DOMMatrix = DOMMatrix;
    if (!g.ImageData) g.ImageData = ImageData;
    if (!g.Path2D) g.Path2D = Path2D;

    // Point to the worker script (enables multi-threaded parsing)
    const workerPath = path.join(__dirname, '../../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs');
    GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

    // Standard fonts for proper text rendering
    const standardFontPath = path.join(__dirname, '../../node_modules/pdfjs-dist/standard_fonts/');
    (GlobalWorkerOptions as any).standardFontDataUrl = `${pathToFileURL(standardFontPath).href}`;
  }

  createViewport(page, data) {
      let desiredWidth = this.config.defaultWidth;
      if (data.width > 0) desiredWidth = data.width;
      let tempViewport = page.getViewport({ scale: 1, });
      const scale = desiredWidth / tempViewport.width;
      let viewport = page.getViewport({ scale });

      if (
        this.config.maxHeight > 0 &&
        viewport.height > this.config.maxHeight
      ) {
        const adjustedScale = this.config.maxHeight / viewport.height;
        viewport = page.getViewport({ scale: adjustedScale });
      }

      return viewport;
  }

  async renderImage(page, context, canvas, viewport, mime, quality) {
    await page.render({
      canvasContext: context as any,
      viewport,
      canvas: null
    }).promise;

    return canvas.toBuffer(mime, quality * 100);

  }

  getOutputFormat(data) {
    let format = this.config.convertDefaultFormat;
    if (data.format) format = data.format;
    let mime, extension;

    switch (format.toLowerCase()) {
      case 'png':
        mime = "image/png";
        extension = "png";
        break;
      case 'webp':
        mime = "image/webp";
        extension = "webp";
        break;
      case 'jpeg':
      default:
        mime = "image/jpeg";
        extension = "jpeg";
    }

    return {
      mime,
      extension
    }
  }

}
