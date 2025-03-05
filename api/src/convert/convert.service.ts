import { Injectable } from '@nestjs/common';
import * as PDFjs from 'pdfjs-dist';
import { createCanvas } from 'canvas';
import * as archiver from 'archiver';
import { v4 as uuidv4 } from 'uuid';
import { PdfManifest } from './convert.types';
import { AppConfig, InjectConfig } from '@/app.config';
import { ConvertDto } from './dtos/ConvertDto';

@Injectable()
export class ConvertService {
  pdfJs: typeof PDFjs;

  constructor(@InjectConfig() private readonly config: AppConfig) {
    this.importPdfLib().then((pdfJs) => {
      this.pdfJs = pdfJs;
    });
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
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');

      const renderTask = page.render({
        canvasContext: context as any,
        viewport: viewport,
      });

      await renderTask.promise;
      let quality = this.config.convertDefaultQuality;
      if (data.quality) {
        quality = +data.quality;
      }

      const image = canvas.toBuffer('image/jpeg', {
        quality: quality,
      });

      const id = uuidv4();
      const filename = `${id}.jpeg`;
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
}
