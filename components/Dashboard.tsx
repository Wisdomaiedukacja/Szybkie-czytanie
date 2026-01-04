
import React from 'react';
import { TestResult, AppView } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Zap, Brain, TrendingUp, User, Sparkles } from 'lucide-react';

interface DashboardProps {
  results: TestResult[];
  onStartTest: () => void;
  age: number;
  setAge: (age: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ results, onStartTest, age, setAge }) => {
  const lastResult = results[results.length - 1];
  const averageWpm = results.length > 0 
    ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / results.length) 
    : 0;

  const data = results.slice(-10).map((r, i) => ({
    name: `Test ${i + 1}`,
    wpm: r.wpm,
    comprehension: r.comprehension
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Prominent Age Input Section */}
      <div className="bg-sky-100 border-2 border-sky-200 p-8 rounded-[40px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm text-sky-600">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Dostosuj trening do swojego wieku</h2>
            <p className="text-slate-600 font-medium">Algorytmy AI dopasują trudność tekstów i pytań specjalnie dla Ciebie.</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label className="text-xs font-black uppercase text-sky-700 tracking-[0.2em] mb-2">Twój Wiek</label>
          <div className="relative">
            <input 
              type="number" 
              value={age || ''} 
              placeholder="0"
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-32 py-4 px-6 text-4xl font-black text-black bg-white rounded-3xl shadow-inner border-2 border-sky-300 focus:border-sky-500 outline-none text-center transition-all"
              min="5"
              max="120"
            />
            <div className="absolute -right-2 -top-2 bg-yellow-400 p-1.5 rounded-full shadow-lg text-white animate-bounce">
              <Sparkles size={16} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Twój Panel Postępów</h2>
          <p className="text-slate-500">Statystyki Twoich ostatnich sesji treningowych.</p>
        </div>
        <button 
          onClick={onStartTest}
          className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Zap size={24} fill="white" />
          ROZPOCZNIJ TEST WPM
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Ostatni WPM</p>
            <p className="text-2xl font-bold">{lastResult?.wpm || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <Brain size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Ostatnie Rozumienie</p>
            <p className="text-2xl font-bold">{lastResult?.comprehension || 0}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Średni WPM</p>
            <p className="text-2xl font-bold">{averageWpm}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Award className="text-indigo-600" /> Analiza Prędkości Czytania
        </h3>
        <div className="h-64 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="wpm" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Brak danych. Wykonaj pierwszy test, aby zobaczyć wykres postępów.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
