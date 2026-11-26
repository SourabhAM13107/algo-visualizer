import { useMemo, useState } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { recordBubbleSort } from "../algorithms/bubbleSort";
import { recordInsertionSort } from "../algorithms/insertionSort";
import { recordMergeSort } from "../algorithms/mergeSort";
import { recordQuickSort } from "../algorithms/quickSort";
import ArrayBars from "./ArrayBars";
import MergeBars from "./MergeBars";
import QuickBars from "./QuickBars";

const SORTERS = {
  BUBBLE: { label: "Bubble Sort", record: recordBubbleSort, Bars: ArrayBars },
  INSERTION: { label: "Insertion Sort", record: recordInsertionSort, Bars: ArrayBars },
  MERGE: { label: "Merge Sort", record: recordMergeSort, Bars: MergeBars },
  QUICK: { label: "Quick Sort", record: recordQuickSort, Bars: QuickBars },
};

// only count real work: comparisons and moves
const KEEP = new Set(["start", "compare", "swap", "place", "copy", "done"]);

const INPUTS = {
  random: "Random",
  reversed: "Reversed (worst case)",
  nearly: "Nearly sorted",
};

function makeArray(n, type) {
  const a = Array.from({ length: n }, (_, i) => i + 1);
  if (type === "reversed") return a.reverse();
  if (type === "nearly") {
    for (let k = 0; k < Math.max(1, Math.floor(n / 8)); k++) {
      const i = Math.floor(Math.random() * (n - 1));
      [a[i], a[i + 1]] = [a[i + 1], a[i]];
    }
    return a;
  }
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function countUpTo(steps, i) {
  let comparisons = 0;
  let moves = 0;
  for (let k = 0; k <= i; k++) {
    const t = steps[k].type;
    if (t === "compare") comparisons++;
    else if (t === "swap" || t === "place" || t === "copy") moves++;
  }
  return { comparisons, moves };
}

function Lane({ algo, onAlgo, steps, tick, winner }) {
  const i = Math.min(tick, steps.length - 1);
  const done = tick >= steps.length - 1;
  const { comparisons, moves } = countUpTo(steps, i);
  const { Bars } = SORTERS[algo];

  return (
    <div className={winner ? "lane winner" : "lane"}>
      <select value={algo} onChange={(e) => onAlgo(e.target.value)}>
        {Object.entries(SORTERS).map(([key, s]) => (
          <option key={key} value={key}>{s.label}</option>
        ))}
      </select>

      <Bars step={steps[i]} />

      <div className="stats">
        <span>Comparisons<b>{comparisons}</b></span>
        <span>Moves<b>{moves}</b></span>
        <span>Total<b>{comparisons + moves}</b></span>
      </div>
      {done && <div className="lane-done">Finished</div>}
    </div>
  );
}

export default function Race() {
  const [algoA, setAlgoA] = useState("BUBBLE");
  const [algoB, setAlgoB] = useState("MERGE");
  const [size, setSize] = useState(16);
  const [type, setType] = useState("random");
  const [seed, setSeed] = useState(0);
  const [speed, setSpeed] = useState(6);

  const array = useMemo(() => makeArray(size, type), [size, type, seed]);
  const stepsA = useMemo(
    () => SORTERS[algoA].record(array).filter((s) => KEEP.has(s.type)),
    [algoA, array]
  );
  const stepsB = useMemo(
    () => SORTERS[algoB].record(array).filter((s) => KEEP.has(s.type)),
    [algoB, array]
  );

  const delay = Math.round(600 * Math.pow(0.7, speed));
  const total = Math.max(stepsA.length, stepsB.length);
  const { index, playing, next, reset, toggle } = usePlayer(total, delay);

  const opsA = stepsA.length - 2; // minus the "start" and "done" steps
  const opsB = stepsB.length - 2;
  const raceOver = index >= Math.min(stepsA.length, stepsB.length) - 1;
  const winner = opsA === opsB ? "tie" : opsA < opsB ? "A" : "B";

  let banner = "";
  if (raceOver) {
    if (winner === "tie") {
      banner = `It's a tie: both algorithms used ${opsA} operations.`;
    } else {
      const w = winner === "A" ? algoA : algoB;
      const wOps = winner === "A" ? opsA : opsB;
      const lOps = winner === "A" ? opsB : opsA;
      banner = `${SORTERS[w].label} wins with ${wOps} operations vs ${lOps}.`;
    }
  }

  function restartWith(setter) {
    return (value) => {
      setter(value);
      reset();
    };
  }

  return (
    <>
      <div className="header">
        <h1>Algorithm Race</h1>
        <p>
          Two algorithms sort the exact same array. Each tick is one operation (a comparison or a move),
          so the algorithm that needs fewer operations finishes first.
        </p>
      </div>

      <div className="card">
        <div className="toolbar">
          <label className="target-label">
            Size
            <select value={size} onChange={(e) => restartWith(setSize)(Number(e.target.value))}>
              {[8, 12, 16, 24, 30].map((n) => (
                <option key={n} value={n}>{n} items</option>
              ))}
            </select>
          </label>
          <label className="target-label">
            Input
            <select value={type} onChange={(e) => restartWith(setType)(e.target.value)}>
              {Object.entries(INPUTS).map(([key, text]) => (
                <option key={key} value={key}>{text}</option>
              ))}
            </select>
          </label>
          <button
            onClick={() => {
              setSeed((s) => s + 1);
              reset();
            }}
          >
            New array
          </button>
        </div>

        <div className="race-grid">
          <Lane
            algo={algoA}
            onAlgo={restartWith(setAlgoA)}
            steps={stepsA}
            tick={index}
            winner={raceOver && winner === "A"}
          />
          <Lane
            algo={algoB}
            onAlgo={restartWith(setAlgoB)}
            steps={stepsB}
            tick={index}
            winner={raceOver && winner === "B"}
          />
        </div>

        <div className="controls">
          <button className="primary" onClick={toggle}>
            {playing ? "Pause" : index > 0 ? "Resume" : "Start race"}
          </button>
          <button onClick={next} disabled={index >= total - 1}>Step</button>
          <button onClick={reset}>Reset</button>
          <label>
            Speed
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>
        </div>

        {raceOver && <div className="race-banner">🏆 {banner}</div>}
      </div>
    </>
  );
}