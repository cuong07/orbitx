import { Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState, useMemo } from "react"
import { useTradingStore } from "@/stores/useTradingStore"

// Top 20 coin theo market cap (hardcode)
const top20 = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "DOTUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "TRXUSDT",
  "TONUSDT",
  "LTCUSDT",
  "SHIBUSDT",
  "ATOMUSDT",
  "UNIUSDT",
  "XMRUSDT",
  "ETCUSDT",
  "BCHUSDT",
]

// tên hiển thị
const coinInfo = {
  BTCUSDT: "Bitcoin",
  ETHUSDT: "Ethereum",
  BNBUSDT: "Binance Coin",
  SOLUSDT: "Solana",
  XRPUSDT: "Ripple",
  ADAUSDT: "Cardano",
  DOGEUSDT: "Dogecoin",
  MATICUSDT: "Polygon",
  DOTUSDT: "Polkadot",
  AVAXUSDT: "Avalanche",
  LINKUSDT: "Chainlink",
  TRXUSDT: "TRON",
  TONUSDT: "Toncoin",
  LTCUSDT: "Litecoin",
  SHIBUSDT: "Shiba Inu",
  ATOMUSDT: "Cosmos",
  UNIUSDT: "Uniswap",
  XMRUSDT: "Monero",
  ETCUSDT: "Ethereum Classic",
  BCHUSDT: "Bitcoin Cash",
}

export function MarketList() {
  const [markets, setMarkets] = useState([])
  const [search, setSearch] = useState("")
  const { currentSymbol, setCurrentSymbol } = useTradingStore();

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr")

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const mapped = data
        .filter((item) => top20.includes(item.s))
        .map((item) => ({
          symbol: item.s,
          name: coinInfo[item.s] || item.s,
          price: parseFloat(item.c),
          change: parseFloat(item.P),
          isFavorite: false,
          s: item.s.toLowerCase()
        }))

      // sort theo thứ tự top20
      const sorted = top20
        .map((sym) => mapped.find((m) => m.symbol === sym))
        .filter(Boolean)

      setMarkets(sorted)
    }

    return () => ws.close()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return markets
    return markets.filter(
      (m) =>
        m.symbol.toLowerCase().includes(search.toLowerCase()) ||
        m.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [markets, search])



  return (
    <div className="flex h-full flex-col border-r  border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border"
          />
        </div>
      </div>

      <ScrollArea className=" h-[500px]">
        <div className="p-2">
          {filtered.map((market) => (
            <Button
              key={market.symbol}
              onClick={() => setCurrentSymbol(market.s)}
              variant="ghost"
              className="w-full justify-start gap-2 px-3 py-2 h-auto hover:bg-secondary"
            >
              <Star
                className={`h-3 w-3 ${market.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
              />
              <div className="flex flex-1 items-center justify-between text-left">
                <div>
                  <p className="text-sm font-medium text-foreground">{market.symbol}</p>
                  <p className="text-xs text-muted-foreground">{market.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-medium text-foreground">
                    ${market.price.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs font-medium ${market.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {market.change >= 0 ? "+" : ""}
                    {market.change}%
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
