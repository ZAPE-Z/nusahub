import React from "react";
import { cn } from "@/lib/utils";

export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800/60",
        className
      )}
      {...props}
    />
  );
}

// 1. Post Skeleton Loader
export function PostSkeleton() {
  return (
    <div className="p-4 border border-zinc-200/60 bg-white rounded-xl space-y-3 dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-36 w-full rounded-lg" />
    </div>
  );
}

// 2. Alert Skeleton Loader
export function AlertSkeleton() {
  return (
    <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex items-start gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// 3. Grid Card Skeleton Loader
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/60 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950 space-y-3">
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// 4. Horizontal List Item Skeleton Loader
interface ListSkeletonProps {
  count?: number;
}
export function ListSkeleton({ count = 3 }: ListSkeletonProps) {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 py-2">
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 5. Stat Card Metric Skeleton Loader
export function StatSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200/60 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3.5 w-36" />
    </div>
  );
}

// 6. Interactive Chat Bubbles Skeleton Loader
export function ChatBubbleSkeleton() {
  return (
    <div className="space-y-4 w-full p-4">
      {/* Received message */}
      <div className="flex items-end gap-2 max-w-[75%]">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="space-y-1">
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-none p-3 space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-2.5 w-10 ml-1" />
        </div>
      </div>

      {/* Sent message */}
      <div className="flex items-end justify-end gap-2 ml-auto max-w-[75%]">
        <div className="space-y-1 items-end flex flex-col">
          <div className="bg-zinc-200 dark:bg-zinc-700/60 rounded-2xl rounded-br-none p-3 space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-2.5 w-10 mr-1" />
        </div>
      </div>

      {/* Received message short */}
      <div className="flex items-end gap-2 max-w-[75%]">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="space-y-1">
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-none p-3">
            <Skeleton className="h-3.5 w-20" />
          </div>
          <Skeleton className="h-2.5 w-10 ml-1" />
        </div>
      </div>
    </div>
  );
}
