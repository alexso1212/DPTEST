interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="w-full" data-testid="progress-bar">
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(var(--accent-blue-rgb), 0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out gpu-accelerate"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, var(--accent-blue), var(--accent-gold))`,
          }}
        />
      </div>
    </div>
  );
}
