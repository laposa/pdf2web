import { Area } from "@/components/editor/editor";
import { createContext } from "react";

type FabricContextType = {
  canvas: any;
  setCanvas: (canvas: any) => void;
  handleSave: (objects: Area[]) => void;
};

export const FabricContext = createContext<FabricContextType | null>(null);
