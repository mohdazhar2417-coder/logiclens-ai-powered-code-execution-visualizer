function StepTimeline({ steps, currentStepIndex, onSelect }) {
  const total = steps?.length || 0;

  return (
    <div className="panel space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Execution timeline</p>
        <span className="text-sm text-slate-300">
          Step {total ? currentStepIndex + 1 : 0} / {total}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max={Math.max(total - 1, 0)}
        value={Math.min(currentStepIndex, Math.max(total - 1, 0))}
        onChange={(event) => onSelect(Number(event.target.value))}
        disabled={!total}
        className="w-full accent-amber-400"
      />
      <div className="flex flex-wrap gap-2">
        {steps?.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`rounded-full px-3 py-2 text-xs transition ${
              index === currentStepIndex ? "bg-amber-400 text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"
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
