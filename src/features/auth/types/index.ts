import { UserCapabilities } from "@/store/useAppStore";

export interface User {
  id: string;
  email: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  capabilities: UserCapabilities;
  joinedDate?: string;
  verificationStatus?: "verified" | "unverified" | "pending";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}
