import { layoutGraph } from "./layoutGraph.js";

export function buildFlowNodes(normalizedProgram, trace = []) {
  const baseNodes = [
    {
      id: "start",
      type: "traceNode",
      data: {
        label: "Start",
        kind: "start",
        description: "Program execution begins here.",
        lineNumber: 0,
        variableChips: [],
      },
    },
    ...trace.map((step) => {
      return {
        id: step.nodeId,
        type: "traceNode",
        data: {
          label: step.title,
          kind: step.kind,
          description: `Line ${step.lineNumber}`,
          lineNumber: step.lineNumber,
          variableChips: Object.keys(step.changedVariables || {}),
          previousVariables: step.previousVariables,
          afterVariables: step.variables,
          reason: step.branchReason,
          nextReason: step.next,
        },
      };
    }),
    {
      id: "end",
      type: "traceNode",
      data: {
        label: "End",
        kind: "end",
        description: "Execution is complete.",
        lineNumber: trace.at(-1)?.lineNumber || normalizedProgram.lines.at(-1)?.lineNumber || 0,
        variableChips: [],
      },
    },
  ];

  return layoutGraph(baseNodes);
}
