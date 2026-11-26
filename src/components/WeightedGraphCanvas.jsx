import { useEffect, useRef } from "react";

const COLORS = {
  idle: "#cbd5e1",      // distance still unknown (infinity)
  tentative: "#fde047", // has a distance, not finished
  current: "#fb923c",   // being processed now
  done: "#4ade80",      // distance is final
};

function colorOf(id, step) {
  if (id === step.current) return COLORS.current;
  if (step.done[id]) return COLORS.done;
  if (step.dist[id] !== Infinity) return COLORS.tentative;
  return COLORS.idle;
}

function drawLabel(ctx, text, x, y, size = 14) {
  ctx.font = `bold ${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#ffffff";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = "#1e293b";
  ctx.fillText(text, x, y);
}

export default function WeightedGraphCanvas({ graph, step, onNodeClick, width = 620, height = 220 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    // 1. edges
    for (const [a, b, w] of graph.edges) {
      const p = graph.nodes[a];
      const q = graph.nodes[b];
      const inTree =
        (step.prev[b] === a && step.done[b]) || (step.prev[a] === b && step.done[a]);
      const examined =
        step.to >= 0 &&
        ((a === step.from && b === step.to) || (a === step.to && b === step.from));

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      if (examined) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ef4444";
      } else if (inTree) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#16a34a";
      } else {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#94a3b8";
      }
      ctx.stroke();
    }

    // 2. weight labels
    for (const [a, b, w] of graph.edges) {
      const p = graph.nodes[a];
      const q = graph.nodes[b];
      drawLabel(ctx, String(w), (p.x + q.x) / 2, (p.y + q.y) / 2, 14);
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

    // 4. red ring around the node whose distance is being checked
    if (step.to >= 0) {
      const t = graph.nodes[step.to];
      ctx.beginPath();
      ctx.arc(t.x, t.y, 28, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ef4444";
      ctx.stroke();
    }

    // 5. distance under each node
    for (const n of graph.nodes) {
      const d = step.dist[n.id];
      drawLabel(ctx, `d=${d === Infinity ? "∞" : d}`, n.x, n.y + 38, 13);
    }
  }, [graph, step, width, height]);

  function handleClick(e) {
    if (!onNodeClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
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
      style={{ cursor: onNodeClick ? "pointer" : "default", maxWidth: "100%", height: "auto" }}
    />
  );
}