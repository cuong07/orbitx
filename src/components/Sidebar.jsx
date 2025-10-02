import { useTradingStore } from "@/stores/useTradingStore";

export function Sidebar() {
  const { setCurrentSymbol } = useTradingStore();
  return (
    <aside className="w-56 border-r border-slate-800 p-3 hidden md:flex flex-col gap-3">
      <div>
        <div className="text-xs uppercase text-slate-400 mb-2">Watchlist</div>
        <ul className="space-y-1">
          {["btcusdt", "ethusdt"].map(s => (
            <li key={s} className="flex items-center justify-between bg-slate-900 hover:bg-slate-800 rounded-md px-2 py-1.5 cursor-pointer"
              onClick={setCurrentSymbol(s)}
            >
              <span className="text-slate-200 text-sm">{s}</span>
              <span className="text-emerald-400 text-xs">+1.2%</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="text-xs uppercase text-slate-400 mb-2">Indicators</div>
        <div className="flex flex-wrap gap-2">
          {["EMA", "VWAP", "RSI", "MACD"].map(i => (
            <button key={i} className="text-xs px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200">
              {i}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}