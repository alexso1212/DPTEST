const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL || "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef";

export async function sendRegistrationNotification(phone: string) {
  const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const content = `## 📱 新客户注册通知\n> **手机号**: ${phone}\n> **注册时间**: ${now}\n> **来源**: 交易员能力评测H5\n\n客户已完成注册并开始评测，请及时跟进！`;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msgtype: "markdown", markdown: { content } }),
    });
    const data = await res.json();
    console.log("Registration webhook sent:", data);
  } catch (err) {
    console.error("Failed to send registration webhook:", err);
  }
}

interface ContactWebhookPayload {
  phone: string;
  typeCode: string;
  typeName: string;
  rankName: string;
  avgScore: number;
  rarity: string;
  scores: Record<string, number>;
  salesStrategy: {
    attitude: string;
    opening: string;
    avoid: string;
    keyHook: string;
  };
}

export async function sendContactNotification(payload: ContactWebhookPayload) {
  const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

  const scoreLines = Object.entries(payload.scores)
    .sort((a, b) => b[1] - a[1])
    .map(([dim, score]) => `> ${dim}: **${score}**`)
    .join('\n');

  const content = `## 🎯 客户点击添加客服\n> **手机号**: ${payload.phone}\n> **时间**: ${now}\n> **段位**: ${payload.rankName} (${payload.avgScore}分)\n> **类型**: ${payload.typeName} (${payload.typeCode})\n> **稀有度**: ${payload.rarity}\n\n### 📊 各维度得分\n${scoreLines}\n\n### 💡 销售策略建议\n> **沟通姿态**: ${payload.salesStrategy.attitude}\n> **开场白**: ${payload.salesStrategy.opening}\n> **避免**: ${payload.salesStrategy.avoid}\n> **核心钩子**: ${payload.salesStrategy.keyHook}`;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msgtype: "markdown", markdown: { content } }),
    });
    const data = await res.json();
    console.log("Contact webhook sent:", data);
  } catch (err) {
    console.error("Failed to send contact webhook:", err);
  }
}
