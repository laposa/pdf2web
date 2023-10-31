import { useEffect, useState } from "react";
// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

type AppProps = {
  configuration: {
    manifest_url: string;
  };
};
function App(props: AppProps) {
  const [data, setData] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch(`${props.configuration.manifest_url}`).then((res) => {
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
          <SplideSlide>
            {activeIndex === index ? (
              <div className="flex justify-center">
                <div className="relative p-8">
                  <img
                    className="h-[70vh] border w-auto max-w-full shadow-lg"
                    src={page.url}
                    alt="Image 1"
                  />
                  {page.areas_json &&
                    page.areas_json.length > 0 &&
                    page.areas_json.map((area) => (
                      <div
                        className="absolute group"
                        style={{
                          left: `${area.left}%`,
                          top: `${area.top}%`,
                          width: `${area.width}%`,
                          height: `${area.height}%`,
                        }}
                      >
                        <a
                          href={area.url}
                          target="_blank"
                          className="absolute inset-0 transition-all duration-700 bg-indigo-600 opacity-0 hover:opacity-50 animate-flash-in"
                        ></a>
                        {area.tooltip ? (
                          <div className="absolute opacity-0 transition-all duration-700 top-[100%] left-1/2 -translate-x-1/2 py-1 px-6 rounded shadow bg-white group-hover:opacity-100">
                            {area.tooltip}
                          </div>
                        ) : null}
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default App;
