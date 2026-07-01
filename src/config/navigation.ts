import { Home, MessageSquare, Bot, Briefcase, Wallet, ShoppingBag, Sparkles, Users, Code, Settings, HelpCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const NAVIGATION_ITEMS = [
  { label: "Feed", icon: Home, href: ROUTES.home },
  { label: "Chats", icon: MessageSquare, href: "/chats" },
  { label: "AI", icon: Bot, href: "/ai" },
  { label: "Workspace", icon: Briefcase, href: "/workspace" },
  { label: "Profile", icon: Home, href: "/profile", isProfileLink: true },
];

export interface DrawerItemConfig {
  label: string;
  icon: any;
  href: string;
  capabilityKey?: "merchant" | "creator" | "developer" | "community";
  alwaysEnabled?: boolean;
}

export const DRAWER_ITEMS: DrawerItemConfig[] = [
  { label: "My Wallet", icon: Wallet, href: "/wallet", alwaysEnabled: true },
  { label: "Workspace", icon: Briefcase, href: "/workspace", alwaysEnabled: true },
  { label: "Merchant Center", icon: ShoppingBag, href: "/merchant", capabilityKey: "merchant" },
  { label: "Creator Studio", icon: Sparkles, href: "/creator", capabilityKey: "creator" },
  { label: "Community Center", icon: Users, href: "/community", capabilityKey: "community" },
  { label: "Developer Center", icon: Code, href: "/developer", capabilityKey: "developer" },
  { label: "Settings", icon: Settings, href: "/settings", alwaysEnabled: true },
  { label: "Help & Support", icon: HelpCircle, href: "/help", alwaysEnabled: true },
];
