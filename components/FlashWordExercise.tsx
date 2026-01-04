
import React, { useState, useEffect, useRef } from 'react';
import { Eye, RefreshCw, XCircle } from 'lucide-react';

const wordsSource = [
  'kot', 'dom', 'las', 'pies', 'ryba',
  'rower', 'szkoła', 'miasto', 'drzewo', 'książka',
  'komputer', 'internet', 'samolot', 'podróże', 'przyjaźń',
  'technologia', 'automatyzacja', 'programowanie', 'inteligencja', 'wszechświat',
  'zrozumienie tekstu', 'szybkie czytanie', 'trening wzroku', 'pole widzenia', 'analiza słów'
];

const FlashWordExercise: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'ready' | 'flash' | 'pause' | 'reveal'>('ready');
  const [currentContent, setCurrentContent] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRound = () => {
    // Progression: 
    // Rounds 1-3: Single words, increasing length
    // Rounds 4-6: Long single words
    // Rounds 7-9: Pairs of words
    
    let content = "";
    if (round <= 3) {
      const filtered = wordsSource.filter(w => w.length <= 6 && !w.includes(' '));
      content = filtered[Math.floor(Math.random() * filtered.length)];
    } else if (round <= 6) {
      const filtered = wordsSource.filter(w => w.length > 7 && !w.includes(' '));
      content = filtered[Math.floor(Math.random() * filtered.length)];
    } else {
      const w1 = wordsSource[Math.floor(Math.random() * 10)];
      const w2 = wordsSource[Math.floor(Math.random() * 10) + 10];
      content = `${w1} ${w2}`;
    }

    setCurrentContent(content);
    setPhase('flash');

    // 0.5s visibility
    timerRef.current = setTimeout(() => {
      setPhase('pause');
      // 4s wait (changed from 5s)
      timerRef.current = setTimeout(() => {
        setPhase('reveal');
      }, 4000);
    }, 500);
  };

  const nextRound = () => {
    if (round < 9) {
      setRound(round + 1);
      setPhase('ready');
    } else {
      setIsFinished(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (isFinished) {
    return (
      <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-4">Seria ukończona!</h2>
        <p className="text-slate-500 mb-8">Twoja percepcja błyskawiczna staje się ostrzejsza.</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => { setIsFinished(false); setRound(1); setPhase('ready'); }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg"
          >
            <RefreshCw size={20} /> Kolejna Seria
          </button>
          <button 
            onClick={onFinish}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl flex items-center gap-2 hover:bg-slate-200"
          >
            <XCircle size={20} /> Zakończ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Błysk Słów</h2>
        <p className="text-slate-500">Zapamiętaj to, co zobaczysz przez pół sekundy.</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          Runda {round} / 9
        </div>
      </div>

      <div className="h-64 flex items-center justify-center bg-white rounded-[40px] border-4 border-slate-100 relative overflow-hidden shadow-2xl">
        {phase === 'ready' && (
          <button 
            onClick={startRound}
            className="group relative px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-2xl hover:scale-105 transition-all shadow-xl shadow-indigo-100"
          >
            <span className="relative z-10">BŁYSK!</span>
            <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500"></div>
          </button>
        )}

        {phase === 'flash' && (
          <div className="text-5xl font-black text-slate-900 tracking-tight animate-in fade-in zoom-in duration-75">
            {currentContent}
          </div>
        )}

        {phase === 'pause' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Analiza...</p>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="animate-in slide-in-from-bottom duration-300">
            <p className="text-xs uppercase text-slate-400 font-black mb-3 tracking-[0.2em]">Odsłonięto:</p>
            <div className="text-5xl font-black text-indigo-600 tracking-tight">
              {currentContent}
            </div>
          </div>
        )}
      </div>

      {phase === 'reveal' && (
        <button 
          onClick={nextRound}
          className="mt-12 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-black transition-all"
        >
          NASTĘPNE
        </button>
      )}
    </div>
  );
};

export default FlashWordExercise;
