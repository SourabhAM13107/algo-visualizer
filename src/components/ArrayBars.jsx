import BarRow from "./BarRow";

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

export default function ArrayBars({ step }) {
  const colors = step.array.map((_, i) => barColor(i, step));
  return <BarRow values={step.array} colors={colors} />;
}