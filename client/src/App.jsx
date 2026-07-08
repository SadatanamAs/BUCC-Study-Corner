import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Course from './pages/Course.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import {
  clearSession,
  getSession,
  loginWithBackend,
  registerWithBackend,
} from './lib/auth.js';

function ProtectedRoute({ children, role }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && session.user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'user' && !['user', 'admin'].includes(session.user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Place this in a build-time env var (Vercel: VITE_ADMIN_BOOTSTRAP_KEY) when
// the deployment is for internal BUCC use. Leaving it unset disables the UI
// admin bootstrap — admins must register via curl with the matching token.
const BOOTSTRAP_KEY = import.meta.env?.VITE_ADMIN_BOOTSTRAP_KEY || '';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState(getSession());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Landing links visit `/login?role=admin` and `/login?role=user`. Default to 'user'.
  const desiredRole = searchParams.get('role') === 'admin' ? 'admin' : 'user';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !name) {
      setError('Please enter your name.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'register') {
        // Admin bootstrap key precedence:
        //   1. The form field the user typed on the admin register screen
        //      (lets operators paste a key without rebuilding the bundle).
        //   2. VITE_ADMIN_BOOTSTRAP_KEY baked in at build time, when set.
        // If neither is provided on the admin register path, the server
        // silently creates a regular user — we detect that below and tell
        // the user instead of sending them to /admin as a non-admin.
        const form = event.target;
        const typedKey = form?.elements?.superSecretKey?.value?.trim();
        let superSecretKey;
        if (desiredRole === 'admin') {
          superSecretKey = typedKey || BOOTSTRAP_KEY || undefined;
        }

        const result = await registerWithBackend({ name, email, password, superSecretKey });

        if (desiredRole === 'admin' && result.user.role !== 'admin') {
          clearSession();
          setError(
            'This account was created as a regular user. The admin bootstrap key is not configured for this deployment — paste the secret key on the register form, or contact an existing admin.'
          );
          return;
        }

        setSession(getSession());
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
        return;
      }

      // Login flow.
      const result = await loginWithBackend({ email, password });

      // Gate the admin workspace: a regular user who follows the "Continue as
      // admin" link just gets refused and lands on /dashboard.
      if (desiredRole === 'admin' && result.user.role !== 'admin') {
        setSession(getSession());
        navigate('/dashboard');
        return;
      }

      setSession(getSession());
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    // Clear form state so the next visitor doesn't see the previous user's
    // email pre-filled in plaintext.
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar session={session} onLogout={handleLogout} />
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/course/:id" element={<Course />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <Login
                onSubmit={handleSubmit}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                name={name}
                setName={setName}
                mode={mode}
                setMode={setMode}
                error={error}
                submitting={submitting}
                desiredRole={desiredRole}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
