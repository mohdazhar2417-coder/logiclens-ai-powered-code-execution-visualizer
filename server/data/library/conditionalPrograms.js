import { makeProgram } from "./helpers.js";

const category = "Conditionals";

export const conditionalPrograms = [
  makeProgram({
    name: "Even or Odd",
    category,
    subtype: "Even or Odd",
    description: "Checks whether a number is divisible by 2.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["modulo", "branching", "demo-critical"],
    defaultInputs: { num: 8 },
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
  }),
  makeProgram({
    name: "Positive / Negative / Zero",
    category,
    subtype: "Positive / Negative / Zero",
    description: "A basic three-way conditional.",
    tags: ["if-else", "comparison"],
    defaultInputs: { num: -3 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = -3;
    if (num > 0) System.out.println("Positive");
    else if (num < 0) System.out.println("Negative");
    else System.out.println("Zero");
  }
}`,
  }),
  makeProgram({
    name: "Greatest of 2 numbers",
    category,
    subtype: "Greatest of 2 numbers",
    description: "Finds the larger of two values.",
    tags: ["comparison", "branching"],
    defaultInputs: { a: 8, b: 12 },
    code: `public class Main {
  public static void main(String[] args) {
    int a = 8, b = 12;
    if (a > b) System.out.println(a);
    else System.out.println(b);
  }
}`,
  }),
  makeProgram({
    name: "Greatest of 3 numbers",
    category,
    subtype: "Greatest of 3 numbers",
    description: "Compares three numbers with a decision chain.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["comparison", "if-else", "demo-critical"],
    defaultInputs: { a: 12, b: 7, c: 18 },
    code: `public class Main {
  public static void main(String[] args) {
    int a = 12, b = 7, c = 18;
    if (a >= b && a >= c) {
      System.out.println("Greatest number = " + a);
    } else if (b >= a && b >= c) {
      System.out.println("Greatest number = " + b);
    } else {
      System.out.println("Greatest number = " + c);
    }
  }
}`,
  }),
  makeProgram({
    name: "Leap year",
    category,
    subtype: "Leap year",
    description: "Classic nested divisibility logic.",
    tags: ["calendar", "modulo"],
    defaultInputs: { year: 2024 },
    code: `public class Main {
  public static void main(String[] args) {
    int year = 2024;
    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
      System.out.println("Leap year");
    } else {
      System.out.println("Not leap year");
    }
  }
}`,
  }),
  makeProgram({
    name: "Vowel or consonant",
    category,
    subtype: "Vowel or consonant",
    description: "Tests character membership.",
    tags: ["char", "branching"],
    defaultInputs: { ch: "e" },
    code: `public class Main {
  public static void main(String[] args) {
    char ch = 'e';
    if (ch=='a'||ch=='e'||ch=='i'||ch=='o'||ch=='u') {
      System.out.println("Vowel");
    } else {
      System.out.println("Consonant");
    }
  }
}`,
  }),
  makeProgram({
    name: "Alphabet / digit / special character",
    category,
    subtype: "Alphabet / digit / special character",
    description: "Shows range comparisons for chars.",
    tags: ["char", "ranges"],
    defaultInputs: { ch: "#" },
    code: `public class Main {
  public static void main(String[] args) {
    char ch = '#';
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))
      System.out.println("Alphabet");
    else if (ch >= '0' && ch <= '9')
      System.out.println("Digit");
    else
      System.out.println("Special Character");
  }
}`,
  }),
  makeProgram({
    name: "Pass or fail",
    category,
    subtype: "Pass or fail",
    description: "Binary result based on minimum marks.",
    tags: ["education", "branching"],
    defaultInputs: { marks: 38 },
    code: `public class Main {
  public static void main(String[] args) {
    int marks = 38;
    if (marks >= 35) System.out.println("Pass");
    else System.out.println("Fail");
  }
}`,
  }),
  makeProgram({
    name: "Grade calculator",
    category,
    subtype: "Grade calculator",
    description: "Maps marks to grade bands.",
    tags: ["education", "else-if"],
    defaultInputs: { marks: 82 },
    code: `public class Main {
  public static void main(String[] args) {
    int marks = 82;
    if (marks >= 90) System.out.println("A");
    else if (marks >= 75) System.out.println("B");
    else if (marks >= 60) System.out.println("C");
    else System.out.println("D");
  }
}`,
  }),
  makeProgram({
    name: "Voting eligibility",
    category,
    subtype: "Voting eligibility",
    description: "Simple age check example.",
    tags: ["comparison", "real-world"],
    defaultInputs: { age: 19 },
    code: `public class Main {
  public static void main(String[] args) {
    int age = 19;
    if (age >= 18) System.out.println("Eligible");
    else System.out.println("Not Eligible");
  }
}`,
  }),
  makeProgram({
    name: "Divisible by 5 and 11",
    category,
    subtype: "Divisible by 5 and 11",
    description: "Combines conditions with logical AND.",
    tags: ["modulo", "logical-and"],
    defaultInputs: { num: 55 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 55;
    if (num % 5 == 0 && num % 11 == 0)
      System.out.println("Divisible by 5 and 11");
    else
      System.out.println("Not divisible");
  }
}`,
  }),
  makeProgram({
    name: "Multiple of a number check",
    category,
    subtype: "Multiple of a number check",
    description: "Checks whether one value is a multiple of another.",
    tags: ["modulo", "custom-input"],
    defaultInputs: { num: 42, divisor: 7 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 42, divisor = 7;
    if (num % divisor == 0) System.out.println("Multiple");
    else System.out.println("Not Multiple");
  }
}`,
  }),
];
