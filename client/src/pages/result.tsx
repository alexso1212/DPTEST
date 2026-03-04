import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SiWechat } from "react-icons/si";
import { Lock, Camera, Home } from "lucide-react";
import RadarChartComponent from "@/components/RadarChart";
import ShareCard from "@/components/ShareCard";
import CountUp from "@/components/CountUp";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";
import { salesStrategy } from "@/data/salesStrategy";
import { sendResultWebhook } from "@/utils/webhook";
import { useAuth } from "@/lib/auth";

interface ResultPageProps {
  result: QuizResult;
}

const spring = { type: "spring" as const, stiffness: 260, damping: 26 };

function RankUnbox({ result, onDone }: { result: QuizResult; onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => onDone(), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const particles = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      angle: (i / 24) * 360,
      distance: 60 + Math.random() * 80,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 0.3,
    })), []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {phase < 2 && (
        <>
          <motion.div
            className="w-24 h-24 rounded-full"
            style={{
              background: `radial-gradient(circle, ${result.rank.color}40, transparent 70%)`,
              boxShadow: `0 0 60px ${result.rank.color}30, 0 0 120px ${result.rank.color}15`,
            }}
            animate={{
              scale: [1, 1.2, 1, 1.15, 1],
              opacity: phase >= 2 ? 0 : 1,
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-6 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            正在定位你的段位...
          </motion.p>
        </>
      )}

      {phase >= 2 && (
        <>
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: result.rank.color,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
            />
          ))}

          <motion.div
            className="text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, ...spring }}
          >
            <div className="text-5xl mb-4">{result.rank.icon}</div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ...spring }}
            >
              <div
                className="text-[28px] font-bold font-num mb-2"
                style={{ color: result.rank.color }}
              >
                {result.rank.name}
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-3">
                <CountUp
                  end={result.avgScore}
                  duration={1500}
                  className="text-5xl font-num font-bold"
                  style={{ color: result.rank.color }}
                />
                <span className="text-lg" style={{ color: 'var(--text-secondary)' }}>/100</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {result.rank.description}
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function TypeCardFlip({ result }: { result: QuizResult }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const { traderType, rarity } = result;
  const topDims = traderType.dims;

  return (
    <div
      className="mx-auto cursor-pointer"
      style={{ width: '280px', height: '380px', perspective: '1000px' }}
      onClick={() => setFlipped(true)}
      data-testid="card-type-flip"
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="text-6xl mb-4 opacity-60">❓</div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            你的交易员人格是...
          </p>
          <p className="text-xs mt-2 animate-pulse" style={{ color: 'var(--accent-blue)' }}>
            点击揭晓
          </p>
        </div>

        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-between overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--bg-card)',
            border: `2px solid ${result.rank.color}40`,
            boxShadow: `0 0 30px ${result.rank.color}15, inset 0 0 30px ${result.rank.color}05`,
          }}
        >
          <div className="flex items-center gap-1 self-start">
            <span className="text-xs" style={{ color: 'var(--accent-gold)' }}>
              {'★'.repeat(Math.min(5, Math.ceil(parseFloat(rarity) < 6 ? 5 : parseFloat(rarity) < 8 ? 4 : parseFloat(rarity) < 10 ? 3 : 2)))}
              {'☆'.repeat(Math.max(0, 5 - Math.ceil(parseFloat(rarity) < 6 ? 5 : parseFloat(rarity) < 8 ? 4 : parseFloat(rarity) < 10 ? 3 : 2)))}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              稀有度 {rarity}
            </span>
          </div>

          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <div className="text-5xl mb-3">{traderType.icon}</div>
            <h3
              className="text-xl font-bold mb-1"
              style={{ color: 'var(--accent-gold)' }}
              data-testid="text-type-name"
            >
              {traderType.name}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }} data-testid="text-one-liner">
              {traderType.oneLiner}
            </p>
          </div>

          <div className="w-full space-y-2">
            {topDims.map((dim) => {
              const score = result.normalizedScores[dim];
              const filled = Math.round(score / 20);
              return (
                <div key={dim} className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>{dimensionLabels[dim]}</span>
                  <span style={{ color: 'var(--accent-blue)' }}>
                    {'◆'.repeat(Math.min(5, filled))}{'◇'.repeat(Math.max(0, 5 - filled))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResultPage({ result }: ResultPageProps) {
  const { traderType, rank, rarity, normalizedScores, avgScore } = result;
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showUnbox, setShowUnbox] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const sortedDims = useMemo(() => {
    const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'EDGE'];
    return [...dims].sort((a, b) => normalizedScores[b] - normalizedScores[a]);
  }, [normalizedScores]);

  const handleContactWeChat = useCallback(() => {
    const strategy = salesStrategy[traderType.code];
    if (user?.phone && strategy) {
      sendResultWebhook({
        phone: user.phone,
        scores: normalizedScores,
        traderType: { code: traderType.code, name: traderType.name, emoji: traderType.icon },
        rank: { name: rank.name, emoji: rank.icon },
        avgScore,
        salesStrategy: strategy,
      });
    }
    window.location.href = "https://work.weixin.qq.com/ca/cawcde75d99eb3fce4";
  }, [traderType, rank, avgScore, normalizedScores, user]);

  return (
    <>
      <AnimatePresence>
        {showUnbox && (
          <RankUnbox result={result} onDone={() => setShowUnbox(false)} />
        )}
      </AnimatePresence>

      {!showUnbox && (
        <div className="min-h-screen pb-24" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-lg mx-auto px-5 pt-6 space-y-5">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...spring }}
              className="rounded-2xl p-5 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="text-3xl mb-1">{rank.icon}</div>
              <div className="text-xl font-bold font-num" style={{ color: rank.color }} data-testid="text-rank">
                {rank.name}
              </div>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-3xl font-num font-bold" style={{ color: rank.color }}>{avgScore}</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/100</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{rank.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...spring }}
            >
              <TypeCardFlip result={result} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...spring }}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                🕸️ 你的能力轮廓
              </h3>
              <RadarChartComponent scores={normalizedScores} hideScores />
              <p className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
                具体分数和详细分析在完整报告中
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ...spring }}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                🔍 你可能经常遇到这种情况：
              </h3>
              <div
                className="pl-4 py-1"
                style={{ borderLeft: '3px solid var(--accent-gold)' }}
              >
                <p
                  className="text-base leading-[1.8]"
                  style={{ color: 'var(--text-primary)' }}
                  data-testid="text-piercing"
                >
                  "{traderType.piercingDescription}"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ...spring }}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="relative" style={{ filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>📊 六维详细分数</span>
                </div>
                <div className="space-y-2">
                  {sortedDims.map((dim, i) => (
                    <div key={dim} className="flex items-center gap-2">
                      <span className="text-xs w-16" style={{ color: 'var(--text-secondary)' }}>{dimensionLabels[dim]}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                        <div className="h-full rounded-full" style={{ width: `${normalizedScores[dim]}%`, background: i === 0 ? 'var(--accent-gold)' : 'var(--accent-blue)' }} />
                      </div>
                      <span className="text-xs font-num w-6 text-right" style={{ color: 'var(--text-primary)' }}>{normalizedScores[dim]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>💪 你的核心优势</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-3 rounded bg-green-500/20 w-full" />
                    <div className="h-3 rounded bg-green-500/20 w-4/5" />
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>⚠️ 你的致命盲区</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-3 rounded bg-yellow-500/20 w-full" />
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>💡 个性化提升路径</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-3 rounded bg-blue-500/20 w-full" />
                    <div className="h-3 rounded bg-blue-500/20 w-3/4" />
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(var(--bg-primary-rgb), 0.4)' }}
              >
                <div className="text-center">
                  <Lock className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-gold)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>添加顾问解锁完整报告</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ...spring }}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                🔓 解锁你的完整交易能力诊断
              </h3>

              <div className="space-y-2 mb-5">
                {[
                  "六维详细分数 + 维度排名",
                  "你的核心优势和致命盲区",
                  "个性化提升路径",
                  "免费实盘直播间观摩入口",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <motion.button
                onClick={handleContactWeChat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 mb-4"
                style={{ background: '#07C160' }}
                data-testid="button-wechat-contact"
              >
                <SiWechat className="w-5 h-5" />
                添加专属顾问，30秒发送完整报告
              </motion.button>

              <p className="text-xs italic text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                "我们不教你怎么赚钱——<br />
                我们让你亲眼看到专业交易是什么样的"
              </p>
            </motion.div>

            <div className="h-4" />
          </div>

          <div
            className="fixed bottom-0 left-0 right-0 z-40"
            style={{
              background: 'rgba(var(--bg-primary-rgb), 0.9)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid var(--border-color)',
              paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            }}
          >
            <div className="max-w-lg mx-auto px-5 pt-3 flex gap-3">
              <motion.button
                onClick={() => navigate("/home")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
                data-testid="button-go-home"
              >
                <Home className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setShowShareModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--accent-blue)',
                  color: 'var(--accent-blue)',
                }}
                data-testid="button-save-image"
              >
                <Camera className="w-4 h-4" />
                生成交易员卡片
              </motion.button>
              <motion.button
                onClick={handleContactWeChat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-black"
                style={{ background: 'var(--accent-gold)' }}
                data-testid="button-unlock-report"
              >
                <Lock className="w-4 h-4" />
                领取报告
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showShareModal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ background: 'rgba(0,0,0,0.8)' }}
                onClick={() => setShowShareModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={spring}
                  className="max-w-sm w-full max-h-[85vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShareCard result={result} />
                  <motion.button
                    onClick={() => setShowShareModal(false)}
                    whileTap={{ scale: 0.97 }}
                    className="w-full mt-3 py-3 rounded-xl text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    关闭
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
