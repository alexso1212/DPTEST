import { motion } from "framer-motion";
import { SiWechat } from "react-icons/si";
import { ArrowRight, Sparkles } from "lucide-react";
import RadarChartComponent from "@/components/RadarChart";
import ShareCard from "@/components/ShareCard";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";

interface ResultPageProps {
  result: QuizResult;
}

export default function ResultPage({ result }: ResultPageProps) {
  const { traderType, rank, rarity, normalizedScores, avgScore } = result;
  const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'VISION'];

  const handleContactWeChat = () => {
    window.location.href = "https://work.weixin.qq.com/kfid/kfc3b42c637be3e4c33";
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white pb-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 mb-6">
            <Sparkles className="w-3 h-3" />
            分析完成
          </div>

          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="text-5xl mb-3"
          >
            {traderType.icon}
          </motion.div>

          <h1 className="text-2xl font-bold mb-1" data-testid="text-type-name">
            {traderType.name}
          </h1>
          <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">
            {traderType.subtitle}
          </p>
          <p className="text-sm text-white/60 italic" data-testid="text-one-liner">
            "{traderType.oneLiner}"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <span className="text-lg">{rank.icon}</span>
            <div>
              <div className="text-xs text-white/40">段位</div>
              <div className="text-sm font-semibold" style={{ color: rank.color }} data-testid="text-rank">
                {rank.name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <span className="text-lg">🎲</span>
            <div>
              <div className="text-xs text-white/40">稀有度</div>
              <div className="text-sm font-semibold text-white/80" data-testid="text-rarity">
                仅 {rarity}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <RadarChartComponent scores={normalizedScores} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-2 mb-8"
        >
          {dims.map((dim) => {
            const score = normalizedScores[dim];
            const barColor = score >= 70 ? "bg-green-400" : score >= 40 ? "bg-blue-400" : "bg-orange-400";
            return (
              <div key={dim} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs text-white/40 mb-1">{dimensionLabels[dim]}</div>
                <div className="text-xl font-bold mb-2">{score}</div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
        >
          <h3 className="font-semibold text-sm mb-3 text-white/80">关于你</h3>
          <p className="text-sm text-white/50 leading-relaxed" data-testid="text-description">
            {traderType.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 gap-3 mb-8"
        >
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
            <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">核心优势</h4>
            <ul className="space-y-2">
              {traderType.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-green-400 mt-0.5 text-xs">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
            <h4 className="text-xs font-semibold text-orange-400 mb-2 uppercase tracking-wider">潜在盲区</h4>
            <ul className="space-y-2">
              {traderType.blindSpots.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-orange-400 mt-0.5 text-xs">!</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10"
        >
          <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">精进建议</h4>
          <p className="text-sm text-white/60 leading-relaxed" data-testid="text-advice">
            {traderType.advice}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <ShareCard result={result} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-6"
        >
          <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
            <h3 className="font-semibold text-sm mb-1 text-white/80">想要进一步精进？</h3>
            <p className="text-xs text-white/40 mb-4">添加企业微信，获取专属交易提升方案</p>
            <button
              onClick={handleContactWeChat}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#07C160] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              data-testid="button-wechat-contact"
            >
              <SiWechat className="w-5 h-5" />
              添加企业微信顾问
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
