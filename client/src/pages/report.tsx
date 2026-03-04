import { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SiWechat } from "react-icons/si";
import { Radio, Wrench, Trophy, ExternalLink, Target, Zap, ChevronRight } from "lucide-react";
import { traderTypes, rankTiers } from "@/data/traderTypes";
import { dimensionLabels, type Dimension } from "@/data/questions";
import RadarChartComponent from "@/components/RadarChart";
import AlbionCharacterSVG from "@/components/AlbionCharacterSVG";
import RankBadge from "@/components/RankBadge";
import WeChatContactModal, { useWeChatContact } from "@/components/WeChatContactModal";
import VerifyCodeModal from "@/components/VerifyCodeModal";
import { generateVerifyCode } from "@/utils/verifyCode";
import { usePageView, useTracking } from "@/hooks/use-tracking";

const ease = { duration: 0.22, ease: "easeOut" as const };

const DELTAPEX_URL = "https://deltapex.zeabur.app";
const BILIBILI_LIVE = "https://live.bilibili.com/1874453448";
const ATAS_URL = "https://atas.net/cn/?rs=partners_oft281860";
const CASES_URL = "https://deltapex.zeabur.app/cases.html";

const dimAdvice: Record<Dimension, { text: string; resource: string; icon: string; url: string }> = {
  EDGE: { text: "在直播间观察老师如何发现高概率交易机会，学习识别关键市场结构", resource: "实盘直播间", icon: "📡", url: BILIBILI_LIVE },
  RISK: { text: "在直播间观察老师如何实时管理风控和仓位，学习动态止损策略", resource: "实盘直播间", icon: "🛡️", url: BILIBILI_LIVE },
  MENTAL: { text: "加入交易社区，和同类型交易员互相督促心态管理，分享实战经验", resource: "交易社区", icon: "🧠", url: CASES_URL },
  ADAPT: { text: "在直播间学习老师如何在不同行情中灵活切换策略，理解市场节奏", resource: "实盘直播间", icon: "🔄", url: BILIBILI_LIVE },
  EXEC: { text: "使用订单流工具（ATAS）精确定位入场点，用数据而非感觉执行交易", resource: "订单流工具", icon: "⚡", url: ATAS_URL },
  SYSTEM: { text: "通过学员案例学习如何构建系统化的交易计划，建立可复制的交易流程", resource: "交易社区", icon: "📋", url: CASES_URL },
};

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
      const sid = localStorage.getItem("dtx_sid") || "";
      const res = await fetch(`/api/report/${token}${sid ? `?sid=${sid}` : ""}`);
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
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);
  const { handleContact: handleWeChatMobile } = useWeChatContact();
  const primaryColor = cc?.primary || c1;
  const { trackEvent } = useTracking();
  usePageView("report");

  const verifyCode = useMemo(() => generateVerifyCode(undefined, traderType?.name || ''), [traderType?.name]);

  const handleContactWeChat = () => {
    trackEvent("wechat_click", { page: "report" });
    setShowVerifyCodeModal(true);
  };

  const handleVerifyProceed = () => {
    const mobileHandled = handleWeChatMobile();
    if (!mobileHandled) {
      setShowWeChatModal(true);
    }
  };

  const sortedDims = useMemo(() => {
    const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'EDGE'];
    return [...dims].sort((a, b) => scores[b] - scores[a]);
  }, [scores]);

  const weakDims = sortedDims.slice(-2);

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

        {/* T001: Character card with floating animation */}
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
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${primaryColor}12 50%, transparent 60%)`,
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
          />
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
          <motion.div
            className="flex justify-center mb-2 relative"
            animate={{ y: [0, -5, 0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              style={{
                position: "absolute", width: "140px", height: "140px", borderRadius: "50%", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                background: cc ? `radial-gradient(circle, ${cc.primary}33 0%, transparent 70%)` : `radial-gradient(circle, ${c1}25 0%, transparent 70%)`,
                filter: 'blur(8px)',
              }}
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <AlbionCharacterSVG type={traderType.code} size={180} />
          </motion.div>
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: `linear-gradient(to right, transparent, var(--gold))` }} />
            <span className="text-xs" style={{ color: 'var(--gold)' }}>✦</span>
            <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: `linear-gradient(to left, transparent, var(--gold))` }} />
          </div>
          <h3 className="text-xl font-serif font-bold mb-1" style={{ color: '#E8E6E1', letterSpacing: '3px' }} data-testid="text-type-name">
            {traderType.name}
          </h3>
          <p className="text-xs font-tag tracking-widest mb-2" style={{ color: primaryColor }}>
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

        {/* T002: Personalized advancement based on weak dimensions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, ...ease }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--bg-1)', border: `1px solid ${primaryColor}20` }}
        >
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: 'var(--text-strong)' }}>
            <Target className="w-4 h-4" style={{ color: primaryColor }} />
            针对你的专属进阶方案
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            根据你的薄弱维度，我们为你定制了针对性提升路径
          </p>
          <div className="space-y-3">
            {weakDims.map((dim) => {
              const adv = dimAdvice[dim];
              return (
                <div
                  key={dim}
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{adv.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-strong)' }}>
                      {dimensionLabels[dim]}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(var(--info-rgb), 0.12)', color: 'var(--info)' }}>
                      需要提升
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>
                    {adv.text}
                  </p>
                  <a
                    href={adv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
                    style={{ color: primaryColor }}
                    data-testid={`link-advance-${dim.toLowerCase()}`}
                  >
                    前往{adv.resource}了解更多
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* T003: Live trading room card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, ...ease }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(56,189,248,0.06), var(--bg-1), rgba(56,189,248,0.03))',
            border: '1px solid rgba(56,189,248,0.15)',
            boxShadow: '0 0 30px rgba(56,189,248,0.06)',
          }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(56,189,248,0.06) 50%, transparent 60%)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.12)' }}>
                <Radio className="w-5 h-5" style={{ color: 'var(--info)' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
                  🎯 免费观摩职业交易员实盘操作
                </h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>
              每日实盘直播，观察 Ali 老师如何分析市场、管理仓位、执行交易。在真实行情中学习专业交易员的决策过程。
            </p>
            <div
              className="rounded-xl p-3.5 mb-4"
              style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}
            >
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--success)' }}>
                  <span className="font-bold">看不懂直播画面？没关系！</span>
                  <span style={{ color: 'var(--text)' }}>
                    添加助理即可免费一对一学习，从零开始带你看懂每一根 K 线和订单流。
                  </span>
                </p>
              </div>
            </div>
            <a
              href={BILIBILI_LIVE}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90"
              style={{ background: 'rgba(56,189,248,0.12)', color: 'var(--info)', border: '1px solid rgba(56,189,248,0.2)' }}
              data-testid="link-live-room"
              onClick={() => trackEvent("live_room_click", { page: "report" })}
            >
              <Radio className="w-4 h-4" />
              进入直播间
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </motion.div>

        {/* T004: Order flow + Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, ...ease }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <a
            href={ATAS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl p-5 transition-all duration-200 hover:opacity-90 group"
            style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
            data-testid="link-order-flow"
            onClick={() => trackEvent("order_flow_click", { page: "report" })}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <Wrench className="w-4.5 h-4.5" style={{ color: 'var(--success)' }} />
            </div>
            <h4 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-strong)' }}>
              ATAS 订单流工具
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              看清大资金动向，不再凭感觉入场。用机构级数据验证你的交易判断。
            </p>
            <span className="inline-flex items-center gap-1 text-xs mt-3 transition-all duration-200 group-hover:gap-2" style={{ color: 'var(--success)' }}>
              了解更多 <ChevronRight className="w-3 h-3" />
            </span>
          </a>
          <a
            href={CASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl p-5 transition-all duration-200 hover:opacity-90 group"
            style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
            data-testid="link-community"
            onClick={() => trackEvent("community_click", { page: "report" })}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(56,189,248,0.1)' }}>
              <Trophy className="w-4.5 h-4.5" style={{ color: 'var(--info)' }} />
            </div>
            <h4 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-strong)' }}>
              Deltapex 交易社区
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              和同类型交易员交流成长。真实学员案例展示，看他们如何一步步通过考核。
            </p>
            <span className="inline-flex items-center gap-1 text-xs mt-3 transition-all duration-200 group-hover:gap-2" style={{ color: 'var(--info)' }}>
              了解更多 <ChevronRight className="w-3 h-3" />
            </span>
          </a>
        </motion.div>

        {/* T005: Enhanced bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, ...ease }}
          className="rounded-2xl p-6 text-center"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-lg font-heading font-bold mb-2" style={{ color: 'var(--text-strong)' }}>
            开启你的交易进阶之路
          </h3>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            添加顾问，即刻获取以下全部资源
          </p>

          <div className="space-y-2 mb-4 text-left">
            {[
              "实盘直播间 — 每日免费观摩职业交易员操作",
              "订单流工具 — ATAS 机构级交易分析试用",
              "一对一助理辅导 — 免费从零学习看懂直播画面",
              "交易社区 — 和同类型交易员交流成长",
              "学员案例库 — 真实通过考核的业绩展示",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--success)' }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          <div
            className="rounded-lg px-3 py-2 mb-5 text-center"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}
          >
            <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
              以上资源均可免费体验
            </p>
          </div>

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

        <div className="text-center pt-2 pb-4 space-y-2">
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            报告内容随你的交易水平动态更新，每次测评都会生成最新分析
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Powered by Deltapex Trading Group
          </p>
        </div>
      </div>

      <VerifyCodeModal
        open={showVerifyCodeModal}
        onClose={() => setShowVerifyCodeModal(false)}
        verifyCode={verifyCode}
        onProceed={handleVerifyProceed}
      />

      <WeChatContactModal
        open={showWeChatModal}
        onClose={() => setShowWeChatModal(false)}
      />
    </div>
  );
}
