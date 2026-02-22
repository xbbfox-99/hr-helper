
import React, { useState, useEffect, useRef } from 'react';
import { Person, DrawResult } from '../types';

interface Props {
  people: Person[];
}

const LuckyDraw: React.FC<Props> = ({ people }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [canRepeat, setCanRepeat] = useState(false);
  const [availablePool, setAvailablePool] = useState<Person[]>([]);
  const [winners, setWinners] = useState<DrawResult[]>([]);
  const [currentWinner, setCurrentWinner] = useState<Person | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setAvailablePool(people);
  }, [people]);

  const startDraw = () => {
    if (availablePool.length === 0) {
      alert("名單已空！");
      return;
    }

    setIsDrawing(true);
    setCurrentWinner(null);
    let speed = 50;
    let count = 0;
    const maxCount = 30 + Math.floor(Math.random() * 20);

    const animate = () => {
      setDisplayIndex(prev => (prev + 1) % availablePool.length);
      count++;
      
      if (count < maxCount) {
        timerRef.current = window.setTimeout(animate, speed);
        // Gradually slow down
        if (count > maxCount * 0.7) speed += 20;
      } else {
        const winnerIndex = Math.floor(Math.random() * availablePool.length);
        const winner = availablePool[winnerIndex];
        
        setCurrentWinner(winner);
        setWinners(prev => [{ timestamp: Date.now(), winner }, ...prev]);
        
        if (!canRepeat) {
          setAvailablePool(prev => prev.filter(p => p.id !== winner.id));
        }
        
        setIsDrawing(false);
      }
    };

    animate();
  };

  const resetPool = () => {
    setAvailablePool(people);
    setWinners([]);
    setCurrentWinner(null);
  };

  if (people.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">請先建立名單</h2>
        <p className="text-slate-500">名單為空時無法進行抽籤</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">幸運大抽獎</h2>
        
        <div className="relative h-48 flex items-center justify-center mb-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="grid grid-cols-10 gap-2 p-2">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="w-full h-8 bg-white/30 rounded-full blur-sm animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-white">
            {isDrawing ? (
              <div className="text-5xl font-black tracking-widest animate-bounce">
                {availablePool[displayIndex]?.name}
              </div>
            ) : currentWinner ? (
              <div className="animate-in fade-in zoom-in duration-500 text-center">
                <div className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">恭喜中獎者</div>
                <div className="text-6xl font-black drop-shadow-md">{currentWinner.name}</div>
              </div>
            ) : (
              <div className="text-4xl font-bold text-white/50">準備就緒</div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-12 h-6 rounded-full transition-colors relative ${canRepeat ? 'bg-indigo-600' : 'bg-slate-200'}`}>
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={canRepeat}
                onChange={() => setCanRepeat(!canRepeat)}
              />
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${canRepeat ? 'translate-x-6' : ''}`}></div>
            </div>
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">允許重複抽中</span>
          </label>

          <div className="text-sm text-slate-400">
            剩餘名單: <span className="text-indigo-600 font-bold">{availablePool.length}</span> / {people.length}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={startDraw}
            disabled={isDrawing || availablePool.length === 0}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-5 px-10 rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95 text-xl"
          >
            {isDrawing ? '抽籤中...' : '開始抽籤'}
          </button>
          <button
            onClick={resetPool}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-5 px-6 rounded-2xl transition-all"
            title="重置"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      {winners.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">中獎紀錄</h3>
          <div className="space-y-2">
            {winners.map((res, i) => (
              <div key={res.timestamp} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full flex items-center justify-center">
                    {winners.length - i}
                  </span>
                  <span className="font-bold text-slate-700">{res.winner.name}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(res.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
