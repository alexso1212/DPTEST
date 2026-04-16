import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { LogOut, ChevronRight, RotateCcw, Gamepad2, FileText, Clock, ExternalLink, Building2, Radio, Wrench, Trophy, TrendingUp, TrendingDown, Minus, History, Camera } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { traderTypes, rankTiers, rarityMap } from "@/data/traderTypes";
import ShareCard from "@/components/ShareCard";
import type { QuizResult } from "@/utils/calculateResult";
import { type Dimension } from "@/data/questions";
import CharacterSVG from "@/components/character/CharacterSVG";
import InteractiveCharacter from "@/components/character/InteractiveCharacter";
import TierRoadmap from "@/components/character/TierRoadmap";
import RankBadge from "@/components/RankBadge";
import { usePageView, useTracking } from "@/hooks/use-tracking";

const ease = { duration: 0.22, ease: "easeOut" as const };

const UNLOCK_HOURS = 4;

const dimLabels = ["认知", "风控", "心理", "适应", "执行", "系统"];
const dimKeys = ["EDGE", "RISK", "MENTAL", "ADAPT", "EXEC", "SYSTEM"];

interface StoredQuizResult {
  id: number;
  traderTypeCode: string;
  avgScore: number;
  rankName: string;
  scores: Record<string, number>;
  shareToken: string;
  createdAt: string;
}

function useCountdown(targetTime: Date | null) {
  const [remaining, setRemaining] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!targetTime) return;

    function tick() {
      const diff = targetTime!.getTime() - Date.now();
      if (diff <= 0) {
        setUnlocked(true);
        setRemaining('');
        return;
      }
      setUnlocked(false);
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}小时${m}分${s}秒`);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  return { remaining, unlocked };
}

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { trackEvent } = useTracking();
  usePageView("home");

  const { data: quizResult, isLoading: quizLoading } = useQuery<StoredQuizResult | null>({
    queryKey: ["/api/quiz-result"],
    enabled: !!user,
    staleTime: 30000,
  });

  const { data: historyData } = useQuery<StoredQuizResult[]>({
    queryKey: ["/api/quiz-results/history"],
    enabled: !!user && !!quizResult,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const traderType = quizResult ? traderTypes[quizResult.traderTypeCode] : null;
  const rank = quizResult ? rankTiers.find(r => r.name === quizResult.rankName) : null;

  const unlockTime = quizResult?.createdAt
    ? new Date(new Date(quizResult.createdAt).getTime() + UNLOCK_HOURS * 3600000)
    : null;
  const { remaining: countdown, unlocked: reportUnlocked } = useCountdown(unlockTime);

  const [showShareModal, setShowShareModal] = useState(false);

  const shareResult = useMemo<QuizResult | null>(() => {
    if (!quizResult || !traderType || !rank) return null;
    const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'EDGE'];
    const sorted = [...dims].sort((a, b) => (quizResult.scores[b] ?? 0) - (quizResult.scores[a] ?? 0));
    return {
      rawScores: quizResult.scores as Record<Dimension, number>,
      normalizedScores: quizResult.scores as Record<Dimension, number>,
      traderType,
      rank,
      avgScore: quizResult.avgScore,
      rarity: rarityMap[quizResult.traderTypeCode] || '8%',
      top2: [sorted[0], sorted[1]] as [Dimension, Dimension],
    };
  }, [quizResult, traderType, rank]);

  const handleLogout = async () => {
    await apiRequest("POST", "/api/logout");
    await queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    navigate("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0F14' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const cc = traderType?.cardColors ?? (traderType ? { primary: traderType.colors[0], secondary: traderType.colors[1], dark: '#0d0f14', glow: `${traderType.colors[0]}40` } : null);

  const hasResult = !!(quizResult && traderType && rank && cc);

  const tierTarget = (user.tier ?? 0) < 1 ? 7 : (user.tier ?? 0) < 2 ? 21 : 60;
  const tierNextName = (user.tier ?? 0) < 1 ? '交易者' : (user.tier ?? 0) < 2 ? '精英' : '职业操盘手';
  const tierProgress = Math.min(100, ((user.loginDays ?? 0) / tierTarget) * 100);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: hasResult
          ? `linear-gradient(180deg, ${cc.dark} 0%, ${cc.dark}cc 25%, ${cc.dark}66 50%, #0d0f14 85%)`
          : '#0D0F14',
      }}
    >
      {hasResult && (
        <>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 90% 45% at 50% 18%, ${cc.primary}22, transparent 65%)`,
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 70% 40% at 25% 40%, ${cc.primary}0c, transparent 55%)`,
          }} />
        </>
      )}

      <div className="relative max-w-lg md:max-w-2xl mx-auto px-4 pt-3 pb-10">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ease}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-1.5">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>你好,</p>
            <p className="text-xs font-bold font-num" style={{ color: 'var(--text-strong)' }} data-testid="text-user-phone">
              {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </p>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            data-testid="button-logout"
          >
            <LogOut className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          </motion.button>
        </motion.div>

        {quizLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          </div>
        ) : hasResult ? (
          <>
            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.06 }}
              className="rounded-2xl overflow-hidden mb-3"
              style={{
                background: `linear-gradient(160deg, ${cc.dark} 0%, ${cc.primary}10 100%)`,
                border: `1px solid ${cc.primary}20`,
              }}
            >
              <div className="relative px-5 pt-5 pb-4">
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `radial-gradient(ellipse 80% 50% at 50% 25%, ${cc.primary}14, transparent 70%)`,
                }} />

                <div className="flex justify-center mb-1 relative">
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    background: `${cc.primary}15`, padding: "2px 10px", borderRadius: "12px",
                    border: `1px solid ${cc.primary}25`,
                  }}>
                    <span style={{ fontSize: "10px" }}>{traderType.element.icon}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: cc.secondary || cc.primary, letterSpacing: "1px" }}>
                      {traderType.element.name.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center relative" style={{ margin: '-6px 0 -10px' }}>
                  <InteractiveCharacter
                    type={quizResult.traderTypeCode}
                    size={190}
                    tier={user?.tier ?? 0}
                    glowColor={`${cc.primary}28`}
                  />
                </div>

                <div className="text-center relative">
                  <h2 className="font-serif font-bold" style={{ fontSize: "22px", color: "#E8E6E1", letterSpacing: "3px" }} data-testid="text-trader-type">
                    {traderType.name}
                  </h2>
                  <p className="font-tag tracking-widest" style={{ fontSize: "9px", color: cc.primary }}>
                    {traderType.subtitle}
                  </p>
                </div>

                <div className="flex justify-center mt-3 relative">
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: "rgba(201,164,86,0.08)", padding: "4px 14px", borderRadius: "16px",
                    border: "1px solid rgba(201,164,86,0.18)",
                    fontSize: "12px", color: "#C9A456",
                  }}>
                    <RankBadge tier={rank} size="sm" />
                    {rank.name} · {quizResult.avgScore}/100
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.12 }}
              className="grid grid-cols-3 gap-2 mb-3"
            >
              <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>综合分</p>
                <p className="font-num text-xl font-bold leading-tight" style={{ color: cc.primary }}>{quizResult.avgScore}</p>
              </div>
              <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>段位</p>
                <p className="text-sm font-bold leading-tight" style={{ color: 'var(--gold)' }}>{rank.name}</p>
              </div>
              <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>登录</p>
                <p className="font-num text-xl font-bold leading-tight" style={{ color: 'var(--text-strong)' }}>
                  {user.loginDays ?? 0}
                  <span className="text-[10px] font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>天</span>
                </p>
              </div>
            </motion.div>

            {/* Radar Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.18 }}
              className="rounded-2xl p-4 mb-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h3 className="text-xs font-semibold mb-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1 h-3.5 rounded-full" style={{ background: cc.primary }} />
                能力雷达
              </h3>
              <div className="flex justify-center">
                <svg viewBox="0 0 200 200" style={{ width: "195px", height: "195px" }}>
                  {[0.3, 0.6, 0.9].map((s, i) => {
                    const pts = [0,1,2,3,4,5].map(j => {
                      const a = (Math.PI*2*j)/6 - Math.PI/2;
                      return `${100+Math.cos(a)*55*s},${100+Math.sin(a)*55*s}`;
                    }).join(" ");
                    return <polygon key={i} points={pts} fill="none" stroke="#2a2a3a" strokeWidth="0.5"/>;
                  })}
                  {(() => {
                    const vals = dimKeys.map(k => (quizResult.scores[k] ?? 50) / 100);
                    const pts = vals.map((v, i) => {
                      const a = (Math.PI*2*i)/6 - Math.PI/2;
                      return `${100+Math.cos(a)*55*v},${100+Math.sin(a)*55*v}`;
                    }).join(" ");
                    return (
                      <>
                        <polygon points={pts} fill={`${cc.primary}33`} stroke={cc.primary} strokeWidth="1.5"/>
                        {vals.map((v, i) => {
                          const a = (Math.PI*2*i)/6 - Math.PI/2;
                          return <circle key={i} cx={100+Math.cos(a)*55*v} cy={100+Math.sin(a)*55*v} r="2.5" fill="#C9A456" stroke="#0D0F14" strokeWidth="1"/>;
                        })}
                      </>
                    );
                  })()}
                  {dimLabels.map((l, i) => {
                    const a = (Math.PI*2*i)/6 - Math.PI/2;
                    const val = quizResult.scores[dimKeys[i]] ?? 50;
                    return <text key={i} x={100+Math.cos(a)*75} y={100+Math.sin(a)*75} textAnchor="middle" dominantBaseline="middle" fill="#8B95A5" fontSize="9">{l} {val}</text>;
                  })}
                </svg>
              </div>
            </motion.div>

            {/* Tier Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.24 }}
              className="rounded-2xl p-4 mb-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <TierRoadmap type={quizResult.traderTypeCode} currentTier={user?.tier ?? 0} loginDays={user?.loginDays ?? 0} />
              {(user.tier ?? 0) < 3 && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      下一阶: {tierNextName} (登录{tierTarget}天)
                    </span>
                    <span className="text-[10px] font-num font-bold" style={{ color: 'var(--gold)' }}>
                      {user.loginDays ?? 0}/{tierTarget}天
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${tierProgress}%`,
                        background: 'linear-gradient(90deg, var(--gold), var(--gold-hover))',
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.3 }}
              className="flex gap-2 mb-2"
            >
              <motion.button
                onClick={() => {
                  const sorted = Object.entries(quizResult.scores).sort((a, b) => b[1] - a[1]);
                  sessionStorage.setItem('quiz_result', JSON.stringify({
                    rawScores: quizResult.scores,
                    normalizedScores: quizResult.scores,
                    traderType: traderType,
                    rank: rank,
                    avgScore: quizResult.avgScore,
                    rarity: rarityMap[quizResult.traderTypeCode] || '8%',
                    top2: [sorted[0][0], sorted[1][0]],
                  }));
                  navigate("/result");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200"
                style={{ background: `${cc.primary}18`, color: cc.primary, border: `1px solid ${cc.primary}25` }}
                data-testid="button-view-result"
              >
                查看详情
                <ChevronRight className="w-3 h-3" />
              </motion.button>
              <motion.button
                onClick={() => navigate("/quiz")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}
                data-testid="button-retake"
              >
                <RotateCcw className="w-3 h-3" />
                重新测评
              </motion.button>
              <motion.button
                onClick={() => setShowShareModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-2.5 px-3.5 rounded-xl text-xs font-medium flex items-center justify-center transition-all duration-200"
                style={{ border: '1px solid rgba(201,164,86,0.3)', color: 'var(--gold)', background: 'rgba(201,164,86,0.06)' }}
                data-testid="button-share-card-home"
              >
                <Camera className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>

            {/* Report CTA */}
            {quizResult.shareToken && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ease, delay: 0.34 }}
                className="mb-4"
              >
                {reportUnlocked ? (
                  <motion.button
                    onClick={() => navigate(`/report/${quizResult.shareToken}`)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white animate-breathe transition-all duration-200"
                    style={{ background: 'var(--primary)' }}
                    data-testid="button-view-report"
                  >
                    <FileText className="w-4 h-4" />
                    查看完整报告
                  </motion.button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-3.5 h-3.5" />
                    <span data-testid="text-countdown">{countdown} 后可查看完整报告</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Growth Timeline */}
            {historyData && historyData.length >= 2 && (
              <GrowthTimeline history={historyData} cc={cc} />
            )}

            {/* Feature Links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.4 }}
            >
              <div className="h-[1px] mb-5" style={{ background: `linear-gradient(90deg, transparent, ${cc.primary}20, transparent)` }} />
              <h3 className="text-xs font-semibold px-1 mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1 h-3.5 rounded-full" style={{ background: 'var(--text-muted)' }} />
                更多功能
              </h3>
              <FeatureLinks />
            </motion.div>
          </>
        ) : (
          <>
            {/* Empty state - no quiz result */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.08 }}
            >
              <div
                className="rounded-2xl overflow-hidden mb-6"
                style={{
                  background: 'linear-gradient(160deg, #0f1620 0%, rgba(230,57,70,0.06) 100%)',
                  border: '1px solid rgba(230,57,70,0.12)',
                }}
              >
                <div className="relative px-6 py-14 text-center">
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(230,57,70,0.08), transparent 70%)',
                  }} />
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center relative"
                    style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.18)' }}
                  >
                    <Gamepad2 className="w-7 h-7" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="text-lg font-bold mb-1.5 relative" style={{ color: 'var(--text-strong)' }}>
                    发现你的交易DNA
                  </h3>
                  <p className="text-xs mb-6 relative" style={{ color: 'var(--text-muted)' }}>
                    2分钟 · 12道实战情境题 · 生成专属交易画像
                  </p>
                  <motion.button
                    onClick={() => navigate("/quiz")}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full max-w-xs mx-auto h-12 rounded-xl font-bold text-sm text-white relative transition-all duration-200"
                    style={{ background: 'var(--primary)' }}
                    data-testid="button-start-quiz"
                  >
                    开始测评
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.16 }}
            >
              <h3 className="text-xs font-semibold px-1 mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1 h-3.5 rounded-full" style={{ background: 'var(--text-muted)' }} />
                更多功能
              </h3>
              <FeatureLinks />
            </motion.div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showShareModal && shareResult && (
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
              <ShareCard result={shareResult} tier={user?.tier ?? 0} />
              <motion.button
                onClick={() => setShowShareModal(false)}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-3 py-3 rounded-xl text-sm"
                style={{ color: 'var(--text-muted)' }}
                data-testid="button-close-share-home"
              >
                关闭
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function GrowthTimeline({ history, cc }: { history: StoredQuizResult[]; cc: { primary: string; secondary?: string; glow: string } }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const items = expanded ? history : history.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ease, delay: 0.38 }}
      className="mb-4"
    >
      <div className="h-[1px] mb-4" style={{ background: `linear-gradient(90deg, transparent, ${cc.primary}20, transparent)` }} />

      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl w-full"
        style={{
          background: open ? `${cc.primary}08` : 'rgba(255,255,255,0.02)',
          border: `1px solid ${open ? `${cc.primary}20` : 'rgba(255,255,255,0.06)'}`,
        }}
        data-testid="button-toggle-growth"
      >
        <History className="w-4 h-4" style={{ color: cc.primary }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>成长历程</span>
        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${cc.primary}12`, color: cc.primary, fontSize: '10px' }}>
          {history.length}次
        </span>
        <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${open ? 'rotate-90' : ''}`} style={{ color: 'var(--text-muted)' }} />
      </motion.button>

      {open && (<div className="mt-4">

      {history.length >= 3 && (
        <div className="mb-4 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3 h-3" style={{ color: cc.primary }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>综合分趋势</span>
          </div>
          <svg viewBox={`0 0 ${Math.max(120, (history.length - 1) * 40 + 40)} 40`} className="w-full" style={{ height: '40px' }}>
            {(() => {
              const reversed = [...history].reverse();
              const scores = reversed.map(h => h.avgScore);
              const min = Math.min(...scores) - 5;
              const max = Math.max(...scores) + 5;
              const range = max - min || 1;
              const w = Math.max(120, (reversed.length - 1) * 40 + 40);
              const points = scores.map((s, i) => ({
                x: 20 + (i / Math.max(1, reversed.length - 1)) * (w - 40),
                y: 35 - ((s - min) / range) * 30,
              }));
              const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
              return (
                <>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={cc.primary} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={cc.primary} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${pathD} L${points[points.length - 1].x},38 L${points[0].x},38 Z`}
                    fill="url(#trendGrad)"
                  />
                  <path d={pathD} fill="none" stroke={cc.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {points.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="3" fill={i === points.length - 1 ? cc.primary : '#0D0F14'} stroke={cc.primary} strokeWidth="1.5" />
                      <text x={p.x} y={p.y - 6} textAnchor="middle" fill={i === points.length - 1 ? cc.primary : '#8B95A5'} fontSize="7" fontWeight={i === points.length - 1 ? 'bold' : 'normal'}>
                        {scores[i]}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      )}

      <div className="relative pl-5">
        <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px]" style={{ background: `linear-gradient(180deg, ${cc.primary}40, ${cc.primary}08)` }} />

        {items.map((item, idx) => {
          const type = traderTypes[item.traderTypeCode];
          const itemRank = rankTiers.find(r => r.name === item.rankName);
          const prevItem = idx < history.length - 1 ? history[idx + 1] : null;
          const scoreDiff = prevItem ? item.avgScore - prevItem.avgScore : 0;
          const typeChanged = prevItem && prevItem.traderTypeCode !== item.traderTypeCode;
          const isLatest = idx === 0;
          const itemCc = type?.cardColors ?? { primary: type?.colors?.[0] || cc.primary };

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...ease, delay: 0.02 * idx }}
              className="relative mb-3 last:mb-0"
            >
              <div
                className="absolute -left-5 top-3 w-[15px] h-[15px] rounded-full flex items-center justify-center"
                style={{
                  background: isLatest ? itemCc.primary : '#0D0F14',
                  border: `2px solid ${isLatest ? itemCc.primary : `${itemCc.primary}50`}`,
                  boxShadow: isLatest ? `0 0 8px ${itemCc.primary}40` : 'none',
                }}
              >
                {isLatest && <div className="w-[5px] h-[5px] rounded-full bg-white" />}
              </div>

              <div
                className="rounded-xl p-3 transition-all duration-200"
                style={{
                  background: isLatest ? `${itemCc.primary}08` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isLatest ? `${itemCc.primary}20` : 'rgba(255,255,255,0.05)'}`,
                }}
                data-testid={`card-history-${item.id}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatRelativeDate(item.createdAt)}
                  </span>
                  {typeChanged && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(var(--gold-rgb),0.1)', color: 'var(--gold)', fontSize: '9px' }}>
                      类型转变
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {type && (
                    <div className="flex-shrink-0" style={{ opacity: isLatest ? 1 : 0.6 }}>
                      <CharacterSVG type={item.traderTypeCode} size={40} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-sm truncate" style={{ color: isLatest ? 'var(--text-strong)' : 'var(--text-muted)' }}>
                        {type?.name || item.traderTypeCode}
                      </span>
                      {itemRank && <RankBadge tier={itemRank} size="sm" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-num text-xs" style={{ color: isLatest ? itemCc.primary : 'var(--text-muted)' }}>
                        {item.avgScore}分
                      </span>
                      {prevItem && (
                        <span className="flex items-center gap-0.5 text-xs" style={{
                          color: scoreDiff > 0 ? 'var(--success)' : scoreDiff < 0 ? 'var(--danger)' : 'var(--text-muted)',
                          fontSize: '10px',
                        }}>
                          {scoreDiff > 0 ? <TrendingUp className="w-3 h-3" /> : scoreDiff < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                          {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff < 0 ? `${scoreDiff}` : '持平'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {history.length > 3 && (
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-3 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all duration-200"
          style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)' }}
          data-testid="button-toggle-history"
        >
          {expanded ? '收起' : `查看全部 ${history.length} 条记录`}
          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        </motion.button>
      )}
      </div>)}
    </motion.div>
  );
}

function FeatureLinks() {
  const items = [
    { icon: <Building2 className="w-4.5 h-4.5" />, title: "PropFirm", desc: "公司出资 · 你来操盘", color: 'var(--primary)', href: "https://deltapex.zeabur.app" },
    { icon: <Radio className="w-4.5 h-4.5" />, title: "交易直播间", desc: "实盘直播 & 交易日志", color: 'var(--info)', href: "https://live.bilibili.com/1874453448" },
    { icon: <Wrench className="w-4.5 h-4.5" />, title: "订单流工具", desc: "ATAS 分析工具", color: 'var(--success)', href: "https://atas.net/cn/?rs=partners_oft281860" },
    { icon: <Trophy className="w-4.5 h-4.5" />, title: "学员案例", desc: "真实业绩展示", color: 'var(--info)', href: "https://deltapex.zeabur.app/cases.html" },
    { icon: <Gamepad2 className="w-4.5 h-4.5" />, title: "交易模拟", desc: "即将上线", color: 'var(--text-muted)', href: null as string | null },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const inner = (
          <>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `color-mix(in srgb, ${item.color} 12%, transparent)`, color: item.color }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight truncate" style={{ color: 'var(--text-strong)' }}>{item.title}</p>
              <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          </>
        );

        const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' };

        return item.href ? (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-3 flex items-center gap-3 transition-all duration-200"
            style={cardStyle}
            data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {inner}
          </a>
        ) : (
          <div
            key={item.title}
            className="rounded-xl p-3 flex items-center gap-3 opacity-50"
            style={cardStyle}
            data-testid="card-coming-soon"
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
