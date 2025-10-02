export const formatUSD = (value) => {
  if (typeof value !== 'number') return value;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

//  <span className="font-mono text-foreground">{balance.totalUSDT} USD</span>
// .toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })