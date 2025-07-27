import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isPro: boolean("is_pro").notNull().default(false),
  subscriptionId: text("subscription_id"),
  subscriptionStatus: text("subscription_status"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const processingLogs = pgTable("processing_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  toolType: text("tool_type").notNull(), // 'resize', 'compress', 'convert', etc.
  inputFormat: text("input_format").notNull(),
  outputFormat: text("output_format"),
  fileSizeMB: decimal("file_size_mb", { precision: 10, scale: 2 }).notNull(),
  processingTimeMs: integer("processing_time_ms").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const usersRelations = relations(users, ({ many }) => ({
  processingLogs: many(processingLogs),
}));

export const processingLogsRelations = relations(processingLogs, ({ one }) => ({
  user: one(users, {
    fields: [processingLogs.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const loginSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertProcessingLogSchema = createInsertSchema(processingLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type ProcessingLog = typeof processingLogs.$inferSelect;
export type InsertProcessingLog = z.infer<typeof insertProcessingLogSchema>;
