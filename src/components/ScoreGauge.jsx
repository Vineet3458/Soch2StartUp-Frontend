import { useEffect, useState } from "react";

const COLORS = { GO: "#16a34a", IMPROVE: "#d97706", AVOID: "#dc2626" };

// Circular score meter that animates from 0 to the score
export default function ScoreGauge({ score, verdict }) {
  const [value, setValue] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setValue(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="gauge">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} className="gauge-bg" />
        <circle
          cx="100" cy="100" r={radius}
          className="gauge-fg"
          stroke={COLORS[verdict]}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className="gauge-text">
        <strong>{score}</strong>
        <small>out of 100</small>
      </div>
    </div>
  );
}
