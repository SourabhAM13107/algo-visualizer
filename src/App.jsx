import { useMemo, useState } from "react";
import { recordBFS } from "./algorithms/bfs";
import GraphCanvas from "./components/GraphCanvas";
import { sampleGraph } from "./data/sampleGraphs";

export default function App() {
  const steps = useMemo(() => recordBFS(sampleGraph.adj, 0), []);
  const [i, setI] = useState(0);
  const step = steps[i];

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>BFS Visualizer</h2>

      <GraphCanvas graph={sampleGraph} step={step} />

      <div style={{ margin: "12px 0" }}>
        <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          Prev
        </button>{" "}
        <button
          onClick={() => setI(Math.min(steps.length - 1, i + 1))}
          disabled={i === steps.length - 1}
        >
          Next
        </button>{" "}
        <button onClick={() => setI(0)}>Reset</button>
        <span style={{ marginLeft: 12 }}>
          Step {i + 1} / {steps.length}
        </span>
      </div>

      <p><b>Action:</b> {step.type} (node {step.node})</p>
      <p><b>Queue:</b> [{step.queue.join(", ")}]</p>
      <p><b>Discovered:</b> [{step.visited.join(", ")}]</p>
    </div>
  );
}