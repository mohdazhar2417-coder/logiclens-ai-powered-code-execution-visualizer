export function makeProgram({
  name,
  category,
  subtype,
  description,
  difficulty = "Beginner",
  featured = false,
  tags = [],
  defaultInputs = {},
  code,
}) {
  return {
    name,
    category,
    subtype,
    description,
    difficulty,
    supported: true,
    featured,
    tags,
    defaultInputs,
    code,
  };
}
