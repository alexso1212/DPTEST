import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertEventSchema } from "@shared/schema";
import { sendRegistrationNotification, sendResultNotification } from "./webhook";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import bcrypt from "bcryptjs";

const SALES_CONTACTS = [
  { name: "默认顾问", url: "https://work.weixin.qq.com/ca/cawcde75d99eb3fce4" },
  { name: "Deven", url: "https://work.weixin.qq.com/ca/cawcde66939ac2ab81" },
  { name: "Anna", url: "https://work.weixin.qq.com/ca/cawcde2d7a8f8a7ac3" },
];
let salesCounter = 0;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgStore = connectPgSimple(session);

  app.use(
    session({
      store: new PgStore({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "survey-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  app.post("/api/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const existing = await storage.getUserByPhone(parsed.data.phone);
      if (existing) {
        return res.status(409).json({ message: "该手机号已注册" });
      }

      const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
      const user = await storage.createUser({ ...parsed.data, password: hashedPassword });
      (req.session as any).userId = user.id;
      if (req.body.rememberMe !== false) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }

      storage.trackEvent({
        userId: user.id,
        sessionId: req.body.sessionId || "server",
        eventType: "user_register",
        eventData: { phone: user.phone, source: req.body.source },
      });

      if (req.body.source) {
        storage.updateUserProfile(user.id, { source: req.body.source });
      }

      res.json({ id: user.id, phone: user.phone });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "注册失败，请稍后重试" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const user = await storage.getUserByPhone(parsed.data.phone);
      if (!user) {
        return res.status(401).json({ message: "手机号或密码错误" });
      }

      const validPassword = await bcrypt.compare(parsed.data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "手机号或密码错误" });
      }

      (req.session as any).userId = user.id;
      if (req.body.rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }

      storage.trackEvent({
        userId: user.id,
        sessionId: req.body.sessionId || "server",
        eventType: "user_login",
      });
      storage.updateUserProfile(user.id, { lastActiveAt: new Date() });

      res.json({ id: user.id, phone: user.phone });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "登录失败，请稍后重试" });
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    try {
      const { phone, newPassword } = req.body;
      if (!phone || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "请输入手机号和新密码（至少6位）" });
      }

      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.json({ ok: true });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUserPassword(user.id, hashedPassword);

      res.json({ ok: true });
    } catch (err) {
      console.error("Reset password error:", err);
      res.status(500).json({ message: "重置失败，请稍后重试" });
    }
  });

  app.get("/api/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "未登录" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "用户不存在" });
      }

      const quizResult = await storage.getLatestQuizResult(userId);

      res.json({
        id: user.id,
        phone: user.phone,
        tier: user.tier ?? 0,
        hasQuizResult: !!quizResult,
        traderTypeCode: quizResult?.traderTypeCode || null,
        avgScore: quizResult?.avgScore || null,
        rankName: quizResult?.rankName || null,
        quizCompletedAt: quizResult?.createdAt || null,
      });
    } catch (err) {
      console.error("Get user error:", err);
      res.status(500).json({ message: "获取用户信息失败" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.post("/api/quiz-result", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "未登录" });
      }

      const { answers, scores, traderTypeCode, avgScore, rankName } = req.body;

      if (!Array.isArray(answers) || answers.length !== 12) {
        return res.status(400).json({ message: "answers 必须是12个选项的数组" });
      }
      if (!scores || typeof scores !== 'object') {
        return res.status(400).json({ message: "scores 必须是对象" });
      }
      if (typeof traderTypeCode !== 'string' || traderTypeCode.length < 2) {
        return res.status(400).json({ message: "traderTypeCode 无效" });
      }
      if (typeof avgScore !== 'number' || avgScore < 0 || avgScore > 100) {
        return res.status(400).json({ message: "avgScore 必须是0-100的数字" });
      }
      if (typeof rankName !== 'string' || rankName.length < 1) {
        return res.status(400).json({ message: "rankName 无效" });
      }

      const existing = await storage.getLatestQuizResult(userId);
      if (existing && existing.traderTypeCode === traderTypeCode && existing.avgScore === avgScore) {
        const createdAt = new Date(existing.createdAt!).getTime();
        if (Date.now() - createdAt < 60000) {
          return res.json({ success: true, id: existing.id, shareToken: existing.shareToken });
        }
      }

      const result = await storage.saveQuizResult(userId, {
        answers,
        scores,
        traderTypeCode,
        avgScore,
        rankName,
      });

      storage.trackEvent({
        userId,
        sessionId: req.body.sessionId || "server",
        eventType: "quiz_complete",
        eventData: { traderTypeCode, avgScore, rankName },
      });

      res.json({ success: true, id: result.id, shareToken: result.shareToken });
    } catch (err) {
      console.error("Save quiz result error:", err);
      res.status(500).json({ message: "保存测评结果失败" });
    }
  });

  app.get("/api/quiz-result", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "未登录" });
      }

      const result = await storage.getLatestQuizResult(userId);
      res.json(result || null);
    } catch (err) {
      console.error("Get quiz result error:", err);
      res.status(500).json({ message: "获取测评结果失败" });
    }
  });

  app.get("/api/quiz-results/history", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "未登录" });
      }

      const results = await storage.getAllQuizResults(userId);
      res.json(results);
    } catch (err) {
      console.error("Get quiz history error:", err);
      res.status(500).json({ message: "获取测评历史失败" });
    }
  });

  app.get("/api/report/:token", async (req, res) => {
    try {
      const { token } = req.params;
      if (!token || token.length < 8) {
        return res.status(400).json({ message: "无效的报告链接" });
      }

      const result = await storage.getQuizResultByToken(token);
      if (!result) {
        return res.status(404).json({ message: "报告不存在或链接已失效" });
      }

      const sessionId = (req.query.sid as string) || "server";
      storage.trackEvent({
        userId: result.userId,
        sessionId,
        eventType: "report_view",
        eventData: { token, traderTypeCode: result.traderTypeCode },
      });

      res.json({
        scores: result.scores,
        traderTypeCode: result.traderTypeCode,
        avgScore: result.avgScore,
        rankName: result.rankName,
        createdAt: result.createdAt,
      });
    } catch (err) {
      console.error("Get report error:", err);
      res.status(500).json({ message: "获取报告失败" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const parsed = insertEventSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid event data" });
      }

      const userId = parsed.data.userId || (req.session as any)?.userId || undefined;

      storage.trackEvent({
        userId,
        sessionId: parsed.data.sessionId,
        eventType: parsed.data.eventType,
        eventData: parsed.data.eventData as Record<string, unknown>,
      });

      res.json({ ok: true });
    } catch (err) {
      console.error("Track event error:", err);
      res.json({ ok: true });
    }
  });

  app.patch("/api/user/profile", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "未登录" });
      }

      const { nickname, wechatId, source, tags } = req.body;
      await storage.updateUserProfile(userId, {
        nickname,
        wechatId,
        source,
        tags,
        lastActiveAt: new Date(),
      });

      res.json({ ok: true });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: "更新失败" });
    }
  });

  app.post("/api/webhook/register", async (req, res) => {
    try {
      const { phone, wechatName } = req.body;
      if (!phone) {
        return res.status(400).json({ message: "缺少手机号" });
      }
      const result = await sendRegistrationNotification({ phone, wechatName });
      res.json({ success: true, skipped: result.skipped });
    } catch (err) {
      console.error("Register webhook error:", err);
      res.json({ success: true, webhookError: true });
    }
  });

  app.post("/api/webhook/result", async (req, res) => {
    try {
      const { phone, wechatName, scores, traderType, rank, avgScore, salesStrategy, verifyCode } = req.body;
      if (!phone || !traderType) {
        return res.status(400).json({ message: "缺少必要字段" });
      }

      const userId = (req.session as any)?.userId;
      let reportUrl: string | undefined;
      if (userId) {
        const quizResult = await storage.getLatestQuizResult(userId);
        if (quizResult?.shareToken) {
          const baseUrl = process.env.BASE_URL
            || `${req.get('x-forwarded-proto') || req.protocol}://${req.get('host') || 'localhost'}`;
          reportUrl = `${baseUrl}/report/${quizResult.shareToken}`;
        }
      }

      sendResultNotification({ phone, wechatName, scores, traderType, rank, avgScore, salesStrategy, reportUrl, verifyCode });
      res.json({ success: true });
    } catch (err) {
      console.error("Result webhook error:", err);
      res.json({ success: true, webhookError: true });
    }
  });

  app.patch("/api/user/tier", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "未登录" });
      }
      const { tier } = req.body;
      if (typeof tier !== "number" || tier < 0 || tier > 3) {
        return res.status(400).json({ message: "无效的阶级值" });
      }
      await storage.updateUserTier(userId, tier);
      res.json({ ok: true, tier });
    } catch (err) {
      console.error("Update tier error:", err);
      res.status(500).json({ message: "更新失败" });
    }
  });

  app.get("/api/wechat-contact", (req, res) => {
    const sess = req.session as any;
    if (sess.assignedContact) {
      return res.json(sess.assignedContact);
    }
    const contact = SALES_CONTACTS[salesCounter % SALES_CONTACTS.length];
    salesCounter++;
    sess.assignedContact = contact;
    res.json(contact);
  });

  return httpServer;
}
