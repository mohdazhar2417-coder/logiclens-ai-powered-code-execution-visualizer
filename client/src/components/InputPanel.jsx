function InputPanel({ inputs, onChange }) {
  const keys = Object.keys(inputs || {});

  return (
    <div className="panel space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Custom inputs</p>
        <h3 className="mt-1 text-lg font-semibold text-white">Retest the same logic with new values</h3>
      </div>
      {keys.length === 0 ? (
        <p className="text-sm text-slate-400">No input placeholders detected yet. Load a sample program to get guided inputs.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {keys.map((key) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm font-medium capitalize text-slate-300">{key}</span>
              <input
                value={inputs[key]}
                onChange={(event) => onChange(key, event.target.value)}
                className="input-base"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default InputPanel;
