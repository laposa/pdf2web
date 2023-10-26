import { FabricContext } from "@/components/fabric/fabric-context";
import { useContext, useEffect } from "react";

export const useFabric = () => {
  const context = useContext(FabricContext);

  if (!context) {
    throw "You need to add `FabricProvider` to your component tree";
  }

  return context;
};
