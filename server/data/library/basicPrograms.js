import { makeProgram } from "./helpers.js";

const category = "Basic Input / Output & Math";

export const basicPrograms = [
  makeProgram({
    name: "Hello World",
    category,
    subtype: "Hello World",
    description: "The first printing program for beginners.",
    tags: ["intro", "output"],
    code: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,
  }),
  makeProgram({
    name: "Addition of 2 numbers",
    category,
    subtype: "Addition of 2 numbers",
    description: "Adds two beginner-friendly integer values.",
    tags: ["math", "variables"],
    defaultInputs: { a: 8, b: 4 },
    code: `public class Main {
  public static void main(String[] args) {
    int a = 8;
    int b = 4;
    int sum = a + b;
    System.out.println("Sum = " + sum);
  }
}`,
  }),
  makeProgram({
    name: "Addition of 3 numbers",
    category,
    subtype: "Addition of 3 numbers",
    description: "Shows how to add three values and print the result.",
    tags: ["math", "variables"],
    defaultInputs: { a: 5, b: 7, c: 9 },
    code: `public class Main {
  public static void main(String[] args) {
    int a = 5, b = 7, c = 9;
    int sum = a + b + c;
    System.out.println("Sum = " + sum);
  }
}`,
  }),
  makeProgram({
    name: "Swap two numbers using temp",
    category,
    subtype: "Swap two numbers using temp",
    description: "Introduces the temporary variable swap pattern.",
    tags: ["swap", "variables"],
    defaultInputs: { a: 10, b: 20 },
    code: `public class Main {
  public static void main(String[] args) {
    int a = 10, b = 20;
    int temp = a;
    a = b;
    b = temp;
    System.out.println(a + " " + b);
  }
}`,
  }),
  makeProgram({
    name: "Swap without temp",
    category,
    subtype: "Swap without temp",
    description: "Shows arithmetic swapping without an extra variable.",
    tags: ["swap", "arithmetic"],
    defaultInputs: { a: 10, b: 20 },
    code: `public class Main {
  public static void main(String[] args) {
    int a = 10, b = 20;
    a = a + b;
    b = a - b;
    a = a - b;
    System.out.println(a + " " + b);
  }
}`,
  }),
  makeProgram({
    name: "Area of circle",
    category,
    subtype: "Area of circle",
    description: "Computes area using pi * r * r.",
    tags: ["geometry", "formula"],
    defaultInputs: { radius: 7 },
    code: `public class Main {
  public static void main(String[] args) {
    double radius = 7;
    double area = 3.14 * radius * radius;
    System.out.println("Area = " + area);
  }
}`,
  }),
  makeProgram({
    name: "Area of rectangle",
    category,
    subtype: "Area of rectangle",
    description: "Simple multiplication formula example.",
    tags: ["geometry", "formula"],
    defaultInputs: { length: 8, breadth: 4 },
    code: `public class Main {
  public static void main(String[] args) {
    int length = 8, breadth = 4;
    int area = length * breadth;
    System.out.println("Area = " + area);
  }
}`,
  }),
  makeProgram({
    name: "Simple interest",
    category,
    subtype: "Simple interest",
    description: "Uses the classic SI formula.",
    tags: ["finance", "formula"],
    defaultInputs: { p: 1000, r: 5, t: 2 },
    code: `public class Main {
  public static void main(String[] args) {
    double p = 1000, r = 5, t = 2;
    double si = (p * r * t) / 100;
    System.out.println("Simple Interest = " + si);
  }
}`,
  }),
  makeProgram({
    name: "Celsius to Fahrenheit",
    category,
    subtype: "Celsius to Fahrenheit",
    description: "Temperature conversion example.",
    tags: ["conversion", "math"],
    defaultInputs: { celsius: 25 },
    code: `public class Main {
  public static void main(String[] args) {
    double celsius = 25;
    double fahrenheit = (celsius * 9 / 5) + 32;
    System.out.println(fahrenheit);
  }
}`,
  }),
  makeProgram({
    name: "Fahrenheit to Celsius",
    category,
    subtype: "Fahrenheit to Celsius",
    description: "Reverse temperature conversion.",
    tags: ["conversion", "math"],
    defaultInputs: { fahrenheit: 86 },
    code: `public class Main {
  public static void main(String[] args) {
    double fahrenheit = 86;
    double celsius = (fahrenheit - 32) * 5 / 9;
    System.out.println(celsius);
  }
}`,
  }),
  makeProgram({
    name: "Square and cube of number",
    category,
    subtype: "Square and cube of number",
    description: "Shows repeated multiplication.",
    tags: ["math", "power"],
    defaultInputs: { num: 4 },
    code: `public class Main {
  public static void main(String[] args) {
    int num = 4;
    int square = num * num;
    int cube = num * num * num;
    System.out.println(square);
    System.out.println(cube);
  }
}`,
  }),
  makeProgram({
    name: "Average of numbers",
    category,
    subtype: "Average of numbers",
    description: "Averages three numbers.",
    tags: ["math", "average"],
    defaultInputs: { a: 6, b: 8, c: 10 },
    code: `public class Main {
  public static void main(String[] args) {
    double a = 6, b = 8, c = 10;
    double avg = (a + b + c) / 3;
    System.out.println("Average = " + avg);
  }
}`,
  }),
  makeProgram({
    name: "Simple calculator using switch case",
    category,
    subtype: "Simple calculator using switch case",
    description: "Demonstrates branching with switch.",
    tags: ["switch", "calculator"],
    defaultInputs: { a: 10, b: 5, op: "+" },
    code: `public class Main {
  public static void main(String[] args) {
    int a = 10, b = 5;
    char op = '+';
    switch(op) {
      case '+': System.out.println(a + b); break;
      case '-': System.out.println(a - b); break;
      case '*': System.out.println(a * b); break;
      default: System.out.println(a / b);
    }
  }
}`,
  }),
];
