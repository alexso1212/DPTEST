import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CHARACTERS } from "@/data/characters";
import { TIER_DATA } from "@/data/tiers";
import CharacterSVG from "./CharacterSVG";
import SilhouettePreview from "./SilhouettePreview";
import { useIsMobile } from "@/hooks/use-mobile";

interface TierRoadmapProps {
  type: string;
  currentTier?: number;
}

export default function TierRoadmap({ type, currentTier = 0 }: TierRoadmapProps) {
  const [open, setOpen] = useState(false);
  const char = CHARACTERS[type];
  const isMobile = useIsMobile();
  const td = TIER_DATA[currentTier];
  if (!char || !td) return null;

  return (
    <div data-testid="tier-roadmap">
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "20px",
          background: "rgba(13,15,20,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer",
          width: "100%",
          justifyContent: "center",
        }}
        data-testid="button-toggle-tier-roadmap"
      >
        <span
          style={{
            fontSize: "12px",
            color: "#E8E6E1",
            fontFamily: "Georgia, 'Noto Serif SC', serif",
            letterSpacing: "2px",
          }}
        >
          晋升之路
        </span>
        <span
          style={{
            fontSize: "10px",
            padding: "1px 8px",
            borderRadius: "10px",
            background: `${char.colors.primary}25`,
            border: `1px solid ${char.colors.primary}44`,
            color: char.colors.accent,
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          {td.badge} {td.name}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: isMobile ? "16px 12px" : "20px",
                marginTop: "8px",
                background: "rgba(13,15,20,0.6)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: isMobile ? "8px" : "16px",
                  overflowX: "auto",
                  padding: "8px 0",
                  width: "100%",
                  justifyContent: "center",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {TIER_DATA.map((tierData, tierIndex) => {
                  const isUnlocked = tierIndex <= currentTier;
                  const isCurrent = tierIndex === currentTier;
                  const size = isMobile
                    ? (isCurrent ? 90 : 64)
                    : (isCurrent ? 140 : 100);

                  return (
                    <div
                      key={tierIndex}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        opacity: isUnlocked ? 1 : 0.7,
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                      }}
                      data-testid={`tier-stage-${tierIndex}`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background: isCurrent
                            ? `${char.colors.primary}33`
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isCurrent ? `${char.colors.primary}66` : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        <span style={{ fontSize: "12px" }}>{tierData.badge}</span>
                        <span
                          style={{
                            fontSize: "9px",
                            color: isCurrent ? "#E8E6E1" : "#5a5a6a",
                            letterSpacing: "1px",
                          }}
                        >
                          {tierData.name}
                        </span>
                      </div>

                      <div
                        style={{
                          border: isCurrent
                            ? `2px solid ${char.colors.primary}88`
                            : "1px solid rgba(255,255,255,0.04)",
                          borderRadius: "12px",
                          padding: isMobile ? "4px" : "8px",
                          background: isCurrent
                            ? char.colors.dark
                            : "rgba(255,255,255,0.01)",
                          boxShadow: isCurrent
                            ? `0 0 20px ${char.colors.glow}`
                            : "none",
                        }}
                      >
                        {isUnlocked ? (
                          <CharacterSVG type={type} size={size} tier={tierIndex} />
                        ) : (
                          <SilhouettePreview type={type} tier={tierIndex} size={size} />
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: "10px",
                          color: isCurrent ? char.colors.accent : "#4a4a5a",
                          letterSpacing: "1px",
                        }}
                      >
                        Lv.{tierData.level}
                      </span>

                      {!isUnlocked && (
                        <p
                          style={{
                            fontSize: "9px",
                            color: "rgba(255,255,255,0.25)",
                            textAlign: "center",
                            maxWidth: isMobile ? "70px" : "100px",
                            lineHeight: 1.4,
                            margin: 0,
                          }}
                        >
                          {tierData.criteria}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0",
                }}
              >
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: isMobile ? "40px" : "60px",
                      height: "2px",
                      background: i < currentTier
                        ? char.colors.primary
                        : "rgba(255,255,255,0.08)",
                      borderRadius: "1px",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
