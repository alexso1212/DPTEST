import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, ExternalLink, X } from "lucide-react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTracking } from "@/hooks/use-tracking";

const DELTAPEX_URL = "https://deltapex.zeabur.app";

function shouldShow(path: string): boolean {
  if (path === "/home" || path === "/result") return true;
  if (path.startsWith("/report/")) return true;
  return false;
}

export default function LiveRoomFloat() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { trackEvent } = useTracking();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  if (!shouldShow(location)) return null;

  const handleLiveRoomClick = () => {
    trackEvent("live_room_click", { page: location, source: "float" });
  };

  if (isMobile) {
    return (
      <div ref={containerRef} className="fixed bottom-20 right-4 z-[90]" data-testid="float-live-room">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-14 right-0 w-[220px] rounded-2xl p-4 overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #0F1620 0%, #0D0F14 50%, rgba(56,189,248,0.04) 100%)',
                border: '1px solid rgba(56,189,248,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(56,189,248,0.06)',
              }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(56,189,248,0.05) 50%, transparent 60%)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
              />
              <div className="relative">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                  data-testid="button-close-float"
                >
                  <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                </button>
                <div className="flex items-center gap-2 mb-2.5">
                  <Radio className="w-4 h-4" style={{ color: 'var(--info)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>实盘直播间</span>
                </div>
                <p className="text-[11px] leading-relaxed mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  每日实盘直播 · 订单流实战 · 免费观摩
                </p>
                <p className="text-[10px] mb-3" style={{ color: 'rgba(34,197,94,0.7)' }}>
                  看不懂可以跟助理免费学习
                </p>
                <a
                  href={DELTAPEX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveRoomClick}
                  className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ background: 'rgba(56,189,248,0.12)', color: 'var(--info)', border: '1px solid rgba(56,189,248,0.2)' }}
                  data-testid="link-float-live-room"
                >
                  进入直播间
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(o => !o)}
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 rounded-full flex items-center justify-center relative"
          style={{
            background: open ? 'rgba(56,189,248,0.15)' : 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(56,189,248,0.06))',
            border: '1px solid rgba(56,189,248,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(56,189,248,0.08)',
          }}
          data-testid="button-float-trigger"
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(56,189,248,0.08)', filter: 'blur(8px)' }}
            animate={{ opacity: open ? 0 : [0.3, 0.6, 0.3], scale: open ? 1 : [0.9, 1.15, 0.9] }}
            transition={{ duration: 3, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
          />
          <Radio className="w-5 h-5 relative" style={{ color: 'var(--info)' }} />
          {!open && (
            <motion.div
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--success)' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed right-5 top-1/2 -translate-y-1/2 z-[90]" data-testid="float-live-room">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-14 top-1/2 -translate-y-1/2 w-[240px] rounded-2xl p-5 overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #0F1620 0%, #0D0F14 50%, rgba(56,189,248,0.04) 100%)',
              border: '1px solid rgba(56,189,248,0.15)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 24px rgba(56,189,248,0.06)',
            }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(56,189,248,0.05) 50%, transparent 60%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
            />
            <div className="relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                data-testid="button-close-float"
              >
                <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
              </button>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.1)' }}>
                  <Radio className="w-4.5 h-4.5" style={{ color: 'var(--info)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>实盘直播间</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>LIVE TRADING</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-1.5" style={{ color: 'var(--text)' }}>
                每日实盘直播 · 订单流实战 · Ali交易日志
              </p>
              <p className="text-[11px] mb-4" style={{ color: 'rgba(34,197,94,0.7)' }}>
                免费观摩 · 看不懂可跟助理免费学习
              </p>
              <a
                href={DELTAPEX_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveRoomClick}
                className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 hover:opacity-90"
                style={{ background: 'rgba(56,189,248,0.12)', color: 'var(--info)', border: '1px solid rgba(56,189,248,0.2)' }}
                data-testid="link-float-live-room"
              >
                进入直播间
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-11 h-11 rounded-full flex items-center justify-center relative group"
        style={{
          background: open ? 'rgba(56,189,248,0.15)' : 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(56,189,248,0.04))',
          border: '1px solid rgba(56,189,248,0.18)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 16px rgba(56,189,248,0.06)',
        }}
        data-testid="button-float-trigger"
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(56,189,248,0.06)', filter: 'blur(10px)' }}
          animate={{ opacity: open ? 0 : [0.2, 0.5, 0.2], scale: open ? 1 : [0.9, 1.2, 0.9] }}
          transition={{ duration: 3.5, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
        />
        <Radio className="w-5 h-5 relative" style={{ color: 'var(--info)' }} />
        {!open && (
          <motion.div
            className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--success)' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
}
