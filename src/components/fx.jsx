import { useEffect, useRef, useState } from "react";

/* Subtle reveal utility (simplified from scroll-reveal) */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
  return <Tag className={`reveal in ${className}`} style={{ "--d": `${delay}ms` }} {...rest}>{children}</Tag>;
}

/* Animated number that counts up */
export function CountUp({ value, duration = 1100, decimals = 0, prefix = "", suffix = "" }) {
  const [n, setN] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const to = Number(value) || 0, start = from.current, t0 = performance.now();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); from.current = to; return; }
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration), e = 1 - Math.pow(1 - p, 4);
      setN(start + (to - start) * e);
      if (p < 1) raf = requestAnimationFrame(tick); else from.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{prefix}{n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

/* Tilt container kept for backward compatibility */
export function Tilt({ children, className = "", ...rest }) {
  return <div className={className} {...rest}>{children}</div>;
}
