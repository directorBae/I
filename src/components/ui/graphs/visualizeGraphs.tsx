"use client";

import { Graph } from "react-d3-graph";
import { useGraphState } from "@/hooks/useGraphState";
import LoadingSpinner from "../assets/clipLoader";

const GraphComponent = () => {
  const {
    selectedNode,
    setSelectedNode,
    hoveredNode,
    setHoveredNode,
    graphData,
    clickNode,
  } = useGraphState();

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
    console.log("🔵 Hovered Node Detected:", nodeId);
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
      color: "white",
      size: 400,
      opacity: 0.9,
      renderLabel: false,
      svg: "./svgs/node.svg",
    },
    width: 400,
    d3: {
      gravity: -50 * (10 - (graphData?.nodes.length || 0) / 10),
    },
  };

  return (
    <div className="flex w-screen justify-center items-center pt-28 pb-40">
      <svg width="0" height="0">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="white" />
          </filter>
        </defs>
      </svg>

      {/* ✅ `graphData`가 존재할 때만 `Graph` 렌더링 */}
      {graphData && (
        <Graph
          id="graph-d3"
          data={graphData}
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
