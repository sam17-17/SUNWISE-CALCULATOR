
import React, { useState, useEffect } from 'react';
import { UserInput, SolarResult, AIAdvice } from './types';
import { calculateSolarPotential, getEstimatedSunlight } from './utils/calculations';
import { getSolarAdvice } from './services/geminiService';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import AIAdviceSection from './components/AIAdviceSection';
import MaintenanceMonitor from './components/MaintenanceMonitor';

const App: React.FC = () => {
  const [input, setInput] = useState<UserInput>({
    clientName: '',
    clientContact: '',
    clientAddress: '',
    monthlyBill: 5000,
    electricityRate: 28,
    roofArea: 0,
    location: '',
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
    transportAndLogisticsCost: 8000
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500 selection:text-white transition-colors duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 no-print">
        <div className="max-w-[1400px] mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => window.location.reload()}>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
                <i className="fas fa-solar-panel text-cyan-400 text-lg"></i>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase flex items-center gap-2">
                SunWise 
                <span className="text-cyan-500 text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 lowercase tracking-normal font-mono">
                  by Geosam
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Engineering & ROI Calculator</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => window.print()}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white px-4 py-2 bg-white/5 rounded-lg border border-white/5 transition-all active:scale-95"
            >
              <i className="fas fa-print mr-2"></i> Print Proposal
            </button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 rounded-full border border-green-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6 no-print">
            <div className="sticky top-24">
              <InputSection 
                input={input} 
                setInput={setInput} 
                onCalculate={handleCalculate} 
                onApplyPreset={applyPreset}
                isLoading={loading || adviceLoading}
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
                  Adjust the energy profile and hardware presets on the left. We'll generate a complete technical proposal including financial ROI and Bill of Materials.
                </p>
                <div className="mt-10 flex gap-4">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                     <i className="fas fa-check-circle text-cyan-500"></i> Smart Sizing
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                     <i className="fas fa-check-circle text-cyan-500"></i> ROI Curves
                   </div>
                </div>
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
                  
                  {/* Floating Action for Mobile */}
                  <div className="lg:hidden fixed bottom-6 right-6 z-50 no-print">
                    <button 
                      onClick={() => window.print()}
                      className="w-14 h-14 bg-cyan-600 text-white rounded-full shadow-2xl flex items-center justify-center border border-white/20 active:scale-90 transition-transform"
                    >
                      <i className="fas fa-file-export"></i>
                    </button>
                  </div>
                </div>
              )
            )}
          </section>
        </div>
      </main>

      <footer className="mt-20 py-16 border-t border-white/5 bg-slate-950/80 backdrop-blur-md no-print">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-black text-white tracking-widest uppercase mb-1">Geosam Investments</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60 italic">Engineering Sustainable Futures Since 2012</p>
            <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">© {new Date().getFullYear()} Geosam Investments. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <span className="hover:text-cyan-500 cursor-pointer transition-colors px-2 py-1">Legal Notice</span>
            <span className="hover:text-cyan-500 cursor-pointer transition-colors px-2 py-1">Privacy Architecture</span>
            <span className="hover:text-cyan-500 cursor-pointer transition-colors px-2 py-1">Contact Engineering</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
