import { useFabric } from "@/components/fabric/use-fabric";
import { useEffect } from "react";

export const ObjectEditor = () => {
  const { canvas } = useFabric();

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", function () {});
      canvas.on("selection:created", function () {});
    }
  }, [canvas]);

  return <></>;
};
