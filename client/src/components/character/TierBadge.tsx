import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TIER_DATA } from "@/data/tiers";
import { CHARACTERS } from "@/data/characters";
import TierRoadmap from "./TierRoadmap";

interface TierBadgeProps {
  type: string;
  currentTier?: number;
}

export default function TierBadge({ type, currentTier = 0 }: TierBadgeProps) {
  const [open, setOpen] = useState(false);
  const char = CHARACTERS[type];
  const td = TIER_DATA[currentTier];
  if (!char || !td) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <motion.button
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(!open); }}
        whileTap={{ scale: 0.95 }}
        className="tier-badge-glow"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 12px 4px 10px",
          borderRadius: "20px",
          background: `${char.colors.primary}22`,
          border: `1px solid ${char.colors.primary}44`,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          position: "relative",
          zIndex: 10,
          ["--badge-glow-color" as string]: char.colors.primary,
        }}
        data-testid="tier-badge-button"
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: char.colors.accent,
            fontFamily: "Georgia, 'Noto Serif SC', serif",
          }}
        >
          {td.badge}
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "#E8E6E1",
            letterSpacing: "1px",
          }}
        >
          {td.name}
        </span>
        <ChevronDown
          style={{
            width: 10,
            height: 10,
            color: "rgba(255,255,255,0.4)",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              overflow: "hidden",
              width: "100%",
              borderRadius: "16px",
              position: "relative",
              zIndex: 5,
            }}
            data-testid="tier-panel"
          >
            <TierRoadmap type={type} currentTier={currentTier} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
