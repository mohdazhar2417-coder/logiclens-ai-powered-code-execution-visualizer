import { categories } from "../data/samplePrograms.js";

function CategorySelector({ value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Learning category</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-base"
      >
        <option value="All">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}

export default CategorySelector;
