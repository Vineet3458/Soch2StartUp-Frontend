export function GridBackground({
  children,
  className = "",
  variant = "grid",
  mask = "radial",
  ...props
}) {
  return (
    <div
      className={`aceternity-grid-bg variant-${variant} mask-${mask} ${className}`}
      {...props}
    >
      <div className="aceternity-grid-mask" aria-hidden="true" />
      <div className="aceternity-grid-content">{children}</div>
    </div>
  );
}
