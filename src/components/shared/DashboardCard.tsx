"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHover } from "@/lib/animations";
import Skeleton from "@/components/shared/Skeleton";

export interface DashboardCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export default function DashboardCard({
  title,
  subtitle,
  icon,
  action,
  footer,
  children,
  className,
  loading = false,
  interactive = false,
  onClick,
}: DashboardCardProps) {
  const CardWrapper = interactive ? motion.div : "div";
  
  const motionProps = interactive
    ? {
        variants: cardHover,
        whileHover: "hover",
        whileTap: "tap",
      }
    : {};

  return (
    <CardWrapper
      onClick={onClick}
      {...motionProps}
      className={cn(
        "rounded-xl border border-zinc-200/60 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950 transition-colors",
        interactive && "cursor-pointer hover:border-zinc-350 dark:hover:border-zinc-700",
        className
      )}
    >
      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          {(title || subtitle || icon || action) && (
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="space-y-0.5">
                {title && (
                  <h3 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-none">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {action && <div className="text-xs">{action}</div>}
                {icon && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    {icon}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card Content Body */}
          <div className="text-zinc-800 dark:text-zinc-200">{children}</div>

          {/* Card Footer */}
          {footer && (
            <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-900 text-xs">
              {footer}
            </div>
          )}
        </>
      )}
    </CardWrapper>
  );
}
