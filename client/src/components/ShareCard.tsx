import { useRef, useCallback } from "react";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";
import { Camera } from "lucide-react";

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
        backgroundColor: "#0A0E17",
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

  return (
    <div>
      <div
        ref={cardRef}
        className="rounded-2xl p-6"
        style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.1)' }}
        data-testid="share-card"
      >
        <div className="text-center mb-4">
          <div className="text-xl mb-1" style={{ color: result.rank.color }}>
            {result.rank.name}
          </div>
          <div className="flex items-baseline justify-center gap-1 mb-3">
            <span className="text-4xl font-num font-bold" style={{ color: result.rank.color }}>
              {result.avgScore}
            </span>
            <span className="text-sm" style={{ color: '#8B95A5' }}>/100</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-3xl mb-1">{result.traderType.icon}</div>
          <h3 className="text-lg font-bold text-white">{result.traderType.name}</h3>
          <p className="text-xs mt-1" style={{ color: '#F0B90B' }}>{result.traderType.oneLiner}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {dims.map((dim) => (
            <div key={dim} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-lg font-num font-bold" style={{ color: '#00D4FF' }}>{result.normalizedScores[dim]}</div>
              <div className="text-[10px]" style={{ color: '#8B95A5' }}>{dimensionLabels[dim]}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-2 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="text-xs" style={{ color: '#8B95A5' }}>
            稀有度: <span className="font-semibold" style={{ color: '#F0B90B' }}>{result.rarity}</span>
          </div>
        </div>

        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>交易员能力评测 | Deltapex Trading Group</p>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-3 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        style={{
          background: 'transparent',
          border: '1px solid var(--accent-blue)',
          color: 'var(--accent-blue)',
        }}
        data-testid="button-save-image"
      >
        <Camera className="w-4 h-4" />
        生成我的交易员卡片
      </button>
    </div>
  );
}
