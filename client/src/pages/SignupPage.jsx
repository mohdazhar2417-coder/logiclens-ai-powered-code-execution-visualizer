import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="panel">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Get started</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Create your student account</h1>
        <p className="mt-2 text-sm text-slate-300">Save traces, build favorites, and revisit visual walkthroughs anytime.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Name</span>
            <input
              className="input-base"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-300 hover:text-amber-200">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default SignupPage;
