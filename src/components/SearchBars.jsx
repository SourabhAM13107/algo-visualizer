import BarRow from "./BarRow";

const COLORS = {
  out: "#e2e8f0",
  range: "#cbd5e1",
  check: "#fde047",
  wrong: "#fb923c",
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

function mark(index, step) {
  const active = step.low <= step.high;
  const list = [];
  if (active && index === step.low) list.push("L");
  if (index === step.mid) list.push("M");
  if (active && index === step.high) list.push("H");
  return list.join(" ");
}

export default function SearchBars({ step }) {
  const colors = step.array.map((_, i) => barColor(i, step));
  const marks = step.array.map((_, i) => mark(i, step));
  return <BarRow values={step.array} colors={colors} marks={marks} />;
}