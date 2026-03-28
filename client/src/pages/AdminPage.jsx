import { useEffect, useState } from "react";
import { api } from "../services/api.js";

const emptyProgram = {
  name: "",
  category: "Conditionals",
  subtype: "",
  code: "",
  description: "",
  difficulty: "Beginner",
  supported: true,
  featured: false,
  tags: [],
  defaultInputs: {},
};

function AdminPage() {
  const [programs, setPrograms] = useState([]);
  const [overview, setOverview] = useState(null);
  const [draft, setDraft] = useState(emptyProgram);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await api.adminPrograms();
        setPrograms(response.programs);
        setOverview(response.overview);
      } catch (error) {
        setMessage(error.message);
      }
    }

    load();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const payload = {
        ...draft,
        tags: typeof draft.tags === "string" ? draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : draft.tags,
      };

      const program = editingId ? await api.updateProgram(editingId, payload) : await api.createProgram(payload);

      setPrograms((current) => {
        if (editingId) {
          return current.map((item) => (item._id === editingId ? program : item));
        }
        return [program, ...current];
      });
      setDraft(emptyProgram);
      setEditingId(null);
      setMessage(editingId ? "Program updated." : "Program created.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteProgram(id);
      setPrograms((current) => current.filter((program) => program._id !== id));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-6">
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admin overview</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Manage the sample program experience</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Users</p>
                <p className="mt-2 text-2xl font-semibold text-white">{overview?.totalUsers ?? "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Traces</p>
                <p className="mt-2 text-2xl font-semibold text-white">{overview?.totalTraces ?? "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Featured</p>
                <p className="mt-2 text-2xl font-semibold text-white">{overview?.featuredPrograms ?? "-"}</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="panel space-y-4">
            <h2 className="text-xl font-semibold text-white">{editingId ? "Edit program" : "Create program"}</h2>
            <input className="input-base" placeholder="Program name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            <input className="input-base" placeholder="Subtype" value={draft.subtype} onChange={(event) => setDraft((current) => ({ ...current, subtype: event.target.value }))} />
            <input className="input-base" placeholder="Category" value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} />
            <input className="input-base" placeholder="Difficulty" value={draft.difficulty} onChange={(event) => setDraft((current) => ({ ...current, difficulty: event.target.value }))} />
            <input className="input-base" placeholder="Tags (comma separated)" value={Array.isArray(draft.tags) ? draft.tags.join(", ") : draft.tags} onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))} />
            <textarea className="input-base min-h-28" placeholder="Description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
            <textarea className="input-base min-h-48 font-mono" placeholder="Java code" value={draft.code} onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))} />
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
                {editingId ? "Update program" : "Create program"}
              </button>
              <button type="button" onClick={() => { setDraft(emptyProgram); setEditingId(null); }} className="rounded-full border border-white/10 px-5 py-3 font-semibold text-slate-100">
                Reset
              </button>
            </div>
            {message && <p className="text-sm text-amber-100">{message}</p>}
          </form>
        </section>

        <section className="panel">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sample library management</p>
          <div className="mt-6 grid gap-4">
            {programs.map((program) => (
              <div key={program._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{program.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{program.category} · {program.subtype}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(program._id);
                        setDraft({ ...program, tags: program.tags || [] });
                      }}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(program._id)}
                      className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminPage;
