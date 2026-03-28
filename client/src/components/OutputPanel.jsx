function OutputPanel({ output }) {
  return (
    <div className="panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Live output builder</p>
      <div className="mt-4 min-h-[180px] rounded-3xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm text-emerald-200">
        <pre className="whitespace-pre-wrap">{output || "Run a trace to build output step by step."}</pre>
      </div>
    </div>
  );
}

export default OutputPanel;
