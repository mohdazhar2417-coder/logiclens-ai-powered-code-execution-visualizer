function WhyOutputPanel({ summary }) {
  return (
    <div className="panel space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Why this output?</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{summary?.title || "Final explanation pending"}</h3>
      </div>
      <p className="text-sm text-slate-300">{summary?.explanation || "TraceWise AI will summarize the full run here."}</p>
    </div>
  );
}

export default WhyOutputPanel;
