import { detectCategory } from "../detect/detectCategory.js";
import { detectSubtype } from "../detect/detectSubtype.js";
import { extractStatements } from "./extractStatements.js";

export function normalizeProgram(code = "", customInputs = {}) {
  return {
    category: detectCategory(code),
    subtype: detectSubtype(code),
    statements: extractStatements(code),
    customInputs,
  };
}
