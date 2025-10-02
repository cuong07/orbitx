export function Topbar() {
  return (
    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-slate-100">PaperTrade</span>
        <span className="text-xs text-slate-400 ml-2 hidden sm:block">demo layout</span>
      </div>

      <div className="flex items-center gap-2 w-full max-w-lg">
        <input
          className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 ring-indigo-500"
          placeholder="Search symbol (e.g. BTCUSDT, AAPL)"
        />
        <div className="hidden md:flex items-center gap-1">
          {["1m", "5m", "15m", "1h", "4h", "1D"].map(tf => (
            <button
              key={tf}
              className="px-2 py-1 text-xs rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-500 text-white">
          Connect
        </button>
      </div>
    </header>
  );
}