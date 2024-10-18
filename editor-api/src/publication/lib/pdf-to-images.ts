import { mkdirSync, writeFileSync } from 'fs';
import { createCanvas } from 'canvas';
import { Publication } from 'src/common/entities/publication.entity';

// dynamic import
async function importPdfLib() {
  const dynamicImport = new Function('specifier', 'return import(specifier)');
  const pdfjsLib = await dynamicImport('pdfjs-dist/legacy/build/pdf.mjs');
  return pdfjsLib;
}

export const convert = async (
  publication: Publication,
  file: Express.Multer.File,
): Promise<string[]> => {
  const paths = [];

  const { getDocument } = await importPdfLib();
  const loadingTask = getDocument(new Uint8Array(file.buffer));

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
    const image = canvas.toBuffer();

    const folder = `/uploads/${publication.id}`;
    const filename = `output-${i}.png`;

    const savePath = `${folder}/${filename}`;

    mkdirSync(`./public${folder}`, { recursive: true });
    writeFileSync(`./public${folder}/${filename}`, image);

    paths.push(savePath);
    // Release page resources.
    page.cleanup();
  }

  return paths;
};
