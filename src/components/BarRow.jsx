export default function BarRow({ values, colors, marks, height = 240 }) {
  const max = Math.max(...values);

  return (
    <div className="bars">
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
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="bars-index">
        {values.map((_, i) => (
          <div key={i}>{i}</div>
        ))}
      </div>

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