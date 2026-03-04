import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Smartphone, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendRegisterWebhook } from "@/utils/webhook";
import { queryClient } from "@/lib/queryClient";
import logoImg from "@assets/IMG_2951_1772566874804.jpeg";

const spring = { type: "spring" as const, stiffness: 260, damping: 26 };

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home");
    }
  }, [user, isLoading, navigate]);

  const phoneRegex = /^1[3-9]\d{9}$/;

  const handlePhoneChange = useCallback((val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    setPhone(digits);
    setPhoneValid(phoneRegex.test(digits));
  }, []);

  const canSubmit = phoneValid && (tab === 'login' ? password.length >= 1 : password.length >= 6) && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    try {
      const endpoint = tab === 'register' ? '/api/register' : '/api/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
        credentials: 'include',
      });

      if (res.status === 409 && tab === 'register') {
        toast({ title: "该手机号已注册，请直接登录", variant: "destructive" });
        setTab('login');
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.message || "操作失败", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/me"] });

      if (tab === 'register') {
        sendRegisterWebhook({ phone });
        navigate("/onboarding");
      } else {
        navigate("/home");
      }
    } catch {
      toast({ title: "网络错误，请重试", variant: "destructive" });
      setIsSubmitting(false);
    }
  }, [canSubmit, tab, phone, password, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

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

      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-12 pb-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0 }}
          className="mb-4"
        >
          <img src={logoImg} alt="Deltapex Trading Group" className="h-14 mx-auto object-contain" data-testid="img-logo" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1
            className="text-2xl font-extrabold tracking-tight mb-2"
            style={{ color: 'var(--text-primary)' }}
            data-testid="text-title"
          >
            Deltapex Trading
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            交易能力评测 · 实战训练 · 专业社群
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'rgba(var(--accent-blue-rgb), 0.05)', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setTab('login')}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                style={{
                  background: tab === 'login' ? 'var(--accent-gold)' : 'transparent',
                  color: tab === 'login' ? '#000' : 'var(--text-secondary)',
                }}
                data-testid="tab-login"
              >
                登录
              </button>
              <button
                onClick={() => setTab('register')}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                style={{
                  background: tab === 'register' ? 'var(--accent-gold)' : 'transparent',
                  color: tab === 'register' ? '#000' : 'var(--text-secondary)',
                }}
                data-testid="tab-register"
              >
                注册
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 'register' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === 'register' ? -20 : 20 }}
                transition={{ ...spring }}
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Smartphone className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>手机号</span>
                    </div>
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

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Lock className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {tab === 'register' ? '设置密码（至少6位）' : '密码'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={tab === 'register' ? '设置密码' : '请输入密码'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${passwordFocused ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                          color: 'var(--text-primary)',
                          boxShadow: passwordFocused ? '0 0 0 3px rgba(var(--accent-blue-rgb), 0.15)' : 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                        data-testid="input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-secondary)' }}
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    whileHover={canSubmit ? { scale: 1.02 } : {}}
                    whileTap={canSubmit ? { scale: 0.97 } : {}}
                    className="w-full h-12 rounded-xl font-bold text-base mt-2"
                    style={{
                      background: canSubmit ? 'var(--accent-gold)' : 'rgba(var(--accent-gold-rgb), 0.2)',
                      color: canSubmit ? '#000' : 'rgba(var(--accent-gold-rgb), 0.5)',
                    }}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? '处理中...' : tab === 'register' ? '注册' : '登录'}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-center max-w-xs mx-auto"
        >
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            注册即可免费获取交易能力测评<br />
            发现你的交易 DNA
          </p>
        </motion.div>
      </div>
    </div>
  );
}
