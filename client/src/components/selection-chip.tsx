import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  type?: "radio" | "checkbox";
}

export function SelectionChip({ label, selected, onClick, type = "radio" }: SelectionChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative px-5 py-3 rounded-xl font-medium text-sm transition-colors duration-200 border outline-none overflow-hidden",
        selected 
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" 
          : "bg-card text-foreground border-border hover:border-primary/30 hover:bg-secondary/50"
      )}
    >
      {selected && (
        <motion.div
          layoutId={`chip-active-${type}`}
          className="absolute inset-0 bg-primary z-0"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
      
      <span className={cn("relative z-10", selected ? "text-primary-foreground" : "")}>
        {label}
      </span>
    </motion.button>
  );
}
