import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useFabric } from "@/components/fabric/use-fabric";
import { Area } from "@/components/editor/editor";

type FabricCanvasProps = {
  options?: fabric.ICanvasOptions;
  width?: number;
  height?: number;
  initialData?: Area[];
};

export const FabricCanvas = (props: FabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas } = useFabric();
  const { initialData } = props;

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, props.options ?? {});
    setCanvas(canvas);
    if (props.width) {
      canvas.setWidth(props.width);
    }

    if (props.height) {
      canvas.setHeight(props.height);
    }

    if (initialData) {
      initialData.map((area, index) => {
        const rect = new fabric.Rect({
          // @ts-ignore
          id: `object-${index}`,
          left: canvas.getWidth() * (area.left / 100),
          top: canvas.getHeight() * (area.top / 100),
          width: canvas.getWidth() * (area.width / 100),
          height: canvas.getHeight() * (area.height / 100),
          backgroundColor: "rgba(33,33,33)",
          opacity: 0.2,
          strokeWidth: 1,
          stroke: "white",
          tooltip: area.tooltip,
          url: area.url,
        });

        canvas.add(rect);
      });
    }

    canvas.renderAll();

    return () => {
      setCanvas(null);
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
