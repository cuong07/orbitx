import React from 'react';
import Chart from "./components/Chart";
import { ChartArea } from "./components/ChartArea";
import { MarketList } from "./components/MarketList";
import { OrderBook } from "./components/OrderBook";
import { OrderPanel } from "./components/OrderPanel";
import PositionsTable from "./components/PositionsTable";
import { TradingHeader } from "./components/TradingHeader";
import { useTradingStore } from './stores/useTradingStore';
function App() {
  const { currentPrice, priceChange, priceChangePercent, currentSymbol, timeframe } = useTradingStore();
  return (
    <div className="min-h-screen text-slate-100">
      <TradingHeader symbol={currentSymbol} change={priceChange} changePercent={priceChangePercent} price={currentPrice} />
      <div className="flex">
        <div className="w-64 flex-shrink-0">
          <MarketList />
        </div>
        <main className="flex-1 p-3 md:p-4 space-y-3">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
            <div className="xl:col-span-9 rounded-xl p-2">
              <ChartArea>
                <Chart symbol={currentSymbol} timeframe={timeframe} />
              </ChartArea>
              <PositionsTable />
            </div>
            <div className="xl:col-span-3 space-y-3">
              <OrderPanel />
              <OrderBook />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default App;
