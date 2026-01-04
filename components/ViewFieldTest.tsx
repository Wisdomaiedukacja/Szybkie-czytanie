
import React, { useState } from 'react';
import { Eye, Check, RefreshCw } from 'lucide-react';

const wordsShort = ['kot', 'dom', 'las', 'pies', 'ryba', 'okno', 'stół', 'kura', 'mleko', 'serce'];
const wordsMed = ['drzewo', 'szkoła', 'miasto', 'książka', 'zeszyt', 'lampka', 'zespół', 'pociąg', 'rowerzysta'];
const wordsLong = ['komputer', 'internet', 'samolot', 'podróże', 'przyjaźń', 'biblioteka', 'architektura', 'uniwersytet'];
const wordsExtraLong = ['elektryczność', 'oprogramowanie', 'telekomunikacja', 'odpowiedzialność', 'charakterystyka'];

const ViewFieldTest: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState<'ready' | 'show' | 'input' | 'result'>('ready');
  const [currentString, setCurrentString] = useState('');
  const [userInput, setUserInput] = useState('');
  const [maxChars, setMaxChars] = useState(0);

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const generateLevelString = (lvl: number) => {
    // Progression logic based on user request:
    // 1-2: 1 short
    // 3-4: 1 med
    // 5-6: 1 long
    // 7-8: 1 extra long
    // 9-10: 2 short
    // 11-12: 2 med
    // 13-14: 3 short
    // 15-16: 3 med
    // ...
    if (lvl <= 2) return getRandom(wordsShort);
    if (lvl <= 4) return getRandom(wordsMed);
    if (lvl <= 6) return getRandom(wordsLong);
    if (lvl <= 8) return getRandom(wordsExtraLong);
    
    if (lvl <= 10) return `${getRandom(wordsShort)} ${getRandom(wordsShort)}`;
    if (lvl <= 12) return `${getRandom(wordsMed)} ${getRandom(wordsMed)}`;
    
    const wordCount = Math.floor((lvl - 9) / 4) + 2;
    const type = (lvl % 2 === 0) ? wordsMed : wordsShort;
    
    let result = [];
    for(let i=0; i < wordCount; i++) result.push(getRandom(type));
    return result.join(' ');
  };

  const startLevel = () => {
    const str = generateLevelString(level);
    setCurrentString(str);
    setPhase('show');
    // Flash duration is 400ms
    setTimeout(() => {
      setPhase('input');
      setUserInput('');
    }, 400);
  };

  const checkAnswer = () => {
    const cleanCurrent = currentString.toLowerCase().replace(/\s/g, '');
    const cleanInput = userInput.toLowerCase().replace(/\s/g, '');
    
    if (cleanCurrent === cleanInput) {
      const charCount = currentString.length;
      if (charCount > maxChars) setMaxChars(charCount);
      setLevel(level + 1);
      setPhase('ready');
    } else {
      setPhase('result');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 text-center">
      <div>
        <h2 className="text-3xl font-black mb-2">Test Pola Widzenia</h2>
        <p className="text-slate-500">Zidentyfikuj słowa pojawiające się błyskawicznie.</p>
      </div>

      <div className="h-64 flex items-center justify-center bg-white rounded-[40px] border-4 border-slate-50 shadow-2xl relative">
        {phase === 'ready' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-bold text-slate-400">Poziom {level}</p>
            <button onClick={startLevel} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-lg">
               POKAŻ SŁOWA
            </button>
          </div>
        )}

        {phase === 'show' && (
          <div className="text-4xl font-black text-black tracking-wider animate-in fade-in duration-75">
            {currentString}
          </div>
        )}

        {phase === 'input' && (
          <div className="space-y-4 w-full max-w-sm px-4">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Co widziałeś?</p>
             <input 
               autoFocus
               type="text" 
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
               className="w-full p-4 border-4 border-slate-100 rounded-2xl text-center text-2xl font-black outline-none focus:border-indigo-600 transition-all"
               placeholder="..."
             />
             <button onClick={checkAnswer} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">SPRAWDŹ</button>
          </div>
        )}

        {phase === 'result' && (
          <div className="animate-in zoom-in px-6">
             <p className="text-sm font-black text-red-500 uppercase mb-2">Błąd w słowie!</p>
             <p className="text-xs text-slate-400 mb-4">Poprawne: <span className="font-bold text-slate-600">{currentString}</span></p>
             <h3 className="text-2xl font-black mb-6">Twoje pole widzenia: {maxChars} znaków</h3>
             <button onClick={() => {setLevel(1); setMaxChars(0); setPhase('ready');}} className="flex items-center gap-2 mx-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all">
               <RefreshCw size={18} /> PONÓW TEST
             </button>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
         <div className="flex justify-around">
            <div className="text-center">
               <p className="text-[10px] font-black uppercase text-slate-400">Poziom</p>
               <p className="text-2xl font-black text-indigo-600">{level}</p>
            </div>
            <div className="text-center">
               <p className="text-[10px] font-black uppercase text-slate-400">Pole (znaki)</p>
               <p className="text-2xl font-black text-emerald-600">{maxChars}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ViewFieldTest;
