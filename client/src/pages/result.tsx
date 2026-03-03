import { useMemo } from "react";
import { motion } from "framer-motion";
import { SiWechat } from "react-icons/si";
import { ArrowRight, Lock } from "lucide-react";
import RadarChartComponent from "@/components/RadarChart";
import ShareCard from "@/components/ShareCard";
import CountUp from "@/components/CountUp";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";

interface ResultPageProps {
  result: QuizResult;
}

export default function ResultPage({ result }: ResultPageProps) {
  const { traderType, rank, rarity, normalizedScores, avgScore } = result;

  const sortedDims = useMemo(() => {
    const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'VISION'];
    return dims.sort((a, b) => normalizedScores[b] - normalizedScores[a]);
  }, [normalizedScores]);

  const maxDim = sortedDims[0];
  const minDim = sortedDims[sortedDims.length - 1];

  const handleContactWeChat = () => {
    window.location.href = "https://work.weixin.qq.com/ca/cawcde75d99eb3fce4";
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-lg mx-auto px-5 pt-6 space-y-4">

        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="rounded-2xl p-6 text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="text-5xl mb-3">{traderType.icon}</div>
          <div
            className="text-2xl font-bold font-num mb-1"
            style={{ color: rank.color }}
            data-testid="text-rank"
          >
            {rank.name}
          </div>
          <div className="flex items-center justify-center gap-1 mb-4" style={{ color: 'var(--text-secondary)' }}>
            <span className="text-xs">综合评分</span>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <CountUp
              end={avgScore}
              duration={1500}
              className="text-5xl font-num font-bold"
              style={{ color: rank.color }}
            />
            <span className="text-lg" style={{ color: 'var(--text-secondary)' }}>/100</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="text-3xl mb-2">{traderType.icon}</div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }} data-testid="text-type-name">
            {traderType.name}
          </h2>
          <p className="text-sm mb-3" style={{ color: 'var(--accent-gold)' }} data-testid="text-one-liner">
            {traderType.oneLiner}
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }} data-testid="text-description">
            {traderType.description}
          </p>
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs"
            style={{
              background: 'rgba(var(--accent-gold-rgb), 0.1)',
              color: 'var(--accent-gold)',
            }}
            data-testid="text-rarity"
          >
            仅 {rarity} 的测评者是此类型
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>能力雷达图</h3>
          <RadarChartComponent scores={normalizedScores} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--success)' }}>
                核心优势
              </h4>
              <ul className="space-y-2">
                {traderType.strengths.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--success)' }} />
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--warning)' }}>
                潜在盲区
              </h4>
              <ul className="space-y-2">
                {traderType.blindSpots.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--warning)' }} />
                    {b}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--accent-blue)' }}>
                提升建议
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }} data-testid="text-advice">
                {traderType.advice}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>维度详情</h3>
          <div className="space-y-3">
            {sortedDims.map((dim, i) => {
              const score = normalizedScores[dim];
              const isMax = dim === maxDim;
              const isMin = dim === minDim;
              const barColor = isMax ? 'var(--accent-gold)' : isMin ? 'var(--warning)' : 'var(--accent-blue)';

              return (
                <motion.div
                  key={dim}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{dimensionLabels[dim]}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-num font-semibold" style={{ color: 'var(--text-primary)' }}>{score}</span>
                      {isMax && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(var(--accent-gold-rgb), 0.15)', color: 'var(--accent-gold)' }}>
                          MAX
                        </span>
                      )}
                      {isMin && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255, 167, 38, 0.15)', color: 'var(--warning)' }}>
                          可提升
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                    <motion.div
                      className="h-full rounded-full gpu-accelerate"
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 1 + i * 0.1, ease: "easeOut" }}
                      style={{ background: barColor }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <ShareCard result={result} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>想要更深度的交易能力分析？</span>
          </div>
          <ul className="space-y-2 mb-5">
            {["个性化策略建议", "适合你的交易品种推荐", "详细提升路径规划"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--success)' }} />
                {item}
              </li>
            ))}
          </ul>

          <p className="text-sm text-center mb-4" style={{ color: 'var(--accent-gold)' }}>
            扫码添加，免费获取专属分析
          </p>

          <button
            onClick={handleContactWeChat}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            style={{ background: '#07C160' }}
            data-testid="button-wechat-contact"
          >
            <SiWechat className="w-5 h-5" />
            添加企业微信顾问
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
