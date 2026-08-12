"use client";

import { memo } from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  let variantStyles = "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100";
  if (variant === "success") variantStyles = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (variant === "warning") variantStyles = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  if (variant === "error") variantStyles = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

export default memo(Badge);
