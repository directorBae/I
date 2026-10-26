'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import Graph from '@/model/graph';
import type { ContentType } from '@/types/types';

type NearbyNode = { id: string; title: string; date: string };
interface GraphStateContextType {
  selectedNode: string | null;
  setSelectedNode: (node: string | null) => void;
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
  isShowSide: boolean;
  setIsShowSide: (show: boolean) => void;
  hoverData: NearbyNode | null;
  setHoverData: (data: NearbyNode | null) => void;
  graphData: any | null;
  contentsData: Record<string, ContentType> | null;
  clickNode: (nodeId: string) => void;
  closeProject: () => void;
  parseNearbyNodes: (nodeId: string) => string[];
  parseNearbyNodesWithTitle: (nodeId: string) => NearbyNode[];
}
export const GraphStateContext = createContext<GraphStateContextType | null>(
  null,
);
export const GraphStateProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');
  const [selectedNode, setSelectedNode] = useState<string | null>(queryId);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isShowSide, setIsShowSide] = useState(false);
  const [hoverData, setHoverData] = useState<NearbyNode | null>(null);
  const [graphData, setGraphData] = useState<any | null>(null);
  const [contentsData, setContentsData] = useState<Record<
    string,
    ContentType
  > | null>(null);

  useEffect(() => {
    setSelectedNode(queryId);
  }, [queryId]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Work data unavailable');
        return res.json();
      })
      .then((data: ContentType[]) => {
        setContentsData(
          Object.fromEntries(data.map((item) => [String(item.id), item])),
        );
        setGraphData(new Graph(data).graphData);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setContentsData({});
          setGraphData({ nodes: [], links: [] });
        }
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (contentsData && queryId && !contentsData[queryId]) {
      setSelectedNode(null);
      window.history.replaceState(null, '', '/work');
    }
  }, [contentsData, queryId]);

  const clickNode = useCallback(
    (nodeId: string) => {
      if (!contentsData?.[nodeId]) return;
      setSelectedNode(nodeId);
      setIsShowSide(false);
      setHoveredNode(null);
      // Native history keeps the planet, graph and open article mounted.
      // Next's patched history also updates useSearchParams and Back/Forward.
      const href = `/work?id=${encodeURIComponent(nodeId)}`;
      if (window.location.pathname + window.location.search !== href)
        window.history.pushState(null, '', href);
    },
    [contentsData],
  );
  const closeProject = useCallback(() => {
    setSelectedNode(null);
    setIsShowSide(true);
    window.history.pushState(null, '', '/work');
  }, []);
  const parseNearbyNodes = useCallback(
    (nodeId: string) => {
      if (!graphData) return [];
      const idOf = (value: any) =>
        typeof value === 'object' ? String(value.id) : String(value);
      const nearby: string[] = graphData.links
        .filter(
          (edge: any) =>
            idOf(edge.source) === nodeId || idOf(edge.target) === nodeId,
        )
        .map((edge: any) =>
          idOf(edge.source) === nodeId ? idOf(edge.target) : idOf(edge.source),
        );
      return Array.from(new Set([...nearby, nodeId]));
    },
    [graphData],
  );
  const parseNearbyNodesWithTitle = useCallback(
    (nodeId: string) =>
      parseNearbyNodes(nodeId)
        .filter((id) => id !== nodeId && !!contentsData?.[id])
        .map((id) => ({
          id,
          title: contentsData![id].title,
          date: contentsData![id].date,
        })),
    [parseNearbyNodes, contentsData],
  );

  return (
    <GraphStateContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
        hoveredNode,
        setHoveredNode,
        isShowSide,
        setIsShowSide,
        hoverData,
        setHoverData,
        graphData,
        contentsData,
        clickNode,
        closeProject,
        parseNearbyNodes,
        parseNearbyNodesWithTitle,
      }}
    >
      {children}
    </GraphStateContext.Provider>
  );
};
export const useGraphState = () => {
  const state = useContext(GraphStateContext);
  if (!state) throw new Error('Cannot find GraphStateProvider');
  return state;
};
