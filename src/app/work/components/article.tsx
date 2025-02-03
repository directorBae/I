// TODO: Article component 만들기. 전체 보기로 펴져 있을 때와 펴져 있지 않을 때를 잘 고려해서 짜기
// 애니메이션 적용 필수
// QueryString을 받아서, 해당하는 article을 불러오는 방식으로 짜기
// 사이드에 고정시키지 않고 node에 hover만 해서 보여줄 용도로 사용할 경우에는 그냥 prop으로 받기
// 서버사이드 렌더링 적용되어 있어서 SEO 최적화가 되어 있어야 함

// QueryString이 없으면, 404 페이지로 이동시키기
// QueryString이 잘못된 경우, 404 페이지로 이동시키기
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGraphState } from "@/context/GraphContext";
import LinkIcon from "@public/svgs/link.svg";
import Image from "next/image";
import SwipeHolder from "@public/svgs/swipeHolder.svg";
import { useRouter } from "next/navigation";

type ArticleProps = {
  id: string;
};

export const Article = ({ id }: ArticleProps) => {
  const { contentsData, setHoveredNode, setIsShowSide } = useGraphState();

  const router = useRouter();

  const clickSwiper = () => {
    setHoveredNode(id);
    setIsShowSide(true);
    router.push(`/work`);
  };

  const shouldRender = contentsData && contentsData[id];

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4 }}
          className="absolute top-0 right-0 h-full w-full bg-[#fafafa] px-6 py-10 shadow-lg verflow-y-auto rounded-tl-2xl rounded-bl-2xl"
          style={{ width: "93.75%" }}
        >
          <div className="absolute transform -translate-x-full left-0 z-50">
            <Image
              src={SwipeHolder}
              alt="swipe holder"
              onClick={() => clickSwiper()}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-20 pl-6">
            <div className="flex justify-between items-center pr-20">
              <div className="transform font-black text-6xl opacity-10">
                {contentsData && contentsData[id]?.title}
              </div>
              <Image src={LinkIcon} alt="link icon" />
            </div>
            <div className="h-[0.5] bg-gray-300 w-10" />
            <div className="text-lg min-h-lvh">
              {contentsData && contentsData[id]?.content}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
