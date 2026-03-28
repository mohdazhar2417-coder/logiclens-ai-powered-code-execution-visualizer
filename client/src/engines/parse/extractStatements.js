export function extractStatements(code = "") {
  return code
    .split("\n")
    .map((line, index) => ({
      id: `line-${index + 1}`,
      lineNumber: index + 1,
      text: line,
      trimmed: line.trim(),
    }))
    .filter((line) => line.trimmed);
}
