import { useEffect, useState, useRef, useCallback } from 'react';

const GOLD_SYMBOL = "XAUT-USDT";
const WS_URL = "wss://ws.okx.com:8443/ws/v5/public";

export function useGoldPrice() {
  const [goldPrice, setGoldPrice] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ Connected to OKX");
        reconnectAttempts.current = 0;

        ws.send(
          JSON.stringify({
            op: "subscribe",
            args: [{ channel: "tickers", instId: GOLD_SYMBOL }],
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const res = JSON.parse(event.data);
          if (res.arg?.instId === "XAUT-USD" && res.data?.length) {
            setGoldPrice(res.data[0]);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WS error:", err);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { goldPrice, connect, disconnect };
}
