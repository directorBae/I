'use client';

import { Graph } from 'react-d3-graph';
import { useGraphState } from '@/context/GraphContext';
import LoadingSpinner from '../assets/clipLoader';
import { useEffect, useRef, useState } from 'react';
import { focusConstellation } from '@/model/graphFocus';

const GraphComponent = ({ compact = false }: { compact?: boolean }) => {
  const { hoveredNode, selectedNode, setHoveredNode, graphData, clickNode } =
    useGraphState();
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      setScale(
        compact
          ? Math.min(width * 0.87, height * 0.72) / 640
          : Math.min(width / 400, height / 500) * 0.82,
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => observer.disconnect();
  }, [compact]);
  const data = graphData
    ? focusConstellation(graphData, selectedNode, hoveredNode)
    : null;
  return (
    <div ref={host} className="relative w-full h-full">
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="white" />
          </filter>
        </defs>
      </svg>
      <style>{`#graph-d3-graph-wrapper svg{overflow:visible}.node image {transition:opacity .25s}.link {transition:opacity .25s,stroke .25s,stroke-width .25s;filter:blur(1px)}`}</style>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 400,
          height: 500,
          transform: `translate(-50%,-50%) scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {data ? (
          <Graph
            id="graph-d3"
            data={data}
            config={{
              nodeHighlightBehavior: false,
              linkHighlightBehavior: false,
              node: {
                color: 'white',
                size: 400,
                opacity: 0.9,
                renderLabel: false,
                svg: '/svgs/node.svg',
              },
              link: { strokeWidth: 1.5 },
              width: 400,
              height: 500,
              // Weaker repulsion and shorter links as stars are added, so the
              // whole constellation stays inside the 400×500 frame.
              d3: {
                gravity: -Math.min(465, 2400 / graphData.nodes.length),
                linkLength: Math.min(100, 2400 / graphData.nodes.length),
              },
            }}
            onMouseOverNode={(id) => {
              if (id && id !== hoveredNode) setHoveredNode(id);
            }}
            onMouseOutNode={() => setHoveredNode(null)}
            onClickNode={(id) => {
              if (id) clickNode(id);
            }}
          />
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};
export default GraphComponent;
