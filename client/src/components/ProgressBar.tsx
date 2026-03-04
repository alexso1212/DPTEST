import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="w-full" data-testid="progress-bar">
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
        <motion.div
          className="h-full rounded-full gpu-accelerate"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: 'var(--primary)',
          }}
        />
      </div>
    </div>
  );
}
