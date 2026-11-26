const COLORS = {
  out: "#e2e8f0",   // eliminated
  range: "#cbd5e1", // still possible
  check: "#fde047", // middle being checked
  wrong: "#fb923c", // middle was not the target
  found: "#4ade80",
};

function barColor(index, step) {
  const active = step.low <= step.high;
  const inRange = active && index >= step.low && index <= step.high;
  if (index === step.mid) {
    if (step.type === "found") return COLORS.found;
    if (step.type === "check") return COLORS.check;
    if (step.type === "go-left" || step.type === "go-right") return COLORS.wrong;
  }
  return inRange ? COLORS.range : COLORS.out;
}

function marks(index, step) {
  const active = step.low <= step.high;
  const list = [];
  if (active && index === step.low) list.push("L");
  if (index === step.mid) list.push("M");
  if (active && index === step.high) list.push("H");
  return list.join(" ");
}

export default function SearchBars({ step, height = 220 }) {
  const max = Math.max(...step.array);
  return (
    <div style={{ width: 620 }}>
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