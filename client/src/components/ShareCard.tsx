import { useRef, useCallback } from "react";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";
import CharacterIcon from "@/components/CharacterIcon";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

interface ShareCardProps {
  result: QuizResult;
}

export default function ShareCard({ result }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { traderType, rank } = result;
  const [c1, c2] = traderType?.colors ?? ['#C9A456', '#94A3B8'];

  const handleSave = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0B0F14",
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
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${c1}18, #0F1620, ${c1}0A)`,
          border: `1.5px solid ${c2}40`,
          boxShadow: `0 0 30px ${c1}15`,
        }}
        data-testid="share-card"
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 20%, ${c1}12, transparent 60%)` }} />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: c2, opacity: 0.6, fontSize: 11, fontFamily: 'Space Mono, monospace' }}>
              {traderType?.element ? `${traderType.element.icon} ${traderType.element.name}` : ''}
            </span>
            <div className="text-base" style={{ color: rank.color }}>
              {rank.icon} {rank.name}
            </div>
          </div>

          <div className="flex justify-center mb-3">
            <CharacterIcon typeCode={traderType.code} size={100} />
          </div>

          <div className="text-center mb-3">
            <h3 style={{ color: '#E5E7EB', fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif SC, Georgia, serif' }}>
              {traderType.name}
            </h3>
            <p style={{ color: c2, fontSize: 11, fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em', marginTop: 2 }}>
              {traderType.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 justify-center mb-3">
            <div className="flex-1 h-[1px] max-w-[50px]" style={{ background: `linear-gradient(to right, transparent, #C9A456)` }} />
            <span style={{ color: '#C9A456', fontSize: 10 }}>✦</span>
            <div className="flex-1 h-[1px] max-w-[50px]" style={{ background: `linear-gradient(to left, transparent, #C9A456)` }} />
          </div>

          <p className="text-center mb-4" style={{ color: '#C9A456', fontSize: 13, fontFamily: 'Noto Serif SC, Georgia, serif', fontStyle: 'italic' }}>
            "{traderType.quote}"
          </p>

          <div className="flex items-baseline justify-center gap-1 mb-4">
            <span style={{ color: rank.color, fontSize: 32, fontWeight: 700, fontFamily: 'Barlow Condensed, Oswald, monospace' }}>
              ??
            </span>
            <span style={{ color: '#94A3B8', fontSize: 13 }}>/100</span>
          </div>

          <div className="space-y-2 mb-4">
            {sorted.map((dim, i) => {
              const filled = Math.round(result.normalizedScores[dim] / 20);
              return (
                <div key={dim} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                  <span className="w-16" style={{ color: '#94A3B8' }}>{dimensionLabels[dim]}</span>
                  <span style={{ color: i === 0 ? c1 : '#38BDF8' }}>
                    {'◆'.repeat(Math.min(5, filled))}{'◇'.repeat(Math.max(0, 5 - filled))}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-3" style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
            <p style={{ color: '#C9A456', fontSize: 12 }}>
              测测你是什么类型的交易员 →
            </p>
            <p className="mt-1" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>
              Deltapex Trading Group
            </p>
          </div>
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
