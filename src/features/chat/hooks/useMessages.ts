import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { Message } from "../types";
import { useEffect } from "react";

export function useMessages(chatId: string) {
  const queryClient = useQueryClient();
  const chatStore = useChatStore();

  const conversation = chatStore.conversations.find((c) => c.id === chatId);

  // Automatically mark messages as read when opening a conversation
  useEffect(() => {
    if (chatId) {
      chatStore.markAsRead(chatId);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  }, [chatId, chatStore, queryClient]);

  const messagesQuery = useQuery<Message[], Error>({
    queryKey: ["chat-messages", chatId, conversation?.messages],
    queryFn: async () => {
      return conversation?.messages || [];
    },
  });

  const sendMutation = useMutation<void, Error, string>({
    mutationFn: async (text) => {
      // Send active user Budi's message immediately (senderId: "user-1")
      chatStore.sendMessage(chatId, text, "user-1");
    },
    onSuccess: (_, text) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });

      // Trigger partner automated reply simulation
      simulatePartnerReply(text);
    },
  });

  const simulatePartnerReply = (userText: string) => {
    if (!conversation) return;

    const pName = conversation.participant.name;
    const pId = conversation.participant.id;
    const cleanText = userText.toLowerCase();

    // Determine replies contextually
    let replyText = "";
    if (pId === "user-2") {
      // Ibu Sri (Merchant)
      if (cleanText.includes("tempeh") || cleanText.includes("crisps") || cleanText.includes("tempe") || cleanText.includes("kripik")) {
        replyText = "Iya Budi, keripik tempe kami sangat renyah dan gurih! Diproduksi higienis setiap hari. Silakan klik tombol 'Buy' pada produk jika berminat ya.";
      } else if (cleanText.includes("price") || cleanText.includes("harga") || cleanText.includes("berapa")) {
        replyText = "Harganya Rp 15.000 saja per kotak Budi, sangat bersahabat untuk kualitas premium.";
      } else {
        replyText = `Terima kasih pesan Anda, Budi! Silakan beri tahu saya jika ada hal lain yang bisa kami bantu mengenai pengiriman atau detail produk.`;
      }
    } else if (pId === "user-3") {
      // Andi Wijaya (Creator)
      if (cleanText.includes("vector") || cleanText.includes("illustration") || cleanText.includes("desain") || cleanText.includes("design") || cleanText.includes("aset")) {
        replyText = "Terima kasih dukungannya Budi! Set ilustrasi vektor warm cream ini berisi 25+ berkas format SVG dan PNG resolusi tinggi.";
      } else {
        replyText = "Mantap Budi! Nanti kalau butuh format file lain seperti AI atau EPS, beritahu saya saja ya.";
      }
    } else {
      replyText = `Hi Budi! I received your message. Let's build a great product together!`;
    }

    // Phase 1: Typing state simulation start after 1000ms
    setTimeout(() => {
      chatStore.setTyping(chatId, true);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // Phase 2: Send reply after another 1500ms
      setTimeout(() => {
        chatStore.setTyping(chatId, false);
        chatStore.sendMessage(chatId, replyText, pId);
        queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }, 1500);
    }, 1000);
  };

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    sendMessage: sendMutation.mutate,
    isSending: sendMutation.isPending,
  };
}
