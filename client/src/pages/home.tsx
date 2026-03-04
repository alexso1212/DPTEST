import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronRight, RotateCcw, Gamepad2, FileText, Clock, ExternalLink, Building2, Radio, Wrench, Trophy, X } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { traderTypes, rankTiers, rarityMap } from "@/data/traderTypes";
import AlbionCharacterSVG from "@/components/AlbionCharacterSVG";
import CharacterCard from "@/components/CharacterCard";
import RankBadge from "@/components/RankBadge";

const ease = { duration: 0.22, ease: "easeOut" as const };

const UNLOCK_HOURS = 4;

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
  const [showCardPanel, setShowCardPanel] = useState(false);

  const { data: quizResult, isLoading: quizLoading } = useQuery<StoredQuizResult | null>({
    queryKey: ["/api/quiz-result"],
    enabled: !!user,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await apiRequest("POST", "/api/logout");
    await queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    navigate("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-0)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const traderType = quizResult ? traderTypes[quizResult.traderTypeCode] : null;
  const rank = quizResult ? rankTiers.find(r => r.name === quizResult.rankName) : null;

  const unlockTime = quizResult?.createdAt
    ? new Date(new Date(quizResult.createdAt).getTime() + UNLOCK_HOURS * 3600000)
    : null;
  const { remaining: countdown, unlocked: reportUnlocked } = useCountdown(unlockTime);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-0)' }}>
      <div className="max-w-lg mx-auto px-5 pt-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ease}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>你好，</p>
            <p className="text-lg font-bold font-num" style={{ color: 'var(--text-strong)' }} data-testid="text-user-phone">
              {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ease, delay: 0.08 }}
          className="rounded-2xl p-6 mb-4 relative overflow-hidden"
          style={{
            background: traderType?.cardColors ? `linear-gradient(170deg, ${traderType.cardColors.dark} 0%, #0d0f14 40%, ${traderType.cardColors.dark} 100%)` : traderType ? `linear-gradient(145deg, ${traderType.colors[0]}10, var(--bg-1), ${traderType.colors[0]}06)` : 'var(--bg-1)',
            border: traderType?.cardColors ? `1px solid ${traderType.cardColors.glow}` : traderType ? `1px solid ${traderType.colors[1]}25` : '1px solid var(--border)',
            boxShadow: traderType?.cardColors ? `0 0 20px ${traderType.cardColors.glow}` : traderType ? `0 0 20px ${traderType.colors[0]}08` : 'none',
          }}
        >
          {traderType && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 10%, ${traderType.cardColors?.primary || traderType.colors[0]}15, transparent 60%)` }} />}
          <div className="relative">
          {quizLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
            </div>
          ) : quizResult && traderType && rank ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>📊 交易能力测评</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${traderType.cardColors?.primary || traderType.colors[0]}20`, color: traderType.cardColors?.primary || traderType.colors[0] }}>
                  已完成
                </span>
              </div>

              <div
                className="flex items-center gap-4 mb-4 cursor-pointer"
                onClick={() => setShowCardPanel(true)}
                data-testid="button-open-home-card"
              >
                <div
                  className="flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    width: 90,
                    height: 90,
                    border: `2px solid ${traderType.cardColors?.glow || traderType.colors[0] + '40'}`,
                    boxShadow: `0 0 20px ${traderType.cardColors?.glow || traderType.colors[0] + '20'}`,
                    background: `radial-gradient(circle, ${traderType.cardColors?.dark || '#0d0f14'}, #0d0f14)`,
                  }}
                  data-testid="avatar-circle-home"
                >
                  <div style={{ clipPath: 'circle(50%)', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <AlbionCharacterSVG type={quizResult.traderTypeCode} size={100} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-tag" style={{ color: traderType.cardColors?.secondary || traderType.colors[1], opacity: 0.7 }}>
                      {traderType.element.icon} {traderType.element.name}
                    </span>
                  </div>
                  <p className="text-lg font-serif font-bold" style={{ color: '#E8E6E1', letterSpacing: '2px' }} data-testid="text-trader-type">
                    {traderType.name}
                  </p>
                  <p className="text-[11px] font-tag tracking-wider" style={{ color: traderType.cardColors?.primary || traderType.colors[1] }}>
                    {traderType.english || traderType.subtitle}
                  </p>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
                    点击查看完整角色卡 →
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <RankBadge tier={rank} size="sm" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-num" style={{ color: rank.color }}>
                    {rank.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-num font-bold" style={{ color: rank.color }}>
                    {quizResult.avgScore}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>

              <p className="text-xs font-serif italic mb-4 leading-relaxed" style={{ color: 'var(--gold)' }}>
                "{traderType.quote}"
              </p>

              <div className="flex gap-2">
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
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
                  style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
                  data-testid="button-view-result"
                >
                  查看详情
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  onClick={() => navigate("/quiz")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  data-testid="button-retake"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  重新测评
                </motion.button>
              </div>

              {quizResult.shareToken && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
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
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-strong)' }}>
                你还没有完成交易能力测评
              </h3>
              <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
                2分钟 · 12道实战情境题 · 发现你的交易DNA
              </p>
              <motion.button
                onClick={() => navigate("/quiz")}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-11 rounded-xl font-bold text-sm text-white transition-all duration-200"
                style={{ background: 'var(--primary)' }}
                data-testid="button-start-quiz"
              >
                开始测评 →
              </motion.button>
            </div>
          )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ease, delay: 0.16 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold px-1" style={{ color: 'var(--text-muted)' }}>更多功能</h3>

          {[
            { icon: <Building2 className="w-5 h-5" />, title: "自营交易实盘申请 PropFirm", desc: "公司出资 · 你来操盘 · 通过考核获实盘账号", color: 'var(--primary)', href: "https://deltapex.zeabur.app" },
            { icon: <Radio className="w-5 h-5" />, title: "职业交易直播间", desc: "实盘直播 & Ali交易日志", color: 'var(--info)', href: "https://deltapex.zeabur.app" },
            { icon: <Wrench className="w-5 h-5" />, title: "机构订单流交易工具", desc: "ATAS订单流 & EBC极速开户", color: 'var(--success)', href: "https://deltapex.zeabur.app" },
            { icon: <Trophy className="w-5 h-5" />, title: "学员案例", desc: "真实学员通过考核业绩展示", color: 'var(--info)', href: "https://deltapex.zeabur.app" },
            { icon: <Gamepad2 className="w-5 h-5" />, title: "交易模拟游戏", desc: "即将上线", color: 'var(--text-muted)', href: null },
          ].map((item) => {
            const content = (
              <>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `color-mix(in srgb, ${item.color} 15%, transparent)`, color: item.color }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
                {item.href ? (
                  <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                )}
              </>
            );

            return item.href ? (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-4 flex items-center gap-4 transition-all duration-200"
                style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
                data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {content}
              </a>
            ) : (
              <div
                key={item.title}
                className="rounded-xl p-4 flex items-center gap-4 opacity-60"
                style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
                data-testid="card-coming-soon"
              >
                {content}
              </div>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {showCardPanel && quizResult && traderType && rank && (
          <motion.div
            key="home-card-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowCardPanel(false)}
          >
            <motion.button
              onClick={() => setShowCardPanel(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center z-50"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.9 }}
              data-testid="button-close-home-card-panel"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.8, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ perspective: '1200px' }}
            >
              <CharacterCard
                typeCode={quizResult.traderTypeCode}
                scores={quizResult.scores}
                rank={{ name: rank.name, emoji: rank.icon, score: quizResult.avgScore }}
                showAnimation={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
