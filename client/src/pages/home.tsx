import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut, ChevronRight, RotateCcw, Gamepad2, BookOpen, Users, FileText, Clock } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { traderTypes, rankTiers, rarityMap } from "@/data/traderTypes";

const spring = { type: "spring" as const, stiffness: 260, damping: 26 };

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
  const { theme, toggleTheme } = useTheme();

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-lg mx-auto px-5 pt-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>你好，</p>
            <p className="text-lg font-bold font-num" style={{ color: 'var(--text-primary)' }} data-testid="text-user-phone">
              {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              data-testid="button-theme-toggle"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />}
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="rounded-2xl p-6 mb-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          {quizLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-blue)', borderTopColor: 'transparent' }} />
            </div>
          ) : quizResult && traderType && rank ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>📊 交易能力测评</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(var(--accent-gold-rgb), 0.1)', color: 'var(--accent-gold)' }}>
                  已完成
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{traderType.icon}</div>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }} data-testid="text-trader-type">
                    {traderType.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {traderType.oneLiner}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{rank.icon}</span>
                  <span className="text-sm font-bold font-num" style={{ color: rank.color }}>
                    {rank.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-num font-bold" style={{ color: rank.color }}>
                    {quizResult.avgScore}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/100</span>
                </div>
              </div>

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
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                  style={{ background: 'rgba(var(--accent-blue-rgb), 0.1)', color: 'var(--accent-blue)' }}
                  data-testid="button-view-result"
                >
                  查看详情
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  onClick={() => navigate("/quiz")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                  data-testid="button-retake"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  重新测评
                </motion.button>
              </div>

              {quizResult.shareToken && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                  {reportUnlocked ? (
                    <motion.button
                      onClick={() => navigate(`/report/${quizResult.shareToken}`)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-black"
                      style={{ background: 'var(--accent-gold)' }}
                      data-testid="button-view-report"
                    >
                      <FileText className="w-4 h-4" />
                      查看完整报告
                    </motion.button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
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
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                你还没有完成交易能力测评
              </h3>
              <p className="text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>
                2分钟 · 12道实战情境题 · 发现你的交易DNA
              </p>
              <motion.button
                onClick={() => navigate("/quiz")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full h-11 rounded-xl font-bold text-sm text-black"
                style={{ background: 'var(--accent-gold)' }}
                data-testid="button-start-quiz"
              >
                开始测评 →
              </motion.button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold px-1" style={{ color: 'var(--text-secondary)' }}>更多功能</h3>

          {[
            { icon: <Gamepad2 className="w-5 h-5" />, title: "交易模拟游戏", desc: "即将上线", color: 'var(--accent-blue)' },
            { icon: <BookOpen className="w-5 h-5" />, title: "学习中心", desc: "即将上线", color: 'var(--accent-gold)' },
            { icon: <Users className="w-5 h-5" />, title: "交易社群", desc: "即将上线", color: 'var(--success)' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-4 flex items-center gap-4 opacity-60"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
