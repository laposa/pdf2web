import { FabricCanvas } from "@/components/fabric/fabric-canvas";
import { FabricProvider } from "@/components/fabric/fabric-provider";
import { useFabric } from "@/components/fabric/use-fabric";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { ObjectEditor } from "@/components/editor/object-editor";


export type Area = {
  left: number;
  top: number;
  width: number;
  height: number;
  url?: string;
  tooltip?: string;
};

type EditorProps = {
  src: string;
  data: Area[];
  onUpdate: (objects: Area[]) => void;
  isSaving: boolean;
  activePageIndex: number;
};

export const Editor = (props: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { src, onUpdate } = props;
  const [imageLoaded, setImageLoaded] = useState(false);

  let imageSrc = src;
  if (window.pdf2webEditorConfig.imagesBaseUrl) {
    imageSrc = `${window.pdf2webEditorConfig.imagesBaseUrl}${src}`;
  } else {
    imageSrc = `${window.pdf2webEditorConfig.apiUrl}${src}`;
  }

  return (
    <FabricProvider onUpdate={onUpdate}>
      <div className="relative">
        <EditorController isSaving={props.isSaving} />
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

export const EditorController = (props: Pick<EditorProps, "isSaving">) => {
  const { canvas, handleSave } = useFabric();

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:over", function (e: fabric.IEvent<Event>) {
        if (!e.target) return;
        e.target.set("opacity", 0.4);
        canvas.renderAll();
      });

      canvas.on("mouse:out", function (e: fabric.IEvent<Event>) {
        if (!e.target) return;
        e.target.set("opacity", 0.2);
        canvas.renderAll();
      });
    }
  }, [canvas]);

  const handleAddHotspot = () => {
    const rect = new fabric.Rect({
      backgroundColor: "rgba(0,0,0)",
      opacity: 0.2,
      width: 100,
      height: 100,
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 - 50,
      strokeWidth: 1,
      stroke: "white",
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

      <Button
        size="sm"
        type="button"
        onClick={() => handleSave()}
        disabled={props.isSaving}
      >
        Save
      </Button>

      <div className="ml-auto flex items-center">
        {props.isSaving ? (
          <Loader className="w-4 h-4 mr-2 text-gray-900 animate-spin" />
        ) : null}
      </div>
    </div>
  );
};
