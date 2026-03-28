function CodeEditor({ code, onChange, activeLine }) {
  const lines = code.split("\n");

  return (
    <div className="panel flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Java editor</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Paste code or load a sample</h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
          Active line {activeLine || "-"}
        </span>
      </div>
      <textarea
        value={code}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[240px] w-full rounded-3xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm text-slate-100 outline-none transition focus:border-amber-300"
        placeholder="Paste beginner Java code here..."
      />
      <div className="overflow-auto rounded-3xl border border-white/10 bg-slate-950/70">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLine === lineNumber;
          return (
            <div
              key={`${lineNumber}-${line}`}
              className={`grid grid-cols-[52px_1fr] gap-4 border-b border-white/5 px-4 py-2 font-mono text-sm ${
                isActive ? "bg-amber-400/12 text-white" : "text-slate-300"
              }`}
            >
              <span className="text-right text-slate-500">{lineNumber}</span>
              <span className="whitespace-pre-wrap">{line || " "}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CodeEditor;
