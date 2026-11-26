import { useEffect, useState } from "react";

export function usePlayer(totalSteps, delay = 800) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // while playing, move forward one step after `delay` ms
  useEffect(() => {
    if (!playing) return;
    if (index >= totalSteps - 1) {
      setPlaying(false); // reached the end, stop
      return;
    }
    const id = setTimeout(() => setIndex((i) => i + 1), delay);
    return () => clearTimeout(id);
  }, [playing, index, delay, totalSteps]);

  return {
    index,
    playing,
    next: () => setIndex((i) => Math.min(totalSteps - 1, i + 1)),
    prev: () => setIndex((i) => Math.max(0, i - 1)),
    reset: () => {
      setPlaying(false);
      setIndex(0);
    },
    toggle: () => {
      if (index >= totalSteps - 1) setIndex(0); // replay from the start
      setPlaying((p) => !p);
    },
  };
}