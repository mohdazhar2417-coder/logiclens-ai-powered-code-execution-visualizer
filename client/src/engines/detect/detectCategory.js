export function detectCategory(code = "") {
  const source = code.toLowerCase();
  if (source.includes("pyramid") || source.includes("triangle")) return "Pattern Programs";
  if (source.includes("prime") || source.includes("palindrome")) return "Number Logic Programs";
  if (source.includes("for") || source.includes("while")) return "Loops";
  if (source.includes("if") || source.includes("switch")) return "Conditionals";
  return "Basic Input / Output & Math";
}
