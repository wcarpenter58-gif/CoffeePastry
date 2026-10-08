import { useState } from "react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Coffee, Calendar, MapPin } from "lucide-react";
import { usePurchases } from "@/hooks/use-purchases";
import type { CoffeePurchase } from "@shared/schema";

export function PurchaseHistory() {
  const { data: purchases, isLoading, error } = usePurchases();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-card rounded-2xl animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-2xl text-center">
        Failed to load history. Please try again.
      </div>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <div className="p-8 bg-card rounded-2xl border border-border/50 text-center shadow-soft flex flex-col items-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Coffee className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No purchases yet</h3>
        <p className="text-muted-foreground mt-1">Record your first coffee run to see it here.</p>
      </div>
    );
  }

  // Get the 5 most recent purchases sorted by date
  const recentPurchases = [...purchases]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground px-2 flex items-center gap-2">
        Recent Runs
      </h3>
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {recentPurchases.map((purchase) => (
            <HistoryItem key={purchase.id} purchase={purchase} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HistoryItem({ purchase }: { purchase: CoffeePurchase }) {
  const [isOpen, setIsOpen] = useState(false);
  const dateObj = parseISO(purchase.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
            {purchase.payer.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              {purchase.payer} <span className="text-muted-foreground font-normal text-sm">paid</span>
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {format(dateObj, "EEEE, MMMM d, yyyy")}
              {purchase.location && (
                <>
                  <span className="mx-1">·</span>
                  <MapPin className="w-3 h-3" />
                  {purchase.location}
                </>
              )}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-muted-foreground"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-border/30 mx-4 mt-2">
              <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Present Members
              </p>
              <div className="flex flex-wrap gap-2">
                {purchase.presentMembers.map((member) => (
                  <span
                    key={member}
                    className="px-3 py-1 bg-secondary text-foreground text-sm rounded-full font-medium"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
