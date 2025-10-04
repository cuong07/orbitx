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
import { useTradingStore } from "@/stores/useTradingStore";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import * as React from "react";
import { SharePositionModal } from "./SharePositionModal";


export default function PositionsTable() {
  const { positions, calculateOrderPnL, currentPrice, closePosition } = useTradingStore();

  const formatPrice = (value) => value.toFixed(2);
  const formatQty = (value) => value.toFixed(4);

  const filledPositions = positions.filter(p => p.status === "FILLED");

  return (
    <div className="mt-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Pair</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Volume/Margin</TableHead>
            <TableHead>Estimated P/L LP</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Mark Price</TableHead>
            <TableHead>Liquidation Price</TableHead>
            <TableHead>Take Profit / Stop Loss</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filledPositions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-20">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No open positions</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filledPositions.map((position, index) => {
              const { pnl, pnlPercent } = calculateOrderPnL(position);
              const isProfit = pnl >= 0;

              return (
                <TableRow key={`${position.symbol}-${index}`}>
                  <TableCell className="font-medium">{position.symbol.toUpperCase()}</TableCell>
                  <TableCell>
                    <SideBadge side={position.side} />
                  </TableCell>
                  <TableCell className="font-mono">{formatQty(position.quantity)}</TableCell>
                  <TableCell>
                    <PnLDisplay value={pnl} percent={pnlPercent} isProfit={isProfit} />
                  </TableCell>
                  <TableCell className="font-mono">${formatPrice(position.price)}</TableCell>
                  <TableCell className="font-mono">${formatPrice(currentPrice)}</TableCell>
                  <TableCell className="font-mono">-</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <CloseButton
                        position={position}
                        onClose={() => closePosition(position.id)}
                      />
                      <SharePositionModal
                        leverage={1}
                        entryPrice={position.price}
                        markPrice={currentPrice}
                        pnlPercent={pnlPercent}
                        side={position.side}
                        referralCode="212312313"
                      />
                    </div>
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
  const isLong = side?.toUpperCase() === "BUY" || side?.toUpperCase() === "LONG";
  return (
    <Badge variant={isLong ? "default" : "destructive"}>
      {isLong ? "LONG" : "SHORT"}
    </Badge>
  );
}

function PnLDisplay({ value, percent, isProfit }) {
  return (
    <div className={`flex items-center gap-1 text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
      {isProfit ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      <span>${value.toFixed(2)}</span>
      <span className="text-xs opacity-70">({percent.toFixed(2)}%)</span>
    </div>
  );
}

function CloseButton({ position, onClose }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Position</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close {position.symbol} position?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClose} className="bg-red-600 hover:bg-red-700">
            Close Position
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

