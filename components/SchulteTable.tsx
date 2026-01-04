
import React, { useState, useEffect, useCallback } from 'react';
import { Hash, RefreshCw } from 'lucide-react';

const SchulteTable: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [gridSize, setGridSize] = useState(5); // Default 5x5
  const [grid, setGrid] = useState<number[]>([]);
  const [current, setCurrent] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [time, setTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const initGrid = useCallback(() => {
    const total = gridSize * gridSize;
    const nums = Array.from({ length: total }, (_, i) => i + 1);
    setGrid(nums.sort(() => Math.random() - 0.5));
    setCurrent(1);
    setStartTime(Date.now());
    setTime(0);
    setIsFinished(false);
  }, [gridSize]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (!isFinished && startTime > 0) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [startTime, isFinished]);

  const handleClick = (n: number) => {
    if (n === current) {
      if (n === gridSize * gridSize) {
        setIsFinished(true);
      } else {
        setCurrent(n + 1);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black mb-4">Tabela Schulte</h2>
        <p className="text-slate-500 mb-8">Patrz w sam środek i klikaj liczby w kolejności rosnącej.</p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[3, 4, 5, 6].map(size => (
            <button 
              key={size}
              onClick={() => setGridSize(size)}
              className={`px-6 py-2 rounded-xl font-bold transition-all border-2 ${
                gridSize === size 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-2xl mb-6 shadow-inner border border-indigo-100">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-indigo-400">Szukaj teraz</p>
            <p className="text-3xl font-black text-indigo-700">{current}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400">Czas</p>
            <p className="text-3xl font-mono font-black text-slate-700">{time}s</p>
          </div>
        </div>
      </div>

      <div 
        className="grid gap-2 bg-slate-200 p-2 rounded-2xl shadow-xl overflow-hidden mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: '500px'
        }}
      >
        {grid.map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            className={`aspect-square flex items-center justify-center text-xl font-black transition-all rounded-xl ${
              num < current 
                ? 'bg-indigo-50 text-indigo-200 scale-90 opacity-50' 
                : 'bg-white text-slate-800 hover:bg-indigo-50 active:scale-95 shadow-sm'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {isFinished && (
        <div className="mt-12 text-center animate-in zoom-in bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
          <p className="text-2xl font-black text-emerald-600 mb-6">Ukończono w {time} sekund!</p>
          <div className="flex gap-4 justify-center">
            <button onClick={initGrid} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700">
              <RefreshCw size={20} /> JESZCZE RAZ
            </button>
            <button onClick={onFinish} className="px-10 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold">
              KONIEC
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchulteTable;
