"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

export default function FAB() {
  const pathname = usePathname();

  // Floating Action Button renders only on Home, Chats, or Workspace lists
  const showFAB = ["/home", "/chats", "/workspace"].includes(pathname);
  if (!showFAB) return null;

  const handleAction = () => {
    // In Sprint 1, we show a mock action alert trigger
    const actionLabel =
      pathname === "/home"
        ? "Create Post Mock Triggered!"
        : pathname === "/chats"
        ? "Start New Chat Mock Triggered!"
        : "Create Task/Note Mock Triggered!";
    
    alert(actionLabel);
  };

  return (
    <button
      onClick={handleAction}
      className="fixed bottom-20 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-high flex items-center justify-center z-30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      title="Quick Action"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
