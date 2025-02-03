// TODO: Hover하면 나오는 팝업 컴포넌트들의 집합.

// TODO: Article component 만들기. 전체 보기로 펴져 있을 때와 펴져 있지 않을 때를 잘 고려해서 짜기
// 애니메이션 적용 필수
// QueryString을 받아서, 해당하는 article을 불러오는 방식으로 짜기
// 사이드에 고정시키지 않고 node에 hover만 해서 보여줄 용도로 사용할 경우에는 그냥 prop으로 받기
// 서버사이드 렌더링 적용되어 있어서 SEO 최적화가 되어 있어야 함

// QueryString이 없으면, 404 페이지로 이동시키기
// QueryString이 잘못된 경우, 404 페이지로 이동시키기
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGraphState } from "@/context/GraphContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import SwipeHolder from "@public/svgs/swipeToOpen.svg";
import { useRouter } from "next/navigation";

export const HoverArticle = () => {
  const {
    hoveredNode,
    contentsData,
    setSelectedNode,
    setIsShowSide,
    isShowSide,
  } = useGraphState();
  const [currentHoveredNode, setCurrentHoveredNode] = useState(hoveredNode);

  const router = useRouter();

  useEffect(() => {
    if (hoveredNode) {
      setCurrentHoveredNode(hoveredNode); // 내부 상태 업데이트
    } else {
      setCurrentHoveredNode(null);
    }
  }, [hoveredNode, isShowSide]);

  const clickSwiper = (id: string) => {
    setSelectedNode(id);
    setIsShowSide(false);
    setCurrentHoveredNode(null);
    router.push(`/work?id=${id}`);
  };

  const shouldRender =
    currentHoveredNode &&
    contentsData &&
    contentsData[currentHoveredNode] &&
    isShowSide;

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key={currentHoveredNode} // key를 주면 상태 변화 시 언마운트/마운트가 강제됨
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "tween", duration: 0.4 }}
          className="absolute top-0 right-0 w-24 h-full bg-[#fafafa] p-6 shadow-lg z-10 rounded-tl-xl rounded-bl-xl"
        >
          <div className="absolute transform -translate-x-full left-0 z-50 cursor-pointer">
            <Image
              src={SwipeHolder}
              alt="swipe holder"
              onClick={() => clickSwiper(currentHoveredNode)}
            />
          </div>
          <div className="rotate-90 transform translate-x-6 origin-left w-96 font-black text-6xl z-10">
            {contentsData[currentHoveredNode]?.title}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
