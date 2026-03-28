function readValue(source, key) {
  return source ? source[key] : undefined;
}

export function validateRequest(rules) {
  return (req, res, next) => {
    const errors = [];

    rules.forEach((rule) => {
      const value = readValue(req[rule.in || "body"], rule.field);

      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push(rule.message || `${rule.field} is required.`);
        return;
      }

      if (value === undefined || value === null) {
        return;
      }

      if (rule.type === "string" && typeof value !== "string") {
        errors.push(rule.message || `${rule.field} must be a string.`);
      }

      if (rule.type === "object" && (typeof value !== "object" || Array.isArray(value))) {
        errors.push(rule.message || `${rule.field} must be an object.`);
      }

      if (rule.type === "boolean" && typeof value !== "boolean") {
        errors.push(rule.message || `${rule.field} must be a boolean.`);
      }

      if (rule.minLength && typeof value === "string" && value.trim().length < rule.minLength) {
        errors.push(rule.message || `${rule.field} must be at least ${rule.minLength} characters.`);
      }
    });

    if (errors.length) {
      return res.status(400).json({
        message: errors[0],
        errors,
      });
    }

    next();
  };
}
