export default function Header({ setView, onLogout }: { setView: (v: any) => void, onLogout: () => void }) {
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
      <h1 className="font-bold text-indigo-600">AppLogo</h1>
      <nav className="flex gap-4 md:gap-8">
        <button onClick={() => setView('game')} className="hover:text-indigo-500 font-medium">Face Match</button>
        <button onClick={() => setView('calendar')} className="hover:text-indigo-500 font-medium">Calendar</button>
        <button onClick={onLogout} className="text-red-500 hover:font-bold transition-all">Logout</button>
      </nav>
    </header>
  );
}