import { useMemo, useState } from "react";
import { recordBFS } from "./algorithms/bfs";
import { recordDFS } from "./algorithms/dfs";
import { recordBubbleSort } from "./algorithms/bubbleSort";
import GraphCanvas from "./components/GraphCanvas";
import ArrayBars from "./components/ArrayBars";
import { sampleGraph } from "./data/sampleGraphs";
import { usePlayer } from "./hooks/usePlayer";

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
    run: () => recordBubbleSort(sampleArray),
  },
};

export default function App() {
  const [algo, setAlgo] = useState("BFS");
  const config = ALGORITHMS[algo];
  const isArray = config.kind === "array";
  const steps = useMemo(() => config.run(), [algo]);

  const [speed, setSpeed] = useState(5);
  const delay = 1700 - speed * 150;
  const { index, playing, next, prev, reset, toggle } = usePlayer(steps.length, delay);
  const step = steps[index];

  const [mode, setMode] = useState("watch");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState(null);

  // graph quiz: the next node that will be processed
  const nextVisitIndex = steps.findIndex((s, i) => i > index && s.type === "visit");
  // sorting quiz: the next comparison (or the end)
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
    if (isArray) next(); // move from the "start" step to the first comparison
    setMode("predict");
  }

  function startWatch() {
    resetQuiz();
    setMode("watch");
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>Algorithm Visualizer</h2>

      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <select value={algo} onChange={(e) => changeAlgo(e.target.value)}>
          {Object.entries(ALGORITHMS).map(([key, a]) => (
            <option key={key} value={key}>{a.label}</option>
          ))}
        </select>
        <button onClick={startWatch} disabled={mode === "watch"}>Watch</button>
        <button onClick={startPredict} disabled={mode === "predict"}>Predict the Next Step</button>
      </div>

      {isArray ? (
        <ArrayBars step={step} />
      ) : (
        <GraphCanvas
          graph={sampleGraph}
          step={step}
          onNodeClick={mode === "predict" ? handleNodeGuess : undefined}
        />
      )}

      {mode === "watch" && (
        <div style={{ margin: "12px 0", display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={prev} disabled={index === 0}>Prev</button>
          <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
          <button onClick={next} disabled={index === steps.length - 1}>Next</button>
          <button onClick={reset}>Reset</button>
          <label style={{ marginLeft: 16 }}>
            Speed{" "}
            <input type="range" min="1" max="10" value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))} />
          </label>
          <span style={{ marginLeft: 16 }}>Step {index + 1} / {steps.length}</span>
        </div>
      )}

      {mode === "predict" && (
        <div style={{ margin: "12px 0" }}>
          {question && !isArray && <p><b>Click the node {algo} will process next.</b></p>}

          {question && isArray && (
            <p>
              <b>Bars at positions {step.i} and {step.j} are being compared. Will they be swapped?</b>{" "}
              <button onClick={() => handleSortGuess(true)}>Swap</button>{" "}
              <button onClick={() => handleSortGuess(false)}>Don't swap</button>
            </p>
          )}

          {feedback && (
            <p style={{ color: feedback.ok ? "green" : "crimson" }}>
              {feedback.ok ? "Correct!" : "Not quite."}{" "}
              {isArray
                ? feedback.answer
                  ? "They get swapped because the left bar is bigger."
                  : "They stay, because they are already in order."
                : !feedback.ok && `The answer was node ${feedback.answer}.`}{" "}
              <button onClick={continueAfterFeedback}>Continue</button>
            </p>
          )}

          {!question && !feedback && (
            <p><b>Finished!</b> Final score: {score.correct} / {score.total}</p>
          )}

          <p>Score: {score.correct} / {score.total}</p>
        </div>
      )}

      {isArray ? (
        <>
          <p><b>Action:</b> {step.type}{step.i >= 0 ? ` (positions ${step.i} and ${step.j})` : ""}</p>
          <p><b>Array:</b> [{step.array.join(", ")}]</p>
        </>
      ) : (
        <>
          <p><b>{config.structure}:</b> [{step.queue.join(", ")}]</p>
          <p><b>Visited:</b> [{step.visited.join(", ")}]</p>
        </>
      )}
    </div>
  );
}