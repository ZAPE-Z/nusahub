"use client";

import React from "react";
import { MessageSquareOff, Search, WifiOff, AlertOctagon, RotateCcw, Wallet, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyConversation({
  title = "No active conversations",
  description = "Tap a contact or use the quick action button to start chatting.",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center min-h-[50vh] gap-4 w-full max-w-sm mx-auto",
        className
      )}
    >
      {/* Icon with hover & entrance animation */}
      <motion.div
        variants={staggerItem}
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
        className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-1 shadow-inner"
      >
        <MessageSquareOff className="h-7 w-7" />
      </motion.div>

      <motion.h3
        variants={staggerItem}
        className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50"
      >
        {title}
      </motion.h3>

      <motion.p
        variants={staggerItem}
        className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Action triggers */}
      <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
        {actionLabel && onAction && (
          <Button onClick={onAction} className="text-xs h-9 px-4 font-medium rounded-lg">
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline" className="text-xs h-9 px-4 font-medium border-zinc-200 dark:border-zinc-800 rounded-lg">
            {secondaryActionLabel}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

export function EmptySearch({
  title = "No results found",
  description = "We couldn't find anything matching your search. Try checking for spelling errors or search for another term.",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center min-h-[40vh] gap-4 w-full max-w-sm mx-auto",
        className
      )}
    >
      <motion.div
        variants={staggerItem}
        whileHover={{ scale: 1.05, y: -2 }}
        className="h-16 w-16 bg-secondary/15 rounded-full flex items-center justify-center text-zinc-700 dark:text-zinc-300 mb-1"
      >
        <Search className="h-7 w-7" />
      </motion.div>

      <motion.h3
        variants={staggerItem}
        className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50"
      >
        {title}
      </motion.h3>

      <motion.p
        variants={staggerItem}
        className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed"
      >
        {description}
      </motion.p>

      <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline" className="text-xs h-9 px-4 font-medium border-zinc-200 dark:border-zinc-800 rounded-lg">
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="ghost" className="text-xs h-9 px-4 font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg">
            {secondaryActionLabel}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

export function NoInternet({
  title = "Network Disconnected",
  description = "Please check your internet connection or wifi settings and try refreshing.",
  actionLabel = "Retry Connection",
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center min-h-[50vh] gap-4 w-full max-w-sm mx-auto",
        className
      )}
    >
      <motion.div
        variants={staggerItem}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className="h-16 w-16 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-full flex items-center justify-center mb-1"
      >
        <WifiOff className="h-7 w-7" />
      </motion.div>

      <motion.h3
        variants={staggerItem}
        className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50"
      >
        {title}
      </motion.h3>

      <motion.p
        variants={staggerItem}
        className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed"
      >
        {description}
      </motion.p>

      <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
        {onAction && (
          <Button onClick={onAction} className="text-xs h-9 px-4 font-medium rounded-lg flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{actionLabel}</span>
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline" className="text-xs h-9 px-4 font-medium border-zinc-200 dark:border-zinc-800 rounded-lg">
            {secondaryActionLabel}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

export function SomethingWentWrong({
  title = "Something went wrong",
  description = "An unexpected error occurred during execution. Don't worry, your data is safe.",
  actionLabel = "Reload View",
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center min-h-[50vh] gap-4 w-full max-w-sm mx-auto",
        className
      )}
    >
      <motion.div
        variants={staggerItem}
        whileHover={{ rotate: 15 }}
        className="h-16 w-16 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-full flex items-center justify-center mb-1 animate-pulse"
      >
        <AlertOctagon className="h-7 w-7" />
      </motion.div>

      <motion.h3
        variants={staggerItem}
        className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50"
      >
        {title}
      </motion.h3>

      <motion.p
        variants={staggerItem}
        className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed"
      >
        {description}
      </motion.p>

      <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
        {onAction && (
          <Button onClick={onAction} className="text-xs h-9 px-4 font-medium rounded-lg flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{actionLabel}</span>
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline" className="text-xs h-9 px-4 font-medium border-zinc-200 dark:border-zinc-800 rounded-lg">
            {secondaryActionLabel}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

export function EmptyWallet({
  title = "No ledger entries",
  description = "Your transactional history will appear here once you transfer or deposit funds.",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center min-h-[25vh] gap-3.5 w-full max-w-sm mx-auto",
        className
      )}
    >
      <motion.div
        variants={staggerItem}
        whileHover={{ scale: 1.05 }}
        className="h-14 w-14 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner"
      >
        <Wallet className="h-6 w-6" />
      </motion.div>
      <div className="space-y-1">
        <motion.h3 variants={staggerItem} className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-150">
          {title}
        </motion.h3>
        <motion.p variants={staggerItem} className="text-xs text-zinc-450 dark:text-zinc-550 max-w-xs leading-relaxed">
          {description}
        </motion.p>
      </div>
      {actionLabel && onAction && (
        <motion.div variants={staggerItem} className="mt-1">
          <Button onClick={onAction} className="text-xs h-8 px-3.5 font-medium rounded-lg">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export function EmptyCommunity({
  title = "No communities active",
  description = "Create a community group or search existing ones to start networking.",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center min-h-[25vh] gap-3.5 w-full max-w-sm mx-auto",
        className
      )}
    >
      <motion.div
        variants={staggerItem}
        whileHover={{ scale: 1.05 }}
        className="h-14 w-14 bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400 rounded-full flex items-center justify-center shadow-inner"
      >
        <Users className="h-6 w-6" />
      </motion.div>
      <div className="space-y-1">
        <motion.h3 variants={staggerItem} className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-150">
          {title}
        </motion.h3>
        <motion.p variants={staggerItem} className="text-xs text-zinc-450 dark:text-zinc-550 max-w-xs leading-relaxed">
          {description}
        </motion.p>
      </div>
      {actionLabel && onAction && (
        <motion.div variants={staggerItem} className="mt-1">
          <Button onClick={onAction} className="text-xs h-8 px-3.5 font-medium rounded-lg">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export function EmptyDeveloper({
  title = "No api applications registered",
  description = "Register a new client application credentials to begin developing for NusaHub ecosystem.",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center min-h-[25vh] gap-3.5 w-full max-w-sm mx-auto",
        className
      )}
    >
      <motion.div
        variants={staggerItem}
        whileHover={{ scale: 1.05 }}
        className="h-14 w-14 bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400 rounded-full flex items-center justify-center shadow-inner"
      >
        <Code className="h-6 w-6" />
      </motion.div>
      <div className="space-y-1">
        <motion.h3 variants={staggerItem} className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-150">
          {title}
        </motion.h3>
        <motion.p variants={staggerItem} className="text-xs text-zinc-450 dark:text-zinc-550 max-w-xs leading-relaxed">
          {description}
        </motion.p>
      </div>
      {actionLabel && onAction && (
        <motion.div variants={staggerItem} className="mt-1">
          <Button onClick={onAction} className="text-xs h-8 px-3.5 font-medium rounded-lg">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

