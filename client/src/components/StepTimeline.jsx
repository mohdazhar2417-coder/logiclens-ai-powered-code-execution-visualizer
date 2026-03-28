function StepTimeline({ steps, currentStepIndex, onSelect }) {
  const total = steps?.length || 0;
  const currentStep = total ? steps[currentStepIndex] : null;

  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,234,255,0.5))] p-4 shadow-[0_14px_36px_rgba(143,105,65,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Execution timeline</p>
        <span className="text-sm text-slate-300">
          Step {total ? currentStepIndex + 1 : 0} / {total}
        </span>
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/55 px-4 py-3 text-sm text-slate-300">
        <p className="font-medium text-white">{currentStep?.title || "The current trace step will appear here."}</p>
        <p className="mt-1">
          {currentStep ? `Line ${currentStep.lineNumber} - ${currentStep.explanation}` : "Analyze code to unlock the live walkthrough."}
        </p>
      </div>

      <input
        type="range"
        min="0"
        max={Math.max(total - 1, 0)}
        value={Math.min(currentStepIndex, Math.max(total - 1, 0))}
        onChange={(event) => onSelect(Number(event.target.value))}
        disabled={!total}
        className="mt-4 w-full accent-orange-400"
      />

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {steps?.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`shrink-0 rounded-full px-3 py-2 text-xs transition ${
              index === currentStepIndex
                ? "bg-gradient-to-r from-amber-300 via-orange-300 to-violet-300 text-slate-950"
                : "bg-white/55 text-slate-300 hover:bg-white/85"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StepTimeline;
