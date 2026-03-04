import { useState, useEffect } from “react”;

const CHARACTERS = {
ER: { id:“ER”, name:“格局掌控者”, english:“THE STRATEGIST”, subtitle:“EDGE × RISK”, element:“⚡”, elementName:“THUNDER”,
quote:“我在你们看到混沌的地方，看到了结构。”,
storyHint:“他在所有人都只看到’不可能’的时候，看到了结构性的裂缝。”,
colors:{ primary:”#6B3FA0”, secondary:”#C8C8D0”, accent:”#9B6FD0”, dark:”#1a1035”, glow:“rgba(107,63,160,0.4)” }},
RS: { id:“RS”, name:“铁壁指挥官”, english:“THE COMMANDER”, subtitle:“RISK × SYSTEM”, element:“🧊”, elementName:“ICE”,
quote:“市场可以崩塌，但我的系统不会。”,storyHint:“他把一生经验写成了’原则’。”,
colors:{ primary:”#3D5A80”, secondary:”#A0785A”, accent:”#5B8AB5”, dark:”#0f1a28”, glow:“rgba(61,90,128,0.4)” }},
RM: { id:“RM”, name:“冷静猎手”, english:“THE HUNTER”, subtitle:“RISK × MENTAL”, element:“🌿”, elementName:“WIND”,
quote:“我不急。我等最好的那一枪。”,storyHint:“赚大钱靠的是坐得住。”,
colors:{ primary:”#2D4A3E”, secondary:”#C0392B”, accent:”#4A7A6A”, dark:”#0a1a14”, glow:“rgba(45,74,62,0.4)” }},
ES: { id:“ES”, name:“基石建筑师”, english:“THE ARCHITECT”, subtitle:“EDGE × SYSTEM”, element:“🌍”, elementName:“EARTH”,
quote:“逻辑就是我的蓝图。”,storyHint:“用密码破译的方法找到了市场暗号。”,
colors:{ primary:”#D4A843”, secondary:”#2C2C34”, accent:”#E8C76A”, dark:”#141008”, glow:“rgba(212,168,67,0.4)” }},
RE: { id:“RE”, name:“钢铁执行者”, english:“THE EXECUTOR”, subtitle:“RISK × EXEC”, element:“🔥”, elementName:“FIRE”,
quote:“犹豫一秒，就是对纪律的背叛。”,storyHint:“先别被打倒。”,
colors:{ primary:”#E8622E”, secondary:”#1C1C24”, accent:”#FF8A5C”, dark:”#1a0c06”, glow:“rgba(232,98,46,0.4)” }},
SM: { id:“SM”, name:“心智大师”, english:“THE MIND MASTER”, subtitle:“SYSTEM × MENTAL”, element:“💧”, elementName:“WATER”,
quote:“我的敌人不是市场，是我自己的完美主义。”,storyHint:“为什么你知道该怎么做，却做不到？”,
colors:{ primary:”#2C3E6B”, secondary:”#A8B8D0”, accent:”#4A6AAF”, dark:”#0a0f1f”, glow:“rgba(44,62,107,0.4)” }},
SE: { id:“SE”, name:“算法战士”, english:“THE ALGORITHM”, subtitle:“SYSTEM × EXEC”, element:“⚡”, elementName:“VOLT”,
quote:“情绪是bug。我只执行代码。”,storyHint:“用概率论赢到被赌场列入黑名单。”,
colors:{ primary:”#00E676”, secondary:”#0A0A0F”, accent:”#4AFF9E”, dark:”#040a06”, glow:“rgba(0,230,118,0.4)” }},
ME: { id:“ME”, name:“极速闪电”, english:“THE FLASH”, subtitle:“MENTAL × EXEC”, element:“⚡”, elementName:“SPARK”,
quote:“在你还在想的时候，我已经做完了。”,storyHint:“1万美金变成了114万。”,
colors:{ primary:”#00B4D8”, secondary:”#F0F4F8”, accent:”#48D1E8”, dark:”#041218”, glow:“rgba(0,180,216,0.4)” }},
MA: { id:“MA”, name:“潮汐顺行者”, english:“THE TIDE RIDER”, subtitle:“MENTAL × ADAPT”, element:“💧”, elementName:“FLOW”,
quote:“我不预测浪，我乘浪。”,storyHint:“5000美金变成1500万。”,
colors:{ primary:”#0077B6”, secondary:”#DEB875”, accent:”#3399CC”, dark:”#041420”, glow:“rgba(0,119,182,0.4)” }},
EA: { id:“EA”, name:“烈焰先锋”, english:“THE PIONEER”, subtitle:“EXEC × ADAPT”, element:“🔥”, elementName:“BLAZE”,
quote:“错了就改，改了就干。”,storyHint:“400美元起步做到2亿。”,
colors:{ primary:”#FF6B35”, secondary:”#8B0000”, accent:”#FF9A6C”, dark:”#1a0800”, glow:“rgba(255,107,53,0.4)” }},
EM: { id:“EM”, name:“影子博弈者”, english:“THE SHADOW”, subtitle:“EDGE × MENTAL”, element:“🌿”, elementName:“MIST”,
quote:“我在你不注意的地方，已经布好了局。”,storyHint:“连续30年没有亏损。”,
colors:{ primary:”#B8860B”, secondary:”#484848”, accent:”#D4A832”, dark:”#120e04”, glow:“rgba(184,134,11,0.4)” }},
AS: { id:“AS”, name:“体系适应者”, english:“THE EVOLVER”, subtitle:“ADAPT × SYSTEM”, element:“💧”, elementName:“SHIFT”,
quote:“我的系统不是固定的，它会呼吸。”,storyHint:“她是那5%。”,
colors:{ primary:”#9B59B6”, secondary:”#1ABC9C”, accent:”#BB77DD”, dark:”#120a18”, glow:“rgba(155,89,182,0.4)” }},
RA: { id:“RA”, name:“冰血破局者”, english:“THE CONTRARIAN”, subtitle:“RISK × ADAPT”, element:“🧊”, elementName:“FROST”,
quote:“越乱，我越清醒。”,storyHint:“两年后，他赢了。”,
colors:{ primary:”#A8DADC”, secondary:”#1D3557”, accent:”#C8EEF0”, dark:”#0a1520”, glow:“rgba(168,218,220,0.4)” }},
EAv: { id:“EAv”, name:“直觉行者”, english:“THE ORACLE”, subtitle:“EDGE × ADAPT”, element:“✨”, elementName:“AURA”,
quote:“我不分析，我感知。”,storyHint:“53年间只有一个月亏损。”,
colors:{ primary:”#4A0E78”, secondary:”#E8D5F5”, accent:”#7B3AAF”, dark:”#0e0420”, glow:“rgba(74,14,120,0.4)” }},
REv: { id:“REv”, name:“孤狼战士”, english:“THE LONE WOLF”, subtitle:“独立型”, element:“🌿”, elementName:“VOID”,
quote:“我不需要别人告诉我该怎么做。”,storyHint:“他从不听任何人的建议。”,
colors:{ primary:”#6C757D”, secondary:”#DC143C”, accent:”#8A9199”, dark:”#0e0e10”, glow:“rgba(108,117,125,0.4)” }},
};

const TIER_DATA = [
{ level:1, name:“学徒”, english:“APPRENTICE”, badge:“🔰”, criteria:“完成交易人格测评” },
{ level:2, name:“交易者”, english:“TRADER”, badge:“📊”, criteria:“转发1封PropFirm考核邮件 或 经纪商出金邮件” },
{ level:3, name:“精英”, english:“ELITE”, badge:“⚜️”, criteria:“累计出金邮件达 $10,000+” },
{ level:4, name:“职业操盘手”, english:“PROFESSIONAL”, badge:“👑”, criteria:“累计出金 $100,000+ 或 官方合作认证” },
];

// ═══════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════

// Background aura - BIG jumps per tier
const Aura = ({tier,color}) => {
if (tier < 1) return null;
const sz=[0,65,120,180][tier], op=[0,0.08,0.16,0.25][tier];
return (<g>
<ellipse cx="100" cy="160" rx={sz} ry={sz*1.2} fill={color} opacity={op}><animate attributeName=“opacity” values={op*0.4+”;”+op+”;”+op*0.4} dur=“3s” repeatCount=“indefinite”/></ellipse>
{tier>=2&&<ellipse cx="100" cy="160" rx={sz*0.5} ry={sz*0.6} fill={color} opacity={op*0.6}/>}
{tier>=3&&<ellipse cx="100" cy="275" rx="65" ry="12" fill="none" stroke={color} strokeWidth="2" opacity="0.25"><animate attributeName="rx" values="65;78;65" dur="2s" repeatCount="indefinite"/></ellipse>}
</g>);
};

// Wings - MASSIVE difference per tier
const Wings = ({tier,c1,c2}) => {
if (tier < 1) return null;
if (tier===1) return (<g>
<path d="M68,108 Q52,88 48,68" fill="none" stroke={c1} strokeWidth="3" opacity="0.35"/>
<path d="M132,108 Q148,88 152,68" fill="none" stroke={c1} strokeWidth="3" opacity="0.35"/>
<path d="M68,108 Q56,96 50,78" fill="none" stroke={c2||c1} strokeWidth="1.5" opacity="0.2"/>
<path d="M132,108 Q144,96 150,78" fill="none" stroke={c2||c1} strokeWidth="1.5" opacity="0.2"/>
</g>);
if (tier===2) return (<g>
<path d="M65,112 Q30,75 8,32 Q22,48 32,42 Q20,22 2,0 Q26,28 40,24 Q30,10 18,-8 Q38,18 55,38 Q52,65 62,92" fill={c1} opacity="0.15" stroke={c1} strokeWidth="2">
<animate attributeName="opacity" values="0.1;0.22;0.1" dur="3.5s" repeatCount="indefinite"/>
</path>
<path d="M135,112 Q170,75 192,32 Q178,48 168,42 Q180,22 198,0 Q174,28 160,24 Q170,10 182,-8 Q162,18 145,38 Q148,65 138,92" fill={c1} opacity="0.15" stroke={c1} strokeWidth="2">
<animate attributeName="opacity" values="0.1;0.22;0.1" dur="3.5s" repeatCount="indefinite"/>
</path>
<path d="M65,112 Q32,78 12,38" fill="none" stroke={c1} strokeWidth="3" opacity="0.4"/>
<path d="M135,112 Q168,78 188,38" fill="none" stroke={c1} strokeWidth="3" opacity="0.4"/>
</g>);
// tier 3 - MASSIVE wings + halo
return (<g>
<path d="M58,112 Q12,52 -22,0 Q2,28 14,18 Q-4,-8 -28,-35 Q8,6 24,0 Q4,-22 -16,-48 Q14,-6 34,2 Q20,-24 4,-52 Q28,-4 46,14 Q42,42 52,72 Q48,88 56,105" fill={c1} opacity="0.22" stroke={c1} strokeWidth="2.5">
<animate attributeName="opacity" values="0.14;0.3;0.14" dur="3s" repeatCount="indefinite"/>
</path>
<path d="M142,112 Q188,52 222,0 Q198,28 186,18 Q204,-8 228,-35 Q192,6 176,0 Q196,-22 216,-48 Q186,-6 166,2 Q180,-24 196,-52 Q172,-4 154,14 Q158,42 148,72 Q152,88 144,105" fill={c1} opacity="0.22" stroke={c1} strokeWidth="2.5">
<animate attributeName="opacity" values="0.14;0.3;0.14" dur="3s" repeatCount="indefinite"/>
</path>
<path d="M58,112 Q16,56 -18,5" fill="none" stroke={c1} strokeWidth="4" opacity="0.55"/>
<path d="M142,112 Q184,56 218,5" fill="none" stroke={c1} strokeWidth="4" opacity="0.55"/>
<path d="M54,100 Q8,10 -22,-30" fill="none" stroke={c2||c1} strokeWidth="2" opacity="0.3"/>
<path d="M146,100 Q192,10 222,-30" fill="none" stroke={c2||c1} strokeWidth="2" opacity="0.3"/>
{/* HALO */}
<ellipse cx="100" cy="14" rx="32" ry="7" fill="none" stroke={c1} strokeWidth="3" opacity="0.55"><animate attributeName="cy" values="14;10;14" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.75;0.4" dur="3s" repeatCount="indefinite"/></ellipse>
<ellipse cx="100" cy="14" rx="40" ry="12" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.12"><animate attributeName="rx" values="40;50;40" dur="2s" repeatCount="indefinite"/></ellipse>
</g>);
};

// Rising particles
const Burst = ({tier,color}) => {
if (tier<1) return null;
const n=[0,6,18,35][tier], sz=[0,1.8,3,4][tier];
return <>{Array.from({length:n},(_,i)=>{const x=25+Math.random()*150;const d=1.5+Math.random()*2;const r=sz*(0.4+Math.random()*0.6);return <circle key={i} cx={x} cy={280} r={r} fill={color} opacity={0.2+tier*0.1}><animate attributeName=“cy” values=“280;30” dur={d+“s”} begin={i*0.12+“s”} repeatCount=“indefinite”/><animate attributeName=“opacity” values={0.2+tier*0.1+”;0”} dur={d+“s”} begin={i*0.12+“s”} repeatCount=“indefinite”/></circle>})}</>;
};

// Armor overlay for T2+
const Armor = ({tier,c1,c2}) => {
if (tier<2) return null;
const t3 = tier===3;
return (<g>
{/* Shoulder plates */}
<path d={t3?“M44,106 L28,86 L38,70 L62,78 L76,96 L70,110 Z”:“M54,104 L42,92 L50,82 L68,88 L76,100 Z”} fill={c1} opacity={t3?0.32:0.22} stroke={c1} strokeWidth={t3?2.5:1.5}/>
<path d={t3?“M156,106 L172,86 L162,70 L138,78 L124,96 L130,110 Z”:“M146,104 L158,92 L150,82 L132,88 L124,100 Z”} fill={c1} opacity={t3?0.32:0.22} stroke={c1} strokeWidth={t3?2.5:1.5}/>
{t3&&<><circle cx="48" cy="88" r="5" fill={c2||c1} opacity="0.5"><animate attributeName="opacity" values="0.3;0.85;0.3" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="152" cy="88" r="5" fill={c2||c1} opacity="0.5"><animate attributeName="opacity" values="0.3;0.85;0.3" dur="1.5s" repeatCount="indefinite" begin="0.4s"/></circle></>}
{/* Chest V */}
<path d={t3?“M74,112 L100,142 L126,112”:“M82,116 L100,130 L118,116”} fill=“none” stroke={c1} strokeWidth={t3?3:2} opacity=“0.5”/>
{t3&&<circle cx="100" cy="128" r="7" fill={c2||c1} opacity="0.3"><animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.2;0.55;0.2" dur="2s" repeatCount="indefinite"/></circle>}
{/* Crown for T3 */}
{t3&&<g><path d="M78,18 L86,4 L94,15 L100,-2 L106,15 L114,4 L122,18 Z" fill={c1} opacity="0.25" stroke={c1} strokeWidth="1.5"><animate attributeName="transform" values="translate(0,0);translate(0,-5);translate(0,0)" dur="3s" repeatCount="indefinite"/></path></g>}
</g>);
};

// ═══════════════════════════════════════════════
// SHARED BODY — clear arms, hands, clothing, no feet
// ═══════════════════════════════════════════════

const Body = ({tier, primary, accent, dark, robeStyle}) => {
// Robe/coat width grows with tier
const rw = [58,62,68,76][tier]; // half-width from center
const sw = [2,2.5,3.5,4.5][tier];
const colors = [dark||”#1a1a24”, dark||”#1a1a24”, primary+“44”, primary+“55”];
return (<g>
{/* ROBE — wider and more detailed at higher tiers */}
<path d={“M”+(100-rw/1.5)+”,105 L”+(100-rw)+”,235 Q”+(100-rw-5)+”,248 “+(100-rw-12)+”,260 L”+(100-rw+8)+”,255 Q100,265 “+(100+rw-8)+”,255 L”+(100+rw+12)+”,260 Q”+(100+rw+5)+”,248 “+(100+rw)+”,235 L”+(100+rw/1.5)+”,105”} fill={dark||”#1a1a24”} stroke={[accent+“55”,accent+“88”,accent,accent][tier]} strokeWidth={sw}/>
{/* Inner robe glow */}
<path d="M85,115 L82,240 L118,240 L115,115" fill={primary} opacity={[0.05,0.12,0.22,0.35][tier]}/>
{/* Collar */}
<path d=“M76,105 L70,78 L86,86 L84,105” fill={dark||”#1a1a24”} stroke={[accent+“66”,accent,accent,accent][tier]} strokeWidth={[1.5,2,2.5,3][tier]}/>
<path d=“M124,105 L116,86 L130,78 L124,105” fill={dark||”#1a1a24”} stroke={[accent+“66”,accent,accent,accent][tier]} strokeWidth={[1.5,2,2.5,3][tier]}/>
{/* Belt */}
{tier>=1&&<><line x1={100-rw+8} y1="190" x2={100+rw-8} y2="190" stroke={accent} strokeWidth={[0,1.5,2.5,3][tier]} opacity={[0,0.3,0.5,0.7][tier]}/>{tier>=2&&<circle cx="100" cy="190" r={[0,0,4,6][tier]} fill={accent} opacity="0.25"/>}</>}
{/* Robe rune lines T2+ */}
{tier>=2&&<><path d="M82,130 L80,185" fill="none" stroke={accent} strokeWidth="1" opacity={[0,0,0.15,0.3][tier]}/><path d="M118,130 L120,185" fill="none" stroke={accent} strokeWidth="1" opacity={[0,0,0.15,0.3][tier]}/></>}
{/* Bottom mist/fade — no feet */}
<ellipse cx="100" cy="258" rx={rw+5} ry="8" fill={primary} opacity={[0.04,0.08,0.14,0.22][tier]}/>
</g>);
};

// HEAD — simple, no face detail, just eyes
const Head = ({tier, primary, accent, eyeColor}) => {
const ec = eyeColor || accent;
const er = [2,3.5,5,7.5][tier];
const eop = [0.3,0.6,0.85,1][tier];
return (<g>
<ellipse cx="100" cy="58" rx="22" ry="26" fill="#0e0e14"/>
{/* Hood/hair shape at higher tiers */}
{tier>=2&&<path d={tier===3?“M74,56 Q72,28 100,20 Q128,28 126,56”:“M76,56 Q76,32 100,26 Q124,32 124,56”} fill=”#0e0e14” stroke={[” “,””,accent+“66”,accent+“88”][tier]} strokeWidth={tier===3?2:1.5}/>}
{/* Eyes */}
<circle cx="92" cy="54" r={er} fill={ec} opacity={eop}><animate attributeName=“opacity” values={eop*0.65+”;”+eop+”;”+eop*0.65} dur={2.2-tier*0.35+“s”} repeatCount=“indefinite”/></circle>
<circle cx="108" cy="54" r={er} fill={ec} opacity={eop}><animate attributeName=“opacity” values={eop*0.65+”;”+eop+”;”+eop*0.65} dur={2.2-tier*0.35+“s”} repeatCount=“indefinite” begin=“0.3s”/></circle>
{/* Eye glow */}
{tier>=2&&<><circle cx="92" cy="54" r={[0,0,12,20][tier]} fill={ec} opacity={[0,0,0.04,0.07][tier]}/><circle cx="108" cy="54" r={[0,0,12,20][tier]} fill={ec} opacity={[0,0,0.04,0.07][tier]}/></>}
{/* Eye trails T3 */}
{tier>=3&&<><path d="M85,54 L68,52 L52,54" stroke={ec} strokeWidth="2" opacity="0.35"><animate attributeName="opacity" values="0.2;0.55;0.2" dur="1.2s" repeatCount="indefinite"/></path><path d="M115,54 L132,52 L148,54" stroke={ec} strokeWidth="2" opacity="0.35"><animate attributeName="opacity" values="0.2;0.55;0.2" dur="1.2s" repeatCount="indefinite" begin="0.3s"/></path></>}
</g>);
};

// SHOULDERS — grow dramatically
const Shoulders = ({tier, accent, dark}) => {
const rx=[16,22,28,36][tier], ry=[7,10,13,17][tier];
return (<g>
<ellipse cx={100-[30,32,36,40][tier]} cy=“108” rx={rx} ry={ry} fill={dark||”#2a2a34”} stroke={accent} strokeWidth={[1.5,2,2.5,3.5][tier]}/>
<ellipse cx={100+[30,32,36,40][tier]} cy=“108” rx={rx} ry={ry} fill={dark||”#2a2a34”} stroke={accent} strokeWidth={[1.5,2,2.5,3.5][tier]}/>
{tier>=2&&<><circle cx={100-[0,0,36,40][tier]} cy="108" r={[0,0,5,8][tier]} fill={accent} opacity="0.3"><animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.8s" repeatCount="indefinite"/></circle><circle cx={100+[0,0,36,40][tier]} cy="108" r={[0,0,5,8][tier]} fill={accent} opacity="0.3"><animate attributeName="opacity" values="0.15;0.55;0.15" dur="1.8s" repeatCount="indefinite" begin="0.5s"/></circle></>}
</g>);
};

// ARM — a visible arm with hand. dir: -1=left, 1=right
// pose: “down”|“out”|“up” changes arm angle
const Arm = ({tier, dir, pose, accent, dark}) => {
const d = dir; // -1 or 1
const sx = 100 + d * [28,30,34,38][tier]; // shoulder x
const sw = [2.5,3.5,4.5,5.5][tier];
let elbowX, elbowY, handX, handY;
if (pose===“up”) {
elbowX = sx + d*[18,22,28,34][tier];
elbowY = [128,125,120,115][tier];
handX = elbowX + d*[10,14,18,22][tier];
handY = [108,102,95,85][tier];
} else if (pose===“out”) {
elbowX = sx + d*[20,25,30,36][tier];
elbowY = [138,135,132,128][tier];
handX = elbowX + d*[12,16,20,26][tier];
handY = [148,145,142,138][tier];
} else { // down
elbowX = sx + d*[12,16,20,26][tier];
elbowY = [145,142,140,136][tier];
handX = elbowX + d*[6,10,14,18][tier];
handY = [175,172,170,168][tier];
}
return (<g>
{/* Upper arm */}
<line x1={sx} y1={112} x2={elbowX} y2={elbowY} stroke={dark||”#1a1a24”} strokeWidth={sw+2} strokeLinecap=“round”/>
<line x1={sx} y1={112} x2={elbowX} y2={elbowY} stroke={accent} strokeWidth={sw*0.5} opacity={[0.15,0.3,0.45,0.6][tier]} strokeLinecap="round"/>
{/* Forearm */}
<line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke={dark||”#1a1a24”} strokeWidth={sw+1} strokeLinecap=“round”/>
<line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke={accent} strokeWidth={sw*0.4} opacity={[0.1,0.25,0.4,0.55][tier]} strokeLinecap="round"/>
{/* Hand */}
<circle cx={handX} cy={handY} r={[3.5,4.5,5.5,7][tier]} fill={dark||”#1a1a24”} stroke={accent} strokeWidth={[1,1.5,2,2.5][tier]} opacity={[0.5,0.7,0.85,1][tier]}/>
{/* Gauntlet glow T2+ */}
{tier>=2&&<circle cx={handX} cy={handY} r={[0,0,10,16][tier]} fill={accent} opacity={[0,0,0.04,0.06][tier]}/>}
</g>);
};

// ═══════════════════════════════════════════════
// MOUNTS — appear at T2 (small), T3 (epic)
// Each character has a unique mount theme
// ═══════════════════════════════════════════════

const MountDragon = ({tier,c1,c2}) => {
if (tier<2) return null;
const sc = tier===3 ? 1.3 : 0.85;
const op = tier===3 ? 0.35 : 0.18;
return (<g transform={“translate(100,245) scale(”+sc+”)”} opacity={op}>
{/* Dragon body */}
<path d=“M-45,10 Q-35,-15 -15,-18 Q0,-20 15,-15 Q30,-8 40,5 Q50,15 55,10” fill=“none” stroke={c1} strokeWidth={tier===3?3:2}/>
{/* Dragon head */}
<path d="M55,10 L68,2 L65,12 L55,10" fill={c1} opacity="0.4" stroke={c1} strokeWidth="1.5"/>
<circle cx="64" cy="6" r="1.5" fill={c2||c1} opacity="0.8"/>
{/* Dragon tail */}
<path d=“M-45,10 Q-58,8 -65,15 Q-70,20 -62,18” fill=“none” stroke={c1} strokeWidth={tier===3?2.5:1.5}/>
{/* Wings */}
<path d="M-5,-15 Q-15,-38 -30,-45 Q-18,-32 -10,-20" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1.5"/>
<path d="M15,-12 Q25,-35 40,-40 Q28,-28 20,-18" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1.5"/>
{/* Dragon legs */}
<path d=“M-20,-8 L-25,10 M10,-5 L8,12” fill=“none” stroke={c1} strokeWidth={tier===3?2:1.5}/>
{tier===3&&<><path d="M-5,-15 Q-20,-48 -38,-55 Q-22,-40 -12,-24" fill={c1} opacity="0.1" stroke={c1} strokeWidth="1"/><circle cx="64" cy="6" r="4" fill="none" stroke={c2||c1} strokeWidth="0.5" opacity="0.3"><animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite"/></circle></>}
</g>);
};

const MountWolf = ({tier,c1,c2}) => {
if (tier<2) return null;
const sc = tier===3?1.3:0.85, op = tier===3?0.35:0.18;
return (<g transform={“translate(100,248) scale(”+sc+”)”} opacity={op}>
<path d=“M-40,5 Q-30,-12 -10,-15 Q10,-16 25,-10 Q38,-2 48,8” fill=“none” stroke={c1} strokeWidth={tier===3?3:2}/>
<path d="M48,8 L58,0 L56,10 L48,8" fill={c1} opacity="0.4" stroke={c1} strokeWidth="1.5"/>
<circle cx="55" cy="4" r="1.5" fill={c2||c1} opacity="0.8"/>
<path d="M48,0 L52,-10 L50,0" fill="none" stroke={c1} strokeWidth="1.5"/>
<path d="M46,2 L50,-8 L48,2" fill="none" stroke={c1} strokeWidth="1.5"/>
<path d=“M-40,5 Q-52,2 -58,8 Q-62,12 -55,10 Q-60,6 -56,14” fill=“none” stroke={c1} strokeWidth={tier===3?2:1.5}/>
<path d=“M-18,-8 L-22,10 M15,-6 L12,12 M35,0 L34,14” fill=“none” stroke={c1} strokeWidth={tier===3?2:1.5}/>
{tier===3&&<circle cx="55" cy="4" r="4" fill="none" stroke={c2||c1} strokeWidth="0.5" opacity="0.3"><animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite"/></circle>}
</g>);
};

const MountHawk = ({tier,c1,c2}) => {
if (tier<2) return null;
const sc = tier===3?1.3:0.85, op = tier===3?0.35:0.18;
return (<g transform={“translate(100,240) scale(”+sc+”)”} opacity={op}>
<path d="M-8,0 Q0,-5 8,0" fill="none" stroke={c1} strokeWidth="2"/>
<path d="M8,0 L18,-2 L16,3 L8,0" fill={c1} opacity="0.4"/>
<circle cx="15" cy="0" r="1" fill={c2||c1}/>
<path d="M-8,0 Q-30,-20 -55,-25 Q-35,-12 -20,-5" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1.5"><animate attributeName="d" values="M-8,0 Q-30,-20 -55,-25 Q-35,-12 -20,-5;M-8,0 Q-30,-15 -55,-18 Q-35,-8 -20,-3;M-8,0 Q-30,-20 -55,-25 Q-35,-12 -20,-5" dur="2s" repeatCount="indefinite"/></path>
<path d="M4,-2 Q26,-22 50,-28 Q32,-14 18,-6" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1.5"><animate attributeName="d" values="M4,-2 Q26,-22 50,-28 Q32,-14 18,-6;M4,-2 Q26,-17 50,-21 Q32,-10 18,-4;M4,-2 Q26,-22 50,-28 Q32,-14 18,-6" dur="2s" repeatCount="indefinite"/></path>
<path d="M-8,0 L-14,4 Q-16,8 -12,6" fill="none" stroke={c1} strokeWidth="1.5"/>
</g>);
};

const MountSerpent = ({tier,c1,c2}) => {
if (tier<2) return null;
const sc = tier===3?1.3:0.85, op = tier===3?0.35:0.18;
return (<g transform={“translate(100,250) scale(”+sc+”)”} opacity={op}>
<path d=“M-50,0 Q-35,-18 -15,-12 Q5,-6 15,-14 Q30,-22 45,-10 Q55,-2 60,8” fill=“none” stroke={c1} strokeWidth={tier===3?3:2}/>
<path d="M60,8 L70,4 L68,12 L60,8" fill={c1} opacity="0.4" stroke={c1} strokeWidth="1.5"/>
<circle cx="66" cy="7" r="1.5" fill={c2||c1} opacity="0.8"/>
<path d="M-50,0 Q-55,5 -48,4" fill="none" stroke={c1} strokeWidth="1.5"/>
{tier===3&&<><path d="M-15,-12 Q-10,-25 0,-28 Q-5,-18 -8,-12" fill={c1} opacity="0.12" stroke={c1} strokeWidth="1"/><path d="M35,-16 Q40,-28 50,-30 Q42,-20 38,-14" fill={c1} opacity="0.12" stroke={c1} strokeWidth="1"/></>}
</g>);
};

const MountSteed = ({tier,c1,c2}) => {
if (tier<2) return null;
const sc = tier===3?1.3:0.85, op = tier===3?0.35:0.18;
return (<g transform={“translate(100,245) scale(”+sc+”)”} opacity={op}>
<path d=“M-35,5 Q-25,-12 -5,-15 Q15,-16 30,-8 Q42,0 48,10” fill=“none” stroke={c1} strokeWidth={tier===3?3:2}/>
<path d="M48,10 Q52,2 58,-5 Q56,5 52,12 L48,10" fill={c1} opacity="0.3" stroke={c1} strokeWidth="1.5"/>
<circle cx="55" cy="-1" r="1.5" fill={c2||c1} opacity="0.8"/>
<path d="M56,-5 L58,-14 L54,-6" fill="none" stroke={c1} strokeWidth="1.5"/>
<path d="M54,-3 L56,-12 L52,-4" fill="none" stroke={c1} strokeWidth="1.5"/>
<path d="M-35,5 Q-42,0 -38,8 Q-44,4 -40,12" fill="none" stroke={c1} strokeWidth="1.5"/>
<path d=“M-15,-8 L-18,14 M10,-8 L8,16 M30,-2 L28,16” fill=“none” stroke={c1} strokeWidth={tier===3?2:1.5}/>
</g>);
};

const MOUNT_MAP = {
ER: MountDragon, RS: MountSteed, RM: MountWolf, ES: MountSteed,
RE: MountSteed, SM: MountSerpent, SE: MountWolf, ME: MountHawk,
MA: MountSerpent, EA: MountDragon, EM: MountWolf, AS: MountSerpent,
RA: MountWolf, EAv: MountDragon, REv: MountWolf
};

// ═══════════════════════════════════════════════
// WEAPONS — unique per character, scale with tier
// ═══════════════════════════════════════════════

const Weapons = {
// Strategist: Staff with cracking coin
ER: ({tier,handX,handY,c1,c2}) => {
const g=”#C9A456”, sl=[30,40,55,72][tier];
return (<g>
<line x1={handX} y1={handY} x2={handX} y2={handY-sl} stroke={c1} strokeWidth={[2,3,4,5][tier]}/>
<circle cx={handX} cy={handY-sl} r={[6,9,13,18][tier]} fill={g} stroke="#E8D5A0" strokeWidth={[1.5,2,3,4][tier]}/>
<line x1={handX-2} y1={handY-sl-[4,7,10,14][tier]} x2={handX+2} y2={handY-sl+[4,7,10,14][tier]} stroke="#1a0e30" strokeWidth={[1,1.5,2,3][tier]}/>
{tier>=1&&Array.from({length:[0,3,7,14][tier]},(*,i)=> <circle key={i} cx={handX-5+i*2} cy={handY-sl-6} r={[0,2,2.5,3.5][tier]} fill={g} opacity="0.6"><animate attributeName=“cy” values={handY-sl-6+”;”+((handY-sl-55))} dur={0.8+i*0.1+“s”} repeatCount=“indefinite”/><animate attributeName=“opacity” values=“0.6;0” dur={0.8+i*0.1+“s”} repeatCount=“indefinite”/></circle>)}
{tier>=2&&<circle cx={handX} cy={handY-sl} r={[0,0,20,30][tier]} fill="none" stroke={g} strokeWidth="1" opacity="0.12"><animate attributeName=“r” values={[0,0,20,30][tier]+”;”+[0,0,30,44][tier]+”;”+[0,0,20,30][tier]} dur=“2s” repeatCount=“indefinite”/></circle>}
</g>);
},
// Commander: Shield + baton
RS: ({tier,c1,c2}) => {
const sx=100-[28,30,34,38][tier]-[18,22,28,36][tier]-[6,10,14,18][tier]; // left hand x
const sy=[175,172,170,168][tier];
const shw=[12,16,22,30][tier], shh=[16,22,30,40][tier];
return (<g>
<path d={“M”+(sx-shw/2)+”,”+(sy-shh/2)+” L”+sx+”,”+(sy+shh/2)+” L”+(sx+shw/2)+”,”+(sy-shh/2)+” Z”} fill={c1} opacity={[0.15,0.25,0.35,0.45][tier]} stroke={c1} strokeWidth={[1.5,2,3,4][tier]}/>
{tier>=1&&<path d={“M”+(sx-shw/3)+”,”+(sy-shh/3)+” L”+sx+”,”+(sy+shh/3)+” L”+(sx+shw/3)+”,”+(sy-shh/3)} fill=“none” stroke={c2||c1} strokeWidth=“1” opacity=“0.3”/>}
{tier>=2&&<circle cx={sx} cy={sy-shh/4} r={[0,0,3,5][tier]} fill={c2||c1} opacity="0.35"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite"/></circle>}
</g>);
},
// Hunter: Sniper scope/crossbow
RM: ({tier,handX,handY,c1,c2}) => {
const r=”#C0392B”, sc=[12,16,24,34][tier];
return (<g transform={“translate(”+handX+”,”+handY+”)”}>
<circle cx="0" cy={-sc*0.5} r={sc} fill="none" stroke={r} strokeWidth={[1.5,2,3,4.5][tier]} opacity={[0.25,0.4,0.6,0.85][tier]}/>
<circle cx="0" cy={-sc*0.5} r={[2,3,5,8][tier]} fill={r} opacity={[0.2,0.4,0.65,1][tier]}/>
<line x1={-sc} y1={-sc*0.5} x2={-[4,5,8,12][tier]} y2={-sc*0.5} stroke={r} strokeWidth={[1,1.5,2.5,3.5][tier]}/>
<line x1={[4,5,8,12][tier]} y1={-sc*0.5} x2={sc} y2={-sc*0.5} stroke={r} strokeWidth={[1,1.5,2.5,3.5][tier]}/>
<line x1="0" y1={-sc*0.5-sc} x2="0" y2={-sc*0.5-[4,5,8,12][tier]} stroke={r} strokeWidth={[1,1.5,2.5,3.5][tier]}/>
<line x1="0" y1={-sc*0.5+[4,5,8,12][tier]} x2="0" y2={-sc*0.5+sc} stroke={r} strokeWidth={[1,1.5,2.5,3.5][tier]}/>
{tier>=2&&<circle cx="0" cy={-sc*0.5} r={sc+[0,0,10,18][tier]} fill="none" stroke={r} strokeWidth="0.8" opacity="0.1"><animate attributeName=“r” values={sc+[0,0,10,18][tier]+”;”+((sc+[0,0,20,32][tier]))+”;”+((sc+[0,0,10,18][tier]))} dur=“2s” repeatCount=“indefinite”/></circle>}
</g>);
},
// Architect: Floating blocks + compass
ES: ({tier,handX,handY,c1,c2}) => {
const g=”#E8C76A”;
return (<g>
{Array.from({length:[1,2,3,5][tier]},(*,i)=> <rect key={i} x={handX-5+i*[12,10,8,7][tier]-[0,5,10,14][tier]} y={handY-[20,28,38,50][tier]+i*[8,6,5,4][tier]} width={[8,10,14,18][tier]} height={[8,10,14,18][tier]} fill={c1} opacity={[0.15,0.2,0.25,0.3][tier]} stroke={g} strokeWidth={[1,1.5,2,2.5][tier]} rx="1"><animate attributeName=“y” values={(handY-[20,28,38,50][tier]+i*[8,6,5,4][tier])+”;”+(handY-[20,28,38,50][tier]+i*[8,6,5,4][tier]-[8,12,16,22][tier])+”;”+(handY-[20,28,38,50][tier]+i*[8,6,5,4][tier])} dur={3+i*0.5+“s”} repeatCount=“indefinite”/></rect>)}
{tier>=1&&<text x={handX+[12,14,18,24][tier]} y={handY-[10,15,22,30][tier]} fill={g} fontSize={[8,11,14,20][tier]} fontFamily="serif" opacity={[0.2,0.4,0.6,0.85][tier]}>∑</text>}
{tier>=2&&<text x={handX-[0,0,28,36][tier]} y={handY-[0,0,32,45][tier]} fill={c1} fontSize={[0,0,12,18][tier]} fontFamily="serif" opacity="0.4">π</text>}
</g>);
},
// Executor: Energy fists
RE: ({tier,c1,c2}) => {
const a=”#FF8A5C”;
return (<g>
{[[-1,“out”],[1,“out”]].map(([d],i)=> {
const sx=100+d*[28,30,34,38][tier];
const ex=sx+d*[20,25,30,36][tier];
const hx=ex+d*[12,16,20,26][tier];
return <g key={i}>
<circle cx={hx} cy={[148,145,142,138][tier]} r={[0,8,14,22][tier]} fill="none" stroke={c1} strokeWidth={[0,2,3.5,5][tier]} opacity={[0,0.2,0.35,0.55][tier]}><animate attributeName=“r” values={[0,6,10,16][tier]+”;”+[0,14,22,34][tier]+”;”+[0,6,10,16][tier]} dur=“1.2s” repeatCount=“indefinite” begin={i*0.5+“s”}/><animate attributeName=“opacity” values={[0,0.2,0.35,0.55][tier]+”;0;”+[0,0.2,0.35,0.55][tier]} dur=“1.2s” repeatCount=“indefinite” begin={i*0.5+“s”}/></circle>
{tier>=3&&<circle cx={hx} cy={138} r="32" fill="none" stroke={a} strokeWidth="1" opacity="0.06"><animate attributeName=“r” values=“28;40;28” dur=“1.2s” repeatCount=“indefinite” begin={i*0.5+“s”}/></circle>}
</g>;
})}
</g>);
},
// Mind Master: Floating orb
SM: ({tier,c1,c2}) => (<g>
<circle cx="100" cy={[155,148,140,128][tier]} r={[5,8,14,22][tier]} fill="none" stroke={c1} strokeWidth={[1,2,3,4][tier]} opacity={[0.15,0.3,0.5,0.7][tier]}><animate attributeName=“r” values={[5,8,14,22][tier]+”;”+[9,16,24,36][tier]+”;”+[5,8,14,22][tier]} dur={2.5-tier*0.3+“s”} repeatCount=“indefinite”/></circle>
<circle cx="100" cy={[155,148,140,128][tier]} r={[2,4,7,12][tier]} fill={c1} opacity={[0.1,0.25,0.4,0.65][tier]}><animate attributeName=“opacity” values={[0.05,0.15,0.25,0.45][tier]+”;”+[0.15,0.4,0.6,0.85][tier]+”;”+[0.05,0.15,0.25,0.45][tier]} dur=“2s” repeatCount=“indefinite”/></circle>
{tier>=3&&<circle cx="100" cy={128} r="32" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.06"><animate attributeName="r" values="32;44;32" dur="2s" repeatCount="indefinite"/></circle>}
</g>),
// Algorithm: Data blades
SE: ({tier,handX,handY,c1,c2}) => {
const a=”#4AFF9E”, bl=[15,22,32,45][tier];
return (<g>
<line x1={handX} y1={handY} x2={handX} y2={handY-bl} stroke={c1} strokeWidth={[2,3,4,5.5][tier]} opacity={[0.3,0.5,0.7,0.9][tier]}/>
<line x1={handX} y1={handY-bl} x2={handX} y2={handY-bl-[4,6,8,12][tier]} stroke={a} strokeWidth={[1,1.5,2,3][tier]} opacity="0.5"/>
{tier>=1&&<g opacity={[0,0.3,0.5,0.75][tier]}><text x={handX-[0,8,14,20][tier]} y={handY-bl/2} fill={c1} fontSize={[0,7,9,12][tier]} fontFamily="monospace">01</text><text x={handX+[0,4,8,10][tier]} y={handY-bl/2+10} fill={a} fontSize={[0,6,8,10][tier]} fontFamily="monospace">if</text></g>}
</g>);
},
// Flash: Lightning daggers
ME: ({tier,handX,handY,c1,c2}) => {
const a=”#48D1E8”, bl=[12,18,28,40][tier];
return (<g>
<path d={“M”+handX+”,”+handY+” L”+(handX+[4,6,8,12][tier])+”,”+(handY-bl*0.4)+” L”+(handX-[2,3,4,6][tier])+”,”+(handY-bl*0.6)+” L”+(handX+[3,5,7,10][tier])+”,”+(handY-bl)} fill=“none” stroke={c1} strokeWidth={[2,3,4,6][tier]} opacity={[0.3,0.5,0.65,0.85][tier]}><animate attributeName=“opacity” values={[0.2,0.3,0.45,0.65][tier]+”;”+[0.05,0.1,0.15,0.2][tier]+”;”+[0.2,0.3,0.45,0.65][tier]} dur=“0.6s” repeatCount=“indefinite”/></path>
</g>);
},
// Tide Rider: Trident
MA: ({tier,handX,handY,c1,c2}) => {
const sl=[25,35,48,65][tier];
return (<g>
<line x1={handX} y1={handY} x2={handX} y2={handY-sl} stroke={c1} strokeWidth={[2,3,4,5][tier]}/>
<path d={“M”+(handX-[4,6,10,14][tier])+”,”+(handY-sl)+” L”+handX+”,”+(handY-sl-[8,12,18,26][tier])+” L”+(handX+[4,6,10,14][tier])+”,”+(handY-sl)} fill=“none” stroke={c1} strokeWidth={[1.5,2,3,4][tier]}/>
{tier>=1&&<><path d={“M”+(handX-[0,4,8,12][tier])+”,”+(handY-sl)+” L”+(handX-[0,6,10,16][tier])+”,”+(handY-sl-[0,6,10,16][tier])} fill=“none” stroke={c1} strokeWidth={[0,1.5,2,3][tier]}/><path d={“M”+(handX+[0,4,8,12][tier])+”,”+(handY-sl)+” L”+(handX+[0,6,10,16][tier])+”,”+(handY-sl-[0,6,10,16][tier])} fill=“none” stroke={c1} strokeWidth={[0,1.5,2,3][tier]}/></>}
</g>);
},
// Pioneer: Flame sword
EA: ({tier,handX,handY,c1,c2}) => {
const a=”#FF9A6C”, sl=[18,28,40,55][tier];
return (<g>
<line x1={handX} y1={handY} x2={handX} y2={handY-sl*0.4} stroke="#555" strokeWidth={[2,3,4,5][tier]}/>
<path d={“M”+(handX-[3,4,6,8][tier])+”,”+(handY-sl*0.4)+” L”+handX+”,”+(handY-sl)+” L”+(handX+[3,4,6,8][tier])+”,”+(handY-sl*0.4)} fill={c1} opacity={[0.2,0.35,0.5,0.7][tier]} stroke={c1} strokeWidth={[1.5,2,3,4][tier]}/>
{tier>=2&&<path d={“M”+handX+”,”+(handY-sl)+” Q”+(handX-[0,0,5,8][tier])+”,”+(handY-sl-[0,0,10,18][tier])+” “+handX+”,”+(handY-sl-[0,0,15,25][tier])} fill=“none” stroke={a} strokeWidth=“1.5” opacity=“0.25”><animate attributeName="opacity" values="0.15;0.4;0.15" dur="0.8s" repeatCount="indefinite"/></path>}
</g>);
},
// Shadow: Scepter with web
EM: ({tier,handX,handY,c1,c2}) => {
const sl=[20,30,42,58][tier];
return (<g>
<line x1={handX} y1={handY} x2={handX} y2={handY-sl} stroke={c1} strokeWidth={[2,3,4,5][tier]}/>
<circle cx={handX} cy={handY-sl} r={[4,6,8,12][tier]} fill="none" stroke={c1} strokeWidth={[1,1.5,2,3][tier]} opacity={[0.2,0.35,0.5,0.7][tier]}/>
{tier>=1&&[0,1,2].map(i=> <line key={i} x1={handX} y1={handY-sl} x2={handX+[0,8,12,18][tier]*Math.cos(i*2.1-1)} y2={handY-sl+[0,8,12,18][tier]*Math.sin(i*2.1-1)} stroke={c1} strokeWidth="1" opacity={[0,0.2,0.35,0.5][tier]}/>)}
</g>);
},
// Evolver: Morphing shape
AS: ({tier,handX,handY,c1,c2}) => {
const s=”#1ABC9C”, r=[6,10,16,24][tier];
return (<g>
<circle cx={handX} cy={handY-r*1.5} r={r} fill="none" stroke={c1} strokeWidth={[1,2,3,4][tier]} opacity={[0.15,0.3,0.5,0.7][tier]}><animate attributeName=“rx” values={r+”;”+r*0.6+”;”+r} dur=“3s” repeatCount=“indefinite”/></circle>
{tier>=1&&<circle cx={handX} cy={handY-r*1.5} r={r*0.5} fill={s} opacity={[0,0.15,0.3,0.5][tier]}/>}
</g>);
},
// Contrarian: Ice hammer
RA: ({tier,handX,handY,c1,c2}) => {
const sl=[18,26,38,52][tier];
return (<g>
<line x1={handX} y1={handY} x2={handX} y2={handY-sl} stroke={c1} strokeWidth={[2,3,4,5][tier]}/>
<rect x={handX-[5,7,10,14][tier]} y={handY-sl-[5,7,10,14][tier]} width={[10,14,20,28][tier]} height={[10,14,20,28][tier]} fill={c1} opacity={[0.15,0.25,0.35,0.5][tier]} stroke={c1} strokeWidth={[1,1.5,2,3][tier]} rx="2"/>
{tier>=2&&<circle cx={handX} cy={handY-sl} r={[0,0,14,22][tier]} fill="none" stroke={c1} strokeWidth="0.8" opacity="0.08"><animate attributeName=“r” values={[0,0,14,22][tier]+”;”+[0,0,22,34][tier]+”;”+[0,0,14,22][tier]} dur=“2s” repeatCount=“indefinite”/></circle>}
</g>);
},
// Oracle: Crystal orb on staff
EAv: ({tier,handX,handY,c1,c2}) => {
const s=”#E8D5F5”, sl=[22,32,45,62][tier];
return (<g>
<line x1={handX} y1={handY} x2={handX} y2={handY-sl} stroke={c1} strokeWidth={[2,3,4,5][tier]}/>
<circle cx={handX} cy={handY-sl} r={[5,8,12,18][tier]} fill={c1} opacity={[0.08,0.15,0.25,0.4][tier]}><animate attributeName=“opacity” values={[0.05,0.1,0.18,0.28][tier]+”;”+[0.12,0.25,0.38,0.55][tier]+”;”+[0.05,0.1,0.18,0.28][tier]} dur=“2s” repeatCount=“indefinite”/></circle>
<circle cx={handX} cy={handY-sl} r={[5,8,12,18][tier]} fill="none" stroke={s} strokeWidth={[1,1.5,2.5,3.5][tier]} opacity={[0.2,0.35,0.5,0.75][tier]}/>
{tier>=2&&<circle cx={handX} cy={handY-sl} r={[0,0,18,28][tier]} fill="none" stroke={s} strokeWidth="0.8" opacity="0.08"><animate attributeName=“r” values={[0,0,18,28][tier]+”;”+[0,0,28,42][tier]+”;”+[0,0,18,28][tier]} dur=“2.5s” repeatCount=“indefinite”/></circle>}
</g>);
},
// Lone Wolf: Katana
REv: ({tier,handX,handY,c1,c2}) => {
const r=”#DC143C”, sl=[22,32,48,68][tier];
return (<g>
<line x1={handX} y1={handY} x2={handX+[2,3,4,6][tier]} y2={handY-sl} stroke="#888" strokeWidth={[2,2.5,3.5,4.5][tier]}/>
<line x1={handX-[3,4,6,8][tier]} y1={handY} x2={handX+[3,4,6,8][tier]} y2={handY} stroke={c1} strokeWidth={[2,3,4,5][tier]}/>
{tier>=1&&<path d={“M”+(handX+[2,3,4,6][tier])+”,”+(handY-sl)+” L”+(handX+[3,4,6,8][tier])+”,”+(handY-sl-[4,6,10,16][tier])} fill=“none” stroke=”#aaa” strokeWidth={[1,1.5,2,3][tier]}/>}
{tier>=2&&<line x1={handX+[0,0,4,6][tier]} y1={handY-sl} x2={handX+[0,0,4,6][tier]} y2={handY-sl-[0,0,10,16][tier]} stroke={r} strokeWidth="1.5" opacity="0.3"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1s" repeatCount="indefinite"/></line>}
</g>);
},
};

// ═══════════════════════════════════════════════
// FULL CHARACTER RENDERER
// ═══════════════════════════════════════════════

const CharacterSVG = ({type, size, tier=0}) => {
const char = CHARACTERS[type];
if (!char) return null;
const {primary:p, accent:a, dark:dk} = char.colors;
const Mount = MOUNT_MAP[type];
const WeaponFn = Weapons[type];

// Calculate right hand position for weapon
const rsx = 100 + [28,30,34,38][tier];
const relx = rsx + [18,22,28,34][tier];
const rhx = relx + [10,14,18,22][tier];
const rhy = [108,102,95,85][tier];

// left hand for some weapons
const lsx = 100 - [28,30,34,38][tier];
const lelx = lsx - [12,16,20,26][tier];
const lhx = lelx - [6,10,14,18][tier];
const lhy = [175,172,170,168][tier];

// Determine arm poses based on character
const rightPose = [“ER”,“RM”,“ES”,“SE”,“ME”,“MA”,“EA”,“EM”,“AS”,“RA”,“EAv”,“REv”].includes(type) ? “up” : “out”;
const leftPose = [“RS”,“RE”].includes(type) ? “out” : “down”;

return (
<svg viewBox="-30 -60 260 360" width={size} height={size*1.38}>
<Aura tier={tier} color={p}/>
<Wings tier={tier} c1={a} c2={p}/>
{/* Mount behind character */}
{Mount && <Mount tier={tier} c1={a} c2={p}/>}
<Armor tier={tier} c1={a} c2={p}/>
<Body tier={tier} primary={p} accent={a} dark={dk}/>
<Shoulders tier={tier} accent={a} dark={dk}/>
{/* LEFT ARM */}
<Arm tier={tier} dir={-1} pose={leftPose} accent={a} dark={dk}/>
{/* RIGHT ARM — weapon hand */}
<Arm tier={tier} dir={1} pose={rightPose} accent={a} dark={dk}/>
<Head tier={tier} primary={p} accent={a} eyeColor={type===“ER”&&tier>=3?”#C9A456”:type===“RM”?”#C0392B”:type===“RE”?”#FF8A5C”:undefined}/>
{/* WEAPON */}
{WeaponFn && <WeaponFn tier={tier} handX={rightPose===“up”?rhx:relx+[12,16,20,26][tier]*1} handY={rightPose===“up”?rhy:[148,145,142,138][tier]} c1={a} c2={p}/>}
{/* RS left-hand shield */}
{type===“RS” && Weapons.RS({tier, c1:a, c2:”#A0785A”})}
{/* SM orb between hands */}
{type===“SM” && Weapons.SM({tier, c1:a, c2:p})}
{/* RE fist rings */}
{type===“RE” && Weapons.RE({tier, c1:”#E8622E”, c2:”#FF8A5C”})}
<Burst tier={tier} color={a}/>
<ellipse cx="100" cy="278" rx={[50,58,66,78][tier]} ry={[6,8,12,16][tier]} fill={p} opacity={[0.06,0.12,0.2,0.3][tier]}/>
</svg>
);
};

// ═══════════════════════════════════════════════
// CHARACTER CARD
// ═══════════════════════════════════════════════

const CharacterCard = ({type,tier=0,scores,showAnimation=false}) => {
const char=CHARACTERS[type];const[revealed,setRevealed]=useState(!showAnimation);const[showQuote,setShowQuote]=useState(!showAnimation);
const t=TIER_DATA[tier];
useEffect(()=>{if(showAnimation){setTimeout(()=>setRevealed(true),300);setTimeout(()=>setShowQuote(true),1800)}},[showAnimation]);
if(!char) return null;
const sampleScores=scores||{EDGE:78,RISK:72,MENTAL:65,ADAPT:55,EXEC:68,SYSTEM:70};
const tierColor=tier===3?”#C9A456”:char.colors.primary;const tierAccent=tier===3?”#E8D5A0”:char.colors.accent||char.colors.primary;
const borderGlow=[“1px solid “+char.colors.primary+“22”,“1px solid “+char.colors.primary+“55”,“2px solid “+char.colors.primary+“aa”,“2px solid “+char.colors.primary][tier];
const boxGlow=[“none”,“0 0 20px “+char.colors.glow.replace(‘0.4’,‘0.2’),“0 0 35px “+char.colors.glow.replace(‘0.4’,‘0.3’)+”, 0 0 70px “+char.colors.glow.replace(‘0.4’,‘0.1’),“0 0 50px “+char.colors.glow+”, 0 0 100px “+char.colors.glow.replace(‘0.4’,‘0.2’)+”, inset 0 0 40px “+char.colors.glow.replace(‘0.4’,‘0.06’)][tier];
return (
<div style={{width:“360px”,opacity:revealed?1:0,transform:revealed?“scale(1) rotateY(0deg)”:“scale(0.7) rotateY(180deg)”,filter:revealed?“blur(0)”:“blur(20px)”,transition:“all 1.2s cubic-bezier(0.34,1.56,0.64,1)”}}>
<div style={{borderRadius:“20px”,overflow:“hidden”,background:“linear-gradient(170deg, “+char.colors.dark+” 0%, #0d0f14 40%, “+char.colors.dark+” 100%)”,border:borderGlow,boxShadow:boxGlow}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,padding:“14px 18px 0”}}>
<div style={{display:“flex”,alignItems:“center”,gap:“5px”,background:char.colors.primary+“22”,padding:“3px 10px”,borderRadius:“16px”,border:“1px solid “+char.colors.primary+“44”}}><span style={{fontSize:“12px”}}>{char.element}</span><span style={{fontFamily:”‘Space Mono’,monospace”,fontSize:“10px”,color:char.colors.secondary,letterSpacing:“1px”}}>{char.elementName}</span></div>
<div style={{display:“flex”,alignItems:“center”,gap:“5px”,background:tier===3?“linear-gradient(135deg,#C9A45622,#E8D5A022)”:tierColor+“15”,padding:“4px 12px”,borderRadius:“16px”,border:“1px solid “+(tier===3?”#C9A45666”:tierColor+“44”)}}><span style={{fontSize:“13px”}}>{t.badge}</span><span style={{fontFamily:”‘Space Mono’,monospace”,fontSize:“9px”,color:tierAccent,letterSpacing:“1px”}}>{t.english}</span></div>
</div>
<div style={{display:“flex”,justifyContent:“center”,gap:“6px”,padding:“10px 0 0”}}>{TIER_DATA.map((td,i)=> <div key={i} style={{width:i===tier?“20px”:“8px”,height:“8px”,borderRadius:“4px”,background:i<=tier?(tier===3?”#C9A456”:char.colors.primary):“rgba(255,255,255,0.06)”,boxShadow:i===tier?“0 0 8px “+(tier===3?”#C9A456”:char.colors.primary)+“66”:“none”}}/>)}</div>
<div style={{display:“flex”,justifyContent:“center”,padding:“0 10px”}}><div style={{animation:tier===3?“float 4s ease-in-out infinite”:“none”}}><CharacterSVG type={type} size={220} tier={tier}/></div></div>
<div style={{display:“flex”,alignItems:“center”,gap:“10px”,padding:“0 28px”}}><div style={{flex:1,height:“1px”,background:“linear-gradient(90deg,transparent,”+tierColor+”,transparent)”}}/><span style={{color:tierColor,fontSize:“10px”}}>✦</span><div style={{flex:1,height:“1px”,background:“linear-gradient(90deg,transparent,”+tierColor+”,transparent)”}}/></div>
<div style={{textAlign:“center”,padding:“12px 16px 0”}}><h2 style={{fontFamily:“Georgia,‘Noto Serif SC’,serif”,fontSize:“26px”,fontWeight:900,color:”#E8E6E1”,margin:0,letterSpacing:“5px”}}>{char.name}</h2><p style={{fontFamily:”‘Space Mono’,monospace”,fontSize:“11px”,color:char.colors.primary,margin:“4px 0 0”,letterSpacing:“2px”}}>{char.subtitle}</p><p style={{fontSize:“10px”,color:tierAccent,margin:“4px 0 0”,letterSpacing:“2px”,opacity:0.6}}>{t.badge} {t.name} · Lv.{t.level}</p></div>
<div style={{textAlign:“center”,padding:“10px 28px 0”,opacity:showQuote?1:0,transform:showQuote?“translateY(0)”:“translateY(15px)”,transition:“all 0.6s ease”}}><p style={{fontFamily:“Georgia,‘Noto Serif SC’,serif”,fontSize:“13px”,color:tierColor,fontStyle:“italic”,margin:0,lineHeight:1.8}}>”{char.quote}”</p></div>
<div style={{display:“flex”,justifyContent:“center”,padding:“14px 0 6px”}}><svg viewBox=“0 0 200 200” style={{width:“130px”,height:“130px”}}>{[0.3,0.6,0.9].map((s,i)=>{const pts=[0,1,2,3,4,5].map(j=>{const aa=(Math.PI*2*j)/6-Math.PI/2;return (100+Math.cos(aa)*55*s)+”,”+(100+Math.sin(aa)*55*s)}).join(” “);return <polygon key={i} points={pts} fill="none" stroke="#2a2a3a" strokeWidth="0.5"/>})}{(()=>{const vals=Object.values(sampleScores).map(v=>v/100);const pts=vals.map((v,i)=>{const aa=(Math.PI*2*i)/6-Math.PI/2;return (100+Math.cos(aa)*55*v)+”,”+(100+Math.sin(aa)*55*v)}).join(” “);return <><polygon points={pts} fill={char.colors.primary+“33”} stroke={char.colors.primary} strokeWidth=“1.5”/>{vals.map((v,i)=>{const aa=(Math.PI*2*i)/6-Math.PI/2;return <circle key={i} cx={100+Math.cos(aa)*55*v} cy={100+Math.sin(aa)*55*v} r="2.5" fill={tierColor} stroke="#0D0F14" strokeWidth="1"/>})}</>})()}{[“认知”,“风控”,“心理”,“适应”,“执行”,“系统”].map((l,i)=>{const aa=(Math.PI*2*i)/6-Math.PI/2;const vals=Object.values(sampleScores);return <text key={i} x={100+Math.cos(aa)*75} y={100+Math.sin(aa)*75} textAnchor="middle" dominantBaseline="middle" fill="#8B95A5" fontSize="9">{l} {vals[i]}</text>})}</svg></div>
<div style={{padding:“4px 22px 14px”,opacity:showQuote?0.4:0,transition:“opacity 1s ease 0.3s”}}><p style={{fontFamily:“sans-serif”,fontSize:“11px”,color:”#8B95A5”,lineHeight:1.7,margin:0,textAlign:“center”,fontStyle:“italic”}}>{char.storyHint}</p></div>
<div style={{padding:“0 20px 16px”,display:“flex”,flexDirection:“column”,gap:“8px”}}>
<button style={{width:“100%”,padding:“12px 0”,borderRadius:“10px”,cursor:“pointer”,background:“linear-gradient(135deg,”+char.colors.primary+“22,”+char.colors.primary+“11)”,border:“1px solid “+char.colors.primary+“44”,color:”#E8E6E1”,fontSize:“13px”,letterSpacing:“2px”,fontFamily:”‘Noto Serif SC’,serif”}}>📄 查看完整报告</button>
<button style={{width:“100%”,padding:“14px 0”,borderRadius:“10px”,cursor:“pointer”,background:tier===3?“linear-gradient(135deg,#C9A45633,#E8D5A022)”:“linear-gradient(135deg,rgba(201,164,86,0.08),rgba(201,164,86,0.03))”,border:tier===3?“1px solid #C9A45688”:“1px solid rgba(201,164,86,0.15)”,color:tier===3?”#E8D5A0”:”#8B95A5”,fontSize:“13px”,letterSpacing:“2px”,fontFamily:”‘Noto Serif SC’,serif”}}>👑 职业操盘手 · 实盘直播间<span style={{display:“block”,fontSize:“10px”,color:tier===3?“rgba(232,213,160,0.5)”:“rgba(201,164,86,0.35)”,marginTop:“4px”,letterSpacing:“1px”}}>{tier===3?“🔴 LIVE · 点击进入直播间”:“升至 Lv.4 解锁完整权限”}</span></button>
</div>
{tier<3&&<div style={{padding:“0 20px 16px”}}><div style={{background:“rgba(255,255,255,0.015)”,borderRadius:“8px”,padding:“10px 14px”,border:“1px solid rgba(255,255,255,0.03)”}}><p style={{fontSize:“9px”,color:“rgba(255,255,255,0.2)”,margin:“0 0 4px”,letterSpacing:“1px”}}>下一阶晋升条件</p><p style={{fontSize:“11px”,color:“rgba(255,255,255,0.4)”,margin:0,lineHeight:1.5}}>{TIER_DATA[tier+1].criteria}</p><p style={{fontSize:“9px”,color:“rgba(255,255,255,0.15)”,margin:“6px 0 0”,letterSpacing:“1px”}}>📧 转发邮件到 verify@deltapex.com</p></div></div>}
</div>
</div>
);
};

// ═══════════════════════════════════════════════
// SILHOUETTE — CSS filter on CharacterSVG, auto-updates when model changes
// ═══════════════════════════════════════════════
const SilhouettePreview = ({type, tier, size=120}) => (

  <div style={{position:"relative",width:size,height:size*1.38}}>
    <div style={{filter:"brightness(0) saturate(0)",opacity:0.82}}><CharacterSVG type={type} size={size} tier={tier}/></div>
    <div style={{position:"absolute",top:0,left:0,filter:"brightness(0) saturate(0) drop-shadow(0 0 8px rgba(255,255,255,0.18))",opacity:0.25,pointerEvents:"none"}}><CharacterSVG type={type} size={size} tier={tier}/></div>
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:size*0.14,opacity:0.55}}>🔒</div>
  </div>
);

// ═══════════════════════════════════════════════
// TIER ROADMAP — shows progression with silhouettes for locked tiers
// ═══════════════════════════════════════════════
const TierRoadmap = ({type, currentTier=0}) => {
const char=CHARACTERS[type];
if(!char) return null;
return (
<div style={{display:“flex”,flexDirection:“column”,alignItems:“center”,gap:“16px”,padding:“20px 10px”,background:“rgba(255,255,255,0.01)”,borderRadius:“16px”,border:“1px solid rgba(255,255,255,0.04)”,marginTop:“16px”,width:“100%”,maxWidth:“520px”}}>
<h3 style={{color:”#E8E6E1”,fontFamily:“Georgia,‘Noto Serif SC’,serif”,fontSize:“15px”,letterSpacing:“3px”,margin:0}}>⚔️ 晋升之路</h3>
<div style={{display:“flex”,alignItems:“flex-end”,gap:“8px”,width:“100%”,justifyContent:“center”,flexWrap:“wrap”}}>
{TIER_DATA.map((td,i)=>{
const unlocked=i<=currentTier, current=i===currentTier;
const sz=current?140:95;
return (
<div key={i} style={{display:“flex”,flexDirection:“column”,alignItems:“center”,gap:“6px”,opacity:unlocked?1:0.65,transition:“all 0.4s ease”,flex:current?“none”:“0 0 auto”}}>
<div style={{display:“flex”,alignItems:“center”,gap:“3px”,padding:“2px 8px”,borderRadius:“10px”,background:current?char.colors.primary+“33”:“rgba(255,255,255,0.02)”,border:“1px solid “+(current?char.colors.primary+“66”:“rgba(255,255,255,0.05)”)}}>
<span style={{fontSize:“11px”}}>{td.badge}</span>
<span style={{fontSize:“9px”,color:current?”#E8E6E1”:”#5a5a6a”,letterSpacing:“1px”}}>{td.name}</span>
</div>
<div style={{borderRadius:“12px”,padding:“6px”,background:current?char.colors.dark:“rgba(0,0,0,0.2)”,border:current?“2px solid “+char.colors.primary+“66”:“1px solid rgba(255,255,255,0.03)”,boxShadow:current?“0 0 24px “+char.colors.glow:“none”,transition:“all 0.4s ease”}}>
{unlocked
? <CharacterSVG type={type} size={sz} tier={i}/>
: <SilhouettePreview type={type} tier={i} size={sz}/>
}
</div>
<span style={{fontSize:“9px”,color:current?char.colors.accent:”#4a4a5a”,letterSpacing:“1px”}}>Lv.{td.level}</span>
{!unlocked&&<p style={{fontSize:“8px”,color:“rgba(255,255,255,0.22)”,textAlign:“center”,maxWidth:“85px”,lineHeight:1.4,margin:0}}>{td.criteria}</p>}
</div>
);
})}
</div>
<div style={{display:“flex”,alignItems:“center”,gap:“0”,marginTop:”-6px”}}>
{[0,1,2].map(i=> <div key={i} style={{display:“flex”,alignItems:“center”}}>
<div style={{width:“40px”,height:“2px”,background:i<currentTier?char.colors.primary:“rgba(255,255,255,0.06)”,borderRadius:“1px”}}/>
<div style={{width:“6px”,height:“6px”,borderRadius:“50%”,background:i<currentTier?char.colors.primary:i===currentTier?char.colors.primary+“88”:“rgba(255,255,255,0.06)”}}/>
</div>)}
</div>
</div>
);
};

export default function TraderCardGallery() {
const [selected,setSelected]=useState(“ER”);const[tier,setTier]=useState(0);const[animKey,setAnimKey]=useState(0);const[view,setView]=useState(“card”);
const typeList=Object.keys(CHARACTERS);
return (
<div style={{minHeight:“100vh”,background:”#0D0F14”,fontFamily:“sans-serif”,display:“flex”,flexDirection:“column”,alignItems:“center”,padding:“20px”}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
<h1 style={{color:”#E8E6E1”,fontFamily:“Georgia,serif”,fontSize:“20px”,marginBottom:“4px”,letterSpacing:“3px”}}>交易员人格卡牌系统</h1>
<p style={{color:”#8B95A5”,fontSize:“11px”,marginBottom:“12px”,letterSpacing:“1px”}}>15 ARCHETYPES · 4 TIER EVOLUTION</p>
{/* View toggle */}
<div style={{display:“flex”,gap:“4px”,marginBottom:“14px”,background:“rgba(255,255,255,0.02)”,borderRadius:“10px”,padding:“3px”,border:“1px solid rgba(255,255,255,0.05)”}}>
{[{k:“card”,l:“🃏 卡牌”},{k:“roadmap”,l:“⚔️ 晋升路线”}].map(v=> <button key={v.k} onClick={()=>setView(v.k)} style={{background:view===v.k?CHARACTERS[selected].colors.primary+“22”:“transparent”,border:view===v.k?“1px solid “+CHARACTERS[selected].colors.primary+“44”:“1px solid transparent”,borderRadius:“8px”,padding:“5px 14px”,cursor:“pointer”,color:view===v.k?”#E8E6E1”:”#5a5a6a”,fontSize:“11px”,letterSpacing:“1px”,transition:“all 0.3s”}}>{v.l}</button>)}
</div>
{/* Tier selector */}
<div style={{display:“flex”,gap:“6px”,marginBottom:“14px”,flexWrap:“wrap”,justifyContent:“center”}}>{TIER_DATA.map((td,i)=> <button key={i} onClick={()=>{setTier(i);setAnimKey(k=>k+1)}} style={{background:i===tier?(i===3?“linear-gradient(135deg,#C9A45633,#E8D5A022)”:CHARACTERS[selected].colors.primary+“22”):“rgba(255,255,255,0.02)”,border:“1px solid “+(i===tier?(i===3?”#C9A45666”:CHARACTERS[selected].colors.primary+“66”):“rgba(255,255,255,0.06)”),borderRadius:“8px”,padding:“6px 12px”,cursor:“pointer”,color:i===tier?”#E8E6E1”:”#5a5a6a”,fontSize:“11px”,display:“flex”,alignItems:“center”,gap:“4px”}}><span style={{fontSize:“12px”}}>{td.badge}</span><span>{td.name}</span></button>)}</div>
{/* Character selector */}
<div style={{display:“flex”,flexWrap:“wrap”,gap:“5px”,justifyContent:“center”,maxWidth:“600px”,marginBottom:“20px”}}>{typeList.map(id=>{const c=CHARACTERS[id];const isActive=selected===id;return <button key={id} onClick={()=>{setSelected(id);setAnimKey(k=>k+1)}} style={{background:isActive?c.colors.primary+“33”:“rgba(255,255,255,0.02)”,border:“1px solid “+(isActive?c.colors.primary:“rgba(255,255,255,0.06)”),borderRadius:“8px”,padding:“5px 9px”,cursor:“pointer”,color:isActive?”#E8E6E1”:”#6a6a7a”,fontSize:“10px”,display:“flex”,alignItems:“center”,gap:“3px”}}><span style={{fontSize:“11px”}}>{c.element}</span>{c.name}</button>})}</div>
{/* Content */}
{view===“card” ? (
<CharacterCard key={animKey+”-”+tier} type={selected} tier={tier} showAnimation={true}/>
) : (
<TierRoadmap type={selected} currentTier={tier}/>
)}
<p style={{color:”#3a3a4a”,fontSize:“10px”,marginTop:“14px”,fontFamily:”‘Space Mono’,monospace”,letterSpacing:“2px”}}>{CHARACTERS[selected].english} · {view===“roadmap”?“PROGRESSION PATH”:TIER_DATA[tier].english}</p>
</div>
);
}