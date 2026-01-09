
import React, { useMemo, useState } from 'react';
import { UserInput } from '../types';

interface InputSectionProps {
  input: UserInput;
  setInput: React.Dispatch<React.SetStateAction<UserInput>>;
  onCalculate: () => void;
  onApplyPreset: (type: 'starter' | 'standard' | 'pro') => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ input, setInput, onCalculate, onApplyPreset, isLoading }) => {
  const [showLoadEstimator, setShowLoadEstimator] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isStringField = ['location', 'batterySizeDescription', 'clientName', 'clientContact', 'clientAddress'].includes(name);
    
    setInput(prev => ({
      ...prev,
      [name]: isStringField ? value : parseFloat(value) || 0
    }));
  };

  const addLoad = (kesAmount: number) => {
    setInput(prev => ({
      ...prev,
      monthlyBill: prev.monthlyBill + kesAmount
    }));
  };

  const liveStats = useMemo(() => {
    const monthlyKwh = input.monthlyBill / (input.electricityRate || 1);
    const dailyKwh = monthlyKwh / 30;
    const designSafetyFactor = 1.2;
    const dailyTarget = isFinite(dailyKwh) ? dailyKwh * designSafetyFactor : 0;

    const effLoss = 0.8;
    const sun = input.sunlightHours || 4.5;
    const systemSizeKw = dailyTarget / (sun * effLoss);
    
    const panelQty = Math.ceil((systemSizeKw * 1000) / (input.panelWattage || 400));
    const batteryQty = Math.ceil(dailyTarget / (input.batteryCapacity || 5));
    const actualSystemSizeKw = (panelQty * (input.panelWattage || 400)) / 1000;
    const inverterQty = Math.ceil(actualSystemSizeKw / (input.inverterCapacity || 5));

    const finalPanelQty = isFinite(panelQty) && panelQty > 0 ? panelQty : 0;
    const finalBatteryQty = isFinite(batteryQty) && batteryQty > 0 ? batteryQty : 0;
    const finalInverterQty = isFinite(inverterQty) && inverterQty > 0 ? inverterQty : 0;

    const panelTotal = finalPanelQty * (input.panelPricePerUnit || 0);
    const batteryTotal = finalBatteryQty * (input.batteryPricePerUnit || 0);
    const inverterTotal = finalInverterQty * (input.inverterPrice || 0);
    const mountingTotal = finalPanelQty * (input.mountingHardwareCostPerPanel || 0);
    
    const laborAndMiscTotal = 
      (input.installationLaborCost || 0) + 
      (input.cablingAndProtectionCost || 0) + 
      (input.transportAndLogisticsCost || 0) +
      mountingTotal;

    const runningSubtotal = panelTotal + batteryTotal + inverterTotal + laborAndMiscTotal;

    return {
      dailyTarget: dailyTarget.toFixed(2),
      monthlyKwh: monthlyKwh.toFixed(0),
      panelQty: finalPanelQty,
      batteryQty: finalBatteryQty,
      inverterQty: finalInverterQty,
      runningSubtotal
    };
  }, [input]);

  return (
    <div className="space-y-4">
      {/* 1. CLIENT INFO */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="px-5 py-3 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-id-card text-cyan-500/50"></i>
            1. Client Identity
          </h3>
        </div>
        <div className="p-5 space-y-3">
          <InputField label="Name" name="clientName" value={input.clientName} onChange={handleChange} placeholder="Proposal Recipient" isString />
          <InputField label="Contact" name="clientContact" value={input.clientContact} onChange={handleChange} placeholder="Phone or Email" isString />
          <InputField label="Address" name="clientAddress" value={input.clientAddress} onChange={handleChange} placeholder="Site Physical Address" isString />
        </div>
      </div>

      {/* 2. ENERGY PROFILE - REDESIGNED & EDITABLE */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="px-5 py-3 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-chart-line text-cyan-500/50"></i>
            2. Energy Profile
          </h3>
          <button 
            onClick={() => setShowLoadEstimator(!showLoadEstimator)}
            className="text-[8px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
          >
            {showLoadEstimator ? 'Hide Tips' : 'Load Estimator'}
          </button>
        </div>
        <div className="p-5 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Monthly Bill (KES)</label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600">KES</span>
                <input 
                  type="number"
                  name="monthlyBill"
                  value={input.monthlyBill}
                  onChange={handleChange}
                  className="w-24 bg-slate-950/50 border border-cyan-500/20 rounded-lg px-2 py-1 text-sm font-black text-cyan-400 text-right focus:border-cyan-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>
            
            <input 
              type="range" 
              name="monthlyBill" 
              min="0" 
              max="100000" 
              step="500" 
              value={input.monthlyBill} 
              onChange={handleChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />

            {showLoadEstimator && (
              <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <button onClick={() => addLoad(1500)} className="text-[8px] font-bold uppercase bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg p-2 text-slate-400 transition-all">+ Fridge (1.5k)</button>
                <button onClick={() => addLoad(3000)} className="text-[8px] font-bold uppercase bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg p-2 text-slate-400 transition-all">+ A/C Unit (3k)</button>
                <button onClick={() => addLoad(800)} className="text-[8px] font-bold uppercase bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg p-2 text-slate-400 transition-all">+ TV/Entertain (0.8k)</button>
                <button onClick={() => addLoad(1200)} className="text-[8px] font-bold uppercase bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg p-2 text-slate-400 transition-all">+ Borehole Pump (1.2k)</button>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <div className="text-center">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Est. Monthly</p>
                <p className="text-xs font-bold text-slate-300">{liveStats.monthlyKwh} kWh</p>
              </div>
              <div className="w-px h-4 bg-white/5"></div>
              <div className="text-center">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Daily Target</p>
                <p className="text-xs font-bold text-cyan-500/80">{liveStats.dailyTarget} kWh</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Rate (KES/kWh)" name="electricityRate" value={input.electricityRate} onChange={handleChange} step="0.1" />
            <InputField label="Peak Sun Hrs" name="sunlightHours" value={input.sunlightHours} onChange={handleChange} step="0.1" />
          </div>
        </div>
      </div>

      {/* 3. HARDWARE PRESETS */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="px-5 py-3 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-boxes-stacked text-cyan-500/50"></i>
            3. Hardware Grade
          </h3>
        </div>
        <div className="p-4 grid grid-cols-3 gap-2">
          <PresetButton 
            label="Starter" 
            icon="fa-battery-quarter" 
            onClick={() => onApplyPreset('starter')} 
            active={input.inverterCapacity === 3}
          />
          <PresetButton 
            label="Standard" 
            icon="fa-battery-half" 
            onClick={() => onApplyPreset('standard')} 
            active={input.inverterCapacity === 5}
          />
          <PresetButton 
            label="Elite Pro" 
            icon="fa-battery-full" 
            onClick={() => onApplyPreset('pro')} 
            active={input.inverterCapacity === 10}
          />
        </div>
        <div className="p-5 pt-0 grid grid-cols-2 gap-4">
          <InputField label="Inv. Size (kW)" name="inverterCapacity" value={input.inverterCapacity} onChange={handleChange} />
          <InputField label="Bat. Size (kWh)" name="batteryCapacity" value={input.batteryCapacity} onChange={handleChange} step="0.1" />
        </div>
      </div>

      {/* CALCULATE ACTION */}
      <div className="p-6 bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(6,182,212,0.3)] border border-white/20 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-5">
            <div>
              <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Estimate Value</p>
              <p className="text-2xl font-black text-white leading-none">KES {liveStats.runningSubtotal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">System Match</p>
              <p className="text-base font-bold text-white leading-none">{(liveStats.panelQty > 0 ? "Optimal" : "Waiting")}</p>
            </div>
          </div>
          <button
            onClick={onCalculate}
            disabled={isLoading}
            className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {isLoading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <i className="fas fa-bolt-lightning text-cyan-600"></i>
            )}
            {isLoading ? 'Architecting...' : 'Build Full Proposal'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PresetButton = ({ label, icon, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
      active 
        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' 
        : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
    }`}
  >
    <i className={`fas ${icon} mb-2 text-xs opacity-60`}></i>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const InputField = ({ label, name, value, onChange, placeholder, isString, subLabel, step = "1" }: any) => (
  <div className="space-y-1.5 flex-1 min-w-0">
    <div className="flex justify-between items-center gap-2">
      <label className="text-[9px] uppercase font-black text-slate-500 tracking-wider truncate">{label}</label>
      {subLabel && <span className="text-[8px] font-black text-cyan-500/80 uppercase">{subLabel}</span>}
    </div>
    <input
      type={isString ? "text" : "number"}
      step={step}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700 shadow-inner"
    />
  </div>
);

export default InputSection;
