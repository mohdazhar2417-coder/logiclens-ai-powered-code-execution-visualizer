import { normalizeProgram } from "../engines/parse/normalizeProgram.js";
import { simulationEngine } from "../engines/simulate/simulationEngine.js";
import { buildFlowNodes } from "../engines/flow/buildFlowNodes.js";
import { buildFlowEdges } from "../engines/flow/buildFlowEdges.js";
import { explainFinalOutput } from "../engines/explain/explainFinalOutput.js";

function validateCode(code) {
  if (!code || typeof code !== "string") {
    return "Code is required.";
  }
  return null;
}

export async function detect(req, res) {
  const message = validateCode(req.body.code);
  if (message) {
    return res.status(400).json({ message });
  }

  const normalizedProgram = normalizeProgram(req.body.code, req.body.customInputs || {});
  return res.json({
    detection: {
      category: normalizedProgram.category,
      subtype: normalizedProgram.subtype,
      confidence: normalizedProgram.confidence,
      supportLevel: normalizedProgram.supportLevel,
      reasons: normalizedProgram.reasons,
      matchedSignals: normalizedProgram.matchedSignals,
    },
    normalizedProgram,
  });
}

export async function explain(req, res) {
  const message = validateCode(req.body.code);
  if (message) {
    return res.status(400).json({ message });
  }

  const normalizedProgram = normalizeProgram(req.body.code, req.body.customInputs || {});
  const trace = simulationEngine(normalizedProgram);
  const nodes = buildFlowNodes(normalizedProgram, trace.steps);
  const edges = buildFlowEdges(normalizedProgram, trace.steps);

  return res.json({
    detection: {
      category: normalizedProgram.category,
      subtype: normalizedProgram.subtype,
      confidence: normalizedProgram.confidence,
      supportLevel:
        normalizedProgram.supportLevel === "full" && trace.partialSupportHits > 0
          ? "partial"
          : normalizedProgram.supportLevel,
      reasons: normalizedProgram.reasons,
      matchedSignals: normalizedProgram.matchedSignals,
    },
    normalizedProgram,
    steps: trace.steps,
    nodes,
    edges,
    variableHistory: trace.variableHistory,
    branchDecisions: trace.branchDecisions,
    loopIterationCounts: trace.loopIterationCounts,
    finalOutput: trace.outputText,
    finalExplanation: explainFinalOutput({
      subtype: normalizedProgram.subtype,
      finalOutput: trace.outputText,
      variables: trace.variables,
      branchDecisions: trace.branchDecisions,
      loopIterationCounts: trace.loopIterationCounts,
    }),
    simulationState: {
      currentStepIndex: trace.currentStepIndex,
      currentNodeId: trace.currentNodeId,
      activeCodeLine: trace.activeCodeLine,
      variables: trace.variables,
      previousVariables: trace.previousVariables,
      changedVariables: trace.changedVariables,
      output: trace.output,
      outputText: trace.outputText,
      executionTrace: trace.executionTrace,
      visitedNodes: trace.visitedNodes,
      supportLevel:
        normalizedProgram.supportLevel === "full" && trace.partialSupportHits > 0
          ? "partial"
          : normalizedProgram.supportLevel,
      confidence: normalizedProgram.confidence,
    },
  });
}

export async function finalSummary(req, res) {
  const message = validateCode(req.body.code);
  if (message) {
    return res.status(400).json({ message });
  }

  const normalizedProgram = normalizeProgram(req.body.code, req.body.customInputs || {});
  const trace = simulationEngine(normalizedProgram);

  return res.json(
    explainFinalOutput({
      subtype: normalizedProgram.subtype,
      finalOutput: trace.outputText,
      variables: trace.variables,
      branchDecisions: trace.branchDecisions,
      loopIterationCounts: trace.loopIterationCounts,
    }),
  );
}
