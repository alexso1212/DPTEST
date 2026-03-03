import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  companySize: varchar("company_size", { length: 50 }).notNull(),
  challenges: text("challenges").array().notNull(),
  improvementAreas: text("improvement_areas").array().notNull(),
  budget: varchar("budget", { length: 50 }).notNull(),
  timeline: varchar("timeline", { length: 50 }).notNull(),
  additionalNotes: text("additional_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  surveyResponses: many(surveyResponses),
}));

export const surveyResponsesRelations = relations(surveyResponses, ({ one }) => ({
  user: one(users, {
    fields: [surveyResponses.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  phone: true,
  password: true,
}).extend({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的手机号码"),
  password: z.string().min(6, "密码至少6位"),
});

export const loginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的手机号码"),
  password: z.string().min(1, "请输入密码"),
});

export const insertSurveySchema = createInsertSchema(surveyResponses).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "请输入姓名"),
  company: z.string().min(1, "请输入公司名称"),
  position: z.string().min(1, "请输入职位"),
  industry: z.string().min(1, "请选择行业"),
  companySize: z.string().min(1, "请选择公司规模"),
  challenges: z.array(z.string()).min(1, "请至少选择一项业务挑战"),
  improvementAreas: z.array(z.string()).min(1, "请至少选择一项精进领域"),
  budget: z.string().min(1, "请选择预算范围"),
  timeline: z.string().min(1, "请选择期望时间"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
