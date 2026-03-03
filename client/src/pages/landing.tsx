import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Brain, Zap, Target, Eye } from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate("/quiz");
    } else {
      navigate("/register");
    }
  };

  const dimensions = [
    { icon: Shield, label: "风险管理", color: "text-red-400" },
    { icon: Brain, label: "交易心理", color: "text-purple-400" },
    { icon: Target, label: "系统思维", color: "text-blue-400" },
    { icon: TrendingUp, label: "市场适应", color: "text-green-400" },
    { icon: Zap, label: "执行力", color: "text-yellow-400" },
    { icon: Eye, label: "大局观", color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500/5 blur-[80px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            已有 12,847 人完成测评
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight" data-testid="text-title">
            交易员
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              能力评测
            </span>
          </h1>

          <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs mx-auto" data-testid="text-subtitle">
            12道情境题，3分钟揭示你的交易基因
            <br />
            解锁专属交易员人格画像
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-sm mx-auto mb-10"
        >
          <div className="grid grid-cols-3 gap-3">
            {dimensions.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <d.icon className={`w-5 h-5 ${d.color}`} />
                <span className="text-[11px] text-white/50">{d.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-full max-w-sm mx-auto space-y-4"
        >
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
            data-testid="button-start"
          >
            开始测评
          </button>

          <div className="flex items-center justify-center gap-4 text-xs text-white/30">
            <span>12道题</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>约3分钟</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>免费</span>
          </div>

          {!user && (
            <p className="text-center text-xs text-white/30 mt-2">
              已有账号？
              <button
                className="text-blue-400 ml-1 underline underline-offset-2"
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
