import type { Dimension } from './questions';

export interface TraderType {
  code: string;
  icon: string;
  name: string;
  subtitle: string;
  dims: [Dimension, Dimension];
  oneLiner: string;
  description: string;
  strengths: [string, string];
  blindSpots: [string, string];
  advice: string;
}

export interface RankTier {
  name: string;
  icon: string;
  color: string;
  minScore: number;
  maxScore: number;
}

export const rankTiers: RankTier[] = [
  { name: '传奇交易员', icon: '\u{1F48E}', color: '#B388FF', minScore: 85, maxScore: 100 },
  { name: '大师交易员', icon: '\u{1F3C6}', color: '#FFD700', minScore: 70, maxScore: 84 },
  { name: '精英交易员', icon: '\u{2B50}', color: '#00D4FF', minScore: 55, maxScore: 69 },
  { name: '进阶交易员', icon: '\u{1F4C8}', color: '#00E676', minScore: 40, maxScore: 54 },
  { name: '成长交易员', icon: '\u{1F331}', color: '#FFA726', minScore: 25, maxScore: 39 },
  { name: '新手交易员', icon: '\u{1F3AE}', color: '#FF5252', minScore: 0, maxScore: 24 },
];

export const rarityMap: Record<string, string> = {
  RS: "8.3%",
  RM: "7.1%",
  RE: "9.5%",
  SM: "5.2%",
  SE: "6.8%",
  SV: "4.1%",
  ME: "11.2%",
  MV: "3.7%",
  MA: "10.5%",
  AE: "12.3%",
  AV: "6.4%",
  VE: "14.9%",
};

export const typeMapping: Record<string, string> = {
  'RISKMENTAL': 'RM',
  'RISKEXEC': 'RE',
  'RISKSYSTEM': 'RS',
  'MENTALEXEC': 'ME',
  'MENTALSYSTEM': 'SM',
  'MENTALVISION': 'MV',
  'MENTALADAPT': 'MA',
  'SYSTEMEXEC': 'SE',
  'SYSTEMVISION': 'SV',
  'ADAPTEXEC': 'AE',
  'ADAPTVISION': 'AV',
  'EXECVISION': 'VE',
  'RISKADAPT': 'RM',
  'RISKVISION': 'RE',
  'ADAPTSYSTEM': 'SE',
};

export const traderTypes: Record<string, TraderType> = {
  RS: {
    code: 'RS',
    icon: '\u{1F6E1}\u{FE0F}',
    name: '铁壁指挥官',
    subtitle: 'RISK + SYSTEM',
    dims: ['RISK', 'SYSTEM'],
    oneLiner: '你是战场上最难被击败的人。',
    description: '你拥有顶级的风险管理意识和系统化思维。你的交易像一座精密运转的堡垒——每一笔进出都有规则，每一分风险都被计算。你可能不是赚得最多的，但你一定是活得最久的。',
    strengths: ['止损纪律极强，亏损永远在可控范围', '有完整的交易体系，不靠感觉做决策'],
    blindSpots: ['可能过于保守，错过大行情的利润空间', '规则太死板时可能不适应快速变化的市场'],
    advice: '尝试在你的系统中加入趋势跟踪的弹性空间，让利润跑起来。',
  },
  RM: {
    code: 'RM',
    icon: '\u{1F3AF}',
    name: '冷静猎手',
    subtitle: 'RISK + MENTAL',
    dims: ['RISK', 'MENTAL'],
    oneLiner: '你是暴风中最稳的那个人。',
    description: '你把风控刻在了骨子里，同时拥有让人羡慕的情绪稳定性。别人在恐慌抛售的时候，你在冷静计算止损位。你的账户曲线可能不刺激，但一定很平滑。',
    strengths: ['极少情绪化交易，亏损时心态稳如泰山', '风控意识顶级，回撤控制优秀'],
    blindSpots: ['可能缺乏系统化的进场方法论', '太"稳"可能导致交易频率偏低'],
    advice: '建立一套明确的入场信号系统，让你的冷静和风控有更锋利的矛。',
  },
  RE: {
    code: 'RE',
    icon: '\u{2699}\u{FE0F}',
    name: '钢铁执行者',
    subtitle: 'RISK + EXEC',
    dims: ['RISK', 'EXEC'],
    oneLiner: '你是交易纪律的化身。',
    description: '你是规则的忠实执行者，同时深谙仓位管理的艺术。当其他人在纠结要不要止损时，你已经果断离场去寻找下一个机会了。你的执行力是你最大的武器。',
    strengths: ['说到做到，制定的规则绝不违反', '仓位管理严格，永远不会因为单笔交易爆仓'],
    blindSpots: ['可能对市场的灵活适应不够', '执行的"系统"本身可能需要优化'],
    advice: '在执行的基础上加入更多策略回测和市场环境分析，让纪律更有方向。',
  },
  SM: {
    code: 'SM',
    icon: '\u{1F9E0}',
    name: '心智大师',
    subtitle: 'SYSTEM + MENTAL',
    dims: ['SYSTEM', 'MENTAL'],
    oneLiner: '你的大脑就是最强的交易系统。',
    description: '你将理性的系统思维和强大的心理素质完美结合。你有清晰的交易框架，又不会被情绪干扰判断。你是那种复盘本写得比交易记录还详细的人。',
    strengths: ['交易体系完整且能持续迭代', '在亏损面前保持理性分析'],
    blindSpots: ['可能想太多而错过最佳执行时机', '在快速行情中可能反应偏慢'],
    advice: '给自己设定决策时间限制，分析到80分就执行，别等100分。',
  },
  SE: {
    code: 'SE',
    icon: '\u{1F916}',
    name: '算法战士',
    subtitle: 'SYSTEM + EXEC',
    dims: ['SYSTEM', 'EXEC'],
    oneLiner: '你是一台精密的交易机器。',
    description: '你有体系，更有执行力。你就像一个自律到极致的算法程序——信号来了就执行，没有信号就等待。你的交易日志可能是整个朋友圈里最规范的。',
    strengths: ['有策略有执行，知行合一', '复盘和优化能力强'],
    blindSpots: ['可能对宏观大势缺乏敏感度', '过于机械可能在极端行情中吃亏'],
    advice: '每周花30分钟关注宏观经济动态，给你的系统加上"大环境过滤器"。',
  },
  SV: {
    code: 'SV',
    icon: '\u{1F3D7}\u{FE0F}',
    name: '体系建筑师',
    subtitle: 'SYSTEM + VISION',
    dims: ['SYSTEM', 'VISION'],
    oneLiner: '你在下一盘很大的棋。',
    description: '你拥有宏观视野和体系化思维的双重buff。你善于从高处俯瞰市场全貌，然后用系统化的方法落地执行。你可能更适合做中长线——因为你看到的东西比大多数人远。',
    strengths: ['能把宏观判断转化为具体的交易系统', '格局大，不容易被短线噪音干扰'],
    blindSpots: ['可能在短线执行层面不够果断', '宏观判断一旦错误，纠错速度可能偏慢'],
    advice: '给你的宏观判断设置明确的"验证截止日期"和"证伪信号"。',
  },
  ME: {
    code: 'ME',
    icon: '\u{26A1}',
    name: '极速闪电',
    subtitle: 'MENTAL + EXEC',
    dims: ['MENTAL', 'EXEC'],
    oneLiner: '你是战场上反应最快的战士。',
    description: '你拥有良好的心理素质和超强的执行力。当机会出现时，你不犹豫、不纠结、直接出手。你在日内交易和快节奏市场中如鱼得水。',
    strengths: ['决策速度快，能抓住稍纵即逝的机会', '心态稳定，快速止损毫不犹豫'],
    blindSpots: ['可能缺乏完整的交易系统支撑', '快节奏容易导致过度交易'],
    advice: '为你的"闪电出击"建立一套过滤条件，不是每个快球都要接。',
  },
  MV: {
    code: 'MV',
    icon: '\u{1F9D8}',
    name: '禅定智者',
    subtitle: 'MENTAL + VISION',
    dims: ['MENTAL', 'VISION'],
    oneLiner: '你是市场里最有耐心的猎人。',
    description: '你站得高看得远，而且拥有等待猎物的超凡耐心。你不会被短线波动扰乱心智，也不会因为错过一次机会而焦躁。大机会来时，你的内心比任何人都坚定。',
    strengths: ['能看清大趋势并坚定持有', '情绪极其稳定，不受市场噪音影响'],
    blindSpots: ['在执行具体操作时可能偏慢或犹豫', '可能缺乏量化的风控体系'],
    advice: '给你的禅定加一把剑——建立明确的量化止损规则和仓位管理公式。',
  },
  MA: {
    code: 'MA',
    icon: '\u{1F98E}',
    name: '百变适者',
    subtitle: 'MENTAL + ADAPT',
    dims: ['MENTAL', 'ADAPT'],
    oneLiner: '你是交易世界的进化论赢家。',
    description: '你拥有超强的市场适应力，配合稳定的交易心态，无论市场怎么变，你都能调整节奏。你像水一样——倒入什么容器，就变成什么形状。',
    strengths: ['能快速适应不同市场风格', '心态灵活，不会被单一模式困住'],
    blindSpots: ['可能缺少一套核心的"不变"策略', '适应性太强可能导致风格漂移'],
    advice: '找到你的1-2个核心策略作为"根据地"，灵活调整是加分项，不是全部。',
  },
  AE: {
    code: 'AE',
    icon: '\u{1F3F9}',
    name: '敏捷游击手',
    subtitle: 'ADAPT + EXEC',
    dims: ['ADAPT', 'EXEC'],
    oneLiner: '你是市场里最灵活的战术家。',
    description: '你既能快速适应新环境，又有立刻执行的行动力。你不怕陌生的品种和未知的行情，总能在变化中找到机会。游击战是你的主场。',
    strengths: ['行动力强，适应力强，双重加持', '在波动大的市场中表现突出'],
    blindSpots: ['风控意识不够强，冲太快容易受伤', '缺乏长期视角可能限制收益上限'],
    advice: '在你的灵活战术上加一个"单笔最大亏损"的硬性天花板。',
  },
  AV: {
    code: 'AV',
    icon: '\u{1F985}',
    name: '全域猎鹰',
    subtitle: 'ADAPT + VISION',
    dims: ['ADAPT', 'VISION'],
    oneLiner: '你是看得最远又飞得最快的人。',
    description: '你兼具宏观视野和灵活适应力。你不仅能看到大趋势，还能在趋势中灵活调整策略。你的交易哲学是"顺大势，做灵活"。',
    strengths: ['能在宏观框架内灵活切换战术', '对市场变化的感知能力极强'],
    blindSpots: ['可能在具体执行环节不够果断', '太多选择可能导致注意力分散'],
    advice: '为自己建立一个"今日只做X"的聚焦机制，鹰也需要锁定一个猎物。',
  },
  VE: {
    code: 'VE',
    icon: '\u{1F451}',
    name: '趋势霸主',
    subtitle: 'VISION + EXEC',
    dims: ['VISION', 'EXEC'],
    oneLiner: '你天生就是做大行情的人。',
    description: '你看得到大趋势，而且有执行的魄力。当别人还在犹豫时，你已经重仓上车了。当别人在震荡中被洗出去时，你还在坚定持有。大行情是你的主场。',
    strengths: ['趋势判断 + 执行力的王炸组合', '在大牛/大熊市中盈利能力极强'],
    blindSpots: ['在震荡市中可能频繁止损', '可能忽视风控导致回撤过大'],
    advice: '加强你的"震荡识别器"，在趋势不明时降低仓位，保存弹药等大机会。',
  },
};
