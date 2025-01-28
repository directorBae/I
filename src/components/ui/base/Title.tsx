"use client";
import clsx from "clsx";

type TitleProps = {
  text: string;
  textbg?: string; // 텍스트 색상
  hoverBg?: string; // Hover 시 배경색
  onHover?: () => void; // Hover 이벤트
};

export const Title = ({
  text,
  textbg = "bg-gradient-to-r to-[#242424] from-[#242424]", // 기본 텍스트 색상 (HEX)
  hoverBg = "hover:bg-gradient-to-r hover:to-[#242424] hover:from-[#242424]", // 기본 Hover 색 (HEX)
  onHover = () => {},
}: TitleProps) => {
  return (
    <div
      className={clsx(
        "text-xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-5xl font-extrabold bg-clip-text text-transparent transition-all duration-300 cursor-default w-fit",
        textbg,
        hoverBg
      )}
      onMouseEnter={onHover}
    >
      {text}
    </div>
  );
};
