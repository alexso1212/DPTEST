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
  const char = CHARACTERS[type];
  const isMobile = useIsMobile();
  if (!char) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: isMobile ? "20px 12px" : "24px",
        background: "rgba(13,15,20,0.6)",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
      data-testid="tier-roadmap"
    >
      <h3
        style={{
          color: "#E8E6E1",
          fontFamily: "Georgia, 'Noto Serif SC', serif",
          fontSize: "16px",
          letterSpacing: "3px",
          margin: 0,
        }}
      >
        晋升之路
      </h3>

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
        {TIER_DATA.map((td, tierIndex) => {
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
                <span style={{ fontSize: "12px" }}>{td.badge}</span>
                <span
                  style={{
                    fontSize: "9px",
                    color: isCurrent ? "#E8E6E1" : "#5a5a6a",
                    letterSpacing: "1px",
                  }}
                >
                  {td.name}
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
                Lv.{td.level}
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
                  {td.criteria}
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
  );
}
