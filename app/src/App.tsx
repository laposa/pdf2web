import React, { useEffect, useState } from "react";
import { Page } from "./components/page";
import { AppOptions } from "./main";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";

type AppProps = {
  configuration: AppOptions;
};

const dimensions = {
  width: 1190,
  height: 1683,
};

function App(props: AppProps) {
  const [data, setData] = useState<any>(null);
  const flipbook = React.createRef<typeof HTMLFlipBook>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [width, setWidth] = useState(dimensions.width);
  const [height, setHeight] = useState(dimensions.height);

  useEffect(() => {
    fetch(`${props.configuration.manifestUrl}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => setData(data));
      }
    });

    if (typeof window !== undefined) {
      const maxHeight = window.innerHeight - 300;

      const ratio = dimensions.height / dimensions.width;
      setWidth(maxHeight / ratio);
      setHeight(maxHeight);
    }
  }, []);

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
    const audio = new Audio("/flip-sound.mp3"); // Initialize the audio with the file
    audio.play(); // Pla
  };
  if (!data) return null;

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center h-full font-sans px-4">
      <div className="relative w-full flex justify-center ">
        {/* @ts-expect-error: types not implemented correctly in package */}
        <HTMLFlipBook
          size="stretch"
          ref={flipbook}
          width={width}
          height={height}
          startPage={0}
          flippingTime={1000}
          minWidth={330}
          showCover={true}
          onFlip={handleOnFlip}
        >
          {data.pages.map((page, index) => (
            <div>
              <Page
                page={page}
                imagesBaseUrl={props.configuration.imagesBaseUrl}
                key={`page-${index}`}
                isActive={index === activeIndex}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>
      <div className="flex items-center gap-4 justify-center mt-4">
        <button
          onClick={handlePrev}
          className="w-8 h-8 border rounded flex items-center justify-center"
        >
          <ChevronLeft />
        </button>

        <div>
          Page {activeIndex + 1} of {data.pages.length}
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
