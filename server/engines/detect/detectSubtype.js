const subtypeMatchers = [
  { subtype: "Hello World", regex: /hello\s+world/i },
  { subtype: "Addition of 2 numbers", regex: /a\s*\+\s*b|sum\s*=\s*\w+\s*\+\s*\w+/i },
  { subtype: "Simple calculator using switch case", regex: /switch\s*\(.+\)|case\s*['"+\-*\/]/i },
  { subtype: "Even or Odd", regex: /%\s*2|even|odd/i },
  { subtype: "Greatest of 3 numbers", regex: /greatest|largest|a\s*>\s*b\s*&&\s*a\s*>\s*c/i },
  { subtype: "Leap year", regex: /leap|%\s*400|%\s*4/i },
  { subtype: "Factorial", regex: /factorial|fact\s*=.*\*/i },
  { subtype: "Sum of n natural numbers", regex: /natural|sum\s*=.*\+|for\s*\(.*<=\s*n/i },
  { subtype: "Multiplication table", regex: /table|i\s*\*\s*n|n\s*\*\s*i/i },
  { subtype: "Count digits", regex: /count\s*digits|\/\s*10/i },
  { subtype: "Sum of digits", regex: /sum\s*digits|sum\s*\+=\s*\w+\s*%\s*10/i },
  { subtype: "Palindrome number", regex: /palindrome|reverse\s*==|rev\s*==/i },
  { subtype: "Prime number", regex: /prime|divisor|flag\s*=\s*0/i },
  { subtype: "Fibonacci series", regex: /fibonacci|fib|next\s*=\s*a\s*\+\s*b/i },
  { subtype: "Reverse number", regex: /reverse\s+number|rev\s*=\s*rev\s*\*\s*10/i },
  { subtype: "Pyramid", regex: /pyramid|rows\s*-\s*i|for\s*\(.*rows\s*-\s*i.*\)\s*System\.out\.print\(" "\)/i },
  { subtype: "Right triangle star pattern", regex: /triangle|for\s*\(.*<=\s*i.*\)\s*\{?\s*System\.out\.print\("\*\s*"?\)/i },
];

export function detectSubtype(code = "") {
  for (const matcher of subtypeMatchers) {
    if (matcher.regex.test(code)) {
      return matcher.subtype;
    }
  }

  if (/for\s*\(/i.test(code) || /while\s*\(/i.test(code)) {
    return "Loop Explorer";
  }

  if (/if\s*\(/i.test(code)) {
    return "Conditional Explorer";
  }

  return "Custom Beginner Program";
}
