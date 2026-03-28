export function layoutGraph(nodes = []) {
  return nodes.map((node, index) => {
    const isDecision = node.data.kind === "decision";
    const column = isDecision ? 1 : 0;
    return {
      ...node,
      position: {
        x: column * 280 + (index % 2 === 0 ? 0 : 32),
        y: index * 120,
      },
    };
  });
}
