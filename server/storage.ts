import { users, processingLogs, type User, type InsertUser, type LoginUser, type ProcessingLog, type InsertProcessingLog } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProStatus(id: string, isPro: boolean, subscriptionId?: string, subscriptionStatus?: string): Promise<User>;
  createProcessingLog(log: InsertProcessingLog): Promise<ProcessingLog>;
  getUserProcessingLogs(userId: string, limit?: number): Promise<ProcessingLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserProStatus(id: string, isPro: boolean, subscriptionId?: string, subscriptionStatus?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        isPro, 
        subscriptionId: subscriptionId || null,
        subscriptionStatus: subscriptionStatus || null
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createProcessingLog(log: InsertProcessingLog): Promise<ProcessingLog> {
    const [processingLog] = await db
      .insert(processingLogs)
      .values(log)
      .returning();
    return processingLog;
  }

  async getUserProcessingLogs(userId: string, limit: number = 50): Promise<ProcessingLog[]> {
    return await db
      .select()
      .from(processingLogs)
      .where(eq(processingLogs.userId, userId))
      .orderBy(desc(processingLogs.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
