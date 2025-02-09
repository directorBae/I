'use client';

import { Graph } from 'react-d3-graph';
import { useGraphState } from '@/context/GraphContext';
import LoadingSpinner from '../assets/clipLoader';
import { useEffect, useState } from 'react';

const GraphComponent = () => {
  const {
    hoveredNode,
    setHoveredNode,
    isShowSide,
    graphData,
    clickNode,
    parseNearbyNodes,
  } = useGraphState();
  const [nearbyNodes, setNearbyNodes] = useState<string[]>([]);
  const [nearbyEdges, setNearbyEdges] = useState<
    { source: string; target: string }[]
  >([]);

  useEffect(() => {
    if (isShowSide && hoveredNode) {
      const nodes = parseNearbyNodes(hoveredNode);
      setNearbyNodes(nodes);
      const edges = graphData.links.filter(
        (link: any) =>
          link.source === hoveredNode || link.target === hoveredNode,
      );
      setNearbyEdges(edges);
      console.log(edges);
    } else {
      setNearbyNodes([]);
      setNearbyEdges([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredNode, isShowSide, parseNearbyNodes]);

  // graphData가 존재할 때만 수정된 데이터를 생성합니다.
  const modifiedGraphData = graphData
    ? {
        ...graphData,
        nodes: graphData.nodes.map((node: any) => ({
          ...node,
          // isShowSide && hoveredNode가 있고 nearbyNodes에 포함되지 않은 경우 투명하게
          opacity:
            isShowSide && hoveredNode && !nearbyNodes.includes(node.id)
              ? 0.3
              : 0.9,
        })),
        links: graphData.links.map((link: any) => ({
          ...link,
          strokeWidth:
            isShowSide &&
            hoveredNode &&
            !nearbyEdges.some((edge) => {
              return (
                (edge.source === link.source && edge.target === link.target) ||
                (edge.source === link.target && edge.target === link.source)
              );
            })
              ? 0.1
              : 1.5,
        })),
      }
    : null;

  if (!graphData) {
    return (
      <div className="flex w-screen -translate-y-20 justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // ✅ 노드 Hover 이벤트
  const handleMouseOverNode = (nodeId: string | undefined) => {
    if (!nodeId || nodeId === hoveredNode) return; // ✅ 같은 값이면 업데이트 방지
    setHoveredNode(nodeId);
  };

  // ✅ Hover 해제 이벤트
  const handleMouseOutNode = () => {
    setHoveredNode(null);
  };

  // ✅ 노드 클릭 이벤트
  const onClickNode = (nodeId: string | undefined) => {
    if (!nodeId) return;
    clickNode(nodeId);
  };

  const graphConfig = {
    node: {
      color: 'white',
      size: 400,
      opacity: 0.9,
      renderLabel: false,
      svg: './svgs/node.svg',
    },
    link: {
      strokeWidth: 1.5,
    },
    width: 400,
    height: 500,
    d3: {
      gravity: -50 * (10 - (graphData?.nodes.length || 0) / 10),
    },
  };

  //isShowSide가 true이고 hoveredNode가 존재할 때,
  // 주변 노드 이외는 조금 투명하게 만들어주기

  return (
    <div className="flex w-screen justify-center items-center pt-28 pb-40">
      <svg width="0" height="0">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="white" />
          </filter>
        </defs>
      </svg>
      {/* 
        isShowSide가 true이고 hoveredNode가 존재할 때,
        주변 노드 이외는 조금 투명하게 만들어주기
      */}

      <style>
        {`
          .node {
            transition: opacity 0.3s;
          }
          
          .link {
            transition: filter 0.3s;
            filter: blur(1px);
          }
        `}
      </style>

      {modifiedGraphData && (
        <Graph
          id="graph-d3"
          data={modifiedGraphData}
          config={graphConfig}
          onMouseOverNode={handleMouseOverNode}
          onMouseOutNode={handleMouseOutNode}
          onClickNode={onClickNode}
        />
      )}
    </div>
  );
};

export default GraphComponent;
