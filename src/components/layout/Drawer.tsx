"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { X, LogOut, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { DRAWER_ITEMS } from "@/config/navigation";
import { ROUTES } from "@/constants/routes";

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
    router.push(ROUTES.login);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-in fade-in transition-all"
        onClick={() => toggleDrawer(false)}
      />
      <aside className="fixed top-0 bottom-0 left-0 w-[280px] bg-surface z-50 shadow-high animate-in slide-in-from-left duration-300 flex flex-col p-6 border-r border-text-muted/10">
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold text-text-primary text-base">NusaHub Menu</span>
          <button
            onClick={() => toggleDrawer(false)}
            className="p-1 rounded-md hover:bg-primary/10 text-text-muted active:scale-95"
            title="Close Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

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
              href={ROUTES.login}
              onClick={() => toggleDrawer(false)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Sign In Now
            </Link>
          </div>
        )}

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
          {DRAWER_ITEMS.map((item) => {
            const Icon = item.icon;
            
            // Get status of current capability from user object
            const capabilities = user?.capabilities || {
              consumer: "active",
              merchant: "inactive",
              creator: "inactive",
              freelancer: "coming-soon",
              mentor: "coming-soon",
              organization: "coming-soon",
              community: "coming-soon",
              developer: "coming-soon",
            };

            let isEnabled = item.alwaysEnabled || false;
            let statusText = "";

            if (item.capabilityKey) {
              const status = capabilities[item.capabilityKey];
              isEnabled = status === "active";
              if (status === "coming-soon") {
                statusText = "SOON";
              } else if (status === "inactive") {
                statusText = "INACTIVE";
              }
            }

            if (isEnabled) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => toggleDrawer(false)}
                  className="flex items-center gap-3 p-2.5 rounded-md hover:bg-primary/10 text-text-primary text-sm font-medium transition-all active:scale-98"
                >
                  <Icon className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            } else {
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-md text-text-muted/50 text-sm font-medium cursor-not-allowed opacity-50 select-none"
                  title={`Activate ${item.label} capability inside Profile`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="h-4.5 w-4.5 text-text-muted/30 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[8px] font-bold text-secondary uppercase bg-secondary/5 px-1.5 py-0.5 rounded border border-secondary/15 shrink-0 scale-90">
                    {statusText}
                  </span>
                </div>
              );
            }
          })}

          <hr className="my-4 border-text-muted/10" />

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-between p-3 rounded-md hover:bg-primary/10 text-text-primary text-sm font-medium transition-all text-left w-full"
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

        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-error/10 text-error text-sm font-medium transition-all mt-auto w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        )}
      </aside>
    </>
  );
}
