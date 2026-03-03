import { useRef, useCallback } from "react";
import type { QuizResult } from "@/utils/calculateResult";
import { dimensionLabels, type Dimension } from "@/data/questions";

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
        backgroundColor: "#0a0e1a",
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

  const dims: Dimension[] = ['RISK', 'MENTAL', 'SYSTEM', 'ADAPT', 'EXEC', 'VISION'];

  return (
    <div>
      <div
        ref={cardRef}
        className="bg-[#0d1220] rounded-2xl p-6 border border-white/10"
        data-testid="share-card"
      >
        <div className="text-center mb-5">
          <div className="text-3xl mb-2">{result.traderType.icon}</div>
          <h3 className="text-lg font-bold text-white">{result.traderType.name}</h3>
          <p className="text-xs text-white/40 mt-1">{result.traderType.subtitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {dims.map((dim) => (
            <div key={dim} className="text-center p-2 rounded-lg bg-white/[0.03]">
              <div className="text-lg font-bold text-blue-400">{result.normalizedScores[dim]}</div>
              <div className="text-[10px] text-white/40">{dimensionLabels[dim]}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-white/[0.03]">
          <div className="text-xs text-white/40">
            段位: <span className="text-white/80 font-semibold">{result.rank.name}</span>
          </div>
          <div className="text-xs text-white/40">
            稀有度: <span className="text-white/80 font-semibold">{result.rarity}</span>
          </div>
        </div>

        <div className="text-center mt-4 pt-3 border-t border-white/5">
          <p className="text-[10px] text-white/30">交易员能力评测 | 扫码测试你的交易基因</p>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 active:bg-white/10 transition-colors"
        data-testid="button-save-image"
      >
        保存结果图片
      </button>
    </div>
  );
}
