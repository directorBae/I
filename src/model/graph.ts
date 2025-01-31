import { ContentType } from "../types/types";

interface GraphData {
  nodes: { id: string; title?: string; category?: string }[];
  links: { source: string; target: string; content?: string }[];
}

class Graph {
  public graphData: GraphData | null = null;

  constructor(data: ContentType[] = []) {
    this.graphData = this.convertToGraphData(data);
  }

  public convertToGraphData(data: ContentType[]): GraphData {
    const nodes = data.map((d) => ({
      id: d.id.toString(),
      title: d.title,
      category: d.category,
      date: d.date,
      links: d.links,
      dateType: d.dataType,
      content: d.content,
      x: Math.random() * 400,
      y: Math.random() * 400,
    }));
    const links = data.flatMap((d) =>
      d.edge.map((e) => ({
        source: d.id.toString(),
        target: e.id.toString(),
        content: e.content,
      }))
    );

    return { nodes, links };
  }
}

export default Graph;
