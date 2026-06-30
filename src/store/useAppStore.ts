import { create } from "zustand";

export interface UserSession {
  email: string;
  name: string;
  handle: string;
  avatarUrl?: string;
}

export type UserRole = "consumer" | "merchant" | "creator";

interface AppState {
  user: UserSession | null;
  role: UserRole;
  isDrawerOpen: boolean;
  setUser: (user: UserSession | null) => void;
  setRole: (role: UserRole) => void;
  toggleDrawer: (isOpen?: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  role: "consumer",
  isDrawerOpen: false,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  toggleDrawer: (isOpen) => set((state) => ({ isDrawerOpen: isOpen !== undefined ? isOpen : !state.isDrawerOpen })),
  logout: () => set({ user: null, role: "consumer", isDrawerOpen: false }),
}));
