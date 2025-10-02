import { ORDER_SIDE, ORDER_TYPE } from '@/constants/enum';
import { toast } from 'sonner';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const generateOrderId = () =>
  'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

const formatPrice = (price) => parseFloat(price ?? 0).toFixed(2);
const formatQuantity = (q) => parseFloat(q ?? 0).toFixed(6);
const calculateTotal = (price, quantity) =>
  (parseFloat(price || 0) * parseFloat(quantity || 0)).toFixed(2);

const calculateOrderPnL = (order, currentPrice) => {
  if (!order || order.status !== 'FILLED') return { pnl: 0, pnlPercent: 0 };

  const entryPrice = parseFloat(order.price || 0);
  const quantity = parseFloat(order.quantity || 0);
  const current = parseFloat(currentPrice || 0);

  if (entryPrice <= 0 || quantity <= 0) return { pnl: 0, pnlPercent: 0 };

  let pnl = 0;
  let pnlPercent = 0;

  if (order.side === ORDER_SIDE.BUY) {
    pnl = (current - entryPrice) * quantity;
    pnlPercent = ((current - entryPrice) / entryPrice) * 100;
  } else {
    pnl = (entryPrice - current) * quantity;
    pnlPercent = ((entryPrice - current) / entryPrice) * 100;
  }

  return {
    pnl: parseFloat(pnl.toFixed(2)),
    pnlPercent: parseFloat(pnlPercent.toFixed(2)),
  };
};
export const useTradingStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ===== Market state =====
        currentSymbol: 'btcusdt',
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        symbolPrices: {}, // Track prices for different symbols

        isConnected: false,
        isLoading: false,

        // ===== Chart state =====
        chartData: [],
        timeframe: '4h',

        setChartData: (dataOrUpdater) => {
          if (typeof dataOrUpdater === 'function') {
            set((s) => ({ chartData: dataOrUpdater(s.chartData) }));
          } else {
            set({ chartData: dataOrUpdater || [] });
          }
        },
        setTimeframe: (tf) => set({ timeframe: tf }),

        // ===== Orderbook =====
        orderBook: { bids: [], asks: [] },

        // ===== Orders & balance =====
        orders: [],
        openOrders: [],
        orderHistory: [],
        positions: [], // Positions đang mở (orders đã FILLED chưa close)
        balance: {
          USDT: 100000000,
          BTC: 100000,
          totalUSDT: 100000000,
          unrealizedPnL: 0, // Lãi/lỗ chưa thực hiện
          realizedPnL: 0,   // Lãi/lỗ đã thực hiện
        },

        // ===== Order form =====
        orderForm: {
          side: ORDER_SIDE.BUY,
          type: ORDER_TYPE.MARKET,
          quantity: '',
          price: '',
          stopPrice: '',
          total: '',
        },

        updateOrderForm: (field, value) => {
          const prev = get().orderForm;
          const updated = { ...prev, [field]: value };

          if (field === 'price' || field === 'quantity') {
            updated.total = calculateTotal(updated.price, updated.quantity);
          }
          if (field === 'total' && updated.price) {
            updated.quantity = (
              parseFloat(value || 0) / parseFloat(updated.price || 1)
            ).toFixed(6);
          }
          set({ orderForm: updated });
        },

        // ===== Tính PnL cho tất cả positions =====
        updatePositionsPnL: () => {
          const { positions, currentPrice, balance } = get();

          if (!positions.length || !currentPrice) return;

          // Tính PnL cho từng position
          const updatedPositions = positions.map(position => {
            const { pnl, pnlPercent } = calculateOrderPnL(position, currentPrice);
            return {
              ...position,
              pnl,
              pnlPercent,
              currentPrice, // Lưu giá hiện tại để reference
            };
          });

          // Tính tổng unrealized PnL
          const totalUnrealizedPnL = updatedPositions.reduce((sum, pos) => sum + pos.pnl, 0);

          // Update balance với PnL
          const updatedBalance = {
            ...balance,
            unrealizedPnL: parseFloat(totalUnrealizedPnL.toFixed(2)),
            totalUSDT: balance.USDT + balance.BTC * currentPrice + totalUnrealizedPnL,
          };

          set({
            positions: updatedPositions,
            balance: updatedBalance,
          });
        },

        // ===== Order actions =====
        executeOrder: (orderId) => {
          const { openOrders, currentPrice, balance: bal, orderHistory, positions } = get();
          const order = openOrders.find((o) => o.id === orderId);

          if (!order) return toast.error('Order not found or already executed');

          const executedPrice = order.type === ORDER_TYPE.MARKET ? currentPrice : order.price;
          const updatedOrder = {
            ...order,
            status: 'FILLED',
            filled: order.quantity,
            price: executedPrice,
            executedAt: new Date().toISOString(),
            pnl: 0,
            pnlPercent: 0,
          };

          const newBalance = { ...bal };
          let newPositions = [...positions];
          let realizedPnL = 0;

          if (order.side === ORDER_SIDE.BUY) {
            // ====== BUY ======
            // Nếu có Short position thì BUY sẽ đóng Short trước (FIFO)
            const matchingShortIndex = newPositions.findIndex(
              p => p.side === ORDER_SIDE.SELL && p.status === 'FILLED'
            );

            if (matchingShortIndex !== -1) {
              const shortPos = newPositions[matchingShortIndex];
              const { pnl, pnlPercent } = calculateOrderPnL(shortPos, executedPrice);
              realizedPnL = pnl;

              updatedOrder.pnl = pnl;
              updatedOrder.pnlPercent = pnlPercent;
              updatedOrder.closedPositionId = shortPos.id;

              const cost = order.quantity * executedPrice;
              newBalance.USDT -= cost; // Mua lại BTC để cover Short
              newBalance.BTC += order.quantity; // BTC tăng lại về gần 0
              newBalance.realizedPnL = (bal.realizedPnL || 0) + realizedPnL;

              newPositions.splice(matchingShortIndex, 1);

              toast.success(`Short closed with ${realizedPnL >= 0 ? 'profit' : 'loss'}: $${Math.abs(realizedPnL).toFixed(2)}`);
              // toast.        
              // showProfitToast({ profit: Math.abs(realizedPnL).toFixed(2), currency: "USDT" })
            } else {
              // Nếu không có Short thì mở Long mới
              const cost = order.quantity * executedPrice;
              newBalance.USDT -= cost;
              newBalance.BTC += order.quantity;
              newPositions.push(updatedOrder);
            }

          } else {
            // ====== SELL ======
            // Nếu có Long position thì SELL sẽ đóng Long trước (FIFO)
            const matchingLongIndex = newPositions.findIndex(
              p => p.side === ORDER_SIDE.BUY && p.status === 'FILLED'
            );

            if (matchingLongIndex !== -1) {
              const longPos = newPositions[matchingLongIndex];
              const { pnl, pnlPercent } = calculateOrderPnL(longPos, executedPrice);
              realizedPnL = pnl;

              updatedOrder.pnl = pnl;
              updatedOrder.pnlPercent = pnlPercent;
              updatedOrder.closedPositionId = longPos.id;

              const revenue = order.quantity * executedPrice;
              newBalance.USDT += revenue; // Chỉ cộng revenue, PnL đã reflect trong realizedPnL
              newBalance.BTC -= order.quantity;
              newBalance.realizedPnL = (bal.realizedPnL || 0) + realizedPnL;

              newPositions.splice(matchingLongIndex, 1);

              toast.success(`Long closed with ${realizedPnL >= 0 ? 'profit' : 'loss'}: $${Math.abs(realizedPnL).toFixed(2)}`);
              // showProfitToast({ profit: Math.abs(realizedPnL).toFixed(2), currency: "USDT" })

            } else {
              // Nếu không có Long thì mở Short mới
              const revenue = order.quantity * executedPrice;
              newBalance.USDT += revenue;
              newBalance.BTC -= order.quantity; // BTC âm = Short
              newPositions.push(updatedOrder);

              toast.info('Short position opened');
            }
          }

          // Tính lại total USDT
          newBalance.totalUSDT =
            newBalance.USDT + (newBalance.BTC * currentPrice) + (newBalance.unrealizedPnL || 0);

          set({
            balance: newBalance,
            positions: newPositions,
            openOrders: openOrders.filter((o) => o.id !== orderId),
            orderHistory: [updatedOrder, ...orderHistory],
          });

          // Update PnL cho các position còn lại
          setTimeout(() => get().updatePositionsPnL(), 0);
        },


        placeOrder: () => {
          const state = get();
          const { side, type, quantity, price, total } = state.orderForm;
          console.log(quantity, type);


          if (!quantity || parseFloat(quantity) <= 0) {
            toast.warning('Vui lòng nhập số lượng hợp lệ');
            return false;
          }
          if (type === ORDER_TYPE.LIMIT && (!price || parseFloat(price) <= 0)) {
            toast.warning('Vui lòng nhập giá hợp lệ');
            return false;
          }
          console.log(total);
          console.log(state.balance.USDT);

          const orderTotal = parseFloat(total || 0);
          // if (side === ORDER_SIDE.BUY && orderTotal > state.balance.USDT) {
          //   toast.warning('Số dư USDT không đủ');
          //   return false;
          // }
          // if (side === ORDER_SIDE.SELL && parseFloat(quantity) > state.balance.BTC) {
          //   toast.warning('Số lượng BTC không đủ');
          //   return false;
          // }

          const newOrder = {
            id: generateOrderId(),
            symbol: state.currentSymbol,
            side,
            type,
            quantity: parseFloat(quantity),
            price: type === ORDER_TYPE.MARKET ? state.currentPrice : parseFloat(price),
            total: orderTotal,
            status: 'PENDING',
            timestamp: new Date().toISOString(),
            filled: 0,
            pnl: 0,
            pnlPercent: 0,
          };

          set({
            orders: [newOrder, ...state.orders],
            openOrders: [newOrder, ...state.openOrders],
            orderForm: {
              // side: ORDER_SIDE.BUY,
              // type: ORDER_TYPE.LIMIT,
              ...state.orderForm,
              quantity: '',
              price: '',
              stopPrice: '',
              total: '',
            },
          });

          // const ms = Math.random() * 3000 + 1000;
          // setTimeout(() => get().executeOrder(newOrder.id), ms);
          get().executeOrder(newOrder.id)
          return true;
        },

        cancelOrder: (orderId) => {
          const { openOrders, orderHistory } = get();
          const order = openOrders.find((o) => o.id === orderId);
          if (!order) return;

          const cancelledOrder = {
            ...order,
            status: 'CANCELLED',
            cancelledAt: new Date().toISOString(),
          };

          set({
            orderHistory: [cancelledOrder, ...orderHistory],
            openOrders: openOrders.filter((o) => o.id !== orderId),
          });
        },

        // ===== Close position manually =====
        closePosition: (positionId) => {
          const { positions, currentPrice, orders, openOrders } = get();
          const position = positions.find(p => p.id === positionId);
          if (!position) return;

          const closeSide = position.side === ORDER_SIDE.BUY
            ? ORDER_SIDE.SELL
            : ORDER_SIDE.BUY;

          const closeOrder = {
            id: generateOrderId(),
            symbol: position.symbol,
            side: closeSide,
            type: ORDER_TYPE.MARKET,
            quantity: position.quantity,
            price: currentPrice,
            total: (position.quantity * currentPrice).toFixed(2),
            status: 'PENDING',
            timestamp: new Date().toISOString(),
            filled: 0,
            pnl: 0,
            pnlPercent: 0,
          };

          set({
            orders: [closeOrder, ...orders],
            openOrders: [closeOrder, ...openOrders],
          });

          get().executeOrder(closeOrder.id);
        },


        // ===== Realtime price/orderbook simulation =====
        _priceIntervalId: null,
        _lastPrice: null,

        startRealtime: () => {
          const { _priceIntervalId, isConnected } = get();
          if (_priceIntervalId || isConnected) return;
          set({ isConnected: true });

          const id = setInterval(() => {
            const { currentSymbol, symbolPrices = {} } = get();
            const prev = get().currentPrice || 50000;
            const change = (Math.random() - 0.5) * prev * 0.002;
            const newPrice = prev + change;

            set({
              currentPrice: newPrice,
              priceChange: change,
              priceChangePercent: (change / prev) * 100,
              symbolPrices: {
                ...symbolPrices,
                [currentSymbol]: newPrice
              },
              orderBook: {
                bids: Array.from({ length: 5 }, (_, i) => ({
                  price: newPrice - (i + 1) * 10,
                  quantity: Math.random() * 10,
                  total: (newPrice - (i + 1) * 10) * Math.random() * 10,
                })),
                asks: Array.from({ length: 5 }, (_, i) => ({
                  price: newPrice + (i + 1) * 10,
                  quantity: Math.random() * 10,
                  total: (newPrice + (i + 1) * 10) * Math.random() * 10,
                })),
              },
            });

            // Update PnL khi giá thay đổi
            get().updatePositionsPnL();
          }, 1000);

          set({ _priceIntervalId: id });
        },

        stopRealtime: () => {
          const { _priceIntervalId } = get();
          if (_priceIntervalId) clearInterval(_priceIntervalId);
          set({ _priceIntervalId: null, isConnected: false });
        },

        setCurrentPrice: (p) => {
          const currentPrice = parseFloat(p);
          const { _lastPrice, currentSymbol, symbolPrices = {} } = get();

          if (_lastPrice === currentPrice) return;

          set({
            currentPrice,
            _lastPrice: currentPrice,
            symbolPrices: {
              ...symbolPrices,
              [currentSymbol]: currentPrice
            }
          });

          get().updatePositionsPnL();
        },

        setCurrentSymbol: (sym) => {
          set({ currentSymbol: sym });
        },

        setSymbolPrice: (symbol, price) => {
          const { symbolPrices = {} } = get();
          set({
            symbolPrices: {
              ...symbolPrices,
              [symbol]: parseFloat(price)
            }
          });
        },

        // ===== Utils expose =====
        formatPrice,
        formatQuantity,
        calculateTotal,
        calculateOrderPnL: (order) => calculateOrderPnL(order, get().currentPrice),
      }),
      {
        name: 'trading-store',
        partialize: (s) => ({
          currentSymbol: s.currentSymbol,
          timeframe: s.timeframe,
          balance: s.balance,
          orders: s.orders,
          orderHistory: s.orderHistory,
          positions: s.positions,
          symbolPrices: s.symbolPrices,
        }),
      }
    )
  )
);