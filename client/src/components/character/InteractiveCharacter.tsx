import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterSVG from "./CharacterSVG";

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

export default function InteractiveCharacter({ type, size, tier = 0, glowColor = "#C9A45628" }: InteractiveCharacterProps) {
  const [state, setState] = useState<CharState>("idle");
  const [showCrack, setShowCrack] = useState(false);
  const [showAngry, setShowAngry] = useState(false);
  const [showEyeRub, setShowEyeRub] = useState(false);
  const [showMagic, setShowMagic] = useState(false);

  const stateRef = useRef<CharState>("idle");
  const mountedRef = useRef(true);
  const pendingTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

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

  const handleClick = useCallback(() => {
    const cur = stateRef.current;

    if (cur === "sleep") {
      clearAllTimers();
      safeSetState("waking");
      setShowEyeRub(true);
      safeTimeout(() => setShowEyeRub(false), 1500);

      safeTimeout(() => {
        if (stateRef.current !== "waking") return;
        safeSetState("attack");
        setShowAngry(true);
        safeTimeout(() => setShowAngry(false), 1200);

        safeTimeout(() => {
          setShowCrack(true);
          safeTimeout(() => setShowCrack(false), 2500);
        }, 600);

        safeTimeout(() => {
          if (stateRef.current !== "attack") return;
          safeSetState("idle");
        }, 3000);
      }, 1800);
      return;
    }

    if (cur === "idle") {
      clearAllTimers();
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
    }
  }, [clearAllTimers, safeTimeout, safeSetState]);

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
      y: [0, -15, -12, 0],
      rotate: 0,
      scale: [1, 1.05, 1.08, 1],
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
      y: [0, -20, 10, 0],
      rotate: [0, -15, 20, 0],
      scale: [1, 1.15, 1.2, 1],
      x: [0, 0, 30, 0],
    },
  };

  const transitionMap: Record<CharState, object> = {
    idle: { duration: 5, repeat: Infinity, ease: "easeInOut" },
    swing: { duration: 0.8, ease: "easeInOut" },
    cast: { duration: 1.2, ease: "easeOut" },
    sleep: { duration: 1.5, ease: "easeInOut" },
    waking: { duration: 1.5, ease: "easeOut" },
    attack: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  };

  const glowVariants = {
    idle: { opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.08, 0.95] },
    swing: { opacity: [0.5, 1.2, 0.5], scale: [0.95, 1.2, 0.95] },
    cast: { opacity: [0.5, 1.5, 1.8, 0.5], scale: [0.95, 1.3, 1.5, 0.95] },
    sleep: { opacity: 0.15, scale: 0.7 },
    waking: { opacity: [0.15, 0.5, 0.8], scale: [0.7, 0.9, 1] },
    attack: { opacity: [0.5, 2, 0.5], scale: [0.95, 1.5, 0.95] },
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
            background: `radial-gradient(circle, ${isCasting ? glowColor.replace('28', '60') : glowColor} 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          animate={glowVariants[state] || glowVariants.idle}
          transition={{
            duration: isSleeping ? 3 : isCasting ? 1.2 : 3.5,
            repeat: (state === "idle" || state === "sleep") ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

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
                ? { scaleX: [1, 0.5, 1.3, 1], opacity: [0.3, 0.1, 0.4, 0.3] }
                : { scaleX: [1, 0.85, 1, 0.9, 1], opacity: [0.3, 0.15, 0.3, 0.2, 0.3] }
          }
          transition={{
            duration: isSleeping ? 2.5 : isAttacking ? 0.7 : 5,
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
        {showCrack && <ScreenCrack />}
      </AnimatePresence>
    </>
  );
}
