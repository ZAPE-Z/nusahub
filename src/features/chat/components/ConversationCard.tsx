"use client";

import React from "react";
import { Conversation } from "../types";
import { useConversation } from "../hooks/useConversation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UnreadBadge from "./UnreadBadge";
import { Pin, Trash } from "lucide-react";
import { formatShortTime } from "@/lib/chat/dateFormatter";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/shared";

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
}

function ConversationCard({
  conversation,
  isActive,
  onSelect,
}: ConversationCardProps) {
  const { participant, messages } = conversation;
  const { isPinned, pin, deleteChat } = useConversation(conversation.id);

  const [showConfirm, setShowConfirm] = React.useState(false);

  const lastMessage = messages[messages.length - 1];
  const unreadCount = messages.filter((m) => !m.isRead && m.senderId !== "user-1").length;

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    pin();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  return (
    <>
      {showConfirm && (
        <ConfirmationDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          title="Delete Conversation"
          description={`Are you sure you want to delete your conversation with ${participant.name}? This will clear all messages permanently.`}
          confirmLabel="Delete Conversation"
          type="danger"
          onConfirm={() => {
            deleteChat();
            setShowConfirm(false);
          }}
        />
      )}
      <div
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border border-transparent shadow-low select-none relative group active:scale-[0.99] hover:bg-primary/5",
        isActive ? "bg-primary/10 border-primary/20" : "bg-surface hover:border-text-muted/10"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11 border border-text-muted/10">
          <AvatarImage src={participant.avatarUrl} alt={participant.name} />
          <AvatarFallback>{participant.name[0]}</AvatarFallback>
        </Avatar>
        {participant.capabilities?.merchant === "active" && (
          <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-[9px] px-1 font-bold rounded-md uppercase scale-90 border border-surface shadow-low">
            Toko
          </span>
        )}
        {participant.capabilities?.creator === "active" && (
          <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] px-1 font-bold rounded-md uppercase scale-90 border border-surface shadow-low">
            Creator
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h4 className="font-semibold text-xs text-text-primary truncate">
            {participant.name}
          </h4>
          <span className="text-[10px] text-text-muted shrink-0">
            {lastMessage ? formatShortTime(lastMessage.timestamp) : ""}
          </span>
        </div>

        <p className="text-xs text-text-muted truncate leading-relaxed">
          {conversation.isTyping ? (
            <span className="text-primary italic animate-pulse font-medium">Typing...</span>
          ) : lastMessage ? (
            lastMessage.text
          ) : (
            "No messages yet"
          )}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-1">
        {isPinned && <Pin className="h-3.5 w-3.5 text-secondary fill-secondary rotate-45" />}
        <UnreadBadge count={unreadCount} />
      </div>

      {/* Hover action bar */}
      <div className="absolute right-2 bottom-2 hidden group-hover:flex items-center gap-1 bg-surface p-1 rounded-md border shadow-medium">
        <button
          onClick={handlePinClick}
          aria-label={isPinned ? "Unpin chat" : "Pin chat"}
          className="p-1 text-text-muted hover:text-secondary rounded hover:bg-background transition-colors"
          title={isPinned ? "Unpin chat" : "Pin chat"}
        >
          <Pin className={cn("h-3.5 w-3.5", isPinned && "fill-secondary text-secondary")} />
        </button>
        <button
          onClick={handleDeleteClick}
          aria-label="Delete chat"
          className="p-1 text-text-muted hover:text-error rounded hover:bg-background transition-colors"
          title="Delete chat"
        >
          <Trash className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
    </>
  );
}

export default React.memo(ConversationCard);
