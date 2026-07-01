"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/chatStore";
import { ChevronLeft, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import ConversationHeader from "@/features/chat/components/ConversationHeader";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const user = useAppStore((state) => mounted ? state.user : null);
  const toggleDrawer = useAppStore((state) => state.toggleDrawer);
  const activeChatId = useChatStore((state) => state.activeChatId);

  const isAuthPage = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword, "/"].includes(pathname);
  if (isAuthPage) return null;

  // Render chat room details header if we have an active room on the chats path
  if (pathname === "/chats" && activeChatId) {
    return (
      <header className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-text-muted/10 flex items-center justify-between px-4 z-40 max-w-[768px] mx-auto shadow-low">
        <ConversationHeader chatId={activeChatId} />
      </header>
    );
  }

  const showBack = ![ROUTES.home, "/chats", "/ai", "/workspace", "/profile"].includes(pathname);
  
  let title = "NusaHub";
  if (pathname.startsWith(ROUTES.home)) title = "Feed Updates";
  else if (pathname.startsWith("/chats")) title = "Conversations";
  else if (pathname.startsWith("/ai")) title = "Nusa AI Assistant";
  else if (pathname.startsWith("/workspace")) title = "Personal Workspace";
  else if (pathname.startsWith("/profile")) title = "My Profile";
  else if (pathname.startsWith("/settings")) title = "Settings";
  else if (pathname.startsWith(ROUTES.notifications)) title = "Alerts & Notifications";

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-text-muted/10 flex items-center justify-between px-4 z-40 max-w-[768px] mx-auto shadow-low">
      <div className="flex items-center w-10">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="p-1 rounded-md hover:bg-primary/10 text-text-primary active:scale-95"
            title="Back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : (
          user && (
            <button
              onClick={() => toggleDrawer(true)}
              className="focus:outline-none hover:opacity-90 active:scale-95"
              title="Menu"
            >
              <Avatar className="h-8 w-8">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </button>
          )
        )}
      </div>

      <h1 className="font-semibold text-text-primary text-base">{title}</h1>

      <div className="flex items-center justify-end w-10">
        {!isAuthPage && (
          <Link
            href={ROUTES.notifications}
            className="p-1 rounded-md hover:bg-primary/10 text-text-muted active:scale-95"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>
        )}
      </div>
    </header>
  );
}

