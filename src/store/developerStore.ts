import { create } from "zustand";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: "active" | "revoked";
  created: string;
}

export interface MiniApp {
  id: string;
  name: string;
  description: string;
  url: string;
  status: "sandbox" | "production";
  created: string;
}

interface DeveloperState {
  apiKeys: ApiKey[];
  miniApps: MiniApp[];
  logs: string[];
  generateApiKey: (name: string) => void;
  revokeApiKey: (id: string) => void;
  publishMiniApp: (app: Omit<MiniApp, "id" | "status" | "created">) => void;
  addLog: (logText: string) => void;
}

export const useDeveloperStore = create<DeveloperState>((set) => ({
  apiKeys: [
    { id: "key-1", name: "NusaHub Main Web App", key: "nh_live_6f7c8d9e2b1a0d3", status: "active", created: "2026-06-15" }
  ],
  miniApps: [
    { id: "app-1", name: "MSME Shipping Calculator", description: "Calculate local shipping courier fees in Bandung.", url: "https://example.com/shipping", status: "sandbox", created: "2026-06-20" }
  ],
  logs: [
    "[System] Sandbox compiler v1.0.0 initialized successfully.",
    "[Build] Deployed 'MSME Shipping Calculator' to sandbox environment.",
    "[API] Main Web App credentials verified successfully."
  ],
  generateApiKey: (name) => set((state) => {
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name,
      key: `nh_live_${randomHex}`,
      status: "active",
      created: new Date().toISOString().split("T")[0]
    };
    return {
      apiKeys: [...state.apiKeys, newKey],
      logs: [...state.logs, `[API] Generated key "${name}" successfully.`]
    };
  }),
  revokeApiKey: (id) => set((state) => ({
    apiKeys: state.apiKeys.map((k) => k.id === id ? { ...k, status: "revoked" as const } : k),
    logs: [...state.logs, `[API] Revoked key ID ${id}.`]
  })),
  publishMiniApp: (app) => set((state) => {
    const newApp: MiniApp = {
      ...app,
      id: `app-${Date.now()}`,
      status: "sandbox",
      created: new Date().toISOString().split("T")[0]
    };
    return {
      miniApps: [...state.miniApps, newApp],
      logs: [...state.logs, `[Build] Published Mini App "${app.name}" to Sandbox.`]
    };
  }),
  addLog: (logText) => set((state) => ({
    logs: [...state.logs, `[System] ${logText}`]
  }))
}));
