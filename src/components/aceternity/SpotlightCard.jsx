import { forwardRef, useEffect, useRef } from "react";

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
  const rafRef = useRef(null);

  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const card = innerRef.current;
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        card.style.setProperty("--spotlight-x", `${x}px`);
        card.style.setProperty("--spotlight-y", `${y}px`);
        card.style.setProperty("--spotlight-opacity", "1");
      }
    });

    if (onMouseMove) onMouseMove(e);
  };

  const handleTouchMove = (e) => {
    if (typeof window !== "undefined" && window.matchMedia?.("(hover: none)")?.matches) {
      return;
    }
    if (e.touches && e.touches[0]) {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const card = innerRef.current;
        if (card) {
          const rect = card.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          card.style.setProperty("--spotlight-x", `${x}px`);
          card.style.setProperty("--spotlight-y", `${y}px`);
          card.style.setProperty("--spotlight-opacity", "1");
        }
      });
    }
  };

  const handleMouseLeave = (e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
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
