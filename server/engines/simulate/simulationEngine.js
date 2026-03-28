import { explainStep } from "../explain/explainStep.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function numberValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildStep({
  steps,
  nodeId,
  lineNumber,
  title,
  variables,
  previousVariables,
  changedVariables = {},
  output,
  branchReason = "",
  kind = "process",
  branchLabel = "",
  next = "",
  commonMistake = "",
}) {
  const step = {
    id: `step-${steps.length + 1}`,
    stepIndex: steps.length,
    nodeId,
    lineNumber,
    title,
    kind,
    branchLabel,
    branchReason,
    next,
    commonMistake,
    variables: clone(variables),
    previousVariables: clone(previousVariables),
    changedVariables: clone(changedVariables),
    outputSnapshot: output.join("\n"),
  };

  step.teacherMode = explainStep(step, title);
  step.explanation = step.teacherMode.whatHappened;
  steps.push(step);
}

function createRecorder(state, steps) {
  return (config) => {
    state.variableHistory.push({
      stepIndex: steps.length,
      variables: clone(state.variables),
    });

    buildStep({
      steps,
      variables: state.variables,
      previousVariables: config.previousVariables || {},
      output: state.output,
      ...config,
    });
  };
}

function simulateFallback(normalizedProgram) {
  const steps = [];
  const state = {
    variables: {},
    variableHistory: [],
    output: [],
  };
  const record = createRecorder(state, steps);

  normalizedProgram.statements.forEach((statement) => {
    const previousVariables = clone(state.variables);
    const changedVariables = {};

    if (statement.type === "declaration") {
      const match = statement.trimmed.match(/(int|double|float|long|String|char|boolean)\s+(\w+)(?:\s*=\s*([^;]+))?/);
      if (match) {
        const [, , name, rawValue] = match;
        state.variables[name] = rawValue ? rawValue.replace(/["';]/g, "").trim() : 0;
        changedVariables[name] = state.variables[name];
      }
    }

    if (statement.type === "assignment") {
      const match = statement.trimmed.match(/(\w+)\s*=\s*([^;]+)/);
      if (match) {
        const [, name, expression] = match;
        const numericExpression = expression.replace(/\b(\w+)\b/g, (token) =>
          Object.prototype.hasOwnProperty.call(state.variables, token) ? state.variables[token] : token,
        );
        try {
          const result = Function(`return (${numericExpression});`)();
          state.variables[name] = result;
          changedVariables[name] = result;
        } catch {
          state.variables[name] = expression.trim();
          changedVariables[name] = expression.trim();
        }
      }
    }

    if (statement.type === "output") {
      const printMatch = statement.trimmed.match(/print(?:ln)?\((.+)\)/);
      if (printMatch) {
        const rendered = printMatch[1]
          .replace(/["']/g, "")
          .replace(/\b(\w+)\b/g, (token) =>
            Object.prototype.hasOwnProperty.call(state.variables, token) ? state.variables[token] : token,
          );
        state.output.push(rendered);
      }
    }

    record({
      nodeId: statement.id,
      lineNumber: statement.lineNumber,
      title: statement.trimmed,
      previousVariables,
      changedVariables,
      kind: statement.type,
      next: "Continue to the next beginner-friendly statement.",
    });
  });

  return {
    steps,
    variables: state.variables,
    previousVariables: steps.at(-2)?.variables || {},
    changedVariables: steps.at(-1)?.changedVariables || {},
    variableHistory: state.variableHistory,
    output: state.output,
    branchDecisions: [],
    loopIterationCounts: {},
  };
}

function simulateDemoPrograms(normalizedProgram) {
  const subtype = normalizedProgram.subtype;
  const inputs = normalizedProgram.customInputs || {};
  const steps = [];
  const state = {
    variables: {},
    variableHistory: [],
    output: [],
    branchDecisions: [],
    loopIterationCounts: {},
  };
  const record = createRecorder(state, steps);
  const finish = () => ({
    ...state,
    steps,
    previousVariables: steps.at(-2)?.variables || {},
    changedVariables: steps.at(-1)?.changedVariables || {},
  });

  if (subtype === "Even or Odd") {
    const num = numberValue(inputs.num ?? inputs.n ?? 8, 8);
    state.variables.num = num;
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: "Read the number to test",
      changedVariables: { num },
      kind: "input",
      next: "Check the remainder after division by 2.",
    });

    const previousVariables = clone(state.variables);
    state.variables.remainder = num % 2;
    record({
      nodeId: "line-2",
      lineNumber: 2,
      title: "Compute num % 2",
      previousVariables,
      changedVariables: { remainder: state.variables.remainder },
      next: "Use the remainder to choose the branch.",
    });

    const branch = state.variables.remainder === 0 ? "even" : "odd";
    state.branchDecisions.push({
      nodeId: "line-3",
      result: branch,
      reason: `Because ${num} % 2 = ${state.variables.remainder}.`,
    });
    state.output.push(branch === "even" ? `${num} is even` : `${num} is odd`);
    record({
      nodeId: "line-3",
      lineNumber: 3,
      title: "Choose the even or odd branch",
      previousVariables: clone(state.variables),
      changedVariables: {},
      branchReason: `Because ${num} % 2 = ${state.variables.remainder}, the ${branch} branch runs.`,
      branchLabel: branch === "even" ? "Yes" : "No",
      kind: "decision",
      next: "Print the final classification.",
    });
    return finish();
  }

  if (subtype === "Greatest of 3 numbers") {
    state.variables.a = numberValue(inputs.a ?? 12, 12);
    state.variables.b = numberValue(inputs.b ?? 7, 7);
    state.variables.c = numberValue(inputs.c ?? 18, 18);
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: "Capture the three candidate values",
      changedVariables: { a: state.variables.a, b: state.variables.b, c: state.variables.c },
      kind: "input",
      next: "Compare the values branch by branch.",
    });

    const previousVariables = clone(state.variables);
    let greatest = state.variables.a;
    let reason = `${state.variables.a} starts as the current greatest value.`;

    if (state.variables.b >= greatest && state.variables.b >= state.variables.c) {
      greatest = state.variables.b;
      reason = `${state.variables.b} is greater than or equal to both ${state.variables.a} and ${state.variables.c}.`;
    } else if (state.variables.c >= greatest && state.variables.c >= state.variables.b) {
      greatest = state.variables.c;
      reason = `${state.variables.c} is greater than or equal to both ${state.variables.a} and ${state.variables.b}.`;
    }

    state.variables.greatest = greatest;
    state.branchDecisions.push({
      nodeId: "line-2",
      result: greatest,
      reason,
    });
    state.output.push(`Greatest number = ${greatest}`);
    record({
      nodeId: "line-2",
      lineNumber: 2,
      title: "Evaluate the greatest-of-three decision chain",
      previousVariables,
      changedVariables: { greatest },
      branchReason: reason,
      kind: "decision",
      next: "Print the chosen greatest value.",
    });
    return finish();
  }

  if (subtype === "Factorial") {
    state.variables.n = numberValue(inputs.n ?? 5, 5);
    state.variables.fact = 1;
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: "Initialize factorial inputs",
      changedVariables: { n: state.variables.n, fact: 1 },
      kind: "input",
      next: "Multiply fact by each number from 1 to n.",
    });

    state.loopIterationCounts.factorialLoop = 0;
    for (let i = 1; i <= state.variables.n; i += 1) {
      const previousVariables = clone(state.variables);
      state.variables.i = i;
      state.variables.fact *= i;
      state.loopIterationCounts.factorialLoop += 1;
      record({
        nodeId: "line-2",
        lineNumber: 2,
        title: `Factorial loop iteration ${i}`,
        previousVariables,
        changedVariables: { i, fact: state.variables.fact },
        branchReason: `Iteration ${i} multiplies the running factorial by ${i}.`,
        kind: "loop",
        branchLabel: "repeat",
        next: i === state.variables.n ? "The loop is complete; print the result." : "Move to the next multiplier.",
      });
    }

    state.output.push(`Factorial of ${state.variables.n} = ${state.variables.fact}`);
    return finish();
  }

  if (subtype === "Sum of n natural numbers") {
    state.variables.n = numberValue(inputs.n ?? 6, 6);
    state.variables.sum = 0;
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: "Initialize n and sum",
      changedVariables: { n: state.variables.n, sum: 0 },
      kind: "input",
      next: "Accumulate numbers from 1 through n.",
    });

    state.loopIterationCounts.sumLoop = 0;
    for (let i = 1; i <= state.variables.n; i += 1) {
      const previousVariables = clone(state.variables);
      state.variables.i = i;
      state.variables.sum += i;
      state.loopIterationCounts.sumLoop += 1;
      record({
        nodeId: "line-2",
        lineNumber: 2,
        title: `Add ${i} into the running sum`,
        previousVariables,
        changedVariables: { i, sum: state.variables.sum },
        branchReason: `The loop includes ${i}, so the sum becomes ${state.variables.sum}.`,
        kind: "loop",
        branchLabel: "repeat",
        next: i === state.variables.n ? "Loop finished; print the total." : "Continue to the next natural number.",
      });
    }

    state.output.push(`Sum = ${state.variables.sum}`);
    return finish();
  }

  if (subtype === "Multiplication table") {
    state.variables.n = numberValue(inputs.n ?? 7, 7);
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: "Capture the number for the table",
      changedVariables: { n: state.variables.n },
      kind: "input",
      next: "Generate ten rows for the table.",
    });

    state.loopIterationCounts.tableLoop = 0;
    for (let i = 1; i <= 10; i += 1) {
      const previousVariables = clone(state.variables);
      state.variables.i = i;
      state.variables.product = state.variables.n * i;
      state.output.push(`${state.variables.n} x ${i} = ${state.variables.product}`);
      state.loopIterationCounts.tableLoop += 1;
      record({
        nodeId: "line-2",
        lineNumber: 2,
        title: `Build row ${i} of the multiplication table`,
        previousVariables,
        changedVariables: { i, product: state.variables.product },
        branchReason: `Each row multiplies ${state.variables.n} by the current counter ${i}.`,
        kind: "loop",
        branchLabel: "repeat",
        next: i === 10 ? "The table is complete." : "Move to the next row.",
      });
    }
    return finish();
  }

  if (subtype === "Prime number") {
    state.variables.num = numberValue(inputs.num ?? 17, 17);
    state.variables.isPrime = state.variables.num > 1;
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: "Initialize the prime check",
      changedVariables: { num: state.variables.num, isPrime: state.variables.isPrime },
      kind: "input",
      next: "Try divisors from 2 to num - 1.",
    });

    state.loopIterationCounts.primeLoop = 0;
    for (let i = 2; i < state.variables.num; i += 1) {
      const previousVariables = clone(state.variables);
      state.variables.i = i;
      state.loopIterationCounts.primeLoop += 1;
      if (state.variables.num % i === 0) {
        state.variables.isPrime = false;
        state.branchDecisions.push({
          nodeId: "line-2",
          result: "composite",
          reason: `${state.variables.num} is divisible by ${i}, so it is not prime.`,
        });
        record({
          nodeId: "line-2",
          lineNumber: 2,
          title: `Test divisor ${i}`,
          previousVariables,
          changedVariables: { i, isPrime: false },
          branchReason: `${state.variables.num} % ${i} = 0, so the search stops.`,
          kind: "decision",
          branchLabel: "divides",
          next: "Print that the number is not prime.",
        });
        break;
      }

      record({
        nodeId: "line-2",
        lineNumber: 2,
        title: `Test divisor ${i}`,
        previousVariables,
        changedVariables: { i },
        branchReason: `${state.variables.num} % ${i} is not 0, so the loop continues.`,
        kind: "loop",
        branchLabel: "continue",
        next: i === state.variables.num - 1 ? "All divisors are tested." : "Try the next divisor.",
      });
    }

    state.output.push(state.variables.isPrime ? `${state.variables.num} is prime` : `${state.variables.num} is not prime`);
    return finish();
  }

  if (subtype === "Palindrome number") {
    state.variables.num = numberValue(inputs.num ?? 121, 121);
    state.variables.original = state.variables.num;
    state.variables.reverse = 0;
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: "Initialize palindrome tracking values",
      changedVariables: { num: state.variables.num, original: state.variables.original, reverse: 0 },
      kind: "input",
      next: "Build the reverse number digit by digit.",
    });

    state.loopIterationCounts.reverseLoop = 0;
    while (state.variables.num > 0) {
      const previousVariables = clone(state.variables);
      state.variables.digit = state.variables.num % 10;
      state.variables.reverse = state.variables.reverse * 10 + state.variables.digit;
      state.variables.num = Math.floor(state.variables.num / 10);
      state.loopIterationCounts.reverseLoop += 1;
      record({
        nodeId: "line-2",
        lineNumber: 2,
        title: `Reverse-building iteration ${state.loopIterationCounts.reverseLoop}`,
        previousVariables,
        changedVariables: {
          digit: state.variables.digit,
          reverse: state.variables.reverse,
          num: state.variables.num,
        },
        branchReason: "Take the last digit, append it to reverse, and shrink the original number.",
        kind: "loop",
        branchLabel: "repeat",
        next: state.variables.num > 0 ? "Continue with the next digit." : "Compare the reverse with the original number.",
      });
    }

    state.variables.isPalindrome = state.variables.reverse === state.variables.original;
    state.branchDecisions.push({
      nodeId: "line-3",
      result: state.variables.isPalindrome,
      reason: `${state.variables.reverse} ${state.variables.isPalindrome ? "matches" : "does not match"} ${state.variables.original}.`,
    });
    state.output.push(state.variables.isPalindrome ? "Palindrome number" : "Not a palindrome number");
    record({
      nodeId: "line-3",
      lineNumber: 3,
      title: "Compare original and reversed values",
      previousVariables: clone(state.variables),
      changedVariables: { isPalindrome: state.variables.isPalindrome },
      branchReason: `${state.variables.reverse} ${state.variables.isPalindrome ? "=" : "!="} ${state.variables.original}.`,
      kind: "decision",
      next: "Print the palindrome result.",
    });
    return finish();
  }

  if (subtype === "Fibonacci series") {
    state.variables.n = numberValue(inputs.n ?? 7, 7);
    state.variables.a = 0;
    state.variables.b = 1;
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: "Initialize the first two Fibonacci values",
      changedVariables: { n: state.variables.n, a: 0, b: 1 },
      kind: "input",
      next: "Emit each term and compute the next pair.",
    });

    state.loopIterationCounts.fibonacciLoop = 0;
    for (let i = 0; i < state.variables.n; i += 1) {
      const previousVariables = clone(state.variables);
      state.output.push(String(state.variables.a));
      state.variables.next = state.variables.a + state.variables.b;
      state.variables.a = state.variables.b;
      state.variables.b = state.variables.next;
      state.variables.i = i;
      state.loopIterationCounts.fibonacciLoop += 1;
      record({
        nodeId: "line-2",
        lineNumber: 2,
        title: `Generate Fibonacci term ${i + 1}`,
        previousVariables,
        changedVariables: { i, next: state.variables.next, a: state.variables.a, b: state.variables.b },
        branchReason: "The next value is the sum of the previous two terms.",
        kind: "loop",
        branchLabel: "repeat",
        next: i + 1 === state.variables.n ? "The series is complete." : "Continue to the next term.",
      });
    }
    return finish();
  }

  if (subtype === "Right triangle star pattern" || subtype === "Pyramid") {
    const rows = numberValue(inputs.rows ?? inputs.n ?? 5, 5);
    state.variables.rows = rows;
    record({
      nodeId: "line-1",
      lineNumber: 1,
      title: subtype === "Pyramid" ? "Set the number of pyramid rows" : "Set the number of rows for the pattern",
      changedVariables: { rows },
      kind: "input",
      next: "Render the pattern row by row.",
    });

    const counterName = subtype === "Pyramid" ? "pyramidRows" : "patternRows";
    state.loopIterationCounts[counterName] = 0;
    for (let i = 1; i <= rows; i += 1) {
      const previousVariables = clone(state.variables);
      const row =
        subtype === "Pyramid"
          ? `${" ".repeat(rows - i)}${"* ".repeat(i).trimEnd()}`
          : "* ".repeat(i).trimEnd();

      state.variables.i = i;
      state.variables.currentRow = row;
      state.output.push(row);
      state.loopIterationCounts[counterName] += 1;
      record({
        nodeId: "line-2",
        lineNumber: 2,
        title: `${subtype === "Pyramid" ? "Render pyramid row" : "Render triangle row"} ${i}`,
        previousVariables,
        changedVariables: { i, currentRow: row },
        branchReason:
          subtype === "Pyramid"
            ? `Row ${i} uses ${rows - i} leading spaces and ${i} star groups.`
            : `Row ${i} contains exactly ${i} stars.`,
        kind: "loop",
        branchLabel: "repeat",
        next: i === rows ? "The pattern is complete." : "Move to the next row.",
      });
    }
    return finish();
  }

  return null;
}

export function simulationEngine(normalizedProgram) {
  const supportedState = simulateDemoPrograms(normalizedProgram);
  const base =
    supportedState ||
    simulateFallback(normalizedProgram);
  const executionTrace = base.steps.map((step) => step.nodeId);
  const visitedNodes = [...new Set(executionTrace)];

  return {
    currentStepIndex: 0,
    currentNodeId: base.steps[0]?.nodeId || "start",
    activeCodeLine: base.steps[0]?.lineNumber || 0,
    variables: base.variables,
    previousVariables: base.previousVariables,
    changedVariables: base.changedVariables,
    variableHistory: base.variableHistory,
    output: base.output,
    executionTrace,
    visitedNodes,
    branchDecisions: base.branchDecisions,
    loopIterationCounts: base.loopIterationCounts,
    steps: base.steps,
  };
}
