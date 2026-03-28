function NodeDetailsDrawer({ node, step }) {
  return (
    <div className="panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Node detail drawer</p>
      <div className="mt-4 space-y-3 text-sm text-slate-300">
        <div>
          <p className="text-white">{node?.data?.label || "Select a flow node"}</p>
          <p className="text-slate-500">{node?.data?.description || "Click any node in the canvas to inspect it."}</p>
        </div>
        {step && (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/55 p-4">
                <p><span className="font-semibold text-white">Line:</span> {step.lineNumber}</p>
                <p className="mt-2"><span className="font-semibold text-white">Step:</span> {step.stepIndex + 1}</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.08),rgba(196,181,253,0.18))] p-4">
                <p><span className="font-semibold text-white">Reason:</span> {step.branchReason || "Sequential execution."}</p>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/55 p-4">
                <p className="font-semibold text-white">Before</p>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-slate-300">
                  {JSON.stringify(step.previousVariables || {}, null, 2)}
                </pre>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/55 p-4">
                <p className="font-semibold text-white">After</p>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-slate-300">
                  {JSON.stringify(step.variables || {}, null, 2)}
                </pre>
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/55 p-4">
              <p><span className="font-semibold text-white">Next step:</span> {step.next || "Continue execution."}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NodeDetailsDrawer;
