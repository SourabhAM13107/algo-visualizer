import { COMPLEXITY } from "../data/complexity";

export default function Complexity({ algo }) {
  const c = COMPLEXITY[algo];
  if (!c) return null;

  return (
    <div className="card">
      <h3>Complexity</h3>
      <table className="complexity-table">
        <thead>
          <tr>
            <th>Best</th>
            <th>Average</th>
            <th>Worst</th>
            <th>Space</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{c.best}</td>
            <td>{c.average}</td>
            <td>{c.worst}</td>
            <td>{c.space}</td>
          </tr>
        </tbody>
      </table>
      <p className="complexity-note">{c.note}</p>
    </div>
  );
}