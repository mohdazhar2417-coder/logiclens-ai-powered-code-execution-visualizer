export function detectSubtype(code = "") {
  if (/prime/i.test(code)) return "Prime number";
  if (/palindrome/i.test(code)) return "Palindrome number";
  if (/factorial/i.test(code)) return "Factorial";
  if (/rows\s*-\s*i/i.test(code)) return "Pyramid";
  if (/for\s*\(.*<=\s*i/i.test(code) && /System\.out\.print\("\*\s*"?\)/i.test(code)) return "Right triangle star pattern";
  if (/odd|even|%\s*2/i.test(code)) return "Even or Odd";
  return "Custom Beginner Program";
}
