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
    ...normalizedProgram.statements.map((statement) => {
      const matchingStep = trace.find((step) => step.nodeId === statement.id);
      return {
        id: statement.id,
        type: "traceNode",
        data: {
          label: statement.trimmed,
          kind: statement.type,
          description: `Line ${statement.lineNumber}`,
          lineNumber: statement.lineNumber,
          variableChips: matchingStep ? Object.keys(matchingStep.changedVariables || {}) : [],
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
        lineNumber: normalizedProgram.statements.at(-1)?.lineNumber || 0,
        variableChips: [],
      },
    },
  ];

  return layoutGraph(baseNodes);
}
