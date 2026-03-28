export function buildFlowEdges(normalizedProgram, trace = []) {
  const stepIds = trace.map((step) => step.nodeId);
  const edges = [];

  if (!stepIds.length) {
    return [];
  }

  edges.push({
    id: "start-edge",
    source: "start",
    target: stepIds[0],
    type: "smoothstep",
    animated: true,
    label: "begin",
  });

  stepIds.forEach((id, index) => {
    const nextId = stepIds[index + 1] || "end";
    const currentStep = trace[index];
    const loopBack = trace[index + 1] && trace[index + 1].lineNumber < currentStep.lineNumber;
    edges.push({
      id: `${id}-${nextId}`,
      source: id,
      target: nextId,
      type: "smoothstep",
      animated: loopBack || currentStep?.kind?.includes("loop"),
      label: currentStep?.branchLabel || "",
      style: loopBack ? { stroke: "#fbbf24", strokeDasharray: "6 4" } : undefined,
    });
  });

  return edges;
}
