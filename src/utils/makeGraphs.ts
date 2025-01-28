// TODO: 그래프 만드는 함수
// 수정해야함

import fs from "fs";
import path from "path";

type Graph = {
  nodes: { id: string; label: string }[];
  edges: { from: string; to: string }[];
};

const graphs: Record<string, Graph> = {};

export function initializeGraphs(jsonDir: string) {
  const files = fs.readdirSync(jsonDir);
  files.forEach((file) => {
    const filePath = path.join(jsonDir, file);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const graph = JSON.parse(rawData) as Graph;
    const graphId = path.basename(file, ".json");
    graphs[graphId] = graph;
  });
}

export function getGraphById(id: string): Graph | null {
  return graphs[id] || null;
}
