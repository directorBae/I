// GraphStateContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Graph from "@/model/graph";
import { ContentType } from "@/types/types";

import { ReactNode } from "react";

interface GraphStateContextType {
  selectedNode: string | null;
  setSelectedNode: (node: string | null) => void;
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
  isShowSide: boolean;
  setIsShowSide: (show: boolean) => void;
  hoverData: { id: string; title: string; date: string } | null;
  setHoverData: (
    data: { id: string; title: string; date: string } | null
  ) => void;
  graphData: any | null;
  contentsData: { [key: string]: ContentType } | null;
  clickNode: (nodeId: string) => void;
  parseNearbyNodes: (nodeId: string) => string[];
}

export const GraphStateContext = createContext<GraphStateContextType | null>(
  null
);

export const GraphStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isShowSide, setIsShowSide] = useState<boolean>(false);
  const [hoverData, setHoverData] = useState<{
    id: string;
    title: string;
    date: string;
  } | null>(null);
  const [graphData, setGraphData] = useState<any | null>(null);
  const [contentsData, setContentsData] = useState<{
    [key: string]: ContentType;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const convertContentsData = (data: ContentType[]) => {
    return data.reduce((acc: { [key: string]: ContentType }, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
  };

  useEffect(() => {
    fetch("/api/json")
      .then((res) => res.json())
      .then((data) => {
        setContentsData(convertContentsData(data));
        const graphData = new Graph(data).graphData;
        setGraphData(graphData);
      });
  }, []);

  const clickNode = (nodeId: string) => {
    setSelectedNode(nodeId);
    setIsShowSide(false);
    router.push(`/work?id=${nodeId}`);
  };

  const parseNearbyNodes = (nodeId: string) => {
    if (!graphData) return [];
    const nearbyNodes: string[] = graphData.links
      .filter((link: { source: string; target: string }) => {
        return link.source === nodeId || link.target === nodeId;
      })
      .map((link: { source: string; target: string }) => {
        return link.source === nodeId ? link.target : link.source;
      });
    nearbyNodes.push(nodeId);

    return Array.from(new Set(nearbyNodes) || []);
  };

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
        parseNearbyNodes,
      }}
    >
      {children}
    </GraphStateContext.Provider>
  );
};

export const useGraphState = () => {
  const state = useContext(GraphStateContext);
  if (!state) {
    throw new Error("Cannot find GraphStateProvider");
  }
  return state;
};
