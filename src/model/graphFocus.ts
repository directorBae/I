type Endpoint = string | number | { id: string | number };
type Node = { id: string | number; [key: string]: unknown };
type Edge = { source: Endpoint; target: Endpoint; [key: string]: unknown };
const idOf = (value: Endpoint) =>
  typeof value === 'object' ? String(value.id) : String(value);

export function focusConstellation(
  graph: { nodes: Node[]; links: Edge[] },
  selectedNode: string | null,
  hoveredNode: string | null,
) {
  // An open detail stays active when the cursor moves elsewhere on the planet.
  const active = selectedNode || hoveredNode;
  const nearby = new Set<string>(active ? [active] : []);
  for (const edge of graph.links) {
    const source = idOf(edge.source),
      target = idOf(edge.target);
    if (source === active) nearby.add(target);
    if (target === active) nearby.add(source);
  }
  return {
    ...graph,
    nodes: graph.nodes.map((node) => {
      const id = String(node.id);
      let opacity = 0.9;
      if (active) opacity = id === active ? 1 : nearby.has(id) ? 0.85 : 0.12;
      return { ...node, id, opacity };
    }),
    links: graph.links.map((edge) => {
      const source = idOf(edge.source),
        target = idOf(edge.target);
      const lit = !!active && (source === active || target === active);
      return {
        ...edge,
        source,
        target,
        opacity: active ? (lit ? 0.95 : 0.04) : 0.75,
        strokeWidth: active ? (lit ? 2 : 0.5) : 1.5,
        color: active ? (lit ? '#f4fbff' : '#526274') : '#d3d3d3',
      };
    }),
  };
}
