
import React, { useState } from 'react';
import { AlignCenter, MoveVertical, Sparkles, Loader2, Keyboard } from 'lucide-react';
import { generateExerciseText } from '../services/geminiService';

interface ColumnReadingProps {
  age: number;
}

const ColumnReading: React.FC<ColumnReadingProps> = ({ age }) => {
  const [colWidthChars, setColWidthChars] = useState(25);
  const [inputText, setInputText] = useState("Trening szybkiego czytania metodą szpaltową polega na przesuwaniu wzroku wzdłuż środkowej osi wąskiego tekstu. Staraj się objąć cały wiersz jedną fiksacją wzroku, nie poruszając oczami od lewej do prawej. Twój wzrok powinien płynąć pionowo w dół, od góry do dołu szpalty. Taka technika drastycznie zmniejsza liczbę ruchów sakkadowych oka i pozwala mózgowi na niemal natychastowe przetwarzanie całych fraz. Na początku możesz odczuwać dyskomfort, ale to sygnał, że Twoje mięśnie oczu i ośrodki przetwarzania w mózgu adaptują się do nowego, wydajniejszego trybu pracy. Pamiętaj o zachowaniu odpowiedniej odległości od ekranu – ok. 40-50 cm. W tej metodzie kluczowe jest rozluźnienie wzroku, tzw. widzenie obwodowe.");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleGenerate = async (length: 'krótki' | 'średni' | 'długi') => {
    setIsGenerating(length);
    try {
      const text = await generateExerciseText(age, length);
      setInputText(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-2">Czytanie Szpaltowe</h2>
        <p className="text-slate-500">Utrzymuj wzrok na osi środkowej i przesuwaj go tylko pionowo.</p>
      </div>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
        <div>
           <label className="block text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">Tekst do ćwiczenia</label>
           <textarea 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none text-slate-700 leading-relaxed"
             placeholder="Wklej tekst lub wygeneruj poniżej..."
           />
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <span className="text-xs font-bold text-slate-400 uppercase mr-2">Generuj dla {age} l.:</span>
           {(['krótki', 'średni', 'długi'] as const).map(l => (
             <button
               key={l}
               disabled={!!isGenerating}
               onClick={() => handleGenerate(l)}
               className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-black hover:bg-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50 border border-indigo-100"
             >
               {isGenerating === l ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
               {l.charAt(0).toUpperCase() + l.slice(1)}
             </button>
           ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-12">
        <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 w-full max-w-sm flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-indigo-600">
            <Keyboard size={24} />
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Szerokość Szpalty (znaki)</label>
          </div>
          <div className="flex items-center gap-4 w-full">
            <input 
              type="number" 
              min="10" 
              max="100" 
              value={colWidthChars} 
              onChange={(e) => setColWidthChars(parseInt(e.target.value) || 10)}
              className="w-24 p-3 text-2xl font-black text-center text-indigo-700 bg-indigo-50 border-2 border-indigo-200 rounded-2xl focus:border-indigo-500 outline-none"
            />
            <input 
              type="range" min="10" max="100" step="1" 
              value={colWidthChars} onChange={(e) => setColWidthChars(parseInt(e.target.value))}
              className="flex-1 h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        <div className="relative bg-white p-4 shadow-2xl rounded-[40px] border-8 border-slate-50 min-h-[500px] w-full flex justify-center">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-indigo-500/20 -translate-x-1/2 z-0"></div>
          <div 
            className="relative z-10 px-10 py-12 text-center leading-[3.5rem] text-3xl font-medium text-slate-900 break-words font-mono"
            style={{ 
              maxWidth: `${colWidthChars}ch`, 
              width: '100%', 
              margin: '0 auto' 
            }}
          >
            {inputText}
          </div>
          <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 flex flex-col items-center text-indigo-400 opacity-20">
            <MoveVertical size={80} />
            <p className="text-xs font-black uppercase [writing-mode:vertical-lr] tracking-[0.5em] mt-4">PIONOWO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnReading;
