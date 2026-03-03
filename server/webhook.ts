const WEBHOOK_URL = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1b7a8fca-f469-4cd0-9158-4e7eff0780ef";

export async function sendRegistrationNotification(phone: string) {
  const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const content = `## 新客户注册通知\n> **手机号**: ${phone}\n> **注册时间**: ${now}\n\n客户已完成注册，请及时跟进！`;

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

export async function sendSurveyNotification(phone: string, survey: {
  name: string;
  company: string;
  position: string;
  industry: string;
  companySize: string;
  challenges: string[];
  improvementAreas: string[];
  budget: string;
  timeline: string;
  additionalNotes?: string | null;
}) {
  const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const content = `## 客户测评完成通知\n> **姓名**: ${survey.name}\n> **手机号**: ${phone}\n> **公司**: ${survey.company}\n> **职位**: ${survey.position}\n> **行业**: ${survey.industry}\n> **公司规模**: ${survey.companySize}\n> **业务挑战**: ${survey.challenges.join("、")}\n> **精进领域**: ${survey.improvementAreas.join("、")}\n> **预算范围**: ${survey.budget}\n> **期望时间**: ${survey.timeline}${survey.additionalNotes ? `\n> **备注**: ${survey.additionalNotes}` : ""}\n> **提交时间**: ${now}\n\n客户已完成测评问卷，请及时跟进！`;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msgtype: "markdown", markdown: { content } }),
    });
    const data = await res.json();
    console.log("Survey webhook sent:", data);
  } catch (err) {
    console.error("Failed to send survey webhook:", err);
  }
}
