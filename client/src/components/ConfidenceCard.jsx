function ConfidenceCard({ detection }) {
  const value = detection?.confidence || 0;

  return (
    <div className="panel space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Confidence</p>
        <span className="text-xl font-semibold text-white">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-cyan-300"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-sm text-slate-300">
        Confidence reflects how strongly the tracer matched your code to a supported beginner Java pattern.
      </p>
    </div>
  );
}

export default ConfidenceCard;
