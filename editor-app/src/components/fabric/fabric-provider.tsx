import { Area } from "@/components/editor/editor";
import { FabricContext } from "@/components/fabric/fabric-context";
import { useEffect, useState } from "react";

interface FabricProviderProps {
  children: React.ReactNode;
  onUpdate: (objects: Area[]) => void;
}

export const FabricProvider = (props: FabricProviderProps) => {
  const [canvas, setCanvas] = useState<any>(null);

  const handleSave = () => {
    // TODO: Fabric.js typescript
    const objects = canvas.getObjects().map((o: any) => ({
      left: +((o.left / canvas.getWidth()) * 100).toFixed(2),
      top: +((o.top / canvas.getHeight()) * 100).toFixed(2),
      width: +((o.getScaledWidth() / canvas.getWidth()) * 100).toFixed(2),
      height: +((o.getScaledHeight() / canvas.getHeight()) * 100).toFixed(2),
      tooltip: o.tooltip,
      url: o.url,
    }));

    props.onUpdate(objects);
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("after:render", () => console.log("HERE!!!!!"));
    }
  }, [canvas]);

  const value = {
    canvas,
    setCanvas,
    handleSave,
  };

  return (
    <FabricContext.Provider value={value}>
      {props.children}
    </FabricContext.Provider>
  );
};
