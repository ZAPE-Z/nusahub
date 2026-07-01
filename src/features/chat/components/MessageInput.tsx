"use client";

import React, { useState, FormEvent, KeyboardEvent } from "react";
import AttachmentButton from "./AttachmentButton";
import { SendHorizontal } from "lucide-react";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setText("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmed = text.trim();
      if (trimmed && !disabled) {
        onSend(trimmed);
        setText("");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 bg-surface border-t border-text-muted/10 shrink-0 w-full"
    >
      <AttachmentButton />

      <div className="flex-1 relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Tulis pesan..."
          className="w-full text-xs bg-background hover:bg-background/80 focus:bg-background text-text-primary placeholder-text-muted/70 rounded-md border border-text-muted/20 focus:border-primary focus:outline-none px-4 py-3 pr-10 transition-all disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-3 bg-primary text-white hover:bg-primary/95 disabled:bg-primary/40 disabled:cursor-not-allowed rounded-md active:scale-95 transition-all shrink-0 flex items-center justify-center"
        title="Send message"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
    </form>
  );
}
