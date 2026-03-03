const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL || "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef";

export async function sendRegistrationNotification(phone: string) {
  const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const content = `## 新客户注册通知\n> **手机号**: ${phone}\n> **注册时间**: ${now}\n> **来源**: 交易员能力评测H5\n\n客户已完成注册并开始评测，请及时跟进！`;

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
