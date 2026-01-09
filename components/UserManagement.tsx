
import React from 'react';
import { User, SolarResult, UserInput } from '../types';

interface UserManagementProps {
  currentUser: User;
  users: User[];
  systemResults: SolarResult | null;
  input: UserInput;
  setInput: React.Dispatch<React.SetStateAction<UserInput>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser, users, systemResults, input, setInput }) => {
  const isAdmin = ['CEO', 'COO', 'Accountant', 'Admin'].includes(currentUser.role);

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
        {/* Project Health & Profitability */}
        <div className="xl:col-span-2 space-y-8">
           <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Financial Health (Current Lead)</h3>
              {!systemResults ? (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">No active calculation results found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <MetricBox label="Unit Cost Basis" value={`KES ${systemResults.estimatedTotalCost.toLocaleString()}`} icon="fa-coins" />
                   <MetricBox label="Retail Revenue" value={`KES ${systemResults.estimatedRetailPrice.toLocaleString()}`} icon="fa-hand-holding-dollar" />
                   <MetricBox label="Net Margin" value={`KES ${systemResults.projectedProfit.toLocaleString()}`} icon="fa-chart-pie" color="text-emerald-400" />
                </div>
              )}
           </div>

           <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">User Directory</h3>
                <button className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Add Employee +</button>
              </div>
              <div className="space-y-4">
                 {users.map(u => (
                   <div key={u.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-500">
                            {u.name[0]}
                         </div>
                         <div>
                            <p className="text-sm font-black text-white">{u.name}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">{u.role} • {u.email}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-slate-600 hover:text-white"><i className="fas fa-pen text-xs"></i></button>
                         <button className="p-2 text-red-900 hover:text-red-500"><i className="fas fa-trash text-xs"></i></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Global Configuration Controls (Role Restricted) */}
        <div className="space-y-8">
           <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                <i className="fas fa-sliders-h text-cyan-500"></i>
                Global Config
              </h3>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                Centralized business parameters. Changes here affect all new calculations.
              </p>
              
              <div className="space-y-6">
                 <ConfigItem 
                  label="Markup %" 
                  value={input.markupPercentage} 
                  onChange={(v) => setInput(prev => ({...prev, markupPercentage: v}))}
                  disabled={!isAdmin}
                 />
                 <ConfigItem 
                  label="Panel Efficiency" 
                  value={input.panelEfficiency * 100} 
                  onChange={(v) => setInput(prev => ({...prev, panelEfficiency: v / 100}))}
                  disabled={currentUser.role !== 'Engineer' && !isAdmin}
                  unit="%"
                 />
                 <ConfigItem 
                  label="Grid Rate (KES)" 
                  value={input.electricityRate} 
                  onChange={(v) => setInput(prev => ({...prev, electricityRate: v}))}
                  disabled={currentUser.role !== 'Accountant' && !isAdmin}
                 />
              </div>

              {!isAdmin && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                   <i className="fas fa-lock text-red-500"></i>
                   <p className="text-[8px] font-black text-red-500 uppercase">You lack permissions to edit business parameters.</p>
                </div>
              )}
           </div>

           <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <h4 className="text-lg font-black text-white uppercase mb-4 tracking-tighter">COO Memo</h4>
              <p className="text-xs text-indigo-200 leading-relaxed font-medium italic opacity-80">
                "Team, our focus for Q3 is to lower hardware overheads. Accountants please audit our Chinese suppliers' shipping costs. Engineers, investigate the 650W bifacial panels compatibility."
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                 <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <i className="fas fa-comment-alt text-indigo-400 text-[10px]"></i>
                 </div>
                 <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Sent 2h ago</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, icon, color = "text-white" }: any) => (
  <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 shadow-inner">
     <div className="flex items-center gap-3 mb-3">
        <i className={`fas ${icon} text-slate-600 text-[10px]`}></i>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
     </div>
     <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
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
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs font-black text-white focus:border-cyan-500 outline-none"
        />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-700">{unit}</span>}
     </div>
  </div>
);

export default UserManagement;
