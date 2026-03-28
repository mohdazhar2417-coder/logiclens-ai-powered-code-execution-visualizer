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
          <p><span className="font-semibold text-white">What happened:</span> {teacher.whatHappened}</p>
          <p><span className="font-semibold text-white">Why:</span> {teacher.whyItHappened}</p>
          <p><span className="font-semibold text-white">What next:</span> {teacher.whatNext}</p>
          <p><span className="font-semibold text-white">Common mistake:</span> {teacher.commonMistake}</p>
          <p><span className="font-semibold text-white">Variable signal:</span> {teacher.changedText}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Analyze a program to see teacher-mode explanations for each step.</p>
      )}
    </div>
  );
}

export default ExplanationPanel;
