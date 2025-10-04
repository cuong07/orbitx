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
            <TableHead>Symbol</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>PnL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filledPositions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No open positions
              </TableCell>
            </TableRow>
          ) : (
            filledPositions.map((position, index) => {
              const { pnl, pnlPercent } = calculateOrderPnL(position);
              const isProfit = pnl >= 0;

              return (
                <TableRow key={`${position.symbol}-${index}`}>
                  <TableCell className="font-medium">{position.symbol}</TableCell>
                  <TableCell>
                    <SideBadge side={position.side} />
                  </TableCell>
                  <TableCell className="font-mono">{formatQty(position.quantity)}</TableCell>
                  <TableCell className="font-mono">${formatPrice(position.price)}</TableCell>
                  <TableCell className="font-mono">${formatPrice(currentPrice)}</TableCell>
                  <TableCell>
                    <PnLDisplay value={pnl} percent={pnlPercent} isProfit={isProfit} />
                  </TableCell>
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

