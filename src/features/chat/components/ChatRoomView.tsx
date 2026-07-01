"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useConversation } from "../hooks/useConversation";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import DateDivider from "./DateDivider";
import CheckoutSheet from "@/components/shared/CheckoutSheet";
import { ProductRef, Message } from "../types";
import { formatFriendlyDate } from "@/lib/chat/dateFormatter";
import { CornerDownRight, X } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

interface ChatRoomViewProps {
  chatId: string;
}

export default function ChatRoomView({ chatId }: ChatRoomViewProps) {
  const { messages, isLoading, sendMessage } = useMessages(chatId);
  const { isTyping } = useConversation(chatId);
  const chatStore = useChatStore();
  const conversation = chatStore.conversations.find((c) => c.id === chatId);

  const [checkoutProduct, setCheckoutProduct] = useState<ProductRef | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [replyingMessage, setReplyingMessage] = useState<{ id: string; text: string; senderName: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom on initial load, new messages, or typing state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleBuyProduct = (product: ProductRef) => {
    setCheckoutProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleSend = (text: string) => {
    sendMessage({
      text,
      replyTo: replyingMessage || undefined
    });
    setReplyingMessage(null);
  };

  const handleReplyMessage = (msg: Message) => {
    const senderName = msg.senderId === "user-1" ? "You" : (conversation?.participant.name || "Partner");
    setReplyingMessage({
      id: msg.id,
      text: msg.text,
      senderName
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-4rem)] bg-background max-w-full relative">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-xs text-text-muted">
            Memuat percakapan...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-text-muted">
            Kirim pesan pertama untuk memulai obrolan.
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            {messages.map((msg, index) => {
              // Date divider logic: check if date differs from previous message
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const showDivider =
                !prevMsg ||
                formatFriendlyDate(msg.timestamp) !== formatFriendlyDate(prevMsg.timestamp);

              return (
                <React.Fragment key={msg.id}>
                  {showDivider && <DateDivider dateString={msg.timestamp} />}
                  <ChatBubble
                    message={msg}
                    isSelf={msg.senderId === "user-1"} // sender-1 is Budi
                    onBuyProduct={handleBuyProduct}
                    onReplyMessage={() => handleReplyMessage(msg)}
                  />
                </React.Fragment>
              );
            })}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Replying Banner Preview */}
      {replyingMessage && (
        <div className="flex items-center justify-between px-4 py-2 bg-primary/5 border-t border-text-muted/10 shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <CornerDownRight className="h-3.5 w-3.5 text-primary shrink-0 animate-bounce" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-primary block uppercase tracking-wider">
                Replying to {replyingMessage.senderName}
              </span>
              <p className="text-[10px] text-text-muted truncate mt-0.5">{replyingMessage.text}</p>
            </div>
          </div>
          <button
            onClick={() => setReplyingMessage(null)}
            className="p-1 rounded-full hover:bg-primary/10 text-text-muted shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Footer input form */}
      <MessageInput onSend={handleSend} disabled={isLoading} />

      {/* Shared Checkout Sheet Drawer */}
      {checkoutProduct && (
        <CheckoutSheet
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          product={checkoutProduct}
        />
      )}
    </div>
  );
}
