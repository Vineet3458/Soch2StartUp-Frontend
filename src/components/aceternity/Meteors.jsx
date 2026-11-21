import { useMemo } from "react";

export function Meteors({ number = 18, color, className = "" }) {
  const meteors = useMemo(() => {
    return Array.from({ length: number }, (_, i) => {
      // Deterministic, evenly-scattered distribution across the container
      const left = Math.round((i * 37) % 100);
      const top = Math.round(((i * 29) % 110) - 20);
      const delay = (0.2 + ((i * 0.45) % 4.5)).toFixed(2);
      const duration = (3.5 + ((i * 0.55) % 4)).toFixed(2);
      return { id: i, top, left, delay, duration };
    });
  }, [number]);

  return (
    <div
      className={`aceternity-meteors-wrapper ${className}`}
      style={color ? { "--meteor-color": color } : undefined}
      aria-hidden="true"
    >
      {meteors.map((m) => (
        <span
          key={m.id}
          className="aceternity-meteor"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
