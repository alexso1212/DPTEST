import { users, quizResults, userEvents, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(userId: number, data: {
    nickname?: string;
    wechatId?: string;
    source?: string;
    tags?: string[];
    lastActiveAt?: Date;
  }): Promise<void>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<void>;
  updateUserTier(userId: number, tier: number): Promise<void>;
  saveQuizResult(userId: number, data: {
    answers: number[];
    scores: Record<string, number>;
    traderTypeCode: string;
    avgScore: number;
    rankName: string;
  }): Promise<typeof quizResults.$inferSelect>;
  getLatestQuizResult(userId: number): Promise<typeof quizResults.$inferSelect | undefined>;
  getAllQuizResults(userId: number): Promise<(typeof quizResults.$inferSelect)[]>;
  getQuizResultByToken(token: string): Promise<typeof quizResults.$inferSelect | undefined>;
  trackEvent(data: {
    userId?: number;
    sessionId: string;
    eventType: string;
    eventData?: Record<string, unknown>;
  }): Promise<void>;
  getUserEvents(userId: number, limit?: number): Promise<(typeof userEvents.$inferSelect)[]>;
}

function generateShareToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserProfile(userId: number, data: {
    nickname?: string;
    wechatId?: string;
    source?: string;
    tags?: string[];
    lastActiveAt?: Date;
  }): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (data.nickname !== undefined) updates.nickname = data.nickname;
    if (data.wechatId !== undefined) updates.wechatId = data.wechatId;
    if (data.source !== undefined) updates.source = data.source;
    if (data.tags !== undefined) updates.tags = data.tags;
    if (data.lastActiveAt !== undefined) updates.lastActiveAt = data.lastActiveAt;
    if (Object.keys(updates).length > 0) {
      await db.update(users).set(updates).where(eq(users.id, userId));
    }
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  }

  async updateUserTier(userId: number, tier: number): Promise<void> {
    await db.update(users).set({ tier }).where(eq(users.id, userId));
  }

  async saveQuizResult(userId: number, data: {
    answers: number[];
    scores: Record<string, number>;
    traderTypeCode: string;
    avgScore: number;
    rankName: string;
  }) {
    const [result] = await db.insert(quizResults).values({
      userId,
      answers: data.answers,
      scores: data.scores,
      traderTypeCode: data.traderTypeCode,
      avgScore: data.avgScore,
      rankName: data.rankName,
      shareToken: generateShareToken(),
    }).returning();
    return result;
  }

  async getLatestQuizResult(userId: number) {
    const [result] = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId))
      .orderBy(desc(quizResults.createdAt))
      .limit(1);
    return result || undefined;
  }

  async getAllQuizResults(userId: number) {
    return db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId))
      .orderBy(desc(quizResults.createdAt));
  }

  async getQuizResultByToken(token: string) {
    const [result] = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.shareToken, token));
    return result || undefined;
  }

  async trackEvent(data: {
    userId?: number;
    sessionId: string;
    eventType: string;
    eventData?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await db.insert(userEvents).values({
        userId: data.userId ?? null,
        sessionId: data.sessionId,
        eventType: data.eventType,
        eventData: data.eventData ?? null,
      });
    } catch (err) {
      console.error("Failed to track event:", err);
    }
  }

  async getUserEvents(userId: number, limit = 50) {
    return db
      .select()
      .from(userEvents)
      .where(eq(userEvents.userId, userId))
      .orderBy(desc(userEvents.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
