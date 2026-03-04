import { useRef, useCallback } from "react";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

interface ShareCardProps {
  result: QuizResult;
}

export default function ShareCard({ result }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

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
      link.download = `交易员评测-${result.traderType.name}.png`;
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
        className="rounded-2xl p-6"
        style={{ background: '#0F1620', border: '1px solid rgba(255,255,255,0.08)' }}
        data-testid="share-card"
      >
        <div className="text-center mb-4">
          <div className="text-xl mb-1" style={{ color: result.rank.color }}>
            {result.rank.icon} {result.rank.name}
          </div>
          <div className="flex items-baseline justify-center gap-1 mb-3">
            <span className="text-4xl font-num font-bold" style={{ color: result.rank.color }}>
              ??
            </span>
            <span className="text-sm" style={{ color: '#94A3B8' }}>/100</span>
          </div>
        </div>

        <div className="text-center mb-5">
          <div className="text-3xl mb-1">{result.traderType.icon}</div>
          <h3 className="text-lg font-bold" style={{ color: '#E5E7EB' }}>{result.traderType.name}</h3>
          <p className="text-xs mt-1" style={{ color: '#E63946' }}>{result.traderType.oneLiner}</p>
        </div>

        <div className="space-y-2 mb-4">
          {sorted.map((dim, i) => {
            const filled = Math.round(result.normalizedScores[dim] / 20);
            return (
              <div key={dim} className="flex items-center justify-between text-xs">
                <span className="w-16" style={{ color: '#94A3B8' }}>{dimensionLabels[dim]}</span>
                <span style={{ color: i === 0 ? '#E63946' : '#38BDF8' }}>
                  {'◆'.repeat(Math.min(5, filled))}{'◇'.repeat(Math.max(0, 5 - filled))}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-2 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="text-xs" style={{ color: '#94A3B8' }}>
            稀有度: <span className="font-semibold" style={{ color: '#E63946' }}>{result.rarity}</span>
          </div>
          <div className="text-xs" style={{ color: '#94A3B8' }}>
            添加顾问领取完整报告
          </div>
        </div>

        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>交易员能力评测 | Deltapex Trading Group</p>
        </div>
      </div>

      <motion.button
        onClick={handleSave}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-3 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background: 'transparent',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
        }}
        data-testid="button-download-card"
      >
        <Camera className="w-4 h-4" />
        保存到相册
      </motion.button>
    </div>
  );
}
