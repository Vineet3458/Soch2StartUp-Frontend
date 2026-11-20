import { forwardRef } from "react";
import { Link } from "react-router-dom";

export const ShimmerButton = forwardRef(function ShimmerButton(
  {
    children,
    to,
    href,
    className = "",
    variant = "shimmer",
    size = "md",
    type = "button",
    ...props
  },
  ref
) {
  const isExternal = href || (typeof to === "string" && /^https?:\/\//.test(to));
  const isInternal = to && !isExternal;
  const classes = `aceternity-btn aceternity-btn-${variant} aceternity-btn-${size} ${className}`;

  if (isInternal) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        <span className="aceternity-btn-border-spark" aria-hidden="true" />
        <span className="aceternity-btn-inner">{children}</span>
      </Link>
    );
  }

  if (isExternal) {
    return (
      <a ref={ref} href={href || to} className={classes} {...props}>
        <span className="aceternity-btn-border-spark" aria-hidden="true" />
        <span className="aceternity-btn-inner">{children}</span>
      </a>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} {...props}>
      <span className="aceternity-btn-border-spark" aria-hidden="true" />
      <span className="aceternity-btn-inner">{children}</span>
    </button>
  );
});
