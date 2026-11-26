const COLORS = {
  idle: "#cbd5e1",
  compare: "#fde047",
  swap: "#fb923c",
  sorted: "#4ade80",
};

function barColor(index, step) {
  const n = step.array.length;
  if (index >= n - step.sortedCount) return COLORS.sorted;
  if (step.type === "swap" && (index === step.i || index === step.j)) return COLORS.swap;
  if (step.type === "compare" && (index === step.i || index === step.j)) return COLORS.compare;
  return COLORS.idle;
}

export default function ArrayBars({ step, height = 220 }) {
  const max = Math.max(...step.array);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height, width: 620 }}>
      {step.array.map((value, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            height: `${(value / max) * 100}%`,
            background: barColor(index, step),
            border: "2px solid #1e293b",
            borderRadius: 4,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontWeight: "bold",
            paddingBottom: 4,
            transition: "background 0.2s",
          }}
        >
          {value}
        </div>
      ))}
    </div>
  );
}