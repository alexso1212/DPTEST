import { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SiWechat } from "react-icons/si";
import { traderTypes, rankTiers } from "@/data/traderTypes";
import { dimensionLabels, type Dimension } from "@/data/questions";
import RadarChartComponent from "@/components/RadarChart";
import AlbionCharacterSVG from "@/components/AlbionCharacterSVG";
import RankBadge from "@/components/RankBadge";
import WeChatContactModal, { useWeChatContact } from "@/components/WeChatContactModal";

const ease = { duration: 0.22, ease: "easeOut" as const };

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-0)' }}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>加载报告中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-0)' }}>
        <div className="text-center px-6">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-lg font-heading font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            {(error as Error)?.message || "报告不存在"}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
  const [c1, c2] = traderType?.colors ?? ['#C9A456', '#94A3B8'];
  const cc = traderType?.cardColors;
  const [showWeChatModal, setShowWeChatModal] = useState(false);
  const { handleContact: handleWeChatMobile } = useWeChatContact();

  const handleContactWeChat = () => {
    const mobileHandled = handleWeChatMobile();
    if (!mobileHandled) {
      setShowWeChatModal(true);
    }
  };

  const sortedDims = useMemo(() => {
    const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'EDGE'];
    return [...dims].sort((a, b) => scores[b] - scores[a]);
  }, [scores]);

  return (
    <div className="min-h-screen pb-28" style={{ background: 'var(--bg-0)' }}>
      <div className="max-w-lg md:max-w-2xl mx-auto px-5 pt-6 space-y-5">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ease}
          className="text-center pt-2 pb-1"
        >
          <div className="text-xl font-heading font-bold tracking-widest" style={{ color: 'var(--primary)' }}>
            DELTAPEX
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>交易能力测评 · 完整报告</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, ...ease }}
          className="rounded-2xl p-5 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${c1}12, var(--bg-1), ${c1}08)`,
            border: `1px solid ${c2}30`,
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
          transition={{ delay: 0.12, ...ease }}
          className="rounded-2xl p-6 text-center relative overflow-hidden"
          style={{
            background: cc ? `linear-gradient(170deg, ${cc.dark} 0%, #0d0f14 40%, ${cc.dark} 100%)` : `linear-gradient(145deg, ${c1}15, var(--bg-1))`,
            border: cc ? `1px solid ${cc.glow}` : `1.5px solid ${c2}40`,
            boxShadow: cc ? `0 0 25px ${cc.glow}` : `0 0 30px ${c1}15`,
          }}
        >
          <div className="absolute inset-0" style={{ background: cc ? `radial-gradient(circle at 50% 30%, ${cc.primary}20, transparent 70%)` : `radial-gradient(circle at 50% 30%, ${c1}15, transparent 60%)` }} />
          <div className="relative">
          {traderType?.element && (
          <div className="flex items-center gap-1 justify-start mb-2">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: cc ? `${cc.primary}22` : `${c2}15`, padding: "3px 10px", borderRadius: "16px",
              border: cc ? `1px solid ${cc.primary}44` : `1px solid ${c2}30`,
            }}>
              <span style={{ fontSize: "12px" }}>{traderType.element.icon}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "10px", color: cc?.secondary || c2, letterSpacing: "1px" }}>
                {traderType.element.name.toUpperCase()}
              </span>
            </div>
          </div>
          )}
          <div className="flex justify-center mb-2" style={{ position: "relative" }}>
            <div style={{
              position: "absolute", width: "120px", height: "120px", borderRadius: "50%", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              background: cc ? `radial-gradient(circle, ${cc.primary}33 0%, transparent 70%)` : `radial-gradient(circle, ${c1}25 0%, transparent 70%)`,
            }} />
            <AlbionCharacterSVG type={traderType.code} size={180} />
          </div>
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: `linear-gradient(to right, transparent, var(--gold))` }} />
            <span className="text-xs" style={{ color: 'var(--gold)' }}>✦</span>
            <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: `linear-gradient(to left, transparent, var(--gold))` }} />
          </div>
          <h3 className="text-xl font-serif font-bold mb-1" style={{ color: '#E8E6E1', letterSpacing: '3px' }} data-testid="text-type-name">
            {traderType.name}
          </h3>
          <p className="text-xs font-tag tracking-widest mb-2" style={{ color: cc?.primary || c2 }}>
            {traderType.subtitle}
          </p>
          {traderType?.quote && (
          <p className="text-sm font-serif italic leading-relaxed" style={{ color: 'var(--gold)' }}>
            "{traderType.quote}"
          </p>
          )}
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-strong)' }} data-testid="text-one-liner">
            {traderType.oneLiner}
          </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, ...ease }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
            🕸️ 你的能力轮廓
          </h3>
          <RadarChartComponent scores={scores} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...ease }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
            📊 六维详细分数
          </h3>
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {sortedDims.map((dim, i) => (
              <div key={dim}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{dimensionLabels[dim]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-num font-bold" style={{ color: 'var(--text-strong)' }}>{scores[dim]}</span>
                    {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${c1}20`, color: c1 }}>🔥最强</span>}
                    {i === sortedDims.length - 1 && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(var(--info-rgb), 0.15)', color: 'var(--info)' }}>⬆️突破口</span>}
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${scores[dim]}%` }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                    style={{ background: i === 0 ? c1 : i === sortedDims.length - 1 ? 'var(--info)' : 'var(--text-muted)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, ...ease }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
            💪 你的核心优势
          </h3>
          <div className="space-y-2">
            {traderType.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--success)' }} className="mt-0.5 flex-shrink-0">✓</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, ...ease }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
            ⚠️ 致命盲区
          </h3>
          <div className="space-y-2">
            {traderType.blindSpots.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--warning)' }} className="mt-0.5 flex-shrink-0">!</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, ...ease }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
            🔍 你可能经常遇到这种情况：
          </h3>
          <div className="pl-4 py-1" style={{ borderLeft: `3px solid ${c1}` }}>
            <p className="text-sm leading-[1.8]" style={{ color: 'var(--text)' }} data-testid="text-piercing">
              "{traderType.piercingDescription}"
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...ease }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
            💡 个性化提升路径
          </h3>
          <p className="text-sm leading-[1.8]" style={{ color: 'var(--text)' }} data-testid="text-advice">
            {traderType.advice}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, ...ease }}
          className="rounded-2xl p-6 text-center"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-lg font-heading font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            想进一步提升？
          </h3>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            加入 Deltapex Trading Group，获得实盘指导和专业社群支持
          </p>
          <motion.button
            onClick={handleContactWeChat}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200"
            style={{ background: '#07C160' }}
            data-testid="button-wechat-contact"
          >
            <SiWechat className="w-5 h-5" />
            添加专属顾问
          </motion.button>
          <p className="text-xs italic mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            "我们不教你怎么赚钱——<br />
            我们让你亲眼看到专业交易是什么样的"
          </p>
        </motion.div>

        <div className="text-center pt-2 pb-4">
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Powered by Deltapex Trading Group
          </p>
        </div>
      </div>

      <WeChatContactModal
        open={showWeChatModal}
        onClose={() => setShowWeChatModal(false)}
      />
    </div>
  );
}
