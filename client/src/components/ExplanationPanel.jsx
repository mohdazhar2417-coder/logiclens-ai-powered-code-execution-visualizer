function ExplanationPanel({ step }) {
  const teacher = step?.teacherMode;

  return (
    <div className="panel space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Teacher mode</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{step?.title || "Step explanations will appear here"}</h3>
      </div>
      {teacher ? (
        <div className="space-y-3 text-sm text-slate-300">
          <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.08),rgba(196,181,253,0.18))] p-4">
            <p><span className="font-semibold text-white">What happened:</span> {teacher.whatHappened}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/55 p-4">
            <p><span className="font-semibold text-white">Why:</span> {teacher.whyItHappened}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/55 p-4">
            <p><span className="font-semibold text-white">What next:</span> {teacher.whatNext}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/55 p-4">
              <p><span className="font-semibold text-white">Common mistake:</span> {teacher.commonMistake}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/55 p-4">
              <p><span className="font-semibold text-white">Variable signal:</span> {teacher.changedText}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Analyze a program to see teacher-mode explanations for each step.</p>
      )}
    </div>
  );
}

export default ExplanationPanel;
