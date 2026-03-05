import { users, quizResults, userEvents, salesContacts, type User, type InsertUser, type SalesContact, type InsertSalesContact } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, gte, lte, ne, isNull } from "drizzle-orm";
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
  getAllSalesContacts(): Promise<SalesContact[]>;
  getEnabledSalesContacts(): Promise<SalesContact[]>;
  createSalesContact(data: InsertSalesContact): Promise<SalesContact>;
  updateSalesContact(id: number, data: Partial<Pick<SalesContact, 'name' | 'url' | 'enabled'>>): Promise<SalesContact | undefined>;
  deleteSalesContact(id: number): Promise<void>;
  updateContactHealth(id: number, status: string): Promise<void>;
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

  async trackDailyLogin(userId: number): Promise<{ loginDays: number; tierChanged: boolean; newTier: number }> {
    const user = await this.getUser(userId);
    if (!user) return { loginDays: 0, tierChanged: false, newTier: 0 };

    const today = new Date().toISOString().slice(0, 10);
    if (user.lastLoginDate === today) {
      return { loginDays: user.loginDays, tierChanged: false, newTier: user.tier };
    }

    const result = await db.update(users)
      .set({
        loginDays: sql`COALESCE(login_days, 0) + 1`,
        lastLoginDate: today,
        lastActiveAt: new Date(),
      })
      .where(and(eq(users.id, userId), or(isNull(users.lastLoginDate), ne(users.lastLoginDate, today))))
      .returning({ loginDays: users.loginDays, tier: users.tier });

    if (!result.length) {
      return { loginDays: user.loginDays, tierChanged: false, newTier: user.tier };
    }

    const newLoginDays = result[0].loginDays;
    let newTier = result[0].tier;
    if (newLoginDays >= 60 && newTier < 3) newTier = 3;
    else if (newLoginDays >= 21 && newTier < 2) newTier = 2;
    else if (newLoginDays >= 7 && newTier < 1) newTier = 1;

    if (newTier !== result[0].tier) {
      await db.update(users).set({ tier: newTier }).where(eq(users.id, userId));
    }

    return { loginDays: newLoginDays, tierChanged: newTier !== result[0].tier, newTier };
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

  async getAllSalesContacts(): Promise<SalesContact[]> {
    return db.select().from(salesContacts).orderBy(salesContacts.id);
  }

  async getEnabledSalesContacts(): Promise<SalesContact[]> {
    return db.select().from(salesContacts).where(eq(salesContacts.enabled, true)).orderBy(salesContacts.id);
  }

  async createSalesContact(data: InsertSalesContact): Promise<SalesContact> {
    const [contact] = await db.insert(salesContacts).values(data).returning();
    return contact;
  }

  async updateSalesContact(id: number, data: Partial<Pick<SalesContact, 'name' | 'url' | 'enabled'>>): Promise<SalesContact | undefined> {
    const updates: Record<string, unknown> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.url !== undefined) updates.url = data.url;
    if (data.enabled !== undefined) updates.enabled = data.enabled;
    if (Object.keys(updates).length === 0) return undefined;
    const [updated] = await db.update(salesContacts).set(updates).where(eq(salesContacts.id, id)).returning();
    return updated || undefined;
  }

  async deleteSalesContact(id: number): Promise<void> {
    await db.delete(salesContacts).where(eq(salesContacts.id, id));
  }

  async updateContactHealth(id: number, status: string): Promise<void> {
    await db.update(salesContacts).set({
      lastHealthCheck: new Date(),
      lastHealthStatus: status,
    }).where(eq(salesContacts.id, id));
  }
}

export const storage = new DatabaseStorage();
