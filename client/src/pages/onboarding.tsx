import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Zap, SkipForward } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 260, damping: 26 };

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-sm mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring }}
          className="mb-8"
        >
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }} data-testid="text-welcome">
            欢迎加入 Deltapex！
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            推荐你先完成一个 2 分钟的交易能力测评
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.15 }}
          className="rounded-2xl p-6 mb-6 text-left"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            完成测评，你将获得：
          </h3>
          <div className="space-y-3">
            {[
              { icon: "📊", text: "6维能力雷达图" },
              { icon: "🎴", text: "12种交易员人格匹配" },
              { icon: "🏆", text: "段位评定和排名" },
              { icon: "💡", text: "个性化提升建议" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
          className="space-y-3"
        >
          <motion.button
            onClick={() => navigate("/quiz")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full h-12 rounded-xl font-bold text-base text-black flex items-center justify-center gap-2 animate-breathe"
            style={{ background: 'var(--accent-gold)' }}
            data-testid="button-start-quiz"
          >
            <Zap className="w-4 h-4" />
            开始交易能力测评
          </motion.button>

          <motion.button
            onClick={() => navigate("/home")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            style={{ color: 'var(--text-secondary)' }}
            data-testid="button-skip"
          >
            <SkipForward className="w-3.5 h-3.5" />
            跳过，下次再说
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs mt-8 italic"
          style={{ color: 'var(--text-secondary)' }}
        >
          "这不是一个教你赚钱的测试。<br />
          这是一面镜子——让你看清自己卡在哪里。"
        </motion.p>
      </div>
    </div>
  );
}
