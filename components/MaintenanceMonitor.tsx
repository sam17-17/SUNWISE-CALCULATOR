
import React, { useState, useEffect } from 'react';
import { MaintenanceTask, SolarResult } from '../types.ts';

interface MaintenanceMonitorProps {
  results: SolarResult;
}

const MaintenanceMonitor: React.FC<MaintenanceMonitorProps> = ({ results }) => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Generate tasks based on system size
    const initialTasks: MaintenanceTask[] = [
      {
        id: '1',
        title: 'Solar Panel Cleaning',
        interval: 'Every 3 Months',
        description: 'Remove dust and bird droppings to restore up to 25% efficiency.',
        impact: 'High',
        icon: 'fa-soap'
      },
      {
        id: '2',
        title: 'Battery Terminal Inspection',
        interval: 'Every 6 Months',
        description: 'Check for corrosion and ensure tight connections to prevent power loss.',
        impact: 'Medium',
        icon: 'fa-car-battery'
      },
      {
        id: '3',
        title: 'Inverter Ventilation Audit',
        interval: 'Annually',
        description: 'Clean dust filters and check cooling fans to avoid overheating.',
        impact: 'High',
        icon: 'fa-wind'
      },
      {
        id: '4',
        title: 'Structural Check',
        interval: 'Annually',
        description: 'Ensure mounting bolts are secure against high winds/vibrations.',
        impact: 'Low',
        icon: 'fa-screwdriver-wrench'
      }
    ];
    setTasks(initialTasks);
  }, [results]);

  const toggleTask = (id: string) => {
    const newCompleted = new Set(completedIds);
    if (newCompleted.has(id)) newCompleted.delete(id);
    else newCompleted.add(id);
    setCompletedIds(newCompleted);
  };

  const updateReminderDate = (id: string, date: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, reminderDate: date } : task
    ));
  };

  const healthScore = 70 + (completedIds.size / tasks.length) * 30;

  // Find the earliest upcoming reminder date
  const nextServiceDate = tasks
    .filter(t => t.reminderDate)
    .map(t => t.reminderDate!)
    .sort()[0] || 'Set reminders below';

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl h-full flex flex-col">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <i className="fas fa-heart-pulse text-cyan-400"></i>
          </div>
          <div>
            <h3 className="font-black text-xl text-white uppercase tracking-tighter">Maintenance Hub</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Lifecycle Reliability Care</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-cyan-400 leading-none">{Math.round(healthScore)}%</div>
          <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">System Health</div>
        </div>
      </div>

      <div className="p-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5 shadow-inner">
            <p className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Next Critical Date</p>
            <div className="flex items-center gap-3">
              <i className="fas fa-calendar-check text-cyan-500/50"></i>
              <span className="text-sm font-bold text-white">
                {nextServiceDate === 'Set reminders below' ? nextServiceDate : new Date(nextServiceDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5 shadow-inner">
            <p className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Predicted Longevity</p>
            <div className="flex items-center gap-3">
              <i className="fas fa-hourglass-start text-cyan-500/50"></i>
              <span className="text-sm font-bold text-white">24.2 Years Remaining</span>
            </div>
          </div>
        </div>

        <h4 className="text-[10px] uppercase font-black text-slate-500 mb-5 tracking-[0.2em]">Asset Care Schedule</h4>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className={`group p-5 rounded-[1.5rem] border transition-all relative overflow-hidden ${
                completedIds.has(task.id) 
                  ? 'bg-green-500/[0.02] border-green-500/20 opacity-60' 
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex gap-5 relative z-10">
                <div 
                  onClick={() => toggleTask(task.id)}
                  className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center cursor-pointer transition-all shadow-lg ${
                    completedIds.has(task.id) ? 'bg-green-500/20 text-green-400' : 'bg-slate-950 text-slate-500 border border-white/5'
                  }`}
                >
                  <i className={`fas ${task.icon} text-lg`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div onClick={() => toggleTask(task.id)} className="cursor-pointer">
                      <h5 className={`font-black text-base tracking-tight uppercase ${completedIds.has(task.id) ? 'text-green-400 line-through' : 'text-white'}`}>
                        {task.title}
                      </h5>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mt-1 inline-block ${
                        task.impact === 'High' ? 'bg-red-500/20 text-red-400' : 
                        task.impact === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {task.impact} Priority
                      </span>
                    </div>
                    
                    {/* Reminder Date Picker */}
                    <div className="flex flex-col items-end">
                       <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Reminder Date</label>
                       <input 
                         type="date" 
                         value={task.reminderDate || ''}
                         onChange={(e) => updateReminderDate(task.id, e.target.value)}
                         className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 font-bold outline-none focus:border-cyan-500/50 transition-all cursor-pointer invert-calendar-icon"
                       />
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-medium">{task.description}</p>
                  
                  <div className="flex items-center gap-4 mt-4 border-t border-white/5 pt-3">
                    <span className="text-[9px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                      <i className="fas fa-repeat opacity-50"></i> {task.interval}
                    </span>
                    {completedIds.has(task.id) ? (
                      <span className="text-[9px] font-black text-green-500 flex items-center gap-1.5 uppercase tracking-widest">
                        <i className="fas fa-check-circle"></i> Completed
                      </span>
                    ) : task.reminderDate && (
                      <span className="text-[9px] font-black text-cyan-500 flex items-center gap-1.5 uppercase tracking-widest animate-pulse">
                        <i className="fas fa-clock"></i> Scheduled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
            <i className="fas fa-info-circle text-cyan-400 text-xs"></i>
          </div>
          <p className="text-[11px] text-cyan-100/40 leading-relaxed italic font-medium">
            Strategic advice: Setting custom reminders for dust removal during the dry season (Jan-March) can maximize your energy harvest by over 18% in the Kenyan region.
          </p>
        </div>
      </div>
      
      <style>{`
        .invert-calendar-icon::-webkit-calendar-picker-indicator {
          filter: invert(0.6) sepia(1) saturate(5) hue-rotate(175deg);
        }
      `}</style>
    </div>
  );
};

export default MaintenanceMonitor;
