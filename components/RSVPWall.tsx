
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { generateExerciseText } from '../services/geminiService';

interface RSVPWallProps {
  age: number;
}

const RSVPWall: React.FC<RSVPWallProps> = ({ age }) => {
  const [text, setText] = useState('Szybkie czytanie to nie tylko prędkość, ale przede wszystkim sprawność procesów poznawczych. Podczas gdy tradycyjne czytanie opiera się na fiksacjach obejmujących zaledwie kilka liter, trening szybkiego czytania pozwala rozszerzyć to pole do całych wyrazów, a nawet fraz. Kluczem jest wyeliminowanie regresji, czyli niepotrzebnego wracania wzrokiem do już przeczytanych fragmentów. Nasz mózg jest w stanie przetwarzać obrazy znacznie szybciej niż dźwięki, dlatego subvokalizacja, czyli wypowiadanie słów w myślach, jest głównym hamulcem. Metoda RSVP Wall pomaga przełamać ten nawyk, wymuszając stałe tempo i skupiając uwagę na dynamicznie wyróżnionym fragmencie tekstu. Regularne ćwiczenie przez 15 minut dziennie może przynieść spektakularne efekty już po dwóch tygodniach.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(400);
  const [chunkSize, setChunkSize] = useState(1);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const words = text.split(/\s+/);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGenerate = async (length: 'krótki' | 'średni' | 'długi') => {
    setIsGenerating(length);
    try {
      const gText = await generateExerciseText(age, length);
      setText(gText);
      setCurrentIdx(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(null);
    }
  };

  useEffect(() => {
    if (isPlaying && currentIdx < words.length) {
      const interval = (60 / wpm) * 1000 * chunkSize;
      timerRef.current = setTimeout(() => {
        setCurrentIdx(prev => Math.min(prev + chunkSize, words.length));
      }, interval);
    } else if (currentIdx >= words.length) {
      setIsPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentIdx, words.length, wpm, chunkSize]);

  return (
    <div className="space-y-8 flex flex-col">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-2">Ściana Tekstu (RSVP Wall)</h2>
        <p className="text-slate-500">Czytaj wyróżnione słowa na szarym tle.</p>
      </div>

      {/* Controls at the TOP */}
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-6 order-1">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-xs font-black uppercase text-slate-400">WPM:</label>
            <input 
              type="number" 
              value={wpm} 
              onChange={(e) => setWpm(Number(e.target.value))}
              className="w-24 px-4 py-2 border-2 border-slate-100 rounded-xl font-mono font-bold focus:border-indigo-600 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-black uppercase text-slate-400">Słów na raz:</label>
            <input 
              type="number" 
              min="1"
              max="10"
              value={chunkSize} 
              onChange={(e) => setChunkSize(Math.max(1, Number(e.target.value)))}
              className="w-20 px-4 py-2 border-2 border-slate-100 rounded-xl font-mono font-bold focus:border-indigo-600 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => {setIsPlaying(false); setCurrentIdx(0);}}
            className="p-4 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw size={28} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
          </button>
          <div className="text-slate-400 font-mono text-sm font-bold">
             {Math.round((currentIdx/words.length)*100)}%
          </div>
        </div>
      </div>

      {/* Wall of text */}
      <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl border border-slate-100 order-2">
        <div className="leading-loose text-2xl font-medium text-slate-200 select-none flex flex-wrap gap-x-3 gap-y-2">
          {words.map((word, i) => {
            const isHighlighted = i >= currentIdx && i < currentIdx + chunkSize;
            return (
              <span 
                key={i} 
                className={`transition-colors duration-200 ${isHighlighted ? 'text-black font-black underline decoration-indigo-600 decoration-4' : ''}`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 order-3 space-y-6">
        <div>
          <label className="text-xs font-black text-slate-400 uppercase mb-3 block">Twój Tekst</label>
          <textarea 
            value={text}
            onChange={(e) => {setText(e.target.value); setCurrentIdx(0);}}
            className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700"
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

export default RSVPWall;
