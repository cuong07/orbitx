

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTradingStore } from "@/stores/useTradingStore"


export function ChartArea({ children }) {
  const timeframes = ["1s", "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"];
  const { setTimeframe, timeframe } = useTradingStore()

  return (
    <div className="flex h-fit w-full flex-col">
      <div className="flex items-center justify-between border-b border-border">
        <Tabs defaultValue={timeframe} className="w-auto" onValueChange={(value) => {
          setTimeframe(value)
        }}>
          <TabsList className="h-8 bg-transparent p-0 gap-1">
            {timeframes.map((tf) => (
              <TabsTrigger key={tf}

                value={tf} className="h-7 px-3 text-neutral-300 data-[state=active]:text-neutral-800 text-xs data-[state=active]:bg-accent">
                {tf}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Indicators
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Settings
          </Button>
        </div>
      </div>

      <div className="">
        {children}
      </div>
    </div>
  )
}
