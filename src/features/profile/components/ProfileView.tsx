"use client";

import React from "react";
import { useAppStore, UserRole } from "@/store/useAppStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/store/useToastStore";
import { Settings, Shield, User, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ProfileView() {
  const user = useAppStore((state) => state.user);
  const activeRole = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const { toast } = useToast();

  const handleRoleToggle = (role: UserRole) => {
    setRole(role);
    toast("Role Switched", `Active platform role changed to: ${role.toUpperCase()}`, "success");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Profile Info Header */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg text-text-primary">{user.name}</h2>
            <span className="text-xs text-text-muted">@{user.handle}</span>
          </div>

          <div className="flex gap-2 mt-2 w-full max-w-xs">
            <Link href="/settings" className="flex-1">
              <Button variant="outline" className="w-full flex items-center gap-2 h-10 text-xs">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Role Toggle Switch Section */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Switch Platform Mode
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(["consumer", "merchant", "creator"] as UserRole[]).map((r) => {
              const isActive = activeRole === r;
              return (
                <Button
                  key={r}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => handleRoleToggle(r)}
                  className="h-10 text-xs px-2 flex items-center gap-1.5 capitalize"
                >
                  {r === "consumer" && <User className="h-3.5 w-3.5" />}
                  {r === "merchant" && <ShoppingBag className="h-3.5 w-3.5" />}
                  {r === "creator" && <Shield className="h-3.5 w-3.5" />}
                  <span>{r}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Profile Summary stats */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Workspace Summary
          </span>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-background rounded-lg border border-text-muted/5">
              <span className="text-lg font-bold text-primary">12</span>
              <p className="text-[10px] text-text-muted uppercase mt-0.5">Notes Saved</p>
            </div>
            <div className="p-3 bg-background rounded-lg border border-text-muted/5">
              <span className="text-lg font-bold text-primary">5</span>
              <p className="text-[10px] text-text-muted uppercase mt-0.5">Active Tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
