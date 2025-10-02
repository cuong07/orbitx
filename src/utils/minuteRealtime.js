// minuteRealtime.js

const round2 = (n) => Math.round(n * 100) / 100;

/** Tạo lịch sử nến theo phút (candles = số nến) */
export function generateMinuteHistory({
  fromUnixSec,         // thời điểm bắt đầu (giây)
  candles = 300,       // số nến muốn có
  startPrice = 100,
  maxStep = 1.8,       // biên độ nhảy mỗi nến
}) {
  const out = [];
  let t = fromUnixSec;
  let price = startPrice;

  for (let i = 0; i < candles; i++) {
    const open = price;
    const change = (Math.random() - 0.5) * maxStep * 2;
    const close = Math.max(0.01, open + change);
    const high = Math.max(open, close) + Math.random() * (maxStep * 0.8);
    const low = Math.min(open, close) - Math.random() * (maxStep * 0.8);

    out.push({
      time: t,                            // ⬅️ UNIX seconds (per-minute)
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
    });
    price = close;
    t += 60; // mỗi nến cách nhau 60 giây
  }
  return out;
}

/**
 * Giả lập realtime trên khung phút:
 * - Mỗi intervalMs cập nhật nến đang chạy (snapshots)
 * - Khi đủ 60s => chốt nến, tạo nến mới
 */
export function startFakeRealtimeMinutes({
  series,
  initialData,        // mảng candles (UNIX seconds)
  intervalMs = 1000,  // cập nhật mỗi 1s
  secondsPerBar = 60, // bar = 1 phút
  tickVolatility = 0.6,
}) {
  let lastBar = { ...initialData[initialData.length - 1] };
  let elapsed = 0; // giây trôi qua trong bar hiện tại

  const timer = setInterval(() => {
    // cập nhật snapshot trong cùng 1 bar (time KHÔNG đổi)
    const delta = (Math.random() - 0.5) * tickVolatility * 2;
    const newClose = Math.max(0.01, lastBar.close + delta);
    lastBar.close = round2(newClose);
    lastBar.high = Math.max(lastBar.high, lastBar.close);
    lastBar.low = Math.min(lastBar.low, lastBar.close);

    series.update({ ...lastBar });

    elapsed += intervalMs / 1000;

    // đủ 1 bar => chốt bar, tạo bar mới (time + 60)
    if (elapsed >= secondsPerBar) {
      const nextTime = lastBar.time + secondsPerBar;
      lastBar = {
        time: nextTime,
        open: lastBar.close,
        high: lastBar.close,
        low: lastBar.close,
        close: lastBar.close,
      };
      series.update({ ...lastBar }); // emit bar mới
      elapsed = 0;
    }
  }, intervalMs);

  return () => clearInterval(timer);
}
