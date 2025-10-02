import { fetchHistory } from '@/apis/binance';
import { ORDER_SIDE } from '@/constants/enum';
import { useTradingStore } from '@/stores/useTradingStore';
import { CandlestickSeries, createChart, createImageWatermark, CrosshairMode, HistogramSeries } from 'lightweight-charts';
import { VisiblePriceRangeUtil } from 'lwc-plugin-visible-price-range-util';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Chart({ symbol, timeframe }) {
  const containerRef = useRef(null);
  const { setChartData, setCurrentPrice, positions } = useTradingStore();
  const candlesRef = useRef(null);
  const priceLinesRef = useRef(new Map());
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {

        const data = await fetchHistory(symbol.toUpperCase(), timeframe, 500);
        setHistory(data);
      } catch (error) {
        console.log(error);

        toast.error('Please try again later');
      }
    };
    loadHistory();
  }, [symbol, setCurrentPrice, timeframe]);


  useEffect(() => {
    if (!containerRef.current || !history) return;

    const vprUtil = new VisiblePriceRangeUtil();
    const currentPriceLines = priceLinesRef.current;

    const wsSymbol = symbol.toLowerCase();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@kline_${timeframe}`);

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 600,
      layout: { background: { type: 'solid', color: '#131722' }, textColor: '#d1d4dc' },
      grid: { vertLines: { color: '#1e222d' }, horzLines: { color: '#1e222d' } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#485c7b' },
      timeScale: { borderColor: '#485c7b', timeVisible: true, secondsVisible: false },
    });

    createImageWatermark(chart.panes()[0], '/2.png', {
      alpha: 0.1,
      padding: 20,
      maxWidth: 400,
    });

    const candles = chart.addSeries(CandlestickSeries, { wickUpColor: '#838ca1' });
    candles.setData(history);

    const volume = chart.addPane();

    const volumeSeries = volume.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceLineWidth: 2,
      priceLineColor: 'rgba(0, 0, 0, 0.5)',
      baseLineColor: 'rgba(0, 0, 0, 0.5)',
      priceLineVisible: false,
    });

    volumeSeries.setData(
      history.map(bar => ({
        time: bar.time,
        value: bar.volume,
        color: bar.close > bar.open ? 'rgba(0,150,136,0.8)' : 'rgba(255,82,82,0.8)',
      }))
    );
    candles.attachPrimitive(vprUtil);

    candlesRef.current = candles;
    setChartData(history);

    const latestPrice = history.at(-1).close;
    setCurrentPrice(latestPrice);

    ws.onopen = () => {
      console.log('[Chart] WebSocket connected');
    };

    ws.onerror = (error) => {
      console.error('[Chart] WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('[Chart] WebSocket closed');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const kline = message.k;

        if (!kline) {
          console.warn('[Chart] No kline data in message:', message);
          return;
        }

        const bar = {
          time: Math.floor(kline.t / 1000),
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
          volume: parseFloat(kline.v),
        };

        const isClosed = kline.x === true;

        if (isClosed) {
          console.log('[Chart] Candle closed, creating new candle');
        }

        candles.update(bar);

        setCurrentPrice(bar.close);

        setChartData(prev => {
          if (!prev?.length) return [bar];

          const newData = [...prev];
          const lastIndex = newData.length - 1;
          const lastBar = newData[lastIndex];

          volumeSeries.update({
            time: bar.time,
            value: bar.volume,
            color: bar.close > bar.open ? 'rgba(0,150,136,0.8)' : 'rgba(255,82,82,0.8)',
          });

          if (lastBar.time === bar.time) {
            newData[lastIndex] = bar;
          } else {
            newData.push(bar);
            if (newData.length > 1000) {
              newData.shift();
            }
          }
          return newData;
        });
      } catch (err) {
        console.error('[Chart] WS parse error:', err);
      }
    };

    const onResize = () => {
      chart.applyOptions({ width: containerRef.current?.clientWidth ?? 800 });
    };

    window.addEventListener('resize', onResize);

    return () => {
      ws.close();
      window.removeEventListener('resize', onResize);
      currentPriceLines.forEach((line) => candles.removePriceLine(line));
      currentPriceLines.clear();
      chart.remove();
    };
  }, [history, symbol, setChartData, setCurrentPrice, timeframe]);

  useEffect(() => {
    if (candlesRef.current && history) {
      const candleData = candlesRef.current.data();
      if (candleData && candleData.length > 0) {
        const currentPrice = candleData[candleData.length - 1].close;
        setCurrentPrice(currentPrice);
        console.log('[Chart] Price synced for symbol change:', symbol.toUpperCase(), '- Price:', currentPrice);
      }
    }
  }, [symbol, setCurrentPrice, history]);

  useEffect(() => {
    if (!candlesRef.current) return;
    const candles = candlesRef.current;

    const activePositions = positions.filter(pos => pos.status === 'FILLED');
    const ids = new Set(activePositions.map(p => `${p.id}`));

    priceLinesRef.current.forEach((line, key) => {
      if (!ids.has(key)) {
        candles.removePriceLine(line);
        priceLinesRef.current.delete(key);
      }
    });

    activePositions.forEach(pos => {
      const key = `${pos.id}`;
      if (!priceLinesRef.current.has(key)) {
        const line = candles.createPriceLine({
          price: pos.price,
          color: pos.side === ORDER_SIDE.BUY ? 'rgba(0,255,0,0.8)' : 'rgba(255,0,0,0.8)',
          lineWidth: 0,
          lineStyle: 0,
          // axisLabelVisible: true,
          axisLabelVisible: true,
          title: `${pos.side}`,
        });
        priceLinesRef.current.set(key, line);
      }
    });
  }, [positions]);

  return <div ref={containerRef} style={{ width: '100%', height: 600 }} />;
}