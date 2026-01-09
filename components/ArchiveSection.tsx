
import React, { useState, useMemo } from 'react';
import { SavedProposal } from '../types';

interface ArchiveSectionProps {
  proposals: SavedProposal[];
  onLoad: (proposal: SavedProposal) => void;
  onDelete: (proposalId: string) => void;
}

const ArchiveSection: React.FC<ArchiveSectionProps> = ({ proposals, onLoad, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProposals = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return proposals.filter(p => 
      (p.input.clientName || '').toLowerCase().includes(term) ||
      (p.input.clientAddress || '').toLowerCase().includes(term) ||
      (p.id || '').toLowerCase().includes(term) ||
      (p.input.location || '').toLowerCase().includes(term)
    );
  }, [proposals, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Proposal Archive</h2>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
            Historical Records • {proposals.length} Projects Stored
          </p>
        </div>
        
        <div className="w-full md:w-96 relative group">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search by Client, Address or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
            />
          </div>
        </div>
      </header>

      {filteredProposals.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
            <i className="fas fa-box-open text-slate-700 text-2xl"></i>
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            {searchTerm ? 'No results found for your query' : 'Archive is empty. Generate a proposal to start.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((p) => (
            <div 
              key={p.id} 
              className="bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md group hover:border-cyan-500/30 transition-all duration-500 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-all"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">{p.id}</p>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate max-w-[200px]">{p.input.clientName || 'Unnamed Client'}</h3>
                  </div>
                  <button 
                    onClick={() => onDelete(p.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500/40 hover:text-red-400 hover:bg-red-500/20 transition-all active:scale-95"
                  >
                    <i className="fas fa-trash-alt text-[10px]"></i>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">System Size</p>
                    <p className="text-sm font-bold text-slate-300">{p.results?.systemSizeKw || 0} kWp</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Project Value</p>
                    <p className="text-sm font-bold text-cyan-400">KES {(p.results?.estimatedRetailPrice || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Site Address</p>
                  <p className="text-[10px] font-bold text-slate-500 truncate">{p.input?.clientAddress || 'No address provided'}</p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500">
                      {(p.createdBy?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">By {p.createdBy || 'Unknown'}</span>
                  </div>
                  <button 
                    onClick={() => onLoad(p)}
                    className="px-4 py-2 bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-600 transition-all"
                  >
                    Load Design <i className="fas fa-chevron-right ml-1"></i>
                  </button>
                </div>

                <p className="text-[7px] font-black text-slate-700 uppercase tracking-[0.2em] text-center pt-2">
                  Generated {new Date(p.timestamp).toLocaleDateString()} at {new Date(p.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveSection;
