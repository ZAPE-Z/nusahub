"use client";

import React, { useRef, useEffect, useState, FormEvent, KeyboardEvent } from "react";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { SUGGESTED_PROMPTS } from "../mock";
import SuggestionChip from "./SuggestionChip";
import PromptCard from "./PromptCard";
import AIResponseCard from "./AIResponseCard";
import { Bot, SendHorizontal, Trash2, Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/shared";

export default function AIChatView() {
  const { messages, isTyping, ask, clearHistory, regenerate } = useAIAssistant();
  const user = useAppStore((state) => state.user);
  
  const [inputText, setInputText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !isTyping) {
      ask(trimmed);
      setInputText("");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(inputText);
    }
  };

  const isThreadEmpty = messages.length <= 1; // Only contains init greeting
 
  return (
    <>
      {showConfirm && (
        <ConfirmationDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          title="Clear Conversation History"
          description="Are you sure you want to clear your AI chat history? All messages in this thread will be permanently deleted."
          confirmLabel="Clear Log"
          type="danger"
          onConfirm={() => {
            clearHistory();
            setShowConfirm(false);
          }}
        />
      )}
      <div className="flex flex-col h-[calc(100vh-3.5rem-4rem)] bg-background max-w-full">
        {/* Top action header */}
        <div className="px-4 py-2.5 bg-surface border-b border-text-muted/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
            <Sparkles className="h-4 w-4 animate-pulse text-secondary" />
            <span>Super AI Orchestrator</span>
          </div>
          {!isThreadEmpty && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1 text-[10px] text-text-muted hover:text-error transition-all font-semibold active:scale-95 border border-text-muted/15 rounded px-2 py-1 bg-background"
              title="Clear Log"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

      {/* Main chat viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col min-h-0 space-y-4">
        {messages.map((msg, index) => {
          if (msg.sender === "user") {
            // Render user bubble
            return (
              <div
                key={msg.id}
                className="flex items-start justify-end gap-2.5 my-1 max-w-[85%] self-end animate-[slideInRight_0.2s_ease-out]"
              >
                <div className="flex flex-col items-end">
                  <div className="rounded-lg rounded-tr-none p-3 bg-primary text-white text-xs leading-relaxed shadow-low break-words">
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-text-muted mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <Avatar className="h-8 w-8 border border-text-muted/10 shrink-0">
                  {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="Budi" />}
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </div>
            );
          } else {
            // Render AI card
            // Render the regenerate button only on the VERY LAST AI card in the feed
            const isLastAI =
              index === messages.length - 1 ||
              (index === messages.length - 2 && messages[messages.length - 1].sender === "user");

            return (
              <div
                key={msg.id}
                className="flex items-start gap-2.5 my-1 max-w-[85%] self-start animate-[slideInLeft_0.2s_ease-out]"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-low">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 flex flex-col">
                  <AIResponseCard
                    text={msg.text}
                    onRegenerate={isLastAI && index !== 0 ? regenerate : undefined}
                  />
                  <span className="text-[9px] text-text-muted mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          }
        })}

        {/* AI Typing loading placeholder state */}
        {isTyping && (
          <div className="flex items-start gap-2.5 my-1 max-w-[85%] self-start animate-pulse">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div className="rounded-lg rounded-bl-sm p-3.5 bg-surface border border-text-muted/10 text-text-primary shadow-low flex items-center gap-2 min-h-[38px]">
              <span className="text-[11px] text-text-muted font-medium">Nusa AI is orchestrating</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-[bounce_0.6s_infinite_delay-75]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-[bounce_0.6s_infinite_delay-150]" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-[bounce_0.6s_infinite_delay-300]" style={{ animationDelay: "0.3s" }} />
              </span>
            </div>
          </div>
        )}

        {/* Empty state: Display help guidelines */}
        {isThreadEmpty && <PromptCard onSelectPrompt={handleSend} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Horizontal Slider */}
      <div className="px-4 py-2 border-t border-text-muted/10 bg-surface shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <SuggestionChip
              key={prompt.id}
              prompt={prompt}
              onClick={() => handleSend(prompt.text)}
            />
          ))}
        </div>
      </div>

      {/* Input Message Container */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3 bg-surface border-t border-text-muted/10 shrink-0 w-full"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder="Ketik instruksi atau tanya Nusa AI..."
            className="w-full text-xs bg-background hover:bg-background/80 focus:bg-background text-text-primary placeholder-text-muted/70 rounded-md border border-text-muted/20 focus:border-primary focus:outline-none px-4 py-3 pr-10 transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-3 bg-primary text-white hover:bg-primary/95 disabled:bg-primary/40 disabled:cursor-not-allowed rounded-md active:scale-95 transition-all shrink-0 flex items-center justify-center"
          title="Send query"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </form>
    </div>
    </>
  );
}
