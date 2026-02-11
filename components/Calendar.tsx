"use client";
import React, { useState, useEffect } from 'react';

export default function Calendar({ userEmail }: { userEmail: string }) {
  const [events, setEvents] = useState<Record<string, any[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', start: '', end: '', isImportant: false });
  const [navDate, setNavDate] = useState(new Date());

  const year = navDate.getFullYear();
  const month = navDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  useEffect(() => {
    const saved = localStorage.getItem(`calendar_${userEmail}`);
    if (saved) setEvents(JSON.parse(saved));
  }, [userEmail]);

  const changeMonth = (offset: number) => {
    setNavDate(new Date(year, month + offset, 1));
  };

  // --- NEW: TODAY HANDLER ---
  // Navigates the calendar view AND automatically selects the current day
  const handleGoToToday = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    setNavDate(now);
    setSelectedDate(todayStr);
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    
    // --- NEW: PAST TIME VALIDATION ---
    // Prevent adding events if the time has already passed for today
    if (selectedDate === todayStr) {
      const [hours, minutes] = form.start.split(':').map(Number);
      const eventStartTime = new Date();
      eventStartTime.setHours(hours, minutes, 0, 0);

      if (eventStartTime < now) {
        alert("⚠️ You cannot schedule an event for a time that has already passed today!");
        return;
      }
    }

    const dayEvents = events[selectedDate] || [];
    
    // --- CONFLICT VALIDATION ---
    const hasConflict = dayEvents.some(ev => (form.start < ev.end && form.end > ev.start));
    
    if (hasConflict) {
      alert("⚠️ Time Conflict: This slot is already booked!");
      return;
    }
    if (form.start >= form.end) {
      alert("End time must be after start time.");
      return;
    }
    // ---------------------------

    const updatedList = [...dayEvents, { ...form, id: Date.now() }];
    updatedList.sort((a, b) => a.start.localeCompare(b.start));

    const updatedEvents = { ...events, [selectedDate]: updatedList };
    setEvents(updatedEvents);
    localStorage.setItem(`calendar_${userEmail}`, JSON.stringify(updatedEvents));
    setForm({ title: '', start: '', end: '', isImportant: false });
  };

  const deleteEvent = (dateStr: string, eventId: number) => {
    const updatedEvents = { ...events, [dateStr]: events[dateStr].filter(ev => ev.id !== eventId) };
    setEvents(updatedEvents);
    localStorage.setItem(`calendar_${userEmail}`, JSON.stringify(updatedEvents));
  };

  const isPast = (day: number) => {
    const checkDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 h-[75vh] min-h-[550px]">
      
      {/* LEFT COLUMN: CALENDAR GRID */}
      <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-slate-800 capitalize flex items-center gap-2">
            <span className="text-emerald-500 text-lg">📅</span>
            {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(navDate)}
          </h2>
          <div className="flex gap-1">
            <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-slate-100 rounded-full text-sm transition-colors">◀</button>
            <button 
              onClick={handleGoToToday} 
              className="px-2 py-1 text-[10px] font-bold uppercase text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Today
            </button>
            <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-slate-100 rounded-full text-sm transition-colors">▶</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>

        {/* COMPACT DAY FIELDS */}
        <div className="grid grid-cols-7 gap-1 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={i} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${month + 1}-${day}`;
            const dayEvents = events[dateStr] || [];
            const past = isPast(day);

            return (
              <div 
                key={dateStr} 
                onClick={() => setSelectedDate(dateStr)}
                className={`min-h-[60px] p-1 border rounded-lg cursor-pointer transition-all flex flex-col ${
                  selectedDate === dateStr ? 'ring-2 ring-indigo-500 bg-indigo-50/20 shadow-inner' : 'border-slate-50 hover:bg-slate-50 bg-white'
                } ${past ? 'opacity-50 grayscale-[0.2]' : 'shadow-sm'}`}
              >
                <span className={`text-[10px] font-bold mb-0.5 ${selectedDate === dateStr ? 'text-indigo-600' : 'text-slate-400'}`}>{day}</span>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev, idx) => (
                    <div key={ev.id || idx} className={`text-[7px] px-1 py-0.5 rounded-sm truncate font-bold leading-none ${
                      ev.isImportant ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ev.isImportant && "🔔"}{ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-[7px] text-slate-400 font-bold leading-none mt-0.5 pl-0.5">+{dayEvents.length - 2}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: SCHEDULE PANEL */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex-shrink-0 bg-white">
          <h3 className="font-bold text-slate-800 mb-3 truncate text-base">
            {selectedDate ? `Schedule: ${selectedDate}` : 'Select a date'}
          </h3>

          {selectedDate && !isPast(parseInt(selectedDate.split('-')[2])) ? (
            <form onSubmit={addEvent} className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-inner">
              <input 
                placeholder="Event Title" 
                className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-emerald-500 bg-white transition-all" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                required 
              />
              <div className="flex gap-2">
                <input type="time" className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none bg-white font-medium" value={form.start} onChange={e => setForm({...form, start: e.target.value})} required />
                <input type="time" className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none bg-white font-medium" value={form.end} onChange={e => setForm({...form, end: e.target.value})} required />
              </div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 cursor-pointer px-1">
                <input type="checkbox" checked={form.isImportant} onChange={e => setForm({...form, isImportant: e.target.checked})} className="accent-amber-500" />
                IMPORTANT 🔔
              </label>
              <button className="w-full bg-slate-900 text-white py-2 rounded-xl font-bold text-[10px] hover:bg-emerald-600 transition-colors uppercase tracking-widest shadow-md active:scale-95">
                Save Event
              </button>
            </form>
          ) : selectedDate && (
            <div className="p-3 bg-indigo-50 text-indigo-700 text-[10px] rounded-xl border border-indigo-100 font-bold text-center italic">
              View Only Mode
            </div>
          )}
        </div>

        {/* INTERNAL SLIDER AREA */}
        <div className="flex-grow overflow-y-auto pl-4 pr-3 py-4 space-y-2 bg-slate-50/10 custom-scrollbar">
          {selectedDate && (events[selectedDate]?.length > 0 ? (
            events[selectedDate].map((ev, i) => (
              <div key={ev.id || i} className={`p-2.5 border rounded-xl flex justify-between items-center group transition-all animate-in slide-in-from-right-1 ${
                ev.isImportant ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 text-[11px] truncate flex items-center gap-1">
                    {ev.isImportant && <span className="text-amber-500 text-[10px]">🔔</span>}
                    {ev.title}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono font-medium">{ev.start} - {ev.end}</div>
                </div>
                <button 
                  onClick={() => deleteEvent(selectedDate, ev.id)} 
                  className="text-slate-300 hover:text-red-500 transition-opacity p-1 group-hover:opacity-100 opacity-0"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            selectedDate && <p className="text-center text-slate-300 text-[11px] py-10 italic">No events scheduled.</p>
          ))}
        </div>
      </div>

      {/* STYLES - CUSTOM SLIDER */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 10px; 
          border: 2px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}