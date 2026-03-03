import { users, surveyResponses, type User, type InsertUser, type InsertSurvey, type SurveyResponse } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSurveyResponse(userId: number, survey: InsertSurvey): Promise<SurveyResponse>;
  getSurveyResponseByUserId(userId: number): Promise<SurveyResponse | undefined>;
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

  async createSurveyResponse(userId: number, survey: InsertSurvey): Promise<SurveyResponse> {
    const [response] = await db.insert(surveyResponses).values({ ...survey, userId }).returning();
    return response;
  }

  async getSurveyResponseByUserId(userId: number): Promise<SurveyResponse | undefined> {
    const [response] = await db.select().from(surveyResponses).where(eq(surveyResponses.userId, userId));
    return response || undefined;
  }
}

export const storage = new DatabaseStorage();
