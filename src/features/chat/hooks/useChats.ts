import { useQuery } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { searchConversations } from "@/lib/chat/searchConversation";
import { sortConversations } from "@/lib/chat/messageSorter";
import { Conversation } from "../types";
import { useState } from "react";

export function useChats() {
  const chatStore = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Wrapping state retrieval in useQuery for data fetching consistency
  const { data: conversations = [], isLoading, error } = useQuery<Conversation[], Error>({
    queryKey: ["conversations", chatStore.conversations],
    queryFn: async () => {
      // Simulate slight retrieval delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return chatStore.conversations;
    },
  });

  // Apply search filtering and sorting utilities
  const filteredConversations = searchConversations(conversations, searchQuery);
  const sortedConversations = sortConversations(filteredConversations);

  return {
    conversations: sortedConversations,
    isLoading,
    error: error ? error.message : null,
    searchQuery,
    setSearchQuery,
    activeChatId: chatStore.activeChatId,
    setActiveChatId: chatStore.setActiveChatId,
  };
}
