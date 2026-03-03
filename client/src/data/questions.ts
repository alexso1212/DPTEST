export interface QuestionOption {
  text: string;
  scores: Partial<Record<Dimension, number>>;
}

export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  options: QuestionOption[];
}

export type Dimension = 'RISK' | 'MENTAL' | 'SYSTEM' | 'ADAPT' | 'EXEC' | 'VISION';

export const dimensionLabels: Record<Dimension, string> = {
  RISK: '风险管理',
  MENTAL: '交易心理',
  SYSTEM: '系统思维',
  ADAPT: '市场适应',
  EXEC: '执行力',
  VISION: '大局观',
};

export const questions: Question[] = [
  {
    id: 0,
    dimension: 'RISK',
    text: '你重仓买入了一个品种，入场后立刻浮亏3%。此时你会：',
    options: [
      { text: '立刻止损离场，严格执行规则', scores: { RISK: 10, EXEC: 2 } },
      { text: '加仓拉低均价，我看好这个方向', scores: { RISK: 2, VISION: 4 } },
      { text: '先观察一下，等下一根K线再决定', scores: { RISK: 6, MENTAL: 4 } },
      { text: '很焦虑，不断在"止损"和"扛单"之间纠结', scores: { RISK: 2, MENTAL: 2 } },
    ],
  },
  {
    id: 1,
    dimension: 'RISK',
    text: '你的账户连续亏损了5笔交易，你的第一反应是：',
    options: [
      { text: '立刻停止交易，复盘分析哪里出了问题', scores: { RISK: 10, SYSTEM: 4 } },
      { text: '可能是市场风格变了，我需要调整策略', scores: { RISK: 6, ADAPT: 6 } },
      { text: '减小仓位继续，亏损是正常的', scores: { RISK: 8, MENTAL: 2 } },
      { text: '想加大仓位把亏的赚回来', scores: { RISK: 1, MENTAL: 1 } },
    ],
  },
  {
    id: 2,
    dimension: 'MENTAL',
    text: '你有一笔交易已经浮盈50%，但还没到目标位。突然行情剧烈震荡，你会：',
    options: [
      { text: '果断止盈落袋，利润不能变亏损', scores: { MENTAL: 6, EXEC: 4 } },
      { text: '移动止盈到成本线，让利润奔跑', scores: { MENTAL: 8, SYSTEM: 6 } },
      { text: '内心很纠结，看一眼关一眼，最后被震出去', scores: { MENTAL: 2, EXEC: 2 } },
      { text: '不管它，目标没到就不动', scores: { MENTAL: 4, VISION: 6 } },
    ],
  },
  {
    id: 3,
    dimension: 'MENTAL',
    text: '周末你复盘发现本周因为情绪化操作亏了很多钱。周一开盘你会：',
    options: [
      { text: '冷静执行既定计划，过去的已经过去', scores: { MENTAL: 10, EXEC: 4 } },
      { text: '先轻仓试探，等状态恢复再加仓', scores: { MENTAL: 8, RISK: 4 } },
      { text: '有点怕了，犹豫要不要先休息几天', scores: { MENTAL: 4, ADAPT: 4 } },
      { text: '心里窝火，想找机会猛干一把', scores: { MENTAL: 1, RISK: 1 } },
    ],
  },
  {
    id: 4,
    dimension: 'SYSTEM',
    text: '你是怎么决定买入一个品种的？',
    options: [
      { text: '我有一套完整的入场条件清单，满足了才下单', scores: { SYSTEM: 10, EXEC: 4 } },
      { text: '主要看技术面信号，结合一些市场情绪判断', scores: { SYSTEM: 6, ADAPT: 4 } },
      { text: '看别人推荐的，或者群里大家在聊的', scores: { SYSTEM: 2, VISION: 2 } },
      { text: '靠感觉和经验，觉得差不多就进了', scores: { SYSTEM: 3, MENTAL: 4 } },
    ],
  },
  {
    id: 5,
    dimension: 'SYSTEM',
    text: '关于交易记录和复盘，你的习惯是：',
    options: [
      { text: '每笔交易都有记录，每周做系统复盘', scores: { SYSTEM: 10, EXEC: 6 } },
      { text: '会记录，但复盘不太规律', scores: { SYSTEM: 6, EXEC: 4 } },
      { text: '偶尔记一下，主要靠脑子记', scores: { SYSTEM: 3, EXEC: 2 } },
      { text: '基本不记录，做完就做完了', scores: { SYSTEM: 1, EXEC: 1 } },
    ],
  },
  {
    id: 6,
    dimension: 'ADAPT',
    text: '市场突然从单边趋势变成宽幅震荡，你之前的策略连续失效，你会：',
    options: [
      { text: '立刻研究震荡行情的交易方法并切换策略', scores: { ADAPT: 8, SYSTEM: 4 } },
      { text: '减小仓位，继续用原来的方法但加宽止损', scores: { ADAPT: 4, RISK: 6 } },
      { text: '停止交易，等市场回到自己熟悉的节奏', scores: { ADAPT: 6, MENTAL: 4 } },
      { text: '不管什么行情，我的方法应该都能用', scores: { ADAPT: 1, SYSTEM: 2 } },
    ],
  },
  {
    id: 7,
    dimension: 'ADAPT',
    text: '一个你完全不了解的新品种/新赛道突然大涨，朋友圈都在讨论，你会：',
    options: [
      { text: '先花时间研究清楚，找到自己的入场逻辑再说', scores: { ADAPT: 8, SYSTEM: 6 } },
      { text: '小仓位先试试，边做边学', scores: { ADAPT: 6, RISK: 4 } },
      { text: 'FOMO了，直接冲进去先说', scores: { ADAPT: 2, RISK: 1 } },
      { text: '不在自己能力圈内的不碰', scores: { ADAPT: 4, RISK: 8 } },
    ],
  },
  {
    id: 8,
    dimension: 'EXEC',
    text: '你的交易系统发出了入场信号，但你刚亏了两笔心情不好。你会：',
    options: [
      { text: '信号出了就执行，情绪不能影响系统', scores: { EXEC: 10, SYSTEM: 6 } },
      { text: '做，但减小仓位来缓解心理压力', scores: { EXEC: 6, RISK: 6 } },
      { text: '犹豫了很久最后没做，然后行情如预期，很后悔', scores: { EXEC: 2, MENTAL: 2 } },
      { text: '跳过这次，等心态好了再说', scores: { EXEC: 4, MENTAL: 4 } },
    ],
  },
  {
    id: 9,
    dimension: 'EXEC',
    text: '你给自己制定了严格的交易规则，但今天你"感觉"某个机会很好，虽然不完全符合规则。你会：',
    options: [
      { text: '不做。不符合规则的一概不碰', scores: { EXEC: 10, SYSTEM: 8 } },
      { text: '做，但只用很小仓位，当作一次"实验"', scores: { EXEC: 4, ADAPT: 6 } },
      { text: '纠结了一会，最后还是忍不住做了', scores: { EXEC: 2, MENTAL: 2 } },
      { text: '规则是死的人是活的，灵活应变才是高手', scores: { EXEC: 1, ADAPT: 2 } },
    ],
  },
  {
    id: 10,
    dimension: 'VISION',
    text: '对于宏观经济/政策面的变化（比如加息、地缘政治），你的态度是：',
    options: [
      { text: '密切关注，它决定了大方向，顺势而为', scores: { VISION: 10, ADAPT: 4 } },
      { text: '会关注，但具体操作还是以技术面为主', scores: { VISION: 6, SYSTEM: 4 } },
      { text: '偶尔看看新闻，但觉得短线影响不大', scores: { VISION: 3, ADAPT: 2 } },
      { text: '不太关心，我只看图表做交易', scores: { VISION: 1, SYSTEM: 4 } },
    ],
  },
  {
    id: 11,
    dimension: 'VISION',
    text: '如果让你选一个最像你的交易风格：',
    options: [
      { text: '大趋势交易者：抓大波段，持仓周期长，不在意短期波动', scores: { VISION: 10, MENTAL: 4 } },
      { text: '波段交易者：顺着趋势做波段，持仓几天到几周', scores: { VISION: 6, SYSTEM: 6 } },
      { text: '日内交易者：每天进出，快进快出，不过夜', scores: { VISION: 4, EXEC: 4 } },
      { text: '高频/剥头皮：抓极短线的微小波动', scores: { VISION: 2, EXEC: 6 } },
    ],
  },
];
