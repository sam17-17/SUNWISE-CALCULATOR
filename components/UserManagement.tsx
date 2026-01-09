
import React, { useState } from 'react';
import { User, SolarResult, UserInput, UserRole } from '../types';

interface UserManagementProps {
  currentUser: User;
  users: User[];
  systemResults: SolarResult | null;
  input: UserInput;
  setInput: React.Dispatch<React.SetStateAction<UserInput>>;
  onAddUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser, users, systemResults, input, setInput, onAddUser, onDeleteUser }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Sales' as UserRole });

  const isAdmin = ['CEO', 'COO', 'Admin'].includes(currentUser.role);
  const isSuperAdmin = currentUser.role === 'Admin';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;
    
    onAddUser({
      id: Math.random().toString(36).substr(2, 9),
      ...newUser
    });
    setNewUser({ name: '', email: '', password: '', role: 'Sales' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Business Intelligence Dashboard</h2>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
            Logged in as <span className="text-cyan-500">{currentUser.name}</span> • Access Level: {currentUser.role}
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Users</p>
              <p className="text-xl font-black text-white">{users.length}</p>
           </div>
           <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Projects Active</p>
              <p className="text-xl font-black text-cyan-500">12</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
           {/* 1. FINANCIAL KPI */}
           <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">System Viability (Lead Data)</h3>
                {!systemResults ? (
                  <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">Run a calculation to see financial metrics</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <MetricBox label="Project Cost Basis" value={`KES ${systemResults.estimatedTotalCost.toLocaleString()}`} icon="fa-coins" />
                     <MetricBox label="Enterprise Revenue" value={`KES ${systemResults.estimatedRetailPrice.toLocaleString()}`} icon="fa-hand-holding-dollar" />
                     <MetricBox label="Project Margin" value={`KES ${systemResults.projectedProfit.toLocaleString()}`} icon="fa-chart-pie" color="text-emerald-400" />
                  </div>
                )}
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
           </div>

           {/* 2. USER DIRECTORY */}
           <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Team Directory</h3>
                {isSuperAdmin && (
                  <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-50 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <i className={`fas ${showAddForm ? 'fa-minus' : 'fa-plus'}`}></i>
                    {showAddForm ? 'Cancel' : 'Register User'}
                  </button>
                )}
              </div>

              {showAddForm && (
                <form onSubmit={handleAddSubmit} className="mb-10 p-8 bg-slate-950/50 border border-cyan-500/20 rounded-3xl space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Full Name" value={newUser.name} onChange={(v) => setNewUser({...newUser, name: v})} placeholder="e.g. John Doe" />
                    <FormInput label="Email Address" value={newUser.email} onChange={(v) => setNewUser({...newUser, email: v})} placeholder="john@geosam.com" type="email" />
                    <FormInput label="Temporary Password" value={newUser.password} onChange={(v) => setNewUser({...newUser, password: v})} placeholder="••••••••" type="password" />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Role</label>
                      <select 
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs font-black text-white focus:border-cyan-500 outline-none appearance-none"
                      >
                        <option value="CEO">CEO</option>
                        <option value="COO">COO</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Admin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-cyan-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all">
                    Finalize Registration
                  </button>
                </form>
              )}

              <div className="space-y-4">
                 {users.map(u => (
                   <div key={u.id} className="flex items-center justify-between p-5 bg-slate-950/50 rounded-2xl border border-white/5 group hover:border-white/20 transition-all shadow-lg">
                      <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border border-white/5 shadow-inner ${
                           u.role === 'Admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-500'
                         }`}>
                            {u.name[0]}
                         </div>
                         <div>
                            <div className="flex items-center gap-3">
                              <p className="text-base font-black text-white uppercase tracking-tight">{u.name}</p>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                                u.role === 'Admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                u.role === 'CEO' || u.role === 'COO' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                'bg-slate-800 text-slate-400 border-white/5'
                              }`}>
                                {u.role}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter mt-1">{u.email}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                         {isSuperAdmin && u.id !== currentUser.id && u.id !== 'admin' && (
                           <button 
                             onClick={() => onDeleteUser(u.id)}
                             className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                           >
                             <i className="fas fa-trash-alt text-xs"></i>
                           </button>
                         )}
                         <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500">
                           <i className="fas fa-ellipsis-v text-xs"></i>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Global Configuration Controls */}
        <div className="space-y-8">
           <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md sticky top-24 shadow-2xl">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                <i className="fas fa-sliders-h text-cyan-500"></i>
                Global Business Config
              </h3>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                Management-only parameters that scale across all project estimates.
              </p>
              
              <div className="space-y-6">
                 <ConfigItem 
                  label="Business Markup %" 
                  value={input.markupPercentage} 
                  onChange={(v) => setInput(prev => ({...prev, markupPercentage: v}))}
                  disabled={!['CEO', 'COO', 'Admin', 'Accountant'].includes(currentUser.role)}
                  unit="%"
                 />
                 <ConfigItem 
                  label="Panel Efficiency" 
                  value={input.panelEfficiency * 100} 
                  onChange={(v) => setInput(prev => ({...prev, panelEfficiency: v / 100}))}
                  disabled={currentUser.role !== 'Engineer' && !isSuperAdmin}
                  unit="%"
                 />
                 <ConfigItem 
                  label="KPLC Energy Rate (KES)" 
                  value={input.electricityRate} 
                  onChange={(v) => setInput(prev => ({...prev, electricityRate: v}))}
                  disabled={currentUser.role !== 'Accountant' && !isSuperAdmin}
                 />
              </div>

              {!isAdmin && currentUser.role !== 'Accountant' && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                   <i className="fas fa-lock text-red-500 text-xs"></i>
                   <p className="text-[9px] font-black text-red-500 uppercase tracking-tight">Financial inputs locked for your role.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, icon, color = "text-white" }: any) => (
  <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 shadow-inner group hover:border-white/20 transition-all">
     <div className="flex items-center gap-3 mb-3">
        <i className={`fas ${icon} text-slate-700 text-[10px] group-hover:text-cyan-500 transition-colors`}></i>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
     </div>
     <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
);

const FormInput = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none"
      placeholder={placeholder}
    />
  </div>
);

const ConfigItem = ({ label, value, onChange, disabled, unit = "" }: any) => (
  <div className={`space-y-2 ${disabled ? 'opacity-40 grayscale' : ''}`}>
     <div className="flex justify-between items-center">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        {disabled && <i className="fas fa-lock text-[8px] text-slate-800"></i>}
     </div>
     <div className="relative">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          disabled={disabled}
          className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs font-black text-white focus:border-cyan-500 outline-none"
        />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-700">{unit}</span>}
     </div>
  </div>
);

export default UserManagement;
