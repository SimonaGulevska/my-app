"use client";
import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';
import MemoryGame from '@/components/MemoryGame';
import Calendar from '@/components/Calendar';

type View = 'dashboard' | 'game' | 'calendar';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (session) setUser(JSON.parse(session));
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('session');
    setUser(null);
    setView('dashboard');
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading...</div>;
  if (!user) return <AuthForm onAuth={(u) => setUser(u)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header setView={setView} onLogout={handleLogout} />
      <main className="p-4 md:p-8">
        {view === 'dashboard' && (
          <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div onClick={() => setView('game')} className="bg-white p-10 rounded-3xl shadow-lg border-2 border-transparent hover:border-indigo-500 cursor-pointer transition-all text-center group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
              <h2 className="text-2xl font-bold text-slate-800">Face Matching Game</h2>
              <p className="text-slate-500 mt-2">Test your memory and beat your high score!</p>
            </div>
            <div onClick={() => setView('calendar')} className="bg-white p-10 rounded-3xl shadow-lg border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-all text-center group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📅</div>
              <h2 className="text-2xl font-bold text-slate-800">Event Calendar</h2>
              <p className="text-slate-500 mt-2">Organize your days and track your schedule.</p>
            </div>
          </div>
        )}
        {view === 'game' && <MemoryGame userEmail={user.email} />}
        {view === 'calendar' && <Calendar userEmail={user.email} />}
      </main>
    </div>
  );
}