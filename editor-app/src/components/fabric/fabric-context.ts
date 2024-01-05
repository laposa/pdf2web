import { Object } from "fabric/fabric-impl";
import { createContext } from "react";

type FabricContextType = {
  canvas: any;
  setCanvas: (canvas: any) => void;
  handleSave: () => void;
  selectedObject: Object | null | undefined;
  position: { x: number; y: number; width: number; height: number };
};

export const FabricContext = createContext<FabricContextType | null>(null);
