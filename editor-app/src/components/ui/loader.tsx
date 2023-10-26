import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex justify-center">
      <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
    </div>
  );
};
