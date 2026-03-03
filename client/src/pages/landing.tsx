import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, TrendingUp, MessageSquare, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();

  const handleStart = () => {
    if (user) {
      if (user.hasSurvey) {
        navigate("/complete");
      } else {
        navigate("/survey");
      }
    } else {
      navigate("/register");
    }
  };

  const features = [
    {
      icon: ClipboardCheck,
      title: "精准画像",
      desc: "通过专业问卷深度了解您的业务需求",
    },
    {
      icon: TrendingUp,
      title: "定制方案",
      desc: "基于评估结果为您量身打造成长路径",
    },
    {
      icon: MessageSquare,
      title: "专属顾问",
      desc: "一对一企业微信专属服务快速响应",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-md mx-auto"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-8">
            <ClipboardCheck className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-3" data-testid="text-title">
            企业成长力测评
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-10" data-testid="text-subtitle">
            3分钟完成专业测评，获取专属精进方案
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 w-full max-w-md mx-auto space-y-4 mb-10"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-card/60 backdrop-blur-sm"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-0.5">{f.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10 w-full max-w-md mx-auto"
        >
          <Button
            size="lg"
            className="w-full text-base py-6"
            onClick={handleStart}
            disabled={isLoading}
            data-testid="button-start"
          >
            开始测评
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            已有账号？
            <button
              className="text-primary ml-1 underline underline-offset-2"
              onClick={() => navigate("/login")}
              data-testid="link-login"
            >
              直接登录
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
