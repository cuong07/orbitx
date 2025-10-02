function nextDayISO(isoDate) {
  const d = new Date(isoDate + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Giả lập realtime cho lightweight-charts với dữ liệu time dạng "YYYY-MM-DD"
 * @param {Object} params
 * @param {import('lightweight-charts').ISeriesApi<'Candlestick'>} params.series - candlestick series
 * @param {Array} params.initialData - mảng candles ban đầu (time: "YYYY-MM-DD")
 * @param {number} [params.intervalMs=1000] - chu kỳ update
 * @param {number} [params.newBarEvery=10] - số lần update trước khi sinh nến mới
 * @param {number} [params.volatility=4] - biên độ dao động ±volatility/2
 * @returns {function} stop() - gọi để dừng
 */
export function startFakeRealtime({
  series,
  initialData,
  intervalMs = 1000,
  newBarEvery = 10,
  volatility = 4,
}) {
  // sao chép mảng để không mutate trực tiếp từ ngoài
  let data = [...initialData];
  // nến đang chạy (cuối mảng)
  let lastBar = { ...data[data.length - 1] };
  // đếm số tick để tạo nến mới
  let ticks = 0;

  const timer = setInterval(() => {
    // dao động giá
    const delta = (Math.random() - 0.5) * volatility; // ±volatility/2
    const newClose = Math.max(0.01, lastBar.close + delta);

    // cập nhật nến đang chạy
    lastBar = {
      ...lastBar,
      high: Math.max(lastBar.high, newClose),
      low: Math.min(lastBar.low, newClose),
      close: newClose,
    };

    // đẩy update cho series (cùng 'time' => update nến hiện tại)
    series.update(lastBar);

    ticks += 1;
    if (ticks >= newBarEvery) {
      // chốt nến cũ và tạo nến mới ở ngày tiếp theo
      const nextTime = nextDayISO(lastBar.time);

      const newBar = {
        time: nextTime,
        open: lastBar.close,
        high: lastBar.close,
        low: lastBar.close,
        close: lastBar.close,
      };

      // cập nhật reference
      lastBar = newBar;
      data.push(newBar);
      ticks = 0;

      // phát nến mới (time khác => tạo bar mới)
      series.update(newBar);
    }
  }, intervalMs);

  return () => clearInterval(timer);
}
