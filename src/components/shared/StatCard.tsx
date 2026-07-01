"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardCard, { DashboardCardProps } from "./DashboardCard";

export interface StatTrend {
  value: number | string;
  direction: "up" | "down" | "neutral";
  label?: string;
}

export interface StatCardProps extends Omit<DashboardCardProps, "title" | "subtitle" | "children"> {
  title: string;
  value: string | number;
  description?: string;
  trend?: StatTrend;
}

export default function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
  loading = false,
  interactive = false,
  onClick,
  ...props
}: StatCardProps) {
  const renderTrend = () => {
    if (!trend) return null;

    const isUp = trend.direction === "up";
    const isDown = trend.direction === "down";

    return (
      <div className="flex items-center gap-1">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
            isUp && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
            isDown && "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
            !isUp && !isDown && "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
          )}
        >
          {isUp && <ArrowUpRight className="h-3 w-3" />}
          {isDown && <ArrowDownRight className="h-3 w-3" />}
          {!isUp && !isDown && <Minus className="h-3 w-3" />}
          <span>{trend.value}</span>
        </span>
        {trend.label && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-550 truncate">
            {trend.label}
          </span>
        )}
      </div>
    );
  };

  return (
    <DashboardCard
      title={
        <span className="text-xs font-semibold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
      }
      icon={icon}
      loading={loading}
      interactive={interactive}
      onClick={onClick}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <div className="mt-1 flex flex-col gap-1.5">
        {/* Main Stat Value */}
        <span className="font-heading text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
          {value}
        </span>

        {/* Trend & Extra descriptive line */}
        {(trend || description) && (
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {renderTrend()}
            {description && !trend && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {description}
              </span>
            )}
            {description && trend && (
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                • {description}
              </span>
            )}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
