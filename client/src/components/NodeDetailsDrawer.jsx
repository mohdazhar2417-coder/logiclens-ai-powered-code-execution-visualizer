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
            <p><span className="font-semibold text-white">Line:</span> {step.lineNumber}</p>
            <p><span className="font-semibold text-white">Step:</span> {step.stepIndex + 1}</p>
            <p><span className="font-semibold text-white">Reason:</span> {step.branchReason || "Sequential execution."}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default NodeDetailsDrawer;
