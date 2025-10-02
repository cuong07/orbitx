import React from "react";

const LustreText = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationStyle = {
    animationDuration: `${speed}s`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationFillMode: "forwards",
  };

  return (
    <span
      className={`
    lustre-text
    ${!disabled ? "animate-shine" : ""}
    dark:lustre-dark lustre-light
    ${className}
  `}
      style={!disabled ? animationStyle : undefined}>
      {text}
    </span>
  );
};

export default LustreText;