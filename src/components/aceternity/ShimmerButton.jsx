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
    disabled = false,
    loading = false,
    onClick,
    ...props
  },
  ref
) {
  const isExternal = href || (typeof to === "string" && /^https?:\/\//.test(to));
  const isInternal = to && !isExternal;
  const isDisabled = disabled || loading;
  const classes = `aceternity-btn aceternity-btn-${variant} aceternity-btn-${size} ${loading ? "loading" : ""} ${className}`;

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  if (isInternal) {
    return (
      <Link
        ref={ref}
        to={isDisabled ? "#" : to}
        className={classes}
        aria-disabled={isDisabled ? true : undefined}
        onClick={handleClick}
        tabIndex={isDisabled ? -1 : undefined}
        {...props}
      >
        <span className="aceternity-btn-border-spark" aria-hidden="true" />
        <span className="aceternity-btn-inner">{children}</span>
      </Link>
    );
  }

  if (isExternal) {
    return (
      <a
        ref={ref}
        href={isDisabled ? "#" : (href || to)}
        className={classes}
        aria-disabled={isDisabled ? true : undefined}
        onClick={handleClick}
        tabIndex={isDisabled ? -1 : undefined}
        {...props}
      >
        <span className="aceternity-btn-border-spark" aria-hidden="true" />
        <span className="aceternity-btn-inner">{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      <span className="aceternity-btn-border-spark" aria-hidden="true" />
      <span className="aceternity-btn-inner">{children}</span>
    </button>
  );
});
