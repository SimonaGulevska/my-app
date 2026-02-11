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

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem('session');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('session');
    setUser(null);
    setView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse font-medium text-indigo-600">Loading Dashboard...</div>
      </div>
    );
  }

  // If no user is found in localStorage, show the Registration/Login form
  if (!user) {
    return <AuthForm onAuth={(u: any) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-500">
      {/* Passing 'user' prop here allows the Header to show 
          the Name, Email, and Phone on hover as requested.
      */}
      <Header user={user} setView={setView} onLogout={handleLogout} />

      <main className="p-4 md:p-8">
        {view === 'dashboard' && (
          <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Game Card */}
            <div 
              onClick={() => setView('game')} 
              className="bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer transition-all text-center group active:scale-95"
            >
              <div className="text-6xl mb-4 group-hover:rotate-12 transition-transform duration-300">🎮</div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Face Matching Game</h2>
              <p className="text-slate-500 mt-2">Test your memory and beat your personal high score!</p>
            </div>

            {/* Calendar Card */}
            <div 
              onClick={() => setView('calendar')} 
              className="bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer transition-all text-center group active:scale-95"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📅</div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Event Calendar</h2>
              <p className="text-slate-500 mt-2">Manage your daily schedule and arrange your events.</p>
            </div>

          </div>
        )}

        {/* View Container */}
        <div className="animate-in fade-in duration-500">
          {view === 'game' && <MemoryGame userEmail={user.email} />}
          {view === 'calendar' && <Calendar userEmail={user.email} />}
        </div>
      </main>
    </div>
  );
}