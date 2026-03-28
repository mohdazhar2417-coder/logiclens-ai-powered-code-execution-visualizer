const categoryRules = [
  {
    category: "Basic Input / Output & Math",
    keywords: ["area", "interest", "fahrenheit", "celsius", "swap", "hello", "average"],
  },
  {
    category: "Conditionals",
    keywords: ["if", "else", "switch", "odd", "even", "greatest", "grade", "vowel"],
  },
  {
    category: "Loops",
    keywords: ["for", "while", "factorial", "natural", "table", "digits", "power"],
  },
  {
    category: "Number Logic Programs",
    keywords: ["prime", "palindrome", "armstrong", "perfect", "fibonacci", "neon", "duck"],
  },
  {
    category: "Pattern Programs",
    keywords: ["pattern", "triangle", "pyramid", "diamond", "floyd", "pascal", "stars"],
  },
];

export function detectCategory(code = "") {
  const source = code.toLowerCase();
  let bestMatch = {
    category: "Conditionals",
    confidence: 54,
  };

  for (const rule of categoryRules) {
    const matches = rule.keywords.filter((keyword) => source.includes(keyword)).length;
    if (matches) {
      const confidence = Math.min(96, 58 + matches * 9);
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          category: rule.category,
          confidence,
        };
      }
    }
  }

  return bestMatch;
}
