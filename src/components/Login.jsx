import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!emailOrUser.trim() || !password) {
      setError('Harap lengkapi semua kolom.');
      return;
    }

    // Load registered users from local storage
    const users = JSON.parse(localStorage.getItem('donezo_registered_users')) || [];
    
    // Default seeded user
    const defaultUser = {
      username: 'Totok Michael',
      email: 'tmichael20@mail.com',
      password: 'password123',
      role: 'Project Manager',
      avatarColor: '#FFE0B2'
    };

    const allUsers = [defaultUser, ...users];

    // Find matching user
    const matchedUser = allUsers.find(
      (u) => 
        (u.email.toLowerCase() === emailOrUser.toLowerCase() || u.username.toLowerCase() === emailOrUser.toLowerCase()) &&
        u.password === password
    );

    if (matchedUser) {
      // Set current session
      localStorage.setItem('donezo_current_user', JSON.stringify(matchedUser));
      onLoginSuccess(matchedUser);
    } else {
      setError('Kredensial salah. Silakan coba lagi atau daftar baru.');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setError('Harap lengkapi semua kolom.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('donezo_registered_users')) || [];
    
    // Check if email already exists
    if (signUpEmail.toLowerCase() === 'tmichael20@mail.com' || users.some(u => u.email.toLowerCase() === signUpEmail.toLowerCase())) {
      setError('Email sudah terdaftar.');
      return;
    }

    const newUser = {
      username: signUpName.trim(),
      email: signUpEmail.trim(),
      password: signUpPassword,
      role: 'Team Member',
      avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16) // random avatar color
    };

    users.push(newUser);
    localStorage.setItem('donezo_registered_users', JSON.stringify(users));
    setSuccess('Pendaftaran berhasil! Silakan masuk.');
    
    // Switch to login tab and autofill
    setTimeout(() => {
      setIsSignUp(false);
      setEmailOrUser(newUser.email);
      setPassword(newUser.password);
      setSuccess('');
    }, 1500);
  };

  const autofillDemo = () => {
    setEmailOrUser('tmichael20@mail.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-colors duration-300 font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute -left-1/4 -top-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute -right-1/4 -bottom-1/4 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="w-full max-w-md animate-page-in relative z-10">
        {/* Donezo Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-[#0A5C36] dark:text-[#4ADE80] shadow-md mb-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight">
            Donezo
          </h1>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1.5 text-center">
            Platform Perencanaan & Kolaborasi Tim Terpadu
          </p>
        </div>

        {/* Login Panel */}
        <div className="glass bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800/40 rounded-3xl p-7 shadow-2xl backdrop-blur-xl">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800/50 mb-6">
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 text-center ${
                !isSignUp 
                  ? 'border-[#0A5C36] dark:border-[#4ADE80] text-slate-800 dark:text-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 text-center ${
                isSignUp 
                  ? 'border-[#0A5C36] dark:border-[#4ADE80] text-slate-800 dark:text-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/30 text-red-650 dark:text-red-400 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/30 text-emerald-650 dark:text-[#4ADE80] flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!isSignUp ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Email atau Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="nama@email.com atau Totok Michael"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white/80 dark:focus:bg-slate-900/60 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white/80 dark:focus:bg-slate-900/60 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#0A5C36] to-[#16A34A] hover:from-[#084d2d] hover:to-[#15803D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Ke Dashboard</span>
              </button>

              {/* Demo Account Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div 
                  onClick={autofillDemo}
                  className="p-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/35 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0A5C36] dark:text-[#4ADE80]">
                    <Sparkles className="w-4 h-4 animate-bounce" />
                    <span>Akun Demo: Klik untuk Auto-Fill</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium leading-relaxed">
                    User: <span className="font-semibold text-slate-700 dark:text-slate-350">tmichael20@mail.com</span><br/>
                    Pass: <span className="font-semibold text-slate-700 dark:text-slate-350">password123</span>
                  </p>
                </div>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Totok Michael"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white/80 dark:focus:bg-slate-900/60 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white/80 dark:focus:bg-slate-900/60 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Buat Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/40 dark:bg-slate-950/25 border border-slate-200/50 dark:border-slate-800/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0A5C36] dark:focus:border-[#4ADE80] focus:ring-4 focus:ring-[#0A5C36]/5 focus:bg-white/80 dark:focus:bg-slate-900/60 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#0A5C36] to-[#16A34A] hover:from-[#084d2d] hover:to-[#15803D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Buat Akun Baru</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
