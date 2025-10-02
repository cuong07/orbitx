import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ORDER_SIDE } from "@/constants/enum"
import { formatUSD } from "@/utils/format"
import { toPng } from "html-to-image"
import { Download, Minus, Percent, Plus, Share2 } from "lucide-react"
import { useRef } from "react"

export function SharePositionModal({
  side = "LONG",
  leverage = 125,
  symbol = "BTCUSDT",
  pnlPercent = 1118.99,
  entryPrice = 16230.77,
  markPrice = 17826.59,
  referralCode = "37729611"
}) {
  const captureRef = useRef(null)

  const handleSaveImage = async () => {
    if (!captureRef.current) return
    const dataUrl = await toPng(captureRef.current, { cacheBust: true })
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `position-${symbol}.png`
    link.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="icon" className="cursor-pointer"><Share2 /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl !p-0 border-none aspect-video" style={{ color: "#fff" }}>
        <div ref={captureRef}
          style={{
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="aspect-video"
        >
          <div className="grid grid-cols-2 p-20">
            <div className="flex flex-col justify-center gap-8">
              <img src="/2.png" className="w-64" alt="" />
              <div className="flex gap-3">
                <span style={{ color: side === ORDER_SIDE.SELL ? "#d9a514" : "#22c55e", fontWeight: 600 }}>
                  {side === ORDER_SIDE.BUY ? "LONG" : "SHORT"}
                </span>
                <span style={{ color: "#737373" }}>|</span>
                <span>{leverage}x</span>
                <span style={{ color: "#737373" }}>|</span>
                <span>{symbol}</span>
              </div>
              <span className="text-8xl font-semibold items-center flex gap-4"
                style={{ color: pnlPercent >= 0 ? "#4ade80" : "#f87171" }}
              >
                <span>{pnlPercent >= 0 ? <Plus className="size-12" /> : <Minus className="size-12" />}</span>
                <span className="flex gap-1 items-center">{Math.abs(pnlPercent.toFixed(2))} <Percent className="size-20" /></span>
              </span>
              <div className="w-3/4 space-y-4 text-lg">
                <div className="text-2xl grid grid-cols-2 text-left">
                  <span style={{ color: "#737373" }}>ENTRY PRICE</span>
                  <span className="font-mono" style={{ color: "#d9a514" }}>{formatUSD(entryPrice)}</span>
                </div>
                <div className="grid grid-cols-2 text-2xl text-left">
                  <span style={{ color: "#737373" }}>MARK PRICE</span>
                  <span className="font-mono" style={{ color: "#d9a514" }}>{formatUSD(markPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4">
          <Button onClick={handleSaveImage} className="flex gap-2">
            <Download className="size-4" /> Save Image
          </Button>
        </div>
      </DialogContent>

    </Dialog>
  )
}
