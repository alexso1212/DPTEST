import { useMemo } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SiWechat } from "react-icons/si";
import { traderTypes, rankTiers } from "@/data/traderTypes";
import { dimensionLabels, type Dimension } from "@/data/questions";
import RadarChartComponent from "@/components/RadarChart";

const spring = { type: "spring" as const, stiffness: 260, damping: 26 };

const WECHAT_CONTACT = "https://work.weixin.qq.com/ca/cawcde75d99eb3fce4";

interface ReportData {
  scores: Record<string, number>;
  traderTypeCode: string;
  avgScore: number;
  rankName: string;
  createdAt: string;
}

export default function ReportPage() {
  const [, params] = useRoute("/report/:token");
  const token = params?.token;

  const { data, isLoading, error } = useQuery<ReportData>({
    queryKey: ["/api/report", token],
    queryFn: async () => {
      const res = await fetch(`/api/report/${token}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "报告加载失败");
      }
      return res.json();
    },
    enabled: !!token,
    staleTime: 60000,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>加载报告中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center px-6">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {(error as Error)?.message || "报告不存在"}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            该链接可能已失效，请联系顾问获取新的报告链接
          </p>
        </div>
      </div>
    );
  }

  const traderType = traderTypes[data.traderTypeCode];
  const rank = rankTiers.find(r => r.name === data.rankName) || rankTiers[rankTiers.length - 1];
  const scores = data.scores as Record<Dimension, number>;

  return <ReportContent traderType={traderType} rank={rank} scores={scores} avgScore={data.avgScore} />;
}

function ReportContent({
  traderType,
  rank,
  scores,
  avgScore,
}: {
  traderType: (typeof traderTypes)[string];
  rank: (typeof rankTiers)[number];
  scores: Record<Dimension, number>;
  avgScore: number;
}) {
  const sortedDims = useMemo(() => {
    const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'EDGE'];
    return [...dims].sort((a, b) => scores[b] - scores[a]);
  }, [scores]);

  return (
    <div className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-lg mx-auto px-5 pt-6 space-y-5">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-center pt-2 pb-1"
        >
          <div className="text-xl font-extrabold tracking-widest" style={{ color: 'var(--accent-gold)' }}>
            DELTAPEX
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>交易能力测评 · 完整报告</p>
        </motion.div>

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
          transition={{ delay: 0.15, ...spring }}
          className="rounded-2xl p-6 text-center"
          style={{ background: 'var(--bg-card)', border: `2px solid ${rank.color}40`, boxShadow: `0 0 30px ${rank.color}15` }}
        >
          <div className="text-5xl mb-3">{traderType.icon}</div>
          <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--accent-gold)' }} data-testid="text-type-name">
            {traderType.name}
          </h3>
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{traderType.subtitle}</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }} data-testid="text-one-liner">
            {traderType.oneLiner}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...spring }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            🕸️ 你的能力轮廓
          </h3>
          <RadarChartComponent scores={scores} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ...spring }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            📊 六维详细分数
          </h3>
          <div className="space-y-3">
            {sortedDims.map((dim, i) => (
              <div key={dim}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{dimensionLabels[dim]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-num font-bold" style={{ color: 'var(--text-primary)' }}>{scores[dim]}</span>
                    {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(var(--accent-gold-rgb), 0.15)', color: 'var(--accent-gold)' }}>🔥最强</span>}
                    {i === sortedDims.length - 1 && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(var(--accent-blue-rgb), 0.15)', color: 'var(--accent-blue)' }}>⬆️突破口</span>}
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${scores[dim]}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    style={{ background: i === 0 ? 'var(--accent-gold)' : i === sortedDims.length - 1 ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, ...spring }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            💪 你的核心优势
          </h3>
          <div className="space-y-2">
            {traderType.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--success)' }} className="mt-0.5 flex-shrink-0">✓</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...spring }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            ⚠️ 致命盲区
          </h3>
          <div className="space-y-2">
            {traderType.blindSpots.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--accent-gold)' }} className="mt-0.5 flex-shrink-0">!</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, ...spring }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            🔍 你可能经常遇到这种情况：
          </h3>
          <div className="pl-4 py-1" style={{ borderLeft: '3px solid var(--accent-gold)' }}>
            <p className="text-sm leading-[1.8]" style={{ color: 'var(--text-primary)' }} data-testid="text-piercing">
              "{traderType.piercingDescription}"
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ...spring }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            💡 个性化提升路径
          </h3>
          <p className="text-sm leading-[1.8]" style={{ color: 'var(--text-primary)' }} data-testid="text-advice">
            {traderType.advice}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, ...spring }}
          className="rounded-2xl p-6 text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            想进一步提升？
          </h3>
          <p className="text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>
            加入 Deltapex Trading Group，获得实盘指导和专业社群支持
          </p>
          <motion.a
            href={WECHAT_CONTACT}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white"
            style={{ background: '#07C160' }}
            data-testid="button-wechat-contact"
          >
            <SiWechat className="w-5 h-5" />
            添加专属顾问
          </motion.a>
          <p className="text-xs italic mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            "我们不教你怎么赚钱——<br />
            我们让你亲眼看到专业交易是什么样的"
          </p>
        </motion.div>

        <div className="text-center pt-2 pb-4">
          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            Powered by Deltapex Trading Group
          </p>
        </div>
      </div>
    </div>
  );
}
