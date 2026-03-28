function DetectionCard({ detection }) {
  if (!detection) {
    return (
      <div className="panel">
        <p className="text-sm text-slate-400">TraceWise AI will classify your Java program after analysis.</p>
      </div>
    );
  }

  const tone =
    detection.supportLevel === "supported"
      ? "bg-emerald-400/15 text-emerald-200"
      : detection.supportLevel === "partial"
        ? "bg-amber-400/15 text-amber-100"
        : "bg-rose-400/15 text-rose-100";

  return (
    <div className="panel space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Detected learning path</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{detection.subtype}</h3>
          <p className="text-sm text-slate-300">{detection.category}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{detection.supportLevel}</span>
      </div>
      {detection.reasons?.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-300">
          {detection.reasons.join(" ")}
        </div>
      )}
    </div>
  );
}

export default DetectionCard;
