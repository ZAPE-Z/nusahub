"use client";

import React from "react";
import { SuggestedPrompt } from "../types";
import { Wallet, Briefcase, Sparkles } from "lucide-react";

interface SuggestionChipProps {
  prompt: SuggestedPrompt;
  onClick: () => void;
}

export default function SuggestionChip({ prompt, onClick }: SuggestionChipProps) {
  const getIcon = () => {
    switch (prompt.category) {
      case "wallet":
        return <Wallet className="h-3.5 w-3.5 text-secondary" />;
      case "workspace":
        return <Briefcase className="h-3.5 w-3.5 text-primary" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-primary/5 active:scale-95 border border-text-muted/15 rounded-full text-[11px] text-text-primary hover:border-primary/30 transition-all font-medium whitespace-nowrap shrink-0 shadow-low"
    >
      {getIcon()}
      <span>{prompt.text}</span>
    </button>
  );
}
