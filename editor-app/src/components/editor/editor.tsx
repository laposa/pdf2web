import { FabricCanvas } from "@/components/fabric/fabric-canvas";
import { FabricProvider } from "@/components/fabric/fabric-provider";
import { useFabric } from "@/components/fabric/use-fabric";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  onUpdate?: (objects: Area[]) => void;
};

export const Editor = (props: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { src, onUpdate } = props;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <FabricProvider>
      <EditorController onUpdate={onUpdate} />
      <div className="relative" ref={ref}>
        <img
          className="w-full h-auto"
          src={src}
          onLoad={() => setImageLoaded(true)}
          alt="Image to edit"
        />
        {imageLoaded && ref.current ? (
          <div className="absolute inset-0">
            <FabricCanvas
              width={ref.current.clientWidth}
              height={ref.current.clientHeight}
              initialData={props.data}
            />
          </div>
        ) : null}
      </div>
      <ObjectEditor />
    </FabricProvider>
  );
};

export const EditorController = (props) => {
  const { canvas } = useFabric();
  const { onUpdate } = props;

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:over", function (e) {
        if (!e.target) return;
        e.target.set("opacity", "0.4");
        canvas.renderAll();
      });

      canvas.on("mouse:out", function (e) {
        if (!e.target) return;
        e.target.set("opacity", "0.2");
        canvas.renderAll();
      });
    }
  }, [canvas]);

  const handleAddHotspot = (e) => {
    const rect = new fabric.Rect({
      backgroundColor: "rgba(0,0,0)",
      opacity: 0.2,
      width: 100,
      height: 100,
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 - 50,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const handleSave = () => {
    const objects = canvas.getObjects().map((o) => ({
      left: +((o.left / canvas.getWidth()) * 100).toFixed(2),
      top: +((o.top / canvas.getHeight()) * 100).toFixed(2),
      width: +((o.getScaledWidth() / canvas.getWidth()) * 100).toFixed(2),
      height: +((o.getScaledHeight() / canvas.getHeight()) * 100).toFixed(2),
    }));

    console.log("objects", objects);
    onUpdate(objects);
  };

  return (
    <div className="flex gap-2 mb-2">
      <Button onClick={handleAddHotspot}>
        <Plus className="w-4 h-4 mr-2" />
        Add Hotspot
      </Button>

      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};
