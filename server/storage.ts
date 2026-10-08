import { coffeePurchases, type CoffeePurchase, type InsertCoffeePurchase } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  getPurchases(): Promise<CoffeePurchase[]>;
  createPurchase(purchase: InsertCoffeePurchase): Promise<CoffeePurchase>;
}

export class DatabaseStorage implements IStorage {
  async getPurchases(): Promise<CoffeePurchase[]> {
    return await db.select().from(coffeePurchases).orderBy(desc(coffeePurchases.date)).limit(5);
  }

  async createPurchase(purchase: InsertCoffeePurchase): Promise<CoffeePurchase> {
    const [newPurchase] = await db.insert(coffeePurchases).values(purchase).returning();
    return newPurchase;
  }
}

export const storage = new DatabaseStorage();