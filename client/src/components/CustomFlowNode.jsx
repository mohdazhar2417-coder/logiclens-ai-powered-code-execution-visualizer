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
      className={`min-w-[220px] rounded-3xl border bg-gradient-to-br p-4 shadow-[0_20px_60px_rgba(2,6,23,0.45)] ${tone} ${
        data.active ? "ring-2 ring-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.22)]" : ""
      } ${data.visited ? "opacity-100" : "opacity-80"}`}
    >
      <Handle type="target" position={Position.Top} className="!border-none !bg-amber-300" />
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-white">{data.label}</p>
          <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200">
            {data.kind}
          </span>
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
      <Handle type="source" position={Position.Bottom} className="!border-none !bg-cyan-300" />
    </div>
  );
}

export default CustomFlowNode;
