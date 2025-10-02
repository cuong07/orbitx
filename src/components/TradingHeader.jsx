import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router"


export function TradingHeader({
  symbol = "BTC/USD",
  price = 52174.09,
  change = 374.09,
  changePercent = 0.05,
  high24h = 19318,
  low24h = 18666.47,
  volume24h = "297",
}) {
  const isPositive = change >= 0

  // useEffect(() => {
  //   const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_1m`);
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     const kline = data.k;
  //     const bar = {
  //       time: kline.t / 1000,
  //       open: parseFloat(kline.o),
  //       high: parseFloat(kline.h),
  //       low: parseFloat(kline.l),
  //       close: parseFloat(kline.c),
  //       volume: parseFloat(kline.v),
  //     };
  //     candles.update(bar);
  //     volumeSeries.update({
  //       time: bar.time,
  //       value: bar.volume,
  //       color: bar.close > bar.open ? "rgba(0,150,136,0.8)" : "rgba(255,82,82,0.8)",
  //     });
  //   };

  // }, [symbol])
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-8">
        <div className="w-40">
          <Link to={"/"}>
            <img src="/2.png" alt="" /></Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{symbol.toLocaleUpperCase()}</h1>
          <p className="text-xs text-muted-foreground">{symbol.slice(0, symbol.length - 4).toUpperCase()}/USDT</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">${price.toFixed(2).toLocaleString()}</span>
          <div className={`flex items-center gap-1 ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {isPositive ? "+" : ""}
              {change.toFixed(2)} ({isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div>
          <p className="text-muted-foreground">24h High</p>
          <p className="font-mono font-medium text-foreground">${high24h.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">24h Low</p>
          <p className="font-mono font-medium text-foreground">${low24h.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">24h Volume</p>
          <p className="font-mono font-medium text-foreground">{volume24h}M</p>
        </div>
      </div>
    </div>
  )
}
