// // fakeRealtime.js

// /**
//  * Fake realtime candle generator
//  * @param {Array} initialData - mảng dữ liệu candle ban đầu
//  * @param {function} callback - hàm sẽ được gọi mỗi lần có dữ liệu mới
//  * @param {number} intervalMs - chu kỳ update (ms)
//  */
// export function startFakeRealtime(initialData, callback, intervalMs = 1000) {
//   let data = [...initialData];
//   let lastBar = data[data.length - 1];

//   const timer = setInterval(() => {
//     // giả lập biến động giá
//     const delta = (Math.random() - 0.5) * 4; // ±2
//     const newClose = Math.max(1, lastBar.close + delta);

//     // cập nhật nến đang chạy
//     lastBar = {
//       ...lastBar,
//       high: Math.max(lastBar.high, newClose),
//       low: Math.min(lastBar.low, newClose),
//       close: newClose,
//     };

//     // thay thế nến cuối trong mảng
//     data[data.length - 1] = lastBar;

//     // gọi callback để cập nhật chart
//     callback(lastBar, data);
//   }, intervalMs);

//   return () => clearInterval(timer); // hàm stop
// }
