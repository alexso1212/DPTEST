import { useLocation } from "wouter";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import CountUp from "@/components/CountUp";
import logoImg from "@assets/IMG_2951_1772566874804.jpeg";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden gpu-accelerate">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(var(--accent-blue-rgb), 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-blue-rgb), 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-[15%] left-[10%] w-3 h-16 rounded-sm bg-[#00E676]/15 dark:bg-[#00E676]/20 animate-float-up will-change-transform" />
        <div className="absolute top-[25%] right-[15%] w-3 h-12 rounded-sm bg-[#FF5252]/15 dark:bg-[#FF5252]/20 animate-float-down will-change-transform" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[55%] left-[20%] w-2 h-10 rounded-sm bg-[#00E676]/10 dark:bg-[#00E676]/15 animate-float-up will-change-transform" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute top-[45%] right-[25%] w-2.5 h-14 rounded-sm bg-[#FF5252]/10 dark:bg-[#FF5252]/15 animate-float-down will-change-transform" style={{ animationDelay: '0.5s', animationDuration: '6s' }} />
        <div className="absolute top-[70%] left-[65%] w-2 h-8 rounded-sm bg-[#00E676]/8 dark:bg-[#00E676]/12 animate-float-up will-change-transform" style={{ animationDelay: '3s' }} />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          data-testid="button-theme-toggle"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />}
        </motion.button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0 }}
          className="mb-8"
        >
          <img src={logoImg} alt="Deltapex Trading Group" className="h-14 mx-auto object-contain" data-testid="img-logo" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
          className="text-center max-w-md mx-auto"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8"
            style={{
              background: 'rgba(var(--accent-blue-rgb), 0.08)',
              border: '1px solid rgba(var(--accent-blue-rgb), 0.15)',
              color: 'var(--accent-blue)',
            }}
          >
            <span>⚡</span>
            2分钟 · 12道实战情境题
          </div>

          <h1
            className="text-[28px] font-extrabold tracking-tight mb-4 leading-tight"
            style={{ color: 'var(--text-primary)' }}
            data-testid="text-title"
          >
            你是什么类型的<br />交易员？
          </h1>

          <p className="text-sm leading-relaxed mb-6 max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }} data-testid="text-subtitle">
            测出你的交易能力DNA
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>📊 6维能力雷达</span>
            <span style={{ color: 'var(--border-color)' }}>·</span>
            <span>🎴 12种交易员人格</span>
            <span style={{ color: 'var(--border-color)' }}>·</span>
            <span>🏆 段位评定</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.35 }}
          className="w-full max-w-sm mx-auto space-y-4"
        >
          <motion.button
            onClick={() => navigate("/quiz")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-[80%] mx-auto block h-12 rounded-xl font-bold text-base text-black animate-breathe"
            style={{ background: 'var(--accent-gold)' }}
            data-testid="button-start"
          >
            开始测评 →
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}
          >
            已有 <span className="font-num" style={{ color: 'var(--accent-gold)' }}>
              <CountUp end={23847} duration={2000} />
            </span> 位交易员完成测评
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-center max-w-xs mx-auto"
        >
          <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            "这不是一个教你赚钱的测试。<br />
            这是一面镜子——让你看清自己卡在哪里。"
          </p>
        </motion.div>
      </div>
    </div>
  );
}
