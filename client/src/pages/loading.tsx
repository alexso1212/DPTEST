import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dimensionLabels, type Dimension } from "@/data/questions";

interface LoadingPageProps {
  onDone: () => void;
  scores?: Record<Dimension, number>;
}

const dims: { key: Dimension; icon: string; color: string }[] = [
  { key: 'RISK', icon: '🛡', color: '#E85D5D' },
  { key: 'MENTAL', icon: '🧠', color: '#A78BFA' },
  { key: 'SYSTEM', icon: '⚙️', color: '#38BDF8' },
  { key: 'ADAPT', icon: '🌊', color: '#22C55E' },
  { key: 'EXEC', icon: '⚡', color: '#F59E0B' },
  { key: 'EDGE', icon: '🔭', color: '#C9A456' },
];

const statusTexts = [
  { text: '正在扫描你的交易记忆...', duration: 1600 },
  { text: '正在匹配交易人格数据库...', duration: 1200 },
  { text: '找到了。', duration: 800 },
];

export default function LoadingPage({ onDone, scores }: LoadingPageProps) {
  const [revealedDims, setRevealedDims] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [titleChars, setTitleChars] = useState(0);
  const title = '正在分析你的交易DNA...';

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i <= title.length; i++) {
      timers.push(setTimeout(() => setTitleChars(i), 60 * i));
    }

    const dimStart = 800;
    for (let i = 0; i < dims.length; i++) {
      timers.push(setTimeout(() => setRevealedDims(i + 1), dimStart + i * 400));
    }

    const statusStart = dimStart + dims.length * 400 + 200;
    let accum = statusStart;
    for (let i = 0; i < statusTexts.length; i++) {
      timers.push(setTimeout(() => setStatusIdx(i), accum));
      accum += statusTexts[i].duration;
    }

    timers.push(setTimeout(() => onDone(), accum + 300));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: 'var(--bg-0)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[1px] opacity-[0.05]"
            style={{
              top: `${15 + i * 14}%`,
              background: 'var(--gold)',
              animation: `scan-line 3s linear infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm md:max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <h2
            className="font-serif text-xl font-semibold"
            style={{ color: 'var(--text-strong)' }}
            data-testid="text-loading-title"
          >
            {title.slice(0, titleChars)}
            <span
              className="inline-block w-[2px] h-5 ml-0.5 align-middle"
              style={{
                background: 'var(--gold)',
                animation: 'typewriter-cursor 0.8s ease-in-out infinite',
              }}
            />
          </h2>
        </motion.div>

        <div className="space-y-3 mb-10">
          {dims.map((dim, i) => {
            const isRevealed = i < revealedDims;
            const score = scores?.[dim.key] ?? Math.round(40 + Math.random() * 50);

            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isRevealed ? 1 : 0.15,
                  x: isRevealed ? 0 : -20,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-3"
              >
                <span className="text-base w-6 text-center">{dim.icon}</span>
                <span className="text-xs w-16 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {dimensionLabels[dim.key]}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isRevealed ? `${score}%` : '0%' }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    style={{ background: dim.color }}
                  />
                </div>
                <motion.span
                  className="text-sm font-num w-8 text-right font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isRevealed ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  style={{ color: dim.color }}
                >
                  {isRevealed ? score : ''}
                </motion.span>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <motion.p
            key={statusIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm"
            style={{
              color: statusIdx === statusTexts.length - 1 ? 'var(--gold)' : 'var(--text-muted)',
              fontWeight: statusIdx === statusTexts.length - 1 ? 600 : 400,
              fontFamily: statusIdx === statusTexts.length - 1 ? 'var(--font-serif)' : 'inherit',
            }}
          >
            {statusIdx < statusTexts.length && (
              <>
                {statusIdx < statusTexts.length - 1 && <span className="mr-1">✦</span>}
                {statusTexts[statusIdx].text}
              </>
            )}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
