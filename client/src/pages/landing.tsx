import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import logoImg from "@assets/IMG_2951_1772566874804.jpeg";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleStart = () => {
    if (user) {
      navigate("/quiz");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden gpu-accelerate">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(var(--accent-blue-rgb), 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-blue-rgb), 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-[15%] left-[10%] w-3 h-16 rounded-sm bg-[#00E676]/10 dark:bg-[#00E676]/15 animate-float-up will-change-transform" />
        <div className="absolute top-[25%] right-[15%] w-3 h-12 rounded-sm bg-[#FF5252]/10 dark:bg-[#FF5252]/15 animate-float-down will-change-transform" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[55%] left-[20%] w-2 h-10 rounded-sm bg-[#00E676]/8 dark:bg-[#00E676]/12 animate-float-up will-change-transform" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute top-[45%] right-[25%] w-2.5 h-14 rounded-sm bg-[#FF5252]/8 dark:bg-[#FF5252]/12 animate-float-down will-change-transform" style={{ animationDelay: '0.5s', animationDuration: '6s' }} />
        <div className="absolute top-[70%] left-[65%] w-2 h-8 rounded-sm bg-[#00E676]/6 dark:bg-[#00E676]/10 animate-float-up will-change-transform" style={{ animationDelay: '3s' }} />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          data-testid="button-theme-toggle"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />}
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="mb-8"
        >
          <img src={logoImg} alt="Deltapex Trading Group" className="h-10 mx-auto object-contain" data-testid="img-logo" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
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
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent-blue)' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent-blue)' }} />
            </span>
            2分钟测出你的交易段位
          </div>

          <h1
            className="text-[28px] font-extrabold tracking-tight mb-4 leading-tight"
            style={{ color: 'var(--text-primary)' }}
            data-testid="text-title"
          >
            你是什么类型的<br />交易员？
          </h1>

          <p className="text-sm leading-relaxed mb-6 max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }} data-testid="text-subtitle">
            12道情境题，解锁你的交易能力DNA
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>6维雷达图</span>
            <span style={{ color: 'var(--border-color)' }}>·</span>
            <span>12种人格</span>
            <span style={{ color: 'var(--border-color)' }}>·</span>
            <span>专属建议</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="w-full max-w-sm mx-auto space-y-4"
        >
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-[80%] mx-auto block h-12 rounded-xl font-bold text-base text-black active:scale-[0.97] transition-transform disabled:opacity-50 animate-breathe"
            style={{ background: 'var(--accent-gold)' }}
            data-testid="button-start"
          >
            开始测评 →
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}
          >
            已有 <span className="font-num" style={{ color: 'var(--accent-gold)' }}>12,847</span> 人完成测评
          </motion.div>

          {!user && (
            <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
              已有账号？
              <button
                className="ml-1 underline underline-offset-2"
                style={{ color: 'var(--accent-blue)' }}
                onClick={() => navigate("/login")}
                data-testid="link-login"
              >
                直接登录
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
