import { Menu, Sparkles } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm transition ${isActive ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:bg-white/10"}`
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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-white">LOGICLENS</p>
            <p className="text-xs text-slate-400">Powered by TraceWise AI</p>
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
              <div className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 sm:block">
                {user?.name} · {user?.role}
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 sm:block">
                Login
              </Link>
              <Link to="/signup" className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
                Start learning
              </Link>
            </>
          )}
          <button type="button" className="rounded-full border border-white/10 p-2 text-slate-300 lg:hidden">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
