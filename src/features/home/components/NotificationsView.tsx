"use client";

import React, { useState } from "react";
import { useHomeData } from "../hooks/useHomeData";
import { AlertSkeleton } from "@/components/shared/Skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Heart, ShoppingCart, Bell, Wallet, Briefcase, ShoppingBag, Users, Code, Sparkles, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { EmptyConversation } from "@/components/shared";

type NotificationCategory = "all" | "unread" | "payments" | "merchant" | "workspace" | "community" | "ai";

export default function NotificationsView() {
  const { alerts, isLoadingAlerts, markAllRead } = useHomeData();
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");

  const getFilteredAlerts = () => {
    switch (activeCategory) {
      case "unread":
        return alerts.filter((a) => !a.isRead);
      case "payments":
        return alerts.filter((a) => 
          a.message.toLowerCase().includes("pay") || 
          a.message.toLowerCase().includes("purchase") || 
          a.message.toLowerCase().includes("wallet") ||
          a.message.toLowerCase().includes("balance") ||
          a.type === "order"
        );
      case "merchant":
        return alerts.filter((a) => 
          a.linkUrl === "/merchant" || 
          a.message.toLowerCase().includes("merchant") || 
          a.type === "order"
        );
      case "workspace":
        return alerts.filter((a) => 
          a.linkUrl === "/workspace" || 
          a.message.toLowerCase().includes("workspace") || 
          a.message.toLowerCase().includes("task") ||
          a.message.toLowerCase().includes("project")
        );
      case "community":
        return alerts.filter((a) => 
          a.linkUrl === "/community" || 
          a.message.toLowerCase().includes("community") || 
          a.message.toLowerCase().includes("group")
        );
      case "ai":
        return alerts.filter((a) => 
          a.linkUrl === "/ai" || 
          a.message.toLowerCase().includes("ai") || 
          a.message.toLowerCase().includes("bot") || 
          a.message.toLowerCase().includes("assistant")
        );
      default:
        return alerts;
    }
  };

  const getCategoryCount = (category: NotificationCategory) => {
    switch (category) {
      case "unread":
        return alerts.filter((a) => !a.isRead).length;
      case "payments":
        return alerts.filter((a) => 
          a.message.toLowerCase().includes("pay") || 
          a.message.toLowerCase().includes("purchase") || 
          a.message.toLowerCase().includes("wallet") ||
          a.message.toLowerCase().includes("balance") ||
          a.type === "order"
        ).length;
      case "merchant":
        return alerts.filter((a) => 
          a.linkUrl === "/merchant" || 
          a.message.toLowerCase().includes("merchant") || 
          a.type === "order"
        ).length;
      case "workspace":
        return alerts.filter((a) => 
          a.linkUrl === "/workspace" || 
          a.message.toLowerCase().includes("workspace") || 
          a.message.toLowerCase().includes("task") ||
          a.message.toLowerCase().includes("project")
        ).length;
      case "community":
        return alerts.filter((a) => 
          a.linkUrl === "/community" || 
          a.message.toLowerCase().includes("community") || 
          a.message.toLowerCase().includes("group")
        ).length;
      case "ai":
        return alerts.filter((a) => 
          a.linkUrl === "/ai" || 
          a.message.toLowerCase().includes("ai") || 
          a.message.toLowerCase().includes("bot") || 
          a.message.toLowerCase().includes("assistant")
        ).length;
      default:
        return alerts.length;
    }
  };

  const categories: { key: NotificationCategory; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "payments", label: "Payments" },
    { key: "merchant", label: "Merchant" },
    { key: "workspace", label: "Workspace" },
    { key: "community", label: "Community" },
    { key: "ai", label: "AI & Assistants" },
  ];

  if (isLoadingAlerts) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <AlertSkeleton />
        <AlertSkeleton />
        <AlertSkeleton />
      </div>
    );
  }

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Title Header */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="h-4.5 w-4.5 text-zinc-700 dark:text-zinc-300" />
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            Notifications Center
          </span>
        </div>
        {alerts.some((a) => !a.isRead) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllRead()}
            className="text-[11px] h-8 text-primary font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Category Tabs Switcher (Horizontal scroll) */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-zinc-100 dark:border-zinc-900 scrollbar-none shrink-0">
        {categories.map((cat) => {
          const count = getCategoryCount(cat.key);
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border",
                isActive
                  ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                  : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
              )}
            >
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-extrabold leading-none",
                    isActive
                      ? "bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
                      : "bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Alerts Feed */}
      <AnimatePresence mode="wait">
        {filteredAlerts.length === 0 ? (
          <motion.div
            key={`empty-${activeCategory}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-6"
          >
            <EmptyConversation
              title={`No ${activeCategory === "all" ? "" : activeCategory} notifications`}
              description={`We checked your feed, and there's no alerts under ${activeCategory} right now.`}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`list-${activeCategory}`}
            variants={staggerContainer(0.04, 0.05)}
            initial="hidden"
            animate="visible"
            className="flex flex-col border border-zinc-200/60 bg-white rounded-xl divide-y divide-zinc-100 shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:divide-zinc-900"
          >
            {filteredAlerts.map((a) => (
              <motion.div
                key={a.id}
                variants={staggerItem}
                className={cn(
                  "p-4 flex gap-3.5 items-start transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10",
                  !a.isRead && "bg-zinc-50/70 dark:bg-zinc-900/20"
                )}
              >
                {/* Visual Icon */}
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  {a.type === "like" && <Heart className="h-4.5 w-4.5 text-rose-500 fill-rose-500/25" />}
                  {a.type === "order" && <ShoppingCart className="h-4.5 w-4.5 text-emerald-600" />}
                  {a.type === "system" && <Info className="h-4.5 w-4.5 text-blue-600" />}
                </div>
                
                {/* Message Context */}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed", !a.isRead && "font-bold text-zinc-950 dark:text-white")}>
                    {a.message}
                  </p>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block font-mono">
                    {a.timestamp}
                  </span>
                </div>
                
                {/* Unread marker */}
                {!a.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
