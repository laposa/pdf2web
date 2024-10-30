import { PublicationEditor } from "@/components/publication-editor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppConfig } from "./main";

const queryClient = new QueryClient();

type AppProps = {
  configuration: AppConfig
};

function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex justify-center">
        <PublicationEditor publicationId={props.configuration.publicationId} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
