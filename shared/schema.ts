import { pgTable, text, serial, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const MEMBERS = ["Bill", "Dom", "Jim", "Tommy", "Tony"] as const;
export const LOCATIONS = ["Bunbury", "Sook", "Dottie A", "La Promenade", "Other"] as const;

export const coffeePurchases = pgTable("coffee_purchases", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  location: text("location").notNull().default("Other"),
  payer: text("payer").notNull(),
  presentMembers: text("present_members").array().notNull(),
});

export const insertCoffeePurchaseSchema = createInsertSchema(coffeePurchases).omit({ id: true });

export type InsertCoffeePurchase = z.infer<typeof insertCoffeePurchaseSchema>;
export type CoffeePurchase = typeof coffeePurchases.$inferSelect;
