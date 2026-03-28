import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setFavorites(await api.listFavorites());
      } catch (error) {
        setMessage(error.message);
      }
    }

    load();
  }, []);

  async function handleDelete(id) {
    try {
      await api.deleteFavorite(id);
      setFavorites((current) => current.filter((favorite) => favorite._id !== id));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="panel">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Favorite sample programs</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Your curated beginner program library</h1>
        <div className="mt-6 grid gap-4">
          {favorites.map((favorite) => {
            const program = favorite.programId;
            return (
              <div key={favorite._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{program?.name || favorite.programMeta?.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {program?.category || favorite.programMeta?.category} · {program?.difficulty || favorite.programMeta?.difficulty}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {program && (
                      <Link to="/workspace" state={{ selectedProgram: program }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100">
                        Open in workspace
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(favorite._id)}
                      className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {favorites.length === 0 && <p className="text-sm text-slate-400">No favorite programs yet.</p>}
          {message && <p className="text-sm text-amber-100">{message}</p>}
        </div>
      </div>
    </main>
  );
}

export default FavoritesPage;
