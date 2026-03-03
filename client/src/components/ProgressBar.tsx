import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="w-full" data-testid="progress-bar">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40 font-medium">
          {current + 1} / {total}
        </span>
        <span className="text-xs text-white/30">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
