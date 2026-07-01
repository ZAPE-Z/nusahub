import { create } from "zustand";
import { Conversation, Message } from "@/features/chat/types";
import { MOCK_CONVERSATIONS } from "@/features/chat/mock";

interface ChatState {
  conversations: Conversation[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (
    chatId: string,
    text: string,
    senderId: string,
    productRef?: any
  ) => void;
  togglePin: (chatId: string) => void;
  deleteConversation: (chatId: string) => void;
  markAsRead: (chatId: string) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: MOCK_CONVERSATIONS,
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
  sendMessage: (chatId, text, senderId, productRef) => set((state) => {
    const updatedConversations = state.conversations.map((conv) => {
      if (conv.id === chatId) {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId,
          text,
          timestamp: new Date().toISOString(),
          isRead: senderId === "user-1", // Read if sent by active user Budi
          productRef,
        };
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
        };
      }
      return conv;
    });
    return { conversations: updatedConversations };
  }),
  togglePin: (chatId) => set((state) => ({
    conversations: state.conversations.map((conv) =>
      conv.id === chatId ? { ...conv, isPinned: !conv.isPinned } : conv
    ),
  })),
  deleteConversation: (chatId) => set((state) => ({
    conversations: state.conversations.filter((conv) => conv.id !== chatId),
    activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
  })),
  markAsRead: (chatId) => set((state) => ({
    conversations: state.conversations.map((conv) => {
      if (conv.id === chatId) {
        return {
          ...conv,
          messages: conv.messages.map((msg) => ({ ...msg, isRead: true })),
        };
      }
      return conv;
    }),
  })),
  setTyping: (chatId, isTyping) => set((state) => ({
    conversations: state.conversations.map((conv) =>
      conv.id === chatId ? { ...conv, isTyping } : conv
    ),
  })),
}));
