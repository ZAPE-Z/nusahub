"use client";

import React from "react";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => removeToast(t.id)}
          className={cn(
            "p-4 rounded-md shadow-medium text-sm font-medium animate-in fade-in slide-in-from-bottom-5 cursor-pointer text-white flex flex-col gap-0.5",
            t.type === "success" && "bg-success",
            t.type === "error" && "bg-error",
            t.type === "default" && "bg-text-primary"
          )}
        >
          <span>{t.title}</span>
          {t.description && <span className="text-xs opacity-90">{t.description}</span>}
        </div>
      ))}
    </div>
  );
}
