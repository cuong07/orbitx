// import { toast } from "sonner"
// import { ArrowUpRight, ArrowDownRight } from "lucide-react"


// export function showProfitToast({ profit, currency = "USDT" }) {
//   const isProfit = profit >= 0

//   const formatted = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//     minimumFractionDigits: 2,
//   }).format(Math.abs(profit))

//   toast(
//     () => (
//       <div className="flex items-center gap-3">
//         <div
//           className={`flex h-10 w-10 items-center justify-center rounded-full 
//           ${isProfit ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500"}`}
//         >
//           {isProfit ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
//         </div>
//         <div>
//           <p className="font-semibold text-foreground">
//             {isProfit ? "Profit Gained" : "Loss Incurred"}
//           </p>
//           <p className={`text-sm ${isProfit ? "text-emerald-500" : "text-red-500"}`}>
//             {isProfit ? "+" : "-"}{formatted}
//           </p>
//         </div>
//       </div>
//     ),
//     {
//       duration: 4000,
//       className: "border border-slate-800 shadow-lg rounded-xl",
//     }
//   )
// }
