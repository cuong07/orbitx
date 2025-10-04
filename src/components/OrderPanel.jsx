
import React, { useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTradingStore } from "@/stores/useTradingStore"
import { ORDER_SIDE, ORDER_TYPE } from "@/constants/enum"
import { toast } from "sonner"
import { useGoldPrice } from "@/hooks/useGoldPrice"

// Constants
const PERCENTAGE_BUTTONS = [25, 50, 75, 100];

export const OrderPanel = React.memo(() => {
  const { updateOrderForm, placeOrder, orderForm: { side, type, quantity, price }, currentSymbol } = useTradingStore()
  useGoldPrice(); // Initialize WebSocket connection for gold price

  const handlePlaceOrder = useCallback(() => {
    try {
      if (placeOrder()) {
        toast.success('Đặt lệnh thành công')
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  }, [placeOrder]);


  const handleSideChange = useCallback((value) => {
    updateOrderForm("side", value);
  }, [updateOrderForm]);

  const handleTypeChange = useCallback((orderType) => {
    updateOrderForm("type", orderType);
  }, [updateOrderForm]);

  const handlePriceChange = useCallback((e) => {
    updateOrderForm("price", e.target.value);
  }, [updateOrderForm]);

  const handleQuantityChange = useCallback((e) => {
    updateOrderForm("quantity", e.target.value);
  }, [updateOrderForm]);

  const handlePercentageClick = useCallback(() => {
    // TODO: Implement percentage calculation based on available balance
    // This will calculate the percentage of available balance and set the quantity
  }, []);

  // Memoize the percentage buttons to prevent recreation
  const percentageButtons = useMemo(() =>
    PERCENTAGE_BUTTONS.map((percent) => (
      <Button
        key={percent}
        variant="outline"
        size="sm"
        className="flex-1 text-xs bg-transparent"
        onClick={() => handlePercentageClick(percent)}
      >
        {percent}%
      </Button>
    )), [handlePercentageClick]
  );


  return (
    <div className="flex h-fit flex-col border-l border-border bg-card">
      <Tabs defaultValue={ORDER_SIDE[side]} className="flex-1 flex flex-col" onValueChange={handleSideChange}>
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
              onClick={() => handleTypeChange(ORDER_TYPE.LIMIT)}
              className="flex-1"
            >
              Limit
            </Button>
            <Button
              variant={type === ORDER_TYPE.MARKET ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeChange(ORDER_TYPE.MARKET)}
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
                    onChange={handlePriceChange}
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
                  onChange={handleQuantityChange}
                  className="pr-12 bg-secondary border-border font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">BTC</span>
              </div>
            </div>

            <div className="flex gap-2">
              {percentageButtons}
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

          <Button className="w-full cursor-pointer" onClick={handlePlaceOrder}>Buy {currentSymbol.toUpperCase()}</Button>
        </TabsContent>

        <TabsContent value={ORDER_SIDE.SELL} className="flex-1 mt-0 p-4 space-y-4">
          <div className="flex gap-2">
            <Button
              disabled
              variant={type === ORDER_TYPE.LIMIT ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeChange(ORDER_TYPE.LIMIT)}
              className="flex-1"
            >
              Limit
            </Button>
            <Button
              variant={type === ORDER_TYPE.MARKET ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeChange(ORDER_TYPE.MARKET)}
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
                    onChange={handlePriceChange}
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
                  onChange={handleQuantityChange}
                  className="pr-12 bg-secondary border-border font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">BTC</span>
              </div>
            </div>

            <div className="flex gap-2">
              {percentageButtons}
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
    </div>
  )
})
