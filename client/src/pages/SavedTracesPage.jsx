import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";

function SavedTracesPage() {
  const [traces, setTraces] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setTraces(await api.listTraces());
      } catch (error) {
        setMessage(error.message);
      }
    }

    load();
  }, []);

  async function handleDelete(id) {
    try {
      await api.deleteTrace(id);
      setTraces((current) => current.filter((trace) => trace._id !== id));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="panel">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Saved traces</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Your reusable execution walkthroughs</h1>
          </div>
          <Link to="/workspace" className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
            New trace
          </Link>
        </div>
        <div className="mt-6 grid gap-4">
          {traces.map((trace) => (
            <div key={trace._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{trace.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{trace.category} · {trace.subtype}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/workspace" state={{ reopenedTrace: trace }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100">
                    Reopen
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(trace._id)}
                    className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {traces.length === 0 && <p className="text-sm text-slate-400">No saved traces yet.</p>}
          {message && <p className="text-sm text-amber-100">{message}</p>}
        </div>
      </div>
    </main>
  );
}

export default SavedTracesPage;
