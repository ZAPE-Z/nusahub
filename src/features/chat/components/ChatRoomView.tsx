"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useConversation } from "../hooks/useConversation";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import DateDivider from "./DateDivider";
import CheckoutSheet from "@/components/shared/CheckoutSheet";
import { ProductRef } from "../types";
import { formatFriendlyDate } from "@/lib/chat/dateFormatter";

interface ChatRoomViewProps {
  chatId: string;
}

export default function ChatRoomView({ chatId }: ChatRoomViewProps) {
  const { messages, isLoading, sendMessage } = useMessages(chatId);
  const { isTyping } = useConversation(chatId);

  const [checkoutProduct, setCheckoutProduct] = useState<ProductRef | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-4rem)] bg-background max-w-full">
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
                  />
                </React.Fragment>
              );
            })}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

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
