"use client";
import React, { useState, useEffect } from 'react';

export default function Calendar({ userEmail }: { userEmail: string }) {
  const [events, setEvents] = useState<Record<string, any[]>>({}); // Stores as { "2026-10-25": [...] }
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', start: '', end: '' });

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  useEffect(() => {
    const saved = localStorage.getItem(`calendar_${userEmail}`);
    if (saved) setEvents(JSON.parse(saved));
  }, [userEmail]);

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const dayEvents = events[selectedDate] || [];
    const updated = { ...events, [selectedDate]: [...dayEvents, form] };
    setEvents(updated);
    localStorage.setItem(`calendar_${userEmail}`, JSON.stringify(updated));
    setForm({ title: '', start: '', end: '' });
  };

    const isPast = (day: number) => {
        const checkDate = new Date(year, month, day);
        // Using .getTime() ensures we are comparing number vs number
        return checkDate.getTime() < new Date().setHours(0, 0, 0, 0);
    };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4 capitalize">
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today)}
        </h2>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={i} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${month + 1}-${day}`;
            const dayEvents = events[dateStr] || [];
            const past = isPast(day);

            return (
              <div 
                key={day} 
                onClick={() => setSelectedDate(dateStr)}
                className={`h-20 p-1 border rounded-xl cursor-pointer transition-all ${selectedDate === dateStr ? 'ring-2 ring-emerald-500' : ''} ${past ? 'bg-slate-50 opacity-50' : 'hover:bg-emerald-50'}`}
              >
                <span className="text-xs font-bold">{day}</span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((ev, idx) => (
                    <div key={idx} className="text-[8px] bg-emerald-100 text-emerald-700 px-1 rounded truncate">{ev.title}</div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-[8px] text-slate-400">+{dayEvents.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Panel */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border h-fit">
        <h3 className="font-bold mb-4">{selectedDate ? `Events for ${selectedDate}` : 'Select a date'}</h3>
        
        {selectedDate && !isPast(parseInt(selectedDate.split('-')[2])) && (
          <form onSubmit={addEvent} className="mb-6 space-y-3">
            <input placeholder="New Event" className="w-full p-2 border rounded-lg text-sm" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <div className="flex gap-2">
              <input type="time" className="w-full p-2 border rounded-lg text-sm" value={form.start} onChange={e => setForm({...form, start: e.target.value})} required />
              <input type="time" className="w-full p-2 border rounded-lg text-sm" value={form.end} onChange={e => setForm({...form, end: e.target.value})} required />
            </div>
            <button className="w-full bg-emerald-500 text-white py-2 rounded-lg font-bold text-sm">Add Event</button>
          </form>
        )}

        <div className="space-y-2">
          {selectedDate && events[selectedDate]?.map((ev, i) => (
            <div key={i} className="p-2 bg-slate-50 border rounded-lg text-sm">
              <div className="font-bold">{ev.title}</div>
              <div className="text-xs text-slate-500">{ev.start} - {ev.end}</div>
            </div>
          ))}
          {selectedDate && (!events[selectedDate] || events[selectedDate].length === 0) && (
            <p className="text-sm text-slate-400 italic">No events scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
}