import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export function OrderBook() {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@depth5@100ms");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (!data || !data.bids || !data.asks) return;

      // Bids (BUY side)
      const bidList = data.bids.map(([price, qty]) => ({
        price: parseFloat(price),
        quantity: parseFloat(qty),
        total: parseFloat(price) * parseFloat(qty),
      }));

      // Asks (SELL side)
      const askList = data.asks.map(([price, qty]) => ({
        price: parseFloat(price),
        quantity: parseFloat(qty),
        total: parseFloat(price) * parseFloat(qty),
      }));

      setBids(bidList);
      setAsks(askList);

      // Mid price làm giá hiện tại
      if (bidList.length && askList.length) {
        setCurrentPrice((bidList[0].price + askList[0].price) / 2);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex h-fit flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Order Book</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">
        <div>Price (USDT)</div>
        <div className="text-right">Amount (BTC)</div>
        <div className="text-right">Total</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-px p-2">
          {asks.map((order, i) => (
            <div
              key={`ask-${i}`}
              className="grid grid-cols-3 gap-2 px-2 py-1 text-xs font-mono hover:bg-secondary/50"
            >
              <div className="text-destructive">{order.price.toFixed(2)}</div>
              <div className="text-right text-foreground">{order.quantity.toFixed(5)}</div>
              <div className="text-right text-muted-foreground">{order.total.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="border-y border-border bg-secondary/30 px-4 py-2 text-center">
          <div className="text-lg font-bold font-mono text-foreground">{currentPrice.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">≈ ${currentPrice.toFixed(2)}</div>
        </div>

        <div className="space-y-px p-2">
          {bids.map((order, i) => (
            <div
              key={`bid-${i}`}
              className="grid grid-cols-3 gap-2 px-2 py-1 text-xs font-mono hover:bg-secondary/50"
            >
              <div className="text-success">{order.price.toFixed(2)}</div>
              <div className="text-right text-foreground">{order.quantity.toFixed(5)}</div>
              <div className="text-right text-muted-foreground">{order.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
