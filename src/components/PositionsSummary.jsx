import * as React from "react";
import { useTradingStore } from "@/stores/useTradingStore";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ArrowUpRight, ArrowDownRight, XCircle } from "lucide-react";

/**
 * Component tổng quan về positions và nút đóng tất cả positions
 */
export default function PositionsSummary() {
  const {
    positions,
    calculateOrderPnL,
    balance,
    closePosition
  } = useTradingStore();

  const filledPositions = React.useMemo(
    () => positions.filter((p) => p.status === "FILLED"),
    [positions]
  );

  // Tính tổng PnL
  const totalPnL = React.useMemo(() => {
    return filledPositions.reduce((sum, position) => {
      const { pnl } = calculateOrderPnL(position);
      return sum + pnl;
    }, 0);
  }, [filledPositions, calculateOrderPnL]);

  // Đóng tất cả positions
  const closeAllPositions = React.useCallback(() => {
    filledPositions.forEach(position => {
      closePosition(position.id);
    });
  }, [filledPositions, closePosition]);

  const fmtPrice = React.useMemo(
    () => new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    []
  );

  const totalPnLPositive = totalPnL >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Positions Overview</CardTitle>
          {filledPositions.length > 0 && (
            <CloseAllPositionsButton
              positions={filledPositions}
              totalPnL={totalPnL}
              onCloseAll={closeAllPositions}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          {/* Số lượng positions */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Open Positions</div>
            <div className="text-lg font-semibold">
              {filledPositions.length}
            </div>
          </div>

          {/* Tổng PnL */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total PnL</div>
            <div className={cn(
              "text-lg font-semibold flex items-center gap-1",
              totalPnLPositive ? "text-emerald-600" : "text-red-600"
            )}>
              {totalPnLPositive ? (
                <ArrowUpRight className="size-4" />
              ) : (
                <ArrowDownRight className="size-4" />
              )}
              {totalPnLPositive ? '+' : ''}${fmtPrice.format(Math.abs(totalPnL))}
            </div>
          </div>

          {/* Unrealized PnL */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Unrealized PnL</div>
            <div className={cn(
              "text-sm font-medium",
              (balance.unrealizedPnL || 0) >= 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {(balance.unrealizedPnL || 0) >= 0 ? '+' : ''}${fmtPrice.format(Math.abs(balance.unrealizedPnL || 0))}
            </div>
          </div>

          {/* Realized PnL */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Realized PnL</div>
            <div className={cn(
              "text-sm font-medium",
              (balance.realizedPnL || 0) >= 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {(balance.realizedPnL || 0) >= 0 ? '+' : ''}${fmtPrice.format(Math.abs(balance.realizedPnL || 0))}
            </div>
          </div>
        </div>

        {/* Danh sách positions mini */}
        {filledPositions.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground">Active Positions</div>
            <div className="space-y-1">
              {filledPositions.slice(0, 3).map((position) => {
                const { pnl } = calculateOrderPnL(position);
                const pnlPositive = pnl >= 0;
                return (
                  <div key={position.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{position.symbol}</span>
                      <Badge
                        variant={position.side === 'BUY' ? 'secondary' : 'destructive'}
                        className="h-5 text-xs"
                      >
                        {position.side === 'BUY' ? 'LONG' : 'SHORT'}
                      </Badge>
                    </div>
                    <div className={cn(
                      "font-mono",
                      pnlPositive ? "text-emerald-600" : "text-red-600"
                    )}>
                      {pnlPositive ? '+' : ''}${fmtPrice.format(pnl)}
                    </div>
                  </div>
                );
              })}
              {filledPositions.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{filledPositions.length - 3} more positions
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CloseAllPositionsButton({ positions, totalPnL, onCloseAll }) {
  const totalPnLPositive = totalPnL >= 0;
  const fmtPrice = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Close All
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close All Positions</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>Are you sure you want to close all {positions.length} open positions?</div>

            <div className="bg-muted p-3 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Positions:</span>
                <span className="font-medium">{positions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Combined PnL:</span>
                <span className={cn(
                  "font-medium font-mono",
                  totalPnLPositive ? "text-emerald-600" : "text-red-600"
                )}>
                  {totalPnLPositive ? '+' : ''}${fmtPrice.format(Math.abs(totalPnL))}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <div className="text-xs text-yellow-800">
                <strong>Warning:</strong> This will close all positions at market price and realize all current PnL. This action cannot be undone.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onCloseAll}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Close All Positions
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}