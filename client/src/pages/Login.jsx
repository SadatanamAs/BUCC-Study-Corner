import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LockKeyhole, ShieldCheck, Sparkles, User2 } from 'lucide-react';

export default function Login({
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  mode,
  setMode,
  error,
  submitting,
}) {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const isAdmin = role === 'admin';

  return (
    <section className="mx-auto flex min-h-[78vh] max-w-7xl items-center justify-center px-5 py-20 sm:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
            // {isAdmin ? 'ADMIN ACCESS' : 'USER ACCESS'}
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            {isAdmin ? 'Admin sign in' : mode === 'register' ? 'Create your account' : 'User sign in'}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-slate-400">
            {isAdmin
              ? 'Log in as admin to publish and manage content across the BUCC Study Corner library. New admin accounts must be provisioned out-of-band by an existing administrator.'
              : mode === 'register'
              ? 'Register a learner account to access the dashboard and play videos directly inside the portal.'
              : 'Log in as a learner to access the public dashboard and play videos directly inside the portal.'}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold text-white">Secure experience</p>
              <p className="mt-1 text-sm text-slate-400">JWT-based auth keeps admin actions separate from learners.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold text-white">Instant access</p>
              <p className="mt-1 text-sm text-slate-400">Enter your credentials and continue into your assigned workspace.</p>
            </div>
          </div>

          {!isAdmin ? (
            <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-200"
              >
                {mode === 'login' ? 'Need an account? Register' : 'Already registered? Sign in'}
              </button>
            </div>
          ) : null}
        </div>

        <div className="glass-panel p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              {isAdmin ? <LockKeyhole className="h-5 w-5" /> : <User2 className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isAdmin ? 'Enter your details' : mode === 'register' ? 'Create your account' : 'Enter your details'}
              </h2>
              <p className="text-sm text-slate-400">
                Role: {isAdmin ? 'Admin' : 'User'} portal — {mode === 'register' ? 'Registration' : 'Sign in'}
              </p>
            </div>
          </div>

          <form onSubmit={(event) => onSubmit(event, role)} className="mt-8 space-y-4">
            {mode === 'register' && !isAdmin ? (
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                required
              />
            ) : null}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={isAdmin ? 'admin@bucc.com' : 'your.email@example.com'}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              required
              minLength={6}
            />
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Working…' : isAdmin ? `Continue as admin` : mode === 'register' ? 'Create account' : 'Continue as user'}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            By {mode === 'register' ? 'registering' : 'signing in'} you agree to use this portal for learning purposes only.
          </p>
          {!isAdmin ? (
            <p className="mt-2 text-xs text-slate-500">
              Looking for the admin portal?{' '}
              <Link to="/login?role=admin" className="text-cyan-300 hover:text-cyan-200">
                Sign in here
              </Link>
              .
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}