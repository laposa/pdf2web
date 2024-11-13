import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

type PageProps = {
  isActive?: boolean;
  imagesBaseUrl?: string;
  page: any; // todo: shared types
};

export const Page = (props: PageProps) => {
  const { page, isActive } = props;

  const controls = useAnimationControls();

  const startAnimation = (delay = 0) => {
    controls.start({
      opacity: [0, 0.5, 0],
      transition: {
        delay: delay,
      },
    });
  };

  useEffect(() => {
    if (isActive) {
      startAnimation(0.5);
    }
  }, [isActive]);

  const pageUrl = props.imagesBaseUrl
    ? `${props.imagesBaseUrl}${page.filename}`
    : page.filename;

  return (
    <div className="flex justify-center" onClick={() => startAnimation()}>
      <div className="relative">
        <img
          className="border w-auto max-w-full shadow-lg"
          src={pageUrl}
          alt="Image 1"
        />
        {page.areas_json &&
          page.areas_json.length > 0 &&
          page.areas_json.map((area, index) => (
            <div
              key={`area-${index}`}
              className="absolute group"
              style={{
                left: `${area.left}%`,
                top: `${area.top}%`,
                width: `${area.width}%`,
                height: `${area.height}%`,
              }}
            >
              <motion.a
                animate={controls}
                whileHover={{ opacity: 0.5 }}
                href={area.url}
                target="_blank"
                className="absolute inset-0 transition-all duration-700 bg-indigo-600 opacity-0"
              ></motion.a>
              {area.tooltip ? (
                <div className="absolute opacity-0 transition-all duration-700 top-[100%] left-1/2 -translate-x-1/2 py-1 px-6 rounded shadow bg-white group-hover:opacity-100">
                  {area.tooltip}
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
};
