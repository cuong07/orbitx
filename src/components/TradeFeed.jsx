export function TradeFeed() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-slate-100 font-semibold">Trade Feed</h3>
        <button className="text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200">Clear</button>
      </div>
      <ul className="space-y-1 text-sm">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between">
            <span className="text-slate-400">12:{(10 + i).toString().padStart(2, "0")}:{(20 + i) % 60}</span>
            <span className="text-slate-200">BTCUSDT</span>
            <span className="text-emerald-400">Buy</span>
            <span className="text-slate-200">$ {25000 + i * 7}</span>
            <span className="text-slate-400">Qty 0.{i + 1}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
