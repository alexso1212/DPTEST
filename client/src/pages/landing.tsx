import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendRegisterWebhook } from "@/utils/webhook";
import { queryClient } from "@/lib/queryClient";

const ease = { duration: 0.22, ease: "easeOut" as const };

export default function LandingPage() {
  const [, navigate] = useLocation();
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
  const [rememberMe, setRememberMe] = useState(true);

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
        body: JSON.stringify({ phone, password, rememberMe }),
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-0)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: 'var(--bg-0)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden gpu-accelerate">
        <div className="absolute inset-0 dp-grid opacity-100" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse, rgba(var(--primary-rgb), 0.06) 0%, transparent 70%)' }}
        />
        <div className="absolute top-[15%] left-[10%] w-[3px] h-16 rounded-sm animate-float-up will-change-transform" style={{ background: 'rgba(var(--success-rgb), 0.2)' }} />
        <div className="absolute top-[25%] right-[15%] w-[3px] h-12 rounded-sm animate-float-down will-change-transform" style={{ background: 'rgba(var(--danger-rgb), 0.2)', animationDelay: '1s' }} />
        <div className="absolute top-[55%] left-[20%] w-[2px] h-10 rounded-sm animate-float-up will-change-transform" style={{ background: 'rgba(var(--success-rgb), 0.15)', animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute top-[45%] right-[25%] w-[2.5px] h-14 rounded-sm animate-float-down will-change-transform" style={{ background: 'rgba(var(--danger-rgb), 0.15)', animationDelay: '0.5s', animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-12 pb-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ease}
          className="mb-4"
        >
          <div className="text-2xl font-heading font-bold tracking-widest" style={{ color: 'var(--primary)' }} data-testid="img-logo">
            DELTAPEX
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ease, delay: 0.08 }}
          className="text-center mb-6"
        >
          <h1
            className="text-2xl font-heading font-bold tracking-tight mb-2"
            style={{ color: 'var(--text-strong)' }}
            data-testid="text-title"
          >
            Deltapex Trading
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            交易能力评测 · 实战训练 · 专业社群
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ease, delay: 0.14 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
            <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setTab('login')}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200"
                style={{
                  background: tab === 'login' ? 'var(--primary)' : 'transparent',
                  color: tab === 'login' ? '#fff' : 'var(--text-muted)',
                }}
                data-testid="tab-login"
              >
                登录
              </button>
              <button
                onClick={() => setTab('register')}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200"
                style={{
                  background: tab === 'register' ? 'var(--primary)' : 'transparent',
                  color: tab === 'register' ? '#fff' : 'var(--text-muted)',
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
                transition={ease}
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Smartphone className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>手机号</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="请输入手机号"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onFocus={() => setPhoneFocused(true)}
                      onBlur={() => { setPhoneTouched(true); setPhoneFocused(false); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${phoneFocused ? 'var(--primary)' : phoneTouched && !phoneValid && phone.length > 0 ? 'var(--danger)' : 'var(--border)'}`,
                        color: 'var(--text-strong)',
                        boxShadow: phoneFocused ? '0 0 0 3px rgba(var(--primary-rgb), 0.15)' : 'none',
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
                      <Lock className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
                        className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${passwordFocused ? 'var(--primary)' : 'var(--border)'}`,
                          color: 'var(--text-strong)',
                          boxShadow: passwordFocused ? '0 0 0 3px rgba(var(--primary-rgb), 0.15)' : 'none',
                        }}
                        data-testid="input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-muted)' }}
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {tab === 'login' && (
                    <label
                      className="flex items-center gap-2 cursor-pointer select-none mt-1"
                      data-testid="label-remember-me"
                    >
                      <div
                        onClick={() => setRememberMe(!rememberMe)}
                        className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200 flex-shrink-0"
                        style={{
                          background: rememberMe ? 'var(--primary)' : 'transparent',
                          border: rememberMe ? '1px solid var(--primary)' : '1px solid var(--border)',
                        }}
                        data-testid="checkbox-remember-me"
                      >
                        {rememberMe && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>记住我（30天免登录）</span>
                    </label>
                  )}

                  <motion.button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    whileHover={canSubmit ? { scale: 1.02, y: -2 } : {}}
                    whileTap={canSubmit ? { scale: 0.98 } : {}}
                    className="w-full h-12 rounded-xl font-bold text-base mt-2 transition-all duration-200"
                    style={{
                      background: canSubmit ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.2)',
                      color: canSubmit ? '#fff' : 'rgba(var(--primary-rgb), 0.5)',
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
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-center max-w-xs mx-auto"
        >
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            注册即可免费获取交易能力测评<br />
            发现你的交易 DNA
          </p>
          <a
            href="https://deltapex.zeabur.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs transition-all duration-200 hover:underline"
            style={{ color: 'var(--text-muted)' }}
            data-testid="link-official-site"
          >
            访问 Deltapex 官网 →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
