import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, PanInfo } from "framer-motion";
import { Radio, ExternalLink, X, Video, Calendar } from "lucide-react";
import { SiBilibili } from "react-icons/si";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTracking } from "@/hooks/use-tracking";

const BILIBILI_LIVE = "https://live.bilibili.com/1874453448";
const TENCENT_MEETING = "https://meeting.tencent.com/p/3621520297";

const SCHEDULE = [
  { day: "周一至周五", time: "10:00 - 12:00" },
  { day: "周一至周五", time: "14:00 - 16:00" },
  { day: "周一至周五", time: "20:00 - 22:00" },
];

function shouldShow(path: string): boolean {
  if (path === "/home" || path === "/result") return true;
  if (path.startsWith("/report/")) return true;
  return false;
}

function useLiveStatus() {
  const [isLive, setIsLive] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await fetch("/api/live-status");
        if (res.ok && mounted) {
          const data = await res.json();
          setIsLive(data.isLive);
          setTitle(data.title || "");
        }
      } catch {}
    };
    check();
    const interval = setInterval(check, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return { isLive, title };
}

function LiveBadge({ size = "normal" }: { size?: "normal" | "small" }) {
  const isSmall = size === "small";
  return (
    <motion.div
      className="flex items-center gap-1 rounded-full"
      style={{
        padding: isSmall ? '1px 6px' : '2px 8px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.4)',
      }}
      data-testid="badge-live"
    >
      <motion.div
        className="rounded-full"
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          background: '#EF4444',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [1, 0.6, 1],
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="font-bold uppercase tracking-wider"
        style={{
          fontSize: isSmall ? '8px' : '9px',
          color: '#EF4444',
          letterSpacing: '0.08em',
        }}
      >
        LIVE
      </span>
    </motion.div>
  );
}

function ScheduleSection() {
  return (
    <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Calendar className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>直播时间</span>
      </div>
      <div className="space-y-0.5">
        {SCHEDULE.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-[10px]">
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>{s.day}</span>
            <span style={{ color: 'rgba(56,189,248,0.7)' }}>{s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LiveRoomFloat() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { trackEvent } = useTracking();
  const { isLive, title } = useLiveStatus();
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

  const liveColor = isLive ? '#EF4444' : 'var(--info)';
  const accentColor = isLive ? 'rgba(239,68,68,' : 'rgba(56,189,248,';

  const panelContent = (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: isLive
          ? 'linear-gradient(105deg, transparent 40%, rgba(239,68,68,0.06) 50%, transparent 60%)'
          : 'linear-gradient(105deg, transparent 40%, rgba(56,189,248,0.05) 50%, transparent 60%)'
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: isLive ? 3 : 5, repeat: Infinity, ease: "easeInOut", repeatDelay: isLive ? 2 : 5 }}
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
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 relative" style={{ background: `${accentColor}0.1)` }}>
            {isLive ? (
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Radio className="w-4.5 h-4.5" style={{ color: liveColor }} />
              </motion.div>
            ) : (
              <Radio className="w-4.5 h-4.5" style={{ color: liveColor }} />
            )}
            {isLive && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ border: `1px solid ${accentColor}0.4)` }}
                animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-strong)' }}>
                职业操盘手
              </p>
              {isLive && <LiveBadge size="small" />}
            </div>
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-strong)' }}>
              实盘直播间
            </p>
          </div>
        </div>

        {isLive && title && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 px-2 py-1.5 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <p className="text-[10px] font-medium" style={{ color: '#EF4444' }}>
              正在直播：{title}
            </p>
          </motion.div>
        )}

        {isLive ? (
          <p className="text-[11px] leading-relaxed mb-1.5" style={{ color: '#EF4444' }}>
            正在直播中，点击立即观看
          </p>
        ) : (
          <p className="text-[11px] leading-relaxed mb-1.5" style={{ color: 'var(--text-muted)' }}>
            每日实盘直播 · 订单流实战 · Ali交易日志
          </p>
        )}
        <p className="text-[10px] mb-3" style={{ color: 'rgba(34,197,94,0.7)' }}>
          免费观摩 · 看不懂可跟助理免费学习
        </p>
        <div className="space-y-1.5">
          <a
            href={BILIBILI_LIVE}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("live_room_click", { page: location, source: "bilibili" })}
            className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 relative overflow-hidden"
            style={{
              background: isLive ? 'rgba(239,68,68,0.15)' : 'rgba(56,189,248,0.12)',
              color: isLive ? '#EF4444' : 'var(--info)',
              border: `1px solid ${isLive ? 'rgba(239,68,68,0.3)' : 'rgba(56,189,248,0.2)'}`,
            }}
            data-testid="link-float-bilibili"
          >
            {isLive && (
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.1), transparent)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
            <SiBilibili className="w-3.5 h-3.5 relative" />
            <span className="relative">{isLive ? "正在直播 - 立即观看" : "B站直播间"}</span>
            <ExternalLink className="w-3 h-3 opacity-60 relative" />
          </a>
          <a
            href={TENCENT_MEETING}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("live_room_click", { page: location, source: "tencent_meeting" })}
            className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
            style={{ background: 'rgba(34,197,94,0.08)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.2)' }}
            data-testid="link-float-tencent-meeting"
          >
            <Video className="w-3.5 h-3.5" />
            腾讯会议
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {!isLive && <ScheduleSection />}
      </div>
    </>
  );

  const panelStyle = {
    background: isLive
      ? 'linear-gradient(160deg, #1a0f0f 0%, #0D0F14 50%, rgba(239,68,68,0.06) 100%)'
      : 'linear-gradient(160deg, #0F1620 0%, #0D0F14 50%, rgba(56,189,248,0.04) 100%)',
    border: `1px solid ${isLive ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.15)'}`,
    boxShadow: isLive
      ? '0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(239,68,68,0.1)'
      : '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(56,189,248,0.06)',
  };

  const buttonBg = isLive
    ? (open ? 'rgba(239,68,68,0.2)' : 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.06))')
    : (open ? 'rgba(56,189,248,0.15)' : 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(56,189,248,0.04))');

  const buttonBorder = isLive ? 'rgba(239,68,68,0.3)' : 'rgba(56,189,248,0.2)';

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
            background: buttonBg,
            border: `1px solid ${buttonBorder}`,
            boxShadow: isLive
              ? '0 4px 20px rgba(0,0,0,0.4), 0 0 16px rgba(239,68,68,0.15)'
              : '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(56,189,248,0.08)',
            rotate: wobble,
          }}
          data-testid="button-float-trigger"
        >
          {isLive ? (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(239,68,68,0.3)' }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'rgba(56,189,248,0.06)', filter: 'blur(8px)' }}
              animate={{ opacity: open ? 0 : [0.3, 0.6, 0.3], scale: open ? 1 : [0.95, 1.1, 0.95] }}
              transition={{ duration: 3, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
            />
          )}
          <div className="relative flex items-center gap-1.5">
            {isLive ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Radio className="w-4 h-4 flex-shrink-0" style={{ color: '#EF4444' }} />
              </motion.div>
            ) : (
              <Radio className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--info)' }} />
            )}
            <div className="text-[10px] font-semibold leading-[1.3] whitespace-nowrap" style={{ color: 'var(--text-strong)' }}>
              {isLive ? (
                <>
                  <span style={{ color: '#EF4444' }}>LIVE</span>
                  <br />直播中
                </>
              ) : (
                <>职业操盘手<br />直播间</>
              )}
            </div>
          </div>
          {isLive ? (
            <motion.div
              className="absolute -top-1 -right-1"
            >
              <LiveBadge size="small" />
            </motion.div>
          ) : !open ? (
            <motion.div
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: 'var(--success)' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ) : null}
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
          background: buttonBg,
          border: `1px solid ${buttonBorder}`,
          boxShadow: isLive
            ? '0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(239,68,68,0.12)'
            : '0 4px 24px rgba(0,0,0,0.4), 0 0 16px rgba(56,189,248,0.06)',
          rotate: wobble,
        }}
        data-testid="button-float-trigger"
      >
        {isLive ? (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(239,68,68,0.3)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'rgba(56,189,248,0.05)', filter: 'blur(10px)' }}
            animate={{ opacity: open ? 0 : [0.2, 0.5, 0.2], scale: open ? 1 : [0.9, 1.15, 0.9] }}
            transition={{ duration: 3.5, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
          />
        )}
        {isLive ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <Radio className="w-4.5 h-4.5 relative flex-shrink-0" style={{ color: '#EF4444' }} />
          </motion.div>
        ) : (
          <Radio className="w-4.5 h-4.5 relative flex-shrink-0" style={{ color: 'var(--info)' }} />
        )}
        <div className="text-[11px] font-semibold leading-[1.3] relative" style={{ color: 'var(--text-strong)' }}>
          {isLive ? (
            <>
              <span style={{ color: '#EF4444' }}>LIVE</span>
              <br />直播中
            </>
          ) : (
            <>职业操盘手<br />直播间</>
          )}
        </div>
        {isLive ? (
          <motion.div className="absolute -top-1 -right-1">
            <LiveBadge size="small" />
          </motion.div>
        ) : !open ? (
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: 'var(--success)' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
}
