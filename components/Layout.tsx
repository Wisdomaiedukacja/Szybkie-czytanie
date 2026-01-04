
import React from 'react';
import { AppView } from '../types';
import { BookOpen, Target, LayoutGrid, Eye, Hash, Play, Home, AlignLeft, Maximize } from 'lucide-react';
import GlobalTimer from './GlobalTimer';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Panel Startowy', icon: Home },
    { id: AppView.SPEED_TEST, label: '1. Test WPM + Quiz', icon: BookOpen },
    { id: AppView.VIEW_FIELD_TEST, label: '2. Test Pola Widzenia', icon: Maximize },
    { id: AppView.PERIPHERAL_GRID, label: 'Siatka Liter', icon: LayoutGrid },
    { id: AppView.FLASH_WORDS, label: 'Błysk Słów', icon: Eye },
    { id: AppView.SCHULTE_TABLE, label: 'Tabela Schulte', icon: Hash },
    { id: AppView.RSVP, label: 'RSVP Player Classic', icon: Play },
    { id: AppView.RSVP_WALL, label: 'RSVP Ściana Tekstu', icon: AlignLeft },
    { id: AppView.COLUMN_READING, label: 'Czytanie Szpaltowe', icon: AlignLeft },
  ];

  const currentModuleLabel = navItems.find(i => i.id === currentView)?.label || "Trening";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <nav className="w-full md:w-72 bg-white border-r border-slate-200 p-4 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2 px-4 py-6 mb-4">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
            <Target className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">SwiftReader Pro</h1>
        </div>
        
        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                currentView === item.id 
                  ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        <GlobalTimer moduleName={currentModuleLabel} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
