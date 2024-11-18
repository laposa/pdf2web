import { FabricContext } from "@/components/fabric/fabric-context";
import { useCallback, useEffect, useState } from "react";
import { Object as FObject } from "fabric/fabric-impl";
import _debounce from "lodash/debounce";
import { PdfPageArea } from "@/shared";

interface FabricProviderProps {
  children: React.ReactNode;
  onUpdate: (objects: PdfPageArea[]) => void;
}

type PdfPageAreaObject = PdfPageArea & FObject;

const getPosition = (object: PdfPageAreaObject) => {
  return {
    x: object.left ?? 0,
    y: object.top ? object.top + 50 : 0,
    width: object.width && object.scaleX ? object.width * object.scaleX : 0,
    height: object.height && object.scaleY ? object.height * object.scaleY : 0,
  };
};

export const FabricProvider = (props: FabricProviderProps) => {
  const [canvas, setCanvas] = useState<any>(null);
  const [selectedObject, setSelectedObject] = useState<PdfPageAreaObject | null>();
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleSave = () => {
    const objects = canvas.getObjects().map((o: any) => ({
      left: +((o.left / canvas.getWidth()) * 100).toFixed(2),
      top: +((o.top / canvas.getHeight()) * 100).toFixed(2),
      width: +((o.getScaledWidth() / canvas.getWidth()) * 100).toFixed(2),
      height: +((o.getScaledHeight() / canvas.getHeight()) * 100).toFixed(2),
      tooltip: o.tooltip,
      url: o.url,
    }));

    debouncedSave(objects);
  };

  const debouncedSave = useCallback(
    _debounce((payload) => {
      props.onUpdate(payload);
    }, 1000),
    []
  );

  useEffect(() => {
    if (canvas) {
      setSelectedObject(null);

      canvas.on("object:modified", handleSave);
      canvas.on("object:added", handleSave);
      canvas.on("object:removed", handleSave);

      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      canvas.on("object:moving", (event: fabric.IEvent<Event>) => {
        const object = event.target as PdfPageAreaObject;
        if (object) {
          setPosition(getPosition(object));
        }
      });
      canvas.on("object:scaling", (event: fabric.IEvent<Event>) => {
        const object = event.target as PdfPageAreaObject;
        if (object) {
          setPosition(getPosition(object));
        }
      });
    }
  }, [canvas]);

  const handleObjectSelected = (event: fabric.IEvent<Event>) => {
    const object = event.selected?.[0] as PdfPageAreaObject;
    if (object !== undefined) {
      setSelectedObject(object);
    }
  };

  useEffect(() => {
    if (selectedObject) {
      setPosition(getPosition(selectedObject));
    }
  }, [selectedObject]);

  const value = {
    canvas,
    setCanvas,
    handleSave,
    selectedObject,
    position,
  };

  return (
    <FabricContext.Provider value={value}>
      {props.children}
    </FabricContext.Provider>
  );
};
