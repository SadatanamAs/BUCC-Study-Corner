import React from 'react';
import { ArrowLeft, KeyRound, Mail, ShieldCheck, User2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = ({
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
  desiredRole = 'user',
}) => {
  const navigate = useNavigate();
  const isAdminEntry = desiredRole === 'admin';

  const handleSubmit = (e) => {
    if (onSubmit) {
      // Pass the form event to the parent; the parent reads `superSecretKey`
      // from the form element when present. Keeping this a passthrough avoids
      // threading yet another prop through the Login component.
      onSubmit(e);
      return;
    }
    e.preventDefault();
    navigate('/dashboard');
  };

  // Per-role chrome. Keeping these as objects makes the admin vs learner
  // branches below readable; previously the same admin styling leaked into
  // both modes, so the user-facing copy/icon/footer were wrong for learners.
  const theme = isAdminEntry
    ? {
        accent: '#7c83fd',
        accent2: '#fbc5b3',
        iconBg: 'bg-[#1b1935] border border-[#2b2a42] text-[#fbc5b3]',
        Icon: ShieldCheck,
        title: 'ADMIN ACCESS',
        subtitle: 'Authenticate internal administrative systems.',
        submitLabel: 'INITIATE ACCESS',
        footerLabel: 'Authorized personnel only. Logs monitored.',
        emailPlaceholder: 'admin@bucc.edu',
        passwordLabel: 'Security Key',
        passwordPlaceholder: '••••••••',
      }
    : {
        accent: '#5ce1e6',
        accent2: '#7c83fd',
        iconBg: 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-300',
        Icon: User2,
        title: 'WELCOME BACK',
        subtitle: 'Sign in to your learner workspace.',
        submitLabel: 'CONTINUE',
        footerLabel: 'New here? Switch to Register above to create your learner account.',
        emailPlaceholder: 'you@example.com',
        passwordLabel: 'Password',
        passwordPlaceholder: '••••••••',
      };

  const AccentIcon = theme.Icon;

  return (
    <div className="min-h-screen bg-[#090814] bg-[radial-gradient(#1a182e_1.5px,transparent_1.5px)] [background-size:24px_24px] flex flex-col items-center justify-center p-4 font-sans text-white selection:bg-[#f3d371] selection:text-[#090814]">

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="group flex items-center gap-2 text-gray-400 hover:text-[#5ce1e6] transition-all duration-300 mb-8 text-[10px] font-black tracking-[0.2em] uppercase cursor-pointer"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Return to Portal
      </button>

      {/* Interactive Form Container */}
      <div className="relative w-full max-w-md group/card">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c83fd] to-[#fbc5b3] rounded-2xl translate-x-2 translate-y-2 opacity-20 group-hover/card:translate-x-3 group-hover/card:translate-y-3 transition-transform duration-500 -z-10 blur-[8px]"></div>

        <div className="w-full bg-[#121122] border-2 border-[#2b2a42] rounded-2xl p-8 md:p-10 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8 relative">
            <div
              className={`mx-auto w-12 h-12 flex items-center justify-center rounded-2xl mb-4 ${theme.iconBg}`}
            >
              <AccentIcon size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
              {theme.title}
            </h1>
            <p className="text-gray-400 text-[11px] font-bold mt-2 tracking-[0.2em] uppercase">
              {theme.subtitle}
            </p>
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/40 border-2 border-red-500/30 rounded-xl text-red-400 text-[10px] font-black text-center tracking-widest uppercase">
              {error}
            </div>
          )}

          <div className="mb-6 flex rounded-xl border border-[#2b2a42] bg-[#090814] p-1">
            <button
              type="button"
              onClick={() => setMode && setMode('login')}
              className={`flex-1 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition ${mode === 'login' ? 'bg-[#f3d371] text-[#090814]' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode && setMode('register')}
              className={`flex-1 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition ${mode === 'register' ? 'bg-[#f3d371] text-[#090814]' : 'text-gray-400'}`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black tracking-[0.2em] text-[#5ce1e6] uppercase pl-1">
                  Full Name
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    name="name"
                    value={name || ''}
                    onChange={(e) => setName && setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-[#090814] border-2 border-[#222138] rounded-xl pl-4 pr-4 py-3.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#7c83fd] focus:ring-4 focus:ring-[#7c83fd]/10 transition-all duration-300 font-bold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black tracking-[0.2em] text-[#5ce1e6] uppercase pl-1">
                Email Address
              </label>
              <div className="relative group/input">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[#7c83fd] transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={email || ''}
                  onChange={(e) => setEmail && setEmail(e.target.value)}
                  placeholder={theme.emailPlaceholder}
                  className="w-full bg-[#090814] border-2 border-[#222138] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#7c83fd] focus:ring-4 focus:ring-[#7c83fd]/10 transition-all duration-300 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black tracking-[0.2em] text-[#fbc5b3] uppercase pl-1">
                {theme.passwordLabel}
              </label>
              <div className="relative group/input">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[#7c83fd] transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={password || ''}
                  onChange={(e) => setPassword && setPassword(e.target.value)}
                  placeholder={theme.passwordPlaceholder}
                  className="w-full bg-[#090814] border-2 border-[#222138] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#7c83fd] focus:ring-4 focus:ring-[#7c83fd]/10 transition-all duration-300"
                />
              </div>
            </div>

            {/* Admin bootstrap secret — only on register mode of the admin
                entry. Plain learner registration must NEVER see this field,
                so admins can't accidentally leak it through screen-sharing
                on a learner signup flow. */}
            {mode === 'register' && isAdminEntry && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black tracking-[0.2em] text-violet-300 uppercase pl-1">
                  Admin Bootstrap Key
                </label>
                <div className="relative group/input">
                  <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-300 transition-colors" />
                  <input
                    type="password"
                    name="superSecretKey"
                    placeholder="Paste the secret key here"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-[#090814] border-2 border-violet-500/30 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-400/10 transition-all duration-300 font-mono"
                  />
                </div>
                <p className="text-[9px] text-gray-500 font-bold tracking-[0.15em] uppercase pl-1">
                  Required only when creating an admin account. Leave blank if an operator pre-configured this deployment.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-[#f3d371] hover:bg-[#fcdfa3] text-[#090814] font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl border-2 border-black shadow-[0_8px_24px_rgba(243,211,113,0.2)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#090814] border-t-transparent rounded-full animate-spin"></div>
                  INITIALIZING...
                </div>
              ) : (
                mode === 'register' ? 'CREATE ACCOUNT' : theme.submitLabel
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[9px] text-gray-600 font-bold tracking-[0.15em] uppercase">
            {theme.footerLabel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;