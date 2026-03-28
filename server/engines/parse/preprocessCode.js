function stripLineComment(line) {
  let result = "";
  let inString = false;
  let stringChar = "";

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if ((char === '"' || char === "'") && line[index - 1] !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        inString = false;
        stringChar = "";
      }
    }

    if (!inString && char === "/" && next === "/") {
      break;
    }

    result += char;
  }

  return result;
}

function stripBlockComments(code) {
  let result = "";
  let inString = false;
  let stringChar = "";
  let inBlockComment = false;

  for (let index = 0; index < code.length; index += 1) {
    const char = code[index];
    const next = code[index + 1];

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        index += 1;
      } else if (char === "\n") {
        result += "\n";
      }
      continue;
    }

    if ((char === '"' || char === "'") && code[index - 1] !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        inString = false;
        stringChar = "";
      }
    }

    if (!inString && char === "/" && next === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    result += char;
  }

  return result;
}

function normalizeWhitespace(line) {
  return line.replace(/\t/g, " ").replace(/\s+/g, " ").trim();
}

export function preprocessCode(code = "") {
  const withoutBlockComments = stripBlockComments(code);
  const rawLines = withoutBlockComments.split("\n");
  const lines = rawLines.map((raw, index) => ({
    original: raw,
    text: stripLineComment(raw),
    normalized: normalizeWhitespace(stripLineComment(raw)),
    lineNumber: index + 1,
  }));

  const cleanedCode = lines.map((line) => line.text).join("\n");
  const tokens = [];
  let buffer = "";
  let tokenLine = 1;
  let currentLine = 1;
  let inString = false;
  let stringChar = "";
  let parenDepth = 0;

  function flushBuffer(force = false) {
    const normalized = normalizeWhitespace(buffer);
    if (!normalized && !force) {
      buffer = "";
      return;
    }
    if (normalized) {
      tokens.push({
        text: normalized,
        raw: buffer.trim(),
        lineNumber: tokenLine,
      });
    }
    buffer = "";
  }

  for (let index = 0; index < cleanedCode.length; index += 1) {
    const char = cleanedCode[index];

    if (!buffer.trim() && char.trim()) {
      tokenLine = currentLine;
    }

    if ((char === '"' || char === "'") && cleanedCode[index - 1] !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        inString = false;
        stringChar = "";
      }
    }

    if (!inString && char === "(") {
      parenDepth += 1;
    } else if (!inString && char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
    }

    if (!inString && parenDepth === 0 && (char === "{" || char === "}")) {
      flushBuffer();
      tokens.push({
        text: char,
        raw: char,
        lineNumber: currentLine,
      });
      continue;
    }

    buffer += char;

    if (!inString && parenDepth === 0 && char === ";") {
      flushBuffer(true);
      continue;
    }

    if (char === "\n") {
      currentLine += 1;
    }
  }

  flushBuffer();

  return {
    cleanedCode,
    lines,
    tokens: tokens.filter((token) => token.text),
  };
}
