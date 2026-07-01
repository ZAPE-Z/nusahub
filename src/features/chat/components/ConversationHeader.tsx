"use client";

import React from "react";
import { useConversation } from "../hooks/useConversation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Pin, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/shared";

interface ConversationHeaderProps {
  chatId: string;
}

export default function ConversationHeader({ chatId }: ConversationHeaderProps) {
  const router = useRouter();
  const chatStore = useChatStore();
  const { conversation, isPinned, pin, deleteChat } = useConversation(chatId);
  const [showConfirm, setShowConfirm] = React.useState(false);

  if (!conversation) return null;
  const { participant } = conversation;

  const handleBack = () => {
    chatStore.setActiveChatId(null);
    router.push("/chats");
  };

  const handlePin = () => {
    pin();
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  return (
    <>
      {showConfirm && (
        <ConfirmationDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          title="Delete Conversation"
          description={`Are you sure you want to delete your conversation with ${participant.name}? All message logs will be permanently deleted.`}
          confirmLabel="Delete Conversation"
          type="danger"
          onConfirm={() => {
            deleteChat();
            setShowConfirm(false);
            handleBack();
          }}
        />
      )}
      <div className="flex-1 flex items-center justify-between h-full w-full">
      {/* Left Back Arrow and User Bio */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={handleBack}
          className="p-1 rounded-md hover:bg-background text-text-primary active:scale-95 transition-all mr-1 shrink-0"
          title="Back to Chats"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <Avatar className="h-9 w-9 border border-text-muted/10 shrink-0">
          <AvatarImage src={participant.avatarUrl} alt={participant.name} />
          <AvatarFallback>{participant.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <h4 className="font-semibold text-xs text-text-primary truncate leading-tight">
            {participant.name}
          </h4>
          <span className="text-[10px] text-text-muted truncate mt-0.5 leading-none">
            {conversation.isTyping ? (
              <span className="text-primary italic animate-pulse font-medium">typing...</span>
            ) : (
              "Online"
            )}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handlePin}
          className={cn(
            "p-1.5 rounded-md hover:bg-background text-text-muted active:scale-95 transition-all",
            isPinned && "text-secondary"
          )}
          title={isPinned ? "Unpin Conversation" : "Pin Conversation"}
        >
          <Pin className={cn("h-4 w-4", isPinned && "fill-secondary text-secondary rotate-45")} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-md hover:bg-background text-text-muted hover:text-error active:scale-95 transition-all"
          title="Delete Conversation"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
    </>
  );
}
