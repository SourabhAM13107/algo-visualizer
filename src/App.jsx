import { useMemo, useState } from "react";
import { recordBFS } from "./algorithms/bfs";
import GraphCanvas from "./components/GraphCanvas";
import { sampleGraph } from "./data/sampleGraphs";
import { usePlayer } from "./hooks/usePlayer";

export default function App() {
  const steps = useMemo(() => recordBFS(sampleGraph.adj, 0), []);
  const [speed, setSpeed] = useState(5); // 1 (slow) to 10 (fast)
  const delay = 1700 - speed * 150; // speed 1 = 1550ms, speed 10 = 200ms

  const { index, playing, next, prev, reset, toggle } = usePlayer(steps.length, delay);
  const step = steps[index];

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>BFS Visualizer</h2>

      <GraphCanvas graph={sampleGraph} step={step} />

      <div style={{ margin: "12px 0", display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={prev} disabled={index === 0}>Prev</button>
        <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        <button onClick={next} disabled={index === steps.length - 1}>Next</button>
        <button onClick={reset}>Reset</button>

        <label style={{ marginLeft: 16 }}>
          Speed{" "}
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>

        <span style={{ marginLeft: 16 }}>
          Step {index + 1} / {steps.length}
        </span>
      </div>

      <p><b>Action:</b> {step.type} (node {step.node})</p>
      <p><b>Queue:</b> [{step.queue.join(", ")}]</p>
      <p><b>Discovered:</b> [{step.visited.join(", ")}]</p>
    </div>
  );
}