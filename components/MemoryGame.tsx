"use client";
import React, { useState, useEffect } from 'react';

type Level = 'Easy' | 'Medium' | 'Hard';

interface ScoreRecord {
  seconds: number;
  moves: number;
}

const LEVEL_CONFIG = {
  Easy: { pairs: 6, cols: 'grid-cols-4', gridClass: 'max-w-md' },
  Medium: { pairs: 8, cols: 'grid-cols-4', gridClass: 'max-w-lg' },
  Hard: { pairs: 10, cols: 'grid-cols-5', gridClass: 'max-w-2xl' },
};

// UPDATED: Replaced 🤢 with 😍
const EMOJIS = ['😀', '😎', '🤓', '🧐', '🤠', '🤡', '🥳', '😇', '😍', '😡'];

export default function MemoryGame({ userEmail }: { userEmail: string }) {
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'won'>('selection');
  const [level, setLevel] = useState<Level>('Easy');
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [highScores, setHighScores] = useState<Record<string, ScoreRecord>>({});

  useEffect(() => {
    setGameState('selection');
    const saved = localStorage.getItem(`memory_v2_scores_${userEmail}`);
    if (saved) setHighScores(JSON.parse(saved));
  }, [userEmail]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing') {
      timer = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const initGame = (selectedLevel: Level) => {
    const { pairs } = LEVEL_CONFIG[selectedLevel];
    const gameEmojis = EMOJIS.slice(0, pairs);
    const deck = [...gameEmojis, ...gameEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));

    setLevel(selectedLevel);
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setSeconds(0);
    setGameState('playing');
  };

  const handleFlip = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;

      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          if (matchedCards.every(c => c.matched)) handleWin();
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const handleWin = () => {
    setGameState('won');
    const prevBest = highScores[level];
    if (!prevBest || seconds < prevBest.seconds) {
      const newScores = { ...highScores, [level]: { seconds, moves } };
      setHighScores(newScores);
      localStorage.setItem(`memory_v2_scores_${userEmail}`, JSON.stringify(newScores));
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[550px] flex flex-col font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Face Matcher</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">
            {gameState === 'playing' ? `Difficulty: ${level}` : 'Daily Brain Workout'}
          </p>
        </div>
        
        {gameState === 'playing' && (
          <div className="flex gap-2">
            <div className="stats-badge bg-indigo-50 text-indigo-600 border-indigo-100">
              <span className="stats-label">Time</span>
              <span className="stats-value">{seconds}s</span>
            </div>
            <div className="stats-badge bg-emerald-50 text-emerald-600 border-emerald-100">
              <span className="stats-label">Moves</span>
              <span className="stats-value">{moves}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow flex items-center justify-center">
        {gameState === 'selection' && (
          <div className="text-center w-full max-w-md space-y-8">
            <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Choose Your Level</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['Easy', 'Medium', 'Hard'] as Level[]).map((l) => (
                <button key={l} onClick={() => initGame(l)} className="level-card group">
                  <span className="text-lg font-black text-slate-700 group-hover:text-indigo-600">{l}</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-relaxed text-center">
                    {highScores[l] 
                      ? <>Record: {highScores[l].seconds}s <br/> {highScores[l].moves} moves</> 
                      : 'Best: --'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className={`grid ${LEVEL_CONFIG[level].cols} gap-3 sm:gap-4 w-full ${LEVEL_CONFIG[level].gridClass}`}>
            {cards.map((card, index) => (
              <div key={card.id} onClick={() => handleFlip(index)} className="flip-card">
                <div className={`flip-card-inner ${card.flipped || card.matched ? 'flipped' : ''}`}>
                  <div className="flip-card-front bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md" />
                  <div className="flip-card-back bg-white border-2 border-indigo-500 text-3xl">
                    {card.emoji}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {gameState === 'won' && (
          <div className="text-center space-y-6 animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">🥳</div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">Great Job!</h3>
            <div className="flex justify-center gap-6">
               <div className="text-center">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Time</p>
                  <p className="text-2xl font-black text-indigo-600">{seconds}s</p>
               </div>
               <div className="text-center">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Moves</p>
                  <p className="text-2xl font-black text-emerald-600">{moves}</p>
               </div>
            </div>
            <button onClick={() => setGameState('selection')} className="action-btn">New Game</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .stats-badge { display: flex; flex-direction: column; align-items: center; padding: 4px 12px; border-radius: 12px; border: 1px solid; min-w: 70px; }
        .stats-label { font-size: 8px; font-weight: 900; text-transform: uppercase; opacity: 0.7; }
        .stats-value { font-size: 16px; font-weight: 800; font-family: monospace; }
        .level-card { background: white; border: 2px solid #f1f5f9; padding: 16px 10px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; transition: all 0.2s; min-height: 90px; }
        .level-card:hover { border-color: #6366f1; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .flip-card { aspect-ratio: 1/1; perspective: 1000px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); transform-style: preserve-3d; }
        .flipped { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 14px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .flip-card-back { transform: rotateY(180deg); }
        .flip-card-front { border: 2px solid #ffffff33; }
        .action-btn { background: #0f172a; color: white; padding: 12px 36px; border-radius: 14px; font-weight: 900; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; transition: all 0.2s; }
        .action-btn:hover { background: #6366f1; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4); }
      `}</style>
    </div>
  );
}