import { createContext } from "react";

type FabricContextType = {
  canvas: any;
  setCanvas: (canvas: any) => void;
};

export const FabricContext = createContext<FabricContextType | null>(null);
