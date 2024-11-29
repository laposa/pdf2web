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
            <div className="leaflet">
                {/* @ts-expect-error: types not implemented correctly in package */}
                <HTMLFlipBook
                    size="stretch"
                    width={297 * 1}
                    height={210 * 1}
                    minWidth={297 * 1}
                    minHeight={210 * 1}
                    maxWidth={297 * 1}
                    maxHeight={210 * 1}
                    ref={flipbook}
                    startPage={0}
                    showCover={true}
                    onFlip={handleOnFlip}
                    renderOnlyPageLengthChange={true}
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

            <div className="pagination">
                <button onClick={handlePrev} className="prev">
                    <ChevronLeft />
                </button>

                <div>
                    Page {activeIndex + 1} of {manifest.pages.length}
                </div>
                <button onClick={handleNext} className="next">
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}

export default App;
