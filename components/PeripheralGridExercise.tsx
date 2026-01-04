
import React, { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, RefreshCw, XCircle } from 'lucide-react';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const PeripheralGridExercise: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [round, setRound] = useState(1);
  const [grid, setGrid] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [gridSize, setGridSize] = useState(400); // Width in px

  const generateGrid = useCallback(() => {
    // Generate sequential letters
    const startIndex = Math.floor(Math.random() * (alphabet.length - 9));
    const newGrid = alphabet.slice(startIndex, startIndex + 9);
    
    // Swap middle letter to be the one at index 4 (center)
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    generateGrid();
  }, [round, generateGrid]);

  const nextRound = () => {
    if (round < 9) {
      setRound(round + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-4">Seria ukończona!</h2>
        <p className="text-slate-500 mb-8">Twoje pole widzenia staje się coraz szersze.</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => { setIsFinished(false); setRound(1); generateGrid(); }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
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
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-2">Rozszerzanie Pola Analizy</h2>
        <p className="text-slate-500 text-sm">Skup wzrok na <span className="text-indigo-600 font-bold">środkowej literze</span> i staraj się dostrzec pozostałe litery sekwencji.</p>
        <p className="mt-4 font-bold text-indigo-600">Runda {round} / 9</p>
      </div>

      <div className="mb-10 w-full max-w-xs">
        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Wielkość obszaru: {gridSize}px</label>
        <input 
          type="range" min="200" max="800" step="10" 
          value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      <div 
        className="grid grid-cols-3 gap-4 p-4 bg-white rounded-3xl border border-slate-200 shadow-xl transition-all duration-300"
        style={{ width: `${gridSize}px`, height: `${gridSize}px` }}
      >
        {grid.map((letter, idx) => (
          <div 
            key={idx}
            className={`flex items-center justify-center text-4xl font-black rounded-2xl transition-all ${
              idx === 4 
                ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-100 scale-110 z-10' 
                : 'text-black opacity-100' // Changed color to black as requested
            }`}
          >
            {letter}
          </div>
        ))}
      </div>

      <button 
        onClick={nextRound}
        className="mt-12 w-full max-w-md bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transform active:scale-95 transition-all"
      >
        Następna Tabela
      </button>
    </div>
  );
};

export default PeripheralGridExercise;
