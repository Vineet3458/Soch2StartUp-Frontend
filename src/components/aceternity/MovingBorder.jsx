export function MovingBorder({
  children,
  as: Component = "div",
  className = "",
  containerClassName = "",
  duration = 4000,
  borderClassName = "",
  style = {},
  ...props
}) {
  return (
    <Component
      className={`aceternity-moving-border-container ${containerClassName}`}
      style={{ "--border-duration": `${duration}ms`, ...style }}
      {...props}
    >
      <div className={`aceternity-moving-border-spark ${borderClassName}`} aria-hidden="true" />
      <div className={`aceternity-moving-border-content ${className}`}>
        {children}
      </div>
    </Component>
  );
}
