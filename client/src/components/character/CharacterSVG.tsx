import { CHARACTERS } from "@/data/characters";

interface TierProps {
  tier: number;
  c1: string;
  c2?: string;
}

interface ColorProps {
  tier: number;
  color: string;
}

const Aura = ({ tier, color }: ColorProps) => {
  if (tier < 1) return null;
  const sz = [0, 65, 120, 180][tier];
  const op = [0, 0.08, 0.16, 0.25][tier];
  return (
    <g>
      <ellipse cx="100" cy="160" rx={sz} ry={sz * 1.2} fill={color} opacity={op}>
        <animate attributeName="opacity" values={`${op * 0.4};${op};${op * 0.4}`} dur="3s" repeatCount="indefinite" />
      </ellipse>
      {tier >= 2 && <ellipse cx="100" cy="160" rx={sz * 0.5} ry={sz * 0.6} fill={color} opacity={op * 0.6} />}
      {tier >= 3 && (
        <ellipse cx="100" cy="275" rx="65" ry="12" fill="none" stroke={color} strokeWidth="2" opacity="0.25">
          <animate attributeName="rx" values="65;78;65" dur="2s" repeatCount="indefinite" />
        </ellipse>
      )}
    </g>
  );
};

const Wings = ({ tier, c1, c2 }: TierProps) => {
  if (tier < 1) return null;
  if (tier === 1)
    return (
      <g>
        <path d="M68,108 Q52,88 48,68" fill="none" stroke={c1} strokeWidth="3" opacity="0.35" />
        <path d="M132,108 Q148,88 152,68" fill="none" stroke={c1} strokeWidth="3" opacity="0.35" />
        <path d="M68,108 Q56,96 50,78" fill="none" stroke={c2 || c1} strokeWidth="1.5" opacity="0.2" />
        <path d="M132,108 Q144,96 150,78" fill="none" stroke={c2 || c1} strokeWidth="1.5" opacity="0.2" />
      </g>
    );
  if (tier === 2)
    return (
      <g>
        <path d="M65,112 Q30,75 8,32 Q22,48 32,42 Q20,22 2,0 Q26,28 40,24 Q30,10 18,-8 Q38,18 55,38 Q52,65 62,92" fill={c1} opacity="0.15" stroke={c1} strokeWidth="2">
          <animate attributeName="opacity" values="0.1;0.22;0.1" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M135,112 Q170,75 192,32 Q178,48 168,42 Q180,22 198,0 Q174,28 160,24 Q170,10 182,-8 Q162,18 145,38 Q148,65 138,92" fill={c1} opacity="0.15" stroke={c1} strokeWidth="2">
          <animate attributeName="opacity" values="0.1;0.22;0.1" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M65,112 Q32,78 12,38" fill="none" stroke={c1} strokeWidth="3" opacity="0.4" />
        <path d="M135,112 Q168,78 188,38" fill="none" stroke={c1} strokeWidth="3" opacity="0.4" />
      </g>
    );
  return (
    <g>
      <path d="M58,112 Q12,52 -22,0 Q2,28 14,18 Q-4,-8 -28,-35 Q8,6 24,0 Q4,-22 -16,-48 Q14,-6 34,2 Q20,-24 4,-52 Q28,-4 46,14 Q42,42 52,72 Q48,88 56,105" fill={c1} opacity="0.22" stroke={c1} strokeWidth="2.5">
        <animate attributeName="opacity" values="0.14;0.3;0.14" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M142,112 Q188,52 222,0 Q198,28 186,18 Q204,-8 228,-35 Q192,6 176,0 Q196,-22 216,-48 Q186,-6 166,2 Q180,-24 196,-52 Q172,-4 154,14 Q158,42 148,72 Q152,88 144,105" fill={c1} opacity="0.22" stroke={c1} strokeWidth="2.5">
        <animate attributeName="opacity" values="0.14;0.3;0.14" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M58,112 Q16,56 -18,5" fill="none" stroke={c1} strokeWidth="4" opacity="0.55" />
      <path d="M142,112 Q184,56 218,5" fill="none" stroke={c1} strokeWidth="4" opacity="0.55" />
      <path d="M54,100 Q8,10 -22,-30" fill="none" stroke={c2 || c1} strokeWidth="2" opacity="0.3" />
      <path d="M146,100 Q192,10 222,-30" fill="none" stroke={c2 || c1} strokeWidth="2" opacity="0.3" />
      <ellipse cx="100" cy="14" rx="32" ry="7" fill="none" stroke={c1} strokeWidth="3" opacity="0.55">
        <animate attributeName="cy" values="14;10;14" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.75;0.4" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="100" cy="14" rx="40" ry="12" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.12">
        <animate attributeName="rx" values="40;50;40" dur="2s" repeatCount="indefinite" />
      </ellipse>
    </g>
  );
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const Burst = ({ tier, color }: ColorProps) => {
  if (tier < 1) return null;
  const n = [0, 6, 18, 35][tier];
  const sz = [0, 1.8, 3, 4][tier];
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = 25 + seededRandom(i * 3) * 150;
        const d = 1.5 + seededRandom(i * 3 + 1) * 2;
        const r = sz * (0.4 + seededRandom(i * 3 + 2) * 0.6);
        return (
          <circle key={i} cx={x} cy={280} r={r} fill={color} opacity={0.2 + tier * 0.1}>
            <animate attributeName="cy" values="280;30" dur={`${d}s`} begin={`${i * 0.12}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values={`${0.2 + tier * 0.1};0`} dur={`${d}s`} begin={`${i * 0.12}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </>
  );
};

const Armor = ({ tier, c1, c2 }: TierProps) => {
  if (tier < 2) return null;
  const t3 = tier === 3;
  return (
    <g>
      <path d={t3 ? "M44,106 L28,86 L38,70 L62,78 L76,96 L70,110 Z" : "M54,104 L42,92 L50,82 L68,88 L76,100 Z"} fill={c1} opacity={t3 ? 0.32 : 0.22} stroke={c1} strokeWidth={t3 ? 2.5 : 1.5} />
      <path d={t3 ? "M156,106 L172,86 L162,70 L138,78 L124,96 L130,110 Z" : "M146,104 L158,92 L150,82 L132,88 L124,100 Z"} fill={c1} opacity={t3 ? 0.32 : 0.22} stroke={c1} strokeWidth={t3 ? 2.5 : 1.5} />
      {t3 && (
        <>
          <circle cx="48" cy="88" r="5" fill={c2 || c1} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.85;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="152" cy="88" r="5" fill={c2 || c1} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.85;0.3" dur="1.5s" repeatCount="indefinite" begin="0.4s" />
          </circle>
        </>
      )}
      <path d={t3 ? "M74,112 L100,142 L126,112" : "M82,116 L100,130 L118,116"} fill="none" stroke={c1} strokeWidth={t3 ? 3 : 2} opacity="0.5" />
      {t3 && (
        <circle cx="100" cy="128" r="7" fill={c2 || c1} opacity="0.3">
          <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.55;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {t3 && (
        <g>
          <path d="M78,18 L86,4 L94,15 L100,-2 L106,15 L114,4 L122,18 Z" fill={c1} opacity="0.25" stroke={c1} strokeWidth="1.5">
            <animate attributeName="transform" values="translate(0,0);translate(0,-5);translate(0,0)" dur="3s" repeatCount="indefinite" />
          </path>
        </g>
      )}
    </g>
  );
};

interface BodyProps {
  tier: number;
  primary: string;
  accent: string;
  dark?: string;
}

const Body = ({ tier, primary, accent, dark }: BodyProps) => {
  const rw = [58, 62, 68, 76][tier];
  const sw = [2, 2.5, 3.5, 4.5][tier];
  return (
    <g>
      <path
        d={`M${100 - rw / 1.5},105 L${100 - rw},235 Q${100 - rw - 5},248 ${100 - rw - 12},260 L${100 - rw + 8},255 Q100,265 ${100 + rw - 8},255 L${100 + rw + 12},260 Q${100 + rw + 5},248 ${100 + rw},235 L${100 + rw / 1.5},105`}
        fill={dark || "#1a1a24"}
        stroke={[`${accent}55`, `${accent}88`, accent, accent][tier]}
        strokeWidth={sw}
      />
      <path d="M85,115 L82,240 L118,240 L115,115" fill={primary} opacity={[0.05, 0.12, 0.22, 0.35][tier]} />
      <path d="M76,105 L70,78 L86,86 L84,105" fill={dark || "#1a1a24"} stroke={[`${accent}66`, accent, accent, accent][tier]} strokeWidth={[1.5, 2, 2.5, 3][tier]} />
      <path d="M124,105 L116,86 L130,78 L124,105" fill={dark || "#1a1a24"} stroke={[`${accent}66`, accent, accent, accent][tier]} strokeWidth={[1.5, 2, 2.5, 3][tier]} />
      {tier >= 1 && (
        <>
          <line x1={100 - rw + 8} y1={190} x2={100 + rw - 8} y2={190} stroke={accent} strokeWidth={[0, 1.5, 2.5, 3][tier]} opacity={[0, 0.3, 0.5, 0.7][tier]} />
          {tier >= 2 && <circle cx="100" cy="190" r={[0, 0, 4, 6][tier]} fill={accent} opacity="0.25" />}
        </>
      )}
      {tier >= 2 && (
        <>
          <path d="M82,130 L80,185" fill="none" stroke={accent} strokeWidth="1" opacity={[0, 0, 0.15, 0.3][tier]} />
          <path d="M118,130 L120,185" fill="none" stroke={accent} strokeWidth="1" opacity={[0, 0, 0.15, 0.3][tier]} />
        </>
      )}
      <ellipse cx="100" cy="258" rx={rw + 5} ry="8" fill={primary} opacity={[0.04, 0.08, 0.14, 0.22][tier]} />
    </g>
  );
};

interface HeadProps {
  tier: number;
  primary: string;
  accent: string;
  eyeColor?: string;
}

const Head = ({ tier, accent, eyeColor }: HeadProps) => {
  const ec = eyeColor || accent;
  const er = [2, 3.5, 5, 7.5][tier];
  const eop = [0.3, 0.6, 0.85, 1][tier];
  return (
    <g>
      <ellipse cx="100" cy="58" rx="22" ry="26" fill="#0e0e14" />
      {tier >= 2 && (
        <path
          d={tier === 3 ? "M74,56 Q72,28 100,20 Q128,28 126,56" : "M76,56 Q76,32 100,26 Q124,32 124,56"}
          fill="#0e0e14"
          stroke={[" ", "", `${accent}66`, `${accent}88`][tier]}
          strokeWidth={tier === 3 ? 2 : 1.5}
        />
      )}
      <circle cx="92" cy="54" r={er} fill={ec} opacity={eop}>
        <animate attributeName="opacity" values={`${eop * 0.65};${eop};${eop * 0.65}`} dur={`${2.2 - tier * 0.35}s`} repeatCount="indefinite" />
      </circle>
      <circle cx="108" cy="54" r={er} fill={ec} opacity={eop}>
        <animate attributeName="opacity" values={`${eop * 0.65};${eop};${eop * 0.65}`} dur={`${2.2 - tier * 0.35}s`} repeatCount="indefinite" begin="0.3s" />
      </circle>
      {tier >= 2 && (
        <>
          <circle cx="92" cy="54" r={[0, 0, 12, 20][tier]} fill={ec} opacity={[0, 0, 0.04, 0.07][tier]} />
          <circle cx="108" cy="54" r={[0, 0, 12, 20][tier]} fill={ec} opacity={[0, 0, 0.04, 0.07][tier]} />
        </>
      )}
      {tier >= 3 && (
        <>
          <path d="M85,54 L68,52 L52,54" stroke={ec} strokeWidth="2" opacity="0.35" fill="none">
            <animate attributeName="opacity" values="0.2;0.55;0.2" dur="1.2s" repeatCount="indefinite" />
          </path>
          <path d="M115,54 L132,52 L148,54" stroke={ec} strokeWidth="2" opacity="0.35" fill="none">
            <animate attributeName="opacity" values="0.2;0.55;0.2" dur="1.2s" repeatCount="indefinite" begin="0.3s" />
          </path>
        </>
      )}
    </g>
  );
};

interface ShoulderProps {
  tier: number;
  accent: string;
  dark?: string;
}

const Shoulders = ({ tier, accent, dark }: ShoulderProps) => {
  const rx = [16, 22, 28, 36][tier];
  const ry = [7, 10, 13, 17][tier];
  return (
    <g>
      <ellipse cx={100 - [30, 32, 36, 40][tier]} cy="108" rx={rx} ry={ry} fill={dark || "#2a2a34"} stroke={accent} strokeWidth={[1.5, 2, 2.5, 3.5][tier]} />
      <ellipse cx={100 + [30, 32, 36, 40][tier]} cy="108" rx={rx} ry={ry} fill={dark || "#2a2a34"} stroke={accent} strokeWidth={[1.5, 2, 2.5, 3.5][tier]} />
      {tier >= 2 && (
        <>
          <circle cx={100 - [0, 0, 36, 40][tier]} cy="108" r={[0, 0, 5, 8][tier]} fill={accent} opacity="0.3">
            <animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={100 + [0, 0, 36, 40][tier]} cy="108" r={[0, 0, 5, 8][tier]} fill={accent} opacity="0.3">
            <animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.8s" repeatCount="indefinite" begin="0.5s" />
          </circle>
        </>
      )}
    </g>
  );
};

interface ArmProps {
  tier: number;
  dir: number;
  pose: "down" | "out" | "up";
  accent: string;
  dark?: string;
}

const Arm = ({ tier, dir, pose, accent, dark }: ArmProps) => {
  const d = dir;
  const sx = 100 + d * [28, 30, 34, 38][tier];
  const sw = [2.5, 3.5, 4.5, 5.5][tier];
  let elbowX: number, elbowY: number, handX: number, handY: number;
  if (pose === "up") {
    elbowX = sx + d * [18, 22, 28, 34][tier];
    elbowY = [128, 125, 120, 115][tier];
    handX = elbowX + d * [10, 14, 18, 22][tier];
    handY = [108, 102, 95, 85][tier];
  } else if (pose === "out") {
    elbowX = sx + d * [20, 25, 30, 36][tier];
    elbowY = [138, 135, 132, 128][tier];
    handX = elbowX + d * [12, 16, 20, 26][tier];
    handY = [148, 145, 142, 138][tier];
  } else {
    elbowX = sx + d * [12, 16, 20, 26][tier];
    elbowY = [145, 142, 140, 136][tier];
    handX = elbowX + d * [6, 10, 14, 18][tier];
    handY = [175, 172, 170, 168][tier];
  }
  return (
    <g>
      <line x1={sx} y1={112} x2={elbowX} y2={elbowY} stroke={dark || "#1a1a24"} strokeWidth={sw + 2} strokeLinecap="round" />
      <line x1={sx} y1={112} x2={elbowX} y2={elbowY} stroke={accent} strokeWidth={sw * 0.5} opacity={[0.15, 0.3, 0.45, 0.6][tier]} strokeLinecap="round" />
      <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke={dark || "#1a1a24"} strokeWidth={sw + 1} strokeLinecap="round" />
      <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke={accent} strokeWidth={sw * 0.4} opacity={[0.1, 0.25, 0.4, 0.55][tier]} strokeLinecap="round" />
      <circle cx={handX} cy={handY} r={[3.5, 4.5, 5.5, 7][tier]} fill={dark || "#1a1a24"} stroke={accent} strokeWidth={[1, 1.5, 2, 2.5][tier]} opacity={[0.5, 0.7, 0.85, 1][tier]} />
      {tier >= 2 && <circle cx={handX} cy={handY} r={[0, 0, 10, 16][tier]} fill={accent} opacity={[0, 0, 0.04, 0.06][tier]} />}
    </g>
  );
};

interface MountProps {
  tier: number;
  c1: string;
  c2: string;
}

const MountDragon = ({ tier, c1, c2 }: MountProps) => {
  if (tier < 2) return null;
  const sc = tier === 3 ? 1.3 : 0.85;
  const op = tier === 3 ? 0.35 : 0.18;
  return (
    <g transform={`translate(100,245) scale(${sc})`} opacity={op}>
      <path d="M-45,10 Q-35,-15 -15,-18 Q0,-20 15,-15 Q30,-8 40,5 Q50,15 55,10" fill="none" stroke={c1} strokeWidth={tier === 3 ? 3 : 2} />
      <path d="M55,10 L68,2 L65,12 L55,10" fill={c1} opacity="0.4" stroke={c1} strokeWidth="1.5" />
      <circle cx="64" cy="6" r="1.5" fill={c2 || c1} opacity="0.8" />
      <path d="M-45,10 Q-58,8 -65,15 Q-70,20 -62,18" fill="none" stroke={c1} strokeWidth={tier === 3 ? 2.5 : 1.5} />
      <path d="M-5,-15 Q-15,-38 -30,-45 Q-18,-32 -10,-20" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1.5" />
      <path d="M15,-12 Q25,-35 40,-40 Q28,-28 20,-18" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1.5" />
      <path d="M-20,-8 L-25,10 M10,-5 L8,12" fill="none" stroke={c1} strokeWidth={tier === 3 ? 2 : 1.5} />
      {tier === 3 && (
        <>
          <path d="M-5,-15 Q-20,-48 -38,-55 Q-22,-40 -12,-24" fill={c1} opacity="0.1" stroke={c1} strokeWidth="1" />
          <circle cx="64" cy="6" r="4" fill="none" stroke={c2 || c1} strokeWidth="0.5" opacity="0.3">
            <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </g>
  );
};

const MountWolf = ({ tier, c1, c2 }: MountProps) => {
  if (tier < 2) return null;
  const sc = tier === 3 ? 1.3 : 0.85;
  const op = tier === 3 ? 0.35 : 0.18;
  return (
    <g transform={`translate(100,248) scale(${sc})`} opacity={op}>
      <path d="M-40,5 Q-30,-12 -10,-15 Q10,-16 25,-10 Q38,-2 48,8" fill="none" stroke={c1} strokeWidth={tier === 3 ? 3 : 2} />
      <path d="M48,8 L58,0 L56,10 L48,8" fill={c1} opacity="0.4" stroke={c1} strokeWidth="1.5" />
      <circle cx="55" cy="4" r="1.5" fill={c2 || c1} opacity="0.8" />
      <path d="M48,0 L52,-10 L50,0" fill="none" stroke={c1} strokeWidth="1.5" />
      <path d="M46,2 L50,-8 L48,2" fill="none" stroke={c1} strokeWidth="1.5" />
      <path d="M-40,5 Q-52,2 -58,8 Q-62,12 -55,10 Q-60,6 -56,14" fill="none" stroke={c1} strokeWidth={tier === 3 ? 2 : 1.5} />
      <path d="M-18,-8 L-22,10 M15,-6 L12,12 M35,0 L34,14" fill="none" stroke={c1} strokeWidth={tier === 3 ? 2 : 1.5} />
      {tier === 3 && (
        <circle cx="55" cy="4" r="4" fill="none" stroke={c2 || c1} strokeWidth="0.5" opacity="0.3">
          <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

const MountHawk = ({ tier, c1, c2 }: MountProps) => {
  if (tier < 2) return null;
  const sc = tier === 3 ? 1.3 : 0.85;
  const op = tier === 3 ? 0.35 : 0.18;
  return (
    <g transform={`translate(100,240) scale(${sc})`} opacity={op}>
      <path d="M-8,0 Q0,-5 8,0" fill="none" stroke={c1} strokeWidth="2" />
      <path d="M8,0 L18,-2 L16,3 L8,0" fill={c1} opacity="0.4" />
      <circle cx="15" cy="0" r="1" fill={c2 || c1} />
      <path d="M-8,0 Q-30,-20 -55,-25 Q-35,-12 -20,-5" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1.5">
        <animate attributeName="d" values="M-8,0 Q-30,-20 -55,-25 Q-35,-12 -20,-5;M-8,0 Q-30,-15 -55,-18 Q-35,-8 -20,-3;M-8,0 Q-30,-20 -55,-25 Q-35,-12 -20,-5" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M4,-2 Q26,-22 50,-28 Q32,-14 18,-6" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1.5">
        <animate attributeName="d" values="M4,-2 Q26,-22 50,-28 Q32,-14 18,-6;M4,-2 Q26,-17 50,-21 Q32,-10 18,-4;M4,-2 Q26,-22 50,-28 Q32,-14 18,-6" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M-8,0 L-14,4 Q-16,8 -12,6" fill="none" stroke={c1} strokeWidth="1.5" />
    </g>
  );
};

const MountSerpent = ({ tier, c1, c2 }: MountProps) => {
  if (tier < 2) return null;
  const sc = tier === 3 ? 1.3 : 0.85;
  const op = tier === 3 ? 0.35 : 0.18;
  return (
    <g transform={`translate(100,250) scale(${sc})`} opacity={op}>
      <path d="M-50,0 Q-35,-18 -15,-12 Q5,-6 15,-14 Q30,-22 45,-10 Q55,-2 60,8" fill="none" stroke={c1} strokeWidth={tier === 3 ? 3 : 2} />
      <path d="M60,8 L70,4 L68,12 L60,8" fill={c1} opacity="0.4" stroke={c1} strokeWidth="1.5" />
      <circle cx="66" cy="7" r="1.5" fill={c2 || c1} opacity="0.8" />
      <path d="M-50,0 Q-55,5 -48,4" fill="none" stroke={c1} strokeWidth="1.5" />
      {tier === 3 && (
        <>
          <path d="M-15,-12 Q-10,-25 0,-28 Q-5,-18 -8,-12" fill={c1} opacity="0.12" stroke={c1} strokeWidth="1" />
          <path d="M35,-16 Q40,-28 50,-30 Q42,-20 38,-14" fill={c1} opacity="0.12" stroke={c1} strokeWidth="1" />
        </>
      )}
    </g>
  );
};

const MountSteed = ({ tier, c1, c2 }: MountProps) => {
  if (tier < 2) return null;
  const sc = tier === 3 ? 1.3 : 0.85;
  const op = tier === 3 ? 0.35 : 0.18;
  return (
    <g transform={`translate(100,245) scale(${sc})`} opacity={op}>
      <path d="M-35,5 Q-25,-12 -5,-15 Q15,-16 30,-8 Q42,0 48,10" fill="none" stroke={c1} strokeWidth={tier === 3 ? 3 : 2} />
      <path d="M48,10 Q52,2 58,-5 Q56,5 52,12 L48,10" fill={c1} opacity="0.3" stroke={c1} strokeWidth="1.5" />
      <circle cx="55" cy="-1" r="1.5" fill={c2 || c1} opacity="0.8" />
      <path d="M56,-5 L58,-14 L54,-6" fill="none" stroke={c1} strokeWidth="1.5" />
      <path d="M54,-3 L56,-12 L52,-4" fill="none" stroke={c1} strokeWidth="1.5" />
      <path d="M-35,5 Q-42,0 -38,8 Q-44,4 -40,12" fill="none" stroke={c1} strokeWidth="1.5" />
      <path d="M-15,-8 L-18,14 M10,-8 L8,16 M30,-2 L28,16" fill="none" stroke={c1} strokeWidth={tier === 3 ? 2 : 1.5} />
    </g>
  );
};

const MOUNT_MAP: Record<string, typeof MountDragon> = {
  ER: MountDragon, RS: MountSteed, RM: MountWolf, ES: MountSteed,
  RE: MountSteed, SM: MountSerpent, SE: MountWolf, ME: MountHawk,
  MA: MountSerpent, EA: MountDragon, EX: MountDragon, EM: MountWolf, AS: MountSerpent,
  RA: MountWolf, EAv: MountDragon, REv: MountWolf,
};

interface WeaponProps {
  tier: number;
  handX: number;
  handY: number;
  c1: string;
  c2: string;
}

const WeaponER = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const g = "#C9A456";
  const sl = [30, 40, 55, 72][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX} y2={handY - sl} stroke={c1} strokeWidth={[2, 3, 4, 5][tier]} />
      <circle cx={handX} cy={handY - sl} r={[6, 9, 13, 18][tier]} fill={g} stroke="#E8D5A0" strokeWidth={[1.5, 2, 3, 4][tier]} />
      <line x1={handX - 2} y1={handY - sl - [4, 7, 10, 14][tier]} x2={handX + 2} y2={handY - sl + [4, 7, 10, 14][tier]} stroke="#1a0e30" strokeWidth={[1, 1.5, 2, 3][tier]} />
      {tier >= 1 && Array.from({ length: [0, 3, 7, 14][tier] }, (_, i) => (
        <circle key={i} cx={handX - 5 + i * 2} cy={handY - sl - 6} r={[0, 2, 2.5, 3.5][tier]} fill={g} opacity="0.6">
          <animate attributeName="cy" values={`${handY - sl - 6};${handY - sl - 55}`} dur={`${0.8 + i * 0.1}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur={`${0.8 + i * 0.1}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {tier >= 2 && (
        <circle cx={handX} cy={handY - sl} r={[0, 0, 20, 30][tier]} fill="none" stroke={g} strokeWidth="1" opacity="0.12">
          <animate attributeName="r" values={`${[0, 0, 20, 30][tier]};${[0, 0, 30, 44][tier]};${[0, 0, 20, 30][tier]}`} dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

const WeaponRS = ({ tier, c1, c2 }: WeaponProps) => {
  const sx = 100 - [28, 30, 34, 38][tier] - [18, 22, 28, 36][tier] - [6, 10, 14, 18][tier];
  const sy = [175, 172, 170, 168][tier];
  const shw = [12, 16, 22, 30][tier];
  const shh = [16, 22, 30, 40][tier];
  return (
    <g>
      <path d={`M${sx - shw / 2},${sy - shh / 2} L${sx},${sy + shh / 2} L${sx + shw / 2},${sy - shh / 2} Z`} fill={c1} opacity={[0.15, 0.25, 0.35, 0.45][tier]} stroke={c1} strokeWidth={[1.5, 2, 3, 4][tier]} />
      {tier >= 1 && <path d={`M${sx - shw / 3},${sy - shh / 3} L${sx},${sy + shh / 3} L${sx + shw / 3},${sy - shh / 3}`} fill="none" stroke={c2 || c1} strokeWidth="1" opacity="0.3" />}
      {tier >= 2 && (
        <circle cx={sx} cy={sy - shh / 4} r={[0, 0, 3, 5][tier]} fill={c2 || c1} opacity="0.35">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

const WeaponRM = ({ tier, handX, handY, c1, c2 }: WeaponProps) => {
  const r = "#C0392B";
  const sc = [12, 16, 24, 34][tier];
  return (
    <g transform={`translate(${handX},${handY})`}>
      <circle cx="0" cy={-sc * 0.5} r={sc} fill="none" stroke={r} strokeWidth={[1.5, 2, 3, 4.5][tier]} opacity={[0.25, 0.4, 0.6, 0.85][tier]} />
      <circle cx="0" cy={-sc * 0.5} r={[2, 3, 5, 8][tier]} fill={r} opacity={[0.2, 0.4, 0.65, 1][tier]} />
      <line x1={-sc} y1={-sc * 0.5} x2={-[4, 5, 8, 12][tier]} y2={-sc * 0.5} stroke={r} strokeWidth={[1, 1.5, 2.5, 3.5][tier]} />
      <line x1={[4, 5, 8, 12][tier]} y1={-sc * 0.5} x2={sc} y2={-sc * 0.5} stroke={r} strokeWidth={[1, 1.5, 2.5, 3.5][tier]} />
      <line x1="0" y1={-sc * 0.5 - sc} x2="0" y2={-sc * 0.5 - [4, 5, 8, 12][tier]} stroke={r} strokeWidth={[1, 1.5, 2.5, 3.5][tier]} />
      <line x1="0" y1={-sc * 0.5 + [4, 5, 8, 12][tier]} x2="0" y2={-sc * 0.5 + sc} stroke={r} strokeWidth={[1, 1.5, 2.5, 3.5][tier]} />
      {tier >= 2 && (
        <circle cx="0" cy={-sc * 0.5} r={sc + [0, 0, 10, 18][tier]} fill="none" stroke={r} strokeWidth="0.8" opacity="0.1">
          <animate attributeName="r" values={`${sc + [0, 0, 10, 18][tier]};${sc + [0, 0, 20, 32][tier]};${sc + [0, 0, 10, 18][tier]}`} dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

const WeaponES = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const g = "#E8C76A";
  return (
    <g>
      {Array.from({ length: [1, 2, 3, 5][tier] }, (_, i) => (
        <rect key={i} x={handX - 5 + i * [12, 10, 8, 7][tier] - [0, 5, 10, 14][tier]} y={handY - [20, 28, 38, 50][tier] + i * [8, 6, 5, 4][tier]} width={[8, 10, 14, 18][tier]} height={[8, 10, 14, 18][tier]} fill={c1} opacity={[0.15, 0.2, 0.25, 0.3][tier]} stroke={g} strokeWidth={[1, 1.5, 2, 2.5][tier]} rx="1">
          <animate attributeName="y" values={`${handY - [20, 28, 38, 50][tier] + i * [8, 6, 5, 4][tier]};${handY - [20, 28, 38, 50][tier] + i * [8, 6, 5, 4][tier] - [8, 12, 16, 22][tier]};${handY - [20, 28, 38, 50][tier] + i * [8, 6, 5, 4][tier]}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {tier >= 1 && <text x={handX + [12, 14, 18, 24][tier]} y={handY - [10, 15, 22, 30][tier]} fill={g} fontSize={[8, 11, 14, 20][tier]} fontFamily="serif" opacity={[0.2, 0.4, 0.6, 0.85][tier]}>&#x2211;</text>}
      {tier >= 2 && <text x={handX - [0, 0, 28, 36][tier]} y={handY - [0, 0, 32, 45][tier]} fill={c1} fontSize={[0, 0, 12, 18][tier]} fontFamily="serif" opacity="0.4">&#x03C0;</text>}
    </g>
  );
};

const WeaponRE = ({ tier, c1 }: WeaponProps) => {
  const a = "#FF8A5C";
  return (
    <g>
      {([-1, 1] as const).map((d, i) => {
        const sx = 100 + d * [28, 30, 34, 38][tier];
        const ex = sx + d * [20, 25, 30, 36][tier];
        const hx = ex + d * [12, 16, 20, 26][tier];
        return (
          <g key={i}>
            <circle cx={hx} cy={[148, 145, 142, 138][tier]} r={[0, 8, 14, 22][tier]} fill="none" stroke={c1} strokeWidth={[0, 2, 3.5, 5][tier]} opacity={[0, 0.2, 0.35, 0.55][tier]}>
              <animate attributeName="r" values={`${[0, 6, 10, 16][tier]};${[0, 14, 22, 34][tier]};${[0, 6, 10, 16][tier]}`} dur="1.2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
              <animate attributeName="opacity" values={`${[0, 0.2, 0.35, 0.55][tier]};0;${[0, 0.2, 0.35, 0.55][tier]}`} dur="1.2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
            </circle>
            {tier >= 3 && (
              <circle cx={hx} cy={138} r="32" fill="none" stroke={a} strokeWidth="1" opacity="0.06">
                <animate attributeName="r" values="28;40;28" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
              </circle>
            )}
          </g>
        );
      })}
    </g>
  );
};

const WeaponSM = ({ tier, c1 }: WeaponProps) => (
  <g>
    <circle cx="100" cy={[155, 148, 140, 128][tier]} r={[5, 8, 14, 22][tier]} fill="none" stroke={c1} strokeWidth={[1, 2, 3, 4][tier]} opacity={[0.15, 0.3, 0.5, 0.7][tier]}>
      <animate attributeName="r" values={`${[5, 8, 14, 22][tier]};${[9, 16, 24, 36][tier]};${[5, 8, 14, 22][tier]}`} dur={`${2.5 - tier * 0.3}s`} repeatCount="indefinite" />
    </circle>
    <circle cx="100" cy={[155, 148, 140, 128][tier]} r={[2, 4, 7, 12][tier]} fill={c1} opacity={[0.1, 0.25, 0.4, 0.65][tier]}>
      <animate attributeName="opacity" values={`${[0.05, 0.15, 0.25, 0.45][tier]};${[0.15, 0.4, 0.6, 0.85][tier]};${[0.05, 0.15, 0.25, 0.45][tier]}`} dur="2s" repeatCount="indefinite" />
    </circle>
    {tier >= 3 && (
      <circle cx="100" cy={128} r="32" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.06">
        <animate attributeName="r" values="32;44;32" dur="2s" repeatCount="indefinite" />
      </circle>
    )}
  </g>
);

const WeaponSE = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const a = "#4AFF9E";
  const bl = [15, 22, 32, 45][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX} y2={handY - bl} stroke={c1} strokeWidth={[2, 3, 4, 5.5][tier]} opacity={[0.3, 0.5, 0.7, 0.9][tier]} />
      <line x1={handX} y1={handY - bl} x2={handX} y2={handY - bl - [4, 6, 8, 12][tier]} stroke={a} strokeWidth={[1, 1.5, 2, 3][tier]} opacity="0.5" />
      {tier >= 1 && (
        <g opacity={[0, 0.3, 0.5, 0.75][tier]}>
          <text x={handX - [0, 8, 14, 20][tier]} y={handY - bl / 2} fill={c1} fontSize={[0, 7, 9, 12][tier]} fontFamily="monospace">01</text>
          <text x={handX + [0, 4, 8, 10][tier]} y={handY - bl / 2 + 10} fill={a} fontSize={[0, 6, 8, 10][tier]} fontFamily="monospace">if</text>
        </g>
      )}
    </g>
  );
};

const WeaponME = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const bl = [12, 18, 28, 40][tier];
  return (
    <g>
      <path d={`M${handX},${handY} L${handX + [4, 6, 8, 12][tier]},${handY - bl * 0.4} L${handX - [2, 3, 4, 6][tier]},${handY - bl * 0.6} L${handX + [3, 5, 7, 10][tier]},${handY - bl}`} fill="none" stroke={c1} strokeWidth={[2, 3, 4, 6][tier]} opacity={[0.3, 0.5, 0.65, 0.85][tier]}>
        <animate attributeName="opacity" values={`${[0.2, 0.3, 0.45, 0.65][tier]};${[0.05, 0.1, 0.15, 0.2][tier]};${[0.2, 0.3, 0.45, 0.65][tier]}`} dur="0.6s" repeatCount="indefinite" />
      </path>
    </g>
  );
};

const WeaponMA = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const sl = [25, 35, 48, 65][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX} y2={handY - sl} stroke={c1} strokeWidth={[2, 3, 4, 5][tier]} />
      <path d={`M${handX - [4, 6, 10, 14][tier]},${handY - sl} L${handX},${handY - sl - [8, 12, 18, 26][tier]} L${handX + [4, 6, 10, 14][tier]},${handY - sl}`} fill="none" stroke={c1} strokeWidth={[1.5, 2, 3, 4][tier]} />
      {tier >= 1 && (
        <>
          <path d={`M${handX - [0, 4, 8, 12][tier]},${handY - sl} L${handX - [0, 6, 10, 16][tier]},${handY - sl - [0, 6, 10, 16][tier]}`} fill="none" stroke={c1} strokeWidth={[0, 1.5, 2, 3][tier]} />
          <path d={`M${handX + [0, 4, 8, 12][tier]},${handY - sl} L${handX + [0, 6, 10, 16][tier]},${handY - sl - [0, 6, 10, 16][tier]}`} fill="none" stroke={c1} strokeWidth={[0, 1.5, 2, 3][tier]} />
        </>
      )}
    </g>
  );
};

const WeaponEX = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const g = "#F0C850";
  const sl = [24, 36, 50, 68][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX} y2={handY - sl * 0.45} stroke="#555" strokeWidth={[2, 3, 4, 5][tier]} />
      <path d={`M${handX - [4, 6, 8, 11][tier]},${handY - sl * 0.45} L${handX},${handY - sl} L${handX + [4, 6, 8, 11][tier]},${handY - sl * 0.45} Z`} fill={c1} opacity={[0.25, 0.4, 0.55, 0.75][tier]} stroke={g} strokeWidth={[1.5, 2, 3, 4][tier]} />
      {tier >= 1 && <line x1={handX - [0, 5, 8, 12][tier]} y1={handY - sl * 0.45} x2={handX + [0, 5, 8, 12][tier]} y2={handY - sl * 0.45} stroke={g} strokeWidth={[0, 2, 3, 4][tier]} />}
      {tier >= 2 && <circle cx={handX} cy={handY - sl * 0.72} r={[0, 0, 4, 7][tier]} fill={g} opacity={0.35}>
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
      </circle>}
      {tier === 3 && Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={handX + (i - 2) * 6} cy={handY - sl - 4} r={1.5} fill={g} opacity={0.5}>
          <animate attributeName="cy" values={`${handY - sl - 4};${handY - sl - 14};${handY - sl - 4}`} dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
};

const WeaponEA = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const a = "#FF9A6C";
  const sl = [18, 28, 40, 55][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX} y2={handY - sl * 0.4} stroke="#555" strokeWidth={[2, 3, 4, 5][tier]} />
      <path d={`M${handX - [3, 4, 6, 8][tier]},${handY - sl * 0.4} L${handX},${handY - sl} L${handX + [3, 4, 6, 8][tier]},${handY - sl * 0.4}`} fill={c1} opacity={[0.2, 0.35, 0.5, 0.7][tier]} stroke={c1} strokeWidth={[1.5, 2, 3, 4][tier]} />
      {tier >= 2 && (
        <path d={`M${handX},${handY - sl} Q${handX - [0, 0, 5, 8][tier]},${handY - sl - [0, 0, 10, 18][tier]} ${handX},${handY - sl - [0, 0, 15, 25][tier]}`} fill="none" stroke={a} strokeWidth="1.5" opacity="0.25">
          <animate attributeName="opacity" values="0.15;0.4;0.15" dur="0.8s" repeatCount="indefinite" />
        </path>
      )}
    </g>
  );
};

const WeaponEM = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const sl = [20, 30, 42, 58][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX} y2={handY - sl} stroke={c1} strokeWidth={[2, 3, 4, 5][tier]} />
      <circle cx={handX} cy={handY - sl} r={[4, 6, 8, 12][tier]} fill="none" stroke={c1} strokeWidth={[1, 1.5, 2, 3][tier]} opacity={[0.2, 0.35, 0.5, 0.7][tier]} />
      {tier >= 1 && [0, 1, 2].map(i => (
        <line key={i} x1={handX} y1={handY - sl} x2={handX + [0, 8, 12, 18][tier] * Math.cos(i * 2.1 - 1)} y2={handY - sl + [0, 8, 12, 18][tier] * Math.sin(i * 2.1 - 1)} stroke={c1} strokeWidth="1" opacity={[0, 0.2, 0.35, 0.5][tier]} />
      ))}
    </g>
  );
};

const WeaponAS = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const s = "#1ABC9C";
  const r = [6, 10, 16, 24][tier];
  return (
    <g>
      <circle cx={handX} cy={handY - r * 1.5} r={r} fill="none" stroke={c1} strokeWidth={[1, 2, 3, 4][tier]} opacity={[0.15, 0.3, 0.5, 0.7][tier]} />
      {tier >= 1 && <circle cx={handX} cy={handY - r * 1.5} r={r * 0.5} fill={s} opacity={[0, 0.15, 0.3, 0.5][tier]} />}
    </g>
  );
};

const WeaponRA = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const sl = [18, 26, 38, 52][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX} y2={handY - sl} stroke={c1} strokeWidth={[2, 3, 4, 5][tier]} />
      <rect x={handX - [5, 7, 10, 14][tier]} y={handY - sl - [5, 7, 10, 14][tier]} width={[10, 14, 20, 28][tier]} height={[10, 14, 20, 28][tier]} fill={c1} opacity={[0.15, 0.25, 0.35, 0.5][tier]} stroke={c1} strokeWidth={[1, 1.5, 2, 3][tier]} rx="2" />
      {tier >= 2 && (
        <circle cx={handX} cy={handY - sl} r={[0, 0, 14, 22][tier]} fill="none" stroke={c1} strokeWidth="0.8" opacity="0.08">
          <animate attributeName="r" values={`${[0, 0, 14, 22][tier]};${[0, 0, 22, 34][tier]};${[0, 0, 14, 22][tier]}`} dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

const WeaponEAv = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const s = "#E8D5F5";
  const sl = [22, 32, 45, 62][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX} y2={handY - sl} stroke={c1} strokeWidth={[2, 3, 4, 5][tier]} />
      <circle cx={handX} cy={handY - sl} r={[5, 8, 12, 18][tier]} fill={c1} opacity={[0.08, 0.15, 0.25, 0.4][tier]}>
        <animate attributeName="opacity" values={`${[0.05, 0.1, 0.18, 0.28][tier]};${[0.12, 0.25, 0.38, 0.55][tier]};${[0.05, 0.1, 0.18, 0.28][tier]}`} dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={handX} cy={handY - sl} r={[5, 8, 12, 18][tier]} fill="none" stroke={s} strokeWidth={[1, 1.5, 2.5, 3.5][tier]} opacity={[0.2, 0.35, 0.5, 0.75][tier]} />
      {tier >= 2 && (
        <circle cx={handX} cy={handY - sl} r={[0, 0, 18, 28][tier]} fill="none" stroke={s} strokeWidth="0.8" opacity="0.08">
          <animate attributeName="r" values={`${[0, 0, 18, 28][tier]};${[0, 0, 28, 42][tier]};${[0, 0, 18, 28][tier]}`} dur="2.5s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

const WeaponREv = ({ tier, handX, handY, c1 }: WeaponProps) => {
  const r = "#DC143C";
  const sl = [22, 32, 48, 68][tier];
  return (
    <g>
      <line x1={handX} y1={handY} x2={handX + [2, 3, 4, 6][tier]} y2={handY - sl} stroke="#888" strokeWidth={[2, 2.5, 3.5, 4.5][tier]} />
      <line x1={handX - [3, 4, 6, 8][tier]} y1={handY} x2={handX + [3, 4, 6, 8][tier]} y2={handY} stroke={c1} strokeWidth={[2, 3, 4, 5][tier]} />
      {tier >= 1 && <path d={`M${handX + [2, 3, 4, 6][tier]},${handY - sl} L${handX + [3, 4, 6, 8][tier]},${handY - sl - [4, 6, 10, 16][tier]}`} fill="none" stroke="#aaa" strokeWidth={[1, 1.5, 2, 3][tier]} />}
      {tier >= 2 && (
        <line x1={handX + [0, 0, 4, 6][tier]} y1={handY - sl} x2={handX + [0, 0, 4, 6][tier]} y2={handY - sl - [0, 0, 10, 16][tier]} stroke={r} strokeWidth="1.5" opacity="0.3">
          <animate attributeName="opacity" values="0.15;0.45;0.15" dur="1s" repeatCount="indefinite" />
        </line>
      )}
    </g>
  );
};

const WEAPONS: Record<string, (props: WeaponProps) => JSX.Element> = {
  ER: WeaponER, RS: WeaponRS, RM: WeaponRM, ES: WeaponES,
  RE: WeaponRE, SM: WeaponSM, SE: WeaponSE, ME: WeaponME,
  MA: WeaponMA, EA: WeaponEA, EX: WeaponEX, EM: WeaponEM, AS: WeaponAS,
  RA: WeaponRA, EAv: WeaponEAv, REv: WeaponREv,
};

interface CharacterSVGProps {
  type: string;
  size: number;
  tier?: number;
  animated?: boolean;
}

export default function CharacterSVG({ type, size, tier = 0, animated = false }: CharacterSVGProps) {
  const char = CHARACTERS[type];
  if (!char) return null;
  const { primary: p, accent: a, dark: dk } = char.colors;
  const Mount = MOUNT_MAP[type];
  const WeaponFn = WEAPONS[type];

  const rsx = 100 + [28, 30, 34, 38][tier];
  const relx = rsx + [18, 22, 28, 34][tier];
  const rhx = relx + [10, 14, 18, 22][tier];
  const rhy = [108, 102, 95, 85][tier];

  const rightPose: "up" | "out" = ["ER", "RM", "ES", "SE", "ME", "MA", "EA", "EM", "AS", "RA", "EAv", "REv"].includes(type) ? "up" : "out";
  const leftPose: "down" | "out" = ["RS", "RE"].includes(type) ? "out" : "down";

  const weaponHandX = rightPose === "up" ? rhx : relx + [12, 16, 20, 26][tier];
  const weaponHandY = rightPose === "up" ? rhy : [148, 145, 142, 138][tier];

  const rightArmPivotX = rsx;
  const rightArmPivotY = 110;
  const leftArmPivotX = 100 - [28, 30, 34, 38][tier];
  const leftArmPivotY = 110;

  return (
    <svg viewBox="-30 -60 260 360" width={size} height={size * 1.38}>
      <Aura tier={tier} color={p} />
      <Wings tier={tier} c1={a} c2={p} />
      {Mount && <Mount tier={tier} c1={a} c2={p} />}
      <Armor tier={tier} c1={a} c2={p} />
      <Body tier={tier} primary={p} accent={a} dark={dk} />
      <Shoulders tier={tier} accent={a} dark={dk} />

      {animated ? (
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0 ${leftArmPivotX} ${leftArmPivotY}; 6 ${leftArmPivotX} ${leftArmPivotY}; 0 ${leftArmPivotX} ${leftArmPivotY}; -4 ${leftArmPivotX} ${leftArmPivotY}; 0 ${leftArmPivotX} ${leftArmPivotY}`}
            dur="4s"
            repeatCount="indefinite"
          />
          <Arm tier={tier} dir={-1} pose={leftPose} accent={a} dark={dk} />
        </g>
      ) : (
        <Arm tier={tier} dir={-1} pose={leftPose} accent={a} dark={dk} />
      )}

      {animated ? (
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0 ${rightArmPivotX} ${rightArmPivotY}; -8 ${rightArmPivotX} ${rightArmPivotY}; 0 ${rightArmPivotX} ${rightArmPivotY}; 5 ${rightArmPivotX} ${rightArmPivotY}; 0 ${rightArmPivotX} ${rightArmPivotY}`}
            dur="3.5s"
            repeatCount="indefinite"
          />
          <Arm tier={tier} dir={1} pose={rightPose} accent={a} dark={dk} />
          {WeaponFn && <WeaponFn tier={tier} handX={weaponHandX} handY={weaponHandY} c1={a} c2={p} />}
        </g>
      ) : (
        <>
          <Arm tier={tier} dir={1} pose={rightPose} accent={a} dark={dk} />
          {WeaponFn && <WeaponFn tier={tier} handX={weaponHandX} handY={weaponHandY} c1={a} c2={p} />}
        </>
      )}

      {animated ? (
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 100 60; -2 100 60; 0 100 60; 2 100 60; 0 100 60"
            dur="5s"
            repeatCount="indefinite"
          />
          <Head
            tier={tier}
            primary={p}
            accent={a}
            eyeColor={type === "ER" && tier >= 3 ? "#C9A456" : type === "RM" ? "#C0392B" : type === "RE" ? "#FF8A5C" : undefined}
          />
        </g>
      ) : (
        <Head
          tier={tier}
          primary={p}
          accent={a}
          eyeColor={type === "ER" && tier >= 3 ? "#C9A456" : type === "RM" ? "#C0392B" : type === "RE" ? "#FF8A5C" : undefined}
        />
      )}

      {!animated && WeaponFn && null}
      {type === "RS" && WeaponRS({ tier, handX: 0, handY: 0, c1: a, c2: "#A0785A" })}
      {type === "SM" && WeaponSM({ tier, handX: 0, handY: 0, c1: a, c2: p })}
      {type === "RE" && WeaponRE({ tier, handX: 0, handY: 0, c1: "#E8622E", c2: "#FF8A5C" })}
      <Burst tier={tier} color={a} />
      <ellipse cx="100" cy="278" rx={[50, 58, 66, 78][tier]} ry={[6, 8, 12, 16][tier]} fill={p} opacity={[0.06, 0.12, 0.2, 0.3][tier]} />
    </svg>
  );
}
