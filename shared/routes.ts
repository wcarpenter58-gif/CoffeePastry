import { z } from "zod";
import { insertCoffeePurchaseSchema, coffeePurchases } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  purchases: {
    list: {
      method: "GET" as const,
      path: "/api/purchases" as const,
      responses: {
        200: z.array(z.custom<typeof coffeePurchases.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/purchases" as const,
      input: insertCoffeePurchaseSchema,
      responses: {
        201: z.custom<typeof coffeePurchases.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
