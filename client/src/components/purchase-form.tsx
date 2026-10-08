import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Coffee, Check, Users, MapPin } from "lucide-react";
import { MEMBERS, LOCATIONS } from "@shared/schema";
import { useCreatePurchase } from "@/hooks/use-purchases";
import { SelectionChip } from "./selection-chip";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function PurchaseForm() {
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [location, setLocation] = useState<string | null>(null);
  const [payer, setPayer] = useState<string | null>(null);
  const [presentMembers, setPresentMembers] = useState<string[]>([]);
  
  const { mutate: createPurchase, isPending } = useCreatePurchase();
  const { toast } = useToast();

  const handleTogglePresent = (member: string) => {
    setPresentMembers((prev) => 
      prev.includes(member) 
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payer) {
      toast({
        title: "Missing Payer",
        description: "Please select who paid for the coffee.",
        variant: "destructive",
      });
      return;
    }

    if (presentMembers.length === 0) {
      toast({
        title: "Missing Attendees",
        description: "Please select at least one person who was present.",
        variant: "destructive",
      });
      return;
    }

    createPurchase(
      { date, location: location || "Other", payer, presentMembers },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Coffee run has been recorded!",
          });
          // Reset form somewhat, keep date as today typically
          setPayer(null);
          setLocation(null);
          setPresentMembers([]);
          setDate(format(new Date(), "yyyy-MM-dd"));
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="bg-card rounded-[2rem] p-6 sm:p-8 shadow-soft border border-border/50">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-2xl mb-4 text-primary">
          <Coffee className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Record a Coffee Run</h2>
        <p className="text-muted-foreground mt-1">Track who bought the pastries today.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Date Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" /> Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-secondary/50 border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              required
            />
          </div>
        </div>

        {/* Location Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Location
          </label>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <SelectionChip
                key={`location-${loc}`}
                type="radio"
                label={loc}
                selected={location === loc}
                onClick={() => setLocation(loc)}
              />
            ))}
          </div>
        </div>

        {/* Payer Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            Who paid?
          </label>
          <div className="flex flex-wrap gap-2">
            {MEMBERS.map((member) => (
              <SelectionChip
                key={`payer-${member}`}
                type="radio"
                label={member}
                selected={payer === member}
                onClick={() => setPayer(member)}
              />
            ))}
          </div>
        </div>

        {/* Present Members Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Who was present?
          </label>
          <div className="flex flex-wrap gap-2">
            {MEMBERS.map((member) => (
              <SelectionChip
                key={`present-${member}`}
                type="checkbox"
                label={member}
                selected={presentMembers.includes(member)}
                onClick={() => handleTogglePresent(member)}
              />
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full relative group overflow-hidden rounded-xl bg-primary text-primary-foreground font-semibold px-6 py-4 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isPending ? (
                "Recording..."
              ) : (
                <>
                  <Check className="w-5 h-5" /> Save Purchase
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
          </button>
        </div>
      </form>
    </div>
  );
}
