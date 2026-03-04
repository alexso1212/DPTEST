import { useRef, useCallback } from "react";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";
import AlbionCharacterSVG from "@/components/AlbionCharacterSVG";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

interface ShareCardProps {
  result: QuizResult;
}

const dimLabels = ["认知", "风控", "心理", "适应", "执行", "系统"];
const dimKeys: Dimension[] = ['EDGE', 'RISK', 'MENTAL', 'ADAPT', 'EXEC', 'SYSTEM'];

export default function ShareCard({ result }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { traderType, rank } = result;
  const cc = traderType.cardColors;

  const handleSave = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0D0F14",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `交易员评测-${traderType.name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    }
  }, [result]);

  const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'EDGE'];
  const sorted = [...dims].sort((a, b) => result.normalizedScores[b] - result.normalizedScores[a]);

  return (
    <div>
      <div
        ref={cardRef}
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          background: `linear-gradient(170deg, ${cc.dark} 0%, #0d0f14 40%, ${cc.dark} 100%)`,
          border: `1px solid ${cc.glow}`,
          boxShadow: `0 0 25px ${cc.glow}`,
          padding: "0",
        }}
        data-testid="share-card"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "5px",
            background: `${cc.primary}22`, padding: "3px 10px", borderRadius: "16px",
            border: `1px solid ${cc.primary}44`,
          }}>
            <span style={{ fontSize: "12px" }}>{traderType.element.icon}</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "10px", color: cc.secondary, letterSpacing: "1px" }}>
              {traderType.element.name.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: "14px", color: rank.color }}>
            {rank.icon} {rank.name}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "0 10px", position: "relative" }}>
          <div style={{
            position: "absolute", width: "120px", height: "120px", borderRadius: "50%", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle, ${cc.primary}33 0%, transparent 70%)`,
          }} />
          <AlbionCharacterSVG type={traderType.code} size={180} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 28px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C9A456, transparent)" }} />
          <span style={{ color: "#C9A456", fontSize: "10px" }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C9A456, transparent)" }} />
        </div>

        <div style={{ textAlign: "center", padding: "10px 16px 0" }}>
          <h3 style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", fontSize: "22px", fontWeight: 900, color: "#E8E6E1", margin: 0, letterSpacing: "4px" }}>
            {traderType.name}
          </h3>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "10px", color: cc.primary, margin: "3px 0 0", letterSpacing: "2px" }}>
            {traderType.subtitle}
          </p>
        </div>

        <div style={{ textAlign: "center", padding: "10px 24px 0" }}>
          <p style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", fontSize: "13px", color: "#C9A456", fontStyle: "italic", margin: 0, lineHeight: 1.7 }}>
            "{traderType.quote}"
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px", padding: "12px 0 4px" }}>
          <span style={{ color: rank.color, fontSize: "28px", fontWeight: 700, fontFamily: "'Barlow Condensed', Oswald, monospace" }}>
            ??
          </span>
          <span style={{ color: "#94A3B8", fontSize: "12px" }}>/100</span>
        </div>

        <div style={{ padding: "0 24px 8px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {sorted.map((dim, i) => {
              const filled = Math.round(result.normalizedScores[dim] / 20);
              return (
                <div key={dim} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#94A3B8", width: "56px" }}>{dimensionLabels[dim]}</span>
                  <span style={{ color: i === 0 ? cc.primary : '#38BDF8' }}>
                    {'◆'.repeat(Math.min(5, filled))}{'◇'.repeat(Math.max(0, 5 - filled))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "10px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#C9A456", fontSize: "12px", margin: 0 }}>
            测测你是什么类型的交易员 →
          </p>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", margin: "4px 0 0" }}>
            Deltapex Trading Group
          </p>
        </div>
      </div>

      <motion.button
        onClick={handleSave}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-3 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background: 'transparent',
          border: '1px solid var(--gold)',
          color: 'var(--gold)',
        }}
        data-testid="button-download-card"
      >
        <Camera className="w-4 h-4" />
        保存到相册
      </motion.button>
    </div>
  );
}
