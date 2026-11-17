import { useEffect, useRef, useState } from "react";

/* Animated cosmic background: parallax starfield, constellations, shooting stars + aurora blobs */
export function CosmicBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, dpr, stars = [], shooters = [], raf, mx = 0, my = 0, tx = 0, ty = 0, last = 0;
    const starRGB = () => getComputedStyle(document.documentElement).getPropertyValue("--star").trim() || "255,255,255";
    let rgb = starRGB();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(170, Math.floor((w * h) / 9000));
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.9 + 0.1, r: Math.random() * 1.4 + 0.3, t: Math.random() * 6.28, s: Math.random() * 0.02 + 0.006, vx: (Math.random() - 0.5) * 0.06 }));
    };
    const spawnShooter = () => { if (shooters.length < 2) shooters.push({ x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, vx: 7 + Math.random() * 4, vy: 3 + Math.random() * 2, life: 1 }); };

    const draw = (ts) => {
      const dt = Math.min(48, ts - last || 16); last = ts;
      ctx.clearRect(0, 0, w, h);
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
      for (const s of stars) {
        s.t += s.s * dt * 0.06; s.x += s.vx * s.z * (dt / 16); if (s.x < -5) s.x = w + 5; if (s.x > w + 5) s.x = -5;
        const px = s.x + mx * s.z * 24, py = s.y + my * s.z * 24;
        const a = (0.35 + Math.sin(s.t) * 0.3) * (0.4 + s.z * 0.6);
        ctx.beginPath(); ctx.arc(px, py, s.r * s.z * 1.3, 0, 6.28); ctx.fillStyle = `rgba(${rgb},${Math.max(0.05, a)})`; ctx.fill();
        s._px = px; s._py = py;
      }
      // faint constellation lines between close stars
      ctx.lineWidth = 0.6;
      for (let i = 0; i < stars.length; i += 2) for (let j = i + 1; j < stars.length; j += 3) {
        const a = stars[i], b = stars[j], d = Math.hypot(a._px - b._px, a._py - b._py);
        if (d < 95) { ctx.strokeStyle = `rgba(${rgb},${0.07 * (1 - d / 95)})`; ctx.beginPath(); ctx.moveTo(a._px, a._py); ctx.lineTo(b._px, b._py); ctx.stroke(); }
      }
      for (const s of shooters) {
        s.x += s.vx; s.y += s.vy; s.life -= 0.012;
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
        g.addColorStop(0, `rgba(${rgb},${s.life})`); g.addColorStop(1, "rgba(139,92,246,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14); ctx.stroke();
      }
      shooters = shooters.filter((s) => s.life > 0 && s.x < w + 50 && s.y < h + 50);
      if (Math.random() < 0.004) spawnShooter();
      if (!reduce && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const onMove = (e) => { tx = (e.clientX / w - 0.5) * 2; ty = (e.clientY / h - 0.5) * 2; };
    const onVis = () => { if (!document.hidden && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
    const mo = new MutationObserver(() => { rgb = starRGB(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    resize(); raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize); window.addEventListener("mousemove", onMove, { passive: true }); document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(raf); mo.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  return (
    <div className="cosmos" aria-hidden="true">
      <div className="aurora"><span /><span /><span /></div>
      <div className="grid-overlay" />
      <canvas ref={ref} />
    </div>
  );
}

/* Fades + slides children in when scrolled into view */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms` }} {...rest}>{children}</Tag>;
}

/* Animated number that counts up (and re-animates when the value changes live) */
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

/* Card tilt + moving spotlight on hover */
export function Tilt({ children, className = "", max = 6, ...rest }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current, r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateY(-4px)`;
  };
  const leave = () => { ref.current.style.transform = ""; };
  return <div ref={ref} className={className} onMouseMove={move} onMouseLeave={leave} style={{ transition: "transform .25s var(--ease)" }} {...rest}>{children}</div>;
}
