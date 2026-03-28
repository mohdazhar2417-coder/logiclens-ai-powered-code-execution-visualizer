import { makeProgram } from "./helpers.js";

const category = "Loops";

export const loopPrograms = [
  makeProgram({
    name: "Print 1 to n",
    category,
    subtype: "Print 1 to n",
    description: "Introduces a counting loop.",
    tags: ["for-loop", "sequence"],
    defaultInputs: { n: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 5;
    for (int i = 1; i <= n; i++) {
      System.out.println(i);
    }
  }
}`,
  }),
  makeProgram({
    name: "Print n to 1",
    category,
    subtype: "Print n to 1",
    description: "Reverse counting with a loop.",
    tags: ["for-loop", "reverse"],
    defaultInputs: { n: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 5;
    for (int i = n; i >= 1; i--) {
      System.out.println(i);
    }
  }
}`,
  }),
  makeProgram({
    name: "Even numbers in range",
    category,
    subtype: "Even numbers in range",
    description: "Combines a loop with an if check.",
    tags: ["loop", "condition"],
    defaultInputs: { n: 10 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 10;
    for (int i = 1; i <= n; i++) {
      if (i % 2 == 0) System.out.println(i);
    }
  }
}`,
  }),
  makeProgram({
    name: "Odd numbers in range",
    category,
    subtype: "Odd numbers in range",
    description: "Prints odd values in a range.",
    tags: ["loop", "condition"],
    defaultInputs: { n: 10 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 10;
    for (int i = 1; i <= n; i++) {
      if (i % 2 != 0) System.out.println(i);
    }
  }
}`,
  }),
  makeProgram({
    name: "Multiplication table",
    category,
    subtype: "Multiplication table",
    description: "Builds a ten-row multiplication table.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["loop", "demo-critical"],
    defaultInputs: { n: 7 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 7;
    for (int i = 1; i <= 10; i++) {
      System.out.println(n + " x " + i + " = " + (n * i));
    }
  }
}`,
  }),
  makeProgram({
    name: "Sum of n natural numbers",
    category,
    subtype: "Sum of n natural numbers",
    description: "Accumulates numbers from 1 through n.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["loop", "accumulator", "demo-critical"],
    defaultInputs: { n: 6 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 6;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
      sum = sum + i;
    }
    System.out.println("Sum = " + sum);
  }
}`,
  }),
  makeProgram({
    name: "Factorial",
    category,
    subtype: "Factorial",
    description: "Multiplicative accumulation from 1 to n.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["loop", "accumulator", "demo-critical"],
    defaultInputs: { n: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 5;
    int fact = 1;
    for (int i = 1; i <= n; i++) {
      fact = fact * i;
    }
    System.out.println("Factorial of " + n + " = " + fact);
  }
}`,
  }),
  makeProgram({
    name: "Power of number",
    category,
    subtype: "Power of number",
    description: "Repeats multiplication exponent times.",
    tags: ["loop", "power"],
    defaultInputs: { base: 2, exp: 4 },
    code: `public class Main {
  public static void main(String[] args) {
    int base = 2, exp = 4, result = 1;
    for (int i = 1; i <= exp; i++) {
      result = result * base;
    }
    System.out.println(result);
  }
}`,
  }),
  makeProgram({
    name: "Reverse counting",
    category,
    subtype: "Reverse counting",
    description: "Simple descending loop example.",
    tags: ["reverse", "loop"],
    defaultInputs: { n: 8 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 8;
    while (n >= 1) {
      System.out.println(n);
      n--;
    }
  }
}`,
  }),
  makeProgram({
    name: "Count digits",
    category,
    subtype: "Count digits",
    description: "Counts how many digits are in a number.",
    tags: ["while-loop", "number-logic"],
    defaultInputs: { num: 4567 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 4567, count = 0;
    while (num > 0) {
      num = num / 10;
      count++;
    }
    System.out.println(count);
  }
}`,
  }),
  makeProgram({
    name: "Sum of digits",
    category,
    subtype: "Sum of digits",
    description: "Extracts digits using modulo and division.",
    tags: ["while-loop", "digits"],
    defaultInputs: { num: 4567 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 4567, sum = 0;
    while (num > 0) {
      sum = sum + (num % 10);
      num = num / 10;
    }
    System.out.println(sum);
  }
}`,
  }),
  makeProgram({
    name: "Product of digits",
    category,
    subtype: "Product of digits",
    description: "Multiplies all digits in a number.",
    tags: ["while-loop", "digits"],
    defaultInputs: { num: 234 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 234, product = 1;
    while (num > 0) {
      product = product * (num % 10);
      num = num / 10;
    }
    System.out.println(product);
  }
}`,
  }),
];
