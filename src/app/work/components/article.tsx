// TODO: Article component 만들기. 전체 보기로 펴져 있을 때와 펴져 있지 않을 때를 잘 고려해서 짜기
// 애니메이션 적용 필수
// QueryString을 받아서, 해당하는 article을 불러오는 방식으로 짜기
// 사이드에 고정시키지 않고 node에 hover만 해서 보여줄 용도로 사용할 경우에는 그냥 prop으로 받기
// 서버사이드 렌더링 적용되어 있어서 SEO 최적화가 되어 있어야 함

// QueryString이 없으면, 404 페이지로 이동시키기
// QueryString이 잘못된 경우, 404 페이지로 이동시키기
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useGraphState } from '@/context/GraphContext';
import LinkIcon from '@public/svgs/link.svg';
import { Globe } from 'lucide-react';
import GithubIcon from '@public/svgs/github.svg';
import Image from 'next/image';
import SwipeHolder from '@public/svgs/swipeHolder.svg';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type HoverIdProps = {
  node: {
    id: string;
    title: string;
    date: string;
  };
  x: number;
  y: number;
};

type ArticleProps = {
  id: string;
};

type LinkHoverProps = {
  type: 'website' | 'github';
};

export const Article = ({ id }: ArticleProps) => {
  const {
    contentsData,
    setHoveredNode,
    setIsShowSide,
    parseNearbyNodesWithTitle,
  } = useGraphState();
  const [hoverNode, setHoverNode] = useState<{
    id: string;
    title: string;
    date: string;
  } | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [hoverIconType, setHoverIconType] = useState<
    'website' | 'github' | null
  >(null);

  const router = useRouter();

  const clickSwiper = () => {
    setHoveredNode(id);
    setIsShowSide(true);
    router.push(`/work`);
  };

  const shouldRender = contentsData && contentsData[id];

  const [eachPosition, setEachPosition] = useState<
    {
      id: string;
      title: string;
      date: string;
      x: number;
      y: number;
      r: number;
      theta: number;
    }[]
  >([]);

  const getEachPosition = (node: {
    id: string;
    title: string;
    date: string;
  }) => {
    const r = 250 + Math.random() * 100;
    const theta = 90 + (Math.random() * 2 - 1) * 20;
    const x = r * Math.sin(((theta - 90) * Math.PI) / 180);
    const y = r * Math.cos(((theta - 90) * Math.PI) / 180);
    return { ...node, x, y, r, theta };
  };

  const RelatedHoverTitle = ({ node, x, y }: HoverIdProps) => {
    return (
      <div
        className="absolute w-fit h-20 flex items-center px-2"
        style={{
          bottom: y + 20,
          left: `calc(50% + ${x}px)`,
          zIndex: 200,
        }}
      >
        <div className="text-6xl font-black opacity-20">{node.title}</div>
      </div>
    );
  };

  const LinkHover = ({ type }: LinkHoverProps) => {
    return (
      <div className="absolute w-20 h-20 opacity-20">
        {type === 'website' ? (
          <div className="flex justify-center items-center gap-8">
            <Globe size={80} />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-8">
            <Image src={GithubIcon} width={80} alt="link icon" />
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (id) {
      const nodes = parseNearbyNodesWithTitle(id);
      try {
        const positionCalculated = nodes.map((node) => {
          return getEachPosition(node);
        });
        setEachPosition(positionCalculated);
      } catch (e) {
        console.log(e);
      }
    }
  }, [id, parseNearbyNodesWithTitle]);

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
          className="absolute top-0 right-0 h-full w-full bg-[#fafafa] shadow-lg rounded-tl-2xl rounded-bl-2xl min-w-[200px]"
          style={{ width: '93.75%' }}
        >
          <div className="absolute transform -translate-x-full left-0 z-50 top-12">
            <Image
              src={SwipeHolder}
              alt="swipe holder"
              onClick={() => clickSwiper()}
              className="cursor-pointer"
            />
          </div>
          <div className="overflow-y-auto h-full px-6 pt-10">
            <div className="flex flex-col gap-20 pl-6">
              <div className="flex justify-between items-center pr-20">
                <div className="transform font-black text-6xl opacity-10">
                  {contentsData && contentsData[id]?.title}
                </div>
                <div className="flex w-fit justify-center items-center gap-4">
                  {contentsData[id]?.links.website.includes('http') && (
                    <div className="flex justify-center items-center relative w-20 h-20">
                      {hoverIconType === 'website' && (
                        <LinkHover type={hoverIconType} />
                      )}
                      <Image
                        src={LinkIcon}
                        alt="link icon"
                        onMouseEnter={() => setHoverIconType('website')}
                        onMouseLeave={() => setHoverIconType(null)}
                        style={{
                          cursor: 'pointer',
                          position: 'absolute',
                          zIndex: 100,
                        }}
                        onClick={() => {
                          window.open(
                            contentsData[id]?.links.website,
                            '_blank',
                          );
                        }}
                      />
                    </div>
                  )}
                  {contentsData[id]?.links.github.includes('http') && (
                    <div className="flex justify-center items-center relative w-20 h-20">
                      {hoverIconType === 'github' && (
                        <LinkHover type={hoverIconType} />
                      )}
                      <Image
                        src={LinkIcon}
                        alt="link icon"
                        onMouseEnter={() => setHoverIconType('github')}
                        onMouseLeave={() => setHoverIconType(null)}
                        style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          zIndex: 100,
                        }}
                        onClick={() => {
                          window.open(contentsData[id]?.links.github, '_blank');
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="h-[0.5] bg-gray-300 w-10" />
              <div className="text-lg min-h-lvh">
                {contentsData && contentsData[id]?.content}
              </div>
              <div className="relative flex mt-10 justify-center h-[800px] overflow-hidden items-end">
                {hoverNode !== null ? (
                  <RelatedHoverTitle
                    node={hoverNode}
                    x={hoverCoords.x}
                    y={hoverCoords.y}
                  />
                ) : null}
                <div
                  className="relative h-[800px] w-full overflow-y-hidden"
                  style={{
                    top: 40,
                  }}
                >
                  {eachPosition.map((pos, index) => (
                    <div
                      className="absolute w-10 h-10 flex justify-center items-center"
                      key={index}
                      style={{
                        bottom: `${pos.y}px`,
                        left: `calc(50% + ${pos.x}px)`,
                        cursor: 'pointer',
                        transform: `translate(-50%, 50%)`,
                        zIndex: 100,
                      }}
                      onMouseEnter={() => {
                        setHoverNode({
                          id: pos.id,
                          title: pos.title,
                          date: pos.date,
                        });
                        setHoverCoords({ x: pos.x, y: pos.y });
                      }}
                      onMouseLeave={() => {
                        setHoverNode(null);
                      }}
                      onClick={() => {
                        router.push(`/work?id=${pos.id}`, { scroll: true });
                      }}
                    >
                      <div
                        className="h-2 w-2 rounded-full justify-center items-center"
                        style={{
                          bottom: `${pos.y}px`,
                          left: `calc(50% + ${pos.x}px)`,
                          cursor: 'pointer',
                          background:
                            'linear-gradient(180deg, #003366 0%, #0F52BA 100%)',
                          boxShadow: ' 0px 0px 8px rgba(250, 250, 250, 0.7)',
                        }}
                      />
                    </div>
                  ))}
                  {eachPosition.map((pos, index) => (
                    <div
                      key={index}
                      className="absolute bg-[#24242480] w-0.5"
                      style={{
                        bottom: 0,
                        left: `50%`,
                        height: `${pos.r}px`,
                        transform: `rotate(${pos.theta - 90}deg)`,
                        transformOrigin: 'bottom center',
                        filter:
                          'drop-shadow(0 -500px 5px rgba(0,0,0,0.3)) blur(1px)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
