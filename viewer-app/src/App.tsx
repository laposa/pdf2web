import React, { useState } from "react";
import { Page } from "./components/page";
import { AppOptions } from "./main";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";

type AppProps = {
  configuration: AppOptions;
};

// TODO check image size from actual content
const dimensions = {
  width: 1190,
  height: 1683,
};

function App(props: AppProps) {
  const { manifest, imagesBaseUrl } = props.configuration;
  const flipbook = React.createRef<typeof HTMLFlipBook>();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    // @ts-expect-error: types not implemented correctly in package
    flipbook.current?.pageFlip().flipNext();
  };

  const handlePrev = () => {
    // @ts-expect-error: types not implemented correctly in package
    flipbook.current?.pageFlip().flipPrev();
  };

  const handleOnFlip = (e) => {
    setActiveIndex(e.data);
    const audio = new Audio("/sounds/flip-sound.mp3"); // Initialize the audio with the file
    audio.play(); // Play the audio
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center h-full font-sans px-4 page-flip-wrapper">
      <div className="relative w-full flex justify-center leaflet">
        {/* @ts-expect-error: types not implemented correctly in package */}
        <HTMLFlipBook
          size="stretch"
          ref={flipbook}
          width={dimensions.width}
          height={dimensions.height}
          startPage={0}
          flippingTime={1000}
          minWidth={330}
          maxWidth={600}
          showCover={true}
          onFlip={handleOnFlip}
        >
          {manifest.pages.map((page, index) => (
            <div>
              <Page
                page={page}
                imagesBaseUrl={imagesBaseUrl}
                key={`page-${index}`}
                isActive={index === activeIndex}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <div className="flex items-center gap-4 justify-center mt-4 pagination">
        <button
          onClick={handlePrev}
          className="w-8 h-8 border rounded flex items-center justify-center"
        >
          <ChevronLeft />
        </button>

        <div>
          Page {activeIndex + 1} of {manifest.pages.length}
        </div>
        <button
          onClick={handleNext}
          className="w-8 h-8 border rounded flex items-center justify-center"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export default App;
