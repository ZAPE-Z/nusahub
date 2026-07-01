"use client";

import React from "react";
import { useChats } from "../hooks/useChats";
import ConversationCard from "./ConversationCard";
import { EmptySearch, EmptyConversation } from "@/components/shared/EmptyStates";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function ChatsListView() {
  const {
    conversations,
    searchQuery,
    setSearchQuery,
    activeChatId,
    setActiveChatId,
  } = useChats();

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col h-full bg-background pb-20 animate-fade-in">
      {/* Search Input Bar Container */}
      <div className="p-3 bg-surface border-b border-text-muted/10 sticky top-0 z-10">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-text-muted/60" />
          <Input
            type="text"
            placeholder="Cari kontak atau pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-9 bg-background focus-visible:ring-primary border-text-muted/20"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 p-0.5 rounded-full hover:bg-background text-text-muted hover:text-text-primary transition-colors active:scale-90"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Conversations Grid List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {conversations.length === 0 ? (
          searchQuery ? (
            <EmptySearch
              description={`We couldn't find any message or participant matching "${searchQuery}".`}
              actionLabel="Clear search"
              onAction={handleClear}
            />
          ) : (
            <EmptyConversation />
          )
        ) : (
          conversations.map((conv) => (
            <ConversationCard
              key={conv.id}
              conversation={conv}
              isActive={activeChatId === conv.id}
              onSelect={() => setActiveChatId(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
