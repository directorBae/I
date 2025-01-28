"use client";
import clsx from "clsx";

type ContextProps = {
  title: string;
  description: string;
};

export const Context = ({ title, description }: ContextProps) => {
  return (
    <div className="flex flex-col justify-start gap-5">
      <div
        className={clsx(
          "text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-[#242424] cursor-default w-fit"
        )}
      >
        {title}
      </div>
      <div className="h-4 md:h-16 w-full lock " />
      <div className="h-px bg-black w-10" />
      <div
        className={clsx(
          "text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-[#242424] whitespace-pre-wrap w-fit mb-12 lg:mb-24"
        )}
      >
        {description}
      </div>
    </div>
  );
};
