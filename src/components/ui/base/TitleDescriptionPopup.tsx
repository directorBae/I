"use client";
import clsx from "clsx";

type TitleDescriptionPopupProps = {
  title: string;
  description: string;
  image?: React.ReactNode;
};

export const TitlePopup = ({
  title,
  description,
  image,
}: TitleDescriptionPopupProps) => {
  return (
    <div
      className="hidden flex-row justify-center align-center gap-3
    w-80 h-36 bg-[#faf9f6] rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-[inset_0px_0px_10px_0px_rgba(0,0,0,0.15)]
    px-1 py-3
    md:flex lg:flex xl:flex
    "
    >
      {image}
      <div
        className=" w-1/2 gap-1
      flex flex-col justify-start align-center"
      >
        <div
          className={clsx(
            "text-sm lg:text-sm xl:text-lg font-bold text-[#242424] cursor-default w-fit"
          )}
        >
          {title}
        </div>
        <div
          className={clsx(
            "break-words leading-tight text-sm font-light text-[#242424] whitespace-pre-line w-fit "
          )}
        >
          {description}
        </div>
      </div>
    </div>
  );
};
