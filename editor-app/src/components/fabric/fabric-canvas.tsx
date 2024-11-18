import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useFabric } from "@/components/fabric/use-fabric";
import { PdfPageArea } from "@/shared";

type FabricCanvasProps = {
  options?: fabric.ICanvasOptions;
  width?: number;
  height?: number;
  initialData?: PdfPageArea[];
};

export const FabricCanvas = (props: FabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas } = useFabric();
  const { initialData } = props;

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, props.options ?? {});

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
          backgroundColor: "black",
          hasBorders: false,
          borderColor: "white",
          borderWidth: 1,
          cornerColor: "black",
          cornerSize: 5,
          cornerStrokeColor: "white",
          lockScalingFlip: true,
          opacity: 0.4,
          strokeWidth: 1,
          stroke: "white",
          strokeUniform: true,
          strokeDashArray: [5, 5],
          transparentCorners: false,
          tooltip: area.tooltip,
          url: area.url,
        });

        canvas.add(rect);
      });
    }

    canvas.renderAll();

    setCanvas(canvas);

    return () => {
      setCanvas(null);
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
