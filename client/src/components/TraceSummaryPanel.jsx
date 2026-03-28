function TraceSummaryPanel({ detection, branchDecisions, loopIterationCounts }) {
  return (
    <div className="panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trace summary dashboard</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Support level</p>
          <p className="mt-2 text-xl font-semibold text-white">{detection?.supportLevel || "-"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Branch decisions</p>
          <p className="mt-2 text-xl font-semibold text-white">{branchDecisions?.length || 0}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Tracked loops</p>
          <p className="mt-2 text-xl font-semibold text-white">{Object.keys(loopIterationCounts || {}).length}</p>
        </div>
      </div>
    </div>
  );
}

export default TraceSummaryPanel;
