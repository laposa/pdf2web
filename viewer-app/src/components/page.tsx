import { PdfPage } from "@/shared";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

type PageProps = {
  isActive?: boolean;
  imagesBaseUrl?: string;
  page: PdfPage;
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

  const pageUrl = props.imagesBaseUrl ? `${props.imagesBaseUrl}/${page.filename}` : page.filename;

  return (
    <div className="page" onClick={() => startAnimation()}>
      <div className="relative">
        <img
          className=""
          src={pageUrl}
          alt="Image 1"
        />
        {page.areas &&
          page.areas.length > 0 &&
          page.areas.map((area, index) => (
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
                className=""
              ></motion.a>
              {area.tooltip ? (
                <div className="">
                  {area.tooltip}
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
};
