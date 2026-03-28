import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="panel">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Log in to your learning dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">Use your student or admin account to continue tracing beginner Java programs.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
            <input
              type="email"
              className="input-base"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
            <input
              type="password"
              className="input-base"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </label>
          {error && <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          New to LogicLens?{" "}
          <Link to="/signup" className="text-amber-300 hover:text-amber-200">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
