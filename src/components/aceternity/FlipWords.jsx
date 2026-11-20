import { useEffect, useRef, useState } from "react";

export function FlipWords({ words = [], duration = 2800, className = "" }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef(null);

  const wordsKey = Array.isArray(words) ? words.join(";;;") : "";

  useEffect(() => {
    if (!words || words.length <= 1) return;

    const interval = setInterval(() => {
      setIsExiting(true);
      timeoutRef.current = setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % words.length);
        setIsExiting(false);
      }, 350);
    }, duration);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [wordsKey, duration, words.length]);

  if (!words || words.length === 0) return null;

  const safeIdx = currentIdx < words.length ? currentIdx : 0;
  const currentWord = words[safeIdx] || "";

  return (
    <span className={`aceternity-flip-words-wrapper ${className}`}>
      <span
        key={`${safeIdx}-${currentWord}`}
        className={`aceternity-flip-word ${isExiting ? "flip-exit" : "flip-enter"}`}
      >
        {currentWord}
      </span>
    </span>
  );
}
