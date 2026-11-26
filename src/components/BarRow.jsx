export default function BarRow({ values, colors, marks, height = 240 }) {
  const max = Math.max(...values);
  const compact = values.length > 14;

  return (
    <div className={compact ? "bars compact" : "bars"}>
      <div className="bars-row" style={{ height }}>
        {values.map((value, i) => (
          <div key={i} className="bar-col">
            <div
              className="bar"
              style={{
                height: `${Math.max((value / max) * 100, 12)}%`,
                background: colors[i],
              }}
            >
              {compact ? "" : value}
            </div>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="bars-index">
          {values.map((_, i) => (
            <div key={i}>{i}</div>
          ))}
        </div>
      )}

      {marks && (
        <div className="bars-marks">
          {marks.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      )}
    </div>
  );
}