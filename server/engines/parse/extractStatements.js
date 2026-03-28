import { preprocessCode } from "./preprocessCode.js";

function splitTopLevel(text, separator) {
  const parts = [];
  let buffer = "";
  let depth = 0;
  let inString = false;
  let stringChar = "";

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if ((char === '"' || char === "'") && text[index - 1] !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        inString = false;
        stringChar = "";
      }
    }

    if (!inString) {
      if (char === "(") depth += 1;
      if (char === ")") depth -= 1;
    }

    if (!inString && depth === 0 && text.slice(index, index + separator.length) === separator) {
      parts.push(buffer.trim());
      buffer = "";
      index += separator.length - 1;
      continue;
    }

    buffer += char;
  }

  if (buffer.trim()) {
    parts.push(buffer.trim());
  }

  return parts;
}

function createStatementFactory() {
  let counter = 1;
  return function createStatement(type, lineNumber, extra = {}) {
    const statement = {
      id: `statement-${counter}`,
      type,
      lineNumber,
      ...extra,
    };
    counter += 1;
    return statement;
  };
}

function parseDeclarators(declarationText) {
  const cleaned = declarationText.replace(/;$/, "");
  const typeMatch = cleaned.match(/^(int|double|float|long|char|String|boolean|Scanner)\s+(.+)$/);
  if (!typeMatch) {
    return null;
  }

  const [, valueType, rest] = typeMatch;
  const declarators = splitTopLevel(rest, ",").map((part) => {
    const [namePart, initPart] = part.split("=").map((item) => item.trim());
    return {
      name: namePart,
      initializer: initPart || null,
    };
  });

  return {
    valueType,
    declarators,
  };
}

function parseAssignment(text) {
  const cleaned = text.replace(/;$/, "");
  const operatorMatch = cleaned.match(/^(.+?)\s*(\+=|-=|\*=|\/=|%=|=)\s*(.+)$/);
  if (!operatorMatch) {
    return null;
  }

  return {
    target: operatorMatch[1].trim(),
    operator: operatorMatch[2],
    expression: operatorMatch[3].trim(),
  };
}

function parseSingleStatement(tokens, startIndex, createStatement) {
  const token = tokens[startIndex];
  if (!token) {
    return { statement: null, nextIndex: startIndex };
  }

  const text = token.text;
  const lineNumber = token.lineNumber;

  if ((/^(public\s+)?class\b/.test(text) || /main\s*\(/.test(text)) && tokens[startIndex + 1]?.text === "{") {
    const parsed = parseBlock(tokens, startIndex + 2, createStatement);
    return {
      statement: createStatement("wrapper", lineNumber, {
        body: parsed.body,
        raw: text,
      }),
      nextIndex: parsed.nextIndex,
    };
  }

  if (text === "{") {
    const parsed = parseBlock(tokens, startIndex + 1, createStatement);
    return {
      statement: createStatement("block", lineNumber, {
        body: parsed.body,
        raw: "{...}",
      }),
      nextIndex: parsed.nextIndex,
    };
  }

  if (/^if\s*\(/.test(text)) {
    const condition = text.match(/^if\s*\((.*)\)$/)?.[1] || "";
    const consequent = parseNestedStatement(tokens, startIndex + 1, createStatement);
    const branches = [
      {
        kind: "if",
        condition,
        body: consequent.statement.type === "block" ? consequent.statement.body : [consequent.statement],
        lineNumber,
      },
    ];

    let cursor = consequent.nextIndex;
    while (tokens[cursor] && /^else\b/.test(tokens[cursor].text)) {
      const elseToken = tokens[cursor];
      if (/^else if\s*\(/.test(elseToken.text)) {
        const elseIfCondition = elseToken.text.match(/^else if\s*\((.*)\)$/)?.[1] || "";
        const elseIfBranch = parseNestedStatement(tokens, cursor + 1, createStatement);
        branches.push({
          kind: "else-if",
          condition: elseIfCondition,
          body: elseIfBranch.statement.type === "block" ? elseIfBranch.statement.body : [elseIfBranch.statement],
          lineNumber: elseToken.lineNumber,
        });
        cursor = elseIfBranch.nextIndex;
      } else {
        const elseBranch = parseNestedStatement(tokens, cursor + 1, createStatement);
        branches.push({
          kind: "else",
          condition: null,
          body: elseBranch.statement.type === "block" ? elseBranch.statement.body : [elseBranch.statement],
          lineNumber: elseToken.lineNumber,
        });
        cursor = elseBranch.nextIndex;
        break;
      }
    }

    return {
      statement: createStatement("if", lineNumber, {
        branches,
        raw: text,
      }),
      nextIndex: cursor,
    };
  }

  if (/^while\s*\(/.test(text)) {
    const condition = text.match(/^while\s*\((.*)\)$/)?.[1] || "";
    const parsedBody = parseNestedStatement(tokens, startIndex + 1, createStatement);
    return {
      statement: createStatement("while", lineNumber, {
        condition,
        body: parsedBody.statement.type === "block" ? parsedBody.statement.body : [parsedBody.statement],
        raw: text,
      }),
      nextIndex: parsedBody.nextIndex,
    };
  }

  if (/^for\s*\(/.test(text)) {
    const inner = text.match(/^for\s*\((.*)\)$/)?.[1] || "";
    const [init = "", condition = "", update = ""] = splitTopLevel(inner, ";");
    const parsedBody = parseNestedStatement(tokens, startIndex + 1, createStatement);
    return {
      statement: createStatement("for", lineNumber, {
        init: init.trim(),
        condition: condition.trim(),
        update: update.trim(),
        body: parsedBody.statement.type === "block" ? parsedBody.statement.body : [parsedBody.statement],
        raw: text,
      }),
      nextIndex: parsedBody.nextIndex,
    };
  }

  if (/^switch\s*\(/.test(text)) {
    const expression = text.match(/^switch\s*\((.*)\)$/)?.[1] || "";
    const parsedSwitch = parseSwitch(tokens, startIndex + 1, createStatement);
    return {
      statement: createStatement("switch", lineNumber, {
        expression,
        cases: parsedSwitch.cases,
        raw: text,
      }),
      nextIndex: parsedSwitch.nextIndex,
    };
  }

  if (/^break;?$/.test(text)) {
    return {
      statement: createStatement("break", lineNumber, { raw: text }),
      nextIndex: startIndex + 1,
    };
  }

  if (/^(System\.out\.print|System\.out\.println)/.test(text)) {
    const printMatch = text.match(/System\.out\.(print|println)\((.*)\);?$/);
    return {
      statement: createStatement("output", lineNumber, {
        mode: printMatch?.[1] || "println",
        expression: printMatch?.[2] || "",
        raw: text,
      }),
      nextIndex: startIndex + 1,
    };
  }

  if (/^(int|double|float|long|char|String|boolean|Scanner)\b/.test(text)) {
    const declaration = parseDeclarators(text);
    if (declaration) {
      return {
        statement: createStatement("declaration", lineNumber, {
          valueType: declaration.valueType,
          declarators: declaration.declarators,
          raw: text,
        }),
        nextIndex: startIndex + 1,
      };
    }
  }

  if (/^\w+\s*(\+\+|--);?$/.test(text) || /^(\+\+|--)\w+;?$/.test(text)) {
    return {
      statement: createStatement("update", lineNumber, {
        expression: text.replace(/;$/, ""),
        raw: text,
      }),
      nextIndex: startIndex + 1,
    };
  }

  const assignment = parseAssignment(text);
  if (assignment) {
    return {
      statement: createStatement("assignment", lineNumber, {
        ...assignment,
        raw: text,
      }),
      nextIndex: startIndex + 1,
    };
  }

  return {
    statement: createStatement("unsupported", lineNumber, {
      raw: text,
      reason: "This statement pattern is not fully supported by the beginner parser.",
    }),
    nextIndex: startIndex + 1,
  };
}

function parseNestedStatement(tokens, index, createStatement) {
  if (tokens[index]?.text === "{") {
    const parsed = parseBlock(tokens, index + 1, createStatement);
    return {
      statement: createStatement("block", tokens[index].lineNumber, {
        body: parsed.body,
        raw: "{...}",
      }),
      nextIndex: parsed.nextIndex,
    };
  }

  return parseSingleStatement(tokens, index, createStatement);
}

function parseSwitch(tokens, index, createStatement) {
  let cursor = index;
  const cases = [];
  let currentCase = null;

  if (tokens[cursor]?.text === "{") {
    cursor += 1;
  }

  while (cursor < tokens.length) {
    const token = tokens[cursor];

    if (token.text === "}") {
      cursor += 1;
      break;
    }

    if (/^case\b/.test(token.text) || /^default\b/.test(token.text)) {
      const [labelText, remainderText] = token.text.split(/:(.+)/).map((part) => part?.trim());
      currentCase = {
        label: labelText?.replace(/^case\s+/, "") || "default",
        isDefault: /^default\b/.test(token.text),
        lineNumber: token.lineNumber,
        body: [],
      };
      cases.push(currentCase);

      if (remainderText) {
        const syntheticToken = {
          text: remainderText.endsWith(";") ? remainderText : `${remainderText};`,
          lineNumber: token.lineNumber,
        };
        const parsed = parseSingleStatement([syntheticToken], 0, createStatement);
        if (parsed.statement) {
          currentCase.body.push(parsed.statement);
        }
      }

      cursor += 1;
      continue;
    }

    if (!currentCase) {
      cursor += 1;
      continue;
    }

    const parsed = parseSingleStatement(tokens, cursor, createStatement);
    currentCase.body.push(parsed.statement);
    cursor = parsed.nextIndex;
  }

  return {
    cases,
    nextIndex: cursor,
  };
}

function parseBlock(tokens, startIndex, createStatement) {
  const body = [];
  let cursor = startIndex;

  while (cursor < tokens.length) {
    if (tokens[cursor].text === "}") {
      return {
        body,
        nextIndex: cursor + 1,
      };
    }

    const parsed = parseSingleStatement(tokens, cursor, createStatement);
    if (parsed.statement) {
      body.push(parsed.statement);
    }
    cursor = parsed.nextIndex;
  }

  return {
    body,
    nextIndex: cursor,
  };
}

function flattenStatements(statements, target = []) {
  statements.forEach((statement) => {
    if (statement.type !== "wrapper") {
      target.push({
        id: statement.id,
        lineNumber: statement.lineNumber,
        type: statement.type,
        trimmed: statement.raw || statement.type,
        statement,
      });
    }

    if (statement.type === "if") {
      statement.branches.forEach((branch) => flattenStatements(branch.body, target));
    } else if (statement.type === "while" || statement.type === "for" || statement.type === "block" || statement.type === "wrapper") {
      flattenStatements(statement.body, target);
    } else if (statement.type === "switch") {
      statement.cases.forEach((caseEntry) => flattenStatements(caseEntry.body, target));
    }
  });

  return target;
}

export function extractStatements(code = "") {
  const preprocessed = preprocessCode(code);
  const createStatement = createStatementFactory();
  const parsed = parseBlock(preprocessed.tokens, 0, createStatement);
  const statements = flattenStatements(parsed.body);

  return {
    ...preprocessed,
    tree: parsed.body,
    statements,
  };
}
