import { usePublications } from "@/api/use-publicaction";
import { Publication } from "@/components/publication";
import { PublicationsList } from "@/components/publications-list";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicationsList />
    </QueryClientProvider>
  );
}

export default App;
