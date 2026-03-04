import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { sendRegistrationNotification, sendResultNotification } from "./webhook";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import bcrypt from "bcryptjs";

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
        maxAge: 30 * 24 * 60 * 60 * 1000,
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
      res.json({ id: user.id, phone: user.phone });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "登录失败，请稍后重试" });
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

      res.json({ id: user.id, phone: user.phone });
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
      const { phone, wechatName, scores, traderType, rank, avgScore, salesStrategy } = req.body;
      if (!phone || !traderType) {
        return res.status(400).json({ message: "缺少必要字段" });
      }
      sendResultNotification({ phone, wechatName, scores, traderType, rank, avgScore, salesStrategy });
      res.json({ success: true });
    } catch (err) {
      console.error("Result webhook error:", err);
      res.json({ success: true, webhookError: true });
    }
  });

  return httpServer;
}
