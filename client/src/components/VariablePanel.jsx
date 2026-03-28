function VariablePanel({ currentStep, simulationState }) {
  const variables = currentStep?.variables || simulationState?.variables || {};
  const changed = currentStep?.changedVariables || {};

  return (
    <div className="panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Variable tracker</p>
      <div className="mt-4 space-y-3">
        {Object.keys(variables).length === 0 ? (
          <p className="text-sm text-slate-400">Variables will appear here as the trace begins.</p>
        ) : (
          Object.entries(variables).map(([name, value]) => (
            <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <div>
                <p className="font-mono text-sm text-slate-200">{name}</p>
                <p className="text-xs text-slate-500">{name in changed ? "changed this step" : "unchanged"}</p>
              </div>
              <span className={`rounded-full px-3 py-1 font-mono text-sm ${name in changed ? "bg-amber-400/15 text-amber-100" : "bg-white/5 text-slate-200"}`}>
                {String(value)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VariablePanel;
