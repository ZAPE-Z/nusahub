"use client";

import React from "react";
import { Message, ProductRef } from "../types";
import { formatMessageText } from "@/lib/chat/messageFormatter";
import { formatShortTime } from "@/lib/chat/dateFormatter";
import { CheckCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: Message;
  isSelf: boolean;
  onBuyProduct?: (product: ProductRef) => void;
  onReplyMessage?: () => void;
}

export default function ChatBubble({
  message,
  isSelf,
  onBuyProduct,
  onReplyMessage,
}: ChatBubbleProps) {
  const timeStr = formatShortTime(message.timestamp);

  const renderMessageText = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (/^https?:\/\//.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "underline break-all hover:opacity-80 transition-opacity",
              isSelf ? "text-white font-semibold" : "text-secondary"
            )}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[75%] my-1.5",
        isSelf ? "self-end items-end animate-[slideInRight_0.2s_ease-out]" : "self-start items-start animate-[slideInLeft_0.2s_ease-out]"
      )}
    >
      {/* Text Bubble */}
      <div
        className={cn(
          "rounded-lg p-3 text-xs leading-relaxed shadow-low break-words",
          isSelf
            ? "bg-primary text-white rounded-br-none"
            : "bg-text-muted/10 text-text-primary rounded-bl-none"
        )}
      >
        {/* Render replied-to message preview */}
        {message.replyTo && (
          <div className={cn(
            "mb-2 p-2 text-[10px] leading-snug border-l-2 rounded select-none",
            isSelf ? "bg-white/15 border-white/50 text-white/80" : "bg-black/5 border-primary/40 text-text-primary/70"
          )}>
            <span className={cn("font-bold block", isSelf ? "text-white" : "text-primary")}>
              {message.replyTo.senderName}
            </span>
            <p className="truncate mt-0.5">{message.replyTo.text}</p>
          </div>
        )}

        <div className="space-y-1 whitespace-pre-wrap">
          {renderMessageText(message.text)}
        </div>

        {/* Embedded product card inside the bubble */}
        {message.productRef && (
          <div className="mt-3 p-2 bg-surface text-text-primary border border-text-muted/10 rounded-md flex flex-col gap-2 w-56">
            {message.productRef.imageUrl && (
              <img
                src={message.productRef.imageUrl}
                alt={message.productRef.title}
                className="w-full h-28 object-cover rounded-md border border-text-muted/5"
              />
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[11px] truncate text-text-primary">
                {message.productRef.title}
              </span>
              <span className="text-[11px] text-secondary font-semibold mt-0.5">
                Rp {message.productRef.price.toLocaleString("id-ID")}
              </span>
            </div>
            {onBuyProduct && (
              <Button
                onClick={() => onBuyProduct(message.productRef!)}
                size="sm"
                className="w-full h-8 text-[10px] flex items-center justify-center gap-1 mt-1 font-semibold shadow-low"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Buy Now</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Message Footer Status & Timestamp */}
      <div className="flex items-center gap-1.5 text-[9px] text-text-muted px-1 mt-0.5 select-none">
        <span>{timeStr}</span>
        {onReplyMessage && (
          <button
            onClick={onReplyMessage}
            className="hover:text-primary active:scale-95 transition-all text-text-muted/80 font-semibold"
          >
            • Reply
          </button>
        )}
        {isSelf && (
          <CheckCheck
            className={cn(
              "h-3 w-3",
              message.isRead ? "text-primary font-bold" : "text-text-muted/60"
            )}
          />
        )}
      </div>
    </div>
  );
}
