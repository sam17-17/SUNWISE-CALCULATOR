
import React from 'react';
import { AIAdvice } from '../types';

interface AIAdviceSectionProps {
  advice: AIAdvice;
}

const AIAdviceSection: React.FC<AIAdviceSectionProps> = ({ advice }) => {
  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md h-full">
      <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
          <i className="fas fa-brain text-cyan-400"></i>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-none">AI Insight Hub</h3>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Smart System Optimization</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div>
          <h4 className="text-[10px] uppercase font-black text-slate-500 mb-3 tracking-widest">Executive Summary</h4>
          <p className="text-white leading-relaxed font-medium bg-slate-950/50 p-5 rounded-2xl border border-white/5 italic">
            "{advice.summary}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Hardware Tech</h4>
            <p className="text-sm font-bold text-cyan-400">{advice.panelTypeRecommendation}</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Local Strategy</h4>
            <p className="text-[11px] leading-tight text-slate-400">{advice.financialInsights}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <h4 className="text-[10px] uppercase font-black text-slate-500 mb-4 tracking-widest">Technical Directives</h4>
          <div className="grid grid-cols-1 gap-3">
            {advice.maintenanceTips.map((tip, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors group">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-950 border border-white/10 text-cyan-400 flex items-center justify-center font-black text-[10px]">
                  0{idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-snug font-medium group-hover:text-white transition-colors">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdviceSection;
