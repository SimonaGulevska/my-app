"use client";
import React, { useState, useEffect } from 'react';

export default function MemoryGame({ userEmail }: { userEmail: string }) {
  const faces = ['😀', '😎', '🐸', '🚀', '😀', '😎', '🐸', '🚀'];
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    setCards([...faces].sort(() => Math.random() - 0.5));
    const savedBest = localStorage.getItem(`bestScore_${userEmail}`);
    if (savedBest) setBestScore(parseInt(savedBest));
  }, [userEmail]);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || matched.includes(index) || flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched(prev => {
          const updated = [...prev, ...newFlipped];
          if (updated.length === faces.length) handleWin(moves + 1);
          return updated;
        });
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  const handleWin = (finalMoves: number) => {
    if (!bestScore || finalMoves < bestScore) {
      setBestScore(finalMoves);
      localStorage.setItem(`bestScore_${userEmail}`, finalMoves.toString());
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">Moves: {moves}</p>
          <p className="text-xs text-indigo-600 font-bold uppercase">Best: {bestScore || '--'}</p>
        </div>
        <button onClick={() => window.location.reload()} className="text-sm bg-slate-200 px-3 py-1 rounded-lg">Reset</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((face, i) => (
          <div key={i} onClick={() => handleClick(i)} className={`h-24 flex items-center justify-center text-4xl border rounded-2xl cursor-pointer shadow-sm transition-all ${flipped.includes(i) || matched.includes(i) ? 'bg-white' : 'bg-indigo-500 text-transparent'}`}>
            {flipped.includes(i) || matched.includes(i) ? face : '?'}
          </div>
        ))}
      </div>
    </div>
  );
}