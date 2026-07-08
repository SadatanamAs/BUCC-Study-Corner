import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState(getSession());
  const navigate = useNavigate();

  const handleSubmit = async (event, userRole) => {
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
      // Admin accounts can ONLY be created via the backend's
      // /api/auth/upgrade-admin bootstrap endpoint (gated by
      // ADMIN_BOOTSTRAP_TOKEN). Public registration always creates
      // a regular user. So when the user clicks "Continue as admin"
      // we still call /login — if their account has role='admin'
      // they're let in, otherwise we show an error.
      const fn = mode === 'register' ? registerWithBackend : loginWithBackend;
      const payload =
        mode === 'register'
          ? { name, email, password }
          : { email, password };
      const result = await fn(payload);

      // If the user clicked "Continue as admin" but their role isn't admin,
      // refuse entry — this is the gate that prevents privilege escalation.
      if (userRole === 'admin' && result.user.role !== 'admin') {
        clearSession();
        setError(
          'This account does not have administrator privileges. Contact an existing admin to be promoted.'
        );
        return;
      }

      setSession(getSession());
      navigate(userRole === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
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
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
