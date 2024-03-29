import {
  mkdir,
  mkdirSync,
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
} from "fs";
import { getDocument } from "pdfjs-dist";
import { createCanvas } from "canvas";
import { Publication } from "src/publication/entities/publication.entity";
import * as path from "path";

function NodeCanvasFactory() {}

NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

const canvasFactory = new NodeCanvasFactory();

export const convert = async (
  publication: Publication,
  file: Express.Multer.File
): Promise<string[]> => {
  try {
    let paths = [];
    const loadingTask = getDocument(new Uint8Array(file.buffer));

    const pdfDocument = await loadingTask.promise;

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height
      );
      const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport,
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;
      const image = canvasAndContext.canvas.toBuffer();

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
