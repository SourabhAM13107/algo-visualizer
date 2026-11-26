import { useMemo, useState } from "react";
import { recordBFS } from "./algorithms/bfs";
import { recordDFS } from "./algorithms/dfs";
import { recordBubbleSort } from "./algorithms/bubbleSort";
import { recordInsertionSort } from "./algorithms/insertionSort";
import { recordBinarySearch } from "./algorithms/binarySearch";
import { recordMergeSort } from "./algorithms/mergeSort";
import GraphCanvas from "./components/GraphCanvas";
import ArrayBars from "./components/ArrayBars";
import SearchBars from "./components/SearchBars";
import MergeBars from "./components/MergeBars";
import Pseudocode from "./components/Pseudocode";
import { sampleGraph } from "./data/sampleGraphs";
import { usePlayer } from "./hooks/usePlayer";
import "./App.css";

const sampleArray = [5, 2, 8, 1, 9, 3];

const ALGORITHMS = {
  BFS: {
    label: "BFS (Breadth-First Search)",
    kind: "graph",
    structure: "Queue",
    run: () => recordBFS(sampleGraph.adj, 0),
  },
  DFS: {
    label: "DFS (Depth-First Search)",
    kind: "graph",
    structure: "Stack",
    run: () => recordDFS(sampleGraph.adj, 0),
  },
  BUBBLE: {
    label: "Bubble Sort",
    kind: "array",
    run: (arr) => recordBubbleSort(arr),
  },
  INSERTION: {
    label: "Insertion Sort",
    kind: "array",
    run: (arr) => recordInsertionSort(arr),
  },
  MERGE: {
    label: "Merge Sort",
    kind: "merge",
    run: (arr) => recordMergeSort(arr),
  },
  BINARY: {
    label: "Binary Search",
    kind: "search",
    run: (arr, target) => recordBinarySearch(arr, target),
  },
};

const LEGENDS = {
  graph: [
    ["#cbd5e1", "Not discovered"],
    ["#fde047", "Waiting in queue/stack"],
    ["#fb923c", "Processing now"],
    ["#4ade80", "Done"],
  ],
  array: [
    ["#cbd5e1", "Unsorted"],
    ["#fde047", "Comparing"],
    ["#fb923c", "Swapped"],
    ["#4ade80", "In final place"],
  ],
  search: [
    ["#e2e8f0", "Eliminated"],
    ["#cbd5e1", "Still possible"],
    ["#fde047", "Checking the middle"],
    ["#fb923c", "Middle was not the target"],
    ["#4ade80", "Found"],
  ],
  merge: [
    ["#bfdbfe", "Left half"],
    ["#e9d5ff", "Right half"],
    ["#fde047", "Comparing the two heads"],
    ["#fb923c", "Just moved to output"],
    ["#bbf7d0", "Merged so far"],
    ["#4ade80", "Sorted block"],
  ],
};

function explainSearch(answer) {
  if (answer === "found") return "The middle value equals the target, so the search ends. ";
  if (answer === "go-right")
    return "The middle value is smaller than the target, so the target must be in the right half. ";
  return "The middle value is bigger than the target, so the target must be in the left half. ";
}

function explainMerge(answer) {
  return answer === "left"
    ? "The left value is smaller or equal, so it goes to the output first. "
    : "The right value is smaller, so it goes to the output first. ";
}

export default function App() {
  const [algo, setAlgo] = useState("BFS");
  const [customArray, setCustomArray] = useState(sampleArray);
  const [inputText, setInputText] = useState(sampleArray.join(", "));
  const [inputError, setInputError] = useState("");
  const [target, setTarget] = useState(9);
  const [targetText, setTargetText] = useState("9");

  const config = ALGORITHMS[algo];
  const kind = config.kind;
  const isArray = kind === "array";
  const isSearch = kind === "search";
  const isMerge = kind === "merge";
  const hasInput = kind !== "graph";
  const steps = useMemo(() => config.run(customArray, target), [algo, customArray, target]);

  const [speed, setSpeed] = useState(5);
  const delay = 1700 - speed * 150;
  const { index, playing, next, prev, reset, toggle } = usePlayer(steps.length, delay);
  const step = steps[index];

  const [mode, setMode] = useState("watch");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState(null);

  const nextVisitIndex = steps.findIndex((s, i) => i > index && s.type === "visit");
  const nextCompareIndex = steps.findIndex(
    (s, i) => i > index && (s.type === "compare" || s.type === "done")
  );
  const nextCheckIndex = steps.findIndex(
    (s, i) => i > index && (s.type === "check" || s.type === "found" || s.type === "notfound")
  );

  let question = false;
  if (mode === "predict" && !feedback) {
    if (isSearch) question = step.type === "check";
    else if (isArray || isMerge) question = step.type === "compare";
    else question = nextVisitIndex !== -1;
  }

  function record(ok, answer) {
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    setFeedback({ ok, answer });
  }

  function handleNodeGuess(id) {
    if (!question) return;
    const answer = steps[nextVisitIndex].node;
    record(id === answer, answer);
  }

  function handleSortGuess(guessSwap) {
    if (!question) return;
    const willSwap = steps[index + 1].type === "swap";
    record(guessSwap === willSwap, willSwap);
  }

  function handleSearchGuess(guess) {
    if (!question) return;
    const answer = steps[index + 1].type; // "found", "go-left" or "go-right"
    record(guess === answer, answer);
  }

  function handleMergeGuess(guess) {
    if (!question) return;
    const answer = steps[index + 1].side; // "left" or "right"
    record(guess === answer, answer);
  }

  function jumpTo(targetIndex) {
    for (let k = index; k < targetIndex; k++) next();
  }

  function continueAfterFeedback() {
    setFeedback(null);
    if (isSearch) jumpTo(nextCheckIndex);
    else if (isArray || isMerge) jumpTo(nextCompareIndex);
    else jumpTo(nextVisitIndex);
  }

  function resetQuiz() {
    reset();
    setScore({ correct: 0, total: 0 });
    setFeedback(null);
  }

  function changeAlgo(value) {
    setAlgo(value);
    resetQuiz();
    setMode("watch");
  }

  function startPredict() {
    resetQuiz();
    if (isArray || isSearch) next(); // these start with a "start" step followed by the first question
    if (isMerge) {
      // jump to the first comparison
      const first = steps.findIndex((s) => s.type === "compare");
      for (let k = 0; k < first; k++) next();
    }
    setMode("predict");
  }

  function startWatch() {
    resetQuiz();
    setMode("watch");
  }

  function loadInputs(nums, t) {
    setCustomArray(nums);
    setInputText(nums.join(", "));
    setTarget(t);
    setTargetText(String(t));
    setInputError("");
    resetQuiz();
    setMode("watch");
  }

  function applyInputs() {
    const parts = inputText.split(",").map((x) => x.trim()).filter((x) => x !== "");
    const nums = parts.map(Number);
    const badArray =
      nums.length < 2 ||
      nums.length > 12 ||
      nums.some((n) => !Number.isInteger(n) || n < 1 || n > 99);
    if (badArray) {
      setInputError("Enter 2 to 12 whole numbers between 1 and 99, separated by commas.");
      return;
    }
    let t = target;
    if (isSearch) {
      t = Number(targetText);
      if (targetText.trim() === "" || !Number.isInteger(t) || t < 1 || t > 99) {
        setInputError("Target must be a whole number between 1 and 99.");
        return;
      }
    }
    loadInputs(nums, t);
  }

  function randomInputs() {
    const nums = Array.from({ length: 8 }, () => 1 + Math.floor(Math.random() * 30));
    const t =
      Math.random() < 0.5
        ? nums[Math.floor(Math.random() * nums.length)]
        : 1 + Math.floor(Math.random() * 30);
    loadInputs(nums, t);
  }

  return (
    <div className="page">
      <div className="header">
        <h1>Algorithm Visualizer</h1>
        <p>Watch an algorithm run step by step, or test yourself by predicting its next move.</p>
      </div>

      <div className="toolbar">
        <select value={algo} onChange={(e) => changeAlgo(e.target.value)}>
          {Object.entries(ALGORITHMS).map(([key, a]) => (
            <option key={key} value={key}>{a.label}</option>
          ))}
        </select>
        <button className={mode === "watch" ? "active" : ""} onClick={startWatch}>
          Watch
        </button>
        <button className={mode === "predict" ? "active" : ""} onClick={startPredict}>
          Predict the Next Step
        </button>
      </div>

      {hasInput && (
        <div className="toolbar">
          <input
            className="array-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyInputs()}
            placeholder="e.g. 5, 2, 8, 1, 9"
          />
          {isSearch && (
            <label className="target-label">
              Target
              <input
                className="target-input"
                value={targetText}
                onChange={(e) => setTargetText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyInputs()}
              />
            </label>
          )}
          <button onClick={applyInputs}>Apply</button>
          <button onClick={randomInputs}>Random</button>
          {inputError && <span className="input-error">{inputError}</span>}
        </div>
      )}

      <div className="card">
        {isSearch ? (
          <SearchBars step={step} />
        ) : isMerge ? (
          <MergeBars step={step} />
        ) : isArray ? (
          <ArrayBars step={step} />
        ) : (
          <GraphCanvas
            graph={sampleGraph}
            step={step}
            onNodeClick={mode === "predict" ? handleNodeGuess : undefined}
          />
        )}

        <div className="legend">
          {LEGENDS[kind].map(([color, text]) => (
            <span key={text}>
              <i className="dot" style={{ background: color }} />
              {text}
            </span>
          ))}
        </div>

        {mode === "watch" && (
          <div className="controls">
            <button onClick={prev} disabled={index === 0}>Prev</button>
            <button className="primary" onClick={toggle}>{playing ? "Pause" : "Play"}</button>
            <button onClick={next} disabled={index === steps.length - 1}>Next</button>
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
            <span className="step-count">Step {index + 1} / {steps.length}</span>
          </div>
        )}
      </div>

      {mode === "predict" && (
        <div className="card">
          <h3>Quiz</h3>

          {question && kind === "graph" && (
            <p className="quiz-question">Click the node {algo} will process next.</p>
          )}

          {question && isArray && (
            <>
              <p className="quiz-question">
                Bars at positions {step.i} and {step.j} are being compared. Will they be swapped?
              </p>
              <div className="quiz-actions">
                <button className="primary" onClick={() => handleSortGuess(true)}>Swap</button>
                <button onClick={() => handleSortGuess(false)}>Don't swap</button>
              </div>
            </>
          )}

          {question && isSearch && (
            <>
              <p className="quiz-question">
                The middle value is {step.array[step.mid]} and the target is {step.target}. What happens next?
              </p>
              <div className="quiz-actions">
                <button onClick={() => handleSearchGuess("go-left")}>Go left</button>
                <button className="primary" onClick={() => handleSearchGuess("found")}>Found it</button>
                <button onClick={() => handleSearchGuess("go-right")}>Go right</button>
              </div>
            </>
          )}

          {question && isMerge && (
            <>
              <p className="quiz-question">
                Left head is {step.array[step.i]} and right head is {step.array[step.j]}. Which one goes
                into the merged output next?
              </p>
              <div className="quiz-actions">
                <button className="primary" onClick={() => handleMergeGuess("left")}>Left ({step.array[step.i]})</button>
                <button className="primary" onClick={() => handleMergeGuess("right")}>Right ({step.array[step.j]})</button>
              </div>
            </>
          )}

          {feedback && (
            <div className={`feedback ${feedback.ok ? "ok" : "bad"}`}>
              {feedback.ok ? "Correct! " : "Not quite. "}
              {isSearch
                ? explainSearch(feedback.answer)
                : isMerge
                ? explainMerge(feedback.answer)
                : isArray
                ? feedback.answer
                  ? "They get swapped because the left bar is bigger. "
                  : "They stay, because they are already in order. "
                : !feedback.ok && `The answer was node ${feedback.answer}. `}
              <button onClick={continueAfterFeedback}>Continue</button>
            </div>
          )}

          {!question && !feedback && (
            <p className="quiz-question">Finished! Final score: {score.correct} / {score.total}</p>
          )}

          <p className="score">Score: {score.correct} / {score.total}</p>
        </div>
      )}

      <Pseudocode algo={algo} step={step} />

      <div className="card">
        <h3>Current state</h3>
        {isSearch ? (
          <>
            <p className="state-row">Action: {step.type}</p>
            <p className="state-row">Target: {step.target}</p>
            <p className="state-row">
              Search range:{" "}
              {step.low <= step.high ? `positions ${step.low} to ${step.high}` : "empty"}
            </p>
            <p className="state-row">
              Middle: {step.mid >= 0 ? `position ${step.mid} (value ${step.array[step.mid]})` : "-"}
            </p>
            <p className="state-row">Sorted array: [{step.array.join(", ")}]</p>
          </>
        ) : isMerge ? (
          <>
            <p className="state-row">Action: {step.type}</p>
            <p className="state-row">
              Working on: {step.lo >= 0 ? `positions ${step.lo} to ${step.hi}` : "-"}
            </p>
            <p className="state-row">Array: [{step.array.join(", ")}]</p>
          </>
        ) : isArray ? (
          <>
            <p className="state-row">
              Action: {step.type}
              {step.i >= 0 ? ` (positions ${step.i} and ${step.j})` : ""}
            </p>
            <p className="state-row">Array: [{step.array.join(", ")}]</p>
          </>
        ) : (
          <>
            <p className="state-row">{config.structure}: [{step.queue.join(", ")}]</p>
            <p className="state-row">Visited: [{step.visited.join(", ")}]</p>
          </>
        )}
      </div>
    </div>
  );
}