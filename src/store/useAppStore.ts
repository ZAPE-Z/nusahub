import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * NusaHub One Account Multi-Capability Architecture
 * A user has a single account with multiple simultaneous capabilities.
 * Capabilities are permanent and reflect account status, rather than temporary preferences.
 */

export type CapabilityStatus = "active" | "inactive" | "coming-soon";

export interface UserCapabilities {
  consumer: CapabilityStatus;
  merchant: CapabilityStatus;
  creator: CapabilityStatus;
  freelancer: CapabilityStatus;
  mentor: CapabilityStatus;
  organization: CapabilityStatus;
  community: CapabilityStatus;
  developer: CapabilityStatus;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  capabilities: UserCapabilities;
  joinedDate?: string;
  verificationStatus?: "verified" | "unverified" | "pending";
}

// Deprecated type maintained for backward compatibility references
export type UserRole = "consumer" | "merchant" | "creator";

interface AppState {
  user: UserSession | null;
  isDrawerOpen: boolean;
  setUser: (user: UserSession | null) => void;
  updateCapabilities: (capabilities: Partial<UserCapabilities>) => void;
  toggleDrawer: (isOpen?: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isDrawerOpen: false,
      setUser: (user) => set({ user }),
      updateCapabilities: (newCaps) => set((state) => {
        if (!state.user) return {};
        return {
          user: {
            ...state.user,
            capabilities: {
              ...state.user.capabilities,
              ...newCaps,
            },
          },
        };
      }),
      toggleDrawer: (isOpen) => set((state) => ({ isDrawerOpen: isOpen !== undefined ? isOpen : !state.isDrawerOpen })),
      logout: () => set({ user: null, isDrawerOpen: false }),
    }),
    {
      name: "nusahub-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // Only persist the user session, not the UI drawer state
    }
  )
);
