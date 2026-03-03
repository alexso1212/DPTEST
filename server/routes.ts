import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertSurveySchema } from "@shared/schema";
import { sendRegistrationNotification, sendSurveyNotification } from "./webhook";
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

      sendRegistrationNotification(user.phone);

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

      const existingSurvey = await storage.getSurveyResponseByUserId(user.id);
      res.json({ id: user.id, phone: user.phone, hasSurvey: !!existingSurvey });
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

      const existingSurvey = await storage.getSurveyResponseByUserId(user.id);
      res.json({ id: user.id, phone: user.phone, hasSurvey: !!existingSurvey });
    } catch (err) {
      console.error("Get user error:", err);
      res.status(500).json({ message: "获取用户信息失败" });
    }
  });

  app.post("/api/survey", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "请先登录" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "用户不存在" });
      }

      const existing = await storage.getSurveyResponseByUserId(userId);
      if (existing) {
        return res.status(409).json({ message: "您已提交过问卷" });
      }

      const parsed = insertSurveySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const response = await storage.createSurveyResponse(userId, parsed.data);

      sendSurveyNotification(user.phone, parsed.data);

      res.json(response);
    } catch (err) {
      console.error("Survey submission error:", err);
      res.status(500).json({ message: "提交失败，请稍后重试" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  return httpServer;
}
