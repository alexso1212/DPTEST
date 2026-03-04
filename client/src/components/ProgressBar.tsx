import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="w-full" data-testid="progress-bar">
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(var(--accent-blue-rgb), 0.1)' }}>
        <motion.div
          className="h-full rounded-full gpu-accelerate"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{
            background: `linear-gradient(90deg, var(--accent-blue), var(--accent-gold))`,
          }}
        />
      </div>
    </div>
  );
}
