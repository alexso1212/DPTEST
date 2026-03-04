import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Monitor, ExternalLink } from "lucide-react";
import { SiWechat } from "react-icons/si";
import { QRCodeSVG } from "qrcode.react";
import { useIsMobile } from "@/hooks/use-mobile";

const WECHAT_CONTACT = "https://work.weixin.qq.com/ca/cawcde75d99eb3fce4";

interface WeChatContactModalProps {
  open: boolean;
  onClose: () => void;
  onBeforeOpen?: () => void;
}

export function useWeChatContact(onBeforeOpen?: () => void) {
  const isMobile = useIsMobile();

  const handleContact = useCallback(() => {
    onBeforeOpen?.();
    if (isMobile) {
      window.open(WECHAT_CONTACT, "_blank");
      return true;
    }
    return false;
  }, [isMobile, onBeforeOpen]);

  return { isMobile, handleContact, WECHAT_CONTACT };
}

export default function WeChatContactModal({ open, onClose }: WeChatContactModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm rounded-2xl p-6 relative"
            style={{ background: '#0F1620', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)' }}
              data-testid="button-close-wechat-modal"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(7, 193, 96, 0.12)' }}>
                <SiWechat className="w-6 h-6" style={{ color: '#07C160' }} />
              </div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-strong)' }}>
                扫码添加专属顾问
              </h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                请使用手机微信扫描下方二维码
              </p>
            </div>

            <div className="flex justify-center mb-5">
              <div className="p-4 rounded-xl" style={{ background: '#ffffff' }}>
                <QRCodeSVG
                  value={WECHAT_CONTACT}
                  size={180}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center mb-4">
              <Monitor className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                电脑端推荐使用手机微信扫码
              </span>
            </div>

            <div className="flex gap-2">
              <motion.a
                href={WECHAT_CONTACT}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                data-testid="button-wechat-link"
              >
                <ExternalLink className="w-3 h-3" />
                尝试链接打开
              </motion.a>
            </div>
            <p className="text-[10px] text-center mt-2" style={{ color: 'rgba(148,163,184,0.6)' }}>
              链接方式在部分电脑上可能无法唤起微信
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
