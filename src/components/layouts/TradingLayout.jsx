import Chart from '@/components/Chart';
import { ChartArea } from '@/components/ChartArea';
import { MarketList } from '@/components/MarketList';
import { OrderBook } from '@/components/OrderBook';
import { OrderPanel } from '@/components/OrderPanel';
import { TradingHeader } from '@/components/TradingHeader';
import { ThunderLoader } from '@/components/ui/thunder-loader';
import { useTradingStore } from '@/stores/useTradingStore';
import { formatUSD } from '@/utils/format';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { PositionsTab } from '../PositionsTab';
import { Header } from './Header';

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
    <div>
      <title>{`${formatUSD(currentPrice)} | ${currentSymbol.toUpperCase()}`}</title>
      <meta name="description" content={`${currentSymbol.toUpperCase()} - ${formatUSD(currentPrice)}`} />
      <meta name="keywords" content={`${currentSymbol.toUpperCase()}, ${formatUSD(currentPrice)}`} />
      <meta name="author" content="OrbitX" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="yandexbot" content="index, follow" />
      <meta name="sitemap" content="https://www.orbitx.com/sitemap.xml" />
      <meta name="google-site-verification" content="google-site-verification=google-site-verification" />
      <meta name="google-site-verification" content="google-site-verification" />
      <meta name="google-site-verification" content="google-site-verification" />
      <Header />
      <div className="min-h-screen mt-14 text-slate-100 relative">
        <TradingHeader symbol={currentSymbol} showGlow={true} change={priceChange} changePercent={priceChangePercent} price={currentPrice} />
        <div className="flex">
          <div className="w-64 flex-shrink-0 m-1 border">
            <MarketList />
          </div>
          <main className="flex-1">
            <div className="grid grid-cols-1 xl:grid-cols-12">
              <div className="xl:col-span-9 m-1 flex flex-col gap-1 border">
                <ChartArea>
                  <Chart symbol={currentSymbol} timeframe={timeframe} />
                </ChartArea>
                {/* <PositionsTable /> */}
                <PositionsTab />
              </div>
              <div className="xl:col-span-3 m-1 space-y-3">
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
    </div>
  );
}
export default TradingLayout;
