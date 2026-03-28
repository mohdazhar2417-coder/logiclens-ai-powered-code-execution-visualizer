import test from "node:test";
import assert from "node:assert/strict";
import { normalizeProgram } from "../engines/parse/normalizeProgram.js";
import { simulationEngine } from "../engines/simulate/simulationEngine.js";

test("simulation engine traces factorial from parsed for-loop code", () => {
  const code = `public class Main {
    public static void main(String[] args) {
      int n = 4;
      int fact = 1;
      for (int i = 1; i <= n; i++) {
        fact = fact * i;
      }
      System.out.println("Factorial = " + fact);
    }
  }`;

  const normalized = normalizeProgram(code, { n: 4 });
  const result = simulationEngine(normalized);

  assert.equal(normalized.supportLevel, "full");
  assert.equal(result.outputText, "Factorial = 24");
  assert.equal(result.loopIterationCounts["statement-5"], 4);
  assert.ok(result.steps.some((step) => step.kind === "loop-condition"));
});

test("simulation engine handles nested loops and incremental output", () => {
  const code = `public class Main {
    public static void main(String[] args) {
      int rows = 3;
      for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
          System.out.print("* ");
        }
        System.out.println();
      }
    }
  }`;

  const normalized = normalizeProgram(code, { rows: 3 });
  const result = simulationEngine(normalized);

  assert.equal(normalized.supportLevel, "full");
  assert.equal(result.outputText, "* \n* * \n* * * ");
  assert.ok(Object.keys(result.loopIterationCounts).length >= 2);
});

test("simulation engine supports simple Scanner-style input", () => {
  const code = `public class Main {
    public static void main(String[] args) {
      Scanner sc = new Scanner(System.in);
      int num = sc.nextInt();
      if (num % 2 == 0) {
        System.out.println("even");
      } else {
        System.out.println("odd");
      }
    }
  }`;

  const normalized = normalizeProgram(code, { num: 9 });
  const result = simulationEngine(normalized);

  assert.notEqual(normalized.supportLevel, "fallback");
  assert.equal(result.outputText, "odd");
});
