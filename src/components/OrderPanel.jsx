
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTradingStore } from "@/stores/useTradingStore"
import { ORDER_SIDE, ORDER_TYPE } from "@/constants/enum"
import { toast } from "sonner"

export function OrderPanel() {
  const { updateOrderForm, placeOrder, orderForm: { side, type, quantity, price } } = useTradingStore()

  const handlePlaceOrder = () => {
    try {
      if (placeOrder()) {
        toast.success('Đặt lệnh thành công')
      }
    } catch (error) {
      console.log(error);
    }
  }


  const [goldPrice, setGoldPrice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.okx.com:8443/ws/v5/public");

    ws.onopen = () => {
      console.log("✅ Connected to OKX");
      ws.send(
        JSON.stringify({
          op: "subscribe",
          args: [{ channel: "tickers", instId: "XAUT-USDT" }],
        })
      );
    };

    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      if (res.arg?.instId === "XAUT-USD" && res.data?.length) {
        setGoldPrice(res.data[0]);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WS error:", err);
    };

    return () => ws.close();
  }, []);
  console.log(goldPrice);


  return (
    <div className="flex h-fit flex-col border-l border-border bg-card">
      <Tabs defaultValue={ORDER_SIDE[side]} className="flex-1 flex flex-col" onValueChange={(val) => updateOrderForm("side", val)}>
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value={ORDER_SIDE.BUY}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-success data-[state=active]:bg-transparent data-[state=active]:text-success"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            value={ORDER_SIDE.SELL}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-destructive data-[state=active]:bg-transparent data-[state=active]:text-destructive"
          >
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value={ORDER_SIDE.BUY} className="flex-1 mt-0 p-4 space-y-4">
          <div className="flex gap-2">
            <Button
              disabled
              variant={type === ORDER_TYPE.LIMIT ? "default" : "outline"}
              size="sm"
              // onClick={() => setOrderType("limit")}
              onClick={() => updateOrderForm("type", ORDER_TYPE.LIMIT)}
              className="flex-1"
            >
              Limit
            </Button>
            <Button
              variant={type === ORDER_TYPE.MARKET ? "default" : "outline"}
              size="sm"
              // onClick={() => setOrderType("market")}
              onClick={() => updateOrderForm("type", ORDER_TYPE.MARKET)}
              className="flex-1"
            >
              Market
            </Button>
          </div>

          <div className="space-y-3">
            {type === ORDER_TYPE.LIMIT && (
              <div className="space-y-2">
                <Label htmlFor="price" className="text-muted-foreground">
                  Price
                </Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => updateOrderForm("price", e.target.value)}
                    className="pr-12 bg-secondary border-border font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">USD</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-muted-foreground">
                Quantity
              </Label>
              <div className="relative">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0.00"
                  value={quantity}
                  onChange={(e) => updateOrderForm("quantity", e.target.value)}
                  className="pr-12 bg-secondary border-border font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">BTC</span>
              </div>
            </div>

            <div className="flex gap-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button key={percent} variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                  {percent}%
                </Button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-mono text-foreground">0.00 USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                {/* <span className="font-mono text-foreground">{formatUSD(balance.totalUSDT)} USDT</span> */}
              </div>
            </div>
          </div>

          <Button className="w-full bg-success hover:bg-success/90 text-success-foreground" onClick={handlePlaceOrder}>Buy BTC</Button>
        </TabsContent>

        <TabsContent value={ORDER_SIDE.SELL} className="flex-1 mt-0 p-4 space-y-4">
          <div className="flex gap-2">
            <Button
              disabled
              variant={type === ORDER_TYPE.LIMIT ? "default" : "outline"}
              size="sm"
              onClick={() => updateOrderForm("type", ORDER_TYPE.LIMIT)}
              className="flex-1"
            >
              Limit
            </Button>
            <Button
              variant={type === ORDER_TYPE.MARKET ? "default" : "outline"}
              size="sm"
              onClick={() => updateOrderForm("type", ORDER_TYPE.MARKET)}
              className="flex-1"
            >
              Market
            </Button>
          </div>

          <div className="space-y-3">
            {type === ORDER_TYPE.LIMIT && (
              <div className="space-y-2">
                <Label htmlFor="sell-price" className="text-muted-foreground">
                  Price
                </Label>
                <div className="relative">
                  <Input
                    id="sell-price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => updateOrderForm("price", e.target.value)}
                    className="pr-12 bg-secondary border-border font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">USD</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sell-amount" className="text-muted-foreground">
                Quantity
              </Label>
              <div className="relative">
                <Input
                  id="sell-amount"
                  type="number"
                  placeholder="0.00"
                  value={quantity}
                  onChange={(e) => updateOrderForm("quantity", e.target.value)}
                  className="pr-12 bg-secondary border-border font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">BTC</span>
              </div>
            </div>

            <div className="flex gap-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button key={percent} variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                  {percent}%
                </Button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-mono text-foreground">0.00 BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-mono text-foreground">0.00 USD</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handlePlaceOrder}>
            Sell BTC
          </Button>
        </TabsContent>
      </Tabs>
    </div >
  )
}
