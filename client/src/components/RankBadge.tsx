import type { RankTier } from "@/data/traderTypes";

interface RankBadgeProps {
  tier: RankTier;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 40, md: 60, lg: 80 };

export default function RankBadge({ tier, size = 'md' }: RankBadgeProps) {
  const px = sizes[size];
  const tierIndex = getTierIndex(tier.minScore);

  if (tierIndex >= 5) return <LegendaryBadge tier={tier} px={px} />;
  if (tierIndex >= 4) return <MasterBadge tier={tier} px={px} />;
  if (tierIndex >= 3) return <EliteBadge tier={tier} px={px} />;
  if (tierIndex >= 2) return <SilverBadge tier={tier} px={px} />;
  if (tierIndex >= 1) return <BronzeGlowBadge tier={tier} px={px} />;
  return <BronzeBadge tier={tier} px={px} />;
}

function getTierIndex(minScore: number): number {
  if (minScore >= 85) return 5;
  if (minScore >= 70) return 4;
  if (minScore >= 55) return 3;
  if (minScore >= 40) return 2;
  if (minScore >= 25) return 1;
  return 0;
}

function BronzeBadge({ tier, px }: { tier: RankTier; px: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
      data-testid="rank-badge"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '2px solid #8B6914',
          background: 'radial-gradient(circle at 30% 30%, #2a2a2a, #1a1a1a)',
        }}
      />
      <span className="relative text-lg" style={{ fontSize: px * 0.4 }}>{tier.icon}</span>
    </div>
  );
}

function BronzeGlowBadge({ tier, px }: { tier: RankTier; px: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
      data-testid="rank-badge"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '2px solid #A0785A',
          background: 'radial-gradient(circle at 30% 30%, #2e2620, #1a1a1a)',
          boxShadow: '0 0 12px rgba(160,120,90,0.2)',
        }}
      />
      <span className="relative text-lg" style={{ fontSize: px * 0.4 }}>{tier.icon}</span>
    </div>
  );
}

function SilverBadge({ tier, px }: { tier: RankTier; px: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
      data-testid="rank-badge"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="silver-inner-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2a2a3e" />
            <stop offset="100%" stopColor="#1a1a2a" />
          </radialGradient>
        </defs>
        <polygon
          points="50,3 93,25 93,75 50,97 7,75 7,25"
          fill="none"
          stroke="#A8B8D0"
          strokeWidth="2.5"
        />
        <polygon
          points="50,10 87,28 87,72 50,90 13,72 13,28"
          fill="url(#silver-inner-grad)"
          opacity="0.9"
        />
      </svg>
      <div
        className="absolute inset-[3px] flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #2a2a3e, #15152a)',
          clipPath: 'polygon(50% 5%, 95% 27%, 95% 73%, 50% 95%, 5% 73%, 5% 27%)',
          boxShadow: '0 0 15px rgba(168,184,208,0.15)',
        }}
      >
        <span className="relative" style={{ fontSize: px * 0.4 }}>{tier.icon}</span>
      </div>
    </div>
  );
}

function EliteBadge({ tier, px }: { tier: RankTier; px: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
      data-testid="rank-badge"
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #2a2520, #1a1510)',
          clipPath: 'polygon(50% 5%, 95% 27%, 95% 73%, 50% 95%, 5% 73%, 5% 27%)',
          boxShadow: `0 0 20px rgba(201,164,86,0.25)`,
        }}
      />
      <div
        className="absolute inset-[2px]"
        style={{
          clipPath: 'polygon(50% 5%, 95% 27%, 95% 73%, 50% 95%, 5% 73%, 5% 27%)',
          border: '2px solid #C9A456',
          boxShadow: '0 0 15px rgba(201,164,86,0.2), inset 0 0 10px rgba(201,164,86,0.1)',
        }}
      />
      <span className="relative" style={{ fontSize: px * 0.4 }}>{tier.icon}</span>
    </div>
  );
}

function MasterBadge({ tier, px }: { tier: RankTier; px: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
      data-testid="rank-badge"
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'conic-gradient(from 0deg, #C9A456, #E8D5A0, #C9A456, #8B6914, #C9A456)',
          clipPath: 'polygon(50% 2%, 97% 25%, 97% 75%, 50% 98%, 3% 75%, 3% 25%)',
          animation: 'glow-pulse 2s ease-in-out infinite',
          boxShadow: '0 0 25px rgba(201,164,86,0.35), 0 0 50px rgba(201,164,86,0.15)',
        }}
      />
      <div
        className="absolute inset-[3px] flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #2a2520, #0d0f14)',
          clipPath: 'polygon(50% 4%, 96% 26%, 96% 74%, 50% 96%, 4% 74%, 4% 26%)',
        }}
      >
        <span className="relative" style={{ fontSize: px * 0.4 }}>{tier.icon}</span>
      </div>
    </div>
  );
}

function LegendaryBadge({ tier, px }: { tier: RankTier; px: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
      data-testid="rank-badge"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #C9A456, #E8D5A0, #C9A456, #8B6914, #C9A456, #B388FF, #C9A456)',
          animation: 'rotate-border 3s linear infinite',
          boxShadow: '0 0 30px rgba(201,164,86,0.4), 0 0 60px rgba(179,136,255,0.2)',
        }}
      />
      <div
        className="absolute inset-[3px] rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #1a1a3e, #0d0f14)',
        }}
      >
        <span className="relative" style={{ fontSize: px * 0.4 }}>{tier.icon}</span>
      </div>
    </div>
  );
}
