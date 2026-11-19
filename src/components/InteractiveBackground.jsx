import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Track dark vs light theme live
    let isLight = document.documentElement.getAttribute("data-theme") === "light";
    const observer = new MutationObserver(() => {
      isLight = document.documentElement.getAttribute("data-theme") === "light";
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Mouse coordinates with smooth lerp
    const mouse = {
      x: width * 0.5,
      y: height * 0.3,
      targetX: width * 0.5,
      targetY: height * 0.3,
      hasMoved: false,
      radius: 260,
    };

    const onMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.hasMoved = true;
    };
    const onMouseLeave = () => {
      mouse.hasMoved = false;
      mouse.targetX = width * 0.5;
      mouse.targetY = height * 0.3;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Grid configuration
    const GRID_SIZE = 48;

    // Traveling light beams along grid lines
    const beams = [
      { axis: "x", pos: 96, coord: 0, length: 140, speed: 2.2, dir: 1, color: "#0070F3" },
      { axis: "x", pos: 288, coord: width, length: 160, speed: 1.8, dir: -1, color: "#50E3C2" },
      { axis: "y", pos: 192, coord: 0, length: 130, speed: 2.0, dir: 1, color: "#0070F3" },
      { axis: "y", pos: Math.floor(width / GRID_SIZE) * GRID_SIZE - 144, coord: height, length: 150, speed: 1.6, dir: -1, color: "#50E3C2" },
    ];

    // Subtle floating interactive nodes
    const NODE_COUNT = Math.min(38, Math.floor((width * height) / 32000));
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 1.5 + 1,
    }));

    // Animation Loop
    const render = (now) => {
      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Top Breathing Spotlight (follows theme)
      const pulse = 0.85 + Math.sin(now * 0.001) * 0.15;
      const topGradient = ctx.createRadialGradient(
        width * 0.5,
        -50,
        10,
        width * 0.5,
        0,
        Math.max(width * 0.55, 600) * pulse
      );
      if (isLight) {
        topGradient.addColorStop(0, "rgba(0, 104, 214, 0.09)");
        topGradient.addColorStop(0.5, "rgba(6, 122, 106, 0.03)");
        topGradient.addColorStop(1, "transparent");
      } else {
        topGradient.addColorStop(0, "rgba(0, 112, 243, 0.22)");
        topGradient.addColorStop(0.4, "rgba(80, 227, 194, 0.06)");
        topGradient.addColorStop(1, "transparent");
      }
      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive Cursor Spotlight (moves dynamically with mouse)
      if (mouse.hasMoved || mouse.x !== width * 0.5) {
        const cursorSpot = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        if (isLight) {
          cursorSpot.addColorStop(0, "rgba(0, 104, 214, 0.08)");
          cursorSpot.addColorStop(0.6, "rgba(0, 104, 214, 0.02)");
          cursorSpot.addColorStop(1, "transparent");
        } else {
          cursorSpot.addColorStop(0, "rgba(0, 112, 243, 0.18)");
          cursorSpot.addColorStop(0.5, "rgba(80, 227, 194, 0.05)");
          cursorSpot.addColorStop(1, "transparent");
        }
        ctx.fillStyle = cursorSpot;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Crisp Geometric Grid
      const baseGridColor = isLight ? "rgba(0, 0, 0, 0.035)" : "rgba(255, 255, 255, 0.035)";
      ctx.strokeStyle = baseGridColor;
      ctx.lineWidth = 1;

      // Draw horizontal lines
      ctx.beginPath();
      for (let y = 0; y <= height; y += GRID_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      // Draw vertical lines
      for (let x = 0; x <= width; x += GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      // 4. Interactive Crosshairs & Proximity Illumination near mouse
      const maxDist = mouse.radius;
      const startX = Math.max(0, Math.floor((mouse.x - maxDist) / GRID_SIZE) * GRID_SIZE);
      const endX = Math.min(width, Math.ceil((mouse.x + maxDist) / GRID_SIZE) * GRID_SIZE);
      const startY = Math.max(0, Math.floor((mouse.y - maxDist) / GRID_SIZE) * GRID_SIZE);
      const endY = Math.min(height, Math.ceil((mouse.y + maxDist) / GRID_SIZE) * GRID_SIZE);

      for (let x = startX; x <= endX; x += GRID_SIZE) {
        for (let y = startY; y <= endY; y += GRID_SIZE) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const factor = Math.pow(1 - dist / maxDist, 2);
            // Draw illuminated micro crosshair (+) at grid intersection
            ctx.strokeStyle = isLight
              ? `rgba(0, 104, 214, ${factor * 0.55})`
              : `rgba(0, 112, 243, ${factor * 0.75})`;
            ctx.lineWidth = 1.2;
            const arm = 3.5;
            ctx.beginPath();
            ctx.moveTo(x - arm, y);
            ctx.lineTo(x + arm, y);
            ctx.moveTo(x, y - arm);
            ctx.lineTo(x, y + arm);
            ctx.stroke();

            // Center glow dot on close proximity
            if (dist < maxDist * 0.5) {
              const coreAlpha = (1 - dist / (maxDist * 0.5)) * (isLight ? 0.6 : 0.85);
              ctx.fillStyle = isLight
                ? `rgba(0, 104, 214, ${coreAlpha})`
                : `rgba(80, 227, 194, ${coreAlpha})`;
              ctx.beginPath();
              ctx.arc(x, y, 1.4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // 5. Traveling Grid Beams (Subtle high-tech light streaks)
      if (!prefersReducedMotion) {
        for (const beam of beams) {
          beam.coord += beam.speed * beam.dir;
          if (beam.axis === "x") {
            if (beam.dir === 1 && beam.coord - beam.length > width) {
              beam.coord = -beam.length;
              beam.pos = Math.floor(Math.random() * (height / GRID_SIZE)) * GRID_SIZE;
            } else if (beam.dir === -1 && beam.coord + beam.length < 0) {
              beam.coord = width + beam.length;
              beam.pos = Math.floor(Math.random() * (height / GRID_SIZE)) * GRID_SIZE;
            }

            const x0 = beam.dir === 1 ? beam.coord - beam.length : beam.coord + beam.length;
            const x1 = beam.coord;
            const grad = ctx.createLinearGradient(x0, beam.pos, x1, beam.pos);
            grad.addColorStop(0, "transparent");
            grad.addColorStop(
              1,
              isLight ? "rgba(0, 104, 214, 0.35)" : beam.color === "#50E3C2" ? "rgba(80, 227, 194, 0.45)" : "rgba(0, 112, 243, 0.55)"
            );
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x0, beam.pos);
            ctx.lineTo(x1, beam.pos);
            ctx.stroke();
          } else {
            if (beam.dir === 1 && beam.coord - beam.length > height) {
              beam.coord = -beam.length;
              beam.pos = Math.floor(Math.random() * (width / GRID_SIZE)) * GRID_SIZE;
            } else if (beam.dir === -1 && beam.coord + beam.length < 0) {
              beam.coord = height + beam.length;
              beam.pos = Math.floor(Math.random() * (width / GRID_SIZE)) * GRID_SIZE;
            }

            const y0 = beam.dir === 1 ? beam.coord - beam.length : beam.coord + beam.length;
            const y1 = beam.coord;
            const grad = ctx.createLinearGradient(beam.pos, y0, beam.pos, y1);
            grad.addColorStop(0, "transparent");
            grad.addColorStop(
              1,
              isLight ? "rgba(0, 104, 214, 0.35)" : beam.color === "#50E3C2" ? "rgba(80, 227, 194, 0.45)" : "rgba(0, 112, 243, 0.55)"
            );
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(beam.pos, y0);
            ctx.lineTo(beam.pos, y1);
            ctx.stroke();
          }
        }
      }

      // 6. Interactive Floating Nodes & Constellation Links
      if (!prefersReducedMotion) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0) n.x = width;
          if (n.x > width) n.x = 0;
          if (n.y < 0) n.y = height;
          if (n.y > height) n.y = 0;

          // Interactive repulsion from mouse
          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140 && mdist > 0) {
            const force = (1 - mdist / 140) * 1.8;
            n.x += (mdx / mdist) * force;
            n.y += (mdy / mdist) * force;
          }

          // Node drawing
          const isNear = mdist < 180;
          ctx.fillStyle = isLight
            ? isNear
              ? "rgba(0, 104, 214, 0.6)"
              : "rgba(0, 0, 0, 0.16)"
            : isNear
            ? "rgba(80, 227, 194, 0.75)"
            : "rgba(255, 255, 255, 0.22)";

          ctx.beginPath();
          ctx.arc(n.x, n.y, isNear ? n.size * 1.3 : n.size, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby nodes
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n.x - n2.x;
            const dy = n.y - n2.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 95) {
              const alpha = (1 - d / 95) * (isLight ? 0.08 : 0.12);
              ctx.strokeStyle = isLight
                ? `rgba(0, 104, 214, ${alpha})`
                : `rgba(0, 112, 243, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    if (prefersReducedMotion) {
      render(0); // render once statically
    } else {
      animId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="interactive-bg-wrapper" aria-hidden="true">
      <div className="ambient-glow" />
      <canvas ref={canvasRef} className="interactive-bg-canvas" />
    </div>
  );
}
