import { Lock } from "lucide-react";
import CharacterSVG from "./CharacterSVG";

interface SilhouettePreviewProps {
  type: string;
  tier: number;
  size?: number;
}

export default function SilhouettePreview({ type, tier, size = 160 }: SilhouettePreviewProps) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size * 1.38,
      }}
      data-testid={`silhouette-${type}-tier${tier}`}
    >
      <div style={{ filter: "brightness(0) saturate(0)", opacity: 0.85 }}>
        <CharacterSVG type={type} size={size} tier={tier} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          filter: "brightness(0) saturate(0) drop-shadow(0 0 6px rgba(255,255,255,0.15))",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        <CharacterSVG type={type} size={size} tier={tier} />
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.6,
        }}
      >
        <Lock style={{ width: size * 0.15, height: size * 0.15, color: "rgba(255,255,255,0.4)" }} />
      </div>
    </div>
  );
}
