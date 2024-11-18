import { PublicationEditor } from "@/components/publication-editor";
import { AppConfig } from "./main";

type AppProps = {
  configuration: AppConfig
};

function App(props: AppProps) {
  return (
    <div className="flex justify-center">
      <PublicationEditor manifest={props.configuration.manifest} />
    </div>
  );
}

export default App;
