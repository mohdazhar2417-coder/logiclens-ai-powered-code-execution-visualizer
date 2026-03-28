export const samplePrograms = [
  {
    name: "Even or Odd",
    category: "Conditionals",
    subtype: "Even or Odd",
    difficulty: "Beginner+",
    description: "Checks whether a number is divisible by 2.",
    defaultInputs: { num: 8 },
    tags: ["demo-critical", "modulo"],
    code: `public class Main {
  public static void main(String[] args) {
    int num = 8;
    if (num % 2 == 0) {
      System.out.println(num + " is even");
    } else {
      System.out.println(num + " is odd");
    }
  }
}`,
  },
  {
    name: "Factorial",
    category: "Loops",
    subtype: "Factorial",
    difficulty: "Beginner+",
    description: "Multiplicative accumulation from 1 to n.",
    defaultInputs: { n: 5 },
    tags: ["demo-critical", "loop"],
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
  },
  {
    name: "Prime number",
    category: "Number Logic Programs",
    subtype: "Prime number",
    difficulty: "Beginner+",
    description: "Tests divisibility to check primality.",
    defaultInputs: { num: 17 },
    tags: ["demo-critical", "number-logic"],
    code: `public class Main {
  public static void main(String[] args) {
    int num = 17;
    boolean isPrime = true;
    for (int i = 2; i < num; i++) {
      if (num % i == 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime && num > 1) System.out.println(num + " is prime");
    else System.out.println(num + " is not prime");
  }
}`,
  },
  {
    name: "Right triangle star pattern",
    category: "Pattern Programs",
    subtype: "Right triangle star pattern",
    difficulty: "Beginner+",
    description: "Builds rows with a growing number of stars.",
    defaultInputs: { rows: 5 },
    tags: ["demo-critical", "pattern"],
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 5;
    for (int i = 1; i <= rows; i++) {
      for (int j = 1; j <= i; j++) {
        System.out.print("* ");
      }
      System.out.println();
    }
  }
}`,
  },
];

export const categories = [
  "Basic Input / Output & Math",
  "Conditionals",
  "Loops",
  "Number Logic Programs",
  "Pattern Programs",
];
