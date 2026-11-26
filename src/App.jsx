import { useMemo, useState } from "react";
import { recordBFS } from "./algorithms/bfs";
import { recordDFS } from "./algorithms/dfs";
import { recordBubbleSort } from "./algorithms/bubbleSort";
import { recordInsertionSort } from "./algorithms/insertionSort";
import GraphCanvas from "./components/GraphCanvas";
import ArrayBars from "./components/ArrayBars";
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
};

export default function App() {
  const [algo, setAlgo] = useState("BFS");
  const [customArray, setCustomArray] = useState(sampleArray);
  const [inputText, setInputText] = useState(sampleArray.join(", "));
  const [inputError, setInputError] = useState("");

  const config = ALGORITHMS[algo];
  const isArray = config.kind === "array";
  const steps = useMemo(() => config.run(customArray), [algo, customArray]);

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

  const question =
    mode === "predict" &&
    !feedback &&
    (isArray ? step.type === "compare" : nextVisitIndex !== -1);

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

  function jumpTo(target) {
    for (let k = index; k < target; k++) next();
  }

  function continueAfterFeedback() {
    setFeedback(null);
    jumpTo(isArray ? nextCompareIndex : nextVisitIndex);
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
    if (isArray) next();
    setMode("predict");
  }

  function startWatch() {
    resetQuiz();
    setMode("watch");
  }

  function loadArray(nums) {
    setCustomArray(nums);
    setInputText(nums.join(", "));
    setInputError("");
    resetQuiz();
    setMode("watch");
  }

  function applyArray() {
    const parts = inputText.split(",").map((t) => t.trim()).filter((t) => t !== "");
    const nums = parts.map(Number);
    const bad =
      nums.length < 2 ||
      nums.length > 12 ||
      nums.some((n) => !Number.isInteger(n) || n < 1 || n > 99);
    if (bad) {
      setInputError("Enter 2 to 12 whole numbers between 1 and 99, separated by commas.");
      return;
    }
    loadArray(nums);
  }

  function randomArray() {
    loadArray(Array.from({ length: 8 }, () => 1 + Math.floor(Math.random() * 30)));
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

      {isArray && (
        <div className="toolbar">
          <input
            className="array-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyArray()}
            placeholder="e.g. 5, 2, 8, 1, 9"
          />
          <button onClick={applyArray}>Apply array</button>
          <button onClick={randomArray}>Random</button>
          {inputError && <span className="input-error">{inputError}</span>}
        </div>
      )}

      <div className="card">
        {isArray ? (
          <ArrayBars step={step} />
        ) : (
          <GraphCanvas
            graph={sampleGraph}
            step={step}
            onNodeClick={mode === "predict" ? handleNodeGuess : undefined}
          />
        )}

        <div className="legend">
          {LEGENDS[config.kind].map(([color, text]) => (
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

          {question && !isArray && (
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

          {feedback && (
            <div className={`feedback ${feedback.ok ? "ok" : "bad"}`}>
              {feedback.ok ? "Correct! " : "Not quite. "}
              {isArray
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
        {isArray ? (
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