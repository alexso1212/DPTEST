import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterSVG from "./CharacterSVG";
import { traderTypes } from "@/data/traderTypes";

type CharState = "idle" | "swing" | "cast" | "sleep" | "waking" | "attack";

interface InteractiveCharacterProps {
  type: string;
  size: number;
  tier?: number;
  glowColor?: string;
}

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h >= 23 || h < 6;
}

function ZzzBubbles({ size }: { size: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ top: -10, right: size * 0.05, width: size * 0.5, height: size * 0.6 }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="absolute font-bold select-none"
          style={{
            fontSize: 10 + i * 4,
            color: 'var(--gold)',
            opacity: 0,
            right: i * 12,
            bottom: 10 + i * 14,
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -20 - i * 8],
            x: [0, 6 + i * 4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeOut",
          }}
        >
          Z
        </motion.span>
      ))}
    </div>
  );
}

function MagicParticles({ color, size }: { color: string; size: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = size * 0.45;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              background: color,
              boxShadow: `0 0 6px ${color}`,
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(angle) * radius, Math.cos(angle + 0.5) * radius * 1.2, 0],
              y: [0, Math.sin(angle) * radius, Math.sin(angle + 0.5) * radius * 1.2 - 20, 0],
              opacity: [0, 1, 0.8, 0],
              scale: [0.3, 1.2, 0.8, 0],
            }}
            transition={{
              duration: 1.8,
              delay: i * 0.08,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

function AngryEmote({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y - 30 }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.8], y: [0, -20, -25, -35] }}
      transition={{ duration: 1.2 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M5,5 L10,8 L10,5 L5,8" fill="#EF4444" stroke="#EF4444" strokeWidth="1.5" />
        <path d="M14,5 L19,8 L19,5 L14,8" fill="#EF4444" stroke="#EF4444" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

function EyeRubEffect() {
  return (
    <motion.div
      className="absolute pointer-events-none flex items-center justify-center"
      style={{ inset: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration: 1.5, times: [0, 0.1, 0.7, 1] }}
    >
      {[0, 1].map(i => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            background: 'var(--gold)',
            margin: '0 8px',
            boxShadow: '0 0 8px var(--gold)',
          }}
          animate={{
            scale: [1, 0.5, 1, 0.5, 1],
            opacity: [0.8, 0.3, 0.8, 0.3, 0.8],
          }}
          transition={{ duration: 0.8, repeat: 1 }}
        />
      ))}
    </motion.div>
  );
}

interface ElementConfig {
  name: string;
  colors: string[];
  symbol: string;
  trailCount: number;
}

const ELEMENT_MAP: Record<string, ElementConfig> = {
  '雷': { name: 'thunder', colors: ['#A855F7', '#E9D5FF', '#7C3AED', '#C084FC'], symbol: '⚡', trailCount: 5 },
  '火': { name: 'fire', colors: ['#FF6B35', '#FF4500', '#FF8C00', '#FFD700'], symbol: '🔥', trailCount: 12 },
  '冰': { name: 'ice', colors: ['#60A5FA', '#93C5FD', '#BFDBFE', '#3B82F6'], symbol: '❄', trailCount: 10 },
  '水': { name: 'water', colors: ['#3B82F6', '#60A5FA', '#2563EB', '#93C5FD'], symbol: '💧', trailCount: 8 },
  '地': { name: 'earth', colors: ['#D4A843', '#A0855B', '#8B7355', '#E8C76A'], symbol: '🪨', trailCount: 6 },
  '风': { name: 'wind', colors: ['#6EE7B7', '#34D399', '#A7F3D0', '#10B981'], symbol: '🌀', trailCount: 8 },
  '光': { name: 'light', colors: ['#FCD34D', '#FBBF24', '#F59E0B', '#FDE68A'], symbol: '✦', trailCount: 10 },
};

function ScreenShake({ intensity = 1 }: { intensity?: number }) {
  useEffect(() => {
    const el = document.documentElement;
    const prevTransform = el.style.transform;
    const prevTransition = el.style.transition;
    el.style.transition = 'none';
    let frame = 0;
    const totalFrames = 24;
    let rafId: number;

    const shake = () => {
      if (frame >= totalFrames) {
        el.style.transform = prevTransform;
        el.style.transition = prevTransition;
        return;
      }
      const decay = 1 - frame / totalFrames;
      const amp = 8 * intensity * decay;
      const x = (Math.random() - 0.5) * 2 * amp;
      const y = (Math.random() - 0.5) * 2 * amp;
      const r = (Math.random() - 0.5) * 2 * decay * intensity;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
      frame++;
      rafId = requestAnimationFrame(shake);
    };

    rafId = requestAnimationFrame(shake);

    try {
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 80, 30, 120, 50, 60]);
      }
    } catch {}

    return () => {
      cancelAnimationFrame(rafId);
      el.style.transform = prevTransform;
      el.style.transition = prevTransition;
    };
  }, [intensity]);

  return null;
}

function MagicAttackEffect({ element, size }: { element: ElementConfig; size: number }) {
  const projectiles = Array.from({ length: element.trailCount }).map((_, i) => {
    const angle = ((i / element.trailCount) * 360 + Math.random() * 30 - 15) * (Math.PI / 180);
    const startX = Math.cos(angle) * size * 0.2;
    const startY = Math.sin(angle) * size * 0.2 - size * 0.3;
    const speed = 0.6 + Math.random() * 0.4;
    const pSize = 6 + Math.random() * 10;

    return { angle, startX, startY, speed, size: pSize, color: element.colors[i % element.colors.length], delay: i * 0.04, id: i };
  });

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9998 }}>
      {projectiles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color}, transparent)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}80`,
            left: '50%',
            top: '40%',
          }}
          initial={{
            x: p.startX,
            y: p.startY,
            scale: 0.3,
            opacity: 0,
          }}
          animate={{
            x: [p.startX, p.startX * 0.5, (Math.random() - 0.5) * window.innerWidth * 0.8],
            y: [p.startY, p.startY - 30, window.innerHeight * 0.6],
            scale: [0.3, 1.8, 3 + Math.random() * 2],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.7 * p.speed,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: '40%',
          transform: 'translate(-50%, -50%)',
          width: 80,
          height: 80,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 4], opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${element.colors[0]}80 0%, transparent 70%)`,
            boxShadow: `0 0 40px ${element.colors[0]}, 0 0 80px ${element.colors[0]}60`,
          }}
        />
      </motion.div>

      {element.name === 'thunder' && <ThunderBolts color={element.colors[0]} />}
      {element.name === 'fire' && <FireExplosion colors={element.colors} />}
      {element.name === 'ice' && <IceShards colors={element.colors} />}
      {element.name === 'light' && <LightBurst colors={element.colors} />}
      {element.name === 'water' && <WaterWave colors={element.colors} />}
      {element.name === 'earth' && <EarthQuake colors={element.colors} />}
      {element.name === 'wind' && <WindSlash colors={element.colors} />}

      <ImpactFlash color={element.colors[0]} />
    </div>
  );
}

function ThunderBolts({ color }: { color: string }) {
  const bolts = Array.from({ length: 3 }).map((_, i) => {
    const x = 30 + Math.random() * 40;
    const segments: string[] = [];
    let cx = x, cy = 0;
    for (let s = 0; s < 6; s++) {
      const nx = cx + (Math.random() - 0.5) * 15;
      const ny = cy + 12 + Math.random() * 8;
      segments.push(`L${nx},${ny}`);
      cx = nx; cy = ny;
    }
    return { path: `M${x},0 ${segments.join(' ')}`, delay: i * 0.12, id: i };
  });

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.6, times: [0, 0.05, 0.4, 1] }}
    >
      {bolts.map(b => (
        <motion.path
          key={b.id}
          d={b.path}
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          filter="url(#bolt-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.3, delay: b.delay }}
        />
      ))}
      <defs>
        <filter id="bolt-glow">
          <feGaussianBlur stdDeviation="2" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
    </motion.svg>
  );
}

function FireExplosion({ colors }: { colors: string[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9997 }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 100 + Math.random() * 200;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%',
              top: '45%',
              width: 8 + Math.random() * 12,
              height: 16 + Math.random() * 20,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: `linear-gradient(to top, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]}80)`,
              boxShadow: `0 0 12px ${colors[i % colors.length]}`,
              transformOrigin: 'center bottom',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: (angle * 180) / Math.PI }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 50,
              scale: [0, 1.5, 0.5],
              opacity: [0, 1, 0],
              rotate: (angle * 180) / Math.PI + (Math.random() - 0.5) * 40,
            }}
            transition={{ duration: 0.8 + Math.random() * 0.3, delay: Math.random() * 0.15, ease: "easeOut" }}
          />
        );
      })}

      <motion.div
        className="absolute rounded-full"
        style={{
          left: '50%', top: '40%',
          width: 200, height: 200,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${colors[3]}50, ${colors[0]}30, transparent)`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 3, 5], opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function IceShards({ colors }: { colors: string[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9997 }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const dist = 80 + Math.random() * 180;
        const shardW = 4 + Math.random() * 6;
        const shardH = 20 + Math.random() * 30;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%', top: '42%',
              width: shardW,
              height: shardH,
              background: `linear-gradient(180deg, ${colors[i % colors.length]}CC, ${colors[(i + 1) % colors.length]}40)`,
              boxShadow: `0 0 8px ${colors[0]}80, inset 0 0 4px rgba(255,255,255,0.5)`,
              clipPath: 'polygon(50% 0%, 100% 70%, 50% 100%, 0% 70%)',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: (angle * 180) / Math.PI + 90 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: [0, 1.3, 1, 0],
              opacity: [0, 1, 0.9, 0],
              rotate: (angle * 180) / Math.PI + 90 + (Math.random() - 0.5) * 30,
            }}
            transition={{ duration: 0.9, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}

      <motion.div
        className="absolute rounded-full"
        style={{
          left: '50%', top: '42%',
          width: 160, height: 160,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(255,255,255,0.3), ${colors[0]}20, transparent)`,
          border: `2px solid ${colors[2]}40`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.5, 4], opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </div>
  );
}

function LightBurst({ colors }: { colors: string[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9997 }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%', top: '40%',
              width: 3,
              height: 120 + Math.random() * 80,
              background: `linear-gradient(180deg, ${colors[i % colors.length]}, transparent)`,
              boxShadow: `0 0 10px ${colors[0]}`,
              transformOrigin: 'top center',
              rotate: `${(angle * 180) / Math.PI}deg`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 0.8, 0], opacity: [0, 1, 0.7, 0] }}
            transition={{ duration: 0.8, delay: i * 0.02, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function WaterWave({ colors }: { colors: string[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9997 }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: '50%', top: '45%',
            width: 80, height: 80,
            transform: 'translate(-50%, -50%)',
            border: `3px solid ${colors[i % colors.length]}`,
            boxShadow: `0 0 20px ${colors[0]}60, inset 0 0 20px ${colors[0]}30`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 3 + i * 1.5, 5 + i * 2], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const dist = 80 + Math.random() * 150;
        return (
          <motion.div
            key={`drop-${i}`}
            className="absolute rounded-full"
            style={{
              left: '50%', top: '45%',
              width: 6 + Math.random() * 8,
              height: 10 + Math.random() * 14,
              background: `linear-gradient(180deg, ${colors[i % colors.length]}CC, ${colors[(i + 1) % colors.length]}40)`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              boxShadow: `0 0 6px ${colors[0]}80`,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 30,
              scale: [0, 1.2, 0.6],
              opacity: [0, 0.9, 0],
            }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function EarthQuake({ colors }: { colors: string[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9997 }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 60 + Math.random() * 160;
        const w = 15 + Math.random() * 25;
        const h = 15 + Math.random() * 25;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%', top: '50%',
              width: w, height: h,
              background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]}80)`,
              boxShadow: `0 0 8px ${colors[0]}60`,
              borderRadius: '2px',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: Math.random() * 360 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: [0, Math.sin(angle) * dist * 0.5, Math.sin(angle) * dist + 50],
              scale: [0, 1.3, 1, 0.5],
              opacity: [0, 1, 0.8, 0],
              rotate: Math.random() * 360 + 180,
            }}
            transition={{ duration: 1, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
      <motion.div
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '30vh',
          background: `linear-gradient(to top, ${colors[0]}30, transparent)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </div>
  );
}

function WindSlash({ colors }: { colors: string[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9997 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: '20%',
            top: `${25 + i * 12}%`,
            width: '60vw',
            height: 3,
            background: `linear-gradient(90deg, transparent, ${colors[i % colors.length]}CC, ${colors[(i + 1) % colors.length]}60, transparent)`,
            borderRadius: '50%',
            filter: `blur(${1 + i * 0.5}px)`,
          }}
          initial={{ x: -200, opacity: 0, scaleX: 0.3 }}
          animate={{
            x: ['-50vw', '100vw'],
            opacity: [0, 0.9, 0],
            scaleX: [0.3, 1.2, 0.5],
          }}
          transition={{ duration: 0.5 + i * 0.08, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`leaf-${i}`}
          className="absolute"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${20 + Math.random() * 50}%`,
            width: 4 + Math.random() * 4,
            height: 8 + Math.random() * 6,
            background: colors[i % colors.length],
            borderRadius: '50% 0 50% 0',
            boxShadow: `0 0 4px ${colors[0]}80`,
          }}
          initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            rotate: [0, 360 + Math.random() * 360],
            x: [0, 150 + Math.random() * 200],
            y: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function ImpactFlash({ color }: { color: string }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9996, background: `${color}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.25, 0] }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <motion.div
        className="fixed pointer-events-none"
        style={{
          zIndex: 9996,
          left: '50%', top: '50%',
          width: '120vmax', height: '120vmax',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}40 0%, ${color}15 30%, transparent 70%)`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 1.5], opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </>
  );
}

function MagicCircle({ color, size }: { color: string; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size * 1.2,
        height: size * 1.2,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
      animate={{ opacity: [0, 0.8, 0.9, 0], scale: [0.5, 1, 1.1, 1.3], rotate: [0, 180] }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <filter id="mc-glow">
            <feGaussianBlur stdDeviation="2" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>
        <circle cx="100" cy="100" r="90" stroke={color} strokeWidth="1" fill="none" opacity="0.6" filter="url(#mc-glow)" />
        <circle cx="100" cy="100" r="75" stroke={color} strokeWidth="0.5" fill="none" opacity="0.4" strokeDasharray="8 4" />
        <polygon points="100,15 175,145 25,145" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5" />
        <polygon points="100,185 25,55 175,55" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5" />
        {[0, 60, 120, 180, 240, 300].map(a => {
          const rad = (a * Math.PI) / 180;
          const x = 100 + Math.cos(rad) * 85;
          const y = 100 + Math.sin(rad) * 85;
          return <circle key={a} cx={x} cy={y} r="3" fill={color} opacity="0.7" />;
        })}
      </svg>
    </motion.div>
  );
}

function ScreenCrack() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.5, times: [0, 0.05, 0.7, 1] }}
    >
      <svg viewBox="0 0 400 800" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <filter id="crack-glow">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>
        <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" filter="url(#crack-glow)">
          <path d="M200,400 L180,350 L160,280 L140,200 L120,120 L100,40" />
          <path d="M200,400 L220,340 L250,260 L270,180 L300,80" />
          <path d="M200,400 L170,430 L130,480 L100,550 L80,640 L60,750" />
          <path d="M200,400 L240,450 L280,520 L310,600 L340,720" />
          <path d="M180,350 L140,340 L90,320" />
          <path d="M220,340 L260,330 L310,310" />
          <path d="M170,430 L130,420 L80,410" />
          <path d="M240,450 L280,460 L330,470" />
          <path d="M160,280 L120,270 L70,250" />
          <path d="M250,260 L290,250 L340,230" />
          <path d="M130,480 L90,500 L50,530" />
          <path d="M280,520 L320,540 L360,570" />
        </g>
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none">
          <path d="M140,200 L100,190 L50,170" />
          <path d="M270,180 L310,170 L360,150" />
          <path d="M100,550 L60,570 L20,600" />
          <path d="M310,600 L350,620 L390,650" />
        </g>
      </svg>
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(255,255,255,0.15)' }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.15 }}
      />
    </motion.div>
  );
}

export default function InteractiveCharacter({ type, size, tier = 0, glowColor = "#C9A45628" }: InteractiveCharacterProps) {
  const [state, setState] = useState<CharState>("idle");
  const [showCrack, setShowCrack] = useState(false);
  const [showAngry, setShowAngry] = useState(false);
  const [showEyeRub, setShowEyeRub] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const [showAttackFX, setShowAttackFX] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [showMagicCircle, setShowMagicCircle] = useState(false);

  const stateRef = useRef<CharState>("idle");
  const mountedRef = useRef(true);
  const pendingTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const traderType = traderTypes[type];
  const elementName = traderType?.element?.name || '光';
  const elementConfig = ELEMENT_MAP[elementName] || ELEMENT_MAP['光'];
  const primaryColor = traderType?.cardColors?.primary || traderType?.colors?.[0] || '#C9A456';

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      pendingTimers.current.delete(id);
      if (mountedRef.current) fn();
    }, ms);
    pendingTimers.current.add(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    pendingTimers.current.forEach(id => clearTimeout(id));
    pendingTimers.current.clear();
  }, []);

  const safeSetState = useCallback((s: CharState) => {
    if (!mountedRef.current) return;
    stateRef.current = s;
    setState(s);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const scheduleIdleAction = useCallback(() => {
    const delay = 6000 + Math.random() * 10000;
    safeTimeout(() => {
      if (stateRef.current !== "idle") return;
      const action = Math.random();
      if (action < 0.5) {
        safeSetState("swing");
        safeTimeout(() => {
          if (stateRef.current !== "swing") return;
          safeSetState("idle");
        }, 1800);
      } else {
        safeSetState("cast");
        setShowMagic(true);
        safeTimeout(() => setShowMagic(false), 1800);
        safeTimeout(() => {
          if (stateRef.current !== "cast") return;
          safeSetState("idle");
        }, 2200);
      }
    }, delay);
  }, [safeTimeout, safeSetState]);

  useEffect(() => {
    if (state === "idle") {
      if (isNightTime()) {
        safeTimeout(() => {
          if (stateRef.current === "idle") {
            safeSetState("sleep");
          }
        }, 5000);
      } else {
        scheduleIdleAction();
      }
    }
  }, [state, scheduleIdleAction, safeTimeout, safeSetState]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      const cur = stateRef.current;
      if (!isNightTime() && cur === "sleep") {
        safeSetState("idle");
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [safeSetState]);

  const triggerMagicAttack = useCallback(() => {
    clearAllTimers();
    safeSetState("cast");
    setShowMagicCircle(true);

    safeTimeout(() => {
      setShowMagicCircle(false);
      safeSetState("attack");
      setShowAttackFX(true);

      safeTimeout(() => {
        setShowShake(true);
        safeTimeout(() => setShowShake(false), 600);
      }, 300);

      safeTimeout(() => setShowAttackFX(false), 1500);

      safeTimeout(() => {
        if (stateRef.current !== "attack") return;
        safeSetState("idle");
      }, 2000);
    }, 800);
  }, [clearAllTimers, safeTimeout, safeSetState]);

  const handleClick = useCallback(() => {
    const cur = stateRef.current;

    if (cur === "sleep") {
      clearAllTimers();
      safeSetState("waking");
      setShowEyeRub(true);
      safeTimeout(() => setShowEyeRub(false), 1500);

      safeTimeout(() => {
        if (stateRef.current !== "waking") return;
        setShowAngry(true);
        safeTimeout(() => setShowAngry(false), 1200);

        safeTimeout(() => {
          triggerMagicAttack();
          safeTimeout(() => {
            setShowCrack(true);
            safeTimeout(() => setShowCrack(false), 2500);
          }, 500);
        }, 400);
      }, 1800);
      return;
    }

    if (cur === "idle") {
      triggerMagicAttack();
    }
  }, [clearAllTimers, safeTimeout, safeSetState, triggerMagicAttack]);

  const isSleeping = state === "sleep";
  const isCasting = state === "cast";
  const isAttacking = state === "attack";
  const isWaking = state === "waking";

  const characterVariants = {
    idle: {
      y: [0, -10, 0, -6, 2, 0],
      rotate: 0,
      scale: 1,
      x: 0,
    },
    swing: {
      y: [0, -4, 0],
      rotate: [0, -8, 12, -4, 0],
      scale: 1,
      x: 0,
    },
    cast: {
      y: [0, -20, -18],
      rotate: 0,
      scale: [1, 1.08, 1.12],
      x: 0,
    },
    sleep: {
      y: 20,
      rotate: -15,
      scale: 0.88,
      x: 0,
    },
    waking: {
      y: [20, 10, 3, 0],
      rotate: [-15, -8, -2, 0],
      scale: [0.88, 0.92, 0.96, 1],
      x: 0,
    },
    attack: {
      y: [0, -30, 15, 0],
      rotate: [0, -20, 25, 0],
      scale: [1, 1.25, 1.3, 1],
      x: [0, 0, 40, 0],
    },
  };

  const transitionMap: Record<CharState, object> = {
    idle: { duration: 5, repeat: Infinity, ease: "easeInOut" },
    swing: { duration: 0.8, ease: "easeInOut" },
    cast: { duration: 0.8, ease: "easeOut" },
    sleep: { duration: 1.5, ease: "easeInOut" },
    waking: { duration: 1.5, ease: "easeOut" },
    attack: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };

  const glowVariants = {
    idle: { opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.08, 0.95] },
    swing: { opacity: [0.5, 1.2, 0.5], scale: [0.95, 1.2, 0.95] },
    cast: { opacity: [0.5, 1.8, 2.2], scale: [0.95, 1.4, 1.8] },
    sleep: { opacity: 0.15, scale: 0.7 },
    waking: { opacity: [0.15, 0.5, 0.8], scale: [0.7, 0.9, 1] },
    attack: { opacity: [0.5, 2.5, 0.5], scale: [0.95, 2, 0.95] },
  };

  return (
    <>
      <div
        className="relative flex justify-center cursor-pointer select-none"
        style={{ width: size, height: size * 1.38 }}
        onClick={handleClick}
        data-testid="interactive-character"
      >
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${isCasting || isAttacking ? primaryColor + '60' : glowColor} 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          animate={glowVariants[state] || glowVariants.idle}
          transition={{
            duration: isSleeping ? 3 : isCasting ? 0.8 : 3.5,
            repeat: (state === "idle" || state === "sleep") ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        <AnimatePresence>
          {showMagicCircle && <MagicCircle color={primaryColor} size={size} />}
        </AnimatePresence>

        <motion.div
          style={{ transformOrigin: isSleeping || isWaking ? 'center center' : 'center bottom' }}
          animate={characterVariants[state] || characterVariants.idle}
          transition={transitionMap[state] || transitionMap.idle}
        >
          <motion.div
            style={{ transformOrigin: 'center bottom' }}
            animate={
              state === "idle"
                ? { scaleX: [1, 1.01, 1, 0.99, 1], scaleY: [1, 0.99, 1, 1.01, 1] }
                : state === "sleep"
                  ? { scaleX: [1, 1.02, 1], scaleY: [1, 0.98, 1] }
                  : {}
            }
            transition={{
              duration: isSleeping ? 2.5 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <CharacterSVG type={type} size={size} tier={tier} animated={state === "idle" || state === "swing"} />
          </motion.div>

          <AnimatePresence>
            {showEyeRub && <EyeRubEffect />}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {isSleeping && <ZzzBubbles size={size} />}
        </AnimatePresence>

        <AnimatePresence>
          {showMagic && <MagicParticles color={glowColor.slice(0, 7)} size={size} />}
        </AnimatePresence>

        <AnimatePresence>
          {showAngry && <AngryEmote x={size * 0.65} y={size * 0.15} />}
        </AnimatePresence>

        <motion.div
          className="absolute bottom-0 left-1/2 pointer-events-none"
          style={{
            width: isSleeping ? size * 0.6 : size * 0.5,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.3)',
            filter: 'blur(4px)',
            transform: 'translateX(-50%)',
          }}
          animate={
            isSleeping
              ? { scaleX: [1, 1.05, 1], opacity: 0.15 }
              : isAttacking
                ? { scaleX: [1, 0.3, 1.5, 1], opacity: [0.3, 0.05, 0.5, 0.3] }
                : { scaleX: [1, 0.85, 1, 0.9, 1], opacity: [0.3, 0.15, 0.3, 0.2, 0.3] }
          }
          transition={{
            duration: isSleeping ? 2.5 : isAttacking ? 0.6 : 5,
            repeat: (state === "idle" || state === "sleep") ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {(isSleeping || isWaking) && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              bottom: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: size * 0.7,
              height: 12,
              borderRadius: '50%',
              background: 'rgba(var(--gold-rgb), 0.08)',
              filter: 'blur(6px)',
            }}
            animate={{ opacity: isSleeping ? [0.3, 0.5, 0.3] : [0.5, 0] }}
            transition={{ duration: isSleeping ? 3 : 1.5, repeat: isSleeping ? Infinity : 0 }}
          />
        )}
      </div>

      <AnimatePresence>
        {showAttackFX && <MagicAttackEffect element={elementConfig} size={size} />}
      </AnimatePresence>

      {showShake && <ScreenShake intensity={1.5} />}

      <AnimatePresence>
        {showCrack && <ScreenCrack />}
      </AnimatePresence>
    </>
  );
}
