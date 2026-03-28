import { detectCategory } from "../detect/detectCategory.js";
import { detectSubtype } from "../detect/detectSubtype.js";
import { extractStatements } from "./extractStatements.js";

const unsupportedRules = [
  { pattern: /\bnew\s+\w+\s*\[/i, reason: "Arrays are outside the beginner-only simulation scope." },
  { pattern: /\bclass\s+\w+\s+extends\b/i, reason: "Advanced object-oriented inheritance is not supported." },
  { pattern: /\bpublic\s+\w+\s+\w+\s*\(/i, reason: "Multiple custom methods are outside the supported subset." },
  { pattern: /\bArrayList\b|\bHashMap\b|\bList<|\bMap</i, reason: "Collections are not supported in this beginner tracer." },
  { pattern: /\bThread\b|\bRunnable\b|synchronized/i, reason: "Multithreading is unsupported." },
  { pattern: /\bFile\b|\bFileReader\b|\bBufferedReader\b/i, reason: "File handling is unsupported." },
];

export function normalizeProgram(code = "", customInputs = {}) {
  const detection = detectCategory(code);
  const subtype = detectSubtype(code);
  const statements = extractStatements(code);
  const reasons = [];

  for (const rule of unsupportedRules) {
    if (rule.pattern.test(code)) {
      reasons.push(rule.reason);
    }
  }

  const supportLevel = reasons.length ? (reasons.length > 1 ? "unsupported" : "partial") : "supported";
  const confidence = supportLevel === "unsupported" ? Math.max(28, detection.confidence - 20) : detection.confidence;

  return {
    category: detection.category,
    subtype,
    confidence,
    supportLevel,
    reasons,
    customInputs,
    statements,
    lines: code.split("\n"),
    summary: {
      lineCount: statements.length,
      hasLoops: statements.some((statement) => statement.type === "loop"),
      hasConditions: statements.some((statement) => statement.type === "decision"),
      hasOutput: statements.some((statement) => statement.type === "output"),
    },
  };
}
