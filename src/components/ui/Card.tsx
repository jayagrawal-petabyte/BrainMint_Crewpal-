import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-forest/10 bg-white/80 backdrop-blur-sm shadow-card",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
