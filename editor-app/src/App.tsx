import { PublicationsList } from "@/components/publications-list";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

type AppProps = {
  configuration: {
    api_url: string;
    api_token: string;
    publication_id?: number;
  };
};

function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicationsList publicationId={props.configuration.publication_id} />
    </QueryClientProvider>
  );
}

export default App;
