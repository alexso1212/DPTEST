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

function FloatButton({ isLive, open, wobble }: { isLive: boolean; open: boolean; wobble: any }) {
  const accentColor = isLive ? 'rgba(239,68,68,' : 'rgba(56,189,248,';
  const iconColor = isLive ? '#EF4444' : 'var(--info)';

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center justify-center rounded-xl relative cursor-grab active:cursor-grabbing select-none"
      style={{
        width: 44,
        height: 52,
        padding: '6px 4px',
        background: isLive
          ? (open ? 'rgba(239,68,68,0.2)' : 'linear-gradient(180deg, rgba(239,68,68,0.18), rgba(239,68,68,0.06))')
          : (open ? 'rgba(56,189,248,0.15)' : 'linear-gradient(180deg, rgba(56,189,248,0.12), rgba(56,189,248,0.04))'),
        border: `1px solid ${accentColor}${isLive ? '0.35)' : '0.2)'}`,
        boxShadow: isLive
          ? '0 4px 16px rgba(0,0,0,0.4), 0 0 12px rgba(239,68,68,0.15)'
          : '0 4px 16px rgba(0,0,0,0.4), 0 0 10px rgba(56,189,248,0.08)',
        rotate: wobble,
      }}
      data-testid="button-float-trigger"
    >
      {isLive ? (
        <>
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ border: `1.5px solid ${accentColor}0.4)` }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.15, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: `radial-gradient(circle at center, ${accentColor}0.08) 0%, transparent 70%)` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ background: `${accentColor}0.05)`, filter: 'blur(6px)' }}
          animate={{ opacity: open ? 0 : [0.3, 0.6, 0.3], scale: open ? 1 : [0.95, 1.08, 0.95] }}
          transition={{ duration: 3, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative flex flex-col items-center gap-0.5">
        {isLive ? (
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              rotate: [0, 8, -8, 0],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Radio className="w-4.5 h-4.5" style={{ color: iconColor }} />
          </motion.div>
        ) : (
          <Radio className="w-4 h-4" style={{ color: iconColor }} />
        )}

        {isLive ? (
          <motion.span
            className="font-bold tracking-wider leading-none"
            style={{ fontSize: '8px', color: '#EF4444' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            LIVE
          </motion.span>
        ) : (
          <span
            className="font-semibold leading-none text-center"
            style={{ fontSize: '8px', color: 'var(--text-strong)', lineHeight: '1.3' }}
          >
            直播间
          </span>
        )}
      </div>

      {isLive && (
        <motion.div
          className="absolute -top-1.5 -right-1.5 rounded-full"
          style={{
            width: 8,
            height: 8,
            background: '#EF4444',
            boxShadow: '0 0 6px rgba(239,68,68,0.6)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.5, 1],
            boxShadow: [
              '0 0 4px rgba(239,68,68,0.4)',
              '0 0 10px rgba(239,68,68,0.8)',
              '0 0 4px rgba(239,68,68,0.4)',
            ],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {!isLive && !open && (
        <motion.div
          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--success)' }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
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

  const accentColor = isLive ? 'rgba(239,68,68,' : 'rgba(56,189,248,';
  const liveColor = isLive ? '#EF4444' : 'var(--info)';

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
              {isLive && (
                <motion.div
                  className="flex items-center gap-1 rounded-full"
                  style={{ padding: '1px 6px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}
                  data-testid="badge-live-panel"
                >
                  <motion.div
                    className="rounded-full"
                    style={{ width: 5, height: 5, background: '#EF4444' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="font-bold uppercase tracking-wider" style={{ fontSize: '8px', color: '#EF4444' }}>LIVE</span>
                </motion.div>
              )}
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

  if (isMobile) {
    return (
      <motion.div
        ref={containerRef}
        className="fixed left-2 z-[90]"
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
              className="absolute bottom-0 left-[52px] w-[220px] rounded-2xl p-4 overflow-hidden"
              style={panelStyle}
            >
              {panelContent}
            </motion.div>
          )}
        </AnimatePresence>

        <div onClick={handleTap}>
          <FloatButton isLive={isLive} open={open} wobble={wobble} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="fixed left-4 z-[90]"
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
            className="absolute left-[52px] top-1/2 -translate-y-1/2 w-[240px] rounded-2xl p-5 overflow-hidden"
            style={panelStyle}
          >
            {panelContent}
          </motion.div>
        )}
      </AnimatePresence>

      <div onClick={handleTap}>
        <FloatButton isLive={isLive} open={open} wobble={wobble} />
      </div>
    </motion.div>
  );
}
