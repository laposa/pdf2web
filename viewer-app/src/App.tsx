import React, { useState } from 'react';
import { Page } from './components/page';
import { AppOptions } from './main';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type AppProps = {
    configuration: AppOptions;
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
        const audio = new Audio('/sounds/flip-sound.mp3'); // Initialize the audio with the file
        audio.play(); // Play the audio
    };

    return (
        <div className="page-flip-wrapper">
            {/* @ts-expect-error: types not implemented correctly in package */}
            <HTMLFlipBook
                className="leaflet"
                width={550}
                height={733}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={420}
                maxHeight={1350}
                maxShadowOpacity={0.5}
                ref={flipbook}
                showCover={true}
                onFlip={handleOnFlip}
                renderOnlyPageLengthChange={true}
            >
                {manifest.pages.map((page, index) => (
                    <div className="page">
                        <Page
                            page={page}
                            imagesBaseUrl={imagesBaseUrl}
                            key={`page-${index}`}
                            isActive={index === activeIndex}
                        />
                    </div>
                ))}
            </HTMLFlipBook>

            <div className="pagination">
                <button
                    onClick={handlePrev}
                    className="pagination-btn prev"
                    disabled={activeIndex === 0}
                >
                    <ChevronLeft />
                </button>

                <div>
                    Page {activeIndex + 1} of {manifest.pages.length}
                </div>
                <button
                    onClick={handleNext}
                    className="pagination-btn next"
                    disabled={activeIndex === manifest.pages.length - 2}
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}

export default App;
