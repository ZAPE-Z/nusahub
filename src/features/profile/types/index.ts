export interface UserProfileSettings {
  displayName: string;
  bio?: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
}
