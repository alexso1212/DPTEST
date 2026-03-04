export interface CharacterColors {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  glow: string;
}

export interface CharacterData {
  id: string;
  name: string;
  english: string;
  subtitle: string;
  element: string;
  elementName: string;
  quote: string;
  storyHint: string;
  colors: CharacterColors;
}

export const CHARACTERS: Record<string, CharacterData> = {
  ER: { id: "ER", name: "格局掌控者", english: "THE STRATEGIST", subtitle: "EDGE × RISK", element: "⚡", elementName: "THUNDER",
    quote: "我在你们看到混沌的地方，看到了结构。",
    storyHint: "他在所有人都只看到'不可能'的时候，看到了结构性的裂缝。",
    colors: { primary: "#6B3FA0", secondary: "#C8C8D0", accent: "#9B6FD0", dark: "#1a1035", glow: "rgba(107,63,160,0.4)" } },
  RS: { id: "RS", name: "铁壁指挥官", english: "THE COMMANDER", subtitle: "RISK × SYSTEM", element: "🧊", elementName: "ICE",
    quote: "市场可以崩塌，但我的系统不会。", storyHint: "他把一生经验写成了'原则'。",
    colors: { primary: "#3D5A80", secondary: "#A0785A", accent: "#5B8AB5", dark: "#0f1a28", glow: "rgba(61,90,128,0.4)" } },
  RM: { id: "RM", name: "冷静猎手", english: "THE HUNTER", subtitle: "RISK × MENTAL", element: "🌿", elementName: "WIND",
    quote: "我不急。我等最好的那一枪。", storyHint: "赚大钱靠的是坐得住。",
    colors: { primary: "#2D4A3E", secondary: "#C0392B", accent: "#4A7A6A", dark: "#0a1a14", glow: "rgba(45,74,62,0.4)" } },
  ES: { id: "ES", name: "基石建筑师", english: "THE ARCHITECT", subtitle: "EDGE × SYSTEM", element: "🌍", elementName: "EARTH",
    quote: "逻辑就是我的蓝图。", storyHint: "用密码破译的方法找到了市场暗号。",
    colors: { primary: "#D4A843", secondary: "#2C2C34", accent: "#E8C76A", dark: "#141008", glow: "rgba(212,168,67,0.4)" } },
  RE: { id: "RE", name: "钢铁执行者", english: "THE EXECUTOR", subtitle: "RISK × EXEC", element: "🔥", elementName: "FIRE",
    quote: "犹豫一秒，就是对纪律的背叛。", storyHint: "先别被打倒。",
    colors: { primary: "#E8622E", secondary: "#1C1C24", accent: "#FF8A5C", dark: "#1a0c06", glow: "rgba(232,98,46,0.4)" } },
  SM: { id: "SM", name: "心智大师", english: "THE MIND MASTER", subtitle: "SYSTEM × MENTAL", element: "💧", elementName: "WATER",
    quote: "我的敌人不是市场，是我自己的完美主义。", storyHint: "为什么你知道该怎么做，却做不到？",
    colors: { primary: "#2C3E6B", secondary: "#A8B8D0", accent: "#4A6AAF", dark: "#0a0f1f", glow: "rgba(44,62,107,0.4)" } },
  SE: { id: "SE", name: "算法战士", english: "THE ALGORITHM", subtitle: "SYSTEM × EXEC", element: "⚡", elementName: "VOLT",
    quote: "情绪是bug。我只执行代码。", storyHint: "用概率论赢到被赌场列入黑名单。",
    colors: { primary: "#00E676", secondary: "#0A0A0F", accent: "#4AFF9E", dark: "#040a06", glow: "rgba(0,230,118,0.4)" } },
  ME: { id: "ME", name: "极速闪电", english: "THE FLASH", subtitle: "MENTAL × EXEC", element: "⚡", elementName: "SPARK",
    quote: "在你还在想的时候，我已经做完了。", storyHint: "1万美金变成了114万。",
    colors: { primary: "#00B4D8", secondary: "#F0F4F8", accent: "#48D1E8", dark: "#041218", glow: "rgba(0,180,216,0.4)" } },
  MA: { id: "MA", name: "潮汐顺行者", english: "THE TIDE RIDER", subtitle: "MENTAL × ADAPT", element: "💧", elementName: "FLOW",
    quote: "我不预测浪，我乘浪。", storyHint: "5000美金变成1500万。",
    colors: { primary: "#0077B6", secondary: "#DEB875", accent: "#3399CC", dark: "#041420", glow: "rgba(0,119,182,0.4)" } },
  EA: { id: "EA", name: "烈焰先锋", english: "THE PIONEER", subtitle: "EXEC × ADAPT", element: "🔥", elementName: "BLAZE",
    quote: "错了就改，改了就干。", storyHint: "400美元起步做到2亿。",
    colors: { primary: "#FF6B35", secondary: "#8B0000", accent: "#FF9A6C", dark: "#1a0800", glow: "rgba(255,107,53,0.4)" } },
  EM: { id: "EM", name: "影子博弈者", english: "THE SHADOW", subtitle: "EDGE × MENTAL", element: "🌿", elementName: "MIST",
    quote: "我在你不注意的地方，已经布好了局。", storyHint: "连续30年没有亏损。",
    colors: { primary: "#B8860B", secondary: "#484848", accent: "#D4A832", dark: "#120e04", glow: "rgba(184,134,11,0.4)" } },
  AS: { id: "AS", name: "体系适应者", english: "THE EVOLVER", subtitle: "ADAPT × SYSTEM", element: "💧", elementName: "SHIFT",
    quote: "我的系统不是固定的，它会呼吸。", storyHint: "她是那5%。",
    colors: { primary: "#9B59B6", secondary: "#1ABC9C", accent: "#BB77DD", dark: "#120a18", glow: "rgba(155,89,182,0.4)" } },
  RA: { id: "RA", name: "冰血破局者", english: "THE CONTRARIAN", subtitle: "RISK × ADAPT", element: "🧊", elementName: "FROST",
    quote: "越乱，我越清醒。", storyHint: "两年后，他赢了。",
    colors: { primary: "#A8DADC", secondary: "#1D3557", accent: "#C8EEF0", dark: "#0a1520", glow: "rgba(168,218,220,0.4)" } },
  EAv: { id: "EAv", name: "直觉行者", english: "THE ORACLE", subtitle: "EDGE × ADAPT", element: "✨", elementName: "AURA",
    quote: "我不分析，我感知。", storyHint: "53年间只有一个月亏损。",
    colors: { primary: "#4A0E78", secondary: "#E8D5F5", accent: "#7B3AAF", dark: "#0e0420", glow: "rgba(74,14,120,0.4)" } },
  REv: { id: "REv", name: "孤狼战士", english: "THE LONE WOLF", subtitle: "独立型", element: "🌿", elementName: "VOID",
    quote: "我不需要别人告诉我该怎么做。", storyHint: "他从不听任何人的建议。",
    colors: { primary: "#6C757D", secondary: "#DC143C", accent: "#8A9199", dark: "#0e0e10", glow: "rgba(108,117,125,0.4)" } },
};
