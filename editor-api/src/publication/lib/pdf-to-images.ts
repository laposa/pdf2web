import { mkdirSync, writeFileSync } from 'fs';
import { getDocument } from 'pdfjs-dist';
import { createCanvas } from 'canvas';
import { Publication } from 'src/publication/entities/publication.entity';

export const convert = async (
  publication: Publication,
  file: Express.Multer.File,
): Promise<string[]> => {
  try {
    const paths = [];
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
  } catch (err) {
    console.error(err);
  }
};
