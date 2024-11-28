import { FabricCanvas } from "@/components/fabric/fabric-canvas";
import { FabricProvider } from "@/components/fabric/fabric-provider";
import { useFabric } from "@/components/fabric/use-fabric";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ObjectEditor } from "@/components/editor/object-editor";
import { PdfPageArea } from "@/shared";

type EditorProps = {
  src: string;
  data: PdfPageArea[];
  onUpdate: (objects: PdfPageArea[]) => void;
  activePageIndex: number;
};

export const Editor = (props: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { src, onUpdate } = props;
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageSrc = `${window.pdf2webEditorConfig.imagesBaseUrl}/${src}`.replace('\//\g', '/');

  return (
    <FabricProvider onUpdate={onUpdate}>
      <div className="editor-page-flip-wrapper">
        <EditorController />
        <div className="relative mt-5 border-solid border-t border-b border-gray-300 " ref={ref}>
          <img
            src={imageSrc}
            onLoad={() => setImageLoaded(true)}
            alt="Image to edit"
            className="max-h-[75vh]"
          />
          {imageLoaded && ref.current ? (
            <div className="absolute inset-0" key={props.activePageIndex}>
              <FabricCanvas
                width={ref.current.clientWidth}
                height={ref.current.clientHeight}
                initialData={props.data}
              />
            </div>
          ) : null}
        </div>

        <ObjectEditor />
      </div>
    </FabricProvider>
  );
};

export const EditorController = () => {
  const { canvas } = useFabric();

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:over", function (e: fabric.IEvent<Event>) {
        if (!e.target) return;
        e.target.set("opacity", 0.6);
        canvas.renderAll();
      });

      canvas.on("mouse:out", function (e: fabric.IEvent<Event>) {
        if (!e.target) return;
        e.target.set("opacity", 0.4);
        canvas.renderAll();
      });
    }
  }, [canvas]);

  const handleAddHotspot = () => {
    const rect = new fabric.Rect({
      backgroundColor: "black",
      borderColor: "white",
      // @ts-ignore
      id: +new Date(),
      borderWidth: 1,
      hasBorders: false,
      cornerColor: "black",
      cornerSize: 5,
      cornerStrokeColor: "white",
      lockScalingFlip: true,
      opacity: 0.4,
      width: 100,
      height: 100,
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 - 50,
      transparentCorners: false,
      strokeUniform: true
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  return (
    <div className="flex gap-2 mb-2">
      <Button size="sm" type="button" onClick={handleAddHotspot}>
        <Plus className="w-4 h-4 mr-2" />
        Add Hotspot
      </Button>
    </div>
  );
};
