export function explainFinalOutput({ subtype, finalOutput, variables, branchDecisions, loopIterationCounts }) {
  const branchSummary = branchDecisions?.length
    ? `The trace made ${branchDecisions.length} key branch decisions before finishing.`
    : "The program completed without major branch changes.";

  const loopSummary = Object.keys(loopIterationCounts || {}).length
    ? `Loop counters tracked ${Object.values(loopIterationCounts).join(", ")} total iterations across the active loops.`
    : "No loop iterations were needed for this run.";

  return {
    title: `Why ${subtype} produced this result`,
    explanation:
      `TraceWise AI simulated each supported statement, updated variables after every step, and assembled output in execution order. ` +
      `${branchSummary} ${loopSummary}`,
    finalOutput,
    finalVariables: variables,
  };
}
