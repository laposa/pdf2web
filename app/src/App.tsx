import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Page } from "./components/page";
import { AppOptions } from "./main";

type AppProps = {
  configuration: AppOptions
};

function App(props: AppProps) {
  const { manifest, imagesBaseUrl } = props.configuration;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMove = (_: any, newIndex: number) => {
    setActiveIndex(newIndex);
  };

  return (
    <div className="fixed inset-0 flex  items-center h-full font-sans">
      <Splide aria-label={manifest.source} onMove={handleMove} className="w-full">
        {manifest.pages.map((page, index) => (
          <SplideSlide key={index}>
            <Page
              page={page}
              imagesBaseUrl={imagesBaseUrl}
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
