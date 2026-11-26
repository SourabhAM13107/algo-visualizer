import { useEffect, useRef } from "react";

const FILL = { idle: "#cbd5e1", tentative: "#fde047", current: "#fb923c", done: "#4ade80" };
const RING = { idle: "#94a3b8", tentative: "#ca8a04", current: "#c2410c", done: "#15803d" };
const FONT = '"Inter", system-ui, -apple-system, sans-serif';
const R = 22;

function stateOf(id, step) {
  if (id === step.current) return "current";
  if (step.done[id]) return "done";
  if (step.dist[id] !== Infinity) return "tentative";
  return "idle";
}

function pill(ctx, text, x, y, { bg = "#ffffff", fg = "#0f172a", border = "#cbd5e1", size = 13 } = {}) {
  ctx.font = `600 ${size}px ${FONT}`;
  const w = ctx.measureText(text).width + 14;
  const h = size + 8;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
  else ctx.rect(x - w / 2, y - h / 2, w, h);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 0.5);
}

export default function WeightedGraphCanvas({ graph, step, onNodeClick, width = 620, height = 220 }) {
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
    for (const [a, b] of graph.edges) {
      const p = graph.nodes[a];
      const q = graph.nodes[b];
      const inTree = (step.prev[b] === a && step.done[b]) || (step.prev[a] === b && step.done[a]);
      const examined =
        step.to >= 0 &&
        ((a === step.from && b === step.to) || (a === step.to && b === step.from));

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      if (examined) {
        ctx.lineWidth = 4.5;
        ctx.strokeStyle = "#ef4444";
      } else if (inTree) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#16a34a";
      } else {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#94a3b8";
      }
      ctx.stroke();
    }

    // weight labels
    for (const [a, b, w] of graph.edges) {
      const p = graph.nodes[a];
      const q = graph.nodes[b];
      pill(ctx, String(w), (p.x + q.x) / 2, (p.y + q.y) / 2, { size: 13 });
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

    // red ring on the node whose distance is being checked
    if (step.to >= 0) {
      const t = graph.nodes[step.to];
      ctx.beginPath();
      ctx.arc(t.x, t.y, R + 6, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ef4444";
      ctx.stroke();
    }

    // distance labels (above the top nodes, below the others)
    for (const n of graph.nodes) {
      const d = step.dist[n.id];
      const above = n.y < 100;
      pill(ctx, `d = ${d === Infinity ? "∞" : d}`, n.x, above ? n.y - 40 : n.y + 40, {
        bg: step.done[n.id] ? "#dcfce7" : "#ffffff",
        border: step.done[n.id] ? "#86efac" : "#cbd5e1",
        size: 12,
      });
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