import * as React from "react";
import { cn } from "@/lib/utils";

const tagStyles = {
  interns: "bg-tag-interns-bg text-tag-interns-text",
  tasks: "bg-tag-tasks-bg text-tag-tasks-text",
  projects: "bg-tag-projects-bg text-tag-projects-text",
} as const;

export interface TagProps {
  variant: keyof typeof tagStyles;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Tag({ variant, icon, children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-display font-semibold",
        tagStyles[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
