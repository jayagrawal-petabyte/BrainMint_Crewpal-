import { cn } from "@/lib/utils";

export function Logo({ className, size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  return (
    <span
      className={cn(
        "font-display font-semibold tracking-tight text-forest",
        size === "sm" ? "text-lg" : "text-5xl md:text-6xl",
        className
      )}
    >
      Crewpal
    </span>
  );
}
