import { useState, useEffect } from "react";
import AlbionCharacterSVG from "@/components/AlbionCharacterSVG";
import { traderTypes } from "@/data/traderTypes";

interface CharacterCardProps {
  typeCode: string;
  scores?: Record<string, number>;
  rank?: { name: string; emoji: string; score: number };
  showAnimation?: boolean;
  maskScores?: boolean;
}

const dimLabels = ["认知", "风控", "心理", "适应", "执行", "系统"];
const dimKeys = ["EDGE", "RISK", "MENTAL", "ADAPT", "EXEC", "SYSTEM"];

export default function CharacterCard({ typeCode, scores, rank, showAnimation = true, maskScores = false }: CharacterCardProps) {
  const char = traderTypes[typeCode];
  const [revealed, setRevealed] = useState(!showAnimation);
  const [showQuote, setShowQuote] = useState(!showAnimation);

  useEffect(() => {
    if (showAnimation) {
      const t1 = setTimeout(() => setRevealed(true), 300);
      const t2 = setTimeout(() => setShowQuote(true), 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [showAnimation]);

  if (!char) return null;

  const cc = char.cardColors;
  const sampleScores = scores || { EDGE: 78, RISK: 72, MENTAL: 65, ADAPT: 55, EXEC: 68, SYSTEM: 70 };
  const sampleRank = rank || { name: "精英交易员", emoji: "⚜️", score: 68 };

  return (
    <div style={{
      width: "340px",
      maxWidth: "100%",
      opacity: revealed ? 1 : 0,
      transform: revealed ? "scale(1) rotateY(0deg)" : "scale(0.7) rotateY(180deg)",
      filter: revealed ? "blur(0px)" : "blur(20px)",
      transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }} data-testid="character-card">
      <div style={{
        borderRadius: "20px",
        overflow: "hidden",
        background: `linear-gradient(170deg, ${cc.dark} 0%, #0d0f14 40%, ${cc.dark} 100%)`,
        border: `1px solid ${cc.glow}`,
        boxShadow: `0 0 25px ${cc.glow}, 0 0 50px ${cc.glow.replace('0.4','0.1')}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "5px",
            background: `${cc.primary}22`, padding: "3px 10px", borderRadius: "16px",
            border: `1px solid ${cc.primary}44`,
          }}>
            <span style={{ fontSize: "12px" }}>{char.element.icon}</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "10px", color: cc.secondary, letterSpacing: "1px" }}>
              {char.element.name.toUpperCase()}
            </span>
          </div>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "conic-gradient(from 0deg, #C9A456, #E8D5A0, #C9A456, #8B6914, #C9A456)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(201,164,86,0.3)",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #1a1a3e, #0d0f14)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
            }}>{sampleRank.emoji}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "0 10px", position: "relative" }}>
          <div style={{
            position: "absolute", width: "150px", height: "150px", borderRadius: "50%", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle, ${cc.primary}33 0%, transparent 70%)`,
          }} />
          <AlbionCharacterSVG type={typeCode} size={220} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 28px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C9A456, transparent)" }} />
          <span style={{ color: "#C9A456", fontSize: "10px" }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C9A456, transparent)" }} />
        </div>

        <div style={{ textAlign: "center", padding: "12px 16px 0" }}>
          <h2 style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", fontSize: "26px", fontWeight: 900, color: "#E8E6E1", margin: 0, letterSpacing: "5px" }}>
            {char.name}
          </h2>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "11px", color: cc.primary, margin: "4px 0 0", letterSpacing: "2px" }}>
            {char.subtitle}
          </p>
        </div>

        <div style={{
          textAlign: "center", padding: "12px 28px 0",
          opacity: showQuote ? 1 : 0, transform: showQuote ? "translateY(0)" : "translateY(15px)",
          transition: "all 0.6s ease",
        }}>
          <p style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", fontSize: "14px", color: "#C9A456", fontStyle: "italic", margin: 0, lineHeight: 1.8 }}>
            "{char.quote}"
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 8px" }}>
          <svg viewBox="0 0 200 200" style={{ width: "140px", height: "140px" }}>
            {[0.3, 0.6, 0.9].map((s, i) => {
              const pts = [0,1,2,3,4,5].map(j => {
                const a = (Math.PI*2*j)/6 - Math.PI/2;
                return `${100+Math.cos(a)*55*s},${100+Math.sin(a)*55*s}`;
              }).join(" ");
              return <polygon key={i} points={pts} fill="none" stroke="#2a2a3a" strokeWidth="0.5"/>;
            })}
            {(() => {
              const vals = dimKeys.map(k => (sampleScores[k] ?? 50) / 100);
              const pts = vals.map((v, i) => {
                const a = (Math.PI*2*i)/6 - Math.PI/2;
                return `${100+Math.cos(a)*55*v},${100+Math.sin(a)*55*v}`;
              }).join(" ");
              return (
                <>
                  <polygon points={pts} fill={`${cc.primary}33`} stroke={cc.primary} strokeWidth="1.5"/>
                  {vals.map((v, i) => {
                    const a = (Math.PI*2*i)/6 - Math.PI/2;
                    return <circle key={i} cx={100+Math.cos(a)*55*v} cy={100+Math.sin(a)*55*v} r="2.5" fill="#C9A456" stroke="#0D0F14" strokeWidth="1"/>;
                  })}
                </>
              );
            })()}
            {dimLabels.map((l, i) => {
              const a = (Math.PI*2*i)/6 - Math.PI/2;
              const val = maskScores ? "??" : (sampleScores[dimKeys[i]] ?? 50);
              return <text key={i} x={100+Math.cos(a)*75} y={100+Math.sin(a)*75} textAnchor="middle" dominantBaseline="middle" fill="#8B95A5" fontSize="9">{l} {val}</text>;
            })}
          </svg>
        </div>

        <div style={{ textAlign: "center", padding: "0 16px 8px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(201,164,86,0.08)", padding: "6px 16px", borderRadius: "20px",
            border: "1px solid rgba(201,164,86,0.2)",
            fontFamily: "sans-serif", fontSize: "12px", color: "#C9A456",
          }}>
            {sampleRank.emoji} {sampleRank.name} · {maskScores ? "??" : sampleRank.score}/100
          </span>
        </div>

        <div style={{
          padding: "8px 22px 18px",
          opacity: showQuote ? 0.5 : 0, transition: "opacity 1s ease 0.3s",
        }}>
          <p style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#8B95A5", lineHeight: 1.7, margin: 0, textAlign: "center", fontStyle: "italic" }}>
            {char.storyHint}
          </p>
        </div>
      </div>
    </div>
  );
}
