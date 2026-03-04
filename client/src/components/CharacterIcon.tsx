import { traderTypes } from "@/data/traderTypes";

interface CharacterIconProps {
  typeCode: string;
  size?: number;
  className?: string;
}

export default function CharacterIcon({ typeCode, size = 180, className = '' }: CharacterIconProps) {
  const type = traderTypes[typeCode];
  if (!type) return null;
  const [c1, c2] = type.colors;

  const icons: Record<string, JSX.Element> = {
    ER: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <defs>
          <pattern id={`grid-${typeCode}`} width="15" height="15" patternUnits="userSpaceOnUse">
            <rect width="15" height="15" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.3"/>
          </pattern>
          <radialGradient id={`glow-${typeCode}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={c1} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="55" fill={`url(#grid-${typeCode})`} />
        <circle cx="60" cy="60" r="55" fill={`url(#glow-${typeCode})`}>
          <animate attributeName="r" values="50;55;50" dur="3s" repeatCount="indefinite"/>
        </circle>
        <ellipse cx="60" cy="60" rx="40" ry="22" fill="none" stroke={c2} strokeWidth="2"/>
        <circle cx="60" cy="60" r="14" fill="none" stroke={c1} strokeWidth="2.5">
          <animate attributeName="r" values="14;16;14" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="60" r="6" fill="#C9A456">
          <animate attributeName="r" values="6;4;6" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="54" cy="55" r="3" fill="white" opacity="0.7"/>
      </svg>
    ),
    RS: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <defs>
          <linearGradient id={`shield-${typeCode}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1}/>
            <stop offset="100%" stopColor={c2}/>
          </linearGradient>
        </defs>
        <path d="M60 15 L95 35 V70 C95 90 60 108 60 108 C60 108 25 90 25 70 V35 Z" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.8">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/>
        </path>
        <circle cx="60" cy="62" r="16" fill="none" stroke={c2} strokeWidth="2"/>
        <circle cx="60" cy="62" r="8" fill="none" stroke={c2} strokeWidth="1.5"/>
        <line x1="60" y1="46" x2="60" y2="78" stroke={c2} strokeWidth="1" opacity="0.5"/>
        <line x1="44" y1="62" x2="76" y2="62" stroke={c2} strokeWidth="1" opacity="0.5"/>
        <rect x="55" y="57" width="10" height="10" rx="2" fill={c1} opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite"/>
        </rect>
      </svg>
    ),
    RM: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <circle cx="60" cy="60" r="35" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4"/>
        <circle cx="60" cy="60" r="25" fill="none" stroke={c1} strokeWidth="1" opacity="0.3"/>
        <circle cx="60" cy="60" r="15" fill="none" stroke={c1} strokeWidth="1" opacity="0.5"/>
        <line x1="60" y1="20" x2="60" y2="100" stroke={c2} strokeWidth="1" opacity="0.5"/>
        <line x1="20" y1="60" x2="100" y2="60" stroke={c2} strokeWidth="1" opacity="0.5"/>
        <circle cx="60" cy="60" r="4" fill={c2}>
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <polyline points="20,75 40,70 55,60 60,55 65,50 80,48 100,45" fill="none" stroke={c2} strokeWidth="1" opacity="0.3"/>
      </svg>
    ),
    ES: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <defs>
          <linearGradient id={`build-${typeCode}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={c1} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        <rect x="35" y="75" width="20" height="25" rx="2" fill={c1} opacity="0.5"/>
        <rect x="60" y="55" width="20" height="45" rx="2" fill={c1} opacity="0.65"/>
        <rect x="45" y="35" width="25" height="20" rx="2" fill={c1} opacity="0.4"/>
        <polygon points="60,15 75,35 45,35" fill="none" stroke={c1} strokeWidth="2">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
        </polygon>
        <line x1="25" y1="100" x2="95" y2="100" stroke={c2} strokeWidth="1" opacity="0.3"/>
        <line x1="25" y1="75" x2="95" y2="75" stroke={c2} strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4"/>
        <line x1="25" y1="55" x2="95" y2="55" stroke={c2} strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4"/>
      </svg>
    ),
    RE: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <line x1="60" y1="15" x2="60" y2="85" stroke={c1} strokeWidth="3" strokeLinecap="round"/>
        <polygon points="48,85 60,105 72,85" fill={c1}/>
        <line x1="40" y1="35" x2="60" y2="15" stroke={c1} strokeWidth="2" strokeLinecap="round"/>
        <line x1="80" y1="35" x2="60" y2="15" stroke={c1} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="60" cy="60" r="45" fill="none" stroke={c1} strokeWidth="1" opacity="0.15"/>
        <path d="M35,95 Q60,88 85,95" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.4"/>
        <circle cx="60" cy="15" r="3" fill="#C9A456">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    ),
    SM: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <ellipse cx="60" cy="55" rx="38" ry="30" fill="none" stroke={c1} strokeWidth="2" opacity="0.7"/>
        <path d="M35,55 L45,45 L55,55 L50,65 L60,55 L70,65 L65,55 L75,45 L85,55" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.5"/>
        <circle cx="60" cy="55" r="8" fill={c1} opacity="0.3">
          <animate attributeName="r" values="7;10;7" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="55" r="3" fill={c2} opacity="0.8"/>
        <path d="M40,85 Q50,78 60,85 Q70,92 80,85" fill="none" stroke={c1} strokeWidth="1" opacity="0.3"/>
      </svg>
    ),
    SE: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <rect x="35" y="25" width="50" height="70" rx="4" fill="none" stroke={c1} strokeWidth="2" opacity="0.6"/>
        <line x1="35" y1="40" x2="85" y2="40" stroke={c1} strokeWidth="1" opacity="0.3"/>
        <line x1="35" y1="55" x2="85" y2="55" stroke={c1} strokeWidth="1" opacity="0.3"/>
        <line x1="35" y1="70" x2="85" y2="70" stroke={c1} strokeWidth="1" opacity="0.3"/>
        <line x1="60" y1="25" x2="60" y2="95" stroke={c1} strokeWidth="1" opacity="0.3"/>
        <circle cx="50" cy="48" r="3" fill={c1} opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="70" cy="63" r="3" fill={c1} opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
        </circle>
        <circle cx="50" cy="78" r="3" fill={c1} opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin="1s"/>
        </circle>
        <line x1="50" y1="48" x2="70" y2="63" stroke={c1} strokeWidth="1" opacity="0.5"/>
        <line x1="70" y1="63" x2="50" y2="78" stroke={c1} strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
    ME: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <defs>
          <linearGradient id={`bolt-${typeCode}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1}/>
            <stop offset="100%" stopColor={c2}/>
          </linearGradient>
        </defs>
        <polygon points="65,10 45,55 58,55 40,110 80,50 62,50 80,10" fill={`url(#bolt-${typeCode})`} opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
        </polygon>
        <line x1="20" y1="30" x2="40" y2="30" stroke={c1} strokeWidth="1" opacity="0.3">
          <animate attributeName="x2" values="35;45;35" dur="2s" repeatCount="indefinite"/>
        </line>
        <line x1="80" y1="70" x2="100" y2="70" stroke={c1} strokeWidth="1" opacity="0.3">
          <animate attributeName="x1" values="75;85;75" dur="2s" repeatCount="indefinite"/>
        </line>
        <line x1="25" y1="50" x2="38" y2="50" stroke={c1} strokeWidth="0.5" opacity="0.2"/>
        <line x1="82" y1="55" x2="95" y2="55" stroke={c1} strokeWidth="0.5" opacity="0.2"/>
      </svg>
    ),
    MA: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <path d="M10,70 Q30,40 50,65 Q70,90 90,55 Q100,40 110,50" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.7">
          <animate attributeName="d" values="M10,70 Q30,40 50,65 Q70,90 90,55 Q100,40 110,50;M10,65 Q30,45 50,60 Q70,85 90,50 Q100,45 110,55;M10,70 Q30,40 50,65 Q70,90 90,55 Q100,40 110,50" dur="4s" repeatCount="indefinite"/>
        </path>
        <path d="M10,80 Q30,55 50,75 Q70,95 90,65 Q100,50 110,60" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.3">
          <animate attributeName="d" values="M10,80 Q30,55 50,75 Q70,95 90,65 Q100,50 110,60;M10,75 Q30,60 50,70 Q70,90 90,60 Q100,55 110,65;M10,80 Q30,55 50,75 Q70,95 90,65 Q100,50 110,60" dur="4s" repeatCount="indefinite"/>
        </path>
        <circle cx="75" cy="55" r="5" fill={c2} opacity="0.6">
          <animate attributeName="cy" values="55;50;55" dur="3s" repeatCount="indefinite"/>
        </circle>
      </svg>
    ),
    EA: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <defs>
          <radialGradient id={`flame-${typeCode}`} cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={c2} stopOpacity="0.1"/>
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="90" rx="30" ry="15" fill={c1} opacity="0.15"/>
        <path d="M60,20 Q45,50 55,60 Q40,45 50,75 Q55,90 60,95 Q65,90 70,75 Q80,45 65,60 Q75,50 60,20" fill={`url(#flame-${typeCode})`}>
          <animate attributeName="d" values="M60,20 Q45,50 55,60 Q40,45 50,75 Q55,90 60,95 Q65,90 70,75 Q80,45 65,60 Q75,50 60,20;M60,18 Q43,48 53,58 Q38,43 48,73 Q53,88 60,93 Q67,88 72,73 Q82,43 67,58 Q77,48 60,18;M60,20 Q45,50 55,60 Q40,45 50,75 Q55,90 60,95 Q65,90 70,75 Q80,45 65,60 Q75,50 60,20" dur="2s" repeatCount="indefinite"/>
        </path>
        <circle cx="60" cy="65" r="8" fill="none" stroke="#C9A456" strokeWidth="1.5" opacity="0.6"/>
        <line x1="60" y1="57" x2="60" y2="50" stroke="#C9A456" strokeWidth="1.5" opacity="0.6"/>
        <line x1="60" y1="73" x2="60" y2="80" stroke="#C9A456" strokeWidth="1.5" opacity="0.6"/>
        <line x1="52" y1="65" x2="45" y2="65" stroke="#C9A456" strokeWidth="1.5" opacity="0.6"/>
        <line x1="68" y1="65" x2="75" y2="65" stroke="#C9A456" strokeWidth="1.5" opacity="0.6"/>
      </svg>
    ),
    EM: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <defs>
          <linearGradient id={`mask-${typeCode}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c1}/>
            <stop offset="50%" stopColor={c1}/>
            <stop offset="50%" stopColor={c2}/>
            <stop offset="100%" stopColor={c2}/>
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="58" rx="30" ry="35" fill="none" stroke={`url(#mask-${typeCode})`} strokeWidth="2"/>
        <circle cx="47" cy="50" r="6" fill="none" stroke={c1} strokeWidth="1.5"/>
        <circle cx="73" cy="50" r="6" fill="none" stroke={c2} strokeWidth="1.5"/>
        <circle cx="47" cy="50" r="2" fill="#C9A456">
          <animate attributeName="r" values="2;3;2" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="73" cy="50" r="2" fill="#C9A456">
          <animate attributeName="r" values="2;3;2" dur="3s" repeatCount="indefinite" begin="1.5s"/>
        </circle>
        <path d="M45,70 Q60,78 75,70" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5"/>
      </svg>
    ),
    EX: (
      <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
        <polygon points="60,15 70,45 100,45 76,63 84,95 60,77 36,95 44,63 20,45 50,45" fill="none" stroke={c1} strokeWidth="2" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
        </polygon>
        <polygon points="60,30 66,48 85,48 70,58 75,78 60,67 45,78 50,58 35,48 54,48" fill={c1} opacity="0.2"/>
        <circle cx="60" cy="55" r="10" fill="none" stroke="#C9A456" strokeWidth="1.5"/>
        <circle cx="60" cy="55" r="4" fill="#C9A456" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    ),
  };

  const icon = icons[typeCode] || (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className}>
      <circle cx="60" cy="60" r="40" fill="none" stroke={c1} strokeWidth="2" opacity="0.5"/>
      <text x="60" y="68" textAnchor="middle" fill={c1} fontSize="28">{type.icon}</text>
    </svg>
  );

  return <div data-testid={`character-icon-${typeCode}`}>{icon}</div>;
}
