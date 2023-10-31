import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

function App() {
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/manifests/18.json").then((res) => {
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
    <div className="fixed inset-0 flex  items-center h-full ">
      <Splide aria-label={data.name} onMove={handleMove} className="w-full">
        {data.pages.map((page, index) => (
          <SplideSlide>
            {activeIndex === index ? (
              <div className="flex justify-center">
                <div className="relative p-8">
                  <img
                    className="h-[70vh] border shadow-lg"
                    src={page.url}
                    alt="Image 1"
                  />
                  {page.areas_json &&
                    page.areas_json.length > 0 &&
                    page.areas_json.map((area) => (
                      <a
                        href={area.url}
                        target="_blank"
                        className="absolute transition-all duration-700 bg-indigo-600 opacity-0 hover:opacity-50 animate-flash-in"
                        style={{
                          left: `${area.left}%`,
                          top: `${area.top}%`,
                          width: `${area.width}%`,
                          height: `${area.height}%`,
                        }}
                      ></a>
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
