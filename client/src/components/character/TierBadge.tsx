import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
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
    <>
      <motion.button
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(true); }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "3px 10px 3px 8px",
          borderRadius: "20px",
          background: `${char.colors.primary}22`,
          border: `1px solid ${char.colors.primary}44`,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
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
        <ChevronUp
          style={{
            width: 10,
            height: 10,
            color: "rgba(255,255,255,0.4)",
          }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 50,
              }}
              data-testid="tier-overlay-backdrop"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 51,
                background: "#0D0F14",
                borderTop: `1px solid ${char.colors.primary}33`,
                borderRadius: "20px 20px 0 0",
                padding: "12px 16px max(16px, env(safe-area-inset-bottom))",
                maxHeight: "70vh",
                overflowY: "auto",
                boxShadow: `0 -8px 40px ${char.colors.glow}`,
              }}
              data-testid="tier-panel"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div style={{ width: 32 }} />
                <div
                  style={{
                    width: "36px",
                    height: "4px",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.15)",
                  }}
                />
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  data-testid="tier-panel-close"
                >
                  <X style={{ width: 16, height: 16, color: "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
              <TierRoadmap type={type} currentTier={currentTier} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
