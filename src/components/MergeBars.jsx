import BarRow from "./BarRow";

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
  const active =
    step.type === "split" || step.type === "compare" || step.type === "place" || step.type === "copy";
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

export default function MergeBars({ step }) {
  const colors = step.array.map((_, i) => barColor(i, step));
  return <BarRow values={step.array} colors={colors} />;
}