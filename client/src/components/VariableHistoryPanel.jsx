function VariableHistoryPanel({ history }) {
  return (
    <div className="panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Variable history timeline</p>
      <div className="mt-4 max-h-64 space-y-3 overflow-auto pr-1">
        {history?.length ? (
          history.map((entry) => (
            <div key={`history-${entry.stepIndex ?? entry.lineNumber}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Step {entry.stepIndex + 1 || entry.lineNumber}</p>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-slate-300">
                {JSON.stringify(entry.variables, null, 2)}
              </pre>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No history yet.</p>
        )}
      </div>
    </div>
  );
}

export default VariableHistoryPanel;
