import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Settings } from "lucide-react";

interface LoadingPageProps {
  onDone: () => void;
}

const analysisSteps = [
  "风险偏好分析完成",
  "交易心理评估完成",
  "系统化程度检测完成",
  "生成能力报告中...",
];

export default function LoadingPage({ onDone }: LoadingPageProps) {
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const stepInterval = 600;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < analysisSteps.length; i++) {
      timers.push(
        setTimeout(() => setCompletedSteps(i + 1), stepInterval * (i + 1))
      );
    }

    timers.push(
      setTimeout(() => onDone(), stepInterval * analysisSteps.length + 500)
    );

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className="h-full w-full animate-scan gpu-accelerate"
          style={{ background: `linear-gradient(90deg, transparent, var(--accent-blue), transparent)` }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <Settings className="w-16 h-16 animate-spin-slow" style={{ color: 'var(--accent-blue)', opacity: 0.6 }} />
          </div>

          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }} data-testid="text-loading-title">
            AI 正在分析你的交易DNA...
          </h2>
        </motion.div>

        <div className="space-y-3 text-left">
          {analysisSteps.map((step, i) => {
            const isDone = i < completedSteps;
            const isCurrent = i === completedSteps - 1;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: isDone ? 'rgba(0, 230, 118, 0.06)' : 'transparent',
                  opacity: isDone ? 1 : 0.3,
                }}
              >
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--success)' }}
                  >
                    <Check className="w-3 h-3 text-black" />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ border: '1.5px solid var(--border-color)' }} />
                )}
                <span
                  className="text-sm transition-colors"
                  style={{ color: isDone ? 'var(--success)' : 'var(--text-secondary)' }}
                >
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
