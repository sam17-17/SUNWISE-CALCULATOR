
import React, { useMemo, useState, useRef } from 'react';
import { SolarResult, User } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  ReferenceLine
} from 'recharts';

interface ResultsSectionProps {
  results: SolarResult;
  clientInfo?: {
    name: string;
    contact: string;
    address: string;
  };
  currentUser: User;
  onSave?: (results: SolarResult) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, clientInfo, currentUser, onSave }) => {
  const [componentImages, setComponentImages] = useState<Record<number, string>>({});
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const isAdmin = ['CEO', 'COO', 'Admin', 'Accountant'].includes(currentUser.role);

  const projectionData = useMemo(() => {
    const data = [];
    let cumulativeSavings = 0;
    const annualSavings = results.monthlySavings * 12;
    const degradationRate = 0.005;

    for (let year = 1; year <= 10; year++) {
      const yearSavings = annualSavings * Math.pow(1 - degradationRate, year - 1);
      cumulativeSavings += yearSavings;
      data.push({
        year: `Year ${year}`,
        savings: Math.round(cumulativeSavings),
        investment: results.estimatedRetailPrice
      });
    }
    return data;
  }, [results]);

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setComponentImages(prev => ({
          ...prev,
          [index]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleSaveToArchive = () => {
    if (onSave) {
      onSave(results);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-white/20 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">
            {payload[0].payload.year} Savings
          </p>
          <p className="text-lg font-black text-white leading-none">
            <span className="text-cyan-400">KES {payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-tighter">Net Cumulative Gain</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* 1. OFFICIAL PROPOSAL COVER */}
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-12 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
               <div>
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Engineering Proposal</h2>
                 <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] mt-2 uppercase flex items-center gap-2">
                   Professional Grade Analysis
                   <i className="fas fa-shield-check text-cyan-500/40"></i>
                 </p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Authorized Recipient</p>
                <p className="text-xl font-black text-white leading-none group-hover:text-cyan-400 transition-colors">
                  {clientInfo?.name || 'Valued Partner'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Primary Contact</p>
                <p className="text-sm font-bold text-slate-400">{clientInfo?.contact || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Installation Site</p>
                <p className="text-sm font-bold text-slate-400 line-clamp-1">{clientInfo?.address || 'To be Confirmed'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end justify-between border-l border-white/5 pl-12 text-right min-w-[200px] no-print">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reference ID</p>
                <p className="text-sm font-mono font-black text-cyan-500">GS-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              </div>
              <button 
                onClick={handleSaveToArchive}
                className={`w-full px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg border ${
                  isSaved 
                    ? 'bg-green-600 text-white border-green-500' 
                    : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500'
                }`}
              >
                <i className={`fas ${isSaved ? 'fa-check' : 'fa-box-archive'} mr-2`}></i> 
                {isSaved ? 'Archived' : 'Archive'}
              </button>
              <button 
                onClick={() => window.print()}
                className="w-full px-6 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-50 transition-all active:scale-95 shadow-lg"
              >
                <i className="fas fa-file-pdf mr-2"></i> Print PDF
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-1000"></div>
      </div>

      {/* Hero metrics and other sections remain the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard 
          label="System Power" 
          value={`${results.systemSizeKw}`} 
          unit="kWp" 
          icon="fa-solar-panel" 
          color="text-cyan-400" 
          tooltip="Total peak power output of all solar panels combined."
        />
        <SummaryCard 
          label="Customer Price" 
          value={`KES ${results.estimatedRetailPrice.toLocaleString()}`} 
          unit="" 
          icon="fa-wallet" 
          color="text-white" 
          tooltip="Retail price offered to the customer including your business markup."
        />
        {isAdmin && (
          <SummaryCard 
            label="Projected Profit" 
            value={`KES ${results.projectedProfit.toLocaleString()}`} 
            unit="" 
            icon="fa-money-bill-trend-up" 
            color="text-emerald-400" 
            tooltip="Calculated profit after all cost basis and logistics are paid."
          />
        )}
        <SummaryCard 
          label="Payback Period" 
          value={`${results.paybackYears}`} 
          unit="Years" 
          icon="fa-hourglass-start" 
          color="text-green-400" 
          tooltip="Time required for the system to pay for itself through bill savings."
        />
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm group">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">ROI Curve</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">10-Year Cumulative Savings Forecast</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-white/10">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Growth</span>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} tickFormatter={(val) => `K ${val/1000}k`} />
              <RechartsTooltip content={<CustomTooltip />} />
              <ReferenceLine y={results.estimatedRetailPrice} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.4} label={{ position: 'right', value: 'Cost', fill: '#ef4444', fontSize: 9, fontWeight: 900 }} />
              <Area type="monotone" dataKey="savings" stroke="#06b6d4" strokeWidth={5} fillOpacity={1} fill="url(#colorSavings)" animationDuration={2500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white/[0.01]">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Detailed Quote (BOM)</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sourcing and labor breakdown</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Retail Price Valuation</p>
            <span className="text-3xl font-black text-white tracking-tighter">KES {results.estimatedRetailPrice.toLocaleString()}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-10 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Item Specification</th>
                <th className="px-10 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Qty</th>
                <th className="px-10 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Rate</th>
                <th className="px-10 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.components.map((item, idx) => (
                <tr key={idx} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div 
                        onClick={() => triggerUpload(idx)}
                        className="relative w-20 h-20 flex-shrink-0 bg-slate-950 rounded-2xl border border-white/5 overflow-hidden group/img cursor-pointer transition-all hover:border-cyan-500/50"
                      >
                        {componentImages[idx] ? (
                          <img 
                            src={componentImages[idx]} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform group-hover/img:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 hover:text-cyan-500 transition-colors">
                            <i className={`fas ${
                              item.name.toLowerCase().includes('panel') ? 'fa-solar-panel' :
                              item.name.toLowerCase().includes('battery') ? 'fa-car-battery' :
                              item.name.toLowerCase().includes('inverter') ? 'fa-bolt' :
                              item.name.toLowerCase().includes('labor') ? 'fa-users-gear' :
                              'fa-box-open'
                            } text-xl mb-1`}></i>
                            <span className="text-[7px] font-black uppercase no-print">Upload</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={el => { fileInputRefs.current[idx] = el; }}
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(idx, e)}
                        />
                      </div>

                      <div>
                        <div className="font-black text-white text-base group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-black uppercase mt-2 tracking-tighter opacity-60 italic">
                          {item.size}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 border border-white/5 rounded-2xl font-mono text-sm text-slate-300">
                      {item.quantity} <span className="text-[9px] uppercase font-black opacity-30">{item.unit}</span>
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right text-slate-500 text-sm font-mono font-bold">
                    {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-10 py-8 text-right font-black text-white text-xl font-mono">
                    {item.estimatedCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, unit, icon, color, tooltip }: any) => (
  <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-500 shadow-2xl backdrop-blur-md">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-white/[0.02] blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-white/[0.05] transition-colors`}></div>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner group-hover:bg-cyan-500/10 transition-colors">
          <i className={`fas ${icon} text-slate-500 text-lg group-hover:text-cyan-400`}></i>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      </div>
      <div className="relative group/tooltip">
        <i className="fas fa-circle-info text-[10px] text-slate-700 cursor-help hover:text-slate-500 transition-colors no-print"></i>
        <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-slate-950 border border-white/10 rounded-xl text-[9px] text-slate-400 uppercase font-bold tracking-widest leading-relaxed opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl border-t-cyan-500/50">
          {tooltip}
        </div>
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-4xl font-black tracking-tighter ${color}`}>{value}</span>
      <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{unit}</span>
    </div>
  </div>
);

export default ResultsSection;
