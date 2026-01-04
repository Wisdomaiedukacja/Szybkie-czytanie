
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface GlobalTimerProps {
  moduleName: string;
}

const GlobalTimer: React.FC<GlobalTimerProps> = ({ moduleName }) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [moduleTime, setModuleTime] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        setModuleTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Reset module timer when module changes
  useEffect(() => {
    setModuleTime(0);
  }, [moduleName]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sesja:</span>
          <span className="font-mono font-bold text-indigo-600">{formatTime(sessionTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{moduleName}:</span>
          <span className="font-mono font-bold text-emerald-600">{formatTime(moduleTime)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          title={isActive ? "Pauza" : "Start"}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button 
          onClick={() => {setSessionTime(0); setModuleTime(0);}}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          title="Resetuj czas sesji"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

export default GlobalTimer;
