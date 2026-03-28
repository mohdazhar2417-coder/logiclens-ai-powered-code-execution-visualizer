import { makeProgram } from "./helpers.js";

const category = "Pattern Programs";

export const patternPrograms = [
  makeProgram({
    name: "Square pattern",
    category,
    subtype: "Square pattern",
    description: "Prints a square grid of stars.",
    tags: ["pattern", "nested-loop"],
    defaultInputs: { rows: 4 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 4;
    for (int i = 1; i <= rows; i++) {
      for (int j = 1; j <= rows; j++) {
        System.out.print("* ");
      }
      System.out.println();
    }
  }
}`,
  }),
  makeProgram({
    name: "Right triangle star pattern",
    category,
    subtype: "Right triangle star pattern",
    description: "Builds rows with a growing number of stars.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["pattern", "demo-critical"],
    defaultInputs: { rows: 5 },
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
  }),
  makeProgram({
    name: "Inverted triangle",
    category,
    subtype: "Inverted triangle",
    description: "Decreases the number of stars each row.",
    tags: ["pattern", "nested-loop"],
    defaultInputs: { rows: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 5;
    for (int i = rows; i >= 1; i--) {
      for (int j = 1; j <= i; j++) {
        System.out.print("* ");
      }
      System.out.println();
    }
  }
}`,
  }),
  makeProgram({
    name: "Pyramid",
    category,
    subtype: "Pyramid",
    description: "Creates a centered star pyramid.",
    difficulty: "Beginner+",
    featured: true,
    tags: ["pattern", "demo-critical"],
    defaultInputs: { rows: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 5;
    for (int i = 1; i <= rows; i++) {
      for (int s = 1; s <= rows - i; s++) System.out.print(" ");
      for (int j = 1; j <= i; j++) System.out.print("* ");
      System.out.println();
    }
  }
}`,
  }),
  makeProgram({
    name: "Inverted pyramid",
    category,
    subtype: "Inverted pyramid",
    description: "Centered pattern with shrinking width.",
    tags: ["pattern", "nested-loop"],
    defaultInputs: { rows: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 5;
    for (int i = rows; i >= 1; i--) {
      for (int s = 1; s <= rows - i; s++) System.out.print(" ");
      for (int j = 1; j <= i; j++) System.out.print("* ");
      System.out.println();
    }
  }
}`,
  }),
  makeProgram({
    name: "Diamond pattern",
    category,
    subtype: "Diamond pattern",
    description: "Combines pyramid and inverted pyramid.",
    tags: ["pattern", "advanced-beginner"],
    difficulty: "Intermediate",
    defaultInputs: { rows: 4 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 4;
    for (int i = 1; i <= rows; i++) {
      for (int s = 1; s <= rows - i; s++) System.out.print(" ");
      for (int j = 1; j <= i; j++) System.out.print("* ");
      System.out.println();
    }
    for (int i = rows - 1; i >= 1; i--) {
      for (int s = 1; s <= rows - i; s++) System.out.print(" ");
      for (int j = 1; j <= i; j++) System.out.print("* ");
      System.out.println();
    }
  }
}`,
  }),
  makeProgram({
    name: "Number triangle",
    category,
    subtype: "Number triangle",
    description: "Uses numbers instead of stars.",
    tags: ["pattern", "numbers"],
    defaultInputs: { rows: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 5;
    for (int i = 1; i <= rows; i++) {
      for (int j = 1; j <= i; j++) {
        System.out.print(j + " ");
      }
      System.out.println();
    }
  }
}`,
  }),
  makeProgram({
    name: "Floyd’s triangle",
    category,
    subtype: "Floyd’s triangle",
    description: "Builds a sequential number triangle.",
    tags: ["pattern", "numbers"],
    defaultInputs: { rows: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 5, num = 1;
    for (int i = 1; i <= rows; i++) {
      for (int j = 1; j <= i; j++) {
        System.out.print(num++ + " ");
      }
      System.out.println();
    }
  }
}`,
  }),
  makeProgram({
    name: "Pascal’s triangle",
    category,
    subtype: "Pascal’s triangle",
    description: "Computes binomial coefficients row by row.",
    tags: ["pattern", "numbers"],
    difficulty: "Intermediate",
    defaultInputs: { rows: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 5;
    for (int i = 0; i < rows; i++) {
      int value = 1;
      for (int s = 1; s <= rows - i; s++) System.out.print(" ");
      for (int j = 0; j <= i; j++) {
        System.out.print(value + " ");
        value = value * (i - j) / (j + 1);
      }
      System.out.println();
    }
  }
}`,
  }),
  makeProgram({
    name: "Palindromic pyramid",
    category,
    subtype: "Palindromic pyramid",
    description: "Prints mirrored number sequences in pyramid form.",
    tags: ["pattern", "numbers"],
    difficulty: "Intermediate",
    defaultInputs: { rows: 5 },
    code: `public class Main {
  public static void main(String[] args) {
    int rows = 5;
    for (int i = 1; i <= rows; i++) {
      for (int s = 1; s <= rows - i; s++) System.out.print("  ");
      for (int j = i; j >= 1; j--) System.out.print(j + " ");
      for (int j = 2; j <= i; j++) System.out.print(j + " ");
      System.out.println();
    }
  }
}`,
  }),
];
