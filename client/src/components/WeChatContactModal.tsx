import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone } from "lucide-react";
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
  const handleQRClick = useCallback(() => {
    window.location.href = WECHAT_CONTACT;
  }, []);

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
                添加专属顾问
              </h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                点击二维码可直接用电脑微信打开
              </p>
            </div>

            <div className="flex justify-center mb-2">
              <motion.button
                onClick={handleQRClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="p-4 rounded-xl cursor-pointer relative group"
                style={{ background: '#ffffff' }}
                data-testid="button-qr-click-wechat"
              >
                <QRCodeSVG
                  value={WECHAT_CONTACT}
                  size={180}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  style={{ background: 'rgba(7,193,96,0.12)' }}
                >
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: '#07C160', color: '#fff' }}>
                    点击打开微信
                  </span>
                </div>
              </motion.button>
            </div>

            <p className="text-[10px] text-center mb-4" style={{ color: 'var(--text-muted)' }}>
              点击二维码可直接用电脑微信打开
            </p>

            <div className="flex items-center gap-1.5 justify-center">
              <Smartphone className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                无法跳转？请用手机微信扫描上方二维码
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
