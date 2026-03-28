import { useMemo, useState } from "react";

function CodeEditor({ code, onChange, activeLine }) {
  const [view, setView] = useState("editor");
  const lines = useMemo(() => code.split("\n"), [code]);
  const activeLineText = activeLine ? lines[activeLine - 1] : "";

  return (
    <div className="panel flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sample Java code</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Edit the program, then trace how it executes</h3>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/50 p-1">
          {[
            { key: "editor", label: "Editor" },
            { key: "trace", label: "Execution map" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setView(tab.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                view === tab.key
                  ? "bg-gradient-to-r from-amber-300 via-orange-300 to-violet-300 text-slate-950"
                  : "text-slate-300 hover:bg-white/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.08),rgba(196,181,253,0.18))] px-4 py-3 text-sm">
        <span className="rounded-full bg-white/70 px-3 py-1 font-medium text-slate-300">
          Active line {activeLine || "-"}
        </span>
        <span className="text-slate-300">
          {activeLineText ? `Now executing: ${activeLineText.trim() || "(blank line)"}` : "Analyze a program to sync the code with the trace."}
        </span>
      </div>

      {view === "editor" ? (
        <textarea
          value={code}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[360px] w-full rounded-[1.8rem] border border-white/10 bg-slate-950/70 p-5 font-mono text-sm text-slate-100 outline-none transition focus:border-amber-300"
          placeholder="Paste beginner Java code here..."
        />
      ) : (
        <div className="max-h-[460px] overflow-auto rounded-[1.8rem] border border-white/10 bg-slate-950/70">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isActive = activeLine === lineNumber;
            return (
              <div
                key={`${lineNumber}-${line}`}
                className={`grid grid-cols-[56px_1fr] gap-4 border-b border-white/5 px-4 py-2.5 font-mono text-sm ${
                  isActive
                    ? "bg-[linear-gradient(90deg,rgba(251,191,36,0.14),rgba(196,181,253,0.24))] text-white"
                    : "text-slate-300"
                }`}
              >
                <span className="text-right text-slate-500">{lineNumber}</span>
                <span className="whitespace-pre-wrap">{line || " "}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
