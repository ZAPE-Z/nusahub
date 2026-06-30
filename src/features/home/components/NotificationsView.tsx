"use client";

import React from "react";
import { useHomeData } from "../hooks/useHomeData";
import { AlertSkeleton } from "@/components/shared/Skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Heart, ShoppingCart } from "lucide-react";

export default function NotificationsView() {
  const { alerts, isLoadingAlerts, markAllRead } = useHomeData();

  if (isLoadingAlerts) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <AlertSkeleton />
        <AlertSkeleton />
        <AlertSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recent Activity</span>
        {alerts.some((a) => !a.isRead) && (
          <Button variant="ghost" size="sm" onClick={() => markAllRead()} className="text-xs h-8 text-primary">
            Mark all as read
          </Button>
        )}
      </div>

      {alerts.length === 0 ? (
        <Card className="p-8 text-center border-dashed flex flex-col items-center justify-center gap-3">
          <Info className="h-8 w-8 text-text-muted/40" />
          <span className="text-sm text-text-muted">You are all caught up! No notifications.</span>
        </Card>
      ) : (
        <div className="flex flex-col border border-text-muted/10 bg-surface rounded-lg divide-y divide-text-muted/5 shadow-low overflow-hidden">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`p-4 flex gap-3 items-start transition-colors ${
                !a.isRead ? "bg-primary/5" : ""
              }`}
            >
              <div className="mt-0.5">
                {a.type === "like" && <Heart className="h-5 w-5 text-secondary" />}
                {a.type === "order" && <ShoppingCart className="h-5 w-5 text-primary" />}
                {a.type === "system" && <Info className="h-5 w-5 text-primary" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm text-text-primary ${!a.isRead ? "font-medium" : ""}`}>
                  {a.message}
                </p>
                <span className="text-xs text-text-muted mt-1 block">{a.timestamp}</span>
              </div>
              
              {!a.isRead && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
