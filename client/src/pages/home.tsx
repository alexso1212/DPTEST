import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { LogOut, ChevronRight, RotateCcw, Gamepad2, FileText, Clock, ExternalLink, Building2, Radio, Wrench, Trophy } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { traderTypes, rankTiers, rarityMap } from "@/data/traderTypes";
import AlbionCharacterSVG from "@/components/AlbionCharacterSVG";
import RankBadge from "@/components/RankBadge";

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

  const cc = traderType?.cardColors ?? (traderType ? { primary: traderType.colors[0], secondary: traderType.colors[1], dark: '#0d0f14', glow: `${traderType.colors[0]}40` } : null);

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

        {quizLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          </div>
        ) : quizResult && traderType && rank ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.08 }}
              className="rounded-2xl mb-4 overflow-hidden relative"
              style={{
                background: `linear-gradient(170deg, ${cc.dark} 0%, #0d0f14 40%, ${cc.dark} 100%)`,
                border: `1px solid ${cc.glow}`,
                boxShadow: `0 0 25px ${cc.glow}`,
              }}
              data-testid="card-character-inline"
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 20%, ${cc.primary}18, transparent 70%)` }} />
              <div className="relative">
                <div className="flex justify-between items-center px-5 pt-4">
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: `${cc.primary}22`, padding: "3px 10px", borderRadius: "16px",
                    border: `1px solid ${cc.primary}44`,
                  }}>
                    <span style={{ fontSize: "12px" }}>{traderType.element.icon}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "10px", color: cc.secondary, letterSpacing: "1px" }}>
                      {traderType.element.name.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: `${cc.primary}18`, color: cc.primary, border: `1px solid ${cc.primary}30` }}>
                    已完成
                  </span>
                </div>

                <div className="flex justify-center pt-2 pb-0" style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", width: "150px", height: "150px", borderRadius: "50%", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    background: `radial-gradient(circle, ${cc.primary}33 0%, transparent 70%)`,
                  }} />
                  <AlbionCharacterSVG type={quizResult.traderTypeCode} size={220} />
                </div>

                <div className="flex items-center gap-2.5 justify-center pb-1">
                  <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, #C9A456, transparent)" }} />
                  <span style={{ color: "#C9A456", fontSize: "10px" }}>✦</span>
                  <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, #C9A456, transparent)" }} />
                </div>

                <div className="text-center px-5 pt-1">
                  <h2 className="font-serif font-bold" style={{ fontSize: "24px", color: "#E8E6E1", letterSpacing: "5px", margin: 0 }} data-testid="text-trader-type">
                    {traderType.name}
                  </h2>
                  <p className="font-tag tracking-widest mt-1" style={{ fontSize: "11px", color: cc.primary }}>
                    {traderType.subtitle}
                  </p>
                </div>

                {traderType.quote && (
                  <div className="text-center px-7 pt-3">
                    <p className="font-serif italic leading-relaxed" style={{ fontSize: "13px", color: "#C9A456" }}>
                      "{traderType.quote}"
                    </p>
                  </div>
                )}

                <div className="flex justify-center pt-4 pb-2">
                  <svg viewBox="0 0 200 200" style={{ width: "140px", height: "140px" }}>
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

                <div className="text-center pb-4">
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: "rgba(201,164,86,0.08)", padding: "6px 16px", borderRadius: "20px",
                    border: "1px solid rgba(201,164,86,0.2)",
                    fontSize: "12px", color: "#C9A456",
                  }}>
                    <RankBadge tier={rank} size="sm" />
                    {rank.name} · {quizResult.avgScore}/100
                  </span>
                </div>

                {traderType.storyHint && (
                  <div className="px-6 pb-5">
                    <p className="text-center italic leading-relaxed" style={{ fontSize: "11px", color: "#8B95A5", opacity: 0.5 }}>
                      {traderType.storyHint}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ease, delay: 0.14 }}
              className="flex gap-2 mb-3"
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
            </motion.div>

            {quizResult.shareToken && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...ease, delay: 0.18 }}
                className="mb-5"
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
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ease, delay: 0.08 }}
            className="rounded-2xl p-6 mb-4"
            style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
          >
            <div className="text-center py-4">
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
                开始测评
              </motion.button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ease, delay: 0.22 }}
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
    </div>
  );
}
