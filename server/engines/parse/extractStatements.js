function detectStatementType(line) {
  if (/^\s*(int|double|float|long|char|String|boolean)\b/.test(line)) {
    return "declaration";
  }
  if (/^\s*if\s*\(/.test(line)) {
    return "decision";
  }
  if (/^\s*else\s+if\s*\(/.test(line)) {
    return "decision";
  }
  if (/^\s*else\b/.test(line)) {
    return "branch";
  }
  if (/^\s*(for|while)\s*\(/.test(line)) {
    return "loop";
  }
  if (/System\.out\.print/.test(line)) {
    return "output";
  }
  if (/Scanner|nextInt|nextDouble/.test(line)) {
    return "input";
  }
  if (/=/.test(line)) {
    return "assignment";
  }
  return "process";
}

export function extractStatements(code = "") {
  return code
    .split("\n")
    .map((text, index) => ({
      id: `line-${index + 1}`,
      lineNumber: index + 1,
      text,
      trimmed: text.trim(),
      type: detectStatementType(text.trim()),
    }))
    .filter((statement) => statement.trimmed);
}
