import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Brain, Target, TrendingUp, Zap, Eye } from "lucide-react";

interface LoadingPageProps {
  onDone: () => void;
}

const analysisDims = [
  { icon: Shield, label: "风险管理能力", color: "text-red-400" },
  { icon: Brain, label: "交易心理素质", color: "text-purple-400" },
  { icon: Target, label: "系统化思维", color: "text-blue-400" },
  { icon: TrendingUp, label: "市场适应力", color: "text-green-400" },
  { icon: Zap, label: "执行力评估", color: "text-yellow-400" },
  { icon: Eye, label: "大局观分析", color: "text-cyan-400" },
];

export default function LoadingPage({ onDone }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentDim, setCurrentDim] = useState(0);

  useEffect(() => {
    const totalDuration = 3000;
    const stepInterval = totalDuration / 100;
    const dimInterval = totalDuration / analysisDims.length;

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return p + 1;
      });
    }, stepInterval);

    const dimTimer = setInterval(() => {
      setCurrentDim((d) => {
        if (d >= analysisDims.length - 1) {
          clearInterval(dimTimer);
          return analysisDims.length - 1;
        }
        return d + 1;
      });
    }, dimInterval);

    const doneTimer = setTimeout(() => {
      onDone();
    }, totalDuration + 500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(dimTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[35%] h-[35%] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative w-28 h-28 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="6"
              />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
                transition={{ duration: 0.1 }}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-2" data-testid="text-loading-title">
            正在分析你的交易基因
          </h2>
          <p className="text-xs text-white/40">
            AI 正在对你的答案进行多维度分析...
          </p>
        </motion.div>

        <div className="space-y-2.5">
          {analysisDims.map((dim, i) => {
            const isActive = i === currentDim;
            const isDone = i < currentDim;

            return (
              <motion.div
                key={dim.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white/[0.06] border border-white/10"
                    : isDone
                      ? "bg-white/[0.02] opacity-60"
                      : "opacity-30"
                }`}
              >
                <dim.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? dim.color : "text-white/30"}`} />
                <span className={`text-sm flex-1 text-left ${isActive ? "text-white/80" : "text-white/40"}`}>
                  {dim.label}
                </span>
                {isDone && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-400 text-xs"
                  >
                    Done
                  </motion.span>
                )}
                {isActive && (
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
