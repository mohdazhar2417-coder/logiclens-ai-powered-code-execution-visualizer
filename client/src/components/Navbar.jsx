import { Menu, Sparkles } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm transition ${
          isActive ? "bg-amber-400 text-slate-950 shadow-sm" : "text-slate-700 hover:bg-white/70"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-amber-900/10 bg-white/78 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-slate-900">LOGICLENS</p>
            <p className="text-xs text-slate-500">Powered by TraceWise AI</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <NavItem to="/">Home</NavItem>
          {isAuthenticated && <NavItem to="/dashboard">Dashboard</NavItem>}
          {isAuthenticated && <NavItem to="/workspace">Workspace</NavItem>}
          {isAuthenticated && <NavItem to="/traces">Saved Traces</NavItem>}
          {isAuthenticated && <NavItem to="/favorites">Favorites</NavItem>}
          {user?.role === "admin" && <NavItem to="/admin">Admin</NavItem>}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden rounded-full border border-amber-900/10 bg-white/70 px-4 py-2 text-sm text-slate-700 sm:block">
                {user?.name} · {user?.role}
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-full border border-amber-900/10 bg-white/65 px-4 py-2 text-sm text-slate-700 transition hover:bg-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-white/70 sm:block">
                Login
              </Link>
              <Link to="/signup" className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
                Start learning
              </Link>
            </>
          )}
          <button type="button" className="rounded-full border border-amber-900/10 bg-white/65 p-2 text-slate-700 lg:hidden">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
