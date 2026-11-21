import { useEffect, useRef, useState } from "react";

export function FlipWords({ words = [], duration = 2800, className = "", wordClassName = "" }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef(null);

  const wordsKey = Array.isArray(words) ? words.join(";;;") : "";

  useEffect(() => {
    if (!words || words.length <= 1) return;

    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = setInterval(() => {
      // Pause flipping when document is hidden (background tab)
      if (typeof document !== "undefined" && document.hidden) return;

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
        className={`aceternity-flip-word ${isExiting ? "flip-exit" : "flip-enter"} ${wordClassName}`}
      >
        {currentWord}
      </span>
    </span>
  );
}
