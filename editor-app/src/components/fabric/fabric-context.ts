import { createContext } from "react";

type FabricContextType = {
  canvas: any;
  setCanvas: (canvas: any) => void;
  handleSave: () => void;
};

export const FabricContext = createContext<FabricContextType | null>(null);
