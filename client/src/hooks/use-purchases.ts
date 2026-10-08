import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import type { InsertCoffeePurchase } from "@shared/schema";

// Helper to safely parse Zod responses
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function usePurchases() {
  return useQuery({
    queryKey: [api.purchases.list.path],
    queryFn: async () => {
      const res = await fetch(api.purchases.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch coffee purchases");
      const data = await res.json();
      return parseWithLogging(api.purchases.list.responses[200], data, "purchases.list");
    },
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertCoffeePurchase) => {
      // Validate input against the schema locally before sending
      const validated = api.purchases.create.input.parse(data);
      
      const res = await fetch(api.purchases.create.path, {
        method: api.purchases.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation failed");
        }
        throw new Error("Failed to record coffee purchase");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.purchases.create.responses[201], responseData, "purchases.create");
    },
    onSuccess: () => {
      // Invalidate the list query to instantly refresh the UI
      queryClient.invalidateQueries({ queryKey: [api.purchases.list.path] });
    },
  });
}
