export type Dimension = 'RISK' | 'MENTAL' | 'SYSTEM' | 'ADAPT' | 'EXEC' | 'EDGE';

export const dimensionLabels: Record<Dimension, string> = {
  RISK: '风险管理',
  MENTAL: '交易心理',
  SYSTEM: '系统思维',
  ADAPT: '市场适应',
  EXEC: '执行力',
  EDGE: '认知格局',
};

export interface QuestionOption {
  text: string;
  scores: Partial<Record<Dimension, number>>;
  tag: string;
}

export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: 1,
    dimension: 'RISK',
    text: '你建仓后行情立刻反向走了一段，浮亏开始扩大。这时候你脑子里第一个念头是什么？',
    options: [
      { text: '到止损位了就走，这笔的风险预算已经用完了', scores: { RISK: 10, EXEC: 4 }, tag: '纪律型' },
      { text: '看看反向的力度有多大，如果只是毛刺我可以扛', scores: { RISK: 5, ADAPT: 6 }, tag: '灵活型' },
      { text: '我再看看有没有新的信息支撑我的方向，如果逻辑还在就拿着', scores: { RISK: 7, SYSTEM: 6 }, tag: '逻辑型' },
      { text: '心里很不舒服，一直盯着盈亏数字看', scores: { RISK: 2, MENTAL: 2 }, tag: '情绪型' },
    ],
  },
  {
    id: 2,
    dimension: 'RISK',
    text: '连续亏损3笔后，你面前出现了一个新机会。你判断方向大概率对，但止损空间比较大（需要放宽止损），盈利目标只有止损的1.5倍。你会？',
    options: [
      { text: '不做。止损太大、盈亏比不划算，不是每个机会都值得做', scores: { RISK: 10, EDGE: 8 }, tag: '性价比思维' },
      { text: '做，但把仓位缩到平时的一半', scores: { RISK: 7, EXEC: 4 }, tag: '保守执行' },
      { text: '做，方向对就行，不用每笔都算那么细', scores: { RISK: 3, EXEC: 6 }, tag: '感觉驱动' },
      { text: '不确定，纠结了很久，最后时间窗口过了', scores: { RISK: 4, MENTAL: 2 }, tag: '犹豫型' },
    ],
  },
  {
    id: 3,
    dimension: 'MENTAL',
    text: '你有一笔顺势交易浮盈了不少，突然行情开始剧烈震荡。你打开手机看了一眼，心跳加速。接下来你会？',
    options: [
      { text: '把止盈移到不亏的位置，然后放下手机不看了', scores: { MENTAL: 9, SYSTEM: 4 }, tag: '系统+自控' },
      { text: '立刻全部平仓，落袋为安，睡得着觉最重要', scores: { MENTAL: 5, RISK: 6 }, tag: '保守型' },
      { text: '盯着看，每一根K线都看，情绪跟着涨跌走', scores: { MENTAL: 2, EXEC: 2 }, tag: '情绪驱动' },
      { text: '按原计划拿着，目标没到就不动，震荡是正常的', scores: { MENTAL: 6, EDGE: 8 }, tag: '格局型' },
    ],
  },
  {
    id: 4,
    dimension: 'MENTAL',
    text: '你今天因为一个愚蠢的错误亏了一大笔。你知道不应该继续交易，但这时候你看到了一个"完美"的入场机会。你内心的真实状态是？',
    options: [
      { text: '关电脑。今天的额度已经用完了，再好的机会也不做', scores: { MENTAL: 10, RISK: 6 }, tag: '绝对纪律' },
      { text: '理性上知道不该做，但身体已经在下单了', scores: { MENTAL: 2, EXEC: 1 }, tag: '失控型' },
      { text: '小仓位做一笔，但我知道自己在赌，只是控制不住', scores: { MENTAL: 4, RISK: 3 }, tag: '自知但失控' },
      { text: '我会做，但不是因为报复，而是因为这个机会本身值得做', scores: { MENTAL: 7, SYSTEM: 4, EDGE: 4 }, tag: '理性分离' },
    ],
  },
  {
    id: 5,
    dimension: 'SYSTEM',
    text: '回想你最近10笔交易，你的入场依据主要是什么？（选最诚实的那个）',
    options: [
      { text: '有一套明确的条件清单，满足了才做', scores: { SYSTEM: 10, EXEC: 4 }, tag: '系统化' },
      { text: '看技术形态或指标信号，加上一些盘感', scores: { SYSTEM: 5, ADAPT: 4 }, tag: '半系统半直觉' },
      { text: '看别人的分析或者群里的讨论，觉得有道理就跟', scores: { SYSTEM: 2, EDGE: 1 }, tag: '依赖外部' },
      { text: '说不太清楚，不同的交易入场理由都不太一样', scores: { SYSTEM: 3, ADAPT: 3 }, tag: '模糊型' },
    ],
  },
  {
    id: 6,
    dimension: 'SYSTEM',
    text: '关于交易复盘，最接近你真实情况的是？',
    options: [
      { text: '每笔交易都有截图/记录，定期做数据统计和归因分析', scores: { SYSTEM: 10, EXEC: 6 }, tag: '循证型' },
      { text: '会记录，但主要记感受和心得，很少做数据统计', scores: { SYSTEM: 6, MENTAL: 4 }, tag: '感悟型' },
      { text: '赚钱的时候不复盘，亏钱的时候才会想想哪里错了', scores: { SYSTEM: 3, MENTAL: 2 }, tag: '被动型' },
      { text: '知道应该复盘，但坚持不下来，断断续续的', scores: { SYSTEM: 4, EXEC: 2 }, tag: '知行不一' },
    ],
  },
  {
    id: 7,
    dimension: 'ADAPT',
    text: '你用了3个月的策略最近连续2周亏损。你的第一反应是？',
    options: [
      { text: '市场风格可能变了，我要去研究现在的行情特征再决定怎么调整', scores: { ADAPT: 9, SYSTEM: 6 }, tag: '循证适应' },
      { text: '先停下来，等市场回到我熟悉的节奏', scores: { ADAPT: 6, MENTAL: 6 }, tag: '守能力圈' },
      { text: '2周不算什么，可能是正常回撤，继续执行', scores: { ADAPT: 4, EXEC: 6 }, tag: '坚持型' },
      { text: '焦虑，开始到处找新策略、新指标、新方法', scores: { ADAPT: 2, SYSTEM: 1 }, tag: '策略跳蚤' },
    ],
  },
  {
    id: 8,
    dimension: 'ADAPT',
    text: '一个你完全没研究过的品种暴涨了，社交媒体全是"上车"的声音。你的真实内心是？',
    options: [
      { text: '不在我的能力圈内，涨再多也跟我没关系', scores: { ADAPT: 5, RISK: 8 }, tag: '守圈' },
      { text: '先花几天研究底层逻辑和资金结构，找到自己的判断再决定', scores: { ADAPT: 9, SYSTEM: 6, EDGE: 4 }, tag: '循证介入' },
      { text: '小仓位先上车，边做边学，错了就当交学费', scores: { ADAPT: 6, RISK: 3 }, tag: '行动派' },
      { text: '虽然没买，但一直在刷涨幅，心里很难受', scores: { ADAPT: 3, MENTAL: 2 }, tag: 'FOMO型' },
    ],
  },
  {
    id: 9,
    dimension: 'EXEC',
    text: '你的策略发出了一个清晰的入场信号，但你刚亏了两笔，手有点抖。你实际上会怎么做？',
    options: [
      { text: '信号就是信号，跟上两笔亏损无关，执行', scores: { EXEC: 10, SYSTEM: 6 }, tag: '机器人' },
      { text: '做，但仓位减半，给自己一个心理缓冲', scores: { EXEC: 7, RISK: 4, MENTAL: 4 }, tag: '弹性执行' },
      { text: '知道应该做，但最终没有点下去，然后行情如预期，很难受', scores: { EXEC: 2, MENTAL: 2 }, tag: '眼睁睁错过' },
      { text: '干脆今天不做了，状态不好', scores: { EXEC: 4, MENTAL: 6 }, tag: '保护型' },
    ],
  },
  {
    id: 10,
    dimension: 'EXEC',
    text: '你的规则说不该做，但你的直觉强烈告诉你这次不一样。你怎么处理这个矛盾？',
    options: [
      { text: '规则就是规则，任何例外都是滑坡的开始', scores: { EXEC: 10, SYSTEM: 8 }, tag: '绝对规则' },
      { text: '用极小仓位试一下，如果对了就记下来，看能不能优化进规则', scores: { EXEC: 5, ADAPT: 6, SYSTEM: 4 }, tag: '迭代型' },
      { text: '做了，然后赢了就觉得自己牛逼，亏了就后悔', scores: { EXEC: 2, MENTAL: 1 }, tag: '情绪赌博' },
      { text: '不做，但会把这个情况记录下来，看看以后是不是真的规律', scores: { EXEC: 6, SYSTEM: 8 }, tag: '循证记录' },
    ],
  },
  {
    id: 11,
    dimension: 'EDGE',
    text: '你觉得交易赚钱的本质是什么？',
    options: [
      { text: '找到一个有概率优势的模式，然后重复执行', scores: { EDGE: 6, SYSTEM: 6 }, tag: '概率思维' },
      { text: '理解市场里其他参与者的行为和心理，利用他们的错误', scores: { EDGE: 10, ADAPT: 4 }, tag: '博弈思维' },
      { text: '跟对趋势，大方向对了细节差一点也没关系', scores: { EDGE: 5, MENTAL: 4 }, tag: '趋势思维' },
      { text: '说实话我还没想明白这个问题', scores: { EDGE: 2, SYSTEM: 2 }, tag: '尚未形成' },
    ],
  },
  {
    id: 12,
    dimension: 'EDGE',
    text: '如果给你无限时间去打磨交易能力，你觉得最终决定胜负的会是什么？',
    options: [
      { text: '对市场结构和资金流动的深度理解', scores: { EDGE: 10, SYSTEM: 6 }, tag: '资金逻辑派' },
      { text: '绝对的纪律和情绪控制', scores: { EDGE: 4, MENTAL: 8, EXEC: 4 }, tag: '纪律派' },
      { text: '适应变化的能力，市场在变你也必须变', scores: { EDGE: 6, ADAPT: 8 }, tag: '适应派' },
      { text: '运气和时机，七分天注定', scores: { EDGE: 1, MENTAL: 1 }, tag: '宿命论' },
    ],
  },
];
