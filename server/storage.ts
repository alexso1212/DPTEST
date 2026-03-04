import { users, quizResults, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveQuizResult(userId: number, data: {
    answers: number[];
    scores: Record<string, number>;
    traderTypeCode: string;
    avgScore: number;
    rankName: string;
  }): Promise<typeof quizResults.$inferSelect>;
  getLatestQuizResult(userId: number): Promise<typeof quizResults.$inferSelect | undefined>;
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
}

export const storage = new DatabaseStorage();
