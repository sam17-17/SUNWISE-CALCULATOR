
import React, { useState, useEffect } from 'react';
import { UserInput, SolarResult, AIAdvice, User, UserRole } from './types';
import { calculateSolarPotential, getEstimatedSunlight } from './utils/calculations';
import { getSolarAdvice } from './services/geminiService';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import AIAdviceSection from './components/AIAdviceSection';
import MaintenanceMonitor from './components/MaintenanceMonitor';
import UserManagement from './components/UserManagement';

const APP_USERS: User[] = [
  { id: '1', name: 'Sam Geosam', role: 'CEO', email: 'ceo@geosam.com' },
  { id: '2', name: 'Jane W.', role: 'COO', email: 'operations@geosam.com' },
  { id: '3', name: 'Peter M.', role: 'Accountant', email: 'finance@geosam.com' },
  { id: '4', name: 'Eng. Kelvin', role: 'Engineer', email: 'tech@geosam.com' },
  { id: '5', name: 'Sarah L.', role: 'Marketing', email: 'branding@geosam.com' },
  { id: '6', name: 'Mike T.', role: 'Sales', email: 'deals@geosam.com' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(APP_USERS[0]);
  const [activeTab, setActiveTab] = useState<'calculator' | 'management'>('calculator');
  
  const [input, setInput] = useState<UserInput>({
    clientName: '',
    clientContact: '',
    clientAddress: '',
    monthlyBill: 5000,
    electricityRate: 28,
    roofArea: 0,
    location: 'Nairobi',
    sunlightHours: 5.2,
    panelEfficiency: 0.18,
    panelWattage: 550,
    batteryCapacity: 5,
    batterySizeDescription: '200Ah / 48V LiFePO4',
    inverterCapacity: 5,
    panelPricePerUnit: 22000,
    batteryPricePerUnit: 145000,
    inverterPrice: 85000,
    installationLaborCost: 40000,
    mountingHardwareCostPerPanel: 3500,
    cablingAndProtectionCost: 18000,
    transportAndLogisticsCost: 8000,
    markupPercentage: 15
  });

  const [results, setResults] = useState<SolarResult | null>(null);
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const estSun = getEstimatedSunlight(position.coords.latitude);
        setInput(prev => ({ ...prev, sunlightHours: estSun }));
      }, (err) => {
        console.warn("Geolocation unavailable", err);
      });
    }
  }, []);

  const handleCalculate = async () => {
    if (input.monthlyBill <= 0 || input.electricityRate <= 0) {
      setError("Please enter your average monthly bill and rate to continue.");
      return;
    }

    setError(null);
    setLoading(true);
    setAdvice(null);
    try {
      const calculatedResults = calculateSolarPotential(input);
      setResults(calculatedResults);
      
      setAdviceLoading(true);
      const aiAdvice = await getSolarAdvice(input, calculatedResults);
      setAdvice(aiAdvice);
    } catch (err) {
      setError("AI analysis skipped, but core engineering data is ready.");
      console.error(err);
    } finally {
      setLoading(false);
      setAdviceLoading(false);
    }
  };

  const applyPreset = (type: 'starter' | 'standard' | 'pro') => {
    const presets = {
      starter: {
        panelWattage: 400,
        batteryCapacity: 2.4,
        batterySizeDescription: '100Ah / 48V Gel',
        inverterCapacity: 3,
        panelPricePerUnit: 16000,
        batteryPricePerUnit: 65000,
        inverterPrice: 45000,
      },
      standard: {
        panelWattage: 550,
        batteryCapacity: 5,
        batterySizeDescription: '200Ah / 48V Lithium',
        inverterCapacity: 5,
        panelPricePerUnit: 22000,
        batteryPricePerUnit: 145000,
        inverterPrice: 85000,
      },
      pro: {
        panelWattage: 650,
        batteryCapacity: 10,
        batterySizeDescription: '400Ah / 48V High-C Lithium',
        inverterCapacity: 10,
        panelPricePerUnit: 28000,
        batteryPricePerUnit: 290000,
        inverterPrice: 165000,
      }
    };
    setInput(prev => ({ ...prev, ...presets[type] }));
  };

  const isManagementAllowed = ['CEO', 'COO', 'Accountant', 'Admin'].includes(currentUser.role);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500 selection:text-white transition-colors duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 no-print">
        <div className="max-w-[1400px] mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => setActiveTab('calculator')}>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
                  <i className="fas fa-solar-panel text-cyan-400 text-lg"></i>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-white uppercase flex items-center gap-2">
                  SunWise Pro
                  <span className="text-cyan-500 text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 lowercase tracking-normal font-mono">
                    Business Edition
                  </span>
                </h1>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Geosam Investments Portal</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center bg-slate-900/50 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'calculator' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Calculator
              </button>
              {isManagementAllowed && (
                <button 
                  onClick={() => setActiveTab('management')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'management' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Management
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* User Profile / Role Switcher */}
            <div className="flex items-center gap-3 pr-6 border-r border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">{currentUser.name}</p>
                <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest mt-1">{currentUser.role}</p>
              </div>
              <select 
                value={currentUser.id}
                onChange={(e) => setCurrentUser(APP_USERS.find(u => u.id === e.target.value)!)}
                className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-black text-slate-400 uppercase outline-none focus:border-cyan-500"
              >
                {APP_USERS.map(u => (
                  <option key={u.id} value={u.id}>{u.role}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => window.print()}
              className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white px-4 py-2 bg-white/5 rounded-lg border border-white/5 transition-all"
            >
              <i className="fas fa-file-pdf mr-2"></i> Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {activeTab === 'management' ? (
          <UserManagement 
            currentUser={currentUser} 
            users={APP_USERS} 
            systemResults={results}
            input={input}
            setInput={setInput}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <aside className="lg:col-span-4 xl:col-span-3 space-y-6 no-print">
              <div className="sticky top-24">
                <InputSection 
                  input={input} 
                  setInput={setInput} 
                  onCalculate={handleCalculate} 
                  onApplyPreset={applyPreset}
                  isLoading={loading || adviceLoading}
                  currentUser={currentUser}
                />
              </div>
            </aside>

            <section className="lg:col-span-8 xl:col-span-9 space-y-8">
              {!results && !loading ? (
                <div className="h-[650px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01] animate-in fade-in zoom-in duration-700">
                  <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse"></div>
                    <i className="fas fa-microchip text-4xl text-slate-700 relative z-10"></i>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter text-center">Ready for Configuration</h2>
                  <p className="text-slate-500 max-w-md text-center text-sm leading-relaxed px-8">
                    Role identified as <span className="text-cyan-400 font-black">{currentUser.role}</span>. Configure the technical and financial parameters to generate a proposal.
                  </p>
                </div>
              ) : loading ? (
                <div className="h-[650px] flex flex-col items-center justify-center gap-8 animate-pulse">
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-white/5 border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fas fa-sun text-cyan-500/50 text-4xl animate-bounce"></i>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Crunching the Numbers</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Architecting your high-efficiency system</p>
                  </div>
                </div>
              ) : (
                results && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-8 pb-20">
                    <ResultsSection 
                      results={results} 
                      clientInfo={{ name: input.clientName, contact: input.clientContact, address: input.clientAddress }} 
                      currentUser={currentUser}
                    />
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 no-print">
                      <div className="space-y-6">
                        {adviceLoading ? (
                          <div className="p-16 bg-slate-900/40 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center gap-6 animate-pulse">
                            <div className="w-10 h-10 border-2 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">Auditing Local Context</p>
                          </div>
                        ) : (
                          advice && <AIAdviceSection advice={advice} />
                        )}
                      </div>

                      <div className="space-y-6">
                        <MaintenanceMonitor results={results} />
                      </div>
                    </div>

                    {error && (
                      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-sm font-bold text-red-400 animate-bounce no-print">
                        <i className="fas fa-triangle-exclamation text-xl"></i>
                        {error}
                      </div>
                    )}
                  </div>
                )
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="mt-20 py-16 border-t border-white/5 bg-slate-950/80 backdrop-blur-md no-print">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-black text-white tracking-widest uppercase mb-1">Geosam Investments</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60 italic">Engineering Sustainable Futures Since 2012</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <span className="bg-slate-900 px-3 py-1 rounded-full text-cyan-500 border border-white/5">Internal Use Only</span>
            <span className="hover:text-cyan-500 cursor-pointer transition-colors px-2 py-1">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
