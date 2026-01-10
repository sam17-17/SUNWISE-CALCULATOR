
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.pin === pin);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or PIN. Use admin / 1234 for Super Admin access.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 mb-6 shadow-xl">
              <i className="fas fa-solar-panel text-cyan-600 dark:text-cyan-400 text-2xl"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">SunWise Pro</h1>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2">Enterprise Auth Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <i className="fas fa-user-shield absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 text-xs"></i>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Access PIN</label>
              <div className="relative">
                <i className="fas fa-keypad absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 text-xs"></i>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner tracking-[1em]"
                  placeholder="••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-tight text-center bg-red-500/5 py-3 rounded-xl border border-red-500/10">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] mt-4"
            >
              Verify Credentials
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">
              Geosam Investments Engineering Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
