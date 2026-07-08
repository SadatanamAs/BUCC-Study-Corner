import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Sparkles, LogOut } from 'lucide-react';

export default function Navbar({ session, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const linkBase = 'text-sm font-medium tracking-wide transition-colors duration-200';
  const linkActive = 'text-cyan-300';
  const linkInactive = 'text-slate-400 hover:text-cyan-200';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-500 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-slate-100">BUCC</p>
              <p className="text-xs text-slate-400">Study Corner</p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {!session ? (
              <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
                Home
              </NavLink>
            ) : null}
            {session ? (
              <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
                Dashboard
              </NavLink>
            ) : null}
            {session?.user?.role === 'admin' ? (
              <NavLink to="/admin" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
                Admin
              </NavLink>
            ) : null}

            {session ? (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-rose-400/40 hover:text-rose-300 hover:bg-white/10 glow-hover"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link to="/login" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20 glow-hover">
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-4 border-t border-white/10 py-5">
            {!session ? (
              <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
                Home
              </NavLink>
            ) : null}
            {session ? (
              <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
                Dashboard
              </NavLink>
            ) : null}
            {session?.user?.role === 'admin' ? (
              <NavLink to="/admin" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
                Admin
              </NavLink>
            ) : null}

            {session ? (
              <button onClick={onLogout} className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-rose-400/40 hover:text-rose-300 hover:bg-white/10 glow-hover">
                Logout
              </button>
            ) : (
              <Link to="/login" className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20 glow-hover">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}