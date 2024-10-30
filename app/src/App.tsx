import { useEffect, useState } from "react";
// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Page } from "./components/page";
import { AppOptions } from "./main";

type AppProps = {
  configuration: AppOptions
};

function App(props: AppProps) {
  const [data, setData] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch(`${props.configuration.manifestUrl}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => setData(data));
      }
    });
  }, []);

  const handleMove = (_: any, newIndex: number) => {
    setActiveIndex(newIndex);
  };

  if (!data) return null;

  return (
    <div className="fixed inset-0 flex  items-center h-full font-sans">
      <Splide aria-label={data.name} onMove={handleMove} className="w-full">
        {data.pages.map((page, index) => (
          <SplideSlide key={index}>
            <Page
              page={page}
              imagesBaseUrl={props.configuration.imagesBaseUrl}
              key={`page-${index}`}
              isActive={index === activeIndex}
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default App;
