export function BackgroundGradient({
  children,
  className = "",
  containerClassName = "",
  animate = true,
  glowColor,
  ...props
}) {
  return (
    <div
      className={`aceternity-bg-gradient-container ${containerClassName} ${animate ? "animate" : ""}`}
      style={glowColor ? { "--gradient-glow": glowColor } : undefined}
      {...props}
    >
      <div className="aceternity-bg-gradient-blur" aria-hidden="true" />
      <div className="aceternity-bg-gradient-border" aria-hidden="true" />
      <div className={`aceternity-bg-gradient-content ${className}`}>
        {children}
      </div>
    </div>
  );
}
