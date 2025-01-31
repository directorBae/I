"use client";

import { useState } from "react";
import { useEffect } from "react";
import Graph from "@/model/graph";
import { ContentType } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";

export function useGraphState() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isShowSide, setIsShowSide] = useState<boolean>(false);
  const [hoverData, setHoverData] = useState<{
    id: string;
    title: string;
    date: string;
  } | null>(null);
  const [graphData, setGraphData] = useState<any | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [contentsData, setContentsData] = useState<{
    [key: string]: ContentType;
  } | null>(null);
  // {id(key): {...data}(value)} 식으로 반환
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

  return {
    selectedNode,
    setSelectedNode,
    hoveredNode,
    setHoveredNode,
    hoverData,
    setHoverData,
    isShowSide,
    setIsShowSide,
    clickNode,
    graphData,
    contentsData,
  };
}
