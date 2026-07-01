import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { useToast } from "@/store/useToastStore";

export function useConversation(chatId: string) {
  const queryClient = useQueryClient();
  const chatStore = useChatStore();
  const { toast } = useToast();

  const conversation = chatStore.conversations.find((c) => c.id === chatId);

  const pinMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      // Simulate remote network latency
      await new Promise((resolve) => setTimeout(resolve, 200));
      chatStore.togglePin(chatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      const pinState = chatStore.conversations.find((c) => c.id === chatId)?.isPinned;
      toast(
        pinState ? "Conversation Pinned" : "Conversation Unpinned",
        `Chat with ${conversation?.participant.name || "user"} updated`,
        "default"
      );
    },
  });

  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      chatStore.deleteConversation(chatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast("Chat Deleted", "The message log has been wiped.", "default");
    },
  });

  return {
    conversation,
    isPinned: conversation?.isPinned || false,
    isTyping: conversation?.isTyping || false,
    pin: pinMutation.mutate,
    isPinning: pinMutation.isPending,
    deleteChat: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
