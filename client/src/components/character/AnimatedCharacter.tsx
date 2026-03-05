import { motion } from "framer-motion";
import CharacterSVG from "./CharacterSVG";

interface AnimatedCharacterProps {
  type: string;
  size: number;
  tier?: number;
  glowColor?: string;
}

export default function AnimatedCharacter({ type, size, tier = 0, glowColor = "#C9A45628" }: AnimatedCharacterProps) {
  return (
    <div className="relative flex justify-center" style={{ width: size, height: size * 1.38 }}>
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{
          opacity: [0.5, 0.9, 0.5],
          scale: [0.95, 1.08, 0.95],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        animate={{
          y: [0, -10, 0, -6, 2, 0],
          rotate: [0, -1.2, 0, 0.8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          style={{ transformOrigin: 'center bottom' }}
          animate={{
            scaleX: [1, 1.01, 1, 0.99, 1],
            scaleY: [1, 0.99, 1, 1.01, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <CharacterSVG type={type} size={size} tier={tier} animated />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{
          width: size * 0.5,
          height: 8,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)',
          filter: 'blur(4px)',
          transform: 'translateX(-50%)',
        }}
        animate={{
          scaleX: [1, 0.85, 1, 0.9, 1],
          opacity: [0.3, 0.15, 0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
