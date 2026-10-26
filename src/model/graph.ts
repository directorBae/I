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
    // Seed stars evenly over a disc inside the 400×500 frame (sunflower
    // spiral) so the constellation is stable between visits and never clipped.
    const seed = (i: number) => {
      const r = 190 * Math.sqrt((i + 0.5) / Math.max(1, data.length));
      const a = i * 2.39996323;
      return { x: 200 + r * Math.cos(a), y: 250 + r * Math.sin(a) };
    };
    const nodes = data.map((d, i) => ({
      id: d.id.toString(),
      title: d.title,
      category: d.category,
      date: d.date,
      links: d.links,
      dateType: d.dataType,
      content: d.content,
      ...seed(i),
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
