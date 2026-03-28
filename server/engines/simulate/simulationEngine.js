import { explainStep } from "../explain/explainStep.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function diffVariables(before, after) {
  const changed = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

  keys.forEach((key) => {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changed[key] = after[key];
    }
  });

  return changed;
}

function normalizeStringLiteral(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function toRuntimeLiteral(value) {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (value === undefined || value === null) {
    return "0";
  }
  return String(value);
}

function resolveInputValue(name, type, customInputs) {
  const raw = customInputs?.[name];
  if (raw === undefined) {
    if (type === "String") return "";
    if (type === "char") return "a";
    if (type === "boolean") return false;
    return 0;
  }

  if (type === "String") return String(raw);
  if (type === "char") return String(raw)[0] || "a";
  if (type === "boolean") return raw === true || String(raw).toLowerCase() === "true";

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function evaluateExpression(expression, runtime) {
  const expr = expression?.trim() || "";
  if (!expr) {
    return undefined;
  }

  if (/^new\s+Scanner\s*\(/.test(expr)) {
    return { kind: "scanner" };
  }

  if (/^\w+\.next(Int|Double|Float|Long)\(\)$/.test(expr)) {
    const inputName = runtime.currentInputTarget || "value";
    return resolveInputValue(inputName, runtime.currentInputType || "int", runtime.customInputs);
  }

  if (/^\w+\.nextLine\(\)$/.test(expr)) {
    const inputName = runtime.currentInputTarget || "text";
    return resolveInputValue(inputName, "String", runtime.customInputs);
  }

  if (/^".*"$|^'.*'$/.test(expr)) {
    return normalizeStringLiteral(expr);
  }

  const reservedWords = new Set([
    "true",
    "false",
    "Math",
    "floor",
    "ceil",
    "abs",
    "pow",
    "min",
    "max",
  ]);

  const translated = expr
    .replace(/\btrue\b/g, "true")
    .replace(/\bfalse\b/g, "false")
    .replace(/&&/g, "&&")
    .replace(/\|\|/g, "||")
    .replace(/!=/g, "!==")
    .replace(/==/g, "===")
    .replace(/\b([A-Za-z_]\w*)\b/g, (token) => {
      if (reservedWords.has(token)) {
        return token;
      }
      if (Object.prototype.hasOwnProperty.call(runtime.variables, token)) {
        return toRuntimeLiteral(runtime.variables[token]);
      }
      return token;
    });

  try {
    return Function(`return (${translated});`)();
  } catch {
    return expr;
  }
}

function evaluateOutput(expression, runtime) {
  if (!/["']/.test(expression)) {
    const direct = evaluateExpression(expression, runtime);
    return direct === undefined || direct === null ? "" : String(direct);
  }

  const parts = [];
  let buffer = "";
  let depth = 0;
  let inString = false;
  let stringChar = "";

  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index];
    if ((char === '"' || char === "'") && expression[index - 1] !== "\\") {
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

    if (!inString && depth === 0 && char === "+") {
      parts.push(buffer.trim());
      buffer = "";
      continue;
    }

    buffer += char;
  }

  if (buffer.trim()) {
    parts.push(buffer.trim());
  }

  return parts
    .map((part) => evaluateExpression(part, runtime))
    .map((value) => (value === undefined || value === null ? "" : String(value)))
    .join("");
}

function appendOutput(runtime, text, newline) {
  runtime.outputText += text;
  if (newline) {
    runtime.outputText += "\n";
  }
}

function createStepRecorder(runtime) {
  return function record(statement, config) {
    const previousVariables = clone(runtime.variables);

    if (typeof config.apply === "function") {
      config.apply();
    }

    const afterVariables = clone(runtime.variables);
    const changedVariables = diffVariables(previousVariables, afterVariables);
    const step = {
      id: `step-${runtime.steps.length + 1}`,
      nodeId: `step-${runtime.steps.length + 1}`,
      statementId: statement.id,
      lineNumber: config.lineNumber || statement.lineNumber,
      stepIndex: runtime.steps.length,
      title: config.title || statement.raw || statement.type,
      kind: config.kind || statement.type,
      branchLabel: config.branchLabel || "",
      branchReason: config.branchReason || "",
      next: config.next || "Continue to the next executable statement.",
      commonMistake: config.commonMistake || "",
      previousVariables,
      variables: afterVariables,
      changedVariables,
      outputSnapshot: runtime.outputText.replace(/\n$/, ""),
      metadata: config.metadata || {},
    };

    step.teacherMode = explainStep(step, step.kind);
    step.explanation = step.teacherMode.whatHappened;
    runtime.steps.push(step);
    runtime.variableHistory.push({
      stepIndex: step.stepIndex,
      variables: afterVariables,
    });
    return step;
  };
}

function executeDeclaration(statement, runtime, record) {
  const declared = [];

  record(statement, {
    title: statement.raw,
    kind: "declaration",
    apply() {
      statement.declarators.forEach((declarator) => {
        runtime.currentInputTarget = declarator.name;
        runtime.currentInputType = statement.valueType;
        let value;

        runtime.variableTypes[declarator.name] = statement.valueType;

        if (statement.valueType === "Scanner") {
          value = { kind: "scanner" };
        } else if (!declarator.initializer) {
          value = resolveInputValue(declarator.name, statement.valueType, runtime.customInputs);
        } else {
          value = evaluateExpression(declarator.initializer, runtime);
        }

        runtime.variables[declarator.name] = value;
        declared.push(declarator.name);
      });
    },
    next: "The declared variables are ready for later statements.",
    branchReason: declared.length ? `Declared ${declared.join(", ")} in the current scope.` : "",
  });
}

function executeAssignment(statement, runtime, record) {
  record(statement, {
    title: statement.raw,
    kind: "assignment",
    apply() {
      runtime.currentInputTarget = statement.target;
      runtime.currentInputType = runtime.variableTypes[statement.target] || "int";
      const current = runtime.variables[statement.target];
      const value = evaluateExpression(statement.expression, runtime);

      switch (statement.operator) {
        case "=":
          runtime.variables[statement.target] = value;
          break;
        case "+=":
          runtime.variables[statement.target] = current + value;
          break;
        case "-=":
          runtime.variables[statement.target] = current - value;
          break;
        case "*=":
          runtime.variables[statement.target] = current * value;
          break;
        case "/=":
          runtime.variables[statement.target] = current / value;
          break;
        case "%=":
          runtime.variables[statement.target] = current % value;
          break;
        default:
          runtime.variables[statement.target] = value;
      }
    },
    next: "Use the updated variable value in the next step.",
  });
}

function executeUpdate(statement, runtime, record) {
  const expression = statement.expression;
  record(statement, {
    title: expression,
    kind: "update",
    apply() {
      const postfix = expression.match(/^(\w+)(\+\+|--)$/);
      const prefix = expression.match(/^(\+\+|--)(\w+)$/);
      const variableName = postfix?.[1] || prefix?.[2];
      const operator = postfix?.[2] || prefix?.[1];
      const current = Number(runtime.variables[variableName] || 0);
      runtime.variables[variableName] = operator === "++" ? current + 1 : current - 1;
    },
    next: "The loop or next statement will use the incremented value.",
  });
}

function executeOutput(statement, runtime, record) {
  record(statement, {
    title: statement.raw,
    kind: "output",
    apply() {
      const rendered = evaluateOutput(statement.expression, runtime);
      appendOutput(runtime, rendered, statement.mode === "println");
    },
    next: "The output panel updates immediately after this print step.",
  });
}

function executeIf(statement, runtime, record, executeStatements) {
  for (const branch of statement.branches) {
    const branchLabel = branch.kind === "else" ? "else" : branch.kind;
    const passed = branch.kind === "else" ? true : Boolean(evaluateExpression(branch.condition, runtime));

    record(statement, {
      title: branch.kind === "else" ? "Else branch selected" : `${branch.kind} (${branch.condition})`,
      lineNumber: branch.lineNumber,
      kind: "decision",
      branchLabel: passed ? "yes" : "no",
      branchReason:
        branch.kind === "else"
          ? "All previous conditions were false, so the else block runs."
          : `The condition ${branch.condition} evaluated to ${passed}.`,
      metadata: {
        branch: branchLabel,
      },
      next: passed ? "Execute the chosen branch body." : "Check the next branch in the chain.",
    });

    runtime.branchDecisions.push({
      lineNumber: branch.lineNumber,
      result: passed,
      reason: branch.kind === "else" ? "Fallback branch selected." : `${branch.condition} -> ${passed}`,
    });

    if (passed) {
      executeStatements(branch.body, runtime);
      return;
    }
  }
}

function executeWhile(statement, runtime, record, executeStatements) {
  let iteration = 0;
  runtime.loopIterationCounts[statement.id] = 0;

  while (true) {
    const passed = Boolean(evaluateExpression(statement.condition, runtime));
    record(statement, {
      title: `while (${statement.condition})`,
      kind: "loop-condition",
      branchLabel: passed ? "repeat" : "exit",
      branchReason: `The while condition evaluated to ${passed}.`,
      next: passed ? "Enter the loop body." : "Exit the loop and continue.",
      metadata: { iteration },
    });

    if (!passed) {
      break;
    }

    iteration += 1;
    runtime.loopIterationCounts[statement.id] += 1;
    const control = executeStatements(statement.body, runtime);
    if (control?.break) {
      break;
    }
  }
}

function executeFor(statement, runtime, record, executeStatements, createSyntheticStatement) {
  runtime.loopIterationCounts[statement.id] = 0;

  if (statement.init) {
    const initStatement = createSyntheticStatement(statement.init, statement.lineNumber);
    executeSingleStatement(initStatement, runtime, record, executeStatements, createSyntheticStatement);
  }

  let iteration = 0;
  while (true) {
    const condition = statement.condition || "true";
    const passed = Boolean(evaluateExpression(condition, runtime));
    record(statement, {
      title: `for condition (${condition})`,
      kind: "loop-condition",
      branchLabel: passed ? "repeat" : "exit",
      branchReason: `The for-loop condition evaluated to ${passed}.`,
      next: passed ? "Run the loop body." : "Exit the loop.",
      metadata: { iteration },
    });

    if (!passed) {
      break;
    }

    iteration += 1;
    runtime.loopIterationCounts[statement.id] += 1;
    const control = executeStatements(statement.body, runtime);
    if (control?.break) {
      break;
    }

    if (statement.update) {
      const updateStatement = createSyntheticStatement(statement.update, statement.lineNumber);
      executeSingleStatement(updateStatement, runtime, record, executeStatements, createSyntheticStatement);
    }
  }
}

function executeSwitch(statement, runtime, record, executeStatements) {
  const switchValue = evaluateExpression(statement.expression, runtime);
  record(statement, {
    title: `switch (${statement.expression})`,
    kind: "decision",
    branchReason: `The switch expression evaluated to ${switchValue}.`,
    next: "Match the expression against the available cases.",
  });

  const matchedCase =
    statement.cases.find((caseEntry) => !caseEntry.isDefault && evaluateExpression(caseEntry.label, runtime) === switchValue) ||
    statement.cases.find((caseEntry) => caseEntry.isDefault) ||
    null;

  if (!matchedCase) {
    return;
  }

  runtime.branchDecisions.push({
    lineNumber: matchedCase.lineNumber,
    result: matchedCase.isDefault ? "default" : matchedCase.label,
    reason: matchedCase.isDefault ? "No explicit case matched, so default ran." : `Matched case ${matchedCase.label}.`,
  });

  record(statement, {
    title: matchedCase.isDefault ? "default" : `case ${matchedCase.label}`,
    lineNumber: matchedCase.lineNumber,
    kind: "decision",
    branchLabel: matchedCase.isDefault ? "default" : "case",
    branchReason: matchedCase.isDefault
      ? "Default case runs because no earlier case matched."
      : `Case ${matchedCase.label} matches the switch expression.`,
    next: "Execute statements inside the chosen case.",
  });

  executeStatements(matchedCase.body, runtime);
}

function executeUnsupported(statement, runtime, record) {
  runtime.partialSupportHits += 1;
  record(statement, {
    title: statement.raw,
    kind: "fallback",
    branchReason: statement.reason,
    next: "TraceWise AI will continue with fallback-safe execution.",
  });
}

function createSyntheticStatementFactory() {
  let counter = 1;
  return function createSyntheticStatement(text, lineNumber) {
    const cleaned = text.trim();
    if (/^(int|double|float|long|char|String|boolean|Scanner)\b/.test(cleaned)) {
      const match = cleaned.match(/^(int|double|float|long|char|String|boolean|Scanner)\s+(.+)$/);
      const type = match?.[1];
      const rest = match?.[2] || "";
      return {
        id: `synthetic-${counter++}`,
        type: "declaration",
        lineNumber,
        valueType: type,
        declarators: rest.split(",").map((segment) => {
          const [name, initializer] = segment.split("=").map((part) => part.trim());
          return { name, initializer: initializer || null };
        }),
        raw: cleaned.endsWith(";") ? cleaned : `${cleaned};`,
      };
    }

    if (/^\w+\s*(\+\+|--)$/.test(cleaned) || /^(\+\+|--)\w+$/.test(cleaned)) {
      return {
        id: `synthetic-${counter++}`,
        type: "update",
        lineNumber,
        expression: cleaned,
        raw: cleaned,
      };
    }

    const assignmentMatch = cleaned.match(/^(.+?)\s*(\+=|-=|\*=|\/=|%=|=)\s*(.+)$/);
    if (assignmentMatch) {
      return {
        id: `synthetic-${counter++}`,
        type: "assignment",
        lineNumber,
        target: assignmentMatch[1].trim(),
        operator: assignmentMatch[2],
        expression: assignmentMatch[3].trim(),
        raw: cleaned.endsWith(";") ? cleaned : `${cleaned};`,
      };
    }

    return {
      id: `synthetic-${counter++}`,
      type: "unsupported",
      lineNumber,
      raw: cleaned,
      reason: "Synthetic control statement could not be fully parsed.",
    };
  };
}

function executeSingleStatement(statement, runtime, record, executeStatements, createSyntheticStatement) {
  switch (statement.type) {
    case "declaration":
      executeDeclaration(statement, runtime, record);
      return {};
    case "assignment":
      executeAssignment(statement, runtime, record);
      return {};
    case "update":
      executeUpdate(statement, runtime, record);
      return {};
    case "output":
      executeOutput(statement, runtime, record);
      return {};
    case "if":
      executeIf(statement, runtime, record, executeStatements);
      return {};
    case "while":
      executeWhile(statement, runtime, record, executeStatements);
      return {};
    case "for":
      executeFor(statement, runtime, record, executeStatements, createSyntheticStatement);
      return {};
    case "switch":
      executeSwitch(statement, runtime, record, executeStatements);
      return {};
    case "block":
    case "wrapper":
      executeStatements(statement.body, runtime);
      return {};
    case "break":
      record(statement, {
        title: "break",
        kind: "break",
        branchReason: "Break exits the current loop or switch block.",
        next: "Return to the outer control flow.",
      });
      return { break: true };
    default:
      executeUnsupported(statement, runtime, record);
      return {};
  }
}

export function simulationEngine(normalizedProgram) {
  const runtime = {
    variables: {},
    variableTypes: {},
    customInputs: normalizedProgram.customInputs || {},
    outputText: "",
    steps: [],
    variableHistory: [],
    branchDecisions: [],
    loopIterationCounts: {},
    partialSupportHits: 0,
    currentInputTarget: null,
    currentInputType: null,
  };

  const record = createStepRecorder(runtime);
  const createSyntheticStatement = createSyntheticStatementFactory();

  const executeStatements = (statements, currentRuntime) => {
    for (const statement of statements) {
      const control = executeSingleStatement(statement, currentRuntime, record, executeStatements, createSyntheticStatement);
      if (control?.break) {
        return control;
      }
    }
    return {};
  };

  try {
    executeStatements(normalizedProgram.tree || [], runtime);
  } catch (error) {
    runtime.partialSupportHits += 1;
    record(
      {
        id: "runtime-fallback",
        lineNumber: normalizedProgram.lines?.[0]?.lineNumber || 1,
        raw: "Fallback trace step",
        type: "fallback",
      },
      {
        title: "Fallback trace step",
        kind: "fallback",
        branchReason: `The parser hit an unsupported runtime case: ${error.message}.`,
        next: "Return the safest partial trace instead of crashing.",
      },
    );
  }

  const output = runtime.outputText.replace(/\n$/, "");
  const executionTrace = runtime.steps.map((step) => step.nodeId);
  const visitedNodes = [...new Set(executionTrace)];

  return {
    currentStepIndex: 0,
    currentNodeId: runtime.steps[0]?.nodeId || "start",
    activeCodeLine: runtime.steps[0]?.lineNumber || 0,
    variables: clone(runtime.variables),
    previousVariables: runtime.steps.at(-1)?.previousVariables || {},
    changedVariables: runtime.steps.at(-1)?.changedVariables || {},
    variableHistory: runtime.variableHistory,
    output: output ? output.split("\n") : [],
    outputText: output,
    executionTrace,
    visitedNodes,
    branchDecisions: runtime.branchDecisions,
    loopIterationCounts: runtime.loopIterationCounts,
    partialSupportHits: runtime.partialSupportHits,
    steps: runtime.steps,
  };
}
