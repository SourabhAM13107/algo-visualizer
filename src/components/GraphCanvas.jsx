import { useEffect, useRef } from "react";

const COLORS = {
  idle: "#cbd5e1",    // not discovered yet
  queued: "#fde047",  // discovered, waiting in queue
  current: "#fb923c", // being processed right now
  done: "#4ade80",    // fully processed
};

function currentNode(step) {
  if (step.type === "enqueue") return step.from;
  return step.node; // "start" and "visit"
}

function colorOf(id, step) {
  if (id === currentNode(step)) return COLORS.current;
  if (step.queue.includes(id)) return COLORS.queued;
  if (step.visited.includes(id)) return COLORS.done;
  return COLORS.idle;
}

export default function GraphCanvas({ graph, step, onNodeClick, width = 620, height = 220 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    // 1. edges
    ctx.lineWidth = 2;
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

    // 2. highlight the edge being used when a node is enqueued
    if (step.type === "enqueue") {
      const p = graph.nodes[step.from];
      const q = graph.nodes[step.node];
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }

    // 3. nodes
    for (const n of graph.nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = colorOf(n.id, step);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#1e293b";
      ctx.stroke();

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.id, n.x, n.y);
    }
  }, [graph, step, width, height]);

    function handleClick(e) {
    if (!onNodeClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (const n of graph.nodes) {
      if (Math.hypot(n.x - x, n.y - y) <= 22) {
        onNodeClick(n.id);
        return;
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleClick}
      style={{ cursor: onNodeClick ? "pointer" : "default" }}
    />
  );

  // return <canvas ref={canvasRef} width={width} height={height} />;
}