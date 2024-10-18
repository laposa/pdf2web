import { PublicationsList } from "@/components/publications-list";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppConfig } from "./main";

const queryClient = new QueryClient();

type AppProps = {
  configuration: AppConfig
};

function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicationsList publicationId={props.configuration.publication_id} />
    </QueryClientProvider>
  );
}

export default App;
