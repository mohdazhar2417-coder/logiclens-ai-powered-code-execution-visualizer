export function explainStep(step, subtype) {
  const changedNames = Object.keys(step.changedVariables || {});
  const changedText = changedNames.length
    ? `${changedNames.join(", ")} changed in this moment.`
    : "No tracked variable changed in this step.";

  return {
    whatHappened: step.title,
    whyItHappened: step.branchReason || `${subtype} is following its current control-flow path.`,
    whatNext: step.next || "The tracer will move to the next executable statement.",
    commonMistake:
      step.commonMistake ||
      "Beginners often skip checking the updated variable values before predicting the next output.",
    changedText,
  };
}
