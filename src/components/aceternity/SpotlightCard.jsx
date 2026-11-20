import { forwardRef, useRef } from "react";

export const SpotlightCard = forwardRef(function SpotlightCard(
  {
    children,
    className = "",
    spotlightColor,
    as: Tag = "div",
    style = {},
    onMouseMove,
    onMouseLeave,
    ...props
  },
  forwardedRef
) {
  const innerRef = useRef(null);

  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const handleMouseMove = (e) => {
    const card = innerRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--spotlight-x", `${x}px`);
      card.style.setProperty("--spotlight-y", `${y}px`);
      card.style.setProperty("--spotlight-opacity", "1");
    }
    if (onMouseMove) onMouseMove(e);
  };

  const handleMouseLeave = (e) => {
    const card = innerRef.current;
    if (card) {
      card.style.setProperty("--spotlight-opacity", "0");
    }
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <Tag
      ref={setRefs}
      className={`aceternity-card-spotlight ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...(spotlightColor ? { "--spotlight-color": spotlightColor } : {}),
        ...style,
      }}
      {...props}
    >
      <div className="card-spotlight-glow" aria-hidden="true" />
      {children}
    </Tag>
  );
});
