const COLORS = {
  idle: "#cbd5e1",
  left: "#bfdbfe",
  right: "#e9d5ff",
  compare: "#fde047",
  place: "#fb923c",
  merged: "#bbf7d0",
  sorted: "#4ade80",
};

function barColor(index, step) {
  const active = step.type === "split" || step.type === "compare" || step.type === "place" || step.type === "copy";
  const inRange = active && index >= step.lo && index <= step.hi;

  if (step.type === "compare" && (index === step.i || index === step.j)) return COLORS.compare;
  if ((step.type === "place" || step.type === "copy") && index === step.pos) return COLORS.place;

  if (inRange) {
    if (index < step.leftStart) return COLORS.merged;
    if (index <= step.leftEnd) return COLORS.left;
    return COLORS.right;
  }
  return step.sorted[index] ? COLORS.sorted : COLORS.idle;
}

export default function MergeBars({ step, height = 220 }) {
  const max = Math.max(...step.array);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height, width: "100%", maxWidth: 620 }}>
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