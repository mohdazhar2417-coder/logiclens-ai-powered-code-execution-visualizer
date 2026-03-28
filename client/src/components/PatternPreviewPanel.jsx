function PatternPreviewPanel({ output }) {
  const lines = output ? output.split("\n") : [];

  return (
    <div className="panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pattern preview</p>
      <div className="mt-4 min-h-[180px] rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 font-mono text-sm text-amber-100">
        {lines.length ? lines.map((line, index) => <div key={`${line}-${index}`}>{line}</div>) : "Pattern rows appear here as the trace runs."}
      </div>
    </div>
  );
}

export default PatternPreviewPanel;
