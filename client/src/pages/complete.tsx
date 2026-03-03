import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { SiWechat } from "react-icons/si";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export default function CompletePage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/register");
    }
  }, [user, isLoading, navigate]);

  const handleContactWeChat = () => {
    window.location.href = "https://work.weixin.qq.com/kfid/kfc3b42c637be3e4c33";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-primary/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold mb-2"
          data-testid="text-complete-title"
        >
          测评完成
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground mb-8"
          data-testid="text-complete-desc"
        >
          感谢您完成企业成长力测评！我们的专属顾问将会尽快与您联系。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-6">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">想要更快获取方案？</h3>
                  <p className="text-xs text-muted-foreground">添加企业微信，与顾问直接沟通</p>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full py-6 bg-[#07C160] text-white border-[#07C160]"
                onClick={handleContactWeChat}
                data-testid="button-wechat-contact"
              >
                <SiWechat className="w-5 h-5 mr-2" />
                添加企业微信顾问
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/60">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</div>
            <p className="text-sm text-left">专属顾问将在24小时内联系您</p>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/60">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
            <p className="text-sm text-left">基于测评结果定制精进方案</p>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/60">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</div>
            <p className="text-sm text-left">一对一沟通确认方案细节</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
