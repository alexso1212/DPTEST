const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL || "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef";

const recentSubmits = new Map<string, number>();

function canSubmit(phone: string): boolean {
  if (recentSubmits.has(phone) && Date.now() - recentSubmits.get(phone)! < 300000) {
    return false;
  }
  recentSubmits.set(phone, Date.now());
  return true;
}

interface RegisterPayload {
  phone: string;
  wechatName?: string;
}

export async function sendRegistrationNotification({ phone, wechatName }: RegisterPayload): Promise<{ success: boolean; skipped?: boolean }> {
  if (!canSubmit(phone)) {
    return { success: true, skipped: true };
  }

  const content = [
    `## 📋 新用户测评通知`,
    ``,
    `> 有新用户完成了交易能力测评，正在查看结果`,
    ``,
    `**微信昵称：** ${wechatName || '未授权'}`,
    `**手机号：** <font color="warning">${phone}</font>`,
    `**状态：** 正在查看部分结果，尚未领取完整报告`,
    ``,
    `---`,
    `⏳ 如果该用户点击"领取完整报告"，你将收到完整画像和跟进策略`,
  ].join('\n');

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msgtype: "markdown", markdown: { content } }),
    });
    const data = await res.json();
    console.log("Registration webhook sent:", data);
    return { success: true };
  } catch (err) {
    console.error("Failed to send registration webhook:", err);
    return { success: true };
  }
}

interface ResultWebhookPayload {
  phone: string;
  wechatName?: string;
  scores: Record<string, number>;
  traderType: { code: string; name: string; emoji: string };
  rank: { name: string; emoji: string };
  avgScore: number;
  salesStrategy: {
    attitude: string;
    opening: string;
    avoid: string;
    keyHook: string;
  };
}

const dimNames: Record<string, string> = {
  RISK: '风险管理',
  MENTAL: '交易心理',
  SYSTEM: '系统思维',
  ADAPT: '市场适应',
  EXEC: '执行力',
  EDGE: '认知格局',
};

export async function sendResultNotification(payload: ResultWebhookPayload): Promise<{ success: boolean }> {
  const scoreEntries = Object.entries(payload.scores).sort((a, b) => b[1] - a[1]);

  const scoreLines = scoreEntries.map(([dim, score], i) => {
    const filled = Math.round(score / 10);
    const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
    const label = i === 0 ? ' 🔥最强' : (i === scoreEntries.length - 1 ? ' ⬆️突破口' : '');
    return `${dimNames[dim] || dim}　${bar} **${score}**${label}`;
  }).join('\n');

  const weakestDim = dimNames[scoreEntries[scoreEntries.length - 1][0]] || scoreEntries[scoreEntries.length - 1][0];
  const strongestDim = dimNames[scoreEntries[0][0]] || scoreEntries[0][0];

  const content = [
    `## 🎯 完整客户画像 — 请立即跟进`,
    ``,
    `### 👤 客户信息`,
    `**微信昵称：** ${payload.wechatName || '未授权'}`,
    `**手机号：** <font color="warning">${payload.phone}</font>`,
    ``,
    `### 📊 测评结果`,
    `**段位：** ${payload.rank.emoji} ${payload.rank.name}（综合 **${payload.avgScore}**/100）`,
    `**类型：** ${payload.traderType.emoji} ${payload.traderType.name}`,
    ``,
    `### 🕸️ 六维能力`,
    scoreLines,
    ``,
    `### 🎯 销售跟进策略`,
    `**沟通态度：** <font color="warning">${payload.salesStrategy.attitude}</font>`,
    ``,
    `**开场白参考：**`,
    `> ${payload.salesStrategy.opening}`,
    ``,
    `**注意避免：** ${payload.salesStrategy.avoid}`,
    ``,
    `**核心钩子：** <font color="info">${payload.salesStrategy.keyHook}</font>`,
    ``,
    `---`,
    `💡 **快速判断：** 该客户最强维度「${strongestDim}」，最弱维度「${weakestDim}」。从「${weakestDim}」切入沟通，用「${strongestDim}」给予肯定。`,
  ].join('\n');

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msgtype: "markdown", markdown: { content } }),
    });
    const data = await res.json();
    console.log("Result webhook sent:", data);
    return { success: true };
  } catch (err) {
    console.error("Failed to send result webhook:", err);
    return { success: true };
  }
}
