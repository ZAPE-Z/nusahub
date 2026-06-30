"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { X, Wallet, Grid, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

export default function Drawer() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAppStore((state) => state.user);
  const isDrawerOpen = useAppStore((state) => state.isDrawerOpen);
  const toggleDrawer = useAppStore((state) => state.toggleDrawer);
  const logout = useAppStore((state) => state.logout);

  if (!isDrawerOpen) return null;

  const handleLogout = () => {
    logout();
    toggleDrawer(false);
    router.push("/login");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-in fade-in transition-all"
        onClick={() => toggleDrawer(false)}
      />
      
      {/* Side Content */}
      <aside className="fixed top-0 bottom-0 left-0 w-[280px] bg-surface z-50 shadow-high animate-in slide-in-from-left duration-300 flex flex-col p-6 border-r border-text-muted/10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold text-text-primary text-base">NusaHub Menu</span>
          <button
            onClick={() => toggleDrawer(false)}
            className="p-1 rounded-md hover:bg-primary/10 text-text-muted active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        {user ? (
          <div className="flex items-center gap-3 mb-6 p-3 bg-background rounded-lg border border-text-muted/10">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="font-medium text-sm text-text-primary truncate">{user.name}</span>
              <span className="text-xs text-text-muted truncate">@{user.handle}</span>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-background rounded-lg text-center border border-text-muted/10">
            <p className="text-xs text-text-muted mb-2">Not signed in</p>
            <Link
              href="/login"
              onClick={() => toggleDrawer(false)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1">
          <Link
            href="/wallet"
            onClick={() => toggleDrawer(false)}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-primary/10 text-text-primary text-sm font-medium transition-all active:scale-98"
          >
            <Wallet className="h-5 w-5 text-primary" />
            <span>My Wallet</span>
          </Link>
          <Link
            href="/miniapps"
            onClick={() => toggleDrawer(false)}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-primary/10 text-text-primary text-sm font-medium transition-all active:scale-98"
          >
            <Grid className="h-5 w-5 text-primary" />
            <span>Mini Apps Explorer</span>
          </Link>
          <Link
            href="/settings"
            onClick={() => toggleDrawer(false)}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-primary/10 text-text-primary text-sm font-medium transition-all active:scale-98"
          >
            <Settings className="h-5 w-5 text-primary" />
            <span>Settings</span>
          </Link>

          <hr className="my-4 border-text-muted/10" />

          {/* Theme Switcher Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-between p-3 rounded-md hover:bg-primary/10 text-text-primary text-sm font-medium transition-all text-left"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-secondary" />
              ) : (
                <Moon className="h-5 w-5 text-secondary" />
              )}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </div>
          </button>
        </nav>

        {/* Footer actions */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-error/10 text-error text-sm font-medium transition-all mt-auto"
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        )}
      </aside>
    </>
  );
}
