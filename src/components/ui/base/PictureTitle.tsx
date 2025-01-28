"use client";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

type PictureProps = {
  imageSrc: string | StaticImageData;
  back?: React.ReactNode;
};

export const Picture = ({ imageSrc, back }: PictureProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={
        "relative flex justify-center items-center p-12 my-10 h-48 sm:h-52 md:h-60 lg:h-72 xl:h-[540px] min-w-32"
      }
    >
      <div
        className={`flex justify-center item-center min-w-40 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-3/5 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="absolute -translate-y-1/2 transition-transform backface-hidden">
          <Image src={imageSrc} alt="Front Picture" className="rounded-sm" />
        </div>
        <div
          className={`absolute transition-transform backface-hidden rotate-y-180 w-full ${
            !isFlipped ? "pointer-events-none" : ""
          }`}
        >
          {back}
        </div>
      </div>
    </div>
  );
};
