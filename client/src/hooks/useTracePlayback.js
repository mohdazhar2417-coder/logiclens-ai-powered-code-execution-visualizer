import { useEffect } from "react";

export function useTracePlayback({ enabled, stepCount, currentStepIndex, onAdvance, delay = 1200 }) {
  useEffect(() => {
    if (!enabled || stepCount === 0 || currentStepIndex >= stepCount - 1) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onAdvance();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [enabled, stepCount, currentStepIndex, onAdvance, delay]);
}
