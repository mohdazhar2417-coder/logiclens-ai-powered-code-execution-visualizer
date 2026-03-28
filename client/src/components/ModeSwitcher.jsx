function ModeSwitcher({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {["learning", "demo"].map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            value === mode ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:text-white"
          }`}
        >
          {mode === "learning" ? "Learning Mode" : "Demo Mode"}
        </button>
      ))}
    </div>
  );
}

export default ModeSwitcher;
