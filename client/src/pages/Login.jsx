import React, { useState } from 'react';
import { ArrowLeft, Sparkles, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('⚡ ACCESS DENIED: PLEASE FILL OUT ALL AUTHENTICATION GATES.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate interactive authentication delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Add real auth logic here
      navigate('/admin'); 
    }, 1200);
  };

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
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-2xl bg-[#1b1935] border border-[#2b2a42] text-[#fbc5b3] mb-4">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
              ADMIN ACCESS
            </h1>
            <p className="text-gray-400 text-[11px] font-bold mt-2 tracking-[0.2em] uppercase">
              Authenticate internal administrative systems.
            </p>
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/40 border-2 border-red-500/30 rounded-xl text-red-400 text-[10px] font-black text-center tracking-widest uppercase">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black tracking-[0.2em] text-[#5ce1e6] uppercase pl-1">
                Email Address
              </label>
              <div className="relative group/input">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[#7c83fd] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bucc.edu"
                  className="w-full bg-[#090814] border-2 border-[#222138] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#7c83fd] focus:ring-4 focus:ring-[#7c83fd]/10 transition-all duration-300 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black tracking-[0.2em] text-[#fbc5b3] uppercase pl-1">
                Security Key
              </label>
              <div className="relative group/input">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[#7c83fd] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#090814] border-2 border-[#222138] rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#7c83fd] focus:ring-4 focus:ring-[#7c83fd]/10 transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-[#f3d371] hover:bg-[#fcdfa3] text-[#090814] font-black text-xs tracking-[0.3em] uppercase py-5 rounded-xl border-2 border-black shadow-[0_8px_24px_rgba(243,211,113,0.2)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#090814] border-t-transparent rounded-full animate-spin"></div>
                  INITIALIZING...
                </div>
              ) : (
                'INITIATE ACCESS'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[9px] text-gray-600 font-bold tracking-[0.15em] uppercase">
            Authorized personnel only. Logs monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;