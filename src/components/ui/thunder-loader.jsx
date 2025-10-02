"use client";;
import * as React from "react";
import { motion } from "framer-motion";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const thunderLoaderVariants = cva("inline-block overflow-visible", {
  variants: {
    size: {
      xs: "w-4 h-4",
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
      "2xl": "w-20 h-20"
    },
    variant: {
      default: "",
      electric: "",
      fire: "",
      ice: "",
      rainbow: "",
      subtle: ""
    }
  },
  defaultVariants: {
    size: "md",
    variant: "default"
  }
});

const variantColors = {
  default: {
    shimmer: "#60a5fa",
    glow: "#3b82f6",
    base: "#1e40af"
  },
  fire: {
    shimmer: "#fbbf24",
    glow: "#f59e0b",
    base: "#d97706"
  },
  electric: {
    shimmer: "#fb7185",
    glow: "#f43f5e",
    base: "#e11d48"
  },
  ice: {
    shimmer: "#67e8f9",
    glow: "#06b6d4",
    base: "#0891b2"
  },
  rainbow: {
    shimmer: "#a855f7",
    glow: "#8b5cf6",
    base: "#7c3aed"
  },
  subtle: {
    shimmer: "#94a3b8",
    glow: "#64748b",
    base: "#475569"
  }
};

const defaultThunderPath = "M50 10 L 35 45 L 55 45 L 40 70 L 70 35 L 50 35 L 65 10 Z";
// const defaultThunderPath = "M1938 2325 c-4 -4 36 -63 88 -131 52 -68 91 -124 87 -124 -4 0 3 -7 15 -16 12 -8 22 -21 22 -28 0 -8 7 -16 15 -20 8 -3 15 -12 15 -20 0 -8 4 -16 8 -18 4 -1 20 -19 35 -39 l27 -36 -31 -44 c-17 -24 -36 -48 -43 -54 -6 -5 -17 -22 -24 -36 -8 -15 -62 -84 -121 -155 -83 -99 -125 -140 -181 -178 -92 -61 -377 -209 -389 -201 -5 3 -11 0 -13 -5 -2 -6 -10 -12 -18 -14 -8 -2 -41 -15 -73 -30 -32 -14 -68 -28 -80 -30 -12 -3 -24 -5 -27 -6 -3 -2 -8 -2 -12 -1 -5 0 -8 -4 -8 -9 0 -5 -3 -9 -7 -8 -5 0 -15 -1 -23 -5 -263 -100 -603 -146 -733 -97 -52 20 -103 63 -126 107 -21 42 -13 121 20 190 29 61 96 153 145 199 44 42 86 94 76 94 -22 0 -203 -176 -269 -262 -73 -94 -98 -153 -98 -233 0 -62 3 -75 30 -112 41 -56 107 -99 184 -119 51 -13 97 -15 225 -11 89 2 170 7 181 10 11 3 58 12 105 21 47 9 146 34 220 57 74 23 140 42 145 43 6 1 15 5 21 8 12 8 126 52 136 53 3 0 10 3 14 8 4 4 16 7 26 7 10 0 18 5 18 11 0 5 5 7 10 4 6 -3 10 -1 10 4 0 6 3 10 8 9 6 -2 122 55 252 124 99 52 362 222 408 264 32 28 84 90 116 138 33 47 62 86 66 86 5 0 43 -51 148 -199 l32 -46 128 -5 c70 -3 131 -2 136 1 4 4 0 15 -10 26 -26 25 -209 275 -208 282 1 3 -7 12 -17 19 -11 7 -19 18 -19 23 0 5 -11 22 -25 37 -28 31 -32 50 -10 58 8 4 15 11 15 16 0 16 101 148 113 148 6 0 8 3 4 6 -3 3 30 54 74 112 43 58 79 110 79 116 0 8 -40 10 -127 8 -126 -3 -128 -4 -154 -32 -14 -15 -29 -35 -32 -44 -4 -9 -11 -16 -17 -16 -5 0 -10 -7 -10 -15 0 -9 -7 -18 -15 -21 -8 -4 -15 -12 -15 -20 0 -8 -4 -14 -10 -14 -5 0 -10 -5 -10 -11 0 -14 -39 -69 -49 -69 -5 0 -46 54 -92 120 l-84 120 -115 0 c-63 0 -124 3 -135 6 -11 3 -23 2 -27 -1z m273 -47 c4 -7 16 -23 26 -35 10 -12 43 -56 73 -97 30 -42 61 -78 68 -81 22 -8 51 17 102 90 95 137 94 136 187 139 119 3 122 1 78 -62 -20 -29 -42 -61 -50 -70 -54 -66 -170 -232 -178 -255 -7 -18 12 -64 36 -89 7 -7 28 -35 47 -63 30 -44 59 -84 90 -122 31 -38 89 -127 86 -131 -7 -7 -160 -5 -181 2 -11 4 -42 38 -69 76 -87 121 -119 154 -144 146 -12 -4 -53 -49 -91 -99 -80 -107 -90 -117 -193 -186 -173 -115 -398 -240 -573 -319 -147 -66 -391 -150 -518 -178 -149 -33 -219 -44 -327 -50 -242 -14 -394 44 -435 165 -13 39 -14 57 -5 97 11 47 41 107 75 149 16 20 16 20 6 -2 -6 -12 -11 -55 -11 -95 0 -64 4 -80 28 -119 87 -137 323 -151 716 -44 211 57 530 193 734 314 29 17 55 31 57 31 16 0 137 117 208 201 94 111 207 273 207 298 0 23 -27 72 -66 120 -26 32 -141 187 -172 233 -32 46 -32 47 -10 50 56 8 192 -2 199 -14z";

const ThunderLoader = React.forwardRef(({
  className,
  size,
  variant = "default",
  fillDuration = 2,
  glowDuration = 3,
  animateDuration = 2,
  fillColor,
  glowColor,
  baseColor,
  strokeWidth = 2,
  showGlow = false,
  showFill = false,
  animate = false,
  viewBox = "0 0 100 80",
  customPath,
  ...props
}, ref) => {
  const colors = variantColors[variant] || variantColors.default;
  const finalFillColor = fillColor || colors.shimmer;
  const finalGlowColor = glowColor || colors.glow;
  const finalBaseColor = baseColor || colors.base;
  const thunderPath = customPath || defaultThunderPath;
  const isThunderAnimation = animate === "thunder";

  const gradientId = React.useMemo(() => `thunder-gradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const filterId = React.useMemo(() => `thunder-filter-${Math.random().toString(36).substr(2, 9)}`, []);

  const pathRef = React.useRef(null);
  const [pathLength, setPathLength] = React.useState(0);
  const [fillProgress, setFillProgress] = React.useState(0);

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [thunderPath]);

  React.useEffect(() => {
    if (!showFill) return;
    let frame;
    let start = null;
    function animateFill(ts) {
      if (start === null) start = ts;
      const elapsed = (ts - start) / 1000;
      const fillTime = fillDuration;
      const unfillTime = fillDuration * 1.5;
      const total = fillTime + unfillTime;
      const t = elapsed % total;
      let progress;
      if (t < fillTime) {
        progress = t / fillTime;
      } else {
        progress = 1 - ((t - fillTime) / unfillTime);
      }
      setFillProgress(progress);
      frame = requestAnimationFrame(animateFill);
    }
    frame = requestAnimationFrame(animateFill);
    return () => cancelAnimationFrame(frame);
  }, [fillDuration, showFill]);

  return (
    <div
      ref={ref}
      className={cn(thunderLoaderVariants({ size, variant }), className)}
      {...props}>
      <motion.svg
        className="w-full h-full"
        viewBox={viewBox}
        fill="none"
        initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
        animate={animate ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, ease: "easeOut" }}>
        <defs>
          {showFill && (
            <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={finalFillColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor={finalFillColor} stopOpacity="0.1" />
            </linearGradient>
          )}
          {showGlow && (
            <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>
        {showGlow && (
          <motion.path
            d={thunderPath}
            stroke={finalGlowColor}
            strokeWidth={strokeWidth + 1}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${filterId})`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0.6 }}>
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur={`${glowDuration}s`}
              repeatCount="indefinite" />
          </motion.path>
        )}
        <motion.path
          ref={pathRef}
          d={thunderPath}
          stroke={finalBaseColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={isThunderAnimation ? false : (animate ? { pathLength: 0, opacity: 0 } : undefined)}
          animate={
            isThunderAnimation
              ? {
                strokeDasharray: pathLength,
                strokeDashoffset: [pathLength, -pathLength],
              }
              : animate
                ? { pathLength: 1, opacity: 1 }
                : undefined
          }
          transition={
            isThunderAnimation
              ? {
                repeat: Infinity,
                duration: animateDuration,
                ease: "linear",
              }
              : animate
                ? { duration: animateDuration, delay: 0.5, ease: "easeInOut" }
                : undefined
          } />
        {showFill && (
          <mask id={`fill-mask-${gradientId}`}>
            <rect
              x="0"
              y={80 - fillProgress * 80}
              width="100"
              height={fillProgress * 80}
              fill="white" />
          </mask>
        )}
        {showFill && (
          <path
            d={thunderPath}
            fill={`url(#${gradientId})`}
            stroke="none"
            mask={`url(#fill-mask-${gradientId})`} />
        )}
        {variant === "rainbow" && (
          <motion.circle
            cx="50"
            cy="40"
            r="1"
            fill={finalFillColor}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              delay: 1
            }} />
        )}
      </motion.svg>
    </div>
  );
});

ThunderLoader.displayName = "ThunderLoader";

export { ThunderLoader, thunderLoaderVariants };