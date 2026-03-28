import { makeProgram } from "./helpers.js";

const category = "Number Logic Programs";

export const numberLogicPrograms = [
  makeProgram({
    name: "Palindrome number",
    category,
    subtype: "Palindrome number",
    description: "Builds a reversed number and compares it.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["digits", "demo-critical"],
    defaultInputs: { num: 121 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 121, original = num, reverse = 0;
    while (num > 0) {
      int digit = num % 10;
      reverse = reverse * 10 + digit;
      num = num / 10;
    }
    if (reverse == original) System.out.println("Palindrome number");
    else System.out.println("Not a palindrome number");
  }
}`,
  }),
  makeProgram({
    name: "Armstrong number",
    category,
    subtype: "Armstrong number",
    description: "Checks whether the sum of powered digits matches the original.",
    tags: ["digits", "number-logic"],
    defaultInputs: { num: 153 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 153, original = num, sum = 0;
    while (num > 0) {
      int digit = num % 10;
      sum = sum + (digit * digit * digit);
      num = num / 10;
    }
    if (sum == original) System.out.println("Armstrong");
    else System.out.println("Not Armstrong");
  }
}`,
  }),
  makeProgram({
    name: "Strong number",
    category,
    subtype: "Strong number",
    description: "Adds factorials of each digit.",
    tags: ["digits", "factorial"],
    defaultInputs: { num: 145 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 145, original = num, sum = 0;
    while (num > 0) {
      int digit = num % 10, fact = 1;
      for (int i = 1; i <= digit; i++) fact *= i;
      sum += fact;
      num /= 10;
    }
    if (sum == original) System.out.println("Strong");
    else System.out.println("Not Strong");
  }
}`,
  }),
  makeProgram({
    name: "Prime number",
    category,
    subtype: "Prime number",
    description: "Tests divisibility to check primality.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["number-logic", "demo-critical"],
    defaultInputs: { num: 17 },
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
  }),
  makeProgram({
    name: "Perfect number",
    category,
    subtype: "Perfect number",
    description: "Sums the factors of a number.",
    tags: ["factors", "loop"],
    defaultInputs: { num: 28 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 28, sum = 0;
    for (int i = 1; i < num; i++) {
      if (num % i == 0) sum += i;
    }
    if (sum == num) System.out.println("Perfect");
    else System.out.println("Not Perfect");
  }
}`,
  }),
  makeProgram({
    name: "Fibonacci series",
    category,
    subtype: "Fibonacci series",
    description: "Generates the sequence by summing the previous two values.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["sequence", "demo-critical"],
    defaultInputs: { n: 7 },
    code: `public class Main {
  public static void main(String[] args) {
    int n = 7, a = 0, b = 1;
    for (int i = 0; i < n; i++) {
      System.out.println(a);
      int next = a + b;
      a = b;
      b = next;
    }
  }
}`,
  }),
  makeProgram({
    name: "Reverse number",
    category,
    subtype: "Reverse number",
    description: "Constructs a number in reverse order.",
    tags: ["digits", "while-loop"],
    defaultInputs: { num: 4321 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 4321, reverse = 0;
    while (num > 0) {
      reverse = reverse * 10 + (num % 10);
      num /= 10;
    }
    System.out.println(reverse);
  }
}`,
  }),
  makeProgram({
    name: "Automorphic number",
    category,
    subtype: "Automorphic number",
    description: "Checks if the square ends with the original number.",
    tags: ["square", "number-logic"],
    defaultInputs: { num: 25 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 25, square = num * num;
    if (square % 100 == num) System.out.println("Automorphic");
    else System.out.println("Not Automorphic");
  }
}`,
  }),
  makeProgram({
    name: "Neon number",
    category,
    subtype: "Neon number",
    description: "Sums digits of the square.",
    tags: ["digits", "square"],
    defaultInputs: { num: 9 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 9, square = num * num, sum = 0;
    while (square > 0) {
      sum += square % 10;
      square /= 10;
    }
    if (sum == num) System.out.println("Neon");
    else System.out.println("Not Neon");
  }
}`,
  }),
  makeProgram({
    name: "Spy number",
    category,
    subtype: "Spy number",
    description: "Compares sum of digits to product of digits.",
    tags: ["digits", "logic"],
    defaultInputs: { num: 123 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 123, sum = 0, product = 1;
    while (num > 0) {
      int digit = num % 10;
      sum += digit;
      product *= digit;
      num /= 10;
    }
    if (sum == product) System.out.println("Spy");
    else System.out.println("Not Spy");
  }
}`,
  }),
  makeProgram({
    name: "Duck number",
    category,
    subtype: "Duck number",
    description: "Checks whether a number contains zero.",
    tags: ["digits", "logic"],
    defaultInputs: { num: 1023 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 1023;
    boolean duck = false;
    while (num > 0) {
      if (num % 10 == 0) duck = true;
      num /= 10;
    }
    System.out.println(duck ? "Duck" : "Not Duck");
  }
}`,
  }),
];
