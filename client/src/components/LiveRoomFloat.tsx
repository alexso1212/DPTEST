import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, PanInfo } from "framer-motion";
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
  const isDragging = useRef(false);

  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 25, mass: 0.8 });

  const wobble = useTransform(springY, (v) => {
    const delta = v - y.get();
    return delta * 0.15;
  });

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

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    setTimeout(() => { isDragging.current = false; }, 50);

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const margin = isMobile ? 80 : 60;
    const maxY = viewH - margin - rect.height;
    const minY = margin - rect.top + info.point.y - rect.height / 2;

    if (rect.top < margin) {
      y.set(y.get() - (rect.top - margin));
    } else if (rect.bottom > viewH - margin) {
      y.set(y.get() - (rect.bottom - (viewH - margin)));
    }
  }, [y, isMobile]);

  const handleTap = useCallback(() => {
    if (!isDragging.current) {
      setOpen(o => !o);
    }
  }, []);

  if (!shouldShow(location)) return null;

  const handleLiveRoomClick = () => {
    trackEvent("live_room_click", { page: location, source: "float" });
  };

  const panelContent = (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(56,189,248,0.05) 50%, transparent 60%)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
      />
      <div className="relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          data-testid="button-close-float"
        >
          <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
        </button>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(56,189,248,0.1)' }}>
            <Radio className="w-4.5 h-4.5" style={{ color: 'var(--info)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-strong)' }}>
              职业操盘手<br />实盘直播间
            </p>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed mb-1.5" style={{ color: 'var(--text-muted)' }}>
          每日实盘直播 · 订单流实战 · Ali交易日志
        </p>
        <p className="text-[10px] mb-3" style={{ color: 'rgba(34,197,94,0.7)' }}>
          免费观摩 · 看不懂可跟助理免费学习
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
    </>
  );

  const panelStyle = {
    background: 'linear-gradient(160deg, #0F1620 0%, #0D0F14 50%, rgba(56,189,248,0.04) 100%)',
    border: '1px solid rgba(56,189,248,0.15)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(56,189,248,0.06)',
  };

  if (isMobile) {
    return (
      <motion.div
        ref={containerRef}
        className="fixed left-3 z-[90]"
        style={{ top: '45%', y: springY }}
        drag="y"
        dragConstraints={{ top: -200, bottom: 200 }}
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={handleDragEnd}
        data-testid="float-live-room"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="absolute bottom-0 left-[60px] w-[220px] rounded-2xl p-4 overflow-hidden"
              style={panelStyle}
            >
              {panelContent}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          onClick={handleTap}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 rounded-full pl-2.5 pr-3 py-2 relative cursor-grab active:cursor-grabbing select-none"
          style={{
            background: open ? 'rgba(56,189,248,0.15)' : 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(56,189,248,0.04))',
            border: '1px solid rgba(56,189,248,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(56,189,248,0.08)',
            rotate: wobble,
          }}
          data-testid="button-float-trigger"
        >
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'rgba(56,189,248,0.06)', filter: 'blur(8px)' }}
            animate={{ opacity: open ? 0 : [0.3, 0.6, 0.3], scale: open ? 1 : [0.95, 1.1, 0.95] }}
            transition={{ duration: 3, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex items-center gap-1.5">
            <Radio className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--info)' }} />
            <div className="text-[10px] font-semibold leading-[1.3] whitespace-nowrap" style={{ color: 'var(--text-strong)' }}>
              职业操盘手<br />直播间
            </div>
          </div>
          {!open && (
            <motion.div
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: 'var(--success)' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="fixed left-5 z-[90]"
      style={{ top: '40%', y: springY }}
      drag="y"
      dragConstraints={{ top: -250, bottom: 250 }}
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => { isDragging.current = true; }}
      onDragEnd={handleDragEnd}
      data-testid="float-live-room"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute left-[56px] top-1/2 -translate-y-1/2 w-[240px] rounded-2xl p-5 overflow-hidden"
            style={panelStyle}
          >
            {panelContent}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        onClick={handleTap}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2 rounded-full pl-3 pr-3.5 py-2.5 relative cursor-grab active:cursor-grabbing select-none group"
        style={{
          background: open ? 'rgba(56,189,248,0.15)' : 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(56,189,248,0.03))',
          border: '1px solid rgba(56,189,248,0.18)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 16px rgba(56,189,248,0.06)',
          rotate: wobble,
        }}
        data-testid="button-float-trigger"
      >
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'rgba(56,189,248,0.05)', filter: 'blur(10px)' }}
          animate={{ opacity: open ? 0 : [0.2, 0.5, 0.2], scale: open ? 1 : [0.9, 1.15, 0.9] }}
          transition={{ duration: 3.5, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
        />
        <Radio className="w-4.5 h-4.5 relative flex-shrink-0" style={{ color: 'var(--info)' }} />
        <div className="text-[11px] font-semibold leading-[1.3] relative" style={{ color: 'var(--text-strong)' }}>
          职业操盘手<br />直播间
        </div>
        {!open && (
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: 'var(--success)' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
