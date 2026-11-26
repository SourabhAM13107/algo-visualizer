import { PSEUDOCODE } from "../data/pseudocode";

export default function Pseudocode({ algo, step }) {
  const code = PSEUDOCODE[algo];
  if (!code) return null;
  const active = code.highlight[step.type] || [];

  return (
    <div className="card">
      <h3>Pseudocode</h3>
      <div className="code">
        {code.lines.map((line, i) => (
          <div key={i} className={active.includes(i) ? "code-line active" : "code-line"}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}