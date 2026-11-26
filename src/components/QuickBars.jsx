const COLORS = {
  idle: "#cbd5e1",
  unscanned: "#e5e7eb",
  pivot: "#a78bfa",
  small: "#bfdbfe",
  large: "#fecaca",
  compare: "#fde047",
  move: "#fb923c",
  sorted: "#4ade80",
};

const ACTIVE = ["pivot", "compare", "swap", "place"];

function barColor(index, step) {
  if (!ACTIVE.includes(step.type)) return step.sorted[index] ? COLORS.sorted : COLORS.idle;

  const inRange = index >= step.lo && index <= step.hi;
  if (!inRange) return step.sorted[index] ? COLORS.sorted : COLORS.idle;

  if (step.type === "place") {
    if (index === step.i) return COLORS.sorted;
    if (index === step.j) return COLORS.move;
    return index < step.i ? COLORS.small : COLORS.large;
  }

  if (index === step.hi) return COLORS.pivot;
  if (step.type === "swap" && (index === step.i || index === step.j)) return COLORS.move;
  if (step.type === "compare" && index === step.j) return COLORS.compare;
  if (index <= step.i) return COLORS.small;
  if (index < step.j) return COLORS.large;
  return COLORS.unscanned;
}

function marks(index, step) {
  if (!ACTIVE.includes(step.type) || step.type === "place") return "";
  const list = [];
  if (index === step.hi) list.push("P");
  if (index === step.i && step.i >= step.lo) list.push("i");
  if (index === step.j && step.j < step.hi) list.push("j");
  return list.join(" ");
}

export default function QuickBars({ step, height = 220 }) {
  const max = Math.max(...step.array);
  return (
    <div style={{ width: "100%", maxWidth: 620 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height }}>
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
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        {step.array.map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 13,
              fontWeight: 600,
              color: "#475569",
              minHeight: 18,
            }}
          >
            {marks(index, step)}
          </div>
        ))}
      </div>
    </div>
  );
}