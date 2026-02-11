export default function Header({ user, setView, onLogout }: { user: any, setView: (v: any) => void, onLogout: () => void }) {
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <h1 className="font-extrabold text-indigo-600 text-xl cursor-pointer" onClick={() => setView('dashboard')}>Dashboard</h1>
      <nav className="flex items-center gap-6">
        <button onClick={() => setView('game')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Face Match</button>
        <button onClick={() => setView('calendar')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Calendar</button>
        
        {/* Logout with Profile Tooltip */}
        <div className="relative group">
          <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all">
            Log out
          </button>
          
          {/* Tooltip Card */}
          <div className="absolute right-0 mt-2 w-48 bg-white border shadow-xl rounded-xl p-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
            <p className="text-xs font-bold text-slate-400 uppercase border-b pb-1 mb-2">Signed in as:</p>
            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <p className="text-[10px] text-slate-400 mt-1">{user.phone}</p>
          </div>
        </div>
      </nav>
    </header>
  );
}