import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Lock, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendRegisterWebhook } from "@/utils/webhook";
import { queryClient } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
  defaultTab?: 'login' | 'register';
}

export default function LoginModal({ open, onClose, onSuccess, title, subtitle, defaultTab = 'register' }: LoginModalProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        body: JSON.stringify({ phone, password, rememberMe: true }),
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
      }

      onSuccess();
    } catch {
      toast({ title: "网络错误，请重试", variant: "destructive" });
      setIsSubmitting(false);
    }
  }, [canSubmit, tab, phone, password, onSuccess, toast]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-50 flex ${isMobile ? 'items-end' : 'items-center'} justify-center`}
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={isMobile ? { y: '100%' } : { scale: 0.92, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full ${isMobile ? 'max-w-lg rounded-t-2xl' : 'max-w-md rounded-2xl mx-4'} p-6 pb-8 relative`}
            style={{ background: '#0F1620', border: '1px solid rgba(255,255,255,0.08)', borderBottom: isMobile ? 'none' : undefined }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)' }}
              data-testid="button-close-login-modal"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>

            <div className="text-center mb-5">
              <h3 className="text-base font-bold" style={{ color: 'var(--text-strong)' }}>
                {title || "登录以保存结果"}
              </h3>
              {subtitle && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
              )}
            </div>

            <div className="flex mb-5 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setTab('login')}
                className="flex-1 py-2 text-sm font-semibold rounded-xl transition-colors duration-200"
                style={{
                  background: tab === 'login' ? 'var(--primary)' : 'transparent',
                  color: tab === 'login' ? '#fff' : 'var(--text-muted)',
                }}
                data-testid="modal-tab-login"
              >
                登录
              </button>
              <button
                onClick={() => setTab('register')}
                className="flex-1 py-2 text-sm font-semibold rounded-xl transition-colors duration-200"
                style={{
                  background: tab === 'register' ? 'var(--primary)' : 'transparent',
                  color: tab === 'register' ? '#fff' : 'var(--text-muted)',
                }}
                data-testid="modal-tab-register"
              >
                注册
              </button>
            </div>

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
                  data-testid="modal-input-phone"
                />
                {phoneTouched && !phoneValid && phone.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>请输入正确的手机号</p>
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
                    data-testid="modal-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                onClick={handleSubmit}
                disabled={!canSubmit}
                whileHover={canSubmit ? { scale: 1.02 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                className="w-full h-12 rounded-xl font-bold text-base mt-1 transition-all duration-200"
                style={{
                  background: canSubmit ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.2)',
                  color: canSubmit ? '#fff' : 'rgba(var(--primary-rgb), 0.5)',
                }}
                data-testid="modal-button-submit"
              >
                {isSubmitting ? '处理中...' : tab === 'register' ? '注册' : '登录'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
