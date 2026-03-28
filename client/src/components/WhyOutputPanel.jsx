function WhyOutputPanel({ summary }) {
  return (
    <div className="panel space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Why this output?</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{summary?.title || "Final explanation pending"}</h3>
      </div>
      <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.08),rgba(196,181,253,0.18))] p-4">
        <p className="text-sm text-slate-300">{summary?.explanation || "TraceWise AI will summarize the full run here."}</p>
      </div>
    </div>
  );
}

export default WhyOutputPanel;
