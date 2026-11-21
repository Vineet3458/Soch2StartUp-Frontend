import { useEffect, useRef, useState } from "react";

/* Subtle reveal utility (simplified from scroll-reveal) */
export function Reveal({ children, delay: _delay = 0, className = "", as: Tag = "div", ...rest }) {
  return <Tag className={`reveal in ${className}`} {...rest}>{children}</Tag>;
}

/* Animated number that counts up */
export function CountUp({ value, duration = 1100, decimals = 0, prefix = "", suffix = "" }) {
  const [n, setN] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const to = Number(value) || 0, start = from.current, t0 = performance.now();
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      setN(to);
      from.current = to;
      return;
    }
    let raf;
    let currentVal = start;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration), e = 1 - Math.pow(1 - p, 4);
      currentVal = start + (to - start) * e;
      setN(currentVal);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        from.current = to;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = currentVal;
    };
  }, [value, duration]);
  return <>{prefix}{n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

/* 3D Interactive Parallax Tilt container */
export function Tilt({ children, className = "", max = 6, scale = 1.01, ...rest }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("");
  const [transition, setTransition] = useState("");

  const handleMouseMove = (e) => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -max;
    const rotateY = ((x - centerX) / centerX) * max;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);
    setTransition("transform 0.08s ease-out");
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setTransition("transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)");
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        transition,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </div>
  );
}
