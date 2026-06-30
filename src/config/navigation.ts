import { Home, MessageSquare, Bot, Briefcase, Wallet, Grid, Settings } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const NAVIGATION_ITEMS = [
  { label: "Feed", icon: Home, href: ROUTES.home },
  { label: "Chats", icon: MessageSquare, href: "/chats" },
  { label: "AI", icon: Bot, href: "/ai" },
  { label: "Workspace", icon: Briefcase, href: "/workspace" },
  { label: "Profile", icon: Home, href: "/profile", isProfileLink: true },
];

export const DRAWER_ITEMS = [
  { label: "My Wallet", icon: Wallet, href: "/wallet" },
  { label: "Mini Apps Explorer", icon: Grid, href: "/miniapps" },
  { label: "Settings", icon: Settings, href: "/settings" },
];
