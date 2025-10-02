import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTradingStore } from "@/stores/useTradingStore";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import * as React from "react";
import { SharePositionModal } from "./SharePositionModal";


export default function PositionsTable() {
  const { positions, calculateOrderPnL, currentPrice, closePosition, orders, openOrders } = useTradingStore();

  const fmtPrice = React.useMemo(
    () => new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    []
  );
  const fmtQty = React.useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }),
    []
  );


  const filled = React.useMemo(() => positions.filter((p) => p.status === "FILLED"), [positions]);
  // console.log(positions);
  // console.log(orders[0]);



  return (
    <div className="mt-3">
      <Table aria-label="Open positions" className="w-full table-fixed">
        <TableCaption className="sr-only">List of currently open (filled) positions and their live PnL.</TableCaption>
        <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TableRow className="border-b border-border/60">
            <TableHead className="px-3 py-2 text-left text-muted-foreground w-[7.5rem]">Symbol</TableHead>
            <TableHead className="px-3 py-2 text-right text-muted-foreground w-[5.5rem]">Side</TableHead>
            <TableHead className="px-3 py-2 text-right text-muted-foreground w-[6rem]">Qty</TableHead>
            <TableHead className="px-3 py-2 text-right text-muted-foreground w-[7rem]">Entry</TableHead>
            <TableHead className="px-3 py-2 text-right text-muted-foreground w-[8rem]">Current</TableHead>
            <TableHead className="px-3 py-2 text-right text-muted-foreground w-[10rem]">PnL</TableHead>
            <TableHead className="px-3 py-2 text-center text-muted-foreground w-[6rem]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
          {filled.length === 0 ? (
            <EmptyRow />
          ) : (
            filled.map((order, i) => {
              const { pnl, pnlPercent } = calculateOrderPnL(order);
              const pnlPositive = pnl >= 0;
              return (
                <TableRow
                  key={`${order.symbol}-${i}`}
                  className="border-t border-border/50 hover:bg-muted/40"
                >
                  <TableCell className="px-3 py-2 text-foreground whitespace-nowrap">{order.symbol}</TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <SideBadge side={order.side} />
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right font-mono tabular-nums whitespace-nowrap">
                    {fmtQty.format(order.quantity)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right font-mono tabular-nums whitespace-nowrap">
                    {fmtPrice.format(order.price)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right font-mono tabular-nums whitespace-nowrap">
                    {fmtPrice.format(currentPrice)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right font-mono tabular-nums whitespace-nowrap">
                    <PnLChip value={pnl} percent={pnlPercent} positive={pnlPositive} />
                  </TableCell>
                  <TableCell className="px-3 py-2 text-center">
                    <ClosePositionButton
                      position={order}
                      pnl={pnl}
                      pnlPercent={pnlPercent}
                      onClose={() => closePosition(order.id)}
                    />
                    <SharePositionModal leverage={1} entryPrice={order.price} markPrice={currentPrice} pnlPercent={pnlPercent} side={order.side} referralCode="212312313" />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

    </div>
  );
}

function SideBadge({ side }) {
  const positive = side?.toUpperCase() === "BUY" || side?.toUpperCase() === "LONG";
  return (
    <Badge
      variant={positive ? "secondary" : "destructive"}
      className={cn(
        "rounded-sm font-medium whitespace-nowrap",
        positive ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" : "text-red-500 border-red-500/30 bg-red-500/10"
      )}
    >
      {positive ? "LONG" : "SHORT"}
    </Badge>
  );
}

function PnLChip({ value, percent, positive }) {
  const fmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div
      className={cn(
        "inline-flex items-center justify-end gap-1 rounded-md px-2 py-0.5 text-xs",
        "ring-1",
        positive
          ? "text-emerald-400 ring-emerald-500/30 bg-emerald-500/5"
          : "text-red-400 ring-red-500/30 bg-red-500/5"
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      ) : (
        <ArrowDownRight className="size-3.5" aria-hidden="true" />
      )}
      <span className="tabular-nums">{fmt.format(value)} USDT</span>
      <span className="opacity-70">(</span>
      <span className="tabular-nums">{fmt.format(percent)}%</span>
      <span className="opacity-70">)</span>
    </div>
  );
}

function ClosePositionButton({ position, pnl, pnlPercent, onClose }) {
  const pnlPositive = pnl >= 0;
  const fmtPrice = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <X className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Position</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>Are you sure you want to close this position?</div>
            <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Symbol:</span>
                <span className="font-medium">{position.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span>Side:</span>
                <span className="font-medium">{position.side === 'BUY' ? 'LONG' : 'SHORT'}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium font-mono">{fmtPrice.format(position.quantity)}</span>
              </div>
              <div className="flex justify-between">
                <span>Entry Price:</span>
                <span className="font-medium font-mono">${fmtPrice.format(position.price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current PnL:</span>
                <span className={cn(
                  "font-medium font-mono",
                  pnlPositive ? "text-emerald-600" : "text-red-600"
                )}>
                  {pnlPositive ? '+' : ''}${fmtPrice.format(pnl)} ({pnlPositive ? '+' : ''}{fmtPrice.format(pnlPercent)}%)
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              This action will close the position at market price and realize the current PnL.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Close Position
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
        No open positions yet.
      </TableCell>
    </TableRow>
  );
}
