import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ExternalLink, X } from "lucide-react";
import { SiWechat } from "react-icons/si";

const WECHAT_CONTACT = "https://work.weixin.qq.com/ca/cawcde75d99eb3fce4";

interface VerifyCodeModalProps {
  open: boolean;
  onClose: () => void;
  verifyCode: string;
  onProceed: () => void;
}

export default function VerifyCodeModal({ open, onClose, verifyCode, onProceed }: VerifyCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(verifyCode);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = verifyCode;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm rounded-2xl p-6 relative overflow-hidden"
            style={{ background: '#0F1620', border: '1px solid rgba(201,164,86,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(201,164,86,0.04) 50%, transparent 60%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
              style={{ background: 'rgba(255,255,255,0.06)' }}
              data-testid="button-close-verify-modal"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>

            <div className="relative text-center mb-5">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(7,193,96,0.12)' }}>
                <SiWechat className="w-6 h-6" style={{ color: '#07C160' }} />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-strong)' }}>
                添加专属交易顾问
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                请复制验证码，添加顾问后发送给对方
              </p>
            </div>

            <div className="relative mb-4">
              <div
                className="py-4 px-5 rounded-xl text-center"
                style={{ background: 'rgba(201,164,86,0.06)', border: '1px solid rgba(201,164,86,0.15)' }}
              >
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  您的专属验证码
                </p>
                <p
                  className="text-xl font-bold tracking-wide"
                  style={{ color: '#C9A456' }}
                  data-testid="text-verify-code"
                >
                  {verifyCode}
                </p>
              </div>

              <motion.button
                onClick={copyCode}
                whileTap={{ scale: 0.95 }}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                data-testid="button-copy-code"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" style={{ color: '#07C160' }} />
                ) : (
                  <Copy className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                )}
              </motion.button>
            </div>

            <p className="text-[11px] leading-relaxed text-center mb-4" style={{ color: 'var(--text-muted)' }}>
              顾问将根据此验证码为您匹配测评报告，提供专属交易指导
            </p>

            <motion.a
              href={WECHAT_CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                copyCode();
                onProceed();
                setTimeout(() => onClose(), 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              style={{ background: '#07C160', color: '#fff' }}
              data-testid="button-copy-and-add"
            >
              <Copy className="w-3.5 h-3.5" />
              复制验证码并添加顾问
              <ExternalLink className="w-3 h-3 opacity-60" />
            </motion.a>

            {copied && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs mt-2"
                style={{ color: '#07C160' }}
              >
                验证码已复制到剪贴板
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
