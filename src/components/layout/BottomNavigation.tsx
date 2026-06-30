"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export default function BottomNavigation() {
  const pathname = usePathname();

  const isAuthPage = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword, "/"].includes(pathname);
  if (isAuthPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-text-muted/10 flex items-center justify-around z-40 max-w-[768px] mx-auto shadow-low">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = item.isProfileLink
          ? pathname.startsWith("/profile") || pathname.startsWith("/settings")
          : pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-md transition-all active:scale-95",
              isActive ? "text-primary font-semibold" : "text-text-muted"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
