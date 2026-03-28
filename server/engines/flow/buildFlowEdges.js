export function buildFlowEdges(normalizedProgram, trace = []) {
  const statementIds = normalizedProgram.statements.map((statement) => statement.id);
  const edges = [];

  if (!statementIds.length) {
    return [];
  }

  edges.push({
    id: "start-edge",
    source: "start",
    target: statementIds[0],
    type: "smoothstep",
    animated: true,
    label: "begin",
  });

  statementIds.forEach((id, index) => {
    const nextId = statementIds[index + 1] || "end";
    const matchingStep = trace.find((step) => step.nodeId === id);
    edges.push({
      id: `${id}-${nextId}`,
      source: id,
      target: nextId,
      type: "smoothstep",
      animated: matchingStep?.kind === "loop",
      label: matchingStep?.branchLabel || "",
    });
  });

  return edges;
}
