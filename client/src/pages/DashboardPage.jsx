import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

function DashboardPage() {
  const { user, updateProfile } = useAuth();
  const [profileName, setProfileName] = useState(user?.name || "");
  const [traces, setTraces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [traceData, favoriteData, programData] = await Promise.all([
          api.listTraces(),
          api.listFavorites(),
          api.listPrograms(),
        ]);
        setTraces(traceData);
        setFavorites(favoriteData);
        setPrograms(programData);
      } catch {
        setMessage("Dashboard data could not be loaded right now.");
      }
    }

    load();
  }, []);

  async function handleProfileSave(event) {
    event.preventDefault();
    try {
      await updateProfile({ name: profileName });
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6">
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Student dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Keep building intuition, not just syntax memory.</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Jump back into the workspace, reopen earlier traces, or pick a featured program to explore how loops,
              branches, and outputs evolve one step at a time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/workspace" className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
                Open trace workspace
              </Link>
              <Link to="/traces" className="rounded-full border border-white/10 px-5 py-3 font-semibold text-slate-100">
                View saved traces
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="panel">
              <p className="text-sm text-slate-400">Saved traces</p>
              <p className="mt-2 text-3xl font-semibold text-white">{traces.length}</p>
            </div>
            <div className="panel">
              <p className="text-sm text-slate-400">Favorites</p>
              <p className="mt-2 text-3xl font-semibold text-white">{favorites.length}</p>
            </div>
            <div className="panel">
              <p className="text-sm text-slate-400">Sample library</p>
              <p className="mt-2 text-3xl font-semibold text-white">{programs.length}</p>
            </div>
          </div>
          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Recent traces</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Pick up where you left off</h2>
              </div>
              <Link to="/traces" className="text-sm text-amber-300">See all</Link>
            </div>
            <div className="mt-4 grid gap-3">
              {traces.slice(0, 4).map((trace) => (
                <Link key={trace._id} to="/workspace" state={{ reopenedTrace: trace }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/10">
                  <p className="font-semibold text-white">{trace.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{trace.category} · {trace.subtype}</p>
                </Link>
              ))}
              {traces.length === 0 && <p className="text-sm text-slate-400">No saved traces yet. Your first one will appear here.</p>}
            </div>
          </div>
        </section>
        <aside className="space-y-6">
          <form onSubmit={handleProfileSave} className="panel space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Profile</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Edit basics</h2>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Display name</span>
              <input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="input-base" />
            </label>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              {user?.email}
            </div>
            <button type="submit" className="rounded-full bg-white/10 px-4 py-3 font-semibold text-white">
              Save profile
            </button>
            {message && <p className="text-sm text-amber-100">{message}</p>}
          </form>
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quick categories</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Basic Math", "Conditionals", "Loops", "Number Logic", "Patterns"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default DashboardPage;
