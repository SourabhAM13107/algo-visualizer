import BarRow from "./BarRow";

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

function mark(index, step) {
  if (!ACTIVE.includes(step.type) || step.type === "place") return "";
  const list = [];
  if (index === step.hi) list.push("P");
  if (index === step.i && step.i >= step.lo) list.push("i");
  if (index === step.j && step.j < step.hi) list.push("j");
  return list.join(" ");
}

export default function QuickBars({ step }) {
  const colors = step.array.map((_, i) => barColor(i, step));
  const marks = step.array.map((_, i) => mark(i, step));
  return <BarRow values={step.array} colors={colors} marks={marks} />;
}