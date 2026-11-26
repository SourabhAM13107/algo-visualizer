import { useEffect, useRef } from "react";

const FILL = { idle: "#cbd5e1", queued: "#fde047", current: "#fb923c", done: "#4ade80" };
const RING = { idle: "#94a3b8", queued: "#ca8a04", current: "#c2410c", done: "#15803d" };
const FONT = '"Inter", system-ui, -apple-system, sans-serif';
const R = 22;

function stateOf(id, step) {
  const current = step.type === "enqueue" ? step.from : step.node;
  if (id === current) return "current";
  if (step.queue.includes(id)) return "queued";
  if (step.visited.includes(id)) return "done";
  return "idle";
}

export default function GraphCanvas({ graph, step, onNodeClick, width = 620, height = 220 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";

    // edges
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#94a3b8";
    for (const [a, list] of Object.entries(graph.adj)) {
      for (const b of list) {
        if (Number(a) < b) {
          const p = graph.nodes[Number(a)];
          const q = graph.nodes[b];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // the edge used to discover a new node
    if (step.type === "enqueue") {
      const p = graph.nodes[step.from];
      const q = graph.nodes[step.node];
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }

    // nodes
    for (const n of graph.nodes) {
      const s = stateOf(n.id, step);

      if (s === "current") {
        ctx.beginPath();
        ctx.arc(n.x, n.y, R + 9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(251, 146, 60, 0.25)";
        ctx.fill();
      }

      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.28)";
      ctx.shadowBlur = 10 * dpr;
      ctx.shadowOffsetY = 3 * dpr;
      ctx.beginPath();
      ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
      ctx.fillStyle = FILL[s];
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = RING[s];
      ctx.stroke();

      ctx.fillStyle = "#0f172a";
      ctx.font = `700 16px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(n.id), n.x, n.y + 0.5);
    }
  }, [graph, step, width, height]);

  function handleClick(e) {
    if (!onNodeClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (width / rect.width);
    const y = (e.clientY - rect.top) * (height / rect.height);
    for (const n of graph.nodes) {
      if (Math.hypot(n.x - x, n.y - y) <= R) {
        onNodeClick(n.id);
        return;
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{
        width: "100%",
        maxWidth: width,
        height: "auto",
        cursor: onNodeClick ? "pointer" : "default",
      }}
    />
  );
}