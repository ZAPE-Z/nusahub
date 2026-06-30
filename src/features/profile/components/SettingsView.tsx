"use client";

import React from "react";
import { useProfileData } from "../hooks/useProfileData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Bell, Shield, Info } from "lucide-react";
import { useToast } from "@/store/useToastStore";

export default function SettingsView() {
  const { settings, updateSettings, isUpdating } = useProfileData();
  const { toast } = useToast();

  const handleThemeChange = async (theme: "light" | "dark") => {
    try {
      await updateSettings({ theme });
      toast("Theme Updated", `Switched layout to ${theme} mode.`, "success");
    } catch (err) {
      toast("Error", "Failed to update theme", "error");
    }
  };

  const handleNotificationsToggle = async () => {
    try {
      const target = !settings.notificationsEnabled;
      await updateSettings({ notificationsEnabled: target });
      toast(
        "Notifications Updated",
        `System alerts are now ${target ? "enabled" : "disabled"}.`,
        "success"
      );
    } catch (err) {
      toast("Error", "Failed to update notification settings", "error");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Theme Section */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Interface Theme
          </span>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={settings.theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              className="h-12 text-xs flex items-center gap-2"
              disabled={isUpdating}
            >
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </Button>
            <Button
              variant={settings.theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className="h-12 text-xs flex items-center gap-2"
              disabled={isUpdating}
            >
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            System Preferences
          </span>
          <button
            onClick={handleNotificationsToggle}
            className="flex items-center justify-between p-3 rounded-md hover:bg-primary/5 transition-colors text-left"
            disabled={isUpdating}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">System Notifications</span>
                <span className="text-xs text-text-muted">Receive alerts on new orders & likes</span>
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.notificationsEnabled ? "bg-primary" : "bg-text-muted/30"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.notificationsEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </button>

          <button
            className="flex items-center justify-between p-3 rounded-md hover:bg-primary/5 transition-colors text-left"
            onClick={() => toast("Privacy Controls", "Simulated security checkup complete.", "success")}
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">Privacy & Security</span>
                <span className="text-xs text-text-muted">Manage account data options</span>
              </div>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* App Info Section */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Application Info
          </span>
          <div className="flex items-start gap-3 p-2">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs text-text-primary font-semibold">NusaHub MVP</span>
              <span className="text-[10px] text-text-muted">Version 0.1.0 (Sprint 1 Build)</span>
              <p className="text-[10px] text-text-muted mt-2 leading-relaxed">
                NusaHub is a horizontal open super app prototype. Built under documentation-driven guidelines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
