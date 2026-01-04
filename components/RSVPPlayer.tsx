
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { generateExerciseText } from '../services/geminiService';

interface RSVPPlayerProps {
  age: number;
}

const RSVPPlayer: React.FC<RSVPPlayerProps> = ({ age }) => {
  const [text, setText] = useState('Prawdziwe szybkie czytanie polega na eliminacji regresji i subvokalizacji. Ćwicząc z metodą RSVP, uczysz swój mózg szybszego przetwarzania znaków graficznych bez konieczności wypowiadania ich w myślach. Twoje oczy skupiają się w jednym punkcie, a mózg wykonuje całą pracę. Regularny trening pozwoli Ci podwoić prędkość czytania w ciągu zaledwie kilku tygodni.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const [wordIdx, setWordIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const words = text.split(/\s+/);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGenerate = async (length: 'krótki' | 'średni' | 'długi') => {
    setIsGenerating(length);
    try {
      const gText = await generateExerciseText(age, length);
      setText(gText);
      setWordIdx(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(null);
    }
  };

  useEffect(() => {
    if (isPlaying && wordIdx < words.length) {
      const interval = (60 / wpm) * 1000;
      timerRef.current = setTimeout(() => {
        setWordIdx(prev => prev + 1);
      }, interval);
    } else if (wordIdx >= words.length) {
      setIsPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, wordIdx, words.length, wpm]);

  const reset = () => {
    setIsPlaying(false);
    setWordIdx(0);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-2">RSVP Player Classic</h2>
        <p className="text-slate-500">Eliminacja subvokalizacji przez skupienie na jednym punkcie.</p>
      </div>

      <div className="h-48 flex items-center justify-center bg-white border-8 border-slate-100 rounded-[40px] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-400/30 -translate-x-1/2 pointer-events-none"></div>
        <div className="text-5xl md:text-6xl font-black text-black tracking-tight mono">
          {wordIdx < words.length ? words[wordIdx] : 'KONIEC'}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 w-full">
          <label className="text-xs font-black text-slate-400 uppercase mb-3 block">Szybkość: {wpm} WPM</label>
          <input 
            type="range" min="100" max="1200" step="50"
            value={wpm} onChange={(e) => setWpm(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={reset} className="p-4 text-slate-400 hover:text-indigo-600 transition-colors">
            <RotateCcw size={28} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-200 hover:scale-110 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
          </button>
          <div className="bg-slate-50 px-4 py-2 rounded-xl text-slate-500 font-mono text-sm border border-slate-100">
            {wordIdx} / {words.length}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="text-xs font-black text-slate-400 uppercase mb-3 block">Źródło Tekstu</label>
          <textarea 
            value={text}
            onChange={(e) => {setText(e.target.value); setWordIdx(0);}}
            className="w-full h-40 p-6 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all text-black font-medium text-lg leading-relaxed"
            placeholder="Wklej tutaj swój tekst..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <span className="text-xs font-bold text-slate-400 uppercase mr-2">Generuj dla {age} l.:</span>
           {(['krótki', 'średni', 'długi'] as const).map(l => (
             <button
               key={l}
               disabled={!!isGenerating}
               onClick={() => handleGenerate(l)}
               className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
             >
               {isGenerating === l ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
               {l.charAt(0).toUpperCase() + l.slice(1)}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default RSVPPlayer;
