import React, { useState, useEffect } from 'react';
import { TradingHeader } from '@/components/TradingHeader';
import { MarketList } from '@/components/MarketList';
import { ChartArea } from '@/components/ChartArea';
import Chart from '@/components/Chart';
import PositionsTable from '@/components/PositionsTable';
import { OrderPanel } from '@/components/OrderPanel';
import { OrderBook } from '@/components/OrderBook';
import { useTradingStore } from '@/stores/useTradingStore';
import { Toaster } from 'sonner';
import { ThunderLoader } from '@/components/ui/thunder-loader';

function TradingLayout() {
  const { currentPrice, priceChange, priceChangePercent, currentSymbol, timeframe } = useTradingStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen text-slate-100 relative">
      <TradingHeader symbol={currentSymbol} showGlow={true} change={priceChange} changePercent={priceChangePercent} price={currentPrice} />
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
      <Toaster position="top-center" richColors closeButton theme='dark' />
      {isLoading && <div className="h-screen  fixed top-0 left-0 right-0  z-50
       flex items-center justify-center bg-slate-900">
        <ThunderLoader className="w-40 h-40" variant={"electric"} fillDuration={3} animate='thunder' />
      </div>}
    </div>
  );
}
export default TradingLayout;
