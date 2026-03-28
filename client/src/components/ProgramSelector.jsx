function ProgramSelector({ programs, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sample program</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-base"
      >
        <option value="">Choose a guided sample</option>
        {programs.map((program) => (
          <option key={program._id || program.subtype} value={program._id || program.subtype}>
            {program.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ProgramSelector;
