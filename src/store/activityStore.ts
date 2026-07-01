import { create } from "zustand";

export interface ActivityLog {
  id: string;
  type: "wallet" | "workspace" | "merchant" | "creator" | "community" | "developer";
  message: string;
  timestamp: string;
}

interface ActivityState {
  logs: ActivityLog[];
  addLog: (type: ActivityLog["type"], message: string) => void;
  clearLogs: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  logs: [
    {
      id: "log-1",
      type: "wallet",
      message: "Initial wallet grant: Rp 1,000,000",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString("id-ID"),
    },
    {
      id: "log-2",
      type: "workspace",
      message: "Completed task: Review Andi's illustration designs",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString("id-ID"),
    }
  ],
  addLog: (type, message) => set((state) => ({
    logs: [
      {
        id: `log-${Date.now()}`,
        type,
        message,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      },
      ...state.logs
    ]
  })),
  clearLogs: () => set({ logs: [] })
}));
