import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SiWechat } from "react-icons/si";
import { Lock, Camera, Home } from "lucide-react";
import RadarChartComponent from "@/components/RadarChart";
import ShareCard from "@/components/ShareCard";
import CountUp from "@/components/CountUp";
import CharacterIcon from "@/components/CharacterIcon";
import RankBadge from "@/components/RankBadge";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";
import { salesStrategy } from "@/data/salesStrategy";
import { sendResultWebhook } from "@/utils/webhook";
import { useAuth } from "@/lib/auth";

interface ResultPageProps {
  result: QuizResult;
}

const ease = { duration: 0.22, ease: "easeOut" as const };

function CharacterCardReveal({ result, onDone }: { result: QuizResult; onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const { traderType, rank } = result;
  const [c1] = traderType.colors;

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3000),
      setTimeout(() => onDone(), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const particles = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      angle: (i / 20) * 360,
      distance: 80 + Math.random() * 60,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.4,
    })), []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-0)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {phase < 2 && (
        <motion.div
          className="flex flex-col items-center"
          animate={{ opacity: phase >= 2 ? 0 : 1 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, ${c1}50, transparent 70%)`,
              boxShadow: `0 0 60px ${c1}30`,
            }}
            animate={{ scale: [1, 1.3, 1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-6 text-sm font-serif"
            style={{ color: 'var(--gold)' }}
          >
            正在召唤你的交易人格...
          </motion.p>
        </motion.div>
      )}

      {phase >= 2 && (
        <div className="relative flex flex-col items-center">
          {phase === 2 && particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: '#C9A456',
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
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
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: 280,
              aspectRatio: '3/4',
              background: `linear-gradient(145deg, ${c1}20, var(--bg-1), ${c1}10)`,
              border: `1.5px solid ${traderType.colors[1]}50`,
              boxShadow: `0 0 40px ${c1}25, 0 0 80px ${c1}10`,
            }}
            initial={{ opacity: 0, scale: 0.7, rotateY: 180, filter: 'blur(20px)' }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
              filter: 'blur(0px)',
            }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="absolute inset-0" style={{
              background: `radial-gradient(circle at 30% 20%, ${c1}15, transparent 60%)`,
            }} />

            <div className="relative h-full flex flex-col items-center justify-between p-5">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-tag" style={{ color: traderType.colors[1], opacity: 0.7 }}>
                  {traderType.element.icon} {traderType.element.name}
                </span>
                <RankBadge tier={rank} size="sm" />
              </div>

              <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                <CharacterIcon typeCode={traderType.code} size={140} />
              </div>

              <div className="text-center w-full">
                <h2 className="font-serif text-2xl font-bold mb-0.5" style={{ color: 'var(--text-strong)' }}>
                  {traderType.name}
                </h2>
                <p className="font-tag text-[11px] tracking-widest mb-3" style={{ color: traderType.colors[1] }}>
                  {traderType.subtitle}
                </p>
                <div className="flex items-center gap-2 justify-center mb-3">
                  <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(to right, transparent, var(--gold))` }} />
                  <span className="text-xs" style={{ color: 'var(--gold)' }}>✦</span>
                  <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(to left, transparent, var(--gold))` }} />
                </div>
              </div>
            </div>
          </motion.div>

          {phase >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-5 text-sm font-serif italic text-center max-w-[260px] leading-relaxed"
              style={{ color: 'var(--gold)' }}
            >
              "{traderType.quote}"
            </motion.p>
          )}

          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-4 text-center"
            >
              <div className="flex items-baseline justify-center gap-1">
                <CountUp
                  end={result.avgScore}
                  duration={1200}
                  className="text-4xl font-num font-bold"
                  style={{ color: rank.color }}
                />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/100</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {rank.name}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function ResultPage({ result }: ResultPageProps) {
  const { traderType, rank, normalizedScores, avgScore } = result;
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showUnbox, setShowUnbox] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [c1] = traderType.colors;

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
          <CharacterCardReveal result={result} onDone={() => setShowUnbox(false)} />
        )}
      </AnimatePresence>

      {!showUnbox && (
        <div className="min-h-screen pb-24" style={{ background: 'var(--bg-0)' }}>
          <div className="max-w-lg mx-auto px-5 pt-6 space-y-5">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...ease }}
              className="rounded-2xl p-5 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${c1}12, var(--bg-1), ${c1}08)`,
                border: `1px solid ${traderType.colors[1]}30`,
                boxShadow: `0 0 30px ${c1}10`,
              }}
            >
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 0%, ${c1}15, transparent 60%)` }} />
              <div className="relative">
                <div className="flex justify-center mb-3">
                  <RankBadge tier={rank} size="lg" />
                </div>
                <div className="text-xl font-heading font-bold font-num" style={{ color: rank.color }} data-testid="text-rank">
                  {rank.name}
                </div>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-3xl font-num font-bold" style={{ color: rank.color }}>{avgScore}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/100</span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{rank.description}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...ease }}
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${c1}15, var(--bg-1))`,
                border: `1.5px solid ${traderType.colors[1]}40`,
                boxShadow: `0 0 30px ${c1}15`,
              }}
            >
              <div className="flex items-center gap-1 justify-start mb-2">
                <span className="text-xs font-tag" style={{ color: traderType.colors[1], opacity: 0.7 }}>
                  {traderType.element.icon} {traderType.element.name}
                </span>
              </div>
              <div className="flex justify-center mb-3">
                <CharacterIcon typeCode={traderType.code} size={120} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-1" style={{ color: c1 }} data-testid="text-type-name">
                {traderType.name}
              </h3>
              <p className="text-xs font-tag tracking-widest mb-2" style={{ color: traderType.colors[1] }}>
                {traderType.subtitle}
              </p>
              <div className="flex items-center gap-2 justify-center mb-3">
                <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: `linear-gradient(to right, transparent, var(--gold))` }} />
                <span className="text-xs" style={{ color: 'var(--gold)' }}>✦</span>
                <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: `linear-gradient(to left, transparent, var(--gold))` }} />
              </div>
              <p className="text-sm font-serif italic leading-relaxed" style={{ color: 'var(--gold)' }}>
                "{traderType.quote}"
              </p>
              <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-strong)' }} data-testid="text-one-liner">
                {traderType.oneLiner}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...ease }}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
            >
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                🕸️ 你的能力轮廓
              </h3>
              <RadarChartComponent scores={normalizedScores} hideScores />
              <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                具体分数和详细分析在完整报告中
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ...ease }}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
            >
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                🔍 你可能经常遇到这种情况：
              </h3>
              <div
                className="pl-4 py-1"
                style={{ borderLeft: `3px solid ${c1}` }}
              >
                <p
                  className="text-base leading-[1.8]"
                  style={{ color: 'var(--text)' }}
                  data-testid="text-piercing"
                >
                  "{traderType.piercingDescription}"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ...ease }}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
            >
              <div className="relative" style={{ filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>📊 六维详细分数</span>
                </div>
                <div className="space-y-2">
                  {sortedDims.map((dim, i) => (
                    <div key={dim} className="flex items-center gap-2">
                      <span className="text-xs w-16" style={{ color: 'var(--text-muted)' }}>{dimensionLabels[dim]}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full" style={{ width: `${normalizedScores[dim]}%`, background: i === 0 ? c1 : 'var(--info)' }} />
                      </div>
                      <span className="text-xs font-num w-6 text-right" style={{ color: 'var(--text-strong)' }}>{normalizedScores[dim]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>💪 你的核心优势</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-3 rounded" style={{ background: 'rgba(var(--success-rgb), 0.2)' }} />
                    <div className="h-3 rounded w-4/5" style={{ background: 'rgba(var(--success-rgb), 0.2)' }} />
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>⚠️ 你的致命盲区</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-3 rounded" style={{ background: 'rgba(var(--warning-rgb), 0.2)' }} />
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>💡 个性化提升路径</span>
                  <div className="mt-2 space-y-1">
                    <div className="h-3 rounded" style={{ background: 'rgba(var(--info-rgb), 0.2)' }} />
                    <div className="h-3 rounded w-3/4" style={{ background: 'rgba(var(--info-rgb), 0.2)' }} />
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(var(--bg-0-rgb), 0.4)' }}
              >
                <div className="text-center">
                  <Lock className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>添加顾问解锁完整报告</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ...ease }}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
            >
              <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
                🔓 解锁你的完整交易能力诊断
              </h3>

              <div className="space-y-2 mb-5">
                {[
                  "六维详细分数 + 维度排名",
                  "你的核心优势和致命盲区",
                  "个性化提升路径",
                  "免费实盘直播间观摩入口",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <motion.button
                onClick={handleContactWeChat}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 mb-4 transition-all duration-200"
                style={{ background: '#07C160' }}
                data-testid="button-wechat-contact"
              >
                <SiWechat className="w-5 h-5" />
                添加专属顾问，30秒发送完整报告
              </motion.button>

              <p className="text-xs italic text-center leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                "我们不教你怎么赚钱——<br />
                我们让你亲眼看到专业交易是什么样的"
              </p>
            </motion.div>

            <div className="h-4" />
          </div>

          <div
            className="fixed bottom-0 left-0 right-0 z-40"
            style={{
              background: 'rgba(var(--bg-0-rgb), 0.92)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid var(--border)',
              paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            }}
          >
            <div className="max-w-lg mx-auto px-5 pt-3 flex gap-3">
              <motion.button
                onClick={() => navigate("/home")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
                data-testid="button-go-home"
              >
                <Home className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setShowShareModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--gold)',
                  color: 'var(--gold)',
                }}
                data-testid="button-save-image"
              >
                <Camera className="w-4 h-4" />
                生成交易员卡片
              </motion.button>
              <motion.button
                onClick={handleContactWeChat}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white transition-all duration-200"
                style={{ background: 'var(--primary)' }}
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
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={ease}
                  className="max-w-sm w-full max-h-[85vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShareCard result={result} />
                  <motion.button
                    onClick={() => setShowShareModal(false)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-3 py-3 rounded-xl text-sm"
                    style={{ color: 'var(--text-muted)' }}
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
