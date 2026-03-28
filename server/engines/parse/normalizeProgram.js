import { detectCategory } from "../detect/detectCategory.js";
import { detectSubtype } from "../detect/detectSubtype.js";
import { extractStatements } from "./extractStatements.js";

const unsupportedRules = [
  { pattern: /\bnew\s+\w+\s*\[/i, reason: "Arrays are outside the beginner-only simulation scope." },
  { pattern: /\bclass\s+\w+\s+extends\b/i, reason: "Advanced object-oriented inheritance is not supported." },
  { pattern: /\bArrayList\b|\bHashMap\b|\bList<|\bMap</i, reason: "Collections are not supported in this beginner tracer." },
  { pattern: /\bThread\b|\bRunnable\b|synchronized/i, reason: "Multithreading is unsupported." },
  { pattern: /\bFile\b|\bFileReader\b|\bBufferedReader\b/i, reason: "File handling is unsupported." },
];

function buildMatchedSignals(parsedProgram) {
  const signals = new Set();

  parsedProgram.statements.forEach(({ statement, type }) => {
    signals.add(type);
    if (statement.raw?.includes("%")) signals.add("modulo");
    if (statement.raw?.includes("Scanner") || statement.raw?.includes("nextInt")) signals.add("scanner-input");
  });

  if (parsedProgram.tree.some((statement) => statement.type === "for" || statement.type === "while")) {
    signals.add("looping");
  }
  if (parsedProgram.tree.some((statement) => statement.type === "if" || statement.type === "switch")) {
    signals.add("branching");
  }

  return [...signals];
}

export function normalizeProgram(code = "", customInputs = {}) {
  const parsedProgram = extractStatements(code);
  const reasons = [];

  unsupportedRules.forEach((rule) => {
    if (rule.pattern.test(code)) {
      reasons.push(rule.reason);
    }
  });

  const unsupportedStatements = parsedProgram.statements.filter(({ type }) => type === "unsupported");
  if (unsupportedStatements.length) {
    reasons.push("Some statements were only partially parsed and will use fallback tracing.");
  }

  const matchedSignals = buildMatchedSignals(parsedProgram);
  const detection = detectCategory(code);
  const subtype = detectSubtype(code);

  let supportLevel = "full";
  if (!parsedProgram.tree.length) {
    supportLevel = "fallback";
    reasons.push("No executable beginner-level statements could be parsed from the provided code.");
  } else if (reasons.length) {
    supportLevel = unsupportedStatements.length > parsedProgram.statements.length / 2 ? "fallback" : "partial";
  }

  const confidenceBase = detection.confidence + Math.min(12, matchedSignals.length * 2);
  const confidence =
    supportLevel === "full"
      ? Math.min(98, confidenceBase)
      : supportLevel === "partial"
        ? Math.min(86, confidenceBase - 8)
        : Math.max(32, confidenceBase - 24);

  return {
    category: detection.category,
    subtype,
    confidence,
    supportLevel,
    reasons,
    matchedSignals,
    customInputs,
    statements: parsedProgram.statements,
    tree: parsedProgram.tree,
    lines: parsedProgram.lines,
    tokens: parsedProgram.tokens,
    cleanedCode: parsedProgram.cleanedCode,
    summary: {
      lineCount: parsedProgram.lines.length,
      executableStatementCount: parsedProgram.statements.length,
      hasLoops: matchedSignals.includes("looping"),
      hasConditions: matchedSignals.includes("branching"),
      hasOutput: matchedSignals.includes("output"),
    },
  };
}
