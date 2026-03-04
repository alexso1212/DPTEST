import { useId } from "react";

interface AlbionProps {
  size: number;
  uid: string;
}

function AlbionStrategist({ size, uid }: AlbionProps) {
  const gid = `${uid}-er-coat`;
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a1f5e" /><stop offset="100%" stopColor="#1a0e30" />
        </linearGradient>
      </defs>
      <path d="M70,100 L60,260 L140,260 L130,100" fill={`url(#${gid})`} stroke="#4a2870" strokeWidth="2"/>
      <path d="M60,260 L50,280 L75,275 L100,280 L125,275 L150,280 L140,260" fill="#1a0e30" stroke="#4a2870" strokeWidth="1.5"/>
      <path d="M82,110 L78,250 L122,250 L118,110" fill="#6B3FA0" opacity="0.15"/>
      <path d="M78,100 L72,70 L88,78 L85,100" fill="#2a1545" stroke="#4a2870" strokeWidth="1.5"/>
      <path d="M115,100 L112,78 L128,70 L122,100" fill="#2a1545" stroke="#4a2870" strokeWidth="1.5"/>
      <ellipse cx="72" cy="105" rx="18" ry="8" fill="#3a3a4a" stroke="#5a5a6a" strokeWidth="1.5"/>
      <ellipse cx="128" cy="105" rx="18" ry="8" fill="#3a3a4a" stroke="#5a5a6a" strokeWidth="1.5"/>
      <ellipse cx="100" cy="55" rx="22" ry="26" fill="#1e1430"/>
      <path d="M84,68 Q100,82 116,68" fill="none" stroke="#4a3a5a" strokeWidth="2"/>
      <circle cx="92" cy="50" r="2" fill="#C9A456" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="108" cy="50" r="2" fill="#C9A456" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <g transform="translate(148, 140)">
        <circle cx="0" cy="0" r="14" fill="#C9A456" stroke="#E8D5A0" strokeWidth="1.5"/>
        <line x1="-3" y1="-10" x2="4" y2="8" stroke="#1a0e30" strokeWidth="1.5"/>
        <line x1="-8" y1="2" x2="6" y2="-4" stroke="#1a0e30" strokeWidth="1"/>
        {[0,1,2,3].map(i => (
          <circle key={i} cx={-6+i*5} cy={-16} r="2" fill="#C9A456" opacity="0.6">
            <animate attributeName="cy" values={`${-16}`+`;${-40}`} dur={`${1.2+i*0.3}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;0" dur={`${1.2+i*0.3}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </g>
      <g opacity="0.5">
        <path d="M45,100 L40,88 L50,88 Z" fill="none" stroke="#C8C8D0" strokeWidth="1.5"/>
        <line x1="45" y1="83" x2="45" y2="88" stroke="#C8C8D0" strokeWidth="1.5"/>
        <line x1="42" y1="85" x2="48" y2="85" stroke="#C8C8D0" strokeWidth="1.5"/>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="4s" repeatCount="indefinite"/>
      </g>
      <g opacity="0.35">
        <rect x="149" y="95" width="12" height="14" rx="1" fill="none" stroke="#6B3FA0" strokeWidth="1.5"/>
        <rect x="150" y="91" width="4" height="4" fill="none" stroke="#6B3FA0" strokeWidth="1"/>
        <rect x="156" y="91" width="4" height="4" fill="none" stroke="#6B3FA0" strokeWidth="1"/>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="5s" repeatCount="indefinite"/>
      </g>
      <ellipse cx="100" cy="275" rx="50" ry="8" fill="#6B3FA0" opacity="0.2"/>
    </svg>
  );
}

function AlbionCommander({ size, uid }: AlbionProps) {
  const gid = `${uid}-rs-armor`;
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a6a90" /><stop offset="100%" stopColor="#2a3a50" />
        </linearGradient>
      </defs>
      <path d="M65,105 L58,250 L142,250 L135,105" fill={`url(#${gid})`} stroke="#5B8AB5" strokeWidth="2"/>
      <line x1="100" y1="105" x2="100" y2="250" stroke="#A0785A" strokeWidth="1" opacity="0.5"/>
      <path d="M50,100 L65,85 L80,100 L65,115 Z" fill="#4a5a6a" stroke="#6a7a8a" strokeWidth="2"/>
      <path d="M120,100 L135,85 L150,100 L135,115 Z" fill="#4a5a6a" stroke="#6a7a8a" strokeWidth="2"/>
      {[70,85,100,115,130].map(x => (
        <circle key={x} cx={x} cy="115" r="2.5" fill="#A0785A" stroke="#806040" strokeWidth="0.5"/>
      ))}
      <rect x="85" y="75" width="30" height="30" rx="5" fill="#3a4a5a" stroke="#5B8AB5" strokeWidth="1"/>
      <path d="M80,35 L80,65 Q100,75 120,65 L120,35 Q100,25 80,35" fill="#3a4a5a" stroke="#5B8AB5" strokeWidth="1.5"/>
      <path d="M85,48 L115,48" stroke="#A0785A" strokeWidth="2.5"/>
      <path d="M85,48 L115,48" stroke="#2C3E6B" strokeWidth="1.5"/>
      <rect x="88" y="46" width="24" height="4" rx="2" fill="#3D5A80" opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite"/>
      </rect>
      <g transform="translate(38, 130)">
        <path d="M0,0 L20,0 L20,50 L10,60 L0,50 Z" fill="#3D5A80" stroke="#5B8AB5" strokeWidth="2"/>
        <line x1="10" y1="5" x2="10" y2="55" stroke="#A0785A" strokeWidth="1.5"/>
        <line x1="3" y1="25" x2="17" y2="25" stroke="#A0785A" strokeWidth="1.5"/>
        <path d="M0,0 L20,0 L20,50 L10,60 L0,50 Z" fill="#5B8AB5" opacity="0.15">
          <animate attributeName="opacity" values="0.05;0.25;0.05" dur="2s" repeatCount="indefinite"/>
        </path>
      </g>
      <g transform="translate(145, 135)" opacity="0.6">
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x={-8+i*3} y={i*16} width="25" height="12" rx="2" fill="none" stroke="#5B8AB5" strokeWidth="0.8"/>
            <line x1={-5+i*3} y1={i*16+4} x2={14+i*3} y2={i*16+4} stroke="#A0785A" strokeWidth="0.5" opacity="0.5"/>
            <line x1={-5+i*3} y1={i*16+8} x2={8+i*3} y2={i*16+8} stroke="#A0785A" strokeWidth="0.5" opacity="0.3"/>
          </g>
        ))}
      </g>
      <circle cx="100" cy="155" r="12" fill="none" stroke="#A0785A" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="100" cy="155" r="6" fill="none" stroke="#A0785A" strokeWidth="1" opacity="0.3"/>
      {[0,60,120,180,240,300].map(a => {
        const r = (a*Math.PI)/180;
        return <line key={a} x1={100+Math.cos(r)*10} y1={155+Math.sin(r)*10} x2={100+Math.cos(r)*14} y2={155+Math.sin(r)*14} stroke="#A0785A" strokeWidth="2" opacity="0.4"/>;
      })}
      <ellipse cx="100" cy="270" rx="50" ry="8" fill="#3D5A80" opacity="0.2"/>
    </svg>
  );
}

function AlbionHunter({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M60,200 L55,270 M140,200 L145,270" stroke="#2a3a2e" strokeWidth="3"/>
      <path d="M55,200 L145,200" stroke="#2a3a2e" strokeWidth="3"/>
      <path d="M145,200 L148,120" stroke="#2a3a2e" strokeWidth="3"/>
      <path d="M70,120 L65,200 L135,200 L130,120" fill="#1a2a20" stroke="#2D4A3E" strokeWidth="2"/>
      <path d="M60,120 L100,40 L140,120" fill="#1a2a20" stroke="#2D4A3E" strokeWidth="2"/>
      <path d="M60,120 L50,180 M140,120 L150,180" stroke="#2D4A3E" strokeWidth="1.5" fill="none"/>
      <path d="M72,115 L100,52 L128,115" fill="#0a1510" />
      <circle cx="108" cy="80" r="2.5" fill="#2D4A3E">
        <animate attributeName="fill" values="#2D4A3E;#4A7A6A;#2D4A3E" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="108" cy="80" r="4" fill="none" stroke="#4A7A6A" strokeWidth="0.5" opacity="0.3">
        <animate attributeName="r" values="4;7;4" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite"/>
      </circle>
      <g transform="translate(108, 80)" opacity="0.4">
        <circle cx="0" cy="0" r="8" fill="none" stroke="#C0392B" strokeWidth="0.8"/>
        <line x1="-12" y1="0" x2="-5" y2="0" stroke="#C0392B" strokeWidth="0.8"/>
        <line x1="5" y1="0" x2="12" y2="0" stroke="#C0392B" strokeWidth="0.8"/>
        <line x1="0" y1="-12" x2="0" y2="-5" stroke="#C0392B" strokeWidth="0.8"/>
        <line x1="0" y1="5" x2="0" y2="12" stroke="#C0392B" strokeWidth="0.8"/>
      </g>
      <path d="M65,155 L55,170 L55,200" stroke="#1a2a20" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M130,155 L125,185" stroke="#1a2a20" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <g transform="translate(155, 150)">
        <rect x="0" y="0" width="18" height="25" rx="3" fill="#2a3a2e" stroke="#4A7A6A" strokeWidth="1"/>
        <rect x="2" y="-2" width="14" height="5" rx="2" fill="#1a2a20" stroke="#4A7A6A" strokeWidth="0.8"/>
        <path d="M5,-2 Q0,-15 -10,-20 Q-15,-22 -12,-30" fill="none" stroke="#4A7A6A" strokeWidth="1.5" opacity="0.5">
          <animate attributeName="d" values="M5,-2 Q0,-15 -10,-20 Q-15,-22 -12,-30;M5,-2 Q-2,-15 -12,-18 Q-18,-20 -15,-28;M5,-2 Q0,-15 -10,-20 Q-15,-22 -12,-30" dur="5s" repeatCount="indefinite"/>
        </path>
      </g>
      <ellipse cx="100" cy="270" rx="50" ry="8" fill="#2D4A3E" opacity="0.2"/>
    </svg>
  );
}

function AlbionArchitect({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M72,105 L65,255 L135,255 L128,105" fill="#22201a" stroke="#3a3630" strokeWidth="2"/>
      <path d="M62,105 L55,255 L65,255 L72,105" fill="#2a2820" stroke="#3a3630" strokeWidth="1"/>
      <path d="M128,105 L135,255 L145,255 L138,105" fill="#2a2820" stroke="#3a3630" strokeWidth="1"/>
      <path d="M80,130 L80,200 L90,210 L90,240" stroke="#D4A843" strokeWidth="0.8" opacity="0.3" fill="none"/>
      <path d="M120,130 L120,190 L110,200 L110,230" stroke="#D4A843" strokeWidth="0.8" opacity="0.3" fill="none"/>
      <ellipse cx="100" cy="60" rx="20" ry="24" fill="#1a1812"/>
      <ellipse cx="88" cy="45" rx="10" ry="7" fill="none" stroke="#D4A843" strokeWidth="1.5"/>
      <ellipse cx="112" cy="45" rx="10" ry="7" fill="none" stroke="#D4A843" strokeWidth="1.5"/>
      <line x1="98" y1="45" x2="102" y2="45" stroke="#D4A843" strokeWidth="1.5"/>
      <ellipse cx="88" cy="45" rx="7" ry="5" fill="#D4A843" opacity="0.1"/>
      <ellipse cx="112" cy="45" rx="7" ry="5" fill="#D4A843" opacity="0.1"/>
      <path d="M88,72 Q100,82 112,72" fill="none" stroke="#3a3020" strokeWidth="1.5"/>
      <path d="M65,140 L45,120 L42,130" stroke="#22201a" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M135,140 L155,120 L158,130" stroke="#22201a" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <g opacity="0.6">
        <text x="30" y="110" fill="#D4A843" fontSize="10" fontFamily="serif" opacity="0.7">∑</text>
        <text x="50" y="95" fill="#E8C76A" fontSize="8" fontFamily="serif" opacity="0.5">∂f/∂x</text>
        <text x="140" y="100" fill="#D4A843" fontSize="9" fontFamily="serif" opacity="0.6">π</text>
        <text x="155" y="115" fill="#E8C76A" fontSize="7" fontFamily="serif" opacity="0.5">∫dx</text>
        <text x="85" y="30" fill="#D4A843" fontSize="8" fontFamily="serif" opacity="0.4">λ</text>
        <rect x="35" y="120" width="10" height="10" fill="#D4A843" opacity="0.3" rx="1">
          <animate attributeName="y" values="120;112;120" dur="3s" repeatCount="indefinite"/>
        </rect>
        <rect x="155" y="125" width="8" height="8" fill="#E8C76A" opacity="0.25" rx="1">
          <animate attributeName="y" values="125;118;125" dur="3.5s" repeatCount="indefinite"/>
        </rect>
        <rect x="45" y="135" width="6" height="6" fill="#D4A843" opacity="0.2" rx="1">
          <animate attributeName="y" values="135;130;135" dur="4s" repeatCount="indefinite"/>
        </rect>
      </g>
      <g opacity="0.06">
        {[0,1,2,3,4].map(i => (
          <polygon key={i} points={`${40+i*30},240 ${50+i*30},230 ${60+i*30},240 ${60+i*30},255 ${50+i*30},265 ${40+i*30},255`}
          fill="none" stroke="#D4A843" strokeWidth="1"/>
        ))}
      </g>
      <ellipse cx="100" cy="270" rx="50" ry="8" fill="#D4A843" opacity="0.15"/>
    </svg>
  );
}

function AlbionExecutor({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M75,100 L68,240 L132,240 L125,100" fill="#1C1C24" stroke="#3a2a20" strokeWidth="2"/>
      <path d="M85,100 L100,120 L115,100" fill="none" stroke="#E8622E" strokeWidth="1" opacity="0.5"/>
      <ellipse cx="100" cy="60" rx="20" ry="23" fill="#1C1C24"/>
      <path d="M86,72 Q100,84 114,72" fill="none" stroke="#3a2a20" strokeWidth="2"/>
      <rect x="88" y="52" width="8" height="3" rx="1.5" fill="#E8622E" opacity="0.7"/>
      <rect x="104" y="52" width="8" height="3" rx="1.5" fill="#E8622E" opacity="0.7"/>
      <g transform="translate(55, 95)">
        <circle cx="0" cy="0" r="12" fill="#1C1C24" stroke="#3a2a20" strokeWidth="2"/>
        <path d="M-8,-6 L8,6" stroke="#E8622E" strokeWidth="2" opacity="0.7"/>
        <path d="M-6,-8 L6,4" stroke="#E8622E" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="0" cy="0" r="16" fill="none" stroke="#E8622E" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="14;18;14" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>
      <g transform="translate(145, 105)">
        <circle cx="0" cy="0" r="12" fill="#1C1C24" stroke="#3a2a20" strokeWidth="2"/>
        <path d="M-8,-6 L8,6" stroke="#E8622E" strokeWidth="2" opacity="0.7"/>
        <path d="M-6,-8 L6,4" stroke="#E8622E" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="0" cy="0" r="16" fill="none" stroke="#E8622E" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="14;18;14" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
        </circle>
      </g>
      <path d="M80,110 L60,100" stroke="#1C1C24" strokeWidth="10" strokeLinecap="round"/>
      <path d="M120,110 L140,105" stroke="#1C1C24" strokeWidth="10" strokeLinecap="round"/>
      <g opacity="0.25">
        <rect x="40" y="170" width="8" height="40" fill="#E8622E"/>
        <rect x="52" y="155" width="8" height="55" fill="#E8622E" opacity="0.8"/>
        <rect x="64" y="145" width="8" height="65" fill="#E8622E" opacity="0.6">
          <animate attributeName="height" values="65;50;65" dur="3s" repeatCount="indefinite"/>
        </rect>
        <rect x="128" y="150" width="8" height="60" fill="#E85D5D" opacity="0.5">
          <animate attributeName="y" values="150;160;150" dur="2s" repeatCount="indefinite"/>
        </rect>
        <rect x="140" y="165" width="8" height="45" fill="#E85D5D" opacity="0.4"/>
        <rect x="152" y="180" width="8" height="30" fill="#E85D5D" opacity="0.3"/>
      </g>
      {[0,1,2,3,4].map(i => (
        <circle key={i} cx={70+i*15} cy={260} r={2.5} fill="#E8622E" opacity="0.4">
          <animate attributeName="cy" values="260;220" dur={`${2+i*0.5}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0" dur={`${2+i*0.5}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <ellipse cx="100" cy="270" rx="50" ry="8" fill="#E8622E" opacity="0.2"/>
    </svg>
  );
}

function AlbionMindMaster({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M65,120 L60,200 L100,210 L140,200 L135,120" fill="#1a2040" stroke="#2C3E6B" strokeWidth="2"/>
      <path d="M65,200 Q80,220 100,210 Q120,220 135,200" fill="#141830" stroke="#2C3E6B" strokeWidth="1.5"/>
      <g opacity="0.15" stroke="#A8B8D0" strokeWidth="0.6" fill="none">
        <path d="M80,135 Q90,150 85,170 Q80,185 90,195"/>
        <path d="M120,135 Q110,150 115,170 Q120,185 110,195"/>
        <path d="M85,170 L100,165 L115,170"/>
        <circle cx="85" cy="170" r="2" fill="#A8B8D0"/>
        <circle cx="100" cy="165" r="2" fill="#A8B8D0"/>
        <circle cx="115" cy="170" r="2" fill="#A8B8D0"/>
      </g>
      <ellipse cx="100" cy="70" rx="22" ry="26" fill="#141830"/>
      <path d="M87,65 Q92,62 97,65" fill="none" stroke="#4A6AAF" strokeWidth="1.5"/>
      <path d="M103,65 Q108,62 113,65" fill="none" stroke="#4A6AAF" strokeWidth="1.5"/>
      <path d="M94,76 Q100,79 106,76" fill="none" stroke="#2a3050" strokeWidth="1"/>
      <circle cx="80" cy="180" r="6" fill="#141830" stroke="#2C3E6B" strokeWidth="1.5"/>
      <circle cx="120" cy="180" r="6" fill="#141830" stroke="#2C3E6B" strokeWidth="1.5"/>
      <g opacity="0.15">
        <ellipse cx="35" cy="100" rx="15" ry="20" fill="none" stroke="#A8B8D0" strokeWidth="1" strokeDasharray="3,3"/>
        <path d="M25,130 L20,180 L50,180 L45,130" fill="none" stroke="#A8B8D0" strokeWidth="1" strokeDasharray="3,3"/>
      </g>
      <g opacity="0.15">
        <ellipse cx="165" cy="100" rx="15" ry="20" fill="none" stroke="#A8B8D0" strokeWidth="1" strokeDasharray="3,3"/>
        <path d="M155,130 L150,180 L180,180 L175,130" fill="none" stroke="#A8B8D0" strokeWidth="1" strokeDasharray="3,3"/>
      </g>
      {[{x:30,y:60,r:8},{x:165,y:55,r:6},{x:25,y:160,r:5},{x:170,y:150,r:7}].map((m,i) => (
        <g key={i} opacity="0.2">
          <rect x={m.x} y={m.y} width={m.r} height={m.r*1.3} rx="1" fill="#A8B8D0"
          transform={`rotate(${i*25+10}, ${m.x+m.r/2}, ${m.y+m.r*0.65})`}>
            <animate attributeName="y" values={`${m.y};${m.y-6};${m.y}`} dur={`${3+i*0.7}s`} repeatCount="indefinite"/>
          </rect>
        </g>
      ))}
      <g transform="translate(70, 225)" opacity="0.1">
        <rect x="0" y="0" width="60" height="40" fill="none" stroke="#A8B8D0" strokeWidth="1"/>
        <path d="M10,0 L10,30 L50,30 L50,10 L20,10 L20,20 L40,20" fill="none" stroke="#A8B8D0" strokeWidth="0.8"/>
      </g>
      <circle cx="100" cy="155" r="25" fill="#2C3E6B" opacity="0.08">
        <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite"/>
      </circle>
      <ellipse cx="100" cy="260" rx="40" ry="6" fill="#2C3E6B" opacity="0.15"/>
    </svg>
  );
}

function AlbionAlgorithm({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M72,100 L65,250 L135,250 L128,100" fill="#0A0A0F" stroke="#00E676" strokeWidth="1.5"/>
      <g stroke="#00E676" strokeWidth="0.8" opacity="0.4" fill="none">
        <path d="M85,120 L85,160 L95,170 L95,210"/><path d="M115,120 L115,155 L105,165 L105,200"/>
        <circle cx="85" cy="160" r="2" fill="#00E676"/><circle cx="105" cy="200" r="2" fill="#00E676"/>
      </g>
      <ellipse cx="100" cy="60" rx="22" ry="26" fill="#0A0A0F"/>
      <path d="M84,72 Q92,80 100,72" fill="none" stroke="#1a1a20" strokeWidth="1.5"/>
      <circle cx="90" cy="52" r="2" fill="#4a4a5a"/>
      <g stroke="#00E676" strokeWidth="1" opacity="0.6" fill="none">
        <path d="M104,45 L115,45 L115,55 L108,55"/><path d="M108,60 L118,60 L118,70"/>
        <circle cx="108" cy="55" r="1.5" fill="#00E676"/><circle cx="118" cy="60" r="1.5" fill="#00E676"/>
      </g>
      <g opacity="0.3" fill="#00E676" fontSize="8" fontFamily="monospace">
        {[0,1,2,3,4].map(i => (
          <text key={i} x={60+i*20} y={140+i*15} opacity={0.3+i*0.1}>
            <animate attributeName="y" values={`${140+i*15};250`} dur={`${2+i*0.4}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values={`${0.3+i*0.1};0`} dur={`${2+i*0.4}s`} repeatCount="indefinite"/>
            {['0','1','λ','∞','Σ'][i]}
          </text>
        ))}
      </g>
      <g transform="translate(150,130)" opacity="0.5">
        <rect x="-8" y="-12" width="16" height="22" rx="2" fill="none" stroke="#00E676" strokeWidth="1"/>
        <text x="-4" y="3" fill="#00E676" fontSize="10">♠</text>
      </g>
      <ellipse cx="100" cy="270" rx="50" ry="8" fill="#00E676" opacity="0.15"/>
    </svg>
  );
}

function AlbionFlash({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M52,100 L45,240 L115,240 L108,100" fill="#00B4D8" opacity="0.08"/>
      <path d="M82,100 L75,240 L145,240 L138,100" fill="#0a1820" stroke="#00B4D8" strokeWidth="1.5"/>
      <path d="M95,110 L90,240" stroke="#48D1E8" strokeWidth="0.8" opacity="0.3"/>
      <path d="M125,110 L130,240" stroke="#48D1E8" strokeWidth="0.8" opacity="0.3"/>
      <ellipse cx="110" cy="62" rx="20" ry="24" fill="#0a1820"/>
      <path d="M95,55 L125,55" stroke="#00B4D8" strokeWidth="3"/>
      <path d="M95,55 L125,55" stroke="#48D1E8" strokeWidth="1.5"/>
      <g stroke="#00B4D8" strokeWidth="2" fill="none" opacity="0.5">
        <path d="M50,120 L40,140 L55,135 L45,160"/>
        <path d="M155,110 L165,130 L150,125 L160,150"/>
      </g>
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1="30" y1={100+i*25} x2="55" y2={100+i*25} stroke="#00B4D8" strokeWidth="1" opacity={0.3-i*0.04}/>
      ))}
      <g transform="translate(140,180)" opacity="0.35">
        <text fill="#48D1E8" fontSize="8" fontFamily="monospace">$1,140,000</text>
      </g>
      <ellipse cx="110" cy="268" rx="55" ry="8" fill="#00B4D8" opacity="0.15"/>
    </svg>
  );
}

function AlbionTideRider({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M30,210 Q60,195 100,205 Q140,195 170,210 Q140,225 100,215 Q60,225 30,210" fill="#0077B6" opacity="0.2"/>
      <path d="M30,210 Q60,195 100,205 Q140,195 170,210" fill="none" stroke="#3399CC" strokeWidth="1.5" opacity="0.4"/>
      <path d="M75,100 L70,200 Q100,210 130,200 L125,100" fill="#0a1825" stroke="#0077B6" strokeWidth="2"/>
      <path d="M70,200 Q55,215 50,240" stroke="#0077B6" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M130,200 Q145,215 150,240" stroke="#0077B6" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="60" rx="20" ry="24" fill="#0a1825"/>
      <path d="M88,58 Q93,55 98,58" fill="none" stroke="#3399CC" strokeWidth="1.5"/>
      <path d="M102,58 Q107,55 112,58" fill="none" stroke="#3399CC" strokeWidth="1.5"/>
      <path d="M75,130 L40,115" stroke="#0a1825" strokeWidth="7" strokeLinecap="round"/>
      <path d="M125,130 L160,115" stroke="#0a1825" strokeWidth="7" strokeLinecap="round"/>
      <g opacity="0.3">
        <path d="M40,115 Q35,130 30,150" stroke="#DEB875" strokeWidth="1.5" fill="none"/>
        <path d="M160,115 Q165,130 170,150" stroke="#DEB875" strokeWidth="1.5" fill="none"/>
      </g>
      <path d="M10,160 Q50,130 100,155 Q150,130 190,160" fill="none" stroke="#0077B6" strokeWidth="2" opacity="0.2">
        <animate attributeName="d" values="M10,160 Q50,130 100,155 Q150,130 190,160;M10,155 Q50,135 100,150 Q150,135 190,155;M10,160 Q50,130 100,155 Q150,130 190,160" dur="4s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="135" cy="140" rx="8" ry="12" fill="none" stroke="#DEB875" strokeWidth="1" opacity="0.2"/>
      <line x1="135" y1="128" x2="135" y2="100" stroke="#DEB875" strokeWidth="1" opacity="0.2"/>
      <ellipse cx="100" cy="265" rx="50" ry="8" fill="#0077B6" opacity="0.15"/>
    </svg>
  );
}

function AlbionPioneer({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      {[0,1,2,3,4].map(i => (
        <path key={i} d={`M${40+i*30},270 Q${45+i*30},${230-i*10} ${50+i*30},${240-i*5} Q${55+i*30},${220-i*8} ${50+i*30},270`}
        fill="#FF6B35" opacity={0.15+i*0.03}>
          <animate attributeName="d" values={`M${40+i*30},270 Q${45+i*30},${230-i*10} ${50+i*30},${240-i*5} Q${55+i*30},${220-i*8} ${50+i*30},270;M${40+i*30},270 Q${43+i*30},${225-i*10} ${50+i*30},${235-i*5} Q${57+i*30},${215-i*8} ${50+i*30},270;M${40+i*30},270 Q${45+i*30},${230-i*10} ${50+i*30},${240-i*5} Q${55+i*30},${220-i*8} ${50+i*30},270`} dur={`${2+i*0.3}s`} repeatCount="indefinite"/>
        </path>
      ))}
      <path d="M72,105 L65,250 L135,250 L128,105" fill="#2a0800" stroke="#5a2010" strokeWidth="2"/>
      <line x1="80" y1="140" x2="95" y2="155" stroke="#3a1808" strokeWidth="2"/>
      <line x1="110" y1="170" x2="120" y2="180" stroke="#3a1808" strokeWidth="1.5"/>
      <ellipse cx="100" cy="62" rx="20" ry="25" fill="#2a0800"/>
      <rect x="88" y="54" width="8" height="3" rx="1.5" fill="#FF6B35" opacity="0.8"/>
      <rect x="104" y="54" width="8" height="3" rx="1.5" fill="#FF6B35" opacity="0.8"/>
      <path d="M86,74 Q100,84 114,74" fill="none" stroke="#3a1808" strokeWidth="1.5"/>
      <g transform="translate(148, 60)">
        <rect x="-3" y="0" width="6" height="45" rx="2" fill="#3a2010" stroke="#5a3020" strokeWidth="1"/>
        <path d="M0,-5 Q-8,-20 0,-30 Q8,-20 0,-5" fill="#FF6B35">
          <animate attributeName="d" values="M0,-5 Q-8,-20 0,-30 Q8,-20 0,-5;M0,-5 Q-10,-18 0,-28 Q10,-18 0,-5;M0,-5 Q-8,-20 0,-30 Q8,-20 0,-5" dur="0.8s" repeatCount="indefinite"/>
        </path>
        <path d="M0,-5 Q-4,-15 0,-22 Q4,-15 0,-5" fill="#FFD700" opacity="0.6"/>
      </g>
      <path d="M70,130 L35,120" stroke="#2a0800" strokeWidth="7" strokeLinecap="round"/>
      <path d="M35,120 L20,118" stroke="#2a0800" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="100" cy="135" r="8" fill="none" stroke="#FF6B35" strokeWidth="1.5" opacity="0.5"/>
      <line x1="100" y1="128" x2="100" y2="142" stroke="#FF6B35" strokeWidth="1" opacity="0.3"/>
      <line x1="93" y1="135" x2="107" y2="135" stroke="#FF6B35" strokeWidth="1" opacity="0.3"/>
      <g opacity="0.08">
        {[0,1,2,3].map(i => (
          <ellipse key={i} cx={30+i*45} cy={240} rx="10" ry="25" fill="#FF6B35"/>
        ))}
      </g>
      <ellipse cx="100" cy="270" rx="50" ry="8" fill="#FF6B35" opacity="0.15"/>
    </svg>
  );
}

function AlbionShadow({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M70,40 L100,15 L130,40 L140,200 L60,200" fill="#1a1508" opacity="0.15"/>
      <path d="M65,90 L100,40 L135,90" fill="#1a1508" stroke="#2a2010" strokeWidth="2"/>
      <path d="M65,90 L58,260 L142,260 L135,90" fill="#1a1508" stroke="#2a2010" strokeWidth="2"/>
      <path d="M75,88 L100,50 L125,88" fill="#0e0a04"/>
      <path d="M62,180 L58,260" stroke="#B8860B" strokeWidth="0.8" opacity="0.3"/>
      <path d="M138,180 L142,260" stroke="#B8860B" strokeWidth="0.8" opacity="0.3"/>
      <path d="M88,82 Q100,90 112,82" fill="none" stroke="#2a1a0a" strokeWidth="1.5"/>
      <g transform="translate(140, 120)">
        <line x1="0" y1="0" x2="-15" y2="80" stroke="#B8860B" strokeWidth="0.8" opacity="0.5"/>
        <line x1="5" y1="0" x2="0" y2="85" stroke="#B8860B" strokeWidth="0.8" opacity="0.4"/>
        <line x1="10" y1="0" x2="15" y2="75" stroke="#B8860B" strokeWidth="0.8" opacity="0.3"/>
        <rect x="-5" y="-5" width="20" height="4" rx="2" fill="#B8860B" opacity="0.4"/>
      </g>
      <g transform="translate(50, 140)">
        <path d="M0,0 Q10,-10 20,0 L20,15 Q10,18 0,15 Z" fill="#B8860B" opacity="0.5" stroke="#D4A832" strokeWidth="1"/>
        <circle cx="8" cy="6" r="3" fill="#0e0a04"/>
      </g>
      {[0,1,2].map(i => (
        <circle key={i} cx={80+i*20} cy={200} r={15+i*5} fill="#B8860B" opacity="0.03">
          <animate attributeName="cy" values="200;170" dur={`${4+i}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.03;0" dur={`${4+i}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <ellipse cx="100" cy="268" rx="50" ry="8" fill="#B8860B" opacity="0.12"/>
    </svg>
  );
}

function AlbionEvolver({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M75,105 L68,245 L132,245 L125,105" fill="#1a0e25" stroke="#9B59B6" strokeWidth="1.5"/>
      <path d="M75,105 L68,245 L100,245 L100,105" fill="#1ABC9C" opacity="0.05"/>
      <ellipse cx="100" cy="62" rx="20" ry="24" fill="#1a0e25"/>
      <rect x="88" y="55" width="7" height="2.5" rx="1" fill="#1ABC9C" opacity="0.6"/>
      <rect x="105" y="55" width="7" height="2.5" rx="1" fill="#9B59B6" opacity="0.6"/>
      <g opacity="0.5">
        <path d="M55,100 Q100,80 145,100 Q100,120 55,140 Q100,120 145,140 Q100,160 55,180 Q100,160 145,180 Q100,200 55,220"
        fill="none" stroke="#9B59B6" strokeWidth="1.5"/>
        <path d="M55,100 Q100,120 145,100 Q100,80 55,140 Q100,160 145,140 Q100,120 55,180 Q100,200 145,180 Q100,160 55,220"
        fill="none" stroke="#1ABC9C" strokeWidth="1.5"/>
        {[100,140,180].map(y => (
          <g key={y}>
            <circle cx={55} cy={y} r="3" fill="#9B59B6" opacity="0.6">
              <animate attributeName="fill" values="#9B59B6;#1ABC9C;#9B59B6" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx={145} cy={y} r="3" fill="#1ABC9C" opacity="0.6">
              <animate attributeName="fill" values="#1ABC9C;#9B59B6;#1ABC9C" dur="3s" repeatCount="indefinite"/>
            </circle>
          </g>
        ))}
      </g>
      <path d="M78,130 L60,120" stroke="#1a0e25" strokeWidth="6" strokeLinecap="round"/>
      <path d="M122,130 L140,120" stroke="#1a0e25" strokeWidth="6" strokeLinecap="round"/>
      <ellipse cx="100" cy="265" rx="45" ry="7" fill="#9B59B6" opacity="0.12"/>
    </svg>
  );
}

function AlbionContrarian({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <g>
        <rect x="20" y="230" width="160" height="30" rx="3" fill="#1D3557" opacity="0.3"/>
        <g stroke="#A8DADC" strokeWidth="1" opacity="0.4">
          <path d="M100,230 L95,240 L80,245 L60,242"/><path d="M100,230 L110,238 L130,240 L150,237"/>
          <path d="M95,240 L90,255"/><path d="M110,238 L115,252"/>
        </g>
        <path d="M95,240 L90,255" stroke="#C8EEF0" strokeWidth="3" opacity="0.1"/>
        <path d="M110,238 L115,252" stroke="#C8EEF0" strokeWidth="3" opacity="0.1"/>
      </g>
      <path d="M72,100 L65,230 L135,230 L128,100" fill="#1D3557" stroke="#2a4570" strokeWidth="2"/>
      <path d="M68,100 L100,55 L132,100" fill="#1D3557" stroke="#2a4570" strokeWidth="2"/>
      <path d="M76,98 L100,62 L124,98" fill="#0e1a2e"/>
      <g transform="translate(112, 78)">
        <circle cx="0" cy="0" r="8" fill="none" stroke="#A8DADC" strokeWidth="1.5"/>
        <circle cx="0" cy="0" r="5" fill="#A8DADC" opacity="0.15"/>
        <line x1="8" y1="0" x2="14" y2="-4" stroke="#A8DADC" strokeWidth="1"/>
        <text x="-4" y="2" fill="#A8DADC" fontSize="5" fontFamily="monospace" opacity="0.5">01</text>
      </g>
      <rect x="82" y="76" width="7" height="3" rx="1.5" fill="#A8DADC" opacity="0.7"/>
      <g opacity="0.08">
        {[30,50,140,160].map((x,i) => (
          <path key={i} d={`M${x},${130+i*15} L${x+(i<2?-10:10)},${120+i*15}`} stroke="#A8DADC" strokeWidth="3" strokeLinecap="round"/>
        ))}
      </g>
      <circle cx="58" cy="195" r="7" fill="#1D3557" stroke="#2a4570" strokeWidth="1.5"/>
      <circle cx="142" cy="195" r="7" fill="#1D3557" stroke="#2a4570" strokeWidth="1.5"/>
      <ellipse cx="100" cy="258" rx="55" ry="7" fill="#A8DADC" opacity="0.1"/>
    </svg>
  );
}

function AlbionOracle({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <path d="M72,110 L65,250 L135,250 L128,110" fill="#15082a" stroke="#4A0E78" strokeWidth="2"/>
      <g stroke="#E8D5F5" strokeWidth="0.5" opacity="0.15">
        <circle cx="85" cy="150" r="1.5" fill="#E8D5F5"/><circle cx="95" cy="170" r="1" fill="#E8D5F5"/>
        <circle cx="110" cy="155" r="1.5" fill="#E8D5F5"/><circle cx="105" cy="185" r="1" fill="#E8D5F5"/>
        <line x1="85" y1="150" x2="95" y2="170"/><line x1="95" y1="170" x2="110" y2="155"/>
        <line x1="110" y1="155" x2="105" y2="185"/>
      </g>
      <ellipse cx="100" cy="62" rx="22" ry="26" fill="#15082a"/>
      <path d="M86,60 Q92,57 98,60" fill="none" stroke="#7B3AAF" strokeWidth="1.5"/>
      <path d="M102,60 Q108,57 114,60" fill="none" stroke="#7B3AAF" strokeWidth="1.5"/>
      <circle cx="100" cy="44" r="4" fill="#C9A456" opacity="0.6">
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="44" r="8" fill="none" stroke="#C9A456" strokeWidth="0.5" opacity="0.2">
        <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite"/>
      </circle>
      <g transform="translate(100, 155)">
        <path d="M-18,5 Q-15,-5 0,-8 Q15,-5 18,5" fill="#15082a" stroke="#4A0E78" strokeWidth="1.5"/>
        <circle cx="0" cy="-2" r="12" fill="#4A0E78" opacity="0.3">
          <animate attributeName="r" values="12;14;12" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="0" cy="-2" r="8" fill="#C9A456" opacity="0.15"/>
        <circle cx="0" cy="-2" r="4" fill="#E8D5F5" opacity="0.2"/>
      </g>
      {[{x:30,y:40},{x:165,y:50},{x:25,y:120},{x:175,y:100},{x:40,y:200},{x:160,y:190}].map((s,i) => (
        <circle key={i} cx={s.x} cy={s.y} r={1.5} fill="#E8D5F5" opacity={0.25}>
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${2+i*0.5}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <ellipse cx="100" cy="265" rx="45" ry="7" fill="#4A0E78" opacity="0.15"/>
    </svg>
  );
}

function AlbionLoneWolf({ size }: AlbionProps) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <circle cx="100" cy="40" r="25" fill="#DC143C" opacity="0.15"/>
      <circle cx="100" cy="40" r="20" fill="#DC143C" opacity="0.08"/>
      <path d="M0,240 L80,235 L85,240 L120,238 L200,242 L200,280 L0,280 Z" fill="#1a1a20"/>
      <path d="M82,100 L78,235 L122,235 L118,100" fill="#1a1a20" stroke="#3a3a40" strokeWidth="1.5"/>
      <path d="M78,100 L55,110 L60,200 L78,195" fill="#1a1a20" stroke="#3a3a40" strokeWidth="1" opacity="0.8">
        <animate attributeName="d" values="M78,100 L55,110 L60,200 L78,195;M78,100 L50,115 L58,195 L78,195;M78,100 L55,110 L60,200 L78,195" dur="4s" repeatCount="indefinite"/>
      </path>
      <path d="M78,110 L62,118 L65,190 L78,188" fill="#DC143C" opacity="0.15"/>
      <ellipse cx="100" cy="70" rx="18" ry="22" fill="#1a1a20"/>
      <path d="M82,55 Q100,45 118,55" fill="none" stroke="#3a3a40" strokeWidth="1.5"/>
      <g transform="translate(140, 160)">
        <rect x="-2" y="0" width="4" height="75" fill="#4a4a50" stroke="#6C757D" strokeWidth="1"/>
        <rect x="-8" y="-2" width="16" height="5" rx="1" fill="#4a4a50" stroke="#6C757D" strokeWidth="1"/>
        <rect x="-1" y="-12" width="2" height="12" fill="#6C757D"/>
        <circle cx="0" cy="-12" r="3" fill="none" stroke="#DC143C" strokeWidth="1" opacity="0.4"/>
      </g>
      <g transform="translate(55, 130)" opacity="0.3">
        <rect x="0" y="0" width="15" height="10" rx="1" fill="#6C757D" opacity="0.5"/>
        <path d="M3,0 Q7,-5 10,-8" fill="none" stroke="#DC143C" strokeWidth="1"/>
        <circle cx="8" cy="-6" r="3" fill="#DC143C" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
      <ellipse cx="100" cy="265" rx="55" ry="6" fill="#6C757D" opacity="0.1"/>
    </svg>
  );
}

function AlbionTitan({ size, uid }: AlbionProps) {
  const gid = `${uid}-ex-cloak`;
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a08" /><stop offset="100%" stopColor="#140e04" />
        </linearGradient>
      </defs>
      <path d="M68,100 L60,260 L140,260 L132,100" fill={`url(#${gid})`} stroke="#3a2a10" strokeWidth="2"/>
      <path d="M60,260 L52,280 L148,280 L140,260" fill="#140e04" stroke="#3a2a10" strokeWidth="1"/>
      <path d="M82,108 L78,250 L122,250 L118,108" fill="#DAA520" opacity="0.08"/>
      <ellipse cx="70" cy="105" rx="16" ry="8" fill="#2a2018" stroke="#DAA520" strokeWidth="1" opacity="0.6"/>
      <ellipse cx="130" cy="105" rx="16" ry="8" fill="#2a2018" stroke="#DAA520" strokeWidth="1" opacity="0.6"/>
      <ellipse cx="100" cy="55" rx="22" ry="26" fill="#1a1408"/>
      <path d="M84,68 Q100,80 116,68" fill="none" stroke="#3a2a10" strokeWidth="2"/>
      <rect x="88" y="50" width="8" height="3" rx="1.5" fill="#DAA520" opacity="0.8"/>
      <rect x="104" y="50" width="8" height="3" rx="1.5" fill="#DAA520" opacity="0.8"/>
      <g transform="translate(100, 22)">
        <polygon points="0,-18 5,-8 16,-6 8,3 10,14 0,9 -10,14 -8,3 -16,-6 -5,-8" fill="none" stroke="#DAA520" strokeWidth="1.5" opacity="0.7"/>
        <polygon points="0,-12 3,-5 10,-4 5,2 6,9 0,6 -6,9 -5,2 -10,-4 -3,-5" fill="#DAA520" opacity="0.15"/>
        <circle cx="0" cy="0" r="4" fill="#DAA520" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
      <g transform="translate(155, 100)">
        <rect x="-2" y="0" width="5" height="55" fill="#3a2a10" stroke="#DAA520" strokeWidth="0.8"/>
        <polygon points="0,-20 -10,0 10,0" fill="#DAA520" opacity="0.6"/>
        <polygon points="0,-20 -6,-4 6,-4" fill="#F0C850" opacity="0.3"/>
      </g>
      <path d="M78,120 L55,110" stroke="#1a1408" strokeWidth="8" strokeLinecap="round"/>
      <path d="M122,120 L145,105" stroke="#1a1408" strokeWidth="8" strokeLinecap="round"/>
      <g opacity="0.15">
        <path d="M25,180 L50,120 L75,170 L100,100 L125,150 L150,90 L175,140" fill="none" stroke="#DAA520" strokeWidth="2"/>
        <circle cx="150" cy="90" r="4" fill="#DAA520" opacity="0.4"/>
        <circle cx="175" cy="140" r="3" fill="#DAA520" opacity="0.3"/>
      </g>
      {[0,1,2].map(i => (
        <circle key={i} cx={80+i*20} cy={260} r={2} fill="#DAA520" opacity="0.3">
          <animate attributeName="cy" values="260;230" dur={`${2.5+i*0.5}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0" dur={`${2.5+i*0.5}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <ellipse cx="100" cy="275" rx="50" ry="8" fill="#DAA520" opacity="0.15"/>
    </svg>
  );
}

interface AlbionCharacterSVGProps {
  type: string;
  size?: number;
}

const charMap: Record<string, (props: AlbionProps) => JSX.Element> = {
  ER: AlbionStrategist,
  RS: AlbionCommander,
  RM: AlbionHunter,
  ES: AlbionArchitect,
  RE: AlbionExecutor,
  SM: AlbionMindMaster,
  SE: AlbionAlgorithm,
  ME: AlbionFlash,
  MA: AlbionTideRider,
  EA: AlbionPioneer,
  EM: AlbionShadow,
  AS: AlbionEvolver,
  RA: AlbionContrarian,
  EAv: AlbionOracle,
  REv: AlbionLoneWolf,
  EX: AlbionTitan,
};

export default function AlbionCharacterSVG({ type, size = 280 }: AlbionCharacterSVGProps) {
  const uid = useId();
  const Component = charMap[type];
  if (!Component) return null;
  return <Component size={size} uid={uid} />;
}
