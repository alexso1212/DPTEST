import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendRegisterWebhook } from "@/utils/webhook";

interface AuthPageProps {
  onComplete: () => void;
}

export default function AuthPage({ onComplete }: AuthPageProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const phoneRegex = /^1[3-9]\d{9}$/;

  const handlePhoneChange = useCallback((val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    setPhone(digits);
    setPhoneValid(phoneRegex.test(digits));
  }, []);

  const canSubmit = phoneValid && password.length >= 6 && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      if (res.status === 409) {
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        });
        if (!loginRes.ok) {
          const data = await loginRes.json();
          toast({ title: data.message || "登录失败", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
      } else if (!res.ok) {
        const data = await res.json();
        toast({ title: data.message || "注册失败", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      sendRegisterWebhook({ phone });
      onComplete();
    } catch {
      toast({ title: "网络错误，请重试", variant: "destructive" });
      setIsSubmitting(false);
    }
  }, [canSubmit, phone, password, onComplete, toast]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--success)' }}
              >
                <Check className="w-4 h-4 text-black" />
              </motion.div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                你的交易员档案已生成
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              完成以下步骤查看你的测评结果
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
            className="rounded-2xl p-6 mb-4"
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${phoneValid && phoneTouched ? 'var(--success)' : 'var(--border-color)'}`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                保存你的交易员档案
              </span>
              {phoneValid && phoneTouched && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--success)' }}
                >
                  <Check className="w-3 h-3 text-black" />
                </motion.div>
              )}
            </div>

            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              📱 输入手机号，交易员档案将绑定到你的账户
            </p>

            <div className="space-y-3">
              <div>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => { setPhoneTouched(true); setPhoneFocused(false); }}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${phoneFocused ? 'var(--accent-blue)' : phoneTouched && !phoneValid && phone.length > 0 ? 'var(--danger)' : 'var(--border-color)'}`,
                    color: 'var(--text-primary)',
                    boxShadow: phoneFocused ? '0 0 0 3px rgba(var(--accent-blue-rgb), 0.15)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  data-testid="input-phone"
                />
                {phoneTouched && !phoneValid && phone.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs mt-1"
                    style={{ color: 'var(--danger)' }}
                  >
                    请输入正确的手机号
                  </motion.p>
                )}
              </div>

              <input
                type="password"
                placeholder="设置密码（至少6位）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${passwordFocused ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                  color: 'var(--text-primary)',
                  boxShadow: passwordFocused ? '0 0 0 3px rgba(var(--accent-blue-rgb), 0.15)' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                data-testid="input-password"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.4 }}
          >
            <motion.button
              onClick={handleSubmit}
              disabled={!canSubmit}
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.97 } : {}}
              className="w-full h-12 rounded-xl font-bold text-base"
              style={{
                background: canSubmit ? 'var(--accent-gold)' : 'rgba(var(--accent-gold-rgb), 0.2)',
                color: canSubmit ? '#000' : 'rgba(var(--accent-gold-rgb), 0.5)',
              }}
              data-testid="button-submit-auth"
            >
              {isSubmitting ? '处理中...' : canSubmit ? '查看我的测评结果 →' : '请先完成以上步骤'}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-1.5 mt-6"
          >
            <Lock className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              信息仅用于发送你的测评档案
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
