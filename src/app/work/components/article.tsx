// TODO: Article component 만들기. 전체 보기로 펴져 있을 때와 펴져 있지 않을 때를 잘 고려해서 짜기
// 애니메이션 적용 필수
// QueryString을 받아서, 해당하는 article을 불러오는 방식으로 짜기
// 사이드에 고정시키지 않고 node에 hover만 해서 보여줄 용도로 사용할 경우에는 그냥 prop으로 받기
// 서버사이드 렌더링 적용되어 있어서 SEO 최적화가 되어 있어야 함

// QueryString이 없으면, 404 페이지로 이동시키기
// QueryString이 잘못된 경우, 404 페이지로 이동시키기
"use client";

import { motion } from "framer-motion";
import { useGraphState } from "@/hooks/useGraphState";
import { useEffect } from "react";
import { useState } from "react";

type ArticleProps = {
  id: string;
};

export const HoverArticle = () => {
  const { hoveredNode, contentsData } = useGraphState();
  const [currentHoveredNode, setCurrentHoveredNode] = useState(hoveredNode);

  useEffect(() => {
    if (hoveredNode) {
      setCurrentHoveredNode(hoveredNode); // ✅ 내부 상태 업데이트
    }
  }, [hoveredNode]); // ✅ `hoveredNode` 변경 감지

  if (
    !currentHoveredNode ||
    !contentsData ||
    !contentsData[currentHoveredNode]
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.4 }}
      className="absolute top-0 right-0 w-24 h-full bg-white p-6 shadow-lg overflow-auto z-10"
    >
      <div className="rotate-90 transform translate-x-6 origin-left w-96 font-black text-6xl z-10">
        {contentsData && contentsData[hoveredNode || 0]?.title}
      </div>
    </motion.div>
  );
};

export const Article = ({ id }: ArticleProps) => {
  const { contentsData } = useGraphState();

  if (!contentsData || !contentsData[id]) {
    return null;
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.4 }}
      className="absolute top-0 right-0 w-24 h-full bg-white p-6 shadow-lg overflow-auto"
    >
      <div className="rotate-90 transform translate-x-6 origin-left w-96 font-black text-6xl">
        {contentsData && contentsData[id]?.title}
      </div>
    </motion.div>
  );
};
