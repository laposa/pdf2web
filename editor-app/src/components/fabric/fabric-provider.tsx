import { FabricContext } from "@/components/fabric/fabric-context";
import { useState } from "react";

interface FabricProviderProps {
  children: React.ReactNode;
}

export const FabricProvider = (props: FabricProviderProps) => {
  const [canvas, setCanvas] = useState<any>(null);
  const value = {
    canvas,
    setCanvas,
  };

  return (
    <FabricContext.Provider value={value}>
      {props.children}
    </FabricContext.Provider>
  );
};
