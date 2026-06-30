export interface User {
  id: string;
  email: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  role: "consumer" | "merchant" | "creator";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}
