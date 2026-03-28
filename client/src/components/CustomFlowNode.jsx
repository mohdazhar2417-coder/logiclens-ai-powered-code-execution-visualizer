import { Handle, Position } from "@xyflow/react";

const kindClasses = {
  start: "from-cyan-400/30 to-cyan-500/10 border-cyan-300/40",
  end: "from-rose-400/25 to-rose-500/10 border-rose-300/30",
  decision: "from-amber-400/25 to-orange-400/10 border-amber-200/40",
  output: "from-emerald-400/20 to-emerald-500/10 border-emerald-200/30",
  input: "from-sky-400/20 to-sky-500/10 border-sky-200/30",
  loop: "from-violet-400/20 to-violet-500/10 border-violet-200/30",
  process: "from-white/10 to-white/5 border-white/15",
  declaration: "from-indigo-400/20 to-indigo-500/10 border-indigo-200/30",
  assignment: "from-fuchsia-400/20 to-fuchsia-500/10 border-fuchsia-200/30",
};

function CustomFlowNode({ data }) {
  const tone = kindClasses[data.kind] || kindClasses.process;

  return (
    <div
      className={`min-w-[220px] rounded-3xl border bg-gradient-to-br p-4 shadow-[0_20px_60px_rgba(2,6,23,0.18)] transition-all duration-200 ${tone} ${
        data.active
          ? "scale-[1.03] border-orange-400 bg-[linear-gradient(135deg,rgba(251,191,36,0.32),rgba(196,181,253,0.34))] ring-4 ring-orange-300/80 shadow-[0_0_0_6px_rgba(255,255,255,0.9),0_0_42px_rgba(249,115,22,0.55),0_0_72px_rgba(167,139,250,0.35)]"
          : ""
      } ${data.visited ? "opacity-100" : "opacity-72"}`}
    >
      <Handle type="target" position={Position.Top} className="!border-none !bg-orange-400" />
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-white">{data.label}</p>
          <div className="flex items-center gap-2">
            {data.active && (
              <span className="rounded-full bg-orange-400 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-950">
                Live
              </span>
            )}
            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200">
              {data.kind}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300">{data.description}</p>
        {data.variableChips?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.variableChips.map((chip) => (
              <span key={chip} className="rounded-full bg-slate-950/60 px-2 py-1 text-xs text-slate-200">
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!border-none !bg-violet-400" />
    </div>
  );
}

export default CustomFlowNode;
