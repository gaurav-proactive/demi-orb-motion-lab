export const SPEED_OPTIONS = [0.6, 1, 1.4];

export function MotionSpeedControl({ value, onChange, label }) {
  return (
    <div className="motion-speed-control" role="group" aria-label={`${label} speed`}>
      <span>Speed</span>
      <div>
        {SPEED_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={value === option ? "active" : ""}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}×
          </button>
        ))}
      </div>
    </div>
  );
}

export function downloadMotionJson(filename, data) {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
