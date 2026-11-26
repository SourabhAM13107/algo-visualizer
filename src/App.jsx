import { useMemo, useState } from "react";
import { recordBFS } from "./algorithms/bfs";
import GraphCanvas from "./components/GraphCanvas";
import { sampleGraph } from "./data/sampleGraphs";
import { usePlayer } from "./hooks/usePlayer";

export default function App() {
  const steps = useMemo(() => recordBFS(sampleGraph.adj, 0), []);
  const [speed, setSpeed] = useState(5);
  const delay = 1700 - speed * 150;
  const { index, playing, next, prev, reset, toggle } = usePlayer(steps.length, delay);
  const step = steps[index];

  // quiz state
  const [mode, setMode] = useState("watch"); // "watch" or "predict"
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState(null); // { ok: true/false, answer }

  // A question exists at every "visit" step's predecessor: the next "visit" step.
  // We ask "who gets processed next?" while sitting on any step that is followed
  // by a visit somewhere later.
  const nextVisitIndex = steps.findIndex((s, i) => i > index && s.type === "visit");
  const question = mode === "predict" && nextVisitIndex !== -1 && !feedback;

  function handleGuess(id) {
    if (!question) return;
    const answer = steps[nextVisitIndex].node;
    const ok = id === answer;
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    setFeedback({ ok, answer });
  }

  function continueAfterFeedback() {
    setFeedback(null);
    setIndex_(nextVisitIndex);
  }

  // jump helper: step forward until we reach a given index
  function setIndex_(target) {
    for (let k = index; k < target; k++) next();
  }

  function startPredict() {
    reset();
    setScore({ correct: 0, total: 0 });
    setFeedback(null);
    setMode("predict");
  }

  function startWatch() {
    reset();
    setFeedback(null);
    setMode("watch");
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>BFS Visualizer</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={startWatch} disabled={mode === "watch"}>Watch</button>{" "}
        <button onClick={startPredict} disabled={mode === "predict"}>Predict the Next Step</button>
      </div>

      <GraphCanvas
        graph={sampleGraph}
        step={step}
        onNodeClick={mode === "predict" ? handleGuess : undefined}
      />

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
          {question && <p><b>Click the node BFS will process next.</b></p>}

          {feedback && (
            <p style={{ color: feedback.ok ? "green" : "crimson" }}>
              {feedback.ok ? "Correct!" : `Not quite. The answer was node ${feedback.answer}.`}{" "}
              <button onClick={continueAfterFeedback}>Continue</button>
            </p>
          )}

          {!question && !feedback && (
            <p><b>Finished!</b> Score: {score.correct} / {score.total}</p>
          )}

          <p>Score: {score.correct} / {score.total}</p>
        </div>
      )}

      <p><b>Queue:</b> [{step.queue.join(", ")}]</p>
      <p><b>Discovered:</b> [{step.visited.join(", ")}]</p>
    </div>
  );
}