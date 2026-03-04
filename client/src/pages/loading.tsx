import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface LoadingPageProps {
  onDone: () => void;
}

const analysisSteps = [
  "风险偏好已识别",
  "交易心理已评估",
  "能力边界已定位",
  "档案生成完毕",
];

export default function LoadingPage({ onDone }: LoadingPageProps) {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [cardPhase, setCardPhase] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setCardPhase(1), 200));
    timers.push(setTimeout(() => setCardPhase(2), 1000));
    timers.push(setTimeout(() => setCardPhase(3), 2000));
    timers.push(setTimeout(() => setCardPhase(4), 3000));

    for (let i = 0; i < analysisSteps.length; i++) {
      timers.push(setTimeout(() => setCompletedSteps(i + 1), 800 * (i + 1)));
    }

    timers.push(setTimeout(() => onDone(), 4000));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[1px] opacity-[0.03]"
            style={{
              top: `${12 + i * 12}%`,
              background: 'var(--accent-blue)',
              animation: `scan-line 3s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-xs mx-auto">
        <motion.div
          className="relative mx-auto rounded-2xl overflow-hidden mb-8"
          style={{
            width: '220px',
            height: '300px',
            background: cardPhase >= 1 ? 'var(--bg-card)' : 'transparent',
            border: `2px solid ${cardPhase >= 1 ? 'rgba(var(--accent-blue-rgb), 0.4)' : 'rgba(var(--accent-blue-rgb), 0.05)'}`,
            boxShadow: cardPhase >= 4 ? '0 0 40px rgba(0, 212, 255, 0.2), 0 0 80px rgba(240, 185, 11, 0.1)' : 'none',
            transition: 'all 0.8s ease-out',
          }}
        >
          <motion.div
            className="absolute top-6 left-0 right-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: cardPhase >= 2 ? 1 : 0,
              scale: cardPhase >= 2 ? 1 : 0.5,
            }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(var(--accent-gold-rgb), 0.1)',
                border: '2px solid rgba(var(--accent-gold-rgb), 0.3)',
              }}
            >
              <span className="text-2xl">🏆</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-[40%] left-0 right-0 text-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: cardPhase >= 3 ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-3xl mb-2">❓</div>
            <div className="w-24 h-3 rounded-full mx-auto" style={{ background: 'rgba(var(--accent-gold-rgb), 0.15)' }} />
            <div className="w-32 h-2 rounded-full mx-auto mt-2" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </motion.div>

          <motion.div
            className="absolute bottom-6 left-4 right-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: cardPhase >= 3 ? 1 : 0,
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg viewBox="0 0 200 120" className="w-full opacity-30">
              <polygon
                points="100,10 180,45 165,100 35,100 20,45"
                fill="none"
                stroke="var(--accent-blue)"
                strokeWidth="1"
                opacity="0.4"
              />
              <polygon
                points="100,30 150,55 140,90 60,90 50,55"
                fill="rgba(0,212,255,0.08)"
                stroke="var(--accent-blue)"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </motion.div>

          {cardPhase >= 4 && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
              }}
            />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-base font-semibold mb-8"
          style={{ color: 'var(--text-primary)' }}
          data-testid="text-loading-title"
        >
          正在生成你的交易员档案...
        </motion.p>

        <div className="space-y-2.5">
          {analysisSteps.map((step, i) => {
            const isDone = i < completedSteps;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: isDone ? 1 : 0.3 }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300"
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
                  {isDone ? '✓ ' : ''}{step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
